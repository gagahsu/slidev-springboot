---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: B4 開分支
routeAlias: ch04
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
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 初學者課程 · B4</p>
  <h1 style="color: #92400e; font-size: 3.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">開分支</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「在草稿本上試，滿意了再抄回正本」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第四章，開分支。
上半天我們學會了一個人用 Git 和 GitHub。
下半天要開始學協作，而協作的基礎就是分支。
這一章先一個人練習：開一條分支、在上面改東西、再合併回主線。
-->

---
layout: default
---

# 回顧 B3，這一章我們會做到

<div class="grid grid-cols-2 gap-8 mt-2">
<div style="background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px; padding: 1rem;">

**回顧**

- 本機和 GitHub 各有一份
- Push ↑ 送上去，Pull ↓ 拿回來
- 開工 Pull，收工 Push

</div>
<div>

**這一章**

- **Part 1** 為什麼需要分支
- **Part 2** 建立分支、切換分支
- **Part 3** 把分支合併回 main
- **Part 4** 刪除用完的分支

</div>
</div>

<!--
先回顧上一章：本機和 GitHub 各有一份，Push 送上去，Pull 拿回來，每天開工 Pull、收工 Push。
這一章分四個部分：為什麼需要分支、怎麼建立和切換分支、怎麼合併回主線，最後把用完的分支刪掉。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 為什麼需要分支

<!--
先來看，沒有分支的話會遇到什麼麻煩。
-->

---

# 草稿本和正本

<div class="grid grid-cols-2 gap-8 mt-2">
<div>

**沒有分支的時候：**

- 想試一個新版面，改到一半，網頁整個跑版
- 這時候老師說「先把錯字修好交上來」
- 但 main 上的東西已經被改壞了 😱

</div>
<div>

**有分支的時候：**

- **main** 是正本，永遠保持可以展示的狀態
- 想試新東西，就**開一條分支**當草稿本
- 草稿本改壞了，正本完全不受影響
- 滿意了，再**合併**回正本

</div>
</div>

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 開分支 ＝ 從目前的存檔複製一份出來，在上面繼續做，不會影響原本那條。
</div>

<!--
想像我們想幫網頁試一個新版面，改到一半，網頁整個跑版了。
這時候老師說，先把錯字修好交上來。
但 main 上的東西已經被我們改壞了，很難交。
分支就是用來解決這個問題的。
main 是正本，永遠保持可以展示的狀態。
想試新東西，就開一條分支當草稿本，在草稿本上怎麼改都不會影響正本。
滿意了，再把草稿本的內容合併回正本。
【講師】可以先問大家，有沒有作業改到一半、想回到前一版卻回不去的經驗。
-->

---

# 分支長什麼樣子？

<div style="background:#fff8f0; border:2px solid #d97706; border-radius:12px; padding:0.8rem 1rem; margin-top:0.5rem;">
<svg viewBox="0 0 760 150" style="width:100%; height:auto; display:block;" font-family="ui-sans-serif, system-ui, sans-serif">
  <text x="10" y="44" style="font-size:16px" font-weight="700" fill="#92400e">main</text>
  <text x="10" y="114" style="font-size:16px" font-weight="700" fill="#16a34a">add-skills</text>
  <line x1="110" y1="40" x2="720" y2="40" stroke="#d97706" stroke-width="4"/>
  <path d="M 290 40 C 330 40, 330 110, 370 110 L 520 110 C 560 110, 560 40, 600 40" fill="none" stroke="#16a34a" stroke-width="4"/>
  <g fill="#d97706"><circle cx="130" cy="40" r="10"/><circle cx="210" cy="40" r="10"/><circle cx="290" cy="40" r="10"/><circle cx="600" cy="40" r="12" stroke="#16a34a" stroke-width="3"/></g>
  <g fill="#16a34a"><circle cx="400" cy="110" r="10"/><circle cx="490" cy="110" r="10"/></g>
  <g fill="#78350f" style="font-size:14px">
    <text x="300" y="80">① 分出去</text>
    <text x="395" y="140">② 在分支上 commit</text>
    <text x="575" y="80">③ 合併回來</text>
  </g>
</svg>
</div>

<br>

| 名詞 | 意思 |
| --- | --- |
| **main** | 預設的主線分支，放正式版 |
| **分支（branch）** | 從某個存檔分出去的另一條線 |
| **合併（merge）** | 把分支上的 commit 接回另一條分支 |

<!--
我們把分支畫出來看。
上面這條是 main，一路往前存檔。
在某個存檔點，我們分出一條 add-skills 分支，在上面做了兩個 commit。
這段時間裡，main 完全不會被影響。
最後把 add-skills 合併回 main，main 就擁有了這兩個 commit 的內容。
這一章要練習的，就是這三個動作：分出去、在分支上 commit、合併回來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 建立分支、切換分支

<!--
接下來實際開一條分支。
-->

---

# Current branch → New branch

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 先確認目前在 **main**，而且已經 Pull 過 |
| 2 | 點上方 **Current branch** |
| 3 | 按 **New branch** |
| 4 | Name 填 `add-skills` → **Create branch** |

</div>
<div>

<Shot file="b04-01-new-branch.png" desc="Current branch → New branch" />

<CliBox :cmds="['git switch -c add-skills']" note="建立分支並切換過去" />

</div>
</div>

<!--
開分支之前，先確認兩件事：目前在 main，而且已經 Pull 過，這樣分支才是從最新的版本分出去。
點上方的 Current branch，按 New branch。
Name 填 add-skills，分支名稱用英文小寫、單字之間用減號連接。
對話框下面寫著，新分支會從目前所在的分支分出去，所以第一步一定要先確認自己在 main。按 Create branch。
建好之後，上方的 Current branch 就會顯示 add-skills，代表我們已經在這條分支上了。
對應的指令是 `git switch -c`。
【講師】巡視確認每位同學上方的 Current branch 都顯示 add-skills，再進下一步。
-->

---

# 分支名稱怎麼取？

| ✅ 好的名稱 | ❌ 不好的名稱 | 原因 |
| --- | --- | --- |
| `add-skills` | `test` | 看不出要做什麼 |
| `fix-title-typo` | `小明的分支` | 中文和空白在指令列容易出問題 |
| `update-contact` | `new branch 2` | 有空白、沒意義 |

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>原則：</b> 英文小寫、用 <code>-</code> 連接、一看就知道這條分支要做什麼。
</div>

<!--
分支名稱很重要，因為團隊裡大家都會看到。
好的名稱，像 add-skills、fix-title-typo，一看就知道這條分支要做什麼。
test、new branch 2 這種名稱，過幾天連自己都忘了是什麼。
另外不要用中文和空白，在指令列或其他工具裡容易出問題。
原則是英文小寫、用減號連接、一看就懂。
-->

---

# 動手做：在分支上新增技能區塊

確認上方顯示 **Current branch: add-skills**，在興趣清單下面加入：

```html {3-7}
    <li>看電影</li>
  </ul>
  <h2>我的技能</h2>
  <ul>
    <li>HTML</li>
    <li>Git</li>
  </ul>
  <p>聯絡我：wang@example.com</p>
```

回到 Desktop：打勾 → Summary 填 **`新增技能區塊`** → 按 **Commit to add-skills**

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 注意按鈕上寫的是 <b>add-skills</b>，代表這個存檔只會存在這條分支上。
</div>

<!--
先確認上方的 Current branch 顯示 add-skills。
在興趣清單下面，加入一個「我的技能」區塊，存檔。
回到 Desktop，打勾，Summary 填「新增技能區塊」。
注意看 Commit 按鈕，上面寫的是 add-skills，不是 main。
這代表這個存檔只會存在 add-skills 這條分支上，main 完全不會被影響。
【講師】給大家三分鐘完成，巡視時特別看 Commit 按鈕寫的是不是 add-skills。
-->

---

# 切換分支：檔案會跟著變

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 點 **Current branch**，在清單選 **main** |
| 2 | 用瀏覽器打開 `index.html`：**沒有**技能區塊 |
| 3 | 再切回 **add-skills**，重新整理：技能區塊**回來了** |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>切換前先 commit。</b> 有還沒 commit 的修改時，Desktop 會問你要把修改留在原分支，還是帶到新分支，新手容易選錯。
</div>

</div>
<div>

<Shot file="b04-02-branch-list.png" desc="分支下拉清單" />

<CliBox :cmds="['git switch main']" note="切換到 main 分支" />

</div>
</div>

<!--
現在來體驗一下分支的效果。
點 Current branch，在清單裡選 main。
用瀏覽器打開 index.html，會發現技能區塊不見了。
不用緊張，它沒有消失，只是留在 add-skills 分支上。
再切回 add-skills，重新整理瀏覽器，技能區塊又回來了。
切換分支時，Git 會把資料夾裡的檔案換成那條分支的版本。
所以切換之前，記得先把修改 commit 掉，不然 Desktop 會問我們修改要留在哪裡，新手很容易選錯。
對應的指令是 `git switch`。
【講師】可以在投影幕上來回切換兩條分支，讓大家看瀏覽器重新整理後技能區塊消失又出現。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## 把分支合併回 main

<!--
技能區塊做好了，我們要把它合併回 main，變成正式版的一部分。
-->

---

# Branch → Merge into current branch

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | **先切回 main**（要合併「進」哪條，就站在哪條） |
| 2 | 選單 Branch → **Merge into current branch** |
| 3 | 在清單選 **add-skills** |
| 4 | 確認寫著 *This will merge 1 commit…*，按 **Create a merge commit** |

</div>
<div>

<Shot file="b04-03-merge-into-current.png" desc="Branch → Merge into current branch 對話框" />

<CliBox :cmds="['git switch main', 'git merge add-skills']" />

</div>
</div>

<!--
合併有一個一定要記住的規則：要合併進哪一條，就先站在哪一條。
我們要把 add-skills 合併進 main，所以第一步是先切回 main。
接著從選單 Branch 選 Merge into current branch，current branch 指的就是目前所在的 main。
在清單裡選 add-skills，對話框下方會顯示 This will merge 1 commit from add-skills into main，代表這次會合併一個 commit。按下 Create a merge commit。
上方會出現綠色的 Successfully merged，代表合併成功。
對應的指令是先 `git switch main`，再 `git merge add-skills`。
【講師】最常見的錯誤是站在 add-skills 上合併，按 Merge 之前先確認大家都切回 main。
-->

---

# 合併完成：main 拿到了技能區塊

<div class="grid grid-cols-2 gap-8 mt-2">
<div>

- 用瀏覽器打開 `index.html`：main 上**也有**技能區塊了
- History 最上面出現 **新增技能區塊**
- 上方按鈕變成 **Push origin ↑1** → 記得 Push

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 這次 main 在分支期間沒有新的 commit，Git 只要把 main 往前移就好，所以 History 看起來是一直線。
</div>

</div>
<div>

<div style="background:#fff8f0; border:2px solid #d97706; border-radius:12px; padding:0.8rem 1rem;">
<svg viewBox="0 0 360 230" style="width:100%; height:auto; display:block;" font-family="ui-sans-serif, system-ui, sans-serif">
  <text x="0" y="18" style="font-size:15px" font-weight="700" fill="#92400e">合併前</text>
  <text x="0" y="56" style="font-size:13px" fill="#92400e">main</text>
  <text x="0" y="96" style="font-size:13px" fill="#16a34a">add-skills</text>
  <line x1="90" y1="52" x2="180" y2="52" stroke="#d97706" stroke-width="4"/>
  <path d="M 180 52 C 205 52, 205 92, 230 92 L 270 92" fill="none" stroke="#16a34a" stroke-width="4"/>
  <circle cx="100" cy="52" r="8" fill="#d97706"/><circle cx="180" cy="52" r="8" fill="#d97706"/><circle cx="270" cy="92" r="8" fill="#16a34a"/>
  <text x="0" y="148" style="font-size:15px" font-weight="700" fill="#92400e">合併後</text>
  <text x="0" y="186" style="font-size:13px" fill="#92400e">main</text>
  <line x1="90" y1="182" x2="270" y2="182" stroke="#d97706" stroke-width="4"/>
  <circle cx="100" cy="182" r="8" fill="#d97706"/><circle cx="180" cy="182" r="8" fill="#d97706"/><circle cx="270" cy="182" r="8" fill="#16a34a"/>
  <text x="90" y="220" style="font-size:12px" fill="#78350f">main 直接往前移到分支的位置</text>
</svg>
</div>

</div>
</div>

<!--
合併完成之後，用瀏覽器打開 index.html，main 上也有技能區塊了。
History 最上面多了「新增技能區塊」這個 commit。
上方按鈕變成 Push origin，記得按下去，把合併後的 main 送上 GitHub。
這裡補充一下右邊的圖。
因為這段時間 main 沒有新的 commit，Git 只要把 main 往前移到分支的位置就好，這叫做快轉合併。
所以 History 看起來是一直線，好像從來沒開過分支。
如果兩邊都有新的 commit，Git 就會多做一個合併用的 commit，下一章會看到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## 刪除用完的分支

<!--
最後，合併完的分支就可以刪掉了。
-->

---

# Branch → Delete

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 切到要刪的分支 **add-skills** |
| 2 | 選單 Branch → **Delete** |
| 3 | 確認名稱沒錯，按左邊的 **Delete**（預設反白的是 Cancel） |
| 4 | Desktop 自動回到 main |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>放心刪：</b> 已經合併的 commit 都在 main 上了，刪掉的只是「草稿本」這個名字。
</div>

</div>
<div>

<Shot file="b04-04-delete-branch.png" desc="刪除分支確認" />

<CliBox :cmds="['git branch -d add-skills']" note="刪除已經合併的分支" />

</div>
</div>

<!--
合併完的分支，就可以刪掉了。
切到 add-skills，從選單 Branch 選 Delete，確認名稱沒錯，按 Delete。
刪掉之後，Desktop 會自動回到 main。
大家可能會擔心，刪了分支，裡面的東西會不會不見？
不會，因為已經合併進 main 了，commit 都在 main 上，刪掉的只是 add-skills 這個名字而已。
養成用完就刪的習慣，分支清單才不會越來越亂。
對應的指令是 `git branch -d`。
【講師】提醒對話框預設反白的是 Cancel，直接按 Enter 不會刪除。
-->

---

# 一條分支的一生

<div style="display:flex; align-items:center; justify-content:center; gap:0.5rem; margin-top:2rem; flex-wrap:wrap;">
  <div style="border:2px solid #d97706; border-radius:10px; padding:0.8rem 1rem; background:#fff8f0; text-align:center; min-width:120px;"><div style="font-weight:700; color:#92400e;">① 建立</div><div style="font-size:0.8rem; color:#78350f;">New branch</div></div>
  <div style="color:#d97706; font-size:1.4rem;">→</div>
  <div style="border:2px solid #d97706; border-radius:10px; padding:0.8rem 1rem; background:#fff8f0; text-align:center; min-width:120px;"><div style="font-weight:700; color:#92400e;">② 開發</div><div style="font-size:0.8rem; color:#78350f;">改檔案、Commit</div></div>
  <div style="color:#d97706; font-size:1.4rem;">→</div>
  <div style="border:2px solid #d97706; border-radius:10px; padding:0.8rem 1rem; background:#fff8f0; text-align:center; min-width:120px;"><div style="font-weight:700; color:#92400e;">③ 合併</div><div style="font-size:0.8rem; color:#78350f;">切回 main → Merge</div></div>
  <div style="color:#d97706; font-size:1.4rem;">→</div>
  <div style="border:2px solid #d97706; border-radius:10px; padding:0.8rem 1rem; background:#fff8f0; text-align:center; min-width:120px;"><div style="font-weight:700; color:#92400e;">④ 推送</div><div style="font-size:0.8rem; color:#78350f;">Push origin</div></div>
  <div style="color:#d97706; font-size:1.4rem;">→</div>
  <div style="border:2px solid #d97706; border-radius:10px; padding:0.8rem 1rem; background:#fff8f0; text-align:center; min-width:120px;"><div style="font-weight:700; color:#92400e;">⑤ 刪除</div><div style="font-size:0.8rem; color:#78350f;">Branch → Delete</div></div>
</div>

<div class="mt-8 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一條分支只做一件事。</b> 做完就合併、刪掉，下一件事再開新的分支。
</div>

<!--
我們把一條分支的一生串起來。
建立、在上面開發和 commit、切回 main 合併、Push、最後刪掉。
一條分支只做一件事，做完就合併、刪除，下一件事再開新的分支。
這個節奏熟了之後，第六章的 Pull Request，其實就是在第三步合併之前，多了一個請隊友檢查的步驟。
-->

---

# 檢查點 B4 ✅

<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align:left;">
<div>

在 **main** 打開 **History**，跟右邊比對：

1. ☐ Current branch 是 **main**
2. ☐ 最上面是 `新增技能區塊`
3. ☐ 分支清單裡**只剩 main**
4. ☐ 上方是 **Fetch origin**，沒有 ↑ 數字（已經 Push）

</div>
<div>

<HistoryCheck :commits="[
  { text: '新增技能區塊', note: '在 add-skills 做的', highlight: true },
  '新增 README',
  '新增聯絡方式',
  '忽略個人筆記 notes.txt',
  '新增興趣清單',
  '新增自我介紹頁面',
  { text: 'Initial commit', note: 'Desktop 自動建立' },
]" />

</div>
</div>

<!--
我們來做這一章的檢查點。
確認目前在 main，History 最上面是「新增技能區塊」，這是在 add-skills 上做的，合併後就到了 main。
分支清單裡應該只剩 main，因為 add-skills 已經刪掉了。
最後確認上方沒有向上的數字，代表合併後的結果已經 Push 到 GitHub。
【講師】給兩分鐘自我檢查，四項都打勾的同學舉手，沒完成的個別協助。
-->

---
layout: default
---

# 本章重點回顧

<div class="grid grid-cols-2 gap-8">
<div>

- **main 是正本**，新功能開**分支**當草稿本
- **New branch**：從 main 分出去
- 切換分支，**檔案會跟著變**；切換前先 commit
- **合併**：先切回 main → Merge into current branch
- 合併後記得 **Push**，用完的分支 **Delete**

<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** B5 解衝突 — 兩邊都改了同一行，怎麼辦？

<Link to="ch05" style="color: #d97706; font-weight: 600;">前往 B5 →</Link>

</div>

</div>
<div>

| 本章 CLI 對照 | 意思 |
| --- | --- |
| `git switch -c` | 建立並切換分支 |
| `git switch` | 切換分支 |
| `git merge` | 合併分支 |
| `git branch -d` | 刪除分支 |

</div>
</div>

<!--
我們回顧這一章的重點。
main 是正本，新功能就開分支當草稿本。
切換分支時，檔案會跟著變，所以切換前要先 commit。
合併時要先切回 main，再用 Merge into current branch。
合併完記得 Push，用完的分支刪掉。
這一章的合併很順利，因為只有一邊有改動。
下一章，我們要故意讓兩邊都改到同一行，看看會發生什麼事。
【講師】開放兩三分鐘問答，再進入下一章。
-->
