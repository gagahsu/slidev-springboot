---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Http 協議介紹
routeAlias: ch13
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
    Http 協議介紹
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「前後端溝通的格式規範，每次請求都在遵守它」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十三章！

上一章我們知道了網站分成前端和後端。前端是使用者看到的畫面，後端是我們用 Spring Boot 寫的程式。

那前端和後端之間，到底是怎麼「講話」的？這就是今天的主題：Http 協議。

名字聽起來很硬，但它做的事情，跟你去手搖飲店點一杯飲料幾乎一模一樣。所以今天我們先去買飲料。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **前端和後端怎麼「講話」？** 用手搖飲店點飲料的故事來理解
- **一次請求、一次回應裡面裝了什麼？** 其實就是一張點單、一張取餐單
- **親手發一次請求**：用 Postman 這個工具試試看

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，前端和後端是怎麼講話的。我們用手搖飲店點飲料的故事來理解。

（下一步）第二，一次請求、一次回應裡面到底裝了什麼。先劇透：其實就是一張點單，和一張取餐單。

（下一步）第三，我們會用一個叫 Postman 的工具，親手發一次請求給後端。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 先去買一杯飲料

<!--
我們先不講網路，先去買飲料。

大家都點過手搖飲吧？請回想一下點飲料的過程，等一下會一直用到。
-->

---

# 如果每個人都用自己的方式點…

<DrinkShop mode="chaos" />

<!--
想像有一間飲料店，它沒有菜單、也沒有點單，客人想怎麼點就怎麼點。

第一位客人說「那個綠綠的那個」。第二位說「老樣子」。第三位說「隨便來一杯」。

（下一步）店員聽得懂嗎？完全聽不懂。綠綠的是哪一杯？老樣子是什麼？結果一杯都做不出來。

（下一步）所以店家規定：不管你是誰，通通照同一張點單寫。格式統一了，店員才看得懂。

請記住這個結論：兩邊要溝通，就要先約好同一種格式。
-->

---

# 點單：客人交給店員

<DrinkShop mode="request" />

<!--
我們來看這張點單長什麼樣子。它總共有四格，客人要一格一格填。

（下一步）第一格：我要做什麼。是要點一杯新的？還是要改剛剛那杯？還是要取消？這裡是「點一杯新的」。

（下一步）第二格：要找哪個品項。這裡是珍珠奶茶。

（下一步）第三格：備註。少冰、半糖。

（下一步）第四格：詳細內容。大杯、加椰果。四格都填好了，就把點單交給店員。

請大家記住「四格」這個數字，等一下會再出現。
-->

---

# 取餐單：店員交回給客人

<DrinkShop mode="response" />

<!--
店員收到點單、把飲料做好之後，也會交回一張東西給你，我們叫它取餐單。它有三格。

（下一步）第一格：結果。做好了。

（下一步）第二格：備註。店員提醒你小心冰、盡快喝完。

（下一步）第三格：你要的東西，也就是那杯珍珠奶茶。這一格最重要，因為這才是你真正想要的。

所以一來一回，就是一張四格的點單，換回一張三格的取餐單。
-->

---

# 不是每次都拿得到飲料

<DrinkShop mode="status" />

<!--
不過，點了飲料，不一定每次都拿得到。我們來看四種可能的結果。

（下一步）最好的情況：店員說「做好了」。一切順利。

（下一步）第二種：店員說「我們沒有賣這個」。你點了一杯店裡根本沒有的飲料。這是誰的問題？是客人這邊的問題。

（下一步）第三種：店員說「點單寫錯了，看不懂」。這也是客人這邊的問題。

（下一步）第四種：店員說「抱歉，機器壞了」。點單沒寫錯、品項也有賣，但店裡的機器壞了。這就是店家這邊的問題，不是你的錯。

所以拿不到飲料的時候，要先分清楚：是客人這邊的問題，還是店家這邊的問題。
-->

---

# 小測驗：這是誰的問題？

<Poll question="你點了一杯這間店根本沒有賣的飲料，當然拿不到。這是誰的問題？" options="客人這邊的問題|店家這邊的問題|沒有人有問題" answer="1" />

<!--
來一題暖身題。

你點了一杯這間店根本沒有賣的飲料，當然拿不到。這是誰的問題？

（等大家作答）

（下一步）答案是客人這邊的問題。店家沒有做錯任何事，是點的人點錯了。

請記住這題，等一下我們會用同一個邏輯來看網站的錯誤。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 把飲料店換成網站

<!--
故事講完了。現在我們把飲料店換成網站。

一樣的，故事的結構不變，只是把角色換掉。
-->

---

# 角色對照：飲料店 = 網站

<Pairs left="飲料店" right="網站" rows="customer,客人=browser,前端（瀏覽器、手機 App）|shop,飲料店=server,後端（我們寫的 Spring Boot）|form,點單=code,Http Request（請求）|cup,取餐單和飲料=code,Http Response（回應）" />

<!--
我們一個一個對照。

（下一步）客人，對應到前端。也就是瀏覽器，或是手機上的 App。

（下一步）飲料店，對應到後端。也就是我們用 Spring Boot 寫的程式。

（下一步）點單，對應到 Http Request，中文叫「請求」。前端想要什麼，就寫一張請求送給後端。

（下一步）取餐單和飲料，對應到 Http Response，中文叫「回應」。後端處理完，就寫一張回應送回給前端。

Request 和 Response 這兩個英文字，之後每一堂課都會出現，請大家先跟它們混熟。
-->

---

# 所以，什麼是 Http 協議？

<v-clicks>

- **協議**：大家事先約好、一起遵守的規則
- **Http**：網路世界裡最常用的那一套規則
- 它規定了 **Request（請求）** 和 **Response（回應）** 各自要怎麼寫

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> Http 協議就是前端和後端共用的「點單格式」。Spring MVC 就是照著這套規則在運作的。
</div>

</v-click>

<!--
現在可以回答今天的第一個問題了：什麼是 Http 協議？

（下一步）「協議」這兩個字，意思就是大家事先約好、一起遵守的規則。就像飲料店規定大家要用同一張點單。

（下一步）Http，是網路世界裡最常用的那一套規則。

（下一步）它規定的內容，就是請求和回應各自要怎麼寫。

（下一步）一句話記起來：Http 協議就是前端和後端共用的點單格式。我們之後要學的 Spring MVC，就是照著這套規則在運作的。
-->

---

# 圖解：一次請求的來回

<HttpExchange />

<!--
我們用動畫把整個過程看一次，這次是網站的版本。

左邊是前端，右邊是後端。

（下一步）前端想要資料，就把需求寫成一張 Http Request。看到了嗎？它有四個部分，就是點單的那四格。

（下一步）Request 送到後端，後端依照內容去處理。

（下一步）處理完，後端把結果寫成一張 Http Response。它有三個部分，就是取餐單的那三格。

（下一步）Response 回到前端，一次請求就完成了。

接下來我們把這兩張單子分別打開來看。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 請求（Request）裡面有什麼

<!--
先看請求，也就是前端交給後端的那張點單。
-->

---

# 請求的四個部分

<DrinkShop mode="request" terms />

<!--
還記得點單有四格嗎？Http Request 也是四個部分，而且一格對一格。這次我把它們真正的名字寫在右邊。

（下一步）第一格「我要做什麼」，真正的名字叫 Http Method。Method 就是「方法、動作」的意思。這裡的 POST 代表新增。

（下一步）第二格「找哪個品項」，真正的名字叫 URL，也就是網址。它告訴後端，我要找你的哪一個功能。

（下一步）第三格「備註」，叫做 Header。它放的是一些附加資訊，例如「我送過去的資料是什麼格式」。

（下一步）第四格「詳細內容」，叫做 Body。它放的是要一起送過去的資料。

Method、URL、Header、Body。這四個名字請多念幾次。
-->

---

# 真正的請求長這樣

不用背，只要看得出「哪一塊是哪一塊」就好：

<CodeSteps>

```text {1|2-3|5}
POST /users HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{"name": "Alice", "age": 20}
```

- 第一行：**Method**（`POST`）和要找的路徑（`/users`）
- 中間幾行：**Header**，一行寫一個備註
- 空一行之後：**Body**，要送過去的資料

</CodeSteps>

<!--
這是一張真正的 Http Request 寫出來的樣子。先說，這個不用背，只要看得出哪一塊是哪一塊就好。

第一行，最前面的 POST 就是 Method。後面的 /users 是要找的路徑，也就是 URL 的一部分。

（下一步）中間這幾行是 Header。一行寫一個備註，格式是「名稱、冒號、內容」。

（下一步）空一行之後，就是 Body。這裡送了一筆資料：名字是 Alice，年齡是 20。

是不是跟點單一樣，只是寫法比較像電腦在看的樣子。
-->

---

# Http Method：這次要做什麼

<Pairs left="在飲料店" right="Http Method" rows="form,看一下菜單=,GET：取得資料|cup,點一杯新的=,POST：新增資料|cup,整杯重新做一杯=,PUT：修改資料（整個換掉）|what,只改甜度=,PATCH：修改資料（只改一部分）|no,取消訂單=,DELETE：刪除資料" />

<!--
四個部分裡，Method 最常被問到，我們多看一下。Method 表達的是「這次要做什麼」，最常用的有五種。

（下一步）看一下菜單，對應到 GET，取得資料。這是最常用的一種，你平常打開任何網頁，都是在發 GET。

（下一步）點一杯新的，對應到 POST，新增資料。

（下一步）整杯重新做一杯，對應到 PUT，修改資料，而且是整個換掉。

（下一步）只改甜度，對應到 PATCH，一樣是修改，但只改其中一部分。

（下一步）取消訂單，對應到 DELETE，刪除資料。

GET 取、POST 增、PUT 整個改、PATCH 改一點、DELETE 刪。另外補充一點，GET 和 DELETE 通常不需要帶 Body，就像看菜單不需要填詳細內容一樣。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 回應（Response）裡面有什麼

<!--
接著看回應，也就是後端交回給前端的那張取餐單。
-->

---

# 回應的三個部分

<DrinkShop mode="response" terms />

<!--
取餐單有三格，Http Response 也是三個部分。

（下一步）第一格「結果」，真正的名字叫 Status Code，狀態碼。它用一個數字告訴你這次請求的結果。這裡的 200 OK 代表成功。

（下一步）第二格「備註」，一樣叫 Header。

（下一步）第三格「你要的東西」，一樣叫 Body。這是整個回應裡最重要的部分，因為它就是後端真正要給你的資料。

所以 Header 和 Body 在請求和回應裡都有，只有第一格不一樣：請求是 Method，回應是 Status Code。
-->

---

# 真正的回應長這樣

<CodeSteps>

```text {1|2|4}
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8

Hello World
```

- 第一行：**Status Code**，`200 OK` 代表成功
- 中間：**Header**，一樣是備註
- 空一行之後：**Body**，後端真正要給你的資料

</CodeSteps>

<!--
這是一張真正的 Http Response。

第一行就是 Status Code，200 OK，代表成功。

（下一步）中間是 Header。

（下一步）空一行之後是 Body。這裡後端回傳的資料是 Hello World 這幾個字。

格式跟請求幾乎一樣，都是「第一行、Header、空一行、Body」。
-->

---

# Status Code：結果怎麼樣

<DrinkShop mode="status" terms />

<!--
還記得「不是每次都拿得到飲料」嗎？網站也一樣，結果有好幾種。後端會用一個三位數字來表示，這個數字就叫 Status Code。

（下一步）店員說「做好了」，對應到 200。只要是 2 開頭，就代表成功。

（下一步）店員說「我們沒有賣這個」，對應到 404。這個數字大家一定看過，網頁找不到的時候就會出現。4 開頭代表是前端，也就是發請求那一方的問題。

（下一步）「點單寫錯了，看不懂」，對應到 400。一樣是 4 開頭，一樣是前端的問題。

（下一步）「抱歉，機器壞了」，對應到 500。5 開頭代表後端自己出錯了。

所以看到 Status Code，先看第一個數字：2 是成功，4 是前端的問題，5 是後端的問題。
-->

---

# 常見的 Status Code

<v-clicks>

| 狀態碼 | 意思 | 飲料店會怎麼說 |
| --- | --- | --- |
| **200** OK | 成功 | 「做好了」 |
| **201** Created | 新增成功 | 「新訂單收到了」 |
| **400** Bad Request | 請求寫錯了 | 「點單看不懂」 |
| **401** Unauthorized | 還沒登入 | 「請先出示會員卡」 |
| **403** Forbidden | 登入了，但沒有權限 | 「這是員工限定的」 |
| **404** Not Found | 找不到 | 「我們沒有賣這個」 |
| **500** Internal Server Error | 後端程式出錯 | 「機器壞了」 |

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>先看第一個數字：</b> 2 開頭是成功；4 開頭是前端（發請求的人）的問題；5 開頭是後端的問題。
</div>

</v-click>

<!--
這張表是最常見的幾個 Status Code。不用今天全部背起來，以後常常會遇到，自然就記得了。

（依序按下一步，每個唸過去）200 是成功。201 是新增成功。400 是請求寫錯了。401 是還沒登入，就像店員請你先出示會員卡。403 是登入了但沒有權限，就像這杯是員工限定的。404 是找不到。500 是後端程式出錯。

（最後一步）最重要的還是這句：先看第一個數字。2 開頭成功，4 開頭是前端的問題，5 開頭是後端的問題。
-->

---

# 小測驗：這次是誰的問題？

<Poll question="後端程式執行到一半出錯了。前端會收到哪一種開頭的 Status Code？" options="2 開頭|4 開頭|5 開頭" answer="3" />

<!--
再來一題，這次是網站的版本。

後端程式執行到一半出錯了，前端會收到哪一種開頭的 Status Code？

（等大家作答）

（下一步）答案是 5 開頭。

這就是「機器壞了」的情況。請求本身沒有寫錯，是後端自己出了問題。

以後你在開發的時候看到 500，第一件事就是回去看後端的 console，錯誤訊息通常就印在那裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 親手發一次請求

<!--
觀念都講完了，最後我們親手發一次請求。

問題是，我們現在還沒有做前端畫面，要怎麼發請求給後端？這就需要一個工具。
-->

---

# Postman 是什麼？

**Postman** 是一個可以「假裝成前端」的工具，讓我們自己填點單、送給後端。

<v-clicks>

- 我們還沒有做前端畫面，但想先測試後端有沒有寫對
- 瀏覽器的網址列只能發 `GET`，發不了 `POST`、`PUT`、`DELETE`
- Postman 可以把請求的四個部分都自己填好，再送出去

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>值得學：</b> Postman 是業界最常用的 API 測試工具，後端工程師幾乎每天都會用到。
</div>

</v-click>

<!--
這個工具叫做 Postman。你可以把它想成一個「假裝成前端」的工具，讓我們自己填點單，然後送給後端。

（下一步）為什麼需要它？第一，我們還沒有做前端畫面，但想先測試後端有沒有寫對。

（下一步）第二，瀏覽器的網址列只能發 GET。你想發 POST、PUT、DELETE，瀏覽器的網址列做不到。

（下一步）Postman 可以把請求的四個部分，Method、URL、Header、Body，都自己填好再送出去。

（下一步）而且它是業界最常用的 API 測試工具，後端工程師幾乎每天都會用到，所以很值得現在就學起來。
-->

---

# 安裝 Postman

| 步驟 | 操作 |
| --- | --- |
| **① 下載** | 到 [postman.com/downloads](https://www.postman.com/downloads/) 下載對應作業系統的版本（Windows / macOS / Linux） |
| **② 安裝** | 執行安裝程式，依預設選項完成安裝 |
| **③ 首次開啟** | 會出現登入畫面，可以註冊免費帳號，或選擇不登入直接使用 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>要不要註冊帳號？</b> 不登入也能發請求。註冊免費帳號後，存下來的請求可以跨裝置使用，建議註冊。
</div>

<!--
安裝很簡單，三個步驟。

到 Postman 的官網下載對應你作業系統的版本，執行安裝程式，一路用預設選項就可以了。

第一次打開會出現登入畫面。不登入也可以發請求，但我建議註冊一個免費帳號，這樣你存下來的請求換一台電腦也還在。
-->

---

# Postman 介面導覽

<img src="/screenshots/ch13-postman-interface.png" alt="Postman 介面總覽" style="width:100%; max-height:440px; object-fit:contain; margin-top:8px;" />

<p class="text-sm text-gray-500 text-center mt-1">今天會用到的是 <b>Sidebar</b>（存下來的請求）和 <b>Workbench</b>（發請求、看回應的主要區域）</p>

<!--
這是 Postman 打開之後的畫面。第一次看可能覺得東西很多，其實今天只會用到兩個區域。

左邊的 Sidebar，放的是你存下來的請求。

中間最大的這一塊叫 Workbench，是我們發請求、看回應的主要區域。等一下的操作都在這裡。
-->

---

# Postman 的畫面，就是一張點單

| Postman 上的位置 | 對應到什麼 |
| --- | --- |
| **Method 下拉選單** | Http Method：`GET`、`POST`… |
| **URL 輸入框** | URL：要找後端的哪個功能 |
| **Headers 頁籤** | Header：備註 |
| **Body 頁籤** | Body：要送過去的資料 |
| **Send 按鈕** | 把請求送出去 |
| **下半部的 Response 區** | 後端的回應：Status Code、Header、Body |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>有沒有發現：</b> 上半部就是請求的四個部分，下半部就是回應的三個部分。Postman 的畫面是照著 Http 協議設計的。
</div>

<!--
我們把 Workbench 放大來看。你會發現，它其實就是一張點單。

最左邊的下拉選單選 Method。旁邊的輸入框填 URL。下面有 Headers 頁籤和 Body 頁籤，分別填 Header 和 Body。這不就是請求的四個部分嗎？

填好之後按 Send，把請求送出去。

送出去之後，下半部會顯示後端的回應，裡面有 Status Code、Header、Body，也就是回應的三個部分。

所以今天學的觀念，在這個工具上一格一格都找得到。
-->

---

# 練習：發起請求並查看回應

確認後端有以下這段程式在執行（上一章寫過的）：

```java
@RestController
public class MyController {

    @RequestMapping("/test")
    public String test() {
        System.out.println("Hi!");
        return "Hello World";
    }
}
```

在 Postman 中：Method 選 `GET`，URL 填 `http://localhost:8080/test`，按下 **Send**。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>預期結果：</b> Status 顯示 <b>200 OK</b>，Body 顯示 <b>Hello World</b>，後端的 console 印出 <b>Hi!</b>
</div>

<!--
現在請大家跟著做一次。

先確認後端有這段程式在執行。這是我們之前寫過的，現在不用看懂每一行，只要知道兩件事：有人來找 /test 的時候，它會印出 Hi，然後回傳 Hello World。

接著打開 Postman。Method 選 GET，URL 填 localhost 8080 斜線 test，然後按 Send。

如果一切順利，你會看到 Status 是 200 OK，Body 是 Hello World，而且後端的 console 會印出 Hi。

（給大家時間操作，走下去看看有沒有人卡住）
-->

---

# 圖解：按下 Send 之後發生什麼事

<Flow nodes="Postman:假裝成前端|MyController:我們的後端程式|Console:後端的輸出視窗" steps="1>2:GET http://localhost:8080/test|2>3:印出 Hi!|2>1:200 OK ・ Hello World" />

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對照剛剛的練習：</b> 第一條線是 Http Request，最後一條線是 Http Response。中間那一步只發生在後端，前端看不到。
</div>

<!--
剛剛按下 Send 之後，背後其實發生了三件事。

（下一步）第一，Postman 發出一張 Http Request：Method 是 GET，URL 是 localhost 8080 斜線 test。它被送到我們的後端程式。

（下一步）第二，後端程式開始執行，先在 console 印出 Hi。請注意，這一步只發生在後端，Postman 那邊是看不到的。就像你在櫃台看不到廚房裡的事。

（下一步）第三，後端把 Hello World 包成一張 Http Response 送回去，Status Code 是 200 OK。

所以如果 Postman 看到 200 和 Hello World，console 也印出了 Hi，就代表整條路都走通了。
-->

---

# 一張圖複習今天的內容

<Pairs left="飲料店" right="網站" rows="form,統一的點單格式=code,Http 協議|form,點單的四格=code,Request：Method、URL、Header、Body|cup,取餐單的三格=code,Response：Status Code、Header、Body|what,客人點錯 / 店家出包=code,4 開頭 / 5 開頭的 Status Code" />

<!--
我們用一張圖複習今天的內容。

（下一步）統一的點單格式，就是 Http 協議。

（下一步）點單的四格，就是 Request 的四個部分：Method、URL、Header、Body。

（下一步）取餐單的三格，就是 Response 的三個部分：Status Code、Header、Body。

（下一步）客人點錯，是 4 開頭的 Status Code；店家出包，是 5 開頭。

以後忘記的時候，就回想一下點飲料的過程。
-->

---

# 章節總結

<v-clicks>

- **Http 協議**：前端和後端共用的「點單格式」
- **Request（請求）** 有四個部分：Method、URL、Header、Body
- **Response（回應）** 有三個部分：Status Code、Header、Body
- **Status Code** 先看第一個數字：2 成功、4 前端的問題、5 後端的問題
- **Postman**：假裝成前端，讓我們自己發請求來測試後端

</v-clicks>

<v-click>

下一章我們會學怎麼在 Spring Boot 裡設定「哪個網址，要交給哪一段程式處理」。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）Http 協議是前端和後端共用的點單格式。Request 有四個部分。Response 有三個部分。Status Code 先看第一個數字。Postman 可以假裝成前端，讓我們自己發請求來測試後端。

（最後一步）今天我們是直接用了一段寫好的後端程式。下一章，我們會學怎麼自己設定「哪個網址，要交給哪一段程式處理」。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

如果名詞一下子太多記不住，沒關係。只要記得「一張四格的點單，換回一張三格的取餐單」，其他的之後每一章都會反覆出現。

有任何問題歡迎現在提出來。
-->
