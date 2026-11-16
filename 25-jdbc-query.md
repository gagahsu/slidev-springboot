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
大家好，歡迎來到第二十五章。

上一章我們學了 update()，承辦人員已經會建檔、更正、註銷。

今天學最後一種工作：調閱。也就是用 query() 把資料從資料庫查出來。學完這一章，CRUD 四件事就全部到齊了。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **調閱和改資料差在哪？** 調閱會有東西要帶回來
- **帶回來的表格怎麼變成物件？** 靠一份抄寫規則：`RowMapper`
- **三種查法**：查全部、查一筆、一次查好幾筆

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，調閱和改資料差在哪。差別是：調閱會有東西要帶回來。

（下一步）第二，帶回來的是一張表格，怎麼變成 Java 的物件？靠一份抄寫規則，叫做 RowMapper。

（下一步）第三，三種查法：查全部、查一筆、一次查好幾筆。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 調閱：有東西要帶回來

<!--
先看調閱和上一章有什麼不一樣。
-->

---

# 檔案室交回來的是一張表格

<RowCards />

<!--
承辦人員送出調閱的申請單，檔案室交回來的是一張表格，一列一列的。這裡有三列：1 號 Judy、2 號 Tom、3 號 Amy。

但是櫃台要的不是表格，是一張一張的學生資料卡。所以要有人照著一份抄寫規則來抄：id 那一欄，抄到卡片的 id；name 那一欄，抄到卡片的 name。

（下一步）照著規則，把第 1 列抄成一張學生資料卡。

（下一步）第 2 列，再抄一張。

（下一步）第 3 列，再抄一張。有幾列就抄幾次，每次用的都是同一份規則。

（下一步）最後把資料卡疊成一疊，交回去。
-->

---

# 同一張圖，換成程式的名字

<RowCards terms />

<!--
同一張圖，換上程式的名字。

檔案室交回來的表格，在 Java 裡叫做 ResultSet，意思是「結果的集合」。

抄寫規則，叫做 RowMapper。Row 是「列」，Mapper 是「對應的人」，合起來就是「把一列資料對應成物件」。

（依序按下一步）每抄一列，就產生一個 Student 物件。有幾列，規則就被用幾次。

（最後一步）最後那一疊資料卡，是 List<Student>，也就是一串 Student 物件。
-->

---

# query() 和 update() 的差別

<Pairs left="update()" right="query()" sign="vs" rows="doc,INSERT、UPDATE、DELETE=card,SELECT|doc,改動資料=card,只讀取資料|code,給它兩樣：sql、map=code,給它三樣：sql、map、rowMapper|code,回傳 int：動到幾筆=code,回傳 List：查到的每一筆資料" />

<!--
把 query() 和上一章的 update() 放在一起比較。

（下一步）update() 執行 INSERT、UPDATE、DELETE。query() 執行 SELECT。

（下一步）update() 會改動資料。query() 只讀取資料。

（下一步）呼叫 update() 要給它兩樣東西：SQL 和 Map。呼叫 query() 要給三樣，多了一個 rowMapper，就是剛才的抄寫規則。

（下一步）update() 回傳一個整數，代表動到幾筆。query() 回傳一個 List，裡面是查到的每一筆資料。
-->

---

# 想一想

<Poll question="資料庫查回來 5 筆學生資料，RowMapper 的抄寫規則會被用幾次？" options="1 次，一次抄完整張表|5 次，每一列抄一次|10 次，每個欄位抄一次|0 次，Spring 會自動處理" answer="2" />

<!--
來想一題。

資料庫查回來 5 筆學生資料，RowMapper 的抄寫規則會被用幾次？

（等大家作答）

（下一步）答案是 5 次，每一列抄一次。

我們只需要寫好「一列怎麼抄」，Spring JDBC 會幫我們對每一列都做一次。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 動手寫：三個步驟

<!--
觀念清楚了，來寫程式。
-->

---

# Step 1：寫下抄寫規則

<CodeSteps>

```java {1|2-3|4-6|7|all}
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

- 建立新類別，`implements RowMapper<Student>`：這份規則會抄出 `Student`
- `mapRow()`：每讀到一列，Spring JDBC 就呼叫它一次；`rs` 是目前這一列
- 拿一張空白卡片，把 `id` 欄和 `name` 欄的值抄上去
- 把抄好的卡片交回去
- 整數用 `rs.getInt("欄位名")`，文字用 `rs.getString("欄位名")`

</CodeSteps>

<!--
Step 1，寫下抄寫規則。建立一個新的類別，叫 StudentRowMapper。

（下一步）它實作 RowMapper 這個介面，角括號裡寫 Student，表示這份規則抄出來的是 Student。

（下一步）介面要求我們寫一個 mapRow 方法。每讀到一列資料，Spring JDBC 就會呼叫它一次。參數 rs 就是目前這一列。後面的 throws SQLException 是固定寫法，Eclipse 會自動幫你產生。

（下一步）方法裡面：先 new 一個 Student，等於拿一張空白卡片。再把這一列的 id 欄和 name 欄的值抄上去。

（下一步）最後把抄好的卡片 return 回去。

（下一步）讀欄位的時候，整數用 getInt，文字用 getString，括號裡寫資料表的欄位名稱。
-->

---

# Step 2：查全部的學生

<CodeSteps>

```java {2|3|4|5|all}
public List<Student> getStudentList() {
    String sql = "SELECT id, name FROM student";
    Map<String, Object> map = new HashMap<>();
    StudentRowMapper rowMapper = new StudentRowMapper();
    return namedParameterJdbcTemplate.query(sql, map, rowMapper);
}
```

- 申請單：查出 `student` 表所有的 `id` 和 `name`
- 這句 SQL 沒有空格，所以給一個空的 `Map`
- 準備好抄寫規則
- 三樣東西交給 `query()`，回傳一串 `Student`
- 這個方法寫在上一章的 `StudentDao` 裡

</CodeSteps>

<!--
Step 2，在上一章的 StudentDao 裡加一個方法，查全部的學生。

（下一步）SQL 是 SELECT id, name FROM student，查出 student 表所有的 id 和 name。

（下一步）這句 SQL 沒有任何空格要填。但是 query() 還是需要一個 Map，所以給它一個空的。

（下一步）new 一個 StudentRowMapper，準備好抄寫規則。

（下一步）把 SQL、Map、rowMapper 三樣東西交給 query()。它會回傳一串 Student，我們直接 return 出去。

（下一步）提醒一下，這個方法是加在上一章的 StudentDao 裡，注入的工具不用再寫一次。
-->

---

# Step 3：查某一位學生

<CodeSteps>

```java {2|3-4|5-6|all}
public List<Student> getStudentById(Integer studentId) {
    String sql = "SELECT id, name FROM student WHERE id = :studentId";
    Map<String, Object> map = new HashMap<>();
    map.put("studentId", studentId);
    StudentRowMapper rowMapper = new StudentRowMapper();
    return namedParameterJdbcTemplate.query(sql, map, rowMapper);
}
```

- 多了 `WHERE`，並且留一個空格 `:studentId`
- 和上一章一樣，把要填的值放進 `Map`
- 抄寫規則不用重寫，同一份可以一直用
- 就算只查到一筆，`query()` 回傳的還是 `List`

</CodeSteps>

<!--
Step 3，查某一位學生。

（下一步）SQL 多了 WHERE，條件是 id 等於某個號碼。這裡留一個空格，冒號 studentId。

（下一步）和上一章一樣，把要填的值放進 Map。

（下一步）抄寫規則不用重寫，同一份 StudentRowMapper 可以一直用。

（下一步）注意一件事：就算只查到一筆，query() 回傳的還是 List。只是這個 List 裡面只有一個 Student。如果查不到，就是一個空的 List。
-->

---

# 一次查好幾位：IN

<CodeSteps>

```java {2|3-4|5|all}
public List<Student> getStudentsByIds(List<Integer> ids) {
    String sql = "SELECT id, name FROM student WHERE id IN (:ids)";
    Map<String, Object> map = new HashMap<>();
    map.put("ids", ids);
    return namedParameterJdbcTemplate.query(sql, map, new StudentRowMapper());
}
```

- `IN (…)` 的意思是「id 是這幾個其中之一」，括號裡只留一個空格
- 把整個 `List` 直接放進 `Map`
- Spring JDBC 會自動把它展開：`[1, 2, 3]` 變成 `IN (1, 2, 3)`
- 不管傳幾個 id，SQL 都不用改

</CodeSteps>

<!--
有時候想一次查好幾位，例如 1 號、2 號、3 號。SQL 裡有一個寫法叫 IN。

（下一步）WHERE id IN 括號，意思是「id 是這幾個其中之一」。括號裡我們只留一個空格，冒號 ids。

（下一步）把整個 List 直接放進 Map。

（下一步）Spring JDBC 會自動把它展開。List 裡有 1、2、3，就變成 IN (1, 2, 3)。

（下一步）所以不管傳幾個 id 進來，SQL 都不用改。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 把三層接起來

<!--
承辦人員的方法寫好了，一樣補上組長和櫃台。
-->

---

# 組長：把查到的資料帶回來

```java
public List<Student> getStudentList() {
    return studentDao.getStudentList();
}

public List<Student> getStudentById(Integer studentId) {
    return studentDao.getStudentById(studentId);
}

public List<Student> getStudentsByIds(List<Integer> ids) {
    return studentDao.getStudentsByIds(ids);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 和上一章的差別：上一章的方法是 <code>void</code>，交代下去就好。查詢要把結果一路 <code>return</code> 回來。
</div>

</v-click>

<!--
在 StudentService 裡加三個方法，各自轉交給承辦人員。

（下一步）和上一章有一個差別。上一章的方法是 void，交代下去就好，不用帶東西回來。查詢不一樣，承辦人員拿到的那一疊資料卡，要一路 return 回來，所以每一行前面都有 return。
-->

---

# 櫃台：三個查詢 API

<CodeSteps>

```java {1-4|6-9|11-14|all}
@GetMapping("/students")
public List<Student> getStudentList() {
    return studentService.getStudentList();
}

@GetMapping("/students/{studentId}")
public List<Student> getStudentById(@PathVariable(name = "studentId") Integer studentId) {
    return studentService.getStudentById(studentId);
}

@GetMapping("/students/search")
public List<Student> getStudentsByIds(@RequestParam(name = "ids") List<Integer> ids) {
    return studentService.getStudentsByIds(ids);
}
```

- 查全部：`GET /students`
- 查一位：`GET /students/1`，用 `@PathVariable` 讀編號
- 查好幾位：`GET /students/search?ids=1,2`，用 `@RequestParam` 讀成 `List`
- 回傳 `List<Student>`，`@RestController` 會自動轉成 JSON 陣列

</CodeSteps>

<!--
在 StudentController 裡加三個方法，都是 GET，因為都是查詢。

（下一步）查全部：GET /students。

（下一步）查一位：GET /students/ 加上編號，用 @PathVariable 讀出來。

（下一步）查好幾位：GET /students/search，問號後面 ids=1,2。用 @RequestParam 接，型別寫 List<Integer>。網址上用逗號分開的值，Spring 會自動變成一個 List。

（下一步）三個方法回傳的都是 List<Student>。第十六章學過，@RestController 會自動把它轉成 JSON 陣列。
-->

---

# 為什麼好幾個 id 用 @RequestParam？

<v-clicks>

- 路徑（`/students/1`）用來指出**某一個東西**
- 問號後面（`?ids=1,2`）用來放**搜尋或篩選的條件**
- 「查這幾位」是篩選條件，所以放在問號後面
- 寫成 `/students/1,2,3` 也容易和 `/students/{studentId}` 搞混

</v-clicks>

<!--
你可能會想：好幾個 id，為什麼不放在路徑裡，用 @PathVariable 接？技術上可以，但是不建議。

（下一步）第二十章說過，路徑是用來指出某一個東西，例如 1 號同學。

（下一步）問號後面，是用來放搜尋或篩選的條件。

（下一步）「查這幾位」是一種篩選條件，所以放在問號後面比較合適。

（下一步）而且寫成 /students/1,2,3，很容易和 /students/ 加編號的那個 API 搞混。
-->

---

# 用 Postman 測試

先用上一章的 POST 新增 Judy、Tom 兩位同學，再測試：

<v-clicks>

- `GET /students` → `[{"id":1,"name":"Judy"},{"id":2,"name":"Tom"}]`
- `GET /students/1` → `[{"id":1,"name":"Judy"}]`
- `GET /students/search?ids=1,2` → 兩位都回來

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 查一位的結果外面也有 <code>[ ]</code>，因為 <code>query()</code> 回傳的是 <code>List</code>。之後學 JPA，會改成只回傳一個物件。
</div>

</v-click>

<!--
啟動 Spring Boot。先用上一章的 POST，新增 Judy 和 Tom 兩位同學，再測試三個查詢。

（下一步）GET /students，會拿到一個陣列，裡面有兩位。

（下一步）GET /students/1，拿到的陣列裡只有 Judy。

（下一步）GET /students/search?ids=1,2，兩位都回來。

（下一步）注意查一位的結果，外面也有中括號。因為 query() 回傳的是 List，就算只有一筆，轉成 JSON 還是陣列。之後學 JPA，會改成只回傳一個物件。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="card,調閱=code,query()：執行 SELECT|cabinet,交回來的表格=code,ResultSet|staff,抄寫規則：一列怎麼抄成一張卡=code,RowMapper 的 mapRow()|card,一張學生資料卡=code,一個 Student 物件|doc,一疊資料卡=code,List&lt;Student&gt;" />

<!--
我們用一張圖複習今天的內容。

（下一步）調閱，是 query()，執行 SELECT。

（下一步）交回來的表格，是 ResultSet。

（下一步）抄寫規則，是 RowMapper 的 mapRow 方法。

（下一步）一張學生資料卡，是一個 Student 物件。

（下一步）一疊資料卡，是 List<Student>。
-->

---

# 章節總結

<v-clicks>

- **`query()`**：執行 `SELECT`，要給 sql、map、rowMapper 三樣東西
- **`RowMapper`**：寫好「一列怎麼變成一個物件」，每一列會被呼叫一次
- **回傳值**：一定是 `List`，查不到就是空的 `List`
- **`IN` 查詢**：把 `List` 放進 `Map`，Spring JDBC 自動展開
- **篩選條件**：放在問號後面，用 `@RequestParam` 接
- **CRUD 到齊**：`update()` 負責新增、修改、刪除；`query()` 負責查詢

</v-clicks>

<v-click>

下一章來認識第二位幫手：不用自己寫申請單的 Spring Data JPA。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）query() 執行 SELECT，要給三樣東西。RowMapper 寫的是一列怎麼變成一個物件。回傳值一定是 List。IN 查詢只要把 List 放進 Map。篩選條件放在問號後面。到這裡 CRUD 就到齊了。

（最後一步）你可能覺得：每次都要寫 SQL、寫 Map、寫 RowMapper，有點累。下一章來認識第二位幫手，不用自己寫申請單的 Spring Data JPA。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請把三個查詢 API 都做一次。也可以試試查一個不存在的編號，看看回傳什麼。

有任何問題歡迎提出來。
-->
