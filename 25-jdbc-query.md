---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring JDBC 的用法（下）—執行 SELECT SQL
routeAlias: ch25
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
    Spring JDBC 的用法（下）<br>執行 SELECT SQL
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用 query() 方法，從資料庫讀取資料並轉成 Java 物件」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，上一章我們學了 update() 方法，可以執行 INSERT、UPDATE、DELETE 來修改資料庫的資料。

今天是下篇——學習 query() 方法，用 SELECT SQL 從資料庫讀取資料。

和 update() 相比，query() 多了一個特別的步驟：需要用 RowMapper 告訴 Spring JDBC 怎麼把資料庫的一行資料轉成 Java 物件。
-->

---
layout: default
---

# Outline

- **`query()` 方法介紹** — 與 `update()` 的差別、RowMapper 的角色
- **使用 `query()` 查詢資料** — Step 1 RowMapper、Step 2 查全部、Step 3 帶 WHERE 條件
- **章節總結** — CRUD 四個操作全部學齊

<!--
今天的重點是 query() 和 RowMapper。學完之後，CRUD 的四個操作就全部學齊了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## query() 方法的用法介紹

<!--
先看 query() 的整體架構和它與 update() 的差別。
-->

---

# query() vs update()

| 比較項目 | `update()` | `query()` |
| --- | --- | --- |
| 對應 SQL | INSERT / UPDATE / DELETE | SELECT |
| 功能 | 修改資料庫內容 | 讀取資料庫內容 |
| 回傳值 | 受影響的行數（`int`） | 查詢結果（`List<物件>`） |
| 參數數量 | 2 個（sql, map） | 3 個（sql, map, **rowMapper**） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>新增的第三個參數：</b> <code>RowMapper</code> — 負責把資料庫的每一行資料轉成 Java 物件。
</div>

<!--
query() 和 update() 的用法非常相似，最大的差別有兩個。

第一，回傳值不同：update() 回傳影響幾行（int），query() 回傳一個 Java 物件的 List。

第二，query() 多了第三個參數 RowMapper，這是今天的核心概念——它告訴 Spring JDBC 怎麼把資料庫的查詢結果轉成 Java 物件。
-->

---

# query() 的三個參數

| 參數 | 類型 | 說明 |
| --- | --- | --- |
| `sql` | `String` | SELECT SQL 語法，可用 `:paramName` 作為具名參數 |
| `map` | `Map<String, Object>` | 具名參數的值（若無條件可傳空 Map） |
| `rowMapper` | `RowMapper<T>` | 定義如何把資料庫的一行資料轉成 Java 物件 |

<!--
query() 的三個參數：sql 和 map 和上一章 update() 完全一樣，不需要重新學習。

唯一新增的是第三個參數 rowMapper。

資料庫查詢回來的是一個 ResultSet（類似一張試算表），rowMapper 的工作就是把這張試算表的每一行，轉成一個對應的 Java 物件。
-->

---

# 什麼是 RowMapper？

| 項目 | 說明 |
| --- | --- |
| 定義 | 把資料庫的查詢結果（ResultSet）轉成 Java 物件的工具 |
| 實作方式 | 建立一個類別 `implements RowMapper<T>`，覆寫 `mapRow()` 方法 |
| `mapRow()` | 每讀取一行資料庫資料，就呼叫一次，回傳對應的 Java 物件 |
| 泛型 `<T>` | 指定要轉換成哪種 Java 類別，例如 `RowMapper<Student>` |

<!--
RowMapper 的概念很直觀。

資料庫的查詢結果是一個 ResultSet，你可以把它想像成一張 Excel 試算表：每一行是一筆資料，每一欄是一個欄位。

RowMapper 的 mapRow() 方法會對每一行資料被呼叫一次，讀取這行的欄位值，建立並回傳一個 Java 物件。

例如 RowMapper<Student> 就是把 ResultSet 的每一行轉成一個 Student 物件。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 使用 query() 方法查詢數據

<!--
了解了 query() 和 RowMapper 的概念，來實際寫程式碼。
-->

---

# Step 1：建立 StudentRowMapper

建立一個新類別 `StudentRowMapper.java`，實作 `RowMapper<Student>`：

```java
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class StudentRowMapper implements RowMapper<Student> {

    @Override
    public Student mapRow(ResultSet rs, int rowNum) throws SQLException {
        Student student = new Student();
        student.setId(rs.getInt("id"));
        student.setName(rs.getString("name"));
        return student;
    }
}
```

<!--
第一步，建立 StudentRowMapper 類別。

implements RowMapper<Student> 表示這個 RowMapper 要把資料轉成 Student 物件。

mapRow() 方法接收兩個參數：rs 是 ResultSet（資料庫的查詢結果），rowNum 是目前處理的是第幾行（通常不需要用到）。

裡面的邏輯：建立一個 Student 物件，用 rs.getInt("id") 讀取 id 欄位的整數值，用 rs.getString("name") 讀取 name 欄位的字串值，然後 return 這個 Student 物件。

⚠️ rs.getInt("id") 裡的 "id" 必須和資料庫表格的欄位名稱完全一致（大小寫視資料庫設定而定）。
-->

---

# StudentRowMapper 程式碼解說

| 程式碼 | 說明 |
| --- | --- |
| `implements RowMapper<Student>` | 告訴 Spring JDBC 這個 Mapper 回傳 Student 物件 |
| `mapRow(ResultSet rs, int rowNum)` | 每一行資料庫資料呼叫一次 |
| `rs.getInt("id")` | 讀取欄位名稱為 `id` 的整數值 |
| `rs.getString("name")` | 讀取欄位名稱為 `name` 的字串值 |
| `return student` | 回傳組裝好的 Student 物件 |

<!--
這頁補充說明 StudentRowMapper 的每一行程式碼。

其中最重要的是 getInt 和 getString 的使用：括號裡的字串是資料庫表格的欄位名稱，不是 Java 物件的屬性名稱。

如果資料庫欄位名是 student_name，但 Java 屬性叫 name，那這裡要寫 rs.getString("student_name")，不是 rs.getString("name")。

這是初學者常見的混淆點，記住：括號裡是「資料庫欄位名稱」。
-->

---

# Step 2：執行 query() 查詢所有學生

在 `StudentDao` 中新增 `getStudentList()` 方法：

```java
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class StudentDao {
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public List<Student> getStudentList() {
        String sql = "SELECT id, name FROM student";
        Map<String, Object> map = new HashMap<>();
        StudentRowMapper rowMapper = new StudentRowMapper();
        return namedParameterJdbcTemplate.query(sql, map, rowMapper);
    }
}
```

<!--
第二步，在 StudentDao 裡加上 getStudentList() 方法，呼叫 query() 執行 SELECT。

@Repository 和 @Autowired 的用法和上一章的 createStudent() 完全一樣，不需要重新學習。

唯一的差別是回傳值：update() 回傳 int，這裡 query() 回傳 List<Student>。
-->

---

# Step 2：程式碼說明

| 程式碼 | 說明 |
| --- | --- |
| `@Repository` | 宣告這是資料存取層的元件 |
| `NamedParameterJdbcTemplate` | 執行具名參數 SQL 的工具 |
| `String sql` | SELECT SQL，查詢所有學生 |
| `new HashMap<>()` | 沒有 WHERE 條件，傳入空 Map |
| `namedParameterJdbcTemplate.query(...)` | 執行 SELECT，回傳 `List<Student>` |

<!--
這頁逐行說明 Step 2 的程式碼。

map 是空的 HashMap，因為這個 SQL 沒有 WHERE 條件，不需要帶任何參數。

query() 回傳 List<Student>，Spring JDBC 內部對每一行資料呼叫一次 mapRow()，把所有結果組裝成一個 List 回傳。

這個 List 就可以直接 return 給 Controller，@RestController 會自動把它轉成 JSON 陣列回應給前端。
-->

---

# 執行結果

Controller 回傳 `List<Student>`，@RestController 自動轉成 JSON 陣列：

| 資料庫的資料 | 前端收到的 JSON |
| --- | --- |
| id=1, name=Judy | `[{"id":1,"name":"Judy"},` |
| id=2, name=Tom | `{"id":2,"name":"Tom"}]` |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>完整流程：</b> 前端發 GET 請求 → Controller 呼叫 query() → RowMapper 轉換每行資料 → 回傳 JSON 陣列。
</div>

<!--
執行結果：資料庫有幾筆學生資料，前端就收到幾個 JSON 物件的陣列。

每個 Student 物件的欄位，對應 JSON 的一個 key-value。
RowMapper 的 mapRow() 被呼叫了幾次，List 裡就有幾個 Student 物件。

這就是一個完整的 Read 操作：從資料庫讀取資料，轉成 Java 物件，再轉成 JSON 回應前端。
-->

---

# Step 3：帶 WHERE 條件的查詢

在 `StudentDao` 中新增 `getStudentById()` 方法，查詢特定學生：

```java
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class StudentDao {
    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public List<Student> getStudentById(Integer studentId) {
        String sql = "SELECT id, name FROM student WHERE id = :studentId";
        Map<String, Object> map = new HashMap<>();
        map.put("studentId", studentId);
        StudentRowMapper rowMapper = new StudentRowMapper();
        return namedParameterJdbcTemplate.query(sql, map, rowMapper);
    }
}
```

<!--
Step 3 是帶 WHERE 條件的查詢，用來查詢特定 id 的學生。

和 Step 2 相比只有兩個差別：SQL 加上 WHERE id = :studentId，以及 map 多了一行 put("studentId", studentId)。

其他完全一樣——同一個 RowMapper，同樣呼叫 query()。

這個 studentId 通常來自 Controller 的 @PathVariable，也就是 URL 路徑 /students/123 的 123。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 總結

<!--
最後，做整體比較與總結。
-->

---

# update() vs query() 完整比較

| 比較項目 | `update()` | `query()` |
| --- | --- | --- |
| 對應 SQL | INSERT / UPDATE / DELETE | SELECT |
| 參數 | sql, map | sql, map, rowMapper |
| 回傳值 | `int`（影響行數） | `List<T>`（查詢結果） |
| 需要 RowMapper | 否 | 是 |
| 典型用法 | 新增/修改/刪除資料 | 查詢資料清單 |

<!--
用這張表格把 update() 和 query() 放在一起比較。

兩者的主要差異就是：query() 多了 RowMapper 參數，回傳 List 而不是 int。

掌握這兩個方法，CRUD 的四種操作就全部搞定了：
INSERT/UPDATE/DELETE 用 update()，SELECT 用 query()。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| `query()` 用途 | 執行 SELECT SQL，讀取資料庫資料 |
| 三個參數 | sql（查詢語法）、map（具名參數值）、rowMapper（行對應規則） |
| RowMapper | `implements RowMapper<T>`，覆寫 `mapRow()` 方法 |
| `mapRow()` | 用 `rs.getInt()`/`rs.getString()` 讀取欄位，回傳 Java 物件 |
| 回傳值 | `List<T>`，每行資料對應一個 Java 物件 |
| CRUD 完整 | INSERT/UPDATE/DELETE → `update()`；SELECT → `query()` ✅ |

<!--
好，今天的重點總結。

第一，query() 用來執行 SELECT，讀取資料庫資料。
第二，三個參數：sql、map、rowMapper。
第三，RowMapper 是把 ResultSet 的每一行轉成 Java 物件的工具。
第四，mapRow() 用 rs.getInt / rs.getString 讀取欄位值。
第五，query() 回傳 List，@RestController 自動轉成 JSON 陣列。

學完這一章，CRUD 四種操作全部學完了！接下來要把所有學到的東西整合起來，實作一個完整的三層架構後端系統。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
