---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Java 語言基礎（進階／自學）
routeAlias: ch04
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
  <h1 style="color: #1a5c5c; font-size: 3.4rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">Java 語言基礎</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到 Ch 04 的自學區！基礎版我們已經學會了 printf 最常用的 %d、%s、%f、%n，足夠應付大部分的輸出需求了。但如果大家想讓輸出的格式更精緻、更專業，這裡還有一些進階技巧。

【為什麼要學這個？】
想像你在寫一份對外的報表，數字沒有對齊、千位數沒有逗號分隔、正負號也亂七八糟，看起來就很不專業。這些「進階旗標」就是讓你的輸出從「能看」進化到「好看」的關鍵。

【今天學完你會能做什麼】
學完這份自學內容，你就能控制欄位寬度、小數精確度、千分位、正負號，甚至左右對齊，做出真正像樣的文字報表。
-->

---
layout: default
---

# Outline

- **printf 寬度與精確度控制**
- **printf 格式化旗標速查**
- **String.format( ) — 格式化成字串**
- **補充：旗標組合範例**

<!--
【核心說明】
這份自學內容專注在一件事：把 printf 的格式字串玩出花樣。

【生活化比喻】
基礎版我們學的是「把東西放進對的格子裡」，進階版則是學「把格子排得整整齊齊、貼好標籤」。同樣是收納，但專業度差很多。每個主題都是疊加上去的小技巧，學完可以混搭使用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 進階
# printf 格式化輸出

<!--
【開場白】
我們在基礎版學過 printf 的基本轉換字元：%d、%f、%s、%c、%b、%n。接下來要學的是格式規範裡的「旗標」與「寬度／精確度」，讓輸出可以對齊、補零、加千分位。
-->

---

# 寬度與精確度控制

```java
// 寬度：最少佔幾個字元（預設右對齊）
System.out.printf("%10d%n", 123);    //        123（補空格至 10 格）
System.out.printf("%-10d|%n", 123);  // 123       |（-：左對齊）

// 精確度：小數點後幾位
System.out.printf("%.2f%n", 3.14159); // 3.14
System.out.printf("%8.2f%n", 3.14159); //     3.14（寬度 8 + 2 位小數）

// 補零
System.out.printf("%05d%n", 42);      // 00042
```

<!--
【核心說明】
格式規範語法是 `%[旗標][寬度][.精確度]轉換字元`，我們在基礎版只用了最後一個轉換字元，現在要把前面的「寬度」跟「精確度」也用上。

【生活化比喻】
「寬度」就像是訂了一個固定大小的格子，數字不夠長就用空格把它推到格子的最右邊（預設右對齊），這樣一列一列印出來時，數字才會對得齊。「精確度」則是告訴小數點「你只能帶幾個小跟班」，多的就四捨五入掉。

⚠️ 易錯點提醒：
%10d 跟 %-10d 差一個減號，結果卻完全相反——前者數字靠右、空格在左；後者數字靠左、空格在右。如果你的報表數字對不齊，第一個該檢查的就是這個減號。

【預期結果】
%10d 印出 123 時，前面會補 7 個空格湊到 10 格寬；%-10d 則是 123 後面補空格；%05d 則是用 0 取代空格補到 5 格，所以 42 會變成 00042。
-->

---

# 格式化旗標速查

| 旗標 | 說明 | 範例 |
| --- | --- | --- |
| `-` | 左對齊（預設右對齊）| `%-10s` |
| `0` | 以零填充（數字適用）| `%05d` |
| `+` | 強制顯示正負號 | `%+d` → `+100` |
| `,` | 千位分隔符 | `%,d` → `1,000,000` |
| `(` | 負數用括號表示 | `%(d` → `(100)` |

```java
System.out.printf("%,d%n", 1000000);  // 1,000,000
System.out.printf("%+.1f%n", 3.14);  // +3.1
```

<!--
【核心說明】
除了寬度跟精確度，printf 還支援好幾種「旗標」，可以再進一步美化輸出。這張表是查表用的，不用硬背，用到的時候回來翻就好。

【生活化比喻】
這些旗標就像是 Word 裡的排版工具：`-` 是「靠左對齊」，`0` 是「補零」讓數字看起來像票號或編號，`,` 是「插入千分位逗號」讓大數字一眼就能讀出位數，`+` 是「永遠顯示正負號」常用在財務報表，`(` 則是會計上常用的「負數用括號表示」習慣。

💼 業界實務：
千分位符號 `,` 真的是神器。印出 1,000,000 絕對比 1000000 讓老闆更願意付你薪水（因為他看得懂你有多少錢）。正負號旗標 `%+d` 則常用於財務報表，讓盈虧一眼分清楚。

【預期結果】
%,d 印 1000000 會變成 1,000,000；%+.1f 印 3.14 會變成 +3.1，正號被強制顯示出來。
-->

---

# String.format( ) — 格式化成字串

```java
String name = "炭治郎";
int score = 95;
double rate = 0.9876;

String report = String.format(
    "姓名：%-6s 分數：%3d 正確率：%.1f%%",
    name, score, rate * 100
);
System.out.println(report);
// 姓名：炭治郎   分數： 95 正確率：98.8%
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>printf vs String.format</b>：<code>printf</code> 直接印出；<code>String.format</code> 回傳格式化後的字串，可存入變數繼續使用（如記錄 log、傳給方法）。兩者使用完全相同的格式規則。
</div>

<!--
【核心說明】
我們學會了 printf 的進階格式語法後，會發現有時候我們不想「馬上印出來」，而是想把格式化好的文字存起來，這時候就要用 `String.format`。

【生活化比喻】
`printf` 就像是你直接對著大家大喊；`String.format` 則是把要說的話寫在小紙條上遞給別人，對方可以收起來、傳給別人，或之後再公開。在做系統日誌（logging）時，我們天天都在用它。

⚠️ 易錯點提醒：
範例裡的 `%-6s`（左對齊、寬度 6）跟 `%3d`（右對齊、寬度 3）就是我們剛剛學的進階旗標的組合應用。另外要注意 `%%` 才能印出一個真正的百分比符號 `%`，少打一個 `%` 會直接編譯錯誤。

【預期結果】
report 會是「姓名：炭治郎   分數： 95 正確率：98.8%」，姓名靠左補空格到 6 格寬，分數靠右補空格到 3 格寬，正確率取到小數點 1 位。
-->

---

# 補充：旗標組合範例

```java
double price = 1234.5;
int qty = -3;

System.out.printf("單價：%,10.2f%n", price);  //      1,234.50
System.out.printf("數量：%+5d%n", qty);       //    -3
System.out.printf("小計：%(,.2f%n", price * qty); // (3,703.50)
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>旗標可以一起用：</b>把寬度、精確度、千分位、正負號、括號旗標組合在同一個 <code>%</code> 規範裡，就能做出會計報表等級的輸出，不需要再用字串拼接或額外的判斷式。
</div>

<!--
【核心說明】
我們已經把寬度、精確度、千分位、正負號這些旗標都個別認識過了，現在來看看把它們「疊加」在一起的效果。

【生活化比喻】
這就像是化妝的疊加技巧：底妝（寬度）打好之後，再上腮紅（千分位）、畫眉毛（正負號），最後補個唇彩（括號）。每一層都是獨立的小步驟，但疊起來就是一個完整的妝容——也就是一份漂亮的報表。

⚠️ 易錯點提醒：
旗標的順序通常不影響結果，但 `%(,.2f` 這種寫法在某些情境下要特別注意：括號旗標 `(` 只對負數生效，正數不會被加上括號。如果忘記這點，看到正數金額時可能會懷疑自己的格式字串寫錯了。

【預期結果】
price * qty 是負數 -3703.5，搭配 `(,.2f` 會印成 `(3,703.50)`，括號代表負數，逗號是千分位；qty 是 -3，搭配 `+5d` 會印成「   -3」，補到 5 格寬並保留負號。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
古古前面帶大家把 printf 的寬度、精確度、千分位、正負號、括號這些旗標一個一個拆開來看，現在換大家把這些旗標組合起來，動手排出真正整齊的報表格式。
-->

---
layout: default
---

# 練習 1 (自學)：個人資料卡（進階格式）
### 任務說明

宣告以下變數，並用 `printf` 搭配寬度與精確度旗標整齊排版輸出：

| 資料 | 型態 | 值 |
| --- | --- | --- |
| 姓名 | `String` | 任意 |
| 年齡 | `int` | 任意 |
| 身高 | `double` | 任意（含小數）|
| 是否在學 | `boolean` | 任意 |

**預期格式（對齊欄位）：**

```
姓名：炭治郎
年齡：  16
身高：165.5 cm
在學：true
```

<!--
【任務鋪陳】
我們剛剛學了寬度、精確度跟對齊旗標，現在來實際應用一次。

【引導思考】
試著幫自己做一張數位名片。姓名、年齡、身高...別在身高上說謊喔，雖然 Java 不會拆穿你，但你的體檢表會。重點是：怎麼讓「年齡」這個數字跟其他欄位的冒號對齊？想想我們剛剛學的寬度旗標可以怎麼用。
-->

---

# 練習 1 (自學)：解題提示
### 提示說明

1. 宣告四個不同型態的變數並賦值
2. 用 `System.out.printf` 搭配以下格式化：
   - 年齡用 `%3d`（右對齊，至少 3 格，套用「寬度」旗標）
   - 身高用 `%.1f`（1 位小數，套用「精確度」旗標）
   - 在學用 `%b`

```java
System.out.printf("姓名：%s%n", name);
System.out.printf("年齡：%3d%n", age);
System.out.printf("身高：%.1f cm%n", height);
System.out.printf("在學：%b%n", isStudent);
```

<!--
【逐步解說】
注意每行末尾的 %n 用來換行。`%3d` 的妙用是它會幫年齡前面補空格，讓數字對齊——這就是我們剛學的「寬度」旗標在實際畫面上的效果。細節的力量，就是這樣一點一點累積出來的。
-->

---
layout: default
---

# 練習 2 (自學)：成績單格式化（進階格式）
### 任務說明

宣告三位學生的姓名和分數（用常數定義及格分數 60），並格式化輸出成績單：

**預期格式：**

```
===== 成績單 =====
姓名        分數  是否及格
炭治郎        95  ✓
禰豆子        72  ✓
善逸          58  ✗
==================
及格線：60 分
```

**挑戰：** 用 `static final` 定義及格線，讓程式碼更易維護。

<!--
【任務鋪陳】
這是本份自學內容的綜合挑戰：把常數、判斷式，跟我們剛學的進階格式旗標全部串起來。

【引導思考】
想像你是那個決定學生生死的大魔王老師，及格線 60 分。及格的給個「勾」，不及格的給個「叉」。重點來了：姓名長度不一樣（炭治郎、禰豆子都是 3 個字，善逸是 2 個字），要怎麼用 `%-6s` 這種左對齊旗標，讓後面的分數欄位仍然對得齊？
-->

---

# 練習 2 (自學)：解題提示
### 提示說明

1. 用 `static final int PASS_SCORE = 60` 定義及格線常數
2. 每位學生判斷 `score >= PASS_SCORE`，存入 boolean
3. 用 `printf` 格式化每一行，`%-6s` 讓姓名左對齊，`%3d` 讓分數右對齊

```java
static final int PASS_SCORE = 60;

String name1 = "炭治郎"; int score1 = 95;
boolean pass1 = score1 >= PASS_SCORE;

System.out.printf("%-6s %3d  %s%n",
    name1, score1, pass1 ? "✓" : "✗");
```

<!--
【逐步解說】
那個「勾」跟「叉」可以用字串處理，也可以用三元運算子來耍帥。`%-6s` 跟 `%3d` 就是我們在這份自學內容裡學到的左對齊與寬度旗標的實戰應用——學完這個練習，你已經能用 Java 寫出會計報表等級的文字輸出了！
-->

---
layout: end
---
