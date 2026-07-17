---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring JDBC 的用法（上）—執行 INSERT、UPDATE、DELETE SQL
routeAlias: ch24
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
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Spring JDBC 的用法（上）<br>執行 INSERT、UPDATE、DELETE SQL
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用 update() 方法，讓資料真正寫進資料庫」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，上一章我們設定好了資料庫連線，Spring Boot 已經能連接到 MySQL 了。

今天終於要開始執行 SQL 了！

Spring JDBC 把 SQL 分成兩大類：一類是會「修改」資料的（INSERT、UPDATE、DELETE），另一類是「查詢」資料的（SELECT）。
今天先學修改類——用 update() 方法執行 INSERT、UPDATE、DELETE。
-->

---
layout: default
---

# Outline

- **Spring JDBC 三大方法** — `execute()`、`update()`、`query()`
- **Part 1：execute() — DDL 操作** — 建立資料表、`CREATE TABLE`、依賴注入三種寫法
- **Part 2：update() 基本概念** — `NamedParameterJdbcTemplate`、具名參數 vs `?`、四個步驟
- **Part 3：update() 完整範例** — INSERT / UPDATE / DELETE 範例、回傳值意義
- **Part 4：串接三層式架構** — Controller + Service + Dao 完整程式碼
- **Part 5：批次新增** — `batchUpdate()` 原理與實作、三層串接與 Postman 測試
- **章節總結** — 修改類 SQL 完整整理

<!--
今天的架構：先介紹 Spring JDBC 的三大工具，然後一步一步學 update() 方法，最後總結三種 SQL 的用法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 前言

## Spring JDBC 用法介紹

<!--
先介紹 Spring JDBC 提供的工具和基本架構。
-->

---

# Spring JDBC 的三大操作方法

JdbcTemplate 提供三個主要方法，對應不同的 SQL 操作類型：

| 方法 | 對應 SQL | 說明 | 本章 |
| --- | --- | --- |  --- |
| `execute()` | CREATE / DROP（DDL） | 無動態參數，直接執行 | ← 本章 |
| `update()` | INSERT / UPDATE / DELETE | 需 Map 傳入動態參數 | ← 本章 |
| `query()` | SELECT | 回傳 List，需 RowMapper | 下一章 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶口訣：</b> DDL 建表用 <code>execute()</code>；改變資料用 <code>update()</code>；讀取資料用 <code>query()</code>。
</div>

<!--
Spring JDBC 把 SQL 操作分成三種方法，各有不同用途。

execute()：最簡單，用於不帶動態參數的 SQL，例如建立資料表。
update()：INSERT、UPDATE、DELETE 都會改變資料庫內容，統一用 update() 執行。
query()：SELECT 只讀取資料，用 query() 系列的方法。

今天先學 execute() 和 update()，下一章學 query()。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## execute() — DDL 操作

<!--
先看最簡單的 execute()，了解建表的寫法。
-->

---

# execute() — 建立資料表（DDL 操作）

`execute()` 適合不需要傳入動態參數的 SQL，最常用於 DDL 操作：

| 項目 | 說明 |
| --- | --- |
| 注入工具 | `JdbcTemplate`（不需要具名參數，直接執行） |
| 適用場景 | `CREATE TABLE`、`DROP TABLE` 等 DDL 語法 |
| 回傳型別 | `void`（不回傳任何值） |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>實務提醒：</b> 建表通常用 <code>schema.sql</code> 或 Flyway/Liquibase 管理，而不是寫在應用程式碼裡；初學階段先理解 <code>execute()</code> 的作用即可。
</div>

<!--
execute() 是三個方法中最簡單的一個，用來執行「不帶動態參數」的 SQL。

最典型的用途是建立資料表，CREATE TABLE 語法通常是固定的，不需要傳入任何動態值。

這裡注入的是 JdbcTemplate，不是 NamedParameterJdbcTemplate，因為不需要處理具名參數。

⚠️ 實務上，建表通常用 schema.sql 或 Flyway/Liquibase 管理，而不是寫在應用程式碼裡；但初學階段先理解 execute() 的作用。
-->

---

# execute() — 程式碼範例

在 DAO 中注入 `JdbcTemplate`，執行 `CREATE TABLE`：

```java
@Repository
public class StudentDao {

    private final JdbcTemplate jdbcTemplate;

    public StudentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void createTable() {
        String sql = "CREATE TABLE IF NOT EXISTS student " +
                     "(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50))";
        jdbcTemplate.execute(sql);
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b><code>@Repository</code>：</b> 效果同 <code>@Component</code>，會把這個類別建立成 Bean；語意上專門標記「資料存取層（DAO）」的類別，讓分層更清楚。
</div>

<!--
來看實際的程式碼。

類別加上 @Repository。它的效果和之前學過的 @Component 一樣，會把這個類別建立成 Bean，交給 Spring 容器管理；
差別在於語意：@Repository 專門用來標記「資料存取層」的類別，也就是負責跟資料庫溝通的 DAO，讓程式的分層一目了然。

注入的是 JdbcTemplate，不是 NamedParameterJdbcTemplate，因為 DDL 不需要處理具名參數。

注入方式使用「建構子注入」：宣告 final 欄位，透過建構子接收，這是 Spring 官方建議的寫法，下一頁會詳細比較。

SQL 是固定的 CREATE TABLE 字串，直接丟給 execute() 執行，沒有回傳值。

不過寫好了 DAO，程式並不會自動執行它——下一頁來看怎麼觸發這個方法。
-->

---

# 如何觸發 createTable()？— 三層式架構

Dao 只是定義方法，程式不會自動執行它。Spring 的標準做法是「三層式架構」：

| 分層 | 註解 | 職責 | 範例類別 |
| --- | --- | --- | --- |
| Controller | `@RestController` | 接收 HTTP 請求、回傳結果 | `StudentController` |
| Service | `@Service` | 商業邏輯（目前先單純轉呼叫） | `StudentService` |
| Dao | `@Repository` | 操作資料庫、執行 SQL | `StudentDao` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>呼叫鏈：</b> Postman → Controller → Service → Dao → 資料庫。Controller 不直接呼叫 Dao，中間一定經過 Service。
</div>

<!--
寫好 StudentDao 之後，程式不會自己執行 createTable()，必須有人去呼叫它。

Spring 的標準做法是三層式架構：Controller 負責接收 HTTP 請求，Service 負責商業邏輯，Dao 負責操作資料庫。

@Service 和 @Repository 一樣，效果都等同 @Component，會把類別建立成 Bean；差別只在語意——@Service 標記商業邏輯層。

初學時 Service 看起來只是「轉呼叫」Dao，好像多此一舉；但等商業邏輯變複雜（例如檢查資料、計算、跨多個 Dao），Service 的價值就會顯現。從一開始就養成 Controller → Service → Dao 的習慣。

接下來兩頁分別看 Service 和 Controller 的程式碼。
-->

---

# 觸發 createTable() — Service 層

建立 `StudentService`，注入 `StudentDao`，轉呼叫 Dao 的方法：

```java
@Service
public class StudentService {

    private final StudentDao studentDao;

    public StudentService(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public void createTable() {
        studentDao.createTable();
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b><code>@Service</code>：</b> 效果同 <code>@Component</code>，會建立成 Bean；語意上標記「商業邏輯層」。目前邏輯只是轉呼叫 Dao，之後章節會在這層加入檢查、計算等邏輯。
</div>

<!--
Service 層的寫法：類別加上 @Service，用建構子注入 StudentDao，方法裡呼叫 studentDao.createTable()。

@Service 的效果和 @Component、@Repository 一樣都會建立成 Bean，差別只在語意，標記這是商業邏輯層。

現在 Service 只有一行轉呼叫，看起來很空；但這一層是保留給商業邏輯的位置，之後功能變複雜時就會用到。
-->

---

# 觸發 createTable() — Controller 層

建立 `StudentController`，注入 `StudentService`，用 API 觸發：

```java
@RestController
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/students/table")
    public String createTable() {
        studentService.createTable();
        return "資料表建立成功";
    }
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>測試方式：</b> 啟動 Spring Boot 後，用 Postman 發送 <code>POST http://localhost:8080/students/table</code>，再到 MySQL 確認 <code>student</code> 資料表已建立。
</div>

<!--
最後是 Controller：注入的是 StudentService，不是 StudentDao——Controller 只跟 Service 溝通。

@PostMapping 建立一個 API，收到請求時呼叫 studentService.createTable()，Service 再呼叫 Dao，Dao 執行 SQL。

測試流程：啟動 Spring Boot，打開 Postman，發送 POST 請求到 /students/table，
收到「資料表建立成功」後，再到 MySQL Workbench 確認 student 資料表真的出現了。

完整呼叫鏈：Postman → Controller → Service → Dao → 資料庫。接下來所有範例都會遵守這個結構。
-->

---

# 補充：依賴注入的三種寫法

本課程統一使用「建構子注入」，另外兩種寫法在其他教材也很常見：

```java
// ✅ 寫法一：建構子注入（Spring 官方建議，本課程使用）
private final JdbcTemplate jdbcTemplate;

public StudentDao(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
}
```

```java
// 寫法二：@Autowired 欄位注入（舊教材常見，不建議）
@Autowired
private JdbcTemplate jdbcTemplate;
```

```java
// 寫法三：Lombok @RequiredArgsConstructor（自動生成建構子，效果同寫法一）
@Repository
@RequiredArgsConstructor
public class StudentDao {
    private final JdbcTemplate jdbcTemplate;
}
```

<!--
這裡補充說明依賴注入的三種寫法。

寫法一：建構子注入。欄位宣告成 final，透過建構子接收。
好處：欄位不可變、依賴缺失時啟動就報錯、單元測試不需要 Spring 容器就能 new 出來。
只有一個建構子時，Spring 4.3 之後連 @Autowired 都不用寫。

寫法二：@Autowired 欄位注入。程式碼最短，很多舊教材和舊專案都這樣寫。
缺點：欄位不能宣告 final，測試時只能靠反射塞 mock，依賴太多也不容易察覺。

寫法三：Lombok 的 @RequiredArgsConstructor。它會自動幫所有 final 欄位生成建構子，
編譯後的結果就等於寫法一，程式碼卻和寫法二一樣短，是實務上最流行的折衷方案。

本課程接下來的範例統一使用寫法一，讓大家看清楚建構子注入的完整結構。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## update() 基本概念

<!--
進入本章重點：update() 的核心工具和基本概念。
-->

---

# 新增、修改、刪除，都用 update() 執行

`update()` 這個方法名稱容易誤會——它不是只執行 UPDATE SQL：

| SQL 操作 | 作用 | 執行方法 |
| --- | --- | --- |
| `INSERT` | 新增資料 | `update()` |
| `UPDATE` | 修改資料 | `update()` |
| `DELETE` | 刪除資料 | `update()` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼共用一個方法？</b> 這三種 SQL 的共同點是都會「改變資料庫的資料」，Spring JDBC 把它們歸為同一類，統一用 <code>update()</code> 執行；只「讀取」的 SELECT 才用 <code>query()</code>。
</div>

<!--
先澄清一個很容易誤會的地方：update() 不是只拿來執行 UPDATE SQL。

INSERT、UPDATE、DELETE 三種 SQL，全部都是呼叫 update() 這個方法執行。

為什麼？因為 Spring JDBC 分類的標準不是 SQL 的名字，而是「會不會改變資料」：
這三種都會改變資料庫裡的資料，所以歸為同一類，共用 update() 方法；
SELECT 只讀取、不改變資料，才用另一個方法 query()。

記住這個分類，後面看到用 update() 執行 INSERT 或 DELETE 就不會覺得奇怪了。
-->

---

# 核心工具：NamedParameterJdbcTemplate

| 項目 | 說明 |
| --- | --- |
| 類別名稱 | `NamedParameterJdbcTemplate` |
| 用途 | 執行帶有「具名參數（Named Parameters）」的 SQL 語法 |
| 具名參數格式 | SQL 裡用 `:paramName` 當作佔位符 |
| 取得方式 | 透過建構子注入（Spring 自動提供） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼用具名參數？</b> 比傳統的 <code>?</code> 佔位符更清楚，SQL 和參數的對應關係一目了然。
</div>

<!--
Spring JDBC 主要透過 NamedParameterJdbcTemplate 這個物件來執行 SQL。

名字很長，但核心概念很簡單：它支援「具名參數」——在 SQL 裡用 :paramName 當佔位符，然後傳入一個 Map 告訴它每個 :paramName 對應什麼值。

這比傳統的 ? 佔位符清楚多了，因為你可以從名字就知道這個參數代表什麼。

使用前用建構子注入，Spring Boot 會自動幫我們建立這個物件並傳進來。
-->

---

# 具名參數 vs `?` 佔位符

Spring JDBC 支援兩種 SQL 參數寫法：

| 比較項目 | `?` 佔位符（`JdbcTemplate`） | `:paramName`（`NamedParameterJdbcTemplate`） |
| --- | --- | --- |
| SQL 範例 | `INSERT INTO student VALUES (?, ?)` | `INSERT INTO student VALUES (:id, :name)` |
| 傳入方式 | `Object[]` 陣列，順序不能錯 | `Map<String, Object>`，用名稱對應 |
| 可讀性 | 低（看不出參數代表什麼） | 高（名稱直接說明用途） |
| 本課程使用 | — | ✅ 使用 `NamedParameterJdbcTemplate` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選擇 <code>:paramName</code>：</b> 參數多時不會搞混順序，程式碼更易讀、更好維護。
</div>

<!--
Java 原生 JDBC 用的是 ? 佔位符，傳參數要用 Object[] 陣列，順序必須對應 SQL 裡的 ? 位置。
參數一多就很容易寫錯順序。

Spring JDBC 的 NamedParameterJdbcTemplate 改用 :paramName，用名稱對應，不依賴順序。
本課程統一使用 NamedParameterJdbcTemplate。
-->

---

# update() 的四個步驟

| 步驟 | 說明 |
| --- | --- |
| 1 | 建構子注入 `NamedParameterJdbcTemplate` |
| 2 | 定義 SQL 字串，用 `:paramName` 作為佔位符 |
| 3 | 建立 `Map<String, Object>`，填入參數值 |
| 4 | 呼叫 `namedParameterJdbcTemplate.update(sql, map)` |

<!--
使用 update() 的流程固定是四個步驟。

注入工具、寫 SQL、準備參數、執行。

四個步驟每次都一樣，只有 SQL 語法和 Map 的內容會根據操作不同而改變。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## update() 完整範例

<!--
概念學完了，來看實際程式碼。從注入工具開始，接著理解 Map，再看完整的 INSERT、UPDATE、DELETE 範例。
-->

---

# 為什麼需要 Map？

Map 讓 SQL 的值可以「動態決定」，而不是寫死在程式碼裡：

| 方式 | SQL 範例 | 問題 |
| --- | --- | --- |
| 寫死（靜態） | `INSERT INTO student VALUES (123, 'Judy')` | 只能新增同一筆資料 |
| Map（動態） | `INSERT INTO student VALUES (:id, :name)` | 根據前端傳來的資料動態決定 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>動態的好處：</b> 同一段 SQL + update() 程式碼，可以新增任何前端傳來的學生資料。
</div>

<!--
想像一下，如果你把 id 和 name 直接寫死在 SQL 裡，那麼每次執行都只能新增同一筆資料。

用具名參數加上 Map，就能讓 SQL 的值從前端動態傳入。
前端傳 id=123, name=Judy，就新增 Judy；傳 id=456, name=Tom，就新增 Tom。

同一段程式碼，根據不同的 Map 值，會執行不同的 SQL 操作，這才是實際應用的樣子。
-->

---

# Map 的運作原理

`:paramName` 和 `map.put(key, value)` 的對應關係：

| SQL 裡的具名參數 | map.put() 的 key | 說明 |
| --- | --- | --- |
| `:studentId` | `"studentId"` | key 名稱必須完全一致 |
| `:studentName` | `"studentName"` | key 名稱必須完全一致 |

```java
map.put("studentId", student.getId());   // :studentId → 123
map.put("studentName", student.getName()); // :studentName → "Judy"
```

<!--
Map 的運作很簡單：SQL 裡的 :paramName，對應 map 裡同名的 key。

:studentId 對應 map.put("studentId", ...)。
執行時，Spring JDBC 會把 map 裡 key 為 "studentId" 的值，替換到 SQL 的 :studentId 位置。

⚠️ 最容易犯的錯誤：SQL 裡寫 :studentId，但 map.put() 的 key 寫 "student_id"（底線vs駝峰）。
名稱不一致就找不到值，執行時會出錯。
-->

---

# INSERT 語法說明

`INSERT` 用來「新增」一筆資料到資料表：

```sql
INSERT INTO 資料表名稱(欄位1, 欄位2) VALUES (值1, 值2)
```

| 組成部分 | 說明 | 範例 |
| --- | --- | --- |
| `INSERT INTO 資料表` | 指定要新增到哪張資料表 | `INSERT INTO student` |
| `(欄位1, 欄位2)` | 列出要填值的欄位 | `(id, name)` |
| `VALUES (值1, 值2)` | 依序提供每個欄位的值 | `VALUES (:studentId, :studentName)` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對應關係：</b> 欄位和值依「順序」一一對應——<code>id</code> 對 <code>:studentId</code>、<code>name</code> 對 <code>:studentName</code>。
</div>

<!--
在寫程式之前，先看懂 INSERT 的 SQL 語法。

INSERT INTO 後面接資料表名稱，括號裡列出要填值的欄位；VALUES 後面依序提供每個欄位的值。
欄位和值是按順序一一對應的：第一個欄位 id 對應第一個值，第二個欄位 name 對應第二個值。

在 Spring JDBC 裡，VALUES 的值不寫死，改用 :paramName 具名參數，執行時由 Map 提供實際的值。
-->

---

# 完整的 INSERT 範例（1/2）— 注入工具、定義 SQL

Step 1、Step 2：注入 `NamedParameterJdbcTemplate`，定義帶具名參數的 SQL：

```java
@Repository
public class StudentDao {
    // Step 1: 建構子注入 NamedParameterJdbcTemplate
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    public StudentDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }
    public void createStudent(Student student) {
        // Step 2: 定義 SQL，用 :paramName 作為佔位符
        String sql = "INSERT INTO student(id, name) VALUES (:studentId, :studentName)";
        // ...（下一頁：Step 3、Step 4）
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Step 2 重點：</b> SQL 裡的 <code>:studentId</code>、<code>:studentName</code> 是具名參數，值稍後由 Map 提供。
</div>

<!--
INSERT 範例分成兩頁看，這一頁是前兩個步驟。

類別加上 @Repository，告訴 Spring 這是資料存取層的 Bean。
Step 1：建構子注入 NamedParameterJdbcTemplate，和前面 execute() 注入 JdbcTemplate 的寫法一樣，只是換了工具。

方法名稱 createStudent，接收一個 Student 物件，裡面有前端傳來的 id 和 name。

Step 2：定義 SQL 字串，用 :studentId 和 :studentName 作為具名佔位符。
注意這時候 SQL 只是一個字串，還沒有執行，值也還沒有填進去——下一頁用 Map 提供值並執行。
-->

---

# 完整的 INSERT 範例（2/2）— 建立 Map、執行 update()

Step 3、Step 4：把參數值放進 Map，呼叫 `update()` 執行：

```java
    public void createStudent(Student student) {
        String sql = "INSERT INTO student(id, name) VALUES (:studentId, :studentName)";

        // Step 3: 建立 Map，填入參數值
        Map<String, Object> map = new HashMap<>();
        map.put("studentId", student.getId());
        map.put("studentName", student.getName());

        // Step 4: 呼叫 update() 執行 SQL
        namedParameterJdbcTemplate.update(sql, map);
    }
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> <code>map.put()</code> 的 key 必須和 SQL 的 <code>:paramName</code> 完全一致（含大小寫），否則執行時會找不到對應的值。
</div>

<!--
接續上一頁，這一頁是後兩個步驟。

Step 3：建立 HashMap，把 student 物件的 id 和 name 放進去。
key 是 "studentId" 和 "studentName"，對應 SQL 裡的 :studentId 和 :studentName。

Step 4：呼叫 update()，把 SQL 和 map 傳進去，Spring JDBC 會把 map 的值替換到 SQL 的佔位符，再送到資料庫執行。

⚠️ 注意：map.put() 的 key 字串必須和 SQL 的 :paramName 完全一致（大小寫也要一樣），否則執行時會找不到對應的值。
-->

---

# UPDATE 語法說明

`UPDATE` 用來「修改」資料表中已存在的資料：

```sql
UPDATE 資料表名稱 SET 欄位 = 新值 WHERE 條件
```

| 組成部分 | 說明 | 範例 |
| --- | --- | --- |
| `UPDATE 資料表` | 指定要修改哪張資料表 | `UPDATE student` |
| `SET 欄位 = 新值` | 要改哪個欄位、改成什麼值 | `SET name = :studentName` |
| `WHERE 條件` | 限定要修改「哪幾筆」資料 | `WHERE id = :studentId` |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>WHERE 不能省：</b> 沒有 WHERE，整張資料表的每一筆都會被 SET 改掉。
</div>

<!--
一樣先看懂 UPDATE 的語法再寫程式。

UPDATE 接資料表名稱；SET 指定要改哪個欄位、改成什麼值，多個欄位用逗號分隔；
WHERE 限定要修改哪幾筆資料，通常用主鍵 id 定位到特定一筆。

⚠️ WHERE 是 UPDATE 最重要的部分：沒有 WHERE，SET 會套用到整張資料表的每一筆資料。
-->

---

# UPDATE SQL 範例（1/2）— 注入工具、定義 SQL

用 `update()` 修改資料庫中的學生資料，Step 1、Step 2：

```java
@Repository
public class StudentDao {
    // Step 1: 建構子注入 NamedParameterJdbcTemplate
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    public StudentDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }
    public void updateStudent(Student student) {
        // Step 2: 定義 SQL
        String sql = "UPDATE student SET name = :studentName WHERE id = :studentId";
        // ...（下一頁：Step 3、Step 4）
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>一定要加 WHERE：</b> 沒有 WHERE 的 UPDATE 會把整張資料表的所有資料都改掉。
</div>

<!--
UPDATE 的用法和 INSERT 幾乎一樣，注入和整體結構完全相同，只有 SQL 語法不同。

Step 2 的 SQL 改成 UPDATE student SET name = :studentName WHERE id = :studentId。
SET 決定要改什麼，WHERE 子句限定要更新哪一筆資料，避免把所有資料都改掉。

⚠️ 寫 UPDATE 時一定要加 WHERE 條件！如果不加，會把資料表裡所有的學生名稱都改掉，這通常是致命的錯誤。
-->

---

# UPDATE SQL 範例（2/2）— 建立 Map、執行 update()

Step 3、Step 4：SET 和 WHERE 兩邊的值都要放進 Map：

```java
    public void updateStudent(Student student) {
        String sql = "UPDATE student SET name = :studentName WHERE id = :studentId";

        // Step 3: 建立 Map（SET 的值 + WHERE 條件的值）
        Map<String, Object> map = new HashMap<>();
        map.put("studentId", student.getId());
        map.put("studentName", student.getName());

        // Step 4: 呼叫 update() 執行 SQL
        namedParameterJdbcTemplate.update(sql, map);
    }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Map 內容：</b> <code>studentName</code> 是要改成的新值（SET）；<code>studentId</code> 是要改哪一筆（WHERE）。
</div>

<!--
接續上一頁，後兩個步驟。

Step 3：Map 要放兩種值——SET 需要的新名字 studentName，和 WHERE 需要的 studentId。
和 INSERT 不同的是，這裡的兩個參數角色不同：一個是要更新的內容，一個是定位條件。

Step 4：呼叫 update() 執行，回傳受影響的列數；如果 WHERE 沒有符合的資料，回傳 0，後面會有一頁專門講回傳值。
-->

---

# DELETE 語法說明

`DELETE` 用來「刪除」資料表中的資料：

```sql
DELETE FROM 資料表名稱 WHERE 條件
```

| 組成部分 | 說明 | 範例 |
| --- | --- | --- |
| `DELETE FROM 資料表` | 指定要從哪張資料表刪除 | `DELETE FROM student` |
| `WHERE 條件` | 限定要刪除「哪幾筆」資料 | `WHERE id = :studentId` |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>WHERE 不能省：</b> 沒有 WHERE 的 DELETE 會把整張資料表的資料全部刪光，且無法復原。
</div>

<!--
DELETE 是三種語法中最簡單的：DELETE FROM 接資料表名稱，WHERE 限定要刪哪幾筆。

注意 DELETE 沒有欄位的概念——它刪除的是「整筆資料」，不是某個欄位的值。
如果只想清掉某個欄位，要用 UPDATE 把它改成 NULL，而不是 DELETE。

⚠️ 和 UPDATE 一樣，WHERE 絕對不能省：沒有 WHERE 的 DELETE 會清空整張資料表，而且無法復原。
-->

---

# DELETE SQL 範例

用 `update()` 刪除資料庫中的學生資料：

```java
@Repository
public class StudentDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public StudentDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public void deleteStudent(Integer studentId) {
        // Step 2: 定義 SQL
        String sql = "DELETE FROM student WHERE id = :studentId";
        // Step 3: 建立 Map
        Map<String, Object> map = new HashMap<>();
        map.put("studentId", studentId);
        // Step 4: 呼叫 update() 執行 SQL
        namedParameterJdbcTemplate.update(sql, map);
    }
}
```

<!--
DELETE 的參數更少，只需要知道要刪除哪一筆的 id。

SQL 是 DELETE FROM student WHERE id = :studentId，Map 只放一個 studentId。

⚠️ 和 UPDATE 一樣，DELETE 一定要加 WHERE 條件！沒有 WHERE 的 DELETE 會把整張資料表的資料全部刪光，這是非常危險的操作。

另外注意：這裡的 studentId 是 @PathVariable 從 URL 路徑接收到的值（Integer 類型），不是 Student 物件的 id。
-->

---

# update() 的回傳值

`update()` 執行後，回傳一個 `int`，代表「受影響的資料列數」：

| SQL 操作 | 情境 | 回傳值 |
| --- | --- | --- |
| `INSERT` | 成功新增一筆 | `1` |
| `UPDATE` | WHERE 條件符合 3 筆，全部更新 | `3` |
| `UPDATE` | WHERE 條件沒有符合的資料 | `0` |
| `DELETE` | 成功刪除一筆 | `1` |

```java
int rowsAffected = namedParameterJdbcTemplate.update(sql, map);
// rowsAffected == 0 代表沒有任何資料被更新或刪除
```

<!--
update() 不是 void，它回傳一個 int，代表 SQL 影響了幾筆資料。

實務上可以用這個回傳值做判斷：
如果 UPDATE 或 DELETE 的回傳值是 0，表示沒有符合條件的資料，可以選擇拋出例外或回傳 404 給前端。

這個判斷在後面的章節會實作，現在先知道有這個回傳值就好。
-->

---

# update() 三種 SQL 的比較

| SQL 操作 | SQL 語法模式 | Map 需要的 key |
| --- | --- | --- |
| `INSERT` | `INSERT INTO table(col) VALUES (:param)` | 所有欄位的值 |
| `UPDATE` | `UPDATE table SET col = :param WHERE id = :id` | 要更新的值 + WHERE 條件的值 |
| `DELETE` | `DELETE FROM table WHERE id = :id` | WHERE 條件的值（通常只有 id） |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>重要提醒：</b> UPDATE 和 DELETE 一定要加 WHERE 條件，否則會修改或刪除整張資料表的所有資料。
</div>

<!--
用這張表格總結三種 SQL 操作的模式。

INSERT：SQL 帶欄位名稱和對應的具名參數，Map 放所有欄位的值。
UPDATE：SQL 有 SET 和 WHERE 兩個部分，Map 要包含兩者的值。
DELETE：SQL 通常只有 WHERE 條件，Map 只放 id。

⚠️ 再次強調：UPDATE 和 DELETE 必須有 WHERE。這個習慣要從一開始就養成。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## 串接三層式架構

<!--
Dao 的 INSERT、UPDATE、DELETE 都寫好了，但同樣的問題：誰來呼叫它們？
這一節把 Service 和 Controller 補上，讓前端真的能透過 API 操作資料庫。
-->

---

# 回顧：三層式架構的呼叫鏈

Dao 寫好了 `createStudent()`、`updateStudent()`、`deleteStudent()`，接著補上 Service 和 Controller：

| 分層 | 類別 | 這一章要做的事 |
| --- | --- | --- |
| Controller | `StudentController` | 提供 POST / PUT / DELETE 三個 API |
| Service | `StudentService` | 轉呼叫 Dao 對應的方法 |
| Dao | `StudentDao` | 已完成（Part 3 的三個方法） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>資料的流向：</b> 前端 JSON → Controller 的 <code>@RequestBody</code> 轉成 <code>Student</code> 物件 → 一路傳到 Dao → 值放進 Map → 替換 SQL 的 <code>:paramName</code>。
</div>

<!--
Part 3 完成了 Dao 的三個方法，但和 createTable() 一樣，Dao 不會自己執行，要靠 Controller 和 Service 串起來。

這張表整理各層的工作：Controller 開三個 API 對應新增、修改、刪除；Service 轉呼叫 Dao；Dao 已經寫好了。

注意資料流向：前端傳來的 JSON，由 @RequestBody 轉成 Student 物件，經過 Service 傳到 Dao，
Dao 把物件的值放進 Map，最後替換掉 SQL 裡的具名參數。整條鏈路走完，資料才真正進到資料庫。
-->

---

# StudentService（1/2）— 注入 Dao、新增與刪除

注入 `StudentDao`，`createStudent()` 和 `deleteStudent()` 單純轉呼叫：

```java
@Service
public class StudentService {

    private final StudentDao studentDao;

    public StudentService(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public void createStudent(Student student) {
        studentDao.createStudent(student);
    }

    public void deleteStudent(Integer studentId) {
        studentDao.deleteStudent(studentId);
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>單純轉呼叫：</b> 新增和刪除目前沒有額外邏輯，Service 直接把參數傳給 Dao 對應的方法。
</div>

<!--
StudentService 分兩頁看，這一頁是注入和最單純的兩個方法。

用建構子注入 StudentDao，和前面的寫法完全一樣。

createStudent 和 deleteStudent 就是單純轉呼叫：收到什麼參數，原封不動傳給 Dao。
現在看起來 Service 好像沒做事，但這一層是保留給商業邏輯的位置——
之後要加「新增前檢查資料」「刪除前確認資料存在」這類邏輯，就寫在這裡。

下一頁的 updateStudent 就是 Service 開始「做事」的例子。
-->

---

# StudentService（2/2）— 修改：組裝資料

`updateStudent()` 多做一件事：把 URL 的 id 設回 `student` 物件：

```java
    public void updateStudent(Integer studentId, Student student) {
        // 把 URL 收到的 studentId 設回 student 物件
        student.setId(studentId);

        // Dao 的 updateStudent() 從 student.getId() 取 WHERE 條件的值
        studentDao.updateStudent(student);
    }
```

| 資料 | 來源 | 用途 |
| --- | --- | --- |
| `studentId` | URL 路徑（`@PathVariable`） | WHERE 條件——要改「哪一筆」 |
| `student.name` | Request body（`@RequestBody`） | SET 的新值——要改「成什麼」 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>RESTful 慣例：</b> 「要改哪一筆」由 URL 決定，「要改成什麼」由 body 決定；Service 負責把兩者組裝成完整的 <code>Student</code> 物件再交給 Dao。
</div>

<!--
接續上一頁，updateStudent 是 Service 層開始有「邏輯」的例子。

它多做了一件事：把 URL 路徑收到的 studentId 設回 student 物件。
為什麼要這樣做？因為 Dao 的 updateStudent() 是從 student.getId() 取得 WHERE 條件的值，
但前端的 request body 通常只帶要修改的內容（name），不帶 id——id 在 URL 上。

這是 RESTful API 的慣例：「要改哪一筆」由 URL 決定，「要改成什麼」由 body 決定。
Service 的工作就是把這兩個來源的資料組裝成完整的 Student 物件，再交給 Dao。

這就是 Service 層的價值：不只是轉呼叫，還負責組裝資料、處理商業邏輯。
-->

---

# StudentController（1/2）— 注入 Service、新增 API

注入 `StudentService`，`POST /students` 接收前端的 JSON 資料：

```java
@RestController
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/students")
    public String create(@RequestBody Student student) {
        studentService.createStudent(student);
        return "新增成功";
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Controller 只注入 Service：</b> 不直接碰 Dao。前端的 JSON 由 <code>@RequestBody</code> 轉成 <code>Student</code> 物件，交給 Service 處理。
</div>

<!--
StudentController 也分兩頁看，這一頁是注入和新增的 API。

注意注入的是 StudentService，不是 StudentDao——Controller 只跟 Service 溝通，這是三層式架構的規矩。

@PostMapping 對應「新增」：RESTful 慣例中，POST 用來建立資料。
前端傳來的 JSON 放在 request body，用 @RequestBody 自動轉成 Student 物件，再交給 Service。

下一頁是修改和刪除的 API，兩個都需要從 URL 取得 id。
-->

---

# StudentController（2/2）— 修改與刪除 API

`PUT` 和 `DELETE` 都用 `@PathVariable` 從 URL 取得要操作的 id：

```java
    @PutMapping("/students/{studentId}")
    public String update(@PathVariable(name = "studentId") Integer studentId,
                         @RequestBody Student student) {
        studentService.updateStudent(studentId, student);
        return "修改成功";
    }

    @DeleteMapping("/students/{studentId}")
    public String delete(@PathVariable(name = "studentId") Integer studentId) {
        studentService.deleteStudent(studentId);
        return "刪除成功";
    }
```

| API | URL 的 id | Request Body |
| --- | --- | --- |
| `PUT`（修改） | 要改哪一筆（WHERE） | 要改成什麼（新的 `name`） |
| `DELETE`（刪除） | 要刪哪一筆（WHERE） | 不需要 |

<!--
接續上一頁，修改和刪除的 API。

PUT /students/{studentId} 對應「修改」：要改哪一筆由 URL 的 @PathVariable 決定，
改成什麼由 body 的 @RequestBody 決定——這正是上一節 Service 的 updateStudent 需要兩個參數的原因。

DELETE /students/{studentId} 對應「刪除」：只需要 URL 的 id，不需要 body。

這也呼應了前面 DELETE 範例的說明：Dao 的 deleteStudent(Integer studentId) 收到的，
正是這裡 @PathVariable 從 URL 取出的值，一路從 Controller 經過 Service 傳進來。
-->

---

# 用 Postman 測試三層式架構

啟動 Spring Boot，依序測試三個 API，並到 MySQL 確認資料變化：

| 操作 | HTTP 方法 + URL | Request Body（JSON） | 預期結果 |
| --- | --- | --- | --- |
| 新增 | `POST /students` | `{"id": 1, "name": "Judy"}` | 資料表多一筆 Judy |
| 修改 | `PUT /students/1` | `{"name": "John"}` | id=1 的 name 變成 John |
| 刪除 | `DELETE /students/1` | 不需要 | id=1 那筆資料消失 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>驗收方式：</b> 每打完一個 API，就到 MySQL Workbench 執行 <code>SELECT * FROM student</code>，確認資料真的被新增／修改／刪除了。
</div>

<!--
最後實際測試整條鏈路。

先用 POST /students 新增一筆 Judy，body 是 JSON 格式，記得 Headers 設 Content-Type: application/json。
再用 PUT /students/1 把名字改成 John——注意 id 放在 URL，body 只放要改的 name。
最後用 DELETE /students/1 刪掉這筆資料，DELETE 不需要 body。

每一步都到 MySQL Workbench 下 SELECT 確認，親眼看到資料的變化，才算真正理解了整條呼叫鏈：
Postman → Controller → Service → Dao → 資料庫。

這就是 Spring 三層式架構的完整寫法，之後所有的功能都會遵守這個結構。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5

## 批次新增：batchUpdate()

<!--
一次插入大量資料時，逐筆 update() 效能很差。batchUpdate() 讓多筆操作一次送出。
-->

---

# 為什麼需要 batchUpdate()？

假設要一次新增 1000 筆學生資料：

| 做法 | 資料庫往返次數 | SQL 編譯次數 | 效能 |
| --- | --- | --- | --- |
| 迴圈逐筆 `update()` | 1000 次 | 1000 次 | 慢 |
| `batchUpdate()` | **1 次** | **1 次** | 快 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>原理：</b> 把 1000 筆 INSERT 打包成一個請求一次送給資料庫，大幅減少網路往返成本。
</div>

<!--
效能差異的根源是「資料庫往返成本（Round Trip Cost）」。每次資料庫操作都有網路延遲，1000 次就是 1000 倍的成本。
batchUpdate() 把所有操作打包，SQL 也只需要編譯一次。
-->

---

# batchUpdate() 完整程式碼

```java
@Repository
public class StudentDao {

    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public StudentDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public int[] batchInsert(List<Student> list) {
        String sql = "INSERT INTO student(id, name) VALUES (:id, :name)";
        List<Map<String, Object>> batchParams = new ArrayList<>();
        for (Student s : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("name", s.getName());
            batchParams.add(map);
        }
        return namedParameterJdbcTemplate.batchUpdate(
            sql, batchParams.toArray(new Map[0]));
    }
}
```

<!--
batchUpdate() 的參數是 SQL + Map 陣列，每個 Map 對應一筆資料的參數值。
回傳 int[]，每個元素代表對應那筆操作影響的行數（成功是 1）。
和逐筆 update() 相比，SQL 語法完全相同，只是包裝方式不同。

一樣的問題：Dao 寫好了，誰來呼叫？下一頁把 Service 和 Controller 補上。
-->

---

# batchInsert() — 串接 Service 與 Controller

和 Part 4 相同的結構：Service 轉呼叫，Controller 用 `@RequestBody` 接收 JSON「陣列」：

```java
// StudentService — 新增方法
public void batchInsert(List<Student> list) {
    studentDao.batchInsert(list);
}
```

```java
// StudentController — 新增 API
@PostMapping("/students/batch")
public String batchCreate(@RequestBody List<Student> list) {
    studentService.batchInsert(list);
    return "批次新增成功";
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>參數是 <code>List&lt;Student&gt;</code>：</b> 前端傳的是 JSON「陣列」，<code>@RequestBody</code> 會自動轉成 <code>List</code>，一路傳到 Dao 的 <code>batchInsert()</code>。
</div>

<!--
batchInsert() 的三層串接和 Part 4 的結構完全一樣，只是參數從單一 Student 變成 List<Student>。

Service 一樣是轉呼叫：收到 List，原封不動傳給 Dao。

Controller 開一個新的 API：POST /students/batch。
注意 @RequestBody 的型別是 List<Student>——前端傳來的 JSON 是「陣列」格式，
Spring 會自動把陣列裡的每個 JSON 物件轉成一個 Student，組成 List。

呼叫鏈不變：Postman → Controller → Service → Dao → 資料庫，只是這次一趟就寫入多筆資料。
-->

---

# 用 Postman 測試 batchInsert()

啟動 Spring Boot，發送一個帶 JSON 陣列的 POST 請求：

| 項目 | 內容 |
| --- | --- |
| HTTP 方法 + URL | `POST http://localhost:8080/students/batch` |
| Headers | `Content-Type: application/json` |
| Request Body | `[{"id": 2, "name": "Tom"}, {"id": 3, "name": "Amy"}]` |
| 預期結果 | 回應「批次新增成功」，資料表多出 Tom、Amy 兩筆 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>驗收方式：</b> 到 MySQL Workbench 執行 <code>SELECT * FROM student</code>，確認 Tom 和 Amy 兩筆資料同時出現。
</div>

<!--
用 Postman 實測批次新增。

和 Part 4 測 POST /students 的差別只有一個：body 最外層是中括號 [ ]，代表 JSON 陣列，
裡面放多個學生物件，一次送出。

送出後回應「批次新增成功」，再到 MySQL Workbench 下 SELECT 確認：
Tom 和 Amy 兩筆資料同時出現，代表 batchUpdate() 一趟就把多筆資料寫進資料庫了。
-->

---

# 章節總結（1/2）— Spring JDBC 的用法

| 重點 | 說明 |
| --- | --- |
| 三大方法 | DDL 用 `execute()`；修改資料用 `update()`；查詢資料用 `query()`（下一章） |
| `execute()` | 執行 DDL（`CREATE TABLE` 等），注入 `JdbcTemplate`，無動態參數 |
| 核心工具 | `NamedParameterJdbcTemplate`，透過建構子注入 |
| 具名參數 | SQL 用 `:paramName`，比 `?` 更清楚；Map 的 key 需完全一致 |
| 四個步驟 | 注入 → 寫 SQL → 建立 Map → 呼叫 `update()` |

<!--
好，今天的重點總結，分兩頁。第一頁是 Spring JDBC 本身的用法。

第一，Spring JDBC 把 SQL 分成三大方法：DDL 用 execute()，修改資料用 update()，查詢用 query()。
第二，execute() 執行 CREATE TABLE 這類不帶動態參數的 DDL，注入的是 JdbcTemplate。
第三，修改資料的核心工具是 NamedParameterJdbcTemplate，用建構子注入。
第四，本課程使用 :paramName 具名參數而非 ? 佔位符，SQL 和 Map 的 key 名稱必須完全一致。
第五，四個固定步驟：注入、寫 SQL、建 Map、執行 update()。
-->

---

# 章節總結（2/2）— 注意事項與架構

| 重點 | 說明 |
| --- | --- |
| 回傳值 | `update()` 回傳 `int`，代表受影響的資料列數 |
| 安全注意 | UPDATE 和 DELETE 一定要加 WHERE 條件 |
| 三層式架構 | Controller（`@RestController`）→ Service（`@Service`）→ Dao（`@Repository`），Controller 不直接呼叫 Dao |
| `batchUpdate()` | 批次新增用 `Map[]` 傳參數，回傳 `int[]`；效能遠優於逐筆 `update()` |

<!--
總結第二頁，注意事項和架構。

第一，update() 回傳受影響的列數，可以用來判斷操作是否成功。
第二，UPDATE 和 DELETE 必須有 WHERE 條件，這是很重要的習慣。
第三，完整的呼叫鏈是 Controller → Service → Dao，Controller 不直接呼叫 Dao，這是 Spring 三層式架構的標準寫法。
第四，批次新增用 batchUpdate()，效能遠優於逐筆 update()。

下一章我們學查詢類——用 query() 執行 SELECT，從資料庫讀取資料。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
