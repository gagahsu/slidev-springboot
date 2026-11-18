---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 開啟 Angular 專案
routeAlias: ch07
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
    Angular Full-Stack Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    開啟 Angular 專案
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「打開專案，從第一個元件開始！」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
前面幾章，我們裝好了 Node.js、Angular CLI 和 VS Code。這一章要把它們串起來，實際打開 Angular 專案。

我們會用 VS Code 打開專案、建立元件、設定路由，最後把網頁跑起來。這一章只先講「怎麼做」，背後的原理和細節，後面的章節會一一說明。
-->

---
layout: default
---

# Outline

- **用 VS Code 開啟 Angular 專案**
- **使用 `ng g c` 建立 Angular 元件**
- **解決 Windows 執行原則錯誤**
- **快速設定 Route**
- **啟動 Angular 開發伺服器**

<!--
這一章的流程是這樣的：先用 VS Code 打開專案，接著用 `ng g c` 建立元件。如果在 Windows 上遇到指令被擋下來的錯誤，我們也會說明怎麼解決。然後快速設定路由，最後啟動開發伺服器，在瀏覽器看到結果。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 用 VS Code 開啟 Angular 專案
# Open Project in VS Code

<!--
第一步，我們先把 Angular 專案在 VS Code 裡打開。
-->

---

# 方法一：使用終端機指令

在終端機 / 命令提示字元中，先 `cd` 到你的專案資料夾，再執行：

```bash
code .
```

<div class="mt-6 p-4 bg-teal-50 border-l-4 border-teal-500 text-gray-700 text-sm text-left">
💡 <b>code .</b> 指令會直接用 VS Code 開啟「目前資料夾」，是最快速的方式
</div>

| 步驟 | 指令 | 說明 |
| --- | --- | --- |
| 1 | `cd 專案資料夾路徑` | 切換到 Angular 專案目錄 |
| 2 | `code .` | 用 VS Code 開啟此資料夾 |

<!--
第一種方法是用終端機指令，這也是最快的方式。

先用 `cd` 切換到專案資料夾，然後輸入 `code`，空一格，再加一個點。這個點代表「目前所在的資料夾」，所以這行指令的意思是「用 VS Code 打開目前這個資料夾」。

執行之後，VS Code 會自動開啟，左側的檔案總管也會直接顯示這個專案的檔案。
-->

---

# 方法二：從 VS Code 內開啟

直接在 VS Code 介面操作，不用打指令：

<div class="mt-4 grid grid-cols-2 gap-6">
  <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div class="font-bold text-teal-700 mb-2">選單開啟</div>
    <ol class="text-sm space-y-1 text-gray-700 list-decimal list-inside">
      <li>點選上方選單 <b>File</b></li>
      <li>選擇 <b>Open Folder...</b></li>
      <li>選取 Angular 專案資料夾</li>
      <li>點擊「選擇資料夾」</li>
    </ol>
  </div>
  <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div class="font-bold text-teal-700 mb-2">快速鍵</div>
    <div class="text-sm text-gray-700 space-y-2">
      <div><b>Windows：</b> <code>Ctrl + K, Ctrl + O</code></div>
      <div><b>macOS：</b> <code>⌘K, ⌘O</code></div>
    </div>
  </div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 開啟後，左側「檔案總管」會顯示 Angular 專案的完整結構（<code>src/</code>、<code>package.json</code> 等）
</div>

<!--
如果還不習慣打指令，也可以直接從 VS Code 裡面開啟。

點選上方選單的 File，選擇 Open Folder，找到 Angular 專案的資料夾，再按「選擇資料夾」就可以了。也可以用畫面右邊的快速鍵直接叫出開啟資料夾的視窗。

打開之後，左側檔案總管會顯示專案的完整結構，像是 `src` 資料夾和 `package.json`。兩種方法的效果完全一樣，選自己習慣的就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 使用 `ng g c` 建立 Angular 元件
# Generate Component

<!--
專案打開之後，第二步是建立元件。Angular 的核心觀念，就是把畫面切成一個一個可以重複使用的元件。
-->

---
zoom: 0.92
---

# `ng g c` — 快速建立元件

在 VS Code 的**內建終端機**中輸入：

```bash
ng generate component 元件名稱
# 縮寫
ng g c 元件名稱
```

**範例：建立一個首頁元件**

```bash
ng g c home
```

執行後，Angular CLI 會自動在 `src/app/` 下建立四個檔案：

```
src/app/home/
  ├── home.component.ts       ← 邏輯（TypeScript）
  ├── home.component.html     ← 畫面（HTML 模板）
  ├── home.component.css      ← 樣式（CSS）
  └── home.component.spec.ts  ← 測試檔
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 元件的詳細結構與使用方式，將在後續章節深入說明
</div>

<!--
建立元件要用 Angular CLI 的指令。

在 VS Code 的內建終端機輸入 `ng generate component`，後面接元件名稱。這個指令很常用，所以通常會用縮寫 `ng g c`，g 代表 generate，c 代表 component。

例如輸入 `ng g c home`，CLI 會在 `src/app` 底下建立一個 `home` 資料夾，裡面自動產生四個檔案：邏輯程式碼的 `.ts`、畫面的 `.html`、樣式檔，還有測試用的 `.spec.ts`。基本的程式結構也都會幫我們寫好。

之後每建立一個新頁面，或是一個可以重複使用的區塊，都是用這個指令。
-->

---

# 解決 Windows 執行原則錯誤

執行 `ng` 指令時，若出現以下錯誤：

<div class="mt-2 p-3 bg-red-50 border-l-4 border-red-500 text-gray-700 text-sm text-left font-mono">
ng : 因為這個系統上已停用指令碼執行，所以無法載入 ng.ps1 檔案
</div>

**原因**：Windows PowerShell 預設禁止執行從外部下載的 `.ps1` 腳本

| 解決方法 | 指令 | 說明 |
| --- | --- | --- |
| 方法一（推薦） | `Set-ExecutionPolicy RemoteSigned` | 以**系統管理員**身分開啟 PowerShell 後執行 |
| 方法二 | `npx ng g c home` | 每次在 `ng` 前加上 `npx`，不修改系統設定 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 執行方法一後，關閉 PowerShell 重新開啟，即可直接使用 <code>ng</code> 指令
</div>

<!--
在 Windows 上第一次執行 `ng` 指令時，很多人會看到這個錯誤，說系統已停用指令碼執行，無法載入 `ng.ps1`。

原因是 Windows 的 PowerShell 為了安全，預設不允許執行從外部下載的腳本，而 `ng` 指令剛好就是一支這樣的腳本，所以被擋了下來。

解決方法有兩種。方法一是用系統管理員身分打開 PowerShell，執行 `Set-ExecutionPolicy RemoteSigned`，只要做一次，之後就能正常使用。方法二是每次在 `ng` 前面加上 `npx`，不用修改系統設定，但每次都要多打幾個字。

執行方法一之後，記得把 PowerShell 關掉重開。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 快速設定 Route
# Quick Routing Setup

<!--
有了元件之後，第三步是設定路由，也就是決定哪個網址要顯示哪個畫面。
-->

---

# 快速設定 Route

Angular 的路由設定在 `src/app/app.routes.ts`：

```ts {all}
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
];
```

接著在 `app.component.html` 中加入路由出口：

```html
<router-outlet />
```

<div class="mt-4 p-3 bg-teal-50 border-l-4 border-teal-500 text-gray-700 text-sm text-left">
💡 <b>path</b> 對應瀏覽器的網址路徑，<b>component</b> 指定要顯示的元件<br>
更完整的路由設定（巢狀路由、參數、Guard 等）將在後續路由章節詳細說明
</div>

<!--
路由的設定寫在 `src/app/app.routes.ts` 這個檔案裡。

先把剛才建立的 `HomeComponent` 引入進來。接著在 `routes` 這個陣列裡加上物件，每個物件有兩個屬性：`path` 是網址的路徑，`component` 是要顯示的元件。這裡我們設定網址是空的，或是 home 的時候，都顯示首頁元件。

然後在 `app.component.html` 加上 `router-outlet`。我們可以把它想成「切換頁面的舞台」，Angular 會依照網址，把對應的元件顯示在這個位置。

更進階的路由功能，例如帶參數、巢狀路由，我們之後會有專門的章節介紹。
-->

---

# 啟動 Angular 開發伺服器

所有設定完成後，在專案根目錄的終端機執行：

```bash
ng serve
# 縮寫
ng s
```

| 指令 | 說明 |
| --- | --- |
| `ng serve` | 啟動開發伺服器（預設 http://localhost:4200） |
| `ng s --open` | 啟動並**自動開啟瀏覽器** |
| `ng s --port 3000` | 指定自訂 Port |

<div class="mt-4 p-3 bg-teal-50 border-l-4 border-teal-500 text-gray-700 text-sm text-left">
✅ 伺服器啟動後，每次存檔都會<b>自動重新整理瀏覽器</b>（Hot Reload），不需要手動重整頁面
</div>

<!--
所有設定都完成之後，最後一步就是啟動開發伺服器。

在專案根目錄的終端機執行 `ng serve`，或是縮寫 `ng s`。Angular 會編譯整個專案，然後在 localhost 冒號 4200 開啟一個開發用的伺服器。

看表格，加上 `--open` 會自動打開瀏覽器；加上 `--port` 可以指定其他的連接埠號碼。

伺服器啟動之後，我們每次修改程式並存檔，瀏覽器都會自動更新畫面，這叫做 Hot Reload，不用再手動重新整理。
-->

---

# 本章流程回顧

<div class="mt-4 grid grid-cols-4 gap-4">
  <div class="p-4 bg-teal-50 border-2 border-teal-300 rounded-xl text-center">
    <div class="text-3xl font-black text-teal-600 mb-2">①</div>
    <div class="font-bold text-teal-800 mb-1">開啟專案</div>
    <div class="text-sm text-gray-600"><code>code .</code><br>或 File → Open Folder</div>
  </div>
  <div class="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl text-center">
    <div class="text-3xl font-black text-blue-600 mb-2">②</div>
    <div class="font-bold text-blue-800 mb-1">建立元件</div>
    <div class="text-sm text-gray-600"><code>ng g c 元件名稱</code><br>自動產生四個檔案</div>
  </div>
  <div class="p-4 bg-purple-50 border-2 border-purple-300 rounded-xl text-center">
    <div class="text-3xl font-black text-purple-600 mb-2">③</div>
    <div class="font-bold text-purple-800 mb-1">設定路由</div>
    <div class="text-sm text-gray-600"><code>app.routes.ts</code><br>加上 router-outlet</div>
  </div>
  <div class="p-4 bg-green-50 border-2 border-green-300 rounded-xl text-center">
    <div class="text-3xl font-black text-green-600 mb-2">④</div>
    <div class="font-bold text-green-800 mb-1">啟動伺服器</div>
    <div class="text-sm text-gray-600"><code>ng s --open</code><br>localhost:4200</div>
  </div>
</div>

<div class="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-gray-700 text-sm text-left">
✅ 四個步驟完成後，就能在瀏覽器看到你建立的頁面！更深入的功能將在後續章節一一介紹。
</div>

<!--
我們回顧一下這一章的四個步驟。

第一，用 `code .` 或選單打開專案。第二，用 `ng g c` 建立元件，CLI 會自動產生四個檔案。第三，在 `app.routes.ts` 設定路由，並加上 `router-outlet`。第四，用 `ng s --open` 啟動伺服器。

這四步走完，就能在瀏覽器看到我們建立的頁面了。
-->

---
layout: end
---

# 開始動手吧！
### 打開你的 Angular 專案，建立第一個元件！

<!--
這一章我們把整個開發流程跑了一遍：開專案、建元件、設路由、啟動伺服器。

【講師】可以讓大家實際執行一次 `ng g c`，看看 CLI 產生了哪些檔案。

元件已經建立好了，但畫面裡還沒有什麼內容。下一章，我們會開始學 HTML，讓元件的畫面有東西可以呈現。我們下一章見。
-->
