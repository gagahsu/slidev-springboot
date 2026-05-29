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
大家好，今天我們要聊的是後端開發中最常用到的兩個 Http Method：GET 和 POST。

在第十三章介紹 Http 協議時，我們提到 Http Method 代表「想對資源做什麼動作」。
但我們還沒有深入講 GET 和 POST 在傳遞資料的方式上有什麼不同。

這一章就是要把這個問題講清楚。學完之後，大家就會知道什麼情況該用 GET，什麼情況該用 POST。
-->

---
layout: default
---

# Outline

- **回顧：什麼是 Http Method？** — 五種 Method 與對應的 CRUD 操作
- **GET 的用法和特性** — 參數放 URL Query String、明信片比喻、適用情境
- **POST 的用法和特性** — 參數放 Request Body、信封比喻、適用情境
- **GET 和 POST 的比較** — 差異對照、API Tester 實際操作
- **章節總結** — 核心規則整理，下一章預告

<!--
先看今天的大綱。我們會先快速回顧 Http Method 的概念，然後分別深入看 GET 和 POST，最後做個比較。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回顧

## 什麼是 Http Method？

<!--
先回顧一下第十三章的內容。
-->

---

# 回顧：什麼是 Http Method？

Http Method 代表「前端想對後端的資源做什麼動作」：

| Http Method | 對應操作 | 說明 |
| --- | --- | --- |
| **GET** | 查詢（Read） | 取得資料 |
| **POST** | 新增（Create） | 送出資料，新增資源 |
| PUT | 完整更新（Update） | 取代整筆資料 |
| PATCH | 部分更新（Update） | 只修改部分欄位 |
| DELETE | 刪除（Delete） | 刪除資源 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>本章重點：</b> GET 和 POST 是最常用的兩種 Method，也是傳遞資料方式差異最大的兩種。
</div>

<!--
五種 Http Method 我們在第十三章都介紹過了。

今天的重點放在 GET 和 POST，因為這兩個是日常開發中最常用到的，也是傳遞資料方式最不一樣的兩種。

GET 用來查詢資料，POST 用來新增資料。但更重要的是，它們傳遞參數的方式完全不同，這正是今天要深入探討的核心。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## GET 的用法和特性

<!--
先來看 GET。
-->

---

# GET 的概念與特性

GET 就像寄一張「明信片」——內容完全公開，任何人都能看到：

| 特性 | 說明 |
| --- | --- |
| 參數位置 | 加在 URL 的後面（Query String） |
| 參數格式 | `?key=value`，多個用 `&` 分隔 |
| 可見性 | 參數**完全公開**，出現在 URL 裡 |
| 適合情境 | 查詢資料、搜尋、不含敏感資訊的請求 |
| 不適合情境 | 傳遞密碼、信用卡號等敏感資訊 |

<!--
古古用明信片來比喻 GET。明信片沒有信封，上面寫的東西任何人都能看到——郵差看得到，路上的人也看得到。

GET 就是這樣：我們把資料放在 URL 的後面，以 Query String 的方式傳送。
URL 是公開的，瀏覽器的網址列看得到，伺服器的 Log 也會記錄下來。

所以 GET 適合查詢資料，比如搜尋商品、查詢天氣，這些不含敏感資訊的請求。
但如果是密碼或信用卡號，千萬不要放在 GET 的 URL 裡。
-->

---

# GET 的 Query String 格式

GET 的參數跟在 URL 後面，用 `?` 開頭：

| 元素 | 說明 | 範例 |
| --- | --- | --- |
| `?` | Query String 的開始符號 | `http://localhost:8080/users?` |
| `key=value` | 一組參數 | `id=123` |
| `&` | 多個參數的分隔符號 | `id=123&name=Judy` |

完整範例：

```
http://localhost:8080/users?id=123&name=Judy
```

<!--
來看 GET 的 Query String 格式。

用問號 ? 開始，後面接 key=value 的組合。
如果有多個參數，用 & 符號分隔。

所以 http://localhost:8080/users?id=123&name=Judy 這個 URL，就是向 /users 路徑發送 GET 請求，帶了兩個參數：id 是 123，name 是 Judy。

大家有沒有在瀏覽器的網址列看過類似的 URL？例如 Google 搜尋的結果頁面，網址裡就有 q=搜尋關鍵字，那就是 Query String。
-->

---

# 在 Spring Boot 中使用 GET

用 `@RequestMapping` 加上 `method = RequestMethod.GET` 限制只接受 GET 請求：

```java
@RestController
public class MyController {

    @RequestMapping(value = "/users", method = RequestMethod.GET)
    public String getUsers() {
        return "取得使用者清單";
    }
}
```

<!--
在 Spring Boot 中，我們在 @RequestMapping 加上 method = RequestMethod.GET，就能讓這個路徑只接受 GET 請求。

如果前端用 POST 來呼叫 /users，Spring Boot 會回傳 405 Method Not Allowed 的錯誤。

注意我們目前還不知道怎麼接收 Query String 的參數，那是下一章要學的 @RequestParam。
現在先確認我們知道怎麼讓路徑只接受 GET 請求。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## POST 的用法和特性

<!--
了解 GET 之後，來看 POST。
-->

---

# POST 的概念與特性

POST 就像寄一個「密封信封」——內容藏在裡面，外人看不到：

| 特性 | 說明 |
| --- | --- |
| 參數位置 | 放在 Request 的 **Body** 裡 |
| 參數格式 | 通常是 JSON 格式 |
| 可見性 | 參數**隱藏**在 Body 中，不出現在 URL |
| 適合情境 | 新增資料、傳遞敏感資訊（如帳號密碼） |
| 不適合情境 | 單純查詢，不需要傳送資料的操作 |

<!--
POST 就像密封的信封。信封封起來之後，除了收件人，其他人看不到裡面的內容。

POST 的參數不放在 URL 裡，而是放在 Http Request 的 Body 裡。
Body 的內容不會顯示在瀏覽器的網址列，也相對較難被攔截和篡改。

所以 POST 適合新增資料，以及傳遞敏感資訊，例如登入時的帳號密碼就應該用 POST。
-->

---

# POST 的 Request Body 格式

POST 的參數放在 Request Body，通常以 JSON 格式傳送：

```json
{
    "id": 123,
    "name": "Judy"
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> 在 API Tester 中，可以在 Body 欄位選擇 <code>JSON</code> 類型，直接輸入 JSON 內容送出。
</div>

<!--
POST 的 Body 通常以 JSON 格式呈現，這也是為什麼我們在第十五章先學 JSON 格式。

用 API Tester 發送 POST 請求時，要在 Body 欄位選擇 JSON 類型，然後填入你要傳送的 JSON 資料。

API Tester 會自動在 Request Header 加上 Content-Type: application/json，告訴後端「我傳的是 JSON 格式」。
-->

---

# 在 Spring Boot 中使用 POST

用 `@RequestMapping` 加上 `method = RequestMethod.POST` 限制只接受 POST 請求：

```java
@RestController
public class MyController {

    @RequestMapping(value = "/users", method = RequestMethod.POST)
    public String createUser() {
        return "新增使用者";
    }
}
```

<!--
和 GET 一樣，只要把 method 改成 RequestMethod.POST，這個路徑就只接受 POST 請求。

如果前端用 GET 來呼叫 /users，會收到 405 Method Not Allowed。

同樣地，我們現在還不知道怎麼從 Request Body 讀取 JSON 資料，那是下一章要學的 @RequestBody。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## GET 和 POST 的比較

<!--
分別介紹完 GET 和 POST，來做個總結比較。
-->

---

# GET 和 POST 的比較

| 比較項目 | GET | POST |
| --- | --- | --- |
| 類比 | 明信片 | 密封信封 |
| 參數位置 | URL Query String | Request Body |
| 參數可見性 | 公開，出現在 URL | 隱藏，放在 Body |
| 適合操作 | 查詢（Read） | 新增（Create） |
| 安全性 | 較低 | 較高 |
| 常見使用場景 | 搜尋、篩選、查詢資料 | 登入、送出表單、新增資料 |

<!--
這張表格總結了 GET 和 POST 的核心差異。

最重要的一點就是參數位置：GET 放在 URL，POST 放在 Body。
這個差異決定了安全性、可見性、以及適合的使用場景。

另外補充一個實務上常見的問題：有些開發者習慣「什麼都用 POST」，理由是 POST 比較安全。
這個想法不算錯，但不夠精準。查詢資料用 GET 是語意上的約定，能讓 API 更容易理解和維護。
-->

---

# 在 API Tester 中測試 GET 和 POST

| 步驟 | GET 請求 | POST 請求 |
| --- | --- | --- |
| Method 選擇 | 選 `GET` | 選 `POST` |
| URL | `http://localhost:8080/users?id=123` | `http://localhost:8080/users` |
| Body | 不需要填寫 | 填入 JSON：`{"id": 123, "name": "Judy"}` |
| Content-Type | 不需要設定 | 設為 `application/json` |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 用 GET 卻設定了 Body、或用 POST 卻把參數放在 URL，都是常見的初學者錯誤。
</div>

<!--
最後來看怎麼在 API Tester 中發送 GET 和 POST 請求。

GET：選 GET Method，把參數加在 URL 後面的 Query String，Body 留空。
POST：選 POST Method，URL 不加參數，把 JSON 資料填在 Body 欄位，Content-Type 設為 application/json。

⚠️ 初學者最常犯的錯誤是：發 GET 卻去填 Body，或是發 POST 卻把參數放在 URL。

記住口訣：GET 參數在 URL，POST 參數在 Body。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| GET | 參數放 URL（Query String），公開可見，適合查詢 |
| POST | 參數放 Request Body（JSON），隱藏，適合新增 |
| 明信片 vs 信封 | GET = 公開；POST = 密封 |
| Spring Boot 寫法 | `method = RequestMethod.GET / POST` |
| 下一步 | 學習 `@RequestParam` 讀取 GET 參數、`@RequestBody` 讀取 POST 資料 |

<!--
好，今天的重點總結。

第一，GET 參數在 URL 的 Query String，POST 參數在 Request Body。
第二，GET 像明信片（公開），POST 像信封（密封）。
第三，Spring Boot 用 method = RequestMethod.GET/POST 來限制接受的 Method。
第四，下一章我們會學 @RequestParam 和 @RequestBody，就能真正讀取前端傳來的參數了！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
