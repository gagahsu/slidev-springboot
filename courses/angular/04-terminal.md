---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 終端機 / 命令提示字元
routeAlias: ch04
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Developer Tools
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    終端機 / 命令提示字元
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「前端開發必備工具，用指令控制你的電腦」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章提到，學 Angular 之前要會一點終端機操作。這一章，我們就來認識這個黑色的視窗。

已經能用滑鼠操作，為什麼還要打指令？因為很多開發工具，包括 Angular CLI，都要透過終端機操作，熟練之後也比滑鼠快。

學完這一章，我們就能用幾個指令在資料夾之間切換。
-->

---
layout: default
---

# Outline

- **1. 什麼是終端機** — Mac/Linux 終端機 vs Windows 命令提示字元
- **2. 常用指令對照** — MacOS/Linux 與 Windows 指令比較
- **3. cd 指令詳解** — 目錄切換的各種用法

<!--
這一章分成三個部分。先認識什麼是終端機，以及 Mac 和 Windows 各自用的工具。接著看幾個常用指令在兩種系統上的對照。最後深入介紹最常用的 `cd` 指令，學會在目錄之間切換。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 1. 什麼是終端機？
# Terminal / Command Prompt

<!--
我們先來認識一下，這個黑色視窗到底是什麼。
-->

---

# 什麼是終端機？

開發前端時一定會使用到的工具，用來透過**文字指令**操作電腦。

| 作業系統 | 工具名稱 | 底層系統 |
| --- | --- | --- |
| macOS | 終端機（Terminal） | Linux 系統 |
| Windows | 命令提示字元（cmd） | Windows |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼要學：</b> Angular CLI、npm 指令等開發工具都需要透過終端機執行，是前端開發的必備技能。
</div>

<!--
終端機是「用文字指令來操作電腦」的工具。

平常我們用滑鼠點圖示操作，這叫圖形介面。終端機則像是直接走進廚房，跟廚師說「三號桌一盤炒飯」。雖然沒有漂亮的圖示，但指令精準，速度也快。

看表格，macOS 上的工具叫「終端機」，英文是 Terminal，底層是類似 Linux 的系統；Windows 上的叫「命令提示字元」，也就是 cmd。

之後我們安裝 Angular、建立專案、啟動網頁，都會用到終端機。不用擔心，只要我們不輸入指令，它就只會靜靜等著，不會自己做任何事。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 2. 常用指令對照
# Common Commands

<!--
既然要用指令跟電腦溝通，我們就要知道不同作業系統的指令差在哪裡。
-->

---

# 常用指令對照表

| 說明 | macOS / Linux | Windows |
| --- | --- | --- |
| 切換目錄 | `cd` | `cd` |
| 取得目前所在位置 | `pwd` | `chdir` |
| 列出目前的檔案列表 | `ls` | `dir` |
| 刪除檔案 | `rm` | `del` |

<!--
不同作業系統的指令，有點像不同的方言。

看表格，切換目錄在兩邊都是 `cd`。但查看目前位置，Mac 用 `pwd`，Windows 用 `chdir`；列出檔案，Mac 用 `ls`，Windows 用 `dir`；刪除檔案，Mac 用 `rm`，Windows 用 `del`。

如果在 Windows 的命令提示字元輸入 `ls`，可能會看到「找不到指令」的訊息。這不是電腦壞了，只是用錯了方言。好消息是，最常用的 `cd` 在兩邊都一樣。
-->

---

# 常用指令 — 範例（macOS / Linux）

```bash
# 切換到 projects 目錄
cd projects

# 查看目前位置
pwd

# 列出所有檔案
ls

# 刪除檔案
rm old-file.txt
```

<!--
我們先看 Mac 和 Linux 的操作範例。

`cd projects` 的意思是「進入 projects 這個資料夾」。進去之後，如果不確定自己在哪裡，輸入 `pwd`，終端機就會印出目前所在的完整路徑。想知道這個資料夾裡有什麼，就輸入 `ls`，它會列出所有檔案和資料夾。

最後是 `rm`，用來刪除檔案。這裡要特別提醒：用終端機刪除的檔案，不會進資源回收筒，按下 Enter 就直接刪除了，所以使用 `rm` 之前一定要確認清楚。
-->

---

# 常用指令 — 範例（Windows）

```bash
# 切換到 projects 目錄
cd projects

# 查看目前位置
chdir

# 列出所有檔案
dir

# 刪除檔案
del old-file.txt
```

<!--
接著看 Windows 的版本，動作完全一樣，只是指令名稱不同。

`cd projects` 一樣是進入資料夾；查看目前位置用 `chdir`；列出檔案用 `dir`；刪除檔案用 `del`，同樣不會經過資源回收筒。

在實際工作上，很多用 Windows 的工程師會另外安裝 Git Bash 或 WSL，讓 Windows 也能使用 Mac 和 Linux 的指令。因為大部分的雲端伺服器都是 Linux 系統，先熟悉這些指令，之後會很有幫助。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 3. cd 指令詳解
# Directory Navigation

<!--
接下來，我們深入看最常用，也最容易出錯的指令：`cd`。
-->

---

# cd 指令用法

`cd`（change directory）是最常用的指令，用來切換目錄位置。

| 指令 | 說明 |
| --- | --- |
| `cd ..` | 返回上一層目錄 |
| `cd ~` | 返回家目錄（最上層，macOS/Linux） |
| `cd 路徑` | 移動到指定的路徑 |
| `D:` | 切換到 D 槽（Windows 切換硬碟專用） |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>Windows 注意：</b> 要切換到其他硬碟時，不能用 <code>cd</code>，需直接輸入硬碟名稱，例如：<code>D:</code>
</div>

<!--
`cd` 是 change directory 的縮寫，用來切換目錄，我們可以把它想成一個傳送門。

看表格，`cd` 後面接兩個點，代表回到上一層資料夾，注意 `cd` 和兩個點中間要有空格。`cd` 後面接波浪號，在 Mac 和 Linux 上會直接回到家目錄。`cd` 後面接路徑，就是移動到指定的位置。

Windows 有一個特別要注意的地方：如果要從 C 槽切換到 D 槽，不能用 `cd`，要直接輸入 `D:` 再按 Enter。很多人在這裡卡住，因為輸入 `cd D:` 看起來什麼事都沒發生。
-->

---

# cd 指令 — 範例

```bash
# 返回上一層
cd ..

# 返回家目錄（macOS/Linux）
cd ~

# 移動到指定路徑
cd C:/Users/allen/projects/my-app

# Windows：切換到 D 槽
D:
```

<!--
我們把剛才的用法實際寫出來看看。

前兩個分別是回到上一層，以及回到家目錄。第三個 `cd` 後面接了一長串從磁碟開頭寫起的路徑，這種寫法叫「絕對路徑」，就像完整的地址，不管我們現在在哪裡，都能直接到達目的地。最後一個就是 Windows 切換到 D 槽的寫法。

最後分享一個很實用的技巧：Tab 鍵自動補完。資料夾名稱很長的時候，只要打前幾個字，再按 Tab 鍵，終端機就會自動把名稱補齊。這不只省時間，也能避免打錯字。
-->

---
layout: end
---

# 課程結束
### 熟悉終端機指令，開始使用 Angular CLI！

<!--
這一章我們認識了終端機：它是用文字指令操作電腦的工具。Mac 和 Windows 的指令有些不同，但最常用的 `cd` 是共通的。`cd` 加兩個點回上一層，`cd` 加路徑移動到指定位置，Windows 切換硬碟則直接輸入磁碟名稱。

剛開始打指令可能不太習慣，多練習幾次就會熟悉了。

【講師】可以請大家實際打開終端機，試著用 `cd ..` 一路退到最上層，看看會到哪裡。

下一章，我們就要用終端機來安裝 Angular。我們下一章見。
-->
