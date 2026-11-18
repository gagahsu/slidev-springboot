---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Reactive Forms
routeAlias: ch51
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
    Reactive Forms
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「以程式碼驅動表單，掌控每一個輸入細節」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
用 `ngModel` 做表單很快，但欄位一多、規則一多，甚至欄位數量會動態變化時，HTML 的邏輯就會變得很難維護。

這一章要學 Reactive Forms，響應式表單，把表單的控制權搬到 TypeScript。最後我們會做出一個可以動態新增和刪除題目的問卷。
-->

---
layout: default
---

# Outline

- **Reactive Forms 是什麼** — 模型驅動表單的概念與特性
- **為什麼要用 Reactive Forms** — 四大使用優勢
- **Reactive Forms 核心** — FormControl、FormGroup、FormArray
- **動態增減欄位** — 使用 FormArray 實作新增／刪除題目
- **畫面顯示** — HTML 樣板繫結 `formGroup`、`formControlName`、`formArrayName`

<!--
這一章會先說明 Reactive Forms 是什麼、為什麼要用它，接著介紹三個核心的元件：FormControl、FormGroup 和 FormArray。然後實際動手，用 FormArray 做出可以新增和刪除題目的問卷，最後把它繫結到 HTML 畫面上。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Reactive Forms 是什麼？
# What is Reactive Forms?

<!--
如果表單的規則全寫在 HTML 裡，欄位一多就很難維護。Reactive Forms 把規則定義在 TypeScript。
-->

---

# Reactive Forms 是什麼？

Reactive Forms（響應式表單）是 Angular 中以**模型驅動（Model-Driven）**方式處理表單的技術。表單結構與驗證邏輯在 TypeScript 中顯式定義，實現視圖（HTML）與模型（Component）的同步。

**核心特性：**

- 高穩定性——表單狀態完全由 TypeScript 管理
- 易於驗證——驗證邏輯集中在程式碼層
- 適合複雜表單與動態表單
- 易於單元測試

<div class="flex justify-center mt-4">
  <img src="/images/51-reactive-forms/angular-forms-overview.png" class="rounded shadow-md max-h-48" />
</div>

<!--
Reactive Forms 是 Angular 裡以「模型驅動」方式處理表單的技術。表單的結構和驗證邏輯，都在 TypeScript 裡明確定義，再讓畫面和程式保持同步。

可以想成填申請表之前，辦公室裡先有一份表單設計圖，寫清楚每一欄要填什麼、哪些必填、有什麼格式限制，畫面只是照著設計圖印出來給人填。

它的特性是：狀態完全由 TypeScript 管理，比較穩定；驗證邏輯集中，好維護；適合複雜和動態的表單；也容易寫單元測試。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 為什麼要用 Reactive Forms？
# Why Use Reactive Forms?

<!--
為什麼要選 Reactive Forms，而不是熟悉的 Template-Driven Forms？我們來比較看看。
-->

---

# 為什麼要用 Reactive Forms？

Reactive Forms 將表單的「控制權」從 HTML 移至 TypeScript，以程式碼精確控制表單中的每一個細節。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**Template-Driven Forms**
- 邏輯散落於 HTML 樣板
- 適合簡單、靜態表單
- 雙向繫結 `[(ngModel)]`
- 不易進行單元測試

</div>
<div>

**Reactive Forms**
- 邏輯集中於 TypeScript
- 適合複雜、動態表單
- 顯式宣告表單結構
- 易於單元測試與重用

</div>
</div>

**四大優勢：**

1. 動態增減欄位（Dynamic Controls）
2. 即時監聽變化（Real-time Observation）
3. 複雜的驗證邏輯（Complex Validation）
4. 處理深層巢狀資料（Nested Data Structures）

<!--
這頁把兩種表單方式並排比較。

Template-Driven Forms，也就是用 `ngModel` 的寫法，邏輯分散在 HTML 裡，適合簡單、固定的表單，比較不容易測試。Reactive Forms 則把邏輯集中在 TypeScript，明確宣告表單結構，適合複雜、會變動的表單，也容易測試和重複使用。

下方列了四大優勢：可以動態增減欄位，可以即時監聽表單值的變化，容易組合複雜的驗證規則，也能處理多層的巢狀資料。只要遇到「表單會變、規則會變」的情況，實務上大多會選擇 Reactive Forms。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Reactive Forms 核心
# Core Building Blocks

<!--
接下來認識 Reactive Forms 的三個核心元件，等一下做問卷時都會用到。
-->

---

# Reactive Forms 核心

Reactive Forms 由三種積木組合而成：

| 類別 | 說明 | 範例 |
|---|---|---|
| **FormControl** | 最小單位，代表單一輸入欄位 | 姓名、Email、密碼 |
| **FormGroup** | 容器，將多個 FormControl 包成一個物件 | 地址欄位（縣市／區域／路） |
| **FormArray** | 動態陣列，管理數量不固定的欄位群組 | 問卷題目列表 |

**三者關係：**

- `FormGroup` 可包含多個 `FormControl` 與巢狀 `FormGroup`
- `FormArray` 可包含多個 `FormGroup`，每組代表一筆動態資料
- 整份表單通常以一個根 `FormGroup` 為起點

<!--
Reactive Forms 由三種元件組合而成，可以用收納盒來理解。

FormControl 是最小的單位，代表一個輸入欄位，例如姓名或 Email。FormGroup 是一個容器，把多個 FormControl 包成一組，例如地址就是縣市、區域和路名綁在一起。FormArray 是一個動態的陣列，管理數量不固定的欄位群組，例如問卷的題目清單。

三者的關係是：FormGroup 可以包含 FormControl，也可以包含另一個 FormGroup；FormArray 通常包含好幾個 FormGroup，每一組代表一筆資料；整份表單最外層通常是一個 FormGroup。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 動態增減欄位
# Dynamic Form Controls with FormArray

<!--
接下來，我們用動態問卷這個實際例子，練習用 FormArray 做出可以自由增減欄位的表單。
-->

---

# 動態增減欄位 — 使用情境

當表單題目數量不固定（例如：動態問卷），需以程式動態新增或刪除欄位。

單純使用 JavaScript `Array` 無法獲得 Reactive Forms 的驗證與狀態管理，因此使用 `FormArray`。

**範例情境：**

- 問卷固定欄位：`surveyTitle`（標題，必填）
- 動態欄位：`questions`（題目，可新增／刪除）
- 每道題目包含：題目名稱（`qTitle`）、題目類型（`qType`）、是否必填（`need`）

<!--
想像一個問卷系統，問卷標題是固定的一欄，但題目的數量不固定，使用者可能加兩題，也可能加二十題。

如果用一般的 JavaScript 陣列存放題目，雖然也能新增和刪除，卻沒辦法使用 Reactive Forms 的驗證和狀態管理。所以這裡用 FormArray。

範例裡，固定欄位是 `surveyTitle`，問卷標題，必填。動態欄位是 `questions`，題目清單。每道題目包含三個欄位：題目名稱 `qTitle`、題目類型 `qType`，以及是否必填 `need`。
-->

---

# 動態增減欄位 — 初始化（一）

**步驟一：** 在 `@Component` 的 `imports` 加入 `ReactiveFormsModule`。

**步驟二：** 以 `inject(FormBuilder)` 取得 `fb` 實例。

**步驟三：** 以 `fb.group()` 定義根 `FormGroup`：
- `surveyTitle`：`['', Validators.required]` — 初始值為空字串，加必填驗證
- `questions`：`fb.array([])` — 初始化空的 `FormArray`

<!--
我們一步一步建立這個表單。

第一步，在 `@Component` 的 `imports` 加入 `ReactiveFormsModule`。這是最常漏掉的一步，沒有它，畫面上的 `formGroup`、`formControlName` 這些指令都無法使用。

第二步，用 `inject(FormBuilder)` 取得 `fb`。FormBuilder 是 Angular 提供的建構工具，比自己一個一個建立更簡潔。

第三步，用 `fb.group()` 定義整份表單的結構：`surveyTitle` 的初始值是空字串，加上必填驗證；`questions` 用 `fb.array` 建立一個空的 FormArray。
-->

---

# 動態增減欄位 — 初始化（一）程式碼

```typescript
// app.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule], // 步驟一：加入 ReactiveFormsModule
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  fb = inject(FormBuilder); // 步驟二：取得 FormBuilder 實例

  // 步驟三：以 fb.group() 定義根 FormGroup
  form = this.fb.group({
    surveyTitle: ['', Validators.required], // 問卷標題
    questions: this.fb.array([])            // 題目空陣列
  });
}
```

<!--
我們看程式碼。

`imports` 加入 `ReactiveFormsModule`。`fb` 用 `inject(FormBuilder)` 取得，之後建立表單都靠它。

最重要的是 `form` 這個屬性，它就是整份表單最外層的 FormGroup。`surveyTitle` 有初始值和必填驗證，`questions` 先是一個空的 FormArray。

要注意，`fb.group()` 只是宣告結構，題目要等之後呼叫新增的方法才會出現。
-->

---

# 動態增減欄位 — 初始化（二）

**`surveyTitle` 陣列語法：**
- 第一個元素：欄位初始值（空字串）
- 第二個元素：驗證規則（`Validators.required`）

**`fb.array([])` 說明：** 建立空的 `FormArray`，後續以程式動態推入 `FormGroup`。

建立 getter `questionsArray`，方便 TypeScript 與 HTML 存取該 `FormArray`，需將 `form.get('questions')` 強型轉換為 `FormArray`。

<!--
我們仔細看 `surveyTitle` 的寫法。它是一個陣列，第一個元素是欄位的初始值，第二個元素是驗證規則。驗證規則在下一章會深入介紹。

`fb.array` 建立的是空的 FormArray，之後再用程式把題目推進去。

另外，`form.get('questions')` 回傳的型別比較通用，TypeScript 不知道它是 FormArray。所以我們寫一個 `questionsArray` 的 getter，把它轉型成 FormArray。這樣不管是 TypeScript 還是 HTML，要存取題目陣列，都直接用這個 getter，程式碼會乾淨很多。
-->

---

# 動態增減欄位 — 初始化（二）程式碼

```typescript
// app.component.ts
import { FormArray, FormBuilder, Validators } from '@angular/forms';

export class AppComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    surveyTitle: ['', Validators.required], // 第一個元素：初始值；第二個：驗證規則
    questions: this.fb.array([])            // fb.array([])：建立空的 FormArray
  });

  // getter：將 form.get('questions') 轉型為 FormArray 供外部存取
  get questionsArray(): FormArray {
    return this.form.get('questions') as FormArray;
  }
}
```

<!--
我們看加上 getter 之後的程式碼。

最下面的 `questionsArray`，回傳的是 `form.get('questions')`，並用 `as FormArray` 轉型。之後要新增題目，或在 HTML 用 `@for` 顯示題目，都直接使用 `this.questionsArray`，不用每次重複寫轉型。

到這裡，表單裡有 `surveyTitle` 和一個空的 `questions`，接下來學怎麼把題目加進去。
-->

---

# 動態增減欄位 — 新增題目

呼叫 `addQuestion()` 時：

1. 以 `fb.group()` 建立新的題目 `FormGroup`，包含三個欄位：`qTitle`（必填）、`qType`（預設 `'M'`）、`need`（預設 `false`）
2. 以 `questionsArray.push()` 將新 `FormGroup` 推入陣列
3. `console.log(this.form.value)` 可查看目前表單完整資料

```typescript
// app.component.ts
addQuestion() {
  const questionGroup = this.fb.group({
    qTitle: ['', Validators.required], // 題目名稱
    qType: ['M'],                      // 題目類型（單選/多選/簡答）
    need: [false]                      // 是否必填
  });

  this.questionsArray.push(questionGroup);

  // 可用以下 log 查看目前表單資料
  console.log(this.form.value);
}
```

<!--
這是新增題目的方法 `addQuestion`。

第一步，用 `fb.group()` 建立一個新的題目，裡面有三個欄位：`qTitle` 必填，`qType` 預設是 M，`need` 預設是 false。

第二步，用 `questionsArray.push()` 把這個題目推進陣列，這就是動態新增欄位真正發生的地方。

最後的 `console.log(this.form.value)` 是開發時的小技巧，可以印出整份表單目前的資料，確認結構對不對。

因為 HTML 會用 `@for` 顯示 `questionsArray`，陣列多了一筆，畫面上就會多出一組題目的輸入區塊。
-->

---

# 動態增減欄位 — 刪除題目

刪除操作與 JavaScript Array 概念相同：指定要移除資料的索引位置，呼叫 `FormArray` 的 `removeAt(index)` 方法即可移除對應的 `FormGroup`。

**`removeAt(index)`：** `FormArray` 的內建方法，依位置移除元素，後續索引自動重新排列。

```typescript
// app.component.ts

// 刪除題目（根據資料位置移除）
removeQuestion(index: number) {
  this.questionsArray.removeAt(index);
}
```

<!--
刪除題目的概念，和操作一般陣列一樣。

FormArray 提供了 `removeAt` 方法，傳入要刪除的位置，就會把那一筆 FormGroup 移除，後面的元素會自動往前補。

所以 `removeQuestion` 只有一行：`this.questionsArray.removeAt(index)`。等一下會在每題旁邊放一個刪除按鈕，點擊時把這一題的位置傳進來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 畫面顯示
# Template Binding

<!--
邏輯都寫好了，接下來把表單繫結到 HTML 畫面上。
-->

---

# 畫面顯示 — 繫結 formGroup（一）

**步驟一：** 在 HTML 的 `<form>` 標籤加上 `[formGroup]="form"`，將整個表單繫結至 TypeScript 中的 `form` 變數。

`ReactiveFormsModule` 必須已匯入至 `@Component` 的 `imports`，否則 `[formGroup]` 指令無法識別，畫面會報錯。

```html
<!-- app.component.html -->
<h2>動態問卷設計</h2>

<form [formGroup]="form">
</form>
```

```typescript
// app.component.ts
@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
```

<!--
第一步，在 `form` 標籤上加上中括號 `formGroup` 等於 `form`。

這一行的意思是告訴 Angular：「這張表單裡的所有內容，都對應到 TypeScript 裡的 `form`」。

再提醒一次，`@Component` 的 `imports` 一定要有 `ReactiveFormsModule`，否則 Angular 不認得 `formGroup` 這個指令，畫面一打開就會報錯。
-->

---

# 畫面顯示 — 繫結 formControlName（二）

在 `<form>` 標籤內，以 `formControlName` 屬性將輸入欄位繫結至 TypeScript 表單中的欄位名稱。

Reactive Forms **不使用** `[(ngModel)]` 做雙向繫結，改用 `formControlName` 對應 `FormGroup` 中定義的 key。

```html
<!-- app.component.html -->
<form [formGroup]="form">
  <label>問卷名稱：</label>
  <!-- formControlName 後面接的就是 form 中的欄位名稱 -->
  <input type="text" formControlName="surveyTitle">
</form>
```

<!--
第二步，用 `formControlName` 把輸入欄位繫結到表單裡的欄位。

這裡有一個重要的觀念轉換：Reactive Forms 不使用 `ngModel`，而是用 `formControlName`。它後面的字串，要和 `fb.group()` 裡定義的名稱完全一樣，這裡是 `surveyTitle`。

這就像一條線，把畫面上的 `input` 和 TypeScript 裡對應的 FormControl 連在一起。如果打錯字或大小寫不一致，欄位就會抓不到值。
-->

---

# 畫面顯示 — 繫結 formArrayName（三）

呈現 `FormArray` 題目列表：

1. 外層 `<div>` 加上 `formArrayName="questions"`，對應 TypeScript 中的 `FormArray`
2. 以 `@for` 迭代 `questionsArray.controls`，用 `control` 本身追蹤，**不要用 `$index`**
3. 迴圈內的 `<div>` 加上 `[formGroupName]="$index"`，對應每筆題目的 `FormGroup`

<!--
第三步，顯示題目清單。題目是一個陣列，要用迴圈顯示，這裡有三層繫結。

第一，外層的 `div` 加上 `formArrayName` 等於 questions，代表這個範圍對應到 `questions` 這個 FormArray。第二，用 `@for` 走過 `questionsArray.controls`，取得每一個 FormGroup。第三，迴圈裡的 `div` 加上中括號 `formGroupName` 等於 `$index`，用位置對應到第幾題。

另外先提醒，`@for` 的 `track` 不要用 `$index`，而要用 `control` 本身，原因在下一頁說明。
-->

---

# 畫面顯示 — 繫結 formArrayName（三）程式碼

```html
<!-- app.component.html -->
<form [formGroup]="form">
  <label>問卷名稱：</label>
  <input type="text" formControlName="surveyTitle">

  <div formArrayName="questions">
    <!-- track control：用 FormGroup 本身的身分追蹤，不要用 $index -->
    @for (control of questionsArray.controls; track control) {
      <!-- formGroupName 對應 questionsArray 的索引位置 -->
      <div [formGroupName]="$index">
        <label>題目：</label>
        <input type="text" formControlName="qTitle"
               placeholder="請輸入問題...">
      </div>
    }
  </div>

  <button type="button" (click)="addQuestion()">新增題目</button>
</form>
```

<!--
我們看實際的 HTML。

`formArrayName` 鎖定題目陣列的範圍，`@for` 用 `track control`。每一題的 `div` 用中括號 `formGroupName` 對應位置，因為陣列裡的每個元素都是一個 FormGroup，要用第幾組來對應。裡面的 `input` 再用 `formControlName` 對應 `qTitle`。

下方還有一個新增題目的按鈕，`type` 設為 button，避免被當成送出表單。一開始陣列是空的，沒有這個按鈕，畫面上就看不到任何題目。

為什麼 `track` 不能用 `$index`？如果刪除中間的某一題，用位置追蹤的話，Angular 會以為位置沒變，重複使用同一個輸入框去顯示不同的資料，結果看起來永遠是最後一題消失。改用 `control` 本身追蹤，畫面才會跟著正確的資料一起更新。
-->

---

# 畫面顯示 — 完整欄位繫結（四）

在每個題目的 `[formGroupName]="$index"` 區塊內，以 `formControlName` 繫結全部欄位：

```html
<div [formGroupName]="$index">
  <label>題目：</label>
  <input type="text" formControlName="qTitle" placeholder="請輸入問題...">

  <label>類型：</label>
  <select formControlName="qType">
    <option value="text">簡答題</option>
    <option value="radio">單選題</option>
    <option value="check">多選題</option>
  </select>

  <label>
    <input type="checkbox" formControlName="need"> 設定為必填
  </label>

  <button (click)="removeQuestion($index)">刪除題目</button>
</div>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>formControlName</code> 的值必須與 TypeScript 中 <code>fb.group()</code> 定義的 key 完全一致，大小寫有別。
</div>

<!--
這頁是完整的題目區塊，三個欄位都用 `formControlName` 繫結。

`qTitle` 是題目的輸入框，`qType` 用 `select` 選擇題型，`need` 用 checkbox 設定是否必填。最後的刪除按鈕呼叫 `removeQuestion`，並傳入 `$index`。

要特別注意，`formControlName` 的值要和 `fb.group()` 定義的名稱完全一致，大小寫也要一樣，這是練習時最常見的錯誤來源。
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

# 補充練習 1：商品成分清單

用 Reactive Forms 做一個可以動態增減的商品成分表：

1. 建立 `form`，包含 `productName` 控制項與 `ingredients` 陣列（`FormArray`）
2. 撰寫 `addIngredient()`，每次向陣列加入一組 `{ name, mg }`（成分名稱、毫克數）
3. 撰寫 `removeIngredient(index)`，刪除指定的成分
4. 在 HTML 用 `@for` 把成分表渲染出來，每一列都有刪除按鈕
5. 新增與刪除幾筆，確認畫面與 `form.value` 同步變化

<!--
第一題補充練習，用本章的問卷結構，改做一個商品成分表。

`productName` 是固定欄位，`ingredients` 是可以增減的 FormArray，每一筆有成分名稱和毫克數。結構和問卷的題目清單幾乎一樣，可以對照本章的範例來寫。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：商品成分清單 — 參考答案（TS）

```typescript
fb = inject(FormBuilder);

form = this.fb.group({
  productName: [''],
  ingredients: this.fb.array([])
});

get ingredientsArray(): FormArray {
  return this.form.get('ingredients') as FormArray;
}

addIngredient() {
  this.ingredientsArray.push(this.fb.group({ name: [''], mg: [0] }));
}

removeIngredient(index: number) {
  this.ingredientsArray.removeAt(index);
}
```

<!--
我們來看答案。

TS 的部分和問卷範例一樣：`fb.group` 定義結構，用 getter 把 `ingredients` 轉成 FormArray，`push` 新增一組，`removeAt` 刪除指定位置。
-->

---
layout: default
---

# 補充練習 1：商品成分清單 — 參考答案（HTML）

```html
<form [formGroup]="form">
  <input formControlName="productName" placeholder="商品名稱">
  <div formArrayName="ingredients">
    @for (item of ingredientsArray.controls; track $index) {
      <div [formGroupName]="$index">
        <input formControlName="name" placeholder="成分">
        <input formControlName="mg" type="number">
        <button type="button" (click)="removeIngredient($index)">刪除</button>
      </div>
    }
  </div>
  <button type="button" (click)="addIngredient()">新增成分</button>
</form>
```

<!--
HTML 用 `formArrayName` 對應陣列，`@for` 跑過 `controls`，每一列用 `formGroupName` 綁定索引，裡面的輸入框再用 `formControlName` 對應 `name` 和 `mg`。按鈕記得加 `type="button"`，不然會被當成送出表單。
-->

---
layout: default
---

# 補充練習 2：忘記匯入 ReactiveFormsModule

1. 在 HTML 中保留標準的 `[formGroup]="form"` 結構
2. 打開 `.ts`，故意把 `imports` 陣列中的 `ReactiveFormsModule` 刪除
3. 存檔，觀察瀏覽器拋出的錯誤
4. 補回匯入，確認錯誤消失

<!--
第二題補充練習，又是一個除錯實驗。

把 `ReactiveFormsModule` 拿掉，看看 `formGroup` 會出現什麼錯誤。前幾章我們已經看過好幾次類似的訊息，試著自己先判斷原因。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：忘記匯入 ReactiveFormsModule — 參考答案

```text
❌ Can't bind to 'formGroup' since it isn't a known property of 'form'.
```

```typescript
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html',
})
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>[(ngModel)]</code> 需要 <code>FormsModule</code>；<code>[formGroup]</code>、<code>formControlName</code> 需要 <code>ReactiveFormsModule</code>，兩者不要搞混
</div>

<!--
我們來看答案。

錯誤訊息是「無法綁定 formGroup，因為它不是 form 已知的屬性」，跟之前少了 `CommonModule`、`FormsModule` 時的訊息是同一類。

要特別分清楚：`ngModel` 用的是 `FormsModule`，`formGroup` 這類 Reactive Forms 的語法，用的是 `ReactiveFormsModule`。
-->

---
layout: end
---

# 課程結束

### Reactive Forms 以 TypeScript 顯式管理表單結構，透過 FormControl、FormGroup、FormArray 三種積木實現動態欄位、複雜驗證與巢狀資料的完整控制

<!--
這一章我們學了 Reactive Forms。它把表單的結構和規則集中在 TypeScript 管理，適合複雜和動態的表單。三個核心元件是：代表單一欄位的 FormControl、把欄位包成一組的 FormGroup，以及管理動態清單的 FormArray。我們用 `fb.group` 和 `fb.array` 建立結構，用 `push` 和 `removeAt` 增減題目，在 HTML 用 `formGroup`、`formControlName`、`formArrayName` 和 `formGroupName` 繫結，記得匯入 `ReactiveFormsModule`。

下一章，我們會學習用 Validators 替表單加上驗證規則。我們下一章見。
-->
