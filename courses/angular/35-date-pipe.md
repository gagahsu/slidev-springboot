---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: DatePipe
routeAlias: ch35
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
    DatePipe
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「善用 Angular DatePipe，輕鬆將日期格式轉換為可讀性高的字串」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們讓使用者選擇日期。這一章要看選好的日期，怎麼轉換成好看的文字。

直接顯示 Date 物件，格式會又長又難讀，跟我們習慣的「2025/11/01」差很多。學完這一章，我們會知道自己寫轉換邏輯，以及用內建的 DatePipe 一行完成，這兩種做法。
-->

---
layout: default
---

# Outline

- **DatePipe 是什麼** — 為什麼需要日期格式轉換
- **日期資料轉換（手動）** — 用 TypeScript 方法提取年／月／日
- **日期資料轉換（DatePipe）** — 匯入 CommonModule 並套用管道語法

<!--
這一章分成三段。先說明為什麼需要日期格式轉換。接著用最基本的方式，自己寫程式把年月日取出來再組合，體會手動處理的麻煩。最後介紹 Angular 內建的 DatePipe，看看用內建工具能省下多少力氣。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# DatePipe 是什麼？
# What is DatePipe?

<!--
如果直接把 Date 物件綁定到畫面上，會發生什麼事？畫面會顯示很原始、不好讀的格式。這就是接下來要解決的問題。
-->

---

# DatePipe 是什麼？

直接將 `Date` 物件綁定到範本時，Angular 會呈現原始格式（例如 `Sun Nov 01 2025...`），與實際需要的顯示格式（如 `2025/01/13`）不同，因此需要進行資料轉換。

`DatePipe` 是 Angular 內建管道，能以簡短的模板語法將日期格式化為指定字串，無需手動撰寫轉換邏輯。

<div class="flex justify-center">
  <img src="/images/35-date-pipe/angular-datepipe-banner.png" class="rounded shadow-md max-h-80" />
</div>

<!--
直接把 Date 物件顯示在畫面上，會出現像 Sun Nov 01 2025 這樣的原始格式，跟我們需要的 2025/01/13 這種格式不同，所以需要轉換。

我們可以把 Date 物件想成相機拍出來的原始檔，資訊很完整，但要經過後製才適合給人看。日期格式化，就是這個後製的動作。

DatePipe 是 Angular 內建的管道，只要在模板裡加上一小段語法，就能把日期轉成指定的格式。不過在介紹它之前，我們先看看自己手動轉換要花多少功夫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 日期資料轉換
# Date Formatting

<!--
這一段我們先不用 DatePipe，而是自己動手寫出日期轉換的邏輯，體驗一下其中的細節。
-->

---

# 日期資料轉換
### 方法一：用 TypeScript 手動轉換

當變數為 `Date` 型別時，可透過日期方法提取年、月、日，再組合成目標格式：

```typescript
today = new Date();

ngOnInit(): void {
  // 輸出範例：Thu Feb 12 2026 14:59:56 GMT+0800 (台北標準時間)
  console.log(this.today);
}
```

<!--
第一種方法，是用 TypeScript 手動轉換。

這裡用 `new Date()` 建立一個代表現在時間的物件，存在 `today` 變數裡。在 `ngOnInit` 把它印出來，會看到瀏覽器預設的格式，包含星期和時區，對一般使用者來說不好閱讀。
-->

---

# 日期資料轉換
### 提取年、月、日

若目標格式為 `yyyy/MM/dd`，需分別提取年、月、日：

```typescript
tidyDate(date: Date) {
  // 提取年
  console.log(date.getFullYear());
  // 提取月（從 0 起算，需 +1）
  console.log(date.getMonth());
  // 提取日
  console.log(date.getDate());
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>getMonth()</code> 回傳值從 0 開始，1 月為 0、12 月為 11，使用時需加 1。
</div>

<!--
如果想組出 `yyyy/MM/dd` 這種格式，第一步是把年、月、日分別取出來，用的是 `getFullYear`、`getMonth` 和 `getDate` 這三個方法。

這裡要特別注意，`getMonth` 回傳的月份是從 0 開始，1 月是 0，12 月是 11。之前在 TypeScript 練習時也提過，忘記加 1 的話，畫面上的月份就會少一個月。
-->

---

# 日期資料轉換
### 組合日期字串（一）— 方法定義

```typescript
// 接收一個 Date 值，回傳格式化後的 string
tidyDate(date: Date): string {
  let newDate = '';

  // 加入年份與分隔符
  newDate = newDate + date.getFullYear() + '/';

  // 月份補零（月份從 0 起算，需 +1）
  if ((date.getMonth() + 1) < 10) {
    newDate = newDate + 0 + (date.getMonth() + 1) + '/';
  } else {
    newDate = newDate + (date.getMonth() + 1) + '/';
  }
```

<!--
接著把取出來的值組合成字串。這是 `tidyDate` 方法的前半段，它接收一個 Date，回傳格式化後的字串。

先建立一個空字串 `newDate`，接上年份和斜線。處理月份時，先加 1，再判斷是不是小於 10，小於 10 就在前面補一個 0，否則直接接上去，最後再加一個斜線。

這段程式還沒寫完，下一頁繼續處理日期和回傳的部分。
-->

---

# 日期資料轉換
### 組合日期字串（二）— 日期補零與回傳

```typescript
  // 日期補零
  if (date.getDate() < 10) {
    newDate = newDate + 0 + date.getDate();
  } else {
    newDate = newDate + date.getDate();
  }

  // 回傳組合好的日期字串
  return newDate;
}
```

月份與日期若為個位數則補 `0`，確保格式固定為兩位數。

<!--
延續上一頁，日期也用同樣的方式判斷，小於 10 就補 0。最後把組合好的字串 `return` 出去，`tidyDate` 方法就完成了。

補零是為了讓月份和日期都固定是兩位數，格式才會整齊。

可以感受一下，光是轉成一種格式，就寫了將近 20 行，還要處理兩次補零。如果要換另一種格式，這段程式可能又要改寫。
-->

---
layout: two-cols
---

# 日期資料轉換
### 在 HTML 與 TS 中使用 tidyDate

完成方法後，可在 HTML 範本或 TS 中呼叫：

**在 TS 中呼叫：**

```typescript
ngOnInit(): void {
  console.log(this.tidyDate(this.today));
}
```

**在 HTML 中呼叫：**

```html
{{ tidyDate(today) }}
```

::right::

<div class="flex flex-col items-center justify-center h-full gap-4">
  <p class="text-gray-500 text-sm">輸出結果</p>
  <div class="px-6 py-3 bg-teal-50 border border-teal-300 rounded-lg text-2xl font-mono text-teal-700">
    2026/02/12
  </div>
</div>

<!--
方法寫好之後，就可以在 TypeScript 或 HTML 裡呼叫。

在 TypeScript 裡，用 `this.tidyDate` 傳入 `today`；在 HTML 裡，直接在雙大括號裡呼叫方法就可以了。執行結果就像右邊，日期被轉換成 2026/02/12 這樣的格式。

這種寫法可以用，但每換一種格式，就要修改方法的內容，不夠有彈性。接下來看 Angular 內建的做法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 使用 DatePipe
# Using DatePipe

<!--
剛才我們寫了將近 20 行程式才把日期格式轉好。現在來看 Angular 內建的 DatePipe 能怎麼幫我們。
-->

---

# 使用 DatePipe
### 方法二：Angular 內建管道

若只需在 HTML 中顯示格式化日期，不須另外撰寫轉換方法，可直接使用 Angular 的 `DatePipe`。

**步驟：**

1. 在元件的 `imports` 中加入 `CommonModule`
2. 在範本中使用內嵌繫結顯示日期變數
3. 在變數名稱後加上 `| date: '格式字串'`

<!--
第二種方法是使用 Angular 內建的管道。如果只是要在 HTML 顯示格式化的日期，就不需要自己寫轉換方法。

步驟只有三個。第一，在元件的 `imports` 加入 `CommonModule`。第二，在模板裡用雙大括號顯示日期變數。第三，在變數後面加上直線符號、`date`、冒號和格式字串。
-->

---

# 使用 DatePipe
### 匯入 CommonModule

```typescript
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-...',
  imports: [
    CommonModule
  ],
})
```

<!--
第一步，從 `@angular/common` 引入 `CommonModule`，加進元件的 `imports` 陣列。

DatePipe 就包含在 `CommonModule` 裡，所以只要匯入 `CommonModule` 就可以使用。如果只想用 DatePipe，也可以直接匯入 `DatePipe` 本身。
-->

---

# 使用 DatePipe
### 範本語法與輸出結果

```html
{{ today | date: 'yyyy-MM-dd' }}
```

輸出結果：`2026-02-12`

| 格式字串 | 輸出範例 |
|---|---|
| `'yyyy/MM/dd'` | `2026/02/12` |
| `'yyyy-MM-dd'` | `2026-02-12` |
| `'MM/dd/yyyy'` | `02/12/2026` |
| `'fullDate'` | `Thursday, February 12, 2026` |
| `'shortDate'` | `2/12/26` |

<!--
我們看最核心的語法。在雙大括號裡寫 `today`，接著一個直線符號，再寫 `date`，冒號後面是格式字串 `yyyy-MM-dd`。

中間的直線符號就是「管道」，意思是把 `today` 送進 `date` 這個管道加工，再輸出結果。結果是 2026-02-12，跟剛才手動寫了 20 行的效果一樣，但只用了一行。

下面的表格列了幾種常用的格式字串。改變格式只要換掉字串就好，例如 `fullDate` 會顯示完整的英文星期和月份，`shortDate` 則是最精簡的格式。
-->

---
layout: end
---

# 課程結束
### 善用 Angular DatePipe，以簡潔的管道語法取代手動日期格式轉換

<!--
這一章我們比較了兩種日期格式化的方式。手動用 `getFullYear`、`getMonth`、`getDate` 組合字串，可以完全掌控，但程式碼長，又容易漏掉補零或月份加 1。用 DatePipe，只要匯入 `CommonModule`，在模板裡加上直線符號 `date` 和格式字串，一行就完成。

要在畫面上顯示日期時，優先使用 DatePipe；只有格式真的很特殊時，才考慮自己寫轉換邏輯。

下一章，我們會學習另一個內建管道 JsonPipe。我們下一章見。
-->
