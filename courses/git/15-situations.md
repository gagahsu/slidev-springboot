---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: 其它常見狀況題
routeAlias: ch15
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
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">其它常見狀況題</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">「工作中最常踩的坑，一次全解決」</p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十五章，其它常見狀況題。
前面幾章，我們學的大多是正常情況下怎麼操作 Git。
這章要來看的是「出狀況了怎麼辦」。
這些都是工作中真的很常碰到的情境。
學完之後，遇到狀況就不用慌，大部分問題 Git 都有解法。
-->

---
layout: default
---

# Outline

- **【狀況題】手邊工作做到一半，要切換任務** — git stash
- **【狀況題】帳號密碼放進 Git 了** — git filter-branch / BFG / 修改 remote
- **【狀況題】只想要某個分支的某幾個 Commit** — git cherry-pick
- **【冷知識】把檔案真正從 Git 裡移掉** — git filter-branch / git filter-repo
- **【冷知識】斷頭（detached HEAD）是怎麼一回事？** — HEAD 指向 commit 而非分支

<!--
這章有五個主題。
前三個是狀況題，也就是工作中很可能遇到的緊急場景。
工作做到一半要切換任務、不小心把密碼 commit 進去，還有只想拿某個分支的幾個 commit。
後兩個是冷知識，一個是怎麼把檔案從歷史中徹底移除，另一個是 detached HEAD。
理解它們，下次遇到奇怪的現象就不會不知所措。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 【狀況題】手邊的工作做到一半，臨時要切換到別的任務

<!--
第一個狀況題：工作做到一半，臨時要切換到別的任務。
-->

---

# 問題：未 commit 的改動切換分支會發生什麼？

```bash
# 你正在 feature/login 分支上開發，改了一堆檔案但還沒 commit
$ git status
Changes not staged for commit:
  modified: src/login.js
  modified: src/auth.js
Untracked files:
  src/new-component.js

# 突然需要切換到 main 去修緊急 bug
$ git checkout main
error: Your local changes to the following files would be overwritten by checkout:
        src/login.js
Please commit your changes or stash them before you switch branches.
```

<br>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px;">
  Git 保護了你：它<strong>拒絕切換分支</strong>，避免你的改動被覆蓋或遺失。解法是 <code>git stash</code>。
</div>

<!--
想像一下，我們正在 feature/login 分支上開發，改了好幾個檔案，還沒 commit。
這時主管突然說，正式環境有個緊急 bug，要先去修。
我們試著切換到 main，結果 Git 拒絕了。
錯誤訊息說，本機的改動會被覆蓋，請先 commit 或 stash。
這其實是 Git 在保護我們。
目標分支裡的同一個檔案和我們的改動有衝突，切換過去就會蓋掉。
但功能還沒做完，又不想 commit 一個半成品，怎麼辦？
解法就是 `git stash`。
-->

---

# `git stash` — 把工作進度暫存起來

```bash
# 把目前所有未 commit 的改動暫存（不含 untracked 檔案）
$ git stash
Saved working directory and index state WIP on feature/login: a4b8c2d 上一個commit訊息

# 連 untracked 的新檔案也一起暫存
$ git stash -u

# 暫存時加上說明，方便之後識別
$ git stash push -m "login 頁面做到一半，表單驗證未完成"

# 暫存後工作目錄變乾淨了，可以自由切換分支
$ git status
nothing to commit, working tree clean

$ git checkout main
# 去修 bug...
$ git checkout feature/login
```

<!--
`git stash` 就像辦公桌旁邊的臨時抽屜。
把做到一半的東西全部丟進去，桌面馬上清空，就可以去處理別的事。
直接執行 `git stash`，會把還沒 commit 的改動都收起來。
要注意，預設不包含還沒被追蹤的新檔案，要連它們一起收，就加上 `-u`。
建議用 `git stash push -m`，幫這次暫存寫一句說明，暫存多的時候比較好辨認。
收好之後，`git status` 會顯示工作目錄是乾淨的。
這時就可以放心切換到 main 去修 bug，修完再切回來。
-->

---

# 取回暫存的工作進度

```bash
# 查看所有暫存項目
$ git stash list
stash@{0}: On feature/login: login 頁面做到一半，表單驗證未完成
stash@{1}: WIP on develop: 購物車半成品

# 套用最新的暫存，並從清單中刪除（最常用）
$ git stash pop

# 套用指定的暫存，但保留在清單中
$ git stash apply stash@{1}

# 刪除指定的暫存
$ git stash drop stash@{1}

# 一次清空全部暫存
$ git stash clear
```

<!--
修完 bug 回來之後，要把暫存的進度拿回來。
`git stash list` 會列出所有暫存，編號從 0 開始，0 是最新的一筆。
最常用的是 `git stash pop`，它會套用最新的暫存，並且從清單裡刪掉。
如果要套用特定的某一筆，又想保留在清單裡，就用 `git stash apply`，加上編號。
不需要的暫存，可以用 `drop` 刪掉。
`git stash clear` 會一次清空全部，刪了就找不回來，要特別小心。
-->

---

# 取回暫存：指令差異

| 指令 | 效果 |
| --- | --- |
| `stash pop` | 取回 + 從清單刪除 |
| `stash apply` | 取回 + 保留在清單 |
| `stash drop` | 只刪除，不取回 |
| `stash clear` | 清空全部（謹慎！） |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

如果想把同一份暫存套到多個分支，用 `stash apply`（不刪除清單）。一般情況用 `stash pop` 就夠了。

</div>

<!--
這張表整理了四個指令的差別。
pop 是取回並且刪除，apply 是取回但保留。
drop 只刪除不取回，clear 則是清空全部。
一般情況用 `stash pop` 就夠了。
如果想把同一份暫存套用到好幾個分支，就用 `stash apply`，因為它不會把暫存刪掉。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 【狀況題】不小心把帳號密碼放在 Git 裡了

<!--
第二個狀況題，也是最嚴重的一個：不小心把帳號密碼放進 Git 了。
-->

---

# 為什麼「刪掉再 commit」是不夠的？

```bash
# ❌ 錯誤做法：只是再加一個 commit 把密碼移除
$ git log --oneline
f8a9b2c 移除密碼（亡羊補牢）  ← 密碼「看起來」不見了
a3c5d7e 新增資料庫設定        ← 但這個 commit 裡密碼還在！
```

<br>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px; margin-bottom: 1rem;">
  <strong>⚠️ 歷史記錄永遠都在！</strong>任何人只要 clone 你的 repo，都可以用 <code>git checkout a3c5d7e</code> 回到那個 commit，看到你的密碼。
</div>

<br>

只要 push 到公開 repository，就有機器人在爬：
- GitHub 上的爬蟲幾乎在 **commit 後幾秒內**就會收集到洩漏的金鑰
- 被收集到之後，即使你之後清理了也為時已晚

<!--
很多人發現密碼被 commit 進去之後，第一個反應是：再 commit 一次，把密碼刪掉就好。
但這樣是不夠的。
看這個 log，最新的 commit 把密碼移除了，看起來好像沒事。
但下面那個「新增資料庫設定」的 commit 裡，密碼還在。
Git 會保留完整的歷史，任何人 clone 下來，切到那個 commit，就能看到密碼。
更可怕的是，只要推到公開的 repo，網路上就有程式在自動掃描。
外洩的金鑰，通常幾秒內就會被收集走。
曾經有人因此被盜用雲端資源，收到金額非常驚人的帳單。
-->

---

# 正確的應對流程

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px; margin-bottom: 1.2rem;">
  <strong>第一步永遠是：立即撤銷（Revoke）洩漏的金鑰！</strong><br>
  在清理 Git 歷史之前，先去撤銷那個 API key / 密碼，讓它失效。這才是最關鍵的一步。
</div>

完整處理流程：

1. **立即撤銷洩漏的金鑰**（去 AWS / GitHub / 服務提供商的設定頁面）
2. **產生新的金鑰**，放到環境變數或 Secrets Manager
3. **清理 Git 歷史**（使用 BFG Repo Cleaner 或 `git filter-repo`）
4. **Force push** 更新遠端 repository
5. **通知所有協作者**重新 `git clone`，因為大家本地的歷史都已過時
6. **事後預防**：加 `.gitignore`、用 `git-secrets` 等工具

<!--
處理的順序很重要。
第一步，永遠是立刻到服務提供者的後台，撤銷外洩的金鑰或密碼，讓它失效。
不要先花時間清理歷史，因為它可能早就被抓走了，多等一秒都是風險。
金鑰失效之後，就算有人拿到也沒有用。
第二步，產生新的金鑰，改放在環境變數或專門的機密管理服務裡。
接著才是清理 Git 歷史、強制推送。
然後通知所有協作者重新 clone，因為大家本機的歷史都已經過時了。
最後，做好預防措施，避免再發生。
-->

---

# 清理歷史的工具

```bash
# 方法一：使用 git filter-repo（現代推薦做法，需另外安裝）
$ pip install git-filter-repo

# 從所有歷史中移除包含密碼的檔案
$ git filter-repo --path config/database.yml --invert-paths

# 或者把特定字串（例如真實的密碼）替換成佔位符
$ git filter-repo --replace-text <(echo "實際密碼==>REDACTED")

# 方法二：BFG Repo Cleaner（Java 工具，速度很快）
$ java -jar bfg.jar --delete-files id_rsa  # 刪除特定檔案
$ java -jar bfg.jar --replace-text passwords.txt  # 取代特定字串

# 清理完畢後，強制推送更新遠端
$ git push --force --all
$ git push --force --tags
```

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">
  <strong>推薦：</strong>使用 <code>git filter-repo</code>，它是 Git 官方推薦的替代 <code>filter-branch</code> 的工具，速度更快、更安全。
</div>

<!--
清理歷史有兩個常用的工具。
第一個是 `git filter-repo`，這是目前官方推薦的工具，需要另外安裝。
`--path` 加上 `--invert-paths`，可以把某個檔案從所有歷史中移除。
`--replace-text` 則可以把真實的密碼字串，替換成一個佔位文字。
第二個是 BFG Repo Cleaner，它是一個 Java 工具，速度很快，操作也很直覺。
不管用哪一個，清理完都要強制推送分支和標籤，因為歷史已經改寫了。
以前常見的 `git filter-branch` 速度慢，也有已知問題，官方已經不推薦了。
-->

---

# 預防勝於治療

```bash
# .gitignore 是第一道防線
# 把含有敏感資訊的檔案加入 .gitignore
.env
.env.local
config/secrets.yml
*.pem
*.key
credentials.json

# 使用環境變數，不要把值硬寫在程式碼裡
# ❌ 不好的做法
DB_PASSWORD = "my-super-secret-password"

# ✅ 好的做法
DB_PASSWORD = os.environ.get("DB_PASSWORD")
```

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">
  推薦工具：<strong>git-secrets</strong>（AWS 出品）或 <strong>pre-commit hooks</strong>，在 commit 時自動掃描是否含有敏感資訊，有的話直接阻止 commit。
</div>

<!--
當然，最好的方式是預防。
第一道防線是 `.gitignore`。
像 `.env`、金鑰檔、憑證檔這些，在專案一開始就要加進去，不要等出事才補。
第二個好習慣，是用環境變數。
看下面的對照，不要把密碼直接寫死在程式碼裡，而是在執行時從環境變數讀取。
另外還可以搭配 git-secrets 這類工具，設定成 commit 時自動掃描。
一旦發現看起來像密碼或金鑰的內容，就直接擋下這次 commit。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## 【狀況題】只想要某個分支的某幾個 Commit

<!--
第三個狀況題：只想要某個分支上的某幾個 commit，而不是整個分支。
-->

---

# 什麼是 Cherry-pick？

Cherry-pick 字面意思是「摘櫻桃」——從一堆 commit 中，精準挑選你想要的那幾個，套用到目前的分支。

<br>

```text
develop: A ── B ── C ── D ── E
                   ↑
              只想要這個 hotfix commit

main:    A ── B ──────────────── C'
                  cherry-pick 之後，C 的變更被套用到 main
                  （但這是一個全新的 commit，hash 不同）
```

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">
  <strong>重要：</strong>Cherry-pick 會產生一個<strong>全新的 commit</strong>，變更內容相同，但 commit hash、日期等資訊都不同。這不是「移動」原本的 commit，而是「複製一份改動」。
</div>

<!--
有時候 develop 分支上有一個修 bug 的 commit。
我們只想把這一個帶到 main，不想把整個 develop 都合併過去。
這時候就用 cherry-pick，字面意思是「摘櫻桃」。
從一堆 commit 裡，精準挑出想要的那幾個，套用到目前的分支上。
看這張圖，我們只摘了 C，套用到 main 之後，變成了 C'。
要特別注意，C' 是一個全新的 commit。
它的改動內容和 C 一樣，但編號、時間和上一個 commit 都不同。
所以 cherry-pick 不是搬移原本的 commit，而是複製一份改動。
-->

---

# Cherry-pick 實戰

```bash
# 先查看你想要的 commit 在哪
$ git log --oneline develop
e5f6a7b 修正購物車金額計算錯誤（這個！）
d4c3b2a 新增結帳頁面 UI
c2b1a09 整合金流 API

# 切換到目標分支
$ git checkout main

# 套用指定的 commit
$ git cherry-pick e5f6a7b

# 套用一段範圍的 commits（不含起始，含結尾）
$ git cherry-pick c2b1a09..e5f6a7b

# 套用但不立即 commit（先看看改動再決定）
$ git cherry-pick e5f6a7b --no-commit
```

<!--
我們看實際的操作。
先用 `git log` 看 develop 上的 commit，找到想要的那一個，例如修正購物車金額的 e5f6a7b。
接著切換到 main，執行 `git cherry-pick`，後面接上這個編號。
Git 就會把那次的改動套用過來，產生一個新的 commit。
也可以一次套用一段範圍，中間用兩個點連接。
要注意，範圍不包含起點那一個，只包含後面的。
如果想先看看改動，再決定要不要 commit，可以加上 `--no-commit`。
-->

---

# Cherry-pick 遇到衝突怎麼辦？

```bash
# cherry-pick 時遇到衝突
$ git cherry-pick e5f6a7b
CONFLICT (content): Merge conflict in src/cart.js
error: could not apply e5f6a7b... 修正購物車金額計算錯誤

# 手動解決衝突後，繼續 cherry-pick
$ git add src/cart.js
$ git cherry-pick --continue

# 如果想放棄，回到 cherry-pick 之前的狀態
$ git cherry-pick --abort
```

<!--
cherry-pick 也可能遇到衝突，處理方式跟合併衝突幾乎一樣。
看這個範例，Git 說 cart.js 有衝突，沒辦法套用。
我們先打開檔案，手動解決衝突。
接著用 `git add` 標記已經解決，再執行 `git cherry-pick --continue` 繼續。
如果改變主意，不想做了，就用 `--abort` 放棄，回到 cherry-pick 之前的狀態。
-->

---

# Cherry-pick 衝突：控制指令

| 指令 | 時機 |
| --- | --- |
| `git cherry-pick --continue` | 解決衝突後繼續 |
| `git cherry-pick --skip` | 跳過這個 commit（當改動已存在時） |
| `git cherry-pick --abort` | 完全放棄，回到操作前狀態 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**`--skip` 使用時機：** 一系列 cherry-pick 中，某個 commit 的改動在目標分支已存在，用 `--skip` 跳過避免重複套用。

</div>

<!--
這張表整理了三個控制指令。
`--continue` 用在解決衝突之後，繼續完成。
`--abort` 是完全放棄，回到操作之前的乾淨狀態。
`--skip` 比較少用。
它的情境是一次挑好幾個 commit，其中某一個的改動在目標分支上已經有了。
這時就用 `--skip` 跳過它，避免重複套用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## 【冷知識】怎麼樣把檔案真正的從 Git 裡移掉

<!--
接下來是冷知識。剛才提到的 filter-repo，我們更完整地看怎麼把檔案從 Git 歷史中徹底移除。
-->

---

# `git rm` 只是「不再追蹤」，不是真正刪除

```bash
# git rm 把檔案從追蹤清單中移除，並刪除工作目錄裡的檔案
$ git rm secret.txt
$ git commit -m "移除 secret.txt"

# 但是！這個檔案在之前的 commit 裡仍然存在
$ git log --all --oneline
f9b3c1d 移除 secret.txt    ← 這個 commit 以後看不到了
a4e2b8f 新增 secret.txt    ← 但這個 commit 裡，secret.txt 還在！

# 任何人都可以這樣找回來
$ git show a4e2b8f:secret.txt
（顯示 secret.txt 的內容）
```

<br>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px;">
  要真正從 Git 歷史中移除一個檔案，必須<strong>重寫整個 commit 歷史</strong>。
</div>

<!--
很多人以為 `git rm` 就是把檔案刪掉了。
其實它只是讓 Git 從下一個 commit 開始，不再追蹤這個檔案。
看這個範例，我們用 `git rm` 刪掉 secret.txt，再 commit。
但在之前那個新增 secret.txt 的 commit 裡，檔案還好好地在。
任何人都可以用 `git show`，指定那個 commit 和檔名，把內容印出來。
所以要真正移除一個檔案，必須重寫整個歷史。
這是一件嚴肅的事，因為之後所有 commit 的編號都會改變，每個協作者都會受影響。
-->

---

# 使用 `git filter-repo` 真正移除檔案

```bash
# 安裝 git-filter-repo
$ pip install git-filter-repo
# 或 brew install git-filter-repo（macOS）

# 從所有歷史中完全移除指定檔案
$ git filter-repo --path secret.txt --invert-paths

# 移除整個目錄
$ git filter-repo --path config/credentials/ --invert-paths

# 移除所有超過 10MB 的大檔案（處理 repo 臃腫問題）
$ git filter-repo --strip-blobs-bigger-than 10M

# 完成後，清理殘留物件並強制推送
$ git gc --prune=now --aggressive
$ git push --force --all
$ git push --force --tags
```

<!--
要真正移除檔案，我們用 `git filter-repo`。
在 macOS 上也可以用 brew 安裝。
`--path` 指定要處理的路徑，`--invert-paths` 的意思是「保留這個路徑以外的所有東西」。
合起來，就是把這個檔案從每一個 commit 裡拿掉。
同樣的寫法也能用來移除整個資料夾。
如果 repo 是因為誤放了大檔案而越來越肥，可以用 `--strip-blobs-bigger-than`，移除超過一定大小的檔案。
完成之後，用 `git gc` 把殘留的物件真正清掉，再強制推送分支和標籤。
-->

---

# 操作後的注意事項

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px; margin-bottom: 1rem;">
  <strong>⚠️ 重寫歷史會影響所有協作者！</strong>他們的本地端 clone 會和遠端產生分歧，必須重新 clone。
</div>

操作後的標準流程：

```bash
# 1. 備份（強烈建議操作前先備份整個 repo）
$ cp -r my-project my-project-backup

# 2. 執行 filter-repo，清理完成

# 3. Force push
$ git push --force --all && git push --force --tags

# 4. 通知所有協作者
# "大家注意：我剛剛重寫了 Git 歷史，請把你們的本地 clone 刪掉重新 clone"

# 5. 協作者的操作
$ cd ..
$ rm -rf my-project
$ git clone <remote-url>
```

<!--
重寫歷史之後，所有協作者本機的 clone 都會和遠端對不起來。
如果他們直接 pull，會看到一大堆衝突，因為 commit 的編號全變了。
所以標準流程是這樣。
操作之前，先把整個 repo 備份一份，萬一失誤還有退路。
清理完成後強制推送，然後通知所有協作者。
請大家把本機的資料夾刪掉，重新 clone 一份。
這個操作最好選在協作的人最少的時候進行，並且事先告知大家。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## 【冷知識】斷頭（detached HEAD）是怎麼一回事？

<!--
最後一個冷知識。大家有沒有看過 HEAD detached at 這個訊息？這不是 Git 壞掉了，我們來看它是什麼。
-->

---

# 正常狀態下的 HEAD

在正常狀態下，HEAD 是這樣的：

```text
HEAD → main → commit A → commit B → commit C（最新）
```

HEAD 指向「目前所在的分支」，分支再指向「最新的 commit」。

```bash
# 查看 HEAD 指向哪裡
$ cat .git/HEAD
ref: refs/heads/main    ← HEAD 指向 main 分支（正常狀態）

# 查看目前在哪個分支
$ git branch
* main    ← 星號代表目前所在位置
  develop
```

<!--
先看正常的狀態。
HEAD 是 Git 裡最重要的指標，代表「我們現在在哪裡」。
正常情況下，HEAD 指向某個分支，分支再指向最新的 commit。
我們可以打開 `.git/HEAD` 這個檔案來看，內容寫著 refs/heads/main。
意思就是 HEAD 正指著 main 分支。
這樣設計的好處是，每次新增 commit，分支往前移，HEAD 也跟著它一起前進。
-->

---

# Detached HEAD：HEAD 直接指向 Commit

Detached HEAD 就是 HEAD 不再指向分支，而是**直接指向某個 commit**。

```bash
# 觸發方式：checkout 一個 commit hash（而非分支名稱）
$ git checkout 3c7d2b1

Note: switching to '3c7d2b1'.
You are in 'detached HEAD' state.
（以下 Git 會詳細說明目前的狀況和你可以做什麼）

# 此時 HEAD 的內容
$ cat .git/HEAD
3c7d2b1a5e8b9f2...（直接是一個 hash，不是 ref）

# git branch 顯示
$ git branch
* (HEAD detached at 3c7d2b1)
  main
  develop
```

<!--
detached HEAD，中文常叫斷頭，就是 HEAD 不再指向分支，而是直接指向某個 commit。
最常見的觸發方式，是用 `git checkout`，後面接一個 commit 編號，而不是分支名稱。
Git 會把工作目錄切換成那個 commit 的樣子，並告訴我們，現在是 detached HEAD 狀態。
這時再打開 `.git/HEAD`，裡面直接就是一個 commit 編號。
`git branch` 也會顯示 HEAD detached at，加上那個編號。
-->

---

# Detached HEAD 的危險：新 Commit 容易遺失

```text
在 detached HEAD 狀態下新增 commit：

main:     A ── B ── C ── D（main 還在這裡）
                    ↑
                   HEAD（你在這裡開始工作）

做了幾個 commit 之後：
          A ── B ── C ── D（main）
                    ↑
                    E ── F（這些 commit 沒有任何分支指向它們！）

一旦你切換回 main 或其他分支，E 和 F 就沒有任何東西指向它們了。
Git 的 garbage collection 最終會把它們清掉。
```

<!--
detached HEAD 最需要注意的，是新做的 commit 很容易遺失。
看這張圖，我們從 C 開始，在 detached HEAD 狀態下做了 E 和 F 兩個 commit。
但沒有任何分支指向它們。
一旦切換回 main，E 和 F 就沒有名字可以找到了。
它們不會立刻消失，在 reflog 保留的期限內，還能找回來。
但過了期限，Git 的垃圾回收就會把它們清掉。
-->

---

# Detached HEAD 的解決方式

```bash
# 方法一：建立新分支，把當前狀態保存下來（最常用）
$ git checkout -b new-feature-branch
# 或 Git 2.23+ 的新語法
$ git switch -c new-feature-branch

# 方法二：如果在 detached HEAD 狀態做了一些 commit 想保留
$ git branch save-my-work    # 先建立分支指向目前位置
$ git checkout main          # 再切回去

# 方法三：如果什麼都沒做，只是來「看看」舊的版本
$ git checkout main          # 直接切回去就好，沒有任何損失

# 查看是否還在 detached HEAD 狀態
$ git status
HEAD detached at 3c7d2b1    ← 還在
On branch main               ← 已回到正常狀態
```

<!--
遇到 detached HEAD，最重要的是先問自己：我有沒有在這個狀態下做了新的 commit？
如果有，馬上建立一個分支，例如用 `git switch -c`。
讓這些 commit 有一個名字來保管它們。
如果已經做了幾個 commit，也可以先用 `git branch` 建立分支，再切回 main。
如果什麼都沒做，只是來看看舊版本，直接切回 main 就好，不會有任何損失。
最後，用 `git status` 確認，看到 On branch main，就代表回到正常狀態了。
-->

---

# 什麼時候會進入 Detached HEAD？

| 操作 | 是否進入 Detached HEAD |
| --- | --- |
| `git checkout <branch-name>` | 否，正常切換分支 |
| `git checkout <commit-hash>` | 是 |
| `git checkout <tag-name>` | 是（tag 不是分支） |
| `git rebase` 進行中 | 是（rebase 的內部機制） |
| `git bisect` 進行中 | 是（二分搜尋的內部機制） |

<br>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px;">
  <strong>記住：</strong>Detached HEAD 不是錯誤，只是「沒有分支保護」的狀態。只要你知道自己在做什麼，它是完全安全的。
</div>

<!--
這張表整理了哪些操作會進入 detached HEAD。
用 checkout 切換分支名稱，是正常的切換。
切換到 commit 編號，或是標籤，就會進入 detached HEAD，因為標籤不是分支。
rebase 和 bisect 進行到一半時，也會暫時進入這個狀態。
這是它們內部運作的需要，完成之後 Git 會自動帶我們回到分支上。
記住，detached HEAD 不是錯誤，只是「沒有分支保護」的狀態。
只要知道自己在做什麼，它是完全安全的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章我們處理了五種狀況。
用 stash 暫存做到一半的工作，用正確的順序處理外洩的密碼。
用 cherry-pick 精準挑選 commit，用 filter-repo 從歷史中移除檔案，最後看懂了 detached HEAD。
下一章，我們要更進一步，學習怎麼修改歷史紀錄。我們下一章見。
【講師】開放提問，可以請大家分享自己遇過的 Git 狀況。
-->
