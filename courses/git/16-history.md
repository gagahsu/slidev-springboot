---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: 修改歷史紀錄
routeAlias: ch16
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
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">修改歷史紀錄</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">「讓 Git 歷史更整潔、更有意義」</p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第十六章，修改歷史紀錄。
大家有沒有遇過，commit 完才發現訊息打錯？
或是一個 commit 裡塞了太多東西，歷史變得一團亂？
這章就是專門處理這些情境的。
學完之後，我們就能把 commit 歷史整理得乾淨、有意義，也知道什麼時候不該動它。
-->

---
layout: default
---

# Outline

- **【狀況題】修改歷史訊息** — git commit --amend / git rebase -i reword
- **【狀況題】合併多個 Commit** — git rebase -i squash
- **【狀況題】拆解一個 Commit** — git rebase -i edit + reset
- **【狀況題】在 Commit 之間插入新 Commit** — git rebase -i edit
- **【狀況題】刪除或調整 Commit 順序** — git rebase -i drop/reorder
- **Reset、Revert 與 Rebase 的差別** — 三種修改歷史的方式比較

<!--
這章有六個主題。
前五個都是狀況題：改訊息、合併 commit、拆解 commit、插入新的 commit，以及刪除或調整順序。
它們大多會用到同一個工具，互動式 rebase。
最後一個主題，幫大家分清楚 reset、revert 和 rebase 的使用時機。
先提醒一句，修改已經推送的 commit 有風險，動手前一定要確認影響範圍。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 【狀況題】修改歷史訊息

<!--
第一個狀況題：commit 訊息打錯了，或是忘了寫重要資訊，要怎麼修改？
-->

---
layout: default
---

# 修改最近一次 Commit 訊息

**情境：** 剛剛 commit，發現訊息寫錯了

```bash
# 修改最近一次 commit 的訊息
git commit --amend -m "正確的 commit 訊息"

# 或是不加 -m，開啟編輯器修改
git commit --amend
```

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px; margin-top: 1.2rem;">

**`--amend` 實際上做了什麼？**

`git commit --amend` 不是「修改」舊的 commit，而是**建立一個新的 commit 取代原本的**。新 commit 擁有新的 SHA hash，但保留原本的變更內容（除非你在 amend 前有新的暫存變更）。

</div>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 0.8rem 1.2rem; border-radius: 4px; margin-top: 0.8rem;">

⚠️ **注意：** `--amend` 也可以同時修改 commit 內容與訊息。執行前先 `git add` 要補進去的檔案即可。

</div>

<!--
如果要改的是最近一次的 commit，用 `git commit --amend` 就可以。
加上 `-m` 直接寫新的訊息，不加的話，會打開編輯器讓我們修改。
這裡有一個重點：amend 並不是真的去「修改」原本的 commit。
它是建立一個新的 commit 來取代原本的，所以 commit 編號會不一樣。
amend 也可以順便補檔案，只要在 amend 之前，先 `git add` 要補進去的檔案就好。
也因為編號變了，如果原本的 commit 已經推上遠端，amend 之後就要強制推送。
-->

---
layout: default
---

# 修改更早的 Commit 訊息

**情境：** 想修改的 commit 不是最新的那一個

```bash
# 開啟互動式 rebase，列出最近 N 個 commit
git rebase -i HEAD~3
```

編輯器會顯示類似這樣的清單：

```text
pick a1b2c3d 新增使用者登入功能
pick e4f5a6b 修正登入頁面樣式
pick c7d8e9f 更新 README

# Commands:
# p, pick   = 保留此 commit
# r, reword = 保留此 commit，但修改訊息
# ...
```

將想修改的那一行 `pick` 改成 `reword`（或 `r`），存檔離開後，Git 會依序停在每個標記 reword 的 commit，讓你輸入新訊息。

<!--
如果要改的不是最新的 commit，就要用互動式 rebase。
`git rebase -i HEAD~3`，代表列出最近三個 commit，數字可以依需求調整。
執行之後，編輯器會打開一份清單，每一行是一個 commit，前面都寫著 pick。
想像這份清單，就是一份可以編輯的歷史。
把想改訊息的那一行，從 pick 改成 reword，存檔離開。
Git 就會在那個 commit 停下來，讓我們輸入新的訊息。
如果要改好幾個，就把好幾行都改成 reword，Git 會一個一個停下來。
-->

---
layout: default
---

# 修改歷史訊息的注意事項

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-top: 0.5rem;">

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px;">

**安全的情況 ✓**

- Commit 還沒有推送到遠端
- 在個人分支（feature branch）上操作
- 與團隊溝通好，所有人都同意重寫歷史

</div>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 1rem 1.2rem; border-radius: 4px;">

**危險的情況 ✗**

- 已推送到 `main` / `master`
- 其他人已經基於這些 commit 開發
- 公開的開源專案主分支

</div>

</div>

**如果確定要修改已推送的 commit：**

```bash
# 強制推送（會覆蓋遠端歷史！）
git push --force-with-lease origin feature/my-branch

# --force-with-lease 比 --force 更安全
# 如果遠端有別人新推的 commit，會拒絕推送
```

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 0.8rem 1.2rem; border-radius: 4px; margin-top: 0.8rem;">

⚠️ Force push 之後，其他人需要重新 fetch 並 reset 自己的本地分支，否則可能產生分歧。

</div>

<!--
修改歷史最大的風險，是影響到其他人的工作。
左邊是安全的情況。
commit 還沒推送、在自己的功能分支上，或是團隊都同意要重寫歷史。
右邊是危險的情況。
已經推送到 main、別人已經在這些 commit 上繼續開發，或是公開專案的主分支。
如果確定要修改已經推送的 commit，強制推送時，建議用 `--force-with-lease`。
它會先確認遠端沒有我們不知道的新 commit，有的話就拒絕推送，比 `--force` 安全。
強制推送之後，其他人也要重新同步本機的分支，否則會產生分歧。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 【狀況題】合併多個 Commit

<!--
第二個狀況題：把好幾個零碎的 commit，合併成一個乾淨的 commit。
-->

---
layout: default
---

# 為什麼要合併 Commit？

**開發過程中的雜亂歷史（常見）：**

```text
* f3a2b1c WIP
* e2d1a0b WIP: 繼續寫
* d1c0b9a fix: 修一個 bug
* c0b9a8d WIP: 還沒完成
* b9a8d7c temp save
* a8d7c6e 新增使用者登入功能（初版）
```

**整理後（清晰、有意義）：**

```text
* f3a2b1c feat: 新增使用者登入功能
* a8d7c6e refactor: 抽取共用驗證邏輯
```

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px; margin-top: 1rem;">

良好的 Git 歷史是**給未來的自己和同事讀的**，每個 commit 應該代表一個完整、有意義的變更單元。

</div>

<!--
大家開發時，是不是常常一邊寫一邊 commit？
結果留下一堆 WIP、temp save、修一個 bug 這種訊息，就像上面這樣。
整理之後，同樣的工作只剩兩個清楚的 commit。
這不只是好不好看的問題。
三個月後要追查 bug，或是用 `git blame` 理解某一行程式的來龍去脈。
一堆 WIP commit 會讓這些事情變得很困難。
所以在發 PR 之前整理好 commit，是對審查者的尊重，也是照顧未來維護的人。
-->

---
layout: default
---

# squash 與 fixup 指令

```bash
git rebase -i HEAD~5
```

```text
pick a1b2c3d 新增使用者登入功能（初版）
squash b2c3d4e WIP: 還沒完成
squash c3d4e5f temp save
squash d4e5f6a WIP: 繼續寫
fixup  e5f6a7b WIP: 最後修正
```

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px;">

**`squash`（或 `s`）**

- 將此 commit 合併到上一個
- **保留** 此 commit 的訊息（會開啟編輯器讓你合併訊息）
- 適合：每個 commit 訊息都有保留價值

</div>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px;">

**`fixup`（或 `f`）**

- 將此 commit 合併到上一個
- **丟棄** 此 commit 的訊息
- 適合：WIP、temp、fix typo 這類沒意義的訊息

</div>

</div>

<!--
合併 commit 會用到兩個指令：squash 和 fixup。
在互動式 rebase 的清單裡，把某一行改成它們，那個 commit 就會被併進上一行的 commit。
兩者的差別，只在於要不要保留訊息。
squash 會保留訊息，Git 會打開編輯器，讓我們把幾個訊息合併成最終的版本。
fixup 則是直接丟掉這個 commit 的訊息。
所以像 WIP、temp 這類沒有意義的訊息，用 fixup 就好。
如果訊息裡有值得保留的資訊，就用 squash。
-->

---
layout: default
---

# 合併 Commit 實戰示範

**目標：** 將 5 個 WIP commit 整理成 1 個乾淨的 commit

```bash
# 步驟一：開啟互動式 rebase
git rebase -i HEAD~5
```

```text
# 在編輯器中修改（第一行保持 pick，其餘改為 fixup）：
pick  a8d7c6e 新增使用者登入功能（初版）
fixup b9a8d7c temp save
fixup c0b9a8d WIP: 還沒完成
fixup d1c0b9a fix: 修一個 bug
fixup e2d1a0b WIP: 繼續寫
```

```bash
# 步驟二：存檔離開編輯器，Git 自動合併
# 步驟三：如果用了 squash，Git 會開啟訊息編輯器，輸入最終訊息
# 步驟四：確認結果
git log --oneline -3
```

```text
f3a2b1c feat: 新增使用者登入功能
...
```

<!--
我們實際把五個零碎的 commit 整理成一個。
先執行 `git rebase -i HEAD~5`。
在清單裡，第一行保持 pick，後面四行都改成 fixup，存檔離開，Git 就會自動合併。
要特別注意，第一行一定要保持 pick。
因為 squash 和 fixup 是併進上一個 commit，第一行上面沒有東西可以併。
如果用的是 squash，Git 會再打開編輯器，讓我們輸入最終的訊息。
最後用 `git log` 確認，五個 commit 已經變成一個了。
過程中如果搞混了，隨時可以用 `git rebase --abort`，回到操作之前的狀態。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 【狀況題】拆解一個 Commit

<!--
第三個狀況題，反過來：一個 commit 塞了太多東西，要怎麼把它拆開？
-->

---
layout: default
---

# 為什麼要拆解 Commit？

**常見情境：**

- 一個 commit 同時修改了兩個不相關的功能
- 修 bug 和加新功能混在同一個 commit
- commit 太大，難以理解和 review

**目標：** 把一個 commit 拆成兩個（或更多）獨立的 commit

```text
# 拆解前
* a1b2c3d 修正登入 bug + 新增個人資料頁面

# 拆解後
* c3d4e5f feat: 新增個人資料頁面
* b2c3d4e fix: 修正登入時 session 未清除的 bug
```

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px; margin-top: 1rem;">

每個 commit 只做一件事（Single Responsibility），讓歷史更容易追蹤，也讓 `git bisect` 更精準。

</div>

<!--
常見的情況是，一個 commit 同時改了兩個不相關的功能。
例如修 bug 和加新功能混在一起，或是 commit 太大，很難理解和審查。
看這個例子，一個 commit 同時做了「修正登入 bug」和「新增個人資料頁面」。
我們希望把它拆成兩個獨立的 commit。
原則是，每個 commit 只做一件事。
這樣以後如果要用 `git revert` 還原其中一件事，才不會連另一件事也一起被還原。
-->

---
layout: default
---

# 拆解 Commit 的步驟

```bash
# 步驟一：開啟互動式 rebase，找到目標 commit
git rebase -i HEAD~3
```

```text
# 把目標 commit 從 pick 改成 edit（或 e）
pick  x1y2z3 其他 commit
edit  a1b2c3d 修正登入 bug + 新增個人資料頁面
pick  b2c3d4e 其他更新
```

```bash
# 步驟二：Git 停在 edit 的 commit，此時 HEAD 指向該 commit
# 步驟三：用 reset 把該 commit 的變更退回工作目錄
git reset HEAD~

# HEAD~ 代表「目前 HEAD 的上一個 commit」
# git reset HEAD~ 預設是 --mixed，變更退回工作目錄（未暫存）
```

<!--
拆解的步驟是這樣。
先開啟互動式 rebase，把要拆的那個 commit，從 pick 改成 edit。
edit 的意思是：Git 套用完這個 commit 之後，先停下來，讓我們做一些修改。
停下來之後，執行 `git reset HEAD~`。
HEAD 加一個波浪號，代表目前位置的上一個 commit。
這個指令會把剛才那個 commit 撤銷，但改動還留在工作目錄裡。
這樣我們就可以重新分批 commit 了。
-->

---
layout: default
---

# 拆解 Commit 的步驟（續）

```bash
# 目前狀態：所有變更都在工作目錄，尚未暫存
git status
# 可以看到登入相關和個人資料頁面相關的檔案都未暫存

# 步驟四：分批 add + commit
git add src/auth/login.js
git commit -m "fix: 修正登入時 session 未清除的 bug"

git add src/profile/
git commit -m "feat: 新增個人資料頁面"

# 步驟五：繼續 rebase 流程
git rebase --continue
```

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px; margin-top: 1rem;">

**小技巧：** 如果不確定要拆成幾個，可以用 `git diff` 先看清楚所有變更，再決定如何分組。

</div>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 0.8rem 1.2rem; border-radius: 4px; margin-top: 0.8rem;">

如果中途想放棄，執行 `git rebase --abort` 回到操作前的狀態。

</div>

<!--
現在所有改動都在工作目錄裡，還沒暫存，用 `git status` 就能看到。
接著分批 add 和 commit。
先 add 登入相關的檔案，commit 成「修正登入 bug」。
再 add 個人資料頁面的資料夾，commit 成「新增個人資料頁面」。
最後執行 `git rebase --continue`，告訴 Git 這一站處理完了，繼續往下。
如果一個檔案裡同時有兩種改動，可以用 `git add -p`，一段一段挑選要放進這次 commit 的內容。
中途想放棄，一樣可以用 `git rebase --abort`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 【狀況題】在 Commit 之間插入新 Commit

<!--
第四個狀況題比較少見：在兩個已經存在的 commit 之間，插入一個新的 commit。
-->

---
layout: default
---

# 在 Commit 之間插入新 Commit

**情境：** 兩週前的 commit 少了一個必要的設定檔，但後續已有很多 commit

```text
# 目前歷史
* e5f6a7b 新增報表功能
* d4e5f6a 新增使用者登入功能   ← 這裡少了 config/auth.yml
* c3d4e5f 初始化專案
```

**解法：使用 `git rebase -i` 的 `edit` 指令**

```bash
# 開啟互動式 rebase，列出最近三個 commit
git rebase -i HEAD~3
```

```text
# 把「新增使用者登入功能」改成 edit
pick  c3d4e5f 初始化專案
edit  d4e5f6a 新增使用者登入功能
pick  e5f6a7b 新增報表功能
```

<!--
情境是這樣，兩週前的「新增使用者登入功能」少了一個必要的設定檔。
但之後已經有很多 commit 了，我們希望把設定檔補在那個位置。
解法一樣是互動式 rebase 的 edit。
把「新增使用者登入功能」那一行改成 edit。
Git 套用完這個 commit 就會停下來，我們就能在這個時間點加入新的 commit。
-->

---
layout: default
---

# 插入新 Commit 的步驟

```bash
# Git 停在 "新增使用者登入功能" 這個 commit 之後
# 此時工作目錄已包含該 commit 的所有變更

# 步驟一：建立並加入遺漏的設定檔
# （不需要 reset，因為我們要在現有 commit 之後插入）
touch config/auth.yml
# 編輯 config/auth.yml...

# 步驟二：commit 這個新增的設定
git add config/auth.yml
git commit -m "config: 新增 auth 設定檔"

# 步驟三：繼續 rebase
git rebase --continue
```

**完成後的歷史：**

```text
* f6a7b8c 新增報表功能
* e5f6a7b config: 新增 auth 設定檔   ← 插入成功
* d4e5f6a 新增使用者登入功能
* c3d4e5f 初始化專案
```

<!--
Git 停下來之後，工作目錄的狀態，就是剛套用完那個 commit 的樣子。
這次不需要 reset，因為我們不是要拆開它，而是要在它後面加東西。
直接建立遺漏的設定檔，add 之後 commit。
接著執行 `git rebase --continue`，Git 會把後面的 commit 繼續接上去。
看完成後的歷史，設定檔的 commit 就插在登入功能和報表功能中間。
就像它從一開始就在那裡一樣。
如果後面的 commit 和新插入的內容有衝突，Git 會停下來，請我們手動解決。
-->

---
layout: default
---

# 使用情境整理

**什麼時候需要插入新 Commit？**

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.8rem;">

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px;">

**適合插入新 Commit 的情況**

- 某個功能 commit 遺漏了必要的設定或文件
- 需要在特定時間點加入 migration 或 seed 資料
- 希望保持「功能 commit + 設定 commit」的邏輯順序
- PR review 時被要求補充特定 commit

</div>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px;">

**替代方案（可能更簡單）**

- 直接新增一個 commit 在最後（不改歷史）
- 用 `git commit --fixup <hash>` 標記補丁 commit
- 再用 `git rebase --autosquash` 自動整理

</div>

</div>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px; margin-top: 1rem;">

**`--autosquash` 小技巧：** 用 `git commit --fixup <hash>` 建立的 commit，在執行 `git rebase -i --autosquash` 時，會自動排到對應 commit 後面並標記為 fixup，省去手動編輯。

</div>

<!--
什麼時候需要插入新的 commit 呢？
例如某個功能遺漏了必要的設定，或是審查時被要求在特定位置補上 commit。
不過大部分情況下，直接在最後面新增一個 commit，是最簡單的做法，不需要改歷史。
另外介紹一個好用的技巧。
用 `git commit --fixup`，加上要修補的那個 commit 編號，建立一個修補用的 commit。
之後執行 `git rebase -i --autosquash`。
Git 會自動把它排到對應的 commit 後面，並標記成 fixup，省去手動編輯清單的麻煩。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 【狀況題】刪除或調整 Commit 順序

<!--
第五個狀況題：刪除不需要的 commit，或是調整 commit 的順序。
-->

---
layout: default
---

# 刪除特定 Commit

**情境：** 某個 commit 是測試用的，不應該進入正式歷史

```bash
git rebase -i HEAD~4
```

```text
# 使用 drop（或 d）指令，或直接刪除該行
pick  a1b2c3d 修正登入 bug
drop  b2c3d4e debug: 暫時印出所有 SQL（測試用）
pick  c3d4e5f 新增使用者個人頁面
pick  d4e5f6a 更新文件
```

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px; margin-top: 1rem;">

⚠️ **注意：** 刪除 commit 會永久移除該 commit 的所有變更。確認該 commit 的變更真的不需要，再執行 drop。

</div>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px; margin-top: 0.8rem;">

如果刪除的 commit 和後續 commit 有依賴關係（例如後面的 commit 用到了被刪除的函式），會產生**衝突**，需要手動處理。

</div>

<!--
例如不小心把測試用的除錯程式碼 commit 進去了。
在互動式 rebase 的清單裡，把那一行改成 drop，或是直接把那一行刪掉，效果一樣。
要注意，drop 會把這個 commit 的所有改動都移除。
動手之前，先確認裡面真的沒有需要的東西。
如果後面的 commit 依賴它，例如用到了被刪掉的函式，就會產生衝突，需要手動處理。
-->

---
layout: default
---

# 調整 Commit 順序

**情境：** 想重新排列 commit 的邏輯順序，讓歷史更容易理解

```bash
git rebase -i HEAD~4
```

```text
# 調整前（在編輯器中直接移動行的位置）
pick  a1b2c3d 初始化資料庫 schema
pick  b2c3d4e 新增前端登入頁面
pick  c3d4e5f 新增後端登入 API
pick  d4e5f6a 新增資料庫連線設定

# 調整後（更符合邏輯順序）
pick  a1b2c3d 初始化資料庫 schema
pick  d4e5f6a 新增資料庫連線設定
pick  c3d4e5f 新增後端登入 API
pick  b2c3d4e 新增前端登入頁面
```

在編輯器中**直接移動行的位置**，就能調整 commit 的先後順序。

<!--
調整順序的方法更直觀，在編輯器裡直接把那一行移到想要的位置就好。
看這個例子，原本的順序是前端頁面在後端 API 之前。
我們把它調整成資料庫、連線設定、後端 API，最後才是前端頁面。
這樣的順序更符合開發的邏輯，閱讀歷史的人也更容易理解。
不過，如果兩個 commit 改到了同一段程式碼，調換順序就可能產生衝突。
-->

---
layout: default
---

# 調整順序可能產生衝突

**衝突的原因：** 兩個 commit 修改了同一段程式碼，換序後依賴關係改變

```bash
# 衝突處理流程
git rebase -i HEAD~4
# 在編輯器中調整順序後存檔

# 如果有衝突，Git 會停下來並提示
# Auto-merging src/app.js
# CONFLICT (content): Merge conflict in src/app.js
# error: could not apply b2c3d4e...

# 步驟一：手動編輯衝突檔案，解決衝突標記
# 步驟二：暫存解決後的檔案
git add src/app.js

# 步驟三：繼續 rebase
git rebase --continue
```

```bash
# 如果衝突太複雜，想放棄整個 rebase
git rebase --abort
# Git 會回到 rebase 開始前的狀態，完全沒有副作用
```

<!--
衝突的原因是，兩個 commit 改了同一段程式碼，換了順序之後，彼此的依賴關係就變了。
Git 會停下來，告訴我們哪個檔案有衝突。
處理方式跟一般的合併衝突一樣。
打開檔案解決衝突，用 `git add` 標記已解決，再執行 `git rebase --continue`。
如果衝突太複雜，就用 `git rebase --abort`。
Git 會回到 rebase 開始之前的狀態，沒有任何副作用。
它是 rebase 過程中隨時可以用的安全網。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# Reset、Revert 與 Rebase 的差別

<!--
最後一個主題，我們來釐清 reset、revert 和 rebase。這三個是最容易搞混的工具。
-->

---
layout: default
---

# git reset — 移動 HEAD 指標

**概念：** 把 HEAD 和目前分支指標往回移動到指定的 commit

```bash
# 退回到三個 commit 之前
git reset HEAD~3

# 三種模式
git reset --soft  HEAD~3   # 變更保留在暫存區（staged）
git reset --mixed HEAD~3   # 變更退回工作目錄（預設）
git reset --hard  HEAD~3   # 變更直接丟棄（危險！）
```

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.8rem; margin-top: 1rem;">

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.8rem; border-radius: 4px; font-size: 0.9em;">

**--soft**
HEAD 移動，變更留在暫存區，可以重新 commit

</div>

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.8rem; border-radius: 4px; font-size: 0.9em;">

**--mixed**（預設）
HEAD 移動，變更退回工作目錄，需要重新 add

</div>

<div style="background: #fef3c7; border-left: 4px solid #d97706; padding: 0.8rem; border-radius: 4px; font-size: 0.9em;">

**--hard**
HEAD 移動，變更完全丟棄，無法恢復（除非用 reflog）

</div>

</div>

<!--
`git reset` 的作用，是把 HEAD 和目前的分支，往回移到指定的 commit。
就像把時間倒回去，三種模式的差別，在於帶了多少東西回來。
`--soft` 把改動帶回暫存區，可以直接重新 commit。
`--mixed` 是預設模式，把改動帶回工作目錄，需要重新 add。
`--hard` 什麼都不帶，改動直接丟掉。
被退掉的 commit，還能從 reflog 找回來。
但還沒 commit 的改動，用 `--hard` 丟掉之後，就真的找不回來了，使用前要特別小心。
-->

---
layout: default
---

# git revert — 安全的反向 Commit

**概念：** 建立一個新的 commit，這個 commit 的內容是「還原某個 commit 的所有變更」

```bash
# 還原指定的 commit（用 hash）
git revert a1b2c3d

# 還原最近一個 commit
git revert HEAD

# 還原但不立即 commit（留在暫存區）
git revert --no-commit a1b2c3d
```

**執行後的歷史：**

```text
* e5f6a7b Revert "新增有問題的功能"   ← 新增的反向 commit
* d4e5f6a 其他更新
* c3d4e5f 新增有問題的功能            ← 原本的 commit 依然存在
* b2c3d4e 修正登入 bug
```

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px; margin-top: 0.8rem;">

**優點：** 原本的 commit 歷史完整保留，新增的 revert commit 可以正常推送到遠端，不需要 force push。

</div>

<!--
`git revert` 是最安全的還原方式。
它不修改既有的歷史，而是新增一個 commit，內容剛好抵銷掉指定 commit 的改動。
看下面的歷史，原本那個有問題的 commit 還在，上面多了一個 Revert 開頭的 commit。
因為沒有改寫歷史，可以正常推送到遠端，不需要強制推送，其他人拉下來也能順利同步。
所以在主分支上要還原有問題的 commit，就用 revert。
如果想先看看結果再決定，可以加上 `--no-commit`。
-->

---
layout: default
---

# git rebase — 重新套用 Commit

**概念：** 把一系列 commit 從原來的 base 「移植」到新的 base 上，或是在互動模式下重新整理 commit

```bash
# 把目前分支 rebase 到 main 的最新點
git rebase main

# 互動式 rebase（本章介紹的主要工具）
git rebase -i HEAD~5
```

**Rebase 的本質：重新寫入所有 commit**

```text
# 前
main:    A - B - C
feature:         D - E - F

# git rebase main 後
main:    A - B - C
feature:             D' - E' - F'
```

D'、E'、F' 是新的 commit（不同的 hash），但內容相同（套用在新的 base 上）。

<!--
`git rebase` 的作用，是把一串 commit 重新套用到另一個基礎上。
看下面的圖，feature 原本是從 B 長出來的。
執行 `git rebase main` 之後，D、E、F 被移到 C 的後面，變成 D'、E'、F'。
它們的內容一樣，但已經是全新的 commit，編號都不同了。
這也是為什麼，已經推送的 commit 做了 rebase，就需要強制推送。
這章用的互動式 rebase，也是同一個原理，只是讓我們在重新套用的過程中做調整。
-->

---
layout: default
---

# 三種工具對照表

| | `git reset` | `git revert` | `git rebase` |
|---|---|---|---|
| **操作方式** | 移動 HEAD 指標 | 新增反向 commit | 重新套用 commit |
| **歷史變更** | 是（刪除 commit） | 否（新增 commit） | 是（重寫 commit） |
| **是否安全推送** | 需要 force push | ✓ 可直接推送 | 需要 force push |
| **適用場景** | 本機撤銷暫存或 commit | 還原已推送的 commit | 整理本機 commit 歷史 |
| **影響範圍** | 本機 | 本機＋遠端 | 本機（推後影響遠端） |

<!--
我們用這張表把三個工具放在一起比較。
reset 是移動指標，會讓 commit 從歷史中消失，適合在本機撤銷。
revert 是新增一個反向的 commit，不改寫歷史，可以直接推送，適合還原已經推送的 commit。
rebase 是重新套用 commit，會改寫歷史，適合整理還沒推送的 commit。
看完這張表，會發現真正的關鍵，只有一個問題：這個 commit 已經推送了嗎？
-->

---

# 三種工具：選擇原則

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 0.9rem 1.2rem; border-radius: 4px; margin-bottom: 1.2rem;">

**選擇原則：**
- 還沒推送 → `reset` 或 `rebase -i` 自由整理
- 已推送、需要還原 → `revert`（安全，不破壞歷史）
- 已推送、需要整理 → `rebase` + force push（需團隊知情）

</div>

| 情境 | 推薦工具 | 原因 |
|------|----------|------|
| 本機撤銷 commit | `git reset` | 只影響本機，乾淨 |
| 還原已推送的 commit | `git revert` | 不需 force push，安全 |
| 整理未推送的歷史 | `git rebase -i` | 彈性最大 |

<!--
所以選擇的原則很簡單。
還沒推送的 commit，可以用 reset 或互動式 rebase 自由整理。
已經推送、需要還原的，用 revert，安全又不破壞歷史。
已經推送、又真的需要整理的，可以用 rebase 加上強制推送，但一定要讓團隊知道。
-->

---
layout: default
---

# 何時用哪個指令？決策流程

```text
想要「改變程式碼狀態」或「處理 commit 問題」
│
├── 這個 commit 已推送到遠端嗎？
│   │
│   ├── 否 → 自由選擇
│   │         ├── 只是想撤銷暫存 → git reset HEAD <file>
│   │         ├── 想撤銷最近幾個 commit → git reset HEAD~N
│   │         └── 想整理/修改/合併/拆解 commit → git rebase -i
│   │
│   └── 是 → 謹慎選擇
│             ├── 想還原某個有問題的 commit → git revert <hash>
│             ├── 需要整理（已告知團隊）→ git rebase -i + force push
│             └── 在個人 feature branch → git rebase -i + force push
│
└── 黃金原則：不要重寫公開的共享歷史
```

<!--
最後用這張決策流程圖收尾。
遇到問題時，先問自己：這個 commit 已經推送到遠端了嗎？
如果還沒，就可以自由選擇。
撤銷暫存或撤銷 commit 用 reset，想整理、合併、拆解 commit，就用互動式 rebase。
如果已經推送了，就要謹慎。
想還原有問題的 commit，用 revert。
只有在自己的功能分支，或是團隊都知情的情況下，才用 rebase 加強制推送。
黃金原則只有一句：不要重寫公開的共享歷史。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章我們學會了用 amend 修改最後一個 commit。
也學會用互動式 rebase 改訊息、合併、拆解、插入、刪除和調整順序。
也分清楚了 reset、revert 和 rebase 的使用時機。
記住，還沒推送可以自由整理，已經推送就用 revert 最安全。
就算真的出錯，`git reflog` 也幾乎都能幫我們找回來。
下一章，我們來看團隊常用的分支流程，Git Flow。我們下一章見。
【講師】開放提問，可以請大家用練習 repo 實際做一次 squash。
-->
