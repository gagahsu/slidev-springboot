---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 前端介紹
routeAlias: ch01
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
    Frontend Development Fundamentals
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    前端介紹
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「大眾媒介 - 網頁」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到前端開發的第一堂課。

我們每天滑手機、逛網頁，看到的都是整齊好用的畫面，這些畫面是怎麼做出來的？今天先不寫程式，而是先看懂網頁的全貌。

學完這一章，我們會知道網頁由哪些角色組成，以及 HTML、CSS 和 TypeScript 各自負責什麼。
-->

---
layout: default
---

# Outline

- **大眾媒介 - 網頁：前後端與資料庫的關係**
- **何謂前端？**
- **前端三大技術：HTML、CSS/SCSS、TypeScript**
- **各技術介紹**
- **學習路線建議**

<!--
這一章的路線很單純。我們先看網頁在整個系統裡的位置，也就是前端、後端和資料庫的關係。接著定義什麼是前端，再認識前端的三大技術，分別看看它們長什麼樣子。最後，我們會整理一條學習路線，讓大家知道接下來該從哪裡開始。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 大眾媒介
# 網頁的世界

<!--
在動手寫程式之前，我們先把視野拉高，看看網頁在整個網路世界裡扮演什麼角色。
-->

---

# 大眾媒介 - 網頁 (Web)

網頁能在各種不同裝置上顯示介面，其背後是由三大核心組成的資料流程。

<div class="grid grid-cols-3 gap-4 mt-8 text-sm">
  <div class="p-3 bg-blue-50 rounded shadow-sm">
    <b>前端 Frontend</b><br>
    • 服務回傳的資料呈現<br>
    • 最直接的顯示介面<br>
    • 使用者操作的裝置
  </div>
  <div class="p-3 bg-gray-50 rounded shadow-sm">
    <b>後端 Backend</b><br>
    • 提供網頁服務<br>
    • 接收資料並處理<br>
    • 連接各資料庫
  </div>
  <div class="p-3 bg-green-50 rounded shadow-sm">
    <b>資料庫 Database</b><br>
    • 儲存使用者資訊<br>
    • 增刪查改資料<br>
    • 紀錄資訊
  </div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>資料流：</b> 前端接收資料並傳遞 → 後端處理完資料並回傳 → 前端顯示給使用者
</div>

<!--
網頁背後到底是怎麼運作的？我們用「去餐廳吃飯」來比喻。

走進餐廳，我們看到裝潢、拿到菜單、吃到端上來的牛排。這些看得到、摸得到的部分，就是「前端」。
牛排是廚房裡的廚師煎的，我們看不到他們，但沒有他們就沒有食物，這就是「後端」。
廚房的食材放在冰櫃和儲藏室，對應到存放所有資料的「資料庫」。

回到技術上，資料的流向是這樣的：前端接收使用者的操作，把請求傳給後端；後端處理完，必要時去資料庫存取資料，再把結果回傳；最後由前端顯示給使用者。

很多初學者以為網頁就是畫面本身，其實畫面只是最外面的一層，背後還有一整套系統在支撐。
-->

---

# 前端與後端的互動

- **前端 (Frontend)**：
  - 顯示使用者選用任一服務時所呈現的資料
  - 使用者操作的裝置（Phone / PC / Pad / Watch 等）
- **後端 (Backend)**：
  - 接收前端的服務請求並傳回相對應的資料
  - 與資料庫連接，進行資料的增加、刪除、查詢與修改

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 多種大小的裝置皆不同，但網頁能在各種不同介面提供服務。網頁服務分為前端、後端兩部分。
</div>

<!--
接著我們看前端和後端怎麼分工。

同一個服務，使用者可能用手機打開，也可能用電腦、平板，甚至手錶打開。後端回傳的資料都是同一份，就像同一塊牛排；但前端要負責把這份資料，裝進不同大小的「餐具」裡，讓每種裝置都看得清楚、用得順手。

後端這邊則是接收前端的請求，連接資料庫，做資料的新增、刪除、查詢和修改，再把結果傳回來。

這種讓網頁自動適應不同螢幕大小的做法，在業界叫做「響應式設計」，英文縮寫是 RWD，我們在後面的課程會實際練習。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 何謂前端？
# What is Frontend?

<!--
熱身完了，接下來我們正式來定義，前端到底是在做什麼。
-->

---

# 何謂前端？

前端主要在提供的介面上顯示內容針對使用者。

| 面向 | 說明 |
| --- | --- |
| **多樣載體** | Phone / PC / Pad / Watch 等 |
| **開發語法** | Swift (iOS)、JAVA (Android)、Angular (跨平台) |
| **設計概念** | 每個顯示的頁面都經過 UI / UX 設計與對應功能連結 |
| **核心目標** | 讓使用者在啟用服務時能夠有良好的體驗 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>前端的目的：</b> 不必讓使用者面對死板板的程式碼，而是提供友善的操作介面。
</div>

<!--
前端的本質，可以說是「人和系統之間的橋樑」。

想像一下，我們去 ATM 領錢，如果螢幕上沒有任何按鈕，只有一堆閃爍的程式碼，我們大概不敢把卡插進去。螢幕上的提示文字、語音導覽和大大的按鈕，就是前端。它讓我們不用懂背後複雜的銀行系統，也能輕鬆把錢領出來。

看一下表格，前端可以跑在很多種載體上，開發的語言也不只一種，像 iOS 用 Swift、Android 用 Java，而我們這門課用的 Angular 可以做跨平台的網頁應用。

所以前端不只是把畫面畫出來，還要考慮 UI，也就是長相，以及 UX，也就是使用體驗。目標只有一個：讓使用者用得舒服。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 前端的建築師們
# HTML、CSS/SCSS、TypeScript

<!--
既然我們要自己動手搭這座橋，就需要三種建材，分別是 HTML、CSS 和 TypeScript。
-->

---

# 前端三大技術概覽

| 技術 | 比喻 | 特點 |
| --- | --- | --- |
| **HTML** | 網頁的骨架 | 不算程式語言，屬樣板語言；需硬記語法，邏輯需求不高 |
| **SCSS / CSS** | 網頁的衣服 | 負責排版、顏色；HTML 結構相關知識；輸出全靠死背！ |
| **TS (TypeScript)** | 網頁的動作 | 考驗邏輯能力，比 JavaScript 嚴謹；好的邏輯架構如魚得水 |

<!--
這三個技術，我們用一個人來比喻。

HTML 是「骨架」，決定這個人有頭、有手、有腳，也就是網頁上有哪些內容、怎麼排列結構。
CSS 是「衣服和造型」，負責顏色、字型和排版，讓網頁變得好看。
TypeScript 是「大腦和肌肉」，讓網頁能動起來，回應使用者的點擊和輸入。

表格最右邊那欄也提醒了學習重點：HTML 和 CSS 比較偏記憶，邏輯需求不高；TypeScript 則比較考驗邏輯。

在實際專案裡，這三個缺一不可。早期大家寫的是 JavaScript，現在越來越多團隊改用更嚴謹的 TypeScript，因為它能在寫程式的當下就幫我們抓出很多錯誤。
-->

---

# HTML - 網頁的骨架

負責內容結構，不算程式語言，屬於樣板語言。

- 透過 `<link>` 引入 `style.css`，透過 `<script>` 引入 `main.js`

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <button id="greet-btn">打招呼</button>
  <p id="message"></p>
  <script src="main.js"></script>
</body>
</html>
```

<!--
我們先來看第一個技術，HTML。

這段程式碼就是一個網頁最基本的骨架。注意 `head` 裡面的 `link`，它負責把 `style.css` 這份樣式檔引進來；`body` 最下面的 `script`，則是把 `main.js` 這份程式檔引進來。

`body` 裡面有一個 `button` 標籤，代表畫面上會出現一顆按鈕；`p` 標籤則是預留一個放文字的位置。

如果只有這份 HTML，打開網頁會看到一顆很陽春的按鈕，因為還沒有樣式，點了也不會有反應。

這裡有一個初學者很常犯的錯：大部分標籤是成對出現的，有開頭的 `<p>`，就要有結尾的 `</p>`。忘了寫結尾，畫面就可能跑掉。
-->

---

# CSS / SCSS - 網頁的衣服

負責排版、顏色、字型與響應式設計 (RWD)。

- 針對 HTML 中的 `#greet-btn` 套上顏色、間距與圓角

```css
/* style.css */
#greet-btn {
  background-color: #5eada0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
```

<!--
接著是 CSS，我們來幫剛才那顆陽春的按鈕換上外觀。

最上面的 `#greet-btn` 是選擇器，意思是「找到 id 叫做 greet-btn 的元素」，接下來大括號裡的設定，都只套用在它身上。

這裡我們給它一個綠色的背景、白色的字，把預設的邊框拿掉，加上內距讓按鈕大一點，再用 `border-radius` 把四個角修圓。最後的 `cursor: pointer`，讓滑鼠移上去時變成手指形狀。

套上這段樣式之後，按鈕就從預設的灰色方塊，變成一顆有質感的綠色圓角按鈕。
-->

---

# TypeScript - 網頁的動作

負責互動與邏輯，讓頁面能回應使用者的操作。

- 監聽 `#greet-btn` 的點擊事件，點擊後更新 `#message` 的文字

```javascript
// main.js
const btn = document.getElementById('greet-btn');
const msg = document.getElementById('message');

btn.addEventListener('click', () => {
  msg.textContent = '你好！歡迎來到前端的世界！';
});
```

<!--
最後我們要讓網頁動起來。現在按鈕好看了，但點下去還是沒有反應，這就是 JavaScript 或 TypeScript 要負責的部分。

前兩行用 `document.getElementById`，分別在 HTML 裡找到按鈕和那段文字。

接著對按鈕呼叫 `addEventListener`，意思是「幫按鈕裝一個監聽器」。我們可以把它想成一個在按鈕旁邊待命的保全，只要有人點擊按鈕，保全就會執行大括號裡的事情，把文字的內容換成「你好！歡迎來到前端的世界！」。

執行之後，點一下按鈕，下面就會出現這行歡迎文字。到這裡，骨架、外觀、動作三個部分就全部串起來了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 學習路線建議
# Learning Path

<!--
認識了這三個技術之後，接下來的問題是，要用什麼順序學比較有效率。
-->

---

# 學習路線建議

正確的學習順序能讓你事半功倍：

<div class="flex flex-col items-center gap-4 mt-6">
  <div class="text-xl font-bold text-teal-700">
    HTML ➔ CSS ➔ JavaScript ➔ 框架（Angular / React / Vue）
  </div>
</div>

| 階段 | 技術 | 原因 |
| --- | --- | --- |
| **第一步** | HTML | 所有框架的基礎架構 |
| **第二步** | CSS / SCSS | 讓頁面有樣式 |
| **第三步** | JavaScript / TypeScript | 加入互動與邏輯 |
| **第四步** | 框架（Angular 等） | 基於前三者延伸 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
💡 <b>為什麼要先學 HTML？</b> 因為市面上所有的框架都是基於 HTML 的架構去做延伸，HTML 就是三大框架的基礎。
</div>

<!--
正確的學習順序，能讓我們少走很多冤枉路。

路線是這樣的：先學 HTML，搞懂網頁的結構；再學 CSS，讓頁面有樣式；接著學 JavaScript 和 TypeScript，加入互動和邏輯；最後才進到 Angular 這類框架。

為什麼一定要先學 HTML？因為不管是 Angular、React 還是 Vue，所有框架都是建立在 HTML 的架構上。很多人看到 Angular 很熱門就直接跳進去學，結果裡面一堆 HTML 標籤和 CSS 語法看不懂，反而更挫折。

技術會一直更新，但 HTML、CSS 和 JavaScript 這些基礎，在業界一直都用得到。
-->

---
layout: end
---

# 介紹結束
### 準備好開始你的前端之旅了嗎？

<!--
這一章就到這裡，我們回顧一下。

網頁由前端、後端和資料庫三個部分組成，前端負責把資料呈現給使用者。前端有三大技術：HTML 是骨架，CSS 是外觀，TypeScript 負責動作和邏輯。學習的順序是先打好 HTML 和 CSS 的基礎，再進到程式邏輯，最後才是框架。

【講師】可以停一下，問問大家有沒有問題。

下一章，我們會先聊聊寫程式的好習慣，為接下來動手寫程式做準備。我們下一章見。
-->
