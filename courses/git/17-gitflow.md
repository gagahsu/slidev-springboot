---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: 使用 Git Flow
routeAlias: ch17
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
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">使用 Git Flow</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">「讓團隊協作有規則可循」</p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十七章，使用 Git Flow。
前面幾章，我們學了分支、遠端協作和修改歷史，這些都是工具。
但多人團隊光有工具還不夠，還需要一套大家都遵守的規則。
什麼時候該開新分支？功能做完要合併到哪裡？要怎麼準備一個正式上線的版本？
Git Flow 就是回答這些問題的分支管理規範，學完之後，我們就能用它管理一個團隊的開發流程。
-->

---
layout: default
---

# Outline

- **Git Flow 是什麼？為什麼需要？** — 分支策略 / 團隊協作規範
- **使用 Git Flow** — 五種分支 / 工作流程示範

<!--
這章分成兩個主題。
第一個是概念：為什麼需要 Git Flow，它解決了什麼問題，五種分支各自扮演什麼角色。
第二個是實作：用 git-flow 工具走一遍新功能開發、版本發布和緊急修復的完整流程。
最後再和其他常見的工作流程做比較。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## Git Flow 是什麼？為什麼需要這種東西？

<!--
先從問題出發：如果團隊完全沒有分支規範，會發生什麼事？
-->

---

# 沒有分支規範的混亂

想像一個 5 人開發團隊，沒有任何分支策略：

<div class="grid grid-cols-2 gap-6">
<div>

**常見的混亂情境：**

- 小明把做到一半的功能 push 到 main，整個 build 壞掉
- 小美說「我的機器上是好的啊？」
- 客戶明天要看 demo，但 main 上有三個功能都做到一半
- 線上緊急 bug，但 main 上有五個未測試的功能不能上
- 三個月後想找「上一個版本」，不知道是哪個 commit

</div>
<div>

**問題的根源：**

- 沒有「哪裡永遠是可上線版本」的共識
- 功能開發和發布準備混在一起
- 緊急修復沒有獨立的管道
- 不知道什麼叫做「完成」

</div>
</div>

<br>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px;">

**分支策略解決的核心問題：** 讓團隊對「現在什麼狀態的程式碼在哪裡」有共同的認識。

</div>

<!--
想像一個五個人的開發團隊，沒有任何分支策略。
小明把做到一半的功能推到 main，整個 build 壞掉了。
客戶明天要看 demo，但 main 上有三個功能都只做到一半。
最可怕的是，線上出現緊急 bug，main 上卻有五個還沒測試的功能，根本不能上線。
這時候只能先把那些功能一個一個 revert，修完 bug，再把它們還原回來，稍不注意就出錯。
右邊整理了問題的根源。
團隊沒有「哪裡永遠是可以上線的版本」的共識，功能開發和發布準備也混在一起。
分支策略要解決的核心問題，就是讓大家對「什麼狀態的程式碼在哪裡」有共同的認識。
-->

---

# Git Flow 的起源與設計理念

**Vincent Driessen** 於 2010 年在部落格文章「A successful Git branching model」中提出，至今仍是業界最廣為人知的分支策略。

**核心理念：每種分支有明確的生命週期和責任**

```
main ──────────────────────────────────────────────► （永遠可上線）
  │                                    ↑  ↑
  │                              release  hotfix
  │                                  ↑      ↑
develop ──────────────────────────────────────────► （整合開發）
  │          ↑         ↑        ↑
feature/A  feature/B  feature/C  ...
```

<!--
Git Flow 是 Vincent Driessen 在 2010 年，在一篇部落格文章裡提出的。
文章一發表就引起很大的迴響，因為它清楚描述了很多團隊當時正在摸索的做法。
它的核心理念是：每種分支都有明確的責任和生命週期。
看下面這張圖。
main 永遠是可以上線的版本，develop 是大家整合開發的地方。
各個 feature 分支從 develop 長出去，做完再合回 develop。
要上線時，透過 release 或 hotfix 分支，把程式碼送進 main。
-->

---

# Git Flow 的適用條件

**適合使用 Git Flow 的場景：**

- 有明確版本號（v1.0、v2.0、v1.2.3）的產品
- 需要同時維護多個版本的專案
- 發布週期較長（週發布或月發布）
- 需要嚴格 QA 流程，發布前有專屬測試期

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**作者補充（2020）：** Vincent Driessen 在文章底部加了說明——此模型適合有版本號的套件，對持續交付的 web app 可能 GitHub Flow 更適合。選擇最適合團隊的工作流程才是重點。

</div>

<!--
那什麼樣的專案適合 Git Flow 呢？
第一，有明確版本號的產品，例如 1.0、2.0 這樣一版一版發布。
第二，需要同時維護好幾個版本的專案。
第三，發布週期比較長，例如每週或每個月發布一次。
第四，發布前需要一段專屬的測試期。
值得一提的是，作者本人在 2020 年補充說明。
他認為這個模型適合有版本號的軟體。
但如果是持續部署的網站，GitHub Flow 這種更簡單的流程可能更合適。
所以重點不是一定要用 Git Flow，而是選擇最適合團隊的工作流程。
-->

---

# Git Flow 的五種分支角色

<div class="grid grid-cols-2 gap-6">
<div>

**長期存在的分支（永久分支）**

| 分支 | 角色 |
| --- | --- |
| `main` | 永遠是可上線的穩定版本，每個 commit 都有 tag |
| `develop` | 所有功能的整合分支，下一版本的預備狀態 |

</div>
<div>

**短期分支（完成任務後刪除）**

| 分支 | 角色 |
| --- | --- |
| `feature/*` | 個別功能開發 |
| `release/*` | 準備正式發布 |
| `hotfix/*` | 生產環境緊急修復 |

</div>
</div>

<br>

**分支命名慣例範例：**

```
feature/user-authentication
feature/shopping-cart
release/1.2.0
hotfix/fix-payment-null-pointer
```

<!--
Git Flow 一共有五種分支，可以分成兩類。
第一類是長期存在的分支。
main 是對外的門面，永遠代表穩定、可以上線的版本，每次發布都會打上標籤。
develop 是對內的整合點，所有功能做完都先合進這裡，代表下一個版本的預備狀態。
第二類是短期的分支，完成任務之後就刪掉。
feature 用來開發個別功能，release 用來準備正式發布，hotfix 用來緊急修復線上的問題。
下面是常見的命名方式，用斜線前面的類型，加上一個說明用途的名稱。
-->

---

# 各分支的合併規則

**嚴格的合併方向確保程式碼品質：**

```
feature/* ──► develop
release/* ──► main  AND  develop
hotfix/*  ──► main  AND  develop
```

| 分支 | 從哪裡建立 | 合併回哪裡 | 目的 |
| --- | --- | --- | --- |
| `feature/*` | `develop` | `develop` | 新功能開發 |
| `release/*` | `develop` | `main` + `develop` | 發布準備、小 bug 修正 |
| `hotfix/*` | `main` | `main` + `develop` | 緊急 bug 修復 |

<!--
Git Flow 對合併的方向有嚴格的規定，這是它的骨幹。
feature 分支從 develop 建立，完成後只合回 develop。
release 分支從 develop 建立，完成後要同時合進 main 和 develop。
hotfix 分支比較特別，它從 main 建立，完成後一樣要同時合進 main 和 develop。
-->

---

# 各分支的合併規則：關鍵說明

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px; margin-bottom: 1.2rem;">

**關鍵規則：** `feature` 分支永遠不直接合到 `main`。`main` 只接受來自 `release` 和 `hotfix` 的合併，並且每次合併都要打上版本 tag。

</div>

**為什麼 release 和 hotfix 要同時合到兩邊？**

| 動作 | 合到 main | 合回 develop |
| --- | --- | --- |
| release 完成 | 正式上線 | 確保下個版本包含 release 期間的 bug 修正 |
| hotfix 完成 | 緊急上線 | 確保下個版本不會再出現同樣的 bug |

<!--
這裡有一條關鍵規則：feature 分支永遠不會直接合進 main。
main 只接受來自 release 和 hotfix 的合併，而且每次合併都要打上版本標籤。
這樣才能確保 main 上的程式碼永遠是穩定的。
那為什麼 release 和 hotfix 要同時合到兩邊呢？
合進 main，是為了上線。
合回 develop，是為了讓下一個版本也包含這些修正。
如果只合進 main，下一個版本從 develop 出來時，同樣的 bug 就會再次出現，等於白修了。
-->

---

# Git Flow 的適用時機

**適合 Git Flow：**

- 有明確版本號（SemVer：v1.2.3）的產品或套件
- 需要同時維護 v1.x 和 v2.x 的情境
- 發布週期較長（bi-weekly 或更長）
- 需要嚴格的 QA 流程，發布前有專屬的測試期

<!--
我們再整理一次適合使用 Git Flow 的時機。
有語意化版本號的產品或套件，需要同時維護 1.x 和 2.x 好幾個版本。
發布週期在兩週或更長，而且發布前要有完整的測試流程。
符合這些條件，Git Flow 的完整規範就很值得。
-->

---

# Git Flow 的適用時機：不適合的情境

**不適合 Git Flow，考慮其他策略：**

| 情境 | 建議策略 |
| --- | --- |
| Web 應用，每天部署多次 | GitHub Flow（只有 main + feature） |
| 大型單體 repo，大量小改動 | Trunk-based Development |
| 小團隊，快速迭代 | GitHub Flow 或直接 push main |

<div style="margin-top: 1.5rem; padding: 1rem 1.2rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

Git Flow 的複雜度有其代價，不是所有專案都需要這麼完整的規範。選擇最適合團隊的工作流程才是最重要的。

</div>

<!--
反過來，有些情境就不適合 Git Flow。
如果是網站應用，每天部署好幾次，走一趟 release 流程會讓大家覺得很麻煩。
這時候只有 main 和 feature 的 GitHub Flow，會更合適。
大型的單一 repo，有大量的小改動，可以考慮 Trunk-based Development。
小團隊要快速迭代，也可以選擇比較輕量的流程。
Git Flow 的完整是有代價的，不是每個專案都需要這麼多規範。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 使用 Git Flow

<!--
概念理解了，接下來看實際操作，我們會走一遍新功能、版本發布和緊急修復三個流程。
-->

---

# 安裝 git-flow

`git-flow` 是一個 CLI 工具，把 Git Flow 的多步驟操作封裝成簡單的指令：

```bash
# macOS（Homebrew）
brew install git-flow-avh

# Windows（Git for Windows 已內建，或用 Chocolatey）
choco install gitflow-avh

# Ubuntu / Debian
apt-get install git-flow
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

git-flow 工具不是必要的，你完全可以用原生 git 指令手動執行所有步驟。但 git-flow 把這些操作包裝起來，減少出錯機會。

</div>

<!--
git-flow 是一個命令列工具。
它把 Git Flow 裡需要好幾個步驟的操作，包裝成一行簡單的指令。
macOS 可以用 Homebrew 安裝，Ubuntu 可以用 apt 安裝。
Windows 的 Git for Windows 已經內建了，也可以用 Chocolatey 安裝。
要注意的是，這個工具不是必要的。
所有步驟都可以用原生的 git 指令手動完成，工具只是幫我們減少出錯的機會。
-->

---

# 初始化 git-flow

```bash
# 在專案根目錄初始化（互動式，通常全部按 Enter 接受預設）
git flow init

# 或非互動式，接受所有預設值
git flow init -d
```

初始化時的互動提示：

```text
Which branch should be used for bringing forth production releases?
   - main
Branch name for production releases: [main]

Which branch should be used for integration of the "next release"?
   - develop
Branch name for "next release" development: [develop]
```

<!--
裝好之後，在專案的根目錄執行 `git flow init`，進行初始化。
它會一一詢問各種分支要叫什麼名字。
例如正式版本用哪個分支、下一版的開發用哪個分支。
預設值就是 Git Flow 的標準命名，一般直接按 Enter 就好。
如果想全部接受預設值，可以加上 `-d`，不用一個一個回答。
初始化完成後，它會自動建立 develop 分支，並切換過去。
-->

---

# 新功能開發流程

**使用 git-flow 工具：**

```bash
# 開始開發新功能（從 develop 建立 feature/login 分支）
git flow feature start login
# 相當於：git checkout -b feature/login develop

# ... 開發中，正常 commit ...
git add login.py
git commit -m "feat: implement user login form"
git commit -m "feat: add login validation"
```

<!--
先看新功能開發的流程。
執行 `git flow feature start login`，工具會從 develop 建立一個叫 feature/login 的分支，並切換過去。
它其實就等於用 `git checkout -b` 從 develop 建立新分支。
切換過去之後，就像平常一樣開發，add 和 commit。
範例裡，我們做了兩個 commit，分別完成登入表單和登入驗證。
-->

---

# 新功能開發流程：完成功能

```bash
# 完成功能（合併到 develop，刪除 feature 分支）
git flow feature finish login
# 相當於：
#   git checkout develop
#   git merge --no-ff feature/login
#   git branch -d feature/login
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**`--no-ff` 的作用：** 強制產生 merge commit，讓歷史圖形中可以清楚看到 feature 分支的起點和終點。不加的話，commit 直接「接」在 develop 上，看不出屬於哪個功能。

</div>

<!--
功能做完之後，執行 `git flow feature finish login`。
它會一次幫我們做三件事。
切換回 develop，用 `--no-ff` 把 feature/login 合併進來，再把 feature/login 分支刪掉。
這裡的 `--no-ff`，就是第十三章講過的強制產生合併 commit。
在 Git Flow 裡它很重要。
有了它，log 圖上才看得出這些 commit 屬於哪個功能，從哪裡開始、在哪裡結束。
-->

---

# 新功能開發流程（純 Git 指令版）：開始

如果沒有 git-flow 工具，用原生 git 指令也完全可以：

```bash
# 確保 develop 是最新的
git checkout develop
git pull origin develop

# 建立功能分支
git checkout -b feature/shopping-cart

# 開發中...
git add .
git commit -m "feat: add shopping cart model"

# 推送到 GitHub（讓其他人可以看到或協作）
git push -u origin feature/shopping-cart
```

<!--
如果沒有安裝 git-flow 工具，用原生的 git 指令也完全可以。
先切換到 develop，pull 一下，確保是最新的狀態。
接著從 develop 建立功能分支，例如 feature/shopping-cart。
開發、commit 之後，把分支推上 GitHub，讓其他人也能看到或一起協作。
步驟雖然多一點，但每一步在做什麼，都看得很清楚。
-->

---

# 新功能開發流程（純 Git 指令版）：完成

```bash
# 功能完成，合回 develop（--no-ff 保留分支歷史）
git checkout develop
git merge --no-ff feature/shopping-cart -m "Merge feature/shopping-cart into develop"

# 刪除本機和遠端的 feature 分支
git branch -d feature/shopping-cart
git push origin --delete feature/shopping-cart

# 推送 develop 到遠端
git push origin develop
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

實際工作中，通常用 GitHub PR 來做 feature → develop 的合併，因為 PR 提供 code review 機制。git-flow 工具的優勢主要在小團隊或不用 PR 的場景。

</div>

<!--
功能完成之後，切換回 develop，一樣用 `--no-ff` 把功能分支合併進來。
接著把本機和遠端的功能分支都刪掉，最後把 develop 推上遠端。
不過在實際工作中，功能分支合進 develop 這一步，通常是透過 GitHub 的 PR 來完成。
因為 PR 提供了程式碼審查的機制。
git-flow 工具的優勢，主要是在小團隊，或是不使用 PR 的情境。
-->

---

# 版本發布流程

**當 develop 上的功能都準備好，要準備發布新版本：**

```bash
# 開始準備 1.0.0 版本（從 develop 建立 release/1.0.0 分支）
git flow release start 1.0.0
# 相當於：git checkout -b release/1.0.0 develop

# 在 release 分支上做最後的調整：
# - 更新版本號（package.json, pom.xml, version.py...）
# - 修正小 bug（不加新功能！）
# - 更新 CHANGELOG
git commit -m "chore: bump version to 1.0.0"
git commit -m "fix: fix edge case in payment flow"
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**release 分支的鐵則：只修不加。** 只能做小 bug 修正、版本號更新、CHANGELOG，不能加任何新功能。

</div>

<!--
當 develop 上的功能都準備好了，就要準備發布新版本。
執行 `git flow release start`，後面接版本號，例如 1.0.0。
它會從 develop 建立一個 release/1.0.0 分支。
在這個分支上，我們做最後的調整：更新版本號、修正小 bug、更新變更紀錄。
這裡有一條鐵則：release 分支只修不加。
只能做小修正和文件更新，不能再加任何新功能。
-->

---

# 版本發布流程：完成與推送

```bash
# 完成發布（合到 main 和 develop，打 tag，刪除 release 分支）
git flow release finish 1.0.0
# 相當於：
#   git checkout main && git merge --no-ff release/1.0.0
#   git tag -a 1.0.0 -m "Release version 1.0.0"
#   git checkout develop && git merge --no-ff release/1.0.0
#   git branch -d release/1.0.0

# 推送 main、develop 和 tag 到遠端
git push origin main develop --tags
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

`release finish` 是複合操作：合到 main、打 tag、合回 develop、刪除 release 分支。用純 git 指令要手動四步，這裡 git-flow 工具優勢最明顯。

</div>

<!--
準備好之後，執行 `git flow release finish`。
這是一個複合操作。
它會把 release 分支合進 main，打上 1.0.0 的標籤，再合回 develop，最後刪掉 release 分支。
用純 git 指令，要手動做四個步驟，這裡就是 git-flow 工具優勢最明顯的地方。
完成後，記得把 main、develop 和標籤一起推上遠端。
還記得第十四章講過，`git push` 預設不會推送標籤，所以要加上 `--tags`。
-->

---

# 緊急修復流程

**線上版本有嚴重 bug，需要立即修復，不能等下個 release：**

```bash
# 從 main（也就是線上版本）建立 hotfix 分支
git flow hotfix start fix-login-crash
# 相當於：git checkout -b hotfix/fix-login-crash main

# 修復 bug
git add login.py
git commit -m "fix: prevent null pointer in login when user is inactive"
```

<div style="margin-top: 1.5rem; padding: 1rem 1.2rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

**關鍵：** hotfix 從 `main` 建立，不是從 `develop`，確保只包含線上版本的程式碼，不夾帶 develop 上未完成的功能。

</div>

<!--
接下來是緊急修復的流程。
線上的版本出現嚴重 bug，必須馬上修，不能等下一個 release。
執行 `git flow hotfix start`，它會從 main 建立一個 hotfix 分支。
關鍵就在這裡：hotfix 是從 main 建立，不是從 develop。
main 就是線上正在跑的版本，所以這個分支裡只有線上的程式碼。
不會夾帶 develop 上那些還沒完成的功能。
這正好解決了一開始提到的困境。
-->

---

# 緊急修復流程：完成與推送

```bash
# 完成 hotfix（合到 main 和 develop，打 tag，刪除 hotfix 分支）
git flow hotfix finish fix-login-crash
# 相當於：
#   git checkout main && git merge --no-ff hotfix/fix-login-crash
#   git tag -a 1.0.1 -m "Hotfix: fix login crash for inactive users"
#   git checkout develop && git merge --no-ff hotfix/fix-login-crash
#   git branch -d hotfix/fix-login-crash

# 推送
git push origin main develop --tags
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

`hotfix finish` 同時合到 main 和 develop，確保這個修復在下個版本也有，不會再出現同樣的 bug。

</div>

<!--
修好 bug 之後，執行 `git flow hotfix finish`。
它會把修正合進 main，打上新的版本標籤，例如 1.0.1，再合回 develop，最後刪掉 hotfix 分支。
合進 main，修正就能立刻上線，不用擔心 develop 上的東西跟著出去。
合回 develop，則確保下一個版本也包含這個修正，同樣的 bug 不會再出現。
最後一樣把 main、develop 和標籤推上遠端。
-->

---

# Git Flow 完整流程圖

```
main:     ──●─────────────────────────────●─────────►
              │                    release/1.0.0↗  │hotfix/1.0.1
              ↓                          ↗          ↓
develop:  ────●─────●────●───────────────●──────────●──►
                    ↑    ↑         ↑    ↑↑          ↑
              feature/A  │   feature/C  ↑↑     hotfix合回
                    feature/B    release合回    ↑
                                               hotfix/1.0.1

tags:              v0.9.0             v1.0.0    v1.0.1
```

<!--
這張圖把整個流程畫在一起。
上面是 main，中間是 develop，這兩條是平行的長期分支。
feature A、B、C 從 develop 長出去，做完再合回 develop。
release 1.0.0 從 develop 出發，合進 main，同時合回 develop。
hotfix 1.0.1 則是從 main 出發，修完一樣合進 main，再合回 develop。
最下面是標籤，每一次合進 main，都對應一個版本號。
除了 main 和 develop，其他分支都是短暫的，完成任務就消失。
-->

---

# Git Flow 完整流程圖：可追溯性

**每個 commit 的來源都清晰可追溯：**

| 在 main 的 commit | 代表 |
| --- | --- |
| `Merge release/1.0.0` | 正式發布 1.0.0 |
| `Merge hotfix/fix-login` | 緊急修復，產生 1.0.1 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

看 main 的 `git log`，就能清楚知道「1.0.0 是什麼時候發布的，1.0.1 是修了什麼緊急 bug」。這種可追溯性對維護和審計非常有價值。

</div>

<!--
這套流程帶來的一個好處，是可追溯性。
main 上的每一個合併 commit，都清楚對應一個版本。
看到 Merge release/1.0.0，就知道這是 1.0.0 的正式發布。
看到 Merge hotfix，就知道這是一次緊急修復，產生了 1.0.1。
所以只要看 main 的 `git log`，就能知道每個版本是什麼時候發布、修了什麼問題。
這對日後的維護和稽核都非常有價值。
-->

---

# Git Flow vs GitHub Flow vs Trunk-based

| 特性 | Git Flow | GitHub Flow | Trunk-based |
| --- | --- | --- | --- |
| 長期分支數量 | 2（main + develop） | 1（main） | 1（main/trunk） |
| 短期分支 | feature / release / hotfix | feature | 短暫功能分支（可選） |
| 發布流程 | release 分支 | merge 即部署 | 持續部署 |
| 適合發布頻率 | 週期性發布 | 隨時部署 | 每日多次部署 |
| 複雜度 | 高 | 低 | 中（需要 feature flags） |
| 適合場景 | 有版本號的產品 | Web 應用、SaaS | 大型持續交付 |
| 代表公司 | 傳統軟體公司 | GitHub 本身 | Google、Facebook |

<!--
我們把三種常見的工作流程放在一起比較。
Git Flow 有兩條長期分支、三種短期分支，透過 release 分支發布。
它適合週期性發布、有版本號的產品，複雜度也最高。
GitHub Flow 只有 main 一條長期分支，功能分支合併就等於部署，複雜度最低，適合網站應用。
Trunk-based 則是大家都在主幹上頻繁整合，每天部署好幾次。
它需要搭配功能開關和完整的自動化測試，適合大型的持續交付團隊。
沒有哪一種是完美的，關鍵是和團隊、產品類型、部署頻率相匹配。
-->

---

# Git Flow vs GitHub Flow vs Trunk-based：選擇建議

| 工作流程 | 最適合 |
| --- | --- |
| **Git Flow** | 有版本號的產品、週期性發布、需要嚴格 QA |
| **GitHub Flow** | Web 應用、隨時部署、小型團隊快速迭代 |
| **Trunk-based** | 大型持續交付、有強大自動化測試基礎 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**建議：** 先了解 Git Flow 打好基礎，再根據團隊的實際需求選擇或客製化最適合的工作流程。很多大公司用的是介於這三者之間的客製化版本。

</div>

<!--
最後整理一下選擇的建議。
需要嚴格版本管理和測試流程，選 Git Flow。
想要隨時部署、快速迭代，選 GitHub Flow。
有強大的自動化測試基礎，要大規模持續交付，可以考慮 Trunk-based。
建議先了解 Git Flow 打好基礎，再依團隊的實際需求選擇或調整。
很多公司用的，其實是介於這三者之間的客製化版本。
-->

---

# 實戰建議：導入 Git Flow 的注意事項

<div class="grid grid-cols-2 gap-6">
<div>

**導入前準備**

- 團隊成員都要理解五種分支的意義
- 在 GitHub repo 設定分支保護規則：
  - main 和 develop 禁止直接 push
  - 要求 PR + Code Review
  - 要求 CI 通過才能 merge
- 撰寫 `CONTRIBUTING.md` 記錄團隊的工作流程

</div>
<div>

**常見陷阱**

- develop 累積太多功能、長期沒有 release → 「merge 地獄」
- hotfix 修完忘記合回 develop → 下個版本 bug 又出現
- feature 分支存活太久 → 和 develop 差異太大，merge 衝突嚴重
- release 分支上加了新功能 → 打破 release 只能修 bug 的規則

</div>
</div>

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">

**黃金法則：** feature 分支盡量小而短暫（建議不超過 2 週）。分支存活越久，和 develop 的差距越大，合併的痛苦就越多。

</div>

<!--
最後是導入 Git Flow 時要注意的事情。
導入之前，團隊每個人都要理解五種分支的意義。
建議在 GitHub 設定分支保護規則，禁止直接推送到 main 和 develop，要求 PR、審查和 CI 通過才能合併。
這樣能防止大家在疲勞或緊張時，不小心直接推上去。
右邊是常見的陷阱。
其中最常見的，是 hotfix 修完忘了合回 develop，還有功能分支存活太久。
分支開了兩個月，回來發現 develop 已經差了幾十個 commit，光解衝突就要花一整天。
所以黃金法則是，功能分支要小而短，建議不超過兩週，功能太大就拆成幾個分批合併。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章我們認識了 Git Flow 的五種分支，以及它們之間的合併規則。
也實際走過了新功能、版本發布和緊急修復三個流程。
最後比較了不同的工作流程，重點是選擇最適合團隊的那一個。
下一章，我們要深入 Git 的底層，看看它到底是怎麼運作的。我們下一章見。
【講師】開放提問，可以請大家分享自己團隊目前用的是哪種工作流程。
-->
