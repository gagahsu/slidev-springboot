---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 開發環境安裝
routeAlias: ch02
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
  .shot {
    max-height: 320px;
    width: auto;
    border-radius: 8px;
    border: 1px solid #cfe4e1;
    box-shadow: 0 4px 14px rgba(26, 92, 92, 0.12);
  }
  .shot-sm {
    max-height: 240px;
  }
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Java Programming
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    開發環境安裝
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「工具先準備好，程式才跑得起來」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第二章。

上一章我們把 Java 是什麼、JDK 跟 JVM 的關係都講過了，但那些都還停留在紙上。這一章我們要把電腦真的準備好——裝 JDK、裝 Eclipse，然後親手跑出第一支程式。

這一章沒有什麼難懂的觀念，但步驟很多，而且每一步都會影響後面。我會一步一步帶著大家做，畫面上每個步驟都有截圖，跟著點就對了。

學完這一章，大家的電腦就是一台可以寫 Java 的電腦了。
-->

---
layout: default
---

# Outline

- **為什麼需要安裝開發環境**
- **安裝 JDK（Eclipse Temurin 21）**
- **確認環境變數**
- **驗證 JDK 安裝**
- **安裝 Eclipse**
- **讓 Eclipse 認得 JDK**
- **跑出第一支程式**

<!--
先看一下這一章的地圖。

前面四個部分都在處理 JDK：下載、安裝、確認環境變數、驗證。第五到第七部分才輪到 Eclipse，最後我們會在 Eclipse 裡面建一個專案，跑出「Hello, World!」。

大家可以把這一章想成組裝一台機器：JDK 是引擎，Eclipse 是駕駛座。引擎沒裝好，坐上駕駛座也發不動，所以順序不能顛倒。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 為什麼需要安裝開發環境

<!--
我們先花幾分鐘講「為什麼」。

很多人一開始會直接跳到安裝步驟，結果中間出錯的時候完全不知道發生什麼事。花五分鐘搞懂我們到底在裝什麼，後面遇到問題才有辦法自己判斷。
-->

---

# 回顧：Ch 1 學過的 JDK / JRE / JVM

| 名稱 | 全名 | 負責的事 |
| --- | --- | --- |
| `JVM` | Java Virtual Machine | 真正執行位元組碼的虛擬機器 |
| `JRE` | Java Runtime Environment | JVM + 標準函式庫，只能「執行」程式 |
| `JDK` | Java Development Kit | JRE + `javac` 等開發工具，可以「編譯 + 執行」 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>結論：</b> 我們是要「寫」程式，不是只跑別人寫好的程式，所以一定要裝 <b>JDK</b>，裝 JRE 是不夠的。
</div>

<!--
先花三十秒複習上一章的內容。

JVM、JRE、JDK 這三個是包含關係，像三層俄羅斯娃娃：最裡面是 JVM，負責執行；中間包一層標準函式庫變成 JRE，可以跑程式；最外面再包上編譯器和工具，就是 JDK。

這裡要記住一件事：我們是開發者，要把 .java 編譯成 .class，這件事只有 JDK 裡的 javac 做得到。所以等一下下載的時候，看到 JDK 和 JRE 兩個選項，一律選 JDK。

另外補充一個好消息：從 Java 9 開始，JDK 裡面本來就含 JRE 了，所以不用另外再裝一次 JRE。
-->

---

# 沒有開發環境，會發生什麼事？

想像我們在記事本裡寫好了一段 Java 程式，存成 `HelloWorld.java`，然後在終端機輸入：

```bash
javac HelloWorld.java
```

得到的卻是：

```text
'javac' 不是內部或外部命令、可執行的程式或批次檔。
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>問題在哪：</b> 電腦上根本沒有 <code>javac</code> 這個程式，或者有裝、但系統不知道它放在哪裡。這一章要解決的就是這兩件事。
</div>

<!--
我們先看看「沒有環境」會長什麼樣子。

假設我們已經寫好了一支 Java 程式，存檔叫 HelloWorld.java。這時候打開終端機，輸入 javac HelloWorld.java 想把它編譯起來，結果電腦回你一句「javac 不是內部或外部命令」。

這句話翻成白話就是：「我不認識 javac 這個東西。」

原因只有兩個。第一，你電腦上真的沒裝 JDK。第二，裝了，但系統不知道它在哪個資料夾。

這一章的前半段在解決第一個問題，後半段的環境變數在解決第二個問題。等一下大家如果卡住，先回想一下自己是卡在哪一個。
-->

---

# 這一章要裝的兩樣東西

| 軟體 | 角色 | 沒有它會怎樣 |
| --- | --- | --- |
| **JDK** | 編譯器 + 執行環境 | 程式無法編譯，也無法執行 |
| **Eclipse** | IDE（整合開發環境） | 還是能寫程式，但要自己開記事本、自己下指令 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>觀念釐清：</b> JDK 是「必要」，Eclipse 是「讓事情變輕鬆」。理論上只裝 JDK 也能寫 Java，只是打字會打到懷疑人生。
</div>

<!--
這一章要裝兩樣東西，角色完全不同。

JDK 是必要的，沒有它一行 Java 都跑不動。Eclipse 不是必要的，它是一種「工具箱」。

我打個比方：JDK 像是廚房裡的爐子跟鍋子，沒有它就沒辦法煮菜。Eclipse 像是一個把刀具、砧板、量杯、食譜都收在一起的中島流理臺——沒有它你還是能煮，只是要一直跑來跑去拿東西。

Eclipse 幫我們做的事情包括：打字打到一半自動提示、程式有錯馬上畫紅線、按一個按鈕就編譯加執行。這些事情你自己用記事本加終端機也做得到，但會慢非常多。
-->

---

# JDK 有很多家，該選哪一個？

| 發行版 | 提供者 | 特色 |
| --- | --- | --- |
| **Eclipse Temurin** | Eclipse 基金會（Adoptium） | 免費、通過 TCK 認證、LTS 支援四年以上 |
| Oracle JDK | Oracle | 商業授權有使用條件，企業正大量遷離 |
| Amazon Corretto | Amazon | AWS 環境常見 |
| Microsoft Build of OpenJDK | Microsoft | Azure 環境常見 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>本課程使用：</b> Eclipse Temurin JDK 21 (LTS)。它們核心都是同一份 OpenJDK 原始碼，語法與行為一致，換發行版不用改程式。
</div>

<!--
這裡同學常常有疑問：為什麼 Java 要下載還有這麼多家可以選？

原因是 Java 的原始碼 OpenJDK 是開源的，任何人都可以拿去編譯、打包、發布。所以就變成好幾家公司各自出一個版本。

大家可以想成同一款車型，但由不同代工廠組裝。引擎規格一模一樣，差別在保固條款、支援年限、還有附贈的售後服務。

我們課程用 Eclipse Temurin，理由有三個。第一，完全免費，商業用也不用擔心授權。第二，它通過了 TCK 相容性測試，是「正牌」的 Java。第三，Spring 官方文件和官方的 Docker 映像檔都預設用它，業界最通行。

重點是：這四家的語法完全一樣，你用 Temurin 寫的程式，換到 Corretto 上一樣跑得動。所以真的不用糾結。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 安裝 JDK

<!--
好，觀念講完了，我們開始動手。

接下來的每一頁都有截圖，大家可以一邊看螢幕一邊做。如果哪一步跟不上，先舉手，不要默默跳過，因為前面沒做對後面一定會出錯。
-->

---

# 下載安裝檔

前往 [Adoptium 官方網站](https://adoptium.net/temurin/releases/)，選擇 **JDK 21 - LTS** 分頁：

<div class="flex justify-center mt-2">
  <img src="/img/env/jdk-01-download-page.png" class="shot" />
</div>

<!--
第一步，打開瀏覽器，網址是 adoptium.net，這是 Eclipse 基金會的官方網站。

進去以後會看到一排版本分頁：JDK 21、JDK 17、JDK 11、JDK 8。我們選 JDK 21 - LTS。

LTS 是 Long Term Support 的縮寫，中文叫長期支援版。Java 每半年就出一個新版，但只有特定幾個版本會被長期維護，21 就是其中一個。業界專案幾乎都是挑 LTS 版在用，不會去追最新的那個。

提醒一下，一定要從官網下載。網路上有些網站也提供 JDK 下載，但你不知道那份檔案被動過什麼手腳。
-->

---

# 下載前要確認的三件事

| 項目 | 怎麼選 | 常見錯誤 |
| --- | --- | --- |
| **作業系統** | Windows / macOS / Linux | 在 Windows 下載了 macOS 的 `.pkg` |
| **CPU 架構** | x64（Intel/AMD）、aarch64（Apple M 系列） | Apple 晶片的 Mac 抓了 x64 版 |
| **套件類型** | 選 **JDK**，不要選 JRE | 抓了 JRE，之後無法編譯 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Windows 使用者：</b> 選 <code>.msi</code> 安裝檔，它會自動幫你設定環境變數，比 <code>.zip</code> 版省事很多。
</div>

<!--
下載頁面上選項有點多，我們把要看的三件事整理成一張表。

第一件是作業系統，這個大家應該不會選錯。

第二件是 CPU 架構，這個常出錯。如果你的 Mac 是 M1、M2、M3 這種 Apple 晶片，要選 aarch64；如果是比較舊的 Intel Mac，才選 x64。Windows 筆電絕大多數是 x64。

第三件最重要：套件類型要選 JDK，不要選 JRE。剛剛複習過了，JRE 只能執行，不能編譯。每年都有同學抓錯這個，然後卡在 javac 找不到。

最後給 Windows 同學一個建議：下載 .msi 那個版本。.msi 是安裝精靈，會自動幫你設好環境變數；.zip 版要自己解壓縮、自己設路徑，多花很多工。
-->

---

# 執行安裝程式

點兩下下載好的 `.msi` 檔案，安裝精靈就會啟動：

<div class="flex justify-center mt-2">
  <img src="/img/env/jdk-02-installer-welcome.png" class="shot" style="max-height: 380px; width: auto;" />
</div>

<!--
下載完成後，到「下載」資料夾找到那個 .msi 檔案，點兩下就會跳出安裝精靈。

第一頁是歡迎畫面，沒什麼好選的，就是確認一下版本號對不對。畫面上會寫 Eclipse Temurin JDK 21 點多少，跟你剛剛下載的一致就沒問題。

如果 Windows 跳出「使用者帳戶控制」問你要不要允許，按「是」。安裝軟體到 Program Files 需要管理員權限，這是正常的。

確認完按「下一步」。
-->

---

# 授權合約與安裝範圍

<div class="flex gap-4 mt-2 justify-center items-start">
  <div class="flex flex-col items-center">
    <img src="/img/env/jdk-03.png" class="shot shot-sm" />
    <p class="text-sm mt-1">① 勾選「我接受授權合約中的條款」</p>
  </div>
  <div class="flex flex-col items-center">
    <img src="/img/env/jdk-04.png" class="shot shot-sm" />
    <p class="text-sm mt-1">② 選 <b>Install for all users of this machine</b></p>
  </div>
</div>

<!--
接下來連續兩個畫面，都是照著「下一步」推進就好，但有一個地方要注意。

第一張是授權合約，GNU 通用公共授權，內容不用細看，重點是左下角要勾「我接受授權合約中的條款」，沒勾的話下一步是灰的，按不下去。

第二張問你安裝範圍：只給你自己用，還是給這台電腦上所有使用者用。我們選第二個，Install for all users of this machine。

為什麼要選這個？因為只有選「所有使用者」，安裝程式才會把 JAVA_HOME 這些環境變數寫進「系統變數」；如果選「只給自己」，變數會寫進「使用者變數」。功能上都能用，但我們等一下要去確認環境變數的時候，畫面上找的地方會不一樣，為了跟大家的畫面一致，這裡統一選 all users。
-->

---

# 安裝選項：兩個一定要開啟

| 選項 | 要不要開 | 作用 |
| --- | --- | --- |
| **Add to PATH** | ✅ 一定要 | 讓你在任何資料夾都能執行 `java`、`javac` |
| **Set JAVA_HOME variable** | ✅ 一定要 | 讓 Eclipse、Maven、Gradle 找得到 JDK |
| Associate .jar | 可選 | 讓 `.jar` 檔可以點兩下直接執行 |
| JavaSoft (Oracle) registry keys | 可不開 | 舊版程式相容用，一般用不到 |

<!--
接下來這一頁是整個安裝流程裡最關鍵的一頁，請大家特別注意。

安裝精靈會給你一棵樹狀清單，每一項前面有個小圖示，可以決定要不要安裝。

前面兩項一定要開啟。Add to PATH 開了以後，你在任何資料夾打開命令提示字元，輸入 java 都找得到；沒開的話，你得先切換到 JDK 的 bin 資料夾才能用，非常麻煩。

Set JAVA_HOME 這一項也要開。等一下我們裝 Eclipse、還有以後你用 Maven 或 Gradle 的時候，這些工具都是靠 JAVA_HOME 這個變數去找 JDK 的。

後面兩項可開可不開，不影響上課。

⚠️ 特別提醒：Temurin 的安裝精靈預設可能只勾了 Add to PATH，JAVA_HOME 那項是關的。請大家自己點開，把它改成要安裝。
-->

---

# 安裝選項 — 操作畫面

<div class="flex justify-center mt-2">
  <img src="/img/env/jdk-05.png" class="shot" style="max-height: 380px; width: auto;" />
</div>


<!--
這就是剛剛講的那個畫面。

大家看樹狀清單裡的每一項，前面那個小圖示點下去會展開一個選單，裡面有幾個選項，白話講就是「要裝」「不要裝」「用到再裝」。

畫面上「設定或重寫 JAVA_HOME 變數」這一項現在是反白選取的狀態，代表它預設是「不安裝」；「PATH 變數值」那一項預設就是會裝的。我們要把 JAVA_HOME 這一項改成安裝，選成「安裝在本機硬碟上」。

左下角還有一個「瀏覽(R)」按鈕，可以改安裝資料夾。我的建議是不要改，用預設路徑就好，但請大家看一眼、記一下這個路徑長什麼樣子：C 槽、Program Files、Eclipse Adoptium、然後一個 jdk-21 開頭的資料夾。

為什麼要記？因為等一下我們要去 Eclipse 裡面設定「你的 JDK 在哪」，那時候就要自己找到這個資料夾。如果你剛剛改成一個很奇怪的位置又忘記了，等一下會找很久。

確認完按「下一步」。
-->

---

# 準備安裝與完成安裝

<div class="flex gap-4 mt-2 justify-center items-start">
  <div class="flex flex-col items-center">
    <img src="/img/env/jdk-06.png" class="shot shot-sm" />
    <p class="text-sm mt-1">① 準備安裝，按「安裝」開始</p>
  </div>
  <div class="flex flex-col items-center">
    <img src="/img/env/jdk-07.png" class="shot shot-sm" />
    <p class="text-sm mt-1">② 安裝完成，按「完成」關閉</p>
  </div>
</div>

<!--
接下來兩張畫面都很單純。

第一張是「準備安裝」的確認頁，告訴你按下一步都設定好了，按「安裝」就會真的開始複製檔案。

按下去之後會跑一兩分鐘的進度條，跑完就會看到第二張畫面——這張換成 Adoptium 深紫色的完成頁，代表 JDK 真的裝好了，按「完成」關掉。

但是先不要高興太早——「安裝完成」不等於「可以用了」。接下來我們要做兩件事：先確認環境變數有沒有真的被設定進去，再實際下指令驗證一次。

這兩步很多教學會跳過，但我強烈建議做，因為現在花一分鐘檢查，可以省下之後半小時的除錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 確認環境變數

<!--
接下來這一段，我們要確認剛剛安裝精靈幫我們設定的環境變數有沒有生效。

在動手之前，我先花一分鐘解釋環境變數到底是什麼，這樣大家等一下看到那些設定畫面才不會一頭霧水。
-->

---

# 什麼是環境變數？

想像你搬到一間新辦公室，跟同事說「幫我把文件放到我桌上」。同事要能做到，前提是他知道「你的桌子在哪」。

**環境變數就是作業系統的一本通訊錄**：程式需要某個東西的時候，不用寫死路徑，直接查這本通訊錄就好。

| 變數 | 記錄的內容 | 誰會來查 |
| --- | --- | --- |
| `JAVA_HOME` | JDK 安裝在哪個資料夾 | Eclipse、Maven、Gradle |
| `Path` | 一串資料夾清單，系統照順序找執行檔 | 命令提示字元（`java`、`javac`） |

<!--
環境變數這個名詞聽起來很抽象，我用一個生活情境來說。

想像你剛搬進一間新辦公室，跟同事說「幫我把文件放到我桌上」。同事要做得到，前提是他知道你的桌子在哪一間、哪個位置。如果公司有一本座位表，他查一下就找到了。

環境變數就是作業系統的那本座位表。程式要用某個東西的時候，不用把路徑寫死在程式裡，去查這本表就好。

我們這一章只會碰到兩個變數。JAVA_HOME 記的是「JDK 裝在哪個資料夾」，Eclipse 跟 Maven 這些工具會來查它。Path 記的是「一串資料夾清單」，你在命令提示字元打 java 的時候，系統就照這串清單一個一個資料夾去找 java.exe。

搞懂這兩個的分工，等一下出錯的時候你就知道該去改哪一個。
-->

---

# JAVA_HOME 和 Path 的分工

| 比較 | `JAVA_HOME` | `Path` |
| --- | --- | --- |
| 記什麼 | 一個資料夾路徑 | 一串資料夾清單 |
| 值長怎樣 | `C:\Program Files\Eclipse Adoptium\jdk-21.x-hotspot` | `...;%JAVA_HOME%\bin;...` |
| 誰在用 | Eclipse、Maven、Gradle | 命令提示字元 |
| 沒設會怎樣 | IDE 找不到 JDK | 打 `java` 說找不到指令 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵差異：</b> <code>JAVA_HOME</code> 是「宣告 JDK 在哪」，<code>Path</code> 是「叫系統去哪裡找指令」。兩個要搭配才完整。
</div>

<!--
這兩個變數很多人分不清楚，我們用一張表講清楚。

JAVA_HOME 存的是「一個」資料夾路徑，指到 JDK 的根目錄——注意，是根目錄，不是裡面的 bin。

Path 存的是「一串」資料夾清單，用分號隔開。裡面要有 JDK 的 bin 資料夾，因為 java.exe 和 javac.exe 就放在那裡。

大家看 Path 那個值，寫的是 %JAVA_HOME%\bin。那個百分比符號包起來的寫法，意思是「引用 JAVA_HOME 這個變數的值」。好處是以後你升級 JDK，只要改 JAVA_HOME 一個地方，Path 會自動跟著變。

一句話總結：JAVA_HOME 是宣告，Path 是實際拿來用。缺一個都會出問題，但出的問題不一樣——JAVA_HOME 沒設是 Eclipse 抱怨，Path 沒設是命令列抱怨。
-->

---

# 打開環境變數設定

**設定 → 系統 → 進階系統設定**

<div class="flex justify-center mt-2">
  <img src="/img/env/env-01-system-advanced.png" class="shot" />
</div>

<!--
我們來確認一下設定有沒有生效。

在 Windows 11 上，按開始，打開「設定」，選左邊的「系統」，然後把右邊的畫面拉到最下面，會看到「系統資訊」，點進去以後右邊有一個「進階系統設定」。

有一個更快的方法：直接在工作列的搜尋框打「環境變數」四個字，Windows 會直接把設定視窗找出來給你。這招比較快，推薦大家用。
-->

---

# 環境變數視窗

<div class="flex justify-center mt-2">
  <img src="/img/env/env-02-env-vars-dialog.png" class="shot" style="max-height: 380px; width: auto;" />
</div>

<!--
在「系統內容」視窗按下「環境變數」按鈕，就會看到這個畫面。

這個視窗分成上下兩半，很多人第一次看會搞混。

上半部是「使用者變數」，只對你這個 Windows 帳號生效。下半部是「系統變數」，對這台電腦上所有使用者都生效。

用 .msi 安裝的話，JDK 的設定通常會寫在下半部的系統變數。所以等一下我們要找的東西，往下半部找。

如果你在下半部找不到，再去上半部看看，有些安裝方式會寫在使用者變數。兩個地方都可以，只要有就好。
-->

---

# 確認 JAVA_HOME

在**系統變數**清單中找到 `JAVA_HOME`，值應該是 JDK 的安裝資料夾：

<div class="flex justify-center mt-2">
  <img src="/img/env/env-03-java-home.png" class="shot" style="max-height: 380px; width: auto;" />
</div>

<!--
先找 JAVA_HOME。在系統變數清單裡面，變數是照字母排序的，J 開頭的在中間偏上，往下捲一下就會看到。

點兩下打開來看，值應該是 C 冒號反斜線 Program Files 反斜線 Eclipse Adoptium 反斜線 jdk-21 開頭那個資料夾。

這裡有一個超級常見的錯誤，我特別標出來：JAVA_HOME 的結尾是 JDK 資料夾本身，後面不可以加 backslash bin。

為什麼？因為 Eclipse 跟 Maven 拿到 JAVA_HOME 之後，它們會自己在後面接上 bin 或 lib 去找東西。你如果自己先加了 bin，它們接完就變成 bin 裡面又有一個 bin，當然找不到。

如果你發現這個變數根本不存在，代表安裝的時候那一項沒有勾到。不用重裝，按「新增」自己補一個就好，變數名稱打 JAVA_HOME，變數值用「瀏覽目錄」選到 JDK 資料夾。
-->

---

# 確認 Path

在系統變數中找到 `Path` → 點「編輯」，確認清單裡有 JDK 的 `bin`：

<div class="flex justify-center mt-2">
  <img src="/img/env/env-04-path-edit.png" class="shot" style="max-height: 380px; width: auto;" />
</div>

<!--
接著找 Path。一樣在系統變數清單裡，找到 Path 這一列，點「編輯」。

會跳出一個清單視窗，每一列是一個資料夾。我們要確認裡面有一列是 JDK 的 bin 資料夾——可能寫成完整路徑，也可能寫成 %JAVA_HOME%\bin，兩種都可以。

這裡順便講一個實務上很有用的技巧。右邊有「上移」和「下移」兩個按鈕。系統在找指令的時候，是從這個清單的第一列開始，一列一列往下找，找到就停。

所以如果你電腦上裝了兩個以上的 JDK 版本，誰排在前面，誰就是實際被用到的那一個。以後你在公司同時維護 Java 17 和 Java 21 的專案，切換版本就是靠這個上移下移，不用重裝。

確認好之後，一路按「確定」關掉所有視窗。要按到底，如果中途按取消，剛剛的修改就不會存檔。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 驗證 JDK 安裝

<!--
設定都看過了，現在來做最後一件事：實際下指令驗證。

這一步是整個 JDK 安裝流程的驗收。有跑出正確結果，才算真的裝完。
-->

---

# 打開命令提示字元

按 `Win + R` 打開「執行」視窗，輸入 `cmd` 後按確定：

<div class="flex justify-center mt-2">
  <img src="/img/env/verify-01-run-cmd.png" class="shot shot-sm" />
</div>

<!--
按住鍵盤上的 Windows 鍵，再按 R，會跳出一個叫「執行」的小視窗。

在裡面輸入三個字母 cmd，按確定，就會開啟命令提示字元，也就是那個黑底白字的視窗。

⚠️ 這裡要提醒一件很重要的事：如果你剛剛才改過環境變數，一定要開一個「全新」的命令提示字元。已經開著的那個視窗，是在你改設定之前啟動的，它記住的還是舊的環境變數，怎麼試都不會對。

每年都有同學在這裡卡住半小時，最後發現只是視窗沒重開。
-->

---

# 驗證指令一：確認版本

```bash
java -version
```

預期看到類似這樣的輸出：

```text
openjdk version "21.0.12" 2026-07-15 LTS
OpenJDK Runtime Environment Temurin-21.0.12+8 (build 21.0.12+8-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.12+8 (build 21.0.12+8-LTS, mixed mode)
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>檢查兩件事：</b> 版本號是不是 <code>21</code>，以及有沒有出現 <code>Temurin</code> 字樣。
</div>

<!--
在命令提示字元裡輸入 java 空格減 version，按 Enter。

正常的話會吐出三行訊息。我們要看的重點只有兩個。

第一，版本號開頭是不是 21。如果跑出 17 或 1.8，代表你電腦上還有舊的 JDK，而且它在 Path 裡排在前面。回去用剛剛教的上移把 21 排到前面就好。

第二，有沒有 Temurin 這個字。有的話代表用到的是我們剛剛裝的那一份，沒有的話代表系統找到的是別套 JDK。

如果完全沒反應，跳出「不是內部或外部命令」，那就是 Path 沒設好，或者視窗沒重開。
-->

---

# 驗證指令二：確認來源（選用）

```bash
where java
```

輸出會顯示實際被使用的 `java.exe` 路徑：

```text
C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot\bin\java.exe
```

<!--
這個指令不是必要的，但我很推薦大家跑一次。

where java 會告訴你：系統實際上是從哪個資料夾找到 java.exe 的。

為什麼有用？因為當你電腦上有多個 JDK 的時候，java -version 只告訴你「版本是幾」，where java 才告訴你「它到底是哪一個檔案」。

如果輸出有好幾行，代表你的 Path 裡有多個 JDK。排在第一行的那個就是實際生效的。

以後在公司如果遇到「明明裝了 21，怎麼還是跑 17」這種鬼故事，第一個要下的指令就是這個。
-->

---

# 驗證失敗？照這張表排查

| 症狀 | 原因 | 怎麼修 |
| --- | --- | --- |
| `'java' 不是內部或外部命令` | Path 沒有 JDK 的 `bin` | 補進 Path，並**重開**命令提示字元 |
| 版本顯示 `17` 或 `1.8` | 有舊 JDK 排在前面 | 在 Path 用「上移」把 21 排前面 |
| Eclipse 說找不到 JDK | `JAVA_HOME` 沒設或指到 `\bin` | 改成 JDK 根目錄，結尾不含 `\bin` |
| 改完設定還是沒變 | 命令提示字元讀的是舊設定 | 關掉視窗重開；仍不行就登出再登入 |

<!--
這一頁請大家拍照或截圖存起來，之後同學問問題，八成都在這四行裡面。

第一種，說找不到 java 這個指令，一定是 Path 的問題，順便檢查視窗有沒有重開。

第二種，版本號不對，是多個 JDK 打架，用上移解決。

第三種，命令列明明正常，Eclipse 卻說找不到 JDK，那就是 JAVA_HOME 的問題，最常見的就是後面多加了 backslash bin。

第四種最玄，改完什麼都對就是沒生效。這種情況先把所有命令提示字元關掉重開；如果還是不行，Windows 登出再登入一次，通常就好了。

排查的心法是：先問「是命令列出問題還是 IDE 出問題」，這一句就能把範圍砍一半。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 安裝 Eclipse

<!--
JDK 這一段告一段落，恭喜大家，最麻煩的部分已經過了。

接下來裝 Eclipse。這一段步驟比較多，但幾乎都是點下一步，不太會出錯。
-->

---

# 為什麼需要 IDE？

只用記事本 + 命令提示字元寫 Java，每改一次程式就要重複三個動作：

| 動作 | 指令 | 問題 |
| --- | --- | --- |
| 存檔 | — | 打錯字要執行才知道 |
| 編譯 | `javac HelloWorld.java` | 錯誤訊息只有文字，要自己數行數 |
| 執行 | `java HelloWorld` | 每改一行就得重跑一次上面全部 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>IDE 做的事：</b> 把「編輯、編譯、執行、除錯」四件事收在同一個視窗，改完按一個鍵就跑。
</div>

<!--
在裝之前，我們先講為什麼要有 IDE。

如果只用記事本加命令提示字元，每改一次程式，你要做三個動作：存檔、打 javac 編譯、打 java 執行。改一行就要重來一次。

而且錯誤訊息只有一串文字，跟你說第 27 行有問題，你要自己回記事本數到第 27 行。

IDE 的英文全名是 Integrated Development Environment，整合開發環境。「整合」兩個字就是重點——它把編輯、編譯、執行、除錯這四件事收在同一個視窗裡。

我用個比喻：以前你要煮一道菜，得先去客廳拿食譜、去陽台拿鍋子、去房間拿計時器。IDE 就是把這些全部搬到廚房中島上，伸手就拿得到。

課程用 Eclipse，因為它免費、開源，而且業界很多公司在用。IntelliJ IDEA 和 VS Code 也很好，你以後可以自己試，語法都一樣，換 IDE 不用重學 Java。
-->

---

# 第一步驟：下載安裝檔

前往 [Eclipse 官方下載頁](https://www.eclipse.org/downloads/packages/)，找到 **Eclipse IDE for Java Developers**：

<div class="flex flex-col gap-2 items-center mt-2">
  <img src="/img/env/eclipse-01-download-page.png" class="shot" style="width: 60%; height: auto;" />
  <img src="/img/env/eclipse-01-1-download-page.png" class="shot" style="width: 60%; height: auto;" />
</div>

<!--
打開瀏覽器，網址是 eclipse.org 斜線 downloads 斜線 packages。

這個頁面會列出十幾個不同的 Eclipse 套件包，看起來很嚇人，但我們只需要其中一個。

往下捲，找到「Eclipse IDE for Java Developers」，注意是 Java Developers，不是 Enterprise Java。

找到之後，右邊會有 Windows、macOS、Linux 三行連結，選你自己作業系統對應的那一個，Windows 通常是 x86_64。

目前最新的版本是 2026-06，Eclipse 是一年出四次版本，用年份加月份當版本號，所以你看到的可能比這個新，沒關係，都可以。
-->

---

# 該下載哪一個套件？

| 套件名稱 | 適合誰 | 本課程 |
| --- | --- | --- |
| **Eclipse IDE for Java Developers** | 學 Java SE、寫一般 Java 程式 | ✅ 選這個 |
| Eclipse IDE for Enterprise Java and Web Developers | 寫 Web、JSP、Servlet | 之後學 Web 再換 |
| Eclipse IDE for C/C++ Developers | 寫 C/C++ | ❌ |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>好消息：</b> Eclipse 安裝檔本身自帶一份 JRE，所以就算你的 JDK 有問題，Eclipse 本身還是啟動得起來。
</div>

<!--
下載頁上套件很多，我把常見的三個列出來。

我們選第一個，Eclipse IDE for Java Developers。它包含了 Java 編輯器、Git 用戶端、XML 編輯器，還有 Maven 跟 Gradle 的整合，學 Java SE 完全夠用。

第二個 Enterprise Java and Web Developers 是給寫網頁後端用的，檔案大兩倍多，現在還用不到。之後你如果學到 Servlet、JSP，再回來換這個。

這邊補充一個蠻重要的觀念：Eclipse 的安裝檔裡面自帶一份 JRE，是給 Eclipse 自己啟動用的。所以就算你的 JDK 裝壞了，Eclipse 還是打得開。

但注意，那份自帶的 JRE 只給 Eclipse 自己用，不能拿來編譯你的程式。所以等一下我們還是要手動告訴 Eclipse「我的 JDK 21 在哪」。
-->

---

# 第二步驟：解壓縮並啟動

Windows 版下載回來是 `.zip`，解壓縮後找到 `eclipse.exe`，**雙擊（Double Click）** 啟動：

<div class="flex gap-4 justify-center items-start mt-2">
  <img src="/img/env/eclipse-02-unzip.png" class="shot shot-sm" />
  <img src="/img/env/eclipse-02-1-unzip.png" class="shot shot-sm" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 建議把解壓縮後的整個 <code>eclipse</code> 資料夾放到 <b>C 槽根目錄</b>或其他固定位置，之後不要再搬動。
</div>

<!--
Eclipse 跟 JDK 不一樣，它下載回來是一個壓縮檔，不是安裝精靈。

解壓縮之後會得到一個 eclipse 資料夾，裡面有一個 eclipse.exe，那個就是主程式。

這裡給大家兩個建議。

第一，把整個資料夾放到一個固定的地方，例如 C 槽根目錄。不要放在「下載」資料夾，因為那裡遲早會被你清掉。

第二，放好之後就不要再搬了。Eclipse 會記住很多相對路徑，搬家之後有時候會出現奇怪的錯誤。

順手做一件事：在 eclipse.exe 上按右鍵，選「釘選到工作列」，以後開比較快。
-->

---

# 什麼是 Workspace（工作區）？

第一次啟動 Eclipse，它會問你要把 Workspace 放在哪裡。

**Workspace 是 Eclipse 用來存放專案的資料夾**：你之後建立的每一個 Java 專案、每一支 `.java` 原始碼、還有 Eclipse 的個人設定，都會放在這裡面。

| 項目 | 說明 |
| --- | --- |
| 存什麼 | 所有 Java 專案、原始碼、專案設定 |
| 可不可以換 | 可以，`File → Switch Workspace` |
| 建議 | 選一個你找得到、而且不會誤刪的資料夾 |

<!--
第一次打開 Eclipse，它會先問你一個問題：Workspace 要放哪裡？

Workspace 中文叫工作區，它就是一個資料夾。你之後寫的每一個專案、每一支 .java 檔案，全部都會被放進這個資料夾。

我用個比喻：Workspace 就像你的書包。書包裡面放的是一本一本的課本，每一本課本就是一個專案。

三個提醒。第一，選一個你之後找得到的位置，不要按了確定就忘記在哪。第二，不要選桌面或下載資料夾，那些地方容易被清掉。第三，路徑裡盡量不要有中文和空白，雖然現在大多沒問題，但有些工具還是會出狀況。

如果選錯了也不用緊張，之後從 File 選單的 Switch Workspace 就可以換。
-->

---

# 選擇 Workspace 位置

<div class="flex justify-center mt-2">
  <img src="/img/env/eclipse-03-workspace.png" class="shot" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 勾選 <b>Use this as the default and do not ask again</b>，之後啟動就不會再問了。
</div>

<!--
這就是 Workspace 的選擇畫面。

上面那格是路徑，可以直接打，也可以按 Browse 選資料夾。我建議大家開一個專門的資料夾，例如 C 槽下面開一個 JavaWorkspace。

下面有一個勾選框，寫著「把這個設為預設，不要再問我」。建議勾起來，不然每次開 Eclipse 都要點一次，很煩。

勾好之後按 Launch，Eclipse 就會開始啟動。第一次啟動會比較久，大概要等個十幾二十秒，這是正常的，它在建立工作區的檔案結構。
-->

---

# Windows Defender 的詢問

部分電腦第一次啟動時，會跳出是否將 Eclipse 排除在防毒掃描之外：

| 選項 | 優點 | 缺點 |
| --- | --- | --- |
| **Exclude**（排除掃描） | 啟動和編譯明顯變快 | Eclipse 資料夾內的檔案不會被掃描 |
| **Keep**（保持掃描） | 安全性最高 | 啟動、編譯較慢，偶爾會卡頓 |

<div class="flex justify-center mt-2">
  <img src="/img/env/eclipse-04-defender.png" class="shot shot-sm" />
</div>

<!--
有些電腦第一次啟動 Eclipse 的時候，會跳出一個對話框，問你要不要把 Eclipse 排除在 Windows Defender 的即時掃描之外。

不是每台都會出現，沒看到的同學不用擔心，跳過這頁就好。

為什麼會問這個？因為 Eclipse 編譯的時候會在短時間內產生和讀寫大量的小檔案，防毒軟體每一個都要掃一遍，就會拖慢速度，有時候甚至會卡住。

我的建議是：如果是自己的電腦，或是課堂上的練習機，選排除，開發體驗會順很多。如果是公司發的電腦，有資安規範，那就照公司規定走，或者直接問資訊部門。

選錯也沒關係，之後在 Windows 安全性設定裡面隨時可以改。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 讓 Eclipse 認得 JDK 21

<!--
Eclipse 開起來了，但還不能馬上開始寫程式。

我們還要做一件事：告訴 Eclipse，我們要用哪一個 JDK 來編譯程式。
-->

---

# 為什麼還要設定 Installed JREs？

Eclipse 自帶的 JRE 只是**給 Eclipse 自己啟動用的**，不能拿來編譯我們的程式。

| 用途 | 用哪一個 Java |
| --- | --- |
| Eclipse 這個程式本身要跑起來 | Eclipse 內建的 JRE |
| 編譯與執行**你寫的**程式 | 你要指定的 JDK 21 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Installed JREs：</b> Eclipse 的「可用 Java 版本清單」。設定位置在 <code>Window → Preferences → Java → Installed JREs</code>。
</div>

<!--
這一頁解釋一個同學常有的疑問：我系統都裝好 JDK 21 了，環境變數也設了，為什麼 Eclipse 裡面還要再設一次？

原因是這兩個 Java 的角色不一樣。

Eclipse 本身也是一個 Java 程式，它自己要跑起來需要一份 Java，那就是安裝包裡自帶的那份 JRE。

但是「編譯你寫的程式」是另一件事，Eclipse 會用它的 Installed JREs 清單裡設定的那一個。這兩個可以不一樣，而且預設常常真的不一樣。

Installed JREs 你可以想成 Eclipse 的一份「可用 Java 版本清單」。清單裡可以放好幾個版本，然後指定其中一個當預設。

這個設計其實很實用：以後你在公司同時維護 Java 17 和 Java 21 的專案，兩個都加進清單，每個專案各自指定要用哪一個，不用一直重裝。
-->

---

# 打開 Installed JREs

**Window → Preferences → 左側 Java → Installed JREs**

<div class="flex justify-center mt-2">
  <img src="/img/env/eclipse-05-preferences-jre.png" class="shot" />
</div>

<!--
從上方選單的 Window 進去，選 Preferences，會跳出設定視窗。

這個視窗左邊是一棵樹，項目非常多。找到 Java，點開它，裡面有一項叫 Installed JREs，點下去。

如果覺得找起來很慢，設定視窗左上角有一個搜尋框，直接打 JRE，它就會幫你篩出來。

右邊會列出 Eclipse 目前知道的 Java 版本。如果你是照著我們的流程走，這裡通常只會有一筆，而且很可能不是我們要的 JDK 21，接下來我們把它加進去。
-->

---

# 加入 JDK 21 — 選擇 JRE 類型

按右邊的 **Add** → 選 **Standard VM** → 按 **Next**：

<div class="flex justify-center mt-2">
  <img src="/img/env/eclipse-06-add-jre-home.png" class="shot" />
</div>

<!--
按右邊的 Add 按鈕，會問你 JRE 的類型，選 Standard VM，按 Next。
-->

---

# 加入 JDK 21 — 指定 JRE Home

在 `JRE home` 指到 JDK 安裝資料夾：

<div class="flex justify-center mt-2">
  <img src="/img/env/eclipse-06-1-add-jre-home.png" class="shot" style="max-height: 340px; width: auto;" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>JRE home</code> 填 <b>JDK 根目錄</b>（例如 <code>...\jdk-21.0.12.8-hotspot</code>），路徑選對的話，下方函式庫清單會自動填滿。
</div>

<!--
這一頁只要填一個欄位：JRE home。按右邊的 Directory 按鈕，去選你的 JDK 資料夾。

還記得剛剛我請大家記一下安裝路徑嗎？就是這個時候用。路徑大概是 C 槽、Program Files、Eclipse Adoptium、jdk-21 開頭的那個資料夾。

這裡有一個很好用的自我檢查方法：路徑選對的話，下面那一大片 JRE system libraries 會自動跳出一堆 jar 檔。如果選完下面還是空的，代表你選錯資料夾了，通常是選到裡面的 bin 或外面一層。

JRE name 那格會自動幫你填好，不用改。確認完按 Finish。
-->

---

# 設為預設版本

回到清單頁，把 **JDK 21 那一列前面的核取方塊打勾**，讓它成為預設：

<div class="flex justify-center mt-2">
  <img src="/img/env/eclipse-07-jre-checked.png" class="shot" style="max-height: 340px; width: auto;" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 打勾之後按 <b>Apply and Close</b>。沒按 Apply，設定不會生效。
</div>

<!--
按完 Finish 會回到清單頁，這時候你會看到清單裡多了一筆 jdk-21。

但是加進來還不夠——要在它前面的方框打勾，它才會變成「預設」的版本。有打勾的那一個，才是之後新專案預設會用的 Java。

打勾之後，記得按右下角的 Apply and Close。這是很多人會忘記的一步，設定完直接按叉叉關掉，剛剛做的全部白做。

按完之後 Eclipse 可能會問你要不要重新編譯專案，按 Yes 就好。

到這裡，Eclipse 的設定就完成了。接下來我們來建第一個專案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 跑出第一支程式

<!--
最後一段，也是最有成就感的一段。

我們要在 Eclipse 裡面建立一個專案，寫一支程式，然後讓它印出「Hello, World!」。

跑出來的那一刻，這一章就算完成了。
-->

---

# 建立 Java Project

**File → New → Java Project**

<div class="flex justify-center mt-2">
  <img src="/img/env/project-01-new-java-project.png" class="shot" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 如果 New 選單裡沒有 Java Project，選 <code>Other...</code> → 展開 <code>Java</code> → 選 <code>Java Project</code>。
</div>

<!--
從左上角的 File 選單進去，選 New，再選 Java Project。

有些同學的 New 選單裡面找不到 Java Project，這很正常，因為 Eclipse 的選單會依照你目前的視角動態調整。這種時候選最下面的 Other，會跳出一個大清單，展開 Java 那一類，裡面就有 Java Project。

專案這個概念解釋一下：一個專案就是一個獨立的程式。你這學期會建很多個專案，每個練習一個，它們彼此不會互相影響。
-->

---

# 專案名稱與 JRE 版本

<div class="flex justify-center mt-2">
  <img src="/img/env/project-02-project-name.png" class="shot" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>順便驗收：</b> 中間的 JRE 區塊應該顯示 <code>JavaSE-21</code>。如果顯示別的版本，代表前面的 Installed JREs 沒設好。確認無誤後，點擊 <b>Finish</b> 完成建立。
</div>

<!--
這一頁只要填一個東西：專案名稱。我們打 HelloWorld。

但我要大家順便看一個地方——畫面中間有一區叫 JRE，裡面會顯示這個專案要用哪一個 Java 版本。

如果我們前面的 Installed JREs 設對了，這裡應該會顯示 JavaSE-21。

這是一個很好的驗收點。如果這裡顯示 JavaSE-17 或別的版本，先不要按 Finish，回去 Preferences 把 Installed JREs 重新設一次。

下面還有一個選項會問你要不要建立 module-info.java 檔案。這是 Java 9 之後的模組系統，我們現在用不到，如果跳出來問，選 Don't Create。

其他都用預設值，按 Finish。
-->

---

# 建立 package

在 `src` 上按右鍵 → **New → Package**：

<div class="flex justify-center mt-2">
  <img src="/img/env/project-03-new-package.png" class="shot" />
</div>

<!--
專案建好之後，左邊的 Package Explorer 會出現 HelloWorld 這個專案，展開它會看到一個 src 資料夾。src 是 source 的縮寫，你的原始碼都放在這裡。

在 src 上按右鍵，選 New，再選 Package。
-->

---

# 建立 package — 命名為 hello

<div class="flex justify-center mt-2">
  <img src="/img/env/project-03-1-new-package.png" class="shot" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>package 是什麼：</b> 用來分類程式碼的資料夾，避免不同來源的類別名稱撞在一起。第 21 章會詳細介紹。輸入完 Name 後，點擊 <b>Finish</b> 完成建立。
</div>

<!--
Name 那一格打一個名字，我們用 hello。

package 是什麼？簡單講就是分類用的資料夾。

我用生活的例子：你的衣櫃如果全部衣服堆在一起，找東西很痛苦。分成上衣、褲子、外套幾個抽屜，就好找多了。package 就是程式碼的抽屜。

還有一個更實際的理由：如果你寫了一個 Student 類別，別人也寫了一個 Student，兩個放在一起就撞名了。有了 package，一個叫 hello.Student，一個叫 school.Student，就分得開。

這個觀念第 21 章會完整講，現在先照著做就好。

打好名字之後按 Finish。
-->

---

# 建立 class

在 `hello` 上按右鍵 → **New → Class**：

<div class="flex justify-center mt-2">
  <img src="/img/env/project-04-new-class.png" class="shot" />
</div>

<!--
接著在剛剛建好的 hello 這個 package 上按右鍵，選 New，選 Class。
-->

---

# 建立 class — 命名為 HelloWorld

<div class="flex justify-center mt-2">
  <img src="/img/env/project-04-1-new-class.png" class="shot" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>務必勾選</b> <code>public static void main(String[] args)</code>，Eclipse 會自動幫你產生程式的進入點。填好後點擊 <b>Finish</b> 完成建立。
</div>

<!--
Name 那一格打 HelloWorld。注意這裡有一個 Java 的命名規則：類別名稱第一個字母要大寫，而且每個單字的開頭都大寫，所以是 HelloWorld，H 跟 W 都大寫。這叫大駝峰式命名，第 3 章會詳細講。

然後畫面中間有幾個勾選框，其中一個是 public static void main String 括號 args。這一項一定要勾。

勾了之後，Eclipse 會自動幫你把 main 方法的骨架寫好。main 是程式的進入點，Java 程式一定是從 main 開始跑的。你如果沒勾，等一下要自己一個字一個字打，很容易打錯。

打好、勾好，按 Finish。
-->

---

# 撰寫程式碼

在 `main` 方法裡加入一行輸出：

```java
package hello;

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

<!--
Finish 之後，Eclipse 會自動打開編輯器，裡面已經有 package 那一行、class 那一行、還有 main 方法的空殼。

我們只要在 main 的大括號裡面加一行：System.out.println 括號，雙引號 Hello, World! 雙引號，括號，分號。

這一行的意思就是「把括號裡的文字印到主控台」。println 最後那個 ln 是 line 的意思，代表印完會換行。

三個容易錯的地方我先提醒。第一，Java 每一個敘述結尾都要分號，忘了打會直接編譯錯誤。第二，雙引號要用英文的，不能用中文全形的引號。第三，System 的 S 要大寫。

這三個是初學者百分之九十的編譯錯誤來源，大家先有印象。

寫完記得存檔，按 Ctrl + S。Eclipse 存檔的同時就會自動編譯，如果程式碼旁邊有紅色的叉叉，代表有錯，先修好再往下。
-->

---

# 執行程式

在 `HelloWorld.java` 上按右鍵 → **Run As → Java Application**

<div class="flex justify-center mt-2">
  <img src="/img/env/project-05-run-as.png" class="shot shot-sm" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>快捷鍵：</b> <code>Ctrl + F11</code> 可以直接執行上一次跑過的程式。
</div>

<!--
程式寫好了，來執行。

在編輯器裡面按右鍵，或是在左邊 Package Explorer 的 HelloWorld.java 上按右鍵，選 Run As，然後選 Java Application。

Run As 底下可能有好幾個選項，我們選 Java Application 這一個。

第一次執行的時候，Eclipse 可能會問你要不要先存檔，勾「always save」然後按 OK，以後就不會再問。

熟練之後可以用快捷鍵 Ctrl + F11，直接重跑上一次執行的程式，寫程式的時候會一直用到。
-->

---

# 看到輸出，環境就完成了

<div class="flex justify-center mt-2">
  <img src="/img/env/project-06-console-output.png" class="shot" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
🎉 下方 <b>Console</b> 面板出現 <code>Hello, World!</code> — 從 JDK 到 Eclipse 的整條路徑都通了。
</div>

<!--
下面的 Console 面板跳出 Hello, World! 這行字，恭喜大家，環境完成了。

這一行字看起來很簡單，但它其實驗證了一整條路徑：Eclipse 找到了 JDK，JDK 的 javac 把你的 .java 編譯成 .class，然後 JVM 把 .class 執行起來，最後把結果送回 Console。

上一章講的那些理論，在這一行輸出裡全部走過一遍了。

如果 Console 沒有出現東西，先確認三件事：Console 面板有沒有被關掉、程式有沒有存檔、還有 main 方法是不是真的存在。
-->

---

# 使用開發環境的注意事項

| 注意事項 | 說明 |
| --- | --- |
| 改完環境變數要重開視窗 | 已開啟的命令提示字元讀的是舊設定 |
| `JAVA_HOME` 結尾不加 `\bin` | 工具會自己接 `\bin`、`\lib` |
| Eclipse 設定完要按 `Apply and Close` | 直接關視窗，設定不會存檔 |
| Eclipse 資料夾放好就不要搬 | 搬動後容易出現路徑相關的怪錯誤 |

<!--
這一頁把整章最容易踩的坑集中起來，建議大家截圖存著。

第一個，改完環境變數要重開視窗，這個我講了三次，因為它真的最常發生。

第二個，JAVA_HOME 結尾不要加 bin。記法很簡單：JAVA_HOME 是「Java 的家」，家的地址不會寫到房間門口。

第三個，Eclipse 設定完一定要按 Apply and Close。

第四個，Eclipse 資料夾放好就不要搬家。

這四個加起來，可以解決你未來八成的環境問題。
-->

---

# 總結

- **JDK 是必要的，Eclipse 是讓事情變輕鬆的** — 沒有 JDK 一行 Java 都跑不動
- **本課程使用 Eclipse Temurin JDK 21 (LTS)** — 免費、TCK 認證、業界最通行
- **`JAVA_HOME` 負責宣告位置，`Path` 負責讓系統找得到指令** — 兩個要搭配
- **Eclipse 的 Installed JREs 是獨立設定** — 系統裝好 JDK 不代表 Eclipse 就會用它
- **驗收標準是 Console 印出 `Hello, World!`** — 代表整條編譯執行路徑都通了

<!--
我們把這一章整理成五個重點。

第一，JDK 必要，Eclipse 是加分。分清楚這兩個的角色，出問題時才知道該懷疑誰。

第二，我們用 Eclipse Temurin JDK 21，是 LTS 長期支援版。

第三，JAVA_HOME 和 Path 的分工：一個是宣告，一個是實際使用。這是整章最重要的觀念，也是以後最常需要處理的地方。

第四，Eclipse 的 Installed JREs 是另一套獨立設定，不會自動跟著系統走，要自己設。

第五，驗收標準只有一個：Console 印出 Hello, World。印出來就代表 Eclipse、JDK、JVM 這整條路都通了。

下一章我們就要正式開始寫程式，來拆解這支 HelloWorld 到底每一行在做什麼。今天大家辛苦了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
有沒有問題？

環境設定這種東西，最怕的就是自己一個人卡住。現在趁大家都在，有任何一步沒跟上，或是畫面跟我不一樣，都提出來。

沒問題的同學可以先幫旁邊的人看一下，通常互相看兩眼就找到問題了。
-->
