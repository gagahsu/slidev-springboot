---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: JavaScript 與 TypeScript 介紹
routeAlias: ch12
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
    JavaScript 與 TypeScript 介紹
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓網頁動起來，從 JS 到 TS 的演進」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
前面幾章，我們用 HTML 和 CSS 做好了網頁的結構和外觀。從這一章開始，要進入程式邏輯：JavaScript。

如果 HTML 是鋼筋水泥，CSS 是油漆家具，JavaScript 就是讓房子運作的水電。這一章會認識 JavaScript 和它的進階版 TypeScript，並看看 TypeScript 在 Angular 裡的樣子。
-->

---
layout: default
---

# Outline

- **JavaScript 是什麼？**
- **TypeScript 是什麼？**
- **TypeScript VS JavaScript**
- **JavaScript 實例** — 按鈕互動、用 `.value` / `.innerText` 讀取畫面內容
- **TypeScript 在 Angular 中** — 元件結構、`@Component` 裝飾器
- **實作練習**

<!--
這一章的路線是這樣的。先認識 JavaScript 和 TypeScript 各是什麼，再比較兩者的差別。接著用一個按鈕的小例子，看 HTML、CSS 和 JavaScript 怎麼一起運作，並學會讀取輸入框和標籤裡的內容。然後看 TypeScript 在 Angular 元件裡的寫法。最後有兩個練習，分別針對 TypeScript 和 JavaScript。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# JavaScript 是什麼？
# What is JavaScript?

<!--
我們先來認識 JavaScript。
-->

---

# JavaScript 是什麼？

JavaScript 是一種腳本，也能稱它為**程式語言**，可以讓你在網頁中實現出複雜的功能。

當網頁不只呈現靜態的內容，另外提供了像是：

- 內容即時更新
- 地圖互動
- 繪製 2D / 3D 圖形
- 影片播放控制……

你就可以大膽地認為 **JavaScript 已經參與其中**。

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 網頁的三層架構：<b>HTML</b>（內容）→ <b>CSS</b>（樣式）→ <b>JavaScript</b>（互動）
</div>

<!--
JavaScript 是一種程式語言，可以讓網頁實現比較複雜的功能。

想想看，我們滑社群網站滑到底，新的貼文自動出現，不用重新整理頁面；用地圖時，地圖會跟著手指移動；點擊播放，影片就開始播放。

只要網頁不只是顯示固定的內容，而是會「即時回應使用者」，背後幾乎都有 JavaScript 在運作。
-->

---

# JavaScript — 三層架構

HTML、CSS、JavaScript 分別負責網頁的不同層次：

<div style="display: flex; justify-content: center; align-items: center; gap: 3rem; margin-top: 1.2rem;">
  <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
    <div style="width: 220px; padding: 12px 0; background: #f7b977; text-align: center; font-weight: bold; font-size: 1rem; border-radius: 4px; color: #5a3a00;">JavaScript</div>
    <div style="width: 260px; padding: 12px 0; background: #5eada0; text-align: center; font-weight: bold; font-size: 1rem; border-radius: 4px; color: #fff;">CSS</div>
    <div style="width: 300px; padding: 12px 0; background: #4472C4; text-align: center; font-weight: bold; font-size: 1rem; border-radius: 4px; color: #fff;">HTML</div>
  </div>
  <div style="font-size: 0.95rem; line-height: 2.2;">
    <div><span style="color: #b07800; font-weight: bold;">JavaScript</span>：負責互動與行為邏輯</div>
    <div><span style="color: #3a8a80; font-weight: bold;">CSS</span>：負責視覺樣式與排版</div>
    <div><span style="color: #2a52a0; font-weight: bold;">HTML</span>：負責頁面結構與內容</div>
  </div>
</div>

<!--
我們來複習網頁的三層架構。

最底層是 HTML，負責頁面的結構和內容。中間是 CSS，負責視覺樣式和排版。最上層是 JavaScript，負責互動和行為邏輯。

三層各自負責不同的事，合在一起才是一個完整的網頁應用程式。少了 JavaScript，網頁就只能看，沒辦法回應使用者的操作。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# TypeScript 是什麼？
# What is TypeScript?

<!--
認識了 JavaScript，接下來我們看常常聽到的 TypeScript。
-->

---

# TypeScript 是什麼？

TypeScript 是一種由 **Microsoft** 開發的開源程式語言，它是 JavaScript 的一種**超集（Superset）**。

- 任何有效的 JavaScript 程式碼，也是有效的 TypeScript 程式碼
- TypeScript 為 JavaScript 新增了**類型系統（型別）**和其他功能：
  - `Interfaces`
  - `Generics`
  - `Enums`

這些功能使開發者能更有效地撰寫大型專案。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Angular</b> 就是使用 TypeScript 開發，所以要有一定的 JavaScript 基礎，才能更好地理解 TypeScript 的使用
</div>

<!--
TypeScript 是微軟開發的開源程式語言，它是 JavaScript 的「超集」。

超集的意思是，JavaScript 有的，TypeScript 全都有，而且還多了更多功能。任何可以執行的 JavaScript 程式碼，放進 TypeScript 裡也一樣能執行。

TypeScript 多出來的，最重要的是「型別系統」，另外還有 interface、泛型、enum 這些功能。

為什麼需要型別？因為 JavaScript 很多錯誤要等到執行時才會發現，TypeScript 則在寫程式的當下就提醒我們。Angular 就是用 TypeScript 開發的。
-->

---

# TypeScript VS JavaScript

雖然 TypeScript 與 JavaScript 在許多方面都很相似，但它們之間仍存在一些重要的區別：

| 比較項目 | JavaScript | TypeScript |
| --- | --- | --- |
| **類型系統** | 動態型別，變數類型可在執行期間改變 | 靜態型別，宣告時確定類型，有助於預先找出錯誤 |
| **編譯器** | 無需編譯，可在瀏覽器直接執行 | 需要編譯成 JavaScript 才能在瀏覽器執行 |
| **物件導向** | 有 `class` 與 `object`，但無 `interface` | 支援 `interface`、`class`、`object`，物件導向更直觀 |

<!--
我們把兩者放在一起比較。

第一是型別系統。JavaScript 是動態型別，一個變數一下裝數字、一下裝文字都可以，很有彈性，但也容易出錯。TypeScript 是靜態型別，宣告時就決定了型別，之後放錯型別的值，編輯器會馬上提醒。

第二是編譯。瀏覽器其實只看得懂 JavaScript，所以 TypeScript 寫好之後，要先編譯成 JavaScript，才能在瀏覽器上執行。

第三是物件導向。TypeScript 支援 `interface`，規劃程式架構時更直觀。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# JavaScript 實例
# JavaScript in Action

<!--
介紹完概念，我們用一個點擊按鈕跳出訊息的例子，看看 HTML、CSS 和 JavaScript 怎麼一起運作。
-->

---

# JavaScript 實例 — Step 1：HTML

先在 HTML 中建立一個按鈕，加入 `class` 命名樣式名稱，並加入 `onclick` 方法（觸發動作的固定寫法）：

```html
<!-- body 內是寫 HTML 內容 -->
<body>
  <button class="bntCss" onclick="clickBnt()">我是按鈕!點我!</button>
</body>
```

<div style="margin-top: 1rem; display: flex; align-items: center; gap: 1rem;">
  <div style="font-size: 0.9rem; color: #555;">畫面預覽：</div>
  <button style="padding: 4px 12px; border: 1px solid #ccc; background: #f5f5f5; cursor: pointer; font-size: 0.95rem;">我是按鈕!點我!</button>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>onclick="clickBnt()"</code> 表示「點擊時，執行名為 <code>clickBnt</code> 的方法」，方法名稱可自訂
</div>

<!--
第一步，先用 HTML 建立一個按鈕。

按鈕上加了一個 `class`，等一下給 CSS 使用。另外還有一個 `onclick` 屬性，值是 `clickBnt()`。

`onclick` 是點擊事件，這行的意思是告訴瀏覽器：「當使用者點擊這個按鈕時，去執行一個叫做 `clickBnt` 的方法」。方法的名稱可以自己取。
-->

---

# JavaScript 實例 — Step 2：CSS

用剛才在 HTML 設定的 `class` 名稱，來編輯按鈕的樣式：

```html
<!-- style 內是寫 CSS 內容 -->
<style>
  .bntCss {
    color: red;
  }
</style>
```

<div style="margin-top: 1rem; display: flex; align-items: center; gap: 1rem;">
  <div style="font-size: 0.9rem; color: #555;">套用樣式後：</div>
  <button style="padding: 4px 12px; border: 1px solid #ccc; background: #f5f5f5; cursor: pointer; font-size: 0.95rem; color: red;">我是按鈕!點我!</button>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 HTML、CSS 都已就位。接下來進入與使用者<b>互動</b>的部分 — JavaScript
</div>

<!--
第二步，用 CSS 幫按鈕加上樣式。

用剛才設定的 class 名稱當作選擇器，把文字顏色改成紅色。套用之後，按鈕上的文字就變成紅色了。

現在 HTML 和 CSS 都準備好了，但點擊按鈕還不會有任何反應，接下來就輪到 JavaScript。
-->

---

# JavaScript 實例 — Step 3：JavaScript

宣告剛才在 `onclick` 中自訂的方法名稱，並在其中撰寫要執行的動作：

```html
<!-- script 內是寫 JavaScript 內容 -->
<script>
  function clickBnt() {
    alert("你按按鈕了！")
  }
</script>
```

<div style="margin-top: 1rem; display: flex; align-items: center; gap: 1.5rem;">
  <div style="font-size: 0.9rem; color: #555;">點擊按鈕後：</div>
  <div style="border: 1px solid #aaa; border-radius: 6px; padding: 10px 18px; background: #f5f5f5; font-size: 0.9rem; box-shadow: 2px 2px 6px rgba(0,0,0,0.15);">
    <div style="font-weight: bold; margin-bottom: 4px; color: #333;">這個網頁顯示</div>
    <div style="color: #444; margin-bottom: 8px;">你按按鈕了！</div>
    <button style="padding: 3px 16px; border: 1px solid #aaa; background: #e8e8e8; border-radius: 3px; font-size: 0.85rem;">確定</button>
  </div>
</div>

<!--
第三步，加上 JavaScript。

在 `script` 標籤裡，宣告一個叫做 `clickBnt` 的 function，名稱要跟剛才 `onclick` 裡寫的一樣。裡面只有一行 `alert`，它是瀏覽器內建的功能，會跳出一個訊息框。

三個部分合在一起之後，使用者點擊按鈕，就會觸發 `onclick`，執行 `clickBnt`，畫面上跳出「你按按鈕了」的訊息框。

這就是網頁互動最基本的運作方式：HTML 提供元素，CSS 提供外觀，JavaScript 提供反應。
-->

---
zoom: 0.97
---

# 讀取畫面內容 — 輸入框用 .value

想拿到使用者在輸入框打的字，先用 `id` 找到標籤，再讀取它的 `.value`：

```html
<input id="userBox" type="text">
<button onclick="readInput()">讀取</button>

<script>
  function readInput() {
    let res = document.getElementById('userBox').value;
    console.log(res);
  }
</script>
```

| 語法 | 說明 |
| --- | --- |
| `document.getElementById('userBox')` | 用 `id` 在整個網頁中找到對應的標籤 |
| `.value` | 取得表單元素目前的值 |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>規則：</b> 使用者可以輸入或選取的表單元素（<code>input</code>、<code>select</code>、<code>textarea</code>），一律用 <code>.value</code> 取值
</div>

<!--
剛才的例子只是跳出訊息，接下來看怎麼讀取畫面上的內容。

`document` 代表整個網頁。`getElementById` 會用 id 去網頁裡找標籤，所以 HTML 的輸入框要先設定 `id="userBox"`。找到輸入框之後，讀取它的 `value`，就是使用者目前輸入的文字。

記住一個規則：只要是使用者可以輸入或選取的表單元素，像是 `input`、`select`、`textarea`，都用 `value` 取值。

要注意，`value` 拿到的一定是字串。就算使用者輸入的是數字，要拿來計算前，也要先用 `Number` 轉換。
-->

---
zoom: 0.94
---

# 讀取畫面內容 — 一般標籤用 .innerText

如果目標不是輸入框，而是 `<p>`、`<div>`、`<span>` 這類包住文字的標籤，就改用 `.innerText`：

```html
<p id="news">最新消息：今日停班停課</p>
<button onclick="readText()">讀取內文</button>

<script>
  function readText() {
    let txt = document.getElementById('news').innerText;   // 讀取
    alert(txt);
    document.getElementById('news').innerText = '消息已讀取';  // 改寫
  }
</script>
```

| 目標 | 使用屬性 |
| --- | --- |
| 輸入框、下拉選單等表單元素 | `.value` |
| 標籤包住的文字 | `.innerText` |

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 用錯屬性會拿到空值，例如對 <code>&lt;p&gt;</code> 讀 <code>.value</code> 會得到 <code>undefined</code>
</div>

<!--
一般的文字標籤，像段落、`div`，裡面的文字要用 `innerText` 讀取。

`innerText` 除了讀取，還可以改寫：在等號左邊放 `innerText`，右邊放新的文字，畫面上的內容就會立刻換掉。

整理一下：表單元素用 `value`，一般標籤包住的文字用 `innerText`。用錯屬性就拿不到資料，例如對段落讀 `value`，會得到 undefined。

這是原生 JavaScript 操作畫面的方式。之後在 Angular 裡，我們會改用資料繫結，讓變數和畫面自動同步，就很少需要自己去找標籤了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# TypeScript 在 Angular 中
# TypeScript in Angular

<!--
看完 JavaScript 的基本運作，接下來我們看看 TypeScript 在 Angular 專案裡長什麼樣子。
-->

---

# TypeScript 在 Angular — 元件結構

Angular 的邏輯寫在 `.ts` 檔案裡。打開 `app.component.ts`，你會看到這樣的結構：

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent {
  // ← 在這裡宣告變數
  // ← 在這裡宣告方法
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>export class AppComponent { }</code> 就是我們撰寫 TypeScript 的舞台，所有邏輯都寫在這對大括號裡
</div>

<!--
在 Angular 裡，元件的邏輯寫在 `.ts` 檔案中。打開 `app.component.ts`，會看到這樣的結構。

最上面用 `import` 引入 `Component`。中間的 `@Component` 叫做「裝飾器」，告訴 Angular 這個 class 是一個元件。

最下面的 `export class AppComponent`，它的大括號就是我們寫 TypeScript 的地方。之後的變數和方法，都會寫在這對大括號裡面。
-->

---

# TypeScript 在 Angular — @Component 裝飾器

`@Component` 是 Angular 的**裝飾器（Decorator）**，告訴框架這個 class 是一個元件，並設定它的基本行為：

| 屬性 | 說明 | 範例值 |
| --- | --- | --- |
| `selector` | 此元件在 HTML 中使用的自訂標籤名稱 | `'app-root'` |
| `standalone` | 是否為獨立元件（Angular 14+ 推薦） | `true` |
| `templateUrl` | 此元件對應的 HTML 模板檔案路徑 | `'./app.component.html'` |

```typescript
@Component({
  selector: 'app-root',       // → 在 HTML 中以 <app-root> 使用
  standalone: true,           // → 不需要 NgModule 包裝
  templateUrl: './app.component.html',  // → 對應的 HTML 檔案
})
export class AppComponent { }
```

<!--
我們仔細看 `@Component` 裝飾器裡的三個屬性。

`selector` 是這個元件在 HTML 裡使用的標籤名稱。設成 `app-root`，就可以在 HTML 裡用 `app-root` 這個標籤把元件放進來。

`standalone: true` 代表這是一個獨立元件，不需要另外用 NgModule 來管理，這是新版 Angular 推薦的寫法。

`templateUrl` 指定這個元件對應的 HTML 檔案，也就是元件的畫面要去哪個檔案找。

這三個屬性在之後的範例裡會一直出現，先記住它們的意思就好。
-->

---

# TypeScript 在 Angular — 宣告帶型別的變數

在 class 的大括號內，用 `變數名稱: 型別 = 初始值` 格式宣告變數：

```typescript
export class AppComponent {
  title: string = 'Hello Angular';
  count: number = 0;
  isLoading: boolean = false;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 型別緊接在冒號後面。賦值型別不符時，TypeScript 立刻劃紅線警告——不必等到執行才發現錯誤
</div>

<!--
在 class 的大括號裡宣告變數，格式是：變數名稱、冒號、型別、等號、初始值。

這裡宣告了三個變數。`title` 的型別是 `string`，只能放文字。`count` 是 `number`，只能放數字。`isLoading` 是 `boolean`，只能是 true 或 false。

如果不小心把數字放進 `string` 的變數，TypeScript 會立刻在下面畫紅線提醒，不用等到程式執行才發現錯誤，這就是 TypeScript 最大的價值。
-->

---
layout: default
---

# TypeScript 練習：任務說明
### 在 Angular 中宣告帶型別的變數

在 `app.component.ts` 的 `AppComponent` class 中，宣告以下三個帶型別的變數：

1. `myName`：字串型別，初始值為你的名字
2. `myAge`：數字型別，初始值為你的年齡
3. `isStudent`：布林型別，初始值為 `true` 或 `false`

完成後，試著把 `myAge` 指定為一個字串（如 `'twenty'`），觀察 TypeScript 的報錯訊息，再改回數字。

<!--
我們來做第一個練習，在 Angular 裡宣告帶型別的變數。

請在 `AppComponent` 裡宣告三個變數：字串型別的 `myName`，數字型別的 `myAge`，以及布林型別的 `isStudent`。

完成之後，試著把 `myAge` 改成一個字串，看看會發生什麼事，再把它改回數字。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# TypeScript 練習：解題提示

在 `app.component.ts` 的 class 裡加入三行：

```typescript
export class AppComponent {
  myName: string = '你的名字';
  myAge: number = 20;
  isStudent: boolean = true;
}
```

嘗試把 `myAge` 改成字串時，TypeScript 立刻報錯：

```
Type 'string' is not assignable to type 'number'
```

改回數字後紅線消失。這就是**靜態型別檢查**的威力——在編譯階段就攔截錯誤！

<!--
我們來看答案。

在 class 裡加上三行宣告，分別是 `string`、`number` 和 `boolean`。

當我們把 `myAge` 改成字串，TypeScript 會出現這個錯誤訊息，意思是「字串型別不能指定給數字型別」。把它改回數字，紅線就消失了。

這就是「靜態型別檢查」，在寫程式的階段就把錯誤攔下來。專案規模變大之後，這種保護能省下很多除錯的時間。
-->

---
layout: default
---

# 練習：任務說明
### 整合 HTML、CSS、JavaScript

建立一個 HTML 網頁，在同一個檔案中整合三層，實作以下功能：

1. 建立「打招呼」和「掰掰」兩個按鈕
2. 點擊「打招呼」按鈕時，`alert` 顯示 `'哈囉！歡迎來到 JavaScript 的世界！'`
3. 點擊「掰掰」按鈕時，`alert` 顯示 `'掰掰！下次再見！'`
4. 在 `<style>` 中為兩個按鈕各自設定不同的文字顏色

<!--
第二個練習，我們回到純 JavaScript，把 HTML、CSS 和 JavaScript 整合在同一個檔案裡。

請建立兩個按鈕：「打招呼」和「掰掰」。點擊「打招呼」，跳出歡迎的訊息；點擊「掰掰」，跳出道別的訊息。另外，在 `style` 裡幫兩個按鈕設定不同的文字顏色。

可以新建一個 `.html` 檔案，用瀏覽器直接打開測試。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示（1 / 2）
### Step 1 & 2 — HTML 結構與 CSS 樣式

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .btn-hello { color: green; }
    .btn-bye   { color: red;   }
  </style>
</head>
<body>

  <button class="btn-hello" onclick="sayHello()">打招呼</button>
  <button class="btn-bye"   onclick="sayBye()">掰掰</button>

</body>
</html>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 按鈕的 <code>onclick</code> 填入方法名稱（<code>sayHello()</code>），方法名稱可自訂，但要與下一步的 function 名稱完全一致
</div>

<!--
我們分兩步來看答案，先看 HTML 和 CSS。

兩個按鈕各自有不同的 class，在 `style` 裡分別設定綠色和紅色。按鈕的 `onclick` 分別填上 `sayHello()` 和 `sayBye()`。

注意，這時候方法本身還沒寫，所以點擊按鈕還不會有反應。
-->

---
layout: default
---

# 練習：解題提示（2 / 2）
### Step 3 — 在 `</body>` 前加入 JavaScript

```html
  <script>
    function sayHello() {
      alert('哈囉！歡迎來到 JavaScript 的世界！');
    }
    function sayBye() {
      alert('掰掰！下次再見！');
    }
  </script>

</body>
</html>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>&lt;script&gt;</code> 內的 <code>function</code> 名稱必須與 HTML 的 <code>onclick</code> 完全一致；這裡不是 Angular，不需要 <code>class</code>，直接宣告 <code>function</code> 即可
</div>

<!--
第二步，在 `body` 結束之前加上 `script` 標籤，宣告兩個 function：`sayHello` 和 `sayBye`，裡面分別用 `alert` 顯示對應的訊息。

function 的名稱要跟 `onclick` 裡寫的完全一樣，三個部分才會接起來。

另外提醒一下，這裡是純 JavaScript，不是 Angular，所以不需要 class，直接宣告 function 就可以了。存檔後用瀏覽器打開，點兩個按鈕，就會跳出各自的訊息。
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

# 補充練習 1–2：Console 輸出與點擊改寫文字

**練習 1：** 在 HTML 的 `<script>` 中宣告兩個變數，並在 Console 組裝印出訊息：

```html
<script>
  let name = '練習生';
  let days = 30;
  // 印出：練習生已經學習了 30 天
</script>
```

**練習 2：** 建立一個按鈕，點擊後把指定段落的文字改寫：

```html
<p id="status">原本的狀態：等待點擊</p>
<button onclick="update()">變更</button>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>document.getElementById('id')</code> 可以用 id 抓到 HTML 標籤；標籤的 <code>.innerText</code> 就是它裡面的文字
</div>

<!--
接下來是兩題補充練習。

第一題，在 `script` 裡宣告 `name` 和 `days` 兩個變數，用 `console.log` 組合成一句話印出來。

第二題，畫面上有一個段落和一個按鈕，點擊按鈕後要把段落的文字換掉。這裡會用到一個新工具：`document.getElementById`，它可以用 id 找到 HTML 標籤；找到之後，改它的 `innerText`，就能換掉裡面的文字。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```html
<script>
  let name = '練習生';
  let days = 30;
  console.log(name + '已經學習了 ' + days + ' 天');
</script>
```

```html
<p id="status">原本的狀態：等待點擊</p>
<button onclick="update()">變更</button>

<script>
  function update() {
    document.getElementById('status').innerText = '狀態已更新！';
  }
</script>
```

<!--
我們來看答案。

第一題用加號把字串和變數串起來，再用 `console.log` 印出，打開 F12 的 Console 就能看到。

第二題先寫一個 `update` 方法，按鈕的 `onclick` 呼叫它。方法裡用 `getElementById('status')` 找到段落，再把新的文字指定給 `innerText`。點下按鈕，段落的文字就會立刻換掉。
-->

---
layout: default
---

# 補充練習 3–4：撈取輸入框與標籤內容

**練習 3：雙數加總計算器**

建立兩個輸入框與一個按鈕，點擊時把兩個輸入框的值（`.value`）相加，用 `alert()` 顯示結果。

<div class="mt-2 mb-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 輸入框撈出來的值是<b>字串</b>，記得先用 <code>Number()</code> 轉成數字再相加
</div>

**練習 4：DOM 文字複製器**

建立一個 `<h3 id="source">` 內含任意文字，以及一個原本空白的 `<div>`。點擊按鈕時，用 `.innerText` 撈出 `<h3>` 的內容，指派給 `<div>`。

<!--
再來兩題，練習從畫面上把資料撈出來。

第三題，畫面上有兩個輸入框，點按鈕時把兩個值相加，用 `alert` 顯示。輸入框要用 `.value` 取值。要注意，撈出來的值是字串，直接相加會變成字串接在一起，例如 1 加 2 會變成 12，記得先轉成數字。

第四題，用 `.innerText` 撈出 `h3` 的文字，再指派給另一個空白的 `div`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3–4 — 參考答案

```html
<input id="num1" type="number">
<input id="num2" type="number">
<button onclick="sum()">加總</button>

<h3 id="source">我是要被複製的文字</h3>
<div id="target"></div>
<button onclick="copyText()">複製</button>

<script>
  function sum() {
    let num1 = Number(document.getElementById('num1').value);
    let num2 = Number(document.getElementById('num2').value);
    alert('加總結果：' + (num1 + num2));
  }

  function copyText() {
    let text = document.getElementById('source').innerText;
    document.getElementById('target').innerText = text;
  }
</script>
```

<!--
我們來看答案。

`sum` 方法裡，先用 `getElementById` 找到兩個輸入框，取出 `.value`，再用 `Number` 轉成數字，最後相加後用 `alert` 顯示。注意加總那裡要用小括號包起來，不然會先跟前面的字串接在一起。

`copyText` 方法先撈出 `source` 的 `innerText`，再把它指派給 `target` 的 `innerText`，空白的 `div` 就會出現同樣的文字。
-->

---
layout: end
---

# JavaScript 介紹完成
### 互動的起點，從這裡開始！

<!--
這一章我們認識了 JavaScript，它負責網頁的互動和邏輯。TypeScript 是 JavaScript 的超集，加上了型別系統，能在寫程式時就發現錯誤，Angular 就是用 TypeScript 開發的。我們也看到了 Angular 元件的結構，以及帶型別的變數怎麼宣告。

下一章，我們會深入介紹 TypeScript 的各種資料型別。我們下一章見。
-->
