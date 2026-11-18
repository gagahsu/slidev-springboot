---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Interface
routeAlias: ch29
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
    Interface
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用介面定義物件的形狀，讓型別更安全」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們串接 API 拿到了資料。這一章要聊 TypeScript 的一個重要角色：Interface，介面。

一個物件該有哪些屬性？API 回傳的資料長什麼樣子？Interface 就是用來回答這些問題。學完這一章，我們會用 interface 定義物件的形狀，讓 TypeScript 在寫程式的當下就幫我們把關。
-->

---
layout: default
---

# Outline

- **什麼是 Interface** — 介面的概念與生活比喻
- **基本語法** — 定義 interface 並套用到變數
- **可選屬性 `?`** — 讓屬性變成非必填
- **獨立 interface 檔案** — 將 interface 抽離為 `.ts` 檔並 import
- **Class implements Interface** — 讓 class 實作 interface
- **用 Angular CLI 產生 Interface** — `ng g i` 指令自動建檔
- **練習** — 建立巢狀資料的 interface

<!--
這一章會先說明 interface 的概念，接著學基本語法和可選屬性。然後看怎麼把 interface 抽成獨立的檔案管理，以及 class 怎麼實作 interface，也會介紹用 Angular CLI 產生 interface 的指令。最後用一個巢狀資料的練習，把這些觀念串起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 Interface？
# What is an Interface?

<!--
怎麼確定傳進來的物件格式是對的？少一個欄位、型別錯了，都很容易出問題，這正是 interface 要解決的。
-->

---

# 什麼是 Interface？

interface（介面）定義了物件應具備的形狀（屬性與型別）。以臉部為例，臉部必須擁有眼睛、鼻子、嘴巴、耳朵。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>概念：</b> 建立物件時，TypeScript 會比對 interface 的定義，缺少任一必填屬性即視為不合法的物件。
</div>

<!--
我們可以把 interface 想成一張「規格表」。就像蓋房子前的藍圖，寫明了要有幾個房間、幾扇窗戶，蓋出來少了房間就不合格。

interface 也是一樣，它定義「物件應該具備的形狀」，也就是有哪些屬性、各是什麼型別。畫面上用臉部當例子，一張臉一定要有眼睛、鼻子、嘴巴和耳朵，缺一個就不完整。

在 TypeScript 裡，建立物件時，編譯器會拿這張規格表來比對，只要少了任何一個必填的屬性，就會直接報錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Interface 基本語法
# Basic Syntax

<!--
了解概念之後，我們來看 interface 實際怎麼寫，以及怎麼套用到變數上。
-->

---
layout: two-cols
---

# Interface 基本語法

定義 `Person` interface，包含 `name` 與 `age` 兩個必填屬性。將變數型別指定為 `Person` 後，物件必須包含所有定義的屬性，缺少任一屬性 TypeScript 會報錯。

```typescript
interface Person {
  name: string;
  age: number
}

let personDate: Person = {
  name: '123',
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>錯誤說明：</b> 上方程式碼因為缺少 <code>age</code> 屬性，TypeScript 會報錯：「類型 '&#123; name: string; &#125;' 缺少屬性 'age'，但類型 'Person' 必須有該屬性。」
</div>

::right::

<div class="flex items-center justify-center h-full ml-6">
  <img src="/images/29-interface/ts-error.png" class="rounded shadow-md max-w-full" />
</div>

<!--
這裡定義了一個 `Person` interface，規定物件要有 `name` 和 `age` 兩個屬性，型別分別是字串和數字。

接著宣告變數 `personDate`，型別標註為 `Person`，但物件裡只寫了 `name`，沒有 `age`。這時候 TypeScript 會立刻報錯，右邊的截圖就是編輯器顯示的訊息：缺少屬性 age。

要記住，interface 裡列出的屬性，預設全部都是必填的。這就是規格表的作用，編輯器幫我們把關，不用等到執行時才發現漏了東西。
-->

---
layout: default
---

# Interface 基本語法 — 小節練習

定義 `Product` interface，包含三個必填屬性，並建立一個符合此 interface 的物件：

- `id`：`number`
- `name`：`string`
- `price`：`number`

```typescript
interface Product {
  // 補完三個必填屬性
}

let laptop: Product = {
  id: 1,
  name: '筆記型電腦',
  price: 25000
};
```

<!--
我們用一個小練習熟悉 interface 的基本語法。

請定義 `Product` interface，包含三個必填屬性：數字型別的 `id`、字串型別的 `name`，以及數字型別的 `price`。下方的 `laptop` 物件要能符合這個 interface。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# Interface 基本語法 — 小節練習解答

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
}

let laptop: Product = {
  id: 1,
  name: '筆記型電腦',
  price: 25000
};
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 物件若缺少任何必填屬性，TypeScript 在編輯器中立即報錯，不需等到執行時才發現問題——這就是 interface 的核心價值
</div>

<!--
我們來看答案。

`Product` 裡依序寫上 `id`、`name` 和 `price`，各自標註型別。`laptop` 標註為 `Product`，三個屬性都有，所以沒有錯誤。

可以試著把 `laptop` 的 `price` 刪掉，看看 TypeScript 會出現什麼錯誤訊息。
-->

---

# 可選屬性 `?`

若某屬性不一定存在，可在屬性名稱後加上 `?` 標記為選填，TypeScript 不會要求物件必須包含此屬性。

```typescript
interface Person {
  name: string;
  age?: number
}

let personDate: Person = {
  name: '123',
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 在屬性名稱後加上 <code>?</code> 即代表該屬性為選填，物件可以不包含該屬性也不會報錯。
</div>

<!--
interface 的屬性預設都是必填，但實務上不一定每個屬性都會有。例如填寫個人資料時，姓名一定要填，但年齡有些人不想公開。

這時候可以用「可選屬性」，寫法是在屬性名稱後面加一個問號。這裡的 `age` 加了問號，代表物件裡可以沒有 `age`，TypeScript 也不會報錯。

要注意，可選的意思是這個屬性可以不存在。但如果物件裡有寫 `age`，它的值還是要符合宣告的型別，也就是數字。
-->

---

# 獨立 Interface 檔案

建議將 interface 抽離至獨立的 `.interface.ts` 檔案統一管理，需要使用時直接 import 即可。

```typescript
// src/api-result/api-result.interface.ts
export interface Person {
  name: string;
  age?: number;
  sex: string;
}
```

在其他檔案中使用：

```typescript
import { Person } from '../api-result/api-result.interface';
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議：</b> 將 interface 統一放在獨立的 <code>.interface.ts</code> 檔案中，方便管理與重用。
</div>

<!--
目前我們都把 interface 寫在使用它的檔案裡。但實務上，同一個 interface 常會被好幾個元件和服務使用。如果每個檔案各自宣告一次，改一個屬性就要改很多地方，很容易漏掉。

比較好的做法，是把 interface 統一放在獨立的 `.interface.ts` 檔案裡，加上 `export` 匯出。需要使用的地方，再用 `import` 引入。

這裡把 `Person` 放在 `api-result.interface.ts` 裡，其他檔案用 `import` 加上路徑就能使用。之後在專案裡看到 `.interface.ts` 結尾的檔案，就知道是專門放型別定義的地方。
-->

---

# Class implements Interface

使用 `implements` 關鍵字讓 class 實作 interface，class 必須宣告 interface 中定義的所有屬性與方法。

```typescript
interface testInterface {
  name: string;
  getName(): string;
}

export class AppComponent implements testInterface {
  name: string = '';

  getName(): string {
    return this.name;
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 使用 <code>implements</code> 關鍵字讓 class 實作 interface，class 必須包含 interface 中定義的所有屬性與方法。
</div>

<!--
interface 除了規範物件，也可以規範 class。就像簽一份合約，class 用 `implements` 簽下這個 interface，就要把合約裡列出的項目全部做到。

寫法是在 class 名稱後面加上 `implements` 和 interface 的名稱。這裡 `testInterface` 定義了 `name` 屬性和 `getName` 方法，所以 `AppComponent` 裡兩個都要實際寫出來。

`implements` 檢查的是「一定要有」，不是「只能有」。class 可以有 interface 沒規定的其他內容，但 interface 要求的項目一個都不能少。

我們在生命週期那一章寫的 `implements OnInit`，其實就是同樣的觀念。
-->

---
layout: default
---

# Class implements Interface — 小節練習

定義 `Describable` interface（含 `name: string` 與 `describe(): string`），補完 `Book` class 讓它實作此 interface：

```typescript
interface Describable {
  name: string;
  describe(): string;
}

export class Book ___ Describable {
  name: string = '';

  describe(): string {
    // 回傳 '書名：' + this.name
  }
}
```

<!--
我們用一個小練習熟悉 `implements`。

這裡已經定義好 `Describable` interface，包含 `name` 屬性和 `describe` 方法。請補完 `Book` class，讓它實作這個 interface，`describe` 要回傳「書名」加上 `this.name`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# Class implements Interface — 小節練習解答

```typescript
interface Describable {
  name: string;
  describe(): string;
}

export class Book implements Describable {
  name: string = '';

  describe(): string {
    return '書名：' + this.name;
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>implements</code> 讓 TypeScript 強制檢查：class 若缺少 interface 中任何屬性或方法，編輯器立即報錯，確保合約被完整履行
</div>

<!--
我們來看答案。

class 名稱後面寫 `implements Describable`，`describe` 方法回傳「書名」和 `this.name` 組合起來的字串。

可以試著把 `describe` 方法刪掉，TypeScript 就會提示 `Book` 缺少 `Describable` 規定的 `describe`。
-->

---

# 用 Angular CLI 產生 Interface

不用手動建檔，可以用 `ng generate interface`（簡寫 `ng g i`）自動產生：

```bash
ng g i api-result/api-result --type=interface
```

會產生 `src/app/api-result/api-result.interface.ts`：

```typescript
export interface ApiResult {
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 若省略 <code>--type=interface</code>，CLI 預設只會產生 <code>api-result.ts</code>（沒有 <code>.interface</code> 字樣），要維持命名慣例記得加上這個參數。
</div>

<!--
除了手動建立檔案，也可以用 Angular CLI 的指令產生 interface。

指令是 `ng generate interface`，縮寫是 `ng g i`，後面接路徑和名稱。執行之後，會在指定的資料夾建立檔案，裡面已經寫好 `export interface` 的基本結構，我們只要自己填入屬性。

這裡要注意，如果沒有加上 `--type=interface`，CLI 產生的檔名只會是 `api-result.ts`，沒有 interface 這個字。想維持一看檔名就知道是 interface 的命名慣例，記得加上這個參數。
-->

---

# 練習：建立巢狀資料的 Interface
### 根據以下資料，建立對應的 interface。

```typescript
userArray = {
  userName: '玩家A',
  lev: 18,
  props: [
    {
      propsName: '蘑菇',
      amount: 5,
    },
    {
      propsName: '金幣',
      amount: 15,
    }
  ]
};
```

<!--
我們把這一章的內容整合起來，做一個綜合練習。

這次的資料是巢狀結構：外層是玩家資料，有名稱和等級，裡面還有一個道具陣列，陣列裡的每個道具又是一個物件，有名稱和數量。

想一想，這種「物件裡包陣列，陣列裡又是物件」的結構，只用一個 interface 能寫嗎？還是要拆成好幾個？

我們先暫停一下，自己動手試試看。
-->

---

# 練習：參考解答

```typescript
interface Props {
  propsName: string;
  amount: number;
}

interface UserArray {
  userName: string;
  lev: number;
  props: Props[];
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> <code>props</code> 是陣列，元素類型為另一個 interface <code>Props</code>，寫法為 <code>Props[]</code>。
</div>

<!--
我們來看參考解答。

關鍵是把巢狀結構拆成兩個 interface。`Props` 描述陣列裡單一道具的形狀，有名稱和數量；`UserArray` 描述外層的玩家資料。

`UserArray` 的 `props` 屬性，型別寫成 `Props` 加上中括號，代表「一個裝著 `Props` 物件的陣列」。

可以記住一個原則：物件裡包了陣列，而陣列的元素又是物件時，就把元素的形狀獨立成一個 interface，再用陣列的寫法引用它，結構會清楚很多。
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

# 補充練習 1：選填欄位 `?`

1. 定義會員介面 `Member`：必填的 `email`（字串），以及選填的 `phone`（字串）
2. 用問號修飾符 `phone?` 宣告選填
3. 建立一個**只填寫 email** 的 `Member` 物件，確認編譯器沒有任何錯誤
4. 試著拿掉 `?`，觀察 VS Code 的錯誤提示

<!--
第一題補充練習，練習選填欄位。

定義 `Member` 介面，`email` 必填，`phone` 選填。建立一個只有 email 的物件，看看會不會報錯；再把問號拿掉，比較一下差別。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：選填欄位 — 參考答案

```typescript
interface Member {
  email: string;
  phone?: string;    // 選填
}

let member1: Member = { email: 'allen@test.com' };                         // ✅
let member2: Member = { email: 'ben@test.com', phone: '0912345678' };      // ✅
```

```typescript
interface Member {
  email: string;
  phone: string;     // 拿掉 ?
}
let member1: Member = { email: 'allen@test.com' };
// ❌ Property 'phone' is missing in type '{ email: string; }'
```

<!--
我們來看答案。

`phone` 後面加上問號，代表這個欄位可有可無。所以只填 email 的 `member1`，和兩個都填的 `member2`，都符合規格。

拿掉問號之後，`phone` 就變成必填，`member1` 會被標紅，提示缺少 `phone` 屬性。實務上，像電話、備註這種使用者不一定會填的欄位，就適合宣告成選填。
-->

---
layout: default
---

# 補充練習 2：天氣 API 的 Interface

從外部 API 取得大量資料時，建議為資料建立專屬的 interface。

請根據上一章「政府天氣 API」回傳的資料，建立對應的 interface：

- 至少涵蓋：地區名稱 `locationName`、天氣要素 `weatherElement`、時段 `time`（含 `startTime`、`endTime`、`parameter`）
- 用 interface 取代 `any`，宣告 `weatherList`

<!--
第二題補充練習，幫上一章的天氣 API 建立 interface。

先把 API 回傳的資料印出來，從最裡面的時段開始，一層一層往外定義。巢狀的部分，可以拆成好幾個 interface。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：天氣 API 的 Interface — 參考答案

```typescript
interface WeatherTime {
  startTime: string;
  endTime: string;
  parameter: {
    parameterName: string;
    parameterValue?: string;
  };
}

interface WeatherElement {
  elementName: string;          // Wx、PoP、MinT…
  time: WeatherTime[];
}

interface WeatherLocation {
  locationName: string;
  weatherElement: WeatherElement[];
}

weatherList: WeatherTime[] = [];
```

<!--
我們來看答案。

從最內層開始拆：每個時段是 `WeatherTime`，有開始時間、結束時間和 `parameter`。`parameterValue` 不是每種天氣要素都有，所以宣告成選填。

往外一層，`WeatherElement` 有要素名稱和時段陣列；再往外，`WeatherLocation` 有地區名稱和天氣要素陣列。最後 `weatherList` 就可以用 `WeatherTime` 陣列取代 `any`，打點的時候編輯器也會自動提示欄位名稱。
-->

---
layout: end
---

# 課程結束
### 善用 Interface，讓你的 TypeScript 程式更安全、更易維護

<!--
這一章我們學了 interface。它像一張規格表，定義物件應該有哪些屬性和型別，屬性預設都是必填，加上問號就變成可選。interface 建議放在獨立的 `.interface.ts` 檔案，用 `export` 和 `import` 共用，也可以用 `ng g i` 加上 `--type=interface` 產生。class 則可以用 `implements` 實作 interface。

遇到巢狀資料時，記得把內層的物件拆成獨立的 interface，這是實務上最常用的技巧。

下一章，我們會學習資料排序。我們下一章見。
-->
