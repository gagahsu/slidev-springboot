---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 實戰：用 JPA 打造完整的 CRUD API
routeAlias: ch39
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
大家好，歡迎來到第三十九章。

前兩章我們談了很多觀念：三層的分工、四條規則、PO 和 DTO 這些資料物件。但是都只有用看的。

今天是實戰。我們開一個全新的專案，從第一個檔案開始，把一套完整的學生管理 API 寫出來。這一章要寫的程式比較多，請跟著一步一步做。
-->

---

# 今天要完成的三件事

<v-clicks>

- **開一個新專案**：設定好資料庫，把資料夾先分好
- **由裡往外寫**：PO → Repository → DTO 和 VO → Service → Controller
- **用 Postman 測試**：確認身分證字號沒有流出去

</v-clicks>

<!--
今天要完成三件事。

（下一步）第一，開一個新專案。設定好資料庫，並且先把資料夾分好。

（下一步）第二，由裡往外寫。從最靠近資料庫的 PO 開始，然後是 Repository、DTO 和 VO、Service，最後才是 Controller。

（下一步）第三，用 Postman 測試。除了確認功能正常，還要確認身分證字號沒有流出去。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 重新整理教務處

<!--
先說明為什麼要開新專案。
-->

---

# 為什麼開一個新專案

教務處用了很久，櫃子裡塞滿了以前試過的各種做法。與其一邊清一邊做，不如**搬到新辦公室，一開始就照規矩擺好**。

<v-clicks>

- 舊專案裡有 Spring JDBC、JPA、MyBatis 三種寫法留下來的程式
- 新專案只用一種工具，而且一開始就分好資料夾
- 順便複習：從零建立一個 Spring Boot 專案

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這次選 <b>Spring Data JPA</b>。標準的新增、查詢、修改、刪除，用它最省事，一句 SQL 都不用寫。
</div>

</v-click>

<!--
教務處用了很久，櫃子裡塞滿了以前試過的各種做法。與其一邊清一邊做，不如搬到新辦公室，一開始就照規矩擺好。

（下一步）我們的舊專案裡，有 Spring JDBC、JPA、MyBatis 三種寫法留下來的程式，互相夾雜。

（下一步）新專案只用一種工具，而且一開始就把資料夾分好。

（下一步）也順便複習一次，怎麼從零建立一個 Spring Boot 專案。

（下一步）三種工具，這次選 Spring Data JPA。今天要做的是標準的新增、查詢、修改、刪除，用它最省事，一句 SQL 都不用寫。如果是很複雜的查詢，才會考慮 MyBatis 或 Spring JDBC。
-->

---

# 步驟一：建立專案

到 `start.spring.io`，和第三章一樣的做法：

<v-clicks>

- Project 選 **Gradle - Groovy**，Language 選 **Java**
- Artifact 填 `school`（Package name 會變成 `com.example.school`）
- Dependencies 加四個：**Spring Web**、**Spring Data JPA**、**MySQL Driver**、**Lombok**
- 下載、解壓縮、匯入 Eclipse

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 啟動新專案之前，請先把舊專案<b>停掉</b>。兩個專案都想用 8080，後啟動的那一個會失敗。
</div>

</v-click>

<!--
步驟一，建立專案。打開 start.spring.io，做法和第三章一樣。

（下一步）Project 選 Gradle - Groovy，Language 選 Java。

（下一步）Artifact 填 school。下面的 Package name 會自動變成 com.example.school。

（下一步）Dependencies 這次一口氣加四個：Spring Web，讓我們能寫 API。Spring Data JPA，資深助理。MySQL Driver，連 MySQL 用的。Lombok，幫我們產生 getter 和 setter。以前我們是一個一個手動加進 build.gradle，這次在建立專案的時候就一起選好。

（下一步）然後下載、解壓縮、匯入 Eclipse。忘記怎麼做的同學，可以回頭看第三章。

（下一步）提醒一件事。啟動新專案之前，請先把舊專案停掉。兩個專案都想用 8080 這個 port，後啟動的那一個會失敗。
-->

---

# 步驟二：新的檔案櫃和連線設定

在 Workbench 建一個新的 Schema，名字叫 `school`（做法在第二十三章）。然後設定 `application.properties`：

```properties {1-4|5|6}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/school?serverTimezone=Asia/Taipei&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=（你的 MySQL 密碼）
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 只要建 Schema，<b>不用建 Table</b>。<code>ddl-auto=update</code> 會在啟動時，照我們的 PO 自動把資料表建好。
</div>

</v-click>

<!--
步驟二，資料庫。

新辦公室配一個新的檔案櫃。請在 Workbench 建一個新的 Schema，名字叫 school。做法在第二十三章。

然後打開 application.properties，寫這六行。

前四行是連線設定，和以前一樣。唯一要注意的是網址裡 Schema 的名字，這次是 school。

（下一步）第五行，ddl-auto=update。啟動的時候，助理會照我們的類別自動建立或補齊資料表。

（下一步）第六行，show-sql=true。助理執行的 SQL 會印在 console，方便我們觀察。

（下一步）所以這次只要建 Schema，不用建 Table。資料表等一下會自動出現。
-->

---

# 步驟三：把資料夾分好

在 `com.example.school` 上按右鍵 → **New** → **Package**，建立這些資料夾：

```text
com.example.school
├── controller      櫃台
├── service         組長
├── repository      承辦人員（DAO）
├── entity          學籍簿正本（PO）
├── dto             申請表、成績單（DTO）
├── vo              不能改的值（VO）
└── SchoolApplication.java
```

<v-clicks>

- **package** 就是放程式的資料夾。名字用小寫
- 不同資料夾的類別互相使用時，要 `import`。在 Eclipse 按 `Ctrl + Shift + O` 會自動補上

</v-clicks>

<!--
步驟三，把資料夾分好。

以前我們所有的類別都放在同一個資料夾裡。類別一多，就很難找。這次先分好。

在 com.example.school 上按右鍵，選 New，再選 Package，建立這六個資料夾。名字的最後一段分別是 controller、service、repository、entity、dto、vo。

每個資料夾放什麼，就是前兩章講的角色。controller 放櫃台，service 放組長，repository 放承辦人員，entity 放學籍簿正本，dto 放申請表和成績單，vo 放不能改的值。

（下一步）package 就是放程式的資料夾。名字的習慣是全部小寫。

（下一步）分了資料夾之後，有一件事要注意。不同資料夾的類別互相使用的時候，要 import。不用自己打，在 Eclipse 按 Ctrl + Shift + O，它會自動補上。今天的投影片為了節省空間，import 都省略了。

SchoolApplication.java 是專案的啟動類別，留在最外層不要動。Spring 會從它所在的位置往下掃描所有的資料夾。
-->

---

# 今天要寫的七個檔案

<Pairs left="資料夾" right="檔案" rows="book,entity=code,Student（PO）|staff,repository=code,StudentRepository（DAO）|form,dto=code,CreateStudentRequest、StudentResponse|lock,vo=code,ScoreVO|teacher,service=code,StudentService|clerk,controller=code,StudentController" />

<!--
今天總共要寫七個檔案。

（下一步）entity 裡面是 Student，PO。

（下一步）repository 裡面是 StudentRepository，DAO。

（下一步）dto 裡面有兩個：CreateStudentRequest 和 StudentResponse。

（下一步）vo 裡面是 ScoreVO。

（下一步）service 裡面是 StudentService。

（下一步）controller 裡面是 StudentController。

我們會照這個順序，由裡往外寫。因為外層會用到內層，先寫內層，寫外層的時候才不會一片紅字。
-->

---

# 想一想

<Poll question="StudentResponse 這個類別，應該放在哪一個資料夾？" options="entity|dto|vo|repository" answer="2" />

<!--
來想一題。

StudentResponse 這個類別，應該放在哪一個資料夾？

（等大家作答）

（下一步）答案是 dto。它是回傳給前端的成績單，是 Response DTO。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 最裡面：PO 和 Repository

<!--
從最靠近資料庫的地方開始。
-->

---

# entity/Student.java

```java {all|3|5-7|8|all}
@Getter
@Setter
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String idNumber;
    private String name;
    private Integer score;
}
```

- `@Entity`：這個類別對應一張資料表 `student`
- `id` 是主鍵，交給資料庫自動編號
- `idNumber`：身分證字號。資料表的欄位會自動叫 `id_number`

<!--
第一個檔案，在 entity 資料夾建立 Student。

（下一步）@Entity，告訴 JPA 這個類別對應一張資料表。預設用類別名稱找，也就是 student。

（下一步）id 是主鍵，交給資料庫自動編號。這三行和第二十六章一樣。

（下一步）idNumber，身分證字號。資料表的欄位會自動叫 id_number，JPA 會幫我們把駝峰式的名字轉成底線。

（下一步）上面的 @Getter 和 @Setter 是 Lombok，幫我們產生 getter 和 setter。

寫好之後可以先啟動一次。到 Workbench 重新整理，應該會看到 school 裡面多了一張 student 資料表，四個欄位都建好了。
-->

---

# repository/StudentRepository.java

```java
public interface StudentRepository extends JpaRepository<Student, Integer> {
}
```

<v-clicks>

- 和第二十六章一樣：繼承 `JpaRepository`，尖括號裡是「PO 的類別」和「主鍵的型別」
- 裡面一行都不用寫，就有 `save()`、`findAll()`、`findById()`、`deleteById()`
- 它只認識 `Student` 這個 PO，不認識任何 DTO

</v-clicks>

<!--
第二個檔案，在 repository 資料夾建立 StudentRepository。注意它是 interface。

（下一步）和第二十六章一樣，繼承 JpaRepository。尖括號裡放兩個東西：PO 的類別，還有主鍵的型別。

（下一步）裡面一行都不用寫，就有 save、findAll、findById、deleteById 可以用。今天的功能這四個就夠了。

（下一步）請注意，它只認識 Student 這個 PO，不認識任何 DTO。這就是上一章的規矩：Dao 只碰 PO。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 三張紙：DTO 和 VO

<!--
接著準備申請表、成績單，還有成績這個值。
-->

---

# dto：申請表和成績單

```java
@Getter
@Setter
public class CreateStudentRequest {
    private String name;
    private String idNumber;
    private Integer score;
}
```

```java
@Getter
@Setter
public class StudentResponse {
    private Integer id;
    private String name;
    private Integer score;
    private String letterGrade;
}
```

<!--
第三和第四個檔案，在 dto 資料夾。內容和上一章看到的一樣。

上面是 CreateStudentRequest，申請表。有姓名、身分證字號、成績，沒有 id。

下面是 StudentResponse，成績單。有 id、姓名、成績、等第，沒有身分證字號。

兩個類別都沒有 @Entity，它們和資料表沒有關係。
-->

---

# vo/ScoreVO.java

```java {all|2,4-9|12-17|all}
public class ScoreVO {
    private final Integer value;

    public ScoreVO(Integer value) {
        if (value == null || value < 0 || value > 100) {
            throw new IllegalArgumentException("成績要在 0 到 100 之間");
        }
        this.value = value;
    }
    public Integer getValue() { return value; }

    public String getLetterGrade() {
        if (value >= 90) return "A";
        if (value >= 80) return "B";
        if (value >= 70) return "C";
        return "F";
    }
}
```

<!--
第五個檔案，在 vo 資料夾建立 ScoreVO。

（下一步）前半部和上一章一樣。變數是 final，建構子裡檢查成績要在 0 到 100 之間，不合規定就丟出例外。沒有 setter。

（下一步）這次多了一個方法 getLetterGrade，把成績換算成等第。90 分以上是 A，80 分以上是 B，70 分以上是 C，其他是 F。

（下一步）「幾分算哪個等第」是和成績這個值綁在一起的規矩，所以我們把它放在 VO 裡。組長要用的時候，問這個物件就好，不用自己寫一串 if。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 中間：Service 負責轉換

<!--
三張紙都準備好了。接著是負責抄寫的組長。
-->

---

# service/StudentService.java：先寫「抄成績單」

```java {all|6|7|8-12|all}
@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    private StudentResponse toResponse(Student po) {
        ScoreVO score = new ScoreVO(po.getScore());
        StudentResponse res = new StudentResponse();
        res.setId(po.getId());
        res.setName(po.getName());
        res.setScore(score.getValue());
        res.setLetterGrade(score.getLetterGrade());
        return res;
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 這裡<b>沒有</b> <code>res.setIdNumber(…)</code>。成績單上本來就沒有那一格，想抄也抄不進去。
</div>

</v-click>

<!--
第六個檔案，在 service 資料夾建立 StudentService。這個檔案比較長，我們分幾頁寫。

先加上 @Service，注入 StudentRepository。然後寫第一個方法。

（下一步）toResponse。收一個 PO，回傳一張成績單。它是 private，只給這個類別自己用。後面每一個功能都會用到它，所以先寫好。

（下一步）先把 PO 裡的成績包成 ScoreVO。

（下一步）建立一張空白的成績單，把編號、姓名、成績一格一格抄過去。等第是問 ScoreVO 拿的。

（下一步）整個方法寫完，請注意它沒有抄身分證字號。成績單上本來就沒有那一格，想抄也抄不進去。這就是把敏感欄位擋在裡面的地方。
-->

---

# 新增：申請表 → PO → 存檔 → 成績單

```java {all|2|3-6|7|8|all}
public StudentResponse createStudent(CreateStudentRequest req) {
    ScoreVO score = new ScoreVO(req.getScore());
    Student po = new Student();
    po.setName(req.getName());
    po.setIdNumber(req.getIdNumber());
    po.setScore(score.getValue());
    Student saved = studentRepository.save(po);
    return toResponse(saved);
}
```

- 先用 `ScoreVO` 檢查成績。不合規定，這裡就會丟出例外，不會存檔
- 把申請表抄成 PO。沒有設定 `id`
- `save()` 看到沒有 id → 新增。回傳的 `saved` 已經有編號了
- 把存好的 PO 抄成成績單，交回去

<!--
接著在同一個類別裡，加上新增的方法 createStudent。它收的是申請表，回傳的是成績單。

（下一步）第一步，先用 ScoreVO 檢查成績。如果成績不合規定，這一行就會丟出例外，後面都不會執行，也就不會存檔。

（下一步）第二步，建立一個 PO，把申請表上的姓名、身分證字號、成績抄過去。注意我們沒有設定 id。

（下一步）第三步，請承辦人員存檔。save 看到 PO 沒有 id，就知道是新增。它回傳的 saved，是存好之後的 PO，上面已經有資料庫編的 id 了。

（下一步）第四步，把存好的 PO 抄成成績單，交回去。這裡就用到剛才寫的 toResponse。

（下一步）這四步，就是上一章那張流程圖裡，組長做的事。
-->

---

# 查詢：全部，和單一一位

```java {1-8|10-16}
public List<StudentResponse> getAllStudents() {
    List<Student> poList = studentRepository.findAll();
    List<StudentResponse> result = new ArrayList<>();
    for (Student po : poList) {
        result.add(toResponse(po));
    }
    return result;
}

public StudentResponse getStudentById(Integer id) {
    Student po = studentRepository.findById(id).orElse(null);
    if (po == null) {
        return null;
    }
    return toResponse(po);
}
```

<!--
接著是兩個查詢的方法。

上面是查全部。承辦人員拿回來的是一疊 PO。我們準備一個空的 List，用 for 迴圈一張一張抄成成績單，放進去，最後整疊回傳。

（下一步）下面是查單一一位。findById 回傳的是 Optional，也就是第二十七章說的信封。orElse(null) 的意思是：信封裡有東西就拿出來，沒有就給我 null。

如果是 null，代表沒有這位同學，我們也回傳 null，讓櫃台去決定怎麼回覆。有的話，抄成成績單回傳。
-->

---

# 修改和刪除

```java {1-11|13-15}
public StudentResponse updateStudent(Integer id, CreateStudentRequest req) {
    Student po = studentRepository.findById(id).orElse(null);
    if (po == null) {
        return null;
    }
    ScoreVO score = new ScoreVO(req.getScore());
    po.setName(req.getName());
    po.setIdNumber(req.getIdNumber());
    po.setScore(score.getValue());
    return toResponse(studentRepository.save(po));
}

public void deleteStudent(Integer id) {
    studentRepository.deleteById(id);
}
```

- 修改：**先查出原本那一筆**，改它的內容，再存回去。查不到就回傳 `null`
- 刪除：直接請承辦人員照編號刪掉

<!--
最後是修改和刪除。

上面是修改。它收兩個東西：要改的是幾號，還有新的內容。新的內容我們直接沿用申請表的格式。

做法是先用編號把原本那一筆查出來。查不到就回傳 null。查到了，檢查新的成績，把姓名、身分證字號、成績改掉，再存回去。這次 PO 有 id，所以 save 會執行修改。

為什麼要先查？因為如果不查，直接用一個不存在的編號去存，結果會不如預期。先確認這位同學真的存在，比較安全。

（下一步）下面是刪除。直接請承辦人員照編號刪掉，不需要回傳任何東西。

到這裡，StudentService 就寫完了。五個功能，加上一個 toResponse。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 最外面：Controller

<!--
最後一個檔案，櫃台。
-->

---

# controller/StudentController.java：查全部、新增

```java {all|6-9|11-14|all}
@RestController
public class StudentController {
    @Autowired
    private StudentService studentService;

    @GetMapping("/students")
    public List<StudentResponse> getAllStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping("/students")
    public StudentResponse createStudent(@RequestBody CreateStudentRequest req) {
        return studentService.createStudent(req);
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
📌 整個 Controller 裡<b>沒有出現 <code>Student</code></b>。櫃台收的是申請表，交出去的是成績單。
</div>

</v-click>

<!--
第七個檔案，在 controller 資料夾建立 StudentController。注入的是 StudentService，不是 Repository。這是第三十六章的規則一。

（下一步）查全部。GET /students，回傳一疊成績單。方法裡只有一行，轉交給組長。

（下一步）新增。POST /students，用 @RequestBody 把 JSON 接成申請表，交給組長，再把組長給的成績單回傳。

（下一步）請注意，整個 Controller 裡沒有出現 Student 這個 PO。櫃台收的是申請表，交出去的是成績單。這是上一章的規矩：Controller 只碰 DTO。
-->

---

# 查單一一位、修改、刪除

```java {1-8|10-16|18-21}
@GetMapping("/students/{id}")
public ResponseEntity<StudentResponse> getStudentById(@PathVariable("id") Integer id) {
    StudentResponse res = studentService.getStudentById(id);
    if (res == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(res);
}

@PutMapping("/students/{id}")
public ResponseEntity<StudentResponse> updateStudent(
        @PathVariable("id") Integer id, @RequestBody CreateStudentRequest req) {
    StudentResponse res = studentService.updateStudent(id, req);
    if (res == null) { return ResponseEntity.notFound().build(); }
    return ResponseEntity.ok(res);
}

@DeleteMapping("/students/{id}")
public void deleteStudent(@PathVariable("id") Integer id) {
    studentService.deleteStudent(id);
}
```

<!--
在同一個類別裡，再加三個方法。

上面是查單一一位。回傳型別用的是第三十四章學過的 ResponseEntity，它可以讓我們自己決定狀態碼。如果組長回傳 null，代表沒有這位同學，我們回覆 404。notFound().build() 的意思是：狀態碼 404，沒有內容。有找到的話，回覆 200 加上成績單。

（下一步）中間是修改。PUT /students/ 加上編號。編號從網址拿，新的內容從 Body 拿。一樣，找不到就回覆 404。

（下一步）下面是刪除。DELETE /students/ 加上編號，轉交給組長就好。

七個檔案到這裡全部寫完了。請啟動專案，確認 console 沒有錯誤。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# 測試

<!--
寫完了，用 Postman 測試。
-->

---

# 五支 API

<Pairs left="請求" right="收什麼 → 回什麼" rows="code,GET /students=doc,不用帶東西 → 一疊成績單|code,GET /students/1=doc,網址帶編號 → 一張成績單，或 404|code,POST /students=form,申請表 → 成績單|code,PUT /students/1=form,網址帶編號 + 申請表 → 成績單，或 404|code,DELETE /students/1=doc,網址帶編號 → 沒有內容" />

<!--
我們做出來的五支 API，整理在這裡。

（下一步）GET /students，不用帶東西，回傳一疊成績單。

（下一步）GET /students/1，網址帶編號，回傳一張成績單。沒有這位同學就是 404。

（下一步）POST /students，Body 帶申請表，回傳成績單。

（下一步）PUT /students/1，網址帶編號，Body 帶申請表，回傳成績單，或是 404。

（下一步）DELETE /students/1，網址帶編號，沒有回傳內容。
-->

---

# 用 Postman 新增一位同學

`POST http://localhost:8080/students`，Body 選 **raw** → **JSON**：

```json
{ "name": "Judy", "idNumber": "A223456789", "score": 85 }
```

回傳：

```json
{ "id": 1, "name": "Judy", "score": 85, "letterGrade": "B" }
```

<v-clicks>

- 送進去的有 `idNumber`，回來的**沒有**
- 回來的多了 `id` 和 `letterGrade`
- 到 Workbench 查 `student` 資料表：`id_number` 有確實存進去

</v-clicks>

<!--
用 Postman 新增一位同學。方法選 POST，網址是 localhost:8080/students。Body 選 raw，格式選 JSON，填入姓名、身分證字號、成績。

送出之後，回傳的內容在下面。

（下一步）送進去的 JSON 有 idNumber，回來的 JSON 沒有。身分證字號沒有流出來。

（下一步）回來的多了 id 和 letterGrade。id 是資料庫編的，等第是 ScoreVO 算的。85 分是 B。

（下一步）再到 Workbench 查 student 資料表，可以看到 id_number 有確實存進去。資料庫有存，只是沒有給前端。

這就是分開 PO 和 DTO 的效果。
-->

---

# 再試幾個

<v-clicks>

- `GET /students` → 陣列裡每一筆都沒有 `idNumber`
- `GET /students/999` → 狀態碼 **404**
- `PUT /students/1`，Body 把 `score` 改成 `95` → 回傳的 `letterGrade` 變成 `"A"`
- `POST /students`，Body 多寫 `"id": 1` → 沒有蓋掉 1 號，而是新增了一位
- `POST /students`，`score` 填 `200` → 狀態碼 **500**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 最後一個：<code>ScoreVO</code> 有擋下來，資料沒有存進去。但是 500 的意思是「伺服器出錯」，其實是前端填錯。這個問題留到第四十一章解決。
</div>

</v-click>

<!--
請再試幾個。

（下一步）GET /students，回傳的陣列裡，每一筆都沒有 idNumber。

（下一步）GET /students/999，查一個不存在的編號，狀態碼是 404。

（下一步）PUT /students/1，把成績改成 95。回傳的等第會變成 A。

（下一步）POST /students，在 Body 裡多寫一個 id 等於 1。結果沒有蓋掉 1 號同學，而是新增了一位。這是上一章想一想的那一題，現在可以親手驗證。

（下一步）POST /students，成績填 200。狀態碼是 500。

（下一步）最後這一個要說明一下。ScoreVO 有把不合法的成績擋下來，資料沒有存進去，這是對的。但是 500 的意思是「伺服器出錯」。這次其實是前端填錯資料，應該回覆 400 才對，而且最好告訴他是哪一格填錯。這個問題，我們留到第四十一章解決。
-->

---

# 想一想

<Poll question="今天的 StudentController 裡，哪一個類別從頭到尾都沒有出現？" options="StudentService|StudentResponse|CreateStudentRequest|Student" answer="4" />

<!--
確認一下。

今天的 StudentController 裡，哪一個類別從頭到尾都沒有出現？

（等大家作答）

（下一步）答案是 Student。

Student 是 PO。櫃台只碰 DTO，所以 Controller 裡只有 CreateStudentRequest 和 StudentResponse。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
# 動手練習

<!--
最後請大家自己做一套。
-->

---

# 練習：社團管理 API

用同樣的做法，在同一個專案裡做「社團（Club）」的 API：

<v-clicks>

- **`Club`（PO）**：`id`、`name`（社團名稱）、`fee`（社費）、`advisorPhone`（指導老師電話）
- **`CreateClubRequest`**：`name`、`fee`、`advisorPhone`
- **`ClubResponse`**：`id`、`name`、`fee`。**不含** `advisorPhone`
- API：`GET /clubs`、`POST /clubs`、`DELETE /clubs/{id}`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 完成的標準：<code>POST</code> 新增之後再 <code>GET</code>，回傳的 JSON 裡沒有 <code>advisorPhone</code>；Workbench 裡 <code>advisor_phone</code> 有存到。
</div>

</v-click>

<!--
練習題。請用同樣的做法，在同一個專案裡做社團的 API。

（下一步）PO 叫做 Club。有編號、社團名稱、社費，還有指導老師的電話。

（下一步）申請表叫 CreateClubRequest。有社團名稱、社費、指導老師電話。

（下一步）回傳用的叫 ClubResponse。有編號、社團名稱、社費。不含指導老師的電話。

（下一步）要做三支 API：查全部、新增、刪除。

（下一步）完成的標準是：POST 新增之後再 GET，回傳的 JSON 裡沒有 advisorPhone。同時到 Workbench 看，advisor_phone 這個欄位有存到值。

建議的順序和今天一樣：PO、Repository、兩個 DTO、Service、Controller。這個練習不需要 VO。請先暫停，自己做做看。
-->

---

# 練習解答：PO、DTO、Repository

```java
@Getter @Setter @Entity
public class Club {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Integer fee;
    private String advisorPhone;
}
```

```java
@Getter @Setter
public class CreateClubRequest { private String name; private Integer fee; private String advisorPhone; }

@Getter @Setter
public class ClubResponse { private Integer id; private String name; private Integer fee; }
```

```java
public interface ClubRepository extends JpaRepository<Club, Integer> { }
```

<!--
參考答案。先看四個比較短的檔案。

最上面是 Club，放在 entity。四個變數，id 自動編號。

中間是兩個 DTO，放在 dto。投影片為了省空間，把變數寫在同一行，實際寫的時候一行一個比較好讀。CreateClubRequest 有電話，ClubResponse 沒有電話。記得它們是兩個檔案。

最下面是 ClubRepository，放在 repository。一樣是一行。
-->

---

# 練習解答：Service

```java
@Service
public class ClubService {
    @Autowired
    private ClubRepository clubRepository;

    private ClubResponse toResponse(Club po) {
        ClubResponse res = new ClubResponse();
        res.setId(po.getId());
        res.setName(po.getName());
        res.setFee(po.getFee());
        return res;
    }

    public ClubResponse createClub(CreateClubRequest req) {
        Club po = new Club();
        po.setName(req.getName());
        po.setFee(req.getFee());
        po.setAdvisorPhone(req.getAdvisorPhone());
        return toResponse(clubRepository.save(po));
    }
    // getAllClubs()：findAll() 之後用 for 迴圈逐一 toResponse
    // deleteClub(id)：clubRepository.deleteById(id)
}
```

<!--
ClubService。

toResponse 把 PO 抄成 ClubResponse，只抄編號、名稱、社費。沒有抄電話。

createClub 把申請表抄成 PO，三個欄位都抄，存檔之後，再用 toResponse 抄成回傳的格式。

另外兩個方法寫法和今天的 StudentService 一樣，投影片上用註解帶過。getAllClubs 是 findAll 之後，用 for 迴圈一筆一筆 toResponse。deleteClub 是呼叫 deleteById。
-->

---

# 練習解答：Controller

```java
@RestController
public class ClubController {
    @Autowired
    private ClubService clubService;

    @GetMapping("/clubs")
    public List<ClubResponse> getAllClubs() {
        return clubService.getAllClubs();
    }

    @PostMapping("/clubs")
    public ClubResponse createClub(@RequestBody CreateClubRequest req) {
        return clubService.createClub(req);
    }

    @DeleteMapping("/clubs/{id}")
    public void deleteClub(@PathVariable("id") Integer id) {
        clubService.deleteClub(id);
    }
}
```

<!--
ClubController。三個方法，每個都只有一行，轉交給 ClubService。

一樣請檢查：Controller 裡沒有出現 Club 這個 PO，也沒有出現 ClubRepository。

做完之後用 Postman 測試，確認回傳的 JSON 裡沒有 advisorPhone。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="shop,搬到新辦公室，先分好區域=code,新專案，先分好 package|book,學籍簿正本=code,entity/Student（PO）|form,申請表和成績單=code,dto/CreateStudentRequest、StudentResponse|lock,成績這個值和它的規矩=code,vo/ScoreVO|teacher,組長在三張紙之間抄寫=code,StudentService 的 toResponse() 和各個方法|clerk,櫃台只收申請表、只發成績單=code,StudentController 只用 DTO" />

<!--
我們用一張圖複習今天的內容。

（下一步）搬到新辦公室、先分好區域，是開新專案、先分好 package。

（下一步）學籍簿正本，是 entity 裡的 Student。

（下一步）申請表和成績單，是 dto 裡的兩個類別。

（下一步）成績這個值和它的規矩，是 vo 裡的 ScoreVO。

（下一步）組長在三張紙之間抄寫，是 StudentService 裡的 toResponse 和各個方法。

（下一步）櫃台只收申請表、只發成績單，是 StudentController 只用 DTO。
-->

---

# 章節總結

<v-clicks>

- **新專案**：建立時一次選好依賴；只建 Schema，資料表讓 JPA 自動建
- **package**：`controller`、`service`、`repository`、`entity`、`dto`、`vo`
- **由裡往外寫**：PO → Repository → DTO / VO → Service → Controller
- **Service 是轉換中心**：申請表 → PO → 成績單，敏感欄位在這裡擋下來
- **Controller 只用 DTO**；找不到資料時用 `ResponseEntity` 回覆 404

</v-clicks>

<v-click>

下一章：API 寫好了，怎麼讓前端的同事知道有哪些 API、要怎麼用？

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）新專案在建立時一次選好依賴；資料庫只建 Schema，資料表讓 JPA 自動建。package 分成 controller、service、repository、entity、dto、vo。寫的順序是由裡往外。Service 是轉換中心，敏感欄位在這裡擋下來。Controller 只用 DTO，找不到資料時用 ResponseEntity 回覆 404。

（最後一步）API 寫好了。下一章要解決另一個問題：怎麼讓前端的同事知道我們有哪些 API、要怎麼用？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

今天的專案請留著，接下來兩章會繼續用它。

有任何問題歡迎提出來。
-->
