---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: OpenAPI 與 Swagger UI
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
    OpenAPI 與 Swagger UI
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「寫好 API，讓文件自己長出來」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第四十章。

上一章我們做出了一套完整的學生管理 API。今天不寫新的功能，而是解決一個合作上的問題：別人要怎麼知道我們的 API 怎麼用？

今天繼續使用上一章的 school 專案。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **為什麼需要 API 文件？** 手寫的文件又有什麼問題？
- **OpenAPI、Swagger UI、springdoc 是什麼？** 加一行依賴，文件自己長出來
- **怎麼把文件寫得更清楚？** 五個補充說明用的 Annotation

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，為什麼需要 API 文件。手寫的文件又有什麼問題。

（下一步）第二，OpenAPI、Swagger UI、springdoc 這三個名字各是什麼。今天最神奇的地方是：加一行依賴，文件就自己長出來。

（下一步）第三，怎麼把文件寫得更清楚。我們會學五個補充說明用的 Annotation。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 櫃台前的辦事指南

<!--
先看教務處。
-->

---

# 每個人都來問同樣的問題

教務處的櫃台，每天被問一樣的事：

<v-clicks>

- 「這裡可以辦哪些事？」
- 「辦入學要帶什麼？要填哪些格子？」
- 「辦完會拿到什麼？」

</v-clicks>

<v-click>

所以教務處在櫃台前貼了一張**辦事指南**。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 我們的 API 也一樣。前端的同事要知道：有哪些網址、用什麼方法、要帶什麼參數、會回傳什麼。寫下這些事的東西，叫做 <b>API 文件</b>。
</div>

</v-click>

<!--
教務處的櫃台，每天被問一樣的事。

（下一步）這裡可以辦哪些事？

（下一步）辦入學要帶什麼？要填哪些格子？

（下一步）辦完會拿到什麼？

（下一步）一直回答同樣的問題太沒效率。所以教務處在櫃台前貼了一張辦事指南，把這些事寫清楚。

我們的 API 也一樣。使用 API 的人，通常是前端的同事。他要知道：有哪些網址、用什麼方法、要帶什麼參數、會回傳什麼。寫下這些事的東西，叫做 API 文件。

到目前為止，我們的 API 只有自己在用，所以沒有感覺。只要有第二個人要用，就需要文件。
-->

---

# 手寫的指南，很快就過期

<v-clicks>

- 每多一項業務，就要記得去改指南。**很花時間**
- 規定改了，指南忘了改。**照著指南辦，反而被退件**
- 指南只能看，不能試。要試還是得去排隊

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 根本的原因：<b>指南和實際的業務是分開維護的</b>。只要有一邊改了、另一邊沒跟上，指南就是錯的。錯的文件比沒有文件更糟。
</div>

</v-click>

<!--
一開始，指南是職員自己用手寫的。很快就出問題了。

（下一步）每多一項業務，就要記得去改指南。很花時間，而且沒有人喜歡做。

（下一步）規定改了，指南忘了改。同學照著指南準備，反而被退件。

（下一步）指南只能看，不能試。想知道實際辦起來怎麼樣，還是得去排隊。

（下一步）根本的原因是：指南和實際的業務是分開維護的。只要有一邊改了、另一邊沒跟上，指南就是錯的。錯的文件比沒有文件更糟，因為大家會相信它。

對應到程式：用 Word 或是記事本寫 API 文件，程式改了，文件常常忘記改。
-->

---

# 讓指南自己長出來

<Pairs left="手寫的指南" right="自動產生的指南" sign="vs" rows="you,職員另外花時間寫=ok,直接看櫃台實際在辦什麼，自動整理|no,規定改了，指南可能忘了改=ok,櫃台一改，指南跟著變|doc,只能看=ok,可以直接在指南上試辦" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 做法：請一位助手，<b>直接讀我們的 Controller</b>，自動整理出文件。程式就是文件的來源，兩邊不會對不起來。
</div>

</v-click>

<!--
比較好的做法，是讓指南自己長出來。

（下一步）手寫的指南，要職員另外花時間寫。自動產生的指南，是直接看櫃台實際在辦什麼，自動整理出來。

（下一步）手寫的，規定改了，指南可能忘了改。自動的，櫃台一改，指南跟著變。

（下一步）手寫的只能看。自動的那一種，還可以直接在指南上試辦。

（下一步）對應到程式的做法是：請一位助手，直接讀我們的 Controller，自動整理出文件。程式就是文件的來源，兩邊不會對不起來。
-->

---

# 三個名字

<Pairs left="教務處" right="程式" rows="form,全國統一的指南格式=code,OpenAPI：描述 API 的標準格式|shop,貼在牆上、可以直接試辦的指南=browser,Swagger UI：把文件顯示成網頁|staff,自動讀櫃台、寫出指南的助手=code,springdoc-openapi：Spring Boot 用的套件" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 你也會聽到有人說「Swagger 文件」。Swagger 是 OpenAPI 以前的名字，現在大多用來指 Swagger UI 這個網頁。
</div>

</v-click>

<!--
這裡會出現三個名字，我們一次分清楚。

（下一步）第一個，OpenAPI。它是一種描述 API 的標準格式。就像全國統一的指南格式，每一間學校都照同樣的欄位寫。因為格式統一，所以各種工具都讀得懂。

（下一步）第二個，Swagger UI。它是一個網頁，把 OpenAPI 格式的文件顯示得漂漂亮亮，而且可以直接在上面發請求。就像貼在牆上、可以直接試辦的指南。

（下一步）第三個，springdoc-openapi。它是 Spring Boot 用的套件，就是那位自動讀櫃台、寫出指南的助手。它會讀我們的 Controller，產生 OpenAPI 格式的文件，並且把 Swagger UI 一起帶進來。

（下一步）你也會聽到有人說「Swagger 文件」。Swagger 是 OpenAPI 以前的名字。現在大多用來指 Swagger UI 這個網頁。聽到的時候，知道是在講 API 文件就可以了。
-->

---

# 想一想

<Poll question="手寫 API 文件，最根本的問題是什麼？" options="Word 太難用|文件和程式分開維護，容易對不起來|前端的同事不喜歡看文件|文件一定要用英文寫" answer="2" />

<!--
來想一題。

手寫 API 文件，最根本的問題是什麼？

（等大家作答）

（下一步）答案是：文件和程式分開維護，容易對不起來。

所以解決的方向是，讓文件直接從程式產生。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 加一行，文件就出現

<!--
實際加進專案。
-->

---

# 加入依賴

在 `build.gradle` 的 `dependencies` 裡加一行：

```groovy
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.3'
```

<v-clicks>

- 這個套件不是 Spring 官方的，所以要自己寫版本號
- `3.x` 搭配 Spring Boot 4；如果你是 Spring Boot 3，請用 `2.x`（例如 `2.8.13`）
- 加完之後：專案按右鍵 → **Gradle** → **Refresh Gradle Project**，再重新啟動

</v-clicks>

<!--
打開 build.gradle，在 dependencies 裡加這一行。

（下一步）這個套件不是 Spring 官方的，所以要自己寫版本號。Spring 官方的套件，Spring Boot 會幫我們選好版本；其他人做的套件，就要自己指定。

（下一步）版本要和 Spring Boot 對起來。3 開頭的版本搭配 Spring Boot 4。如果你的專案是 Spring Boot 3，請用 2 開頭的版本。版本不對，啟動的時候會出錯。

（下一步）加完之後，在專案上按右鍵，選 Gradle，再選 Refresh Gradle Project。然後重新啟動 Spring Boot。

就這樣，不用寫任何程式，也不用加任何設定。
-->

---

# 打開看看

啟動之後，用瀏覽器打開：

<v-clicks>

- `http://localhost:8080/swagger-ui/index.html` → **Swagger UI**，給人看的文件網頁
- `http://localhost:8080/v3/api-docs` → OpenAPI 格式的文件（JSON），給工具讀的

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 上一章寫的五支學生 API 和三支社團 API，全部已經列在上面了。springdoc 會自動找出所有的 <code>@RestController</code>。
</div>

</v-click>

<!--
啟動之後，用瀏覽器打開兩個網址。

（下一步）第一個，localhost:8080/swagger-ui/index.html。這就是 Swagger UI，給人看的文件網頁。

（下一步）第二個，localhost:8080/v3/api-docs。這是 OpenAPI 格式的文件本體，是一大段 JSON。它是給工具讀的，我們平常不會直接看它。Swagger UI 顯示的內容，就是從這裡來的。

（下一步）打開 Swagger UI，你會看到上一章寫的五支學生 API，還有練習做的三支社團 API，全部已經列在上面了。我們什麼都沒寫。springdoc 會自動找出所有的 @RestController，把裡面的每一個方法整理出來。
-->

---

# 在 Swagger UI 上直接試

<v-clicks>

1. 點開 `POST /students` 那一列
2. 按右邊的 **Try it out**
3. 在 Request body 填入 JSON
4. 按 **Execute**
5. 下面的 **Responses** 會顯示狀態碼和回傳的內容

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 效果和 Postman 一樣，但是不用自己輸入網址、選方法。參數的格子、JSON 的樣子，頁面上都準備好了。
</div>

</v-click>

<!--
Swagger UI 不只可以看，還可以直接試。

（下一步）第一步，點開 POST /students 那一列。

（下一步）第二步，按右邊的 Try it out。

（下一步）第三步，在 Request body 的格子裡填入 JSON。它已經幫你放好一個範本，有 name、idNumber、score 三個欄位，改成你要的值就可以。

（下一步）第四步，按 Execute，送出請求。

（下一步）第五步，往下看 Responses，會顯示狀態碼和回傳的內容。

（下一步）效果和 Postman 一樣。但是不用自己輸入網址、不用選方法。參數的格子、JSON 的樣子，頁面上都準備好了。前端的同事打開這一頁，就可以自己試每一支 API。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 把指南寫得更清楚

<!--
自動產生的文件已經可以用了。不過它只知道網址和欄位的名字，不知道每個東西是什麼意思。
-->

---

# 五個補充說明用的 Annotation

<Pairs left="要說明的對象" right="Annotation" rows="clerk,整個 Controller：這個櫃台辦哪一類的事=code,@Tag|doc,一個方法：這支 API 做什麼=code,@Operation|ok,一個方法：可能回覆哪些狀態碼=code,@ApiResponse|what,一個參數：這個參數是什麼=code,@Parameter|form,DTO 的一個欄位：這一格填什麼=code,@Schema" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 它們<b>完全不影響程式的行為</b>，只會改變文件上顯示的文字。import 的時候，請選 <code>io.swagger.v3.oas.annotations</code> 開頭的。
</div>

</v-click>

<!--
springdoc 提供了一組 Annotation，讓我們補上說明。常用的有五個，差別在於說明的對象不同。

（下一步）@Tag，說明整個 Controller：這個櫃台辦哪一類的事。

（下一步）@Operation，說明一個方法：這支 API 做什麼。

（下一步）@ApiResponse，也是寫在方法上，說明可能回覆哪些狀態碼。

（下一步）@Parameter，說明一個參數是什麼。

（下一步）@Schema，說明 DTO 的一個欄位：這一格要填什麼。

（下一步）這五個 Annotation 完全不影響程式的行為，只會改變文件上顯示的文字。另外，import 的時候請注意，要選 io.swagger.v3.oas.annotations 開頭的。有些名字在別的套件裡也有，選錯會沒有效果。

接下來一個一個加到上一章的程式上。
-->

---

# @Tag：幫 Controller 取名字

```java {1}
@Tag(name = "學生管理", description = "新增、查詢、修改、刪除學生資料")
@RestController
public class StudentController {
    // …
}
```

<v-clicks>

- `name`：分類的名稱。Swagger UI 會用它把 API 分組
- `description`：這一組 API 的說明
- 沒加的時候，顯示的是 `student-controller`

</v-clicks>

<!--
第一個，@Tag。加在 Controller 類別的上面。

（下一步）name 是分類的名稱。Swagger UI 會用它把 API 分組，同一個 Controller 的 API 會放在一起。

（下一步）description 是這一組 API 的說明。

（下一步）沒有加 @Tag 的時候，分組的名稱是 springdoc 用類別名稱自動取的，叫做 student-controller。加了之後，就會顯示「學生管理」，後面跟著說明。

加完重新啟動，重新整理 Swagger UI，就可以看到變化。
-->

---

# @Operation：說明一支 API

```java {1}
@Operation(summary = "查詢所有學生", description = "回傳所有學生的成績單，不含身分證字號")
@GetMapping("/students")
public List<StudentResponse> getAllStudents() {
    return studentService.getAllStudents();
}
```

<v-clicks>

- `summary`：一句話的標題，顯示在列表上
- `description`：比較詳細的說明，點開之後才看得到

</v-clicks>

<!--
第二個，@Operation。加在方法的上面。

（下一步）summary 是一句話的標題。它會顯示在列表上，網址的右邊。

（下一步）description 是比較詳細的說明，要把那一列點開之後才看得到。

summary 建議每一支 API 都寫，這樣整個列表掃過去，就知道每一支在做什麼。
-->

---

# @ApiResponse 和 @Parameter

```java {2-3|6}
@Operation(summary = "用編號查詢一位學生")
@ApiResponse(responseCode = "200", description = "查詢成功")
@ApiResponse(responseCode = "404", description = "沒有這位學生")
@GetMapping("/students/{id}")
public ResponseEntity<StudentResponse> getStudentById(
        @Parameter(description = "學生的編號", example = "1")
        @PathVariable("id") Integer id) {
    // …
}
```

- `@ApiResponse`：一個狀態碼寫一個。`responseCode` 是**文字**，要加雙引號
- `@Parameter`：寫在參數的前面。`example` 是範例值，會自動填進 Swagger UI 的格子

<!--
第三和第四個，一起看。我們加在「用編號查詢」這支 API 上。

第二、三行是 @ApiResponse。這支 API 可能回覆兩種狀態碼：200 查詢成功，404 沒有這位學生。一個狀態碼寫一個 @ApiResponse。要注意 responseCode 是文字，所以數字的外面要加雙引號。

如果沒有寫，文件上只會出現 200。前端的同事不會知道這支 API 可能回覆 404。

（下一步）第六行是 @Parameter。它寫在參數的前面，和 @PathVariable 放在一起。description 是這個參數的說明。example 是範例值，會自動填進 Swagger UI 的輸入格子裡，試的時候很方便。
-->

---

# @Schema：說明 DTO 的欄位

```java {4,7,10}
@Getter
@Setter
public class CreateStudentRequest {
    @Schema(description = "學生姓名", example = "Judy")
    private String name;

    @Schema(description = "身分證字號：1 個英文字母加 9 個數字", example = "A223456789")
    private String idNumber;

    @Schema(description = "成績，0 到 100 之間", example = "85")
    private Integer score;
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 加了之後，Swagger UI 裡 Request body 的範本會變成 <code>{"name": "Judy", "idNumber": "A223456789", "score": 85}</code>，可以直接送出。
</div>

</v-click>

<!--
第五個，@Schema。它不是加在 Controller 上，而是加在 DTO 的欄位上。

每個欄位上面加一行。description 說明這一格是什麼，example 給一個範例值。

（下一步）加了之後有兩個效果。第一，文件最下面的 Schemas 區塊，會顯示每個欄位的說明。第二，Swagger UI 裡 Request body 的範本，會從原本沒有意義的 "string" 和 0，變成我們給的範例值，可以直接送出。

StudentResponse 的欄位也可以用同樣的方式加上說明。
-->

---

# 想一想

<Poll question="想讓 Swagger UI 的列表上，每支 API 旁邊顯示一句標題，要用哪一個？" options="@Tag|@Operation 的 summary|@Schema|@Parameter" answer="2" />

<!--
確認一下。

想讓 Swagger UI 的列表上，每支 API 旁邊顯示一句標題，要用哪一個？

（等大家作答）

（下一步）答案是 @Operation 的 summary。

@Tag 是說明整個 Controller。@Schema 是說明 DTO 的欄位。@Parameter 是說明參數。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 文件的標題，以及上線前的提醒

<!--
最後兩件事。
-->

---

# 自訂文件的標題

新增一個 `config` 資料夾，建立 `OpenApiConfig`：

```java {1-2|4-5|6-10|all}
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("教務處學生管理 API")
                .version("1.0.0")
                .description("Spring Boot 課程的練習專案"));
    }
}
```

- `@Configuration`：這是一個放設定的類別
- `@Bean`：這個方法回傳的物件，請 Spring 收下來當成 Bean。springdoc 會來找它
- import 請選 `io.swagger.v3.oas.models` 開頭的 `OpenAPI` 和 `Info`

<!--
Swagger UI 最上面的標題，預設是 OpenAPI definition。我們可以換成自己的。

在 com.example.school 下面新增一個 config 資料夾，專門放設定用的類別。在裡面建立 OpenApiConfig。

（下一步）類別上面加 @Configuration，意思是：這是一個放設定的類別。

（下一步）方法上面加 @Bean。這是一個新的寫法。以前我們是在類別上面加 @Component 這一類的標記，請 Spring 幫我們建立 Bean。但是 OpenAPI 這個類別是別人寫好的，我們沒辦法在它上面加標記。所以換一種方式：自己寫一個方法把物件建立好，加上 @Bean，請 Spring 把這個方法回傳的物件收下來當成 Bean。springdoc 啟動的時候會來找這個 Bean，照它的內容顯示。

（下一步）方法裡建立一個 OpenAPI 物件，設定標題、版本、說明。這種一個點接一個點的寫法，是連續呼叫設定的方法，一次設定好幾樣。

（下一步）import 的時候要注意，OpenAPI 和 Info 這兩個類別，請選 io.swagger.v3.oas.models 開頭的。不是剛才 annotations 那一個。

重新啟動之後，Swagger UI 最上面就會顯示我們的標題和說明。
-->

---

# 上線之前：把指南收起來

<v-clicks>

- 貼在櫃台的指南，是給**自己人**看的
- 如果整份貼到校門口，路過的人都知道教務處有哪些業務、每一格怎麼填
- 想動歪腦筋的人，等於拿到一張地圖

</v-clicks>

<v-click>

```properties
springdoc.swagger-ui.enabled=false
springdoc.api-docs.enabled=false
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 正式上線的環境，如果文件不需要對外公開，建議在 <code>application.properties</code> 加這兩行把它關掉。<b>開發的時候不要加</b>。
</div>

</v-click>

<!--
最後是一個提醒。

（下一步）貼在櫃台的指南，是給自己人看的。

（下一步）如果整份貼到校門口，路過的人都知道教務處有哪些業務、每一格怎麼填。

（下一步）想動歪腦筋的人，等於拿到一張地圖。

（下一步）Swagger UI 會把所有 API 的網址、參數、格式全部列出來。所以正式上線的環境，如果文件不需要對外公開，建議在 application.properties 加這兩行，把 Swagger UI 和 api-docs 都關掉。

開發的時候不要加，不然自己也看不到了。現在只要知道有這個設定就可以。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 動手練習

<!--
請大家自己做一次。
-->

---

# 練習：幫社團 API 補上說明

替上一章練習的 `ClubController` 和 DTO 加上文件說明：

1. `ClubController` 加 `@Tag`：名稱「社團管理」
2. 三個方法各加 `@Operation`，寫上 `summary`
3. `deleteClub()` 的參數加 `@Parameter`，說明是「社團的編號」，範例值 `1`
4. `CreateClubRequest` 的三個欄位各加 `@Schema`，寫上說明和範例值
5. 重新啟動，打開 Swagger UI，用 **Try it out** 新增一個社團

<!--
練習題。請替上一章練習做的 ClubController 和 DTO，加上文件說明。

第一，ClubController 加 @Tag，名稱是「社團管理」。

第二，三個方法各加 @Operation，寫上 summary。

第三，deleteClub 的參數加 @Parameter，說明是「社團的編號」，範例值是 1。

第四，CreateClubRequest 的三個欄位各加 @Schema，寫上說明和範例值。

第五，重新啟動，打開 Swagger UI。這次不用 Postman，直接用 Try it out 新增一個社團。

請先暫停，自己做做看。
-->

---

# 練習：參考答案

```java
@Tag(name = "社團管理", description = "查詢、新增、刪除社團")
@RestController
public class ClubController {
    @Operation(summary = "查詢所有社團")
    @GetMapping("/clubs")
    public List<ClubResponse> getAllClubs() { … }

    @Operation(summary = "新增社團")
    @PostMapping("/clubs")
    public ClubResponse createClub(@RequestBody CreateClubRequest req) { … }

    @Operation(summary = "刪除社團")
    @DeleteMapping("/clubs/{id}")
    public void deleteClub(
            @Parameter(description = "社團的編號", example = "1")
            @PathVariable("id") Integer id) { … }
}
```

```java
@Schema(description = "社團名稱", example = "攝影社")
private String name;
```

<!--
參考答案。

上面是 ClubController。類別上面加 @Tag。三個方法各加一個 @Operation。deleteClub 的參數前面加 @Parameter。方法的內容都沒有變，投影片上省略了。

下面是 CreateClubRequest 其中一個欄位的寫法。另外兩個欄位 fee 和 advisorPhone 也是同樣的方式。

做完之後打開 Swagger UI，應該會看到「社團管理」這一組，每支 API 旁邊都有標題。點開新增社團，按 Try it out，範本裡已經是你給的範例值。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="doc,辦事指南=code,API 文件|form,全國統一的指南格式=code,OpenAPI|shop,貼在牆上、可以試辦的指南=browser,Swagger UI（/swagger-ui/index.html）|staff,自動寫指南的助手=code,springdoc-openapi|you,在指南上補幾句說明=code,@Tag、@Operation、@ApiResponse、@Parameter、@Schema|key,指南不要貼到校門口=code,上線時關閉 springdoc" />

<!--
我們用一張圖複習今天的內容。

（下一步）辦事指南，是 API 文件。

（下一步）全國統一的指南格式，是 OpenAPI。

（下一步）貼在牆上、可以試辦的指南，是 Swagger UI。

（下一步）自動寫指南的助手，是 springdoc-openapi。

（下一步）在指南上補幾句說明，是那五個 Annotation。

（下一步）指南不要貼到校門口，是上線時把 springdoc 關閉。
-->

---

# 章節總結

<v-clicks>

- **API 文件**：告訴使用的人，有哪些 API、怎麼用
- **OpenAPI** 是格式；**Swagger UI** 是網頁；**springdoc-openapi** 是自動產生文件的套件
- **加一行依賴**，打開 `/swagger-ui/index.html` 就有文件，還能直接試
- **補充說明**：`@Tag`（Controller）、`@Operation`、`@ApiResponse`（方法）、`@Parameter`（參數）、`@Schema`（DTO 欄位）
- **上線前**：不需要公開的話，用設定把文件關掉

</v-clicks>

<v-click>

下一章：同學亂填申請表怎麼辦？讓櫃台在收件的時候就檢查。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）API 文件告訴使用的人，有哪些 API、怎麼用。OpenAPI 是格式，Swagger UI 是網頁，springdoc-openapi 是自動產生文件的套件。加一行依賴，打開 Swagger UI 的網址就有文件，還能直接試。補充說明用五個 Annotation。上線前，不需要公開的話，用設定把文件關掉。

（最後一步）還記得上一章，成績填 200 會得到 500 嗎？下一章就來解決它：讓櫃台在收件的時候就檢查申請表。
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
