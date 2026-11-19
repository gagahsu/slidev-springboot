---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Java 程式從零開始
routeAlias: ch03
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Java Programming Masterclass</p>
  <h1 style="color: #1a5c5c; font-size: 3.4rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">Java 程式從零開始</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「從 Hello World 出發，讀懂每一行程式碼的意義」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到 Java 的世界。從今天開始，我們要從零開始，一步一步認識 Java 程式長什麼樣子。

想像一下，我們要去一個陌生的國家旅遊，第一件事情通常是學會怎麼打招呼。寫程式也是一樣，幾乎每一種程式語言，第一個範例都是讓電腦印出一句話，這就是經典的「Hello World」。雖然只有短短幾行，但這幾行裡面藏著 Java 程式的基本骨架——之後我們寫的所有程式，都是從這個骨架慢慢長大的。

為什麼要學這個？因為如果連最基本的程式結構都看不懂，後面遇到比較複雜的程式碼時，會完全抓不到重點，不知道哪一段在做什麼。

這一章學完之後，大家會知道怎麼寫出第一個能跑的 Java 程式、看懂程式裡每一行在做什麼，還會學到怎麼幫程式碼寫註解，讓自己（或之後接手的人）能看懂這段程式的用意。
-->

---
layout: default
---

# Outline

- **我的第一個 Java 程式**
- **解析 Java 的程式結構**
- **程式註解**

<!--
這一章分成三個小節：第一節我們會實際動手，寫出並執行第一個 Java 程式；第二節把這個程式拆開來看，了解每一段在做什麼；第三節學怎麼幫程式加上註解。

看起來項目不多，但這三節其實是後面所有章節的地基。就像蓋房子一樣，地基打得不穩，之後蓋得越高，問題就會越明顯。所以這一章雖然程式碼很短，但每一個細節都值得我們花時間搞清楚。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 我的第一個 Java 程式

<!--
這一節我們要動手寫出第一個 Java 程式。在動筆之前，會先確認大家的電腦環境準備好了，接著實際寫一個會印出文字的程式，再學怎麼讓它真正跑起來。
-->

---

# 回顧：Ch 2 已經完成的環境

開始寫程式之前，先花三十秒確認環境還是好的：

```bash
java -version
# openjdk version "21.0.12" ... Temurin-21.0.12+8
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 跑不出來、或版本不對？完整的安裝與排查步驟在 <Link to="ch02">Ch 2 開發環境安裝</Link>。
</div>

<!--
在開始寫程式之前，我們先花三十秒確認環境還是正常的。

打開命令提示字元，輸入 java 減 version，應該要看到版本 21，還有 Temurin 這個字。有看到就代表 Ch 2 裝的東西都還在，我們可以往下走。

如果跑不出來，或是版本不對，先不要慌，也不要現在重裝。Ch 2 最後有一張排查表，把常見的四種狀況都列出來了，下課再照那張表處理就好。

這裡順便講一個工作上的習慣：工程師拿到一台新電腦、或是接手別人的專案，第一件事幾乎都是先跑 java -version，確認環境版本對不對。因為不同專案用的 JDK 版本常常不一樣，版本不對，程式可能跑不起來，或是行為跟預期不一致。養成先確認環境的習慣，可以省下很多冤枉時間。
-->

---

# 我的第一個 Java 程式

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>檔名規則：</b>檔名必須與 <code>public class</code> 的名稱完全一致（含大小寫），副檔名為 <code>.java</code>。<br>
→ 上方程式碼必須存為 <b>HelloWorld.java</b>
</div>

<!--
這一頁是我們的第一個完整 Java 程式，雖然只有短短幾行，但裡面的每一個字都不是多餘的。

先看 `public class HelloWorld`，這是在宣告一個叫做 HelloWorld 的 class（類別），可以理解成幫這個程式取了一個名字。再往下看 `public static void main(String[] args)`，這是程式真正開始執行的地方，最後 `System.out.println("Hello, World!")` 就是負責把文字印出來的那一行。

⚠️ 這裡有一個非常容易踩到的地雷：檔名必須跟 `public class` 的名稱完全一致，包括大小寫，所以這份程式碼一定要存成 `HelloWorld.java`，差一個字母都會出錯。另外大家也要留意，`String` 的開頭是大寫 S，跟我們之後會學到的小寫的基本型別不太一樣，這個寫法上的細節，編譯器是不會放過我們的。

只要檔名跟內容都對，編譯並執行之後，畫面上就會出現一行 `Hello, World!`。
-->

---

# 編譯與執行

| 步驟 | 指令 | 說明 |
| --- | --- | --- |
| **1. 編譯** | `javac HelloWorld.java` | 產生 `HelloWorld.class`（Bytecode）|
| **2. 執行** | `java HelloWorld` | JVM 載入 class，從 main 方法開始執行 |

```bash
# 終端機輸入
javac HelloWorld.java
java HelloWorld

# 輸出結果
Hello, World!
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b>執行時寫 <code>java HelloWorld.class</code> 會出錯！正確寫法是 <code>java HelloWorld</code>（不加 .class）。
</div>

<!--
寫好程式碼之後，還不能直接執行，要先經過兩個步驟。

第一步是用 `javac HelloWorld.java` 把我們寫的程式碼編譯成電腦看得懂的格式，也就是 Bytecode，這時候會多出一個 `HelloWorld.class` 檔案。第二步才是用 `java HelloWorld` 真正執行這個程式，JVM 會載入這個 class，並從 `main` 方法開始往下執行。

⚠️ 易錯點：執行的時候指令是 `java HelloWorld`，不要加 `.class`。如果不小心打成 `java HelloWorld.class`，Java 會去找一個叫 `HelloWorld.class` 的 class，結果當然找不到，就會出現錯誤訊息。

執行成功的話，畫面上就會看到 `Hello, World!` 這一行輸出。
-->

---
layout: default
---

# 🎬 AI 協作時刻：讓 AI 當你的除錯小老師

以後遇到編譯錯誤，不要慌，先學會怎麼問 AI，把錯誤訊息變成學習機會：

**要用的 Prompt：**

> 我執行 Java 程式時出現這個錯誤訊息（貼上完整錯誤訊息），
> 請用中文解釋這是什麼意思、最常見的原因是什麼，
> 並用條列式列出 3 個檢查步驟，先不要直接給我改好的程式碼。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>養成好習慣：</b> 刻意要求 AI「先不要給答案」，逼自己照著檢查步驟找出問題，比直接複製修好的程式碼更能訓練除錯能力。
</div>

<!--
【操作提示】
現場故意打錯一個指令（例如打成 java HelloWorld.class），把終端機的錯誤訊息完整貼給 AI，示範怎麼用這個 prompt 得到解釋而不是答案。

【收斂一句話】
錯誤訊息不是敵人，是 AI 幫你除錯的線索——養成先問「為什麼」再問「怎麼改」的習慣。
-->

---
layout: default
---

# 練習 1：找出編譯與執行的錯誤
### 任務說明

阿明寫了一個程式，存檔為 `helloworld.java`：

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

他接著在終端機輸入：

```bash
javac helloworld.java
java HelloWorld.class
```

結果出現了兩個錯誤訊息。請指出**錯在哪裡**，並寫出正確的操作方式。

<!--
【任務鋪陳】
這題故意把剛剛學到的兩個「規則」都寫錯一次，讓大家在親自踩雷之前，先在腦中模擬一次「電腦會怎麼抱怨」。

【引導思考】
第一個錯誤跟「檔名」有關，第二個錯誤跟「執行指令的寫法」有關。回頭看看「我的第一個 Java 程式」跟「編譯與執行」這兩頁的提示框，分別對應哪個錯誤？

【等待與觀察】
給大家 3 分鐘。如果想不出第一個錯誤，提示：檔名跟 `public class` 後面的名字，有什麼規則？
-->

---
layout: default
---

# 練習 1：找出編譯與執行的錯誤
### 解題提示

**錯誤一：檔名與類別名稱不一致**
- `public class HelloWorld` 要求檔名必須是 `HelloWorld.java`（含大小寫），不能是 `helloworld.java`
- 修正：將檔案存成 `HelloWorld.java`

**錯誤二：執行指令多寫了 `.class`**
- 執行時應輸入 `java HelloWorld`，不需要（也不能）加 `.class`
- 修正指令：

```bash
javac HelloWorld.java
java HelloWorld
```

<!--
【帶讀解法】
這兩個錯誤都是「規則」層級的錯誤，不是程式邏輯錯誤——程式碼本身完全正確，但檔名跟指令沒對齊規則，電腦就會直接拒絕執行。這也是初學者最常卡住、卻最容易忽略的地方，先養成檢查這兩點的習慣，能省下很多除錯時間。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 解析 Java 的程式結構

<!--
能跑出 Hello World 是第一步，但如果完全不知道每一行在做什麼，之後遇到複雜一點的程式碼就會無從下手。這一節我們要把剛剛那個程式拆開來看，逐個了解每一部分的作用，包括 class 的宣告、`main` 方法的寫法、輸出的方式，以及命名上的慣例。
-->

---

# Java 程式完整結構

```java
// 1. 套件宣告（可省略）
package com.example;

// 2. 匯入外部類別（視需求）
import java.util.Scanner;

// 3. 類別宣告
public class HelloWorld {

    // 4. main 方法：程式進入點
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

<!--
一個完整的 Java 檔案，通常會包含這四個部分，而且順序是固定的。

最上面的 `package` 是套件宣告，可以理解成這個程式碼的「地址」，告訴 Java 這個類別放在專案裡的哪個位置，這一行是可以省略的。接下來的 `import` 是用來引入其他人寫好的類別，讓我們可以直接拿來用，不用自己重新寫一份。中間是 `class` 宣告，這是程式的主體，定義了我們要寫的這個類別。最後面的 `main` 方法，是整個程式真正開始執行的入口——如果沒有 `main` 方法，這個程式就只是一堆躺在那裡、不會被執行的程式碼。

之後寫的每一個 Java 程式，大致上都會照這個順序排列。
-->

---

# class 宣告解析

```java
public class HelloWorld {
    // ...
}
```

| 關鍵字 | 說明 |
| --- | --- |
| `public` | 存取修飾詞：這個類別對所有人公開 |
| `class` | 宣告這是一個「類別」定義 |
| `HelloWorld` | 類別名稱，**首字母大寫**（Pascal Case）|
| `{ }` | 大括號包住類別的所有內容（類別本體）|

<!--
我們可以把 `class`（類別）想成一個收納用的抽屜，每個抽屜都有自己的用途和名字，裡面只放跟這個用途相關的東西。比如說一個放襪子的抽屜，就不會把內衣褲也塞進去，而是另外準備一個抽屜來放。

回到程式碼上，`public` 是存取修飾詞，表示這個類別可以被其他地方自由使用；`class` 是關鍵字，宣告接下來要定義一個類別；`HelloWorld` 是類別名稱，依照慣例第一個字母要大寫，也就是 Pascal Case；外層的大括號則是把這個類別的所有內容包在裡面。

業界實務上，工程師通常不會把所有功能都塞進一個檔案裡，而是依照功能拆成多個 class，每個 class 各司其職，這樣的做法叫做模組化，可以讓程式碼更容易維護和理解。
-->

---

# main 方法完整解析

```java
public static void main(String[] args) {
    // 程式從這裡開始執行
}
```

| 關鍵字 | 說明 |
| --- | --- |
| `public` | JVM 必須能從外部呼叫這個方法，所以要公開 |
| `static` | 不需要建立物件就能呼叫，JVM 直接呼叫類別的方法 |
| `void` | 這個方法不回傳任何值 |
| `main` | 固定名稱，JVM 啟動時尋找這個方法作為進入點 |
| `String[] args` | 命令列引數，從終端機傳入的字串陣列 |

<!--
`public static void main(String[] args)` 這一整行，可以說是 JVM 和我們的程式之間的一個固定約定，每個關鍵字都有它的作用。

`public` 表示這個方法要能被 JVM 從外部呼叫；`static` 表示不需要先建立物件，就可以直接呼叫這個方法；`void` 表示這個方法執行完之後不會回傳任何值；`main` 是固定的名稱，JVM 啟動程式時，就是去找這個名字的方法當作起點；`String[] args` 則是用來接收從命令列傳進來的參數。

⚠️ 易錯點：這幾個關鍵字缺一不可，也不能寫錯，比如漏掉 `static` 或把 `main` 拼錯，JVM 就找不到程式的進入點，程式會直接執行失敗。`String[] args` 現在還用不到，先記住它的寫法、知道它存在就好，之後會用到它的時機自然會再說明。
-->

---

# 控制台輸出方法

| 方法 | 說明 | 差異 |
| --- | --- | --- |
| `System.out.println(x)` | 印出 x 並**換行** | 最常用 |
| `System.out.print(x)` | 印出 x，**不換行** | 接續下一行輸出 |
| `System.out.printf(fmt, ...)` | 格式化輸出，類似 `String.format` | 控制小數位、對齊 |

```java
System.out.println("Hello");  // Hello（換行）
System.out.print("World");    // World（不換行）
System.out.printf("%.2f%n", 3.14159); // 3.14（換行）
```

<!--
這幾個方法是程式對外輸出文字的方式，差別在於輸出之後要不要換行，以及要不要做格式化。

`println` 印出內容之後會自動換行，是我們最常用的；`print` 印出內容之後不會換行，下一個輸出會接在同一行；`printf` 則是格式化輸出，可以指定小數位數、對齊方式等，裡面的 `%n` 是換行符號，在不同作業系統上都能正確換行。

業界實務上，`System.out.println` 多用在學習或簡單測試的階段。在正式的伺服器專案裡，通常會改用 Logger 這類工具來輸出訊息，因為可以控制要不要輸出、輸出到哪裡，比直接印在畫面上更有彈性，這個之後會接觸到。
-->

---

# 命名慣例總整理

| 對象 | 命名規則 | 範例 |
| --- | --- | --- |
| **類別名稱** | Pascal Case（每字首字母大寫）| `HelloWorld`, `BankAccount` |
| **方法名稱** | camelCase（第一字小寫，後續字首大寫）| `printMessage`, `calculateSum` |
| **變數名稱** | camelCase | `userName`, `totalScore` |
| **常數名稱** | 全大寫，底線分隔 | `MAX_SIZE`, `PI` |
| **套件名稱** | 全小寫，用點分隔 | `com.example.app` |

<!--
這一頁整理了 Java 裡常見的命名慣例，建議大家從一開始就養成習慣，而不是等到習慣了不好的寫法之後再改。

類別名稱用 Pascal Case，也就是每個單字的開頭都大寫，例如 `HelloWorld`；方法和變數用 camelCase，第一個字母小寫、後面每個單字開頭大寫，例如 `printMessage`；常數則是全部大寫，單字之間用底線分隔，例如 `MAX_SIZE`；套件名稱全部小寫，用點分隔。

業界實務上，命名是不是清楚，直接影響到別人（甚至是未來的自己）能不能看懂這段程式碼在做什麼。如果變數都叫 `a`、`b`、`c`，過一段時間回來看，連自己都會看不懂當初寫的是什麼，所以遵守命名慣例，其實也是在替自己省麻煩。
-->

---
layout: default
---

# 🎬 AI 協作時刻：為什麼找不到 main 方法？

把 `main` 方法的關鍵字漏寫或寫錯一個字，JVM 就會直接說「找不到進入點」，這是新手最常撞見的執行期錯誤之一：

**要用的 Prompt：**

> 我執行 `java HelloWorld` 時出現「Error: Main method not found in class HelloWorld,
> please define the main method as: public static void main(String[] args)」，
> 我的程式碼是：{貼上你的程式碼}，請幫我找出問題出在哪一個關鍵字。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記住這句話：</b> <code>public static void main(String[] args)</code> 五個部分缺一不可，漏掉 <code>static</code> 或把 <code>main</code> 拼錯，JVM 就找不到程式該從哪裡開始執行。
</div>

<!--
【操作提示】
現場故意把 main 方法的 static 拿掉，執行給大家看錯誤訊息長什麼樣子，再把訊息貼給 AI 驗證。

【收斂一句話】
main 方法簽名是 JVM 跟我們之間的固定約定，五個關鍵字一個都不能少、不能錯。
-->

---
layout: default
---

# 練習 2：抓出結構與命名問題
### 任務說明

下面這段程式碼可以正確編譯執行，但裡面有幾個地方不符合本節介紹的**結構順序**或**命名慣例**。請找出至少 3 個問題並說明原因：

```java
public class main {
    public static void main(String[] Args) {
        int Total_Score = 90;
        System.out.println(Total_Score);
    }
}
import java.util.Scanner;
```

<!--
【任務鋪陳】
這段程式碼「能跑」，但每一行幾乎都藏了一個跟「結構順序」或「命名慣例」有關的小問題——這提醒我們：能編譯執行，不代表寫法就是對的。

【引導思考】
對照「Java 程式完整結構」跟「命名慣例總整理」兩頁：`import` 該放在哪裡？類別名稱、方法參數、變數名稱分別該用哪種命名法？

【等待與觀察】
給大家 4 分鐘。提示：總共可以找到 4 個問題。
-->

---
layout: default
---

# 練習 2：抓出結構與命名問題
### 解題提示

| 問題 | 說明 | 正確寫法 |
| --- | --- | --- |
| `import` 放在 class 後面 | `import` 必須在 `package`（若有）之後、`class` 之前 | 移到檔案最上方 |
| 類別名稱 `main` 全小寫 | 類別名稱應為 Pascal Case | `Main` |
| 參數名稱 `Args` 大寫開頭 | 變數／參數名稱應為 camelCase | `args` |
| 變數名稱 `Total_Score` | 變數名稱應為 camelCase，不用底線與大寫 | `totalScore` |

<!--
【帶讀解法】
這四個問題分成兩類：`import` 位置錯誤是「結構順序」問題，編譯器其實不一定會報錯，但會讓人一眼看不出檔案的整體輪廓；其他三個都是「命名慣例」問題，編譯器完全不會抱怨，但會讓程式碼變得難讀。命名慣例是團隊合作時的默契，遵守它能讓別人（包括未來的自己）更快看懂程式碼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 程式註解

<!--
這一節要學的是註解（comment）。註解是寫給「人」看的文字，不會影響程式的執行結果，但可以幫助我們（或其他看這段程式碼的人）理解這段程式在做什麼、為什麼這樣寫。我們會看三種不同的註解寫法，以及各自適合用在什麼場合。
-->

---

# 三種註解類型

| 類型 | 語法 | 用途 |
| --- | --- | --- |
| **單行註解** | `// 文字` | 對單行程式碼做簡短說明 |
| **多行註解** | `/* 文字 */` | 說明較複雜的邏輯、暫時關閉程式碼 |
| **文件註解** | `/** 文字 */` | 產生 Javadoc API 文件，用於類別和方法上方 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 三種註解內容都不會被 <code>javac</code> 編譯，對執行結果沒有任何影響。
</div>

<!--
這三種註解的共同特點是：`javac` 在編譯的時候會直接忽略它們，完全不會影響程式執行的結果。

可以把註解想成在書本旁邊用筆寫的眉批或筆記，這些筆記是寫給看書的人看的，書本本身的內容不會因此改變。三種寫法分別是：`//` 用來寫單行的簡短說明；`/* */` 用來寫比較長的說明，或暫時把一段程式碼「關掉」；`/** */` 則是文件註解，可以搭配工具產生 API 文件，通常寫在類別或方法的上方。接下來我們會一個一個來看。
-->

---

# 單行註解（//）

```java
public class HelloWorld {
    public static void main(String[] args) {
        // 印出歡迎訊息到控制台
        System.out.println("Hello, World!");

        int count = 0; // 計數器，初始值為 0
    }
}
```

<!--
`//` 是最簡單也最常用的註解寫法，可以自己獨佔一行，寫在程式碼上方說明這一段在做什麼；也可以直接接在程式碼後面，針對這一行做簡短補充，就像範例裡 `int count = 0;` 後面的說明。

業界實務上有一個提醒：如果發現一段程式碼需要寫很長的註解才能解釋清楚在做什麼，這通常代表程式碼本身寫得不夠清楚。理想的情況是程式碼本身的命名和結構就足夠表達意圖，註解只是用來補充「為什麼」這樣做，而不是逐行翻譯「這行在做什麼」。
-->

---

# 多行註解（/* */）

```java
/*
 * 計算兩個整數的最大公因數
 * 使用輾轉相除法（歐幾里得演算法）
 * 時間複雜度：O(log(min(a, b)))
 */
public int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
```

<!--
`/* ... */` 適合用在需要寫比較長說明的時候，可以跨越多行，例如範例裡解釋這個方法用的是輾轉相除法（歐幾里得演算法），還順便標明了時間複雜度。

當一段邏輯比較複雜、不容易一看就懂的時候，用多行註解先說明整體的思路，再看程式碼會比較容易跟上。另外，多行註解還有一個常見用法：在除錯（debug）的時候，可以把一大段暫時不需要執行的程式碼整個包起來，先讓它「失效」，需要的話再拿掉註解恢復。
-->

---

# 文件註解（Javadoc）

**是什麼？** 以 `/** */` 撰寫的結構化註解，可用 `javadoc` 工具轉換成 HTML API 文件。

```java
/**
 * 計算兩數之和並回傳結果。
 *
 * @param a 第一個整數
 * @param b 第二個整數
 * @return 兩數相加的結果
 * @author 炭治郎
 * @since 1.0
 */
public int add(int a, int b) {
    return a + b;
}
```

<!--
這是第三種註解，叫做文件註解（Javadoc），以 `/**` 開頭，通常寫在類別或方法的上方。

可以把它想成產品的使用說明書：使用者不需要看懂機器內部的電路結構，只要翻說明書就知道怎麼操作。範例裡的 `@param`、`@return` 就是在說明這個方法需要傳入什麼參數、會回傳什麼結果。

業界實務上，公開的（`public`）方法通常都會搭配 Javadoc，讓其他開發者不需要讀程式碼內容，就能知道這個方法該怎麼用，這也是 code review 時常會被檢查的項目之一。
-->

---

# 產生 Javadoc 文件

**怎麼用？**

```bash
javadoc -d docs Calculator.java
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>結果呈現：</b>在 <code>docs/</code> 資料夾產生 <code>index.html</code> 等網頁，開啟後可看到 <code>add</code> 方法的說明、參數（<code>a</code>、<code>b</code>）、回傳值，排版跟官方 API 文件一樣。
</div>

<!--
執行 `javadoc -d docs Calculator.java` 之後，會在 `docs` 資料夾產生一整組 HTML 檔案，打開 `index.html` 就能看到跟 Java 官方 API 文件一模一樣的排版——方法名稱、參數說明、回傳值，全部自動整理好。這就是 Javadoc 標籤實際發揮作用的樣子。
-->

---

# 常用 Javadoc 標籤

| 標籤 | 說明 | 位置 |
| --- | --- | --- |
| `@param 名稱 說明` | 描述方法的輸入參數 | 方法 |
| `@return 說明` | 描述方法的回傳值 | 方法 |
| `@throws 例外 說明` | 描述可能拋出的例外 | 方法 |
| `@author 名稱` | 作者名稱 | 類別 |
| `@version 版本號` | 版本號碼 | 類別 |
| `@since 版本號` | 此功能自哪個版本引入 | 類別 / 方法 |

<!--
這一頁列出了 Javadoc 裡幾個常用的標籤，其中 `@param` 和 `@return` 是最基本也最常用的兩個，分別說明方法需要的參數和會回傳的結果；`@throws` 用來說明這個方法可能會拋出（throw）哪些 exception（例外）；`@author`、`@version`、`@since` 則多用在類別層級，記錄作者、版本等資訊。

業界實務上，`@param` 和 `@return` 幾乎是寫公開方法時的標準配備，可以讓使用這個方法的人，不用看實作細節就知道怎麼用。如果有興趣，可以找一些開源專案的原始碼，看看裡面的 Javadoc 是怎麼寫的，會很有幫助。
-->

---
layout: default
---

# 練習 3：從零跑出第一個程式
### 任務說明

請完成以下步驟：

1. 建立一個新的 Java 檔案，類別命名為 `MyProfile`
2. 在 main 方法中，用 `System.out.println()` 分三行輸出：
   - 你的姓名
   - 你正在學習 Java
   - 今天的日期

**預期輸出範例：**

```
炭治郎
正在學習 Java！
2025-05-13
```

<!--
前面我們已經看過 Hello World 的完整結構，包括 class 宣告、`main` 方法、輸出方法，現在輪到大家自己動手寫一次。

這一題要做的事情，跟我們剛剛看到的範例非常相似，差別只是這次的內容換成大家自己的資訊。試著想一想：類別名稱要怎麼取？檔名要存成什麼？三行輸出分別要用哪一個方法？如果存檔的時候不小心打成小寫的 `myprofile.java`，會發生什麼事？
-->

---

# 練習 3：解題提示
### 提示說明

1. 建立 `MyProfile.java`，注意 **檔名** 和 **class 名稱** 必須一致
2. 在 main 方法裡用三個 `System.out.println()` 分別印出三行
3. 編譯：`javac MyProfile.java`
4. 執行：`java MyProfile`（不加 .class）

<!--
如果剛剛卡關了，可以對照一下這幾個步驟：檔名跟 class 名稱要一致、`main` 方法裡寫三行 `System.out.println()`、編譯用 `javac MyProfile.java`、執行用 `java MyProfile`，這個流程其實就是把上一節學到的東西原封不動再做一次。

如果出現錯誤訊息也不用緊張，這是寫程式過程中很正常的一部分。先檢查一下大括號有沒有對齊、檔名跟 class 名稱是不是真的一樣，通常問題就在這些細節裡。順利印出結果之後，可以試著改一下文字內容，再重新編譯執行一次，感受整個「寫、編譯、執行」的循環。
-->

---
layout: default
---

# 🎬 AI 協作時刻：三種註解你分得清楚嗎？

`//`、`/* */`、`/** */` 長得都很像，但用錯場合會讓程式碼變得又亂又沒用，考前先讓 AI 幫你出題自我測驗：

**要用的 Prompt：**

> 請針對 Java 的三種註解（單行 `//`、多行 `/* */`、文件註解 `/** */`），
> 出 3 題「這段程式碼該用哪一種註解」的情境題給我，先別公布答案，
> 等我回答完再一起核對。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常被忽略的細節：</b> Javadoc（<code>/** */</code>）一定要緊貼在 class 或方法定義的正上方，才會被 <code>javadoc</code> 工具讀到；位置放錯，產生出來的文件內容就會是空的。
</div>

<!--
【操作提示】
拿到 AI 出的 3 題後，先讓學生自己選答案，再逐題核對，特別點出 Javadoc 那題容易漏掉「位置」這個限制。

【收斂一句話】
三種註解的差別不只是符號不同，更是「給誰看」跟「放在哪」的差別，位置放錯 Javadoc 就會失效。
-->

---
layout: default
---

# 練習 4：寫一段有完整註解的程式
### 任務說明

針對以下程式碼，分別加上三種註解：

```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(3, 5));
    }
}
```

**要求：** 為 `add` 方法加上 Javadoc 文件註解（含 `@param`、`@return`），並在 main 方法內加上至少 2 個單行註解。

<!--
剛剛我們學了三種註解的寫法和用途，這一題要把它們實際用在一段程式碼上。

這裡有一個 `Calculator` 類別，裡面有一個 `add` 方法和一個 `main` 方法。試著想一想：如果有其他人要使用這個 `add` 方法，他需要知道哪些資訊？這些資訊適合用哪一種註解來寫？另外在 `main` 方法裡，哪些地方加上簡短的單行註解，能幫助別人更快看懂這段程式在做什麼？重點不是每一行都加註解，而是想清楚哪裡真正需要說明。
-->

---

# 練習 4：解題提示
### 提示說明

1. **Javadoc 文件註解**加在 `add` 方法定義的**上方**，以 `/**` 開頭：

```java
/**
 * @param a ...
 * @param b ...
 * @return ...
 */
```

2. **單行註解**可以加在：建立物件那行、呼叫方法那行，說明它在做什麼

3. 完成後執行 `javadoc Calculator.java`，看看產生出什麼 HTML 文件

<!--
寫完之後，可以試著執行 `javadoc Calculator.java`，看看會產生什麼樣的 HTML 文件。

打開產生出來的網頁，會看到 `add` 方法的說明、參數、回傳值都被整理成一份格式整齊的文件，這就是 Javadoc 標籤實際發揮作用的樣子，跟我們平常看到的官方 API 文件其實是同一套機制產生出來的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
這一章從「寫出第一個程式」、「拆解程式結構」到「加上註解」，最後我們用一個綜合練習，把這三件事一次串起來。
-->

---
layout: default
---

# 練習 5 (綜合)：學生自我介紹程式
### 任務說明

請撰寫一個完整的 Java 程式 `StudentIntro.java`，滿足以下要求：

1. **結構**：依照「套件宣告（可省略）→ import → class → main」的順序撰寫
2. **命名**：類別名稱用 Pascal Case，方法與變數用 camelCase
3. **功能**：在 `main` 中宣告變數儲存姓名與年齡，並用 `System.out.println()` 與 `System.out.printf()` 各輸出一行
4. **註解**：在 `main` 方法上方加上 Javadoc 註解說明這個程式的用途；在程式內加上至少 1 個單行註解
5. 編譯並執行，確認輸出結果正確

**預期輸出範例：**
```
我是 炭治郎
今年 16 歲
```

<!--
【任務鋪陳】
這題綜合了三個小節：第一節的「編譯與執行」流程、第二節的「程式結構與命名」、第三節的「註解寫法」。完成這一題，等於把這一章的內容全部動手做過一次。

【引導思考】
先想結構：檔案最上面要放什麼？然後想命名：類別、變數要怎麼取名才符合慣例？最後想註解：Javadoc 要寫在哪一個元素的上方？

【等待與觀察】
給大家 8 分鐘。如果卡住，先把「我的第一個 Java 程式」那一頁的範例貼過來，再依照要求一步步加東西，比從空白檔案開始容易。
-->

---
layout: default
---

# 練習 5 (綜合)：學生自我介紹程式
### 解題提示

```java
/**
 * 學生自我介紹程式。
 */
public class StudentIntro {
    public static void main(String[] args) {
        String studentName = "炭治郎"; // 姓名
        int studentAge = 16;

        System.out.println("我是 " + studentName);
        System.out.printf("今年 %d 歲%n", studentAge);
    }
}
```

```bash
javac StudentIntro.java
java StudentIntro
```

<!--
【帶讀解法】
這份解答把三個小節的重點都放進來了：檔名跟類別名稱 `StudentIntro` 一致（第一節）；結構上 `class` 包住 `main`（第二節）；`main` 方法上方有 Javadoc，內部有單行註解（第三節）。

💼 業界實務：
真實專案裡幾乎每一個 `.java` 檔案都遵守這樣的結構與命名慣例——這不是「規定」，而是大家約定好的共同語言，讓任何人打開檔案都能很快抓到重點。
-->

---

# 總結

- **檔名必須與 `public class` 名稱完全一致（含大小寫）** — 這是最容易踩到的第一個地雷
- **編譯用 `javac`，執行用 `java`（不加 `.class`）** — 兩個步驟、兩個不同指令
- **程式結構順序固定：`package` → `import` → `class` → `main`** — `main` 是 JVM 啟動時尋找的進入點
- **命名慣例：類別 Pascal Case，方法／變數 camelCase，常數全大寫底線分隔**
- **三種註解各有用途** — `//` 單行說明、`/* */` 多行或暫時關閉程式碼、`/** */` 產生 Javadoc API 文件

<!--
我們把這一章整理成五個重點。

第一，檔名跟 `public class` 名稱要完全一致，包括大小寫，這是新手最常踩到的第一個雷。

第二，編譯跟執行是兩個步驟：`javac` 負責編譯出 `.class`，`java` 負責執行，而且執行的時候不能加 `.class`。

第三，程式的結構順序是固定的：`package`、`import`、`class`、`main`，`main` 方法是 JVM 啟動時真正尋找的進入點。

第四，命名慣例：類別名稱用 Pascal Case，方法和變數用 camelCase，常數全大寫用底線分隔——這是團隊合作時的共同語言。

第五，三種註解各有各的場合：`//` 用在簡短的單行說明，`/* */` 用在比較長的說明或暫時關閉程式碼，`/** */` 則是可以產生 API 文件的 Javadoc。

這五點加起來，就是讀懂任何一份 Java 程式碼所需要的基本骨架。下一章我們要開始深入變數跟資料型態了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
今天這一章，我們從寫出第一個 Hello World 開始，認識了一個 Java 程式的完整結構，包括 `package`、`import`、`class` 宣告和 `main` 方法各自的作用，也學到了命名慣例，最後學了三種註解的寫法和適合使用的場合。

這些都是之後每一章會持續用到的基礎，如果有任何地方還不確定，現在是最好的時間提出來問。
-->
