---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Data JPA 的用法（下）—執行查詢操作
routeAlias: ch27
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
    Spring Data JPA 的用法（下）<br>執行查詢操作
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用方法名稱就能查詢，不需要寫 SQL」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第二十七章。

上一章我們請來資深助理 Spring Data JPA，學會了新增、修改、刪除。

今天繼續請他幫忙：查詢。你會發現，只要照固定的格式跟他說一句話，他就知道要查什麼。
-->

---

# 今天要搞懂的四件事

<v-clicks>

- **助理本來就會的查詢**：`findAll()`、`findById()`
- **查不到的時候怎麼辦？** 一個可能是空的信封：`Optional`
- **照格式說一句話就能查**：用方法名稱自訂查詢
- **資料太多，一次只拿一頁**：分頁查詢

</v-clicks>

<!--
今天要搞懂四件事。

（下一步）第一，助理本來就會的查詢：findAll 和 findById。

（下一步）第二，查不到的時候怎麼辦。助理會給我們一個可能是空的信封，叫 Optional。

（下一步）第三，照固定的格式說一句話就能查。這是 JPA 最有特色的功能：用方法名稱自訂查詢。

（下一步）第四，資料太多的時候，一次只拿一頁，叫做分頁查詢。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 助理本來就會的查詢

<!--
先看不用另外教、助理本來就會的。
-->

---

# 查全部：findAll()

```java
public List<Student> getStudentList() {
    return studentRepository.findAll();
}
```

<v-clicks>

- 加在上一章的 `StudentDao` 裡
- 助理自動執行 `SELECT … FROM student`
- 直接回傳 `List<Student>`，**不用寫 RowMapper**

</v-clicks>

<!--
第一個是查全部，findAll()。

（下一步）在上一章的 StudentDao 裡加這個方法，只有一行。

（下一步）助理會自動執行 SELECT，把 student 表的資料全部查出來。

（下一步）而且直接回傳一串 Student。第二十五章那份抄寫規則 RowMapper，現在不用寫了，助理會自己抄。
-->

---

# 查一位：findById() 給的是一個信封

<Pairs left="教務處" right="程式" rows="doc,助理交給你一個信封=code,findById(3) 回傳 Optional&lt;Student&gt;|card,有這位同學：信封裡有資料卡=code,Optional 裡面有 Student|what,沒有這位同學：信封是空的=code,Optional 是空的|ok,拆信封：有就拿出來，沒有就當作沒有=code,result.orElse(null)" />

<!--
第二個是查一位，findById()。給它編號，它幫你找。

但是這裡有一個問題：萬一沒有這個編號的同學呢？

（下一步）所以助理不會直接給你資料卡，而是交給你一個信封。對應到程式，findById 回傳的是 Optional<Student>。

（下一步）如果有這位同學，信封裡就有資料卡。

（下一步）如果沒有這位同學，信封是空的。

（下一步）我們要自己拆信封。最簡單的拆法是 orElse(null)：有就拿出來，沒有就當作沒有，也就是 null。

為什麼要多包一層信封？因為它在提醒我們：這裡可能查不到，記得處理。
-->

---

# findById() 的程式

<CodeSteps>

```java {2|3|4|all}
public Student getStudentById(Integer studentId) {
    Optional<Student> result = studentRepository.findById(studentId);
    Student student = result.orElse(null);
    return student;
}
```

- 助理執行 `SELECT … WHERE id = ?`，把結果裝進信封 `Optional`
- 拆信封：有資料就拿到 `Student`，沒有就是 `null`
- 回傳的是**一個** `Student`，不再是 `List`

</CodeSteps>

<!--
寫成程式是這樣，一樣加在 StudentDao 裡。

（下一步）呼叫 findById，助理執行 SELECT 加上 WHERE id 等於這個編號，把結果裝進信封 Optional。

（下一步）用 orElse(null) 拆信封。有資料就拿到 Student，沒有就是 null。

（下一步）注意回傳的型別是一個 Student，不再是 List。第二十五章說過查一筆會變成只回傳一個物件，就是這裡。
-->

---

# 想一想

<Poll question="資料庫裡沒有 99 號同學。studentRepository.findById(99).orElse(null) 會得到什麼？" options="一個 id 是 99 的新 Student|null|空的 List|程式直接報錯" answer="2" />

<!--
來想一題。

資料庫裡沒有 99 號同學。呼叫 findById(99)，再接 orElse(null)，會得到什麼？

（等大家作答）

（下一步）答案是 null。

信封是空的，orElse(null) 的意思就是「空的話就給我 null」。程式不會報錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 照格式說一句話，助理就會查

<!--
接下來是 JPA 最有特色的功能。
-->

---

# 想用名字查，怎麼辦？

助理內建的只有「查全部」和「用編號查」。想用**名字**查，只要在 `StudentRepository` 多寫一行：

```java
public interface StudentRepository extends JpaRepository<Student, Integer> {
    List<Student> findByName(String name);
}
```

<v-clicks>

- 只寫方法的名稱和參數，**不用寫內容**
- 助理看到 `findByName`，就知道要執行 `SELECT … WHERE name = ?`
- 呼叫：`studentRepository.findByName("Judy")`

</v-clicks>

<!--
助理內建的查詢，只有查全部和用編號查。如果想用名字查，怎麼辦？

只要在 StudentRepository 這個介面裡多寫一行。

（下一步）只寫方法的名稱和參數，不用寫內容。

（下一步）助理看到方法叫 findByName，就知道要執行 SELECT，條件是 name 等於傳進來的值。

（下一步）用的時候就像一般方法一樣呼叫。

SQL 沒寫、方法內容也沒寫，光靠名字就能查。關鍵是名字要照固定的格式取。
-->

---

# 把方法名稱拆開來看

<UrlParts parts="find;;動作;;我要查;;find：我要查資料||By;;開始講條件;;條件是…;;By 後面開始講條件||Name;;變數名稱;;名字等於…;;Name：Student 裡的 name 變數要等於第一個參數||And;;連接詞;;而且;;And：而且。也可以用 Or（或者）||Id;;變數名稱;;編號等於…;;Id：id 變數要等於第二個參數" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>findByNameAndId(String name, Integer id)</code> → <code>SELECT … WHERE name = ? AND id = ?</code>
</div>

</v-click>

<!--
我們把 findByNameAndId 這個方法名稱拆開來看。它就像一句話。

（下一步）find，我要查資料。

（下一步）By，後面開始講條件。

（下一步）Name，指 Student 裡的 name 變數，要等於傳進來的第一個參數。

（下一步）And，而且。也可以用 Or，或者。

（下一步）Id，指 id 變數，要等於第二個參數。

（下一步）所以 findByNameAndId，助理會寫出這樣的 SQL：WHERE name 等於問號，AND id 等於問號。

注意，By 後面用的是 Student 類別裡的變數名稱，第一個字母大寫。打錯的話，Spring Boot 啟動時就會報錯，告訴你找不到這個變數。
-->

---

# 常用的關鍵字

<v-clicks>

- `findByNameAndId` → `WHERE name = ? AND id = ?`
- `findByNameOrId` → `WHERE name = ? OR id = ?`
- `findByNameContaining` → 名字裡**包含**某些字（`LIKE %?%`）
- `findByIdGreaterThan` / `findByIdLessThan` → 大於 / 小於
- `findByIdBetween` → 介於兩個值之間
- `findByNameIn` → 是這幾個其中之一（`IN (…)`）
- `findByNameOrderByIdDesc` → 查完照 id 從大排到小
- `countByName` → 不查資料，只算有幾筆

</v-clicks>

<!--
除了 And 和 Or，還有很多關鍵字可以用。這裡列常用的幾個，不用背，要用的時候再查。

（依序按下一步）And 是而且，Or 是或者。Containing 是包含，例如名字裡有某個字。GreaterThan 和 LessThan 是大於和小於。Between 是介於兩個值之間。In 是這幾個其中之一。OrderBy 是排序，後面加 Desc 是從大排到小。開頭換成 count，就變成只算有幾筆。

這些關鍵字可以互相組合。但是組合太多，方法名稱會變得很長、很難讀。那種情況下一章會教另一種寫法。
-->

---

# 一次查好幾個名字：In

```java
// StudentRepository
List<Student> findByNameIn(Collection<String> names);

// StudentDao
public List<Student> getStudentsByName(String name) {
    return studentRepository.findByName(name);
}

public List<Student> getStudentsByNames(List<String> names) {
    return studentRepository.findByNameIn(names);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 傳進去 <code>["Alice", "Bob"]</code>，助理就執行 <code>WHERE name IN ('Alice', 'Bob')</code>。傳幾個都可以。
</div>

</v-click>

<!--
來實際用兩個。

在 StudentRepository 再加一行 findByNameIn，參數是一串名字。Collection 可以想成 List 這一類「一串東西」的總稱，傳 List 進去就可以。

在 StudentDao 加兩個方法。getStudentsByName 用一個名字查，呼叫剛才的 findByName。getStudentsByNames 用好幾個名字查，呼叫 findByNameIn。

（下一步）傳進去 Alice 和 Bob，助理就執行 WHERE name IN Alice、Bob。傳幾個都可以。
-->

---

# 想一想

<Poll question="想查「名字裡包含某些字」的學生，方法名稱應該怎麼取？" options="findByNameContaining|findNameLike|searchName|getStudentWhereNameHas" answer="1" />

<!--
確認一下。

想查名字裡包含某些字的學生，方法名稱應該怎麼取？

（等大家作答）

（下一步）答案是 findByNameContaining。

find、By、變數名稱 Name，再加上關鍵字 Containing。其他三個不符合格式，助理看不懂。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 資料太多：一次只拿一頁

<!--
最後一個主題：分頁。
-->

---

# 為什麼要分頁？

<Pairs left="教務處" right="程式" rows="book,全校三千位同學，一次全搬出來太重=what,資料很多時，findAll() 又慢又佔空間|doc,跟助理說：我要第幾頁、一頁幾筆=code,PageRequest.of(page、size)|card,助理只拿那一頁，並告訴你總共幾頁=code,回傳 Page&lt;Student&gt;" />

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 頁碼從 <b>0</b> 開始：第 1 頁是 <code>0</code>，第 2 頁是 <code>1</code>。
</div>

</v-click>

<!--
為什麼要分頁？

（下一步）全校有三千位同學，一次把整本學籍簿搬出來太重了。對應到程式：資料很多的時候，findAll() 又慢又佔空間。

（下一步）所以我們跟助理說：我要第幾頁、一頁幾筆。對應到程式，是 PageRequest.of，括號裡給頁碼和每頁的筆數。

（下一步）助理只拿那一頁，並且告訴你總共有幾頁。對應到程式，回傳的是 Page<Student>。

你在網路上看到的「上一頁、下一頁」，背後就是這樣做的。

（下一步）要特別注意：頁碼從 0 開始。第 1 頁是 0，第 2 頁是 1。
-->

---

# 分頁的程式

<CodeSteps>

```java {2|3|4-5|all}
public List<Student> getStudentPage(Integer page, Integer size) {
    Page<Student> result = studentRepository.findAll(PageRequest.of(page, size));
    List<Student> students = result.getContent();
    long total = result.getTotalElements();
    int totalPages = result.getTotalPages();
    return students;
}
```

- `findAll()` 括號裡多放一個 `PageRequest.of(第幾頁, 一頁幾筆)`
- `getContent()`：這一頁的資料
- `getTotalElements()` 是總筆數，`getTotalPages()` 是總頁數（這裡先拿出來看看）
- 自己取名的查詢也能分頁：`Page<Student> findByName(String name, Pageable pageable);`

</CodeSteps>

<!--
在 StudentDao 加一個 getStudentPage 方法，參數是第幾頁、一頁幾筆。

（下一步）一樣呼叫 findAll()，但是括號裡多放一個 PageRequest.of。助理就只會查那一頁。

（下一步）結果是一個 Page 物件。用 getContent() 拿到這一頁的資料。

（下一步）Page 物件還知道另外兩件事：getTotalElements 是總共幾筆，getTotalPages 是總共幾頁。這裡我們先拿出來看看，沒有回傳。

（下一步）補充一下：自己取名的查詢方法也能分頁，只要在參數最後加一個 Pageable。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 把三層接起來

<!--
承辦人員的五個查詢方法寫好了，補上組長和櫃台。
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

public List<Student> getStudentsByName(String name) {
    return studentDao.getStudentsByName(name);
}

public List<Student> getStudentsByNames(List<String> names) {
    return studentDao.getStudentsByNames(names);
}

public List<Student> getStudentPage(Integer page, Integer size) {
    return studentDao.getStudentPage(page, size);
}
```

<!--
在 StudentService 加五個方法，各自轉交給承辦人員，再把結果 return 回來。

結構和第二十五章完全一樣。唯一要注意的是第二個，getStudentById 回傳的是一個 Student，不是 List。
-->

---

# 櫃台：查全部、查一位、用名字查

<CodeSteps>

```java {1-4|6-9|11-14|all}
@GetMapping("/students")
public List<Student> getStudentList() {
    return studentService.getStudentList();
}

@GetMapping("/students/{studentId}")
public Student getStudentById(@PathVariable(name = "studentId") Integer studentId) {
    return studentService.getStudentById(studentId);
}

@GetMapping("/students/search")
public List<Student> getStudentsByName(@RequestParam(name = "name") String name) {
    return studentService.getStudentsByName(name);
}
```

- 查全部：`GET /students`
- 查一位：`GET /students/1`，回傳一個 `Student`，JSON 是 `{ }` 不是 `[ ]`
- 用名字查：`GET /students/search?name=Judy`
- 搜尋條件放在問號後面，用 `@RequestParam` 接

</CodeSteps>

<!--
在 StudentController 先加三個方法。

（下一步）查全部：GET /students。

（下一步）查一位：GET /students/ 加上編號。回傳的是一個 Student，所以前端拿到的 JSON 是大括號的物件，不再是中括號的陣列。

（下一步）用名字查：GET /students/search，問號後面 name=Judy。

（下一步）和第二十五章說的一樣，搜尋條件放在問號後面，用 @RequestParam 接。
-->

---

# 櫃台：查好幾個名字、分頁

<CodeSteps>

```java {1-4|6-10|all}
@GetMapping("/students/search-by-names")
public List<Student> getStudentsByNames(@RequestParam(name = "names") List<String> names) {
    return studentService.getStudentsByNames(names);
}

@GetMapping("/students/page")
public List<Student> getStudentPage(@RequestParam(name = "page") Integer page,
                                    @RequestParam(name = "size") Integer size) {
    return studentService.getStudentPage(page, size);
}
```

- 好幾個名字：`GET /students/search-by-names?names=Alice,Bob`
- 分頁：`GET /students/page?page=0&size=4`，第 1 頁、每頁 4 筆
- 前端需要總頁數時，可以直接回傳 `Page<Student>`，JSON 裡會有 `totalPages`

</CodeSteps>

<!--
再加兩個方法。

（下一步）查好幾個名字：GET /students/search-by-names，問號後面 names=Alice,Bob。用逗號分開，Spring 會自動變成 List。

（下一步）分頁：GET /students/page，問號後面 page=0、size=4，意思是第 1 頁、每頁 4 筆。前端想看哪一頁，就改 page 的值。

（下一步）如果前端需要知道總共有幾頁，Controller 可以直接回傳 Page<Student>。轉出來的 JSON 裡會有 content、totalElements、totalPages 這些資訊。
-->

---

# 用 Postman 測試

先用上一章的 POST 新增 Judy、Tom 兩位同學，再測試：

<v-clicks>

- `GET /students` → `[{"id":1,"name":"Judy"},{"id":2,"name":"Tom"}]`
- `GET /students/1` → `{"id":1,"name":"Judy"}`（一個物件）
- `GET /students/search?name=Judy` → `[{"id":1,"name":"Judy"}]`
- `GET /students/search-by-names?names=Judy,Tom` → 兩位都回來
- `GET /students/page?page=0&size=1` → 只有 Judy；`page=1` → 只有 Tom

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left">
✅ 看 Console：用名字查時有 <code>where … name=?</code>，分頁時 SQL 的最後有 <code>limit</code>。這些都是助理自己寫的。
</div>

</v-click>

<!--
啟動 Spring Boot。先用上一章的 POST 新增 Judy 和 Tom，再依序測試。

（依序按下一步）查全部，拿到兩位。查 1 號，拿到一個物件。用名字查 Judy，拿到一個陣列，裡面只有 Judy。用兩個名字查，兩位都回來。分頁，page=0、size=1，只有 Judy；把 page 改成 1，只有 Tom。

你的 id 可能不是 1 和 2，請用實際的編號。

（最後一步）測試的時候看一下 Console。用名字查的時候，SQL 裡有 where name 等於問號。分頁的時候，SQL 的最後有 limit。這些都是助理自己寫的。
-->

---

# 同一件事，兩位幫手的比較

<Pairs left="Spring JDBC" right="Spring Data JPA" sign="vs" rows="code,查全部：query(sql、map、rowMapper)=ok,findAll()|code,查一筆：SQL 加 WHERE + Map=ok,findById(id)|code,自訂條件：自己寫 SQL=ok,照格式取方法名稱|staff,自己寫 RowMapper=ok,自動變成物件" />

<!--
同樣是查詢，把兩位幫手放在一起比較。

（下一步）查全部。Spring JDBC 要準備三樣東西交給 query()。JPA 只要 findAll()。

（下一步）查一筆。Spring JDBC 要寫 WHERE、準備 Map。JPA 只要 findById()。

（下一步）自訂條件。Spring JDBC 自己寫 SQL。JPA 照格式取方法名稱。

（下一步）結果怎麼變成物件。Spring JDBC 自己寫 RowMapper。JPA 自動完成。
-->

---

# 章節總結

<v-clicks>

- **`findAll()`**：查全部，回傳 `List`
- **`findById()`**：回傳 `Optional`，用 `orElse(null)` 取出來
- **自訂查詢**：在 Repository 寫方法名稱，`findBy` + 變數名稱 + 關鍵字
- **常用關鍵字**：`And`、`Or`、`Containing`、`In`、`Between`、`OrderBy`
- **分頁**：`findAll(PageRequest.of(page, size))`，頁碼從 0 開始
- **不用 RowMapper**：查到的資料自動變成物件

</v-clicks>

<v-click>

下一章：遇到方法名稱講不清楚的複雜查詢，就自己寫一張便條給助理：`@Query`。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）findAll 查全部。findById 回傳 Optional，用 orElse(null) 取出來。自訂查詢只要在 Repository 寫方法名稱。常用的關鍵字有 And、Or、Containing、In、Between、OrderBy。分頁用 PageRequest.of，頁碼從 0 開始。查到的資料會自動變成物件，不用寫 RowMapper。

（最後一步）但是有些查詢太複雜，光靠方法名稱講不清楚。下一章我們學怎麼自己寫一張便條給助理，叫做 @Query。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後可以自己在 StudentRepository 多加一個方法，例如 findByNameContaining，試試看能不能查到。

有任何問題歡迎提出來。
-->
