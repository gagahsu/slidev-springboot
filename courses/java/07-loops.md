---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 迴圈控制
routeAlias: ch07
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
  <h1 style="color: #1a5c5c; font-size: 3.4rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">迴圈控制</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">「讓程式學會重複：for、while 與迴圈控制技巧」</p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，前面我們已經學會用 `if` 跟 `switch` 讓程式「做選擇」了，但目前我們的程式還是「只能做一次」——印一句話就印一次，算一次就結束。如果今天要印出 1 到 100 的所有數字，難道要寫 100 行 `System.out.println`？

這就是迴圈要解決的問題：讓電腦重複執行同一段程式碼，直到我們設定的條件不再成立。就像我們設定鬧鐘「重複每天早上 7 點響」一樣，迴圈讓我們只需要寫一次「要做什麼」跟「重複的條件」，剩下交給電腦去跑。

學完這一章，我們會學到 `for`、`while`、`do-while` 三種迴圈寫法，還有 `break`、`continue` 這兩個控制迴圈走向的關鍵字，最後再用迴圈解決一個經典的數學題目——雞兔同籠。
-->

---
layout: default
---

# Outline

- **for 迴圈** — 基本語法、流程、enhanced for-each
- **巢狀 for 迴圈** — 九九乘法表
- **while 迴圈**
- **巢狀 while 迴圈**
- **do-while 迴圈** — 至少執行一次
- **無限迴圈** — `while(true)`、`for(;;)`
- **break 敘述** — 跳出迴圈
- **continue 敘述** — 跳過本次迭代
- **Scanner 輸入檢查** — while 驗證使用者輸入
- **迴圈應用** — 累加、計數、最大最小值
- **專題** — 雞兔同籠

<!--
這章主要學三種「重複」的寫法：`for`、`while`、`do-while`。

我們可以這樣理解這三者的性格：`for` 迴圈像是有規劃的健身教練，一開始就講好「深蹲幾次」，做完就結束；`while` 迴圈像是看門狗，只要條件還成立（有人闖入），它就一直盯著、一直執行；`do-while` 則像是夜市試吃，先給你吃一口（一定先執行一次），吃完才問你要不要繼續買（再檢查條件）。

帶著這三個比喻往下走，等下看到語法就會更有感覺。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# for 迴圈

<!--
我們先從最常用的 `for` 迴圈開始。它最大的特色是「一開始就把規則講清楚」：從哪裡開始、跑到什麼時候停、每次怎麼往前進，三件事都寫在同一行裡。

這就像我們設定跑步機：開始位置、目標距離、每步的步幅，一次設定好之後就交給機器自動執行，不用自己一直按按鈕。
-->

---
layout: default
---

# for 迴圈語法

| 元素 | 說明 |
| --- | --- |
| `initialization` | 初始化計數變數，只執行一次 |
| `condition` | 每次執行前檢查；為 `false` 時停止 |
| `update` | 每次執行結束後更新計數變數 |

```java
for (initialization; condition; update) {
    // 重複執行的程式碼
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>執行順序：</b>初始化 → 條件判斷 → 程式碼 → 更新 → 條件判斷 → ... → 條件為 false 停止
</div>

<!--
`for` 迴圈的括號裡有三個區塊，我們可以把它想成跑步比賽的設定：`initialization` 是起跑線，決定從哪裡開始；`condition` 是終點線，只要還沒過線就要繼續跑；`update` 則是每跑完一圈之後的調整，可能是加速、也可能是減速。

⚠️ 易錯點提醒：執行順序是「先檢查條件 → 執行程式碼 → 更新 → 再檢查條件」，update 是在「跑完這一圈之後」才發生，不是一開始就先更新。如果搞混了順序，跑的圈數會跟我們預期的不一樣。

預期結果：只要 `condition` 變成 `false`，迴圈就會立刻停止，繼續往下執行迴圈後面的程式碼。
-->

---

# for 迴圈範例

```java
for (int i = 1; i <= 5; i++) {
    System.out.print(i + " ");
}
// 輸出：1 2 3 4 5
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>計數方向：</b>遞增用 <code>i++</code>，遞減用 <code>i--</code>，步長可自訂，例如 <code>i += 2</code>
</div>

<!--
範例目的：用最簡單的「數數」練習，把剛剛三個區塊的語法套進實際程式碼裡。

帶讀關鍵行：`i = 1` 是起跑線，`i <= 5` 是終點線，`i++` 是每跑完一圈之後讓 `i` 往前進一步。

💼 業界實務：業界習慣讓計數從 `0` 開始，例如 `for (int i = 0; i < 5; i++)`，這個寫法之後在處理陣列索引時會非常常見，提早習慣會比較順手。

預期結果：螢幕上會依序印出 `1 2 3 4 5`。
-->

---

# Enhanced for-each 迴圈

| 元素 | 說明 |
| --- | --- |
| `dataType` | 陣列或集合中元素的型別 |
| `variable` | 每次迭代取得的元素 |
| `arrayOrCollection` | 要走訪的陣列或集合 |

```java
for (dataType variable : arrayOrCollection) {
    // 使用 variable
}
```

<!--
剛剛的 for 迴圈，如果只是想把陣列裡每個元素都拿出來看一遍，每次都要寫索引、判斷範圍，其實有點囉嗦。enhanced for-each 就是為這種「單純走訪每個元素」的情境設計的簡化版。

我們可以想像傳統 for 是去自助餐，要自己拿著盤子（索引）一格一格夾菜；for-each 則像是服務生直接把每一盤菜端到我們面前，我們只要負責「看」或「吃」，不用管它是第幾盤。
-->

---

# for-each 範例

```java
int[] scores = {85, 92, 78, 95, 88};

for (int score : scores) {
    System.out.print(score + " ");
}
// 輸出：85 92 78 95 88
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>使用時機：</b>for-each 只能「讀取」元素，不能修改陣列內容，也不提供索引值。需要索引時改用傳統 for 迴圈。
</div>

<!--
範例目的：把陣列 `scores` 裡的每個成績都印出來，這是 for-each 最典型的使用場景。

帶讀關鍵行：`for (int score : scores)` 這一行可以讀成「對 `scores` 裡的每一個 `score`」，每次迴圈 `score` 就會變成陣列裡下一個元素的值。

⚠️ 易錯點提醒：`score` 只是「取出來的一份拷貝」，在迴圈裡修改 `score` 不會影響到原本陣列裡的值，也沒辦法用 for-each 知道目前是第幾個元素。如果需要索引或要修改陣列內容，還是要回頭用傳統 `for`。

預期結果：依序印出 `85 92 78 95 88`。
-->

---
layout: default
---

# 🎬 AI 協作時刻：for 迴圈的差一錯誤

陣列迴圈最常見的錯誤就是條件寫成 `<=` 而不是 `<`，跑出 `ArrayIndexOutOfBoundsException`：

**要用的 Prompt：**

> 我寫了這段用 for 迴圈走訪陣列的程式，執行時噴出
> ArrayIndexOutOfBoundsException，請幫我找出問題所在，
> 並解釋為什麼陣列索引的合法範圍是這樣：
> {貼上你的程式碼}

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見地雷：</b> 陣列合法索引是 <code>0</code> 到 <code>length - 1</code>，條件寫成 <code>i <= nums.length</code> 就是典型的「差一錯誤」（off-by-one）。
</div>

<!--
【操作提示】
現場故意把練習 1 的程式碼條件改成 `i <= nums.length`，讓學生先看到崩潰畫面，再貼給 AI 除錯，對照 AI 講的原因跟課堂教的是否一致。

【收斂一句話】
陣列邊界永遠用 length - 1 檢查，AI 除錯的答案也要回頭對照「合法索引範圍」這個規則驗證。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
傳統 for 跟 for-each 都上手了，接下來這一連串練習，會把 for、while、do-while，還有 break、continue 這些工具，一題一題實際串起來用，寫完大家對迴圈的掌握度會扎實很多。
-->

---
layout: default
---

# 練習 1：偶數加總與索引印出
### 任務說明

有一個陣列 `int[] nums = {3, 8, 12, 7, 20, 5, 16}`，請完成以下兩個任務：

1. 使用傳統 `for` 迴圈，印出每個元素的「索引：值」（例如 `0: 3`）
2. 使用 `for-each` 迴圈，計算並印出所有**偶數**的總和

**預期輸出（部分）：**
```
0: 3
1: 8
2: 12
...
偶數總和：56
```

<!--
【任務鋪陳】
這個練習要把傳統 `for` 跟 `for-each` 放在同一題裡比較：傳統 `for` 因為有索引變數，適合用來「邊走訪邊標出位置」；`for-each` 沒有索引，但寫法更精簡，適合單純走訪每個元素做運算（像加總）。

【引導思考】
想一想：第一個任務需要印出「索引」，這代表一定要知道目前是第幾個元素，這種情境該用傳統 `for` 還是 `for-each`？第二個任務只需要「值」本身，不需要知道位置，這時候哪一種寫法比較精簡？
-->

---
layout: default
---

# 練習 1：解題提示

1. 第一個任務用傳統 `for (int i = 0; i < nums.length; i++)`，印出 `i + ": " + nums[i]`
2. 第二個任務用 `for-each`，搭配 `if (n % 2 == 0)` 判斷偶數並累加

```java
int[] nums = {3, 8, 12, 7, 20, 5, 16};

// 任務一：印出索引與值（需要索引，用傳統 for）
for (int i = 0; i < nums.length; i++) {
    System.out.println(i + ": " + nums[i]);
}

// 任務二：偶數加總（不需要索引，用 for-each）
int sum = 0;
for (int n : nums) {
    if (n % 2 == 0) {
        sum += n;
    }
}
System.out.println("偶數總和：" + sum);
```

<!--
【帶讀解法】
這個練習的重點在於「依情境選擇合適的迴圈」：任務一需要「索引」這個額外資訊，只有傳統 `for` 才能提供（透過 `i`）；任務二只需要「值」本身，`for-each` 寫起來更精簡，也更不容易在索引計算上出錯（例如 `nums.length - 1` 之類的邊界問題）。

⚠️ 易錯點提醒：傳統 `for` 的條件記得用 `i < nums.length`（不是 `<=`），陣列的合法索引是 `0` 到 `length - 1`，如果用 `<=` 會發生 `ArrayIndexOutOfBoundsException`。

偶數總和：`8 + 12 + 20 + 16 = 56`，可以照這個對照一下自己跑出來的結果是否正確。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 巢狀 for 迴圈

<!--
學會單層的 for 迴圈之後，接下來要進階一步：迴圈裡面再放一個迴圈，也就是「巢狀迴圈」。

這就像時鐘的指針：分針走一整圈（60 分鐘），時針才會跳一格。內層迴圈（分針）每次都要從頭走到尾，外層迴圈（時針）才會往前一步——這就是巢狀迴圈的基本概念，常用來處理「表格」或「二維」的資料。
-->

---
layout: default
---

# 巢狀 for 迴圈結構

| 元素 | 說明 |
| --- | --- |
| 外層迴圈 | 控制「列」，每執行一次，內層走完一輪 |
| 內層迴圈 | 控制「欄」，每次從頭開始計數 |
| 時間複雜度 | 外層 n 次 × 內層 m 次 = n × m 次 |

```java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        System.out.print(i + "*" + j + "=" + (i*j) + "  ");
    }
    System.out.println();
}
```

<!--
延續剛剛時鐘的比喻：外層迴圈是時針，跑一次（i 增加 1）；內層迴圈是分針，要完整跑一輪（j 從 1 到 3）之後，外層才會繼續往下走一步。

帶讀關鍵行：每次外層迴圈執行一次，內層迴圈就會完整跑一輪，所以總執行次數是「外層次數 × 內層次數」。

⚠️ 易錯點提醒：巢狀迴圈的層數越多，執行的次數會用「相乘」的方式快速膨脹，所以非必要不要套太多層，否則程式可能會跑得非常慢。

預期結果：這段程式會印出 3 行，每行有 3 組「i*j=結果」。
-->

---

# 九九乘法表

```java
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= 9; j++) {
        System.out.printf("%d*%d=%-3d", i, j, i * j);
    }
    System.out.println();
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>格式化：</b><code>%-3d</code> 表示整數靠左對齊、保留 3 格寬度，讓輸出整齊排列。
</div>

<!--
範例目的：用巢狀迴圈印出大家從小背到大的九九乘法表，外層控制「被乘數」（1~9），內層控制「乘數」（1~9）。

帶讀關鍵行：`%-3d` 是格式化輸出的寫法，`-` 代表靠左對齊，`3` 代表至少保留 3 個字元的寬度，這樣不管結果是 1 位數還是 2 位數，欄位都會對齊。

預期結果：印出 9 行，每行 9 組「i*j=結果」，且每組數字之間的間距整齊一致。
-->

---
layout: default
---

# 練習 2：星號矩形
### 任務說明

使用巢狀 `for` 迴圈，印出一個 `5` 列 `8` 欄的星號矩形：

**預期輸出：**
```
********
********
********
********
********
```

**進階要求：** 改成只印出矩形的邊框（四個邊都是 `*`，內部是空白）：
```
********
*      *
*      *
*      *
********
```

<!--
【任務鋪陳】
這個練習延續「外層控制列、內層控制欄」的巢狀迴圈結構，先從最單純的「全部填滿」開始，再進階到「只印邊框」，讓我們體會巢狀迴圈搭配條件判斷可以做出更多變化的圖形。

【引導思考】
想一想：印滿星號的版本，外層跑幾次？內層跑幾次？進階的邊框版本，怎麼判斷「目前位置是不是邊框」？（提示：第一列、最後一列、每列的第一格、每列的最後一格都是邊框）
-->

---
layout: default
---

# 練習 2：解題提示

1. 基本版：外層跑 5 次（列），內層跑 8 次（欄），每格都印 `*`
2. 進階版：在內層加上 `if` 判斷——是第一列、最後一列、第一欄或最後一欄就印 `*`，否則印空格

```java
int rows = 5, cols = 8;

// 基本版：填滿矩形
for (int i = 1; i <= rows; i++) {
    for (int j = 1; j <= cols; j++) {
        System.out.print("*");
    }
    System.out.println();
}

// 進階版：只印邊框
for (int i = 1; i <= rows; i++) {
    for (int j = 1; j <= cols; j++) {
        if (i == 1 || i == rows || j == 1 || j == cols) {
            System.out.print("*");
        } else {
            System.out.print(" ");
        }
    }
    System.out.println();
}
```

<!--
【帶讀解法】
基本版的結構跟九九乘法表一模一樣，只是內層不再做運算，單純印固定字元 `*`。

進階版的關鍵是那一行 `if (i == 1 || i == rows || j == 1 || j == cols)`：這句話用 `||` 串起四個條件，意思是「目前是第一列，或是最後一列，或是第一欄，或是最後一欄」——只要符合任何一個，就代表這個位置在邊框上，印 `*`；否則印空格。

⚠️ 易錯點提醒：邊框版的條件用的是 `||`（任一成立即可），如果不小心寫成 `&&`，會變成「同時是第一列又是第一欄」這種極窄的條件，幾乎所有位置都會印空格，矩形邊框就消失了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# while 迴圈

<!--
`for` 迴圈適合「一開始就知道要跑幾次」的情境，但有時候我們根本不知道要重複幾次，只知道「重複到某個條件不成立為止」——這時候就輪到 `while` 上場了。

就像我們追一部連續劇：「只要還有下一集，就繼續看」，沒有人會在一開始就規定自己「要看 12 集」，而是看到「沒有下一集了」才停下來。`while` 迴圈就是這種「依條件決定要不要繼續」的寫法。
-->

---
layout: default
---

# while 迴圈語法

| 元素 | 說明 |
| --- | --- |
| `condition` | 每次執行前檢查，為 `false` 時離開迴圈 |
| 進入時機 | 條件為 `true` 才會進入；若一開始就為 `false`，一次都不執行 |
| 適用情境 | 不知道確切執行次數、依條件決定停止 |

```java
while (condition) {
    // 重複執行的程式碼
}
```

<!--
`while` 的語法很單純：只要括號裡的 `condition` 是 `true`，就會一直執行裡面的程式碼，直到 `condition` 變成 `false` 為止。

⚠️ 易錯點提醒：如果一開始 `condition` 就是 `false`，迴圈裡面的程式碼會「一次都不執行」，直接跳過。這跟之後會學到的 `do-while`（保證至少執行一次）是最大的差別。

預期結果：適合用在「不確定要重複幾次，但有明確的停止條件」的情境，例如不斷讀取使用者輸入，直到輸入特定指令為止。
-->

---

# while 迴圈範例

```java
int i = 1;
while (i <= 5) {
    System.out.print(i + " ");
    i++;
}
// 輸出：1 2 3 4 5
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見錯誤：</b>忘記在迴圈內更新條件變數（例如忘記 <code>i++</code>），會造成無限迴圈。
</div>

<!--
範例目的：用 `while` 重現「印出 1 到 5」的效果，跟之前 `for` 迴圈的範例做對照。

帶讀關鍵行：跟 `for` 迴圈不同，`while` 不會自動幫我們更新計數變數，所以 `i++` 要自己手動寫在迴圈裡面。

⚠️ 易錯點提醒：如果忘記寫 `i++`，`i` 永遠都是 1，條件 `i <= 5` 永遠成立，程式就會一直印「1」，停不下來——這就是「無限迴圈」，是新手最常踩的坑。

預期結果：跟之前的 `for` 迴圈範例一樣，輸出 `1 2 3 4 5`。
-->

---

# 巢狀 while 迴圈

```java
int i = 1;
while (i <= 3) {
    int j = 1;
    while (j <= 3) {
        System.out.print(i + "*" + j + " ");
        j++;
    }
    System.out.println();
    i++;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b>內層迴圈的計數變數 <code>j</code> 必須在外層每次迭代時重新初始化，否則只會執行一次。
</div>

<!--
範例目的：用 `while` 重現巢狀迴圈的效果，這次外層跟內層都要自己管理計數變數。

帶讀關鍵行：注意 `int j = 1;` 寫在外層迴圈「裡面」，這代表每次外層跑一輪，`j` 都會重新從 1 開始。

⚠️ 易錯點提醒：如果把 `j = 1` 寫在外層迴圈外面，`j` 只會初始化一次，跑完第一輪內層迴圈之後 `j` 就停在 4 了，之後條件 `j <= 3` 永遠是 `false`，內層迴圈就再也不會執行。

預期結果：跟 6-2 的九九乘法表結構類似，會印出 3 行、每行 3 組的結果。
-->

---
layout: default
---

# 練習 3：倒數計時器
### 任務說明

撰寫一個程式，使用 `while` 迴圈模擬一個倒數計時器：

1. 從 `count = 5` 開始，使用 `while` 迴圈印出「倒數：5」「倒數：4」...「倒數：1」
2. 每次印出後將 `count` 減 1
3. 迴圈結束後印出「時間到！」

**預期輸出：**
```
倒數：5
倒數：4
倒數：3
倒數：2
倒數：1
時間到！
```

<!--
【任務鋪陳】
這個練習要把 `while` 迴圈用在「遞減」的情境，跟前面範例「遞增印出 1 到 5」剛好相反，藉此確認大家是不是真的理解 `while` 的條件判斷跟更新時機，而不是死背遞增的寫法。

【引導思考】
想一想：這次條件要怎麼寫？是 `count <= 5` 還是 `count >= 1`？每次迴圈裡的更新應該是 `count++` 還是 `count--`？如果這兩個地方有一個寫錯，會發生什麼事？
-->

---
layout: default
---

# 練習 3：解題提示

1. 條件改成 `count >= 1`（遞減到 1 還要執行）
2. 迴圈內先印出訊息，再用 `count--` 遞減
3. 迴圈結束後（`count` 變成 0，條件不成立）印出「時間到！」

```java
int count = 5;
while (count >= 1) {
    System.out.println("倒數：" + count);
    count--;
}
System.out.println("時間到！");
```

<!--
【帶讀解法】
這題跟範例的差別只在於：條件從 `i <= 5`（遞增到上限）變成 `count >= 1`（遞減到下限），更新也從 `i++` 變成 `count--`。重點是兩者必須「方向一致」——遞減的迴圈如果還寫成 `count++`，`count` 只會越來越大，永遠 `>= 1`，就變成無限迴圈了。

⚠️ 易錯點提醒：這正好對應到上一頁的「常見錯誤」——忘記更新或更新方向錯誤，都會造成無限迴圈。寫 `while` 迴圈時，建議先確認「條件」跟「更新方向」是不是朝著同一個目標前進。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# do-while 迴圈

<!--
前面講的 `for` 跟 `while` 都是「先檢查條件，再決定要不要執行」。但有些情境，我們希望「至少先做一次」，再來看後續要不要繼續——這就是 `do-while` 要解決的問題。

最常見的例子是夜市試吃：老闆先讓你吃一口（一定先執行），吃完之後才問「要不要買」（再檢查條件）。`do-while` 就是這種「先做、再判斷」的迴圈寫法。
-->

---
layout: default
---

# do-while 迴圈語法

| 元素 | 說明 |
| --- | --- |
| 執行時機 | 先執行一次，再檢查條件 |
| 最少次數 | **至少執行一次**，即使條件一開始就為 false |
| 結尾分號 | `while (condition);` 後面要加分號 |

```java
do {
    // 至少執行一次的程式碼
} while (condition);
```

<!--
`do-while` 的結構是「先執行 `{}` 裡的程式碼，再檢查 `while` 後面的條件」，如果條件是 `true`，就回到開頭再執行一次，直到條件變成 `false`。

⚠️ 易錯點提醒：`while (condition)` 後面要加一個分號 `;`，這是 Java 裡少數會在 `while` 後面加分號的地方，少了它會編譯錯誤。

預期結果：不管條件一開始是 `true` 還是 `false`，`{}` 裡的程式碼都會先執行一次。
-->

---

# do-while vs while 對比

| 比較項目 | while | do-while |
| --- | --- | --- |
| 條件檢查時機 | 執行**前** | 執行**後** |
| 最少執行次數 | 0 次 | **1 次** |
| 適用情境 | 不確定是否需要執行 | 至少要執行一次（如選單） |

<!--
這張表整理了 `while` 跟 `do-while` 最核心的差異：`while` 是「先檢查、再執行」，最少可以執行 0 次；`do-while` 是「先執行、再檢查」，保證至少執行 1 次。

我們可以這樣記：`while` 是先看票再上車，沒票就不能上；`do-while` 是先上車再補票，至少先上了車再說。這個對比也是常見的面試考題，務必記熟。
-->

---

# do-while 範例

```java
int i = 10;
do {
    System.out.print(i + " ");
    i++;
} while (i <= 5);
// 條件一開始就是 false，但仍輸出：10
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>典型應用：</b>顯示選單讓使用者選擇，至少要顯示一次，才能根據使用者的選擇決定是否繼續。
</div>

<!--
範例目的：示範「條件一開始就不成立」的情況下，`do-while` 仍然會執行一次。

帶讀關鍵行：`i = 10`，條件是 `i <= 5`，一開始就是 `false`。但因為是 `do-while`，程式碼會先執行一次，印出 `10`，再去檢查條件，發現不成立就結束。

💼 業界實務：這個特性最常用在「選單系統」——程式得先把選單顯示給使用者看一次，使用者才能根據顯示的內容決定要不要繼續操作。

預期結果：印出 `10`，迴圈只執行一次就結束。
-->

---
layout: default
---

# 🎬 AI 協作時刻：while vs do-while 猜輸出

`while` 跟 `do-while` 最容易搞混的就是「執行順序」跟「忘記更新變數造成無窮迴圈」：

**要用的 Prompt：**

> 請針對 while 忘記更新條件變數（造成無窮迴圈）、
> 以及 do-while 條件一開始就是 false 但仍先執行一次，
> 出 3 題「猜輸出結果」的程式碼考題，先不要公布答案，
> 等我回答完再核對。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見地雷：</b> <code>while</code> 是先檢查再執行、最少 0 次；<code>do-while</code> 是先執行再檢查、最少 1 次——兩者搞混會導致選單少顯示一次，或迴圈完全不執行。
</div>

<!--
【操作提示】
現場讓學生先猜答案，特別是「忘記寫 count--」的無窮迴圈題，猜完再實際跑一次程式碼驗證（記得先設定執行次數上限，避免真的卡住）。

【收斂一句話】
while 先驗票再上車、do-while 先上車再補票，忘記更新變數是無窮迴圈最常見的兇手。
-->

---
layout: default
---

# 練習 4：簡易選單系統
### 任務說明

撰寫一個程式，使用 `do-while` 顯示一個簡易選單，讓使用者重複選擇，直到選擇「3」才結束：

```
1. 查詢餘額
2. 存款
3. 離開
```

1. 使用 `Scanner` 讀取使用者輸入的選項（整數）
2. 輸入 `1` 印出「目前餘額：1000 元」
3. 輸入 `2` 印出「存款成功」
4. 輸入 `3` 印出「再見」並結束程式
5. 其他輸入印出「無效選項」

<!--
【任務鋪陳】
這個練習要把 `do-while` 用在它最經典的應用場景——選單系統。選單至少要先顯示一次，使用者才能根據看到的內容做選擇，這正是 `do-while`「先執行、再判斷」的特性。

【引導思考】
想一想：這題如果改用 `while` 來寫，會發生什麼問題？（提示：`while` 需要先有一個變數讓條件可以判斷，但使用者還沒輸入任何東西之前，這個變數要設成什麼初始值，才能保證選單至少顯示一次？）
-->

---
layout: default
---

# 練習 4：解題提示

1. 用 `do { ... } while (choice != 3);` 包住整個選單邏輯
2. 在迴圈內先印出選單，再用 `Scanner` 讀取 `choice`
3. 用 `switch` 或 `if-else` 依 `choice` 印出對應訊息
4. 條件 `choice != 3` 為 `false`（即 `choice == 3`）時結束迴圈

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
int choice;
do {
    System.out.println("1. 查詢餘額");
    System.out.println("2. 存款");
    System.out.println("3. 離開");
    choice = sc.nextInt();

    switch (choice) {
        case 1 -> System.out.println("目前餘額：1000 元");
        case 2 -> System.out.println("存款成功");
        case 3 -> System.out.println("再見");
        default -> System.out.println("無效選項");
    }
} while (choice != 3);
```

<!--
【帶讀解法】
這題完美對應上一頁提到的「典型應用」：選單一定要先印出來給使用者看（這就是 `do` 區塊裡的內容），使用者才能根據看到的選項輸入數字。如果改用 `while`，在第一次判斷條件之前，`choice` 根本還沒有值，沒辦法判斷 `choice != 3`。

⚠️ 易錯點提醒：別忘了 `do { ... } while (choice != 3);` 結尾的分號，這是 `do-while` 語法裡容易漏掉的小細節，編譯器會直接報錯提醒我們。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 無限迴圈與迴圈控制

<!--
三種迴圈的基本語法都學完了，接下來要學的是「迴圈的控制技巧」：有時候我們希望迴圈永遠跑下去（無限迴圈），有時候希望它能提早結束（`break`），有時候希望它跳過某一輪、繼續下一輪（`continue`）。

這幾招就像是車子的油門、剎車、跳檔——學會之後，我們對迴圈的掌控會更精準。
-->

---
layout: default
---

# 無限迴圈

| 寫法 | 說明 |
| --- | --- |
| `while (true)` | 條件永遠為 true，常見且語意清晰 |
| `for (;;)` | 省略三個部分的 for 迴圈，效果相同 |
| 搭配 `break` | 在迴圈內部以 `break` 決定何時離開 |

```java
while (true) {
    System.out.println("持續執行...");
    break; // 必須有出口，否則無法終止
}
```

<!--
有些程式我們是希望它「一直跑下去」，不要因為條件不成立就停下來，例如伺服器要持續監聽連線。這時候我們會故意把條件寫成永遠成立。

這就像超商的自動門感應器，它不會「跑完一次就關機」，而是持續偵測，永遠保持運作。`while (true)` 就是「條件永遠是 true」最直白的寫法。

⚠️ 易錯點提醒：寫無限迴圈時，一定要在裡面安排一個「出口」，通常是用 `break` 搭配某個判斷條件。如果忘了寫出口，程式就會一直占用資源，永遠不會結束。
-->

---

# for(;;) 無限迴圈

```java
int count = 0;
for (;;) {
    count++;
    if (count >= 3) {
        break;
    }
}
System.out.println("執行了 " + count + " 次"); // 3
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>應用場景：</b>伺服器監聽連線、持續讀取感測器資料、遊戲主迴圈等「一直等待直到停止」的情境。
</div>

<!--
範例目的：示範另一種無限迴圈的寫法 `for (;;)`，三個區塊都留空，效果跟 `while (true)` 一樣，但常出現在比較資深的程式碼裡。

帶讀關鍵行：`if (count >= 3) { break; }` 就是這個無限迴圈的「出口」。沒有它，這段程式就會永遠執行下去。

預期結果：迴圈執行 3 次之後，`count` 達到 3，`break` 觸發，跳出迴圈，最後印出「執行了 3 次」。
-->

<!--
💼 業界實務：這種「無限迴圈 + 條件式 break」的結構，常用在伺服器監聽連線、持續讀取感測器資料、遊戲主迴圈等「一直等待，直到某個條件出現才停止」的情境。
-->

---

# break 敘述

| 元素 | 說明 |
| --- | --- |
| 作用 | 立即跳出「最近一層」的迴圈或 switch |
| 執行後 | 繼續執行迴圈之後的程式碼 |
| 常見搭配 | 搭配 `if` 條件判斷使用 |

```java
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break; // 找到 5，立即停止
    }
    System.out.print(i + " ");
}
// 輸出：1 2 3 4
```

<!--
有時候我們在迴圈跑到一半，就已經達成目的了，不需要再繼續跑下去——這時候就可以用 `break` 直接離開迴圈。

就像我們在跑馬拉松，途中突然發現掉了重要的東西要趕回去處理，於是直接離開賽道——`break` 就是讓迴圈「立刻結束」，不會管後面還剩多少次要跑。

範例目的：在 1 到 10 之間找到 `5` 之後就立刻停止。

帶讀關鍵行：`if (i == 5) { break; }`，一旦 `i` 等於 5，就立即跳出整個 `for` 迴圈。

預期結果：印出 `1 2 3 4`，因為印到 5 之前就先觸發了 `break`，5 跟之後的數字都不會被印出來。
-->

---

# continue 敘述

| 元素 | 說明 |
| --- | --- |
| 作用 | 跳過本次迭代剩餘程式碼，進入下一次迭代 |
| 與 break 差異 | `break` 離開迴圈；`continue` 繼續下一圈 |
| 常見搭配 | 搭配 `if` 過濾不需要處理的情況 |

```java
for (int i = 1; i <= 5; i++) {
    if (i == 3) {
        continue; // 跳過 3
    }
    System.out.print(i + " ");
}
// 輸出：1 2 4 5
```

<!--
`break` 是「整個結束」，但有時候我們只是想跳過「這一輪」，迴圈本身還是要繼續跑下去——這時候就要用 `continue`。

就像我們在檢查一籃雞蛋，發現某顆蛋裂了（符合某個條件），我們會跳過這顆蛋、直接拿下一顆繼續檢查，而不是把整籃蛋都不檢查了。`continue` 就是「跳過這一次，繼續下一次」。

範例目的：印出 1 到 5，但跳過 3。

帶讀關鍵行：`if (i == 3) { continue; }`，當 `i` 等於 3 時，這一輪剩下的程式碼（`System.out.print`）就不會執行，直接進入下一輪。

預期結果：印出 `1 2 4 5`，少了 3。
-->

---
layout: default
---

# 🎬 AI 協作時刻：break vs continue 混淆測驗

`break` 跟 `continue` 是新手最容易搞混的一對關鍵字，讓 AI 出題檢驗你是不是真的分清楚：

**要用的 Prompt：**

> 請針對 for 迴圈搭配 break 跟 continue 的行為差異，
> 出 2 題「猜輸出結果」的程式碼考題（其中一題用巢狀迴圈），
> 先不要公布答案，等我回答完再核對。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見地雷：</b> 巢狀迴圈裡的 <code>break</code> 只會跳出「最內層」的迴圈，很多人誤以為會整個結束——這也是面試常出的追問題。
</div>

<!--
【操作提示】
現場讓學生先猜答案，特別是巢狀迴圈那一題，再實際跑一次程式碼驗證，順便追問「break 在巢狀迴圈裡到底跳出哪一層」。

【收斂一句話】
break 是整個離開迴圈、continue 是跳過這一圈繼續跑，巢狀迴圈裡更要小心 break 只會影響最內層。
-->

---
layout: default
---

# 練習 5：找出第一個符合條件的數字
### 任務說明

撰寫一個程式，使用 `for(;;)` 無限迴圈，從 `1` 開始逐一檢查數字：

1. 跳過所有奇數（使用 `continue`）
2. 偶數中，如果該數字能被 `7` 整除，就印出該數字並立即結束迴圈（使用 `break`）
3. 其他偶數則印出「跳過：N」

**預期輸出（前幾行）：**
```
跳過：2
跳過：4
跳過：6
找到了：14
```

<!--
【任務鋪陳】
這個練習要把無限迴圈、`break`、`continue` 三個工具放在同一段程式裡：用無限迴圈持續檢查，`continue` 用來跳過不符合條件的數字，`break` 用來在找到答案時結束。

【引導思考】
想一想：`continue` 跟 `break` 分別對應題目裡的哪一個動作？如果這題只用 `continue` 不用 `break`，迴圈會發生什麼事？反過來，如果忘記寫 `continue`，奇數會被怎麼處理？
-->

---
layout: default
---

# 練習 5：解題提示

1. 用 `for (int i = 1;; i++)` 建立無限迴圈（省略條件，靠內部的 `break` 結束）
2. `i % 2 != 0`（奇數）就 `continue`，跳到下一輪
3. `i % 7 == 0`（偶數且能被 7 整除）就印出「找到了：N」並 `break`
4. 其他偶數印出「跳過：N」

```java
for (int i = 1;; i++) {
    if (i % 2 != 0) {
        continue; // 跳過奇數
    }
    if (i % 7 == 0) {
        System.out.println("找到了：" + i);
        break; // 找到答案，結束迴圈
    }
    System.out.println("跳過：" + i);
}
```

<!--
【帶讀解法】
這題的流程是：每一輪先用 `continue` 把奇數濾掉（1、3、5... 直接跳過），剩下的偶數（2、4、6...）再檢查是否能被 7 整除。第一個同時是偶數又能被 7 整除的數字是 14，所以印出「找到了：14」之後就 `break` 結束。

⚠️ 易錯點提醒：這題的 `for (int i = 1;; i++)` 把「條件」那一格留空，等於是 `for (;;)` 的變化版——一定要確保 `break` 能被觸發，否則就會變成真正的無限迴圈，永遠跑下去。這也呼應了上一頁提到的「無限迴圈一定要安排出口」的重點。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Scanner 輸入檢查

<!--
還記得前面學過的 Scanner 嗎？如果使用者照著我們預期的格式輸入，程式當然沒問題；但如果使用者打錯格式（例如要求輸入數字，卻打了文字），程式就會直接出錯崩潰。

這一節我們要教 Scanner 怎麼「過濾」輸入內容，確保拿到的資料是我們想要的格式，這在實務上叫做「輸入驗證」，幾乎每個跟使用者互動的程式都需要它。
-->

---
layout: default
---

# Scanner 輸入驗證語法

| 元素 | 說明 |
| --- | --- |
| `Scanner sc` | 建立 Scanner 讀取 System.in |
| `sc.hasNextInt()` | 回傳 true 表示下一個 token 是整數 |
| `sc.nextInt()` | 讀取下一個整數 |
| `sc.next()` | 跳過非整數的輸入 |

```java
Scanner sc = new Scanner(System.in);
while (!sc.hasNextInt()) {
    sc.next(); // 丟棄無效輸入
}
int value = sc.nextInt();
```

<!--
`sc.hasNextInt()` 就像是一個過濾網，先「看一下」下一個輸入是不是整數，但不會真的把它讀走。

我們可以想像自己在等公車：只有號碼對的公車（整數）我們才上車（`nextInt()`）；如果來的是別的車（不是整數的輸入），我們就讓它直接開走（`sc.next()` 丟棄），繼續等下一班。

帶讀關鍵行：`while (!sc.hasNextInt()) { sc.next(); }` 這段會一直丟棄非整數的輸入，直到遇到整數為止，再用 `sc.nextInt()` 把它讀進來。
-->

---

# 輸入驗證完整範例

```java
Scanner sc = new Scanner(System.in);
int age = -1;
System.out.print("請輸入年齡（正整數）：");
while (age <= 0) {
    if (sc.hasNextInt()) {
        age = sc.nextInt();
        if (age <= 0) System.out.print("請輸入正整數：");
    } else {
        System.out.print("格式錯誤，請重新輸入：");
        sc.next();
    }
}
System.out.println("年齡：" + age);
```

<!--
範例目的：要求使用者輸入一個正整數作為年齡，並持續驗證直到輸入有效為止。

帶讀關鍵行：`while (age <= 0)` 是整個驗證迴圈的主軸。裡面用 `if-else` 分兩種情況處理：如果 `hasNextInt()` 為 `true`，就讀進來檢查是不是正數；如果是文字之類的非整數輸入，就提示錯誤並用 `sc.next()` 丟棄。

⚠️ 易錯點提醒：這就是「防呆設計」——如果使用者亂打文字，程式不會直接崩潰拋出例外，而是會持續提示「重新輸入」，這是專業程式跟學生作業常見的差別之一。

預期結果：不管使用者一開始打了什麼，最後一定會拿到一個有效的正整數年齡，才會跳出迴圈。
-->

---

# while(true) + break 輸入模式

```java
Scanner sc = new Scanner(System.in);
while (true) {
    String line = sc.nextLine();
    if ("bye".equalsIgnoreCase(line)) {
        break;
    }
    System.out.println("你輸入了：" + line);
}
System.out.println("結束輸入");
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見應用：</b>持續讀取輸入，直到使用者輸入特定結束字（如 "bye"、"quit"）才停止，是互動式程式的標準模式。
</div>

<!--
範例目的：示範「持續讀取輸入，直到使用者輸入特定結束字」這種互動式程式的標準寫法。

帶讀關鍵行：`while (true)` 搭配 `if ("bye".equalsIgnoreCase(line)) { break; }`，只要使用者輸入的內容是 `bye`（不論大小寫），就觸發 `break` 結束迴圈，否則就把輸入內容印出來、繼續等待下一次輸入。

💼 業界實務：這是互動式程式（例如命令列工具、聊天機器人）常見的套路——「除非使用者輸入結束指令，否則一直保持互動」，本質就是 `while(true)` 搭配 `break`。

預期結果：每次輸入都會被印出，直到輸入 `bye` 為止，最後印出「結束輸入」。
-->

---
layout: default
---

# 🎬 AI 協作時刻：Scanner 輸入驗證除錯

使用者打了文字進去，程式卻預期整數，很容易直接噴例外崩潰：

**要用的 Prompt：**

> 我寫的 Scanner 輸入驗證程式，使用者只要打了非數字的文字，
> 程式就會噴出 InputMismatchException 直接崩潰，
> 請幫我找出問題並修正，讓程式能持續提示重新輸入：
> {貼上你的程式碼}

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見地雷：</b> 忘記在 <code>nextInt()</code> 之前用 <code>hasNextInt()</code> 檢查，或忘記用 <code>sc.next()</code> 丟棄無效輸入，都會讓迴圈卡死或直接崩潰。
</div>

<!--
【操作提示】
現場示範一段「沒有驗證直接 nextInt()」的程式，故意輸入文字讓它崩潰，再貼給 AI 除錯，對照 AI 加回來的 hasNextInt() 檢查跟課堂教的寫法是否一致。

【收斂一句話】
Scanner 讀整數前一定要先 hasNextInt() 把關，讀到不對的格式要用 next() 丟棄，不然不是崩潰就是卡住。
-->

---
layout: default
---

# 練習 6：輸入驗證與累加
### 任務說明

撰寫一個程式，持續讀取使用者輸入的整數並累加總和，直到使用者輸入 `0` 為止：

1. 使用 `while (true)` 搭配 `break`，輸入 `0` 時結束並印出總和
2. 若使用者輸入非整數的內容，印出「格式錯誤，請重新輸入」並丟棄該輸入，不納入計算
3. 結束時印出累加的總和

**輸入範例：** `10`、`abc`、`20`、`0`
**輸出範例：** `格式錯誤，請重新輸入`（針對 `abc`）、最後印出 `總和：30`

<!--
【任務鋪陳】
這個練習把「輸入驗證」跟「累加」兩個概念結合在一起：每讀到一個有效的整數就累加，遇到無效輸入就提示錯誤並丟棄，遇到 `0` 就結束並印出結果。

【引導思考】
想一想：要用什麼結構讓程式「持續讀取，直到輸入 0」？`hasNextInt()` 要放在迴圈的什麼位置，才能在「讀取之前」先確認輸入格式正確？
-->

---
layout: default
---

# 練習 6：解題提示

1. 用 `while (true)` 搭配 `sc.hasNextInt()` 判斷下一個輸入是否為整數
2. 不是整數就用 `sc.next()` 丟棄並印出錯誤訊息，用 `continue` 跳過本輪剩下的程式碼
3. 是整數就讀進來，若為 `0` 則 `break`，否則累加到 `sum`

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
int sum = 0;
while (true) {
    if (!sc.hasNextInt()) {
        System.out.println("格式錯誤，請重新輸入");
        sc.next();
        continue;
    }
    int num = sc.nextInt();
    if (num == 0) {
        break;
    }
    sum += num;
}
System.out.println("總和：" + sum);
```

<!--
【帶讀解法】
這個練習把這一節的 `hasNextInt()` 輸入驗證跟前一節學到的 `while(true) + break` 模式結合在一起，再加上 `continue` 來跳過無效輸入。整個流程是：先檢查格式 → 格式錯就丟棄並 `continue` → 格式對就讀進來 → 是 `0` 就 `break` → 否則累加。

⚠️ 易錯點提醒：`continue` 在這裡的作用是「跳過這一輪剩下的程式碼，回到 while 開頭重新檢查」，如果漏寫 `continue`，程式會在丟棄無效輸入之後，繼續往下執行 `sc.nextInt()`，但這時候輸入流裡可能還是無效的內容，容易造成混亂。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 迴圈應用

<!--
迴圈的語法跟控制技巧都學完了，這一節要把這些工具串起來，看看迴圈在實務上能幫我們做什麼。

最常見的應用就是「累加」「計數」這類需要重複處理一堆資料的場景：把所有數字加起來算總和、計算符合條件的項目有幾個、從一堆數字裡找出最大或最小值。這些都是迴圈最基本、也最常用的應用模式。
-->

---
layout: default
---

# 累加與計數

| 應用 | 說明 | 初始值 |
| --- | --- | --- |
| 累加（sum） | 將每次迭代的值加入總和 | `sum = 0` |
| 計數（count） | 符合條件時計數器加一 | `count = 0` |
| 乘積（product） | 將每次迭代的值相乘 | `product = 1` |

```java
int sum = 0, count = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
    if (i % 2 == 0) count++;
}
// sum=5050, count=50（偶數個數）
```

<!--
累加（sum）跟計數（count）是迴圈最基本、也最常用的兩種應用模式。

我們可以把累加想成存錢筒：每次迴圈就往裡面投一筆錢，跑完之後存錢筒裡就是總和。計數則像是手上的計數器，每次符合條件就按一下，跑完之後看看按了幾次。

⚠️ 易錯點提醒：`sum` 跟 `count` 的初始值一定要設對——累加要從 `0` 開始，乘積要從 `1` 開始（如果從 `0` 開始，乘出來永遠是 `0`）。初始值設錯，結果就會整個歪掉。

預期結果：跑完 1 到 100 的迴圈後，`sum` 會是 `5050`（1 加到 100 的總和），`count` 會是 `50`（1 到 100 之間偶數的個數）。
-->

---

# 找最大與最小值

```java
int[] nums = {34, 17, 89, 45, 23};
int max = nums[0], min = nums[0];

for (int n : nums) {
    if (n > max) max = n;
    if (n < min) min = n;
}
System.out.println("最大：" + max); // 89
System.out.println("最小：" + min); // 17
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>初始化技巧：</b>將 max 和 min 初始化為陣列第一個元素，避免使用 <code>Integer.MIN_VALUE</code> 造成誤判。
</div>

<!--
範例目的：在一堆數字裡找出最大值跟最小值，這是迴圈應用裡很常見的題型。

帶讀關鍵行：`int max = nums[0], min = nums[0];` 是這個演算法的關鍵——先假設陣列的第一個元素就是最大（也是最小）的，之後迴圈裡每遇到一個新數字，就跟目前的 `max`、`min` 比較，遇到更大的就更新 `max`，遇到更小的就更新 `min`。

⚠️ 易錯點提醒：初始值要設成陣列第一個元素，而不是隨便設成 `0`。如果陣列裡全部都是負數，設成 `0` 當最大值就會出錯。

預期結果：這個陣列的最大值是 `89`，最小值是 `17`。
-->

---
layout: default
---

# 練習 7：成績的累加與極值
### 任務說明

有一組學生成績 `int[] scores = {72, 88, 65, 91, 58, 76}`，請使用迴圈計算並印出：

1. 所有成績的**總分**與**平均分**（平均輸出到小數點後一位）
2. 成績 `>= 80` 的人數（計數）
3. 最高分與最低分

**預期輸出：**
```
總分：450，平均：75.0
高分人數：2
最高分：91，最低分：58
```

<!--
【任務鋪陳】
這個練習把「累加與計數」跟「找最大最小值」兩個應用模式放進同一個迴圈裡，一次走訪陣列就把所有統計資料算出來，這在實務上是很常見的寫法。

【引導思考】
想一想：總分（sum）、計數（count）、最大值（max）、最小值（min）這四個變數，初始值各應該設成什麼？它們可以放在同一個 for-each 迴圈裡一起更新嗎？
-->

---
layout: default
---

# 練習 7：解題提示

1. `sum` 初始為 `0`，`count` 初始為 `0`
2. `max`、`min` 初始為陣列第一個元素
3. 用 `for-each` 一次走訪陣列，在迴圈內同時更新四個變數
4. 平均分用 `(double) sum / scores.length` 避免整數除法

```java
int[] scores = {72, 88, 65, 91, 58, 76};
int sum = 0, count = 0;
int max = scores[0], min = scores[0];

for (int score : scores) {
    sum += score;
    if (score >= 80) count++;
    if (score > max) max = score;
    if (score < min) min = score;
}

double avg = (double) sum / scores.length;
System.out.printf("總分：%d，平均：%.1f%n", sum, avg);
System.out.println("高分人數：" + count);
System.out.println("最高分：" + max + "，最低分：" + min);
```

<!--
【帶讀解法】
這個練習的重點是：四個統計值（sum、count、max、min）都可以在**同一個迴圈**裡一次算完，不需要為每個統計項目各寫一個迴圈。這也是迴圈應用的精神——走訪一次資料，盡可能把所有需要的資訊一次收集起來。

⚠️ 易錯點提醒：別忘了平均分要用 `(double) sum / scores.length`，如果寫成 `sum / scores.length`（兩個都是 int），結果會被截成整數，跟我們在 ch04 學過的整數除法問題是一樣的道理。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 專題應用

<!--
迴圈的基本應用都練過了，最後我們來挑戰一個經典的數學題目——雞兔同籠。這題的特色是：題目本身用數學公式解（聯立方程式）會比較麻煩，但如果用迴圈「一個一個猜」，反而會變得超級簡單。

這種「不用想太複雜的數學技巧，直接讓電腦一個個試」的解法，叫做「窮舉法」，是迴圈非常實用的應用場景之一。
-->

---
layout: default
---

# 雞兔同籠

已知籠中共有 35 個頭、94 條腿，求雞和兔各幾隻？

```java
int heads = 35, legs = 94;
for (int chicken = 0; chicken <= heads; chicken++) {
    int rabbit = heads - chicken;
    if (chicken * 2 + rabbit * 4 == legs) {
        System.out.println("雞：" + chicken + " 隻");
        System.out.println("兔：" + rabbit + " 隻");
        break;
    }
}
// 雞：23 隻，兔：12 隻
```

<!--
範例目的：用迴圈「窮舉」所有可能的雞數，找出符合「頭數＋腿數」條件的組合。

帶讀關鍵行：`for (int chicken = 0; chicken <= heads; chicken++)` 讓 `chicken` 從 0 一路試到 35；每一輪用 `heads - chicken` 算出對應的兔子數，再檢查 `chicken * 2 + rabbit * 4 == legs` 是否成立。

⚠️ 易錯點提醒：找到答案之後一定要 `break`！否則迴圈會繼續跑完剩下的次數，雖然不影響這題的結果（只有一組解），但養成「找到就停」的習慣，能避免浪費不必要的運算。

預期結果：印出「雞：23 隻」、「兔：12 隻」。我們不需要解聯立方程式，只要讓電腦一個個試，這就是「窮舉法」的威力。
-->

---

# 三種迴圈對比

| 比較項目 | for | while | do-while |
| --- | --- | --- | --- |
| 條件檢查 | 執行前 | 執行前 | 執行後 |
| 最少執行次數 | 0 次 | 0 次 | **1 次** |
| 計數變數位置 | 在 `for(...)` 內 | 在外部宣告 | 在外部宣告 |
| 適用情境 | 已知執行次數 | 依條件決定 | 至少執行一次 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選擇原則：</b>知道次數用 <code>for</code>；不知次數但有條件用 <code>while</code>；需至少執行一次用 <code>do-while</code>。
</div>

<!--
這張表是整章的重點整理，把三種迴圈放在一起對照，幫助我們建立「該用哪一種」的選擇直覺。

💼 業界實務：簡單來說——已經知道明確次數，用 `for`；不確定次數但有停止條件，用 `while`；需要「先做一次再判斷」（例如選單），用 `do-while`。選對工具，程式會更清楚易讀。
-->

---
layout: default
---

# 🎬 AI 協作時刻：AI 寫的 FizzBuzz 一定對嗎？

FizzBuzz 這類「多重條件判斷」的題目，AI 給的答案也可能踩到判斷順序的陷阱：

**要用的 Prompt：**

> 請 AI 幫我檢查這段 FizzBuzz 邏輯有沒有問題，
> 並解釋為什麼判斷順序很重要：
> {貼上你的程式碼}
> 但先不要照抄答案，自己動手跑一次、對照課堂教的規則驗證。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>提醒：</b> AI 給的答案不會自動是對的，如果 <code>i % 3</code> 或 <code>i % 5</code> 寫在 <code>i % 15</code> 前面，FizzBuzz 永遠不會出現——這種邏輯錯誤 AI 也可能寫錯，要自己動手驗證。
</div>

<!--
【操作提示】
現場請 AI 生成一版 FizzBuzz，故意選一個判斷順序寫錯的版本（或請學生自己觀察 AI 給的程式碼順序），實際跑一次看 50 以內有沒有印出正確的 FizzBuzz。

【收斂一句話】
AI 給的程式碼不是標準答案，遇到多重條件判斷更要自己動手跑一次，對照「嚴格條件放前面」的原則驗證。
-->

---
layout: default
---

# 練習 8：FizzBuzz
### 任務說明

輸出 1 到 50 的數字，但：
- 能被 3 整除時，輸出 `Fizz`
- 能被 5 整除時，輸出 `Buzz`
- 能被 3 和 5 整除時，輸出 `FizzBuzz`
- 其他情況輸出數字本身

**預期輸出（前 15 個）：** `1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz ...`

<!--
任務鋪陳：這一章我們學了 `for` 迴圈、`if-else` 條件判斷，還有 `%` 取餘數的用法。FizzBuzz 是一道很經典的練習題，剛好可以把這些東西全部串起來用一次，也是面試時很常出現的考題。

引導思考：題目裡有四種輸出情況，其中「同時被 3 和 5 整除」（也就是被 15 整除）是最特殊的一種。大家可以先想想：如果用 `if-else if` 依序判斷 `i % 3` 再判斷 `i % 5`，遇到 15 的時候會發生什麼事？判斷的「順序」會不會影響結果？
-->

---
layout: default
---

# 練習 8：解題提示
### 提示說明

1. 使用 `for` 迴圈從 1 跑到 50
2. 用 `%` 取餘數判斷整除條件
3. **關鍵順序：** 先判斷 `i % 15 == 0`（FizzBuzz），再判斷 `i % 3` 和 `i % 5`，最後才輸出數字
4. 或使用 `if-else if-else` 避免多個條件重複觸發

```java
for (int i = 1; i <= 50; i++) {
    if (i % 15 == 0)     System.out.print("FizzBuzz ");
    else if (i % 3 == 0) System.out.print("Fizz ");
    else if (i % 5 == 0) System.out.print("Buzz ");
    else                 System.out.print(i + " ");
}
```

<!--
逐步解說：用 `if-else if-else` 鏈來寫的時候，最嚴格的條件（同時滿足兩個條件，也就是被 15 整除）一定要放在最上面，否則它永遠會先被 `i % 3 == 0` 或 `i % 5 == 0` 擋下來，FizzBuzz 永遠不會被印出來。

⚠️ 易錯點提醒：判斷順序就是這題的關鍵，這跟我們在 ch05 學過的 `if-else if` 鏈「由嚴格到寬鬆」排列的原則是一樣的。

預期結果：跑完之後，輸出會是 `1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz ...`，總共會印到 50。
-->

---
layout: default
---

# 練習 9：數字金字塔
### 任務說明

使用巢狀迴圈印出以下圖形（n=5）：

```
1
1 2
1 2 3
1 2 3 4
1 2 3 4 5
```

**要求：** 以 `n` 為變數，可改變金字塔高度。

<!--
任務鋪陳：這一章的最後一個挑戰，要把「巢狀迴圈」拿出來用——回想一下我們在九九乘法表那一節學過的外層、內層迴圈結構，這裡的概念是一樣的，只是規則不太一樣。

引導思考：外層迴圈控制「第幾列」，內層迴圈控制「這一列要印幾個數字」。大家可以觀察一下，第幾列就要印幾個數字——這個規律要怎麼寫進內層迴圈的條件裡？
-->

---
layout: default
---

# 練習 9：解題提示
### 提示說明

1. 外層迴圈控制「列數」，從 1 到 n
2. 內層迴圈控制「每列印幾個數字」，從 1 到外層計數值
3. 每列結束後用 `System.out.println()` 換行

```java
int n = 5;
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print(j + " ");
    }
    System.out.println();
}
```

<!--
逐步解說：內層迴圈的終止條件 `j <= i` 是這題最關鍵的一行——因為內層每次都要跑到「跟外層計數值一樣」，所以第 1 列只印 1 個數字，第 2 列印 2 個，以此類推到第 5 列印 5 個。

帶讀關鍵行：別忘了每跑完一列內層迴圈後，要呼叫 `System.out.println()` 換行，否則所有數字會擠在同一行。

預期結果：印出五行由窄到寬的數字金字塔，跟題目給的圖形一致。這題也是這一章的綜合練習——同時用到了 `for` 迴圈、巢狀迴圈，以及累加計數的概念。
-->

---

# 總結

- **`for` 迴圈把初始化、條件、更新寫在同一行**，適合已知執行次數的情境；`for-each` 是走訪陣列/集合的精簡版，只能讀不能改
- **巢狀迴圈是「外層跑一次、內層跑一整輪」**，總次數是外層 × 內層，層數越多執行次數膨脹越快
- **`while` 先檢查條件再執行，最少 0 次**；**`do-while` 先執行再檢查，保證至少 1 次**，適合選單這類情境
- **無限迴圈（`while(true)`／`for(;;)`）一定要安排 `break` 出口**；`break` 整個跳出迴圈，`continue` 只跳過本次、迴圈繼續跑
- **`Scanner` 搭配 `hasNextInt()` 可以做輸入驗證**，過濾掉非預期格式的輸入，避免程式直接崩潰
- **累加、計數、找最大最小值是迴圈最常見的應用模式**，可以在同一個迴圈裡一次算完多個統計值
- **雞兔同籠示範「窮舉法」** — 不解聯立方程式，直接讓迴圈一個個試，往往比手推數學公式更直覺

<!--
我們把這一章整理成七個重點。

第一，for 迴圈把「從哪裡開始、跑到什麼時候停、每次怎麼前進」三件事寫在同一行，適合已經知道要跑幾次的情境；如果只是單純想把陣列或集合裡每個元素都看一遍，for-each 寫法更精簡，但要注意它只能讀取、不能修改，也拿不到索引。

第二，巢狀迴圈就是迴圈裡面再放一個迴圈，外層每跑一次，內層就要完整跑一輪，所以總執行次數是外層次數乘上內層次數，層數疊得越多，執行次數會用相乘的方式快速膨脹。

第三，while 是先檢查條件再執行，如果一開始條件就不成立，裡面的程式碼可能一次都不會跑；do-while 剛好相反，先執行一次再檢查條件，保證至少會執行一次，像顯示選單這種「至少要先讓使用者看到一次」的情境就很適合。

第四，如果想讓迴圈一直跑下去，可以用 while(true) 或 for(;;)，但一定要在裡面安排一個 break 出口，不然程式會卡死；break 是整個離開迴圈，continue 則是只跳過這一輪剩下的程式碼，迴圈本身還是會繼續跑下一輪。

第五，Scanner 搭配 hasNextInt() 可以在讀取之前先確認輸入格式對不對，格式不對就用 next() 丟棄並提示重新輸入，這種「輸入驗證」能讓程式不會因為使用者打錯格式就直接崩潰。

第六，累加、計數、找最大最小值是迴圈最常見的三種應用，而且這些統計值都可以放在同一個迴圈裡一次算完，不需要為每個項目各寫一個迴圈，這也是迴圈應用時很重要的效率概念。

第七，雞兔同籠這個經典題目，示範了「窮舉法」的威力——與其解聯立方程式，不如讓電腦從 0 開始一個個試，找到符合條件的答案就用 break 停下來。

這七點加起來，就是讓程式「重複做事」所需要的完整工具箱。下一章我們要進入陣列了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
今天這一章，我們學會了讓程式重複執行的三種方式：`for`、`while`、`do-while`，還學會用 `break` 跟 `continue` 控制迴圈的走向，最後也用迴圈解決了雞兔同籠這個經典問題。

迴圈是寫程式之後會一直用到的基本功，大家在課堂練習裡多寫幾次，很快就會習慣這些語法的節奏。如果對標籤（label）或其他數學專題有興趣，課後可以參考自學內容，多看看不同題型的迴圈寫法。

大家還有什麼問題嗎？
-->
