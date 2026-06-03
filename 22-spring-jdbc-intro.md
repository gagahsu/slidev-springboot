---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring JDBC 簡介
routeAlias: ch22
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
    Spring JDBC 簡介
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓 Spring Boot 能夠存取資料庫的橋樑」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，從這一章開始，我們要進入後端開發的另一個核心領域——資料庫操作。

在之前的章節，我們學了怎麼接收前端的請求、怎麼回傳 JSON 資料。
但這些資料都是寫死在程式碼裡的，真實的應用程式需要把資料存進資料庫、從資料庫讀取資料。

Spring JDBC 就是讓 Spring Boot 能夠操作資料庫的工具。學完這一章，大家就能理解 Spring JDBC 在整個系統中扮演的角色。
-->

---
layout: default
---

# Outline

- **回顧：前後端與 Spring MVC** — Spring MVC 負責的部分、資料庫操作的缺口
- **什麼是 Spring JDBC？** — 定義、在系統架構中的位置、與原生 JDBC 的差別
- **三種資料庫操作框架比較** — Spring JDBC、Spring Data JPA、MyBatis 的差異與各自適用情境
- **什麼是 CRUD？** — Create、Read、Update、Delete 對應的資料庫操作
- **章節總結** — 全貌整理，下一章預告

<!--
今天以概念為主，沒有複雜的程式碼。重點是建立對 Spring JDBC 的全貌認識，以及它在系統架構中的位置。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回顧

## 前端和後端的差別、Spring MVC 負責的部分

<!--
先回顧一下前幾章的學習脈絡，看看我們到目前為止學了什麼，以及哪個部分還缺少。
-->

---

# 回顧：我們目前學到哪裡了？

| 領域 | 已學內容 | 工具 |
| --- | --- | --- |
| Http 協議 | Request / Response / Status Code | — |
| URL 設計 | @RequestMapping / @PathVariable | Spring MVC |
| 接收參數 | @RequestParam / @RequestBody / @RequestHeader | Spring MVC |
| 回傳資料 | @RestController / JSON | Spring MVC |
| API 設計 | RESTful API / @GetMapping 等 | Spring MVC |
| **資料庫操作** | **尚未學習** | **Spring JDBC ← 本章** |

<!--
回顧一下這門課的學習進度。

從第十二章到第二十一章，我們學的幾乎都是 Spring MVC 的範疇：怎麼接收請求、怎麼回傳回應、怎麼設計 API。

但有一個重要的部分我們還沒學到：資料庫操作。

真實的後端系統需要把資料存進資料庫，也需要從資料庫讀取資料。這就是接下來幾章要學的 Spring JDBC。
-->

---

# 回顧：後端在整個系統中的位置

從前端到資料庫的完整流程：

| 層次 | 說明 | 技術 |
| --- | --- | --- |
| 前端 | 使用者操作介面，發送 Http Request | React / Vue / Angular |
| **Spring MVC** | 接收請求、處理邏輯、回傳 Response | **已學完** ✅ |
| **Spring JDBC** | 執行 SQL，存取資料庫資料 | **本章起學習** |
| 資料庫 | 儲存應用程式的數據 | MySQL |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>本章核心：</b> Spring JDBC 是後端和資料庫之間的橋樑，負責執行 SQL 語法來操作資料。
</div>

<!--
用這張表格來理解 Spring JDBC 在整個系統中的位置。

前端發送請求，Spring MVC 負責接收和處理，這個部分我們已經學完了。

但是，Spring MVC 處理完請求之後，需要去資料庫查詢或儲存資料，這個任務就交給 Spring JDBC。
Spring JDBC 執行 SQL 語法，拿到資料後回傳給 Spring MVC，Spring MVC 再把資料轉成 JSON 回應給前端。

Spring JDBC 就是後端和資料庫之間的橋樑。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 什麼是 Spring JDBC？

<!--
好，進入本章重點。
-->

---

# 什麼是 Spring JDBC？

| 項目 | 說明 |
| --- | --- |
| 定義 | 「讓我們能夠在 Spring Boot 中執行 SQL 語法，來存取資料庫的資料」 |
| 操作方式 | 直接撰寫 SQL 語法（INSERT、SELECT、UPDATE、DELETE） |
| 底層技術 | 封裝 Java 原生的 JDBC，簡化資料庫操作的繁瑣設定 |
| 使用方式 | 透過 `JdbcTemplate` 物件執行 SQL |

<!--
Spring JDBC 的定義很直白：讓我們能夠在 Spring Boot 中執行 SQL 語法，來存取資料庫的資料。

JDBC 是 Java Database Connectivity 的縮寫，是 Java 原生的資料庫連接技術。
但直接用 JDBC 很繁瑣，需要手動處理連線、例外、資源釋放等。

Spring JDBC 把這些細節都封裝好了，我們只需要告訴它要執行的 SQL，其他的它幫我們搞定。
核心工具是 JdbcTemplate 這個物件，後面幾章我們會學怎麼使用它。
-->

---

# Spring JDBC 在程式架構中的角色

完整的後端請求流程（以查詢學生為例）：

| 步驟 | 元件 | 說明 |
| --- | --- | --- |
| 1 | **前端** | 發送 `GET /students/123` |
| 2 | **Controller** | `@GetMapping` 接收請求，取得 `studentId = 123` |
| 3 | **Service** | 處理業務邏輯，呼叫 Dao 查詢 |
| 4 | **Dao（Spring JDBC）** | 執行 `SELECT * FROM student WHERE id = 123` |
| 5 | **資料庫（MySQL）** | 回傳查詢結果 |
| 6 | **回傳** | 資料一路向上，最終以 JSON 回應前端 |

<!--
這張表格展示了一個完整的請求流程，從前端到資料庫，再回到前端。

Spring JDBC 主要在第四步登場——由 Dao 層呼叫 Spring JDBC 來執行 SQL，取得資料庫的資料。

Dao 是 Data Access Object 的縮寫，專門負責資料存取的邏輯。
Controller 負責接收請求，Service 負責業務邏輯，Dao 負責資料庫操作，三層架構讓程式碼更有條理。

這個架構在後面的章節會完整實作，現在先建立印象就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## Spring JDBC、Spring Data JPA、MyBatis 的差別在哪裡？

<!--
接下來看三種資料庫操作框架的差別：Spring JDBC、Spring Data JPA、MyBatis。
-->

---

# 三種資料庫操作框架比較

| 比較項目 | Spring JDBC | MyBatis | Spring Data JPA |
| --- | --- | --- | --- |
| 操作方式 | 直接在 Java 程式碼中寫 SQL | SQL 寫在 XML 或 Annotation 中 | 透過 ORM，幾乎不寫 SQL |
| 學習門檻 | 低（需懂 SQL） | 低（需懂 SQL） | 中（需額外學 ORM 概念） |
| SQL 控制權 | 高（完全自己寫） | 高（完全自己寫） | 低（框架自動生成） |
| 適合情境 | 學習底層邏輯、複雜查詢 | 企業專案、SQL 與程式碼分離 | 快速開發、簡單 CRUD |
| 本課程 | ✅ 先學 | ✅ 後續介紹 | ✅ 後續介紹 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>學習順序：</b> 先學 Spring JDBC 打好 SQL 底子，再學 MyBatis 和 Spring Data JPA 會更順手。
</div>

<!--
Spring Boot 有三種常見的資料庫操作方式。

Spring JDBC：直接在 Java 程式碼裡寫 SQL，最貼近底層，適合初學者理解資料庫操作的本質。

MyBatis：SQL 寫在 XML 或 Annotation 裡，與 Java 程式碼分離，在企業專案中非常普遍。

Spring Data JPA：使用 ORM 概念，把資料庫表格對應成 Java 類別，幾乎不用手寫 SQL，適合快速開發。

三種方式本課程都會介紹。先從 Spring JDBC 開始，打好 SQL 基礎，後續再學 MyBatis 和 Spring Data JPA 就很容易上手。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 什麼是 CRUD？

<!--
最後，介紹一個後端開發中非常常見的縮寫——CRUD。
-->

---

# 什麼是 CRUD？

CRUD 是資料庫四種基本操作的縮寫：

| 縮寫 | 英文 | 操作 | 對應 SQL |
| --- | --- | --- | --- |
| **C** | Create | 新增資料 | `INSERT` |
| **R** | Read | 查詢資料 | `SELECT` |
| **U** | Update | 修改資料 | `UPDATE` |
| **D** | Delete | 刪除資料 | `DELETE` |

<!--
CRUD 是 Create、Read、Update、Delete 四個字的縮寫，代表資料庫最基本的四種操作。

在資料庫裡，這四種操作對應到四個 SQL 語法：
新增用 INSERT，查詢用 SELECT，修改用 UPDATE，刪除用 DELETE。

後端工程師幾乎每天都在做這四件事，所以 CRUD 是必須熟記的基本詞彙。

接下來幾章，我們會把這四個操作一個一個用 Spring JDBC 實作出來。
-->

---

# CRUD 對應 RESTful API 設計

CRUD 和 RESTful API 的設計完全對應：

| CRUD | SQL | Http Method | RESTful URL |
| --- | --- | --- | --- |
| Create | `INSERT` | `POST` | `/students` |
| Read | `SELECT` | `GET` | `/students/{id}` |
| Update | `UPDATE` | `PUT` | `/students/{id}` |
| Delete | `DELETE` | `DELETE` | `/students/{id}` |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>一切串聯：</b> RESTful API（Ch21）+ Spring JDBC（本章起）= 完整的後端系統。
</div>

<!--
看到這張表格，大家應該有一種恍然大悟的感覺。

我們在第二十一章學的 RESTful API——POST/GET/PUT/DELETE——和 CRUD 的對應關係是完全一致的。

這也是為什麼 RESTful API 設計得這麼好用：Http Method 的語意直接對應資料庫操作，前端工程師看到 URL 和 Method 就知道後端會做什麼。

把 Spring JDBC 學完之後，我們就能真正實作完整的後端系統：接收 RESTful 請求，執行 SQL，回傳 JSON 資料。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| Spring JDBC 定義 | 讓 Spring Boot 能執行 SQL 語法，存取資料庫資料 |
| 系統中的角色 | 後端和資料庫之間的橋樑，在 Dao 層執行 SQL |
| 三種框架比較 | Spring JDBC 直接寫 SQL；MyBatis SQL 與程式碼分離；JPA 使用 ORM 幾乎不寫 SQL |
| CRUD | Create/Read/Update/Delete，對應 INSERT/SELECT/UPDATE/DELETE |
| CRUD 與 RESTful | POST=Create、GET=Read、PUT=Update、DELETE=Delete，完全對應 |

<!--
今天的重點總結。

第一，Spring JDBC 是讓 Spring Boot 操作資料庫的工具，透過執行 SQL 語法來存取資料。
第二，在整個系統架構中，Spring JDBC 在 Dao 層，是後端和資料庫之間的橋樑。
第三，和 Spring Data JPA 相比，Spring JDBC 直接寫 SQL，更適合初學者理解底層邏輯。
第四，CRUD 是資料庫四種基本操作，和 RESTful API 的 Method 完全對應。

下一章我們就要開始設定資料庫連線，然後一步一步實作 CRUD 操作了！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
