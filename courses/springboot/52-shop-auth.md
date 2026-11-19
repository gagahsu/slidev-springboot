---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題（二）：會員、權限與統一回應
routeAlias: ch52
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
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 2.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    專題（二）<br>會員、權限與統一回應
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「每一個回應長得一樣，每一扇門都有人顧」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
歡迎來到第五十二章。這一章做兩件所有功能都會用到的事：統一的回應格式，和會員的登入權限。

先把這兩件事做好，後面五章寫功能的時候，就只要專心寫商業邏輯。
-->

---

# 今天要完成的事

<v-clicks>

- **統一回應**：所有 API 都回 `{ code, message, data }`
- **統一錯誤**：Service 只要丟出 `BizException`，自動變成錯誤回應
- **會員**：註冊、登入，拿到 JWT
- **權限**：誰能進哪一扇門（公開、會員、管理員、綠界）

</v-clicks>

<!--
今天要完成四件事。

（下一步）統一回應：所有 API 都回同一個形狀，有 code、message、data。

（下一步）統一錯誤：Service 遇到不合規則的情況，只要丟出 BizException，就會自動變成錯誤回應。

（下一步）會員：註冊、登入，登入成功拿到 JWT。

（下一步）權限：哪些 API 誰都能呼叫，哪些要登入，哪些只有管理員可以。
-->

---

# 故事：咖啡店的會員卡與員工證

<v-clicks>

- 店裡所有的單子都用**同一種格式**：上面一格寫結果，下面寫內容
- 出問題時，店員**填一張退件單**交給櫃台，櫃台照格式回給客人
- 辦了會員，拿到一張**蓋了店章的會員卡**，之後出示卡片就好
- 店門口誰都能進；**會員區**要出示會員卡；**倉庫**只有掛員工證的人能進

</v-clicks>

<!--
用咖啡店來想。

（下一步）店裡所有的單子都用同一種格式：最上面一格寫結果，成功還是失敗，下面寫內容。客人看久了，一眼就知道去哪裡找。

（下一步）出問題的時候，店員不用自己想怎麼跟客人說，填一張退件單交給櫃台，櫃台照格式回給客人。

（下一步）辦了會員，拿到一張蓋了店章的會員卡。之後來店裡出示卡片就好，不用每次報身分證字號。

（下一步）店門口誰都能進來逛；會員區要出示會員卡；倉庫只有掛員工證的人能進去。
-->

---

# 對應到程式

<Pairs left="咖啡店" right="程式" rows="form,同一種格式的單子=code,AppResponse&lt;T&gt;：code、message、data|no,退件單=code,throw new BizException(RspCode, 訊息)|clerk,櫃台照格式回覆=code,@RestControllerAdvice 的 GlobalExceptionHandler|card,蓋店章的會員卡=key,JWT（第 47 章）|guard,門口的規矩=code,SecurityFilterChain：permitAll / authenticated / hasRole" />

<!--
對應到程式。

（下一步）同一種格式的單子，是 AppResponse，一個泛型的 record。

（下一步）退件單，是 BizException，帶著一個狀態碼和訊息。

（下一步）櫃台照格式回覆，是 GlobalExceptionHandler。

（下一步）蓋店章的會員卡，是第四十七章的 JWT。

（下一步）門口的規矩，是 SecurityFilterChain，用 permitAll、authenticated、hasRole 規定每一扇門。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 統一回應與錯誤

<!--
先做統一的回應格式。
-->

---

# RspCode 與 AppResponse

```java {all|1-12|14-22}
@Getter
public enum RspCode {
    SUCCESS(200, "操作成功"),
    PARAM_ERROR(400, "參數錯誤"),
    UNAUTHORIZED(401, "尚未登入或憑證無效"),
    FORBIDDEN(403, "權限不足"),
    NOT_FOUND(404, "資源不存在"),
    DUPLICATE_ERROR(409, "資料重複"),
    STOCK_NOT_ENOUGH(409, "庫存不足"),
    ORDER_STATUS_ERROR(409, "訂單狀態不允許這個操作"),
    INTERNAL_SERVER_ERROR(500, "系統內部錯誤");
    // code、message 欄位與建構子
}

public record AppResponse<T>(int code, String message, T data) {
    public static <T> AppResponse<T> success(T data) {
        return new AppResponse<>(200, "操作成功", data);
    }
    public static <T> AppResponse<T> error(RspCode rspCode, String message) {
        return new AppResponse<>(rspCode.getCode(), message, null);
    }
}
```

<!--
先看兩個基本元件。

（下一步）RspCode 是一個 enum，列出整個系統會用到的狀態。code 同時也是 HTTP 狀態碼，例如庫存不足和訂單狀態錯誤都是 409，代表跟目前的資料狀態衝突。

（下一步）AppResponse 是泛型的 record，T 是 data 的型別。success 包成功的資料，error 包錯誤訊息。第三十八章學過的泛型，在這裡派上用場：同一個類別，可以包商品、訂單，或任何東西。
-->

---

# BizException + GlobalExceptionHandler

```java {all|1-6|10-14|15-19}
@Getter
public class BizException extends RuntimeException {
    private final RspCode rspCode;
    public BizException(RspCode rspCode, String message) { super(message); this.rspCode = rspCode; }
}
// Service 裡：throw new BizException(RspCode.STOCK_NOT_ENOUGH, "庫存不足，剩 1 件");

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BizException.class)
    public ResponseEntity<AppResponse<Void>> handleBiz(BizException ex) {
        RspCode code = ex.getRspCode();
        return ResponseEntity.status(code.getCode()).body(AppResponse.error(code, ex.getMessage()));
    }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AppResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.status(400).body(AppResponse.error(RspCode.PARAM_ERROR, message));
    }
}
```

<!--
接著是退件單和櫃台。

（下一步）BizException 繼承 RuntimeException，多帶一個 RspCode。Service 遇到不合規則的情況，像是庫存不夠，一行 throw 就好。

（下一步）GlobalExceptionHandler 接住 BizException，用它的 code 當 HTTP 狀態碼，包成 AppResponse 回傳。

（下一步）欄位檢查沒過，一樣包成 AppResponse，訊息取第一個錯誤。

參考解答裡還多處理了幾種：資料重複的 DataIntegrityViolationException 回 409，圖片太大回 400，其他沒料到的錯誤回 500，並且寫進 Log。
-->

---

# Controller 變得很乾淨

```java
@GetMapping("/products/{id}")
public AppResponse<ProductDetailVO> product(@PathVariable("id") Integer id) {
    return AppResponse.success(productService.detail(id));
}
```

<v-clicks>

- 成功：Controller 只負責包 `AppResponse.success(...)`
- 失敗：Service 丟出 `BizException`，Controller **完全不用寫 if**
- 前端只要看 `code`，錯誤時把 `message` 顯示出來

</v-clicks>

<!--
有了這兩個元件，Controller 變得很乾淨。

（下一步）成功的時候，Controller 只要把 Service 的結果包進 success。

（下一步）失敗的時候，Service 丟出 BizException，Controller 完全不用寫 if 判斷。

（下一步）前端也輕鬆，只要看 code，錯誤的時候把 message 顯示出來就好。
-->

---

# 想一想

<Poll question="Service 裡寫了 throw new BizException(RspCode.NOT_FOUND, &quot;找不到這個商品&quot;)，前端會收到什麼？" options="HTTP 200，data 是 null|HTTP 404，{ code: 404, message: &quot;找不到這個商品&quot;, data: null }|HTTP 500，一大串錯誤堆疊|什麼都收不到" answer="2" />

<!--
想一想。Service 丟出 NOT_FOUND 的 BizException，前端會收到什麼？

HTTP 狀態碼 404，內容是 code 404、message 找不到這個商品、data 是 null。GlobalExceptionHandler 把例外轉成了統一的格式，前端不會看到 Java 的錯誤堆疊。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 註冊與登入

<!--
接下來做會員的註冊和登入。
-->

---

# 註冊：一律是 USER

```java {all|2-4|8|9}
public LoginVO register(RegisterRequest req) {
    if (userRepository.existsByEmail(req.email())) {
        throw new BizException(RspCode.DUPLICATE_ERROR, "這個 Email 已經註冊過了");
    }
    User user = new User();
    user.setName(req.name().trim());
    user.setEmail(req.email().trim().toLowerCase());
    user.setPassword(encoder.encode(req.password()));   // BCrypt
    user.setRole("USER");                                // 管理員由 Flyway 預先建立
    userRepository.save(user);
    return toLoginVO(user);                              // 註冊完直接登入
}
```

<!--
註冊的 Service。

（下一步）Email 已經存在，就丟出資料重複的例外。

（下一步）密碼用第四十六章的 BCrypt 加密，資料庫裡只有雜湊值。

（下一步）角色固定是 USER。管理員帳號由 Flyway 預先建好，前台沒有任何方法變成管理員。

最後直接回傳登入的結果，客人註冊完就是登入狀態，不用再登入一次。
-->

---

# 登入：回傳 JWT

```java {all|2-5|9-10}
public LoginVO login(LoginRequest req) {
    User user = userRepository.findByEmail(req.email().trim().toLowerCase()).orElse(null);
    if (user == null || !encoder.matches(req.password(), user.getPassword())) {
        throw new BizException(RspCode.UNAUTHORIZED, "帳號或密碼錯誤");
    }
    return toLoginVO(user);
}

private LoginVO toLoginVO(User user) {
    return new LoginVO(jwtUtil.generateToken(user.getEmail()), user.getName(), user.getRole());
}
```

<v-click>

```json
{ "code": 200, "message": "操作成功",
  "data": { "token": "eyJhbGciOiJIUzM4NCJ9...", "name": "王小明", "role": "USER" } }
```

</v-click>

<!--
登入的 Service。

（下一步）帳號不存在，或密碼不對，都回同一句「帳號或密碼錯誤」。不要分開說「沒有這個帳號」，否則壞人可以用來試出哪些 Email 註冊過。

（下一步）登入成功，回傳 JWT，加上姓名和角色。JwtUtil 跟第四十七章一樣。前端用 role 決定要不要顯示「管理後台」的連結。

（下一步）實際的回應長這樣，token 就是那張蓋了店章的會員卡。
-->

---

# 從 JWT 找到目前的會員

```java
// Controller：Spring Security 把登入的人放進 Authentication
@GetMapping("/me")
public AppResponse<UserVO> me(Authentication auth) {
    return AppResponse.success(userService.me(auth.getName()));   // getName() 是 email
}

// Service：之後購物車、訂單都靠它
public User current(String email) {
    return userRepository.findByEmail(email)
            .orElseThrow(() -> new BizException(RspCode.UNAUTHORIZED));
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 會員是誰，<b>只看 JWT</b>，不看前端傳來的 userId。否則改一個數字就能看別人的購物車。
</div>

</v-click>

<!--
登入之後，怎麼知道現在是誰？

Controller 的方法參數加一個 Authentication，JwtAuthFilter 驗證通過後，Spring Security 會把登入的人放進來，getName 就是 JWT 裡的 email。

Service 寫一個 current 方法，用 email 找到會員。之後購物車、訂單，全部都靠它。

（下一步）一定要記住：會員是誰只看 JWT，不看前端傳來的 userId。如果相信前端傳的 userId，壞人改一個數字，就能看到別人的購物車和訂單。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 每一扇門的規矩

<!--
最後設定每一扇門的規矩。
-->

---

# SecurityFilterChain

```java {all|2|3|4|5|6|7-9}
http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**", "/error", "/uploads/**").permitAll()
        .requestMatchers("/api/payments/ecpay/**").permitAll()      // 綠界呼叫
        .requestMatchers(HttpMethod.GET, "/api/categories", "/api/products/**").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated())
    .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
    .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
```

<!--
SecurityFilterChain，規則由上往下比對，第一個符合的就決定了。

（下一步）註冊登入、錯誤頁、商品圖片，誰都可以。

（下一步）綠界的兩個網址也要開放。綠界的伺服器呼叫我們的時候，不會帶 JWT，第六章會用檢查碼確認是不是真的綠界。

（下一步）用 GET 看分類和商品，誰都可以。注意只開放 GET，後台改商品的 API 在另一條路徑。

（下一步）/api/admin 開頭的，只有 ADMIN 可以。

（下一步）其他全部都要登入，例如購物車和訂單。

（下一步）下面三行跟第四十七章一樣：不用 Session、加上 JWT 的過濾器、沒登入回 401。另外還要設定 CORS，允許 localhost 4200。
-->

---

# 用 Postman 驗證

| 請求 | 帶的 JWT | 結果 |
| --- | --- | --- |
| `GET /api/products` | 不帶 | 200 |
| `GET /api/cart` | 不帶 | **401** |
| `GET /api/cart` | user1 | 200 |
| `GET /api/admin/dashboard` | user1 | **403** |
| `GET /api/admin/dashboard` | admin | 200 |

<!--
寫完用 Postman 驗證這五個情況。

不帶 JWT 看商品，200。不帶 JWT 看購物車，401，代表沒登入。用一般會員的 JWT 看購物車，200。一般會員打後台，403，代表登入了但權限不足。管理員打後台，200。

401 和 403 的差別一定要分清楚：401 是「你是誰？」，403 是「我知道你是誰，但你不能進來」。
-->

---

# 想一想

<Poll question="使用者用 Postman 送出註冊請求，Body 裡多加了 &quot;role&quot;: &quot;ADMIN&quot;。會發生什麼事？" options="註冊成管理員|RegisterRequest 沒有 role 欄位，多的欄位被忽略，仍然是 USER|回 400|回 500" answer="2" />

<!--
想一想。有人在註冊的 Body 裡多加了 role ADMIN，會怎樣？

RegisterRequest 這個 record 根本沒有 role 欄位，多出來的欄位會被忽略，Service 也固定設成 USER，所以一樣是一般會員。這就是用 DTO 的好處：前端能送什麼，由我們決定。
-->

---

# 重點回顧

<Pairs left="咖啡店" right="程式" rows="form,同一種格式的單子=code,AppResponse&lt;T&gt; + RspCode|no,退件單=code,BizException|clerk,櫃台照格式回覆=code,GlobalExceptionHandler|card,會員卡=key,JWT，會員是誰只看它|guard,門口的規矩=code,公開 / 會員 / ADMIN / 綠界" />

<!--
回顧一下。

（下一步）同一種格式的單子，是 AppResponse 和 RspCode。

（下一步）退件單，是 BizException。

（下一步）櫃台照格式回覆，是 GlobalExceptionHandler。

（下一步）會員卡是 JWT，會員是誰只看它。

（下一步）門口的規矩，分成公開、會員、管理員，還有綠界專用的網址。
-->

---

# 小結

<v-clicks>

- 所有 API 回 `{ code, message, data }`；錯誤由 `BizException` 統一處理
- 註冊一律是 USER；登入回傳 `token`、`name`、`role`
- 會員是誰只看 JWT；`/api/admin/**` 限 ADMIN
- **練習**：完成 `PUT /api/users/me`，可以改姓名、手機；密碼欄位留空表示不改

</v-clicks>

<!--
小結。

（下一步）所有 API 都回同一個格式，錯誤由 BizException 統一處理。

（下一步）註冊一律是一般會員，登入回傳 token、姓名、角色。

（下一步）會員是誰只看 JWT，後台限管理員。

（下一步）練習：完成修改會員資料的 API，可以改姓名和手機，密碼欄位留空表示不改。下一章，我們做商品。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
