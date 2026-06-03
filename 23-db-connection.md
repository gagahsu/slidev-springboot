---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 資料庫連線設定、Eclipse 資料庫管理工具介紹
routeAlias: ch23
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
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    資料庫連線設定<br>Eclipse 資料庫管理工具介紹
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓 Spring Boot 和 MySQL 建立連線，開始操作資料」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，上一章我們學了 Spring JDBC 的概念，知道它是 Spring Boot 和資料庫之間的橋樑。

今天要動手設定——讓 Spring Boot 實際連接到 MySQL 資料庫。

有兩件事要做：第一，在程式碼中設定連線資訊；第二，在 Eclipse 裡安裝資料庫管理工具，讓我們能直接在 IDE 裡查看資料庫的內容。
-->

---
layout: default
---

# Outline

- **前置準備：建立 Schema 和 Table** — 用 MySQL Workbench 建立資料庫與資料表
- **回顧：什麼是 Spring JDBC？** — 橋樑角色、JdbcTemplate 工具
- **設定資料庫連線資訊** — application.properties 設定 URL、帳號、密碼、Driver
- **Eclipse 資料庫管理工具** — Data Source Explorer 安裝與使用，直接在 IDE 查看資料庫
- **章節總結** — 連線設定重點整理

<!--
今天分兩個部分：先設定程式碼裡的連線設定，再介紹 Eclipse 的視覺化資料庫工具。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 前置準備

## 用 MySQL Workbench 建立 Schema 和 Table

<!--
在設定 Spring Boot 連線之前，要先確認 MySQL 裡有資料庫和資料表可以連。
-->

---

# 建立 Schema（一）：開啟 MySQL Workbench

**Step 1：** 開啟 MySQL Workbench，點選本機連線（Local instance）進入

<img src="/screenshots/ch23-workbench-portal.png" class="rounded border mt-4 mx-auto" style="max-height: 340px;" />

<!--
Step 1：開啟 Workbench，點 Local instance MySQL 進入。
-->

---

# 建立 Schema（二）：點選建立按鈕

**Step 2：** 點選上方工具列的 **Create a new schema** 圖示（圓柱 + 加號）

<img src="/screenshots/ch23-workbench-schema-btn.png" class="rounded border mt-4 mx-auto" style="max-height: 340px;" />

<!--
工具列找到「圓柱+加號」的圖示就是 Create a new schema。
-->

---

# 建立 Schema（二）：填寫設定並套用

<div class="grid grid-cols-2 gap-4">
<div>

| 步驟 | 操作 |
| --- | --- |
| 3 | `Schema Name` 填入 `myjdbc` |
| 4 | Charset 選 `utf8mb4`，Collation 保持預設即可 |
| 5 | 點 **Apply** → 確認 SQL → 再點 **Apply** → **Finish** |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm">
💡 Schema 名稱需與後續 <code>application.properties</code> 的 URL 設定一致。
</div>

</div>
<div>

<img src="/screenshots/ch23-workbench-schema-dialog.png" class="rounded border w-full" />

</div>
</div>

<!--
utf8mb4 是 MySQL 推薦的字元集，支援完整 Unicode。Collation 保持預設（MySQL 8.0 為 utf8mb4_0900_ai_ci）即可，不需要特別更改。

Apply 後 Workbench 會顯示 SQL 預覽，確認沒問題再按第二個 Apply。
建立成功後左側 SCHEMAS 清單會出現 myjdbc。
-->

---

# 建立 Table（一）：開啟建立視窗

| 步驟 | 操作 |
| --- | --- |
| 1 | 在左側 Navigator 展開 `myjdbc` → 右鍵 `Tables` → **Create Table...** |
| 2 | 在 `Table Name` 填入資料表名稱（例如 `student`） |

<img src="/screenshots/ch23-workbench-create-table.png" class="rounded border mt-4 mx-auto" style="max-height: 320px;" />

<!--
在左側 SCHEMAS 找到 myjdbc，展開後右鍵 Tables，選 Create Table 進入建立畫面。
Table Name 填 student，這個名稱之後 SQL 裡會用到。
-->

---

# 建立 Table（二）：設定欄位並套用

| 步驟 | 操作 |
| --- | --- |
| 3 | 點下方 `+` 新增欄位，填入欄位名稱、資料型態 |
| 4 | 勾選 `id` 欄位的 **PK**（Primary Key）和 **AI**（Auto Increment） |
| 5 | 點 **Apply** → 確認 SQL → 再點 **Apply** → **Finish** |

<img src="/screenshots/ch23-workbench-table-columns.png" class="rounded border mt-3 mx-auto" style="max-height: 220px;" />

<!--
建立 Table 時，id 欄位設為 Primary Key 和 Auto Increment，新增資料時 id 會自動產生，不需要手動指定。
-->

---

# 建立 Table（三）：範例欄位設定

本課程使用的 `student` 資料表欄位：

| 欄位名稱 | 資料型態 | 設定 | 說明 |
| --- | --- | --- | --- |
| `id` | `INT` | PK、AI | 學生 ID，自動遞增，不需手動填入 |
| `name` | `VARCHAR(256)` | — | 學生姓名 |

<img src="/screenshots/ch23-workbench-table-result.png" class="rounded border mt-4 mx-auto" style="max-height: 260px;" />

<!--
之後 Spring JDBC 執行 INSERT 時只需要填 name，id 會自動填入。

這個 student 資料表會在後續章節中持續使用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回顧

## 什麼是 Spring JDBC？

<!--
先快速回顧上一章的重點。
-->

---

# 回顧：Spring JDBC 的角色

| 層次 | 說明 | 狀態 |
| --- | --- | --- |
| 前端 | 使用者介面，發送 Http 請求 | — |
| Spring MVC | 接收請求、處理邏輯、回傳 Response | ✅ 已學完 |
| **Spring JDBC** | **執行 SQL，存取資料庫資料** | **← 本章：設定連線** |
| 資料庫（MySQL） | 儲存應用程式的數據 | — |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>今天目標：</b> 完成 Spring JDBC 的連線設定，讓 Spring Boot 能存取 MySQL 資料庫。
</div>

<!--
上一章學了 Spring JDBC 的概念，它是後端和資料庫之間的橋樑。

今天要把這座橋真正搭起來：設定連線資訊，讓 Spring Boot 知道要連到哪個資料庫、用什麼帳號密碼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 在 Spring Boot 中設定資料庫連線資訊

<!--
先來看程式碼層面的設定。
-->

---

# Step 1：在 build.gradle 加入依賴

需要兩個依賴：Spring JDBC 和 MySQL 驅動程式：

```groovy
implementation 'org.springframework.boot:spring-boot-starter-jdbc'
implementation 'com.mysql:mysql-connector-j:8.0.33'
```

| 依賴 | 說明 |
| --- | --- |
| `spring-boot-starter-jdbc` | 啟用 Spring JDBC 功能，包含 `JdbcTemplate` |
| `mysql-connector-j` | MySQL 的 Java 驅動程式，讓 Spring Boot 能連接 MySQL |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 修改 build.gradle 後，必須在 Eclipse 右鍵專案 → <code>Gradle</code> → <code>Refresh Gradle Project</code>，才會下載依賴並生效。
</div>

<!--
第一步，在 build.gradle 加入兩個依賴。

第一個是 spring-boot-starter-jdbc，這是 Spring JDBC 的核心功能包，加入後就能使用 JdbcTemplate 來執行 SQL。
第二個是 mysql-connector-j，這是 MySQL 的 Java 驅動程式，沒有它 Spring Boot 根本連不上 MySQL。

加完之後記得在 Eclipse 右鍵專案 → Gradle → Refresh Gradle Project，讓 Eclipse 下載這兩個依賴。
-->

---

# Step 2：設定 application.properties

在 `src/main/resources/application.properties` 加入四行連線設定：

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/myjdbc?serverTimezone=Asia/Taipei&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=（你的 MySQL 密碼）
```

<!--
第二步，在 application.properties 設定資料庫連線資訊。

這四行告訴 Spring Boot：要用哪個驅動程式、連到哪個資料庫、用什麼帳號密碼。

password 填入你自己設定的 MySQL root 密碼。

設定完成之後，Spring Boot 啟動時會自動讀取這四個設定，建立和資料庫的連線。
-->

---

# application.properties 各項說明

| 設定項目 | 說明 |
| --- | --- |
| `driver-class-name` | MySQL 驅動程式的類別名稱，固定填 `com.mysql.cj.jdbc.Driver` |
| `url` | 資料庫連線 URL，格式：`jdbc:mysql://主機:埠號/資料庫名稱?參數` |
| `username` | MySQL 帳號，預設使用 `root` |
| `password` | MySQL 密碼，填入你設定的密碼 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>URL 說明：</b> <code>myjdbc</code> 是資料庫名稱（需先在 MySQL 建立）；<code>serverTimezone=Asia/Taipei</code> 避免時區問題；<code>characterEncoding=utf-8</code> 避免中文亂碼。
</div>

<!--
這頁詳細說明四個設定的意思。

driver-class-name 是固定值，不需要記，照抄就好。

url 的格式要注意：jdbc:mysql://localhost:3306/ 是固定的，後面的 myjdbc 是你要連接的資料庫名稱，這個資料庫需要先在 MySQL 裡建立。

serverTimezone=Asia/Taipei 和 characterEncoding=utf-8 這兩個參數幾乎都需要加，前者避免時區錯誤，後者避免中文字亂碼。

⚠️ 如果連線失敗，最常見的原因是：密碼錯了、資料庫名稱拼錯、或 MySQL 服務沒有啟動。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## Eclipse 中的資料庫管理工具<br>Data Source Explorer

<!--
設定完連線之後，來介紹 Eclipse 的視覺化資料庫工具。
-->

---

# 什麼是 Data Source Explorer？

| 項目 | 說明 |
| --- | --- |
| 工具名稱 | Data Source Explorer（資料來源總管） |
| 所屬功能 | Eclipse DTP（Data Tools Platform）插件內建 |
| 用途 | 在 Eclipse 中直接連接資料庫，瀏覽資料表、執行 SQL |
| 好處 | 不需要開啟其他資料庫工具，在 IDE 裡就能檢查資料 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>類似工具：</b> 功能類似 MySQL Workbench、DBeaver，但直接整合在 Eclipse 開發環境中。
</div>

<!--
Data Source Explorer 是 Eclipse 內建的資料庫管理工具，不需要額外安裝。

它讓我們可以在 Eclipse 裡直接連接 MySQL，查看有哪些資料表、資料表裡有什麼欄位和資料，甚至可以直接執行 SQL。

開發時這個工具很好用——寫完 SQL 之後，可以馬上在 Data Source Explorer 裡確認資料有沒有正確寫進資料庫，不需要切換到其他視窗。
-->

---

# 找不到 Data Source Explorer？先確認是否已安裝

開啟前先確認 Eclipse 是否有 DTP 插件：

| 確認步驟 | 說明 |
| --- | --- |
| 1 | `Window` → `Show View` → `Other...` |
| 2 | 搜尋框輸入 `Data Source` |
| 3 | 有出現 → 已安裝，直接使用 |
| 4 | 沒有出現 → 需要安裝 DTP 插件 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 部分 Eclipse 版本（如 Eclipse IDE for Java Developers）預設不含 DTP，需要手動安裝。
</div>

<!--
在打開 Data Source Explorer 之前，要先確認你的 Eclipse 有沒有安裝 DTP（Data Tools Platform）這個插件。

如果是下載 Eclipse IDE for Java EE Developers，通常已經內建 DTP。
但如果是 Eclipse IDE for Java Developers（比較精簡的版本），就需要手動安裝。

確認方式：Window → Show View → Other，在搜尋框打 Data Source，有出現就代表已安裝。
-->

---

# 安裝 DTP 插件（找不到時才需要）

透過 **Install New Software** 安裝：

| 步驟 | 操作 |
| --- | --- |
| 1 | `Help` → `Install New Software...` |
| 2 | `Work with` 下拉選單選擇 `--All Available Sites--`（載入時間較長，但最簡單） |
| 3 | 找到 `Database Development` 分類 |
| 4 | 直接勾選整個 **Database Development**（全部安裝） |
| 5 | 點 `Next` → 接受授權 → `Finish` |
| 6 | 等待安裝完成，重新啟動 Eclipse |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ 重啟後再次執行 <code>Window → Show View → Other → Data Management → Data Source Explorer</code>，即可正常開啟。
</div>

<!--
如果 Eclipse Marketplace 找不到，改用 Install New Software。

Work with 下拉選單選對應版本的 release site，展開 Database Development 分類就能找到 Data Tools Platform。

整個安裝過程大約 3 到 5 分鐘，視網路速度而定。

重啟完成之後，再回到 Window → Show View → Other，就會看到 Data Management 資料夾和 Data Source Explorer 選項了。
-->

---

# Step 1：開啟 Data Source Explorer

| 操作步驟 | 說明 |
| --- | --- |
| 1 | 點選上方選單 `Window` |
| 2 | 選擇 `Show View` → `Other...` |
| 3 | 展開 `Data Management` 資料夾 |
| 4 | 選擇 `Data Source Explorer`，點 `Open` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>快捷做法：</b> 也可以切換到 <b>Database Development</b> 視角（右上角圖示 → Other... → Database Development），Data Source Explorer 會自動出現在左側面板。
</div>

<!--
第一步，把 Data Source Explorer 這個面板打開。

路徑是 Window → Show View → Other → Data Management → Data Source Explorer。

開啟之後，你會在 Eclipse 的某個角落看到一個新的面板，裡面有「Database Connections」這個項目，這就是我們要操作的地方。

如果你用的是 Database Development 視角，Data Source Explorer 會預設顯示，不需要手動開啟。
-->

---

# Step 2：建立 MySQL 連線

| 操作步驟 | 說明 |
| --- | --- |
| 1 | 在 `Database Connections` 上右鍵 → `New...` |
| 2 | 從清單選擇 `MySQL`，點 `Next` |
| 3 | 填入 Connection 名稱（例如 `myjdbc`），點 `Next` |
| 4 | 在 Drivers 欄位旁點 `+`（新增 Driver 定義） |
| 5 | 選擇 MySQL 版本（例如 `MySQL JDBC Driver`） |

<!--
第二步，在 Data Source Explorer 建立一個新的 MySQL 連線。

右鍵 Database Connections，選 New，然後從清單選 MySQL 這個資料庫類型。

接下來要填一個名稱，建議和你的資料庫名稱一樣，方便辨認。

然後需要設定 Driver——這告訴 Eclipse 要用什麼驅動程式連接 MySQL。如果是第一次設定，需要點 + 新增。
-->

---

# Step 3：設定 MySQL Driver

| 操作步驟 | 說明 |
| --- | --- |
| 1 | 點 `JAR List` 頁籤 |
| 2 | 點 `Add JAR/Zip...`，找到 `mysql-connector-j-[版本].jar` |
| 3 | JAR 位置：Gradle 快取資料夾（見下方提示） |
| 4 | 確認後點 `OK` 完成 Driver 設定 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>找 JAR 的位置：</b> Windows 上 Gradle 下載的 JAR 在 <code>C:\Users\[使用者名稱]\.gradle\caches\</code>，用檔案總管搜尋 <code>mysql-connector-j</code> 找到對應版本的 <code>.jar</code> 檔。
</div>

<!--
第三步，設定 MySQL 的驅動程式 JAR 檔。

Driver 設定頁面切到 JAR List，點 Add JAR/Zip，找到 mysql-connector-j 的 JAR 檔。

這個 JAR 在哪裡？因為我們在 build.gradle 加入了依賴，Gradle 已經把它下載到本機快取。
Windows 上的路徑大概是 C:\Users\你的帳號\.gradle\caches\ 底下某個子資料夾，搜尋 mysql-connector-j 就能找到。

版本號以 build.gradle 裡設定的為準，每個人可能不同。
-->

---

# 疑難排解：Driver JAR 路徑錯誤

出現 `Unable to locate JAR/zip ... mysql-connector-java-4.0.0-bin.jar` 錯誤時：

| 步驟 | 操作 |
| --- | --- |
| 1 | 在 Driver 設定視窗，點 `JAR List` 頁籤 |
| 2 | 選中清單中的 `mysql-connector-java-4.0.0-bin.jar` 項目 |
| 3 | 點 **Clear All**（移除舊的佔位路徑） |
| 4 | 點 **Add JAR/Zip...**，找到實際的 `mysql-connector-j-[版本].jar` |
| 5 | 點 `OK` 儲存，重新 Test Connection |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>原因：</b> Eclipse DTP 的 Driver 範本預帶一個不存在的佔位 JAR 路徑，需要手動換成 Gradle 快取中實際下載的版本。
</div>

<!--
這個錯誤很常見。原因是 Eclipse DTP 的預設 Driver 定義裡帶了一個佔位 JAR 名稱 mysql-connector-java-4.0.0-bin.jar，這個檔案根本不存在，所以找不到。

JAR List 頁面看起來有東西，但那個路徑是壞的。

修法很簡單：Clear All，然後 Add JAR/Zip 選 Gradle 快取裡實際的 mysql-connector-j-[版本].jar。
-->

---

# Step 4：填入連線資訊並測試

| 欄位 | 填入內容 |
| --- | --- |
| Database | `myjdbc`（你的資料庫名稱） |
| URL | `jdbc:mysql://localhost:3306/myjdbc` |
| User name | `root` |
| Password | （你的 MySQL 密碼） |
| **Test Connection** | 點擊後若出現 ✅ Ping Succeeded 表示連線成功 |

<!--
第四步，填入連線資訊。

這些資訊和 application.properties 裡設定的一樣：資料庫名稱、URL、帳號、密碼。

填完之後，記得點 Test Connection 按鈕，確認連線是否成功。
如果出現 Ping Succeeded 的提示，就表示 Eclipse 成功連到 MySQL 了，可以點 Finish 完成設定。

如果連線失敗，通常是密碼錯了、MySQL 沒有啟動，或是 JAR 版本不符。
-->

---

# Step 5：瀏覽資料庫與資料表

連線建立後，展開 Data Source Explorer 的連線節點：

| 操作 | 說明 |
| --- | --- |
| 展開 `[連線名稱]` → `[資料庫名稱]` | 查看所有資料表 |
| 右鍵資料表 → **Edit** | 開啟資料表編輯器，可瀏覽、新增、修改資料 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>好用功能：</b> 寫完 Spring JDBC 的 INSERT 後，直接右鍵 Table → Edit 確認資料有沒有寫進去，不需要另開 MySQL Workbench。
</div>

<img src="/screenshots/ch23-data-source-edit.png" class="rounded border mt-3 mx-auto" style="max-height: 150px;" />

<!--
連線建立成功後，Data Source Explorer 裡就會出現資料庫結構。

展開連線節點找到資料表，右鍵選 Edit，就能看到資料表裡的所有資料，也可以在這裡直接新增或修改資料。

開發時很好用——寫完 Spring JDBC 的程式碼，馬上切到這裡確認資料是否正確寫入。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| build.gradle 依賴 | `spring-boot-starter-jdbc` + `mysql-connector-j:8.0.33` |
| application.properties | 4 個設定：driver、url、username、password |
| URL 格式 | `jdbc:mysql://localhost:3306/資料庫名?serverTimezone=Asia/Taipei&characterEncoding=utf-8` |
| Data Source Explorer | Eclipse 內建視覺化資料庫工具，可瀏覽資料表、執行 SQL |
| 下一步 | 開始使用 JdbcTemplate 執行 INSERT / SELECT / UPDATE / DELETE |

<!--
好，今天的重點總結。

第一，加入兩個 Gradle 依賴：spring-boot-starter-jdbc 和 mysql-connector-j。
第二，在 application.properties 設定四行連線資訊。
第三，在 Eclipse 的 Data Source Explorer 建立 MySQL 連線，可以視覺化查看資料。
第四，下一章開始正式用 JdbcTemplate 執行 SQL，完成 CRUD 操作。

設定好連線之後，接下來的幾章就會越來越有趣——我們可以把資料真正存進資料庫了！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
