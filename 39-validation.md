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
大家好，歡迎來到第三十九章，也是「架構與實務」這個單元的最後一章。

第三十七章的最後，我們留下了一個問題：新增同學的時候，成績填 200，得到的是 500。今天就來解決它。

今天的主題是 Validation，中文叫做驗證：在資料進來的時候，先檢查它合不合規定。今天繼續使用 school 專案。
-->

---

# 今天要搞懂的四件事

<v-clicks>

- **為什麼要驗證？** 不檢查的話，什麼資料都會被收進來
- **規則怎麼寫？** 把規則標在 DTO 的欄位上
- **怎麼啟動檢查？** `@Valid` 和 `@Validated`
- **檢查沒過，怎麼回覆？** 統一格式的錯誤訊息。最後補充自訂規則

</v-clicks>

<!--
今天要搞懂四件事。

（下一步）第一，為什麼要驗證。不檢查的話，什麼資料都會被收進來。

（下一步）第二，規則怎麼寫。做法是把規則標在 DTO 的欄位上。

（下一步）第三，怎麼啟動檢查。會用到兩個長得很像的 Annotation：@Valid 和 @Validated。

（下一步）第四，檢查沒過的時候，怎麼回覆。我們會做出統一格式的錯誤訊息。最後有一段補充，介紹怎麼自己訂規則。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 櫃台收件，先檢查

<!--
先看教務處。
-->

---

# 現在的櫃台，什麼都收

用 Postman 或 Swagger UI 對 `POST /students` 試試看：

<v-clicks>

- `"name": ""` → 新增成功。學籍簿多了一位**沒有名字**的同學
- `"idNumber": "A12"` → 新增成功。身分證字號只有三碼
- `"score": 200` → 500。`ScoreVO` 擋下來了，但是前端只知道「伺服器出錯」
- `"score"` 沒有填 → 也是 500

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 兩個問題：<b>不該收的收進來了</b>；擋下來的，<b>沒有告訴對方哪裡填錯</b>。
</div>

</v-click>

<!--
現在的櫃台，什麼都收。請用 Postman 或是上一章的 Swagger UI，對新增同學的 API 試試看。

（下一步）姓名給空字串。新增成功。學籍簿多了一位沒有名字的同學。

（下一步）身分證字號只填 A12 三碼。新增成功。

（下一步）成績填 200。得到 500。這是 ScoreVO 擋下來的，資料沒有存進去。但是前端只知道「伺服器出錯」，不知道是自己的成績填錯。

（下一步）成績那一格乾脆不填。也是 500。

（下一步）所以有兩個問題。第一，不該收的收進來了。第二，擋下來的，沒有告訴對方哪裡填錯。
-->

---

# 教務處的做法：收件時當場檢查

<FormCheck />

<!--
真正的教務處會怎麼做？我們看一張亂填的申請表。姓名沒寫，成績寫 200，身分證字號只有三碼。

（下一步）第一，規則直接印在申請表每一格的旁邊。姓名一定要填，成績是 0 到 100，身分證字號是一個字母加九個數字。

（下一步）第二，櫃台收件的時候，當場照著規則檢查。不合規則的格子打叉。

（下一步）第三，退件。而且一次告訴你哪幾格有問題，不是改一格退一次。最重要的是，這張申請表沒有往後送。組長沒看到，檔案室也沒有收到任何東西。
-->

---

# 對照到程式

<FormCheck terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>Bean Validation</b>：把規則用 Annotation 標在欄位上，由框架自動檢查。不用自己寫一大串 <code>if</code>。
</div>

</v-click>

<!--
同一張圖，換成程式的名字。

（下一步）印在格子旁邊的規則，是加在 DTO 欄位上的 Annotation。例如 @NotBlank 是一定要填，@Min 和 @Max 是數字的範圍。

（下一步）櫃台當場檢查，是在 Controller 的參數前面加 @Valid。

（下一步）退件，是回覆 400 Bad Request。第十三章學過，4 開頭的狀態碼代表「請求的一方有問題」。這才是正確的狀態碼。

（下一步）這一整套做法叫做 Bean Validation。用一句話說：把規則用 Annotation 標在欄位上，由框架自動檢查。我們不用自己寫一大串 if。
-->

---

# 想一想

<Poll question="前端傳來的成績是 200，後端最適合回覆哪一個狀態碼？" options="200 OK|400 Bad Request|404 Not Found|500 Internal Server Error" answer="2" />

<!--
來想一題。

前端傳來的成績是 200，後端最適合回覆哪一個狀態碼？

（等大家作答）

（下一步）答案是 400 Bad Request。

問題出在請求的內容，是前端這一方的錯。500 是伺服器自己出錯的時候用的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 把規則印在格子旁邊

<!--
開始動手。先加依賴，再寫規則。
-->

---

# 加入依賴

在 `build.gradle` 的 `dependencies` 裡加一行：

```groovy
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

<v-clicks>

- Spring Boot 預設**沒有**包含驗證的功能，要自己加
- 這是 Spring Boot 官方的 starter，不用寫版本號
- 加完之後：專案按右鍵 → **Gradle** → **Refresh Gradle Project**
- 之後 import 規則的時候，請選 `jakarta.validation` 開頭的

</v-clicks>

<!--
打開 build.gradle，在 dependencies 裡加這一行。

（下一步）Spring Boot 預設沒有包含驗證的功能，要自己加。

（下一步）這是 Spring Boot 官方的 starter，所以不用寫版本號。

（下一步）加完之後，在專案上按右鍵，選 Gradle，再選 Refresh Gradle Project。

（下一步）之後 import 規則的時候，請選 jakarta.validation 開頭的。和 JPA 的時候選 jakarta.persistence 是同樣的道理。
-->

---

# 常用的規則（一）：一定要填

<v-clicks>

- `@NotNull`：不能是 `null`（也就是不能沒給）。但是空字串 `""` 會通過
- `@NotEmpty`：不能是 `null`，也不能是空的。但是只有空白的 `"   "` 會通過
- `@NotBlank`：不能是 `null`、不能是空的、也不能只有空白。**只能用在文字**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 怎麼選：<b>文字用 <code>@NotBlank</code>，數字和其他型別用 <code>@NotNull</code></b>。
</div>

</v-click>

<!--
先認識常用的規則。第一組是「一定要填」，有三個，一個比一個嚴格。

（下一步）@NotNull。不能是 null，也就是不能沒給。但是如果給的是空字串，它會通過。

（下一步）@NotEmpty。不能是 null，也不能是空的。但是如果給的是好幾個空白，它會通過。

（下一步）@NotBlank。不能是 null、不能是空的、也不能只有空白。這是最嚴格的。它只能用在文字上。

（下一步）怎麼選？記一個簡單的原則：文字用 @NotBlank，數字和其他型別用 @NotNull。
-->

---

# 常用的規則（二）：範圍和格式

<v-clicks>

- `@Min(0)`、`@Max(100)`：數字不能小於、不能大於
- `@Size(min = 2, max = 20)`：文字的長度，或是 List 裡的數量
- `@Email`：要長得像電子郵件
- `@Pattern(regexp = "…")`：要符合指定的格式

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 每一個規則都可以加 <code>message = "…"</code>，寫上檢查沒過時要顯示的訊息。一個欄位可以同時加好幾個規則。
</div>

</v-click>

<!--
第二組是範圍和格式。

（下一步）@Min 和 @Max。數字不能小於多少、不能大於多少。

（下一步）@Size。文字的長度，或是 List 裡的數量，要在指定的範圍裡。

（下一步）@Email。內容要長得像電子郵件。

（下一步）@Pattern。內容要符合指定的格式。格式是用一種叫做「正規表達式」的寫法描述的，今天後面的補充會看到一個例子。

（下一步）每一個規則都可以加 message，寫上檢查沒過的時候要顯示的訊息。另外，一個欄位可以同時加好幾個規則，全部都要通過才算過關。
-->

---

# 把規則加到申請表上

```java {4-5|7-8|10-13|all}
@Getter
@Setter
public class CreateStudentRequest {
    @NotBlank(message = "姓名不能空白")
    private String name;

    @NotBlank(message = "身分證字號不能空白")
    private String idNumber;

    @NotNull(message = "成績一定要填")
    @Min(value = 0, message = "成績不能小於 0")
    @Max(value = 100, message = "成績不能超過 100")
    private Integer score;
}
```

<v-click>

<div class="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ <code>@Min</code> 和 <code>@Max</code> 遇到 <code>null</code> 會直接<b>放行</b>。所以數字如果一定要填，要另外加 <code>@NotNull</code>。
</div>

</v-click>

<!--
打開 dto 裡的 CreateStudentRequest，把規則加上去。上一章加的 @Schema 可以留著，投影片上為了清楚先省略。

（下一步）姓名，加 @NotBlank，訊息是「姓名不能空白」。

（下一步）身分證字號，也先加 @NotBlank。格式的檢查，留到後面的補充。

（下一步）成績，加三個規則。@NotNull，一定要填。@Min 0，不能小於 0。@Max 100，不能超過 100。

（下一步）這裡有一個容易漏掉的地方。@Min 和 @Max 遇到 null 會直接放行。它們的想法是：沒有值，就沒有東西可以比大小。所以數字如果一定要填，要另外加 @NotNull。

規則寫好了。但是現在重新啟動去測試，會發現完全沒有效果。因為我們還沒有請櫃台檢查。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 請櫃台檢查：@Valid

<!--
規則只是印在表格上。還要有人照著檢查。
-->

---

# 在參數前面加 @Valid

```java {3}
@PostMapping("/students")
public StudentResponse createStudent(
        @Valid @RequestBody CreateStudentRequest req) {
    return studentService.createStudent(req);
}
```

<v-clicks>

- `@Valid`：請 Spring 在呼叫這個方法**之前**，先照規則檢查這個物件
- 全部通過 → 照常執行方法
- 有任何一條沒過 → 方法**不會被執行**，直接回覆 400

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
📌 規則寫在 DTO，<code>@Valid</code> 寫在 Controller。兩邊都要有，檢查才會發生。
</div>

</v-click>

<!--
打開 StudentController，在新增的方法裡，@RequestBody 的前面加上 @Valid。

（下一步）@Valid 的意思是：請 Spring 在呼叫這個方法之前，先照規則檢查這個物件。

（下一步）全部通過，就照常執行方法。

（下一步）有任何一條沒過，方法不會被執行，直接回覆 400。組長和承辦人員完全不知道有這件事。

（下一步）請記得：規則寫在 DTO，@Valid 寫在 Controller。兩邊都要有，檢查才會發生。最常見的錯誤，就是寫了規則卻忘了加 @Valid。

修改的方法 updateStudent 也收了同一張申請表，請一起加上 @Valid。
-->

---

# 測試：亂填的申請表

`POST /students`，Body：

```json
{ "name": "", "idNumber": "A223456789", "score": 200 }
```

回覆 **400 Bad Request**：

```json
{
  "timestamp": "2026-11-16T02:10:00.000Z",
  "status": 400,
  "error": "Bad Request",
  "path": "/students"
}
```

<v-clicks>

- 狀態碼對了：是 400，不是 500。資料也沒有存進去
- 但是內容只說「Bad Request」，**沒有說是哪一格、錯在哪裡**

</v-clicks>

<!--
重新啟動，測試一下。送出一張亂填的申請表：姓名是空字串，成績是 200。

回覆是 400 Bad Request，內容在下面。

（下一步）狀態碼對了。是 400，不是 500。到 Workbench 看，資料也沒有存進去。

（下一步）但是回覆的內容只說 Bad Request，沒有說是哪一格、錯在哪裡。我們寫在 message 裡的那些訊息，都沒有出現。

這是 Spring Boot 預設的錯誤格式。前端拿到這個，還是不知道要請使用者改什麼。這個問題在 Part 5 解決。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 網址上的參數也要檢查

<!--
申請表檢查了。但是有些資料不在申請表上，而是在網址上。
-->

---

# @Validated：檢查路徑和查詢參數

```java {2|7}
@RestController
@Validated
public class StudentController {

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentResponse> getStudentById(
            @PathVariable("id") @Min(value = 1, message = "編號要從 1 開始") Integer id) {
        // …
    }
}
```

<v-clicks>

- 規則直接寫在參數前面，和 `@PathVariable`、`@RequestParam` 放在一起
- 類別上面要加 `@Validated`，這些規則才會被檢查
- 測試 `GET /students/0` → 檢查沒過。但是狀態碼是 **500**

</v-clicks>

<!--
例如用編號查詢，編號在網址上。編號不可能是 0 或負數，我們也想檢查。

（下一步）第一步，在 Controller 類別的上面加 @Validated。

（下一步）第二步，把規則直接寫在參數的前面，和 @PathVariable 放在一起。這裡用 @Min 1，編號要從 1 開始。

（下一步）@RequestParam 的參數也是同樣的寫法。

（下一步）類別上面的 @Validated 不能少。有它，這些寫在參數前面的規則才會被檢查。

（下一步）測試一下，GET /students/0。檢查確實沒過，方法沒有執行。但是狀態碼是 500，不是 400。

為什麼？因為這兩種檢查，沒過的時候丟出來的例外不一樣。
-->

---

# 兩種檢查，兩種例外

<Pairs left="檢查的對象" right="沒過的時候" rows="form,@RequestBody 的物件（加 @Valid）=code,MethodArgumentNotValidException → 預設 400|what,路徑、查詢參數（類別加 @Validated）=code,ConstraintViolationException → 預設 500" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 名字很長，不用背。只要知道：兩種情況的預設回覆都不夠好，下一個部分會<b>自己接手</b>，把它們改成同一種格式。
</div>

</v-click>

<!--
我們把兩種檢查放在一起看。

（下一步）第一種，檢查 @RequestBody 的物件，也就是加 @Valid 的那一種。沒過的時候，Spring 丟出的例外叫做 MethodArgumentNotValidException。預設回覆 400。

（下一步）第二種，檢查路徑和查詢參數，也就是類別加 @Validated 的那一種。沒過的時候，丟出的例外叫做 ConstraintViolationException。這個例外 Spring 預設不認得，所以當成一般的錯誤，回覆 500。

（下一步）這兩個名字很長，不用背，用到的時候回來查就好。只要知道：兩種情況的預設回覆都不夠好。下一個部分，我們會自己接手，把它們改成同一種格式。

補充一點。比較新的 Spring Boot，不加 @Validated 也會檢查參數上的規則，不過丟出來的又是另一種例外。這門課統一用加 @Validated 的寫法。
-->

---

# 想一想

<Poll question="DTO 的欄位都加好規則了，但是亂填的資料還是被存進資料庫。最可能的原因是？" options="資料庫壞了|Controller 的參數前面忘了加 @Valid|message 寫錯字|Postman 的問題" answer="2" />

<!--
確認一下。

DTO 的欄位都加好規則了，但是亂填的資料還是被存進資料庫。最可能的原因是？

（等大家作答）

（下一步）答案是：Controller 的參數前面忘了加 @Valid。

規則只是印在表格上。沒有 @Valid，就沒有人照著檢查。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 統一格式的退件單

<!--
接下來處理回覆的內容。
-->

---

# 我們想要的退件單

```json
{
  "errors": [
    { "field": "name",  "message": "姓名不能空白" },
    { "field": "score", "message": "成績不能超過 100" }
  ]
}
```

<v-clicks>

- 一次列出**所有**有問題的欄位
- 每一筆都有：哪一格（`field`）、錯在哪裡（`message`）
- 不管是哪一支 API，退件的格式都一樣。前端只要寫一次處理的程式

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 做法：設一個<b>專門處理退件的窗口</b>。不管哪個櫃台的檢查沒過，都交給它，用同一種格式回覆。
</div>

</v-click>

<!--
先看目標。我們想要的退件單長這樣：一個 errors 陣列，裡面每一筆有兩個欄位。

（下一步）一次列出所有有問題的欄位。

（下一步）每一筆都有：field 是哪一格，message 是錯在哪裡。message 就是我們寫在規則裡的訊息。

（下一步）不管是哪一支 API，退件的格式都一樣。這樣前端只要寫一次處理的程式。

（下一步）做法是：設一個專門處理退件的窗口。不管哪個櫃台的檢查沒過，都交給它，用同一種格式回覆。這樣就不用在每個 Controller 裡各寫一次。
-->

---

# 退件窗口：@RestControllerAdvice

新增 `exception` 資料夾，建立 `ValidationExceptionHandler`：

```java {1|4-5|8-13|14-16|all}
@RestControllerAdvice
public class ValidationExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleBodyError(MethodArgumentNotValidException ex) {
        List<Map<String, String>> errors = new ArrayList<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            Map<String, String> error = new HashMap<>();
            error.put("field", fe.getField());
            error.put("message", fe.getDefaultMessage());
            errors.add(error);
        }
        Map<String, Object> body = new HashMap<>();
        body.put("errors", errors);
        return body;
    }
}
```

<!--
在 com.example.school 下面新增一個 exception 資料夾，建立 ValidationExceptionHandler。

（下一步）類別上面加 @RestControllerAdvice。意思是：這個類別負責處理所有 Controller 丟出來的例外，而且回傳的東西會自動變成 JSON。它就是那個退件窗口。第十一章提過的 @ControllerAdvice 就是它的基本款；多了 Rest，和 @RestController 一樣，代表回傳的是資料。

（下一步）方法上面加兩個 Annotation。@ExceptionHandler 後面寫例外的類別，意思是「這種例外交給我處理」。這裡寫的是 @Valid 檢查沒過時的那一個。@ResponseStatus 指定回覆的狀態碼，BAD_REQUEST 就是 400。

（下一步）方法的內容。例外物件裡，記著每一條沒過的規則。我們用 for 迴圈一條一條拿出來。getField 是欄位的名字，getDefaultMessage 是我們寫的 message。每一條做成一個小的 Map，放進 List。

（下一步）最後再用一個 Map 包起來，key 叫做 errors。回傳出去，Spring 會把它變成我們想要的那個 JSON。

（下一步）這段程式比較長，但是寫一次就可以一直用。之後不管新增多少 Controller、多少規則，都不用再改它。
-->

---

# 再接手第二種例外

在同一個類別裡，再加一個方法：

```java {1-2|5-10|all}
@ExceptionHandler(ConstraintViolationException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public Map<String, Object> handleParamError(ConstraintViolationException ex) {
    List<Map<String, String>> errors = new ArrayList<>();
    for (ConstraintViolation<?> cv : ex.getConstraintViolations()) {
        Map<String, String> error = new HashMap<>();
        error.put("field", cv.getPropertyPath().toString());
        error.put("message", cv.getMessage());
        errors.add(error);
    }
    Map<String, Object> body = new HashMap<>();
    body.put("errors", errors);
    return body;
}
```

- 處理路徑、查詢參數檢查沒過的情況，把 500 改成 400
- 結構和上一個方法一樣，只是拿資料的方法名稱不同

<!--
在同一個類別裡，再加一個方法，接手第二種例外。

（下一步）@ExceptionHandler 後面換成 ConstraintViolationException，也就是路徑和查詢參數檢查沒過時的那一個。狀態碼一樣指定 400。這樣就把原本的 500 改成 400 了。

（下一步）方法的內容，結構和上一個一樣。只是從例外物件拿資料的方法名稱不同：getPropertyPath 是哪一個參數，getMessage 是訊息。迴圈那一行的角括號問號可以先照著寫。

（下一步）兩個方法寫好，兩種檢查沒過的情況，回覆的就是同一種格式了。
-->

---

# 測試：這次有說明了

`POST /students`，Body 是 `{ "name": "", "idNumber": "A223456789", "score": 200 }`：

```json
{
  "errors": [
    { "field": "name",  "message": "姓名不能空白" },
    { "field": "score", "message": "成績不能超過 100" }
  ]
}
```

<v-clicks>

- 狀態碼 400；兩個問題一次列出來（順序不一定和欄位的順序相同）
- `GET /students/0` → 也是 400：`{ "field": "getStudentById.id", "message": "編號要從 1 開始" }`
- `ScoreVO` 裡的檢查還要留著嗎？**要**。它是組長那邊的最後一道防線

</v-clicks>

<!--
重新啟動，再送一次同樣那張亂填的申請表。

這次回覆的內容，就是我們設計的格式。

（下一步）狀態碼是 400。兩個問題一次列出來。順序不一定和欄位的順序相同，這是正常的。

（下一步）GET /students/0 也變成 400 了。field 的內容是方法名稱加上參數名稱，message 是「編號要從 1 開始」。

（下一步）最後一個問題。DTO 已經檢查過成績了，ScoreVO 裡的檢查還要留著嗎？要。櫃台的檢查是第一道，擋掉填錯的申請表。ScoreVO 是組長那邊的最後一道防線。以後如果有別的程式不經過櫃台、直接呼叫組長，資料還是會被檢查到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# 補充：自己訂一條規則

<!--
最後是補充的內容，可以當作進階選讀。
-->

---

# 內建的規則不夠用的時候

身分證字號有固定的格式：**1 個大寫英文字母 + 1 個 1 或 2 + 8 個數字**。內建的規則裡沒有「身分證字號」這一條。

自己訂規則，分三步：

<v-clicks>

1. 做一個新的 Annotation：`@ValidIdNumber`（規則的名字）
2. 寫一個檢查用的類別：`IdNumberValidator`（實際怎麼檢查）
3. 把 `@ValidIdNumber` 標在欄位上，用法和內建的一樣

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 新增一個 <code>validation</code> 資料夾，把前兩個檔案放在裡面。這裡只檢查<b>格式</b>，不檢查最後一碼的驗算。
</div>

</v-click>

<!--
內建的規則不夠用的時候，可以自己訂。

我們用身分證字號當例子。它有固定的格式：一個大寫英文字母，接著是 1 或 2，再接八個數字。內建的規則裡沒有「身分證字號」這一條。

自己訂規則，分三步。

（下一步）第一步，做一個新的 Annotation，叫做 @ValidIdNumber。它是規則的名字。

（下一步）第二步，寫一個檢查用的類別，叫做 IdNumberValidator。實際怎麼檢查，寫在這裡。

（下一步）第三步，把 @ValidIdNumber 標在欄位上。用法和內建的規則完全一樣。

（下一步）請新增一個 validation 資料夾，把前兩個檔案放在裡面。另外說明一下，真正的身分證字號最後一碼有驗算的規則。我們這裡只檢查格式，不做驗算。
-->

---

# 第一步：@ValidIdNumber

```java {1-3|4|5|6-7}
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = IdNumberValidator.class)
public @interface ValidIdNumber {
    String message() default "身分證字號格式不正確";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

- `@Target`：這個 Annotation 可以標在**欄位**上
- `@Retention`：程式執行的時候還看得到它
- `@Constraint(validatedBy = …)`：**由哪一個類別負責檢查**。這是最重要的一行
- `message()`：預設的錯誤訊息
- 最後兩行是規定要有的固定寫法，照抄就可以

<!--
第一步，建立 Annotation。在 Eclipse 新增的時候，選 New → Annotation。

我們一路用了很多別人寫好的 Annotation，這是第一次自己做一個。寫法看起來有點陌生，不過大部分是固定的格式。

前三行是標在這個 Annotation 上面的設定。@Target 說它可以標在欄位上。@Retention 說程式執行的時候還看得到它，這樣框架才讀得到。第三行 @Constraint 是最重要的一行：它指定由哪一個類別負責檢查。這裡寫 IdNumberValidator，下一頁就會建立它。

（下一步）第四行，注意關鍵字是 @interface，這是宣告 Annotation 的寫法。

（下一步）message，預設的錯誤訊息。使用的時候沒有另外寫 message，就會用這一句。

（下一步）最後兩行是 Bean Validation 規定一定要有的固定寫法。我們用不到它們，照抄就可以。
-->

---

# 第二步：IdNumberValidator

```java {1-2|4-5|6-8|9}
public class IdNumberValidator
        implements ConstraintValidator<ValidIdNumber, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }
        return value.matches("^[A-Z][12]\\d{8}$");
    }
}
```

- `ConstraintValidator<ValidIdNumber, String>`：我負責 `@ValidIdNumber`，檢查的對象是文字
- `isValid()`：回傳 `true` 是通過，`false` 是沒過
- `null` 先放行，有沒有填交給 `@NotBlank` 去管
- `matches("…")`：檢查文字有沒有符合這個格式

<!--
第二步，建立檢查用的類別 IdNumberValidator。

前兩行，它實作 ConstraintValidator 這個介面。角括號裡放兩個東西：我負責的是哪一個 Annotation，還有檢查的對象是什麼型別。這裡是 @ValidIdNumber 和 String。

（下一步）要實作的方法只有一個，isValid。傳進來的 value 就是欄位的值。回傳 true 是通過，false 是沒過。

（下一步）如果是 null，先回傳 true 放行。這是慣例：有沒有填，交給 @NotBlank 去管。每一條規則只管一件事。

（下一步）最後一行是真正的檢查。matches 會檢查文字有沒有符合括號裡的格式。這一串就是正規表達式。它的意思是：開頭是一個大寫的 A 到 Z；接著是 1 或 2；接著是八個數字；然後結束。現在看不懂沒關係，知道它在描述格式就可以。
-->

---

# 第三步：標在欄位上

```java {2}
@NotBlank(message = "身分證字號不能空白")
@ValidIdNumber
private String idNumber;
```

測試 `POST /students`，`"idNumber": "A12"`：

```json
{ "errors": [ { "field": "idNumber", "message": "身分證字號格式不正確" } ] }
```

<v-clicks>

- `ValidationExceptionHandler` **完全不用改**，自訂的規則一樣會被它接手
- 其實這個例子用 `@Pattern` 也做得到。自訂的好處是：有名字、可以重複使用、可以寫更複雜的檢查

</v-clicks>

<!--
第三步，打開 CreateStudentRequest，在 idNumber 上面加 @ValidIdNumber。原本的 @NotBlank 留著。

重新啟動測試。身分證字號填 A12，回覆 400，訊息是「身分證字號格式不正確」。

（下一步）請注意，剛才寫的 ValidationExceptionHandler 完全不用改。自訂的規則沒過的時候，丟出的是同一種例外，一樣會被它接手。

（下一步）老實說，這個例子用內建的 @Pattern 也做得到。那為什麼要自訂？第一，它有名字，一看就知道在檢查什麼。第二，可以重複使用，很多個 DTO 都有身分證字號的時候，不用每次都抄那一串格式。第三，isValid 裡面可以寫任何程式，例如加上最後一碼的驗算。這是 @Pattern 做不到的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
# 動手練習

<!--
請大家自己做一次。
-->

---

# 練習：幫社團的申請表加上檢查

`CreateClubRequest` 現在沒有任何檢查。請加上：

<v-clicks>

- `name`：不能空白
- `fee`：一定要填，最小 0，最大 5000
- `advisorPhone`：不能空白，而且要是 `09` 開頭的十個數字（提示：`@Pattern(regexp = "^09\\d{8}$")`）

</v-clicks>

<v-click>

然後：

1. 在 `ClubController` 的 `createClub()` 加上 `@Valid`
2. 測試：`{"name": "", "fee": 9999, "advisorPhone": "123"}` 應該回覆 400，列出三個錯誤

</v-click>

<!--
練習題。上一章做的 CreateClubRequest，現在沒有任何檢查。請加上這些規則。

（下一步）社團名稱，不能空白。

（下一步）社費，一定要填，最小 0，最大 5000。

（下一步）指導老師的電話，不能空白，而且要是 09 開頭的十個數字。提示是用 @Pattern，格式已經寫在投影片上了。

（下一步）然後做兩件事。第一，在 ClubController 的 createClub 加上 @Valid。第二，測試。送出名稱是空字串、社費 9999、電話 123 的資料，應該回覆 400，並且列出三個錯誤。

請先暫停，自己做做看。
-->

---

# 練習：參考答案

```java
@Getter
@Setter
public class CreateClubRequest {
    @NotBlank(message = "社團名稱不能空白")
    private String name;

    @NotNull(message = "社費一定要填")
    @Min(value = 0, message = "社費不能小於 0")
    @Max(value = 5000, message = "社費不能超過 5000")
    private Integer fee;

    @NotBlank(message = "指導老師電話不能空白")
    @Pattern(regexp = "^09\\d{8}$", message = "電話要是 09 開頭的十個數字")
    private String advisorPhone;
}
```

```java
public ClubResponse createClub(@Valid @RequestBody CreateClubRequest req) { … }
```

<!--
參考答案。

上面是 CreateClubRequest。名稱用 @NotBlank。社費用 @NotNull 加上 @Min 和 @Max。電話用 @NotBlank 加上 @Pattern。

下面是 ClubController 的 createClub，在 @RequestBody 的前面加上 @Valid。

不需要另外寫錯誤處理。因為 ValidationExceptionHandler 是處理所有 Controller 的，社團的 API 自動就會用同一種格式回覆。這就是統一處理的好處。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="form,印在格子旁邊的規則=code,@NotBlank、@NotNull、@Min、@Max…|clerk,櫃台收件時當場檢查=code,@Valid（申請表）、@Validated（網址上的參數）|no,退件，沒有往後送=code,400 Bad Request，方法沒有執行|doc,統一格式的退件單=code,@RestControllerAdvice + @ExceptionHandler|you,學校自己訂的規則=code,自訂 Annotation + ConstraintValidator" />

<!--
我們用一張圖複習今天的內容。

（下一步）印在格子旁邊的規則，是 @NotBlank、@NotNull、@Min、@Max 這些 Annotation。

（下一步）櫃台收件時當場檢查，是 @Valid 和 @Validated。前者檢查申請表，後者讓網址上的參數也能檢查。

（下一步）退件、沒有往後送，是回覆 400，方法沒有執行。

（下一步）統一格式的退件單，是 @RestControllerAdvice 加上 @ExceptionHandler。

（下一步）學校自己訂的規則，是自訂的 Annotation 加上 ConstraintValidator。
-->

---

# 章節總結

<v-clicks>

- **Validation**：資料進來時先檢查，不合規定就回覆 400
- **規則**：標在 DTO 的欄位上。文字用 `@NotBlank`，數字用 `@NotNull` + `@Min` / `@Max`
- **`@Valid`**：加在 `@RequestBody` 前面，檢查才會發生
- **`@Validated`**：加在 Controller 類別上，才能檢查路徑和查詢參數
- **統一錯誤回應**：`@RestControllerAdvice` + `@ExceptionHandler`，寫一次全部適用
- **自訂規則**：Annotation 加上 `ConstraintValidator`

</v-clicks>

<!--
最後整理今天的重點。

（依序按下一步）Validation 是資料進來時先檢查，不合規定就回覆 400。規則標在 DTO 的欄位上，文字用 @NotBlank，數字用 @NotNull 加上 @Min 和 @Max。@Valid 加在 @RequestBody 前面，檢查才會發生。@Validated 加在 Controller 類別上，才能檢查路徑和查詢參數。統一錯誤回應用 @RestControllerAdvice 加上 @ExceptionHandler，寫一次全部適用。自訂規則是 Annotation 加上 ConstraintValidator。
-->

---

# 架構與實務單元：我們走過的路

<v-clicks>

- **人的分工**：Controller、Service、Dao 三層，和四條規則（第 35 章）
- **紙的分工**：PO、DTO、VO，以及 DAO（第 36 章）
- **從頭做一次**：新專案、分 package、完整的 CRUD（第 37 章）
- **辦事指南**：OpenAPI 和 Swagger UI（第 38 章）
- **收件檢查**：Validation 和統一的錯誤回應（第 39 章）

</v-clicks>

<v-click>

下一個單元是「進階功能」。第一站：怎麼讓伺服器記得「這個人剛才來過」。

</v-click>

<!--
這一章也是架構與實務單元的最後一章。我們回頭看一下走過的路。

（依序按下一步）第三十五章是人的分工：三層和四條規則。第三十六章是紙的分工：PO、DTO、VO，還有 DAO。第三十七章從頭做了一次：開新專案、分 package、寫出完整的 CRUD。第三十八章是辦事指南：OpenAPI 和 Swagger UI。今天是收件檢查：Validation 和統一的錯誤回應。

（最後一步）到這裡，你寫出來的 API 已經有一個正式專案該有的樣子了。下一個單元是進階功能。第一站要談的是：怎麼讓伺服器記得「這個人剛才來過」。
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
