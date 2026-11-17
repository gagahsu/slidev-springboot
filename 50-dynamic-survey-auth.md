---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "實戰專題（二）：統一回應與登入"
routeAlias: ch50
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
    Spring Boot Project Practice
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    實戰專題（二）<br>統一回應與登入
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「回覆單、例外處理、警衛，一次架好」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第五十章，實戰專題的第二章。

上一章把資料表設計好了。今天要做三件「每一支 API 都會用到」的基礎建設：統一的回覆單、出錯的時候怎麼回應，以及註冊、登入和警衛。

今天做完之後，就可以用 Postman 註冊帳號、登入、拿到通行證了。
-->

---

# 今天要完成的三件事

<v-clicks>

- **統一的回覆單**：每一支 API 都用同一種格式回覆
- **出錯的時候**：在任何地方丟出例外，都變成格式一樣的錯誤回覆
- **註冊、登入和警衛**：發通行證、設定誰能用哪些 API，以及讓前端連得進來

</v-clicks>

<!--
今天要完成三件事。

（下一步）第一，統一的回覆單。每一支 API 都用同一種格式回覆。

（下一步）第二，出錯的時候。不管在哪裡發現錯誤，都變成格式一樣的錯誤回覆。

（下一步）第三，註冊、登入和警衛。發通行證、設定誰能用哪些 API，還有一個新的設定，讓前端連得進來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 統一的回覆單

<!--
先做回覆單。
-->

---

# 每個櫃台的回覆都長得不一樣

<v-clicks>

- 查詢成功，有的回一個物件，有的回一份清單，有的回一句話
- 出錯的時候，有的回 `null`，有的回錯誤訊息，有的回一個 Map
- 前端每接一支 API，都要重新研究「成功長怎樣、失敗長怎樣」

</v-clicks>

<v-click>

教務處的做法：所有回覆都用同一種**回覆單**。

```json
{ "code": 200, "message": "操作成功", "data": { …附件… } }
```

</v-click>

<!--
到目前為止，我們每一支 API 回傳的東西都不太一樣。

（下一步）查詢成功的時候，有的回一個物件，有的回一份清單，有的回一句話。

（下一步）出錯的時候，有的回 null，有的回錯誤訊息，有的回一個 Map。

（下一步）前端每接一支 API，都要重新研究成功長怎樣、失敗長怎樣。很麻煩，也容易出錯。

（下一步）教務處的做法是：所有回覆都用同一種回覆單。三格：code 是代碼，message 是說明，data 是附件。附件每次不同，前兩格的格式永遠一樣。這就是第三十八章做過的 Reply。
-->

---

# 代碼表：RspCode

在 `vo` 資料夾新增 `RspCode`：

<CodeSteps>

```java {2-3|4-10|12-18}
@Getter
public enum RspCode {
    SUCCESS(200, "操作成功"),
    PARAM_ERROR(400, "參數錯誤"),
    UNAUTHORIZED(401, "尚未登入或憑證無效"),
    FORBIDDEN(403, "權限不足"),
    NOT_FOUND(404, "資源不存在"),
    DUPLICATE_ERROR(409, "資料重複"),
    INTERNAL_SERVER_ERROR(500, "系統內部錯誤");

    private final int code;
    private final String message;

    RspCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
```

- 第三十八章的 `enum`，每個選項帶著代碼和說明；`@Getter` 讓 Lombok 產生 `getCode()`、`getMessage()`
- 代碼直接用 HTTP 的狀態碼。**409** 是新的：資料和現有的重複了
- 欄位、建構子：和第三十八章的 `Grade` 一模一樣

</CodeSteps>

<!--
先做一張代碼表。在 vo 資料夾新增 RspCode，Rsp 是 Response 的縮寫。

（下一步）它是第三十八章學的 enum。每個選項都帶著兩樣資料：代碼和說明。上面的 @Getter 讓 Lombok 幫我們產生 getCode 和 getMessage，enum 也可以用。

（下一步）七個選項。代碼直接用 HTTP 的狀態碼，第十三章學過。其中 409 是新的，意思是：你送來的資料和現有的重複了，例如同一個 Email 註冊兩次。

（下一步）下面的欄位和建構子，和第三十八章的 Grade 一模一樣。

把所有的代碼集中在這裡，程式裡就不會到處出現 404、409 這種數字。看到 RspCode.NOT_FOUND，一眼就知道意思。
-->

---

# 回覆單：AppResponse

```java {1|2-4|5-7|8-10}
public record AppResponse<T>(int code, String message, T data) {
    public static <T> AppResponse<T> success(T data) {
        return new AppResponse<>(RspCode.SUCCESS.getCode(), RspCode.SUCCESS.getMessage(), data);
    }
    public static <T> AppResponse<T> error(RspCode rspCode) {
        return new AppResponse<>(rspCode.getCode(), rspCode.getMessage(), null);
    }
    public static <T> AppResponse<T> error(RspCode rspCode, String customMessage) {
        return new AppResponse<>(rspCode.getCode(), customMessage, null);
    }
}
```

<v-clicks>

- 第三十八章的 `Reply<T>`：record 加泛型，附件的型別用 `T` 留著
- `success(附件)`：成功的回覆單
- `error(代碼)`：錯誤的回覆單，用代碼表裡的說明
- `error(代碼, 自己的說明)`：同樣是錯誤，換成更清楚的說明

</v-clicks>

<!--
回覆單本身叫 AppResponse，也放在 vo 資料夾。

（下一步）這就是第三十八章的 Reply：record 加泛型。三個欄位，附件的型別用 T 留著。

下面多了三個方法，是建立回覆單的捷徑。方法前面有 static，意思是不用先有一張回覆單，直接用類別名稱就能呼叫，例如 AppResponse.success()。static 後面的角括號 T，意思是這個方法有自己的一張標籤，附件是什麼型別，呼叫的時候才決定。這一段請照抄。

（下一步）success，給它附件，就做出一張成功的回覆單。代碼是 200，說明是「操作成功」。

（下一步）error，給它一個代碼，做出錯誤的回覆單。說明用代碼表裡寫好的，附件是 null。

（下一步）第二個 error，多一個參數，可以換成更清楚的說明。例如不只說「資料重複」，而是說「此電子郵件已被使用」。
-->

---

# 在櫃台怎麼用

```java
@PostMapping("/login")
public AppResponse<?> login(@Valid @RequestBody LoginRequest request) {
    return authService.login(request);
}
```

<v-clicks>

- 回傳型別寫 `AppResponse<?>`：問號代表「附件是什麼都可以」（第四十一章的 `ConstraintViolation<?>` 也是這個意思）
- 成功時，Service 回傳 `AppResponse.success(…)`，Spring 會把它變成 JSON
- 那出錯的時候呢？

</v-clicks>

<!--
櫃台怎麼用？看一個登入的例子。

（下一步）回傳型別寫 AppResponse 角括號問號。問號代表附件是什麼都可以。第四十一章的 ConstraintViolation 角括號問號，也是這個意思。

（下一步）成功的時候，Service 回傳 AppResponse.success，Spring 會把它變成 JSON。

（下一步）那出錯的時候呢？下一個部分來看。
-->

---

# 想一想

<Poll question="AppResponse.success(students) 做出來的回覆單，code 和 message 是什麼？" options="0 和空白|200 和「操作成功」|404 和「資源不存在」|看 students 是什麼而定" answer="2" />

<!--
來想一題。

AppResponse.success(students) 做出來的回覆單，code 和 message 是什麼？

（等大家作答）

（下一步）答案是 200 和「操作成功」。

success 方法裡，代碼和說明都是從 RspCode.SUCCESS 拿的。students 只放進 data 這一格，不影響前兩格。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 出錯的時候

<!--
接下來處理錯誤。
-->

---

# 直接回傳錯誤的回覆單，有什麼問題？

```java
// 在 Service 裡發現 Email 重複了
return AppResponse.error(RspCode.DUPLICATE_ERROR, "此電子郵件已被使用");
```

<v-clicks>

- 前端收到的 JSON 是 `{"code":409, …}`，但是 HTTP 狀態碼還是 **200**
- 狀態碼和 code 對不起來，前端和 Postman 都會以為「成功了」
- 而且如果錯誤發生在很深的地方，要一層一層 `return` 回來才能結束

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 更好的做法：發現錯誤就<b>丟出例外</b>，馬上停下來；再由一個地方統一把例外變成「狀態碼和 code 一致」的錯誤回覆單。這就是第四十一章學的 <code>@RestControllerAdvice</code>。
</div>

</v-click>

<!--
最直覺的做法，是在 Service 裡發現錯誤的時候，直接回傳一張錯誤的回覆單。

（下一步）問題是：前端收到的 JSON 裡 code 是 409，但是 HTTP 的狀態碼還是 200。因為對 Spring 來說，方法正常回傳了東西，就是成功。

（下一步）狀態碼和 code 對不起來。前端和 Postman 都會以為成功了。

（下一步）而且如果錯誤發生在很深的地方，例如 Service 呼叫的另一個方法裡，要一層一層 return 回來才能結束。

（下一步）更好的做法是：發現錯誤就丟出例外，馬上停下來。再由一個地方，統一把例外變成狀態碼和 code 一致的錯誤回覆單。這就是第四十一章學的 @RestControllerAdvice。
-->

---

# 自己的例外：BizException

在 `exception` 資料夾新增：

```java {2|3|4-7|8-11}
@Getter
public class BizException extends RuntimeException {
    private final RspCode rspCode;
    public BizException(RspCode rspCode) {
        super(rspCode.getMessage());
        this.rspCode = rspCode;
    }
    public BizException(RspCode rspCode, String customMessage) {
        super(customMessage);
        this.rspCode = rspCode;
    }
}
```

<v-click>

```java
throw new BizException(RspCode.DUPLICATE_ERROR, "此電子郵件已被使用");
```

</v-click>

<!--
在 exception 資料夾新增 BizException。Biz 是 Business 的縮寫，業務，意思是「業務上的錯誤」，例如資料重複、找不到資料。

（下一步）第三十八章學的自訂例外：extends RuntimeException。

（下一步）多一個欄位，記著這個錯誤對應代碼表的哪一個代碼。

（下一步）第一個建構子，只給代碼。說明用代碼表裡的，透過 super 交給上一層保管。

（下一步）第二個建構子，給代碼和自己的說明。

（下一步）用的時候像這樣：throw new BizException，給代碼和說明。這一行執行之後，方法就停下來了，後面的程式都不會跑。
-->

---

# 統一處理：GlobalExceptionHandler

在 `config` 資料夾新增：

<CodeSteps>

```java {1-2|3-7|8-12|13-16}
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AppResponse<?>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return ResponseEntity.status(400).body(AppResponse.error(RspCode.PARAM_ERROR, message));
    }
    @ExceptionHandler(BizException.class)
    public ResponseEntity<AppResponse<?>> handleBizException(BizException ex) {
        RspCode rspCode = ex.getRspCode();
        return ResponseEntity.status(rspCode.getCode()).body(AppResponse.error(rspCode, ex.getMessage()));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse<?>> handleOthers(Exception ex) {
        return ResponseEntity.status(500).body(AppResponse.error(RspCode.INTERNAL_SERVER_ERROR, ex.getMessage()));
    }
}
```

- 第四十一章的寫法：這個類別專門接住所有 Controller 丟出來的例外
- `@Valid` 沒過：拿出**第一條**沒過的規則的說明，回 400
- `BizException`：狀態碼**直接用例外裡記的代碼**，所以兩邊一定一致
- 其他沒想到的例外：一律回 500

</CodeSteps>

<!--
在 config 資料夾新增 GlobalExceptionHandler，全域的例外處理。

（下一步）@RestControllerAdvice，第四十一章學過。這個類別專門接住所有 Controller 丟出來的例外。

（下一步）第一種，@Valid 檢查沒過。第四十一章是把每一條錯誤都列出來。這裡簡化成只拿第一條：get(0) 是清單裡的第一個，getDefaultMessage 是我們在 DTO 上寫的 message。用 ResponseEntity 回覆狀態碼 400，內容是一張錯誤的回覆單。ResponseEntity 是第三十九章學過的，可以自己決定狀態碼。

（下一步）第二種，我們自己的 BizException。從例外裡拿出代碼，狀態碼直接用這個代碼。所以 HTTP 狀態碼和回覆單上的 code 一定一致。說明用例外裡記的說明。

（下一步）第三種，其他我們沒想到的例外，一律回 500。有了這一個，程式出錯的時候，前端收到的也還是一張格式一樣的回覆單。
-->

---

# 錯誤是怎麼一路傳回去的

<Flow nodes="Postman|Controller:櫃台|Service:組長|Handler:GlobalExceptionHandler" steps="1>2:POST /api/auth/register|2>3:register(request)|3>4:throw BizException(409)|4>1:HTTP 409 + { code: 409, message: 此電子郵件已被使用 }" />

<!--
看一次錯誤是怎麼一路傳回去的。

（下一步）Postman 送出註冊的請求。

（下一步）櫃台交給組長。

（下一步）組長發現 Email 重複了，丟出 BizException，代碼是 409。組長和櫃台後面的程式都不會再執行。例外被 GlobalExceptionHandler 接住。

（下一步）Handler 回覆狀態碼 409，內容是一張回覆單，code 也是 409，說明是「此電子郵件已被使用」。

從此以後，Service 裡發現任何錯誤，只要一行 throw new BizException 就好。
-->

---

# 想一想

<Poll question="Service 裡寫了 throw new BizException(RspCode.NOT_FOUND)，Postman 收到的 HTTP 狀態碼是多少？" options="200|404|500|沒有回應" answer="2" />

<!--
來想一題。

Service 裡寫了 throw new BizException(RspCode.NOT_FOUND)，Postman 收到的 HTTP 狀態碼是多少？

（等大家作答）

（下一步）答案是 404。

BizException 會被第二個方法接住。狀態碼直接用例外裡記的代碼，NOT_FOUND 是 404。回覆單的說明是代碼表裡的「資源不存在」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 註冊和登入

<!--
有了回覆單和例外處理，來寫註冊和登入。
-->

---

# 兩個 DTO

```java
@Data
public class LoginRequest {
    @NotBlank(message = "電子郵件不可為空")
    @Email(message = "電子郵件格式不正確")
    private String email;
    @NotBlank(message = "密碼不可為空")
    @Size(min = 6, message = "密碼長度需至少 6 位")
    private String password;
}
```

```java
public record RegisterRequest(
        @NotBlank(message = "姓名不可為空") String name,
        @NotBlank(message = "電子郵件不可為空")
        @Email(message = "電子郵件格式不正確") String email,
        @NotBlank(message = "密碼不可為空")
        @Size(min = 6, message = "密碼長度需至少 6 位") String password,
        String phone) {
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 record 的欄位前面也可以加檢查規則，寫法一樣。拿資料記得是 <code>request.email()</code>，不是 <code>getEmail()</code>。
</div>

</v-click>

<!--
在 dto 資料夾新增兩個類別。檢查規則都是第四十一章學過的。

LoginRequest 用 @Data 的類別。Email 不能空白、格式要對。密碼不能空白、至少六位。

RegisterRequest 用 record。多了姓名和電話，電話是選填。

（下一步）record 的欄位前面也可以加檢查規則，寫法一樣。拿資料的時候記得：是 request.email()，不是 getEmail()。這兩種寫法在專題裡都會出現，看到的時候分辨一下就好。
-->

---

# JwtUtil：和第四十七章一樣

在 `security` 資料夾新增 `JwtUtil`：

```java {3-4|8-13|15-18}
@Component
public class JwtUtil {
    @Value("${jwt.secret}") private String secret;
    @Value("${jwt.expire-minutes:60}") private long expireMinutes;

    private SecretKey getKey() { return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8)); }

    public String generateToken(String email) {
        Date now = new Date();
        Date expireAt = new Date(now.getTime() + expireMinutes * 60 * 1000);
        return Jwts.builder().subject(email).issuedAt(now).expiration(expireAt)
                .signWith(getKey()).compact();
    }

    public String getEmail(String token) {
        return Jwts.parser().verifyWith(getKey()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }
}
```

<!--
在 security 資料夾新增 JwtUtil。它和第四十七章幾乎一樣，這裡快速看過。

（下一步）從設定檔讀出密鑰和有效時間。有效時間是第四十七章練習一的寫法，冒號後面是預設值。

（下一步）發證。這個專題用 Email 當帳號，所以證上的 subject 放 Email。

（下一步）驗證。檢查鋼印和期限，通過的話回傳證上的 Email。方法名稱叫 getEmail。
-->

---

# AuthService（上）：警衛的名冊

在 `service` 資料夾新增 `AuthService`：

<CodeSteps>

```java {1-2|3-8|10-12|13-17}
@Service
public class AuthService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("找不到帳號：" + email));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }
}
```

- 和第四十六章的 `AccountService` 一樣：它同時是警衛的名冊
- 三個幫手：會員的助理、攪碎機、發證的工具
- 用 Email 找會員；找不到就用第三十八章的 `orElseThrow` 丟出例外
- 名字撞到了：我們的 Entity 叫 `User`，Spring Security 也有一個 `User`，所以這裡要寫**完整的名字**

</CodeSteps>

<!--
在 service 資料夾新增 AuthService，負責會員的所有事情。

（下一步）它和第四十六章的 AccountService 一樣，implements UserDetailsService，同時也是警衛的名冊。

（下一步）用 @Autowired 拿到三個幫手：會員的助理、攪碎機，以及發證的工具。

（下一步）名冊的方法 loadUserByUsername。參數雖然叫 username，在這個專題裡放的是 Email。用 findByEmail 找會員，拿到的是信封。找不到的話，用第三十八章的 orElseThrow 丟出例外。

（下一步）找到了，就抄成警衛看得懂的格式。這裡遇到一個問題：我們的 Entity 叫 User，Spring Security 也有一個類別叫 User，名字撞到了。上面 import 的是我們自己的 User，所以 Spring Security 的那一個，要寫完整的名字，從 org 開始一路寫到 User。這就是第四十六章取名 Account 想避開的麻煩。
-->

---

# AuthService（中）：註冊

```java {2-4|5-9|10|11-12}
public AppResponse<?> register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.email())) {
        throw new BizException(RspCode.DUPLICATE_ERROR, "此電子郵件已被使用");
    }
    User user = new User();
    user.setEmail(request.email());
    user.setName(request.name());
    user.setPhone(request.phone());
    user.setPassword(encoder.encode(request.password()));
    user.setRole(userRepository.count() == 0 ? "ADMIN" : "USER");
    userRepository.save(user);
    return AppResponse.success(tokenOf(user));
}
```

<v-clicks>

- Email 已經有人用了：丟出 409
- 把資料抄進 Entity，密碼**一定要先攪碎**
- **第一位**註冊的人是管理員，之後都是一般會員（三元運算子，第三十八章）
- 存檔，然後直接發一張通行證：註冊完就等於登入了

</v-clicks>

<!--
在 AuthService 加上註冊。

（下一步）先檢查 Email 有沒有人用過。有的話，丟出 BizException，代碼 409。

（下一步）把資料從 RegisterRequest 抄進 User。注意 record 拿資料是 email() 這樣的寫法。密碼一定要先用攪碎機 encode。

（下一步）身分怎麼給？count() 是助理本來就會的方法，算出目前有幾位會員。如果是 0，代表這是第一位，給他 ADMIN，管理員。其他人都是 USER。這是第三十八章的三元運算子。這樣一來，系統架好之後第一個註冊的人就是管理員。

（下一步）存檔之後，直接發一張通行證回去。註冊完就等於登入了，使用者不用再登入一次。tokenOf 是下一頁的小方法。
-->

---

# AuthService（下）：登入

```java {2|3-5|6}
public AppResponse<?> login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail()).orElse(null);
    if (user == null || !encoder.matches(request.getPassword(), user.getPassword())) {
        throw new BizException(RspCode.UNAUTHORIZED, "帳號或密碼錯誤");
    }
    return AppResponse.success(tokenOf(user));
}

private Map<String, String> tokenOf(User user) {
    Map<String, String> data = new HashMap<>();
    data.put("token", jwtUtil.generateToken(user.getEmail()));
    return data;
}
```

<v-click>

回覆的 JSON：

```json
{ "code": 200, "message": "操作成功", "data": { "token": "eyJhbGciOiJIUzM4NCJ9…" } }
```

</v-click>

<!--
登入。寫法和第四十七章的 login 一樣。

（下一步）用 Email 找會員。這裡用 orElse(null)，因為下一行要一起判斷。

（下一步）沒有這個帳號，或是密碼核對不過，都丟出 401，說明一樣是「帳號或密碼錯誤」。第四十七章說過，故意不分開說，讓亂試的人分不出是哪一個錯。

（下一步）都通過，發一張通行證。

下面的 tokenOf 是註冊和登入共用的小方法。做一個 Map，key 是 token，值是通行證。

（下一步）回覆的 JSON 長這樣。通行證放在 data 裡面。前端會從 data.token 拿出來保存。
-->

---

# AuthController

```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AppResponse<?> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AppResponse<?> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這個專題的網址都以 <code>/api</code> 開頭，類別上用 <code>@RequestMapping</code> 寫共同的開頭（第十四章）。前端已經照這些網址寫好了，請<b>不要更改</b>。
</div>

</v-click>

<!--
櫃台 AuthController 很單純。兩支 API：POST /api/auth/register 和 POST /api/auth/login。都加上 @Valid 檢查。

（下一步）這個專題的網址都以 /api 開頭。類別上用 @RequestMapping 寫共同的開頭，第十四章學過。後面第三十九章之後我們沒有這樣寫，這個專題照原本的寫法。另外，前端已經照這些網址寫好了，請不要更改，不然第五十三章接不起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 警衛的守則

<!--
接下來設定警衛。
-->

---

# JwtAuthFilter：和第四十七章一樣

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthService authService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String email = jwtUtil.getEmail(token);
                UserDetails user = authService.loadUserByUsername(email);
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (Exception e) {
                // 通行證有問題（過期、被改過、帳號不存在）：當作沒有帶
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

<!--
在 security 資料夾新增 JwtAuthFilter。它和第四十七章一模一樣，只是名冊換成 AuthService，帳號換成 Email。

複習一下它做的事：從 Authorization 的 Header 拿出 Bearer 後面的通行證。檢查通過的話，用名冊查出這個人的身分，告訴警衛「這個人已經通過認證」。通行證有問題就當作沒帶。最後不管怎樣，都交給下一關。
-->

---

# SecurityConfig：誰能用哪些 API

<CodeSteps>

```java {4|5|6|7|8|10-12}
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
    http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**", "/error").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/surveys/history").authenticated()
            .requestMatchers("/api/surveys/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable());
    return http.build();
}
```

- 註冊、登入公開。`/error` 也要公開，否則 403 會被換成 401（下一頁說明）
- 後台的 API：只有管理員
- 「我填過哪些問卷」：要登入。**它要寫在下一條的前面**
- 其他前台的 API：公開，訪客也能填問卷
- 其餘的（個人資料）：要登入
- 和第四十七章相同的三行；多了一行 `cors`，等一下說明

</CodeSteps>

<!--
在 security 資料夾新增 SecurityConfig。攪碎機的 @Bean 和第四十六章一樣，這裡只看 securityFilterChain。

（下一步）第一條：註冊和登入公開。/error 也要公開，原因下一頁說明。

（下一步）第二條：/api/admin 開頭的，後台的 API，只有管理員。

（下一步）第三條：/api/surveys/history，「我填過哪些問卷」，要登入。它一定要寫在下一條的前面。第四十六章說過，規則從上往下對，範圍小的寫前面。

（下一步）第四條：其他 /api/surveys 開頭的，前台的 API，公開。訪客不用登入也能看問卷、填問卷。

（下一步）最後一條：其餘的，例如個人資料，要登入。

（下一步）下面這幾行。STATELESS、把關卡排進隊伍、沒通過認證回 401，都是第四十七章的寫法。多了一行 cors，等一下說明。
-->

---

# 為什麼 /error 要公開

<v-clicks>

- 警衛擋下一個請求、要回 403 的時候，Spring 會把請求**轉到 `/error`** 去產生錯誤畫面
- 轉過去的這一趟，我們的 `JwtAuthFilter` **不會再跑一次**，警衛就不認得這個人了
- `/error` 本身如果要登入，就會變成 401：本來該說「權限不夠」，結果變成「你是誰」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
🔍 實際試過：沒有公開 <code>/error</code> 的時候，一般會員呼叫後台 API 得到的是 401；公開之後才是正確的 403。
</div>

</v-click>

<!--
為什麼 /error 要公開？這是我實際測試的時候遇到的狀況。

（下一步）警衛擋下一個請求、要回 403 的時候，Spring 會把這個請求轉到 /error 這個網址，去產生錯誤的內容。

（下一步）轉過去的這一趟，我們的 JwtAuthFilter 不會再跑一次。它的名字叫 OncePerRequest，每個請求只跑一次。所以轉到 /error 的時候，警衛已經不認得這個人了。

（下一步）如果 /error 本身也要登入，就會變成 401。本來該說「你的權限不夠」，結果變成「你是誰」，前端會以為通行證有問題。

（下一步）實際試過：沒有公開 /error 的時候，一般會員呼叫後台 API 得到的是 401。公開之後，才是正確的 403。所以這個專題把 /error 一起放進公開的那一條。
-->

---

# 新的問題：前端和後端不同門牌

<v-clicks>

- 前端的畫面在 `localhost:4200`，後端的 API 在 `localhost:8080`：**Port 不同，就算不同的網站**
- 瀏覽器的規定：一個網站的程式，不能隨便去讀**另一個網站**的回應（防止壞網站偷資料）
- 所以瀏覽器會先問後端：「4200 的網頁想找你，可以嗎？」後端沒有說可以，請求就被擋下

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這個規定的例外叫做 <b>CORS</b>（跨來源資源共用）：後端自己列出「我信任哪些網站」。只有瀏覽器會檢查，所以 Postman 測試時遇不到，接上前端才會出現。
</div>

</v-click>

<!--
接下來是 cors 那一行。它要解決一個新的問題。

（下一步）前端的畫面在 localhost 4200，後端的 API 在 localhost 8080。對瀏覽器來說，Port 不同，就算是不同的網站。

（下一步）瀏覽器有一條規定：一個網站的程式，不能隨便去讀另一個網站的回應。這是為了防止壞網站偷偷用你的身分，去讀別的網站的資料。

（下一步）所以前端要呼叫後端的時候，瀏覽器會先問後端：4200 的網頁想找你，可以嗎？後端沒有說可以，請求就被擋下來了。

（下一步）這條規定的例外叫做 CORS，中文是跨來源資源共用。做法是後端自己列出：我信任哪些網站。要注意的是，只有瀏覽器會做這個檢查。Postman 測試的時候完全遇不到，接上前端的時候才會出現。所以現在先設定好。
-->

---

# CORS 的設定

在 `SecurityConfig` 再加一個 `@Bean`：

<CodeSteps>

```java {3|4-5|6|7-9}
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

- 準備一份設定
- 信任的網站：只有前端的 `localhost:4200`
- 允許的方法和 Header。`OPTIONS` 就是瀏覽器「先問一聲」用的方法
- 允許瀏覽器帶上 **Cookie**（下一頁說明為什麼需要）；套用到所有網址

</CodeSteps>

<!--
在 SecurityConfig 再加一個 @Bean。

（下一步）準備一份 CORS 的設定。

（下一步）信任的網站，只有前端的 localhost 4200。List.of 是第三十八章練習用過的寫法。

（下一步）允許的方法和 Header。前端會帶 Authorization 放通行證，Content-Type 說明內容是 JSON。方法裡的 OPTIONS，就是瀏覽器「先問一聲」的時候用的方法。

（下一步）setAllowCredentials 等於 true，允許瀏覽器帶上 Cookie。為什麼需要 Cookie？下一頁說明。最後把這份設定套用到所有的網址。

SecurityConfig 裡的 .cors 那一行，就是在用這個 @Bean。
-->

---

# 通行證和置物櫃，同時使用？

<v-clicks>

- **警衛認人**：看通行證（JWT）。`STATELESS` 的意思是「**警衛**不用置物櫃」
- **暫存還沒送出的東西**：第五十一、五十二章的「填好 → 確認頁 → 送出」，填好的內容要先放在置物櫃（Session）
- 置物櫃靠號碼牌（Cookie）找到，所以 CORS 要允許帶 Cookie，前端也要設定每次都帶

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 兩種工具各管一件事：<b>通行證決定你是誰、能做什麼</b>；<b>置物櫃只是暫放草稿</b>。訪客沒有通行證，也一樣有自己的置物櫃。
</div>

</v-click>

<!--
這裡可能會有一個疑問。第四十七章說，用了通行證，伺服器就不用替任何人保管東西。那為什麼還需要 Cookie？

（下一步）警衛認人，看的是通行證。STATELESS 的意思是：警衛不用置物櫃。

（下一步）但是這個專題有一個功能：填好問卷之後，先到確認頁看一次，再按送出。填好的內容在送出之前，要先放在某個地方。這就是第四十二章的置物櫃，Session。

（下一步）置物櫃要靠號碼牌找到，號碼牌是 Cookie。所以 CORS 要允許帶 Cookie，前端也要設定每次都帶。

（下一步）所以兩種工具各管一件事。通行證決定你是誰、能做什麼。置物櫃只是暫放草稿。訪客沒有通行證，也一樣有自己的置物櫃。
-->

---

# 想一想

<Poll question="用 Postman 呼叫後端都正常，但是前端（localhost:4200）一呼叫就被瀏覽器擋下來。最可能是哪裡沒設定好？" options="資料庫的帳號密碼|CORS 沒有允許 localhost:4200|JWT 的密鑰太短|@Valid 的檢查規則" answer="2" />

<!--
來想一題。

用 Postman 呼叫後端都正常，但是前端一呼叫就被瀏覽器擋下來。最可能是哪裡沒設定好？

（等大家作答）

（下一步）答案是 CORS 沒有允許 localhost 4200。

關鍵是「Postman 正常」。CORS 只有瀏覽器會檢查，Postman 不會。所以 Postman 正常、瀏覽器不行，第一個要懷疑的就是 CORS。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 個人資料

<!--
最後兩支 API：查看和修改個人資料。
-->

---

# 查看和修改自己的資料

```java {1-5|7-15|17-25}
public AppResponse<?> getProfile(String email) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
    return AppResponse.success(userToMap(user));
}

public AppResponse<?> updateProfile(String email, Map<String, String> updates) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
    if (updates.containsKey("name")) user.setName(updates.get("name"));
    if (updates.containsKey("phone")) user.setPhone(updates.get("phone"));
    String password = updates.get("password");
    if (password != null && !password.isEmpty()) user.setPassword(encoder.encode(password));
    userRepository.save(user);
    return AppResponse.success(userToMap(user));
}

private Map<String, Object> userToMap(User user) {
    Map<String, Object> info = new HashMap<>();
    info.put("id", user.getId());
    info.put("email", user.getEmail());
    info.put("name", user.getName());
    info.put("phone", user.getPhone());
    info.put("role", user.getRole());
    return info;                         // 沒有放密碼
}
```

<!--
在 AuthService 加三個方法。

（下一步）getProfile，查看自己的資料。用 Email 找會員，找不到就丟 404。找到的話，轉成一個 Map 回傳。

（下一步）updateProfile，修改自己的資料。前端送來的是一個 Map，有送哪一項就改哪一項。containsKey 是問 Map 裡有沒有這個 key。如果有送新密碼，一樣要先攪碎。if 後面只有一行的時候，可以不寫大括號，寫在同一行。

（下一步）userToMap，把會員轉成 Map。請注意：沒有放密碼。就算是攪碎過的亂碼，也不應該回給前端。這就是第三十七章說的：PO 不要直接回傳，挑需要的欄位就好。這裡用 Map 代替 DTO，是原本專題的寫法。
-->

---

# UserController

```java {7-10|12-16}
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    public AppResponse<?> getProfile(Authentication authentication) {
        return authService.getProfile(authentication.getName());
    }

    @PutMapping("/profile")
    public AppResponse<?> updateProfile(@RequestBody Map<String, String> updates,
                                        Authentication authentication) {
        return authService.updateProfile(authentication.getName(), updates);
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 和第四十六章練習 2 一樣：「是誰」從 <code>Authentication</code> 拿，不是從 Body 拿。<code>getName()</code> 就是通行證上的 Email。
</div>

</v-click>

<!--
櫃台 UserController。網址開頭是 /api/users。

（下一步）GET /profile。參數寫 Authentication，Spring 會把通過認證的這個人交給我們。getName() 拿到的是名冊裡的帳號，在這個專題就是 Email。

（下一步）PUT /profile。Body 用 Map 接收。一樣從 Authentication 知道是誰。

（下一步）這和第四十六章練習二是同一個道理：是誰，從 Authentication 拿，不是從 Body 拿。這樣每個人只能看、只能改自己的資料。

這兩支 API 不在任何公開的規則裡，會走到最後的 anyRequest，要登入才能用。所以這裡的 authentication 一定不是 null。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 用 Postman 試試看

<!--
重新啟動，用 Postman 把今天的功能試一遍。
-->

---

# 註冊、登入、拿到通行證

<v-clicks>

1. `POST /api/auth/register`，Body：`{"name":"管理員","email":"admin@example.com","password":"Password123"}` → 200，`data.token`
2. 再註冊一位 `tom@example.com`（第二位，身分是 USER）
3. 同一個 Email 再註冊一次 → **409**「此電子郵件已被使用」
4. 密碼只打 `123` → **400**「密碼長度需至少 6 位」
5. `POST /api/auth/login`，密碼打錯 → **401**「帳號或密碼錯誤」

</v-clicks>

<!--
重新啟動之後，照順序試。

（下一步）第一，註冊管理員。Body 是一個 JSON，姓名、Email、密碼。得到 200，data 裡有 token。

（下一步）第二，再註冊一位 tom。他是第二位，所以身分是 USER。

（下一步）第三，同一個 Email 再註冊一次，得到 409，說明是「此電子郵件已被使用」。這是 BizException 一路傳回來的。

（下一步）第四，密碼只打 123，得到 400，說明是「密碼長度需至少 6 位」。這是 @Valid 沒過，被第一個 Handler 接住。

（下一步）第五，登入，故意把密碼打錯，得到 401。
-->

---

# 帶著通行證

Postman 的 Authorization 頁籤選 **Bearer Token**，貼上 `token`：

<v-clicks>

1. `GET /api/users/profile` → 200，`role` 是 `ADMIN`（換成 tom 的通行證就是 `USER`）
2. 不帶通行證 `GET /api/users/profile` → **401**
3. 用 tom 的通行證 `GET /api/admin/surveys` → **403**（他不是管理員）
4. 用管理員的通行證 `GET /api/admin/surveys` → 先得到錯誤：後台的 API **下一章**才寫

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 每一個回覆，不論成功或失敗，都是同一種格式：<code>{ "code", "message", "data" }</code>。只有被警衛直接擋下的 401、403，內容是 Spring Security 自己產生的。
</div>

</v-click>

<!--
接下來帶著通行證試。在 Authorization 頁籤選 Bearer Token，貼上剛才拿到的 token。

（下一步）GET /api/users/profile，得到 200，role 是 ADMIN。換成 tom 的通行證，就是 USER。

（下一步）不帶通行證，得到 401。

（下一步）用 tom 的通行證呼叫後台的 GET /api/admin/surveys，得到 403。他不是管理員。

（下一步）用管理員的通行證呼叫同一個網址，警衛會放行，但是會得到一個錯誤，因為後台的 API 下一章才寫。

（下一步）注意看每一個回覆，不論成功或失敗，都是同一種格式：code、message、data。只有被警衛直接擋下的 401 和 403，內容是 Spring Security 自己產生的，不是我們的回覆單。前端看狀態碼就能判斷。
-->

---

# 複習：今天做的基礎建設

<Pairs left="教務處" right="程式" rows="form,統一的回覆單=code,AppResponse&lt;T&gt;（code、message、data）|book,代碼表=code,enum RspCode|no,發現錯誤就喊停=code,throw new BizException(代碼, 說明)|clerk,統一把錯誤變成回覆單=code,GlobalExceptionHandler|guard,警衛的守則=code,SecurityConfig：admin 只給 ADMIN|shop,信任哪些網站=code,CORS：localhost:4200" />

<!--
複習今天做的基礎建設。

（下一步）統一的回覆單，是 AppResponse，三格：code、message、data。

（下一步）代碼表，是 enum RspCode。

（下一步）發現錯誤就喊停，是 throw new BizException。

（下一步）統一把錯誤變成回覆單，是 GlobalExceptionHandler。

（下一步）警衛的守則，是 SecurityConfig，後台只給 ADMIN。

（下一步）信任哪些網站，是 CORS，信任前端的 localhost 4200。
-->

---

# 章節總結

<v-clicks>

- **AppResponse**：所有 API 用同一種回覆單；`success()`、`error()` 兩種捷徑
- **錯誤**：丟出 `BizException`，由 `GlobalExceptionHandler` 統一處理，狀態碼和 `code` 一致
- **註冊和登入**：第一位是管理員；註冊完直接發通行證；Email 重複 409、帳密錯 401
- **警衛**：後台只有 `ADMIN`；前台公開；個人資料和紀錄要登入；`/error` 要公開
- **CORS**：讓 `localhost:4200` 的前端連得進來，並且允許帶 Cookie 給暫存功能用

</v-clicks>

<v-click>

下一章：管理員的後台，新增問卷、修改、刪除、看統計。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）AppResponse 讓所有 API 用同一種回覆單，有 success 和 error 兩種捷徑。錯誤的時候丟出 BizException，由 GlobalExceptionHandler 統一處理，狀態碼和 code 一致。註冊的時候第一位是管理員，註冊完直接發通行證；Email 重複是 409，帳密錯是 401。警衛的守則：後台只有 ADMIN，前台公開，個人資料和紀錄要登入，/error 要公開。CORS 讓 4200 的前端連得進來，並且允許帶 Cookie 給暫存功能用。

（最後一步）下一章，我們做管理員的後台：新增問卷、修改、刪除、看統計。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

有任何問題歡迎提出來。
-->
