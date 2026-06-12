---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 實戰演練：動態問卷系統
routeAlias: ch47
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
  /* 覆寫 style.css 的非對稱擴張，改為對稱擴張 */
  .slidev-layout pre, 
  .slidev-layout .shiki, 
  .slidev-layout .slidev-code {
    width: calc(100% + 16rem) !important;
    margin-left: 0 !important;
    margin-right: -16rem !important;
    padding: 1rem !important;
  }
  .slidev-layout code {
    font-size: 0.88em !important;
    line-height: 1.4 !important;
    white-space: pre !important; /* 關閉 style.css 的 pre-wrap 以增加寬度感 */
    word-break: normal !important;
  }
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Spring Boot Project Practice
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    實戰演練：動態問卷系統
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「從零到一，打造完整的前後端整合專案」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好！這堂課我們要進入最刺激的階段，就是將前面學到的所有技術——從 IoC、MVC 到 JPA、Security，全部融合在一起，實作出一個具備「動態問卷管理」與「會員系統」的完整後端 API。
這就像是我們學會了各種烹飪技巧後，現在要親自掌廚完成一整桌滿漢全席。準備好了嗎？我們開始吧！
-->

---
layout: default
---

# Outline

- **第一部分：環境設定與基礎架構** (Gradle, Properties, Common Response)
- **第二部分：問卷管理 (Admin CRUD)** (動態查詢、編輯、刪除)
- **第三部分：問卷填寫與作答流程** (Session 暫存、資料庫存取)
- **第四部分：資料統計與回饋** (作答詳情、統計報表)
- **第五部分：會員系統與安全機制** (JWT 註冊、登入與權限控管)

<!--
今天的課程會分成五大塊。
我們會先處理環境設定，確保專案能跑起來。
接著是管理端的問卷管理功能。
然後是重頭戲：如何讓使用者填寫問卷，以及如何優雅地處理暫存。
最後我們會實作統計報表和最核心的安全認證模組。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第一部分：環境設定與基礎架構

<!--
工欲善其事，必先利其器。
我們先把開發環境和統一的回應格式定義好，讓後面的開發事半功倍。
-->

---

# 專案依賴設定 (build.gradle)

| 依賴名稱 | 功能說明 |
| --- | --- |
| `spring-boot-starter-data-jpa` | 提供 JPA 支援與 Hibernate 實作 |
| `spring-boot-starter-webmvc` | 提供 REST API 開發與 MVC 架構支援 |
| `spring-boot-starter-validation` | 提供 @NotBlank, @Size 等資料驗證支援 |
| `spring-boot-starter-security` | 提供安全控管與加密支援 |

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-webmvc'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-security'
}
```

<!--
首先在 build.gradle 中加入必要的 starter。
這就像是幫我們的機器人裝上各種功能的零件：JPA 用來對接資料庫，WebMVC 處理 HTTP 請求，Validation 幫我們擋掉壞資料，Security 則是我們的前線警衛。
-->

---

# 專案依賴設定 — 擴充與工具

| 依賴名稱 | 功能說明 |
| --- | --- |
| `jjwt-api / impl / jackson` | JSON Web Token 的 API 規範與實作 |
| `lombok` | 使用註解自動產生 Getter/Setter (編譯時期) |
| `mysql-connector-j` | 連結 MySQL 資料庫的驅動程式 |
| `spring-boot-devtools` | 熱部署，修改程式碼後自動重啟 |

```groovy
dependencies {
    implementation 'io.jsonwebtoken:jjwt-api:0.11.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.11.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.11.5'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    runtimeOnly 'com.mysql:mysql-connector-j'
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
}
```

<!--
除了核心零件，我們還需要一些「高效能工具」。
JWT 是我們實作無狀態認證的關鍵；Lombok 幫我們省去寫 Getter/Setter 的力氣；MySQL 驅動則讓專案能跟資料庫溝通。
這就像是幫廚房裝上洗碗機和氣炸鍋，讓流程更順暢。
-->

---

# 專案依賴設定 — 單元測試

| 依賴名稱 | 功能說明 |
| --- | --- |
| `spring-boot-starter-test` | 提供 JUnit 5、AssertJ、Mockito 等測試支援 |
| `spring-security-test` | 提供 Security 相關的 Mock 認證測試支援 |

```groovy
dependencies {
    // [單元測試] 提供測試框架與 Security 測試支援
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}
```

<!--
最後，別忘了「品管部門」。
我們加入了測試相關的 starter。
spring-boot-starter-test 內建了 JUnit 和 Mockito，讓我們可以模擬各種情境來測試邏輯。
而 security-test 則讓我們可以模擬「已登入管理員」或「未登入使用者」的身份來測試 API 的安全性。
有好的測試，程式碼品質才有保障。
-->

---

# 資料庫與 JPA 設定

| 設定項 | 說明 |
| --- | --- |
| `spring.datasource.*` | 資料庫連線資訊 (URL, Username, Password) |
| `hibernate.ddl-auto` | `update`：根據 Entity 自動更新資料表結構 |
| `jwt.secret` / `jwt.expiration` | JWT 簽署密鑰與過期時間設定 |

---

# 資料庫與 JPA 設定 — 範例

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dynamic_survey?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

jwt.secret=vW9mK2v6yB?E(G+KbPeShVmYq3t6w9z$C&E)H@McQfTjWnZr4u7x!A%D*G-KaPdS
jwt.expiration=86400000
```

<!--
設定檔 application.properties 就像是專案的「聯絡通訊錄」。
我們要告訴 Spring Boot 資料庫住在哪裡（URL），門牌密碼是什麼（Username/Password）。
同時我們設定了 JWT 的密鑰，這就像是刻印章的模子，絕對不能讓別人偷走喔！
-->

---

# 安全機制基礎設定 (SecurityConfig)

| 關鍵註解 | 說明 |
| --- | --- |
| `@Configuration` | 標記這是一個設定類別 |
| `@EnableWebSecurity` | 開啟 Spring Security 的 Web 安全功能 |
| `SecurityFilterChain` | 定義請求過濾鏈，決定哪些 API 需要驗證 |

---

# 安全機制基礎設定 — 過濾鏈實作

```java
@Configuration @EnableWebSecurity
public class WebSecurityConfig {
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() { return new AuthTokenFilter(); }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // 徹底禁用 CSRF (403 主因)
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // 開啟跨域
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)) // 支援 Session
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); // 開發期全公開

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

---

# 安全機制基礎設定 — CORS 與 Bean

| 組件名稱 | 說明 |
| --- | --- |
| `passwordEncoder` | 使用 BCrypt 加密演算法 |
| `authenticationManager` | 負責處理身分驗證的核心組件 |
| `CorsConfiguration` | 設定允許的來源 (Origin) 與 方法 (Methods) |

---

# 安全機制基礎設定 — CORS 實作

```java
    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration c) throws Exception {
        return c.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowCredentials(true); // 必須開啟以支援 Session Cookie
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
```

<!--
在開發初期，為了方便測試 API，我們可以先把 Security 設定為 `permitAll()`，也就是開放通行。
這就像是新店開張，我們先把大門敞開，讓師傅們可以自由進出裝潢，等完工了我們再裝上感應鎖。
-->

---

# 狀態碼定義 (RspCode Enum)

| 常見狀態碼 | 意義 |
| --- | --- |
| `SUCCESS (200)` | 執行成功 |
| `NOT_FOUND (404)` | 找不到資料 |
| `DUPLICATE_ERROR (409)` | 資料重複 (如 Email 已註冊) |

```java
public enum RspCode {
    SUCCESS(200, "Success"),
    ERROR(400, "Error"),
    NOT_FOUND(404, "Not Found"),
    DUPLICATE_ERROR(409, "Duplicate Data");

    private final int code;
    private final String message;
    // Constructor & Getters...
}
```

<!--
為了讓前後端溝通有一套「共通語言」，我們定義了狀態碼。
就像郵差送信，成功會蓋「投遞成功」，找不到人會蓋「查無此人」。
這樣前端看到 404 就知道要顯示「找不到這份問卷」，看到 409 就知道要提示「這個帳號被用過了」。
-->

---

# 統一回應物件 (AppResponse)

| 屬性名稱 | 說明 |
| --- | --- |
| `code` | 自定義狀態碼 (如 200, 404) |
| `message` | 給前端看的提示文字 |
| `data` | 實際要回傳的內容 (泛型設計) |

<!--
我們不直接回傳資料，而是把它包在一個「標準貨櫃」裡。
不管是回傳單筆資料、列表，還是錯誤訊息，外殼都長得一模一樣。
前端工程師拿到這個貨櫃後，只要檢查 `code` 是不是 200，就知道這次 API 呼叫是否成功。
-->

---

# 統一回應物件 — 實作

```java
@Data
public class AppResponse<T> {
    private int code;
    private String message;
    private T data;

    public static <T> AppResponse<T> success(T data) {
        AppResponse<T> response = new AppResponse<>();
        response.setCode(200);
        response.setData(data);
        return response;
    }
}
```

<!--
這裡用泛型 `T` 代表真正的資料內容，所以同一個 AppResponse 可以包單筆物件，也可以包列表。
`success` 是一個工廠方法，讓我們在 Service 或 Controller 裡不用每次都手動 new 物件、設定 code、設定 data。
後面所有 API 都會用這個格式回傳，讓前端收到的 JSON 結構保持一致。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第二部分：問卷管理 (Admin CRUD)

<!--
接下來我們來實作「老闆」要用的功能。
包含如何新增、查詢、修改與刪除問卷。
-->

---

# 問卷動態篩選 — Repository

| 技術亮點 | 說明 |
| --- | --- |
| `JPQL` | 在 `@Query` 中撰寫類 SQL 語句 |
| `LIKE %:title%` | 實現模糊查詢 |
| `IS NULL OR ...` | 處理動態參數 (如果參數為空則不篩選該條件) |

```java
public interface SurveyRepository extends JpaRepository<Survey, Long> {
   @Query("SELECT s FROM Survey s WHERE " +
          "(:title IS NULL OR s.title LIKE %:title%) AND " +
          "(:startDate IS NULL OR s.startDate >= :startDate) AND " +
          "(:endDate IS NULL OR s.endDate <= :endDate)")
   List<Survey> findByFilters(@Param("title") String title,
                              @Param("startDate") LocalDate startDate,
                              @Param("endDate") LocalDate endDate);
}
```

<!--
搜尋功能通常最麻煩的是「如果使用者沒輸入怎麼辦？」。
這裡我們用了一個小技巧：`(:title IS NULL OR s.title LIKE %:title%)`。
如果沒輸入標題，前半段就會變成 True，這行條件就失效了。
這就像是去圖書館找書，你可以只說「標題有 Spring 的」，也可以加上「出版日期在今年以後的」。
-->

---

# 管理端查詢服務 — Service

| 邏輯處理 | 說明 |
| --- | --- |
| `surveyRepository.findByFilters` | 呼叫多條件查詢 |
| `stream().map()` | 將 Entity 轉換為 DTO |
| `Collectors.toList()` | 收集結果轉為列表 |

```java
public AppResponse<List<SurveyDTO>> getSurveysByAdmin(String title, LocalDate start, LocalDate end) {
    List<Survey> surveys = surveyRepository.findByFilters(title, start, end);
    return AppResponse.success(
        surveys.stream()
               .map(this::convertToDTO)
               .collect(Collectors.toList())
    );
}
```

<!--
Service 層是專案的「大腦」。
它負責向 Repository 拿出生鮮食材（Entity），經過加工處理（convertToDTO），最後裝進標準貨櫃（AppResponse）送出去。
這樣做的好處是，我們不會把資料庫的底細（密碼、關聯等）直接攤給外面的人看。
-->

---

# 管理端控制器 — Controller

| 註解 | 說明 |
| --- | --- |
| `@GetMapping` | 指定 API 接收 GET 請求 |
| `@RequestParam` | 取得網址後方的 Query Parameters |
| `@DateTimeFormat` | 自動解析日期格式字串為 LocalDate 對象 |

```java
@GetMapping
public AppResponse<?> getSurveys(
    @RequestParam(name = "title", required = false) String title,
    @RequestParam(name = "startDate", required = false) 
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
    @RequestParam(name = "endDate", required = false) 
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
    
    return surveyService.getSurveysByAdmin(title, startDate, endDate);
}
```

<!--
Controller 就像是餐廳的「服務生」。
它負責接單，確認客人要找的標題是什麼、日期範圍在哪。
特別注意日期格式，我們用了 `@DateTimeFormat`，這樣 Spring 就會幫我們把字串變成好用的 Java 日期物件。
-->

---

# 使用 Postman 測試 — 取得列表

| 測試情境 | URL 範例 |
| --- | --- |
| 取得所有問卷 | `GET /api/admin/surveys` |
| 根據標題篩選 | `GET /api/admin/surveys?title=2025` |
| 根據日期篩選 | `GET /api/admin/surveys?startDate=2026-03-01` |

```json
{
  "code": 200,
  "data": [
    { "id": 1, "title": "2025 年度滿意度調查", "status": "PUBLISHED" },
    { "id": 2, "title": "新功能許願池", "status": "DRAFT" }
  ]
}
```

<!--
功能寫完了一定要測！我們用 Postman 來模擬前端發送請求。
不管是帶參數還是不帶參數，都要確認回傳的 JSON 格式是不是我們定義的 AppResponse。
如果你看到 200，恭喜你，功能運作正常！
-->

---

# 刪除功能實作 — Service & Controller

| 層級 | 關鍵實作 |
| --- | --- |
| **Service** | `surveyRepository.deleteById(id);` |
| **Controller** | `@DeleteMapping("/{id}")` |

```java
// Service
@Transactional
public AppResponse<?> deleteSurvey(Long id) {
    surveyRepository.deleteById(id);
    return AppResponse.success(null);
}

// Controller
@DeleteMapping("/{id}")
public AppResponse<?> deleteSurvey(@PathVariable("id") Long id) {
    return surveyService.deleteSurvey(id);
}
```

<!--
刪除功能相對簡單，但要注意加上 `@Transactional`。
這確保了如果刪除過程發生意外，資料庫會回復原狀，不會發生「刪了一半」的情況。
Controller 使用了 `@DeleteMapping`，這是 RESTful 風格的標準寫法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第三部分：問卷填寫與作答流程

<!--
現在我們切換到「使用者」的角色。
如何取得正在進行中的問卷，並實作「填寫 -> 預覽 -> 提交」的流程。
-->

---

# 查詢進行中的問卷 (Active Surveys)

| 查詢條件 | JPQL 寫法 |
| --- | --- |
| 狀態為已發佈 | `s.status = 'PUBLISHED'` |
| 在有效日期內 | `s.startDate <= :today AND s.endDate >= :today` |

```java
public interface SurveyRepository extends JpaRepository<Survey, Long> {
   @Query("SELECT s FROM Survey s WHERE s.status = 'PUBLISHED' " +
          "AND s.startDate <= :today AND s.endDate >= :today")
   List<Survey> findActiveSurveys(@Param("today") LocalDate today);
}
```

<!--
我們不希望使用者看到過期的問卷，也不希望看到老闆還在編輯中的草稿。
所以這裡我們寫了一個過濾器：只有狀態是「PUBLISHED」且今天剛好在「開始」與「結束」日期之間的，才會秀給使用者看。
這就像是百貨公司的特賣會，只有在活動期間內大門才會開啟。
-->

---

# 作答流程設計：Session 暫存機制

| 步驟 | 功能描述 | 目的 |
| --- | --- | --- |
| **1. 暫存** | `storeInSession` | 使用者填完後點「下一步」，先存在 Session |
| **2. 預覽** | `getFromSession` | 確認頁從 Session 拿資料顯示，讓使用者校對 |
| **3. 提交** | `confirmSubmit` | 點擊「確認提交」，從 Session 轉存到資料庫 |

```java
// Service 暫存範例
public AppResponse<?> saveToSession(ResponseDTO submission, HttpSession session) {
    session.setAttribute("TEMP_SURVEY_RESPONSE", submission);
    return AppResponse.success(null);
}
```

<!--
為什麼要用 Session？
因為問卷通常會有一個「確認頁」。我們不希望使用者還沒確認就直接把資料寫入資料庫。
先存在 Session 就像是先把東西放進購物車，等最後點擊「結帳」時，我們才真正去刷卡（存入資料庫）。
這樣萬一使用者在確認頁發現寫錯了，點「回上一頁」修改，我們也不會浪費資料庫的 ID 和空間。
-->

---

# 正式提交作答 — 資料持久化

| 處理流程 | 說明 |
| --- | --- |
| **驗證** | 從 Session 拿資料，為空則報錯 |
| **轉換** | 將 DTO 的內容轉換為 Entity (SurveyResponse) |
| **關聯** | 根據 `questionId` 連結正確的 Question 物件 |
| **清理** | 儲存成功後，從 Session 移除暫存資料 |

<!--
結帳時刻到了！
我們會把 Session 裡的暫存資料撈出來，一個個裝進 Entity 盒子裡。
這裡的流程重點是：先確認資料存在，再轉成資料庫可以保存的格式，最後清掉 Session。
-->

---

# 正式提交作答 — 實作

```java
@Transactional
public AppResponse<?> commitFromSession(HttpSession session) {
    ResponseDTO submission = (ResponseDTO) session.getAttribute("TEMP_SURVEY_RESPONSE");
    if (submission == null) return AppResponse.error(RspCode.NOT_FOUND);
    
    // ... 轉換為 Entity 並 save 到 Repository ...
    
    session.removeAttribute("TEMP_SURVEY_RESPONSE"); // 記得清空喔！
    return AppResponse.success(null);
}
```

<!--
這段程式最重要的是處理「選項與問題的連結」，確保使用者的回答能對應到正確的題目。
存進資料庫後，一定要記得把 Session 清空，不然下次使用者再填別的問卷，可能會看到舊的資料喔！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第四部分：資料統計與回饋

<!--
問卷收完了，老闆最想看的是什麼？
沒錯，就是分析數據！
-->

---

# 取得作答統計資料

| 統計邏輯 | 實作方式 |
| --- | --- |
| **文字題** | 收集所有填寫內容列表 |
| **選擇題** | 計算每個選項的 `count` |
| **百分比** | `(選項次數 * 100.0) / 總填寫次數` |

```java
// 統計範例：計算百分比
for (Map<String, Object> oData : optMap.values()) {
    double pct = totalResponses > 0 ? 
        ((int) oData.get("count") * 100.0 / totalResponses) : 0;
    oData.put("percentage", Math.round(pct * 10.0) / 10.0);
}
```

<!--
統計報表的核心就是「算術」。
我們把每一題的回答抓出來。如果是文字題，我們就把大家的留言列出來；如果是選擇題，我們就統計每個選項有多少人選。
最後算出的百分比，我們會四捨五入到小數點第一位，讓報表看起來專業又整齊。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第五部分：會員系統與安全機制

<!--
最後一塊拼圖：如何區分「管理員」與「一般使用者」。
我們使用 JWT 來實作登入功能。
-->

---

# 會員實體設計 (User Entity)

| 欄位名稱 | 設定 | 說明 |
| --- | --- | --- |
| `email` | `unique = true` | 登入帳號，不可重複 |
| `password` | `nullable = false` | 密碼，需經過加密存儲 |
| `role` | `ADMIN` / `USER` | 權限角色 |

```java
@Entity
@Table(name = "users")
@Data
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password; // 這裡是 BCrypt 加密後的字串
    private String role;
}
```

<!--
使用者資料表是系統的根基。
最關鍵的是 `email` 必須設為 `unique`，這就像身分證字號，不能兩個人共用。
至於 `password`，切記！我們絕對、絕對不能直接存原始密碼（明文）。
我們必須先用 `BCrypt` 把它打碎攪爛，存進去的是一串誰也看不懂的亂碼，這才是安全的做法。
-->

---

# 註冊與密碼加密 — Service

| 邏輯步驟 | 實作細節 |
| --- | --- |
| **1. 檢查重複** | `findByEmail` 是否已存在 |
| **2. 密碼加密** | `passwordEncoder.encode(rawPassword)` |
| **3. 自動授權** | 第一個註冊的人自動成為 ADMIN |

```java
public String register(RegisterDTO registerDTO) {
    if (userRepository.findByEmail(registerDTO.getEmail()).isPresent()) {
        throw new RuntimeException("Email address already in use.");
    }
    User user = new User();
    user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
    // ... 設定其他欄位 ...
    userRepository.save(user);
    return login(new LoginDTO(user.getEmail(), registerDTO.getPassword()));
}
```

<!--
註冊流程就像是去銀行開戶。
櫃員會先查你有沒有開過戶（檢查 Email）。
接著幫你的保險箱換上一個新的密碼鎖（加密）。
我們還設計了一個小彩蛋：第一個註冊的人就是這台系統的老大（ADMIN），後面的都是平民百姓（USER）。
-->

---

# 登入與 JWT 簽發

| 認證流程 | 說明 |
| --- | --- |
| **AuthenticationManager** | 驗證帳密是否正確 |
| **SecurityContextHolder** | 將認證成功的資訊存入當前線程 |
| **JwtTokenProvider** | 產生一個帶有權限資訊的 Token 字串 |

```java
public String login(LoginDTO loginDTO) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
    );
    SecurityContextHolder.getContext().setAuthentication(authentication);
    return tokenProvider.generateToken(authentication);
}
```

<!--
登入成功後，伺服器會發給你一張「通行證」（JWT Token）。
這張通行證就像是 VIP 卡，上面印著你的名字和權限（ADMIN 還是 USER），還有一個伺服器簽名，別人無法仿造。
以後前端發請求只要帶著這張卡，我們就不用每次都查資料庫確認你是誰了。
-->

---

# 實戰練習：動態問卷擴充

| 任務名稱 | 任務說明 |
| --- | --- |
| **練習 1** | 實作「問卷複製」功能，一鍵產生相同題目但新 ID 的問卷。 |
| **練習 2** | 在作答統計中，加入「平均年齡」的統計數據。 |
| **練習 3** | 修改安全設定，讓一般使用者無法存取 `/api/admin/**` 路徑。 |

<!--
現在輪到大家動動手了！
試著去擴充這套系統。比如老闆想辦第二場特賣會，能不能直接複製去年的問卷？
或是想知道填問卷的人平均幾歲？
還有最核心的：別忘了把後門關起來，確保只有管理員能進到後台喔！
-->

---

# 總結

- **完整性**：從 Entity、Repository 到 Controller，每一層都有其職責。
- **安全性**：密碼加密與 JWT 認證是現代 Web 應用的標配。
- **互動性**：利用 Session 處理暫存，提升使用者的填寫體驗。
- **數據價值**：API 不只是存取資料，更是要把原始數據轉化為有意義的統計資訊。

<!--
恭喜大家完成了動態問卷系統的實戰！
我們從零開始，一磚一瓦地蓋起了這座城堡。
學會了如何處理複雜的動態查詢、如何安全地存儲密碼，以及如何利用 Session 打造順暢的互動。
技術會更新，但這些架構思考與解決問題的方法，會是你最堅實的資產。
大家辛苦了！下課！
-->

---
layout: end
---

# Q&A
### 謝謝大家的參與！

<Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
