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
大家好，今天我們要介紹一個現代後端開發中非常重要的概念——RESTful API。

在前幾章，我們學了 Http Method、URL 設計、@PathVariable 等工具。
今天要把這些工具的設計哲學串聯起來，讓大家理解為什麼業界普遍採用 RESTful 風格來設計 API。

學完這一章，大家就能看懂和設計符合業界慣例的 API 了。
-->

---
layout: default
---

# Outline

- **什麼是 API？** — 定義、前後端溝通的橋樑
- **什麼是 RESTful API？** — REST 設計風格、URL 代表資源、Method 代表動作
- **RESTful API 的注意事項** — 常見誤用、命名規範、業界慣例
- **章節總結** — 核心規則整理

<!--
今天的結構很清楚：先搞清楚 API 是什麼，再介紹 RESTful 的設計規則，最後說明使用上的注意事項。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 什麼是 API？

<!--
先從最基本的問題開始：API 是什麼？
-->

---

# 什麼是 API？

| 項目 | 說明 |
| --- | --- |
| 全名 | Application Programming Interface |
| 定義 | 「用工程師的方式，說明某個功能的使用方法」 |
| 用途 | 讓其他開發者不需要看原始碼，就能使用這個功能 |
| 常見形式 | 文件說明：URL 路徑、Http Method、參數格式、回應格式 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>白話說：</b> API 就像「說明書」——我不用知道你的程式怎麼寫，只要照說明書操作就能得到結果。
</div>

<!--
API 的全名是 Application Programming Interface，但記全名不重要，重要的是理解它的用途。

舉個例子：你寫了一個查詢使用者資料的功能，前端工程師要怎麼使用它？
他不可能去看你的 Spring Boot 程式碼，而是看你提供的 API 文件：
「發送 GET 請求到 /users/123，就能拿到 id=123 的使用者資料。」

這個說明，就是 API。
-->

---

# API 的生活比喻

**比喻：餐廳的菜單**

| 角色 | 對應 |
| --- | --- |
| 餐廳（廚房） | 後端（Spring Boot 程式） |
| 菜單 | API 文件 |
| 客人（點餐者） | 前端工程師 |
| 點餐動作 | 發送 Http Request |
| 上菜（料理） | Http Response（JSON 資料） |

<!--
用餐廳來比喻最直觀。

客人不需要知道廚房怎麼烹飪，只需要看菜單，選一道菜，告訴服務生，等上菜就好。

前端工程師也一樣。他不需要看 Spring Boot 的原始碼，只需要看 API 文件：發送什麼請求、帶什麼參數、會得到什麼回應。

後端工程師的工作就是「設計好菜單（API）」和「做出料理（功能實作）」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 什麼是 RESTful API？

<!--
了解 API 之後，來看 RESTful API 是什麼。
-->

---

# 什麼是 RESTful API？

| 項目 | 說明 |
| --- | --- |
| REST 全名 | Representational State Transfer |
| RESTful 意思 | 「符合 REST 風格的」API |
| 本質 | 一套 API 設計的風格與約定，不是強制規範 |
| 目標 | 讓 API 的設計有一致性、可讀性、易於理解 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> RESTful 是目前業界最主流的 API 設計風格，幾乎所有現代 Web API 都採用這個風格。
</div>

<!--
RESTful API 就是「符合 REST 風格的 API」。

REST 是一套設計哲學，定義了如何用 Http 協議來設計出清晰、易懂的 API。
它不是一個必須嚴格遵守的規範，而是一套業界大家都認可的設計約定。

接下來我們看 RESTful API 的三個核心設計規則。
-->

---

# RESTful 規則 1：用正確的 Http Method 代表操作

不同的操作對應不同的 Http Method：

| Http Method | 對應操作 | 範例 URL | 說明 |
| --- | --- | --- | --- |
| `GET` | 查詢（Read） | `GET /users` | 取得所有使用者 |
| `POST` | 新增（Create） | `POST /users` | 新增一個使用者 |
| `PUT` | 完整更新（Update） | `PUT /users/123` | 更新 id=123 的使用者 |
| `DELETE` | 刪除（Delete） | `DELETE /users/123` | 刪除 id=123 的使用者 |

<!--
第一個規則：用 Http Method 來表達對資源要做什麼動作。

GET = 查；POST = 新增；PUT = 更新；DELETE = 刪除。

注意到了嗎？同一個 URL /users 可以對應四種操作，差別就在 Http Method 不同。
這正是 RESTful 的精妙之處：URL 代表「資源是誰」，Method 代表「要做什麼」。
-->

---

# RESTful 規則 2：URL 路徑代表資源層級

URL 的設計要能清楚描述資源的結構關係：

| URL | 語意 |
| --- | --- |
| `GET /users` | 取得所有使用者 |
| `GET /users/123` | 取得 id=123 的使用者 |
| `GET /users/123/orders` | 取得 id=123 的使用者的所有訂單 |
| `GET /users/123/orders/456` | 取得 id=123 的使用者的 id=456 訂單 |

<!--
第二個規則：URL 要能清楚表達資源的層級關係。

用斜線 / 分隔層級，越往右越具體。

/users 是所有使用者，/users/123 是某個特定使用者，/users/123/orders 是這個使用者的所有訂單。

這種設計就像資料夾結構一樣直覺，光看 URL 就知道在操作什麼資源。
這也是為什麼上一章我們需要 @PathVariable——它讓 URL 路徑可以帶入動態的 id 值。
-->

---

# RESTful vs 非 RESTful URL 設計

| 操作 | 非 RESTful 風格 | RESTful 風格 |
| --- | --- | --- |
| 取得使用者 | `GET /getUser?id=123` | `GET /users/123` |
| 新增使用者 | `POST /createUser` | `POST /users` |
| 更新使用者 | `POST /updateUser` | `PUT /users/123` |
| 刪除使用者 | `POST /deleteUser?id=123` | `DELETE /users/123` |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>RESTful 風格的優點：</b> URL 簡潔、語意清楚、統一風格，前端工程師一看就懂。
</div>

<!--
用這個對比表格最能感受到 RESTful 的好處。

非 RESTful 風格：URL 裡帶了動詞，像 getUser、createUser，而且不同操作的 Method 混亂。
RESTful 風格：URL 只描述資源，動作由 Http Method 表達，整體更簡潔、一致。

學會 RESTful 風格之後，你設計的 API 就能讓其他工程師一看就理解，這是專業後端工程師的基本素養。
-->

---

# RESTful 規則 3：Response 回傳 JSON 格式

| 項目 | 說明 |
| --- | --- |
| 回傳格式 | Response Body 應為 **JSON** 格式（或 XML，但 JSON 為主流） |
| Spring Boot 實作 | `@RestController` 自動將 Java 物件轉成 JSON（第十六章） |
| Content-Type | Response Header 應包含 `Content-Type: application/json` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>好消息：</b> 我們在第十六章學到的 @RestController 已經自動幫我們處理 JSON 回傳，完全符合 RESTful 規範。
</div>

<!--
第三個規則：Response 要回傳 JSON 格式。

這個規則我們已經在第十五章學 JSON、第十六章學 @RestController 時實作過了。

@RestController 自動把 Java 物件轉成 JSON，Response Header 也自動設定 Content-Type: application/json。

所以我們從第十六章開始寫的 API 就已經符合 RESTful 的第三個規則了，很棒！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## RESTful API 的注意事項

<!--
最後，來看一些使用 RESTful API 時的注意事項。
-->

---

# RESTful API 的注意事項

**REST 是設計風格，不是強制規範**

| 情況 | 說明 |
| --- | --- |
| 一般情境 | 盡量遵守 RESTful 設計原則，讓 API 一致、易讀 |
| 安全性考量 | 敏感 id（如身分證號）不適合放在 URL，可改用 POST + Body 傳遞 |
| 複雜操作 | 某些動作難以用 CRUD 對應，可適度調整（如 `POST /users/123/activate`） |
| 團隊約定 | 最重要的是團隊內部保持一致，而非強求百分百符合 RESTful |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>提醒：</b> 遇到安全性或業務邏輯衝突時，安全性優先，RESTful 風格其次。
</div>

<!--
RESTful 是一套風格指南，不是法律。

最常見的例外：敏感資訊不能放在 URL 裡。
比如查詢用戶資料時，如果 id 是身分證號，那 GET /users/A123456789 就把身分證號暴露在 URL 裡了，這是不安全的。
這種情況可以改用 POST，把身分證號放在 Body 裡傳遞，即使這樣不完全符合 RESTful。

另外，有些操作很難對應到 CRUD，例如「封鎖一個使用者」，可能會設計成 POST /users/123/block，這也是可以接受的。

記住：安全性和業務邏輯優先，RESTful 是工具，不是枷鎖。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| API | 「說明某個功能使用方法」的說明書，讓開發者互相溝通 |
| RESTful API | 符合 REST 風格的 API，業界最主流的設計約定 |
| 規則 1 | Http Method 代表操作：GET=查、POST=新增、PUT=更新、DELETE=刪除 |
| 規則 2 | URL 路徑描述資源層級，越具體越往右 |
| 規則 3 | Response 回傳 JSON 格式（@RestController 自動處理） |
| 注意事項 | RESTful 是風格指南，安全性和業務邏輯衝突時可適度調整 |

<!--
好，今天的重點總結。

第一，API 是功能的說明書，讓工程師之間能溝通。
第二，RESTful API 是符合 REST 風格的 API，業界最主流。
第三，三大規則：Http Method = CRUD、URL = 資源層級、Response = JSON。
第四，RESTful 是風格指南，不是強制規範，安全性優先。

從這章開始，大家設計 API 時就有了一套清楚的參考依據。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
