---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 常見的 Http Method—GET 和 POST
routeAlias: ch17
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
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    常見的 Http Method<br>GET 和 POST
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「一張明信片和一個信封，決定了資料怎麼傳遞」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十七章。

前面我們一直說 Http Method 是「想做什麼動作」，但沒有仔細講。

今天要把最常用的兩個動作講清楚：GET 和 POST。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **客人在櫃台會做哪兩種事？** 開口問，或是填單交出去
- **GET 和 POST 差在哪？** 資料放的位置不一樣
- **動手做**：同一個路徑，GET 和 POST 各做各的事

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，客人走到櫃台，其實只會做兩種事：開口問，或是填單交出去。

（下一步）第二，GET 和 POST 差在哪裡。重點是資料放的位置不一樣。

（下一步）第三，動手做：讓同一個路徑，GET 和 POST 各做各的事。
-->

---

# 回顧：Http Method 是「想做什麼」

第十三章提過，點單的第一格是 Http Method：

- **GET**：我想「看」　← 今天的主角
- **POST**：我想「新增」　← 今天的主角
- PUT：我想把整筆資料換掉
- PATCH：我想改其中一部分
- DELETE：我想刪除

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 GET 和 POST 最常用，而且「資料怎麼帶」的方式差最多，所以先學這兩個。
</div>

<!--
先複習一下。第十三章提過，點單的第一格是 Http Method，代表前端想做什麼動作。

常見的有五種：GET 是想看，POST 是想新增，PUT、PATCH 是修改，DELETE 是刪除。

今天只學 GET 和 POST。它們最常用，而且資料怎麼帶的方式差最多。其他三個，第二十章會一起學。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 在櫃台會做的兩種事

<!--
我們回到手搖飲店的櫃台。
-->

---

# 開口問，還是填單？

<AskOrOrder />

<!--
客人走到櫃台，會做的事其實只有兩種。

（下一步）第一種是開口問。例如小明問：珍珠奶茶多少錢？問題是用講的，所以旁邊排隊的人都聽得到。

（下一步）店員回答：50 元。回答完之後，店裡什麼都沒有改變。沒有多一張訂單，也沒有少一杯飲料。小明問十次，結果都一樣。

（下一步）第二種是填一張點單交出去。小明要的東西比較多：珍珠奶茶、少冰、半糖。這些內容寫在單子上，不是用喊的，旁邊的人看不到。

（下一步）店員收下單子之後，店裡的訂單簿就多了一筆新訂單。這一次，店裡的狀態改變了。
-->

---

# 把兩種動作搬進程式裡

<Pairs left="飲料店" right="Http" rows="what,開口問=code,GET：查詢資料|customer,問題是用講的，大家都聽得到=code,參數放在 URL 裡，公開可見|form,填單交出去=code,POST：新增資料|doc,內容寫在單子裡=code,參數放在 Request Body 裡" />

<!--
把這兩種動作搬進程式裡。

（下一步）開口問，就是 GET。它用來查詢資料。

（下一步）問題是用講的，大家都聽得到。對應到 GET：參數放在 URL 裡，是公開可見的。

（下一步）填單交出去，就是 POST。它用來新增資料。

（下一步）內容寫在單子裡。對應到 POST：參數放在 Request Body 裡。Request Body 就是第十三章說的，點單上的第四格。
-->

---

# 小測驗：該用哪一個？

<Poll question="前端想知道「店裡現在有哪些飲料」，只是看一下，不改變任何資料。應該用哪一個 Http Method？" options="GET|POST|兩個都可以，沒有差別" answer="1" />

<!--
來一題確認一下。

前端想知道店裡現在有哪些飲料，只是看一下，不改變任何資料。應該用哪一個？

（等大家作答）

（下一步）答案是 GET。

只是看、只是問，不會改變後端的資料，就用 GET。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# GET：開口問

<!--
接下來分別仔細看。先看 GET。
-->

---

# GET 的特性

<v-clicks>

- **用途**：查詢資料，例如看清單、搜尋
- **參數放哪裡**：接在 URL 的後面，也就是 Query String
- **公開可見**：參數會直接出現在網址列上
- **不適合**：傳密碼、信用卡號這類不能被看到的資料

</v-clicks>

<!--
GET 有這幾個特性。

（下一步）用途是查詢資料，例如看清單、搜尋。

（下一步）參數接在 URL 的後面，也就是第十四章提過的 Query String。

（下一步）因為參數在 URL 裡，所以會直接出現在瀏覽器的網址列上，是公開可見的。

（下一步）所以 GET 不適合傳密碼、信用卡號這類不能被看到的資料。就像你不會在櫃台大聲喊出自己的提款卡密碼。
-->

---

# GET 的參數怎麼寫？

<UrlParts parts="localhost:8080/drinks;;網址本體;;哪間店、什麼品項;;前面這一段是第十四章學過的：Host、Port 和 Path||?;;問號;;參數開始;;問號：代表後面開始是參數||name=milktea;;key=value;;一組參數;;一組參數的寫法是 key=value：name 是 milktea||&;;& 符號;;下一組;;& 符號：把兩組參數隔開||ice=less;;key=value;;另一組參數;;第二組參數：ice 是 less" />

<!--
GET 的參數寫在 URL 後面，有固定的寫法。

（下一步）前面這一段是第十四章學過的：Host、Port 和 Path。

（下一步）接著是一個問號。它代表後面開始是參數。

（下一步）一組參數的寫法是 key 等於 value。這裡是 name 等於 milktea。

（下一步）如果還有下一組參數，中間用 & 符號隔開。

（下一步）第二組參數：ice 等於 less。

整句的意思就像小明開口問：「我要查飲料，名稱是 milktea，冰塊是 less。」
-->

---

# 在 Spring Boot 裡收 GET 請求

<CodeSteps>

```java {1|2-4|all}
@RequestMapping(value = "/drinks", method = RequestMethod.GET)
public String getDrinks() {
    return "查詢飲料清單";
}
```

- `method = RequestMethod.GET`：這位店員**只回答用問的**
- 收到 GET `/drinks`，回傳「查詢飲料清單」
- 這個寫法第十四章看過一次，現在知道它的意思了

</CodeSteps>

<!--
在 Spring Boot 裡要怎麼只收 GET 請求？

（第一步）在 @RequestMapping 裡加上 method = RequestMethod.GET。意思是：這位店員只回答用問的。

（下一步）收到 GET /drinks 的請求，就回傳「查詢飲料清單」。

（下一步）這個寫法第十四章看過一次，現在你知道它是什麼意思了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# POST：填單交出去

<!--
再來看 POST。
-->

---

# POST 的特性

<v-clicks>

- **用途**：新增資料，例如點一杯新的飲料、註冊帳號
- **參數放哪裡**：放在 Request Body 裡，通常寫成 JSON
- **不會出現在網址上**：適合傳送內容多、或不想公開的資料
- **不適合**：單純查詢

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 帳號密碼這類資料，要放在 POST 的 Body 裡，而且網站要用 https，才真的安全。
</div>

</v-click>

<!--
POST 有這幾個特性。

（下一步）用途是新增資料，例如點一杯新的飲料、註冊一個帳號。

（下一步）參數放在 Request Body 裡，通常寫成第十五章學過的 JSON。

（下一步）因為不在 URL 裡，所以不會出現在網址列上。適合傳送內容比較多、或不想公開的資料。

（下一步）單純的查詢，就不適合用 POST。

（下一步）補充一點：帳號密碼這類資料要放在 POST 的 Body 裡，不要放在網址上。不過光是這樣還不夠，網站還要用 https 加密，才真的安全。
-->

---

# POST 的資料長這樣

Request Body 裡放的，就是一張 JSON：

```json
{
    "name": "珍珠奶茶",
    "ice": "less",
    "sugar": 0.5
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 在 Postman 裡：點 <b>Body</b> 分頁 → 選 <b>raw</b> → 格式選 <b>JSON</b>，就可以填入這段內容。
</div>

</v-click>

<!--
POST 的資料長這樣。Request Body 裡放的，就是一張 JSON。這張單子寫的是：珍珠奶茶、少冰、半糖。

（下一步）在 Postman 裡要怎麼填？點 Body 分頁，選 raw，右邊的格式選 JSON，就可以把這段內容填進去。
-->

---

# 在 Spring Boot 裡收 POST 請求

<CodeSteps>

```java {1|2-4|all}
@RequestMapping(value = "/drinks", method = RequestMethod.POST)
public String createDrink() {
    return "新增一杯飲料";
}
```

- `method = RequestMethod.POST`：這位店員**只收填好的單子**
- 收到 POST `/drinks`，回傳「新增一杯飲料」
- 路徑和剛剛一樣是 `/drinks`，只是動作不同

</CodeSteps>

<!--
在 Spring Boot 裡收 POST 請求，寫法幾乎一樣。

（第一步）把 method 改成 RequestMethod.POST。意思是：這位店員只收填好的單子。

（下一步）收到 POST /drinks 的請求，就回傳「新增一杯飲料」。

（下一步）注意，路徑和剛剛一樣是 /drinks，只是動作不同。Spring Boot 會依照 Method，把請求交給對的方法。

至於怎麼把單子裡的內容讀出來，是下一章的主題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# GET 和 POST 放在一起看

<!--
最後把兩個放在一起比較。
-->

---

# GET vs POST

<Pairs left="GET" right="POST" sign="vs" rows="what,開口問=form,填單交出去|code,參數在 URL（Query String）=code,參數在 Request Body（JSON）|browser,公開，出現在網址列=doc,不會出現在網址列|ok,適合：查詢、搜尋=ok,適合：新增、登入、送出表單" />

<!--
把 GET 和 POST 放在一起看。

（下一步）GET 是開口問，POST 是填單交出去。

（下一步）GET 的參數在 URL 的 Query String，POST 的參數在 Request Body。

（下一步）GET 的參數是公開的，會出現在網址列。POST 的參數不會出現在網址列。

（下一步）GET 適合查詢、搜尋。POST 適合新增、登入、送出表單。
-->

---

# 在 Postman 裡怎麼測？

<v-clicks>

- **測 GET**：Method 選 `GET`，網址填 `http://localhost:8080/drinks?name=milktea`，Body 不用填
- **測 POST**：Method 選 `POST`，網址填 `http://localhost:8080/drinks`，Body 選 raw + JSON 後填入內容

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 初學者常犯的錯：用 GET 卻去填 Body，或用 POST 卻把參數寫在網址上。
</div>

</v-click>

<!--
在 Postman 裡要怎麼測試？

（下一步）測 GET：Method 選 GET，參數直接寫在網址後面，Body 不用填。

（下一步）測 POST：Method 選 POST，網址後面不用加參數，到 Body 分頁選 raw 和 JSON，再填入內容。

（下一步）初學者常犯的錯有兩個：用 GET 卻去填 Body，或者用 POST 卻把參數寫在網址上。記得：用問的就不用寫單子，寫了單子就不用再喊一次。
-->

---

# 小測驗：登入要用哪一個？

<Poll question="使用者要登入，前端需要把帳號和密碼傳給後端。應該用哪一個 Http Method？" options="GET，因為比較簡單|POST，因為資料不該出現在網址上|都可以，沒有差別" answer="2" />

<!--
再來一題。

使用者要登入，前端需要把帳號和密碼傳給後端。應該用哪一個？

（等大家作答）

（下一步）答案是 POST。

如果用 GET，密碼會直接出現在網址列上，還會留在瀏覽紀錄裡。這就像在櫃台大聲喊出密碼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習
# 同一個路徑，兩種動作

<!--
換大家動手做。
-->

---

# 題目：訂單 API 的 GET 和 POST

請在同一個路徑 `/orders` 上做出兩個 API：

<v-clicks>

- `GET /orders` → 回傳文字「查詢訂單列表」
- `POST /orders` → 回傳文字「新增一張訂單」
- 用 Postman 分別測試，確認回應正確
- 加分題：用 **PUT** 請求 `/orders`，觀察回傳的 Status Code 是多少

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：同一個路徑可以寫成兩個方法，只要 <code>method</code> 不同就不會衝突。
</div>

</v-click>

<!--
題目是這樣：請在同一個路徑 /orders 上做出兩個 API。

（下一步）GET /orders，回傳「查詢訂單列表」。

（下一步）POST /orders，回傳「新增一張訂單」。

（下一步）用 Postman 分別測試。

（下一步）加分題：故意用 PUT 去請求 /orders，觀察回傳的 Status Code 是多少。

（下一步）提示：同一個路徑可以寫成兩個方法，只要 method 不同就不會衝突。

請先暫停，自己寫寫看。
-->

---

# 參考解答：程式

```java
@RestController
public class OrderController {

    @RequestMapping(value = "/orders", method = RequestMethod.GET)
    public String getOrders() {
        return "查詢訂單列表";
    }

    @RequestMapping(value = "/orders", method = RequestMethod.POST)
    public String createOrder() {
        return "新增一張訂單";
    }
}
```

<!--
這是參考解答。同一個路徑 /orders，寫成兩個方法。第一個只收 GET，第二個只收 POST。

如果你上一章已經建立過 OrderController，把這兩個方法加進去就可以了。
-->

---

# 參考解答：測試結果

<v-clicks>

- `GET /orders` → **200 OK**，回應「查詢訂單列表」
- `POST /orders` → **200 OK**，回應「新增一張訂單」
- `PUT /orders` → **405 Method Not Allowed**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>404</b>：這個品項沒有人負責。<b>405</b>：有人負責這個品項，但不接受你這種動作。
</div>

</v-click>

<!--
測試結果應該是這樣。

（下一步）GET /orders，200 OK，回應查詢訂單列表。

（下一步）POST /orders，200 OK，回應新增一張訂單。

（下一步）PUT /orders，會得到 405 Method Not Allowed。

（下一步）這裡多認識一個 Status Code。404 是這個品項沒有人負責。405 是有人負責這個品項，但是不接受你這種動作。兩個都是 4 開頭，代表是前端這邊的問題。
-->

---

# 複習：飲料店對照表

<Pairs left="飲料店" right="程式" rows="what,開口問=code,GET：查詢，參數在 URL|form,填單交出去=code,POST：新增，參數在 Request Body|no,店員不接受這種動作=code,405 Method Not Allowed" />

<!--
我們用一張圖複習今天的內容。

（下一步）開口問，是 GET：查詢，參數在 URL。

（下一步）填單交出去，是 POST：新增，參數在 Request Body。

（下一步）店員不接受這種動作，是 405 Method Not Allowed。
-->

---

# 章節總結

<v-clicks>

- **GET**：查詢資料；參數放在 URL 的 Query String，公開可見
- **POST**：新增資料；參數放在 Request Body，通常是 JSON
- **Spring Boot 寫法**：`method = RequestMethod.GET` 或 `RequestMethod.POST`
- **同一個路徑**可以依照 Method 交給不同的方法
- **405**：路徑存在，但不接受這個 Method

</v-clicks>

<v-click>

下一章我們會學怎麼把參數「讀出來」：`@RequestParam` 和 `@RequestBody`。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）GET 用來查詢，參數放在 URL。POST 用來新增，參數放在 Request Body。在 Spring Boot 裡用 method 來指定。同一個路徑可以依照 Method 交給不同的方法。405 代表路徑存在，但不接受這個 Method。

（最後一步）今天我們只讓店員分辨「問」和「填單」，還沒有真的去聽客人問了什麼、單子上寫了什麼。下一章就來學怎麼把參數讀出來。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

記得那句話：用問的是 GET，填單交出去是 POST。

有任何問題歡迎提出來。
-->
