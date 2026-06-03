---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: JWT 認證
routeAlias: ch45
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
    JWT 認證
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「不靠伺服器記憶，讓 Token 自帶通行證」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
歡迎來到第 46 章！今天要講的是 JWT 認證。

想像你去遊樂園玩，入場時工作人員在你手腕戴上一條手環。之後你不管去哪個遊樂設施，只要亮出手環，工作人員就知道你已經付費入場了 — 根本不需要每次都跑回售票口驗證你的身份。

JWT 就是這條「手環」！伺服器把你的身份資訊加密簽名後交給你，之後每次請求你帶著它來，伺服器一看就知道你是誰，完全不需要自己記憶。
-->

---

# 本章大綱

<div class="index-table">

| 節次 | 主題 |
|------|------|
| 1 | HttpSession 的水平擴展問題 |
| 2 | JWT 結構與三個組成部分 |
| 3 | JWT Claims 詳解 |
| 4 | JWT vs Session 比較 |
| 5 | jjwt 0.12.x 依賴設定 |
| 6 | JwtUtil：生成與驗證 Token |
| 7 | JwtAuthFilter（OncePerRequestFilter） |
| 8 | SecurityFilterChain 設定 |
| 9 | AuthController 登入端點 |
| 10 | 完整登入流程 |
| 11 | 安全最佳實踐 |
| 12 | 實作練習 |

</div>

<!--
這是本章的學習路線圖。我們先從「為什麼需要 JWT」出發，理解 Session 在分散式系統的痛點；接著深入 JWT 的結構與原理；然後實作整套 Spring Boot 3.x 的 JWT 認證流程。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## HttpSession 的水平擴展問題

<!--
在講 JWT 之前，我們先來看看傳統的 Session 認證遇到了什麼問題。
-->

---

# HttpSession 的問題

| 情境 | 說明 |
|------|------|
| 單台伺服器 | ✅ 完全沒問題，Session 就在記憶體裡 |
| 兩台伺服器（Load Balancer） | ❌ A 台登入的 Session，B 台不認識！ |
| 自動擴展（Auto Scaling） | ❌ 新開的 Pod 沒有舊的 Session 資料 |
| 容器化部署（K8s） | ❌ Pod 重啟後 Session 全部消失 |

**解法比較：**

| 解法 | 缺點 |
|------|------|
| Sticky Session | 失去水平擴展的彈性 |
| Session 共享（Redis） | 增加基礎設施複雜度 |
| **JWT（無狀態）** | **⭐ 伺服器完全不需要儲存狀態** |

<!--
想像一個大型主題樂園，有兩個售票口。你在左邊售票口登記了，拿到一張號碼牌。但右邊售票口的工作人員根本不知道你登記過！這就是水平擴展時 Session 的問題。

JWT 提供了另一條路：讓客戶端自己帶著身份證明！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## JWT 結構：Header.Payload.Signature

<!--
現在我們來解剖 JWT，看看這條「手環」到底是怎麼做成的。
-->

---

# JWT 長什麼樣子？

**一個真實的 JWT Token 由三段組成，用「.」分隔：**

| 部分 | 內容 | 說明 |
|------|------|------|
| **Header** | `eyJhbGci...` | 演算法類型（Base64Url 編碼） |
| **Payload** | `eyJzdWIi...` | 使用者資訊（Base64Url 編碼） |
| **Signature** | `SflKxwRJ...` | 用密鑰簽名，防止竄改 |

```json
// Payload 解碼後：
{
  "sub": "alice",
  "iat": 1717400000,
  "exp": 1717486400,
  "roles": ["ROLE_USER"]
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>重要：</b> Payload 是 Base64Url 編碼，不是加密！任何人都能解碼讀取，切勿存放密碼或機敏資料。
</div>

<!--
JWT 就是三段 Base64Url 字串，用點號連接。Base64Url 不是加密！只是編碼！

JWT 的安全性來自第三段 Signature。伺服器用密鑰對 Header+Payload 計算出簽名。如果有人篡改了 Payload，簽名就對不上，伺服器馬上知道這個 Token 是假的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## JWT Claims 詳解

<!--
Payload 裡面的每個欄位叫做 Claim（聲明）。我們來仔細看看有哪些標準 Claims。
-->

---

# JWT Claims：標準欄位

| Claim | 全名 | 說明 |
|-------|------|------|
| `sub` | Subject | 主體（通常是使用者帳號） |
| `iat` | Issued At | Token 發行時間（Unix 時間戳） |
| `exp` | Expiration | Token 過期時間（Unix 時間戳） |
| `iss` | Issuer | 發行者 |
| `aud` | Audience | 目標接收者 |
| `jti` | JWT ID | 唯一識別碼（防重放攻擊） |

**Custom Claims（自訂欄位）：**

> 任何業務需要的欄位都可以加入，例如 `"roles": ["ROLE_ADMIN"]`

<!--
Claims 就像手環上印的資訊。標準 Claims 有固定的縮寫名稱，是 JWT 規格定義好的。最重要的三個是 sub（誰）、iat（何時發行）、exp（何時過期）。

自訂 Claims 讓你可以在 Token 裡帶更多業務資訊，比如使用者的角色、部門等。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## JWT vs Session 比較

<!--
理解了 JWT 的結構後，我們來做一個完整的比較。
-->

---

# JWT vs Session 全面比較

| 特性 | HttpSession | JWT |
|------|------------|-----|
| **狀態** | Stateful（伺服器儲存） | Stateless（客戶端儲存） |
| **水平擴展** | 需要共享 Session Store | 天然支援，無需額外設施 |
| **廢止 Token** | 直接刪除 Session | 需要 Blacklist 機制 |
| **資料大小** | Session ID 很小 | Token 較大（帶有資料） |
| **跨域支援** | Cookie 有跨域限制 | Header 方式天然跨域 |
| **適合場景** | 單體應用、需要即時廢止 | 微服務、API、行動端 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>JWT 的缺點：</b> 一旦發出去，在過期前無法單方面廢止（除非維護黑名單）。如果需要「立刻踢出使用者」，要麼用 Session，要麼實作 JWT Blacklist。
</div>

<!--
這張表格是面試常考題，背起來！

所以如果你的應用需要「立刻踢出使用者」的功能，要麼用 Session，要麼實作 JWT Blacklist。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## jjwt 0.12.x 依賴設定

<!--
好了，原理講完了！現在來實作。第一步是加入 jjwt 的 Maven 依賴。注意版本：我們用的是 0.12.x，API 跟舊版 0.11.x 有重大差異。
-->

---

# pom.xml：加入 jjwt 依賴

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> jjwt-impl 和 jjwt-jackson 都要設 <code>runtime</code> scope！jjwt-api 是編譯期介面，後兩者是執行期實作。
</div>

<!--
jjwt 拆成三個 JAR 是有原因的：jjwt-api 提供介面，你的程式碼只依賴介面；jjwt-impl 是實作，設成 runtime scope 表示編譯時不需要，執行時才載入；jjwt-jackson 負責把 Claims 序列化成 JSON。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
## JwtUtil：生成與驗證 Token

<!--
依賴加好了，來實作核心工具類 JwtUtil。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtUtil（1/2）：生成 Token

```java
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        return Jwts.builder()
            .subject(username)
            .issuedAt(new Date())
            .expiration(new Date(
                System.currentTimeMillis() + 86400000))
            .signWith(getSigningKey())
            .compact();
    }
}
```

<!--
幾個重點：密鑰從設定檔讀取（不要寫死在程式碼裡！）；Decoders.BASE64.decode() 把 Base64 字串轉成 byte array；Keys.hmacShaKeyFor() 確保密鑰長度足夠（HS256 需要 256-bit 以上）。

注意 jjwt 0.12.x 的新 API：.subject() 取代了舊版的 .setSubject()，.expiration() 取代了 .setExpiration()。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtUtil（2/2）：驗證與解析 Token

```java
public Claims extractAllClaims(String token) {
    return Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
}

public String extractUsername(String token) {
    return extractAllClaims(token).getSubject();
}

public boolean validateToken(String token, String username) {
    String tokenUsername = extractUsername(token);
    boolean expired = extractAllClaims(token)
        .getExpiration().before(new Date());
    return tokenUsername.equals(username) && !expired;
}
```

<!--
解析 Token 的 0.12.x 寫法：Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload()。

如果 Token 簽名不對或已過期，parseSignedClaims() 會拋出 JwtException，我們在後面的 Filter 裡會捕捉這個例外。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
## JwtAuthFilter（OncePerRequestFilter）

<!--
有了 JwtUtil，下一步是實作 Filter。這個 Filter 在每個 HTTP 請求進入 Controller 之前執行，負責從 Header 抽取並驗證 JWT。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtAuthFilter（1/2）：抽取 Token

```java
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null
                && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            username = jwtUtil.extractUsername(token);
        }
        // 下一頁繼續...
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 3.x：</b> import 路徑是 <code>jakarta.servlet.*</code>，不是舊版的 <code>javax.servlet.*</code>。
</div>

<!--
OncePerRequestFilter 保證每個請求只執行一次，即使有 Forward 或 Include 也不會重複執行。

Authorization Header 的格式是「Bearer 空格 token」，我們用 substring(7) 跳過前七個字元取得純 Token。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtAuthFilter（2/2）：設定 Authentication

```java
        if (username != null &&
            SecurityContextHolder.getContext()
                .getAuthentication() == null) {

            UserDetails userDetails =
                userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(token, username)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null,
                        userDetails.getAuthorities());
                authToken.setDetails(
                    new WebAuthenticationDetailsSource()
                        .buildDetails(request));
                SecurityContextHolder.getContext()
                    .setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

<!--
這段邏輯是 JWT Filter 的核心：如果 Token 有效，就建立 UsernamePasswordAuthenticationToken 物件，放進 SecurityContextHolder。

重要：最後一定要呼叫 filterChain.doFilter()，讓請求繼續往下走！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 8
## SecurityFilterChain 設定

<!--
Filter 實作好了，現在要把它掛進 Spring Security 的過濾鏈。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# SecurityConfig：完整設定

```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

<!--
幾個關鍵設定：

csrf().disable()：REST API 通常不需要 CSRF 保護；SessionCreationPolicy.STATELESS：告訴 Spring Security 不要建立或使用 Session；/auth/** permitAll：登入端點要開放；addFilterBefore：把 JwtAuthFilter 插在 UsernamePasswordAuthenticationFilter 之前。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 9
## AuthController 登入端點

<!--
設定都好了，現在來實作 Controller！
-->

---

# LoginRequest / LoginResponse DTOs

```java
public record LoginRequest(
    String username,
    String password
) {}
```

```java
public record LoginResponse(
    String token,
    String username,
    long expiresIn
) {}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Java record：</b> Spring Boot 3.x 原生支援。自動產生 constructor、getter、equals、hashCode，比 Lombok @Data 更簡潔。
</div>

<!--
DTOs 使用 record 非常簡潔！不需要 Lombok 的 @Data，不需要手寫 getter，Java 原生就搞定了。

LoginResponse 的 expiresIn 讓前端知道 Token 多久後過期，方便決定何時要更新 Token。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# AuthController：POST /auth/login

```java
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.username(), request.password()));

        String token = jwtUtil.generateToken(request.username());
        return ResponseEntity.ok(new LoginResponse(
            token, request.username(), 86400000));
    }
}
```

<!--
流程很清晰：authManager.authenticate() 負責驗證帳號密碼，如果驗證失敗會拋出 AuthenticationException（Spring Security 自動回傳 401）；驗證成功後呼叫 jwtUtil.generateToken() 生成 Token；最後包成 LoginResponse 回傳給前端。

前端拿到 Token 後，之後每次請求都要在 Header 加上：Authorization: Bearer <token>。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 10
## 完整登入流程

<!--
讓我們把整個 JWT 認證流程串起來。
-->

---

# 完整登入與認證流程

**第一階段：取得 Token（登入）**

| 步驟 | 動作 | 說明 |
|------|------|------|
| 1 | 前端 POST /auth/login | 帶上 username + password |
| 2 | AuthController | 呼叫 AuthenticationManager 驗證 |
| 3 | 驗證成功 | JwtUtil.generateToken() 生成 Token |
| 4 | 回傳 200 OK | 回應 body 包含 JWT Token |

**第二階段：使用 Token 存取資源**

| 步驟 | 動作 | 說明 |
|------|------|------|
| 5 | 前端發請求 | Header 帶 `Authorization: Bearer <token>` |
| 6 | JwtAuthFilter | 抽取並驗證 Token |
| 7 | 驗證成功 | 設定 SecurityContextHolder |
| 8 | Controller 執行 | 回傳受保護資源 |

<!--
把這張表貼在你的筆記本上！整個 JWT 流程就是這 8 步。

第一階段只做一次（登入），第二階段每個受保護的請求都會執行。Filter 是無感的，使用者感覺不到，但每次請求 Spring Security 都在背後默默驗證 Token 的合法性。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 11
## 安全最佳實踐

<!--
JWT 用起來很爽，但有幾個安全陷阱要注意。
-->

---

# JWT 安全最佳實踐

| 實踐項目 | 說明 | ❌ 錯誤範例 |
|----------|------|-----------|
| **密鑰長度** | HS256 至少 256-bit（32 bytes）Base64 編碼 | 使用短字串 `"secret"` |
| **Token 過期** | 短時效（15 分鐘~24 小時），搭配 Refresh Token | 永不過期 |
| **HTTPS 傳輸** | 只在 HTTPS 環境傳輸 Token | 明文 HTTP 傳送 |
| **不存敏感資料** | Payload 只放 ID、角色，不放密碼 | 把密碼放進 Claims |
| **密鑰存環境變數** | 用 `${jwt.secret}` 從設定讀取 | 硬編碼在程式碼 |

**生成安全密鑰：**

```bash
openssl rand -base64 32
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>永遠不要把密鑰提交到 Git！</b> 一旦洩漏，任何人都能偽造 Token。
</div>

<!--
這非常重要！永遠不要把真正的密鑰提交到 Git。如果不小心推上 GitHub，即使後來刪除，Git 歷史裡還有記錄，必須立刻換掉密鑰。

實務做法：在 application.properties 放一個假的預設值，然後在部署時透過環境變數覆蓋。
-->

---
layout: default
---

# 練習一：實作完整 JWT 登入 API
### 任務說明

建立一個 Spring Boot 3.x 專案，實作 JWT 登入認證：

1. 加入 jjwt 0.12.5 三個依賴（api / impl / jackson）
2. 建立 `JwtUtil` 類別，實作 `generateToken()` 和 `validateToken()`
3. 建立 `JwtAuthFilter`，繼承 `OncePerRequestFilter`
4. 設定 `SecurityFilterChain`：`/auth/**` 開放、其他需認證、`SessionCreationPolicy.STATELESS`
5. 建立 `POST /auth/login` 端點，成功後回傳 JWT Token
6. 建立 `GET /api/hello` 受保護端點，回傳 `"Hello, {username}!"`
7. 用 Postman 測試：先登入取 Token，再帶 Token 存取 `/api/hello`

<!--
這個練習把今天所有內容串起來。建議步驟順序：先設定依賴和 application.properties → 建 JwtUtil → 建 JwtAuthFilter → 設定 SecurityConfig → 建 AuthController → 最後建 HelloController 測試。
-->

---
layout: default
---

# 練習一：解題提示
### 提示說明

```java
// HelloController：從 Authentication 取出當前使用者
@GetMapping("/api/hello")
public String hello(Authentication authentication) {
    return "Hello, " + authentication.getName() + "!";
}
```

**常見錯誤排除：**

| 錯誤訊息 | 原因 | 解法 |
|----------|------|------|
| `403 Forbidden` | Token 沒帶或格式錯誤 | 確認 Header：`Bearer ` 後面有空格 |
| `JWT signature does not match` | 密鑰不一致 | 確認 application.properties 密鑰設定 |
| `javax.servlet` 找不到 | 用了舊套件 | 改成 `jakarta.servlet.*` |
| `AuthenticationManager` Bean 找不到 | 沒宣告此 Bean | 在 SecurityConfig 加 `@Bean AuthenticationManager` |

<!--
最後一個常見錯誤特別提醒：很多人從網路上複製程式碼，舊版用的是 javax.servlet，Spring Boot 3.x 換成了 jakarta.servlet。這個編譯錯誤很常見，看到就知道怎麼解決了！
-->

---
layout: default
---

# 練習二：加入 Refresh Token 機制
### 任務說明

在練習一的基礎上，加入 Refresh Token 功能：

1. 修改 `JwtUtil`，加入 `generateRefreshToken()` 方法（過期時間 7 天）
2. 修改 `LoginResponse`，加入 `refreshToken` 欄位
3. 建立 `RefreshToken` Entity，儲存 refreshToken 到資料庫（含 username、token、過期時間）
4. 建立 `POST /auth/refresh` 端點：接收 refreshToken → 查資料庫驗證 → 生成新的 Access Token 回傳
5. 建立 `POST /auth/logout` 端點：從資料庫刪除 Refresh Token，回傳 200 OK

**思考題：** 為什麼 Refresh Token 要存資料庫，但 Access Token 不用？

<!--
這個進階練習模擬了真實應用的完整認證流程。Refresh Token 需要儲存在資料庫，因為我們需要能夠廢止它（資料庫刪除就等於廢止），這補足了 JWT 無法即時廢止的缺點。
-->

---
layout: default
---

# 練習二：解題提示
### 提示說明

```java
@Entity
public class RefreshToken {
    @Id @GeneratedValue
    private Long id;
    private String username;
    @Column(unique = true)
    private String token;
    private Instant expiryDate;
}
```

**思考題解答：**

| | Access Token | Refresh Token |
|---|---|---|
| 時效 | 短（15分鐘~24小時） | 長（7天） |
| 儲存 | 客戶端（無需資料庫） | 資料庫（需要廢止能力） |
| 廢止 | 等待過期即可 | 刪除資料庫記錄即廢止 |

<!--
Refresh Token 存資料庫是因為它有「廢止」的需求——logout 時要能立刻讓它失效。Access Token 存在客戶端，因為它很短效，等過期就好，不需要主動廢止。

這就是 JWT + Refresh Token 架構的核心設計思路。
-->

---

# 本章重點回顧

| 主題 | 核心要點 |
|------|---------|
| Session 問題 | 水平擴展時無法共享 Session 狀態 |
| JWT 結構 | Header.Payload.Signature，Payload 是編碼非加密 |
| JWT Claims | sub / iat / exp 三個最重要 |
| jjwt 0.12.x | api / impl（runtime）/ jackson（runtime） |
| generateToken | `Jwts.builder().subject().expiration().signWith().compact()` |
| validateToken | `Jwts.parser().verifyWith().build().parseSignedClaims()` |
| JwtAuthFilter | 繼承 `OncePerRequestFilter`，使用 `jakarta.servlet.*` |
| SecurityFilterChain | `SessionCreationPolicy.STATELESS` + `addFilterBefore` |
| 安全實踐 | 密鑰 256-bit、短時效、HTTPS、不存敏感資料 |

<!--
今天的金句總結：「Session 是讓伺服器記住你，JWT 是讓你自帶身份證。」無狀態架構讓你的應用可以無限水平擴展，這在雲端時代是基本要求。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的 JWT 認證課到這裡結束！

課後建議：先把練習一做完，確保整個流程能跑通；之後再挑戰練習二的 Refresh Token。

如果在實作過程中遇到問題，先看一下錯誤訊息，通常 403 是認證問題、401 是 Token 無效、500 才是程式碼問題。
-->
