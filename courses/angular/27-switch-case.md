---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "@switch 條件切換"
routeAlias: ch27
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
    Angular Essentials
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    @switch 條件切換
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用 case 取代 else if，讓多條件判斷更清晰」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學了 `@if` 和 `@else if`。但如果分支很多，例如遊戲裡有戰士、法師、刺客、弓箭手、牧師等十幾種職業，用 `else if` 一路寫下去，程式碼會變得又長又難讀。

這一章，我們要學另一種條件判斷的寫法：`switch case`。它在 TypeScript 裡很好用，Angular 的 HTML 模板也有一個很相似的 `@switch` 語法。
-->

---
layout: default
---

# Outline

- **什麼是 switch case** — 條件判斷的另一種寫法，以 case 取代 else if
- **switch 語法結構** — switch、case、default、break 的組成
- **switch vs if 比較** — 兩種寫法的對照範例
- **case 與 break 說明** — case() 比對值、break 結束執行
- **switch 中使用運算式** — 在 switch() 內撰寫運算邏輯
- **@switch — HTML 模板語法** — Angular 模板中的 switch case 寫法

<!--
這一章會先介紹什麼是 `switch case`，以及 switch、case、default、break 這幾個組成部分。接著把 `switch` 和 `if` 放在一起比較。然後說明 `case` 和 `break` 的關係，以及在 `switch` 裡使用運算式。最後學習 HTML 模板裡的 `@switch`，並用一個練習收尾。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 switch case
# What is Switch Case

<!--
我們先來認識 `switch case` 的基本結構。
-->

---

# 什麼是 switch case？

`switch case` 與 `if` 同為條件判斷，差異在寫法：`if` 以 `else if` 處理多個分支，`switch` 改以 `case` 逐一比對。

```typescript
switch (變數名稱或運算式) {
  case 符合數字或字元:
    陳述句一;
    break;
  case 符合數字或字元:
    陳述句二;
    break;
  default:
    陳述句三;
    break;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>default</code> 相當於 if 中的 <code>else</code>，當所有 case 都不符合時執行。
</div>

<!--
`switch case` 和 `if` 一樣是條件判斷，差別在寫法：`if` 用 `else if` 處理多個分支，`switch` 則用 `case` 逐一比對。

我們可以把它想成自動販賣機。按 1 號按鈕掉出可樂，按 2 號掉出汽水，按了沒有設定的號碼，就顯示「請重新選擇」。

`switch` 的小括號裡放要判斷的變數，底下用一個個 `case` 比對它的值，符合的話就執行那個 `case` 底下的程式。最後的 `default`，相當於 `if` 裡的 `else`，當所有 `case` 都不符合時才執行。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# switch vs if 比較
# Switch vs If Comparison

<!--
兩種寫法都能做判斷，我們直接放在一起比較看看。
-->

---
layout: two-cols
---

# switch vs if 比較

以判斷值為 1 時打印 1、為 2 時打印 2、否則打印 other 為例，兩種寫法結果相同，語法不同。

**if 寫法（左）vs switch 寫法（右）**

::right::

```typescript
// if 寫法
if (this.testNum == 1) {
  console.log(1);
} else if (this.testNum == 2) {
  console.log(2);
} else {
  console.log('other');
}
```

```typescript
// switch 寫法
switch (this.testNum) {
  case(1):
    console.log(1);
    break;
  case(2):
    console.log(2);
    break;
  default:
    console.log('other');
    break;
}
```

<!--
這個範例的需求是：值為 1 時印出 1，值為 2 時印出 2，其他情況印出 other。

上面是 `if` 的寫法，用 `if`、`else if`、`else` 串起來。下面是 `switch` 的寫法，`switch` 小括號裡放 `testNum`，再用 `case(1)`、`case(2)` 和 `default` 分別處理。

分支一多，`switch` 的每個 `case` 都對齊排列，結構會比一長串 `else if` 更清楚。

你可能注意到，每個 `case` 最後都有一個 `break`。它的作用是什麼？我們接著來看。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# case 與 break 說明
# Case and Break

<!--
接下來，我們看 `switch` 裡最關鍵，也最容易忘記的指令：`break`。
-->

---
layout: two-cols
---

# switch 的 case 與 break

以 `this.testNum` 為判斷依據，`case(值)` 比對後執行對應程式。每個 `case` 結尾必須加 `break`，否則會繼續執行下一個 `case`（fall-through）。

::right::

```typescript
switch (this.testNum) {
  case(1):
    console.log(1);
    break;
  case(2):
    console.log(2);
    break;
  default:
    console.log('other');
    break;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 每個 case 結尾必須加上 <code>break</code>，否則程式會繼續往下執行下一個 case（fall-through）。
</div>

<!--
在 `switch` 裡，`break` 的意思是「結束這個 switch」。

每個 `case` 結尾都要加上 `break`。如果忘了加，例如 `case(1)` 底下沒有 `break`，當值是 1 的時候，程式執行完 `case(1)` 的內容，並不會停下來，而是繼續往下執行 `case(2)` 的內容，直到遇到下一個 `break`，或是整個 `switch` 結束。

這種情況叫做「穿透」，英文是 fall-through。它會讓程式執行了不該執行的內容，而且不容易發現。所以寫 `case` 時，要養成習慣，每個 `case` 寫完就立刻補上 `break`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# switch 中使用運算式
# Expression in Switch

<!--
`switch` 的小括號裡，除了放變數，也可以放運算式。
-->

---
layout: two-cols
---

# switch 中使用運算式

`switch()` 括號內可放入運算式，系統先計算結果再與各 `case` 比對。注意 `switch` 與 `if` 寫法差異，勿混淆符號。

::right::

```typescript
switch (this.testNum * 3) {
  case(1):
    console.log(1);
    break;
  case(2):
    console.log(2);
    break;
  default:
    console.log('other');
    break;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>switch()</code> 括號內可以放入運算式，例如 <code>this.testNum * 3</code>，系統會先計算結果再與各 case 值比對。
</div>

<!--
這裡 `switch` 的小括號裡放的是 `this.testNum` 乘以 3。

程式會先算出運算式的結果，再拿這個結果去和每個 `case` 比對。例如 `testNum` 是 2，乘以 3 等於 6，就會去找有沒有 `case` 是 6，這裡都沒有，所以會執行 `default`，印出 other。

所以小括號裡寫加減乘除這些運算都是可以的。要注意 `switch` 和 `if` 的寫法不同，`case` 後面放的是要比對的值，而不是條件式。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# @switch — HTML 模板語法
# Switch Case in Templates

<!--
剛才的 `switch` 寫在 TypeScript 裡。接下來看 HTML 模板裡很相似的 `@switch` 語法。
-->

---

# 什麼是 @switch？

`@switch` 是 Angular 模板中的多分支條件語法，效果等同於連續多個 `@if` / `@else if`，但比對單一變數的多種值時更簡潔，語法與 TypeScript 的 `switch` 相同。

```html
@switch (變數或運算式) {
  @case (值一) {
    <!-- 符合值一時顯示的內容 -->
  }
  @case (值二) {
    <!-- 符合值二時顯示的內容 -->
  }
  @default {
    <!-- 都不符合時顯示的內容 -->
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> @switch 是 Angular 17+ 引入的新語法，用來取代舊版的 <code>*ngSwitch</code>、<code>*ngSwitchCase</code>、<code>*ngSwitchDefault</code> 結構型指令。
</div>

<!--
`@switch` 是 Angular 模板裡的多分支條件語法，效果等於連續好幾個 `@if` 和 `@else if`，但在比對同一個變數的多種值時，寫起來更簡潔。

小括號裡放要判斷的變數，底下用 `@case` 加上小括號裡的值來比對，符合的話，大括號裡的 HTML 就會顯示出來。都不符合時，就顯示 `@default` 的內容。

跟 TypeScript 最大的差別是：`@switch` 不用寫 `break`。比對成功後 Angular 會自動停止，不會有穿透的問題。

`@switch` 取代了舊版的 `*ngSwitch` 寫法，在舊專案裡可能還會看到。
-->

---
layout: default
---

# @switch — 小節練習

請實作以下需求：

1. 宣告 `role: string = 'admin';`
2. 用 `@switch` / `@case` / `@default` 讓畫面依 `role` 顯示對應文字：
   - `'admin'` → `管理員`
   - `'editor'` → `編輯者`
   - 其他 → `一般會員`

<!--
我們用一個小練習熟悉 `@switch`。

請宣告 `role` 等於 admin，然後用 `@switch`、`@case` 和 `@default`，依照角色顯示對應的文字：admin 顯示管理員，editor 顯示編輯者，其他顯示一般會員。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# @switch — 小節練習解答

```typescript
role: string = 'admin';
```

```html
@switch (role) {
  @case ('admin') {
    <p>管理員</p>
  }
  @case ('editor') {
    <p>編輯者</p>
  }
  @default {
    <p>一般會員</p>
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>@case</code> 不用寫 <code>break</code>，比對成功就直接停止，不會有 TypeScript switch 的 fall-through 問題
</div>

<!--
我們來看答案。

`@switch` 小括號裡放 `role`，接著兩個 `@case`，分別比對 admin 和 editor，最後用 `@default` 顯示一般會員。注意比對的是字串，所以值要加上引號。

`@case` 不用寫 `break`。可以試著把 `role` 改成 editor 或其他文字，畫面會自動切換。跟 `@if` 一樣，沒有符合的區塊不會出現在 DOM 裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 章節總練習
# Chapter Practice

<!--
`switch case` 的重點都介紹完了，接下來我們做一個綜合練習。
-->

---
layout: default
---

# 練習：HTTP 狀態碼分類
### 任務說明

1. 宣告 `let statusCode = 404;`
2. `switch()` 括號內**必須放入運算式**，取出 `statusCode` 的百位數
3. 依百位數印出對應訊息：
   - `2` → `'請求成功'`
   - `4` → `'客戶端錯誤'`
   - `5` → `'伺服器錯誤'`
   - `default` → `'未知狀態'`
4. 每個 `case` 記得加上 `break`

<!--
這個練習要依照 HTTP 狀態碼，印出對應的分類。

請宣告 `statusCode` 等於 404。`switch` 的小括號裡要放一個運算式，取出狀態碼的百位數。百位數是 2，印出請求成功；是 4，印出客戶端錯誤；是 5，印出伺服器錯誤；其他就印出未知狀態。每個 `case` 都記得加上 `break`。

在實務上，像 404 這種 4 開頭的狀態碼，就屬於客戶端錯誤，這種依百位數分類的寫法很常見。

想一想，要怎麼從 404 算出 4？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：HTTP 狀態碼分類 解題提示
### 提示說明

1. 取百位數可以用除以 100 取整數（提示：`Math.floor()`）
2. `switch (Math.floor(statusCode / 100))` — 括號內就是運算式
3. `case` 要對應計算後的結果（`2`、`4`、`5`），不是原本的 `statusCode`
4. 別忘了每個 `case` 結尾加 `break`，否則會 fall-through 到下一個 case

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>Math.floor(404 / 100)</code> 結果為 <code>4</code>，switch 會先算出運算式的值，再拿這個值去比對各 case
</div>

<!--
我們來看解題提示。

取百位數，可以把狀態碼除以 100，再用 `Math.floor` 無條件捨去小數。404 除以 100 等於 4.04，捨去之後就是 4。

所以 `switch` 的小括號裡寫 `Math.floor(statusCode / 100)`，`case` 要比對的是計算後的結果，也就是 2、4、5，而不是原本的 404。最後別忘了每個 `case` 都要加上 `break`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充練習
# Extra Practice

<!--
接下來是幾題補充練習，把這一章學到的內容再動手練一次。
-->

---
layout: default
---

# 補充練習 1–2：switch 基本配對

**練習 1：星期看板（數字比對）**

宣告 `let day: number = 3;`，撰寫 `switch (day)`：

- `case 1`：印出 `'星期一：認真上課'`
- `case 3`：印出 `'星期三：期中進度追蹤'`
- `default`：印出 `'其他日子：持續寫程式'`

**練習 2：會員折扣（字串比對）**

宣告 `let role: string = 'VIP';`，撰寫 `switch (role)`：

- `'VIP'`：`alert('尊榮貴賓：享全面 8 折！')`
- `'Member'`：`alert('一般會員：享全面 9 折！')`
- `default`：`alert('訪客：維持原價。')`

<!--
接下來兩題補充練習，練習在 TS 裡寫 switch。

第一題比對數字，依照星期幾印出不同的訊息。第二題比對字串，依照會員等級跳出不同的折扣。

記得每個分支都要加上 `break`。我們先暫停一下，自己動手試試看。
-->

---
zoom: 0.88
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
let day: number = 3;

switch (day) {
  case 1:
    console.log('星期一：認真上課');
    break;
  case 3:
    console.log('星期三：期中進度追蹤');
    break;
  default:
    console.log('其他日子：持續寫程式');
}
```

```typescript
let role: string = 'VIP';

switch (role) {
  case 'VIP':
    alert('尊榮貴賓：享全面 8 折！');
    break;
  case 'Member':
    alert('一般會員：享全面 9 折！');
    break;
  default:
    alert('訪客：維持原價。');
}
```

<!--
我們來看答案。

兩題的結構完全一樣，只是比對的值一個是數字、一個是字串。字串比對要注意大小寫，`'vip'` 和 `'VIP'` 會被當成不同的值。

`default` 是最後一個分支，後面沒有其他分支了，所以不寫 `break` 也可以。
-->

---
layout: default
---

# 補充練習 3：故意漏寫 break

親手體驗 `break` 的重要性：

1. 宣告 `let code: number = 1;`
2. 撰寫 `switch (code)`
3. 在 `case 1:` 寫入 `console.log('執行分支 1');`，**故意不寫 `break;`**
4. 在 `case 2:` 寫入 `console.log('執行分支 2');`，正常補上 `break;`
5. 執行程式，觀察 Console：明明 `code` 只有 1，為什麼分支 2 的訊息也印出來了？

<!--
第三題補充練習，是一個除錯實驗。

請故意在 `case 1` 漏掉 `break`，然後觀察 Console 印出了什麼。明明 `code` 是 1，結果會讓你很意外。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：故意漏寫 break — 參考答案

```typescript
let code: number = 1;

switch (code) {
  case 1:
    console.log('執行分支 1');
    // 忘記寫 break！
  case 2:
    console.log('執行分支 2');
    break;
}
// Console 輸出：
// 執行分支 1
// 執行分支 2   ← 不該出現卻出現了
```

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 這個現象叫做<b>貫穿（fall-through）</b>：沒有 <code>break</code>，程式會一路往下執行下一個 case，直到遇到 <code>break</code> 或 switch 結束
</div>

<!--
我們來看答案。

`code` 是 1，所以從 `case 1` 開始執行。但 `case 1` 沒有 `break`，程式不會跳出 switch，而是繼續往下，把 `case 2` 的內容也執行了，直到遇到 `break` 才停。

這種現象叫做貫穿。它不會報錯，所以很難發現，養成每個 case 都寫 `break` 的習慣，就能避免這種問題。
-->

---
layout: end
---

# 課程結束
### 熟悉 TypeScript switch 與 Angular @switch，讓多條件判斷更整潔易讀

<!--
這一章我們學了 `switch case`。它用 `case` 逐一比對值，`default` 處理都不符合的情況。在 TypeScript 裡，每個 `case` 結尾都要加 `break`，否則會穿透到下一個 `case`。小括號裡也可以放運算式，先算出結果再比對。在 HTML 模板裡則用 `@switch`、`@case` 和 `@default`，而且不用寫 `break`。

下一章，我們要學習串接 API，從遠端伺服器取得真實的資料。我們下一章見。
-->
