---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 安裝 Angular Material
routeAlias: ch31
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
    安裝 Angular Material
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用 ng add 一鍵安裝功能豐富的 Material UI 元件庫」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
從這一章開始，我們要使用 Angular Material 這個 UI 元件庫。

如果每個按鈕、表格都要自己寫樣式、處理鍵盤操作，開發會很慢。Angular Material 就像一整套現成的家具，直接搬進專案就能用。

學完這一章，我們會用一行指令安裝它，並了解安裝時每個選項該怎麼選。
-->

---
layout: default
---

# Outline

- **什麼是 Angular Material** — 內建模組與樣式的 UI 元件庫
- **執行安裝指令** — 使用 `ng add @angular/material`
- **選擇主題（配色）** — Azure/Blue、Rose/Red、Magenta/Violet、Cyan/Orange、Custom
- **設定排版樣式** — 是否套用全域 Angular Material typography
- **選擇動畫模組** — Include and enable / disable / Do not include
- **安裝完成** — 自動更新的專案檔案一覽

<!--
這一章的順序是：先介紹什麼是 Angular Material，接著執行安裝指令。安裝過程中，CLI 會問我們三個問題，分別是主題配色、全域排版樣式和動畫模組，我們會一個一個說明。最後看安裝完成之後，專案裡有哪些檔案被修改了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 Angular Material？
# What is Angular Material?

<!--
如果沒有元件庫，每個按鈕和表單都要自己寫樣式和互動，Angular Material 就是為了解決這個問題。
-->

---

# 安裝 @angular/material

Angular Material 是 Google 官方提供的 UI 元件庫，內建豐富的元件與樣式，**mat-icon** 即為其中之一。

安裝前請先停止開發伺服器，並在專案根目錄下執行：

```bash
ng add @angular/material
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 執行指令前請先關閉開發伺服器（Ctrl+C），並確認終端機的工作目錄在專案根目錄下。
</div>

<!--
Angular Material 內建了豐富的元件和樣式，之後會學到的圖示元件 `mat-icon` 就是其中之一。

安裝的指令是 `ng add @angular/material`。注意這裡用的是 `ng add`，而不是 `npm install`。`ng add` 除了下載套件，還會自動修改專案的設定檔，等一下安裝完就會看到改了哪些地方。

執行之前，記得先按 Ctrl 加 C 關掉開發伺服器，避免安裝過程修改檔案時，跟伺服器的即時編譯互相干擾。也要確認終端機目前位在專案的根目錄。
-->

---

# 安裝 @angular/material
### 執行安裝指令

執行後 Angular CLI 會下載套件，並依序詢問幾個設定選項。

```bash
ng add @angular/material
```

<!--
執行指令之後，Angular CLI 會先下載套件，接著依序問我們幾個設定問題：要用哪一種主題配色、要不要套用全域的排版樣式，以及要不要引入動畫模組。

接下來我們一個一個看，每個問題在問什麼，以及建議怎麼選。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 選擇主題（配色）
# Choose a Theme

<!--
第一個問題是選擇主題配色。主題是一整套搭配好的顏色，選了之後，所有 Material 元件都會套用同一組色系。
-->

---

# 安裝 @angular/material
### 步驟一：選擇主題

CLI 詢問要使用哪種內建主題，若不使用預設主題可選 **Custom**。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

- **Azure/Blue** — 藍色系
- **Rose/Red** — 紅色系
- **Magenta/Violet** — 紫色系

</div>
<div>

- **Cyan/Orange** — 青橙色系
- **Custom** — 自訂主題

</div>
</div>

<div class="flex justify-center">
  <img src="/images/31-angular-material/theme-selector.png" class="rounded shadow-md max-h-52" />
</div>

<!--
CLI 會列出幾個內建主題，名稱是兩個顏色的組合。Azure/Blue 是藍色系，Rose/Red 是紅色系，Magenta/Violet 是紫色系，Cyan/Orange 是青橙色系。

如果專案已經有自己的品牌色，想要客製化，可以選 Custom，之後再自己調整顏色。

沒有特別需求的話，選一個喜歡的內建主題就好，之後也可以再到 `styles.scss` 修改。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 設定全域排版樣式
# Global Typography Styles

<!--
第二個問題是全域排版樣式，它會影響整個專案的文字，要小心選擇。
-->

---

# 安裝 @angular/material
### 步驟二：設定全域排版樣式

CLI 詢問是否套用全域 Angular Material 排版樣式，建議選 **N**，避免覆蓋專案現有的 CSS 設定。

```bash
? Set up global Angular Material typography styles? (y/N) N
```

<!--
如果選 Yes，Angular Material 會把它的字體大小、行高等規則套用到整個頁面，我們原本寫好的標題和段落樣式，可能會被覆蓋掉。

大部分專案都已經有自己的樣式規範，所以這裡建議選 N，這也是預設值。這樣 Material 的樣式只會影響 Material 元件本身。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 選擇動畫模組
# Angular Animations Module

<!--
最後一個問題是要不要引入動畫模組。像對話框展開、選單滑出這些過場效果，都要靠 Angular 的動畫模組來執行。
-->

---

# 安裝 @angular/material
### 步驟三：選擇動畫模組

CLI 詢問是否引入 Angular 動畫模組，依開發需求選擇後即開始安裝。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

- **Include and enable animations** — 引入並啟用動畫（預設）
- **Include, but disable animations** — 引入但停用動畫

</div>
<div>

- **Do not include** — 不引入動畫模組

</div>
</div>

<div class="flex justify-center">
  <img src="/images/31-angular-material/animations-prompt.png" class="rounded shadow-md max-h-52" />
</div>

<!--
這裡有三個選項。

第一個是引入並啟用動畫，這是預設值，元件的過場效果會很流暢，大部分專案都選這個。

第二個是引入但停用動畫，動畫模組還在，只是關閉效果，適合對效能特別要求，或刻意不要動畫的介面。

第三個是完全不引入，這樣有些依賴動畫的元件可能會受到影響，一般不建議初學者選擇。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 安裝完成
# Installation Complete

<!--
三個問題回答完，CLI 就會開始安裝，並自動修改幾個專案檔案。我們來看看改了哪些地方。
-->

---
layout: two-cols
---

# 安裝 @angular/material
### 安裝完成 — 自動更新的檔案

安裝完成後，Angular CLI 會自動更新以下專案檔案：

- `package.json` — 新增 @angular/material 相依套件
- `src/app/app.config.ts` — 加入 Material 設定
- `angular.json` — 加入主題 CSS 樣式路徑
- `src/index.html` — 加入 Google Fonts 字型連結
- `src/styles.scss` — 加入主題樣式匯入

::right::

```bash
UPDATE package.json (1105 bytes)
✔ Packages installed successfully.
UPDATE src/app/app.config.ts (421 bytes)
UPDATE angular.json (2892 bytes)
UPDATE src/index.html (491 bytes)
UPDATE src/styles.scss (181 bytes)
```

<!--
從右邊的訊息可以看到，`ng add` 一次修改了五個檔案。

`package.json` 新增了 Angular Material 套件；`app.config.ts` 加入了 Material 需要的設定；`angular.json` 加入了主題 CSS 的路徑；`index.html` 加入了 Google Fonts 的字型連結；`styles.scss` 則匯入了主題樣式。

安裝完成後，建議重新啟動開發伺服器，因為 `angular.json` 的設定變更，需要重新啟動才會生效。之後就可以在 HTML 裡使用 Material 的元件了。
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

# 補充練習：手動更換主題配色

如果安裝時選錯了主題顏色，不需要移除重裝，直接修改設定檔即可：

1. 打開專案根目錄的 `angular.json`
2. 用 VS Code 搜尋 `"styles"`，找到樣式陣列
3. 觀察裡面引入的主題 CSS 路徑，把 `azure-blue.css` 改成 `magenta-violet.css`
4. 修改後在終端機按 `Ctrl + C` 停止，再重新執行 `ng serve`
5. 觀察 Material 元件（如按鈕）的主色是否從藍色變成紫色

<!--
這題補充練習，模擬安裝時選錯主題的情況。

不需要重新安裝，只要打開 `angular.json`，找到 `styles` 陣列，把主題 CSS 的檔名換掉就好。

要特別注意，改完 `angular.json` 一定要重新啟動 `ng serve`。我們先暫停一下，自己動手試試看。
-->

---
zoom: 0.94
layout: default
---

# 補充練習：手動更換主題配色 — 參考答案

```json
"styles": [
  "@angular/material/prebuilt-themes/magenta-violet.css",
  "src/styles.scss"
]
```

可用的內建主題檔：

| 檔名 | 色系 |
| --- | --- |
| `azure-blue.css` | 藍色系 |
| `rose-red.css` | 紅色系 |
| `magenta-violet.css` | 紫色系 |
| `cyan-orange.css` | 青橙色系 |

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <code>ng serve</code> 只在啟動時讀取 <code>angular.json</code>，修改後不重啟，畫面不會有任何變化
</div>

<!--
我們來看答案。

`styles` 陣列裡，第一行就是 Material 的內建主題檔，把檔名換成 `magenta-violet.css` 就完成了。表格列出四個內建主題，可以每個都換換看。

`angular.json` 是專案的設定檔，`ng serve` 只有在啟動時才會讀取，所以一定要重新啟動才會生效。
-->

---
layout: end
---

# 課程結束
### Angular Material 安裝完成，即可開始使用豐富的 UI 元件

<!--
這一章我們安裝了 Angular Material。用 `ng add @angular/material` 安裝，執行前要先關掉開發伺服器。安裝過程會問三個問題：主題配色選一個喜歡的就好，全域排版樣式建議選 N，動畫模組建議引入並啟用。安裝完會自動修改五個檔案，記得重新啟動伺服器。

下一章，我們會使用 Material 的表格元件 `mat-table`。我們下一章見。
-->
