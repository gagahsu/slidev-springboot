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

# 練習：建立正式專案 dynamic-survey

從這個練習開始，我們不再用練習用的 `demo` 專案，而是建立**整個課程的正式專案**。到 https://start.spring.io 依下表設定：

| 欄位 | 選擇值 |
| --- | --- |
| Project / Language | **Gradle - Groovy** / **Java** |
| Spring Boot | **4.1.1**（不要選 SNAPSHOT） |
| Group / Artifact | `com.example` / `dynamic-survey` |
| Package name | `com.example.survey` |
| Java / Packaging | **21** / **Jar** |
| Dependencies | Spring Web、Spring Data JPA、MySQL Driver、Lombok |

`application.properties`：

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這個練習開始，我們要建立整個課程的正式專案，名字叫 dynamic-survey。前面的 demo 專案是練習用的，可以留著當參考，但之後的章節都在這個新專案裡累積程式碼，最後第 47 章會把它整合起來驗收。

Initializr 的設定跟第 3 章一樣，只是 Artifact 換成 dynamic-survey，Package name 是 com.example.survey。依賴選四個：Spring Web、Spring Data JPA、MySQL Driver 和 Lombok。後面的章節需要 Validation、Security 的時候，再回來 build.gradle 加。
-->

---
layout: default
---

# 練習：建立正式專案 dynamic-survey（續）

```properties
spring.application.name=dynamic-survey
spring.datasource.url=jdbc:mysql://localhost:3306/dynamic_survey?serverTimezone=Asia/Taipei&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=（你的 MySQL 密碼）
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
application.properties 有兩個值得講的地方。第一，ddl-auto 是 validate：資料庫的表已經在 MySQL 課建好了，Hibernate 只負責驗證 Entity 跟表對不對得上。第二，open-in-view 設成 false：這是 Spring Boot 預設會開的一個功能，讓 Entity 的延遲載入可以撐到 Controller 層，聽起來方便，但會讓資料庫連線被佔用太久，也讓「Entity 不能出 Service 層」這個原則被模糊掉。我們關掉它，強迫自己在 Service 裡就把資料轉成 DTO。

⚠️ 執行之前，先確認 MySQL 已經跑過 schema.sql 和 seed.sql。
-->

---
layout: default
---

# 練習：動態問卷 CRUD API

用 JPA 四層架構 + DTO 設計，實作問卷（Survey）的查詢、新增、修改、批次刪除：

| 類別 | 說明 |
| --- | --- |
| **Survey / Question / Option（PO）** | 對應 `surveys`、`questions`、`options` 三張表；一份問卷有多題，一題有多個選項 |
| **SurveyDTO / QuestionDTO / OptionDTO** | 前端看到的格式，選項是**陣列**；`SurveyDTO` 多了計算出來的 `status` |
| **SurveyStatus（enum）** | 由 `published` + 日期算出「未發佈 / 尚未開始 / 進行中 / 已結束」 |
| **SurveyRepository** | 沿用 ch28 的 `search`（標題、日期區間、分頁） |
| **SurveyService** | `search`、`get`、`save`、`deleteAll`、PO ↔ DTO 轉換 |

**目標 API：** 前台 `GET /api/surveys`；後台 `GET /api/admin/surveys`、`GET /api/admin/surveys/{id}`、`POST` / `PUT /api/admin/surveys/{id}`、`DELETE /api/admin/surveys`

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這一題把這章學的完整架構全部用上：Entity（PO）、DTO、Repository、Service、Controller，而且是真正的問卷系統會用到的 API。

有三個重點要注意。第一，問卷和題目、題目和選項是一對多的關係，儲存的時候要用 cascade 一次存好，不要自己一筆一筆存。第二，狀態這個欄位在資料庫裡沒有，是 Service 在轉換 DTO 的時候，用 SurveyStatus 即時計算出來的，這跟本章的 ScoreVO 是同樣的概念：業務規則封裝在一個物件裡。第三，修改和刪除的限制，是後端的責任，即使前端把按鈕藏起來，有人直接打 API 也不能通過。
-->

---
layout: default
---

# 練習：動態問卷 CRUD API（續）

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 只有「未發佈」與「尚未開始」的問卷可以修改、刪除；進行中與已結束的不行。這條規則要寫在 Service，不能只靠前端擋。
</div>

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
API 路徑刻意用 /api/admin/ 和 /api/ 分開，前台只能看到已發佈的，後台看得到全部。現在還沒有登入功能，所以先不設權限，第 44 章學了 Spring Security 之後，再把 /api/admin/** 保護起來。
-->

---
layout: default
---

# 練習：解題步驟

| 步驟 | 要建立的類別 | 關鍵重點 |
| --- | --- | --- |
| 1 | `Survey`、`Question`、`Option`（PO） | `@OneToMany(cascade = ALL, orphanRemoval = true)`、`@OrderBy` |
| 2 | `SurveyStatus`（enum） | `of(published, start, end, today)`、`isEditable()` |
| 3 | 三個 DTO | 選項是 `List<OptionDTO>`；`SurveyDTO` 有 `status`、`statusLabel` |
| 4 | `SurveyRepository` | ch28 的 `search` 方法（加一個 `publishedOnly` 參數） |
| 5 | `SurveyService` | `Page.map` 轉 DTO、`save` 重建題目、`deleteAll` 檢查狀態 |
| 6 | `SurveyController` | 全程只用 DTO，不直接碰 PO |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>驗證方式：</b> Postman 新增一份問卷（含兩題），GET 取回確認題目與選項都在；再 PUT 修改、DELETE 刪除。對進行中的問卷 PUT / DELETE 應該失敗。
</div>

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
解題的核心心法：從 Entity（最底層）往上建，每一層都想清楚「我用的是 PO 還是 DTO？」

建議的順序是：先把三個 Entity 建好，啟動專案，看 Hibernate 的 validate 有沒有通過，這一步就能抓出所有欄位名稱、型別對不上的問題。接著寫 SurveyStatus，用單元測試或是 main 方法，先確認狀態計算是對的，這個邏輯是整個系統的核心。然後才是 DTO、Repository、Service、Controller。

最後用 Postman 驗證。特別要測的是：新增一份有兩題的問卷，再 GET 回來，確認選項有出現、順序是對的；然後測試修改與刪除的限制。
-->

---
layout: default
---

# 練習解答：Entity — Survey
### `entity/Survey.java`

```java
@Entity
@Table(name = "surveys")
@Getter
@Setter
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    @JdbcTypeCode(SqlTypes.TINYINT)
    private Boolean published;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<Question> questions = new ArrayList<>();
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
Survey 是三個 Entity 的最上層。幾個重點：

第一，@OneToMany(mappedBy = "survey", cascade = ALL, orphanRemoval = true)：mappedBy 表示外鍵在 Question 那邊，Survey 只是「反向」的關聯。cascade = ALL 讓我們儲存 Survey 的時候，底下的 Question 一起存；orphanRemoval = true 則是當我們把題目從 List 移除時，資料庫裡對應那一列會被刪除，而不是留下孤兒。

第二，@OrderBy("orderIndex ASC")：關聯資料庫本身不保證順序，所以要用這個註解，確保取出來的題目順序，跟使用者編輯的順序一致。

第三，published 用 @JdbcTypeCode(SqlTypes.TINYINT)。資料庫欄位是 TINYINT，Java 型別用 Boolean，這行讓 Hibernate 用 TINYINT 來對應，validate 才會通過。

⚠️ 易錯點：Entity 不要用 @Data。@Data 會產生 equals、hashCode 和 toString，在有雙向關聯的時候，會互相呼叫而造成無窮迴圈。我們只用 @Getter 和 @Setter。
-->

---
layout: default
---

# 練習解答：Entity — Question 與 Option

```java
@Entity
@Table(name = "questions")
@Getter
@Setter
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "survey_id")
    private Survey survey;

    private String title;

    @Enumerated(EnumType.STRING)
    private QuestionType type;

    @JdbcTypeCode(SqlTypes.TINYINT)
    private Boolean required;

    private Integer orderIndex;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<Option> options = new ArrayList<>();
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
Question 和 Option 的結構很像，都是「多」的那一邊：用 @ManyToOne 指回上一層，@JoinColumn 指定外鍵欄位名稱，fetch = LAZY 表示需要的時候才去載入，不要每次都一起撈。

Question 的 type 用 @Enumerated(EnumType.STRING)，資料庫存的是字串 SINGLE、MULTI、TEXT。如果沒有指定 STRING，預設是存列舉的順序編號 0、1、2，之後只要調整列舉的宣告順序，資料就全部錯亂，所以一定要記得寫 STRING。
-->

---
layout: default
---

# 練習解答：Entity — Question 與 Option（續）

```java
@Entity
@Table(name = "options")
@Getter
@Setter
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id")
    private Question question;

    private String label;
    private Integer orderIndex;
}
```

```java
public enum QuestionType {
    SINGLE, MULTI, TEXT
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這裡的 optional = false，表示這個關聯一定要有值，Hibernate 會在存進去之前就先檢查，而不是等到資料庫報錯。

Question 底下還有 Option 的 @OneToMany，一樣有 cascade 和 orphanRemoval。所以從 Survey 一路往下存，三層會一次存完。
-->

---
layout: default
---

# 練習解答：SurveyStatus — 狀態計算
### `entity/SurveyStatus.java`

```java
/** 問卷狀態：由 published + 日期計算，不存進資料庫。 */
@Getter
public enum SurveyStatus {
    DRAFT("未發佈"),
    NOT_STARTED("尚未開始"),
    ONGOING("進行中"),
    ENDED("已結束");

    private final String label;

    SurveyStatus(String label) {
        this.label = label;
    }

// ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這個列舉就是「狀態不存資料庫，即時計算」的實作。
-->

---
layout: default
---

# 練習解答：SurveyStatus — 狀態計算（續）
### `entity/SurveyStatus.java`

```java
    // ... 接上一頁

    public static SurveyStatus of(boolean published, LocalDate start, LocalDate end, LocalDate today) {
        if (!published) return DRAFT;
        if (today.isBefore(start)) return NOT_STARTED;
        if (!today.isAfter(end)) return ONGOING;
        return ENDED;
    }

    /** 後台只有這兩種狀態可以修改、刪除 */
    public boolean isEditable() {
        return this == DRAFT || this == NOT_STARTED;
    }

    // ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
of() 方法有先後順序：先看有沒有發佈，沒發佈就是 DRAFT；發佈了，再看今天是不是還沒到開始日期；沒到就是 NOT_STARTED；然後看今天是不是沒超過結束日期，沒超過就是 ONGOING，包含結束日期當天；否則就是 ENDED。這跟 MySQL 課寫的 CASE 完全是同一個邏輯。

today 是從外面傳進來的參數，而不是在方法裡面呼叫 LocalDate.now()。這樣做的好處是可以測試：單元測試的時候，我們可以傳入固定的日期，測試結果才穩定。這個技巧在第 41 章寫測試的時候會用到。
-->

---
layout: default
---

# 練習解答：SurveyStatus — 狀態計算（續）
### `entity/SurveyStatus.java`

```java
// ... 接上一頁

    /** 進行中、已結束才有統計與回饋 */
    public boolean hasResult() {
        return this == ONGOING || this == ENDED;
    }
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
isEditable() 和 hasResult() 把「哪些狀態可以修改」「哪些狀態有統計」這種業務規則，收在同一個地方。之後 Service 只要問 status.isEditable()，不需要到處寫 if。
-->

---
layout: default
---

# 練習解答：DTO — 選項是陣列

```java
@Getter
@Setter
public class SurveyDTO {
    private Integer id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean published;
    private String status;       // 由 Service 計算：DRAFT / NOT_STARTED / ONGOING / ENDED
    private String statusLabel;  // 未發佈 / 尚未開始 / 進行中 / 已結束
    private List<QuestionDTO> questions = new ArrayList<>();
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
SurveyDTO 是前端看到的格式。跟 Survey Entity 比較，有三個差別：

第一，多了 status 和 statusLabel 兩個欄位。它們在資料庫裡沒有，是 Service 算出來的，前端不需要自己再算一次。
-->

---
layout: default
---

# 練習解答：DTO — 選項是陣列（續）

```java
@Getter
@Setter
public class QuestionDTO {
    private Integer id;
    private String title;
    private QuestionType type;
    private boolean required;
    private List<OptionDTO> options = new ArrayList<>(); // 選項是「陣列」
}
```

```java
@Getter
@Setter
public class OptionDTO {
    private Integer id;
    private String label;
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
第二，題目跟選項都是 List，這就是需求文件裡說的「選項用陣列」。JSON 會長得像 options 是一個陣列，每個元素有 id 跟 label。

第三，DTO 裡完全沒有 Survey 指向 Question 的反向關聯，所以轉成 JSON 的時候不會有無窮迴圈。這就是為什麼我們不直接把 Entity 回傳給前端。

這裡的 DTO 先不加任何驗證註解，下一章 Validation 會回來補上「標題必填、最多 50 字」這類規則。
-->

---
layout: default
---

# 練習解答：Repository — 沿用 ch28 的 search
### `repository/SurveyRepository.java`

```java
public interface SurveyRepository extends JpaRepository<Survey, Integer> {

    // 標題模糊搜尋 + 起訖日期「包含在區間內」，三個條件都可省略
    @Query("""
            select s from Survey s
            where (:title is null or s.title like concat('%', :title, '%'))
              and (:start is null or s.startDate >= :start)
              and (:end is null or s.endDate <= :end)
              and (:publishedOnly = false or s.published = true)
            """)
    Page<Survey> search(@Param("title") String title,
                        @Param("start") LocalDate start,
                        @Param("end") LocalDate end,
                        @Param("publishedOnly") boolean publishedOnly,
                        Pageable pageable);
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
Repository 就是 ch28 的 search 方法。跟 ch28 只差一個地方：多了一個 publishedOnly 參數。前台呼叫的時候傳 true，只看已發佈的問卷；後台傳 false，看全部。

JPQL 裡寫 (:publishedOnly = false or s.published = true)，意思是：如果 publishedOnly 是 false，這個條件恆為真，等於不篩選；如果是 true，才要求 published = true。

繼承 JpaRepository 之後，findById、findAllById、save、deleteAll 都是現成的，不需要再寫。

回傳 Page<Survey> 而不是 List，Spring Data 會自動加上 limit 跟 offset，再多執行一次 count 查詢，所以有總筆數跟總頁數。
-->

---
layout: default
---

# 練習解答：Service（1/3）— 查詢
### `service/SurveyService.java`

```java
@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;

    // ---------- 查詢 ----------
    @Transactional(readOnly = true)
    public Page<SurveyDTO> search(String title, LocalDate start, LocalDate end,
                                  boolean publishedOnly, int page, int size) {
        String keyword = (title == null || title.isBlank()) ? null : title.trim();
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return surveyRepository.search(keyword, start, end, publishedOnly, pageable)
                .map(s -> toDTO(s, false));   // Page.map：保留分頁資訊，只轉換內容
    }

// ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
Service 的第一部分是查詢。

search 方法回傳 Page<SurveyDTO>。重點是 Page.map：它會保留分頁資訊，包括總筆數和總頁數，只把裡面的內容從 Survey 轉成 SurveyDTO。這樣就不需要自己重新組一個分頁物件。列表頁不需要題目，所以 toDTO 的第二個參數傳 false，避免多執行一堆不必要的查詢。
-->

---
layout: default
---

# 練習解答：Service（1/3）— 查詢（續）
### `service/SurveyService.java`

```java
// ... 接上一頁

    @Transactional(readOnly = true)
    public SurveyDTO get(Integer id) {
        return toDTO(findOrThrow(id), true);
    }

    private Survey findOrThrow(Integer id) {
        return surveyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("找不到問卷 " + id));
    }

    private SurveyStatus statusOf(Survey s) {
        return SurveyStatus.of(s.getPublished(), s.getStartDate(), s.getEndDate(), LocalDate.now());
    }
    // ... 新增、修改、刪除見下一頁
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
get 方法載入單一份問卷，包含所有題目跟選項，給編輯頁跟填寫頁使用。

@Transactional(readOnly = true) 有兩個作用：一是告訴 JPA 這是唯讀查詢，效能比較好；二是保證延遲載入（LAZY）的題目跟選項，在這個方法結束之前都能讀到，因為我們把 open-in-view 關掉了。如果沒加這個註解，讀 survey.getQuestions() 時會發生 LazyInitializationException。

findOrThrow 是私有的小工具，找不到就丟例外。目前先用 IllegalArgumentException，第 39 章會換成自訂的業務例外。
-->

---
layout: default
---

# 練習解答：Service（2/3）— 新增與修改

```java
public class SurveyService {
    // ... 接上一頁

    // ---------- 新增 / 修改 ----------
    @Transactional
    public SurveyDTO save(SurveyDTO dto, boolean publish) {
        Survey survey = (dto.getId() == null) ? new Survey() : findOrThrow(dto.getId());
        if (survey.getId() != null && !statusOf(survey).isEditable()) {
            throw new IllegalStateException("問卷已開始，無法修改");
        }
        survey.setTitle(dto.getTitle());
        survey.setDescription(dto.getDescription());
        survey.setStartDate(dto.getStartDate());
        survey.setEndDate(dto.getEndDate());
        survey.setPublished(publish);

// ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
save 同時負責新增和修改：DTO 的 id 是 null 就是新增，否則就是修改。

修改的時候，先檢查這份問卷現在的狀態，不是「未發佈」或「尚未開始」就不能改，直接丟例外。這個檢查一定要放在後端。
-->

---
layout: default
---

# 練習解答：Service（2/3）— 新增與修改（續）

```java
        // ... 接上一頁

        survey.getQuestions().clear();          // orphanRemoval：舊題目與選項會被刪除
        int qIndex = 1;
        for (QuestionDTO qd : dto.getQuestions()) {
            Question q = new Question();
            q.setSurvey(survey);
            q.setTitle(qd.getTitle());
            q.setType(qd.getType());
            q.setRequired(qd.isRequired());
            q.setOrderIndex(qIndex++);
            int oIndex = 1;
            for (OptionDTO od : qd.getOptions()) {
                Option o = new Option();
                o.setQuestion(q);
                o.setLabel(od.getLabel());
                o.setOrderIndex(oIndex++);
                q.getOptions().add(o);
            }

        // ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
接下來是這個方法最關鍵的技巧：不管是新增還是修改，題目和選項一律「整批重建」。先用 survey.getQuestions().clear() 清空，因為設定了 orphanRemoval，被移除的舊題目和選項，儲存的時候會被刪除；再根據 DTO 一題一題建立新的，並設定 orderIndex，讓順序固定。最後呼叫一次 save，因為 cascade，所有題目和選項都會一起存進去。
-->

---
layout: default
---

# 練習解答：Service（2/3）— 新增與修改（續）

```java
// ... 接上一頁

            survey.getQuestions().add(q);
        }
        return toDTO(surveyRepository.save(survey), true);   // cascade：題目、選項一起存
    }
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
為什麼不逐題比對、只更新有變動的？因為問卷在「尚未開始」的狀態時，還沒有任何人作答，題目重建不會影響到既有的資料，整批重建的程式碼最簡單，也最不容易出錯。

⚠️ 易錯點：一定要設定 q.setSurvey(survey) 和 o.setQuestion(q)。@OneToMany 的 mappedBy 那一端只是「鏡子」，真正決定外鍵值的是 @ManyToOne 那一端，如果漏掉，survey_id 會是 null，儲存時報錯。
-->

---
layout: default
---

# 練習解答：Service（3/3）— 批次刪除與 PO → DTO

```java
public class SurveyService {
    // ... 接上一頁

    // ---------- 批次刪除 ----------
    @Transactional
    public void deleteAll(List<Integer> ids) {
        List<Survey> surveys = surveyRepository.findAllById(ids);
        for (Survey s : surveys) {
            if (!statusOf(s).isEditable()) {
                throw new IllegalStateException("「" + s.getTitle() + "」已開始，無法刪除");
            }
        }
        surveyRepository.deleteAll(surveys);
    }

// ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
deleteAll 是批次刪除。規則是：只要勾選的問卷裡，有任何一份不是「未發佈」或「尚未開始」，整批都不刪。因為整個方法是一個交易，丟出例外的時候，還沒刪的就不會刪，不會出現「刪了一半」的情況。
-->

---
layout: default
---

# 練習解答：Service（3/3）— 批次刪除與 PO → DTO（續）

```java
    // ... 接上一頁

    // ---------- PO → DTO ----------
    private SurveyDTO toDTO(Survey s, boolean withQuestions) {
        SurveyDTO dto = new SurveyDTO();
        dto.setId(s.getId());
        dto.setTitle(s.getTitle());
        dto.setDescription(s.getDescription());
        dto.setStartDate(s.getStartDate());
        dto.setEndDate(s.getEndDate());
        dto.setPublished(s.getPublished());
        SurveyStatus status = statusOf(s);             // 狀態不存資料庫，即時計算
        dto.setStatus(status.name());
        dto.setStatusLabel(status.getLabel());
        if (withQuestions) {
            for (Question q : s.getQuestions()) {
                QuestionDTO qd = new QuestionDTO();

    // ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
刪除一份問卷的時候，它底下的題目和選項，因為 Entity 上的 cascade，會一起被刪掉；資料庫端也有 ON DELETE CASCADE 當作雙重保障。

toDTO 是整個安全設計的核心：把 PO 轉成 DTO 的時候，我們決定哪些欄位可以給前端看，並且在這裡計算狀態。
-->

---
layout: default
---

# 練習解答：Service（3/3）— 批次刪除與 PO → DTO（續）

```java
// ... 接上一頁

                qd.setId(q.getId());
                qd.setTitle(q.getTitle());
                qd.setType(q.getType());
                qd.setRequired(q.getRequired());
                for (Option o : q.getOptions()) {
                    OptionDTO od = new OptionDTO();
                    od.setId(o.getId());
                    od.setLabel(o.getLabel());
                    qd.getOptions().add(od);
                }
                dto.getQuestions().add(qd);
            }
        }
        return dto;
    }
}
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這段程式碼寫得比較長，但是每一段都很單純：複製欄位、計算狀態、有需要的話，逐題逐選項複製。之後在 Spring 有一些工具，像 MapStruct，可以幫忙自動產生這類轉換，但是在學習階段，手寫可以讓大家清楚看到資料是怎麼流動的。
-->

---
layout: default
---

# 練習解答：Controller — 前台與後台

```java
@RestController
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    // ===== 前台：只看已發佈的問卷 =====
    @GetMapping("/api/surveys")
    public Page<SurveyDTO> list(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return surveyService.search(title, startDate, endDate, true, page, size);
    }

// ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
Controller 很薄，只做三件事：接收參數、呼叫 Service、回傳結果。所有的判斷都在 Service。
-->

---
layout: default
---

# 練習解答：Controller — 前台與後台（續）

```java
    // ... 接上一頁

    // ===== 後台：全部狀態都看得到，可新增、修改、批次刪除 =====
    @GetMapping("/api/admin/surveys")
    public Page<SurveyDTO> adminList(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return surveyService.search(title, startDate, endDate, false, page, size);
    }

    @GetMapping("/api/admin/surveys/{id}")
    public SurveyDTO get(@PathVariable("id") Integer id) {
        return surveyService.get(id);
    }

    // ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
前台和後台的差別，只在於傳給 Service 的 publishedOnly：前台傳 true，後台傳 false。路徑用 /api/surveys 和 /api/admin/surveys 分開，之後在 Spring Security 章節，我們只要規定 /api/admin/** 要有管理員角色，就能保護整個後台。
-->

---
layout: default
---

# 練習解答：Controller — 前台與後台（續）

```java
    // ... 接上一頁

    @PostMapping("/api/admin/surveys")
    public SurveyDTO create(@RequestBody SurveyDTO dto,
                            @RequestParam(name = "publish", defaultValue = "false") boolean publish) {
        dto.setId(null);
        return surveyService.save(dto, publish);
    }

    @PutMapping("/api/admin/surveys/{id}")
    public SurveyDTO update(@PathVariable("id") Integer id, @RequestBody SurveyDTO dto,
                            @RequestParam(name = "publish", defaultValue = "false") boolean publish) {
        dto.setId(id);
        return surveyService.save(dto, publish);
    }

    // ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
修改的時候，路徑上的 id 是唯一可信的 id，所以我們用 dto.setId(id) 覆蓋 body 裡可能亂傳的 id；新增的時候則相反，把 id 清成 null，避免有人偷偷傳 id 進來，結果變成修改。

批次刪除用 DELETE 加 body 傳 id 陣列，例如 [3, 5, 8]。有些 HTTP 工具不允許 DELETE 帶 body，但 Spring MVC 和 Postman 都支援。
-->

---
layout: default
---

# 練習解答：Controller — 前台與後台（續）

```java
// ... 接上一頁

    @DeleteMapping("/api/admin/surveys")
    public void delete(@RequestBody List<Integer> ids) {
        surveyService.deleteAll(ids);
    }
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
目前所有 API 都還沒有權限保護，任何人都能呼叫後台，這是暫時的。第 44 章會補上。
-->

---
layout: default
---

# 練習解答：Postman 測試

**新增一份問卷**（`POST /api/admin/surveys?publish=true`，Body 選 raw / JSON）：

```json
{
  "title": "社團博覽會意見調查",
  "description": "你對博覽會有什麼想法？",
  "startDate": "2026-10-01",
  "endDate": "2026-10-08",
  "questions": [
    { "title": "你會參加嗎？", "type": "SINGLE", "required": true,
      "options": [ { "label": "會" }, { "label": "不會" } ] },
    { "title": "其他建議", "type": "TEXT", "required": false, "options": [] }
  ]
}
```

| 測試 | 預期結果 |
| --- | --- |
| `GET /api/surveys?size=2` | 分頁 JSON：`content` 最多 2 筆、`totalElements`、`totalPages`；看不到未發佈的問卷 |
| `GET /api/admin/surveys` | 含未發佈的問卷；每筆有 `status` / `statusLabel` |
| `GET /api/admin/surveys/{新增的 id}` | 兩題，且第一題的 `options` 是兩個元素的陣列 |

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
最後用 Postman 把整條流程走一遍。新增的 Body 用 JSON，要記得設定 Content-Type 是 application/json，Postman 選 raw 加 JSON 的時候會自動加上。

幾個值得停下來觀察的地方：

第一，新增之後 GET 回來，題目跟選項都在，這證明 cascade 有正確運作。
-->

---
layout: default
---

# 練習解答：Postman 測試（續）

| 測試 | 預期結果 |
| --- | --- |
| `PUT` 改標題 | 題目重建後，`questions` 的 id 都是新的 |
| `PUT /api/admin/surveys/2`（進行中） | 失敗（目前是 500，第 39 章會改成 409） |
| `DELETE` Body `[新id, 4, 5]` | 成功；再 GET 列表，三份都不見了 |
| `DELETE` Body `[2]` | 失敗，問卷 2 仍在 |

<div class="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 日期要晚於今天才符合後續章節的驗證規則，請依你執行當天的日期調整；這一章還沒有驗證，任何日期都能存。
</div>

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
第二，修改之後，題目的 id 全部變成新的了。這是因為我們用「整批重建」的做法，舊的題目被刪掉，新的被建立。對尚未開始的問卷來說沒有問題，因為還沒有人作答，沒有任何資料在參照這些題目。

第三，對進行中的問卷 PUT 或 DELETE 都會失敗，這證明業務規則有生效。現在回傳的是 500 錯誤，因為我們丟的是一般的例外，沒有處理，用戶端看到的訊息很難看，第 39 章我們會用全域例外處理，把它變成 409 加上清楚的訊息。

這一章的練習做完，資料庫、Entity、DTO、Service、Controller 都已經串起來了，這也是整個後端專案最核心的骨架，後面章節都是在它上面加東西。
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
