---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Security
routeAlias: ch44
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
    Spring Security
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓 API 知道：你是誰？你有資格嗎？」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
歡迎來到 Spring Security 這個章節！

我們今天要處理一個很現實的問題：我們的 API 現在任何人都能呼叫，
這樣不行對吧？銀行 API 不能讓路人隨便查餘額，
後台管理介面也不能讓一般用戶亂進去。

Spring Security 就是幫我們解決這件事的框架。
-->

---
layout: default
---

# Outline

- **認證 vs 授權** — Authentication / Authorization 核心概念
- **加入 Spring Security 依賴** — build.gradle 設定
- **預設行為** — Spring Security 開箱即用的保護機制
- **SecurityFilterChain** — Spring Boot 3.x / 4.x 的設定方式
- **路徑授權規則** — `requestMatchers` 與 `hasRole`
- **InMemoryUserDetailsManager** — 快速測試帳號設定
- **UserDetailsService** — 從資料庫載入使用者
- **BCryptPasswordEncoder** — 密碼加密
- **CSRF 保護** — 何時開、何時關
- **Filter Chain 架構** — Spring Security 執行流程
- **實作練習**

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 認證 vs 授權：兩個核心概念

<!--
在開始寫任何程式碼之前，我們要先搞清楚兩個常常被混用的概念。
很多同學一開始會把認證跟授權搞混，但其實這兩個是完全不同的事情。
-->

---

# 認證（Authentication）vs 授權（Authorization）

想像一棟大樓的門禁系統：

| 概念 | 英文 | 問的問題 | 大樓比喻 |
|------|------|----------|----------|
| 認證 | Authentication | **你是誰？** | 刷門禁卡，確認你是員工 |
| 授權 | Authorization | **你可以做什麼？** | 你只能進 3 樓，不能進機房 |

<br>

**流程一定是：先認證，再授權。**

沒有通過認證（不知道你是誰），就根本沒資格談授權。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶口訣：</b> Authentication = 你是誰（身份），Authorization = 你能做啥（權限）
</div>

<!--
我很喜歡用大樓門禁來解釋這兩個概念，因為大家都有進辦公大樓的經驗。

你進大樓要刷卡，這個動作是「認證」——系統確認你是這棟大樓的合法使用者。
但是刷完卡之後，你不一定每層樓都能進。
比如說機房只有 IT 人員才能進，這就是「授權」。

Spring Security 同時處理這兩件事。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 加入 Spring Security 依賴

<!--
概念清楚了，我們來動手做。
第一步永遠都是加依賴。
-->

---

# build.gradle 加入依賴

只要加一行依賴，Spring Security 就會自動生效：

```groovy
implementation 'org.springframework.boot:spring-boot-starter-security'
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>不需要指定版本：</b> Spring Boot 的 BOM 會自動管理版本，Spring Boot 3.x 對應 Spring Security 6.x、Spring Boot 4.x 對應 Spring Security 7.x。
</div>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 3.x / 4.x 版本注意：</b> 不再使用 WebSecurityConfigurerAdapter，改用 SecurityFilterChain Bean + Lambda DSL 風格。
</div>

<!--
Spring Boot 的自動配置非常強大。
只要你把這個依賴加進去，它馬上就會生效，
你的所有端點就都會被保護起來了。

WebSecurityConfigurerAdapter 在 Spring Security 6 已經被移除了。
如果你以前學過 Spring Boot 2.x，寫法有些不一樣，這點要注意。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## Spring Security 預設行為

<!--
依賴加進去之後，不寫任何設定，Spring Security 預設會做什麼？
很多人第一次加這個依賴，然後啟動專案，發現畫面變成一個登入頁面，嚇了一跳。
-->

---

# 開箱即用的預設保護

加入依賴後**不做任何設定**，Spring Security 自動提供：

| 預設行為 | 說明 |
|----------|------|
| 所有路徑都需要登入 | 任何 URL 都會被攔截，重導向到登入頁 |
| 自動產生登入頁面 | `/login` 路由由 Spring Security 自動提供 |
| 預設帳號 `user` | 每次啟動都會產生一個預設帳號 |
| 隨機密碼印在 console | 每次啟動密碼不同，在啟動 log 中顯示 |
| CSRF 保護預設開啟 | Form 提交需要帶 CSRF token |

啟動 log 會看到：

```
Using generated security password: 3d9b2c47-e1a0-4f28-9c01-abc123456
```

<!--
這個預設行為其實設計得很貼心。
如果你只是想快速測試，不需要設定任何東西，Spring Security 就幫你保護好了。

預設帳號是 user，密碼是每次啟動隨機產生的，會印在 console 裡面。

當然在正式的開發中，我們會自己設定帳號密碼，以及更細緻的授權規則。
-->

---

# 用 Postman 測試預設保護（一）Basic Auth

預設所有路徑都要登入，直接打 API 會拿到 **401 Unauthorized**。

**方法一：Basic Auth（推薦）**

在 Postman 的 **Authorization** 頁籤選 **Basic Auth**：

| 欄位 | 值 |
|------|-----|
| Username | `user` |
| Password | console 印出的隨機密碼 |

Postman 會自動加上 `Authorization: Basic dXNlcjou...` header。

<!--
提醒學生：預設密碼每次啟動都不一樣，要去 console 撈最新的那一組。
選 Basic Auth 後 Postman 會自動幫你把帳密做 Base64 編碼。
-->

---

# 用 Postman 測試預設保護（二）手動加 Header

**方法二：自己加 Authorization Header**

不用 Postman 的 Authorization 頁籤，直接在 **Headers** 加一行。

先把 `user:密碼` 做 Base64 編碼，填入：

```
Authorization: Basic dXNlcjozZDliMmM0Ny1lMWEwLi4u
```

> 兩種方法結果一樣 — Basic Auth 是 Postman 幫你算 Base64，方法二是自己算。

<!--
方法二讓學生理解 Basic Auth 底層就是 Base64(帳號:密碼)，沒有加密，只是編碼。
所以正式環境一定要走 HTTPS，不然帳密等於明文。
-->

---

# Postman 遇到 CSRF 怎麼辦？

預設 **CSRF 保護是開啟的**，用 Postman 送 `POST` / `PUT` / `DELETE` 會被擋，回傳 **403 Forbidden**。

原因：這些寫入請求需要帶 CSRF token，但 Postman 不像瀏覽器表單會自動帶。

**測試 API 時的處理方式：**

| 情境 | 做法 |
|------|------|
| 純後端 API 測試 | 在 `SecurityConfig` 關掉 CSRF：`.csrf(csrf -> csrf.disable())` |
| 保留 CSRF | 先打一個 GET 拿 `XSRF-TOKEN` cookie，再把值放進 `X-XSRF-TOKEN` header |

> 這裡先知道「關掉 CSRF 就能測」即可，CSRF 是什麼、為什麼能關，**Part 9 有完整說明**。

<!--
GET 請求不受 CSRF 影響，所以一開始測 GET 都正常，一送 POST 就 403，很多人會卡在這。
這裡只給排錯做法，CSRF 原理留到 Part 9 專章講，不要在這裡展開。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## SecurityFilterChain：Spring Boot 3.x / 4.x 的設定方式

<!--
現在我們來看最核心的設定方式。
Spring Boot 3.x / 4.x 用的是 SecurityFilterChain Bean + Lambda DSL。
這是現代 Spring Security 的標準寫法，一定要學會。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# SecurityFilterChain 基本結構（一）骨架

Spring Boot 3.x / 4.x 用 `SecurityFilterChain` Bean + Lambda DSL：

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        http
            .authorizeHttpRequests(auth -> auth ... )   // 路徑授權（下一頁）
            .formLogin(Customizer.withDefaults())
            .httpBasic(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable());
        return http.build();   // ← 一定要 build 才會建立 Filter Chain
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ Spring Boot 3.x / 4.x 不再用 <code>WebSecurityConfigurerAdapter</code>，改成 <code>SecurityFilterChain</code> Bean。
</div>

<!--
先看骨架三大要點：
一，@Configuration + @EnableWebSecurity，告訴 Spring 這是安全設定類。
二，宣告 SecurityFilterChain 這個 Bean，用 Lambda DSL 串規則。
三，最後 return http.build()，才會真的建立 Filter Chain。

authorizeHttpRequests 的完整內容下一頁展開。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# SecurityFilterChain 基本結構（二）完整內容

```java
http
    .authorizeHttpRequests(auth -> auth
        // 公開路徑：任何人都能存取
        .requestMatchers("/", "/login", "/register").permitAll()
        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
        // 需要特定角色
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .requestMatchers("/api/orders/**").hasAuthority("ORDER_WRITE")
        // 其餘所有路徑：需要登入
        .anyRequest().authenticated()
    )
    .formLogin(Customizer.withDefaults())   // 表單/session 登入
    .httpBasic(Customizer.withDefaults())   // Postman Basic Auth 靠這個
    .csrf(csrf -> csrf.disable());
```

<!--
把上一頁省略的 authorizeHttpRequests 展開。
路徑授權規則後面 Part 5 會逐條解釋，這裡先看整體長相。
最後三行的登入方式與 CSRF，再下一頁詳細說明。
-->

---

# 登入方式與 CSRF 設定

上一頁最後三行決定「怎麼登入」與「要不要 CSRF」：

| 設定 | 作用 | 什麼時候用 |
|------|------|-----------|
| `.formLogin(...)` | 表單 / session 登入，未登入導向登入頁 | 傳統網站、瀏覽器頁面 |
| `.httpBasic(...)` | 接受 `Authorization: Basic` header | Postman、curl 測 API |
| `.csrf(csrf -> csrf.disable())` | 關掉 CSRF 保護 | 純 REST API（token 驗證） |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>自訂 SecurityFilterChain 後，只有你明確寫的登入方式才生效。</b> 只寫 <code>formLogin</code>，用 Postman 送 Basic Auth 不會被認，反而拿到登入頁 HTML；要用 Basic Auth 測 API，一定要加 <code>.httpBasic(...)</code>。
</div>

<!--
關鍵觀念：Spring Security 預設 formLogin 和 httpBasic 兩種都開，
但一旦自訂 SecurityFilterChain，就變成「只有你寫的才有」。

很多人只抄了 formLogin，然後用 Postman Basic Auth 測，
結果拿到一個登入頁 HTML，卡很久 — 就是因為 httpBasic 沒開。

csrf().disable() 這裡先知道「純 API 常關掉」即可，
CSRF 是什麼、為什麼能關，Part 9 有完整說明。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## 路徑授權規則

<!--
有了基本結構之後，我們來深入了解路徑授權的設定。
哪些路徑公開，哪些要登入，哪些要特定角色。
-->

---

# authorizeHttpRequests 授權規則

| 方法 | 說明 | 範例 |
|------|------|------|
| `permitAll()` | 所有人都可以存取，不需登入 | 公開首頁、登入頁 |
| `authenticated()` | 需要登入，任何角色都可以 | 一般會員頁面 |
| `hasRole("ADMIN")` | 需要 `ROLE_ADMIN` 角色 | 後台管理 |
| `hasAuthority("READ")` | 需要 `READ` 這個 authority | 細粒度權限控制 |
| `denyAll()` | 所有人都拒絕 | 暫時關閉的功能 |

**規則順序很重要！** 從上到下依序比對，第一個符合的規則生效。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>hasRole vs hasAuthority：</b> hasRole("ADMIN") 會自動加上 ROLE_ 前綴去比對；hasAuthority("ROLE_ADMIN") 則完全比對字串。
</div>

<!--
這張表格是你最常查的東西，建議記下來。

特別強調一下規則的順序。
Spring Security 是從上到下比對的，所以比較精確的規則要放在前面。
比如 /admin/** 要放在 anyRequest 前面，不然就永遠輪不到它。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# 路徑授權設定範例

```java
http.authorizeHttpRequests(auth -> auth
    // 公開路徑：任何人都能存取
    .requestMatchers("/", "/login", "/register").permitAll()
    .requestMatchers(HttpMethod.GET, "/products/**").permitAll()

    // 需要特定角色
    .requestMatchers("/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/orders/**").hasAuthority("ORDER_WRITE")

    // 其餘所有路徑：需要登入
    .anyRequest().authenticated()
);
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>requestMatchers 支援 Ant 風格路徑：</b> <code>/admin/**</code> 代表 /admin 底下的所有路徑。
</div>

<!--
來看一個實際的範例。

首頁、登入頁、註冊頁當然要公開，不然用戶連登入都沒辦法。
GET /products/** 也可以公開，讓未登入的用戶瀏覽商品。

但是 /admin/** 就要限制成只有 ADMIN 角色才能進入。

最後 anyRequest().authenticated() 是保底規則，
其他沒有明確設定的路徑都需要登入。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
## InMemoryUserDetailsManager：快速設定測試帳號

<!--
路徑保護設定好了，那帳號密碼要怎麼設定？
對於開發和測試階段，我們可以用 InMemoryUserDetailsManager，
把帳號資料直接放在記憶體裡，不需要資料庫。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# 設定記憶體帳號（一）class 結構

三個 `@Bean` 都定義在同一個 `SecurityConfig` 裡：

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean  // ① 密碼編碼器（userDetailsService 會注入它）
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean  // ② 記憶體帳號（下一頁）
    public UserDetailsService userDetailsService(PasswordEncoder encoder) { ... }

    @Bean  // ③ 前面 Part 4 的 securityFilterChain(...)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) { ... }
}
```

<!--
先看整體結構：三個 Bean 都在同一個 @Configuration class 裡。
Spring 開機掃到 SecurityConfig，把三個 @Bean 都註冊進容器。
下一頁看 userDetailsService 的完整內容。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# 設定記憶體帳號（二）UserDetailsService

```java
@Bean
public UserDetailsService userDetailsService(PasswordEncoder encoder) {
    UserDetails user = User.builder()
        .username("alice")
        .password(encoder.encode("password123"))
        .roles("USER")
        .build();
    UserDetails admin = User.builder()
        .username("bob")
        .password(encoder.encode("admin456"))
        .roles("USER", "ADMIN")
        .build();
    return new InMemoryUserDetailsManager(user, admin);
}
```

<!--
用 User.builder() 建立每個帳號，設定帳號、密碼、角色。
PasswordEncoder 參數由容器自動注入（來自上一頁的 ① Bean）。
密碼一定要 encode，明文儲存非常危險。

InMemoryUserDetailsManager 適合開發初期或單元測試，
記憶體帳號在重啟後就不見了，不適合正式環境。

提醒：要用 Postman Basic Auth 測，securityFilterChain 裡要加 .httpBasic(Customizer.withDefaults())，
只寫 formLogin 的話 Basic Auth header 不會被認，會回 401。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
## UserDetailsService：從資料庫載入使用者

<!--
真實的專案當然不可能把帳號放在記憶體裡。
我們需要從資料庫查詢使用者資料。
這時候就要實作 UserDetailsService 介面。
-->

---

# UserDetails 介面核心方法

| 方法 | 說明 |
|------|------|
| `getUsername()` | 回傳登入用的帳號名稱 |
| `getPassword()` | 回傳（加密後的）密碼字串 |
| `getAuthorities()` | 回傳這個用戶擁有的角色/權限集合 |
| `isAccountNonExpired()` | 帳號是否未過期 |
| `isAccountNonLocked()` | 帳號是否未被鎖定 |
| `isEnabled()` | 帳號是否啟用 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>實作方式：</b> 通常讓資料庫的 User Entity 直接實作 UserDetails，或另外建一個 Adapter 類別。
</div>

<!--
UserDetails 介面定義了 Spring Security 需要知道的所有用戶資訊。

最常用的是 getUsername、getPassword、getAuthorities 這三個。
後面三個 boolean 方法讓你可以實作「帳號鎖定」、「帳號停用」等進階功能。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# User Entity（JPA）

用 JPA 把使用者對應到資料表，`username` 設唯一：

```java
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;      // 存 BCrypt 密文，不是明文

    @Column(nullable = false)
    private String role;          // 例如 "USER"、"ADMIN"

    private boolean enabled = true;

    // getter / setter 省略
}
```

<!--
業界最常見規格：username 加 unique 約束，資料庫層就擋掉重複帳號。
password 欄位存的是 BCrypt 密文，絕不存明文。
role 這裡先用單一字串，多角色可以另拉一張關聯表，這裡從簡。
enabled 對應 UserDetails.isEnabled()，可做帳號停用。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# UserRepository（Spring Data JPA）

繼承 `JpaRepository`，用方法名衍生查詢，不用寫 SQL：

```java
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>回傳 <code>Optional</code>：</b> 查無使用者時是空的 Optional，Service 就能 <code>orElseThrow</code> 丟 <code>UsernameNotFoundException</code>。
</div>

<!--
Spring Data JPA 的招牌：方法名 findByUsername 會自動生成 SELECT ... WHERE username = ?。
回傳 Optional 是業界慣例，強迫呼叫端處理「查不到」的情況，避免 NPE。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# 實作自訂 UserDetailsService

```java
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    "找不到使用者：" + username));

        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRole())
            .build();
    }
}
```

<!--
這是從資料庫載入用戶的標準做法。

實作 UserDetailsService 介面，只需要覆寫一個方法：loadUserByUsername。
Spring Security 在用戶登入的時候會自動呼叫這個方法，傳入用戶輸入的帳號。

我們用帳號去資料庫查詢，找不到就拋出 UsernameNotFoundException。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# 改用資料庫後，SecurityConfig 要跟著改

`CustomUserDetailsService` 標了 `@Service`，本身已實作 `UserDetailsService` 介面，Spring 開機會自動偵測、註冊成 Bean。

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {   // 保留，加密要用
        return new BCryptPasswordEncoder();
    }

    // Part 6 的 userDetailsService() @Bean 要整段刪掉！
    // 不刪的話，容器裡會有兩個 UserDetailsService候選：
    // InMemoryUserDetailsManager 跟 CustomUserDetailsService，
    // 造成 NoUniqueBeanDefinitionException，應用程式啟動失敗。

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {
        // ... 授權規則、httpBasic、csrf 不變
        return http.build();
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>InMemoryUserDetailsManager 跟 CustomUserDetailsService 不能並存！</b> 兩個都是 <code>UserDetailsService</code> 型別的 Bean，容器裡只能留一個。改資料庫版時，記得把 Part 6 手動宣告的 <code>userDetailsService()</code> 方法整段刪掉。
</div>

<!--
這一頁補上 Part 6 到 Part 7 之間漏掉的銜接：光是寫好 CustomUserDetailsService 類別還不夠，因為 Part 6 已經在 SecurityConfig 裡用 @Bean 宣告了另一個 UserDetailsService（InMemory 版）。

@Service 讓 Spring 自動把 CustomUserDetailsService 註冊成 Bean，這時候容器裡如果還留著 Part 6 的 InMemory Bean，就會有兩個同型別的候選者，Spring 不知道要用哪個，直接啟動失敗，丟 NoUniqueBeanDefinitionException。

解法很單純：刪掉 Part 6 那個手動宣告的 userDetailsService() @Bean method，只留 CustomUserDetailsService 這個 @Service。PasswordEncoder 因為型別不同（不是 UserDetailsService），不受影響，繼續留著給密碼加密跟比對用。

這個銜接邏輯後面練習二的解答也會再示範一次。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 8
## BCryptPasswordEncoder：密碼加密

<!--
密碼絕對不能用明文儲存。這是基本的資安常識。
Spring Security 內建了 BCryptPasswordEncoder，讓我們輕鬆處理密碼加密。
-->

---

# 設定 BCryptPasswordEncoder

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

| 特性 | 說明 |
|------|------|
| 單向加密 | 無法從密文還原明文 |
| 自動加鹽 | 每次加密結果不同，防止彩虹表攻擊 |
| 強度可調 | 預設 strength=10，越高越安全但越慢 |

```java
String encoded = passwordEncoder.encode("myPassword");
boolean matches = passwordEncoder.matches("myPassword", encoded);
```

<!--
BCrypt 是目前儲存密碼最推薦的演算法之一。

它有兩個重要特性：
第一，單向加密，所以你無法從資料庫的密碼欄位反推用戶的原始密碼。
第二，自動加鹽，就算兩個用戶密碼一樣，資料庫裡存的雜湊值也會不同，
這樣就算資料庫被拖走，攻擊者也很難用彩虹表來破解。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 9
## CSRF 保護：什麼時候開、什麼時候關？

<!--
前面 Part 3 用 Postman 撞到 403、Part 4 寫了 csrf().disable()，
但一直沒解釋 CSRF 到底是什麼。這一章補齊原理，並給開關的判斷準則。
-->

---

# CSRF 是什麼？

**CSRF＝Cross-Site Request Forgery（跨站請求偽造）**

攻擊者騙你的瀏覽器，用你**已登入的身分**，偷偷送出你沒打算送的請求。

**攻擊流程：**

1. 你登入 `bank.com`，瀏覽器存了 session cookie
2. 沒登出，又逛到惡意網站 `evil.com`
3. `evil.com` 藏一個表單自動送 `POST bank.com/transfer?to=hacker`
4. 瀏覽器送出時**自動帶上 `bank.com` 的 cookie** → 銀行以為是你本人 → 轉帳成功

> 重點：攻擊者不用偷到你的密碼，只是**借用瀏覽器自動帶 cookie 的特性**。

<!--
先講清楚 CSRF 攻擊本身，下一頁再講防禦與為什麼 API 常關掉。
關鍵：cookie 是瀏覽器「自動」帶的，只要 domain 對就帶，不管請求從哪個網站發出來。
-->

---

# CSRF 的防禦：CSRF token

**防法：CSRF token**

伺服器發一個隨機 token 給合法頁面，寫入請求（`POST`/`PUT`/`DELETE`）必須帶這個 token。

`evil.com` 拿不到你的 token → 偽造的請求被擋。

> 這也解釋了 Part 3 的現象：Postman 送 POST 沒帶 token → 被擋 → 403 Forbidden。

<!--
CSRF token 就像在表單上加蓋你的個人印章，偽造者沒有你的印章就無法過關。
Spring Security 預設開啟這個保護，所以 Postman 直接送 POST 會 403。
-->

---
style: |
  pre, code { font-size: 0.82em !important; }
---

# 什麼時候開、什麼時候關？

CSRF 攻擊的根源是「瀏覽器自動帶 cookie」。驗證方式決定要不要保留 CSRF：

| 情境 | 驗證方式 | 建議設定 | 原因 |
|------|----------|----------|------|
| 傳統 Form 表單應用 | session + cookie | **開啟** CSRF | cookie 會自動帶，可被偽造 |
| REST API（JWT / Stateless） | `Authorization: Bearer` | **關閉** CSRF | 無 session，無法被偽造 |
| 前後端分離（Angular / React） | 多為 Token 認證 | **關閉** CSRF | token 靠 JS 手動帶，不自動 |

```java
http.csrf(csrf -> csrf.disable());        // REST API：關閉
http.csrf(Customizer.withDefaults());     // Form 應用：開啟（預設即開啟）
```

<!--
REST API 用 Bearer token，token 存在 JS 裡、要手動放進 Authorization header，
瀏覽器不會自動帶，攻擊者的 evil.com 也拿不到 → 純 API 關掉 CSRF 是安全的。
反過來，如果專案還是 session + cookie 登入，就不要亂關 CSRF。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 10
## Spring Security Filter Chain 架構

<!--
我們用了這麼多功能，但 Spring Security 底層到底是怎麼運作的？
了解它的架構，遇到問題才知道從哪裡下手。
-->

---

# Filter Chain 架構概覽

Spring Security 的核心是一系列的 **Filter（過濾器）**，每個 HTTP 請求都會依序通過：

| Filter | 負責的工作 |
|--------|------------|
| `SecurityContextPersistenceFilter` | 從 Session 載入 / 儲存 SecurityContext |
| `UsernamePasswordAuthenticationFilter` | 處理 `/login` 的帳號密碼表單登入 |
| `BasicAuthenticationFilter` | 處理 HTTP Basic 認證 |
| `ExceptionTranslationFilter` | 攔截認證 / 授權例外，轉成 401 / 403 回應 |
| `AuthorizationFilter` | 最後一關：比對 authorizeHttpRequests 規則 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>原理：</b> 請求通過所有 Filter 後，才會到達你的 Controller。遇到 401/403，先看是哪個 Filter 攔截的。
</div>

<!--
Spring Security 的設計就是一條流水線。

每個 HTTP 請求進來，都要依序通過這些 Filter。
每個 Filter 負責一件事，如果其中一個 Filter 決定攔截這個請求，
後面的 Filter 就不會執行了。

了解這個架構很重要，因為當你遇到 401 或 403 錯誤，
你知道要去找哪個 Filter 出了問題。
-->

---

# SecurityContext：儲存當前登入用戶

認證成功後，用戶資訊存在 `SecurityContext` 裡，可以隨時取用：

```java
Authentication auth =
    SecurityContextHolder.getContext().getAuthentication();

String username = auth.getName();
Collection<? extends GrantedAuthority> roles = auth.getAuthorities();
```

| 類別 | 說明 |
|------|------|
| `SecurityContextHolder` | 靜態入口，持有當前執行緒的 SecurityContext |
| `SecurityContext` | 容器，持有 Authentication 物件 |
| `Authentication` | 包含 Principal（身份）、Credentials（憑證）、Authorities（權限） |

<!--
認證成功之後，Spring Security 會把用戶資訊包裝成 Authentication 物件，
存到 SecurityContextHolder 裡面。

在 Controller 或 Service 裡面，你可以隨時用 SecurityContextHolder 取得當前登入的用戶。
這很常用，比如取得當前用戶的 ID，然後查他自己的訂單。
-->

---
layout: default
---

# 練習一：保護動態問卷的 REST API

問卷系統要依「誰能做什麼」設定安全規則：

1. `/api/auth/**` — 公開（註冊、登入）
2. `GET /api/surveys/**` — 公開（前台列表、內頁、統計、讀取暫存）
3. `POST /api/surveys/*/draft`、`POST /api/surveys/*/submit` — 公開（**訪客免登入**也能作答）
4. `/api/admin/**` — 需要 `ADMIN` 角色（整個後台）
5. `/api/users/**` — 需要登入（任何角色）
6. 其他所有路徑 — 一律拒絕（`denyAll`）

**測試帳號（先用記憶體帳號）：**
- `admin@example.com` / `Passw0rd12` → `ADMIN` 角色
- `ming@example.com` / `Passw0rd12` → `USER` 角色

**要求：** 使用 `SecurityFilterChain` + Lambda DSL，開啟 HTTP Basic，關閉 CSRF。

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這個練習把動態問卷的權限需求，翻譯成 Spring Security 的規則。可以對照需求文件：前台，訪客不用登入就能瀏覽和填寫；後台只有管理員能進去；會員相關的功能，要登入。

有幾個容易搞混的地方。

第一，同一個路徑前綴 /api/surveys，GET 是公開的，POST 只有 draft 和 submit 兩個是公開的，其他的 POST，例如 POST /api/surveys 根本不存在，最後會被 denyAll 擋下。這種「預設拒絕」的設計很重要：只開放明確允許的，其他一律不行，比「只擋住明確禁止的」安全得多。

第二，路徑裡有一個變數：問卷的 id。requestMatchers 支援 * 來代表「這一段是任意值」，所以 /api/surveys/*/draft 可以比對 /api/surveys/2/draft。

第三，規則的順序：Spring Security 由上往下比對，第一個符合的就生效。所以比較具體的規則要寫在前面，anyRequest 一定放最後。

啟動之後，用 Postman 測試看看：不帶認證呼叫 GET /api/surveys 應該成功；呼叫 GET /api/admin/surveys 應該回 401；用 ming 的帳號呼叫，應該回 403；用 admin 的帳號，才會成功。
-->

---
layout: default
---

# 練習一：解題提示

1. HTTP Method 可以在 `requestMatchers` 的第一個參數指定：`requestMatchers(HttpMethod.GET, "/api/surveys/**").permitAll()`
2. 同一個 Method 的多個路徑，可以寫在同一個 `requestMatchers` 裡：`requestMatchers(HttpMethod.POST, "/api/surveys/*/draft", "/api/surveys/*/submit")`
3. 路徑中間的變數用 `*` 比對一層（`/api/surveys/2/draft`），`**` 比對任意多層
4. `PasswordEncoder` Bean 要獨立定義，再注入到 `UserDetailsService`，避免循環依賴
5. 規則順序很重要：`anyRequest().denyAll()` 一定寫在最後

**401 和 403 的差別：** 401 是「你是誰？我不認識你」（沒帶帳密或帳密錯誤）；403 是「我知道你是誰，但你沒有權限」（登入了但角色不夠）。

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
最容易卡住的是路徑的比對規則。* 只比對一層，不含斜線；** 比對任意多層。所以 /api/surveys/* 不會符合 /api/surveys/2/draft，因為多了一層。

401 和 403 的差別，在 API 的設計上很重要，前端會依據這兩個狀態碼做不同的事：收到 401，會導向登入頁；收到 403，會顯示「沒有權限」的訊息。

另外密碼編碼器的循環依賴問題，也是很多人會踩到的坑。PasswordEncoder 要定義成獨立的 Bean，用參數注入，不要用欄位注入。
-->

---
layout: default
---

# 練習一：解答（SecurityConfig 1/2）

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails admin = User.builder()
                .username("admin@example.com")
                .password(encoder.encode("Passw0rd12"))
                .roles("ADMIN")
                .build();
        UserDetails ming = User.builder()
                .username("ming@example.com")
                .password(encoder.encode("Passw0rd12"))
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(admin, ming);
    }

    // SecurityFilterChain 見下一頁
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
先看 PasswordEncoder 和 UserDetailsService 這兩個 Bean。

PasswordEncoder 獨立定義，用 BCrypt 演算法：它每次加密，都會加入不同的隨機鹽，所以同樣的密碼，產生的密文每次都不一樣，這也是為什麼我們不能用 equals 比對密文，一定要用 encoder 的 matches。

userDetailsService 用參數注入 encoder，建立兩個帳號：admin 有 ADMIN 角色，ming 只有 USER 角色。roles 方法會自動幫角色名稱加上 ROLE_ 的前綴，所以寫 roles("ADMIN")，Spring Security 內部是 ROLE_ADMIN；之後 hasRole("ADMIN") 也是一樣的規則。

InMemoryUserDetailsManager 把帳號存在記憶體，適合測試跟練習。下一個練習，我們就會換成資料庫。
-->

---
layout: default
---

# 練習一：解答（SecurityConfig 2/2）

```java
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/surveys/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/surveys/*/draft", "/api/surveys/*/submit").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/**").authenticated()
                        .anyRequest().denyAll()
                )
                .httpBasic(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable());
        return http.build();
    }
}
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證：</b> 不帶認證 <code>GET /api/surveys</code> → 200；<code>GET /api/admin/surveys</code> → <b>401</b>；用 ming（USER）→ <b>403</b>；用 admin → <b>200</b>；<code>DELETE /api/surveys/1</code> → 被 <code>denyAll</code> 擋下（401 / 403）。
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
GET /api/surveys/** 公開；POST 的 draft 和 submit 公開，讓訪客可以填寫問卷；/api/admin/** 限 ADMIN；/api/users/** 要登入；其他所有路徑全部拒絕。每一條規則都由具體到一般，符合順序規則。

httpBasic 開啟才能用 Postman 的 Basic Auth 測試。csrf 關閉，因為我們是 REST API，不是用瀏覽器表單的網站，用不到 CSRF token，這個在 Part 9 已經討論過。

測試的重點，是「四個帳號狀態」× 「前台後台兩種 API」的組合。特別建議大家測一個「不存在的路徑」，例如 GET /api/abc：因為最後有 denyAll，會得到 401 或 403，而不是 404，這也證明了「預設拒絕」有生效。
-->

---
layout: default
---

# 練習二：整合資料庫的會員認證

把練習一的記憶體帳號換成 MySQL 的 `users` 表（**以 Email 當登入帳號**），並完成會員功能：

1. `User` Entity（對應 `users` 表）、`UserRepository`（`findByEmail`）、`CustomUserDetailsService`（沿用 Part 7 的做法，把 `loadUserByUsername(email)` 換成 email 查詢）
2. `SecurityConfig`：**移除**記憶體帳號的 `userDetailsService` Bean，只留 `PasswordEncoder` 與規則
3. `POST /api/auth/register`：註冊會員（姓名必填；Email 格式；**密碼 8～12 字元**；手機 `09` 開頭共 10 碼）
   - 密碼用 `passwordEncoder.encode()` 加密後才存；角色固定為 `USER`
   - Email 已註冊 → **409** `EMAIL_EXISTS`
4. `GET /api/users/me`、`PUT /api/users/me`：查詢、修改自己的姓名與手機
5. **登入者作答自動關聯**：登入的會員送出作答時，`survey_responses.user_id` 要填入；訪客則維持 `NULL`。並新增 `GET /api/users/me/responses`（我的填寫紀錄，最新的在前）
6. Postman（Basic Auth）驗證整個流程

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
練習二要把練習一的記憶體帳號，換成真正的資料庫會員。資料庫的 users 表，在 MySQL 課已經設計好了：name、email、password、phone、role。這裡有一個小小的調整：Spring Security 的「username」這個概念，我們用 Email 來當帳號，所以 loadUserByUsername 的參數，其實就是 Email。

注意 seed.sql 裡的三個帳號，密碼欄位已經是 BCrypt 雜湊，密碼是 Passw0rd12，所以你可以直接用它們登入，不需要再手動 encode。

第 5 點是需求文件裡的「會員功能」：登入的會員，可以看到自己過去填寫過的問卷。關鍵是，前台作答本身不強制登入，訪客也能填，所以 user 這個欄位是可選的：有登入，就關聯；沒登入，就是 null。實作上，Controller 用 @AuthenticationPrincipal 注入目前登入者，訪客的時候，這個值是 null。

大家先想想看：註冊時，為什麼角色要固定是 USER，而不是讓前端傳進來？
-->

---
layout: default
---

# 練習二：解題提示

1. 三件套（Entity / Repository / UserDetailsService）套路跟 Part 7 一樣，差別只在：帳號欄位是 `email`；`role` 存 `"USER"` / `"ADMIN"`，不帶 `ROLE_` 前綴
2. `RegisterRequest` 可以用 Java `record`，驗證註解直接標在 record 的參數上
3. 註冊前先 `existsByEmail` 檢查；Email 統一轉小寫存入
4. 取得目前登入者：`@AuthenticationPrincipal UserDetails user`，`user.getUsername()` 就是 Email；**匿名訪客時 `user` 是 `null`**
5. `ResponseService.submit` 多接一個 `String userEmail`，不是 `null` 才查 `User` 並 `setUser(...)`
6. 「我的紀錄」：`SurveyResponseRepository` 加 `findByUserIdOrderByIdDesc(Integer userId)`

<div class="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>小提醒：</b>你自己的 Entity 叫 <code>User</code>，跟 <code>org.springframework.security.core.userdetails.User</code> 同名，import 不要選錯；<code>CustomUserDetailsService</code> 裡建構 Spring 的 <code>User</code> 時，請直接寫完整套件名稱。
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
第 1 點：整個套路跟第 7 個 Part 完全一樣。

第 2 點：Java record 是 Java 16 之後的功能，適合用來寫單純的資料載體，後面第 45 章會詳細介紹。驗證註解可以直接標在 record 的參數上。

第 3 點：Email 統一轉小寫，避免 A@x.com 和 a@x.com 被當成兩個不同的使用者。

第 4 點，很重要：@AuthenticationPrincipal 注入的型別，要跟 Authentication 裡面存放的 principal 型別一致。現在我們用 Spring 的 UserDetails，所以參數型別寫 UserDetails。如果訪客沒有登入，Spring Security 的 principal 是字串 anonymousUser，型別對不上，注入的結果就是 null，這正是我們想要的行為。
-->

---
layout: default
---

# 練習二：解答（User、UserRepository、CustomUserDetailsService）

```java
@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String password;
    private String phone;
    private String role; // USER / ADMIN
}
```

```java
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
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
User Entity 對應 users 表：name、email、password、phone、role。一樣用 @Getter、@Setter，不用 @Data。

UserRepository 有兩個方法：findByEmail，給 UserDetailsService 和個人資料使用；existsByEmail 給註冊時檢查使用。都是 Spring Data 的方法名稱查詢，不用寫 SQL。
-->

---
layout: default
---

# 練習二：解答（User、UserRepository、CustomUserDetailsService）（續）

```java
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /** 本系統用 Email 當登入帳號（Spring Security 稱為 username） */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("找不到使用者：" + email));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())      // "USER" / "ADMIN"，Spring 會自動加上 ROLE_ 前綴
                .build();
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
CustomUserDetailsService 是 Spring Security 登入時會自動呼叫的類別：使用者送來 Email，它從資料庫查出使用者，轉成 Spring Security 認得的 UserDetails，內容是帳號、BCrypt 密文、還有角色。密碼比對是 Spring Security 自己做的，我們只負責提供資料。

注意 Spring 的 User 用的是完整套件名稱寫法，避免跟我們自己的 User Entity 混淆。roles(user.getRole()) 的角色不用自己加 ROLE_，Spring 會處理。
-->

---
layout: default
---

# 練習二：解答（SecurityConfig — 資料庫版）

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 密碼加密器獨立定義；CustomUserDetailsService 是 @Service，Spring Security 會自動使用它
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
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
跟練習一比，SecurityConfig 少了 userDetailsService 那個 Bean。因為 CustomUserDetailsService 已經用 @Service 註冊成 Bean，Spring Security 啟動時會自動找到它，用它來認證。這就是為什麼刪掉記憶體帳號的 Bean，其他規則完全不用改。

如果同時有兩個 UserDetailsService Bean，Spring Security 就搞不清楚要用哪個了，所以一定要刪掉。
-->

---
layout: default
---

# 練習二：解答（SecurityConfig — 資料庫版）（續）

```java
// ... 接上一頁

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/surveys/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/surveys/*/draft", "/api/surveys/*/submit").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/**").authenticated()
                        .anyRequest().denyAll()
                )
                .httpBasic(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable());

        return http.build();
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
⚠️ 測試時如果登入失敗，先檢查三件事：資料庫的 password 欄位是不是 BCrypt 密文（開頭是 $2a$ 或 $2b$）；密文有沒有被截斷（欄位長度要 100 以上，MySQL 課我們設計好了）；還有 Postman 的 Basic Auth 帳號欄位是不是填 Email。
-->

---
layout: default
---

# 練習二：解答（註冊、個人資料）

```java
public class AuthDTO {

    public record RegisterRequest(
            @NotBlank(message = "請輸入姓名") String name,
            @NotBlank(message = "請輸入 Email") @Email(message = "Email 格式錯誤") String email,
            @NotBlank(message = "請輸入密碼") @Size(min = 8, max = 12, message = "密碼需 8 到 12 個字元") String password,
            @Pattern(regexp = "^09\\d{8}$", message = "手機格式錯誤（09 開頭，共 10 碼）") String phone) {
    }
    // ... UserInfo、UpdateProfileRequest 等
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
RegisterRequest 用 record 寫，驗證註解直接標在參數上：密碼規定 8 到 12 個字元。

register 有幾個重點：先查 Email 有沒有註冊過，有就丟 EMAIL_EXISTS，轉成 409。密碼一定要先過 passwordEncoder.encode()，不能把明文密碼存進資料庫。角色固定給 USER：如果讓前端傳角色，有人就可以送 ADMIN，把自己註冊成管理員，這是很典型的權限提升漏洞。管理員帳號只能由資料庫直接建立。
-->

---
layout: default
---

# 練習二：解答（註冊、個人資料）（續）

```java
    public UserInfo register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BizException(RspCode.EMAIL_EXISTS);
        }
        User u = new User();
        u.setName(req.name().trim());
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(req.password())); // 只存 BCrypt 雜湊
        u.setPhone(req.phone());
        u.setRole("USER");                                      // 註冊一律是一般會員，不開放自己指定角色
        return toInfo(userRepository.save(u));
    }
```

```java
    @PostMapping("/register")
    public AppResponse<UserInfo> register(@Valid @RequestBody RegisterRequest req) {
        return AppResponse.success(userService.register(req));
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
回傳的 UserInfo 完全不含 password，即使是加密過的，也不該給前端看。這跟第 37 章的 PO 和 DTO 的觀念一樣。
-->

---
layout: default
---

# 練習二：解答（我的資料、登入者作答）

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ResponseService responseService;

    @GetMapping("/me")
    public AppResponse<UserInfo> me(@AuthenticationPrincipal UserDetails user) {
        return AppResponse.success(userService.me(user.getUsername()));
    }

    @PutMapping("/me")
    public AppResponse<UserInfo> update(@AuthenticationPrincipal UserDetails user,
                                        @Valid @RequestBody UpdateProfileRequest req) {
        return AppResponse.success(userService.updateProfile(user.getUsername(), req));
    }

    @GetMapping("/me/responses")
    public AppResponse<List<ResponseDTO>> myResponses(@AuthenticationPrincipal UserDetails user) {
        return AppResponse.success(responseService.mine(user.getUsername()));
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
UserController 的三個方法都不用檢查有沒有登入：因為 SecurityConfig 已經規定 /api/users/** 要登入，沒登入根本進不到這裡。

@AuthenticationPrincipal UserDetails user：取得目前登入者。user.getUsername() 就是登入時用的 Email。
-->

---
layout: default
---

# 練習二：解答（我的資料、登入者作答）（續）

```java
// SurveyController：submit 多接一個登入者（訪客為 null）
@PostMapping("/api/surveys/{id}/submit")
public AppResponse<Map<String, Integer>> submit(@PathVariable("id") Integer id, HttpSession session,
                                                @AuthenticationPrincipal UserDetails user) {
    String email = user == null ? null : user.getUsername();
    return AppResponse.success(Map.of("responseId", responseService.submit(id, session, email)));
}

// ResponseService.submit：登入會員才關聯 user
public Integer submit(Integer surveyId, HttpSession session, String userEmail) {
    // ...（其餘同 ch40）
    if (userEmail != null) {
        r.setUser(userRepository.findByEmail(userEmail).orElse(null));
    }
    // ...
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
前台作答的 submit，我們新增了 @AuthenticationPrincipal 參數。訪客沒有登入，值是 null，登入會員才有值。ResponseService 根據這個 Email 查出 User Entity，設定到作答紀錄上。

還記得資料表設計嗎？survey_responses.user_id 是可為 NULL 的，而且刪除會員時 ON DELETE SET NULL：會員帳號刪除，填寫的資料還在，只是變成匿名。

最後不要忘記 SurveyResponseRepository 要加上 findByUserIdOrderByIdDesc，這樣「我的紀錄」才能最新的排在最前面。
-->

---
layout: default
---

# 練習二：Postman 測試

| 步驟 | 動作 | 預期結果 |
| --- | --- | --- |
| 1 | `POST /api/auth/register`：`{"name":"新會員","email":"new@example.com","password":"Abcd1234","phone":"0966000111"}` | 200，回傳的 `data` **沒有 password** |
| 2 | 再送一次同樣的 Email | **409** `EMAIL_EXISTS` |
| 3 | 密碼傳 `"short"` | **400**，「密碼需 8 到 12 個字元」 |
| 4 | Basic Auth（`new@example.com` / `Abcd1234`）`GET /api/users/me` | 200，`role` 是 `USER` |
| 5 | Basic Auth 密碼故意打錯 | **401** |
| 6 | 用 `ming@example.com` / `Passw0rd12` 呼叫 `GET /api/admin/surveys` | **403** |
| 7 | 用 `new@example.com` 暫存並 `POST /api/surveys/6/submit` | 200；MySQL：`survey_responses.user_id` 有值 |
| 8 | 不帶帳密，暫存並送出另一份作答 | 200；`user_id` 是 `NULL`（訪客） |

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這張表把整個練習串起來。特別是步驟 7 和 8，證明同一個 API，登入的會員和訪客，資料庫裡的紀錄是不同的：一個有 user_id，另一個是 NULL。

步驟 1 之後，打開 MySQL 看 users 表，會看到剛註冊的會員，密碼欄位是一長串 $2a$10$ 開頭的字串，這就是 BCrypt 的密文，任何人（包含資料庫管理員）都看不出原本的密碼。
-->

---
layout: default
---

# 練習二：Postman 測試（續）

| 步驟 | 動作 | 預期結果 |
| --- | --- | --- |
| 9 | `GET /api/users/me/responses`（`new@example.com`） | 只有自己的紀錄，最新的在前 |

<div class="mt-2 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>驗證重點：</b> 用 <code>SELECT id, user_id, email FROM survey_responses</code> 確認步驟 7、8 的差別；步驟 1 之後看 <code>users.password</code>，應該是 <code>$2a$</code> 開頭的密文。
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
下一章，我們要把 HTTP Basic 換成 JWT：每次請求不再帶帳號密碼，而是帶一個有時效的 Token。
-->

---

# 本章重點總結

| 主題 | 關鍵觀念 |
|------|----------|
| 認證 vs 授權 | 先確認「你是誰」，再決定「你能做什麼」 |
| 預設行為 | 加入依賴後，所有路徑自動需要登入 |
| SecurityFilterChain | Spring Boot 3.x / 4.x 的標準設定方式，Lambda DSL |
| 路徑授權 | permitAll / authenticated / hasRole / hasAuthority |
| InMemoryUserDetailsManager | 開發測試用，帳號存在記憶體 |
| UserDetailsService | 從資料庫載入用戶的標準介面 |
| BCryptPasswordEncoder | 密碼一定要加密儲存，絕不明文 |
| CSRF | Form 應用開啟，REST API 關閉 |
| Filter Chain | 所有請求依序通過一系列 Filter |
| SecurityContextHolder | 隨時取得當前登入用戶的靜態入口 |

<!--
今天的三個最重要的事：
第一，Spring Boot 3.x / 4.x 要用 SecurityFilterChain，不要用舊的 WebSecurityConfigurerAdapter。
第二，密碼一定要用 BCrypt 加密，這是不可妥協的基本要求。
第三，CSRF 的開關要根據應用類型來決定。
-->

---
layout: end
---

# Q & A

有任何問題歡迎提問！

<!--
Spring Security 是個功能非常豐富的框架，今天我們學了最核心的基礎。
掌握這些，就能保護你的 Spring Boot 應用程式！
-->
