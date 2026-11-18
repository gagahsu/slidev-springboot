---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 日期選擇器
routeAlias: ch34
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
    日期選擇器
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「善用 input date 與 mat-datepicker，輕鬆實作日期選擇功能」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學了 `mat-icon`。這一章要看表單裡很常見的欄位：日期。

如果讓使用者自己打日期，格式五花八門，也容易打錯，所以需要一個用點選的日期選擇器。學完這一章，我們會知道原生的 `input type="date"` 和 Material 的 `mat-datepicker` 兩種做法，以及各自適合的情境。
-->

---
layout: default
---

# Outline

- **什麼是日期選擇器** — input date 與 mat-datepicker 兩種方案比較
- **input type="date" 的 type 類型** — month、date、time、datetime-local、week
- **input date 與 ngModel** — 以 ngModel 綁定日期值、設定 min/max
- **mat-datepicker 介紹** — 官方範例預覽與 HTML 結構說明
- **mat-datepicker HTML 元件說明** — mat-form-field、mat-label、mat-hint、mat-datepicker-toggle、mat-datepicker
- **mat-datepicker TS 設定** — 匯入模組與 provideNativeDateAdapter
- **mat-datepicker 資料綁定** — ngModel 初始值與 min/max 限制

<!--
這一章會先比較兩種方案的差異，接著看原生的 `input type="date"` 有哪些類型可以切換，以及怎麼用 `ngModel` 綁定它的值。後半段的重點是 `mat-datepicker`，從 HTML 結構、TypeScript 設定，一路到資料綁定和日期範圍的限制。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是日期選擇器？
# What is a Date Picker?

<!--
自己打字填日期，格式很難統一，日期選擇器讓使用者用點選的方式決定日期。
-->

---
zoom: 0.97
---

# 日期選擇器

頁面需要使用者選擇日期時，可選擇兩種方案：

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**`<input type="date">`**
- 寫法簡單，原生 HTML 支援
- 樣式由瀏覽器控制，各平台外觀不一致

</div>
<div>

**`<mat-datepicker>`**
- 需安裝較多套件
- 版型與資料格式由 Angular Material 統一處理
- 跨瀏覽器外觀一致

</div>
</div>

```html
<!-- 原生 input -->
<label for="birthday">Birthday:</label>
<input type="date" id="birthday" name="birthday">
<!-- mat-datepicker -->
<mat-form-field>
  <mat-label>Choose a date</mat-label>
  <input matInput [matDatepicker]="picker">
  <mat-hint>MM/DD/YYYY</mat-hint>
  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```

<!--
頁面需要使用者選擇日期時，有兩種方案。

第一種是原生的 `input type="date"`。寫法很簡單，一行就完成，但外觀由瀏覽器決定，不同瀏覽器和手機上看起來都不太一樣，也很難客製化。

第二種是 Angular Material 的 `mat-datepicker`。需要多寫幾行 HTML，也要匯入比較多模組，但版面和資料格式由 Angular Material 統一處理，在不同瀏覽器上外觀一致，日曆彈出視窗、格式提示這些功能也都內建好了。

簡單說，想要快速簡單，就用原生的 input；想要外觀一致、好看，就用 `mat-datepicker`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# input type="date" 的 type 類型
# Input Date Type Variants

<!--
我們先從比較簡單的原生 `input` 開始。除了 date，它還有好幾種類型，例如只選月份、只選時間，或是以週為單位選取。
-->

---

# input type="date" — 可用的 type 值

`<input type="date">` 可依需求切換 type，各類型分別顯示不同的選擇介面。值的格式為 `yyyy-MM-ddThh:mm`（例如 `2024-11-05T19:30`），月份與日期若小於 10 須補前置 0。

| type | 顯示內容 |
|------|---------|
| `month` | 年份 + 月份 |
| `date` | 年月日 |
| `time` | 時間（時:分） |
| `datetime-local` | 本地年月日 + 時間 |
| `week` | 年份 + 週數 |

每種類型皆支援 `value`、`min`（最小可選時間）、`max`（最大可選時間）屬性。

<!--
`input` 可以依照需求切換 `type`，每種類型會顯示不同的選擇介面。

看表格，`month` 選年和月，`date` 選年月日，`time` 選時間，`datetime-local` 同時選日期和時間，`week` 選年份和第幾週。

這些值的格式都有統一的規則，以 `datetime-local` 為例是 `yyyy-MM-ddThh:mm`。要特別注意，月份和日期小於 10 時，前面要補 0，否則瀏覽器可能讀不懂這個日期。

另外，每種類型都支援 `min` 和 `max` 屬性，用來限制可以選擇的範圍。接下來我們一個一個看畫面。
-->

---

# month（年月）

選擇年份與月份，不含日期。

<div class="flex justify-center">
  <img src="/images/34-date-picker/input-type-month.png" class="rounded shadow-md max-h-80" />
</div>

<!--
`month` 只選年份和月份，不含日期。

它很適合用在信用卡到期月份、月報表這類只需要年月的情境。畫面上只會出現年份和月份可以選擇。
-->

---

# date（年月日）

選擇完整的年月日，是最常用的類型。

<div class="flex justify-center">
  <img src="/images/34-date-picker/input-type-date.png" class="rounded shadow-md max-h-80" />
</div>

<!--
`date` 選擇完整的年月日，是最常用的類型。

生日、預約日期、訂單日期，大多都用它。畫面上就是我們熟悉的日曆選擇介面。
-->

---

# time（時間）

僅選擇時間（時、分），不含日期。

<div class="flex justify-center">
  <img src="/images/34-date-picker/input-type-time.png" class="rounded shadow-md max-h-80" />
</div>

<!--
`time` 只選擇時和分，不含日期。

適合用在預約時段、開會時間這類只需要時間的欄位，操作起來就像在手機上設定鬧鐘。
-->

---

# datetime-local（本地年月日 + 時間）

同時選擇日期與時間，左側為日曆，右側為時間滾輪。

<div class="flex justify-center">
  <img src="/images/34-date-picker/input-type-datetime-local.png" class="rounded shadow-md max-h-80" />
</div>

<!--
`datetime-local` 是把日期和時間合在一起，左邊是日曆，右邊是時間的選單。

適合用在活動報名截止時間、班機起飛時間這類需要精確到分鐘的情境。
-->

---

# week（年份 + 週數）

以週為單位選取，選中後整週日期全部反白顯示。

<div class="flex justify-center">
  <img src="/images/34-date-picker/input-type-week.png" class="rounded shadow-md max-h-80" />
</div>

<!--
`week` 比較特別，它選的不是某一天，而是第幾週。選中之後，整個星期的日期都會被標示起來。

適合用在排班表、週報這類以週為單位管理的資料。

五種類型都介紹完了，接下來看怎麼在 Angular 裡把選到的值綁定到變數上。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# input date 與 ngModel
# Input Date with ngModel

<!--
接下來把原生的日期欄位和 Angular 的資料綁定接起來，讓選到的日期存進變數。
-->

---
layout: two-cols
---

# input date — 以 ngModel 綁定日期

在 Angular 中以 `[(ngModel)]` 取代原生 `value` 屬性，並可透過 `min`、`max` 屬性限制可選範圍。值的格式為 `yyyy-MM-dd`（例如 `2024-11-05`）。

```html
<input type="date"
       [(ngModel)]="today"
       min="2024-11-05"
       max="2024-11-10">
```

```typescript
today = '2024-11-05';
```

::right::

<div class="flex items-center justify-center h-full">
  <img src="/images/34-date-picker/input-date-ngmodel-preview.png" class="rounded shadow-md max-h-72" />
</div>

<!--
在 Angular 裡，我們用 `ngModel` 雙向綁定取代原生的 `value` 屬性。使用者選了日期，TypeScript 裡的 `today` 變數就會自動同步。

`min` 和 `max` 屬性用來限制可選的範圍，這裡設定在 11 月 5 日到 11 月 10 日之間，超出範圍的日期就不能選。

要注意，`type="date"` 搭配 `ngModel` 時，值的格式是 `yyyy-MM-dd`，不含時間，而且是字串。

右邊的畫面可以看到，`today` 的初始值會直接顯示在選擇器裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# mat-datepicker
# Angular Material Datepicker

<!--
接下來是重點：外觀一致、在各種瀏覽器都好看的 `mat-datepicker`。
-->

---

# mat-datepicker — 官方範例預覽

Angular Material 提供的 `mat-datepicker` 外觀統一、功能完整，使用前先至官方文件找到 **Basic datepicker** 範例，查看其 HTML 與 TS 程式碼。

<div class="flex justify-center">
  <img src="/images/34-date-picker/mat-datepicker-preview.png" class="rounded shadow-md max-h-72" />
</div>

<!--
動手之前，一樣先到官方文件找範例。

官方文件裡有一個 Basic datepicker 的範例，畫面上就是它的樣子：一個輸入框，旁邊有日曆圖示，點下去會彈出日曆。接下來我們照著這個範例的 HTML 和 TypeScript，一步一步拆解。
-->

---

# mat-datepicker — HTML 結構

`<mat-form-field>` 是 Angular Material 的外層容器，負責套用統一樣式與排版；缺少此元件會導致畫面排版錯亂。

```html
<mat-form-field>
  <mat-label>Choose a date</mat-label>
  <input matInput [matDatepicker]="picker">
  <mat-hint>MM/DD/YYYY</mat-hint>
  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```

<!--
我們先看整體的 HTML 結構，總共有五個元件。

最外層是 `mat-form-field`，裡面依序是 `mat-label`、`input`、`mat-hint`、`mat-datepicker-toggle`，以及 `mat-datepicker` 本身。

最容易漏掉的是 `mat-form-field`。它負責套用 Angular Material 統一的樣式和排版，少了這一層，畫面的版面就會亂掉。

接下來，我們把每個元件拆開來看。
-->

---

# mat-datepicker — 各元件說明（一）

| 元件 / 指令 | 說明 |
|------------|------|
| `<mat-form-field>` | 最外層容器，套用 Angular Material 統一排版與樣式 |
| `<mat-label>` | 輸入框的預設提示標籤文字 |
| `<input matInput [matDatepicker]="picker">` | 實際輸入框，`matInput` 指令加入預設功能與樣式，`[matDatepicker]` 綁定對應的日期選擇器 |

<!--
先看前三個。

`mat-form-field` 是最外層的容器，就像一個相框，把裡面的元件統一包裝起來。`mat-label` 是輸入框的提示標籤，概念跟 placeholder 類似。

最重要的是 `input` 這一行。`matInput` 讓輸入框套用 Material 的樣式和行為；中括號 `matDatepicker` 等於 picker，則是告訴這個輸入框：「你要和叫做 picker 的日曆綁在一起」。
-->

---

# mat-datepicker — 各元件說明（二）

| 元件 / 指令 | 說明 |
|------------|------|
| `<mat-hint>` | 輸入框下方的提示訊息（例如格式說明） |
| `<mat-datepicker-toggle matIconSuffix [for]="picker">` | 顯示在輸入框後方的日曆圖示按鈕；改用 `matIconPrefix` 可移至前方 |
| `<mat-datepicker #picker>` | 點擊圖示後彈出的日期選擇面板，以 `#picker` 作為 ID 與上方元件互相綁定 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>[matDatepicker]</code>、<code>[for]</code>、<code>&lt;mat-datepicker&gt;</code> 三者使用的 ID 必須完全一致，否則選擇器無法正常運作。
</div>

<!--
再看後三個。

`mat-hint` 是輸入框下方的提示文字，通常用來說明日期格式。`mat-datepicker-toggle` 是輸入框後面的日曆圖示按鈕，如果想把圖示移到前面，可以把 `matIconSuffix` 換成 `matIconPrefix`。最後的 `mat-datepicker`，就是點擊圖示後彈出的日曆面板，用井字號 picker 當作它的名稱。

這裡要特別注意，`input` 上的 `matDatepicker`、按鈕上的中括號 `for`，以及 `mat-datepicker` 的井字號名稱，三個地方要完全一致。名稱可以自己取，但三處對不上的話，點日曆按鈕就不會有反應。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# mat-datepicker TS 設定
# TypeScript Configuration

<!--
HTML 結構看完了，接下來切到 TypeScript，看看元件需要加上哪些設定。
-->

---

# mat-datepicker — 匯入必要模組

在使用 `mat-datepicker` 的元件 TS 檔中，需匯入以下模組並加入 `provideNativeDateAdapter` 作為 provider：

```typescript
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  // ...
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
})
```

<!--
TypeScript 這邊有兩個重點。

第一個是 `providers` 裡的 `provideNativeDateAdapter()`。它讓 Angular Material 知道，要用瀏覽器原生的 Date 物件來處理日期。少了這一行，日期選擇器會直接報錯。

第二個是 `imports` 陣列。`MatFormFieldModule`、`MatInputModule` 和 `MatDatepickerModule` 三個模組缺一不可，分別對應 HTML 裡的 `mat-form-field`、`matInput` 和 `mat-datepicker`。

如果畫面上的元件顯示不出來，或樣式跑掉，第一件事就是檢查這幾個模組有沒有匯入齊全。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# mat-datepicker 資料綁定
# Data Binding

<!--
結構和設定都準備好了，最後我們看怎麼綁定選到的日期，以及怎麼限制可選的範圍。
-->

---

# mat-datepicker — 以 ngModel 綁定初始值

在 `<input>` 上加入 `[(ngModel)]` 進行雙向資料綁定。初始值需以 `new Date()` 建立 Date 物件。

```html
<input matInput [matDatepicker]="picker" [(ngModel)]="sDate">
```

```typescript
sDate = new Date('2024/11/8');
```

<div class="flex justify-center">
  <img src="/images/34-date-picker/mat-datepicker-ngmodel-initial.png" class="rounded shadow-md max-h-52" />
</div>

<!--
在 `input` 上加上 `ngModel`，就能雙向綁定選到的日期。

這裡要注意，和原生的 `input type="date"` 不同，`mat-datepicker` 綁定的值必須是 Date 物件，不能直接給字串。所以 `sDate` 用 `new Date` 建立，代表 2024 年 11 月 8 日。

原生的 input 用字串，`mat-datepicker` 用 Date 物件，這兩種寫法不能混用。執行之後，打開日曆就會停在我們設定的 11 月 8 日。
-->

---
layout: two-cols
---

# mat-datepicker — 設定 min / max 日期範圍

透過 `[min]` 與 `[max]` 屬性限制可選取的日期範圍，超出範圍的日期會呈現灰色不可點擊狀態。

```html
<input matInput
       [matDatepicker]="picker"
       [min]="minDate"
       [max]="maxDate"
       [(ngModel)]="sDate">
```

```typescript
sDate    = new Date('2024/11/8');
minDate  = new Date('2024/11/3');
maxDate  = new Date('2024/11/20');
```

::right::

<div class="flex items-center justify-center h-full">
  <img src="/images/34-date-picker/mat-datepicker-min-max.png" class="rounded shadow-md max-h-72" />
</div>

<!--
接著加上日期範圍的限制。

用中括號 `min` 和 `max` 屬性綁定，值一樣要是 Date 物件。這裡設定 `minDate` 是 11 月 3 日，`maxDate` 是 11 月 20 日。

看右邊的畫面，超出範圍的日期會變成灰色，不能點選。這樣就能避免使用者選到不合理的日期，例如預約時選到已經過去的時間。
-->

---

# 補充：動態計算 min / max 日期範圍

前面範例的 `minDate`、`maxDate` 都是寫死的日期，但實務上像「訂單只能選未來 90 天內」「請假申請只能回溯 7 天」這類需求，日期範圍要跟著「今天」滾動，不能寫死成固定日期。

「用 `new Date()` 取得當下時間，再用 `setDate()` 搭配 `getDate()` 位移天數，就能動態算出以今天為基準的日期範圍」。

```typescript
today: Date = new Date();
minDate: Date = new Date();
maxDate: Date = new Date();

constructor() {
  this.minDate.setDate(this.today.getDate() - 7);
  this.maxDate.setDate(this.today.getDate() + 90);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>setDate()</code> 是直接修改 Date 物件本身（mutate），不是回傳新物件，三個變數一定要各自 <code>new Date()</code>，不能共用同一個參照，否則 <code>setDate()</code> 會互相覆蓋。
</div>

<!--
前面的 `minDate` 和 `maxDate` 都是寫死的日期。但實務上的需求，通常是「只能選未來 90 天內」或「只能回溯 7 天」，範圍要跟著今天移動。

做法是用 `new Date()` 取得今天，再用 `setDate` 搭配 `getDate` 位移天數。`getDate` 回傳今天是幾號，`setDate` 把日期設成指定的數字。所以 `minDate` 是今天減 7 天，`maxDate` 是今天加 90 天。

要注意，`setDate` 會直接修改原本的 Date 物件，而不是回傳新的物件。所以三個變數一定要各自 `new Date()`，如果共用同一個物件，兩次 `setDate` 就會互相覆蓋。

另外，這個範圍是在元件建立時算出來的。如果頁面一直開著跨到隔天，範圍不會自動更新。
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

# 補充練習 1–2：雙向綁定與除錯實驗

**練習 1：訂單日期雙向綁定**

1. 在 HTML 建立 `type="date"` 的原生輸入框
2. 用 `[(ngModel)]="orderDate"` 綁定變數
3. 在下方寫 `<p>您選擇的出貨日期為：{{ orderDate }}</p>`
4. 隨意更換日期，確認文字即時連動

**練習 2：忘記 DateAdapter 的錯誤**

1. 在專案中貼上標準的 `mat-datepicker` 程式碼
2. 打開 `.ts`，故意把 `providers` 中的 `provideNativeDateAdapter()` 刪除
3. 觀察 Console 拋出的錯誤，再補回來

<!--
接下來兩題補充練習。

第一題，用原生的日期輸入框搭配 `ngModel`，把選到的日期即時顯示在下方。

第二題是除錯實驗：把 `provideNativeDateAdapter` 刪掉，看看 Material 日期選擇器會出現什麼錯誤訊息，記住它，之後遇到就知道怎麼處理。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
orderDate: string = '';
```

```html
<input type="date" [(ngModel)]="orderDate">
<p>您選擇的出貨日期為：{{ orderDate }}</p>
```

```typescript
@Component({
  selector: 'app-root',
  // providers: [provideNativeDateAdapter()],   ← 刪掉這行
  ...
})
// ❌ Console：Error: MatDatepicker: No provider found for DateAdapter.
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 原生 <code>type="date"</code> 綁定的值是 <code>'2026-10-29'</code> 這種字串；Material 日期選擇器則需要 DateAdapter 負責日期的解析與格式化
</div>

<!--
我們來看答案。

第一題，原生日期輸入框綁定的值，會是「年-月-日」格式的字串，選好日期，下方文字立刻跟著改變。記得匯入 `FormsModule`。

第二題，刪掉 `provideNativeDateAdapter` 之後，打開日曆時 Console 會出現找不到 DateAdapter 的錯誤。DateAdapter 負責讓日期選擇器看懂日期，看到這個訊息，就回去檢查 `providers` 有沒有設定。
-->

---
layout: default
---

# 補充練習 3：限制可預約日期

預約系統不希望使用者選到「過去的時間」或「太久以後的未來」：

1. 在 TS 用 `Date` 物件計算「明天」與「一週後」兩個日期
2. 把它們分別綁定到 `mat-datepicker` 輸入框的 `[min]` 與 `[max]`
3. 打開日曆，確認只有明天起 7 天內可以點選，其餘日期全部變灰

<!--
第三題補充練習，限制可以選的日期範圍。

用 `Date` 物件算出明天和一週後，綁定到日期輸入框的 `min` 和 `max`。想一想，要怎麼從今天的日期，算出明天的日期？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：限制可預約日期 — 參考答案

```typescript
minDate: Date;
maxDate: Date;

constructor() {
  const today = new Date();
  this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  this.maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
}
```

```html
<mat-form-field>
  <mat-label>預約日期</mat-label>
  <input matInput [matDatepicker]="picker" [min]="minDate" [max]="maxDate">
  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>
```

<!--
我們來看答案。

先取得今天的日期，再用年、月、日重新建立一個日期，日加 1 就是明天，日加 7 就是一週後。如果剛好遇到月底，`Date` 會自動進位到下個月，不用自己處理。

HTML 的輸入框加上中括號 `min` 和 `max`，綁定這兩個日期，日曆上超出範圍的日期就會變灰，無法點選。
-->

---
layout: end
---

# 課程結束
### 善用 input date 與 mat-datepicker，依需求選擇最適合的日期選擇方案

<!--
這一章我們學了兩種日期選擇的方式。原生的 `input type="date"` 簡單快速，有多種類型可以切換，搭配 `ngModel` 時值是字串，但外觀由瀏覽器決定。`mat-datepicker` 需要匯入三個模組和 `provideNativeDateAdapter`，三個地方的 picker 名稱要一致，綁定的值必須是 Date 物件，並且可以用中括號 `min` 和 `max` 限制範圍。

下一章，我們會學習用 DatePipe 把日期格式化成想要的顯示方式。我們下一章見。
-->
