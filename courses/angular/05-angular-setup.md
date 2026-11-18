---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 安裝 / 新建 Angular 專案
routeAlias: ch05
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
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    安裝 / 新建 Angular 專案
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「從零開始，建立你的第一個 Angular 專案」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們熟悉了終端機，這一章終於要動手，在電腦上把 Angular 的開發環境建起來。

開發環境就像廚房的工具，今天裝得順利，之後寫程式就會順手；裝得不完整，之後就會一直被環境問題卡住。所以這一章的每個步驟都很重要。

學完這一章，我們的電腦會具備完整的開發工具，也會親手建立並跑起第一個 Angular 專案。
-->

---
layout: default
---

# Outline

- **1. 安裝前置工具** — NVM、Node.js、Angular CLI
- **2. 建立與執行專案** — ng new、ng serve
- **3. 認識專案結構** — 根目錄、src 資料夾、元件組成
- **4. 版本對應觀念** — package.json、語意化版本號

<!--
這一章分成四個部分。首先安裝三個前置工具：NVM、Node.js 和 Angular CLI。接著用指令建立一個新專案，並且把它跑起來。再來，我們會看看專案裡有哪些重要的檔案。最後，搞懂版本號的意義，之後安裝各種套件時才不會卡住。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 1. 安裝前置工具
# Install Prerequisites

<!--
我們先從第一個工具 NVM 開始安裝。
-->

---

# 什麼是 NVM？

開發時有時候會遇到**不同版本的 Node.js 專案**，不同版本有時候會有不同運作方式。

| 工具 | 說明 |
| --- | --- |
| NVM | Node Version Manager，讓同一台電腦安裝多個 Node.js 版本 |
| 用途 | 依專案需求自由切換 Node.js 版本 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>安裝順序：</b> NVM → Node.js → Angular CLI，需依序安裝。
</div>

<!--
開發時，我們有時候會同時維護好幾個專案，而不同專案可能需要不同版本的 Node.js。

NVM 的全名是 Node Version Manager，它讓「同一台電腦可以安裝多個 Node.js 版本」，並且依照專案需求自由切換。我們可以把它想成一個遙控器，按一下就切換到需要的版本。

如果不用 NVM，每次換專案都要把 Node.js 解除安裝再重裝一次，非常麻煩。所以實務上，我們會先裝 NVM，再透過它來安裝 Node.js。

注意安裝的順序：先裝 NVM，再裝 Node.js，最後才是 Angular CLI。
-->

---

# 安裝 NVM（Windows）

前往以下網址，於 **Assets** 區下載 `nvm-setup.exe` 並安裝：

```bash
# 網址
https://github.com/coreybutler/nvm-windows/releases
```

<div class="flex justify-center my-3">
  <img src="/images/05-angular-setup/nvm-windows-assets.png" alt="nvm-windows releases 頁面 Assets 區，下載 nvm-setup.exe" style="max-height: 220px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>下載選項：</b> 選擇 <code>nvm-setup.exe</code>（安裝版），不要選 <code>nvm-noinstall.zip</code>。安裝完成後，開啟命令提示字元並輸入 <code>nvm</code>，若看到說明畫面即安裝成功。
</div>

<!--
用 Windows 的同學，請到畫面上的 GitHub 網址，找到 Assets 區塊，下載 `nvm-setup.exe` 這個安裝版。注意不要選 noinstall 的壓縮檔。

下載後雙擊開啟，照著畫面一路按下一步就可以了。

安裝完成後，打開命令提示字元，輸入 `nvm`。如果看到一大串英文的指令說明，就代表安裝成功。

如果出現找不到指令的訊息，通常是因為命令提示字元在安裝前就已經開著了。把它關掉重新開一個，再試一次就好。
-->

---

# 安裝 NVM（macOS）

macOS 需透過終端機執行下列指令安裝 NVM：

```bash
# 安裝 NVM（v0.40.5）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 上方版本號（<code>v0.40.5</code>）可至 <a href="https://github.com/nvm-sh/nvm#installing-and-updating" target="_blank">https://github.com/nvm-sh/nvm#installing-and-updating</a> 查看最新版本。安裝後可能需要重新開啟終端機。
</div>

<!--
用 Mac 的同學，沒有安裝檔可以點，要在終端機裡執行畫面上這行 `curl` 指令。它會下載 NVM 的安裝腳本並且自動執行。

指令裡的版本號可能會更新，可以到下方的官方網址確認最新版本。

安裝完之後，記得把終端機關掉重開。如果重開後輸入 `nvm` 還是找不到指令，通常是環境設定沒有寫進去，需要依照官方說明，把幾行設定加到家目錄的 `.zshrc` 檔案裡。

【講師】Mac 環境設定比較容易卡關，可以現場協助有問題的同學。
-->

---

# 安裝 Node.js

NVM 安裝完成後，用它來安裝 Node.js。建議先至官方確認目前的 LTS（長期支援）穩定版本。

```bash
# 安裝指定版本（例如安裝 22.x 最新版）
nvm install 22

# 列出已安裝的 Node.js 版本
nvm list

# 切換使用指定版本（依 nvm list 顯示的版本填入）
nvm use 22.xx.x

# 確認安裝成功
node -v
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>技巧：</b> 只輸入主版本號（如 <code>22</code>），NVM 會自動安裝該版本最新的小版號。可用 <code>nvm list</code> 查看已安裝版本，再用 <code>nvm use</code> 切換。若 <code>node -v</code> 無反應，關閉命令提示字元重開再試。
</div>

<!--
NVM 裝好之後，就可以用它來安裝 Node.js。

第一行 `nvm install 22`，會下載並安裝 Node.js 22 版。只輸入主版本號的話，NVM 會自動挑選這個版本裡最新的一版。接著用 `nvm list` 列出已經安裝的版本，再用 `nvm use` 加上完整版本號，切換到要使用的版本。

最後輸入 `node -v`，如果顯示 v22 開頭的版本號，就代表安裝成功了。

實務上，我們通常會選擇 LTS 版本，也就是長期支援版，因為它比較穩定。如果 `node -v` 沒有反應，一樣先把命令提示字元關掉重開。
-->

---

# 安裝 @angular/cli

Node.js 安裝完成後，用 npm 全域安裝 Angular CLI：

```bash
# 安裝 Angular CLI
npm install -g @angular/cli@19.0.5

# 確認安裝成功
ng v
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>確認成功：</b> 輸入 <code>ng v</code> 後若看到版本清單，即代表安裝成功，之後即可使用 <code>ng</code> 指令。
</div>

<!--
Node.js 準備好之後，就可以安裝這門課的主角工具：Angular CLI。

CLI 是命令列工具的意思，之後建立專案、啟動網頁、新增元件，都要靠它。

輸入 `npm install -g @angular/cli@19.0.5`。其中 `-g` 代表「全域安裝」，裝好之後，不管在哪個資料夾都能使用 `ng` 指令。後面的 `19.0.5` 是指定版本，讓大家的環境保持一致。

安裝完成後，輸入 `ng v`。如果看到 Angular 的 Logo 和一份版本清單，就代表安裝成功了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 2. 建立與執行專案
# Create & Run Project

<!--
工具都安裝好了，接下來我們就用 Angular CLI 建立第一個專案，並且把它跑起來。
-->

---

# 建立 Angular 專案

開啟命令提示字元，切換至想放置專案的目錄，再執行 `ng new`：

```bash
# 建立新專案
ng new 專案名稱
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Windows 快捷：</b> 在資料夾路徑列直接輸入 <code>cmd</code>，可直接在該目錄開啟命令提示字元。
</div>

<!--
建立專案只需要一行指令。

先打開命令提示字元，切換到想放專案的資料夾，然後輸入 `ng new`，後面接專案名稱。Angular CLI 會自動幫我們產生一整個專案需要的檔案和資料夾，就像買了一間已經配好水電、隔間的房子。

專案名稱要注意兩件事：不要用中文，也不要有空格。建議用英文小寫，單字之間用連字號連接，例如 `my-first-app`。

另外，用 Windows 的話，可以在檔案總管的路徑列直接輸入 cmd，就會在那個資料夾開啟命令提示字元。
-->

---

# 建立專案 — 安裝選項

執行 `ng new` 後會出現兩個問題：

| 問題 | 選擇 | 說明 |
| --- | --- | --- |
| 第一個選項（樣式格式） | **Sass (SCSS)** | 選擇 SCSS 作為樣式格式 |
| 第二個選項（Server-Side Rendering） | **N** | 輸入 N，不啟用 SSR |

選完後等待安裝完成，看到成功畫面即代表專案建立完畢。

<!--
執行 `ng new` 之後，CLI 會問我們兩個問題。

第一個問題是樣式要用哪一種格式。請用方向鍵選擇 Sass，也就是 SCSS。它是 CSS 的進階版本，可以寫得更有條理，這門課會一直使用它。

第二個問題是要不要啟用 Server-Side Rendering，也就是伺服器端渲染。請輸入 N 再按 Enter。這個功能會讓專案架構變得比較複雜，初學階段先不需要。

選完之後，CLI 會開始下載套件，需要等一段時間，看到成功的訊息就代表專案建立完成了。
-->

---

# 執行 Angular 專案

進入剛建立的專案目錄，執行 `ng serve` 啟動開發伺服器：

```bash
# 進入專案目錄
cd 專案名稱

# 啟動專案
ng serve

# 啟動並自動開啟瀏覽器（簡寫）
ng s --open
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>預設網址：</b> 開啟瀏覽器後前往 <code>http://localhost:4200</code>，看到 Angular 預設頁面即代表成功。
</div>

<!--
專案建好之後，我們要讓它跑起來。

這裡有一個很常見的錯誤：忘記先進入專案資料夾。所以第一步一定是 `cd` 加上專案名稱。

接著輸入 `ng serve`，它會在我們的電腦上啟動一個開發用的伺服器。也可以用簡寫 `ng s --open`，加上 `--open` 會自動幫我們打開瀏覽器。

當終端機顯示編譯成功，就可以在瀏覽器打開 localhost 冒號 4200 這個網址。看到 Angular 的預設頁面，就代表我們的第一個 Angular 專案成功跑起來了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 3. 認識專案結構
# Project Structure

<!--
專案跑起來之後，我們打開專案資料夾，看看裡面到底有哪些檔案。
-->

---

# 專案根目錄 — 重要檔案

用 VS Code 開啟專案資料夾後，初期只需了解以下三個：

| 檔案 / 資料夾 | 說明 |
| --- | --- |
| `node_modules/` | 存放所有套件（底層與新增套件都在這） |
| `package.json` | 記錄專案使用的套件與版本，可在此指定版本 |
| `src/` | 存放網站內容（HTML、SCSS、TS 等原始碼） |

<!--
用 VS Code 打開專案資料夾，會看到很多檔案。剛開始不需要全部搞懂，只要先認識這三個就好。

`node_modules` 資料夾存放專案用到的所有套件，裡面的檔案非常多，但我們通常不需要手動去改它。

`package.json` 記錄了專案用了哪些套件，以及各自的版本。之後安裝新套件，它都會自動更新。

`src` 資料夾則放著網站的原始碼，也就是我們的 HTML、SCSS 和 TypeScript，之後我們寫程式，大部分時間都在這個資料夾裡。
-->

---

# src 資料夾 — 核心檔案

| 檔案 | 說明 |
| --- | --- |
| `styles.scss` | 全站 Global CSS 設定 |
| `main.ts` | 整個網站的啟動入口點 |
| `app.component.html` | 使用者看到的畫面模板（HTML） |
| `app.component.scss` | 對應 HTML 的樣式（SCSS） |
| `app.component.spec.ts` | 測試案例撰寫檔案 |
| `app.component.ts` | 元件的邏輯程式碼（Class） |
| `app.config.ts` | 應用程式配置文件 |
| `app.routes.ts` | 路由配置文件 |

<!--
接著打開 `src` 資料夾，看看裡面的核心檔案。

`styles.scss` 是全站共用的樣式，寫在這裡的設定會套用到整個網站。`main.ts` 是整個網站的啟動入口。

中間這四個 `app.component` 開頭的檔案，組成了網站最外層的元件，分別是畫面、樣式、測試和邏輯程式碼。

最後兩個，`app.config.ts` 是應用程式的設定檔，`app.routes.ts` 則負責路由，也就是網址和頁面的對應，這兩個我們之後的章節會再詳細介紹。
-->

---

# Angular 元件組成

一個 Angular 元件（Component）最少包含以下三個檔案，**缺一不可**：

| 檔案 | 職責 |
| --- | --- |
| `.html` | 畫面 UI 模板（使用者看到的畫面） |
| `.scss` | UI 的樣式（CSS） |
| `.ts` | 程式碼邏輯（Class） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 三個檔案相輔相成，HTML 負責結構、SCSS 負責外觀、TS 負責邏輯，共同組成一個完整元件。
</div>

<!--
剛才我們看到 `app.component` 開頭的幾個檔案，這就是 Angular 最重要的結構：元件，英文是 Component。

一個元件最少由三個檔案組成。我們可以把元件想成一塊樂高積木：`.html` 決定積木的形狀，也就是畫面的結構；`.scss` 決定積木的顏色，也就是外觀；`.ts` 則像積木裡的電子零件，決定它被點擊時會有什麼反應。

在 Angular 裡，我們不會把整個網頁寫在一個檔案，而是拆成很多元件，例如導覽列一個、側邊欄一個，最後再組合起來。

【講師】可以現場打開 `app.component.html` 改幾個字並存檔，讓大家看到瀏覽器自動更新畫面。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 4. 版本對應觀念
# Version Compatibility

<!--
最後一個部分，我們來聊版本號。從下一章開始，我們會不斷安裝各種套件，看懂版本號，遇到安裝錯誤時才知道怎麼處理。
-->

---

# Angular 是一組「聯名套裝」

Angular 不是單一套件，而是一整組必須**互相對應**的零件：

| 零件 | 說明 |
| --- | --- |
| `@angular/cli` | 全域安裝，決定 `ng` 指令的行為 |
| `@angular/core` | 專案實際使用的 Angular 版本 |
| `typescript` | 每個 Angular 版本只支援特定的 TS 版本範圍 |
| `rxjs` | 同樣有對應的版本需求 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵：</b>全域 CLI 與專案版本是<b>獨立</b>的。全域 CLI 只是「蓋房子的工人」，專案的 <code>package.json</code> 才是「房子的合約書」。
</div>

<!--
Angular 不是單一一個套件，而是一整組必須「互相對應」的零件。

看表格，`@angular/cli` 是我們剛才全域安裝的工具，決定 `ng` 指令的行為。`@angular/core` 是專案實際使用的 Angular 版本。另外，每個 Angular 版本只支援特定範圍的 TypeScript 和 RxJS 版本，不搭的話專案就跑不起來。

很多人以為把全域的 CLI 換版本，專案就會跟著換。其實不是。全域 CLI 就像「蓋房子的工人」，專案裡的 `package.json` 才是「房子的合約書」。真正決定專案跑哪個版本的，是那份合約書。
-->

---

# 讀懂 package.json 的版本號

打開 `package.json`，你會看到版本號前面有些奇怪的符號：

```json
"dependencies": {
  "@angular/core": "^21.2.0",
  "rxjs": "~7.8.0",
  "tslib": "2.3.0"
}
```

| 符號 | 名稱 | 允許自動更新到 | 範例（以 `21.2.0` 為例） |
| --- | --- | --- | --- |
| `^` | caret | 同一個**大版**內的最新版 | `21.2.0` ~ `21.9.9`，但不會到 `22` |
| `~` | tilde | 同一個**次版**內的最新版 | `21.2.0` ~ `21.2.9`，但不會到 `21.3` |
| 無符號 | 精確鎖定 | 不更新 | 只裝 `21.2.0` |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 版本號格式是 <code>主版本.次版本.修訂號</code>（Semantic Versioning，語意化版本）：<br/>
<b>主版本</b>變動代表有破壞性改動；<b>次版本</b>是新增功能；<b>修訂號</b>只是修 bug
</div>

<!--
打開 `package.json`，會看到版本號前面有一些符號。

版本號的格式是「主版本、次版本、修訂號」三段數字，這叫做語意化版本。主版本變動代表有不相容的改動，次版本代表新增功能，修訂號則只是修正錯誤。

看表格。`^` 這個符號最常見，意思是可以自動更新到同一個主版本內的最新版，以 21.2.0 為例，最多更新到 21 開頭的最新版，不會跳到 22。`~` 比較保守，只允許修訂號更新，所以會停在 21.2 開頭。沒有符號，就是精確鎖定這一版。

記住一個原則就好：「數字越前面，改動越大，風險也越高」。
-->

---

# 確認目前版本 — `ng version`

隨時可以在專案目錄下確認整組版本是否對得上：

```bash
ng version
```

會列出全域 CLI 版本、Angular 各套件版本、Node.js 版本、TypeScript 版本。

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b>安裝套件時看到 <code>ERESOLVE unable to resolve dependency tree</code>，代表你要裝的套件<b>不支援你目前的 Angular 版本</b>。<br/>
先看該套件的 <code>peerDependencies</code> 要求哪一版，不要急著加 <code>--force</code> 硬裝。
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 官方版本對應表：<code>angular.dev/reference/versions</code>
</div>

<!--
最後介紹一個很實用的檢查指令：`ng version`。

在專案資料夾裡執行它，會列出全域 CLI、Angular 各個套件、Node.js 和 TypeScript 的版本。當套件裝不起來，或專案突然跑不動的時候，第一步就是先執行它看看現況。

之後我們很可能會遇到 ERESOLVE 這個錯誤，意思是「想安裝的套件不支援目前的 Angular 版本」。網路上常有人建議加上 `--force` 強制安裝，但這只是把問題往後延，之後很可能出現更難找的錯誤。

正確的做法是查看那個套件支援哪個版本，再安裝對應的版本。官方的版本對應表就在畫面最下方的網址。
-->

---
layout: end
---

# 課程結束
### 環境建置完成，準備開始開發你的 Angular 應用程式！

<!--
這一章我們完成了開發環境的建置。

我們依序安裝了 NVM、Node.js 和 Angular CLI，用 `ng new` 建立專案，再用 `ng serve` 把它跑起來。我們也認識了專案的重要檔案，知道一個元件由 HTML、SCSS、TypeScript 三個檔案組成。最後，我們學會看懂版本號，以及用 `ng version` 檢查環境。

環境準備好了，下一章我們來安裝寫程式要用的編輯器 VS Code。我們下一章見。
-->
