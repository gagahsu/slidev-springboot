---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: 使用分支
routeAlias: ch13
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
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">使用分支</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">「讓開發脈絡清晰，讓協作更加順暢」</p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十三章，使用分支。
分支可以說是 Git 最讓人驚艷的功能。
很多人從其他版本控制工具換過來，第一個愛上的就是它。
這章我們會從「為什麼需要分支」開始，一路學到建立、切換和合併。
學完之後，我們就能讓多條開發線同時進行，遇到衝突或刪錯分支也知道怎麼處理。
-->

---
layout: default
---

# Outline

- **為什麼要使用分支？** — 分支的用途與使用時機
- **開始使用分支** — git branch / git checkout / git switch
- **合併分支** — git merge / fast-forward / 3-way merge
- **【狀況題】合併發生衝突了** — 衝突標記與解決流程
- **【狀況題】分支沒有小耳朵** — fast-forward 與 --no-ff
- **【常見問題】合併過的分支要留著嗎？** — 刪除與清理策略
- **【狀況題】不小心砍掉未合併的分支** — git reflog 救援

<!--
這章的前三個主題是核心操作：為什麼要用分支、怎麼建立和切換，以及怎麼合併。
接著馬上處理合併最常遇到的問題，也就是衝突。
後面幾個是實際開發中很常見的情境。
包括 log 圖上為什麼沒有分叉、合併完的分支要不要刪，還有刪錯分支怎麼救。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 為什麼要使用分支？

<!--
我們從最根本的問題開始：分支到底解決了什麼？
-->

---

# 沒有分支的世界

沒有分支時，所有人都在同一條線上工作：

```text
A --- B --- C --- D --- E  (main)
      ↑           ↑
   你在做功能    同事提交了修改，打亂你的進度
```

常見的問題：

- 你正在開發新功能，寫了一半，突然需要緊急修 bug
- 你把實驗性的程式碼 commit 進去，搞壞了主線
- 兩個人同時修改同一個檔案，提交互相覆蓋
- 想回到「昨天還能動的版本」，但找不到乾淨的節點

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**核心問題：** 主線開發與實驗性開發混在一起，隨時都可能互相干擾。

</div>

<!--
想像一下，我們正在寫一個新功能，寫到一半，突然有個嚴重的 bug 要馬上修。
寫到一半的程式還不能提交，但又必須切換去修 bug。
如果所有人都在同一條線上工作，這種情境就很難處理。
右邊還列了其他常見的問題。
實驗性的程式碼一 commit，就可能搞壞主線。
兩個人同時改同一個檔案，提交時互相覆蓋。
想回到昨天還能動的版本，卻找不到一個乾淨的節點。
核心問題只有一個：主線開發和實驗性的開發混在一起，隨時可能互相干擾。
-->

---

# 分支的用途與使用時機

有了分支，每條線可以獨立發展：

```text
          feature/login
         /               \
A --- B --- C --- D --- E --- F  (main)
              \
               hotfix/bug-123
```

<!--
有了分支之後，每一條線都可以獨立發展。
看這張圖，main 是主線。
從 B 長出了 feature/login 分支，開發完之後，再合併回 main。
從 C 又長出了一條 hotfix 分支，專門用來修 bug。
這幾條線同時存在，但彼此不會干擾。
就像同時開好幾個平行的時間線，各自前進，需要的時候再匯合。
-->

---

# 分支的常見使用情境

| 情境 | 說明 |
|------|------|
| 開發新功能 | 在獨立分支開發，完成後再合併回主線 |
| 修復 bug | 從穩定版本長出 hotfix 分支，修完合回去 |
| 實驗性嘗試 | 想試試新技術或架構，不影響主線 |
| 多人協作 | 每個人在自己的分支開發，減少衝突 |
| 版本發布 | 維護多個版本（v1.x、v2.x）各自的分支 |

<!--
這張表整理了分支的常見使用情境。
開發新功能時，在獨立的分支上做，完成後再合併回主線。
修 bug 時，從穩定的版本長出一條 hotfix 分支，修好再合回去。
想試試新技術，也可以開一條實驗分支，失敗了直接丟掉，不影響主線。
多人協作時，每個人在自己的分支上開發。
需要同時維護好幾個版本時，也可以各開一條分支。
所以不管是哪一種開發流程，都是以分支作為基礎。
-->

---

# 分支讓多人協作不互相干擾

**沒有分支的協作：**

```text
Alice: A --- B --- C
                    ↑ 常常踩到 Bob 的修改
Bob:            D --- E --- (conflict!)
```

**有分支的協作：**

```text
Alice: --- feature/payment ---→ merge
      /                          \
main ------------------------------- main
      \                          /
Bob:   --- feature/checkout ---→ merge
```

每個人在自己的分支開發，完成後才合併，**衝突集中在合併時處理**，而不是隨時都在搶。

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**協作原則：** 分支不代表沒有衝突，而是讓衝突在**可控的時間點**發生，而不是隨機干擾開發節奏。

</div>

<!--
我們看分支對多人協作的影響。
上面是沒有分支的情況，Alice 和 Bob 都在同一條線上提交，常常踩到對方的修改。
下面是有分支的情況，兩個人各自在自己的分支上開發，完成之後才合併回 main。
要注意的是，有了分支，不代表就沒有衝突。
而是讓衝突集中在合併的時候處理，變得可預測、可管理。
而不是在開發過程中隨時跳出來打亂節奏。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 開始使用分支

<!--
了解了為什麼需要分支，接下來看實際的操作指令。
-->

---

# 查看分支

**查看所有分支：**

```bash
git branch          # 列出本地分支
git branch -a       # 列出本地 + 遠端分支
git branch -v       # 列出分支並顯示最新 commit
```

輸出範例：

```text
* main              a1b2c3d 初始 commit
  feature/login     d4e5f6g 新增登入頁面
  hotfix/bug-123    h7i8j9k 修正驗證邏輯
```

<!--
先看怎麼查看分支。
`git branch` 列出本機的分支，加上 `-a`，會連遠端的分支一起列出來。
加上 `-v`，還會顯示每個分支最新的 commit。
看下面的輸出，前面有星號的，就是目前所在的分支。
每個分支後面跟著它指向的 commit 編號和訊息。
`-v` 特別好用，不用另外查 log，就能看出每個分支現在走到哪裡。
-->

---

# 建立分支

**建立新分支：**

```bash
git branch feature/payment    # 建立分支（停在目前位置，不切換）
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**注意：** `git branch <name>` 只是建立分支，不會自動切換過去。`*` 號代表目前所在的分支。

</div>

<!--
建立分支的指令是 `git branch`，後面接上新分支的名稱。
這裡要注意一個初學者很常犯的錯。
`git branch` 只是建立分支，並不會自動切換過去。
執行之後，我們還是停在原本的分支上。
用 `git branch` 列出來看，星號還在原本的分支前面。
想切換過去，要再下一個指令。
-->

---

# 切換分支

**兩種切換方式（擇一即可）：**

```bash
# 舊語法（Git 2.23 以前常用）
git checkout feature/login

# 新語法（Git 2.23+ 推薦）
git switch feature/login
```

**建立並立即切換（最常用）：**

```bash
# 舊語法
git checkout -b feature/payment

# 新語法
git switch -c feature/payment
```

切換後，工作目錄的檔案會自動變成該分支的狀態。

<!--
切換分支有兩種寫法。
舊的寫法是 `git checkout`，新的寫法是 `git switch`。
Git 2.23 把 checkout 的功能拆成兩個指令。
`git switch` 專門切換分支，`git restore` 專門還原檔案，語意清楚很多。
最常用的其實是「建立並且立刻切換」。
舊寫法是 `git checkout -b`，新寫法是 `git switch -c`。
切換之後，工作目錄裡的檔案，會自動變成那個分支的內容。
-->

---

# 切換分支：使用建議

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**建議：** 新專案或新版 Git 使用 `git switch`，語意更清楚。`git checkout` 功能太多（切分支、還原檔案都是它），容易混淆。

</div>

| 指令 | 用途 |
|------|------|
| `git switch <branch>` | 切換到既有分支 |
| `git switch -c <branch>` | 建立並切換（最常用） |
| `git checkout <branch>` | 舊語法，同 switch |
| `git checkout -b <branch>` | 舊語法，同 switch -c |

<!--
我們的建議是，優先使用 `git switch`。
`git checkout` 能做的事情太多，切分支是它、還原檔案也是它，很容易搞混。
這張表整理了新舊寫法的對照。
其中 `git switch -c`，建立並切換，是每次開新功能都會用到的指令。
分支的生命週期，通常是建立、開發、合併，最後刪除。
刪除的部分，我們留到後面再一起講。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 合併分支

<!--
分支開發完成之後，要把改動合併回去。Git 的合併有兩種主要模式，我們一起來看。
-->

---

# git merge 基本用法

**合併的基本語法：**

```bash
git switch main             # 先切換到要被合入的分支
git merge feature/login     # 把 feature/login 合併進來
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**重點：** 合併時永遠是「切換到目標分支，再 merge 來源分支」。

</div>

<!--
合併的指令是 `git merge`。
合併的方向很容易搞混，我們記住一個原則：現在在哪個分支，就是把別人合進來。
所以要把 feature/login 合進 main，就要先 `git switch main`，切換到 main。
再執行 `git merge feature/login`，把它合併進來。
永遠是先切到目標分支，再合併來源分支。
-->

---

# git merge 基本用法：確認結果

**查看合併後的歷史：**

```bash
git log --oneline --graph --all
```

輸出範例：

```text
*   a1b2c3d (HEAD -> main) Merge branch 'feature/login'
|\
| * d4e5f6g (feature/login) 新增登入表單驗證
| * e5f6g7h 新增登入頁面 HTML
|/
* b2c3d4e 初始化專案
```

<!--
合併之後，要怎麼確認結果呢？
我們用 `git log --oneline --graph --all`，畫出分支圖來看。
最上面是一個合併用的 commit，訊息寫著 Merge branch feature/login。
往下可以看到，feature/login 上的兩個 commit 從旁邊分出去，再接回來。
養成合併後用這個指令確認的習慣，對分支結構的掌握會好很多。
-->

---

# Fast-forward Merge

當分支之間**沒有分歧**時（main 沒有新的 commit），Git 會使用 fast-forward：

```text
合併前：
main:    A --- B
                \
feature:         C --- D

合併後（fast-forward）：
main:    A --- B --- C --- D
                           ↑ (HEAD, main, feature)
```

```bash
git switch main
git merge feature/login
# 輸出：Updating b2c3d4e..d4e5f6g
# Fast-forward
```

<!--
第一種合併模式叫做 fast-forward，快轉合併。
想像一下，我們開了一個分支去開發。
這段時間裡，main 上面什麼事都沒發生，沒有新的 commit。
看上面的圖，main 停在 B，feature 從 B 往前長出了 C 和 D。
這時候合併，Git 只需要把 main 的指標，往前移到 D 就好。
不需要做任何額外的合併動作。
執行後會看到 Fast-forward 這個字，代表用的就是這種模式。
-->

---

# Fast-forward Merge：特性

**Fast-forward 的特性：**

- 不會產生新的合併 commit
- 歷史線是線性的，看起來像從來沒有分支過
- 如果不想要線性歷史，可以加 `--no-ff`

```bash
# 強制產生合併 commit（保留分支歷史）
git merge --no-ff feature/login
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**何時用 --no-ff：** 希望從 log 圖上清楚看出這個功能是在獨立分支開發的，尤其適合團隊協作。

</div>

<!--
fast-forward 有幾個特性。
它不會產生新的合併 commit，歷史是一直線，看起來就像從來沒有開過分支。
這樣很乾淨，但也看不出來曾經有一個分支。
如果希望保留這個痕跡，可以在合併時加上 `--no-ff`。
它會強制產生一個合併 commit，即使原本可以快轉。
團隊協作時，很多人會用這個方式，讓 log 圖上清楚看出每個功能是在獨立分支開發的。
-->

---

# 3-Way Merge

當 main 和 feature **都有新的 commit** 時，Git 使用 3-way merge：

```text
合併前：
main:    A --- B --- E
                \
feature:         C --- D

三個參考點：B（共同祖先）、E（main 最新）、D（feature 最新）

合併後：
main:    A --- B --- E --- M  (M = merge commit)
                \       /
feature:         C --- D
```

```bash
git switch main
git merge feature/login
# 輸出：Merge made by the 'ort' strategy.
```

<!--
第二種情況是，main 和 feature 都有新的 commit。
看上面的圖，從 B 分開之後，main 多了 E，feature 多了 C 和 D。
這時候指標沒辦法單純往前移，Git 會用 3-way merge。
它會比較三個點：共同祖先 B、main 最新的 E，還有 feature 最新的 D。
比較完之後，產生一個新的合併 commit M，把兩條線接起來。
執行時會看到 Merge made by the ort strategy，ort 是 Git 預設的合併策略名稱。
-->

---

# 3-Way Merge：特性

**特性：**
- 產生一個新的合併 commit M
- 保留了分支歷史（有「小耳朵」）
- 歷史圖上可以看出曾經有哪些分支

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**為什麼叫 3-way：** Git 用三個版本做比較——兩個分支的最新 commit，加上它們的共同祖先 B。這樣才能正確判斷「這個改動是哪邊加的」，避免誤刪另一邊的修改。

</div>

<!--
3-way merge 會產生一個新的合併 commit，並且保留分支的歷史。
在 log 圖上，可以清楚看到曾經有哪些分支。
那為什麼要比較三個版本，而不是兩個？
因為只看兩邊的最新版本，Git 無法知道某一行是誰加的、誰刪的。
有了共同祖先當參考，才能正確判斷改動來自哪一邊，避免誤刪另一邊的修改。
不過，3-way merge 不一定每次都能自動完成。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 【狀況題】合併發生衝突了，怎麼辦？

<!--
接下來就是合併最常遇到的狀況：衝突。它不是錯誤，而是 Git 在請我們做決定。
-->

---

# 衝突發生的原因

**兩個分支修改了同一個檔案的同一行：**

```text
main 分支的 greeting.js：
  console.log("Hello, World!");

feature 分支的 greeting.js：
  console.log("Hello, Git!");

合併時：Git 不知道要選哪個！→ 衝突
```

<!--
衝突是怎麼發生的？
看這個例子，main 分支把這一行改成 Hello, World。
feature 分支則把同一行改成 Hello, Git。
合併的時候，兩邊都改了同一行，Git 不知道該選哪一個，於是就產生衝突。
所以衝突只會在 Git 無法自己判斷要保留哪個版本的時候發生。
-->

---

# 哪些情況會衝突？

| 情境 | 結果 |
|------|------|
| 兩個分支修改**不同檔案** | 自動合併，無衝突 |
| 兩個分支修改**同一檔案的不同行** | 自動合併，無衝突 |
| 兩個分支修改**同一行** | 衝突！需要手動解決 |
| 一方刪除、另一方修改同一檔案 | 衝突！需要手動決定 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**提醒：** 合併後最好確認結果，不要完全依賴 Git 的自動判斷——不同行自動合併了，不代表邏輯上沒問題。

</div>

<!--
這張表整理了哪些情況會衝突。
兩個分支改的是不同檔案，或是同一個檔案的不同行，Git 都能自動合併。
改到同一行，或是一邊刪掉檔案、另一邊修改了它，就會衝突，需要我們手動決定。
不過要注意下面的提醒。
自動合併成功，只代表文字上沒有重疊，不代表邏輯上沒問題。
例如一邊改了函式的名稱，另一邊在別的地方用了舊名稱，Git 一樣會順利合併。
所以合併之後，最好還是跑一下程式或測試確認。
-->

---

# Git 衝突標記

發生衝突時，Git 會修改檔案，插入標記：

```text
<<<<<<< HEAD
console.log("Hello, World!");
=======
console.log("Hello, Git!");
>>>>>>> feature/greeting
```

<!--
發生衝突時，Git 會直接在檔案裡插入標記，長得就像這樣。
上半段是一種版本，下半段是另一種版本，中間用一排等號隔開。
要特別注意，這些標記只是 Git 留給我們的提示，不是程式的一部分。
如果沒處理就直接執行，程式一定會出錯。
-->

---

# Git 衝突標記：區段說明

| 標記 | 說明 |
|------|------|
| `<<<<<<< HEAD` | 目前分支（你在的那邊）的內容 |
| `=======` | 分隔線 |
| `>>>>>>> feature/greeting` | 要合併進來的分支的內容 |

**你的任務：** 編輯這個檔案，決定最終要留什麼，然後**刪掉所有標記**。

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

可以選其中一個版本，也可以兩個都留，甚至寫全新版本——完全由你決定。

</div>

<!--
我們看每一段的意思。
從一排小於符號加上 HEAD 開始，到等號為止，是目前所在分支的內容。
從等號到一排大於符號，是要合併進來的那個分支的內容。
我們的任務，是編輯這個檔案，決定最後要留下什麼，然後刪掉所有標記。
可以選其中一個版本，也可以兩個都留，甚至寫一個全新的版本。
完全由我們決定。
-->

---

# 衝突解決流程

**步驟一：觀察哪些檔案有衝突：**

```bash
git status
# both modified: src/greeting.js
```

**步驟二：編輯衝突檔案，決定最終內容：**

```text
# 修改後（刪除所有標記，保留想要的內容）：
console.log("Hello, Git World!");
```

**步驟三：標記已解決，然後完成合併：**

```bash
git add src/greeting.js     # 標記這個檔案已解決
git commit                  # 完成合併 commit（訊息已預填）
```

<!--
解決衝突的流程只有三步。
第一步，用 `git status` 看哪些檔案有衝突，它們會被標示成 both modified。
第二步，打開檔案，決定最後的內容，並刪掉所有標記。
範例裡，我們把兩邊的意思結合，改成 Hello, Git World。
第三步，用 `git add` 告訴 Git 這個檔案已經解決了，再 `git commit` 完成合併。
commit 的訊息 Git 已經幫我們預先填好。
這裡的 add 和 commit，就是第十章學過的那兩個指令，沒有什麼特別的。
-->

---

# 衝突解決流程：使用 VS Code（推薦）

```bash
# 在 VS Code 中開啟有衝突的檔案
code src/greeting.js
```

VS Code 的 merge editor 會用顏色區分雙方改動，有按鈕可以直接選擇：

- **Accept Current Change** — 保留 HEAD（你的）版本
- **Accept Incoming Change** — 保留合併進來的版本
- **Accept Both Changes** — 兩個都保留

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

不需要手動刪除標記符號，點按鈕即可。其他工具也可透過 `git mergetool` 配置。

</div>

<!--
如果用 VS Code，處理衝突會更輕鬆。
打開有衝突的檔案，VS Code 會用顏色區分兩邊的改動，上面還有幾個按鈕。
Accept Current Change 保留目前分支的版本。
Accept Incoming Change 保留合併進來的版本。
Accept Both Changes 則是兩個都留下。
點一下按鈕，標記就會自動處理好，不需要手動刪除。
處理完之後，一樣是 add 再 commit。
如果習慣用其他工具，也可以透過 `git mergetool` 來設定。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 【狀況題】分支沒有小耳朵

<!--
接下來回頭看一個很多人困惑的現象：明明開了分支，log 圖卻是一直線。
-->

---

# 什麼是「小耳朵」？

在 `git log --graph` 中，**分叉的圖形**就是「小耳朵」：

```text
有小耳朵（3-way merge）：
*   a1b2c3d Merge branch 'feature'
|\
| * d4e5f6g feature 的 commit
|/
* b2c3d4e main 的 commit

沒有小耳朵（fast-forward）：
* d4e5f6g feature 的 commit
* b2c3d4e main 的 commit
* a1b2c3d 初始 commit
```

**為什麼沒有小耳朵？**

Fast-forward 只是移動指標，不產生合併 commit，所以在 log 圖上看不出來曾經有分支。

<!--
在 `git log --graph` 裡，分叉出去再接回來的圖形，我們叫它「小耳朵」。
上面是有小耳朵的情況，也就是 3-way merge，可以清楚看到分支分出去又合回來。
下面是沒有小耳朵的情況，也就是 fast-forward，整條歷史是一直線。
原因就在剛才講的，fast-forward 只是移動指標，不會產生合併 commit。
所以在圖上看不出來曾經有過分支。
有沒有小耳朵，完全取決於合併時有沒有產生合併 commit。
想永遠保留分支的痕跡，就用前面講過的 `--no-ff`。
-->

---

# 三種合併方式比較

| 合併方式 | 指令 | 產生合併 commit | 保留分支歷史 |
|----------|------|:-:|:-:|
| Fast-forward | `git merge` | 否（如果可以的話） | 否 |
| 強制合併 commit | `git merge --no-ff` | 是 | 是 |
| 3-way merge | `git merge`（有分歧時自動） | 是 | 是 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**團隊慣例：** 許多團隊規定 `merge --no-ff`，這樣從 log 上可以清楚看出每個功能分支的起訖。沒有絕對對錯，但整個團隊要統一規則。

</div>

<!--
我們把三種合併方式放在一起比較。
一般的 `git merge`，能快轉的時候就會快轉，不產生合併 commit，也不保留分支痕跡。
加上 `--no-ff`，就一定會產生合併 commit，保留分支的歷史。
兩邊都有新 commit 的時候，Git 自動使用 3-way merge，同樣會產生合併 commit。
很多團隊會規定使用 `--no-ff`，讓每個功能分支的起點和終點都看得清楚。
這沒有絕對的對錯，但整個團隊要統一，否則 log 圖會很混亂。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# 【常見問題】合併過的分支要留著嗎？

<!--
開發久了，分支會越來越多。合併過的分支要不要留？我們先看刪除的指令。
-->

---

# 刪除分支的三個指令

**刪除已合併的分支（安全）：**

```bash
git branch -d feature/login    # 如果已合併，可以刪除
```

**強制刪除（不論有沒有合併）：**

```bash
git branch -D feature/experiment    # 強制刪除，慎用！
```

**刪除遠端分支：**

```bash
git push origin --delete feature/login
```

<!--
刪除分支有三個指令。
小寫的 `git branch -d`，用來刪除已經合併的分支。
它有保護機制，如果分支還沒合併，Git 會拒絕刪除。
大寫的 `git branch -D` 則是強制刪除，不管有沒有合併，都直接刪掉，要特別小心。
最後一個是刪除遠端的分支，用 `git push origin --delete`，後面接分支名稱。
萬一用大寫 D 刪錯了，也有辦法救回來，這章最後一個狀況題會講。
-->

---

# 分支的完整生命週期

```bash
git switch -c feature/payment    # 建立並切換
# ... 開發、commit ...
git switch main                  # 切回主線
git merge feature/payment        # 合併
git branch -d feature/payment   # 刪除已合併的分支
```

| 指令 | 說明 |
|------|------|
| `git branch -d` | 安全刪除（已合併才能刪） |
| `git branch -D` | 強制刪除（慎用！） |
| `git push origin --delete` | 刪除遠端分支 |

<!--
這五行指令，就是一個功能分支從建立到結束的完整流程。
先用 `git switch -c` 建立並切換到新分支，接著開發、commit。
完成後切回 main，把功能分支合併進來。
最後用 `git branch -d` 把已經合併的分支刪掉。
下面的表格，再把三種刪除方式整理一次。
建立、開發、合併、刪除，大家可以把這頁記起來。
-->

---

# 已合併 vs 未合併的分支

**查看哪些分支已合併進目前分支：**

```bash
git branch --merged       # 已合併（可以安全刪除）
git branch --no-merged    # 尚未合併（刪除要謹慎）
```

輸出範例：

```text
$ git branch --merged
* main
  feature/login      ← 已合併，可以刪
  hotfix/bug-123     ← 已合併，可以刪

$ git branch --no-merged
  feature/payment    ← 還沒合併，刪了會遺失工作！
  experiment/new-ui  ← 還沒合併
```

<!--
那要怎麼知道哪些分支已經可以刪了？
`git branch --merged` 會列出已經合併進目前分支的分支。
`git branch --no-merged` 則列出還沒合併的。
看下面的輸出，login 和 bug-123 已經合併，可以放心刪。
已經合併的分支刪掉，commit 都還在，只是少了一個名字而已。
但 payment 和 new-ui 還沒合併，刪掉的話，那些 commit 就沒有名字可以找到了，要特別謹慎。
-->

---

# 已合併 vs 未合併的分支：批次清理

**批次刪除已合併分支（排除 main）：**

```bash
git branch --merged | grep -v "main" | xargs git branch -d
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**建議：** 定期執行 `git branch --merged` 確認清單，再批次刪除，保持分支列表乾淨。已合併的分支刪掉只是少了名字，commit 本體還在。

</div>

<!--
如果已經合併的分支很多，可以用這一行批次刪除。
它先列出已經合併的分支，用 grep 排除 main，再交給 `git branch -d` 一個一個刪掉。
因為用的是小寫 d，還沒合併的分支不會被誤刪。
建議先單獨執行 `git branch --merged`，確認清單沒問題，再批次刪除。
-->

---

# 分支清理策略：什麼時候清？

**建議的清理流程：**

| 時機 | 動作 |
|------|------|
| 功能完成、PR 合併後 | 立即刪除功能分支（本地 + 遠端） |
| 定期維護 | `git branch --merged` 批次清理 |
| 同步遠端 | `git fetch --prune` 清除失效的遠端引用 |

<!--
那什麼時候該清理分支呢？
最好的時機，是功能完成、PR 合併之後，馬上把本機和遠端的功能分支都刪掉。
另外可以定期用 `git branch --merged` 檢查，批次清理。
最後，記得用 `git fetch --prune`，把已經失效的遠端分支紀錄清掉。
分支用完就刪，是一個好習慣。
-->

---

# 分支清理策略：遠端

**遠端分支清理：**

```bash
git push origin --delete feature/login   # 刪除遠端分支

# 清理已被刪除的遠端追蹤引用
git fetch --prune
git remote prune origin
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**說明：** 當同事在 GitHub 上刪除了分支，你本地還是會有 `origin/feature-xxx` 的追蹤引用。`git fetch --prune` 可以清掉這些失效引用，讓 `git branch -a` 的輸出更整潔。

</div>

<!--
遠端分支的清理，很多人會忽略。
刪除遠端分支，用的是 `git push origin --delete`。
但還有一種情況是，同事已經在 GitHub 上把分支刪掉了。
我們本機卻還留著 origin 開頭的那筆紀錄，用 `git branch -a` 還看得到。
這時用 `git fetch --prune`，或是 `git remote prune origin`，就能把這些失效的紀錄清掉。
這樣 `git branch -a` 的輸出就會整潔很多。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
# 【狀況題】不小心砍掉未合併的分支

<!--
最後一個狀況題比較緊張：手滑用大寫 D，刪掉了還沒合併的分支。別慌，救得回來。
-->

---

# 問題：分支被強制刪除了！

情境：你在 `feature/payment` 開發了幾天，沒有合併，手滑刪掉了：

```bash
git branch -D feature/payment
# Deleted branch feature/payment (was a1b2c3d).
```

**分支刪除後發生了什麼？**

```text
刪除前：
main:           A --- B
                       \
feature/payment:        C --- D --- E  ← 分支指標指向 E

刪除後：
main:           A --- B
                       \
                        C --- D --- E  ← 指標消失！commit 還在，只是沒有名字了
```

Git 的分支本質上只是一個**指標**——一個指向某個 commit 的名字。刪除分支只是把這個名字移除，commits C-D-E 本體仍安全地存放在 `.git/objects` 裡，只是變成「孤兒 commit」，沒有名字就找不到它們了。

<!--
情境是這樣。
我們在 feature/payment 上開發了好幾天，還沒合併，就手滑用 `git branch -D` 把它刪了。
這時候發生了什麼事？看下面的圖。
Git 的分支，本質上只是一個指向某個 commit 的名字。
刪除分支，只是把這個名字拿掉。
C、D、E 這幾個 commit 本身，還好好地存在 `.git` 裡，只是沒有名字，我們找不到它們。
Git 只會在這些 commit 孤立一段時間之後，才會真正清除。
所以只要盡快處理，通常都救得回來。
-->

---

# 用 git reflog 找回被刪的分支

**reflog 記錄了所有 HEAD 的移動歷史：**

```bash
git reflog
```

輸出範例：

```text
a1b2c3d HEAD@{0}: checkout: moving from feature/payment to main
e5f6g7h HEAD@{1}: commit: 新增金流串接
d4e5f6g HEAD@{2}: commit: 新增購物車 API
c3d4e5f HEAD@{3}: commit: 建立 payment 模組
b2c3d4e HEAD@{4}: checkout: moving from main to feature/payment
```

<!--
要找回它們，我們用第十章學過的 `git reflog`。
它記錄了 HEAD 每一次的移動。
看這段輸出，從下往上讀。
最下面一行，我們從 main 切到 feature/payment。
接著做了三個 commit，最後又切回 main。
往上數，最後一次在 feature/payment 上做的 commit，就是新增金流串接的那一行，編號是 e5f6g7h。
這就是被刪掉的分支最後指向的位置。
-->

---

# 用 git reflog 找回被刪的分支：重建

找到最後一次在那個分支的 commit hash（這裡是 `e5f6g7h`），重新建立分支：

```bash
git branch feature/payment e5f6g7h
# Branch 'feature/payment' set up to track commit e5f6g7h.
```

<div style="margin-top: 1rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**reflog 是你的後悔藥：** 它記錄了最近 90 天的所有 HEAD 變動，reset、刪分支、甚至 amend 都找得回來。整個過程大概一分鐘內可以搞定。

</div>

<!--
找到編號之後，用 `git branch`，加上原本的分支名稱，再接這個編號。
Git 就會在這個 commit 上，重新建立一個叫 feature/payment 的分支。
整個過程大概一分鐘就能完成。
reflog 就像我們的後悔藥。
它保留最近九十天的紀錄，reset、刪錯分支，甚至改過的 commit，都有機會找回來。
-->

---

# 本章重點回顧


- **分支讓衝突變得可控** — 不是消滅衝突，而是讓它在合併時集中發生
- **`git switch -c <name>`** 建立並切換（舊語法 `git checkout -b`）；`git branch` 只建立、不切換
- **合併方向：先切到目標分支，再 merge 來源分支**
- **Fast-forward 只移動指標**（無合併 commit、無小耳朵）；**3-way merge 產生合併 commit**（有小耳朵）
- **`--no-ff` 強制留下分支痕跡** — 團隊統一規則比選哪一種更重要
- **衝突解決三步：編輯檔案 → `git add` → `git commit`**，記得刪掉所有標記
- **`git branch --merged` 判斷可刪**；`-d` 安全刪、`-D` 強制刪、`git fetch --prune` 清失效遠端引用
- **刪錯分支用 `git reflog`** 找回 commit hash，再 `git branch <name> <hash>` 重建


<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** Ch 14 標籤 — 用 `git tag` 幫重要的版本節點做標記

<Link to="ch14" style="color: #d97706; font-weight: 600;">前往 Ch 14 →</Link>

</div>

<!--
我們回顧這章的重點。
分支不是消滅衝突，而是讓衝突在合併時集中處理。
建立並切換用 `git switch -c`，而 `git branch` 只建立、不切換。
合併時，先切到目標分支，再合併來源分支。
fast-forward 只移動指標，沒有小耳朵；3-way merge 會產生合併 commit。
解決衝突三步驟：編輯檔案、add、commit。
最後，刪錯分支也不用怕，用 reflog 找回編號，重新建立就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這章最核心的一句話是：分支只是一個指向 commit 的指標。
所以建立、切換、刪除都非常輕量，Git 也鼓勵我們想開就開。
合併的方式決定了歷史圖長什麼樣子，衝突的處理流程走過一次，就不再可怕。
下一章我們來學標籤，幫重要的版本節點做記號。我們下一章見。
【講師】開放提問，可以請大家現場製造一次衝突並解決，確認流程都熟悉了。
-->
