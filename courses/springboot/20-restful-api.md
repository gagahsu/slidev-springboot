---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: RESTful API 介紹
routeAlias: ch20
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
    RESTful API 介紹
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓 URL 說話，用正確的 Method 代表動作」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第二十章。

前面幾章，我們學會了設定路徑、回傳 JSON、讀出前端帶來的資料。工具都齊了。

今天不學新工具，而是學一套「大家約好的規則」，讓我們設計出來的 API 整齊、好懂。它叫做 RESTful API。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **API 到底是什麼？** 就是店裡那張菜單
- **RESTful 是什麼？** 全店統一的點單規則，只有三條
- **什麼時候可以不照規則？** 它是約定，不是法律

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，API 到底是什麼。這個詞我們用了很多次，今天正式介紹。它就是店裡那張菜單。

（下一步）第二，RESTful 是什麼。它是全店統一的點單規則，總共只有三條。

（下一步）第三，什麼時候可以不照規則。因為它是約定，不是法律。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 什麼是 API？

<!--
先把 API 這個詞講清楚。
-->

---

# API 就是那張菜單

<Pairs left="飲料店" right="程式" rows="machine,吧台裡怎麼做飲料=server,後端的程式怎麼寫|form,菜單：有什麼可以點、要怎麼點=code,API：有哪些功能、要怎麼呼叫|customer,客人看菜單點飲料=browser,前端工程師看 API 文件發請求|cup,拿到飲料=code,拿到 Response（JSON）" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>API</b>（Application Programming Interface）：一份「這個功能要怎麼用」的說明。照著用就好，不用知道裡面怎麼做。
</div>

</v-click>

<!--
客人走進飲料店，不需要知道吧台裡怎麼煮珍珠。他只需要看菜單。

（下一步）吧台裡怎麼做飲料，對應到後端的程式怎麼寫。這是店家自己的事。

（下一步）菜單告訴客人：有什麼可以點、要怎麼點。對應到程式，這就是 API：它說明後端有哪些功能、要怎麼呼叫。

（下一步）客人看菜單點飲料。對應到程式：前端工程師看 API 文件，然後發請求。

（下一步）最後拿到飲料，也就是拿到 Response。

（下一步）API 的全名是 Application Programming Interface。白話說，它是一份「這個功能要怎麼用」的說明。照著用就好，不用知道裡面怎麼做。

一份 API 的說明，通常會寫清楚四件事：路徑是什麼、用哪個 Http Method、要帶什麼參數、會回傳什麼。這四件事我們前面都學過了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 每間分店的點法都不一樣？

<!--
知道 API 是菜單之後，來看一個問題。
-->

---

# 沒有規則的時候

這間手搖飲店開了三間分店，每間的店長各自設計「查訂單」的點法：

<v-clicks>

- A 分店：`GET /getOrder?id=25`
- B 分店：`POST /showMeTheOrder`
- C 分店：`GET /order_query/25`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
❓ 都是「查 25 號訂單」，卻有三種點法。客人每到一間店，都要重新學一次。
</div>

</v-click>

<!--
這間手搖飲店生意很好，開了三間分店。但是總部沒有訂規則，每間的店長各自設計「查訂單」的點法。

（下一步）A 分店：GET /getOrder，號碼放在問號後面。

（下一步）B 分店：用 POST，路徑叫 /showMeTheOrder。

（下一步）C 分店：GET /order_query，號碼放在路徑裡。

（下一步）三種都能用，程式也都不會錯。但是明明都是查 25 號訂單，卻有三種點法。客人每到一間店，都要重新學一次。

寫程式也一樣。如果每個工程師都照自己的習慣命名，前端工程師會很痛苦。
-->

---

# 總部訂了一套統一規則

**RESTful API：一套大家約好的 API 設計規則，讓所有 API 看起來都是同一個樣子。**

<v-clicks>

- **REST** 是 Representational State Transfer 的縮寫，名字不用背
- **RESTful** 的意思是「符合 REST 風格的」
- 它是目前**最主流**的 API 設計風格
- 規則只有**三條**

</v-clicks>

<!--
所以總部訂了一套全店統一的點單規則。在程式的世界裡，這套規則叫做 RESTful API。

用一句話說：它是一套大家約好的 API 設計規則，讓所有 API 看起來都是同一個樣子。

（下一步）REST 是三個英文字的縮寫，這個全名很抽象，不用背。

（下一步）RESTful 多了 ful，意思是「符合 REST 風格的」。

（下一步）它是目前最主流的 API 設計風格，你以後接觸到的 API 幾乎都長這樣。

（下一步）而且規則只有三條。我們一條一條看。
-->

---

# 規則 1：動作，用 Http Method 表示

<Pairs left="客人想做的事" right="Http Method" rows="what,看一下訂單=code,GET：查詢|form,點一張新的訂單=code,POST：新增|doc,把訂單的內容改掉=code,PUT：修改|no,取消訂單=code,DELETE：刪除" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這四個動作合起來常被叫做 <b>CRUD</b>：新增（Create）、查詢（Read）、修改（Update）、刪除（Delete）。
</div>

</v-click>

<!--
規則一：客人想做什麼動作，用 Http Method 來表示。

（下一步）看一下訂單，用 GET。

（下一步）點一張新的訂單，用 POST。這兩個第十七章學過。

（下一步）把訂單的內容改掉，用 PUT。

（下一步）取消訂單，用 DELETE。

（下一步）新增、查詢、修改、刪除，這四個動作合起來有一個常見的稱呼，叫做 CRUD，是四個英文字的開頭。以後看到 CRUD，就是指這四個基本動作。
-->

---

# 規則 2：路徑，只寫「東西」

動作已經交給 Http Method 了，所以路徑裡**不要再寫動詞**，只寫「對哪個東西」：

<v-clicks>

- `/orders` → 所有的訂單
- `/orders/25` → 25 號訂單
- `/members/7/orders` → 7 號會員的所有訂單
- `/members/7/orders/25` → 7 號會員的 25 號訂單

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 東西用<b>複數名詞</b>（orders、members）；越往右，指的範圍越小、越具體。
</div>

</v-click>

<!--
規則二：路徑只寫「東西」。

動作已經交給 Http Method 表示了，所以路徑裡不要再出現 get、create、delete 這些動詞，只要寫「對哪個東西」。

（下一步）/orders，代表所有的訂單。

（下一步）/orders/25，代表 25 號訂單。後面的 25，就是上一章 @PathVariable 讀的那個值。

（下一步）/members/7/orders，代表 7 號會員的所有訂單。

（下一步）/members/7/orders/25，代表 7 號會員的 25 號訂單。

（下一步）兩個習慣：東西用複數名詞，像 orders、members。路徑越往右，指的範圍越小、越具體。
-->

---

# 把規則 1 和規則 2 合起來

<Pairs left="沒有規則" right="RESTful" sign="→" rows="what,GET /getOrder?id=25=ok,GET /orders/25|what,POST /createOrder=ok,POST /orders|what,POST /updateOrder?id=25=ok,PUT /orders/25|what,POST /deleteOrder?id=25=ok,DELETE /orders/25" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 路徑只剩 <code>/orders</code> 和 <code>/orders/25</code> 兩種，動作看 Http Method 就知道。
</div>

</v-click>

<!--
把前兩條規則合起來，看看差別。左邊是沒有規則的寫法，右邊是 RESTful 的寫法。

（下一步）查 25 號訂單：GET /orders/25。

（下一步）新增訂單：POST /orders。

（下一步）修改 25 號訂單：PUT /orders/25。

（下一步）刪除 25 號訂單：DELETE /orders/25。

（下一步）右邊的路徑只剩下兩種：/orders 和 /orders/25。想做什麼動作，看 Http Method 就知道。不管到哪一間分店，點法都一樣。
-->

---

# 規則 3：回傳 JSON

<v-clicks>

- Response Body 用 **JSON** 格式
- 在 Spring Boot 裡，`@RestController` 已經自動幫我們做到了（第十六章）

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 所以第三條規則，我們其實早就遵守了。
</div>

</v-click>

<!--
規則三最簡單：回傳的資料用 JSON 格式。

（下一步）Response Body 用 JSON。

（下一步）在 Spring Boot 裡，@RestController 已經自動幫我們做到了，就是第十六章的標籤機。

（下一步）所以第三條規則，我們其實早就遵守了。
-->

---

# 小測驗：哪一個符合 RESTful？

<Poll question="要「刪除 25 號訂單」，哪一個寫法符合 RESTful 風格？" options="POST /deleteOrder?id=25|GET /orders/delete/25|DELETE /orders/25|DELETE /deleteOrder/25" answer="3" />

<!--
來一題確認一下。

要刪除 25 號訂單，哪一個寫法符合 RESTful 風格？

（等大家作答）

（下一步）答案是 DELETE /orders/25。

動作用 Http Method 表示，所以是 DELETE。路徑只寫東西，所以是 /orders/25，裡面沒有 delete 這個動詞。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 規則不是法律

<!--
最後要提醒一件事。
-->

---

# RESTful 是約定，不是硬性規定

<v-clicks>

- **平常**：盡量照 RESTful 設計，讓 API 整齊好讀
- **敏感資料**：像身分證字號，不適合放在路徑上，可以改用 POST 放在 Body
- **不像 CRUD 的動作**：例如「啟用會員」，可以彈性寫成 `POST /members/7/activate`
- **最重要的**：同一個團隊裡，大家的寫法要一致

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 規則和安全性衝突的時候，<b>安全性優先</b>。
</div>

</v-click>

<!--
RESTful 是大家的約定，不是硬性規定。不照著寫，程式也不會壞。

（下一步）平常，我們盡量照 RESTful 設計，讓 API 整齊好讀。

（下一步）但是遇到敏感資料，像身分證字號，就不適合放在路徑上。這時候可以改用 POST，把它放在 Body 裡。

（下一步）有些動作不太像新增、查詢、修改、刪除，例如「啟用會員」。這時候可以彈性一點，在路徑最後加一個動作。

（下一步）最重要的是：同一個團隊裡，大家的寫法要一致。

（下一步）記得，規則和安全性衝突的時候，安全性優先。
-->

---

# 複習：飲料店對照表

<Pairs left="飲料店" right="程式" rows="form,菜單=code,API|shop,全店統一的點單規則=code,RESTful API|what,客人想做的動作=code,Http Method：GET / POST / PUT / DELETE|cup,對哪一個東西=code,路徑：/orders、/orders/25|cup,貼好標籤的飲料=code,回傳 JSON" />

<!--
我們用一張圖複習今天的內容。

（下一步）菜單，是 API。

（下一步）全店統一的點單規則，是 RESTful API。

（下一步）客人想做的動作，用 Http Method 表示。

（下一步）對哪一個東西，用路徑表示。

（下一步）貼好標籤的飲料，就是回傳 JSON。
-->

---

# 章節總結

<v-clicks>

- **API**：說明「這個功能怎麼用」的菜單
- **RESTful API**：最主流的 API 設計約定
- **規則 1**：動作用 Http Method 表示（GET 查、POST 新增、PUT 修改、DELETE 刪除）
- **規則 2**：路徑只寫東西，用複數名詞，越往右越具體
- **規則 3**：回傳 JSON
- **彈性**：它是約定；和安全性衝突時，安全性優先

</v-clicks>

<v-click>

下一章我們要動手，做出一套完整的 RESTful 飲料訂單 API。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）API 是說明功能怎麼用的菜單。RESTful API 是最主流的設計約定。規則一，動作用 Http Method 表示。規則二，路徑只寫東西。規則三，回傳 JSON。它是約定，和安全性衝突時，安全性優先。

（最後一步）今天只有觀念，沒有程式。下一章我們要動手，做出一套完整的 RESTful 飲料訂單 API。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後可以觀察一下你常用的網站，網址列上的路徑是不是也長得像 /東西/編號 的樣子。

有任何問題歡迎提出來。
-->
