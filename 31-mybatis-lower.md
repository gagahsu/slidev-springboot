---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: MyBatis 的用法（中）—執行查詢操作
routeAlias: ch31
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem;">
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    MyBatis 的用法（中）<br>執行查詢操作
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用 @Select 查詢，MyBatis 自動映射結果」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第三十一章。

上一章我們用 MyBatis 做了新增、修改、刪除。今天補上最後一塊：查詢，用的是 @Select。

學完這一章，三位幫手的 CRUD 就全部學齊了，最後我們會把三位放在一起比較。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **查詢的申請單**：`@Select`
- **查回來的表格誰來抄？** MyBatis 照「名字一樣」的規則自動抄
- **三位幫手總比較**：同一件事，三種寫法

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，查詢的申請單，@Select。

（下一步）第二，查回來的表格誰來抄成資料卡。MyBatis 會照「名字一樣」的規則自動抄。

（下一步）第三，三位幫手總比較。同一件事，三種寫法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# MyBatis 怎麼抄資料卡？

<!--
先看 MyBatis 怎麼處理查回來的表格。
-->

---

# 名字一樣，就自動抄過去

<Pairs left="學籍簿的欄位" right="資料卡的變數" sign="→" rows="book,id 欄=card,Student 的 id|book,name 欄=card,Student 的 name|what,名字對不上的欄位=no,不會抄，那一格是空的（null）" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 第二十五章要自己寫 <code>StudentRowMapper</code>。MyBatis 幫我們做了同一件事，條件是<b>欄位名稱和變數名稱一樣</b>。
</div>

</v-click>

<!--
MyBatis 抄資料卡的規則很簡單：名字一樣，就自動抄過去。

（下一步）學籍簿的 id 欄，抄到 Student 的 id。

（下一步）name 欄，抄到 Student 的 name。

（下一步）如果有欄位的名字和變數對不上，MyBatis 不會抄，資料卡上那一格就是空的，也就是 null。

（下一步）第二十五章用 Spring JDBC 的時候，我們要自己寫 StudentRowMapper。MyBatis 幫我們做了同一件事，條件是欄位名稱和變數名稱要一樣。型別也會自動轉換：資料庫的文字變成 String，整數變成 Integer。
-->

---

# 名字對不上的時候

第二十八章加的欄位叫 `class_name`，變數卻叫 `className`，名字不一樣：

```properties
mybatis.configuration.map-underscore-to-camel-case=true
```

<v-clicks>

- 在 `application.properties` 加這一行
- MyBatis 就會把「底線」的欄位名稱，自動對應到「駝峰」的變數名稱
- `class_name` → `className`

</v-clicks>

<!--
那名字對不上的時候怎麼辦？我們剛好有一個例子。

第二十八章加的欄位叫 class_name，用底線分開。但是 Java 的變數叫 className。名字不一樣，MyBatis 預設不會抄。

（下一步）解法是在 application.properties 加這一行設定。

（下一步）加了之後，MyBatis 會把用底線的欄位名稱，自動對應到駝峰寫法的變數名稱。駝峰就是像 className 這樣，第二個字開頭大寫。

（下一步）所以 class_name 就能對應到 className 了。

今天的例子只查 id 和 name，用不到這個設定。但是實際工作上幾乎都會開。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 用 @Select 查詢

<!--
來寫查詢的申請單。
-->

---

# 三張查詢的申請單

<CodeSteps>

```java {1-2|4-5|7-8|all}
@Select("SELECT id, name FROM student")
List<Student> findAll();

@Select("SELECT id, name FROM student WHERE id = #{id}")
Student findById(@Param("id") Integer id);

@Select("SELECT id, name FROM student WHERE id = #{id} AND name = #{name}")
Student findByIdAndName(@Param("id") Integer id, @Param("name") String name);
```

- 查全部：回傳型別寫 `List<Student>`，每一列自動變成一個 `Student`
- 查一位：回傳型別寫 `Student`；查不到就回傳 `null`
- 兩個條件：每個參數用 `@Param` 標上名字，對應 SQL 裡的空格
- 都加在上一章的 `StudentMapper` 裡

</CodeSteps>

<!--
在上一章的 StudentMapper 裡加三個方法。

（下一步）查全部。方法上面貼 @Select，寫 SELECT 的 SQL。回傳型別寫 List<Student>，MyBatis 就會把每一列自動變成一個 Student。

（下一步）查一位。SQL 多了 WHERE。回傳型別寫 Student，代表只要一筆。如果查不到，會回傳 null。這裡和 JPA 不一樣，沒有 Optional 那個信封。參數前面的 @Param("id")，是把這個參數標上名字，對應 SQL 裡的 #{id}。

（下一步）兩個條件。上一章說過，參數有好幾個值的時候，每個都要用 @Param 標上名字。

（下一步）這三個方法都加在 StudentMapper 裡。
-->

---

# 想一想

<Poll question="用 MyBatis 的 findById(99) 查一位不存在的同學，會得到什麼？" options="null|空的 Optional|空的 List|程式報錯" answer="1" />

<!--
確認一下。

用 MyBatis 的 findById 查一位不存在的同學，會得到什麼？

（等大家作答）

（下一步）答案是 null。

回傳型別是 Student，查不到就是 null。JPA 的 findById 才是回傳 Optional。
-->

---

# 四種申請單，一次整理

<Pairs left="貼在方法上的標註" right="做什麼、回傳什麼" rows="form,@Insert=code,新增 → int（動到幾筆）|doc,@Update=code,修改 → int|no,@Delete=code,刪除 → int|card,@Select=code,查詢 → 一個物件，或 List" />

<!--
MyBatis 的四種申請單，一次整理。

（下一步）@Insert 是新增，回傳 int，代表動到幾筆。

（下一步）@Update 是修改，回傳 int。

（下一步）@Delete 是刪除，回傳 int。

（下一步）@Select 是查詢，回傳一個物件，或是一個 List。看我們回傳型別怎麼寫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 把三層接起來

<!--
一樣把三層接起來。
-->

---

# 承辦人員：StudentDao

```java
public List<Student> getStudentList() {
    return studentMapper.findAll();
}

public Student getStudentById(Integer studentId) {
    return studentMapper.findById(studentId);
}

public Student getStudentByIdAndName(Integer id, String name) {
    return studentMapper.findByIdAndName(id, name);
}
```

<!--
先看承辦人員。在 StudentDao 加三個方法，各自呼叫 StudentMapper 的三個查詢方法。
-->

---

# 組長：StudentService

```java
public List<Student> getStudentList() {
    return studentDao.getStudentList();
}

public Student getStudentById(Integer studentId) {
    return studentDao.getStudentById(studentId);
}

public Student getStudentByIdAndName(Integer studentId, String name) {
    return studentDao.getStudentByIdAndName(studentId, name);
}
```

<!--
再看組長。在 StudentService 加三個方法，轉交給承辦人員，再把結果 return 回來。

這些結構前面寫過很多次了。
-->

---

# 櫃台：三個查詢 API

<CodeSteps>

```java {1-4|6-9|11-15|all}
@GetMapping("/students")
public List<Student> getStudentList() {
    return studentService.getStudentList();
}

@GetMapping("/students/{studentId}")
public Student getStudentById(@PathVariable(name = "studentId") Integer studentId) {
    return studentService.getStudentById(studentId);
}

@GetMapping("/students/search")
public Student getStudentByIdAndName(@RequestParam(name = "id") Integer id,
                                     @RequestParam(name = "name") String name) {
    return studentService.getStudentByIdAndName(id, name);
}
```

- 查全部：`GET /students`
- 查一位：`GET /students/1`
- 兩個條件：`GET /students/search?id=1&name=Judy`
- 用編號指出某一位，放在路徑；搜尋條件，放在問號後面

</CodeSteps>

<!--
在 StudentController 加三個方法。

（下一步）查全部：GET /students。

（下一步）查一位：GET /students/ 加上編號。

（下一步）兩個條件：GET /students/search，問號後面 id=1、name=Judy。

（下一步）一樣的慣例：用編號指出某一位，放在路徑；搜尋條件，放在問號後面。
-->

---

# 用 Postman 測試

先新增 Judy、Tom 兩位同學，再測試：

<v-clicks>

- `GET /students` → 一個陣列，裡面是所有同學
- `GET /students/1` → `{"id":1,"name":"Judy", …}`，一個物件
- `GET /students/search?id=1&name=Judy` → 同一位同學

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 回傳的 JSON 裡 <code>className</code> 和 <code>score</code> 會是 <code>null</code>，因為我們的 SQL 只查了 <code>id</code> 和 <code>name</code>。SQL 寫什麼，就只拿到什麼。
</div>

</v-click>

<!--
啟動 Spring Boot，先新增 Judy 和 Tom 兩位同學，再測試。

（下一步）GET /students，拿到一個陣列，裡面是所有同學。

（下一步）GET /students/1，拿到一個物件。請把 1 換成你實際的編號。

（下一步）GET /students/search，帶 id 和 name 兩個條件，拿到同一位同學。

（下一步）你會注意到，回傳的 JSON 裡 className 和 score 是 null。因為我們的 SQL 只查了 id 和 name 兩個欄位。這就是自己寫 SQL 的特色：SQL 寫什麼，就只拿到什麼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 三位幫手總比較

<!--
到這裡，三位幫手的 CRUD 都學完了。把他們放在一起看。
-->

---

# 同一件事，三種寫法

| 要做的事 | Spring JDBC | Spring Data JPA | MyBatis |
| --- | --- | --- | --- |
| 新增 | `update(sql, map)` | `save()` | `@Insert` |
| 修改 | `update(sql, map)` | `save()` | `@Update` |
| 刪除 | `update(sql, map)` | `deleteById()` | `@Delete` |
| 查全部 | `query(sql, map, rowMapper)` | `findAll()` | `@Select` |
| 查一筆 | `query()` 加 `WHERE` | `findById()` | `@Select` 加 `WHERE` |

<!--
同一件事，三種寫法。這張表可以當成這個單元前半段的總整理。

新增、修改、刪除：Spring JDBC 都用 update()，自己準備 SQL 和 Map。JPA 用 save() 和 deleteById()。MyBatis 用 @Insert、@Update、@Delete。

查詢：Spring JDBC 用 query()，還要寫 RowMapper。JPA 用 findAll() 和 findById()。MyBatis 用 @Select。
-->

---

# 怎麼選？

<v-clicks>

- **Spring Data JPA**：寫得最少。一般的新增、修改、刪除、簡單查詢，用它最快
- **MyBatis**：SQL 自己掌握。查詢複雜、想自己調整 SQL 的時候很好用
- **Spring JDBC**：最貼近原理。現在比較少直接用，但是學過它，才看得懂另外兩位在背後做什麼

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 三種可以放在同一個專案裡一起用。工作上用哪一種，通常看團隊的習慣。
</div>

</v-click>

<!--
那要怎麼選？

（下一步）Spring Data JPA 寫得最少。一般的新增、修改、刪除、簡單查詢，用它最快。

（下一步）MyBatis 是 SQL 自己掌握。查詢比較複雜、想自己調整 SQL 的時候很好用。

（下一步）Spring JDBC 最貼近原理。現在比較少直接用它寫，但是學過它，才看得懂另外兩位在背後幫我們做了什麼。

（下一步）三種可以放在同一個專案裡一起用。工作上用哪一種，通常看團隊的習慣。
-->

---

# 章節總結

<v-clicks>

- **`@Select`**：查詢的 SQL 寫在方法上面
- **自動對應**：欄位名稱和變數名稱一樣，就自動變成物件，不用 `RowMapper`
- **底線轉駝峰**：`map-underscore-to-camel-case=true`
- **查不到**：回傳 `null`，沒有 `Optional`
- **`@Param`**：參數不只一個時，替每個參數標上名字
- **三種工具**：各有擅長，可以一起用

</v-clicks>

<v-click>

下一章：申請單越寫越多、越寫越長，我們把它們收進一本範本夾：XML Mapper。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）@Select 把查詢的 SQL 寫在方法上面。欄位名稱和變數名稱一樣，就自動變成物件。名字是底線和駝峰的差別，可以用一行設定解決。查不到會回傳 null。參數不只一個時，用 @Param 標上名字。三種工具各有擅長，可以一起用。

（最後一步）MyBatis 還有一半沒講。當申請單越寫越多、越寫越長，貼在方法上面會很擠。下一章我們把它們收進一本範本夾，叫做 XML Mapper。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後可以試著把 SQL 改成也查 class_name 和 score，加上那一行設定，看看 JSON 裡的 className 會不會出現。

有任何問題歡迎提出來。
-->
