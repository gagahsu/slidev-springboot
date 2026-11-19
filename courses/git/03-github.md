---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: B3 放上 GitHub
routeAlias: ch03
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
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 初學者課程 · B3</p>
  <h1 style="color: #92400e; font-size: 3.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">放上 GitHub</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「開工先 Pull，收工記得 Push」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第三章，放上 GitHub。
上一章我們做了好幾個存檔點，但它們都只在自己的電腦上，電腦壞了就全部沒了。
這一章要把專案放到 GitHub，也就是雲端存檔，並且學會怎麼在電腦和 GitHub 之間同步。
-->

---
layout: default
---

# 回顧 B2，這一章我們會做到

<div class="grid grid-cols-2 gap-8 mt-2">
<div style="background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px; padding: 1rem;">

**回顧**

- 打勾 → Summary → Commit，就是存檔
- History 分頁是存檔列表
- 目前所有存檔**只在自己的電腦**

</div>
<div>

**這一章**

- **Part 1** 本機和遠端
- **Part 2** Publish：第一次放上 GitHub
- **Part 3** Push：把新的存檔送上去
- **Part 4** Pull：把 GitHub 上的更新拿回來
- **Part 5** Clone：在另一個地方抓一份下來

</div>
</div>

<!--
先回顧上一章：打勾、寫 Summary、按 Commit，就是做一個存檔點，History 分頁可以看到所有存檔。
但到目前為止，這些存檔都只在我們自己的電腦裡。
這一章分五個部分：先搞懂本機和遠端，再學 Publish、Push、Pull、Clone 四個動作。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 本機和遠端

<!--
開始操作前，先建立一個觀念：同一個專案，現在會有兩份。
-->

---

# 同一個專案，兩個地方各有一份

<div style="display:flex; align-items:center; justify-content:center; gap:1.5rem; margin-top:1.5rem;">
  <div style="border: 2px solid #d97706; border-radius:12px; padding:1rem 1.4rem; background:#fff8f0; text-align:center; min-width:220px;">
    <div style="font-size:1.8rem;">💻</div>
    <div style="font-weight:700; color:#92400e;">本機（local）</div>
    <div style="font-size:0.85rem; color:#78350f; margin-top:0.3rem;">你電腦裡的 my-profile<br>在這裡改檔案、做 commit</div>
  </div>
  <div style="text-align:center; color:#d97706; font-weight:700;">
    <div>Push ⬆️ 送上去</div>
    <div style="font-size:1.6rem;">⇅</div>
    <div>Pull ⬇️ 拿回來</div>
  </div>
  <div style="border: 2px solid #16a34a; border-radius:12px; padding:1rem 1.4rem; background:#f0fdf4; text-align:center; min-width:220px;">
    <div style="font-size:1.8rem;">☁️</div>
    <div style="font-weight:700; color:#14532d;">遠端（remote）</div>
    <div style="font-size:0.85rem; color:#166534; margin-top:0.3rem;">GitHub 上的 my-profile<br>Git 習慣叫它 <b>origin</b></div>
  </div>
</div>

<div class="mt-8 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> commit 只會存在本機。要按 <b>Push</b>，GitHub 上才會有；別人改了 GitHub，要按 <b>Pull</b>，你的電腦才會有。兩邊<b>不會自動同步</b>。
</div>

<!--
放上 GitHub 之後，同一個專案就會有兩份。
一份在我們的電腦裡，叫做本機；一份在 GitHub 上，叫做遠端。
Git 習慣把遠端叫做 origin，等一下在 Desktop 的按鈕上會一直看到這個字。
兩份之間不會自動同步，這是新手最常誤會的地方。
我們在本機 commit，GitHub 上不會馬上出現，要按 Push 送上去。
反過來，GitHub 上有人改了東西，也要按 Pull，我們的電腦才會拿到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## Publish：第一次放上 GitHub

<!--
第一次把專案放上 GitHub，Desktop 叫它 Publish。
-->

---

# 按下 Publish repository

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 點上方的 **Publish repository** |
| 2 | **Name** 維持 `my-profile` |
| 3 | **Keep this code private**：維持打勾 |
| 4 | 按 **Publish repository** |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Private</b> 只有你和你邀請的人看得到；取消打勾就是 <b>Public</b>，全世界都看得到。
</div>

</div>
<div>

<Shot file="b03-01-publish-repo.png" desc="Publish repository 對話框" />

<CliBox :cmds="['git remote add origin https://github.com/你的帳號/my-profile.git', 'git push -u origin main']" note="Desktop 一鍵做完這兩步" />

</div>
</div>

<!--
點上方工具列的 Publish repository，會跳出這個對話框。
Name 就是 GitHub 上的 repo 名稱，維持 my-profile。
Keep this code private 維持打勾，代表這是私人的 repo，只有我們自己和我們邀請的人看得到。
如果取消打勾，就會變成公開的，全世界都看得到，作品集可以考慮用公開的。
按下 Publish repository，Desktop 就會在 GitHub 上建好 repo，並把目前所有的 commit 送上去。
用指令的話要做兩步：先用 `git remote add` 設定遠端，再 `git push`。
-->

---

# 發布完成：上方按鈕變了

<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align:left;">
<div>

| 發布前 | 發布後 |
| --- | --- |
| **Publish repository** | **Fetch origin** |
| 專案只在本機 | 本機和 GitHub 已經連起來 |

<br>

**到 GitHub 看看：** 選單 Repository → **View on GitHub**（Ctrl + Shift + G），瀏覽器會打開你的 repo 頁面。

</div>
<div>

<Shot file="b03-02-repo-on-github.png" desc="推上去後的 GitHub repo 頁面" />

</div>
</div>

<!--
發布完成之後，上方的按鈕從 Publish repository 變成 Fetch origin。
這代表本機和 GitHub 已經連起來了，之後同步都靠這個位置的按鈕。
我們到 GitHub 確認一下。
從選單 Repository 選 View on GitHub，瀏覽器會打開 repo 頁面。
可以看到 index.html、.gitignore 都在上面，右邊的 commits 數字，就是我們上一章做的存檔。
注意 notes.txt 不在上面，因為它被 .gitignore 忽略了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## Push：把新的存檔送上去

<!--
發布之後，之後每次在本機 commit，都要自己 Push 送上去。
-->

---

# 動手做：新增聯絡方式

在 `index.html` 的興趣清單下面加一段，存檔：

```html {8}
  <h1>嗨，我是王小明</h1>
  <p>我正在學習 Git。</p>
  <h2>我的興趣</h2>
  <ul>
    <li>打籃球</li>
    <li>看電影</li>
  </ul>
  <p>聯絡我：wang@example.com</p>
```

回到 Desktop：打勾 → Summary 填 **`新增聯絡方式`** → Commit

<div class="mt-2 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>Commit 完還沒結束！</b> 這個存檔現在只在你的電腦裡，GitHub 上還看不到。
</div>

<!--
我們在本機再做一個 commit。
在興趣清單下面加一行聯絡方式，Email 可以隨便寫一個範例，不用放真的。
回到 Desktop，打勾、Summary 填「新增聯絡方式」、按 Commit。
這時候去 GitHub 網頁重新整理，會發現看不到這個修改。
因為 commit 只存在本機，還需要最後一步：Push。
-->

---

# Push origin：把 commit 送上 GitHub

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

- commit 之後，上方按鈕變成 **Push origin**
- 旁邊的 **↑1** 代表有 1 個 commit 還沒送上去
- 按下去，數字消失，GitHub 上就看得到了

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>好習慣：</b> 一天結束前，確認上方沒有 ↑ 數字，代表存檔都已經備份到 GitHub。
</div>

</div>
<div>

<Shot file="b03-03-push-origin.png" desc="頂部列 Push origin 按鈕（↑1）" />

<CliBox :cmds="['git push']" note="把本機的新 commit 送到 GitHub" />

</div>
</div>

<!--
commit 完之後，看一下上方，按鈕從 Fetch origin 變成了 Push origin。
旁邊有一個向上的箭頭和數字 1，代表有一個 commit 還沒送上去。
按下 Push origin，數字消失，回到 GitHub 重新整理，就能看到聯絡方式了。
建議大家養成習慣，一天結束前看一下這個按鈕，沒有向上的數字，代表今天的存檔都備份到 GitHub 了。
對應的指令是 `git push`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## Pull：把 GitHub 上的更新拿回來

<!--
反過來，如果 GitHub 上的內容比我們的電腦新，要怎麼拿回來？
-->

---

# 模擬「別人改了 GitHub」

真實情況是隊友 Push 了新東西。現在我們用 GitHub 網頁自己改一次來模擬：

| # | 操作（在 GitHub 網頁上） |
| --- | --- |
| 1 | 打開 my-profile 的 repo 頁面 |
| 2 | 點 **Add a README** |
| 3 | 輸入一行：`# 王小明的自我介紹網頁` |
| 4 | 按 **Commit changes...**，訊息改成 `新增 README`，再按 **Commit changes** |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 這個 commit 是在 GitHub 上做的，所以現在是 <b>GitHub 比你的電腦新</b>。
</div>

<!--
真實的情況，通常是隊友 Push 了新的東西上來。
現在我們一個人上課，就用 GitHub 網頁自己改一次來模擬。
到 repo 頁面，點 Add a README，輸入一行標題。
接著按 Commit changes，GitHub 會跳出一個視窗，預設訊息是 Create README.md，我們把它改成「新增 README」，再按一次 Commit changes。
這個存檔是在 GitHub 上做的，所以現在變成 GitHub 比我們的電腦還新。
-->

---

# Fetch origin → Pull origin

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 回到 Desktop，按 **Fetch origin**（去 GitHub 看看有沒有新東西） |
| 2 | 按鈕變成 **Pull origin ↓1** |
| 3 | 按 **Pull origin**，把新 commit 拿回來 |
| 4 | 資料夾裡多了 `README.md` |

</div>
<div>

<Shot file="b03-04-pull-origin.png" desc="頂部列 Pull origin（↓1）" />

<CliBox :cmds="['git pull']" note="把 GitHub 上的新 commit 拿回本機" />

</div>
</div>

<!--
回到 Desktop，先按 Fetch origin。
Fetch 的意思是去 GitHub 看看有沒有新東西，只是看，不會改動我們的檔案。
看到有新東西之後，按鈕會變成 Pull origin，旁邊有一個向下的箭頭和 1，代表 GitHub 上有一個我們還沒拿到的 commit。
按下 Pull origin，就會把它拿回來，資料夾裡也多了 README.md。
對應的指令是 `git pull`。
-->

---

# 忘了 Pull 就 Push，會怎樣？

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 你會看到 |
| --- | --- |
| 1 | 按 Push，跳出 **Newer commits on remote**：GitHub 上有你沒有的 commit，不讓你推 |
| 2 | 按 **Fetch**，按鈕變成 **Pull origin**，旁邊同時有 **↑1 ↓1** |
| 3 | 先按 **Pull origin** 拿回來，再 **Push** |

</div>
<div>

<Shot file="b03-06-push-rejected.png" desc="Newer commits on remote 對話框" />

<div style="margin-top:0.6rem;">
<Shot file="b03-07-pull-push-both.png" desc="Pull origin ↑1 ↓1" ratio="534 / 48" />
</div>

<CliBox :cmds="['git push', '! [rejected] main -> main (fetch first)']" note="指令版會直接顯示 rejected 錯誤" />

</div>
</div>

<!--
我們來看看，如果忘了 Pull 就直接 Push，Desktop 會怎麼反應。
按下 Push，會跳出 Newer commits on remote 這個視窗。
意思是 GitHub 上有我們電腦裡沒有的 commit，所以不讓我們推上去，避免把別人的東西蓋掉。
按下 Fetch，上方按鈕會變成 Pull origin，旁邊同時有向上和向下的數字，代表兩邊各有一個對方沒有的 commit。
這時候先按 Pull origin 把 GitHub 的新東西拿回來，再 Push 就可以了。
用指令的話，git push 會直接顯示 rejected 的錯誤訊息。
-->

---

# 為什麼要「開工先 Pull」？

<div class="grid grid-cols-2 gap-8 mt-2">
<div>

如果 GitHub 上有新東西，你卻沒 Pull 就繼續改、繼續 commit：

- Push 會被擋下來（上一頁）
- 要先 Pull 把兩邊的 commit 合在一起，才能 Push
- 兩邊改到同一行時，還會發生**衝突**（B5 會教怎麼解）

</div>
<div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">

**✅ 每天的節奏**

1. 開工：**Fetch → Pull**
2. 改檔案、**Commit**（可以很多次）
3. 收工：**Push**

</div>

</div>
</div>

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ Git 不讓你直接蓋掉 GitHub 上別人的 commit，這是在保護大家的工作，不是壞掉了。
</div>

<!--
大家可能會問，如果忘了 Pull，直接改檔案、commit，會怎樣？
這時候 GitHub 和我們的電腦各有一個對方沒有的 commit。
就像上一頁看到的，Desktop 會要求我們先 Pull，不會讓我們直接 Push 把 GitHub 上的東西蓋掉。
這是 Git 在保護大家的工作，不是壞掉了。
如果兩邊剛好改到同一行，還會發生衝突，這個第五章會專門教。
所以最好的習慣是：開工先 Fetch、Pull，中間改檔案、commit，收工 Push。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## Clone：在另一個地方抓一份下來

<!--
最後一個動作：從 GitHub 把整個專案抓一份下來。
-->

---

# 什麼時候用 Clone？

<div class="grid grid-cols-2 gap-8 mt-2">
<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">

**📦 Clone**

- **第一次**拿到專案
- 換了一台電腦、新加入一個團隊專案
- 每個專案只做**一次**

</div>
<div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 12px; padding: 1.2rem;">

**🔄 Pull**

- 電腦裡**已經有**專案了
- 把別人的新 commit 拿回來
- **每天**都會做

</div>
</div>

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>比喻：</b> Clone 是搬進新辦公室（一次），Pull 是每天早上看公告欄（每天）。
</div>

<!--
Clone 和 Pull 很容易搞混，我們用使用時機來分。
Clone 是第一次拿到專案的時候用，例如換了一台電腦，或是新加入一個團隊專案，每個專案只做一次。
Pull 是電腦裡已經有這個專案了，把別人的新 commit 拿回來，每天都會做。
可以想成搬進新辦公室，和每天早上看公告欄。
搬家只搬一次，公告每天都要看。
-->

---

# File → Clone repository

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 選單 File → **Clone repository** |
| 2 | **GitHub.com** 分頁，選 `my-profile` |
| 3 | **Local path** 換一個資料夾（假裝是另一台電腦） |
| 4 | 按 **Clone** |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ Local path 不要選原本的 my-profile 資料夾，也不要放在另一個專案資料夾裡面。
</div>

</div>
<div>

<Shot file="b03-05-clone-dialog.png" desc="File → Clone repository" />

<CliBox :cmds="['git clone https://github.com/你的帳號/my-profile.git']" />

</div>
</div>

<!--
我們練習 clone 一次。
從選單 File 選 Clone repository，GitHub.com 分頁會列出我們帳號裡的 repo，選 my-profile。
Local path 要換一個資料夾，假裝這是另一台電腦，例如在桌面建一個 clone-test 資料夾。
要注意，不要選原本 my-profile 所在的位置，也不要放在別的專案資料夾裡面。
按 Clone，Desktop 就會把整個專案，包含所有存檔，完整地抓下來。
對應的指令是 `git clone`。
【講師】練習完可以請學員在 Desktop 左上角的 Current repository 切回原本的 my-profile。
-->

---

# 檢查點 B3 ✅

<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align:left;">
<div>

在**原本的** my-profile 打開 **History**，跟右邊比對：

1. ☐ 一共 **6 個 commit**，最上面是 `新增 README`
2. ☐ 上方按鈕是 **Fetch origin**，沒有 ↑ 或 ↓ 數字
3. ☐ GitHub 網頁上看得到 `README.md` 和聯絡方式

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 clone 下來的那一份，History 應該跟這裡一模一樣。
</div>

</div>
<div>

<HistoryCheck :commits="[
  { text: '新增 README', note: '在 GitHub 網頁做的', highlight: true },
  { text: '新增聯絡方式', highlight: true },
  '忽略個人筆記 notes.txt',
  '新增興趣清單',
  '新增自我介紹頁面',
  { text: 'Initial commit', note: 'Desktop 自動建立' },
]" />

</div>
</div>

<!--
我們來做這一章的檢查點。
在原本的 my-profile 打開 History，應該一共有六個 commit。
橘色標示的兩個是這一章新做的：新增聯絡方式是在本機做的，新增 README 是在 GitHub 網頁上做的。
上方按鈕要是 Fetch origin，沒有向上或向下的數字，代表本機和 GitHub 完全同步。
最後到 GitHub 網頁上確認，看得到 README 和聯絡方式。
-->

---
layout: default
---

# 本章重點回顧

<div class="grid grid-cols-2 gap-8">
<div>

- **本機和遠端**（origin）各有一份，不會自動同步
- **Publish**：第一次放上 GitHub
- **Push ↑**：把本機的新 commit 送上去
- **Fetch → Pull ↓**：把 GitHub 的新 commit 拿回來
- **Clone**：第一次把專案抓下來，每個專案只做一次
- 每天的節奏：**開工 Pull，收工 Push**

<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** B4 開分支 — New branch / Merge

<Link to="ch04" style="color: #d97706; font-weight: 600;">前往 B4 →</Link>

</div>

</div>
<div>

| 本章 CLI 對照 | 意思 |
| --- | --- |
| `git remote add` | 設定遠端 |
| `git push -u` | 第一次推送 |
| `git push` | 送上去 |
| `git pull` | 拿回來 |
| `git clone` | 抓一份下來 |

</div>
</div>

<!--
我們回顧這一章的重點。
本機和 GitHub 各有一份，不會自動同步。
第一次放上去用 Publish，之後本機有新的 commit 就 Push，GitHub 有新的就 Fetch 再 Pull。
Clone 是第一次把專案抓下來，每個專案只做一次。
最重要的是每天的節奏：開工 Pull，收工 Push。
到這裡，我們已經會一個人用 Git 和 GitHub 了。
下一章開始學分支，讓我們可以放心地嘗試新功能，不怕改壞主線。
-->
