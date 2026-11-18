---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 同步與非同步
routeAlias: ch43
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
    同步與非同步
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「掌握程式的執行順序，是撰寫可靠非同步邏輯的基礎」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
前面串接 API 和開啟 Dialog 時，我們都用到了 `subscribe`。這一章，我們要搞懂它背後的觀念：同步與非同步。

想像兩種餐廳：一種是點完餐，要站在櫃台等餐做好；另一種是點完拿號碼牌，先去坐，餐好了再叫號。程式也有這兩種執行方式。

學完這一章，我們會清楚兩者的差別，知道非同步程式實際的執行順序。
-->

---
layout: default
---

# Outline

- **程式執行模型** — 程式碼逐行執行的基本概念
- **同步執行** — 循序執行的定義與行為
- **非同步執行** — 非阻塞執行的定義與行為
- **同步與非同步的比較** — 兩者差異對照
- **常見非同步寫法** — `setTimeout` 與 `Observable`

<!--
這一章會先看程式最基本的執行模型，接著分別介紹同步和非同步的定義和特性，再把兩者放在一起比較。最後看幾種常見的非同步寫法，包括 `setTimeout` 和 Angular 常用的 Observable，並做一個載入使用者清單的練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 程式執行模型

<!--
我們先從最基本的問題開始：程式碼是照什麼順序執行的？
-->

---

# 程式執行的基本模型

程式碼預設按照**撰寫的順序**由上至下逐行執行。

```typescript
console.log("1");
console.log("2");
console.log("3");
```

執行結果：

```
1
2
3
```

程式不會跳行、不會亂序——除非使用了特定的非同步機制。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> 同步與非同步的差異，決定了程式碼何時執行、以及執行完畢前是否會阻塞後續步驟。
</div>

<!--
這是最簡單的例子，三行 `console.log` 依序印出 1、2、3。

預設情況下，程式就是照著我們寫的順序，由上往下一行一行執行，不會跳行，也不會亂序。

但這只是預設的行為。一旦程式裡用到了非同步的機制，執行的順序就不一定是我們寫的順序了，這就是這一章要拆解的重點。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 同步執行

<!--
我們先從比較直覺，也是預設的同步開始。
-->

---

# 同步執行（Synchronous）

**同步**：程式按照撰寫順序執行，每一步驟必須完成後才進入下一步。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**特性**
- 執行順序固定：A → B → C
- 前一行未完成，後一行不會啟動
- 程式流程清晰、易於追蹤

</div>
<div>

**類比：排隊點餐**
- 第一位顧客點完餐、拿到餐點
- 第二位才能開始點餐
- 後方每一位都需依序等待

</div>
</div>


<!--
同步的定義是：「程式按照撰寫的順序執行，每一步完成之後，才進入下一步」。

所以執行順序是固定的，A 做完才做 B，B 做完才做 C；前一行還沒完成，後一行就不會開始。好處是流程清楚，容易追蹤。

就像排隊點餐：第一位顧客點完、拿到餐點，第二位才能開始點，後面每個人都要依序等待。
-->

---

# 同步執行 — 程式碼示範

```typescript
function stepA(): void {
  console.log("執行 A");
}

function stepB(): void {
  console.log("執行 B");
}

function stepC(): void {
  console.log("執行 C");
}

stepA();
stepB();
stepC();
```

輸出結果永遠為：`執行 A` → `執行 B` → `執行 C`

<!--
我們用程式碼驗證一下。

這裡定義了三個函式 `stepA`、`stepB`、`stepC`，然後依序呼叫。因為是同步執行，不管函式內容多複雜，輸出的結果永遠是「執行 A、執行 B、執行 C」。

這就是同步最大的特色：順序固定，結果可以預測。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 非同步執行

<!--
同步搞懂之後，接下來是這一章的重點：非同步。它的行為和同步很不一樣，也是初學者最容易搞混的地方。
-->

---

# 非同步執行（Asynchronous）

**非同步**：啟動一項工作後，程式不等待其完成，立即繼續執行後續程式碼；工作完成時再以回呼（callback）或訂閱通知結果。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**特性**
- 工作啟動後不阻塞主執行緒
- 後續程式碼立即繼續執行
- 結果透過回呼、Promise 或 Observable 回傳

</div>
<div>

**類比：取號等餐**
- 每位顧客點完餐後離開櫃台
- 店員備餐時顧客可做其他事
- 餐點好了再呼叫取餐

</div>
</div>


<!--
非同步的定義是：「啟動一項工作之後，程式不等它完成，就立刻繼續執行後面的程式碼」。等那項工作真正完成時，再透過回呼函式或訂閱的方式通知我們結果。

延續點餐的比喻，非同步就像取號等餐。點完餐拿號碼牌去坐下，這段時間可以做別的事，不用站在櫃台等，餐點好了再叫號取餐。

這就是非同步的核心精神：「不阻塞」，工作在背景進行，程式可以先做別的事。
-->

---

# 非同步執行 — setTimeout 示範

`setTimeout()` 是最基本的非同步寫法，設定延遲時間（毫秒）後執行指定程式碼。

```typescript
console.log("開始");

setTimeout(() => {
  console.log("setTimeout 執行");
}, 1000);

console.log("結束");
```

實際輸出順序：

```
開始
結束
setTimeout 執行   ← 1000 毫秒後才印出
```

`setTimeout` 的回呼函式不會阻塞後續程式碼，`結束` 先於回呼被印出。

<!--
我們用 `setTimeout` 實際看看非同步的行為。`setTimeout` 會在指定的毫秒數之後，執行裡面的程式。

這段程式先印出「開始」，接著設定一個 1000 毫秒後執行的 `setTimeout`，最後印出「結束」。

很多人會以為輸出是開始、setTimeout 執行、結束。但實際的順序是：開始、結束，一秒之後才印出 setTimeout 執行。

因為 `setTimeout` 把裡面的程式排到之後才執行，不會卡住後面的程式碼，所以「結束」反而先印出來。

【講師】可以請大家把這段程式貼到瀏覽器 Console 實際執行。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 同步與非同步的比較

<!--
同步和非同步都介紹完了，我們把兩者放在同一張表上比較。
-->

---

# 同步 vs. 非同步

| 比較項目 | 同步（Synchronous） | 非同步（Asynchronous） |
| --- | --- | --- |
| 執行順序 | 嚴格按照程式碼順序 | 工作完成後以回呼通知 |
| 是否阻塞 | 阻塞，前一步未完成則後續等待 | 不阻塞，主執行緒繼續執行 |
| 程式流程 | 清晰、線性 | 較複雜，需處理回呼或訂閱 |
| 適用情境 | 計算、資料轉換、本地邏輯 | API 呼叫、計時器、事件監聽 |
| Angular 常見用法 | 元件邏輯、樣板運算 | `HttpClient`、`Observable`、`setTimeout` |


<!--
這張表是同步和非同步的整理。

同步嚴格依照程式碼的順序執行，前一步沒完成，後面就要等，流程清楚、是線性的，適合計算、資料轉換這類本地的邏輯。

非同步不會阻塞，工作完成後再透過回呼通知，流程比較複雜，要處理回呼或訂閱，適合 API 呼叫、計時器和事件監聽這類需要等待外部回應的情況。

在 Angular 裡，元件邏輯和模板運算大多是同步的；而 `HttpClient`、Observable 和 `setTimeout`，都屬於非同步。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 常見非同步寫法

<!--
最後，我們整理實務上最常見的幾種非同步寫法。
-->

---

# 非同步寫法（一）：setTimeout

`setTimeout(callback, delay)` — 在指定毫秒後執行一次回呼函式。

| 參數 | 型別 | 說明 |
| --- | --- | --- |
| `callback` | `() => void` | 延遲後要執行的函式 |
| `delay` | `number` | 延遲毫秒數（1000 = 1 秒） |

```typescript
setTimeout(() => {
  console.log("1 秒後執行");
}, 1000);
```

常用於模擬延遲、防抖（debounce）或延後初始化。

<!--
第一種是 `setTimeout`。

它接收兩個參數：第一個是時間到了之後要執行的函式，第二個是延遲的毫秒數，1000 毫秒等於 1 秒。

實務上，它常用來模擬延遲，或做輸入防抖，也就是使用者打字時，不要每個字都觸發搜尋，而是停頓一下才搜尋。
-->

---

# 非同步寫法（二）：Observable 與 subscribe

`Observable` 是 RxJS 提供的非同步資料流；Angular `HttpClient` 回傳 `Observable`，需呼叫 `subscribe()` 接收資料。

```typescript
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({ ... })
export class AppComponent {
  private http = inject(HttpClient);

  fetchData(): void {
    this.http.get('https://api.example.com/data')
      .subscribe((response) => {
        console.log(response);
      });
  }
}
```

`subscribe()` 的回呼在 API 回應後才執行，不阻塞其他程式碼。

<!--
第二種是 Observable，這是 Angular 裡最重要的非同步機制。

Observable 是 RxJS 提供的非同步資料流。`HttpClient` 呼叫 API 時，不會直接把資料交給我們，而是回傳一個 Observable，可以把它想成一個還沒送到的包裹。我們要呼叫 `subscribe` 訂閱它，等包裹真的送到，也就是 API 回應了，`subscribe` 裡的函式才會執行。

呼叫 `fetchData` 之後，程式不會停在這裡等 API，而是等回應到了，才執行 `console.log`。

還記得嗎？如果忘了 `subscribe`，API 請求根本不會發出去。
-->

---

# 非同步寫法（三）：Observable 完整簽名

`subscribe()` 可接收三個回呼，分別處理資料、錯誤與完成事件。

| 參數 | 說明 |
| --- | --- |
| `next` | 每次收到資料時執行 |
| `error` | 發生錯誤時執行 |
| `complete` | Observable 正常結束時執行 |

```typescript
this.http.get('/api/items').subscribe({
  next: (data) => console.log('資料：', data),
  error: (err) => console.error('錯誤：', err),
  complete: () => console.log('完成'),
});
```

<!--
`subscribe` 其實可以接收三個回呼，分別處理不同的情況。

`next` 在每次收到資料時執行，`error` 在發生錯誤時執行，`complete` 則在 Observable 正常結束時執行。

可以把它們想成客服的三種通知：next 是「東西送到了」，error 是「抱歉，出狀況了」，complete 是「這次服務結束了」。

實務上 `error` 常被忽略，但建議養成習慣寫上它。否則 API 失敗時，使用者只會看到畫面卡住，完全沒有提示。
-->

---

# 非同步執行順序驗證

混合同步與非同步程式碼時，同步程式碼優先執行完畢，非同步回呼排入任務佇列。

```typescript
console.log("第一行");     // 同步

setTimeout(() => {
  console.log("setTimeout"); // 非同步，1 秒後
}, 1000);

console.log("第三行");     // 同步
```

輸出順序：

```
第一行
第三行
setTimeout
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 即使 <code>setTimeout</code> 延遲設為 0，回呼仍排在同步程式碼之後執行。
</div>

<!--
我們把同步和非同步混在一起，驗證一下剛才的觀念。

先印出「第一行」，是同步；接著設定一個一秒後執行的 `setTimeout`，是非同步；最後印出「第三行」，是同步。

輸出的順序是：第一行、第三行、setTimeout。因為同步的程式會全部先執行完，非同步的回呼會被排進一個等待的佇列，等同步的程式都跑完才輪到它。

要特別注意，就算把 `setTimeout` 的延遲設成 0，它的回呼還是會排在所有同步程式之後才執行。很多錯誤都是從這裡誤判來的。
-->

---

# 在 Angular 元件中使用非同步

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `<p>{{ message }}</p>`,
})
export class AppComponent implements OnInit {
  message = '載入中...';

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<{ text: string }>('/api/hello').subscribe({
      next: (res) => (this.message = res.text),
      error: () => (this.message = '載入失敗'),
    });
  }
}
```

`ngOnInit` 中發出請求，取得回應後更新屬性，Angular 的變更偵測自動更新樣板。

<!--
最後，我們把非同步放進一個真實的 Angular 元件裡。

`message` 一開始是「載入中」。`ngOnInit` 呼叫 `http.get` 發出請求，因為是非同步，畫面會先顯示「載入中」。等 API 回應之後，`next` 才把 `message` 換成回傳的文字；如果失敗，`error` 就把它換成「載入失敗」。

`message` 一改變，Angular 就會自動更新畫面。這種「先顯示載入中，資料回來再更新畫面」的寫法，是實務上最常見的非同步應用。
-->

---
layout: default
---

# 練習：使用者列表載入
### API 與資料結構說明

請呼叫真實的免費 API，取得隨機使用者清單。

```
https://fakerapi.it/api/v1/users
```

回應結構：使用者陣列位於 `res.data`。

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `id` | `number` | 使用者 ID |
| `firstname` / `lastname` | `string` | 名 / 姓 |
| `email` | `string` | 電子郵件 |

<!--
我們來做一個練習，呼叫真實的免費 API，取得隨機使用者的清單。

這頁先說明 API 和回傳的資料結構。要特別注意兩件事：第一，使用者陣列在 `res.data`，不是 `res` 本身。第二，每位使用者的姓名分成 `firstname` 和 `lastname` 兩個欄位，而不是單一的字串。

下一頁是實際要做的需求。
-->

---
layout: default
---

# 練習：使用者列表載入
### 任務說明

實務上呼叫 API 幾乎都會遇到「載入中、成功、失敗」三種狀態，請實作一個會員列表元件，完整處理這三種情況。

1. 建立 `UserListComponent`，屬性 `loading`、`errorMessage`、`users` 分別代表三種狀態
2. `ngOnInit()` 一開始先將 `loading` 設為 `true`
3. 呼叫 `HttpClient.get(...)` 打上一頁的 API，用 `subscribe()` 接收結果
4. `next` 回呼中，將 `res.data`（使用者陣列）存入 `users`，並把 `loading` 設回 `false`
5. `error` 回呼中設定 `errorMessage`，同樣把 `loading` 設回 `false`
6. 樣板依 `loading` / `errorMessage` / `users` 三種狀態切換顯示「載入中」、錯誤訊息、或使用者清單（顯示 `firstname`、`lastname`、`email`）

<!--
這個練習要做一個會員清單，把「載入中、成功、失敗」三種狀態都處理好。

用 `loading`、`errorMessage` 和 `users` 代表三種狀態。`ngOnInit` 先把 `loading` 設為 true，再呼叫 API 並訂閱；成功時存進 `users`，失敗時設定 `errorMessage`，兩種情況都要把 `loading` 設回 false。最後模板依照狀態顯示不同的內容。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示
### 提示說明

1. `loading` 要在發出請求「之前」設為 `true`，並在 `next` 與 `error` 兩個回呼裡都要設回 `false`
2. `error` 回呼一定要處理，否則 API 失敗時畫面會永遠停在「載入中」
3. 樣板可用 `@if` / `*ngIf` 依 `loading`、`errorMessage`、`users` 三種狀態切換內容
4. `subscribe()` 是非同步的，`ngOnInit()` 方法本身不會等 API 回應才結束
5. `fakerapi.it` 這支 API 回傳的是一個物件，實際使用者陣列在 `res.data`，不是 `res`

<!--
我們來看解題提示。

第一，`loading` 要在發出請求之前設為 true，並且在 `next` 和 `error` 兩個回呼裡都要設回 false。第二，`error` 一定要處理，否則 API 失敗時，畫面會永遠停在載入中。第三，模板可以用 `@if` 依照三種狀態切換內容。第四，`subscribe` 是非同步的，`ngOnInit` 不會等 API 回應才結束。第五，使用者陣列在 `res.data`，不是 `res`。
-->

---
layout: default
---

# 完整解答 — Component TypeScript（一）

`user-list.component.ts` 匯入與型別定義：

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface UsersResponse {
  data: User[];
}
```

<!--
我們看完整的解答，先看匯入和型別定義。

匯入 `HttpClient`。`User` interface 描述每位使用者的形狀，注意姓名分成 `firstname` 和 `lastname` 兩個欄位。`UsersResponse` 則對應這支 API 回傳的外層結構，使用者陣列放在 data 裡面。
-->

---
layout: default
---

# 完整解答 — Component TypeScript（二）

`user-list.component.ts` 類別與屬性宣告：

```typescript
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
})
export class UserListComponent implements OnInit {
  private readonly http = inject(HttpClient);

  loading = false;
  errorMessage = '';
  users: User[] = [];
```

<!--
接著是元件的屬性。

用 `inject(HttpClient)` 取得服務，接著宣告 `loading`、`errorMessage` 和 `users` 三個屬性，分別代表載入中、錯誤訊息和成功取得的資料。
-->

---
layout: default
---

# 完整解答 — Component TypeScript（三）

`ngOnInit()` 發出請求並依結果更新狀態：

```typescript
  ngOnInit(): void {
    this.loading = true;

    this.http
      .get<UsersResponse>('https://fakerapi.it/api/v1/users')
      .subscribe({
        next: (res) => {
          this.users = res.data;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = '會員資料載入失敗，請稍後再試';
          this.loading = false;
        },
      });
  }
}
```

<!--
這頁是 `ngOnInit` 的邏輯。

一開始先把 `loading` 設為 true，接著呼叫 `http.get` 並訂閱。`next` 收到回應時，取出 `res.data` 存進 `users`，並把 `loading` 設回 false。`error` 發生時，設定錯誤訊息，`loading` 一樣設回 false。

「先打開 loading，不論成功或失敗都要關掉 loading」，這是處理 API 請求最基本也最重要的寫法。
-->

---
layout: default
---

# 完整解答 — Component HTML

`user-list.component.html` 完整內容：

```html
@if (loading) {
  <p>載入中...</p>
} @else if (errorMessage) {
  <p class="error">{{ errorMessage }}</p>
} @else {
  <ul>
    @for (user of users; track user.id) {
      <li>{{ user.firstname }} {{ user.lastname }}（{{ user.email }}）</li>
    }
  </ul>
}
```

<!--
最後是模板。

用 `@if` 依序判斷三種狀態：`loading` 為 true 時，顯示載入中；否則如果 `errorMessage` 有值，顯示錯誤訊息；都不是的話，代表資料成功取得，用 `@for` 把使用者清單顯示出來。姓名要分別顯示 `firstname` 和 `lastname`。

這三段判斷，剛好對應 TypeScript 裡三個屬性的狀態。
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

# 補充練習 1–2：同步與非同步的執行順序

**練習 1：同步執行**

在 `ngOnInit()` 中依序寫入：

```typescript
console.log('A');
console.log('B');
console.log('C');
```

打開 F12，確認輸出順序是否為 A → B → C。

**練習 2：0 毫秒的 setTimeout**

在同一個區塊混合寫入以下三行，先**預測**輸出順序，再存檔驗證：

```typescript
console.log('開始');
setTimeout(() => { console.log('內層'); }, 0);
console.log('結束');
```

<!--
接下來兩題補充練習，觀察程式的執行順序。

第一題，三行 `console.log` 依序執行，結果應該很好猜。

第二題比較有趣：中間的 `setTimeout` 延遲設成 0 毫秒。請先在心裡預測一下，三行會用什麼順序印出來，再存檔驗證。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```text
練習 1 輸出：A → B → C
練習 2 輸出：開始 → 結束 → 內層
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>setTimeout</code> 是非同步任務，即使延遲 0 毫秒，也要等目前這一段同步程式碼全部執行完，才會輪到它
</div>

<!--
我們來看答案。

練習一是同步執行，一行跑完才跑下一行，所以是 A、B、C。

練習二的結果是開始、結束、內層。`setTimeout` 不會立刻執行，而是先被放到一旁排隊，就算延遲是 0 毫秒，也要等目前的程式碼全部跑完，才輪到它。這就是非同步：先登記，晚點再執行。
-->

---
layout: end
---

# 課程結束
### 分清同步與非同步的執行順序，讓非同步程式碼不再讓人意外

<!--
這一章我們釐清了同步和非同步。同步照順序執行，前一步完成才會進行下一步；非同步啟動後不等待，結果透過回呼或訂閱通知。`setTimeout` 是最基本的非同步寫法，Observable 搭配 `subscribe` 則是 Angular 處理 API 的主要方式，`subscribe` 可以處理 next、error 和 complete。記住，同步的程式永遠會先執行完畢。

下一章，我們會有系統地認識 Observable 背後的工具庫：RxJS。我們下一章見。
-->
