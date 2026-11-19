---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Java 套件 (Package)（進階／自學）
routeAlias: ch21
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
    Java Programming Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    套件 (Package)
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到套件的進階自學篇！基礎版我們已經學會了怎麼用套件整理程式碼、用存取修飾詞控制權限，這裡要再往上一層，看看 Java 9 之後的「模組系統」。

【為什麼要學這個？】
想像我們的套件已經整理得很整齊了，但專案越長越大，第三方函式庫越用越多，這時候光靠「套件 + public/private」這兩層權限，已經不太夠用了。我們會遇到「我明明把方法標成 public，卻不想讓所有人都看到」這種兩難。

【學習目標】
學完這份內容後，我們會知道「模組（Module）」是什麼、`module-info.java` 怎麼寫、`requires` 和 `exports` 各自的作用，並能用一個小範例感受「比 public 更精細」的存取控制是怎麼運作的。
-->

---
layout: default
---

# Outline

- **Java 模組系統 (JPMS)** — 為什麼需要模組、`module-info.java`、`requires`/`exports`
- **實作練習**

<!--
【帶讀大綱】
這份自學內容只有一個大主題：JPMS，也就是 Java 9 開始的模組系統。我們會從「為什麼需要它」開始，一路講到怎麼宣告模組、怎麼控制誰能用誰。

【重點預告】
模組系統不是寫小程式的必備知識，但理解它之後，再去看 Spring Boot、各種框架的依賴管理時，會更清楚「這些 jar 之間到底是怎麼互相看見的」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Java 模組系統（JPMS，JDK 9）

<!--
【段落轉換】
JDK 9 之後，Java 搞了一個更高層級的「模組系統」。這就像是從「整理抽屜」升級到「整理整個倉庫」。
-->

---
layout: default
---

# 為什麼需要模組系統？

| 套件（Package）的限制 | 說明 |
| --- | --- |
| classpath 地獄 | 大型專案有幾百個 JAR，版本衝突難以管理 |
| 存取控制不夠精確 | `public` 類別對整個 JVM 都可見，無法限制套件間的存取 |
| JDK 本身太龐大 | 嵌入式裝置也要帶整個 JDK |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>模組（Module）</b>是一組套件的集合，明確宣告「我提供什麼」與「我需要什麼」，讓相依關係清晰可見
</div>

<!--
【問題說明】
模組系統解決了「Classpath 地獄」。以前你可能會有三個不同版本的同一個 JAR 包，編譯器就像在抽籤一樣，抽到哪個算哪個，搞得大家很崩潰。
-->

---
layout: default
---

# 什麼是模組（Module）？

「模組」是比套件更大的一層容器：**一組套件的集合，加上一份『使用說明書』**。

| 層級 | 範圍 | 存取控制 |
| --- | --- | --- |
| 類別 (Class) | 單一檔案 | `private` / `protected` / `public` |
| 套件 (Package) | 一組類別 | package-private（預設） |
| 模組 (Module) | 一組套件 | `exports`（決定哪些套件可被外部看見） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵差異：</b>過去只要套件裡的類別是 <code>public</code>，整個 JVM 都能用；模組系統可以讓「<code>public</code> 但沒有 <code>exports</code> 的套件」對外完全隱藏
</div>

<!--
【情境切入】
我們在基礎版學過：類別內的成員可以用 private 藏起來，但「整個套件」對外面的人來說，只要套件內的類別是 public，外部就能直接 import 來用，完全擋不住。

【概念定義】
模組就是再往外包一層：「這個模組裡有哪些套件，我自己決定哪些要 `exports` 給別人看，沒有 export 的套件，就算裡面的類別是 public，外部模組也拿不到」。

【生活化比喻】
這就像一間公司：套件是「部門」，部門內的同事（package-private）可以互相借東西；但公司大門（模組）會決定「哪個部門可以對外接待客人（exports）」，沒被授權對外的部門，就算裡面的人很大方（public），客人也進不去那個樓層。
-->

---
layout: default
---

# `module-info.java`

模組用 `module-info.java` 宣告，放在**模組的根目錄**：

```java
// src/module-info.java
module com.example.myapp {
    requires java.sql;
    requires com.google.gson;

    exports com.example.model;
    exports com.example.service to com.example.ui;
}
```

| 關鍵字 | 說明 |
| --- | --- |
| `module` | 宣告模組名稱 |
| `requires` | 宣告依賴哪些模組 |
| `exports` | 宣告哪些套件對外開放 |

<!--
【帶讀語法】
module-info.java 是模組的宣告檔。

【精確控制】
你可以精確到說：我的這個套件，只開放給隔壁的 ui 模組看，其他人通通不准看！這比 public 更有威嚴，簡直就是程式碼界的 VIP 俱樂部。
-->

---
layout: default
---

# 兩個模組互動的最小範例

假設有兩個模組：`greeting`（提供問候服務）與 `app`（使用它）：

```
greeting/
└── src/
    ├── module-info.java        ← module greeting { exports com.greet; }
    └── com/greet/Hello.java     ← public class Hello { ... }

app/
└── src/
    ├── module-info.java        ← module app { requires greeting; }
    └── com/app/Main.java        ← import com.greet.Hello;
```

<!--
【範例目的】
這個範例示範最常見的「一個模組提供功能、另一個模組使用它」的情境，對應到我們之後在框架裡常看到的「核心模組」與「應用模組」關係。

【帶讀關鍵行】
`greeting` 模組的 `module-info.java` 用 `exports com.greet;` 開了一道門；`app` 模組用 `requires greeting;` 表示「我要用 greeting 提供的東西」。兩邊缺一不可。

⚠️ 易錯點提醒：
如果 `greeting` 沒有 `exports com.greet;`，即使 `com.greet.Hello` 是 `public class`，`app` 模組依然無法 `import` 它——這就是模組系統比 `public` 更嚴格的地方。

【預期結果】
`app` 編譯成功，`Main` 可以建立 `Hello` 物件並呼叫其方法；若拿掉 `exports`，編譯器會直接報錯，提示 `com.greet` 套件未對 `app` 模組開放。
-->

---
layout: default
---

# JDK 模組化

JDK 本身從 JDK 9 起已模組化：

```
java.base      ← 所有模組的基礎，自動包含（java.lang、java.util 等）
java.sql       ← JDBC 資料庫
java.xml       ← XML 處理
java.desktop   ← AWT/Swing GUI
java.net.http  ← HTTP Client（JDK 11）
```

```java
// 查看目前 JDK 所有模組
java --list-modules

// 查看特定模組的套件內容
java --describe-module java.base
```

<!--
【帶讀說明】
現在連 Java 自己都模組化了。

【實際影響】
如果你只需要做數學運算，你就不用帶著整個 java.desktop 那種笨重的圖形介面。這讓你的程式可以瘦身，在雲端跑起來更輕快。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
學完模組系統的基本概念，來動手寫一份 module-info.java，把今天學到的 requires/exports 用上去。
-->

---
layout: default
---

# 練習 1 (綜合)：設計模組宣告檔
### 任務說明

延續基礎版「學生管理系統」的套件結構：

```
com.school.model     ← Student 類別
com.school.service   ← StudentService 類別（使用 Student）
com.school           ← Main（使用 Student、StudentService）
```

請將這三個套件包成**一個模組** `school.app`，撰寫對應的 `module-info.java`：

1. 模組名稱為 `school.app`
2. `exports com.school.model`，讓其他模組也能使用 `Student`
3. `exports com.school.service`，但**只開放給** `school.ui` 模組使用

<!--
【任務鋪陳】
我們在基礎版設計好了 `com.school.model`、`com.school.service`、`com.school` 三個套件，現在試著把它們包成一個模組，並決定「哪些套件要對外開放、開放給誰」。

【引導思考】
想想看：`Student` 這個資料模型，未來可能會被很多其他模組重複使用，要不要開放給「所有」模組？而 `StudentService` 比較像是內部商業邏輯，如果只想讓特定的 UI 模組使用，`exports ... to ...` 要怎麼寫？
-->

---
layout: default
---

# 練習 1 (綜合)：解題提示
### 提示說明

1. 第一行用 `module school.app { ... }` 宣告模組名稱
2. `exports com.school.model;`：不指定 `to`，代表對**所有模組**開放
3. `exports com.school.service to school.ui;`：只對 `school.ui` 模組開放
4. `com.school`（含 `Main`）不需要 `exports`，因為它是程式進入點，不需要被其他模組引用

```java
// src/module-info.java
module school.app {
    exports com.school.model;
    exports com.school.service to school.ui;
}
```

<!--
【帶讀解法】
這題的重點不是新語法，而是「決策」：哪個套件要公開給所有人、哪個套件要限定對象、哪個套件完全不公開。

💼 業界實務：
在真實專案中，資料模型（model／DTO）通常會盡量開放給多個模組共用，但商業邏輯（service）則會視情況限制只給特定模組使用，避免其他團隊繞過你設計好的服務層，直接呼叫內部邏輯。
-->

---
layout: end
---

# 課程結束
### 感謝聆聽，有問題請發問！

<!--
[收尾]
這份自學內容到這裡就結束了！我們從「為什麼套件不夠用」出發，認識了模組（Module）這個更大的容器，也學會了 `module-info.java` 裡 `module`、`requires`、`exports` 的用法。下次看到大型專案或框架裡一堆 module-info.java，就知道它們在做什麼了。
-->
