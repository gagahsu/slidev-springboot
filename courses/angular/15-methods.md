---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 方法
routeAlias: ch15
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
    Angular Full-Stack Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    方法
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓程式碼可以重複被呼叫的魔法」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學會了用變數存放資料，並且顯示在畫面上。但到目前為止，網頁只會顯示資料，還不會主動做事。

這一章，我們要學習方法，也常被叫做函式。我們可以把方法想成一份標準作業流程，寫好之後，只要在需要的時候呼叫它，網頁就會照著步驟執行。

學完這一章，我們就能讓使用者點擊按鈕時，觸發我們寫好的邏輯。
-->

---
layout: default
---

# Outline

- **什麼是方法**
- **方法的組成**
- **HTML 呼叫方法**
- **TS 中方法呼叫方法**
- **呼叫方法帶入值**
- **多個參數與預設值**
- **回傳值（return）**
- **實作練習**

<!--
這一章會先說明什麼是方法，以及一個方法由哪些部分組成。接著看在 Angular 裡怎麼從 HTML 呼叫方法，以及方法之間怎麼互相呼叫。然後學習怎麼在呼叫時帶入資料，包括多個參數和預設值，以及怎麼用 return 把結果回傳出來。最後用一個練習把觀念串起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是方法
# What is a Method?

<!--
我們先來了解，方法到底是什麼。
-->

---

# 什麼是方法？

**方法（Function / 函式）** 是一個被命名的程式碼區塊，用來執行特定的任務，並且可以重複被呼叫。

| 特點 | 說明 |
| --- | --- |
| 可重複呼叫 | 同一段邏輯不用寫很多次 |
| 可從 HTML 觸發 | 按鈕點擊等事件可呼叫方法 |
| 可互相呼叫 | 方法可以呼叫其他方法 |
| 可帶入參數 | 呼叫時傳入資料讓方法使用 |
| 可回傳值 | 方法執行完可以回傳結果 |

<!--
方法，英文是 function，中文也叫函式，是「一段有名字、用來執行特定任務、可以重複呼叫的程式碼」。

我們可以把它想成大樓警衛的巡邏流程。這套流程有一個名字叫「巡邏」，每次要巡邏時，只要說一聲「開始巡邏」，警衛就會把整套步驟走一遍，不用每次重新說明。

看表格，方法有五個特點：可以重複呼叫，同樣的邏輯不用寫很多次；可以從 HTML 觸發，例如按鈕點擊；可以互相呼叫；可以在呼叫時帶入資料；執行完還可以回傳結果。
-->

---

# 方法的組成

建立一個方法需要三個要素：

| 要素 | 說明 | 範例 |
| --- | --- | --- |
| 方法名稱 | 用來辨識與呼叫這個方法 | `showMessage` |
| 參數（可選） | 呼叫時要帶入的資料 | `(name: string)` |
| 程式碼區塊 | 方法執行時要跑的邏輯 | `{ alert(...) }` |

<!--
建立一個方法，需要三個要素。

第一是方法名稱，用來辨識和呼叫這個方法，例如 `showMessage`。第二是參數，這是選填的，寫在小括號裡，代表呼叫時要帶進來的資料。第三是程式碼區塊，寫在大括號裡，也就是方法被呼叫時要執行的內容。
-->

---

# 方法的組成 — 範例

```typescript
export class AppComponent {

  // 方法名稱: showMessage
  // 參數: 無
  // 程式碼區塊: 執行 alert
  showMessage() {
    alert('Hello!');
  }

}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 方法宣告在 class 內部，與全域變數並列，不需要 <code>function</code> 關鍵字
</div>

<!--
我們來看在 TypeScript 裡怎麼寫。

在 `AppComponent` 這個 class 裡，我們宣告了一個 `showMessage` 方法。它沒有參數，大括號裡只有一行 `alert`，被呼叫時就會跳出 Hello 的訊息框。

這裡要特別注意：在 Angular 的 class 裡宣告方法，不需要寫 `function` 這個關鍵字。上一章練習的純 JavaScript 有寫 `function`，所以很多人會順手寫進來，結果 TypeScript 會報錯。

方法跟全域變數一樣，都寫在 class 的大括號裡面。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 在 Angular 中使用方法
# Calling Methods in Angular

<!--
方法在 TypeScript 裡寫好了，那要怎麼讓畫面上的按鈕觸發它呢？
-->

---

# HTML 呼叫方法

在 Angular 中，通常會讓使用者點擊某個 HTML 標籤（按鈕、圖片、文字等）時，**觸發 TS 中對應的方法**。

語法：在 HTML 標籤上使用 `(click)` 事件綁定，填入要呼叫的方法名稱。

```html
<!-- app.component.html -->
<button (click)="showMessage()">點我</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>(click)="方法名稱()"</code> 是 Angular 的<b>事件綁定（Event Binding）</b>語法，括號代表監聽事件
</div>

<!--
在 Angular 裡，通常會讓使用者點擊按鈕、圖片或文字時，觸發 TypeScript 裡對應的方法。

做法是使用「事件綁定」。寫法是用小括號把事件名稱包起來，等號後面的引號裡，填入要呼叫的方法名稱和小括號。

看這行程式碼，按鈕上寫了小括號 `click` 等於 `showMessage()`。小括號代表「監聽事件」，意思是：「當這個按鈕被點擊時，就去執行 `showMessage` 這個方法」。

到這裡，我們已經學了兩種綁定：中括號用來設定屬性，小括號用來監聽事件。
-->

---

# HTML 呼叫方法 — TS 端

HTML 用名稱呼叫方法後，TS 檔案中必須有一個**同名方法**來處理這個事件。

```typescript
// app.component.ts
export class AppComponent {

  showMessage() {
    alert('你點了按鈕！');
  }

}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 HTML 的 <code>(click)="showMessage()"</code> 與 TS 的 <code>showMessage()</code> 名稱必須完全一致
</div>

<!--
HTML 用名稱呼叫方法，TypeScript 裡就必須有一個同名的方法來處理。

這裡我們在 class 裡定義了 `showMessage`，裡面用 `alert` 顯示「你點了按鈕」。使用者點擊按鈕時，Angular 就會找到這個方法，執行大括號裡的內容。

要注意，HTML 裡寫的方法名稱，要跟 TypeScript 裡的名稱完全一致，大小寫也要一樣。打錯一個字，兩邊就接不起來，按鈕點下去就不會有任何反應。
-->

---

# TS 中方法呼叫方法

除了從 HTML 觸發，**方法也可以在 TS 內部去呼叫另一個方法**。

在方法中呼叫同一個 class 的另一個方法，需要用 `this.方法名稱()` 來呼叫。

```typescript
export class AppComponent {

  firstMethod() {
    alert('我是第一個方法');
    this.secondMethod();
  }

  secondMethod() {
    alert('我是被呼叫的第二個方法');
  }

}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 在 class 內存取自己的方法或變數，一律使用 <code>this.</code> 開頭
</div>

<!--
方法除了從 HTML 觸發，也可以在 TypeScript 裡呼叫另一個方法。

看程式碼，`firstMethod` 先跳出一個訊息框，接著寫了 `this.secondMethod()`，去呼叫同一個 class 裡的另一個方法。

跟全域變數一樣，在 class 裡使用自己的方法，前面一定要加上 `this.`，否則 TypeScript 會找不到它。

執行的結果是，會先跳出「我是第一個方法」，再跳出「我是被呼叫的第二個方法」。實務上，我們常把一段複雜的流程拆成好幾個小方法，再讓它們互相呼叫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 呼叫方法帶入值
# Method Parameters

<!--
接下來，我們看怎麼在呼叫方法時，順便把資料帶進去，這就要用到參數。
-->

---

# 呼叫方法帶入值（單一參數）

有時我們希望呼叫方法時，讓呼叫者傳入資料。這時在方法名稱後的 `()` 中定義參數：宣告一個**區域變數**來存放傳入的值。

| 語法部分 | 說明 | 範例 |
| --- | --- | --- |
| 參數名稱 | 在方法內用來讀取傳入值的變數 | `name` |
| 型別 | 指定傳入值的資料型別 | `: string` |
| 呼叫方式 | HTML 或方法中帶入實際值 | `greet('Allen')` |

<!--
有時候我們希望方法更有彈性。例如一個打招呼的方法，希望帶入不同的名字，就說出不同的問候。

這時候，我們在方法名稱後面的小括號裡定義參數。參數其實就是一個區域變數，用來接收呼叫時傳進來的值。

看表格，參數需要一個名稱，例如 `name`，方法裡就用這個名稱讀取傳入的值。在 TypeScript 裡，參數一定要寫上型別，例如 `string`。呼叫的時候，再把實際的值放進小括號裡。
-->

---

# 呼叫方法帶入值（單一參數）— 範例

```typescript
// TS：定義參數
greet(name: string) {
  alert('Hello, ' + name);
}
```

```html
<!-- HTML：呼叫時帶入值 -->
<button (click)="greet('Allen')">打招呼</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 有定義參數的方法，呼叫時<b>一定要帶入值</b>，否則 TypeScript 會報錯
</div>

<!--
我們看實際的範例。

TypeScript 這邊定義了 `greet`，它有一個字串型別的參數 `name`，裡面用 `alert` 把 Hello 和名字組合起來顯示。

HTML 這邊，按鈕點擊時呼叫 `greet`，並帶入 `'Allen'`。這個值會被放進 `name` 裡，所以點擊按鈕後，會跳出「Hello, Allen」。

要注意，方法如果定義了參數，呼叫時就一定要帶入值。如果在 HTML 只寫 `greet()`，沒有帶任何值，TypeScript 就會報錯。
-->

---

# 多個參數與預設值

方法可以要求帶入**多個值**，也可以為參數設定**預設值**（設定後該參數變成選填）。

| 語法 | 說明 |
| --- | --- |
| `(a: string, b: number)` | 多個參數，呼叫時都必填 |
| `(name: string, age: number = 18)` | `age` 有預設值，可不填 |

<!--
方法也可以有好幾個參數，參數之間用逗號隔開，例如名字和年齡，這時候呼叫時兩個都要填。

另外，我們可以幫參數設定預設值，寫法是在型別後面加上等號和預設的值。設定了預設值之後，這個參數就變成選填。呼叫時沒有帶這個值，就使用預設值；有帶的話，就以傳入的值為主。
-->

---

# 多個參數與預設值 — 範例

```typescript
// 多個參數：兩個都必填
introduce(name: string, age: number) {
  alert(name + ' 今年 ' + age + ' 歲');
}
```

```typescript
// 預設值：age 不填時自動用 18
introduce(name: string, age: number = 18) {
  alert(name + ' 今年 ' + age + ' 歲');
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 有預設值的參數放在最後面，未帶值時使用預設值，帶了值時以傳入值為主
</div>

<!--
我們看兩種寫法的範例。

上面的 `introduce` 有兩個參數，名字和年齡，呼叫時兩個都必須帶入。

下面的版本把年齡設了預設值 18。如果只傳入 Allen，就會顯示「Allen 今年 18 歲」；如果傳入 Jerry 和 20，就會顯示「Jerry 今年 20 歲」。

要注意一件事：有預設值的參數，要放在參數清單的最後面。否則前面的參數省略時，TypeScript 就沒辦法判斷傳進來的值是給哪一個參數的。
-->

---

# 回傳值（return）

方法就像一台自動販賣機：投入代幣（**參數**），執行內部邏輯後，吐出飲料（**回傳值**）。

| 語法 | 說明 |
| --- | --- |
| `(a: number, b: number): number` | 小括號後的 `: number` 是**回傳值的型別** |
| `return 結果;` | 把結果交回呼叫的地方，並結束方法 |
| `res = this.addMoney(10, 20);` | 用變數接住回傳的結果 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 沒有 <code>return</code> 的方法，只是「做一件事」；有 <code>return</code> 的方法，會「算出一個結果交給你」
</div>

<!--
前面的方法，都是在方法裡直接 `alert` 或 `console.log`，做完就結束了。但很多時候，我們希望方法算出一個結果，交回給呼叫它的地方，讓程式繼續使用，這就需要回傳值。

可以把方法想成一台自動販賣機：參數是投進去的代幣，回傳值是掉出來的飲料。

寫法有兩個重點：第一，小括號後面加上冒號和型別，代表這個方法會回傳什麼型別的資料。第二，在方法裡用 `return` 把結果交出去，執行到 `return`，方法就會結束。
-->

---

# 回傳值（return）— 範例

```typescript
// 小括號後的 : number 表示這個方法會回傳數字
addMoney(price1: number, price2: number): number {
  return price1 + price2;
}

showTotal() {
  const res = this.addMoney(10, 20);   // res 得到 30
  alert('總金額：' + res);
}
```

```typescript
addMoney(price1: number, price2: number): number {
  return 'total';   // ❌ Type 'string' is not assignable to type 'number'.
}
```

<!--
我們看範例。

`addMoney` 接收兩個價格，用 `return` 回傳兩者相加的結果。小括號後面的 `number` 規定了回傳值一定要是數字。

`showTotal` 呼叫 `this.addMoney(10, 20)`，回傳的 30 就存進 `res`，接著可以拿去顯示或做其他計算。

如果回傳值的型別跟宣告的不一樣，例如回傳字串，TypeScript 就會報錯，幫我們提早發現問題。
-->

---
layout: default
---

# 練習：任務說明
### 製作一個互動頁面

建立一個有按鈕的 Angular 頁面，實作以下功能：

1. 頁面有一個「顯示訊息」按鈕，點擊後用 `alert` 彈出一段文字
2. 頁面再新增一個「打招呼」按鈕，點擊後呼叫方法並帶入你的名字，alert 顯示 `Hello, [名字]`
3. 在 TS 中，讓「顯示訊息」的方法執行完後，再呼叫一個名為 `logDone()` 的第二個方法，`logDone()` 執行 `console.log('完成！')`

**完成後開啟瀏覽器的開發者工具 Console 確認 log 有出現。**

<!--
我們來做一個練習，把這一章學到的都用上。

請建立一個有兩個按鈕的頁面。第一個是「顯示訊息」按鈕，點擊後跳出一段文字，並且在方法裡再呼叫一個叫 `logDone` 的方法，用 `console.log` 印出「完成」。第二個是「打招呼」按鈕，點擊時帶入自己的名字，跳出 Hello 加上名字。

完成之後，打開瀏覽器的開發者工具，到 Console 確認「完成」有沒有印出來。

想一想，在 `showMessage` 裡呼叫 `logDone` 時，前面要加什麼？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示
### 完成步驟

1. 在 `app.component.html` 加入兩個按鈕：
   - `<button (click)="showMessage()">顯示訊息</button>`
   - `<button (click)="greet('你的名字')">打招呼</button>`

2. 在 `app.component.ts` 的 class 內定義三個方法：
   - `showMessage()` → `alert('訊息！')` 然後呼叫 `this.logDone()`
   - `greet(name: string)` → `alert('Hello, ' + name)`
   - `logDone()` → `console.log('完成！')`

3. 儲存後測試按鈕，並開啟 F12 → Console 確認 log

<!--
我們來看解題步驟。

第一步，在 HTML 加上兩個按鈕，分別用小括號 `click` 綁定 `showMessage()`，以及帶入名字的 `greet`。

第二步，在 TypeScript 的 class 裡定義三個方法。`showMessage` 先跳出訊息，再用 `this.logDone()` 呼叫第二個方法，這就是剛才問題的答案，要加 `this.`。`greet` 接收名字並顯示 Hello。`logDone` 則用 `console.log` 印出「完成」。

存檔之後點擊按鈕，再按 F12 打開開發者工具，切換到 Console 頁籤，就能看到「完成」被印出來。
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

# 補充練習：正方形面積計算器（return）

請撰寫一個有「回傳值」的方法，計算正方形的面積：

1. 在 TS 建立方法 `getArea(side: number): number`
2. 方法內使用 `return` 回傳 `side * side` 的計算結果
3. 建立另一個方法 `showArea()`，在內部宣告一個區域常數接收 `getArea()` 的結果，並用 `alert()` 顯示
4. 在 HTML 建立按鈕，點擊時呼叫 `showArea()`

<!--
這題補充練習要用到 `return`。

`getArea` 接收邊長，用 `return` 把面積回傳出去。`showArea` 呼叫 `getArea`，把結果存進一個常數，再用 `alert` 顯示。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習：正方形面積計算器 — 參考答案

```typescript
getArea(side: number): number {
  return side * side;
}

showArea() {
  const area = this.getArea(5);
  alert('正方形面積為：' + area);
}
```

```html
<button (click)="showArea()">計算面積</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 小括號後的 <code>: number</code> 是「回傳值的型別」；方法執行到 <code>return</code> 就會把結果交回呼叫的地方，並結束方法
</div>

<!--
我們來看答案。

`getArea` 的小括號後面寫 `: number`，代表這個方法會回傳一個數字。裡面只有一行，用 `return` 把邊長乘以邊長的結果交出去。

`showArea` 用 `this.getArea(5)` 呼叫它，回傳的 25 會存進 `area` 這個常數，最後用 `alert` 顯示。`return` 就像把計算結果交回給呼叫它的人，讓別的方法可以接著使用。
-->

---
layout: end
---

# 方法完成
### 讓程式碼可以重複被呼叫！

<!--
這一章我們學了方法。方法是一段有名字、可以重複呼叫的程式碼，由名稱、參數和程式碼區塊組成。在 Angular 的 class 裡宣告方法不用寫 `function`。HTML 用小括號 `click` 綁定事件來呼叫方法；class 裡的方法互相呼叫，要加上 `this.`。參數要寫型別，也可以設定預設值，而有預設值的參數要放在最後面。

下一章，我們會用一系列練習，把變數、型別和方法整合在一起。我們下一章見。
-->
