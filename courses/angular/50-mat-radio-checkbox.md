---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Mat-radio & Checkbox
routeAlias: ch50
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
    Mat-radio &amp; Checkbox
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「掌握單選與多選元件，打造互動豐富的 Angular Material 表單」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們做出了工具列。這一章，我們要學表單裡兩個很常見的元件：單選按鈕和多選框，也就是 `mat-radio` 和 `mat-checkbox`。

填問卷時，「性別」這種只能選一個的題目，用單選；「興趣」這種可以複選的題目，用多選框。學完這一章，我們會知道兩者在 Angular Material 和純 HTML 裡的寫法，以及各自要注意的地方。
-->

---
layout: default
---

# Outline

- **Mat-radio 簡介** — 單選元件與 `mat-radio-group` / `mat-radio-button` 的結構
- **mat-radio-group 語法** — 以 `value` 屬性定義各選項對應值
- **HTML input radio** — 純 HTML 寫法與 `name` 群組屬性
- **input radio 群組問題** — 未宣告 `name` 導致多選的情況
- **Checkbox 簡介** — 多選元件與布林值綁定
- **input checkbox 語法** — 純 HTML 寫法與 `ngModel` 雙向綁定
- **mat-checkbox 語法** — Angular Material 版本與模組匯入

<!--
這一章會先介紹 `mat-radio` 單選元件，看它的 Material 寫法，以及純 HTML 寫法要注意什麼。接著換到 Checkbox 多選元件，一樣看兩種寫法。然後用一張表比較兩者的差異，最後做一個手搖飲點餐單的練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Mat-radio

單選按鈕元件

<!--
只能選一個答案的題目，要怎麼避免同時選兩個？我們先從 `mat-radio` 開始。
-->

---
layout: default
---

# Mat-radio 簡介

`mat-radio-button` 是 Angular Material 提供的單選元件，需先安裝 `@angular/material`。

- 一組問題使用一個 `mat-radio-group` 標籤包覆所有選項
- 每個選項以 `mat-radio-button` 標籤呈現
- 透過 `value` 屬性指定該選項被選中時的對應值
- 當使用者選取某選項時，綁定變數的值即更新為該 `value`

<div class="flex justify-center">
  <img src="/images/50-mat-radio-checkbox/mat-radio-preview.png" class="rounded shadow-md max-h-80" />
</div>

<!--
`mat-radio-button` 是 Angular Material 的單選元件，使用前要先安裝 `@angular/material`。

可以把它想成一組單選題的選項。外面用 `mat-radio-group` 包住所有選項，代表「這些是同一組，只能選一個」；裡面每個選項是一個 `mat-radio-button`，各自帶著一個 `value`。使用者選了哪一個，綁定的變數就會變成那個 `value`。

付款方式、會員等級這類單選的題目，都很適合用它。
-->

---
layout: default
---

# mat-radio-group 語法

使用 `mat-radio-group` 包覆所有 `mat-radio-button`，每個按鈕透過 `value` 定義對應值。

```html
<mat-radio-group>
  <mat-radio-button value="1">Option 1</mat-radio-button>
  <mat-radio-button value="2">Option 2</mat-radio-button>
</mat-radio-group>
```

- `mat-radio-group` 負責管理群組內的互斥選取邏輯
- `value` 屬性決定選取後綁定變數所接收的值
- 可搭配 `[(ngModel)]` 或 Reactive Forms 的 `formControl` 進行資料綁定

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> 使用 <code>mat-radio-group</code> 前須在模組中匯入 <code>MatRadioModule</code>。</div>

<!--
我們看語法。外層是 `mat-radio-group`，裡面有兩個 `mat-radio-button`，`value` 分別是 1 和 2。

`mat-radio-group` 負責管理整組的互斥邏輯，選了一個，另一個就會自動取消，不用自己寫程式判斷。實際使用時，通常搭配 `ngModel` 雙向綁定，或是表單的 `formControl`，選中的 `value` 就會存進綁定的變數。

使用前要記得匯入 `MatRadioModule`，否則 Angular 不認得這個標籤。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# input radio

純 HTML 單選寫法

<!--
接著看純 HTML 的單選按鈕，就能理解 Material 版本解決了什麼問題。
-->

---
layout: default
---

# HTML input radio — 基本寫法

純 HTML 單選使用 `<input type="radio">`，並透過 `name` 屬性將選項歸為同一群組。

```html
<input type="radio" value="1" name="A">Option 1
<input type="radio" value="2" name="A">Option 2
```

- HTML 原生寫法沒有 `radio-group` 標籤
- 必須在每個 `<input>` 上宣告相同的 `name` 值，系統才能識別為同一組選項
- 相同 `name` 群組中，同一時間僅能選取一個選項

<!--
純 HTML 的單選按鈕，用的是 `input type="radio"`。

跟 Material 不同，HTML 原生沒有 `radio-group` 這種外框標籤，而是在每個 `input` 上加上相同的 `name` 屬性。這裡兩個 `input` 的 `name` 都是 A，瀏覽器就會把它們視為同一組，同一時間只能選一個。

這個 `name` 很容易漏掉，下一頁看看漏掉會發生什麼事。
-->

---
layout: default
---

# HTML input radio — 未設定 name 的問題

若未宣告 `name` 屬性，各個 radio button 各自獨立，導致可同時選取多項。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**錯誤寫法（未宣告 name）**

```html
<input type="radio" value="1">Option 1
<input type="radio" value="2">Option 2
```

結果：兩個選項皆可被選取，失去單選互斥效果。

</div>
<div>

**正確寫法（宣告相同 name）**

```html
<input type="radio" value="1" name="A">Option 1
<input type="radio" value="2" name="A">Option 2
```

結果：同一群組，僅能選取一項。

</div>
</div>

<div class="flex justify-center">
  <img src="/images/50-mat-radio-checkbox/input-radio-no-name-issue.png" class="rounded shadow-md max-h-48" />
</div>

<!--
這是寫單選按鈕最常踩到的問題：忘了加 `name`。

上面是錯誤的寫法，兩個 `input` 沒有共同的 `name`，瀏覽器不知道它們是同一組，結果兩個都可以被選取，失去單選的意義。下面是正確的寫法，兩個都加上 `name` 等於 A，就只能選一個。

這個錯誤不會出現任何錯誤訊息，只有實際點選才會發現兩個都被選了，所以特別容易被忽略。截圖就是沒有 `name` 時的樣子。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Checkbox

多選元件

<!--
講完單選，換一個情境：如果題目是「請勾選有興趣的項目，可複選」，每個選項都能獨立勾選，就要用 Checkbox。
-->

---
layout: default
---

# Checkbox 簡介

Checkbox 用於讓使用者進行多選操作，畫面呈現為正方形選取框（勾選 / 取消）。

- 每個 checkbox 獨立運作，不需要群組標籤
- 選取狀態為布林值（`true` / `false`），不需另外設定 `value`
- 需在 TypeScript 中宣告對應的布林變數，並透過 `[(ngModel)]` 進行雙向綁定

```html
<input type="checkbox">多選1
<input type="checkbox">多選2
```

<div class="flex justify-center">
  <img src="/images/50-mat-radio-checkbox/input-checkbox-preview.png" class="rounded shadow-md max-h-48" />
</div>

<!--
Checkbox 讓使用者做多選，畫面上是方形的勾選框。

它跟單選按鈕最大的不同，是每個 checkbox 都獨立運作，不需要群組。另外，單選按鈕綁定的是自訂的 `value`，checkbox 綁定的則是布林值：勾選是 true，沒勾是 false，不需要設定 `value`。

截圖裡是兩個獨立的 checkbox，各自勾選，互不影響。「同意服務條款」、「訂閱電子報」這種是非題，或是複選興趣，都是 checkbox 典型的用法。
-->

---
layout: default
---

# input checkbox — 雙向綁定

Checkbox 的選取狀態為布林值，在 TypeScript 中宣告布林變數後，透過 `[(ngModel)]` 完成綁定。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**HTML**

```html
<input type="checkbox" [(ngModel)]="checkBoxData1">多選1
<input type="checkbox" [(ngModel)]="checkBoxData2">多選2
```

</div>
<div>

**TypeScript**

```typescript
export class AppComponent {
  checkBoxData1: boolean = false;
  checkBoxData2: boolean = false;
}
```

</div>
</div>

- 選取時變數值為 `true`，取消選取時為 `false`
- 多個 checkbox 各自對應獨立的布林變數

<!--
這頁示範怎麼把 checkbox 的勾選狀態和變數綁在一起。

在 TypeScript 宣告兩個布林變數，`checkBoxData1` 和 `checkBoxData2`，預設都是 false。在 HTML 用 `ngModel` 分別綁定到兩個 `input`。

這是一對一的關係，每個 checkbox 對應一個獨立的變數，跟單選按鈕「一組共用一個變數」完全不同。勾選第一個，`checkBoxData1` 就變成 true，第二個完全不受影響。
-->

---
layout: default
---

# mat-checkbox — Angular Material 寫法

`mat-checkbox` 的用法與 HTML input checkbox 相似，差異在於需額外匯入 `MatCheckboxModule`。

**HTML**

```html
<mat-checkbox [(ngModel)]="checkBoxData1">多選1</mat-checkbox>
<mat-checkbox [(ngModel)]="checkBoxData2">多選2</mat-checkbox>
```

**模組匯入（app.module.ts）**

```typescript
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    MatCheckboxModule,
    FormsModule
  ]
})
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> 使用 <code>[(ngModel)]</code> 雙向綁定時，須同時匯入 <code>FormsModule</code>。</div>

<!--
`mat-checkbox` 的寫法跟純 HTML 的幾乎一樣，一樣用 `ngModel` 綁定布林變數，只是標籤換成 `mat-checkbox`，外觀會套用 Material 的樣式。

模組的部分，要匯入 `MatCheckboxModule`，因為用了 `ngModel`，也要同時匯入 `FormsModule`。範例是寫在 `NgModule` 裡；如果是獨立元件，就放在元件的 `imports` 陣列。

最常見的錯誤，是只匯入了 `MatCheckboxModule`，忘了 `FormsModule`，結果雙向綁定沒有反應。
-->

---
layout: default
---

# mat-radio vs mat-checkbox — 比較

| 特性 | mat-radio-button | mat-checkbox |
|---|---|---|
| 選取模式 | 單選（互斥） | 多選（獨立） |
| 群組標籤 | `mat-radio-group` | 不需要 |
| 綁定值型別 | 任意型別（`value` 屬性） | 布林值（`boolean`） |
| 所需模組 | `MatRadioModule` | `MatCheckboxModule` |
| HTML 對應 | `<input type="radio">` | `<input type="checkbox">` |

<!--
這張表把兩個元件做個整理。

最核心的差別是選取模式：單選按鈕是互斥的，一組只能選一個，所以需要 `mat-radio-group`；checkbox 是獨立的，不需要群組。綁定的值也不同，單選按鈕綁定自訂的 `value`，可以是任何型別；checkbox 永遠是布林值。兩者需要的模組分別是 `MatRadioModule` 和 `MatCheckboxModule`。

之後遇到「該用單選還是多選」的問題，可以回想這張表。
-->

---
layout: default
---

# 練習：手搖飲點餐單
### 情境說明

手搖飲店的點餐畫面很典型：甜度只能選一個（少糖／正常糖／無糖），加料可以複選（珍珠／椰果／布丁），選完畫面上要即時顯示目前選了什麼。這一題要把 `mat-radio-group` 跟 `mat-checkbox` 結合在同一個元件裡練習。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**需求**
- 甜度選項用 `mat-radio-group` 呈現，同一時間只能選一個
- 加料選項用 `mat-checkbox` 呈現，可同時勾選多個
- 畫面即時顯示目前選擇的甜度與加料文字

</div>
<div>

**限制**
- 甜度、加料選項都存成陣列，用 `@for` 產生選項，不能一條一條手刻
- 綁定方式統一用 `[(ngModel)]`，不用 `(change)` 手動更新變數
- 加料文字用 getter 動態組出來，不能在畫面上手動拼字串

</div>
</div>

<!--
我們來做一個練習：手搖飲的點餐單。

甜度只能選一個，有少糖、正常糖和無糖；加料可以複選，有珍珠、椰果和布丁。選完之後，畫面上要即時顯示目前的選擇。

限制是：甜度和加料的選項都存成陣列，用 `@for` 產生；綁定統一用 `ngModel`；加料的文字用 getter 組出來，不要在畫面上手動拼字串。

這題的重點，是體會「甜度一組共用一個變數，加料每個各自獨立」的差別。
-->

---
layout: default
---

# 練習：任務說明

1. 在元件的 TypeScript 中，建立 `sweetnessOptions` 陣列，每筆含 `value`、`label`，並宣告 `selectedSweetness` 儲存目前選中的甜度
2. 建立 `toppings` 陣列，每筆含 `label`、`checked`（布林值），代表每個加料的勾選狀態
3. `imports` 陣列加入 `FormsModule`、`MatRadioModule`、`MatCheckboxModule`
4. HTML 用 `mat-radio-group` 包裹 `@for` 產生的 `mat-radio-button`，並用 `[(ngModel)]="selectedSweetness"` 綁定
5. 用 `@for` 迴圈跑過 `toppings`，每筆產生一個 `mat-checkbox`，用 `[(ngModel)]="topping.checked"` 綁定
6. 撰寫 `selectedToppingsText` getter，回傳目前已勾選加料的名稱，以頓號 `、` 串接，若都沒勾選則回傳「無」
7. 畫面顯示 `selectedSweetness` 與 `selectedToppingsText`

<!--
任務有七個步驟。

第一，建立 `sweetnessOptions` 陣列，每筆有 `value` 和 `label`，並宣告 `selectedSweetness` 存放選中的甜度。第二，建立 `toppings` 陣列，每筆有 `label` 和布林值 `checked`。第三，`imports` 加入 `FormsModule`、`MatRadioModule` 和 `MatCheckboxModule`。第四，用 `mat-radio-group` 包住 `@for` 產生的選項，綁定 `selectedSweetness`。第五，用 `@for` 產生 `mat-checkbox`，綁定 `topping.checked`。第六，寫一個 `selectedToppingsText` getter，把已勾選的加料用頓號串起來，沒有勾選就回傳「無」。第七，在畫面顯示結果。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示

1. `mat-radio-button` 的 `value` 要用方括號綁定陣列裡的值：`[value]="opt.value"`，不能寫死成固定字串
2. `mat-checkbox` 綁定的是 `topping.checked` 這個布林屬性，不是整個 `topping` 物件
3. `selectedToppingsText` 用陣列的 `filter()` 先篩出 `checked` 為 `true` 的項目，再用 `map()` 取出 `label`，最後 `join('、')` 組成字串
4. `filter().map()` 後如果陣列長度是 0，代表沒有勾選任何加料，要回傳「無」而不是空字串
5. `FormsModule` 是 `[(ngModel)]` 能運作的前提，`MatRadioModule`、`MatCheckboxModule` 則分別對應 `mat-radio-*`、`mat-checkbox` 標籤

<!--
我們來看解題提示。

第一，`mat-radio-button` 的 `value` 要用中括號綁定陣列裡的值。第二，`mat-checkbox` 綁定的是 `topping.checked` 這個布林屬性，而不是整個物件。第三，getter 可以先用 `filter` 篩出勾選的項目，再用 `map` 取出名稱，最後用 `join` 加上頓號串起來。第四，如果結果是空的，要回傳「無」，而不是空字串。第五，`FormsModule` 是 `ngModel` 能運作的前提。
-->

---
layout: default
---

# 完整解答 — drink-order.component.ts（一）

匯入模組與元件裝飾器：

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-drink-order',
  standalone: true,
  imports: [FormsModule, MatRadioModule, MatCheckboxModule],
  templateUrl: './drink-order.component.html',
})
export class DrinkOrderComponent {
  // 屬性見下一頁
}
```

<!--
我們看完整的解答，先看匯入和裝飾器。

`imports` 陣列裡的 `FormsModule` 是關鍵，沒有它 `ngModel` 就無法運作。`MatRadioModule` 和 `MatCheckboxModule`，則分別讓單選和多選的標籤生效。
-->

---
layout: default
---

# 完整解答 — drink-order.component.ts（二）

`sweetnessOptions`、`toppings` 陣列與 `selectedToppingsText` getter：

```typescript
export class DrinkOrderComponent {

  sweetnessOptions = [
    { value: 'less', label: '少糖' },
    { value: 'normal', label: '正常糖' },
    { value: 'no-sugar', label: '無糖' },
  ];
  selectedSweetness = 'normal';

  toppings = [
    { label: '珍珠', checked: false },
    { label: '椰果', checked: false },
    { label: '布丁', checked: false },
  ];

  get selectedToppingsText(): string {
    const picked = this.toppings.filter(t => t.checked).map(t => t.label);
    return picked.length ? picked.join('、') : '無';
  }
}
```

<!--
接著是 class 的內容。

`sweetnessOptions` 是甜度的選項，`selectedSweetness` 預設是 normal，所以畫面一開始會選中正常糖。`toppings` 是加料的選項，每一筆都有自己的 `checked`，彼此互不影響。

`selectedToppingsText` 是一個 getter：用 `filter` 篩出勾選的項目，用 `map` 取出名稱，有勾選就用頓號串起來，沒有就回傳「無」。因為是 getter，畫面上可以直接當作屬性讀取。
-->

---
layout: default
---

# 完整解答 — drink-order.component.html（一）

甜度單選：

```html
<div class="order-box">
  <h3>甜度（單選）</h3>
  <mat-radio-group [(ngModel)]="selectedSweetness">
    @for (opt of sweetnessOptions; track opt.value) {
      <mat-radio-button [value]="opt.value">
        {{ opt.label }}
      </mat-radio-button>
    }
  </mat-radio-group>
```

<!--
接著是 HTML 的甜度部分。

`mat-radio-group` 上用 `ngModel` 綁定 `selectedSweetness`，整組的選擇結果都會存在這一個變數裡。`@for` 走過 `sweetnessOptions`，每筆產生一個 `mat-radio-button`，用中括號 `value` 綁定選項的值。之後要增減選項，只要改陣列就好。
-->

---
layout: default
---

# 完整解答 — drink-order.component.html（二）

加料多選與結果顯示：

```html
  <h3>加料（可複選）</h3>
  @for (topping of toppings; track topping.label) {
    <mat-checkbox [(ngModel)]="topping.checked">
      {{ topping.label }}
    </mat-checkbox>
  }

  <p class="summary">
    你選的甜度：{{ selectedSweetness }}，加料：{{ selectedToppingsText }}
  </p>
</div>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 切換甜度選項，畫面下方文字應立即更新；勾選/取消多個加料，加料文字應跟著增減，且未勾選任何加料時應顯示「無」，不是空白。
</div>

<!--
最後是加料和結果的顯示。

`@for` 走過 `toppings`，每筆產生一個 `mat-checkbox`，`ngModel` 綁定 `topping.checked`，勾選就變成 true，取消就變成 false。

最下方顯示 `selectedSweetness` 和 `selectedToppingsText`。選項一改變，畫面就會自動更新。

驗證的方式是：切換甜度，下方文字立即更新；勾選或取消加料，文字跟著增減；沒有勾選任何加料時，顯示「無」而不是空白。
-->

---
layout: end
---

# 課程結束

### 掌握 `mat-radio-button` 實現單選互斥邏輯，善用 `mat-checkbox` 進行多選布林綁定，並瞭解 Angular Material 與純 HTML 寫法的差異與對應關係

<!--
這一章我們學了單選和多選。`mat-radio-group` 包住 `mat-radio-button`，一組只能選一個，綁定的是 `value`；純 HTML 的單選按鈕則要記得加上相同的 `name`。`mat-checkbox` 每個各自獨立，綁定的是布林值，使用 `ngModel` 時記得匯入 `FormsModule`。

下一章，我們會學習 Angular 的 Reactive Forms。我們下一章見。
-->

