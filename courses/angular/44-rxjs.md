---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: RXJS
routeAlias: ch44
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
    RXJS
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「以可觀察序列驅動非同步資料流的響應式程式庫」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章，我們認識了 Observable 和 `subscribe`。這一章，我們要有系統地認識它們背後的工具庫：RxJS。

處理 API 回應、使用者點擊、計時器這些非同步事件時，如果各自用不同方式處理，程式很快就會變得又亂又難維護。RxJS 用「可觀察序列」這個統一的概念，把各種事件都變成資料流，再用運算子組合起來。
-->

---
layout: default
---

# Outline

- **RxJS 簡介**
- **可觀察者（Observable）**
- **觀察者（Observer）**
- **運算子（Operators）**
  - 可聯入通道的運算子（Pipeable Operators）
  - 建立運算子（Creation Operators）
  - 聯結建立運算子（Join Creation Operators）
- **訂閱（Subscription）**
- **主體（Subject）**
- **練習：倒數計時器**

<!--
這一章會先介紹 RxJS 是什麼，接著認識兩個核心角色：資料來源 Observable，和接收資料的 Observer。然後學習各種運算子，包括串接用的運算子、建立用的運算子，以及合併多個來源的運算子。最後看訂閱的生命週期怎麼管理，以及可以多播的 Subject，並做一個倒數計時器的練習。內容比較多，我們一步一步來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# RxJS 簡介
## Reactive Extensions for JavaScript

<!--
多個非同步事件互相搭配時，回呼函式很容易疊成一團。RxJS 提供一套統一的方式來處理。
-->

---

# 什麼是 RxJS？

RxJS（Reactive Extensions for JavaScript）是一個以可觀察序列（Observable sequences）編寫非同步和基於事件的程式的函式庫。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**核心型別**

- `Observable`：可觀察序列，資料流的來源

**周邊型別**

- `Observer`：消費 Observable 發出值的物件
- `Scheduler`：控制並行性的排程器
- `Subject`：多播的特殊 Observable

</div>
<div>

**設計理念**

- 以集合的方式處理非同步事件
- 宣告式（Declarative）組合複雜的非同步邏輯
- 可與 Promise、回呼（Callback）互通

**常見類比**

RxJS 之於事件處理，如同 Lodash 之於資料操作——提供豐富的運算子工具組。

</div>
</div>

<!--
RxJS 是一個「用可觀察序列來撰寫非同步和事件程式」的函式庫。

它的核心型別是 Observable，也就是資料流的來源。周邊還有接收資料的 Observer、控制執行時機的 Scheduler，以及可以多播的 Subject。

它的設計理念，是把非同步事件當成一個集合來處理。以前我們把點擊當成一次性的事件，RxJS 則把它看成一條「流」，可以像操作陣列一樣，用 `filter`、`map` 這些方法過濾和轉換。

所以 RxJS 常被比喻成事件版的 Lodash，提供大量現成的運算子，只是操作的對象從陣列變成了非同步的事件流。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 可觀察者
## Observable

<!--
RxJS 有兩個核心角色：資料的來源，以及資料的接收者。我們先看資料來源 Observable。
-->

---

# Observable 概念

Observable 是一個**多值的惰性 Push 集合**。

- **惰性（Lazy）**：在被訂閱之前不會執行
- **Push 模型**：由 Observable 決定何時推送值給 Observer
- **多值**：可在不同時間點推送多個值
- **可同步或非同步**：兩者皆可

<!--
Observable 的定義是：「一個多值、惰性、推送式的集合」。我們把它拆開來看。

惰性，代表 Observable 建立之後不會馬上執行，要等到有人訂閱，它才會開始運作。推送式，代表主導權在 Observable 身上，由它決定什麼時候把值推送給我們，我們只是被動接收。多值，代表它可以在不同的時間點推送好幾個值。另外，它可以是同步，也可以是非同步。

這幾個特性，就是 Observable 和 Promise 最大的不同。
-->

---

# Observable 與 Promise 的差異

| | Observable | Promise |
|---|---|---|
| 值數量 | 多值 | 單值 |
| 惰性 | 是 | 否 |
| 可取消 | 是 | 否 |

<!--
這張表比較了 Observable 和 Promise 的三個關鍵差異。

可以用生活比喻來理解。Promise 像叫外送，下單後只會送來一次，送到就結束，中途也不能取消。Observable 則像訂閱頻道，會持續推送新內容，而且隨時可以退訂。

所以處理持續性的事件，例如使用者輸入、計時器，我們會選擇 Observable，因為它本來就是設計來處理多次、可以取消的資料流。
-->

---

# Observable 建立與訂閱（一）

建立一個 Observable，在訂閱時同步推送 1、2、3，並於 1 秒後推送 4 後完成。

```typescript
import { Observable } from 'rxjs';

const observable = new Observable<number>((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});
```

<!--
我們看 Observable 最原始的建立方式。

`new Observable` 傳入一個函式，參數 `subscriber` 就是推送值的窗口。呼叫 `subscriber.next` 推送一個值，呼叫 `subscriber.complete` 宣告這條資料流結束。這裡先同步推送 1、2、3，再用 `setTimeout`，一秒後推送 4 並結束。

要注意，這段程式建立好之後還不會執行。因為 Observable 是惰性的，要等下一頁呼叫 `subscribe` 才會開始推送。
-->

---

# Observable 建立與訂閱（二）

訂閱並處理推送的值、錯誤與完成通知：

```typescript
console.log('just before subscribe');
observable.subscribe({
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
});
console.log('just after subscribe');
```

執行結果依序為：`just before subscribe` → `got value 1` → `got value 2` → `got value 3` → `just after subscribe` → `got value 4` → `done`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> 值 1、2、3 為同步推送；值 4 在 1000ms 後非同步推送，因此出現在 <code>just after subscribe</code> 之後。</div>

<!--
這頁呼叫 `subscribe`，傳入三個回呼函式，分別處理 next、error 和 complete。

我們看執行順序。先印出 just before subscribe，接著馬上印出 1、2、3，這證明訂閱之前程式真的沒有執行。然後印出 just after subscribe，一秒後才印出 4，最後印出 done。

為什麼 just after subscribe 會出現在 4 之前？因為 1、2、3 是同步推送的，4 是一秒後才非同步推送。這跟我們在同步與非同步那一章學到的觀念是一樣的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 觀察者
## Observer

<!--
剛才看的是資料怎麼被推送出去，接下來換個角度，看看是誰在接收資料：Observer。
-->

---

# Observer 概念與用法

Observer 是 Observable 所推送值的**消費者**，本質上是一組回呼函式，對應 Observable 推送的三種通知類型。

| 回呼屬性 | 觸發時機 | 說明 |
|---|---|---|
| `next` | Observable 推送正常值時 | 接收並處理每個推送值 |
| `error` | 發生錯誤時 | 接收錯誤物件，序列終止 |
| `complete` | 序列正常結束時 | 無參數，表示無更多值推送 |

要使用 Observer，將其作為引數傳入 `observable.subscribe(observer)`。

<!--
Observer 是 Observable 推送值的接收者，本質上就是一組回呼函式，對應三種通知。

可以把它想成接電話的人。Observable 打電話來推送值，Observer 負責接聽：正常收到訊息，就執行 `next`；電話中斷出錯，就執行 `error`，資料流也會終止；對方掛電話，就執行 `complete`，代表不會再有新的值。

使用時，把 Observer 傳進 `observable.subscribe` 就可以了。實務上，常會在 next 更新畫面，在 error 顯示錯誤訊息，在 complete 做收尾。
-->

---

# Observer 範例

```typescript
const observer = {
  next: (x: number) => console.log('Observer got a next value: ' + x),
  error: (err: unknown) => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

observable.subscribe(observer);
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> <code>next</code>、<code>error</code>、<code>complete</code> 三個回呼均為選用。省略某個回呼時，Observable 的對應通知將被忽略。</div>

<!--
這頁示範把三個回呼包成一個 `observer` 物件，再傳給 `subscribe`。效果跟直接寫在 `subscribe` 裡一樣，只是拆出來命名，比較好維護。

這三個回呼都是選用的，不一定要全部寫。但如果沒有寫 `error`，發生錯誤時就不會有任何提示，除錯會很辛苦，所以實務上建議至少處理一下錯誤。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 運算子
## Operators

<!--
認識了 Observable 和 Observer，接下來是 RxJS 最強大的部分：運算子。
-->

---

# 運算子概覽

運算子（Operators）是 RxJS 最核心的功能，提供宣告式方式組合複雜的非同步邏輯。**運算子本質上是函式。**

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**可聯入通道的運算子（Pipeable Operators）**

- 以 `observable.pipe(operator())` 語法串接
- 常見範例：`map()`、`filter()`
- 不修改原有 Observable 實例
- 回傳一個新的 Observable

</div>
<div>

**建立運算子（Creation Operators）**

- 獨立函式，以預定義行為或組合其他 Observable 來建立新的 Observable
- 輸入引數通常為純值，而非 Observable
- 常見範例：`of()`、`interval()`、`from()`

</div>
</div>

<!--
運算子是 RxJS 最核心的功能，讓我們用宣告式的方式組合非同步邏輯。運算子本質上就是函式。

可以把運算子想成工廠生產線上的加工站，資料從一端進去，經過過濾、轉換、合併，最後變成我們要的結果。

運算子分成兩大類。第一類是可串接的運算子，用 `pipe` 串起來，例如 `filter`、`map`，它們加工現有的 Observable，不會修改原本的，而是回傳一個新的 Observable。第二類是建立運算子，例如 `of`、`interval`、`from`，用來從無到有建立一個新的 Observable，輸入的通常是一般的值。
-->

---

# 可聯入通道的運算子（Pipeable Operators）

使用 `pipe()` 串接運算子，每個運算子回傳一個新的 Observable：

```typescript
import { of, map } from 'rxjs';

of(1, 2, 3)
  .pipe(map((x) => x * x))
  .subscribe((v) => console.log(`value: ${v}`));

// Logs:
// value: 1
// value: 4
// value: 9
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> <code>pipe()</code> 可串接多個運算子，資料流從左至右依序經過每個運算子處理。</div>

<!--
我們看 `pipe` 的基本用法。

先用 `of(1, 2, 3)` 建立一個依序發出 1、2、3 的 Observable，再用 `pipe` 接上 `map`，把每個值平方之後才推送出去。所以結果會依序印出 1、4、9。

`pipe` 裡可以放好幾個運算子，用逗號隔開。資料就像在水管裡流動，依序經過每一個運算子的處理，這也是「pipe」，管線這個名稱的由來。
-->

---
zoom: 0.87
---

# 建立運算子（Creation Operators）

建立運算子以**非 Observable 的引數**建立 Observable。`interval` 是典型範例，接受毫秒數，回傳每隔指定時間發出遞增整數的 Observable：

```typescript
import { interval } from 'rxjs';

const observable = interval(1000 /* number of milliseconds */);

// 每隔 1000ms 發出 0, 1, 2, 3, ...
observable.subscribe((x) => console.log(x));
```

| 常用建立運算子 | 說明 |
|---|---|
| `of(...values)` | 同步依序發出指定值後完成 |
| `from(iterable)` | 將陣列、Promise 或可迭代物件轉為 Observable |
| `interval(ms)` | 每隔指定毫秒發出遞增整數 |
| `timer(delay, ms?)` | 延遲後發出 0；有第二個參數時，之後每隔指定毫秒繼續發出 |
| `fromEvent(target, event)` | 將 DOM 事件轉為 Observable |

<!--
接著是建立運算子，它用不是 Observable 的參數，來建立一個 Observable。

`interval` 是典型的例子，傳入的是毫秒數 1000，它會建立一個每隔一秒發出遞增整數，0、1、2、3 的 Observable，很適合做定時查詢或倒數計時。

表格列了幾個常用的建立運算子：`of` 依序發出指定的值；`from` 把陣列或 Promise 轉成 Observable；`timer` 延遲一段時間後才發出值，只給一個參數時只會發出一次；`fromEvent` 則把畫面上的事件，例如點擊，轉成 Observable。先有個印象，之後用到再回來查。
-->

---
zoom: 0.92
---

# 聯結建立運算子（Join Creation Operators）

聯結建立運算子具有建立運算子的性質，同時能合併多個來源 Observable 的值。

| 運算子 | 說明 |
|---|---|
| `combineLatest(obs[])` | 任一來源發出值時，組合所有來源的最新值發出 |
| `concat(obs[])` | 依序串接多個 Observable，前一個完成後才訂閱下一個 |
| `forkJoin(obs[])` | 等待所有來源完成後，發出各來源的最後一個值 |
| `merge(obs[])` | 同時訂閱所有來源，任一發出值即轉發 |
| `partition(obs, pred)` | 依條件將 Observable 分割為兩個 |
| `race(obs[])` | 僅保留最先發出值的那個來源 |
| `zip(obs[])` | 將各來源相同索引位置的值組合後發出 |

參考資源：[https://rxjs.angular.tw/guide/operators](https://rxjs.angular.tw/guide/operators)

<!--
第三類是聯結建立運算子。它們同樣是建立新的 Observable，但輸入的是好幾個 Observable，用來把多條資料流合併成一條。

這些運算子的差別，主要在合併的時機。`combineLatest` 是任何一個來源更新，就組合所有來源的最新值；`concat` 是排隊，前一個完成才訂閱下一個；`forkJoin` 是等所有來源都完成，才一次給出結果，很像 `Promise.all`；`merge` 則是同時訂閱，誰先到就先轉發。

這些不用死背，遇到需求時，可以照著這張表找出適合的運算子。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 訂閱
## Subscription

<!--
運算子介紹完了，我們回頭看訂閱，以及它的生命週期管理。
-->

---

# Subscription 概念

Subscription 代表 Observable 的**一次執行**，是一個可釋放資源的物件。

| 方法 | 說明 |
|---|---|
| `unsubscribe()` | 取消訂閱並釋放資源，不接受任何引數 |
| `add(childSub)` | 將子訂閱加入父訂閱，統一管理生命週期 |
| `remove(childSub)` | 從父訂閱中移除子訂閱 |

```typescript
import { interval } from 'rxjs';

const observable = interval(1000);
const subscription = observable.subscribe((x) => console.log(x));

// 3.5 秒後取消訂閱，印出 0、1、2 後停止
setTimeout(() => {
  subscription.unsubscribe();
}, 3500);
```

<!--
Subscription 代表 Observable 的一次執行，是一個可以釋放資源的物件。

可以把它想成水龍頭的開關：`subscribe` 是打開水龍頭，資料開始流出；`unsubscribe` 是關掉水龍頭，停止並釋放資源。

範例中訂閱了一個每秒發出數字的 `interval`，三秒半後呼叫 `subscription.unsubscribe()`，印出 0、1、2 之後就停止了。如果沒有取消，它會永遠印下去。

在 Angular 元件裡，如果訂閱了 Observable，卻沒有在元件銷毀時取消訂閱，就會造成記憶體洩漏。像 `interval` 這種會一直發送值的 Observable，會一直在背景執行。這也是之前生命週期那一章，要在 `ngOnDestroy` 取消訂閱的原因。
-->

---

# 多個訂閱的統一管理

透過 `add()` 將子訂閱加入父訂閱，呼叫一次 `unsubscribe()` 即可同時取消所有訂閱：

```typescript
import { interval } from 'rxjs';

const observable1 = interval(400);
const observable2 = interval(300);

const subscription = observable1.subscribe((x) => console.log('first: ' + x));
const childSubscription = observable2.subscribe(
  (x) => console.log('second: ' + x)
);

subscription.add(childSubscription);

setTimeout(() => {
  // 同時取消 subscription 與 childSubscription
  subscription.unsubscribe();
}, 1000);
```

<!--
一個元件裡常常不只訂閱一個 Observable，如果每個都要各自取消，程式會很長，也容易漏掉。

解決方法是用 `add`，把子訂閱掛在父訂閱底下。範例中訂閱了兩個 `interval`，再用 `subscription.add` 把第二個掛上去。一秒之後，只要呼叫父訂閱的 `unsubscribe`，兩個訂閱就會一起被取消。

就像把好幾條水管接到同一個總開關，關掉總開關，所有水管就一起關掉了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 主體
## Subject

<!--
最後一個主題是 Subject，它是一種特別的 Observable，可以讓好幾個訂閱者同時收到同一份資料。
-->

---

# Subject 概念

Subject 是一種特殊型別的 Observable，允許將值**多播**（Multicast）到多個 Observer。

**Observable 與 Subject 的差異**

| | Observable | Subject |
|---|---|---|
| 播送方式 | 單播（Unicast） | 多播（Multicast） |
| 執行次數 | 每個訂閱各自獨立執行 | 所有訂閱共享同一執行 |
| 同時具備 | 只有 Observable | Observable + Observer |
| 應用場景 | API 呼叫、各自獨立的資料流 | 登入/登出後，所有訂閱 auth 狀態的元件同時切換畫面 |

**Subject 的雙重身份**

- 作為 **Observable**：可被訂閱
- 作為 **Observer**：可呼叫 `next()`、`error()`、`complete()` 主動推送值

<!--
Subject 是一種特殊的 Observable，可以把值「多播」給好幾個 Observer。

一般的 Observable 是單播，像是個人的客製化外送，每個訂閱者各自執行一次，互不影響。Subject 則像電台廣播，所有訂閱者共享同一次執行，同時收到一樣的內容。

Subject 同時有兩種身分：它是 Observable，可以被訂閱；它也是 Observer，可以自己呼叫 `next` 推送值。像登入登出這種需要同時通知多個元件的情況，就很適合用 Subject。下一章，我們就會把它實際用在 Angular 裡。
-->

---

# Subject 概念 — 程式碼範例

```typescript
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});

subject.next(1);
subject.next(2);

// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
```

<!--
這個範例驗證 Subject 的多播特性。

建立一個 Subject，讓 observerA 和 observerB 都訂閱它，再呼叫兩次 `next`。結果每呼叫一次，兩個訂閱者都會同時收到同一個值，依序印出 A 收到 1、B 收到 1，A 收到 2、B 收到 2。

要注意，基本的 Subject 要先訂閱，才收得到之後推送的值。如果在 `next` 之後才訂閱，之前推送過的值就收不到了。
-->

---

# Subject 作為 Observable 的橋接

Subject 可作為橋接器，將單播的 Observable 轉換為多播，供多個 Observer 同時接收：

```typescript
import { Subject, from } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe({ next: (v) => console.log(`observerA: ${v}`) });
subject.subscribe({ next: (v) => console.log(`observerB: ${v}`) });

const observable = from([1, 2, 3]);

// 將 Subject 作為 Observer 傳入，使多個訂閱者共享同一資料流
observable.subscribe(subject);

// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
// observerA: 3
// observerB: 3
```

<!--
Subject 還有一個實用的用法：把單播的 Observable 轉成多播。

關鍵是 `observable.subscribe(subject)`。因為 Subject 本身也是 Observer，可以直接傳給 `subscribe`。這樣 `from([1, 2, 3])` 推送的值，就會透過 Subject 這座橋，同時廣播給 observerA 和 observerB。

實務上，這常用在多個元件要共用同一個資料來源的情況，避免同樣的處理被重複執行。
-->

---

# Subject 的變體類型

RxJS 提供多種 Subject 變體，適用於不同的多播場景。

| 型別 | 說明 |
|---|---|
| `Subject` | 基本多播，新訂閱者只接收訂閱後推送的值 |
| `BehaviorSubject(初始值)` | 持有當前值，新訂閱者立即收到最新值 |
| `ReplaySubject(n)` | 快取最近 n 個值，新訂閱者可重播歷史值 |
| `AsyncSubject` | 僅在 `complete()` 後，發出最後一個值 |

<!--
基本的 Subject 有一個限制：新的訂閱者只能收到訂閱之後的值。RxJS 提供了幾個變體，應付不同的需求。

可以把它們想成不同的補課機制。`BehaviorSubject` 持有目前的值，新的訂閱者會立刻收到最新的值，就像隨時可以查看的最新公告。`ReplaySubject` 會快取最近幾筆值，新的訂閱者可以重播歷史資料，就像錄影回放。`AsyncSubject` 則只在 `complete` 之後，才發出最後一個值，就像考試改完才公布成績。

實務上最常用的是 `BehaviorSubject`，接下來的訂閱和載入動畫兩章都會用到它。
-->

---

# Subject 的變體類型 — BehaviorSubject 範例

```typescript
import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject(0); // 初始值為 0
subject.subscribe((v) => console.log('A: ' + v)); // A: 0（立即接收初始值）
subject.next(1);                                   // A: 1
subject.subscribe((v) => console.log('B: ' + v)); // B: 1（接收當前值）
subject.next(2);                                   // A: 2, B: 2
```

<!--
這個範例示範 `BehaviorSubject` 保留目前值的特性。

建立時給了初始值 0，所以 A 一訂閱就立刻收到 0。接著 `next(1)`，A 收到 1。這時 B 才訂閱，但 B 會立刻收到目前的值 1，不用等下一次 `next`。最後 `next(2)`，A 和 B 同時收到 2。

也因為 `BehaviorSubject` 一定要有初始值，建立時別忘了帶入。
-->

---
layout: default
---

# 練習：倒數計時器
### 情境說明

線上測驗、搶購活動、簡訊驗證碼都會用到倒數計時器：按下開始後每秒減 1，可以暫停、可以重設，時間到要自動停下來。這一題要把 `interval`、`pipe` + `map`、`Subscription` 跟 `unsubscribe()` 串在一起練習一次。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**需求**
- 畫面顯示剩餘秒數，初始為 10
- 「開始」：每秒減 1；「暫停」：停在目前秒數；「重設」：停止並回到 10
- 倒數到 0 時自動停止，Console 印出「時間到！」

</div>
<div>

**限制**
- 計時用 `interval(1000)`，並用 `pipe(map(...))` 把 0、1、2… 換算成剩餘秒數
- 暫停、重設、時間到、離開頁面時，都要呼叫 `unsubscribe()`
- 連按兩次「開始」不能讓秒數一次減 2

</div>
</div>

<!--
我們來做一個練習：倒數計時器。線上測驗、搶購活動、簡訊驗證碼，都會看到這個功能。

畫面顯示剩餘秒數，從 10 開始。按開始，每秒減 1；按暫停，停在目前的秒數；按重設，停下來並回到 10。倒數到 0 的時候，要自動停止，並在 Console 印出「時間到」。

計時要用 `interval`，再用 `pipe` 接 `map`，把 interval 發出的 0、1、2，換算成剩餘秒數。暫停、重設、時間到、離開頁面，都要記得取消訂閱。另外，連按兩次開始，秒數不能一次減 2。
-->

---
layout: default
---

# 練習：任務說明

1. 建立 `CountdownComponent`，實作 `OnDestroy`
2. 宣告 `total = 10`、`remaining = 10`、`running = false`，以及 `private timerSub?: Subscription`
3. 撰寫 `start()`：以 `interval(1000).pipe(map(...))` 算出剩餘秒數，訂閱後更新 `remaining`；值為 0 時呼叫 `stop()` 並印出「時間到！」
4. 撰寫 `stop()`：`this.timerSub?.unsubscribe()`，並把 `running` 設為 `false`
5. 撰寫 `reset()`：先 `stop()`，再把 `remaining` 設回 `total`
6. `ngOnDestroy()` 呼叫 `stop()`；HTML 顯示 `remaining`，三個按鈕各自綁定 `start()`、`stop()`、`reset()`

<!--
任務有六個步驟。

第一，建立 `CountdownComponent`，實作 `OnDestroy`。第二，宣告總秒數、剩餘秒數、執行狀態，以及用來存訂閱的 `timerSub`。第三，撰寫 `start`，用 interval 加上 map 算出剩餘秒數，訂閱後更新畫面，到 0 就停止並印出時間到。第四，`stop` 負責取消訂閱。第五，`reset` 先停止，再把秒數設回 10。第六，元件銷毀時也要停止，HTML 顯示秒數，並綁定三個按鈕。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示

1. `interval` 每次都從 0 開始發出，第一個值在 1 秒後才出現；要從目前秒數接著倒數，先記下 `const startFrom = this.remaining`，再用 `map((i) => startFrom - (i + 1))`
2. `start()` 開頭先檢查：已在執行中、或已經是 0，就直接 `return`，避免同時存在兩個訂閱
3. `stop()` 用 `?.` 呼叫 `unsubscribe()`，因為還沒按過開始時 `timerSub` 是 `undefined`
4. 暫停之後再按開始，是建立一個**新的**訂閱；被取消的 Subscription 無法再恢復
5. 按鈕可以用 `[disabled]="running"` 等條件，避免使用者在不合理的狀態下點擊

<!--
我們來看解題提示。

第一，interval 每次都從 0 開始，而且第一個值要等一秒才出現。所以要先記下目前的秒數，再用目前秒數減掉 i 加 1，暫停後再開始，才會從停下來的地方接著倒數。

第二，開始之前先檢查，如果已經在跑，或已經是 0，就直接返回。不然連按兩次開始，會同時有兩個訂閱，秒數一次減 2。

第三，`stop` 裡用問號點呼叫 `unsubscribe`，因為還沒按過開始時，`timerSub` 是 undefined。

第四，被取消的訂閱沒辦法恢復，暫停後再開始，其實是重新訂閱一次。

第五，可以用 `disabled` 控制按鈕，避免不合理的點擊。
-->

---
zoom: 0.9
layout: default
---

# 完整解答 — countdown.component.ts（一）

```typescript
import { Component, OnDestroy } from '@angular/core';
import { interval, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  standalone: true,
  templateUrl: './countdown.component.html',
})
export class CountdownComponent implements OnDestroy {
  readonly total = 10;
  remaining = this.total; // 剩餘秒數
  running = false;        // 是否正在倒數

  private timerSub?: Subscription;

  // start()、stop()、reset() 見下一頁

  ngOnDestroy(): void {
    this.stop(); // 離開頁面時停止計時，避免記憶體洩漏
  }
}
```

<!--
我們看完整的解答，先看元件的結構。

`remaining` 是剩餘秒數，`running` 記錄是不是正在倒數。`timerSub` 用來存訂閱，之後才有辦法取消。

`ngOnDestroy` 呼叫 `stop`。如果使用者在倒數途中切換到別的頁面，沒有取消的話，interval 還會一直在背景跑，這就是記憶體洩漏。
-->

---
zoom: 0.9
layout: default
---

# 完整解答 — countdown.component.ts（二）

```typescript
start(): void {
  if (this.running || this.remaining === 0) return;
  this.running = true;

  const startFrom = this.remaining;
  this.timerSub = interval(1000)
    .pipe(map((i) => startFrom - (i + 1))) // 0,1,2… → 9,8,7…
    .subscribe((value) => {
      this.remaining = value;
      if (value === 0) {
        this.stop();
        console.log('時間到！');
      }
    });
}

stop(): void {
  this.timerSub?.unsubscribe();
  this.running = false;
}

reset(): void {
  this.stop();
  this.remaining = this.total;
}
```

<!--
這頁是三個方法。

`start` 先擋掉重複啟動，再記下目前秒數。interval 發出的 0、1、2，經過 map 換算成 9、8、7。每收到一個值就更新 `remaining`，到 0 就停止並印出時間到。

`stop` 取消訂閱，並把狀態改回沒在跑。`reset` 先停止，再把秒數設回 10。

注意 `map` 只負責換算數值，更新畫面和判斷結束，是放在 `subscribe` 裡處理，各自分工。
-->

---
layout: default
---

# 完整解答 — countdown.component.html

```html
<h2>剩餘 {{ remaining }} 秒</h2>

<button (click)="start()" [disabled]="running || remaining === 0">開始</button>
<button (click)="stop()" [disabled]="!running">暫停</button>
<button (click)="reset()">重設</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 按「開始」後每秒減 1；按「暫停」停在目前秒數，再按「開始」從該秒數接著倒數；倒數到 0 自動停止，Console 印出「時間到！」，且不會出現負數；按「重設」回到 10。倒數途中切換到其他頁面，Console 不應再有任何輸出。
</div>

<!--
最後是 HTML。

開始按鈕在執行中、或已經是 0 的時候停用；暫停按鈕只有在執行中才能按。

驗證的方式是：開始之後每秒減 1；暫停後再開始，會從停下來的地方接著倒數；到 0 自動停止並印出時間到，不會變成負數；重設回到 10。最後，倒數途中切換到別的頁面，Console 不應該再有任何輸出，這代表訂閱真的被取消了。
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

# 補充練習 1：預測輸出順序

不要執行，先寫下 Console 的輸出順序：

```typescript
import { Observable } from 'rxjs';

const obs$ = new Observable<string>((subscriber) => {
  console.log('B');
  subscriber.next('C');
  setTimeout(() => subscriber.next('E'), 0);
  subscriber.next('D');
});

console.log('A');
obs$.subscribe((v) => console.log(v));
console.log('F');
```

<!--
第一題補充練習，預測輸出順序。

這題要用到兩個觀念：Observable 是惰性的，以及上一章學的同步和非同步執行順序。先不要執行，把答案寫下來。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：預測輸出順序 — 參考答案

輸出：`A` → `B` → `C` → `D` → `F` → `E`

| 輸出 | 原因 |
| --- | --- |
| `A` | 建立 Observable 不會執行，所以 `B` 不會先出現 |
| `B`、`C`、`D` | `subscribe()` 才開始執行，`next('C')`、`next('D')` 是同步推送 |
| `F` | 同步程式碼跑完，才輪到 `setTimeout` |
| `E` | 延遲 0 毫秒仍是非同步，排在所有同步程式碼之後 |

<!--
答案是 A、B、C、D、F、E。

建立 Observable 的時候，裡面的函式不會執行，所以先印出 A，而不是 B，這就是惰性。呼叫 `subscribe` 之後，才開始執行，依序印出 B、C、D，這三個都是同步的。接著 subscribe 結束，印出 F。最後才輪到 setTimeout 裡的 E，就算延遲是 0 毫秒，也要等同步程式碼全部跑完。
-->

---
layout: default
---

# 補充練習 2：用 pipe 串接多個運算子

有一組成績 `[45, 82, 67, 90, 58, 73]`，請用 RxJS 完成：

1. 用 `from()` 把陣列轉成 Observable
2. 用 `filter()` 只留下及格（≥ 60）的成績
3. 用 `map()` 把每個成績轉成字串 `'XX 分：及格'`
4. 訂閱並印出結果，全部印完後在 `complete` 印出「統計完成」

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> <code>filter</code> 的用法跟陣列的 <code>filter</code> 一樣，回傳 <code>true</code> 的值才會繼續往下傳；<code>filter</code>、<code>map</code> 都從 <code>'rxjs'</code> 匯入。
</div>

<!--
第二題補充練習，在 pipe 裡串接兩個運算子。

`filter` 我們在運算子概覽看過，用法跟陣列的 filter 一樣，回傳 true 的值才會繼續往下傳。先過濾，再轉換，最後在 complete 印出統計完成。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：用 pipe 串接多個運算子 — 參考答案

```typescript
import { from, filter, map } from 'rxjs';

from([45, 82, 67, 90, 58, 73])
  .pipe(
    filter((score) => score >= 60),
    map((score) => `${score} 分：及格`)
  )
  .subscribe({
    next: (text) => console.log(text),
    complete: () => console.log('統計完成'),
  });

// Logs:
// 82 分：及格
// 67 分：及格
// 90 分：及格
// 73 分：及格
// 統計完成
```

<!--
我們來看答案。

`from` 把陣列裡的每個元素依序發出。`pipe` 裡的運算子由上往下執行：45 和 58 被 `filter` 擋下來，不會進到 `map`；其他成績經過 `map` 變成字串，再交給 `subscribe`。

陣列的值發完之後，`from` 會自動 complete，所以最後印出統計完成。運算子的順序很重要，如果先 map 成字串，就沒辦法再用數字比較了。
-->

---
layout: default
---

# 補充練習 3：Subject 與 BehaviorSubject

預測兩段程式的輸出，比較兩者對「晚到的訂閱者」有什麼不同：

<div class="grid grid-cols-2 gap-4 my-3">
<div>

```typescript
// 程式 A
const s = new Subject<string>();
s.next('早安');
s.subscribe((v) => console.log('甲: ' + v));
s.next('午安');
s.subscribe((v) => console.log('乙: ' + v));
s.next('晚安');
```

</div>
<div>

```typescript
// 程式 B
const b = new BehaviorSubject<string>('早安');
b.subscribe((v) => console.log('甲: ' + v));
b.next('午安');
b.subscribe((v) => console.log('乙: ' + v));
b.next('晚安');
```

</div>
</div>

<!--
第三題補充練習，比較 Subject 和 BehaviorSubject。

兩段程式都是：先有一個值，甲訂閱，推送午安，乙訂閱，再推送晚安。差別只在一個是 Subject，一個是 BehaviorSubject。請預測兩邊各會印出什麼。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：Subject 與 BehaviorSubject — 參考答案

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**程式 A（Subject）**

```text
甲: 午安
甲: 晚安
乙: 晚安
```

`早安` 推送時還沒有人訂閱，直接遺失；乙只收得到訂閱之後的值

</div>
<div>

**程式 B（BehaviorSubject）**

```text
甲: 早安
甲: 午安
乙: 午安
甲: 晚安
乙: 晚安
```

訂閱當下立刻收到目前的值，所以甲收到 `早安`、乙收到 `午安`

</div>
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 登入狀態、購物車數量這類「新訂閱者也要馬上知道目前狀態」的資料，適合用 <code>BehaviorSubject</code>，下一章會實際做出來
</div>

<!--
我們來看答案。

程式 A 是 Subject。推送早安的時候還沒有人訂閱，這個值就直接遺失了。甲訂閱後收到午安和晚安，乙只收到晚安。

程式 B 是 BehaviorSubject，它會保存目前的值。甲一訂閱，立刻收到早安；乙訂閱時，目前的值是午安，所以乙立刻收到午安。最後的晚安，兩個人都收到。

所以像登入狀態、購物車數量這種，晚來的元件也要馬上知道目前狀態的資料，就適合用 BehaviorSubject，下一章我們就會實際做出來。
-->

---
layout: end
---

# 課程結束

### Observable 為核心、Operator 組合資料流、Subject 實現多播 — 掌握 RxJS 三大要素，駕馭 Angular 非同步開發

<!--
這一章我們認識了 RxJS。Observable 是惰性、推送式的資料來源，可以推送多個值，也可以取消；Observer 用 next、error、complete 接收通知。運算子用來加工和組合資料流：`pipe` 串接 `map`、`filter`，`of`、`from`、`interval` 建立資料流，`merge`、`forkJoin` 這類運算子合併多個來源。Subscription 用 `unsubscribe` 管理生命週期，Subject 則可以多播，`BehaviorSubject` 會保留目前的值。

下一章，我們會把 Subject 實際用在 Angular 裡，做出跨元件共享狀態的訂閱機制。我們下一章見。
-->
