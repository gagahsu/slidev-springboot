---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 取得請求參數（上）—@RequestParam、@RequestBody
routeAlias: ch18
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
  <h1 style="color: #1a5c5c; font-size: 3rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    取得請求參數（上）<br>@RequestParam、@RequestBody
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「前端傳來的資料，Spring Boot 要怎麼接住？」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十八章。

上一章，店員已經能分辨客人是「開口問」還是「填單交出去」。但是他還沒有真的去聽客人問了什麼，也沒有去看單子上寫了什麼。

今天就來學，怎麼在程式裡把前端帶來的資料讀出來。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **客人的資料會出現在哪些地方？** 總共四個地方，今天先學兩個
- **`@RequestParam`**：聽懂客人「開口問」的內容
- **`@RequestBody`**：讀懂客人交出來的「整張點單」

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，客人帶來的資料會出現在哪些地方。總共有四個地方，今天先學其中兩個。

（下一步）第二，@RequestParam，讓店員聽懂客人開口問的內容。

（下一步）第三，@RequestBody，讓店員讀懂客人交出來的整張點單。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 客人的資料在哪裡？

<!--
先看全貌。
-->

---

# 資料會出現在四個地方

<Pairs left="飲料店" right="Spring Boot" rows="what,客人開口問的話=code,@RequestParam：讀 URL 後面的參數|form,客人交出來的整張點單=code,@RequestBody：讀 Request Body 的 JSON|doc,客人出示的會員卡=code,@RequestHeader：讀 Request Header|ok,客人手上的取餐號碼=code,@PathVariable：讀 URL 路徑裡的值" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 今天學前兩個。會員卡和取餐號碼，留到下一章。
</div>

</v-click>

<!--
客人帶來的資料，會出現在四個地方。Spring Boot 幫每個地方都準備了一個工具。

（下一步）客人開口問的話，用 @RequestParam 來讀。它讀的是 URL 後面的參數。

（下一步）客人交出來的整張點單，用 @RequestBody 來讀。它讀的是 Request Body 裡的 JSON。

（下一步）客人出示的會員卡，用 @RequestHeader 來讀。

（下一步）客人手上的取餐號碼，用 @PathVariable 來讀。

（下一步）今天學前兩個。會員卡和取餐號碼，留到下一章。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# @RequestParam：聽懂客人問的話

<!--
先看第一個，@RequestParam。
-->

---

# 客人問了什麼？

<UrlParts parts="localhost:8080/price;;網址本體;;問價格的窗口;;客人來到「問價格」的窗口，Path 是 /price||?;;問號;;參數開始;;問號後面是參數，也就是客人問的內容||name;;key;;問的項目;;key 是 name：客人說的是「飲料名稱」||=;;等號;; ;;等號把 key 和 value 連起來||milktea;;value;;問的內容;;value 是 milktea：他問的是珍珠奶茶" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 店員要做的事：從這句話裡，把 <code>name</code> 的值 <code>milktea</code> 聽出來。
</div>

</v-click>

<!--
小明走到櫃台問：珍珠奶茶多少錢？寫成網址就是這樣。

（下一步）前面是網址本體，Path 是 /price，代表問價格的窗口。

（下一步）問號後面是參數，也就是客人問的內容。

（下一步）key 是 name，代表客人說的是飲料名稱。

（下一步）等號把 key 和 value 連起來。

（下一步）value 是 milktea，他問的是珍珠奶茶。

（下一步）店員要做的事，就是從這句話裡，把 name 的值 milktea 聽出來。
-->

---

# @RequestParam 的寫法

<CodeSteps>

```java {1|2|2|3-4|all}
@RequestMapping("/price")
public String price(@RequestParam("name") String name) {
    System.out.println("客人問的是：" + name);
    return name + " 的價格是 50 元";
}
```

- Path 是 `/price`：問價格的窗口
- `@RequestParam("name")`：到 URL 裡找 key 叫 `name` 的參數
- `String name`：把找到的值，放進這個叫 `name` 的變數
- 接下來就可以在方法裡使用它
- 請求 `/price?name=milktea`，會回傳「milktea 的價格是 50 元」

</CodeSteps>

<!--
程式這樣寫。

（第一步）Path 是 /price，問價格的窗口。

（下一步）重點在方法的括號裡。@RequestParam("name") 的意思是：到 URL 裡找一個 key 叫 name 的參數。

（下一步）後面的 String name，是把找到的值放進一個叫 name 的變數。型別是 String，因為飲料名稱是文字。

（下一步）接下來，方法裡就可以使用這個變數了。這裡我們把它印出來，再組成一句話回傳。

（下一步）所以請求 /price?name=milktea，就會回傳「milktea 的價格是 50 元」。
-->

---

# 試試看不同的問法

<v-clicks>

- `/price?name=milktea` → **milktea 的價格是 50 元**
- `/price?name=greentea` → **greentea 的價格是 50 元**
- `/price`（什麼都沒帶） → **400 Bad Request**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ <code>@RequestParam</code> 預設是<b>必填</b>的。客人沒說要問哪一杯，店員沒辦法回答，就回 400。
</div>

</v-click>

<!--
用 Postman 試試看不同的問法。

（下一步）問 milktea，回傳 milktea 的價格。

（下一步）問 greentea，回傳 greentea 的價格。店員真的有聽進去客人問的是什麼。

（下一步）如果只請求 /price，什麼參數都沒帶呢？會得到 400 Bad Request。

（下一步）因為 @RequestParam 預設是必填的。客人只說「多少錢」，沒說要問哪一杯，店員沒辦法回答。400 是 4 開頭，代表是前端這邊少給了東西。
-->

---

# 括號裡的名稱，對應的是 URL 的 key

```java
// URL：/price?drinkName=milktea
public String price(@RequestParam("drinkName") String name) {
```

<v-clicks>

- 括號裡的 `"drinkName"`：決定去 URL 找**哪一個 key**
- 後面的變數 `name`：只是方法裡用的名字，可以不一樣
- 建議兩個取一樣的名字，比較好讀

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 括號裡的名稱請<b>每次都寫</b>。Spring Boot 3.2 之後，省略它在某些環境下會出錯。
</div>

</v-click>

<!--
補充一個細節。

（下一步）@RequestParam 括號裡的名稱，決定去 URL 找哪一個 key。這個例子裡，URL 的 key 是 drinkName。

（下一步）後面的變數 name，只是方法裡面用的名字，可以跟 key 不一樣。

（下一步）不過建議兩個取一樣的名字，讀程式的人比較不會搞混。

（下一步）另外，括號裡的名稱請每次都寫。Spring Boot 3.2 之後，如果省略它，在某些環境下會出錯。養成習慣寫清楚最安全。
-->

---

# 小測驗：少帶了參數

<Poll question="方法寫了 @RequestParam(&quot;name&quot;)，但前端只請求 /price，沒有帶 name。會發生什麼事？" options="name 變成空白，照常執行|回應 400 Bad Request|回應 404 Not Found|Spring Boot 當掉" answer="2" />

<!--
來一題確認一下。

方法寫了 @RequestParam("name")，但前端只請求 /price，沒有帶 name。會發生什麼事？

（等大家作答）

（下一步）答案是 400 Bad Request。

不是 404。路徑 /price 是存在的，只是前端少給了必填的資料。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# @RequestBody：讀懂整張點單

<!--
接著看第二個，@RequestBody。
-->

---

# 客人交出一整張單子

前端用 POST，把這張 JSON 放在 Request Body 裡：

```json
{
    "id": 7,
    "name": "珍珠奶茶"
}
```

<v-clicks>

- 資料不只一項，不適合一個一個用 `@RequestParam` 去聽
- 店員需要一個「**跟單子長得一樣的表格**」，把內容整張抄下來

</v-clicks>

<!--
這次客人不是用問的，而是交出一整張單子。前端用 POST，把這張 JSON 放在 Request Body 裡。

（下一步）單子上的資料不只一項。真實的點單可能有十幾項，不適合一個一個用 @RequestParam 去聽。

（下一步）所以店員需要一個跟單子長得一樣的表格，把內容整張抄下來。
-->

---

# 先準備一個「跟單子一樣」的類別

<CodeSteps>

```java {1-2|3|4|all}
@Data
public class Drink {
    private Integer id;
    private String name;
}
```

- 這就是第十六章建立的 `Drink`，不用重寫
- JSON 的 `"id"` 會填進變數 `id`
- JSON 的 `"name"` 會填進變數 `name`
- **名稱要一模一樣**，Spring Boot 才知道哪一項填到哪一格

</CodeSteps>

<!--
這個表格，就是一個 Java 類別。

（第一步）其實第十六章已經建立過了，就是 Drink，不用重寫。

（下一步）JSON 裡的 id，會填進變數 id。

（下一步）JSON 裡的 name，會填進變數 name。

（下一步）重點是名稱要一模一樣。Spring Boot 就是靠名稱，來決定哪一項資料填到哪一格。
-->

---

# @RequestBody 的寫法

<CodeSteps>

```java {1|2|3-4|5|all}
@RequestMapping("/drink/new")
public String newDrink(@RequestBody Drink drink) {
    System.out.println("編號：" + drink.getId());
    System.out.println("名稱：" + drink.getName());
    return "收到一杯新飲料：" + drink.getName();
}
```

- Path 是 `/drink/new`
- `@RequestBody Drink drink`：把 Body 裡的 JSON，整張填進一個 `Drink` 物件
- 用 Getter 把每一項拿出來用
- 回傳一句話，讓前端知道收到了
- 第十六章是「物件 → JSON」，這裡是反過來「JSON → 物件」

</CodeSteps>

<!--
程式這樣寫。

（第一步）Path 是 /drink/new。

（下一步）方法的括號裡寫 @RequestBody Drink drink。意思是：把 Request Body 裡的 JSON，整張填進一個 Drink 物件。

（下一步）填好之後，就可以用 Getter 把每一項拿出來用。

（下一步）最後回傳一句話，讓前端知道我們收到了。

（下一步）還記得第十六章的標籤機嗎？那時候是把物件變成 JSON。這裡是反過來，把 JSON 變回物件。做這件事的同樣是 Jackson。
-->

---

# 執行結果

用 Postman 發送 `POST http://localhost:8080/drink/new`，Body 選 raw + JSON：

```json
{
    "id": 7,
    "name": "珍珠奶茶"
}
```

<v-clicks>

- Postman 收到回應：**收到一杯新飲料：珍珠奶茶**
- Eclipse 的 Console 印出：`編號：7`、`名稱：珍珠奶茶`

</v-clicks>

<!--
用 Postman 測試。Method 選 POST，Body 選 raw 和 JSON，填入這張單子。

（下一步）Postman 會收到回應：收到一杯新飲料，珍珠奶茶。

（下一步）回到 Eclipse 看 Console，會看到印出編號 7、名稱珍珠奶茶。代表單子上的兩項資料，都正確填進 Drink 物件了。
-->

---

# 小測驗：該用哪一個？

<Poll question="前端用 POST 送來一張 JSON，裡面有飲料名稱、甜度、冰塊、加料。後端要用哪一個來接？" options="@RequestParam|@RequestBody|@RequestMapping" answer="2" />

<!--
再來一題。

前端用 POST 送來一張 JSON，裡面有飲料名稱、甜度、冰塊、加料。後端要用哪一個來接？

（等大家作答）

（下一步）答案是 @RequestBody。

資料放在 Request Body 裡，而且是一整張 JSON，就用 @RequestBody。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習
# 搜尋飲料、建立訂單

<!--
換大家動手做。今天有兩題。
-->

---

# 題目（1/2）：搜尋飲料

<v-clicks>

- 請求：`GET /drinks/search?keyword=tea&limit=5`
- 用 `@RequestParam` 接住 `keyword`（文字）和 `limit`（整數）
- 回傳文字：「搜尋關鍵字: tea, 最多回傳 5 筆」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：這次要一次接住<b>兩個</b>參數。方法的括號裡，可以寫不只一個 <code>@RequestParam</code>。
</div>

</v-click>

<!--
第一題，搜尋飲料。

（下一步）請求是 GET /drinks/search，後面帶兩個參數：keyword 和 limit。

（下一步）請用 @RequestParam 接住它們。keyword 是文字，limit 是整數。

（下一步）回傳一句話：搜尋關鍵字是什麼，最多回傳幾筆。

（下一步）提示：這次要一次接住兩個參數。方法的括號裡，可以寫不只一個 @RequestParam，中間用逗號隔開。
-->

---

# 題目（2/2）：建立訂單

<v-clicks>

- 請求：`POST /orders/create`
- Body：`{"drinkName": "珍珠奶茶", "price": 50.0}`
- 用 `@RequestBody` 搭配第十六章的 `Order` 類別來接
- 回傳文字：「訂單成立: 珍珠奶茶」

</v-clicks>

<!--
第二題，建立訂單。

（下一步）請求是 POST /orders/create。

（下一步）Body 是一張 JSON，有飲料名稱和價格。

（下一步）請用 @RequestBody，搭配第十六章練習時建立的 Order 類別來接。

（下一步）回傳一句話：訂單成立，加上飲料名稱。

請先暫停，兩題都自己寫寫看。
-->

---

# 參考解答（1/2）：搜尋飲料

```java
@RequestMapping("/drinks/search")
public String search(@RequestParam("keyword") String keyword,
                     @RequestParam("limit") Integer limit) {
    return "搜尋關鍵字: " + keyword + ", 最多回傳 " + limit + " 筆";
}
```

<v-clicks>

- `/drinks/search?keyword=tea&limit=5` → **搜尋關鍵字: tea, 最多回傳 5 筆**
- `/drinks/search?keyword=tea`（少了 limit） → **400 Bad Request**

</v-clicks>

<!--
第一題的解答。把這個方法加進 DrinkController。

括號裡寫了兩個 @RequestParam，一個接 keyword，一個接 limit，中間用逗號隔開。limit 的型別是 Integer，Spring Boot 會自動把網址上的 5 轉成數字。

（下一步）兩個參數都帶，就會得到正確的回應。

（下一步）少帶一個 limit，就會得到 400。因為兩個都是必填的。
-->

---

# 參考解答（2/2）：建立訂單

```java
@RequestMapping("/orders/create")
public String create(@RequestBody Order order) {
    return "訂單成立: " + order.getDrinkName();
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 JSON 裡沒有給 <code>id</code> 和 <code>paid</code> 也沒關係，沒給的那幾格會是空的（<code>null</code>）。
</div>

</v-click>

<!--
第二題的解答。把這個方法加進 OrderController。

@RequestBody Order order，把整張 JSON 填進 Order 物件，再用 getDrinkName 把飲料名稱拿出來。

（下一步）你可能注意到，Order 有四個變數，但這次的 JSON 只給了兩項。沒有關係，沒給的那幾格會是空的，在 Java 裡叫做 null。
-->

---

# 複習：飲料店對照表

<Pairs left="飲料店" right="程式" rows="what,聽懂客人問的話=code,@RequestParam：讀 URL 的參數|no,客人沒說要問哪一杯=code,少了必填參數：400 Bad Request|form,把整張點單抄進表格=code,@RequestBody：JSON 變成 Java 物件|doc,跟單子長得一樣的表格=code,變數名稱和 JSON 的 key 一樣的類別" />

<!--
我們用一張圖複習今天的內容。

（下一步）聽懂客人問的話，是 @RequestParam，讀 URL 的參數。

（下一步）客人沒說要問哪一杯，就是少了必填參數，回 400 Bad Request。

（下一步）把整張點單抄進表格，是 @RequestBody，把 JSON 變成 Java 物件。

（下一步）跟單子長得一樣的表格，就是變數名稱和 JSON 的 key 一樣的類別。
-->

---

# 章節總結

<v-clicks>

- **四個讀資料的工具**：`@RequestParam`、`@RequestBody`、`@RequestHeader`、`@PathVariable`
- **`@RequestParam("xxx")`**：讀 URL 後面的參數，預設必填，沒帶會回 400
- **`@RequestBody`**：讀 Request Body 的 JSON，自動填進對應的 Java 物件
- **名稱要對上**：類別的變數名稱，要和 JSON 的 key 一樣

</v-clicks>

<v-click>

下一章我們會學另外兩個：`@RequestHeader` 和 `@PathVariable`。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）讀資料的工具有四個。@RequestParam 讀 URL 後面的參數，預設必填。@RequestBody 讀 Request Body 的 JSON，自動填進 Java 物件。類別的變數名稱，要和 JSON 的 key 一樣。

（最後一步）下一章，我們會學另外兩個：會員卡和取餐號碼，也就是 @RequestHeader 和 @PathVariable。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

記得：用問的，就用 @RequestParam 去聽；交單子，就用 @RequestBody 去讀。

有任何問題歡迎提出來。
-->
