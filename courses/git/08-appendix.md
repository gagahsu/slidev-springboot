---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 附錄 後悔藥與 CLI 小抄
routeAlias: ch08
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
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 初學者課程 · 附錄</p>
  <h1 style="color: #92400e; font-size: 3.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">後悔藥 + CLI 小抄</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「改壞了也不用怕」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
附錄整理兩樣東西。
第一是後悔藥：改壞了、commit 錯了、推上去才發現有問題，各自怎麼救。
第二是整門課用到的指令小抄，可以印出來放在桌上。
-->

---

# 三種後悔，三種藥

| 狀況 | GitHub Desktop | CLI 對照 |
| --- | --- | --- |
| ① 檔案改壞了，**還沒 commit** | 右鍵 → **Discard changes** | `git restore 檔名` |
| ② 剛 commit 完發現寫錯，**還沒 Push** | 左下角 **Undo** | （進階課程） |
| ③ 已經 **Push** 的 commit 想取消 | History 右鍵 → **Revert changes in commit** | `git revert` |

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>判斷順序：</b> 先問自己「commit 了嗎？」，再問「Push 了嗎？」，就知道要用哪一種。
</div>

<!--
後悔可以分成三種情況，判斷方法很簡單。
先問自己：commit 了嗎？還沒 commit，就用 Discard changes，把檔案還原到上一次存檔的樣子。
commit 了，再問：Push 了嗎？還沒 Push，可以用 Undo 把最後一次 commit 收回來。
已經 Push 了，別人可能已經拿到，就不能收回，要用 Revert 做一個反向的 commit 把它抵銷。
【講師】可以出情境題讓大家判斷，例如 commit 了但還沒 Push、想改 Summary，要用哪一種。
-->

---

# ① Discard changes：還沒 commit 的修改不要了

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | Changes 分頁，在檔案上**按右鍵** |
| 2 | 選 **Discard changes...** |
| 3 | 確認對話框按 **Discard changes** |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 被丟掉的修改會先移到<b>資源回收筒</b>，真的按錯還有機會撿回來。
</div>

</div>
<div>

<Shot file="bA-01-discard-changes.png" desc="右鍵 Discard changes" />

<CliBox :cmds="['git restore index.html']" note="把檔案還原成上一次 commit 的樣子" />

</div>
</div>

<!--
第一種，檔案改到一半，發現越改越糟，想回到上一次存檔的樣子。
在 Changes 分頁的檔案上按右鍵，選 Discard changes，確認之後，檔案就還原了。
Desktop 很貼心，被丟掉的修改會先移到資源回收筒，真的按錯還有機會撿回來。
對應的指令是 `git restore`。
【講師】請大家故意把 index.html 改壞，再用 Discard changes 還原，親手做一次。
-->

---

# ② Undo：收回剛剛的 commit

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | commit 之後，左下角出現 **Committed just now** |
| 2 | 按旁邊的 **Undo** |
| 3 | commit 消失，修改**回到 Changes**，Summary 也還在 |
| 4 | 改好之後重新 Commit |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ 只能收回<b>最後一個</b>、而且<b>還沒 Push</b> 的 commit。
</div>

</div>
<div>

<Shot file="bA-02-undo-commit.png" desc="Undo 最後一次 commit" />

</div>
</div>

<!--
第二種，剛 commit 完，發現 Summary 打錯字，或是漏了一個檔案。
commit 之後，左下角會顯示 Committed just now，旁邊有一個 Undo 按鈕。
按下去，這個 commit 就消失了，修改會回到 Changes 分頁，連 Summary 都幫我們留著。
改好之後重新 commit 就好。
要注意，Undo 只能收回最後一個、而且還沒 Push 的 commit。
【講師】請大家做一個測試 commit 再按 Undo，看修改回到 Changes 的樣子。
-->

---

# ③ Revert：已經 Push 的 commit 想取消

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | History 分頁，在要取消的 commit 上**按右鍵** |
| 2 | 選 **Revert changes in commit** |
| 3 | 多出一個新的 commit：`Revert "原本的訊息"` |
| 4 | **Push origin** |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Revert 不會刪掉歷史，而是<b>再做一個反過來的 commit</b>，隊友 Pull 時不會出問題。
</div>

</div>
<div>

<Shot file="bA-03-revert-commit.png" desc="History 右鍵 → Revert changes in commit" />

<CliBox :cmds="['git revert <commit 編號>']" note="新增一個抵銷指定 commit 的 commit" />

</div>
</div>

<!--
第三種，commit 已經 Push 上去了，才發現有問題。
這時候隊友可能已經 Pull 了，不能直接把它從歷史上抹掉。
在 History 分頁，對那個 commit 按右鍵，選 Revert changes in commit。
Desktop 會新增一個 commit，內容剛好跟原本的相反，把它抵銷掉，訊息會是 Revert 加上原本的訊息。
最後記得 Push。
因為歷史只增不減，隊友 Pull 的時候不會出問題。
對應的指令是 `git revert`。
【講師】可以請同學到 GitHub 的 commit 列表，確認多了一筆 Revert 開頭的 commit。
-->

---
class: cheatsheet
---

# CLI 小抄（可列印）

<style>
.cheatsheet table { margin: 0.2rem 0 0.6rem !important; }
.cheatsheet th, .cheatsheet td { padding: 3px 6px !important; font-size: 0.74rem !important; }
.cheatsheet h3 { color: #92400e; font-size: 0.9rem !important; margin: 0.2rem 0 0 !important; }
.cheatsheet code { font-size: 0.72rem !important; padding: 1px 4px !important; }
</style>

<div class="grid grid-cols-3 gap-4">
<div>

### 設定與存檔（B1–B2）

| 指令 | Desktop |
| --- | --- |
| `git config --global user.name` | Options → Git |
| `git init` | New repository |
| `git status` | Changes 分頁 |
| `git add 檔名` | 打勾 |
| `git commit -m "訊息"` | Commit |
| `git log --oneline` | History 分頁 |

</div>
<div>

### 同步（B3、B6）

| 指令 | Desktop |
| --- | --- |
| `git remote add origin 網址` | Publish repository |
| `git push` | Push origin |
| `git push -u origin 分支` | Publish branch |
| `git pull` | Pull origin |
| `git clone 網址` | Clone repository |

### 後悔藥（附錄）

| 指令 | Desktop |
| --- | --- |
| `git restore 檔名` | Discard changes |
| `git revert 編號` | Revert changes in commit |

</div>
<div>

### 分支（B4）

| 指令 | Desktop |
| --- | --- |
| `git switch -c 分支` | New branch |
| `git switch 分支` | 切換 Current branch |
| `git merge 分支` | Merge into current branch |
| `git branch -d 分支` | Branch → Delete |

### 衝突標記（B5）

| 標記 | 意思 |
| --- | --- |
| `<<<<<<< HEAD` | Current（你的） |
| `=======` | 分隔線 |
| `>>>>>>> 分支` | Incoming（對方的） |

</div>
</div>

<!--
最後這張是整門課的指令小抄，一共十五個指令，左邊是指令，右邊是在 Desktop 裡對應的操作。
這門課的目標不是背指令，而是認得它們。
以後看到網路教學或同事打指令，能對應到自己在 Desktop 裡按的是哪個按鈕，就夠了。
這一頁可以用 export 匯出 PDF 印出來。
【講師】課前可先用 `pnpm export:all b08` 匯出 PDF，印好小抄發給大家。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 課程結束 🎉

### 有問題隨時回來翻投影片

<Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 1rem;">← 回到目錄</Link>

<!--
初學者課程到這裡結束。
大家已經能用 GitHub Desktop 完成一整套協作流程了。
遇到忘記的地方，回來翻對應的章節，每一章最後的檢查點也可以拿來自我檢查。
想學更多，可以接著看進階課程，裡面有 tag、stash、rebase、Git Flow 這些更進階的主題。
【講師】保留五到十分鐘做整體問答。
-->
