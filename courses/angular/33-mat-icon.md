---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Mat-icon
routeAlias: ch33
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
    Mat-icon
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「在 Angular 中使用 Material Icon 美化你的介面」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們用 `mat-table` 做出了表格。這一章，我們要學 Angular Material 的圖示元件：`mat-icon`。

如果介面上只有文字按鈕，使用者要花比較多時間理解每個按鈕的功能。加上清楚的圖示，例如放大鏡代表搜尋、垃圾桶代表刪除，操作就直覺很多。

學完這一章，我們會知道怎麼使用 `mat-icon`，去哪裡找想要的圖示，以及怎麼替換成其他圖示。
-->

---
layout: default
---

# Outline

- **什麼是 icon？** — 圖示的定義與在 Angular 中的角色
- **使用 Mat-icon** — 官方文件、安裝方式與基本用法
- **引入 MatIconModule** — 在 TypeScript 中正確 import
- **瀏覽 Google Fonts Icons** — 搜尋並選用你想要的 icon
- **切換 icon** — 修改 fontIcon 屬性更換圖示

<!--
這一章會先說明什麼是 icon，接著實際使用 `mat-icon`，處理模組的匯入。然後到 Google Fonts Icons 網站挑選圖示，最後示範怎麼把圖示換成我們想要的樣子。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 icon？
# What Is an Icon?

<!--
我們常常先看圖示，就知道按鈕在做什麼，這就是 icon 的作用。
-->

---

# 什麼是 icon？

Icon（圖示）是用來指示操作的視覺符號。Angular Material 提供 `<mat-icon>` 元件，可在介面中快速插入 Google Material Icons。

<div class="flex justify-center">
  <img src="/images/33-mat-icon/icon-concept-preview.png" class="rounded shadow-md max-h-64" />
</div>

<!--
Icon，也就是圖示，是用來指示操作的視覺符號，例如齒輪代表設定、信封代表訊息。

Angular Material 提供了 `mat-icon` 元件，可以直接插入 Google Material Icons 這套現成的圖示庫，不用自己找圖片、切圖或調整大小。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 使用 Mat-icon
# Using Mat-icon

<!--
接下來我們實際動手，從官方文件的範例開始，一步一步把 `mat-icon` 加到專案裡。
-->

---

# 使用 Mat-icon — 官方文件

前往 Angular Material 官方文件查看 icon 的使用範例與程式碼：

**https://material.angular.io/components/icon/overview**

<div class="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
  <p class="text-sm text-gray-500 mb-2 font-semibold">Basic icons</p>
  <p class="text-2xl">🏠</p>
</div>

<!--
要使用 `mat-icon`，第一步是到 Angular Material 的官方文件查看範例，網址就在畫面上。

這是一個很好的習慣：之後遇到不熟悉的元件，先去官方文件看範例，照著範例寫，通常就能快速上手。
-->

---

# 使用 Mat-icon — 新增 HTML

依官方範例在 HTML 加入 `<mat-icon>` 標籤。此時編輯器會顯示紅色錯誤，因為 TS 尚未匯入 `MatIconModule`。

```html
<mat-icon aria-hidden="false" aria-label="Example home icon" fontIcon="home"></mat-icon>
```

<!--
照著官方範例，在 HTML 加上 `mat-icon` 標籤。這裡的 `fontIcon` 等於 home，代表要顯示的是首頁的圖示。另外兩個 `aria` 開頭的屬性，是給螢幕報讀軟體使用的無障礙設定。

貼上之後，編輯器會出現紅色的錯誤。這是正常的，因為我們還沒在 TypeScript 匯入 `MatIconModule`，Angular 還不認識 `mat-icon` 這個標籤。
-->

---

# 使用 Mat-icon — 引入 MatIconModule

TS 中只需 import `MatIconModule`，加入 `imports` 陣列後錯誤即消失：

```typescript
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

<!--
解決方法是從 `@angular/material/icon` 引入 `MatIconModule`，並加進 `@Component` 的 `imports` 陣列。

跟前面學過的元件一樣，只寫 `import` 是不夠的，一定要加進 `imports` 陣列。加好之後，錯誤就會消失，畫面上也會出現一個首頁的圖示。
-->

---

# 瀏覽 Google Fonts Icons

設定完成後 icon 即可正常顯示。若要替換其他 icon，至以下網站搜尋並預覽所有可用的 Material Icon：

**https://fonts.google.com/icons**

<div class="flex justify-center">
  <img src="/images/33-mat-icon/icon-browser.png" class="rounded shadow-md max-h-96" />
</div>

<!--
圖示可以正常顯示了。但如果想要的不是首頁圖示，而是其他圖示呢？

這時候可以到畫面上的 Google Fonts Icons 網站，裡面有非常多 Material 圖示可以搜尋和預覽。輸入關鍵字，例如 search、delete、menu，就能找到對應的圖示。
-->

---
layout: two-cols
---

# 切換 icon — 修改 fontIcon

找到目標 icon 後，將 `<mat-icon>` 的 `fontIcon` 屬性值改為 icon 名稱（全小寫，空格改底線，例如 `Arrow Back` → `arrow_back`）。

例如在 Google Fonts Icons 找到 **Menu** 後：

```html
<mat-icon aria-hidden="false" fontIcon="menu"></mat-icon>
```

- 網站顯示：`Menu`
- 放入 `fontIcon`：`menu`（全小寫）

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/33-mat-icon/menu-icon-example.png" class="rounded shadow-md max-h-80" />
</div>

<!--
找到想要的圖示之後，只要把 `mat-icon` 的 `fontIcon` 屬性，改成那個圖示的名稱就好。

這裡有一個小細節要注意：網站上顯示的名稱，通常是大寫開頭、單字之間有空格，例如 Arrow Back。但填進 `fontIcon` 時，要全部改成小寫，空格改成底線，寫成 arrow_back。

所以在網站上找到 Menu，`fontIcon` 就填入小寫的 menu，右邊就是顯示出來的選單圖示。
-->

---

# Mat-icon 完整使用流程

| 步驟 | 說明 |
|------|------|
| 1 | 前往 [material.angular.io/components/icon/overview](https://material.angular.io/components/icon/overview) 查看官方文件 |
| 2 | 在 HTML 加入 `<mat-icon fontIcon="home"></mat-icon>` |
| 3 | 在 .ts 中 `import { MatIconModule } from '@angular/material/icon'` 並加入 `imports` |
| 4 | 前往 [fonts.google.com/icons](https://fonts.google.com/icons) 搜尋想要的 icon |
| 5 | 將 `fontIcon` 的值改為目標 icon 名稱（全小寫、空格改底線） |

<!--
這張表把整個使用流程整理成五個步驟。

第一，到官方文件查看範例。第二，在 HTML 加上 `mat-icon` 標籤。第三，在 TypeScript 引入 `MatIconModule`，並加進 `imports`。第四，到 Google Fonts Icons 搜尋想要的圖示。第五，把 `fontIcon` 改成圖示名稱，記得全小寫、空格改底線。

之後要使用新的圖示，照著這張表做就可以了。
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

# 補充練習 1–2：註冊模組與常用圖示

**練習 1：**

1. 在 `app.component.ts` 的 `imports` 陣列補上 `MatIconModule`
2. 在 HTML 加入 `<mat-icon fontIcon="home"></mat-icon>`
3. 確認畫面上出現房子圖示

**練習 2：**

前往 Google Fonts 的 Material Symbols 網站，在 HTML 並排顯示以下 4 個常用圖示：

- `search`（搜尋）　- `settings`（設定）　- `delete`（刪除）　- `favorite`（收藏）

<!--
接下來兩題補充練習。

第一題，把 `MatIconModule` 註冊好，顯示一個房子圖示。第二題，到 Google Fonts 查詢圖示名稱，把搜尋、設定、刪除、收藏這四個常用圖示並排顯示出來。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [MatIconModule],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

```html
<mat-icon fontIcon="home"></mat-icon>

<mat-icon fontIcon="search"></mat-icon>
<mat-icon fontIcon="settings"></mat-icon>
<mat-icon fontIcon="delete"></mat-icon>
<mat-icon fontIcon="favorite"></mat-icon>
```

<!--
我們來看答案。

先從 `@angular/material/icon` 匯入 `MatIconModule`，加進 `imports` 陣列，HTML 才認得 `mat-icon` 標籤。

要換圖示，只要改 `fontIcon` 的值。圖示名稱可以在 Google Fonts 的 Material Symbols 搜尋，點選圖示後就能看到它的名稱。
-->

---
layout: default
---

# 補充練習 3：點擊切換愛心圖示

結合「屬性繫結」與 `mat-icon`，做出點擊後「空心變實心」的愛心：

1. 在 TS 宣告 `myCurrentIcon: string = 'favorite_border';`（空心愛心）
2. 撰寫方法 `changeMyIcon()`，點擊後改成 `'favorite'`（實心愛心）
3. 用 `[fontIcon]="myCurrentIcon"` 綁定圖示，並綁定 `(click)="changeMyIcon()"`
4. 點擊網頁上的愛心，觀察外觀是否切換

<!--
第三題補充練習，做一個可以點擊的愛心。

把圖示名稱放進變數 `myCurrentIcon`，用中括號 `fontIcon` 綁定它；點擊時把變數換成實心愛心的名稱，圖示就會跟著改變。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：點擊切換愛心圖示 — 參考答案

```typescript
myCurrentIcon: string = 'favorite_border';

changeMyIcon() {
  this.myCurrentIcon = 'favorite';
}
```

```html
<mat-icon [fontIcon]="myCurrentIcon" (click)="changeMyIcon()"></mat-icon>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 進階：改成 <code>this.myCurrentIcon = this.myCurrentIcon === 'favorite' ? 'favorite_border' : 'favorite';</code>，就能來回切換
</div>

<!--
我們來看答案。

`fontIcon` 加上中括號，就變成屬性繫結，值會從 TS 的 `myCurrentIcon` 讀取。點擊時 `changeMyIcon` 把變數改成 `favorite`，畫面就從空心愛心變成實心愛心。

如果想要再點一次變回空心，可以用三元運算子判斷目前的值，來回切換。
-->

---
layout: end
---

# 課程結束
### 善用 Mat-icon，讓你的 Angular 介面更直覺、更美觀

<!--
這一章我們學會了用 `mat-icon` 加入圖示。在 HTML 使用 `mat-icon` 標籤，用 `fontIcon` 指定圖示名稱，並在 TypeScript 匯入 `MatIconModule`。想換圖示，就到 Google Fonts Icons 搜尋，把名稱改成小寫，空格換成底線。

下一章，我們會學習 Material 的日期選擇器。我們下一章見。
-->
