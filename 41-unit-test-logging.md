---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 單元測試與日誌
routeAlias: ch41
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
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    單元測試與日誌
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓程式自己驗證自己，讓日誌告訴你發生了什麼」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
今天要講的主題分成兩大塊：單元測試和日誌。

這兩個東西乍看很無聊，但我跟你說，它們是讓你的程式「不崩潰」的護身符。

先從測試開始，等等再聊日誌。
-->

---
layout: default
---

# Outline

- **為什麼需要單元測試？** — 測試的核心價值
- **JUnit 6 基礎** — `@Test`、`@BeforeEach`、`@AfterEach`
- **Assertions — 斷言語法** — `assertEquals`、`assertThrows`、`assertAll`
- **Mockito 與 @MockitoBean** — Mock 依賴、驗證互動行為
- **@SpringBootTest** — 整合測試與 `@WebMvcTest`、`@DataJpaTest`
- **SLF4J + Logback** — Spring Boot 預設日誌體系
- **application.properties 日誌設定** — level、file、rolling policy
- **實作練習**

<!--
這章的內容不算少，但其實學完之後你會發現邏輯很一致。

測試的部分是「怎麼寫測試」，日誌的部分是「怎麼記錄程式行為」。

我們一段一段來，不急。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

## Part 1
# 為什麼需要單元測試？

<!--
我先問大家一個問題：你改了一段 Service 的程式碼，你怎麼確定沒有搞壞其他東西？

手動測？那你可能要點個 20 個 API 才確認得了。

這就是為什麼我們需要自動化測試。
-->

---

## 沒有測試的世界長什麼樣子

想像你的系統上線後，PM 說「幫我改一個小功能」。

你改完，佈署，結果…其他三個 API 壞了。

這就是**沒有測試保護**的日常。

| 問題 | 測試如何解決 |
|------|------------|
| 改 A 壞 B | 每次 commit 自動跑測試，立刻知道 |
| 邏輯難以理解 | 測試就是最好的文件 |
| 不敢重構 | 有測試當安全網，放心改 |
| 上線才發現 bug | 在開發期就抓到 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>核心觀念：</b> 測試不是在浪費時間，而是在節省未來 debug 的時間。</div>

<!--
我個人覺得單元測試最大的價值，就是「讓你敢重構」。

沒有測試，你就像在黑暗中走路。有測試，你有個手電筒。

OK 那我們開始看 JUnit 6 怎麼用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

## Part 2
# JUnit 6 基礎

<!--
JUnit 是 Java 世界最主流的測試框架，Spring Boot 預設就整合好了，不需要額外加依賴。Spring Boot 4.x 內建的是 JUnit 6，寫法和 JUnit 5 完全一樣，import 都是 org.junit.jupiter，所以你在 JUnit 5 學到的東西可以無痛沿用。

我們來看最基本的三個 annotation。
-->

---

## Spring Boot 測試的檔案結構

測試檔案放在 `src/test/java`，**套件路徑與主程式完全對應**：

```
src/
├── main/java/com/example/demo/
│   ├── controller/
│   │   └── StudentController.java
│   └── service/
│       └── StudentService.java
└── test/java/com/example/demo/
    ├── controller/
    │   └── StudentControllerTest.java    ← 測試 StudentController
    └── service/
        └── StudentServiceTest.java       ← 測試 StudentService
```

`spring-boot-starter-test` 已內建 JUnit（Spring Boot 4.x 為 JUnit 6，API 與 JUnit 5 相同）、Mockito、AssertJ，Spring Initializr 預設自動加入，不需手動設定。

<div class="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>Spring Boot 4 的測試切片是獨立模組：</b><code>@WebMvcTest</code> 要加 <code>spring-boot-starter-webmvc-test</code>，<code>@DataJpaTest</code> 要加 <code>spring-boot-starter-data-jpa-test</code>（測試類別的 import 套件也跟著改到 <code>org.springframework.boot.webmvc.test.autoconfigure</code>、<code>org.springframework.boot.data.jpa.test.autoconfigure</code>）。Spring Boot 3.x 則全部包在 <code>spring-boot-starter-test</code>。</div>

<!--
這個結構很重要，很多新手不知道測試檔案要放哪裡。

src/test/java 的套件結構要和 src/main/java 完全一致，這樣測試才能存取到 package-private 的成員。

命名慣例是在原類別名稱後面加 Test，例如 StudentService 對應 StudentServiceTest。
-->

---

## JUnit 6 — 測試類別的骨架

Spring Boot 測試的 dependency 已內建在 `spring-boot-starter-test` 中。

```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {

    @BeforeEach
    void setUp() {
        // 每個測試執行前都會跑一次
    }

    @Test
    void add_兩數相加_回傳正確結果() {
        int result = 1 + 2;
        assertEquals(3, result);
    }

    @AfterEach
    void tearDown() {
        // 每個測試執行後都會跑一次
    }
}
```

<!--
注意這邊我用的是 Jupiter API（JUnit 5 / 6 共用），不是舊的 JUnit 4。

Spring Boot 3.x 採用 JUnit 5、Spring Boot 4.x 升級到 JUnit 6，但 Jupiter API 完全相同，import 都是 org.junit.jupiter。不需要加 @RunWith，那是 JUnit 4 的東西。

測試方法命名我習慣用「方法名_情境_預期結果」，這樣一眼就知道在測什麼。
-->

---

## JUnit 6 — 生命週期 Annotation

| Annotation | 用途 |
|------------|------|
| `@Test` | 標記這是一個測試方法 |
| `@BeforeEach` | 每個 `@Test` 前執行，通常用來初始化 |
| `@AfterEach` | 每個 `@Test` 後執行，通常用來清理 |
| `@BeforeAll` | 整個測試類別執行前跑一次（需 `static`） |
| `@AfterAll` | 整個測試類別執行後跑一次（需 `static`） |

<!--
最常用的就是這五個。

@BeforeEach 和 @AfterEach 是最頻繁使用的，每個測試方法前後都會跑。

@BeforeAll 和 @AfterAll 整個類別只跑一次，通常用來建立或關閉昂貴的資源（例如資料庫連線）。
-->

---

## @BeforeAll / @AfterAll — 為什麼需要 static？

```java
class DatabaseTest {

    @BeforeAll
    static void initDb() {          // 必須是 static
        // 啟動測試用資料庫連線（昂貴操作，只做一次）
    }

    @AfterAll
    static void closeDb() {         // 必須是 static
        // 關閉連線
    }

    @BeforeEach
    void setUp() {                  // 不需要 static
        // 每個測試前的初始化
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>為什麼要 static？</b> JUnit 6 每個 <code>@Test</code> 都會建立一個<b>新的測試類別實例</b>，所以在任何實例存在之前就要執行的 <code>@BeforeAll</code> 只能是 static 方法。<code>@BeforeEach</code> 則不需要，因為它在實例建立後才跑。</div>

<!--
忘記加 static 是新手最常遇到的編譯錯誤之一。

JUnit 6 預設的 test lifecycle 是 PER_METHOD，也就是每個測試方法建立一個新實例。
如果加上 @TestInstance(TestInstance.Lifecycle.PER_CLASS)，@BeforeAll 就不需要 static 了，但這是進階用法，先記住預設要加 static 就好。
-->

---

## JUnit 6 — 進階控制 Annotation

| Annotation | 用途 |
|------------|------|
| `@Disabled` | 暫時停用某個測試 |
| `@DisplayName` | 為測試取一個人類可讀的名稱 |
| `@Nested` | 在類別內再建立巢狀測試群組 |

```java
@DisplayName("學生服務測試")
class StudentServiceTest {

    @Nested
    @DisplayName("查詢學生")
    class FindStudent {

        @Test
        @Disabled("尚未實作此功能")
        void findByName_尚未實作() { }
    }
}
```

<!--
@Disabled 比直接 comment 掉測試方法更正式，測試報告會顯示它被跳過而不是消失。

@DisplayName 讓測試報告更易讀，特別是在 CI 介面上。

@Nested 讓你把相關測試分群組，結構更清晰。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

## Part 3
# Assertions — 斷言語法

<!--
測試的核心就是「斷言」：我預期這個值是 X，如果不是就失敗。

JUnit 6 的 Assertions 類別提供了一堆靜態方法，我們來看最常用的幾個。
-->

---

## Assertions — 常用斷言方法

| 方法 | 說明 |
|------|------|
| `assertEquals(expected, actual)` | 驗證兩個值相等 |
| `assertNotEquals(unexpected, actual)` | 驗證兩個值不相等 |
| `assertTrue(condition)` | 驗證條件為 true |
| `assertFalse(condition)` | 驗證條件為 false |
| `assertNull(object)` | 驗證物件為 null |
| `assertNotNull(object)` | 驗證物件不為 null |
| `assertThrows(ExceptionClass, executable)` | 驗證拋出特定例外 |
| `assertAll(...)` | 一次驗證多個斷言，全部跑完才報錯 |

<!--
assertThrows 是我最喜歡的，它讓你可以測試「這個方法應該要炸掉」的情境。

assertAll 也很好用，它不會在第一個失敗就停下來，而是把所有失敗一次列出來。
-->

---

## Assertions — 實際範例

```java
@Test
void 測試各種斷言() {
    assertEquals("hello", "hello");

    assertThrows(IllegalArgumentException.class, () -> {
        throw new IllegalArgumentException("錯誤");
    });

    assertAll("數字驗證",
        () -> assertEquals(4, 2 + 2),
        () -> assertTrue(10 > 5),
        () -> assertNotNull("hello")
    );
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>小技巧：</b> <code>assertEquals</code> 第一個參數是「預期值」，第二個是「實際值」，順序別搞反，否則錯誤訊息會讓你看不懂。</div>

<!--
assertEquals 的參數順序是 expected 在前，actual 在後。

很多人會搞反，搞反了之後測試失敗的錯誤訊息就會很奇怪。

assertAll 裡面的 lambda 每一個都會跑，不會因為前一個失敗就中斷。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

## Part 4
# Mockito 與 @MockitoBean

<!--
單元測試的精神是「只測這一個單元」，不要牽扯到資料庫、外部 API 這些東西。

那如果我的 Service 裡面依賴了 Repository，怎麼辦？

這時候就要用 Mock 了。
-->

---

## 本節範例情境（1/2）：Model 與 Repository

沿用 ch37 的 `Student` 資料模型與 Repository：

```java
// PO（Entity）— 對應資料庫 student 表格
@Entity
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String password; // 不應傳給前端
    private Integer score;
    // Getter 和 Setter（省略）
}

// Repository（DAO）— 依賴資料庫，測試時要 Mock
public interface StudentRepository
        extends JpaRepository<Student, Integer> {}
```

`StudentRepository` 背後需要資料庫連線，是 `StudentService` 的**外部依賴**，單元測試時要 Mock 掉。

<!--
這裡直接沿用 ch37 的 Student PO 和 StudentRepository，內容一模一樣。

Student 有 id、name、password、score 四個欄位，password 是敏感欄位。
StudentRepository 繼承 JpaRepository，背後需要資料庫連線。

這個 Repository 就是我們等等要 Mock 掉的目標。
-->

---

## 本節範例情境（2/2）：StudentService 實作

`StudentService` 是 ch37 的服務層，這裡要測 `getStudentById` 與 `deleteStudent`：

```java
@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    public StudentResponse getStudentById(Integer id) {
        Student po = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        return toResponse(po);   // toResponse 定義同 ch37
    }

    public void deleteStudent(Integer id) {
        studentRepository.deleteById(id);
    }
}
```

<!--
StudentService 沿用 ch37，@Autowired 注入 StudentRepository，
@InjectMocks 一樣能把 Mock 注入到欄位裡。

getStudentById 內部呼叫 studentRepository.findById，找不到就拋例外——
這是 ch37 getStudentById 的變體（原本回傳 null，這裡改成拋例外方便示範 assertThrows）。
deleteStudent 呼叫 deleteById，是個 void 方法，等等用來示範 verify。
-->

---

## 為什麼需要 Mock？

想像你在測試 `StudentService.getStudentById()`，但它內部會呼叫：

| 依賴 | 問題 |
|------|------|
| `StudentRepository.findById()` | 需要資料庫連線 |
| `StudentRepository.deleteById()` | 會真的刪除資料庫資料 |

解決方案：**用假物件（Mock）替代真實依賴**，讓 Mock 回傳我們指定的假資料。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>類比：</b> 就像拍電影的時候，演員用假槍，但演技是真的。我們測試的是 Service 邏輯，不是資料庫。</div>

<!--
這個類比我很喜歡：假槍，但演技是真的。

我們 Mock 掉的是「不重要的外部依賴」，真正要測的是我們自己寫的邏輯。

OK 來看 Mockito 怎麼用。
-->

---

## Mockito — @ExtendWith + @Mock 用法（1/2）

純 Mockito（不啟動 Spring Context）：

<div class="mt-2 mb-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> Spring Boot 3.x / 4.x 使用 JUnit 5 / 6，<code>@ExtendWith</code> 取代了 JUnit 4 的 <code>@RunWith</code>。網路上舊文章若出現 <code>@RunWith(MockitoJUnitRunner.class)</code>，換成 <code>@ExtendWith(MockitoExtension.class)</code> 即可。</div>

```java
@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;  // 假的 Repository

    @InjectMocks
    private StudentService studentService;        // 真實的 Service，Mock 自動注入
}
```

<!--
@Mock 建立假物件，@InjectMocks 建立真實的 Service 並把 Mock 注入進去。

StudentService 只依賴 StudentRepository，所以宣告一個 @Mock 即可。
Service 有幾個依賴，就要宣告幾個 @Mock，缺一個就是 null。
-->

---

## Mockito — @ExtendWith + @Mock 用法（2/2）

```java
    @Test
    void getStudentById_存在的ID_回傳StudentResponse() {
        // Arrange：設定 Mock 行為
        Student po = new Student();
        po.setId(1); po.setName("Alice"); po.setScore(85);
        when(studentRepository.findById(1))
            .thenReturn(Optional.of(po));

        // Act：呼叫被測方法
        StudentResponse result = studentService.getStudentById(1);

        // Assert：驗證結果
        assertNotNull(result);
        assertEquals("Alice", result.getName());
        verify(studentRepository, times(1)).findById(1);
    }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>Arrange / Act / Assert（AAA）：</b> 測試方法的標準三段式結構，先準備資料、再執行、最後驗證。</div>

<!--
when(...).thenReturn(...) 告訴 Mock：如果有人呼叫你這個方法，就回傳這個值。

verify 確認 studentRepository.findById 有被呼叫一次，這樣才完整測到 getStudentById 的行為。

AAA 是業界標準寫法，養成習慣讓測試更易讀。
-->

---

## Mockito — 常用 API 速查

| API | 說明 |
|-----|------|
| `when(mock.method()).thenReturn(value)` | 設定回傳值 |
| `when(mock.method()).thenThrow(exception)` | 設定拋出例外 |
| `doNothing().when(mock).method()` | void 方法什麼都不做 |
| `verify(mock).method()` | 驗證方法有被呼叫 |
| `verify(mock, times(2)).method()` | 驗證方法被呼叫 n 次 |
| `verify(mock, never()).method()` | 驗證方法從未被呼叫 |
| `any()`, `anyLong()`, `anyString()` | 參數匹配器（任意值） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提醒：</b> <code>verify</code> 讓你驗證互動行為，不只是回傳值。例如確認 Email 有被呼叫一次。</div>

<!--
verify 這個東西很重要，特別是測試那些沒有回傳值的方法，比如寄信、記錄 log。

你沒辦法 assert 它的回傳值，但你可以 verify 它有沒有被呼叫。

any() 系列的 matcher 讓你不用指定精確的參數值，只要型別對就好。
-->


---
layout: section
class: flex flex-col justify-center items-center text-center
---

## Part 5
# @SpringBootTest — 整合測試

<!--
剛才的 @MockitoBean 已經偷偷用到了 @SpringBootTest。

現在我們正式介紹它。

整合測試跟單元測試的差別是：整合測試真的會啟動（部分或完整的）Spring Context。
-->

---

## @SpringBootTest — 三種模式

| 模式 | 說明 | 適用情境 |
|------|------|----------|
| `@SpringBootTest` | 啟動完整 Spring Context | Service、Repository 整合測試 |
| `@WebMvcTest(XxxController.class)` | 只啟動 Web 層（Controller） | Controller 測試，速度快 |
| `@DataJpaTest` | 只啟動 JPA 相關 Bean + H2 | Repository 測試 |

```java
@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StudentService studentService;
}
```

<!--
這三個模式我建議依照情境選：

測 Controller，用 @WebMvcTest，它很快，因為不會啟動整個 Context。
測 Repository，用 @DataJpaTest，它用內嵌的 H2 資料庫，速度也不慢。
要做端對端整合測試，才用完整的 @SpringBootTest。

@SpringBootTest 啟動最慢，不要所有測試都用它。
-->

---

## 本節範例情境：StudentController 層

沿用 ch37 的 `StudentController` 與 `StudentResponse`：

```java
@Service
public class StudentService {
    public StudentResponse getStudentById(Integer id) {
        // 實際查詢資料庫，此處簡化
        StudentResponse resp = new StudentResponse();
        resp.setId(id); resp.setName("Alice"); resp.setScore(85);
        return resp;
    }
}

@RestController
public class StudentController {
    @Autowired
    private StudentService studentService;

    @GetMapping("/students/{id}")
    public StudentResponse getById(@PathVariable("id") Integer id) {
        return studentService.getStudentById(id);
    }
}
```

<!--
@WebMvcTest 只啟動 Web 層，StudentService 不會被建立，
所以測試中要用 @MockitoBean 提供假的 StudentService。
-->

---

## @WebMvcTest — Controller 測試範例

```java
@WebMvcTest(StudentController.class)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private StudentService studentService;

    @Test
    void getById_存在的ID_回傳200() throws Exception {
        StudentResponse resp = new StudentResponse();
        resp.setId(1); resp.setName("Alice"); resp.setScore(85);
        when(studentService.getStudentById(1)).thenReturn(resp);

        mockMvc.perform(get("/students/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Alice"));
    }
}
```

<!--
MockMvc 讓你可以模擬 HTTP 請求，而不用真的啟動伺服器。

perform() 模擬請求，andExpect() 驗證回應。

jsonPath() 讓你可以用 JSON 路徑語法來驗證回應 body 的內容，非常好用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

## Part 6
# SLF4J + Logback 日誌體系

<!--
好，測試講完了，我們來聊日誌。

日誌的概念很簡單：就是把程式在執行時發生了什麼事情，用文字記錄下來。

但「怎麼記」是有學問的。
-->

---

## 為什麼日誌很重要？

程式在正式環境出問題的時候，你不能 step-through debug，唯一能依賴的就是**日誌**。

| 情境 | 沒有日誌 | 有日誌 |
|------|----------|--------|
| API 突然回傳 500 | 不知道為什麼 | 看 log 找到是哪行炸的 |
| 某個功能間歇性失敗 | 完全無從追查 | log 顯示是 DB timeout |
| 使用者說「我付款失敗」 | 無法重現 | 找到當時的 request log |
| 效能問題 | 猜測 | log 顯示哪個查詢慢 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>類比：</b> 日誌就像飛機的黑盒子，平時不起眼，出事了就是你的救命仙丹。</div>

<!--
我常說：一個不寫 log 的後端工程師，就像一個不留存根的會計師。

出問題的時候，你的 log 就是你的證據，也是你的偵探工具。

Spring Boot 預設整合的是 SLF4J + Logback，我們來看怎麼用。
-->

---

## SLF4J + Logback — 架構說明

| 角色 | 說明 |
|------|------|
| SLF4J | Simple Logging Facade for Java，日誌的**介面** |
| Logback | Spring Boot 預設的日誌**實作** |
| 優點 | 程式碼只依賴 SLF4J 介面，未來換實作不需改程式碼 |

SLF4J 與 Logback 的關係，就像 JDBC 和資料庫驅動：程式碼寫 SLF4J，底層換 Log4j2 也不需改程式碼。

<!--
SLF4J 是介面層，Logback 是實作層。

Spring Boot 預設整合 Logback，不需要額外設定，加入 spring-boot-starter 就自動有了。
-->

---

## SLF4J + Logback — 基本用法

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
    private static final Logger log =
        LoggerFactory.getLogger(StudentService.class);
    @Autowired
    private StudentRepository studentRepository;

    public StudentResponse createStudent(CreateStudentRequest req) {
        log.debug("建立學生，name={}, score={}",
            req.getName(), req.getScore());
        Student po = new Student();
        po.setName(req.getName());
        po.setScore(req.getScore());
        Student saved = studentRepository.save(po);
        log.info("學生建立成功，id={}", saved.getId());
        return toResponse(saved);   // toResponse 定義同 ch37
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>用 <code>{}</code> 佔位符</b>，不要字串串接。Log level 未開啟時，Logback 不會做字串運算，效能更好。</div>

<!--
如果你用 Lombok，可以在 class 上加 @Slf4j，它會自動幫你產生 log 變數，不需要那兩行宣告。

注意用 {} 佔位符，不要用字串串接，這樣當 log level 沒開啟時，就不會浪費時間做字串運算。
-->

---

## Log Level — 從低到高

| Level | 用途 | 預設顯示 |
|-------|------|----------|
| `TRACE` | 最細節，幾乎不用 | ✗ |
| `DEBUG` | 開發階段除錯資訊 | ✗ |
| `INFO` | 重要的業務事件 | ✓ |
| `WARN` | 可接受但需注意的問題 | ✓ |
| `ERROR` | 發生錯誤，需要處理 | ✓ |

設定某個 level，該 level **及以上**的訊息都會輸出。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>原則：</b> Production 用 INFO，開發除錯時用 DEBUG，不要在 Production 開 DEBUG（log 量太大會拖慢效能）。</div>

<!--
這個 level 的概念很重要，面試也很常問。

設 INFO 的意思是：我只要看 INFO 以上（含 WARN、ERROR），DEBUG 和 TRACE 不要輸出。

Production 開 DEBUG 是常見的新手錯誤，log 量暴增，I/O 爆掉，系統變慢。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

## Part 7
# application.properties 日誌設定

<!--
知道怎麼寫 log 之後，我們要知道怎麼設定 log 的行為。

Spring Boot 的 log 設定可以直接寫在 application.properties，不需要額外的 XML。
-->

---

## 常用日誌設定

```properties
# 全域 log level（預設 INFO）
logging.level.root=INFO

# 指定 package 的 log level
logging.level.com.example.service=DEBUG
logging.level.org.springframework.web=WARN
logging.level.org.hibernate.SQL=DEBUG

# 輸出到檔案
logging.file.name=logs/app.log

# 檔案滾動（每個最大 10MB，保留 7 天）
logging.logback.rollingpolicy.max-file-size=10MB
logging.logback.rollingpolicy.max-history=7
```

<!--
logging.level.root 是全域設定，通常設 INFO。

然後你可以針對特定的 package 設定不同的 level，例如你的 service 層可以設 DEBUG，方便除錯。

logging.file.name 指定日誌輸出到哪個檔案。不設的話，只輸出到 console。
-->

---

## 日誌設定 — 常用參數表

| 設定 | 說明 |
|------|------|
| `logging.level.root` | 全域 log level |
| `logging.level.<package>` | 特定 package 的 log level |
| `logging.file.name` | 輸出到指定檔案路徑 |
| `logging.file.path` | 輸出到指定目錄（預設檔名 spring.log） |
| `logging.logback.rollingpolicy.max-file-size` | 單一 log 檔最大大小 |
| `logging.logback.rollingpolicy.max-history` | 保留天數 |
| `logging.logback.rollingpolicy.total-size-cap` | 所有 log 檔的總大小上限 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提醒：</b> <code>logging.file.name</code> 和 <code>logging.file.path</code> 不能同時設定，優先使用 <code>logging.file.name</code>。</div>

<!--
如果你需要更細緻的 log 格式控制，可以在 resources 目錄下放一個 logback-spring.xml，優先級比 application.properties 高。

但對大多數應用程式來說，application.properties 的設定已經夠用了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

## Part 8
# 實作練習

<!--
理論說了很多，我們來動手做兩個練習。

第一個練習專注在 JUnit 6 + Mockito，第二個練習專注在日誌設定。
-->

---
layout: default
---

# 練習一：問卷 Service 的單元測試

**情境：** 問卷系統的核心規則是「狀態計算」與「只有未發佈 / 尚未開始的問卷能修改、刪除」。這些規則出錯，後台會誤刪進行中的問卷，所以一定要有測試保護。

**任務：**

1. `SurveyStatusTest`（純 JUnit，不用 Mockito）：測試 `SurveyStatus.of(published, start, end, today)` 的邊界
   - 未發佈 → `DRAFT`；開始日在未來 → `NOT_STARTED`
   - **開始當天、結束當天**都是 `ONGOING`；結束日已過 → `ENDED`
   - `isEditable()`：只有 `DRAFT`、`NOT_STARTED` 為 `true`
2. `SurveyServiceTest`（`@ExtendWith(MockitoExtension.class)`，Mock 掉 `SurveyRepository`）：
   - `save`：單選題少於兩個選項 → 丟 `BizException`
   - `save`：問卷已在進行中 → `BizException`，錯誤碼是 `SURVEY_NOT_EDITABLE`
   - `deleteAll`：只要有一份進行中，整批不刪 → `assertThrows`，且 `verify(surveyRepository, never()).deleteAll(any())`
3. 確認全部綠燈 ✓

<div class="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 4 的測試依賴：</b>以上只需要 <code>spring-boot-starter-test</code>。若之後要用 <code>@WebMvcTest</code>、<code>@DataJpaTest</code>，要另外加 <code>spring-boot-starter-webmvc-test</code>、<code>spring-boot-starter-data-jpa-test</code>。
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
這個練習是最基本的 Service 層測試模式，而且測的是問卷系統最重要的商業規則。

為什麼狀態計算要測？因為「進行中」的邊界很容易寫錯：開始當天算不算進行中？結束當天呢？需求文件寫的是兩天都算，如果程式寫成 isBefore 或 isAfter 差一天，就會有問卷在最後一天突然打不開。這種邊界錯誤，人工測試很難發現，單元測試最擅長。

還記得第 37 章，我們特別讓 of 方法接收 today 參數，而不是在方法裡呼叫 LocalDate.now() 嗎？現在就看到好處了：測試的時候，傳入固定的日期，測試結果永遠一樣，不會因為今天是幾號而改變。

SurveyService 的測試，Mock 掉 Repository，不需要真的連資料庫。測試的是 Service 裡的判斷邏輯：進行中的問卷不能修改，批次刪除只要有一份不能刪，整批都不刪。特別注意最後那個 verify never：我們不只要驗證有丟例外，還要驗證「沒有刪」，這才是真正的保證。
-->

---
layout: default
---

# 練習一：解題提示

1. `SurveyStatusTest` 準備一個固定的 `today = LocalDate.of(2025, 1, 10)`，其他日期都用 `today.plusDays(n)` 算
2. 邊界測試：`SurveyStatus.of(true, today, today.plusDays(5), today)`（開始當天）、`of(true, today.minusDays(5), today, today)`（結束當天）
3. `SurveyServiceTest`：`@Mock SurveyRepository`、`@InjectMocks SurveyService`
4. 建一個「進行中」的 `Survey`：`published = true`，開始日是昨天、結束日是明天，`when(surveyRepository.findById(1)).thenReturn(Optional.of(...))`
5. 驗證錯誤碼：`BizException e = assertThrows(...)`，再 `assertEquals(RspCode.SURVEY_NOT_EDITABLE, e.getCode())`
6. 驗證「沒有被呼叫」：`verify(mock, never()).方法(any())`

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
步驟 4：測試資料要用相對於 LocalDate.now() 的日期，因為 SurveyService 裡是呼叫 LocalDate.now() 計算狀態，我們沒辦法傳入固定的日期。

這也是一個很好的設計反思：Service 直接呼叫 LocalDate.now()，讓測試變得比較不確定。進階的做法，是注入一個 Clock 物件，測試的時候換成固定時間的 Clock。這裡先用最簡單的相對日期，讓大家專心練習測試的寫法。

步驟 5：只 assertThrows(BizException.class) 是不夠的，因為 BizException 有很多種錯誤碼，我們要確認是「正確的那一種」被丟出來。
-->

---
layout: default
---

# 練習一：解答（SurveyStatusTest）
### `src/test/java/.../entity/SurveyStatusTest.java`

```java
class SurveyStatusTest {

    private final LocalDate today = LocalDate.of(2025, 1, 10);

    @Test
    void 未發佈不論日期都是DRAFT() {
        assertEquals(SurveyStatus.DRAFT, SurveyStatus.of(false, today.minusDays(5), today.plusDays(5), today));
    }

    @Test
    void 開始日期在未來是NOT_STARTED() {
        assertEquals(SurveyStatus.NOT_STARTED, SurveyStatus.of(true, today.plusDays(1), today.plusDays(9), today));
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
這五個測試方法，對應狀態計算的四種結果，加上可編輯的判斷。
-->

---
layout: default
---

# 練習一：解答（SurveyStatusTest）（續）
### `src/test/java/.../entity/SurveyStatusTest.java`

```java
    // ... 接上一頁

    @Test
    void 開始當天與結束當天都算ONGOING() {
        assertEquals(SurveyStatus.ONGOING, SurveyStatus.of(true, today, today.plusDays(5), today));
        assertEquals(SurveyStatus.ONGOING, SurveyStatus.of(true, today.minusDays(5), today, today));
    }

    @Test
    void 結束日期已過是ENDED() {
        assertEquals(SurveyStatus.ENDED, SurveyStatus.of(true, today.minusDays(9), today.minusDays(1), today));
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
方法名稱用中文寫，是台灣教學常見的寫法：測試失敗的時候，報告上直接就是一句白話文，「開始日期在未來是 NOT_STARTED」，一看就知道是哪個規則壞了。

第三個測試，同時驗證開始當天和結束當天，是整個測試最重要的地方，也就是「邊界」。寫測試的時候，值得特別注意的，永遠是邊界：剛好等於、剛好差一天。
-->

---
layout: default
---

# 練習一：解答（SurveyStatusTest）（續）
### `src/test/java/.../entity/SurveyStatusTest.java`

```java
// ... 接上一頁

    @Test
    void 只有DRAFT與NOT_STARTED可以編輯() {
        assertTrue(SurveyStatus.DRAFT.isEditable());
        assertTrue(SurveyStatus.NOT_STARTED.isEditable());
        assertFalse(SurveyStatus.ONGOING.isEditable());
        assertFalse(SurveyStatus.ENDED.isEditable());
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
today 是在測試類別最上面的欄位，固定為 2025 年 1 月 10 日，測試永遠可以重現。這個測試完全不需要 Spring，不需要 Mockito，執行速度是毫秒等級的，這就是單元測試最理想的樣子。
-->

---
layout: default
---

# 練習一：解答（SurveyServiceTest）
### `src/test/java/.../service/SurveyServiceTest.java`

```java
@ExtendWith(MockitoExtension.class)
class SurveyServiceTest {

    @Mock
    private SurveyRepository surveyRepository;

    @InjectMocks
    private SurveyService surveyService;

    private SurveyDTO validDto() {
        OptionDTO a = new OptionDTO();
        a.setLabel("喜歡");
        OptionDTO b = new OptionDTO();
        b.setLabel("不喜歡");
        QuestionDTO q = new QuestionDTO();
        q.setTitle("喜歡嗎");
        q.setType(QuestionType.SINGLE);
        q.setOptions(List.of(a, b));

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
測試類別的骨架跟前面的範例一樣：@ExtendWith(MockitoExtension.class)、@Mock、@InjectMocks。
-->

---
layout: default
---

# 練習一：解答（SurveyServiceTest）（續）
### `src/test/java/.../service/SurveyServiceTest.java`

```java
    // ... 接上一頁

        SurveyDTO dto = new SurveyDTO();
        dto.setTitle("新問卷");
        dto.setDescription("說明");
        dto.setStartDate(LocalDate.now().plusDays(2));
        dto.setEndDate(LocalDate.now().plusDays(7));
        dto.setQuestions(List.of(q));
        return dto;
    }

    private Survey ongoingSurvey() {
        Survey s = new Survey();
        s.setId(1);
        s.setTitle("進行中");
        s.setPublished(true);
        s.setStartDate(LocalDate.now().minusDays(1));
        s.setEndDate(LocalDate.now().plusDays(1));
        return s;
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
validDto 和 ongoingSurvey 是兩個測試資料的輔助方法。把「建立一個合法的 DTO」寫成一個方法，每個測試再依照自己的需要，只修改一個欄位，這樣每個測試看起來都很短，而且一眼就能看出「這個測試改了什麼」，例如選項只剩一個。
-->

---
layout: default
---

# 練習一：解答（SurveyServiceTest）（續）
### `src/test/java/.../service/SurveyServiceTest.java`

```java
    // ... 接上一頁

    @Test
    void 單選題少於兩個選項要被擋下() {
        SurveyDTO dto = validDto();
        dto.getQuestions().get(0).setOptions(List.of(dto.getQuestions().get(0).getOptions().get(0)));
        assertThrows(BizException.class, () -> surveyService.save(dto, false));
    }

    @Test
    void 進行中的問卷不能修改() {
        SurveyDTO dto = validDto();
        dto.setId(1);
        when(surveyRepository.findById(1)).thenReturn(Optional.of(ongoingSurvey()));
        BizException e = assertThrows(BizException.class, () -> surveyService.save(dto, false));
        assertEquals(RspCode.SURVEY_NOT_EDITABLE, e.getCode());
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
「進行中的問卷不能修改」這個測試，我們把 findById 設定成回傳一個進行中的問卷，然後呼叫 save，預期丟出 BizException，而且錯誤碼是 SURVEY_NOT_EDITABLE。

最後一個批次刪除的測試，用 verify never，驗證 deleteAll 一次都沒有被呼叫。
-->

---
layout: default
---

# 練習一：解答（SurveyServiceTest）（續）
### `src/test/java/.../service/SurveyServiceTest.java`

```java
// ... 接上一頁

    @Test
    void 批次刪除只要有一份進行中就整批不刪() {
        when(surveyRepository.findAllById(List.of(1))).thenReturn(List.of(ongoingSurvey()));
        assertThrows(BizException.class, () -> surveyService.deleteAll(List.of(1)));
        verify(surveyRepository, never()).deleteAll(any());
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
⚠️ 易錯點：Mockito 嚴格模式，如果你設定了一個 when，卻沒有被用到，測試會失敗，並且報 UnnecessaryStubbingException。所以每個 when，都要是這個測試真正需要的。
-->

---
layout: default
---

# 練習一（延伸）：DTO 驗證規則也要測
### `src/test/java/.../dto/SurveyDTOValidationTest.java`（選做）

```java
class SurveyDTOValidationTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private SurveyDTO valid() {
        SurveyDTO dto = new SurveyDTO();
        dto.setTitle("新問卷");
        dto.setDescription("說明");
        dto.setStartDate(LocalDate.now().plusDays(2));
        dto.setEndDate(LocalDate.now().plusDays(7));
        return dto;
    }

    private Set<String> messages(SurveyDTO dto) {
        return validator.validate(dto).stream().map(v -> v.getMessage()).collect(Collectors.toSet());
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
上一章 Validation 寫的驗證規則，也是需要測試的。好消息是，不需要啟動 Spring：Bean Validation 的 Validator，可以在測試裡直接建立，餵一個 DTO 進去，看回傳的違規訊息。
-->

---
layout: default
---

# 練習一（延伸）：DTO 驗證規則也要測（續）
### `src/test/java/.../dto/SurveyDTOValidationTest.java`（選做）

```java
    // ... 接上一頁

    @Test
    void 合法資料沒有錯誤() {
        assertTrue(messages(valid()).isEmpty());
    }

    @Test
    void 開始日期是今天要被擋下() {
        SurveyDTO dto = valid();
        dto.setStartDate(LocalDate.now());
        assertTrue(messages(dto).contains("開始日期必須晚於今天"));
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
這裡驗證了三件事：合法資料沒有錯誤、開始日期是今天會被擋下、結束日期不在開始日期之後會被擋下。

還記得 isEndAfterStart 這個 @AssertTrue 方法嗎？如果不小心改壞了它，這個測試就會立刻告訴我們。
-->

---
layout: default
---

# 練習一（延伸）：DTO 驗證規則也要測（續）
### `src/test/java/.../dto/SurveyDTOValidationTest.java`（選做）

```java
// ... 接上一頁

    @Test
    void 結束日期不在開始日期之後要被擋下() {
        SurveyDTO dto = valid();
        dto.setEndDate(dto.getStartDate());
        assertTrue(messages(dto).contains("結束日期必須在開始日期之後"));
    }

    @Test
    void 標題空白與過長要被擋下() {
        SurveyDTO dto = valid();
        dto.setTitle(" ");
        assertTrue(messages(dto).contains("問卷名稱尚未填寫"));
        dto.setTitle("x".repeat(51));
        assertTrue(messages(dto).contains("問卷名稱最多 50 字"));
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
這類測試很便宜，卻可以保護整個系統最前面的一道關卡，非常值得。
-->

---
layout: default
---

# 練習二：日誌設定

**情境：** 作答送出後偶爾出現神秘的 500 錯誤，但你完全不知道發生了什麼事。而且目前 `GlobalExceptionHandler` 裡是 `e.printStackTrace()`，Production 環境看不到。

**任務：**

1. 在 `ResponseService.submit()` 加入適當的 log：
   - `DEBUG`：方法進入點，記錄 `surveyId`（**不要記錄姓名、手機、Email 等個資**）
   - `INFO`：作答送出成功，記錄 `surveyId`、`responseId`、答案筆數
   - `WARN`：重複填寫被資料庫擋下，記錄 `surveyId` 與**遮罩後**的 Email（`a1***@example.com`）
2. 把 `GlobalExceptionHandler` 的 `e.printStackTrace()` 換成 `log.error(...)`（`ERROR`：記錄 exception message，並印出完整 stack trace）
3. 在 `application.properties` 設定 `com.example.survey` 的 level 為 `DEBUG`，其他維持 `INFO`，輸出到 `logs/dynamic-survey.log`，每檔最大 10MB，保留 30 天
4. 送出一份作答，確認 log 檔出現 DEBUG 與 INFO；重複送出一次，確認出現 WARN

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這個練習有標準答案，但也有好的 log 和壞的 log 之分。

好的 log：清楚記錄是誰做了什麼，結果是什麼。壞的 log：只寫「error occurred」，或者根本不寫。

這個練習多了一個非常重要的觀念：log 不能寫個資。姓名、手機、Email 屬於個人資料，寫進 log 檔，就可能被有權限看 log 的人（例如維運人員、第三方的日誌平台）看到，違反個資保護的原則。所以我們只記錄 id，或是遮罩過的資料。

還有 printStackTrace 為什麼不好？它印到標準錯誤輸出，沒有時間、沒有 level、沒有執行緒名稱，沒辦法用 logging.level 控制，也不會寫進 log 檔，是新手最常見的壞習慣。
-->

---
layout: default
---

# 練習二：解題提示

1. 宣告 Logger：`private static final Logger log = LoggerFactory.getLogger(ResponseService.class);`
2. 用 `{}` 佔位符，不要用字串相加：`log.debug("送出作答，surveyId={}", surveyId)`
3. `log.error("...：{}", e.getMessage(), e)` — 最後傳入 `e`，Logback 才印出完整 stack trace
4. 遮罩 Email：只保留前 2 碼與 `@` 之後的網域，寫成一個 `maskEmail` 小方法
5. 記得同時設定 `logging.level.root=INFO`，避免第三方套件（Hibernate、Tomcat）的 DEBUG 洗版

```properties
logging.level.root=INFO
logging.level.com.example.survey=DEBUG
logging.file.name=logs/dynamic-survey.log
logging.logback.rollingpolicy.max-file-size=10MB
logging.logback.rollingpolicy.max-history=30
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
為什麼用 {} 佔位符，不用字串相加？因為如果 log level 沒有開啟，字串相加還是會先執行，白白浪費效能；佔位符只有在真的要輸出的時候，才會組字串。

注意 log.error 的最後那個 e：把 exception 物件也傳進去，Logback 會幫你印出完整的 stack trace。只傳 e.getMessage() 是不夠的，stack trace 才是你找問題的關鍵。

記得把 logs/ 資料夾加進 .gitignore，log 檔不應該被提交到 Git。
-->

---
layout: default
---

# 練習二：解答（ResponseService）
### `service/ResponseService.java`

```java
@Service
@RequiredArgsConstructor
public class ResponseService {

    private static final Logger log = LoggerFactory.getLogger(ResponseService.class);
    // ...

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
DEBUG 記錄進入點，只記 surveyId，不記使用者輸入的姓名、手機、Email。
-->

---
layout: default
---

# 練習二：解答（ResponseService）（續）
### `service/ResponseService.java`

```java
    // ... 接上一頁

    @Transactional
    public Integer submit(Integer surveyId, HttpSession session) {
        log.debug("送出作答，surveyId={}", surveyId);   // DEBUG：進入點（不記個資）
        // ... 讀取暫存、check、建立 SurveyResponse（同練習 2）
        try {
            responseRepository.saveAndFlush(r);
        } catch (DataIntegrityViolationException e) {
            log.warn("重複填寫被資料庫擋下，surveyId={}, email={}",
                    surveyId, maskEmail(r.getEmail()));                  // WARN
            throw new BizException(RspCode.ALREADY_RESPONDED);
        }
        draftService.clearResponse(session, surveyId);
        log.info("作答送出成功，surveyId={}, responseId={}, answers={}",
                surveyId, r.getId(), r.getAnswers().size());             // INFO
        return r.getId();
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
WARN 放在 catch DataIntegrityViolationException 裡：這種情況不是程式的錯，是使用者重複送出，或是兩個請求同時進來，所以用 WARN，不是 ERROR。ERROR 留給真正「不該發生」的情況。Email 用 maskEmail 遮罩過才寫進 log。

INFO 記錄成功事件，包含 surveyId、responseId、答案筆數。日後如果客訴說「我明明送出了」，我們可以用 responseId 在資料庫查到，也可以在 log 裡查到那筆請求。
-->

---
layout: default
---

# 練習二：解答（ResponseService）（續）
### `service/ResponseService.java`

```java
// ... 接上一頁

    /** log 不可以寫入完整個資：a1@example.com → a1***@example.com */
    private static String maskEmail(String email) {
        int at = email.indexOf('@');
        return at <= 2 ? "***" + email.substring(at) : email.substring(0, 2) + "***" + email.substring(at);
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
第 44 章加入登入功能之後，如果想在 log 裡標示「是誰送出的」，也請用遮罩過的 Email，或是使用者 id，不要記完整的個資。
-->

---
layout: default
---

# 練習二：解答（GlobalExceptionHandler 與設定）

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    // ... 其他 handler 不變

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse<Void>> handleOther(Exception e) {
        // ERROR：最後一個參數傳 e，才會印出完整 stack trace
        log.error("未預期的錯誤：{}", e.getMessage(), e);
        return ResponseEntity.status(RspCode.SERVER_ERROR.getStatus())
                .body(AppResponse.error(RspCode.SERVER_ERROR));   // 回給前端的訊息不含細節
    }
}
```

```properties
# 自己的套件開 DEBUG，其餘維持 INFO，避免第三方套件洗版
logging.level.root=INFO
logging.level.com.example.survey=DEBUG

# 輸出到檔案，每檔最大 10MB，保留 30 天
logging.file.name=logs/dynamic-survey.log
logging.logback.rollingpolicy.max-file-size=10MB
logging.logback.rollingpolicy.max-history=30
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
GlobalExceptionHandler 的最後一道防線，現在用 log.error 取代 printStackTrace，並且最後一個參數傳 e。細節寫進日誌，給前端的訊息維持「系統發生錯誤」，不洩漏資料庫結構等敏感資訊。

application.properties 的設定：root 維持 INFO，只有我們自己的套件 com.example.survey 開 DEBUG，第三方套件不會洗版。logging.file.name 讓 log 同時寫到檔案，rolling policy 控制檔案大小與保留天數。
-->

---
layout: default
---

# 練習二：解答（GlobalExceptionHandler 與設定）（續）

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證：</b>送出作答後，<code>logs/dynamic-survey.log</code> 出現 DEBUG「送出作答」與 INFO「作答送出成功」；同一 Email 再送一次，出現 WARN（Email 已遮罩）。
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
上一章 Validation 的解答裡，我們把 handleOther 寫成 printStackTrace，現在補上正式的做法。這是很典型的專案演進：一開始先讓功能動起來，再逐步把品質補上。

如果你想看到 Hibernate 實際送出的 SQL，可以暫時加上 spring.jpa.show-sql=true，開發時很有幫助，但正式環境要關掉。
-->

---

# 章節總結

| 主題 | 核心要點 |
|------|----------|
| JUnit 6 | `@Test`、`@BeforeEach`、`@AfterEach`，Spring Boot 4.x 內建，不再用 `@RunWith` |
| Assertions | `assertEquals`、`assertThrows`、`assertAll`，注意 expected/actual 順序 |
| Mockito | `@ExtendWith(MockitoExtension.class)`、`@Mock`、`@InjectMocks`、`when().thenReturn()` |
| @MockitoBean | 需要 Spring Context 時，用 `@MockitoBean` 替換真實 Bean |
| @SpringBootTest | 完整整合測試；Controller 測試用 `@WebMvcTest`；JPA 用 `@DataJpaTest` |
| SLF4J + Logback | Spring Boot 預設整合，透過 SLF4J 介面寫 log |
| Log Level | TRACE < DEBUG < INFO < WARN < ERROR，Production 用 INFO |
| 日誌設定 | `logging.level.*`、`logging.file.name`、rolling policy |

<!--
這張表可以當作快速複習的 cheatsheet。

測試和日誌是工程師的基本修養，不是可有可無的附加功能。

養成寫測試的習慣，不是為了公司，是為了你自己未來不用在凌晨兩點 debug。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
