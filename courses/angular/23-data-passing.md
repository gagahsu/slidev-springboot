---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 資料傳遞
routeAlias: ch23
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
    資料傳遞
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓頁面與元件之間溝通無阻」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學會用路由，在不同頁面之間切換。但這時候會遇到一個問題：使用者在第一頁輸入了名字，切換到第二頁之後，資料就不見了。

原因是在單頁應用裡，切換頁面時，原本的元件會被銷毀，裡面的資料也跟著消失。

這一章，我們要學習怎麼讓資料在頁面之間、以及父子元件之間傳遞。
-->

---
layout: default
---

# Outline

- **路由資料傳遞** — 使用 Service 在頁面間共享資料
- **建立 Service** — 指令、預設內容、宣告共用變數
- **頁面傳遞資料** — 跨頁面存取 Service 中的值
- **組件傳遞資料** — 為什麼需要 @Input / @Output
- **@Input** — 父元件傳值給子元件
- **@Output** — 子元件觸發父元件方法
- **實作練習**

<!--
這一章分成兩大部分。第一部分是頁面之間的傳遞：先說明為什麼需要 Service，接著建立 Service，再用它在兩個頁面之間傳遞資料。第二部分是元件之間的傳遞：用 `@Input` 讓父元件把資料傳給子元件，用 `@Output` 讓子元件通知父元件。最後用兩個練習把父子傳值練熟。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 路由資料傳遞
# Route Data Sharing

<!--
我們先解決第一個問題：沒有父子關係的頁面之間，要怎麼傳遞資料。
-->

---

# 為什麼需要 Service？

切換路由時，若需要將 A 頁面的資料傳給 B 頁面，但 B 頁面無法直接呼叫 A 頁面的資料。

| 問題 | 說明 |
| --- | --- |
| 路由切換 | A 頁面的元件實例已被銷毀，B 頁面無法存取 |
| 解決方式 | 建立 **Service** 作為中介儲存空間 |
| Service 特性 | 每個頁面都可以注入並讀取其中的資料 |

**Service 不只能放變數，也能放多個頁面共用的方法。**

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>限制：</b> Service 只在 SPA 應用程式「存活期間」內有效，僅適用於 <b>router 內部路由跳轉</b>。若使用者直接輸入網址、按 F5 重新整理、或開新分頁，Angular 應用程式會重新啟動，Service 中的資料會全部歸零。
</div>

<!--
從 A 頁面切換到 B 頁面時，A 頁面的元件已經被銷毀了，所以 B 頁面沒辦法直接取得 A 頁面的資料。

解決方法是建立一個 Service，當作中間的儲存空間。我們可以把它想成一個中央倉庫：A 頁面把資料寄放在倉庫，B 頁面再到倉庫把資料取出來。每個頁面都可以注入這個 Service，讀取裡面的資料。Service 除了放變數，也可以放多個頁面共用的方法。

不過要注意一個限制：Service 的資料只在應用程式運作期間有效。如果使用者按 F5 重新整理、直接輸入網址，或開新分頁，應用程式會重新啟動，Service 裡的資料就會全部歸零。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 建立 Service
# Create a Service

<!--
知道 Service 的用途之後，我們用 CLI 來建立一個。
-->

---

# 建立 Service — 指令

建議在 `src` 目錄下新增 `@services` 資料夾統一管理所有 Service 檔案（一個專案可能有多個）。

```bash
# 指令格式
ng g s 檔案路徑/檔案名稱

# 範例：在 @services 資料夾中建立 example service
ng g s @services/example
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 檔案名稱<b>不需要</b>加 <code>.service.ts</code>，Angular CLI 會自動加上後綴，產生 <code>example.service.ts</code>。
</div>

<!--
建立 Service 的指令是 `ng generate service`，縮寫是 `ng g s`，後面接路徑和名稱。

一個專案可能會有好幾個 Service，建議在 `src` 底下建立 `@services` 資料夾統一管理。例如輸入 `ng g s @services/example`，就會在這個資料夾裡建立 example 這個 Service。

注意名稱後面不用加 `.service.ts`，CLI 會自動補上，產生 `example.service.ts`。
-->

---

# Service 預設內容

建立後，`example.service.ts` 的預設內容如下：

```typescript
// @services/example.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {

}
```

`providedIn: 'root'` 表示這個 Service 在整個應用程式中只有一個實例（Singleton），所有頁面共用同一份資料。

<!--
打開剛建立的檔案，會看到預設的內容。

上方有一個 `@Injectable` 裝飾器，裡面寫著 `providedIn: 'root'`。意思是這個 Service 在整個應用程式裡「只有一個實例」，這叫做單例，英文是 Singleton。

所以不管在哪個頁面注入它，拿到的都是同一個 Service，裡面的資料也是同一份，這正是它能在頁面之間傳遞資料的原因。
-->

---

# Service 中宣告共用變數

在 Service 中宣告需要傳遞的變數，建議命名與原頁面變數相同以方便識別。

```typescript
// @services/example.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExampleService {
  userName: string = '';
}
```

以此例：A 頁面（`first.component.ts`）要將 `userName` 傳給 B 頁面（`second.component.ts`），就在 Service 中同樣宣告 `userName`。

<!--
接著在 Service 裡宣告要傳遞的變數。

假設 A 頁面要把 `userName` 傳給 B 頁面，就在 Service 的 class 裡同樣宣告一個 `userName`，初始值是空字串。建議命名跟原本頁面的變數一樣，比較好辨識。

這樣倉庫就準備好了，接下來就是 A 頁面存入、B 頁面取出。
-->

---
layout: default
---

# 建立 Service — 小節練習

補完 `CartService` 的裝飾器與共用變數，讓整個應用程式共用同一個 `cartCount`：

```typescript
import { ___ } from '@angular/core';

@___(___) // 補完裝飾器與 Singleton 設定
export class CartService {
  // 宣告 cartCount，型別 number，初始值 0
}
```

<!--
我們用一個小練習熟悉 Service 的結構。

請補完 `CartService`：從 `@angular/core` 引入裝飾器，加上讓整個應用程式共用同一個實例的設定，並宣告一個數字型別、初始值為 0 的 `cartCount`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 建立 Service — 小節練習解答

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartCount: number = 0;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>providedIn: 'root'</code> 讓整個應用程式共用同一個 Service 實例（Singleton）——A 頁存入的值，B 頁可以直接讀取
</div>

<!--
我們來看答案。

從 `@angular/core` 引入 `Injectable`，加上 `@Injectable` 裝飾器，裡面寫 `providedIn: 'root'`。class 裡宣告 `cartCount` 等於 0。

`@Injectable` 讓 Angular 知道這是一個可以被注入的 Service；`providedIn: 'root'` 讓它在整個應用程式中只有一個實例，所以 A 頁存入的值，B 頁可以直接讀到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 頁面傳遞資料
# Pass Data Between Pages

<!--
接下來，我們完整演練一次，A 頁面存入資料、B 頁面取出資料的流程。
-->

---

# 傳遞資料 — 塞值到 Service

在 **A 頁面（發送方）** 注入 Service，並將資料塞入 Service 的變數。

```typescript
// first.component.ts
import { inject } from '@angular/core';
import { ExampleService } from '../@services/example.service';

export class FirstComponent {
  private exampleService = inject(ExampleService);

  sendData() {
    this.exampleService.userName = 'Allen';
  }
}
```

此時 Service 中的 `userName` 就等於 `'Allen'`。

<!--
先看 A 頁面，也就是發送方。

在 `first.component.ts` 從 `@angular/core` 引入 `inject`，然後在類別屬性寫 `private exampleService` 等於 `inject(ExampleService)`，就完成注入了。接著在 `sendData` 方法裡，寫 `this.exampleService.userName` 等於 Allen，把資料存進 Service。

執行之後，Service 裡的 `userName` 就變成 Allen 了。A 頁面的任務到這裡就完成了。
-->

---

# 取出資料 — 從 Service 讀值

在 **B 頁面（接收方）** 同樣注入 Service，直接讀取其中的變數值。

```typescript
// second.component.ts
import { inject } from '@angular/core';
import { ExampleService } from '../@services/example.service';

export class SecondComponent {
  userName: string = '';
  private exampleService = inject(ExampleService);

  constructor() {
    this.userName = this.exampleService.userName;
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 需確認 A 頁面已將資料塞入 Service 後，B 頁面才能讀到正確值（時序問題）。
</div>

<!--
再來看 B 頁面，也就是接收方。

在 `second.component.ts` 同樣用 `inject` 注入 `ExampleService`，然後在 `constructor` 裡，把 `this.exampleService.userName` 指定給自己的 `userName` 變數。這樣 B 頁面就能顯示剛才在 A 頁面存入的 Allen。

要注意時間順序：A 頁面必須先把資料存進 Service，B 頁面才讀得到正確的值。

這個做法很適合用在登入後保存使用者資訊，或是分成好幾個步驟的表單。
-->

---

# 注入 Service — constructor 傳統寫法（發送方）

Angular 14 之前只能把 Service 寫在 constructor 的參數裡注入，舊專案很常見，要看得懂。

```typescript
// first.component.ts（發送方）
import { ExampleService } from '../@services/example.service';

export class FirstComponent {
  constructor(private exampleService: ExampleService) {}

  sendData() {
    this.exampleService.userName = 'Allen';
  }
}
```

<!--
除了 `inject()`，你在舊專案還會看到另一種寫法：`constructor` 注入。

看發送方的範例，在 `constructor` 的參數寫 `private exampleService: ExampleService`，就完成注入了。

這種寫法不需要引入 `inject`，但依賴一多，`constructor` 的參數就會變得很長。`sendData` 方法的寫法則完全一樣。
-->

---

# 注入 Service — constructor 傳統寫法（接收方）

接收方同樣寫在 constructor 的參數裡，讀值邏輯則放在 constructor 的大括號中。

```typescript
// second.component.ts（接收方）
import { ExampleService } from '../@services/example.service';

export class SecondComponent {
  userName = '';

  constructor(private exampleService: ExampleService) {
    this.userName = this.exampleService.userName;
  }
}
```

<!--
接收方也一樣，在 `constructor` 的參數注入 Service。

讀值的邏輯則放在 `constructor` 的大括號裡，把 Service 裡的 `userName` 指定給自己的變數。

讀值的時機跟 `inject()` 寫法相同，一樣要確認發送方已經先存入資料。
-->

---

# constructor 注入 vs inject() 比較

| | constructor 注入 | inject() 注入 |
| --- | --- | --- |
| 語法 | `constructor(private s: Service) {}` | `private s = inject(Service)` |
| Angular 版本 | 所有版本 | Angular 14+ |
| 宣告位置 | constructor 括號內 | 類別屬性 |
| 適用情境 | 舊版或需相容性的專案 | 新版 Standalone 推薦 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 兩種寫法注入的是<b>同一個 Service 實例</b>，功能完全相同；本課程範例統一使用 <code>inject()</code>
</div>

<!--
我們比較一下兩種注入方式。

`constructor` 注入是傳統寫法，寫在 `constructor` 的參數裡，所有版本的 Angular 都支援，舊專案大多是這種寫法。`inject()` 是較新的寫法，寫成類別屬性，新版的獨立元件比較推薦。

兩種寫法注入的都是同一個 Service 實例，功能完全一樣。這門課的範例統一使用 `inject()`，但 `constructor` 注入在舊專案很常見，兩種都要看得懂。
-->

---
layout: default
---

# 頁面傳遞資料 — 小節練習

A 頁面（`login.component.ts`）登入成功後，將 `token = 'abc123'` 存入 `AuthService`；B 頁面（`dashboard.component.ts`）在 `constructor` 中讀取並存入自己的 `token` 變數。補完兩頁面的程式碼：

```typescript
// A 頁面
onLogin() {
  this.authService.___ = 'abc123';
}

// B 頁面
token = '';
private authService = inject(AuthService);

constructor() {
  this.token = ___;
}
```

<!--
我們用一個小練習熟悉頁面之間的傳遞。

A 頁面是登入頁，登入成功後，把 token 存進 `AuthService`。B 頁面是後台頁，在 `constructor` 裡讀取 token，存進自己的變數。請補完兩個頁面的程式碼。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 頁面傳遞資料 — 小節練習解答

```typescript
// A 頁面 — 存值
onLogin() {
  this.authService.token = 'abc123';
}

// B 頁面 — 取值
token = '';
private authService = inject(AuthService);

constructor() {
  this.token = this.authService.token;  // 'abc123'
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 兩個頁面注入「同一個」Service 實例；A 頁寫入後切換到 B 頁，B 頁在 constructor 中即可讀到最新值
</div>

<!--
我們來看答案。

A 頁面在 `onLogin` 裡，寫 `this.authService.token` 等於 abc123，把值存進去。B 頁面在 `constructor` 裡，寫 `this.token` 等於 `this.authService.token`，把值讀出來。

兩個頁面注入的是同一個 Service 實例，所以 A 頁存入之後切換到 B 頁，B 頁就能讀到最新的值。這是頁面之間傳遞資料最常用的方式。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 組件傳遞資料
# Component Data Passing

<!--
子元件就放在父元件裡時，不需要 Service，可以用更直接的 `@Input` 和 `@Output`。
-->

---

# 為什麼需要 @Input / @Output？

在頁面中使用子元件時，Service 無法即時反映資料更新：

| 傳遞方式 | 即時更新 | 適用情境 |
| --- | --- | --- |
| Service | ❌ 只讀一次，不即時更新 | 路由頁面之間傳遞 |
| @Input | ✅ 父元件變數更新時即時同步 | 父元件 → 子元件（傳入資料） |
| @Output | ✅ 子元件觸發時即時回傳 | 子元件 → 父元件（回傳事件） |

<!--
為什麼父子元件不用 Service？

看表格，Service 的值通常只在某個時間點讀取一次，父元件的資料後來改變了，子元件不會自動知道。

`@Input` 和 `@Output` 則像是接在父子元件之間的傳聲筒。`@Input` 讓父元件傳資料給子元件，父元件的變數一改變，子元件就會同步更新。`@Output` 則讓子元件在發生事件時，即時通知父元件。

整理一下：頁面之間用 Service，父子元件之間用 `@Input` 和 `@Output`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# @Input
# Pass Data Into Component

<!--
我們先學父元件傳資料給子元件的 `@Input`。
-->

---

# @Input — 子元件宣告

在**子元件**中宣告接收用變數，並加上 `@Input` 裝飾器與匯入。

```typescript
// second.component.ts（子元件）
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-second',
  standalone: true,
  templateUrl: './second.component.html',
})
export class SecondComponent {
  @Input() value: string = '';
}
```

```html
<!-- second.component.html -->
<p>接收到的值：{{ value }}</p>
```

<!--
要讓子元件接收資料，子元件要先準備一個「接收的插孔」。

在子元件的 TypeScript 裡，從 `@angular/core` 引入 `Input`，然後在變數前面加上 `@Input()` 裝飾器，例如 `@Input() value`。

這樣就等於對外宣告：「我有一個叫做 value 的插孔，可以從外面把資料傳進來」。

子元件的 HTML 就可以用雙大括號顯示 `value`，父元件傳什麼進來，這裡就顯示什麼。
-->

---

# @Input — 父元件使用

在**父元件**的 HTML 中，使用子元件標籤並加上 `[變數名稱]="父元件變數"` 綁定。

```typescript
// first.component.ts（父元件）
export class FirstComponent {
  parentName = 'Allen';
}
```

```html
<!-- first.component.html -->
<app-second [value]="parentName"></app-second>
```

當 `parentName` 更新時，子元件的 `value` 也會即時同步更新。

<!--
接著看父元件怎麼把資料傳進去。

父元件的 TypeScript 裡有一個 `parentName` 等於 Allen。在父元件的 HTML 裡使用子元件標籤 `app-second`，再用中括號寫上子元件的插孔名稱，`value` 等於 `parentName`。

意思是「把父元件的 `parentName`，傳進子元件的 `value`」。這其實就是我們學過的屬性繫結，只是對象換成了子元件。

只要父元件的 `parentName` 改變，子元件的 `value` 就會即時同步更新。
-->

---
layout: two-cols
---

# 練習 1：@Input 練習
### 任務說明

1. 建立父頁面（A）與子元件（B）
2. 父頁面有三個輸入欄位
3. 子元件即時顯示父頁面輸入的內容
4. 三個欄位同步更新

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/22-data-passing/practice-1.png" class="rounded shadow-md max-h-80" />
</div>

<!--
我們來做第一個練習，熟悉 `@Input`。

請建立父頁面 A 和子元件 B。父頁面有三個輸入欄位，子元件要即時顯示父頁面輸入的內容，三個欄位都要同步更新。

想一想，父頁面的輸入框要用哪一種繫結？子元件又需要幾個 `@Input`？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 1：解題提示
### 提示說明

1. 子元件宣告三個 `@Input` 變數：`userName`、`userEmail`、`userAddress`
2. 父元件宣告三個變數，各用 `[(ngModel)]` 與輸入框（使用者名稱、使用者 Email、使用者地址）雙向繫結
3. 父元件 HTML 中的子元件標籤：
   ```html
   <app-second [userName]="userName" [userEmail]="userEmail" [userAddress]="userAddress">
   </app-second>
   ```
4. 子元件 HTML 中用 `{{ userName }}`、`{{ userEmail }}`、`{{ userAddress }}` 顯示

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 父元件需匯入 <code>FormsModule</code>（雙向繫結用）與 <code>SecondComponent</code>（子元件用）。
</div>

<!--
我們來看解題提示。

子元件宣告三個 `@Input` 變數：使用者名稱、Email 和地址。父元件也宣告三個變數，各自用 `ngModel` 和輸入框雙向繫結。

在父元件的 HTML 裡使用子元件標籤，連續寫三個中括號屬性繫結，把三個變數分別傳進子元件。子元件的 HTML 再用雙大括號顯示。

記得父元件要匯入 `FormsModule` 和子元件 `SecondComponent`。
-->

---
layout: default
---

# 練習 1：完整解答（子元件）

```typescript
// second.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-second',
  standalone: true,
  templateUrl: './second.component.html',
})
export class SecondComponent {
  @Input() userName: string = '';
  @Input() userEmail: string = '';
  @Input() userAddress: string = '';
}
```

```html
<!-- second.component.html -->
<h3>頁面B(組件)</h3>
<p>使用者名稱：{{ userName }}</p>
<p>使用者Email：{{ userEmail }}</p>
<p>使用者地址：{{ userAddress }}</p>
```

<!--
我們看完整的解答，先看子元件。

TypeScript 裡用 `@Input()` 宣告三個變數：`userName`、`userEmail` 和 `userAddress`。HTML 裡用雙大括號，把這三個值顯示出來。
-->

---
layout: default
---

# 練習 1：完整解答（父元件 TS）

```typescript
// first.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SecondComponent } from './second.component';

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [FormsModule, SecondComponent],
  templateUrl: './first.component.html',
})
export class FirstComponent {
  userName = '';
  userEmail = '';
  userAddress = '';
}
```

<!--
接著是父元件的 TypeScript。

`imports` 陣列裡加入 `FormsModule` 和 `SecondComponent`，前者是為了使用 `ngModel`，後者是為了在 HTML 使用子元件。class 裡宣告三個變數，對應三個輸入欄位。
-->

---
layout: default
---

# 練習 1：完整解答（父元件 HTML）

```html
<!-- first.component.html -->
<h3>頁面A</h3>
使用者名稱：<input [(ngModel)]="userName">
使用者Email：<input [(ngModel)]="userEmail">
使用者地址：<input [(ngModel)]="userAddress">

<app-second [userName]="userName" [userEmail]="userEmail" [userAddress]="userAddress"></app-second>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 三個輸入框各自 <code>[(ngModel)]</code> 雙向繫結，再各自用 <code>[屬性]="變數"</code> 傳給子元件，缺一不可。
</div>

<!--
最後是父元件的 HTML。

三個輸入框各自用 `ngModel` 雙向綁定一個變數。下方的子元件標籤，再用三個中括號屬性繫結，把變數分別傳進子元件的三個 `@Input`。

在輸入框打字時，父元件的變數立刻更新，子元件收到新的值，畫面也就同步顯示出來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# @Output
# Pass Data Out of Component

<!--
那如果子元件裡有一個按鈕，點擊之後要通知父元件呢？這就要用反方向的 `@Output`。
-->

---

# @Output — 子元件宣告

在**子元件**中宣告 `output<T>()` 變數，當需要回傳資料或觸發父元件動作時使用。

```typescript
// second.component.ts（子元件）
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-second',
  standalone: true,
  templateUrl: './second.component.html',
})
export class SecondComponent {
  changeUserName = output<string>();
}
```

<!--
如果 `@Input` 是接收的插孔，`@Output` 就是向外發送訊號的發射器。

在新版的 Angular 裡，我們從 `@angular/core` 引入 `output`，然後宣告 `changeUserName` 等於 `output`，角括號裡寫 `string`。

角括號裡的型別，代表這個發射器之後要送出的資料型別。這裡是字串。
-->

---

# @Output — 子元件觸發

在子元件的方法中，使用 `.emit()` 回傳值給父元件。

```typescript
// second.component.ts（子元件）
export class SecondComponent {
  changeUserName = output<string>();
  inputName = '';

  emitName() {
    this.changeUserName.emit(this.inputName);
  }
}
```

```html
<!-- second.component.html -->
<input [(ngModel)]="inputName">
<button (click)="emitName()">送出</button>
```

<!--
發射器準備好之後，要怎麼送出資料？

在子元件的方法裡，呼叫 `this.changeUserName.emit()`，並把要送出的值放進去，這裡送出的是輸入框的 `inputName`。`emit` 就是「發送」的意思。

HTML 裡，輸入框用 `ngModel` 綁定 `inputName`，按鈕點擊時呼叫 `emitName`。

子元件只負責把資料送出去，不需要知道是誰來接收。
-->

---

# @Output — 父元件接收

在父元件的子元件標籤上，用 `(output變數名稱)="父元件方法($event)"` 監聽並接收回傳值。

```html
<!-- first.component.html -->
<app-second (changeUserName)="onNameChanged($event)"></app-second>
<p>收到的名稱：{{ receivedName }}</p>
```

```typescript
// first.component.ts（父元件）
export class FirstComponent {
  receivedName = '';

  onNameChanged(name: string) {
    this.receivedName = name;
  }
}
```

<!--
父元件要怎麼接收子元件送出的資料呢？

在父元件的 HTML 裡使用子元件標籤時，用小括號監聽這個 output，寫成 `changeUserName` 等於 `onNameChanged($event)`。

這裡的 `$event`，就是子元件用 `emit` 送出來的那筆資料。當子元件送出訊號，父元件就會執行 `onNameChanged`，並把 `$event` 傳進去。方法裡再把收到的名稱存進 `receivedName`，畫面就會顯示出來。

這其實就是事件繫結，只是監聽的對象換成了子元件自訂的事件。
-->

---
layout: two-cols
---

# 練習 2：@Output 練習
### 任務說明

1. 子元件（B）有一個輸入框與一個按鈕
2. 按下按鈕後，將值輸出給父頁面（A）
3. 父頁面（A）接收到值後顯示

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/22-data-passing/practice-2.png" class="rounded shadow-md max-h-80" />
</div>

<!--
我們來做第二個練習，熟悉 `@Output`。

子元件 B 有輸入框和一個按鈕，按下按鈕後，把值輸出給父頁面 A，父頁面收到之後顯示出來。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 2：解題提示（子元件）

頁面B(組件) 有三個輸入框（使用者名稱、使用者Email、使用者地址）與一個按鈕。用物件 `{ key1: value1, key2: value2 }` 打包三個欄位，而不是分開傳三次：

1. 宣告一個物件變數存放三個欄位的值：
   ```typescript
   userData = { userName: '', userEmail: '', userAddress: '' };
   ```
2. 宣告 output，型別也寫成物件：
   ```typescript
   myOutput = output<{ userName: string; userEmail: string; userAddress: string }>();
   ```
3. 按鈕 `(click)` 觸發方法，把整個物件 `emit` 出去：
   ```typescript
   sendData() {
     this.myOutput.emit(this.userData);
   }
   ```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 三個欄位用一個物件包起來，一次 emit 就能把三筆資料一起傳給父元件，不用開三個 output。
</div>

<!--
我們先看子元件的解題提示。

子元件有三個輸入框：使用者名稱、Email 和地址。這裡的建議是，不要替三個欄位各開一個 output，而是用一個物件把三個欄位包起來。

先宣告一個 `userData` 物件，存放三個欄位的值。output 的型別也寫成同樣形狀的物件。按鈕點擊時呼叫 `sendData`，用 `emit` 把整個物件一次送出去。

這樣一次就能把三筆資料一起傳給父元件。
-->

---
layout: default
---

# 練習 2：解題提示（父元件）
### 提示說明

頁面A 沒有輸入框，只負責顯示從頁面B(組件) 收到的三個欄位。父元件用同形狀的物件 `{ key1: value1, key2: value2 }` 接收資料：

```typescript
receivedData = { userName: '', userEmail: '', userAddress: '' };

onReceive(event: { userName: string; userEmail: string; userAddress: string }) {
  this.receivedData = event;  // $event 直接整包存起來
}
```

```html
<app-second (myOutput)="onReceive($event)"></app-second>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>$event</code> 是整包物件，直接存起來即可，不用逐欄位拆開賦值。父元件記得匯入子元件。
</div>

<!--
接著是父元件的解題提示。

父頁面沒有輸入框，只負責顯示收到的資料。父元件準備一個同樣形狀的 `receivedData` 物件，用來存放收到的資料。

HTML 裡用小括號監聽 `myOutput`，呼叫 `onReceive($event)`。這時候的 `$event` 就是那整包物件，方法裡直接把它存進 `receivedData` 就好，不用拆開一個一個指定。

用物件傳遞還有一個好處：之後想多傳幾個欄位，只要在物件裡加屬性，不需要再多開 output。
-->

---
layout: default
---

# 練習 2：完整解答（子元件 TS）

```typescript
// second.component.ts
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-second',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './second.component.html',
})
export class SecondComponent {
  userData = { userName: '', userEmail: '', userAddress: '' };
  myOutput = output<{ userName: string; userEmail: string; userAddress: string }>();

  sendData() {
    this.myOutput.emit(this.userData);
  }
}
```

<!--
我們看完整的解答，先看子元件的 TypeScript。

匯入 `FormsModule`，宣告 `userData` 物件存放三個欄位，再宣告型別相同的 `myOutput`。`sendData` 方法用 `emit` 把整包 `userData` 送出去。
-->

---
layout: default
---

# 練習 2：完整解答（子元件 HTML）

```html
<!-- second.component.html -->
<h3>頁面B(組件)</h3>
使用者名稱：<input [(ngModel)]="userData.userName"><br>
使用者Email：<input [(ngModel)]="userData.userEmail"><br>
使用者地址：<input [(ngModel)]="userData.userAddress"><br>
<button (click)="sendData()">output輸出</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 三個輸入框都用 <code>[(ngModel)]</code> 直接綁定物件的屬性（如 <code>userData.userName</code>），不用額外宣告三個獨立變數。
</div>

<!--
子元件的 HTML。

三個輸入框直接用 `ngModel` 綁定物件的屬性，例如 `userData.userName`，不用另外宣告三個獨立的變數。打字時物件的內容即時更新，按下按鈕時送出去的就是最新的資料。
-->

---
layout: default
---

# 練習 2：完整解答（父元件 TS）

```typescript
// first.component.ts
import { Component } from '@angular/core';
import { SecondComponent } from './second.component';

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [SecondComponent],
  templateUrl: './first.component.html',
})
export class FirstComponent {
  receivedData = { userName: '', userEmail: '', userAddress: '' };

  onReceive(event: { userName: string; userEmail: string; userAddress: string }) {
    this.receivedData = event;
  }
}
```

<!--
父元件的 TypeScript。

`imports` 加入子元件 `SecondComponent`。宣告 `receivedData`，形狀和子元件送來的物件一樣。`onReceive` 方法接收這個物件，直接存進 `receivedData`。
-->

---
layout: default
---

# 練習 2：完整解答（父元件 HTML）

```html
<!-- first.component.html -->
<h3>頁面A</h3>
使用者名稱：{{ receivedData.userName }}<br>
使用者Email：{{ receivedData.userEmail }}<br>
使用者地址：{{ receivedData.userAddress }}

<app-second (myOutput)="onReceive($event)"></app-second>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 頁面A 只顯示資料、沒有輸入框；按下頁面B的「output輸出」按鈕後，頁面A 上方三個欄位才會即時顯示收到的值。
</div>

<!--
頁面A 沒有輸入框，只用雙大括號顯示 receivedData 的三個屬性。
子元件按下按鈕 emit 後，(myOutput) 監聽器觸發 onReceive，畫面上的三個欄位就會立刻更新顯示。
-->

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 父元件不需要知道子元件內部怎麼組裝資料，只要照物件形狀宣告 <code>receivedData</code> 接住 <code>$event</code> 即可。
</div>

<!--
最後是父元件的 HTML。

上方用雙大括號，分別顯示 `receivedData` 的名稱、Email 和地址。下方的子元件標籤，用小括號監聽 `myOutput`，把 `$event` 傳給 `onReceive`。

在子元件填好資料、按下輸出按鈕之後，父頁面上方的三個欄位才會顯示收到的值。父元件不需要知道子元件內部怎麼組資料，只要照著物件的形狀接收就好。
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

# 補充練習：Service 全域購物車

模擬電商系統：在「商品頁」點擊加入購物車時，其他頁面的「購物車件數」也要同步（即使屬於不同路由頁面）：

1. 用 CLI 建立共享服務：`ng g s @services/cart`
2. 在 `cart.service.ts` 宣告 `cartCount: number = 0;`
3. 在「商品頁元件」注入此服務，做一個按鈕，點擊時執行 `this.cartService.cartCount++`
4. 切換到另一個路由頁面，同樣注入此服務，在 HTML 用 `{{ cartService.cartCount }}` 印出
5. 確認資料有沒有跨路由被記住並共享

<!--
這題補充練習，用 Service 做一個跨頁面的購物車數量。

建立 `CartService`，裡面放一個 `cartCount`。商品頁按一次按鈕就加一，接著切換到另一個頁面，也注入同一個 Service，把數量印出來。

想一想，為什麼切換頁面之後，數字不會歸零？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習：Service 全域購物車 — 參考答案

```typescript
// cart.service.ts
@Injectable({ providedIn: 'root' })
export class CartService {
  cartCount: number = 0;
}
```

```typescript
// product.component.ts
public cartService = inject(CartService);

addToCart() {
  this.cartService.cartCount++;
}
```

```html
<!-- 另一個頁面的 HTML（TS 同樣注入 public cartService） -->
<p>購物車件數：{{ cartService.cartCount }}</p>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>providedIn: 'root'</code> 讓整個專案共用<b>同一個</b> Service 實例；要在 HTML 直接讀取，注入時須宣告為 <code>public</code>
</div>

<!--
我們來看答案。

`CartService` 用 `providedIn: 'root'`，整個專案只會有一個實例，不管哪個頁面注入，拿到的都是同一個。所以商品頁加上去的數字，切換到別的頁面時還在。

要注意，想在 HTML 直接寫 `cartService.cartCount`，注入時要宣告成 `public`；如果是 `private`，就只能在 TS 裡使用。
-->

---
layout: end
---

# 課程結束
### 掌握 Service、@Input、@Output，讓元件之間資料自由流通

<!--
這一章我們學了兩種資料傳遞方式。頁面之間用 Service：用 `ng g s` 建立，`providedIn: 'root'` 讓全站共用同一個實例，可以用 `constructor` 或 `inject()` 注入，但重新整理後資料會歸零。父子元件之間，父傳子用 `@Input` 搭配中括號屬性繫結，子傳父用 `output` 和 `emit`，父元件再用小括號和 `$event` 接收。

剛才提到 Service 的資料在重新整理後會消失。下一章，我們會學習網頁儲存，把資料存在瀏覽器裡。我們下一章見。
-->
