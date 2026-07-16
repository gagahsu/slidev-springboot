---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: MVC 架構模式—Controller-Service-Dao 三層式架構
routeAlias: ch35
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
  <h1 style="color: #1a5c5c; font-size: 2.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    MVC 架構模式<br>Controller-Service-Dao 三層式架構
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓每一層只做自己的事，程式碼才好維護」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，我們已經學了 Spring MVC、RESTful API、Spring JDBC、JPA、MyBatis。

今天要把這些工具整合在一起——介紹 MVC 架構模式，以及在 Spring Boot 中最常見的三層式架構：Controller-Service-Dao。

學完這一章，你的程式碼就不再是把所有邏輯塞在一個 Class 裡，而是像真實的業界專案一樣，有清楚的分層結構。
-->

---
layout: default
---

# Outline

- **什麼是軟體工程？** — 架構設計的必要性、為什麼不能全塞一個 Class
- **什麼是 MVC 架構模式？** — Model、View、Controller 各自的職責
- **在 Spring Boot 中套用 MVC** — Spring MVC 對應 MVC 各層的方式
- **Controller-Service-Dao 三層式架構** — 三層的職責劃分與依賴方向
- **三層式架構實作** — 完整程式碼示範，Controller 呼叫 Service 呼叫 Dao
- **使用三層式架構的注意事項** — 常見錯誤、跨層呼叫問題
- **章節總結** — 架構核心原則整理

<!--
今天的章節比較多，但概念一個接一個串聯，整體邏輯很清楚。我們從「為什麼需要架構」開始，一路到實際的程式碼示範。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 什麼是軟體工程？

<!--
先從最根本的問題開始：為什麼需要所謂的「架構」？
-->

---

# 什麼是軟體工程？

| 項目 | 說明 |
| --- | --- |
| 定義 | 「研究工程師在面對大型系統時，如何有效率地協作開發」的學問 |
| 適用時機 | 程式碼超過 1,000–2,000 行、多人共同開發時 |
| 解決問題 | 如何讓程式碼易於維護、擴充、分工 |
| 常見工具 | 架構模式、設計原則、版本控制 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼要學？</b> 個人練習時程式碼少，隨便寫都沒問題。但在團隊和大型專案中，沒有架構很快就會變成難以維護的「義大利麵條程式碼」。
</div>

<!--
軟體工程這個領域，就是在研究「怎麼好好地寫大型程式」。

當程式碼只有幾百行，一個人寫，怎麼寫都好維護。
但當程式碼有幾萬行，十幾個工程師共同開發，如果沒有一套大家都認可的架構，就會非常混亂——你不知道某個功能在哪個檔案，別人改了你的程式碼你也不知道。

MVC 架構模式就是其中一個解決方案，讓程式碼有清楚的結構，大家都能快速上手。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 什麼是 MVC 架構模式？

<!--
了解為什麼需要架構之後，來看 MVC 是什麼。
-->

---

# MVC 架構模式

MVC 把系統分成三個角色，各自負責不同的事：

| 角色 | 英文 | 負責的事 |
| --- | --- | --- |
| **M**odel | Model | 實作業務邏輯、和資料庫溝通 |
| **V**iew | View | 把資料呈現給使用者（HTML 頁面或 JSON） |
| **C**ontroller | Controller | 接收前端的 Http 請求、驗證請求參數 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>現代後端：</b> 在前後端分離的架構中，View 改由前端（React/Vue）負責，後端的 View 就是回傳 JSON 資料。
</div>

<!--
MVC 是 Model-View-Controller 的縮寫，是一種非常經典的軟體架構模式，不只 Spring Boot，很多框架都採用這個概念。

Controller：負責「接球」，接收前端的 Http 請求。
Model：負責「做事」，處理業務邏輯和資料庫操作。
View：負責「展示」，把結果呈現給使用者。

在現代前後端分離的開發模式裡，View 的工作由前端框架（React、Vue）負責，後端的 View 就是回傳 JSON 資料。
-->

---

# 在 Spring Boot 中 MVC 的對應關係

| MVC 角色 | Spring Boot 的對應 | 說明 |
| --- | --- | --- |
| Controller | `@RestController` 類別 | 接收 Http 請求，回傳 JSON |
| Model | Service + Dao 類別 | 業務邏輯 + 資料庫操作 |
| View | JSON 回應 | @RestController 自動轉換 |

<!--
在 Spring Boot 的世界裡，MVC 三個角色的對應關係如表格所示。

我們之前學的 @RestController 就是 Controller。
業務邏輯（計算、驗證）和資料庫操作（SQL）合起來就是 Model，Spring Boot 習慣把它拆成 Service（業務邏輯）和 Dao（資料庫），形成三層式架構。
View 則是 @RestController 自動幫我們把物件轉成的 JSON 回應。

所以 Spring Boot 的 MVC，實際上是四層：Controller → Service → Dao → 資料庫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 在 Spring Boot 中套用 MVC 架構模式<br>Controller-Service-Dao 三層式架構

<!--
了解 MVC 概念之後，來看 Spring Boot 實際怎麼分層。
-->

---

# Controller-Service-Dao 三層架構的職責

| 層次 | 類別範例 | 職責 | Spring Annotation |
| --- | --- | --- | --- |
| **Controller** | `StudentController` | 接收 Http 請求，驗證參數，呼叫 Service | `@RestController` |
| **Service** | `StudentService` | 處理業務邏輯，呼叫 Dao | `@Service` |
| **Dao** | `StudentDao` | 執行 SQL，與資料庫溝通 | `@Repository` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>呼叫方向：</b> 前端 → Controller → Service → Dao → 資料庫（只能往下，不能跳層）
</div>

<!--
三層架構的核心概念是「各司其職」。

Controller 只負責接請求、驗參數、呼叫 Service，不做業務邏輯。
Service 只負責業務邏輯，呼叫 Dao 拿資料，不直接寫 SQL。
Dao 只負責執行 SQL，不做業務邏輯。

三層之間的呼叫是單向的：Controller 呼叫 Service，Service 呼叫 Dao，Dao 操作資料庫。
不能跳層，例如 Controller 不能直接呼叫 Dao。
-->

---

# 三個層次的 Spring Annotation

| Annotation | 使用層次 | 說明 |
| --- | --- | --- |
| `@RestController` | Controller 層 | 已學：接收 Http 請求，回傳 JSON |
| `@Service` | Service 層 | 標記業務邏輯類別，讓 Spring 管理為 Bean |
| `@Repository` | Dao 層 | 標記資料存取類別，讓 Spring 管理為 Bean |

<!--
三個層次各有對應的 Annotation。

@RestController 我們已經很熟了。

@Service 和 @Repository 都是 @Component 的特化版本，功能上和 @Component 一樣，都是讓 Spring 把這個類別管理成 Bean。
但用特化的 Annotation 可以讓程式碼的意圖更清楚：一看 @Service 就知道這是業務邏輯層，@Repository 就知道是資料存取層。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## 實際使用 Controller-Service-Dao 三層式架構

<!--
概念學完，來看實際的程式碼。
-->

---

# StudentController — Controller 層

```java
@RestController
public class StudentController {
    @Autowired
    private StudentService studentService;

    @GetMapping("/students/{studentId}")
    public Student read(@PathVariable("studentId") Integer studentId) {
        return studentService.getStudentById(studentId);
    }
}
```

<!--
Controller 的職責：接收 Http 請求，取得參數，呼叫 Service，回傳結果。

注意 Controller 裡沒有任何業務邏輯，也沒有任何 SQL——只是把 studentId 傳給 Service 要資料。

@Autowired 注入 StudentService，兩個類別透過 IoC 容器連在一起，Controller 不需要知道 Service 的實作細節。
-->

---

# StudentService — Service 層

```java
@Service
public class StudentService {
    @Autowired
    private StudentDao studentDao;

    public Student getStudentById(Integer studentId) {
        return studentDao.getStudentById(studentId);
    }
}
```

<!--
Service 的職責：處理業務邏輯，呼叫 Dao。

這個例子很簡單，Service 直接把 studentId 傳給 Dao。

在真實專案中，Service 可能會做更多事，例如：先檢查這個 studentId 是否有效、計算一些業務相關的數值、組合多個 Dao 的查詢結果等。

@Service 標記這個類別，@Autowired 注入 StudentDao。
-->

---

# StudentDao — Dao 層

```java
@Repository
public class StudentDao {
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public Student getStudentById(Integer studentId) {
        // 執行 SELECT SQL，回傳 Student 物件
    }
}
```

<!--
Dao 的職責：執行 SQL，與資料庫溝通，回傳資料。

@Repository 標記這個類別是 Dao 層，@Autowired 注入 NamedParameterJdbcTemplate 來執行 SQL。

注意 Dao 裡只有資料庫操作的程式碼，沒有任何業務邏輯。

真實的 getStudentById 方法裡，會寫 SELECT SQL + RowMapper，就是我們第二十五章學的 query() 用法。
-->

---

# 三層呼叫的完整流程

以「查詢 id=123 的學生」為例：

| 步驟 | 層次 | 動作 |
| --- | --- | --- |
| 1 | **前端** | 發送 `GET /students/123` |
| 2 | **Controller** | `read(@PathVariable 123)` → 呼叫 `studentService.getStudentById(123)` |
| 3 | **Service** | `getStudentById(123)` → 呼叫 `studentDao.getStudentById(123)` |
| 4 | **Dao** | 執行 `SELECT * FROM student WHERE id = 123` |
| 5 | **回傳** | 結果一路向上，最終 Controller 回傳 JSON 給前端 |

<!--
這張表格展示了一個完整請求在三層架構中的流程。

前端發 GET 請求 → Controller 接到請求、取出 studentId → Controller 呼叫 Service → Service 呼叫 Dao → Dao 執行 SQL → 資料一路向上回傳 → Controller 把 Student 物件轉成 JSON 回應前端。

每一層只做自己該做的事，邊界清楚，維護起來非常方便。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5

## 使用 Controller-Service-Dao 三層式架構的注意事項

<!--
學完三層架構的基本用法，最後來看幾個重要的注意事項。
-->

---

# 三層架構的注意事項

| 規則 | 說明 |
| --- | --- |
| 禁止跨層呼叫 | Controller 不能直接使用 Dao，必須經過 Service |
| Dao 只做 SQL | Dao 層只能執行 SQL，不能放業務邏輯（如排序、過濾） |
| Bean 管理 | Controller、Service、Dao 都要用對應的 Annotation 讓 Spring 管理 |
| 命名規範 | 類別名稱要清楚標示層次（StudentController、StudentService、StudentDao） |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>最常見的錯誤：</b> 在 Controller 裡直接注入 Dao 並執行 SQL。這樣做雖然能跑，但違反三層架構的設計原則，未來維護會非常困難。
</div>

<!--
最重要的規則是：不能跨層呼叫。

Controller 不能直接使用 Dao，這是三層架構最核心的約束。
如果 Controller 可以直接呼叫 Dao，那 Service 層就失去了意義，業務邏輯會散落在各處。

另外，Dao 只能執行 SQL——如果你需要對查詢結果排序或過濾，這個邏輯要放在 Service，不是 Dao。
Dao 只負責「從資料庫拿資料」，邏輯判斷是 Service 的工作。

⚠️ 初學者最常犯的錯誤就是在 Controller 裡直接 @Autowired StudentDao，這樣做程式能跑，但架構就壞掉了。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 軟體工程 | 研究大型系統如何有效率協作開發 |
| MVC | Model（業務+DB）/ View（JSON）/ Controller（Http請求） |
| 三層架構 | Controller → Service → Dao → 資料庫 |
| Controller | `@RestController`，接請求、驗參數、呼叫 Service |
| Service | `@Service`，業務邏輯，呼叫 Dao |
| Dao | `@Repository`，執行 SQL，只做資料庫操作 |
| 核心規則 | 禁止跨層、Dao 不放業務邏輯、命名清楚 |

<!--
今天的重點總結。

第一，軟體工程解決大型系統的協作問題，MVC 是其中一個解決方案。
第二，MVC 三個角色：Model、View、Controller，各自有明確職責。
第三，Spring Boot 的三層架構：Controller → Service → Dao。
第四，@Service 標記 Service 層，@Repository 標記 Dao 層。
第五，最重要的規則：Controller 不能直接用 Dao，Dao 只執行 SQL。

學完這一章，你的 Spring Boot 程式碼就有了業界標準的架構，可以開始寫真實的後端系統了！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
