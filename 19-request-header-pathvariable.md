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
| 命名規則 | 方法參數名稱需和 Header 的 key **完全一致** |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> @RequestHeader 可搭配任何 Http Method（GET、POST 等），因為 Header 在每個請求中都存在。
</div>

<!--
Http Request 除了 URL 和 Body 之外，還有一個部分叫做 Header。

Header 是一組 key-value，用來傳遞請求的「元資訊」，例如 Content-Type 告訴後端資料格式是什麼，Authorization 傳遞驗證用的 Token。

@RequestHeader 的用途就是讀取這些 Header 的值。
命名規則和 @RequestParam 一樣，方法參數名稱需和 Header 的 key 一致。
-->

---

# @RequestHeader 基本用法

當前端的 Request Header 帶有 `info` 這個 key 時，用 `@RequestHeader` 接住：

```java
@RestController
public class MyController {

    @RequestMapping("/test3")
    public String test3(@RequestHeader String info) {
        System.out.println("info: " + info);
        return "請求成功";
    }
}
```

<!--
看這個範例。我們在方法參數前加上 @RequestHeader，Spring Boot 就會去 Request Header 裡找 key 為 info 的值，然後塞進這個參數。

⚠️ 注意：如果前端沒有帶這個 Header，Spring Boot 預設會回傳 400 Bad Request，行為和 @RequestParam 的必填規則一樣。

這個 Annotation 在實務上最常用來讀取 Authorization Header，例如：@RequestHeader String Authorization，讀取 JWT Token。
-->

---

# 在 API Tester 中設定 Request Header

| 步驟 | 操作說明 |
| --- | --- |
| 1 | 在 API Tester 找到「Headers」區塊 |
| 2 | 點擊「Add header」新增一筆 |
| 3 | Name 填入 `info`（需和方法參數名稱一致） |
| 4 | Value 填入任意值，例如 `hello` |
| 5 | 發送請求，查看 console 輸出 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> Header 的 key 區分大小寫。<code>info</code> 和 <code>Info</code> 是不同的 Header。
</div>

<!--
要測試 @RequestHeader，需要在 API Tester 的 Headers 區塊手動新增 Header。

步驟很簡單：找到 Headers 區塊，新增一筆，Name 填 info，Value 填任意文字，然後送出請求。

⚠️ 特別注意 Header 的 key 是區分大小寫的。如果程式寫 @RequestHeader String info，但 API Tester 送的是 Info（大寫 I），Spring Boot 就接不到值，會回傳 400。
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
| 命名規則 | `{placeholder}` 名稱需和方法參數名稱**完全一致** |

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

方法參數前加上 @PathVariable，Spring Boot 就會把 URL 路徑對應位置的值讀出來，塞進 id 這個參數。

⚠️ 大括號裡的名稱 id 和方法參數名稱 id 必須完全一致，否則 Spring Boot 無法對應。

執行後，用 API Tester 發送 GET http://localhost:8080/test4/123，console 就會印出 "id: 123"。
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
| `@RequestHeader` | 接 Request Header，命名需一致，預設必填 |
| `@PathVariable` | 接 URL 路徑變數，`@RequestMapping("/path/{var}")` 搭配使用 |
| 路徑變數命名 | `{placeholder}` 和方法參數名稱必須完全一致 |
| 為何需要 @PathVariable | 支援 RESTful API 設計，URL 代表具體資源 |
| 四個工具完整組合 | `@RequestParam`、`@RequestBody`、`@RequestHeader`、`@PathVariable` |

<!--
好，今天的重點總結。

第一，@RequestHeader 接 Request Header 的值，記得 Header 的 key 區分大小寫。
第二，@PathVariable 接 URL 路徑本身的變數，路徑格式要加 {} 佔位符。
第三，{} 裡的名稱和方法參數名稱必須完全一致。
第四，@PathVariable 的設計動機是支援 RESTful API 風格。
第五，四個取得參數的 Annotation 現在全部學完了！

下一章我們會進入 RESTful API 的完整介紹，一切都會串聯起來。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
