---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 包裝類別 (Wrapper Classes)（進階／自學）
routeAlias: ch20
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
    包裝類別
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到包裝類別的進階自學篇！基礎版我們已經搞懂了「為什麼 int 需要穿上 Integer 的外衣」，這裡要再加碼兩個實務上很好用的延伸主題。

【為什麼要學這個？】
想像我們在處理電腦底層的資料（顏色碼、權限位元、IP 位址），或是寫一個能同時接受 `int`、`double` 的通用工具方法，這時候只懂 `int` 跟 `Integer` 就不太夠用了。

【學習目標】
學完這份內容後，我們就能用 Integer 內建的工具把數字在二、八、十六進位之間自由轉換，也能用 `Number` 這個共同父類別寫出「一個方法接所有數值型別」的通用程式碼。
-->

---
layout: default
---

# Outline

- **進位轉換方法** — 十進位與二／八／十六進位互轉
- **Number 抽象父類別** — 數值型包裝類別的共同祖先
- **實作練習**

<!--
【帶讀大綱】
這份自學內容只有兩個主題：第一個是「進位轉換」，讓我們可以把數字在十進位、二進位、八進位、十六進位之間轉來轉去；第二個是「Number 抽象父類別」，讓我們認識所有數值包裝類別背後的共同祖先。

【重點預告】
進位轉換在電腦概論、資安、網路設定（IP 位址、子網遮罩）裡很常見；Number 父類別則能幫我們寫出更通用、不挑型別的方法。這兩個都不是寫出基本程式的必要條件，但學會之後會讓我們的工具箱更完整。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 進位轉換方法

<!--
【段落轉換】
我們先來看第一個進階主題：數字在不同「進位制」之間怎麼轉換。
-->

---
layout: default
---

# 進位轉換方法

| 方法名稱 | 說明 |
| --- | --- |
| `Integer.toBinaryString(int i)` | 轉換成二進位字串 |
| `Integer.toOctalString(int i)` | 轉換成八進位字串 |
| `Integer.toHexString(int i)` | 轉換成十六進位字串 |
| `Integer.toString(int i, int radix)` | 轉換成任意進位（2~36）字串 |
| `Integer.parseInt(String s, int radix)` | 將指定進位的字串轉為十進位 |

<!--
【情境切入】
想像我們在做一個跟「顏色」或「網路」有關的小工具：螢幕上的顏色用 `#ff9900` 表示，IP 位址在某些設定畫面要看二進位。這些都不是十進位，但我們平常算數學用的明明都是十進位，這時候該怎麼辦？

【概念定義】
「進位轉換方法就是讓十進位的 `int` 跟其他進位制（二、八、十六，甚至任意 2~36 進位）的字串互相轉換」，這些方法全部都放在 `Integer` 類別裡，是 `static` 方法。

【生活化比喻】
這就像是貨幣兌換機：你手上是「台幣」（十進位），但有些地方只收「美金」或「日幣」（二進位、十六進位）。`toBinaryString`、`toHexString` 就是把台幣換成美金、日幣的兌換機，`parseInt(s, radix)` 則是反過來，把外幣換回台幣。

【程式世界怎麼用】
`toBinaryString`、`toOctalString`、`toHexString` 是 `toString(i, radix)` 的「快捷鍵」，分別對應 2、8、16 進位；如果要轉換成其他進位（例如 36 進位），就要用通用版的 `toString(int i, int radix)`。
-->

---
layout: default
---

# 進位轉換 — 範例

```java
int power = 255;

System.out.println(Integer.toBinaryString(power)); // 11111111
System.out.println(Integer.toOctalString(power));  // 377
System.out.println(Integer.toHexString(power));    // ff
System.out.println(Integer.toString(power, 16));    // ff（通用版寫法）

// 二進位字串 "11111111" 轉回十進位
System.out.println(Integer.parseInt("11111111", 2)); // 255
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>易錯點：</b> <code>parseInt(s, radix)</code> 的第二個參數是「字串原本的進位」，不是「要轉成的進位」，方向別搞反了。
</div>

<!--
【範例目的】
255 是一個很有代表性的數字：在二進位剛好是 8 個 1，在十六進位剛好是 `ff`，很適合拿來驗證轉換結果。

【帶讀關鍵行】
前三行示範「快捷鍵」寫法；第四行 `Integer.toString(power, 16)` 是通用版寫法，結果跟 `toHexString` 一樣，但可以指定任意進位。最後一行示範「反向操作」：把二進位字串轉回十進位 `int`。

⚠️ 易錯點提醒：
`Integer.parseInt("11111111", 2)` 裡的 `2` 是說「這個字串是二進位字串」，回傳的結果一定是十進位的 `int`。如果把這個 `2` 寫成想要轉換的目標進位，會得到完全錯誤的數字。

【程式世界怎麼用】
RGB 顏色碼、IP 位址、檔案權限（像 Linux 的 `chmod 755`）這些都常用到二進位或十六進位，學會這組方法之後，這些場景都能直接套用。

【預期結果】
```
11111111
377
ff
ff
255
```
-->

---
layout: default
---

# 練習 1：進位制轉換器
### 任務說明

讓使用者輸入一個十進位整數，印出它的二進位、八進位、十六進位，以及「36 進位」的表示。

- 輸入：`255`
- 輸出：
  - 二進位：`11111111`
  - 八進位：`377`
  - 十六進位：`ff`
  - 36 進位：`73`

<!--
【任務鋪陳】
基礎版我們已經練過二、八、十六進位的轉換，這次再加一個「冷門」的 36 進位，看看通用版的 `toString(i, radix)` 怎麼用。

【引導思考】
36 進位沒有專屬的快捷方法（不像 `toHexString`），這時候該用哪一個方法？想一想 `toBinaryString`、`toOctalString`、`toHexString` 三個方法的共同來源是什麼。
-->

---
layout: default
---

# 練習 1：解題提示
### 提示說明

1. 使用 `Integer.parseInt()` 讀取輸入的十進位字串。
2. 呼叫 `Integer.toBinaryString()`、`Integer.toOctalString()`、`Integer.toHexString()`。
3. 36 進位沒有專屬方法，改用通用版 `Integer.toString(255, 36)`。

<!--
【帶讀解法】
前三個是「快捷鍵」，直接呼叫就好；第四個因為沒有快捷鍵，所以要用所有快捷鍵背後共用的通用版方法 `toString(int i, int radix)`，把 `radix` 帶成 `36`。

💼 業界實務：
36 進位可以用 0-9 加上 a-z 共 36 個字元表示數字，常用在「短網址」這類需要把大數字壓縮成短字串的場景。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Number 抽象父類別

<!--
【段落轉換】
接下來我們要認識所有數值型包裝類別背後，有一個共同的「老祖宗」。
-->

---
layout: default
---

# Number 抽象父類別的方法

`Number` 是 `Integer`、`Double`、`Float`、`Long` 等數值型別的共同父類別：

| 方法名稱 | 種類 | 說明 |
| --- | --- | --- |
| `intValue()` | 抽象方法 | 轉換成 `int`（可能截斷或精度損失）|
| `longValue()` | 抽象方法 | 轉換成 `long` |
| `doubleValue()` | 抽象方法 | 轉換成 `double` |
| `floatValue()` | 抽象方法 | 轉換成 `float` |
| `byteValue()` / `shortValue()` | 具體方法（有預設實作） | 內部呼叫 `intValue()` 再轉型，轉換成 `byte` / `short` |

<!--
【情境切入】
想像我們要寫一個「計算總分」的方法，但分數有時候是 `Integer`（整數題），有時候是 `Double`（有小數的題目）。如果分別寫兩個方法，一個收 `Integer` 一個收 `Double`，會發現程式邏輯幾乎一樣，只是型別不同。

【概念定義】
`Number` 是一個 `abstract class`，「定義了一組把『任意數值型包裝類別』轉成各種基本數值型態的方法」。`Integer`、`Double`、`Float`、`Long` 等通通是它的子類別，全部都繼承並實作了這幾個方法。

【生活化比喻】
這就像所有的「飲料」都繼承自「容器」這個概念：不管裡面裝的是珍奶還是黑咖啡，「容器」都規定要有「倒出來」這個動作。`Number` 規定的就是「倒出來會變成什麼型態」：可以倒成 `int`、`double`、`long`……至於倒出來的內容對不對，要看原本裝的是什麼。

【程式世界怎麼用】
如果我們寫一個方法，參數型別宣告為 `Number`，那 `Integer`、`Double`、`Float`、`Long` 的值都可以傳進來，方法裡再呼叫 `intValue()`、`doubleValue()` 等方法統一處理，不用為每種型別各寫一份。
-->

---
layout: default
---

# Number 抽象父類別 — 範例

```java
Number n1 = Integer.valueOf(42);
Number n2 = Double.valueOf(3.14);

System.out.println(n1.intValue());    // 42
System.out.println(n2.doubleValue()); // 3.14
System.out.println(n2.intValue());    // 3 (截斷小數)

// 一個方法同時接受 Integer 和 Double
printAsInt(n1);
printAsInt(n2);
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>printAsInt(Number n)</code> 可以同時接受 <code>Integer</code> 和 <code>Double</code>，方法內呼叫 <code>n.intValue()</code> 即可，不需要為每種型別各寫一份。
</div>

<!--
【範例目的】
這個範例示範「一個變數型別 `Number`，可以裝下不同的數值包裝類別」，以及呼叫共同方法時的結果差異。

【帶讀關鍵行】
`n1`、`n2` 的宣告型別都是 `Number`，但實際存放的是 `Integer` 跟 `Double` 的物件；呼叫 `intValue()`、`doubleValue()` 時，會依照「實際存放的物件」去執行對應的轉換。

⚠️ 易錯點提醒：
`n2.intValue()` 回傳 `3`，不是 `3.14`，也不是四捨五入的 `3`——`intValue()` 是直接「砍掉小數點後面」，跟 `Math.round` 不一樣，這點很容易搞混。

【預期結果】
```
42
3.14
3
```
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
進位轉換、Number 共同父類別都學完了，最後用兩個練習把這份自學內容串起來。
-->

---
layout: default
---

# 練習 2：成績統計小工具
### 任務說明

寫一個方法 `printScore(Number score)`，可以同時接受 `Integer` 和 `Double` 兩種型別的分數，並印出：

- `"成績："` + 原始值
- `"取整數後："` + `intValue()` 的結果

呼叫範例：
```java
printScore(Integer.valueOf(88));   // 成績：88　取整數後：88
printScore(Double.valueOf(92.5));  // 成績：92.5　取整數後：92
```

<!--
【任務鋪陳】
剛才學到 `Number` 可以「一個方法接所有數值型別」，這次來實際寫一個小工具，體驗一下這種通用寫法的方便之處。

【引導思考】
如果不用 `Number`，而是寫兩個多載方法 `printScore(Integer)` 跟 `printScore(Double)`，程式碼會有什麼問題？想一想「重複」這兩個字。
-->

---
layout: default
---

# 練習 2：解題提示
### 提示說明

1. 方法簽章寫成 `static void printScore(Number score)`。
2. 用 `score` 直接印出原始值（呼叫 `toString()` 或直接 `println(score)`）。
3. 用 `score.intValue()` 印出取整數後的結果。
4. 呼叫時分別傳入 `Integer.valueOf(88)` 與 `Double.valueOf(92.5)`，觀察 `intValue()` 的結果差異。

<!--
【帶讀解法】
重點就是「只寫一個方法，型別宣告成 `Number`」。不管外面傳進來的是 `Integer` 還是 `Double`，方法裡都用一樣的方式呼叫 `intValue()`，這就是 `Number` 這個共同父類別帶來的好處。

💼 業界實務：
這種「用共同父類別接收多種子類別」的寫法，在統計、報表類的程式中很常見，可以大幅減少重複的多載方法。
-->

---
layout: default
---

# 練習 3 (綜合)：權限碼轉換器
### 任務說明

某系統用十進位數字代表使用者權限（例如 `Linux chmod` 概念），請完成：

1. 讓使用者輸入一個十進位整數（0~511），轉換成二進位字串印出
2. 寫一個方法 `Number toScore(String binary)`，將二進位字串轉回 `Integer`，回傳型別宣告為 `Number`
3. 印出 `toScore(...)` 回傳值的 `intValue()`

**預期輸出（輸入 `493`）：**
```
二進位：111101101
還原後：493
```

<!--
【任務鋪陳】
這份自學內容學了兩招：進位轉換、以及用 `Number` 寫通用方法。這次我們把兩招合體，做一個簡化版的「權限碼轉換器」。

【引導思考】
第一步是「十進位 → 二進位」，第二步是「二進位 → 十進位，但回傳型別是 `Number`」。想一想，第二步要用哪個 `Integer` 方法把字串轉回數字，再用什麼方式包裝成 `Number`？
-->

---
layout: default
---

# 練習 3 (綜合)：解題提示
### 提示說明

1. 第一步用 `Integer.toBinaryString(input)` 轉成二進位字串。
2. `toScore(String binary)` 內部用 `Integer.parseInt(binary, 2)` 把二進位字串轉回十進位 `int`。
3. 用 `Integer.valueOf(...)` 把 `int` 包裝成 `Integer`，因為 `Integer` 是 `Number` 的子類別，可以直接 `return`。
4. 呼叫端用 `toScore(binaryStr).intValue()` 取出最終的 `int` 結果。

<!--
【帶讀解法】
整題串起來看：`toBinaryString` 負責「進位轉換」，`toScore` 的回傳型別 `Number` 負責示範「共同父類別」的彈性——即使內部回傳的是 `Integer`，呼叫端依然可以用 `Number` 的 `intValue()` 拿到結果。

⚠️ 易錯點提醒：
`Integer.parseInt(binary, 2)` 的 `2` 代表「輸入的字串是二進位」，別跟 `toScore` 回傳值的型別搞混——兩者是完全不同的概念。
-->

---
layout: end
---

# 課程結束
### 感謝聆聽，有問題請發問！

<!--
[收尾]
這份自學內容到這裡就結束了！我們學會了用 `Integer` 的進位轉換方法在十進位、二進位、八進位、十六進位（甚至任意進位）之間自由切換，也認識了 `Number` 這個數值包裝類別的共同祖先，學會寫出「一個方法接所有數值型別」的通用程式碼。之後遇到顏色碼、權限碼或需要通用數值處理的場景，記得回來看看這份投影片。
-->
