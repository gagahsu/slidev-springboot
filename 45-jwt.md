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
歡迎來到第 45 章！今天要講的是 JWT 認證。

想像你去遊樂園玩，入場時工作人員在你手腕戴上一條手環。之後你不管去哪個遊樂設施，只要亮出手環，工作人員就知道你已經付費入場了 — 根本不需要每次都跑回售票口驗證你的身份。

JWT 就是這條「手環」！伺服器把你的身份資訊加密簽名後交給你，之後每次請求你帶著它來，伺服器一看就知道你是誰，完全不需要自己記憶。
-->

---
layout: default
---

# Outline

- **Session 的水平擴展問題** — 為什麼需要 JWT？
- **JWT 結構** — Header、Payload、Signature 三個組成部分
- **JWT Claims 詳解** — 標準 Claims 與自訂 Claims
- **JWT vs Session 比較** — 無狀態 vs 有狀態
- **jjwt 0.12.x 依賴設定** — build.gradle 設定
- **JwtUtil** — 生成與驗證 Token
- **JwtAuthFilter** — `OncePerRequestFilter` 攔截請求
- **SecurityFilterChain** — 整合 JWT 的安全設定
- **Java record** — DTO / VO 都適用
- **AuthController** — 登入端點實作
- **完整登入流程** — 端對端流程圖解
- **安全最佳實踐** — Token 管理注意事項
- **實作練習**

<!--
這是本章的學習路線圖。我們先從「為什麼需要 JWT」出發，理解 Session 在分散式系統的痛點；接著深入 JWT 的結構與原理；然後實作整套 Spring Boot 的 JWT 認證流程。
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

<!--
想像一個大型主題樂園，有兩個售票口。你在左邊售票口登記了，拿到一張號碼牌。但右邊售票口的工作人員根本不知道你登記過！這就是水平擴展時 Session 的問題。
-->

---

# HttpSession 的解法比較

| 解法 | 缺點 |
|------|------|
| Sticky Session | 失去水平擴展的彈性 |
| Session 共享（Redis） | 增加基礎設施複雜度 |
| **JWT（無狀態）** | **⭐ 伺服器完全不需要儲存狀態** |

<!--
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
好了，原理講完了！現在來實作。第一步是加入 jjwt 依賴。注意版本：我們用的是 0.12.x，API 跟舊版 0.11.x 有重大差異。
-->

---

# build.gradle：加入 jjwt 依賴

```groovy
implementation 'io.jsonwebtoken:jjwt-api:0.12.5'
runtimeOnly    'io.jsonwebtoken:jjwt-impl:0.12.5'
runtimeOnly    'io.jsonwebtoken:jjwt-jackson:0.12.5'
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> jjwt-impl 和 jjwt-jackson 都要設 <code>runtimeOnly</code>！jjwt-api 是編譯期介面，後兩者是執行期實作。
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

# application.properties：設定 jwt.secret

`JwtUtil` 裡的 `@Value("${jwt.secret}")` 要從這裡讀值，記得先加這行：

```properties
jwt.secret=NDI2ZTQ3M2E0MjY1NTk3MDRlNTgzODJlNmU2MzM0MzQzMzM2MzY3Mzc3
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>密鑰哪裡來？</b> 要是 <b>Base64 編碼過的隨機亂數</b>，長度至少 256-bit（32 bytes）。開發期間可以用線上工具或指令產生，例如：<code>openssl rand -base64 32</code>。
</div>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>正式環境不要寫在 properties 裡！</b> 這裡放的只是開發用的假值，部署時要用環境變數覆蓋：<code>JWT_SECRET=真正的密鑰 java -jar app.jar</code>，並把設定改成 <code>jwt.secret=${JWT_SECRET}</code>。詳細安全實踐 Part 12 會再提一次。
</div>

<!--
這一頁補上前面沒講清楚的地方：JwtUtil 裡 @Value("${jwt.secret}") 要吃到值，一定要在 application.properties（或 application.yml）先設定 jwt.secret 這個 key，不然啟動就會噴錯，找不到這個 placeholder。

密鑰內容不能隨便打字串，要是隨機產生、Base64 編碼過的位元組，長度至少 256-bit，因為 HS256 演算法要求密鑰長度足夠，太短會在 getSigningKey() 那行拋出 WeakKeyException。

正式環境的做法：properties 裡只放假值當預設，實際上線時透過環境變數 JWT_SECRET 覆蓋，寫法是 jwt.secret=${JWT_SECRET}，Spring Boot 會自動用環境變數的值取代 properties 裡的預設值。這樣密鑰就不會被寫進 Git。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtUtil（1/3）：類別宣告與密鑰

<div class="mb-2 text-sm text-gray-500">
📁 建議放在 <code>security</code> package（跟 <code>JwtAuthFilter</code>、<code>SecurityConfig</code> 同層）
</div>

```java
package com.example.demo.security;

@Component
public class JwtUtil {

    // 密鑰從 application.properties 讀取，不寫死在程式碼裡
    @Value("${jwt.secret}")
    private String secret;

    // 把 Base64 密鑰字串還原成簽章用的 SecretKey 物件
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

<!--
先看類別骨架：@Component 讓 Spring 管理這個 Bean；secret 從設定檔注入；getSigningKey() 是共用方法，把 Base64 字串轉成簽章要用的 SecretKey，後面生成與驗證 Token 都會呼叫它。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtUtil（2/3）：生成 Token

```java
// 產生 Token：帳號 + 發行時間 + 過期時間，簽名後輸出字串
public String generateToken(String username) {
    return Jwts.builder()
        .subject(username)           // 放帳號到 sub 欄位
        .issuedAt(new Date())         // 記錄發行時間 iat
        .expiration(new Date(
            System.currentTimeMillis() + 86400000)) // 24 小時後過期
        .signWith(getSigningKey())    // 用密鑰簽名，防止竄改
        .compact();                   // 組成最終的 JWT 字串
}
```

<!--
注意 jjwt 0.12.x 的新 API：.subject() 取代了舊版的 .setSubject()，.expiration() 取代了 .setExpiration()。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtUtil（3/3）：驗證與解析 Token

```java
// 解析 Token，驗證簽名，取出 Payload 裡的所有 Claims
// 簽名不對或已過期時，parseSignedClaims() 會拋出 JwtException
public Claims extractAllClaims(String token) {
    return Jwts.parser()
        .verifyWith(getSigningKey())  // 用同一把密鑰驗證簽名
        .build()
        .parseSignedClaims(token)     // 解析並驗證，失敗就丟例外
        .getPayload();                // 取出 Claims（Payload 內容）
}

// 從 Token 取出 sub 欄位，也就是使用者帳號
public String extractUsername(String token) {
    return extractAllClaims(token).getSubject();
}

// 驗證 Token：帳號要對得上，且尚未過期，兩者都成立才算有效
public boolean validateToken(String token, String username) {
    String tokenUsername = extractUsername(token);
    boolean expired = extractAllClaims(token)
        .getExpiration().before(new Date()); // 過期時間早於現在 = 已過期
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

# JwtAuthFilter 在做什麼？

**目的：** 每個請求進來時，檢查有沒有帶合法的 JWT，有的話就幫 Spring Security「登入」這個使用者。

| 步驟 | 說明 |
|------|------|
| 1. 攔截請求 | 繼承 `OncePerRequestFilter`，每個請求保證只執行一次 |
| 2. 抽取 Token | 從 `Authorization: Bearer <token>` Header 拿出 Token |
| 3. 驗證 Token | 用 `JwtUtil` 檢查簽名、有沒有過期 |
| 4. 設定登入狀態 | 驗證成功 → 寫入 `SecurityContextHolder`，後續程式碼才能用 `Authentication` 取得使用者 |
| 5. 放行 | 呼叫 `filterChain.doFilter()`，繼續往下一個 Filter / Controller |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼需要這個 Filter？</b> Session 認證時 Spring Security 靠 Cookie 裡的 Session ID 自動判斷登入狀態；換成 JWT 後沒有 Session，必須自己寫 Filter 去解析 Header 裡的 Token，手動告訴 Spring Security「這個人是誰」。
</div>

<!--
這張投影片是全章最關鍵的心智模型：JwtAuthFilter 就是「手動版的登入判斷邏輯」。Session 時代 Spring Security 自動幫你做這件事；JWT 是無狀態的，沒人幫你做，所以要自己寫一個 Filter 插進過濾鏈，每個請求都跑一次，把 Token 換成 Spring Security 看得懂的 Authentication 物件。

接下來三頁分別是：類別宣告 → 抽取 Token → 設定 Authentication，其實就是把上面這五步拆開來看程式碼。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtAuthFilter（1/4）：類別宣告

```java
package com.example.demo.security;

@Component
@RequiredArgsConstructor
// 繼承 OncePerRequestFilter：保證每個請求只跑一次這個 Filter
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;               // 驗證 Token 用
    private final UserDetailsService userDetailsService; // 依帳號查使用者資料

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {
        // 這裡會做：抽取 Token → 驗證 → 設定 Authentication（見下兩頁）
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 3.x / 4.x：</b> import 路徑是 <code>jakarta.servlet.*</code>，不是舊版的 <code>javax.servlet.*</code>。
</div>

<!--
OncePerRequestFilter 保證每個請求只執行一次，即使有 Forward 或 Include 也不會重複執行。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtAuthFilter（2/4）：抽取 Token

```java
        // 從 Header 拿 Authorization 欄位，格式：Bearer <token>
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null
                && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);           // 去掉 "Bearer " 七個字元，取出純 Token
            try {
                username = jwtUtil.extractUsername(token); // 解析 Token 拿到帳號（sub）
            } catch (JwtException e) {
                // Token 過期、簽名不對、格式壞掉 → 當作「沒帶 Token」處理
                username = null;    // 不要往外拋，否則會變成 500 而不是 401
            }
        }
        // 沒帶 Header / 格式不對 / Token 無效 → username 維持 null
        // → 後面跳過驗證，放行給 Spring Security 判斷 401/403
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>一定要 try-catch！</b> <code>parseSignedClaims()</code> 遇到過期或被竄改的 Token 會拋 <code>JwtException</code>。Filter 裡不接住的話，例外會一路衝出去變成 <b>500 Internal Server Error</b>，而不是正確的 <b>401 Unauthorized</b>。
</div>

<!--
Authorization Header 的格式是「Bearer 空格 token」，用 substring(7) 跳過前七個字元取得純 Token。

這裡的 try-catch 是實務上絕對不能省的一步。前面 JwtUtil 那頁講過 parseSignedClaims() 驗證失敗會丟 JwtException，接住的地方就在這裡。

接住之後的處理很單純：把 username 設回 null，等於告訴後面的程式碼「這個請求沒有有效身份」，
讓 Spring Security 的授權機制照常回 401，這才是正確的 HTTP 語意。
Token 過期是使用者端的正常狀況，不該回 500 說伺服器壞掉。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtAuthFilter（3/4）：檢查並載入使用者

```java
// username 存在，且目前 SecurityContext 還沒登入過，才需要處理
if (username != null &&
    SecurityContextHolder.getContext()
        .getAuthentication() == null) {

    // 依帳號查出使用者詳細資料（密碼、角色等）
    UserDetails userDetails =
        userDetailsService.loadUserByUsername(username);

    // 再次驗證 Token 簽名與是否過期，確保沒被竄改
    if (jwtUtil.validateToken(token, username)) {
        // 下一頁：建立 Authentication 並寫入 SecurityContext
    }
}
```

<!--
這裡先做兩層檢查：username 有值代表 Token 有解析出帳號；SecurityContext 還沒登入過，避免重複設定。通過才去查使用者資料，再用 validateToken 二次確認 Token 沒被竄改、沒過期。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# JwtAuthFilter（4/4）：建立 Authentication 並放行

```java
                // 建立 Spring Security 認得的 Authentication 物件
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null,             // 密碼欄位設 null，因為已經用 Token 驗證過，不需要再核對密碼
                        userDetails.getAuthorities());
                authToken.setDetails(
                    new WebAuthenticationDetailsSource()
                        .buildDetails(request));       // 附加請求細節（如 IP）
                // 寫入 SecurityContext，等同於「這個請求已登入」
                SecurityContextHolder.getContext()
                    .setAuthentication(authToken);
        filterChain.doFilter(request, response); // 不管有沒有驗證成功，都要放行，交給下一個 Filter 或 Controller 處理
    }
}
```

<!--
這段邏輯是 JWT Filter 的核心：如果 Token 有效，就建立 UsernamePasswordAuthenticationToken 物件，放進 SecurityContextHolder。

重要：最後一定要呼叫 filterChain.doFilter()，讓請求繼續往下走！不管驗證成功與否都要放行，失敗的情況交給後面 Spring Security 的授權機制去擋（回 401/403）。
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

# 跟 ch44 的 SecurityConfig 差在哪？

**直接接手 ch44 練習二的專案改**，只動三個地方：

| 項目 | ch44 練習二（Session 版） | ch45（JWT 版） |
|------|-------------------|----------------|
| 登入方式 | `.httpBasic(...)` | ① **刪掉 httpBasic**，改用自己的 `/auth/login` |
| Session | 預設 Stateful，靠 Session 記登入狀態 | ② 加 `.sessionCreationPolicy(STATELESS)` |
| **JWT 加在哪** | — | ③ 加 `.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)` |
| 路徑授權規則 | `/api/products/**`、`/api/admin/**`… | **完全不變**，只多開一條 `/auth/**` |
| `UserDetailsService` | `CustomUserDetailsService`（查 DB） | **完全不變**，原封不動繼續用 |
| `PasswordEncoder` | `BCryptPasswordEncoder` | **完全不變** |

<!--
先給學生一個心理定位：ch45 不是重開一個專案，是把 ch44 練習二的成果拿來改三行。

ch44 是 Session 模式：不寫 addFilterBefore，因為登入判斷完全交給 Spring Security 內建的 BasicAuthenticationFilter（Basic Auth）處理。

ch45 是 JWT 模式，關鍵差異就是 addFilterBefore：我們自己寫的 JwtAuthFilter 要插進過濾鏈，而且要插在 UsernamePasswordAuthenticationFilter 前面——這樣每個請求進來，會先讓 JwtAuthFilter 檢查 Header 有沒有合法 Token、設定好 SecurityContext，之後才輪到後面的授權判斷。

如果沒有這行 addFilterBefore，JwtAuthFilter 就不會被排進過濾鏈，Token 驗證完全不會發生。

強調下面三列「完全不變」：授權規則、UserDetailsService、PasswordEncoder 都是 ch44 寫好的，一行都不用改，降低學生的心理負擔。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# SecurityConfig（1/4）：授權規則（沿用 ch44）

`authorizeHttpRequests` 整組**沿用 ch44 練習二**，只多開一條 `/auth/**`：

```java
@Bean
public SecurityFilterChain securityFilterChain(
        HttpSecurity http, JwtAuthFilter jwtAuthFilter)  // ← 方法參數注入，不是 field
        throws Exception {
    http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/**").permitAll()                   // ← ch45 新增：登入端點
            .requestMatchers(HttpMethod.POST, "/api/register").permitAll()  // ch44 沿用
            .requestMatchers(HttpMethod.GET,    "/api/products/**").permitAll()
            .requestMatchers(HttpMethod.POST,   "/api/products/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT,    "/api/products/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
            .requestMatchers("/api/orders/my").authenticated()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated())
        // ↓ sessionManagement / addFilterBefore / csrf 見下一頁
```

<!--
這頁的重點是「差異」而不是「全新」：整段 authorizeHttpRequests 跟 ch44 練習二一字不差，
只在最上面多加一條 /auth/** permitAll。

/api/register 一定要留著，否則新用戶沒帳號、又不能註冊，根本拿不到 Token 去登入——
這就是 ch44 練習二講過的雞生蛋問題，換成 JWT 之後一樣存在。

授權規則展開就是這一頁的全部內容，剩下的 STATELESS / addFilterBefore / csrf 留到下一頁。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# SecurityConfig（2/4）：無狀態設定 + 掛 Filter

接續上一頁的 `authorizeHttpRequests`，三個 ch45 新增項都在這裡：

```java
        .sessionManagement(session -> session                          // ← ch45 新增
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))   //   強制無狀態
        .addFilterBefore(jwtAuthFilter,                                // ← ch45 新增
            UsernamePasswordAuthenticationFilter.class)
        .csrf(csrf -> csrf.disable());        // ch44 沿用（.httpBasic 則要刪掉）
    return http.build();
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>三個 ch45 新增項：</b> ① <code>STATELESS</code>（不建 Session）② <code>addFilterBefore</code>（把 <code>JwtAuthFilter</code> 插進過濾鏈）③ 把 ch44 的 <code>.httpBasic(...)</code> 刪掉（帳密只在 <code>/auth/login</code> 交換一次，不再每次請求都帶）。
</div>

<!--
三個 ch45 新增項：STATELESS（不建 Session）、addFilterBefore（把 JwtAuthFilter 插進過濾鏈）、
以及把 ch44 的 .httpBasic(...) 刪掉（帳密只在 /auth/login 交換一次，不再每次請求都帶）。

DSL 順序跟 ch44 一致：authorizeHttpRequests 先寫，csrf 收尾，中間插 ch45 新增的東西，
這樣兩章的設定檔並排看差異一目了然。

addFilterBefore 是整個 ch45 跟 ch44 結構上最大的差異：我們自己寫的 JwtAuthFilter 要插進過濾鏈，
而且要插在 UsernamePasswordAuthenticationFilter 前面——這樣每個請求進來，
會先讓 JwtAuthFilter 檢查 Header 有沒有合法 Token、設定好 SecurityContext，之後才輪到後面的授權判斷。
如果沒有這行，JwtAuthFilter 就不會被排進過濾鏈，Token 驗證完全不會發生。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# SecurityConfig（3/4）：PasswordEncoder Bean（ch44 沿用）

```java
    @Bean
    public PasswordEncoder passwordEncoder() {   // 跟 ch44 一字不差
        return new BCryptPasswordEncoder();
    }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼 JWT 專案還需要 PasswordEncoder？</b><br>
JWT 只解決「發完 Token 之後怎麼認人」，但 <code>/auth/login</code> 第一次驗帳密時，還是要靠 <code>DaoAuthenticationProvider</code> 用它去 <code>matches()</code> 比對 DB 裡的 BCrypt 密文。<b>註冊 API 存密碼時也是用同一個 Bean。</b>
</div>

<!--
這個 Bean 從 ch44 一路帶過來，完全沒改。

要跟學生講清楚它在 JWT 架構裡的位置：JWT 不會取代密碼驗證，只是取代「Session 記住你」這件事。
帳密比對還是照舊發生在 /auth/login 那一次，之後才換成 Token。
ch44 練習二寫的註冊 API（passwordEncoder.encode）也是用這個 Bean，同樣不用改。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# SecurityConfig（4/4）：AuthenticationManager Bean（ch45 新增）

`AuthController` 要用它驗帳密，但這個介面**不會自動註冊**，得自己組：

```java
    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService,   // ← ch44 的 CustomUserDetailsService
            PasswordEncoder passwordEncoder) {       // ← 上一頁的 Bean
        DaoAuthenticationProvider provider =
            new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(provider);
    }
```

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>版本注意：</b> <code>new DaoAuthenticationProvider(userDetailsService)</code> 這個建構子是 <b>Spring Security 6.4+</b>（Spring Boot 3.4+）才有。若你用 Boot 3.0–3.3，改成無參數建構 + <code>provider.setUserDetailsService(userDetailsService)</code>。
</div>

<!--
這是整章最常被漏掉的一個 Bean：AuthController 建構子要 AuthenticationManager，但這個介面在 Spring Boot 3.x/4.x 不會自動註冊，要自己組一個出來。

這裡直接用 DaoAuthenticationProvider 明確組裝：注入 UserDetailsService（查使用者）跟 PasswordEncoder（比對密碼），包成 ProviderManager 回傳。之所以不用 AuthenticationConfiguration.getAuthenticationManager()，是因為它依賴容器自動偵測唯一一組 bean 來組裝，一旦有多個候選 bean 就容易組裝失敗。明確寫出 DaoAuthenticationProvider，行為固定、好除錯。

版本坑要特別提醒：帶參數的建構子是 6.4 才加的，之前只有 no-arg + setter。學生如果用比較舊的 Boot 版本會編譯失敗，看到 "constructor not found" 就知道是這個原因。

注意這兩個參數都是方法參數注入，容器裡有什麼就自動接什麼——下一頁講這個「什麼」是哪來的。
-->

---
style: |
  pre, code { font-size: 0.8em !important; line-height: 1.3 !important; }
---

# SecurityConfig 完整檔一覽

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean                                                    // ch44 沿用，一行沒改
    public PasswordEncoder passwordEncoder() { ... }

    @Bean                                                    // ch45 新增
    public AuthenticationManager authenticationManager(
            UserDetailsService uds, PasswordEncoder encoder) { ... }

    @Bean                                                    // ch44 改造：+STATELESS +addFilterBefore −httpBasic
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http, JwtAuthFilter jwtAuthFilter) { ... }

    // ❌ 沒有 userDetailsService() ——
    //    ch44 的 CustomUserDetailsService 標了 @Service，Spring 自動註冊，
    //    這裡再宣告一個就會撞型別（NoUniqueBeanDefinitionException）
}
```

<!--
給學生一張「全貌圖」，前三頁是拆開講，這頁把三個 Bean 放回同一個 class 裡，
並標註每個 Bean 的來歷：哪個是 ch44 原封不動、哪個是 ch45 新增、哪個是改造。

最後那段註解是全章最容易踩的雷，特別留在完整檔裡讓學生看到「這裡是空的、而且是刻意的」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 9
## Java record

<!--
在寫 AuthController 之前，先補充一下 record 這個 Java 語法糖，因為前面的 LoginRequest / LoginResponse 都會用到它。
-->

---

# 什麼是 Java record？

**record** 是 Java 16 正式導入的語法糖，專門用來寫「只裝資料、不帶行為」的類別（DTO、Value Object）。

```java
public record LoginRequest(String username, String password) {}
```

一行就自動幫你產生：

| 自動產生 | 效果 |
|----------|------|
| Constructor | `new LoginRequest("alice", "pass123")` |
| Getter | `request.username()`、`request.password()`（不是 `getUsername()`） |
| `equals()` / `hashCode()` | 依欄位值比較，不用手寫 |
| `toString()` | 自動印出所有欄位 |

<!--
record 是這幾年 Java 最實用的語法糖之一。它的重點是「不可變」：一旦建立就不能改欄位值，符合 DTO 應有的行為——資料從外面傳進來，經過驗證、轉換，不應該中途被誰偷改。

Getter 命名要注意：record 用的是 username()、password() 這種無 get 前綴的寫法，不是傳統 JavaBean 的 getUsername()。這點常讓第一次接觸的人愣一下。
-->

---

# record 跟 Lombok @Data 差在哪？

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>跟 Lombok @Data 的差異：</b> record 是 Java 語言原生特性，不需要額外套件；但 record 的欄位是<b>不可變</b>（immutable，沒有 setter），@Data 產生的類別欄位可變。
</div>

| 類型 | 適用嗎？ | 為什麼 |
|------|:---:|--------|
| **DTO**（如 ch37 的 `CreateStudentRequest`、`StudentResponse`） | ✅ | 本來就只是資料容器，record 天生就是幹這個 |
| **VO**（如 ch37 的 `ScoreVO`） | ✅ | VO 本來就要求不可變（`final` 欄位、無 setter）—— record **天生就不可變**，比手寫 VO 更少程式碼 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>record 不是只能裝資料：</b> 它也能像一般類別一樣加自訂方法、加建構子驗證（compact constructor）。這就是為什麼連有業務邏輯的 VO 都能改寫成 record，下一頁實際比較 ch37 的程式碼。
</div>

<!--
這一頁回答兩個常見疑問：一是 record 跟 Lombok @Data 到底差在哪，二是 record 是不是只能用在單純的 DTO。

答案是 DTO、VO 都適用。DTO 本來就該不可變，record 剛好內建這個特性。VO 更妙——ch37 教的 VO 定義本來就要求 final 欄位、沒有 setter、建構時驗證，這跟 record 的預設行為根本一模一樣，用 record 寫 VO 反而比手寫更精簡，也更不容易漏寫 equals/hashCode。

很多人誤會 record 只能是「純資料傳輸物件」，其實 record 內部可以加自訂方法，也能用 compact constructor 加驗證邏輯，下一頁直接拿 ch37 的三個類別做前後對照。
-->

---
style: |
  pre, code { font-size: 0.8em !important; line-height: 1.3 !important; }
---

# ch37 範例改寫（1/3）：DTO 換成 record

```java
// Before（ch37 原本寫法）              →  After（record）
public class CreateStudentRequest {      public record CreateStudentRequest(
    private String name;                     String name,
    private String password;                 String password,
    private Integer score;                   Integer score
    // Getter / Setter（省略）           ) {}
}
```

```java
// Before                                →  After（record）
public class StudentResponse {           public record StudentResponse(
    private Integer id;                      Integer id,
    private String name;                     String name,
    private Integer score;                   Integer score,
    private String letterGrade;              String letterGrade
    // Getter / Setter（省略）           ) {}
}
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Service 裡建立方式從 <code>new StudentResponse(); resp.setId(...)</code> 改成一次到位：<code>new StudentResponse(po.getId(), po.getName(), value, grade)</code>；讀取從 <code>resp.getId()</code> 改成 <code>resp.id()</code>。
</div>

<!--
CreateStudentRequest 和 StudentResponse 都是純資料容器，本來就沒有業務邏輯，是 record 最標準的使用場景。

改寫後最大的差異：Service 裡不再用「new 一個空物件 + 逐一 setter」這種寫法，而是建構子一次把所有欄位塞好；Controller 或 Service 讀取欄位也從 getXxx() 改成 xxx()。
-->

---
style: |
  pre, code { font-size: 0.78em !important; line-height: 1.3 !important; }
---

# ch37 範例改寫（2/3）：ScoreVO 原本的寫法

```java
// Before（ch37 原本寫法：手寫不可變 + 驗證 + 業務方法）
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

**手動做了三件事：** ① 宣告 `final` 欄位保證不可變 ② constructor 裡驗證分數範圍 ③ 手寫 `getValue()` getter。

<!--
先看 ch37 原本的手寫版本。三個重點：private final 欄位保證物件建立後不能再改值；constructor 裡做 0-100 範圍驗證；getValue() 是手寫的 getter。

這三件事其實都是「不可變 + 驗證」這種 VO 該有的標準行為，但每一個 VO 都要重複寫一次建構子跟 getter，很囉唆。下一頁看 record 怎麼把這些簡化掉。
-->

---
style: |
  pre, code { font-size: 0.8em !important; line-height: 1.3 !important; }
---

# ch37 範例改寫（3/3）：ScoreVO 換成 record

```java
// After（record：compact constructor 驗證 + 保留業務方法）
public record ScoreVO(Integer value) {
    public ScoreVO {                // compact constructor：驗證邏輯搬進來
        if (value < 0 || value > 100)
            throw new IllegalArgumentException("分數需在 0–100 之間");
    }
    public String getLetterGrade() {  // 自訂方法照樣能加
        if (value >= 90) return "A"; if (value >= 80) return "B";
        return value >= 70 ? "C" : "F";
    }
}
```

<div class="mt-2 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ 少寫的部分：<code>private final</code> 欄位宣告、一般 constructor 賦值、<code>getValue()</code>（record 自動生成 <code>value()</code>）。<code>getLetterGrade()</code> 業務方法完全保留，直接搬過去就能用。
</div>

<!--
ScoreVO 是今天最能體現「VO 用 record 更合適」的例子。record 版用 compact constructor（沒有參數列表的那種 public ScoreVO { ... }）把驗證邏輯放進去，value() 這個 getter 自動產生，完全不用手寫。

唯一要注意：compact constructor 只能寫驗證或正規化邏輯，不能自己手動賦值（record 會在 compact constructor 執行完後自動把參數賦值給欄位）。

getLetterGrade() 這種自訂業務方法，record 一樣支援，直接原封不動搬過去即可，這也證明 record 不是只能裝資料，VO 這種「不可變 + 帶業務邏輯」的用途完全適用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 10
## AuthController 登入端點

<!--
record 補充完了，現在來實作 Controller！
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
💡 <b>Java record：</b> Spring Boot 3.x / 4.x 原生支援。自動產生 constructor、getter、equals、hashCode，比 Lombok @Data 更簡潔。
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

# 用 Postman 測試（1/2）：登入拿 Token

因為拿掉了 `.formLogin()` / `.httpBasic()`，**Postman 的 Authorization 頁籤不能選 Basic Auth 了**，要分兩步手動打。

**第一步：登入拿 Token**

```
POST /auth/login
Content-Type: application/json

{ "username": "alice", "password": "pass123" }
```

回傳 `200 OK`，body 裡的 `token` 欄位就是要用的 JWT。

<!--
這裡強調跟 ch44 的操作差異：ch44 用 httpBasic，Postman 選 Basic Auth 帳密就搞定；ch45 完全沒開 httpBasic，帳密驗證只在 /auth/login 這個端點做一次性交換。

實際操作：送 POST /auth/login，把回傳 body 裡的 token 字串複製起來，下一頁要用。
-->

---

# 用 Postman 測試（2/2）：帶 Token 呼叫受保護 API

**第二步：帶著 Token 呼叫受保護 API**

在 Postman 的 **Headers** 加一行（或 Authorization 頁籤選 **Bearer Token** 貼上）：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOi...
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>常見誤區：</b> 忘記拿掉 Basic Auth 設定，或 Header 打成 <code>Bearer&lt;token&gt;</code>（少一個空格）都會導致 <code>JwtAuthFilter</code> 解析不到 username，最後回 401/403。
</div>

<!--
換到 Token 之後全靠 Bearer Token 這個 Header：每個要保護的請求都在 Header 加 Authorization: Bearer <token>，Postman 也可以直接在 Authorization 頁籤選 Bearer Token 類型貼上，效果一樣。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 11
## 完整登入流程

<!--
讓我們把整個 JWT 認證流程串起來。
-->

---

# 完整登入與認證流程（1/2）：取得 Token

**第一階段：取得 Token（登入）**

| 步驟 | 動作 | 說明 |
|------|------|------|
| 1 | 前端 POST /auth/login | 帶上 username + password |
| 2 | AuthController | 呼叫 AuthenticationManager 驗證 |
| 3 | 驗證成功 | JwtUtil.generateToken() 生成 Token |
| 4 | 回傳 200 OK | 回應 body 包含 JWT Token |

<!--
第一階段只做一次（登入），拿到 Token 之後前端要自己保存下來，之後每個受保護請求都要帶著它。
-->

---

# 完整登入與認證流程（2/2）：使用 Token 存取資源

**第二階段：使用 Token 存取資源**

| 步驟 | 動作 | 說明 |
|------|------|------|
| 5 | 前端發請求 | Header 帶 `Authorization: Bearer <token>` |
| 6 | JwtAuthFilter | 抽取並驗證 Token |
| 7 | 驗證成功 | 設定 SecurityContextHolder |
| 8 | Controller 執行 | 回傳受保護資源 |

<!--
把這兩張表貼在你的筆記本上！整個 JWT 流程就是這 8 步。

第二階段每個受保護的請求都會執行。Filter 是無感的，使用者感覺不到，但每次請求 Spring Security 都在背後默默驗證 Token 的合法性。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 12
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

# 練習：加入 Refresh Token 機制
### 任務說明

延續本章 Part 6~10 教過的 `JwtUtil` / `JwtAuthFilter` / `SecurityConfig` / `AuthController`（也就是接手 ch44 練習二的專案改成 JWT 之後的成果），加入 Refresh Token 功能：

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

# 練習：解題提示
### 提示說明

**思考題解答：**

| | Access Token | Refresh Token |
|---|---|---|
| 時效 | 短（15分鐘~24小時） | 長（7天） |
| 儲存 | 客戶端（無需資料庫） | 資料庫（需要廢止能力） |
| 廢止 | 等待過期即可 | 刪除資料庫記錄即廢止 |

**解題順序建議：** `RefreshToken` Entity → `JwtUtil.generateRefreshToken()` → `LoginResponse` 加欄位 → `AuthController` 的 `/auth/login` 順便存 Refresh Token → 新增 `/auth/refresh`、`/auth/logout`。

<!--
Refresh Token 存資料庫是因為它有「廢止」的需求——logout 時要能立刻讓它失效。Access Token 存在客戶端，因為它很短效，等過期就好，不需要主動廢止。

這就是 JWT + Refresh Token 架構的核心設計思路。下面幾頁給完整解答程式碼。
-->

---
style: |
  pre, code { font-size: 0.8em !important; line-height: 1.3 !important; }
---

# 練習：解答程式碼（1/8）— RefreshToken Entity

```java
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private Instant expiryDate;

    // getter / setter 省略
}
```

<!--
跟 ch44 教的 Entity 套路完全一樣，token 欄位加 unique 約束避免碰撞。
Repository 見下一頁。
-->

---
style: |
  pre, code { font-size: 0.8em !important; line-height: 1.3 !important; }
---

# 練習：解答程式碼（2/8）— RefreshTokenRepository

```java
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
}
```

<!--
findByToken 是 /auth/refresh、/auth/logout 都要用到的核心查詢，
繼承 JpaRepository 就自動有基本 CRUD，這裡只加一個自訂查詢方法。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# 練習：解答程式碼（3/8）— JwtUtil 新增方法

在 Part 6 的 `JwtUtil` 裡加一個方法，複製 `generateToken()` 只改過期時間：

```java
public String generateRefreshToken(String username) {
    return Jwts.builder()
        .subject(username)
        .issuedAt(new Date())
        .expiration(new Date(
            System.currentTimeMillis() + 604_800_000L)) // 7 天
        .signWith(getSigningKey())
        .compact();
}
```

`LoginResponse` 多加一個欄位：

```java
public record LoginResponse(
    String token,
    String refreshToken,
    String username,
    long expiresIn
) {}
```

<!--
generateRefreshToken 跟 generateToken 結構一模一樣，只有過期時間不同（7 天 vs 24 小時），
再次體現 record 改欄位有多輕鬆——LoginResponse 加一個欄位，其他程式碼不用大改，
呼叫端 new LoginResponse(...) 補一個參數即可。
-->

---
style: |
  pre, code { font-size: 0.76em !important; line-height: 1.25 !important; }
---

# 練習：解答程式碼（4/8）— AuthController：類別骨架

```java
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;   // ← 新增

    // login 方法見下一頁
}
```

<!--
跟 Part 10 教的 AuthController 比，只多注入一個 RefreshTokenRepository。
login 方法要改成同時簽發 Access Token 跟 Refresh Token，並把 Refresh Token 存進資料庫。
-->

---
style: |
  pre, code { font-size: 0.76em !important; line-height: 1.25 !important; }
---

# 練習：解答程式碼（5/8）— AuthController：login 簽發雙 Token

接續上一頁同一個 `AuthController` 類別：

```java
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.username(), request.password()));

        String accessToken = jwtUtil.generateToken(request.username());
        String refreshToken = jwtUtil.generateRefreshToken(request.username());
        // 存進資料庫、回傳 見下一頁
```

<!--
帳密驗證通過後，同時生成 Access Token 跟 Refresh Token，接下來要把 Refresh Token 存進資料庫。
-->

---
style: |
  pre, code { font-size: 0.78em !important; line-height: 1.3 !important; }
---

# 練習：解答程式碼（6/8）— AuthController：存 Refresh Token 並回傳

接續上一頁同一個 `login` 方法：

```java
        RefreshToken entity = new RefreshToken();
        entity.setUsername(request.username());
        entity.setToken(refreshToken);
        entity.setExpiryDate(Instant.now().plusSeconds(604_800)); // 7 天
        refreshTokenRepository.save(entity);

        return ResponseEntity.ok(new LoginResponse(
            accessToken, refreshToken, request.username(), 86400000));
    }
    // /auth/refresh、/auth/logout 見下兩頁
}
```

<!--
login 方法在簽發 Access Token 之外，多做一件事：生成 Refresh Token 並存進資料庫，
之後 /auth/refresh、/auth/logout 都要靠這筆紀錄運作。
-->

---
style: |
  pre, code { font-size: 0.8em !important; line-height: 1.3 !important; }
---

# 練習：解答程式碼（7/8）— /auth/refresh

接續同一個 `AuthController`：

```java
public record RefreshRequest(String refreshToken) {}

@PostMapping("/refresh")
public ResponseEntity<LoginResponse> refresh(@RequestBody RefreshRequest request) {
    RefreshToken saved = refreshTokenRepository.findByToken(request.refreshToken())
        .orElseThrow(() -> new RuntimeException("Refresh Token 無效"));

    if (saved.getExpiryDate().isBefore(Instant.now())) {
        refreshTokenRepository.delete(saved);           // 過期就順手清掉
        throw new RuntimeException("Refresh Token 已過期，請重新登入");
    }

    String newAccessToken = jwtUtil.generateToken(saved.getUsername());
    return ResponseEntity.ok(new LoginResponse(
        newAccessToken, saved.getToken(), saved.getUsername(), 86400000));
}
// /auth/logout 見下一頁
```

<!--
查資料庫驗證 Refresh Token 存在且沒過期，通過才簽發新的 Access Token；
注意這裡不會重新生成 Refresh Token，同一個 Refresh Token 可以一直用到它自己的 7 天期限。
-->

---
style: |
  pre, code { font-size: 0.8em !important; line-height: 1.3 !important; }
---

# 練習：解答程式碼（8/8）— /auth/logout

接續同一個 `AuthController`：

```java
@PostMapping("/logout")
public ResponseEntity<Void> logout(@RequestBody RefreshRequest request) {
    refreshTokenRepository.findByToken(request.refreshToken())
        .ifPresent(refreshTokenRepository::delete);      // 刪除 = 廢止
    return ResponseEntity.ok().build();
}
```

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>測試流程：</b> ① <code>/auth/login</code> 拿 <code>token</code> + <code>refreshToken</code> ② 等 Access Token 過期（或直接測）③ <code>POST /auth/refresh</code> 帶舊 <code>refreshToken</code> 換新 <code>token</code> ④ <code>POST /auth/logout</code> 後再打 <code>/auth/refresh</code> 應失敗（已被刪除）。
</div>

<!--
/auth/logout：直接從資料庫刪除這筆 Refresh Token 紀錄，之後任何人拿這個 Refresh Token
來 /auth/refresh 都會查不到、丟 RuntimeException——這就是「廢止」的具體實作。

實務上 RuntimeException 通常會包成自訂例外 + @ExceptionHandler 轉成 401，這裡先簡化處理，
讓學生聚焦在 Refresh Token 的存取邏輯上。
-->

---

# 思考題解答：為什麼 Refresh Token 存 DB，Access Token 不用？

**核心差異：「要不要能主動廢止」，加上「查表的成本划不划算」。**

| | Access Token | Refresh Token |
|---|---|---|
| 時效 | 短（15 分鐘~24 小時） | 長（7 天） |
| 驗證方式 | 只驗簽章，不查表 | 查 DB 確認存在、沒過期 |
| 廢止需求 | 沒有，等過期就好 | 有，logout / 換裝置要能立刻失效 |
| 查表頻率 | 每個 API 請求都會用到 | 只有 `/auth/refresh`、`/auth/logout` 才用到 |

<!--
這頁把思考題從「記憶題」升級成「設計題」：不只是背答案，而是理解背後的取捨——
查表有成本，只有在真的需要「主動廢止」時才值得付這個成本。
下一頁講為什麼會有這個差異，以及業界怎麼進一步強化這個設計。
-->

---

# 延伸：白名單 vs 黑名單

| 項目 | Access Token | Refresh Token |
|------|--------------|----------------|
| 查表頻率 | 高（每個 API 請求都要驗） | 低（只在換發 / 登出時） |
| 存放策略 | 不存，只驗簽章 | 存 DB，即**白名單**（查得到才算數） |
| 若需強制廢止 | 搭配 Redis **黑名單**，TTL 設成跟剩餘效期一樣短 | 直接刪除 DB 紀錄即廢止 |
| 為什麼這樣分工 | 頻率高，查表不划算 | 壽命長、外洩風險高，值得換一次查詢 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>補充：Refresh Token Rotation</b> —— 這裡的解法讓同一個 Refresh Token 能重複用到 7 天期限。業界主流（Auth0、Okta）會做 Rotation：每次 <code>/auth/refresh</code> 用掉舊 token 就刪除、換發新的存回 DB，舊 token 被重放即可偵測外洩。
</div>

<!--
白名單 vs 黑名單這組概念很容易混：Refresh Token 存 DB 是白名單，
黑名單則反過來用在原本不查表的 Access Token 上，只在需要緊急踢人時才啟用，兩者搭配使用。

Rotation 是進階內容，點出來讓學生知道這章教的是簡化版，留一個延伸方向，不要求在這個練習裡實作。
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

課後建議：先跟著本章 Part 6~10 把基本 JWT 登入流程跑通，再挑戰練習的 Refresh Token 機制。

如果在實作過程中遇到問題，先看一下錯誤訊息，通常 403 是認證問題、401 是 Token 無效、500 才是程式碼問題。
-->
