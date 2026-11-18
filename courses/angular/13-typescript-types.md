---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: TypeScript 數據類型
routeAlias: ch13
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
    數據類型
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓變數的用途一目了然」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們知道 TypeScript 最大的特色是型別。這一章，就來深入了解有哪些資料型別。

變數就像收納盒，TypeScript 要求在每個盒子貼上標籤，寫清楚要裝什麼，避免放錯東西。學完這一章，我們會認識常用的型別，知道什麼情況該用哪一種。
-->

---
layout: default
---

# Outline

- **數據類型概覽**
- **boolean（布林類型）**
- **number（數字類型）**
- **string（字符串類型）**
- **array（數組類型）**
- **tuple（元組類型）**
- **enum（枚舉類型）**
- **any（任意類型）**
- **null 和 undefined 類型**
- **Object（物件）**

<!--
這一章會先看所有型別的總覽，接著從最基本的布林、數字、字串開始，再看陣列。然後介紹 TypeScript 特有的 tuple 和 enum。最後是幾個比較特殊的型別：any、null 和 undefined，以及最常用來存放資料的物件。
-->

---
zoom: 0.84
---

# 數據類型概覽

TypeScript 為了讓編寫代碼更規範並且更方便維護，增加了類型的效驗。以下是 TypeScript 所擁有的類型：

| 類型 | 說明 |
| --- | --- |
| `boolean` | 布林類型，值只能是 `true` 或 `false` |
| `number` | 數字類型，包含整數與浮點數 |
| `string` | 字符串類型，文本資料 |
| `array` | 數組類型，同類型元素的集合 |
| `tuple` | 元組類型，固定長度與類型的數組（TypeScript 特有） |
| `enum` | 枚舉類型，一組具名常數（TypeScript 特有） |
| `any` | 任意類型，可存放任何類型的值 |
| `null / undefined` | 空值類型 |
| `Object` | 物件，以鍵值對形式存放資料 |

<!--
這張表列出了 TypeScript 常用的型別，我們先看個大概。

TypeScript 為了讓程式更規範、更好維護，加入了型別檢查。宣告變數時，在名稱後面加上冒號和型別，TypeScript 就會幫我們檢查放進去的值對不對。

表格裡的 tuple 和 enum 是 TypeScript 特有的，其他在 JavaScript 裡也都有對應的概念。接下來我們一個一個看。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 基本類型
# Basic Types

<!--
我們先從最基本、每天都會用到的型別開始。
-->

---

# boolean（布林類型）

布林類型就是 `true` 跟 `false`，這個變數只能是 `true` 或 `false`，輸入其他的都會錯誤。

```typescript
booleanType: boolean = true;
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 布林類型常用於條件判斷，例如 <code>if (isLoggedIn)</code>、<code>isLoading: boolean = false</code>
</div>

<!--
第一個是 `boolean`，布林型別。

它的值只有兩種可能：`true` 或 `false`，也就是真或假。就像電燈開關，不是開就是關，沒有中間值。

布林最常用在條件判斷，例如用 `isLoading` 表示現在是不是正在載入，或用 `isLoggedIn` 表示使用者有沒有登入。

如果把數字或文字放進布林型別的變數，TypeScript 就會立刻報錯。
-->

---

# number（數字類型）

跟 JavaScript 一樣，所有的數字都是浮點數。

```typescript
numberType: number = 3;
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 TypeScript 的 <code>number</code> 不區分整數與小數，<code>3</code> 與 <code>3.14</code> 都是合法的 <code>number</code>
</div>

<!--
第二個是 `number`，數字型別。

跟 JavaScript 一樣，TypeScript 的數字不區分整數和小數，不管是 3 還是 3.14，都是 `number`。

寫法很單純，冒號後面寫 `number`，再給一個數字當初始值就好。
-->

---

# string（字符串類型）

就是文本數據類型，需要在文字外層加上 `"` 或者 `'` 將其包裹，來讓系統知道這個是字符串。

```typescript
stringType: string = "字符串";
stringType2: string = '字符串';
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 雙引號與單引號效果相同；實務上也常使用模板字串（Template Literal）：<code>`Hello, ${name}!`</code>
</div>

<!--
第三個是 `string`，字串型別，用來存放文字資料。

不管是中文、英文還是符號，只要是文字，都用 `string`。寫的時候要用雙引號或單引號把文字包起來，兩種效果一樣。這樣系統才知道它是一段文字，而不是一個變數名稱。

實務上也常用反引號寫「模板字串」，可以直接在字串裡放入變數，組合文字時很方便。
-->

---

# array（數組類型）

就是大家口中的陣列，有兩種定義方式。請注意：數組宣告的類型確定後，新增的資料必須是一樣的類型，否則會錯誤（宣告 string 類型，資料需要都為 string）。

```typescript
arrayType: string[] = ['a', 'b', 'c'];
arrayType2: Array<string> = ['a', 'b', 'c'];
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 兩種寫法功能相同：<code>string[]</code> 是簡寫語法；<code>Array&lt;string&gt;</code> 是泛型語法
</div>

<!--
第四個是 `array`，陣列，用來存放一整串同類型的資料，就像一列火車的車廂。

宣告陣列有兩種寫法。最常見的是在型別後面加上中括號，例如 `string[]`，代表「每一個元素都是字串的陣列」。另一種是 `Array` 加上角括號，這叫泛型寫法，兩種功能完全一樣。

要注意，陣列的型別一旦確定，裡面的資料就必須都是同一種型別。宣告為字串陣列，卻放了一個數字進去，TypeScript 就會報錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# TypeScript 特有類型
# TypeScript-only Types

<!--
接下來，我們看兩個 JavaScript 沒有、只有 TypeScript 才有的型別。
-->

---

# tuple（元組類型）

元組類型就是當你確定數組中每個位置的資料型態（須按照順序），你就可以直接定義。數組資料中並不需要為一樣的類型（下圖為 string 跟 number）。

```typescript
tupleType: [string, number] = ['a', 1];
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 tuple 與 array 的差異：array 所有元素類型相同；tuple 每個位置可有不同類型，且長度固定
</div>

<!--
第一個是 `tuple`，中文叫元組。

它是一種「長度和順序都固定」的陣列，而且每個位置的型別可以不一樣。例如 `[string, number]`，代表這個陣列只能有兩個元素，第一個一定是字串，第二個一定是數字。

可以把它想成情侶座，只有兩個位子，而且誰坐哪邊是固定的。

跟一般陣列比較：陣列裡所有元素型別相同、長度不限；tuple 每個位置可以是不同型別，但長度固定。
-->

---

# enum（枚舉類型）

枚舉類型又稱為列舉類型，當你需要設定一組固定的判斷值時可以使用它。  
例如：狀態有「成功」或「失敗」，成功為 1、失敗為 0。

```typescript
enum requestStatusCodes {
  error = 0,
  success = 1,
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 使用 enum 可以避免在程式中直接判斷 0 或 1 這種意義不明的數字，讓程式碼更易讀
</div>

<!--
第二個是 `enum`，叫做列舉，或枚舉。當我們需要一組固定的判斷值時，就可以用它。

想像訂單狀態在資料庫裡用數字表示，0 代表失敗，1 代表成功。如果程式裡直接寫「狀態等於 1」，過一陣子再看，很難記得 1 到底代表什麼。這種意義不明的數字，常被叫做「魔術數字」。

`enum` 可以幫這些數字取上有意義的名字。這裡我們定義了 `requestStatusCodes`，`error` 對應 0，`success` 對應 1。之後在程式裡，就可以直接用名稱來判斷。
-->

---

# enum（枚舉類型）— 使用範例

宣告 enum 後，在程式中透過名稱來進行判斷：

```typescript
// 判斷成功
if (statusType == requestStatusCodes.success) {
  // 成功時的處理...
}

// 判斷失敗
else if (statusType == requestStatusCodes.error) {
  // 失敗時的處理...
}
```

<!--
我們看看 `enum` 實際怎麼使用。

在 `if` 判斷裡，寫 `statusType` 等於 `requestStatusCodes.success`。讀起來就像一句話：「如果狀態等於成功」，比直接寫數字 1 清楚得多。

程式執行時，`requestStatusCodes.success` 的值就是 1，效果完全一樣，但程式碼的可讀性高了很多。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 特殊類型
# Special Types

<!--
最後，我們來看幾個比較特殊的型別，使用時需要特別注意。
-->

---

# any（任意類型）

當你不確定欄位是什麼類型的時候，可以使用 `any` 類型。宣告為 `any` 之後，資料類型可以多次被改變。

```typescript
anyType: any = '12';
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b>雖然 <code>any</code> 很方便，但會失去 TypeScript 類型檢查的保護，實務上應盡量避免濫用
</div>

<!--
第一個是 `any`，任意型別。

宣告成 `any` 之後，變數可以放任何型別的值，而且之後還能隨意改變型別。遇到不確定型別的情況時，它看起來很方便。

但實務上要盡量避免濫用。用了 `any`，TypeScript 就不會再幫我們檢查這個變數，等於放棄了型別保護。如果每個變數都用 `any`，那就跟寫 JavaScript 沒什麼兩樣，也失去了使用 TypeScript 的意義。
-->

---

# null 和 undefined 類型

`null` 跟 `undefined` 就是所謂的空值。由於 Angular 新版本規定宣告的變數需要設定初始值，所以也沒辦法直接設定 `null` 或者 `undefined`。

現在你只能宣告這個變數的類型**包含** `null` 或是 `undefined`，表示這個變數可能是 number 或者 null 或者 undefined：

```typescript
nullType: number | null | undefined;
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 使用 <code>|</code> 符號可以宣告「聯合類型（Union Type）」，代表變數可接受多種類型
</div>

<!--
第二個是 `null` 和 `undefined`，也就是空值。

在新版的 Angular 專案裡，預設會開啟嚴格模式，宣告變數時需要給初始值，不能隨意讓它是空的。

那如果一個變數確實可能是空的，該怎麼辦？我們可以用直線符號，它代表「或」。例如 `number | null | undefined`，意思是這個變數可以是數字，也可以是 null 或 undefined。

這種寫法叫做「聯合型別」。在處理非必填的資料，或是 API 資料還沒回來的時候，很常用到。
-->

---

# Object（物件）

當你資料的最外框為 `{}` 時，我們就會稱它叫做物件。  
裡面存放「鍵值對」，鍵（Key）**不需要**加引號，後面接冒號再放對應的值。

```typescript
const user = {
  id: 101,
  username: 'Allen',
  age: 18
};
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 TypeScript 物件的鍵不加引號；若鍵有加雙引號（如 <code>"id"</code>），那是 <b>JSON 格式</b>——前後端傳輸資料時才會看到，兩者語法不同
</div>

<!--
最後是 `Object`，物件。

當資料的最外層用大括號包起來，它就是一個物件。物件裡面用「鍵值對」的方式存放資料，左邊是鍵，冒號後面是對應的值。這個範例就像一份會員資料：id 是 101，username 是 Allen，age 是 18。

這裡有一個容易混淆的地方：在 TypeScript 裡，物件的鍵不用加引號；但前後端傳輸資料用的 JSON 格式，鍵要加上雙引號。兩者看起來很像，但語法不同。

實務上，大部分的資料都會包裝成物件，搞懂物件，之後處理 API 資料就會輕鬆很多。
-->

---
layout: default
---

# 練習：任務說明
### 宣告各種型別的變數

在 Angular 專案的 `app.component.ts` 的 `AppComponent` class 中，依正確型別宣告以下五個全域變數：

1. `isLoggedIn`：布林值，初始為 `false`
2. `userId`：數字，初始為 `1001`
3. `userName`：字串，初始為你的名字
4. `userTags`：字串陣列，包含至少三個標籤（例如 `'Angular'`、`'TypeScript'` 等）
5. `loginScore`：可以是數字或 null，初始為 `null`

完成後，試著把 `isLoggedIn` 的值改為數字 `1`，觀察 TypeScript 報什麼錯誤，再改回 `true`。

<!--
我們來做一個練習，把這一章的型別都用上。

請在 `AppComponent` 裡宣告五個變數：布林型別的 `isLoggedIn`，數字型別的 `userId`，字串型別的 `userName`，至少有三個標籤的字串陣列 `userTags`，以及可以是數字或 null 的 `loginScore`。

完成之後，試著把 `isLoggedIn` 改成數字 1，看看 TypeScript 會出現什麼錯誤，再改回 `true`。

想一想，`loginScore` 要用哪一種寫法，才能同時接受數字和 null？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示
### 完成步驟

在 `app.component.ts` 中宣告五個變數：

```typescript
export class AppComponent {
  isLoggedIn: boolean = false;
  userId: number = 1001;
  userName: string = '你的名字';
  userTags: string[] = ['Angular', 'TypeScript', '前端'];
  loginScore: number | null = null;
}
```

嘗試把 `isLoggedIn = 1` 時，TypeScript 報錯：

```
Type 'number' is not assignable to type 'boolean'
```

改回 `isLoggedIn = true` 後，錯誤消失。這就是型別系統的最佳示範——在你寫錯的瞬間就告知你，而不是等程式跑起來才炸。

<!--
我們來看答案。

五個變數分別用了 `boolean`、`number`、`string`、`string[]`，以及聯合型別。回答剛才的問題，`loginScore` 寫成 `number | null`，代表它可以是數字，也可以是 null，這在之後串接 API 時很常見。

把 `isLoggedIn` 改成 1，TypeScript 會出現「數字型別不能指定給布林型別」的錯誤，改回 `true` 就消失了。這就是型別系統的好處，在寫錯的當下就告訴我們，而不是等程式跑起來才出問題。
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

# 補充練習 1：學生成績陣列

請建立一個用來儲存班級學生成績的陣列：

1. 使用**數字陣列**（`number[]`）的語法宣告
2. 陣列中放入 5 個學生的分數

**思考題：** 如果不小心把字串 `'一百分'` 塞進這個陣列，編輯器會發生什麼事？

<!--
第一題補充練習，請用 `number[]` 宣告一個成績陣列，放入五個學生的分數。

宣告好之後，試著把一個字串塞進去，看看編輯器會怎麼反應。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：學生成績陣列 — 參考答案

```typescript
scores: number[] = [85, 92, 78, 60, 99];
```

```typescript
scores: number[] = [85, 92, 78, 60, '一百分'];
// ❌ Type 'string' is not assignable to type 'number'.
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 宣告成 <code>number[]</code> 之後，陣列裡每一個元素都必須是數字，TypeScript 會在存檔前就幫你抓出型別錯誤
</div>

<!--
我們來看答案。

型別寫 `number` 加上中括號，就代表這是一個只能放數字的陣列。

如果塞進字串，編輯器馬上出現紅線，訊息是字串型別不能指派給數字型別。這就是 TypeScript 的好處：錯誤在寫程式的當下就被抓出來，不用等到執行時才發現。
-->

---
layout: default
---

# 補充練習 2：使用者座標元組（Tuple）

開發地圖功能時，常需要記錄使用者的「名字」與「經緯度座標」：

1. 宣告一個名為 `userLocation` 的元組（Tuple）
2. 內部依序只能放入：使用者名字（字串）、經度（數字）、緯度（數字）
3. 正確賦值，並用 `console.log()` 印出來

<!--
第二題補充練習，我們用元組來記錄使用者的位置。

元組跟陣列很像，但它規定了每一個位置要放什麼型別。這題要求第一個是名字字串，第二個是經度數字，第三個是緯度數字。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：使用者座標元組 — 參考答案

```typescript
userLocation: [string, number, number] = ['Allen', 120.3014, 22.6273];

ngOnInit() {
  console.log(this.userLocation);
}
```

```typescript
userLocation: [string, number, number] = [120.3014, 'Allen', 22.6273];
// ❌ 順序錯誤，TypeScript 會報錯
```

<!--
我們來看答案。

元組的型別寫法，是在中括號裡依序寫出每個位置的型別：字串、數字、數字。賦值時，順序也必須完全一樣。

如果把名字和經度的位置對調，TypeScript 就會報錯。這就是元組和一般陣列最大的不同：元組連「順序」和「數量」都有規定。
-->

---
layout: end
---

# 數據類型完成
### 掌握類型，讓程式碼更安全！

<!--
這一章我們認識了 TypeScript 的資料型別。基本型別有 `boolean`、`number`、`string` 和陣列；TypeScript 特有的有固定長度和順序的 `tuple`，以及幫數字取名字的 `enum`。另外，`any` 要盡量避免濫用，可能是空值的變數可以用聯合型別，而物件是最常用來存放資料的格式。

型別看起來像是限制，其實是一層保護。

下一章，我們會學習怎麼用變數來存放和使用這些資料。我們下一章見。
-->
