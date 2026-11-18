---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 生命週期
routeAlias: ch19
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
    生命週期
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「從建立到銷毀，掌握元件的每個階段」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
在 Angular 裡，有幾個關鍵的問題：元件是什麼時候建立的？呼叫 API 時，畫面準備好了嗎？元件消失時，資源有沒有清乾淨？

要回答這些問題，就要認識元件從建立到銷毀的過程，也就是「生命週期」。學完這一章，我們就能讓程式「在對的時間點，做對的事情」。
-->

---
layout: default
---

# Outline

- **生命週期介紹** — 什麼是 Lifecycle、八個 Hooks 執行順序
- **Constructor 建構式** — 最先執行的階段
- **常用生命週期** — `ngOnInit` 與 `ngAfterViewInit`
- **其餘六個 Hooks** — ngOnChanges、ngDoCheck、AfterContent 系列、AfterViewChecked、OnDestroy
- **引用多個生命週期** — 同時使用多個 Hooks

<!--
這一章會先看所有生命週期的執行順序，接著介紹最早執行的 `constructor`。然後是實務上最常用的兩個：`ngOnInit` 和 `ngAfterViewInit`。接下來把其餘六個 Hook 都看過一遍，最後學習怎麼在一個元件裡同時使用多個生命週期。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 認識生命週期
# Lifecycle Overview

<!--
我們先拉高視野，看看一個元件從建立到銷毀，會經歷哪些階段。
-->

---

# 生命週期執行順序

<div class="flex justify-center mt-2">
  <img src="/images/18-lifecycle/lifecycle-hooks.png" class="max-h-80 rounded shadow" />
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>constructor</code>（藍色）是 TypeScript class 特性，<b>不屬於 Angular Hook</b>；粉紅色為核心 Hooks；黃綠色為 Content / View 相關 Hooks。
</div>

<!--
這張圖是 Angular 生命週期的執行順序。

我們可以把元件想成一棟大樓，從動工、啟用，到最後拆除。

最上面藍色的 `constructor` 是第一個執行的階段。接著是粉紅色的核心階段，然後是黃綠色、跟內容投影和畫面組裝相關的階段，最後是元件要被移除時的銷毀階段。

這個順序是固定的，不會改變。接下來兩頁，我們用表格把每個階段整理一遍。
-->

---

# 生命週期介紹（一）

Angular 提供 **8 個 Lifecycle Hooks**，加上 `constructor` 共 **9 個執行階段**。`constructor` 是 TypeScript class 特性，不屬於 Angular 管理的 Hook。

| 階段 | 觸發時機 | 執行次數 | Angular Hook？ |
| --- | --- | --- | --- |
| `constructor` | 類別建立時（最先） | 一次 | ❌ |
| `ngOnChanges` | `@Input` 值變化時 | 多次 | ✅ |
| `ngOnInit` | 元件初始化時 | 一次 | ✅ |
| `ngDoCheck` | 每次變更檢測時 | 多次 | ✅ |
| `ngAfterContentInit` | `ng-content` 初始化後 | 一次 | ✅ |

<!--
Angular 提供了 8 個生命週期 Hook，再加上 `constructor`，一共 9 個執行階段。

要注意，`constructor` 其實是 TypeScript class 本身的特性，不是 Angular 管理的 Hook。其他的，則是 Angular 在特定時機自動幫我們呼叫的。

這頁先看前五個。看執行次數這一欄，有些只執行一次，例如 `ngOnInit`；有些會執行很多次，例如 `ngOnChanges`，只要外部傳進來的值有變化，它就會再觸發一次。
-->

---

# 生命週期介紹（二）

| 階段 | 觸發時機 | 執行次數 | Angular Hook？ |
| --- | --- | --- | --- |
| `ngAfterContentChecked` | `ng-content` 變更檢測後 | 多次 | ✅ |
| `ngAfterViewInit` | 視圖組裝完成後 | 一次 | ✅ |
| `ngAfterViewChecked` | 視圖更新後 | 多次 | ✅ |
| `ngOnDestroy` | 元件銷毀前 | 一次 | ✅ |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 執行次數「多次」的 Hooks（ngOnChanges、ngDoCheck、AfterContentChecked、AfterViewChecked）在每次資料變更或檢測時都會觸發，效能敏感的邏輯請避免放在其中。
</div>

<!--
這頁是後面四個 Hook。其中最重要的，是畫面組裝完成時的 `ngAfterViewInit`，以及元件銷毀前的 `ngOnDestroy`。

這裡要特別提醒，執行次數是「多次」的 Hook，只要資料一變動、或 Angular 做一次檢查，就會被呼叫。所以不要在裡面放耗費效能的計算，或是呼叫 API，否則網頁會變得很慢。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Constructor 建構式
# Before Everything Starts

<!--
接下來，我們看生命週期的起點：`constructor`。
-->

---

# Constructor 建構式

`constructor()` 是 Angular 生命週期中最早執行的階段，但它其實是 TypeScript 類別的特性，Angular 本身無法控制它。

| 特性 | 說明 |
| --- | --- |
| 執行時機 | 類別（class）建立時最先執行 |
| 執行次數 | 一次 |
| 元件狀態 | 尚未初始化，無法存取 DOM |
| 這個階段會做的事 | 相依注入（Dependency Injection） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 因為 constructor 執行時元件尚未初始化，幾乎不會在這個階段撰寫業務邏輯。服務（Service）通常用 <code>inject()</code> 寫在類別屬性，同樣在元件建立時完成注入。
</div>

<!--
`constructor` 是最早執行的階段，只執行一次。但它是 TypeScript class 的特性，Angular 沒辦法控制它。

在這個階段，元件還沒有完成初始化，畫面也還沒建立，所以沒辦法存取畫面上的元素。

那元件建立的這個階段，在 Angular 裡主要會做什麼？答案是「相依注入」，英文是 Dependency Injection，也就是把元件需要用到的服務或工具先準備好。現在通常用 `inject` 寫在類別屬性，它同樣是在元件建立時執行。

因為元件還沒準備好，我們幾乎不會在這裡寫業務邏輯。
-->

---

# 相依注入範例：inject()

```typescript
import { Component, inject } from '@angular/core';
import { MyService } from './my.service';

@Component({
  selector: 'app-demo',
  standalone: true,
  templateUrl: './demo.component.html',
})
export class DemoComponent {
  // ✅ 適合：注入服務
  private myService = inject(MyService);

  constructor() {
    // ❌ 不適合：存取 DOM、呼叫 API
  }
}
```

<!--
我們看相依注入的寫法。

在類別屬性寫 `private myService = inject(MyService)`。意思是告訴 Angular：「建立這個元件時，請把 `MyService` 這個服務交給我使用」。

注意 `constructor` 的大括號裡面是空的。註解也寫得很清楚：適合在元件建立時注入服務，不適合存取畫面元素或呼叫 API。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 常用生命週期
# Most Used Hooks

<!--
接下來，我們介紹實務上最常用的兩個生命週期。
-->

---

# 常用生命週期：ngOnInit

`ngOnInit` 是最常使用的生命週期，適合放置初始化的業務邏輯。

| 特性 | 說明 |
| --- | --- |
| 觸發時機 | 元件初始化完成時 |
| 執行次數 | 只執行一次 |
| 適合用途 | 呼叫 API、設定初始資料、訂閱 Observable |

<!--
第一個是 `ngOnInit`，它是最常用的生命週期。

當元件的屬性和注入的服務都準備好，也就是元件完成初始化的時候，Angular 就會自動呼叫 `ngOnInit`，而且只呼叫一次。

所以，呼叫 API 取得資料、設定變數的初始值，都很適合放在這裡。幾乎每個 Angular 元件都會用到它。
-->

---

# 常用生命週期：ngOnInit — 範例

```typescript
import { Component, OnInit } from '@angular/core';

@Component({ selector: 'app-demo', standalone: true })
export class DemoComponent implements OnInit {
  data: string[] = [];

  ngOnInit() {
    // ✅ 適合在這裡呼叫 API 取得資料
    this.data = ['item1', 'item2', 'item3'];
  }
}
```

<!--
我們看 `ngOnInit` 的寫法。

先從 `@angular/core` 引入 `OnInit`，然後在 class 後面加上 `implements OnInit`，代表這個元件會實作這個生命週期。

接著在 class 裡寫 `ngOnInit` 方法。這裡我們在裡面替 `data` 陣列設定了三筆初始資料。實務上，通常就是在這個位置呼叫 API，再把回傳的資料存進變數裡。
-->

---
layout: default
---

# ngOnInit — 小節練習

宣告變數 `announcement = ''` 與 `viewCount = 0`，在 `ngOnInit` 中設定公告內容與瀏覽次數，並在 HTML 中顯示：

- `announcement` 設定為 `'歡迎來到 Angular 學習平台！'`
- `viewCount` 設定為 `1024`

<!--
我們用一個小練習熟悉 `ngOnInit`。

請宣告兩個變數，`announcement` 預設是空字串，`viewCount` 預設是 0。然後在 `ngOnInit` 裡，把公告內容設成「歡迎來到 Angular 學習平台」，瀏覽次數設成 1024，並在 HTML 顯示出來。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# ngOnInit — 小節練習解答

```typescript
import { Component, OnInit } from '@angular/core';

@Component({ selector: 'app-demo', standalone: true, templateUrl: './demo.component.html' })
export class DemoComponent implements OnInit {
  announcement = '';
  viewCount = 0;

  ngOnInit() {
    this.announcement = '歡迎來到 Angular 學習平台！';
    this.viewCount = 1024;
  }
}
```

```html
<p>{{ announcement }}</p>
<p>累計瀏覽：{{ viewCount }} 次</p>
```

<!--
我們來看答案。

class 實作 `OnInit`，變數先宣告成空值。在 `ngOnInit` 裡，用 `this.` 把公告和瀏覽次數設成實際的值。HTML 再用雙大括號把它們顯示出來。

這個「先宣告空值，再在 `ngOnInit` 裡設定資料」的寫法，就是之後呼叫 API、把回傳結果存進變數的標準寫法。
-->

---

# 常用生命週期：ngAfterViewInit

`ngAfterViewInit` 適合在一開始需要存取畫面元素屬性時使用。

| 特性 | 說明 |
| --- | --- |
| 觸發時機 | 元件的視圖（含子元件）組裝完成後 |
| 執行次數 | 只執行一次 |
| 適合用途 | 操作 DOM 元素、存取 `@ViewChild` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> 如果在 ngOnInit 就嘗試存取 DOM，畫面可能還沒載入，會拿到 undefined。
</div>

<!--
第二個常用的是 `ngAfterViewInit`。

它在元件的畫面，包含裡面的子元件，都組裝完成之後才觸發，而且只執行一次。

這代表到了這個階段，我們終於可以操作畫面上的元素了。例如用 `@ViewChild` 抓到某個輸入框，讓它在頁面載入時自動取得焦點，這段程式就要寫在 `ngAfterViewInit` 裡。

如果寫在 `ngOnInit`，畫面可能還沒建立好，就會拿到 undefined。
-->

---

# 常用生命週期：ngAfterViewInit — 範例

```typescript
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({ selector: 'app-demo', standalone: true })
export class DemoComponent implements AfterViewInit {
  @ViewChild('myInput') inputRef!: ElementRef;

  ngAfterViewInit() {
    // ✅ 畫面載入完成後才能存取 DOM 元素
    this.inputRef.nativeElement.focus();
  }
}
```

<!--
我們看 `ngAfterViewInit` 的範例。

`@ViewChild('myInput')` 會到 HTML 裡找到標記為 `myInput` 的元素，存進 `inputRef` 這個變數。注意這裡用了驚嘆號，因為元素要等畫面建立後才會有值。

在 `ngAfterViewInit` 裡，呼叫 `nativeElement.focus()`，讓輸入框取得焦點。結果是網頁一打開，游標就會停在這個輸入框裡。

記住一個原則：要操作畫面元素，就寫在 `ngAfterViewInit`。
-->

---
layout: default
---

# ngAfterViewInit — 小節練習

在 HTML 加入一個 `<input>` 並設定模板變數 `#searchBox`，使用 `@ViewChild` 取得其 `ElementRef`，在 `ngAfterViewInit` 中讓該輸入框自動獲得焦點（`focus()`）：

```html
<input #searchBox type="text" placeholder="搜尋商品...">
```

<!--
我們用一個小練習熟悉 `ngAfterViewInit`。

在 HTML 加上一個輸入框，並用井字號 `searchBox` 標記它。接著用 `@ViewChild` 取得這個元素，在 `ngAfterViewInit` 裡讓它自動取得焦點。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# ngAfterViewInit — 小節練習解答

```typescript
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({ selector: 'app-demo', standalone: true, templateUrl: './demo.component.html' })
export class DemoComponent implements AfterViewInit {
  @ViewChild('searchBox') searchRef!: ElementRef;

  ngAfterViewInit() {
    this.searchRef.nativeElement.focus();  // 頁面載入後自動聚焦
  }
}
```

```html
<input #searchBox type="text" placeholder="搜尋商品...">
```

<!--
我們來看答案。

HTML 裡的井字號 `searchBox` 叫做模板變數，用來標記這個元素。TypeScript 裡用 `@ViewChild('searchBox')` 取得它，存進 `searchRef`。

在 `ngAfterViewInit` 裡呼叫 `focus()`，因為這時候畫面已經建立完成，所以能正確取得輸入框。頁面載入後，游標就會自動出現在搜尋框裡，使用者可以直接輸入。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 其餘六個 Hooks
# The Other Six Hooks

<!--
接下來，我們把剩下的六個 Hook 看過一遍。不需要死背，但要有基本的概念。
-->

---

# 其餘六個 Hooks — 說明

`ngOnInit` 與 `ngAfterViewInit` 已於前頁介紹，本章節補充其餘 6 個 Hooks。

| Hook | 執行次數 |
| --- | --- |
| `ngOnChanges` | 多次 |
| `ngDoCheck` | 多次 |
| `ngAfterContentInit` | 一次 |
| `ngAfterContentChecked` | 多次 |
| `ngAfterViewChecked` | 多次 |
| `ngOnDestroy` | 一次 |

<!--
`ngOnInit` 和 `ngAfterViewInit` 已經介紹過了，剩下的六個整理在這張表裡。

其中 `ngOnChanges`、`ngDoCheck`、`ngAfterContentChecked` 和 `ngAfterViewChecked` 會執行多次，`ngAfterContentInit` 和 `ngOnDestroy` 只執行一次。

接下來我們一個一個看它們的使用時機。
-->

---

# ngOnChanges

```typescript
import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';

@Component({ selector: 'app-child', standalone: true })
export class ChildComponent implements OnChanges {
  @Input() message: string = '';

  ngOnChanges(changes: SimpleChanges) {
    console.log('Input 改變：', changes);
  }
}
```

| 特性 | 說明 |
| --- | --- |
| 觸發時機 | `@Input` / `@Output` 綁定值發生變化時 |
| 執行順序 | 在 `ngOnInit` **之前**執行 |
| 執行次數 | 多次（每次 Input 變化都會觸發） |

<!--
第一個是 `ngOnChanges`。

當父元件透過 `@Input` 傳資料給子元件，只要這個值改變，子元件的 `ngOnChanges` 就會觸發。它還會把變化的內容，包括舊值和新值，放在 `changes` 參數裡交給我們。

要注意，它的執行順序比 `ngOnInit` 還早，而且每次值改變都會再觸發。如果子元件收到新的資料後，需要馬上做一些轉換，就可以寫在這裡。`@Input` 的用法，我們之後在資料傳遞的章節會詳細介紹。
-->

---

# ngDoCheck

| 特性 | 說明 |
| --- | --- |
| 觸發時機 | 緊接在首次 `ngOnInit` 後，之後每次 `ngOnChanges` 後 |
| 執行次數 | 多次 |
| 與 ngOnChanges 差異 | `@Input` 傳入物件時，若參考位置不變，`ngOnChanges` 不觸發，但 `ngDoCheck` 仍會觸發 |

```typescript
import { Component, DoCheck } from '@angular/core';

@Component({ selector: 'app-demo', standalone: true })
export class DemoComponent implements DoCheck {
  ngDoCheck() {
    // 手動偵測 Angular 檢測不到的變更
    console.log('DoCheck 執行');
  }
}
```

<!--
第二個是 `ngDoCheck`，它可以用來手動偵測變化。

有時候父元件傳進來的是一個物件。如果只修改了物件裡的某個屬性，物件本身還是同一個，`ngOnChanges` 就偵測不到這個變化。

但 `ngDoCheck` 不一樣，只要 Angular 進行一次變更檢查，它就會被呼叫。所以我們可以在這裡自己比對資料有沒有改變。

不過它觸發的頻率非常高，寫在裡面的程式要特別注意效能。
-->

---

# ngAfterContentInit 與 ngAfterContentChecked

| Hook | 觸發時機 | 執行次數 |
| --- | --- | --- |
| `ngAfterContentInit` | `ng-content` 投影內容初始化後（首次 DoCheck 之後） | 一次 |
| `ngAfterContentChecked` | 每次 `ngDoCheck` 後完成 `ng-content` 的變更檢測後 | 多次 |

<!--
接下來是 Content 系列的兩個 Hook，它們跟「內容投影」有關。

內容投影是指，把一段外部的 HTML 塞進元件裡顯示，用的是 `ng-content` 這個標籤。

投影的內容初始化完成後，會觸發一次 `ngAfterContentInit`；之後每次檢查完投影內容，都會觸發 `ngAfterContentChecked`。

這兩個通常在自己封裝分頁、對話框這類可重複使用的元件時才會用到，先知道有它們就好。
-->

---

# ngAfterContentInit 與 ngAfterContentChecked — 範例

```typescript
import { Component, AfterContentInit, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class DemoComponent implements AfterContentInit, AfterContentChecked {
  ngAfterContentInit() {
    console.log('ng-content 初始化完成');
  }
  ngAfterContentChecked() {
    console.log('ng-content 變更檢測完成');
  }
}
```

<!--
這是 Content 系列的範例。

注意元件的 template 裡寫了 `ng-content`，代表這裡會顯示外部投影進來的內容。class 實作了兩個介面，分別在投影內容初始化完成，以及每次檢查完成時印出訊息。

只有元件裡有用到 `ng-content`，這兩個 Hook 才有意義。
-->

---

# ngAfterViewChecked 與 ngOnDestroy

| Hook | 觸發時機 | 執行次數 |
| --- | --- | --- |
| `ngAfterViewChecked` | 元件視圖更新後 | 多次 |
| `ngOnDestroy` | 元件從 DOM 銷毀前 | 一次 |

<!--
最後是 `ngAfterViewChecked` 和 `ngOnDestroy`。

`ngAfterViewChecked` 在每次畫面更新後都會觸發。

`ngOnDestroy` 則是元件要從畫面上移除之前，最後一個執行的階段，例如使用者切換到別的頁面時。

它的任務是「清理資源」，就像離開之前要把場地打掃乾淨。例如取消訂閱、清除計時器。如果不清理，這些東西會一直留在記憶體裡，網頁就會越來越慢，這叫做「記憶體洩漏」。
-->

---

# ngAfterViewChecked 與 ngOnDestroy — 範例

```typescript
import { Component, AfterViewChecked, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({ selector: 'app-demo', standalone: true })
export class DemoComponent implements AfterViewChecked, OnDestroy {
  private sub!: Subscription;

  ngAfterViewChecked() {
    console.log('視圖更新後觸發');
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); // ✅ 清理訂閱，避免記憶體洩漏
  }
}
```

<!--
我們看範例。

在 `ngOnDestroy` 裡，呼叫了 `this.sub.unsubscribe()`，把訂閱取消掉，避免記憶體洩漏。訂閱是 RxJS 的觀念，之後的章節會詳細介紹，這裡先記得：元件銷毀前，要把它清掉。

`ngAfterViewChecked` 則只是在每次畫面更新後印出訊息。
-->

---
layout: default
---

# ngOnDestroy — 小節練習

在 `ngOnInit` 啟動一個每秒印出一次 `'計時中...'` 的 `setInterval` 並將 ID 存入 `private timer`，再於 `ngOnDestroy` 中呼叫 `clearInterval(this.timer)` 清除計時器：

```typescript
private timer: any;

ngOnInit() {
  this.timer = setInterval(() => {
    console.log('計時中...');
  }, 1000);
}

ngOnDestroy() {
  // 在這裡清除 timer
}
```

<!--
我們用一個小練習熟悉 `ngOnDestroy`。

在 `ngOnInit` 裡用 `setInterval` 啟動一個計時器，每秒印出一次「計時中」，並把計時器的 ID 存進 `timer`。然後在 `ngOnDestroy` 裡把計時器清除。

想一想，如果不清除，元件被移除之後，計時器會怎麼樣？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# ngOnDestroy — 小節練習解答

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({ selector: 'app-demo', standalone: true })
export class DemoComponent implements OnInit, OnDestroy {
  private timer: any;

  ngOnInit() {
    this.timer = setInterval(() => {
      console.log('計時中...');
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timer);  // ✅ 清除計時器，防止記憶體洩漏
  }
}
```

<!--
我們來看答案。

`setInterval` 會回傳一個 ID，我們把它存在 `this.timer`。在 `ngOnDestroy` 裡，呼叫 `clearInterval`，並傳入這個 ID，就能把計時器清除。

回答剛才的問題，如果不清除，就算元件已經從畫面上移除，計時器還是會每秒繼續執行，一直佔用資源，直到瀏覽器關閉為止。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 引用多個生命週期
# Using Multiple Hooks

<!--
最後，我們看如果一個元件要同時使用多個生命週期，該怎麼寫。
-->

---

# 同時實作多個 Lifecycle Hooks

一個元件可以同時實作多個生命週期介面，只需在 `implements` 後列出所有介面。

```typescript
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  templateUrl: './demo.component.html',
})
export class DemoComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnInit() {
    console.log('元件初始化');
  }

  ngAfterViewInit() {
    console.log('視圖載入完成');
  }

  ngOnDestroy() {
    console.log('元件即將銷毀，清理資源');
  }
}
```

<!--
寫法很直覺：在 `implements` 後面，用逗號把要用的介面全部列出來，例如 `OnInit`、`AfterViewInit` 和 `OnDestroy`。

然後在 class 裡，把對應的三個方法都寫出來。Angular 就會在元件的不同階段，自動執行各自的內容：初始化時印出「元件初始化」，畫面載入後印出「視圖載入完成」，銷毀前印出「清理資源」。
-->

---

# 多個 Hooks — 執行順序確認

```typescript
import { Component, OnChanges, OnInit, DoCheck,
         AfterContentInit, AfterContentChecked,
         AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';

@Component({ selector: 'app-all-hooks', standalone: true })
export class AllHooksComponent implements OnChanges, OnInit, DoCheck,
    AfterContentInit, AfterContentChecked,
    AfterViewInit, AfterViewChecked, OnDestroy {
  ngOnChanges()           { console.log('1. ngOnChanges'); }
  ngOnInit()              { console.log('2. ngOnInit'); }
  ngDoCheck()             { console.log('3. ngDoCheck'); }
  ngAfterContentInit()    { console.log('4. ngAfterContentInit'); }
  ngAfterContentChecked() { console.log('5. ngAfterContentChecked'); }
  ngAfterViewInit()       { console.log('6. ngAfterViewInit'); }
  ngAfterViewChecked()    { console.log('7. ngAfterViewChecked'); }
  ngOnDestroy()           { console.log('8. ngOnDestroy'); }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>最佳實踐：</b> 只實作需要用到的 Hooks，不要全部加入，避免不必要的效能負擔。
</div>

<!--
這是把 8 個 Hook 全部實作出來的範例，每個方法都印出自己的編號。

有時間的話，可以把這段程式放進專案裡執行，打開 Console，就能看到它們依照 1 到 8 的順序印出來，親眼確認生命週期的執行順序。

不過在實際專案裡，只要實作需要用到的 Hook 就好，沒用到的不要加進去，避免不必要的效能負擔。
-->

---
layout: default
---

# 練習：任務說明
### 觀察生命週期與 ngOnInit 初始化資料

在 Angular 專案中完成以下任務，並觀察執行結果：

1. 宣告一個全域變數 `welcomeMessage!: string`（使用 `!` 非空斷言，**不給初始值**）
2. 在 `constructor()` 中加入 `console.log('1. constructor 執行')`
3. 在 `ngOnInit()` 中加入 `console.log('2. ngOnInit 執行')`，並設定 `this.welcomeMessage = '歡迎來到 Angular！'`
4. 在 `ngAfterViewInit()` 中加入 `console.log('3. ngAfterViewInit 執行')`
5. 在 `app.component.html` 中用 `{{ welcomeMessage }}` 顯示訊息

**打開 F12 → Console，確認三個 log 依序出現；確認變數雖無初始值，畫面仍正確顯示訊息。**

<!--
我們來做這一章的練習，觀察生命週期的順序，並用 `ngOnInit` 初始化資料。

請宣告一個變數 `welcomeMessage`，用驚嘆號，不給初始值。在 `constructor`、`ngOnInit` 和 `ngAfterViewInit` 裡各自印出一行訊息，並在 `ngOnInit` 裡設定 `welcomeMessage` 的內容。最後在 HTML 顯示這個訊息。

完成之後，打開 Console 確認三行訊息出現的順序，也確認畫面有正確顯示文字。

我們先暫停一下，自己動手試試看。
-->

---
zoom: 0.94
layout: default
---

# 練習：解題提示（1／2）
### 完成步驟

1. 在 `app.component.ts` 引入並 `implements OnInit, AfterViewInit`：

```typescript
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({ selector: 'app-root', standalone: true, templateUrl: './app.component.html' })
export class AppComponent implements OnInit, AfterViewInit {
  welcomeMessage!: string;

  constructor() {
    console.log('1. constructor 執行');
  }

  ngOnInit() {
    console.log('2. ngOnInit 執行');
    this.welcomeMessage = '歡迎來到 Angular！';
  }

  ngAfterViewInit() {
    console.log('3. ngAfterViewInit 執行');
  }
}
```

<!--
我們來看解題步驟。

在 `app.component.ts` 引入 `OnInit` 和 `AfterViewInit`，並在 class 後面實作這兩個介面。`welcomeMessage` 用驚嘆號宣告。三個階段各自印出 1、2、3 的訊息，並在 `ngOnInit` 裡設定歡迎文字。
-->

---
layout: default
---

# 練習：解題提示（2／2）
### 完成步驟

2. 在 `app.component.html` 加入 `<p>{{ welcomeMessage }}</p>`

3. 儲存後開啟 F12 → Console，確認順序：`1. constructor 執行` → `2. ngOnInit 執行` → `3. ngAfterViewInit 執行`

<!--
接著在 HTML 用內嵌繫結顯示 `welcomeMessage`。

存檔之後打開 Console，會看到 constructor、ngOnInit、ngAfterViewInit 依序出現。雖然變數宣告時沒有值，但 `ngOnInit` 在畫面顯示前就設定好了，所以畫面會正確顯示歡迎訊息。

這就是之後呼叫 API 的標準寫法：在 `ngOnInit` 呼叫 API，再把結果存進變數。
-->

---
layout: end
---

# 課程結束
### 掌握生命週期，讓元件在對的時機做對的事

<!--
這一章我們認識了 Angular 的生命週期。`constructor` 最早執行，服務則用 `inject` 在元件建立時注入。`ngOnInit` 在元件初始化時執行一次，適合呼叫 API 和設定初始資料。`ngAfterViewInit` 在畫面組裝完成後執行，適合操作畫面元素。`ngOnDestroy` 在元件銷毀前執行，用來清理訂閱和計時器。執行多次的 Hook，要特別注意效能。

下一章，我們會學習怎麼建立和拆分元件。我們下一章見。
-->
