---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: GitHub Desktop 入門
routeAlias: ch12
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
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">GitHub Desktop</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「不用背指令，也能好好用 Git」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十二章，GitHub Desktop。
前三章我們都用指令操作 Git，這章要介紹另一條路：用滑鼠操作的圖形化工具。
指令的意思大家都懂了，所以每個按鈕背後是哪個指令，一眼就能對上。
學完這章，我們就能用它完成 clone、commit、push，一路到開 PR。
-->

---
layout: default
---

# Outline

- **什麼是 GitHub Desktop？** — GUI 工具 / 適合的使用情境
- **下載與安裝** — 系統需求 / Windows / macOS
- **初次設定** — 登入帳號 / 設定 Git 身份
- **介面導覽** — Changes / History / Current Branch
- **基本操作：Clone** — 從 GitHub 取得專案
- **基本操作：Commit** — 暫存、撰寫訊息、送出
- **基本操作：Push / Pull** — 與遠端同步
- **基本操作：分支與 Pull Request** — 建立分支、開 PR

<!--
這章一共八個主題。
我們會依照認識工具、安裝、設定帳號、看懂介面，最後實際操作的順序來走。
操作的部分，會順便對照每個按鈕背後的 git 指令。
add、commit、log 是第十章學過的，push、pull、clone 是第十一章學過的。
分支的部分先有個印象就好，下一章會正式介紹。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 什麼是 GitHub Desktop？

<!--
先來搞清楚，這個工具是什麼，為什麼會有它。
-->

---

# 為什麼需要 GitHub Desktop？

想像一下：你接下來要開始學 Git 的指令，`add`、`commit`、`push` 這些名詞聽起來還很陌生，打指令又怕打錯字、漏參數，光是這樣就先卻步了。

<br>

**純指令操作對新手常見的門檻：**
- 指令要背，參數要記，一開始很容易卡在「打不出正確指令」
- 想看「這次到底改了哪些檔案、哪幾行」，純文字輸出不好比對
- 分支一多，全部用文字列出來，容易選錯

<!--
回想一下剛開始學指令的時候。
add、commit、push 這些名詞還很陌生，打指令又怕打錯字、漏了參數。
想看這次到底改了哪些檔案、哪幾行，純文字的輸出也不太好比對。
分支一多，全部用文字列出來，很容易選錯。
指令當然是最強大、最完整的操作方式。
但想快速瀏覽「這次改了什麼」，或是帶新人上手的時候，
一個看得到顏色、看得到分支圖的視窗，會直覺很多。
這就是 GitHub Desktop 存在的原因。
-->

---

# 什麼是 GitHub Desktop？

**GitHub Desktop** 是 GitHub 官方推出的**免費、開源**桌面應用程式，讓你用圖形化介面完成 Git 操作。

<br>

| | 特性 |
| --- | --- |
| 開發者 | GitHub（Microsoft） |
| 授權 | 免費、開源 |
| 支援平台 | Windows、macOS |
| 支援服務 | GitHub.com / GitHub Enterprise / 一般 Git remote |
| 核心概念 | 每個按鈕背後都對應一個 git 指令 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> GitHub Desktop 不是「取代」Git，它只是把 Git 的操作用視窗包起來。底層跑的還是同一套 git 指令。
</div>

<!--
GitHub Desktop 是 GitHub 官方推出的桌面程式，免費而且開源，支援 Windows 和 macOS。
它可以連 GitHub，也可以連公司的 GitHub Enterprise，或是一般的 Git 遠端。
要特別記住表格最後一行：每個按鈕背後，都對應一個 git 指令。
Git 是版本控制的引擎，GitHub Desktop 是蓋在它上面的操作介面。
在 Desktop 裡按下 Commit，跟在終端機打 `git commit`，做的是同一件事。
所以前面學過的三大區域、暫存區這些觀念，在這裡完全通用，只是換了一種操作方式。
-->

---

# 什麼情境適合用 GitHub Desktop？

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**適合的情境 ✅**

- 想快速瀏覽變更內容、逐行比對
- 團隊裡有不熟終端機的成員
- 想用「勾選檔案」的方式決定要 commit 什麼
- 需要視覺化的分支歷史圖

</div>
<div>

**仍建議用指令的情境**

- 需要精細控制（如 `rebase -i` 互動式操作）
- 寫自動化腳本、CI/CD 流程
- 遠端伺服器上沒有圖形介面

</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議：</b> 兩者不是二選一。很多工程師日常瀏覽變更、commit 用 Desktop，遇到複雜操作再切回終端機，兩邊搭配使用。
</div>

<!--
那什麼時候適合用 Desktop 呢？
想快速瀏覽改動、逐行比對，或是想用勾選的方式決定這次要 commit 什麼，用 Desktop 會很順手。
團隊裡有不熟終端機的成員，或是需要看分支歷史圖的時候，它也很好用。
但有些情境還是用指令比較好。
例如需要精細控制的互動式 rebase、寫自動化腳本，或是在沒有圖形介面的遠端主機上。
所以這兩者不是二選一。
很多工程師日常用 Desktop 看改動和 commit，遇到複雜操作再切回終端機。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 下載與安裝

<!--
認識完工具，接下來把它安裝到電腦上。
-->

---

# 下載前：系統需求

| 作業系統 | 最低版本需求 |
| --- | --- |
| Windows | Windows 10 64-bit 或以上版本 |
| macOS | macOS 12.0 或以上版本 |

<br>

前往官方網站下載安裝檔：[desktop.github.com](https://desktop.github.com/)

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提醒：</b> 官網會自動偵測你的作業系統，直接顯示對應的下載按鈕，不用自己選版本。
</div>

<!--
安裝之前，先確認系統版本。
Windows 需要 Windows 10 的 64 位元版本以上，macOS 則要 12.0 以上。
特別是公司配發的舊電腦，記得先檢查一下。
下載的地方是官方網站 desktop.github.com。
網站會自動偵測我們的作業系統，直接顯示對應的下載按鈕，不用自己挑版本。
-->

---

# 安裝步驟 — Windows

| 步驟 | 操作 |
| --- | --- |
| 1 | 打開瀏覽器，前往 https://desktop.github.com/ |
| 2 | 點擊「Download for Windows」 |
| 3 | 到下載資料夾，執行 GitHubDesktopSetup.exe |
| 4 | 等待安裝完成，程式會自動開啟 |

<!--
Windows 的安裝很單純。
到官網點 Download for Windows，下載完成後執行安裝檔。
沒有需要特別設定的選項，等它跑完，程式會自動開啟。
接著就可以進入下一步，登入帳號。
-->

---

# 安裝步驟 — macOS

| 步驟 | 操作 |
| --- | --- |
| 1 | 打開瀏覽器，前往 https://desktop.github.com/ |
| 2 | 點擊「Download for macOS」 |
| 3 | 在下載資料夾找到壓縮檔，解壓縮 |
| 4 | 開啟 GitHub Desktop 應用程式 |

<!--
macOS 的下載檔是一個壓縮檔。
解壓縮之後，直接打開 GitHub Desktop 這個應用程式就可以了。
想要的話，也可以把它拖進應用程式資料夾。
一樣，安裝完成後就準備登入帳號。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## 初次設定

<!--
軟體裝好了，第一次打開要先做兩件事：登入帳號，以及確認身份設定。
-->

---

# 登入 GitHub 帳號

首次開啟 GitHub Desktop，需要先登入你的 GitHub 帳號，之後 clone、push、開 PR 才能對應到你的身份。

<br>

| 平台 | 登入路徑 |
| --- | --- |
| macOS | 選單列 → GitHub Desktop → Settings → Accounts |
| Windows | File → Options → Accounts |

<!--
第一次打開 GitHub Desktop，要先登入 GitHub 帳號。
這樣之後 clone、push、開 PR，才能對應到我們的身份。
登入的入口在設定裡的 Accounts 分頁。
macOS 是在選單列的 GitHub Desktop 底下找 Settings，Windows 則是在 File 底下找 Options。
兩個平台的路徑不太一樣，照著這張表找就對了。
-->

---

# 登入 GitHub 帳號：操作步驟

| 步驟 | 操作 |
| --- | --- |
| 1 | 點選「Sign In」 |
| 2 | 瀏覽器會自動跳出，導向 GitHub 登入頁 |
| 3 | 輸入帳號密碼（或使用瀏覽器已登入的 session） |
| 4 | 授權完成後，瀏覽器會導回 GitHub Desktop |

<!--
我們看登入的步驟。
按下 Sign In 之後，瀏覽器會自動開啟 GitHub 的登入頁。
如果瀏覽器已經登入了，直接按授權就好。
授權完成後，瀏覽器會把我們帶回 GitHub Desktop。
這跟上一章的瀏覽器授權是同一個概念，不需要在 Desktop 裡直接輸入密碼。
所以就算開了兩步驟驗證，也能在瀏覽器裡順利完成。
-->

---

# 設定 Git 身份

登入 GitHub 帳號之後，GitHub Desktop 通常會自動帶入你的 **name** 和 **email** 設定，這對應到 Ch 9 學過的：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的信箱"
```

<br>

**手動確認 / 修改：**

| 平台 | 路徑 |
| --- | --- |
| Windows | File → Options → Git |
| macOS | GitHub Desktop → Settings → Git |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 如果這裡的 email 跟你 commit 用的 email 不一致，GitHub 網頁上可能不會把 commit 記到你的貢獻紀錄裡。
</div>

<!--
登入之後，GitHub Desktop 通常會自動帶入名字和 email。
這就是第九章用 `git config` 設定的 `user.name` 和 `user.email`，只是 Desktop 把它包成了介面。
如果要確認或修改，可以到設定裡的 Git 分頁。
這裡要再提醒一次 email 的問題。
很多人在公司電腦和個人電腦設了不同的 email，結果 GitHub 上的貢獻牆一片空白。
原因就是這裡的 email，沒有對上 GitHub 帳號綁定的信箱。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## 介面導覽

<!--
設定好了，打開主畫面。我們先認識幾個最常用的區域，之後操作才知道要點哪裡。
-->

---

# 主畫面的三個重點區域

| 區域 | 位置 | 功能 |
| --- | --- | --- |
| **Current Repository** | 左上角 | 切換目前正在操作的專案 |
| **Current Branch** | 上方中間 | 切換 / 建立分支 |
| **Changes / History** | 左側分頁 | Changes：目前未 commit 的變更；History：commit 歷史紀錄 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對照指令：</b> Changes 分頁對應 <code>git status</code> + <code>git diff</code>；History 分頁對應 <code>git log</code>。
</div>

<!--
主畫面可以拆成三塊來記。
左上角的 Current Repository，管的是現在打開哪一個專案。
上方中間的 Current Branch，管的是現在在哪個分支，也可以在這裡切換或建立分支。
左側有兩個分頁。
Changes 顯示還沒 commit 的改動，對應 `git status` 加上 `git diff`。
History 顯示已經 commit 的歷史，對應 `git log`。
這三塊幾乎涵蓋了我們日常最常看的資訊。
差別在於，這裡是直接看得到，不用一個一個打指令去查。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## 基本操作：Clone

<!--
介面認識完了，開始動手。第一步，是把專案的程式碼拿到本機。
-->

---

# Clone 一個 Repository — 方法一

**從 GitHub 網頁**

| 步驟 | 操作 |
| --- | --- |
| 1 | 到目標 repo 的 GitHub 頁面 |
| 2 | 點擊綠色的「Code」按鈕 |
| 3 | 選擇「Open with GitHub Desktop」 |
| 4 | GitHub Desktop 會自動開啟，帶入 repo 資訊 |
| 5 | 選擇本機儲存路徑，點「Clone」 |

<!--
clone 有兩種方法，先看方法一，從 GitHub 網頁開始。
到想要的 repo 頁面，點綠色的 Code 按鈕，選 Open with GitHub Desktop。
GitHub Desktop 會自動打開，並帶入這個 repo 的資訊。
選好要存在電腦的哪個位置，按 Clone 就完成了。
平常在 GitHub 上逛到想要的專案時，這個方法最方便。
背後做的事，就是上一章學過的 `git clone`，只是 Desktop 幫我們把網址帶好了。
-->

---

# Clone 一個 Repository — 方法二

**直接在 GitHub Desktop 操作**

| 步驟 | 操作 |
| --- | --- |
| 1 | 選單列 File → Clone Repository |
| 2 | 三個分頁可選：GitHub.com / GitHub Enterprise / URL |
| 3 | 選好 repo 或貼上網址，指定本機路徑 |
| 4 | 點「Clone」 |

<!--
方法二是直接在 GitHub Desktop 裡操作。
從選單列的 File 選 Clone Repository，會看到三個分頁。
前兩個可以直接從我們的 GitHub 或公司帳號裡挑 repo。
如果對方給的是一個 Git 網址，不一定在 GitHub 上，就用第三個 URL 分頁貼上網址。
選好本機的路徑，按 Clone。
兩種方法殊途同歸，背後都是 `git clone`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
## 基本操作：Commit

<!--
clone 下來之後，接著修改檔案，然後學怎麼在 Desktop 裡送出一個 commit。
-->

---

# 查看變更 — Changes 分頁

修改完檔案後，切到左側的 **Changes** 分頁，會看到：

| 顏色標記 | 意義 |
| --- | --- |
| 綠色 | 新增的檔案 |
| 黃色 | 修改過的檔案 |
| 紅色 | 刪除的檔案 |

<br>

點選任一檔案，右側會顯示逐行的差異（diff），點齒輪圖示可以切換 **Unified**（合併顯示）或 **Split**（左右並排）檢視模式。

<!--
改完檔案之後，切到左側的 Changes 分頁。
這裡會用顏色標出每個檔案的狀態，綠色是新增，黃色是修改，紅色是刪除。
點一下任何一個檔案，右邊就會顯示逐行的差異。
點齒輪圖示，可以切換成合併顯示，或是左右並排比對。
這個畫面對應的就是 `git status` 加上 `git diff`，只是用顏色取代了文字符號。
比起在終端機裡捲動一長串文字，直覺很多。
-->

---

# 暫存要 Commit 的檔案

每個檔案前面都有一個**核取方塊（checkbox）**，這就是 Desktop 版的「暫存區」操作：

| 操作 | 效果 |
| --- | --- |
| 核取方塊打勾 | 這個檔案會被加入這次 commit（等同 `git add`） |
| 取消打勾 | 這個檔案不會被加進這次 commit |
| 列表最上方的總開關 | 全選 / 全不選 |

<br>

**只想 commit 檔案裡的部分幾行？**

點選 diff 畫面裡想排除的行，該行會變成灰色（不勾選），保持藍色的行才會被 commit。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對照指令：</b> 這個功能對應到指令列的「部分暫存（patch mode）」，也就是 <code>git add -p</code>，這個技巧我們之後會在進階章節詳細介紹。
</div>

<!--
每個檔案前面都有一個核取方塊，這就是 Desktop 版的暫存區。
打勾，代表這個檔案會被加進這次的 commit，等於 `git add`。
取消打勾，這個檔案就不會被包含進去。
列表最上方還有一個總開關，可以一次全選或全不選。
更好用的是，還能只 commit 檔案裡的某幾行。
在右邊的差異畫面點一下想排除的那一行，它會變成灰色，只有保持藍色的行才會被 commit。
在指令列，這要用 `git add -p` 才做得到，而且要一直按按鍵選擇，新手很容易搞混。
在 Desktop 裡，點一下滑鼠就好，這是它最好用的功能之一。
-->

---

# 送出 Commit

在左側清單最下方，填寫兩個欄位：

| 欄位 | 用途 |
| --- | --- |
| **Summary** | 一句話說明這次改了什麼（必填，等同 commit message 第一行） |
| **Description** | 補充說明，選填（等同 commit message 的詳細內容） |

<!--
勾選好檔案之後，要在左側清單的最下方填寫兩個欄位。
Summary 是必填的，用一句話說明這次改了什麼，也就是 commit 訊息的第一行。
Description 是選填的，用來補充說明，對應訊息底下的詳細內容。
第十章講的 commit message 原則，在這裡一樣適用。
-->

---

# 送出 Commit：操作步驟

| 步驟 | 操作 |
| --- | --- |
| 1 | 勾選要 commit 的檔案 |
| 2 | 填寫 Summary（例如：「新增登入頁面」） |
| 3 | 需要的話填寫 Description |
| 4 | 點擊「Commit to &lt;分支名稱&gt;」按鈕 |

<!--
送出 commit 的步驟是這樣。
先勾選要 commit 的檔案，填寫 Summary，例如「新增登入頁面」。
需要的話再填 Description，最後按下 Commit to，後面接著分支名稱的那個按鈕。
Summary 和 Description，其實就是 `git commit` 帶兩個 `-m`，拆成兩個輸入框而已。
養成寫清楚 Summary 的習慣，之後在 History 分頁回頭看的時候會很有感。
-->

---

# 用 Copilot 自動產生 Commit Message

Summary 輸入框右側有一個 **✨ 圖示**，點下去會呼叫 GitHub Copilot 根據目前的 diff 自動產生 message：

| 步驟 | 操作 |
| --- | --- |
| 1 | 先勾選要 commit 的檔案（決定 diff 範圍） |
| 2 | 點擊 Summary 欄位旁的 ✨ 圖示 |
| 3 | Copilot 分析 diff，自動填入 Summary（必要時也會填 Description） |
| 4 | 檢查內容是否正確，可手動修改後再送出 |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 需要有效的 Copilot 授權（個人版或組織版）才能使用；Copilot 只看得到「已勾選」要 commit 的 diff，勾錯檔案會產生錯誤的訊息。
</div>

<!--
Summary 輸入框的右邊，有一個星星圖示。
點下去，GitHub Copilot 會分析目前的改動，自動幫我們產生 commit 訊息。
改動比較複雜時，它還會順便填好 Description。
不知道怎麼描述這次改了什麼的時候，這個功能特別好用。
不過有兩件事要注意。
第一，帳號要有 Copilot 的授權才能使用。
第二，Copilot 只看得到已經勾選的檔案，勾錯了，產生的訊息也會文不對題。
所以要先確認勾選的範圍，產生之後也要自己檢查一遍，不要照單全收。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
## 基本操作：Push / Pull

<!--
commit 完還只在本機，接下來要跟遠端同步。
-->

---

# 推送與拉取

commit 完成後，畫面上方會出現對應的按鈕：

| 按鈕 | 對應指令 | 說明 |
| --- | --- | --- |
| **Push origin** | `git push` | 把本機的 commit 推送到 GitHub |
| **Fetch origin** | `git fetch` | 檢查遠端有沒有新的更新 |
| **Pull origin** | `git pull` | 把遠端的新 commit 拉回本機 |

<br>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>小技巧：</b> 按鈕上方通常會顯示數字，例如「Push origin (2)」代表有 2 個 commit 還沒推上去，一眼就能看出本機和遠端的落差。
</div>

<!--
commit 完成後，畫面上方會出現跟遠端同步的按鈕，它會隨著狀態改變。
Push origin 對應 `git push`，把本機的 commit 推上 GitHub。
Fetch origin 對應 `git fetch`，檢查遠端有沒有新的更新。
Pull origin 對應 `git pull`，把遠端的新 commit 拉回來。
按鈕上還會顯示數字。
例如 Push origin 旁邊寫著 2，代表有兩個 commit 還沒推上去。
這就是上一章講的本機領先或落後遠端，Desktop 已經幫我們算好了，不用自己去數。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 8
## 基本操作：分支與 Pull Request

<!--
最後這段，我們看怎麼在 Desktop 裡建立分支、切換分支，還有開 Pull Request。
-->

---

# 建立新分支

| 步驟 | 操作 |
| --- | --- |
| 1 | 點擊上方的 Current Branch 下拉選單 |
| 2 | 點擊「New Branch」 |
| 3 | 輸入分支名稱，確認「Create branch based on...」的基準分支 |
| 4 | 點擊「Create Branch」 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對照指令：</b> 對應到 <code>git branch</code> / <code>git checkout -b</code>，這個指令我們會在使用分支那一章詳細介紹。
</div>

<!--
建立分支的步驟很簡單。
點上方的 Current Branch 下拉選單，按 New Branch。
輸入分支名稱，最後按 Create Branch。
這裡要特別注意 based on 那一欄，它決定新分支是從哪個分支長出來的。
同時開著好幾個分支的時候，很容易選錯，建立前記得確認。
這個動作對應的是 `git branch` 或 `git checkout -b`，下一章會詳細介紹。
-->

---

# 切換分支

| 步驟 | 操作 |
| --- | --- |
| 1 | 點擊 Current Branch 下拉選單 |
| 2 | 選擇要切換的分支 |
| 3 | 若有未 commit 的變更，選擇「留在原分支」或「帶到新分支」 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對照指令：</b> 對應到 <code>git switch</code>，這個指令我們會在使用分支那一章詳細介紹。
</div>

<!--
切換分支一樣是從 Current Branch 下拉選單，選擇要切換的分支。
如果手上還有沒 commit 的改動，Desktop 會問我們要怎麼處理。
可以把改動留在原本的分支上，也可以一起帶到新的分支。
在指令列，`git switch` 會直接把改動帶過去，只有在會衝突時才會擋下來。
Desktop 則是每次都先問一聲，對新手來說比較不容易搞混。
-->

---

# 建立 Pull Request

分支推上遠端之後（點擊 **Publish branch**），就能直接在 Desktop 裡開 PR：

| 步驟 | 操作 |
| --- | --- |
| 1 | 確認目前在功能分支上，且已經 Push 過 |
| 2 | 點擊選單列 Branch → Create Pull Request（或畫面上的「Create Pull Request」按鈕） |
| 3 | 瀏覽器會自動開啟 GitHub 網頁，帶入分支資訊 |
| 4 | 在網頁上填寫標題、描述，選擇要合併到的目標分支 |
| 5 | 點擊「Create Pull Request」送出 |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 開 PR 跟合併 PR 需要對該 repository 有寫入權限，否則需要先 Fork 一份到自己帳號下。
</div>

<!--
分支按下 Publish branch 推上遠端之後，就能直接開 Pull Request。
確認目前在功能分支上，而且已經 push 過。
從選單列的 Branch 選 Create Pull Request，或是直接按畫面上的按鈕。
瀏覽器會自動打開 GitHub 的開 PR 頁面，帶好分支的資訊。
接著在網頁上填寫標題和描述，選擇要合併到哪個分支，最後送出。
Desktop 幫我們做的是準備的部分，實際填寫還是在 GitHub 網頁上完成。
要注意，開 PR 需要對這個 repo 有寫入權限。
沒有的話，就要用上一章的 Fork 流程，先複製一份到自己的帳號下。
-->

---
layout: default
---

# 練習 1：安裝並登入 GitHub Desktop
### 任務說明

在自己的電腦上完成以下操作：
1. 前往官網下載並安裝 GitHub Desktop
2. 登入自己的 GitHub 帳號
3. 確認 Git 身份設定裡的 name / email 與 GitHub 帳號一致

<!--
我們來做第一個練習：在自己的電腦上安裝並登入 GitHub Desktop。
下載安裝之後，登入自己的 GitHub 帳號。
最後確認 Git 設定裡的名字和 email，跟 GitHub 帳號一致。
大家可以想一想：如果 email 對不上，會在哪裡看出問題？
我們先暫停一下，自己動手試試看。
【講師】給大家十分鐘完成安裝與登入，巡視確認每個人都登入成功。
-->

---

# 練習 1：解題提示
### 提示說明

1. 依照系統需求表確認自己的作業系統版本符合安裝條件
2. 忘記登入路徑的話，回頭看「初次設定」那一頁的表格
3. email 對不上時，直接在 Git 設定頁面手動修改，或到 GitHub 網頁的 Settings → Emails 確認帳號綁定的信箱

<!--
我們來看提示。
安裝前，先對照系統需求表，確認作業系統的版本符合條件。
忘記登入的入口在哪裡，可以回頭看初次設定那一頁的表格。
回答剛才的問題，email 對不上時，GitHub 上的貢獻牆會一片空白。
這時候可以直接在 Desktop 的 Git 設定裡修改。
也可以到 GitHub 網頁的 Settings 裡的 Emails，確認帳號綁定的是哪個信箱。
-->

---
layout: default
---

# 練習 2：完整走一次協作流程
### 任務說明

用 GitHub Desktop 完成一次完整流程：
1. Clone 一個你有權限的 repository（或自己建立一個新的）
2. 建立一個新分支
3. 修改一個檔案並 commit
4. Push 到遠端
5. 建立一個 Pull Request

<!--
第二個練習，我們用 GitHub Desktop 完整走一次協作流程。
先 clone 一個自己有權限的 repo，建立一個新分支。
修改一個檔案並 commit，push 到遠端，最後開一個 Pull Request。
做的時候可以想一想：每一個步驟，背後對應的是哪一個 git 指令？
我們先暫停一下，自己動手試試看。
【講師】給大家十五分鐘，完成的人可以互相到對方的 PR 留言。
-->

---

# 練習 2：解題提示
### 提示說明

1. 沒有現成 repo 的話，先在 GitHub 網頁上建立一個新的空 repository 再 clone 下來
2. 建立分支時記得確認基準分支是 main
3. commit 前先在 Changes 分頁確認 diff 內容，只勾選你真的要送出的檔案
4. Push 完成後，畫面上或選單列會出現「Create Pull Request」的入口

<!--
我們來看提示。
如果沒有現成的 repo，可以先在 GitHub 網頁上建一個新的，再 clone 下來。
建立分支時，記得確認 based on 選的是 main。
commit 之前，先在 Changes 分頁看過改動，只勾選真的要送出的檔案。
push 完成之後，畫面上或選單列就會出現 Create Pull Request 的入口。
對照剛才的問題，這一路依序是 clone、branch、add、commit、push，最後在網頁上開 PR。
-->

---
layout: default
---

# 本章重點回顧


- **Desktop 不是取代 Git**，底層跑的還是同一套指令；Ch 9 的三大區域觀念完全通用
- **Changes 分頁 = `git status` + `git diff`；History 分頁 = `git log`**
- **核取方塊 = `git add`**，勾選單行 = `git add -p`
- **Summary / Description = `git commit -m "標題" -m "內文"`**
- **Push / Fetch / Pull 按鈕上的數字**，就是本機和遠端相差幾個 commit
- **email 要跟 GitHub 帳號一致**，否則貢獻紀錄不會算進去
- **複雜操作（互動式 rebase、腳本、遠端主機）還是回終端機**


<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** Ch 13 使用分支 — branch / switch / merge / 衝突解決

<Link to="ch13" style="color: #d97706; font-weight: 600;">前往 Ch 13 →</Link>

</div>

<!--
我們回顧這章的重點。
GitHub Desktop 不是取代 Git，底層跑的還是同一套指令。
Changes 分頁對應 `git status` 和 `git diff`，History 分頁對應 `git log`。
勾選檔案就是 `git add`，Summary 和 Description 就是 commit 訊息。
同步按鈕上的數字，代表本機和遠端差了幾個 commit。
email 要跟 GitHub 帳號一致，貢獻紀錄才會算進去。
遇到複雜的操作，還是回到終端機。
最重要的是記住按鈕和指令的對照，知道自己按下去的是什麼，出問題時才知道要查什麼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章沒有新的 Git 觀念，而是把前面學過的操作，換成圖形介面再走一遍。
Desktop 和指令列是互補的，日常操作用 Desktop 加快速度，複雜的情境再切回終端機。
下一章，我們要進入分支的世界，學會讓多條開發線同時進行，又不互相干擾。我們下一章見。
【講師】開放提問，確認大家都完成了練習二的 PR。
-->
