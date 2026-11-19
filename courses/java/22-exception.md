---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 程式異常的處理
routeAlias: ch22
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
    程式異常的處理
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓程式不因異常而中止」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
嗨大家好，歡迎來到「程式異常的處理」這一章！

【為什麼要學這個？】
我們寫的程式在自己電腦上跑得很順，不代表到了使用者手上也不會出狀況。使用者輸入的東西常常是我們完全沒想過的——可能輸入文字而不是數字，可能讓除數變成 0。今天要學的，就是怎麼在這些「意外」發生時，讓程式還能優雅地繼續運作，而不是直接整個中止。

【學習目標】
學完這一章，我們就能看懂並處理那些常見的錯誤訊息，知道怎麼用 try-catch-finally 把可能出錯的程式碼包起來，也能用 throw/throws 自己定義「什麼情況算是錯誤」，甚至寫出專屬於我們系統的異常類別。
-->
---
layout: default
---

# Outline

- **認識程式錯誤的類別**
- **處理異常方法**
  - try-catch / finally / try-with-resources
  - Throwable 類別方法
  - throw / throws / 自訂異常類別
- **實作練習**

<!--
【帶讀大綱】
這一章分成兩大部分：第一部分先搞清楚「程式錯誤」有哪些種類，知道我們今天的主角「異常（Exception）」是哪一種；第二部分則是重點，會學到一整套處理異常的工具：try-catch-finally、try-with-resources，還有怎麼自己定義異常類別。

【重點預告】
學完這一章之後，我們會在最後安排一個綜合練習，把這些工具全部組裝起來，做出一個真正「不會輕易崩潰」的小程式。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 認識程式錯誤的類別

<!--
【段落轉換】
我們先來認識程式錯誤有哪幾種類型，這樣才知道今天的主題「異常」是其中的哪一種。
-->
---
layout: default
---

# 程式錯誤的三大類型

| 錯誤類型 | 發生時機 | 說明 |
| --- | --- | --- |
| 語法錯誤 (Syntax Error) | 編譯階段 | 語法不正確，IDE 會警告 |
| 語意錯誤 (Semantic Error) | 執行後才發現 | 邏輯錯誤，結果不符預期 |
| 執行期間錯誤 (Runtime Error) | 程式執行時 | 語意正確但發生未預期狀況 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>本章重點：</b>執行期間錯誤，Java 將這類錯誤稱為「異常（Exception）」
</div>

<!--
【重點解說】
程式錯誤大致分成三種：語法錯誤是程式碼寫得不符合規則，編譯器（或 IDE）會直接標紅線提醒我們；語意錯誤是程式可以正常執行，但邏輯寫錯了，結果跟我們預期的不一樣；執行期間錯誤則是程式邏輯沒問題，但執行到某一步時遇到了意外狀況。

【生活化比喻】
這就像我們開車出門：語法錯誤是車子根本發不動（連上路都不行）；語意錯誤是車子開得很順，但導航設錯地址，到了完全不同的地方；執行期間錯誤則是車子開得好好的，導航也對，但路上突然出現一個沒預警的坑洞。

【本章重點】
我們今天要對付的就是「執行期間錯誤」。在 Java 裡，這類錯誤被稱為「異常（Exception）」。
-->
---

# 認識簡單的異常實例

除數為 0 的異常：

```java
public static int myDiv(int x, int y) {
    return x / y;
}
public static void main(String args[]) {
    System.out.println(myDiv(6, 2));
    System.out.println(myDiv(8, 0)); // 異常發生，程式中止
    System.out.println(myDiv(9, 4)); // 不會執行到
}
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ Java 動作：拋出異常訊息並終止程式執行<br>
<code>java.lang.ArithmeticException: / by zero</code>
</div>

<!--
【範例目的】
這個範例示範「執行期間錯誤」最經典的例子：除數為 0。我們先呼叫一個正常的除法，再呼叫一個會出問題的除法，看看接下來會發生什麼事。

【帶讀關鍵行】
`myDiv(6, 2)` 正常執行，印出結果；但 `myDiv(8, 0)` 因為除數是 0，數學上根本算不出來，Java 會直接拋出一個叫 `ArithmeticException` 的異常，並且**終止整個程式**。

⚠️ 易錯點提醒：
注意最後一行 `myDiv(9, 4)`——它寫得完全正確，但因為程式在上一行就已經中止了，這行**根本不會被執行到**。一個異常沒處理好，會讓後面所有正常的程式碼一起陪葬。

【預期結果】
畫面只會印出第一行的結果，接著拋出 `java.lang.ArithmeticException: / by zero`，程式直接結束。
-->
---

# 其他常見的異常

| 異常類別 | 觸發情境 |
| --- | --- |
| `NullPointerException` | 對 `null` 物件呼叫方法 |
| `NumberFormatException` | 將非數值字串轉換成整數 |
| `StringIndexOutOfBoundsException` | 字串索引超出範圍 |
| `ArrayIndexOutOfBoundsException` | 陣列索引超出範圍 |
| `InputMismatchException` | 使用者輸入的類型錯誤 |

<!--
【重點解說】
這幾個是我們寫 Java 時最常遇到的異常類別，認識它們可以幫我們在看到錯誤訊息時，快速判斷問題出在哪裡。

【生活化比喻】
`NullPointerException` 就像我們對著一個「根本不存在的人」打電話——對方號碼是空的，根本接不通。`NumberFormatException` 則像是把一段中文地址硬塞進「電話號碼」欄位，系統當然看不懂。`ArrayIndexOutOfBoundsException` 和 `StringIndexOutOfBoundsException` 則是我們想拿「第 10 個格子」的東西，但置物櫃總共只有 4 格。

【業界實務】
這幾種異常在實務開發中出現的頻率非常高，尤其是 `NullPointerException`，幾乎是每個 Java 工程師都會遇到的「老朋友」。
-->
---

# 其他常見的異常 — 範例

```java
// NullPointerException
String str = null;
System.out.println(str.length());
// NumberFormatException
int x = Integer.parseInt("Taipei");
// StringIndexOutOfBoundsException
String s = "ABCD";
char c = s.charAt(10);
```

<!--
【範例目的】
這個範例把前一頁表格中的三種異常各示範一次，讓我們親眼看看它們長什麼樣子。

【帶讀關鍵行】
`str` 是 `null`，呼叫 `str.length()` 會拋出 `NullPointerException`；`Integer.parseInt("Taipei")` 因為 "Taipei" 不是數字，拋出 `NumberFormatException`；`s.charAt(10)` 因為字串 "ABCD" 只有 4 個字元，索引 10 不存在，拋出 `StringIndexOutOfBoundsException`。

⚠️ 易錯點提醒：
這四行程式碼**只要任何一行先執行就會中止**，後面的行不會被執行到。實際測試時建議一次只留一行、其他先註解掉，分別觀察各自的錯誤訊息。

【預期結果】
依各行單獨執行時，會分別看到三種不同的異常訊息，且程式都會在該行中止。
-->
---

# 更清晰的 NullPointerException

| 特性 | 說明 |
| --- | --- |
| 具體錯誤訊息 | JVM 會詳細指出是哪個變數或方法呼叫回傳了 `null` |

```java
// 若 user 為 null，會明確指出「因為 user 是 null」
User user = null;
System.out.println(user.getName());
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>除錯更方便：</b> 從 Java 14 起，錯誤訊息會直接寫明：<code>Cannot invoke "User.getName()" because "user" is null</code>。
</div>

<!--
【重點解說】
前一頁我們看到 `NullPointerException` 是個很常見的異常，但在早期版本的 Java 裡，它的錯誤訊息其實很簡單，只會說「這裡發生了 NPE」，但不會告訴我們**到底是哪個變數是 `null`**。

【生活化比喻】
這就像保全系統發出警報，但只說「某個區域出狀況了」，卻不告訴我們是哪一棟、哪一層、哪個房間——我們得自己一間一間檢查。

【業界實務】
從 Java 14 開始，這個情況改善了很多：JVM 會直接在錯誤訊息裡指出「因為 `user` 是 `null`，所以無法呼叫 `getName()`」。這對除錯來說是很大的幫助，能大幅縮短我們找問題的時間。
-->
---
layout: default
---

# 練習 1：觸發並觀察例外
### 任務說明

分別撰寫程式碼，刻意觸發以下三種例外，並執行觀察錯誤訊息：

1. `NullPointerException` — 對 `null` 的字串呼叫 `length()`
2. `ArrayIndexOutOfBoundsException` — 存取陣列不存在的索引
3. `NumberFormatException` — 將非數字字串轉成整數

每段程式一次只執行一種（其餘用註解隱藏），記錄輸出的錯誤訊息。

<!--
【任務鋪陳】
我們剛剛認識了幾種常見的異常，這一題要讓我們親手「製造」它們一次，實際看看錯誤訊息長什麼樣子，之後遇到才不會慌。

【引導思考】
想一想：這三種異常分別是在「對什麼東西做什麼操作」時發生的？把它們的觸發條件想清楚，等下寫程式就會很順手。
-->
---
layout: default
---

# 練習 1：解題提示
### 提示說明

```java
String s = null;
System.out.println(s.length());      // NullPointerException

int[] arr = new int[3];
System.out.println(arr[5]);           // ArrayIndexOutOfBoundsException

int n = Integer.parseInt("Java");     // NumberFormatException
```

- 觀察 Java 14+ 的 NPE 訊息是否會指出是哪個變數為 `null`
- 三種例外發生後，程式都會立即中止，後面的程式碼不會執行

<!--
【帶讀解法】
三段程式碼對應三種異常：第一段對 `null` 的字串呼叫 `length()`；第二段存取陣列不存在的索引；第三段把不是數字的字串轉成整數。

⚠️ 易錯點提醒：
記得一次只留一段程式碼執行，其他用註解隱藏，否則第一段異常發生後，後面的程式碼就不會被執行到，看不到其他異常的訊息。

【重點觀察】
特別留意 NPE 的訊息：Java 14 之後會明確指出「因為 `s` 是 `null`」；陣列越界的訊息會同時告訴我們陣列長度和我們存取的索引值；`NumberFormatException` 則會把那個讓它失敗的原始字串內容原封不動地附在訊息裡。
-->
---
layout: default
---

# 練習 2：除法計算機與錯誤分類
### 任務說明

撰寫 `divide(int a, int b)` 方法，回傳 `a / b` 的結果（**先不要**加任何例外處理）：

1. 呼叫 `divide(10, 2)` 與 `divide(10, 0)`，觀察輸出與程式中止情形
2. 對照「程式錯誤的三大類型」表格，分別寫出一行範例程式碼：
   - 語法錯誤（編譯不會過）
   - 語意錯誤（能執行，但結果不符預期）
   - 執行期錯誤（編譯與邏輯都正確，執行時才出包）

<!--
【任務鋪陳】
這一題先不急著「解決」問題，而是要練習「分類」問題——回顧一下這一部分一開頭提到的三大錯誤類型，搭配實際的程式碼來理解它們的差異。

【引導思考】
就像醫生看診前要先確診是哪種病一樣，工程師除錯前也要先分清楚：到底是編譯不過、邏輯算錯，還是執行到一半才出包？這三者的處理方式完全不同。
-->
---
layout: default
---

# 練習 2：解題提示
### 提示說明

```java
static int divide(int a, int b) {
    return a / b;
}
```

- `divide(10, 0)` 會拋出 `ArithmeticException`，程式立即中止
- 語法錯誤範例：`int x = 5` （少了分號，編譯失敗）
- 語意錯誤範例：想算總和卻寫成 `total = a - b`（能跑，但答案錯）
- 執行期錯誤範例：`divide(10, 0)`（除以 0）

<!--
【帶讀解法】
語法錯誤：程式碼連編譯都過不了，IDE 會直接標紅線（例如少寫一個分號）。
語意錯誤：程式可以正常執行、編譯也沒問題，但邏輯寫錯了，結果跟我們想要的不一樣（例如該加變成減）。
執行期錯誤：程式邏輯跟語法都沒問題，但執行到某一步時遇到了意外狀況（例如 `divide(10, 0)`）。

【重點提醒】
接下來這一整章，我們要對付的就是第三種——執行期錯誤，也就是「異常（Exception）」。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 處理異常方法

<!--
【段落轉換】
我們已經認識了異常有哪些種類，接下來就是這一章的重點：學習怎麼「處理」這些異常，讓程式不會因為一個小意外就整個崩潰。
-->
---
layout: default
---

# 傳統防呆方式 — if/else

在可能發生異常的地方用 `if` 預先檢查：

```java
public static int myDiv(int x, int y) {
    if (y == 0) {
        System.out.print("除數為0異常發生：");
        return 0;
    } else {
        return x / y;
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>缺點：</b>程式碼冗長、難以維護；異常情境多時效率低落
</div>

<!--
【情境切入】
在學習 Java 提供的異常處理機制之前，我們先看看「土法煉鋼」的做法：在每個可能出錯的地方，事先用 `if` 檢查條件，避免異常發生。

【帶讀關鍵行】
這裡用 `if (y == 0)` 預先擋住除數為 0 的情況，避免程式直接執行 `x / y` 而拋出異常。

⚠️ 易錯點提醒：
這種寫法的問題是「規模化」之後會很痛苦——如果一個程式裡有上百個地方可能出錯，就要寫上百個 `if` 來防呆，真正的核心邏輯反而被淹沒在一堆檢查條件裡，程式碼會變得很難維護。

【小結】
這就是為什麼 Java 需要提供一套更系統化的「異常處理」機制，讓我們不用在每個地方都手動寫防呆檢查。
-->
---

# Java 的處理異常方式

當程式發生異常時，Java 會：

1. 產生對應的**異常物件（Exception Object）**
2. 在執行緒（thread）中搜尋**異常處理程式碼**

- **狀況 1：找到異常處理程式碼** → 交給它處理，處理完後可繼續往下執行
- **狀況 2：找不到** → 往前回溯呼叫鏈，直到 `main`；若仍找不到，輸出所有異常原因與回溯紀錄，程式中止

<!--
【概念定義】
當程式執行時發生異常，Java 不會直接讓程式「當場暴斃」，而是先「打包」一個異常物件，然後沿著呼叫鏈往外尋找「有沒有人準備好要處理它」。

【生活化比喻】
這就像公司裡發生了一個緊急狀況：第一線員工先打包好「事故報告」，往上呈報。如果直屬主管有對應的應變流程（異常處理程式碼），就由他處理，處理完公司繼續運作；如果一路往上都沒人有應變流程，最後報告會送到最高層（`main`），如果連最高層都沒處理，公司就直接停止營運（程式中止），並把整份事故報告（異常原因與回溯紀錄）公開出來。

【重點提醒】
這個「往外尋找處理程式碼」的過程，就是我們接下來要學的 try-catch 的基礎。
-->
---

# 異常類別階層 — Throwable

```text
Throwable
├── Error（嚴重系統錯誤，通常不需處理）
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception（程式可處理的異常）
    ├── RuntimeException（非檢查異常）
    │   ├── ArithmeticException
    │   └── NullPointerException
    └── IOException（檢查異常）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Throwable</b> 是所有異常的父類別；所有異常物件均為其子類別或衍生類別的實體
</div>

<!--
【帶讀階層圖】
這張圖告訴我們：所有的「狀況」在 Java 裡都繼承自 `Throwable`，而 `Throwable` 又分成兩大家族——`Error` 和 `Exception`。

【概念定義】
`Error` 代表非常嚴重的系統層級問題，例如記憶體用盡（`OutOfMemoryError`），這類問題通常不是我們的程式邏輯能解決的，一般不需要特別處理；`Exception` 則是程式執行中可以、也應該被我們處理的異常，這才是我們今天的主角。

【生活化比喻】
`Error` 就像整棟大樓突然斷電——這不是哪個房間的住戶能解決的問題；`Exception` 則像是某個房間的水龍頭漏水——這是住戶（也就是我們）可以、也應該處理的狀況。

【重點提醒】
`Exception` 底下又分成 `RuntimeException`（例如 `NullPointerException`、`ArithmeticException`）和其他像 `IOException` 這種，下一頁我們會說明這兩者的差異。
-->
---

# 非檢查異常 vs 檢查異常

| 類型 | 說明 | 代表類別 |
| --- | --- | --- |
| 非檢查異常 (Unchecked) | 編譯器不強制處理 | `RuntimeException` 及其子類別 |
| 檢查異常 (Checked) | 編譯器強制要求處理 | `IOException`、`SQLException` 等 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>檢查異常</b>若未加異常處理，程式在編譯階段就會出現錯誤
</div>

<!--
【重點解說】
這個分類非常重要：「非檢查異常」是編譯器不會主動要求我們處理的，像 `NullPointerException`、`ArithmeticException` 這種，即使我們沒寫 try-catch，程式也能編譯成功（只是執行時可能會中止）；「檢查異常」則是編譯器**強制**要求我們處理，像 `IOException`、`SQLException`，如果沒有對應的異常處理，程式連編譯都不會過。

【生活化比喻】
這就像辦銀行業務：有些手續（非檢查異常）即使我們忘記準備某份文件，汆員還是會先讓我們排隊，只是辦到一半可能會卡關；但有些手續（檢查異常，例如開戶）行員會在汲口就直接擋下來：「沒帶印章，不能辦」，連排隊資格都沒有。

【重點提醒】
之後我們寫到牽涉檔案讀寫、資料庫連線的程式碼時，編譯器十之八九會要求我們加上 try-catch 或在方法上宣告 `throws`，這就是因為遇到了「檢查異常」。
-->

---

# try-catch 語法

```java
try {
    // 可能發生異常的敘述
} catch (異常類別 e) {
    // 異常處理程式碼（Exception Handler）
}
```

- **try 區塊**：放置可能發生異常的程式碼；一旦有異常，立即離開 try 進入 catch
- **catch 區塊**：`異常類別` 指定要捕捉的類別；`e` 為異常物件，可取得異常訊息

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 若 catch 的異常類別不符合實際發生的異常，會跳出 catch，程式繼續往下執行
</div>

<!--
【概念定義】
`try-catch` 是 Java 處理異常的最基本語法：「`try` 區塊裡放可能出錯的程式碼，`catch` 區塊則是『一旦出錯該怎麼辦』的應變方案」。

【生活化比喻】
這就像我們去戶外活動時隨身帶滅火器：`try` 區塊就是我們正在進行的活動，`catch` 區塊就是滅火器——平常不會用到，但只要有一個小火苗冒出來（異常發生），我們就立刻拿出滅火器處理。

⚠️ 易錯點提醒：
一旦 try 區塊裡發生異常，**該行之後、try 區塊內剩下的程式碼都不會被執行**，會直接跳到對應的 catch 區塊。這跟一般的程式碼是「整段順序執行」不一樣，是初學者最容易忽略的地方。
-->
---

# 進入 catch 的條件

進入 catch 區塊需同時符合兩個條件：

1. `try` 區塊中的程式碼**有發生異常**
2. `catch` 中定義的異常類別**有捕捉到**
   - 捕捉到：catch 的類別是發生異常的類別，或其**父類別**

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一般實踐：</b>catch 裡面用 <code>Exception</code> 可捕捉大多數執行期異常
</div>

<!--
【重點解說】
要進入 catch 區塊，必須同時滿足兩個條件：try 裡真的發生了異常，而且這個異常的類型「對得上」catch 宣告的類別（包含它的父類別）。

【生活化比喻】
這就像保全室裡擺了好幾種應變方案，但要先確認「真的有事發生」，而且「這件事屬於這個應變方案能處理的範圍」，才會啟動對應的流程。

⚠️ 易錯點提醒：
初學者常常會寫 `catch (Exception e)` 想要「一網打盡」，但這樣會讓我們很難分辨「實際發生的是哪一種異常」，等於把所有可能的問題都混在一起處理，不利於日後除錯。實務上建議寫得越具體越好。

💼 業界實務：
一般在開發階段，`catch (Exception e)` 可以用來捕捉大多數執行期異常，作為「最後一道防線」；但正式環境的核心邏輯，還是建議針對具體異常類別分別處理。
-->
---

# try-catch 範例

```java
public static String myDiv(int x, int y) {
    try {
        return Integer.toString(x / y);
    } catch (ArithmeticException e) {
        System.out.println("除數為0的異常：" + e);
        return "執行除法運算時須避開除數為0的";
    }
}
```

<!--
【範例目的】
這個範例把本章一開始的 `myDiv` 方法，改用 try-catch 包起來，看看行為有什麼不同。

【帶讀關鍵行】
`try` 區塊裡執行 `x / y`；如果 `y` 是 0，會拋出 `ArithmeticException`，立刻跳到 `catch (ArithmeticException e)`，印出提示訊息並回傳預設值 `"執行除法運算時須避開除數為0的"`。

【預期結果】
跟本章一開始的範例不同，這次即使呼叫 `myDiv(8, 0)`，程式**不會中止**，會印出提示訊息，並繼續執行後面的程式碼。
-->
---

# Throwable 類別的方法

| 方法 | 說明 |
| --- | --- |
| `String getMessage()` | 傳回異常的說明字串 |
| `String toString()` | 傳回異常的完整訊息（含類別名稱） |
| `void printStackTrace()` | 回溯顯示程式呼叫的執行過程 |

<!--
【重點解說】
當異常被 catch 抓到之後，我們可以透過 `Throwable` 提供的這幾個方法，取得更多關於這次異常的資訊：`getMessage()` 拿到簡短的說明文字、`toString()` 拿到包含類別名稱的完整訊息、`printStackTrace()` 則能印出整個呼叫過程的回溯紀錄。

【生活化比喻】
這幾個方法就像事故現場的「調查工具」：`getMessage()` 是事故簡報，`toString()` 是事故編號加簡報，`printStackTrace()` 則是完整的監視器錄影回放，能看到事故發生前每一步是怎麼走過來的。

💼 業界實務：
在正式專案裡，我們通常不會只用 `System.out.println` 來顯示這些資訊，而是會搭配 Log（日誌）系統記錄下來，方便日後追蹤問題。
-->
---

# Throwable 方法 — 範例

```java
try {
    return Integer.toString(x / y);
} catch (ArithmeticException e) {
    System.out.println("異常：" + e);
    System.out.println("toString：" + e.toString());
    System.out.println("getMessage：" + e.getMessage());
    e.printStackTrace();
    return "執行除法運算時須避開除數為0的";
}
```

<!--
【範例目的】
這個範例把前一頁的三個方法全部示範一次，方便我們比較它們輸出的內容有什麼不同。

【帶讀關鍵行】
`e`、`e.toString()`、`e.getMessage()` 三者輸出的詳細程度依序遞減；`e.printStackTrace()` 則會印出最完整的呼叫回溯紀錄。

⚠️ 易錯點提醒：
`printStackTrace()` **本身不算是「處理」異常**，它只是把資訊印出來而已。如果 catch 區塊裡只呼叫了這個方法，但沒有做任何補救動作（例如回傳預設值、修正狀態），這個異常實際上還是沒有被妥善處理。
-->
---

# 多個 catch 區塊

| 寫法 | 說明 |
| --- | --- |
| 多個 `catch` 區塊 | 依序匹配，符合即執行對應 catch |
| 單一 `catch` 捕捉多類別 | 多個異常類別合併到一個 catch |

```java
catch (IOException e) { ... }
catch (ArithmeticException e) { ... }
// 或：合併寫法
catch (IOException | ArithmeticException e) { ... }
```

<!--
【情境切入】
如果一段 try 區塊裡可能發生「不只一種」異常，而我們又想針對每種異常做不同的處理，這時候就需要多個 catch 區塊。

【概念定義】
Java 允許在一個 try 後面接「多個 catch 區塊」，依照宣告順序逐一比對，第一個符合的 catch 就會被執行；也可以用 `|` 把多個異常類別合併到同一個 catch，做相同的處理。

⚠️ 易錯點提醒：
多個 catch 區塊有一個重要規則：「範圍較小（較具體）的異常類別要寫在前面，範圍較大（較廣泛）的要寫在後面」。如果先寫 `catch (Exception e)`，後面針對具體類別的 catch 就永遠不會被執行到，編譯器甚至會直接報錯。
-->
---

# 多個 catch 區塊 — 範例

```java
try {
    FileInputStream fio = new FileInputStream("ABC");
    System.out.println(5 / 0);
} catch (IOException e) {
    System.out.println("發生 IO 錯誤：" + e);
    return;
} catch (ArithmeticException e) {
    System.out.println("發生計算錯誤：" + e);
}
```

<!--
【範例目的】
這個範例示範一段程式碼裡可能發生兩種不同的異常：讀取檔案可能拋出 `IOException`，計算除法可能拋出 `ArithmeticException`。

【帶讀關鍵行】
兩個 catch 分別對應兩種異常，依序排列、互不影響。

⚠️ 易錯點提醒：
如果 `new FileInputStream("ABC")` 這一行就因為檔案不存在而拋出 `IOException`，會立刻跳到第一個 catch，後面的 `5 / 0` **根本不會被執行到**——所以這個範例實際上看不到 `ArithmeticException` 發生。
-->
---
layout: default
---

# 練習 3 (實作)：多 catch 實作
### 任務說明

設計一個程式，讀取使用者輸入的 2 個整數，計算除法結果。
需能正確捕捉以下兩種異常：

1. 除數為 0 — `ArithmeticException`
2. 輸入非數字 — `InputMismatchException`

<!--
【任務鋪陳】
這一題要把剛剛學到的 try-catch 和「多個 catch 區塊」實際派上用場：寫一個讓使用者輸入兩個整數並計算除法的小程式。

【引導思考】
使用者輸入時可能出現兩種狀況：輸入的除數是 0，或是輸入的根本不是數字。想一想：這兩種狀況分別對應哪一種異常？我們要怎麼讓程式在遇到這些狀況時，依然能繼續運作？
-->
---
layout: default
---

# 練習 3：解題提示
### 提示說明

1. 宣告 `Scanner` 讀取使用者輸入
2. 在 `try` 區塊內讀取兩個整數並做除法
3. 第一個 `catch` 捕捉 `ArithmeticException`
4. 第二個 `catch` 捕捉 `InputMismatchException`
5. 或改用 `|` 語法合併兩個異常類別到同一 catch

<!--
【帶讀解法】
用 `Scanner` 讀取兩個整數並做除法：除數為 0 會拋出 `ArithmeticException`；輸入非數字會拋出 `InputMismatchException`。兩個 catch 依序對應這兩種異常即可。

💡 補充：
如果兩種異常的處理方式完全相同，也可以用 `catch (ArithmeticException | InputMismatchException e)` 合併成一個 catch，程式碼會更精簡。
-->
---

# 捕捉上層的異常

捕捉一個異常類別時，其**衍生子類別**也可被捕捉。

| 捕捉的類別 | 實際捕捉範圍 |
| --- | --- |
| `IndexOutOfBoundsException` | 含 `Array...` 和 `String...` |
| `RuntimeException` | 含所有 RuntimeException 子類別 |
| `Exception` | 含所有非 Error 的異常 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 多個 catch 時，<b>越廣泛的異常類別放越後面</b>，避免遮蔽更具體的 catch
</div>

<!--
【概念定義】
因為異常類別之間也有繼承關係，catch 一個父類別時，「它所有的子類別也都會被這個 catch 捕捉到」。表格裡列出的就是幾個常見的父類別，以及它們各自能涵蓋的範圍。

【生活化比喻】
這就像保全規則寫成「禁止攜帶任何金屬物品」（父類別），那不管是刀子、剪刀還是鑰匙（各種子類別），通通會被擋下來，不需要一條一條列出來。

⚠️ 易錯點提醒：
用父類別捕捉確實方便，但代價是「我們不知道實際發生的是哪一種具體異常」。多個 catch 並存時，記得把範圍較廣的類別放在後面，否則範圍小的 catch 永遠不會被執行到。
-->
---

# 捕捉上層的異常 — 範例

```java
try {
    String str = "Ming-Chi";
    char c = str.charAt(3);
    System.out.println("c字元是：" + c);
    c = str.charAt(10); // 異常發生
    System.out.println("c字元是：" + c);
} catch (IndexOutOfBoundsException e) {
    System.out.println("索引超出範圍：" + e);
}
```

<!--
【範例目的】
這個範例示範用 `IndexOutOfBoundsException` 同時涵蓋字串索引超出範圍的情況。

【帶讀關鍵行】
`str.charAt(3)` 正常執行，印出第 4 個字元；但 `str.charAt(10)` 因為字串長度不足，拋出 `StringIndexOutOfBoundsException`——而它是 `IndexOutOfBoundsException` 的子類別，所以會被這個 catch 捕捉到。

【預期結果】
先印出「c字元是：C」，接著進入 catch 印出「索引超出範圍：...」，最後一行 `System.out.println` 不會被執行。
-->
---

# finally 區塊

不論 try 是否發生異常，**finally 區塊一定會執行**。

```java
try {
    // 可能發生異常的敘述
} catch (異常類別 e) {
    // 處理異常
} finally {
    // 不論是否異常皆會執行
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常用於：</b>關閉資源（資料庫連線、檔案、網路串流等）
</div>

<!--
【情境切入】
有時候我們需要「不論 try 裡有沒有發生異常，都一定要執行的程式碼」，例如關閉資料庫連線、釋放檔案資源——這些收尾工作不能因為發生了異常就被跳過。

【概念定義】
`finally` 區塊就是用來放這種「不論成功或失敗都一定要執行」的程式碼，緊接在 try（或 catch）之後。

【生活化比喻】
這就像我們去朋友家拜訪：不管聊得開心（try 沒有異常）還是吵架（try 發生異常並被 catch 處理），離開前都「一定」要把鞋子穿好、把門關上——這就是 `finally` 要做的事。
-->
---

# finally 的注意事項

- `finally` 前面必須有 `try` 區塊
- 若 try 無異常：finally 在 try 後執行
- 若 try 有異常且被捕捉：catch 執行完後再執行 finally
- 若 try 有異常但未被捕捉：仍會執行 finally，然後程式中止
- 即使 try 或 catch 有 `return`、`break`、`continue`，finally 仍會執行

<!--
【重點解說】
這幾條規則的核心觀念只有一句話：「不管 try 裡發生什麼事，finally 都會執行」。

⚠️ 易錯點提醒：
最容易讓人意外的是最後一條——即使 try 或 catch 區塊裡寫了 `return`，Java 仍然會先執行 `finally` 區塊的內容，才真正把結果回傳出去。這代表如果我們在 `finally` 裡又寫了一個 `return`，它甚至會「蓋掉」原本 try/catch 裡的回傳值，這是很容易踩到的陷阱。
-->
---

# try-with-resources

程式會**自動關閉**在 `try(...)` 括號內宣告的資源：

```java
try (Scanner scanner = new Scanner(System.in)) {
    System.out.println("請輸入 2 個數字：");
    int num1 = scanner.nextInt();
    int num2 = scanner.nextInt();
} catch (Exception e) {
    System.out.println("發生錯誤：" + e);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 資源必須實作 <code>AutoCloseable</code> 介面（如 Scanner、FileInputStream 等）
</div>

<!--
【情境切入】
我們在使用 `Scanner`、檔案串流這類「資源」時，用完之後應該要呼叫 `close()` 把它關閉，否則可能造成資源洩漏。但如果每次都要在 `finally` 裡手動寫 `close()`，程式碼會變得又長又容易漏寫。

【概念定義】
try-with-resources 讓我們「把資源的宣告直接寫在 `try(...)` 括號裡」，這樣不管 try 區塊正常結束還是發生異常，這個資源都會在離開 try 區塊前被**自動關閉**，不需要我們手動呼叫 `close()`。

【生活化比喻】
這就像租借的腳踏車有自動歸還機制：我們把腳踏車停進指定的車柱（放進 `try(...)`），不管騎得順不順利，車柱都會自動把車鎖上歸還，不需要我們再特地走回去鎖車。

⚠️ 易錯點提醒：
不是所有類別都能放進 `try(...)`，必須是實作了 `AutoCloseable` 介面的類別（例如 `Scanner`、`FileInputStream`）才可以。
-->
---

# try-with-resources 語法增強

| 特性 | 說明 |
| --- | --- |
| 使用外部變數 | 若資源變數是 `final` 或「實質上是 final」，可直接放入 `try(...)` 中 |

```java
// 變數在外部宣告，不需在 try() 內重新宣告
final Scanner scanner = new Scanner(System.in);
try (scanner) {
    int num1 = scanner.nextInt();
} catch (Exception e) {
    System.out.println(e);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>簡化程式碼：</b> 從 Java 9 開始，不再需要寫成 <code>try (Scanner s = scanner)</code>，程式碼更為簡潔。
</div>

<!--
【重點解說】
前一頁的寫法，資源變數必須在 `try(...)` 括號內宣告。但如果這個資源變數是在 try 之前就已經宣告好的呢？

【概念定義】
從 Java 9 開始，只要這個變數是 `final` 或「實質上是 final」（宣告之後就再也沒有被重新賦值），就可以直接把變數名稱寫進 `try(...)`，不需要重新宣告一次。

💡 補充：
這個增強主要是為了簡化程式碼，當資源變數是在前面其他邏輯中建立的，就不必再寫一次 `try (Scanner s = scanner)` 這種多餘的宣告。
-->

---
layout: default
---

# 練習 4：try-with-resources
### 任務說明

改寫練習 2-1，使用 try-with-resources 語法管理 `Scanner` 資源，確保程式結束後 Scanner 自動關閉。不再需要在 `finally` 中手動呼叫 `scanner.close()`。

<!--
【任務鋪陳】
這一題是練習 2-1 的升級版：把原本用 `Scanner` 讀取輸入的部分，改成用 try-with-resources 的寫法。

【引導思考】
想一想：原本 `Scanner` 是在哪裡建立的？如果改成寫進 `try(...)` 括號裡，原本可能存在的 `scanner.close()` 還需要保留嗎？
-->
---
layout: default
---

# 練習 4：解題提示
### 提示說明

1. 將 `new Scanner(System.in)` 移入 `try(...)` 括號內宣告
2. 移除原本 `finally` 中的 `scanner.close()` 呼叫（若有）
3. catch 仍維持捕捉 `ArithmeticException` 和 `InputMismatchException`
4. 觀察程式執行結果是否與原本相同

<!--
【帶讀解法】
把 `new Scanner(System.in)` 移到 `try(...)` 括號裡：`try (Scanner scanner = new Scanner(System.in)) { ... }`，移除任何手動呼叫 `close()` 的程式碼，catch 部分維持不變即可。

💡 補充：
改寫後執行結果應該跟練習 2-1 完全相同，只是少了我們自己管理資源關閉的程式碼，這就是 try-with-resources 帶來的好處。
-->
---

# 自行拋出異常 — throw

允許程式設計師自行定義異常發生的條件，然後主動拋出。

語法：

```java
throw new exception_class("exception message");
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>exception_class</code>：Java 內部或自訂的異常類別<br>
   <code>exception message</code>：自定義的錯誤說明字串
</div>

<!--
【情境切入】
前面學到的異常，都是 Java 自己判斷「這樣做會出錯」而拋出的。但有些「錯誤」是依據我們程式的業務邏輯來定義的——例如年齡輸入 -5，對 Java 來說這只是個普通的整數，並不會自動出錯，但對我們的系統來說，這顯然是不合理的資料。

【概念定義】
`throw` 讓我們可以「自行定義什麼情況算是異常」，並在條件成立時主動拋出一個異常物件，交給呼叫端去處理。

【生活化比喻】
這就像我們自己當裁判：規則手冊（Java 語言本身）沒有規定「年齡不能是負數」，但身為系統設計者，我們可以自己訂下這條規則，一旦發現有人「犯規」，就主動舉牌（`throw`）。
-->
---

# throw — 範例（密碼長度驗證）

```java
private static void pwdCheck(String pwdStr) throws Exception {
    if (pwdStr.length() >= 5 && pwdStr.length() <= 8) {
        System.out.println("密碼驗證成功：" + pwdStr);
    } else {
        System.out.println("密碼驗證失敗：" + pwdStr);
        throw new Exception("密碼長度不符規定");
    }
}
```

<!--
【範例目的】
這個範例示範一個自訂的「業務規則」：密碼長度必須在 5 到 8 個字元之間，否則就算是異常狀況。

【帶讀關鍵行】
`if` 判斷長度是否符合規定；不符合時，用 `throw new Exception("密碼長度不符規定")` 主動拋出一個異常，並附上自訂的錯誤訊息。

⚠️ 易錯點提醒：
方法宣告上一定要加 `throws Exception`，告訴呼叫端「這個方法可能會拋出異常，呼叫的人要準備好處理它」，否則編譯器會直接報錯。

【預期結果】
傳入長度 5–8 的密碼會印出「密碼驗證成功」；傳入其他長度的密碼會先印出「密碼驗證失敗」，再拋出帶有自訂訊息的異常。
-->
---

# throw — 再次拋出已捕捉的異常

在 catch 區塊中可以將已捕捉的異常再次拋出：

```java
public static void main(String[] args) throws IOException {
    try {
        FileInputStream fio = new FileInputStream("ABC");
        System.out.println(5 / 0);
    } catch (IOException e) {
        throw e;
    } catch (ArithmeticException e) {
        System.out.println("發生計算錯誤：" + e);
    }
}
```

<!--
【概念定義】
在 catch 區塊裡，除了處理異常之外，我們也可以選擇「不處理，直接再拋出去」，交給上一層的呼叫者去面對。

【生活化比喻】
這就像第一線客服接到一個技術問題，自己判斷後覺得「這個問題我處理不了」，於是把這個案件原封不動地往上轉給更高層的單位處理——這就是 `throw e` 在做的事。

⚠️ 易錯點提醒：
這裡的 `main` 方法宣告了 `throws IOException`，代表它把 `IOException` 這個問題往外丟給 JVM；但 `ArithmeticException` 則是在這一層就被處理掉了，並沒有再往外拋。同一段程式碼，不同異常可以有不同的處理策略。
-->
---
layout: default
---

# 練習 5 (實作)：throw 實作
### 任務說明

設計一個密碼檢查程式：

- 密碼長度必須在 5–8 個字元之間
- 準備多組密碼字串，逐一測試
- 長度不符時，使用 `throw` 拋出 `StringIndexOutOfBoundsException`，訊息為「密碼長度不符規定」

<!--
【任務鋪陳】
這一題延續前面「密碼長度驗證」的範例，要把 `throw` 真正動手實作出來，並準備多組測試資料來驗證效果。

【引導思考】
想一想：方法宣告時的 `throws` 要寫什麼類別？呼叫這個方法的主程式要怎麼接住可能拋出的異常？
-->
---
layout: default
---

# 練習 5：解題提示
### 提示說明

1. 建立方法 `pwdCheck(String pwdStr)`，宣告 `throws StringIndexOutOfBoundsException`
2. 長度符合：印「密碼驗證成功」；不符合：`throw new StringIndexOutOfBoundsException("密碼長度不符規定")`
3. 主程式準備字串陣列，用迴圈逐一測試
4. 每次呼叫 `pwdCheck` 用 try-catch 捕捉並印出錯誤訊息

<!--
【帶讀解法】
`pwdCheck` 方法的宣告要加上 `throws StringIndexOutOfBoundsException`；方法內部用 `if` 判斷長度，不符合條件時 `throw new StringIndexOutOfBoundsException("密碼長度不符規定")`。

主程式用迴圈逐一呼叫 `pwdCheck`，每次呼叫都包一層 try-catch：成功就讓它印出「密碼驗證成功」，失敗則在 catch 裡印出 `e.getMessage()`。
-->

---

# 方法拋出異常 — throws

當方法內有多處可能發生異常，可整合為一個方法，並在宣告加上 `throws`：

```java
public void myMethod() throws 異常類別1, 異常類別2 {
    // 可能發生異常的敘述
}
```

- 異常交給**呼叫方**處理
- 呼叫方的程式碼中必須有相對應的 try-catch

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b>原呼叫的程式碼中也要有相對應的異常處理程式，否則會出現編譯錯誤
</div>

<!--
【情境切入】
如果一個方法內部有好幾處可能拋出異常，把每一處都各自用 try-catch 包起來，方法內部會變得很雜亂。有沒有辦法讓「處理異常」這件事，交給呼叫這個方法的人來決定？

【概念定義】
`throws` 寫在方法宣告的地方，代表「這個方法**可能**會拋出某些異常，但我不在這裡處理，呼叫我的人要自己準備好 try-catch」。

【生活化比喻】
這就像店家在門口貼公告：「內用低消 100 元」——這不是店員會在你進門時逐一檢查，而是「先告知規則」，由顧客自己決定要不要進來、進來後要怎麼應對。`throws` 就是方法在「門口」先說明清楚：「我可能會丟出這些問題，你接手前先想清楚」。

⚠️ 易錯點提醒：
如果方法宣告了 `throws CheckedException`（檢查異常），呼叫方**必須**用 try-catch 處理或繼續往外宣告 `throws`，否則編譯會直接失敗。
-->
---

# throw vs throws — 對比

| 比較項目 | `throw` | `throws` |
| --- | --- | --- |
| 位置 | 方法**內部** | 方法**宣告**處 |
| 用途 | 主動拋出一個異常物件 | 宣告此方法可能拋出的異常 |
| 語法 | `throw new XxxException()` | `void m() throws XxxException` |
| 後面接 | 異常**物件**（一次一個）| 異常**類別**（逗號分隔多個）|

```java
void withdraw(int amt) throws NotEnoughException {
    if (amt > balance)
        throw new NotEnoughException("餘額不足");
}
```

<!--
【重點解說】
這張表把 `throw` 和 `throws` 放在一起比較，是很多人剛開始學習時容易搞混的地方，也是面試常見的題目。

【記憶口訣】
`throw` 是一個「動作」：在方法**內部**，主動拋出一個異常**物件**，一次只能拋一個；`throws` 是一個「宣告」：寫在方法**簽名**處，告知這個方法可能拋出哪些異常**類別**，可以用逗號列出多個。

💡 補充：
範例中的 `withdraw` 方法示範了兩者如何配合：方法宣告 `throws NotEnoughException`（事先告知），方法內部在條件成立時 `throw new NotEnoughException(...)`（實際動作）。
-->
---

# 自訂異常類別

由於所有執行期異常均繼承自 `Exception`，自訂異常類別也必須繼承 `Exception`：

```java
class 自訂異常類別名稱 extends Exception {
    // 定義成員（可以不加任何成員）
}
```

- 繼承後即可使用 `toString()`、`getMessage()` 等方法
- 可加入自訂的成員變數與建構方法

<!--
【情境切入】
前面我們用的都是 Java 內建的異常類別，例如 `ArithmeticException`、`StringIndexOutOfBoundsException`。但如果我們的業務邏輯有一個「Java 沒有對應名稱」的錯誤狀況，例如「存款不足」呢？

【概念定義】
我們可以自己定義一個異常類別：「只要繼承 `Exception`，這個自訂類別就會擁有 `toString()`、`getMessage()` 等所有異常該有的能力，同時也可以加入我們自己需要的欄位與方法」。

【生活化比喻】
這就像公司內部會根據自己的業務，定義專屬的「異常報告表單」——一般的事故報告表單（`Exception`）已經有「事故說明」欄位，但我們可以再加一欄「差額金額」，變成專屬於我們公司的表單格式。
-->
---

# 自訂異常類別 — 定義

```java
@SuppressWarnings("serial")
class MyException extends Exception {
    String str;
    MyException(String msg) { str = msg; }
    public String toString() {
        return ("我定義的MyException發生了 " + str);
    }
}
```

<!--
【範例目的】
這個範例示範一個最基本的自訂異常類別 `MyException`，並覆寫 `toString()` 方法。

【帶讀關鍵行】
`class MyException extends Exception` 完成繼承；`String str` 是我們自訂的欄位，用來存放錯誤訊息；`@Override toString()` 讓這個異常被印出來時，會顯示我們自訂的格式，而不是預設的格式。

💡 補充：
`@SuppressWarnings("serial")` 是為了壓制「未宣告 `serialVersionUID`」的編譯警告，不影響程式邏輯，可視為慣例寫法。
-->
---

# 自訂異常類別 — 使用

```java
try {
    System.out.println("try區塊");
    throw new MyException("異常訊息");
} catch (MyException e) {
    System.out.println("catch區塊");
    System.out.println("MyException：" + e);
    e.printStackTrace();
}
```

<!--
【範例目的】
這個範例示範如何拋出並捕捉我們剛剛自訂的 `MyException`，整個流程跟內建異常完全一樣。

【帶讀關鍵行】
`throw new MyException("異常訊息")` 主動拋出我們自訂的異常；`catch (MyException e)` 捕捉到後，`e` 就是 `MyException` 的實例，`System.out.println("MyException：" + e)` 會呼叫我們覆寫過的 `toString()`。

【預期結果】
依序印出「try區塊」→「catch區塊」→「MyException：我定義的MyException發生了 異常訊息」，再加上 `printStackTrace()` 的回溯紀錄。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
這一章從「程式怎麼出錯」講到「怎麼自己定義錯誤」：try-catch-finally 讓我們接住例外、throw/throws 讓我們主動丟出例外、自訂例外類別讓錯誤訊息更貼近我們的業務邏輯。接下來這兩題，就是把這些積木全部組裝起來，動手做出真正「扛得住亂輸入」的程式。
-->

---
layout: default
---

# 練習 6：自訂異常類別
### 任務說明

設計一個銀行存提款程式：

- 建立 `NotEnoughException` 繼承 `Exception`，記錄差額 `shortAmount`
- 建立 `MyBank` 類別，有 `deposit()` 和 `withdraw()` 方法
- 提款金額大於存款時，拋出 `NotEnoughException`，傳入差額

<!--
【任務鋪陳】
這一題是這一部分的綜合練習：把「自訂異常類別」和「throw/throws」結合在一起，做一個銀行存提款系統。

【引導思考】
當提款金額超過存款餘額時，我們不只要告訴使用者「錢不夠」，還要讓他知道「差多少」。想一想：這個「差額」應該放在 `NotEnoughException` 的什麼地方，才能在 catch 時順利取得？
-->
---
layout: default
---

# 練習 6：解題提示
### 提示說明

1. `NotEnoughException` 加入 `private int shortAmount` 成員與 `getShortAmount()` 方法
2. `MyBank.withdraw()` 判斷 `cashout > balance`時計算差額
3. `throw new NotEnoughException(差額)`，並在方法宣告加上 `throws NotEnoughException`
4. `main` 中用 try-catch 捕捉，用 `e.getShortAmount()` 列印差額

<!--
【帶讀解法】
`NotEnoughException` 加入 `shortAmount` 欄位和 `getShortAmount()` 方法，跟前面 `MyException` 加入 `str` 欄位是同樣的做法。

`MyBank.withdraw()` 中，當 `cashout > balance` 時，計算差額 `= cashout - balance`，再 `throw new NotEnoughException(差額)`，方法宣告加上 `throws NotEnoughException`。

`main` 中用 try-catch 呼叫 `withdraw()`，在 catch 裡用 `e.getShortAmount()` 取得差額並印出。
-->
---
layout: default
---

# 練習 7 (綜合)：成績登錄系統
### 任務說明

整合本章所學，設計一個簡易成績登錄系統：

- 自訂例外 `InvalidScoreException extends Exception`，建構子接收 `int score`，並提供 `getScore()`
- `addScore(List<Integer> scores, int score)` 方法，宣告 `throws InvalidScoreException`：
  - `score < 0` 或 `score > 100` → `throw new InvalidScoreException(score)`
  - 否則將 `score` 加入 `scores`，並印出「登錄成功：」+ `score`
- `main` 中使用 `try-with-resources` 搭配 `Scanner` 讓使用者輸入成績（輸入 `-1` 結束輸入迴圈視為合法的「結束指令」，**不會**觸發例外，需在讀取後另外判斷）
- 每次呼叫 `addScore`：用 `try-catch-finally` 包起來；catch 印出「成績不合法：」+ `e.getScore()`；finally 印出「本次輸入處理完畢」
- 全部輸入結束後，計算並印出 `scores` 的平均分數（無資料時印出「尚無有效成績」）

<!--
【任務鋪陳】
這是這一章的期末驗收：把 try-catch-finally、throw/throws、自訂例外、try-with-resources 全部組裝起來，做出一個「不會因為亂輸入就崩潰」的成績登錄系統。

【引導思考】
想像我們在開發一個老師用的成績登錄小工具：使用者可能會打錯，輸入超出 0–100 範圍的數字，甚至打了非數字。系統不該因此當掉，而是要友善地告訴使用者「這筆資料不合法」，並繼續讓他輸入下一筆。
-->
---
layout: default
---

# 練習 7 (綜合)：解題提示
### 提示說明

```java
class InvalidScoreException extends Exception {
    private final int score;
    InvalidScoreException(int score) {
        super("分數超出範圍：" + score);
        this.score = score;
    }
    public int getScore() { return score; }
}

static void addScore(List<Integer> scores, int score) throws InvalidScoreException {
    if (score < 0 || score > 100) throw new InvalidScoreException(score);
    scores.add(score);
    System.out.println("登錄成功：" + score);
}
```

- `try (Scanner sc = new Scanner(System.in)) { while (true) {...} }`，讀到 `-1` 就 `break`，跳出迴圈
- 每次讀取後：`try { addScore(scores, score); } catch (InvalidScoreException e) { System.out.println("成績不合法：" + e.getScore()); } finally { System.out.println("本次輸入處理完畢"); }`
- 平均分數：用 `scores.isEmpty()` 判斷是否印出「尚無有效成績」，否則計算總和除以筆數

<!--
【帶讀解法】
這題把整章的積木組裝起來：
1. 自訂例外 － `InvalidScoreException` 帶著不合法的分數一起被拋出
2. throw/throws － `addScore` 拋出例外，呼叫端必須處理
3. try-catch-finally － 每次輸入都確保「本次輸入處理完畢」會被印出
4. try-with-resources － 管理 `Scanner`，不需手動 `close()`

【最後叮嚀】
如果這題能獨立寫完，代表我們已經具備「寫出不會輕易崩潰的程式」的能力。這是業界最基本、也是最重要的素質之一——之後不管寫什麼程式，都可以回頭想想：「這裡的輸入或操作，有沒有可能出錯？出錯了我處理好了嗎？」
-->
---

# 總結

- **程式錯誤分三種：語法錯誤、語意錯誤、執行期間錯誤** — Java 把執行期間錯誤稱為「異常（Exception）」
- **`try-catch` 是異常處理的基本語法**，多個 catch 依序比對，較具體的異常類別要寫在前面
- **`finally` 不論是否發生異常都會執行**，即使 try/catch 有 `return` 也一樣，常用來關閉資源
- **`try-with-resources` 自動關閉實作 `AutoCloseable` 的資源**（如 `Scanner`），不需手動呼叫 `close()`
- **`throw` 是動作、在方法內部拋出一個異常物件；`throws` 是宣告、寫在方法簽名處列出可能拋出的異常類別**
- **自訂異常類別要繼承 `Exception`**，可以加入自己的欄位（如差額、不合法的分數）方便呼叫端取得更多資訊

<!--
我們把這一章整理成六個重點。

第一，程式錯誤分成語法錯誤、語意錯誤、執行期間錯誤三種，Java 把「執行期間錯誤」稱為異常，這也是這一整章要對付的對象。

第二，try-catch 是處理異常最基本的語法，try 裡放可能出錯的程式碼，catch 負責應變；如果有多個 catch 區塊，範圍較具體的異常類別一定要寫在前面，範圍較廣的寫在後面。

第三，finally 區塊不管 try 裡有沒有發生異常都一定會執行，即使 try 或 catch 裡寫了 return 也一樣，最常見的用途是關閉資源。

第四，try-with-resources 讓實作 AutoCloseable 的資源（像 Scanner）在離開 try 區塊時自動關閉，不需要我們自己在 finally 裡手動呼叫 close()。

第五，throw 和 throws 容易搞混：throw 是一個動作，寫在方法內部，主動拋出一個異常物件；throws 是一個宣告，寫在方法簽名的地方，告訴呼叫端這個方法可能丟出哪些異常類別。

第六，如果 Java 內建的異常類別不夠用，可以自己定義異常類別，只要繼承 Exception，就能擁有異常該有的能力，還可以加入自己需要的欄位，例如差額或不合法的分數，讓呼叫端能透過 getter 取得更多資訊。

這六點加起來，就是異常處理的完整概念。下一章我們要繼續往下走了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【收尾】
這一章我們從認識「程式錯誤的三大類型」開始，學會了 try-catch-finally、try-with-resources、Throwable 的常用方法，也學會了用 throw/throws 主動拋出異常，甚至能自己定義專屬的異常類別。

【核心帶走重點】
記住三個關鍵字的角色：`try` 是「我試試看」、`catch` 是「出事了該怎麼辦」、`finally` 是「不管怎樣都要做的收尾工作」。掌握這套機制，我們的程式就能在面對使用者各種「意外輸入」時，依然穩穩地運作下去。如果還有問題，歡迎隨時提出來討論！
-->
---
layout: end
---

# 程式異常的處理
### 掌握異常，讓程式更健壯

<!--
【結束語】
這一章到這裡就結束了！異常處理是讓程式從「會跑」進化到「扛得住」的關鍵一步，之後寫程式時，記得多想一下「這裡會不會出錯」，養成習慣之後，我們的程式會越來越穩固。辛苦了，下課！
-->
