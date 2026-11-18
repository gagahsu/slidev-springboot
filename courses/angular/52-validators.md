---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Validators
routeAlias: ch52
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
    Validators
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「透過內建驗證器，確保表單資料的正確性與完整性」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們用 Reactive Forms 定義了表單的結構。但如果使用者亂填資料，例如 Email 沒有小老鼠、密碼留空、年齡填負數，這些都應該被擋下來。

這一章要學的 Validators，就是表單的驗證器。就像郵局寄包裹前，會先檢查地址和重量，不符合規定就不能寄。學完這一章，我們會套用各種內建驗證器，並讀取驗證結果，顯示錯誤訊息。
-->

---
layout: default
---

# Outline

- **Validators 概念** — 表單驗證器的定義與用途
- **Validators 的使用方式** — import 與基本語法
- **多個 Validators 的組合** — 陣列語法與注意事項
- **常用內建 Validators 一覽** — 8 種常用驗證器
- **Validators.pattern 與 Regex** — 正規表達式應用
- **驗證結果的讀取** — `.invalid` 的用法與範例

<!--
這一章會先說明 Validators 的概念和基本用法，以及怎麼組合多個驗證規則。接著整理八個常用的內建驗證器，深入介紹 `pattern` 搭配正規表達式的用法。最後學習怎麼讀取驗證的狀態並顯示錯誤訊息，再用一個會員註冊表單把全部串起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Validators 概念
## What Are Validators

<!--
沒有驗證的表單，送出的資料可能是空的或格式錯誤。Validators 會在送出前先幫我們檢查。
-->

---

# Validators 是什麼？

Validators（驗證器）是 Angular Forms 的輸入驗證機制，負責檢查使用者輸入的資料是否符合預設規則。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**驗證失敗時的行為**
- 將表單欄位標記為「無效（invalid）」
- 提供對應的錯誤代碼
- 可用於阻止表單送出

</div>
<div>

**適用表單類型**
- Reactive Forms（響應式表單）
- Template-driven Forms（範本驅動表單）
- 本課程以 Reactive Forms 為主

</div>
</div>

<div class="flex justify-center">
  <img src="/images/52-validators/angular-form-validation-concept.png" class="rounded shadow-md max-h-48" />
</div>

<!--
Validators，驗證器，是 Angular 表單的輸入驗證機制，負責檢查使用者輸入的資料是否符合規則。

驗證失敗時，會發生三件事：欄位被標記為無效，也就是 invalid；附上對應的錯誤代碼；我們可以用這個狀態阻止表單送出。

Validators 在 Reactive Forms 和 Template-driven Forms 都能使用，這門課以 Reactive Forms 為主。實務上，註冊、登入、訂單這類表單，幾乎都一定會加上驗證。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Validators 的使用方式
## How to Use Validators

<!--
了解概念之後，我們來看怎麼在程式裡套用 Validators。
-->

---

# 引入 Validators

使用 Validators 前，需先從 `@angular/forms` 匯入。

```typescript
import { Validators } from '@angular/forms';
```

在 `FormGroup` 的欄位定義中，陣列的第二個元素用於指定驗證器（非必填）：

```typescript
// 語法結構：[初始值, 驗證器]
form = this.fb.group({
  surveyTitle: ['', Validators.required],  // 必填驗證
  questions:   this.fb.array([])           // 無驗證
});
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> 陣列第一個元素為欄位初始值，第二個元素為驗證器，驗證器非必填，可省略。
</div>

<!--
使用前，先從 `@angular/forms` 匯入 `Validators`。

上一章提過，`fb.group()` 裡每個欄位可以寫成一個陣列：第一個元素是初始值，第二個元素是驗證器。這裡 `surveyTitle` 加上了 `Validators.required`，代表必填；`questions` 不需要驗證，就不用寫第二個元素。

要注意順序是固定的，初始值在前，驗證器在後。
-->

---

# 使用多個 Validators

若需同時套用多個驗證器，將驗證器以陣列包覆，並以逗號分隔。

```typescript
form = this.fb.group({
  surveyTitle: ['', [Validators.required, Validators.maxLength(5)]],
});
```

**注意事項**
- 驗證器之間無數量上限
- 避免設定互相衝突的驗證規則（例如同時設定 `minLength(10)` 與 `maxLength(5)`）

<!--
如果一個欄位要同時符合好幾條規則，就把驗證器用一個陣列包起來，用逗號分隔。這裡 `surveyTitle` 同時是必填，而且最多 5 個字。

驗證器的數量沒有上限，但要避免規則互相衝突。例如同時設定最少 10 個字、最多 5 個字，這個欄位就永遠不可能通過。這種邏輯錯誤 Angular 不會幫我們檢查，要自己留意。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 常用內建 Validators
## Built-in Validators

<!--
接下來，我們整理 Angular 內建最常用的驗證器，之後寫表單時可以直接查表。
-->

---

# 常用 Validators 一覽

| 驗證器 | 說明 |
| --- | --- |
| `Validators.required` | 必填。欄位值不可為空字串、`null` 或 `undefined` |
| `Validators.requiredTrue` | 值必須為 `true`，常用於 Checkbox 勾選確認 |
| `Validators.email` | 驗證 Email 格式，需包含 `@` 與 `.` |
| `Validators.minLength(n)` | 字串長度不得少於 n 個字元 |
| `Validators.maxLength(n)` | 字串長度不得超過 n 個字元 |
| `Validators.min(n)` | 數值不得小於 n（用於數字欄位） |
| `Validators.max(n)` | 數值不得大於 n（用於數字欄位） |
| `Validators.pattern(/regex/)` | 值必須符合指定的正規表達式 |

<!--
這張表整理了八個常用的驗證器，我們挑重點說明。

`required` 是必填，值不能是空的。`requiredTrue` 則是值一定要是 true，常用在「同意條款」的勾選框。`email` 只檢查格式像不像 Email，不會真的確認信箱存不存在。

`minLength` 和 `maxLength` 限制字串的長度；`min` 和 `max` 限制數值的大小。這兩組很容易搞混，要注意欄位是文字還是數字。

最後的 `pattern` 最有彈性，可以用正規表達式定義任何格式規則，等一下會詳細介紹。
-->

---

# 常用 Validators — 範例

```typescript
form = this.fb.group({
  username: ['', [Validators.required, Validators.minLength(3)]],
  email:    ['', [Validators.required, Validators.email]],
  age:      [null, [Validators.min(18), Validators.max(99)]],
  agree:    [false, Validators.requiredTrue],
  zipCode:  ['', Validators.pattern(/^\d{5}$/)],
});
```

<!--
我們看一個綜合的範例。

`username` 必填，而且至少 3 個字，所以用陣列放了兩個驗證器。`email` 必填，並檢查格式。`age` 用 `min` 和 `max` 限制在 18 到 99 之間。`agree` 用 `requiredTrue`，一定要勾選。`zipCode` 用 `pattern`，限制必須是 5 位數字。

只要任何一個欄位不符合規則，那個欄位就是 invalid，我們可以用它阻擋送出或顯示錯誤訊息。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Validators.pattern 與 Regex
## Pattern Validator and Regular Expressions

<!--
剛才 `zipCode` 用了 `pattern` 搭配正規表達式，接下來花一點時間，把正規表達式的基本概念說清楚。
-->

---

# Validators.pattern 與正規表達式

`Validators.pattern()` 接受一個正規表達式（Regular Expression，簡稱 Regex），用於比對輸入值是否符合指定格式。

**正規表達式**是一種文字匹配規則，可定義字元類型、範圍與數量等條件。

<div class="flex justify-center">
  <img src="/images/52-validators/regex-syntax-diagram.png" class="rounded shadow-md max-h-80" />
</div>

<!--
`Validators.pattern()` 接收的是一個正規表達式，英文是 Regular Expression，簡稱 Regex。

正規表達式是一種描述文字規則的寫法，可以定義字元的類型、範圍和數量。可以把它想成一份格式範本，就像身分證字號有固定的規則：第一碼是英文字母，後面九碼是數字。

它不只能用在 Angular，任何需要檢查文字格式的地方都用得到，例如信箱、電話號碼、密碼強度，是很通用的技能。
-->

---

# Regex 常用語法

| 符號 | 說明 | 範例 |
| --- | --- | --- |
| `^` | 字串起始位置 | `^A` 表示以 A 開頭 |
| `$` | 字串結束位置 | `Z$` 表示以 Z 結尾 |
| `[A-Z]` | 大寫字母 A 到 Z 的任一字元 | `[A-Z]{3}` |
| `\d` | 任意數字（等同 `[0-9]`） | `\d{4}` |
| `{n}` | 恰好重複 n 次 | `\d{5}` |

**範例：驗證台灣郵遞區號（5 位數字）**

```typescript
Validators.pattern(/^\d{5}$/)
```

<!--
這張表列出幾個最常用的正規表達式符號。

`^` 代表字串的開頭，`$` 代表字串的結尾。`[A-Z]` 代表大寫 A 到 Z 之間的任一個字母，`\d` 代表任意一個數字，大括號 n 代表剛好重複 n 次。

以郵遞區號為例，斜線之間寫 `^\d{5}$`，合起來的意思是「從開頭到結尾，剛好是 5 個數字」。

如果忘了寫 `^` 和 `$`，就只會檢查字串裡有沒有出現符合的片段，而不是整個字串都要符合，這是新手最容易忽略的地方。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 驗證結果的讀取
## Reading Validation State

<!--
設定好驗證規則之後，還要知道怎麼讀取驗證的結果，才能決定要不要阻擋送出，或顯示錯誤訊息。
-->

---

# 讀取驗證狀態：.invalid

設定驗證器後，透過 `form.get('欄位名稱')?.invalid` 讀取該欄位是否驗證失敗。

| 回傳值 | 意義 |
| --- | --- |
| `false` | 欄位值符合所有驗證規則（有效） |
| `true` | 欄位值不符合至少一項驗證規則（無效） |

<!--
要讀取某個欄位的驗證狀態，就用 `form.get` 加上欄位名稱，再接 `?.invalid`。

它會回傳布林值：true 代表至少有一條規則不符合，false 代表全部都符合。

中間的問號加點，叫做安全導覽運算子。因為 `form.get` 有可能找不到欄位而回傳 null，加上問號可以避免程式在那種情況下報錯。接下來看兩個實際的例子。
-->

---

# 驗證狀態範例（一）

在 TypeScript 中，於送出前判斷欄位是否有效：

```typescript
// 送出表單
onSubmit() {
  if (this.form.get('surveyTitle')?.invalid) {
    console.log('標題的內容請符合限制');
    return;
  }
  // 繼續執行送出邏輯
}
```

<!--
第一個例子，是在 TypeScript 裡，送出前先檢查。

`onSubmit` 一開始判斷 `surveyTitle` 是不是 invalid，如果是，就印出提示並 `return`，後面的送出邏輯就不會執行。

就像過海關前的檢查，資料不符合規定就先攔下來。實際專案通常不只是印出 log，而是會在畫面上顯示提示，下一頁就示範這個。
-->

---

# 驗證狀態範例（二）

在 HTML 範本中，根據驗證狀態動態顯示錯誤提示：

```html
<input formControlName="surveyTitle" />
@if (form.get('surveyTitle')?.invalid &&
     form.get('surveyTitle')?.touched) {
  <p>標題為必填，且長度不得超過 5 個字元。</p>
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議：</b> 搭配 <code>touched</code> 屬性判斷，避免在使用者尚未輸入時即顯示錯誤訊息。
</div>

<!--
第二個例子，是在 HTML 裡依照驗證狀態顯示錯誤訊息。

用 `@if` 判斷欄位是不是 invalid。但這裡多加了一個條件：`touched`。

如果只判斷 invalid，使用者還沒點進欄位，畫面就會先出現一堆錯誤訊息，體驗很不好。加上 `touched`，代表使用者點過這個欄位又離開之後，而且欄位無效，才顯示錯誤。這是實務上很常見的做法。
-->

---

# 常用驗證狀態屬性

| 屬性 | 說明 |
| --- | --- |
| `.invalid` | 欄位值不符合驗證規則時為 `true` |
| `.valid` | 欄位值符合所有驗證規則時為 `true` |
| `.touched` | 使用者曾聚焦並離開該欄位時為 `true` |
| `.untouched` | 使用者尚未觸碰該欄位時為 `true` |
| `.dirty` | 使用者已變更欄位值時為 `true` |
| `.pristine` | 欄位值尚未被變更時為 `true` |
| `.errors` | 回傳所有驗證錯誤的物件（無錯誤時為 `null`） |

<!--
這張表整理了常用的驗證狀態屬性。

最常用的是 `invalid`、`valid` 和 `touched`。`touched` 和 `untouched` 判斷的是「有沒有點過」；`dirty` 和 `pristine` 判斷的是「有沒有改過值」，兩組概念不同，很容易搞混。

`errors` 比較特別，它會回傳一個物件，列出這個欄位違反了哪些規則，沒有錯誤時是 null。需要顯示更精確的錯誤訊息時，就會用到它。
-->

---
layout: default
---

# 練習：會員註冊表單
### 情境說明

會員註冊是最典型會用到多種驗證規則的表單：帳號要有長度限制、Email 要符合格式、年齡要在合理範圍、手機號碼要符合台灣格式、還要強制勾選會員條款才能送出。這一題要把這一章學到的 Validators 跟驗證狀態屬性全部串在一起練習一次。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**需求**
- 帳號、Email、年齡、手機、同意條款共 5 個欄位，各自套用對應的驗證規則
- 欄位未通過驗證且使用者已經點過（`touched`）時，顯示對應的錯誤訊息
- 表單整體無效時（`form.invalid`），送出按鈕要被停用

</div>
<div>

**限制**
- 帳號：必填 + 至少 3 個字元
- Email：必填 + Email 格式；年齡：必填 + 介於 18～99；手機：必填 + `pattern` 符合 `09` 開頭共 10 碼數字；同意條款：`requiredTrue`
- 錯誤訊息用 `@if` 搭配 `invalid && touched` 顯示，不能只判斷 `invalid`

</div>
</div>

<!--
我們來做一個練習：會員註冊表單，這是最典型會用到多種驗證規則的表單。

表單有五個欄位：帳號必填，至少 3 個字；Email 必填，並符合格式；年齡必填，介於 18 到 99；手機必填，用 `pattern` 限制 09 開頭共 10 碼數字；同意條款用 `requiredTrue`。

欄位沒有通過驗證，而且使用者點過時，要顯示錯誤訊息；整份表單無效時，送出按鈕要被停用。錯誤訊息要用 `invalid` 加上 `touched` 來判斷。

這題延續上一章 Reactive Forms 的寫法。
-->

---
layout: default
---

# 練習：任務說明

1. 建立 `RegisterFormComponent`，`imports` 陣列加入 `ReactiveFormsModule`
2. 用 `fb.group()` 定義 `form`，包含 `username`、`email`、`age`、`phone`、`agree` 五個欄位，各自套上情境說明限制裡指定的驗證器
3. HTML 用 `<form [formGroup]="form" (ngSubmit)="onSubmit()">` 包裹整個表單
4. 每個欄位下方用 `@if` 搭配 `invalid && touched` 顯示對應的錯誤訊息文字
5. 撰寫 `onSubmit()`：若 `form.invalid` 則印出提示並 `return`，否則印出 `form.value`
6. 送出按鈕用 `[disabled]="form.invalid"` 控制，表單無效時無法點擊

<!--
任務有六個步驟。

第一，建立 `RegisterFormComponent`，匯入 `ReactiveFormsModule`。第二，用 `fb.group()` 定義五個欄位，各自套上指定的驗證器。第三，用 `form` 標籤包住表單，加上中括號 `formGroup`，以及小括號 `ngSubmit` 綁定 `onSubmit`。第四，每個欄位下方用 `@if` 搭配 `invalid` 和 `touched` 顯示錯誤訊息。第五，`onSubmit` 裡如果表單無效就提示並返回，否則印出表單的值。第六，送出按鈕用中括號 `disabled` 綁定 `form.invalid`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示

1. `age` 的初始值要給 `null` 而不是空字串，數字欄位習慣上用 `null` 代表「尚未填寫」
2. 手機驗證用 `Validators.pattern(/^09\d{8}$/)`，代表以 `09` 開頭，後面接 8 碼數字，總長度剛好 10 碼
3. `agree` 用 `Validators.requiredTrue`，不是 `Validators.required`，因為它綁定的是 checkbox 的布林值，一定要是 `true` 才算通過
4. `[disabled]="form.invalid"` 直接綁在根 `form`，不需要个别檢查每個欄位
5. `(ngSubmit)="onSubmit()"` 綁在 `<form>` 標籤上，觸發時機是使用者按下送出按鈕或在欄位中按 Enter

<!--
我們來看解題提示。

第一，`age` 的初始值給 null，而不是空字串，數字欄位習慣用 null 代表尚未填寫。第二，手機的 `pattern` 寫成 `^09\d{8}$`，代表 09 開頭，後面接 8 碼數字。第三，`agree` 要用 `requiredTrue`，不是 `required`。因為 false 不算空值，用 `required` 的話，沒勾選也會通過。第四，`disabled` 直接綁定整個 `form` 的 invalid，不用逐一檢查欄位。第五，`ngSubmit` 綁在 `form` 標籤上，按下送出按鈕或在欄位裡按 Enter 都會觸發。
-->

---
layout: default
---

# 完整解答 — register-form.component.ts（一）

匯入模組與元件裝飾器：

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  fb = inject(FormBuilder);
  // form 定義見下一頁
}
```

<!--
我們看完整的解答，先看匯入。

`imports` 陣列的 `ReactiveFormsModule`，是使用 `formGroup` 和 `formControlName` 的前提。`fb` 用 `inject(FormBuilder)` 取得，下一頁定義表單。
-->

---
layout: default
---

# 完整解答 — register-form.component.ts（二）

`form` 定義與 `onSubmit()`：

```typescript
export class RegisterFormComponent {
  fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    age: [null as number | null, [Validators.required, Validators.min(18), Validators.max(99)]],
    phone: ['', [Validators.required, Validators.pattern(/^09\d{8}$/)]],
    agree: [false, Validators.requiredTrue],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      console.log('表單尚有欄位未通過驗證');
      return;
    }
    console.log('註冊成功', this.form.value);
  }
}
```

<!--
這頁是表單的定義和 `onSubmit`。

五個欄位各自疊加需要的驗證器：帳號必填加最少長度，Email 必填加格式，年齡必填加範圍，手機必填加 `pattern`，同意條款用 `requiredTrue`。`age` 的初始值寫成 null，並標註型別是數字或 null。

`onSubmit` 先檢查 `form.invalid`，通過才印出資料。雖然畫面上的按鈕已經被停用，TypeScript 這邊還是要再檢查一次，避免使用者用其他方式繞過，這是送出前的標準防線。
-->

---
zoom: 0.86
layout: default
---

# 完整解答 — register-form.component.html（一）

帳號、Email 欄位：

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div class="form-field">
    <label>帳號：</label>
    <input formControlName="username">
    <div class="field-error">
      @if (form.get('username')?.invalid && form.get('username')?.touched) {
        <p>帳號為必填，且至少 3 個字元。</p>
      }
    </div>
  </div>

  <div class="form-field">
    <label>Email：</label>
    <input formControlName="email">
    <div class="field-error">
      @if (form.get('email')?.invalid && form.get('email')?.touched) {
        <p>請輸入正確的 Email 格式。</p>
      }
    </div>
  </div>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 錯誤訊息外面多包一層 <code>.field-error</code>，並用 CSS 給它固定的最小高度，這樣訊息出現/消失時，下面的欄位才不會跟著跳動，樣式見最後一頁。
</div>

<!--
接著看 HTML，先看帳號和 Email。

每個欄位的錯誤訊息都是同樣的寫法：`@if` 判斷 invalid 而且 touched，兩個條件都成立才顯示。

注意每個欄位外面包了一層 `form-field`，錯誤訊息外面也包了一層 `field-error`。因為 `@if` 不成立時，錯誤訊息整個不存在，如果沒有一個固定的容器撐住高度，訊息一出現，下面的欄位就會被往下推，消失時又縮回去，版面會一直跳動。用一個永遠存在的容器，搭配 CSS 設定最小高度，就能避免這個問題。
-->

---
layout: default
---

# 完整解答 — register-form.component.html（二）

年齡、手機欄位：

```html
  <div class="form-field">
    <label>年齡：</label>
    <input type="number" formControlName="age">
    <div class="field-error">
      @if (form.get('age')?.invalid && form.get('age')?.touched) {
        <p>年齡需介於 18 到 99 之間。</p>
      }
    </div>
  </div>

  <div class="form-field">
    <label>手機：</label>
    <input formControlName="phone" placeholder="09xxxxxxxx">
    <div class="field-error">
      @if (form.get('phone')?.invalid && form.get('phone')?.touched) {
        <p>請輸入正確格式的手機號碼（09 開頭共 10 碼）。</p>
      }
    </div>
  </div>
```

<!--
接著是年齡和手機。

年齡的輸入框 `type` 設為 number，方便輸入數字，驗證的判斷方式一樣。手機用 `pattern` 驗證格式，錯誤訊息直接說明格式規則，09 開頭共 10 碼，比只寫「格式錯誤」更友善。

每個欄位一樣包在 `form-field` 和 `field-error` 裡，維持版面穩定。
-->

---
layout: default
---

# 完整解答 — register-form.component.html（三）

同意條款與送出按鈕：

```html
  <div class="form-field">
    <label>
      <input type="checkbox" formControlName="agree">
      我同意會員條款
    </label>
    <div class="field-error">
      @if (form.get('agree')?.invalid && form.get('agree')?.touched) {
        <p>請勾選同意會員條款。</p>
      }
    </div>
  </div>

  <button type="submit" [disabled]="form.invalid">送出註冊</button>
</form>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 任一欄位空白或格式錯誤時，點過該欄位應顯示對應錯誤訊息，且顯示/消失時下方欄位不會跳動；五個欄位都填寫正確且勾選同意條款後，送出按鈕才會從停用變成可點擊，點擊後 Console 應印出「註冊成功」與完整表單資料。
</div>

<!--
最後是同意條款和送出按鈕。

勾選框的錯誤訊息寫法相同。送出按鈕用中括號 `disabled` 綁定 `form.invalid`，只要有任何一個欄位不通過，按鈕就自動停用，不用自己組合五個欄位的狀態。

驗證的方式是：任一欄位空白或格式錯誤，點過之後會顯示錯誤訊息，而且下方欄位不會跳動；五個欄位都正確並勾選條款後，按鈕才能點擊，點擊後 Console 會印出註冊成功和表單資料。
-->

---
layout: default
---

# 完整解答 — register-form.component.scss

固定 `.field-error` 的最小高度，避免錯誤訊息造成版面跳動：

```scss
.form-field {
  margin-bottom: 12px;
}

.field-error {
  min-height: 1.25rem;
}

.field-error p {
  margin: 2px 0 0;
  color: #d32f2f;
  font-size: 0.85rem;
}
```

<!--
最後是 SCSS。

關鍵是 `.field-error` 這個容器，不管裡面的錯誤訊息有沒有顯示，它都一直存在，`min-height` 讓它至少保留一行文字的高度。訊息出現時只是把預留的空間填上文字，消失時空間還在，下面的欄位就不會跳動。

`.form-field` 則統一每個欄位之間的間距。這種「預留空間，只換內容」的做法，是處理版面跳動很常見的技巧。
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

# 補充練習 1：即時錯誤提示

在畫面上直接顯示欄位的驗證狀態：

1. 在 `formControlName="surveyTitle"` 輸入框的正下方，加入一行警告：

```html
<p style="color: red">⚠️ 問卷名稱為必填，且長度不能超過 5 個字！</p>
```

2. 用 `@if (form.get('surveyTitle')?.invalid)` 控制這行警告的顯示
3. 測試：輸入框為空、或字數超過 5 個字時，紅字警告是否自動出現

<!--
第一題補充練習，把驗證結果直接顯示在畫面上。

在問卷名稱輸入框下方加一行紅字，用 `@if` 判斷這個欄位是不是無效，無效才顯示。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：即時錯誤提示 — 參考答案

```typescript
form = this.fb.group({
  surveyTitle: ['', [Validators.required, Validators.maxLength(5)]],
});
```

```html
<input formControlName="surveyTitle">

@if (form.get('surveyTitle')?.invalid) {
  <p style="color: red">⚠️ 問卷名稱為必填，且長度不能超過 5 個字！</p>
}
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 一打開頁面欄位就是空的，警告會立刻出現；可改成 <code>invalid && touched</code>，等使用者碰過欄位後才提示
</div>

<!--
我們來看答案。

`form.get('surveyTitle')` 取得這個欄位，問號是避免取不到欄位時報錯，`invalid` 代表沒有通過驗證。必填沒填、或超過 5 個字，`invalid` 都會是 true，紅字就出現。

你會發現，一打開頁面警告就出現了，因為欄位一開始是空的。實務上會再加上 `touched` 判斷，等使用者點過這個欄位才顯示，體驗比較好。
-->

---
layout: default
---

# 補充練習 2：用正規表達式限制純數字

產品管理後台的「建議劑量（毫克）」欄位，只能輸入 1 到 4 位的純數字：

1. 在 `form` 中新增 `mgDosage: ['', Validators.pattern(/^\d{1,4}$/)]`
2. 理解 `^\d{1,4}$` 的意思：從頭到尾只能有 1 到 4 位數字
3. 送出按鈕綁定 `[disabled]="form.invalid"`
4. 測試：輸入 `100a` 或 `12345`，確認送出按鈕變灰

<!--
第二題補充練習，用正規表達式限制輸入格式。

`pattern` 驗證器接收一個正規表達式。`^` 代表開頭，`$` 代表結尾，`\d` 是數字，大括號 1 逗號 4 代表出現 1 到 4 次。合起來就是：從頭到尾只能有 1 到 4 位數字。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：用正規表達式限制純數字 — 參考答案

```typescript
form = this.fb.group({
  mgDosage: ['', Validators.pattern(/^\d{1,4}$/)],
});
```

```html
<form [formGroup]="form">
  <input formControlName="mgDosage" placeholder="建議劑量（毫克）">
  <button type="submit" [disabled]="form.invalid">送出</button>
</form>
```

| 輸入 | 結果 |
| --- | --- |
| `500` | ✅ 通過 |
| `100a` | ❌ 含有英文字母 |
| `12345` | ❌ 超過 4 位數 |

<!--
我們來看答案。

`mgDosage` 套上 `pattern` 驗證器，輸入內容不符合格式，整個表單就是 `invalid`，送出按鈕被停用。

注意，`pattern` 不負責「必填」：空字串不會被它判定為錯誤。如果這個欄位也必填，要再加上 `Validators.required`，寫成陣列。
-->

---
layout: end
---

# 課程結束

### 透過 Validators 設定驗證規則、搭配 .invalid 讀取狀態，確保表單資料完整且正確後再送出

<!--
這一章我們學了 Validators。驗證器寫在欄位陣列的第二個位置，多個規則用陣列包起來。常用的有 `required`、`requiredTrue`、`email`、`minLength`、`maxLength`、`min`、`max` 和 `pattern`，`pattern` 可以搭配正規表達式定義格式。讀取狀態用 `invalid`，搭配 `touched` 在適當的時機顯示錯誤訊息，並用 `form.invalid` 停用送出按鈕。

下一章，我們會學習響應式網頁設計 RWD。我們下一章見。
-->
