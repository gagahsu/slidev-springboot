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
大家好，上一章我們學了 @RequestParam 和 @RequestBody，可以分別接住 URL Query String 和 Request Body 的參數。

今天是取得請求參數的下篇，要介紹另外兩個 Annotation：@RequestHeader 和 @PathVariable。

學完這一章，我們就把 Spring Boot 接收前端參數的四個工具全部學完了！
-->

---
layout: default
---

# Outline

- **@RequestHeader** — 接住 Request Header 的參數、常見用途（如 Token 驗證）
- **@PathVariable** — 接住嵌在 URL 路徑中的值、為什麼需要它
- **四個 Annotation 完整總結** — @RequestParam、@RequestBody、@RequestHeader、@PathVariable 對照
- **章節總結** — 參數來源與對應工具整理

<!--
今天學兩個新的 Annotation，然後做個四個工具的完整總結。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 接住放在 Request Header 中的參數<br>@RequestHeader

<!--
先來看 @RequestHeader。
-->

---

# @RequestHeader 的定義

| 項目 | 說明 |
| --- | --- |
| 用途 | 接收 Http Request Header 中的值 |
| 常見 Header | `Content-Type`、`Authorization`、自定義 Header |
| 使用情境 | 讀取驗證 Token、語系設定、自定義傳遞的資訊 |
| 命名規則 | 用 `@RequestHeader("key")` **明確指定**對應 Header 的 key |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> @RequestHeader 可搭配任何 Http Method（GET、POST 等），因為 Header 在每個請求中都存在。
</div>

<!--
Http Request 除了 URL 和 Body 之外，還有一個部分叫做 Header。

Header 是一組 key-value，用來傳遞請求的「元資訊」，例如 Content-Type 告訴後端資料格式是什麼，Authorization 傳遞驗證用的 Token。

@RequestHeader 的用途就是讀取這些 Header 的值。
命名規則和 @RequestParam 一樣，在括號裡明確指定 Header 的 key。省略名稱的寫法在 Spring Boot 3.2 之後依賴 -parameters 編譯參數，容易踩雷，所以一律寫明名稱。
-->

---

# @RequestHeader 基本用法

當前端的 Request Header 帶有 `info` 這個 key 時，用 `@RequestHeader("info")` 接住：

```java
@RestController
public class MyController {

    @RequestMapping("/test3")
    public String test3(@RequestHeader("info") String info) {
        System.out.println("info: " + info);
        return "請求成功";
    }
}
```

<!--
看這個範例。我們在方法參數前加上 @RequestHeader("info")，括號裡的 "info" 告訴 Spring Boot 去 Request Header 裡找 key 為 info 的值，然後塞進這個參數。

⚠️ 注意：如果前端沒有帶這個 Header，Spring Boot 預設會回傳 400 Bad Request，行為和 @RequestParam 的必填規則一樣。

這個 Annotation 在實務上最常用來讀取 Authorization Header，例如：@RequestHeader("Authorization") String authorization，讀取 JWT Token。
-->

---

# 在 Postman 中設定 Request Header

| 步驟 | 操作說明 |
| --- | --- |
| 1 | 在 Postman 請求頁面切換到「Headers」分頁 |
| 2 | 在表格中新增一列 |
| 3 | Key 填入 `info`（需和 `@RequestHeader("info")` 指定的名稱一致） |
| 4 | Value 填入任意值，例如 `hello` |
| 5 | 發送請求，查看 console 輸出 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> Header 的 key <b>不分大小寫</b>（HTTP 規範）。送 <code>info</code> 或 <code>Info</code>，<code>@RequestHeader("info")</code> 都接得到；但 <b>value</b> 內容是原樣傳遞的。
</div>

<!--
要測試 @RequestHeader，需要在 Postman 的 Headers 分頁手動新增 Header。

步驟很簡單：切換到 Headers 分頁，新增一列，Key 填 info，Value 填任意文字，然後送出請求。

💡 補充：HTTP 規範中 Header 名稱是不分大小寫的，所以 Postman 送 Info（大寫 I），@RequestHeader("info") 一樣接得到。這點和 @RequestParam 不同——Query String 的 key 是區分大小寫的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 接住放在 URL 路徑中的值<br>@PathVariable

<!--
了解 @RequestHeader 之後，來看今天的重點——@PathVariable。
-->

---

# @PathVariable 的定義

| 項目 | 說明 |
| --- | --- |
| 用途 | 接收 URL **路徑本身**中嵌入的變數值 |
| URL 格式 | `/users/{id}`，其中 `{id}` 是路徑變數 |
| 使用情境 | 指定某個特定資源，例如取得 id=123 的使用者 |
| 命名規則 | 用 `@PathVariable("id")` **明確指定**對應 `{placeholder}` 的名稱 |

<!--
@PathVariable 和前三個 Annotation 不同——它讀取的值不在 URL 問號後面，也不在 Header 或 Body，而是在 URL 路徑本身裡面。

例如 /users/123 這個 URL，123 就是嵌在路徑裡的變數。
@PathVariable 讓我們可以把這個 123 讀取出來。

這種 URL 設計方式在 RESTful API 中非常常見，後面補充頁會解釋為什麼。
-->

---

# @PathVariable 基本用法

在 `@RequestMapping` 的路徑用 `{id}` 定義路徑變數，再用 `@PathVariable` 接住：

```java
@RestController
public class MyController {

    @RequestMapping("/test4/{id}")
    public String test4(@PathVariable("id") Integer id) {
        System.out.println("id: " + id);
        return "請求成功";
    }
}
```

<!--
看這個範例。@RequestMapping 的路徑是 "/test4/{id}"，大括號 {} 裡的 id 就是路徑變數的佔位符。

方法參數前加上 @PathVariable("id")，括號裡的 "id" 對應路徑裡 {id} 這個佔位符，Spring Boot 就會把 URL 路徑對應位置的值讀出來，塞進 id 這個參數。

⚠️ @PathVariable 括號裡的名稱必須和大括號 {} 裡的佔位符名稱完全一致，否則 Spring Boot 無法對應。和 @RequestParam 一樣，建議一律明確寫出名稱，避開 -parameters 編譯參數的依賴。

執行後，用 Postman 發送 GET http://localhost:8080/test4/123，console 就會印出 "id: 123"。
-->

---

# @PathVariable 執行結果

| 前端發送的 URL | 後端讀取到的值 | Console 輸出 |
| --- | --- | --- |
| `/test4/123` | `id = 123` | `id: 123` |
| `/test4/456` | `id = 456` | `id: 456` |
| `/test4/abc` | 類型不符 | `400 Bad Request` |
| `/test4`（無路徑值） | 路由不符合 | `404 Not Found` |

<!--
看執行結果。

URL 路徑的最後一段會被 Spring Boot 讀取出來，放進 id 參數。

如果路徑值是 abc 但參數類型是 Integer，Spring Boot 轉型失敗，回傳 400。
如果只輸入 /test4 沒有後面的值，這個路由根本不匹配，Spring Boot 回傳 404。

這兩個錯誤行為是初學者常見的困惑點，記得 {} 的路徑值是必要的，少了就找不到路由。
-->

---

# @PathVariable vs @RequestParam

兩者都能傳 id，URL 格式不同：

| 比較項目 | @RequestParam | @PathVariable |
| --- | --- | --- |
| URL 格式 | `/users?id=123` | `/users/123` |
| 參數位置 | URL 問號後的 Query String | URL 路徑本身 |
| 語意 | 「用 id 篩選使用者」 | 「取得 id=123 這個使用者」 |
| 風格 | 傳統風格 | RESTful 風格 |

<!--
@RequestParam 和 @PathVariable 都能傳遞一個 id，但 URL 格式完全不同。

/users?id=123 比較像是「在使用者清單裡，篩選 id 是 123 的」。
/users/123 比較像是「直接存取 id=123 的那個使用者資源」。

後者更符合 RESTful API 的設計哲學：URL 代表一個資源的路徑，而不是一個查詢操作。
這就帶出了下面補充要說明的問題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充

## 為什麼我們需要 @PathVariable？

<!--
為什麼要特別設計一個 @PathVariable，而不是直接用 @RequestParam 就好？
-->

---

# 補充：為什麼需要 @PathVariable？

答案是：「為了支援 **RESTful API** 的設計風格」

| 操作 | @RequestParam 風格 | @PathVariable 風格（RESTful） |
| --- | --- | --- |
| 取得 id=1 的使用者 | `GET /users?id=1` | `GET /users/1` |
| 取得 id=2 的訂單 | `GET /orders?id=2` | `GET /orders/2` |
| 刪除 id=3 的文章 | `DELETE /posts?id=3` | `DELETE /posts/3` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>下一章預告：</b> 我們將完整介紹 RESTful API 的設計原則，以及 @GetMapping、@PostMapping 等更簡潔的 Annotation。
</div>

<!--
RESTful API 是目前業界最主流的 API 設計風格。

它的核心理念是：URL 代表一個「資源」，HTTP Method 代表「對資源做什麼動作」。

所以 GET /users/1 意思是「用 GET 方法，存取 users 這個資源中，id 是 1 的那一筆」。

這種設計讓 API 的 URL 更直覺、更有語意。@PathVariable 就是實現這種風格的關鍵工具。

下一章我們會完整介紹 RESTful API，到時候 @PathVariable 的用途就會更清楚了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 小結

## 在 Spring Boot 中接住參數的四個 Annotation

<!--
現在讓我們把四個 Annotation 放在一起做個完整的總結。
-->

---

# 四個取得請求參數的 Annotation — 完整比較

| Annotation | 參數來源 | URL 範例 | 適合搭配 |
| --- | --- | --- | --- |
| `@RequestParam` | URL Query String | `/users?id=123` | GET |
| `@RequestBody` | Request Body（JSON） | `/users`（Body 帶資料） | POST |
| `@RequestHeader` | Request Header | 任何 URL（Header 帶資料） | 任何 Method |
| `@PathVariable` | URL 路徑本身 | `/users/123` | GET / DELETE |

<!--
這張表格總結了四個 Annotation 的完整比較。

記憶口訣：
- @RequestParam → URL 後面的問號參數
- @RequestBody → Body 裡的 JSON
- @RequestHeader → Header 裡的值
- @PathVariable → URL 路徑本身的變數

四個工具各司其職，對應 Http Request 的不同部分。
根據前端傳遞資料的方式，選擇對應的 Annotation，就能正確接住前端送來的參數。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| `@RequestHeader` | 接 Request Header，用 `@RequestHeader("key")` 明確指定，預設必填 |
| `@PathVariable` | 接 URL 路徑變數，`@RequestMapping("/path/{var}")` 搭配使用 |
| 路徑變數命名 | `@PathVariable("var")` 和 `{placeholder}` 名稱必須完全一致 |
| 為何需要 @PathVariable | 支援 RESTful API 設計，URL 代表具體資源 |
| 四個工具完整組合 | `@RequestParam`、`@RequestBody`、`@RequestHeader`、`@PathVariable` |

<!--
好，今天的重點總結。

第一，@RequestHeader 接 Request Header 的值，記得在括號裡明確指定 key；Header 名稱不分大小寫。
第二，@PathVariable 接 URL 路徑本身的變數，路徑格式要加 {} 佔位符。
第三，@PathVariable 括號裡的名稱和 {} 裡的佔位符名稱必須完全一致。
第四，@PathVariable 的設計動機是支援 RESTful API 風格。
第五，四個取得參數的 Annotation 現在全部學完了！

下一章我們會進入 RESTful API 的完整介紹，一切都會串聯起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習

## 帶 Token 查詢指定訂單

<!--
學完了 @RequestHeader 和 @PathVariable，我們用一個查詢訂單的情境，把兩個 Annotation 一次用上。
-->

---

# 實作題目：帶 Token 查詢指定訂單

請實作一個查詢訂單的 API，同時使用 `@PathVariable` 和 `@RequestHeader`：

| 項目 | 內容 |
| --- | --- |
| 請求 | `GET /orders/{orderId}`，例如 `/orders/888` |
| Header | 需帶 `token`，例如 `token: abc123` |
| 回傳 | 字串 `"訂單編號: 888, 驗證 token: abc123"` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>情境：</b> 用 RESTful 風格的 URL 指定某筆訂單，同時用 Header 傳遞驗證用的 token——實務上非常常見的組合。
</div>

<!--
這個題目模擬實務上非常常見的場景：用 RESTful 風格的 URL 指定某筆訂單，同時用 Header 傳遞驗證用的 token。

實際的系統裡，後端會先驗證 token 是否合法，才回傳訂單資料——這正是之後會學到的身分驗證的雛形。

下一頁是具體的實作要求。
-->

---

# 實作題目：具體要求

| # | 要求 |
| --- | --- |
| 1 | 用 `@PathVariable` 接住路徑中的 `orderId`（整數） |
| 2 | 用 `@RequestHeader` 接住 Header 中的 `token`（字串） |
| 3 | 用 Postman 測試：在 Headers 分頁加上 `token`，發送 `GET /orders/888` |
| 4 | 試試「不帶 token」和「orderId 填英文字」，各會得到什麼狀態碼？ |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>想一想：</b> 兩個 Annotation 可以出現在同一個方法的參數列表裡嗎？
</div>

<!--
四個要求：@PathVariable 接 orderId、@RequestHeader 接 token、用 Postman 驗證、做兩個錯誤實驗。

第四小題請大家做兩個實驗，觀察錯誤時的狀態碼，驗證我們這章學過的規則。

先自己動手做，再看下一頁的參考解答。
-->

---

# 參考解答（1/2）：程式碼

一個方法可以同時使用 `@PathVariable` 和 `@RequestHeader`：

```java
@RestController
public class OrderController {

    @RequestMapping("/orders/{orderId}")
    public String getOrder(@PathVariable("orderId") Integer orderId,
                           @RequestHeader("token") String token) {
        return "訂單編號: " + orderId + ", 驗證 token: " + token;
    }
}
```

<!--
參考解答：兩個 Annotation 可以同時出現在同一個方法的參數列表裡，各自從 Http Request 的不同部分取值。

@PathVariable 從 URL 路徑取出 888，@RequestHeader 從 Header 取出 abc123。

下一頁我們看實際測試的結果。
-->

---

# 參考解答（2/2）：測試結果

| 測試 | 結果 |
| --- | --- |
| `GET /orders/888` + Header `token: abc123` | `200 OK`，`訂單編號: 888, 驗證 token: abc123` |
| `GET /orders/888`，**不帶 token** | `400 Bad Request`（@RequestHeader 預設必填） |
| `GET /orders/abc` + Header `token: abc123` | `400 Bad Request`（`abc` 無法轉成 Integer） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 四個取得請求參數的 Annotation 到此全部實際操作過了，下一章進入 RESTful API，它們會全部派上用場。
</div>

<!--
第四小題的兩個實驗結果：
不帶 token → 400，因為 @RequestHeader 和 @RequestParam 一樣預設必填。
orderId 填英文字 abc → 也是 400，因為 abc 沒辦法轉成 Integer 類型。

這樣四個取得請求參數的 Annotation 就全部實際操作過了。下一章進入 RESTful API，這些工具會全部派上用場！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
