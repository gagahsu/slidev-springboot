---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 訂閱
routeAlias: ch45
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
    訂閱
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「以 RxJS Subject 實現跨元件的即時資料同步」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們認識了 RxJS 的 Observable、運算子和 Subject。這一章，我們要把 Subject 實際用在 Angular 裡，自己建立一個可以被訂閱的資料來源，讓不同元件共享同一份狀態。

想像 Service 裡的資料改變了，但畫面上另一個元件完全不知道，還在顯示舊資料。這一章要解決的，就是讓多個元件即時同步同一份資料。
-->

---
layout: default
---

# Outline

- **訂閱是什麼** — Observable 與 Subject 的核心概念
- **為什麼要用訂閱** — 解決 ngOnInit 無法即時感知資料變更的問題
- **訂閱的三種類型** — Subject、BehaviorSubject、ReplaySubject 比較
- **建立 Service 檔案** — 將訂閱邏輯集中於獨立的 Service
- **宣告 Subject 變數** — 以 private 宣告可被訂閱的資料來源
- **公開 Observable** — 以 asObservable() 對外暴露可觀察物件
- **撰寫 next 方法** — 透過 next() 更新訂閱內容
- **如何訂閱** — 在元件中注入 Service 並呼叫 subscribe()

<!--
這一章會先說明什麼是訂閱、為什麼需要它，以及三種 Subject 的差別。接著實際動手：建立一個 Service，在裡面宣告 Subject、用 `asObservable` 對外公開、撰寫用 `next` 更新資料的方法。最後回到元件裡呼叫 `subscribe`，並做一個購物車數量同步的練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 訂閱是什麼？
# What is a Subscription?

<!--
訂閱頻道之後，有新影片就會收到通知。RxJS 的訂閱也是一樣，只是頻道換成了資料來源。
-->

---

# 訂閱是什麼？

訂閱（Subscription）是 RxJS 的核心機制，讓程式可以**監聽資料來源的變化**，並在資料更新時自動執行對應邏輯。

以影音平台為例：

- **未訂閱**：頻道更新再多內容，使用者都不會收到任何通知。
- **已訂閱**：頻道一有新內容，訂閱者立即收到推播通知。

| | 未訂閱 | 已訂閱 |
|---|---|---|
| 頻道有更新時 | 不會收到通知 | 立即收到推播通知 |
| Angular 元件角度 | `ngOnInit` 只讀取一次，資料更新後無感知 | 資料一變更，訂閱回呼自動觸發 |

<!--
訂閱，英文是 Subscription，是 RxJS 的核心機制。它讓程式可以「監聽資料來源的變化，並在資料更新時自動執行對應的邏輯」。

延續頻道的比喻：沒有訂閱，頻道更新再多內容，我們都不會知道；訂閱之後，一有新內容就會收到通知。

放到 Angular 來看，`ngOnInit` 就像自己主動去看一次頻道，只看得到當下的內容；訂閱之後，資料一改變，回呼函式就會自動觸發。只要是「一個地方改資料、好幾個地方要同步顯示」的情況，幾乎都會用到訂閱。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 為什麼要用訂閱？
# Why Use Subscription?

<!--
接下來我們具體看看，沒有訂閱的時候，元件會遇到什麼問題。
-->

---

# 為什麼要用訂閱？

在頁面切換時，通常會透過 Service 傳遞資料，並在 `ngOnInit` 中讀取。然而 `ngOnInit` **只會在元件初始化時執行一次**，當 Service 中的資料再次更新，元件無法感知，畫面不會自動反映最新內容。

使用訂閱後，只要 Service 中被訂閱的資料有所變更，所有訂閱者都能即時收到更新，無需手動觸發。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**不使用訂閱**
- 在 `ngOnInit` 中主動拉取一次
- 資料更新後必須手動重新讀取
- 需額外按鈕或事件觸發

</div>
<div>

**使用訂閱**
- 元件自動監聽資料流
- 資料一變更，畫面立即更新
- 無需額外觸發機制

</div>
</div>

<!--
在頁面之間傳資料時，我們通常會用 Service，並在 `ngOnInit` 讀取資料。但 `ngOnInit` 只會在元件初始化時執行一次。之後 Service 裡的資料再改變，元件不會知道，畫面就一直停在舊的資料。

可以想成開店前看一次進貨單，就只看那一次。訂閱則像是請廠商之後每次補貨都主動通知，貨一到馬上就知道。

看下方的比較，不用訂閱的話，資料更新後要手動重新讀取，還需要額外的按鈕或事件觸發。使用訂閱之後，元件會自動監聽，資料一變，畫面就立刻更新。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 訂閱的三種類型
# Three Types of Subject

<!--
了解訂閱的觀念之後，我們複習一下上一章看過的幾種 Subject，這次從實際使用的角度來比較。
-->

---

# 訂閱的三種類型

RxJS 提供三種常見的 Subject，依使用情境選擇：

| 類型 | 說明 |
|------|------|
| `Subject` | 最基本的訂閱，無初始值，訂閱後只接收後續推送的資料 |
| `BehaviorSubject` | 需設定初始值，訂閱時立即取得最新一筆資料 |
| `ReplaySubject` | 訂閱時可重新接收最後 N 筆歷史資料 |

本章重點介紹 **Subject** 與 **BehaviorSubject**，這兩種是實務中最常使用的類型。

<!--
RxJS 提供三種常見的 Subject，可以用加入群組聊天來理解它們的差別。

`Subject` 最基本，沒有初始值，就像加入群組後，只看得到加入之後的訊息。`BehaviorSubject` 需要設定初始值，訂閱的當下會立刻拿到最新的一筆資料，就像加入群組時，管理員先告訴你目前的狀態。`ReplaySubject` 則會把最後幾筆歷史資料重新播放給新的訂閱者。

實務上最常用的是 `Subject` 和 `BehaviorSubject`。尤其 `BehaviorSubject` 一定有值，很適合管理載入狀態這類隨時都需要有一個值的情況。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 建立 Service 檔案
# Create a Dedicated Service

<!--
接下來開始動手。第一步，把訂閱的邏輯集中放在一個獨立的 Service 裡。
-->

---

# 建立 Service 檔案

建議為每個訂閱功能建立獨立的 Service 檔案，名稱以功能命名。例如要管理載入狀態，可在 `@service/` 資料夾下建立 `loading.service.ts`。

```
app/
└── @service/
    └── loading.service.ts
```

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor() { }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>慣例：</b> 一個訂閱功能對應一個 Service 檔案，集中管理該功能的變數、方法與訂閱內容。
</div>

<!--
建議每個訂閱功能都建立一個獨立的 Service，用功能來命名。例如要管理載入狀態，就在 `@service` 資料夾下建立 `loading.service.ts`。

這裡先建立基本的結構：加上 `@Injectable`，`providedIn: 'root'`，讓這個 Service 在整個應用程式裡共用。等一下會陸續加入 Subject、公開的 Observable，以及 show 和 hide 方法。

一個訂閱功能對應一個 Service，不要把不相關的功能都塞在同一個 Service 裡，否則之後很難維護。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 宣告 Subject 變數
# Declare Subject Variables

<!--
Service 的骨架有了，接下來放進真正負責存放資料的 Subject。
-->

---

# 宣告 Subject 變數

在 Service 中新增 `private` 的 Subject 變數作為資料來源。以 `private` 修飾，確保資料只能在 Service 內部透過 `next()` 修改，外部無法直接變更。

```typescript
import { BehaviorSubject, Subject } from 'rxjs';

export class LoadingService {

  // BehaviorSubject：需設定初始值
  private loading$ = new BehaviorSubject<boolean>(false);

  // Subject：不需要初始值
  private loading2$ = new Subject<boolean>();

}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 變數加上 <code>private</code> 是為了將修改權限限制在 Service 內部，外部元件只能透過公開的 Observable 觀察，不能直接呼叫 <code>next()</code>。
</div>

<!--
在 Service 裡，從 rxjs 引入 `BehaviorSubject` 和 `Subject`，各宣告一個變數。`BehaviorSubject` 一定要給初始值，這裡是 false；`Subject` 則不需要。

關鍵是變數前面的 `private`。它就像把資料放進員工專用的倉庫，只有 Service 內部的方法可以改動，外部元件不能直接碰。

如果忘了加 `private`，外部元件就能直接修改資料，資料就不再是集中管理，之後出問題時，很難知道到底是誰改了這個值。
-->

---

# Subject 變數命名慣例 — `$` 字尾

```typescript
private loading$ = new BehaviorSubject<boolean>(false);
```

變數字尾加 `$`（如 `loading$`）是 RxJS 社群慣例，稱為 **Finnish notation**。

| | `loading` | `loading$` |
| --- | --- | --- |
| 型別 | `boolean` | `BehaviorSubject<boolean>` |
| 取值方式 | 直接使用 | 需 `.subscribe()` 接收 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提醒：</b> 純命名習慣，非 TypeScript / Angular 語法規定，不加 <code>$</code> 功能相同，但可讀性較差，業界普遍遵守。
</div>

<!--
你可能注意到，變數名稱後面都加了一個錢字號，例如 `loading$`。這是 RxJS 社群的命名慣例。

看到錢字號結尾，就知道這是 Observable 或 Subject，要用 `subscribe` 才能拿到裡面的值，不能像一般變數直接使用。看表格，`loading` 是布林值本身，`loading$` 則是一個 `BehaviorSubject`。

這只是命名習慣，不加也能執行，但加上之後可讀性更好，業界普遍都會遵守。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 公開 Observable
# Expose as Observable

<!--
資料來源設成 `private` 之後，外部完全看不到也不行，所以我們要開一個讓外部觀察的窗口。
-->

---

# 公開 Observable

`private` 的 Subject 無法被外部元件直接訂閱，需再宣告對應的公開變數，呼叫 `asObservable()` 將其轉為只可觀察（不可修改）的 Observable。

```typescript
export class LoadingService {

  private loading$ = new BehaviorSubject<boolean>(false);
  private loading2$ = new Subject<boolean>();

  // 取得 loading$ 的可觀察物件（供外部訂閱使用）
  _loading$ = this.loading$.asObservable();

  // 取得 loading2$ 的可觀察物件
  _loading2$ = this.loading2$.asObservable();

}
```

外部元件透過 `_loading$` 訂閱資料，但無法呼叫 `next()` 修改內容，達到資料封裝的目的。

<!--
`private` 的 Subject 不能被外部直接訂閱，所以我們再宣告一個公開的變數 `_loading$`，呼叫 `asObservable()`，把 Subject 轉成一個只能觀察、不能修改的 Observable。

可以把它想成一面單向玻璃：外部元件可以透過它看到資料的變化，但沒辦法伸手進去改，因為 Observable 沒有 `next` 方法。

這裡用底線開頭的 `_loading$`，代表公開給外部訂閱用的版本，要和 `private` 的 `loading$` 區分清楚。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 撰寫 next 方法
# Update via next()

<!--
外部可以觀察資料了，接下來要寫負責更新資料的方法。
-->

---

# 撰寫 next 方法

在 Service 中撰寫公開方法，內部呼叫 `next()` 更新 Subject 的值。外部元件統一透過這些方法修改訂閱內容，不直接操作 Subject。

```typescript
export class LoadingService {

  private loading$ = new BehaviorSubject<boolean>(false);
  _loading$ = this.loading$.asObservable();

  // 顯示 loading
  show() {
    this.loading$.next(true);
  }

  // 隱藏 loading
  hide() {
    this.loading$.next(false);
  }

}
```

<!--
在 Service 裡寫兩個公開的方法：`show` 和 `hide`。

方法裡面很單純，就是呼叫 `next`，把新的值推送出去。`show` 推送 true，`hide` 推送 false。推送的那一刻，所有訂閱這個資料的地方，都會同時收到最新的值。

外部元件統一透過這兩個方法來修改資料，而不是直接操作 Subject。這樣之後如果想在修改資料時多做一些處理，例如記錄 log，只要改這兩個方法就好。
-->

---

# 撰寫 next 方法 — 注意事項

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 修改訂閱內容只能使用 <code>next()</code>，且必須呼叫 <code>private</code> 的原始 Subject（<code>loading$</code>），而非公開的 <code>_loading$</code>，因為 Observable 不具備 <code>next()</code> 方法。
</div>

| 變數 | 型別 | 可呼叫 `next()` | 說明 |
|---|---|---|---|
| `loading$` | `BehaviorSubject` | ✅ | Service 內部使用，負責推送資料 |
| `_loading$` | `Observable` | ❌ | 對外公開，僅供訂閱觀察 |

<!--
這頁整理一個容易搞混的地方。

能呼叫 `next` 修改資料的，只有 `private` 的原始 Subject，也就是 `loading$`。公開的 `_loading$` 是 Observable，本身就沒有 `next` 方法。

常見的錯誤是在 Service 裡寫成 `this._loading$.next`，結果編譯時出現找不到 `next` 的錯誤。看到這個錯誤，第一件事就是檢查是不是呼叫錯了變數。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 如何訂閱？
# How to Subscribe?

<!--
Service 這邊都準備好了，接下來換到元件，看看怎麼訂閱這個資料來源。
-->

---

# 如何訂閱？（一）— 注入 Service

在目標元件用 `inject()` 注入 `LoadingService`，使元件得以存取 Service 中的訂閱變數與方法。

```typescript
// app.component.ts
import { Component, inject } from '@angular/core';
import { LoadingService } from '../@service/loading.service';

@Component({
  selector: 'app-root',
  ...
})
export class AppComponent {

  private loadingService = inject(LoadingService);

}
```

<!--
第一步，在元件用 `inject` 注入 `LoadingService`，Angular 會自動準備好這個 Service 的實例。

可以想成先辦一張圖書館的借閱證，有了證件，才能接著去借書。

要注意，這一步只是取得 Service，還沒有開始訂閱，訂閱的動作放在下一頁的 `ngOnInit` 裡。
-->

---

# 如何訂閱？（二）— 呼叫 subscribe

在 `ngOnInit` 中訂閱 `_loading$`，元件初始化後即開始監聽。當 Service 呼叫 `next()` 推送新值，`subscribe` 的回呼函式會自動執行，`res` 為收到的最新資料。

```typescript
ngOnInit(): void {
  this.loadingService._loading$.subscribe((res) => {
    console.log('loading$:', res);
  });
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> <code>subscribe()</code> 的回呼參數（此處為 <code>res</code>）可自行命名，代表每次推送的訂閱內容。訂閱通常寫在 <code>ngOnInit</code> 中，確保元件載入後即開始監聽。
</div>

<!--
第二步，在 `ngOnInit` 裡訂閱公開的 `_loading$`。

傳進 `subscribe` 的函式，就是每次資料更新時會自動執行的邏輯。這裡的 `res` 代表 Service 用 `next` 推送過來的最新值，名稱可以自己取，例如取名叫 `isLoading` 會更有意義。

執行之後，只要 Service 呼叫一次 `show` 或 `hide`，這裡的 `console.log` 就會馬上印出對應的值，不需要手動再去讀取資料。

訂閱通常寫在 `ngOnInit`，而不是 `constructor`，因為 `constructor` 執行時元件還沒初始化，不建議放邏輯。
-->

---

# 完整流程回顧

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**loading.service.ts**

1. 宣告 `private` Subject 作為資料來源
2. 以 `asObservable()` 對外公開 Observable
3. 提供 `show()` / `hide()` 方法，透過 `next()` 更新值

</div>
<div>

**app.component.ts**

1. 用 `inject()` 注入 `LoadingService`
2. 在 `ngOnInit` 訂閱 `_loading$`
3. 訂閱回呼中取得最新值並更新畫面

</div>
</div>


<!--
我們把整個流程串起來複習一次。

Service 這邊做三件事：用 `private` 宣告 Subject 作為資料來源；用 `asObservable` 對外公開一個唯讀的 Observable；提供 `show` 和 `hide` 方法，透過 `next` 更新資料。

元件這邊也做三件事：用 `inject` 注入 Service；在 `ngOnInit` 訂閱公開的 Observable；在訂閱的回呼裡取得最新值，更新畫面。

這套模式非常通用，不只是載入狀態，任何需要多處同步的資料都可以套用。
-->

---
layout: default
---

# 練習：購物車數量徽章同步
### 情境說明

電商網站常見情境：使用者在商品列表頁按下「加入購物車」，畫面上方導覽列的購物車徽章數字要**立即**同步更新，不需重新整理頁面。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**ProductListComponent**
- 顯示商品清單
- 按下「加入購物車」按鈕

</div>
<div>

**HeaderComponent**
- 顯示購物車數量徽章
- 與商品列表頁不在同一個元件

</div>
</div>

兩個元件彼此沒有父子關係，必須透過 Service 搭配 Subject，才能讓其中一邊改資料、另一邊即時收到通知。

<!--
我們來做一個練習，這是電商網站很常見的情境。

使用者在商品列表頁按下「加入購物車」，畫面上方導覽列的購物車數字，要立即同步更新，不用重新整理頁面。

這裡有兩個元件：商品列表 `ProductListComponent`，負責按下按鈕；導覽列 `HeaderComponent`，負責顯示數量。兩者沒有父子關係，所以要透過 Service 搭配 Subject，讓一邊改資料、另一邊即時收到通知。
-->

---
layout: default
---

# 練習：購物車數量徽章同步
### 任務說明

1. 建立 `CartService`，內部以 `private` 的 `BehaviorSubject<number>` 儲存購物車數量，初始值為 `0`
2. 對外公開 `_cartCount$`（`asObservable()`），供元件訂閱
3. 提供 `addItem()` 方法，每次呼叫將目前數量 `+1` 並透過 `next()` 推送
4. 在 `ProductListComponent` 注入 `CartService`，按鈕點擊時呼叫 `addItem()`
5. 在 `HeaderComponent` 注入 `CartService`，於 `ngOnInit` 訂閱 `_cartCount$`，將收到的最新數量存入元件屬性 `cartCount`
6. `HeaderComponent` 樣板顯示 `cartCount`，確認按下商品列表的按鈕後，徽章數字會即時更新

<!--
任務有六個步驟。

第一，建立 `CartService`，用 `private` 的 `BehaviorSubject` 儲存購物車數量，初始值是 0。第二，用 `asObservable` 對外公開 `_cartCount$`。第三，提供 `addItem` 方法，每次呼叫就把數量加 1，再用 `next` 推送。第四，商品列表元件注入 `CartService`，按鈕點擊時呼叫 `addItem`。第五，導覽列元件注入 `CartService`，在 `ngOnInit` 訂閱 `_cartCount$`，把最新數量存進 `cartCount`。第六，導覽列顯示 `cartCount`，確認按下按鈕後數字會即時更新。

想一想，哪個元件負責推送資料，哪個元件負責訂閱？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示
### 提示說明

1. `BehaviorSubject` 一定要給初始值，這裡是 `0`，因為購物車一開始沒有商品
2. 讀取目前值可用 `.value`（`BehaviorSubject` 專屬），計算 `+1` 後再 `next()` 推送出去
3. `ProductListComponent` 只需要呼叫 `addItem()`，不需要也不能直接操作 Subject
4. `HeaderComponent` 訂閱的是公開的 `_cartCount$`，不是 `private` 的原始 Subject
5. 訂閱動作寫在 `ngOnInit`，確保元件一載入就開始監聽後續的數量變化

<!--
我們來看解題提示。

第一，`BehaviorSubject` 一定要給初始值，這裡是 0。第二，要讀取目前的值，可以用 `.value`，這是 `BehaviorSubject` 才有的屬性，加 1 之後再用 `next` 推送。第三，商品列表元件只需要呼叫 `addItem`，不能直接操作 Subject。第四，導覽列訂閱的是公開的 `_cartCount$`。第五，訂閱寫在 `ngOnInit`。

最容易搞混的，是以為商品列表也要訂閱。其實它只負責推送，真正需要訂閱的是導覽列。
-->

---
layout: default
---

# 完整解答 — CartService（一）

`cart.service.ts` 資料來源宣告：

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartCount$ = new BehaviorSubject<number>(0);

  // 取得 cartCount$ 的可觀察物件（供外部訂閱使用）
  _cartCount$ = this.cartCount$.asObservable();

}
```

<!--
我們看完整的解答，先看 `CartService` 的資料來源。

`private` 的 `cartCount$` 是真正存放資料的 `BehaviorSubject`，初始值 0，代表購物車一開始沒有商品。公開的 `_cartCount$` 用 `asObservable` 提供給外部訂閱，但不能呼叫 `next`。
-->

---
layout: default
---

# 完整解答 — CartService（二）

`cart.service.ts` 公開方法：

```typescript
  addItem(): void {
    this.cartCount$.next(this.cartCount$.value + 1);
  }

  clear(): void {
    this.cartCount$.next(0);
  }

}
```

<!--
接著是 `CartService` 的方法。

`addItem` 讀取 `cartCount$.value`，也就是目前的數量，加 1 之後用 `next` 推送出去。這也是為什麼這裡要用 `BehaviorSubject`，因為只有它才能用 `.value` 直接讀到目前的值。

`clear` 則示範結帳完成後，把數量歸零的情況。
-->

---
zoom: 0.95
layout: default
---

# 完整解答 — ProductListComponent

`product-list.component.ts` 與 `product-list.component.html`：

```typescript
import { Component, inject } from '@angular/core';
import { CartService } from '../@service/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
})
export class ProductListComponent {

  private cartService = inject(CartService);

  addToCart(): void {
    this.cartService.addItem();
  }

}
```

```html
<!-- product-list.component.html -->
<button (click)="addToCart()">加入購物車</button>
```

<!--
接著是商品列表元件，它是推送資料的一方。

用 `inject` 注入 `CartService`，按鈕用小括號 `click` 綁定 `addToCart`，方法裡只呼叫 `cartService.addItem()`。數量要怎麼改變，完全交給 Service 處理，元件本身不需要知道目前的數量。
-->

---
zoom: 0.95
layout: default
---

# 完整解答 — HeaderComponent（一）

`header.component.ts` 完整內容：

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../@service/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  cartCount = 0;

  private cartService = inject(CartService);

  ngOnInit(): void {
    this.cartService._cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }

}
```

<!--
接著是導覽列元件，它是接收資料的一方。

注入 `CartService` 之後，在 `ngOnInit` 訂閱 `_cartCount$`。只要商品列表那邊呼叫一次 `addItem`，這裡的回呼就會自動執行，把最新的數量存進 `cartCount`。
-->

---
layout: default
---

# 完整解答 — HeaderComponent（二）

`header.component.html` 完整內容：

```html
<!-- header.component.html -->
<span class="cart-badge">🛒 {{ cartCount }}</span>
```

<!--
導覽列的模板很簡單，只要用雙大括號顯示 `cartCount`。

數值的更新是在訂閱的回呼裡完成的，Angular 會自動把最新的數字反映到畫面上，不用重新整理頁面，兩個元件之間也不需要任何父子關係。
-->

---
layout: default
---

# 完整解答 — 兩元件同時運作

`app.component.ts` 需先 `import` 兩個子元件並加入 `imports` 陣列，`app.component.html` 才能直接使用它們的 selector。

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, ProductListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent { }
```

```html
<!-- app.component.html -->
<app-header></app-header>
<app-product-list></app-product-list>
```

<!--
最後，把兩個元件放進 `app.component`。

先在 `imports` 加入 `HeaderComponent` 和 `ProductListComponent`，HTML 裡才能直接使用它們的標籤。
-->

---
layout: default
---

# 完整解答 — 兩元件的關係

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**ProductListComponent（推資料）**
- 注入 `CartService`
- 按鈕點擊呼叫 `addItem()`
- 不儲存、不關心目前數量

</div>
<div>

**HeaderComponent（收資料）**
- 注入 `CartService`
- `ngOnInit` 訂閱 `_cartCount$`
- 收到推送即更新 `cartCount` 畫面

</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 兩個元件在 <code>app.component.html</code> 裡是平行關係，沒有互相傳資料，全部靠 <code>CartService</code> 這個共同的訂閱來源串起來。
</div>

<!--
兩個元件在畫面上是平行的，彼此不認識，也沒有 `@Input` 或 `@Output`。

它們唯一的共同點，是都注入了同一個 `CartService`。商品列表呼叫 `addItem` 推送新數量，訂閱了 `_cartCount$` 的導覽列就會立刻收到並更新畫面。這就是訂閱最大的價值：讓沒有直接關係的元件，也能保持資料同步。
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

# 補充練習 1：誤用唯讀資料流

體驗為什麼外部元件不能直接改 Service 的資料：

1. 在外部元件中，故意繞過 Service 的方法，直接執行：

```typescript
this.loadingService._loading$.next(true);
```

2. 存檔，觀察 TypeScript 的錯誤訊息
3. 思考：`asObservable()` 為什麼能防止外部修改資料？

<!--
第一題補充練習，是一個除錯實驗。

`_loading$` 是 Service 對外公開、用 `asObservable` 轉換過的版本。請在元件裡直接對它呼叫 `next`，看看會發生什麼事。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：誤用唯讀資料流 — 參考答案

```typescript
this.loadingService._loading$.next(true);
// ❌ Property 'next' does not exist on type 'Observable<boolean>'.
```

```typescript
// ✅ 正確做法：透過 Service 提供的方法修改
this.loadingService.show();
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>asObservable()</code> 把 Subject 轉成只能 <code>subscribe</code> 的 Observable，沒有 <code>next</code> 方法；外部只能監聽，只有 Service 內部能修改
</div>

<!--
我們來看答案。

編輯器會說，`Observable` 型別上不存在 `next` 這個屬性。因為 `asObservable` 轉換後的物件，只能訂閱，不能發送新值。

這是刻意的設計：資料只能透過 Service 自己提供的方法修改，所有的修改都集中在同一個地方，出問題時比較好追查。
-->

---
layout: default
---

# 補充練習 2：Subject vs BehaviorSubject

在 Service 中並列宣告兩個主體，比較它們在「剛訂閱時」的差異：

```typescript
private loading$  = new BehaviorSubject<boolean>(false);   // 有初始值
private loading2$ = new Subject<boolean>();                 // 沒有初始值
_loading$  = this.loading$.asObservable();
_loading2$ = this.loading2$.asObservable();
```

1. 在元件的 `ngOnInit()` 同時訂閱 `_loading$` 與 `_loading2$`
2. 兩個訂閱內分別印出 `'A 收到'` 與 `'B 收到'`
3. 重新整理網頁，**不要點任何按鈕**，觀察 Console 印出了什麼

<!--
第二題補充練習，是面試很常考的觀念。

Service 裡同時宣告一個 BehaviorSubject 和一個普通的 Subject。元件一載入就同時訂閱這兩個，然後什麼都不要做，看看 Console 印出了哪些訊息。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：Subject vs BehaviorSubject — 參考答案

```typescript
ngOnInit() {
  this.loadingService._loading$.subscribe((val) => {
    console.log('A 收到', val);    // ✅ 立刻印出：A 收到 false
  });
  this.loadingService._loading2$.subscribe((val) => {
    console.log('B 收到', val);    // ❌ 沒有任何輸出，直到有人呼叫 next()
  });
}
```

| | 有初始值 | 訂閱時立刻收到值 |
| --- | --- | --- |
| `BehaviorSubject` | ✅ | ✅ 收到目前的值 |
| `Subject` | ❌ | ❌ 只收到訂閱之後發送的值 |

<!--
我們來看答案。

一打開網頁，Console 只印出「A 收到 false」。BehaviorSubject 會記住目前的值，任何人一訂閱，就立刻把這個值交給他。普通的 Subject 不會記住任何值，只會傳送訂閱之後才發生的新值，所以 B 什麼都收不到。

所以像登入狀態、購物車數量這種「隨時都要知道目前是多少」的資料，適合用 BehaviorSubject。
-->

---
layout: end
---

# 課程結束
### 掌握 RxJS Subject，實現元件間的即時資料同步！

<!--
這一章我們學了用 Subject 建立訂閱機制。`ngOnInit` 只執行一次，沒辦法感知之後的資料變化，訂閱則能在資料更新時自動通知。實作的模式是：在 Service 用 `private` 宣告 Subject，用 `asObservable` 對外公開，提供方法透過 `next` 更新資料；元件注入 Service，在 `ngOnInit` 訂閱。需要初始值或讀取目前的值時，就用 `BehaviorSubject`。

下一章，我們會用訂閱來實作全站共用的載入畫面。我們下一章見。
-->
