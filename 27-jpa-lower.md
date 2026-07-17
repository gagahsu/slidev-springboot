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
大家好，上一章我們學了 Spring Data JPA 的設定，以及 save() 和 deleteById() 的用法。

今天要學查詢操作：findAll() 查詢所有資料、findById() 查詢單筆資料，以及 Spring Data JPA 最神奇的功能——用方法命名規則自動產生查詢 SQL。
-->

---
layout: default
---

# Outline

- **`findAll()` 和 `findById()`** — 查詢全部與查詢單筆的用法
- **自訂查詢方法** — 方法命名規則自動產生 SQL，Spring Data JPA 最強特色
- **完整 Keyword 表** — And、Or、Between、Like、In、OrderBy 等常用關鍵字
- **分頁查詢** — `Page`、`Pageable`、`PageRequest.of()` 用法
- **串接三層式架構** — Controller + Service + Dao 完整程式碼與 Postman 測試
- **章節總結** — JPA 查詢完整整理，三種框架比較收尾

<!--
今天的核心是查詢操作。特別是最後的自訂查詢方法，是 Spring Data JPA 和 Spring JDBC 差異最大的地方。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## findAll() 和 findById() 的用法介紹

<!--
先看兩個最基本的查詢方法。
-->

---

# JpaRepository 的查詢方法

| 方法 | 回傳類型 | 說明 |
| --- | --- | --- |
| `findAll()` | `List<Student>` | 查詢所有學生（SELECT * FROM student） |
| `findById(id)` | `Optional<Student>` | 根據 id 查詢單筆學生 |
| `existsById(id)` | `boolean` | 判斷某個 id 是否存在 |
| `count()` | `long` | 回傳資料表的資料筆數 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>這些方法都不需要自己實作</b>，繼承 JpaRepository 就自動擁有，Spring 在啟動時自動產生實作。
</div>

<!--
JpaRepository 內建了許多查詢方法，這頁列出最常用的四個。

最重要的是 findAll() 和 findById()，幾乎每個後端 API 都會用到。

注意 findById() 回傳的是 Optional<Student>，不是直接的 Student 物件。
Optional 是 Java 的一種包裝類別，用來處理「可能為 null」的情況——如果 id 不存在，資料庫回傳 null，Optional 可以安全地處理這種情況，避免 NullPointerException。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 使用查詢方法操作數據

<!--
了解了方法之後，來看程式碼範例。
-->

---

# findAll() — 查詢所有學生

在 `StudentDao` 注入 `StudentRepository`，`findAll()` 自動執行 `SELECT * FROM student`：

```java
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class StudentDao {

    private final StudentRepository studentRepository;

    public StudentDao(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getStudentList() {
        List<Student> list = studentRepository.findAll();
        return list;
    }
}
```

| 說明 | 詳情 |
| --- | --- |
| 不需要任何參數 | JPA 自動產生並執行 `SELECT * FROM student` |
| 回傳值 | `List<Student>`，每個物件對應資料表的一行；**不需要 RowMapper** |

<!--
findAll() 是最簡單的查詢方法。

Dao 的結構和上一章完全一樣：@Repository + 建構子注入 StudentRepository，
本章的查詢方法都會寫在這個 StudentDao 裡。

和 Spring JDBC 相比，Spring JDBC 需要：寫 SQL + 建 Map + 建 RowMapper + 呼叫 query()，整整四步。
Spring Data JPA 只需要一行 findAll()，JPA 自動處理所有細節。

回傳的 List<Student> 可以直接 return 給 Controller，@RestController 自動轉成 JSON 陣列。
-->

---

# findById() — 查詢單筆學生

在 `StudentDao` 加上 `getStudentById()`，`findById()` 回傳 `Optional<Student>`：

```java
import java.util.Optional;

    // 接續 StudentDao，新增方法
    public Student getStudentById(Integer studentId) {
        Optional<Student> result = studentRepository.findById(studentId);
        Student student = result.orElse(null);
        return student;
    }
```

| 說明 | 詳情 |
| --- | --- |
| `findById(id)` | 執行 `SELECT * FROM student WHERE id = ?` |
| 回傳 Optional | 安全包裝，避免 id 不存在時產生 NullPointerException |
| `orElse(null)` | 如果找到就回傳 Student，找不到就回傳 null |

<!--
findById() 多了一個步驟：從 Optional 取出 Student 物件。

orElse(null) 的意思是：「如果 Optional 裡有值就取出來，否則就給 null」。

實務上不建議直接 return null，更好的做法是判斷 result.isPresent() 後回傳 404 的 Http Status Code，但初學階段先理解基本用法。

⚠️ 注意：findById() 的參數類型必須和 JpaRepository<Student, Integer> 的第二個泛型一致，這裡是 Integer。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 自訂查詢方法與用法總結

<!--
Spring Data JPA 最強大的功能：用方法命名就能自動產生 SQL。
-->

---

# 自訂查詢方法 — 方法命名規則

只需在 `StudentRepository` 定義方法簽名，JPA 自動產生 SQL：

| 方法名稱 | JPA 自動產生的 SQL |
| --- | --- |
| `findByName(String name)` | `SELECT * FROM student WHERE name = ?` |
| `findByNameAndId(String name, Integer id)` | `SELECT * FROM student WHERE name = ? AND id = ?` |
| `findByNameContaining(String keyword)` | `SELECT * FROM student WHERE name LIKE %?%` |
| `countByName(String name)` | `SELECT COUNT(*) FROM student WHERE name = ?` |

<!--
這是 Spring Data JPA 最神奇的功能——「方法命名查詢」（Derived Query）。

我們只需要在 StudentRepository 裡按照規則寫方法名稱，JPA 就會自動解析方法名稱、產生對應的 SQL。

findByName → WHERE name = ?
findByNameAndId → WHERE name = ? AND id = ?
findByNameContaining → WHERE name LIKE %?%

完全不用寫 SQL，方法名稱就是 SQL！這就是 Spring Data JPA 最大的優勢。
-->

---

# 在 StudentRepository 定義自訂查詢方法

```java
public interface StudentRepository extends JpaRepository<Student, Integer> {
    List<Student> findByName(String name);
}
```

| 使用方式 | 說明 |
| --- | --- |
| 在介面直接宣告方法 | 不需要實作，Spring 自動產生 |
| 呼叫 | `studentRepository.findByName("Judy")` |
| 效果 | 執行 `SELECT * FROM student WHERE name = 'Judy'` |

<!--
實際在程式碼裡加入自訂查詢方法非常簡單。

只需要在 StudentRepository 介面裡加一行方法宣告，不用寫方法的實作內容。
Spring 在啟動時解析方法名稱，自動建立對應的查詢邏輯。

呼叫時就和一般方法一樣：studentRepository.findByName("Judy")，回傳 List<Student>。

這個功能讓一般的 CRUD 查詢幾乎不需要寫任何 SQL，大幅減少開發時間。
-->

---

# Spring Data JPA Keyword 一覽

Repository 方法名稱支援以下關鍵字，JPA 自動解析產生 SQL：

| Keyword | 方法命名範例 | 等同 SQL 條件 |
| --- | --- | --- |
| `And` | `findByNameAndCity` | `WHERE name = ? AND city = ?` |
| `Or` | `findByNameOrCity` | `WHERE name = ? OR city = ?` |
| `Between` | `findByAgeBetween` | `WHERE age BETWEEN ? AND ?` |
| `LessThan` | `findByAgeLessThan` | `WHERE age < ?` |
| `GreaterThan` | `findByAgeGreaterThan` | `WHERE age > ?` |
| `Like` | `findByNameLike` | `WHERE name LIKE ?`（需自帶 `%`） |
| `Containing` | `findByNameContaining` | `WHERE name LIKE %?%` |
| `In` | `findByCityIn(Collection)` | `WHERE city IN (...)` |
| `OrderBy` | `findByAgeOrderByNameDesc` | `WHERE age = ? ORDER BY name DESC` |
| `Distinct` | `findDistinctByCity` | `SELECT DISTINCT ... WHERE city = ?` |

<!--
這頁是完整的 keyword 對照表，方便日後開發查閱。

最常用的是 And、Or、Between、Containing（模糊查詢）、In（多值查詢）、OrderBy（排序）。

需要注意：Like 要自己在參數值加上 %，例如 findByNameLike("%Judy%")。
Containing 則是框架自動幫你加上前後的 %，更方便。

記住這些關鍵字，大部分的查詢需求都可以用方法命名來解決，不需要寫 SQL。
-->

---

# In — 動態多值查詢

`findByXxxIn(Collection)` 支援動態個數的 IN 條件：

```java
// StudentRepository — 宣告方法
public interface StudentRepository extends JpaRepository<Student, Integer> {
    List<Student> findByNameIn(Collection<String> names);
}
```

```java
    // StudentDao — 新增方法呼叫
    public List<Student> getStudentsByNames(List<String> names) {
        // names = ["Alice", "Bob"] → SELECT * FROM student WHERE name IN ('Alice', 'Bob')
        return studentRepository.findByNameIn(names);
    }
```

| 說明 | 詳情 |
| --- | --- |
| 參數型別 | `Collection<T>`，可傳 `List`、`Set` |
| 動態個數 | 傳幾個值，JPA 自動產生幾個 `IN (?)` 佔位符 |
| 組合使用 | `findByNameInAndCity(Collection<String> names, String city)` |

<!--
In 是 Spring Data JPA 命名查詢最實用的 keyword 之一。
只需在 Collection 裡放入要查的值，JPA 自動展開成對應的 IN 語法，不需要手寫 SQL。
-->

---

# 分頁查詢 — Page 與 Pageable

當資料量大時，一次回傳所有資料會讓 API 變慢，分頁查詢只回傳「某一頁」的資料：

| 類別 | 說明 |
| --- | --- |
| `Pageable` | 分頁請求的介面，定義「第幾頁」和「每頁幾筆」 |
| `PageRequest` | `Pageable` 的實作，用 `PageRequest.of(page, size)` 建立 |
| `Page<T>` | 分頁查詢結果，包含本頁資料和總筆數資訊 |

| `PageRequest.of()` 參數 | 說明 |
| --- | --- |
| `page` | 頁碼，從 **0** 開始（第 1 頁 = 0，第 2 頁 = 1） |
| `size` | 每頁顯示的資料筆數，必須大於 0 |

<!--
分頁查詢是後端 API 非常常見的需求。

想像你在 Google 搜尋，結果有 100 萬筆，但每次只顯示 10 筆，這就是分頁的概念。

Spring Data JPA 的分頁用三個類別配合：
Pageable 是請求的規格；PageRequest 是建立 Pageable 的工具；Page 是回傳結果。

⚠️ 頁碼從 0 開始：PageRequest.of(0, 10) 是第 1 頁，PageRequest.of(1, 10) 是第 2 頁。
-->

---

# 分頁查詢 — 程式碼範例

**在 StudentDao 呼叫 JpaRepository 內建的分頁方法：**

```java
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

    // StudentDao — 新增方法
    public List<Student> getStudentPage(Integer page, Integer size) {
        Page<Student> result = studentRepository.findAll(PageRequest.of(page, size));
        List<Student> students = result.getContent();   // 取得本頁資料
        long total = result.getTotalElements();          // 取得總筆數
        int totalPages = result.getTotalPages();         // 取得總頁數
        return students;
    }
```

**自訂查詢也支援分頁（在 Repository 加 Pageable 參數）：**

```java
Page<Student> findByName(String name, Pageable pageable);
```

<!--
看實際的程式碼。

findAll(Pageable) 是 JpaRepository 內建的方法，不需要額外宣告，直接呼叫即可。

回傳的 Page 物件很豐富：
- getContent()：取得本頁的資料列表
- getTotalElements()：資料庫裡符合條件的總筆數
- getTotalPages()：根據 size 算出的總頁數

自訂查詢方法也可以加上 Pageable 參數，JPA 一樣自動處理分頁邏輯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## 串接三層式架構

<!--
查詢方法都會用了，一樣補上 Service 和 Controller，讓前端能透過 GET API 查詢資料。
-->

---

# StudentDao — 彙整本章的查詢方法

前面各節已陸續完成四個方法，補上自訂查詢 `getStudentsByName()`，Dao 就齊了：

```java
    // StudentDao — 新增方法
    public List<Student> getStudentsByName(String name) {
        return studentRepository.findByName(name);
    }
```

| Dao 方法 | 呼叫的 Repository 方法 | 出處 |
| --- | --- | --- |
| `getStudentList()` | `findAll()` | Part 2 |
| `getStudentById(id)` | `findById(id).orElse(null)` | Part 2 |
| `getStudentsByName(name)` | `findByName(name)` | 本頁補上 |
| `getStudentsByNames(names)` | `findByNameIn(names)` | In — 動態多值查詢 |
| `getStudentPage(page, size)` | `findAll(PageRequest.of(page, size))` | 分頁查詢 |

<!--
Dao 這一層其實在前面各節就一路寫好了：findAll、findById、findByNameIn、分頁，各自的小節都把方法加進 StudentDao。

這裡再補最後一個：getStudentsByName()，轉呼叫自訂查詢方法 findByName()。

用這張表把五個方法彙整起來——接下來 Service 和 Controller 要把這五個方法全部串出去。

比較 ch25 的 Dao：不用寫 SQL、不用建 Map、不用寫 RowMapper，每個方法一行搞定。
-->

---

# StudentService（1/2）— 基本查詢

和 ch25 相同的結構：建構子注入 `StudentDao`，把查詢結果一路 `return` 回去：

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

    public Student getStudentById(Integer studentId) {
        return studentDao.getStudentById(studentId);
    }

    public List<Student> getStudentsByName(String name) {
        return studentDao.getStudentsByName(name);
    }
}
```

<!--
Service 層和 ch25 幾乎一模一樣：@Service、建構子注入、轉呼叫、return。

唯一的差別：getStudentById() 的回傳型別是 Student，不是 List<Student>——
因為 JPA 的 findById() 本來就是查單筆，不像 Spring JDBC 的 query() 只能回傳 List。

還有 IN 查詢和分頁兩個方法，下一頁補上。
-->

---

# StudentService（2/2）— IN 查詢與分頁

Dao 的另外兩個方法也補上轉呼叫：

```java
    public List<Student> getStudentsByNames(List<String> names) {
        return studentDao.getStudentsByNames(names);
    }

    public List<Student> getStudentPage(Integer page, Integer size) {
        return studentDao.getStudentPage(page, size);
    }
```

| 方法 | 參數 | 對應 Dao |
| --- | --- | --- |
| `getStudentsByNames()` | 多個名字的 `List<String>` | `findByNameIn()` 展開成 `IN (...)` |
| `getStudentPage()` | `page`（第幾頁）、`size`（每頁幾筆） | `findAll(PageRequest.of(page, size))` |

<!--
IN 查詢和分頁的 Service 方法一樣是單純轉呼叫。

注意 getStudentPage 的兩個參數：page 和 size 是從前端一路傳進來的——
前端決定「要看第幾頁、每頁幾筆」，經 Controller、Service 傳到 Dao，最後變成 PageRequest.of(page, size)。

這就是分頁在三層式架構裡的應用方式：分頁參數是「前端的需求」，所以由前端傳入，後端不寫死。
-->

---

# StudentController — 查詢 API

三個 GET API，單筆查詢改回傳 `Student`（不再是 List）：

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
    public Student getStudentById(@PathVariable(name = "studentId") Integer studentId) {
        return studentService.getStudentById(studentId);
    }
}
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>兌現 ch25 的預告：</b> 單筆查詢的回傳型別是 <code>Student</code>，前端拿到的是 JSON 物件 <code>{ }</code>，不再是包一層的陣列 <code>[ ]</code>。
</div>

<!--
Controller 一樣只注入 Service。

GET /students 查全部，回傳 List<Student>，自動轉 JSON 陣列。
GET /students/{studentId} 查單筆——注意回傳型別是 Student！
ch25 用 Spring JDBC 時，query() 只能回傳 List，就算查單筆前端也拿到陣列；
現在 findById() 天生查單筆，前端拿到的就是乾淨的 JSON 物件。

還剩自訂查詢方法 findByName 沒串接，下一頁補上。
-->

---

# 條件搜尋 — 串接自訂查詢方法

`findByName()` 也開一個 API，用 `@RequestParam` 接收搜尋條件：

```java
    @GetMapping("/students/search")
    public List<Student> getStudentsByName(@RequestParam(name = "name") String name) {
        return studentService.getStudentsByName(name);
    }
```

| 說明 | 詳情 |
| --- | --- |
| URL | `GET /students/search?name=Judy` |
| `@RequestParam` | 搜尋條件放 query string（ch25 講過的慣例） |
| 整條鏈路 | Controller → Service → Dao → `findByName()` → JPA 自動產生 `WHERE name = ?` |

<!--
最後把自訂查詢方法也串起來。

GET /students/search?name=Judy 用 @RequestParam 接收搜尋條件——
搜尋、過濾放 query string，用 id 定位單筆才放 path，這是 ch25 講過的 REST 慣例。

整條鏈路走到底，最後一棒是 JPA 從方法名稱 findByName 自動產生的 SQL——全程沒有人寫過一行 SQL。
-->

---

# IN 查詢 — 串接 API

多個名字放 query string，逗號分隔，`@RequestParam` 自動轉成 `List<String>`：

```java
    @GetMapping("/students/search-by-names")
    public List<Student> getStudentsByNames(@RequestParam(name = "names") List<String> names) {
        return studentService.getStudentsByNames(names);
    }
```

| 說明 | 詳情 |
| --- | --- |
| URL 範例 | `GET /students/search-by-names?names=Alice,Bob` |
| 參數轉換 | `?names=Alice,Bob` 逗號分隔 → Spring 自動轉 `List<String>` |
| 整條鏈路 | Controller → Service → Dao → `findByNameIn()` → `WHERE name IN ('Alice', 'Bob')` |

<!--
IN 查詢的 API：?names=Alice,Bob 逗號分隔，Spring 自動轉成 List<String>，
和 ch25 的 ?ids=1,2 是同一招——搜尋條件放 query string。

整條鏈路：names 一路傳到 Dao 的 findByNameIn()，JPA 自動展開成 IN 語法，傳幾個名字就展開幾個佔位符。
-->

---

# 分頁 — 串接 API

前端在 URL 上決定「第幾頁、每頁幾筆」，一路傳到 `PageRequest.of()`：

```java
    @GetMapping("/students/page")
    public List<Student> getStudentPage(@RequestParam(name = "page") Integer page,
                                        @RequestParam(name = "size") Integer size) {
        return studentService.getStudentPage(page, size);
    }
```

| 說明 | 詳情 |
| --- | --- |
| URL 範例 | `GET /students/page?page=0&size=4` — 第 1 頁（從 **0** 開始）、每頁 4 筆 |
| 整條鏈路 | `?page=0&size=4` → Service → Dao → `PageRequest.of(0, 4)` → JPA 產生 `LIMIT` SQL |

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>前端要總頁數怎麼辦？</b> Controller 可以直接回傳 <code>Page&lt;Student&gt;</code>，Spring 轉出的 JSON 會包含 <code>content</code>（本頁資料）、<code>totalElements</code>（總筆數）、<code>totalPages</code>（總頁數）。
</div>

<!--
這就是分頁的完整應用——分頁參數是「前端的需求」，所以由前端在 URL 上決定：
?page=0&size=4 → Controller 的 @RequestParam → Service → Dao → PageRequest.of(0, 4) → JPA 產生 LIMIT/OFFSET 的 SQL。
記得頁碼從 0 開始：第 1 頁是 page=0。

補充：目前回傳 List<Student> 只給了本頁的資料，
但實務上前端做分頁 UI 還需要總頁數——這時 Controller 直接回傳 Page<Student> 即可，
Spring 會把 content、totalElements、totalPages 一起轉成 JSON 給前端。
-->

---

# 用 Postman 測試（1/2）— 基本查詢

先用上一章的 POST 新增幾筆資料，再測試前三個 GET API：

| 操作 | HTTP 方法 + URL | 預期結果 |
| --- | --- | --- |
| 查全部 | `GET /students` | `[{"id":1,"name":"Judy"},{"id":2,"name":"Tom"}]` |
| 查單筆 | `GET /students/1` | `{"id":1,"name":"Judy"}` — 單一物件，不是陣列 |
| 條件搜尋 | `GET /students/search?name=Judy` | `[{"id":1,"name":"Judy"}]` |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>觀察 console 的 SQL：</b> 打 <code>GET /students/search?name=Judy</code> 時，console 會印出 <code>select ... from student where name=?</code>——這條 SQL 是 JPA 從方法名稱 <code>findByName</code> 自動產生的。
</div>

<!--
先驗證三個基本查詢的鏈路。

查全部和 ch25 一樣回傳 JSON 陣列。
查單筆注意看：回傳的是 {"id":1,"name":"Judy"}，最外層是大括號不是中括號——這就是回傳型別從 List 改成 Student 的效果。
條件搜尋打 /students/search?name=Judy，console 會印出 JPA 自動產生的 SQL，
親眼確認「方法名稱就是 SQL」不是魔法，是框架在啟動時解析方法名稱產生的查詢。
-->

---

# 用 Postman 測試（2/2）— IN 查詢與分頁

再測試 IN 查詢和分頁，特別觀察分頁的 SQL：

| 操作 | HTTP 方法 + URL | 預期結果 |
| --- | --- | --- |
| IN 查詢 | `GET /students/search-by-names?names=Judy,Tom` | `[{"id":1,"name":"Judy"},{"id":2,"name":"Tom"}]` |
| 分頁 | `GET /students/page?page=0&size=1` | `[{"id":1,"name":"Judy"}]` — 只回第 1 頁的 1 筆 |
| 分頁（第 2 頁） | `GET /students/page?page=1&size=1` | `[{"id":2,"name":"Tom"}]` — 換 `page` 就換頁 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>觀察 console 的 SQL：</b> 打分頁 API 時，console 印出的 SQL 結尾有 <code>limit ?, ?</code>——<code>PageRequest.of(page, size)</code> 被 JPA 翻譯成 MySQL 的 <code>LIMIT</code> 語法。
</div>

<!--
再驗證 IN 查詢和分頁。

IN 查詢：?names=Judy,Tom 回傳兩筆，console 的 SQL 是 where name in (?, ?)。

分頁最值得玩：同樣的 size=1，page=0 回 Judy、page=1 回 Tom——
親眼看到「換 page 參數就換頁」的效果。
console 的 SQL 結尾有 limit ?, ?，這就是 PageRequest 被翻譯成 MySQL LIMIT 語法的證據，
資料庫只回傳那一頁的資料，而不是全撈回來再切。
-->

---

# Spring Data JPA vs Spring JDBC — 查詢比較

| 比較項目 | Spring JDBC | Spring Data JPA |
| --- | --- | --- |
| 查詢所有 | `query(sql, map, rowMapper)` | `findAll()` |
| 查詢單筆 | `query(sql+WHERE, map, rowMapper)` | `findById(id)` |
| 自訂條件查詢 | 手寫 SQL + map + RowMapper | 定義方法名稱，JPA 自動產生 SQL |
| 結果映射 | 需要手寫 RowMapper | JPA 自動映射，不需要 RowMapper |

<!--
用這張表格比較兩者的查詢方式。

Spring JDBC 每次查詢都要寫 SQL + RowMapper，程式碼較多但控制精確。
Spring Data JPA 大部分情況只需要呼叫方法或定義方法名稱，程式碼很少。

選哪個取決於需求：簡單 CRUD 首選 JPA，複雜的多表 JOIN 查詢 Spring JDBC 或原生 SQL 更合適。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| `findAll()` | 查詢所有資料，回傳 `List<Student>` |
| `findById(id)` | 查詢單筆，回傳 `Optional<Student>`，需用 `orElse()` 取值 |
| 自訂查詢方法 | 在 Repository 定義方法名稱，JPA 自動產生 SQL |
| 命名規則 | `findBy + 欄位名稱`，支援 And、Or、Between、In、OrderBy 等關鍵字 |
| 分頁查詢 | `findAll(PageRequest.of(page, size))`，回傳 `Page<T>`，頁碼從 0 開始 |
| 不需要 RowMapper | JPA 自動把查詢結果映射到 Java 物件 |
| 三層串接 | 五個 GET API：查全部、查單筆（回傳 `Student` 物件）、條件搜尋、IN 查詢、分頁（`?page=0&size=4`） |

<!--
今天的重點總結。

第一，findAll() 查詢所有資料，一行搞定，不需要 RowMapper。
第二，findById() 回傳 Optional，記得用 orElse() 取出 Student 物件。
第三，自訂查詢方法：方法名稱就是 SQL，Spring 自動實作。
第四，Spring Data JPA 最大的優勢：大幅減少程式碼，尤其是查詢操作。

學完上下篇，Spring Data JPA 的 CRUD 操作全部學完了！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
