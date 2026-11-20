---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: B2 本機存檔
routeAlias: ch02
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
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 初學者課程 · B2</p>
  <h1 style="color: #92400e; font-size: 3.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">本機存檔</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">
    「打勾、寫一句話、按 Commit」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第二章，本機存檔。
上一章把工具都準備好了，這一章我們正式開始做自我介紹網頁，並且做出第一批存檔點。
這一章所有的操作都在自己的電腦上，不需要網路。
-->

---
layout: default
---

# 回顧 B1，這一章我們會做到

<div class="grid grid-cols-2 gap-8 mt-2">
<div style="background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px; padding: 1rem;">

**回顧**

- commit 就是存檔點
- 三大區域：Changes → 打勾 → History
- Desktop 已登入，編輯器設成 VS Code

</div>
<div>

**這一章**

- **Part 1** 建立 repository
- **Part 2** 做出第一個 commit
- **Part 3** 看 History、再存一次檔
- **Part 4** 不想被記錄的檔案：`.gitignore`

</div>
</div>

<!--
先回顧上一章。
commit 是存檔點；三大區域在 Desktop 裡，就是 Changes、打勾、History。
工具也都設定好了。
這一章分四個部分：先建立專案，再做出第一個 commit，接著看存檔列表、多存幾次檔，最後學怎麼讓 Git 忽略不想被記錄的檔案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 建立 Repository

<!--
第一步，建立一個讓 Git 管理的專案。
-->

---

# 什麼是 Repository？

**Repository（儲存庫，常簡稱 repo）**＝一個被 Git 管理的專案資料夾。

<br>

| 你看得到的 | 你看不到的 |
| --- | --- |
| `index.html` 等專案檔案 | 隱藏資料夾 `.git` |
| 這是**工作目錄** | 所有存檔點都放在這裡 |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>千萬不要刪 <code>.git</code> 資料夾：</b> 專案裡其他檔案刪了都救得回來，但 <code>.git</code> 一刪，所有存檔點就全部消失。
</div>

<!--
Repository 中文叫儲存庫，大家常簡稱 repo，意思就是一個被 Git 管理的專案資料夾。
我們看得到的，是專案裡的檔案，也就是工作目錄。
看不到的，是一個叫 `.git` 的隱藏資料夾，所有的存檔點都放在這裡。
所以有一件事要特別記住：專案裡其他檔案刪了，Git 都能幫我們救回來。
但是 `.git` 資料夾一旦刪掉，所有存檔點就全部消失，沒有任何辦法復原。
-->

---

# 建立新專案：File → New repository

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| 欄位 | 填什麼 |
| --- | --- |
| **Name** | `my-profile` |
| **Local path** | 維持預設 |
| **Initialize with a README** | 不勾 |
| **Git ignore / License** | 維持 None |

最後按 **Create repository**。

</div>
<div>

<Shot file="b02-01-new-repo-dialog.png" desc="File → New repository 對話框" />

<CliBox :cmds="['git init']" note="把目前的資料夾變成 repository" />

</div>
</div>

<!--
從選單列的 File 選 New repository，會跳出這個對話框。
Name 填 my-profile，這就是專案的名字，也會變成資料夾名稱。
Local path 是專案要放在電腦的哪裡，維持預設就好，Windows 通常是文件底下的 GitHub 資料夾。
下面的 README、Git ignore、License 這次都不用選，Git ignore 我們等一下會自己做。
按下 Create repository，Desktop 就會建立資料夾，並且在裡面放好 `.git`。
這個動作對應的指令是 `git init`。
-->

---

# 建立之後：History 已經有一筆存檔

<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align:left;">
<div>

- Desktop 會自動幫你做第一個 commit：**Initial commit**
- 裡面只有一個設定檔 `.gitattributes`，不用理它
- **Changes** 分頁顯示 *No local changes*，代表目前沒有新的修改

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>打開專案：</b> 點畫面中間的 <b>Open in Visual Studio Code</b>，或選單 Repository → Open in Visual Studio Code。
</div>

</div>
<div>

<HistoryCheck :commits="[{ text: 'Initial commit', note: 'Desktop 自動建立' }]" />

</div>
</div>

<!--
專案建好之後，切到 History 分頁看一下。
會發現已經有一筆 Initial commit，這是 Desktop 自動幫我們做的第一個存檔點。
裡面只有一個叫 `.gitattributes` 的設定檔，它是處理換行格式用的，我們不用理它。
回到 Changes 分頁，會看到 No local changes，代表目前沒有新的修改。
接下來要開始寫網頁，畫面中間有一個 Open in Visual Studio Code 的按鈕，點下去就會用 VS Code 打開這個專案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 做出第一個 Commit

<!--
專案建好了，我們來做第一個真正的存檔點。
-->

---

# 在 VS Code 新增 `index.html`

在 VS Code 左側檔案總管按「新增檔案」，命名為 `index.html`，貼上以下內容並存檔（Ctrl + S）：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <title>我的自我介紹</title>
</head>
<body>
  <h1>嗨，我是王小明</h1>
  <p>我正在學習 Git。</p>
</body>
</html>
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>把「王小明」換成你自己的名字。</b> 第 8 行的標題，第五章解衝突時還會用到。
</div>

<!--
在 VS Code 左邊的檔案總管，按新增檔案，命名為 index.html。
把這段內容貼上去，記得按 Ctrl 加 S 存檔。
第 8 行的「王小明」請換成自己的名字。
這一行大家先記住，第五章練習解衝突的時候，我們會故意在兩個地方都改到它。
存好檔之後，切回 GitHub Desktop。
-->

---

# Changes 分頁：Git 發現你改了東西

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

- 左側清單出現 `index.html`，後面有**綠色 ＋**，代表新檔案
- 點檔名，右側顯示內容的差異（綠色＝新增的行）

| 標記 | 意義 |
| --- | --- |
| 🟩 綠色 ＋ | 新增的檔案 |
| 🟨 黃色 • | 修改過的檔案 |
| 🟥 紅色 − | 刪除的檔案 |

</div>
<div>

<Shot file="b02-02-changes-tab.png" desc="Changes 分頁有未提交檔案" />

<CliBox :cmds="['git status']" note="查看哪些檔案被改過" />

</div>
</div>

<!--
回到 Desktop，Changes 分頁出現了 index.html，後面有一個綠色的加號，代表這是新的檔案。
點一下檔名，右邊會顯示這個檔案的差異，綠色的行代表新增的內容。
之後改檔案，會看到黃色的點，代表修改；刪掉檔案，會看到紅色的減號。
這個畫面就是三大區域裡的工作目錄，對應的指令是 `git status`。
-->

---

# 為什麼要先「打勾」再 Commit？

<div class="grid grid-cols-2 gap-8 mt-2">
<div>

打勾＝把檔案**放進紙箱**（暫存區），只有打勾的檔案會被存進這次的 commit。

**為什麼要多這一步？**

- 一次改了 5 個檔案，但只有 3 個是同一件事
- 先勾 3 個 commit 一次，再勾剩下的 commit 一次
- 每個存檔點都**只做一件事**，之後回頭找才清楚

</div>
<div>

<div style="background: #fff8f0; border: 2px solid #d97706; border-radius: 12px; padding: 1.2rem;">

**📦 檔案前面的核取方塊**

- ☑ 打勾：這次要存
- ☐ 不勾：這次先不存，修改還留著
- 清單最上面的勾：全選 / 全不選

</div>

<CliBox :cmds="['git add index.html']" note="把檔案放進暫存區" />

</div>
</div>

<!--
在 commit 之前，每個檔案前面都有一個核取方塊。
打勾，就是把這個檔案放進紙箱，也就是暫存區，只有打勾的檔案會被存進這次的 commit。
大家可能會問，為什麼要多這一步，不能全部直接存嗎？
想像我們同時改了五個檔案，其中三個是修正錯字，另外兩個是新增功能。
有了打勾這一步，就能先勾三個存一次，再勾兩個存一次。
每個存檔點只做一件事，之後回頭找的時候會清楚很多。
沒打勾的檔案不會消失，修改還在，只是這次先不存。
-->

---

# 寫一句說明，按下 Commit

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 確認 `index.html` 有打勾 |
| 2 | 左下角 **Summary** 填：`新增自我介紹頁面` |
| 3 | **Description** 可以留白 |
| 4 | 按 **Commit 1 file to main** |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Summary 原本的灰字（例如 <i>Create index.html</i>）只是預設提示，請換成自己的一句話。按鈕會寫 <b>Commit 1 file to main</b>。
</div>

</div>
<div>

<Shot file="b02-03-commit-summary.png" desc="勾選檔案 + 填 Summary + Commit 按鈕" />

<CliBox :cmds="['git commit -m &quot;新增自我介紹頁面&quot;']" />

</div>
</div>

<!--
確認 index.html 有打勾之後，看左下角。
Summary 是必填的，用一句話說明這次做了什麼，我們填「新增自我介紹頁面」。
Description 是補充說明，可以留白。
Summary 欄位原本會有一行灰字，例如 Create index.html，那只是 Desktop 給的預設提示，請換成自己寫的中文說明。
最後按下 Commit 1 file to main，main 是目前所在的分支名稱，分支第四章才會教，現在先知道它是預設的那一條就好。
按下去之後，Changes 分頁就清空了，因為修改都已經存進存檔點裡。
這個動作對應的指令是 `git commit`。
-->

---

# Summary 怎麼寫？三個原則

| 原則 | ❌ 不好的寫法 | ✅ 好的寫法 |
| --- | --- | --- |
| **一句話說清楚做了什麼** | `更新`、`改東西` | `新增興趣清單` |
| **用動詞開頭**（新增 / 修改 / 修正 / 刪除） | `興趣清單的部分` | `修正標題錯字` |
| **一個 commit 只做一件事** | `新增興趣清單和修正錯字和換顏色` | 拆成三個 commit |

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>判斷標準：</b> 三個月後只看這一句，還知道這次改了什麼嗎？
</div>

<!--
Summary 怎麼寫，我們記三個原則就好。
第一，一句話說清楚做了什麼。寫「更新」、「改東西」，過一個禮拜連自己都看不懂。
第二，用動詞開頭，例如新增、修改、修正、刪除，一看就知道是哪一種改動。
第三，一個 commit 只做一件事。如果 Summary 裡出現好幾個「和」，通常代表應該拆開。
判斷的標準很簡單：三個月後只看這一句，還知道這次改了什麼嗎？
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## 看 History、再存一次檔

<!--
存好第一個檔，我們去存檔列表看看。
-->

---

# History 分頁：你的存檔列表

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

- 切到左上方的 **History** 分頁
- **最新的 commit 在最上面**
- 點任一個 commit，右側顯示當時改了哪些檔案、哪幾行
- 每個 commit 都記下：說明、作者、時間

</div>
<div>

<Shot file="b02-04-history-tab.png" desc="History 分頁顯示多個 commit" />

<CliBox :cmds="['git log --oneline']" note="一行一個 commit 列出歷史" />

</div>
</div>

<!--
切到 History 分頁，這就是我們的存檔列表。
要注意，最新的 commit 在最上面，越往下越舊。
點任何一個 commit，右邊會顯示當時改了哪些檔案、哪幾行。
每個存檔點都記下了我們寫的說明、作者，還有時間。
上一章設定的名字和 Email，就是用在這裡。
對應的指令是 `git log`，加上 `--oneline` 就會一行顯示一個 commit。
-->

---

# 動手做：再存一次檔

在 `index.html` 的 `<p>` 下面加入興趣清單，存檔：

```html {3-7}
  <h1>嗨，我是王小明</h1>
  <p>我正在學習 Git。</p>
  <h2>我的興趣</h2>
  <ul>
    <li>打籃球</li>
    <li>看電影</li>
  </ul>
```

回到 Desktop：Changes 出現 `index.html`（🟨 修改）→ 確認打勾 → Summary 填 **`新增興趣清單`** → Commit

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>觀察：</b> commit 過的檔案再修改，會重新出現在 Changes。每改一次，就要再存一次檔。
</div>

<!--
我們再存一次檔。
在 index.html 的段落下面，加上一個「我的興趣」清單，興趣可以換成自己的，存檔。
回到 Desktop，index.html 又出現在 Changes 了，這次是黃色的點，代表修改。
右邊的差異畫面，只會顯示新增的那幾行。
確認打勾，Summary 填「新增興趣清單」，按 Commit。
這裡要注意一個觀念：commit 過的檔案，不是之後就自動存檔了。
每改一次，它都會重新出現在 Changes，要再打勾、再 commit 一次。
【講師】給大家三分鐘完成，確認 History 有兩筆自己做的 commit。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## 不想被記錄的檔案：`.gitignore`

<!--
最後一個主題：有些檔案，我們根本不想讓 Git 記錄。
-->

---

# 有些檔案不該被存進去

| 類型 | 例子 | 為什麼不要 |
| --- | --- | --- |
| 密碼、金鑰 | `.env`、`secret.txt` | 推上 GitHub 就外洩了 |
| 個人筆記、暫存檔 | `notes.txt`、`*.tmp` | 只有自己需要 |
| 系統產生的檔案 | `.DS_Store`、`Thumbs.db` | 跟專案無關 |
| 套件資料夾 | `node_modules/` | 太大，而且可以重新下載 |

<br>

把這些檔名寫進 **`.gitignore`** 這個檔案，Git 就會**當作沒看到**，它們不會再出現在 Changes。

<!--
開發的時候，有幾類檔案不應該被存進去。
最危險的是密碼和金鑰，一旦推上 GitHub，就算之後刪掉，別人還是能從歷史紀錄裡找回來。
個人筆記、暫存檔只有自己需要；電腦系統自動產生的檔案跟專案無關；套件資料夾又大又能重新下載。
解法是一個叫 `.gitignore` 的檔案。
把檔名寫進去，Git 就會當作沒看到，它們不會再出現在 Changes 裡面。
-->

---

# 動手做：忽略個人筆記

<div style="display:grid; grid-template-columns: 2fr 3fr; gap: 1.5rem; text-align:left;">
<div>

| # | 操作 |
| --- | --- |
| 1 | 在 VS Code 新增 `notes.txt`，隨便打幾個字存檔 |
| 2 | Desktop 的 Changes 出現 `notes.txt` |
| 3 | 在 `notes.txt` 上**按右鍵** → **Ignore file (add to .gitignore)** |
| 4 | `notes.txt` 消失，改出現 `.gitignore` |
| 5 | Summary 填 **`忽略個人筆記 notes.txt`** → Commit |

</div>
<div>

<Shot file="b02-05-ignore-menu.png" desc="檔案右鍵 → Ignore file" />

<CliBox :cmds="['# .gitignore 的內容', 'notes.txt']" note=".gitignore 本身要 commit，大家才會共用同一份規則" />

</div>
</div>

<!--
我們實際做一次。
在 VS Code 新增一個 notes.txt，隨便打幾個字，存檔。
回到 Desktop，它出現在 Changes 裡。
在 notes.txt 上按右鍵，選 Ignore file，add to .gitignore。
notes.txt 就從清單消失了，取而代之的是一個新檔案 `.gitignore`，點開看，裡面只有一行 notes.txt。
右邊上方可能會出現一條黃色的 LF 換行提示，那是 Desktop 在說明換行格式，不用理會。
最後要記得把 `.gitignore` 本身 commit 進去，這樣之後放上 GitHub，大家才會共用同一份忽略規則。
notes.txt 檔案本身還在我們的電腦裡，只是 Git 不再管它。
-->

---

# 檢查點 B2 ✅

<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align:left;">
<div>

打開 Desktop 的 **History** 分頁，跟右邊比對：

1. ☐ 一共 **4 個 commit**，順序一樣
2. ☐ Changes 分頁顯示 **No local changes**
3. ☐ 在檔案總管打開 `my-profile` 資料夾，`notes.txt` 還在

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>多了或少了 commit？</b> 不用緊張，只要內容有存進去就好。附錄會教怎麼收回最後一個 commit。
</div>

</div>
<div>

<HistoryCheck :commits="[
  { text: '忽略個人筆記 notes.txt', highlight: true },
  { text: '新增興趣清單', highlight: true },
  { text: '新增自我介紹頁面', highlight: true },
  { text: 'Initial commit', note: 'Desktop 自動建立' },
]" />

</div>
</div>

<!--
我們來做這一章的檢查點。
打開 History 分頁，跟右邊的圖比對。
應該一共有四個 commit，最下面是 Desktop 自動建立的 Initial commit，上面三個是我們自己做的。
Changes 分頁要顯示 No local changes，代表所有修改都存好了。
再去檔案總管看一下，notes.txt 應該還在，只是 Git 不管它。
如果多了或少了 commit，不用緊張，只要內容都有存進去就好。
-->

---

# 專題練習：建立轉角咖啡的兩個 repository

基礎學程最後要做「轉角咖啡」網站：前端、後端各放一個 repository。現在先把家準備好：

<div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align:left;">
<div>

1. **File → New repository**，Name 填 `cafe-web`，勾 **Initialize this repository with a README**
2. 用 VS Code 打開 `README.md`，改成：
   ```markdown
   # cafe-web
   轉角咖啡一頁式網站的前端（Angular）
   ```
3. Commit，Summary 寫 `加上專案說明`
4. 同樣做一個 `cafe-api`，說明寫「轉角咖啡的後端（Spring Boot）」

</div>
<div>

<HistoryCheck :commits="[
  { text: '加上專案說明', highlight: true },
  { text: 'Initial commit', note: '勾了 README 自動建立' },
]" />

<CliBox :cmds="['git init cafe-web', 'git add README.md', 'git commit -m &quot;加上專案說明&quot;']" note="同樣的事用指令做" />

</div>
</div>

<!--
最後來做專題的第一步。整個基礎學程的期末專題，是轉角咖啡的一頁式網站，前端用 Angular、後端用 Spring Boot，兩邊各放一個 repository。

（下一步）步驟跟這一章做 my-profile 一樣，只是這次在對話框裡勾選 Initialize this repository with a README，Desktop 會順便建一個 README.md。README 是專案的說明書，放上 GitHub 之後，打開專案首頁第一眼看到的就是它。

把 README 改成兩行，第一行是專案名稱，第二行一句話說明這是什麼。存檔、回到 Desktop、打勾、寫 Summary、Commit。

cafe-api 照樣再做一次。現在兩個 repository 裡都只有說明，等學到 HTML 和 Spring Boot，專題的程式碼就會放進來。

【講師】給大家 8 分鐘，完成的同學 History 應該跟右邊一樣有兩個 commit。
-->

---
layout: default
---

# 本章重點回顧

<div class="grid grid-cols-2 gap-8">
<div>

- **Repository** 是被 Git 管理的資料夾，存檔都在 `.git` 裡
- **Changes**：改過的檔案會出現在這裡
- **打勾 → Summary → Commit**，就是做一個存檔點
- **History**：存檔列表，最新的在最上面
- **右鍵 → Ignore file**：讓 Git 當作沒看到

<div style="margin-top: 1.2rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**下一章：** B3 放上 GitHub — Publish / Push / Pull / Clone

<Link to="ch03" style="color: #d97706; font-weight: 600;">前往 B3 →</Link>

</div>

</div>
<div>

| 本章 CLI 對照 | 意思 |
| --- | --- |
| `git init` | 建立 repository |
| `git status` | 看哪些檔案改過 |
| `git add` | 放進暫存區（打勾） |
| `git commit -m` | 存檔 |
| `git log --oneline` | 看存檔列表 |
| `.gitignore` | 忽略清單 |

</div>
</div>

<!--
我們回顧這一章的重點。
Repository 就是被 Git 管理的資料夾，所有存檔都在 `.git` 裡。
改過的檔案會出現在 Changes，打勾、寫 Summary、按 Commit，就是做一個存檔點。
History 是存檔列表，最新的在最上面。
不想被記錄的檔案，按右鍵選 Ignore file。
右邊是這一章的指令對照，大家認得就好。
目前所有存檔都只在自己的電腦上，電腦壞了就沒了。
下一章，我們要把它放上 GitHub。
-->
