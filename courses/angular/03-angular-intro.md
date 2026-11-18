---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Angular 介紹
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
  .index-table td {
    text-align: center;
    font-family: monospace;
  }
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Angular Essentials
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Angular 介紹
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「一個整合了路由、表單、通訊的全功能前端開發平台」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
前面我們認識了前端，也聊了寫程式的好習慣。這一章，要正式認識這門課的主角：Angular。

像 Gmail 這種功能多、需要很多人一起維護的系統，需要穩固的基礎，Angular 就是 Google 為這類專案設計的開發平台。

學完這一章，我們會知道 Angular 是什麼、為什麼選它，以及需要準備哪些工具。
-->

---
layout: default
---

# Outline

- **1. Angular 是什麼** — 平台定義與三大組成
- **2. 為什麼選 Angular** — 三大框架比較、優缺點分析
- **3. 前置學習需求** — HTML/CSS/JS 基礎、Node.js、npm

<!--
這一章分成三個部分。首先說明 Angular 是什麼，以及它由哪些部分組成。接著把它跟 Vue、React 比較，看看它的優點和缺點。最後介紹學 Angular 之前需要的基礎知識，以及兩個一定會用到的工具：Node.js 和 npm。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 1. Angular 是什麼？
# What is Angular?

<!--
我們先從第一個問題開始：Angular 到底是什麼？
-->

---

# Angular 是什麼？

Angular 是一個**基於 TypeScript 的開發平台**，不只是框架，而是一套完整的工具生態系。

| 組成要素 | 說明 |
| --- | --- |
| 元件化框架 | 建構可延展的 Web 應用程式 |
| 整合函式庫 | 路由機制、表單管理、Client/Server 通訊等 |
| 開發工具 | 幫助開發、建置、測試、更新程式碼 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>簡單來說：</b> Angular 是一個幫你整合了許多工具的網頁開發平台。
</div>

<!--
Angular 官方稱自己是「開發平台」，而不只是一個框架。差別在哪裡？

如果把寫網頁比喻成做菜，有些框架只給我們一個平底鍋，菜刀、砧板、盤子都要自己另外去買，雖然很自由，但也容易買到彼此不搭的工具。

Angular 則像是一整間配備齊全的廚房。看表格，它除了元件化的框架本身，還內建了路由、表單管理、和伺服器溝通等常用的函式庫，再加上幫我們建立、建置、測試程式的開發工具。

簡單說，Angular 是一個「幫我們整合好許多工具的網頁開發平台」。團隊裡每個人用的都是同一套官方工具，寫法自然比較一致。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 2. 為什麼選 Angular？
# Why Angular?

<!--
前端框架有很多選擇，接下來我們看看，為什麼要選擇學習難度比較高的 Angular。
-->

---

# 三大前端框架比較

目前主流三大前端框架：Vue、React、Angular。

| 框架 | 學習難度 | 靈活性 | 規範程度 |
| --- | --- | --- | --- |
| Vue | ⭐ 最低 | 高 | 寬鬆 |
| React | ⭐⭐ 適中 | 高 | 寬鬆 |
| Angular | ⭐⭐⭐ 最高 | 較低 | 嚴謹 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼選 Angular：</b> 雖然學習難度最高，但其嚴謹規範能有效降低後續維護成本，適合團隊協作。
</div>

<!--
目前主流的前端框架有三個：Vue、React 和 Angular。

看表格，Vue 的學習難度最低，React 適中，Angular 最高。但 Angular 的規範程度也最嚴謹。

這種嚴謹，就像一支紀律很好的隊伍，每個人用一樣的裝備、照一樣的流程做事。雖然少了一些自由，但非常適合大型團隊合作。

想像一個系統要維護十年，中間寫程式的人換了好幾批，如果每個人的寫法都不一樣，程式碼很快就會變得難以維護。這也是為什麼很多銀行、保險公司這類大型企業，特別偏好使用 Angular。
-->

---

# Angular 優點

| 優點 | 說明 |
| --- | --- |
| 適合各規模專案 | 大型 / 小型專案皆可使用 |
| 規範嚴謹 | 統一的寫法，降低後續維護成本 |
| 官方文件齊全 | 文件完整，討論社群活躍 |

<!--
我們來看 Angular 的優點。

第一，它大型、小型專案都能用。第二，規範嚴謹，統一的寫法能降低後續的維護成本。第三，官方文件很完整，討論社群也很活躍，遇到問題容易找到答案。

其中最實際的好處，是寫法統一。不管從哪一間公司的 Angular 專案換到另一間，程式碼的結構都大同小異，不用花很多時間去適應前一位工程師的個人風格。
-->

---

# Angular 缺點

| 缺點 | 說明 |
| --- | --- |
| 學習難度高 | 相較 Vue、React 學習曲線較陡 |
| 彈性較低 | 嚴格規範，開發方式較不靈活 |
| 升級較為困難 | 版本升級複雜（官方持續優化中） |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 缺點中「升級較困難」是相對於其他框架而言，Angular 官方也在持續改善升級體驗。
</div>

<!--
當然，Angular 也有缺點，我們要誠實面對。

第一，學習曲線比較陡，要學的東西比 Vue 和 React 多。第二，規範嚴格，開發方式比較沒有彈性。第三，過去大版本升級比較麻煩，常常需要改不少程式。

不過最後這點，官方這幾年已經改善很多。只要我們照著官方建議的寫法開發，升級已經不像以前那麼痛苦了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 3. 前置學習需求
# Prerequisites

<!--
了解 Angular 的特色之後，我們來看看開始學習前，需要先具備哪些基礎。
-->

---

# 前置知識需求

學習 Angular 前，需先具備以下基礎：

| 知識領域 | 說明 |
| --- | --- |
| HTML | 網頁結構語言，負責畫面骨架 |
| CSS | 網頁樣式語言，負責畫面外觀 |
| JavaScript | 前端程式語言基礎 |
| 終端機 / 命令提示字元 | 基本指令操作能力 |

<!--
學 Angular 之前，需要先有幾個基礎。

HTML 負責畫面的骨架，CSS 負責外觀，JavaScript 則是前端程式語言的基礎。Angular 寫的就是這三種東西的進階版本，如果基礎不穩，後面會很吃力。

另外還有一個比較容易被忽略的，就是終端機，也就是命令提示字元的基本操作。之後建立 Angular 專案、啟動網頁，都要在終端機輸入指令完成。

不用擔心，下一章我們就會先帶大家熟悉終端機。
-->

---

# Node.js

| 項目 | 說明 |
| --- | --- |
| 全名 | Node.js |
| 類型 | 開源的 JavaScript 運行環境 |
| 用途 | 允許開發者在**伺服器端**運行 JavaScript（TypeScript 也適用） |
| 為何需要 | Angular CLI 與開發工具建置在 Node.js 環境上 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> Node.js 讓 JavaScript 不只能在瀏覽器執行，也能在本機環境執行開發工具。
</div>

<!--
接下來介紹第一個必備工具：Node.js。

以前 JavaScript 只能在瀏覽器裡執行，用途被限制在網頁上。Node.js 是一個「開源的 JavaScript 執行環境」，讓 JavaScript 可以離開瀏覽器，直接在我們的電腦或伺服器上執行，例如讀寫檔案、啟動本機伺服器。

這跟我們有什麼關係？因為 Angular 的開發工具，也就是 Angular CLI，就是建立在 Node.js 上面的。負責建立專案、打包程式碼的這些工具，都需要 Node.js 才能執行，所以它是一定要安裝的。
-->

---

# npm（Node Package Manager）

| 項目 | 說明 |
| --- | --- |
| 全名 | Node Package Manager |
| 字面意義 | 管理 Node 套件的工具 |
| 用途 | 提供開發者分享、發布、管理 Node.js 模組的平台與工具 |
| 安裝方式 | 隨 Node.js 一起安裝，無需另外安裝 |

```bash
# 確認安裝版本
node -v
npm -v
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關係：</b> 安裝 Node.js 時會自動附帶 npm，兩者一起安裝。
</div>

<!--
有了 Node.js，我們還需要一個管理套件的工具，就是 npm，全名是 Node Package Manager。

我們可以把 npm 想成工程師專用的 App Store。如果想在網頁上加一個圓餅圖或日曆元件，不用自己從零開始寫，只要用 npm 下載別人寫好的套件，就能直接裝進專案裡。

npm 會跟著 Node.js 一起安裝，不用另外裝。安裝完之後，可以在終端機輸入 `node -v` 和 `npm -v`，如果各自顯示出版本號碼，就代表安裝成功了。
-->

---
layout: end
---

# 課程結束
### 接下來：安裝 Angular 開發環境，開始實作！

<!--
這一章我們認識了 Angular：它是一個整合了許多工具的開發平台，雖然學習曲線比較陡，但規範嚴謹，很適合大型團隊和需要長期維護的專案。

學習之前，我們需要 HTML、CSS、JavaScript 的基礎，也要會一點終端機操作，並且安裝 Node.js 和 npm。

【講師】可以停一下，問問大家有沒有問題。

下一章，我們就來熟悉終端機的操作。我們下一章見。
-->
