---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: Git 底層原理
routeAlias: ch18
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
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">Git 底層原理</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">「理解底層，讓操作更有把握」</p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十八章，Git 底層原理。
前面我們學了很多操作，但有些地方可能只知道怎麼做，不知道為什麼。
這章要把 Git 底層的核心概念拉出來講清楚。
包括物件模型、HEAD 指標、互動式暫存，以及分支的底層設計。
這些不是操作 Git 的必要條件，但理解之後，很多「為什麼 Git 這樣運作」的疑問就會有答案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# Git 物件模型

<!--
第一個主題是物件模型。知道那串編號是什麼，遇到奇怪的問題就不會摸不著頭緒。
-->

---

# Git 的四種物件

Git 以「內容定址儲存（Content-Addressable Storage）」管理所有資料，每個物件以 **SHA-1 雜湊值**命名。


| 物件類型 | 說明 | 類比 |
| --- | --- | --- |
| **Blob** | 儲存檔案內容（不含檔名） | 檔案本身 |
| **Tree** | 儲存目錄結構（檔名 + blob/tree 參照） | 資料夾 |
| **Commit** | 指向一個 tree，記錄作者、時間、訊息、parent | 快照 + 標籤 |
| **Tag** | 指向特定 commit 的具名參照 | 書籤 |



```
Commit  ──► Tree (root)
                ├── blob: README.md
                ├── blob: main.py
                └── tree: src/
                          ├── blob: app.py
                          └── blob: utils.py
```


<!--
Git 用一種叫「內容定址」的方式管理資料。
意思是每個物件，都用它內容算出來的 SHA-1 雜湊值來命名。
Git 一共有四種物件。
Blob 存的是檔案的內容，而且只存內容，不管檔名叫什麼。
Tree 存的是目錄結構，把檔名和對應的 Blob 或子目錄綁在一起，就像資料夾。
Commit 指向一棵完整的 Tree，同時記錄作者、時間、訊息和上一個 commit。
Tag 則像第十四章講的書籤，用一個有意義的名字指向某個 commit。
看下面的圖，一個 commit 指向根目錄的 Tree，Tree 底下再有 Blob 和子目錄。
Git 就是靠這四種物件的組合，還原專案在任何時間點的樣子。
-->

---

# Commit 物件內容

每個 commit 儲存以下資訊：

```bash
# 查看 commit 物件原始內容
git cat-file -p HEAD
```


**輸出範例：**

```
tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
parent a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
author  Jane Doe <jane@example.com> 1717430400 +0800
committer Jane Doe <jane@example.com> 1717430400 +0800

Add login feature

Implement JWT-based authentication with refresh token support.
```



> **重點：** parent 欄位使 commit 形成有向無環圖（DAG），這就是 Git 歷史的核心結構。

<!--
我們可以用 `git cat-file -p HEAD`，直接看目前這個 commit 物件的原始內容。
第一行是 tree，指向這次快照的根目錄。
第二行是 parent，記錄上一個 commit 是誰。
接著是 author 和 committer，記錄誰在什麼時候建立了這個 commit。
最下面才是 commit 訊息。
要特別注意 parent 這個欄位。
每個 commit 都記得自己的上一個，這樣一個接一個，就串成了整條歷史。
在圖論上，這種結構叫做有向無環圖，它就是 Git 歷史的核心。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# HEAD 指標深入解析

<!--
第二個主題是 HEAD。很多指令的行為都和它有關，第十五章看過一次，這裡我們更深入地看。
-->

---
layout: default
---

# HEAD 是什麼東西？

### HEAD = Git 的「你現在在哪裡」指標

HEAD 是一個指向「目前所在位置」的指標，通常指向某個分支，而那個分支再指向最新的 commit。

```bash
# 查看 HEAD 目前指向哪裡
$ cat .git/HEAD
ref: refs/heads/master

# 切換分支後，HEAD 也跟著動
$ git checkout develop
$ cat .git/HEAD
ref: refs/heads/develop
```

<!--
HEAD 就是 Git 的「我們現在在哪裡」。
可以把它想成地圖上那個「你在這裡」的標記。
用 cat 打開 `.git/HEAD`，內容寫著 refs/heads/master，代表目前在 master 分支上。
切換到 develop 之後，再看一次，就變成 refs/heads/develop 了。
所以 HEAD 通常不是直接指向 commit。
而是先指向一個分支，再由分支指向 commit。
-->

---

# HEAD 的相對表示法

| 表示法 | 意思 |
| ------ | ---- |
| `HEAD` | 目前的 commit |
| `HEAD~1` 或 `HEAD^` | 前一個 commit |
| `HEAD~3` | 前三個 commit |
| `HEAD^2` | 合併 commit 的第二個父節點 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

很多 Git 指令都用到它：`git reset HEAD~1`、`git diff HEAD`、`git log HEAD`。`.git/HEAD` 這個檔案就是實際存放這個指標的地方，直接 `cat` 出來看會讓概念更具體。

</div>

<!--
很多指令都會用到 HEAD 的相對表示法。
HEAD 本身代表目前的 commit。
HEAD 加上波浪號 1，或是加上一個 ^ 符號，都代表前一個 commit。
波浪號 3，就是往前數三個。
HEAD ^ 2 比較特別，它代表合併 commit 的第二個父節點，也就是被合併進來的那一邊。
像 `git reset HEAD~1`、`git diff HEAD`，用的都是這套寫法。
-->

---
layout: default
---

# Detached HEAD：HEAD 脫離分支的狀態

### 什麼時候會發生？

當你直接 `git checkout <commit-hash>` 到某個具體的 commit（而不是分支名稱），HEAD 就不再指向分支，而是直接指向那個 commit——這叫做 **detached HEAD**。

```bash
# 觸發 detached HEAD
$ git checkout d7a22b1
Warning: You are in 'detached HEAD' state.

# 這時 .git/HEAD 會直接存 hash，不是 ref
$ cat .git/HEAD
d7a22b1a3f9c2e5b...

# 回到正常狀態：切回分支
$ git checkout master
# 或建立新分支來保留在這個 commit 上的改動
$ git checkout -b new-feature
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">⚠️ <b>注意：</b> 在 detached HEAD 狀態下做的 commit，切回分支後會「孤立」，之後可能被 Git 的垃圾回收清掉。若要保留，記得先建立分支。</div>

<!--
接著回顧 detached HEAD。
當我們用 `git checkout`，接的是一個 commit 編號，而不是分支名稱，就會進入這個狀態。
Git 會跳出警告，這時 `.git/HEAD` 裡存的直接就是 commit 編號。
概念其實很單純。
正常情況下，HEAD 掛在分支上，分支再指向 commit。
detached HEAD，就是 HEAD 跳過了分支這一層，直接指向 commit。
這個狀態很適合用來看舊版本的程式碼。
但如果在這裡做了新的 commit，記得先建立分支保存，否則切回去之後，它們就沒有名字可以找了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 互動式暫存 git add -p

<!--
第三個主題是 `git add -p`，它能讓我們只 commit 一個檔案裡的部分改動。
-->

---
layout: default
---

# 可以只 Commit 一個檔案的部份內容嗎？

### 問題場景

你在 `index.html` 裡同時修改了 header 和 footer，但想把它們分成兩次 commit，讓歷史更清晰。

```bash
# 啟動互動式分塊選擇
git add -p index.html

# 或一次對所有改動過的檔案做選擇
git add -p
```

<!--
想像一下，我們在 index.html 裡，同時改了 header 和 footer。
但這是兩件不相關的事，我們希望分成兩次 commit，讓歷史更清楚。
這時候就用 `git add -p`。
p 代表 patch，它會把檔案的改動切成一塊一塊，Git 叫它 hunk。
然後逐一問我們，這一塊要不要放進暫存區。
後面可以接檔名，只處理一個檔案，也可以不接，一次處理所有改過的檔案。
-->

---

# git add -p：互動式分批暫存

| 選項 | 說明 |
| ---- | ---- |
| `y` | Stage 這個 hunk（變更區塊） |
| `n` | 跳過這個 hunk |
| `s` | 把這個 hunk 切成更小塊 |
| `e` | 手動編輯 hunk 內容 |
| `q` | 離開，不再詢問剩餘的 hunk |
| `?` | 顯示說明 |

<!--
每一塊改動出現時，我們只要按一個字母回答。
y 是放進暫存區，n 是跳過這一塊。
s 會把這一塊再切成更小的幾塊，e 則是手動編輯，可以精細到每一行。
q 是離開，不再詢問剩下的部分，問號則會顯示說明。
最常用的是 y 和 n，遇到一塊太大、裡面混了兩件事，就用 s 把它切開。
-->

---
layout: default
---

# git add -p 實際操作示範

<div style="margin-bottom: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

💡 特別實用：`s`（split）可以把大 hunk 再切小，`e`（edit）可以精細到行。

</div>

```text
$ git add -p index.html
@@ -1,5 +1,5 @@
-<h1>Welcome</h1>
+<h1>Welcome to Our Site</h1>
Stage this hunk [y,n,q,a,d,s,e,?]? y   ← 選 y，stage 這塊

@@ -20,4 +20,4 @@
-<footer>Copyright 2025</footer>
+<footer>Copyright 2026</footer>
Stage this hunk [y,n,q,a,d,s,e,?]? n   ← 選 n，跳過
```

<!--
我們看實際的操作。
執行 `git add -p index.html` 之後，Git 先顯示第一塊改動，標題從 Welcome 改成 Welcome to Our Site。
這是 header 的改動，我們按 y，放進暫存區。
接著顯示第二塊，footer 的年份從 2025 改成 2026。
這次先不要，按 n 跳過。
這樣暫存區裡就只有 header 的改動，footer 的改動還留在工作目錄。
-->

---
layout: default
---

# git add -p 實際操作示範：分次 commit

```bash
# 第一次 commit：只有 header 的改動
$ git commit -m "Update hero heading copy"

# 第二次 commit：footer 的改動
$ git add index.html
$ git commit -m "Update footer copyright year"
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> 用 <code>git diff --staged</code> 確認暫存區的內容後再 commit，確保只有想要的改動被加進去。</div>

<!--
接著分兩次 commit。
第一次直接 commit，這時只會包含 header 的改動。
第二次再 add index.html，把剩下的 footer 改動放進來，然後 commit。
commit 之前，可以用 `git diff --staged`，確認暫存區裡只有我們想要的內容。
養成這個習慣之後，每個 commit 都會是一個完整的意圖。
以後要 cherry-pick 或 revert 某個改動，也容易很多。
如果不習慣指令，第十二章介紹的 GitHub Desktop，也能用滑鼠點選要暫存哪幾行。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 分支底層設計

<!--
第四個主題，我們來揭開 Git 的分支為什麼這麼快、這麼輕量。
-->

---

# 分支只是一個指標檔案

**Git 的分支本質上是：一個存著 commit hash 的文字檔。**

```bash
# 查看分支指標檔案
cat .git/refs/heads/main
# 輸出：a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

cat .git/refs/heads/feature/login
# 輸出：d4e5f6g7h8i9d4e5f6g7h8i9d4e5f6g7h8i9d4e5
```

**.git/refs/heads/ 目錄結構：**

```text
.git/
└── refs/
    └── heads/
        ├── main          (40 bytes 的 SHA-1 hash)
        ├── feature/
        │   ├── login     (40 bytes)
        │   └── payment   (40 bytes)
        └── hotfix/
            └── bug-123   (40 bytes)
```

<!--
Git 的分支，本質上只是一個存著 commit 編號的文字檔。
我們用 cat 打開 `.git/refs/heads/main`，裡面只有一行，就是 main 最新 commit 的編號。
feature/login 也一樣。
看下面的目錄結構。
每個分支就是 refs/heads 底下的一個小檔案。
名稱裡有斜線的分支，像 feature/login，就會放在對應的子資料夾裡。
所以所謂「建立分支」，其實只是建立一個大約 40 個位元組的文字檔而已。
-->

---

# 建立分支不複製任何檔案

**建立分支的代價：建立一個 40 bytes 的檔案。**

```bash
time git branch experiment/try-new-algo
# real    0m0.001s   ← 1 毫秒！
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**設計哲學：** Git 的分支如此輕量，正是為了讓你**毫無心理負擔地開分支**。每個小功能、每個實驗，都值得開一個分支。

</div>

<!--
既然只是建立一個小檔案，建立分支的速度當然非常快。
我們用 time 量一下 `git branch`，大約只要一毫秒。
它不會複製任何程式碼檔案。
這正是 Git 刻意的設計：讓我們開分支時，沒有任何心理負擔。
每個小功能、每個實驗，都值得開一個分支。
-->

---

# 建立分支：Git vs SVN

| | Git | SVN |
|--|-----|-----|
| **分支實作** | 40 bytes 的指標檔 | 複製整個目錄樹 |
| **建立速度** | 毫秒級 | 隨專案大小，可能數分鐘 |
| **儲存空間** | 幾乎零成本 | 完整複製一份 |
| **切換速度** | 快（只更新工作目錄差異） | 慢 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

理解這一點之後，就不會再有「這個改動太小，不值得開分支」的心理負擔了。Git 的分支只是移動一個指標，這個設計讓「頻繁開分支」變成可能。

</div>

<!--
我們拿 Git 和 SVN 做個比較。
SVN 的分支，是把整個目錄真的複製一份。
專案越大，建立分支就越慢，可能要等好幾分鐘，也會佔用一份完整的空間。
Git 的分支只是一個指標檔，建立只要幾毫秒，幾乎不佔空間。
切換分支時，也只需要更新有差異的檔案。
理解這一點之後，就不會再覺得「這個改動太小，不值得開分支」了。
這個設計，也是現代開發流程能大量使用分支的基礎。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# HEAD 與分支追蹤

<!--
最後一個主題，我們把 HEAD 和分支放在一起，看 Git 怎麼追蹤「現在在哪裡」。
-->

---

# HEAD 指標：你現在的位置

**HEAD 是一個特殊指標，永遠指向「你現在的位置」。**

```bash
cat .git/HEAD
# 輸出：ref: refs/heads/main
```

切換分支後：

```bash
git switch feature/login
cat .git/HEAD
# 輸出：ref: refs/heads/feature/login
```

**三層指向關係：**

```text
HEAD → refs/heads/main → a1b2c3d (commit hash)

HEAD 說：「我在 main 分支」
main 說：「我指向 commit a1b2c3d」
commit 說：「我包含這個時間點的所有檔案快照」
```

<!--
剛才看過，`.git/HEAD` 的內容是 refs/heads/main。
用 `git switch` 切換到 feature/login 之後，它就變成 refs/heads/feature/login。
這就形成了三層的指向關係。
HEAD 說：我在 main 分支。
main 說：我指向 a1b2c3d 這個 commit。
commit 說：我包含這個時間點所有檔案的快照。
有了這三層，我們提交新 commit 時，Git 就知道要更新哪個分支的指標。
新的 commit 建立之後，main 往前移，HEAD 也跟著它一起前進。
-->

---

# Detached HEAD 簡介

**當 HEAD 直接指向一個 commit（而非分支）時，就是 detached HEAD：**

```bash
git checkout a1b2c3d    # 直接 checkout 一個 commit hash

cat .git/HEAD
# 輸出：a1b2c3d4e5f6...  ← 直接是 hash，不是 ref: refs/heads/...
```

**Git 會警告你：**

```text
You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.
```

<div style="margin-top: 1rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**Detached HEAD 的風險：** 在此狀態下 commit，不屬於任何分支，切換分支後就「迷失」了。遇到這個警告，記得先開一個分支再操作。

</div>

<!--
最後再看一次 detached HEAD，這次從檔案的角度來看。
直接 checkout 一個 commit 編號之後，`.git/HEAD` 裡就不是 refs 開頭的分支路徑，而是一個 commit 編號。
Git 的警告說得很清楚。
在這個狀態下，可以四處看看、做實驗性的改動，甚至 commit。
但只要切回分支，這些 commit 就不屬於任何分支了。
所以遇到這個警告，如果打算做改動，記得先開一個分支再操作。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章我們深入了 Git 的底層。
從 Blob、Tree、Commit、Tag 四種物件，到 HEAD 和分支指標的運作方式。
也學會用 `git add -p`，把一個檔案的改動拆成好幾個乾淨的 commit。
理解了底層，操作 Git 就會更有把握。
下一章，我們要學習更多進階的操作技巧。我們下一章見。
【講師】開放提問，可以帶大家實際打開 .git 資料夾，看看 HEAD 和 refs 裡的檔案。
-->
