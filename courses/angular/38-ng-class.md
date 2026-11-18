---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: ngClass
routeAlias: ch38
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
    ngClass
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「依條件動態套用或移除 CSS class」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們做出了即時搜尋。這一章要深入學習 `ngClass`。

實務上常會遇到「這個 class 要不要出現，要看某個條件」的情況，例如選取時變色、錯誤時顯示紅框。學完這一章，我們會用 `ngClass` 的靜態寫法、條件寫法，以及方法回傳的方式來控制 class。
-->

---
layout: default
---

# Outline

- **ngClass 介紹** — 什麼是 ngClass 及使用前置作業
- **靜態用法** — 以 ngClass 替代一般 class 屬性
- **動態條件綁定** — 依布林變數控制 class 的套用
- **方法回傳** — 將複雜邏輯封裝在 TypeScript 方法中

<!--
這一章會先介紹 `ngClass` 是什麼，以及使用前要匯入的模組。接著看最簡單的靜態用法，再來是最常用的動態條件綁定，然後是邏輯比較複雜時，用方法回傳的寫法。最後用一個訂單狀態標籤的練習，把三種用法串起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# ngClass 介紹
# What is ngClass

<!--
我們先來認識 `ngClass` 是什麼，以及為什麼需要它。
-->

---

# ngClass 介紹

`ngClass` 是 Angular 的內建指令，用於**動態**增加或移除 HTML 元素的 CSS class。

| 特性 | 說明 |
| --- | --- |
| 動態綁定 | 依據變數或條件決定套用哪些 class |
| 靜態替代 | 也可用來替代一般 `class` 屬性（固定值） |
| 前置需求 | 使用前需在元件的 `.ts` 匯入 `CommonModule` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 若元件為 standalone，請在 <code>imports</code> 陣列中加入 <code>CommonModule</code>；若使用 NgModule 架構，則在對應模組中匯入。
</div>

<!--
`ngClass` 是 Angular 的內建指令，用來「動態地加上或移除元素的 CSS class」。

我們可以把它想成衣服上的標籤貼紙：天氣冷就貼上「保暖」，天氣熱就撕掉。衣服本身沒有變，但標籤，也就是 class，會依照情況改變。

看表格，它可以依照變數或條件決定套用哪些 class，也可以用來取代一般的 `class` 屬性。

使用之前，要先在元件的 TypeScript 匯入 `CommonModule`，否則模板裡的 `ngClass` 會直接報錯。
-->

---

# 匯入 CommonModule

在元件的 `.ts` 檔匯入 `CommonModule`，並加入 `imports` 陣列。

```typescript
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questionnaire.component.html',
})
export class QuestionnaireComponent {}
```

<!--
我們看匯入的實際寫法。

從 `@angular/common` 引入 `CommonModule`，再加進 `@Component` 的 `imports` 陣列。

跟其他模組一樣，只寫 `import` 不會生效，一定要加進 `imports` 陣列。完成之後，這個元件就可以在模板裡使用 `ngClass` 了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 靜態用法
# Static Class Binding

<!--
我們從最簡單的用法開始，看看 `ngClass` 怎麼取代一般的 `class` 屬性。
-->

---

# ngClass 靜態用法

匯入 `CommonModule` 後，可在模板中使用 `[ngClass]`。

將字串字面值傳入 `[ngClass]`，效果與直接使用 `class` 屬性相同，但尚未具備動態能力。

| 寫法 | 範例 |
| --- | --- |
| 原生 class | `<h3 class="test"></h3>` |
| ngClass 靜態 | `<h3 [ngClass]="'test'"></h3>` |

```html
<!-- 兩種寫法效果相同 -->
<h3 class="test"></h3>
<h3 [ngClass]="'test'"></h3>
```

<!--
匯入 `CommonModule` 之後，就可以在模板裡使用中括號 `ngClass`。

這裡傳入的是一個字串 test，注意外面是雙引號，裡面還有一組單引號，代表這是一段文字。效果跟直接寫 `class` 等於 test 完全一樣。

既然效果一樣，為什麼不直接寫 `class` 就好？沒錯，固定不變的 class，用原生的 `class` 屬性就夠了。`ngClass` 真正的價值，在下一段的動態條件綁定。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 動態條件綁定
# Conditional Class Binding

<!--
接下來是 `ngClass` 真正發揮作用的地方：用物件的寫法，依照條件決定 class 要不要套用。這也是實務上最常用的寫法。
-->

---

# ngClass 動態條件綁定

傳入物件語法 `{ 'class名稱': 條件 }` 可讓 class 依條件動態套用或移除。

| 語法 | 說明 |
| --- | --- |
| `{ 'class': boolean }` | 條件為 `true` 時套用 class |
| `{ 'c1': expr1, 'c2': expr2 }` | 同時控制多個 class |

```html
<!-- 單一條件 -->
<h3 [ngClass]="{ 'test': ngclassBoolean == true }"></h3>

<!-- 多個條件 -->
<h3 [ngClass]="{ 'test': ngclassBoolean == true,
                 'test2': ngclassBoolean == true }"></h3>
```

<!--
物件寫法的格式是：左邊放 class 名稱，右邊放條件。條件成立，就套用這個 class；不成立，就不套用。可以把它想成一份檢查清單，條件成立就打勾。

第一個範例，當 `ngclassBoolean` 等於 true 時，就套用 test。第二個範例同時寫了兩個 class，各自有自己的條件，可以一次控制多個 class，彼此互不影響。

左邊的 class 名稱要用引號包起來，因為 class 名稱裡可能有連字號這類特殊字元。
-->

---

# 動態條件綁定 — TypeScript 變數

在元件的 `.ts` 中宣告布林變數，模板依此變數決定是否套用 class。

```typescript
export class QuestionnaireComponent {
  ngclassBoolean: boolean = true;
}
```

```html
<h3 [ngClass]="{ 'test': ngclassBoolean == true }"></h3>
```

- 當 `ngclassBoolean` 為 `true` → `test` class 生效
- 當 `ngclassBoolean` 為 `false` → `test` class 被移除

<!--
這個條件用到的 `ngclassBoolean`，是元件的 TypeScript 裡宣告的布林變數。

模板裡的 `ngClass` 和這個變數是連動的。當它是 true，`h3` 就會套用 test；如果程式把它改成 false，test 就會自動被移除。我們不需要自己去操作畫面加減 class。

另外，條件不一定要寫成「等於 true」，直接寫變數本身也可以。這裡寫出完整的比較式，是為了讓判斷邏輯更清楚。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 方法回傳
# Method-based Class Binding

<!--
最後是第三種用法。如果判斷的邏輯比較複雜，全部寫在模板裡會很亂，這時候可以把邏輯包成一個方法。
-->

---

# ngClass 方法回傳

當判斷邏輯較複雜時，可將邏輯封裝在 TypeScript 方法中，由方法回傳 class 名稱字串。

| 綁定方式 | 模板寫法 |
| --- | --- |
| 方法回傳字串 | `[ngClass]="getClassCss()"` |
| 方法回傳物件 | `[ngClass]="getClassObj()"` |

```html
<h3 [ngClass]="getClassCss()"></h3>
```

```typescript
getClassCss(): string {
  return 'test';
}
```

<!--
當判斷邏輯較複雜時，可以寫一個 TypeScript 方法，由方法回傳要套用的 class。

模板裡寫中括號 `ngClass` 等於 `getClassCss()`，方法可以回傳 class 名稱的字串，也可以回傳物件，Angular 都能處理。這裡的方法回傳 test，所以 `h3` 會套用 test。

要注意，這個方法在 Angular 每次檢查畫面變化時都會被呼叫，所以裡面不要放太複雜或耗效能的運算。
-->

---

# ngClass 三種用法比較

| 用法 | 模板範例 | 適用情境 |
| --- | --- | --- |
| 靜態字串 | `[ngClass]="'test'"` | 固定 class，不需動態切換 |
| 物件條件 | `[ngClass]="{ 'test': flag }"` | 依單一或多個布林條件切換 |
| 方法回傳 | `[ngClass]="getClass()"` | 判斷邏輯複雜，需封裝在 TS 中 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議：</b> 優先使用物件條件語法；邏輯超過兩個條件或需要額外運算時，改用方法回傳。
</div>

<!--
我們把三種用法整理成一張表。

靜態字串適合完全不會變的 class。物件條件是最常用的寫法，可以依一個或多個布林條件切換。方法回傳則適合判斷邏輯比較複雜、需要封裝在 TypeScript 裡的情況。

實務上的建議是：優先使用物件條件的寫法，最直覺，可讀性也好。只有條件很多、或需要額外運算時，才改用方法回傳。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 練習
# Practice Exercise

<!--
三種用法都學完了，接下來用一個實務情境把它們串起來：依照訂單狀態，顯示不同顏色的標籤。
-->

---
layout: default
---

# 練習：訂單狀態標籤
### 任務說明

做一個訂單清單，把今天學的三種 `ngClass` 用法都用上：

1. 定義 `Order` interface：`id`、`customer`、`status`（`'pending' | 'shipped' | 'completed' | 'cancelled'`）、`isOverdue`
2. 準備至少 5 筆假資料，用 `@for` 顯示成清單
3. 每筆訂單的狀態標籤用 `[ngClass]` **物件語法**，依 `status` 套上對應顏色 class：`badge-pending`、`badge-shipped`、`badge-completed`、`badge-cancelled`
4. 逾期標籤是另一個獨立的元素，用 `[ngClass]` **物件語法**依 `isOverdue` 決定 `badge-overdue` 要不要出現（`isOverdue` 為 `false` 時整個標籤要隱藏，不能跟狀態標籤擠在同一個元素上）
5. 寫一個方法 `getRowClass(order)`，若訂單狀態為 `cancelled` 就回傳 `'row-cancelled'`，否則回傳空字串，並用**方法回傳**語法綁在整個 `<li>` 上

<!--
這個練習要做一個訂單清單，把三種 `ngClass` 用法都用上。

第一，定義 `Order` interface，包含 id、客戶名稱、狀態和是否逾期。第二，準備至少 5 筆資料，用 `@for` 顯示。第三，狀態標籤用物件寫法套上對應的顏色。第四，逾期標籤是另一個獨立的元素，用物件寫法決定要不要顯示。第五，寫 `getRowClass` 方法，取消的訂單回傳 `row-cancelled`，綁在整個 `li` 上。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：訂單狀態標籤
### 畫面預覽

<div class="flex flex-col gap-2 mt-4" style="max-width: 480px; margin-left: auto; margin-right: auto;">
  <div class="flex justify-between items-center rounded-lg px-4 py-2" style="border: 1px solid #e2e8f0;">
    <span><span class="text-gray-400 text-xs mr-1">#1</span><b>王小明</b></span>
    <span class="text-xs font-semibold rounded-full px-2 py-1" style="background:#fef3c7; color:#92400e;">pending</span>
  </div>
  <div class="flex justify-between items-center rounded-lg px-4 py-2" style="border: 1px solid #e2e8f0;">
    <span><span class="text-gray-400 text-xs mr-1">#2</span><b>陳美玲</b></span>
    <span class="flex gap-1">
      <span class="text-xs font-semibold rounded-full px-2 py-1" style="background:#dbeafe; color:#1e40af;">shipped</span>
      <span class="text-xs font-semibold rounded-full px-2 py-1" style="background:#fee2e2; color:#991b1b;">overdue</span>
    </span>
  </div>
  <div class="flex justify-between items-center rounded-lg px-4 py-2" style="border: 1px solid #e2e8f0;">
    <span><span class="text-gray-400 text-xs mr-1">#3</span><b>林大偉</b></span>
    <span class="text-xs font-semibold rounded-full px-2 py-1" style="background:#dcfce7; color:#166534;">completed</span>
  </div>
  <div class="flex justify-between items-center rounded-lg px-4 py-2" style="border: 1px solid #e2e8f0; opacity: 0.5; text-decoration: line-through;">
    <span><span class="text-gray-400 text-xs mr-1">#4</span><b>張雅婷</b></span>
    <span class="text-xs font-semibold rounded-full px-2 py-1" style="background:#f3f4f6; color:#6b7280;">cancelled</span>
  </div>
  <div class="flex justify-between items-center rounded-lg px-4 py-2" style="border: 1px solid #e2e8f0;">
    <span><span class="text-gray-400 text-xs mr-1">#5</span><b>李志豪</b></span>
    <span class="flex gap-1">
      <span class="text-xs font-semibold rounded-full px-2 py-1" style="background:#fef3c7; color:#92400e;">pending</span>
      <span class="text-xs font-semibold rounded-full px-2 py-1" style="background:#fee2e2; color:#991b1b;">overdue</span>
    </span>
  </div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 第 2、5 筆同時掛兩個 badge（物件語法多條件成立）；第 4 筆整列變灰階刪除線（方法回傳 <code>row-cancelled</code>）。
</div>

<!--
先看看做完之後畫面的樣子。

第 2 筆和第 5 筆，狀態標籤旁邊多了一個紅色的 overdue 標籤，這是逾期標籤的條件成立了。第 4 筆是取消的訂單，整列變成半透明，還加上刪除線，這不是物件寫法做的，而是 `li` 上的 `getRowClass` 回傳了 `row-cancelled`。
-->

---
layout: default
---

# 練習：訂單狀態標籤
### 解題提示

1. `status` 的型別用聯合型別（union type）宣告，`'pending' | 'shipped' | 'completed' | 'cancelled'`，這樣打錯字 TypeScript 會直接標紅
2. 狀態的 4 個 class 只會有一個成立，放在同一個 `[ngClass]` 物件裡沒問題；但逾期標籤是另一個獨立元素，不能跟狀態標籤共用同一個 `[ngClass]`，否則兩個 class 都設定 `background`，畫面上只會留下後面蓋過前面的那個顏色（ch38 動態條件綁定）
3. `@for` 語法別忘記 `track`，這裡資料有唯一的 `id`，直接 `track order.id`（ch25 重點）
4. `getRowClass()` 只回傳 `row-cancelled` 或空字串，`[ngClass]="getRowClass(order)"` 綁的是方法呼叫，不是物件（ch38 方法回傳）
5. `badge-*` 這些 class 的 CSS 樣式本身（顏色、底色）不是這次練習重點，可以先用簡單顏色隨意定義，重點是 class 有沒有正確被套上去

<!--
我們來看解題提示。

第一，狀態的型別用聯合型別宣告，只允許四種字串，打錯字 TypeScript 會直接標示出來。第二，四個狀態 class 同一時間只會成立一個，所以放在同一個 `ngClass` 物件裡沒問題。但逾期標籤要是另一個獨立的元素，如果跟狀態標籤擠在同一個元素上，兩個 class 都設定了背景色，畫面上只會剩下後面那個顏色。第三，`@for` 別忘了 `track`，這裡可以用 `order.id`。第四，`getRowClass` 綁的是方法呼叫，不是物件。最後，標籤的顏色樣式不是這次的重點，可以先簡單定義。
-->

---

# 完整解答 — import 與 @Component 設定

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss',
})
export class OrderStatusComponent {
```

<!--
我們來看完整的解答，先看匯入和 `@Component` 設定。

`CommonModule` 一定要匯入，並加進 `imports` 陣列，否則 `ngClass` 會報錯。`@for` 是 Angular 內建的語法，不需要另外匯入。

注意最後一行 class 的左大括號還沒結束，接下來幾頁都是這個 class 裡面的內容。
-->

---

# 完整解答 — Interface 與假資料

```typescript
export interface Order {
  id: number;
  customer: string;
  status: 'pending' | 'shipped' | 'completed' | 'cancelled';
  isOverdue: boolean;
}
```

```typescript
  orders: Order[] = [
    { id: 1, customer: '王小明', status: 'pending',   isOverdue: false },
    { id: 2, customer: '陳美玲', status: 'shipped',   isOverdue: true  },
    { id: 3, customer: '林大偉', status: 'completed', isOverdue: false },
```

<!--
接著是 interface 和假資料。

`Order` 這個 interface 定義在 class 外面。`status` 用聯合型別，只能是四種字串之一；`isOverdue` 是布林值，代表訂單是否逾期。

下面的 `orders` 是 class 裡的屬性，這頁先放了三筆資料，下一頁補齊剩下的兩筆。
-->

---

# 完整解答 — 假資料（續）與方法

```typescript
    { id: 4, customer: '張雅婷', status: 'cancelled', isOverdue: false },
    { id: 5, customer: '李志豪', status: 'pending',   isOverdue: true  },
  ];

  getRowClass(order: Order): string {
    return order.status === 'cancelled' ? 'row-cancelled' : '';
  }
}
```

<!--
補齊剩下兩筆資料。第 4 筆是取消的訂單，第 5 筆是待處理而且已經逾期。

接著是 `getRowClass` 方法，這就是方法回傳的範例。狀態是 cancelled，就回傳 `row-cancelled`；其他狀態一律回傳空字串，不加任何 class。

最後的右大括號，才是整個 class 的結尾。
-->

---
zoom: 0.89
---

# 完整解答 — HTML

```html
<ul class="order-list">
  @for (order of orders; track order.id) {
    <li [ngClass]="getRowClass(order)">
      <span class="customer">#{{ order.id }} {{ order.customer }}</span>

      <span class="badges">
        <span class="badge" [ngClass]="{
          'badge-pending': order.status === 'pending',
          'badge-shipped': order.status === 'shipped',
          'badge-completed': order.status === 'completed',
          'badge-cancelled': order.status === 'cancelled'
        }">{{ order.status }}</span>

        <span class="badge badge-overdue" [ngClass]="{ 'hidden': !order.isOverdue }">
          overdue
        </span>
      </span>
    </li>
  }
</ul>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 狀態標籤跟逾期標籤是<b>兩個獨立的 <code>&lt;span&gt;</code></b>，各自用自己的 <code>[ngClass]</code> 物件控制，不能合併成一個元素，否則兩個 class 的 <code>background</code> 會互相覆蓋，畫面只留下一種顏色。
</div>

<!--
最後是 HTML。

外層用 `@for` 走過 `orders`，並用 `order.id` 當作 `track`。`li` 上用 `ngClass` 綁定 `getRowClass(order)`，取消的那一筆就會多一個 `row-cancelled`。

裡面有兩個 `span`。第一個負責狀態顏色，四個條件裡只會有一個成立。第二個是獨立的逾期標籤，用物件寫法控制 `hidden`：沒有逾期時，套上 `hidden` 讓它隱藏；逾期時，`hidden` 不會套用，標籤就顯示出來，和狀態標籤並排，而不是在同一個元素上互相搶顏色。
-->

---

# 完整解答 — SCSS（一）版面排版

`ngClass` 只負責「加不加這個 class」，class 實際長怎樣（排版、顏色）還是要靠 CSS／SCSS 定義：

```scss
.order-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
}
```

<!--
`ngClass` 只負責決定「要不要加上這個 class」，class 實際長什麼樣子，還是要靠 SCSS 定義。這頁是清單的版面。

`.order-list` 拿掉預設的項目符號，改成直向的 flex 排列，每列之間留一點間距。每個 `li` 則用 flex 讓內容左右兩端對齊，左邊是名稱，右邊是標籤，外面加上邊框和圓角。

如果沒有這兩段樣式，畫面就會是瀏覽器預設的清單樣式，跟預覽的效果差很多。
-->

---
zoom: 0.96
---

# 完整解答 — SCSS（二）顏色與狀態

```scss
.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-pending   { background: #fef3c7; color: #92400e; }
.badge-shipped   { background: #dbeafe; color: #1e40af; }
.badge-completed { background: #dcfce7; color: #166534; }
.badge-cancelled { background: #f3f4f6; color: #6b7280; }
.badge-overdue   { background: #fee2e2; color: #991b1b; margin-left: 0.4rem; }

.hidden {
  display: none;
}

.row-cancelled {
  opacity: 0.5;
  text-decoration: line-through;
}
```

<!--
最後是顏色和狀態的樣式。

`.badge` 是共用的標籤樣式，包括內距、膠囊形的圓角和字體大小。它和各個顏色的 class 分開寫，因為每個標籤都同時有 `badge` 和 `ngClass` 加上的顏色 class，兩者疊加使用。

`.hidden` 設定 `display: none`，用來隱藏逾期標籤。`.row-cancelled` 則用 `opacity` 讓整列變淡，再加上刪除線。

到這裡完整解答就講完了，可以對照自己的版本，檢查匯入、物件寫法、方法回傳和 SCSS 有沒有都對上。
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

# 補充練習 1–2：開關樣式與除錯實驗

**練習 1：高亮開關**

1. 在 TS 宣告 `isActive: boolean = false;`，並建立點擊方法把它反轉（`!this.isActive`）
2. 在 SCSS 定義 `.active-style { background-color: #0ea5e9; color: white; }`
3. 在 HTML 的區塊上綁定 `[ngClass]="{'active-style': isActive}"`
4. 點擊按鈕，確認背景色隨開關切換

**練習 2：忘記匯入 CommonModule**

故意從 `imports` 陣列移除 `CommonModule`，觀察錯誤訊息，再補回來。

<!--
接下來兩題補充練習。

第一題，用一個布林值控制 `active-style` 要不要套用，點按鈕切換開關，看背景色有沒有跟著改變。

第二題是除錯實驗：把 `CommonModule` 拿掉，看看 `ngClass` 會出現什麼錯誤。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
isActive: boolean = false;

toggle() {
  this.isActive = !this.isActive;
}
```

```html
<div [ngClass]="{'active-style': isActive}">警報燈</div>
<button (click)="toggle()">開關</button>
```

```text
❌ Can't bind to 'ngClass' since it isn't a known property of 'div'.
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 看到「Can't bind to 'xxx' since it isn't a known property」，通常就是對應的模組沒有加進 <code>imports</code>
</div>

<!--
我們來看答案。

`toggle` 把 `isActive` 反轉。`ngClass` 的物件寫法，key 是 class 名稱，值是條件：`isActive` 為 true 時套用 `active-style`，false 時移除。

拿掉 `CommonModule` 之後，會出現「無法綁定 ngClass，因為它不是 div 已知的屬性」。這類訊息之後在 `ngModel`、`formGroup` 也會看到，意思都是：用到的功能所屬的模組，沒有匯入。
-->

---
layout: default
---

# 補充練習 3：依分數回傳樣式

依據分數狀態，用方法回傳對應的 class：

1. 在 SCSS 撰寫兩組選擇器：`.pass`（綠色）與 `.fail`（紅色）
2. 在 TS 宣告 `myScore: number = 55;`
3. 撰寫方法：大於等於 60 分 `return 'pass'`，否則 `return 'fail'`
4. 在 HTML 用 `ngClass` 綁定此方法，確認 55 分時字體呈現紅色

<!--
第三題補充練習，用方法決定要套用哪個 class。

寫一個方法判斷分數，及格回傳 `pass`，不及格回傳 `fail`，再讓 `ngClass` 綁定這個方法的回傳值。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：依分數回傳樣式 — 參考答案

```scss
.pass { color: green; }
.fail { color: red; }
```

```typescript
myScore: number = 55;

getScoreClass(): string {
  if (this.myScore >= 60) {
    return 'pass';
  }
  return 'fail';
}
```

```html
<p [ngClass]="getScoreClass()">分數：{{ myScore }}</p>
```

<!--
我們來看答案。

`getScoreClass` 依照分數回傳 class 名稱的字串，`ngClass` 會把回傳的字串當作 class 套用上去。55 分不到 60，回傳 `fail`，文字就是紅色。

試著把分數改成 80，文字就會變成綠色。判斷邏輯比較複雜時，把它寫成方法，HTML 會乾淨很多。
-->

---
layout: end
---

# 課程結束
### 透過 ngClass 可依條件動態控制元素的 CSS class，讓樣式管理更靈活。

<!--
這一章我們學了 `ngClass` 的三種用法。使用前要匯入 `CommonModule`。靜態字串可以取代一般的 `class`；物件寫法用條件決定 class 要不要套用，是最常用的方式；方法回傳則適合比較複雜的判斷邏輯，但要注意效能。

下一章，我們會學習 Material 的分頁標籤元件 Tabs。我們下一章見。
-->

