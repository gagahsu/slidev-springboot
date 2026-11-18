---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 繫結
routeAlias: ch21
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
    繫結
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「連結 TypeScript 與 HTML 的橋樑」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們把畫面拆成了元件。這一章要深入了解 TypeScript 和 HTML 之間怎麼傳遞資料，這叫做「繫結」，英文是 Data Binding。

有了繫結，資料一改變，畫面就跟著更新；使用者一操作，TypeScript 也能立刻收到。前面零星用過幾種，這一章會把四種繫結完整整理一遍。
-->

---
layout: default
---

# Outline

- **繫結介紹** — 什麼是繫結、四種類型
- **單向 vs 雙向綁定** — 差異比較
- **內嵌繫結** `{{ }}`
- **屬性繫結** `[attr]` — 含 `[disabled]`、`[class.xxx]`、`[ngClass]`
- **事件繫結** `(event)` — 含 `$event` 事件物件
- **雙向繫結** `[(ngModel)]`
- **實作練習**

<!--
這一章會先介紹繫結的概念和四種類型，並比較單向和雙向綁定的差別。接著逐一介紹四種繫結：雙大括號的內嵌繫結、中括號的屬性繫結、小括號的事件繫結，以及中括號包小括號的雙向繫結。最後用一個等級計算機的練習，把四種繫結全部用上。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 認識繫結
# Binding Overview

<!--
我們先來看繫結的整體概念。
-->

---

# 繫結介紹

繫結（Data Binding）是 Angular 協調 **Component（TypeScript）** 與 **Template（HTML）** 互相傳遞資料的機制。

| 繫結類型 | 語法 | 方向 |
| --- | --- | --- |
| 內嵌繫結 | `{{ 變數 }}` | 單向 TS → HTML |
| 屬性繫結 | `[屬性]="變數"` | 單向 TS → HTML |
| 事件繫結 | `(事件)="方法()"` | 單向 HTML → TS |
| 雙向繫結 | `[(ngModel)]="變數"` | 雙向 TS ↔ HTML |

<!--
繫結，是 Angular 讓「元件的 TypeScript」和「模板的 HTML」互相傳遞資料的機制。

Angular 提供四種繫結。內嵌繫結用雙大括號，把 TypeScript 的資料顯示成文字。屬性繫結用中括號，把變數設定到 HTML 標籤的屬性上。事件繫結用小括號，當 HTML 發生事件時，呼叫 TypeScript 的方法。雙向繫結用中括號包小括號，讓兩邊保持同步。

注意看方向這一欄。前兩種是從 TypeScript 到 HTML，事件繫結是從 HTML 到 TypeScript，雙向繫結則是兩個方向都有。括號的寫法，就代表資料流動的方向。
-->

---

# 單向綁定 vs 雙向綁定

| | 單向綁定 (One-Way Binding) | 雙向綁定 (Two-Way Binding) |
| --- | --- | --- |
| 方向 | TS → HTML（或 HTML → TS） | TS ↔ HTML |
| 包含類型 | 內嵌、屬性、事件繫結 | 雙向繫結 |
| 適用情境 | 純顯示（`<title>`）或純觸發 | 使用者輸入（`<input>`） |
| 特性 | HTML 更新不影響 TS | 任一方改變，另一方同步更新 |

<!--
繫結可以分成單向和雙向兩類。

單向綁定就像廣播，資料只往一個方向流。內嵌和屬性繫結是 TypeScript 傳到 HTML，事件繫結是 HTML 傳到 TypeScript。適合純顯示的內容，或是單純觸發動作。

雙向綁定則像講電話，任何一方改變，另一方都會同步更新。它最常用在輸入框上，使用者一邊打字，TypeScript 裡的變數就同步改變。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 四種繫結方式
# Four Binding Types

<!--
看完整體概念，接下來我們逐一看四種繫結的寫法。
-->

---

# 內嵌繫結 Interpolation

在 HTML 中直接顯示 TypeScript 變數值，使用雙大括弧語法。

| 特性 | 說明 |
| --- | --- |
| 語法 | `{{ 變數名稱 }}` |
| 方向 | 單向：TS → HTML |
| 用途 | 顯示文字、數值、表達式 |

```html
<h1>{{ title }}</h1>
<p>等級：{{ level }}</p>
<p>計算結果：{{ 1 + 2 }}</p>
```

<!--
第一種是內嵌繫結，英文是 Interpolation，也就是雙大括號。

它的方向是從 TypeScript 到 HTML，用來顯示文字和數值。雙大括號裡除了放變數，還可以寫簡單的運算式，例如寫 1 加 2，畫面上就會直接顯示 3。
-->

---

# 內嵌繫結 — 範例

```typescript
// app.component.ts
export class AppComponent {
  title = '我的 Angular 應用';
  level = 1;
  name = 'Allen';
}
```

```html
<!-- app.component.html -->
<h1>{{ title }}</h1>
<p>玩家：{{ name }}，等級：{{ level }}</p>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 內嵌繫結只能用在標籤的<b>內容</b>（標籤之間），無法直接用在 HTML 屬性值中（例如 <code>src</code>、<code>placeholder</code>）。
</div>

<!--
我們看範例。

TypeScript 裡宣告了 `title`、`level` 和 `name` 三個變數。HTML 裡用雙大括號把它們放進 `h1` 和段落裡，畫面就會顯示「我的 Angular 應用」，以及玩家名稱和等級。

要注意，內嵌繫結用在標籤的內容，也就是開始和結束標籤之間。要設定 `src`、`placeholder` 這類屬性時，建議改用下一種：屬性繫結。
-->

---
layout: default
---

# 內嵌繫結 — 小節練習

宣告以下三個變數，並在 HTML 中顯示商品名稱、單價、數量，以及用 `{{ }}` 直接計算總價：

```typescript
product = '筆記型電腦';
price = 25000;
qty = 3;
```

<!--
我們用一個小練習熟悉內嵌繫結。

請宣告商品名稱、單價和數量三個變數，在 HTML 顯示這三個值，並且直接在雙大括號裡計算總價。

想一想，總價要怎麼在雙大括號裡寫出來？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 內嵌繫結 — 小節練習解答

```typescript
product = '筆記型電腦';
price = 25000;
qty = 3;
```

```html
<p>商品：{{ product }}</p>
<p>單價：{{ price }} 元</p>
<p>數量：{{ qty }}</p>
<p>總計：{{ price * qty }} 元</p>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>{{ price * qty }}</code> 會直接計算並顯示 <code>75000</code>，雙大括號內可以寫簡單的運算表達式
</div>

<!--
我們來看答案。

商品、單價、數量各自用雙大括號顯示。總價則直接在雙大括號裡寫 `price` 乘以 `qty`，Angular 顯示畫面時會自動計算，25000 乘以 3，顯示 75000。

雙大括號裡可以寫這種簡單的運算，但比較複雜的邏輯，還是建議寫在 TypeScript 的方法裡。
-->

---

# 屬性繫結 Property Binding

將 TypeScript 變數與 HTML 標籤的**屬性**繫結，屬性名稱需加中括弧。

| 特性 | 說明 |
| --- | --- |
| 語法 | `[屬性名稱]="變數名稱"` |
| 方向 | 單向：TS → HTML |
| 用途 | 動態設定 `src`、`placeholder`、`disabled` 等屬性 |

```html
<!-- 屬性繫結寫法：中括弧，值只能放變數 -->
<input [placeholder]="hintText">

<!-- 傳統寫法：可混用文字與變數（用雙層大括弧包變數） -->
<img src="{{ imgUrl }}">
```

<!--
第二種是屬性繫結，英文是 Property Binding。

當我們要用變數控制 HTML 標籤的屬性，例如圖片的 `src`、輸入框的 `placeholder`、按鈕的 `disabled`，就用屬性繫結。

寫法是用中括號把屬性名稱包起來，等號後面的引號裡直接寫變數名稱。例如 `placeholder` 加上中括號，等於 `hintText`。中括號的意思是告訴 Angular：「引號裡不是一般文字，而是 TypeScript 的變數」。

畫面最下面那行，是用雙大括號設定屬性的寫法，雖然也能運作，但純變數的情況建議用中括號。
-->

---

# 屬性繫結 — 兩種寫法比較（1／2）

兩種寫法皆可運行，建議依情況選擇最清晰的方式：

| 寫法 | 語法 | 建議時機 |
| --- | --- | --- |
| 屬性繫結 | `[placeholder]="變數"` | ✅ 值是純變數時 |
| 內嵌屬性 | `src="{{ 變數 }}"` | 需要拼接字串時 |

```typescript
// app.component.ts
export class AppComponent {
  hintText = '請輸入姓名';
  imgUrl = 'assets/photo.png';
}
```

<!--
這兩種寫法都能運作，我們來比較一下使用時機。

看表格，當屬性的值就是一個變數時，用中括號的屬性繫結。只有在需要把變數和其他文字拼接起來時，才用雙大括號寫在屬性裡。

TypeScript 這邊，我們宣告了提示文字 `hintText` 和圖片路徑 `imgUrl`，下一頁看 HTML 怎麼寫。
-->

---

# 屬性繫結 — 兩種寫法比較（2／2）

```html
<!-- ✅ 屬性繫結：值直接來自變數（推薦） -->
<input [placeholder]="hintText">
<img [src]="imgUrl">

<!-- 內嵌寫法：需要與固定字串拼接時使用 -->
<img src="https://example.com/{{ imgUrl }}">
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 純變數一律用 <code>[attr]="變數"</code>；只有需要拼接字串（如 URL 前綴）時，才改用 <code>attr="{{ 變數 }}"</code>
</div>

<!--
這是 HTML 的寫法。

前兩行的值都是純變數，所以用中括號的 `placeholder` 和 `src`，程式碼比較清楚。

最後一行需要在網址前面加上固定的前綴，再接上變數，這種拼接字串的情況，才用雙大括號寫在 `src` 裡。
-->

---

# 屬性繫結 — [disabled] 條件控制

`[disabled]` 可傳入**布林變數**或**方法回傳值**來動態啟用或禁用按鈕。建議將條件邏輯抽到 TS 方法，模板只負責呼叫：

```typescript
export class AppComponent {
  level = 1;

  isMinLevel() { return this.level <= 1;  }
  isMaxLevel() { return this.level >= 99; }
}
```

```html
<button [disabled]="isMinLevel()">降級</button>
<button [disabled]="isMaxLevel()">升級</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 條件為 <code>true</code> 時按鈕禁用、<code>false</code> 時可用。含 <code>&lt;</code> 的條件式放在 TS 方法裡，可避免 HTML 屬性值中 <code>&lt;</code> 被誤判為標籤的問題。
</div>

<!--
屬性繫結很常用來控制按鈕能不能點，也就是 `disabled`。

中括號 `disabled` 可以傳入布林變數，也可以傳入方法的回傳值。這裡我們寫了兩個方法：`isMinLevel` 判斷等級是不是小於等於 1，`isMaxLevel` 判斷是不是大於等於 99。

條件為 true 時，按鈕就會被停用；為 false 時，按鈕可以點擊。所以等級是 1 的時候，降級按鈕會不能按。

把條件寫在 TypeScript 方法裡還有一個好處：HTML 屬性裡如果直接寫小於符號，有時會被誤認成標籤的開頭，寫在方法裡比較安全，模板也更簡潔。
-->

---

# 屬性繫結 — Class 繫結 `[class.xxx]`

`[class.xxx]="條件"` — 條件為 `true` 時加上該 class，`false` 時移除：

```typescript
// app.component.ts
isSelected = false;
select() { this.isSelected = !this.isSelected; }
```

```html
<!-- app.component.html -->
<button [class.selected]="isSelected" (click)="select()">選取</button>
```

```scss
/* app.component.scss */
button { padding: 8px 16px; border: 1px solid #ccc; cursor: pointer; }
.selected { background-color: #3498db; color: white; border-color: #2980b9; }
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Angular 在 <code>isSelected</code> 為 <code>true</code> 時，自動將 <code>selected</code> class 加進 HTML；<code>false</code> 時移除。CSS 裡定義 <code>.selected</code> 的樣式即可生效。
</div>

<!--
屬性繫結也能控制 class，寫法是中括號 `class.` 加上 class 名稱。

條件為 true 時，Angular 會把這個 class 加到元素上；為 false 時就移除。

看範例，TypeScript 裡有一個 `isSelected`，點擊按鈕時，`select` 方法會把它反轉。HTML 裡的按鈕寫了中括號 `class.selected` 等於 `isSelected`。SCSS 裡則定義了 `.selected` 是藍底白字。

所以每點一次按鈕，它就會在一般樣式和藍底白字之間切換。三個檔案各自負責一部分，Angular 會自動把它們串起來。
-->

---

# 屬性繫結 — `[ngClass]` 多個 Class

同時控制多個 class 時，改用 `[ngClass]`，傳入一個物件（key = class 名稱，value = 條件）：

```typescript
// app.component.ts
import { NgClass } from '@angular/common';
// 在 @Component imports 加入 NgClass

isActive = true;
hasError = false;
```

```html
<!-- app.component.html -->
<div [ngClass]="{'active': isActive, 'error': hasError}">狀態區塊</div>
```

```scss
/* app.component.scss */
.active { background-color: #d4edda; padding: 8px; }
.error  { background-color: #f8d7da; padding: 8px; }
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>isActive</code> 與 <code>hasError</code> 可同時為 <code>true</code>，兩個 class 會同時套用；使用 <code>[ngClass]</code> 前需在 <code>@Component</code> 的 <code>imports</code> 加入 <code>NgClass</code>
</div>

<!--
如果要同時控制好幾個 class，可以改用 `ngClass`。

它接收一個物件，左邊是 class 名稱，右邊是條件。這裡 `active` 對應 `isActive`，`error` 對應 `hasError`。條件為 true 的 class 會被加上去，兩個條件都成立，兩個 class 就會同時套用。

簡單分辨：中括號 `class.` 一次控制一個 class，`ngClass` 可以一次管理多個。

使用 `ngClass` 之前，記得從 `@angular/common` 引入 `NgClass`，並加進 `imports` 陣列。
-->

---
layout: default
---

# 屬性繫結 — 小節練習

宣告以下變數，用屬性繫結完成 HTML，讓輸入框有提示文字、VIP 標籤有高亮樣式、按鈕在非 VIP 時禁用：

```typescript
isVip = true;
inputHint = '請輸入會員編號';
```

```scss
.highlight { color: #f39c12; font-weight: bold; }
```

<!--
我們用一個小練習熟悉屬性繫結。

請用三種屬性繫結完成 HTML：讓輸入框顯示 `inputHint` 這段提示文字，讓 VIP 標籤在 `isVip` 為 true 時套用 `highlight` 樣式，並讓按鈕在不是 VIP 時被停用。

想一想，「不是 VIP 時停用」，`disabled` 裡要怎麼寫？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 屬性繫結 — 小節練習解答

```html
<input [placeholder]="inputHint" />
<p [class.highlight]="isVip">VIP 會員</p>
<button [disabled]="!isVip">專屬優惠</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>[disabled]="!isVip"</code>：<code>isVip</code> 為 <code>true</code> 時 <code>!isVip</code> 是 <code>false</code>，按鈕可用；<code>isVip</code> 為 <code>false</code> 時按鈕禁用
</div>

<!--
我們來看答案。

輸入框用中括號 `placeholder` 綁定 `inputHint`。VIP 標籤用中括號 `class.highlight` 綁定 `isVip`。

按鈕的部分，用中括號 `disabled` 等於驚嘆號 `isVip`。驚嘆號會把值反轉：是 VIP 時，`isVip` 是 true，反轉後是 false，按鈕可以按；不是 VIP 時，反轉後是 true，按鈕就被停用。
-->

---

# 事件繫結 Event Binding

HTML 事件觸發時，呼叫 TypeScript 中對應的方法。

| 特性 | 說明 |
| --- | --- |
| 語法 | `(事件名稱)="方法名稱()"` |
| 方向 | 單向：HTML → TS |
| 常用事件 | `click`、`input`、`change`、`submit` |

```html
<button (click)="levelUp()">升級</button>
<input (input)="onInput($event)">
```

<!--
第三種是事件繫結，英文是 Event Binding，方向是從 HTML 到 TypeScript。

寫法是用小括號把事件名稱包起來，等號後面寫要執行的方法。常用的事件有點擊 `click`、輸入 `input`、改變 `change` 和送出 `submit`。

例如小括號 `click` 等於 `levelUp()`，使用者一點擊，就會執行 TypeScript 裡的 `levelUp` 方法。
-->

---

# 事件繫結 — 範例

```typescript
// app.component.ts
export class AppComponent {
  level = 1;

  levelUp() {
    this.level++;
  }
}
```

```html
<!-- app.component.html -->
<p>目前等級：{{ level }}</p>
<button (click)="levelUp()">升級</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> 事件繫結的方法後面要加 <code>()</code>，表示「呼叫」該方法，而非傳入方法參考。
</div>

<!--
我們看範例。

TypeScript 裡有一個 `level` 變數，以及一個 `levelUp` 方法，每次呼叫就把等級加 1。

HTML 裡，按鈕用事件繫結呼叫 `levelUp`，上面再用雙大括號顯示 `level`。

點擊按鈕後，`level` 加 1，因為它和雙大括號綁在一起，畫面上的等級也會馬上更新。這就是事件繫結和內嵌繫結搭配使用的典型例子。

另外注意，事件繫結裡的方法名稱後面要加小括號，代表「呼叫」這個方法。
-->

---

# 事件繫結 — $event 事件物件

`$event` 是 Angular 傳入事件處理方法的**原生事件物件**，可用來取得使用者輸入的值：

```typescript
export class AppComponent {
  keyword = '';

  onSearch(event: Event) {
    this.keyword = (event.target as HTMLInputElement).value;
  }
}
```

```html
<input (input)="onSearch($event)" placeholder="搜尋...">
<p>目前輸入：{{ keyword }}</p>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>$event</code> 的型別是 <code>Event</code>，需用 <code>as HTMLInputElement</code> 轉型才能存取 <code>.value</code>；若不需要事件物件，方法可以不帶參數
</div>

<!--
事件繫結還可以把事件本身的資訊傳給方法，這要用到 `$event`。

`$event` 是 Angular 傳進來的原生事件物件，可以用它取得使用者輸入的內容。

看範例，輸入框用小括號 `input` 監聽輸入事件，把 `$event` 傳給 `onSearch`。在方法裡，因為 TypeScript 不確定事件來源一定是輸入框，所以要用 `as HTMLInputElement` 告訴它「這是一個輸入框元素」，才能讀取 `.value`，也就是使用者輸入的文字。

結果是使用者每輸入一個字，下方的「目前輸入」就會同步顯示。
-->

---
layout: default
---

# 事件繫結 — 小節練習

做一個點擊計數器：畫面顯示點擊次數，點擊按鈕次數 +1，並提供重置按鈕歸零。

<!--
我們用一個小練習熟悉事件繫結。

請做一個點擊計數器：畫面顯示點擊次數，點擊按鈕時次數加 1，另外再做一個重置按鈕，把次數歸零。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 事件繫結 — 小節練習解答

```typescript
count = 0;

addCount() { this.count++; }
reset()    { this.count = 0; }
```

```html
<p>點擊次數：{{ count }}</p>
<button (click)="addCount()">點擊 +1</button>
<button (click)="reset()">重置</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 每次點擊觸發方法修改 <code>count</code>，<code>{{ count }}</code> 透過內嵌繫結即時同步畫面，不需要手動更新 DOM
</div>

<!--
我們來看答案。

TypeScript 裡宣告 `count` 等於 0，再寫兩個方法：`addCount` 把 `count` 加 1，`reset` 把它設回 0。

HTML 裡兩個按鈕各自用小括號 `click` 綁定對應的方法，上方用雙大括號顯示 `count`。每次點擊改變 `count`，畫面就會自動更新，不需要我們手動去改畫面。
-->

---

# 雙向繫結 Two-Way Binding

TS 變數與 HTML 輸入元素同步更新，不管哪邊改變另一邊都會跟著更新。

| 特性 | 說明 |
| --- | --- |
| 語法 | `[(ngModel)]="變數名稱"` |
| 方向 | 雙向：TS ↔ HTML |
| 適用元素 | `<input>`、`<select>`、`<textarea>` |
| 前置條件 | 需匯入 `FormsModule` |

```html
<input [(ngModel)]="username">
<p>您輸入：{{ username }}</p>
```

<!--
第四種是雙向繫結，英文是 Two-Way Binding。

它讓 TypeScript 的變數和 HTML 的輸入元素保持同步，不管哪一邊改變，另一邊都會跟著更新。

寫法是中括號裡面包小括號，再加上 `ngModel`。這個括號的樣子，常被形容成「盒子裡的香蕉」：小括號像一根彎彎的香蕉，被裝在中括號這個盒子裡。

在輸入框寫上它，綁定 `username`。使用者在輸入框打字，`username` 就同步改變；在 TypeScript 裡改變 `username`，輸入框的內容也會跟著變。它適用於 `input`、`select` 和 `textarea`。
-->

---

# 雙向繫結 — 匯入 FormsModule

使用 `ngModel` 前，必須將 `FormsModule` 加入元件的 `imports` 陣列，否則 HTML 會報錯「無法識別 ngModel 屬性」。

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  username = '';
}
```

<!--
使用 `ngModel` 有一個前提：必須先匯入 `FormsModule`。

因為 `ngModel` 不是 HTML 原生的屬性，而是 Angular 表單模組提供的功能。所以要從 `@angular/forms` 引入 `FormsModule`，並加進元件的 `imports` 陣列。

如果忘了這一步，HTML 會出現「無法識別 ngModel」的錯誤，這是初學者最常卡住的地方。
-->

---

# 雙向繫結 — 完整範例

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  inputLevel = 1;

  updateStats() {
    // 依 inputLevel 重新計算攻擊力與防禦力
  }
}
```

```html
<input [(ngModel)]="inputLevel" type="number">
<button (click)="updateStats()">修改等級</button>
<p>等級：{{ inputLevel }}</p>
```

<!--
這是雙向繫結和事件繫結搭配的完整範例。

TypeScript 已經匯入 `FormsModule`，並宣告了 `inputLevel`。HTML 裡的數字輸入框用 `ngModel` 雙向綁定 `inputLevel`，下方用雙大括號顯示它。

使用者在輸入框改了數字，`inputLevel` 就已經同步更新了。接著點擊「修改等級」按鈕，觸發 `updateStats` 方法，方法裡就可以直接使用最新的 `this.inputLevel` 來重新計算數值。
-->

---
layout: default
---

# 雙向繫結 — 小節練習

用 `[(ngModel)]` 做一個即時暱稱輸入框，使用者輸入時下方同步顯示歡迎語；若未輸入則顯示「陌生人」。

<!--
我們用一個小練習熟悉雙向繫結。

請用 `ngModel` 做一個暱稱輸入框，使用者輸入時，下方同步顯示歡迎語；如果還沒輸入，就顯示「陌生人」。

提示一下，可以用兩條直線，也就是「或者」，在暱稱是空的時候提供預設值。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 雙向繫結 — 小節練習解答

```typescript
import { FormsModule } from '@angular/forms';
// 在 @Component imports 加入 FormsModule

nickname = '';
```

```html
<input [(ngModel)]="nickname" placeholder="輸入暱稱">
<p>你好，{{ nickname || '陌生人' }}！</p>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>nickname || '陌生人'</code>：當 <code>nickname</code> 是空字串（falsy）時，顯示 <code>'陌生人'</code> 作為預設值
</div>

<!--
我們來看答案。

先匯入 `FormsModule`，宣告 `nickname` 為空字串。輸入框用 `ngModel` 綁定 `nickname`。

下方的歡迎語寫成雙大括號 `nickname` 或者「陌生人」。空字串在判斷時會被當成 false，所以還沒輸入時，就會顯示後面的「陌生人」；一旦輸入了內容，就顯示輸入的暱稱。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習
# Practice

<!--
四種繫結都介紹完了，接下來我們做一個等級計算機，把它們全部用上。
-->

---
layout: two-cols
---

# 練習 1：等級計算機
### 任務說明

1. 顯示目前**等級**、**攻擊力**、**防禦力**
2. **升級按鈕**：等級 +1，攻擊力 = 等級 × 3，防禦力 = 等級 × 2
3. **輸入框**：可直接輸入目標等級（使用雙向繫結）
4. **修改等級按鈕**：依輸入框的等級重新計算攻擊力與防禦力
5. **重置按鈕**：等級、攻擊力、防禦力恢復至 1 等（攻擊 3、防禦 2）

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/20-binding/practice-1.png" class="rounded shadow-md max-h-80" />
</div>

<!--
練習一是一個等級計算機。

畫面要顯示目前的等級、攻擊力和防禦力。升級按鈕讓等級加 1，攻擊力是等級乘以 3，防禦力是等級乘以 2。另外有一個輸入框，可以直接輸入目標等級，要用雙向繫結；按下修改等級按鈕，就依照輸入的等級重新計算。最後是重置按鈕，全部回到 1 等，也就是攻擊 3、防禦 2。

想一想，這個練習裡，四種繫結分別會用在哪裡？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 1：解題提示
### 提示說明

1. 宣告四個變數：`level = 1`、`attack = 3`、`defense = 2`、`inputLevel = 1`
2. **升級方法**：`level++`，然後 `attack = level * 3; defense = level * 2`
3. **修改等級方法**：`level = this.inputLevel`，再重新計算攻擊與防禦
4. **重置方法**：`level = 1; attack = 3; defense = 2`
5. 輸入框使用 `[(ngModel)]="inputLevel"` 進行雙向繫結
6. 三個按鈕各用 `(click)` 事件繫結對應方法

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記得</b> 在 <code>imports</code> 加入 <code>FormsModule</code> 才能使用 <code>[(ngModel)]</code>
</div>

<!--
我們來看解題提示。

第一，宣告四個變數：`level`、`attack`、`defense`，以及給輸入框用的 `inputLevel`。第二，升級方法讓等級加 1，再重新計算攻擊和防禦。第三，修改等級方法把 `inputLevel` 指定給 `level`，再重新計算。第四，重置方法把數值設回初始值。

最後，輸入框用 `ngModel` 雙向綁定 `inputLevel`，三個按鈕各自用小括號 `click` 綁定對應的方法。記得匯入 `FormsModule`。
-->

---
layout: two-cols
---

# 練習 2：等級計算機加強版
### 任務說明

1. **UI 美化**：排版成較美觀的版面（可使用 Tailwind CSS 或自訂 CSS）
2. **新增降級功能**：點擊降級按鈕，等級 -1
3. **等級下限判斷**：等級不可小於 1（降級時需判斷）

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Tailwind CSS 安裝方式請參考 <b>ch10「CSS 樣式編輯」</b> 的「安裝 Tailwind CSS」章節
</div>

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/20-binding/practice-2.png" class="rounded shadow-md max-h-80" />
</div>

<!--
練習二是加強版。

第一，把畫面排得更美觀，可以使用 Tailwind CSS 或自訂的 CSS。第二，新增降級功能，點擊降級按鈕，等級減 1。第三，加上防呆，等級不能小於 1。

想一想，除了在方法裡做判斷，還可以用哪一種繫結，讓按鈕在等級是 1 的時候直接不能點？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 2：解題提示
### 提示說明

1. 在練習 1 基礎上新增 `levelDown()` 方法
2. 降級前判斷：`if (this.level > 1) { this.level--; ... }`
3. 攻擊與防禦計算邏輯不變
4. UI 美化建議：
   - 用 `border rounded-lg p-6 shadow-lg` 做出一張卡片包覆整體內容
   - 用 `bg-green-500` / `bg-red-500` 區分升降按鈕顏色
   - 數值統計用 `<table>` 呈現

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>降級防呆：</b> 可在降級按鈕加 <code>[disabled]="level &lt;= 1"</code> 來禁用按鈕
</div>

<!--
我們來看解題提示。

在練習一的基礎上，新增 `levelDown` 方法，降級之前先判斷等級是不是大於 1，是的話才減 1，攻擊和防禦的計算方式不變。

回答剛才的問題，可以在降級按鈕加上中括號 `disabled`，條件是等級小於等於 1。這樣等級到 1 時，按鈕會直接被停用，使用者根本按不下去，這是更好的使用體驗。

美化的部分，可以用卡片樣式包住整個內容，用綠色和紅色區分升降按鈕，數值用表格呈現。
-->

---
layout: default
---

# 練習 2：解題解答
### TypeScript（1／2）

```typescript
export class AppComponent {
  level = 1;
  attack = 3;
  defense = 2;
  inputLevel = 1;

  levelUp() {
    this.level++;
    this.attack = this.level * 3;
    this.defense = this.level * 2;
  }

  levelDown() {
    if (this.level > 1) {
      this.level--;
      this.attack = this.level * 3;
      this.defense = this.level * 2;
    }
  }
}
```

<!--
我們來看完整的解答，先看 TypeScript 的前半部。

四個變數的初始值分別是等級 1、攻擊 3、防禦 2、輸入等級 1。`levelUp` 讓等級加 1，再用等級乘以 3 和乘以 2，重新計算攻擊和防禦。

`levelDown` 先判斷等級大於 1，才減 1 並重新計算。這樣就算有人繞過按鈕的停用狀態，等級也不會變成 0。
-->

---
layout: default
---

# 練習 2：解題解答
### TypeScript（2／2）

```typescript
  modifyLevel() {
    if (this.inputLevel >= 1) {
      this.level = this.inputLevel;
      this.attack = this.level * 3;
      this.defense = this.level * 2;
    }
  }

  reset() {
    this.level = 1;
    this.attack = 3;
    this.defense = 2;
    this.inputLevel = 1;
  }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 記得在 <code>@Component</code> 的 <code>imports</code> 加入 <code>FormsModule</code> 才能使用 <code>[(ngModel)]</code>
</div>

<!--
TypeScript 的後半部。

`modifyLevel` 先判斷輸入的等級大於等於 1，才把它套用到 `level`，並重新計算攻防，避免使用者輸入 0 或負數。

`reset` 則把所有數值，包含輸入框的 `inputLevel`，全部設回初始值。

記得在 `@Component` 的 `imports` 加入 `FormsModule`。
-->

---
zoom: 0.9
layout: default
---

# 練習 2：解題解答
### HTML（1／2）

```html
<div class="flex justify-center items-center min-h-screen bg-gray-100">
  <div class="rounded-2xl p-6 shadow-lg w-[480px]">
    <div class="border-2 border-gray-800 rounded-lg p-6 relative">

      <button class="absolute top-0 right-0 m-2 border border-gray-400 text-gray-600
                     rounded px-2 py-1 text-sm hover:bg-gray-200"
              (click)="reset()">重置</button>

      <h2 class="text-center text-red-600 font-bold text-2xl mb-4">角色等級計算機</h2>

      <p class="font-bold text-xl">等級：{{ level }}</p>

      <div class="flex gap-2 mb-4">
        <button class="flex-1 border-2 border-gray-800 rounded px-4 py-2
                       hover:bg-gray-800 hover:text-white" (click)="levelUp()">升級</button>
        <button class="flex-1 border-2 border-gray-800 rounded px-4 py-2
                       hover:bg-gray-800 hover:text-white disabled:opacity-40"
                [disabled]="level <= 1" (click)="levelDown()">降級</button>
      </div>
```

<!--
接著看 HTML 的前半部。

右上角是重置按鈕，用小括號 `click` 綁定 `reset`。中間用雙大括號顯示等級。

下方是升級和降級兩個按鈕。注意降級按鈕加上了中括號 `disabled`，條件是等級小於等於 1，這就是用屬性繫結做的防呆。
-->

---
layout: default
---

# 練習 2：解題解答
### HTML（2／2）

```html
      <p class="font-bold text-xl">攻擊力：{{ attack }}</p>
      <p class="font-bold text-xl">防禦力：{{ defense }}</p>

      <div class="flex items-center gap-2 mb-2">
        <label class="whitespace-nowrap">自行輸入等級：</label>
        <input type="number" class="flex-1 border border-gray-300 rounded px-3 py-2"
               [(ngModel)]="inputLevel" />
      </div>

      <button class="w-full border-2 border-gray-800 rounded px-4 py-2
                     hover:bg-gray-800 hover:text-white"
              (click)="modifyLevel()">修改等級</button>

    </div>
  </div>
</div>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 四種繫結全數出現：<code>{{ }}</code> 顯示、<code>[disabled]</code> 屬性、<code>(click)</code> 事件、<code>[(ngModel)]</code> 雙向
</div>

<!--
HTML 的後半部。

攻擊力和防禦力用雙大括號顯示。下方的數字輸入框用 `ngModel` 雙向綁定 `inputLevel`。使用者輸入時只會更新 `inputLevel`，要點擊「修改等級」按鈕，才會把值套用到等級並重新計算。

到這裡，四種繫結全部出現了：雙大括號顯示資料，中括號 `disabled` 控制按鈕，小括號 `click` 處理點擊，`ngModel` 雙向同步輸入框。
-->

---
zoom: 0.92
layout: default
---

# 練習 2：Tailwind Class 說明（1／3）
### 外層容器

| Class | 說明 |
| --- | --- |
| `flex` | 啟用 Flexbox 排版 |
| `justify-center` | 水平置中（主軸） |
| `items-center` | 垂直置中（次軸） |
| `min-h-screen` | 最小高度為 100% 視窗高度 |
| `bg-gray-100` | 淺灰背景色 |
| `rounded-2xl` / `rounded-lg` | 大圓角（外框）/ 小圓角（內框） |
| `p-6` / `shadow-lg` | 四周 padding（6 × 4 = 24px）/ 較明顯的陰影 |
| `w-[480px]` | 自訂寬度（中括號寫法可塞任意數值） |

<!--
接下來三頁，說明這個練習用到的 Tailwind class，先看外層容器。

`flex`、`justify-center` 和 `items-center` 讓內容在畫面上水平和垂直置中，`min-h-screen` 讓高度至少佔滿整個視窗，`bg-gray-100` 是淺灰色背景。外框用圓角、內距和陰影，做出卡片的效果。

特別看 `w-[480px]` 這個寫法。Tailwind 預設的寬度裡沒有剛好 480 像素，這時候用中括號把想要的值包起來，就會產生對應的樣式，這叫做「任意值」語法，其他屬性也能這樣用。
-->

---
zoom: 0.88
layout: default
---

# 練習 2：Tailwind Class 說明（2／3）
### 框線、定位與按鈕

| Class | 說明 |
| --- | --- |
| `border` / `border-2` / `border-gray-800` | 顯示邊框 / 粗細 2px / 深灰色邊框 |
| `relative` / `absolute` | 設為相對 / 絕對定位 |
| `top-0` / `right-0` / `m-2` | 定位右上角並留 8px 邊距 |
| `px-4 py-2` / `px-2 py-1 text-sm` | 一般按鈕內距 / 小按鈕內距與字級 |
| `flex-1` | 按鈕等寬填滿剩餘空間 |
| `gap-2` | Flex 子元素間距（2 × 4 = 8px） |
| `mb-4` / `mb-2` | 下方 margin（16px / 8px） |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Tailwind <b>沒有</b> <code>btn</code> 這種現成按鈕 class——按鈕的外觀是由 <code>border</code> + <code>rounded</code> + <code>px/py</code> + <code>hover:</code> 這幾個原子 class 組合出來的
</div>

<!--
第二部分是邊框、定位和按鈕。

內框設定了 `relative`，讓重置按鈕的 `absolute` 以內框為基準，再用 `top-0`、`right-0` 固定在右上角。這就是我們之前學過的父元素 relative、子元素 absolute 的定位方式。

這裡要提醒，Tailwind 沒有現成的按鈕 class。按鈕的外觀，是用邊框、圓角、內距和 hover 效果這些小 class 組合出來的。雖然比較麻煩，但按鈕長什麼樣子完全由我們決定。實務上如果同樣的按鈕要重複使用，通常會把它包成一個 Angular 元件。
-->

---
layout: default
---

# 練習 2：Tailwind Class 說明（3／3）
### 文字、輸入框與狀態

| Class | 說明 |
| --- | --- |
| `font-bold` / `text-xl` / `text-2xl` | 粗體 / 字級 1.25rem / 字級 1.5rem |
| `text-red-600` / `text-center` / `whitespace-nowrap` | 紅色 / 置中 / 禁止換行 |
| `border border-gray-300 rounded px-3 py-2` | 輸入框樣式（Tailwind 需自行組合） |
| `w-full` | 寬度 100%，按鈕撐滿父容器 |
| `hover:bg-gray-800 hover:text-white` | 滑鼠移上去時反白 |
| `disabled:opacity-40` | 按鈕被 `[disabled]` 停用時變半透明 |

<div class="mt-3 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <code>disabled:</code> 前綴會自動偵測 <code>[disabled]="level &lt;= 1"</code> 的結果——**屬性繫結**與 **Tailwind 狀態前綴**在這裡剛好接上
</div>

<!--
最後是文字、輸入框和狀態。

字體粗細、大小、顏色和對齊都有對應的 class。輸入框也一樣，需要自己組合邊框、圓角和內距。

這頁最值得注意的是 `disabled:opacity-40`。我們在 HTML 用屬性繫結，在等級小於等於 1 時把按鈕停用；而 Tailwind 的 `disabled:` 前綴會偵測到這個狀態，讓按鈕變成半透明。

也就是說，Angular 負責決定「什麼時候停用」，Tailwind 負責決定「停用時長什麼樣子」，兩邊剛好接在一起，不用另外寫任何 CSS。
-->

---
layout: end
---

# 課程結束
### 掌握四種繫結，讓 Angular 資料流動起來

<!--
這一章我們整理了 Angular 的四種繫結。雙大括號的內嵌繫結，把資料顯示成文字。中括號的屬性繫結，用變數控制屬性、class 和按鈕的停用狀態。小括號的事件繫結，在使用者操作時呼叫方法，還能用 `$event` 取得事件資訊。`ngModel` 的雙向繫結，讓輸入框和變數同步，使用前記得匯入 `FormsModule`。

下一章，我們會學習路由，讓網站可以在不同頁面之間切換。我們下一章見。
-->
