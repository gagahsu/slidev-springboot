---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: OpenAPI 與 Swagger UI
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
    OpenAPI 與 Swagger UI
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「寫好 API，讓文件自己長出來」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，今天我們來聊一個非常實用的主題——OpenAPI。

我們花了好幾章學習怎麼寫 Spring Boot 的 API，但寫完之後有一個問題：前端工程師、測試人員、或新加入的同事，他們怎麼知道這些 API 長什麼樣子？能接受哪些參數？會回傳什麼資料？

如果靠人工整理文件，寫起來很花時間，而且程式改了、文件忘記更新，就會出現文件和程式碼對不上的情況。

今天學的 OpenAPI + springdoc-openapi，就是解決這個問題的工具——加幾行 Annotation，文件自動產生。
-->

---
layout: default
---

# Outline

- **什麼是 OpenAPI？** — API 文件的痛點、OpenAPI 規範、三者關係
- **加入 springdoc-openapi** — Gradle 依賴、啟動即可用的 Swagger UI
- **OpenAPI 常用 Annotation** — `@Tag` / `@Operation` / `@ApiResponse` / `@Parameter` / `@Schema`
- **自訂 API 資訊** — `OpenApiConfig` Bean、生產環境設定
- **練習題**

<!--
今天的學習路徑：

先了解為什麼需要 OpenAPI，以及它和 Swagger UI、springdoc-openapi 三者的關係。
然後加入依賴，親眼看到 Swagger UI 頁面出現。
再學幾個 Annotation，讓文件更豐富、更有說明。
最後看怎麼自訂 API 的標題和版本。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 什麼是 OpenAPI？

<!--
先從問題出發：API 文件的痛點是什麼？
-->

---

# API 文件的痛點

| 問題 | 說明 |
| --- | --- |
| 手寫文件費時 | 每新增一個 API 就要手動更新 Word 或 Postman Collection |
| 文件與程式碼脫鉤 | API 邏輯改了，文件忘記同步更新 |
| 前端難以測試 | 沒有統一的介面，必須靠 curl 或 Postman 手動測試 |
| 新人上手困難 | 沒有結構化文件，只能看程式碼猜 API 規格 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>痛點的根本原因：</b> 文件和程式碼是分開維護的，一旦其中一個更新，另一個就容易落後。
</div>

<!--
想像一下：你開發了二十幾支 API，然後前端同事問你「這支 API 需要傳哪些參數？回傳值的格式是什麼？」

你可能會說「去看 Controller 吧」，但前端看不懂 Java；或者你花一個小時整理成文件，下週程式改了、文件沒更新，就出問題了。

這就是 API 文件的現實困境：手動維護很痛苦，而且幾乎一定會出現版本不同步的問題。
-->

---

# 什麼是 OpenAPI？

| 概念 | 說明 |
| --- | --- |
| OpenAPI 規範 | 描述 RESTful API 的標準格式（JSON 或 YAML），由 Linux Foundation 維護 |
| 版本 | 目前主流是 OpenAPI 3.0，springdoc-openapi 2.x 實作此規範 |
| 優點 | 機器可讀——工具可自動讀取並產生互動式文件、Client SDK、Mock Server |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>OpenAPI vs Swagger：</b> Swagger 是 OpenAPI 規範的前身；現在「Swagger」常用來指 Swagger UI 這個視覺化工具，而非規範本身。
</div>

<!--
OpenAPI 的核心想法是：用一個標準格式來「描述」API。

就像建築師用規格圖紙描述一棟建築一樣，OpenAPI 用 JSON 或 YAML 描述「這支 API 的路徑是什麼、需要什麼參數、會回傳什麼」。

一旦有了這份規格文件，各種工具都可以讀它——Swagger UI 讀它來顯示互動式頁面，前端工具讀它來自動產生 API Client，測試工具讀它來驗證 API 行為。

所以 OpenAPI 的精髓是：讓 API 的規格可以被「機器讀懂」，而不只是給人看的文字說明。
-->

---

# OpenAPI、Swagger UI 與 springdoc 三者的關係

| 角色 | 工具 | 說明 |
| --- | --- | --- |
| 規範 | OpenAPI 3.0 | 描述 API 的標準格式（JSON / YAML） |
| 視覺化介面 | Swagger UI | 讀取 OpenAPI 規範，顯示互動式文件，可在瀏覽器直接測試 API |
| Spring Boot 整合 | springdoc-openapi | 掃描 `@RestController`，自動產生 OpenAPI 規範並嵌入 Swagger UI |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>實際流程：</b> 加入 springdoc-openapi 依賴 → 啟動 Spring Boot → 開啟瀏覽器 → Swagger UI 自動出現，不需要額外設定。
</div>

<!--
三者的關係可以這樣理解：

OpenAPI 3.0 是「標準格式」，就像 HTML 是網頁的標準格式一樣。
Swagger UI 是「瀏覽器」，它讀取 OpenAPI 格式並顯示出漂亮的介面。
springdoc-openapi 是「產生器」，它掃描我們的 Spring Boot Controller，自動幫我們寫出符合 OpenAPI 格式的規格文件。

三者合作的結果是：我們只要加一個依賴，API 文件就自動出現了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 加入 springdoc-openapi

<!--
理解了概念，直接來加依賴，看看效果。
-->

---

# 加入 Gradle 依賴

在 `build.gradle` 的 `dependencies` 中加入：

```groovy
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.17'
```

| 說明 | 詳情 |
| --- | --- |
| `springdoc-openapi-starter-webmvc-ui` | Spring Boot 3.x 使用此 artifact（v2.x 系列） |
| `2.8.17` | 目前最新穩定版，Spring Boot 3.x 需搭配 v2.x |
| 零設定啟動 | 加完依賴重新啟動，文件即自動出現 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>版本對應：</b> Spring Boot 2.x 用 <code>springdoc-openapi-ui</code>（v1.x）；Spring Boot 3.x 必須用 <code>springdoc-openapi-starter-webmvc-ui</code>（v2.x），兩者不能混用。
</div>

<!--
只需要在 build.gradle 加上這一行依賴，重新啟動 Spring Boot，Swagger UI 就會自動出現。

特別注意版本：Spring Boot 3.x 對應 springdoc-openapi v2.x，如果用 v1.x 的 artifact 名稱會找不到。

記住這個規律：Boot 3 → springdoc v2 → artifact 名稱要加 -starter-webmvc-ui。
-->

---

# 啟動即可存取 — 預設 URL

加入依賴後，啟動 Spring Boot，瀏覽器開啟：

| 功能 | URL | 說明 |
| --- | --- | --- |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` | 互動式 API 文件頁面 |
| OpenAPI JSON | `http://localhost:8080/v3/api-docs` | 機器可讀的 JSON 規格 |
| OpenAPI YAML | `http://localhost:8080/v3/api-docs.yaml` | YAML 格式的規格文件 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>不需要額外設定：</b> springdoc-openapi 自動掃描所有 <code>@RestController</code>，並列出所有 API 端點。
</div>

<!--
加完依賴啟動之後，打開瀏覽器，輸入 http://localhost:8080/swagger-ui/index.html，就會看到 Swagger UI 的介面。

上面會列出你所有 Controller 的 API，點開任何一個就能看到它需要哪些參數、會回傳什麼。

甚至可以直接在頁面上點「Try it out」，填入參數、點 Execute，就能直接發出請求、看到回應。不需要 Postman，瀏覽器裡就能測試所有 API。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## OpenAPI 常用 Annotation

<!--
預設的 Swagger UI 已經有基本資訊，但說明文字很少。加上這幾個 Annotation，文件就更完整了。
-->

---

# OpenAPI 核心 Annotation 總覽

| Annotation | 套用位置 | 用途 |
| --- | --- | --- |
| `@Tag` | Controller 類別 | 為整個 Controller 加上分組標籤和說明 |
| `@Operation` | 方法 | 描述單一 API 的功能摘要與詳細說明 |
| `@ApiResponse` | 方法 | 描述可能的 HTTP 回應狀態碼與說明 |
| `@Parameter` | 方法參數 | 描述路徑參數或查詢參數的用途與範例值 |
| `@Schema` | DTO 欄位 | 描述 Request / Response 物件的欄位說明與範例 |

<!--
這五個 Annotation 都來自 io.swagger.v3.oas.annotations 套件，springdoc-openapi 會讀取它們來產生更豐富的文件。

不加 Annotation 也能用，只是文件說明比較少；加了之後，文件品質就接近正式專案的水準了。

接下來一個一個看用法。
-->

---

# @Tag — 為 Controller 加上分組標籤

| 屬性 | 說明 |
| --- | --- |
| `name` | 標籤名稱，Swagger UI 依此分組顯示 |
| `description` | 對這個 Controller 群組的整體說明 |

在 `StudentController` 類別上加 `@Tag`：

```java
@Tag(name = "Student", description = "學生管理 API")
@RestController
@RequestMapping("/students")
public class StudentController { ... }
```

<!--
@Tag 加在 Controller 類別上，把這個 Controller 的所有 API 歸到同一個「群組」。

Swagger UI 介面上，左側會出現「Student」這個群組，點開後才能看到這個 Controller 的所有方法。

如果有多個 Controller，每個加上不同的 @Tag，Swagger UI 就會分開顯示，很清楚。
-->

---

# @Operation — 描述單一 API 方法

| 屬性 | 說明 |
| --- | --- |
| `summary` | 一句話說明，顯示在 Swagger UI 的操作標題列表 |
| `description` | 詳細說明文字，展開後才看到 |

```java
@Operation(summary = "查詢所有學生", description = "回傳資料庫中所有學生資料")
@GetMapping
public List<StudentResponse> getAllStudents() {
    return studentService.getAllStudents();
}
```

<!--
@Operation 加在方法上，讓每支 API 都有自己的說明。

summary 是短說明，直接顯示在 Swagger UI 的列表上；description 是詳細說明，要點開才看到。

一般至少填 summary，讓人一眼就知道這支 API 的目的，溝通成本大幅降低。
-->

---

# @ApiResponse — 描述回應狀態碼

| 屬性 | 說明 |
| --- | --- |
| `responseCode` | HTTP 狀態碼，字串格式（"200"、"404"、"500"） |
| `description` | 說明此狀態碼代表的意義 |

```java
@ApiResponse(responseCode = "200", description = "查詢成功")
@ApiResponse(responseCode = "404", description = "找不到指定學生")
@GetMapping("/{id}")
public ResponseEntity<StudentResponse> getById(@PathVariable("id") Integer id) { ... }
```

<!--
@ApiResponse 可以重複疊加，一次描述多個可能的 HTTP 回應狀態碼。

在 Swagger UI 上，每支 API 都會顯示它可能的回應碼和對應說明，方便前端同事知道要處理哪些情況。

例如 200 代表成功，404 代表找不到，500 代表伺服器錯誤，把這些都寫清楚，API 使用者就不需要靠猜。
-->

---

# @Parameter — 描述路徑與查詢參數

| 屬性 | 說明 |
| --- | --- |
| `description` | 參數的用途說明 |
| `example` | 範例值，顯示在 Swagger UI 的輸入欄位 |

```java
@GetMapping("/{id}")
public ResponseEntity<StudentResponse> getById(
    @Parameter(description = "學生 ID", example = "1")
    @PathVariable("id") Integer id
) { ... }
```

<!--
@Parameter 加在方法的參數前面，描述這個參數的用途和範例值。

在 Swagger UI 的「Try it out」模式下，example 的值會預填到輸入框，讓使用者測試時有個參考起點。

@PathVariable 和 @RequestParam 的參數都可以加 @Parameter 來說明。
-->

---

# @Schema — 描述 DTO 欄位

在 Request / Response DTO 的欄位上加入說明與範例：

```java
public class CreateStudentRequest {
    @Schema(description = "學生姓名", example = "王小明")
    private String name;

    @Schema(description = "登入密碼，至少 6 個字元")
    private String password;

    @Schema(description = "考試分數，需在 0–100 之間", example = "85")
    private Integer score;
    // Getter 和 Setter（省略）
}
```

<!--
@Schema 加在 DTO 的欄位上，讓 Swagger UI 顯示每個欄位的說明和範例值。

這樣前端工程師在 Swagger UI 看 Request Body 的格式時，每個欄位旁邊都會有說明，不需要再開另一份文件對照。

注意 password 欄位刻意不填 example——密碼欄位不適合放範例值，避免使用者誤以為那是有效的密碼格式。這是小地方的安全意識。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## 自訂 API 資訊

<!--
預設的 Swagger UI 標題是「OpenAPI definition」，版本也是空的。可以用 OpenApiConfig 自訂。
-->

---

# OpenApiConfig Bean — 自訂 API 標題與版本

```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("學生管理系統 API")
                .version("1.0.0")
                .description("Spring Boot 練習用 API 文件"));
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>import 路徑：</b> <code>OpenAPI</code> → <code>io.swagger.v3.oas.models.OpenAPI</code>；<code>Info</code> → <code>io.swagger.v3.oas.models.info.Info</code>（注意是 <code>models</code> 套件，不是 <code>annotations</code>）
</div>

<!--
建立一個 @Configuration 類別，回傳一個 OpenAPI Bean，就可以自訂 Swagger UI 頁面頂部的 API 名稱、版本號和說明文字。

這個設定適合放在正式專案中，讓 API 文件有清楚的識別資訊。

import 路徑有兩組——Annotation 用 io.swagger.v3.oas.annotations，Bean 的類別用 io.swagger.v3.oas.models，容易搞混，IDE 自動 import 時要注意選對。
-->

---

# application.properties — 生產環境設定

| 設定 | 說明 |
| --- | --- |
| `springdoc.swagger-ui.enabled` | 是否開啟 Swagger UI 頁面（預設 `true`） |
| `springdoc.api-docs.enabled` | 是否開啟 `/v3/api-docs` 端點（預設 `true`） |

```properties
# 生產環境建議關閉，避免暴露 API 結構
springdoc.swagger-ui.enabled=false
springdoc.api-docs.enabled=false
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>安全提醒：</b> Swagger UI 會公開所有 API 端點的詳細資訊。生產環境若不需要對外開放文件，建議設成 <code>false</code>。
</div>

<!--
開發環境開著 Swagger UI 很方便，但部署到生產環境時要注意——Swagger UI 會把所有 API 的路徑、參數、回應格式全部列出來，如果對外公開，等於把整個 API 結構暴露給任何人看。

實務上的做法是：開發環境 enabled=true，生產環境 enabled=false，或者搭配 Spring Profile 控制，讓不同環境有不同的設定。

這不是必要的設定，但養成習慣，對安全性有幫助。
-->

---
layout: default
---

# 練習 1：幫 StudentController 加上 API 文件
### 任務說明

替 `StudentController` 加上文件說明：

1. 在 `StudentController` 類別上加 `@Tag(name = "Student", description = "學生管理 API")`
2. 在 `createStudent()` 方法上加 `@Operation(summary = "新增學生")`
3. 在 `getStudentById()` 方法上加 `@ApiResponse(responseCode = "200", description = "查詢成功")`
4. 啟動 Spring Boot，開啟 `http://localhost:8080/swagger-ui/index.html` 查看結果

<!--
這個練習讓大家在熟悉的 StudentController 上加文件，可以馬上看到 Swagger UI 的變化。

重點是要有「所見即所得」的感受——加上 Annotation 後重新整理 Swagger UI，說明文字就出現了。
-->

---
layout: default
---

# 練習 1：解題提示
### 提示說明

1. `@Tag` 加在 class 層級，`@Operation` 加在方法層級，位置不要放錯
2. import 路徑：`io.swagger.v3.oas.annotations.tags.Tag`、`io.swagger.v3.oas.annotations.Operation`
3. 啟動後如果找不到 Swagger UI，確認 URL 是 `http://localhost:8080/swagger-ui/index.html`（注意是 `index.html`，不是舊版的 `swagger-ui.html`）
4. 頁面頂部顯示「OpenAPI definition」是正常的——可以建立 `OpenApiConfig` Bean 改掉

<!--
Annotation 的 import 是最容易出錯的地方——IDE 有時候會提示多個同名的 class，要確認選的是 io.swagger.v3.oas.annotations 開頭的。

Swagger UI URL 在 Spring Boot 3.x + springdoc 2.x 是 /swagger-ui/index.html，不是舊版的 /swagger-ui.html（舊版 URL 會自動 redirect，但記住正確路徑比較保險）。
-->

---
layout: default
---

# 練習 2：替 DTO 加上 @Schema 說明
### 任務說明

為 `CreateStudentRequest` 欄位加上 `@Schema` 說明：

1. 在 `name` 欄位加上 `@Schema(description = "學生姓名", example = "王小明")`
2. 在 `score` 欄位加上 `@Schema(description = "考試分數，需在 0–100 之間", example = "85")`
3. 建立 `OpenApiConfig` Bean，自訂 API 標題為「學生管理系統 API」
4. 在 Swagger UI 的 Request Body 區塊確認欄位說明出現

<!--
這個練習讓大家看到 @Schema 的效果——在 Swagger UI 點開 POST /students 的 Request Body，每個欄位旁邊都會有說明文字和範例值。

OpenApiConfig 讓大家練習建立一個 @Configuration Bean，並且看到 Swagger UI 頂部的標題改變了。
-->

---
layout: default
---

# 練習 2：解題提示
### 提示說明

1. `@Schema` 的 import：`io.swagger.v3.oas.annotations.media.Schema`
2. `OpenApiConfig` 的 import：`io.swagger.v3.oas.models.OpenAPI` 和 `io.swagger.v3.oas.models.info.Info`（注意是 `models`，不是 `annotations`）
3. `OpenApiConfig` 建立後，重新啟動 Spring Boot，Swagger UI 頂部標題就會更新
4. `password` 欄位可以加 `@Schema(description = "登入密碼，至少 6 個字元")`，但刻意不填 example

<!--
兩組 import 的套件名不同，第一次使用時容易搞混：

Annotation（加在程式碼上）→ io.swagger.v3.oas.annotations.*
Model Bean（OpenApiConfig 裡的類別）→ io.swagger.v3.oas.models.*

記住這個規律，之後就不容易選錯。

password 的 example 刻意不填，提醒大家：密碼欄位不適合放範例值，安全意識從細節養成。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| OpenAPI 是規範 | 描述 RESTful API 的標準格式，機器可讀 |
| springdoc-openapi 2.x | Spring Boot 3.x 整合工具，加一行依賴即啟用 |
| Swagger UI URL | `http://localhost:8080/swagger-ui/index.html` |
| `@Tag` / `@Operation` | 為 Controller 和方法加上說明 |
| `@ApiResponse` / `@Parameter` / `@Schema` | 描述回應、參數、DTO 欄位 |
| 生產環境 | 建議將 `springdoc.swagger-ui.enabled` 設為 `false` |

<!--
今天的重點：

第一，OpenAPI 是標準規範，Swagger UI 是視覺化工具，springdoc-openapi 是 Spring Boot 的整合層。

第二，只需要加一個 Gradle 依賴，就能在 /swagger-ui/index.html 看到自動產生的 API 文件。

第三，@Tag、@Operation、@ApiResponse、@Parameter、@Schema 五個 Annotation，讓文件說明更完整。

第四，生產環境記得考慮是否要關閉 Swagger UI，避免暴露 API 結構。

從今天起，API 文件就不需要手動維護了——程式碼就是文件。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
