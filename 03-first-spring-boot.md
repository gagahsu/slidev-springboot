---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 第一個 Spring Boot 程式
routeAlias: ch03
layout: default
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
    第一個 Spring Boot 程式
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「從零到第一個 Hello World，只需要幾分鐘」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第三章！

上一章我們把 MySQL、Git 和 GitHub Desktop 都裝好了。今天我們要做一件更令人興奮的事——寫出我們第一個 Spring Boot 程式！

這一章會帶大家一步一步操作：用 Spring Initializr 建立專案、匯入 Eclipse，然後寫幾行程式碼，讓瀏覽器顯示 "Hello World"。

整個過程大概只需要 15 分鐘，我們一起來試試看！
-->

---
layout: default
---

# Outline

- **Spring Initializr 建立專案** — 用官方網站產生 Gradle + Spring Web 專案骨架，下載 zip
- **將專案匯入 Eclipse** — 以 Existing Gradle Project 方式匯入並確認專案結構
- **建立第一個 Controller** — 撰寫 MyController，加上 `@RestController` 與 `@RequestMapping`
- **啟動並測試** — 執行程式，用瀏覽器存取 `localhost:8080/test` 看到 Hello World

<!--
今天的流程分四個步驟。

我們先用 Spring Initializr 這個官方網站產生專案骨架，就像先把房子的地基蓋好，只要填幾個設定，它就幫我們產生完整的資料夾結構。

接著把專案匯入 Eclipse，開始寫程式，最後啟動並用瀏覽器驗證結果。

大家可以邊看邊在自己的電腦上操作，有問題隨時舉手！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# Spring Initializr 建立專案

<!--
我們不是從空白資料夾開始，而是用 Spring 官方提供的 Spring Initializr 網站來幫我們產生專案骨架。

你可以把 Spring Initializr 想像成是一個「Spring Boot 專案產生器」，只要填好幾個設定，它就幫你把所有基礎結構都準備好，我們只需要開始寫業務邏輯就行了。
-->

---
---

# Spring Initializr — Step 1：填寫專案設定

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

開啟瀏覽器，前往 **https://start.spring.io**，依照下表填寫設定：

| 欄位 | 選擇值 |
| --- | --- |
| Project | **Gradle - Groovy** |
| Language | **Java** |
| Spring Boot | **3.5.14**（避免 SNAPSHOT / RC） |
| Group | `com.example` |
| Artifact | `demo` |
| Packaging | **Jar** |
| Java | **17** |

</div>
<div>

<img src="/screenshots/ch03-03-initializr-settings.png" style="max-height:400px; width:100%; object-fit:contain;" />

</div>
</div>

<!--
打開瀏覽器，前往 start.spring.io，這就是 Spring Initializr 的網站。

我們選擇 Gradle 而不是 Maven，因為這個課程用 Gradle 作為建構工具。Gradle 比 Maven 更現代，設定檔也比較簡潔。

Language 選 Java，Spring Boot 版本選 3.5.14，這是目前課程對應的穩定版本。有 SNAPSHOT 或 RC 字樣的都不要選，那些是測試版，可能有不穩定的問題。

Group 和 Artifact 就是你專案的識別名稱，這裡先用預設的 com.example 和 demo 就好。

Java 版本選 17，這是目前企業主流的 LTS 版本。
-->

---
---

# Spring Initializr — Step 2：新增 Spring Web 依賴

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

點選右側的 **ADD DEPENDENCIES** 按鈕（或按 Ctrl+B），搜尋 **Spring Web**，選取後它會出現在已選依賴清單。

| 依賴名稱 | 用途 |
| --- | --- |
| **Spring Web** | 提供 HTTP 處理能力，讓我們能撰寫 REST API |

確認設定無誤後，點選 **GENERATE** 按鈕，瀏覽器會下載 `demo.zip`。

</div>
<div>

<img src="/screenshots/ch03-04-initializr-web-dep.png" style="max-height:380px; width:100%; object-fit:contain;" />

</div>
</div>

<!--
接下來最重要的一步——選依賴。

點 ADD DEPENDENCIES，搜尋 Spring Web 並點選它。Spring Web 就是讓我們的程式能夠接收 HTTP 請求的核心模組，少了它，我們就沒辦法寫出可以用瀏覽器存取的 API。

選好之後，點 GENERATE，瀏覽器就會幫你下載一個 demo.zip。

這個 ZIP 裡面就是 Spring Boot 專案的完整骨架，等一下我們要把它解壓縮並匯入 Eclipse。
-->

---

# Spring Initializr — Step 3：解壓縮專案

下載完成後，找到 `demo.zip`，**解壓縮**到一個好找的位置，例如：

```
C:\Users\你的名字\Documents\demo
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議路徑：</b> 避免含有中文或空格的路徑，這可能導致 Gradle 建構失敗。
</div>

解壓縮後，資料夾內應包含：

| 項目 | 說明 |
| --- | --- |
| `build.gradle` | Gradle 建構設定檔 |
| `src/` | 主要程式碼目錄 |
| `gradlew` | Gradle Wrapper 執行腳本 |

<!--
下載完 demo.zip 之後，在資源管理員找到這個檔案，右鍵解壓縮。

建議放在路徑簡單、全英文的位置，比如 C:\Users\你的帳號\Documents\demo。

為什麼要避免中文路徑呢？因為 Gradle 在建構的時候，有時候會不認識中文字元，導致建構失敗，這個問題很難排查，所以一開始就養成好習慣。

解壓縮完之後，你應該會看到 build.gradle、src 資料夾，還有 gradlew 這幾個東西，這樣就對了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 將專案匯入 Eclipse

<!--
專案已經準備好了，現在要把它匯入 Eclipse。

因為我們選的是 Gradle 專案，所以匯入的方式跟一般 Java 專案不太一樣，我們要用 Gradle 專用的匯入方式。
-->

---
---

# 匯入專案 — Step 4a：開啟 Import

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

在 Eclipse 最上方選單列點選 **File**，往下找到 **Import…**，點擊開啟匯入精靈。

| 操作 | 說明 |
| --- | --- |
| 選單位置 | File → **Import…** |
| 快捷鍵 | 無，需透過選單 |

</div>
<div>

<img src="/screenshots/ch03-05-eclipse-import.png" style="max-height:400px; width:100%; object-fit:contain;" />

</div>
</div>

<!--
開啟 Eclipse 之後，在最上方找到 File 選單，點進去往下滑，找到 Import 並點擊。

這個 Import 功能是 Eclipse 通用的匯入入口，可以匯入各種不同類型的專案。
-->

---
---

# 匯入專案 — Step 4b：選擇 Gradle 專案路徑

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

在 Import 精靈中展開 **Gradle** 資料夾，選 **Existing Gradle Project**，點 **Next**。

接著點 **Browse…**，瀏覽到解壓縮後的 `demo` 資料夾，點 **Finish**。

Eclipse 會自動下載依賴並建構（首次約 1–3 分鐘）。

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b>路徑不能含有中文或空格，否則 Gradle 建構會失敗。
</div>

</div>
<div class="flex flex-col gap-3">

<img src="/screenshots/ch03-06-gradle-wizard.png" style="max-height:190px; width:100%; object-fit:contain;" />
<img src="/screenshots/ch03-07-gradle-browse.png" style="max-height:190px; width:100%; object-fit:contain;" />

</div>
</div>

<!--
Import 精靈打開之後，找到 Gradle 資料夾並展開，選 Existing Gradle Project，點 Next。

下一步會要求你指定專案根目錄，點 Browse 用檔案瀏覽器找到剛才解壓縮的 demo 資料夾，選取後點 Finish。

Eclipse 就會開始幫我們下載所有依賴的 JAR 檔，第一次比較久，因為要從網路抓 Spring Boot 的相關套件。

⚠️ 如果出現「Could not resolve」錯誤，通常是網路問題或路徑有中文，確認一下路徑再試一次。
-->

---

# 常見問題：Gradle 找不到 JDK 17

若 Refresh 後出現以下錯誤：

```
Cannot find a Java installation matching: {languageVersion=17}
Toolchain download repositories have not been configured.
```

代表 Gradle Toolchain 偵測不到系統上的 JDK 17。修復方式：開啟 `build.gradle`，找到 `java { toolchain { ... } }` 區塊，改為：

```groovy
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}
```

存檔後再執行 **Gradle → Refresh Gradle Project**。

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>原因：</b> Spring Initializr 預設使用 Toolchain API，部分 JDK（如 OpenLogic）不在 Gradle 自動偵測範圍，改用 <code>sourceCompatibility</code> 可直接沿用 PATH 中的 JDK。
</div>

<!--
如果有同學在 Refresh 之後看到這個錯誤訊息，不要慌張，這是一個很常見的 Gradle 設定問題。

Spring Initializr 產生的 build.gradle 預設使用 Toolchain API 來指定 JDK 版本，但這個功能需要 Gradle 能夠自動掃描到你系統上的 JDK。部分發行版的 JDK（例如 OpenLogic）不在 Gradle 的自動偵測清單裡，就會出現這個錯誤。

解法很簡單：把 toolchain 那段拿掉，改用 sourceCompatibility 和 targetCompatibility，這兩個設定直接指定編譯版本，不需要 Gradle 去搜尋 JDK，用 PATH 裡的就行了。

改完存檔，再 Refresh 一次就會正常了。
-->

---
---

# 匯入專案 — Step 5：確認專案結構

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

匯入成功後，在 Eclipse 左側的 **Package Explorer** 應能看到以下結構：

| 路徑 | 說明 |
| --- | --- |
| `src/main/java` | 主程式碼放置目錄 |
| `src/main/resources` | 設定檔（application.properties）|
| `src/test/java` | 測試程式碼目錄 |
| `build.gradle` | Gradle 建構設定 |

</div>
<div>

<img src="/screenshots/ch03-08-project-structure.png" style="max-height:380px; width:100%; object-fit:contain;" />

</div>
</div>

<!--
匯入成功後，你會在左側的 Package Explorer 看到 demo 專案展開來的樣子。

src/main/java 是我們之後寫程式碼的地方。src/main/resources 裡面有一個 application.properties，之後會用它來設定資料庫連線、伺服器 port 等等。

你還會看到一個 DemoApplication.java，這就是整個 Spring Boot 程式的啟動入口，裡面有一個 main() 方法。

這個結構不是我們自己建的，是 Spring Initializr 幫我們產生的，這就是它的好處。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 建立第一個 Controller

<!--
準備工作都做好了，現在來寫程式！

我們要建立一個叫做 MyController 的類別，它的工作是「接收瀏覽器送來的 HTTP 請求，然後回傳一段文字」。

別擔心現在不懂 Controller 是什麼，我們後面的章節會詳細說明，今天先動手試試看，讓程式跑起來最重要。
-->

---
---

# 建立 Controller — Step 6：新增 Java 類別

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

在 Package Explorer 中，對 **com.example.demo** 套件點右鍵，選 **New → Class**。

| 欄位 | 填入值 |
| --- | --- |
| Package | `com.example.demo`（已自動填入） |
| Name | `MyController` |

確認後點 **Finish**，Eclipse 會自動建立並開啟這個類別。

</div>
<div class="flex flex-col gap-3">

<img src="/screenshots/ch03-09-new-class-1.png" style="max-height:185px; width:100%; object-fit:contain;" />
<img src="/screenshots/ch03-09-new-class-2.png" style="max-height:185px; width:100%; object-fit:contain;" />

</div>
</div>

<!--
在 Package Explorer 找到 com.example.demo 這個套件，就是 src/main/java 底下的那個，對它點右鍵，選 New → Class。

Name 填 MyController，其他保持預設，點 Finish。

Eclipse 就會建立一個空白的 MyController.java 並自動開啟編輯器。

為什麼要放在 com.example.demo 底下呢？因為 Spring Boot 在啟動的時候，會掃描 DemoApplication.java 所在套件及其子套件，只有在這個範圍內的類別，Spring 才找得到。
-->

---

# 建立 Controller — Step 7：撰寫程式碼

將 `MyController.java` 的內容改寫如下：

```java
package com.example.demo;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    @RequestMapping("/test")
    public String test() {
        System.out.println("Hi!");
        return "Hello World";
    }
}
```

<!--
這就是我們第一個 Controller 的完整程式碼，只有幾行，但已經是一個完整可運作的後端 API。

注意最上面兩個 Annotation：@RestController 告訴 Spring「這個類別是用來處理 HTTP 請求的控制器」；@RequestMapping("/test") 則告訴 Spring「當有人訪問 /test 這個路徑，就執行這個 test() 方法」。

test() 方法做了兩件事：先用 System.out.println 在 Console 印出 "Hi!"，再用 return 把 "Hello World" 這個字串回傳給瀏覽器。

這段程式碼不需要背，等學完後面的章節，你就會自然記住了。現在只要把它打進去、讓程式跑起來就行。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 啟動程式並測試

<!--
程式碼寫好了，最令人期待的時刻來了——啟動程式，用瀏覽器看結果！
-->

---
---

# 啟動與測試 — Step 8：執行程式

在 Package Explorer 對 **DemoApplication.java** 點右鍵，選 **Run As → Java Application**。

| 欄位 | 說明 |
| --- | --- |
| 對象 | `DemoApplication.java`（啟動入口） |
| 選單 | Run As → **Java Application** |

<img src="/screenshots/ch03-10-run-as.png" style="max-height:320px; width:100%; object-fit:contain; margin-top:12px;" />

<!--
要啟動 Spring Boot 程式，找到 DemoApplication.java，對它點右鍵，選 Run As → Java Application。

注意是對 DemoApplication.java 點右鍵，這是程式的啟動入口，不是對 MyController.java。

點下去之後，Eclipse 下方的 Console 視窗就會開始跑東西，讓我們看看接下來出現什麼。
-->

---
---

# 啟動與測試 — Step 9：確認啟動成功

觀察 Console 視窗輸出，看到以下訊息代表啟動成功：

| Console 訊息 | 代表意義 |
| --- | --- |
| `Started DemoApplication` | Spring Boot 啟動完成 |
| `Tomcat started on port 8080` | 內建伺服器已開始監聽 |

<img src="/screenshots/ch03-11-console-started.png" style="max-height:280px; width:100%; object-fit:contain; margin-top:12px;" />

<!--
等幾秒鐘之後，Console 視窗會印出一大串日誌，找到這兩行最重要：

"Tomcat started on port 8080" 表示內建的 Tomcat 伺服器已經啟動，在 port 8080 等待請求。

"Started DemoApplication in X.XXX seconds" 表示我們的 Spring Boot 程式已經完全啟動好了。

Spring Boot 有一個很棒的特色，就是它內建了 Tomcat 這個網頁伺服器，所以我們不需要另外安裝伺服器，直接執行 Java 程式就可以提供 HTTP 服務。

看到這兩行訊息就代表一切正常，我們可以進行下一步了。
-->

---
---

# 啟動與測試 — Step 10：瀏覽器測試

打開瀏覽器（Chrome、Edge 等均可），在網址列輸入：

```
http://localhost:8080/test
```

瀏覽器頁面會顯示 Hello World，Eclipse Console 同步出現 `Hi!`。

<img src="/screenshots/ch03-12-browser-result.png" style="max-height:280px; width:100%; object-fit:contain; margin-top:12px;" />

<!--
現在最激動人心的時刻來了！

打開瀏覽器，在網址列輸入 http://localhost:8080/test，按 Enter。

如果一切順利，你就會在瀏覽器看到 "Hello World" 這幾個字。

這表示什麼？表示你的電腦正在跑一個後端伺服器，而你的瀏覽器剛剛成功地跟它溝通，取得了回應！

同時看一下 Eclipse 的 Console，你也會看到 "Hi!" 被印出來了，這是我們在 test() 方法裡寫的 System.out.println。

恭喜大家！你們已經完成了人生中第一個 Spring Boot API！
-->

---
---

# 啟動與測試 — Step 11：Console 也同步印出結果

瀏覽器存取 `/test` 後，Eclipse Console 出現 `Hi!`，代表 `test()` 方法確實被 Spring 呼叫執行。

| 輸出位置 | 內容 |
| --- | --- |
| 瀏覽器 | `Hello World` |
| Eclipse Console | `Hi!` |

<img src="/screenshots/ch03-13-console-result.png" style="max-height:280px; width:100%; object-fit:contain; margin-top:12px;" />

<!--
看完瀏覽器，再切回 Eclipse 的 Console 視窗看看。

你會看到 Hi! 被印出來了，這是我們在 test() 方法裡寫的 System.out.println。

這代表什麼？代表當瀏覽器對 /test 發出請求，Spring 真的找到了我們的 test() 方法，執行了它，然後把 Hello World 回傳給瀏覽器。這整個流程都通了！
-->

---

# 補充：程式運作原理

| 步驟 | 說明 |
| --- | --- |
| ① 瀏覽器發出請求 | 瀏覽器對 `localhost:8080/test` 發出 HTTP GET 請求 |
| ② Spring 接收請求 | Spring 的 **DispatcherServlet** 接收並分派這個請求 |
| ③ 比對路徑 | Spring 找到 `@RequestMapping("/test")`，交給 `test()` 處理 |
| ④ 回傳結果 | `test()` 回傳 `"Hello World"`，Spring 將它寫入 HTTP 回應 |
| ⑤ 瀏覽器顯示 | 瀏覽器收到回應，顯示在頁面上 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重要 Annotation：</b> <code>@RestController</code> 標記此類別為 REST 控制器；<code>@RequestMapping</code> 綁定 URL 路徑到對應方法
</div>

<!--
現在讓我們來看看這整個過程背後發生了什麼事。

從瀏覽器輸入網址到看到 Hello World，中間 Spring 幫我們做了很多事情：它接收了 HTTP 請求，比對了我們設定的路徑 /test，找到對應的 test() 方法並執行，最後把回傳值轉換成 HTTP 回應送回去。

這個流程在往後的章節我們會更詳細地學習，現在先有個概念就好。

重點是：@RestController 和 @RequestMapping 這兩個 Annotation 是 Spring MVC 的核心，幾乎每個 Controller 都會用到，後面我們會非常熟悉它們。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天成功執行了第一個 Spring Boot 程式，非常棒！

如果過程中有遇到問題，常見的有：Gradle 找不到 JDK、Import 選錯資料夾層級、Run As 沒有 Java Application 選項。

有問題的同學可以截圖錯誤訊息，我們一起來看看怎麼解決。
-->
