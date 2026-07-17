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
- **動態 IN 查詢** — `NamedParameterJdbcTemplate` 原生支援 `Collection` 參數
- **串接三層式架構** — Service、Controller 完整程式碼與 Postman 測試
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
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    public StudentDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

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

@Repository 和建構子注入的用法和上一章的 createStudent() 完全一樣，不需要重新學習。

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
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    public StudentDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

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

# 動態 IN 查詢

`NamedParameterJdbcTemplate` 原生支援 `Collection` 參數，自動展開成 `IN (?,?,?)`：

```java
public List<Student> getStudentsByIds(List<Integer> ids) {
    String sql = "SELECT id, name FROM student WHERE id IN (:ids)";
    Map<String, Object> map = new HashMap<>();
    map.put("ids", ids);   // List 直接傳入，Spring JDBC 自動展開
    return namedParameterJdbcTemplate.query(sql, map, new StudentRowMapper());
}
```

| 傳入 | Spring JDBC 自動產生 |
| --- | --- |
| `ids = [1, 2, 3]` | `WHERE id IN (?, ?, ?)`，綁定 1, 2, 3 |
| `ids = [5]` | `WHERE id IN (?)`，綁定 5 |

<!--
NamedParameterJdbcTemplate 的具名參數支援 Collection 型別——直接把 List<Integer> 放進 Map，Spring JDBC 自動根據 List 的大小展開成對應數量的佔位符。
不需要手動拼接 SQL，也不需要 REGEXP workaround，是處理動態 IN 條件最直接的方式。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 串接三層式架構

<!--
Dao 的查詢方法都寫好了，和上一章一樣的問題：誰來呼叫它們？
這一節補上 Service 和 Controller，讓前端能透過 GET API 查詢資料。
-->

---

# StudentService — 查詢方法

和上一章相同的結構：建構子注入 `StudentDao`，轉呼叫查詢方法：

```java
@Service
public class StudentService {

    private final StudentDao studentDao;

    public StudentService(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public List<Student> getStudentList() {
        return studentDao.getStudentList();
    }

    public List<Student> getStudentById(Integer studentId) {
        return studentDao.getStudentById(studentId);
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>差別在回傳值：</b> 上一章的方法都是 <code>void</code>；查詢方法要把 Dao 回傳的 <code>List&lt;Student&gt;</code> 一路 <code>return</code> 回去。
</div>

<!--
Service 層的寫法和上一章完全一樣：@Service、建構子注入 StudentDao、轉呼叫。

唯一的差別是回傳值：上一章的 createStudent、deleteStudent 都是 void，
查詢方法則要用 return 把 Dao 查到的 List<Student> 傳回給 Controller。

資料的流向和上一章相反：上一章是前端的資料「流進」資料庫，
這一章是資料庫的資料「流出」到前端，所以每一層都要 return。
-->

---

# StudentController — 查詢 API

`GET` 對應「查詢」，回傳 `List<Student>`，@RestController 自動轉成 JSON：

```java
@RestController
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/students")
    public List<Student> getStudentList() {
        return studentService.getStudentList();
    }

    @GetMapping("/students/{studentId}")
    public List<Student> getStudentById(@PathVariable(name = "studentId") Integer studentId) {
        return studentService.getStudentById(studentId);
    }
}
```

<!--
Controller 一樣只注入 StudentService，不直接碰 Dao。

RESTful 慣例中，GET 對應「查詢」：
GET /students 查全部學生；GET /students/{studentId} 用 @PathVariable 從 URL 取得 id，查特定一筆。

注意這兩個 API 的回傳型別是 List<Student>，不是 String——
@RestController 會自動把 List 轉成 JSON 陣列回應給前端，這就是前面「執行結果」那一頁看到的效果。

還剩一個動態 IN 查詢的方法沒串接，下一頁補上。
-->

---

# 動態 IN 查詢 — 串接 Service 與 Controller

`getStudentsByIds()` 也補上 Service 與 Controller，用 `@RequestParam` 接收多個 id：

```java
// StudentService — 新增方法
public List<Student> getStudentsByIds(List<Integer> ids) {
    return studentDao.getStudentsByIds(ids);
}
```

```java
// StudentController — 新增 API
@GetMapping("/students/search")
public List<Student> getStudentsByIds(@RequestParam(name = "ids") List<Integer> ids) {
    return studentService.getStudentsByIds(ids);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b><code>@RequestParam List&lt;Integer&gt;</code>：</b> URL 上的 <code>?ids=1,3</code>（逗號分隔）會被 Spring 自動轉成 <code>List&lt;Integer&gt;</code>，一路傳到 Dao 展開成 <code>IN (?, ?)</code>。
</div>

<!--
最後把動態 IN 查詢也串起來。

Service 一樣是轉呼叫，把 List<Integer> 原封不動傳給 Dao。

Controller 開 GET /students/search，用 @RequestParam 接收 ids——
多個 id 放在 query string，用逗號分隔（?ids=1,3），Spring 會自動轉成 List<Integer>。

注意 URL 用 /students/search 而不是 /students/{studentId}，
因為這是「用條件搜尋」而不是「用 id 定位單筆」，兩個 API 的語意不同。

整條鏈路：?ids=1,3 → @RequestParam 轉 List → Service → Dao 的 Map → Spring JDBC 展開成 IN (?, ?)。

有同學可能會問：多個 id 能不能放在 URL 路徑裡，用 @PathVariable 接？下一頁比較這兩種寫法。
-->

---

# 補充：多個 id 用 @PathVariable 可以嗎？

技術上可行——`@PathVariable` 也能把逗號分隔的路徑轉成 `List<Integer>`：

```java
// 技術上可行，但不建議：GET /students/ids/1,2,3
@GetMapping("/students/ids/{ids}")
public List<Student> getStudentsByIds(@PathVariable(name = "ids") List<Integer> ids) {
    return studentService.getStudentsByIds(ids);
}
```

| 比較 | `@RequestParam`（建議） | `@PathVariable` |
| --- | --- | --- |
| REST 語意 | query string = 篩選條件 ✅ | path = 單一資源的身分 |
| 可變數量參數 | 自然（`?ids=1,2,3`，可省略） | 空集合時 URL 變 `/students/ids/`，404 |
| 路由衝突 | 完全避開 | `/students/1,2,3` 易與 `/students/{studentId}` 混淆 |
| 慣例 | 搜尋／過濾的標準寫法 ✅ | 罕見 |

<!--
補充一個常見的問題：多個 id 一定要用 @RequestParam 嗎？可以放在 URL 路徑用 @PathVariable 接嗎？

技術上完全可行——Spring 的型別轉換對兩者一視同仁，逗號分隔的字串都會自動轉成 List<Integer>，Dao 完全不用改。

但慣例上用 @RequestParam，理由有三個：

第一，REST 語意：path 代表「資源的身分」，例如 /students/1 就是 id 為 1 的那個學生；
一次查多筆是「搜尋、過濾」，語意上屬於 query string。

第二，可變數量：id 可能是 0 個、1 個、10 個，query param 天生適合可變集合，甚至可以整個省略；
path variable 一旦是空集合，URL 會變成 /students/ids/，直接 404。

第三，路由衝突：/students/1,2,3 和單筆查詢的 /students/{studentId} pattern 很接近，
Spring 得靠型別轉換失敗與否來分流，容易出錯；query param 完全避開這個問題。

結論：不是「只能」用 @RequestParam，是「應該」用——搜尋條件放 query string 是業界的標準慣例。
-->

---

# 用 Postman 測試查詢 API

啟動 Spring Boot，先用上一章的 POST 新增幾筆資料，再測試兩個 GET API：

| 操作 | HTTP 方法 + URL | Request Body | 預期結果 |
| --- | --- | --- | --- |
| 查全部 | `GET /students` | 不需要 | `[{"id":1,"name":"Judy"},{"id":2,"name":"Tom"}]` |
| 查單筆 | `GET /students/1` | 不需要 | `[{"id":1,"name":"Judy"}]` |
| IN 查詢 | `GET /students/search?ids=1,2` | 不需要 | `[{"id":1,"name":"Judy"},{"id":2,"name":"Tom"}]` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>查單筆也是陣列：</b> <code>query()</code> 回傳 <code>List</code>，所以就算只查到一筆，JSON 最外層仍是 <code>[ ]</code> 陣列；之後學到 JPA 會改用單一物件回傳。
</div>

<!--
最後用 Postman 實測。GET 請求不需要 body，直接送出即可。

GET /students 回傳所有學生的 JSON 陣列；GET /students/1 回傳 id=1 那筆；
GET /students/search?ids=1,2 用逗號分隔多個 id，回傳符合的所有學生。

注意查單筆的結果最外層還是 [ ] 陣列——因為 Dao 的 getStudentById() 回傳的是 List<Student>，
就算只查到一筆，也是「只有一個元素的 List」。之後學 JPA 時會改用單一物件的寫法。

完整呼叫鏈：Postman → Controller → Service → Dao → 資料庫，查詢方向的資料流也走通了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

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

# 章節總結（1/2）— query() 的用法

| 重點 | 說明 |
| --- | --- |
| `query()` 用途 | 執行 SELECT SQL，讀取資料庫資料 |
| 三個參數 | sql（查詢語法）、map（具名參數值）、rowMapper（行對應規則） |
| RowMapper | `implements RowMapper<T>`，覆寫 `mapRow()` 方法 |
| `mapRow()` | 用 `rs.getInt()`/`rs.getString()` 讀取欄位，回傳 Java 物件 |
| 回傳值 | `List<T>`，每行資料對應一個 Java 物件 |

<!--
好，今天的重點總結，分兩頁。第一頁是 query() 本身的用法。

第一，query() 用來執行 SELECT，讀取資料庫資料。
第二，三個參數：sql、map、rowMapper，前兩個和上一章的 update() 完全一樣。
第三，RowMapper 是把 ResultSet 的每一行轉成 Java 物件的工具。
第四，mapRow() 用 rs.getInt / rs.getString 讀取欄位值，括號裡是「資料庫欄位名稱」。
第五，query() 回傳 List，每行資料對應一個 Java 物件。
-->

---

# 章節總結（2/2）— 進階查詢與架構

| 重點 | 說明 |
| --- | --- |
| CRUD 完整 | INSERT/UPDATE/DELETE → `update()`；SELECT → `query()` ✅ |
| 動態 IN 查詢 | `Map.put("ids", list)`，Spring JDBC 自動展開為 `IN (?,?,?)` |
| 多個 id 的接法 | 搜尋條件用 `@RequestParam`（query string），不用 `@PathVariable` |
| 三層串接 | `GET /students`、`GET /students/{id}`、`GET /students/search?ids=1,2`，Controller → Service → Dao，回傳 `List<Student>` 自動轉 JSON |

<!--
總結第二頁，進階查詢和架構。

第一，CRUD 四種操作全部學齊：INSERT、UPDATE、DELETE 用 update()，SELECT 用 query()。
第二，動態 IN 查詢：把 List 直接放進 Map，Spring JDBC 自動展開成對應數量的佔位符。
第三，多個 id 這種搜尋條件放 query string 用 @RequestParam 接，不放 URL 路徑。
第四，三層串接：Controller 開三個 GET API，經 Service 呼叫 Dao，查詢結果一路 return 回前端，@RestController 自動轉成 JSON。

學完這一章，CRUD 四種操作全部學完了，而且每一種都串好了完整的三層式架構！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
