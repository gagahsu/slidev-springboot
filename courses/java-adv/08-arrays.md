---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 陣列（進階／自學）
routeAlias: ch08
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
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">陣列</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">進階自學內容</p>
  <Link to="home" style="color:#9dc4c4;font-size:0.85rem;margin-top:2rem;text-decoration:none;letter-spacing:0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到陣列的進階自學區！基礎篇我們已經把一維、二維陣列、參照型態的核心玩法都摸熟了，這裡準備了四個「再往下挖一點」的主題，讓我們對陣列的理解更扎實。

【為什麼要學】
這些內容不是寫不出基本程式的必要條件，但它們解釋了「為什麼 Java 會這樣設計」、「程式跑久了記憶體去哪了」、以及「怎麼跟使用者互動」。懂了這些，遇到奇怪的 bug 或效能問題時，我們會更有方向感。

【學習目標】
學完這份自學內容，我們會知道怎麼宣告長度不一的「不規則陣列」、理解垃圾回收（GC）怎麼幫我們管理記憶體、學會讀取命令列參數，最後還能完成一個命令列版的小計算器。
-->

---
layout: default
---

# Outline

- **陣列記憶體進階** — 垃圾回收（GC）、不規則陣列（Jagged Array）
- **命令列程式設計** — `String[] args`、計算器專題
- **綜合練習**

<!--
【核心說明】
這份自學內容分成兩大塊：第一塊回到「記憶體」這個主題，補完垃圾回收的細節，並認識陣列的另一種彈性用法——不規則陣列。第二塊則轉向「跟外部世界互動」，學習命令列參數，並用一個小計算器把所學串起來。

【生活化比喻】
第一塊像是回頭看看「房子蓋好之後，誰負責拆掉沒人住的空屋」；第二塊則像是「學會看懂使用者傳進來的紙條，並做出回應」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 陣列記憶體進階

<!--
【章節標題】
第一部分，我們回到記憶體的世界。先補完垃圾回收（GC）怎麼運作，再認識一種「長度可以不一樣」的特殊陣列——不規則陣列。
-->

---
layout: default
---

# 什麼是垃圾回收（GC）？

Java 的 GC 自動追蹤並清除 Heap 上**不再被引用**的物件，釋放記憶體。

```java
int[] arr = new int[]{1, 2, 3}; // arr 指向 Heap 上的陣列

arr = null; // arr 不再指向那個陣列了
            // → 原本的陣列成為「垃圾」，等待 GC 回收
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>GC 的兩個步驟：</b><br>
① <b>Mark（標記）</b>：找出哪些物件已無任何參照指向它<br>
② <b>Sweep（清除）</b>：釋放被標記物件的記憶體空間
</div>

<!--
【核心說明】
我們在基礎篇學過，陣列是參照型態，變數裡存的其實是 Heap 上某塊資料的「地址」。但如果一直 new 陣列、new 物件，Heap 不會爆掉嗎？這時候就要靠 GC 出場。

【生活化比喻】
Java 幫我們雇了一個清潔員——GC。當一棟房子（物件）沒有任何人手上拿著房契（參照）指向它，它就成了一座無人認領的空屋。GC 會定期巡邏，把這些空屋標記起來（Mark），再統一拆除騰出空地（Sweep）。

💼 業界實務：
這也是為什麼 Java 比 C/C++ 好上手——我們不用自己手動釋放記憶體，但代價是 GC 執行時偶爾會讓程式短暫停頓，這在效能調校時是個值得注意的議題。
-->

---

# GC 的觸發時機與 null 的作用

| 概念 | 說明 |
| --- | --- |
| 自動觸發 | JVM 判斷 Heap 記憶體不足時自動啟動 |
| 無法手動控制 | 呼叫 `System.gc()` 只是「建議」，不保證立即執行 |
| `null` 的作用 | 將參照設為 `null`，讓物件失去引用，成為 GC 候選 |
| Dangling Pointer | GC 完全避免了 C/C++ 的「懸空指標」問題 |

```java
int[] bigArray = new int[1000000];
// ... 使用完畢

bigArray = null; // 主動斷開引用，幫助 GC 儘早回收
```

<!--
【逐步解說】
表格裡最重要的觀念是：我們無法「命令」GC 立刻動手，`System.gc()` 頂多是跟 JVM 說「方便的時候請打掃一下」，它聽不聽看心情。

⚠️ 易錯點提醒：
但我們可以主動幫忙——把不再需要的大陣列設為 `null`，相當於「主動退租」，告訴系統這塊空間可以優先回收。範例裡的 `bigArray = null` 就是這個用法，對處理大資料的程式特別有幫助。

【生活化比喻】
這也是 Java 相對安全的地方：C/C++ 裡如果手動釋放記憶體後忘記清空指標，會留下「懸空指標」，之後誤用就容易讓程式爆炸。Java 把這個風險交給 GC，等於幫我們把這顆地雷拆掉了。
-->

---

# 不規則陣列（Jagged Array）

每一列可以有不同長度：

```java
int[][] jagged = new int[3][];
jagged[0] = new int[2]; // 第 0 列有 2 個元素
jagged[1] = new int[4]; // 第 1 列有 4 個元素
jagged[2] = new int[1]; // 第 2 列有 1 個元素

jagged[0][0] = 10;
jagged[1][3] = 99;
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>宣告不規則陣列：</b>第一個維度（列數）必須先指定，第二個維度（每列大小）可之後各自指定。
</div>

<!--
【核心說明】
基礎篇我們學過二維陣列其實是「陣列的陣列」——一個大箱子裡裝著好幾個獨立的小箱子。既然每個小箱子都是獨立的物件，那它們的長度當然也可以不一樣，這就是「不規則陣列」。

【生活化比喻】
想像一個置物櫃，每一排格子數量可以不同：第一排放 2 格、第二排放 4 格、第三排只放 1 格。`new int[3][]` 就是先說「我要 3 排」，但每排幾格留白，之後再各自決定。

⚠️ 易錯點提醒：
看到那個空的中括號 `[]` 了嗎？它代表「列數先確定，但每列大小晚點補上」。如果跳過 `jagged[0] = new int[2];` 直接寫 `jagged[0][0] = 10;`，會因為那一列還是 `null`，丟出 `NullPointerException`。

💼 業界實務：
不規則陣列常用在「每個人/每個項目資料量不同」的情境，例如每位學生選修的課程數不同、每個訂單的商品數不同，用不規則陣列就不用浪費空間去湊齊最大長度。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
不規則陣列跟 GC 的觀念都講完了，先別急著往下滑，來動手寫一題，把「每組人數不同」這種真實情境用不規則陣列存起來，順便回頭想想陣列用完之後，記憶體是怎麼被回收的。
-->

---
layout: default
---

# 練習 1：Part 1 練習：學生分組成績表
### 任務說明

某班分成 3 組，每組人數不同：第 1 組 2 人、第 2 組 4 人、第 3 組 3 人。請用**不規則陣列**儲存各組成績，並計算每組的**平均分數**。

```java
// 提示資料（任意填入分數）
int[][] groupScores = new int[3][];
```

**預期輸出（範例）：**
```
第 1 組平均：87.50
第 2 組平均：76.25
第 3 組平均：90.00
```

完成後想一想：若改用 `bigData = null` 釋放掉這個陣列，會發生什麼事？

<!--
【任務鋪陳】
剛剛學了不規則陣列的宣告方式，現在來實際用一次。每組人數不一樣，正好是不規則陣列最適合的場景。

【問題引導】
想一下：要計算「每組」平均，外層迴圈應該走訪「組」還是「人」？算完一組的總分後，要除以誰的長度？另外，題目最後那個關於 `null` 的小問題，正是呼應我們剛學的 GC 觀念——陣列用完之後，斷開參照會發生什麼事？
-->

---

# 練習 1：Part 1 練習 — 解題提示
### 提示說明

1. 外層用 `for` 迴圈走訪 `groupScores.length`（共 3 組）。
2. 內層用 `for` 迴圈走訪 `groupScores[i].length`（該組人數），加總分數。
3. 平均 = 總分 ÷ `groupScores[i].length`，記得轉成 `double` 才有小數。
4. 關於 `null`：設為 `null` 後，原本的陣列資料**不會立刻消失**，只是失去參照、成為 GC 的回收候選；之後若 JVM 觸發 GC，這塊記憶體才會被釋放。

<!--
【逐步解說】
重點在「每組長度不同」，所以內層迴圈的上限要用 `groupScores[i].length`，不能寫死成同一個數字，否則會超出某些組的範圍。

⚠️ 易錯點提醒：
整數除以整數會被「整數除法」吃掉小數，記得在計算平均時把分子或分母轉成 `double`。

最後那題沒有「標準答案」要寫程式，重點是說出 GC 的兩階段（Mark → Sweep）跟 `null` 之間的關係，確認大家對記憶體概念有掌握。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 命令列程式設計

<!--
【章節標題】
第二部分，我們把視角轉向「跟外部世界互動」。學會讀取命令列參數後，就能寫出能接收使用者輸入指令的小工具，最後再用一個計算器專題把整章內容串起來。
-->

---
layout: default
---

# String[] args 是什麼？

`main` 方法的參數 `args` 就是一個字串陣列，存放執行程式時傳入的命令列參數：

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("參數數量：" + args.length);
        for (String arg : args) {
            System.out.println(arg);
        }
    }
}
```

執行指令：`java Hello Alice Bob 123`

輸出：
```
參數數量：3
Alice
Bob
123
```

<!--
【核心說明】
我們一直在 `main` 方法的括號裡看到 `String[] args`，但它平常都是空的，所以容易被忽略。其實它是 Java 程式跟「外部世界」溝通的窗口之一。

【生活化比喻】
想像我們執行程式時，後面可以附上幾張小紙條（參數），這些紙條會被自動收進 `args` 這個陣列裡，依序傳給 `main`。範例裡執行 `java Hello Alice Bob 123`，這三個字就分別變成 `args[0]`、`args[1]`、`args[2]`。

⚠️ 易錯點提醒：
如果執行程式時什麼都不加（只打 `java Hello`），`args` 不會是 `null`，而是長度為 0 的陣列——`args.length` 會是 `0`，這點常被誤會。

💼 業界實務：
許多命令列工具（像 Git、各種 CLI 指令）背後都是靠類似 `args` 的機制接收使用者指令，理解這個概念也是理解「終端機程式」如何運作的第一步。
-->

---

# 從 args 讀取整數

命令列傳進來的全是字串，需要轉型：

```java
public static void main(String[] args) {
    if (args.length < 2) {
        System.out.println("請輸入兩個整數");
        return;
    }
    int a = Integer.parseInt(args[0]);
    int b = Integer.parseInt(args[1]);
    System.out.println(a + " + " + b + " = " + (a + b));
}
```

執行：`java Calculator 10 25`
輸出：`10 + 25 = 35`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b>若 args[0] 不是合法整數，<code>Integer.parseInt</code> 會拋出 <code>NumberFormatException</code>。
</div>

<!--
【逐步解說】
這頁的關鍵字是「全部都是字串」。就算我們在命令列打 `10`，`args[0]` 拿到的還是文字 `"10"`，不是數字 10，所以加法不能直接做。

帶讀關鍵行：`Integer.parseInt(args[0])` 就是「翻譯機」，把文字 `"10"` 翻譯成整數 `10`，翻譯完才能做數學運算。範例裡先檢查 `args.length < 2`，是因為如果使用者忘了輸入兩個數字，直接存取 `args[1]` 會先因為陣列長度不足而出錯。

⚠️ 易錯點提醒：
如果使用者打了 `java Calculator abc 25`，`Integer.parseInt("abc")` 會拋出 `NumberFormatException`，這也是為什麼正式的程式通常還要搭配例外處理。
-->

---

# 專題：簡單計算器（命令列版）

結合 String[] args 和陣列概念：

```java
public static void main(String[] args) {
    if (args.length < 3) {
        System.out.println("用法：java Calc 數字 運算子 數字");
        return;
  }
    double a = Double.parseDouble(args[0]);
    String op = args[1];
    double b = Double.parseDouble(args[2]);

    double result = switch (op) {
        case "+" -> a + b;
        case "-" -> a - b;
        case "*" -> a * b;
        case "/" -> b != 0 ? a / b : Double.NaN;
        default  -> Double.NaN;
    };
    System.out.println(a + " " + op + " " + b + " = " + result);
}
```

<!--
【逐步解說】
這個小專案是這一節的集大成：先用 `args.length < 3` 確認使用者有沒有給齊「兩個數字 + 一個運算子」，再用 `Double.parseDouble` 把文字翻譯成數字，最後用 `switch` 依運算子決定要做哪種運算。

帶讀關鍵行：`switch (op)` 這段用的是 Java 較新的 switch expression 寫法，每個 `case` 直接回傳一個值給 `result`，比傳統 switch 簡潔不少。

⚠️ 易錯點提醒：
除法那行 `b != 0 ? a / b : Double.NaN` 是在避免除以 0——浮點數除以 0 不會丟例外，而是會得到 `Infinity` 或 `NaN`，這裡用三元運算子先擋掉，讓結果更明確。

預期結果：執行 `java Calc 10 + 5`，會輸出 `10.0 + 5.0 = 15.0`。學完這頁，我們就具備寫一個終端機小工具的基本能力了！
-->

---
layout: default
---

# 練習 2：Part 2 練習：單位轉換工具
### 任務說明

撰寫一個命令列程式，接收兩個參數：一個數字與一個單位代號（`km` 或 `mi`），將公里換算成英里，或將英里換算成公里。

```
換算公式：1 km = 0.6214 mi
```

**範例執行：**
```
java Convert 10 km
→ 10.0 km = 6.214 mi

java Convert 10 mi
→ 10.0 mi = 16.094 km
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 記得先檢查 <code>args.length</code>，並用 <code>Double.parseDouble</code> 轉換數字。
</div>

<!--
【任務鋪陳】
我們剛剛做完一個計算器，現在換個題目：把「運算子」換成「單位代號」，邏輯其實很相似——讀取參數、判斷分支、輸出結果。

【問題引導】
想一下：這題需要幾個 `args`？要先轉型哪一個參數？`switch` 或 `if-else` 該用哪個條件去判斷 `"km"` 還是 `"mi"`？
-->

---

# 練習 2：Part 2 練習 — 解題提示
### 提示說明

1. 檢查 `args.length < 2`，不足則印出使用說明並 `return`。
2. `double value = Double.parseDouble(args[0]);` 取得數字。
3. `String unit = args[1];` 取得單位代號。
4. 用 `if-else` 或 `switch` 依 `unit` 是 `"km"` 還是 `"mi"`，分別乘上或除以 `0.6214`。
5. 用 `System.out.println` 組合輸出字串，注意單位文字要對應正確。

<!--
【逐步解說】
這題跟計算器專題的結構幾乎一樣，差別只在「分支條件」從運算子換成了單位代號。如果卡住，可以回頭看計算器專題的 `switch` 寫法，把 `case "+"` 換成 `case "km"` 的思路是相通的。

⚠️ 易錯點提醒：
換算英里到公里時是「除以」0.6214，換算公里到英里是「乘以」0.6214，方向別搞反了。
-->

---
layout: default
---

# 練習 3 (綜合)：成績統計小工具
### 任務說明

撰寫一個程式，模擬「每班人數不同」的成績登記系統：

1. 用**不規則陣列** `int[][] classScores` 儲存 3 個班的成績（人數自訂，例如 3、5、2 人）。
2. 程式啟動時透過 `String[] args` 接收一個整數，代表要印出第幾班（從 1 開始）的成績與平均。
3. 計算並輸出該班的**總分**與**平均分數**。

**範例執行：**
```
java ClassReport 2
→ 第 2 班成績：[xx, xx, xx, xx, xx]
→ 總分：xxx，平均：xx.xx
```

<!--
【任務鋪陳】
這是本份自學內容的綜合題，把今天學到的兩大主題——不規則陣列與命令列參數——合在一起。先想想看：資料怎麼存？使用者要查第幾班，又是怎麼告訴程式的？

【問題引導】
資料部分回顧一下：每班人數不同，該用什麼結構存？輸入部分回顧一下：使用者打的數字會以什麼型態出現在 `args` 裡，要怎麼轉換？兩個答案合起來，就是這題的骨架。
-->

---

# 練習 3 (綜合)：解題提示
### 提示說明

1. 先用不規則陣列建立資料：
   ```java
   int[][] classScores = new int[3][];
   classScores[0] = new int[]{80, 90, 75};
   classScores[1] = new int[]{60, 70, 85, 95, 88};
   classScores[2] = new int[]{100, 92};
   ```
2. 從 `args[0]` 讀取班級編號：`int classNo = Integer.parseInt(args[0]);`，記得題目從 1 開始，但陣列索引從 0 開始，所以要用 `classNo - 1`。
3. 用 `Arrays.toString(classScores[classNo - 1])` 印出該班成績。
4. 用 `for` 迴圈累加總分，再除以 `classScores[classNo - 1].length` 得到平均（記得轉 `double`）。
5. 思考一下：如果 `classScores` 用完後設成 `null`，會發生什麼事？這正好呼應 Part 1 的 GC 概念。

<!--
【逐步解說】
這題把不規則陣列當「資料庫」、`args` 當「查詢條件」，這正是命令列小工具常見的設計模式：資料 + 輸入 + 運算 + 輸出。

⚠️ 易錯點提醒：
題目說「第幾班從 1 開始」，但陣列索引從 0 開始，這個「位移 1」的轉換是最容易忘記的地方，務必檢查 `classNo - 1` 有沒有寫對。

完成這題之後，回頭看看 Part 1 跟 Part 2 的內容，會發現它們其實是同一套「陣列思維」在不同情境下的應用——這就是我們今天自學內容的核心收穫。
-->

---
layout: end
---
