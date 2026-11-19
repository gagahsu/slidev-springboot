---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: 開始使用 Git
routeAlias: ch10
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
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">開始使用 Git</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「把你的程式碼，交給 Git 來守護」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十章，開始使用 Git。
上一章我們把 Git 裝好、設定好了，這章要真的開始動手。
我們會從建立 Repository 開始，一步一步走過最常用的指令。
學完這章，我們就能自己管理一個專案的版本。
就算不小心刪錯檔案、commit 錯東西，也知道怎麼救回來。
-->

---
layout: default
---

# Outline

- **新增 Repository** — `git init`
- **基本工作流程** — `git add` / `git commit` / `git status`
- **檢視紀錄** — `git log` / `git log -p` / `git blame`
- **Commit Message** — 格式規範與 commit 的好時機
- **【狀況題】檔案忽略** — `.gitignore`
- **【狀況題】刪除、改名與空目錄** — `git rm` / `git mv` / `.gitkeep`
- **【狀況題】還原與修復** — `git restore` / `git reset` / `reflog`


<!--
這章分成兩大塊。
前四個主題是基本工作流程。
包括建立 repo、add 和 commit、查看紀錄，還有怎麼寫 commit message。
後三個是狀況題，也就是實際工作中很常遇到的情境。
例如有些檔案不想放進 Git、要刪檔或改名，還有出錯了怎麼還原。
先把這些狀況的應對方式學起來，用 Git 會更有信心。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 新增、初始 Repository

<!--
第一個主題，建立 Repository。這是一切的起點，沒有它，Git 什麼都做不了。
-->

---

# 什麼是 Repository？

Git 用一個隱藏目錄 `.git` 來記錄**所有的版本歷史**。

這個 `.git` 目錄就是所謂的「儲存庫（Repository）」。

<br>

> **整個 Git 的精華，就都在這個 `.git` 目錄裡。**

<br>

| 你看到的 | Git 實際儲存在 |
| --- | --- |
| 你的專案檔案（工作目錄） | `.git/` 隱藏目錄 |
| 每一次的 Commit 紀錄 | `.git/objects/` |
| 分支、標籤資訊 | `.git/refs/` |

<!--
很多人以為 Git 把版本資料存在雲端，或某個神秘的地方。
其實不是。
Git 所有的歷史、物件和設定，全部都放在專案裡一個叫 `.git` 的隱藏資料夾。
這個資料夾，就是所謂的「儲存庫」，也就是 Repository。
表格右邊列的 objects 放的是每一次 commit 的內容，refs 放的是分支和標籤。
也因為一切都在本機，Git 才能完全離線運作。
要注意這個資料夾預設是隱藏的。
Windows 要在檔案總管打開「顯示隱藏的項目」才看得到。
-->

---

# `git init` — 初始化 Repository

| 指令 | 說明 |
| --- | --- |
| `git init` | 在目前目錄初始化，建立 `.git/` |
| `mkdir 目錄名 && cd 目錄名 && git init` | 建立新目錄並初始化 |

```bash
$ mkdir git-practice
$ cd git-practice
$ git init
Initialized empty Git repository in /tmp/git-practice/.git/
```

<!--
`git init` 的意思，就是對這個資料夾說：「從現在起，你歸 Git 管了。」
範例裡，我們先建立一個叫 git-practice 的資料夾，進去之後執行 `git init`。
執行後會印出 Initialized empty Git repository，代表 `.git` 資料夾建好了。
如果是已經存在的專案，直接在專案的根目錄執行 `git init` 就可以。
Git 不會動到任何現有的檔案。
【講師】請大家跟著建立 git-practice 資料夾，後面的練習都會在這裡進行。
-->

---

# ⚠️ `.git` 目錄千萬不能刪除

<br>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px; margin-bottom: 1rem;">
  <strong>整個專案目錄裡，什麼檔案或目錄刪了都救得回來，<br>但 <code>.git</code> 目錄只要刪了就沒辦法了。</strong>
</div>

<br>

| 情境 | 結果 |
| --- | --- |
| 刪除專案中的一般檔案 | ✅ 可透過 Git 復原 |
| 刪除 `.git/` 目錄 | ❌ 所有版本歷史永久消失 |

<!--
接下來有一件事要特別叮嚀。
整個專案裡，不管刪掉哪個檔案，只要 `.git` 還在，幾乎都救得回來。
但是 `.git` 本身一旦刪掉，所有的 commit、分支、標籤就全部消失了，沒有任何辦法復原。
這種事真的有人遇過，例如整理資料夾時順手把它刪了。
所以請大家對這個資料夾保持敬畏。
除非非常清楚自己在做什麼，否則不要手動去改裡面的東西。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 把檔案交給 Git 控管

<!--
有了 Repository，下一步就是把檔案交給 Git 管理。這裡會比想像中多一個步驟。
-->

---

# 為什麼需要 `git add`？

Git 不會自動追蹤你的每一個改動。你需要**明確告訴 Git**哪些變更要被記錄下來。

<br>

這個「先 add 再 commit」的兩步驟設計，讓你可以：
- 把相關的改動**打包在一起**提交
- 同時修改了 5 個檔案，但只 commit 其中 3 個有意義的
- 讓每一個 Commit 都有**清楚的意義**

<br>

> 新建立的檔案在 Git 眼中是「**Untracked**（未追蹤）」狀態。

<!--
很多人剛學 Git 都會問：為什麼不能直接 commit，還要先 add？
因為 Git 不會自動記錄每一個改動，我們得明確告訴它，這次要記錄哪些東西。
想像一下，我們同時在修 bug 和加新功能，改了五個檔案。
我們希望這兩件事分成兩個 commit，歷史才會清楚。
有了暫存區，就可以先 add 修 bug 的檔案，commit 一次。
再 add 新功能的檔案，再 commit 一次。
另外，新建立的檔案在 Git 眼中是 Untracked，也就是還沒被追蹤的狀態。
-->

---

# 核心指令：`git status` / `git add` / `git commit`

| 指令 | 說明 |
| --- | --- |
| `git status` | 查看目前工作目錄狀態 |
| `git add <檔案>` | 將指定檔案加入暫存區 |
| `git add *.html` | 用萬用字元加入多個檔案 |
| `git add .` | 加入當前目錄所有變更（最常用） |
| `git add --all` | 加入整個 repo 所有變更（含刪除） |
| `git commit -m "訊息"` | 將暫存區內容提交到儲存庫 |

<!--
這三個指令是日常使用 Git 的核心。
`git status` 用來隨時確認目前的狀態。
`git add` 把改動放進暫存區，`git commit` 才是真正寫進歷史。
這裡要特別講 `git add .` 和 `git add --all` 的差別，很多人會搞混。
`git add .` 只處理目前所在資料夾，以及它底下的變更。
`git add --all` 則是處理整個 repo，不管我們現在在哪一層。
在專案根目錄執行時，兩者效果一樣。
但如果我們在 src 資料夾裡執行 `git add .`，根目錄的改動就不會被加進去。
日常開發用 `git add .` 就夠了。
-->

---

# 核心指令：實際操作範例

```bash
$ git status
# On branch main — Untracked files: welcome.html

$ git add welcome.html
$ git commit -m "初始化專案，新增 welcome.html"
```

<!--
我們把剛才的指令串起來跑一次。
先執行 `git status`，可以看到 welcome.html 出現在 Untracked files 底下。
這代表 Git 發現了這個新檔案，但還沒開始追蹤它。
接著 `git add welcome.html`，把它放進暫存區。
最後 `git commit -m`，後面接上這次的說明，就完成了第一個 commit。
commit 之後再跑一次 `git status`，會看到 working tree clean。
意思是工作目錄裡的東西，都已經記錄進歷史了。
【講師】建議現場在 git-practice 裡實際跑一次，讓大家看到每一步 git status 的變化。
-->

---

# 讀懂 `git status` 的輸出

```bash
# 查看工作目錄與暫存區的狀態
git status

# 簡短模式
git status -s
```


**輸出範例：**

```
On branch main
Changes to be committed:        ← 已暫存（綠色）
  (use "git restore --staged <file>..." to unstage)
        new file:   hello.txt

Changes not staged for commit:  ← 已修改但未暫存（紅色）
  (use "git add <file>..." to update what will be committed)
        modified:   README.md

Untracked files:                ← 未追蹤（紅色）
  (use "git add <file>..." to include in what will be committed)
        notes.txt
```


<!--
`git status` 是我們最常執行的指令，沒有之一。
做任何操作之前先看一眼狀態，可以避免很多失誤。
這段輸出的三個區塊，剛好對應上一章講的三大區域。
Changes to be committed 是暫存區的內容，會顯示綠色。
Changes not staged for commit 是改了但還沒 add 的檔案，顯示紅色。
Untracked files 是 Git 完全不認識的新檔案，也是紅色。
Git 還會在每個區塊底下提示下一步可以執行什麼指令，新手很適合照著看。
如果覺得輸出太長，可以用 `git status -s`，改成每個檔案一行的簡短模式。
-->

---

# ⚠️ `git add` 後又修改了怎麼辦？

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px; margin-bottom: 1rem;">
  <strong>Git 每次 Commit 只處理「暫存區」的內容。</strong><br>
  如果 <code>git add</code> 之後又修改了檔案，必須<strong>再次 <code>git add</code></strong> 才能提交最新版本。
</div>

```bash
$ echo "Hello" > welcome.html
$ git add welcome.html       # 加入暫存區

$ echo "World" >> welcome.html  # 又修改了！

$ git commit -m "新增 welcome"
# 此時 commit 的是 "Hello" 版本，不是 "Hello\nWorld"
```

<!--
這是新手最常踩的坑。
`git add` 的時候，Git 只會記住那一刻的檔案內容。
之後再改的東西，並不會自動跑進暫存區。
看這個範例，我們先寫入 Hello，然後 add。
接著又加了一行 World，但沒有再 add 一次，就直接 commit 了。
結果 commit 進去的只有 Hello，World 那一行還留在工作目錄。
所以 commit 之前，養成先跑 `git status` 的習慣。
只要看到 Changes not staged for commit，就代表還有改動沒 add。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## 檢視紀錄

<!--
有了 commit 之後，我們要能回頭查看這些紀錄。接下來看 Git 的歷史書，`git log`。
-->

---

# `git log` — 查看 Commit 歷史

| 指令 | 說明 |
| --- | --- |
| `git log` | 顯示完整 commit 歷史（新 → 舊） |
| `git log --oneline` | 每個 commit 只顯示一行（精簡） |
| `git log --graph` | 以 ASCII 圖形顯示分支結構 |
| `git log --all` | 顯示所有分支的 commit（含遠端） |
| `git log --oneline --graph --all` | 最常用的完整概覽組合 |

<!--
`git log` 會從最新到最舊，列出每一個 commit 的編號、作者、時間和訊息。
不過預設的輸出很佔版面，所以大家常加上 `--oneline`，讓每個 commit 只佔一行。
`--graph` 會用簡單的圖形畫出分支結構，有分支的時候特別好用。
`--all` 則會把所有分支的 commit 都列出來。
最後一行這三個參數的組合，就是日常最常用的查看方式。
上一章設定的 alias `git lg`，其實就是這個組合。
-->

---

# `git log` 實際輸出範例

```text
$ git log --oneline --graph --all
* a3f8c12 (HEAD -> main) 修正登入頁面的 CSS 排版
* 7bd2e45 新增使用者認證功能
* 3c91f08 初始化專案結構
```

```text
$ git log
commit a3f8c12d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b (HEAD -> main)
Author: 小明 <ming@example.com>
Date:   Wed Jun 4 10:30:00 2026 +0800

    修正登入頁面的 CSS 排版
```

<!--
這裡比較兩種輸出格式。
下面是完整的 `git log`，包含 40 個字元的 commit 編號、作者、日期和訊息。
這個編號是用 SHA-1 從 commit 內容算出來的，幾乎可以當作唯一的身分證。
上面的 `--oneline` 只顯示前 7 碼的短編號，加上訊息的第一行，適合快速瀏覽。
要注意的是 HEAD 指向 main 這個標記。
它告訴我們，目前所在的位置是 main 分支上的這個 commit。
-->

---

# `git log` 進階篩選

| 指令 | 說明 |
| --- | --- |
| `git log --author="小明"` | 篩選特定作者的 commit |
| `git log --grep="登入"` | 搜尋 commit 訊息含關鍵字 |
| `git log -S "function login"` | 搜尋改動了特定程式碼的 commit |
| `git log --since="2026-01-01"` | 篩選特定日期之後的 commit |
| `git log --until="12pm"` | 篩選特定時間之前的 commit |

```bash
# 找出「誰」在「什麼時候」動了「登入」相關的程式碼
$ git log --oneline --author="小明" --grep="登入" --since="2026-01-01"
```

<style>
pre.shiki { font-size: 0.72rem !important; overflow-x: visible; white-space: pre-wrap; }
</style>

<!--
`git log` 其實是一個很強的查詢工具。
在大型專案裡，可以用它快速找出某個問題是誰、在什麼時候引入的。
`--author` 篩選作者，`--grep` 搜尋 commit 訊息裡的關鍵字。
要特別注意 `-S`，它搜尋的不是訊息，而是哪些 commit 實際改動了含有這段字串的程式碼。
除錯的時候，這個功能非常好用。
`--since` 和 `--until` 則可以限定時間範圍。
這些條件還可以組合起來，像下面這行，就是找小明在今年改過登入相關的 commit。
-->

---
layout: default
---

# 檢視特定檔案的 Commit 紀錄

### 問題場景

某個檔案突然壞掉，我想知道這個檔案最近改了什麼、誰改的、什麼時候改的。

### 常用指令

| 指令 | 說明 |
| ---- | ---- |
| `git log -- <file>` | 只顯示影響該檔案的 commits |
| `git log -p -- <file>` | 同上，並顯示每次的 diff |
| `git log --oneline -- <file>` | 精簡格式顯示 |
| `git log --follow -- <file>` | 追蹤檔案重新命名前的歷史 |
| `git log -S "keyword" -- <file>` | 找到新增/刪除特定字串的 commit |

<!--
想像一下，某個檔案突然壞掉了。
我們想知道這個檔案最近改了什麼、誰改的、什麼時候改的。
這時候第一步不是亂猜，而是查歷史。
在 `git log` 後面加兩個減號再接檔名，就只會列出改過這個檔案的 commit。
那兩個減號是刻意的，它告訴 Git，後面接的是檔案路徑，不是分支名稱。
加上 `-p`，會把每次的實際改動一起顯示出來。
`--follow` 則能處理檔案改過名字的情況，沒有它，改名之前的歷史就查不到。
-->

---
layout: default
---

# 檢視特定檔案：實際操作範例

```bash
# 只列出改過 index.html 的 commits
$ git log --oneline -- index.html
a3f9d2c Update hero section layout
81bce44 Fix navigation links
d7a22b1 Initial commit

# 加上 -p 顯示每次改了什麼（diff）
$ git log -p --oneline -- index.html
commit a3f9d2c
Author: Alice <alice@example.com>
Date:   Mon Jun 1 10:30:00 2026

    Update hero section layout

diff --git a/index.html b/index.html
-  <h1>Welcome</h1>
+  <h1>Welcome to Our Site</h1>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> 搭配 <code>--since</code> 縮小範圍，例如 <code>git log --since="2 weeks ago" -- index.html</code>，快速鎖定最近的改動。</div>

<!--
我們看實際的輸出長什麼樣子。
第一段用 `--oneline`，列出三個改過 index.html 的 commit，每個一行。
第二段加上 `-p`，每個 commit 底下會附上改動內容。
減號開頭的是刪掉的行，加號開頭的是新增的行。
這裡可以看到，標題從 Welcome 改成了 Welcome to Our Site。
如果檔案改動很多次，建議先用 `--oneline` 瀏覽清單。
找到可疑的 commit 之後，再用 `git show` 加上編號，單獨看那一次的完整改動。
下面的提示也很實用，加上 `--since` 可以只看最近兩週的改動。
-->

---
layout: default
---

# 這行程式是誰寫的？— `git blame`

### 問題場景

code review 發現一段奇怪的邏輯，想知道這行是誰、什麼時候加的，以便當面討論。

### git blame 常用指令

| 指令 | 說明 |
| ---- | ---- |
| `git blame <file>` | 顯示每行的作者與 commit 資訊 |
| `git blame -L 10,20 <file>` | 只看第 10 到 20 行 |
| `git blame -w <file>` | 忽略空白字元的改動 |
| `git blame --since="2 weeks" <file>` | 只看近期的改動 |

<!--
在 code review 時，我們發現一段奇怪的邏輯，想知道是誰、什麼時候加的。
這時候就用 `git blame`。
它的名字聽起來像是在「怪罪」，其實本意是找到這行程式的負責人，好去找對方討論。
不過常有人發現，用 `git blame` 查到的作者，其實是自己。
這也是版本控制的好處，每個決定都有跡可循。
`-L` 可以只看特定幾行，`-w` 會忽略單純空白的改動，避免被排版調整干擾。
-->

---
layout: default
---

# 讀懂 git blame 的輸出

```bash
# 查看 index.html 每一行的來源（只看第 5–10 行）
$ git blame -L 5,10 index.html
a3f9d2c (Alice  2026-06-01 10:30:00 +0800  5)   <title>My Site</title>
81bce44 (Bob    2026-05-20 14:22:10 +0800  6)   <meta charset="UTF-8">
81bce44 (Bob    2026-05-20 14:22:10 +0800  7)   <link rel="stylesheet" href="style.css">
d7a22b1 (Alice  2026-04-10 09:15:00 +0800  8)   <script src="app.js"></script>
^d7a22b1 (Alice 2026-04-10 09:15:00 +0800  9) </head>
a3f9d2c (Alice  2026-06-01 10:30:00 +0800  10)  <body>
```

<!--
這是 `git blame` 實際的輸出，範例只看第 5 到 10 行。
每一行的格式都很固定。
最左邊是 commit 編號，括號裡是作者和時間，接著是行號，最右邊才是程式碼本身。
例如第 6、7 行，是 Bob 在五月二十號加的。
注意第 9 行的編號前面有一個 ^ 符號。
它代表這一行從第一個 commit 就存在，之後從來沒被改過。
-->

---
layout: default
---

# git blame：欄位說明

| 欄位 | 說明 |
| ---- | ---- |
| `a3f9d2c` | Commit hash（前 8 碼） |
| `(Alice ...)` | 作者姓名 + 時間 |
| `5)` | 檔案中的行號 |
| `^` 前綴 | 這行來自第一次 commit |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> 找到 commit hash 後，可以用 <code>git show a3f9d2c</code> 查看當時完整的改動脈絡，更了解為什麼這樣寫。</div>

<!--
這張表把剛才的欄位整理起來。
左邊是 commit 編號，接著是作者和時間，然後是行號。
前面帶 ^ 符號的，代表這行來自第一次 commit。
找到編號之後，可以用 `git show` 加上編號，看那次 commit 的完整內容。
包括同時改了哪些檔案，還有當時寫的 commit 訊息。
通常光看訊息，就能理解當初為什麼這樣寫。
前提是，那則訊息要寫得清楚。這就是我們下一個主題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## Commit Message 怎麼寫才對？

<!--
下一個主題是 commit message。它是寫給未來的自己和同事看的，重點是「為什麼」要這樣改。
-->

---

# 為什麼 Commit Message 很重要？

<div class="grid grid-cols-2 gap-8" style="margin-top: 1rem;">
<div>

**爛 message 的 git log：**

```
* fix
* 改東西
* 測試一下
* aaa
* wip
* 終於好了
```

</div>
<div>

**好 message 的 git log：**

```
* fix: 修正登入頁 token 過期不跳轉的問題
* feat: 新增使用者頭像上傳功能
* refactor: 拆分 AuthService 降低耦合
* docs: 更新 API 認證流程說明
* chore: 升級 axios 至 1.6.0
```

</div>
</div>

<!--
大家看左邊的 log。
六個月後，我們還知道 fix 修了什麼嗎？aaa 又是什麼？
這些訊息在當下覺得夠用，但過一個禮拜，連自己都看不懂。
右邊的 log，每一行都說清楚改動的類型和內容。
例如 fix 開頭，說明修正了登入頁 token 過期不跳轉的問題。
改了什麼，看程式碼的差異就知道。
commit message 真正的價值，是留下背後的原因和脈絡。
-->

---

# Commit Message 格式規範

業界通用格式（Conventional Commits）：

```
<type>(<scope>): <subject>

<body>

<footer>
```

<div class="grid grid-cols-3 gap-4" style="margin-top: 1rem;">

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 8px; padding: 0.8rem;">
  <div style="font-weight:700; color:#92400e; margin-bottom:0.4rem;">第一行（必填）</div>
  <div style="font-size:0.85rem; color:#78350f;">type + scope + subject<br>50 字以內，不加句點</div>
</div>

<div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 0.8rem;">
  <div style="font-weight:700; color:#14532d; margin-bottom:0.4rem;">Body（選填）</div>
  <div style="font-size:0.85rem; color:#166534;">空一行後說明<br>「為什麼」和「做了什麼」</div>
</div>

<div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 0.8rem;">
  <div style="font-weight:700; color:#1e40af; margin-bottom:0.4rem;">Footer（選填）</div>
  <div style="font-size:0.85rem; color:#1d4ed8;">關聯 issue、<br>BREAKING CHANGE</div>
</div>

</div>

<!--
這是業界通用的格式，叫做 Conventional Commits，很多開源專案和公司都在用。
它分成三個部分，只有第一行是必填的。
第一行的格式是 type、括號裡的 scope，然後冒號接上 subject。
type 說明這次改動的類型，scope 說明影響範圍，可以省略，subject 是簡短描述。
第一行建議在 50 個字以內，不加句點。
空一行之後是 body，說明為什麼改、改了什麼。
最後的 footer，用來關聯 issue 或標記重大變更。
-->

---

# Type 類型對照表

| Type | 說明 | 是否改程式碼 |
| --- | --- | --- |
| `feat` | 新功能 | ✅ |
| `modify` | 調整既有功能（非 bug） | ✅ |
| `fix` | 修復 Bug | ✅ |
| `refactor` | 重構（不新增功能也不修 bug） | ✅ |
| `revert` | 還原先前的 commit | ✅ |
| `docs` | 文件變更 | ❌ |
| `style` | 格式調整（不影響邏輯） | ❌ |
| `test` | 新增或修改測試 | ❌ |
| `chore` | 雜務（依賴更新、設定檔） | ❌ |

<!--
這張表列出常見的 type。
最常用的是 feat、fix、docs、refactor 和 chore。
要特別注意兩個容易誤會的。
style 指的是程式碼格式的調整，例如縮排、空白，不是 CSS 樣式。
refactor 是重構，也就是在功能不變的前提下，整理程式的結構。
有了這些分類，光看 log 就能快速篩出想找的類型。
例如只看 fix 的 commit，追查某個 bug 是什麼時候修的。
-->

---

# Subject 第一行：寫作原則

<div style="margin-bottom: 1rem;">

| 原則 | 說明 | 範例 |
| --- | --- | --- |
| 限 50 字內 | 超過會被 GitHub 截斷 | ✅ `fix: 修正登入頁 token 驗證` |
| 用祈使句 | 描述「這個 commit 做了什麼」 | ✅ `新增` 而非 `新增了` |
| 不加句點 | 標題不需要句號 | ✅ `feat: 新增搜尋功能` |
| 用中文或英文統一 | 團隊一致即可 | 避免中英文混搭 |

</div>

<div class="grid grid-cols-2 gap-6">
<div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 0.8rem;">

**❌ 不好的寫法**
```
fixed the bug
改了一些登入相關的東西
update
wip: 還沒完成
```

</div>
<div style="background: #f0fdf4; border-left: 4px solid #16a34a; border-radius: 4px; padding: 0.8rem;">

**✅ 好的寫法**
```
fix: 修正登入頁 token 過期不跳轉
feat: 新增第三方 OAuth 登入流程
refactor: 拆分 AuthController
```

</div>
</div>

<!--
第一行是最重要的部分，因為 `git log --oneline` 只會顯示這一行。
長度盡量控制在 50 個字以內，太長在 GitHub 和很多工具上會被截斷。
第二個原則是用祈使句。
想像每個 commit 訊息前面都有一句隱形的「這個 commit 會」。
所以寫「新增搜尋功能」，而不是「新增了搜尋功能」。
另外標題不加句點，團隊裡也要統一用中文或英文，不要混著用。
對照下面兩欄，左邊的 fixed the bug、update，都看不出改了什麼。
右邊的每一行，都能一眼看懂。
-->

---

# Body 和 Footer：何時需要？

**Body — 說明「為什麼」和「怎麼做」**

```
fix: 修正使用者登出後仍可存取私有頁面的問題

原本的 JWT 驗證只檢查 token 是否存在，
沒有驗證 token 是否已被列入黑名單（登出後加入）。
改為每次請求都對 Redis 黑名單做一次查詢。

影響範圍：所有需要認證的 API endpoint。
```

**Footer — 關聯 issue 或標記破壞性變更**

```
feat: 重構使用者認證模組

BREAKING CHANGE: auth() 方法簽名改變，
需更新所有呼叫端傳入 options 物件。

Closes #142
Refs #138
```

<!--
body 不是每次都要寫。
但如果改動的原因不明顯，或是在幾個做法中選了一個，就值得寫下來。
上面的範例，body 說明了原本的 JWT 驗證少了黑名單檢查，現在改成每次都查一次。
還寫出了影響範圍，看的人馬上就知道要注意哪裡。
footer 的 Closes 加上 issue 編號，在 GitHub 上有特別的效果。
這個 commit 合併進主分支時，對應的 issue 會自動關閉。
BREAKING CHANGE 則是提醒大家，這次的改動會影響呼叫端，升級時要跟著調整。
-->

---

# 完整範例對比

<div class="grid grid-cols-2 gap-6">
<div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 1rem;">

**❌ 糟糕的 commit**

```bash
git commit -m "fix bug"
git commit -m "update"  
git commit -m "ok now"
git commit -m "改了密碼功能"
git commit -m "WIP"
```

問題：
- 不知道 fix 了什麼 bug
- 不知道 update 了什麼
- 無法追蹤問題來源

</div>
<div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 1rem;">

**✅ 專業的 commit**

```bash
git commit -m \
  "fix: 修正密碼重設信件未發送的問題

  SMTP 設定在 staging 環境少了 TLS 設定，
  導致信件靜默失敗。已補上環境變數。

  Closes #87"
```

優點：
- 類型清楚（fix）
- 說明了根本原因
- 關聯對應 issue

</div>
</div>

<!--
我們把兩種寫法放在一起比較。
左邊的 fix bug、update、ok now，一個月後就沒有任何參考價值。
右邊這個 commit，類型是 fix，說明了密碼重設信沒寄出去的根本原因。
原來是 staging 環境少了 TLS 設定，最後還關聯了 issue 87。
就算過了一年，我們也能從訊息裡知道當時發生了什麼。
對團隊來說，好的 commit message 是很難取代的資產。
程式碼可以重寫，但「為什麼這樣設計」的脈絡一旦遺失，就很難找回來。
-->

---

# 團隊實踐建議

<div style="margin-top: 0.5rem;">

| 建議 | 說明 |
| --- | --- |
| 統一語言 | 全中文或全英文，不混用 |
| 引入 commitlint | 自動檢查格式，CI 不通過就不讓 push |
| 搭配 Git hook | `commit-msg` hook 在本機就攔截不符規範的 message |
| 善用 GitHub Desktop + Copilot | GitHub Desktop 內建 Copilot 可根據 diff 自動產生 commit message |
| WIP commit 要整理 | feature branch 上可以有 WIP，merge 前用 `rebase -i` 整理 |

</div>

<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**一句話原則：** 寫 commit message 時，假設你的讀者是「六個月後第一次看這段歷史、完全不知道當時發生什麼的自己」。

</div>

<!--
要讓規範真正落地，最有效的方式是交給工具，而不是靠每個人自律。
commitlint 可以在 CI 裡自動檢查格式，不符合就不讓程式碼合併。
`commit-msg` hook 則是在本機 commit 的時候就先攔下來。
GitHub Desktop 內建的 Copilot，還能依照改動自動產生 commit message。
開發途中的 WIP commit 也沒問題，合併前用 `rebase -i` 整理好就好。
寫訊息時，就假設讀者是六個月後、什麼都不記得的自己。
-->

---

# 什麼時候該 Commit？

<br>

<div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 1rem 1.2rem; border-radius: 4px;">
  沒有標準答案，但以下是常見的好時機：
</div>

<br>

| 時機 | 說明 |
| --- | --- |
| 完成一個功能或修復一個 Bug | 有明確意義的改動單元 |
| 下班或離開電腦前 | 確保工作不遺失 |
| 準備嘗試風險性改動前 | 先建立安全點，方便後退 |
| 程式碼可以正常執行時 | 避免 commit 壞掉的程式 |

<!--
「什麼時候該 commit」也是很常被問的問題。
沒有標準答案，但大原則是，一個 commit 應該代表一個有意義的工作單元。
完成一個功能、修好一個 bug，或是要嘗試有風險的改動之前，都是好時機。
不要在一個 commit 裡混著修 bug、加功能和改格式。
也不要每改一行就 commit 一次。
如果發現 commit 訊息越來越難寫，通常代表這次改動太雜，應該拆開。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## 【狀況題】檔案忽略 `.gitignore`

<!--
接下來進入狀況題。第一個是：有些檔案，我們根本不想放進 Git。
-->

---
layout: default
---

# 有些檔案我不想放在 Git 裡…

### 問題場景

開發專案時，有些東西我們不希望被追蹤：

| 類型 | 例子 |
| ---- | ---- |
| 機密設定 | `secret.yml`、`.env`、`config/database.yml` |
| 編譯產物 | `*.class`、`dist/`、`__pycache__/` |
| IDE 設定 | `.idea/`、`.vscode/`、`*.suo` |
| 作業系統 | `.DS_Store`、`Thumbs.db` |
| 套件目錄 | `node_modules/`、`vendor/` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> 把資料庫密碼或 AWS 金鑰 commit 進去是很常見的資安事故，.gitignore 是第一道防線。</div>

<!--
開發的時候，有幾類檔案不應該被追蹤。
最危險的是機密設定，像 `.env` 或資料庫的密碼檔。
一旦推上 GitHub，就算之後刪掉，別人還是能從歷史紀錄裡撈回來，這是很常見的資安事故。
其他像編譯產物、IDE 的個人設定，會讓 `git status` 變得一團亂。
`node_modules` 這種套件資料夾，動輒幾百 MB，也完全不需要版控。
解法就是 `.gitignore`。
它的作用，是明確告訴 Git：「這些檔案我知道，不用管它們。」
-->

---
layout: default
---

# .gitignore 設定規則

### 語法對照

| 寫法 | 說明 |
| ---- | ---- |
| `secret.yml` | 忽略根目錄下的 secret.yml |
| `config/database.yml` | 忽略特定路徑下的檔案 |
| `*.tmp` | 忽略所有 .tmp 副檔名 |
| `/db/*.sqlite3` | 忽略 /db 目錄下所有 .sqlite3 |
| `node_modules/` | 忽略整個目錄（含子目錄） |
| `!important.log` | 例外：不忽略這個檔案 |
| `#` 開頭 | 這是註解行 |

<!--
`.gitignore` 的語法很直覺，一行寫一條規則。
直接寫檔名，就是忽略那個檔案；星號是萬用字元，`*.tmp` 代表所有 tmp 檔。
有兩個地方要注意。
第一，要忽略整個資料夾，結尾要加斜線，像 `node_modules/`。
第二，驚嘆號開頭代表例外。
例如先用 `*.log` 忽略所有 log，再寫一條驚嘆號接 important.log，就能把這一個留下來。
井字號開頭的則是註解。
-->

---
layout: default
---

# .gitignore 設定規則（續）

### 建立與提交

```bash
# 建立 .gitignore
touch .gitignore

# 把 .gitignore 本身也加入版控，讓團隊共享規則
git add .gitignore
git commit -m "Add .gitignore"
```

<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

`.gitignore` 一定要 commit 進去，整個團隊才能共享相同的忽略規則，不然每個人 `git status` 的結果都不同。

</div>

<!--
`.gitignore` 本身就是一個普通的文字檔，用 touch 或編輯器建立都可以。
重點是，它自己一定要 commit 進去。
這樣整個團隊才會共用同一套忽略規則。
不然每個人跑 `git status`，看到的結果都不一樣。
-->

---
layout: default
---

# .gitignore 常用樣板（一）

### Java / Spring Boot / Eclipse

```text
# Java / Maven / Gradle
target/
*.class
*.jar
*.war
*.ear
*.nar
.mvn/
!**/src/main/**/target/
!**/src/test/**/target/

# Spring Boot
application-local.properties
application-local.yml

# Eclipse
.classpath
.project
.settings/
bin/
```

<!--
接下來看幾個常用的樣板，先看後端的部分。
Maven 和 Gradle 編譯出來的 target 資料夾不需要版控，每次 build 都會重新產生。
Spring Boot 的本機設定檔，通常放著資料庫密碼或 API key。
這些絕對不能進 repo。
Eclipse 的 classpath、project 這些檔案，是每個人的 IDE 設定。
每個人的環境都不一樣，也不應該共享。
-->

---
layout: default
---

# .gitignore 常用樣板（二）

### VS Code / Angular / OS

```text
# VS Code
.vscode/
!.vscode/extensions.json

# Angular
node_modules/
dist/
.angular/
*.env
*.env.local
npm-debug.log*
yarn-error.log

# OS
.DS_Store
Thumbs.db
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> 建立新專案時，GitHub 會在 repo 建立時提供選擇 .gitignore 樣板的選項，直接套用即可。</div>

<!--
再來是前端和作業系統的部分。
VS Code 的 `.vscode` 資料夾放的是個人設定，所以整個忽略。
但下一行用驚嘆號把 extensions.json 留下來，讓團隊共享推薦的擴充套件。
Angular 的 `node_modules`、`dist` 和 `.angular` 快取，都不應該進版控。
最後是作業系統自動產生的檔案。
macOS 的 `.DS_Store` 和 Windows 的 `Thumbs.db`，加進來可以讓 `git status` 乾淨很多。
另外，在 GitHub 建立 repo 時，也可以直接選擇現成的 `.gitignore` 樣板。
-->

---
layout: default
---

# 已追蹤的檔案怎麼辦？

### .gitignore 只對「還沒被追蹤」的檔案有效

如果檔案已經被 commit 過，.gitignore 加了規則也沒用——需要手動從追蹤清單移除：

| 情境 | 指令 |
| ---- | ---- |
| 停止追蹤但保留本地檔案 | `git rm --cached <filename>` |
| 停止追蹤整個目錄 | `git rm --cached -r <dirname>/` |
| 強制加入被忽略的檔案 | `git add -f <filename>` |
| 清除所有被忽略的檔案 | `git clean -fX` |

```bash
# 假設 secret.yml 已經被 commit 過了
git rm --cached secret.yml
# 然後確認 .gitignore 裡有 secret.yml
echo "secret.yml" >> .gitignore
git commit -m "Stop tracking secret.yml"
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">⚠️ <b>注意：</b> git rm --cached 只是讓 Git 「忘記」追蹤這個檔案，不會刪除你本地的實際檔案。但其他人 pull 之後，他們本地的那份檔案會被刪除。</div>

<!--
這是很多人都踩過的坑。
加了 `.gitignore`，結果 `node_modules` 早就 commit 進去了，規則完全沒效。
關鍵是，`.gitignore` 只對還沒被追蹤的檔案有效。
已經在版本庫裡的檔案，要先用 `git rm --cached` 把它從追蹤清單移除。
`--cached` 的意思是，只讓 Git 忘記這個檔案，不會刪掉我們電腦上的實際檔案。
下面的範例就是這個流程。
先移除追蹤，確認 `.gitignore` 裡有這條規則，再 commit。
要注意的是，其他人 pull 之後，他們電腦上的那份檔案會被刪除，記得先提醒大家備份。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
## 【狀況題】刪除、改名與空目錄

<!--
下一個狀況題：刪除、改名和空目錄。直接用系統指令操作，Git 可能看不懂發生了什麼。
-->

---

# 核心觀念：刪除和改名都是「修改」

<br>

<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 1rem 1.2rem; border-radius: 4px; margin-bottom: 1rem;">
  在 Git 裡，不管是刪除檔案或是變更檔名，對 Git 來說都是一種「<strong>修改（Modification）</strong>」，同樣需要 <code>git add</code> 後才能 <code>commit</code>。
</div>

<br>

| 動作 | Git 的解讀 |
| --- | --- |
| 刪除檔案 | 「這個檔案被移除了」→ 需要提交這個變更 |
| 改名/移動檔案 | 「舊檔案刪了 + 新檔案新增了」→ Git 會偵測為 renamed |

<!--
很多人以為刪掉一個被追蹤的檔案，Git 就自動記錄了。
其實不是。
在 Git 眼中，刪除和改名都是一種「修改」。
跟新增、修改檔案一樣，都要走 add 再 commit 的流程。
改名的話，Git 會看內容來判斷。
新檔案和舊檔案的內容夠相似，Git 就會認出這是改名，顯示成 renamed。
而不是一個檔案被刪掉、另一個檔案被新增。
-->

---

# 刪除檔案的兩種方法

| 方法 | 指令 | 說明 |
| --- | --- | --- |
| 方法一：OS 刪除後手動 add | `rm welcome.html` → `git add welcome.html` | 兩個步驟 |
| 方法二：直接用 git rm | `git rm welcome.html` | 一步完成，自動暫存 |
| 停止追蹤但保留檔案 | `git rm welcome.html --cached` | 從 Git 移除但不刪實體檔案 |

```bash
# 方法二（推薦）：一步到位
$ git rm welcome.html
rm 'welcome.html'

$ git status
# Changes to be committed: deleted: welcome.html

$ git commit -m "移除 welcome.html"
```

<!--
刪除檔案有兩種方法。
第一種是用系統的 rm 刪掉，再用 `git add` 把刪除這件事放進暫存區，總共兩步。
第二種是直接用 `git rm`，一步就同時刪除檔案、並把刪除放進暫存區。
看下面的範例，執行 `git rm` 之後，`git status` 會顯示 deleted，而且已經在暫存區了。
接著 commit 就完成了。
表格最後一行的 `--cached`，剛才看過。
它只讓 Git 停止追蹤，不會刪掉實際的檔案。
-->

---

# 變更檔名的兩種方法

| 方法 | 指令 | 說明 |
| --- | --- | --- |
| 方法一：OS mv 後 add all | `mv hello.html world.html` → `git add --all` | 兩步，Git 自動偵測為 renamed |
| 方法二：直接用 git mv | `git mv hello.html world.html` | 一步完成，直接顯示 renamed |

```bash
# 方法二（推薦）：一步到位
$ git mv hello.html world.html

$ git status
# Changes to be committed: renamed: hello.html -> world.html

$ git commit -m "將 hello.html 重新命名為 world.html"
```

<!--
改名的邏輯跟刪除一樣。
第一種方法是先用系統的 mv 改名，再用 `git add --all`，Git 會自動偵測成改名。
第二種方法是直接用 `git mv`，一步完成。
範例裡，`git mv` 把 hello.html 改成 world.html。
`git status` 馬上顯示 renamed，接著 commit 就好。
要注意，如果改名的同時又大幅修改了內容，Git 可能認不出來。
這時它會當成刪掉一個檔案、新增另一個檔案。
-->


---

# Git 不追蹤空目錄

<br>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px; margin-bottom: 1rem;">
  <strong>Git 只追蹤「檔案」，不追蹤「目錄」本身。</strong><br>
  一個空的目錄對 Git 來說等於「不存在」。
</div>

<br>

```bash
$ mkdir images/       # 建立空目錄

$ git status
# nothing to commit, working tree clean  ← Git 完全看不到 images/
```

<!--
再來是一個讓很多人意外的行為：Git 不追蹤空目錄。
範例裡，我們建立了一個空的 images 資料夾。
但 `git status` 卻顯示 nothing to commit，Git 完全看不到它。
這是因為 Git 只追蹤「檔案」。
在 Git 的設計裡，資料夾是由它裡面的檔案組成的。
裡面什麼都沒有，對 Git 來說就等於不存在。
很多人想把 logs 或 uploads 這種空資料夾 commit 進去，就會卡在這裡。
-->

---

# 解法：在目錄內放一個 `.gitkeep` 檔案

| 步驟 | 指令 | 說明 |
| --- | --- | --- |
| 1 | `mkdir images` | 建立目錄 |
| 2 | `touch images/.gitkeep` | 在目錄內放一個空的佔位檔 |
| 3 | `git add images/.gitkeep` | 讓 Git 追蹤這個檔案（連帶追蹤目錄） |
| 4 | `git commit -m "新增 images 目錄"` | 提交 |

```bash
$ mkdir images
$ touch images/.gitkeep
$ git add images/.gitkeep
$ git commit -m "新增 images 目錄結構"

$ git status
# On branch main — nothing to commit, working tree clean ✓
```

<!--
解法很簡單，在資料夾裡放一個空的佔位檔，通常叫 `.gitkeep`。
步驟是先建立資料夾，用 touch 放一個 `.gitkeep`。
接著 add 這個檔案並 commit。
Git 追蹤了這個檔案，就會連帶記住它所在的資料夾。
這樣其他人 clone 下來之後，也會有一樣的資料夾結構。
logs、uploads 這類需要預先建立的資料夾，特別適合這樣做。
-->

---

# 小結：`.gitkeep` 慣例

<br>

| 問題 | Git 的回答 |
| --- | --- |
| Git 能追蹤空目錄嗎？ | 不行，Git 只追蹤檔案 |
| 那怎麼把空目錄 commit 進去？ | 在目錄裡放一個 `.gitkeep` 空檔案 |
| `.gitkeep` 是 Git 的官方功能嗎？ | 不是，這只是社群約定的命名慣例 |
| `.gitkeep` 的檔名一定要這樣嗎？ | 不一定，任何空檔案都可以，但 `.gitkeep` 是最被廣泛接受的命名 |

<!--
我們整理一下。
Git 不能追蹤空目錄，所以我們放一個 `.gitkeep` 空檔案進去。
`.gitkeep` 不是 Git 的官方功能，只是社群約定的命名。
其實任何空檔案都可以，但這個名字大家一看就懂。
它的意思是：「這個資料夾要保留，只是現在是空的。」
還有一個進階用法。
在 `.gitignore` 裡先忽略資料夾的所有內容，再用驚嘆號把 `.gitkeep` 排除在外。
這樣資料夾結構會保留，裡面的實際檔案則不會被 commit。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
## 【狀況題】還原與修復

<!--
最後一個狀況題，也是大家最想知道的：出錯了怎麼辦？好消息是，Git 的大部分操作都救得回來。
-->

---
layout: default
---

# 狀況 1：啊！不小心把檔案刪掉了…

### 問題場景

執行 `rm important.html` 之後才發現刪錯了，或是用 `git rm` 不小心把已追蹤的檔案刪掉。

### 三種誤刪情境

| 情境 | 狀態 | 救援方式 |
| ---- | ---- | -------- |
| 在 Working Directory 刪除 | Git 看到「已刪除但未暫存」 | `git restore <file>` |
| 已執行 `git rm`（進入暫存區） | Git 看到「已暫存的刪除」 | `git restore --staged <file>` 再 `git restore <file>` |
| 已 commit 的刪除 | 在歷史紀錄裡 | `git checkout HEAD~1 -- <file>` |

<!--
誤刪檔案是最常見的狀況之一。
好消息是，只要 `.git` 還在，幾乎都救得回來。
重點是先搞清楚，刪到哪一步了。
如果只是用 rm 刪掉，檔案只在工作目錄消失，用 `git restore` 就能還原。
如果已經 `git rm`，刪除動作進了暫存區，就要先撤回暫存，再還原檔案。
如果連 commit 都做了，就要從上一個 commit 把檔案拿回來。
不確定是哪一種，先跑 `git status` 看看。
-->

---
layout: default
---

# 救回誤刪檔案：實際操作（一）

```bash
# 情境 A：用 rm 刪掉了（只在工作目錄）
$ rm welcome.html
$ git status
    deleted: welcome.html  # 未暫存

$ git restore welcome.html  # 立刻救回
```

```bash
# 情境 B：已經 git rm（進暫存區了）
$ git rm welcome.html
$ git status
    deleted: welcome.html  # 已暫存

$ git restore --staged welcome.html  # 先退出暫存
$ git restore welcome.html           # 再還原檔案
```

<!--
我們看前兩種情境的實際操作。
情境 A，只是用 rm 刪掉。
`git status` 顯示 deleted，但還沒暫存，這時一個 `git restore` 就能立刻救回。
情境 B，已經用 `git rm` 刪掉，刪除已經進了暫存區。
這時要分兩步。
先用 `git restore --staged`，把刪除從暫存區撤回。
再用 `git restore`，把檔案還原到工作目錄。
因為三個區域是各自獨立的，救援也要一區一區處理。
-->

---
layout: default
---

# 救回誤刪檔案：實際操作（二）

```bash
# 情境 C：已 commit 的刪除（從歷史紀錄撈回）
$ git log --oneline
a1b2c3d (HEAD) 刪掉 welcome.html
e4f5g6h 上一版

$ git checkout HEAD~1 -- welcome.html  # 從上一個 commit 取出
$ git status
    new file: welcome.html  # 已暫存，再 commit 即可
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> 情境 A/B 可用 <code>git restore</code>；情境 C 需要 <code>git checkout HEAD~N -- filename</code> 從特定 commit 取回檔案。</div>

<!--
情境 C，刪除已經 commit 了。
先用 `git log --oneline` 確認，最新的 commit 就是刪掉 welcome.html 的那一個。
那它的上一個 commit，也就是 HEAD 往前一步，檔案還在。
所以我們用 `git checkout`，指定從 HEAD 往前一步的版本，把 welcome.html 拿出來。
執行後，`git status` 會顯示 new file，而且已經在暫存區了。
再 commit 一次就完成救援。
如果要從更早的版本拿，把數字改成往前幾步就可以。
-->

---
layout: default
---

# 狀況 2：剛才的 Commit 後悔了，想拆掉重做

### 問題場景

commit 完才發現少了一個檔案、訊息寫錯，或是整個 commit 的內容都不對，想重來。

### git reset 的三種模式

| 模式 | 工作目錄 | 暫存區 | 說明 |
| ---- | -------- | ------ | ---- |
| `--soft` | 保留 | 保留 | 只撤銷 commit，檔案改動還在暫存區，可直接重新 commit |
| `--mixed`（預設） | 保留 | 清除 | 撤銷 commit + 清空暫存區，改動退回工作目錄 |
| `--hard` | 清除 | 清除 | 完全丟棄，commit 和所有改動都不見 |

```bash
git reset HEAD~1           # --mixed 模式（預設）
git reset HEAD~1 --soft    # 保留暫存狀態
git reset HEAD~1 --hard    # 完全清除（危險！）
```

<!--
第二個狀況：剛才的 commit 後悔了，想拆掉重做。
這時候用 `git reset`，它有三種模式。
記憶的方式是想成「要回到哪個狀態」。
`--soft` 回到剛 add 完、準備 commit 的狀態，改動還在暫存區。
`--mixed` 是預設模式，回到剛改完程式、還沒 add 的狀態。
`--hard` 則是完全丟棄，連改動都不見。
指令裡的 HEAD 波浪號 1，代表前一個 commit，波浪號 2 就是前兩個。
`--hard` 會真的清掉檔案內容，使用前一定要想清楚。
-->

---
layout: default
---

# git reset 實際範例

```bash
# 情境：commit 完發現訊息寫錯，想重寫
$ git log --oneline
a3f9d2c (HEAD) fix bug         # 想拆掉這個
81bce44 Add new feature

# 撤銷最後一個 commit，改動退回暫存區（--soft）
$ git reset HEAD~1 --soft

# 現在可以重新 commit
$ git commit -m "修正: 正確的 commit 訊息"
```

```bash
# 情境：commit 了不該 commit 的東西，要重新整理
$ git reset HEAD~1           # --mixed，改動退回工作目錄
# 重新整理後...
$ git add 正確的檔案.txt
$ git commit -m "只 commit 該 commit 的東西"
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">⚠️ <b>注意：</b> 如果這個 commit 已經 push 到遠端，reset 之後要強制 push（<code>git push --force</code>），這會影響到其他人。公共分支上慎用。</div>

<!--
我們看兩個實際的例子。
第一個，commit 完發現訊息寫錯了。
用 `--soft` 撤銷最後一個 commit，改動還在暫存區，直接重新 commit 一次就好。
第二個，commit 了不該 commit 的東西。
用預設的 `--mixed`，改動會退回工作目錄。
重新挑選要 add 的檔案之後，再 commit。
要特別注意下面的提醒。
如果這個 commit 已經推上遠端，reset 之後就得強制推送，會影響其他人。
推上去的 commit，比較安全的做法是用 `git revert`，這個後面的章節會介紹。
-->

---
layout: default
---

# 狀況 3：不小心用 --hard Reset 了，救得回來嗎？

### 好消息：Git 有 reflog 這個安全網

`git reflog` 記錄了 HEAD 的每一次移動——包括 reset、checkout、commit 等操作。

```bash
$ git reflog
657fce7 (HEAD -> master) HEAD@{0}: reset: moving to HEAD~2
e12d8ef (origin/master)  HEAD@{1}: commit: Add login feature
85e7e30                  HEAD@{2}: commit: Fix navbar style
d3c1a9b                  HEAD@{3}: commit: Initial commit
```

```bash
# 從 reflog 找到要救回的 commit hash
# 用 --hard reset 回去
$ git reset e12d8ef --hard
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> reflog 預設保留 90 天的紀錄。在這個時間內，幾乎所有的「誤操作」都有機會救回來。</div>

<!--
第三個狀況：不小心用 `--hard` reset 了，還救得回來嗎？
答案是可以。
`git reset --hard` 聽起來很可怕，但 Git 其實沒有真的刪掉那些 commit。
它只是把分支指向的位置往回移，讓那些 commit 暫時看不見。
`git reflog` 就像 HEAD 的日記，記錄它每一次移動，包括 commit、reset、checkout。
範例裡，最上面那一行就是剛才的 reset。
往下一行，就是 reset 之前所在的 commit。
找到它的編號，再 reset 回去，一切就恢復了。
reflog 預設保留 90 天，在這段時間內，大部分誤操作都救得回來。
-->

---
layout: default
---

# reflog 救援完整流程

```bash
# Step 1：確認現在狀況（發現東西不見了）
$ git log --oneline
657fce7 (HEAD -> master) Old commit  # 最新的兩個 commit 不見了！

# Step 2：查看 reflog 找到失蹤的 commit
$ git reflog
657fce7 HEAD@{0}: reset: moving to HEAD~2
e12d8ef HEAD@{1}: commit: Add login feature  # 這是我要的！
85e7e30 HEAD@{2}: commit: Fix navbar style   # 這個也要

# Step 3：reset 回去
$ git reset e12d8ef --hard

# Step 4：確認救回成功
$ git log --oneline
e12d8ef (HEAD -> master) Add login feature   # 回來了！
85e7e30 Fix navbar style
657fce7 Old commit
```

<!--
我們把完整的救援流程走一次。
第一步，用 `git log` 發現最新的兩個 commit 不見了。
第二步，打開 `git reflog`，找到 reset 之前的那筆紀錄。
Add login feature 的編號，就是我們要的。
第三步，用 `git reset --hard` 加上這個編號，跳回去。
第四步，再用 `git log` 確認，三個 commit 都回來了。
整個過程的關鍵是冷靜。
先查 reflog，不要在慌亂中又做了其他操作。
-->

---
layout: default
---

# 練習 1：設定 .gitignore 並救回誤刪檔案

### 任務說明

建立一個練習用的 Git repo，體驗 .gitignore 和 git restore 的實際效果。

1. 建立新目錄並初始化 Git：`mkdir git-practice && cd git-practice && git init`
2. 建立兩個檔案：`touch app.js secret.yml`
3. 建立 `.gitignore`，在裡面加入 `secret.yml`
4. 執行 `git add .` 後確認 `secret.yml` 沒有被加進去（用 `git status`）
5. 只 commit `app.js` 和 `.gitignore`
6. 刪除 `app.js`：`rm app.js`
7. 用 `git restore app.js` 救回它
8. 加入 `node_modules/` 到 .gitignore，然後建立 `node_modules/test.txt`，確認它被忽略

<!--
我們來做第一個練習，從零開始走一次完整流程。
先建立一個 repo，放兩個檔案，其中 secret.yml 要用 `.gitignore` 排除。
接著只 commit app.js 和 `.gitignore`。
然後模擬誤刪 app.js，再把它救回來。
最後加入 `node_modules` 的規則，確認裡面的檔案會被忽略。
大家可以先想一想：做完第四步，要怎麼確認 secret.yml 真的沒被加進去？
我們先暫停一下，自己動手試試看。
【講師】給大家十分鐘操作，巡視時特別留意第四步 git status 的結果。
-->

---
layout: default
---

# 練習 1：解題提示

### 提示說明

1. 建立 `.gitignore` 之前就已經存在的檔案，git add 還是會追蹤，要先確認沒有 `git add secret.yml`
2. `git status` 的輸出分三區：「要 commit 的改動」、「未暫存的改動」、「未追蹤的檔案」——學會分辨
3. `rm app.js` 之後，`git status` 應顯示 `deleted: app.js`（未暫存），這時 `git restore app.js` 就能救回
4. 建立 `node_modules/test.txt` 後，執行 `git status` 應該看不到它——如果看到，表示 `node_modules/` 規則沒生效
5. 可以用 `git check-ignore -v node_modules/test.txt` 驗證哪條規則生效了

```bash
# 驗證指令
git status                        # 確認追蹤狀態
git check-ignore -v secret.yml    # 確認忽略規則
git ls-files                      # 列出所有被追蹤的檔案
```

<!--
我們來看解題的重點。
剛才的問題，答案是看 `git status`。
如果 secret.yml 沒有出現在任何區塊，就代表 `.gitignore` 設定成功。
刪掉 app.js 之後，`git status` 應該顯示 deleted 而且還沒暫存，這時 `git restore` 就能救回。
另外介紹兩個驗證工具。
`git check-ignore -v` 會告訴我們，是哪一條規則讓這個檔案被忽略。
`git ls-files` 會列出所有被追蹤的檔案，可以直接確認 secret.yml 不在清單裡。
-->

---
layout: default
---

# 練習 2：用 reset 和 reflog 練習救援

### 任務說明

體驗 git reset 的三種模式，並練習用 reflog 救回被 --hard 掉的 commit。

1. 在上一個練習的 repo 裡，連續建立三個 commit（每次改一行 app.js）
2. 確認 `git log --oneline` 有三個 commits
3. 執行 `git reset HEAD~1 --soft`，觀察 git status 的輸出——改動應在暫存區
4. 執行 `git reset HEAD~1 --mixed`，觀察 git status——改動應在工作目錄
5. 執行 `git reset HEAD~1 --hard`，觀察 git status——改動應全部消失
6. 執行 `git reflog`，找到第三個 commit 的 hash
7. 用 `git reset <hash> --hard` 把它救回來
8. 用 `git log --oneline` 確認三個 commits 都回來了

<!--
第二個練習，要親手體驗 reset 的三種模式，還有 reflog 救援。
先在剛才的 repo 裡，連續做三個 commit。
接著依序用 soft、mixed、hard 三種模式各 reset 一次。
每次 reset 之後，都用 `git status` 觀察改動跑到哪裡去了。
最後用 reflog 找回被 hard 掉的 commit。
大家可以邊做邊想：每一次 reset，commit 去哪了？改動又去哪了？
我們先暫停一下，自己動手試試看。
【講師】給大家十分鐘，成功救回的同學可以協助旁邊的人。
-->

---
layout: default
---

# 練習 2：解題提示

### 提示說明

1. 快速建立三個 commit 的方法：

```bash
echo "v1" > app.js && git add app.js && git commit -m "v1"
echo "v2" > app.js && git add app.js && git commit -m "v2"
echo "v3" > app.js && git add app.js && git commit -m "v3"
```

2. 每次 reset 後，記得用 `git status` 和 `cat app.js` 雙重確認
3. reflog 輸出的格式是 `<hash> HEAD@{N}: <動作描述>`，找到「commit: v3」對應的 hash
4. `git reset <hash> --hard` 後，`cat app.js` 應該顯示 `v3`，`git log --oneline` 應看到三個 commits

```bash
# 確認救援成功
$ git log --oneline
<hash3> (HEAD -> master) v3   # 應該看到這三行
<hash2> v2
<hash1> v1
```

<!--
這裡提供一個快速建立三個 commit 的寫法，這樣就能專心練習 reset。
每次 reset 之後，建議用 `git status` 和 cat app.js 雙重確認。
一個看改動在哪個區域，一個看檔案的實際內容。
回答剛才的問題。
soft 之後改動在暫存區，mixed 之後回到工作目錄，hard 之後就完全消失了。
但那些 commit 都還在 reflog 裡。
找到 commit v3 那一行的編號，reset 回去，`git log` 就會再看到三個 commit。
-->

---
layout: default
---

# 本章總結

### 開始使用 Git：重點回顧


- **`git init` 建立 repository**：所有歷史都在 `.git/` 裡，這個目錄刪了就救不回來

- **add → commit 兩步驟**：`git add` 挑選這次要提交的內容，`git commit` 才真的寫進歷史；add 之後又改檔案，要再 add 一次

- **`git status` 對應三大區域**：綠色是暫存區、紅色是工作目錄的改動與未追蹤檔案；動手前先看一眼

- **`git log` 查歷史、`git blame` 找責任人**：`git log -p -- <file>` 看檔案完整改動歷史；`git blame -L` 定位每行程式碼的作者與 commit

- **Commit Message 用 Conventional Commits**：`type(scope): subject`，第一行 50 字內；說明「為什麼」比「做了什麼」更有價值

- **`.gitignore` 保護機密**：建立之前就追蹤的檔案，要用 `git rm --cached` 才能停止追蹤；`.gitignore` 本身要 commit 進 repo 讓團隊共享

- **出錯有救**：`git restore` 救檔案、`git reset` 三種模式（--soft / --mixed / --hard）、`git reflog` 是 90 天的終極安全網


<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** Ch 11 遠端共同協作 — 使用 GitHub，學會 remote / push / pull / clone / Pull Request

<Link to="ch11" style="color: #d97706; font-weight: 600;">前往 Ch 11 →</Link>

</div>

<!--
我們回顧這章的重點。
`.git` 資料夾存著所有歷史，刪了就救不回來。
add 和 commit 是兩個步驟，add 之後又改了檔案，要再 add 一次。
`git log` 和 `git blame` 是我們的調查工具，出了問題先查歷史。
commit message 用 Conventional Commits 格式，重點寫「為什麼」。
`.gitignore` 越早設越好，機密絕對不能進 repo。
出錯了也不用慌，restore、reset 和 reflog 讓大部分狀況都救得回來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章我們從 `git init` 出發，學會了 add、commit、status 和 log。
也處理了忽略檔案、刪除改名，以及各種救援的狀況。
有了 reflog，我們可以放心地操作，Git 沒那麼容易被搞壞。
下一章，我們要把這些本機的 commit 推上 GitHub，開始跟其他人協作。我們下一章見。
【講師】開放提問，可以請大家分享練習時遇到的狀況。
-->
