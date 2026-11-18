---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 變數使用
routeAlias: ch14
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
    變數使用
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓資料從 TypeScript 流向畫面」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們認識了 TypeScript 的各種資料型別。但光知道型別還不夠，我們還要把資料存起來，並且在需要的時候顯示到畫面上。

這一章，我們會學習怎麼宣告變數，了解全域變數和區域變數的差別，並且用 Angular 的資料綁定，把 TypeScript 裡的資料顯示在網頁上。
-->

---
layout: default
---

# Outline

- **TypeScript 宣告語法**
- **全域變數**
- **區域變數**
- **let / const / var 比較**
- **let VS var**
- **Angular 中宣告變數**
- **畫面呈現（Data Binding）**
- **實作練習**

<!--
這一章的路線是這樣的。先對照兩種宣告變數的寫法，以及業界的慣例。接著看變數的作用範圍，也就是全域和區域變數，再釐清 `let`、`const` 和 `var` 的差別。然後進入 Angular，看怎麼宣告要給畫面使用的變數，以及如何處理沒有初始值的情況。最後學習資料綁定，並用一個練習收尾。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# TypeScript 宣告語法
# Declaration Syntax

<!--
在開始之前，我們先對照一下上一章的型別寫法，和接下來範例常見的省略寫法，之後看範例才不會困惑。
-->

---

# TypeScript 宣告語法 — 兩種等價寫法

ch13 學過的**顯式標註**與本章的**型別推斷**完全等價，兩者型別保護效果相同：

```typescript
// 顯式標註：明確寫出型別（ch13 寫法）
title: string = 'Hello Angular';
count: number = 0;
isLoading: boolean = false;

// 型別推斷：有初始值時省略型別，TypeScript 自動推斷
title = 'Hello Angular';  // 推斷為 string
count = 0;                 // 推斷為 number
isLoading = false;         // 推斷為 boolean
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 省略型別標註不等於「沒有型別保護」——TypeScript 仍然知道 <code>title</code> 是 <code>string</code>，賦值 <code>title = 123</code> 一樣報錯
</div>

<!--
這兩種寫法的效果完全一樣。

上半部是上一章學過的「顯式標註」，在變數名稱後面明確寫出型別。下半部省略了型別，只寫變數和初始值。

為什麼可以省略？因為有初始值的時候，TypeScript 可以從值本身推斷出型別，這叫做「型別推斷」。例如 `title` 的值是一段文字，TypeScript 就知道它是 `string`。

要注意，省略型別不代表沒有保護。如果之後把數字指定給 `title`，TypeScript 一樣會報錯。
-->

---

# TypeScript 宣告語法 — 業界慣例

| 情境 | 建議寫法 | 原因 |
| --- | --- | --- |
| 有初始值、型別明顯 | `title = 'demo'` | 型別一眼可見，標註是冗餘 |
| 有初始值、型別不明顯 | `users: User[] = []` | 空陣列看不出裝什麼 |
| 無初始值 | `data!: ApiResponse` | 沒有值就沒有推斷依據，必須標註 |
| 函式參數 | `(name: string)` | 參數一律明確標註，不省略 |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 本課程之後的範例，有初始值的簡單型別皆採用<b>型別推斷（省略）</b>，這是 Angular 專案最常見的寫法
</div>

<!--
那什麼時候要寫型別，什麼時候可以省略？業界的原則是：「型別從值一眼看得出來，就省略；看不出來，就寫上」。

看表格。有初始值而且型別明顯，例如一段文字，就可以省略。空陣列看不出來要裝什麼，就要寫清楚型別。沒有初始值的話，TypeScript 沒有推斷的依據，一定要寫。函式的參數則一律明確標註。

這門課之後的範例，有初始值的簡單型別都會省略標註，這也是 Angular 專案最常見的寫法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 變數的種類
# Variable Scope

<!--
接下來，我們來看變數的作用範圍，也就是變數在哪裡可以被使用，這叫做「作用域」。
-->

---

# 全域變數

當你需要一個值，要讓整個 TS 都可以使用到，並且值不會消失，那你就需要宣告一個**全域變數**。

在方法中需要取得這個變數的值時，必須使用 `this.` 去呼叫它。

```typescript
export class AppComponent {
  title = 'demo2';

  showTitle() {
    alert(this.title);
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 全域變數宣告在 class 的最上層，方法內透過 <code>this.變數名稱</code> 存取
</div>

<!--
第一種是全域變數。

當我們需要一個值，讓整個元件都能使用，而且值會一直存在，就宣告全域變數。它寫在 class 的最上層，就像一本長期使用的存摺，在元件存在的期間都可以讀取。

在 Angular 的 class 裡，有一個重要的規則：在方法裡使用全域變數時，前面一定要加上 `this.`。這裡的 `this` 可以理解成「這個元件自己的」，所以 `this.title` 就是「這個元件的 title」。

如果忘了加 `this.`，TypeScript 會找不到這個變數，直接報錯。
-->

---

# 區域變數

當你需要一個值**只在某個方法中使用**，並且使用完之後不需要繼續存在記憶體中，那你就可以宣告一個**區域變數**。

方法執行結束後，這個變數就會消失，無法在這個 TS 的其他地方呼叫它。

```typescript
showTitle() {
  let title = "demo2";
  alert(title);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 區域變數的生命週期只在方法執行期間；全域變數則在 class 實例存活期間都可使用
</div>

<!--
第二種是區域變數。

如果一個值只在某個方法裡用到，用完就不需要了，就宣告區域變數。它寫在方法的大括號裡面，方法執行結束後，這個變數就會消失，其他方法也沒辦法使用它。

如果全域變數是長期存摺，區域變數就像一次性的餐具，用完就回收。

看程式碼，我們在 `showTitle` 裡用 `let` 宣告 `title`，它只能在這對大括號裡使用，而且不需要加 `this.`。
-->

---

# 區域變數 — let / const / var

宣告區域變數時會遇到一個問題：我該使用 `let`、`var` 還是 `const`？

| 關鍵字 | 說明 | 建議使用時機 |
| --- | --- | --- |
| `const` | 識別值（identifier），宣告後**不能**重新指定值 | 不會改變的固定值 |
| `let` | 變數（variable），可以被重新指定值 | 一般變數，**最常用** |
| `var` | 最弱的宣告方式，有 hoisting 問題 | **不建議使用** |

<!--
宣告區域變數時，有三個關鍵字可以選：`const`、`let` 和 `var`。

`const` 宣告之後就不能再重新指定值，適合用在不會改變的固定值。`let` 宣告的變數可以重新指定值，是最常用的寫法。`var` 是 JavaScript 早期的寫法，有一些容易造成錯誤的行為。

實務上的建議很簡單：不會改變的值用 `const`，會改變的值用 `let`，不要使用 `var`。
-->

---

# let VS var — 為什麼不用 var？

`let` 和 `var` 功能類似，但 `var` 不夠嚴謹：**`var` 可以在宣告前就使用（hoisting）**，導致對值的理解很容易出錯。

```typescript
// ❌ var 的危險：宣告在使用之後，系統不會報錯
showTitle() {
  title = "demo";     // 先使用
  alert(title);
  var title: string;  // 再宣告（var hoisting）
}
```

```typescript
// ✅ let 的正確習慣：必須先宣告才能使用
showTitle() {
  let title = "demo2";
  alert(title);
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>Hoisting（提升）</b>是什麼？JavaScript 引擎在實際執行程式碼之前，會先掃描一遍，把所有 <code>var</code> 宣告「搬到」函式的最頂端。所以不管 <code>var title</code> 寫在第幾行，宣告都已經在執行前被提升了——導致在賦值前使用不會報錯，只會得到 <code>undefined</code>。<code>let</code> 沒有這個行為，宣告前使用會直接拋出 <code>ReferenceError</code>。
</div>

<!--
為什麼不要用 `var`？我們看這個例子。

上面那段程式，先替 `title` 指定值、顯示出來，最後一行才用 `var` 宣告。照理說，還沒宣告就使用應該要報錯，但用 `var` 的話，系統不會報錯。

原因是「提升」，英文叫 hoisting。JavaScript 在執行之前，會先把所有 `var` 的宣告搬到函式的最上面，所以不管寫在第幾行，宣告都已經先發生了。這種行為很不直覺，程式一大就容易出現奇怪的錯誤。

下面用 `let` 的寫法就嚴謹得多，一定要先宣告才能使用，順序錯了會直接報錯。所以宣告變數，一律用 `let` 或 `const`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Angular 中宣告變數
# Declaring Variables in Angular

<!--
了解變數之後，我們來看在 Angular 專案裡，怎麼宣告要顯示在畫面上的變數。
-->

---

# 宣告變數（一）

當畫面需要顯示一個**會根據使用者操作而改變的值**，你需要先在該 HTML 的 TS 檔案中宣告一個全域變數，HTML 就可以串接 TS 中的資料並展現在畫面中。

```typescript
export class AppComponent {
  testTitle: string = '我是標題';  // 有初始值 ✅
  testContent: string;             // 沒有初始值 ❌ TypeScript 會報錯
}
```

<div class="mt-3 flex justify-center">
  <img src="/images/14-variables/declare-var-ts.png" style="max-height: 200px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />
</div>

<!--
如果畫面上要顯示一個值，而且這個值可能會隨著使用者操作而改變，就要在元件的 TypeScript 檔裡宣告一個全域變數。HTML 就能讀取這個變數，顯示在畫面上。

看程式碼，`testTitle` 有給初始值，沒有問題。但 `testContent` 只寫了型別，沒有給初始值，TypeScript 就會報錯。

這是因為新版 Angular 預設開啟了嚴格模式，沒有初始值的變數可能是 undefined，TypeScript 會要求我們處理。最簡單的做法，就是直接給它一個初始值。
-->

---

# 宣告變數（二）— 處理無初始值

當變數確實不需要初始值時，有兩種寫法可以消除錯誤：

| 寫法 | 語意 | 使用時機 |
| --- | --- | --- |
| `testContent!: string` | 非空斷言：我保證執行時一定有值，跳過檢查 | 確定之後會被賦值 |
| `testContent?: string` | 可選屬性：此屬性可能不存在（即 `undefined`） | 值本來就可能不存在 |

<div class="mt-3 flex justify-center">
  <img src="/images/14-variables/declare-var-error.png" style="max-height: 200px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />
</div>

<!--
但有些變數一開始確實沒有值，例如要等 API 回傳資料才會有。這時候有兩種寫法可以處理。

第一種是在變數名稱後面加驚嘆號，這叫做「非空斷言」。意思是向 TypeScript 保證：「雖然現在沒有值，但使用之前一定會被指定值」，TypeScript 就會跳過檢查。

第二種是加問號，這叫做「可選屬性」，意思是「這個值本來就可能不存在」，也就是可能是 undefined。

簡單分辨：確定之後一定會有值，用驚嘆號；值本來就可能沒有，用問號。這兩種寫法在 Angular 實務中都很常見。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 畫面呈現
# Data Binding

<!--
變數宣告好了，接下來就是把變數呈現在畫面上，這叫做資料綁定。
-->

---

# 畫面呈現（一）— 字串插值

全域變數宣告完後，在 HTML 中用 `{{ 變數名稱 }}` 將變數名稱包起來，畫面就會呈現出變數的內容。

**HTML（顯示變數）：**

```html
{{ testTitle }}
```

<div class="mt-3 flex justify-center">
  <img src="/images/14-variables/binding-interpolation.png" style="max-height: 200px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>&#123;&#123; &#125;&#125;</code> 是 Angular 的<b>字串插值（String Interpolation）</b>語法，會將 TS 變數的值直接顯示在 HTML 中
</div>

<!--
第一種方式叫做「字串插值」。

寫法是在 HTML 裡，用兩組大括號把變數名稱包起來。Angular 在顯示畫面時，會到對應的 TypeScript 檔裡找到這個變數，把它的值放進來。

所以這裡寫 `testTitle`，畫面上就會顯示 TypeScript 裡的「我是標題」。之後如果變數的值改變，畫面也會自動跟著更新。
-->

---

# 畫面呈現（二）— 搭配 HTML 標籤

顯示的變數也可以用 HTML 標籤包起來，用來取代原本固定的值。

```html
<h1>{{ testTitle }}</h1>
```

<div class="mt-3 flex justify-center">
  <img src="/images/14-variables/binding-h1.png" style="max-height: 200px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>{{ }}</code> 可以放在 any HTML 標籤的<b>文字內容位置</b>，但無法直接放在屬性值內（屬性需用屬性綁定）
</div>

<!--
雙大括號也可以放在任何 HTML 標籤裡面。

例如把它放在 `h1` 裡，顯示出來的變數內容，就會套用 `h1` 的標題樣式。

這樣我們就能用變數來取代原本寫死的文字，標題、內文這些內容都可以動態顯示。
-->

---

# 畫面呈現（三）— 屬性綁定

除了顯示文字，也可以用來替代標籤的**屬性（Attribute）**內容，例如按鈕文字或圖片來源。

```html
<button>{{ buttonText }}</button>
<img [src]="imgSrc">
```

<div class="mt-3 flex justify-center">
  <img src="/images/14-variables/binding-attr.png" style="max-height: 200px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 屬性內容使用<b>屬性綁定（Property Binding）</b>語法 <code>[屬性名稱]="變數名稱"</code>，而非 <code>&#123;&#123; &#125;&#125;</code>
</div>

<!--
那如果要動態設定的是標籤的屬性呢？例如圖片的 `src`。

這時候不能用雙大括號，而要用第二種方式，叫做「屬性綁定」。寫法是用中括號把屬性名稱包起來，等號後面的引號裡，直接寫變數名稱。

看程式碼，`img` 寫成中括號 `src` 等於 `imgSrc`。注意引號裡不用再加雙大括號。中括號的作用，就是告訴 Angular：「引號裡的內容不是一般文字，而是 TypeScript 的變數」。

整理一下：標籤的文字內容用雙大括號，標籤的屬性用中括號。
-->

---
layout: default
---

# 練習：任務說明
### HTML 全部改用變數顯示

將下面頁面的所有內容，改為從 TS 的全域變數來讀取並顯示，包括圖片來源也是。

**目標畫面包含：**

- `<h1>` 顯示標題文字
- `<h3>` 顯示內容文字
- `<img>` 顯示一張圖片

不可以在 HTML 中直接寫死文字或網址，全部透過 TS 變數傳入。

<div class="mt-3 flex justify-center">
  <img src="/images/14-variables/practice-result.png" style="max-height: 160px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" />
</div>

<!--
我們來做一個練習。

請把畫面上的所有內容，包括 `h1` 的標題、`h3` 的內文，以及圖片的來源，都改成從 TypeScript 的全域變數讀取。HTML 裡不能直接寫死任何文字或網址。

想一想，文字和圖片來源，分別要用哪一種綁定方式？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示
### 完成步驟

1. 在 `app.component.ts` 的 class 內宣告三個全域變數：
   - `titleText: string = '我是標題'`
   - `contentText: string = '內容是我'`
   - `imageSrc: string = '你的圖片網址'`

2. 在 `app.component.html` 中：
   - 用 `{{ titleText }}` 放入 `<h1>` 標籤內
   - 用 `{{ contentText }}` 放入 `<h3>` 標籤內
   - 用 `[src]="imageSrc"` 設定 `<img>` 的圖片來源

3. 儲存後觀察瀏覽器是否正確顯示

<!--
我們來看解題步驟。

第一步，在 `app.component.ts` 的 class 裡宣告三個全域變數：`titleText`、`contentText` 和 `imageSrc`，並給它們初始值。

第二步，在 HTML 裡，`h1` 和 `h3` 的內容分別改成用雙大括號包住 `titleText` 和 `contentText`。圖片則是用屬性綁定，寫成中括號 `src` 等於 `imageSrc`。

存檔之後，如果畫面跟原本一樣，就代表資料已經成功從 TypeScript 傳到畫面上了。
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

# 補充練習 1–2：插值與屬性綁定

**練習 1：個人檔案動態卡片**

在 `app.component.ts` 宣告 `userName`（字串）與 `userAge`（數字），在 HTML 用 `{{ }}` 把資料呈現出來。

**練習 2：超連結動態切換**

1. 在 TS 宣告字串變數 `targetUrl`，放入 Google 的網址
2. 在 HTML 建立 `<a>` 標籤，用中括號 `[href]` 綁定該變數
3. 點擊網頁上的連結，測試是否能成功跳轉

<!--
接下來兩題補充練習。

第一題，在 TS 宣告名字和年齡，用雙大括號顯示在畫面上。

第二題，把超連結的網址也交給變數控制：在 TS 宣告 `targetUrl`，在 HTML 用中括號 `href` 綁定它。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
export class AppComponent {
  userName: string = 'Allen';
  userAge: number = 30;
  targetUrl: string = 'https://www.google.com';
}
```

```html
<h2>姓名：{{ userName }}</h2>
<p>年齡：{{ userAge }} 歲</p>

<a [href]="targetUrl" target="_blank">前往 Google</a>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 標籤之間的文字用 <code>&#123;&#123; &#125;&#125;</code>；標籤的屬性（如 <code>href</code>、<code>src</code>）則用中括號綁定
</div>

<!--
我們來看答案。

TS 裡宣告三個全域變數。HTML 裡，名字和年齡放在標籤中間，用雙大括號顯示。

超連結的 `href` 是標籤的屬性，所以要用中括號綁定，中括號裡的 `targetUrl` 會被當成變數，而不是文字。記住這個分工：標籤中間的文字用雙大括號，標籤的屬性用中括號。
-->

---
layout: end
---

# 變數使用完成
### 讓資料從 TypeScript 流向畫面！

<!--
這一章我們學了變數的使用。有初始值時可以省略型別，讓 TypeScript 自動推斷。全域變數寫在 class 最上層，在方法裡要用 `this.` 存取；區域變數只在方法裡有效。宣告變數用 `let` 或 `const`，不要用 `var`。沒有初始值的變數，可以用驚嘆號或問號處理。最後，畫面顯示文字用雙大括號，設定屬性用中括號。

下一章，我們會學習方法，讓網頁能夠執行動作。我們下一章見。
-->
