---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Loading
routeAlias: ch46
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
    Loading
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用載入動畫告知使用者系統正在處理，提升操作體驗」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們用 Subject 建立了訂閱機制。這一章，我們要把它用在一個幾乎每個網站都有的功能上：載入動畫。

點了按鈕之後畫面完全沒反應，使用者會以為當掉了，忍不住一直點，甚至重新整理。學完這一章，我們會用 `mat-spinner` 搭配訂閱，做出一套全站共用的載入動畫。
-->

---
layout: default
---

# Outline

- **為什麼需要 Loading 動畫**
- **mat-spinner 元件介紹**
- **安裝與基本用法**
- **CSS 定位：置中與全螢幕遮罩**
- **LoadingService：以 RxJS 控制顯示狀態**
- **AppComponent 整合：單一入口統一管理**
- **async pipe 搭配 Observable**
- **在各頁面觸發 show() / hide()**
- **HttpInterceptor：自動觸發 Loading**
- **客製化顏色與大小**

<!--
這一章會先說明為什麼需要載入動畫，認識 `mat-spinner` 的用法，並用 CSS 把它置中、加上遮罩。接著建立 `LoadingService`，在 `AppComponent` 統一管理，搭配 `async` pipe 控制顯示。然後看怎麼在頁面手動觸發，再進一步改用 HttpInterceptor 自動觸發。最後客製化外觀，並整理完整的程式碼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 為什麼需要 Loading 動畫
## Why Loading Matters

<!--
我們先從使用者的角度想想，沒有載入動畫時會發生什麼事。
-->

---

# 問題：等待 API 回傳時的使用者體驗

串接 API 後，若回傳需要較長時間而畫面毫無回應，使用者可能誤判網頁已損壞，進而重新整理或重複點擊按鈕。

<div class="flex justify-center">
  <img src="/images/46-loading/loading-spinner-preview.png" class="rounded shadow-md max-h-80" />
</div>

**解決方案：** 在資料回傳前顯示載入動畫，資料就緒後隱藏。

<!--
串接 API 之後，如果回應要等一段時間，畫面卻完全沒有反應，使用者很可能以為網頁壞了，於是重新整理，或是重複點擊按鈕，甚至造成表單重複送出。

就像提款機，螢幕沒有任何顯示的話，我們會懷疑機器壞了；如果顯示「處理中，請稍候」的動畫，我們就會安心等待。

解決方法很單純：資料回來之前，先顯示載入動畫；資料一到，就把動畫收起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# mat-spinner
## Angular Material Progress Spinner

<!--
Angular Material 已經準備好現成的載入動畫元件，不用自己做，我們來認識一下。
-->

---

# mat-spinner 簡介

Angular Material 提供內建的載入動畫元件 `mat-spinner`（即 `MatProgressSpinnerModule`）。

使用前需先安裝 Angular Material：

```bash
ng add @angular/material
```

<div class="flex justify-center">
  <img src="/images/46-loading/mat-spinner-official-preview.png" class="rounded shadow-md max-h-52" />
</div>

<!--
Angular Material 提供了內建的載入動畫元件 `mat-spinner`，它屬於 `MatProgressSpinnerModule`，畫面上就是一個不斷旋轉的圓圈。

它是已經設計和測試好的現成元件，不用自己寫 CSS 動畫。使用之前要先安裝 Angular Material，如果專案還沒安裝，執行 `ng add @angular/material` 就可以了。
-->

---

# mat-spinner 基本用法

HTML 中只需一行標籤即可顯示旋轉動畫：

```html
<mat-spinner></mat-spinner>
```

在 Module 或 Component 中匯入 `MatProgressSpinnerModule`：

```typescript
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// @NgModule 或 standalone component imports:
imports: [MatProgressSpinnerModule],
```

<!--
`mat-spinner` 的用法非常簡單，在 HTML 寫一行 `mat-spinner` 標籤，畫面上就會出現旋轉的動畫。

唯一要注意的，是在元件的 `imports` 加入 `MatProgressSpinnerModule`。漏掉的話，畫面上什麼都不會顯示，而且不一定會出現明顯的錯誤，很容易以為是其他地方寫錯了。

不過預設的位置不太理想，接下來我們處理定位的問題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# CSS 定位
## 置中顯示與全螢幕遮罩

<!--
動畫顯示出來了，接下來用 CSS 把它放到畫面正中央，並加上遮罩，阻擋使用者在載入期間操作。
-->

---

# CSS：Overlay 遮罩與置中

預設情況下 `mat-spinner` 會出現在頁面最下方，Loading 期間使用者也還能點擊其他元素。用全螢幕遮罩同時解決這兩個問題：

<div class="grid grid-cols-2 gap-4 my-3">
<div>

```html
<div class="overlay">
  <div class="spinner-box">
    <mat-spinner></mat-spinner>
  </div>
</div>
```

</div>
<div>

```css
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
}
```

</div>
</div>

`position: fixed` 搭配 `inset: 0` 鋪滿視窗，`display: flex` 將 Spinner 置中，`backdrop-filter` 產生模糊背景效果。

<!--
預設情況下，`mat-spinner` 會出現在頁面下方；而且載入期間，使用者還是可以點擊畫面上的其他按鈕，可能造成重複送出。這兩個問題可以用一個遮罩層一起解決。

`.overlay` 用 `position: fixed` 固定在視窗上，`inset: 0` 代表上下左右都是 0，所以會鋪滿整個畫面，使用者就點不到底下的元素了。

遮罩本身用 `display: flex`，水平和垂直都置中，裡面的動畫就會出現在畫面正中央。半透明背景和 `backdrop-filter` 讓畫面稍微變暗、變模糊，讓人更明確感覺到正在處理中。

`z-index` 設為 1000，是為了蓋過頁面上其他有設定層級的元素。
-->

---

# CSS：白色圓底

用外層 `.spinner-box` 加上白色圓底，確保 Spinner 在任何背景下都清楚可見：

```css
.spinner-box {
  display: flex;
  padding: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 不要直接在 <code>mat-spinner</code> 上加 <code>padding</code>。Spinner 內部的 SVG 尺寸固定，加了 <code>padding</code> 會讓圓弧偏移、被切掉。
</div>

<!--
接著幫動畫加上白色的圓形背景和陰影。這樣不管底下的頁面是什麼顏色，動畫都看得清楚。

要注意，白底和 `padding` 要加在外層的 `.spinner-box`，不要直接加在 `mat-spinner` 上。`mat-spinner` 內部的 SVG 尺寸是固定的，直接加 `padding` 會把圓弧往旁邊推，看起來就會歪掉、被切掉一塊。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# LoadingService
## 以 RxJS BehaviorSubject 集中管理狀態

<!--
外觀處理好了，接下來是核心的問題：怎麼集中管理載入動畫的顯示與隱藏。這裡直接沿用上一章的訂閱機制。
-->

---

# 建立 LoadingService

將 Loading 控制邏輯抽離至 Service，避免各頁面重複撰寫相同程式碼。

使用 Angular CLI 建立：

```bash
ng g s loading
```

產生 `loading.service.ts`，預設結構如下：

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {}
```

<!--
我們把載入的控制邏輯，抽到一個獨立的 Service，避免每個頁面重複寫一樣的程式。

用 `ng g s loading` 建立 `loading.service.ts`，CLI 會自動加上 `providedIn: 'root'`，整個應用程式共用同一個實例。之後如果要調整載入的行為，只要改這個 Service 就好。
-->

---

# LoadingService：BehaviorSubject 設計

使用 RxJS `BehaviorSubject` 儲存 Loading 狀態，並公開唯讀的 Observable 供外部訂閱：

```typescript
import { BehaviorSubject } from 'rxjs';

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
`LoadingService` 的結構，和上一章完全一樣。

`private` 的 `_loading$` 是 `BehaviorSubject`，負責存放狀態，初始值是 false，代表預設不顯示。公開的 `loading$` 用 `asObservable` 對外開放訂閱。`show` 和 `hide` 兩個方法，分別用 `next` 推送 true 和 false。

這裡用 `BehaviorSubject`，是因為載入狀態必須隨時都有一個值，畫面才知道現在該顯示還是隱藏。

注意這裡的命名跟上一章相反，底線開頭的是 `private` 的版本，沒有底線的是公開的版本。命名方式可以依團隊習慣，重點是要區分清楚。
-->

---

# BehaviorSubject 說明

| 屬性 / 方法 | 說明 |
| --- | --- |
| `new BehaviorSubject<boolean>(false)` | 建立可攜帶初始值的 Subject，初始值為 `false` |
| `_loading$` | 私有屬性，外部無法直接修改 |
| `asObservable()` | 回傳唯讀的 Observable，外部只能訂閱，不能呼叫 `next()` |
| `next(true)` | 觸發 `show()`，通知所有訂閱者狀態變為 `true` |
| `next(false)` | 觸發 `hide()`，通知所有訂閱者狀態變為 `false` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 外部元件應使用 <code>loading$</code>（Observable）而非 <code>_loading$</code>（BehaviorSubject）來訂閱，避免外部直接修改狀態。
</div>

<!--
這張表整理了 `LoadingService` 裡每個成員的角色。

`_loading$` 是資料本體，外部不能直接修改；`asObservable` 回傳唯讀的 Observable，外部只能訂閱；`show` 和 `hide` 是唯二能改變狀態的入口。

外部元件一律訂閱公開的 `loading$`。`_loading$` 是 `private` 的，外部本來就存取不到，這是刻意設計的保護。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# AppComponent 整合
## 將 Loading 放在應用程式根元件

<!--
Service 準備好了，接下來要決定載入動畫放在哪裡。答案是整個應用程式的根元件 `AppComponent`。
-->

---

# 將 Spinner 移至 AppComponent

把遮罩與 `<mat-spinner>` 移至 `app.component.html`，使所有頁面共用同一個 Loading 動畫，不必在每個頁面重複撰寫：

```html
<router-outlet></router-outlet>
<div class="overlay">
  <div class="spinner-box">
    <mat-spinner></mat-spinner>
  </div>
</div>
```

<!--
我們把遮罩和 `mat-spinner` 移到 `app.component.html`，放在 `router-outlet` 旁邊。

`AppComponent` 就像整棟大樓的大門，`router-outlet` 會依照路由顯示不同的頁面。把載入動畫放在這裡，不管使用者在哪個頁面，動畫都能顯示在最上層。

如果每個頁面各放一個，不但要重複寫，切換頁面時還可能同時出現兩個。
-->

---

# AppComponent：宣告 loading$ 並注入 Service

在 `app.component.ts` 中注入 `LoadingService`，並在 `ngOnInit` 取得 `loading$` 參照：

```typescript
loading$!: any;

private loadingService = inject(LoadingService);

ngOnInit(): void {
  this.loading$ = this.loadingService.loading$;
}
```

`loading$` 指向 Service 的公開 Observable，不可直接指向私有的 `_loading$`。

<!--
在 `app.component.ts` 裡，先用 `inject` 注入 `LoadingService`，再到 `ngOnInit`，把 Service 公開的 `loading$` 指定給元件自己的 `loading$`。

可以想成把 Service 的水管接到自己家裡，接好之後，就能在模板裡用 `async` pipe 接收資料。

這裡一定要接公開的 `loading$`，而不是 `private` 的 `_loading$`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# async Pipe
## 在 Template 中訂閱 Observable

<!--
拿到 Observable 之後，可以手動 `subscribe`，但 Angular 提供了更簡潔的方式：`async` pipe。
-->

---

# async Pipe：搭配 @if 控制顯示

在 `app.component.html` 以 `@if` 包裹遮罩與 Spinner，使用 `async` pipe 自動訂閱 Observable：

```html
@if (loading$ | async) {
  <div class="overlay">
    <div class="spinner-box">
      <mat-spinner></mat-spinner>
    </div>
  </div>
}
```

需在元件的 `imports` 陣列中加入 `CommonModule`：

```typescript
import { CommonModule } from '@angular/common';
imports: [CommonModule],
```

<!--
在 `app.component.html`，用 `@if` 包住遮罩和動畫，條件寫成 `loading$`、直線符號、`async`。

`async` pipe 會自動訂閱 `loading$`，把每次收到的最新值交給 `@if` 判斷。值是 true，就顯示遮罩和動畫；是 false，就隱藏。

`async` pipe 屬於 `CommonModule`，所以要在元件的 `imports` 加入 `CommonModule`。
-->

---

# async Pipe 說明

`async` pipe 用於在 Template 中訂閱 `Observable` 或 `Promise`：

- 當 `show()` 呼叫 `_loading$.next(true)` 時，`async` 收到新值 `true`，`@if` 條件成立，Spinner 顯示
- 當 `hide()` 呼叫 `_loading$.next(false)` 時，`async` 收到 `false`，Spinner 隱藏
- 元件銷毀時，`async` 自動取消訂閱，無需手動 `unsubscribe()`

<!--
我們把 `async` pipe 的運作流程串起來。

某個地方呼叫 `show`，`_loading$` 推送 true，`async` 收到新值，`@if` 條件成立，動畫就顯示出來。呼叫 `hide` 則推送 false，動畫隱藏。

`async` pipe 還有一個好處：元件銷毀時，它會自動取消訂閱。如果是手動 `subscribe`，就要記得在 `ngOnDestroy` 取消，否則可能造成記憶體洩漏。所以在模板裡，通常優先使用 `async` pipe。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 在各頁面觸發 Loading
## 呼叫 show() 與 hide()

<!--
顯示的機制都接好了，最後一步是在需要載入動畫的頁面，實際呼叫 `show` 和 `hide`。
-->

---

# 在頁面元件中觸發 LoadingService

於需要顯示 Loading 的元件中，透過 `inject()` 注入 `LoadingService`，並在適當時機呼叫：

```typescript
private loadingService = inject(LoadingService);

ngOnInit(): void {
  this.loadingService.show();
  // 在 API 回傳後呼叫 hide()
}
```

呼叫 `show()` 後，`BehaviorSubject` 發出 `true`，`AppComponent` 的 `async` pipe 收到通知，Loading 動畫立即顯示。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 使用 Service 前必須在元件中以 <code>inject()</code> 注入，Angular 才能提供依賴注入的實例。
</div>

<!--
在頁面元件用 `inject` 注入 `LoadingService`，在需要的時候呼叫 `show`，資料回來之後再呼叫 `hide`。

`show` 和 `hide` 通常是成對出現的：`show` 放在發送請求之前，`hide` 放在拿到回應之後。

要特別注意，如果 API 失敗，也要記得呼叫 `hide`，否則動畫會一直卡著不消失，使用者會以為畫面當掉了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# HttpInterceptor
## 自動觸發 Loading，不用每個元件手動呼叫

<!--
手動呼叫容易漏掉 `hide`，也可能遇到 NG0100 錯誤。接下來改用 HttpInterceptor 自動處理。
-->

---

# HttpInterceptor 是什麼？

`HttpInterceptor` 是 Angular `HttpClient` 提供的攔截機制，**作用在每一次 HTTP 請求送出、以及回應送達的中間點**，可以在真正發出請求前、拿到回應後統一插入邏輯。

<div class="grid grid-cols-1 gap-2 my-3">
<div>

```
元件呼叫 http.get() / post() / ...
        ↓
   ① Interceptor（請求送出前）
        ↓
      實際發送到後端
        ↓
   ② Interceptor（回應送達後，不論成功或失敗）
        ↓
元件的 subscribe() 收到結果
```

</div>
</div>

**運作時機**：只要是透過 Angular 的 `HttpClient` 送出的請求（`get`、`post`、`put`、`delete`...），**每一次**都會自動經過已註冊的攔截器，不需要在呼叫端額外加任何程式碼。

<!--
HttpInterceptor 是 `HttpClient` 提供的攔截機制，作用在每一次 HTTP 請求送出前，以及回應回來之後。

看流程圖：元件呼叫 `http.get`，請求會先經過攔截器，才真正送到後端；回應回來時，不論成功或失敗，也會先經過攔截器，才交給元件的 `subscribe`。

可以把它想成機場的安檢，不管搭哪一班飛機，出境和入境都要經過。所以它很適合處理「全站每個請求都要做的事」，例如載入動畫、加上驗證資訊、統一處理錯誤。

只要註冊了，每一個透過 `HttpClient` 送出的請求都會經過它，不用在呼叫的地方加任何程式。
-->

---

# 為什麼改用 Interceptor？

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**手動呼叫 show() / hide() 的問題**
- 每個元件都要自己寫一次
- 容易忘記在 `error` 分支呼叫 `hide()`
- `show()` 若在子元件 `ngOnInit` 同步觸發，恰逢根元件樣板已檢查過 `loading$`，可能出現 `NG0100`

</div>
<div>

**改用 HttpInterceptor 後**
- 所有 HTTP 請求統一由攔截器控制顯示/隱藏
- 用 `finalize()` 確保成功、失敗都會 `hide()`
- `show()` 由 HTTP 請求觸發，不受元件生命週期時機影響

</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>NG0100 小提醒：</b> 元件的 <code>ngOnInit</code> 若同步呼叫 <code>loadingService.show()</code>，而根元件樣板已經在同一輪變更偵測讀過 <code>loading$</code>，兩者時序衝突就會噴出 <code>ExpressionChangedAfterItHasBeenCheckedError</code>。改用 Interceptor 可以直接避開這個時機問題。
</div>

<!--
我們比較一下兩種做法。

手動呼叫的話，每個元件都要自己寫一次，很容易忘記在錯誤時呼叫 `hide`。另外，如果 `show` 在子元件的 `ngOnInit` 裡同步執行，而根元件的模板在同一輪檢查中已經讀過 `loading$`，就會出現 NG0100 錯誤，意思是「值在檢查之後又被改變了」。

改用 HttpInterceptor 之後，所有請求統一由攔截器控制，用 `finalize` 確保不論成功或失敗都會呼叫 `hide`，元件本身完全不用管載入動畫。
-->

---

# 建立 loading.interceptor.ts（一）

使用 Angular CLI 建立函式型攔截器，並指定放進 `@interceptors/` 資料夾（跟 `@service/` 集中管理 Service 是同樣的慣例）：

```bash
ng g interceptor @interceptors/loading
```

```
app/
├── @service/
│   └── loading.service.ts
└── @interceptors/
    └── loading.interceptor.ts
```

<!--
先用 CLI 建立攔截器：`ng g interceptor @interceptors/loading`。

檔案會建立在 `@interceptors` 資料夾裡，跟把 Service 集中放在 `@service` 是同樣的慣例。同類型的檔案放在同一個資料夾，之後比較好找。
-->

---
layout: default
---

# 建立 loading.interceptor.ts（二）

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../@service/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // 排到下一個 macrotask 再執行，避免 NG0100（詳見下一頁）
  setTimeout(() => loadingService.show());

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

<!--
這是攔截器的程式碼。

`loadingInterceptor` 是一個函式，接收 `req`，也就是請求本身，以及 `next`，用來把請求繼續往下傳。函式裡先用 `inject` 取得 `LoadingService`，接著呼叫 `show`。然後呼叫 `next(req)` 把請求送出去，並用 `pipe` 接上 `finalize`。

`finalize` 是 RxJS 的運算子，不論 Observable 最後是成功還是失敗，裡面的程式都保證會執行一次，所以用來呼叫 `hide` 最適合。

注意 `show` 外面特地包了一層 `setTimeout`，原因在下一頁說明。
-->

---

# 為什麼 show() 要包一層 setTimeout？

**問題根源**：`AppComponent` 的樣板檢查完 `loading$` 之後，`Async` 元件的 `ngOnInit` 才在**同一輪**變更偵測裡呼叫 `show()`，導致值「檢查完又變了」。

```
NG0100: ExpressionChangedAfterItHasBeenCheckedError
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
📸 <b>類比：</b>拍團體照喊「三、二、一」按下快門的瞬間，有人突然舉手比 YA——這張照片就跟拍攝當下的畫面對不上。Angular 的變更偵測也是同樣道理：這一輪「拍照」（檢查畫面）進行到一半，資料卻被改了。
</div>

```typescript
setTimeout(() => loadingService.show());
```

**效果**：`show()` 延後到下一輪才執行，不會插隊進正在進行的這輪檢查。

<!--
為什麼 `show` 要包一層 `setTimeout`？

問題的根源是：根元件的模板已經檢查過 `loading$`，子元件才在同一輪檢查裡呼叫 `show`，造成值「檢查完又變了」，於是出現 NG0100 錯誤。

可以想成拍團體照，按下快門的瞬間，有人突然舉手比 YA，照片就跟拍攝當下對不上。Angular 發現這一輪檢查進行到一半，資料卻被改了，就會報錯。

`setTimeout` 讓 `show` 延後到下一輪才執行，不會插進正在進行的這一輪檢查。要注意，真正解決 NG0100 的是 `setTimeout`，不是攔截器本身。
-->


---

# 註冊 Interceptor — app.config.ts

透過 `provideHttpClient(withInterceptors([...]))` 註冊攔截器：

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './@interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([loadingInterceptor])),
    // 其他 providers...
  ]
};
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 註冊之後，所有透過 <code>HttpClient</code> 送出的請求都會自動觸發這個攔截器，不需要在每個元件裡再呼叫 <code>show()</code> / <code>hide()</code>。
</div>

<!--
攔截器寫好之後，要註冊才會生效。

在 `app.config.ts` 的 `providers` 裡，呼叫 `provideHttpClient`，並傳入 `withInterceptors`，裡面放 `loadingInterceptor`。

註冊之後，專案裡任何一個 `http.get` 或 `post`，都會自動先顯示載入動畫，請求結束時自動隱藏，元件的程式碼可以變得很乾淨。
-->

---

# 手動呼叫 vs. HttpInterceptor

| | 手動呼叫 show()/hide() | HttpInterceptor |
| --- | --- | --- |
| 撰寫位置 | 每個需要的元件各自呼叫 | 攔截器統一處理，寫一次全站生效 |
| 忘記 hide() 的風險 | 容易發生（尤其 error 分支） | 不會，`finalize()` 保證執行 |
| NG0100 風險 | 有可能（元件生命週期時機衝突） | 仍可能發生，需搭配 `setTimeout` 延後 `show()` 才能避開 |
| 彈性 | 可針對單一請求客製顯示邏輯 | 全域一致，特殊需求需額外處理 |

<!--
這張表比較兩種做法。

手動呼叫的優點是彈性高，可以針對個別請求決定要不要顯示；缺點是每個元件都要寫，容易漏掉 `hide`。HttpInterceptor 寫一次全站生效，`finalize` 保證會隱藏，但特殊需求需要額外處理，例如背景定時查詢的請求不想顯示動畫。

再次澄清，NG0100 的風險兩種做法都有，真正避開它的是 `setTimeout`。攔截器的好處是這個處理只要寫一次，全站都受益。實務上大多數專案會優先選擇攔截器。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 客製化 Spinner
## 調整顏色與大小

<!--
功能都完成了，最後看看怎麼調整動畫的外觀，讓它符合專案的風格。
-->

---

# 客製化：顏色與大小

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>寫在哪個檔案？</b> 因為 <code>&lt;mat-spinner&gt;</code> 只存在於根元件的樣板（<code>app.component.html</code>），這兩段設定都要寫在 <b>AppComponent</b> 這一組檔案裡，不是隨便找個元件加。
</div>

**顏色**：寫在 `app.component.scss`，透過 CSS 自訂屬性覆寫 Material Design token：

```css
/* app.component.scss */
.mat-mdc-progress-spinner {
  --mdc-circular-progress-active-indicator-color: #3f51b5;
}
```

**大小**：寫在 `app.component.html`，在 `<mat-spinner>` 標籤上使用 `[diameter]` 屬性（單位：px）：

```html
<!-- app.component.html -->
<mat-spinner [diameter]="70"></mat-spinner>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對比度提醒：</b> Spinner 顏色要跟襯底（前面加的白色圓形底盤）有足夠對比，例如白底配白色 Spinner 會完全看不見。選色前先確認跟 <code>.spinner-box</code> 的 <code>background</code> 顏色是否撞色。
</div>

<!--
因為 `mat-spinner` 只放在根元件裡，所以這兩項設定都寫在 `AppComponent` 的檔案中。

顏色寫在 `app.component.scss`。Angular Material 的樣式是用 CSS 變數控制的，所以只要覆寫轉圈顏色的那個變數就好，這裡設定成深藍色。

大小寫在 `app.component.html`，在 `mat-spinner` 上用中括號 `diameter` 綁定數字，單位是像素。注意要用中括號，否則會被當成文字。

選顏色時要注意對比。動畫底下有白色的圓形背景，如果顏色也選白色或太淺，就會完全看不見。
-->

---

# 完整架構總覽

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**LoadingService（核心）**
- `_loading$`：私有 BehaviorSubject
- `loading$`：公開 Observable
- `show()` / `hide()`：狀態控制

**AppComponent（根元件）**
- 注入 `LoadingService`
- 訂閱 `loading$`
- Template 以 `async` + `@if` 控制顯示
- `mat-spinner` 的顏色（`.scss`）、大小（`[diameter]`）都設定在這裡

</div>
<div>

**loadingInterceptor（自動觸發）**
- 註冊在 `app.config.ts` 的 `provideHttpClient(withInterceptors([...]))`
- 請求送出前：`loadingService.show()`
- `finalize()`：不管成功失敗都 `hide()`
- 各功能頁面元件**不需要**注入 `LoadingService`

**CSS 關鍵設定**
- `.overlay`：全螢幕遮罩，用 `flex` 置中 Spinner
- `.spinner-box`：白色圓底
- `mat-spinner` 本身不加 `padding`

</div>
</div>

<!--
我們把整個架構複習一遍。

`LoadingService` 是核心：`private` 的 `_loading$` 存放狀態，公開的 `loading$` 給外部訂閱，`show` 和 `hide` 控制狀態。

`AppComponent` 是根元件：注入 Service、取得 `loading$`，在模板用 `async` 搭配 `@if` 控制顯示，動畫的顏色和大小也設定在這裡。

`loadingInterceptor` 負責自動觸發：註冊在 `app.config.ts`，請求送出前 `show`，用 `finalize` 保證 `hide`，各頁面元件不需要注入 `LoadingService`。

CSS 方面，遮罩鋪滿全螢幕，並用 `flex` 把動畫置中；白色圓底加在外層的 `.spinner-box`，不要直接加在 `mat-spinner` 上。
-->

---
layout: default
---

# 完整程式碼統整 — loading.service.ts

前面分段介紹的 `LoadingService`，完整內容如下：

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading$ = new BehaviorSubject<boolean>(false);
  // 對外公開的唯讀 Observable
  loading$ = this._loading$.asObservable();

  show(): void {
    this._loading$.next(true);
  }
  hide(): void {
    this._loading$.next(false);
  }
}
```

<!--
接下來幾頁，把分段介紹的程式碼完整整理出來，方便對照。

這是 `LoadingService` 的完整內容：`private` 的 `_loading$`、公開的 `loading$`，以及 `show` 和 `hide` 兩個方法。這個檔案是整套載入機制的核心。
-->

---
layout: default
---

# 完整程式碼統整 — app.component.ts

`AppComponent` 注入 `LoadingService`，取得 `loading$` 供樣板訂閱。先看匯入與裝飾器：

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { LoadingService } from './@service/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
```

<!--
這是 `AppComponent` 的匯入和裝飾器。

`imports` 陣列要放三個：`CommonModule` 提供 `async` pipe，`RouterOutlet` 顯示路由內容，`MatProgressSpinnerModule` 提供 `mat-spinner`。
-->

---
layout: default
---

# 完整程式碼統整 — app.component.ts（二）

接續上一頁的 class，注入 `LoadingService` 並取得 `loading$`：

```typescript
  loading$!: Observable<boolean>;

  private loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$;
  }
}
```

<!--
接著是 `AppComponent` 的 class 內容。

`loading$` 的型別是 `Observable` 加上布林。用 `inject` 注入 `LoadingService`，`ngOnInit` 裡把 Service 的 `loading$` 指定給元件自己的屬性，準備給模板使用。
-->

---
layout: default
---

# 完整程式碼統整 — app.component.html

```html
<!-- app.component.html -->
<router-outlet></router-outlet>

@if (loading$ | async) {
  <div class="overlay">
    <div class="spinner-box">
      <mat-spinner [diameter]="70"></mat-spinner>
    </div>
  </div>
}
```

<!--
這是 `app.component.html`，只有短短幾行。

`router-outlet` 顯示各頁面的內容。下方的 `@if` 用 `async` 訂閱 `loading$`，依照最新的值決定要不要顯示遮罩和動畫，動畫的大小設為 70 像素。
-->

---
layout: default
---

# 完整程式碼統整 — app.component.scss（一）

```scss
// app.component.scss
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
}
```

<!--
這是 `app.component.scss` 的第一部分，也就是遮罩。

`position: fixed` 搭配 `inset: 0` 鋪滿全螢幕，`display: flex` 把裡面的動畫置中，再加上半透明和模糊的背景效果。
-->

---
layout: default
---

# 完整程式碼統整 — app.component.scss（二）

```scss
.spinner-box {
  display: flex;
  padding: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.mat-mdc-progress-spinner {
  --mdc-circular-progress-active-indicator-color: #3f51b5;
}
```

<!--
這是 SCSS 的第二部分。

`.spinner-box` 是動畫外層的白色圓底，加上陰影後，在模糊的背景上也看得清楚。最後覆寫 Material 的 CSS 變數，把轉圈的顏色改成深藍色，和白色背景形成對比。
-->

---
layout: default
---

# 完整程式碼統整 — loading.interceptor.ts

前面「在各頁面觸發 Loading」示範的是手動呼叫 `show()`/`hide()` 的寫法；實務上建議改用 Interceptor 統一處理，以下是最終採用的完整程式碼：

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../@service/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // 排到下一個 macrotask 再執行，避開 NG0100
  setTimeout(() => loadingService.show());

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

<!--
這是攔截器的完整程式碼。

用 `inject` 取得 `LoadingService`；`show` 包在 `setTimeout` 裡，延到下一輪才執行，避開 NG0100；`finalize` 確保請求結束時一定會呼叫 `hide`。`hide` 不需要包 `setTimeout`，因為它本來就是等 HTTP 回應之後才觸發的。

前面在頁面裡手動呼叫的寫法，主要是幫助理解；實務上建議用這個攔截器統一處理。
-->

---
layout: default
---

# 完整程式碼統整 — app.config.ts

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './@interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([loadingInterceptor])),
  ]
};
```

<!--
這是 `app.config.ts`。

用 `provideHttpClient`，搭配 `withInterceptors` 註冊 `loadingInterceptor`。註冊之後，所有透過 `HttpClient` 送出的請求，都會自動觸發載入動畫。
-->

---
zoom: 0.95
layout: default
---

# 完整程式碼統整 — 頁面實際使用範例

註冊 Interceptor 後，頁面元件完全不需要注入 `LoadingService`：

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<any[]>('/api/products').subscribe({
      next: (res) => {
        this.products = res;
      },
    });
  }
}
```

<!--
最後看一個實際的頁面元件。

註冊攔截器之後，這個商品列表元件完全不需要注入 `LoadingService`，也不用寫 `show`、`hide` 或錯誤時的收尾。它只要用 `HttpClient` 呼叫 API，載入動畫的顯示和隱藏就全部交給攔截器處理。

跟前面手動呼叫的版本比較，程式碼單純很多，這也是大型專案普遍採用攔截器的原因。
-->

---
layout: end
---

# 課程結束

### Loading 動畫透過 mat-spinner + LoadingService + async pipe 三者協作，實現全域統一的載入狀態管理

<!--
這一章我們做出了一套全站共用的載入動畫。`mat-spinner` 提供動畫，CSS 把它置中並加上遮罩。`LoadingService` 用 `BehaviorSubject` 集中管理狀態，`AppComponent` 用 `async` pipe 搭配 `@if` 控制顯示。最後用 HttpInterceptor 自動觸發 `show` 和 `hide`，`finalize` 保證一定會隱藏，`setTimeout` 則避開 NG0100 錯誤。

下一章，我們會學習 Angular 較新的狀態管理方式：Signals。我們下一章見。
-->

