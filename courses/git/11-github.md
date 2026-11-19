---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: 遠端共同協作 - 使用 GitHub
routeAlias: ch11
layout: default
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
  .slidev-layout:not(.new-section) {
    background: #ffffff !important;
  }
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 版本控制課程</p>
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">遠端共同協作</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">「使用 GitHub，讓世界各地的開發者一起協作」</p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十一章，遠端共同協作。
上一章我們已經能在自己的電腦上 init、add、commit 了。
但實際工作幾乎都是多人一起開發，只在本機作業是不夠的。
這章我們要進入 GitHub。
學會把 commit 推上雲端、把別人的更新拉回來，還有怎麼開 Pull Request 請同事審查。
-->

---
layout: default
---

# Outline

- **GitHub 是什麼？** — 遠端 Repository 服務 / 社群平台
- **註冊 GitHub 帳號** — 用 Google 帳號一鍵註冊 / 帳號安全設定
- **Push 上傳到 GitHub** — git remote / git push / 身份驗證
- **Pull 下載更新** — git pull / git fetch 的差別
- **【狀況題】怎麼有時候推不上去** — 遠端有新 commit / non-fast-forward
- **從伺服器上取得 Repository** — git clone
- **【常見問題】Clone 跟 Pull 有什麼不一樣？** — 首次取得 vs 更新
- **與其它開發者互動 - Pull Request** — Fork / PR 流程


<!--
這章的主題比較多，但其實都圍繞著同一條線：本機和遠端之間怎麼同步。
我們先搞清楚 Git 和 GitHub 的差別，接著註冊帳號。
然後學 push 和 pull 這兩個最基本的動作，處理推不上去的狀況。
再來是用 clone 取得別人的專案。
最後介紹協作的核心，Pull Request。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## GitHub 是什麼？

<!--
很多人把 Git 和 GitHub 當成同一件事。我們先把這個誤會釐清。
-->

---

# GitHub 是什麼？

**Git** 是版本控制工具（本機程式），**GitHub** 是提供 Git 遠端託管的**平台服務**。

<br>

| | Git | GitHub |
| --- | --- | --- |
| 本質 | 版本控制軟體 | 雲端託管平台 |
| 安裝 | 需要安裝在本機 | 網頁服務，不需安裝 |
| 離線使用 | 可以 | 不行 |
| 擁有者 | Linux 社群（開源） | Microsoft（2018 年收購） |

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">

**一句話總結：** Git 是工具，GitHub 是使用這個工具的協作平台。就像 Email 協定（SMTP）和 Gmail 的關係。

</div>

<!--
Git 是一套版本控制軟體，安裝在我們自己的電腦上。
GitHub 則是一個雲端平台，幫我們存放 Git 的 repo，讓大家可以一起協作。
就像 Email 和 Gmail 的關係。
Gmail 壞掉了，不代表 Email 不存在，我們還是可以換別的信箱。
同樣的，就算沒有 GitHub，Git 也能正常運作。
事實上 Git 在 2005 年就有了，GitHub 是 2008 年才成立，後來在 2018 年被微軟收購。
搞懂這個差別，就能理解為什麼離線也能 commit，但 push 一定要連得上 GitHub。
-->

---

# GitHub 的核心功能

GitHub 除了存放 Repository，還提供了完整的**開發協作生態系**：

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**協作功能**

- **Issues** — 問題追蹤、任務管理
- **Pull Requests** — 程式碼審查與合併
- **Projects** — 看板式專案管理
- **Wiki** — 文件撰寫

</div>
<div>

**自動化與部署**

- **Actions** — CI/CD 工作流程自動化
- **Pages** — 靜態網站免費托管
- **Releases** — 版本發布管理
- **Packages** — 套件發布（npm, Docker 等）

</div>
</div>

<!--
GitHub 除了存放 repo，還提供了一整套協作工具。
左邊是協作功能。
Issues 用來追蹤問題和任務，Pull Requests 用來審查和合併程式碼。
Projects 是看板式的專案管理，Wiki 則用來寫文件。
右邊是自動化和部署。
Actions 可以自動跑測試和部署，Pages 能免費架設靜態網站。
Releases 管理版本發布，Packages 則用來發布套件。
現在從需求追蹤到上線部署，很多團隊都在 GitHub 上一站完成。
-->

---

# GitHub 的競爭對手

| 平台 | 特色 |
| --- | --- |
| GitLab | 開源版可自架、內建 CI/CD 功能強大 |
| Bitbucket | Atlassian 生態系（Jira、Confluence）整合佳 |
| Azure DevOps | 微軟企業環境整合 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**選擇建議：** 開源愛好者首選 GitHub；已用 Atlassian 工具的公司 Bitbucket 整合較佳；偏 DevOps 的企業環境可考慮 GitLab 或 Azure DevOps。對大多數人來說，先把 GitHub 學好就夠用了。

</div>

<!--
GitHub 不是唯一的選擇，這裡列出幾個常見的競爭對手。
GitLab 可以自己架設，內建的 CI/CD 功能很強。
Bitbucket 和 Jira、Confluence 這些 Atlassian 的工具整合得很好。
Azure DevOps 則適合微軟生態系的企業環境。
它們底層用的都是 Git，所以觀念是通用的。
對大多數人來說，先把 GitHub 學好就夠用了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 註冊 GitHub 帳號

<!--
講完平台的差別，接下來動手註冊一個 GitHub 帳號。
-->

---

# 註冊 GitHub 帳號 — 兩種方式

打開 [github.com/signup](https://github.com/signup)，最上方就有兩種註冊路徑：

<div class="grid grid-cols-2 gap-6 mt-4">
<div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 1rem 1.2rem; border-radius: 4px; height: 100%;">

**方式 A：Continue with Google** ✅ 推薦

- 一鍵帶入 Google 的 Email
- **不用**自己設密碼
- 不用等信箱收驗證碼
- 之後登入按一下 Google 就進去

</div>
<div style="background: #f8fafc; border-left: 4px solid #94a3b8; padding: 1rem 1.2rem; border-radius: 4px; height: 100%;">

**方式 B：填表單註冊**

- 輸入 Email → 設定密碼
- 取 Username
- 收信箱驗證碼（8 碼）
- 通過裝置驗證

</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 GitHub 從 2025 年 7 月起正式支援 Google 社群登入（Social Login），課堂上我們統一用這個方式，省下最多時間。
</div>

<!--
打開 GitHub 的註冊頁，最上方有兩種註冊方式。
方式 A 是 Continue with Google，直接用 Google 帳號註冊。
不用另外設密碼，也不用等信箱收驗證碼。
方式 B 是傳統的填表單，要輸入 email、設密碼，再收一組驗證碼。
以前用表單註冊，常常有人卡在收不到驗證信。
GitHub 從 2025 年開始支援 Google 登入之後，這件事簡單很多。
所以課堂上我們統一用方式 A，把時間留給 Git 本身。
要注意，這是註冊新帳號的方式，已經有帳號的人，目前還不能事後綁定 Google 登入。
-->

---

# 用 Google 帳號註冊 — 操作步驟

<div class="text-sm">

| 步驟 | 你會看到 | 要做什麼 |
| --- | --- | --- |
| 1 | GitHub 註冊頁 | 點最上方的 **Continue with Google** |
| 2 | Google「選擇帳戶」畫面 | 點你要用的 Gmail（建議用長期會用的信箱） |
| 3 | Google 授權說明 | 確認要分享姓名／Email，按 **繼續 / Continue** |
| 4 | 回到 GitHub 建立帳號頁 | 取一個 **Username**（全站唯一，會出現在網址上） |
| 5 | 出生年月日 / 電子報訂閱 | 填生日、電子報可不勾，按 **Create account** |
| 6 | 完成 | 直接進入 GitHub 首頁，帳號已可使用 |

</div>

<div class="mt-4 p-3 bg-amber-50 border-l-4 border-amber-400 text-gray-700 text-sm text-left">
📝 <b>Username 命名建議：</b> 用英文小寫 + 數字或短橫線，例如 <code>mike-chen</code>、<code>ada2026</code>。這會變成你的個人頁網址 <code>github.com/你的帳號</code>，也會印在每個 commit 上，取一個以後放履歷不會尷尬的名字。
</div>

<!--
整個流程大概三十秒，這裡有兩個地方要特別注意。
第一是第二步選帳號的時候，請選一個會長期使用的信箱。
學校或公司的信箱以後可能會被停用，到時候帳號就很難拿回來。
第二是第四步的 Username。
它會出現在個人頁的網址上，也會跟著我們的每一個 commit。
之後雖然可以改，但舊網址會失效，別人給的連結都會壞掉。
所以第一次就取一個以後放在履歷上也不尷尬的名字。
建議用英文小寫，搭配數字或短橫線。
【講師】給大家五分鐘完成註冊，巡視確認每個人都進到 GitHub 首頁。
-->

---

# 用 Google 註冊後 — 兩個一定要補的設定

用 Google 註冊時，GitHub **不會**幫你設密碼，所以要補上這兩步當作備援：

**① 補設一組 GitHub 密碼**

```text
右上角頭像 → Settings → Password and authentication
→ Change password（用「忘記密碼」流程設定新密碼）
```

**② 開啟兩步驟驗證（2FA）**

```text
Settings → Password and authentication
→ Two-factor authentication → 用手機 App（如 Google Authenticator）掃 QR Code
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ 如果哪天 Google 帳號被停用或忘記密碼，沒設 GitHub 密碼就等於<b>整個 GitHub 帳號進不去</b>。花兩分鐘補起來。
</div>

<!--
這頁很容易被跳過，但很重要。
用 Google 註冊很方便，代價是 GitHub 帳號完全依賴 Google。
萬一 Google 帳號被鎖、被停用，GitHub 就跟著進不去，裡面的專案也拿不回來。
所以註冊完請馬上補兩件事。
第一，補設一組 GitHub 自己的密碼當作備援。
因為原本沒有密碼，要用「忘記密碼」的流程來設定。
第二，開啟兩步驟驗證，用手機上的驗證 App 掃 QR Code。
GitHub 上放的是我們的程式碼資產，值得花這兩分鐘。
-->

---

# 註冊後回頭確認 `git config`

Ch 9 設定過 `user.name` / `user.email`，現在有 GitHub 帳號了，要回頭對一下：

| 設定 | 要不要跟 GitHub 一致？ | 原因 |
| --- | --- | --- |
| `user.name` | ❌ 不用 | 純顯示名稱，GitHub 不靠它認人 |
| `user.email` | ✅ **要** | GitHub 用 email 把 commit 對應到你的帳號 |

```bash
# 先確認目前設的是什麼
git config --global user.email

# 對不上就改成 GitHub 帳號裡「已驗證」的 email
git config --global user.email "你註冊 GitHub 的 email"
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ email 對不上的後果：commit 顯示灰色頭像、點作者連不到你的 profile、<b>貢獻牆一片空白</b>。
</div>

<!--
現在有 GitHub 帳號了，我們要回頭檢查第九章設定的 `user.email`。
那時候還沒有帳號，很多人是隨手填了一個信箱。
這裡要分清楚兩個設定的角色。
`user.name` 只是顯示名稱，寫什麼都可以，GitHub 不會用它來認人。
真正關鍵的是 `user.email`。
GitHub 是拿 commit 裡的 email，去比對帳號綁定的信箱，比對到了才算是我們的 commit。
如果對不上，commit 的頭像會是灰色的，點下去也連不到我們的個人頁。
最明顯的是貢獻牆，明明每天都在 commit，那面綠格子卻是一片空白。
解法很簡單，把 `user.email` 改成 GitHub 帳號裡已驗證的信箱就好。
-->

---

# `git config` email 的兩個補充

**① 不想公開真實 email → 用 GitHub 的 noreply 位址**

```bash
# Settings → Emails → 勾選 Keep my email addresses private
# GitHub 會給你一組專屬位址
git config --global user.email "12345678+username@users.noreply.github.com"
```

**② 之前用舊 email commit 的紀錄想救回來**

不用改歷史，把**舊 email 加進 GitHub 帳號並驗證**即可自動歸戶：

```text
Settings → Emails → Add email address → 收信點驗證連結
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>驗證：</b> <code>git log -1 --format='%an &lt;%ae&gt;'</code> 可以看最後一個 commit 實際記錄的作者與 email。</div>

<!--
關於 email，還有兩個補充。
第一，如果不想讓真實信箱出現在公開的 commit 裡，可以用 GitHub 提供的 noreply 位址。
在 Settings 的 Emails 頁面，勾選 Keep my email addresses private，就會拿到一組專屬位址。
用它 commit 一樣會算在我們頭上，但真實信箱不會外流。
第二，以前用舊信箱 commit 的紀錄，不需要去改歷史。
只要把舊信箱也加進 GitHub 帳號並完成驗證，GitHub 就會自動把那些 commit 認回來。
最後，用下面這行 `git log` 指令，可以確認最後一個 commit 實際記錄的作者和 email。
【講師】一個帳號可以綁多個 email，可以建議大家把公司和個人信箱都加進去。
-->

---

# 開始使用 GitHub — 電腦怎麼證明「我是我」

帳號註冊好了，但你的**電腦**還沒被 GitHub 認識。第一次 push 時要通過一次身分驗證。

<div class="text-sm mt-4">

| 方式 | 怎麼運作 | 適用情境 |
| --- | --- | --- |
| **① 瀏覽器授權（GCM）** ✅ | 跳出瀏覽器按 Authorize，憑證由工具自動保管 | **一般人的預設做法**，什麼都不用產生 |
| ② Personal Access Token | 自己到網頁產生一組長字串當密碼 | 沒有瀏覽器的環境、CI/CD、遠端主機 |
| ③ SSH Key | 產生金鑰對，公鑰貼到 GitHub | 進階使用者、長期不想再驗證 |

</div>

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-500 text-gray-700 text-sm text-left">
💡 <b>好消息：</b> 現在安裝 Git for Windows / macOS 版都會一起裝 <b>Git Credential Manager（GCM）</b>，它會自動幫你走方式 ①。所以你多半<b>不需要</b>手動產生 Token。
</div>

<!--
帳號有了，但我們的電腦還沒被 GitHub 認識。
第一次 push 的時候，GitHub 要確認操作這台電腦的人，真的是帳號主人。
有人說要用 Token，有人說要用 SSH Key，其實這三種方式是同一個問題的三種答案。
差別只在於憑證從哪裡來、由誰保管。
現在安裝 Git 時，會一起裝一個叫 Git Credential Manager 的工具，簡稱 GCM。
它會自動帶我們走瀏覽器授權，Token 也是它在背後申請和保管的。
所以如果裝完 Git，直接 push 就成功了，不是漏做了什麼，而是工具已經幫我們做完了。
-->

---

# 方式 ①：第一次 push 會發生什麼事

```bash
git push origin main
```

<div class="text-sm">

| | 畫面 | 你要做的事 |
| --- | --- | --- |
| 1 | 跳出 GCM 視窗，有 **Sign in with your browser** | 按下去 |
| 2 | 瀏覽器開啟 GitHub 登入頁 | 已登入直接下一步；沒登入就按 **Continue with Google** |
| 3 | **Authorize Git Credential Manager** 授權頁 | 按 **Authorize** |
| 4 | 顯示 Authentication Succeeded | 關掉分頁，回終端機看，push 已完成 |

</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>只會做一次：</b> 憑證存進 <b>Windows 認證管理員</b> / <b>macOS 鑰匙圈</b>，之後 push、pull、clone 都不再詢問。
</div>

<!--
我們看第一次 push 時會發生什麼事。
執行 `git push` 之後，會跳出一個 GCM 的視窗，按下 Sign in with your browser。
瀏覽器會打開 GitHub 的登入頁，已經登入的話就直接下一步。
接著出現授權頁，按 Authorize。
看到 Authentication Succeeded，就可以關掉分頁，回到終端機，push 已經完成了。
整個過程大概十秒，而且只需要做一次。
憑證會存在 Windows 的認證管理員，或是 macOS 的鑰匙圈。
之後 push、pull、clone 都不會再問。
【講師】想登出或換帳號，可以示範到 Windows 認證管理員搜尋 git，刪掉 github.com 那一筆。
-->

---

# 方式 ②：什麼時候才需要 Personal Access Token

<div class="grid grid-cols-2 gap-6 mt-2 text-sm">
<div>

**需要自己產 Token 的情況**

- 遠端 Linux 主機、Docker 容器（開不了瀏覽器）
- CI/CD 腳本、自動化流程
- 公司環境沒有裝 GCM
- 要用 GitHub API 存取資料

</div>
<div>

**產生方式**

```text
頭像 → Settings
→ Developer settings
→ Personal access tokens
→ Tokens (classic)
→ Generate new token
→ 勾 repo → Generate
```

</div>
</div>

此時 Git 會用文字提示要帳密，**密碼欄貼 Token**（不是登入密碼）：

```bash
Username: your-github-id
Password: ghp_xxxxxxxxxxxxxxxxxxxx   # ← 貼 Token
```

<div class="mt-3 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ Token 只顯示一次，關掉頁面就看不到；GitHub 自 2021 年起已不接受用登入密碼做 git 操作。
</div>

<!--
那什麼時候才需要自己產生 Personal Access Token？
主要是開不了瀏覽器的環境。
例如遠端的 Linux 主機、Docker 容器，或是自動化的 CI/CD 腳本。
產生的方式在 Settings 的 Developer settings 裡面，勾選 repo 權限之後產生。
使用的時候，Git 會用文字要求輸入帳號密碼，密碼欄要貼的是 Token，不是登入密碼。
要特別注意，Token 只會顯示一次，關掉頁面就看不到了。
而且 Token 等同於我們的密碼，千萬不要不小心 commit 進程式碼裡。
這頁先知道有這個東西就好，真的遇到再回來看。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## Push 上傳到 GitHub

<!--
帳號和驗證都搞定了。接下來學最核心的操作：把本機的 repo 推上 GitHub。
-->

---

# 在 GitHub 建立新 Repository

到 GitHub 網頁右上角的 **+** → **New repository**，填寫以下資訊：

| 欄位 | 說明 |
| --- | --- |
| Repository name | repo 名稱，例如 `my-project` |
| Public / Private | 公開（誰都能看）或私人（只有你和受邀者能看） |
| Initialize this repository with a README | **不要勾選** |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>重點：</b> 如果本機已經有 <code>git init</code> 過的專案，Initialize 系列選項（README / .gitignore / license）全部不要勾，勾了會讓遠端多出一個本機沒有的 commit，等一下 push 會失敗。
</div>

<!--
在 GitHub 右上角按加號，選 New repository。
填一個 repo 名稱，再選擇公開或私人。
這裡有一個很多人會被坑的地方，就是 Initialize 開頭的那幾個勾選框。
GitHub 會問要不要順便建立 README。
但如果本機已經有內容，勾了之後，遠端就會多出一個本機沒有的 commit。
兩邊的歷史對不起來，等一下第一次 push 就會被拒絕。
所以記住，本機已經有內容的話，遠端就建一個全空的 repo，什麼都不要勾。
-->

---

# 把本機專案 Push 上去

Repo 建好後，GitHub 會顯示一段指令，把它貼到本機專案的終端機裡執行：

```bash
# 如果本機專案還沒有 git（沒做過 git init）
git init
git add .
git commit -m "Initial commit"

# 關聯剛剛建立的遠端 repo，並推送
git remote add origin https://github.com/username/repo-name.git
git branch -M main
git push -u origin main
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>第一次會跳出登入視窗：</b> 按「Sign in with your browser」→ 在瀏覽器按 Authorize 即可；若是沒有瀏覽器的環境，才需要在密碼欄貼 Personal Access Token。
</div>

<!--
repo 建好之後，GitHub 頁面上會直接給我們一段指令，整段複製貼上就可以。
如果本機專案還沒用過 Git，就從 init、add、commit 開始。
如果已經 init 過了，就跳過前三行，從 `git remote add` 開始。
`git remote add` 告訴本機的 repo，遠端的位址在哪裡，並把它取名叫 origin。
`git branch -M main` 確保分支名稱叫 main。
最後 `git push -u origin main`，把 main 推上去。
第一次 push 會跳出剛才看到的瀏覽器授權。
完成後重新整理 GitHub 頁面，就能看到檔案已經在雲端上了。
-->

---

# `git remote` — 遠端設定補充

剛剛的 `git remote add` 只是其中一個用法，`git remote` 這個指令還能查看、修改、移除遠端設定。

```bash
# 查看目前已設定的遠端
git remote -v

# 新增遠端（origin 是慣用名稱，代表「主要遠端」）
git remote add origin https://github.com/username/repo-name.git

# 修改遠端 URL
git remote set-url origin https://github.com/username/repo-name.git

# 移除遠端設定
git remote remove origin
```

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">

**origin** 只是個名稱（慣例），你可以改成任何名字，但整個 Git 社群都用 origin，建議不要打破慣例。

</div>

<!--
剛才的 `git remote add` 只是其中一種用法。
`git remote -v` 可以查看目前設定了哪些遠端，v 代表顯示詳細資訊。
它會同時列出 fetch 和 push 用的網址。
如果 repo 搬家了，可以用 `set-url` 修改網址，不需要的話，用 `remove` 移除。
origin 只是一個名字，理論上可以取別的。
但整個 Git 社群都用 origin 代表主要的遠端，clone 的時候 Git 也會自動用這個名字。
所以建議不要打破這個慣例。
-->

---

# 第一次推送 `git push`

```bash
# 第一次推送，同時設定 upstream tracking
git push -u origin main

# 之後的推送（因為 upstream 已設定）
git push

# 推送指定分支
git push origin feature/login

# 推送所有分支
git push --all origin
```

<!--
這頁整理 `git push` 的常見寫法。
第一次推送時加上 `-u`，之後只要打 `git push` 就好，不用再寫 origin main。
如果要推送其他分支，就在後面寫上分支名稱，例如 feature/login。
`--all` 則會一次推送所有分支。
分支的部分，我們在後面的章節會詳細介紹。
接下來看 `-u` 到底做了什麼。
-->

---

# 第一次推送：`-u` 旗標做了什麼？

**`-u`（--set-upstream）** 幫本機分支和遠端分支建立追蹤關係：

| | 執行前 | 執行後 |
| --- | --- | --- |
| push | `git push` 不知道要推到哪 | `git push` 自動推到 `origin/main` |
| pull | `git pull` 不知道要從哪拉 | `git pull` 自動從 `origin/main` 拉 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**記住：** 第一次推送加 `-u`，之後直接 `git push` 即可。只需要設定一次。

</div>

<!--
`-u` 的作用，是幫本機分支和遠端分支建立「追蹤關係」。
想像一下，我們跟同事說：「報告都放在那個共用資料夾。」
之後大家就知道固定去那裡找，不用每次都重新說地址。
`-u` 做的就是這件事。
它讓 Git 記住，本機的 main 對應到 origin 的 main。
設定好之後，`git push` 會自動推到 origin 的 main，`git pull` 也會自動從那裡拉。
這個設定只需要做一次。
-->

---

# 身份驗證：HTTPS 方式

GitHub 支援兩種連線方式，先看我們一路在用的 HTTPS：

```bash
# Clone URL 格式
https://github.com/user/repo.git

# 驗證：GCM 瀏覽器授權（預設）
# 或 Personal Access Token（無瀏覽器時）
```

- 防火牆友善（port 443）
- 有 GCM 就自動處理，免手動設定
- 適合：新手、公司網路有限制的環境

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**本課程用的就是這種：** URL 開頭是 `https://`，驗證交給 Git Credential Manager 自動處理，對新手最省事。

</div>

<!--
GitHub 支援兩種連線方式，先看我們一路在用的 HTTPS。
它的網址是 https 開頭。
HTTPS 走的是 443 port，跟一般瀏覽網頁是同一個通道，所以公司的防火牆幾乎不會擋。
驗證的部分交給 Git Credential Manager，第一次按一下 Authorize 之後就不用再管。
對新手來說，這是最省事的方式，也是本課程使用的方式。
-->

---

# 身份驗證：SSH 方式

另一條路是 SSH，設定一次金鑰之後完全免密碼：

```bash
# Clone URL 格式
git@github.com:user/repo.git

# 設定好 SSH Key 後完全免密碼
# 使用 port 22（或 443 via ssh.github.com）
```

- 設定一次，長期免密碼
- 安全性高（非對稱加密）
- 適合：個人開發者的首選

<div style="margin-top: 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px;">

**選擇建議：** 本課程一路用的是 HTTPS，由 Git Credential Manager 自動處理驗證。等你對 Git 更熟悉，可以再改用 SSH，設定一次金鑰之後就完全免密碼。

</div>

<!--
另一種方式是 SSH，網址是 git@github.com 開頭。
它用的是一對金鑰。
我們在自己的電腦產生金鑰，把公鑰貼到 GitHub，之後就完全不用再輸入任何東西。
長期用起來很順手，安全性也高。
缺點是第一次設定的步驟比較多。
等大家對 Git 更熟悉之後，可以再考慮要不要換成 SSH。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## Pull 下載更新

<!--
推上去之後，反過來，要怎麼把別人的更新拿回來？這裡有兩個指令：fetch 和 pull。
-->

---

# `git fetch` vs `git pull`

這是很多人搞混的地方，先用圖來理解：

```
遠端（origin/main）:  A → B → C → D
本機（main）:         A → B
```

<br>

**`git fetch origin`** — 只下載，不改動工作目錄

```bash
git fetch origin
# 現在本機有 origin/main 指向 D，但 main 還在 B
# 可以用 git log origin/main 查看遠端的新 commit
git log origin/main --oneline
```

**`git pull`** = `git fetch` + `git merge`

```bash
git pull
# 等同於：git fetch origin && git merge origin/main
# 直接把 main 推進到 D，工作目錄也跟著更新
```

<!--
fetch 和 pull 很容易搞混，我們用上面的圖來看。
遠端已經走到 D，但本機的 main 還停在 B。
`git fetch` 只會把遠端的新 commit 下載下來，不會動到我們正在工作的 main。
下載之後，origin/main 會指向 D，可以用 `git log origin/main` 看看遠端多了什麼。
`git pull` 則是 fetch 加上 merge。
它下載完，會直接把 main 往前推到 D，工作目錄也跟著更新。
可以這樣想：fetch 是把信拿回來放在桌上，還沒拆；pull 是直接拆開來讀完。
在共享分支上工作時，建議先 fetch，看過有什麼更新，再決定要不要合併。
-->

---

# `git pull --rebase` — 更乾淨的歷史

如果你本機也有新 commit，pull 後歷史會產生一個「合併 commit」：

```
# 用 git pull（merge）後的歷史
      C
     ↗ ↘
A → B    E（merge commit，parent 是 C 和 D）
     ↘ ↗
      D（遠端的 commit）

# 用 git pull --rebase 後的歷史
A → B → D → C'（你的 commit 重放接在最後，歷史是線性的）
```

<!--
如果我們在本機也有新的 commit，pull 的結果會有兩種樣子。
用預設的 pull，我們的 C 和遠端的 D 會從 B 分岔出去。
Git 會自動產生一個合併用的 commit E，把兩條線接起來。
用 `git pull --rebase` 的話，Git 會先把我們的 C 暫時拿開。
把本機更新到遠端最新的 D，再把 C 重新接到 D 的後面，變成一個新的 C'。
這樣整條歷史就是一直線，沒有多出合併用的 commit。
-->

---

# `git pull --rebase` — 指令與建議

```bash
# 使用 rebase 策略拉取
git pull --rebase

# 設定為預設行為（推薦）
git config --global pull.rebase true
```

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px; margin-top: 1.5rem;">

**建議：** 個人分支使用 `--rebase` 保持線性歷史。共享分支視團隊規範而定。

</div>

<!--
指令很簡單，pull 的時候加上 `--rebase` 就好。
如果想每次都這樣做，可以用 `git config` 把 `pull.rebase` 設成 true。
它的好處是歷史很乾淨，`git log` 看起來是一直線，code review 時也更容易追蹤。
缺點是，如果 rebase 過程中遇到衝突，要先解決再繼續，對初學者來說多了一個步驟。
建議在自己的分支上用 `--rebase`。
共享的分支，就依照團隊的規範來決定。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## 【狀況題】怎麼有時候推不上去？

<!--
大家有沒有遇過，push 一直都很順，某天卻突然失敗，跳出一堆錯誤訊息？我們來看這個常見狀況。
-->

---

# 推不上去！non-fast-forward 錯誤

```bash
$ git push origin main
To github.com:username/repo.git
 ! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs to 'github.com:username/repo.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
```

<br>

**原因：** 遠端有你沒有的 commit，你的歷史已經「落後」了。

```
遠端（origin/main）:  A → B → C（別人 push 的）
你的本機（main）:      A → B → D（你自己的）
```

Git 拒絕這次 push，因為這樣會**覆蓋掉** C。

<!--
這個錯誤叫做 non-fast-forward，看起來很嚇人，其實是 Git 在保護我們。
原因是遠端有我們沒有的 commit。
看下面的圖，別人已經 push 了 C，而我們的本機是從 B 接著做了 D。
如果 Git 讓我們直接推上去，C 就會被蓋掉。
就像兩個人同時編輯一份文件，同事剛存了一版，我們直接把自己的版本蓋上去，他的修改就不見了。
所以 Git 拒絕這次 push，意思是：先把別人的東西整合進來，再推上去。
-->

---

# 解決 non-fast-forward

**正確做法：先拉取整合，再推送**

```bash
# 方法一：pull（fetch + merge），產生一個 merge commit
git pull origin main
git push origin main

# 方法二：pull --rebase（推薦），保持線性歷史
git pull --rebase origin main
git push origin main

# 如果 rebase 過程中有衝突，解完之後
git add .
git rebase --continue
git push origin main
```

<br>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px;">

**警告：** 不要對共享分支（main、develop）執行 `git push --force` 來「強制」解決這個問題！這會讓其他人的本機歷史和遠端不一致，造成更大的麻煩。

</div>

<!--
解法很直觀：先拉回來整合，再推上去。
方法一是 `git pull`，會產生一個合併用的 commit，雙方的 commit 都保留。
方法二是 `git pull --rebase`，把我們的 commit 接到遠端最新的後面，歷史比較乾淨。
如果 rebase 過程中有衝突，解決之後先 `git add`，再 `git rebase --continue`，最後 push。
初學者建議先用方法一，比較直覺。
要特別注意的是，千萬不要用 `git push --force` 來硬解。
在共享分支上強制推送，會讓其他人的歷史和遠端對不起來，造成更大的麻煩。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## 從伺服器上取得 Repository

<!--
前面是把本機的 repo 推上去。現在反過來，加入一個新專案時，怎麼把整個 repo 拿下來？
-->

---

# `git clone` — 複製遠端 Repository

```bash
# 基本用法：clone 到當前目錄（會建立 repo-name 資料夾）
git clone https://github.com/username/repo-name.git

# 指定目標目錄名稱
git clone https://github.com/username/repo-name.git my-project

# Clone 後自動進入目錄
git clone https://github.com/username/repo-name.git && cd repo-name
```

<!--
答案就是 `git clone`，這是加入一個新專案最常用的第一步。
最基本的用法，是在 `git clone` 後面接上 repo 的網址。
Git 會建立一個跟 repo 同名的資料夾，把所有東西下載進去。
如果想換一個資料夾名稱，就在網址後面再接上自己想要的名字。
最後一行是加上 cd，clone 完直接進到資料夾裡。
-->

---

# `git clone` — Clone 後 Git 自動做的事

| 動作 | 說明 |
| --- | --- |
| 下載完整歷史 | 所有 commit、分支、tag 都複製過來 |
| 設定 origin | `git remote -v` 就能看到 origin 指向來源 |
| checkout main | 自動切換到預設分支 |
| 設定 tracking | 本機 main 自動追蹤 origin/main |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

Clone 下來的是**完整歷史**，不是只有最新快照。所有 log 和 diff 都在你的電腦裡，可以離線查看。

</div>

<!--
一行 `git clone`，背後其實幫我們做了好幾件事。
它會下載完整的歷史，包括所有的 commit、分支和標籤。
自動設定好名叫 origin 的遠端，用 `git remote -v` 就看得到。
接著切換到預設分支，並讓本機的 main 追蹤 origin 的 main。
要特別注意，clone 下來的是完整歷史，不是只有最新的檔案。
所有的 log 和改動紀錄都在我們的電腦裡，離線也能查看。
-->

---

# Shallow Clone — 只取最新快照

當 Repository 的歷史非常龐大時，可以用 `--depth` 只取最近幾個 commit：

```bash
# 只取最新 1 個 commit 的快照（最常用）
git clone --depth 1 https://github.com/username/repo-name.git

# 取最近 10 個 commit
git clone --depth 10 https://github.com/username/repo-name.git

# CI/CD 環境常用（速度快，節省空間）
git clone --depth 1 --single-branch --branch main <url>
```

<!--
如果 repo 的歷史非常龐大，可以用 shallow clone，只下載最近的幾個 commit。
`--depth 1` 只拿最新的一個 commit，這是最常見的用法。
改成 10，就是最近十個 commit。
這在 CI/CD 的情境特別有用。
例如用 GitHub Actions 自動部署，每次 build 其實只需要最新的程式碼。
最後一行再加上只拿 main 這一個分支，速度更快、也更省空間。
-->

---

# Shallow Clone — 完整 vs Shallow 比較

| | 完整 Clone | Shallow Clone |
| --- | --- | --- |
| 歷史記錄 | 完整 | 只有指定深度 |
| 下載大小 | 較大 | 較小，速度快 |
| `git log` | 完整歷史 | 有限歷史 |
| 適合場景 | 開發工作 | CI/CD、單純部署 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**注意：** 如果需要執行 `git blame` 或查完整 log，要用完整 clone。Shallow clone 查不到指定深度以前的歷史。

</div>

<!--
我們比較一下完整 clone 和 shallow clone。
完整 clone 有全部的歷史，下載比較大，適合日常開發。
shallow clone 只有指定深度的歷史，下載小、速度快，適合 CI/CD 或單純部署。
要注意的是，shallow clone 查不到指定深度以前的歷史。
如果需要 `git blame` 或完整的 log，就要用完整 clone。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
## 【常見問題】Clone 跟 Pull 有什麼不一樣？

<!--
很多人會問：已經 clone 下來了，為什麼還需要 pull？我們來把這兩個指令分清楚。
-->

---

# Clone vs Pull — 適用場景完全不同

<div class="grid grid-cols-2 gap-6">
<div>

**`git clone`**

- **第一次**取得 repository
- 從無到有，建立完整的本機 repo
- 包含所有歷史、分支、設定
- 每個 repo 只用一次

```bash
# 第一次加入新專案
git clone https://github.com/company/project.git
```

</div>
<div>

**`git pull`**

- **已有**本機 repo，取得最新更新
- 只下載「差異」的部分
- 更新你的工作目錄
- 每次開始工作前都應該執行

```bash
# 每天開始工作的第一件事
git pull
```

</div>
</div>

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">

**類比：** Clone 就像搬進新辦公室（一次性），Pull 就像每天早上看最新的公告（定期執行）。

</div>

<!--
clone 和 pull 的使用時機完全不同。
`git clone` 是第一次取得 repo，從無到有建立本機的副本，一個 repo 只會做一次。
`git pull` 是已經有本機 repo 了，把別人的新更新拉回來，只下載有差異的部分。
可以想成搬進新辦公室，和每天早上看公告。
搬家只做一次，不會每天早上重新搬一次。
但每天進辦公室，都會先看看公告板有沒有新消息。
所以好習慣是，每天開始工作前先 `git pull`，確保在最新的狀態上工作。
這樣之後合併時的麻煩就會少很多。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
## 與其它開發者互動 — Pull Request

<!--
現在來到協作的核心：Pull Request。不管是開源專案還是公司開發，它都是最常用的協作工具。
-->

---

# 為什麼需要 Pull Request？

**直接 push 到 main 的問題：**
- 沒有人審查你的程式碼
- 一個人的錯誤直接影響所有人
- 無法討論、無法提問
- 不知道為什麼要做這個改動

<!--
想像一下，四個人同時在改同一個系統。
每個人都直接 push 到 main，沒有人知道別人在改什麼，也沒有人確認這樣改有沒有問題。
一個人的錯誤，會直接影響所有人。
而且事後也不知道，當初為什麼要做這個改動。
這就是直接 push 到 main 的問題。
-->

---

# Pull Request 解決了什麼？

| 功能 | 說明 |
| --- | --- |
| Code Review | 其他人可以看你的改動、留下評論 |
| 討論 | 可以在 PR 上討論設計決策 |
| CI 驗證 | 自動跑測試，確保不會 break 主幹 |
| 歷史留存 | 每個功能為什麼這樣做都有記錄 |
| 合併控制 | 只有通過審查的程式碼才能進 main |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**Pull Request 的「Pull」：** 你在請求別人把你的改動「拉」進主幹。每次程式碼進 main 之前都有人確認過，大大降低 bug 進生產環境的機率。

</div>

<!--
Pull Request 就是用來解決這些問題的，簡稱 PR。
它的意思是，請求別人把我們的改動「拉」進主幹。
在合併之前，其他人可以檢視改動、留下評論，也可以在上面討論設計的決定。
還能自動跑測試，確保不會把主幹弄壞。
合併之後，每個功能為什麼這樣做，都留下了紀錄。
最重要的是，每段程式碼進入 main 之前，都有人確認過。
這大大降低了 bug 跑到正式環境的機率。
-->

---

# Fork 工作流程

**參與開源專案或外部 Repository 的標準流程：**

```
1. Fork：在 GitHub 網頁上，按「Fork」按鈕
   → 把別人的 repo 複製一份到你自己的帳號下

2. Clone：把你自己的 fork 下載到本機
   git clone https://github.com/YOUR_USERNAME/repo.git

3. 建立功能分支（不要直接在 main 上開發）
   git checkout -b feature/my-feature

4. 開發、commit
   git add . && git commit -m "feat: add my feature"

5. 推送到你的 fork
   git push origin feature/my-feature

6. 在 GitHub 上開 Pull Request
   → 從你的 fork/feature/my-feature → 原始 repo/main
```

<!--
參與開源專案時，標準的做法是 Fork 工作流程。
第一步，在 GitHub 上按 Fork，把別人的 repo 複製一份到自己的帳號下。
這樣我們就有一份完整的副本可以自由修改，不會影響原始的 repo。
第二步，把自己的 fork clone 到電腦上。
第三步，建立一個功能分支來開發，不要直接在 main 上改。
`git checkout -b` 就是建立分支，完整用法在第十三章會講，這裡先照著做就好。
開發完 commit，推送到自己的 fork，最後在 GitHub 上開 PR，請原作者把改動合併進去。
推送之後，GitHub 通常會自動跳出提示，問要不要開 PR，非常方便。
-->

---

# Merge PR 的三種方式

在 GitHub 上 merge PR 時，有三個選項，選擇不同，歷史的呈現方式也不同：

| 方式 | 歷史呈現 | 適合場景 |
| --- | --- | --- |
| **Create merge commit** | 保留所有 commit + 加一個 merge commit | 想保留完整開發歷史 |
| **Squash and merge** | 把所有 commit 壓成一個 commit | PR 裡有很多「fix typo」等雜 commit |
| **Rebase and merge** | 把 commit 線性接到 main 上 | 想要乾淨的線性歷史 |

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">

**團隊建議：** 統一使用一種方式，寫進 `CONTRIBUTING.md`，避免風格混亂。許多團隊使用 **Squash and merge**，確保 main 上每個 commit 對應一個完整功能。

</div>

<!--
在 GitHub 上合併 PR 時，有三個選項，會影響歷史的樣子。
Create merge commit 保留所有的 commit，再加上一個合併用的 commit，歷史最完整。
Squash and merge 會把 PR 裡的所有 commit 壓成一個。
如果 PR 裡有很多修錯字之類的小 commit，用它可以讓 main 很乾淨。
Rebase and merge 則是把 commit 一個一個接到 main 上，形成一直線。
三種方式沒有絕對的對錯，重點是團隊要統一。
許多團隊選擇 Squash，讓 main 上的每個 commit 都對應一個完整的功能。
-->

---

# PR 最佳實踐

**讓你的 PR 更容易被 review：**

<div class="grid grid-cols-2 gap-6">
<div>

**Do ✅**

- 一個 PR 只做一件事
- 清楚的標題（動詞開頭）
- 描述「為什麼」，不只是「做了什麼」
- 附上相關 Issue 連結（`Fixes #123`）
- PR 大小合理（< 400 行改動）
- 先自己 review 一遍再送出

</div>
<div>

**Don't ❌**

- 一個 PR 夾帶多個不相關功能
- 標題寫「update」、「fix」等模糊文字
- 沒有描述就送出
- PR 改動超過 1000 行
- 解決衝突時用「accept all mine」
- 沒有跑過測試就推

</div>
</div>

<!--
PR 是一種溝通工具，寫好 PR 是對審查者的尊重。
左邊是建議的做法。
一個 PR 只做一件事，標題用動詞開頭，描述裡說明「為什麼」要這樣改。
在描述寫上 Fixes 加 issue 編號，PR 合併之後，對應的 issue 會自動關閉。
PR 的大小也很重要。
超過四百行的改動，審查者就很難仔細看，品質會下降。
如果功能很大，就拆成幾個 PR 分批合併。
送出之前，記得先自己檢查一遍，也確認測試都跑過了。
-->

---

# 本章重點回顧


- **Git 是工具，GitHub 是平台** — 沒有 GitHub，Git 一樣能運作
- **HTTPS 驗證預設走瀏覽器授權（GCM）**，只需按一次 Authorize；無瀏覽器環境才改用 Personal Access Token（絕不是登入密碼）
- **`git remote add origin <url>` + `git push -u origin main`** — 第一次推送要加 `-u` 建立追蹤關係
- **`git fetch` 只下載，`git pull` = fetch + merge**；想要線性歷史用 `git pull --rebase`
- **推不上去（non-fast-forward）** — 遠端有你沒有的 commit，先 pull 整合再 push，別用 `--force`
- **`git clone` 是第一次取得，`git pull` 是後續更新**
- **Pull Request 是協作核心** — 一個 PR 只做一件事，說明「為什麼」


<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** Ch 12 GitHub Desktop — 用圖形化介面完成同樣這些操作

<Link to="ch12" style="color: #d97706; font-weight: 600;">前往 Ch 12 →</Link>

</div>

<!--
我們回顧這章的重點。
Git 是工具，GitHub 是平台。
連線驗證預設走瀏覽器授權，只有沒有瀏覽器的環境，才需要 Personal Access Token。
第一次推送要用 `git remote add` 設定遠端，再加 `-u` 建立追蹤關係。
fetch 只下載，pull 是下載再合併。
推不上去時，先 pull 整合再 push，不要用 force。
clone 是第一次取得，pull 是之後的更新。
最後，Pull Request 是團隊協作的核心。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章的核心其實只有一條線。
本機和遠端是兩份各自獨立的歷史，push 和 pull 就是在同步它們。
理解這一點，就知道為什麼會推不上去，也知道為什麼要先 pull 再 push。
下一章，我們換個角度，看這些操作在 GitHub Desktop 上怎麼用滑鼠完成。我們下一章見。
【講師】開放提問，並確認每個人都已經成功 push 過一次。
-->
