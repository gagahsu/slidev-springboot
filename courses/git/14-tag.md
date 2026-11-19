---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: 標籤
routeAlias: ch14
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
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">標籤</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">「為重要的時刻留下永久的書籤」</p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十四章，標籤。
想像一下，我們在一本喜歡的書裡，最精彩的那一頁夾了一張書籤。
Git 的標籤做的就是這件事，幫某個特定的 commit 留下一個永久的記號。
例如正式發布 1.0 版的那一刻。
這章不長，但在實務上很重要，學完之後，我們就能幫每個發布的版本做好標記。
-->

---
layout: default
---

# Outline

- **使用標籤** — git tag / lightweight tag / annotated tag / 推送標籤
- **【冷知識】標籤跟分支有什麼不一樣？** — 固定指標 vs 移動指標

<!--
這章分成兩個部分。
第一部分是實作：怎麼建立、查看、刪除標籤，以及推送到遠端。
第二部分是原理：標籤和分支在 Git 底層到底有什麼不同。
第二部分很多教學會跳過，但搞懂之後，我們對 Git 的理解會更深一層。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 使用標籤

<!--
第一部分，先來看標籤的實際使用。
-->

---

# 什麼是 Tag？

Tag 就像是在特定的 Commit 上貼一張**永久的便利貼**。

<br>

最常見的用途就是**標記版本號**：

| Tag 名稱 | 代表意義 |
| --- | --- |
| `v1.0.0` | 第一個正式版本 |
| `v2.1.3` | 第二個主版本的第一個次版本的第三個修補版本 |
| `v3.0.0-beta.1` | 第三個主版本的第一個 beta 測試版 |

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">
  版本號通常遵循 <strong>Semantic Versioning（語意化版本）</strong>規範：<br>
  <code>主版本號.次版本號.修補版本號</code>（Breaking.Feature.Patch）
</div>

<!--
Tag，就像在某個 commit 上貼一張永久的便利貼，也就是剛才說的書籤。
最常見的用途，是標記版本號。
大家下載軟體時，應該都看過像 1.2.3 這樣的版本號，這通常遵循「語意化版本」的規範。
第一個數字是主版本，代表有不相容的重大變更。
第二個數字是次版本，代表加了新功能，但仍然相容。
第三個數字是修補版本，代表修了 bug。
後面也可以接 beta 這類標記，表示是測試版。
-->

---

# 兩種標籤類型

Git 有兩種標籤，差別在於儲存的資訊量：

<br>

| 類型 | 指令 | 儲存內容 |
| --- | --- | --- |
| **Lightweight Tag**（輕量標籤） | `git tag v1.0` | 只是一個指向 commit 的指標 |
| **Annotated Tag**（附註標籤） | `git tag -a v1.0 -m "..."` | 獨立的 Git 物件，含作者、日期、訊息 |

<br>

```bash
# Lightweight Tag — 快速打個標籤，不需要附加說明
$ git tag v1.0

# Annotated Tag — 正式版本發布，建議一律用這種
$ git tag -a v1.0 -m "Release v1.0: 第一個正式版本"
```

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">
  正式發布版本請使用 <strong>Annotated Tag</strong>，它記錄了「誰」在「何時」打了這個標籤，對追蹤負責人非常有用。
</div>

<!--
Git 有兩種標籤，差別在於記錄的資訊多寡。
第一種是輕量標籤，Lightweight Tag。
直接 `git tag` 加上名稱，它就只是一個指向 commit 的指標。
第二種是附註標籤，Annotated Tag，要加上 `-a`，並用 `-m` 寫一段說明。
它是一個獨立的 Git 物件，會記錄是誰、在什麼時候打的標籤，還有說明的內容。
正式發布版本時，建議一律使用附註標籤。
GitHub 的 Releases 頁面，顯示的也是這些資訊。
-->

---

# 對過去的 Commit 打標籤

不一定要對「最新的」Commit 打標籤，可以補打歷史上任意一個。

<br>

```bash
# 先查看歷史，找到你想標記的 commit
$ git log --oneline
a4b8c2d (HEAD -> main) 修正登入頁面 bug
9f3e1a5 新增購物車功能
3c7d2b1 完成使用者認證
1a2b3c4 初始化專案

# 對過去的 commit 補打標籤
$ git tag v1.0 3c7d2b1
$ git tag -a v0.9 1a2b3c4 -m "Beta release"
```

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">
  指定 commit hash 時可以只寫前幾個字元，Git 會自動找到對應的 commit（通常 7 個字元就夠了）。
</div>

<!--
標籤不一定要打在最新的 commit 上，歷史上任何一個 commit 都可以補打。
發布當天太忙，忘記打標籤，事後才想到，這種情況很常見。
做法是先用 `git log --oneline` 找到那個 commit 的編號。
再把編號接在 `git tag` 指令的最後面。
範例裡，我們對「完成使用者認證」這個 commit 補打了 v1.0。
也對最早的初始化 commit 補打了一個附註標籤 v0.9。
編號不需要寫完整的 40 個字元，通常前 7 個字元，Git 就能找到對應的 commit。
-->

---

# 查看標籤

```bash
# 列出所有標籤（按字母順序排列）
$ git tag
v0.9
v1.0
v1.1
v2.0

# 用萬用字元篩選
$ git tag -l "v1.*"
v1.0
v1.1

# 查看 annotated tag 的詳細資訊
$ git show v1.0
tag v1.0
Tagger: Alice <alice@example.com>
Date:   Mon Jun  1 10:30:00 2026 +0800

Release v1.0: 第一個正式版本
```

<!--
`git tag` 不加任何參數，會依照字母順序列出所有標籤。
加上 `-l` 和萬用字元，可以篩選，例如只看 v1 開頭的版本。
`git show` 加上標籤名稱，可以看到詳細資訊。
如果是附註標籤，就會顯示 Tagger，也就是打標籤的人，還有日期和說明。
-->

---

# 刪除標籤

```bash
# 刪除本地標籤
$ git tag -d v0.9
Deleted tag 'v0.9' (was 1a2b3c4)

# 刪除遠端標籤
$ git push origin --delete v0.9
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**注意：** `git tag -d` 只刪除本地端。遠端的標籤要另外用 `git push origin --delete <tag>` 處理，兩步驟缺一不可。

</div>

<!--
刪除本機的標籤，用 `git tag -d`，後面接標籤名稱。
但要注意，這只會刪除本機的標籤。
如果標籤已經推上遠端，還要另外用 `git push origin --delete` 把遠端的也刪掉。
本機和遠端，兩個步驟缺一不可。
-->

---

# 推送標籤到遠端

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px; margin-bottom: 1rem;">
  <strong>⚠️ 注意：</strong><code>git push</code> 預設<strong>不會</strong>推送標籤！必須明確指定。
</div>

```bash
# 推送單一標籤
$ git push origin v1.0

# 一次推送所有本地端有但遠端沒有的標籤
$ git push origin --tags
```

<!--
這裡有一個很多人第一次發版都會卡住的地方。
`git push` 預設是不會推送標籤的。
所以 push 完去 GitHub 找，卻找不到剛打好的 Tag。
要推送標籤，必須明確指定。
推送單一個標籤，就在 `git push origin` 後面接上標籤名稱。
想一次推送所有遠端還沒有的標籤，就加上 `--tags`。
-->

---

# 推送標籤到遠端：指令速查

| 動作 | 指令 |
| --- | --- |
| 推送單一標籤 | `git push origin <tag>` |
| 推送全部標籤 | `git push origin --tags` |
| 刪除遠端標籤 | `git push origin --delete <tag>` |

```bash
# 刪除遠端標籤
$ git push origin --delete v0.9
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**建議：** 刪除遠端標籤後，還要執行 `git tag -d <tag>` 把本地端的也一起清掉，保持同步。

</div>

<!--
這張表整理了標籤和遠端相關的指令。
推送單一標籤、推送全部標籤，以及刪除遠端標籤。
建議刪除遠端標籤之後，也用 `git tag -d` 把本機的一起清掉，讓兩邊保持一致。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 【冷知識】標籤跟分支有什麼不一樣？

<!--
第二部分，我們來看標籤和分支在底層有什麼不一樣。這會把 Git 的核心設計講得更清楚。
-->

---

# 相同點：都是「指標」

分支和標籤在 Git 內部都是指向某個 Commit 的**指標（reference）**。

<br>

```text
.git/refs/
├── heads/          ← 分支存在這裡
│   ├── main        （內容：某個 commit hash）
│   └── develop     （內容：某個 commit hash）
└── tags/           ← 標籤存在這裡
    ├── v1.0        （內容：某個 commit/tag hash）
    └── v2.0        （內容：某個 commit/tag hash）
```

<br>

```bash
# 可以直接查看這些純文字檔的內容
$ cat .git/refs/heads/main
a4b8c2d9e1f2...（一個 40 字元的 commit hash）

$ cat .git/refs/tags/v1.0
3c7d2b1a5e8...（lightweight tag 也是一個 commit hash）
```

<!--
先說相同點：分支和標籤，在 Git 內部都是指向某個 commit 的指標。
我們打開 `.git/refs` 這個資料夾來看。
heads 底下放的是分支，tags 底下放的是標籤。
每一個都是一個很小的純文字檔，用 cat 打開，裡面只有一行 commit 的編號。
所以建立一個分支或標籤，Git 只是在硬碟上多存了一個小小的文字檔。
這也是為什麼它們這麼輕量。
那既然都是指標，差別在哪裡呢？
-->

---

# 最大不同：移動 vs 固定

<br>

| | 分支（Branch） | 標籤（Tag） |
| --- | --- | --- |
| **指向** | 目前分支最新的 Commit | 建立時指定的那個 Commit |
| **會不會移動** | 每次新增 Commit 就自動往前移 | 永遠固定，不會移動 |
| **用途** | 標示「目前的開發位置」 | 標示「這個歷史節點很重要」 |

<br>

```text
新增一個 commit 之後：

分支：  A ── B ── C ── D ← main（自動移到最新）
              ↑
             v1.0（標籤永遠留在 B）
```

<!--
最大的差別是：分支會移動，標籤是固定的。
分支指向的是目前最新的 commit，每次新增 commit，它就自動往前移一格。
標籤則永遠停在建立時指定的那個 commit。
可以這樣想。
分支像是「讀到哪裡」的書籤，每天讀完都會往後移。
標籤則是貼在精彩那一頁的便利貼，貼上去就一直留在那一頁。
所以看下面的圖，main 已經走到 D，v1.0 還是留在 B。
不管之後再開發多少次，v1.0 永遠代表那個版本。
-->

---

# Annotated Tag 的特殊性

Annotated tag 不只是一個指標，它本身是一個**獨立的 Git 物件（Tag Object）**。

<br>

```text
Lightweight tag 的結構：
  v1.0 ──────────────────────▶  Commit Object

Annotated tag 的結構：
  v1.0 ──▶  Tag Object  ──▶  Commit Object
              ├── tagger: Alice
              ├── date: 2026-06-01
              └── message: "Release v1.0"
```

<br>

```bash
# 查看 annotated tag 的底層物件類型
$ git cat-file -t v1.0
tag       ← 這是一個 tag 物件

$ git cat-file -t main
commit    ← 分支直接指向 commit 物件
```

<!--
附註標籤還有一個特別的地方，它本身是一個獨立的 Git 物件。
看上面的圖，輕量標籤直接指向 commit。
附註標籤則是先指向一個 Tag 物件，裡面記錄了打標籤的人、日期和說明，再由它指向 commit。
我們可以用 `git cat-file -t` 查看物件的類型。
查 v1.0，結果是 tag，代表這是一個標籤物件。
查 main，結果是 commit，因為分支直接指向 commit。
Git 一共有四種物件：Blob、Tree、Commit 和 Tag，後面的章節會再詳細介紹。
-->

---

# 使用情境整理

<br>

| 需求 | 用什麼 | 原因 |
| --- | --- | --- |
| 正在開發某個功能 | 分支（Branch） | 需要隨著開發持續移動 |
| 標記正式版本發布 | Annotated Tag | 固定且有完整的發布資訊 |
| 本地端快速做個標記 | Lightweight Tag | 輕量、快速、不需要附加說明 |
| CI/CD 自動觸發部署 | Annotated Tag | 有明確的版本語意，工具容易識別 |

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">
  <strong>一句話總結：</strong>分支用於「開發流程」，標籤用於「版本發布」。分支是動態的，標籤是靜態的。
</div>

<!--
最後，用這張表整理一下什麼時候用分支，什麼時候用標籤。
正在開發的功能，需要持續往前，所以用分支。
標記正式發布的版本，用附註標籤。
只是在本機快速做個記號，用輕量標籤就夠了。
很多 CI/CD 系統也會監聽標籤的推送。
例如有人推送了 v1.2.3 這個標籤，就自動部署到正式環境。
一句話總結：分支用於開發流程，是動態的；標籤用於版本發布，是靜態的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章我們學了兩種標籤，學會補打標籤、把標籤推送到遠端。
也看懂了標籤和分支最根本的差異：一個會移動，一個固定不動。
下一章，我們來看開發中其他常見的狀況題。我們下一章見。
【講師】開放提問，可以請大家在自己的練習 repo 打一個附註標籤並推上 GitHub。
-->
