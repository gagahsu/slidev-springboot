---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Boot Validation
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
| 規範名稱 | Jakarta Bean Validation 3.0（Spring Boot 3.x / 4.x） |
| 核心概念 | 用 Annotation 標注欄位限制，框架自動觸發驗證 |
| 觸發時機 | Controller 收到請求時，Spring 自動執行驗證 |
| 驗證失敗 | 自動回傳 HTTP 400 Bad Request |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 3.x / 4.x 版本注意：</b> import 必須用 <code>jakarta.validation.*</code>，不再是舊版的 <code>javax.validation.*</code>
</div>

<!--
Bean Validation 就是一套「把規則寫在資料類別上」的規範。

類比：就像在表單的每個欄位旁邊貼一張便條紙，寫著「這裡必填」、「這裡要填 Email 格式」——但這張便條紙是寫給 Spring 看的，Spring 會自動照著規則驗。

特別提醒：Spring Boot 3.x / 4.x 之後，所有 Validation 的 import 都改成了 jakarta.validation，不再是 javax.validation。這是版本升級的重要改變，大家要特別注意。
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
    public String search(@RequestParam("name") @NotBlank String name) {
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

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
📁 <b>放置位置：</b> <code>ValidationExceptionHandler</code> 放在 <code>exception/</code> 套件下——<code>src/main/java/com/example/demo/exception/ValidationExceptionHandler.java</code>，與 controller、service、config 分開。
</div>

<!--
@ControllerAdvice 讓這個類別成為全域例外處理器——所有 Controller 拋出的例外，都會先經過這裡。

@ExceptionHandler(MethodArgumentNotValidException.class) 指定攔截哪種例外。

從例外物件取出所有欄位錯誤（getFieldErrors），整理成我們自訂的 errors 陣列格式回傳。

注意：這個 handler 只能攔截 @RequestBody 的驗證失敗，@PathVariable 和 @RequestParam 的失敗需要另一個 handler，下一頁繼續看。

放置位置：例外處理類別慣例集中在 exception/ 套件下，跟 config/ 一樣是橫跨全專案的基礎設施，不屬於任何單一業務模組。
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

# 練習 1：為問卷 DTO 加上驗證

承接第 37 章的問卷 CRUD，`SurveyDTO` 目前沒有任何驗證，前端送什麼都收。請依下表加上驗證：

| DTO | 欄位 | 驗證規則（`message`） |
| --- | --- | --- |
| `SurveyDTO` | `title` | 不可空白、最多 50 字（問卷名稱尚未填寫 / 問卷名稱最多 50 字） |
| | `description` | 不可空白、最多 300 字 |
| | `startDate` | 不可為 null，且**晚於今天**（開始日期必須晚於今天） |
| | `endDate` | 不可為 null，且**在開始日期之後**（跨欄位規則） |
| | `questions` | 每一題都要驗證（巢狀驗證） |
| `QuestionDTO` | `title`、`type` | 題目不可空白、題型不可為 null |
| `OptionDTO` | `label` | 選項不可空白、最多 100 字 |

請完成：

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
我們來做第一個練習，把剛學的驗證 Annotation 加進第 37 章已經建立的問卷 DTO。這些規則直接來自需求文件：問卷名稱和說明必填、日期要防呆，不能是今天以前。

大家先在腦海裡想一下：標題要用哪兩個 Annotation？開始日期「晚於今天」用哪個？結束日期要「晚於開始日期」，這是兩個欄位互相比較，用什麼方法？

提示一：@Future 是「必須在未來」，對日期來說，就是明天以後，正好符合「晚於今天」。@FutureOrPresent 才包含今天。
-->

---
layout: default
---

# 練習 1：為問卷 DTO 加上驗證（續）

1. `build.gradle` 加入 `spring-boot-starter-validation`
2. 在三個 DTO 加上對應的驗證 Annotation
3. 在 `create`、`update` 的 `@RequestBody` 前加上 `@Valid`
4. 用 Postman 傳入不合法資料（空標題、開始日期是今天、結束日期早於開始日期），確認收到 HTTP 400

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
提示二：題目在 SurveyDTO 裡面是一個 List，List 裡面的元素要驗證，必須在 List 欄位上加 @Valid，否則 Spring 只會檢查最外層。

提示三：跨欄位驗證，最簡單的做法是在 DTO 裡寫一個 isXxx() 方法，回傳 boolean，加上 @AssertTrue。

想好了再動手，記得先確認 build.gradle 有加 spring-boot-starter-validation 依賴，這是最常忘記的步驟。
-->

---
layout: default
---

# 練習 1：解題提示

1. `title` → `@NotBlank(message = "問卷名稱尚未填寫")` + `@Size(max = 50, message = "問卷名稱最多 50 字")`
2. `startDate` → `@NotNull` + `@Future(message = "開始日期必須晚於今天")`
3. 「結束日期在開始日期之後」→ 在 DTO 寫 `isEndAfterStart()`，加 `@AssertTrue`；記得加 `@JsonIgnore`
4. `questions`、`options` 這種 `List` → 欄位上加 `@Valid`，才會驗證每個元素
5. Controller：`create(@Valid @RequestBody SurveyDTO dto, ...)`

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> ① 忘記加 <code>spring-boot-starter-validation</code>，出現 <code>@NotBlank cannot be resolved</code>；② <code>List</code> 欄位沒加 <code>@Valid</code>，巢狀的題目完全沒被檢查；③ <code>@AssertTrue</code> 的方法沒加 <code>@JsonIgnore</code>，回傳的 JSON 裡會多出一個 <code>endAfterStart</code> 欄位。
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
三個步驟按順序做：先確認依賴，再標 Annotation，最後在 Controller 加 @Valid。

@AssertTrue 的方法有兩個規則：方法名稱要以 is 開頭，Bean Validation 才會把它當成一個屬性；回傳型別是 boolean。當任何一個日期是 null 的時候，這個方法直接回傳 true，因為「日期不可為空」已經由 @NotNull 負責，我們不重複報錯。

為什麼要加 @JsonIgnore？因為 Jackson 看到 isEndAfterStart() 也會把它當成一個叫 endAfterStart 的屬性，輸出到 JSON 裡；加了 @JsonIgnore，就不會了。

用 Postman 傳一個空的 title，應該收到 400 Bad Request，回應裡有 Spring 預設的驗證錯誤訊息。有沒有成功看到 400 的回應？
-->

---
layout: default
---

# 練習 1：解答程式碼（SurveyDTO）
### `dto/SurveyDTO.java`

```java
@Getter
@Setter
public class SurveyDTO implements java.io.Serializable {
    private Integer id;

    @Schema(description = "問卷名稱，最多 50 字", example = "午餐偏好調查")
    @NotBlank(message = "問卷名稱尚未填寫")
    @Size(max = 50, message = "問卷名稱最多 50 字")
    private String title;

    @NotBlank(message = "問卷說明尚未填寫")
    @Size(max = 300, message = "問卷說明最多 300 字")
    private String description;

    @Schema(description = "開始日期，必須晚於今天", example = "2026-10-01")
    @NotNull(message = "請選擇開始日期")
    @Future(message = "開始日期必須晚於今天")
    private LocalDate startDate;

    @NotNull(message = "請選擇結束日期")
    private LocalDate endDate;

    private boolean published;

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
SurveyDTO 每個欄位各自標上驗證規則。

@Size(max = 300) 跟資料庫的 VARCHAR(300) 對齊，確保資料到資料庫之前，就已經被擋掉，而不是等資料庫報錯。這是我們在 MySQL 課設計資料表時決定的長度。
-->

---
layout: default
---

# 練習 1：解答程式碼（SurveyDTO）（續）
### `dto/SurveyDTO.java`

```java
// ... 接上一頁

    // 跨欄位規則：驗證方法必須以 is 開頭、回傳 boolean；@JsonIgnore 避免它被當成 JSON 屬性輸出
    @JsonIgnore
    @Schema(hidden = true)
    @AssertTrue(message = "結束日期必須在開始日期之後")
    public boolean isEndAfterStart() {
        return startDate == null || endDate == null || endDate.isAfter(startDate);
    }

    // 以下由後端計算，前端不用傳
    @Schema(description = "由後端計算，前端不用傳", accessMode = Schema.AccessMode.READ_ONLY)
    private String status;       // DRAFT / NOT_STARTED / ONGOING / ENDED
    private String statusLabel;  // 未發佈 / 尚未開始 / 進行中 / 已結束

    @Valid
    private List<QuestionDTO> questions = new ArrayList<>();
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
isEndAfterStart() 這個方法，注意三個 Annotation：@JsonIgnore 讓它不進入 JSON；@Schema(hidden = true) 讓 Swagger 文件不顯示它；@AssertTrue 才是驗證的主角，method 名稱以 is 開頭，Bean Validation 才認得。

還有 status 和 statusLabel 兩個由後端計算的欄位，前端傳來的值，Service 一律忽略，不必驗證。

驗證訊息我們寫成前端可以直接顯示的句子，例如「問卷名稱尚未填寫」，這些字串跟需求文件的畫面是一致的。
-->

---
layout: default
---

# 練習 1：解答程式碼（QuestionDTO、OptionDTO、Controller）

```java
@Getter
@Setter
public class QuestionDTO implements java.io.Serializable {
    private Integer id;

    @NotBlank(message = "題目不可空白")
    @Size(max = 200, message = "題目最多 200 字")
    private String title;

    @NotNull(message = "請選擇題型")
    private QuestionType type;

    private boolean required;

    // 選項是「陣列」：單選、多選至少 2 個，文字題為空陣列
    @Valid
    private List<OptionDTO> options = new ArrayList<>();
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
QuestionDTO 的 options 欄位加了 @Valid，這樣 OptionDTO 裡的 @NotBlank，才會真的被執行。SurveyDTO 的 questions 也是一樣的道理，一層一層往下，每個 List 欄位都要加。

Controller 只需要在 @RequestBody 前面加 @Valid，其餘不用改。update 方法也一樣加。
-->

---
layout: default
---

# 練習 1：解答程式碼（QuestionDTO、OptionDTO、Controller）（續）

```java
@Getter
@Setter
public class OptionDTO implements java.io.Serializable {
    private Integer id;

    @NotBlank(message = "選項不可空白")
    @Size(max = 100, message = "選項最多 100 字")
    private String label;
}
```

```java
@PostMapping("/api/admin/surveys")
public SurveyDTO create(@Valid @RequestBody SurveyDTO dto,
                        @RequestParam(name = "publish", defaultValue = "false") boolean publish) {
    dto.setId(null);
    return surveyService.save(dto, publish);
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
驗證失敗時，Spring 會丟出 MethodArgumentNotValidException，預設回傳 400，但回應的格式是 Spring 預設的，資訊很雜。下一個練習我們就來統一整理。
-->

---
layout: default
---

# 練習 2：統一回應格式與錯誤處理

目前驗證失敗的回應是 Spring 預設格式，而且 Service 丟的 `IllegalStateException` 會變成 500。請建立整個專案統一的回應與錯誤處理：

1. `vo/AppResponse<T>`：欄位 `code`、`message`、`data`，提供 `success(data)`、`error(code)`
2. `vo/RspCode`（enum）：每個代碼對應一個 **HTTP 狀態碼**與預設訊息，例如 `NOT_FOUND`(404)、`SURVEY_NOT_EDITABLE`(409)
3. `exception/BizException`：業務例外，帶著一個 `RspCode`
4. `exception/GlobalExceptionHandler`（`@RestControllerAdvice`）：
   - `BizException` → 用 `RspCode` 的狀態碼回傳
   - `MethodArgumentNotValidException` → 400，`message` 放所有錯誤訊息，`data` 放 `[{field, message}]`
   - `Exception` → 500，不洩漏細節
5. 把 `SurveyService` 的 `IllegalArgumentException` / `IllegalStateException` 改成 `BizException`
6. Controller 回傳改成 `AppResponse.success(...)`，分頁結果包成 `PageResult`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 成功回應：<code>{"code":"SUCCESS","message":"成功","data":{...}}</code>；失敗回應同樣格式，<code>data</code> 是 <code>null</code>（驗證失敗時是欄位錯誤陣列），HTTP 狀態碼則反映真正的錯誤類型。
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
練習 2 要把剛才學的 @RestControllerAdvice 用起來，而且是整個專案共用的版本，之後每一章、每一個 API 都會沿用。

這是業界實際開發一定會做的事：前端不想解析 Spring 預設的錯誤格式，所以後端要統一整理成友善的 JSON。而且前端只需要處理一種格式，不管成功失敗，都是 code、message、data。

有一個設計決定要特別提醒：HTTP 狀態碼要不要跟著錯誤變化？有些教材會不管什麼錯誤，都回 200，再由 code 欄位告訴前端成功或失敗。這樣做簡單，但是瀏覽器的開發工具、監控系統、API 閘道都看不出來哪些請求失敗。我們的做法是兩者並用：HTTP 狀態碼是真的，code 欄位再提供更細的業務代碼。

RspCode 每個常數帶一個 HttpStatus，這樣 Handler 只要一行 ResponseEntity.status(code.getStatus())，不需要為每種例外寫 if。

試著先不看解答，自己寫看看，寫不出來再往下看。
-->

---
layout: default
---

# 練習 2：解答（RspCode、AppResponse、PageResult）

```java
@Getter
public enum RspCode {
    SUCCESS(HttpStatus.OK, "成功"),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "資料格式錯誤"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "請先登入"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "沒有權限"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "找不到資料"),
    SURVEY_NOT_EDITABLE(HttpStatus.CONFLICT, "問卷已開始，無法修改或刪除"),
    SURVEY_NOT_OPEN(HttpStatus.CONFLICT, "問卷不在填寫期間"),
    SURVEY_NO_STATISTICS(HttpStatus.CONFLICT, "問卷尚未開始，沒有統計資料"),
    ALREADY_RESPONDED(HttpStatus.CONFLICT, "此 Email 已經填寫過這份問卷"),
    NO_DRAFT(HttpStatus.CONFLICT, "沒有暫存的資料，請重新填寫"),
    EMAIL_EXISTS(HttpStatus.CONFLICT, "此 Email 已經註冊"),
    LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "帳號或密碼錯誤"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "Token 無效或已過期"),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "系統發生錯誤");

    private final HttpStatus status;
    private final String message;

    RspCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
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
RspCode 是一個 enum，每個常數有兩個值：HTTP 狀態碼和預設訊息。常見的對應：
400 是資料格式錯誤，401 是沒登入，403 是沒權限，404 是找不到，409 是「跟目前狀態衝突」，例如問卷已經開始，不能修改，或是這個 Email 已經填寫過。
-->

---
layout: default
---

# 練習 2：解答（RspCode、AppResponse、PageResult）（續）

```java
@Getter
@AllArgsConstructor
public class AppResponse<T> {
    private final String code;
    private final String message;
    private final T data;

    public static <T> AppResponse<T> success(T data) {
        return new AppResponse<>(RspCode.SUCCESS.name(), RspCode.SUCCESS.getMessage(), data);
    }

    public static AppResponse<Void> success() {
        return success(null);
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
409 Conflict 很適合用在「請求本身格式沒問題，但是跟資料現在的狀態衝突」的情況。

AppResponse 是一個泛型類別，data 的型別由呼叫的人決定。success(data) 回傳成功，error(code) 回傳失敗，data 是 null。static 方法讓呼叫端寫起來很簡潔：AppResponse.success(dto)。
-->

---
layout: default
---

# 練習 2：解答（RspCode、AppResponse、PageResult）（續）

```java
// ... 接上一頁

    public static AppResponse<Void> error(RspCode code) {
        return new AppResponse<>(code.name(), code.getMessage(), null);
    }

    public static AppResponse<Void> error(RspCode code, String message) {
        return new AppResponse<>(code.name(), message, null);
    }

    public static <T> AppResponse<T> error(RspCode code, String message, T data) {
        return new AppResponse<>(code.name(), message, data);
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
Lombok 的 @AllArgsConstructor 產生建構子，@Getter 產生 getter，Jackson 就是靠 getter 把它轉成 JSON。
-->

---
layout: default
---

# 練習 2：解答（PageResult、BizException、GlobalExceptionHandler）

```java
@Getter
@AllArgsConstructor
public class PageResult<T> {
    private final List<T> content;
    private final int page;          // 從 0 開始
    private final int size;
    private final long totalElements;
    private final int totalPages;

    public static <E, T> PageResult<T> of(Page<E> page, Function<E, T> mapper) {
        return new PageResult<>(page.getContent().stream().map(mapper).toList(),
                page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages());
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
PageResult 是我們自己定義的分頁格式。為什麼不直接回傳 Spring Data 的 Page？因為 Page 序列化出來的 JSON 有很多我們用不到的欄位，像 pageable、sort、first、last，而且 Spring 官方也不建議直接序列化 PageImpl。我們只保留前端需要的五個欄位：content、page、size、totalElements、totalPages。

of() 這個靜態方法，接收一個 Page 和一個轉換函式，把 Page 裡的內容轉換成別的型別，同時保留分頁資訊。
-->

---
layout: default
---

# 練習 2：解答（PageResult、BizException、GlobalExceptionHandler）（續）

```java
@Getter
public class BizException extends RuntimeException {
    private final RspCode code;

    public BizException(RspCode code) {
        super(code.getMessage());
        this.code = code;
    }

    public BizException(RspCode code, String message) {
        super(message);
        this.code = code;
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
BizException 是 RuntimeException，不需要在方法上宣告 throws，在 Service 裡任何地方都可以丟。帶著一個 RspCode，Handler 就知道要回什麼狀態碼。
-->

---
layout: default
---

# 練習 2：解答（GlobalExceptionHandler）

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BizException.class)
    public ResponseEntity<AppResponse<Void>> handleBiz(BizException e) {
        return ResponseEntity.status(e.getCode().getStatus())
                .body(AppResponse.error(e.getCode(), e.getMessage()));
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
GlobalExceptionHandler 用 @RestControllerAdvice，攔截整個專案 Controller 丟出來的例外，每個 @ExceptionHandler 負責一種例外。

BizException：直接用它帶的 RspCode 決定狀態碼。
-->

---
layout: default
---

# 練習 2：解答（GlobalExceptionHandler）（續）

```java
    // ... 接上一頁

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AppResponse<List<FieldErrorVO>>> handleValid(MethodArgumentNotValidException e) {
        List<FieldErrorVO> errors = e.getBindingResult().getFieldErrors().stream()
                .map(f -> new FieldErrorVO(f.getField(), f.getDefaultMessage()))
                .toList();
        // message 只放訊息本身（前端直接跳提醒視窗）；data 保留欄位名稱，方便標紅欄位
        String message = errors.stream().map(FieldErrorVO::message).collect(Collectors.joining("；"));
        return ResponseEntity.badRequest().body(AppResponse.error(RspCode.VALIDATION_ERROR, message, errors));
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
MethodArgumentNotValidException：這就是 @Valid 驗證失敗的例外。我們把每個欄位的錯誤整理成 FieldErrorVO，message 放所有錯誤訊息，用分號串起來，前端可以直接跳提醒視窗；data 放欄位陣列，方便標紅有問題的欄位。
-->

---
layout: default
---

# 練習 2：解答（GlobalExceptionHandler）（續）

```java
    // ... 接上一頁

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<AppResponse<Void>> handleUnreadable(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body(AppResponse.error(RspCode.VALIDATION_ERROR, "請求內容格式錯誤"));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<AppResponse<Void>> handleNoResource(NoResourceFoundException e) {
        return ResponseEntity.status(RspCode.NOT_FOUND.getStatus()).body(AppResponse.error(RspCode.NOT_FOUND));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<AppResponse<Void>> handleDenied(AccessDeniedException e) {
        return ResponseEntity.status(RspCode.FORBIDDEN.getStatus()).body(AppResponse.error(RspCode.FORBIDDEN));
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
HttpMessageNotReadableException 是 JSON 格式根本就錯了，例如少了逗號，回 400。
-->

---
layout: default
---

# 練習 2：解答（GlobalExceptionHandler）（續）

```java
// ... 接上一頁

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse<Void>> handleOther(Exception e) {
        log.error("未預期的錯誤：{}", e.getMessage(), e);   // ERROR：最後一個參數傳 e，才會印出完整 stack trace
        return ResponseEntity.status(RspCode.SERVER_ERROR.getStatus()).body(AppResponse.error(RspCode.SERVER_ERROR));
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
最後一個 Exception，是最後的防線：不管是什麼沒預料到的例外，都回 500，訊息只有「系統發生錯誤」，不要把例外的細節丟給前端，那可能洩漏資料庫結構等敏感資訊；細節印在日誌裡就好，這在下一個章節會用 Logger 取代 printStackTrace。

⚠️ 順序不重要：Spring 會自動挑選「最具體」的 Handler，所以 BizException 會由 handleBiz 處理，而不是最後的 Exception。
-->

---
layout: default
---

# 練習 2：解答（Service 與 Controller 的修改）

```java
// SurveyService：把一般例外換成 BizException
private Survey findOrThrow(Integer id) {
    return surveyRepository.findById(id)
            .orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
}

// save() 裡：進行中、已結束的問卷不能修改
if (survey.getId() != null && !statusOf(survey).isEditable()) {
    throw new BizException(RspCode.SURVEY_NOT_EDITABLE);
}

// deleteAll() 裡：任何一份已開始，整批都不刪
for (Survey s : surveys) {
    if (!statusOf(s).isEditable()) {
        throw new BizException(RspCode.SURVEY_NOT_EDITABLE,
                "「" + s.getTitle() + "」已開始，無法刪除");
    }
}

// search() 改回傳 PageResult
public PageResult<SurveyDTO> search(/* 參數不變 */) {
    // ...
    return PageResult.of(surveyRepository.search(keyword, start, end, publishedOnly, pageable),
            s -> toDTO(s, false));
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
Service 的修改很單純：把 IllegalArgumentException 換成 BizException(RspCode.NOT_FOUND)，把 IllegalStateException 換成 BizException(RspCode.SURVEY_NOT_EDITABLE)。

批次刪除的訊息，我們用 BizException 的第二個建構子，帶自訂訊息，告訴前端是哪一份問卷不能刪：「午餐偏好調查」已開始，無法刪除。
-->

---
layout: default
---

# 練習 2：解答（Service 與 Controller 的修改）（續）

```java
// SurveyController：回傳 AppResponse，分頁包成 PageResult
@GetMapping("/api/surveys")
public AppResponse<PageResult<SurveyDTO>> list(/* 參數不變 */) {
    return AppResponse.success(surveyService.search(title, startDate, endDate, true, page, size));
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
Controller 的修改也很單純：所有的回傳值，都用 AppResponse.success() 包起來；分頁結果由 PageResult.of() 轉換，Service 的 search 方法回傳 PageResult。

這裡有一個小細節：Service 現在回傳 PageResult，而不是 Spring 的 Page 了，所以 Service 的 search 要改成 PageResult.of(repository.search(...), s -> toDTO(s, false))。
-->

---
layout: default
---

# 練習 2：Postman 測試

| 測試 | 預期結果 |
| --- | --- |
| `POST /api/admin/surveys`，`title` 傳 `""` | **400**，`code = VALIDATION_ERROR`，`message` 含「問卷名稱尚未填寫」，`data` 有 `{"field":"title", ...}` |
| `startDate` 傳今天 | **400**，「開始日期必須晚於今天」 |
| `endDate` 等於 `startDate` | **400**，「結束日期必須在開始日期之後」 |
| 選項的 `label` 傳空白 | **400**（巢狀驗證生效） |
| `PUT /api/admin/surveys/2`（進行中） | **409**，`code = SURVEY_NOT_EDITABLE` |
| `GET /api/admin/surveys/999` | **404**，`code = NOT_FOUND` |
| Body 傳壞掉的 JSON（少一個引號） | **400**，「請求內容格式錯誤」 |
| 合法資料 `POST` | **200**，`code = SUCCESS`，`data` 是新增的問卷 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>成功標準：</b> 不論成功或失敗，回應都是 <code>code / message / data</code> 三個欄位，而且 HTTP 狀態碼與錯誤類型相符。
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
最後用 Postman 把每一種情況都試一遍。

特別注意「選項的 label 傳空白」這一項：它會被擋下來，證明巢狀驗證是有效的。如果你沒看到 400，請回去檢查 QuestionDTO 的 options 欄位有沒有加 @Valid。

還有 PUT 進行中的問卷，現在回傳 409 加上清楚的訊息，而不是之前的 500。狀態碼跟訊息都是從 RspCode 這個 enum 來的，要新增一種錯誤，只要在 enum 加一行，Handler 完全不用改。

做完這兩個練習，後端的「門面」就完成了：驗證、統一回應、統一錯誤處理，之後不管加什麼新功能，都沿用這套規則。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 加入依賴 | `spring-boot-starter-validation`（Spring Boot 預設不包含，需手動加） |
| 版本注意 | Spring Boot 3.x / 4.x 用 `jakarta.validation.*`，舊版才是 `javax.validation.*` |
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
