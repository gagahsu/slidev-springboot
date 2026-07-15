---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Url 路徑對應—@RequestMapping
routeAlias: ch14
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
    Url 路徑對應
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「@RequestMapping 讓 Spring Boot 知道哪個方法負責哪個路徑」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十四章！

上一章學了 Http 協議，我們知道每個請求都有一個 URL，指定要訪問後端的哪個資源。今天要學的是：Spring Boot 怎麼知道收到某個 URL 的請求時，要執行哪個 Java 方法來處理？

答案就是 @RequestMapping——它是 Spring MVC 的核心 Annotation，負責把 URL 路徑和 Controller 方法連接起來。
-->

---
layout: default
---

# Outline

- **回顧：什麼是 Http 協議？** — 複習 Request URL 的角色
- **什麼是 URL？** — URL 的定義與格式規範
- **URL 的例子分析** — 拆解一個完整的 URL
- **URL 路徑對應：@RequestMapping** — 如何把 URL 路徑對應到 Controller 方法
- **在 Spring Boot 中練習 @RequestMapping 的用法** — 設定多個路徑、指定 Http Method

<!--
今天有點偏實作，學完之後你會知道怎麼在 Spring Boot 裡設定「哪個 URL 對應到哪個方法」。

@RequestMapping 是我們從第三章就一直在用的 Annotation，今天要把它說清楚、講明白。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回顧
# 什麼是 Http 協議？

<!--
先快速複習一下上一章的重點，特別是 URL 在 Http Request 中的角色。
-->

---

# 回顧：Http Request 的組成

前端發送的 Http Request 有四個部分，其中 URL 決定「要找後端的哪個方法」：

| 部分 | 說明 | 本章重點 |
| --- | --- | --- |
| **Http Method** | 請求的動作（GET / POST / ...） | ✓ @RequestMapping 可指定 |
| **URL** | 請求的目標網址，包含路徑 | ✓ **本章核心** |
| **Request Header** | 附加資訊（Content-Type 等） | — |
| **Request Body** | 夾帶的資料（POST / PUT 限定） | — |

「URL 裡的路徑（Path）告訴 Spring Boot：這個請求要交給哪個 Controller 方法處理。」

<!--
上一章我們學了 Http Request 的四個部分：Method、URL、Header、Body。

今天要深入看的是 URL——特別是 URL 裡的路徑（Path）部分。

Spring Boot 收到一個請求的時候，它會看這個請求的 URL 路徑，然後找到對應的 Controller 方法來執行。@RequestMapping 就是做這個「對應」工作的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 什麼是 URL？

<!--
在學 @RequestMapping 之前，先把 URL 的結構搞清楚，特別是路徑（Path）這個部分。
-->

---

# URL 的定義

**URL**（Uniform Resource Locator）是「統一資源定位器」，也就是網址，用來指定網路上一個資源的位置。

| 概念 | 說明 |
| --- | --- |
| **URL 的用途** | 告訴瀏覽器或前端「要去哪裡找資源」 |
| **在 Http 中的角色** | Http Request 的第二個部分，指定請求的目標 |
| **最關鍵的部分** | 路徑（Path）——決定後端要執行哪個方法 |

「每個 URL 都指向網路上的某個資源；後端 API 中，URL 的路徑決定由哪個 Controller 方法來處理請求。」

<!--
URL 就是我們平常說的「網址」，但在後端開發的語境裡，它有更精確的意義。

每個 URL 都在描述一個資源的位置：「在哪台機器、哪個 port、哪個路徑下，找到這個資源。」

對後端開發者來說，最重要的是 URL 裡的「路徑」部分——Spring Boot 就是根據路徑來決定要執行哪個 Controller 方法。
-->

---

# URL 的格式規範

一個完整的 URL 由以下幾個部分組成：

| 部分 | 名稱 | 說明 | 例子 |
| --- | --- | --- | --- |
| `http://` | Protocol（協定） | 使用的通訊協定 | `http://`、`https://` |
| `localhost` | Host（主機） | 伺服器的網域或 IP | `localhost`、`www.youtube.com` |
| `:8080` | Port（埠號） | 伺服器上的服務入口 | `:8080`（開發）、`:443`（HTTPS 預設） |
| `/test` | Path（路徑） | 指向後端資源的路徑 | `/test`、`/users`、`/products/1` |
| `?name=Alice` | Query String（查詢字串） | 附加的查詢參數（可選） | `?name=Alice&age=20` |

<!--
把 URL 拆開來看，每個部分都有它的意義。

Protocol 決定用什麼協定溝通。開發時常用 http://，正式環境幾乎都用 https://（加密版）。

Host 是伺服器的位置。開發時 localhost 代表自己的電腦，正式環境是真實的域名或 IP。

Port 是伺服器上的入口編號。Spring Boot 開發環境預設用 8080，HTTP 正式環境預設 80（可以省略），HTTPS 預設 443（也可以省略）。

Path 是最重要的部分——這是 @RequestMapping 在對應的。

Query String 是額外的查詢參數，格式是 ?key=value，多個參數用 & 連接。這是第 19 章要學的 @RequestParam 在解析的。
-->

---

# URL 例子分析（一）

拆解這個完整的 URL：`http://localhost:8080/test?name=Alice`

| 部分 | 值 | 說明 |
| --- | --- | --- |
| Protocol | `http://` | 使用 Http 協定 |
| Host | `localhost` | 自己的電腦（本機） |
| Port | `8080` | Spring Boot 開發環境預設埠號 |
| **Path** | **`/test`** | **@RequestMapping 對應的就是這個** |
| Query String | `?name=Alice` | 附加參數（下一章學怎麼接收） |

<!--
把 URL 拆開來，每個部分都有它的意義。

這是我們熟悉的本機 Spring Boot 環境，Path 是 /test，@RequestMapping("/test") 就是在對應這個路徑。

記住這個規律：無論 URL 多長多複雜，@RequestMapping 對應的都是 Path 的部分。
-->

---

# URL 例子分析（二）

再看一個真實世界的例子：`https://www.youtube.com/channel/UCxxxxxx/videos`

| 部分 | 值 | 說明 |
| --- | --- | --- |
| Protocol | `https://` | 使用加密的 Https 協定 |
| Host | `www.youtube.com` | YouTube 的伺服器域名 |
| Port | 443（省略） | Https 預設埠號，可省略不寫 |
| **Path** | **`/channel/UCxxxxxx/videos`** | **YouTube 後端對應這個路徑的 Controller** |

兩個例子結構完全一樣，只是各部分的值不同——無論 URL 多長，@RequestMapping 對應的都是 Path。

<!--
第二個例子是 YouTube 的真實網址，Path 是 /channel/UCxxxxxx/videos。YouTube 後端也有對應這個路徑的 Controller 方法，負責回傳這個頻道的影片清單。

對照第一個例子，結構是完全一樣的，只是各個部分的值不同。

記住這個規律：無論 URL 多長多複雜，@RequestMapping 對應的都是 Path 的部分。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# URL 路徑對應：@RequestMapping

<!--
現在清楚了 URL 的結構，特別是 Path 的位置，我們來學 @RequestMapping 怎麼把 Path 和 Controller 方法連接起來。
-->

---

# @RequestMapping — 定義

| 項目 | 說明 |
| --- | --- |
| **用途** | 把 URL 路徑（Path）對應到 Controller 類別或方法 |
| **加在哪裡** | 加在 `@RestController` 或 `@Controller` 的類別或方法上 |
| **必要前提** | 類別必須有 `@RestController` 或 `@Controller`，否則不生效 |
| **預設行為** | 不指定 Http Method 時，接受所有 Method（GET / POST / ...）的請求 |

「@RequestMapping 就是 Spring Boot 的「路由表」——當請求進來，Spring Boot 查這張表找到對應的方法執行。」

<!--
@RequestMapping 是 Spring MVC 最核心的 Annotation，負責定義「這個方法負責處理哪個 URL 路徑的請求」。

有一個很重要的前提：@RequestMapping 一定要配合 @RestController 或 @Controller 使用，缺少這兩個其中之一，@RequestMapping 不會生效，Spring Boot 不會把請求導向這個方法。

另一個要記住的：如果只寫 @RequestMapping("/test") 不指定 Method，那不管前端是 GET 還是 POST 還是 DELETE，這個方法都會被觸發。這在開發中很方便，但正式 API 設計時通常會指定 Method（下一張會示範）。
-->

---

# @RequestMapping — 基本用法

```java
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @RequestMapping("/test")
    public String test() {
        return "Hello World";
    }
}
```

當前端向 `http://localhost:8080/test` 發送請求時，Spring Boot 執行 `test()` 並回傳 `Hello World`。

<!--
這段程式碼從第三章就一直在用，現在我們能完整解釋它：

@RestController 宣告這是一個 Controller，Spring Boot 才會掃描裡面的 @RequestMapping。

@RequestMapping("/test") 告訴 Spring Boot：收到路徑是 /test 的請求，就執行 test() 這個方法。

test() 回傳的 "Hello World" 字串，Spring MVC 自動組裝成 Http Response 的 Body 回傳給前端。

這三行程式碼把「一個 URL 路徑 → 一個 Java 方法 → 一個 Http 回應」串起來了，這就是 Spring MVC 最基礎的運作模式。
-->

---

# @RequestMapping — 指定 Http Method

`@RequestMapping` 可以用 `method` 屬性限制只接受特定的 Http Method：

```java
// 只接受 GET 請求
@RequestMapping(value = "/users", method = RequestMethod.GET)
public String getUsers() { return "使用者清單"; }

// 只接受 POST 請求
@RequestMapping(value = "/users", method = RequestMethod.POST)
public String createUser() { return "新增使用者"; }
```

| 屬性 | 說明 |
| --- | --- |
| `value` | URL 路徑，等同於直接寫字串 `"/users"` |
| `method` | 指定接受的 Http Method，使用 `RequestMethod.GET` 等常數 |

<!--
有時候我們希望同一個路徑 /users，GET 回傳清單、POST 新增資料——這樣就需要用 method 屬性來區分。

value 就是路徑，和直接寫 @RequestMapping("/users") 是一樣的效果，只是當你要同時指定 method 時，路徑要用 value = 的方式寫。

RequestMethod.GET、RequestMethod.POST 等是 Spring 定義的常數，對應到 Http 的各個 Method。

不過在實際工作中，大家更常用 @GetMapping、@PostMapping 這些簡短版的 Annotation——那是第 22 章會學的內容，它們底層就是 @RequestMapping + method 的語法糖。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 在 Spring Boot 中練習 @RequestMapping 的用法

<!--
概念清楚了，實際動手寫一個有多個路徑的 Controller，用 Postman 分別測試每個路徑。
-->

---

# 練習 — 設定多個 @RequestMapping

在同一個 Controller 中設定多個路徑，分別處理不同的請求：

```java
@RestController
public class MyController {
    @RequestMapping("/hello")
    public String hello() {
        return "Hello!";
    }
    @RequestMapping("/test")
    public String test() {
        return "Hello World";
    }
    @RequestMapping("/hi")
    public String hi() {
        return "Hi Spring Boot!";
    }
}
```

<!--
一個 Controller 裡可以有多個方法，每個方法用 @RequestMapping 對應不同的路徑。

這樣前端發送不同的 URL 請求，Spring Boot 就會分別執行對應的方法，回傳各自的結果。

這就是後端 API 最基本的組織方式：一個 Controller 管理一組相關的路徑，每個路徑有自己的處理方法。
-->

---

# 執行結果

啟動 Spring Boot，用 Postman 分別存取三個路徑：

| 請求 URL | Http Method | 回應 Body |
| --- | --- | --- |
| `http://localhost:8080/hello` | GET | `Hello!` |
| `http://localhost:8080/test` | GET | `Hello World` |
| `http://localhost:8080/hi` | GET | `Hi Spring Boot!` |

三個路徑各自獨立，Spring Boot 根據 URL 的 Path 部分找到對應的方法執行。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 試著存取一個沒有對應的路徑（例如 <code>/abc</code>），會看到 Status Code <b>404 Not Found</b>——確認 @RequestMapping 只對應設定的路徑。
</div>

<!--
從結果可以清楚看到：不同的路徑對應到不同的方法，每個方法各自回傳不同的結果。

Spring Boot 的運作就是這樣：收到請求 → 看 Path → 找到對應的 @RequestMapping → 執行方法 → 回傳結果。

建議大家做一個小實驗：在 Postman 裡輸入一個沒有設定的路徑，比如 /abc。你會看到 404 Not Found，這就確認了 @RequestMapping 只會對應你設定的路徑，沒有設定的路徑 Spring Boot 不知道怎麼處理，就回傳 404。

這是 Spring Boot 最基礎的請求分派機制，後面不管學多複雜的功能，底層都是這個邏輯。
-->

---

# 章節總結

- **URL 的組成**：Protocol + Host + Port + **Path**（最重要）+ Query String
- **@RequestMapping**：把 URL 的 Path 對應到 Controller 方法，是 Spring MVC 的路由核心
- **必要前提**：類別必須有 `@RestController` 或 `@Controller`，@RequestMapping 才生效
- **預設行為**：不指定 `method` 時，接受所有 Http Method 的請求
- **指定 Method**：用 `method = RequestMethod.GET` 限制只接受特定 Http Method
- **一個 Controller 多個路徑**：每個方法加上各自的 @RequestMapping，各自獨立處理

下一章我們會學 JSON 格式，了解前後端傳遞資料最常用的格式是什麼樣子。

<!--
今天的核心只有一件事：@RequestMapping 把 URL 的 Path 和 Controller 方法連起來。

記住三個要點：第一，必須搭配 @RestController 或 @Controller 才生效；第二，不指定 method 時接受所有請求；第三，一個 Controller 裡可以有多個 @RequestMapping，每個對應不同路徑。

下一章學 JSON，學完之後你就能讓後端回傳結構化的資料（物件、陣列），而不只是簡單的字串了。

有問題嗎？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天把 URL 的結構和 @RequestMapping 的用法都搞清楚了。

課後建議：在你的 Controller 裡加幾個新的路徑，用 Postman 測試看看，確認每個路徑都能正確回應，然後試試看存取一個沒有設定的路徑，觀察 404 的回應。

有問題嗎？
-->
