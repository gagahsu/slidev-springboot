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
- **JUnit 5 基礎** — `@Test`、`@BeforeEach`、`@AfterEach`
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

OK 那我們開始看 JUnit 5 怎麼用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

## Part 2
# JUnit 5 基礎

<!--
JUnit 5 是 Java 世界最主流的測試框架，Spring Boot 3.x 預設就整合好了，不需要額外加依賴。

我們來看最基本的三個 annotation。
-->

---

## Spring Boot 測試的檔案結構

測試檔案放在 `src/test/java`，**套件路徑與主程式完全對應**：

```
src/
├── main/java/com/example/demo/
│   ├── controller/
│   │   └── UserController.java
│   └── service/
│       └── UserService.java
└── test/java/com/example/demo/
    ├── controller/
    │   └── UserControllerTest.java    ← 測試 UserController
    └── service/
        └── UserServiceTest.java       ← 測試 UserService
```

`spring-boot-starter-test` 已內建 JUnit 5、Mockito、AssertJ，Spring Initializr 預設自動加入，不需手動設定。

<!--
這個結構很重要，很多新手不知道測試檔案要放哪裡。

src/test/java 的套件結構要和 src/main/java 完全一致，這樣測試才能存取到 package-private 的成員。

命名慣例是在原類別名稱後面加 Test，例如 UserService 對應 UserServiceTest。
-->

---

## JUnit 5 — 測試類別的骨架

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
注意這邊我用的是 JUnit 5（Jupiter），不是舊的 JUnit 4。

Spring Boot 3.x 全面採用 JUnit 5，所以不需要加 @RunWith，那是 JUnit 4 的東西。

測試方法命名我習慣用「方法名_情境_預期結果」，這樣一眼就知道在測什麼。
-->

---

## JUnit 5 — 生命週期 Annotation

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

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>為什麼要 static？</b> JUnit 5 每個 <code>@Test</code> 都會建立一個<b>新的測試類別實例</b>，所以在任何實例存在之前就要執行的 <code>@BeforeAll</code> 只能是 static 方法。<code>@BeforeEach</code> 則不需要，因為它在實例建立後才跑。</div>

<!--
忘記加 static 是新手最常遇到的編譯錯誤之一。

JUnit 5 預設的 test lifecycle 是 PER_METHOD，也就是每個測試方法建立一個新實例。
如果加上 @TestInstance(TestInstance.Lifecycle.PER_CLASS)，@BeforeAll 就不需要 static 了，但這是進階用法，先記住預設要加 static 就好。
-->

---

## JUnit 5 — 進階控制 Annotation

| Annotation | 用途 |
|------------|------|
| `@Disabled` | 暫時停用某個測試 |
| `@DisplayName` | 為測試取一個人類可讀的名稱 |
| `@Nested` | 在類別內再建立巢狀測試群組 |

```java
@DisplayName("使用者服務測試")
class UserServiceTest {

    @Nested
    @DisplayName("查詢使用者")
    class FindUser {

        @Test
        @Disabled("尚未實作此功能")
        void findByEmail_尚未實作() { }
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

JUnit 5 的 Assertions 類別提供了一堆靜態方法，我們來看最常用的幾個。
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

## 本節範例情境（1/2）：Model 與依賴介面

```java
// 資料模型（Java 16+ record）
public record User(Long id, String name) {}
public record Order(Long id, Long userId, String item) {}

// Repository — 依賴資料庫，測試時要 Mock
public interface UserRepository extends JpaRepository<User, Long> {}

// EmailService — 會真的寄信，測試時要 Mock
public interface EmailService {
    void sendConfirmation(Order order);
}
```

這三個都是 `OrderService` 的**外部依賴**，單元測試時不應該真正呼叫它們。

<!--
User 和 Order 用 record 宣告，簡潔不囉嗦。

UserRepository 繼承 JpaRepository，背後需要資料庫連線。
EmailService 是自訂介面，呼叫後會真的寄出 Email。

這兩個依賴就是我們等等要 Mock 掉的目標。
-->

---

## 本節範例情境（2/2）：OrderService 實作

```java
@Service
public class OrderService {
    private final UserRepository userRepository;
    private final EmailService emailService;

    public OrderService(UserRepository userRepository,
                        EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public Order createOrder(Long userId, String item) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Order order = new Order(1L, userId, item);
        emailService.sendConfirmation(order);
        return order;
    }
}
```

<!--
OrderService 透過建構子注入依賴，這樣 Mockito 的 @InjectMocks 才能把 Mock 注入進去。

createOrder 內部呼叫了 userRepository 和 emailService，
所以測試時這兩個都需要 Mock。
-->

---

## 為什麼需要 Mock？

想像你在測試 `OrderService.createOrder()`，但它內部會呼叫：

| 依賴 | 問題 |
|------|------|
| `UserRepository.findById()` | 需要資料庫連線 |
| `EmailService.sendConfirmation()` | 會真的寄出 Email |

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

<div class="mt-2 mb-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> Spring Boot 3.x 使用 JUnit 5，<code>@ExtendWith</code> 取代了 JUnit 4 的 <code>@RunWith</code>。網路上舊文章若出現 <code>@RunWith(MockitoJUnitRunner.class)</code>，換成 <code>@ExtendWith(MockitoExtension.class)</code> 即可。</div>

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private UserRepository userRepository;  // 假的 Repository

    @Mock
    private EmailService emailService;      // 假的 EmailService

    @InjectMocks
    private OrderService orderService;      // 真實的 Service，Mock 自動注入
}
```

<!--
@Mock 建立假物件，@InjectMocks 建立真實的 Service 並把 Mock 注入進去。

OrderService 有幾個依賴，就要宣告幾個 @Mock，缺一個就是 null。
-->

---

## Mockito — @ExtendWith + @Mock 用法（2/2）

```java
    @Test
    void createOrder_使用者存在_建立成功() {
        // Arrange：設定 Mock 行為
        User fakeUser = new User(1L, "Alice");
        when(userRepository.findById(1L))
            .thenReturn(Optional.of(fakeUser));

        // Act：呼叫被測方法
        Order result = orderService.createOrder(1L, "item-A");

        // Assert：驗證結果
        assertNotNull(result);
        verify(emailService, times(1)).sendConfirmation(result);
    }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>Arrange / Act / Assert（AAA）：</b> 測試方法的標準三段式結構，先準備資料、再執行、最後驗證。</div>

<!--
when(...).thenReturn(...) 告訴 Mock：如果有人呼叫你這個方法，就回傳這個值。

verify 確認 emailService.sendConfirmation 有被呼叫一次，這樣才完整測到 createOrder 的行為。

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
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;
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

## 本節範例情境：UserController 層

```java
public record UserDto(Long id, String name) {}

@Service
public class UserService {
    public UserDto findById(Long id) {
        // 實際查詢資料庫，此處簡化
        return new UserDto(id, "Alice");
    }
}

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable("id") Long id) {
        return userService.findById(id);
    }
}
```

<!--
@WebMvcTest 只啟動 Web 層，UserService 不會被建立，
所以測試中要用 @MockitoBean 提供假的 UserService。
-->

---

## @WebMvcTest — Controller 測試範例

```java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Test
    void getUser_存在的ID_回傳200() throws Exception {
        when(userService.findById(1L))
            .thenReturn(new UserDto(1L, "Alice"));

        mockMvc.perform(get("/users/1"))
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
public class OrderService {
    private static final Logger log =
        LoggerFactory.getLogger(OrderService.class);

    public Order createOrder(Long userId, String item) {
        log.debug("建立訂單，userId={}, item={}", userId, item);
        Order order = new Order(1L, userId, item);
        log.info("訂單建立成功，orderId={}", order.id());
        return order;
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

第一個練習專注在 JUnit 5 + Mockito，第二個練習專注在日誌設定。
-->

---
layout: default
---

# 練習一：Service 層測試
### 任務說明

**情境：** 你有一個 `UserService`，其中有個方法 `getUserById(Long id)`，它會呼叫 `UserRepository.findById(id)`。

**任務：**

1. 建立 `UserServiceTest`，使用 `@ExtendWith(MockitoExtension.class)`
2. Mock 掉 `UserRepository`
3. 撰寫測試方法：
   - `getUserById_存在的ID_回傳UserDto`：Mock 回傳一個 `User`，驗證 `UserDto` 的欄位
   - `getUserById_不存在的ID_拋出例外`：Mock 回傳 `Optional.empty()`，驗證 `assertThrows`
4. 確認兩個測試都是綠燈 ✓

<!--
這個練習是最基本的 Service 層測試模式，幾乎每個 Spring Boot 專案都會有類似的寫法。

先不要急著寫，想一下測試的結構：setup 要做什麼，測試方法要驗證什麼。
-->

---
layout: default
---

# 練習一：解題提示
### 提示說明

1. 建立測試類別骨架：`@ExtendWith(MockitoExtension.class)`，`@Mock UserRepository`，`@InjectMocks UserService`
2. 正常路徑：`when(userRepository.findById(1L)).thenReturn(Optional.of(new User(...)))` → `assertEquals` 驗證欄位
3. 例外路徑：`when(userRepository.findById(99L)).thenReturn(Optional.empty())` → `assertThrows(UserNotFoundException.class, () -> ...)`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> 記得 Service 內部要在 id 找不到時拋出 <code>UserNotFoundException</code>，否則 assertThrows 會失敗。</div>

<!--
Step 3 是很多人卡住的地方：Service 要先有拋出例外的邏輯，測試才測得到。

這也是測試驅動開發（TDD）的思路：先寫測試，再寫讓測試通過的實作。
-->

---
layout: default
---

# 練習二：日誌設定
### 任務說明

**情境：** 你的 API 在 Production 有時候會有神秘的 500 錯誤，但你完全不知道發生了什麼事。

**任務：**

1. 在 `OrderService` 的 `createOrder()` 方法中，加入適當的 log：
   - `DEBUG`：方法進入點，記錄輸入參數
   - `INFO`：訂單建立成功，記錄訂單 ID
   - `WARN`：庫存量低於 10，記錄商品 ID
   - `ERROR`：建立失敗（catch 區塊），記錄 exception message
2. 在 `application.properties` 設定 `com.example.service` 的 level 為 `DEBUG`，輸出到 `logs/app.log`，每檔最大 10MB，保留 30 天

<!--
這個練習沒有標準答案，但有好的 log 和壞的 log 之分。

好的 log：清楚記錄是誰做了什麼，結果是什麼。
壞的 log：只寫 "error occurred" 或根本不寫。
-->

---
layout: default
---

# 練習二：解題提示
### 提示說明

1. 宣告 Logger：`private static final Logger log = LoggerFactory.getLogger(OrderService.class);`
2. 各 level 加 log：進入方法用 `debug`，成功用 `info`，低庫存用 `warn`，catch 區塊用 `error`
3. `log.error("Failed: {}", e.getMessage(), e)` — 最後傳入 `e` 讓 Logback 印出完整 stack trace

```properties
logging.level.com.example.service=DEBUG
logging.file.name=logs/app.log
logging.logback.rollingpolicy.max-file-size=10MB
logging.logback.rollingpolicy.max-history=30
```

<!--
注意 log.error 的最後那個 e：把 exception 物件也傳進去，Logback 會幫你印出完整的 stack trace。

只傳 e.getMessage() 是不夠的，stack trace 才是你找問題的關鍵。
-->

---

# 章節總結

| 主題 | 核心要點 |
|------|----------|
| JUnit 5 | `@Test`、`@BeforeEach`、`@AfterEach`，Spring Boot 3.x 不再用 `@RunWith` |
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
