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

上一章我們知道了 Spring MVC 是用來讓前後端溝通的，但前後端溝通要有一套共同遵守的格式規範，這套規範就叫做 Http 協議。

今天這章以概念和格式規範為主，學完之後你會清楚了解每次 API 請求和回應的背後長什麼樣子，也會學會用工具來模擬發送 Http request。
-->

---
layout: default
---

# Outline

- **什麼是 Http 協議？** — 前後端為什麼需要共同規範
- **Http Request 的格式規範** — 請求由哪些部分組成、Http Method 的種類
- **Http Response 的格式規範** — 回應由哪些部分組成、常見 Status Code
- **Postman 介紹、安裝與使用** — 用業界最主流的工具發起請求、查看完整回應

<!--
今天的章節涵蓋的內容比較廣，但每個部分都很直覺。

Http Request 和 Http Response 是這章最核心的兩個概念，搞清楚這兩者的格式，後面學 @RequestParam、@RequestBody 時就會知道這些 Annotation 是在對應 Request 的哪個部分。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 什麼是 Http 協議？

<!--
在進入 Request 和 Response 的格式之前，先來理解「Http 協議」存在的意義。
-->

---

# 為什麼需要 Http 協議？

前端和後端要溝通，但如果沒有統一的格式規範，溝通就會變成這樣：

| 情境 | 問題 |
| --- | --- |
| 前端說「給我商品清單」 | 後端不知道這是哪種類型的請求 |
| 後端回傳資料 | 前端不知道這次請求是成功還是失敗 |
| 前端傳參數 | 後端不知道參數放在哪裡、格式是什麼 |

Http 協議就是為了解決這個問題——**規定資料的傳輸格式，讓前端和後端有效地進行資料溝通。**

<!--
想像兩個人要溝通，但一個說中文、一個說英文，結果就是雞同鴨講。

前端和後端之間也有同樣的問題：前端要怎麼表達「我想取得商品清單」？後端要怎麼告訴前端「這次請求成功了，這是資料」？

Http 協議就是前後端共同說好的「語言格式」——雙方都照這個格式來，就能順暢溝通。
-->

---

# Http 協議的定義

**「Http 協議負責規定資料的傳輸格式，讓前端和後端能有效地進行資料溝通。」**

| 概念 | 說明 |
| --- | --- |
| **Http** | HyperText Transfer Protocol，超文字傳輸協定 |
| **協議（Protocol）** | 雙方都同意遵守的規則和格式 |
| **兩大組成** | Http Request（前端發送給後端）+ Http Response（後端回傳給前端） |

Http 是目前 Web 開發中最主流的前後端通訊協定，Spring MVC 就是建立在 Http 協議之上的。

<!--
Http 全名是 HyperText Transfer Protocol，翻譯成「超文字傳輸協定」。這個名字聽起來很學術，但理解它的概念非常直覺。

「協議」就是一種約定，就像開車要靠右走、紅燈停綠燈行——大家都同意遵守，就能避免混亂。

Http 協議的核心就是兩件事：一個 Request（前端問後端）和一個 Response（後端答前端）。

整個 Spring MVC 的運作，底層都遵守這套 Http 的格式規範。所以搞清楚 Http，你就搞清楚了 Spring MVC 的底層邏輯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# Http Request 的格式規範

<!--
了解了 Http 協議是什麼，我們來仔細看第一個組成：Http Request，也就是前端送給後端的「請求」長什麼樣子。
-->

---

# Http Request 的四個組成部分

前端發送給後端的 Http Request，由以下四個部分組成：

| 部分 | 說明 | 例子 |
| --- | --- | --- |
| **Http Method** | 請求的動作類型 | `GET`、`POST`、`PUT`、`DELETE` |
| **URL** | 請求的目標網址 | `http://localhost:8080/test` |
| **Request Header** | 請求的附加資訊，以 key-value 格式傳遞 | `Content-Type: application/json` |
| **Request Body** | 請求夾帶的資料（僅 POST / PUT 可用） | `{"name": "Alice", "age": 20}` |

<!--
Http Request 就像寄一封信：你要說明寄的是什麼類型的信（Method）、寄給誰（URL）、信封上的資訊（Header），以及信的內容（Body）。

其中 Request Body 只有 POST 和 PUT 可以帶，GET 和 DELETE 沒有 Body。

這個結構非常重要——後面學 @RequestParam、@PathVariable、@RequestBody 時，你會發現這些 Annotation 分別對應到 Request 的不同部分。
-->

---

# Http Request 格式範例

一個向後端取得資料的 GET 請求，格式如下：

```
GET /test HTTP/1.1
Host: localhost:8080
Content-Type: application/json
```

一個帶有資料的 POST 請求，格式如下：

```
POST /users HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{"name": "Alice", "age": 20}
```

<!--
看這兩個範例，GET 請求沒有 Body，只有 Method、URL、Header。

POST 請求在 Header 之後空一行，然後才是 Body——Body 裡放的是我們要傳給後端的 JSON 資料。

注意這個格式規範是固定的：Method 和 URL 在第一行，Header 緊接在後，Body 在空行之後。這個格式是 Http 協議規定的，Spring MVC 就是按照這個格式來解析請求的。
-->

---

# Http Method — 常見的請求動作

Http Method 用來表達「這次請求想做什麼事」：

| Method | 對應動作 | 說明 |
| --- | --- | --- |
| **GET** | 取得資料 | 最常見，不帶 Request Body |
| **POST** | 新增資料 | 帶 Request Body，傳遞要新增的資料 |
| **PUT** | 修改資料（完整替換） | 帶 Request Body，傳遞完整的修改後資料 |
| **PATCH** | 修改資料（部分更新） | 帶 Request Body，只傳遞要修改的欄位 |
| **DELETE** | 刪除資料 | 不帶 Request Body |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶方式：</b> GET 取、POST 增、PUT 改（整個換掉）、PATCH 改（只換一部分）、DELETE 刪——對應 CRUD 操作。
</div>

<!--
Http Method 用來表示這次請求的「意圖」——你想取得資料？新增資料？修改還是刪除？

GET 是最常見的，每次你在瀏覽器輸入網址按 Enter，其實就是發出一個 GET 請求。

POST 用來新增，通常 Request Body 裡帶著要新增的資料（JSON 格式）。

PUT 和 PATCH 都是修改，差別在於 PUT 是完整替換整筆資料，PATCH 是只更新其中幾個欄位。

DELETE 顧名思義是刪除，通常透過 URL 傳遞要刪除的 ID，不需要 Body。

這五個 Method 和資料庫的 CRUD（Create、Read、Update、Delete）操作一一對應，後面學 RESTful API 時會更深入地用到它們。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# Http Response 的格式規範

<!--
有 Request 就有 Response。後端接收到請求、處理完之後，要把結果回傳給前端，這個回傳的內容就是 Http Response。
-->

---

# Http Response 的三個組成部分

後端回傳給前端的 Http Response，由以下三個部分組成：

| 部分 | 說明 | 例子 |
| --- | --- | --- |
| **Http Status Code** | 表達這次請求的結果（成功 / 失敗 / 錯誤類型） | `200`、`404`、`500` |
| **Response Header** | 回應的附加資訊，以 key-value 格式傳遞 | `Content-Type: application/json` |
| **Response Body** | 後端要回傳給前端的資料，是 Response 中最重要的部分 | `"Hello World"`、`{"id": 1, "name": "Alice"}` |

<!--
Response 的結構比 Request 少一個 Method 和 URL（因為這是「答」，不是「問」），多了 Status Code 來表達結果。

其中 Response Body 是最重要的部分——這就是前端真正需要的資料，可能是一個字串、一個 JSON 物件、或一整個 JSON 陣列。

Spring MVC 的 @RestController 自動幫我們把 Java 物件轉成 JSON 格式放進 Response Body 回傳給前端。
-->

---

# Http Response 格式範例

一個成功的 GET 請求回應，格式如下：

```
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8

Hello World
```

一個資源不存在的錯誤回應，格式如下：

```
HTTP/1.1 404 Not Found
Content-Type: application/json

{"error": "Resource not found"}
```

<!--
看第一個範例：第一行是 Http 版本加上 Status Code（200 OK），接著是 Header，空一行後是 Body（Hello World）。

第二個範例是 404 錯誤：Status Code 是 404 Not Found，Body 是一個 JSON 格式的錯誤訊息。

這個結構和 Request 很像：版本 + 狀態碼在第一行，Header 緊接在後，Body 在空行之後。

在 Spring Boot 裡，我們不需要手動組裝這個格式——Spring MVC 幫我們搞定了，我們只需要在 Controller 方法裡 return 資料就好。
-->

---

# Http Status Code — 常見狀態碼

Status Code 用三位數字表達「這次請求的結果」：

| 狀態碼 | 名稱 | 意義 |
| --- | --- | --- |
| **200** | OK | 請求成功 |
| **201** | Created | 新增成功 |
| **400** | Bad Request | 請求格式有誤（前端的問題） |
| **401** | Unauthorized | 未登入，需要先驗證身份 |
| **403** | Forbidden | 已登入但無此操作的權限 |
| **404** | Not Found | 請求的資源不存在 |
| **500** | Internal Server Error | 後端程式發生錯誤 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶方式：</b> 2xx = 成功；4xx = 前端（請求方）的問題；5xx = 後端（伺服器）的問題。
</div>

<!--
Status Code 的分組規則很好記：

2xx 代表成功：200 是一般的成功，201 是新增成功。

4xx 代表前端請求有問題：400 是格式錯誤，401 是沒登入，403 是沒權限，404 是找不到。

5xx 代表後端出了問題：500 是後端程式崩了，通常是 bug 或例外沒有被正確處理。

開發時最常看到的是 200（成功）、400（參數傳錯了）、404（URL 打錯或資源不存在）、500（後端有 bug）。

記住這個分組邏輯，以後看到 Status Code 就知道問題出在哪裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 用 Postman 練習發起 Http Request

<!--
概念都清楚了，現在我們來實際動手，用工具發起一個 Http request，觀察完整的 Request 和 Response 格式。

這個工具就是 Postman——業界最主流的 API 測試工具。
-->

---

# Postman 是什麼？

**Postman** 是業界最主流的 API 測試工具，讓我們能在沒有前端的情況下，直接發起 Http request 測試後端 API：

| 項目 | 說明 |
| --- | --- |
| **用途** | 模擬前端發送 Http request，查看後端的完整 Http response |
| **為什麼需要** | 瀏覽器網址列只能發 `GET` 請求，無法測試 `POST`、`PUT`、`DELETE` |
| **業界地位** | 幾乎每個後端團隊都在用，實際工作中每天都會碰到 |
| **進階功能** | Collection 管理 API、環境變數（開發/測試/正式）、測試腳本、團隊共享 |

<!--
在開發後端 API 的時候，我們需要一個方式來測試「這個 API 有沒有正常運作」。

最直覺的方式是用瀏覽器輸入網址——但瀏覽器只能發 GET 請求，沒辦法發 POST、PUT、DELETE，也看不到完整的 Status Code 和 Header。

Postman 就解決了這個問題：自由選擇 Http Method、填入 URL 和 Body，模擬各種類型的 Http request，然後直接看到後端回傳的完整 Response。

選 Postman 的理由很簡單：它是業界最主流的工具，幾乎每個公司都在用。現在學會，之後工作直接無縫接軌。它還有很多進階功能——把 API 整理成 Collection、切換環境、寫測試腳本——這些之後用到再學，今天先掌握最核心的「發請求、看回應」。
-->

---

# 安裝 Postman

| 步驟 | 操作 |
| --- | --- |
| **① 下載** | 到 [postman.com/downloads](https://www.postman.com/downloads/) 下載對應作業系統的版本（Windows / macOS / Linux） |
| **② 安裝** | 執行安裝程式，依預設選項完成安裝 |
| **③ 首次開啟** | 會出現登入畫面——可以註冊免費帳號，或選擇不登入直接使用 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>要不要註冊帳號？</b> 不登入也能發請求（輕量模式）。註冊免費帳號後，Collection 會雲端同步、可跨裝置使用——建議註冊，工作上一定用得到。
</div>

<!--
安裝很簡單，三步：官網下載、安裝、開啟。

第一次打開 Postman 會請你登入。這裡很多人卡住——其實可以不登入，選擇輕量模式（lightweight API client）直接用，發請求的核心功能都在。

不過建議大家還是註冊一個免費帳號：註冊之後你整理的 API 請求會同步到雲端，換電腦也能用，之後工作上跟團隊共享 Collection 也需要帳號。免費版對個人使用完全夠用。

裝好之後，下一頁先認識一下介面。
-->

---

# Postman 介面導覽

<img src="/screenshots/ch13-postman-interface.png" alt="Postman 介面總覽" style="width:100%; max-height:440px; object-fit:contain; margin-top:8px;" />

<p class="text-sm text-gray-500 text-center mt-1">今天會用到的是 <b>Sidebar</b>（儲存的請求）和 <b>Workbench</b>（發請求、看回應的主工作區）</p>

<!--
這是 Postman 官方的介面總覽圖，五個區域：Sidebar、Header、Workbench、Right Sidebar、Footer。

今天真正會用到的只有兩塊：左邊的 Sidebar 放你儲存過的請求（Collections），中間的 Workbench 是主要工作區——所有「發請求、看回應」的動作都在這裡完成。

看圖中間的 Workbench：最上面 GET 下拉選單選 Method，旁邊填 URL，右邊藍色的 Send 按鈕送出。URL 下方的 Params、Headers、Body 頁籤用來設定請求內容。下半部就是回應區——圖裡可以看到 200 OK 的 Status、耗時 144ms、回傳的 JSON Body。

右邊的 Right Sidebar 是文件和 AI 助手，Footer 有 Console 可以看原始的請求記錄——這些之後用到再說。

下一頁看 Workbench 裡發請求會用到的每個元件。
-->

---

# Workbench — 發起請求會用到的區域

| 區域 | 位置 | 功能 |
| --- | --- | --- |
| **New / +** | 分頁列 | 建立新的請求分頁 |
| **Method 下拉選單** | URL 列左側 | 選擇 `GET`、`POST`、`PUT`、`DELETE` 等 |
| **URL 輸入框** | 中間 | 填入請求的目標網址 |
| **Send 按鈕** | URL 列右側 | 送出請求 |
| **Params / Headers / Body 頁籤** | URL 列下方 | 設定請求的參數、Header、Body |
| **Response 區域** | 下半部 | 顯示回應的 Body、Status Code、Header、耗時 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對照 Http 協議：</b> 上半部請求區對應 Http Request 的四個組成部分；下半部回應區對應 Http Response 的三個組成部分——介面就是照著協議設計的。
</div>

<!--
把 Workbench 拆開來看，發一個請求會用到這幾個元件。

上半部是「請求區」：點 + 開新分頁，左邊下拉選 Method，中間填 URL，右邊按 Send。URL 下方的頁籤可以設定參數、Header、Body——這些後面章節學 @RequestParam、@RequestBody 的時候會大量用到。

下半部是「回應區」：送出請求後，這裡會顯示 Response Body，右上角有 Status Code、耗時、回應大小，切換頁籤可以看 Response Header。

對照一下前面學的格式：請求區的每個欄位對應 Http Request 的四個組成部分，回應區對應 Http Response 的三個組成部分——工具介面就是照著 Http 協議設計的。

下一頁實際發一個請求。
-->

---

# 練習：發起請求並查看回應

確認後端有以下 Controller 在運行：

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

在 Postman 中：Method 選 `GET`，URL 填 `http://localhost:8080/test`，點擊 **Send**。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>預期結果：</b> Status 顯示 <b>200 OK</b>，Response Body 顯示 <b>Hello World</b>，後端 console 印出 <b>Hi!</b>
</div>

<!--
這是我們一直在用的 MyController，現在用 Postman 來發送請求，可以看到完整的 Http Response。

操作步驟：開新分頁，Method 選 GET，URL 填 http://localhost:8080/test，按 Send。

送出之後，下半部的回應區會顯示：右上角 Status 是 200 OK，Body 頁籤顯示 Hello World，同時後端的 console 也會印出 Hi!。可以再點 Headers 頁籤，看看 Response Header 裡的 Content-Type。

這次練習的目的是讓大家親眼看到「一個完整的 Http request 和 response 長什麼樣子」。這個直覺建立好了，後面學各種 @RequestParam、@RequestBody 時，你會很清楚它們對應的是 Request 的哪個部分。
-->

---

# 章節總結

- **Http 協議**：規定前後端資料傳輸格式的規範；前端請求 = Http Request，後端回應 = Http Response
- **Http Request**：Method（動作）+ URL（目標）+ Header（附加資訊）+ Body（資料，POST/PUT 限定）
- **Http Method**：GET 取、POST 增、PUT 改（整體）、PATCH 改（部分）、DELETE 刪
- **Http Response**：Status Code（結果）+ Header（附加資訊）+ Body（回傳資料）
- **Status Code**：2xx 成功、4xx 前端問題（401 未登入、403 無權限、404 不存在）、5xx 後端問題
- **Postman**：業界最主流的 API 測試工具——選 Method、填 URL、按 Send，即可查看完整的 Response

下一章我們會學 `@RequestMapping` 的詳細用法，深入了解如何在 Spring Boot 中設定 URL 路徑對應。

<!--
好，今天的內容我們來整理一下。

Http 協議是前後端溝通的基礎規範，每一次 API 呼叫都在遵守這套格式。

Request 有四個部分：Method、URL、Header、Body。Method 告訴後端你想做什麼事，Body 只有 POST 和 PUT 可以帶。

Response 有三個部分：Status Code、Header、Body。Status Code 是最重要的——2xx 代表成功，4xx 代表前端請求有問題，5xx 代表後端出錯了。

學完今天這章，後面每次看到 @RequestParam、@RequestBody 的時候，你就知道它們分別是在對應 Request 的哪個部分了。

有問題嗎？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天把 Http 協議的完整格式都搞清楚了。

課後建議：用 Postman 多發幾次請求，試試看 GET 和 POST 有什麼不同，看看 Status Code 在什麼情況下會出現 404 或 500。

動手試過之後，這些格式會記得更清楚。

有問題嗎？
-->
