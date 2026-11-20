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
- **選擇主題（配色）** — Azure/Blue、Rose/Red、Magenta/Violet、Cyan/Orange
- **安裝完成** — 自動更新的專案檔案一覽

<!--
這一章的順序是：先介紹什麼是 Angular Material，接著執行安裝指令。安裝過程中，CLI 只會問我們一個問題：主題配色。最後看安裝完成之後，專案裡有哪些檔案被修改了。
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

執行後 Angular CLI 會先問要不要安裝（按 Enter），接著只問一個問題：主題配色。

```bash
ng add @angular/material
```

<!--
執行指令之後，Angular CLI 會先告訴我們要安裝哪一個版本的 Angular Material，問要不要繼續，直接按 Enter 就好。它會自動挑選和我們專案的 Angular 版本搭配的那一版，所以 Angular 21 的專案會裝到 Material 21。

接著只問一個問題：主題配色。

如果在網路上看到比較舊的教學，會看到 CLI 還問了排版樣式和動畫模組兩個問題。新版的 Angular Material 已經把這兩題拿掉了：排版直接寫在主題設定裡，元件的動畫也不需要另外安裝動畫模組。
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

CLI 詢問要使用哪一組內建配色（Select a pair of starter prebuilt color palettes），用方向鍵選擇後按 Enter。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

- **Azure/Blue** — 藍色系
- **Rose/Red** — 紅色系
- **Magenta/Violet** — 紫色系

</div>
<div>

- **Cyan/Orange** — 青橙色系

</div>
</div>

```bash
? Select a pair of starter prebuilt color palettes for your Angular Material theme
❯ Azure/Blue         [Preview: https://material.angular.dev?theme=azure-blue]
  Rose/Red           [Preview: https://material.angular.dev?theme=rose-red]
  Magenta/Violet     [Preview: https://material.angular.dev?theme=magenta-violet]
  Cyan/Orange        [Preview: https://material.angular.dev?theme=cyan-orange]
```

<!--
CLI 會列出幾個內建主題，名稱是兩個顏色的組合。Azure/Blue 是藍色系，Rose/Red 是紅色系，Magenta/Violet 是紫色系，Cyan/Orange 是青橙色系。

每一個選項後面都附了預覽網址，貼到瀏覽器就能先看看那組顏色套在元件上的樣子。

沒有特別需求的話，選一個喜歡的就好，第一個 Azure/Blue 是預設值。選錯了也沒關係，之後在 `styles.scss` 改一個字就能換，本章最後的補充練習會做一次。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 安裝完成
# Installation Complete

<!--
選好主題，CLI 就會開始安裝，並自動修改幾個專案檔案。我們來看看改了哪些地方。
-->

---
layout: two-cols
---

# 安裝 @angular/material
### 安裝完成 — 自動更新的檔案

安裝完成後，Angular CLI 會自動更新以下專案檔案：

- `package.json` — 新增 `@angular/material`、`@angular/cdk` 相依套件
- `src/styles.scss` — 用 `mat.theme()` 設定主題配色、字型
- `src/index.html` — 加入 Roboto 字型與 Material Icons 的連結

::right::

```bash
✔ Installing package
UPDATE package.json (878 bytes)
✔ Packages installed successfully.
UPDATE src/styles.scss (1259 bytes)
UPDATE src/index.html (625 bytes)
```

<!--
從右邊的訊息可以看到，`ng add` 修改了三個檔案。

`package.json` 新增了 Angular Material 和它依賴的 CDK 套件；`styles.scss` 寫入了主題設定，剛才選的配色就在這裡；`index.html` 加入了 Roboto 字型和 Material Icons 圖示字型的連結，之後的 mat-icon 會用到。

安裝完成後，重新執行 `ng serve`，就可以在 HTML 裡使用 Material 的元件了。
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

1. 打開 `src/styles.scss`，找到 `@include mat.theme(...)`
2. 把 `primary: mat.$azure-palette` 改成 `mat.$magenta-palette`
3. 把 `tertiary: mat.$blue-palette` 改成 `mat.$violet-palette`
4. 存檔，`ng serve` 會自動重新整理畫面
5. 觀察 Material 元件（如按鈕）的主色是否從藍色變成紫紅色

<!--
這題補充練習，模擬安裝時選錯主題的情況。

不需要重新安裝。剛才看到 ng add 把主題設定寫在 styles.scss 裡，打開它，找到 mat.theme 這一段，把裡面兩個顏色的名稱換掉就好。

styles.scss 是一般的樣式檔，存檔之後 ng serve 會自動重新編譯，不用重新啟動。我們先暫停一下，自己動手試試看。
-->

---
zoom: 0.94
layout: default
---

# 補充練習：手動更換主題配色 — 參考答案

```scss
@include mat.theme(
  (
    color: (
      primary: mat.$magenta-palette,
      tertiary: mat.$violet-palette,
    ),
    typography: Roboto,
    density: 0,
  )
);
```

| 安裝時的選項 | primary | tertiary |
| --- | --- | --- |
| Azure/Blue | `mat.$azure-palette` | `mat.$blue-palette` |
| Rose/Red | `mat.$rose-palette` | `mat.$red-palette` |
| Magenta/Violet | `mat.$magenta-palette` | `mat.$violet-palette` |
| Cyan/Orange | `mat.$cyan-palette` | `mat.$orange-palette` |

<!--
我們來看答案。

mat.theme 裡面的 color 有兩個顏色：primary 是主色，按鈕、選取狀態都用它；tertiary 是第三色，用在需要對比的地方。安裝時選的四組配色，就是這兩個名稱的四種組合，表格都列出來了，可以每一組都換換看。

另外 typography 寫的是字型，density 是元件的密度，0 是預設值，數字越小元件越緊湊。
-->

---
layout: end
---

# 課程結束
### Angular Material 安裝完成，即可開始使用豐富的 UI 元件

<!--
這一章我們安裝了 Angular Material。用 `ng add @angular/material` 安裝，執行前要先關掉開發伺服器。安裝過程只問一個問題：主題配色，選一個喜歡的就好，之後也能在 styles.scss 換。安裝完會自動修改三個檔案，主題設定寫在 styles.scss，記得重新啟動伺服器。

下一章，我們會使用 Material 的表格元件 `mat-table`。我們下一章見。
-->
