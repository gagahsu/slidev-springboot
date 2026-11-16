---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 實作 RESTful API
routeAlias: ch21
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
  .index-table td {
    text-align: center;
    font-family: monospace;
  }
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    實作 RESTful API
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「從設計到實作，一步一步完成完整的 CRUD API」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第二十一章，也是手搖飲店這個單元的最後一章。

上一章我們學了 RESTful 的三條規則，但只有觀念。

今天要動手，把這間店的「訂單」做成一套完整的 RESTful API。前面八章學的東西，今天全部會用上。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **先設計**：訂單的新增、查詢、修改、刪除，各自長什麼樣子
- **更短的寫法**：`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping`
- **動手做**：完成一個完整的 `OrderController`

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，先設計。訂單的新增、查詢、修改、刪除，各自的 API 長什麼樣子。

（下一步）第二，學四個更短的寫法，取代又長又囉唆的 @RequestMapping 加 method。

（下一步）第三，動手做，完成一個完整的 OrderController。
-->

---

# 回顧：RESTful 的三條規則

- **規則 1**：動作用 Http Method 表示　→ 今天學四個新的 Annotation
- **規則 2**：路徑只寫東西　→ 今天設計 `/orders` 和 `/orders/{orderId}`
- **規則 3**：回傳 JSON　→ `@RestController` 已經做到

<!--
先複習上一章的三條規則，順便看今天怎麼把它們做出來。

規則一，動作用 Http Method 表示。今天會學四個新的 Annotation 來做這件事。

規則二，路徑只寫東西。今天會設計 /orders 和 /orders 加上訂單編號這兩種路徑。

規則三，回傳 JSON。@RestController 已經幫我們做到了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 先設計，再寫程式

<!--
寫程式之前，先把 API 設計好。就像開店之前，先把菜單寫好。
-->

---

# 訂單的四個 API

<Pairs left="客人想做的事" right="API" rows="form,點一張新的訂單=code,POST /orders（Body 帶訂單內容）|what,查某一張訂單=code,GET /orders/{orderId}|doc,修改某一張訂單=code,PUT /orders/{orderId}（Body 帶新內容）|no,取消某一張訂單=code,DELETE /orders/{orderId}" />

<!--
客人對訂單會做四件事，我們各設計一個 API。

（下一步）點一張新的訂單：POST /orders。訂單的內容放在 Body 裡。新增的時候還沒有編號，所以路徑後面不用加東西。

（下一步）查某一張訂單：GET /orders 加上訂單編號。

（下一步）修改某一張訂單：PUT /orders 加上訂單編號。新的內容放在 Body 裡。

（下一步）取消某一張訂單：DELETE /orders 加上訂單編號。

你會發現，後面三個的路徑一模一樣，只有 Http Method 不同。這就是 RESTful 的樣子。
-->

---

# 小測驗：修改訂單要帶什麼？

<Poll question="PUT /orders/25 要「把 25 號訂單改成綠茶」。後端需要從哪些地方讀資料？" options="只需要路徑裡的 25|只需要 Body 裡的新內容|路徑裡的 25，加上 Body 裡的新內容|Header 裡的會員卡" answer="3" />

<!--
來一題確認一下。

PUT /orders/25，要把 25 號訂單改成綠茶。後端需要從哪些地方讀資料？

（等大家作答）

（下一步）答案是兩個地方都要：路徑裡的 25，告訴我們改哪一張；Body 裡的新內容，告訴我們改成什麼。

也就是說，等一下修改訂單的方法，會同時用到 @PathVariable 和 @RequestBody。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 四個更短的寫法

<!--
設計好了，寫程式之前，先學一個讓程式更短的寫法。
-->

---

# 從舊寫法到新寫法

<CodeSteps>

```java {1-2|4-5|all}
// 舊寫法：又長又容易打錯
@RequestMapping(value = "/orders", method = RequestMethod.POST)

// 新寫法：意思完全一樣
@PostMapping("/orders")
```

- 之前為了指定 POST，要寫 `value` 又要寫 `method`
- `@PostMapping`：把「POST」直接寫進名字裡，括號只要放路徑
- 兩種寫法效果完全相同，之後我們都用新寫法

</CodeSteps>

<!--
（第一步）之前為了指定只收 POST，我們要寫 value，又要寫 method，一行很長，也容易打錯。

（下一步）Spring Boot 提供了更短的寫法：@PostMapping。它把 POST 直接寫進名字裡，括號裡只要放路徑就好。

（下一步）兩種寫法的效果完全相同。之後我們都用新寫法。
-->

---

# 四個動作，四個 Annotation

<v-clicks>

- `@GetMapping`：只收 **GET**，用來查詢
- `@PostMapping`：只收 **POST**，用來新增
- `@PutMapping`：只收 **PUT**，用來修改
- `@DeleteMapping`：只收 **DELETE**，用來刪除

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 就像店員的牌子直接印好「只接新訂單」「只接取消」，一眼就知道他負責什麼動作。
</div>

</v-click>

<!--
四個動作，各有一個對應的 Annotation。

（下一步）@GetMapping，只收 GET，用來查詢。

（下一步）@PostMapping，只收 POST，用來新增。

（下一步）@PutMapping，只收 PUT，用來修改。

（下一步）@DeleteMapping，只收 DELETE，用來刪除。

（下一步）還記得第十四章店員身上的牌子嗎？這就像牌子上直接印好「只接新訂單」、「只接取消」，一眼就知道他負責什麼動作。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 動手做：OrderController

<!--
開始動手。
-->

---

# 開始之前：整理一下

<v-clicks>

- 前幾章練習時，我們在 `OrderController` 裡寫過 `/orders` 相關的方法
- 請把 `OrderController` 裡**原本的方法都刪掉**，今天重新寫一份整齊的
- `Order` 類別（第十六章建立的）**留著**，今天會繼續用

</v-clicks>

```java
@Data
public class Order {
    private Integer id;
    private String drinkName;
    private Double price;
    private Boolean paid;
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 如果不刪，同一個路徑、同一個 Method 會有兩個方法搶著負責，Spring Boot 啟動時會報錯。
</div>

</v-click>

<!--
開始之前，先整理一下專案。

（下一步）前幾章練習的時候，我們在 OrderController 裡寫過好幾個 /orders 相關的方法。

（下一步）請把 OrderController 裡原本的方法都刪掉。今天我們要重新寫一份整齊的。

（下一步）Order 類別，也就是第十六章建立的那個，請留著，今天會繼續用。

（下一步）為什麼要刪？因為如果不刪，同一個路徑、同一個 Method，會有兩個方法搶著負責。就像兩位店員掛了一模一樣的牌子，接待不知道要交給誰，Spring Boot 啟動的時候就會報錯。
-->

---

# 新增訂單（Create）

<CodeSteps>

```java {1|2|3|all}
@PostMapping("/orders")
public String create(@RequestBody Order order) {
    return "新增訂單：" + order.getDrinkName();
}
```

- `@PostMapping("/orders")`：收 POST `/orders`
- `@RequestBody Order order`：把 Body 裡的 JSON 填進 `Order` 物件
- 現在先回傳一句話，代表「這裡之後要把訂單存起來」
- 對應設計：點一張新的訂單

</CodeSteps>

<!--
第一個，新增訂單。

（第一步）@PostMapping("/orders")，收 POST /orders 的請求。

（下一步）@RequestBody Order order，把 Body 裡的 JSON 填進 Order 物件。這是第十八章學的。

（下一步）方法裡，我們先回傳一句話。真正的系統會在這裡把訂單存進資料庫，但資料庫是下一個單元的主題，所以現在先用一句話代表。

（下一步）這就對應到我們設計的第一個 API：點一張新的訂單。
-->

---

# 查詢訂單（Read）

<CodeSteps>

```java {1|2|3|all}
@GetMapping("/orders/{orderId}")
public String read(@PathVariable("orderId") Integer orderId) {
    return "查詢 " + orderId + " 號訂單";
}
```

- `@GetMapping("/orders/{orderId}")`：收 GET，路徑後面帶訂單編號
- `@PathVariable("orderId")`：把路徑裡的編號讀出來
- 先回傳一句話，代表「這裡之後要去找出這張訂單」
- 對應設計：查某一張訂單

</CodeSteps>

<!--
第二個，查詢訂單。

（第一步）@GetMapping，路徑是 /orders 加上 {orderId}。大括號是第十九章學的，代表這裡的值每次都不一樣。

（下一步）@PathVariable("orderId")，把路徑裡的編號讀出來。

（下一步）一樣先回傳一句話，代表這裡之後要去資料庫找出這張訂單。

（下一步）對應設計：查某一張訂單。
-->

---

# 修改訂單（Update）

<CodeSteps>

```java {1|2|3|4-5|all}
@PutMapping("/orders/{orderId}")
public String update(@PathVariable("orderId") Integer orderId,
                     @RequestBody Order order) {
    return "把 " + orderId + " 號訂單改成：" + order.getDrinkName();
}
```

- `@PutMapping`：收 PUT
- `@PathVariable`：從路徑知道要改**哪一張**
- `@RequestBody`：從 Body 知道要改成**什麼**
- 把兩項資料組成一句話回傳
- 一個方法可以同時用兩個工具，中間用逗號隔開

</CodeSteps>

<!--
第三個，修改訂單。這是四個裡面最完整的一個。

（第一步）@PutMapping，收 PUT。

（下一步）@PathVariable，從路徑知道要改哪一張。

（下一步）@RequestBody，從 Body 知道要改成什麼。

（下一步）把兩項資料組成一句話回傳。

（下一步）就像剛剛小測驗的答案：一個方法可以同時用兩個工具，中間用逗號隔開。
-->

---

# 刪除訂單（Delete）

<CodeSteps>

```java {1|2|3|all}
@DeleteMapping("/orders/{orderId}")
public String delete(@PathVariable("orderId") Integer orderId) {
    return "刪除 " + orderId + " 號訂單";
}
```

- `@DeleteMapping`：收 DELETE
- `@PathVariable`：從路徑知道要刪哪一張
- 回傳一句話
- 刪除只需要知道「哪一張」，所以不需要 Body

</CodeSteps>

<!--
第四個，刪除訂單。

（第一步）@DeleteMapping，收 DELETE。

（下一步）@PathVariable，從路徑知道要刪哪一張。

（下一步）回傳一句話。

（下一步）刪除只需要知道是哪一張，所以不需要 Body。
-->

---

# 完整的 OrderController

```java
@RestController
public class OrderController {

    @PostMapping("/orders")
    public String create(@RequestBody Order order) {
        return "新增訂單：" + order.getDrinkName();
    }

    @GetMapping("/orders/{orderId}")
    public String read(@PathVariable("orderId") Integer orderId) {
        return "查詢 " + orderId + " 號訂單";
    }

    @PutMapping("/orders/{orderId}")
    public String update(@PathVariable("orderId") Integer orderId,
                         @RequestBody Order order) {
        return "把 " + orderId + " 號訂單改成：" + order.getDrinkName();
    }

    @DeleteMapping("/orders/{orderId}")
    public String delete(@PathVariable("orderId") Integer orderId) {
        return "刪除 " + orderId + " 號訂單";
    }
}
```

<!--
把四個方法放在一起，就是完整的 OrderController。

請大家對照自己的程式，確認四個方法都有，最上面也有 @RestController。然後重新啟動 Spring Boot。
-->

---

# 用 Postman 測試四個 API

<v-clicks>

- `POST /orders`，Body：`{"drinkName": "珍珠奶茶", "price": 50.0}` → **新增訂單：珍珠奶茶**
- `GET /orders/25` → **查詢 25 號訂單**
- `PUT /orders/25`，Body：`{"drinkName": "綠茶", "price": 30.0}` → **把 25 號訂單改成：綠茶**
- `DELETE /orders/25` → **刪除 25 號訂單**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 這就是一套完整的 RESTful API 骨架。之後接上資料庫，它就是真正能用的後端。
</div>

</v-click>

<!--
用 Postman 把四個 API 都測一次。

（下一步）POST /orders，Body 帶一張珍珠奶茶的訂單。回應：新增訂單，珍珠奶茶。

（下一步）GET /orders/25。回應：查詢 25 號訂單。

（下一步）PUT /orders/25，Body 帶新的內容。回應：把 25 號訂單改成綠茶。

（下一步）DELETE /orders/25。回應：刪除 25 號訂單。

（下一步）恭喜大家，這就是一套完整的 RESTful API 骨架。現在每個方法都只回傳一句話，等我們學會資料庫之後，把那句話換成真正的存取動作，它就是真正能用的後端了。
-->

---

# 複習：這個單元學了什麼

<Pairs left="飲料店" right="程式" rows="clerk,掛著「只接某種動作」牌子的店員=code,@GetMapping / @PostMapping / @PutMapping / @DeleteMapping|ok,報上的訂單編號=code,@PathVariable|form,交出來的訂單內容=code,@RequestBody|shop,全店統一的點單規則=code,RESTful API" />

<!--
用一張圖複習今天，也複習整個單元。

（下一步）掛著「只接某種動作」牌子的店員，是 @GetMapping、@PostMapping、@PutMapping、@DeleteMapping。

（下一步）報上的訂單編號，用 @PathVariable 讀。

（下一步）交出來的訂單內容，用 @RequestBody 讀。

（下一步）全店統一的點單規則，是 RESTful API。
-->

---

# 章節總結

<v-clicks>

- **四個新 Annotation**：`@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping`
- **取代舊寫法**：比 `@RequestMapping` 加 `method` 更短、更清楚
- **CRUD 對應**：POST 新增、GET 查詢、PUT 修改、DELETE 刪除
- **搭配使用**：指定哪一筆用 `@PathVariable`，帶內容用 `@RequestBody`

</v-clicks>

<v-click>

下一個單元，我們會學資料庫，讓這些 API 真的把資料存起來。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）四個新的 Annotation。它們取代了 @RequestMapping 加 method 的舊寫法。POST 新增、GET 查詢、PUT 修改、DELETE 刪除。指定哪一筆用 @PathVariable，帶內容用 @RequestBody。

（最後一步）手搖飲店的故事到這裡告一段落。下一個單元，我們會學資料庫，讓這些 API 真的把資料存起來。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊，手搖飲店這個單元也結束了。

回想一下我們走過的路：店面和吧台、點單和取餐單、店員的牌子、杯子上的標籤、開口問和填單、會員卡和取餐號碼，最後是全店統一的規則。每一個畫面，都對應到一個你現在已經會寫的東西。

有任何問題歡迎提出來。
-->
