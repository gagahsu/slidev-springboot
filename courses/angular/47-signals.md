---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Signals
routeAlias: ch47
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
    Signals
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「響應式狀態管理的現代解法」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
前兩章我們用 RxJS 的 Subject 和 Observable，做出了跨元件共享的狀態。這一章，我們要認識 Angular 近年主推的另一種方式：Signals。

用 Observable 時，要讀取一個值，得先訂閱。Signals 則像一塊隨時更新的看板，要讀取時直接看現在的值就好，寫起來更直覺。
-->

---
layout: default
---

# Outline

- **Signals 概念介紹**
- **以 Observable 實作狀態共享（回顧）**
- **改寫為 Signals 寫法**
- **在 Template 中使用 Signal**
- **延伸：Signal 與 ch46 的 Interceptor**
- **computed() 計算 Signal**
- **偵測 Signal 值變化（effect）**
- **注意事項**

<!--
這一章會先介紹 Signals 的概念，接著回顧上一章用 Observable 做的載入狀態，再把它改寫成 Signals 版本，並看看在模板裡怎麼使用。然後討論改用 Signal 之後，攔截器還需不需要調整。接著學習用 `computed` 做衍生計算、用 `effect` 監聽變化，最後整理注意事項，並做一個購物車小計的練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Signals 概念介紹

<!--
我們先建立 Signals 的基本概念，搞懂它是什麼，以及跟 Observable 差在哪裡。
-->

---

# Signals 是什麼？

Signals 是 Angular v16 後推出的響應式狀態管理機制，用於監測值的變化並即時反映至畫面。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**Signals 的特性**
- 必須設定初始值
- 讀取值須以函式呼叫形式：`signal()`
- 值變更時自動通知相依的 template 或 `effect`
- 適用於**同步、即時**的狀態管理

</div>
<div>

**與 Observable 的差異**

| 項目 | Signal | Observable |
| --- | --- | --- |
| 初始值 | 必須提供 | 非必要 |
| 讀取方式 | `signal()` 呼叫 | `.subscribe()` |
| 非同步支援 | 否 | 是 |
| 適用場景 | 同步狀態 | API 呼叫等非同步 |

</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 若需等待 API 回應等非同步操作，仍須使用 Observable（訂閱）寫法。
</div>

<!--
Signals 是 Angular 16 之後推出的響應式狀態管理機制，用來監測值的變化，並即時反映到畫面上。

可以把 Signal 想成一個會被監控的容器，裡面裝著一個值。只要值改變，所有讀取這個 Signal 的地方，都會自動更新。就像手機的電量顯示，電量一變，數字就自動更新。

它有幾個特性：必須設定初始值；讀取時要用函式呼叫的方式；適用於同步、即時的狀態。

看表格，Signal 一定要有初始值，用呼叫的方式讀取，不支援非同步；Observable 則用 `subscribe` 讀取，適合 API 這類非同步的情況。所以要等 API 回應時，還是要用 Observable。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 以 Observable 實作狀態共享（回顧）

<!--
在改寫之前，我們先快速回顧上一章用 Observable 做的載入狀態，等一下才有比較的基準。
-->

---

# Observable 寫法回顧：loading.service.ts

上一章（ch46）以 `BehaviorSubject` + `asObservable()` 實作跨元件狀態共享。

```typescript
export class LoadingService {
  private _loading$ = new BehaviorSubject<boolean>(false);
  loading$ = this._loading$.asObservable();

  show() {
    this._loading$.next(true);
  }

  hide() {
    this._loading$.next(false);
  }
}
```

<!--
這是上一章的 `LoadingService`。

用 `BehaviorSubject` 存放狀態，初始值是 false；再用 `asObservable` 包成外部只能訂閱、不能修改的版本；`show` 和 `hide` 用 `next` 推送新的值。

`_loading$` 是 `private`，只有 Service 內部能修改；公開的 `loading$` 是給外部訂閱的唯讀窗口。

等一下會看到，改成 Signal 之後，這一層包裝就可以省略了。
-->

---

# Observable 寫法回顧：app.component.ts

上一章的 `AppComponent` 取得 `loading$`，交由樣板的 `async` pipe 訂閱。

```typescript
export class AppComponent {
  loading$!: Observable<boolean>;
  private loadingService = inject(LoadingService);
  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$;
  }
}
```

```html
@if (loading$ | async) {
  <div class="overlay">
    <div class="spinner-box">
      <mat-spinner [diameter]="70"></mat-spinner>
    </div>
  </div>
}
```

<!--
這是上一章的 `AppComponent`。

元件把 Service 的 `loading$` 接到自己的屬性上，再交給模板裡的 `async` pipe 自動訂閱。

注意這條鏈路有多長：`BehaviorSubject`、`asObservable`、元件屬性、`async` pipe，最後才是 `@if`。只是要讓畫面知道一個布林值變了，就要串好幾層。等一下看看改成 Signal 之後會變成什麼樣子。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 改寫為 Signals 寫法

<!--
回顧完 Observable 的版本，接下來我們把同一個例子，一步一步改寫成 Signals。
-->

---

# 改寫 loading.service.ts（一）

將原本的 `BehaviorSubject` + `asObservable()` 替換為 `signal()`。

- Signal 必須提供初始值，此處設為 `false`
- 更新值改用 `.set()` 方法，取代 `.next()`

```typescript
import { signal } from '@angular/core';

export class LoadingService {
  // private _loading$ = new BehaviorSubject<boolean>(false);
  // loading$ = this._loading$.asObservable();
  loading = signal<boolean>(false);
  show() {
    // this._loading$.next(true);
    this.loading.set(true);
  }
  hide() {
    // this._loading$.next(false);
    this.loading.set(false);
  }
}
```

<!--
先改寫 `LoadingService`。

原本「宣告 `BehaviorSubject`，再用 `asObservable` 包裝」這兩行，現在合併成一行：`loading` 等於 `signal`，型別是布林，初始值 false。Signal 一定要給初始值，不能省略。

更新值的方式，從 `next` 改成 `set`。`show` 裡寫 `this.loading.set(true)`，`hide` 寫 `set(false)`。語意上也更直覺：「把值設成什麼」。
-->

---

# 改寫 app.component.ts（二）

在元件中將 Signal 實例指派給本地屬性，取代 `Observable` + `async` pipe 寫法。

- Signal 是函式型別（`Signal<boolean>`），讀取值需呼叫 `this.loading()`
- 不再需要 `Observable` 型別與 `async` pipe，Angular 會自動追蹤依賴

```typescript
import { Signal, inject } from '@angular/core';

export class AppComponent {
  // loading$!: Observable<boolean>;
  loading!: Signal<boolean>;
  private loadingService = inject(LoadingService);
  ngOnInit(): void {
    // this.loading$ = this.loadingService.loading$;
    this.loading = this.loadingService.loading;
  }
}
```

<!--
接著改寫 `AppComponent`。

`loading` 的型別宣告成 `Signal<boolean>`，在 `ngOnInit` 裡把 Service 的 `loading` 指定過來，寫法跟上一章幾乎一樣，只是接過來的是 Signal 本身。

要注意，Signal 是一個函式型別的物件，不是單純的布林值。所以要讀取它的值，必須寫成 `this.loading()`，加上小括號。

和 Observable 版本相比，這裡不需要 `async` pipe，也沒有訂閱需要取消，Angular 會自動追蹤。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 在 Template 中使用 Signal

<!--
邏輯都改寫完了，接下來看看在模板裡怎麼讀取 Signal 的值。
-->

---

# 在 Template 中綁定 Signal 值

在 HTML template 中，Signal 以函式呼叫方式讀取（`loading()`）。  
當 Signal 值發生變更，Angular 會自動重新渲染相關區塊。

```html
<!-- Observable 版本：需要 async pipe -->
<!-- @if (loading$ | async) { -->

<!-- Signal 版本：直接呼叫，不需要 pipe -->
@if (loading()) {
  <div class="overlay">
    <div class="spinner-box">
      <mat-spinner [diameter]="70"></mat-spinner>
    </div>
  </div>
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 在 template 中使用 Signal 時，須以 <code>loading()</code>（含括號）的形式呼叫，而非直接寫屬性名稱。
</div>

<!--
在模板裡，Signal 一樣用函式呼叫的方式讀取。

上一章寫的是 `loading$`、直線符號、`async`；Signal 版本只要寫 `loading()` 就好，連 `async` pipe 都不需要。當 Signal 的值改變，Angular 會自動重新顯示這個區塊。

最容易犯的錯，是忘了加小括號。只寫 `loading` 的話，Angular 不會報錯，但拿到的是函式本身，而不是布林值，畫面的邏輯就會出錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 延伸：Signal 與 ch46 的 Interceptor

<!--
改用 Signal 之後，上一章攔截器裡的 `setTimeout` 還需要嗎？攔截器能不能拿掉？
-->

---

# 改用 Signal 後，NG0100 還會發生嗎？

**不會。** ch46 的 NG0100 是「樣板檢查完 `loading$ | async` 的值，同一輪變更偵測裡值又被 `next()` 改掉」造成的。

Signal 的運作方式不同：

- `loading.set(true)` 不會當場改掉「這一輪已檢查」的綁定結果
- 而是把有讀取 `loading()` 的畫面**標記為 dirty**，由 Angular **安排下一輪**變更偵測再更新
- 官方 NG0100 錯誤指南也建議：改用 Signal 是根治這類時序問題的方式之一

因此 Interceptor 裡的 `setTimeout` 補丁可以移除：

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  // Signal 版不需要 setTimeout 包裝
  loadingService.show();
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

<!--
答案是：改用 Signal 之後，NG0100 不會再發生。

上一章的 NG0100，是因為模板已經檢查過 `loading$` 的值，同一輪檢查中，值又被 `next` 改掉了。

Signal 的運作方式不同。`set` 不會直接改掉這一輪已經檢查過的結果，而是把讀取這個 Signal 的畫面標記為需要更新，再由 Angular 安排下一輪重新顯示。官方的錯誤說明也建議，改用 Signal 是解決這類時序問題的方法之一。

用團體照的比喻，Signal 會自動等這張拍完，下一張才舉手。所以攔截器裡的 `setTimeout` 可以拿掉，直接呼叫 `show` 就好。
-->

---

# 那 Interceptor 可以整個移除嗎？

**不行。** Interceptor 解決的是**兩個**問題，Signal 只解掉其中一個：

| ch46 的問題 | 解法 | 改用 Signal 後 |
| --- | --- | --- |
| NG0100 時序衝突 | `setTimeout` 延後 `show()` | ✅ Signal 天生避開，`setTimeout` 可移除 |
| 每個元件手動 show()/hide()、容易忘記 hide() | Interceptor + `finalize()` | ❌ 問題仍在，Interceptor 必須保留 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>結論：</b> Signal 取代的是「狀態的儲存與通知」（BehaviorSubject + async pipe），不是「何時觸發 show()/hide()」的問題。集中觸發、保證 hide() 這件事，仍然是 Interceptor 的職責。
</div>

<!--
那攔截器可以整個拿掉嗎？答案是不行。

看表格，攔截器當初解決了兩個問題。第一個是 NG0100 的時序衝突，改用 Signal 之後就不會發生了，`setTimeout` 可以移除。第二個是每個元件都要手動呼叫 `show` 和 `hide`，容易忘記 `hide`，這個問題跟狀態用什麼技術存放無關，攔截器加上 `finalize` 仍然需要保留。

結論是：Signal 取代的是「狀態的存放和通知」，也就是 `BehaviorSubject` 加上 `async` pipe；而「什麼時候觸發 show 和 hide」，仍然是攔截器的工作。兩者各自負責不同的事。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# computed() 計算 Signal

<!--
接下來看 Signal 的好搭檔：`computed`，用來處理「這個值是根據另一個 Signal 算出來的」這種情況。
-->

---
zoom: 0.96
---

# TypeScript Getter — 自動計算屬性

**沒有 getter：** 每個方法都要手動更新衍生值

```typescript
level = 1;
attack = 3;

levelUp() {
  this.level++;
  this.attack = this.level * 3; // 忘記更新就會出錯
}
```

**有 getter：** 定義一次，自動計算

```typescript
level = 1;

get attack(): number {
  return this.level * 3; // level 變了，attack 自動跟著變
}

levelUp() {
  this.level++; // 不需要手動更新 attack
}
```

<!--
在介紹 `computed` 之前，先看 TypeScript 的 getter。

上半部沒有用 getter。`attack` 是根據 `level` 算出來的，所以每次 `level` 改變，都要記得手動更新 `attack`，忘了就會出錯。繫結那一章的等級計算機，就是這樣寫的。

下半部改用 getter，在 `attack` 前面加上 `get`，裡面回傳 `level` 乘以 3。這樣只要定義一次，`level` 改變時，讀取 `attack` 就會自動得到新的值，不用再手動更新。
-->

---

# computed() — Signal 的響應式 Getter

`computed()` 是 Signal 版本的 getter：依賴的 Signal 值一變，計算結果自動更新。

```typescript
import { signal, computed } from '@angular/core';

export class AppComponent {
  level = signal(1);
  attack = computed(() => this.level() * 3);
  defense = computed(() => this.level() * 2);

  levelUp() {
    this.level.update(v => v + 1);
    // attack 與 defense 自動重新計算，不需要手動更新
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>computed()</code> 是<b>唯讀</b>的，不能呼叫 <code>.set()</code>；只要依賴的 Signal 改變，值就自動同步
</div>

<!--
`computed` 就是 Signal 版本的 getter。

這裡 `level` 是一個 Signal，`attack` 等於 `computed`，裡面回傳 `this.level()` 乘以 3，`defense` 則是乘以 2。只要 `level` 改變，`attack` 和 `defense` 就會自動重新計算。

`levelUp` 用 `update` 更新 `level`，`update` 接收一個函式，根據目前的值算出新值，這裡是加 1。

要注意，`computed` 是唯讀的，不能呼叫 `set`。
-->

---

# Getter vs computed() 比較

| | TypeScript Getter | Angular computed() |
| --- | --- | --- |
| 適用對象 | 一般屬性（非 Signal） | Signal |
| 讀取方式 | `this.attack` | `this.attack()` |
| Template 寫法 | `{{ attack }}` | `{{ attack() }}` |
| 自動追蹤依賴 | ✗ | ✅ |
| 可呼叫 .set() | ✗ | ✗（唯讀） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 演進脈絡：手動更新屬性 → getter → computed()，三者解決同一個問題，Signal 場景下優先用 <code>computed()</code>
</div>

<!--
我們比較一下 getter 和 `computed`。

getter 適用於一般屬性，讀取時直接寫 `this.attack`；`computed` 適用於 Signal，讀取時要加小括號。`computed` 會自動追蹤它依賴的 Signal，兩者都是唯讀的。

演進的脈絡是：手動更新屬性、getter，再到 `computed`，三者解決的是同一個問題。記住一個原則：Signal 用 `computed`，一般屬性用 getter。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 偵測 Signal 值變化（effect）

<!--
除了用 `computed` 算出新的值，有時候我們想在 Signal 改變時順便做一些事，例如印出 log，這就要用 `effect`。
-->

---

# 使用 effect() 偵測 Signal 變化

當 Signal 值更新時，若需執行額外的邏輯（如 `console.log`、副作用操作），可使用 `effect()`。

- `effect()` 必須定義於 `constructor` 內
- Angular 會自動追蹤函式內所有被讀取的 Signal，並在其值變更時重新執行

```typescript
export class AppComponent {
  loading!: Signal<boolean>;
  private loadingService = inject(LoadingService);

  constructor() {
    effect(() => console.log(this.loading()));
  }

  ngOnInit(): void {
    this.loading = this.loadingService.loading;
    setTimeout(() => {
      this.loadingService.show();
    }, 1000);
  }
}
```

<!--
當 Signal 的值更新時，如果需要執行額外的邏輯，就可以用 `effect`。

`effect` 必須寫在 `constructor` 裡。Angular 會自動追蹤函式裡讀取了哪些 Signal，這裡是 `this.loading()`，只要這個值改變，`effect` 裡的程式就會重新執行一次。

範例中用 `setTimeout` 模擬一秒後呼叫 `show`。執行結果是：一開始 Console 先印出初始值 false，一秒之後值變成 true，`effect` 就自動再印出 true。
-->

---

# effect() 重點說明

| 項目 | 說明 |
| --- | --- |
| 定義位置 | 必須在 `constructor` 中呼叫 |
| 自動追蹤 | 自動追蹤函式內所有被讀取的 Signal |
| 執行時機 | Signal 值變更時立即執行 |
| 用途 | 日誌記錄、DOM 操作、外部副作用 |
| 注意 | 不可在 `effect` 內直接呼叫 `.set()` 修改同一 Signal（可能造成無限迴圈） |

<!--
這張表整理了 `effect` 的重點。

它必須在 `constructor` 裡呼叫；會自動追蹤函式裡讀取的所有 Signal；值改變時就會執行；適合用在記錄 log、操作畫面元素這類副作用。

最後一項很重要：不要在 `effect` 裡用 `set` 修改它正在追蹤的同一個 Signal。值改變觸發 `effect`，`effect` 又改值，又再觸發，就會形成無限迴圈。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 注意事項

<!--
最後，我們整理 Signals 的適用情境，特別是它不適合用在哪裡。
-->

---

# Signals 注意事項

| 項目 | 說明 |
| --- | --- |
| 適用場景 | 同步、即時的元件內或跨元件狀態共享 |
| 不適用場景 | 需等待 API 回應的非同步操作 |
| 非同步處理 | 仍須使用 Observable + `subscribe` |
| 初始值 | Signal 建立時必須提供初始值 |
| 讀取方式 | 以函式呼叫方式讀取：`signal()` |
| 更新方式 | 使用 `.set(value)` 更新值 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>總結：</b> Signals 適用於自身程式邏輯中的同步狀態追蹤；API 呼叫等需等待回應的情境，仍應使用 Observable 訂閱模式。
</div>

<!--
這張表整理了 Signals 的注意事項。

最重要的一點是：Signal 處理的是同步、即時的狀態，不是用來取代所有 Observable。

需要等待 API 回應的非同步操作，還是要用 Observable 搭配 `subscribe`。另外，Signal 建立時一定要有初始值，讀取用函式呼叫，更新用 `set`。

很多人會以為 Signal 比較新，以後都不用 Observable 了，這是不對的。
-->

---

# Signals vs Observable 使用時機比較

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**使用 Signals 的情境**
- 元件內部狀態管理（如 loading 旗標、計數器）
- 跨元件共享同步狀態（透過 Service）
- 需要在 template 直接綁定且自動更新的值
- 搭配 `effect()` 執行副作用邏輯

</div>
<div>

**使用 Observable 的情境**
- 呼叫 HTTP API，等待後端回應
- 需要 `pipe`、`map`、`filter` 等 RxJS 操作子
- 事件流（如使用者輸入、WebSocket）
- 需要取消訂閱（`unsubscribe`）管理

</div>
</div>

<!--
這頁把兩者的使用時機並排比較。

適合用 Signals 的情況：元件內部的狀態，例如載入狀態或計數器；透過 Service 共享的同步狀態；要在模板直接綁定並自動更新的值；以及搭配 `effect` 執行副作用。

適合用 Observable 的情況：呼叫 API 等待回應；需要 `pipe`、`map`、`filter` 這些 RxJS 運算子；處理使用者輸入這類事件流；以及需要管理取消訂閱的情況。

判斷的方式是問自己：這個狀態需要等待嗎？需要 RxJS 的運算子嗎？需要就用 Observable，不需要就優先考慮 Signal。
-->

---
layout: default
---

# 練習：購物車小計即時計算（Signal 版）
### 情境說明

商品詳情頁常見情境：使用者調整購買數量，畫面上的小計金額要**立即**跟著變化，而且如果金額超過門檻，還要在畫面下方顯示一則提醒。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**需求**
- 顯示目前數量、單價、小計
- 按 `+` / `-` 調整數量（最少為 1）
- 小計超過 `500` 時顯示優惠提醒文字

</div>
<div>

**限制**
- 數量、小計都必須用 Signal 管理
- 小計不可手動計算後指派，須用 `computed()` 自動推導
- 提醒文字的顯示邏輯用 `effect()` 處理

</div>
</div>

這一題不需要 Service，單一元件內用 `signal()` + `computed()` + `effect()` 就能完成，練習三者如何搭配。

<!--
我們來做一個練習。

商品詳情頁常見的情境：使用者調整購買數量，小計金額要立即跟著變化；如果金額超過門檻，還要顯示一則優惠提醒。

需求是：顯示數量、單價和小計；按加號和減號調整數量，最少是 1；小計超過 500 時顯示提醒。限制是：數量和小計都要用 Signal 管理，小計要用 `computed` 自動計算，提醒用 `effect` 處理。

這題不需要 Service，在單一元件裡就能完成，重點是練習三個工具的分工。
-->

---
layout: default
---

# 練習：購物車小計即時計算
### 任務說明

1. 建立 `quantity = signal<number>(1)`，代表目前數量
2. 建立常數 `price = 100`，代表單價（不需要是 Signal）
3. 建立 `subtotal = computed(() => this.quantity() * this.price)`，自動算出小計
4. 撰寫 `increase()` / `decrease()` 方法，分別用 `.update()` 將 `quantity` `+1` / `-1`；`decrease()` 要確保數量不會小於 `1`
5. 在 `constructor` 中用 `effect()` 監聽 `subtotal()`，當小計 `> 500` 時，在 console 印出提醒訊息
6. Template 顯示 `quantity()`、`subtotal()`，並提供 `+` / `-` 按鈕分別綁定 `increase()` / `decrease()`

<!--
任務有六個步驟。

第一，建立 `quantity` Signal，初始值 1。第二，建立常數 `price` 等於 100，它不會變，不需要是 Signal。第三，用 `computed` 建立 `subtotal`，等於數量乘以單價。第四，撰寫 `increase` 和 `decrease`，用 `update` 加 1 或減 1，`decrease` 要確保數量不小於 1。第五，在 `constructor` 用 `effect` 監聽 `subtotal`，超過 500 時在 Console 印出提醒。第六，模板顯示數量和小計，並提供加減按鈕。

想一想，哪個是原始狀態、哪個是算出來的值、哪個是副作用？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示
### 提示說明

1. `price` 是固定單價，不會被使用者更動，不需要包成 Signal，一般常數即可
2. `decrease()` 呼叫 `.update()` 時，回呼函式裡要加判斷：`v => v > 1 ? v - 1 : v`，避免數量歸零或變負數
3. `computed()` 裡只能讀 Signal（`this.quantity()`），不能呼叫 `.set()` 修改任何 Signal
4. `effect()` 一定要寫在 `constructor` 內，且內部讀取 `this.subtotal()` 才能被自動追蹤到
5. Template 綁定按鈕記得用 `(click)`，讀值記得加括號：`quantity()`、`subtotal()`

<!--
我們來看解題提示。

第一，`price` 是固定的單價，用一般常數就好。第二，`decrease` 在 `update` 的函式裡要加判斷：大於 1 才減 1，否則維持原值。第三，`computed` 裡只能讀取 Signal，不能用 `set` 修改。第四，`effect` 一定要寫在 `constructor` 裡，並且在裡面讀取 `this.subtotal()`，才能被追蹤到。第五，模板的按鈕用小括號 `click` 綁定，讀取值記得加上小括號。
-->

---
layout: default
---

# 完整解答 — cart.component.ts（一）

Signal 與 computed 宣告：

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
})
export class CartComponent {

  quantity = signal<number>(1);
  price = 100;

  subtotal = computed(() => this.quantity() * this.price);

}
```

<!--
我們看完整的解答，先看狀態的宣告。

`quantity` 是唯一需要追蹤變化的原始狀態，所以用 `signal`，初始值 1。`price` 是固定的單價，維持一般屬性。`subtotal` 用 `computed`，裡面讀取 `this.quantity()`，Angular 會自動追蹤，數量一變，小計就自動重新計算。
-->

---
layout: default
---

# 完整解答 — cart.component.ts（二）

`constructor` 中的 `effect()` 與數量調整方法：

```typescript
  constructor() {
    effect(() => {
      if (this.subtotal() > 500) {
        console.warn(`小計 ${this.subtotal()} 元，已符合優惠門檻！`);
      }
    });
  }

  increase(): void {
    this.quantity.update(v => v + 1);
  }

  decrease(): void {
    this.quantity.update(v => (v > 1 ? v - 1 : v));
  }
```

<!--
接著是 `constructor` 和兩個方法。

`effect` 寫在 `constructor` 裡，讀取 `this.subtotal()`，超過 500 就在 Console 印出提醒。這是「值變了，順便做一件事」的副作用，所以用 `effect`，而不是 `computed`。

`increase` 用 `update` 把數量加 1。`decrease` 在 `update` 裡用三元運算子判斷，數量大於 1 才減 1，否則維持原值。
-->

---
layout: default
---

# 完整解答 — cart.component.html

```html
<!-- cart.component.html -->
<div class="cart-box">
  <p>數量：{{ quantity() }}</p>
  <button (click)="decrease()">-</button>
  <button (click)="increase()">+</button>
  <p>小計：NT$ {{ subtotal() }}</p>
</div>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 按 <code>+</code> 加到數量 6（小計 600），開啟瀏覽器 Console，應該會看到優惠提醒的 <code>console.warn</code> 訊息；按 <code>-</code> 減到數量 1 後繼續按，數量應維持在 1，不會變成 0 或負數。
</div>

<!--
最後是模板。

數量和小計都直接用函式呼叫讀取，沒有任何 `subscribe`，也沒有 `async` pipe。加減按鈕用小括號 `click` 綁定兩個方法。

驗證的方式是：按加號到數量 6，小計 600，打開 Console 應該會看到優惠提醒；再按減號減到 1，繼續按，數量應該停在 1，不會變成 0 或負數。

這就是 `signal`、`computed`、`effect` 三者分工合作的完整例子。
-->

---
layout: end
---

# 課程結束

### 掌握 Angular Signals 的核心概念：以 signal() 建立響應式狀態，以 .set() 更新值，以 effect() 偵測變化，取代同步場景下的 Observable 訂閱模式。

<!--
這一章我們學了 Angular Signals。用 `signal` 建立狀態，一定要有初始值，用呼叫的方式讀取，用 `set` 或 `update` 更新。用 `computed` 自動計算衍生的值，用 `effect` 在值改變時執行副作用。Signal 適合同步的狀態，也能避開 NG0100；但等待 API 這類非同步操作，還是要用 Observable。

下一章，我們會學習 Material 的側邊導覽列 Sidenav。我們下一章見。
-->

