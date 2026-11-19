---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 總練習 兩人一組協作
routeAlias: ch07
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
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 初學者課程 · 總練習</p>
  <h1 style="color: #92400e; font-size: 3.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">兩人一組協作</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「角色互換，再撞一次衝突」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
恭喜大家走到最後的總練習。
這一節不教新東西，而是把整門課從頭到尾再走一遍。
這次角色互換，而且我們會故意讓 PR 發生一次衝突，練習在 PR 裡解衝突。
-->

---

# 這次角色互換

<div class="grid grid-cols-2 gap-8 mt-4">
<div style="background:#f0fdf4; border:2px solid #16a34a; border-radius:12px; padding:1.2rem;">

**B 當主人**

- 用 **B 自己的 my-profile**
- 邀請 A、Review、Merge

</div>
<div style="background:#eff6ff; border:2px solid #3b82f6; border-radius:12px; padding:1.2rem;">

**A 當隊友**

- Clone **B 的 my-profile**
- 開分支、寫推薦語、開 PR

</div>
</div>

<div class="mt-6 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>這次會故意衝突：</b> A 開 PR 之後，B 會在 main 上改到同一行。A 要在自己的分支上把衝突解掉，PR 才能合併。
</div>

<!--
這次換 B 當主人，用 B 自己的 my-profile。
A 當隊友，要 clone B 的專案，幫 B 寫推薦語。
跟第六章不一樣的是，這次會故意製造衝突：A 開了 PR 之後，B 會在 main 上改到同一行。
A 要在自己的分支上把衝突解掉，PR 才能合併。
【講師】請每組先確認誰是 A、誰是 B；人數是奇數時，由講師或助教搭配。
-->

---

# 練習步驟（一）：準備與開 PR

| # | 誰 | 操作 | 參考 |
| --- | --- | --- | --- |
| 1 | **B** | Settings → Collaborators → 邀請 A | B6 |
| 2 | **A** | 接受邀請 → Clone **B 的** my-profile（資料夾改名） | B6 |
| 3 | **A** | Pull → New branch `add-recommendation` | B4 |
| 4 | **A** | 在「聯絡我」**上面**加入 `<h2>朋友推薦</h2>` 和一段推薦語 → Commit | B2 |
| 5 | **A** | Publish branch → Create Pull Request → 送出 | B6 |

<!--
第一部分的步驟，大家應該都很熟了，表格最右邊標了可以回去翻的章節。
B 先邀請 A 成為協作者。
A 接受邀請，clone B 的 my-profile，記得資料夾要改名。
A 開一條 add-recommendation 分支，在聯絡我的上面加上推薦語，commit。
最後 publish branch，開 PR。
到這裡跟第六章一模一樣，只是角色反過來。
【講師】給大家十分鐘完成前五步，卡住的組別先翻表格右邊標的章節。
-->

---

# 練習步驟（二）：製造衝突

| # | 誰 | 操作 |
| --- | --- | --- |
| 6 | **B** | **先不要合併 PR**。在自己電腦的 main 上，把「聯絡我」那一行改成 `<p>歡迎來信：b@example.com</p>` → Commit → **Push** |
| 7 | **B** | 回到 GitHub 的 PR 頁面，出現 **This branch has conflicts that must be resolved** |

<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align:left; margin-top: 0.5rem;">
<div>

**為什麼會衝突？**

A 在「聯絡我」上面插入新內容，B 改了「聯絡我」這一行，兩邊動到**同一個位置**。

</div>
<div>

<Shot file="b07-01-pr-conflict.png" desc="PR 顯示 This branch has conflicts" />

</div>
</div>

<!--
接著製造衝突。
B 先不要合併 PR，在自己電腦的 main 上，把聯絡我那一行改掉，commit 並 Push。
回到 GitHub 的 PR 頁面重新整理，原本綠色的 Merge 按鈕會變成灰色，上面寫著 This branch has conflicts that must be resolved。
為什麼會衝突？
A 在聯絡我的上面插入了新的內容，B 剛好改了聯絡我那一行，兩邊動到同一個位置，Git 不知道怎麼排。
【講師】PR 頁面沒出現衝突訊息的組別，先確認 B 已經 Push，再重新整理頁面。
-->

---

# 練習步驟（三）：A 在分支上解衝突

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | A 的操作（Desktop） |
| --- | --- |
| 8 | 先切到 **main** → **Fetch → Pull**（拿到 B 的修改） |
| 9 | 再切回 **add-recommendation** |
| 10 | 選單 Branch → **Update from main** |
| 11 | 跳出衝突 → **Open in VS Code** → 兩邊都留 → 刪標記 → 存檔 |
| 12 | **Continue merge** → **Push origin** |

</div>
<div>

<Shot file="b07-02-update-from-main.png" desc="Branch → Update from main" />

<CliBox :cmds="['git merge origin/main', 'git push']" note="把最新的 main 合併進自己的分支" />

</div>
</div>

<!--
衝突要由開 PR 的 A 來解。
A 先切到 main，Fetch、Pull，把 B 剛推上去的修改拿回來。
再切回 add-recommendation，從選單 Branch 選 Update from main，意思是把最新的 main 合併進自己的分支。
這時候就會跳出第五章看過的衝突對話框。
用 VS Code 打開，這次推薦語和新的聯絡方式兩邊都要留，刪掉標記，存檔。
回 Desktop 按 Continue merge，再 Push origin。
【講師】這一步最容易卡住，巡視確認 A 是站在 add-recommendation 上按 Update from main，而不是在 main 上。
-->

---

# 練習步驟（四）：合併與收尾

| # | 誰 | 操作 |
| --- | --- | --- |
| 13 | **B** | 重新整理 PR 頁面：衝突消失，出現 **Merge pull request** |
| 14 | **B** | Files changed 看一下 → Approve → Merge → Delete branch |
| 15 | **A、B** | 兩人都切回 main → Fetch → Pull |
| 16 | **A** | 刪掉本機的 `add-recommendation` |

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 A 推上去之後，<b>PR 會自動更新</b>，不用重開。Files changed 裡也會看到 A 解衝突的結果。
</div>

<!--
A 推上去之後，B 重新整理 PR 頁面，衝突的訊息不見了，綠色的 Merge pull request 又出現了。
PR 會自動更新，不需要關掉重開。
B 照第六章的流程 review、merge、刪除分支。
最後兩人都切回 main，Fetch、Pull，A 再把本機的分支刪掉。
【講師】提早完成的組別，可以用 A 的 my-profile 再交換角色練一輪。
-->

---

# 最後檢查 ✅

<div class="grid grid-cols-2 gap-8 mt-2">
<div>

**B 的 my-profile（main 的 History）：**

1. ☐ 最上面是 `Merge pull request #1 from B的帳號/add-recommendation`
2. ☐ 看得到 A 解衝突時留下的 `Merge branch 'main' into add-recommendation`
3. ☐ 網頁上推薦語和新的聯絡方式**都在**，沒有衝突標記

</div>
<div>

**這門課你學會了：**

- ☑ 建立 repository、Commit
- ☑ Publish / Push / Pull / Clone
- ☑ 開分支、合併
- ☑ 用 VS Code 解衝突
- ☑ 邀請協作者、開 PR、Review、Merge

</div>
</div>

<!--
最後檢查一下 B 的 my-profile。
History 最上面是 A 開的 PR 合併 commit，訊息裡的帳號是 repo 主人 B，跟第六章一樣。
往下可以看到 A 解衝突時留下的 Merge branch main into add-recommendation。
打開網頁，推薦語和新的聯絡方式都在，沒有任何衝突標記。
到這裡，課程一開始的目標都完成了：建立 repo、commit、push、pull、開分支、合併、解衝突、開 PR。
大家現在已經可以獨立用 Git 和 GitHub 跟別人協作了。
附錄整理了幾個後悔藥，還有一張可以印出來的指令小抄。
【講師】可以請一兩組分享解衝突時遇到的狀況，再進入附錄。
-->
