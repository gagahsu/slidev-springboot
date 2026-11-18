---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Angular 包板
routeAlias: ch54
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
    Angular 包板
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「將 Angular 專案編譯打包，部署至網頁伺服器」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
到目前為止，我們都是用 `ng serve` 在本機看畫面。但那是開發用的環境，不適合直接拿去上線。

就像在家煮菜可以隨性，端給客人之前就要好好裝盤。在 Angular 專案裡，這個「裝盤」的動作就是包版，也就是 build。學完這一章，我們會用 `ng build` 打包專案，處理檔案太大的錯誤，並知道打包出來的 `dist` 資料夾要怎麼部署。
-->

---
layout: default
---

# Outline

- **包板的概念與必要性**
- **執行 `ng build` 指令**
- **處理 Bundle Budget 錯誤**
- **`ng build` 輸出結果解讀**
- **dist 資料夾結構與部署方式**
- **為什麼直接開 index.html 會白屏**

<!--
這一章會先說明為什麼需要包版，接著實際執行 `ng build`，並看懂建置完成後的輸出資訊。然後處理檔案太大被擋下來的 Bundle Budget 錯誤，最後看 `dist` 資料夾的結構，以及部署時要注意的地方，包括為什麼直接打開 index.html 會白屏。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 包板的概念

Angular Build — Why We Need It

<!--
我們先搞清楚，為什麼不能直接把原始碼交給客戶，一定要經過包版這個步驟。
-->

---

# 為何需要包板？

完成 Angular 專案後，不能直接將原始程式碼交付給客戶，原因如下：

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**直接交付原始碼的問題**

- 客戶須自行安裝 Node.js 環境
- 客戶須安裝 Angular CLI
- 客戶須執行 `ng serve` 才能啟動
- 開發伺服器不適合正式部署

</div>
<div>

**包板後的交付方式**

- 將程式碼編譯為靜態檔案
- 產生一組可直接部署的檔案包
- 客戶只需將檔案放入網頁伺服器資料夾
- 網站即可正常運作，無需額外環境設定

</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>說明：</b> <code>ng build</code> 會將 TypeScript、HTML、CSS 編譯並最佳化為瀏覽器可直接執行的靜態檔案。</div>

<!--
如果直接把原始碼交給客戶，客戶得先安裝 Node.js、安裝 Angular CLI，再執行 `ng serve` 才能把網站跑起來。而且開發伺服器本來就不是為正式營運設計的，效能和安全性都不夠。

就像餐廳不會把生的食材直接端給客人，一定是煮熟、裝盤之後才上桌。

`ng build` 會把 TypeScript、HTML 和 CSS 編譯、壓縮、最佳化，變成瀏覽器可以直接執行的靜態檔案。客戶只要把這些檔案放到網頁伺服器上，網站就能運作，不需要安裝任何開發工具。這是每個專案上線前一定會做的步驟。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 執行 ng build

Running the Build Command

<!--
接下來，我們實際執行 `ng build`，看看會出現什麼結果。
-->

---

# 執行 ng build 指令

在專案根目錄執行以下指令，即可開始建置：

```bash
ng build
```

建置完成後，Angular CLI 會輸出各 chunk 檔案的大小與壓縮後的傳輸大小，並在專案根目錄產生 `dist/` 資料夾。

<div class="flex justify-center"><img src="/images/54-angular-build/ng-build-output.png" class="rounded shadow-md max-h-68" /></div>

<!--
在專案的根目錄執行 `ng build`，Angular CLI 就會開始編譯整個專案。

完成後，終端機會列出一串檔案清單，以及每個檔案的大小，下一頁會說明這些資訊。最重要的是，專案根目錄會多出一個 `dist` 資料夾，這就是之後要拿去部署的內容。

執行之前，記得先把所有修改存檔，否則打包出來的內容不會包含最新的修改。
-->

---

# ng build 輸出解讀

建置成功後，終端機顯示各 chunk 檔案資訊：

| 欄位 | 說明 |
| --- | --- |
| Initial chunk files | 應用程式啟動時必須載入的檔案 |
| Lazy chunk files | 延遲載入的模組檔案（Lazy Loading） |
| Raw size | 原始檔案大小 |
| Estimated transfer size | 壓縮（gzip）後的預估傳輸大小 |
| Output location | 輸出資料夾路徑（`dist/<專案名稱>/browser/`） |

<!--
我們看終端機輸出的資訊。

Initial chunk files，是使用者一打開網站就必須載入的檔案，會影響第一次進入網站的速度。Lazy chunk files，是延遲載入的模組，只有使用者切換到對應的頁面時才會下載，可以讓首次載入更快。

Raw size 是檔案原本的大小，Estimated transfer size 則是壓縮之後、實際在網路上傳輸的大小，通常會小很多。最後的 Output location，告訴我們打包好的檔案放在哪裡。

這些數字不用緊張，重點是知道去哪裡找到最後要交付的檔案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 處理 Bundle Budget 錯誤

Handling Bundle Size Budget Errors

<!--
包版時，有時會遇到建置失敗，錯誤訊息說檔案太大了。我們來看這是什麼意思，以及怎麼處理。
-->

---

# Bundle Budget 錯誤說明

執行 `ng build` 時，若 bundle 大小超過設定上限，會出現以下警告或錯誤：

<div class="flex justify-center"><img src="/images/54-angular-build/bundle-budget-error.png" class="rounded shadow-md max-h-80" /></div>

| 層級 | 觸發條件 | 影響 |
| --- | --- | --- |
| `WARNING` | 超過 `maximumWarning` 設定值 | 顯示警告，建置繼續 |
| `ERROR` | 超過 `maximumError` 設定值 | 建置中止，需處理後重新執行 |

<!--
Bundle Budget，可以想成行李的重量限制。航空公司會有一個警告線，以及一個超過就不能登機的上限。

Angular 也一樣。超過 `maximumWarning`，會出現 WARNING 警告，但建置還是會繼續；超過 `maximumError`，就會出現 ERROR，建置直接中止，一定要處理才能拿到 `dist` 資料夾。

看到 WARNING 也不代表沒事，通常表示打包出來的檔案已經偏大，值得注意。
-->

---

# 調整 Bundle Budget 設定

在 `angular.json` 中找到 `budgets` 陣列，修改 `type: "initial"` 項目的大小限制：

```json
{
  "type": "initial",
  "maximumWarning": "500kB",
  "maximumError": "1MB"
}
```

調整為適合專案實際大小的數值後，重新執行 `ng build` 即可完成建置。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> 調整預算上限前，應優先考慮是否能縮減 bundle 大小，例如移除未使用的套件或採用 Lazy Loading。</div>

<!--
遇到檔案太大的錯誤，最直接的做法是打開 `angular.json`，找到 `budgets` 陣列，把 `type` 為 initial 的項目，`maximumWarning` 和 `maximumError` 調整成符合專案實際大小的數值，存檔後重新執行 `ng build`。

不過要提醒一個觀念：調高上限只是治標。就像行李超重，不是去調整秤，而是應該減少行李。比較好的做法，是先檢查有沒有沒用到的套件，或能不能改成延遲載入，先縮小檔案，真的縮不下去，再考慮調整上限。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# dist 資料夾與部署

The dist Folder and Deployment

<!--
最後，我們看打包完成的 `dist` 資料夾裡有什麼，以及怎麼部署。
-->

---
zoom: 0.9
---

# dist 資料夾結構

`ng build` 成功後，專案根目錄會新增 `dist/` 資料夾，結構如下：

<div class="grid grid-cols-2 gap-4 my-3">
<div>

| 檔案 | 說明 |
| --- | --- |
| `index.html` | 應用程式進入點 HTML |
| `main-[hash].js` | 應用程式主要程式碼 |
| `polyfills-[hash].js` | 瀏覽器相容性補丁 |
| `styles-[hash].css` | 全域樣式表 |
| `chunk-[hash].js` | 額外切割的程式碼區塊（含 Lazy 模組） |

</div>
<div>

<img src="/images/54-angular-build/dist-folder-structure.png" class="rounded shadow-md max-h-80 mx-auto" />

</div>
</div>

<!--
`ng build` 成功後，`dist` 資料夾裡會有這些檔案。

`index.html` 是應用程式的入口，瀏覽器一開始就是讀取它。`main` 開頭的 JavaScript 是我們寫的程式打包後的結果。`polyfills` 是讓舊版瀏覽器也能支援新語法的補丁。`styles` 是全域的樣式。如果有延遲載入的模組，還會看到額外切出來的 `chunk` 檔案。

檔名後面那串亂碼是根據內容產生的雜湊值。內容一改變，檔名就會跟著變，瀏覽器就不會讀到快取裡的舊版本。
-->

---

# 部署注意事項

`dist/` 資料夾內的所有檔案即為交付給客戶的網站內容。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**正確的部署方式**

- 將 `dist/<專案名稱>/browser/` 內所有檔案上傳至網頁伺服器（Apache、Nginx、IIS 等）
- 伺服器需設定所有路由導向 `index.html`，以支援 Angular 的 SPA 路由

</div>
<div>

**常見錯誤**

- 直接在本機雙擊開啟 `index.html`
- 因瀏覽器安全限制（CORS、相對路徑問題），頁面無法正常顯示
- 必須透過網頁伺服器提供服務才能正常運作

</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> 本機測試部署時，可使用 <code>npx http-server dist/&lt;專案名稱&gt;/browser</code> 快速啟動一個靜態檔案伺服器。</div>

<!--
這頁的重點是：`dist` 資料夾裡的檔案，就是最後要交付或上線的網站。

正確的做法，是把 `dist`、專案名稱、`browser` 底下的所有檔案，上傳到 Apache、Nginx 或 IIS 這類網頁伺服器。而且伺服器要設定成，不管使用者輸入什麼路徑，都導回 `index.html`，Angular 的路由才能正常運作，否則重新整理頁面就會出現 404。

最常見的錯誤，是直接在電腦上雙擊打開 `index.html`。因為瀏覽器對本機檔案有安全限制，頁面會無法正常顯示，一定要透過網頁伺服器。如果只想在本機快速測試，可以用 `npx http-server` 啟動一個簡單的靜態伺服器。
-->

---

# 為什麼直接開 index.html 會白屏？

直接雙擊 `dist/<專案名稱>/browser/index.html`，網址列會是 `file:///...`，畫面一片空白。打開 F12 可以看到錯誤：

```text
Access to script at 'file:///C:/main-XXXX.js' from origin 'null'
has been blocked by CORS policy
```

| 原因 | 說明 |
| --- | --- |
| JS 以模組載入 | 打包後的 `index.html` 用 `<script type="module">` 載入 JS，瀏覽器禁止從 `file://` 載入模組 |
| `<base href="/">` | 檔案路徑會從**磁碟根目錄**開始找，例如 `C:/main-XXXX.js`，根本找不到檔案 |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 解法：一定要透過網頁伺服器（<code>http://</code>）開啟，本機測試可用 <code>npx http-server</code> 或 VS Code 的 Live Server（Live Server 的根目錄必須是 <code>browser</code> 資料夾，見補充練習）
</div>

<!--
上一頁提到，直接雙擊 `index.html` 會無法正常顯示，這頁說明原因。

用雙擊的方式打開，網址列會是 `file` 開頭，代表瀏覽器是用讀取本機檔案的方式開啟，而不是向伺服器要資料。這時打開 F12，會看到 JS 檔案被 CORS 政策擋下來的錯誤。

原因有兩個。第一，Angular 打包後的 `index.html` 是用模組的方式載入 JavaScript，瀏覽器為了安全，不允許從本機檔案載入模組。第二，`index.html` 裡有一行 `base href` 等於斜線，代表所有檔案路徑都從根目錄開始找；用本機檔案開啟時，根目錄變成磁碟的根目錄，例如 C 槽，當然找不到 JS 檔。

JS 載入失敗，Angular 就沒有機會執行，畫面自然一片空白。解法只有一個：透過網頁伺服器開啟。用 Live Server 的話要特別注意根目錄的設定，補充練習會說明。
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

# 補充練習：在本機預覽打包結果

直接點開 `index.html` 會白屏，要用本機伺服器才能正確預覽：

1. 執行 `ng build`，確認產生 `dist/<專案名稱>/browser/`
2. **方法一：** 在終端機切換到 `browser` 目錄，執行 `npx http-server`
3. **方法二：** 用 VS Code 的 Live Server，但伺服器的根目錄必須是 `browser` 資料夾（做法見參考答案）
4. 打開終端機顯示的網址，確認網頁能正常顯示

<!--
這題補充練習，用本機伺服器預覽打包後的網站。

打包完的網站，直接雙擊 `index.html` 會一片白，因為瀏覽器用檔案的方式打開時，載入 JS 檔的路徑會出問題。要用伺服器來開，才會跟真正上線時一樣。

可以在終端機用 `npx http-server`，或用 VS Code 的 Live Server。用 Live Server 要注意根目錄的設定，等一下的答案會說明。我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習：在本機預覽打包結果 — 參考答案

```bash
# 1. 在專案根目錄打包
ng build

# 2. 切換到 browser 目錄（請換成自己的專案名稱）
cd dist/dynamic-questionnaire/browser

# 3. 啟動本機伺服器
npx http-server
```

```text
Available on:
  http://127.0.0.1:8080
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>npx</code> 會暫時下載並執行套件，不需要全域安裝；結束預覽時在終端機按 <code>Ctrl + C</code>
</div>

<!--
我們來看答案。

先 `ng build`，再用 `cd` 進到 `dist`、專案名稱、`browser` 這個資料夾，執行 `npx http-server`。終端機會顯示一個本機網址，打開它，網站就能正常運作了。

用這個方式確認打包結果沒問題，再部署到雲端，可以少踩很多坑。
-->

---
layout: default
---

# 補充練習：用 Live Server 預覽 — 參考答案

在 `browser` 資料夾按右鍵選「Open with Live Server」，畫面一樣白屏，F12 出現：

```text
GET http://127.0.0.1:5500/main-XXXX.js net::ERR_ABORTED 404 (Not Found)
Refused to apply style from 'http://127.0.0.1:5500/styles-XXXX.css'
because its MIME type ('text/html') is not a supported stylesheet MIME type
```

| 原因 | 說明 |
| --- | --- |
| Live Server 的根目錄是 **VS Code 開啟的資料夾** | 網址其實是 `127.0.0.1:5500/dist/<專案名稱>/browser/index.html` |
| `<base href="/">` | JS、CSS 從**伺服器根目錄**開始找：`127.0.0.1:5500/main-XXXX.js`，當然 404 |

**解法（擇一）**
- 用 VS Code **開啟 `browser` 資料夾**（File → Open Folder），再按右下角 **Go Live**
- 或在專案的 `.vscode/settings.json` 指定根目錄，改完重新啟動 Live Server：

```json
{ "liveServer.settings.root": "/dist/<專案名稱>/browser" }
```

<!--
很多同學習慣用 Live Server，但直接在 browser 資料夾按右鍵開啟，畫面還是一片白，F12 會看到 JS 檔 404，CSS 也因為 MIME 類型不對被拒絕套用。

原因是 Live Server 的根目錄，是 VS Code 開啟的那個資料夾，也就是整個專案，不是 browser。所以網址其實是 5500 後面接 dist、專案名稱、browser。可是 index.html 裡的 base href 是斜線，JS 和 CSS 會從伺服器的根目錄開始找，那裡沒有這些檔案，就 404 了。CSS 那行錯誤，是因為 Live Server 找不到檔案時回了一頁 HTML，瀏覽器發現不是 CSS，就拒絕套用。

解法有兩個。第一，用 VS Code 直接開啟 browser 資料夾，再按右下角的 Go Live，這樣根目錄就是 browser。第二，在專案的 .vscode 資料夾的 settings.json 裡，用 liveServer.settings.root 指定根目錄，路徑是相對於 VS Code 開啟的資料夾，改完要重新啟動 Live Server。

重點只有一個：伺服器的根目錄，必須是 index.html 所在的 browser 資料夾。
-->

---
layout: end
---

# 課程結束

### 學習重點回顧：執行 `ng build` 將 Angular 專案編譯為靜態檔案；若遇到 bundle budget 錯誤，調整 `angular.json` 中的 `maximumWarning` / `maximumError`；建置完成後將 `dist/` 資料夾部署至網頁伺服器即完成交付。

<!--
這一章我們學了 Angular 的包版。用 `ng build` 把專案編譯成靜態檔案，輸出在 `dist` 資料夾。遇到 Bundle Budget 錯誤，可以調整 `angular.json` 的上限，但優先考慮縮小檔案。部署時，把 `browser` 資料夾裡的檔案放到網頁伺服器，並把所有路由導回 `index.html`，不要直接雙擊打開。

下一章，我們會實際把網站部署到雲端上。我們下一章見。
-->
