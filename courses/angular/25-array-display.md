---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 陣列顯示
routeAlias: ch25
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
    陣列顯示
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用迴圈與 @for 讓陣列資料活躍於畫面」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們把資料存在瀏覽器裡。這一章要處理一個常見的需求：把陣列資料顯示在畫面上。

購物網站有成千上萬件商品，不可能每件都手寫 HTML。後端給的通常是一整個陣列，我們要讓程式自動把每一筆顯示出來。學完這一章，我們會用迴圈和 `@for` 做到這件事。
-->

---
layout: default
---

# Outline

- **陣列（Array）** — 什麼是陣列，如何用索引取值
- **for 迴圈（傳統寫法）** — 初始值、條件、遞增
- **for...of 迴圈** — TypeScript 簡化的迴圈語法
- **練習 1** — 找出陣列中 9 的位置並打印
- **陣列顯示（@for）** — 在 Angular HTML 中顯示陣列
- **陣列資料結構** — 單一資料、物件陣列、巢狀陣列
- **巢狀 @for** — 顯示陣列中的陣列資料
- **練習 2** — 建立玩家陣列並顯示道具清單

<!--
這一章會先複習陣列和索引，接著介紹傳統的 for 迴圈和 `for...of`，並做第一個練習。然後進入 HTML，學習 Angular 的 `@for` 語法。接著看幾種常見的陣列結構，學會用巢狀 `@for` 顯示陣列裡的陣列。最後用一個玩家和道具的練習收尾。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 陣列
# Array

<!--
我們先複習一下陣列。
-->

---

# 陣列

陣列（Array）是由相同類型的元素（element）組成的資料結構。透過索引取值時，在陣列名稱後加上 `[]` 並填入位置編號即可。索引從 **0** 開始，因此 `arrayData[1]` 取得的是第二個元素。

```typescript
let arrayData = [2, 3, 5];
console.log('arrayData: ' + arrayData[1]);
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 陣列索引從 <b>0</b> 開始，arrayData[0] = 2、arrayData[1] = 3、arrayData[2] = 5
</div>

<!--
陣列是由同一類型的元素組成的資料結構，就像一列火車，每節車廂裡裝著一筆資料。

每節車廂都有一個編號，叫做索引。要取出某一筆資料，就在陣列名稱後面加上中括號，填入索引。

要特別注意，索引是從 0 開始的。所以 `arrayData[0]` 是第一個元素 2，`arrayData[1]` 才是第二個元素 3。這個範例印出來的是 3。
-->

---

# 陣列 — for 迴圈

`for` 迴圈可依序讀取陣列每一筆資料。傳統寫法需設定三個部分：初始值（`let i = 0`）、條件（`i < a.length`）、遞增（`i++`）。

```typescript
for (INITIALIZATION; CONDITION; AFTERTHOUGHT) {
  // Code for the for-loop's body goes here.
}
```

<!--
要依序讀取陣列裡的每一筆資料，可以用 for 迴圈。

傳統的 for 迴圈需要三個部分。初始值，`let i = 0`，從第 0 個開始。條件，`i < a.length`，只要還在陣列長度之內就繼續，超過就停下來。遞增，`i++`，每讀完一筆，索引就加 1。

三個部分組合在一起，迴圈就能自動依序讀取每一筆資料。
-->

---

# 陣列 — for 迴圈範例

初始值為 0，每次執行後 `i++`，直到 `i >= arrayData.length` 為止。`i` 依序為 0、1、2，對應 `arrayData` 的 2、3、5。

```typescript
let arrayData = [2, 3, 5];
for (let i = 0; i < arrayData.length; i++) {
  console.log(arrayData[i]);
}
```

執行結果：

| 迴圈次數 | i 的值 | arrayData[i] |
| --- | --- | --- |
| 第 1 次 | 0 | 2 |
| 第 2 次 | 1 | 3 |
| 第 3 次 | 2 | 5 |

<!--
我們看實際的執行過程。

陣列裡有 2、3、5 三個數字。第一次，`i` 是 0，讀到 2；第二次，`i` 加 1 變成 1，讀到 3；第三次，`i` 變成 2，讀到 5。

接著 `i` 變成 3，3 沒有小於陣列長度 3，條件不成立，迴圈就結束了。表格把每一次的 `i` 和讀到的值都列了出來。
-->

---

# 陣列 — for...of 迴圈

`for...of` 是 ES6 的簡化語法，無需設定初始值、條件或遞增，直接迭代陣列每一個元素（此處命名為 `data`）。

```typescript
let arrayData = [2, 3, 5];
for (let data of arrayData) {
  console.log(data);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>for...of</code> 是 TypeScript / ES6 的語法，比傳統 for 迴圈更簡潔，適合直接迭代陣列元素。
</div>

<!--
傳統的 for 迴圈要寫三個部分，比較容易寫錯。TypeScript 有更簡潔的寫法：`for...of`。

`for` 小括號裡寫 `let data of arrayData`，迴圈會自動把陣列裡的元素，一個一個放進 `data`，直到全部讀完。

不需要管索引從哪裡開始，也不用寫長度的判斷，不只簡潔好讀，也比較不容易出錯。當我們只需要每一筆的值、不需要索引時，就很適合用它。
-->

---
layout: two-cols
---

# 練習 1
### 找出 9 的位置

新增一個陣列 `[10, 20, 3, 5, 8, 9, 23, 657, 123, 67]`，想辦法把 9 是在哪個位置打印出來。

預期結果：印出 `5`（9 在陣列中的索引值）

```typescript
let myArray = [10, 20, 3, 5, 8, 9, 23, 657, 123, 67];
for (let i = 0; i < myArray.length; i++) {
  if (myArray[i] === 9) {
    console.log(i);
  }
}
```

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/24-array-display/practice-1-result.png" class="rounded shadow-md max-h-80" />
</div>

<!--
我們來做第一個練習。

這裡有一個陣列，請找出數字 9 在陣列中的位置，並印出它的索引，預期的結果是 5。

提示一下，因為要印出位置，這題用傳統的 for 迴圈比較方便，再搭配 if 判斷。

我們先暫停一下，自己動手試試看。

【講師】左側程式碼即為解答，可先遮住或請學生寫完再對照。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 陣列顯示
# @for in Angular HTML

<!--
剛才的結果都印在 Console 裡，使用者看不到。接下來，我們要把陣列資料直接顯示在 HTML 畫面上。
-->

---

# 陣列顯示 — @for

In HTML 中使用 `@for(變數 of 陣列; track 唯一值)` 語法迭代陣列並渲染畫面。`track` 為必填，用於追蹤每筆資料的唯一識別，協助 Angular 最佳化渲染效能。

```typescript
arrayData = [4, 5, 6];
```

```html
@for(data of arrayData; track data) {
  <h3>{{ data }}</h3>
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>track</code> 是 Angular 17+ 新版 <code>@for</code> 語法的必填欄位，用來追蹤每筆資料的唯一識別值，有助於提升渲染效能。
</div>

<!--
在 Angular 的 HTML 裡，用 `@for` 來顯示陣列。

寫法是 `@for`，小括號裡寫「變數 of 陣列」，分號後面接 `track`。大括號裡的內容，會依照陣列的筆數重複產生。這裡陣列有 4、5、6 三個數字，畫面上就會出現三個 `h3`。

這裡的 `track` 是必填的。我們可以把它想成每筆資料的名牌。資料可能會新增、刪除或重新排序，Angular 需要知道每一筆資料的唯一識別，更新畫面時才能只重畫有變動的部分，而不是整個重畫。

如果是簡單的數字陣列，直接寫 `track data` 就可以了。
-->

---
layout: default
---

# @for — 小節練習

請實作以下需求：

1. 在 `app.component.ts` 宣告城市名稱陣列 `cities = ['台北', '台中', '高雄', '台南', '桃園']`
2. 在 HTML 中使用 `@for` 依序顯示每個城市名稱

<!--
我們用一個小練習熟悉 `@for`。

請在 `app.component.ts` 宣告一個城市名稱的陣列，裡面有台北、台中、高雄、台南和桃園。接著在 HTML 用 `@for` 依序顯示每個城市的名稱。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# @for — 小節練習解答

```typescript
cities = ['台北', '台中', '高雄', '台南', '桃園'];
```

```html
@for(city of cities; track city) {
  <p>{{ city }}</p>
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>track</code> 是必填欄位，協助 Angular 追蹤每筆資料的唯一識別。純字串陣列直接 <code>track city</code>；若有 id 則建議用 <code>track city.id</code>
</div>

<!--
我們來看答案。

`@for` 小括號裡寫 `city of cities`，`track` 後面接 `city`，大括號裡用雙大括號顯示 `city`。

`track` 如果沒寫，編譯時就會報錯。像這種純字串的陣列，沒有 id 可以用，就直接 `track` 元素本身。如果資料有 id，建議用 id 作為 `track` 的值。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 陣列資料
# Array Data Structures

<!--
接下來，我們看幾種不同結構的陣列。實務上，API 回傳的資料通常沒有這麼單純。
-->

---

# 陣列資料

陣列資料結構有三種常見形式：單一值陣列、物件陣列、巢狀陣列（陣列中含陣列）。

```typescript
arrayData = [4, 5, 6];

arrayData2 = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 3, name: 'c' }
];

arrayData3 = [
  { id: 1, name: 'a', userData: [{ userId: '1' }] },
  { id: 2, name: 'b', userData: [{ userId: '2' }] },
  { id: 3, name: 'c', userData: [{ userId: '3' }] }
];
```

<!--
常見的陣列結構有三種。

第一種是單一值的陣列，裡面直接放數字或字串。

第二種是物件陣列，每一筆都是一個物件，例如有 id 和 name 的會員資料，這在實務上最常見。

第三種是巢狀陣列，物件裡面又包了另一個陣列。看 `arrayData3`，每個物件除了 id 和 name，還有一個 `userData` 陣列。

要讀取這種陣列裡的陣列，就要用到兩層迴圈。
-->

---

# 陣列資料 — 巢狀迴圈（TS）

要取得 `userData` 中的 `userId`，需以外層迴圈迭代 `arrayData3`，再以內層迴圈迭代每筆資料的 `userData`。

```typescript
for (let data of this.arrayData3) {
  for (let user of data.userData) {
    console.log(user.userId);
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 巢狀迴圈（nested loop）可以讓你讀取陣列中的陣列資料，外層迴圈跑外層陣列，內層迴圈跑內層陣列。
</div>

<!--
在 TypeScript 裡，要取得最內層的 `userId`，就要寫兩層 `for...of`。

外層迴圈逐一取出 `arrayData3` 的每一筆資料 `data`；內層迴圈再從 `data.userData` 裡，逐一取出每個 `user`，印出 `userId`。

就像拆包裹，要先打開外面的箱子，才能拿到裡面的盒子。層級要對好，否則就會讀到 undefined。
-->

---

# 陣列顯示 — 巢狀 @for（HTML）

顯示巢狀陣列資料時，需使用兩層 `@for`，外層迭代主陣列，內層迭代子陣列。

```html
@for(data of arrayData3; track data.id) {
  @for(user of data.userData; track user.userId) {
    <h3>{{ user.userId }}</h3>
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 外層 <code>@for</code> 使用 <code>track data.id</code>，內層 <code>@for</code> 使用 <code>track user.userId</code>，分別追蹤各自陣列的唯一值。
</div>

<!--
在 HTML 裡也是一樣的概念，用兩層 `@for` 包在一起。

外層的 `@for` 逐一處理 `arrayData3`，用 `data.id` 當作 `track`。在它的大括號裡，再寫一層 `@for`，逐一處理 `data.userData`，用 `user.userId` 當作 `track`。最內層用雙大括號顯示 `userId`。

兩層各自追蹤自己陣列的唯一值。寫的時候注意縮排，括號才不容易對錯。
-->

---
layout: two-cols
---

# 練習 2
### 玩家陣列與道具顯示

新增 `userArray` 陣列，做出以下畫面效果：

- 顯示每位玩家的名稱
- 列出該玩家擁有的道具名稱與數量

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/24-array-display/practice-2-result.png" class="rounded shadow-md max-h-80" />
</div>

<!--
我們來做第二個練習。

請建立一個 `userArray` 玩家陣列，在畫面上顯示每位玩家的名稱，並且在每位玩家底下，列出他擁有的道具名稱和數量。

想一想，玩家和道具分別是哪一層的陣列？

下一頁是這題要用的資料結構。
-->

---

# 練習 2 — 資料結構

```typescript
userArray = [
  {
    userName: '玩家A', lev: 10,
    props: [
      { propsName: '蘑菇', amount: 5 },
      { propsName: '金幣', amount: 15 }
    ]
  },
  {
    userName: '玩家B', lev: 15,
    props: [
      { propsName: '龜殼', amount: 1 },
      { propsName: '砲彈', amount: 15 }
    ]
  }
];
```

<!--
這是練習要用的資料。

`userArray` 裡有玩家 A 和玩家 B，每位玩家有名稱和等級，還有一個 `props` 道具陣列，裡面每個道具都有名稱和數量。

請把這段資料放進元件的 TypeScript 裡，再用巢狀 `@for` 把畫面做出來。

我們先暫停一下，自己動手試試看。
-->

---

# 練習 2 — 參考解答（HTML）

```html
@for(user of userArray; track user.userName) {
  <div style="border: 1px solid #ccc; padding: 16px; margin: 8px;">
    <h2>{{ user.userName }}</h2>
    <p>擁有道具：</p>
    <ul>
      @for(prop of user.props; track prop.propsName) {
        <li>{{ prop.propsName }} 數量：{{ prop.amount }}</li>
      }
    </ul>
  </div>
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 外層 <code>@for</code> 迭代玩家，內層 <code>@for</code> 迭代每位玩家的道具，即可完成巢狀陣列的畫面顯示。
</div>

<!--
我們來看 HTML 的參考解答。

外層的 `@for` 逐一處理每位玩家，用 `userName` 當作 `track`，顯示玩家名稱。下方用一個 `ul`，裡面再寫一層 `@for`，逐一處理 `user.props`，在每個 `li` 裡顯示道具名稱和數量。

當外層處理到玩家 A，內層就列出蘑菇和金幣；處理到玩家 B，內層就列出龜殼和砲彈。
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

# 補充練習：篩選奇數價格

1. 宣告商品價格陣列：`[11, 24, 35, 48, 57]`
2. 用 `for...of` 搭配餘數運算符（`item % 2 !== 0`）過濾
3. 把篩選出來的所有「奇數價格」依序印在 Console

<!--
這題補充練習，從價格陣列裡挑出奇數。

用 `for of` 一筆一筆取出價格，用餘數判斷：除以 2 的餘數不等於 0，就是奇數，把它印出來。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習：篩選奇數價格 — 參考答案

```typescript
let prices = [11, 24, 35, 48, 57];

for (let item of prices) {
  if (item % 2 !== 0) {
    console.log(item);   // 11、35、57
  }
}
```

<!--
我們來看答案。

`%` 是取餘數。奇數除以 2 一定餘 1，所以 `item % 2 !== 0` 成立的就是奇數。

`for of` 依序取出 11、24、35、48、57，符合條件的 11、35、57 會被印出來。
-->

---
layout: end
---

# 課程結束
### 學會陣列與 @for，讓資料動態呈現於畫面

<!--
這一章我們學會了陣列的顯示。陣列的索引從 0 開始。需要索引時用傳統 for 迴圈，只需要值時用 `for...of`。在 HTML 裡用 `@for` 顯示陣列，而且 `track` 是必填的，有 id 時建議用 id。遇到陣列裡還有陣列，就用兩層迴圈或兩層 `@for`。

下一章，我們會學習用 `@if` 根據條件決定畫面要不要顯示。我們下一章見。
-->
