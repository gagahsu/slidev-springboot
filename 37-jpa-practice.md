---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 實戰：用 JPA 打造完整的 CRUD API
routeAlias: ch37
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
    實戰：用 JPA 打造<br>完整的 CRUD API
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「PO、DTO、VO、DAO 各司其職，資料安全流動」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，我們已經學了 JPA 的 CRUD 操作，也學了 MVC 三層架構，以及 PO、DTO、VO、DAO 四種資料物件的概念。

今天要把這些全部整合在一起——用 JPA 打造一套完整的 CRUD API，並且正確地在每一層使用對應的資料物件。

學完之後，你的程式碼不只能跑，還符合業界標準的設計規範：資料安全流動、各層職責清楚。
-->

---
layout: default
---

# Outline

- **為什麼選擇 JPA？** — 三框架選擇時機比較
- **架構設計** — 整合 PO / DTO / DAO 的四層架構
- **Part 1：Entity（PO）** — Student @Entity，含敏感欄位
- **Part 2：Repository（DAO）** — JpaRepository，零行 SQL
- **Part 3：DTO 與 VO 設計** — CreateStudentRequest、StudentResponse、ScoreVO
- **Part 4：Service** — PO ↔ DTO 轉換、業務邏輯
- **Part 5：Controller** — 接收 Request DTO，回傳 Response DTO
- **練習題** — 自己動手整合完整架構

<!--
今天的重點不只是 JPA 的語法，而是「資料物件如何在各層之間正確流動」。

Entity（PO）只在 Repository 和 Service 之間流動。
Controller 和 Service 之間用 DTO 溝通。
這樣前端永遠看不到 password 等敏感欄位。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 前言

## 為什麼選擇 JPA？

<!--
先快速比較三種框架，確認今天為什麼選 JPA。
-->

---

# 三種框架的選擇時機

| 框架 | 適合場景 | 不適合場景 |
| --- | --- | --- |
| **Spring JDBC** | 需要最高性能、SQL 完全自訂 | 快速開發、欄位常變動 |
| **MyBatis** | 複雜 SQL（多 JOIN、動態條件）| 標準 CRUD、快速開發 |
| **Spring Data JPA** | 標準 CRUD、快速開發、欄位會變動 | 超複雜 SQL、高性能批次操作 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>今天的場景：</b> 標準 CRUD API，選 JPA——不需要寫 SQL，開發速度最快，最適合入門練習。
</div>

<!--
三個框架各有定位，沒有絕對的好壞。

Spring JDBC 最靈活，SQL 自己寫，但程式碼最多。
MyBatis SQL 自己寫，比 JDBC 簡潔，適合複雜查詢。
Spring Data JPA 不需要寫 SQL，開發速度最快，適合標準 CRUD。

今天我們要實作的是學生管理的標準 CRUD API，選 JPA 是最合理的選擇。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 架構設計

## 整合 PO / DTO / VO / DAO 的四層架構

<!--
在開始寫程式之前，先把整體架構和資料物件的位置釐清楚。
-->

---

# 四層架構中的資料物件位置

| 層次 | 類別 | Annotation | 使用的資料物件 |
| --- | --- | --- | --- |
| **Controller** | `StudentController` | `@RestController` | 接收 **Request DTO**，回傳 **Response DTO** |
| **Service** | `StudentService` | `@Service` | **Request DTO → PO**、**PO → Response DTO** 轉換；用 **VO** 封裝業務規則 |
| **Repository（DAO）** | `StudentRepository` | `@Repository` | 只操作 **PO（Entity）** |
| **Entity（PO）** | `Student` | `@Entity` | 對應資料庫 `student` 表格，包含所有欄位 |
| **VO** | `ScoreVO` | — | Service 層的值物件，封裝業務規則（驗證 + 計算字母等第） |

<!--
這張表格是今天最重要的概念。

Controller 和前端溝通時用 DTO：接收 Request DTO（前端傳來的資料），回傳 Response DTO（過濾過敏感欄位的資料）。

Service 是轉換中心：把 Request DTO 轉成 PO 存進資料庫，把 PO 轉成 Response DTO 回傳給前端。

Repository 只看得到 PO（Entity）——它負責資料庫操作，不需要知道 DTO 的存在。

Entity 就是 PO，包含資料庫的所有欄位，包括 password 等敏感資料。這些敏感欄位只在 Repository ↔ Service 之間流動，不會出現在 Controller 的回應裡。
-->

---

# 資料流動路徑

| 方向 | 資料流 |
| --- | --- |
| **新增（POST）** | 前端 JSON → **Request DTO** → Service 轉 **PO** → Repository save → Service 轉 **Response DTO** → 前端 |
| **查詢（GET）** | Repository findAll → **PO List** → Service 轉 **Response DTO List** → 前端 |
| **更新（PUT）** | 前端 JSON → **Request DTO** → Service 轉 **PO**（含 id）→ Repository save → **Response DTO** → 前端 |
| **刪除（DELETE）** | 前端傳 id → Service → Repository deleteById → 完成 |

<!--
把四個 CRUD 操作的資料流動路徑列清楚。

最重要的觀念：PO（Entity）永遠不應該出現在 Controller 的回傳值裡。

Controller 回傳的永遠是 Response DTO——因為 PO 可能包含 password 等敏感資料，直接回傳會造成安全漏洞。

Service 就是那個把 PO 「過濾」成 Response DTO 的地方。
-->

---

# 專案資料夾結構

```
src/main/java/com/example/demo/
├── entity/          → Student.java（PO）
├── repository/      → StudentRepository.java（DAO）
├── dto/
│   ├── request/     → CreateStudentRequest.java
│   └── response/    → StudentResponse.java
├── vo/              → ScoreVO.java
├── service/         → StudentService.java
└── controller/      → StudentController.java
src/main/resources/
└── application.properties
```

<!--
Java 套件通常依「職責」分資料夾，不是依「功能模組」——這是初學者常見的疑問。

entity 放 PO，repository 放 DAO，dto 底下再依方向分 request 和 response 兩個子資料夾，vo 放值物件，service 和 controller 各自一個資料夾。

application.properties 固定放在 src/main/resources/ 底下，這是 Spring Boot 的規定路徑，啟動時會自動讀取。
-->

---

# 資料夾與架構層對應

| 資料夾 | 放置檔案類型 | 對應架構層 |
| --- | --- | --- |
| `entity/` | `@Entity` 標註的 PO | Repository ↔ Service |
| `repository/` | `extends JpaRepository` 介面 | DAO 層 |
| `dto/request/`、`dto/response/` | Request DTO、Response DTO | Controller ↔ Service |
| `vo/` | 不可變值物件 | Service 層內部使用 |
| `service/` | `@Service` 商業邏輯與轉換 | 轉換中心 |
| `controller/` | `@RestController` | 對外 API 入口 |

<!--
檔案命名和資料夾一一對應：只要看到 CreateStudentRequest 在 dto/request/ 底下，就知道它是 Controller 接收前端資料用的。

這種依職責分資料夾的方式，讓同一層的類別集中在一起，符合今天教的四層架構。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## Entity（PO）— 對應資料庫表格

<!--
第一層：建立 Entity，也就是 PO。
-->

---

# Student Entity（PO）程式碼

```java
import jakarta.persistence.*;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String password; // DB 有，不應傳給前端
    private Integer score;
    // Getter 和 Setter（省略）
}
```

| 說明 | 詳情 |
| --- | --- |
| **PO 包含所有欄位** | 包括 `password` 等敏感資料 |
| **只在 Service ↔ Repository 流動** | 不能直接 return 給 Controller |

<!--
Student Entity 包含了資料庫表格的所有欄位，包括 password。

這就是為什麼我們需要 DTO：如果 Controller 直接 return Student（PO），前端就能看到所有人的密碼，這是嚴重的安全問題。

Entity 應該只在 Service 和 Repository 之間流動——從 Repository 查出來的 PO，在 Service 裡轉成 Response DTO，再往上給 Controller。

⚠️ Spring Boot 3.x / 4.x 的 JPA import 是 `jakarta.persistence.*`，不是 `javax.persistence.*`。
-->

---

# application.properties — JPA 設定

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/myjdbc?serverTimezone=Asia/Taipei&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=（你的 MySQL 密碼）
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

| 設定 | 說明 |
| --- | --- |
| `ddl-auto=update` | Entity 有新欄位，資料庫自動 ALTER TABLE（開發期間用） |
| `show-sql=true` | console 顯示 JPA 執行的 SQL，方便除錯 |

<!--
application.properties 的設定和第二十六章一樣，這裡快速複習。

`ddl-auto=update` 讓開發期間修改 Entity 欄位後，資料庫會自動同步，不需要手動 ALTER TABLE。

⚠️ 正式上線環境要把 ddl-auto 改成 validate 或 none，避免自動修改生產資料庫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## Repository（DAO）— 零行 SQL

<!--
第二層：建立 Repository，也就是 DAO。
-->

---

# StudentRepository 程式碼

```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository
        extends JpaRepository<Student, Integer> {
}
```

| 方法 | 說明 |
| --- | --- |
| `save(po)` | id=null → INSERT；id 有值 → UPDATE |
| `findAll()` | 回傳 `List<Student>`（PO List） |
| `findById(id)` | 回傳 `Optional<Student>` |
| `deleteById(id)` | DELETE WHERE id = ? |

<!--
Repository 是 DAO 層，繼承 JpaRepository 之後，不需要寫任何程式碼就擁有完整的 CRUD 方法。

注意這裡的回傳型別全都是 Student（PO）——findAll() 回傳 List<Student>，findById() 回傳 Optional<Student>。

這些 PO 不應該直接往上傳給 Controller，而是在 Service 層轉換成 Response DTO 後再傳出去。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## DTO 與 VO 設計

<!--
在寫 Service 之前，先設計好 DTO 和 VO 類別。
-->

---

# CreateStudentRequest — Request DTO

前端新增學生時傳入的格式：

```java
public class CreateStudentRequest {
    private String name;
    private String password;
    private Integer score;
    // Getter 和 Setter
}
```

| 設計決策 | 說明 |
| --- | --- |
| 不含 `id` | 主鍵由資料庫自動產生，前端不需要傳 |
| 含 `password` | 新增時需要設定密碼，但後端不會回傳 |
| 含 `score` | 前端傳入分數（0–100），由 ScoreVO 驗證 |

<!--
CreateStudentRequest 是前端發送 POST 請求時，Request Body 的格式。

它只包含前端應該傳入的欄位：name 和 password。
不包含 id（資料庫自動產生）。

Controller 用 @RequestBody CreateStudentRequest request 接住前端傳來的 JSON，然後把這個 Request DTO 傳給 Service 處理。
-->

---

# StudentResponse — Response DTO

後端回傳給前端的格式：

```java
public class StudentResponse {
    private Integer id;
    private String name;
    private Integer score;
    private String letterGrade; // 由 ScoreVO 計算（A/B/C/F）
    // Getter 和 Setter（刻意不含 password）
}
```

| 設計決策 | 說明 |
| --- | --- |
| 不含 `password` | **安全考量**：密碼不應暴露給前端 |
| 含 `id` | 前端查詢後需要知道這筆資料的 id |
| `letterGrade` | 由 Service 層的 ScoreVO 計算後填入 |

<!--
StudentResponse 是後端回傳給前端的物件格式。

最重要的設計決策：不包含 password。

即使 Student PO 有 password 欄位，我們在 Service 把 PO 轉成 StudentResponse 時，刻意不複製 password，這樣前端就永遠看不到密碼。

這就是「一個 PO，不同場景用不同 DTO」的核心價值。
-->

---

# ScoreVO — 用 VO 封裝業務規則

| 特性 | 說明 |
| --- | --- |
| **不可變** | `final` 欄位，只有 constructor，沒有 setter |
| **驗證內建** | 建構時驗證 0–100，超出範圍拋出例外 |
| **行為封裝** | `getLetterGrade()` 根據分數計算字母等第（A/B/C/F） |
| **使用層次** | Service 層；表達「值的概念」，不是資料傳輸用途 |
| **和 DTO 的差別** | DTO 用於傳輸資料；VO 用於封裝業務邏輯，強調不可變 |

<!--
VO 和 DTO 很容易搞混，關鍵差別是：

DTO 是「資料的容器」，有 getter 和 setter，目的是在層之間傳遞資料。
VO 是「值的概念」，是不可變的（final 欄位，沒有 setter），內建業務規則和行為。

ScoreVO 代表「一個合法的學生分數」——分數必須在 0 到 100 之間，而且可以告訴你它對應的字母等第。
一旦建立了 ScoreVO(85)，這個「85分」物件的值永遠不會被修改；如果要表示不同分數，就建立新的 ScoreVO。
-->

---

# ScoreVO 程式碼

```java
public class ScoreVO {
    private final Integer value;
    public ScoreVO(Integer value) {
        if (value < 0 || value > 100)
            throw new IllegalArgumentException("分數需在 0–100 之間");
        this.value = value;
    }
    public Integer getValue() { return value; }
    public String getLetterGrade() {
        if (value >= 90) return "A"; if (value >= 80) return "B";
        return value >= 70 ? "C" : "F";
    }
}
```

<!--
看 ScoreVO 的完整程式碼。

三個重點：
第一，`final` 欄位——value 一旦在 constructor 設定，就永遠不能改，這就是「不可變」。
第二，constructor 裡的驗證——建立 ScoreVO 時就確保分數合法，不需要在 Service 到處寫驗證邏輯。
第三，`getLetterGrade()` 方法——業務邏輯封裝在 VO 裡，Service 只需要呼叫，不需要自己寫 if-else 判斷等第。

⚠️ 沒有 setter 方法，外部無法修改 value——這是 VO 和一般 Java 物件最大的差別。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## Service — PO ↔ DTO 轉換中心

<!--
Service 是整個架構裡最複雜的一層，負責 PO 和 DTO 之間的轉換。
-->

---

# StudentService — 類別宣告與注入

```java
@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    // createStudent、getAllStudents、getStudentById、
    // updateStudent、deleteStudent、toResponse
    // 方法定義在後續投影片
}
```

<!--
Service 類別加上 @Service，讓 Spring 將它管理為 Bean。
@Autowired 注入 StudentRepository，後續所有方法都透過 studentRepository 操作資料庫。
-->

---

# toResponse — PO 轉 Response DTO

Service 裡建立一個私有的轉換方法：

```java
private StudentResponse toResponse(Student po) {
    ScoreVO scoreVO = new ScoreVO(po.getScore());
    StudentResponse resp = new StudentResponse();
    resp.setId(po.getId());
    resp.setName(po.getName());
    resp.setScore(scoreVO.getValue());
    resp.setLetterGrade(scoreVO.getLetterGrade()); // VO 計算等第
    return resp; // 刻意不複製 password
}
```

| 說明 | 詳情 |
| --- | --- |
| `ScoreVO` | 用 VO 驗證分數合法性並計算字母等第 |
| 略過 `password` | 敏感資料不複製進 Response DTO |

<!--
toResponse() 現在使用 ScoreVO。

第一步：建立 ScoreVO(po.getScore())——這一行同時完成兩件事：驗證分數在 0–100、準備計算字母等第。
第二步：把 id、name、score、letterGrade 填進 Response DTO，刻意不複製 password。

這就是 VO 在 Service 層的標準用法：把業務規則（分數驗證、等第計算）封裝在 VO 裡，Service 只需要建立 VO 並呼叫方法，邏輯集中、清晰。
-->

---

# createStudent — Request DTO → PO → save → Response DTO

```java
public StudentResponse createStudent(CreateStudentRequest req) {
    Student po = new Student();
    po.setName(req.getName());
    po.setPassword(req.getPassword());
    po.setScore(req.getScore());
    Student saved = studentRepository.save(po);
    return toResponse(saved);
}
```

| 步驟 | 說明 |
| --- | --- |
| 1. 建立 PO | `new Student()`，從 Request DTO 複製欄位 |
| 2. 存進資料庫 | `save(po)`，id=null 所以執行 INSERT |
| 3. 轉成 Response DTO | `toResponse(saved)`，過濾 password |

<!--
createStudent 展示了完整的 Request DTO → PO → Response DTO 流程。

第一步：建立一個空的 Student PO，把 Request DTO 裡的 name 和 password 複製進去。
第二步：呼叫 save() 存進資料庫，JPA 執行 INSERT 並回傳帶有自動產生 id 的 PO。
第三步：呼叫 toResponse() 把 PO 轉成 Response DTO，過濾掉 password，回傳給 Controller。

整個流程 Controller 只看到 Request DTO 和 Response DTO，永遠看不到含 password 的 PO。
-->

---

# getAllStudents 和 getStudentById

```java
public List<StudentResponse> getAllStudents() {
    List<Student> poList = studentRepository.findAll();
    List<StudentResponse> result = new ArrayList<>();
    for (Student po : poList) result.add(toResponse(po));
    return result;
}

public StudentResponse getStudentById(Integer id) {
    Student po = studentRepository.findById(id).orElse(null);
    return (po != null) ? toResponse(po) : null;
}
```

<!--
getAllStudents：從 Repository 取得 PO List，逐一用 toResponse() 轉換，回傳 Response DTO List。

getStudentById：用 findById() 取得 Optional<Student>，用 orElse(null) 轉成 Student，找不到時回傳 null，找到就轉成 Response DTO。

兩個方法的共同模式：從 Repository 拿到 PO → 轉成 Response DTO → 回傳。
-->

---

# updateStudent 和 deleteStudent

```java
public StudentResponse updateStudent(Integer id,
                                     CreateStudentRequest req) {
    Student po = new Student();
    po.setId(id);  // 有 id → JPA 執行 UPDATE
    po.setName(req.getName());
    po.setPassword(req.getPassword());
    po.setScore(req.getScore());
    return toResponse(studentRepository.save(po));
}

public void deleteStudent(Integer id) {
    studentRepository.deleteById(id);
}
```

<!--
updateStudent 和 createStudent 結構相同，差別是 po.setId(id)。

當 PO 的 id 有值，JPA 執行的是 UPDATE，不是 INSERT——這就是 save() 的雙重行為。
id 的來源是 Controller 從 URL 路徑（@PathVariable）取得的，不是前端 Request Body 裡的值。

deleteStudent 最簡單，直接呼叫 deleteById()，不需要轉換任何物件。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5

## Controller — 接收 DTO，回傳 DTO

<!--
最後一層：Controller 只和 DTO 打交道，永遠不直接碰 Entity（PO）。
-->

---

# StudentController — 完整類別宣告 + GET

```java
@RestController
public class StudentController {
    @Autowired
    private StudentService studentService;

    @GetMapping("/students")
    public List<StudentResponse> getAll() {
        return studentService.getAllStudents();
    }
}
```

<!--
Controller 最乾淨——它只負責接請求、呼叫 Service、回傳結果，完全不碰 PO。

@GetMapping("/students") 對應 GET /students，回傳 List<StudentResponse>，前端收到的 JSON 陣列裡每個物件只有 id 和 name，看不到 password。

注意回傳型別是 List<StudentResponse>，不是 List<Student>。這確保了 password 欄位不會暴露。
-->

---

# StudentController — POST 和 GET 單筆

```java
@PostMapping("/students")
public StudentResponse create(
        @RequestBody CreateStudentRequest req) {
    return studentService.createStudent(req);
}

@GetMapping("/students/{id}")
public StudentResponse getById(@PathVariable("id") Integer id) {
    return studentService.getStudentById(id);
}
```

<!--
POST /students：@RequestBody 接住前端傳來的 JSON，Jackson 自動轉成 CreateStudentRequest 物件，傳給 Service 處理，回傳 StudentResponse（不含 password）。

GET /students/{id}：@PathVariable 取出 URL 裡的 id，查詢單筆，同樣回傳 StudentResponse。

Controller 裡完全看不到 Student（PO），所有資料物件都是 DTO。
-->

---

# StudentController — PUT 和 DELETE

```java
@PutMapping("/students/{id}")
public StudentResponse update(
        @PathVariable("id") Integer id,
        @RequestBody CreateStudentRequest req) {
    return studentService.updateStudent(id, req);
}

@DeleteMapping("/students/{id}")
public void delete(@PathVariable("id") Integer id) {
    studentService.deleteStudent(id);
}
```

<!--
PUT /students/{id}：URL 的 id 決定更新哪筆，Request Body 是新的資料，同樣用 CreateStudentRequest 接收，回傳更新後的 StudentResponse。

DELETE /students/{id}：刪除指定 id 的學生，回傳 void，HTTP Status 自動是 200。

五個 API 全部完成，Controller 全程只接觸 DTO，確保 Entity（PO）不會洩漏到前端。
-->

---

# 完整 API 設計總覽

| HTTP Method | URL | 接收 | 回傳 |
| --- | --- | --- | --- |
| `GET` | `/students` | — | `List<StudentResponse>` |
| `GET` | `/students/{id}` | — | `StudentResponse` |
| `POST` | `/students` | `CreateStudentRequest` | `StudentResponse` |
| `PUT` | `/students/{id}` | `CreateStudentRequest` | `StudentResponse`  |
| `DELETE` | `/students/{id}` | — | `void` |

<!--
這張表格總覽五個 API 的輸入輸出格式。

觀察規律：所有回傳值都是 Response DTO（StudentResponse），前端永遠收不到含 password 的資料。
POST 和 PUT 的輸入都是 Request DTO（CreateStudentRequest），前端傳來的 id 欄位不被接受。

這就是用 DTO 設計 API 的安全性和清晰性。
-->

---

# Postman 測試 — GET／DELETE 該帶的參數

| API | URL | Body | 說明 |
| --- | --- | --- | --- |
| `GET` | `http://localhost:8080/students` | 無 | 不用帶任何參數 |
| `GET` | `http://localhost:8080/students/1` | 無 | `1` 是 id，帶在 URL 路徑上 |
| `DELETE` | `http://localhost:8080/students/1` | 無 | `1` 是 id，帶在 URL 路徑上 |

<!--
GET 和 DELETE 都不用帶 Body，差別只在 URL。

查全部不帶 id；查單筆、刪除單筆都把 id 放在 URL 路徑最後面，對應 Controller 的 @PathVariable。

這三個 API 在 Postman 裡最簡單——不用切換 Body 分頁，直接送出就好。
-->

---

# Postman 測試 — POST／PUT 該帶的參數

| API | URL | Body（raw / JSON） | 說明 |
| --- | --- | --- | --- |
| `POST` | `http://localhost:8080/students` | `{"name":"Tom","password":"1234","score":85}` | 不含 `id`，由資料庫自動產生 |
| `PUT` | `http://localhost:8080/students/1` | `{"name":"Tom","password":"1234","score":90}` | id 帶在 URL，Body 不用再帶 id |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Postman 設定重點：</b> Body → raw → JSON，並在 Headers 確認 <code>Content-Type: application/json</code>。
</div>

<!--
POST 新增時，Body 選 raw、格式選 JSON，貼上 name、password、score 三個欄位，不能帶 id，因為 id 是資料庫自動產生的，前端傳了也會被忽略。

PUT 更新時，id 放在 URL 路徑，不是 Body 裡；Body 一樣是 name、password、score 三個欄位，代表更新後的新值。

⚠️ 最容易忘記設定的地方：Postman 的 Headers 要有 Content-Type: application/json，不然 Spring 會讀不到 @RequestBody 的內容。
-->

---
layout: default
---

# 練習：課程管理 CRUD API
### 任務說明

用 JPA 四層架構 + DTO 設計，實作「課程（Course）」CRUD API：

| 類別 | 欄位 | 說明 |
| --- | --- | --- |
| **Course（PO）** | id, name, credit, teacherPassword | 含敏感欄位 |
| **CreateCourseRequest** | name, credit | 不含 id、不含密碼 |
| **CourseResponse** | id, name, credit | 不含 teacherPassword |

**目標 API：** GET `/courses`、POST `/courses`、DELETE `/courses/{id}`

<!--
練習題把今天學的完整架構都用到了：Entity（PO）、Request DTO、Response DTO、Repository、Service、Controller。

最重要的練習重點是：Course PO 有 teacherPassword 欄位，但 CourseResponse 刻意不包含它，這樣前端拿到的課程資料就不含密碼。
-->

---
layout: default
---

# 練習：解題步驟
### 提示說明

| 步驟 | 要建立的類別 | 關鍵重點 |
| --- | --- | --- |
| 1 | `Course`（PO） | `@Entity`、含 `teacherPassword` 欄位 |
| 2 | `CreateCourseRequest`（DTO） | 只含 `name`、`credit`，不含 `id` |
| 3 | `CourseResponse`（DTO） | 只含 `id`、`name`、`credit`，不含 `teacherPassword` |
| 4 | `CourseRepository` | `extends JpaRepository<Course, Integer>` |
| 5 | `CourseService` | `toResponse()`、`createCourse()`、`getAllCourses()` |
| 6 | `CourseController` | 全程只用 DTO，不直接碰 PO |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>驗證方式：</b> POST 新增課程後，GET 查詢，確認回應 JSON 裡沒有 <code>teacherPassword</code> 欄位。
</div>

<!--
解題的核心心法：從 Entity（最底層）往上建，每一層都想清楚「我用的是 PO 還是 DTO？」

建完 Service 之後，重點驗證：用 Postman 發 POST 新增一筆課程，再 GET 查詢，確認回應的 JSON 只有 id、name、credit，沒有 teacherPassword——這才算真正完成了資料安全設計。
-->

---

# 練習解答：Entity（PO）

```java
@Entity
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Integer credit;
    private String teacherPassword; // DB 有，不應傳給前端
    // Getter 和 Setter（省略）
}
```

| 說明 | 詳情 |
| --- | --- |
| **含 `teacherPassword`** | 敏感欄位，只在 Repository ↔ Service 流動 |
| **不能直接 return** | 不可讓 Controller 直接回傳這個 PO |

<!--
Course PO 對應資料庫的 course 表格，包含所有欄位，包括 teacherPassword。這個欄位不能出現在 Controller 回傳給前端的資料裡。
-->

---

# 練習解答：DTO

```java
public class CreateCourseRequest {
    private String name;
    private Integer credit;
    // Getter 和 Setter
}
```

```java
public class CourseResponse {
    private Integer id;
    private String name;
    private Integer credit;
    // Getter 和 Setter（刻意不含 teacherPassword）
}
```

<!--
CreateCourseRequest 不含 id 和 teacherPassword，前端新增課程時只傳 name、credit。
CourseResponse 不含 teacherPassword，這就是這題的核心考點——PO 裡有的敏感欄位，Response DTO 刻意不複製。
-->

---

# 練習解答：Repository（DAO）

```java
@Repository
public interface CourseRepository
        extends JpaRepository<Course, Integer> {
}
```

<!--
繼承 JpaRepository 即可，不需要寫任何方法，save()、findAll()、deleteById() 全部內建。
-->

---

# 練習解答：Service — toResponse 與 createCourse

```java
@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    private CourseResponse toResponse(Course po) {
        CourseResponse resp = new CourseResponse();
        resp.setId(po.getId());
        resp.setName(po.getName());
        resp.setCredit(po.getCredit());
        return resp; // 刻意不複製 teacherPassword
    }

    public CourseResponse createCourse(CreateCourseRequest req) {
        Course po = new Course();
        po.setName(req.getName());
        po.setCredit(req.getCredit());
        Course saved = courseRepository.save(po);
        return toResponse(saved);
    }
}
```

<!--
toResponse() 是安全設計的核心——把 PO 轉成 Response DTO 時，刻意不複製 teacherPassword。
createCourse 走 Request DTO → PO → save → Response DTO 的標準流程，跟 Student 的 createStudent 結構完全一樣。
-->

---

# 練習解答：Service — getAllCourses 與 deleteCourse

```java
public List<CourseResponse> getAllCourses() {
    List<Course> poList = courseRepository.findAll();
    List<CourseResponse> result = new ArrayList<>();
    for (Course po : poList) result.add(toResponse(po));
    return result;
}

public void deleteCourse(Integer id) {
    courseRepository.deleteById(id);
}
```

<!--
getAllCourses：從 Repository 取得 PO List，逐一轉成 Response DTO List，回傳給 Controller。
deleteCourse：最單純，直接呼叫 deleteById()，不需要轉換任何物件。
-->

---

# 練習解答：Controller

```java
@RestController
public class CourseController {
    @Autowired
    private CourseService courseService;

    @GetMapping("/courses")
    public List<CourseResponse> getAll() {
        return courseService.getAllCourses();
    }

    @PostMapping("/courses")
    public CourseResponse create(
            @RequestBody CreateCourseRequest req) {
        return courseService.createCourse(req);
    }

    @DeleteMapping("/courses/{id}")
    public void delete(@PathVariable("id") Integer id) {
        courseService.deleteCourse(id);
    }
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ Controller 全程只接觸 DTO，GET /courses 回傳的 JSON 陣列裡每個物件都沒有 teacherPassword。
</div>

<!--
三個 API 全部完成：GET 查全部、POST 新增、DELETE 刪除，Controller 只看得到 DTO，Course PO 的 teacherPassword 全程不外洩。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 選 JPA | 標準 CRUD、不需要寫 SQL、開發最快 |
| Entity = PO | 對應資料庫表格，含所有欄位，只在 Repository ↔ Service 流動 |
| Request DTO | 前端傳入的格式，去掉 id 和自動產生欄位 |
| Response DTO | 前端收到的格式，去掉 password 等敏感欄位 |
| VO（ScoreVO） | Service 層的值物件，`final` 欄位、無 setter，封裝驗證和業務計算 |
| Service 轉換 | `toResponse(PO)` 用 VO 計算業務值，並過濾敏感資料 |
| Controller | 全程只接觸 DTO，永遠不直接回傳 PO |

<!--
今天的重點總結。

第一，選 JPA：標準 CRUD 場景最適合，不需要寫 SQL。
第二，四層架構：Entity → Repository → Service → Controller，單向呼叫，不跨層。
第三，資料物件分工：Entity（PO）只在 Service 以下，DTO 是 Controller 和 Service 之間的介面。
第四，Service 的 toResponse() 是整個安全設計的核心——它決定哪些欄位可以傳給前端。
第五，Controller 全程只和 DTO 打交道，確保 password 等敏感資料不會洩漏。

這個架構就是業界 Spring Boot 後端開發的標準模式！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
