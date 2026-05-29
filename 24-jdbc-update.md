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

- **Spring JDBC 用法前言** — JdbcTemplate 兩大方法：`update()` 與 `query()`
- **`update()` 基本用法** — 執行 INSERT、SQL 參數佔位符 `?`
- **`update()` 的 map 參數用法** — 具名參數、NamedParameterJdbcTemplate
- **`update()` 總結** — UPDATE / DELETE 範例、回傳值意義
- **章節總結** — 修改類 SQL 完整整理

<!--
今天的架構：先介紹 Spring JDBC 的工具，然後一步一步學 update() 方法，最後總結三種 SQL 的用法。
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

# Spring JDBC 的兩大操作類別

Spring JDBC 把 SQL 操作分成兩類，對應不同的方法：

| 類別 | 對應 SQL | 使用的方法 | 本章 |
| --- | --- | --- | --- |
| **修改類（update series）** | INSERT / UPDATE / DELETE | `update()` | ← 本章 |
| 查詢類（query series） | SELECT | `query()` / `queryForObject()` | 下一章 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶口訣：</b> 會「改變」資料庫內容的用 <code>update()</code>；只「讀取」不修改的用 <code>query()</code>。
</div>

<!--
Spring JDBC 把所有 SQL 操作分成兩大類，分別對應不同的方法。

INSERT、UPDATE、DELETE 這三種 SQL 都會「改變」資料庫的內容，所以統一用 update() 方法來執行。

SELECT 只是「讀取」資料，不修改任何內容，所以用 query() 系列的方法。

今天先學 update()，下一章學 query()。
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
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## update() 的基本用法

<!--
來看 update() 怎麼用。
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

# Step 1：注入 NamedParameterJdbcTemplate

在 Dao 類別中，用 `@Autowired` 注入工具：

```java
@Autowired
private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
```

| 項目 | 說明 |
| --- | --- |
| `@Autowired` | 讓 Spring 自動注入 `NamedParameterJdbcTemplate` 物件 |
| 宣告位置 | 通常放在 Dao 類別的欄位中 |
| 不需要 `new` | Spring 自動建立，我們只需要宣告即可 |


<!--
第一步，在 Dao 類別加上這個欄位宣告。

@Autowired 讓 Spring Boot 自動幫我們注入 NamedParameterJdbcTemplate 的實體。

我們不需要自己 new，Spring 在啟動時會自動根據 application.properties 的連線設定建立好這個物件。
這和我們之前學 @Autowired 注入 Bean 的概念完全一樣。

如果 IDE 出現 "cannot be resolved to a type"，通常是沒有 import，讓 IDE 自動 import 或手動加上即可。
-->

---

# Steps 2–4：完整的 INSERT 範例

呼叫 `update()` 新增一筆學生資料到資料庫：

```java
@Repository
public class StudentDao {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public void createStudent(Student student) {
        String sql = "INSERT INTO student(id, name) VALUES (:studentId, :studentName)";
        Map<String, Object> map = new HashMap<>();
        map.put("studentId", student.getId());
        map.put("studentName", student.getName());
        namedParameterJdbcTemplate.update(sql, map);
    }
}
```

<!--
看完整的 INSERT 例子。

類別加上 @Repository，告訴 Spring 這是資料存取層的 Bean。
方法名稱 createStudent，接收一個 Student 物件。

第一行：SQL 字串，用 :studentId 和 :studentName 作為具名佔位符。
第二行：建立 HashMap，準備存放參數值。
第三、四行：把 student 物件的 id 和 name 放進 map，key 對應 SQL 裡的 :paramName。
第五行：呼叫 update()，把 SQL 和 map 傳進去，Spring JDBC 執行 SQL。

⚠️ 注意：map.put() 的 key 字串必須和 SQL 的 :paramName 完全一致（大小寫也要一樣），否則執行時會找不到對應的值。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## update() 中的 map 參數用法

<!--
剛才看了程式碼，但 map 的角色是什麼？為什麼一定要用 Map？
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
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## update() 方法的用法總結

<!--
INSERT 學完了，來看 UPDATE 和 DELETE 的用法。
-->

---

# UPDATE SQL 範例

用 `update()` 修改資料庫中的學生資料：

```java
String sql = "UPDATE student SET name = :studentName WHERE id = :studentId";
Map<String, Object> map = new HashMap<>();
map.put("studentId", student.getId());
map.put("studentName", student.getName());
namedParameterJdbcTemplate.update(sql, map);
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
String sql = "DELETE FROM student WHERE id = :studentId";
Map<String, Object> map = new HashMap<>();
map.put("studentId", studentId);
namedParameterJdbcTemplate.update(sql, map);
```

<!--
DELETE 的參數更少，只需要知道要刪除哪一筆的 id。

SQL 是 DELETE FROM student WHERE id = :studentId，Map 只放一個 studentId。

⚠️ 和 UPDATE 一樣，DELETE 一定要加 WHERE 條件！沒有 WHERE 的 DELETE 會把整張資料表的資料全部刪光，這是非常危險的操作。

另外注意：這裡的 studentId 是 @PathVariable 從 URL 路徑接收到的值（Integer 類型），不是 Student 物件的 id。
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

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 兩大類別 | 修改類（INSERT/UPDATE/DELETE）用 `update()`；查詢類（SELECT）下一章學 |
| 核心工具 | `NamedParameterJdbcTemplate`，透過 `@Autowired` 注入 |
| 具名參數 | SQL 裡用 `:paramName`，Map 的 key 需完全一致 |
| 四個步驟 | 注入 → 寫 SQL → 建立 Map → 呼叫 `update()` |
| 安全注意 | UPDATE 和 DELETE 一定要加 WHERE 條件 |

<!--
好，今天的重點總結。

第一，Spring JDBC 把 SQL 分成修改類和查詢類，今天學的 update() 負責修改類。
第二，核心工具是 NamedParameterJdbcTemplate，用 @Autowired 注入。
第三，SQL 裡的 :paramName 和 Map 的 key 名稱必須完全一致。
第四，四個固定步驟：注入、寫 SQL、建 Map、執行 update()。
第五，UPDATE 和 DELETE 必須有 WHERE 條件，這是很重要的習慣。

下一章我們學查詢類——用 query() 執行 SELECT，從資料庫讀取資料。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
