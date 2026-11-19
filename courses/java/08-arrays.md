---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 陣列
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
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">「用一個名字管理一群資料」</p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
嗨，大家好！我們已經學會了讓程式做判斷、跑迴圈，現在要來解決一個新問題：如果有「一大堆」資料要處理，該怎麼辦？這就是今天的主題——陣列（Array），它是 Java 裡管理一群資料的基本工具，也是後面所有資料結構的起點。

【為什麼要學這個】
想像一下，如果要記錄全班 30 個人的成績，難道要宣告 score1、score2...一路寫到 score30 嗎？這樣不只累，後面要算總分、找最高分也會很麻煩。陣列讓我們只用一個名字，就能把一整排資料整齊地收在一起。

【學習目標】
學完這章，我們會知道陣列怎麼宣告、為什麼索引要從 0 開始算、陣列和一般變數在記憶體裡有什麼不一樣，最後還會用陣列做出搜尋功能、處理表格型的二維資料。
-->

---
layout: default
---

# Outline

- **認識陣列（Array）**
- **陣列的宣告與應用**
- **Java 參照資料型態（Reference Types）**
- **多維陣列的原理**
- **二維陣列的程式應用**
- **專題：線性搜尋**
- **練習題**

<!--
【核心說明】
今天的內容分成幾個階段：先搞懂陣列是什麼、怎麼宣告，接著認識陣列在記憶體裡的特殊身分，最後挑戰二維陣列跟一個小型搜尋專題。

【生活化比喻】
我們會從最基礎的「排排站」（一維陣列）開始，聊到背後的「房契與地址」（參照型態），最後挑戰「表格化」的二維陣列。這不只是語法，更是工程師的「空間觀念」訓練。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 認識陣列（Array）

<!--
【開場白】
先從一個最直覺的問題開始：如果要處理「一群」資料，例如全班的成績，目前學過的方式夠用嗎？

【為什麼要學這個】
這部分會帶我們看到「沒有陣列」的麻煩，再對照「有陣列」之後變得多簡潔，建立起使用陣列的直覺。

【學習目標】
看完這部分，我們會知道陣列的本質是什麼，以及它跟一般變數最大的差別在哪裡。
-->

---
layout: default
---

# 什麼是陣列？

陣列（Array）是一種儲存**固定數量**、**相同型別**元素的資料結構。

```java
// 沒有陣列：要管理 5 個成績需要 5 個變數
int score0 = 85;
int score1 = 90;
int score2 = 78;
int score3 = 92;
int score4 = 88;
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>問題：</b>如果有 100 個學生的成績，要宣告 100 個變數嗎？陣列就是解決這個問題的工具。
</div>

<!--
【重點解說】
看上面這段程式碼，5 個成績要宣告 5 個變數，名字還要一個個編號。陣列就是用來解決這種「一群同類資料」的收納問題。

【生活化比喻】
沒有陣列時，資料就像散落一地的樂高積木，每一塊都要自己取名字。有了陣列，就像買了一個「樂高分類盒」——格子數量固定，而且每一格只能放同一種積木（同一種型別）。

⚠️ 易錯點提醒：
陣列一旦建立好，「大小」就固定不能改了。就像訂了 5 人份的披薩，第 6 個人來時沒辦法把原本那盒變大，只能重新訂一盒 6 人份的。
-->

---

# 陣列 vs 多個變數

```java
// 有陣列：5 個成績只需要一個陣列
int[] scores = {85, 90, 78, 92, 88};

// 透過索引（Index）存取，從 0 開始
System.out.println(scores[0]); // 85
System.out.println(scores[4]); // 88
```

<div class="index-table mt-4">

| 索引 (Index) | 0 | 1 | 2 | 3 | 4 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **值 (Value)** | 85 | 90 | 78 | 92 | 88 |

</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重要：</b>陣列索引從 <b>0</b> 開始，最後一個元素的索引是 <code>length - 1</code>。
</div>

<!--
【帶讀導覽】
範例裡 `scores[0]` 拿到的是第一個成績，`scores[4]` 拿到的是最後一個。每一格資料都有自己的編號，這個編號就叫「索引（Index）」。

⚠️ 易錯點提醒：
工程師習慣從 0 開始數！第 1 個格子編號是 0，第 5 個是 4。如果寫成 `scores[5]` 想拿第 5 個格子，反而會超出範圍，等下一頁我們會看到 Java 對這種情況的處理。

預期結果：印出 `scores[0]` 會看到 `85`，`scores[4]` 會看到 `88`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
陣列的索引概念講完了，光聽不夠，接下來這一連串練習會從最基本的存取，一路練到排序、複製、二維陣列跟搜尋，每一題都是這一章的某個重點，動手寫過一遍才會真的內化。
-->

---
layout: default
---

# 練習 1：第一個與最後一個
### 任務說明

宣告一個陣列 `int[] prices = {120, 350, 80, 999, 60};`，請：

1. 印出第一個元素。
2. 印出最後一個元素（不要把數字 `4` 寫死，用 `length` 算出來）。
3. 印出第一個與最後一個元素的總和。

**預期輸出：**
```
第一個：120
最後一個：60
總和：180
```

<!--
【任務鋪陳】
剛剛認識了陣列的索引概念——`scores[0]` 是第一個，`scores[4]` 是最後一個。這題換一組資料，練習怎麼「不寫死數字」就能取到最後一個元素。

【問題引導】
第一個元素的索引永遠是 `0`，這個好辦。但「最後一個」的索引會隨陣列大小改變，這時候就要靠陣列本身的 `length` 屬性——想想看，`length` 和「最後一個索引」之間，差了多少？
-->

---

# 練習 1：第一個與最後一個
### 解題提示

1. 第一個元素：`prices[0]`。
2. 最後一個元素的索引是 `prices.length - 1`，所以是 `prices[prices.length - 1]`。
3. 總和：`prices[0] + prices[prices.length - 1]`。
4. 依序印出三行結果。

<!--
【逐步解說】
這題的核心就是 `length - 1` 這個公式。`prices.length` 是 5（陣列有 5 個元素），但索引是從 0 開始算，所以最後一個元素的索引是 `5 - 1 = 4`，也就是 `prices[4]`。用 `prices.length - 1` 取代寫死的 `4`，之後陣列大小改變也不用修改程式碼。

⚠️ 易錯點提醒：
千萬別寫成 `prices[prices.length]`——這會超出範圍（索引 5 不存在），直接拋出 `ArrayIndexOutOfBoundsException`，下一部分會詳細介紹這個例外。

預期結果：依序印出「第一個：120」、「最後一個：60」、「總和：180」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 陣列的宣告與應用

<!--
【開場白】
認識了陣列的概念，接下來要學的是「怎麼真正寫出來」——宣告陣列、設定預設值、走訪每個元素，這些是接下來所有陣列操作的基礎。

【為什麼要學這個】
光懂概念還不夠，我們得知道 Java 提供了哪些寫法、用 `new` 建立陣列時資料會長什麼樣，以及越界存取會發生什麼事——這些都是寫程式時天天會碰到的細節。

【學習目標】
這部分結束後，我們會寫出三種不同風格的陣列宣告，知道陣列的預設值規則，能用迴圈走訪整個陣列，也會用 `Arrays` 工具類別處理常見操作。
-->

---
layout: default
---

# 陣列的宣告語法

| 語法 | 說明 |
| --- | --- |
| `型別[] 名稱;` | 宣告陣列參照（推薦寫法） |
| `型別 名稱[];` | 宣告陣列參照（C 風格，不推薦） |
| `new 型別[大小]` | 配置記憶體、建立陣列 |
| `{值1, 值2, ...}` | 直接初始化（陣列字面值） |

```java
// 方式一：先宣告後建立
int[] scores;
scores = new int[5];

// 方式二：宣告同時建立
int[] scores = new int[5];

// 方式三：宣告並初始化
int[] scores = {85, 90, 78, 92, 88};
```

<!--
【重點解說】
宣告陣列有三種寫法，可以想成蓋房子的三種階段：方式一是先畫設計圖（宣告）、之後再動工（`new`）；方式二是邊畫邊蓋，宣告跟建立寫在同一行；方式三是直接交屋——連家具（初始值）都擺好了。

💼 業界實務：
我們最常用的是方式三，因為最直接、最少打字。看到大括號 `{}`，就知道這是在用「陣列字面值」直接初始化。表格裡 `型別 名稱[];` 的 C 風格寫法雖然合法，但 Java 慣例不建議使用，盡量寫成 `型別[] 名稱;`。
-->

---

# 陣列預設值與 length 屬性

用 `new` 建立的陣列，每個元素都有預設值：

| 型別 | 預設值 |
| --- | --- |
| `int`, `short`, `byte`, `long` | `0` |
| `double`, `float` | `0.0` |
| `boolean` | `false` |
| `char` | `'\u0000'`（空字元 NUL，非空白字元） |
| 物件（reference type） | `null` |

```java
int[] arr = new int[3];
System.out.println(arr[0]); // 0
System.out.println(arr.length); // 3
```

<!--
【重點解說】
用 `new` 建立陣列時，Java 不會讓我們拿到一堆「垃圾值」，而是自動把每個格子清成固定的預設值。

【生活化比喻】
可以想成蓋好的新房子，水電都先歸零：數字型別的房間預設是 0，布林是 `false`，物件型別是 `null`（房間是空的，還沒住人）。`length` 則是這棟房子的總房間數，之後寫迴圈時會一直用到它。

預期結果：`arr[0]` 印出 `0`，`arr.length` 印出 `3`——表示這個陣列有 3 個格子，每格都是預設值 0。
-->

---

# ArrayIndexOutOfBoundsException

存取超出範圍的索引會拋出此例外：

```java
int[] arr = {10, 20, 30};

System.out.println(arr[0]); // 10，正常
System.out.println(arr[2]); // 30，正常
System.out.println(arr[3]); // 錯誤！
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Exception 訊息：</b><code>ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3</code><br>
有效索引範圍：<b>0 ≤ index ≤ length - 1</b>，即 <code>arr[0]</code> 到 <code>arr[2]</code>
</div>

<!--
【帶讀導覽】
範例裡 `arr` 只有 3 個格子，索引範圍是 0 到 2。`arr[0]` 跟 `arr[2]` 都正常，但 `arr[3]` 這格根本不存在。

【生活化比喻】
這就像一棟只有 3 層的房子，卻想走進「第 4 層」——那裡什麼都沒有。Java 編譯時不會抱怨，但程式執行到那一行就會直接拋出例外、整個中斷。

⚠️ 易錯點提醒：
務必記住有效範圍是 `0 ≤ index ≤ length - 1`。寫迴圈時條件要用 `i < length`，不能寫成 `i <= length`，否則就會多走一格踩到「虛空」。
-->

---
layout: default
---

# 🎬 AI 協作時刻：陣列預設值全記錄

陣列的預設值跟索引邊界，是新手最容易被面試官連問好幾題的地方，讓 AI 幫你整理完整表格：

**要用的 Prompt：**

> 請整理一張表格，列出 Java 陣列用 new 建立後，
> int、double、boolean、char、String（物件型別）的預設值分別是什麼，
> 並額外說明陣列合法索引範圍是多少、超出範圍會拋出什麼例外。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>易忽略的細節：</b> <code>char</code> 的預設值是 <code>\u0000</code>（空字元），不是空白字元 <code>' '</code>，直接印出來看起來像沒東西，這是很多人會答錯的細節。
</div>

<!--
【操作提示】
拿到 AI 整理的表格後，現場用 System.out.println 實際印出 char 陣列的預設值，讓學生親眼看到「看起來像空白但其實不是」的差異。

【收斂一句話】
陣列預設值不是隨機值，是 Java 固定給的規則值；索引範圍記住 0 到 length-1，這兩點是基礎題必考款。
-->

---

# 走訪陣列：for 迴圈

```java
int[] scores = {85, 90, 78, 92, 88};
int sum = 0;

// 傳統 for 迴圈
for (int i = 0; i < scores.length; i++) {
    sum += scores[i];
}
System.out.println("總分：" + sum); // 433

// 增強型 for 迴圈（for-each）
for (int s : scores) {
    System.out.println(s);
}
```

<!--
【帶讀導覽】
要把陣列裡的每一格資料都看過一次，最直接的方式就是用迴圈走訪。傳統 `for` 迴圈的條件記得寫成 `i < scores.length`，呼應上一頁「有效範圍」的觀念。

【生活化比喻】
傳統 `for` 就像自助餐夾菜，得自己拿著盤子（索引 `i`）一格一格去夾。增強型 `for`（for-each）則像是服務生直接把每盤菜端到面前，我們只要負責「讀取」就好，不用管索引。如果不需要修改資料、也不需要索引，用 for-each 寫起來更簡潔。

預期結果：第一段迴圈印出「總分：433」；第二段迴圈會依序印出 85、90、78、92、88。
-->

---

# Arrays 工具類別

| 方法 | 說明 |
| --- | --- |
| `Arrays.sort(arr)` | 將陣列升序排序（原地排序） |
| `Arrays.toString(arr)` | 回傳陣列的字串表示 `[a, b, c]` |
| `Arrays.fill(arr, val)` | 將所有元素填入指定值 |
| `Arrays.copyOf(arr, len)` | 複製陣列，指定新長度 |
| `Arrays.equals(a1, a2)` | 比較兩陣列內容是否相等 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>需要匯入：</b><code>import java.util.Arrays;</code>
</div>

<!--
【重點解說】
很多陣列上的常見操作，Java 已經幫我們寫好放進 `Arrays` 這個工具類別裡，不用自己重新造輪子。

【生活化比喻】
可以把 `Arrays` 想成一個「萬用管家」：要排序找它（`sort`）、要印出內容找它（`toString`）、要快速填值找它（`fill`）、要複製或比較也找它。

💼 業界實務：
這幾個方法裡最常用的是 `sort` 和 `toString`，下一頁我們直接用範例看它們的效果。記得使用前要 `import java.util.Arrays;`。
-->

---

# Arrays 工具類別 — 範例

```java
import java.util.Arrays;

int[] arr = {5, 2, 8, 1, 9};

System.out.println(Arrays.toString(arr));
// [5, 2, 8, 1, 9]

Arrays.sort(arr);
System.out.println(Arrays.toString(arr));
// [1, 2, 5, 8, 9]

Arrays.fill(arr, 0);
System.out.println(Arrays.toString(arr));
// [0, 0, 0, 0, 0]
```

<!--
【帶讀導覽】
先提醒一個常見現象：如果直接 `println(arr)`，畫面上會出現一串看不懂的位址字串，而不是陣列內容。要看到真正的內容，要用 `Arrays.toString(arr)`。

帶讀關鍵行：`Arrays.sort(arr)` 會直接修改原本的陣列（原地排序），執行後 `arr` 本身就變成排序好的結果。`Arrays.fill(arr, 0)` 則是把所有格子一次性塞入同一個值，常用來快速重置陣列。

⚠️ 易錯點提醒：
`sort` 之後原始順序就消失了，如果之後還需要原始順序，記得先用 `Arrays.copyOf` 複製一份。

預期結果：依序印出 `[5, 2, 8, 1, 9]`、`[1, 2, 5, 8, 9]`、`[0, 0, 0, 0, 0]`。
-->

---
layout: default
---

# 練習 2：成績排行榜
### 任務說明

有 5 位同學的成績：`{72, 95, 60, 88, 77}`。請完成以下任務：

1. 用「宣告並初始化」的方式建立陣列。
2. 用 `Arrays.toString` 印出原始陣列。
3. 用 `Arrays.sort` 排序後，再印出一次。
4. 用傳統 `for` 迴圈走訪排序後的陣列，印出每個索引與對應分數。

**預期輸出：**
```
原始：[72, 95, 60, 88, 77]
排序後：[60, 72, 77, 88, 95]
索引 0：60
索引 1：72
索引 2：77
索引 3：88
索引 4：95
```

<!--
【任務鋪陳】
這部分學了陣列的宣告語法、`length` 屬性、迴圈走訪，還有 `Arrays` 工具類別。這題把這些通通用上一遍，做一個小小的「成績排行榜」。

【問題引導】
先想想：要印出陣列內容，能不能直接 `println(arr)`？上一頁提過答案是不行，要用 `Arrays.toString`。排序之後，陣列本身的順序會被永久改變，所以走訪時看到的就是排序後的結果。
-->

---

# 練習 2：成績排行榜
### 解題提示

1. 宣告：`int[] scores = {72, 95, 60, 88, 77};`
2. 印出原始陣列：`System.out.println("原始：" + Arrays.toString(scores));`
3. 排序：`Arrays.sort(scores);`，再印出一次（會直接修改原陣列）。
4. 用 `for (int i = 0; i < scores.length; i++)` 走訪，印出 `"索引 " + i + "：" + scores[i]`。

<!--
【逐步解說】
這題串起了這部分的三個重點：宣告（方式三的陣列字面值）、`Arrays.toString`（印出內容）、`Arrays.sort`（原地排序）。排序後 `scores` 陣列本身已經變成 `[60, 72, 77, 88, 95]`，所以最後的迴圈走訪到的就是排序後的結果，不需要額外的陣列。

⚠️ 易錯點提醒：
別忘了在檔案開頭加上 `import java.util.Arrays;`，否則 `Arrays.toString` 和 `Arrays.sort` 會編譯失敗。

預期結果：依序印出「原始：[72, 95, 60, 88, 77]」、「排序後：[60, 72, 77, 88, 95]」，以及 5 行「索引 X：Y」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Java 參照資料型態

<!--
【開場白】
接下來這部分，是這一章最重要的觀念：為什麼陣列被歸類成「參照型態」？這跟它在記憶體裡的存放方式有關。

【為什麼要學這個】
這個觀念解釋了一個常見的「陣列賦值陷阱」——為什麼改了 b 陣列的內容，a 陣列也跟著變了。如果不懂這個原理，之後寫程式很容易踩到莫名其妙的 bug。

【學習目標】
這部分結束後，我們會知道原始型態和參照型態在 Stack、Heap 上的差別，也能解釋陣列賦值時為什麼會「兩個變數共用同一塊資料」。
-->

---
layout: default
---

# 原始型態 vs 參照型態

| 面向 | 原始型態（Primitive） | 參照型態（Reference） |
| --- | --- | --- |
| 範例 | `int`, `double`, `boolean`, `char` | `String`, `int[]`, 任何物件 |
| 儲存內容 | 直接儲存**值** | 儲存**記憶體位址** |
| 記憶體區域 | **Stack（堆疊）** | **Stack 存位址，Heap 存資料** |
| 預設值 | `0`, `false` 等 | `null` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>陣列是參照型態：</b>宣告 <code>int[] arr</code> 時，<code>arr</code> 本身存的是陣列在 Heap 上的位址。
</div>

<!--
【重點解說】
這張表格的核心是「儲存內容」這一列：原始型態直接存「值」本身，參照型態存的是「位址」。

【生活化比喻】
原始型態（`int`、`double`）就像現金，直接放在錢包（Stack）裡，要用就掏出來。參照型態（陣列、物件）則像是一張房契——錢包裡放的是房契（地址），真正的房子蓋在郊區的大倉庫（Heap）裡。

陣列就屬於後者：宣告 `int[] arr` 時，`arr` 變數本身存的不是資料，而是那筆資料在 Heap 上的地址。下一頁我們用一張圖把這個關係畫出來。
-->

---

# Stack vs Heap 記憶體圖解

```java
int age = 25;            // primitive → Stack
int[] scores = {85, 90}; // reference → Stack 存位址，Heap 存資料
```

```
┌──────────────────────────────────────────────┐
│                   Stack                      │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │  age = 25    │  │ scores = [0x1A2B]    │  │
│  └──────────────┘  └──────────┬───────────┘  │
└─────────────────────────────┬─┼──────────────┘
                               │ │ 指向位址
┌──────────────────────────────┼─▼──────────────┐
│                   Heap       │                │
│              ┌───────────────────────────┐    │
│              │ [0x1A2B] → {85, 90}       │    │
│              └───────────────────────────┘    │
└───────────────────────────────────────────────┘
```

<!--
【帶讀導覽】
這張圖把上一頁的「現金 vs 房契」具象化了。`age = 25` 是現金，整個值直接放在 Stack 裡。`scores` 是房契，Stack 裡放的是地址 `0x1A2B`，而真正的資料 `{85, 90}` 住在 Heap 裡。

帶讀關鍵行：圖中那條從 `scores` 指向 Heap 的箭頭，就是「參照」這個詞的具體樣子——一條指向資料所在位置的連線。

⚠️ 易錯點提醒：
如果之後把 `scores` 設為 `null`，只是把 Stack 裡那張「房契」丟掉，Heap 上的資料不會馬上消失，只是暫時變成沒人能找到的狀態。
-->

---

# 陣列賦值的陷阱

```java
int[] a = {1, 2, 3};
int[] b = a;       // b 指向同一個陣列！

b[0] = 99;
System.out.println(a[0]); // 99，a 也被改了！
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>原因：</b><code>b = a</code> 只是複製了「位址」，<code>a</code> 和 <code>b</code> 指向 Heap 上同一塊資料。如需獨立複製，請用 <code>Arrays.copyOf(a, a.length)</code>。
</div>

<!--
【帶讀導覽】
這就是參照型態最容易誤會的地方。`int[] b = a;` 看起來像是「複製了一份新陣列」，但其實只是複製了「地址」，`a` 和 `b` 兩個變數最後指向 Heap 上**同一塊**資料。

帶讀關鍵行：執行 `b[0] = 99;` 之後，`a[0]` 也變成 99——因為 `a` 和 `b` 本來就是同一個房子的兩張房契，改動其中一張，房子裡的東西當然也變了。

⚠️ 易錯點提醒：
如果想要兩個「獨立」的陣列，不能直接用 `=` 賦值，要改用 `Arrays.copyOf(a, a.length)`，這樣才會在 Heap 上開一塊全新的空間複製資料。

預期結果：`a[0]` 印出 `99`，跟 `b[0]` 一樣。
-->

---
layout: default
---

# 🎬 AI 協作時刻：這個 bug 為什麼會發生？

陣列賦值只複製位址，是很多人寫程式時「莫名其妙資料被改掉」卻找不到原因的常見地雷，讓 AI 幫你診斷：

**要用的 Prompt：**

> 我寫了 `int[] b = a;` 之後修改 b 的內容，結果發現 a 也跟著變了，
> 這不是我想要的結果。請解釋為什麼會這樣，
> 並告訴我要怎麼修改才能讓 a 跟 b 變成兩個完全獨立的陣列。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>實務常見：</b> 這種「共用同一塊記憶體」的陷阱在真實專案中常常以「資料莫名被改掉」的形式出現，養成遇到類似 bug 就想到「是不是共用了參照」的直覺很重要。
</div>

<!--
【操作提示】
可以先不告訴學生答案，讓他們自己執行剛才「陣列賦值的陷阱」範例的程式碼，觀察到異常結果後才把問題描述給 AI，體驗一次「先困惑、後恍然大悟」的過程。

【收斂一句話】
陣列變數存的是位址不是內容，`=` 賦值只是多一張指向同一塊資料的房契——要獨立複製一定要用 Arrays.copyOf。
-->

---
layout: default
---

# 練習 3：獨立複製陣列
### 任務說明

延續「陣列賦值的陷阱」，這次我們改用 `Arrays.copyOf` 來複製陣列：

```java
int[] a = {1, 2, 3};
int[] b = Arrays.copyOf(a, a.length); // 改用 copyOf

b[0] = 99;
System.out.println("a[0] = " + a[0]);
System.out.println("b[0] = " + b[0]);
```

請判斷這段程式的輸出結果，並用「Stack / Heap」的概念說明為什麼結果跟 `b = a;` 不一樣。

**預期輸出：**
```
a[0] = 1
b[0] = 99
```

<!--
【任務鋪陳】
上一頁看到 `b = a;` 會讓兩個變數共用同一塊 Heap 資料，改 `b` 會連帶影響 `a`。這題換成 `Arrays.copyOf`，看看結果有什麼不同。

【問題引導】
關鍵問題是：`Arrays.copyOf(a, a.length)` 做的事情，跟單純的 `b = a;`（複製位址）一樣嗎？想想看，如果它在 Heap 上開了一塊「全新」的空間，`a` 和 `b` 還會是同一張「房契」嗎？
-->

---

# 練習 3：獨立複製陣列
### 解題提示

1. `Arrays.copyOf(a, a.length)` 會在 Heap 上配置一塊**全新的記憶體空間**，並把 `a` 的內容複製過去。
2. 複製完成後，`b` 指向的是新空間的位址，跟 `a` 指向的位址**不同**。
3. 因此 `b[0] = 99;` 只會改到 `b` 自己那塊新空間，不會影響 `a`。
4. 結論：`a[0]` 仍是 `1`，`b[0]` 變成 `99`。

<!--
【逐步解說】
`b = a;` 和 `Arrays.copyOf(a, a.length)` 最大的差別就在 Heap 上：前者是「複製房契」（兩張房契指向同一棟房子），後者是「蓋一棟一模一樣的新房子，再給一張新房契」。`b` 和 `a` 從此各自獨立，互不影響。

💼 業界實務：
如果想保留一份「原始資料的備份」，或是要讓兩個變數獨立修改而不互相干擾，就該用 `Arrays.copyOf`，而不是直接用 `=` 賦值。

預期結果：`a[0]` 印出 `1`（不受影響），`b[0]` 印出 `99`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 多維陣列的原理

<!--
【開場白】
前面三個部分都在處理「一排」資料的一維陣列。但如果資料本身就是「表格」形式呢？例如成績表是「每個學生 × 每次考試」，這時就需要多維陣列。

【為什麼要學這個】
多維陣列是處理表格、矩陣、棋盤等二維結構的基礎，理解它的原理之後，後面寫迴圈走訪、做矩陣運算都會更直覺。

【學習目標】
這部分結束後，我們會知道 Java 的二維陣列其實是「陣列的陣列」，也能寫出宣告與走訪二維陣列的程式碼。
-->

---
layout: default
---

# 陣列的陣列概念

Java 的 多維陣列其實是「陣列的陣列」（Array of Arrays）：

```
int[][] matrix
  │
  ├── matrix[0] → [1, 2, 3]   ← 一個 int[]
  ├── matrix[1] → [4, 5, 6]   ← 一個 int[]
  └── matrix[2] → [7, 8, 9]   ← 一個 int[]
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>與其他語言不同：</b>Java 的二維陣列每一列是獨立的 <code>int[]</code> 物件，存放在 Heap 的不同位置，這讓「不規則陣列」成為可能。
</div>

<!--
【重點解說】
嚴格來說，Java 沒有真正的「二維陣列」，只有「裝著陣列的陣列」。

【生活化比喻】
可以想成一個大箱子（`matrix`）裡面放了好幾個小長盒（`matrix[0]`、`matrix[1]`...），每個小長盒本身就是一個獨立的 `int[]`，放在 Heap 上各自的位置。

💡 補充：因為每個小長盒是獨立物件，它們的「長度」理論上也可以不一樣——這也是為什麼 Java 的二維陣列彈性比想像中更大。
-->

---

# 二維陣列的宣告與走訪

```java
// 宣告並初始化 3x3 矩陣
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// 走訪：使用巢狀 for 迴圈
for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}
```

<!--
【帶讀導覽】
走訪二維陣列要用「巢狀迴圈」：外層 `i` 負責控制「列」，內層 `j` 負責控制「欄」。

帶讀關鍵行：`matrix[i].length` 是在問「第 `i` 個小盒子裡有幾個格子」，而不是整個矩陣的大小，這跟一維陣列的 `length` 是同一個概念，只是多了一層。

預期結果：依序印出三列數字 `1 2 3`、`4 5 6`、`7 8 9`，每列換行。
-->

---
layout: default
---

# 🎬 AI 協作時刻：二維陣列索引搞混了

`matrix.length` 跟 `matrix[i].length` 是新手最容易搞混的一對，也常常把 `matrix[i][j]` 的 `i`、`j` 用反：

**要用的 Prompt：**

> 我寫的二維陣列巢狀迴圈跑出
> ArrayIndexOutOfBoundsException，矩陣明明是 3x3，
> 請幫我找出問題出在哪一行，並解釋
> matrix.length 跟 matrix[i].length 的差別：
> {貼上你的程式碼}

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見地雷：</b> <code>matrix.length</code> 是「列數」，<code>matrix[i].length</code> 是「第 i 列的欄數」——兩者混用，或把 <code>matrix[i][j]</code> 寫成 <code>matrix[j][i]</code>，都會導致索引錯誤。
</div>

<!--
【操作提示】
現場故意把內層迴圈條件寫成 `j < matrix.length`（而不是 `matrix[i].length`），用一個非正方形矩陣測試，讓學生看到崩潰後再貼給 AI 分析。

【收斂一句話】
走訪二維陣列時，外層用 matrix.length 控制列數，內層一定要用 matrix[i].length 控制當前這一列的欄數。
-->

---
layout: default
---

# 練習 4：每列總分
### 任務說明

給定一個 3×3 的成績矩陣，代表 3 位學生、每人 3 次小考的分數：

```java
int[][] scores = {
    {80, 90, 70},
    {60, 75, 85},
    {95, 88, 92}
};
```

用巢狀 `for` 迴圈計算**每位學生**的小考總分，並依序印出。

**預期輸出：**
```
學生 0 總分：240
學生 1 總分：220
學生 2 總分：275
```

<!--
【任務鋪陳】
剛剛學會二維陣列的宣告和走訪，這題就用巢狀迴圈做一件實際的事：算出每一列（每位學生）的總分。

【問題引導】
回顧一下走訪二維陣列的寫法：外層 `i` 負責「列」，內層 `j` 負責「欄」。這題的重點是——每跑完一個學生（一列）的內層迴圈後，要把累加的總分印出來，並把總分變數歸零，準備算下一位學生。
-->

---

# 練習 4：每列總分
### 解題提示

1. 外層用 `for (int i = 0; i < scores.length; i++)` 走訪每位學生。
2. 在外層迴圈內宣告 `int sum = 0;`（每位學生重新計算）。
3. 內層用 `for (int j = 0; j < scores[i].length; j++)` 累加 `sum += scores[i][j];`。
4. 內層結束後，印出 `"學生 " + i + " 總分：" + sum`。

<!--
【逐步解說】
這題最容易忽略的地方是 `sum` 的「歸零時機」。`sum` 必須宣告在外層迴圈**內部**，這樣每換一位學生（每跑一次外層迴圈），`sum` 就會重新從 0 開始累加，不會把前一位學生的總分也加進來。

⚠️ 易錯點提醒：
內層迴圈的條件要寫成 `j < scores[i].length`，不是 `j < scores.length`——`scores[i].length` 是「第 i 列有幾欄」，`scores.length` 則是「總共有幾列」，兩者意義不同。

預期結果：依序印出「學生 0 總分：240」、「學生 1 總分：220」、「學生 2 總分：275」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 二維陣列的程式應用

<!--
【開場白】
學會宣告與走訪二維陣列後，這部分我們來看看它在真實場景裡怎麼解決問題——最常見的就是矩陣運算。

【為什麼要學這個】
矩陣加法、轉置等運算，背後都是「對應位置」或「行列互換」的規律，掌握這個規律之後，二維陣列的應用就不再只是語法練習。

【學習目標】
這部分結束後，我們會用巢狀迴圈完成矩陣加法，也會學到用增強型 for 迴圈走訪二維陣列的簡潔寫法。
-->

---
layout: default
---

# 矩陣加法

兩個相同大小的矩陣，對應位置相加：

```java
int[][] a = {{1, 2}, {3, 4}};
int[][] b = {{5, 6}, {7, 8}};
int[][] c = new int[2][2];

for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
        c[i][j] = a[i][j] + b[i][j];
    }
}
```

<!--
【帶讀導覽】
矩陣加法的規則非常單純：兩個矩陣「對應位置」的值相加，放進結果矩陣的同一個位置。

帶讀關鍵行：`c[i][j] = a[i][j] + b[i][j];` 就是整段程式的核心——`a[0][0] + b[0][0]` 等於 `1 + 5 = 6`，放進 `c[0][0]`，以此類推。用兩層迴圈走訪每一個位置，就能優雅完成整個矩陣的加法。
-->

---

# 矩陣加法 — 輸出結果

```java
// 印出結果矩陣
for (int i = 0; i < c.length; i++) {
    System.out.println(Arrays.toString(c[i]));
}
// [6, 8]
// [10, 12]
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>技巧：</b>用 <code>Arrays.toString(c[i])</code> 可以快速印出每一列，不用再寫一層迴圈。
</div>

<!--
【帶讀導覽】
算完矩陣加法後，要把結果印出來。這裡的小技巧是：`c[i]` 本身就是一個一維陣列，直接丟給 `Arrays.toString(c[i])`，一行就能印出一整列，不用再多寫一層迴圈。

⚠️ 易錯點提醒：
別忘了 `import java.util.Arrays;`，否則 `Arrays.toString` 會編譯失敗。

預期結果：印出兩行 `[6, 8]` 和 `[10, 12]`，正好是 `a` 和 `b` 對應位置相加的結果。
-->

---

# 二維陣列走訪：增強型 for 迴圈

```java
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};

for (int[] row : matrix) {
    for (int val : row) {
        System.out.print(val + "\t");
    }
    System.out.println();
}
// 1   2   3
// 4   5   6
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>增強型 for：</b>外層 <code>int[] row</code> 取得每一列（一維陣列），內層再走訪每個元素。不需要索引時，這種寫法更簡潔。
</div>

<!--
【帶讀導覽】
這是走訪二維陣列最簡潔的寫法：外層 `for (int[] row : matrix)` 直接拿到「每一列」（也就是一個一維陣列），內層 `for (int val : row)` 再拿到列中的每個數值。

帶讀關鍵行：兩層都是增強型 for，不需要任何索引變數，程式碼讀起來幾乎像一句話：「對 matrix 裡的每一列 row，對 row 裡的每個值 val，印出來」。

預期結果：印出兩行，分別是 `1  2  3` 和 `4  5  6`（以 tab 分隔）。
-->

---
layout: default
---

# 練習 5：矩陣相減
### 任務說明

給定以下兩個 2×2 矩陣：

```java
int[][] a = {{10, 20}, {30, 40}};
int[][] b = {{1, 2}, {3, 4}};
```

撰寫程式計算 `a - b`（對應位置相減），並用**增強型 for 迴圈**印出結果矩陣。

**預期輸出：**
```
9	18
27	36
```

<!--
【任務鋪陳】
剛剛學了矩陣加法，這題我們換成矩陣減法——規則幾乎一樣，只是運算子從 `+` 變成 `-`，順便練習用增強型 for 迴圈印出結果。

【問題引導】
回顧矩陣加法的核心：`c[i][j] = a[i][j] + b[i][j]`。這題只要把 `+` 換成 `-`，就能算出 `c[i][j] = a[i][j] - b[i][j]`。印出時可以參考剛剛學的 `for (int[] row : matrix)` 寫法。
-->

---

# 練習 5：矩陣相減
### 解題提示

1. 宣告 `int[][] c = new int[2][2];` 存放結果。
2. 用巢狀 `for` 迴圈走訪 `i`、`j`，計算 `c[i][j] = a[i][j] - b[i][j]`。
3. 印出時改用增強型 for：`for (int[] row : c) { for (int val : row) {...} }`，搭配 `\t` 分隔同列數值。
4. 每列印完後記得換行（`System.out.println()`）。

<!--
【逐步解說】
計算的邏輯跟矩陣加法完全一樣，只是把 `+` 換成 `-`：`c[i][j] = a[i][j] - b[i][j]`。印出結果時，這題刻意選擇增強型 for，呼應這部分最後學到的「外層拿一列、內層拿每個值」的走訪方式。

⚠️ 易錯點提醒：
矩陣減法不能交換順序！`a - b` 和 `b - a` 結果不同（正負號相反），計算時要注意誰減誰。

預期結果：印出兩行，分別是 `9	18` 和 `27	36`（以 tab 分隔）。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 專題：線性搜尋

<!--
【開場白】
最後一部分，我們用陣列做一個實際功能：在一堆資料裡「找東西」。這個功能幾乎是所有資料處理程式的基本需求。

【為什麼要學這個】
搜尋是非常常見的需求——找學號、找商品、找關鍵字，背後都是同樣的邏輯。學會最基本的線性搜尋，之後遇到更進階的搜尋演算法時，會更容易理解。

【學習目標】
這部分結束後，我們會寫出一個線性搜尋的方法，知道怎麼用回傳值表示「找到」或「找不到」。
-->

---
layout: default
---

# 線性搜尋（Linear Search）

從頭到尾逐一比對，找到目標就回傳索引，找不到回傳 -1：

```java
public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i; // 找到了，回傳索引
        }
    }
    return -1; // 走完整個陣列都沒找到
}
```

<!--
【重點解說】
線性搜尋是最直觀、也最「老實」的搜尋方法：從第一格開始，一個一個比對，直到找到目標或走到陣列尾端。

【生活化比喻】
就像在抽屜裡找鑰匙，沒有捷徑的話，只能一格一格打開來看。最壞的情況——鑰匙在最後一格，或根本不在——就要把所有抽屜都檢查過一輪。

帶讀關鍵行：找到時 `return i;` 直接回傳索引；如果迴圈跑完都沒進到 `if`，最後 `return -1;` 表示「找不到」。
-->

---

# 線性搜尋 — 應用範例

```java
int[] scores = {85, 90, 78, 92, 88};

int idx = linearSearch(scores, 92);
if (idx != -1) {
    System.out.println("找到 92，位於索引：" + idx);
} else {
    System.out.println("找不到");
}
// 找到 92，位於索引：3
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>慣例：</b>搜尋函式回傳 <b>-1</b> 表示「找不到」，這是業界的通用慣例（Java 的 <code>String.indexOf</code> 也是如此）。
</div>

<!--
【帶讀導覽】
這頁示範怎麼使用上一頁寫好的 `linearSearch` 方法。重點在於拿到回傳值之後的判斷：用 `if (idx != -1)` 區分「找到了」和「沒找到」兩種情況，分別給出不同的訊息。

⚠️ 易錯點提醒：
看到 `-1` 就代表「沒找到」，這是業界的通用慣例（像 Java 內建的 `String.indexOf` 也是回傳 `-1`），不要把它跟「找到索引 0」搞混。

預期結果：因為 `92` 在陣列的索引 3，會印出「找到 92，位於索引：3」。
-->

---
layout: default
---

# 🎬 AI 協作時刻：AI 的「優化建議」一定適合嗎？

請 AI 幫忙看線性搜尋／找最大值的程式碼時，AI 常常會建議「先排序再處理」，但這不一定符合題目限制：

**要用的 Prompt：**

> 請 AI 幫我看看這段找最大值（或線性搜尋）的程式碼
> 有沒有可以優化的地方：{貼上你的程式碼}
> 如果 AI 建議先用 Arrays.sort() 排序，
> 請你自己判斷：這樣做會不會改變原始陣列的順序？
> 只找一次的情境，排序真的比較快嗎？

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>提醒：</b> AI 的建議不會自動正確——<code>Arrays.sort()</code> 會直接改變原始陣列順序，而且排序是 O(n log n)，只找一次最大值用線性掃描 O(n) 反而更划算，要自己判斷是否符合題目限制。
</div>

<!--
【操作提示】
現場請 AI 針對練習 6「找出最大值」給優化建議，如果 AI 提到排序，追問學生：這個做法符合題目「不可使用 Arrays.sort()」的限制嗎？順便討論時間複雜度的取捨。

【收斂一句話】
AI 給的優化建議要對照題目限制跟情境判斷，排序不是萬用解法，也可能違反題目要求或改變原始資料。
-->

---
layout: default
---

# 練習 6：找出最大值
### 任務說明

給定整數陣列 `{34, 17, 89, 45, 23, 67}`，撰寫程式找出陣列中的**最大值**，並輸出它的值與索引位置。

**預期輸出：**
```
最大值：89，位於索引：2
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 不可使用 <code>Arrays.sort()</code> 排序後取最後一個，請用迴圈逐一比較。
</div>

<!--
【任務鋪陳】
這一章學了陣列的宣告、走訪、還有 Arrays 工具類別。這題我們不靠工具，純粹用迴圈邏輯來練習——在一堆亂序數字裡找出最大值。

【問題引導】
可以想成一場「擂台賽」：先讓第一個元素 `arr[0]` 當擂主，後面的元素一個個上來挑戰。如果挑戰者比擂主強，就換人當擂主。走完一輪，留在台上的就是最大值——別忘了同時記錄它是「第幾號」上來的。
-->

---

# 練習 6：解題提示
### 提示說明

1. 宣告兩個變數：`int maxVal = arr[0]` 和 `int maxIdx = 0`，先假設第一個元素是最大值。
2. 用 `for` 迴圈從索引 `1` 開始走訪。
3. 若 `arr[i] > maxVal`，更新 `maxVal = arr[i]` 和 `maxIdx = i`。
4. 迴圈結束後，`maxVal` 和 `maxIdx` 就是答案。

<!--
【逐步解說】
這題的關鍵思維是「先假設第一個最強，再嘗試推翻它」。`maxVal` 記錄目前最大的值，`maxIdx` 記錄它的位置；走訪剩下的元素時，一旦發現更大的值，就同時更新這兩個變數。

⚠️ 易錯點提醒：
迴圈要從索引 `1` 開始（因為索引 `0` 已經當作初始擂主），如果從 `0` 開始會多比一次，雖然結果不會錯，但邏輯上不夠精確。
-->

---
layout: default
---

# 練習 7：轉置矩陣
### 任務說明

給定以下 2×3 矩陣：

```java
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};
```

撰寫程式產生其**轉置矩陣**（3×2），並用巢狀迴圈印出結果。

**預期輸出（轉置後）：**
```
1 4
2 5
3 6
```

<!--
【任務鋪陳】
這是本章的綜合練習，把二維陣列的宣告、走訪、跟「行列對應」的觀念整合起來——把一個表格「橫著變直的」，也就是矩陣的轉置。

【問題引導】
回顧一下：原矩陣是 2×3（2 列 3 欄），轉置後會變成 3×2（3 列 2 欄）。規律很簡單——原本住在 `(i, j)` 位置的數字，搬到新矩陣的 `(j, i)` 位置。找出這個對應關係，就掌握了轉置的核心邏輯。
-->

---

# 練習 7：解題提示
### 提示說明

1. 原矩陣大小為 `rows × cols`（2×3），轉置矩陣大小為 `cols × rows`（3×2）。
2. 宣告 `int[][] transposed = new int[3][2];`。
3. 規律：`transposed[j][i] = matrix[i][j]`。
4. 用巢狀迴圈走訪原矩陣，填入轉置矩陣對應位置。

<!--
【逐步解說】
宣告新矩陣時，列數和欄數要互換——原本 2×3，轉置矩陣就是 3×2。接著用巢狀迴圈走訪原矩陣的每一個 `matrix[i][j]`，依照 `transposed[j][i] = matrix[i][j]` 這個對應關係，把值搬到轉置矩陣對應的位置。

⚠️ 易錯點提醒：
最容易搞混的就是 `i` 和 `j` 的順序，建議先在紙上畫出原矩陣和轉置矩陣的座標，確認對應關係後再寫程式。
-->

---

# 總結

- **陣列儲存固定數量、相同型別的元素**，索引從 `0` 開始，最後一格是 `length - 1`，超出範圍會拋 `ArrayIndexOutOfBoundsException`
- **`new` 建立的陣列有固定預設值**（數字型 `0`、`boolean` 為 `false`、物件為 `null`），可以用傳統 `for` 或 `for-each` 走訪
- **`Arrays` 工具類別包辦排序、印出、填值、複製、比較**（`sort`、`toString`、`fill`、`copyOf`、`equals`），使用前記得 `import java.util.Arrays`
- **陣列是參照型態，變數存的是 Heap 上的位址** — `int[] b = a;` 只是複製位址，兩者會共用同一塊資料，要獨立複製須用 `Arrays.copyOf`
- **二維陣列本質是「陣列的陣列」**，走訪要用巢狀迴圈，`matrix[i].length` 是第 i 列的長度、`matrix.length` 是總列數
- **線性搜尋從頭到尾逐一比對**，找到回傳索引、找不到回傳 `-1`，這是搜尋函式的業界通用慣例

<!--
我們把這一章整理成六個重點。

第一，陣列是儲存固定數量、相同型別元素的資料結構，索引從 0 開始算，最後一個元素的索引是 length 減 1，如果存取超出這個範圍，會直接拋出 ArrayIndexOutOfBoundsException。

第二，用 new 建立陣列時，每個元素都會有固定的預設值：數字型別是 0，boolean 是 false，物件型別則是 null；要走訪整個陣列，可以用傳統 for（有索引）或 for-each（單純讀取，更精簡）。

第三，Arrays 這個工具類別幫我們包辦了排序、印出內容、填值、複製、比較這些常見操作，分別是 sort、toString、fill、copyOf、equals，使用前記得先 import java.util.Arrays。

第四，這一章最重要的觀念：陣列是參照型態，變數本身存的是 Heap 上的位址，不是資料本身。所以 int[] b = a; 只是複製了「地址」，a 和 b 會共用同一塊資料，改 b 也會影響 a；如果想要兩個獨立的陣列，要改用 Arrays.copyOf。

第五，Java 的二維陣列其實是「陣列的陣列」，走訪要用巢狀迴圈，外層控制列、內層控制欄；要注意 matrix[i].length 是第 i 列有幾欄，跟 matrix.length（總共幾列）是不同的東西。

第六，線性搜尋是最直觀的搜尋方法，從頭到尾逐一比對，找到就回傳索引，找不到就回傳 -1——這個 -1 慣例在 Java 內建的方法（像 String.indexOf）裡也看得到。

這六點加起來，就是用一個名字管理一群資料所需要的核心工具。下一章我們要進入方法了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【開場白】
今天我們從一排格子（一維陣列）學到了表格化的多層櫃（二維陣列），中間還認識了「房契與地址」這套參照型態的記憶體觀念，最後用線性搜尋實際做了一個小功能。

大家對這些內容還有沒有問題？如果想繼續挑戰，章節後面的進階自學內容還有不規則陣列、命令列參數、垃圾回收細節，以及一個命令列計算器專題，有興趣的話歡迎自行探索！
-->
