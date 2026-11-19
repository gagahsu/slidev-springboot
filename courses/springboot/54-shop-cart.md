---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題（四）：購物車
routeAlias: ch54
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
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    專題（四）<br>購物車
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「先記在口袋的小紙條，登入後放進店裡的籃子」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
歡迎來到第五十四章，購物車。

購物車看起來簡單，其實有不少細節：還沒登入的客人也能放東西、登入後要合併、數量有上限、不能超過庫存，還要算運費。
-->

---

# 今天要完成的事

<v-clicks>

- `GET /api/cart`：看購物車，用**現在的價格**算小計與運費
- `POST /api/cart/items`：加入，同一個規格數量相加
- `PUT`、`DELETE /api/cart/items/{variantId}`：改數量、刪除
- `POST /api/cart/merge`：登入後把瀏覽器裡的購物車合併進來

</v-clicks>

<!--
今天要完成四支 API。

（下一步）看購物車，小計和運費用現在的價格算。

（下一步）加入購物車，同一個規格再加一次是數量相加。

（下一步）改數量和刪除，路徑用規格編號。

（下一步）合併：還沒登入時放的東西，登入後合併到資料庫。
-->

---

# 故事：小紙條與購物籃

<v-clicks>

- 還沒辦會員的客人逛街，把想買的寫在**口袋裡的小紙條**
- 辦了會員之後，店員把紙條上的東西放進**店裡幫你保管的購物籃**，紙條丟掉
- 籃子裡已經有的，**數量加上去**；但一樣東西最多 10 個，也不能超過架上剩下的
- 籃子上的價錢標籤，**每次都看今天的價目表**

</v-clicks>

<!--
用逛街來想。

（下一步）還沒辦會員的客人，把想買的東西寫在口袋的小紙條上。

（下一步）辦了會員，店員把紙條上的東西放進店裡幫你保管的購物籃，紙條就可以丟了。之後換一台電腦、換手機，籃子都還在。

（下一步）籃子裡已經有的東西，數量加上去。但一樣東西最多十個，也不能超過架上剩下的數量。

（下一步）籃子上的價錢，每次都看今天的價目表。昨天放進去的時候是三百八，今天漲價了，就是新的價錢。
-->

---

# 對應到程式

<Pairs left="逛街" right="程式" rows="paper,口袋裡的小紙條=browser,瀏覽器的 localStorage（前端負責）|cup,店裡保管的購物籃=cabinet,cart_items 表（user_id + variant_id 唯一）|staff,把紙條放進籃子=code,POST /api/cart/merge|no,最多 10 個、不超過庫存=code,checkQuantity()|doc,每次看今天的價目表=code,CartVO 用規格現在的 price 計算" />

<!--
對應到程式。

（下一步）口袋裡的小紙條，是瀏覽器的 localStorage，這部分是前端負責。

（下一步）店裡保管的購物籃，是 cart_items 表。同一個會員、同一個規格只有一筆。

（下一步）把紙條放進籃子，是 merge 這支 API。

（下一步）最多十個、不超過庫存，寫在 checkQuantity 方法。

（下一步）每次看今天的價目表：購物車不存價格，回傳時才用規格現在的價格算。
-->

---

# 想一想

<Poll question="購物車的資料表 cart_items 裡，為什麼不存「加入當時的價格」？" options="忘記了|價格可能變，結帳要用現在的價格；購物車只是還沒成立的訂單|資料表放不下|MySQL 不支援" answer="2" />

<!--
想一想。購物車為什麼不存加入當時的價格？

因為購物車還不是訂單，價格可能會變。真正成立訂單的那一刻，才把價格抄進訂單明細，那才是快照。購物車如果存價格，客人可能用一個月前的特價結帳。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 加入購物車

<!--
先做加入購物車。
-->

---

# 加入：同一個規格數量相加

```java {all|3|4|5-6|7-12}
@Transactional
public CartVO add(String email, CartItemRequest req) {
    Integer userId = userService.current(email).getId();
    ProductVariant v = findSellable(req.variantId());          // 存在、而且上架中
    CartItem item = cartItemRepository.findByUserIdAndVariantId(userId, v.getId()).orElse(null);
    int quantity = req.quantity() + (item == null ? 0 : item.getQuantity());
    checkQuantity(v, quantity);
    if (item == null) {
        item = new CartItem();
        item.setUserId(userId);
        item.setVariant(v);
    }
    item.setQuantity(quantity);
    cartItemRepository.save(item);
    return get(email);
}
```

<!--
加入購物車的 Service。

（下一步）會員是誰，從 JWT 的 email 找，上一章說過。

（下一步）規格要存在，而且商品是上架中，下架的商品不能加。

（下一步）查看看購物車裡有沒有這個規格，有的話，數量加上原本的。

（下一步）檢查數量，再決定是新增一筆，還是更新原本那筆。最後回傳整個購物車，前端拿來直接更新畫面，不用再查一次。
-->

---

# 數量的兩道限制

```java {all|2-4|5-7}
private void checkQuantity(ProductVariant v, int quantity) {
    if (quantity > MAX_QUANTITY) {                         // 10
        throw new BizException(RspCode.PARAM_ERROR, "每個規格最多 10 件");
    }
    if (quantity > v.getStock()) {
        throw new BizException(RspCode.STOCK_NOT_ENOUGH, "庫存不足，剩 " + v.getStock() + " 件");
    }
}
```

<v-clicks>

- 錯誤訊息直接告訴客人**還剩幾件**，前端照樣顯示
- 這裡只是**提醒**，還沒扣庫存：真正的檢查在建立訂單的時候（下一章）

</v-clicks>

<!--
數量有兩道限制。

（下一步）每個規格最多十件，這是店家的規則。

（下一步）不能超過庫存。

（下一步）錯誤訊息直接告訴客人還剩幾件，前端顯示出來，客人就知道要改成多少。

（下一步）注意，加入購物車的時候並沒有扣庫存，這裡的檢查只是提醒。你加進購物車的時候還有一件，結帳的時候可能已經被別人買走了。真正的把關在建立訂單的時候，下一章會講。
-->

---

# 回傳的購物車：價格、小計、運費

```java {all|3-6|8-10}
private CartVO toVO(List<CartItem> items) {
    List<CartItemVO> list = items.stream().map(i -> {
        ProductVariant v = i.getVariant();
        return new CartItemVO(v.getId(), v.getProduct().getId(), v.getProduct().getName(), v.getName(),
                v.getProduct().getImageUrl(), v.getPrice(), v.getStock(), i.getQuantity(),
                v.getPrice() * i.getQuantity());
    }).toList();
    int itemsAmount = list.stream().mapToInt(CartItemVO::subtotal).sum();
    int fee = ShippingPolicy.fee(itemsAmount);              // 滿 1,000 免運，否則 80
    return new CartVO(list, itemsAmount, fee, itemsAmount + fee, ShippingPolicy.freeShippingGap(itemsAmount));
}
```

<!--
回傳的購物車。

（下一步）每一項都用規格現在的價格算小計，同時回傳目前的庫存，前端可以提醒「只剩幾件」。

（下一步）把小計加起來，算運費。運費規則寫在 ShippingPolicy 這個類別：滿一千免運，否則八十元。freeShippingGap 是還差多少免運，前端可以顯示「再買 240 元免運」。
-->

---

# ShippingPolicy：規則集中一個地方

```java
public final class ShippingPolicy {
    public static final int FREE_THRESHOLD = 1000;
    public static final int FEE = 80;

    public static int fee(int itemsAmount) {
        return (itemsAmount == 0 || itemsAmount >= FREE_THRESHOLD) ? 0 : FEE;
    }
    public static int freeShippingGap(int itemsAmount) {
        return Math.max(FREE_THRESHOLD - itemsAmount, 0);
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 購物車和建立訂單都用它。哪天老闆說「改成滿 800 免運」，只改一個數字。
</div>

</v-click>

<!--
運費規則獨立成一個類別。購物車沒東西的時候運費是 0；滿一千免運；其他是八十元。

（下一步）購物車要算，建立訂單也要算。規則集中在一個地方，哪天老闆說改成滿八百免運，只要改一個數字，兩邊不會算出不一樣的結果。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 登入後合併

<!--
接下來是登入後的合併。
-->

---

# 合併的流程

<v-clicks>

1. 訪客把商品放進購物車 → 前端存在 `localStorage`：`[{ variantId: 1, quantity: 9 }]`
2. 結帳前要求登入 → 登入成功
3. 前端呼叫 `POST /api/cart/merge`，把 localStorage 的內容送上來
4. 後端合併進 `cart_items`，回傳合併後的購物車
5. 前端清空 localStorage，之後都以資料庫為準

</v-clicks>

<!--
合併的流程分五步。

（下一步）訪客把商品放進購物車，前端存在 localStorage，只存規格編號和數量。

（下一步）要結帳的時候，要求登入。

（下一步）登入成功，前端把 localStorage 的內容送到 merge。

（下一步）後端合併進資料庫，回傳合併後的購物車。

（下一步）前端清空 localStorage，之後都以資料庫為準。
-->

---

# merge：不合規的調整或略過

```java {all|5-8|9-10|11}
@Transactional
public CartVO merge(String email, List<CartItemRequest> items) {
    Integer userId = userService.current(email).getId();
    for (CartItemRequest req : items) {
        ProductVariant v = variantRepository.findById(req.variantId()).orElse(null);
        if (v == null || v.getProduct().getStatus() != ProductStatus.ON_SALE || v.getStock() == 0) {
            continue;                                      // 已下架、賣完：略過
        }
        CartItem item = cartItemRepository.findByUserIdAndVariantId(userId, v.getId()).orElse(null);
        int quantity = req.quantity() + (item == null ? 0 : item.getQuantity());
        quantity = Math.min(quantity, Math.min(MAX_QUANTITY, v.getStock()));   // 調到最多能買的
        // …新增或更新 item
    }
    return get(email);
}
```

<!--
merge 跟加入購物車很像，差別在不合規的時候不丟例外。

（下一步）紙條上的東西，可能是好幾天前寫的，商品已經下架、或賣完了，就略過。

（下一步）數量一樣跟資料庫原本的相加。

（下一步）超過十個或超過庫存，不報錯，直接調到最多能買的數量。客人一次合併好幾樣東西，不能因為其中一樣超量，整個合併失敗。
-->

---

# 驗證：合併的結果

```json
// user3 的購物車原本：耶加雪菲半磅 x2
POST /api/cart/merge
{ "items": [ { "variantId": 1, "quantity": 9 },     // 耶加雪菲半磅
             { "variantId": 8, "quantity": 1 },     // 綜合濾掛 10 入
             { "variantId": 14, "quantity": 1 } ] } // 肯亞 AA（已下架）
```

<v-click>

```json
{ "items": [ { "variantId": 1, "quantity": 10 }, { "variantId": 8, "quantity": 1 } ],
  "itemsAmount": 4050, "shippingFee": 0, "totalAmount": 4050 }
```

</v-click>

<!--
用 Postman 驗證。user3 的購物車原本有耶加雪菲半磅兩包，現在合併三樣：耶加雪菲九包、濾掛包一盒、已經下架的肯亞。

（下一步）結果：耶加雪菲二加九是十一，超過上限，調成十；濾掛包一盒加進來；肯亞下架，被略過。總金額四千零五十元，滿千免運。
-->

---

# 想一想

<Poll question="客人加入購物車時還有 1 件，隔天結帳前別人買走了最後一件。購物車頁會顯示什麼？" options="還是 1 件，可以結帳|stock 變成 0，前端可以提醒「已售完」；結帳時後端也會擋下|購物車自動清空|顯示錯誤頁" answer="2" />

<!--
想一想。加入購物車時還有一件，隔天被別人買走了，購物車會顯示什麼？

購物車每次都回傳目前的庫存，stock 變成 0，前端可以提醒已售完。就算前端沒提醒，結帳的時候後端扣庫存也會失敗，下一章會看到。
-->

---

# 重點回顧

<Pairs left="逛街" right="程式" rows="paper,口袋裡的小紙條=browser,localStorage（前端）|cup,店裡保管的購物籃=cabinet,cart_items，同規格數量相加|staff,紙條放進籃子=code,merge：超量調整、下架略過|no,最多 10 個、不超過庫存=code,checkQuantity：只是提醒，還沒扣|doc,今天的價目表=code,CartVO 用現在的價格 + ShippingPolicy" />

<!--
回顧。

（下一步）小紙條是 localStorage。

（下一步）店裡保管的購物籃是 cart_items，同一個規格數量相加。

（下一步）紙條放進籃子是 merge，超量調整、下架略過。

（下一步）數量限制只是提醒，還沒扣庫存。

（下一步）價格每次用現在的價格算，運費規則集中在 ShippingPolicy。
-->

---

# 小結

<v-clicks>

- 購物車不存價格；回傳時用現在的價格算小計、運費、還差多少免運
- 加入：同規格相加，最多 10 件、不超過庫存
- 合併：不合規的調整或略過，不讓整批失敗
- **練習**：寫 `ShippingPolicy` 的單元測試（0 元、999 元、1,000 元三種情況）

</v-clicks>

<!--
小結。

（下一步）購物車不存價格，回傳時才算。

（下一步）加入時同規格相加，有上限、不超過庫存。

（下一步）合併時不合規的調整或略過。

（下一步）練習：用第四十三章的 JUnit，幫 ShippingPolicy 寫單元測試，測 0 元、999 元、1000 元三種情況，特別是剛好一千元這個邊界。下一章，建立訂單。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
