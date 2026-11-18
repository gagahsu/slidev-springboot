---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 取得請求參數（下）—@RequestHeader、@PathVariable
routeAlias: ch19
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
    取得請求參數（下）<br>@RequestHeader、@PathVariable
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「參數藏在 Header 裡，或是直接嵌在 URL 路徑中」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十九章。

上一章說，客人帶來的資料會出現在四個地方，我們已經學了兩個：開口問的話，和交出來的點單。

今天把剩下的兩個學完：會員卡，和取餐號碼。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **`@RequestHeader`**：看客人出示的會員卡
- **`@PathVariable`**：聽客人報的取餐號碼
- **四個工具放在一起**：什麼資料，用哪一個來讀

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，@RequestHeader，用來看客人出示的會員卡。

（下一步）第二，@PathVariable，用來聽客人報的取餐號碼。

（下一步）第三，把四個工具放在一起，整理什麼資料該用哪一個來讀。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# @RequestHeader：出示會員卡

<!--
先看會員卡。
-->

---

# 會員卡不寫在點單內容裡

<Pairs left="飲料店" right="Http" rows="doc,客人出示的會員卡=code,Request Header 裡的一筆資料|what,不管問價格還是點飲料，都可以順便出示=code,GET、POST 都可以帶 Header|clerk,店員看一眼卡號=code,@RequestHeader" />

<!--
小明是這間店的會員。他不管是來問價格，還是來點飲料，都會順便把會員卡拿出來給店員看一眼。

會員卡不是他要問的內容，也不是點單上的品項。它是一個附帶的說明：我是誰。

（下一步）對應到 Http，會員卡就是 Request Header 裡的一筆資料。Request Header 是第十三章說的，點單的第三格，用來放附帶的說明。

（下一步）不管問價格還是點飲料，都可以順便出示。對應到程式：不管是 GET 還是 POST，都可以帶 Header。

（下一步）店員看一眼卡號，這個動作就是 @RequestHeader。
-->

---

# @RequestHeader 的寫法

<CodeSteps>

```java {1|2|2|3-4|all}
@RequestMapping("/member")
public String member(@RequestHeader("card") String card) {
    System.out.println("會員卡號：" + card);
    return "歡迎回來，會員 " + card;
}
```

- Path 是 `/member`
- `@RequestHeader("card")`：到 Request Header 裡找 key 叫 `card` 的那一筆
- `String card`：把找到的值放進變數 `card`
- 印出來，再回傳一句歡迎的話
- 寫法和 `@RequestParam` 幾乎一樣，只是找資料的地方不同

</CodeSteps>

<!--
程式這樣寫。

（第一步）Path 是 /member。

（下一步）@RequestHeader("card")，意思是到 Request Header 裡，找 key 叫 card 的那一筆。

（下一步）String card，把找到的值放進變數 card。

（下一步）接下來就可以使用它。我們把卡號印出來，再回傳一句歡迎的話。

（下一步）你會發現，寫法和上一章的 @RequestParam 幾乎一樣，只是找資料的地方不同。
-->

---

# 在 Postman 裡帶上 Header

<v-clicks>

- 點請求頁面的 **Headers** 分頁
- 新增一列：Key 填 `card`，Value 填 `A001`
- 發送 `GET http://localhost:8080/member`
- 收到回應：**歡迎回來，會員 A001**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 Header 的 key <b>不分大小寫</b>：寫 <code>card</code> 或 <code>Card</code> 都讀得到。沒帶這個 Header，一樣會回 400。
</div>

</v-click>

<!--
在 Postman 裡要怎麼帶 Header？

（下一步）點請求頁面的 Headers 分頁。

（下一步）新增一列。Key 填 card，要和程式裡括號寫的名稱一樣。Value 填 A001。

（下一步）發送 GET /member。

（下一步）會收到回應：歡迎回來，會員 A001。

（下一步）補充兩點。Header 的 key 不分大小寫，寫小寫的 card 或大寫開頭的 Card 都讀得到。另外，它和 @RequestParam 一樣預設必填，沒帶這個 Header 會回 400。

實務上，Header 最常用來放「登入憑證」，也就是證明你是誰的一串文字。這個後面講到登入的章節會再出現。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# @PathVariable：報上取餐號碼

<!--
接著看取餐號碼。
-->

---

# 號碼就在路徑裡

<UrlParts parts="localhost:8080;;Host 和 Port;;哪間店、幾號窗口;;前面一樣是 Host 和 Port||/pickup;;Path 的前半;;取餐區;;Path 的前半是 /pickup：我要去取餐區||/25;;Path 的後半;;取餐號碼;;Path 的後半是 25：我要拿 25 號那一杯。這個數字每次都不一樣" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 號碼不是放在 <code>?</code> 後面，而是直接成為<b>路徑的一部分</b>。
</div>

</v-click>

<!--
飲料做好了，小明走到取餐區，跟店員說：我拿 25 號。寫成網址是這樣。

（下一步）前面一樣是 Host 和 Port。

（下一步）Path 的前半是 /pickup，代表取餐區。

（下一步）Path 的後半是 25，代表他要拿 25 號那一杯。下一位客人可能是 26、27，這個數字每次都不一樣。

（下一步）注意，這個號碼不是放在問號後面，而是直接成為路徑的一部分。
-->

---

# @PathVariable 的寫法

<CodeSteps>

```java {1|2|2|3-4|all}
@RequestMapping("/pickup/{number}")
public String pickup(@PathVariable("number") Integer number) {
    System.out.println("取餐號碼：" + number);
    return number + " 號的飲料好了";
}
```

- 路徑裡用**大括號** `{number}` 挖一個洞，代表「這裡的值每次都不一樣」
- `@PathVariable("number")`：把洞裡的值拿出來
- `Integer number`：放進變數 `number`，而且自動轉成整數
- 印出來，再回傳一句話
- `{ }` 裡的名稱，要和 `@PathVariable` 括號裡的名稱**一樣**

</CodeSteps>

<!--
程式這樣寫。

（第一步）在 @RequestMapping 的路徑裡，用大括號寫 {number}。這就像在路徑上挖一個洞，代表這裡的值每次都不一樣。

（下一步）@PathVariable("number")，把洞裡的值拿出來。

（下一步）Integer number，放進變數 number，而且自動轉成整數。

（下一步）接下來就可以使用它。

（下一步）請注意，大括號裡的名稱，要和 @PathVariable 括號裡的名稱一樣，Spring Boot 才對得起來。
-->

---

# 試試看不同的號碼

<v-clicks>

- `/pickup/25` → **25 號的飲料好了**
- `/pickup/26` → **26 號的飲料好了**
- `/pickup/abc` → **400 Bad Request**（`abc` 沒辦法變成整數）
- `/pickup` → **404 Not Found**（沒有報號碼，找不到對應的路徑）

</v-clicks>

<!--
用 Postman 試試看。

（下一步）/pickup/25，回傳 25 號的飲料好了。

（下一步）/pickup/26，回傳 26 號的飲料好了。

（下一步）/pickup/abc，會得到 400。因為我們說號碼是整數，abc 沒辦法變成整數。

（下一步）只請求 /pickup，後面沒有號碼，會得到 404。因為我們設定的路徑是 /pickup 加上一個號碼，單獨的 /pickup 沒有人負責。
-->

---

# 兩種寫法都能傳號碼

<Pairs left="@RequestParam" right="@PathVariable" sign="vs" rows="code,/pickup?number=25=code,/pickup/25|what,號碼放在問號後面=ok,號碼是路徑的一部分|what,「到取餐區，條件是號碼 25」=cup,「我要 25 號那一杯」" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 要指定「<b>某一筆</b>資料」時，習慣用 <code>@PathVariable</code>。這是下一章 RESTful API 的寫法。
</div>

</v-click>

<!--
你可能會想：用上一章的 @RequestParam，不是也能傳號碼嗎？沒錯，兩種寫法都可以。

（下一步）@RequestParam 的網址是 /pickup?number=25。@PathVariable 的網址是 /pickup/25。

（下一步）一個把號碼放在問號後面，一個讓號碼成為路徑的一部分。

（下一步）意思上有一點不同。前者像是說：到取餐區，條件是號碼 25。後者像是直接說：我要 25 號那一杯。

（下一步）當我們要指定某一筆資料的時候，習慣用 @PathVariable。這是下一章要學的 RESTful API 的寫法。
-->

---

# 小測驗：這個號碼怎麼讀？

<Poll question="前端請求 /orders/888，想查 888 號訂單。後端要用哪一個把 888 讀出來？" options="@RequestParam|@RequestBody|@RequestHeader|@PathVariable" answer="4" />

<!--
來一題確認一下。

前端請求 /orders/888，想查 888 號訂單。後端要用哪一個把 888 讀出來？

（等大家作答）

（下一步）答案是 @PathVariable。

888 是路徑的一部分，沒有問號，也不在 Body 或 Header 裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 四個工具放在一起

<!--
四個工具都學完了，我們放在一起看。
-->

---

# 什麼資料，用哪一個讀？

<Pairs left="飲料店" right="Spring Boot" rows="what,開口問的話：/price?name=milktea=code,@RequestParam|form,交出來的整張點單（JSON）=code,@RequestBody|doc,出示的會員卡（Header）=code,@RequestHeader|ok,報上的取餐號碼：/pickup/25=code,@PathVariable" />

<!--
這張圖請大家記起來。

（下一步）開口問的話，也就是 URL 問號後面的參數，用 @RequestParam。

（下一步）交出來的整張點單，也就是 Request Body 裡的 JSON，用 @RequestBody。

（下一步）出示的會員卡，也就是 Request Header 裡的資料，用 @RequestHeader。

（下一步）報上的取餐號碼，也就是路徑裡的值，用 @PathVariable。

看到一個請求，先問自己：資料放在哪裡？答案出來，要用哪一個工具也就出來了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習
# 會員查詢指定訂單

<!--
換大家動手做。
-->

---

# 題目：帶著會員卡查訂單

<v-clicks>

- 請求：`GET /orders/{orderId}`，例如 `/orders/888`
- Header 要帶 `card`，例如 `card: A001`
- 回傳文字：「訂單編號: 888, 會員卡號: A001」
- 加分題：試試「不帶 card」和「orderId 填英文字」，各會得到什麼 Status Code？

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 想一想：<code>@PathVariable</code> 和 <code>@RequestHeader</code> 可以寫在同一個方法的括號裡嗎？
</div>

</v-click>

<!--
題目是這樣：會員帶著會員卡，來查某一張訂單。

（下一步）請求是 GET /orders 加上訂單編號，例如 /orders/888。

（下一步）Header 要帶 card，例如 A001。

（下一步）回傳一句話，包含訂單編號和會員卡號。

（下一步）加分題：試試看不帶 card，還有把訂單編號填成英文字，各會得到什麼 Status Code。

（下一步）想一想，@PathVariable 和 @RequestHeader，可以寫在同一個方法的括號裡嗎？

請先暫停，自己寫寫看。
-->

---

# 參考解答

```java
@RequestMapping("/orders/{orderId}")
public String getOrder(@PathVariable("orderId") Integer orderId,
                       @RequestHeader("card") String card) {
    return "訂單編號: " + orderId + ", 會員卡號: " + card;
}
```

<v-clicks>

- `/orders/888` + Header `card: A001` → **200 OK**
- `/orders/888`，不帶 card → **400**（Header 預設必填）
- `/orders/abc` + Header `card: A001` → **400**（`abc` 不能變成整數）

</v-clicks>

<!--
這是參考解答，把這個方法加進 OrderController。

答案是可以的。同一個方法的括號裡，可以同時使用不同的工具，中間用逗號隔開。

（下一步）帶著會員卡查 888 號訂單，200 OK。

（下一步）不帶 card，400。因為 Header 預設必填。

（下一步）訂單編號填 abc，也是 400。因為 abc 不能變成整數。

到這裡，四個讀資料的工具我們都實際用過了。
-->

---

# 章節總結

<v-clicks>

- **`@RequestHeader("key")`**：讀 Request Header 的值，GET、POST 都能用，預設必填
- **`@PathVariable("name")`**：讀路徑裡 `{name}` 位置的值
- **名稱要對上**：`{ }` 裡的名稱和 `@PathVariable` 括號裡的要一樣
- **`@PathVariable` 的用途**：指定「某一筆」資料，是 RESTful API 的寫法
- **四個工具**：資料在哪裡，就用對應的那一個

</v-clicks>

<v-click>

下一章我們會學 RESTful API：全店統一的點單規則。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）@RequestHeader 讀 Request Header 的值。@PathVariable 讀路徑裡大括號位置的值。大括號裡的名稱和 @PathVariable 括號裡的要一樣。@PathVariable 用來指定某一筆資料。四個工具，資料在哪裡，就用對應的那一個。

（最後一步）下一章，我們會學 RESTful API，也就是全店統一的點單規則。今天學的 @PathVariable 會是主角之一。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

四個工具不用死背。只要記得飲料店的畫面：開口問、交單子、出示會員卡、報取餐號碼。

有任何問題歡迎提出來。
-->
