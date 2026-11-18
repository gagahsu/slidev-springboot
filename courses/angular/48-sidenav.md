---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Sidenav
routeAlias: ch48
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
    Sidenav
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用側邊導覽列切換頁面，提升應用導覽體驗」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學了 Signals。這一章，我們要認識 Angular Material 的側邊導覽元件：Sidenav。

使用 App 或後台系統時，常會看到點一下選單圖示，左邊就滑出一排導覽連結。自己做的話，要處理動畫、遮罩、版面推擠，很繁瑣。Sidenav 就是把這些都包好的元件。
-->

---
layout: default
---

# Outline

- **什麼是 Sidenav？** — 側邊導覽元件的概念與應用場景
- **三種顯示模式** — `over`、`push`、`side` 的差異
- **HTML 結構** — `mat-drawer-container`、`mat-drawer` 基本語法
- **TypeScript 設定** — 匯入 `MatSidenavModule` 與 `MatListModule`
- **drawer.toggle() 控制** — 以按鈕開關側邊導覽

<!--
這一章會先認識 Sidenav 是什麼、能用在哪些場景，接著比較三種顯示模式的差異。然後看 HTML 結構怎麼寫、TypeScript 要匯入哪些模組，以及怎麼用按鈕控制它的開關。最後做一個路由導覽側邊選單的練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 Sidenav？
# What Is Sidenav?

<!--
我們先搞懂 Sidenav 是什麼，以及什麼情況下會需要它。
-->

---

# 什麼是 Sidenav？

`mat-sidenav`（滑出側邊導覽元件）是 Angular Material 提供的側邊欄元件，常用於頁面切換導覽功能。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**核心概念**

- 側邊導覽面板可顯示或隱藏
- 搭配按鈕觸發 `drawer.toggle()` 開關
- 導覽連結列於側邊，主內容在右側呈現

</div>
<div>

**常見應用場景**

- 後台管理介面左側選單
- 行動裝置的漢堡選單
- 多頁面應用的主要導覽結構

</div>
</div>

<div class="flex justify-center">
  <img src="/images/48-sidenav/sidenav-concept-overview.png" class="rounded shadow-md max-h-56" />
</div>

<!--
`mat-sidenav` 是 Angular Material 提供的側邊欄元件，常用來做頁面的導覽。

它的核心概念是：側邊的面板可以顯示或隱藏，用按鈕觸發開關，導覽連結放在側邊，主要內容在右邊呈現。

可以把它想成餐廳櫃台下的菜單抽屜，平常收起來不佔空間，需要時才拉出來看。Sidenav 也是一樣，需要導覽時滑出來，不需要時收起來，節省畫面空間。

常見的應用場景有後台管理系統的左側選單、手機上的漢堡選單，以及多頁面應用的主要導覽。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 三種顯示模式
# Display Modes

<!--
Sidenav 有三種顯示方式，我們看看它們展開時，和主要內容的互動有什麼不同。
-->

---

# 三種顯示模式

`mat-drawer`（`mat-sidenav`）支援三種 `mode` 屬性值，控制側邊導覽與主內容的互動方式。

| 模式 | 說明 |
|---|---|
| `over`（預設） | Sidenav 漂浮在主要內容之上，主內容被半透明遮罩覆蓋 |
| `push` | Sidenav 將主要內容向右推開，並以遮罩覆蓋主內容 |
| `side` | Sidenav 與主要內容並排顯示，主內容寬度縮小以騰出空間 |

<!--
`mat-drawer`，也就是 `mat-sidenav`，用 `mode` 屬性控制三種顯示模式。

`over` 是預設值，側邊導覽浮在主要內容上面，主要內容被半透明的遮罩蓋住。`push` 會把主要內容往右推開，同樣有遮罩。`side` 則是和主要內容並排顯示，主要內容的寬度縮小，沒有遮罩。

實務上，`over` 最常見，適合手機或比較窄的畫面；`side` 常用在寬螢幕的後台系統，讓選單常駐在畫面上。接下來用三張圖實際看看。
-->

---

# 模式示意：over

`mode="over"` 時，側邊導覽展開後浮層覆蓋主內容，主內容區仍保持原始寬度。

<div class="flex justify-center">
  <img src="/images/48-sidenav/mode-over-demo.png" class="rounded shadow-md max-h-80" />
</div>

<!--
這是 `over` 模式。

側邊導覽像一張浮在上面的紙，蓋住了主要內容，主要內容本身的寬度完全沒有改變，只是被遮罩蓋住。

因為有遮罩，這時候點不到主要內容。通常點一下遮罩，或再按一次按鈕，側邊導覽就會收回去。
-->

---

# 模式示意：push

`mode="push"` 時，側邊導覽展開後將主內容向右推移，並以遮罩覆蓋主內容。

<div class="flex justify-center">
  <img src="/images/48-sidenav/mode-push-demo.png" class="rounded shadow-md max-h-80" />
</div>

<!--
這是 `push` 模式。

跟 `over` 最大的差別是，主要內容整個被往右推開，而不是原地被蓋住。

`push` 一樣有遮罩，所以點擊遮罩收合的行為和 `over` 相同，差別只在視覺的呈現方式。
-->

---

# 模式示意：side

`mode="side"` 時，側邊導覽與主內容並排顯示，主內容寬度自動縮減，不使用遮罩。

<div class="flex justify-center">
  <img src="/images/48-sidenav/mode-side-demo.png" class="rounded shadow-md max-h-80" />
</div>

<!--
這是 `side` 模式，跟前兩種最不一樣。

它完全沒有遮罩，側邊導覽和主要內容並排，主要內容的寬度會自動縮小，把空間讓出來。

因為沒有遮罩，使用者可以同時操作側邊導覽和主要內容，所以比較適合當作常駐的選單，而不是暫時彈出的選單。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# HTML 結構
# HTML Structure

<!--
了解三種模式之後，接下來看 Sidenav 的 HTML 結構怎麼寫。
-->

---

# HTML 結構 (一) — 容器與側邊導覽

使用 `mat-drawer-container` 將整個頁面包裹，側邊導覽內容寫在 `mat-drawer` 中，並以 `#drawer` 樣板變數供按鈕呼叫。

```html
<!-- 導覽最外層 -->
<mat-drawer-container class="example-container" autosize>

  <!-- 側導覽頁面 -->
  <mat-drawer #drawer class="example-sidenav" mode="side">
    <mat-list role="list">
      <mat-list-item role="listitem">頁面1</mat-list-item>
      <mat-list-item role="listitem">頁面2</mat-list-item>
      <mat-list-item role="listitem">頁面3</mat-list-item>
    </mat-list>
  </mat-drawer>
```

<!--
最外層一定要用 `mat-drawer-container` 包起來，這是 Sidenav 運作的必要容器。`autosize` 讓容器依照內容自動調整大小。

裡面的 `mat-drawer` 就是側邊導覽本身，`mode` 設為 side，內容用 `mat-list` 列出導覽項目。

注意 `mat-drawer` 上的井字號 drawer，這是模板變數，等一下按鈕就是透過它來控制側邊導覽的開關。
-->

---

# HTML 結構 (二) — 主內容區與切換按鈕

主內容區寫在 `mat-drawer-container` 內的 `div` 中，使用 `drawer.toggle()` 控制側邊導覽的開關。

```html
  <!-- 導覽內容 -->
  <div class="example-sidenav-content">
    <div>
      <br>
      <h3>網頁內容</h3>
      <button type="button" (click)="drawer.toggle()">
        顯示sidenav
      </button>
    </div>
  </div>

</mat-drawer-container>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>drawer.toggle()</code> 透過樣板變數 <code>#drawer</code> 直接呼叫，無需在 TypeScript 另外定義方法。
</div>

<!--
這頁把 HTML 結構補完。主要內容放在一個 `div` 裡，重點是按鈕上的小括號 `click` 等於 `drawer.toggle()`。

這裡的 drawer，就是前一頁用井字號定義的模板變數。透過它，可以直接呼叫 `mat-drawer` 內建的 `toggle` 方法，不需要在 TypeScript 另外寫控制的方法。

點擊按鈕之後，側邊導覽就會依照設定的模式展開或收合。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# TypeScript 設定
# TypeScript Configuration

<!--
HTML 寫好之後，還要在元件的 TypeScript 匯入對應的模組，畫面才能正確顯示。
-->

---

# TypeScript 設定 — 匯入所需模組

在元件的 TypeScript 檔中匯入 `MatSidenavModule` 與 `MatListModule`，並加入 `imports` 陣列。

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent { }
```

<!--
在元件的 TypeScript 匯入 `MatSidenavModule` 和 `MatListModule`，並加進 `imports` 陣列。

`MatSidenavModule` 提供 `mat-drawer` 和 `mat-drawer-container`，`MatListModule` 提供 `mat-list`。

如果寫了 HTML 標籤卻忘了匯入模組，Angular 會出現找不到元素的錯誤，或是畫面沒有樣式。遇到這種情況，第一件事就是檢查 `imports` 陣列。
-->

---

# 完整使用流程

| 步驟 | 說明 |
|---|---|
| 1 | 在 `.ts` 中匯入 `MatSidenavModule`、`MatListModule` 並加入 `imports` |
| 2 | 在 HTML 以 `<mat-drawer-container>` 包裹整個版面 |
| 3 | 在 `<mat-drawer>` 中撰寫側邊導覽內容（導覽連結清單） |
| 4 | 設定 `mode` 屬性為 `over`、`push` 或 `side` |
| 5 | 在主內容區的按鈕綁定 `(click)="drawer.toggle()"` |
| 6 | 使用樣板變數 `#drawer` 讓按鈕直接控制 drawer |

<!--
這張表把建立 Sidenav 的流程串起來。

匯入兩個模組；用 `mat-drawer-container` 包住整個版面；在 `mat-drawer` 裡寫導覽內容；設定 `mode` 為 over、push 或 side；在主要內容的按鈕綁定 `drawer.toggle()`；最後用井字號 drawer 讓按鈕可以控制它。

如果畫面跑掉或按鈕沒反應，通常就是其中某一步漏了，可以照著這張表逐一檢查。
-->

---
layout: default
---

# 練習：路由導覽側邊選單
### 情境說明

專案的 `app.routes.ts` 定義了一整批頁面路由，隨著頁面越加越多，使用者要在網址列手動輸入路徑才能切換，非常不方便。這一題要用 `mat-sidenav` 做一個導覽選單，把 `app.routes.ts` 裡的所有頁面路徑列出來，點擊就能切換頁面。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**需求**
- 側邊導覽列出 `app.routes.ts` 中幾個代表性頁面路徑
- 每個項目點擊後導向對應頁面，目前所在頁面要有醒目樣式
- 用 `mat-toolbar` 上的漢堡圖示按鈕控制側邊導覽開關

</div>
<div>

**限制**
- 路徑清單存成陣列，用 `@for` 迴圈產生選單項目，不能一條一條手刻
- 導覽用 `routerLink` 指令，不用 `(click)` 手動呼叫 `router.navigate()`
- `mode` 使用 `side`，選單需與主內容並排常駐顯示
- 開關按鈕用 `mat-icon-button` + `mat-icon`，不要用一整顆文字大按鈕

</div>
</div>

<!--
我們來做一個練習。

專案的頁面越來越多，使用者要在網址列手動輸入路徑才能切換，很不方便。這題要用 Sidenav 做一個導覽選單，把幾個代表性的頁面列出來，點擊就能切換，目前所在的頁面要有醒目的樣式，並用工具列上的選單圖示按鈕控制開關。

限制是：路徑清單要存成陣列，用 `@for` 產生選單項目；導覽用 `routerLink`；模式用 side，選單和主要內容並排常駐；開關按鈕用 `mat-icon-button` 加上圖示，而不是一整顆文字按鈕，這也比較接近實務上常見的介面。
-->

---
layout: default
---

# 練習：任務說明

1. 在元件的 TypeScript 中，建立 `pages` 陣列，屬性含 `path`（路由路徑）與 `label`（顯示名稱），內容對應 `app.routes.ts` 中幾個代表性路徑
2. `imports` 陣列加入 `MatSidenavModule`、`MatListModule`、`MatToolbarModule`、`MatIconModule`、`MatButtonModule`、`RouterLink`、`RouterLinkActive`
3. HTML 用 `mat-drawer-container` 包裹版面，`mat-drawer` 設定 `mode="side"` 且預設展開（`opened`）
4. `mat-drawer` 內用 `mat-nav-list` + `@for` 跑過 `pages`，每筆產生一個項目，用 `routerLink` 綁 `page.path`，並用 `routerLinkActive` 加上目前頁面的醒目樣式
5. 主內容區最上方放 `mat-toolbar`，裡面放 `mat-icon-button`（含漢堡圖示 `menu`），綁定 `(click)="drawer.toggle()"`
6. `mat-toolbar` 下方用 `<router-outlet>` 顯示目前頁面內容

<!--
任務有六個步驟。

第一，建立 `pages` 陣列，每筆有 `path` 和 `label`。第二，`imports` 加入需要的 Material 模組，以及 `RouterLink` 和 `RouterLinkActive`。第三，用 `mat-drawer-container` 包住版面，`mat-drawer` 設為 side 並預設展開。第四，用 `mat-nav-list` 搭配 `@for` 產生項目，綁定 `routerLink` 和 `routerLinkActive`。第五，上方放 `mat-toolbar` 和選單圖示按鈕，綁定 `drawer.toggle()`。第六，下方放 `router-outlet`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示

1. `pages` 陣列每個元素長這樣：`{ path: '/home', label: '首頁' }`，`path` 要跟 `app.routes.ts` 裡的 `path` 屬性對得起來
2. `@for (page of pages; track page.path)` — `track` 用 `path` 即可，因為每個路徑是唯一的
3. `mat-icon` 內直接寫 Material 圖示名稱當文字內容即可，例如 `<mat-icon>menu</mat-icon>` 就是漢堡圖示
4. `RouterLink`、`RouterLinkActive` 都要從 `@angular/router` 匯入，不包含在 Material 模組裡
5. `mat-drawer` 要加上 `opened` 屬性，畫面載入時才會預設展開，不然要先按按鈕才看得到選單

<!--
我們來看解題提示。

第一，`pages` 陣列的每一筆，像是 path 為 /home、label 為首頁，`path` 要和 `app.routes.ts` 的路徑對得上。第二，`@for` 的 `track` 用 `page.path` 就好，因為每個路徑都是唯一的。第三，`mat-icon` 裡直接寫圖示名稱，例如 menu 就是選單圖示。第四，`RouterLink` 和 `RouterLinkActive` 要從 `@angular/router` 匯入。第五，`mat-drawer` 要加上 `opened`，畫面載入時才會預設展開。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.ts（一）

匯入模組與元件裝飾器（imports 陣列見下一頁）：

```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidenav-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    // ...接下一頁
```

<!--
我們看完整的解答，先看匯入。

除了之前用過的 `MatSidenavModule` 和 `MatListModule`，這一版多了三個：`MatToolbarModule` 提供頂部工具列，`MatIconModule` 顯示圖示，`MatButtonModule` 提供只有圖示的按鈕。另外，`RouterLinkActive` 用來判斷目前的路由是不是這個連結，等一下要用它加上醒目樣式。
-->

---
zoom: 0.94
layout: default
---

# 完整解答 — sidenav-menu.component.ts（二）

`imports` 陣列其餘部分、`pages` 陣列：

```typescript
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './sidenav-menu.component.html',
  styleUrl: './sidenav-menu.component.scss',
})
export class SidenavMenuComponent {

  // 對應 app.routes.ts 中幾個代表性頁面路徑
  pages = [
    { path: '/home', label: 'Home 首頁' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/cart', label: 'Cart 購物車' },
  ];
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b>這裡只節錄 3 筆示範，實務上可依 <code>app.routes.ts</code> 需要展示的頁面自行增減 <code>pages</code> 陣列內容。
</div>

<!--
接著是 `imports` 陣列的其餘部分，以及 `pages` 陣列。

`pages` 這裡節錄了首頁、Dashboard 和購物車三筆，每一筆都對應 `app.routes.ts` 裡的一條路徑。`label` 只是顯示給使用者看的文字，可以自己取名。實務上要列出更多頁面，只要依照這個格式繼續加就好。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.html（一）

側邊導覽本體，用 `mat-nav-list` 呈現連結清單：

```html
<mat-drawer-container class="menu-container" autosize>

  <mat-drawer #drawer class="menu-sidenav" mode="side" opened>
    <div class="sidenav-header">
      <mat-icon>apps</mat-icon>
      <span>頁面導覽</span>
    </div>
    <mat-nav-list>
      @for (page of pages; track page.path) {
        <a mat-list-item
           [routerLink]="page.path"
           routerLinkActive="active-link">
          {{ page.label }}
        </a>
      }
    </mat-nav-list>
  </mat-drawer>
  <!-- 主內容區見下一頁 -->
```

<!--
接著是 HTML 的側邊導覽部分。

`mat-drawer` 設定 `mode` 為 side，並加上 `opened`。上方是一個簡單的標題區。下面的 `mat-nav-list` 是 Material 專門用來放導覽連結的清單。

重點在 `@for` 裡的 `a` 標籤：中括號 `routerLink` 綁定路徑負責切換頁面；`routerLinkActive` 等於 active-link，代表只要目前的網址符合這個連結，就自動加上 `active-link` 這個 class，等一下 CSS 會用它做醒目的樣式。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.html（二）

頂部工具列與主內容區：

```html
  <mat-drawer-content>
    <mat-toolbar color="primary" class="menu-toolbar">
      <button mat-icon-button (click)="drawer.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>我的應用程式</span>
    </mat-toolbar>

    <div class="menu-content">
      <router-outlet></router-outlet>
    </div>
  </mat-drawer-content>

</mat-drawer-container>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 畫面載入時側邊選單應直接展開，點選單裡任一項目網址列應跟著切換、該項目要呈現醒目樣式，且主內容區顯示對應頁面；點工具列的漢堡圖示，側邊選單應可正常收合與再次展開。
</div>

<!--
接著是工具列和主要內容。

`mat-drawer-content` 是主要內容的容器，和 `mat-drawer` 是同一層，都包在 `mat-drawer-container` 裡。

工具列裡放的是 `mat-icon-button`，搭配 menu 圖示，點擊時一樣呼叫 `drawer.toggle()`。工具列下方用 `router-outlet` 顯示目前的頁面。

驗證的方式是：畫面載入時選單直接展開；點任一項目，網址會切換，該項目呈現醒目樣式，主要內容顯示對應頁面；點選單圖示，側邊導覽可以收合和再次展開。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.scss（一）

容器與側邊導覽的基本版面：

```scss
.menu-container {
  height: 100vh;
}

.menu-sidenav {
  width: 220px;
  border-right: none;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.sidenav-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  font-weight: 600;
  color: #1a5c5c;
}
```

<!--
接著是 SCSS 的第一部分。

`mat-drawer-container` 預設沒有高度，一定要自己設定，選單才會撐開，這裡用 `100vh` 撐滿整個視窗。側邊導覽設定固定寬度 220 像素，拿掉預設的邊框，改用淡淡的陰影。標題區用 flex 把圖示和文字排在同一行。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.scss（二）

工具列與目前頁面的醒目樣式：

```scss
.menu-toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
}

.menu-content {
  padding: 24px;
}

::ng-deep .active-link {
  background: rgba(94, 173, 160, 0.12) !important;
  color: #5eada0 !important;
  font-weight: 600;
  border-radius: 8px;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>易錯點：</b> <code>routerLinkActive</code> 加上去的 class 是套在元件外層產生的元素上，一般 <code>.active-link</code> 選擇器可能吃不到樣式，需要 <code>::ng-deep</code> 才能穿透 Angular 的樣式封裝。
</div>

<!--
SCSS 的第二部分。

工具列加上 `position: sticky`，往下捲動時會固定在頂部。主要內容加上內距，避免內容貼邊。

最後的 `.active-link`，就是目前所在頁面的醒目樣式：淡綠色的背景、文字顏色、加粗和圓角，一眼就能看出現在在哪一頁。

這裡前面加了 `::ng-deep`。因為 Angular 會把每個元件的樣式封裝起來，加在 Material 元件內部元素上的 class，一般的選擇器可能套不到，用 `::ng-deep` 才能穿透這層封裝。
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

# 補充練習 1–2：Mode 切換與除錯實驗

**練習 1：三種顯示模式**

1. 依本章架構建立一組 `mat-drawer` 選單
2. 把 `mode="side"` 依序改成 `"over"`、`"push"`
3. 點擊按鈕開關選單，比較主內容在三種模式下的變化

**練習 2：忘記匯入 MatListModule**

1. 在選單內使用 `<mat-list>` 與 `<mat-list-item>`
2. 故意把 `imports` 陣列中的 `MatListModule` 刪除
3. 觀察 VS Code 與 Console 的錯誤訊息，再補回來

<!--
接下來兩題補充練習。

第一題，把 `mode` 分別改成 side、over、push，開關選單，比較主內容的位置和外觀有什麼不同。

第二題是除錯實驗：把 `MatListModule` 拿掉，看看會出現什麼錯誤。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

| `mode` | 選單展開時，主內容會… |
| --- | --- |
| `side` | 與選單並排，主內容寬度自動縮減 |
| `over` | 不動，選單浮在上方並加上半透明遮罩 |
| `push` | 被選單往右推開，並加上遮罩 |

```text
❌ 'mat-list-item' is not a known element:
   1. If 'mat-list-item' is an Angular component, then verify that it is included in the '@Component.imports' of this component.
```

<!--
我們來看答案。

`side` 模式，選單和主內容並排，主內容會變窄。`over` 模式，主內容不動，選單直接蓋在上面，並出現半透明遮罩。`push` 模式，主內容會被選單往右推開。

拿掉 `MatListModule` 之後，`mat-list-item` 會被當成不認識的元素。用到 Material 的哪個元件，就要匯入它對應的模組。
-->

---
layout: end
---

# 課程結束
### 使用 mat-sidenav 打造具備滑出側邊導覽的 Angular Material 應用程式

<!--
這一章我們學了 Angular Material 的 Sidenav。它有三種模式：`over` 浮在內容上，`push` 把內容推開，`side` 並排常駐。HTML 用 `mat-drawer-container` 包住 `mat-drawer` 和主要內容，透過井字號模板變數呼叫 `toggle` 控制開關，並在 TypeScript 匯入 `MatSidenavModule`。搭配 `routerLink` 和 `routerLinkActive`，就能做出實用的導覽選單。

下一章，我們會學習 Material 的工具列元件 Toolbar。我們下一章見。
-->

