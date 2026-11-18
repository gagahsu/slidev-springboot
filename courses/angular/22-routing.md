---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 路由
routeAlias: ch22
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
    路由
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「不換頁，只換畫面」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
前面我們學會把網頁拆成元件，也學會了各種資料繫結。但到目前為止，所有內容都擠在同一個頁面裡。

就像一間房子，客廳、廚房、臥室都要有各自的空間。網站也一樣，需要有首頁、商品頁、會員頁，而且能在這些頁面之間切換。

這一章，我們要學習 Angular 的路由。它就像網站的導覽地圖，讓我們能在不同頁面之間自由移動。
-->

---
layout: default
---

# Outline

- **什麼是 Routing？** — SPA 與傳統瀏覽流程差異
- **設定路由** — app.routes.ts 與 app.config.ts
- **定義路線** — path、component、錯誤頁、重新導向、嵌套路由
- **HTML 導航** — RouterOutlet、RouterLink、RouterLinkActive
- **TS 導航** — 注入 Router 程式切換
- **網址帶值** — Route Params 與 Query Params
- **實作練習**

<!--
這一章會先說明什麼是路由，以及單頁應用和傳統網站的差別。接著設定路由，定義路線，包括錯誤頁面、重新導向和子路由。然後學習在 HTML 和 TypeScript 裡切換頁面。再來看怎麼透過網址把資料帶到下一頁。最後做基本路由和子路由兩個練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是路由？
# What is Routing?

<!--
我們先來看，現代網頁切換頁面為什麼可以這麼快。
-->

---

# 傳統瀏覽器流程

當使用者輸入 URL 並按確認，瀏覽器會依以下流程取得新頁面：

| 步驟 | 說明 |
| --- | --- |
| 1. URL | 使用者輸入網址 |
| 2. HTTP | 瀏覽器向服務端發送 HTTP 請求 |
| 3. HTML | 服務端回傳 HTML 格式內容 |
| 4. Render | 瀏覽器渲染出畫面 |

每次換頁都需要向伺服器請求新的 HTML，整頁重新載入。

<!--
先看傳統瀏覽器的流程。

使用者輸入網址，瀏覽器向伺服器發送 HTTP 請求，伺服器回傳一份 HTML，瀏覽器再把它渲染成畫面。

問題在於，每次換頁都要重複這整個流程，向伺服器重新要一份完整的 HTML，整頁重新載入。所以我們常會看到點一個連結，畫面先變白，等一下才出現新頁面。這不只浪費資源，使用體驗也不好。
-->

---

# 什麼是 Routing？

在**單頁應用程式（SPA）**中，不再向伺服器請求新頁面，而是透過顯示或隱藏特定元件來改變使用者所見的內容。

| 傳統網站 | SPA（Angular） |
| --- | --- |
| 每次換頁都向伺服器請求 HTML | 只載入一次 HTML，透過 JS 切換畫面 |
| 整頁重新載入，速度較慢 | 只更換元件，速度較快 |
| URL 改變 → 完整頁面重載 | URL 改變 → 元件切換，畫面局部更新 |

Angular Router 透過**解讀瀏覽器 URL** 來決定顯示哪個元件。

<!--
Angular 採用的是「單頁應用程式」的架構，英文縮寫是 SPA。

它的做法是，HTML 只載入一次。之後換頁時，不再向伺服器要新的頁面，而是透過顯示或隱藏特定的元件，來改變使用者看到的內容。

就像逛百貨公司，只需要從大門進來一次，之後想去哪個樓層，搭電梯就好，不用每次都重新走出大門再進來。

看表格，網址雖然會改變，但只有元件在切換，畫面局部更新，所以速度快很多。Angular Router 就是透過解讀網址，來決定要顯示哪個元件。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 設定路由
# Setup Routing

<!--
接下來，我們看怎麼在 Angular 裡設定路由。
-->

---

# 如何使用 Routing？

建立專案後，新增兩個元件 `first` 與 `second`：

```bash
ng new my-app --routing
ng g c first
ng g c second
```

接著到 `app.routes.ts` 匯入這兩個元件，準備定義路線：

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { FirstComponent } from './first/first.component';
import { SecondComponent } from './second/second.component';

export const routes: Routes = [];
```

<!--
建立專案時加上 `--routing`，CLI 就會自動產生路由設定檔 `app.routes.ts`。

為了示範，我們用 CLI 新增兩個元件，`first` 和 `second`。

接著打開 `app.routes.ts`，把這兩個元件引入進來。現在 `routes` 陣列還是空的，下一步就要在裡面定義路線。
-->

---

# 確認 app.config.ts

確認路由是否正確載入：打開 `app.config.ts`，確認 `routes` 有被加入 `provideRouter()` 中。

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Angular CLI 建立專案時會自動設定好，若是手動新增路由才需要自行處理。
</div>

<!--
定義路線之前，先確認一件事：打開 `app.config.ts`，看看 `providers` 裡有沒有 `provideRouter(routes)`。

這行的作用，是把我們在 `app.routes.ts` 定義的路由，提供給整個應用程式使用。

用 CLI 建立的專案會自動設定好。但如果之後遇到路由沒有作用的問題，可以先回來檢查這一行。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 定義路線
# Define Routes

<!--
設定都確認好了，接下來開始定義路線。
-->

---

# 定義基本路線

路由設定由三個基礎建構組成：

| 步驟 | 說明 |
| --- | --- |
| 1. 設定路線陣列 | Angular CLI 建立專案時已自動新增 |
| 2. 在陣列中定義路線 | 設定 `path` 與對應的 `component` |
| 3. 將路線加入程式中 | 在 HTML 或 TS 中使用路由導航 |

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'first',  component: FirstComponent },
  { path: 'second', component: SecondComponent },
];
```

<!--
路由設定由三個部分組成：設定路線陣列，CLI 已經幫我們建好了；在陣列中定義路線；最後在 HTML 或 TypeScript 裡使用路由切換頁面。

定義路線的寫法很直覺。在 `routes` 陣列裡放入物件，每個物件有兩個屬性：`path` 是網址的路徑，`component` 是要顯示的元件。

這裡設定了 `first` 對應 `FirstComponent`，`second` 對應 `SecondComponent`。注意 `path` 前面不用加斜線，直接寫名稱就好。
-->

---

# 錯誤頁面（404）

當 URL 不符合任何已定義路徑時，顯示錯誤頁面。使用萬用字元 `**` 作為路徑。

```typescript
// app.routes.ts
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: 'first',  component: FirstComponent },
  { path: 'second', component: SecondComponent },
  { path: '**',     component: NotFoundComponent }, // 必須放最後
];
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> <code>**</code> 必須寫在陣列<b>最下面</b>，否則上面的路線將無法正常顯示。
</div>

<!--
如果使用者在網址列輸入了一個我們沒有定義的路徑，會發生什麼事？如果沒有處理，畫面可能會一片空白。

所以我們要設定一個錯誤頁面。在陣列最後加上一條路線，`path` 寫兩個星號，代表「任何路徑」，對應到 `NotFoundComponent`。前面的路線都沒有符合的話，就會顯示這個錯誤頁。

這裡要特別注意：兩個星號這條一定要放在陣列的最後面。路由是由上往下比對的，如果把它放在最前面，因為它符合任何路徑，後面的路線就永遠不會被比對到，所有頁面都會變成錯誤頁。
-->

---

# 設定重新導向

讓特定 URL 自動跳轉到另一個頁面，使用 `redirectTo` + `pathMatch`。

| `pathMatch` 值 | 說明 | 範例 |
| --- | --- | --- |
| `'full'` | URL 需與 `path` 完全一致才導向 | `path: ''` 只匹配根路徑 |
| `'prefix'` | URL 以 `path` 開頭就導向 | `path: 'bbb'` 匹配 `/bbb/aaa` |

```typescript
export const routes: Routes = [
  { path: '',     redirectTo: '/first', pathMatch: 'full' },
  { path: 'first',  component: FirstComponent },
  { path: 'second', component: SecondComponent },
  { path: '**',     component: NotFoundComponent },
];
```

<!--
那如果使用者只輸入網域，後面沒有任何路徑，要顯示什麼呢？這時候可以用「重新導向」。

看程式碼第一條路線，`path` 是空字串，代表根路徑；`redirectTo` 設定成 `/first`，意思是一進來就自動跳到第一頁。

後面還要加上 `pathMatch`。看表格，`full` 代表網址要和 `path` 完全一致才導向；`prefix` 則是網址只要以 `path` 開頭就導向。因為每個網址都可以算是「以空字串開頭」，所以根路徑的重新導向一定要用 `full`，否則所有網址都會被導向。
-->

---

# 嵌套路由（子路由）

想在某個元件內部再有下一層路由（例如 根元件 → first → child-a），使用 `children` 定義子路由。

```typescript
// app.routes.ts
import { ChildAComponent } from './first/child-a/child-a.component';

export const routes: Routes = [
  {
    path: 'first',
    component: FirstComponent,
    children: [
      { path: 'child-a', component: ChildAComponent }
    ]
  },
  { path: 'second', component: SecondComponent },
];
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 子路由的 <code>&lt;router-outlet&gt;</code> 要放在父元件（FirstComponent）的 HTML 中。
</div>

<!--
有時候，我們希望某個頁面裡面還有下一層的頁面。例如會員專區裡，再分成基本資料和修改密碼。這就要用到「子路由」，也叫嵌套路由。

寫法是在父路線的物件裡，加上 `children` 陣列，在裡面定義子路線。這裡在 `first` 底下，加了一條 `child-a`。

注意子路由的 `path` 只要寫最後一段，也就是 `child-a`，Angular 會自動接在父路徑後面，變成 `/first/child-a`。

另外，子路由的 `router-outlet` 要放在父元件的 HTML 裡，下一頁會詳細說明。
-->

---
layout: default
---

# 嵌套路由 — 父子元件設計（一）HTML

**父元件** `first.component.html` 要放自己的第二個 `<router-outlet>`，子路由才有地方渲染：

```html
<!-- first.component.html -->
<h2>第一頁</h2>

<!-- 導航到子路由（必須寫完整路徑） -->
<a routerLink="/first/child-a">前往 Child-A</a>

<!-- 子路由的顯示容器，放在父元件裡，不是根元件 -->
<router-outlet></router-outlet>
```

```html
<!-- child-a.component.html -->
<p>我是 Child-A 的內容</p>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ 根元件與父元件<b>各有自己的</b> <code>&lt;router-outlet&gt;</code>。忘記在父元件放 outlet，子路由切換後畫面一片空白，且 console 不會報錯
</div>

<!--
我們看父子元件的 HTML 怎麼寫。

根元件有一個 `router-outlet`，負責顯示 `first`、`second` 這一層。而父元件 `first.component.html` 裡，還要再放一個 `router-outlet`，負責顯示子路由 `child-a` 的內容。

導覽連結要寫完整的路徑，也就是 `/first/child-a`。

這裡有一個很容易踩到的問題：如果忘了在父元件放 `router-outlet`，切換到子路由時畫面會一片空白，而且 Console 不會出現任何錯誤，很難找到原因。
-->

---
layout: default
---

# 嵌套路由 — 父子元件設計（二）TS Import

Standalone component 的 `imports` 各自獨立。父元件 HTML 用了 `routerLink` 與 `<router-outlet>`，就必須在**父元件自己的** `imports` 加入對應模組：

```typescript
// first.component.ts
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-first',
  standalone: true,
  imports: [RouterOutlet, RouterLink],  // 缺少這行 HTML 會報錯
  templateUrl: './first.component.html',
})
export class FirstComponent {}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 根元件（AppComponent）有 import <code>RouterOutlet</code> 不代表子元件也有。每個 Standalone Component 需要用什麼就自己 import 什麼
</div>

<!--
父元件的 HTML 用了 `routerLink` 和 `router-outlet`，所以父元件的 TypeScript 也要引入對應的模組。

在 `first.component.ts` 的 `imports` 陣列裡，加入 `RouterOutlet` 和 `RouterLink`，缺少的話 HTML 就會報錯。

這是獨立元件架構很容易誤解的地方。根元件引入了 `RouterOutlet`，不代表其他元件也能用。每個獨立元件都是各自獨立的，用到什麼，就要自己引入什麼。
-->

---
layout: default
---

# 定義路線 — 小節練習

根據以下規格，補完 `app.routes.ts` 與 `home.component.html`（已 import 好所有元件）：

- 根路徑 `''` → 重新導向至 `/home`（`pathMatch: 'full'`）
- `/home` → `HomeComponent`，下有子路由 `/home/news` → `NewsComponent`
- `/about` → `AboutComponent`
- 任何未定義路徑 → `NotFoundComponent`

```typescript
export const routes: Routes = [
  // 補完路線（含子路由）
];
```

```html
<!-- home.component.html — 補完讓子路由能渲染 -->
<h2>首頁</h2>
<a ___="/home/news">最新消息</a>
<___></___>
```

<!--
我們用一個小練習，把定義路線的觀念整理一遍。

請依照規格補完路由：根路徑重新導向到 `/home`；`/home` 對應首頁元件，底下有一條子路由 `/home/news`；`/about` 對應關於我們；其他沒有定義的路徑顯示錯誤頁。另外，還要補完首頁元件的 HTML。

想一想，錯誤頁的路線要放在哪裡？子路由的 `router-outlet` 又該放在哪個檔案？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 定義路線 — 小節練習解答

```typescript
export const routes: Routes = [
  { path: '',      redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'news', component: NewsComponent }
    ]
  },
  { path: 'about', component: AboutComponent },
  { path: '**',    component: NotFoundComponent },  // 必須放最後
];
```

```html
<!-- home.component.html -->
<h2>首頁</h2>
<a routerLink="/home/news">最新消息</a>
<router-outlet></router-outlet>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 子路由 <code>path</code> 只寫最後一段（<code>'news'</code>，不加 <code>/</code>）；導航連結寫完整路徑 <code>/home/news</code>；<code>&lt;router-outlet&gt;</code> 放在父元件 HTML，不是根元件
</div>

<!--
我們來看答案。

第一條是根路徑的重新導向，加上 `pathMatch: 'full'`。`home` 路線裡用 `children` 定義 `news`，注意是寫 `news`，前面不加斜線。接著是 `about`，最後才是兩個星號的錯誤頁。

首頁的 HTML 裡，連結用 `routerLink` 寫完整路徑 `/home/news`，下方放上 `router-outlet`，子頁面的內容才有地方顯示。

最常見的兩個錯誤是：子路由的 `path` 加了斜線，以及忘了在首頁元件放 `router-outlet`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 頁面導航
# Navigation

<!--
路線定義好了，接下來我們在 HTML 加上導覽連結，讓使用者可以點擊切換頁面。
-->

---

# HTML 導航 — 匯入三個模組

使用 HTML 進行頁面導航前，需將以下三個模組加入元件的 `imports`：

| 模組 | 功能 |
| --- | --- |
| `RouterOutlet` | 在 HTML 中使用 `<router-outlet>` 顯示路由內容 |
| `RouterLink` | 在 HTML 中使用 `routerLink` 設定導航路徑 |
| `RouterLinkActive` | 在 HTML 中使用 `routerLinkActive` 設定當前頁 CSS |

```typescript
// app.component.ts
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class AppComponent {}
```

<!--
在 HTML 使用路由之前，要先把三個模組加進元件的 `imports`。

`RouterOutlet` 讓我們能使用 `router-outlet` 標籤，顯示路由的內容。`RouterLink` 讓我們能用 `routerLink` 設定連結的路徑。`RouterLinkActive` 讓我們能用 `routerLinkActive`，替目前所在頁面的連結加上樣式。

少了任何一個，對應的功能就沒辦法使用。
-->

---

# RouterOutlet

`<router-outlet>` 是路由的**顯示容器**，切換頁面時，對應元件的內容會渲染在此標籤的位置。

```html
<!-- app.component.html -->
<nav>
  <a routerLink="/first">第一頁</a>
  <a routerLink="/second">第二頁</a>
</nav>

<!-- 路由元件渲染在這裡 -->
<router-outlet></router-outlet>
```

<!--
第一個是 `router-outlet`，它是路由的顯示容器。

我們可以把它想成一個舞台。在 `app.component.html` 放上這個標籤之後，切換到 `/first`，第一頁元件的內容就會顯示在這個位置；切換到 `/second`，舊的內容會被換掉，改成顯示第二頁。

上方的導覽列會一直保留，只有 `router-outlet` 的內容在切換。如果沒有放 `router-outlet`，路由切換了也看不到任何內容。
-->

---

# RouterLink

`routerLink` 屬性指定要切換的路由路徑，可用於任何 HTML 標籤（`<a>`、`<button>`、`<h1>` 等）。

```html
<!-- 使用 <a> 超連結 -->
<a routerLink="/first">前往第一頁</a>

<!-- 使用 <button> 按鈕 -->
<button routerLink="/second">前往第二頁</button>

<!-- 動態路徑：用 [routerLink] 搭配變數 -->
<a [routerLink]="['/first', userId]">查看使用者</a>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 建議根據操作邏輯選擇標籤，導覽連結用 <code>&lt;a&gt;</code>，觸發動作用 <code>&lt;button&gt;</code>。
</div>

<!--
第二個是 `routerLink`，用來指定點擊後要切換到哪個路徑。它可以用在任何標籤上，例如 `a`、`button`。

在單頁應用裡，不要用原生的 `href` 來切換頁面。因為 `href` 會讓瀏覽器重新載入整個頁面，失去單頁應用快速切換的優點。改用 `routerLink`，Angular 就會接手處理點擊，在不重新載入的情況下切換頁面。

如果路徑裡要帶入變數，可以用中括號 `routerLink`，傳入一個陣列。

選擇標籤的原則是：導覽連結用 `a`，觸發動作用 `button`。
-->

---

# RouterLinkActive

當目前 URL 與 `routerLink` 路徑相符時，自動套用指定的 CSS class。需與 `routerLink` 搭配使用。

```html
<a routerLink="/first"  routerLinkActive="active-link">第一頁</a>
<a routerLink="/second" routerLinkActive="active-link">第二頁</a>

<router-outlet></router-outlet>
```

```css
/* 當前頁面連結的樣式 */
.active-link {
  color: #5eada0;
  font-weight: bold;
  border-bottom: 2px solid #5eada0;
}
```

<!--
第三個是 `routerLinkActive`。

很多網站在我們進入某個頁面時，導覽列上對應的連結會變色或加上底線，讓使用者知道自己在哪一頁。

只要在連結加上 `routerLinkActive` 等於 `active-link`，當目前的網址和這個連結的路徑相符時，Angular 就會自動幫它加上 `active-link` 這個 class。

我們只要在 CSS 裡定義 `.active-link` 的樣式，這裡是綠色、粗體加上底線，就完成了選單高亮的效果，不用自己寫程式判斷網址。
-->

---
layout: default
---

# HTML 導航 — 小節練習

在 `app.component.html` 補完導航列，讓 `/home` 與 `/about` 連結在選中時自動套用 `active` class，並在下方提供路由元件的顯示容器：

```html
<nav>
  <a ___="/home"  ___="active">首頁</a>
  <a ___="/about" ___="active">關於我們</a>
</nav>

<!-- 路由元件渲染區域 -->
<___></___>
```

<!--
我們用一個小練習熟悉這三個指令。

請補完導覽列：讓首頁和關於我們兩個連結，在被選中時自動套用 `active` 這個 class，並在下方加上路由內容的顯示容器。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# HTML 導航 — 小節練習解答

```html
<nav>
  <a routerLink="/home"  routerLinkActive="active">首頁</a>
  <a routerLink="/about" routerLinkActive="active">關於我們</a>
</nav>

<router-outlet></router-outlet>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>routerLink</code> 取代原生 <code>href</code>（不會重整頁面）；<code>routerLinkActive</code> 自動加 class；<code>&lt;router-outlet&gt;</code> 是元件的顯示容器，缺少它路由切換不會有任何畫面
</div>

<!--
我們來看答案。

兩個連結分別用 `routerLink` 指定 `/home` 和 `/about`，再用 `routerLinkActive` 指定 `active`。下方放上 `router-outlet`。

三個缺一不可：`routerLink` 負責切換頁面，`routerLinkActive` 負責高亮目前的連結，`router-outlet` 決定內容顯示在哪裡。
-->

---

# TS 導航 — 注入 Router

當換頁需要依據邏輯判斷（例如登入後跳轉），使用 TypeScript 程式導航。用 `inject()` 注入 `Router` 服務：

```typescript
// app.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({ standalone: true, imports: [RouterOutlet] })
export class AppComponent {
  private router = inject(Router);

  goToFirst() {
    this.router.navigate(['/first']);
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>inject()</code> 是 Angular 依賴注入（DI）的現代寫法。注入後，整個元件都能透過 <code>this.router</code> 呼叫路由方法。
</div>

<!--
有時候換頁需要先經過邏輯判斷，例如登入成功之後才跳到後台。這種情況就不能在 HTML 直接寫死 `routerLink`，而要在 TypeScript 裡用程式切換頁面。

第一步，用 `inject` 注入 `Router` 服務。這就是之前在生命週期提到的相依注入，Angular 會自動把 `Router` 交給我們。

注入之後，整個元件都可以用 `this.router` 呼叫路由的方法。例如在 `goToFirst` 裡，呼叫 `this.router.navigate`，就會切換到 `/first`。
-->

---

# TS 導航 — 完整範例（一）路由設定

以「登入驗證後跳轉」為例。先在 `app.routes.ts` 定義 `login` 與 `dashboard` 路線：

```typescript
// app.routes.ts
import { LoginComponent }     from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login',     component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '',          redirectTo: '/login', pathMatch: 'full' },
];
```

<!--
我們用一個登入的例子，完整看一次程式導航。先看路由設定。

在 `app.routes.ts` 裡定義兩條路線：`login` 是登入頁，`dashboard` 是登入成功後要去的後台頁。根路徑則重新導向到登入頁。
-->

---

# TS 導航 — 完整範例（二）元件設定

以「登入驗證後跳轉」為例。先看元件的設定部分：

```typescript
// login.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],           // 雙向綁定 [(ngModel)] 需要
  templateUrl: './login.component.html',
})
export class LoginComponent {
  password = '';   // 綁定輸入框
  error = false;   // 控制錯誤訊息顯示

  private router = inject(Router);  // 注入 Router
}
```

<!--
接著看登入元件的設定。

因為要用 `ngModel` 綁定密碼輸入框，所以 `imports` 加入了 `FormsModule`。

元件有兩個變數：`password` 綁定輸入框，`error` 控制錯誤訊息要不要顯示。最後用 `inject` 注入 `Router`。
-->

---

# TS 導航 — 完整範例（三）邏輯方法

接著是 `login()` 方法，包含判斷與跳轉邏輯：

```typescript
export class LoginComponent {
  // ... 承上頁屬性與注入的 Router

  login() {
    if (this.password === '1234') {
      this.router.navigate(['/dashboard']);  // 驗證通過 → 跳轉
    } else {
      this.error = true;                     // 驗證失敗 → 顯示錯誤訊息
    }
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 程式導航的核心：<b>先執行邏輯判斷，再決定要不要跳轉</b>。這是 <code>routerLink</code> 做不到的。
</div>

<!--
再來是 `login` 方法，這是程式導航的關鍵。

方法裡先用 if 判斷密碼是不是 1234。正確的話，就呼叫 `this.router.navigate`，跳到 `/dashboard`；錯誤的話，就把 `error` 設成 true，讓畫面顯示錯誤訊息。

先執行邏輯判斷，再決定要不要跳轉，這是 `routerLink` 做不到的。
-->

---

# TS 導航 — 完整範例（四）HTML

`login.component.html`：

```html
<input [(ngModel)]="password" placeholder="輸入密碼" />
<button (click)="login()">登入</button>
@if (error) {
  <p>密碼錯誤，請再試一次</p>
}
```

<!--
登入頁的 HTML 很簡單。

輸入框用 `ngModel` 綁定 `password`，按鈕用小括號 `click` 呼叫 `login`。下方用 `@if` 判斷 `error`，只有密碼錯誤時才顯示提示文字。`@if` 是 Angular 的條件判斷語法，之後的章節會詳細介紹。
-->

---

# TS 導航 — 完整範例（五）執行流程

點擊按鈕後的執行流程：

| 步驟 | 說明 |
| --- | --- |
| 1. 使用者輸入密碼、按登入 | `(click)="login()"` 觸發 |
| 2. `login()` 做條件判斷 | `if (password === '1234')` |
| 3a. 通過 → 跳轉 | `router.navigate(['/dashboard'])` |
| 3b. 失敗 → 顯示錯誤 | `error = true`，畫面顯示紅字 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 這就是程式導航的核心：<b>先跑邏輯，再決定要不要跳、要跳去哪裡</b>。用 <code>routerLink</code> 做不到條件跳轉。
</div>

<!--
我們把點擊按鈕後的流程整理一次。

使用者輸入密碼、按下登入，觸發 `login` 方法。方法先判斷密碼是否正確。正確的話，用 `navigate` 跳到後台頁；錯誤的話，把 `error` 設為 true，畫面顯示錯誤訊息。

這就是程式導航的核心：「先跑邏輯，再決定要不要跳、要跳去哪裡」。
-->

---

# TS 導航 — 切換頁面

注入 Router 後，使用 `this.router.navigate()` 或 `navigateByUrl()` 切換頁面。

| 方法 | 語法 | 說明 |
| --- | --- | --- |
| `navigate()` | `this.router.navigate(['/path'])` | 使用陣列傳入路徑 |
| `navigateByUrl()` | `this.router.navigateByUrl('/path')` | 直接傳入字串路徑 |

```typescript
// 兩種寫法效果相同
this.router.navigate(['/second']);
this.router.navigateByUrl('/second');
```

<!--
用程式切換頁面，有兩個常用的方法。

`navigate` 傳入一個陣列，`navigateByUrl` 則直接傳入一個字串路徑。兩種寫法的效果一樣。

如果路徑裡要帶入變數，陣列的寫法會比較清楚，所以實務上 `navigate` 比較常用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 網址帶值
# Route Parameters

<!--
接下來，我們看怎麼在切換頁面時，透過網址把資料帶到下一頁。
-->

---

# 網址帶值 — 兩種方式

切換頁面時可將資料塞入網址，另一頁再從網址取出，適合傳遞簡單值（如 ID、使用者名稱）。

| 方式 | 範例網址 | 說明 |
| --- | --- | --- |
| Route Params | `/list/Allen` | 在 router.ts 設定 `/:name` |
| Query Params | `/list?name=Allen` | 網址後直接加 `?key=value` |

兩種方式都不需透過 Service 傳遞，但不適合傳遞大量或複雜的資料。

<!--
把資料放進網址有兩種方式。

第一種是 Route Params，路徑參數，網址長得像 `/list/Allen`，資料直接成為路徑的一部分，需要先在路由裡設定。第二種是 Query Params，查詢參數，網址後面加上問號，例如 `?name=Allen`，不需要修改路由設定。

這兩種方式都很適合傳遞 ID、名稱這類簡單的值。但如果資料量大或結構複雜，就不適合放在網址裡，之後我們會學其他傳遞資料的方式。
-->

---

# Route Params — 設定路由

在 `app.routes.ts` 的路徑後面加上 `/:參數名稱`，可帶多個參數。

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'list',        component: ListComponent },      // 不帶值
  { path: 'list/:name',  component: ListComponent },      // 帶一個值
  { path: 'list/:name/:age', component: ListComponent },  // 帶多個值
];
```

導航時在路徑後帶上值：

```typescript
// 導航到 /list/Allen
this.router.navigate(['/list', 'Allen']);
```

<!--
先看 Route Params 的設定。

在 `app.routes.ts` 的路徑後面加上冒號和參數名稱，例如 `list/:name`。冒號代表「這裡是一個預留的位置」。也可以設定多個參數，例如 `/:name/:age`。

切換頁面時，在 `navigate` 的陣列裡依序放入路徑和值。這裡放入 `/list` 和 Allen，Allen 就會填進 `:name` 的位置，網址變成 `/list/Allen`。
-->

---

# Route Params — 取值

在目標元件中注入 `ActivatedRoute`，使用 `snapshot.paramMap.get()` 取出值。

```typescript
// list.component.ts
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class ListComponent {
  name: string | null = '';
  private route = inject(ActivatedRoute);

  constructor() {
    this.name = this.route.snapshot.paramMap.get('name');
  }
}
```

```html
<p>使用者名稱：{{ name }}</p>
```

<!--
資料帶過去之後，下一頁要怎麼取出來？

在目標元件用 `inject` 注入 `ActivatedRoute`，它可以取得目前路由的資訊。接著在 `constructor` 裡用 `this.route.snapshot.paramMap.get('name')`，意思是「從目前路由的快照裡，取出叫做 name 的參數」。

取出來之後存進 `name` 變數，畫面上就能顯示「使用者名稱：Allen」。注意取出來的值可能是 null，所以變數的型別寫成字串或 null。
-->

---

# Query Params — URL 寫法

不需修改 `app.routes.ts`，直接在網址後加上 `?key=value`，多個值用 `&` 分隔。

```typescript
// 導航到 /list?name=Allen&age=12
this.router.navigate(['/list'], {
  queryParams: { name: 'Allen', age: 12 }
});
```

```html
<!-- routerLink 寫法 -->
<a [routerLink]="['/list']" [queryParams]="{ name: 'Allen' }">前往</a>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> Query Params 取出的值皆為 <code>string</code> 型別，使用時需自行轉換型別。
</div>

<!--
再來是 Query Params，它不需要修改 `app.routes.ts`。

在 TypeScript 裡，`navigate` 的第二個參數傳入一個物件，裡面的 `queryParams` 放要帶的值。這裡帶了名字和年齡，網址就會變成 `/list?name=Allen&age=12`，多個值用 `&` 符號連接。

在 HTML 裡，則用中括號 `queryParams` 搭配 `routerLink`。

要注意，從網址取出來的值都是字串，即使原本是數字，使用時也要自己轉換型別。查詢參數很常用在搜尋和篩選的情境。
-->

---

# Query Params — 取值 + 比較

一樣注入 `ActivatedRoute`，但改用 `snapshot.queryParamMap.get()` 取值。

```typescript
// list.component.ts
private route = inject(ActivatedRoute);
constructor() {
  const name = this.route.snapshot.queryParamMap.get('name');
  const age  = this.route.snapshot.queryParamMap.get('age');
}
```

| 比較項目 | Route Params | Query Params |
| --- | --- | --- |
| 需修改 router.ts | ✅ 是 | ❌ 否 |
| 網址格式 | `/list/Allen` | `/list?name=Allen` |
| 取值方法 | `paramMap.get()` | `queryParamMap.get()` |
| 值的型別 | string | string |

<!--
Query Params 的取值方式也差不多，一樣注入 `ActivatedRoute`，只是改用 `snapshot.queryParamMap.get()`，多了 query 這個字。

我們用表格比較兩種方式。Route Params 需要修改路由設定，網址是斜線的形式，用 `paramMap` 取值；Query Params 不用修改路由，網址是問號的形式，用 `queryParamMap` 取值。兩者取出來的都是字串。

實務上，如果是指定某個特定資源，例如某位會員的資料，通常用 Route Params；如果是排序、分頁、搜尋這類輔助條件，通常用 Query Params。
-->

---
layout: default
---

# Query Params — 小節練習

A 頁面點擊按鈕時，帶著 `keyword = 'Angular'` 跳轉至 `/result`；B 頁面在 `constructor` 中讀取並印出該值：

**A 頁面（導航）：**
```typescript
search() {
  // 帶 queryParams 跳轉至 /result
  this.router.navigate(___);
}
```

**B 頁面（取值）：**
```typescript
private route = inject(ActivatedRoute);

constructor() {
  // 讀取 keyword 並 console.log
  console.log(___);
}
```

<!--
我們用一個小練習熟悉 Query Params。

A 頁面點擊按鈕時，帶著 `keyword` 等於 Angular，跳到 `/result`。B 頁面在 `constructor` 裡讀取這個值，並用 `console.log` 印出來。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# Query Params — 小節練習解答

```typescript
// A 頁面 — 帶值導航
search() {
  this.router.navigate(['/result'], { queryParams: { keyword: 'Angular' } });
}
```

```typescript
// B 頁面 — 取值
private route = inject(ActivatedRoute);

constructor() {
  console.log(this.route.snapshot.queryParamMap.get('keyword'));  // Angular
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 傳值用 <code>queryParams: &#123; key: value &#125;</code>；取值用 <code>queryParamMap.get('key')</code>，回傳型別為 <code>string | null</code>
</div>

<!--
我們來看答案。

A 頁面在 `navigate` 的第一個參數放 `/result`，第二個參數放 `queryParams`，裡面是 `keyword` 等於 Angular。

B 頁面用 `queryParamMap.get('keyword')` 取出值，印出 Angular。

跟 Route Params 最大的差別是，Query Params 不用修改路由設定，直接在 `navigate` 的第二個參數帶值就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習
# Practice

<!--
路由的觀念都介紹完了，接下來我們動手做練習。
-->

---
layout: two-cols
---

# 練習：基本路由
### 任務說明

1. 新增 `first`、`second` 兩個元件
2. 在 `app.routes.ts` 定義兩條路線
3. 在根元件 HTML 加入導航按鈕
4. 加入 `<router-outlet>` 顯示內容
5. 設定根路徑重新導向至 `/first`

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/21-routing/practice-basic.png" class="rounded shadow-md max-h-80" />
</div>

<!--
第一個練習是基本路由。

請新增 `first` 和 `second` 兩個元件，在 `app.routes.ts` 定義兩條路線。接著在根元件的 HTML 加上導覽按鈕，並放上 `router-outlet` 顯示內容。最後設定根路徑，自動重新導向到 `/first`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：基本路由 解題提示
### 提示說明

1. 匯入 `RouterOutlet`、`RouterLink`、`RouterLinkActive` 到根元件
2. `app.routes.ts` 中加入：
   - `{ path: 'first', component: FirstComponent }`
   - `{ path: 'second', component: SecondComponent }`
   - `{ path: '', redirectTo: '/first', pathMatch: 'full' }`
3. HTML 中按鈕加上 `routerLink="/first"` 和 `routerLink="/second"`
4. HTML 中加入 `<router-outlet></router-outlet>`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 記得在 <code>app.component.ts</code> 的 <code>imports</code> 加入這三個 Router 模組。
</div>

<!--
我們來看解題提示。

第一，在根元件的 `imports` 加入 `RouterOutlet`、`RouterLink` 和 `RouterLinkActive`。第二，在 `app.routes.ts` 加入三條路線：`first`、`second`，以及根路徑的重新導向，記得加上 `pathMatch: 'full'`。第三，HTML 的按鈕加上 `routerLink`。第四，放上 `router-outlet`。

存檔之後，打開網頁應該會自動跳到 `/first`，點擊按鈕就能在兩個頁面之間快速切換。
-->

---
layout: two-cols
---

# 進階練習：子路由
### 任務說明

1. 在 `first` 下新增子元件 `child-a`
2. 在 `app.routes.ts` 設定子路由
3. 在 `first.component.html` 加入 `<router-outlet>`
4. 加入導航按鈕切換到子路由頁面
5. 子路由頁面顯示自訂內容

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/21-routing/practice-advanced.png" class="rounded shadow-md max-h-80" />
</div>

<!--
第二個練習是子路由。

請在 `first` 底下新增一個子元件 `child-a`，在 `app.routes.ts` 設定子路由，並在 `first.component.html` 加上 `router-outlet`。接著加上導覽按鈕，切換到子路由頁面，並在子頁面顯示自訂的內容。

這題要特別注意兩件事：`router-outlet` 放在哪裡，以及導覽連結的路徑怎麼寫。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 進階練習：子路由 解題提示
### 提示說明

1. 建立子元件：`ng g c first/child-a`
2. `app.routes.ts` 修改 first 路線：
   ```typescript
   { path: 'first', component: FirstComponent,
     children: [{ path: 'child-a', component: ChildAComponent }] }
   ```
3. 在 `first.component.html` 中加入 `<router-outlet>`（顯示子路由）
4. 導航用 `routerLink="/first/child-a"` 完整路徑

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 子路由的 <code>&lt;router-outlet&gt;</code> 放在<b>父元件</b>的 HTML 中，不是根元件。
</div>

<!--
我們來看解題提示。

先執行 `ng g c first/child-a` 建立子元件。接著在 `app.routes.ts` 的 `first` 路線裡，用 `children` 加入 `child-a`。

最關鍵的一步，是在父元件 `first.component.html` 裡放上 `router-outlet`，而不是放在根元件。也記得在 `first.component.ts` 引入需要的路由模組。

最後，導覽連結要寫完整路徑 `/first/child-a`。
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

# 補充練習 1–2：用程式跳轉頁面

**練習 1：按鈕返回起始頁**

1. 在 `second.component.html` 做出「返回起始頁」按鈕
2. 在 `SecondComponent` 用 `inject()` 注入 `Router`
3. 點擊時用 `this.router.navigateByUrl('/first')` 跳回首頁

**練習 2：登入狀態導航**

1. 在首頁 TS 宣告 `isLogin: boolean = true;`
2. 撰寫方法 `checkUser()`：`isLogin` 為 `true` 時 `alert('登入成功！準備跳轉')` 並導航至 `/second`；否則 `alert('拒絕訪問')`
3. 切換布林值，感受依邏輯換頁的效果

<!--
接下來兩題補充練習，都是用 TS 程式來切換頁面。

第一題，在 second 頁面做一個返回按鈕，注入 `Router`，點擊時用 `navigateByUrl` 回到 first。

第二題，在首頁加上判斷：已登入就跳到 second，沒登入就跳出拒絕訪問。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
// second.component.ts
private router = inject(Router);

goBack() {
  this.router.navigateByUrl('/first');
}
```

```typescript
// first.component.ts
isLogin: boolean = true;

private router = inject(Router);

checkUser() {
  if (this.isLogin) {
    alert('登入成功！準備跳轉');
    this.router.navigateByUrl('/second');
  } else {
    alert('拒絕訪問');
  }
}
```

<!--
我們來看答案。

兩題都要先從 `@angular/core` 匯入 `inject`、從 `@angular/router` 匯入 `Router`，再用 `inject` 注入。第一題的 `goBack` 只有一行，用 `navigateByUrl` 跳回 first。

第二題的 `checkUser` 用 `if` 判斷 `isLogin`：成立就先跳提示，再導向 second；不成立就只跳出拒絕訪問，留在原頁。這就是程式導航比 `routerLink` 更有彈性的地方：可以先判斷條件，再決定要不要換頁。
-->

---
layout: end
---

# 課程結束
### 掌握路由，打造多頁面的 SPA 應用

<!--
這一章我們學了 Angular 的路由。單頁應用只載入一次 HTML，透過切換元件來換頁。路線在 `app.routes.ts` 定義，用兩個星號設定錯誤頁並放在最後，用 `redirectTo` 搭配 `pathMatch: 'full'` 做重新導向，用 `children` 設定子路由。HTML 用 `routerLink`、`routerLinkActive` 和 `router-outlet` 切換頁面，TypeScript 則注入 `Router` 用 `navigate` 切換。網址帶值可以用 Route Params 或 Query Params。

下一章，我們會學習元件之間怎麼傳遞資料。我們下一章見。
-->
