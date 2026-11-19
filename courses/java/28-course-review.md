---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
transition: slide-left
title: 全課程總複習
routeAlias: ch28
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
  <h1 style="color: #1a5c5c; font-size: 3.4rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">全課程總複習</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">「25 章的 Java 之旅，一次串起來」</p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
恭喜大家走完 25 章的 Java 課程！這一章不教新東西，我們要做一件更重要的事：把散落在 25 章裡的知識點，重新串成一張完整的地圖。

【為什麼要總複習？】
學程式最怕的不是學不會，是「學過但串不起來」。面試官問「封裝和介面有什麼關係」，或是實務上要寫一個完整的小系統，考的都是知識點之間的連結。

【今天的目標】
每一篇我們用「一頁一章」的速度複習核心觀念，每篇配一題快速檢測，最後用一個綜合練習把整個課程的重點全部用上。
-->

---
layout: default
---

# Outline

- **基礎語法**（Ch 1–7）— 平台、變數、運算子、流程、迴圈、陣列
- **物件導向**（Ch 10–10、14–17）— 類別、封裝、繼承、多形、抽象、介面
- **常用 API**（Ch 12–14、18）— Math、日期時間、字串、正規表達式、包裝類別
- **工程實務**（Ch 21–21）— 套件、例外處理
- **現代 Java**（Ch 26–26）— 集合框架、Lambda 與 Stream
- **綜合練習** — 圖書館借閱系統

<!--
【核心說明】
我們把 25 章重新分成五大篇。這個分法就是 Java 學習的天然階梯：先會寫「一段程式」（基礎語法），再會設計「一個類別」（物件導向），然後善用「現成的工具」（常用 API），接著讓程式「穩固可維護」（工程實務），最後用「現代寫法」讓程式更精煉（現代 Java）。

【複習策略】
每一頁都是一章的濃縮。如果某一頁看了覺得陌生，就是回去重讀那一章的訊號——這章的每一頁都標了對應章節。
-->

---

# 課程地圖：25 章 × 五大篇

| 篇章 | 涵蓋章節 | 一句話總結 |
| --- | --- | --- |
| 第一篇 基礎語法 | Ch 1–7 | 讓程式「動起來」：變數、判斷、迴圈、陣列 |
| 第二篇 物件導向 | Ch 10–10、14–17 | 讓程式「有結構」：類別、封裝、繼承、多形 |
| 第三篇 常用 API | Ch 12–14、18 | 站在巨人肩膀上：Math、時間、字串、Regex |
| 第四篇 工程實務 | Ch 21–21 | 讓程式「不會爆」：套件管理與例外處理 |
| 第五篇 現代 Java | Ch 26–26 | 讓程式「更精煉」：集合、Lambda、Stream |

<!--
【核心說明】
這張表是整個課程的鳥瞰圖。注意五篇的動詞：動起來、有結構、站在巨人肩膀上、不會爆、更精煉——這五件事就是一位 Java 工程師的基本功。

【生活化比喻】
學 Java 像學做菜：基礎語法是刀工火候，物件導向是配菜的章法，常用 API 是現成的高湯和調味料，例外處理是廚房的滅火器，現代 Java 則是讓你出菜又快又漂亮的新式廚具。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 基礎語法（Ch 1–7）

### 🧱 讓程式動起來

<!--
【過場說明】
第一篇是一切的地基：從 Java 是什麼、怎麼編譯執行，到變數、運算子、流程控制、迴圈、陣列。這些內容之後的每一章都在用，複習時重點放在「易錯點」。
-->

---

# Ch 1–2 複習：Java 平台與程式結構

| 觀念 | 重點 |
| --- | --- |
| JVM / JRE / JDK | JVM 執行 bytecode；JRE = JVM + 類別庫；JDK = JRE + 開發工具 |
| WORA 跨平台 | `javac` 編譯成 `.class`（bytecode），各平台 JVM 都能執行 |
| 程式進入點 | `public static void main(String[] args)` 一字不能錯 |
| 命名慣例 | 類別 PascalCase、方法/變數 camelCase、常數 ALL_CAPS |

```java
public class Hello {
    public static void main(String[] args) { System.out.println("Hello, Java!"); }
}
```

<!--
【核心說明】
JDK 包含 JRE、JRE 包含 JVM，這個「包含關係」是 Ch1 最常考的觀念。跨平台的關鍵是：編譯出來的不是機器碼，而是 bytecode，由各平台自己的 JVM 負責翻譯執行——一次撰寫、到處執行。

⚠️ 易錯點：
main 方法的簽名一個字都不能改：漏掉 static、把 String[] 寫成 String，程式就找不到進入點。

【回顧指引】
細節模糊的話，回 Ch 1（平台概念）和 Ch 3（程式結構與註解）。
-->

---

# Ch 4 複習：變數與資料型態

| 分類 | 型態 | 重點 |
| --- | --- | --- |
| 整數 | `byte` / `short` / `int` / `long` | 預設用 `int`；long 字面值加 `L` |
| 浮點數 | `float` / `double` | 預設用 `double`；float 字面值加 `f` |
| 字元 / 布林 | `char` / `boolean` | char 用單引號；boolean 只有 true / false |
| 參照型態 | `String` 等 | 不是基本型態，比較內容要用 `equals()` |

```java
final double TAX_RATE = 0.05;   // 常數：final + ALL_CAPS
var message = "Hello";          // var 型態推斷（Java 10+）
```

<!--
【核心說明】
8 種基本型態記法：整數 4 兄弟（byte、short、int、long）、浮點 2 兄弟（float、double）、再加 char 和 boolean。日常開發 9 成情況用 int 和 double 就夠。

⚠️ 易錯點：
String 是參照型態不是基本型態——比較兩個字串相不相等，要用 equals() 而不是 ==，這是全課程最常見的 bug 之一（Ch 17 會再深入）。

【回顧指引】
溢位、擴大/縮小轉換的細節在 Ch 4；printf 格式化輸出也在那一章。
-->

---

# Ch 5 複習：運算子與型態轉換

| 分類 | 運算子 | 重點 |
| --- | --- | --- |
| 算術 / 複合指定 | `+ - * / %`、`+= -= *=` | 整數除整數會無條件捨去小數 |
| 比較 / 邏輯 | `> < >= <= == !=`、`&& \|\| !` | `&&`、`\|\|` 有短路效果 |
| 型態提升 | 自動（小 → 大） | `int + double` 結果是 `double` |
| 強制轉換 | `(型態)` 明確轉換（大 → 小） | 可能遺失精度，需自己負責 |

```java
int a = 7, b = 2;
System.out.println(a / b);           // 3（不是 3.5！）
System.out.println((double) a / b);  // 3.5
```

<!--
【核心說明】
運算子本身不難，難在型態轉換的規則：小型態遇到大型態會自動提升；反過來要縮小，就必須明確 cast，而且精度遺失自己負責。

⚠️ 易錯點：
7 / 2 = 3 這個「整數除法陷阱」是初學者的第一個震撼教育——只要其中一邊轉成 double，結果就對了。

【回顧指引】
Scanner 輸入、parseInt/parseDouble 字串轉數值也在 Ch 5。
-->

---

# Ch 6 複習：流程控制

| 語法 | 使用時機 |
| --- | --- |
| `if` / `if-else` / `else if` 鏈 | 條件是「範圍」或複雜判斷 |
| `switch` | 條件是「固定值的清單」（整數、字串、enum） |
| 三元運算子 `? :` | 簡單的二選一賦值 |

```java
String grade = (score >= 60) ? "及格" : "不及格";
switch (day) {
    case 6, 7 -> System.out.println("週末");
    default  -> System.out.println("平日");
}
```

<!--
【核心說明】
if 和 switch 的選用原則：判斷「範圍」（分數 90 以上、60 以下）用 if-else if 鏈；判斷「固定選項」（星期幾、月份）用 switch 更清晰。

⚠️ 易錯點：
傳統 switch 忘記 break 會 fall-through 一路往下執行。範例用的箭頭語法（switch expression）沒有這個問題，是現代 Java 推薦的寫法。

【回顧指引】
BMI、生肖判斷等完整專題在 Ch 6。
-->

---

# Ch 7 複習：迴圈

| 語法 | 使用時機 |
| --- | --- |
| `for` / for-each | 已知次數；走訪陣列或集合用 for-each 最簡潔 |
| `while` | 次數未知，先檢查再執行 |
| `do-while` | 至少要執行一次（如：選單、輸入驗證） |
| `break` / `continue` | 提早離開迴圈 / 跳過本輪 |

```java
int sum = 0;
for (int i = 1; i <= 100; i++) sum += i;   // 高斯加總
System.out.println(sum);                    // 5050
```

<!--
【核心說明】
三種迴圈選用心法：知道跑幾次用 for，不知道跑幾次用 while，至少要跑一次用 do-while。走訪陣列或集合，優先用 for-each，不用自己管索引。

⚠️ 易錯點：
while 條件永遠為 true 又沒有 break，就是無限迴圈。while(true) + break 是合法且常用的「輸入驗證」模式，但 break 條件一定要到得了。

【回顧指引】
巢狀迴圈（九九乘法表）、Scanner 輸入驗證、雞兔同籠專題在 Ch 7。
-->

---

# Ch 8 複習：陣列

| 觀念 | 重點 |
| --- | --- |
| 宣告與長度 | `int[] arr = new int[5];`；長度是屬性 `arr.length`（無括號） |
| 索引範圍 | `0` 到 `length - 1`，超出丟 `ArrayIndexOutOfBoundsException` |
| 參照特性 | `b = a` 只複製參照；獨立複製用 `Arrays.copyOf()` |
| 二維陣列 | 「陣列的陣列」，`arr[i][j]`，雙層迴圈走訪 |

```java
int[] scores = {90, 65, 78};
System.out.println(scores.length);          // 3
int[] copy = java.util.Arrays.copyOf(scores, scores.length);
```

<!--
【核心說明】
陣列三個必記：索引從 0 開始、length 是屬性不是方法（跟 String 的 length() 相反！）、陣列變數存的是參照。

⚠️ 易錯點：
b = a 之後改 b[0]，a[0] 也跟著變——因為兩個變數指向同一塊記憶體。要真正複製，用 Arrays.copyOf()。這個「參照 vs 複製」的觀念在 Ch 10 的物件上會再出現一次。

【回顧指引】
Stack/Heap 記憶體圖解、矩陣運算、線性搜尋在 Ch 8。
-->

---
layout: default
---

# 練習：基礎語法快速檢測
### 任務說明

寫一個程式 `ScoreReport`，完成以下需求：

1. 建立整數陣列 `scores = {85, 42, 90, 58, 73, 66}`
2. 用迴圈計算**平均分數**（注意：結果要有小數）
3. 找出**最高分**與**最低分**
4. 統計**及格人數**（60 分含以上），用 `printf` 輸出：

```text
平均：69.0 分，最高：90，最低：42，及格：4 人
```

<!--
【題目設計說明】
這題一次用上第一篇的四個重點：陣列、迴圈、if 判斷、型態轉換（整數總和除以人數要轉 double）、printf 格式化。

【給學生的提示】
先別看下一頁，自己動手寫。卡住的點通常是「平均變成整數」——想想 Ch 5 的整數除法陷阱。
-->

---

# 練習：解題提示

1. **累加與極值**：用 for-each 走訪，同時維護 `sum`、`max`、`min` 三個變數
2. **平均要轉型**：`(double) sum / scores.length`，否則整數除法會捨去小數
3. **及格計數**：`if (s >= 60) count++;`
4. **格式化輸出**：`printf("平均：%.1f 分，...", avg, ...)`

```java
int sum = 0, max = scores[0], min = scores[0], count = 0;
for (int s : scores) {
    sum += s;
    if (s > max) max = s;
    if (s < min) min = s;
    if (s >= 60) count++;
}
```

<!--
【解題重點】
max 和 min 的初始值用 scores[0] 而不是 0——如果全部分數都低於 0 的情境（其他題目），初始值設 0 會出錯，這是找極值的標準起手式。

一次走訪同時完成四件事（加總、極值 ×2、計數），比跑四次迴圈更有效率，也是實務上的常見寫法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 物件導向（Ch 10–10、14–17）

### 🏗️ 讓程式有結構

<!--
【過場說明】
第二篇是 Java 的靈魂：物件導向。從類別與物件開始，經過封裝、繼承、多形，到抽象類別與介面。這五章的觀念環環相扣，也是面試最愛考的區塊。
-->

---

# Ch 10 複習：類別與物件

| 概念 | 重點 |
| --- | --- |
| 類別 vs 物件 | 類別是設計圖，`new` 出來的實體才是物件 |
| 欄位 / 方法 | 物件的資料 / 物件的行為 |
| 參照型態 | `b = a` 是複製參照，兩個變數指同一個物件 |
| 方法多載 Overloading | 同名方法、參數列不同；呼叫時依參數自動選擇 |

```java
Car c1 = new Car();
Car c2 = c1;            // c2 和 c1 指向同一台車
c2.speed = 100;         // c1.speed 也變 100！
```

<!--
【核心說明】
類別與物件的關係（設計圖 vs 實體）是整個物件導向的起點。第二個關鍵是參照：物件變數存的是「遙控器」，賦值只是多發一支遙控器，電視還是同一台。

⚠️ 易錯點：
方法參數傳遞是 Pass by Value——傳基本型態是複製值，傳物件是複製「參照的值」，所以方法內可以改到原物件的欄位。

【回顧指引】
this 關鍵字、變數範圍（Scope 遮蔽）、物件陣列在 Ch 10。
-->

---

# Ch 11 複習：建構子、封裝與 static

| 概念 | 重點 |
| --- | --- |
| 建構子 | 與類別同名、無回傳型態；自訂後預設建構子消失 |
| 建構子多載 + `this()` | 多種初始化方式；`this()` 呼叫同類別其他建構子 |
| 封裝 | `private` 欄位 + `public` getter/setter，修改必經驗證 |
| `static` | 屬於類別而非物件；全部物件共用一份 |

```java
public class Product {
    private int price;                       // 🔒 封裝
    public void setPrice(int p) { if (p > 0) price = p; }
}
```

<!--
【核心說明】
建構子讓物件「一出生就是對的」；封裝讓物件「活著的時候不會被弄壞」。兩者合起來，就是一個安全類別的標準配備。

⚠️ 易錯點：
（1）建構子不能寫回傳型態，連 void 都不行——寫了就變普通方法。（2）一旦自訂了建構子，Java 不再自動補預設建構子。（3）static 方法內不能直接使用實體欄位。

【回顧指引】
四種存取修飾詞（private / default / protected / public）比較表、JavaBean 慣例在 Ch 11。想看「不封裝會發生什麼事」的實況演示，可以看特別篇的 AI 協作試教。
-->

---

# Ch 16 複習：繼承與多形

| 概念 | 重點 |
| --- | --- |
| 繼承 `extends` | 子類別取得父類別成員；Java 只能單一繼承 |
| `super` | 呼叫父類別建構子（必須在第一行）或父類別方法 |
| Override | 子類別重寫父類別方法；加 `@Override` 讓編譯器把關 |
| 多形 + Upcasting | 父型態變數裝子物件，執行時跑「子類別的版本」 |

```java
Animal a = new Dog();   // Upcasting：父型態裝子物件
a.speak();              // 執行 Dog 重寫的版本 → 多形！
```

<!--
【核心說明】
繼承解決「重複的程式碼」，多形解決「重複的呼叫邏輯」。範例兩行是整章精華：宣告型態看左邊（Animal），實際執行的方法看右邊（Dog）——這就是執行時期多形。

⚠️ 易錯點：
（1）Override 是方法簽名完全相同的「重寫」；Overload 是同名不同參數的「多載」，兩個常搞混。（2）建構子不會被繼承，但子類別建構子第一行一定會呼叫 super()。

【回顧指引】
IS-A vs HAS-A、方法隱藏、向下轉型（Downcasting）與 instanceof 在 Ch 16。
-->

---

# Ch 18–18 複習：抽象類別 vs 介面

| 比較項目 | 抽象類別 `abstract class` | 介面 `interface` |
| --- | --- | --- |
| 繼承 / 實作數量 | `extends` 只能一個 | `implements` 可以多個 |
| 欄位 | 可有一般欄位 | 只能 `public static final` 常數 |
| 方法 | 抽象 + 一般方法混用 | 抽象為主（Java 8+ 可有 default） |
| 建構子 | 有（供子類別 super() 用） | 沒有 |
| 選用時機 | 一群「本質相同」的類別共用骨架 | 定義「能做什麼」的能力規格 |

<!--
【核心說明】
選用心法一句話：「is-a 且要共用程式碼」用抽象類別；「can-do 能力規格」用介面。例如 Dog is-a Animal（抽象類別）；Dog can Swim（介面）。

⚠️ 易錯點：
（1）抽象類別不能 new，但可以當 Upcasting 的宣告型態。（2）子類別沒實作完所有抽象方法，自己也得宣告成 abstract。（3）介面欄位一律是常數，寫 int MAX = 10; 其實是 public static final int MAX = 10;

【回顧指引】
介面多重繼承、default 方法、實作衝突的解法在 Ch 18–18。
-->

---

# Ch 17 複習：Object 類別

| 方法 | 重點 |
| --- | --- |
| `toString()` | 預設印「類別名@哈希碼」；Override 後 println 直接印出內容 |
| `equals()` | Object 版比參照；要比「內容」必須 Override（String 已做好） |
| `hashCode()` | equals 相等 → hashCode 必須相等；用 `Objects.hash()` 實作 |
| `getClass()` | 取得物件的執行時期類別資訊 |

```java
String a = new String("Java"), b = new String("Java");
System.out.println(a == b);        // false（不同物件）
System.out.println(a.equals(b));   // true（內容相同）
```

<!--
【核心說明】
所有類別都隱含繼承 Object，所以每個物件天生就有 toString、equals、hashCode。這三個方法是「值物件」的鐵三角：要放進 HashSet / HashMap 當 key 的類別，equals 和 hashCode 必須成對 Override。

⚠️ 易錯點：
== 比的是「兩支遙控器是不是同一支」，equals（Override 後）比的是「兩台電視內容一不一樣」。字串比較永遠用 equals。

【回顧指引】
Objects 工具類別（isNull、requireNonNullElse）、現代化 equals 寫法在 Ch 17。
-->

---
layout: default
---

# 練習：物件導向快速檢測
### 任務說明

設計一個圖形繼承體系：

1. 抽象類別 `Shape`：`private String name` + 建構子 + 抽象方法 `double area()`
2. `Circle`（半徑 r）與 `Rect`（寬 w、高 h）繼承 `Shape`，各自實作 `area()`
3. Override `toString()`，格式：`圓形，面積 78.54`
4. 用 `Shape[] shapes = { new Circle(5), new Rect(3, 4) }` 走訪，印出每個圖形

**考點**：封裝、建構子 + `super()`、抽象方法、多形（Upcasting）、`toString()`

<!--
【題目設計說明】
一題打包第二篇五章的重點：封裝（private name）、建構子鏈（super）、抽象類別（不能 new Shape）、多形（Shape 陣列裝子類別物件）、Object 方法（toString）。

【給學生的提示】
先畫類別圖再動手：Shape 在上，Circle 和 Rect 在下。走訪時 println(shape) 會自動呼叫 toString()。
-->

---

# 練習：解題提示

1. **抽象類別**：`abstract class Shape` + `abstract double area();`（沒有方法本體）
2. **建構子鏈**：子類別建構子第一行 `super(name);` 把名稱傳給父類別
3. **多形走訪**：陣列宣告型態是 `Shape`，執行時各自呼叫自己的 `area()`

```java
abstract class Shape {
    private String name;
    Shape(String name) { this.name = name; }
    abstract double area();
    public String toString() { return name + "，面積 " + String.format("%.2f", area()); }
}
```

<!--
【解題重點】
最精妙的一行是 toString() 裡呼叫 area()——父類別的 toString 呼叫「還沒實作的抽象方法」，執行時卻會跑到子類別的版本。這就是多形 + 抽象方法的合體技，也是 Template Method 設計模式的雛形。

Circle 的 area 是 Math.PI * r * r（Ch 12 的 Math 類別馬上要複習）。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 常用 API（Ch 12–14、18）

### 🧰 站在巨人肩膀上

<!--
【過場說明】
第三篇是「工具箱」：Math 數學、日期時間、字串處理、正規表達式、包裝類別。這些 API 不用死背，重點是知道「有這個工具、去哪裡找」。
-->

---

# Ch 12 複習：Math 與 Random

| 方法 | 重點 |
| --- | --- |
| `Math.random()` | 回傳 `[0.0, 1.0)` 的 double；取 1–6 骰子：`(int)(Math.random()*6)+1` |
| `round()` / `ceil()` / `floor()` | 四捨五入 / 無條件進位 / 無條件捨去 |
| `max()` / `min()` / `abs()` / `pow()` / `sqrt()` | 極值、絕對值、次方、開根號 |
| `Random` 類別 | `nextInt(n)` 直接給 `[0, n)` 整數，比 Math.random() 好用 |

```java
Random rand = new Random();
int dice = rand.nextInt(6) + 1;    // 1–6
```

<!--
【核心說明】
Math.random() 的範圍「含 0 不含 1」是關鍵——所以乘 6 再轉 int 得到 0–5，加 1 才是骰子。用 Random 類別的 nextInt(6) + 1 更直觀，實務上建議用 Random。

⚠️ 易錯點：
round(-2.5) 是 -2 不是 -3（往「大」的方向四捨五入）；rint() 用的是銀行家捨入法，遇 .5 取偶數。

【回顧指引】
捨入方法完整對照表、數學常數在 Ch 12。
-->

---

# Ch 13 複習：日期與時間

| 類別 | 用途 |
| --- | --- |
| `LocalDate` | 只有日期：生日、節日、`plusDays()`、`isBefore()` |
| `LocalTime` | 只有時間：營業時間、鬧鐘 |
| `LocalDateTime` | 日期 + 時間：訂單成立時間、報名截止 |
| `DateTimeFormatter` | 格式化（`format`）與解析（`parse`）：`yyyy-MM-dd HH:mm` |

```java
LocalDate today = LocalDate.now();
LocalDate deadline = LocalDate.of(2026, 12, 31);
System.out.println(today.isBefore(deadline));   // true
```

<!--
【核心說明】
選類別的口訣：只關心「哪一天」用 LocalDate，只關心「幾點」用 LocalTime，兩個都要用 LocalDateTime。這一組是 Java 8 的新 API，不可變（每次操作回傳新物件），比舊的 Date 好用得多。

⚠️ 易錯點：
格式符號大小寫有別：MM 是月、mm 是分；HH 是 24 小時制、hh 是 12 小時制。plusDays() 不會改原物件，要接回傳值。

【回顧指引】
格式符號完整表、四類別選用時機在 Ch 13。
-->

---

# Ch 14 複習：字元與字串

| 方法 | 重點 |
| --- | --- |
| `length()` / `isEmpty()` / `isBlank()` | 長度（方法，有括號！）／空字串／全空白 |
| `indexOf()` / `substring(a, b)` | 搜尋位置／擷取 `[a, b)`——含頭不含尾 |
| `replace()` / `strip()` / `split()` | 取代／去頭尾空白／切割成陣列 |
| `equals()` / `equalsIgnoreCase()` | 內容比較／忽略大小寫比較 |

```java
String s = "  Hello Java  ";
System.out.println(s.strip().substring(0, 5));   // Hello
System.out.println("a,b,c".split(",").length);   // 3
```

<!--
【核心說明】
String 是不可變的：所有方法都回傳「新字串」，原字串不動。所以 s.strip() 不接回傳值等於白做。substring 的「含頭不含尾」跟之後 Stream 的 range 一樣，是 Java 的一貫慣例。

⚠️ 易錯點：
字串的 length() 是方法要加括號，陣列的 length 是屬性不加括號——兩者剛好相反，考試最愛考。

【回顧指引】
Character 類別（isDigit、isLetter）、StringBuilder、跳脫字元在 Ch 14。
-->

---

# Ch 15 複習：正規表達式

| 符號 | 意義 |
| --- | --- |
| `\d` / `\w` / `\s` | 數字／文字（字母數字底線）／空白 |
| `[abc]` / `[^abc]` / `[a-z]` | 字元集合／否定集合／範圍 |
| `?` / `*` / `+` / `{n,m}` | 0 或 1 次／0 次以上／1 次以上／n 到 m 次 |
| `()` / `\|` / `.` | 分組／或／任意單一字元 |

```java
String phone = "0912-345-678";
System.out.println(phone.matches("09\\d{2}-\\d{3}-\\d{3}"));   // true
```

<!--
【核心說明】
Regex 是「用一行規則描述一整類字串」的迷你語言。搭配 String 的 matches()（整串驗證）、replaceAll()（批次取代）、split()（切割），就能處理 8 成的字串驗證需求。

⚠️ 易錯點：
在 Java 字串裡，\d 要寫成 "\\d"——第一個反斜線是 Java 字串的跳脫，第二個才是給 regex 的。

【回顧指引】
貪婪 vs 懶惰量詞、Pattern/Matcher、Email 與身分證驗證練習在 Ch 15。
-->

---

# Ch 20 複習：包裝類別

| 概念 | 重點 |
| --- | --- |
| 對照表 | `int → Integer`、`double → Double`、`char → Character`… |
| 自動裝箱 / 拆箱 | 基本型態 ↔ 包裝物件自動轉換；集合只能裝物件 |
| 字串轉數值 | `Integer.parseInt("123")`、`Double.parseDouble("3.14")` |
| 兩大陷阱 | `==` 比較不可靠（快取範圍外）；`null` 拆箱丟 NPE |

```java
Integer a = 200, b = 200;
System.out.println(a == b);        // false！（超出快取範圍）
System.out.println(a.equals(b));   // true
```

<!--
【核心說明】
包裝類別存在的理由：集合框架（下一篇的主角）只能裝物件，不能裝基本型態。ArrayList<Integer> 能寫 add(5)，是自動裝箱在幕後幫忙。

⚠️ 易錯點：
（1）Integer 用 == 比較，-128~127 內是 true、外面是 false——永遠用 equals。（2）Integer 是 null 時自動拆箱會丟 NullPointerException，先判 null 再用。

【回顧指引】
Integer/Double/Boolean 的完整方法、MIN_VALUE/MAX_VALUE 常數在 Ch 20。
-->

---
layout: default
---

# 練習：常用 API 快速檢測
### 任務說明

寫一個「生日驗證器」`BirthdayChecker`：

1. 使用者輸入生日字串，如 `"2008-05-17"`
2. 先用**正規表達式**驗證格式是否為 `yyyy-MM-dd`（4 碼-2 碼-2 碼數字）
3. 格式正確才用 `LocalDate.parse()` 轉成日期
4. 計算今年生日是否已過，並印出實歲年齡（用 `Period` 或年份相減皆可）
5. 年齡若不在 0–150 之間，印出「請確認輸入」

**考點**：Regex 驗證、LocalDate、字串處理、條件判斷

<!--
【題目設計說明】
真實系統處理使用者輸入的標準流程就是這題：先驗格式（Regex）、再轉型（parse）、最後驗語意（年齡範圍）。三層防線缺一不可。

【給學生的提示】
Regex 寫 "\\d{4}-\\d{2}-\\d{2}"。注意這只驗「格式」，2008-99-99 也會過——所以才需要 parse 和範圍檢查當第二、三層防線。
-->

---

# 練習：解題提示

1. **格式驗證**：`birthday.matches("\\d{4}-\\d{2}-\\d{2}")`
2. **轉日期**：`LocalDate d = LocalDate.parse(birthday);`（ISO 格式可直接 parse）
3. **算年齡**：`Period.between(d, LocalDate.now()).getYears()`

```java
if (!input.matches("\\d{4}-\\d{2}-\\d{2}")) {
    System.out.println("格式錯誤，請用 yyyy-MM-dd");
    return;
}
int age = Period.between(LocalDate.parse(input), LocalDate.now()).getYears();
```

<!--
【解題重點】
Period.between 會自動處理「今年生日過了沒」，比手動年份相減準確——這就是「站在巨人肩膀上」：能用現成 API 就不要自己算。

進階挑戰：把「格式錯誤」改成拋出例外，銜接第四篇的例外處理。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 工程實務（Ch 21–21）

### 🛡️ 讓程式不會爆

<!--
【過場說明】
第四篇從「寫得出來」進化到「寫得穩固」：套件讓大型專案有秩序，例外處理讓程式面對錯誤不會直接死掉。
-->

---

# Ch 21 複習：套件 Package

| 概念 | 重點 |
| --- | --- |
| `package` 宣告 | 檔案第一行；套件名 = 目錄結構 |
| 命名慣例 | 網域反寫全小寫：`com.example.project.module` |
| `import` | 匯入其他套件的類別；`java.lang` 免 import |
| `import static` | 匯入靜態成員：`import static java.lang.Math.PI;` |

```java
package com.example.shop;

import java.util.ArrayList;   // 匯入集合類別
```

<!--
【核心說明】
套件就是程式碼的資料夾系統，兩個目的：分類管理、避免命名衝突。兩個不同套件都有 Date 類別時，用全名 java.util.Date 區分。

⚠️ 易錯點：
package 宣告必須是檔案第一行程式敘述（註解除外）；套件名和實際目錄結構必須一致，否則編譯器找不到。

【回顧指引】
萬用字元 import 的限制（不含子套件）、JDK 常用標準套件清單在 Ch 21。
-->

---

# Ch 22 複習：例外處理

| 概念 | 重點 |
| --- | --- |
| `try-catch-finally` | 捕捉處理；`finally` 無論如何都執行 |
| 多個 catch | 子類別例外放前面，父類別放後面 |
| `throw` vs `throws` | 方法內拋出實例 vs 方法簽名宣告「可能拋出」 |
| 自訂例外 | 繼承 `Exception`（受檢）或 `RuntimeException`（非受檢） |

```java
try (Scanner sc = new Scanner(System.in)) {      // try-with-resources
    int n = Integer.parseInt(sc.nextLine());
} catch (NumberFormatException e) {
    System.out.println("請輸入數字：" + e.getMessage());
}
```

<!--
【核心說明】
例外處理的哲學：錯誤不可避免，但「錯誤發生後程式怎麼反應」可以設計。try-catch 讓程式從「當掉」變成「優雅地報錯並繼續」。

⚠️ 易錯點：
（1）catch 順序錯誤（父類別 Exception 放第一個）會讓後面的 catch 變死碼，直接編譯錯誤。（2）try-with-resources 會自動關閉資源，優先於手動 finally close。（3）受檢例外必須處理或 throws，非受檢（RuntimeException 家族）則自由。

【回顧指引】
Throwable 階層圖、自訂例外完整範例在 Ch 22。
-->

---
layout: default
---

# 練習：工程實務快速檢測
### 任務說明

改造第三篇的生日驗證器，加上例外處理：

1. 自訂例外 `InvalidBirthdayException`（繼承 `Exception`），帶錯誤訊息
2. 寫方法 `static int calcAge(String input) throws InvalidBirthdayException`
   - 格式錯誤 → `throw new InvalidBirthdayException("格式錯誤")`
   - 年齡不在 0–150 → `throw new InvalidBirthdayException("年齡不合理")`
3. `main` 用 `try-catch` 呼叫，捕捉後印出 `e.getMessage()`
4. 無論成功失敗，`finally` 印出「驗證結束」

**考點**：自訂例外、throw / throws、try-catch-finally

<!--
【題目設計說明】
這題示範「驗證邏輯」和「錯誤處理」的分工：calcAge 只負責驗證和拋出，main 決定怎麼面對錯誤。這個「拋的人不管接、接的人不管驗」的分層，是實務例外設計的核心。

【給學生的提示】
自訂例外只要一個建構子：super(message)。方法簽名的 throws 不能漏，否則受檢例外編譯不過。
-->

---

# 練習：解題提示

1. **自訂例外**只需三行：類別宣告 + 建構子轉呼叫 `super`
2. **驗證方法**把 Regex 和範圍檢查換成 `throw`
3. **main** 負責 try-catch，把錯誤變成友善訊息

```java
class InvalidBirthdayException extends Exception {
    InvalidBirthdayException(String msg) { super(msg); }
}

// main 中：
try { System.out.println("年齡：" + calcAge(input)); }
catch (InvalidBirthdayException e) { System.out.println("錯誤：" + e.getMessage()); }
finally { System.out.println("驗證結束"); }
```

<!--
【解題重點】
比較改造前後：改造前，格式錯誤只是印一行字然後 return，呼叫端無從得知失敗；改造後，錯誤變成「會傳染的訊號」，呼叫端被編譯器強迫面對。這就是受檢例外的價值。

想一想：如果改成繼承 RuntimeException，main 的 try-catch 還必要嗎？（答案：編譯器不強迫，但好習慣仍建議處理。）
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 現代 Java（Ch 26–26）

### ⚡ 讓程式更精煉

<!--
【過場說明】
最後一篇是現代 Java 的兩大支柱：集合框架取代陣列成為日常容器，Lambda 和 Stream 讓資料處理從「怎麼做」變成「做什麼」。這兩章也是銜接 Spring Boot 等框架的必備基礎。
-->

---

# Ch 26 複習：集合框架

| 介面 | 特性 | 常用實作 |
| --- | --- | --- |
| `List` | 有序、可重複、有索引 | `ArrayList` |
| `Set` | 不可重複 | `HashSet` |
| `Map` | key-value 對應，key 不重複 | `HashMap` |
| `Collections` 工具 | `sort()`、`shuffle()`、`max()` | — |

```java
Map<String, Integer> stock = new HashMap<>();
stock.put("蘋果", 30);
stock.put("蘋果", 50);              // 同 key 覆蓋
System.out.println(stock.get("蘋果"));   // 50
```

<!--
【核心說明】
三大介面選用口訣：要順序和索引用 List、要去重複用 Set、要「查表」用 Map。宣告型態寫介面（List）、new 寫實作（ArrayList），是業界標準寫法——這正是第二篇多形的實際應用。

⚠️ 易錯點：
（1）Map 的 put 遇到相同 key 是「覆蓋」不是報錯。（2）集合的泛型只能放包裝類別：List<Integer> 不能寫 List<int>——呼應 Ch 20。（3）自訂類別放 HashSet 要 Override equals + hashCode——呼應 Ch 17。

【回顧指引】
Iterator、Map 三種遍歷方式、選用指南流程圖在 Ch 26。
-->

---

# Ch 27 複習：Lambda 與 Stream

| 概念 | 重點 |
| --- | --- |
| Lambda | `(參數) -> 結果`；實作函數式介面的簡潔語法 |
| 函數式介面 | `Predicate`（判斷）、`Function`（轉換）、`Consumer`（消費）、`Supplier`（供應） |
| 方法參考 | `String::toUpperCase`，Lambda 的再簡化 |
| Stream 管線 | 建立 → 中間操作（`filter` / `map` / `sorted`）→ 終端操作（`toList` / `count` / `forEach`） |

```java
List<Integer> scores = List.of(85, 42, 90, 58, 73);
List<Integer> passed = scores.stream()
    .filter(s -> s >= 60).sorted().toList();     // [73, 85, 90]
```

<!--
【核心說明】
Stream 把「for 迴圈 + if + 暫存 List」的三段式寫法，濃縮成一條宣告式管線：filter 挑資料、map 轉資料、toList 收結果。讀起來像在描述需求，而不是描述步驟。

⚠️ 易錯點：
（1）Stream 是一次性的，終端操作後不能重用。（2）沒有終端操作，中間操作根本不會執行（惰性求值）。（3）toList() 是 JDK 16 的捷徑，舊版用 collect(Collectors.toList())。

【回顧指引】
四大函數式介面、Optional、Collectors.groupingBy 在 Ch 27。
-->

---
layout: default
---

# 練習：現代 Java 快速檢測
### 任務說明

用集合與 Stream 重寫第一篇的成績統計：

1. 用 `List<Integer> scores = List.of(85, 42, 90, 58, 73, 66)` 建立名單
2. 用 Stream 求：**及格名單**（≥60，由高到低排序）
3. 用 Stream 求：**平均分數**（提示：`mapToInt` + `average()`，回傳 `OptionalDouble`）
4. 用 Stream 求：**及格人數**（`count()`）

比較看看：和第一篇的 for 迴圈版本，哪個更好讀？

**考點**：List、Stream 管線、Lambda、Optional

<!--
【題目設計說明】
刻意用「第一篇的同一題」讓學生對照兩種寫法——for 迴圈是「怎麼一步步做」，Stream 是「我要什麼結果」。同一需求寫兩遍，才真正體會到 Stream 的價值。

【給學生的提示】
由高到低排序要給 sorted 一個 Comparator：sorted(Comparator.reverseOrder())。average() 回傳 OptionalDouble，用 getAsDouble() 或 orElse(0) 取值。
-->

---

# 練習：解題提示

1. **及格名單**：`filter` → `sorted(reverseOrder())` → `toList()`
2. **平均**：`mapToInt(Integer::intValue)` 轉成 IntStream 才有 `average()`
3. **計數**：`filter(...).count()` 回傳 long

```java
List<Integer> passed = scores.stream()
    .filter(s -> s >= 60)
    .sorted(Comparator.reverseOrder())
    .toList();                                    // [90, 85, 73, 66]

double avg = scores.stream().mapToInt(Integer::intValue).average().orElse(0);
```

<!--
【解題重點】
mapToInt 的必要性：一般 Stream<Integer> 沒有 average()，要先轉成基本型態特化的 IntStream——這裡又用上了 Ch 20 的裝箱拆箱知識。

Integer::intValue 是方法參考，等價於 s -> s.intValue()。整條管線串起 Lambda、方法參考、Optional 三個概念。
-->

---
layout: default
---

# 綜合練習：圖書館借閱系統
### 任務說明

整合全課程知識，設計一個小型借閱系統：

1. **封裝**：`Book` 類別 — `private` 的書名、作者、是否借出 + 建構子 + getter
2. **繼承與多形**：`Ebook extends Book`，Override `toString()` 加上「(電子書)」
3. **集合**：`Map<String, Book>` 當館藏（key 是書號，如 `"B001"`）
4. **例外**：借閱已借出的書 → 拋自訂 `BookUnavailableException`，`main` 以 try-catch 處理
5. **Stream**：列出所有「未借出」的書、統計借出比例
6. **Regex**：書號格式驗證 — 必須是 `B` + 3 位數字

<!--
【題目設計說明】
這是全課程的畢業考，五大篇全部入鏡：封裝與建構子（第二篇）、繼承多形（第二篇）、Map 與 Stream（第五篇）、自訂例外（第四篇）、Regex（第三篇）、而所有邏輯底層都是第一篇的語法。

【給學生的提示】
建議實作順序：先讓 Book/Ebook 能動（printAll 驗證多形）→ 再加 Map 館藏 → 再加借書方法與例外 → 最後加 Stream 統計和 Regex 驗證。一次寫一層，每層都先跑通。
-->

---

# 綜合練習：解題提示

1. **借書方法**：先 Regex 驗書號 → 查 Map（可能是 null！）→ 檢查借出狀態 → 拋例外或更新
2. **多形**：館藏 Map 的 value 型態是 `Book`，放 `Ebook` 也沒問題，`toString()` 自動跑子類別版本
3. **Stream 統計**：`books.values().stream().filter(b -> !b.isBorrowed())`

```java
public void borrow(String id) throws BookUnavailableException {
    if (!id.matches("B\\d{3}")) throw new BookUnavailableException("書號格式錯誤");
    Book book = books.get(id);
    if (book == null) throw new BookUnavailableException("查無此書：" + id);
    if (book.isBorrowed()) throw new BookUnavailableException("已被借出：" + id);
    book.setBorrowed(true);
}
```

<!--
【解題重點】
borrow 方法是「防禦式程式設計」的縮影：三層檢查（格式 → 存在 → 狀態）全部通過才改資料，任何一層失敗都用例外明確告知原因。這正是 demo 章「有警衛的門」的完整體。

寫完這題，你已經具備讀懂任何 Java 專案基本結構的能力——因為真實專案就是這些元素的放大版。
-->

---

# 全課程回顧與下一步

| 你已具備 | 下一步建議 |
| --- | --- |
| Java 語法與物件導向設計 | **Spring Boot** — 用 Java 寫 Web 後端 |
| 集合、Stream 資料處理 | **JDBC / JPA** — 連接資料庫 |
| 例外處理與套件管理 | **Maven / Gradle** — 專案建置工具 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>學習心法：</b> 卡關時回到對應章節複習，或善用 AI 助教——「出 3 題考我 ___，答錯先給提示不給答案」（詳見特別篇：AI 協作試教）。
</div>

<!--
【收尾說明】
左欄是這 25 章給你的四項核心能力，右欄是業界 Java 工程師的標準成長路線。Spring Boot 幾乎是 Java 後端的代名詞，而你在這門課學的封裝、介面、注解概念，正是看懂 Spring 的前提。

【AI 學習法】
最後推薦特別篇的 AI 提問模板：解釋概念、引導除錯、出題驗收、控制範圍——四句話讓 AI 變成你的 24 小時助教。

【感謝】
25 章走完不容易，恭喜大家，我們 Spring Boot 再見！
-->

---
layout: end
---

# Q & A

### 全課程總複習完畢 🎓 恭喜完課！

<!--
【結尾】
開放提問。常見問題方向：面試考什麼（封裝、多形、equals/hashCode、集合選用）、下一步學什麼（Spring Boot）。

也可以現場示範用 AI 出題複習——把總複習的任何一頁貼給 AI：「根據這頁內容出 3 題考我」。
-->
