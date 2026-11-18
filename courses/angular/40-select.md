---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Select
routeAlias: ch40
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
    Select
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「掌握 HTML select 與 Angular Material mat-select，打造靈活的下拉選單」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學了 Tabs。這一章要學表單裡常見的下拉選單，也就是 select。

下拉選單能把很多選項收在一個小空間裡。在 Angular 裡有兩種做法：原生 HTML 的 `select`，以及 Angular Material 的版本。學完這一章，我們會知道兩者怎麼寫、差在哪裡、什麼時候該選哪一種。
-->

---
layout: default
---

# Outline

- **Select 簡介** — HTML 原生 select 與 Angular Material mat-select 的差異
- **HTML select 寫法** — `<select>` 搭配 `[(ngModel)]` 雙向綁定
- **mat-select 寫法** — `<mat-select>`/`<mat-option>` 元件寫法、`matNativeControl` 屬性與必要模組匯入
- **何時選擇哪種** — 根據需求選用原生或 Material 元件

<!--
這一章會先介紹兩種下拉選單的差異，接著分別示範原生 HTML `select` 的寫法，以及 Angular Material 的 `mat-select` 寫法。最後把兩者放在一起比較，幫助我們判斷實務上該怎麼選。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Select 簡介
# Introduction to Select

<!--
我們先建立一個整體的概念：下拉選單是什麼，Angular 裡有哪些做法。
-->

---

# Select 簡介

下拉選單（select）提供使用者從多個選項中擇一的輸入方式。Angular 支援兩種實作方式：

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**HTML 原生寫法**
- 使用 `<select>` 與 `<option>` 標籤
- 樣式為瀏覽器預設，跨平台外觀不一致
- 搭配 `[(ngModel)]` 雙向綁定

</div>
<div>

**Angular Material 寫法**
- 使用 `<mat-select>` 或 `matNativeControl`
- 統一 Material Design 視覺樣式
- 需匯入 `MatSelectModule`、`MatFormFieldModule`

</div>
</div>

<div class="flex justify-center mt-2">
  <img src="/images/40-select/html-vs-mat-select-comparison.png" class="rounded shadow-md max-h-80" />
</div>

<!--
下拉選單讓使用者從多個選項中選擇一個。Angular 支援兩種做法。

左邊是 HTML 原生的寫法，使用 `select` 和 `option` 標籤，搭配 `ngModel` 雙向綁定。外觀是瀏覽器預設的樣子，不同瀏覽器和作業系統看起來可能不一樣。

右邊是 Angular Material 的寫法，使用 `mat-select`，或是在原生 `select` 加上 `matNativeControl`，會統一套用 Material Design 的樣式，但需要匯入 `MatSelectModule` 和 `MatFormFieldModule`。

接下來我們實際寫寫看，寫完再回頭看這張圖會更有感覺。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# HTML select 寫法
# Native HTML Select

<!--
我們先從最基本的原生 HTML `select` 開始，理解它之後，再看 Material 版本會更容易。
-->

---

# HTML select — 基本結構

`<select>` 是最外層的選單容器，`[(ngModel)]` 的值等於目前選中的 `<option>` 的 `value`。

```html
<select [(ngModel)]="selectData">
  <option value="">--Please choose an option--</option>
  <option value="volvo">Volvo</option>
  <option value="saab">Saab</option>
  <option value="mercedes">Mercedes</option>
</select>
```

<div class="grid grid-cols-2 gap-4 my-3">
<div>

- 選擇「Volvo」後，`selectData` 的值為 `"volvo"`
- 第一個 `<option>` 的 `value=""` 作為預設佔位選項

</div>
<div>

<div class="flex justify-center">
  <img src="/images/40-select/html-select-dropdown-preview.png" class="rounded shadow-md max-h-52" />
</div>

</div>
</div>

<!--
我們看原生 `select` 的基本結構。

`select` 是最外層的容器，裡面每一個 `option` 就是一個選項。`option` 的 `value` 屬性，才是會被綁定到變數的值；標籤中間的文字，只是顯示給使用者看的。

第一個 `option` 的 `value` 是空字串，這是刻意設計的預設選項，讓使用者一開始看到的是「請選擇」。

要注意，畫面上顯示的 Volvo 和 `value` 的 volvo 不是同一件事，`ngModel` 綁定的永遠是 `value`。所以選了 Volvo 之後，`selectData` 的值會是小寫的 volvo。
-->

---

# HTML select — ngModel 說明（一）

| 元素 | 角色 |
|------|------|
| `<select [(ngModel)]="selectData">` | 選單容器，雙向綁定到 `selectData` 變數 |
| `<option value="volvo">Volvo</option>` | 選項，`value` 為綁定到 `selectData` 的實際值 |
| 使用者選擇 Volvo 後 | `selectData === "volvo"` |

<!--
這張表把三個角色再整理一次。

`select` 是選單容器，用 `ngModel` 雙向綁定到 `selectData`。`option` 是選項，它的 `value` 是實際綁定的值。使用者選了 Volvo 之後，`selectData` 就等於 volvo。

可以把它想成點餐機：`select` 是整台點餐機，`option` 是每個餐點按鈕。按下按鈕後，機器記住的是餐點的代號，而不是按鈕上的圖片和文字。
-->

---

# HTML select — ngModel 說明（二）

使用前需在 TS 中匯入 `FormsModule`：

```typescript
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  // ...
})
export class AppComponent {
  selectData = '';
}
```

<!--
要使用 `ngModel`，必須先在元件匯入 `FormsModule`，這跟之前學雙向繫結時的規則一樣。

這裡 `selectData` 的初始值是空字串，剛好對應到那個 `value` 為空的預設選項，所以畫面一開始會顯示「請選擇」。

如果只寫了 `ngModel`，卻忘了匯入 `FormsModule`，畫面不會有反應，甚至會報錯。看到 `ngModel`，就要先檢查有沒有匯入這個模組。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# mat-select 寫法
# Angular Material mat-select

<!--
學會原生寫法之後，接下來看怎麼用 Angular Material，讓下拉選單的風格更一致。
-->

---

# mat-select — 基本用法

Angular Material 提供兩種整合方式：`<mat-select>` 元件、與在原生 `<select>` 上加 `matNativeControl` 屬性。先看 `<mat-select>` 元件本身怎麼寫。

```html
<mat-form-field>
  <mat-label>Favorite food</mat-label>
  <mat-select>
    @for (food of foods; track food) {
      <mat-option [value]="food.value">{{food.viewValue}}</mat-option>
    }
  </mat-select>
</mat-form-field>
```

- `<mat-select>` 取代原生 `<select>`，`<mat-option>` 取代 `<option>`
- `@for` 迴圈搭配 `track food` 產生選項，`[value]` 綁定實際值，內容顯示 `viewValue`

<!--
Angular Material 提供兩種整合方式：`mat-select` 元件，以及在原生 `select` 上加 `matNativeControl`。我們先看 `mat-select`。

最外層一樣是 `mat-form-field`，`mat-label` 是標籤文字。`mat-select` 取代原生的 `select`，`mat-option` 取代 `option`。

選項通常用 `@for` 從陣列產生，不用一個一個手動寫。每個 `mat-option` 用中括號 `value` 綁定實際的值，中間顯示的是 `viewValue`。`track food` 則是 `@for` 必填的追蹤設定。
-->

---
zoom: 0.89
---

# mat-select — 元件程式碼

```typescript
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'select-overview-example',
  templateUrl: 'select-overview-example.html',
  imports: [MatFormFieldModule, MatSelectModule, FormsModule],
})
export class SelectOverviewExample {
  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];
}
```

- `foods` 陣列即為 `@for` 迴圈的資料來源，每筆含 `value`（實際值）與 `viewValue`（顯示文字）
- 需匯入 `MatFormFieldModule`、`MatSelectModule`

<!--
這是對應的元件程式碼。

`Food` interface 定義了每個選項有 `value` 和 `viewValue` 兩個欄位。`foods` 陣列就是 `@for` 的資料來源，分別對應 HTML 裡綁定的值和顯示的文字。

`imports` 陣列要放 `MatFormFieldModule` 和 `MatSelectModule`，這是 `mat-select` 運作的基本需求。

這種寫法很適合選項來自動態資料的情況，例如從 API 拿到的清單，只要放進陣列，模板完全不用改。
-->

---

# mat-select — 使用 matNativeControl

`<mat-select>` 元件之外，Angular Material 也支援在原生 `<select>` 上加 `matNativeControl` 屬性。使用 `matNativeControl` 可保留原生 select 語意，同時套用 Material 樣式。

```html
<mat-form-field>
  <mat-label>Cars</mat-label>
  <select matNativeControl [(ngModel)]="selectData">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
  </select>
</mat-form-field>
```

- `<mat-form-field>` 提供 Material 外框與標籤
- `<mat-label>` 為浮動標籤文字
- `matNativeControl` 讓 Angular Material 識別並套用樣式

<!--
除了 `mat-select` 元件，也可以在原生的 `select` 上加一個 `matNativeControl` 屬性。

這樣做可以保留原生 `select` 的操作方式，同時套用 Material 的樣式。`mat-form-field` 提供 Material 的外框，`mat-label` 是會浮動的標籤文字，`matNativeControl` 則是讓 Angular Material 認出這個原生 `select` 的關鍵。

執行之後，會看到一個有 Material 外框和浮動標籤的下拉選單，但操作起來跟原生的 `select` 一樣。
-->

---

# mat-select — 必要模組匯入

HTML 加入後若出現錯誤，需在 TS 的 `imports` 陣列中加入對應模組：

```typescript
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectData = '';
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>MatInputModule</code> 支援 <code>matNativeControl</code> 的樣式渲染，缺少時外框樣式可能不正確。
</div>

<!--
在 HTML 加上 `matNativeControl` 之後，還要在 TypeScript 匯入對應的模組。

這裡總共要匯入四個：`MatFormFieldModule`、`MatSelectModule`、`MatInputModule`，以及讓雙向綁定運作的 `FormsModule`。

特別注意 `MatInputModule`。雖然我們沒有直接用到輸入框，但 `matNativeControl` 的樣式需要它，少了的話，外框樣式可能會不正確。

如果畫面出現找不到指令的錯誤，第一件事就是回來檢查這幾個模組有沒有都匯入。
-->

---
layout: two-cols
---

# mat-select — 效果預覽

**原生 HTML select**
- 外觀由瀏覽器決定
- 無浮動標籤
- 樣式難以統一

**matNativeControl**
- Material Design 外框
- 浮動 label 效果
- 與其他 mat-form-field 元件風格一致

::right::

<div class="flex items-center justify-center h-full">
  <img src="/images/40-select/mat-native-control-preview.png" class="rounded shadow-md max-h-80" />
</div>

<!--
我們直接比較兩種效果。

原生的 HTML `select`，外觀由瀏覽器決定，沒有浮動標籤，樣式也很難統一。加上 `matNativeControl` 之後，多了 Material 的外框和浮動標籤，而且和頁面上其他 `mat-form-field` 元件的風格一致。

同樣是下拉選單，視覺上的差異很明顯，這也是很多專案選擇使用 Material 版本的原因。
-->

---

# 兩種寫法對照

| 項目 | HTML 原生 `<select>` | Angular Material `matNativeControl` |
|------|----------------------|--------------------------------------|
| 外框樣式 | 瀏覽器預設 | Material Design |
| 浮動標籤 | 無 | 有（`<mat-label>`） |
| 雙向綁定 | `[(ngModel)]` | `[(ngModel)]` |
| 必要模組 | `FormsModule` | `MatFormFieldModule`, `MatSelectModule`, `MatInputModule`, `FormsModule` |
| 適用場景 | 簡單表單、無 Material 風格需求 | 統一 Material Design 風格的表單 |

<!--
我們把兩種寫法整理成一張表。

主要的差異在外框樣式、有沒有浮動標籤，以及需要匯入的模組數量。雙向綁定的方式則是一樣的，都用 `ngModel`。

實務上怎麼選？如果專案沒有使用 Material，或只是很簡單的表單，原生的 `select` 就夠用了。如果專案已經在用 Material 元件，或對視覺一致性有要求，就選擇 `matNativeControl` 或 `mat-select`。
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

# 補充練習 1–2：原生選單與除錯實驗

**練習 1：寵物補給品選單**

1. 建立原生 `<select>`，綁定 `[(ngModel)]="petChoice"`
2. 選項：貓咪主食罐（`cat-can`）、離乳營養膏（`nutri-paste`）
3. 在下方用 `{{ petChoice }}` 即時印出
4. 確認選取「貓咪主食罐」時，下方顯示 `cat-can`

**練習 2：忘記匯入 FormsModule**

故意把 `imports` 陣列中的 `FormsModule` 移除，觀察錯誤訊息，再補回來。

<!--
接下來兩題補充練習。

第一題，做一個原生下拉選單，用 `ngModel` 綁定，下方即時顯示選到的值。注意顯示的是 `option` 的 `value`，不是選項文字。

第二題是除錯實驗：把 `FormsModule` 拿掉，看看 `ngModel` 會出現什麼錯誤。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
petChoice: string = '';
```

```html
<select [(ngModel)]="petChoice">
  <option value="cat-can">貓咪主食罐</option>
  <option value="nutri-paste">離乳營養膏</option>
</select>
<p>您選擇的是：{{ petChoice }}</p>
```

```text
❌ Can't bind to 'ngModel' since it isn't a known property of 'select'.
```

<!--
我們來看答案。

`ngModel` 的值等於目前選中的 `option` 的 `value`，所以選貓咪主食罐，下方顯示的是 `cat-can`。

拿掉 `FormsModule` 之後，會出現「無法綁定 ngModel」的錯誤，跟上一章 `ngClass` 少了模組時的訊息很像。看到這類錯誤，就去檢查 `imports`。
-->

---
layout: default
---

# 補充練習 3：用 @for 產生選項

實務上，選單的選項通常來自後端資料，而不是寫死在 HTML：

1. 在 TS 宣告陣列：

```typescript
catBreeds = [
  { code: 'minuet',  name: '曼赤肯貓' },
  { code: 'bsh',     name: '英國短毛貓' },
  { code: 'persian', name: '波斯貓' }
];
```

2. 在 `<select matNativeControl>` 內用 `@for` 跑過這個陣列
3. `option` 的 `[value]` 綁定 `breed.code`，文字顯示 `{{ breed.name }}`
4. 確認選單出現三種貓，且選取時能取得對應的代碼

<!--
第三題補充練習，用 `@for` 動態產生選項。

選項資料放在 TS 的 `catBreeds` 陣列，HTML 用 `@for` 跑過它，每一筆產生一個 `option`：值是代碼，顯示的文字是品種名稱。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：用 @for 產生選項 — 參考答案

```html
<mat-form-field>
  <mat-label>貓咪品種</mat-label>
  <select matNativeControl [(ngModel)]="selectedBreed">
    @for (breed of catBreeds; track breed.code) {
      <option [value]="breed.code">{{ breed.name }}</option>
    }
  </select>
</mat-form-field>
<p>品種代碼：{{ selectedBreed }}</p>
```

```typescript
selectedBreed: string = '';
```

<!--
我們來看答案。

`@for` 跑過 `catBreeds`，每一筆產生一個 `option`，中括號 `value` 綁定代碼，中間顯示品種名稱。`track` 用 `breed.code`，因為每個代碼都是唯一的。

之後資料改成從 API 取得，只要把結果存進 `catBreeds`，選單就會自動更新，HTML 完全不用改。
-->

---
layout: end
---

# 課程結束
### 選用合適的 select 實作方式，兼顧功能需求與視覺一致性

<!--
這一章我們學了兩種下拉選單的做法。原生 `select` 搭配 `option` 和 `ngModel`，綁定的是 `option` 的 `value`，記得匯入 `FormsModule`。Angular Material 則可以用 `mat-select` 搭配 `@for` 產生選項，或在原生 `select` 加上 `matNativeControl`，並匯入對應的模組。

下一章，我們會學習在 Angular 裡畫出圓餅圖。我們下一章見。
-->

