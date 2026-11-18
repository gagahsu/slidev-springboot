---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 資料排序
routeAlias: ch30
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
    資料排序
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用 sort() 讓資料依你的規則整齊排列」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們用 interface 定義了資料的形狀。這一章，我們要處理另一個常見的需求：資料排序。

後端回傳的資料，順序不一定符合畫面的需求。直接拿去顯示，順序可能亂七八糟，使用起來很不方便。

學完這一章，我們會用陣列的 `sort()` 方法，依照數字或文字欄位把資料排好，並且能切換不同的排序依據。
-->

---
layout: default
---

# Outline

- **資料排序概念** — 為什麼需要在前端排序資料
- **未排序的問題** — 資料順序不符預期的情況
- **sort() 基本用法** — 使用陣列 sort() 方法排序
- **排序邏輯說明** — return -1 / 1 / 0 的意義
- **排序結果** — 排序後的資料呈現
- **切換排序欄位** — 依不同欄位（name、weight 等）排序
- **練習** — 將資料依重量排序並打印

<!--
這一章會先說明為什麼需要在前端排序，看一個沒有排序的實際例子。接著介紹 `sort()` 的用法，以及它背後的比較邏輯，也就是回傳負一、一和零代表什麼。然後看排序後的結果，學習切換排序的欄位。最後用一個練習把觀念串起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 資料排序概念
# Data Sorting

<!--
後端資料是依照資料庫的順序回傳的，不一定是畫面想要的順序。我們來看看怎麼處理。
-->

---

# 資料排序

後端回傳的資料順序不一定符合畫面需求，需在前端渲染前先行排序。

排序通常會需要一個值，可能是數字（id）或者文字：

- **數字**：由小到大或者由大到小
- **文字**：判斷第一個文字由 A > Z 或者 Z > A
- **中文**：無法直接排序，除非自己寫額外的方法去做排序跟判斷

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 中文排序需要自行實作額外的比對方法，JavaScript 預設的 sort() 無法正確處理中文字串順序。
</div>

<!--
排序就像排隊，不管是依照身高還是號碼牌，一定要有一個「依據」，才知道誰站前面、誰站後面。資料排序也一樣，要先選一個欄位當作依據。

常見的依據有兩種。數字，例如 id 或年齡，可以由小到大或由大到小排列。文字，例如英文名稱，可以依照字母順序，從 A 到 Z，或反過來排列。

這裡要特別注意中文。中文字不是依照筆畫或注音的順序編碼的，所以 JavaScript 預設的 `sort()` 沒辦法正確排出筆畫或注音的順序。如果真的要排中文，需要另外寫比對的方法。
-->

---

# 未排序的問題

以下資料未排序，直接用 `@for` 渲染時，第一筆會是 position 10 的 Neon。

```typescript
let ELEMENT_DATA: PeriodicElement[] = [
  {position: 10, name: 'Neon',      weight: 20.1797, symbol: 'Ne'},
  {position: 1,  name: 'Hydrogen',  weight: 1.0079,  symbol: 'H'},
  {position: 2,  name: 'Helium',    weight: 4.0026,  symbol: 'He'},
  {position: 3,  name: 'Lithium',   weight: 6.941,   symbol: 'Li'},
  {position: 4,  name: 'Beryllium', weight: 9.0122,  symbol: 'Be'},
  {position: 5,  name: 'Boron',     weight: 10.811,  symbol: 'B'},
  {position: 6,  name: 'Carbon',    weight: 12.0107, symbol: 'C'},
  {position: 7,  name: 'Nitrogen',  weight: 14.0067, symbol: 'N'},
  {position: 8,  name: 'Oxygen',    weight: 15.9994, symbol: 'O'},
  {position: 9,  name: 'Fluorine',  weight: 18.9984, symbol: 'F'},
];
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 後端資料的順序不一定符合畫面需求，需要在前端進行排序處理。
</div>

<!--
我們來看一個具體的例子。

這份 `ELEMENT_DATA` 陣列裡，Neon 的 position 是 10，卻放在第一筆，其他元素才依照 1 到 9 排列。

如果直接用 `@for` 把它顯示在畫面上，第一列就會是 Neon，順序明顯不對。後端資料的順序不一定符合畫面需求，所以我們要在前端先排序。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# sort() 排序方法
# Array sort()

<!--
看完沒有排序的問題，接下來我們學習 JavaScript 陣列內建的排序方法：`sort()`。
-->

---

# sort() 基本用法

`sort()` 是陣列的原生方法，接受一個比較函式，依序比較相鄰兩個元素直到排序完成。以下範例以 `position` 為排序依據。

```typescript
this.dataSource.data.sort(function (a, b) {
  if (a.position < b.position) {
    return -1;
  }
  if (a.position > b.position) {
    return 1;
  }
  return 0;
});
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> sort() 是陣列的原生方法，會直接修改原始陣列並回傳排序後的結果。
</div>

<!--
解決方法是用陣列內建的 `sort()` 方法。

我們可以把 `sort()` 想成一位裁判，它每次拿兩個元素出來比較，問我們「這兩個誰該排前面」，再根據我們的答案一輪一輪比下去，直到整個陣列排好。

所以 `sort()` 需要我們傳入一個「比較函式」。函式接收 `a` 和 `b` 兩個元素，我們在裡面寫判斷規則。這個範例用 `position` 當依據，比較 `a.position` 和 `b.position` 的大小。

要注意，`sort()` 會直接修改原本的陣列，而不是回傳一份新的陣列。呼叫之後，原本的資料順序就已經改變了。
-->

---

# 排序邏輯說明

比較函式接收 `a`、`b` 兩個元素：回傳負數時 a 排在 b 前，回傳正數時 b 排在 a 前，回傳 0 時順序不變。

```typescript
this.dataSource.data.sort(function (a, b) {
  if (a.position < b.position) {
    return -1;  // a 排在 b 前面
  }
  if (a.position > b.position) {
    return 1;   // b 排在 a 前面
  }
  return 0;     // 順序不變
});
```

| 回傳值 | 意義 |
|--------|------|
| `-1`（負數） | a 排在 b 前面（升冪） |
| `1`（正數） | b 排在 a 前面 |
| `0` | 兩者相等，順序不變 |

<!--
接下來，我們把比較函式回傳值的意義講清楚，這是最容易卡住的地方。

比較函式每次拿 `a` 和 `b` 出來比較。回傳負數，習慣上寫負一，代表 `a` 排在 `b` 前面；回傳正數，習慣上寫一，代表 `b` 排在 `a` 前面；回傳零，代表兩者相等，順序不變。

所以這個範例的意思是：`a` 的 position 比較小，`a` 就排前面；比較大，`a` 就排後面。結果就是由小到大的升冪排列。

其實回傳值不一定要剛好是負一、零、一，只要是負數、正數或零就可以了。比較函式在意的只是方向，不在意差多少。
-->

---

# 排序結果

排序後結果如下：

```typescript
// 排序後的陣列（依 position 升冪）
[
  // 0: {position: 1,  name: 'Hydrogen',  weight: 1.0079,  symbol: 'H'}
  // 1: {position: 2,  name: 'Helium',    weight: 4.0026,  symbol: 'He'}
  // 2: {position: 3,  name: 'Lithium',   weight: 6.941,   symbol: 'Li'}
  // 3: {position: 4,  name: 'Beryllium', weight: 9.0122,  symbol: 'Be'}
  // 4: {position: 5,  name: 'Boron',     weight: 10.811,  symbol: 'B'}
  // 5: {position: 6,  name: 'Carbon',    weight: 12.0107, symbol: 'C'}
  // 6: {position: 7,  name: 'Nitrogen',  weight: 14.0067, symbol: 'N'}
  // 7: {position: 8,  name: 'Oxygen',    weight: 15.9994, symbol: 'O'}
  // 8: {position: 9,  name: 'Fluorine',  weight: 18.9984, symbol: 'F'}
  // 9: {position: 10, name: 'Neon',      weight: 20.1797, symbol: 'Ne'}
]
```

Neon（position: 10）移到最後，資料已依 position 升冪排列。

<!--
我們看排序後的結果。

原本在第一筆的 Neon，position 是 10，現在已經排到最後一筆，其他元素也依照 position 1 到 9 依序排列。

這證明我們寫的比較函式是正確的：position 小的排前面，大的排後面。可以把範例貼到瀏覽器的 Console 執行，實際觀察排序前後的差別。
-->

---

# 切換排序欄位

將比較函式中的欄位名稱替換即可切換排序依據，以下改為依 `name` 排序：

```typescript
this.dataSource.data.sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
});
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 文字比較時，JavaScript 會依字母的 Unicode 碼點順序排列，英文字母排序（A → Z）可正常運作。
</div>

<!--
學會比較函式之後，要切換排序的依據就很簡單了，不用改整個函式的結構，只要把比較的欄位換掉。

這裡把原本的 `position` 全部換成 `name`，其他寫法完全一樣，就變成依照名稱排序了。

文字的比較跟數字不同，JavaScript 會依照字元的編碼順序比較。英文字母從 A 到 Z 排序沒有問題，但如果大小寫混在一起，結果可能跟預期不同，這是文字排序常見的小陷阱。
-->

---

# 練習：資料排序
### 將下方的資料用重量排序並且打印出來

1. 宣告 `ELEMENT_DATA` 陣列（資料如下）
2. 使用 `sort()` 方法，以 `weight` 欄位作為排序依據
3. 排序完成後將結果 `console.log` 打印出來
4. 確認第一筆為重量最小的元素（Hydrogen，weight: 1.0079）

```typescript
ELEMENT_DATA = [
  {position: 10, name: 'Neon',      weight: 20.1797, symbol: 'Ne'},
  {position: 1,  name: 'Hydrogen',  weight: 1.0079,  symbol: 'H'},
  {position: 2,  name: 'Helium',    weight: 4.0026,  symbol: 'He'},
  {position: 3,  name: 'Lithium',   weight: 6.941,   symbol: 'Li'},
  {position: 4,  name: 'Beryllium', weight: 9.0122,  symbol: 'Be'},
  {position: 5,  name: 'Boron',     weight: 10.811,  symbol: 'B'},
  {position: 6,  name: 'Carbon',    weight: 12.0107, symbol: 'C'},
  {position: 7,  name: 'Nitrogen',  weight: 14.0067, symbol: 'N'},
  {position: 8,  name: 'Oxygen',    weight: 15.9994, symbol: 'O'},
  {position: 9,  name: 'Fluorine',  weight: 18.9984, symbol: 'F'},
]
```

<!--
接下來換我們動手練習。

請宣告 `ELEMENT_DATA` 陣列，用 `sort()` 以 `weight`，也就是重量為依據排序，排好之後用 `console.log` 印出來，並確認第一筆是重量最小的 Hydrogen。

想一想，跟剛才切換成 `name` 的做法比起來，這次要改哪裡？

我們先暫停一下，自己動手試試看。
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

# 補充練習 1–2：數字與文字排序

**練習 1：數字升序**

建立陣列 `let numbers = [50, 10, 5, 100, 32];`，將它由小到大排序，在 Console 確認結果為 `[5, 10, 32, 50, 100]`。

**練習 2：英文符號降序（Z → A）**

使用本章的 `ELEMENT_DATA`，針對 `symbol`（如 `'Ne'`、`'H'`、`'He'`）由大到小（降序）排序。

<!--
接下來兩題補充練習。

第一題，把一個純數字陣列由小到大排好。第二題，用本章的元素資料，依照 `symbol` 由 Z 到 A 倒過來排。

想一想，要讓順序反過來，比較方法的回傳值要怎麼改？我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
let numbers = [50, 10, 5, 100, 32];
numbers.sort((a, b) => a - b);
console.log(numbers);   // [5, 10, 32, 50, 100]
```

```typescript
this.ELEMENT_DATA.sort((a, b) => {
  if (a.symbol < b.symbol) return 1;    // 升序時是 -1，反過來
  if (a.symbol > b.symbol) return -1;
  return 0;
});
console.log(this.ELEMENT_DATA);
```

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 數字不能只寫 <code>sort()</code>：預設會轉成字串比較，<code>[50, 10, 5, 100, 32]</code> 會排成 <code>[10, 100, 32, 5, 50]</code>
</div>

<!--
我們來看答案。

數字排序要傳入比較方法 `a - b`，結果是負數，`a` 就排前面，所以是由小到大。如果只寫 `sort()` 不帶參數，會被當成字串比較，100 會排在 32 前面，結果是錯的。

文字降序，只要把升序的回傳值對調：`a` 比 `b` 小時回傳 1，讓 `a` 排到後面，就變成由 Z 到 A。
-->

---
layout: end
---

# 課程結束
### 善用 sort()，讓資料順序完全掌握在你手中

<!--
這一章我們學了資料排序。後端資料的順序不一定符合需求，可以在前端用 `sort()` 排序。`sort()` 需要傳入比較函式：回傳負數代表 `a` 排前面，正數代表 `b` 排前面，零代表順序不變。`sort()` 會直接修改原陣列，而要切換排序依據，只要換掉比較的欄位。另外，中文無法直接用預設的方式依筆畫排序。

下一章，我們要開始使用 Angular Material 元件庫。我們下一章見。
-->
