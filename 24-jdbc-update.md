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
- **Part 1：execute() — DDL 操作** — 建立資料表、`CREATE TABLE`
- **Part 2：update() 基本概念** — `NamedParameterJdbcTemplate`、具名參數 vs `?`、四個步驟
- **Part 3：update() 完整範例** — INSERT / UPDATE / DELETE 範例、回傳值意義
- **Part 4：批次新增** — `batchUpdate()` 原理與實作
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

```java
@Autowired
private JdbcTemplate jdbcTemplate;

public void createTable() {
    String sql = "CREATE TABLE IF NOT EXISTS student " +
                 "(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50))";
    jdbcTemplate.execute(sql);
}
```

<!--
execute() 是三個方法中最簡單的一個，用來執行「不帶動態參數」的 SQL。

最典型的用途是建立資料表，CREATE TABLE 語法通常是固定的，不需要傳入任何動態值。

這裡注入的是 JdbcTemplate，不是 NamedParameterJdbcTemplate，因為不需要處理具名參數。

⚠️ 實務上，建表通常用 schema.sql 或 Flyway/Liquibase 管理，而不是寫在應用程式碼裡；但初學階段先理解 execute() 的作用。
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

# 核心工具：NamedParameterJdbcTemplate

| 項目 | 說明 |
| --- | --- |
| 類別名稱 | `NamedParameterJdbcTemplate` |
| 用途 | 執行帶有「具名參數（Named Parameters）」的 SQL 語法 |
| 具名參數格式 | SQL 裡用 `:paramName` 當作佔位符 |
| 取得方式 | 透過 `@Autowired` 注入（Spring 自動提供） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼用具名參數？</b> 比傳統的 <code>?</code> 佔位符更清楚，SQL 和參數的對應關係一目了然。
</div>

<!--
Spring JDBC 主要透過 NamedParameterJdbcTemplate 這個物件來執行 SQL。

名字很長，但核心概念很簡單：它支援「具名參數」——在 SQL 裡用 :paramName 當佔位符，然後傳入一個 Map 告訴它每個 :paramName 對應什麼值。

這比傳統的 ? 佔位符清楚多了，因為你可以從名字就知道這個參數代表什麼。

使用前需要用 @Autowired 注入，Spring Boot 會自動幫我們建立這個物件。
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
| 1 | `@Autowired` 注入 `NamedParameterJdbcTemplate` |
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

# 完整的 INSERT 範例

呼叫 `update()` 新增一筆學生資料到資料庫：

```java
@Repository
public class StudentDao {

    // Step 1: 注入 NamedParameterJdbcTemplate
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public void createStudent(Student student) {
        // Step 2: 定義 SQL，用 :paramName 作為佔位符
        String sql = "INSERT INTO student(id, name) VALUES (:studentId, :studentName)";
        // Step 3: 建立 Map，填入參數值
        Map<String, Object> map = new HashMap<>();
        map.put("studentId", student.getId());
        map.put("studentName", student.getName());
        // Step 4: 呼叫 update() 執行 SQL
        namedParameterJdbcTemplate.update(sql, map);
    }
}
```

<!--
把四個步驟全部合在一起看。

類別加上 @Repository，告訴 Spring 這是資料存取層的 Bean。
方法名稱 createStudent，接收一個 Student 物件。

第一行：SQL 字串，用 :studentId 和 :studentName 作為具名佔位符。
第二行：建立 HashMap，準備存放參數值。
第三、四行：把 student 物件的 id 和 name 放進 map，key 對應 SQL 裡的 :paramName。
第五行：呼叫 update()，把 SQL 和 map 傳進去，Spring JDBC 執行 SQL。

⚠️ 注意：map.put() 的 key 字串必須和 SQL 的 :paramName 完全一致（大小寫也要一樣），否則執行時會找不到對應的值。
-->

---

# UPDATE SQL 範例

用 `update()` 修改資料庫中的學生資料：

```java
@Repository
public class StudentDao {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public void updateStudent(Student student) {
        // Step 2: 定義 SQL
        String sql = "UPDATE student SET name = :studentName WHERE id = :studentId";
        // Step 3: 建立 Map
        Map<String, Object> map = new HashMap<>();
        map.put("studentId", student.getId());
        map.put("studentName", student.getName());
        // Step 4: 呼叫 update() 執行 SQL
        namedParameterJdbcTemplate.update(sql, map);
    }
}
```

<!--
UPDATE 的用法和 INSERT 幾乎一樣，只有 SQL 語法不同。

SQL 改成 UPDATE student SET name = :studentName WHERE id = :studentId。
WHERE 子句限定了要更新哪一筆資料，避免把所有資料都改掉。

⚠️ 寫 UPDATE 時一定要加 WHERE 條件！如果不加，會把資料表裡所有的學生名稱都改掉，這通常是致命的錯誤。
-->

---

# DELETE SQL 範例

用 `update()` 刪除資料庫中的學生資料：

```java
@Repository
public class StudentDao {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

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

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

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
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 三大方法 | DDL 用 `execute()`；修改資料用 `update()`；查詢資料用 `query()`（下一章） |
| `execute()` | 執行 DDL（`CREATE TABLE` 等），注入 `JdbcTemplate`，無動態參數 |
| 核心工具 | `NamedParameterJdbcTemplate`，透過 `@Autowired` 注入 |
| 具名參數 | SQL 用 `:paramName`，比 `?` 更清楚；Map 的 key 需完全一致 |
| 四個步驟 | 注入 → 寫 SQL → 建立 Map → 呼叫 `update()` |
| 回傳值 | `update()` 回傳 `int`，代表受影響的資料列數 |
| 安全注意 | UPDATE 和 DELETE 一定要加 WHERE 條件 |
| `batchUpdate()` | 批次新增用 `Map[]` 傳參數，回傳 `int[]`；效能遠優於逐筆 `update()` |

<!--
好，今天的重點總結。

第一，Spring JDBC 把 SQL 分成修改類和查詢類，今天學的 update() 負責修改類。
第二，核心工具是 NamedParameterJdbcTemplate，用 @Autowired 注入。
第三，本課程使用 :paramName 具名參數而非 ? 佔位符，SQL 和 Map 的 key 名稱必須完全一致。
第四，四個固定步驟：注入、寫 SQL、建 Map、執行 update()。
第五，update() 回傳受影響的列數，可以用來判斷操作是否成功。
第六，UPDATE 和 DELETE 必須有 WHERE 條件，這是很重要的習慣。

下一章我們學查詢類——用 query() 執行 SELECT，從資料庫讀取資料。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
