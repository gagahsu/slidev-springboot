---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 安裝 VS Code
routeAlias: ch06
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
    Angular Full-Stack Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    安裝 VS Code
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「開發工具就位，前端開發正式啟動」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們裝好了 Angular 的開發環境，這一章要準備寫程式的編輯器：VS Code。

記事本也能寫程式，但它不會上色、不會提示語法，也不會幫忙抓錯。VS Code 是目前最多工程師使用的編輯器。

學完這一章，我們會裝好 VS Code，以及 Angular 專用的套件。
-->

---
layout: default
---

# Outline

- **什麼是 VS Code？**
- **下載與安裝 VS Code**
- **安裝 Angular Extension Pack 套件**

<!--
這一章只有三個步驟。先認識 VS Code 是什麼，接著下載並安裝它，最後安裝 Angular 的延伸套件。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 VS Code？
# Visual Studio Code

<!--
我們先來認識一下，之後每天都會用到的這個編輯器。
-->

---

# 什麼是 VS Code？

VS Code 全名 **Visual Studio Code**，是微軟開發的免費、跨平台程式碼編輯器。

<div class="flex justify-center my-6">
  <img src="/images/07-vscode/vscode-logo.png" alt="VS Code Logo" style="height: 60px; object-fit: contain;" />
</div>

| 特性 | 說明 |
| --- | --- |
| **免費 & 開源** | 完全免費，原始碼公開於 GitHub |
| **跨平台** | 支援 Windows、macOS、Linux |
| **豐富套件** | 擁有大量擴充套件可安裝 |
| **內建工具** | Debug 工具、Git 整合、自動排版、IntelliSense |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼選 VS Code？</b> 輕量、啟動快、套件生態豐富，是目前前端開發的主流編輯器
</div>

<!--
VS Code 的全名是 Visual Studio Code，是微軟推出的「免費、跨平台的程式碼編輯器」。

如果說記事本是一把普通的美工刀，VS Code 就像一把多功能的瑞士刀。看表格，它完全免費、原始碼公開，Windows、Mac、Linux 都能用，還內建了除錯工具、Git 版本控制、自動排版，以及會自動提示程式碼的 IntelliSense。

它最大的優勢是延伸套件非常豐富。VS Code 本身很輕巧，需要什麼功能，就去安裝對應的套件。

在業界，VS Code 是前端開發最主流的編輯器，現在熟悉它，之後到公司上班也能直接上手。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 下載與安裝
# Download & Install

<!--
了解 VS Code 之後，我們就直接去官網下載安裝。
-->

---

# Step 1 — 前往官網下載

開啟瀏覽器，前往 VS Code 官方網站：

<div class="flex justify-center my-2">
  <div class="px-6 py-3 bg-teal-50 border-2 border-teal-400 rounded-lg text-teal-800 font-mono text-lg">
    https://code.visualstudio.com/
  </div>
</div>

<div class="flex justify-center mt-4">
  <img src="/images/07-vscode/vscode-download-page.png" alt="VS Code 下載頁面截圖" style="max-height: 240px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 網頁會<b>自動偵測你的作業系統</b>並顯示對應版本；若未自動偵測，請手動選擇 Windows / macOS / Linux
</div>

<!--
打開瀏覽器，前往畫面上的 VS Code 官方網站。

官網會自動偵測我們的作業系統，在畫面中間顯示對應的下載按鈕，直接點擊下載就可以了。如果沒有自動偵測到，也可以手動選擇 Windows、macOS 或 Linux。

這裡要注意一個小地方：官網上還有一個綠色圖示的 VS Code Insiders，那是搶先體驗的測試版，可能會有比較多問題。我們下載藍色圖示的穩定版就好。
-->

---

# Step 2 — 安裝完成後開啟

下載安裝檔後依指示完成安裝，開啟 VS Code 會看到歡迎頁面。

<div class="flex justify-center mt-4">
  <img src="/images/07-vscode/vscode-welcome-screen.png" alt="VS Code 安裝後歡迎畫面截圖" style="max-height: 320px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 第一次開啟會看到歡迎頁面，左側 Activity Bar 有檔案、搜尋、Git、Debug、套件等五大功能區
</div>

<!--
下載後執行安裝檔，照著指示一路按下一步。安裝完成打開 VS Code，就會看到這個歡迎頁面。

我們看一下最左邊這一排垂直的圖示，叫做活動列。最上面像兩張紙疊在一起的是檔案總管，之後專案裡的檔案都會在這裡列出來。往下依序是搜尋、Git、除錯，最後那個像方塊的圖示是延伸模組，也就是安裝套件的地方。

如果覺得英文介面不習慣，可以在延伸模組裡搜尋 Chinese，安裝繁體中文語言套件，介面就會變成中文。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 安裝 Angular 套件
# Install Angular Extension Pack

<!--
VS Code 安裝好之後，我們來幫它加上 Angular 專用的套件。
-->

---

# Step 3 — 開啟延伸模組面板

要安裝套件，請點擊左側 Activity Bar 中**長得像方塊的圖示**（延伸模組）。

<div class="flex justify-center mt-6">
  <img src="/images/07-vscode/vscode-extension-icon.png" alt="VS Code 延伸模組 icon 截圖" style="max-height: 200px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>快速鍵：</b> Windows <code>Ctrl + Shift + X</code>、macOS <code>⇧⌘X</code> 可直接開啟延伸模組面板
</div>

<!--
要安裝套件，先點擊左側活動列裡，那個像方塊的延伸模組圖示。

延伸模組面板就像 VS Code 的應用程式商店，需要什麼功能，就在這裡搜尋安裝。

也可以用快速鍵開啟：Windows 按 Ctrl 加 Shift 加 X，Mac 按 Command 加 Shift 加 X。熟悉這些快速鍵之後，手不用離開鍵盤就能完成操作，效率會高很多。
-->

---

# Step 4 — 搜尋 Angular 套件

在搜尋欄輸入 **`Angular`**，在結果清單中找到製作者為 **Will 保哥** 的套件。

<div class="flex justify-center mt-4">
  <img src="/images/07-vscode/vscode-search-angular-extension.png" alt="延伸模組搜尋 Angular，Angular Extension Pack by Will 保哥" style="max-height: 300px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 請選擇「<b>Angular Extension Pack</b>」，製作者為 <b>Will 保哥</b>，不要裝錯成其他同名套件
</div>

<!--
在搜尋欄輸入 Angular，會出現很多相關的套件。

我們要找的是名稱為 Angular Extension Pack、製作者是 Will 保哥的套件。這是一個整合包，裡面已經包含了寫 Angular 常用的十幾個套件，像是自動完成、語法上色、程式碼片段等等。只要安裝這一個，就能一次裝好整套工具，不用自己一個一個找。

注意要認明製作者是 Will 保哥，不要裝成其他名稱相似的套件。
-->

---

# Step 5 — 點擊安裝

點擊 **Angular Extension Pack** 後，右側會出現套件詳細頁面，點擊「**安裝**」按鈕。

<div class="flex justify-center mt-4">
  <img src="/images/07-vscode/vscode-install-extension-button.png" alt="Angular Extension Pack 詳細頁面，點擊安裝按鈕" style="max-height: 280px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 安裝完成後按鈕會變成「<b>停用 / 解除安裝</b>」，代表已成功安裝
</div>

<!--
點擊 Angular Extension Pack，右邊會出現套件的詳細頁面，按下「安裝」按鈕。

因為它是整合包，會一起安裝好幾個套件，需要等一下。當按鈕變成「停用」或「解除安裝」，就代表安裝成功了。

裝好之後，我們寫 Angular 程式時，VS Code 會自動提示可用的語法，有些程式碼只要打幾個字就能自動產生整段結構，不但寫得快，也比較不容易打錯。
-->

---

# 安裝完成！

完成以下兩個步驟後，VS Code 就設定好了：

| 步驟 | 操作 | 狀態確認 |
| --- | --- | --- |
| ① 安裝 VS Code | 從官網下載並安裝 | 可正常開啟 VS Code |
| ② 安裝套件 | 搜尋並安裝 Angular Extension Pack | 套件按鈕顯示「停用/解除安裝」 |

<div class="mt-6 p-4 bg-green-50 border-l-4 border-green-500 text-gray-700 text-sm text-left">
✅ <b>恭喜！</b> 開發環境已就緒，接下來可以開始撰寫 Angular 專案了！
</div>

<!--
最後我們確認一下兩個步驟都完成了。

第一，VS Code 已經安裝好，可以正常開啟。第二，Angular Extension Pack 已經安裝，按鈕顯示為「停用」或「解除安裝」。

兩個都打勾，開發環境就準備就緒了。可以隨便打開一個 `.html` 檔案看看，如果程式碼變成有顏色、層次分明的樣子，就代表編輯器已經能正確辨識語法了。
-->

---
layout: end
---

# 安裝完成
### 工具就位，開始你的 Angular 開發之旅！

<!--
這一章我們安裝了 VS Code，認識了左側的活動列，並且透過延伸模組安裝了 Angular Extension Pack。這套工具之後會陪我們度過整門課。

【講師】可以讓大家下課時逛逛延伸模組商店，有興趣的套件可以再提出來討論。

下一章，我們會用 VS Code 打開剛才建立的 Angular 專案。我們下一章見。
-->
