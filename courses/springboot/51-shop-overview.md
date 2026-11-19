---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題（一）：線上商店總覽與資料模型
routeAlias: ch51
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
    專題（一）<br>線上商店總覽與資料模型
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「先把倉庫和帳本規劃好，再開門做生意」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
大家好，歡迎來到第五十一章。從這一章開始，連續七章，我們要做進階學程的專題：轉角咖啡線上商店。

基礎專題的轉角咖啡只能看菜單、訂位。現在這家店要開網路商店，賣咖啡豆、濾掛包和器材，客人可以加入購物車、結帳，用綠界付款；店家有後台可以管商品、出貨、看報表。

這一章先不寫功能，我們先把全貌看清楚，把資料表和專案骨架建好。
-->

---

# 七章的路線圖

<v-clicks>

1. **總覽與資料模型**：8 張表、Flyway、Entity（本章）
2. **會員、權限與統一回應**：AppResponse、JWT、ADMIN
3. **商品與後台商品管理**：分頁搜尋、規格、上傳圖片
4. **購物車**：登入前後的購物車、運費
5. **訂單與模擬付款**：交易、防超賣、狀態、逾時取消
6. **綠界金流**：檢查碼、付款通知、Cloudflare Tunnel
7. **後台訂單與報表**：出貨、MyBatis 報表

</v-clicks>

<!--
先看七章的路線圖。

（下一步）第一章，也就是今天，總覽和資料模型。

（下一步）第二章，會員和權限，還有統一的回應格式。

（下一步）第三章，商品，包含前台的搜尋分頁，和後台的商品管理。

（下一步）第四章，購物車。

（下一步）第五章，訂單。這是整個專題最核心的一章，會用到交易和鎖。

（下一步）第六章，接上綠界的測試環境，真的付款。

（下一步）第七章，後台的訂單管理和報表。

前端畫面不在 Spring Boot 課，會在 Angular 課的專題章做。這七章我們用 Postman 和瀏覽器的開發者工具驗證。
-->

---

# 先看成品：客人與店家

<div class="grid grid-cols-2 gap-6">
<div>

**客人（前台）**

- 逛商品：分類、搜尋、排序、分頁
- 選規格（半磅 / 一磅）、加入購物車
- 結帳、用綠界刷卡
- 查看、取消自己的訂單

</div>
<div>

**店家（後台，限管理員）**

- 營運摘要：今天賣了多少
- 商品與規格、上下架、圖片
- 訂單：出貨、完成、取消
- 銷售報表

</div>
</div>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 完整需求寫在 <code>specs/SHOP-SPEC.md</code>；參考解答在 <code>projects/cafe-shop-api</code>。
</div>

</v-click>

<!--
成品分成兩邊。

左邊是客人用的前台：逛商品，可以依分類、關鍵字搜尋，依價格排序，分頁瀏覽；進到商品頁選規格，例如半磅或一磅，加入購物車；結帳之後用綠界刷卡；之後可以查看或取消自己的訂單。

右邊是店家用的後台，只有管理員能進去：營運摘要、商品管理、訂單管理和銷售報表。

（下一步）完整的需求在 SHOP-SPEC.md 這份規格書裡，API 的路徑、欄位、規則都寫好了。參考解答放在 projects 資料夾的 cafe-shop-api，遇到卡關可以對照。
-->

---

# 故事：開網路商店之前

實體店要開分店到網路上，老闆先做兩件事：

<v-clicks>

- **規劃帳本**：會員名冊、商品目錄、規格與庫存、購物籃、訂單、收據、付款紀錄
- **寫施工日誌**：倉庫每一次改裝，都寫成一頁「第 1 次施工」「第 2 次施工」…
  - 新來的店員照著日誌**從第一頁做到最後一頁**，倉庫就跟大家一模一樣
  - 已經做過的頁數**不會再做一次**

</v-clicks>

<!--
用開網路商店來想。實體店要搬到網路上，老闆要先做兩件事。

（下一步）第一件，規劃帳本。會員名冊、商品目錄、每個規格的庫存、客人的購物籃、訂單和收據、付款紀錄，每一本要記哪些欄位，先想清楚。

（下一步）第二件，寫施工日誌。倉庫每一次改裝，都寫成一頁：第一次施工建了哪些櫃子，第二次施工放進哪些貨。

（下一步）新來的店員，只要照著日誌從第一頁做到最後一頁，他的倉庫就跟大家一模一樣。

（下一步）而且已經做過的頁數，不會再做一次，只會做新增的頁數。
-->

---

# 對應到程式

<Pairs left="開網路商店" right="專案" rows="book,一本一本的帳本=cabinet,cafe_shop 資料庫的 8 張表|doc,施工日誌的每一頁=code,Flyway 的 V1__schema.sql、V2__seed.sql|staff,照日誌施工=spring,啟動時 Flyway 自動執行還沒做過的版本|ok,做過的頁數打勾=cabinet,flyway_schema_history 表" />

<!--
對應到程式。

（下一步）一本一本的帳本，就是 cafe_shop 資料庫裡的 8 張表。

（下一步）施工日誌的每一頁，是 Flyway 的 migration 檔案，V1 建表、V2 放範例資料。MySQL 課第十一章介紹過 Flyway。

（下一步）照日誌施工：Spring Boot 啟動時，Flyway 會自動執行還沒做過的版本。

（下一步）做過的頁數打勾：Flyway 在資料庫裡建一張 flyway_schema_history 表，記錄哪些版本已經執行過。
-->

---

# 想一想

<Poll question="同學 A 加了一個欄位（V3__add_column.sql）並推上 GitHub。同學 B pull 之後啟動後端，會發生什麼事？" options="什麼都不會發生，要手動執行 SQL|Flyway 只執行 V3，B 的資料庫多了那個欄位|Flyway 把 V1 到 V3 全部重做，資料被清空|啟動失敗" answer="2" />

<!--
想一想。同學 A 加了一個欄位，寫成 V3 的檔案推上 GitHub。同學 B pull 下來啟動後端，會發生什麼事？

Flyway 會發現 V1、V2 已經做過，只執行 V3，B 的資料庫就多了那個欄位。這就是用 Flyway 的最大好處：資料庫的結構跟著程式碼一起版本控制，整組人的資料庫都一樣。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 8 張表

<!--
先看資料表的設計。
-->

---

# 資料表關聯

```text
users 1 ──< cart_items >── 1 product_variants >── 1 products >── 1 categories
  │                                │
  └──< orders 1 ──< order_items >──┘ (variant_id，只供追溯)
          │
          └──< payments
```

<v-clicks>

- **products 1—N product_variants**：同一包豆子，半磅和一磅價格、庫存都不同
- **cart_items**：會員 × 規格，`UNIQUE(user_id, variant_id)`
- **orders 1—N order_items**、**orders 1—N payments**

</v-clicks>

<!--
這是 8 張表的關係。

（下一步）商品和規格是一對多。同一包衣索比亞豆子，半磅賣三百八，一磅賣七百，庫存也分開算。所以價格和庫存放在規格表，商品表只放共同的資料。

（下一步）購物車是會員和規格之間的中間表，同一個會員、同一個規格只能有一筆，加入兩次就是數量相加。這個規則用複合唯一鍵保證。

（下一步）訂單和明細一對多，訂單和付款紀錄也是一對多。為什麼付款是一對多，下一頁說明。
-->

---

# 兩個關鍵設計

<v-clicks>

- **訂單明細存快照**：`product_name`、`variant_name`、`unit_price` 抄一份進 `order_items`
  - 商品改名、漲價、下架，**已成立的訂單都不受影響**
- **一張訂單可以付很多次**：每次付款都是一筆新的 `payments`
  - 刷卡失敗、關掉付款頁再付一次，綠界規定交易編號 `MerchantTradeNo` **不能重複**
  - 客人看到的 `order_no` 從頭到尾不變
- **金額都用 INT**（新台幣元）；商品**下架**不刪除

</v-clicks>

<!--
有兩個設計，等一下寫程式都會用到。

（下一步）第一，訂單明細存快照。下單的時候，把商品名稱、規格名稱、單價抄一份進明細。

（下一步）這樣以後商品改名、漲價，甚至下架，客人去年的訂單還是顯示當時的名稱和價格。收據開出去了就不能改，道理一樣。

（下一步）第二，一張訂單可以付很多次。

（下一步）客人可能刷卡失敗，或關掉付款頁之後再付一次。綠界規定每次送去的交易編號不能重複，所以每次付款都新增一筆 payments，有自己的交易編號。

（下一步）客人看到的訂單編號，從頭到尾不變。

（下一步）另外，金額一律用整數，綠界也只收整數；商品不刪除，改成下架，訂單才追溯得到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 建專案與 Flyway

<!--
接下來建立專案。
-->

---

# 建立 cafe-shop-api

`start.spring.io`：Gradle - Groovy、Spring Boot 4.1.x、Java 21、Package `com.example.shop`

<v-clicks>

- **Spring Web**、**Spring Data JPA**、**Validation**、**MySQL Driver**、**Lombok**、**DevTools**
- **Spring Security**、**Flyway Migration**、**Spring Cache Abstraction**
- Initializr 沒有的，自己加進 `build.gradle`：

</v-clicks>

<v-click>

```groovy
implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:4.1.0'
implementation 'io.jsonwebtoken:jjwt-api:0.13.0'
runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.13.0'
runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.13.0'
```

</v-click>

<!--
到 start.spring.io 建立專案，Artifact 填 cafe-shop-api，Package 改成 com.example.shop。

（下一步）基本的六個跟基礎專題一樣。

（下一步）再加三個：Spring Security 做登入權限，Flyway 管理資料表，Cache 做分類的快取。

（下一步）MyBatis 和 JWT 的套件，Initializr 上選不到，下載之後自己加進 build.gradle。

（下一步）就是這四行。MyBatis 用來寫報表，jjwt 是第四十七章用過的 JWT 套件。加完之後在 Eclipse 對專案按右鍵，Gradle、Refresh Gradle Project。
-->

---

# 設定檔：敏感資料用環境變數

```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/cafe_shop}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
spring.jpa.hibernate.ddl-auto=none
spring.jpa.open-in-view=false

jwt.secret=${JWT_SECRET:corner-cafe-shop-dev-secret-key-at-least-32-bytes}
```

<v-clicks>

- `${DB_URL:預設值}`：有設定環境變數就用環境變數，沒有就用冒號後面的預設值
- 上 Docker、上雲端時只要改環境變數，**程式和設定檔都不用改**
- `ddl-auto=none`：資料表交給 Flyway，JPA 不要動

</v-clicks>

<!--
application.properties 有一個新寫法。

（下一步）錢字號大括號，DB_URL 冒號預設值。意思是：有設定 DB_URL 這個環境變數，就用環境變數的值；沒有，就用冒號後面的預設值。

（下一步）這樣在自己電腦上開發，用預設值就能跑；部署到 Docker 或雲端時，只要改環境變數，程式和設定檔都不用動。密碼和 JWT 的密鑰也不會寫死在 Git 裡。

（下一步）ddl-auto 設成 none，資料表交給 Flyway 管理，JPA 不要自己建表。
-->

---

# Flyway：資料表的施工日誌

```text
src/main/resources/db/migration/
├── V1__schema.sql     ← 8 張表的 CREATE TABLE
└── V2__seed.sql       ← 範例資料：管理員、會員、商品、訂單
```

<v-clicks>

- 檔名格式：`V版本__說明.sql`（**兩個底線**）
- 先手動建一個空的資料庫：`CREATE DATABASE cafe_shop;`
- 啟動後端 → Console 出現 `Successfully applied 2 migrations`
- 資料庫多了 `flyway_schema_history`，記錄執行過的版本與檢查碼

</v-clicks>

<!--
Flyway 的檔案放在 resources 底下的 db/migration。V1 建表，V2 放範例資料，內容跟 MySQL 課的 cafe_shop 一樣。

（下一步）檔名的格式是 V、版本號、兩個底線、說明。兩個底線很容易打錯，打錯 Flyway 就不認得。

（下一步）資料庫本身要先手動建好，空的就可以。

（下一步）啟動後端，Console 會出現 Successfully applied 2 migrations。

（下一步）資料庫多了一張 flyway_schema_history，記錄執行過哪些版本，還有每個檔案的檢查碼。
-->

---

# Flyway 的規矩

<v-clicks>

- **執行過的檔案不能改**：改了檢查碼就對不上，啟動會失敗
- 要改結構？**新增下一個版本**：`V3__add_product_tag.sql`
- 預設管理員寫在 `V2__seed.sql`：`admin@cornercafe.test / Admin1234`
  - 存的是 **BCrypt 雜湊**，不是明碼
  - 正式上線前一定要改密碼

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 前台註冊的帳號一律是 USER，<b>沒有任何 API 可以把自己升級成 ADMIN</b>。
</div>

</v-click>

<!--
使用 Flyway 有幾個規矩。

（下一步）執行過的檔案不能改。改了，檢查碼就跟歷史紀錄對不上，啟動會直接失敗。施工日誌寫好的頁數不能塗改。

（下一步）要改結構，就新增下一個版本，例如 V3。

（下一步）預設的管理員帳號寫在 V2 裡。

（下一步）存進去的是 BCrypt 雜湊，不是明碼。

（下一步）這只是上課用的帳號，正式上線前一定要改密碼。

（下一步）另外提醒，前台註冊的帳號一律是一般會員，沒有任何 API 可以把自己升級成管理員。這是很常見的安全漏洞，我們從設計上就杜絕。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# Entity 與 Repository

<!--
接下來把資料表寫成 Entity。
-->

---

# 商品與規格：1—N（第 29 章）

```java {all|8-10|12-15|all}
@Entity
@Table(name = "products")
@Getter @Setter
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    // name、description、price、imageUrl、sortOrder…
    @Enumerated(EnumType.STRING)
    private ProductStatus status;          // ON_SALE / OFF_SHELF

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder")
    private List<ProductVariant> variants = new ArrayList<>();
}
```

<!--
商品的 Entity，用到第二十九章的關聯。

（下一步）商品屬於一個分類，多對一，用 @ManyToOne。LAZY 表示用到分類的時候才去查。

（下一步）狀態用 enum，@Enumerated 加上 STRING，資料庫存的是 ON_SALE、OFF_SHELF 這些文字，比存數字好讀。

（下一步）一個商品有多個規格，用 @OneToMany。cascade ALL 讓規格跟著商品一起存；orphanRemoval 表示從清單裡移掉的規格，存檔時會被刪除。後台改商品規格的時候會用到。
-->

---

# 規格：庫存與樂觀鎖

```java {all|7|10-11}
@Entity
@Table(name = "product_variants")
@Getter @Setter
public class ProductVariant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "product_id")
    private Product product;
    private String name;    private String sku;
    private Integer price;  private Integer stock;
    @Version
    private Integer version;   // 兩位管理員同時改同一個規格，後存的會失敗
}
```

<!--
規格的 Entity。

（下一步）規格屬於一個商品，多對一，跟商品那邊的 mappedBy 對應。

（下一步）@Version 是第三十四章的樂觀鎖。兩位管理員同時修改同一個規格，先存的成功，後存的會因為版本號不對而失敗，不會悄悄蓋掉別人的修改。

扣庫存的時候用的是另一種方法，第五章再說。
-->

---

# 訂單狀態：用 enum 寫規則

```java {all|2-6|8-15}
public enum OrderStatus {
    PENDING_PAYMENT("待付款"),
    PAID("已付款"),
    SHIPPED("已出貨"),
    COMPLETED("已完成"),
    CANCELLED("已取消");
    // label 欄位與建構子省略
    public boolean canChangeTo(OrderStatus next) {
        return switch (this) {
            case PENDING_PAYMENT -> next == PAID || next == CANCELLED;
            case PAID            -> next == SHIPPED || next == CANCELLED;
            case SHIPPED         -> next == COMPLETED;
            case COMPLETED, CANCELLED -> false;
        };
    }
}
```

<!--
訂單的狀態用 enum，這是第三十八章學過的語法。

（下一步）五個狀態，每個都帶一個中文名稱，畫面上顯示用。

（下一步）canChangeTo 把規格書的狀態圖寫成程式：待付款只能變成已付款或已取消；已付款可以出貨或取消；已出貨只能完成；已完成和已取消就不能再變了。

用 switch 表達式寫，五個狀態少寫一個，編譯器就會提醒你。規則集中在這裡，以後所有改狀態的地方都問它，不會有人寫出「已出貨又取消」的程式。
-->

---

# 訂單、明細、付款

```java
@Entity @Table(name = "orders")
public class Order {
    private String orderNo;
    private Integer userId;
    @Enumerated(EnumType.STRING) private OrderStatus status;
    private Integer itemsAmount;  private Integer shippingFee;  private Integer totalAmount;
    // 收件資料、各種時間…
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}
```

<v-clicks>

- 類別叫 `Order`，表名用複數 `orders`（`ORDER` 是 SQL 關鍵字），用 `@Table` 指定
- `OrderItem`：`productName`、`variantName`、`unitPrice` 是快照欄位
- `Payment`：`orderId`、`merchantTradeNo`、`status`（PENDING / PAID / FAILED）、`rawNotify`

</v-clicks>

<!--
訂單的 Entity，欄位很多，這裡只列重點：訂單編號、會員、狀態、三個金額，還有明細，一樣是一對多。

（下一步）類別叫 Order，表名是 orders，用 @Table 指定。ORDER 本身是 SQL 的關鍵字，表名用複數比較不會出問題。

（下一步）OrderItem 裡面的商品名稱、規格名稱、單價，就是剛剛說的快照欄位。

（下一步）Payment 記錄每一次付款嘗試，rawNotify 會存綠界送來的原始通知，出問題時除錯用。
-->

---

# Repository

```java
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {}
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByUserIdOrderById(Integer userId);
    Optional<CartItem> findByUserIdAndVariantId(Integer userId, Integer variantId);
}
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Optional<Order> findByOrderNo(String orderNo);
    List<Order> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Optional<Payment> findByMerchantTradeNo(String merchantTradeNo);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 先寫最基本的查詢，之後每一章需要什麼，再回來加。
</div>

</v-click>

<!--
Repository 先寫最基本的：用會員查購物車、用訂單編號查訂單、用交易編號查付款紀錄。都是方法名稱查詢。

（下一步）不用一次寫完，之後每一章需要什麼查詢，再回來加。
-->

---

# 重點回顧

<Pairs left="開網路商店" right="專案" rows="book,規劃帳本=cabinet,8 張表：規格分開、明細存快照、付款可以多筆|doc,施工日誌=code,Flyway：V1__schema.sql、V2__seed.sql|no,寫好的頁數不能塗改=code,改結構就新增下一個版本|staff,帳本的樣子=code,Entity：@OneToMany、@Version、enum 狀態" />

<!--
回顧一下。

（下一步）規劃帳本，是 8 張表的設計：規格分開存、明細存快照、付款可以有很多筆。

（下一步）施工日誌，是 Flyway 的 migration 檔案。

（下一步）寫好的頁數不能塗改，改結構就新增下一個版本。

（下一步）帳本的樣子，就是 Entity：一對多、樂觀鎖、用 enum 表示狀態。
-->

---

# 小結與練習

<v-clicks>

- 建好 `cafe-shop-api`，啟動後 Flyway 自動建出 8 張表與範例資料
- 寫好 8 個 Entity 與基本的 Repository
- **練習**：寫一個 `CommandLineRunner`，啟動時印出每個商品有幾個規格、總庫存多少

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 下一章：會員註冊登入、JWT，還有所有 API 共用的回應格式。
</div>

</v-click>

<!--
最後小結。

（下一步）專案建好了，啟動時 Flyway 會自動建表、放入範例資料。

（下一步）8 個 Entity 和基本的 Repository 也寫好了。

（下一步）練習：寫一個 CommandLineRunner，啟動時把每個商品有幾個規格、總庫存多少印出來，順便確認關聯設定正確。注意 LAZY 的關聯要在交易裡面才能讀，所以把查詢寫在一個加了 @Transactional 的 Service 方法裡，再由 CommandLineRunner 呼叫。

（下一步）下一章，我們做會員註冊登入和 JWT，還有所有 API 共用的回應格式。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
