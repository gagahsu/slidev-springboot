---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: Git 版本控制簡介
routeAlias: ch09
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
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 版本控制課程</p>
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">Git 版本控制簡介</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「讓每一次改變都可追蹤、可回溯、可協作」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到 Git 版本控制課程的第九章。
很多人開始學 Git，是因為前輩丟下一句「去裝個 Git」，卻沒人解釋為什麼。
這章我們先把觀念打穩：Git 是什麼、為什麼要用它。
搞清楚「為什麼需要」，後面學指令就會快很多。
學完這章，我們會把 Git 裝好、設定好，也知道遇到問題去哪裡查。
-->

---
layout: default
---

# Outline

- **版本控制概念** — 為什麼需要版本控制？VCS 的演進歷史
- **Git 是什麼** — 分散式架構、核心設計哲學
- **Git 三大區域** — Working Directory / Staging Area / Repository
- **安裝 Git** — Windows / macOS / Linux 安裝方式
- **初始設定** — `git config` 使用者資訊、編輯器、換行符號
- **取得說明** — `git help`、man page


<!--
這章有六個主題，前三個講觀念，後三個動手做。
觀念的部分，我們從版本控制的由來，一路講到 Git 的三大區域。
實作的部分，則是安裝、初始設定，還有怎麼查說明文件。
第一次學 Git，最重要的不是背指令，而是理解 Git 的思考方式。
指令忘了可以查，觀念通了，進階功能都會輕鬆很多。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 版本控制概念

<!--
我們先回到還沒有版本控制工具的時候，看看大家是怎麼管理檔案的。
-->

---

# 沒有版本控制時的世界

<div class="grid grid-cols-2 gap-8">
<div>

**你的專案資料夾長這樣：**

```
report_final.docx
report_final2.docx
report_final_v3.docx
report_final_v3_真的最終版.docx
report_final_v3_真的最終版2.docx
report_老闆說這版.docx
```

</div>
<div>

**常見痛點：**


- 不知道哪個才是最新版
- 改壞了卻回不去
- 多人協作互相覆蓋
- 無法知道誰改了什麼
- 合併修改困難耗時


</div>
</div>

<!--
這個資料夾，大家看了是不是很眼熟？幾乎每個人都走過這一段。
最妙的是「老闆說這版」。
它代表版本已經亂到序號都不管用，只能靠「誰要的」來命名。
右邊列的痛點，每天都在發生。
不知道哪個是最新版，改壞了回不去，兩個人同時改還會互相覆蓋。
版本控制要解決的，就是這些問題。
它幫我們記住誰改了什麼、什麼時候改的，改壞了也能還原。
-->

---

# 版本控制系統（VCS）演進

| 世代 | 代表工具 | 架構 | 特點 |
| --- | --- | --- | --- |
| 本地端 VCS | RCS、SCCS | 單機 | 僅記錄 diff，無法協作 |
| 集中式 VCS | CVS、SVN | Client-Server | 單一伺服器，斷線無法提交 |
| 分散式 VCS | **Git**、Mercurial | Peer-to-Peer | 每人都有完整歷史，可離線工作 |


<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**Git** 由 Linus Torvalds 於 2005 年為管理 Linux 核心原始碼而開發，目標是速度、簡單設計、非線性開發（數千個並行分支）的完整支援。

</div>


<!--
版本控制系統一共走過三個世代。
最早是本地端的版本控制，只能一個人在自己的電腦上用。
接著是集中式，像 SVN，所有人都連到同一台中央伺服器。
問題是伺服器一掛，大家就都沒辦法提交了。
Git 屬於第三代，也就是分散式架構。
每個人的電腦上都有一份完整歷史，離線也能照常工作。
Git 是 Linus Torvalds 在 2005 年為了管理 Linux 核心而寫的。
Linux 社群很大，需要同時跑幾千條開發線，這也是 Git 處理分支特別強的原因。
-->

---

# 為什麼選擇 Git？

<div class="grid grid-cols-3 gap-6" style="margin-top: 1rem;">

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🚀</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">速度極快</div>
  <div style="font-size: 0.9rem; color: #78350f;">大多數操作在本機執行，幾乎不需要網路</div>
</div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🔒</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">資料完整性</div>
  <div style="font-size: 0.9rem; color: #78350f;">每個物件以 SHA-1 雜湊值識別，無法竄改歷史</div>
</div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🌿</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">強大分支</div>
  <div style="font-size: 0.9rem; color: #78350f;">建立 / 切換分支極輕量，支援非線性開發流程</div>
</div>

</div>


<div class="grid grid-cols-3 gap-6" style="margin-top: 1rem;">

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">📦</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">離線工作</div>
  <div style="font-size: 0.9rem; color: #78350f;">完整歷史在本機，隨時 commit，上線後再同步</div>
</div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🌐</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">開源生態</div>
  <div style="font-size: 0.9rem; color: #78350f;">GitHub / GitLab / Bitbucket 皆以 Git 為核心</div>
</div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">👥</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">業界標準</div>
  <div style="font-size: 0.9rem; color: #78350f;">超過 90% 的軟體開發團隊使用 Git 管理程式碼</div>
</div>

</div>


<!--
這裡列了 Git 的六個優點，我們挑兩個重點講。
第一個是「業界標準」。
現在不管去哪家公司，版本控制幾乎都是用 Git，GitHub 和 GitLab 也都建立在 Git 上。
學 Git，其實就是在學現代開發的共同語言。
第二個是「資料完整性」。
Git 用 SHA-1 雜湊值來識別每一個物件。
只要內容被改動一個位元，雜湊值就對不上，所以歷史紀錄幾乎沒辦法偽造。
其他像速度快、可以離線工作，都是分散式架構帶來的好處。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# Git 三大區域

<!--
接下來是整章最核心的觀念：Git 的三大區域。很多人學 Git 卡關，就是卡在這裡。
-->

---

# Git 三大工作區域

<div style="border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem 1.5rem; margin-top: 0.5rem; background: #fff8f0;">
  <div style="text-align:center; font-size:0.8rem; color:#92400e; font-weight:600; margin-bottom:1rem;">你的電腦</div>
  <div style="display:flex; align-items:center; justify-content:center; gap:0;">

  <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:130px; text-align:center;">
    <div style="font-weight:700; color:#92400e;">Working Directory</div>
    <div style="font-size:0.8rem; color:#b45309;">工作目錄</div>
  </div>

  <div style="display:flex; flex-direction:column; align-items:center; margin:0 0.6rem;">
    <div style="display:flex; align-items:center; gap:0.3rem; margin-bottom:0.3rem;">
      <div style="font-size:0.72rem; color:#d97706; font-family:monospace;">git add</div>
      <div style="color:#d97706; font-size:1.2rem;">→</div>
    </div>
    <div style="display:flex; align-items:center; gap:0.3rem;">
      <div style="color:#d97706; font-size:1.2rem;">←</div>
      <div style="font-size:0.72rem; color:#d97706; font-family:monospace;">git restore</div>
    </div>
  </div>

  <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:130px; text-align:center;">
    <div style="font-weight:700; color:#92400e;">Staging Area</div>
    <div style="font-size:0.8rem; color:#b45309;">Index / 暫存區</div>
  </div>

  <div style="display:flex; flex-direction:column; align-items:center; margin:0 0.6rem;">
    <div style="display:flex; align-items:center; gap:0.3rem;">
      <div style="font-size:0.72rem; color:#d97706; font-family:monospace;">git commit</div>
      <div style="color:#d97706; font-size:1.2rem;">→</div>
    </div>
  </div>

  <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:130px; text-align:center;">
    <div style="font-weight:700; color:#92400e;">Repository</div>
    <div style="font-size:0.8rem; color:#b45309;">.git 目錄</div>
  </div>

  </div>
</div>

<!--
我們用搬家來想像這三個區域。
Working Directory 是我們現在住的房間，東西散落各處，也就是我們正在編輯的檔案。
Staging Area 是打包好的紙箱，只有刻意放進去的東西才會在裡面。
Repository 則是新家的倉庫，是最後存放的地方。
從房間放進紙箱，就是 `git add`；把紙箱搬進倉庫，就是 `git commit`。
反過來，`git restore` 可以把紙箱裡的東西拿回房間。
要特別記住，這三個區域全部都在我們自己的電腦上，不需要網路。
-->

---

# 三大區域詳解

| 區域 | 別名 | 說明 | 狀態關鍵字 |
| --- | --- | --- | --- |
| Working Directory | 工作目錄 | 你實際編輯檔案的地方 | `modified`、`untracked` |
| Staging Area | Index / 暫存區 | 準備納入下次 commit 的快照 | `staged` |
| Repository | .git 目錄 | 所有歷史 commit 的永久儲存 | `committed` |


<div style="border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem 1.5rem; margin-top: 0.5rem; background: #fff8f0;">

  <div style="display:flex; align-items:center; justify-content:center; gap:0; margin-bottom:0.8rem;">
    <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:130px; text-align:center;">
      <div style="font-weight:700; color:#92400e;">Untracked</div>
      <div style="font-size:0.8rem; color:#b45309;">未追蹤</div>
    </div>
    <div style="display:flex; flex-direction:column; align-items:center; margin:0 0.6rem;">
      <div style="display:flex; align-items:center; gap:0.3rem;">
        <div style="font-size:0.72rem; color:#d97706; font-family:monospace;">git add</div>
        <div style="color:#d97706; font-size:1.2rem;">→</div>
      </div>
    </div>
    <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:130px; text-align:center;">
      <div style="font-weight:700; color:#92400e;">Staged</div>
      <div style="font-size:0.8rem; color:#b45309;">Index / 暫存區</div>
    </div>
    <div style="display:flex; flex-direction:column; align-items:center; margin:0 0.6rem;">
      <div style="display:flex; align-items:center; gap:0.3rem;">
        <div style="font-size:0.72rem; color:#d97706; font-family:monospace;">git commit</div>
        <div style="color:#d97706; font-size:1.2rem;">→</div>
      </div>
    </div>
    <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:130px; text-align:center;">
      <div style="font-weight:700; color:#92400e;">Committed</div>
      <div style="font-size:0.8rem; color:#b45309;">.git 目錄</div>
    </div>
  </div>

  <div style="display:flex; align-items:center; justify-content:center; gap:0;">
    <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:130px; text-align:center;">
      <div style="font-weight:700; color:#92400e;">Committed</div>
      <div style="font-size:0.8rem; color:#b45309;">.git 目錄</div>
    </div>
    <div style="display:flex; flex-direction:column; align-items:center; margin:0 0.6rem;">
      <div style="display:flex; align-items:center; gap:0.3rem;">
        <div style="font-size:0.72rem; color:#d97706; font-family:monospace;">修改檔案</div>
        <div style="color:#d97706; font-size:1.2rem;">→</div>
      </div>
    </div>
    <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:130px; text-align:center;">
      <div style="font-weight:700; color:#92400e;">Modified</div>
      <div style="font-size:0.8rem; color:#b45309;">已修改</div>
    </div>
    <div style="display:flex; flex-direction:column; align-items:center; margin:0 0.6rem;">
      <div style="display:flex; align-items:center; gap:0.3rem;">
        <div style="font-size:0.72rem; color:#d97706; font-family:monospace;">git add</div>
        <div style="color:#d97706; font-size:1.2rem;">→</div>
      </div>
    </div>
    <div style="border: 2px solid #d97706; border-radius:8px; padding:0.8rem 1rem; background:#ffffff; min-width:130px; text-align:center;">
      <div style="font-weight:700; color:#92400e;">Staged</div>
      <div style="font-size:0.8rem; color:#b45309;">Index / 暫存區</div>
    </div>
  </div>

</div>


<!--
這張表把三個區域對應到 `git status` 會看到的狀態，建議先記下來。
看到 modified 或 untracked，代表檔案在工作目錄，還沒 add。
看到 staged，代表已經放進暫存區，等著 commit。
committed 則代表已經安全存進 .git 的歷史裡。
下面的流程圖要注意那個循環。
commit 之後如果又改了檔案，它會變回 modified，要再走一次 add 和 commit。
這是很多新手容易忽略的地方，以為 commit 過一次就會自動追蹤後面的修改。
這些狀態，下一章實際操作時就會親眼看到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 安裝 Git

<!--
觀念有了，接下來做第一件實際的事：把 Git 安裝起來。
-->

---

# 各平台安裝方式 — Windows / macOS

<div class="grid grid-cols-2 gap-8" style="margin-top: 1rem;">

<div style="background: #f0f9ff; border: 2px solid #0284c7; border-radius: 12px; padding: 1.4rem;">
  <div style="font-weight: 700; color: #0c4a6e; font-size: 1.1rem; margin-bottom: 0.8rem;">🪟 Windows</div>

```powershell
# 方法一：官方安裝包
# https://git-scm.com/download/win

# 方法二：winget（推薦）
winget install Git.Git

# 方法三：Chocolatey
choco install git
```

<div style="margin-top: 0.8rem; font-size: 0.85rem; color: #1e40af;">
💡 官方包附帶 <strong>Git Bash</strong>，後續課程會用到
</div>
</div>

<div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 1.4rem;">
  <div style="font-weight: 700; color: #14532d; font-size: 1.1rem; margin-bottom: 0.8rem;">🍎 macOS</div>

```bash
# 方法一：Homebrew（推薦）
brew install git

# 方法二：Xcode Command Line Tools
xcode-select --install

# 方法三：官方 pkg
# https://git-scm.com/download/mac
```

<div style="margin-top: 0.8rem; font-size: 0.85rem; color: #166534;">
💡 Homebrew 也管其他開發工具，值得一次裝好
</div>
</div>

</div>

<!--
Windows 推薦用 winget 安裝，或是直接下載官方安裝包。
官方安裝包會順便裝好 Git Bash，後面的課程很常用到它。
macOS 推薦用 Homebrew，一行 `brew install git` 就完成了。
Homebrew 之後也能拿來管理其他開發工具，一次裝好很划算。
不想裝 Homebrew 的話，用 Xcode Command Line Tools 也可以。
不管用哪一種方式，裝完都記得重新開一個終端機視窗，讓環境變數生效。
【講師】可以先調查一下大家的作業系統，Windows 的同學比較多時，現場示範 winget 安裝。
-->

---

# 各平台安裝方式 — Linux

<div style="max-width: 600px; margin: 1.5rem auto 0;">
<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.6rem;">
  <div style="font-weight: 700; color: #92400e; font-size: 1.1rem; margin-bottom: 1rem;">🐧 Linux</div>

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install git

# Fedora / RHEL
sudo dnf install git

# Arch Linux
sudo pacman -S git
```

</div>
</div>

<div style="margin-top: 1.5rem; padding: 0.9rem 1.2rem; background: #fefce8; border-left: 4px solid #ca8a04; border-radius: 4px; max-width: 600px; margin-left: auto; margin-right: auto;">

根據你的發行版選對應的套件管理器即可。安裝完後開新終端機讓環境變數生效。

</div>

<!--
Linux 的安裝最單純，依照自己的發行版，選對應的套件管理器就好。
Ubuntu 用 apt，Fedora 用 dnf，Arch 用 pacman。
通常發行版內建的版本就已經夠新了。
一樣，裝完記得開新的終端機視窗。
-->

---

# 確認安裝成功

安裝完成後，開啟終端機驗證：

```bash
# 查看 Git 版本
git --version
# git version 2.45.2

# 查看 Git 安裝路徑
which git          # macOS / Linux
where git          # Windows
```


**建議安裝版本：** Git 2.30 以上（支援 `git switch`、`git restore` 等現代指令）



> **Windows 使用者注意：** 安裝 Git for Windows 後會附帶 **Git Bash**（模擬 Unix shell），建議使用 Git Bash 或 Windows Terminal 操作。


<!--
裝好之後，第一件事是執行 `git --version`。
只要能印出版本號，就代表指令可以正常執行。
建議版本在 2.30 以上。
像 `git switch` 和 `git restore` 這些比較新的指令，舊版本是沒有的。
Windows 的使用者要特別注意。
Git for Windows 會附帶 Git Bash，它模擬了 Linux 的終端機環境。
這門課的示範主要用 Git Bash 或 macOS 的 Terminal。
請大家確認自己的環境，可以執行一樣的指令。
【講師】請大家實際執行 git --version，確認每個人都裝好了再往下。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 初始設定

<!--
Git 裝好了，但還不能馬上開始用，我們得先告訴 Git「我是誰」。
-->

---

# git config 設定層級

Git 設定分為三個層級，越下層優先級越高：

| 層級 | 範圍 | 設定檔位置 | 旗標 |
| --- | --- | --- | --- |
| System | 所有使用者 | `/etc/gitconfig` | `--system` |
| Global | 目前使用者 | `~/.gitconfig` | `--global` |
| Local | 目前儲存庫 | `.git/config` | `--local` |


```bash
# 查看所有設定（顯示來源層級）
git config --list --show-origin
```


<!--
Git 的設定分成三個層級。
System 影響整台電腦的所有使用者，通常不太會去動它。
Global 影響目前這個使用者的所有 repo，適合放姓名、email 這類個人設定。
Local 只影響目前這一個 repo。
例如公司的專案要用公司信箱，就可以在那個 repo 裡用 local 另外設定。
三個層級衝突的時候，越具體的設定越優先，也就是 local 最大。
想知道某個設定值到底是從哪一層來的，可以用 `git config --list --show-origin`。
它會把每個設定值和它的來源檔案一起列出來，除錯的時候很好用。
-->

---

# 必做的首次設定

安裝後**第一件事**：告訴 Git 你是誰

```bash
# 設定使用者名稱（Global，影響所有 repo）
git config --global user.name "Your Name"

# 設定 Email
git config --global user.email "you@example.com"

# 確認設定
git config --global user.name
git config --global user.email
```


> **為什麼重要？** 每個 commit 都會記錄這兩個資訊，一旦推送到遠端就難以修改。


<!--
大家有沒有遇過，commit 完才發現作者名字打錯，或是 email 還是舊公司的？
姓名和 email 會被寫進每一個 commit 裡。
一旦推上 GitHub 或 GitLab，就變成公開紀錄，要改非常麻煩。
所以第一次就要設定正確。
這裡用 `--global`，是因為大部分情況下，我們希望所有 repo 都用同一個身份。
設定完，再單獨執行 `git config --global user.name`，就能確認目前的值。
如果某個專案要用不同的 email，在那個 repo 裡用 `--local` 覆蓋就好。
-->

---

# 其他實用設定

```bash
# 設定預設編輯器（撰寫 commit 訊息時使用）
git config --global core.editor "code --wait"   # VS Code
git config --global core.editor "vim"            # Vim
git config --global core.editor "nano"           # Nano

# 設定預設分支名稱（Git 2.28+）
git config --global init.defaultBranch main

# Windows 換行符號處理（避免跨平台問題）
git config --global core.autocrlf true           # Windows
git config --global core.autocrlf input          # macOS / Linux

# 設定彩色輸出
git config --global color.ui auto
```

<!--
設定好姓名和 email 之後，這幾個設定也建議一起做。
`core.editor` 決定 commit 沒加 `-m` 時，會打開哪個編輯器。
如果不設，預設很可能跳出 Vim，很多人會卡在裡面不知道怎麼離開。
`init.defaultBranch` 設成 main，新建的 repo 預設分支就會叫 main，這是現在的主流命名。
`core.autocrlf` 處理的是 Windows 和 Mac、Linux 換行符號不同的問題。
Windows 設 true，Mac 和 Linux 設 input。
沒設對的話，跨平台協作時會出現一堆其實沒改內容的假 diff。
-->

---

# 設定命令別名（Alias）

讓常用指令變得更短更方便：

```bash
# 常用別名設定
git config --global alias.st   status
git config --global alias.co   checkout
git config --global alias.br   branch
git config --global alias.lg   "log --oneline --graph --all --decorate"
```


**使用方式：**

```bash
git st          # 等同 git status
git co main     # 等同 git checkout main
git br          # 等同 git branch
git lg          # 精簡圖形化歷史
```



**查看目前所有別名：**

```bash
git config --global --list | grep alias
```


<!--
Alias 是一個小功能，但很實用，它能把常打的長指令縮短成幾個字母。
例如設定 `alias.st` 之後，打 `git st` 就等於 `git status`。
其中 `lg` 那一串，是很多老手愛用的組合。
oneline 讓每個 commit 只佔一行，graph 畫出分支圖。
all 會顯示所有分支，decorate 則標出分支和 tag 的名稱。
一行指令就能把整個專案的歷史看得清清楚楚。
想知道自己設了哪些 alias，可以用最下面那行把它們篩選出來。
大家也可以依照自己的習慣，慢慢累積屬於自己的 alias。
-->

---

# 查看與編輯設定檔

```bash
# 直接用編輯器開啟 global 設定檔
git config --global --edit

# 查看特定設定值
git config user.name
git config user.email

# 刪除設定
git config --global --unset user.email

# 查看設定檔完整內容
cat ~/.gitconfig
```


<!--
設定檔除了用指令一行一行改，也可以直接打開來編輯。
`git config --global --edit` 會用剛才設定的編輯器打開 global 設定檔。
想看某一個設定值，就在 `git config` 後面接上它的名稱。
設錯了，可以用 `--unset` 把那個設定刪掉。
最後一行 `cat ~/.gitconfig`，則是直接把整個設定檔印出來看。
-->

---

# ~/.gitconfig 範例內容

```ini
[user]
    name = Jane Doe
    email = jane@example.com
[core]
    editor = code --wait
    autocrlf = input
[init]
    defaultBranch = main
[alias]
    st = status
    lg = log --oneline --graph --all --decorate
```

<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

設定檔用 <code>[section]</code> 分組、<code>key = value</code> 設定值。可直接手動編輯，不必透過 <code>git config</code> 指令。

</div>

<!--
這就是設定完之後，`~/.gitconfig` 大概的樣子。
它是很單純的文字格式，中括號是分組，底下用「名稱等於值」的方式寫設定。
user 這一組放姓名和 email，core 放編輯器和換行設定，alias 放我們剛才設的別名。
大家可以打開自己的設定檔對照看看，確認該設的都設好了。
熟悉之後，直接手動編輯這個檔案，有時候比打指令還快。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 取得說明

<!--
最後一個主題：怎麼取得說明。指令那麼多，沒有人背得完，會查文件才是關鍵。
-->

---

# git help — 三種查詢方式

遇到不熟悉的指令時，不用死記，善用說明文件：

```bash
# 方法一：開啟完整 man page（HTML 格式，瀏覽器）
git help <verb>
git help config

# 方法二：在終端機顯示簡短說明
git <verb> --help
git config --help

# 方法三：顯示快速選項清單（-h 小寫）
git <verb> -h
git config -h
```

<!--
Git 有幾百個指令和參數，查文件的方法有三種，對應不同需求。
第一種是 `git help` 加上指令名稱，它會打開完整的官方文件。
適合想深入研究一個指令的所有用法時使用。
第二種是在指令後面加 `--help`，內容一樣是完整文件。
第三種是小寫的 `-h`，它只在終端機裡列出常用選項，速度最快。
適合「我大概記得這個指令，只是忘了某個參數叫什麼」的時候。
-->

---

# git help — 範例輸出

**`git config -h` 輸出範例：**

```
usage: git config [<options>]

Config file location
    --global              use global config file
    --system              use system config file
    --local               use repository config file
    -f, --file <file>     use given config file
```

<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

平常最常用 <code>-h</code>（快速查選項）；深入研究用 <code>git help</code>（完整文件）。

</div>


<!--
這是 `git config -h` 的輸出範例。
可以看到它很精簡，第一行是用法，下面列出常用的選項和一句說明。
像剛才講的 `--global`、`--system`、`--local`，在這裡都查得到。
所以平常最常用的其實是 `-h`，因為它快，而且通常就夠用了。
真的遇到完全不熟的指令，再用 `git help` 打開完整文件慢慢讀。
【講師】可以現場執行 git config -h，帶大家看一次輸出。
-->

---

# 本章重點回顧


- **版本控制** 讓每次修改可追蹤、可回溯、可協作
- Git 屬於**分散式 VCS**，每人都有完整歷史，速度快、可離線工作
- Git 三大區域：**Working Directory → Staging Area → Repository**
- 安裝後必做：`git config --global user.name / user.email`
- 設定分三層：**system < global < local**，越下層優先
- 遇到問題善用 `git help <command>` 或 `git <command> -h`



<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** Ch 10 開始使用 Git — 從 `git init` 出發，學會 add / commit / status / log

<Link to="ch10" style="color: #d97706; font-weight: 600;">前往 Ch 10 →</Link>

</div>


<!--
我們快速回顧這章的重點。
版本控制讓每一次修改都可以追蹤、回溯和協作。
Git 是分散式的，每個人都有完整歷史，速度快，也能離線工作。
三大區域是工作目錄、暫存區和 Repository，這是理解所有 Git 操作的基礎。
裝好之後一定要設定姓名和 email，而設定分成三個層級，越具體越優先。
最後，遇到問題先查文件，不要用猜的。
下一章我們就要動手操作，把這些觀念變成實際的技能。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章我們從為什麼需要版本控制，講到 Git 的三大區域，再到安裝、設定和查詢說明。
觀念打穩了，後面的操作就會順很多。
下一章，我們會從 `git init` 建立第一個 repository 開始。我們下一章見。
【講師】開放提問，特別確認大家都已經裝好 Git 並設定好姓名和 email。
-->
