---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Tabs
routeAlias: ch39
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
    Tabs
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用索引標籤在同一頁面切換多個視圖」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學了 `ngClass`。這一章要學 Tabs，索引標籤。

設定頁面常有帳號、隱私、通知幾個分頁，用 Tabs 就能在同一個畫面切換內容。學完這一章，我們會使用兩種頁籤元件：放靜態內容的 `mat-tab-group`，以及可以和路由整合的 `mat-tab-nav-bar`。
-->

---
layout: default
---

# Outline

- **什麼是 Tabs？** — 索引標籤的概念與應用場景
- **mat-tab-group 基本用法** — 靜態內容頁籤
- **mat-tab-nav-bar 導覽列用法** — 與路由整合的動態頁籤
- **TypeScript 設定** — 匯入模組、定義 links 與 activeLink
- **路由設定** — child routes 的配置方式
- **HTML 完整整合** — 綁定路由與 active 狀態
- **完成畫面展示** — 頁籤切換成功

<!--
這一章會先說明什麼是 Tabs，接著看最簡單的 `mat-tab-group` 靜態用法。然後進入重點 `mat-tab-nav-bar`，看它的 HTML 結構、TypeScript 設定，以及路由要怎麼配置。最後看實際完成的畫面，並把整個流程整理一遍。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 Tabs？
# What Are Tabs?

<!--
我們先建立 Tabs 的基本概念，之後看程式碼時，才知道每個元件在解決什麼問題。
-->

---
layout: two-cols
---

# 什麼是 Tabs？

Tabs（索引標籤）是一種常見的 UI 元件，廣泛應用於網頁導覽、設定介面和表單中。

**核心概念**

- 在同一頁面中切換多個視圖
- 同一時間只顯示一個頁籤的內容
- 使用者點擊標籤標題來切換

**常見應用場景**

- 網頁導覽列 / 設定介面分類
- 表單多步驟切換 / 儀表板資料視圖

::right::

<div class="flex items-center justify-center h-full">
  <img src="/images/39-tabs/tabs-concept-overview.png" class="rounded shadow-md max-h-80" />
</div>

<!--
Tabs 就像資料夾上的分類標籤。抽屜裡有很多資料夾，每個都有自己的標籤名稱，要看哪一類，就把那一份抽出來，其他的先收著。

網頁上的 Tabs 也一樣，核心概念有三點：在同一個頁面切換多個視圖，同一時間只顯示一個頁籤的內容，使用者點擊標題就能切換。

它的應用場景很多，例如網站的導覽列、設定介面的分類、多步驟的表單，以及儀表板的不同資料視圖。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# mat-tab-group 基本用法
# Basic Tab Group

<!--
我們先從最簡單的 `mat-tab-group` 開始，這是放靜態內容的寫法，還不涉及路由。
-->

---

# mat-tab-group — 官方範例

Angular Material 的 `mat-tab-group` 提供靜態頁籤切換，畫面有 First、Second、Third 三個頁籤。

<div class="flex justify-center">
  <img src="/images/39-tabs/mat-tab-group-basic-demo.png" class="rounded shadow-md max-h-80" />
</div>

參考：**https://material.angular.io/components/tabs/overview**

<!--
這是 Angular Material 官方範例的畫面，有 First、Second、Third 三個頁籤，點擊不同的標題，下方的內容就會跟著切換。

官網的網址就在畫面下方，上面有可以互動的範例。查詢元件用法時，官網是很好的參考資源。
-->

---

# mat-tab-group — HTML 語法

使用 `<mat-tab-group>` 包裹多個 `<mat-tab>`，`label` 屬性設定頁籤名稱，標籤內容直接寫在標籤內部。

```html
<mat-tab-group>
  <mat-tab label="First"> Content 1 </mat-tab>
  <mat-tab label="Second"> Content 2 </mat-tab>
  <mat-tab label="Third"> Content 3 </mat-tab>
</mat-tab-group>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 此寫法適合頁籤內容為純文字的靜態情境。若需與路由整合，應改用 <code>mat-tab-nav-bar</code>。
</div>

<!--
`mat-tab-group` 的寫法很單純。

用 `mat-tab-group` 包住好幾個 `mat-tab`，每個 `mat-tab` 用 `label` 屬性設定標題，內容就直接寫在標籤裡面。這裡的 Content 1、2、3 都是寫死的文字。

這種寫法適合頁籤內容是固定的情況。如果每個頁籤其實是不同的頁面，需要跟著網址切換，就要改用接下來介紹的 `mat-tab-nav-bar`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# mat-tab-nav-bar 導覽列用法
# Tab Nav Bar with Router

<!--
接下來是這一章的重點：`mat-tab-nav-bar`。它和 `mat-tab-group` 最大的差別，是可以和 Angular 的路由整合，讓每個頁籤對應不同的網址。
-->

---

# mat-tab-nav-bar — 概念說明

`mat-tab-nav-bar` 是與路由整合的頁籤導覽列，適合多頁路由切換場景。

| 元件／指令 | 說明 |
|---|---|
| `mat-tab-nav-bar` | 頁籤導覽列容器，套用 Material 樣式 |
| `[tabPanel]` | 綁定對應的 `<mat-tab-nav-panel>` |
| `mat-tab-link` | 每個頁籤連結，套用 Material 樣式 |
| `[active]` | 判斷此連結是否為當前作用中頁籤 |
| `[routerLink]` | 綁定路由路徑 |
| `mat-tab-nav-panel` | 頁籤內容顯示區，搭配 `#tabPanel` 樣板變數 |

<!--
`mat-tab-nav-bar` 可以說是「長得像頁籤的導覽列」。就像餐廳菜單上的主餐、飲料、甜點分類，點下去其實是切換到不同的頁面，只是用頁籤的樣式呈現。內容不是寫死的，而是跟著路由切換。

表格裡的元件和屬性，先有個印象就好。`mat-tab-nav-bar` 是外層容器，`mat-tab-link` 是每個連結，中括號 `active` 判斷哪個是目前的頁籤，中括號 `routerLink` 綁定路由路徑，`mat-tab-nav-panel` 是內容顯示的區域。

實務上，這種寫法很常用在後台系統的導覽，或是同一個功能底下有好幾個子頁面的情況。
-->

---

# mat-tab-nav-bar — HTML 結構 (一)

基本導覽列結構：`<nav>` 內透過 `@for` 迴圈產生頁籤連結，並搭配一個停用的 `Disabled Link`。

```html
<nav mat-tab-nav-bar [tabPanel]="tabPanel">
  @for (link of links; track link) {
    <a mat-tab-link
       (click)="activeLink = link"
       [active]="activeLink == link"> {{link}} </a>
  }
  <a mat-tab-link disabled>Disabled Link</a>
</nav>
<mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> <code>@for</code> 迴圈依據 TypeScript 中定義的 <code>links</code> 陣列產生對應數量的頁籤。若 TS 尚未定義 <code>links</code>，程式會報錯。
</div>

<!--
我們先看最基本的結構，還沒有整合路由。

`nav` 標籤加上 `mat-tab-nav-bar`，並用中括號 `tabPanel` 綁定下方的 `mat-tab-nav-panel`。裡面用 `@for` 走過 `links` 陣列，每一筆產生一個 `mat-tab-link`。點擊時，把 `activeLink` 設成這個連結；中括號 `active` 判斷這個連結是不是目前選中的。最後還有一個加了 `disabled` 的連結，示範停用的樣子。

要注意，`links` 陣列必須先在 TypeScript 裡定義好，`@for` 才有資料可以跑，否則會報錯。

這個版本只是畫面切換，還沒有真的換頁，下一頁再把它和路由接起來。
-->

---

# mat-tab-nav-bar — HTML 結構 (二)

整合路由後，`[routerLink]` 綁定路徑，`[active]` 比對 `link.name`，`<router-outlet>` 顯示對應路由內容。

```html
<nav mat-tab-nav-bar [tabPanel]="tabPanel">
  @for (link of links; track link) {
    <a mat-tab-link
       (click)="activeLink = link.name"
       [routerLink]="link.path"
       [active]="activeLink == link.name"> {{link.name}} </a>
  }
  <a mat-tab-link disabled>Disabled Link</a>
</nav>
<mat-tab-nav-panel #tabPanel>
  <router-outlet></router-outlet>
</mat-tab-nav-panel>
```

<!--
這一版正式整合了路由。

跟上一頁比較，`links` 的每一筆現在是一個物件，有 `path` 和 `name` 兩個屬性。點擊時，把 `activeLink` 設成 `link.name`；多了中括號 `routerLink` 綁定 `link.path`；`active` 的判斷也改成比對 `link.name`。

最後，在 `mat-tab-nav-panel` 裡放上 `router-outlet`。點擊頁籤時，網址會跟著改變，對應的路由元件就會顯示在這個位置。

要注意 `link` 現在是物件，綁定時要分清楚 `link`、`link.name` 和 `link.path`。
-->

---

# mat-tab-nav-bar — 屬性說明

| 屬性／事件 | 位置 | 說明 |
|---|---|---|
| `mat-tab-nav-bar` | `<nav>` | 套用 Material 頁籤導覽列樣式 |
| `[tabPanel]="tabPanel"` | `<nav>` | 將導覽列與下方面板做綁定 |
| `mat-tab-link` | `<a>` | 套用 Material 頁籤連結樣式 |
| `(click)="activeLink = link.name"` | `<a>` | 點擊後更新 activeLink |
| `[routerLink]="link.path"` | `<a>` | 導向對應的路由路徑 |
| `[active]="activeLink == link.name"` | `<a>` | 判斷是否為作用中頁籤，成立時顯示底線 |
| `disabled` | `<a>` | 停用此頁籤連結 |

<!--
這張表整理了剛才看過的屬性，我們挑幾個容易混淆的來說。

中括號 `tabPanel` 負責把導覽列和下方的內容面板綁在一起。中括號 `active` 控制哪個頁籤要顯示底線。

小括號 `click` 和中括號 `routerLink` 是分工合作的：`routerLink` 負責真正切換路由，`click` 負責更新我們自己追蹤的 `activeLink`，兩個都要設定。

之後忘記某個屬性的用途時，可以回來查這張表。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# TypeScript 設定
# TypeScript Configuration

<!--
HTML 的部分看完了，接著回到 TypeScript，看看要匯入哪些模組、定義哪些變數。
-->

---

# 步驟一：匯入 MatTabsModule

在元件的 TypeScript 檔中匯入 `MatTabsModule` 並加入 `imports` 陣列。

```typescript
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTabsModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // 下一步定義 links 與 activeLink
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 若使用 <code>[routerLink]</code>，需同時匯入 <code>RouterLink</code>；使用 <code>&lt;router-outlet&gt;</code> 則需匯入 <code>RouterOutlet</code>。
</div>

<!--
第一步，在元件的 TypeScript 匯入 `MatTabsModule`，加進 `imports` 陣列。

這裡同時匯入了三個東西：`MatTabsModule` 讓我們能使用頁籤相關的元件；`RouterLink` 讓 `routerLink` 綁定生效；`RouterOutlet` 讓 `router-outlet` 能運作。

很多人只記得匯入 `MatTabsModule`，卻忘了 `RouterLink` 和 `RouterOutlet`。獨立元件在模板裡用到的每個功能，都要各自匯入對應的模組，少了就會報錯。
-->

---

# 步驟二：定義 links 與 activeLink

在元件類別中定義頁籤資料陣列 `links` 與目前作用中頁籤 `activeLink`。

```typescript
links = [
  { path: '/test/test1', name: 'TEST'  },
  { path: '/test/test2', name: 'TEST2' },
  { path: '/test/test3', name: 'TEST3' }
];

activeLink = this.links[0].name;
```

- `links`：每個物件包含路由路徑 `path` 與顯示名稱 `name`
- `activeLink`：初始值設為第一個頁籤的名稱
- 路由設定（`app.routes.ts`）需有對應的路由才能正常切換

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>activeLink</code> 與 HTML 中 <code>[active]="activeLink == link.name"</code> 的比對邏輯需一致，才能正確顯示底線。
</div>

<!--
第二步，在元件裡定義 `links` 和 `activeLink`。

`links` 是一個物件陣列，就像頁籤的名單，每一筆有路由路徑 `path` 和顯示名稱 `name`。`activeLink` 的初始值設成第一筆的名稱，代表頁面載入時，預設選中第一個頁籤。

這裡有兩個要注意的地方。第一，`activeLink` 的比對方式，要和 HTML 裡 `active` 的寫法一致，底線才會正確顯示。第二，`path` 要和 `app.routes.ts` 裡設定的路由對得上，否則點擊頁籤會導向不存在的頁面。
-->

---

# 步驟三：路由設定（Child Routes）(一)

`mat-tab-nav-bar` 本身不會換頁，只有中間的 `<mat-tab-nav-panel>` 裡的 `<router-outlet>` 會換內容，因此 `links` 對應的路徑要設定為**同一層的 child routes**，才能保持導覽列常駐、只切換內容。

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'test',
    component: TestParentComponent,   // 內含 mat-tab-nav-bar 的元件
    children: [
      { path: '', redirectTo: 'test1', pathMatch: 'full' }, // 預設導向第一個頁籤
      { path: 'test1', component: Test1Component },
      { path: 'test2', component: Test2Component },
      { path: 'test3', component: Test3Component }
    ]
  }
];
```

<!--
第三步是路由的設定，這是很多人容易忽略的地方。

`mat-tab-nav-bar` 本身不會換內容，真正負責換內容的是 `mat-tab-nav-panel` 裡的 `router-outlet`。如果希望切換頁籤時，導覽列保持不動，只有下方內容改變，那每個頁籤對應的路徑，就要設定成同一個父路由底下的子路由。

看這段 `app.routes.ts`，外層 `test` 對應的是放了導覽列的父元件，裡面用 `children` 定義 `test1`、`test2`、`test3`。這樣網址會是 `test/test1` 這樣的形式，切換時只有子元件在父元件的 `router-outlet` 裡替換，導覽列不會重新建立。
-->

---

# 步驟三：路由設定（Child Routes）(二)

- `children`：定義在**父路由底下**的子路由，網址會是 `path/child-path`（例如 `test/test2`）
- 子路由的元件只會渲染在父元件的 `<router-outlet>` 裡，父元件（含頁籤導覽列）保持不變
- `redirectTo` + `pathMatch: 'full'`：讓使用者一進入 `test` 就自動導向第一個頁籤，避免內容區空白

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 若沒有設定成 child routes，而是把 <code>test2</code>、<code>test3</code> 設成跟 <code>test</code> 平行的獨立路由，切換頁籤時整個父元件（含導覽列）會被整個換掉重建，不是我們要的「同畫面切換內容」效果。
</div>

<!--
接著補充幾個細節。

子路由的網址，是父路徑加上子路徑，例如 `test/test2`。子元件只會顯示在父元件的 `router-outlet` 裡，父元件本身保持不變。

`children` 裡第一條是空路徑加上 `redirectTo` 和 `pathMatch: 'full'`，讓使用者一進入 `test`，就自動導向第一個頁籤，避免內容區一片空白。

最容易犯的錯，是把 `test2`、`test3` 設成跟 `test` 平行的獨立路由。這樣切換頁籤時，整個父元件連同導覽列都會被銷毀重建，效能比較差，父元件裡的其他狀態也會被重置。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 完成畫面展示
# Final Result

<!--
最後，我們看整合完成後實際的畫面，確認前面的設定都有接起來。
-->

---

# 完成畫面

整合路由後，頁籤切換正常，點擊不同頁籤會導向對應路由，作用中頁籤顯示藍色底線，停用頁籤呈灰色。

<div class="flex justify-center">
  <img src="/images/39-tabs/mat-tab-nav-bar-final-result.png" class="rounded shadow-md max-h-80" />
</div>

<!--
這是完成後的畫面。

點擊不同的頁籤，會導向對應的路由，網址也會跟著改變。目前選中的頁籤下方有藍色底線，停用的頁籤則是灰色、無法點擊。

如果自己做出來的畫面不一樣，通常是某個地方漏了，可以回頭檢查 `imports` 陣列、`links` 的資料，以及 `active` 的比對邏輯。
-->

---

# mat-tabs 完整使用流程

| 步驟 | 說明 |
|---|---|
| 1 | 在 `.ts` 中 `import { MatTabsModule }` 並加入 `imports` |
| 2 | 同時匯入 `RouterLink`、`RouterOutlet` |
| 3 | 定義 `links` 陣列（含 `path` 與 `name`）及 `activeLink` 初始值 |
| 4 | 在 HTML 使用 `<nav mat-tab-nav-bar>` + `@for` 迴圈產生 `<a mat-tab-link>` |
| 5 | 綁定 `[routerLink]`、`(click)`、`[active]` 屬性 |
| 6 | 在 `<mat-tab-nav-panel>` 內放置 `<router-outlet>` |
| 7 | 在 `app.routes.ts` 將各頁籤路徑設為同一父路由的 `children`，並用 `redirectTo` 導向預設頁籤 |

<!--
我們把整個流程整理成七個步驟。

第一，匯入 `MatTabsModule`。第二，同時匯入 `RouterLink` 和 `RouterOutlet`。第三，定義 `links` 陣列和 `activeLink` 初始值。第四，在 HTML 用 `nav mat-tab-nav-bar` 搭配 `@for` 產生 `mat-tab-link`。第五，綁定 `routerLink`、`click` 和 `active`。第六，在 `mat-tab-nav-panel` 裡放上 `router-outlet`。第七，在 `app.routes.ts` 把各頁籤的路徑設為同一個父路由的子路由，並用 `redirectTo` 導向預設頁籤。

之後遇到類似的需求，可以照著這張表逐一核對。
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

# 補充練習 1–2：擴充頁籤與除錯實驗

**練習 1：新增第四個頁籤**

打開 TS 的 `links` 陣列，新增第四個項目：

```typescript
{ path: '/profile', name: '個人帳戶設定' }
```

存檔，確認不用修改任何一行 HTML，畫面就自動多出第四個頁籤。

**練習 2：忘記匯入 MatTabsModule**

故意把 `imports` 陣列中的 `MatTabsModule` 刪除，觀察錯誤訊息，再補回來。

<!--
接下來兩題補充練習。

第一題，在 `links` 陣列多加一筆資料，看看畫面會不會自動多一個頁籤。

第二題是除錯實驗：把 `MatTabsModule` 拿掉，看看會出現什麼錯誤。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
links = [
  { path: '/test/test1', name: 'TEST'  },
  { path: '/test/test2', name: 'TEST2' },
  { path: '/test/test3', name: 'TEST3' },
  { path: '/profile',    name: '個人帳戶設定' },   // 新增
];
```

```text
❌ 'mat-tab-group' is not a known element:
   1. If 'mat-tab-group' is an Angular component, then verify that it is included in the '@Component.imports' of this component.
```

<!--
我們來看答案。

頁籤是用 `@for` 跑 `links` 陣列產生的，所以只要陣列多一筆，畫面就自動多一個頁籤，HTML 完全不用改。記得也要在 `app.routes.ts` 加上 `/profile` 的路由，點下去才有頁面可以顯示。

拿掉 `MatTabsModule` 之後，會出現「不是已知的元素」的錯誤，錯誤訊息也提示了解法：確認它有沒有加進元件的 `imports`。
-->

---
layout: default
---

# 補充練習 3：依權限停用頁籤

針對沒有管理員權限的使用者，把部分頁籤設為停用：

1. 在 TS 宣告 `isAdmin: boolean = false;`
2. 在 `links` 中為「後台管理」頁籤加上 `adminOnly: true`
3. 在 HTML 用屬性繫結 `[disabled]`：該頁籤為 `adminOnly` 且不是管理員時停用
4. 確認頁籤變灰無法點選；把 `isAdmin` 改為 `true`，確認恢復可點選

<!--
第三題補充練習，依照使用者權限停用頁籤。

在資料裡標記哪些頁籤只有管理員能用，再用中括號 `disabled` 綁定判斷式：只限管理員，而且目前不是管理員，就停用。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：依權限停用頁籤 — 參考答案

```typescript
isAdmin: boolean = false;

links = [
  { path: '/test/test1', name: 'TEST'  },
  { path: '/test/test2', name: 'TEST2' },
  { path: '/admin',      name: '後台管理', adminOnly: true },
];
```

```html
<nav mat-tab-nav-bar [tabPanel]="tabPanel">
  @for (link of links; track link) {
    <a mat-tab-link
       [routerLink]="link.path"
       (click)="activeLink = link.name"
       [active]="activeLink == link.name"
       [disabled]="link.adminOnly && !isAdmin"> {{ link.name }} </a>
  }
</nav>
<mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>
```

<!--
我們來看答案。

`links` 裡，後台管理這一筆多了 `adminOnly: true`，其他筆沒有這個屬性，取值會是 undefined，條件就不成立。

`disabled` 的判斷式是「只限管理員」而且「不是管理員」，兩個都成立時停用。`isAdmin` 是 false，後台管理就變灰；改成 true，條件不成立，頁籤就恢復可點選。
-->

---
layout: end
---

# 課程結束
### 使用 mat-tabs 與路由整合，打造流暢的多頁籤導覽體驗

<!--
這一章我們學了 Angular Material 的 Tabs。`mat-tab-group` 適合放固定的靜態內容。`mat-tab-nav-bar` 則可以和路由整合：用 `@for` 產生頁籤連結，綁定 `routerLink` 和 `active`，在 `mat-tab-nav-panel` 放上 `router-outlet`，並把各頁籤設定成同一個父路由的子路由，切換時導覽列才會保持不動。

下一章，我們會學習 Material 的下拉選單元件 Select。我們下一章見。
-->

