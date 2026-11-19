---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: B1 Git 與 GitHub 是什麼
routeAlias: ch01
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
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 初學者課程 · B1</p>
  <h1 style="color: #92400e; font-size: 3.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">Git 與 GitHub 是什麼</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「先搞懂存檔點，再把工具裝好」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到初學者課程的第一章。
這門課不需要任何 Git 經驗，也不用背指令，我們全程用 GitHub Desktop 這個視窗程式來操作。
這一章不寫程式，只做兩件事：先搞懂 Git 在解決什麼問題，再把需要的工具裝好、設定好。
-->

---
layout: default
---

# 這一章我們會做到

- **Part 1 為什麼需要版本控制** — 沒有版本控制的世界 / 存檔點比喻
- **Part 2 Git 和 GitHub** — 兩個名字差在哪 / 三大區域
- **Part 3 準備工具** — 註冊 GitHub / 安裝 Desktop 與 VS Code / 登入與設定
- **Part 4 認識本課專案** — 自我介紹網頁

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>本章結束時：</b> 你的電腦上會有 GitHub Desktop 和 VS Code，而且已經登入自己的 GitHub 帳號。
</div>

<!--
這一章分成四個部分。
前兩個部分是觀念，我們用打電動存檔來理解 Git。
第三部分是動手，把帳號和工具一次準備好。
最後介紹一下，接下來整門課要一起完成的專案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 為什麼需要版本控制

<!--
我們先回到還沒有版本控制的時候，看看大家平常是怎麼管理檔案的。
-->

---

# 沒有版本控制的世界

<div class="grid grid-cols-2 gap-8">
<div>

**你的資料夾是不是長這樣？**

<div style="background:#1f2937; color:#f9fafb; border-radius:8px; padding:0.9rem 1.2rem; font-family: ui-monospace, Consolas, monospace; font-size:0.9rem; line-height:1.8; margin-top:0.6rem;">
📄 報告.docx<br>
📄 報告_final.docx<br>
📄 報告_final2.docx<br>
📄 報告_final_真的最終版.docx<br>
📄 報告_老闆說這版.docx
</div>

</div>
<div>

**常見的痛：**

- 不知道哪個才是最新版
- 改壞了回不去
- 兩個人同時改，互相覆蓋
- 不知道誰改了什麼、為什麼改

</div>
</div>

<!--
這個資料夾，大家看了是不是很眼熟？
最妙的是「老闆說這版」，代表版本已經亂到序號都不管用，只能靠「誰要的」來命名。
右邊這幾個痛點，每天都在發生。
版本控制要解決的，就是這些問題：幫我們記住每一個版本、誰改的、為什麼改，改壞了也能回去。
-->

---

# 用「打電動存檔」來想

<div class="grid grid-cols-2 gap-8 mt-4">
<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">

**🎮 打電動**

- 打王之前先**存檔**
- 每個存檔都有**名稱和時間**
- 打輸了就**讀檔**回去
- 存檔列表可以看到一路的進度

</div>
<div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 1.2rem;">

**📁 Git**

- 改到一個段落就做一個 **commit**
- 每個 commit 都有**說明和時間**
- 改壞了可以**回到之前的 commit**
- **History** 分頁就是存檔列表

</div>
</div>

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 「commit」就是 Git 的存檔點。這門課最常做的動作，就是做 commit。
</div>

<!--
我們用打電動來想。
打王之前，我們會先存檔；打輸了，就讀檔回到打王之前。
Git 做的事情一模一樣。
我們把專案改到一個段落，就做一個存檔點，Git 把它叫做 commit。
每個 commit 都會記下時間，還有我們寫的一句說明。
改壞了，就可以回到之前的 commit。
GitHub Desktop 裡有一個 History 分頁，它就是存檔列表，一路的進度都看得到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## Git 和 GitHub

<!--
接下來分清楚兩個很像的名字：Git 和 GitHub。
-->

---

# Git ≠ GitHub

| | **Git** | **GitHub** |
| --- | --- | --- |
| 是什麼 | 版本控制**工具** | 放 Git 專案的**網站** |
| 在哪裡 | 你的電腦裡 | 雲端 |
| 打電動比喻 | 主機裡的**存檔系統** | **雲端存檔**，換台主機也能接著玩 |
| 解決什麼 | 記錄每一個版本 | 備份、分享、跟別人一起做 |

<br>

**GitHub Desktop** 則是 GitHub 官方出的視窗程式：用滑鼠點一點就能操作 Git，再把結果送上 GitHub。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 沒有網路也能用 Git 存檔；要備份或跟別人協作時，才需要 GitHub。
</div>

<!--
很多人以為 Git 和 GitHub 是同一個東西，其實不是。
Git 是裝在我們電腦裡的版本控制工具，就像遊戲主機裡的存檔系統。
GitHub 是一個網站，讓我們把 Git 的存檔放到雲端，就像雲端存檔，換台電腦也能接著做。
放到雲端之後，還能分享給別人，一起做同一個專案。
GitHub Desktop 則是 GitHub 官方出的視窗程式，讓我們不用打指令，用滑鼠就能操作 Git。
要記住：沒有網路也能 commit；要備份或協作，才需要 GitHub。
-->

---

# Git 的三大區域

<div style="border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem 1.5rem; margin-top: 0.5rem; background: #fff8f0;">
  <div style="text-align:center; font-size:0.8rem; color:#92400e; font-weight:600; margin-bottom:1rem;">全部都在你的電腦裡</div>
  <div style="display:flex; align-items:center; justify-content:center;">
    <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:150px; text-align:center;">
      <div style="font-weight:700; color:#92400e;">工作目錄</div>
      <div style="font-size:0.8rem; color:#b45309;">Working Directory</div>
      <div style="font-size:0.8rem; color:#78350f; margin-top:0.3rem;">🏠 房間裡散落的東西</div>
    </div>
    <div style="margin:0 0.8rem; text-align:center; color:#d97706;">
      <div style="font-size:0.75rem;">挑出來裝箱</div>
      <div style="font-size:1.4rem;">→</div>
    </div>
    <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:150px; text-align:center;">
      <div style="font-weight:700; color:#92400e;">暫存區</div>
      <div style="font-size:0.8rem; color:#b45309;">Staging Area</div>
      <div style="font-size:0.8rem; color:#78350f; margin-top:0.3rem;">📦 打包好的紙箱</div>
    </div>
    <div style="margin:0 0.8rem; text-align:center; color:#d97706;">
      <div style="font-size:0.75rem;">封箱存檔</div>
      <div style="font-size:1.4rem;">→</div>
    </div>
    <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:150px; text-align:center;">
      <div style="font-weight:700; color:#92400e;">儲存庫</div>
      <div style="font-size:0.8rem; color:#b45309;">Repository</div>
      <div style="font-size:0.8rem; color:#78350f; margin-top:0.3rem;">🏬 倉庫裡的存檔</div>
    </div>
  </div>
</div>

<!--
接下來是整門課最重要的觀念：Git 的三大區域。
我們用搬家來想像。
工作目錄是我們的房間，東西散落各處，也就是我們正在編輯的檔案。
暫存區是打包好的紙箱，只有我們刻意挑出來放進去的東西，才會在裡面。
儲存庫是倉庫，紙箱封好搬進去，就變成一個存檔點，也就是 commit。
要特別記住，這三個區域全部都在我們自己的電腦裡，不需要網路。
-->

---

# 三大區域在 GitHub Desktop 長什麼樣子？

| 區域 | 你在 Desktop 看到的 | 你做的動作 |
| --- | --- | --- |
| 🏠 工作目錄 | 改過的檔案出現在 **Changes** 分頁 | 用 VS Code 編輯檔案 |
| 📦 暫存區 | 檔案前面的**核取方塊打勾** | 勾選這次要存檔的檔案 |
| 🏬 儲存庫 | 按下 **Commit** 後出現在 **History** 分頁 | 寫一句說明，按 Commit |

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 打勾 → Commit，就是「裝箱 → 封箱存檔」。下一章我們會親手做一次。
</div>

<!--
三大區域在 GitHub Desktop 裡，其實都看得到。
我們用 VS Code 改了檔案，它就會出現在 Changes 分頁，這是工作目錄。
檔案前面有一個核取方塊，打勾就是把它放進紙箱，也就是暫存區。
最後寫一句說明、按下 Commit，這個存檔點就會出現在 History 分頁，這是儲存庫。
這張表大家先有個印象就好，下一章會實際操作一次，到時候再回頭看會更清楚。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## 準備工具

<!--
觀念講完了，接下來把工具準備好。
-->

---

# 我們需要準備三樣東西

<div class="grid grid-cols-3 gap-6 mt-6">

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🐙</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">GitHub 帳號</div>
  <div style="font-size: 0.9rem; color: #78350f;">雲端存檔的地方，也是協作的地方</div>
</div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🖥️</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">GitHub Desktop</div>
  <div style="font-size: 0.9rem; color: #78350f;">用滑鼠操作 Git：commit、push、分支</div>
</div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📝</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">VS Code</div>
  <div style="font-size: 0.9rem; color: #78350f;">編輯網頁檔案，也用來解衝突</div>
</div>

</div>

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議順序：</b> 先註冊 GitHub → 再裝 VS Code → 最後裝 GitHub Desktop。Desktop 啟動時才找得到 VS Code。
</div>

<!--
我們需要準備三樣東西。
GitHub 帳號，是雲端存檔和協作的地方。
GitHub Desktop，讓我們用滑鼠操作 Git。
VS Code 是編輯器，用來改網頁檔案，第五章解衝突的時候也會用到它。
安裝順序建議先註冊 GitHub，再裝 VS Code，最後裝 Desktop。
因為 Desktop 啟動時會去找電腦裡有哪些編輯器，VS Code 先裝好，等一下設定會比較順。
-->

---

# 註冊 GitHub 帳號

| # | 操作 |
| --- | --- |
| 1 | 前往 [github.com](https://github.com)，點右上角 **Sign up** |
| 2 | 輸入 Email、密碼、**使用者名稱（username）** |
| 3 | 完成真人驗證，到信箱收驗證碼並輸入 |
| 4 | 方案選 **Free** 就夠用 |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> username 會出現在網址上（github.com/<b>你的名字</b>），之後也可能放進履歷。建議用英文小寫、好記、看起來專業的名字。
</div>

<!--
第一步，註冊 GitHub 帳號。
到 github.com，點右上角的 Sign up，依序輸入 Email、密碼和使用者名稱。
完成真人驗證之後，到信箱收驗證碼輸入，方案選免費的就夠用了。
這裡要特別提醒 username。
它會直接出現在網址上，以後找工作也可能放進履歷，讓面試官看我們的作品。
所以建議用英文小寫、好記、看起來專業的名字，不要用太隨便的暱稱。
【講師】已經有帳號的同學，直接登入確認密碼還記得即可。
-->

---

# 安裝 VS Code 與 GitHub Desktop

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

**VS Code**

1. 前往 [code.visualstudio.com](https://code.visualstudio.com)
2. 點 **Download**，執行安裝檔
3. 選項全部用預設值

**GitHub Desktop**

1. 前往 [desktop.github.com](https://desktop.github.com)
2. 點 **Download for Windows / macOS**
3. 執行安裝檔，裝完會自動開啟

</div>
<div>

<Shot file="b01-01-desktop-download.png" desc="desktop.github.com 下載頁" />

</div>
</div>

<!--
接下來裝兩個程式。
VS Code 到官網點 Download，執行安裝檔，選項全部用預設值就好。
GitHub Desktop 到 desktop.github.com，網站會自動偵測我們的作業系統，直接顯示對應的下載按鈕。
執行安裝檔之後，不需要設定任何東西，裝完它會自己打開。
系統需求是 Windows 10 64 位元或 macOS 12 以上，公司配的舊電腦記得先確認。
-->

---

# 第一次打開 Desktop：登入 GitHub

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 歡迎畫面點 **Sign in to GitHub.com** |
| 2 | 瀏覽器自動打開，登入 GitHub |
| 3 | 點 **Authorize desktop** 授權 |
| 4 | 瀏覽器詢問時，選擇開啟 GitHub Desktop |

</div>
<div>

<div style="border:1px solid #e2e8f0; border-radius:10px; padding:1rem 1.2rem; background:#f8fafc;">
<div style="font-weight:700; color:#334155; margin-bottom:.6rem;">🖥️ 畫面上會看到</div>
<div style="margin:.35rem 0; color:#475569;">① Desktop 視窗中間寫著 <b>Welcome to GitHub Desktop</b></div>
<div style="margin:.35rem 0; color:#475569;">② 下面一顆藍色按鈕 <b>Sign in to GitHub.com</b> ← 點這個</div>
<div style="margin:.35rem 0; color:#475569;">③ 另一個選項是 GitHub Enterprise，<b>不用理它</b></div>
<div style="margin:.35rem 0; color:#475569;">④ 點完後 Desktop 會顯示等待中，畫面切到瀏覽器</div>
<div style="margin:.35rem 0; color:#475569;">⑤ 瀏覽器跳出「要開啟 GitHub Desktop 嗎？」→ 按<b>開啟</b></div>
</div>

</div>
</div>

<!--
第一次打開 GitHub Desktop，會看到歡迎畫面。
點 Sign in to GitHub.com，瀏覽器會自動打開 GitHub 的登入頁。
登入之後，按下 Authorize desktop，代表我們同意 Desktop 用這個帳號幫我們操作。
最後瀏覽器會問要不要開啟 GitHub Desktop，按允許，就會跳回 Desktop。
整個過程不用在 Desktop 裡輸入密碼，開了兩步驟驗證也沒關係。
-->

---

# 授權畫面長這樣

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

- 確認畫面上的帳號是**你自己的**
- 按 **Authorize desktop**
- 回到 Desktop 後，會接著問 Git 的名字和 Email（下一頁）

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提醒：</b> 用公用電腦上課的話，先確認瀏覽器裡登入的不是上一位同學的帳號。
</div>

</div>
<div>

<div style="border:1px solid #e2e8f0; border-radius:10px; padding:1rem 1.2rem; background:#f8fafc;">
<div style="font-weight:700; color:#334155; margin-bottom:.6rem;">🖥️ 授權頁上會看到</div>
<div style="margin:.35rem 0; color:#475569;">① 標題 <b>Authorize GitHub Desktop</b></div>
<div style="margin:.35rem 0; color:#475569;">② 右上角的頭像與帳號名稱 ← <b>先確認是自己</b></div>
<div style="margin:.35rem 0; color:#475569;">③ 中間列出 Desktop 會取得的權限（讀寫 repo 等）</div>
<div style="margin:.35rem 0; color:#475569;">④ 最下面綠色按鈕 <b>Authorize desktop</b> ← 點這個</div>
<div style="margin:.35rem 0; color:#475569;">⑤ 帳號不對：右上角頭像 → <b>Sign out</b>，再登入自己的</div>
</div>

</div>
</div>

<!--
這是授權畫面。
按下去之前，先看一下畫面上顯示的帳號，是不是我們自己的。
如果是用電腦教室的公用電腦，瀏覽器可能還登入著上一位同學的帳號，要先登出再登入自己的。
授權完回到 Desktop，它會接著問 Git 要用的名字和 Email，我們下一頁看。
-->

---

# 設定 Git 身份：名字與 Email

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

每個 commit 都會記下**是誰存的檔**。

| 平台 | 位置 |
| --- | --- |
| Windows | File → **Options** → **Git** |
| macOS | GitHub Desktop → **Settings** → **Git** |

- **Name**：你的名字（中英文都可以）
- **Email**：選 GitHub 帳號綁定的 Email
- **Default branch** 分頁：維持 `main`

</div>
<div>

<Shot file="b01-04-options-git.png" desc="Options → Git 身份設定" />

<CliBox :cmds="['git config --global user.name &quot;王小明&quot;', 'git config --global user.email &quot;you@example.com&quot;']" />

</div>
</div>

<!--
每一個 commit 都會記下是誰存的檔，所以要先告訴 Git 我們是誰。
第一次登入時，Desktop 通常會自動帶入 GitHub 帳號的名字和 Email。
想確認或修改，Windows 在 File 底下的 Options，macOS 在 GitHub Desktop 底下的 Settings，找 Git 分頁。
Email 要選 GitHub 帳號綁定的那一個，不然 GitHub 不會把 commit 算到我們頭上。
右下角的黑框是 CLI 對照，也就是用指令做同一件事的寫法。
這門課只要認得就好，不需要會打。
-->

---

# 設定外部編輯器：VS Code

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 打開 **Options**（macOS：**Settings**） |
| 2 | 切到 **Integrations** 分頁 |
| 3 | **External editor** 選 **Visual Studio Code** |
| 4 | 按 **Save** |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>選單裡沒有 VS Code？</b> 代表 VS Code 比 Desktop 晚裝，把 Desktop 完全關掉再開一次。
</div>

</div>
<div>

<Shot file="b01-05-options-integrations.png" desc="Options → Integrations 設定 VS Code" />

</div>
</div>

<!--
最後一個設定，是告訴 Desktop 要用哪個編輯器開檔案。
同樣打開 Options，這次切到 Integrations 分頁，External editor 選 Visual Studio Code，按 Save。
為什麼一定要設定這個？
因為 Desktop 自己不能改檔案內容，之後要改網頁、要解衝突，都會從 Desktop 一鍵跳到 VS Code。
如果下拉選單裡找不到 VS Code，通常是 VS Code 比 Desktop 晚裝。
把 Desktop 完全關掉再打開，它就會重新偵測到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## 認識本課專案

<!--
工具都準備好了。最後來看，這門課要一起完成什麼。
-->

---

# 一個專案貫穿全課：自我介紹網頁

我們會做一個 `my-profile` 專案，每一章往前推一步：

| 章 | 專案進度 | 學到的動作 |
| --- | --- | --- |
| B2 | 建立 `index.html`，寫上名字和興趣 | 建立 repository、commit |
| B3 | 把網頁放上 GitHub，在另一個資料夾抓回來 | Publish、Push、Pull、Clone |
| B4 | 在分支上新增「我的技能」區塊 | 開分支、合併 |
| B5 | 兩邊都改了標題，發生衝突 | 用 VS Code 解衝突 |
| B6 | 請隊友幫你加一段推薦語 | Pull Request |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>每章最後都有「檢查點」：</b> 打開 Desktop 的 History 分頁，跟投影片上的圖比對，一樣就代表你跟上了。
</div>

<!--
這門課從頭到尾只做一個專案，叫 my-profile，是一個自我介紹網頁。
第二章，我們建立網頁檔案，寫上名字和興趣，做出第一個存檔點。
第三章，把它放上 GitHub。
第四章，學開分支，在分支上加一個「我的技能」區塊。
第五章，故意讓兩邊都改到標題，練習解衝突。
第六章，請隊友幫我們加一段推薦語，學 Pull Request。
每一章最後都有檢查點，打開 History 分頁跟投影片比對，一樣就代表我們跟上了。
-->

---

# 檢查點 B1 ✅

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

**請確認以下三件事都完成了：**

1. ☐ Desktop 已登入 GitHub 帳號（Options → **Accounts** 看得到你的頭像）
2. ☐ Options → **Git** 的 Name / Email 正確
3. ☐ Options → **Integrations** 的編輯器是 Visual Studio Code

</div>
<div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">

**還沒有 History 可以看**

我們還沒建立任何專案，所以這章只檢查設定。

下一章做完，你的 History 分頁就會出現第一批存檔點。

</div>

</div>
</div>

<!--
我們來做第一個檢查點。
這一章還沒建立專案，所以只檢查三個設定。
第一，Desktop 的 Accounts 分頁看得到自己的頭像，代表登入成功。
第二，Git 分頁的名字和 Email 正確。
第三，Integrations 分頁的編輯器是 Visual Studio Code。
三個都打勾，下一章就能順利開始。
【講師】巡視確認每位同學三項都完成，特別注意 Email 有沒有選錯。
-->

---
layout: default
---

# 本章重點回顧

- **commit 就是存檔點**，History 分頁就是存檔列表
- **Git 在你電腦裡，GitHub 在雲端**；沒網路也能 commit
- **三大區域**：工作目錄（Changes）→ 暫存區（打勾）→ 儲存庫（History）
- **Git 身份**要設定好，Email 選 GitHub 綁定的那一個
- **外部編輯器設成 VS Code**，之後改檔案和解衝突都靠它

<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** B2 本機存檔 — 建立專案、做出第一個 commit

<Link to="ch02" style="color: #d97706; font-weight: 600;">前往 B2 →</Link>

</div>

<!--
我們回顧這一章的重點。
commit 就是存檔點，History 分頁就是存檔列表。
Git 在我們的電腦裡，GitHub 在雲端，沒有網路也能 commit。
三大區域對應到 Desktop，就是 Changes、打勾、History。
最後，Git 身份和外部編輯器都設定好了。
下一章，我們就要建立自我介紹網頁，做出第一個存檔點。
-->
