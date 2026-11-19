---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 物件建構與封裝（進階／自學）
routeAlias: ch11
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
  <h1 style="color: #1a5c5c; font-size: 3.4rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">物件建構與封裝</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">進階自學內容</p>
  <Link to="home" style="color:#9dc4c4;font-size:0.85rem;margin-top:2rem;text-decoration:none;letter-spacing:0.05em;">← 返回目錄</Link>
</div>

<!--
哈囉大家，歡迎來到「物件建構與封裝」的進階自學篇！基礎版我們已經學會了建構子、封裝、存取修飾詞，以及 `static` 的基本用法（類別變數、靜態方法、靜態初始化區塊）。這份自學內容會把 `static` 跟 `private` 建構子結合起來，帶我們認識一個在業界框架裡無所不在的設計模式：Singleton（單例模式）。

為什麼要學這個？因為 Singleton 是物件導向設計模式（design pattern）的入門款，而且非常實用——資料庫連線、設定檔管理、日誌系統，這些「全程式只該有一份」的元件，背後幾乎都是 Singleton 的身影。如果你以後要學 Spring 這類框架，會發現裡面的元件（bean）預設就是 Singleton，理解這個概念能讓你少踩很多坑。

學完這份自學內容，我們會知道 Singleton 的核心結構、常見的實作變形（懶漢式 vs 餓漢式），以及為什麼在多執行緒環境下需要額外注意執行緒安全（thread safety）。準備好就開始吧！
-->

---
layout: default
---

# Outline

- **Singleton 設計模式**：核心結構（`private` 建構子 + `static` 欄位 + `static` 方法）
- **Lazy 與 Eager 初始化**：兩種建立實例時機的差異
- **執行緒安全考量**：多執行緒下 Singleton 可能出現的問題與解法
- **自學練習**：計數器與 Singleton 綜合應用

<!--
這份自學內容圍繞著一個主題：Singleton 設計模式。我們會先複習 Singleton 的基本結構與使用方式，接著介紹兩種建立實例的策略（懶漢式、餓漢式），最後談談多執行緒環境下需要注意的地方。

如果大家還記得基礎版教過的 `static` 欄位、`static` 方法和 `private` 建構子，這份內容會非常順——Singleton 其實就是把這幾個東西組合起來而已。準備好的話，我們開始吧！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Singleton 設計模式

<!--
想像一下，全台灣只能有一個總統。不管多少人想當總統，最後「總統」這個職位永遠只有一位實體在運作。

Singleton 設計模式要解決的問題很類似：有些物件在整個程式裡「只該存在一份」，例如資料庫連線池、設定檔管理器。如果讓每個地方都各自 `new` 一份，不僅浪費資源，還可能造成資料不一致。Singleton 就是用 `static` + `private` 建構子，確保整個程式共用同一個實體。
-->

---
layout: default
---

# Singleton 設計模式簡介

Singleton 保證全程式只有**一個**物件實體，使用 `static` + `private 建構子` 實作。

| 元件 | 說明 |
| --- | --- |
| `private` 建構子 | 禁止外部 `new` 出物件 |
| `private static` 欄位 | 儲存唯一實體 |
| `public static` 方法 | 提供取得實體的唯一入口 |

```java
public class Singleton {
    private static Singleton instance = null;
    private Singleton() {}         // 禁止外部建立
    public static Singleton getInstance() {
        if (instance == null)
            instance = new Singleton();
        return instance;
    }
}
```

<!--
這張表把 Singleton 拆成三個元件：`private` 建構子、`private static` 欄位、`public static` 方法。

帶大家看一下程式碼。建構子是 `private`，所以外面的人不能用 `new Singleton()`；唯一的實體存在 `instance` 這個 `static` 欄位裡；想拿到這個實體，只能透過 `getInstance()` 這個入口。

`getInstance()` 裡面寫的是：如果 `instance` 還是 `null`（表示還沒建立過），就建立一個；否則直接回傳已經存在的那一份。

💼 業界實務：在 Spring 框架裡，所有的元件預設都是 Singleton。這樣可以節省大量記憶體——想像一下，如果你有一萬個地方要處理訂單，你不需要一萬個「處理員」，你只需要一個。
-->

---

# Singleton — 使用範例

```java
Singleton s1 = Singleton.getInstance();
Singleton s2 = Singleton.getInstance();

System.out.println(s1 == s2); // true，是同一個物件
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>應用場景：</b>資料庫連線池、設定管理器（Config）、日誌管理器（Logger）等需要全域唯一實體的元件，常見以 Singleton 設計。
</div>

<!--
這個範例的目標是：驗證「不管呼叫幾次 `getInstance()`，拿到的都是同一個物件」。

帶大家看關鍵行：`s1 == s2`。這裡比的是「記憶體地址」是不是相同。因為 Singleton 保證只有一個實體，所以無論你呼叫幾次 `getInstance`，拿到的都是同一個地址，結果就是 `true`。

⚠️ 易錯點：`==` 在這裡是合理的用法，因為我們確實是在比較「是不是同一個物件」，跟比較字串內容該用 `equals` 是不同的情境。

預期結果：這段程式碼會輸出 `true`。

💼 業界實務：資料庫連線池通常就是這樣設計的。不然每個工程師都各自開連線，資料庫很快就會被連線數塞爆。
-->

---
layout: default
---

# 練習 1：設計 AppLogger 單例類別
### 任務說明

請設計一個 `AppLogger` 類別，符合 Singleton 設計模式：

1. 包含一個 `private static AppLogger instance` 欄位
2. 包含一個 `private` 建構子
3. 提供 `public static AppLogger getInstance()` 方法：第一次呼叫時才建立實體（Lazy）
4. 提供一個 `log(String message)` 方法，印出 `[LOG] message`

在 `main()` 中呼叫 `AppLogger.getInstance()` 兩次，分別存入 `logger1`、`logger2`，並用 `==` 驗證兩者是否為同一個物件。

<!--
【任務鋪陳】
我們剛剛看過 `Singleton` 這個範例類別的三個元件，現在請大家照著同樣的結構，自己動手寫一個更貼近實務的版本——一個日誌管理器 `AppLogger`。

【引導思考】
回想一下三要素：`private` 建構子要怎麼擋住 `new`？`getInstance()` 裡的 `if` 判斷條件要寫什麼，才能保證「只建立一次」？
-->

---
layout: default
---

# 練習 1：設計 AppLogger 單例類別
### 解題提示

```java
public class AppLogger {
    private static AppLogger instance = null;

    private AppLogger() {}

    public static AppLogger getInstance() {
        if (instance == null) {
            instance = new AppLogger();
        }
        return instance;
    }

    public void log(String message) {
        System.out.println("[LOG] " + message);
    }
}
```

```java
AppLogger logger1 = AppLogger.getInstance();
AppLogger logger2 = AppLogger.getInstance();

System.out.println(logger1 == logger2); // true
logger1.log("系統啟動");
```

<!--
【帶讀解法】
這題跟我們剛剛看過的 `Singleton` 範例幾乎是同一個模板：`private` 建構子擋住外部的 `new AppLogger()`；`instance` 欄位是 `private static`，整個類別只有這一份；`getInstance()` 用 `if (instance == null)` 判斷，第一次呼叫才真正 `new`，之後都直接回傳同一份。

所以 `logger1 == logger2` 一定是 `true`——因為它們指向的是同一塊記憶體。這就是 Lazy 初始化的標準寫法，跟 Eager 寫法的差異我們下一節會繼續討論。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Lazy 與 Eager 初始化

<!--
我們剛剛看到的 `getInstance()` 寫法，是「等到第一次有人呼叫，才真正建立物件」。但這不是唯一的做法——還有另一種策略是「程式一啟動就先建好」。

這兩種策略各有優缺點，接下來我們就來比較它們的差異，以及在多執行緒環境下可能遇到的問題。
-->

---
layout: default
---

# Lazy 初始化 vs Eager 初始化

| 策略 | 建立時機 | 特點 |
| --- | --- | --- |
| **Lazy（懶漢式）** | 第一次呼叫 `getInstance()` 時才建立 | 節省資源，但多執行緒下需額外處理 |
| **Eager（餓漢式）** | 類別載入時就立即建立 | 寫法簡單、天生執行緒安全，但程式啟動就佔用資源 |

```java
// Eager：宣告時直接建立，類別載入即完成
public class ConfigEager {
    private static final ConfigEager instance = new ConfigEager();
    private ConfigEager() {}
    public static ConfigEager getInstance() {
        return instance;
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選擇原則：</b>如果該物件建立成本不高、或一定會被用到，Eager 較簡單安全；若建立成本高且不一定會用到，才考慮 Lazy。
</div>

<!--
之前看到的寫法（`instance == null` 才建立）叫做 Lazy（懶漢式）——拖到真正需要的時候才動手。這裡的 `ConfigEager` 則是 Eager（餓漢式）：欄位宣告的同時就直接 `new`，類別一被載入就完成初始化。

帶大家看關鍵行：`private static final ConfigEager instance = new ConfigEager();`。這行在類別載入階段就會執行，且只會執行一次，所以天生就不會有「兩個執行緒同時建立兩份實體」的問題。

⚠️ 易錯點：Eager 寫法雖然安全，但如果這個物件本身很「重」（例如要連線資料庫、讀取大檔案），程式一啟動就會付出這個成本，即使後來根本沒用到它。

💼 業界實務：像 `Logger`（日誌管理器）這類「幾乎一定會用到、建立成本也不高」的元件，很適合用 Eager 寫法。
-->

---
layout: two-cols
---

# 練習 2：Lazy 與 Eager 初始化
### 認證模擬題（單選）

觀察以下兩種 Singleton 寫法：

```java
// 寫法一
public class A {
    private static A instance = new A();
    private A() {}
    public static A getInstance() { return instance; }
}

// 寫法二
public class B {
    private static B instance = null;
    private B() {}
    public static B getInstance() {
        if (instance == null) instance = new B();
        return instance;
    }
}
```

::right::

關於這兩種寫法，下列哪個描述是**正確**的？

A. 寫法一是 Lazy 初始化，因為 `instance` 一開始是非 `null` 的物件<br>
B. 寫法二是 Eager 初始化，因為它在類別載入時就建立物件<br>
C. 寫法一是 Eager 初始化：類別載入時就會建立 `instance`；寫法二是 Lazy 初始化：第一次呼叫 `getInstance()` 時才建立<br>
D. 兩種寫法在效果上完全相同，沒有任何差異

<!--
【出題動機】
這題想確認大家能不能正確分辨 Lazy 與 Eager 的「判斷依據」——不是看程式碼長不長，而是看「物件是什麼時候被建立的」。

【解題引導】
看看寫法一的 `instance` 欄位：它在宣告的同時就直接 `new A()`，這行會在類別被載入（class loading）時執行。再看寫法二：`instance` 一開始是 `null`，要等到 `getInstance()` 第一次被呼叫、判斷 `instance == null` 為真時，才會 `new B()`。
-->

---
layout: default
---

# 練習 2：Lazy 與 Eager 初始化
### 解析

**正確答案：C**

- ❌ A：寫法一確實一開始就是非 `null` 的物件，但這正是因為它在類別載入時就建立了——這是 Eager（餓漢式）的定義，不是 Lazy。
- ❌ B：寫法二的 `instance` 初始值是 `null`，要等到第一次呼叫 `getInstance()` 才會真正建立物件，這是 Lazy（懶漢式）的定義，不是 Eager。
- ✅ C：寫法一在欄位宣告時就直接 `new A()`，物件建立時機是「類別載入時」，符合 Eager 初始化；寫法二的 `instance` 一開始是 `null`，要等到第一次呼叫 `getInstance()`、`if (instance == null)` 成立時才建立，符合 Lazy 初始化。
- ❌ D：兩者的「建立時機」不同，會直接影響程式啟動的效能與資源使用——例如寫法一即使整個程式都沒人呼叫 `getInstance()`，物件也已經被建立了；寫法二則完全不會建立。這個差異在物件「很重」時非常關鍵。

<!--
【帶讀解法】
判斷 Lazy 還是 Eager，關鍵只有一個：「物件是在什麼時候被 `new` 出來的」。

- 欄位宣告時就 `new`（例如 `private static A instance = new A();`）→ Eager，類別載入就完成。
- 欄位先設為 `null`，在 `getInstance()` 裡用 `if (instance == null)` 才 `new` → Lazy，等到真正需要才建立。

這也是為什麼前面我們會強調：物件「重不重」會影響我們選擇哪一種策略。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 執行緒安全考量

<!--
想像一個情境：兩個服務窗口的人員，同時看到「目前沒有任何一份報表」，於是兩個人同時動手各印了一份——結果變成兩份報表，而不是預期的一份。

這就是 Lazy Singleton 在多執行緒（multi-thread）環境下可能發生的問題：兩個 thread 同時跑到 `if (instance == null)` 這一行，都判斷「還沒建立」，於是各自 `new` 了一個，導致出現兩個實體，違反了 Singleton 的初衷。
-->

---
layout: default
---

# Lazy Singleton 的執行緒安全問題

| 情境 | 問題 |
| --- | --- |
| 兩個 thread 同時呼叫 `getInstance()` | 都可能判斷 `instance == null` 為真 |
| 兩個 thread 都執行 `new Singleton()` | 產生**兩個不同的實體**，違反 Singleton 原則 |
| 解法一 | 在 `getInstance()` 加上 `synchronized` |
| 解法二 | 直接改用 Eager 初始化（天生安全） |

```java
// 解法一：synchronized 確保同一時間只有一個 thread 能進入
public static synchronized Singleton getInstance() {
    if (instance == null)
        instance = new Singleton();
    return instance;
}
```

<!--
這張表說明了問題的成因：如果兩個 thread 幾乎同時呼叫 `getInstance()`，且當時 `instance` 還是 `null`，兩邊都會通過 `if` 判斷，各自執行 `new Singleton()`，最後產生兩個實體。

帶大家看解法一：在方法前面加上 `synchronized`，代表同一時間只允許一個 thread 執行這個方法，另一個 thread 必須排隊等待。這樣就不會有「兩人同時判斷為 null」的情況。

⚠️ 易錯點：`synchronized` 雖然能解決問題，但每次呼叫 `getInstance()` 都要排隊，會稍微影響效能。如果該物件可以接受「程式啟動就建立」，改用前一頁的 Eager 寫法會更簡單、效能也更好。

💼 業界實務：這也是為什麼很多框架（如 Spring）的元件預設用 Eager 風格管理——避免在執行期還要處理這類執行緒同步問題。`synchronized` 的細節我們會在後面多執行緒（Thread）章節再深入討論。
-->

---
layout: default
---

# 練習 3：為 Lazy Singleton 加上執行緒安全
### 任務說明

以下是一個 Lazy 初始化的 `ConnectionPool` 類別，但目前**沒有處理執行緒安全問題**：

```java
public class ConnectionPool {
    private static ConnectionPool instance = null;
    private ConnectionPool() {}
    public static ConnectionPool getInstance() {
        if (instance == null) {
            instance = new ConnectionPool();
        }
        return instance;
    }
}
```

請修改 `getInstance()` 方法，加上適當的關鍵字，讓它在多執行緒環境下也能保證只建立一個實體。

<!--
【任務鋪陳】
我們剛剛看過 `synchronized` 可以解決「兩個 thread 同時判斷 `instance == null` 為真」的問題。這次請大家自己動手，把這個關鍵字加到 `ConnectionPool` 上。

【引導思考】
回想一下：`synchronized` 要加在方法的哪個位置？加上之後，方法的存取修飾詞（`public static`）順序會怎麼排列？
-->

---
layout: default
---

# 練習 3：為 Lazy Singleton 加上執行緒安全
### 解題提示

```java
public class ConnectionPool {
    private static ConnectionPool instance = null;
    private ConnectionPool() {}

    public static synchronized ConnectionPool getInstance() {
        if (instance == null) {
            instance = new ConnectionPool();
        }
        return instance;
    }
}
```

<!--
【帶讀解法】
這題的修改只有一個地方：在 `public static` 跟回傳型態 `ConnectionPool` 之間加上 `synchronized`。

加上 `synchronized` 之後，同一時間只會有一個 thread 能執行 `getInstance()` 內部的程式碼——如果有兩個 thread 幾乎同時呼叫這個方法，第二個 thread 必須等第一個 thread 執行完才能進入。這樣就不會發生「兩個 thread 都看到 `instance == null`，於是各自 `new` 了一份」的情況。

這就是我們剛剛在 `Singleton` 範例上看到的解法一，原封不動套用到 `ConnectionPool` 上。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
學完 Singleton 的核心結構與兩種初始化策略後，我們來做一題綜合練習，把 `static` 計數器和 Singleton 結合在一起應用。
-->

---
layout: default
---

# 練習 4：計數器與 Singleton
### 任務說明

1. 在 `Student` 類別中加入 `static int totalCount` 欄位，每次建立新物件時自動累計人數。
2. 設計一個 `SchoolConfig` 類別，使用 Singleton 模式，儲存學校名稱（`schoolName`），並確保全程只有一個實體。
3. 在 `main()` 中建立多個 `Student` 物件，並透過 `Student.totalCount` 驗證計數正確。
4. 呼叫 `SchoolConfig.getInstance()` 兩次，用 `==` 驗證兩次取得的是同一個物件。

<!--
回顧一下，前面我們學了 `static` 欄位是「全類別共用一份」，也學了 Singleton 是「整個程式只有一份實體」。這題請大家把這兩個概念結合起來。

引導思考：`totalCount` 應該放在建構子的哪一行累加？Singleton 的三要素（`private` 建構子、`private static` 欄位、`public static` 方法）你還記得嗎？這次要自己動手把 `SchoolConfig` 寫出來。
-->

---
layout: default
---

# 練習 4：解題提示
### 提示說明

1. static 計數器在建構子內累加：

```java
static int totalCount = 0;
Student(String name, int score) {
    this.name = name;
    this.score = score;
    totalCount++;
}
```

2. Singleton 三要素：`private` 建構子 + `private static` 欄位 + `public static getInstance()`
3. 驗證方式：

```java
SchoolConfig c1 = SchoolConfig.getInstance();
SchoolConfig c2 = SchoolConfig.getInstance();
System.out.println(c1 == c2); // 預期輸出 true
```

<!--
解題關鍵在於：Singleton 的建構子一定要是 `private`。如果你還能 `new` 出來，那就不是 Singleton，那是「假 Singleton」。

⚠️ 易錯點：別忘了 `totalCount++` 要放在建構子裡，而不是放在某個 `static` 方法裡才執行——否則每次建立物件時不會自動累加。

預期結果：建立多個 `Student` 物件後，`Student.totalCount` 會等於建立的物件數量；`c1 == c2` 會輸出 `true`。
-->

---
layout: end
---
