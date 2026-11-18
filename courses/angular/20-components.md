---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 新增組件
routeAlias: ch20
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
    新增組件
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「將畫面切割成可重複使用的積木」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們認識了元件的生命週期。不過到目前為止，我們的程式幾乎都寫在 `app.component` 裡。

想像一下，如果把整個網頁的選單、內容、側邊欄、頁尾，幾千行 HTML 全部塞在同一個檔案，會有多難閱讀、多難維護？

這一章，我們要學習 Angular 最核心的觀念：元件化。我們會把大畫面切成一個個獨立、好管理、可以重複使用的元件。
-->

---
layout: default
---

# Outline

- **為什麼要用元件** — Component 的概念與價值
- **新增元件** — 使用 Angular CLI 產生組件
- **元件的四個檔案** — `.html`、`.scss`、`.spec.ts`、`.ts`
- **元件的 TypeScript 設定** — `@Component` 裝飾器
- **引用元件** — 在頁面中使用自訂組件
- **好用工具** — VS Code 快速修正
- **實作練習**

<!--
這一章會先說明為什麼要用元件，接著用 Angular CLI 新增元件，認識它產生的四個檔案，以及 `@Component` 裝飾器的設定。然後學習怎麼在頁面中引用元件，再介紹一個 VS Code 的實用小工具。最後做一個新增並引用兩個元件的練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 為什麼要用元件
# Why Components?

<!--
我們先來聊聊，為什麼要把網頁拆成一個一個元件。
-->

---

# Component 是什麼？

Component（元件）是 Angular 的核心構建單位，代表畫面上一個獨立的區塊。

| 特性 | 說明 |
| --- | --- |
| 組合性 | 一個畫面可由多個 Component 共同組成 |
| 可重複使用 | 相同元件可在不同頁面多次使用 |
| 獨立性 | 每個元件有自己的 HTML、CSS、TypeScript |
| 維護性 | 修改某元件不影響其他元件 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>傳統 vs 元件化：</b> 傳統開發以整個網頁為單位寫程式；元件化開發將畫面拆成多個小積木，更易維護與擴充。
</div>

<!--
元件，英文是 Component，是 Angular 的核心單位，代表畫面上一個獨立的區塊。

我們可以把它想成樂高積木。傳統的開發方式，是把整個網頁當成一整塊來寫；元件化則是把畫面拆成很多小積木，再組合起來。

看表格，元件有四個特性。組合性，一個畫面可以由多個元件組成。可重複使用，同一個元件可以在不同頁面使用。獨立性，每個元件有自己的 HTML、CSS 和 TypeScript。維護性，修改一個元件，不會影響其他元件。

例如做好一個按鈕元件，首頁和購物車都能用，之後要改樣式，也只要改一個地方。
-->

---

# 畫面拆分範例

一個後台畫面可以依功能切割成多個獨立的 Component：

<div class="flex justify-center mt-2">
  <img src="/images/19-components/component-layout.png" class="rounded shadow-md object-contain" style="width: 85%; max-height: 58vh;" />
</div>

<!--
我們看一個實際的例子，這是一個典型的後台系統畫面。

如果要拆分，通常會依照功能，把它分成幾個區塊：最上方的頁首 Header、左邊的側邊欄 Sidebar、右邊的主要內容區 Content，以及最下方的頁尾 Footer。

拆分之後，主畫面的 HTML 就只需要把這幾個元件排好，結構會清楚很多。
-->

---

# 畫面拆分範例 — 各區塊說明

| 區塊 | 說明 |
| --- | --- |
| Header（頁首） | 網站 Logo、導覽列、使用者資訊 |
| Sidebar（側邊欄） | 選單、功能連結 |
| Content（主內容） | 當前頁面的核心資料 |
| Footer（頁尾） | 版權資訊、連結 |
| 共用元件 | 按鈕、卡片、彈窗等可重複使用的 UI 單元 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> 每個大區塊內部還可以繼續往下拆成更小的子元件，拆分的粒度取決於重複使用的需求。
</div>

<!--
這張表說明了每個區塊負責的內容。

頁首放網站 Logo、導覽列和使用者資訊；側邊欄放選單和功能連結；主內容區顯示目前頁面的核心資料；頁尾放版權資訊。另外，按鈕、卡片、彈窗這類會重複出現的 UI，也很適合做成共用元件。

每個大區塊裡面，還可以繼續拆成更小的子元件。拆分的原則是：「功能獨立，或是會在多個地方重複出現的 UI，就值得拆成元件」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 新增元件
# Generate a Component

<!--
那在 Angular 裡，要怎麼新增一個元件呢？我們用 Angular CLI 來完成。
-->

---

# 使用 Angular CLI 新增元件

打開命令提示字元 / 終端機，切換至專案根目錄後執行以下指令：

| 指令 | 說明 |
| --- | --- |
| `ng generate component 資料夾/組件名稱` | 完整寫法 |
| `ng g c 資料夾/組件名稱` | 縮寫（效果相同） |

```bash
# 在 components 資料夾下新增 header 元件
ng g c components/header
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議：</b> 將元件放入 <code>components</code> 資料夾做統一管理。若資料夾不存在，Angular CLI 會自動幫你建立。
</div>

<!--
在終端機切換到專案的根目錄，執行 `ng generate component`，後面接資料夾和元件名稱，也可以用縮寫 `ng g c`。

例如輸入 `ng g c components/header`，CLI 就會在 `src/app/components` 底下建立一個 `header` 資料夾，並把元件需要的檔案全部建好，連基本的程式結構都寫好了。

建議把元件統一放在 `components` 資料夾裡管理，如果資料夾不存在，CLI 也會自動建立。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 元件的四個檔案
# Component Files

<!--
CLI 執行完之後，我們看看它產生了哪些檔案。
-->

---

# 新增元件後產生的檔案

執行 `ng g c` 後，Angular CLI 會自動產生四個檔案：

| 檔案 | 說明 |
| --- | --- |
| `組件名稱.component.html` | 放置 HTML 模板的地方 |
| `組件名稱.component.scss` | 放置元件專屬樣式（CSS/SCSS）的地方 |
| `組件名稱.component.spec.ts` | 放置測試程式碼的地方 |
| `組件名稱.component.ts` | 放置 TypeScript 程式碼（元件邏輯）的地方 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 每次執行 <code>ng g c</code> 前，建議先將已開啟的 <code>ng serve</code> 關閉，再新增元件，避免衝突。
</div>

<!--
執行 `ng g c` 之後，會產生四個檔案。

`.html` 放元件的畫面模板，`.scss` 放這個元件專屬的樣式，`.spec.ts` 放測試程式，之後學到單元測試才會用到，`.ts` 則放元件的邏輯程式碼。

這裡有一個建議：如果新增元件時，`ng serve` 正在執行，可以先按 Ctrl 加 C 把它關掉，新增完再重新啟動。在伺服器執行中新增檔案，有時候 Angular 會抓不到新的檔案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 元件的 TypeScript 設定
# @Component Decorator

<!--
接下來，我們打開元件的 `.ts` 檔，看看 Angular 是怎麼把這些檔案組合在一起的。
-->

---

# @Component 裝飾器

開啟 `.component.ts` 檔，可以看到 Angular 的核心設定：

| 屬性 | 說明 |
| --- | --- |
| `selector` | 元件的標籤名稱，在 HTML 中以此名稱使用 |
| `templateUrl` | 指定此元件使用的 HTML 檔案路徑 |
| `styleUrl` | 指定此元件使用的 SCSS 檔案路徑 |

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {}
```

<!--
在 `.ts` 檔上方，有一個以小老鼠符號開頭的 `@Component` 裝飾器，它就是元件的設定。

裡面有三個重要的屬性。`selector` 是元件的標籤名稱，之後在 HTML 裡就用這個名稱來使用元件，這裡是 `app-header`。`templateUrl` 指定元件對應的 HTML 檔案。`styleUrl` 指定元件使用的樣式檔。

有了這三個設定，Angular 就知道這個元件長什麼樣子、要套用什麼樣式。
-->

---

# Selector 的使用方式

`selector` 定義了元件的「標籤名稱」，讓你可以在其他 HTML 模板中像使用原生 HTML 標籤一樣使用此元件。

| 設定值 | 在 HTML 中的用法 |
| --- | --- |
| `selector: 'app-header'` | `<app-header></app-header>` |
| `selector: 'app-sidebar'` | `<app-sidebar></app-sidebar>` |
| `selector: 'app-footer'` | `<app-footer></app-footer>` |

```html
<!-- app.component.html -->
<app-header></app-header>
<app-sidebar></app-sidebar>
<app-footer></app-footer>
```

<!--
`selector` 怎麼使用呢？

設定了 `selector` 之後，就可以在其他元件的 HTML 裡，像使用一般 HTML 標籤一樣使用它。看表格，`selector` 是 `app-header`，在 HTML 裡就寫 `app-header` 的開始和結束標籤。

Angular 在顯示畫面時，看到這個標籤，就會把 header 元件的內容放在這個位置。

看下面的範例，把頁首、側邊欄和頁尾三個元件依序排好，畫面的結構一目了然。
-->

---
layout: default
---

# @Component 裝飾器 — 小節練習

根據以下規格，補完 `@Component` 裝飾器的三個屬性，讓 `ProfileComponent` 能被正確識別與渲染：

- HTML 標籤名稱：`app-profile`
- HTML 模板路徑：`./profile.component.html`
- 樣式路徑：`./profile.component.scss`

```typescript
import { Component } from '@angular/core';

@Component({
  selector: ___,
  templateUrl: ___,
  styleUrl: ___,
})
export class ProfileComponent {}
```

<!--
我們用一個小練習熟悉 `@Component` 的三個屬性。

請依照規格補完裝飾器：HTML 標籤名稱是 `app-profile`，模板路徑是 `./profile.component.html`，樣式路徑是 `./profile.component.scss`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# @Component 裝飾器 — 小節練習解答

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Angular CLI 執行 <code>ng g c profile</code> 會自動產生此結構，實務上不需手動填寫，但理解每個屬性的意義非常重要
</div>

<!--
我們來看答案。

`selector` 填 `app-profile`，`templateUrl` 和 `styleUrl` 分別填入 HTML 和 SCSS 的路徑。

實務上，用 CLI 執行 `ng g c profile` 就會自動產生這個結構，不需要手動填寫。但理解每個屬性代表什麼，遇到問題時才知道去哪裡檢查。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 引用元件
# Using Components

<!--
在 HTML 寫了 `app-header`，畫面卻是空白，還出現錯誤？因為還需要在 TypeScript 引用元件。
-->

---

# 如何在頁面中引用元件

要在某個頁面使用新增的元件，需要完成兩個步驟：

| 步驟 | 操作 | 位置 |
| --- | --- | --- |
| 1 | 在 `.ts` 檔中 `import` 元件類別 | `app.component.ts` |
| 2 | 在 `.html` 中使用元件標籤 | `app.component.html` |

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

<!--
要在某個頁面使用元件，需要完成兩個步驟。

第一步，在 `app.component.ts` 裡，用 `import` 把 `HeaderComponent` 引入進來。第二步，在 `@Component` 裝飾器的 `imports` 陣列裡，把 `HeaderComponent` 放進去。

可以想成帶朋友進社區，要先向警衛登記朋友的名字。登記完之後，在 `app.component.html` 裡寫 `app-header`，Angular 才認得它。

很多初學者只寫了上面的 `import`，卻忘了放進 `imports` 陣列，結果還是出現錯誤，這點要特別注意。
-->

---

# 引用元件 — 在 HTML 中使用

完成 import 後，即可在 HTML 模板中使用元件標籤：

```html
<!-- app.component.html -->
<app-header></app-header>
<main>
  <p>主要內容區域</p>
</main>
<app-footer></app-footer>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>流程：</b> 先查看元件 <code>.ts</code> 中的 <code>selector</code> 名稱 → 在目標 <code>.ts</code> 的 <code>imports</code> 加入元件類別 → 在目標 <code>.html</code> 用標籤名稱呼叫元件。
</div>

<!--
完成引用之後，就可以在 HTML 裡使用元件標籤了。

這裡把 `app-header` 放在最上面，中間是主要內容，最下面是 `app-footer`，整個頁面就組裝起來了。

整理一下流程：先到元件的 `.ts` 確認 `selector` 名稱，再到要使用它的元件，把它加進 `imports`，最後在 HTML 用標籤名稱放進畫面。
-->

---
layout: default
---

# 引用元件 — 小節練習

假設已用 CLI 建立了 `sidebar` 元件，路徑為 `./components/sidebar/sidebar.component`，請補完 `app.component.ts` 的 import 語句與 `imports` 陣列，讓 HTML 中的 `<app-sidebar>` 能正確顯示：

```typescript
import { Component } from '@angular/core';
// ① 在這裡加入 import

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [/* ② 在這裡加入元件 */],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

<!--
我們用一個小練習熟悉元件的引用。

假設已經用 CLI 建立了 `sidebar` 元件，請在 `app.component.ts` 補上兩個地方：上方的 `import` 語句，以及 `imports` 陣列，讓 HTML 裡的 `app-sidebar` 能正確顯示。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 引用元件 — 小節練習解答

```typescript
import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

```html
<!-- app.component.html -->
<app-sidebar></app-sidebar>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 兩步缺一不可：① <code>import &#123; SidebarComponent &#125; from '...'</code> ② 加入 <code>imports: [SidebarComponent]</code>
</div>

<!--
我們來看答案。

第一，在上方加上 `import`，從 sidebar 元件的路徑引入 `SidebarComponent`。第二，在 `imports` 陣列裡放入 `SidebarComponent`。這樣 HTML 裡的 `app-sidebar` 就能正確顯示了。

這兩個步驟缺一不可。最常見的錯誤，就是只寫了 `import` 語句，忘了加進 `imports` 陣列。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 好用工具
# VS Code Quick Fix

<!--
每次都要手動寫 `import` 和 `imports` 陣列，有沒有更省事的方法？VS Code 其實有內建的工具可以幫忙。
-->

---

# VS Code 快速修正（Quick Fix）

當你在 HTML 中輸入元件標籤但尚未 import 時，VS Code 會顯示紅色底線並提示快速修正：

| 步驟 | 操作 |
| --- | --- |
| 1 | 在 HTML 中輸入元件標籤（如 `<app-header>`） |
| 2 | 注意紅色底線（系統不認識此標籤） |
| 3 | 點擊標籤名稱，注意畫面右邊出現的**藍色燈泡** |
| 4 | 點擊燈泡 → 選擇「快速修正」 |
| 5 | VS Code 自動將對應 import 加入 `.ts` 檔案 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>前提：</b> 元件標籤名稱必須正確（與 <code>selector</code> 一致），VS Code 才能找到對應的元件進行自動匯入。
</div>

<!--
這個工具叫做「快速修正」，英文是 Quick Fix。

當我們在 HTML 裡寫了元件標籤，但還沒有引用，VS Code 會在標籤下面畫一條紅色底線。這時候點一下標籤名稱，旁邊會出現一個藍色的燈泡。點擊燈泡，選擇快速修正，VS Code 就會自動把 `import` 語句和 `imports` 陣列都補好。

前提是標籤名稱要寫對，跟元件的 `selector` 一致，VS Code 才找得到對應的元件。這個技巧可以省下很多時間。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習
# Practice

<!--
理論都介紹完了，接下來我們動手組裝自己的頁首和頁尾。
-->

---
layout: two-cols
---

# 練習：新增兩個組件
### 任務說明

1. 使用 Angular CLI 在 `components` 資料夾下新增兩個元件
2. 分別為 `header` 與 `footer`（或自訂名稱）
3. 在各元件的 HTML 中加入一些辨識文字（例如「這是 Header」）
4. 將兩個元件引入 `app.component.ts` 的 `imports` 中
5. 在 `app.component.html` 中使用這兩個元件標籤，讓畫面同時顯示兩個元件

::right::

<div class="flex items-center justify-center h-full ml-4">
  <img src="/images/19-components/practice.png" class="rounded shadow-md w-full object-contain" style="max-height: 70vh;" />
</div>

<!--
這個練習要新增兩個元件並引用它們。

第一，用 Angular CLI 在 `components` 資料夾下，新增 `header` 和 `footer` 兩個元件。第二，在各自的 HTML 裡加上辨識文字，例如「這是 Header」。第三，在 `app.component.ts` 引用這兩個元件。第四，在 `app.component.html` 裡放上兩個元件的標籤，讓畫面同時顯示它們。

也可以順便試試看 VS Code 的藍色燈泡。

我們先暫停一下，自己動手試試看。
-->

---
zoom: 0.95
layout: default
---

# 練習：解題提示
### 提示說明

1. 新增元件：`ng g c components/header` 與 `ng g c components/footer`
2. 編輯各元件 HTML，加入識別文字
3. 在 `app.component.ts` 加入 import：

```typescript
import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

4. 在 `app.component.html` 使用：`<app-header>` 與 `<app-footer>`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>小技巧：</b> 也可以在 HTML 先打好標籤，再用 VS Code 藍色燈泡快速自動 import。
</div>

<!--
我們來看解題步驟。

先在終端機執行 `ng g c components/header` 和 `ng g c components/footer`，各自在 HTML 加上辨識文字。

接著在 `app.component.ts` 引入 `HeaderComponent` 和 `FooterComponent`，並把它們都放進 `imports` 陣列。

最後在 `app.component.html` 裡，把 `app-header` 放上面，`app-footer` 放下面。存檔之後，畫面上就會顯示這兩個元件的文字。也可以先在 HTML 寫好標籤，再用藍色燈泡自動引用。
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

# 補充練習：自訂 Selector 標籤名稱

探索 `@Component` 裝飾器的設定彈性：

1. 打開一個新建立元件的 `.ts` 檔案（例如 `roles.component.ts`）
2. 把 `selector` 原本預設的字串（如 `'app-roles'`）手動修改為 `'captain-hairball'`
3. 回到父層 HTML，改用新名字 `<captain-hairball></captain-hairball>` 呼叫
4. 觀察畫面是否依然能正常顯示

<!--
這題補充練習，我們來實驗 `selector` 的作用。

把元件的 `selector` 從預設的名字，改成自己取的 `captain-hairball`，再回到父層 HTML，用新的標籤名稱呼叫它，看看畫面還能不能正常顯示。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習：自訂 Selector — 參考答案

```typescript
@Component({
  selector: 'captain-hairball',      // 原本是 'app-roles'
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {}
```

```html
<!-- app.component.html -->
<captain-hairball></captain-hairball>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>selector</code> 就是元件在 HTML 中的「標籤名稱」，改了之後父層也要跟著改；舊的 <code>&lt;app-roles&gt;</code> 會變成 Angular 不認識的標籤而報錯
</div>

<!--
我們來看答案。

`selector` 決定了這個元件在 HTML 裡要用什麼標籤呼叫。改成 `captain-hairball` 之後，父層就要用 `captain-hairball` 標籤，畫面一樣能正常顯示。

如果父層還留著舊的 `app-roles`，Angular 會說不認識這個標籤。實務上習慣保留 `app-` 開頭，方便一眼看出這是自己專案的元件。
-->

---
layout: end
---

# 課程結束
### 用元件切割畫面，讓程式更易維護與重用

<!--
這一章我們學了元件化。元件就像樂高積木，可以組合、重複使用、各自獨立，也更好維護。用 `ng g c` 新增元件，會產生四個檔案。`@Component` 的 `selector` 決定標籤名稱。要在頁面使用元件，要先 `import`，再加進 `imports` 陣列，最後在 HTML 放上標籤。

下一章，我們會學習 Angular 的各種資料綁定方式。我們下一章見。
-->
