---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: B5 解衝突
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
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 初學者課程 · B5</p>
  <h1 style="color: #92400e; font-size: 3.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">解衝突 ⭐</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「衝突不是壞掉，是 Git 在問你：要留哪一個？」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第五章，解衝突。
這是整門課最重要的一章，也是新手最怕的一章。
很多人第一次看到衝突，以為專案壞掉了。
其實衝突只是 Git 遇到它沒辦法自己決定的事，停下來問我們：要留哪一個？
這一章我們會故意製造兩次衝突，一次在合併分支時，一次在 Pull 時，把它們都解掉。
【講師】這章節奏放慢，每一步都等全部同學跟上再往下。
-->

---
layout: default
---

# 回顧 B4，這一章我們會做到

<div class="grid grid-cols-2 gap-8 mt-2">
<div style="background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px; padding: 1rem;">

**回顧**

- 新功能開分支，做完合併回 main
- 合併前先切回 main
- B4 的合併很順利，因為**只有一邊改**

</div>
<div>

**這一章**

- **Part 1** 衝突是什麼、什麼時候發生
- **Part 2** 製造一次合併衝突
- **Part 3** 用 VS Code 解衝突
- **Part 4** Pull 時也會衝突
- **Part 5** 怎麼減少衝突

</div>
</div>

<!--
回顧上一章：新功能開分支，做完切回 main 合併。
上一章的合併很順利，因為只有分支這一邊有改動。
這一章要讓兩邊都改到同一行。
我們會先搞懂衝突是什麼，再製造一次合併衝突、用 VS Code 解掉，接著練習 Pull 時的衝突，最後談怎麼減少衝突。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 衝突是什麼

<!--
先搞懂衝突在什麼情況下會發生。
-->

---

# 兩邊都改了同一行

<div class="grid grid-cols-2 gap-8 mt-2">
<div>

| 兩邊改的地方 | 結果 |
| --- | --- |
| 不同檔案 | ✅ 自動合併 |
| 同一個檔案、**不同行** | ✅ 自動合併 |
| 同一個檔案、**同一行** | ⚠️ **衝突** |

</div>
<div>

<div style="background:#fff8f0; border:2px solid #d97706; border-radius:12px; padding:1rem 1.2rem;">

**main 改成：**

<code>&lt;h1&gt;大家好，我是王小明&lt;/h1&gt;</code>

**change-title 分支改成：**

<code>&lt;h1&gt;嗨，我是王小明，歡迎光臨&lt;/h1&gt;</code>

<div style="margin-top:0.8rem; color:#92400e; font-weight:700;">→ Git：兩個都是新的，我該聽誰的？</div>

</div>

</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 衝突只在 Git <b>沒辦法自己決定</b>時發生。它會停下來，讓你決定最後要留什麼。
</div>

<!--
Git 合併的時候，大部分情況都能自己處理。
兩邊改的是不同檔案，或是同一個檔案的不同行，Git 都會自動合併。
只有兩邊都改到同一行，Git 才會停下來。
看右邊的例子，main 把標題改成「大家好」，分支把同一行改成「歡迎光臨」。
兩個都是新的修改，Git 不知道該聽誰的，這就是衝突。
衝突不是錯誤，是 Git 把決定權交還給我們。
-->

---

# 衝突標記長這樣

衝突發生時，Git 會把兩個版本都寫進檔案，用三種標記隔開：

```html
<<<<<<< HEAD
  <h1>大家好，我是王小明</h1>
=======
  <h1>嗨，我是王小明，歡迎光臨</h1>
>>>>>>> change-title
```

| 標記 | 意思 |
| --- | --- |
| `<<<<<<< HEAD` 到 `=======` | **Current**：你現在所在分支（main）的版本 |
| `=======` 到 `>>>>>>> change-title` | **Incoming**：要合併進來的分支的版本 |

<div class="mt-2 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ 解完衝突後，這三行標記<b>一定要刪乾淨</b>，否則網頁上會直接顯示這些符號。
</div>

<!--
衝突發生時，Git 會把兩個版本都寫進檔案裡，用三種標記隔開。
從一排小於符號加上 HEAD，到一排等號，是我們現在所在的分支，也就是 main 的版本，VS Code 叫它 Current。
從等號到一排大於符號，是要合併進來的分支的版本，VS Code 叫它 Incoming。
我們的工作，就是決定最後要留下什麼，然後把三行標記刪乾淨。
如果沒刪，網頁上就會直接顯示這些奇怪的符號。
【講師】可以指著程式碼問大家，哪一段是 main 的版本，請同學回答後再往下。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 製造一次合併衝突

<!--
接下來我們故意製造一次衝突。
-->

---

# 動手做：兩邊都改標題

| # | 在哪裡 | 操作 | Commit Summary |
| --- | --- | --- | --- |
| 1 | main | New branch → `change-title` | — |
| 2 | **change-title** | 第 8 行改成 `<h1>嗨，我是王小明，歡迎光臨</h1>` | `修改標題為歡迎光臨` |
| 3 | 切回 **main** | 第 8 行改成 `<h1>大家好，我是王小明</h1>` | `修改標題為大家好` |
| 4 | **main** | Branch → Merge into current branch → 選 `change-title` | — |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 這就是真實團隊會遇到的情況：你和隊友同時改了同一個地方，各自都 commit 了。
</div>

<!--
我們照著這張表做。
第一步，在 main 開一條新分支 change-title。
第二步，在 change-title 上把第 8 行的標題改成「嗨，我是王小明，歡迎光臨」，commit。
第三步，切回 main，把同一行改成「大家好，我是王小明」，也 commit。
現在兩條分支都改了同一行。
第四步，在 main 上合併 change-title，衝突就會發生。
這就是真實團隊最常遇到的情況：兩個人同時改了同一個地方。
【講師】給大家五分鐘完成前三步，確認兩條分支各有一個修改標題的 commit，再一起做第四步。
-->

---

# 合併前，Desktop 就先警告你

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

- 在 Merge into main 對話框選了 `change-title` 之後
- 下方出現 ⚠️ **There will be 1 conflicted file**
- 意思是：這次合併會有 1 個檔案衝突
- 照樣按 **Create a merge commit** 繼續

</div>
<div>

<Shot file="b05-00-conflict-warning.png" desc="合併前的衝突警告" />

</div>
</div>

<!--
其實在按下合併之前，Desktop 就已經發現問題了。
在 Merge into main 的對話框選 change-title 之後，下方原本寫著會合併幾個 commit 的地方，變成一個橘色的警告：There will be 1 conflicted file。
意思是這次合併，會有一個檔案發生衝突。
這不是錯誤，我們照樣按 Create a merge commit，進入解衝突的流程。
-->

---

# Desktop 跳出衝突對話框

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

- 對話框標題：**Resolve conflicts before Merge**
- 列出有衝突的檔案：`index.html`，**1 conflict**
- **Continue merge** 是灰色的：衝突解完才能按
- 這時候合併**還沒完成**，先別按 Abort

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 按 <b>Abort merge</b> 會放棄這次合併、回到合併前，不會壞掉。真的卡住時可以用它重來。
</div>

</div>
<div>

<Shot file="b05-01-conflict-dialog.png" desc="合併衝突對話框" />

</div>
</div>

<!--
按下合併之後，Desktop 會跳出這個對話框，標題是 Resolve conflicts before Merge，意思是合併之前先解決衝突。
旁邊有一個 Resolve with Copilot，是讓 AI 幫忙解的新功能，這門課我們先自己解。
下面列出有衝突的檔案，就是 index.html。
這時候合併還沒有完成，Git 停在一半，等我們做決定。
右下角有一個 Abort merge，按下去會放棄這次合併，回到合併之前的狀態。
真的卡住、不知道怎麼辦的時候，可以用它重來，不會把專案弄壞。
【講師】已經按了 Abort merge 的同學，回到上一頁的第四步重新合併即可。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## 用 VS Code 解衝突

<!--
Desktop 本身不能改檔案內容，所以要用 VS Code 來解。
-->

---

# 用 VS Code 打開衝突的檔案

<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 在對話框的 `index.html` 旁邊，按 **Open in Visual Studio Code** |
| 2 | VS Code 用顏色標出兩個版本 |
| 3 | 上方有一排可以點的按鈕 |

| 按鈕 | 結果 |
| --- | --- |
| **Accept Current Change** | 留 main 的版本 |
| **Accept Incoming Change** | 留分支的版本 |
| **Accept Both Changes** | 兩個都留 |

</div>
<div>

<Shot file="b05-02-vscode-conflict.png" desc="VS Code 顯示衝突 + Accept 按鈕" />

</div>
</div>

<!--
在對話框裡 index.html 的旁邊，有一個 Open in Visual Studio Code 的按鈕，這就是第一章為什麼要設定外部編輯器。
VS Code 打開之後，會用顏色標出兩個版本，綠色是 Current，藍色是 Incoming。
上方有一排按鈕。
Accept Current Change 留下 main 的版本，Accept Incoming Change 留下分支的版本，Accept Both Changes 兩個都留。
點一下按鈕，標記就會自動刪掉。
【講師】按鈕打不開 VS Code 的同學，檢查 Desktop 的 Options、Integrations 分頁是否選了 Visual Studio Code。
-->

---

# 決定最後的內容，然後存檔

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

這次我們想**兩句都要**，合成一行：

<div style="background:#1f2937; color:#f9fafb; border-radius:8px; padding:0.6rem 1rem; font-family: ui-monospace, Consolas, monospace; font-size:0.85rem;">&lt;h1&gt;大家好，我是王小明，歡迎光臨&lt;/h1&gt;</div>

1. 按 **Accept Both Changes**
2. 手動把兩行改成上面這一行
3. 確認 `<<<<<<<`、`=======`、`>>>>>>>` **都不見了**
4. **Ctrl + S** 存檔

</div>
<div>

<Shot file="b05-03-vscode-resolved.png" desc="解完後的檔案" />

</div>
</div>

<!--
最後要留什麼，完全由我們決定。
這次我們兩句都想要，所以先按 Accept Both Changes，兩行都會留下來。
再手動把兩行改成一行：「大家好，我是王小明，歡迎光臨」。
存檔之前，一定要確認三種標記都已經不見了。
最後按 Ctrl 加 S 存檔。
【講師】巡視時特別檢查標記有沒有刪乾淨，這是最常漏掉的地方。
-->

---

# 回到 Desktop：Continue merge

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 回到 Desktop，出現 **All conflicted files have been resolved**，`index.html` 顯示 **No conflicts remaining** |
| 2 | 按 **Continue merge** |
| 3 | History 多了一筆 `Merge branch 'change-title'` |
| 4 | **Push origin**，再刪掉 `change-title` 分支 |

</div>
<div>

<Shot file="b05-04-continue-merge.png" desc="回 Desktop 按 Continue merge" />

<CliBox :cmds="['git add index.html', 'git commit']" note="標記已解決，完成合併 commit" />

</div>
</div>

<!--
回到 Desktop，對話框裡的 index.html 會顯示 No conflicts remaining，代表衝突都解完了。
按下 Continue merge，Desktop 會幫我們做一個合併用的 commit。
History 最上面多了一筆 Merge branch change-title。
跟上一章不一樣，這次兩邊都有新的 commit，所以 Git 多做了一個合併 commit，把兩條線接起來。
最後記得 Push，再把 change-title 分支刪掉。
用指令的話，解完衝突要先 `git add` 告訴 Git 這個檔案解決了，再 `git commit` 完成合併。
-->

---

# 解衝突四步驟

<div style="display:flex; align-items:center; justify-content:center; gap:0.5rem; margin-top:2rem; flex-wrap:wrap;">
  <div style="border:2px solid #d97706; border-radius:10px; padding:0.9rem 1rem; background:#fff8f0; text-align:center; min-width:150px;"><div style="font-weight:700; color:#92400e;">① 看清楚</div><div style="font-size:0.8rem; color:#78350f;">哪個檔案衝突？</div></div>
  <div style="color:#d97706; font-size:1.4rem;">→</div>
  <div style="border:2px solid #d97706; border-radius:10px; padding:0.9rem 1rem; background:#fff8f0; text-align:center; min-width:150px;"><div style="font-weight:700; color:#92400e;">② 打開</div><div style="font-size:0.8rem; color:#78350f;">Open in VS Code</div></div>
  <div style="color:#d97706; font-size:1.4rem;">→</div>
  <div style="border:2px solid #d97706; border-radius:10px; padding:0.9rem 1rem; background:#fff8f0; text-align:center; min-width:150px;"><div style="font-weight:700; color:#92400e;">③ 決定</div><div style="font-size:0.8rem; color:#78350f;">留哪個、刪標記、存檔</div></div>
  <div style="color:#d97706; font-size:1.4rem;">→</div>
  <div style="border:2px solid #d97706; border-radius:10px; padding:0.9rem 1rem; background:#fff8f0; text-align:center; min-width:150px;"><div style="font-weight:700; color:#92400e;">④ 完成</div><div style="font-size:0.8rem; color:#78350f;">Continue merge → Push</div></div>
</div>

<div class="mt-8 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>不確定要留哪個？</b> 不要亂選，先問改那一行的隊友。衝突真正要解決的是「兩個人的想法」，不只是文字。
</div>

<!--
我們把解衝突整理成四步。
第一步，看清楚是哪個檔案衝突。
第二步，用 VS Code 打開。
第三步，決定要留哪個，刪掉標記，存檔。
第四步，回 Desktop 按 Continue merge，再 Push。
最後提醒一件事：如果不確定要留哪個版本，不要隨便選，先問改那一行的隊友。
衝突背後其實是兩個人對同一件事有不同的想法，溝通比按按鈕更重要。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## Pull 時也會衝突

<!--
衝突不只發生在合併分支，Pull 的時候也會發生。
-->

---

# 動手做：GitHub 和本機都改了同一行

| # | 在哪裡 | 操作 | Commit Summary |
| --- | --- | --- | --- |
| 1 | **GitHub 網頁** | 打開 `index.html` → ✏️ 編輯，第 9 行改成 `<p>我正在學習 Git 和 GitHub。</p>` | `修改學習內容（網頁）` |
| 2 | **本機 main**（先別 Pull） | 第 9 行改成 `<p>我每天都在學習 Git。</p>` | `修改學習內容（本機）` |
| 3 | 本機 | **Fetch origin** → 按鈕變成 **Pull origin ↓1 ↑1** → 按下去 | — |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Pull ＝ 把 GitHub 的版本「合併」進你的本機，所以一樣可能衝突。
</div>

<!--
這次我們模擬：隊友改了 GitHub，我們忘了先 Pull，就在本機改了同一行。
第一步，在 GitHub 網頁上打開 index.html，按鉛筆圖示編輯，把第 9 行改成「我正在學習 Git 和 GitHub」，commit。
第二步，回到本機，先不要 Pull，把同一行改成「我每天都在學習 Git」，commit。
第三步，按 Fetch origin，按鈕會變成 Pull origin，旁邊同時有向下和向上的數字。
按下 Pull origin，就會跳出跟剛才一樣的衝突對話框。
因為 Pull 其實就是把 GitHub 的版本合併進本機，所以一樣可能衝突。
【講師】先在投影幕上示範 GitHub 網頁的鉛筆圖示在哪裡，初學者常找不到。
-->

---

# 解法完全一樣

<div class="grid grid-cols-2 gap-8 mt-2">
<div>

1. 衝突對話框 → **Open in Visual Studio Code**
2. 這次 **Current** 是你本機的版本，**Incoming** 是 GitHub 的版本
3. 決定內容、刪標記、存檔
4. **Continue merge**
5. **Push origin**，把解好的結果送上去

</div>
<div>

<div style="background:#fff8f0; border:2px solid #d97706; border-radius:12px; padding:1rem 1.2rem;">

**這次 History 會出現：**

`Merge branch 'main' of https://github.com/你的帳號/my-profile`

這是 Pull 時產生的合併 commit，正常現象。

</div>

</div>
</div>

<!--
解法跟剛才完全一樣。
打開 VS Code，這次 Current 是我們本機的版本，Incoming 是 GitHub 上的版本。
決定內容，刪掉標記，存檔，回 Desktop 按 Continue merge。
最後一定要 Push，把解好的結果送回 GitHub，不然隊友拿不到。
這次 History 會多一筆 Merge branch main of 加上網址，這是 Pull 時產生的合併 commit，是正常現象。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## 怎麼減少衝突

<!--
衝突解得掉，但能少一點更好。
-->

---

# 減少衝突的三個習慣

<div class="grid grid-cols-3 gap-6 mt-6">

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">🔄</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">開工先 Pull</div>
  <div style="font-size: 0.9rem; color: #78350f;">在最新的版本上改，衝突自然變少</div>
</div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">✂️</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">分支小、合併快</div>
  <div style="font-size: 0.9rem; color: #78350f;">一條分支只做一件事，別放好幾天</div>
</div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">
  <div style="font-size: 1.8rem; margin-bottom: 0.5rem;">💬</div>
  <div style="font-weight: 700; color: #92400e; margin-bottom: 0.4rem;">先講好誰改哪裡</div>
  <div style="font-size: 0.9rem; color: #78350f;">分工到不同檔案或不同區塊</div>
</div>

</div>

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 衝突沒辦法完全避免，也不需要害怕。會解衝突，就能放心跟別人協作。
</div>

<!--
有三個習慣可以減少衝突。
第一，開工先 Pull，在最新的版本上改。
第二，分支小、合併快，一條分支只做一件事，不要一放就好幾天，越久越容易跟別人撞在一起。
第三，事先講好誰改哪裡，分工到不同檔案或不同區塊。
不過衝突沒辦法完全避免，也不需要害怕。
會解衝突，就能放心地跟別人協作，這就是下一章的主題。
【講師】可以問大家，三個習慣裡哪一個在團隊裡最難做到，簡單交流一兩分鐘。
-->

---

# 檢查點 B5 ✅

<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align:left;">
<div>

在 **main** 打開 **History**，跟右邊比對（只看最上面 6 筆）：

1. ☐ 有**兩筆 Merge** commit
2. ☐ 用瀏覽器打開 `index.html`，**看不到** `<<<<<<<` 等符號
3. ☐ 上方沒有 ↑ ↓ 數字（已經 Push）
4. ☐ 分支清單只剩 **main**

</div>
<div>

<HistoryCheck :commits="[
  { text: 'Merge branch \'main\' of https://github.com/…', tag: 'Pull 衝突', highlight: true },
  { text: '修改學習內容（本機）', highlight: true },
  { text: '修改學習內容（網頁）', highlight: true },
  { text: 'Merge branch \'change-title\'', tag: '合併衝突', highlight: true },
  { text: '修改標題為大家好', highlight: true },
  { text: '修改標題為歡迎光臨', highlight: true },
  { text: '⋯ B4 以前的 7 筆', note: '新增技能區塊…Initial commit' },
]" />

</div>
</div>

<!--
我們來做這一章的檢查點。
History 最上面六筆都是這一章做的，其中有兩筆 Merge commit。
一筆是合併 change-title 時的衝突，一筆是 Pull 時的衝突。
用瀏覽器打開 index.html，確認網頁上看不到任何衝突標記。
最後確認上方沒有數字，代表都已經 Push，而且分支清單只剩 main。
History 的順序如果跟圖上有一點不一樣，只要六筆都在就沒問題。
【講師】給兩分鐘自我檢查，網頁上還看得到衝突標記的同學，個別協助刪除後再 commit 一次。
-->

---
layout: default
---

# 本章重點回顧

<div class="grid grid-cols-2 gap-8">
<div>

- **衝突**：兩邊改了同一行，Git 停下來問你
- **Current** = 你所在的分支，**Incoming** = 合併進來的
- 解法：**Open in VS Code → 決定 → 刪標記 → 存檔 → Continue merge**
- **Pull 也會衝突**，解法一樣，解完記得 Push
- 開工先 Pull、分支小、先分工，衝突就少

<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** B6 Pull Request — 請隊友幫你看過再合併

<Link to="ch06" style="color: #d97706; font-weight: 600;">前往 B6 →</Link>

</div>

</div>
<div>

| 本章 CLI 對照 | 意思 |
| --- | --- |
| `<<<<<<< HEAD` | Current 開始 |
| `=======` | 分隔線 |
| `>>>>>>> 分支名` | Incoming 結束 |
| `git add` | 標記衝突已解決 |
| `git commit` | 完成合併 |

</div>
</div>

<!--
我們回顧這一章的重點。
衝突是兩邊改了同一行，Git 停下來問我們。
Current 是我們所在的分支，Incoming 是合併進來的那一邊。
解法是用 VS Code 打開、做決定、刪標記、存檔，再回 Desktop 按 Continue merge。
Pull 也會衝突，解法一樣，解完一定要 Push。
到這裡，我們已經會處理協作時最麻煩的狀況了。
下一章，我們要兩人一組，用 Pull Request 正式協作。
【講師】下課前先請大家找好下一章的搭檔。
-->
