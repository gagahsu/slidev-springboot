---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 程式流程控制（進階／自學）
routeAlias: ch06
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
  <h1 style="color: #1a5c5c; font-size: 3.4rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">程式流程控制</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">進階自學內容</p>
  <Link to="home" style="color:#9dc4c4;font-size:0.85rem;margin-top:2rem;text-decoration:none;letter-spacing:0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到流程控制的進階篇！基礎課已經學過 Switch Expression（箭頭語法），今天要在這個基礎上再加兩招。

【為什麼要學這個？】
Switch Expression 只是開胃菜，接下來這兩招才是真正讓 switch 變聰明的關鍵：讓它看穿物件的真實型別（Pattern Matching），再用 sealed 把所有可能性「鎖死」，讓編譯器幫你把關（Sealed Class）。

【今天學完你會能做什麼】
學完這份自學內容，你會看得懂、也寫得出近年企業專案中常見的現代化 switch 寫法，並且理解為什麼 Java 要演化出這些語法。這在面試或閱讀新版原始碼時，都會是你的加分項。
-->

---
layout: default
---

# Outline

- **複習：Switch Expression**（基礎課已學過，這裡快速回顧）
- **Pattern Matching for switch**：型別比對、條件守衛、`case null`
- **Sealed Class 搭配 switch**：`sealed` 介面與完整型別覆蓋
- **練習題**：2 題（分類任意物件、綜合應用，各含任務說明 + 解題提示）

<!--
【核心說明】
這份自學內容，是在 Switch Expression 之上再疊加兩個進化階段：switch 怎麼從「只能比對值」一步步變成「智慧分類員」。

【生活化比喻】
先讓 switch 能看穿物件的真實型別（Pattern Matching），最後再用 sealed 把所有可能性「鎖死」，讓編譯器幫你把關（Sealed Class）。兩者環環相扣，建議依序往下學。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Pattern Matching for switch

<!--
【開場白】
箭頭語法只是開胃菜，接下來這招才是真正的大絕招：讓 switch 看穿物件的「真實身分」。
-->

---
layout: default
---

# Pattern Matching for switch（JDK 21 正式標準）

Java 17 首次引入 switch 型別模式比對（JEP 406，當時是預覽功能），JDK 21 起（JEP 441）成為正式標準語法：

| 語法 | 說明 |
| --- | --- |
| `case Integer i ->` | 比對型別並自動綁定變數 `i` |
| `case String s ->` | 比對型別並自動綁定變數 `s` |
| `case String s when s.length() > 0 ->` | 加條件守衛（guarded pattern）|
| `case null ->` | 明確處理 null 值，不再拋 NPE |

<!--
【核心說明】
這是 Java 17 的「大絕招」，它讓 switch 變成了「超能力者」。

【生活化比喻】
以前 switch 只能比數字或字串，現在它能看透物件的本質。「你是一個整數嗎？」、「你是一個空字串嗎？」。這讓程式碼看起來像是在跟電腦直接對話。

💼 業界實務：
這種寫法在處理「一個方法可能收到多種型別參數」的情境（例如解析 JSON、處理事件物件）時非常實用，能取代一長串的 `instanceof` 判斷。
-->

---

# Pattern Matching for switch — 範例

```java
static String describe(Object o) {
    return switch (o) {
        case Integer i -> "整數：" + i;
        case String s when s.isEmpty() -> "空字串";
        case String s -> "字串：" + s;
        case null     -> "null 值";
        default       -> "其他型別";
    };
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Java 版本說明：</b>Pattern Matching for switch 在 Java 17 為預覽版，Java 21 起成為正式標準語法，不需要再加 <code>--enable-preview</code> 編譯旗標。本課程以 JDK 21 為主，可直接使用。
</div>

<!--
【範例目的】
這個範例示範同一個 switch 如何依「型別」分流，而不只是依「值」分流。

【帶讀關鍵行】
看 `case Integer i -> "整數：" + i;`。這行不但判斷 o 是不是整數，還順便幫它取了名字叫 i，後面可以直接拿來用。還有那個 `when` 條件守衛，就像是門口的保全不但看證件，還要檢查你有沒有戴口罩。

⚠️ 易錯點提醒：
`case String s when s.isEmpty()` 一定要寫在 `case String s ->` 前面。switch 是依序比對，順序顛倒的話，空字串永遠會先被一般的 String 分支接走。

【預期結果】
如果傳入空字串 ""，會印出「空字串」；傳入 100，會印出「整數：100」；傳入 null，會印出「null 值」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
Pattern Matching for switch 學完了，別急著翻到下一節，先動手把型別比對、條件守衛跟 null 分支這幾招兜在一起寫寫看，這樣等等接觸 Sealed Class 的時候，才會更有感覺。
-->

---
layout: default
---

# 練習 1：分類任意物件
### 任務說明

請撰寫一個方法 `static String classify(Object o)`，使用 **Pattern Matching for switch** 依照傳入物件的型別與內容，回傳對應的分類字串：

| 傳入內容 | 回傳結果 |
| --- | --- |
| `Integer`，數值 `>= 0` | `"正整數或零：" + 數值` |
| `Integer`，數值 `< 0` | `"負整數：" + 數值` |
| `String`，空字串 | `"空字串"` |
| `String`，非空 | `"字串：" + 內容` |
| `null` | `"null 值"` |
| 其他型別 | `"其他型別"` |

**輸入範例：** `classify(-5)`
**輸出範例：** `負整數：-5`

<!--
【任務鋪陳】
剛才學了 `case Integer i ->` 可以比對型別並取名字，`when` 可以加條件守衛，`case null ->` 可以處理 null。這個練習要把這三個元素全部用上，做一個更完整的物件分類器。

【問題引導】
想一想：`Integer` 要拆成「正整數或零」跟「負整數」兩種情況，這要怎麼用 `when` 來區分？另外，`case null ->` 跟 `default ->` 的順序有沒有限制？哪一個應該放在前面？
-->

---
layout: default
---

# 練習 1：解題提示

### 提示說明

1. `Integer` 的兩種情況用 `when` 區分：`case Integer i when i >= 0 ->` 和 `case Integer i ->`（剩下的自然就是負數）
2. `String` 的兩種情況一樣用 `when`：`case String s when s.isEmpty() ->` 要寫在一般 `String s ->` 前面
3. `case null ->` 通常會放在所有型別判斷之前或之後皆可，但要確保它有被寫到，否則傳入 `null` 會丟出 `NullPointerException`

```java
static String classify(Object o) {
    return switch (o) {
        case null -> "null 值";
        case Integer i when i >= 0 -> "正整數或零：" + i;
        case Integer i -> "負整數：" + i;
        case String s when s.isEmpty() -> "空字串";
        case String s -> "字串：" + s;
        default -> "其他型別";
    };
}
```

<!--
【逐步解說】
這個練習的結構跟上一頁的範例幾乎一樣，只是把 `Integer` 多拆成了兩種情況。重點看 `case Integer i when i >= 0 ->` 跟緊接著的 `case Integer i ->`：第一個分支用 `when` 攔走了「大於等於 0」的整數，剩下沒被攔走的 `Integer`，自然就是負數，所以第二個分支不需要再寫 `when`。

⚠️ 易錯點提醒：
`case null ->` 一定要明確寫出來。如果漏掉，傳入 `null` 時 switch 會直接拋出 `NullPointerException`，這正是 Java 17 這個新語法想解決的問題——把 `null` 也變成一個可以被明確處理的「分支」，而不是讓它變成一個隱藏的地雷。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Sealed Class 搭配 switch

<!--
【開場白】
接下來這招，是把前面 Pattern Matching 再加上一個「保險裝置」：sealed class。
-->

---
layout: default
---

# Sealed Class 搭配 switch（Java 17）

`sealed` 類別限制繼承範圍，配合 switch 可達到完整型別覆蓋：

```java
sealed interface Shape permits Circle, Rectangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double w, double h) implements Shape {}

static double area(Shape s) {
    return switch (s) {
        case Circle c    -> Math.PI * c.radius() * c.radius();
        case Rectangle r -> r.w() * r.h();
    };
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>優點：</b>編譯器知道 sealed 類別的所有子型別，能在編譯期檢查是否漏掉某個 case，不需要 default。
</div>

<!--
【核心說明】
這是 Java 為了追求「安全」而設計的。

【生活化比喻】
如果你有一間只准進「圓形」和「方形」的房間，那 switch 就只需要處理這兩種可能。如果你漏寫了，編譯器會咆哮：「那個三角形怎麼辦？」。這讓你的程式碼像鋼鐵一樣堅固。

💼 業界實務：
`sealed` + `record` + Pattern Matching for switch 是 Java 近年主推的組合，常用在表示「有限種可能性」的資料模型，例如表示一個請求的處理結果只會是「成功」、「失敗」或「逾時」三種狀態。
-->

---
layout: default
---

# 練習 2 (綜合)：包裹運費試算器
### 任務說明

請設計一個依「包裹型態」與「重量」計算運費的程式，綜合運用本份自學的三個概念：

1. 定義 `sealed interface Package permits Document, Box`，`Document(double weight)` 與 `Box(double weight, boolean fragile)` 兩個 `record`。
2. 撰寫 `calcFee(Package p)`，用 **Pattern Matching for switch** 依型別計算運費：
   - `Document`：每公斤 20 元
   - `Box`（易碎 `fragile = true`）：每公斤 50 元
   - `Box`（不易碎）：每公斤 35 元
3. 用 **Switch Expression** 搭配 `yield` 計算結果（運費需四捨五入到整數）。

**輸入範例：** `new Box(3.0, true)`  
**輸出範例：** `運費：150 元`

<!--
【任務鋪陳】
我們從 Switch Expression 開始，學到了 Pattern Matching，最後又認識了 Sealed Class。這題就是要把三者串成一條線：用 sealed 鎖住型別範圍，再用 Pattern Matching 依型別與條件分流，最後用 Switch Expression 算出結果。

【問題引導】
想一想：為什麼這裡用 `sealed interface` 而不是一般的 `interface`？如果之後有人想新增一個 `Pallet`（棧板）型別卻忘了在 `calcFee` 裡處理，sealed 加上 switch 的完整性檢查會怎麼幫你抓到這個漏洞？
-->

---
layout: default
---

# 練習 2 (綜合)：解題提示

### 提示說明

1. `Box` 需要在 `case` 中加 `when fragile` 條件守衛來區分易碎與否。
2. 易碎判斷要寫在前面，否則一般 `Box` 的 case 會先比對成功。
3. 最後用 `Math.round(...)` 處理四捨五入，再用 `yield` 回傳 `long`／`int`。

```java
static int calcFee(Package p) {
    return switch (p) {
        case Document d -> (int) Math.round(d.weight() * 20);
        case Box b when b.fragile() -> {
            yield (int) Math.round(b.weight() * 50);
        }
        case Box b -> (int) Math.round(b.weight() * 35);
    };
}
```

<!--
【逐步解說】
看 `case Box b when b.fragile() ->`，這就是把 Pattern Matching 的型別比對跟條件守衛結合在一起。因為 `Document` 跟 `Box` 是 `Shape` 的所有子型別（sealed 限定），所以這裡不需要寫 `default`，編譯器會自己確認所有情況都覆蓋到了。
-->

---
layout: end
---

# Q & A

<!--
【開場白】
這份自學內容在基礎課的 Switch Expression 之上，帶大家看完了 switch 的「進化二部曲」：從能看穿型別的 Pattern Matching，到用 sealed 把可能性鎖死的安全寫法。

如果在自學過程中遇到 `--enable-preview` 編譯不起來，或是 `yield` 跟 `case` 語法搞混了，都可以記錄下來，下次上課時提出來討論。
-->
