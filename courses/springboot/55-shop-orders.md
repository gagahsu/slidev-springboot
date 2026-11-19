---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題（五）：訂單與模擬付款
routeAlias: ch55
style: |
  .slidev-layout p,
  .slidev-layout li,
  .slidev-layout td,
  .slidev-layout th,
  .slidev-layout div {
    font-size: max(16px, 1em);
  }
  table {
    width: 100%;
    margin: 1rem 0;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px !important;
    border: 1px solid #e2e8f0 !important;
  }
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 2.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    專題（五）<br>訂單與模擬付款
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「收據開出去就不能改，最後一包豆子只能賣一次」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
歡迎來到第五十五章，訂單。這是整個專題最核心的一章。

建立訂單看起來只是存一筆資料，背後卻要同時做好幾件事：扣庫存、算金額、抄快照、清空購物車。任何一步出錯，前面做過的都要復原。還有兩個人同時搶最後一件的問題。我們一件一件來。
-->

---

# 今天要完成的事

<v-clicks>

- `POST /api/orders`：用購物車建立訂單（交易、防超賣、金額重算、快照）
- `GET /api/orders`、`/{orderNo}`：我的訂單（只能看自己的）
- `POST /api/orders/{orderNo}/cancel`：取消，庫存加回去
- 排程：**30 分鐘沒付款自動取消**
- `POST /api/orders/{orderNo}/payments/mock`：開發用的模擬付款

</v-clicks>

<!--
今天要完成五件事。

（下一步）建立訂單，最重要的一支 API。

（下一步）查詢我的訂單，只能看到自己的。

（下一步）取消未付款的訂單，庫存要加回去。

（下一步）排程：下單三十分鐘還沒付款，自動取消，不然庫存會一直被卡住。

（下一步）模擬付款。下一章才接綠界，今天先用模擬付款，把整個流程跑通。
-->

---

# 故事：結帳櫃台

<v-clicks>

- 店員從籃子裡**一樣一樣拿出來**，每拿一樣就從架上扣掉一包
- 拿到第三樣發現**架上沒了** → 前兩樣**放回架上**，告訴客人哪一樣缺貨
- 都拿到了，**照今天的價目表重新算錢**，客人自己寫的金額不算數
- 開一張**收據**：品名、包裝、單價都抄上去，以後漲價也不影響
- 收據有狀態：待付款 → 已付款 → 已出貨 → 已完成；**不能跳、不能倒退**

</v-clicks>

<!--
用結帳櫃台來想。

（下一步）店員從籃子裡一樣一樣拿出來，每拿一樣，就從架上扣掉一包。

（下一步）拿到第三樣，發現架上沒了。這時候要把前兩樣放回架上，告訴客人哪一樣缺貨。不能前兩樣賣了、第三樣說抱歉。

（下一步）都拿到了，照今天的價目表重新算錢。客人在紙上自己寫的金額，不算數。

（下一步）開一張收據，品名、包裝、單價都抄上去，以後就算漲價也不影響這張收據。

（下一步）收據有狀態，只能照順序往前走。
-->

---

# 對應到程式

<Pairs left="結帳櫃台" right="程式" rows="staff,一樣一樣從架上扣=code,一句 UPDATE：庫存 ≥ 數量才扣|no,缺貨就全部放回去=code,@Transactional：丟出例外 → rollback|doc,照今天的價目表算=code,金額一律由後端用資料庫的價格算|form,抄進收據=code,order_items 的快照欄位|ok,收據的狀態=code,OrderStatus.canChangeTo()" />

<!--
對應到程式。

（下一步）一樣一樣從架上扣，是一句帶條件的 UPDATE：庫存夠才扣。

（下一步）缺貨就全部放回去，是第三十三章的 @Transactional，丟出例外就整個復原。

（下一步）照今天的價目表算，是金額一律由後端算。

（下一步）抄進收據，是訂單明細的快照欄位。

（下一步）收據的狀態，是第一章寫好的 OrderStatus 的 canChangeTo。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 防超賣

<!--
先解決最難的問題：超賣。
-->

---

# 兩個人搶最後一件

<div class="grid grid-cols-2 gap-6">
<div>

**錯誤的寫法：先查再扣**

```java
ProductVariant v = repo.findById(7).get();
if (v.getStock() >= 1) {          // A、B 都看到 1
    v.setStock(v.getStock() - 1); // 都改成 0
    repo.save(v);                 // 都成功！
}
```

</div>
<div>

**正確的寫法：一句 SQL 檢查 + 扣**

```java
@Modifying
@Query("""
  UPDATE ProductVariant v
  SET v.stock = v.stock - :qty
  WHERE v.id = :id AND v.stock >= :qty
  """)
int decreaseStock(@Param("id") Integer id,
                  @Param("qty") int qty);
```

</div>
</div>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 MySQL 一次只讓一個人改同一列。後到的人執行時庫存已經是 0，<code>WHERE</code> 不成立，影響筆數是 <b>0</b>。
</div>

</v-click>

<!--
第三十四章講過兩個學生搶最後一個座位，這裡是兩個客人搶最後一包豆子。

左邊是錯誤的寫法：先查庫存，夠了再扣。A 和 B 幾乎同時查，都看到剩一包，都改成 0，都存檔成功。一包豆子賣了兩次。

右邊是正確的寫法：檢查和扣庫存寫在同一句 UPDATE 裡，條件是庫存大於等於要買的數量。回傳值是影響的筆數。

（下一步）MySQL 一次只讓一個人改同一列。先到的人扣成 0；後到的人執行時，庫存已經是 0，WHERE 不成立，影響筆數是 0，我們就知道庫存不夠了。
-->

---

# 建立訂單：先抄、再扣、再存

```java {all|1-2|4-7|9-14|all}
@Transactional
public OrderDetailVO create(String email, CheckoutRequest req) {
    // …取出購物車；空的就丟例外；把每一項抄成 Line（名稱、單價、數量）
    for (Line line : lines) {
        if (!line.onSale()) throw new BizException(RspCode.PARAM_ERROR, line.productName() + " 已下架");
        if (variantRepository.decreaseStock(line.variantId(), line.quantity()) == 0) {
            throw new BizException(RspCode.STOCK_NOT_ENOUGH, line.productName() + " 庫存不足");
        }
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setProductName(line.productName());   // 快照
        item.setVariantName(line.variantName());
        item.setUnitPrice(line.unitPrice());
        item.setSubtotal(line.unitPrice() * line.quantity());
        order.getItems().add(item);
        itemsAmount += item.getSubtotal();
    }
    // …算運費、存訂單、清空購物車
}
```

<!--
建立訂單的 Service。

（下一步）整個方法包在 @Transactional 裡。

（下一步）逐一處理購物車的每一項。商品下架了，丟例外；扣庫存，影響筆數是 0，也丟例外。只要丟出例外，前面已經扣掉的庫存，會隨著交易一起復原。

（下一步）扣成功了，就建立明細，把名稱、規格、單價抄進去，這就是快照。

（下一步）全部成功，才算運費、存訂單、清空購物車。這些動作要嘛全部成功，要嘛全部沒發生。
-->

---

# 金額：不相信前端

```java
// 前端送來的 Body 只有收件資料
public record CheckoutRequest(String receiverName, String receiverPhone,
                              String receiverAddress, String note) {}

int fee = ShippingPolicy.fee(itemsAmount);
order.setItemsAmount(itemsAmount);
order.setShippingFee(fee);
order.setTotalAmount(itemsAmount + fee);
```

<v-click>

```json
POST /api/orders
{ "receiverName": "陳大文", "receiverPhone": "0933555666", "receiverAddress": "台中市西區",
  "itemsAmount": 1, "totalAmount": 1 }          ← 竄改的金額被忽略，訂單還是 1,010 元
```

</v-click>

<!--
金額不相信前端。

CheckoutRequest 只有收件資料，根本沒有金額欄位。金額由後端用資料庫的價格算，運費一樣用 ShippingPolicy。

（下一步）有人用 Postman 在 Body 裡塞了 totalAmount 等於 1，想用一塊錢買東西。DTO 沒有這個欄位，直接被忽略，訂單還是一千零一十元。
-->

---

# 想一想

<Poll question="購物車有三樣商品，前兩樣扣庫存成功，第三樣庫存不足丟出 BizException。前兩樣的庫存會怎樣？" options="已經扣掉了，要手動加回去|因為 @Transactional，隨著交易 rollback 一起復原|只復原第二樣|資料庫壞掉" answer="2" />

<!--
想一想。前兩樣扣成功，第三樣不足，前兩樣的庫存會怎樣？

會一起復原。BizException 是 RuntimeException，@Transactional 遇到它會 rollback，同一個交易裡做過的 UPDATE 全部取消。這就是為什麼整個建立訂單要包在同一個交易裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 狀態、取消與逾時

<!--
接下來處理訂單的狀態。
-->

---

# 只能看自己的訂單

```java
public Order findOwn(String email, String orderNo) {
    Order order = orderRepository.findByOrderNo(orderNo)
            .orElseThrow(() -> new BizException(RspCode.NOT_FOUND, "找不到這張訂單"));
    if (!order.getUserId().equals(userService.current(email).getId())) {
        throw new BizException(RspCode.NOT_FOUND, "找不到這張訂單");   // 不說「這是別人的」
    }
    return order;
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 別人的訂單一律回 <b>404</b>，不回 403：不讓壞人知道這個訂單編號存在。
</div>

</v-click>

<!--
查詢、取消、付款，都要先確認是自己的訂單。

用訂單編號找到訂單之後，比對訂單的會員和 JWT 裡的會員。不一樣，就當作找不到。

（下一步）注意回的是 404，不是 403。回 403 等於告訴壞人：這個訂單編號是存在的，只是不是你的。
-->

---

# 取消：狀態檢查 + 庫存加回去

```java {all|2|3-4|5-7}
public void cancel(Order order, String reason) {
    changeStatus(order, OrderStatus.CANCELLED);       // 不合規則 → ORDER_STATUS_ERROR
    order.setCancelledAt(LocalDateTime.now());
    order.setCancelReason(reason);
    for (OrderItem item : order.getItems()) {
        variantRepository.increaseStock(item.getVariantId(), item.getQuantity());
    }
}
```

<v-clicks>

- 客人取消：只有**待付款**可以
- 已付款的取消由**管理員**做（第 7 章），需要人工退款

</v-clicks>

<!--
取消訂單。

（下一步）先改狀態，changeStatus 會問 OrderStatus 能不能改；不能就丟出訂單狀態錯誤。

（下一步）記下取消的時間和原因。

（下一步）把明細的數量加回庫存。用的是明細裡的規格編號，這就是為什麼明細除了快照，還要留 variant_id。

（下一步）客人自己只能取消待付款的訂單。

（下一步）已付款的訂單要退款，由管理員在後台取消，第七章再做。
-->

---

# 逾時取消：排程（第 44 章）

```java
@Component
public class OrderTimeoutScheduler {
    @Autowired private OrderService orderService;

    @Scheduled(fixedDelay = 60_000)                 // 每分鐘
    public void cancelExpiredOrders() {
        int count = orderService.cancelExpired();
    }
}

// OrderService
@Transactional
public int cancelExpired() {
    LocalDateTime deadline = LocalDateTime.now().minusMinutes(30);
    List<Order> expired = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING_PAYMENT, deadline);
    expired.forEach(o -> cancel(o, "付款逾時，系統自動取消"));
    return expired.size();
}
```

<!--
逾時取消用第四十四章的排程。

排程類別每分鐘執行一次，fixedDelay 表示上一次做完、隔一分鐘再做。排程不碰 Repository，交給 Service 處理，這是第四十四章的規矩。

Service 找出待付款、而且建立時間早於三十分鐘前的訂單，一張一張取消，庫存加回去。主程式記得加 @EnableScheduling。

測試的時候不用真的等三十分鐘：用 SQL 把某張訂單的 created_at 改成三十一分鐘前，一分鐘內就會被取消。
-->

---

# 模擬付款：只在開發環境

```java
@Profile("dev")
@RestController
@RequestMapping("/api/orders")
public class MockPaymentController {
    @PostMapping("/{orderNo}/payments/mock")
    public AppResponse<OrderDetailVO> mockPay(@PathVariable("orderNo") String orderNo, Authentication auth) {
        return AppResponse.success(paymentService.mockPay(auth.getName(), orderNo));
    }
}
```

<v-clicks>

- `@Profile("dev")`：只有 dev 環境才建立這個 Controller，正式環境**根本沒有這支 API**
- `application.properties`：`spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}`
- 模擬付款也新增一筆 `payments`（`provider = MOCK`），把訂單改成已付款

</v-clicks>

<!--
最後是模擬付款，方便我們在接綠界之前，先把整個流程跑通。

（下一步）@Profile dev 表示只有 dev 環境才會建立這個 Controller。正式環境沒有這支 API，就不可能有人用它免費買東西。

（下一步）設定檔預設是 dev，部署的時候把環境變數改成 prod 就好。

（下一步）模擬付款跟真的付款走同樣的路：新增一筆付款紀錄，provider 是 MOCK，再把訂單改成已付款。
-->

---

# 驗證：搶最後一件

```bash
# 王小明、林美玲的購物車都放了「轉角特調 一磅 / 不研磨」（庫存 1），同時送出
curl -X POST /api/orders -H "Authorization: Bearer $U1" … &
curl -X POST /api/orders -H "Authorization: Bearer $U2" … &
```

```json
{ "code": 200, "message": "操作成功", "data": { "orderNo": "CS261119255635", … } }
{ "code": 409, "message": "轉角特調 一磅 / 不研磨 庫存不足", "data": null }
```

<!--
最後驗證搶最後一件。兩個會員的購物車都放了庫存只剩一包的轉角特調，用兩個 curl 在背景同時送出。

結果一個成功、一個收到 409 庫存不足，資料庫的庫存是 0，不是負一。這就是規格書驗收清單的「兩個瀏覽器同時搶最後一件，只有一個成功」。
-->

---

# 重點回顧

<Pairs left="結帳櫃台" right="程式" rows="staff,一樣一樣從架上扣=code,條件式 UPDATE，看影響筆數|no,缺貨就全部放回去=code,@Transactional rollback|doc,照今天的價目表算=code,DTO 沒有金額欄位，後端重算|form,收據=code,明細快照 + 只能看自己的|ok,收據的狀態=code,canChangeTo、取消回補、逾時排程" />

<!--
回顧。

（下一步）一樣一樣從架上扣，是條件式 UPDATE，看影響筆數。

（下一步）缺貨就全部放回去，是交易的 rollback。

（下一步）照今天的價目表算，DTO 沒有金額欄位，後端重算。

（下一步）收據是明細快照，而且只能看自己的。

（下一步）收據的狀態，有規則、取消要回補庫存、逾時由排程取消。
-->

---

# 小結

<v-clicks>

- 建立訂單：一個交易裡做完扣庫存、快照、算錢、清購物車
- 防超賣：`UPDATE … WHERE stock >= ?`，影響 0 筆就是不夠
- 狀態只能照規則走；取消回補庫存；30 分鐘逾時自動取消
- **練習**：寫一個測試，連續建立訂單直到某個規格賣完，確認庫存不會變成負數

</v-clicks>

<!--
小結。

（下一步）建立訂單在一個交易裡做完所有事。

（下一步）防超賣靠一句帶條件的 UPDATE。

（下一步）狀態只能照規則走，取消回補庫存，逾時自動取消。

（下一步）練習：連續建立訂單，直到某個規格賣完，確認庫存最低是 0，不會變成負數。下一章，接上綠界，真的付款。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
