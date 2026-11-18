---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Toolbar
routeAlias: ch49
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
    Toolbar
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「使用 mat-toolbar 打造應用程式頂部導覽列」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們做出了側邊導覽。這一章，我們要學網頁最上方的那條導覽列：Toolbar。

幾乎每個 App 頂部都有一條工具列，放著標題、選單按鈕和通知圖示。自己做的話，光是把按鈕對齊左右兩側就要調很久。學完這一章，我們會用 `mat-toolbar` 快速做出左右對齊的頂部導覽列，也會學到一個實用的排版技巧：Spacer。
-->

---
layout: default
---

# Outline

- **什麼是 Toolbar？** — 工具列的用途與常見應用場景
- **基本 HTML 結構** — 使用 `<mat-toolbar>` 包裹內容
- **Spacer 排版技巧** — 以 CSS flex 將按鈕推至右側
- **引入必要模組** — 在 TypeScript 中 import 所需 Material 模組
- **mat-menu 下拉選單與 matBadge 角標** — 工具列常搭配的兩個延伸元件

<!--
這一章會先說明 Toolbar 是什麼、用在哪裡，接著看它的基本 HTML 結構，然後學習 Spacer 排版技巧，以及 TypeScript 要匯入哪些模組。最後介紹工具列常搭配的下拉選單 `mat-menu` 和角標 `matBadge`，並做一個整合練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 Toolbar？
# What Is a Toolbar?

<!--
網站最上面那條放著 Logo、標題和按鈕的橫條，就是 Toolbar，工具列。
-->

---

# 什麼是 Toolbar？

Toolbar（工具列）通常置於網頁頂部，用於顯示標題或功能按鈕（如登入／登出、開啟側邊導覽列）。

Angular Material 提供 `<mat-toolbar>` 元件，可快速建立符合 Material Design 規範的頂部工具列。

<div class="flex justify-center my-4">
  <img src="/images/49-toolbar/toolbar-preview.png" class="rounded shadow-md max-h-80" />
</div>

<!--
Toolbar 通常放在網頁頂部，用來顯示標題，或放置功能按鈕，例如登入登出、開啟側邊導覽列。

Angular Material 提供了 `mat-toolbar` 元件，不用自己設計版面和樣式，就能做出符合 Material Design 規範的工具列，畫面上就是它的樣子。

在實際專案裡，前台和後台系統的頂部導覽列，大多都會用到它。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 基本 HTML 結構
# Basic HTML Structure

<!--
知道 Toolbar 是什麼之後，我們來看它的 HTML 怎麼寫。
-->

---

# 基本 HTML 結構 — mat-toolbar 範本

將工具列內容包裹於 `<mat-toolbar>` 中。預設情況下，所有子元素會依序靠左排列，需透過 Spacer 將右側按鈕推至最右邊。

```html
<mat-toolbar>
  <button mat-icon-button>
    <mat-icon>menu</mat-icon>
  </button>
  <span>My App</span>
  <span class="example-spacer"></span>
  <button mat-icon-button class="example-icon favorite-icon">
    <mat-icon>favorite</mat-icon>
  </button>
  <button mat-icon-button>
    <mat-icon>share</mat-icon>
  </button>
</mat-toolbar>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 若未加入 Spacer，工具列中的所有內容會擠在左側，無法分散到左右兩側。
</div>

<!--
這個範例要做出：左邊是選單按鈕和標題，右邊是兩個圖示按鈕。

結構很單純，把按鈕和文字都包在 `mat-toolbar` 裡。按鈕用 `mat-icon-button`，裡面放 `mat-icon` 顯示圖示。

注意中間那個空的 `span`，class 是 `example-spacer`。它看起來沒有內容，卻是把左右內容撐開的關鍵。如果沒有它，所有元素會擠在一起，不會自動分散到左右兩側。下一頁我們詳細說明。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Spacer 排版技巧
# Spacer Layout Technique

<!--
剛才留了一個伏筆：那個空空的 Spacer 到底在做什麼？現在來說清楚。
-->

---

# Spacer 排版技巧 — flex 推移按鈕

在 HTML 中放置一個空的 `<span class="example-spacer"></span>`，再於 CSS 中設定其 flex 屬性，即可將後續按鈕推至工具列右側。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**HTML**

```html
<span class="example-spacer"></span>
```

</div>
<div>

**CSS**

```css
.example-spacer {
  flex: 1 1 auto;
}
```

</div>
</div>

`flex: 1 1 auto` 等同於同時設定：

- `flex-grow: 1` — 佔滿剩餘空間
- `flex-shrink: 1` — 可隨容器縮小
- `flex-basis: auto` — 初始大小依內容決定

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> Spacer 的作用是佔滿標題與右側按鈕之間的空間，使右側按鈕靠右對齊。
</div>

<!--
Spacer 的做法，是在 HTML 放一個空的 `span`，再在 CSS 設定它的 `flex` 屬性。

`flex: 1 1 auto` 等於同時設定三件事：`flex-grow: 1`，盡量長大，佔滿剩下的空間；`flex-shrink: 1`，容器變小時可以縮小；`flex-basis: auto`，初始大小由內容決定，因為是空的，所以幾乎是零。

可以把它想成一個彈簧，夾在標題和右側按鈕之間，把剩下的空間全部撐開，右側的按鈕就被推到最右邊了。這是我們在 Flexbox 那一章學過的 `flex` 屬性，這個技巧不只用在工具列，很多需要左右分開的版面都可以用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 引入必要模組
# Importing Required Modules

<!--
版面處理好了，最後看程式碼這邊要準備什麼，元件才能運作。
-->

---

# 引入必要模組 — TypeScript 設定

使用 `<mat-toolbar>`、`<mat-icon>` 與 `mat-icon-button` 時，需在元件的 `imports` 陣列中加入對應模組。

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
```

<!--
要使用 `mat-toolbar`、`mat-icon` 和 `mat-icon-button`，就要在元件的 `imports` 加入對應的模組。

這裡放了三個：`MatToolbarModule` 對應 `mat-toolbar`，`MatIconModule` 對應 `mat-icon`，`MatButtonModule` 對應 `mat-icon-button`。

最常見的錯誤，是漏掉其中一個模組，對應的標籤就不會生效，編輯器也會出現紅色的錯誤提示。
-->

---

# 模組對應表

| 模組 | 套件路徑 | 對應元件／指令 |
|------|----------|----------------|
| `MatToolbarModule` | `@angular/material/toolbar` | `<mat-toolbar>` |
| `MatIconModule` | `@angular/material/icon` | `<mat-icon>` |
| `MatButtonModule` | `@angular/material/button` | `mat-icon-button` 指令 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> 缺少任一模組時，編輯器會顯示紅色錯誤提示；將模組加入 <code>imports</code> 後錯誤即會消失。
</div>

<!--
這張表把三個模組整理起來，包括套件路徑，以及對應到畫面上的哪個標籤或指令。

之後如果編輯器出現紅字，可以查這張表，確認是不是漏了哪個模組。
-->

---

# 完整使用流程

| 步驟 | 說明 |
|------|------|
| 1 | 在 HTML 加入 `<mat-toolbar>` 並於其中放置標題與圖示按鈕 |
| 2 | 插入空的 `<span class="example-spacer"></span>` 以區隔左右內容 |
| 3 | 在 CSS 設定 `.example-spacer { flex: 1 1 auto; }` |
| 4 | 在 .ts 中 import `MatToolbarModule`、`MatIconModule`、`MatButtonModule` |
| 5 | 將三個模組加入元件的 `imports` 陣列 |

<!--
這張表把整個流程串起來。

在 HTML 加上 `mat-toolbar`，放進標題和圖示按鈕；插入一個空的 `span` 區隔左右內容；在 CSS 設定 `flex: 1 1 auto`；最後在 TypeScript 匯入三個模組，並加進 `imports` 陣列。

照著這五步，一個標準的頂部導覽列就完成了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# mat-menu 與 matBadge
# Dropdown Menu & Badge

<!--
工具列常搭配兩個元件：下拉選單 `mat-menu`，以及顯示數字的角標 `matBadge`。
-->

---

# mat-menu — 下拉選單

`mat-menu` 是 Material 提供的下拉選單元件，點擊觸發按鈕才顯示選單內容，常用於使用者頭像選單、「更多操作」按鈕。

```html
<button mat-icon-button [matMenuTriggerFor]="menu">
  <mat-icon>more_vert</mat-icon>
</button>

<mat-menu #menu="matMenu">
  <button mat-menu-item>選項一</button>
  <button mat-menu-item>選項二</button>
</mat-menu>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>mat-menu</code> 要用 <code>#menu="matMenu"</code> 給樣板變數，按鈕才能用 <code>[matMenuTriggerFor]="menu"</code> 綁定要開啟哪一個選單。
</div>

<!--
`mat-menu` 是 Material 的下拉選單元件。平常是隱藏的，點擊觸發按鈕才會浮出來，點選單外面會自動關閉，常用在使用者頭像選單，或「更多操作」按鈕。

看結構：觸發按鈕上用中括號 `matMenuTriggerFor`，指向一個模板變數。這個模板變數寫在 `mat-menu` 上，而且一定要寫成井字號 menu 等於 matMenu，這是固定寫法。選單裡的每個項目用 `mat-menu-item`。

最常卡住的地方，是忘了寫等於 matMenu，或 `matMenuTriggerFor` 指錯了名稱，點按鈕就不會有任何反應。
-->

---

# mat-menu — 匯入模組

使用 `mat-menu`、`mat-menu-item` 與 `matMenuTriggerFor` 前，需匯入 `MatMenuModule`。

```typescript
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatMenuModule],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

<!--
跟其他 Material 元件一樣，用到 `mat-menu` 就要匯入對應的模組，也就是從 `@angular/material/menu` 匯入 `MatMenuModule`。

忘記匯入的話，`matMenuTriggerFor` 會直接報錯，說找不到這個指令。
-->

---

# matBadge — 角標提示

`matBadge` 是一個指令，可以直接疊加在任何元素右上角，顯示一個小圓形數字或文字角標，常用於通知未讀數量。

```html
<button mat-icon-button matBadge="3" matBadgeColor="warn">
  <mat-icon>notifications</mat-icon>
</button>
```

```typescript
import { MatBadgeModule } from '@angular/material/badge';
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> <code>matBadge</code> 直接寫值即可（字串或數字），<code>matBadgeColor</code> 可設定 <code>primary</code>、<code>accent</code>、<code>warn</code> 三種顏色。
</div>

<!--
`matBadge` 是一個指令，可以直接加在任何元素上，在它的右上角顯示一個小圓形的數字或文字，常用來顯示未讀通知的數量。

這裡在通知圖示的按鈕上，加了 `matBadge` 等於 3，`matBadgeColor` 設為 warn，也就是紅色，比較醒目。顏色可以是 primary、accent 或 warn。

使用前要從 `@angular/material/badge` 匯入 `MatBadgeModule`。
-->

---
layout: default
---

# 練習：整合 Sidenav 的應用程式頂部列
### 情境說明

業界後台系統的頂部列，通常不只有標題，右側還會有通知鈴鐺（帶未讀數字角標）跟使用者頭像，點頭像會彈出選單顯示「個人資料」「登出」。這一題延續 `ch48-sidenav` 練習做出來的 `sidenav-menu.component`，把它的 `mat-toolbar` 從陽春版擴充成業界常見的完整頂部列。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**需求**
- 沿用 ch48 的漢堡按鈕 + 標題，維持左側原樣
- 標題右側加通知圖示，用角標顯示未讀數量
- 最右側加使用者頭像圖示，點擊彈出選單

</div>
<div>

**限制**
- 標題與右側按鈕之間用 Spacer 技巧撐開，不能用 `margin-left`
- 未讀角標用 `MatBadgeModule` 的 `matBadge`，不要手刻圓角 `div`
- 下拉選單用 `MatMenuModule`，不要自己寫 `*ngIf` 控制顯示/隱藏

</div>
</div>

<!--
我們來做一個練習。

後台系統的頂部列，右側通常有帶未讀數字的通知鈴鐺，以及點擊後彈出選單的使用者頭像。這題延續上一章的 `sidenav-menu` 元件，只要擴充工具列的內容。

限制是：用 Spacer 撐開左右，不能用 margin；角標用 `matBadge`；下拉選單用 `mat-menu`，不要自己寫顯示和隱藏的邏輯。
-->

---
layout: default
---

# 練習：任務說明

1. 延續 ch48 的 `sidenav-menu.component.ts`，`imports` 陣列新增 `MatMenuModule`、`MatBadgeModule`
2. `mat-toolbar` 內，標題 `<span>` 後面加一個空的 `<span class="toolbar-spacer"></span>`
3. Spacer 後面加一個通知圖示按鈕，用 `matBadge="3" matBadgeColor="warn"` 顯示未讀角標
4. 再加一個使用者頭像圖示按鈕，用 `[matMenuTriggerFor]="userMenu"` 綁定下拉選單
5. 在 `mat-toolbar` 外面新增 `<mat-menu #userMenu="matMenu">`，內含「個人資料」與「登出」兩個 `mat-menu-item`
6. 在 TypeScript 中新增 `logout()` 方法，「登出」項目綁定 `(click)="logout()"`
7. 在 `.scss` 中為 `.toolbar-spacer` 設定 `flex: 1 1 auto`

<!--
任務有七個步驟。

第一，在 `imports` 新增 `MatMenuModule` 和 `MatBadgeModule`。第二，在工具列的標題後面加一個空的 Spacer。第三，Spacer 後面加上通知圖示按鈕，用 `matBadge` 顯示角標。第四，再加一個頭像圖示按鈕，用 `matMenuTriggerFor` 綁定選單。第五，在工具列外面加上 `mat-menu`，裡面有個人資料和登出兩個項目。第六，在 TypeScript 新增 `logout` 方法，綁定到登出項目。第七，在 SCSS 設定 Spacer 的 `flex`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：解題提示

1. `mat-menu` 一定要有樣板變數並指定 `="matMenu"`：`<mat-menu #userMenu="matMenu">`，這個變數才能被 `[matMenuTriggerFor]` 引用
2. `matBadge` 直接寫在要顯示角標的元素上即可：`<button mat-icon-button matBadge="3" matBadgeColor="warn">`
3. `mat-menu-item` 裡可以直接放 `mat-icon` + `span`，兩者並排顯示圖示加文字
4. `MatMenuModule` 對應套件路徑是 `@angular/material/menu`；`MatBadgeModule` 對應 `@angular/material/badge`
5. `.toolbar-spacer` 的效果跟 ch49 教過的 `example-spacer`完全相同，只是換了 class 名稱

<!--
我們來看解題提示。

第一，`mat-menu` 一定要有模板變數，並寫成等於 matMenu，才能被 `matMenuTriggerFor` 引用。第二，`matBadge` 直接寫在要顯示角標的元素上。第三，`mat-menu-item` 裡可以同時放圖示和文字。第四，兩個模組的套件路徑分別是 menu 和 badge。第五，`.toolbar-spacer` 跟剛才的 `example-spacer` 效果完全一樣，只是換了名稱。

另外，`mat-menu` 要和工具列放在同一層，而不是包在工具列裡面，因為它是一個浮動的面板。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.ts（新增部分）

延續 ch48 的元件，只列出這一題新增的部分：

```typescript
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

// imports 陣列新增：MatMenuModule、MatBadgeModule

export class SidenavMenuComponent {
  // ...pages 陣列沿用 ch48，維持不變

  logout(): void {
    console.log('使用者已登出');
  }
}
```

<!--
我們看完整的解答，先看 TypeScript 新增的部分。

匯入 `MatMenuModule` 和 `MatBadgeModule`，並加進 `imports` 陣列。新增一個 `logout` 方法，這裡先用 `console.log` 模擬登出。實務上，這裡通常會清除登入的資訊，並導回登入頁。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.html（整體結構）

先看整個檔案的骨架，確認 `mat-toolbar` 在哪個位置，內容下一頁再放大看：

```html
<mat-drawer-container class="menu-container" autosize>

  <mat-drawer #drawer class="menu-sidenav" mode="side" opened>
    <!-- 側邊選單內容沿用 ch48，不變 -->
  </mat-drawer>

  <mat-drawer-content>
    <mat-toolbar color="primary" class="menu-toolbar">
      <!-- 工具列內容，見下一頁 -->
    </mat-toolbar>

    <div class="menu-content">
      <router-outlet></router-outlet>
    </div>
  </mat-drawer-content>

</mat-drawer-container>
```

<!--
這頁是 HTML 的整體結構。

側邊選單的 `mat-drawer`，以及主要內容裡的 `router-outlet`，都維持上一章的寫法。唯一要修改的，是 `mat-drawer-content` 開頭、`router-outlet` 上方的 `mat-toolbar`。下一頁把它放大來看。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.html（工具列內容）

承接上一頁，`mat-toolbar` 內容從陽春版擴充成含 Spacer、通知、使用者選單：

```html
    <mat-toolbar color="primary" class="menu-toolbar">
      <button mat-icon-button (click)="drawer.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>我的應用程式</span>

      <span class="toolbar-spacer"></span>

      <button mat-icon-button matBadge="3" matBadgeColor="warn">
        <mat-icon>notifications</mat-icon>
      </button>

      <button mat-icon-button [matMenuTriggerFor]="userMenu">
        <mat-icon>account_circle</mat-icon>
      </button>
    </mat-toolbar>
```

<!--
這頁是工具列的內容。

前面的選單按鈕和標題沿用上一章，沒有改動。接著是 `toolbar-spacer`，把標題和右側的按鈕撐開。

通知圖示按鈕加上 `matBadge` 等於 3，畫面上會在圖示右上角顯示紅色的數字 3。最後的頭像圖示按鈕，用 `matMenuTriggerFor` 指向 `userMenu`，也就是下一頁定義的選單。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.html（使用者選單）

`mat-menu` 要寫在 `</mat-drawer-container>` 外面，是整份模板最外層的兄弟元素：

```html
</mat-drawer-container>

<mat-menu #userMenu="matMenu">
  <button mat-menu-item>
    <mat-icon>person</mat-icon>
    <span>個人資料</span>
  </button>
  <button mat-menu-item (click)="logout()">
    <mat-icon>logout</mat-icon>
    <span>登出</span>
  </button>
</mat-menu>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 點頭像圖示應彈出選單，顯示「個人資料」「登出」兩個選項；點「登出」應在 Console 看到登出訊息，且選單自動關閉（這是 mat-menu-item 的內建行為）。
</div>

<!--
這頁是使用者選單。

`mat-menu` 寫在 `mat-drawer-container` 的外面，是整份模板最外層的元素。它是浮動的面板，Angular Material 會在點擊時自動計算位置，所以不受它寫在哪裡影響。

模板變數是井字號 userMenu 等於 matMenu。裡面有兩個項目，各自有圖示和文字，登出項目用小括號 `click` 綁定 `logout`。

驗證的方式是：點擊頭像會彈出選單；點擊登出，Console 會印出訊息，選單也會自動關閉，這是 `mat-menu-item` 內建的行為。
-->

---
layout: default
---

# 完整解答 — sidenav-menu.component.scss（Spacer）

```scss
.toolbar-spacer {
  flex: 1 1 auto;
}
```

<!--
最後是 SCSS 裡的 Spacer。

`.toolbar-spacer` 設定 `flex: 1 1 auto`，原理和前面的 `example-spacer` 完全一樣，讓這個空的 `span` 撐開空間，把標題留在左邊，通知和頭像推到右邊。`mat-toolbar` 本身就是 flex 容器，所以不用另外設定 `display: flex`。

做完這題，就把側邊導覽、工具列、Spacer、角標和使用者選單整合起來，已經很接近業界後台系統的標準版面了。
-->

---
layout: end
---

# 課程結束
### 善用 mat-toolbar 與 Spacer 技巧，打造整齊美觀的 Angular 頂部導覽列

<!--
這一章我們學了 `mat-toolbar`。用它包住標題和圖示按鈕，再用一個設定 `flex: 1 1 auto` 的空 `span` 當作 Spacer，就能讓內容左右分開。記得匯入 Toolbar、Icon 和 Button 三個模組。另外，`mat-menu` 用模板變數和 `matMenuTriggerFor` 做出下拉選單，`matBadge` 則在圖示上顯示角標。

下一章，我們會學習 Material 的單選框和勾選框。我們下一章見。
-->

