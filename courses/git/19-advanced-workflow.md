---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: 進階操作技巧
routeAlias: ch19
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
layout: default
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 版本控制課程</p>
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">進階操作技巧</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">「讓工作流更專業、歷史更乾淨」</p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十九章，進階操作技巧。
這章有三個實用的主題。
第一個是用 rebase 整合分支，讓歷史保持一直線。
第二個是從過去的某個 commit 長出新分支，這是修補舊版本的核心技巧。
第三個是一套 commit 工具，讓團隊的 commit 訊息自動符合規範。
學完之後，我們的 Git 工作流程會更專業，歷史也會更乾淨。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# Rebase：另一種合併方式

<!--
除了 merge，還有另一種整合分支的方式，叫做 rebase。我們來看它和 merge 有什麼不同。
-->

---

# git rebase 是什麼？

**Rebase 的概念：重新播放 commit**

```text
rebase 前：
main:    A --- B --- E
                \
feature:         C --- D

git switch feature
git rebase main

rebase 後：
main:    A --- B --- E
                      \
feature:               C' --- D'  (C、D 被重新播放在 E 之後)
```

```bash
git switch feature/login
git rebase main          # 把 feature 的 commit 重新接在 main 最新處
```

Rebase 讓 feature 的歷史「看起來像是從 main 最新版本開始開發的」。

<!--
第十六章我們用過互動式 rebase 整理 commit，這裡來看 rebase 最原本的用途。
rebase 的字面意思是「重新設定基礎」。
看上面的圖，feature 原本是從 B 長出來的，但 main 之後又多了 E。
在 feature 分支上執行 `git rebase main`。
Git 會把 C 和 D 從原本的位置拔起來，重新接在 E 的後面，變成 C' 和 D'。
內容一樣，但因為上一個 commit 變了，編號也跟著不同。
結果就像 feature 是從 main 最新的版本開始開發的。
-->

---

# Rebase vs Merge 比較

| | Merge | Rebase |
|--|-------|--------|
| **歷史形狀** | 分叉（有小耳朵） | 線性（沒有分叉） |
| **原始 commit 保留** | 是（保留完整歷史） | 否（重新建立 commit） |
| **適合情境** | 功能完成後整合 | 整理本地 commit、同步主線 |
| **衝突處理** | 一次解決 | 每個 commit 逐一解決 |
| **公開分支** | 安全 | **避免用在已 push 的分支** |

<!--
我們把 merge 和 rebase 放在一起比較。
merge 會讓歷史分叉，留下小耳朵，原本的 commit 都會保留。
rebase 則讓歷史變成一直線，但它是重新建立 commit，原本的 commit 不會保留。
遇到衝突時，merge 只要解決一次，rebase 則可能要每個 commit 逐一解決。
最重要的是最後一行。
merge 用在公開分支是安全的，rebase 則要避免用在已經推送的分支上。
因為它改變了 commit 編號，推上去之後，其他人的歷史就會和遠端對不起來。
-->

---

# Rebase vs Merge：log 形狀比較

```text
merge 的 log：    rebase 的 log：
* merge commit    * feature commit D
|\                * feature commit C
| * D             * main commit E
| * C             * main commit B
|/                * main commit A
* E
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**黃金原則：只對還沒有 push 的本地 commit 做 rebase。** 已 push 的 commit 被 rebase 後，hash 改變，其他人拉取後會造成歷史分歧，非常麻煩。

</div>

<!--
看看兩種方式產生的 log 長什麼樣子。
左邊是 merge，可以看到 C 和 D 從旁邊分出去，最上面多了一個合併用的 commit。
右邊是 rebase，所有 commit 排成一直線，沒有分叉，也沒有合併用的 commit。
rebase 的歷史確實乾淨很多。
但要記住黃金原則：只對還沒推送的本機 commit 做 rebase。
-->

---

# Rebase 的操作與中止

```bash
git switch feature/login
git rebase main           # 開始 rebase

# 如果中途發生衝突：
# 1. 解決衝突
# 2. git add <file>
# 3. git rebase --continue  # 繼續 rebase
# 或
# 3. git rebase --skip      # 跳過這個 commit（少用）

# 完全放棄，回到 rebase 開始之前的狀態
git rebase --abort
```

<!--
rebase 的操作很簡單，切換到功能分支，執行 `git rebase main`。
如果過程中發生衝突，Git 會停下來。
處理方式跟第十六章一樣，先解決衝突，用 `git add` 標記，再執行 `git rebase --continue`。
要注意的是，rebase 是一個 commit 一個 commit 重新套用的。
所以可能會停下來好幾次，每次解決完就繼續。
如果覺得太複雜，隨時可以用 `git rebase --abort`，回到開始之前的狀態。
-->

---

# Rebase 後合併回 main

```bash
# Rebase 完，合回 main（此時會 fast-forward）
git switch main
git merge feature/login    # 線性歷史，自動 fast-forward
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**為什麼會 fast-forward？** Rebase 之後，feature 的 commit 已經接在 main 最新點之後，兩者之間沒有分歧，merge 時只需要移動指標，不需要建立 merge commit。

</div>

<!--
rebase 完成之後，再切回 main，把功能分支合併進來。
這時候會發生 fast-forward。
因為功能分支的 commit，已經接在 main 最新的位置後面了，兩邊沒有分歧。
所以 Git 只需要把 main 的指標往前移，不需要產生合併用的 commit。
先 rebase 再 merge，就能得到一條乾淨的直線歷史。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 從過去的 Commit 長新分支

<!--
第二個主題：從過去的某個 commit，長出一條新分支。例如要修補一個已經發布的舊版本。
-->

---

# 找到目標 Commit

**使用 git log 找到你要的 commit：**

```bash
git log --oneline
```

輸出範例：

```text
a1b2c3d (HEAD -> main) 新增使用者權限管理
e5f6g7h 更新依賴套件版本
d4e5f6g 修正登入驗證邏輯
c3d4e5f 發布 v1.2.0
b2c3d4e 新增購物車功能
9a8b7c6 發布 v1.0.0  ← 假設你要從這裡開始 hotfix
```

**找到 hash 後，就可以從那個點建立分支。**

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**技巧：** 用 `git log --oneline --graph --all` 可以同時看到所有分支的歷史，更容易找到目標點。

</div>

<!--
第一步，是找到目標的 commit。
用 `git log --oneline` 瀏覽歷史。
假設我們要修補的是 1.0.0 版，它對應的 commit 是 9a8b7c6。
找到編號之後，就可以從那個點建立分支。
編號只需要前面幾碼，通常七碼就夠了。
如果當初有打標籤，也可以直接用標籤名稱代替編號，例如 v1.0.0，更直觀。
如果分支很多，加上 `--graph --all`，可以同時看到所有分支，更容易找到目標。
-->

---

# 從指定 Commit 建立分支

```bash
# 新語法（推薦）
git switch -c hotfix/v1.0.1 9a8b7c6

# 舊語法（效果相同）
git checkout -b hotfix/v1.0.1 9a8b7c6
```

```text
                         ← 目前在這裡
                         ↓
main:   9a8b7c6 --- ... --- a1b2c3d (HEAD -> main)

執行後：

hotfix: 9a8b7c6 (HEAD -> hotfix/v1.0.1)
         ↑ 從這裡開始
main:   9a8b7c6 --- ... --- a1b2c3d
```

<!--
建立分支的指令我們很熟悉，只是在最後面多加了一個起點。
`git switch -c hotfix/v1.0.1`，後面接上 9a8b7c6。
舊的寫法 `git checkout -b` 也一樣可以。
如果不指定起點，預設就是從目前的 HEAD 開始。
指定之後，新分支就會從那個舊的 commit 長出來，跟現在的 main 分開發展。
-->

---

# 從指定 Commit 建立分支：完整 Hotfix 流程（一）

```bash
# 1. 找到舊版本的 commit hash
git log --oneline
# 9a8b7c6 發布 v1.0.0

# 2. 從舊版本建立 hotfix 分支
git switch -c hotfix/v1.0.1 9a8b7c6

# 3. 修 bug，提交
git add fix.js
git commit -m "修正 v1.0 的安全漏洞"
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

bug 在舊版本，要從舊版本的 commit 點開始修，不能從 main 最新點建立，否則會夾帶未上線的功能。

</div>

<!--
我們看完整的修補流程。
第一步，找到舊版本的 commit 編號。
第二步，從舊版本建立 hotfix 分支。
第三步，修好 bug，add 之後 commit。
這裡的關鍵是，bug 出現在舊版本，就要從舊版本開始修。
如果從 main 最新的位置開始，就會夾帶還沒上線的功能，一起被送出去。
-->

---

# 從指定 Commit 建立分支：完整 Hotfix 流程（二）

```bash
# 4. 合併回 main（帶回修正）
git switch main
git merge hotfix/v1.0.1

# 5. cherry-pick 回開發分支（確保下個版本也有此修正）
git switch develop
git cherry-pick <hotfix-commit-hash>

# 6. 清理
git branch -d hotfix/v1.0.1
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**步驟 5 的意義：** hotfix 修完後用 cherry-pick 把修正帶回 develop，確保下個版本不會再出現同樣的 bug。

</div>

<!--
接下來是合併和清理。
第四步，切回 main，把 hotfix 分支合併進來。
第五步，切到 develop，用 cherry-pick 把修正的那個 commit 帶過去。
這樣下一個版本也會包含這個修正，同樣的 bug 不會再出現。
cherry-pick 只會帶走那一個 commit，不會夾帶其他改動，所以是最精準的做法。
最後一步，把已經合併的 hotfix 分支刪掉。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# Commit 工具鏈實戰

<!--
第三個主題，我們把第十章團隊實踐建議提到的工具，實際安裝和使用一次。
-->

---
layout: default
---

# commitlint — 自動檢查 message 格式

### 安裝

```bash
# 安裝 commitlint 和 Angular 規範設定
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```js
// commitlint.config.js（建立在專案根目錄）
export default {
  extends: ['@commitlint/config-conventional'],
};
```

### 手動測試

```bash
# 測試一條 message 是否合格
echo "feat: 新增搜尋功能" | npx commitlint   # ✅ 通過
echo "update"              | npx commitlint   # ❌ 錯誤
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> commitlint 通常搭配 husky 的 commit-msg hook 一起使用，下一頁說明。</div>

<!--
第一個工具是 commitlint，它會自動檢查 commit 訊息的格式。
用 npm 安裝 commitlint，以及 Conventional Commits 的規則設定。
接著在專案根目錄建立 commitlint.config.js，指定使用這套規則。
裝好之後，可以先手動測試。
把訊息 feat: 新增搜尋功能 交給 commitlint，會通過檢查。
如果只寫 update，就會被判定為錯誤，因為缺少類型。
不過 commitlint 本身只是一個檢查工具，它不會主動攔截 commit，要搭配下一頁的 hook。
-->

---
layout: default
---

# commit-msg Hook — 本機攔截不合規 message

### 使用 husky 安裝

```bash
# 安裝 husky 並初始化
npm install --save-dev husky
npx husky init

# 新增 commit-msg hook，呼叫 commitlint
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### 效果示範

```bash
$ git commit -m "update something"
⧗   input: update something
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]

✖   found 2 problems, 0 warnings
husky - commit-msg script failed (code 1)
# ← commit 被攔截，未建立
```

<!--
要讓 commitlint 在每次 commit 時自動執行，就要用到 Git 的 hook。
最常見的做法是搭配 husky。
安裝 husky 並初始化之後，建立一個 commit-msg hook，在裡面呼叫 commitlint。
commit-msg 這個 hook，會在我們寫好訊息之後、正式建立 commit 之前執行。
只要檢查沒通過，整個 commit 就會被擋下來。
看下面的範例，訊息只寫 update something，commitlint 說缺少類型和主旨，commit 沒有建立。
記得把 husky 的資料夾和 commitlint 的設定檔都 commit 進 repo。
這樣整個團隊就會套用同一套規則。
-->

---
layout: default
---

# GitHub Desktop + Copilot — AI 產生 commit message

| 步驟 | 說明 |
| ---- | ---- |
| 1. 安裝 GitHub Desktop | 從 desktop.github.com 下載安裝 |
| 2. 登入 GitHub 帳號 | 需有 GitHub Copilot 訂閱（或 Free tier） |
| 3. 在 Changes 頁面 | 勾選要 commit 的檔案 |
| 4. 點擊 ✨ 圖示 | Summary 欄位右側的 Copilot 按鈕 |
| 5. 審閱並調整 | Copilot 根據 diff 自動產生 message，確認後 commit |

<!--
第三個工具，是第十二章介紹過的 GitHub Desktop 搭配 Copilot。
帳號需要有 Copilot 的使用資格。
在 Changes 頁面勾選要 commit 的檔案。
接著點 Summary 欄位右邊的星星圖示，Copilot 就會根據改動，自動產生 commit 訊息。
最後一步很重要：一定要自己審閱、調整之後，再送出。
-->

---

# GitHub Desktop + Copilot：客製化設定

在 **GitHub Desktop → Preferences → Integrations → Copilot** 可設定：

- 語言偏好（中文 / 英文）
- 是否遵循 Conventional Commits 格式

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**注意：** AI 產生的 message 不是百分之百準確，一定要審閱後再 commit，不要盲目採用。對不熟悉 Conventional Commits 的人，可以拿 Copilot 的輸出當範本，慢慢培養出寫好 message 的直覺。

</div>

<!--
Copilot 產生訊息的方式，也可以在設定裡調整偏好。
例如使用中文或英文，以及是否遵循 Conventional Commits 格式。
不過要記住，AI 產生的訊息不一定完全正確，一定要看過再 commit。
對還不熟悉 Conventional Commits 的人來說，它是一個很好的輔助。
可以拿 Copilot 的結果當範本，慢慢培養寫好訊息的直覺。
-->

---
layout: default
---

# git rebase -i — 整理 commit 歷史

在 merge 前把 WIP commits 整理成乾淨的歷史：

```bash
# 整理最近 3 個 commit
git rebase -i HEAD~3
```

### 互動介面指令

```text
pick a1b2c3 WIP: 先做到這裡
pick d4e5f6 fix typo
pick 7g8h9i 完成功能

# 常用指令：
# pick   = 保留這個 commit
# squash = 合併進上一個 commit（保留訊息）
# fixup  = 合併進上一個 commit（丟棄訊息）
# reword = 保留 commit 但修改訊息
# drop   = 完全刪除這個 commit
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">⚠️ <b>注意：</b> rebase 會改寫 SHA-1，只對「還沒 push 的 commit」操作。已推送的分支不要 rebase。</div>

<!--
最後一個工具，是第十六章學過的互動式 rebase。
這裡把它放進工作流程裡來看。
開發功能時，在自己的分支上可以隨意 commit，WIP、fix typo 都沒關係。
等到要合併或送 PR 審查之前，再用 `git rebase -i`，把這些草稿整理成一兩個有意義的 commit。
清單裡最常用的指令是 squash 和 fixup，把小 commit 併進上一個。
reword 改訊息，drop 則是刪掉 commit。
再提醒一次，rebase 會改寫 commit 編號，只對還沒推送的 commit 操作。
-->

---
layout: default
---

# git rebase -i — squash 實際範例

```bash
$ git rebase -i HEAD~3
# 編輯器開啟，將後兩個 pick 改為 squash：

pick   a1b2c3 feat: 開始實作搜尋功能
squash d4e5f6 fix typo in search
squash 7g8h9i 補上 unit test

# 存檔關閉後，Git 會再開一次編輯器讓你寫最終 message：
# feat: 新增全文搜尋功能
#
# 實作關鍵字搜尋，支援模糊比對。
# 補上對應 unit test。
```

```bash
# 結果：三個 commit 合成一個
$ git log --oneline
b9c1d2e (HEAD -> feature/search) feat: 新增全文搜尋功能
81bce44 Add new feature
```

<!--
我們看一個完整的 squash 範例。
執行 `git rebase -i HEAD~3`，把後兩行的 pick 改成 squash。
存檔關閉後，Git 會再開一次編輯器，讓我們寫最終的訊息。
這裡我們用 Conventional Commits 的格式，寫成 feat: 新增全文搜尋功能，底下再補充說明。
完成之後看 log，原本的三個 commit，已經合成一個乾淨的 commit。
這是很多有經驗的工程師在送 PR 之前的標準步驟。
審查的人看到的，是一個清楚的功能，而不是一堆 WIP 和 fix typo。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章我們學了三個進階技巧。
用 rebase 讓歷史保持一直線，並記住只對還沒推送的 commit 使用。
從過去的 commit 長出分支，修補舊版本，再用 cherry-pick 把修正帶回開發分支。
最後用 commitlint、husky、Copilot 和互動式 rebase，讓 commit 訊息和歷史都保持整潔。
下一章，我們回到 GitHub，學習更多進階的操作。我們下一章見。
【講師】開放提問，可以請大家在練習 repo 裝好 husky，試著用不合格式的訊息 commit 看看。
-->
