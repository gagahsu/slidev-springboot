---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Boot Validation
routeAlias: ch40
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
    Spring Boot Validation
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓 API 自動把關輸入資料，不再手動寫 if 判斷」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，今天我們要學的是 Spring Boot Validation——也就是「資料驗證」。

想像你的 API 有個「新增會員」功能，使用者傳來的資料沒有任何限制。結果有人把 Email 欄位填成 "abc"，有人把年齡填成 -5，這些資料全部存進資料庫——之後寄信失敗、業務邏輯出錯，一堆麻煩接踵而來。

以前的做法是在 Controller 裡手動寫 if 判斷，這樣的程式碼又醜又累，還很容易漏掉欄位。

Bean Validation 就是讓我們用 Annotation 直接把規則寫在資料類別上，Spring 自動幫我們驗證。學完今天，大家就能說：「我知道怎麼讓 API 自動把關輸入資料了！」
-->

---
layout: default
---

# Outline

- **為什麼需要 Validation？** — 沒有驗證的 API 會遇到什麼問題
- **什麼是 Bean Validation？** — Jakarta Bean Validation 規範介紹
- **加入 Gradle 依賴** — `spring-boot-starter-validation`
- **常用驗證 Annotation** — @NotBlank、@Min、@Email 等八個核心 Annotation
- **驗證 Request Body** — `@Valid` 的用法與驗證失敗行為
- **驗證路徑與查詢參數** — `@Validated` 的用法
- **統一錯誤回應** — `@ControllerAdvice` + `@ExceptionHandler`
- **補充：自訂驗證 Annotation**（進階選讀）

<!--
今天的內容分成八個段落，前面打概念，中間學用法，後面整合成完整的錯誤處理機制。

最重要的三個段落是：常用 Annotation、驗證 Request Body、統一錯誤回應——這三個搞定了，日常開發就夠用了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 為什麼需要 Validation？

<!--
先從問題出發，看看沒有驗證的 API 會遇到什麼狀況。
-->

---

# 沒有驗證的 API 會發生什麼事？

以「新增學生」API（`POST /students`）為例，沒有驗證時，前端可以傳入任何資料：

| 欄位 | 期望格式 | 沒驗證時可能傳入 | 造成的問題 |
| --- | --- | --- | --- |
| `name` | 非空字串 | `""` 空字串 | 資料庫存入沒有名字的學生 |
| `password` | 非空字串 | `""` 空字串 | 密碼為空，帳號完全無保護 |
| `score` | 0–100 的整數 | `-999` 或 `200` | 分數邏輯完全錯誤，ScoreVO 拋出例外 |

<!--
三個欄位，在沒有驗證的情況下：

name 可能是空白字串——你的資料庫裡存了一堆沒有名字的學生。
password 可能是空字串——帳號完全沒有密碼保護。
score 可能是 -999 或 200——ScoreVO 在計算字母等第時直接拋出例外，整個 API 就 crash 了。

以前的做法是在 Controller 或 Service 裡手動寫 if 判斷，程式碼又醜又累，而且很容易漏掉某個欄位。Bean Validation 就是解決這個問題的標準方案。
-->

---

# 什麼是 Bean Validation？

「Bean Validation 的概念，就是把資料格式的規則直接標注在欄位上，讓框架自動幫我們執行驗證」

| 面向 | 說明 |
| --- | --- |
| 規範名稱 | Jakarta Bean Validation 3.0（Spring Boot 3.x） |
| 核心概念 | 用 Annotation 標注欄位限制，框架自動觸發驗證 |
| 觸發時機 | Controller 收到請求時，Spring 自動執行驗證 |
| 驗證失敗 | 自動回傳 HTTP 400 Bad Request |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 3.x 版本注意：</b> import 必須用 <code>jakarta.validation.*</code>，不再是舊版的 <code>javax.validation.*</code>
</div>

<!--
Bean Validation 就是一套「把規則寫在資料類別上」的規範。

類比：就像在表單的每個欄位旁邊貼一張便條紙，寫著「這裡必填」、「這裡要填 Email 格式」——但這張便條紙是寫給 Spring 看的，Spring 會自動照著規則驗。

特別提醒：Spring Boot 3.x 之後，所有 Validation 的 import 都改成了 jakarta.validation，不再是 javax.validation。這是版本升級的重要改變，大家要特別注意。
-->

---

# 加入 Gradle 依賴

Spring Boot 預設不包含 Validation，需要手動在 `build.gradle` 加入：

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-validation'
}
```

加入後，在 Eclipse 專案上按右鍵 → **Gradle** → **Refresh Gradle Project**，IDE 會自動下載依賴，`jakarta.validation.constraints.*` 的 Annotation 就可以使用了。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> 這個 Starter 背後引入的是 <b>Hibernate Validator</b>——Jakarta Bean Validation 規範的參考實作，也是業界最廣泛使用的驗證函式庫。
</div>

<!--
使用 Validation 前，一定要先加依賴，這是很多人第一次使用時忘記的步驟。

spring-boot-starter-web 並不包含 Validation，需要獨立加入 spring-boot-starter-validation。

加入後，在 Eclipse 專案右鍵 → Gradle → Refresh Gradle Project，等 IDE 下載完成，看到 @NotBlank、@Email 可以 import，就代表依賴加對了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 常用驗證 Annotation

<!--
依賴加好了，來看看有哪些 Annotation 可以用。
-->

---

# 常用驗證 Annotation（一）非空類

| Annotation | 適用型別 | 說明 |
| --- | --- | --- |
| `@NotNull` | 任何型別 | 不可為 `null`（空字串仍然通過） |
| `@NotBlank` | `String` | 不可為空白，含只有空格的字串也不通過 |
| `@NotEmpty` | `String`、集合 | 不可為 `null` 或空，允許只有空格的字串 |
| `@Size(min, max)` | `String`、集合 | 字串長度或集合大小必須在指定範圍內 |

<!--
前四個是最常用的「非空」類驗證，但三個「Not」有細微差異，常讓人混淆：

@NotNull 只管「不是 null」——空字串 "" 也算通過。
@NotBlank 更嚴格——空字串和只有空格的字串都不通過，一般 String 欄位用這個最保險。
@NotEmpty 介於中間——不允許 null 和空字串，但允許只有空格的字串。

對一般的名稱、標題欄位，選 @NotBlank；對集合欄位（例如購物車商品清單），選 @NotEmpty。
-->

---

# 常用驗證 Annotation（二）格式類

| Annotation | 適用型別 | 說明 |
| --- | --- | --- |
| `@Min(value)` | `int`、`long`、`Integer` | 數值不可小於 `value` |
| `@Max(value)` | `int`、`long`、`Integer` | 數值不可大於 `value` |
| `@Email` | `String` | 必須符合 Email 格式（包含 `@` 和網域） |
| `@Pattern(regexp)` | `String` | 必須符合指定的正規表達式 |

<!--
後四個是「格式限制」類驗證。

@Min 和 @Max 搭配使用很常見，例如年齡欄位加 @Min(1) @Max(120)。
@Email 省去自己寫 Email 正規表達式的麻煩，直接標上去就好。
@Pattern 最彈性，可以驗證任何格式——例如台灣手機號碼 ^09\d{8}$。
-->

---

# 在資料類別加上驗證規則

在 `CreateStudentRequest.java` 的欄位上，直接標注驗證 Annotation：

```java
public class CreateStudentRequest {
    @NotBlank(message = "姓名不能為空")
    private String name;

    @NotBlank(message = "密碼不能為空")
    private String password;

    @Min(value = 0, message = "分數不能為負數")
    @Max(value = 100, message = "分數不能超過 100")
    private Integer score;
}
```

<!--
這段程式碼把三個驗證規則標在 CreateStudentRequest 的欄位上——這就是第 33 章建立的 Request DTO。

三個重點：
第一，Annotation 直接貼在欄位宣告前面——規則跟資料在一起，一眼就看清楚。
第二，message 屬性讓我們自訂驗證失敗的提示訊息，預設訊息是英文，改成中文更友善。
第三，同一個欄位可以疊多個 Annotation，例如 score 同時有 @Min 和 @Max。

⚠️ import 要選 jakarta.validation.constraints，不是 javax.validation.constraints！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 驗證 Request Body

<!--
資料類別標好規則了，怎麼讓 Controller 自動執行驗證？
-->

---

# @Valid：觸發 Request Body 驗證

在 Controller 的 `@RequestBody` 參數前，加上 `@Valid` 就能觸發自動驗證：

```java
@RestController
public class StudentController {
    @Autowired
    private StudentService studentService;

    @PostMapping("/students")
    public StudentResponse create(
            @Valid @RequestBody CreateStudentRequest req) {
        return studentService.createStudent(req);
    }
}
```

執行後：傳入合法資料 → 正常執行；傳入不合法資料 → 自動回傳 HTTP 400。

<!--
只需要在 @RequestBody 前面加上 @Valid，Spring 就會在接收請求時，自動比對 CreateStudentRequest 欄位上的 Annotation 規則。

驗證通過，Service 的 createStudent() 正常執行。驗證失敗，Spring 自動拋出 MethodArgumentNotValidException，回傳 HTTP 400 Bad Request——完全不需要我們寫 if 判斷。

⚠️ 注意：@Valid 的 import 是 jakarta.validation.Valid，不是 Spring 的 Annotation。
-->

---

# 驗證失敗時拋出的兩種例外

| 情境 | 例外類型 | 預設行為 |
| --- | --- | --- |
| `@RequestBody` 驗證失敗 | `MethodArgumentNotValidException` | Spring 自動回傳 HTTP 400 |
| `@PathVariable` / `@RequestParam` 驗證失敗 | `ConstraintViolationException` | 預設回傳 HTTP 500，需手動處理 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> 兩種例外的來源不同，Part 5 會用 <code>@ControllerAdvice</code> 統一處理，讓兩者都回傳一致的 JSON 格式。
</div>

<!--
Spring 對兩種驗證失敗的處理方式不同：

@RequestBody 的驗證失敗，Spring 預設就會回傳 400，所以有基本保護。
@PathVariable 和 @RequestParam 的驗證失敗，預設是 500——這對前端來說很奇怪，所以需要我們自己加 @ExceptionHandler 處理。

這兩種例外的區分很重要，後面 Part 5 會展示怎麼統一處理。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## 驗證路徑與查詢參數

<!--
@Valid 是用在 @RequestBody 物件的。路徑變數和查詢參數不是物件，需要另一個做法。
-->

---

# @Validated：驗證 PathVariable 與 RequestParam

在 Controller **類別**上加 `@Validated`，才能在路徑與查詢參數上直接加驗證 Annotation：

```java
@RestController
@Validated
public class StudentController {

    @GetMapping("/students/{id}")
    public StudentResponse getById(
            @PathVariable("id") @Min(1) Integer id) {
        return studentService.getStudentById(id);
    }

    @GetMapping("/students/search")
    public String search(@RequestParam @NotBlank String name) {
        return "搜尋學生: " + name;
    }
}
```

<!--
@Valid 是加在「方法參數」上，讓 Spring 去驗證整個物件的欄位。
但 @PathVariable 和 @RequestParam 是單一值，不是物件——這時候要在類別層級加 @Validated，Spring 透過 AOP 機制才能驗證這些單一參數。

@Validated 是 Spring 自己的 Annotation（org.springframework.validation.annotation.Validated），不是 Jakarta 的——不要搞混了。

驗證失敗時，拋出的是 ConstraintViolationException，不是 MethodArgumentNotValidException。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5

## 統一錯誤回應

<!--
驗證失敗了，API 要回傳什麼格式給前端？現在來做統一的錯誤回應機制。
-->

---

# 為什麼需要統一錯誤回應？

Spring 預設的驗證失敗回應包含很多不必要的資訊，我們希望回傳乾淨的格式：

```json
{
  "errors": [
    { "field": "name",  "message": "姓名不能為空" },
    { "field": "score", "message": "分數不能超過 100" }
  ]
}
```

做法：新建一個 `ValidationExceptionHandler.java`，加上 `@ControllerAdvice`，讓 Spring 攔截所有驗證失敗並回傳上面的格式。下一頁看完整程式碼。

<!--
Spring 預設的 400 錯誤回應，包含 Spring 的內部資訊（timestamp、path、trace 等），前端要解析得費很大的力氣。

業界的做法是建立一個全域例外處理器類別（ValidationExceptionHandler.java），加上 @ControllerAdvice，讓它攔截所有 Controller 拋出的驗證例外，統一整理成乾淨的 JSON 格式回傳。

下一頁就是這個類別的完整程式碼。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# @ControllerAdvice + @ExceptionHandler

建立全域例外處理器，攔截 `MethodArgumentNotValidException`：

```java
@ControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public Map<String, Object> handleValidationError(
            MethodArgumentNotValidException ex) {
        List<Map<String, String>> errors = new ArrayList<>();
        ex.getBindingResult().getFieldErrors().forEach(fe ->
            errors.add(Map.of("field", fe.getField(),
                              "message", fe.getDefaultMessage())));
        return Map.of("errors", errors);
    }
}
```

<!--
@ControllerAdvice 讓這個類別成為全域例外處理器——所有 Controller 拋出的例外，都會先經過這裡。

@ExceptionHandler(MethodArgumentNotValidException.class) 指定攔截哪種例外。

從例外物件取出所有欄位錯誤（getFieldErrors），整理成我們自訂的 errors 陣列格式回傳。

注意：這個 handler 只能攔截 @RequestBody 的驗證失敗，@PathVariable 和 @RequestParam 的失敗需要另一個 handler，下一頁繼續看。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# 補充：攔截 ConstraintViolationException

在同一個 `ValidationExceptionHandler` 類別中，新增第二個 handler：

```java
@ExceptionHandler(ConstraintViolationException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
@ResponseBody
public Map<String, Object> handleConstraintViolation(
        ConstraintViolationException ex) {
    List<Map<String, String>> errors = new ArrayList<>();
    ex.getConstraintViolations().forEach(cv ->
        errors.add(Map.of(
            "field",   cv.getPropertyPath().toString(),
            "message", cv.getMessage())));
    return Map.of("errors", errors);
}
```

<!--
@PathVariable 和 @RequestParam 驗證失敗拋的是 ConstraintViolationException，需要另外加一個 @ExceptionHandler。

兩個方法都放在同一個 @ControllerAdvice 類別裡，就能統一處理所有驗證失敗的情境。

加入這兩個 handler 之後，不管是 Request Body、Path Variable 還是 Request Param 驗證失敗，前端收到的都是一樣格式的 JSON——這就是業界標準的做法。
-->

---

# 統一錯誤回應 — 執行結果

加入 `ValidationExceptionHandler` 後，用 Postman 發送不合法的 `POST /students`：

| 請求欄位 | 傳入的值 | 違反規則 |
| --- | --- | --- |
| `name` | `""` 空字串 | `@NotBlank` |
| `score` | `200` | `@Max(100)` |

回傳 HTTP **400 Bad Request**，JSON 格式如下：

```json
{
  "errors": [
    { "field": "name",  "message": "姓名不能為空" },
    { "field": "score", "message": "分數不能超過 100" }
  ]
}
```

<!--
這就是加入 ValidationExceptionHandler 之後的實際效果。

Postman 發送 POST /students，body 帶 name 為空字串、score 為 200，Spring 自動驗證、Handler 攔截、整理成 errors 陣列回傳。

兩個欄位同時驗證失敗，errors 陣列就有兩個元素——前端可以直接把每個 field 的 message 顯示在對應的輸入框旁邊。

這樣學生就能把前兩頁的程式碼和這裡的 JSON 對照起來，確認自己的實作是否正確。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6

## 補充：自訂驗證 Annotation

<!--
以下是進階選讀——當內建 Annotation 不夠用時，怎麼自己定義新的驗證規則。
-->

---

# 自訂驗證 Annotation

當內建 Annotation 無法滿足需求時（例如「必須是有效的台灣手機號碼」），可以自訂：

| 步驟 | 說明 |
| --- | --- |
| Step 1 | 建立 Annotation，加上 `@Constraint(validatedBy = ...)` 指向驗證器類別 |
| Step 2 | 實作 `ConstraintValidator<A, T>` 介面，在 `isValid` 方法中寫驗證邏輯 |
| Step 3 | 把自訂 Annotation 標在欄位上，和內建 Annotation 用法完全一樣 |

<!--
自訂驗證 Annotation 分兩個步驟：
第一步，建立 Annotation 類型，用 @Constraint 指向實作驗證邏輯的類別。
第二步，寫一個實作 ConstraintValidator 的類別，在 isValid 方法裡放你的驗證邏輯。

完成後，自訂 Annotation 的用法和 @Email、@NotBlank 完全一樣，直接貼在欄位上。

這是進階功能，初學先掌握內建 Annotation 就夠了。
-->

---

# 自訂驗證 Annotation — 檔案結構

建立兩個獨立的 `.java` 檔，放在 `validation` 套件下：

```
src/main/java/com/example/demo/
├── controller/
│   └── StudentController.java
├── dto/
│   └── CreateStudentRequest.java   ← 在這裡使用 @ValidPhone
└── validation/
    ├── ValidPhone.java             ← Step 1：定義 Annotation
    └── PhoneValidator.java         ← Step 2：實作驗證邏輯
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>慣例：</b> <code>validation/</code> 套件專門放自訂驗證相關類別，與 Controller、Service 分開。
</div>

<!--
兩個類別的職責完全不同：
ValidPhone.java 是 Annotation 的「外殼」——定義名稱、屬性、指向哪個驗證器。
PhoneValidator.java 是「實作」——真正執行 isValid() 判斷邏輯。

這兩個檔案必須放在同一套件下，Spring 才能正確解析 @Constraint(validatedBy = ...) 的關聯。
-->

---

# 定義 @ValidPhone Annotation

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PhoneValidator.class)
public @interface ValidPhone {
    String message() default "電話號碼格式不正確";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

<!--
這是一個自訂的 @ValidPhone Annotation。

三個屬性 message、groups、payload 是 Jakarta Bean Validation 規範規定的必要屬性，缺一不可，即使不用 groups 和 payload，也要保留空陣列的預設值。

@Constraint(validatedBy = PhoneValidator.class) 指向下一頁要實作的驗證邏輯類別。
-->

---

# 實作 PhoneValidator

```java
public class PhoneValidator
        implements ConstraintValidator<ValidPhone, String> {

    @Override
    public boolean isValid(String value,
                           ConstraintValidatorContext context) {
        if (value == null) return true;
        return value.matches("^09\\d{8}$");
    }
}
```

<!--
PhoneValidator 實作 ConstraintValidator 介面，泛型帶入兩個型別：
第一個是自訂的 Annotation 類型（ValidPhone），第二個是要驗證的欄位型別（String）。

isValid 方法是核心：回傳 true 代表通過驗證，false 代表失敗。

⚠️ 注意：當 value 為 null 時，我們回傳 true——讓 @NotBlank 負責處理空值，而不是在自訂驗證器裡重複處理。這是自訂驗證器的慣例。
-->

---

# 在 DTO 使用 @ValidPhone

在 `CreateStudentRequest.java` 的欄位上標注自訂 Annotation，用法與內建 Annotation 完全相同：

```java
public class CreateStudentRequest {

    @NotBlank(message = "姓名不能為空")
    private String name;

    @NotBlank(message = "密碼不能為空")
    private String password;

    @Min(value = 0, message = "分數不能為負數")
    @Max(value = 100, message = "分數不能超過 100")
    private Integer score;

    @NotBlank(message = "電話不能為空")
    @ValidPhone                          // ← 自訂 Annotation
    private String phone;
}
```

<!--
注意 phone 欄位同時標了 @NotBlank 和 @ValidPhone：
@NotBlank 負責擋掉 null 和空字串。
@ValidPhone 負責驗證格式是否符合台灣手機號碼規則。

這樣分工，PhoneValidator 的 isValid() 就不需要重複處理 null 的情況，邏輯更單純。

@ValidPhone 的 import 是來自你自己的 validation 套件：import com.example.demo.validation.ValidPhone;
-->

---

# 自訂 Annotation 的完整執行流程

```
POST /students（body 帶 phone: "0912345"）
         ↓
  @Valid 觸發驗證
         ↓
  Spring 掃描 @ValidPhone
         ↓
  呼叫 PhoneValidator.isValid("0912345", ...)
         ↓
  "0912345".matches("^09\\d{8}$") → false（只有 7 碼）
         ↓
  拋出 MethodArgumentNotValidException
         ↓
  ValidationExceptionHandler 攔截
         ↓
  回傳 HTTP 400
```

```json
{
  "errors": [
    { "field": "phone", "message": "電話號碼格式不正確" }
  ]
}
```

<!--
把整個流程串起來看：
1. Controller 的 @Valid 是觸發點。
2. Spring 發現欄位有 @ValidPhone，去找 @Constraint 指向的 PhoneValidator。
3. PhoneValidator.isValid() 回傳 false，驗證失敗。
4. Spring 拋出 MethodArgumentNotValidException。
5. ValidationExceptionHandler 攔截，整理成 errors 陣列回傳。

整個流程你只需要寫：Annotation 定義、Validator 邏輯、DTO 標注——Handler 已經在 Part 5 建好了，完全不需要改。
-->

---

# 自訂 Annotation vs 內建 Annotation 比較

| | 內建 Annotation | 自訂 Annotation |
| --- | --- | --- |
| 範例 | `@Email`、`@NotBlank`、`@Min` | `@ValidPhone`、`@ValidIdNumber` |
| 驗證邏輯 | 框架內建，無法修改 | 自己在 `isValid()` 撰寫，完全彈性 |
| 適用場景 | 通用格式（非空、長度、數值範圍） | 業務專屬規則（手機號碼、身分證、統一編號） |
| 建立成本 | 直接使用，零成本 | 需建立 2 個類別 |
| 錯誤處理 | 由現有 `ValidationExceptionHandler` 統一攔截 | 同左，**不需要額外修改 Handler** |

<!--
最後一列是重點：自訂 Annotation 驗證失敗拋出的例外，和內建 Annotation 一樣都是 MethodArgumentNotValidException——所以 Part 5 建好的 ValidationExceptionHandler 完全不需要改，就能處理自訂驗證的失敗。

建議規則：能用內建的就用內建的；需要業務邏輯才建自訂的。不要過度設計。
-->

---
layout: default
---

# 練習 1：為 CreateCourseRequest 加上驗證
### 任務說明

承接第 33 章的課程管理練習，`CreateCourseRequest` 目前沒有任何驗證：

| 欄位 | 類型 | 驗證規則 |
| --- | --- | --- |
| `name` | `String` | 不可為空白 |
| `credit` | `Integer` | 最小值 1，最大值 10 |

請完成：
1. 在 `CreateCourseRequest.java` 加上對應的驗證 Annotation
2. 在 `CourseController.java` 的 `create` 方法加上 `@Valid`
3. 用 Postman 測試，傳入不合法資料，確認收到 HTTP 400

<!--
我們來做第一個練習，把剛學的驗證 Annotation 加進第 33 章已經建立的 CreateCourseRequest。

大家先在腦海裡想一下：name 要用哪個 Annotation？credit 要用哪兩個？

想好了再動手，看看能不能一次寫對！記得先確認 build.gradle 有加 spring-boot-starter-validation 依賴，這是最常忘記的步驟。
-->

---

# 練習 1：解題提示

1. `name` → `@NotBlank(message = "課程名稱不能為空")`
2. `credit` → `@Min(value = 1, message = "學分至少為 1")` + `@Max(value = 10, message = "學分不超過 10")`
3. Controller 方法：`public CourseResponse create(@Valid @RequestBody CreateCourseRequest req)`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> 忘記在 <code>build.gradle</code> 加 <code>spring-boot-starter-validation</code>，會出現 <code>@NotBlank cannot be resolved</code> 的編譯錯誤。
</div>

<!--
三個步驟按順序做：先確認依賴，再標 Annotation，最後在 Controller 加 @Valid。

用 Postman 傳一個空的 name，應該收到 400 Bad Request，回應裡有 Spring 預設的驗證錯誤訊息。

有沒有成功看到 400 的回應？
-->

---
layout: default
---

# 練習 2：加上統一錯誤回應
### 任務說明

承接練習 1，目前驗證失敗的回應格式是 Spring 預設的，包含很多不必要的資訊。

請建立 `ValidationExceptionHandler.java`，攔截驗證失敗並統一回傳：

```json
{
  "errors": [
    { "field": "name", "message": "課程名稱不能為空" }
  ]
}
```

測試：用 Postman 傳入不合法資料，確認回應格式如上。

<!--
練習 2 要把剛才學的 @ControllerAdvice 用起來。

這是業界實際開發一定會做的事：前端不想解析 Spring 預設的錯誤格式，所以後端要統一整理成友善的 JSON。

試著先不看 Part 5 的範例，自己寫看看。寫不出來再回去看——這樣學得最扎實。
-->

---

# 練習 2：解題提示

1. 建立 `ValidationExceptionHandler.java`，加上 `@ControllerAdvice`
2. 新增方法，加上 `@ExceptionHandler(MethodArgumentNotValidException.class)`
3. 用 `ex.getBindingResult().getFieldErrors()` 取出所有欄位錯誤
4. 整理成 `Map.of("errors", errors)` 回傳

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>成功標準：</b> 傳空的 name，收到 400 且回應 JSON 裡有 <code>"field": "name"</code> 和你設定的 message 訊息。
</div>

<!--
做完之後，再用 Postman 試一次驗證失敗——這次回傳的 JSON 格式應該乾淨很多了。

如果想挑戰進階版，可以再加上 ConstraintViolationException 的 handler，讓 @PathVariable 的驗證失敗也有一致的錯誤格式。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 加入依賴 | `spring-boot-starter-validation`（Spring Boot 預設不包含，需手動加） |
| 版本注意 | Spring Boot 3.x 用 `jakarta.validation.*`，舊版才是 `javax.validation.*` |
| 標注規則 | 在資料類別欄位上加 `@NotBlank`、`@Email`、`@Min` 等 Annotation |
| 驗證物件 | `@RequestBody` 搭配 `@Valid`，Spring 自動執行驗證 |
| 驗證單值 | 類別上加 `@Validated`，才能在 `@PathVariable` 和 `@RequestParam` 加驗證 |
| 統一錯誤 | `@ControllerAdvice` + `@ExceptionHandler` 攔截驗證例外，回傳自訂 JSON |

<!--
今天的六個重點整理：

第一，使用前要先加依賴，這個很多人忘記。
第二，Spring Boot 3.x 用 jakarta，這是版本升級的重要改變。
第三，規則標在資料類別的欄位上，Annotation 一目了然。
第四，@RequestBody 用 @Valid，物件裡的所有欄位都會自動驗證。
第五，路徑和查詢參數要在類別上加 @Validated 才能驗證。
第六，@ControllerAdvice 統一處理驗證失敗，前端才能一致地解析錯誤。

學完今天，大家應該可以說：「我知道怎麼讓 Spring Boot 幫我自動把關 API 的輸入資料了！」
-->

---
layout: end
---

# Q & A

<!--
今天的 Validation 章節就到這裡。大家有任何問題嗎？
-->
