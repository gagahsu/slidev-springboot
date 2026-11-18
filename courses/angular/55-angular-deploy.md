---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Angular 部署
routeAlias: ch55
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
    Angular 部署
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「透過 Firebase Hosting 將 Angular 應用程式發布至網際網路」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們用 `ng build` 把專案打包成靜態檔案。這一章，我們要把它真正發布到網路上，讓任何人都能透過網址連進來。

我們會使用 Firebase Hosting，它是 Google 提供的免費網站托管服務。只要把打包好的檔案交給它，它就會幫我們準備好伺服器和網址，不用自己架設主機。學完這一章，我們就能用一行指令把網站部署上線。
-->

---
layout: default
---

# Outline

- **部署概念與 Firebase Hosting 介紹**
- **安裝 Firebase CLI 與登入**
- **初始化 Firebase Hosting（firebase init hosting）**
- **連結 Firebase 專案與設定選項**
- **部署至 Firebase（firebase deploy）**

<!--
這一章會先說明為什麼要使用 Firebase Hosting，接著安裝 Firebase CLI 並登入帳號。然後執行 `firebase init hosting`，一題一題回答設定問題，把專案連結到 Firebase。最後執行 `firebase deploy`，把網站發布出去。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 部署概念與 Firebase Hosting 介紹

Introduction to Deployment and Firebase Hosting

<!--
我們先搞清楚，為什麼打包完還需要一個托管服務，以及 Firebase Hosting 適合用在哪裡。
-->

---

# 為何使用 Firebase Hosting 部署

Angular 專案完成 `ng build` 打包後，需要一個網頁托管服務才能讓外界存取。Firebase Hosting 是 Google 提供的免費靜態網站托管平台，適合部署 Angular 單頁應用程式。

- Angular 打包後產出純靜態檔案（HTML、CSS、JavaScript）
- Firebase Hosting 提供免費的 HTTPS 域名與全球 CDN 加速
- 部署流程透過 Firebase CLI 指令完成，操作簡便
- 支援 SPA 路由設定，可將所有請求導向 `index.html`

<div class="flex justify-center"><img src="/images/55-angular-deploy/firebase-hosting-logo.png" class="rounded shadow-md max-h-80" /></div>

<!--
上一章打包出來的 `dist` 資料夾，目前只存在我們自己的電腦裡，別人連不到。就像菜已經做好了，但餐廳還沒開門，客人進不來。

Firebase Hosting 就是 Google 提供的免費靜態網站托管平台。Angular 打包後是純靜態的 HTML、CSS 和 JavaScript 檔案，剛好適合放在這裡。

它提供免費的 HTTPS 網址，還有全球的 CDN 加速，讓不同地區的使用者都能快速連上。部署只要用 Firebase CLI 的指令就能完成。另外，它也支援單頁應用的路由設定，可以把所有請求導回 `index.html`，等一下會實際設定。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 安裝 Firebase CLI 與登入

Installing Firebase CLI and Logging In

<!--
要使用 Firebase Hosting，第一步是在電腦上安裝它的命令列工具，並登入 Google 帳號。
-->

---

# 安裝 Firebase CLI（一）

首先全域安裝 Firebase CLI 套件：

```bash
npm install -g firebase-tools
```

安裝完成後，執行以下指令登入 Firebase 帳號：

```bash
firebase login
```

- `npm install -g firebase-tools` 加上 `-g` 代表全域安裝，整台電腦都能使用這個指令，不侷限在單一專案裡
- 安裝完成後，用 `firebase login` 登入 Google 帳號，後續 CLI 操作才知道要用哪個帳號的身份執行

<!--
第一個指令是 `npm install -g firebase-tools`，安裝 Firebase 的命令列工具。`-g` 代表全域安裝，整台電腦都能使用這個指令。

安裝完成後，執行 `firebase login` 登入 Google 帳號，之後 CLI 才知道要用哪個帳號的身分操作。

執行之後不會馬上跳出瀏覽器，CLI 會先問幾個問題，下一頁接著看。
-->

---

# 安裝 Firebase CLI（二）

執行 `firebase login` 後，CLI 會先詢問兩個是否啟用的設定：

<div class="flex justify-center"><img src="/images/55-angular-deploy/firebase-login-prompts.png" class="rounded shadow-md max-h-64" /></div>

- **Enable Gemini in Firebase features?**：是否啟用 Gemini 相關功能，選 **No** 即可，不影響部署流程
- **Allow Firebase to collect CLI and Emulator Suite usage and error reporting information?**：是否允許蒐集使用統計與錯誤回報，選 **Y** 或 **n** 皆可，純屬個人選擇
- 回答完上述兩題後，系統才會自動開啟瀏覽器，引導完成 Google 帳號授權
- 授權完成後，終端機會顯示登入成功訊息
- 後續所有 Firebase CLI 操作皆以此帳號身份執行

<!--
執行 `firebase login` 之後，CLI 會先問兩個問題。

第一個問題是要不要啟用 Gemini 相關的功能，跟部署沒有關係，選 No 就好。第二個問題是要不要讓 Firebase 收集使用統計和錯誤回報，這是個人選擇，選 Y 或 n 都可以。

回答完之後，瀏覽器才會自動打開，引導我們完成 Google 帳號的授權。授權完成，終端機會顯示登入成功，之後所有的 Firebase 指令，都會用這個帳號的身分執行。

如果瀏覽器沒有自動打開，可以看看終端機有沒有印出一個連結，複製到瀏覽器打開就可以了。
-->

---

# 登入失敗排解：檢查 Node 版本

若執行 `firebase login` 後一直卡住或授權失敗，優先檢查 Node.js 版本：

```bash
node -v
```

- Firebase CLI 對 Node 版本較敏感，建議使用 **Node 20**
- 若版本不是 20.x，登入流程可能卡住、逾時，或授權後無回應
- 確認版本後，若非 20，接續下一頁改用 nvm 安裝並切換

<!--
如果 `firebase login` 一直卡住，或授權完之後終端機沒有反應，先不要懷疑帳號有問題，第一件事是檢查 Node.js 的版本。

執行 `node -v` 查看目前的版本。Firebase CLI 對 Node 的版本比較敏感，建議使用 Node 20。如果版本不是 20，登入就可能卡住、逾時，或授權後沒有反應。

如果版本不對，下一頁看怎麼用 nvm 切換。
-->

---

# 使用 nvm 安裝並切換至 Node 20.18.0

透過 nvm 安裝指定版本的 Node，再重新嘗試登入：

```bash
nvm install 20.18.0
nvm use 20.18.0
```

切換完成後，重新執行登入指令：

```bash
firebase login
```

- 安裝完成後，用 `node -v` 再次確認版本已切換為 `20.18.0`
- 大多數登入失敗問題，切換至 Node 20.18.0 後即可正常完成授權

<!--
我們用之前安裝環境時學過的 nvm 來切換版本。

`nvm install 20.18.0` 安裝這個指定的版本，再用 `nvm use 20.18.0` 切換過去。切換之後，可以用 `node -v` 確認版本是 20.18.0。

接著重新執行 `firebase login`。大多數登入失敗的情況，切換到這個版本之後就能順利完成。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 初始化 Firebase Hosting

Initializing Firebase Hosting

<!--
登入完成後，接下來在專案裡初始化，連結 Firebase 專案和要托管的資料夾。
-->

---

# 執行 firebase init hosting

進入 Angular 專案的根目錄後，執行初始化指令：

```bash
firebase init hosting
```

執行後 CLI 會先確認是否要在目前目錄初始化 Firebase 專案：

```
? Are you ready to proceed? (Y/n)
```

- 確認目前所在路徑為要初始化的 Angular 專案根目錄後，輸入 **Y** 繼續
- 選擇 Y 後，CLI 才會接著詢問要連結哪一個 Firebase 專案

<!--
在 Angular 專案的根目錄，執行 `firebase init hosting`。

執行之後，CLI 會先問：Are you ready to proceed? 意思是確認要在目前的資料夾初始化。因為它接下來會在這個資料夾產生設定檔，所以要先確認畫面上顯示的路徑，是自己專案的根目錄。

確認沒問題，輸入 Y 繼續，CLI 就會開始一題一題詢問設定。
-->

---

# 選擇要連結的 Firebase 專案

選擇 Y 繼續後，CLI 詢問要連結哪一個 Firebase 專案：

<div class="flex justify-center"><img src="/images/55-angular-deploy/firebase-init-select-project-option.png" class="rounded shadow-md max-h-80" /></div>

- **Use an existing project**：連結已在 Firebase Console 建立的現有專案
- **Create a new project**：在 Firebase 中新建一個專案並連結
- 第一次操作、尚未在 Firebase Console 建立過專案者，選擇 **Create a new project** 即可

<!--
接著 CLI 會問要連結哪一個 Firebase 專案。

如果已經在 Firebase Console 網站上建立過專案，就選 Use an existing project，連結現有的專案。如果是第一次操作，就選 Create a new project，讓 CLI 直接幫我們建立一個新的。

第一次操作的話，選 Create a new project 就可以了，用上下鍵選擇，按 Enter 確認。
-->

---

# 備援：CLI 建立專案失敗時的處理方式

選擇 Create a new project 後，若出現以下錯誤：

```
✖ Adding Firebase resources to Google Cloud Platform project
Error: Failed to add Firebase to Google Cloud Platform project.
```

- 此錯誤代表 Google 帳號權限被擋（`403 PERMISSION_DENIED`），CLI 端無法自動建立
- 解法：改用 Firebase Console **網頁介面**手動建立專案，再回 CLI 連結既有專案
  1. 開啟 [console.firebase.google.com](https://console.firebase.google.com)，用同一組帳號登入，點選「新增專案」完成建立
  2. 回到終端機，重新執行 `firebase init hosting`
  3. 這次選擇 **Use an existing project**，選取剛剛在網頁建好的專案

<!--
有些人選擇建立新專案之後，會遇到畫面上這個錯誤，訊息是無法把 Firebase 加到 Google Cloud 專案。

這通常是因為 Google 帳號的權限被擋下來，錯誤代碼是 403，代表 CLI 沒辦法自動建立專案。

解決方法是換一條路：打開 Firebase Console 網站，用同一個帳號登入，在網頁上點選新增專案，手動建立。建立完成後，回到終端機重新執行 `firebase init hosting`，這次改選 Use an existing project，把剛才在網頁建好的專案選進來就可以了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 連結 Firebase 專案與設定選項

Linking a Firebase Project and Configuring Options

<!--
接下來，CLI 會依序問好幾個設定問題，包括專案 ID、專案名稱和公開目錄，我們一題一題看。
-->

---

# 設定專案 ID（建立新專案時）

若選擇建立新專案，CLI 會要求輸入一個唯一的專案 ID：

<div class="flex justify-center"><img src="/images/55-angular-deploy/firebase-init-project-id-prompt.png" class="rounded shadow-md max-h-80" /></div>

- 專案 ID 需為 6 至 30 個字元
- ID 一經設定即**無法修改**，請謹慎命名
- ID 將成為 Firebase 托管網址的一部分（如 `https://<project-id>.web.app`）

<!--
如果選擇建立新專案，CLI 會要求輸入一個專案 ID，長度要在 6 到 30 個字元之間。

要特別注意，這個 ID 一旦設定就不能修改。而且它會直接成為網站網址的一部分，例如 `web.app` 前面的那一段。所以取名時要想清楚，取一個有意義的名稱。
-->

---

# 設定專案名稱

設定專案 ID 後，CLI 會詢問專案的顯示名稱，預設值為專案 ID：

<div class="flex justify-center"><img src="/images/55-angular-deploy/firebase-init-project-name-prompt.png" class="rounded shadow-md max-h-80" /></div>

- 顯示名稱僅用於 Firebase Console 介面辨識，不影響網址
- 可直接按 Enter 採用預設的專案 ID 作為名稱
- 完成後 Firebase 開始在後台建立專案

<!--
接著 CLI 會問專案的顯示名稱，預設就是剛才的專案 ID。

這個名稱只是在 Firebase Console 網站上辨識用的，不會出現在網址裡，直接按 Enter 使用預設值就可以了。

按下去之後，Firebase 就會開始在後台建立專案，稍等一下就好。
-->

---

# 設定公共目錄（Public Directory）

Firebase 專案建立完成後，CLI 詢問 Angular 的公共目錄路徑：

<div class="flex justify-center"><img src="/images/55-angular-deploy/firebase-init-public-directory-prompt.png" class="rounded shadow-md max-h-80" /></div>

- 此路徑需指向 `ng build` 產出的 `dist/<專案名稱>/browser/` 目錄
- 該目錄內必須包含 `index.html` 檔案
- 範例：若專案名稱為 `quest`，則輸入 `dist/quest/browser`

<!--
這一題非常關鍵。CLI 問的是 public directory，也就是要托管哪個資料夾。

這裡要指向上一章 `ng build` 打包出來的資料夾，也就是 `dist`、專案名稱、`browser`。例如專案名稱是 quest，就輸入 `dist/quest/browser`。

最常見的錯誤，是輸入成專案的根目錄，或是忘了加上 `browser` 這一層。判斷的方法很簡單：這個資料夾裡一定要有 `index.html`，找不到就代表路徑寫錯了。
-->

---

# 設定單頁應用程式（SPA）模式

CLI 詢問是否將網站設定為單頁應用程式：

<div class="flex justify-center"><img src="/images/55-angular-deploy/firebase-init-spa-rewrite-prompt.png" class="rounded shadow-md max-h-80" /></div>

- Angular 為 SPA，此選項必須選擇 **Y**（是）
- 選擇 Y 後，Firebase 會將所有 URL 請求重新導向至 `/index.html`
- 這樣可確保 Angular Router 能正確處理所有前端路由，避免重新整理時出現 404 錯誤

<!--
接著 CLI 會問：要不要把網站設定成單頁應用程式。Angular 是單頁應用，所以這裡一定要選 Y。

還記得路由那一章嗎？網址雖然有 `/about`、`/product` 這些路徑，但伺服器上其實只有一個 `index.html`。如果沒有這個設定，使用者直接輸入 `/about`，或按重新整理，伺服器會去找一個叫 about 的檔案，找不到就出現 404。

選 Y 之後，Firebase 會把所有請求都導回 `index.html`，交給 Angular 的路由處理，就不會有這個問題。
-->

---

# 設定 GitHub 自動化部署

接著詢問是否透過 GitHub 設定自動建置與部署：

<div class="flex justify-center"><img src="/images/55-angular-deploy/firebase-init-github-autodeploy-prompt.png" class="rounded shadow-md max-h-80" /></div>

- 初次設定建議選擇 **N**（否），跳過此步驟
- 日後有自動化 CI/CD 需求時，可修改 `firebase.json` 或重新執行 `firebase init` 進行設定

<!--
接著 CLI 會問要不要設定 GitHub 自動化部署，也就是每次把程式推到 GitHub，就自動建置和部署。

第一次設定建議選 N，先熟悉手動部署的流程。之後有自動化的需求時，可以修改 `firebase.json`，或重新執行 `firebase init` 來設定。
-->

---

# 設定 Agent Skills（新版 CLI）

新版 Firebase CLI 會詢問是否安裝 AI 開發助理（agent）用的技能套件：

```
? Would you like to install agent skills for Firebase? (Y/n)
```

- 這是給 AI coding agent（如 Claude Code）使用的整合功能，與部署流程無關
- 選擇 **N**（否）即可，不影響後續 `firebase deploy`

<!--
比較新版的 Firebase CLI，最後還會多問一題：要不要安裝給 AI 開發助理使用的技能套件，例如給 Claude Code 這類工具使用。

這個功能跟部署完全無關，選 N 跳過就可以了，不會影響後面的部署。
-->

---

# 初始化完成

回答完所有問題後，終端機顯示初始化完成訊息：

```
+  Wrote configuration info to firebase.json
+  Wrote project information to .firebaserc

+  Firebase initialization complete!
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> 專案根目錄會自動產生 <code>.firebaserc</code> 與 <code>firebase.json</code> 兩個設定檔，這兩個檔案記錄專案與 Firebase 的連結資訊，請勿刪除。</div>

<!--
回答完所有問題，終端機會顯示初始化完成的訊息，告訴我們 `firebase.json` 和 `.firebaserc` 兩個設定檔已經寫好了。

這兩個檔案記錄了專案 ID、托管的資料夾這些設定，之後每次部署都會讀取它們，所以不要刪除。刪掉的話，CLI 就不知道要部署到哪個 Firebase 專案了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 部署至 Firebase

Deploying to Firebase Hosting

<!--
設定都完成了，最後一步，就是把網站真正發布到網路上。
-->

---

# 執行 firebase deploy

確認已完成 `ng build` 打包後，在專案根目錄執行部署指令：

```bash
firebase deploy
```

- CLI 會將 `public directory` 路徑內的所有靜態檔案上傳至 Firebase Hosting
- 部署完成後，終端機會顯示專案主控台網址與網站托管網址

<div class="flex justify-center"><img src="/images/55-angular-deploy/firebase-deploy-success-output.png" class="rounded shadow-md max-h-80" /></div>

<!--
在專案根目錄執行 `firebase deploy`。

執行之前，一定要確認已經跑過 `ng build`。因為 `firebase deploy` 只會上傳剛才設定的公開目錄裡的檔案，如果那個資料夾是舊的，部署出去的也會是舊的內容。

所以修改程式之後，要先 `ng build`，再 `firebase deploy`，兩個步驟缺一不可。執行完成後，終端機會顯示兩個網址，下一頁說明。
-->

---

# 部署完成後的輸出資訊

`firebase deploy` 成功後，終端機顯示以下資訊：

```
Project Console: https://console.firebase.google.com/project/<project-id>/overview
Hosting URL:     https://<project-id>.web.app
```

| 項目 | 說明 |
| --- | --- |
| Project Console | Firebase 後台管理介面網址 |
| Hosting URL | 公開可存取的網站網址 |

- 開啟 **Hosting URL** 即可在網際網路上存取已部署的 Angular 應用程式
- 若需更新內容，重新執行 `ng build` 後再次執行 `firebase deploy` 即可

<!--
部署成功後，終端機會印出兩個網址。

Project Console 是 Firebase 的後台管理介面，可以在裡面查看流量、修改設定。Hosting URL 才是真正公開的網站網址，把這個網址分享給任何人，他們都能用瀏覽器連上我們做的網站。

之後如果程式有更新，只要重新 `ng build`，再執行一次 `firebase deploy`，網址不變，內容就會更新成最新的版本。

【講師】可以請大家打開自己的 Hosting URL，確認網站已經上線。
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

# 補充練習 1–2：打包檢查與路徑錯誤除錯

**練習 1：發布前打包**

1. 在專案根目錄執行 `ng build`
2. 確認專案中多出 `dist/` 資料夾
3. 一路點到最內層，確認裡面有網站入口 `index.html`

**練習 2：public 路徑設錯會怎樣？**

1. 執行 `firebase init` 時，public 目錄的問題**故意直接按 Enter**，使用預設值 `public`
2. 執行 `firebase deploy`，打開 Hosting 網址，觀察畫面
3. 打開 `firebase.json`，把 `"public": "public"` 改成 `"dist/你的專案名稱/browser"`，重新部署

<!--
接下來兩題補充練習。

第一題，部署前先確認打包結果：`dist` 資料夾裡有沒有 `index.html`。

第二題是除錯實驗：初始化時故意不改 public 目錄，部署後看看網站變成什麼樣子，再從 `firebase.json` 修正回來。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```text
dist/
└── 你的專案名稱/
    └── browser/
        ├── index.html      ← 網站入口
        ├── main-xxxx.js
        └── styles-xxxx.css
```

```json
{
  "hosting": {
    "public": "dist/quest/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

<!--
我們來看答案。

`ng build` 之後，`index.html` 在 `dist`、專案名稱、`browser` 這一層，這就是要上傳到雲端的資料夾。

如果 public 用預設值，Firebase 上傳的是空的 `public` 資料夾，網站就不會是你的專案，而是 Firebase 的預設頁面或錯誤頁面。只要把 `firebase.json` 的 `public` 改成正確的路徑，重新部署就好。
-->

---
layout: default
---

# 補充練習 3：修改後重新發布

體驗網站修改後，如何重新發布、覆蓋舊版：

1. 在 `app.component.html` 最上方加入：

```html
<h1 style="color: #0ea5e9">🎉 Allen 老師的動態商城正式上線！</h1>
```

2. 重新打包：`ng build`
3. 重新發布：`firebase deploy`
4. 打開 Hosting 網址確認更新；如果畫面還是舊的，按 `Ctrl + F5`（Mac：`Cmd + Shift + R`）強制重新整理

<!--
第三題補充練習，練習網站更新的流程。

在首頁加一行標題，接著重新打包、重新部署，再打開網址確認有沒有更新。

如果畫面還是舊的，可能是瀏覽器快取，用強制重新整理再看一次。我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：修改後重新發布 — 參考答案

```bash
# 每次修改程式碼後的上線三步驟
ng build          # 1. 重新打包
firebase deploy   # 2. 重新發布，覆蓋雲端上的舊版本
                  # 3. 打開 Hosting 網址，必要時強制重新整理
```

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 只執行 <code>firebase deploy</code> 而沒有先 <code>ng build</code>，上傳的仍然是舊的打包結果，網站不會更新
</div>

<!--
我們來看答案。

每次修改都是同樣的三個步驟：先 `ng build` 重新打包，再 `firebase deploy` 上傳，最後打開網址確認。

最常見的錯誤是忘記先打包，直接部署。這時上傳的還是 `dist` 裡的舊檔案，網站當然不會變。記住順序：先打包，再部署。
-->

---
layout: end
---

# 課程結束

### 透過安裝 Firebase CLI、登入帳號、執行 `firebase init hosting` 完成專案連結與設定，最後執行 `firebase deploy` 將 Angular 打包後的靜態檔案部署至 Firebase Hosting，使應用程式可透過公開網址存取。

<!--
這一章我們把 Angular 專案部署到了 Firebase Hosting。先用 npm 安裝 Firebase CLI，用 `firebase login` 登入，遇到問題先檢查 Node 版本。接著執行 `firebase init hosting`，連結專案，把公開目錄設為 `dist` 底下的 `browser`，並選擇單頁應用模式。最後先 `ng build`，再 `firebase deploy`，網站就上線了。

到這裡，我們已經具備從寫程式、打包到上線的完整能力。下一章，我們會用一個綜合練習，把整門課學到的內容串起來。我們下一章見。
-->
