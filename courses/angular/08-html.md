---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 前端語言 HTML
routeAlias: ch08
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
  .browser-preview {
    border: 2px solid #d0d0d0;
    border-radius: 6px;
    padding: 1rem 1.2rem;
    background: #ffffff;
    font-family: serif;
    margin-top: 0.8rem;
  }
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Angular Full-Stack Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    前端語言 HTML
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「HTML & CSS — 樣板兄弟，前端之骨」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們建立了第一個元件，但畫面裡還沒有什麼內容。這一章，我們要學習網頁最基本的語言：HTML。

如果把網頁比喻成一個人，HTML 就是骨架。沒有骨架，CSS 的外觀和 JavaScript 的動作都沒有地方附著。所有網頁開發，都是從 HTML 開始的。

學完這一章，我們就能寫出一個有標題、文字、圖片、表格，甚至有留言表單的網頁。
-->

---
layout: default
---

# Outline

- **HTML 介紹：什麼是 HTML？能做什麼？**
- **HTML 架構：文件結構拆解**
- **標籤（元素）：行內 vs 區塊、屬性**
- **HTML 主要標籤總覽**
- **常用標籤實作：H1-H6、列表、連結、圖片、表單**
- **練習題 1 ～ 5**

<!--
這一章會先介紹 HTML 是什麼、能做什麼，接著拆解一份 HTML 檔案的基本架構。然後認識標籤的概念，以及行內和區塊兩種元素的差別。再來把常用的標籤整理一遍，並實際寫寫看。最後有五個練習題，讓我們動手把手感練起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# HTML 介紹
# 前端之骨

<!--
我們先來認識一下，HTML 到底是什麼。
-->

---

# HTML 是什麼？

HTML（HyperText Markup Language，超文本標記語言）是一種用於建立網頁內容並呈現在瀏覽器上的標準標記語言。

- HTML 文件由一系列**標籤（tags）**組成（例如：按鈕、輸入框、文字、Table…等）
- 瀏覽器讀取 HTML 文件，並將其**渲染成可視網頁**
- 單純 HTML 不吸引人，需搭配 **CSS** 添加風格與布局，再加上 **JavaScript** 添加互動性

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶口訣：</b> HTML 是骨架、CSS 是衣服、JavaScript 是動作
</div>

<!--
HTML 的全名是 HyperText Markup Language，中文是「超文本標記語言」。

嚴格來說，HTML 不是程式語言，因為它沒有邏輯運算，它是一種「標記語言」。想像我們在批改報告，用螢光筆標出大標題、用紅筆圈出重點段落。HTML 做的事情一樣，它用標籤把內容包起來，告訴瀏覽器「這是標題」、「這是按鈕」。

瀏覽器讀懂這些標籤之後，就會把它渲染成我們看到的網頁。

不過單純的 HTML 看起來會很陽春，就像還沒裝潢的毛胚屋，還需要 CSS 加上外觀，以及 JavaScript 加上互動。
-->

---

# HTML 語法能做什麼

1. **結構化內容**：HTML 定義網頁結構，將內容分為標題、段落、圖片等不同區塊
2. **支援多媒體**：可嵌入圖片、音樂、影片等多媒體元素，提升網頁互動性
3. **超連結**：透過 `<a>` 標籤在網頁間建立超連結，實現網頁跳轉
4. **表單提交**：提供 `<form>` 元素讓使用者輸入資料並提交到伺服器
5. **表格展示**：利用 `<table>` 標籤顯示資料表格
6. **支援樣式與設計**：透過 CSS 定義網頁樣式和佈局
7. **與 JavaScript 互動**：結合 JavaScript 實現動態功能和用戶互動
8. **SEO 支援**：`<title>` 和 `<meta>` 標籤有助搜尋引擎優化，提升網站可見度
9. **語義化標籤**：HTML5 引入 `<header>`、`<article>` 等語義化標籤，使結構更清晰
10. **跨平台支援**：網頁標準，支援各種設備和瀏覽器，保證內容一致呈現

<!--
HTML 能做的事情很多，畫面列了十項，我們不逐一唸，挑幾個重點來看。

HTML 可以定義網頁的結構，分出標題、段落、圖片等區塊；可以用 `a` 標籤建立超連結；可以用 `form` 讓使用者輸入資料；也可以用 `table` 呈現表格。

這裡特別提一下第八和第九點：SEO 和語義化標籤。搜尋引擎每天會爬很多網頁，如果整個網頁都用沒有意義的 `div` 組成，搜尋引擎很難看懂結構。如果用 `header` 裝頁首、用 `nav` 裝導覽列，搜尋引擎就能清楚理解每個區塊的用途，這對網站的搜尋排名很有幫助。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# HTML 架構
# Document Structure

<!--
接下來，我們拆解一份標準 HTML 檔案的架構。就像寫信有固定的格式，HTML 檔案也有固定的開頭。
-->

---

# HTML 基本架構

- 普遍預設網頁入口都是檔名 `index` 為主
- 語法編輯概念和樂高相似，利用**標籤（元素）**來堆疊建構
- `<body>` 內層結構介紹

```html
<!DOCTYPE html>
<html lang="en">      <!-- 網頁語系 -->
  <head>
    <meta charset="UTF-8">          <!-- 網頁編輯與拆解碼格式 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>         <!-- 網頁分頁名稱 -->
  </head>
  <body>
    <!-- 網頁主體內容 -->
  </body>
</html>
```

<!--
這是一份標準 HTML 檔案的基本架構。網站的入口檔案，通常會命名為 `index.html`。

第一行 `DOCTYPE` 告訴瀏覽器，這是一份 HTML5 的文件。最外層是 `html` 標籤，裡面分成兩大區塊。

`head` 放的是給瀏覽器看的資訊，例如文字編碼、網頁標題、在手機上的縮放比例，這些內容不會顯示在畫面上。`body` 則是網頁的本體，寫在這裡面的標籤，才會真正顯示在螢幕上。

我們可以把它想成一份產品說明書：`head` 是封面上的序號和日期，`body` 才是裡面的圖文內容。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 標籤（元素）
# Tags & Elements

<!--
有了整體架構，接下來我們看構成網頁內容的最小單位：標籤。
-->

---

# 標籤（元素）概念

- `<>` 稱標記；`<h1>` 稱標籤；`</h1>` 稱結尾標籤
- **標籤中可以涵蓋其他標籤**（巢狀結構）
- 標籤有**行內**與**區塊**兩種元素型態：
  - **行內**：不自動換行、左右空間不填滿
  - **區塊**：<span style="color:red;font-weight:bold;">自動換行</span>且左右空間會<span style="color:red;font-weight:bold;">主動填滿</span>
- 能被分**班級**（`class`）、擁有**識別證**（`id`）、**不同造型**（`style`）以及擁有**名字**（`name`）

<!--
先認識幾個名詞。角括號叫做標記，`<h1>` 這樣的叫標籤，前面加了斜線的 `</h1>` 叫結尾標籤。

標籤就像三明治，開頭標籤和結尾標籤是上下兩片麵包，中間夾著內容。標籤裡面還可以再包其他標籤，形成一層一層的巢狀結構。

標籤分成兩種型態。「區塊元素」會自動換行，並且佔滿整行的寬度，像一個大紙箱；「行內元素」不會換行，只佔內容需要的寬度，像小貼紙，可以好幾個排在同一行。

另外，標籤還可以加上 `class`、`id`、`style`、`name` 這些屬性，之後寫 CSS 時會常常用到。

很多人會忘記寫結尾標籤，結果後面的內容全部被包進去，畫面整個亂掉，這點要特別注意。
-->

---

# 行內 vs 區塊 — 程式碼對照

```html
<main>
  <p class="block">Block 1</p>
  <p class="block">Block 2</p>
  <span name="Inline">Inline 1</span>
  <span style="color: brown;">Inline 2</span>
  <small id="small">call me small</small>
</main>
```

<div class="browser-preview text-sm mt-2">
  <div style="display:block; font-size:1em; margin:0.4em 0;">Block 1</div>
  <div style="display:block; font-size:1em; margin:0.4em 0;">Block 2</div>
  <span style="font-size:0.95em;">Inline 1 </span><span style="color:brown; font-size:0.95em;">Inline 2 </span><small style="font-size:0.8em;">call me small</small>
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> Block 各占一行；Inline 元素排在同一行不換行
</div>

<!--
我們直接看行內和區塊元素在瀏覽器上的差別。

上面兩行 Block 用的是 `p` 標籤，它是區塊元素。雖然在程式碼裡寫在一起，但在畫面上，Block 1 和 Block 2 各自佔了一整行。

下面的 `span` 和 `small` 是行內元素，所以 Inline 1、Inline 2 和 call me small，會排在同一行上。

我們可以想成火車的車廂和乘客：區塊元素是車廂，一節佔一段；行內元素是乘客，可以並排坐在同一排。

之後排版時，如果想讓幾個元素並排，卻發現它們一直換行，很可能就是用到了區塊元素，記得回頭檢查一下。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# HTML 主要標籤
# Tags Reference

<!--
HTML 的標籤有一百多個，不需要全部背起來，我們先認識最常用的幾個。
-->

---

# 主要標籤（一）— 文件結構

| 標籤 | 說明 |
| --- | --- |
| `<!DOCTYPE html>` | 宣告文件為 HTML5，告訴瀏覽器用 HTML5 標準解析 |
| `<html>` | HTML 頁面的根元素，所有標籤都放在這裡面 |
| `<head>` | 包含關於網頁的資訊，**不會在網頁上顯示** |
| `<title>` | 設定網頁標題，顯示在瀏覽器分頁上 |
| `<meta>` | 設定元數據，例如編碼、描述、關鍵字等 |
| `<link>` | 連結外部資源，例如 CSS 檔案 |
| `<body>` | 顯示網頁主要內容，使用者在瀏覽器中看到的部分 |
| `<h1>` ～ `<h6>` | 標題標籤，從 h1（最大）到 h6（最小） |

<!--
第一組是跟文件結構有關的標籤。

`DOCTYPE`、`html`、`head`、`body` 剛才都看過了。`head` 裡面常見的有三個：`title` 設定瀏覽器分頁上的標題，`meta` 設定編碼等資訊，`link` 用來引入外部的 CSS 檔案。

表格最後一列是標題標籤，從 `h1` 到 `h6`，`h1` 最大，`h6` 最小。這裡有一個實務上的建議：一個頁面最好只有一個 `h1`，代表這頁的主標題。

很多初學者為了讓字變大，就隨手用 `h1`，這是不對的。想讓字變大，應該用 CSS 調整字體大小。標題標籤是用來表達結構的，用錯了也會影響搜尋引擎對網頁的理解。
-->

---
zoom: 0.89
---

# 主要標籤（二）— 文字、連結與列表

| 標籤 | 說明 |
| --- | --- |
| `<p>` | 段落標籤，用於顯示段落文字 |
| `<a>` | 連結標籤，用來建立超連結 |
| `<img>` | 圖像標籤，用來插入圖片 |
| `<ul>` & `<li>` | 無序列表，`<ul>` 是容器，`<li>` 是列表項目 |
| `<ol>` & `<li>` | 有序列表，`<ol>` 是容器，`<li>` 自動加上編號 |
| `<div>` | 區塊元素，用於分隔頁面區域，常用於布局 |
| `<span>` | 行內元素，對文字或行內元素進行分組 |
| `<table>` | 表格標籤，用於建立表格 |
| `<tr>` & `<td>` | 表格的列（`<tr>`）和單元格（`<td>`）標籤 |

<!--
第二組是放網頁內容的標籤。

`p` 是段落文字，`a` 是超連結，`img` 用來放圖片。列表有兩種：`ul` 是無序列表，項目前面是圓點；`ol` 是有序列表，會自動加上編號，兩者的每個項目都用 `li` 包起來。我們可以把 `ul` 想成一張清單，`li` 就是清單上的每一行。

`div` 和 `span` 是兩個沒有特別意義的容器，`div` 是區塊元素，`span` 是行內元素。其中 `div` 是最常用的萬用標籤，在 HTML5 語義化標籤出現之前，整個網頁幾乎都是用 `div` 組成的。

最後是表格相關的 `table`、`tr`、`td`，後面會再詳細介紹。
-->

---
zoom: 0.82
---

# 主要標籤（三）— 表單與語義化

| 標籤 | 說明 |
| --- | --- |
| `<form>` | 表單標籤，用來收集使用者輸入資料 |
| `<input>` | 輸入欄位，定義文字輸入、按鈕、選單等 |
| `<button>` | 按鈕標籤，定義可點擊的按鈕 |
| `<select>` & `<option>` | 下拉選單標籤 |
| `<iframe>` | 內嵌框架，在頁面中嵌入另一個 HTML 網頁 |
| `<nav>` | 導航標籤，定義頁面中的導航區塊 |
| `<header>` | 頁眉標籤，通常包含網站標題、導航 |
| `<footer>` | 頁腳標籤，定義頁面的尾部內容 |
| `<article>` | 文章標籤，表示自包含的獨立內容區塊 |
| `<section>` | 區段標籤，將頁面內容分組為不同邏輯區段 |

<!--
第三組是表單和語義化標籤。

如果網頁需要讓使用者登入、填問卷、按下送出，就會用到 `form` 表單，搭配 `input` 輸入欄位、`button` 按鈕，以及 `select` 和 `option` 組成的下拉選單。`iframe` 則可以在頁面裡嵌入另一個網頁。

下半部的 `nav`、`header`、`footer`、`article`、`section`，就是剛才提到的語義化標籤。它們在畫面上看起來跟 `div` 一樣，沒有特別的樣式，但能清楚表達每個區塊的用途，讓搜尋引擎和其他開發者更容易理解網頁的結構。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 常用標籤實作
# Hands-on

<!--
介紹了這麼多標籤，接下來我們實際動手寫寫看。
-->

---

# 編寫基本 HTML（練習）

開始編寫 HTML 只需一個文字編輯器（Notepad、Sublime Text、VS Code 等）。
也可用線上即時 HTML 編輯器：**https://html.cafe/**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>我的第一頁網頁</title>
  </head>
  <body>
    <h1>歡迎來到我的網頁！</h1>
    <p>這是一段簡單的文字。</p>
  </body>
</html>
```

<!--
寫 HTML 只需要一個文字編輯器，記事本、VS Code 都可以。也可以用畫面上這個線上編輯器，寫完馬上就能看到結果。

我們看這段最基本的網頁。`head` 裡的 `title` 寫著「我的第一頁網頁」，打開網頁時，瀏覽器分頁上就會顯示這幾個字。`body` 裡有一個 `h1` 標題，和一段文字，這些會顯示在主畫面上。

【講師】可以請大家把 `h1` 的文字改成自己的名字，存檔後看看瀏覽器的變化。
-->

---

# HTML 常用標籤 — H1～H6 & ul/ol

```html
<h1>h1</h1>  <h2>h2</h2>  <h3>h3</h3>
<h4>h4</h4>  <h5>h5</h5>  <h6>h6</h6>

<ul>
  <li>one</li>  <li>two</li>  <li>three</li>
</ul>

<ol>
  <li>one</li>  <li>two</li>  <li>three</li>
</ol>
```

<div class="browser-preview text-sm flex gap-8">
  <div>
    <div style="font-size:1.5em;font-weight:bold;">h1</div>
    <div style="font-size:1.2em;font-weight:bold;">h2</div>
    <div style="font-size:1.05em;font-weight:bold;">h3</div>
    <div style="font-size:0.95em;font-weight:bold;">h4 / h5 / h6</div>
  </div>
  <div>• one<br>• two<br>• three</div>
  <div>1. one<br>2. two<br>3. three</div>
</div>

<!--
我們來看標題和列表實際顯示的效果。

`h1` 到 `h6` 在沒有寫 CSS 的情況下，瀏覽器會預設幫我們加粗，並且由大到小排列。

接著看列表。用 `ul` 的話，每個項目前面是小圓點；用 `ol` 的話，瀏覽器會自動加上一、二、三的編號。

注意，`li` 一定要放在 `ul` 或 `ol` 裡面，不要單獨使用，否則排版可能會出問題。
-->

---

# HTML 常用標籤 — a、img

```html
<main>
  <a href="https://www.dcard.tw/f/whysoserious/p/235767148">前往酷酷的地方</a>
  <img src="https://stickershop.line-scdn.net/.../main.png" alt="">
</main>
```

<div class="browser-preview text-sm mt-2">
  <div style="margin-bottom:0.5rem;">
    <a style="color:#0000EE; text-decoration:underline; cursor:pointer;">前往酷酷的地方</a>
  </div>
  <div style="width:80px; height:80px; background:#e8e8e8; border-radius:4px; display:flex; align-items:center; justify-content:center; color:#999; font-size:0.75em;">🐧 img</div>
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>img alt：</b> 圖片無法載入時顯示的替代文字，也有助於無障礙與 SEO
</div>

<!--
接著看兩個需要搭配屬性才能運作的標籤：`a` 和 `img`。

`a` 標籤需要 `href` 屬性，用來指定連結的目的地。我們可以把它想成傳送門的目標地址，沒有寫 `href`，點下去就不會有任何反應。

`img` 標籤需要 `src` 屬性，告訴瀏覽器圖片檔案在哪裡。

這裡有兩個常見的錯誤。第一，`img` 是單標籤，不需要結尾標籤，寫成一個就完成了。第二，記得加上 `alt` 屬性，當圖片載入失敗時，畫面會顯示 `alt` 裡的替代文字。它對視障朋友使用的螢幕報讀軟體也很重要，同時也有助於 SEO。
-->

---

# HTML 常用標籤 — textarea、div

```html
<main>
  <textarea name="" id="" cols="30" rows="10">Cool Der</textarea>
  <div>
    Hot Div
  </div>
</main>
```

<div class="browser-preview text-sm mt-2 flex gap-6 items-start">
  <textarea style="width:180px; height:80px; font-size:0.9em;" readonly>Cool Der</textarea>
  <div>Hot Div</div>
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>textarea</b> 是多行文字輸入框；<b>div</b> 是最常用的區塊容器，預設不帶樣式
</div>

<!--
如果要讓使用者輸入比較長的內容，例如留言，就要用 `textarea` 這個多行輸入框。它的右下角可以拖拉，調整輸入框的大小。

下面的 `div`，就像一個透明的收納箱。它預設沒有任何邊框和背景，但可以把一堆文字和圖片包在一起。之後要移動位置或換背景色，只要對這個 `div` 設定，裡面的內容就會一起跟著變化。
-->

---

# 輸入（input）標籤

- 輸入標籤經常被使用到，因為能輸入的**型態（type）相當多元**
- Type 有：`text`（文字）、`number`（數字）、`radio`（單選方塊）、`checkbox`（複選方塊）、`file`（選取檔案）、`password`（密碼）等等

| type | 說明 | 顯示效果 |
| --- | --- | --- |
| `text` | 一般文字輸入 | 文字框 |
| `number` | 數字輸入 | 數字框（可按箭頭調整） |
| `radio` | 單選方塊 | 圓形選項鈕 ● |
| `checkbox` | 複選方塊 | 方形勾選框 □ |
| `file` | 選取檔案 | 選擇檔案按鈕 |
| `password` | 密碼輸入 | 隱藏字元顯示 ●●●● |

<!--
`input` 是最常用的輸入標籤，它的特色是可以變換成很多種型態。

只要改變 `type` 屬性，它就會呈現完全不同的樣子。看表格，`text` 是一般的文字框，`number` 是數字框，`radio` 是圓形的單選鈕，`checkbox` 是方形的勾選框，`file` 會出現選擇檔案的按鈕，`password` 則會把輸入的字元隱藏起來。

實務上有一點要特別注意：密碼欄位一定要用 `password`，不要用 `text`。否則使用者在公共場所登入時，旁邊的人就能直接看到密碼。
-->

---

# 輸入（input）標籤 — 範例

```html
<label for="">Text</label>     <input type="text" />
<label for="">Number</label>   <input type="number" />
<label for="">Radio</label>    <input type="radio" />
<label for="">Checkbox</label> <input type="checkbox" />
<label for="">file</label>     <input type="file" />
<label for="">password</label> <input type="password" />
```

<div class="browser-preview text-sm mt-2" style="font-family: sans-serif;">
  <div>Text <input type="text" value="221ddfs" style="border:1px solid #999; padding:2px 4px;" readonly></div>
  <div>Number <input type="number" value="12345" style="border:1px solid #999; padding:2px 4px; width:80px;" readonly>
  &nbsp; Radio <input type="radio" checked readonly>
  &nbsp; Checkbox <input type="checkbox" readonly>
  &nbsp; file <input type="file" style="font-size:0.8em;" disabled></div>
  <div>password <input type="password" value="123456" style="border:1px solid #999; padding:2px 4px;" readonly></div>
</div>

<!--
我們看看這些 `input` 實際顯示出來的樣子。

特別觀察 `radio` 和 `checkbox` 的差別。單選鈕是圓形的，同一組只能選一個，像是選擇性別；勾選框是方形的，可以勾選好幾個，像是選擇興趣。這是網頁上大家都習慣的設計方式。

`file` 會自動產生一個選擇檔案的按鈕，點下去會打開系統的選檔視窗。不過因為我們還沒有後端，選了檔案也不會真的上傳。
-->

---

# Button & label 標籤

```html
<label for="">列表名稱</label>
<button type="button">這是Button</button>
<button type="submit">這是submit</button>
```

<div class="browser-preview text-sm mt-4" style="font-family: sans-serif;">
  <span style="margin-right:0.5rem;">列表名稱</span>
  <button style="border:1px solid #999; background:#f0f0f0; padding:4px 12px; margin-right:4px; cursor:pointer;">這是Button</button>
  <button style="border:1px solid #999; background:#f0f0f0; padding:4px 12px; cursor:pointer;">這是submit</button>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>type="button"</b>：一般按鈕，點擊不會提交表單；<b>type="submit"</b>：會觸發 <code>&lt;form&gt;</code> 的送出動作
</div>

<!--
接著是按鈕和 `label`。

按鈕的 `type` 主要有兩種。`type` 等於 `button` 是一般按鈕，點下去不會有任何預設動作，要搭配程式來決定它做什麼。`type` 等於 `submit` 則是送出按鈕，放在 `form` 裡面時，點下去就會把表單的資料送出。

`label` 是 `input` 的好搭檔，用來標示輸入框的名稱。如果把 `label` 和輸入框綁在一起，使用者點擊 `label` 的文字，游標就會自動跳進輸入框，在手機上特別好用。
-->

---
zoom: 0.91
---

# HTML 常用標籤 — table（1/3）外層結構

`<table>` 是整個表格的外框容器，內部用 `<thead>` 和 `<tbody>` 語義化分區：

| 標籤 | 說明 |
| --- | --- |
| `<table>` | 表格最外層容器，所有列與欄都放在裡面 |
| `<thead>` | 表格標題區，放欄位名稱列，語義上是「表頭」 |
| `<tbody>` | 表格資料區，放實際內容列，語義上是「表身」 |

```html
<table>
  <thead>
    <!-- 表頭列（欄位標題）放這裡 -->
  </thead>
  <tbody>
    <!-- 資料列放這裡 -->
  </tbody>
</table>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>thead</code> / <code>tbody</code> 不影響視覺，但讓 CSS 套樣式更精準，也讓瀏覽器與爬蟲理解表格語意
</div>

<!--
接下來我們花三頁介紹表格，先看外層的結構。

`table` 是整個表格最外層的容器，裡面分成兩個區塊：`thead` 是表頭，放欄位名稱；`tbody` 是表身，放實際的資料。

我們可以把表格想成一棟大樓，`thead` 是一樓大廳，掛著招牌；`tbody` 是樓上的住戶，放著真正的資料。

不寫 `thead` 和 `tbody`，瀏覽器也能顯示表格，但加上去能讓結構更清楚，之後寫 CSS 也比較好指定樣式，是一個好習慣。
-->

---
zoom: 0.96
---

# HTML 常用標籤 — table（2/3）tr 與 th

`<tr>` 定義「一整橫列」，`<th>` 定義列中的「標題欄位」：

| 標籤 | 說明 | 預設樣式 |
| --- | --- | --- |
| `<tr>` | Table Row，代表表格中的一整列 | 無 |
| `<th>` | Table Header，標題格，放在 `<thead>` 的 `<tr>` 裡 | **粗體 + 置中** |

```html
<thead>
  <tr>
    <th>姓名</th>
    <th>數學</th>
    <th>英文</th>
  </tr>
</thead>
```

<div class="browser-preview text-sm mt-2" style="font-family: sans-serif;">
  <table style="border-collapse:collapse;">
    <thead>
      <tr>
        <th style="border:1px solid #999; padding:4px 14px; background:#f5f5f5; font-weight:bold; text-align:center;">姓名</th>
        <th style="border:1px solid #999; padding:4px 14px; background:#f5f5f5; font-weight:bold; text-align:center;">數學</th>
        <th style="border:1px solid #999; padding:4px 14px; background:#f5f5f5; font-weight:bold; text-align:center;">英文</th>
      </tr>
    </thead>
  </table>
</div>

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 一個 <code>&lt;tr&gt;</code> 代表一橫列；列裡面有幾個 <code>&lt;th&gt;</code>，就代表有幾欄
</div>

<!--
接著看表格裡的每一列。

`tr` 是 table row 的縮寫，代表表格中的一整橫列，就像大樓的一層樓。`th` 是 table header 的縮寫，代表標題格，放在 `thead` 的 `tr` 裡面。

看右邊的結果，瀏覽器會預設把 `th` 的文字加粗並置中，讓人一眼看出這是欄位名稱。

一個 `tr` 代表一橫列，列裡面放了幾個 `th`，這張表就有幾欄。這裡我們放了姓名、數學、英文三個欄位。
-->

---

# HTML 常用標籤 — table（3/3）td 與完整範例

`<td>` 定義「資料格」，放在 `<tbody>` 的 `<tr>` 裡：

| 標籤 | 說明 | 預設樣式 |
| --- | --- | --- |
| `<td>` | Table Data，資料格，放在 `<tbody>` 的 `<tr>` 裡 | 無（靠左對齊） |

```html
<tbody>
  <tr>
    <td>小明</td><td>90</td><td>85</td>
  </tr>
  <tr>
    <td>小華</td><td>70</td><td>95</td>
  </tr>
</tbody>
```

<div class="browser-preview text-sm mt-2" style="font-family: sans-serif;">
  <table style="border-collapse:collapse;">
    <thead>
      <tr>
        <th style="border:1px solid #999; padding:4px 14px; background:#f5f5f5;">姓名</th>
        <th style="border:1px solid #999; padding:4px 14px; background:#f5f5f5;">數學</th>
        <th style="border:1px solid #999; padding:4px 14px; background:#f5f5f5;">英文</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border:1px solid #999; padding:4px 14px;">小明</td>
        <td style="border:1px solid #999; padding:4px 14px;">90</td>
        <td style="border:1px solid #999; padding:4px 14px;">85</td>
      </tr>
      <tr>
        <td style="border:1px solid #999; padding:4px 14px;">小華</td>
        <td style="border:1px solid #999; padding:4px 14px;">70</td>
        <td style="border:1px solid #999; padding:4px 14px;">95</td>
      </tr>
    </tbody>
  </table>
</div>

<!--
最後是資料格 `td`，全名是 table data，放在 `tbody` 的 `tr` 裡面。它跟 `th` 的差別在於，`td` 沒有預設的粗體和置中。

這裡我們寫了兩列資料，分別是小明和小華的成績。右邊就是完整的表格。

要注意，每一列 `td` 的數量，要跟表頭 `th` 的數量一樣，否則欄位會對不齊。

我們整理一下：`table` 是整棟大樓，`thead` 和 `tbody` 區分樓層的用途，`tr` 是每一層樓，`th` 是招牌，`td` 是住戶。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 練習題
# HTML 練習

<!--
常用的標籤都介紹完了，接下來進入練習題，動手把剛才學的內容寫出來。
-->

---
layout: default
---

# 練習 1

請開啟專案並且試著將下方圖片的畫面做出來（單純 HTML 無 CSS）。

**目標畫面：**

<div class="browser-preview" style="font-family: serif;">
  <h1 style="font-size:2em; font-weight:bold; margin:0;">HTML練習</h1>
</div>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
🎯 <b>提示：</b> 只需要一個 <code>&lt;h1&gt;</code> 標籤，內容為「HTML練習」
</div>

<!--
練習一是熱身題。請在 `body` 裡做出畫面上這行大標題，內容是「HTML練習」。

想一想，要用哪一個標籤，才能顯示出最大的標題文字？

我們先暫停一下，自己動手試試看。

【講師】給大家 30 秒到 1 分鐘完成。
-->

---
layout: default
---

# 練習 2

請開啟專案並且試著將下方圖片的畫面做出來（單純 HTML 無 CSS）。

**目標畫面：**

<div class="browser-preview text-sm" style="font-family: sans-serif;">
  <div><textarea style="border:1px solid #999; resize:both; width:200px; height:50px;" readonly>我是文字輸入框(可拉大)</textarea></div>
  <ul style="margin:0.3rem 0; padding-left:1.5rem; list-style:disc;">
    <li><input type="text" style="border:1px solid #999; padding:2px;" readonly></li>
    <li><input type="checkbox" readonly></li>
  </ul>
  <ol style="margin:0.3rem 0; padding-left:1.5rem;">
    <li><button style="border:1px solid #999; background:#f0f0f0; padding:1px 6px; font-size:0.85em;">選擇檔案</button> 未選擇任何檔案</li>
    <li><input type="radio" readonly></li>
  </ol>
  <button style="border:1px solid #999; background:#f0f0f0; padding:3px 10px; margin-top:4px;">我是按鈕Button</button>
</div>

<!--
練習二稍微難一點。畫面上有一個多行文字輸入框，一個無序列表，裡面放了文字框和勾選框；一個有序列表，裡面放了檔案選擇和單選鈕；最後是一顆按鈕。

先不用管排版和間距，只要標籤用對、順序正確就算過關。想一想，有圓點的列表和有編號的列表，分別是哪一個標籤？

我們先暫停一下，自己動手試試看。

【講師】給大家 5 分鐘左右。
-->

---
layout: default
---

# 練習 3

請開啟專案並且試著將下方圖片的畫面做出來（單純 HTML 無 CSS）。

**目標畫面：**

<div class="browser-preview text-sm" style="font-family: serif;">
  <h1 style="font-size:1.6em; font-weight:bold; margin:0 0 0.3rem;">HTML練習</h1>
  <p style="margin:0 0 0.5rem; font-size:0.9em;">可愛的圖片</p>
  <img src="/images/08-html/practice3-animal.png" alt="可愛的圖片" style="max-width:260px; max-height:120px; border-radius:4px;" />
</div>

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
🎯 <b>提示：</b> 結構為 <code>&lt;h1&gt;</code> + <code>&lt;p&gt;</code> + <code>&lt;img&gt;</code>，將圖片放入 src 屬性即可
</div>

<!--
練習三，我們要放一張圖片。結構是一個標題、一段文字，再加上一張圖片，圖片的路徑放在 `src` 屬性裡。

如果圖片顯示不出來，大多數情況是路徑寫錯，或是英文大小寫不一致，記得仔細檢查。另外，別忘了幫圖片加上 `alt` 文字。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 4

請開啟專案並且試著將下方圖片的畫面做出來（單純 HTML 無 CSS）。

**目標畫面：**

<div class="browser-preview text-sm" style="font-family: sans-serif;">
  <h1 style="font-size:1.5em; font-weight:bold; margin:0 0 0.5rem;">HTML練習</h1>
  <table style="border-collapse:collapse; font-size:1em;">
    <thead>
      <tr>
        <th style="border:1px solid #000; padding:6px 16px;">姓名</th>
        <th style="border:1px solid #000; padding:6px 16px;">數學</th>
        <th style="border:1px solid #000; padding:6px 16px;">英文</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border:1px solid #000; padding:6px 16px;">小明</td>
        <td style="border:1px solid #000; padding:6px 16px;">90</td>
        <td style="border:1px solid #000; padding:6px 16px;">85</td>
      </tr>
      <tr>
        <td style="border:1px solid #000; padding:6px 16px;">小華</td>
        <td style="border:1px solid #000; padding:6px 16px;">70</td>
        <td style="border:1px solid #000; padding:6px 16px;">95</td>
      </tr>
    </tbody>
  </table>
</div>

<!--
練習四是一張成績表格。

表格是初學者最容易寫亂的標籤，記住一個口訣：「先有樓層，才有房間」。`tr` 是樓層，也就是一整列；`td` 是房間，也就是列裡面的每一格。一定要先寫 `tr`，才能在裡面放 `th` 或 `td`。

想一想，這張表的表頭有幾欄？資料又有幾列？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 5（上）— 個人名片頁面

請開啟專案並且試著將下方圖片的畫面做出來（單純 HTML 無 CSS）。

<img src="/images/08-html/practice5.png" alt="練習5目標畫面" style="max-height: 320px;" />

<!--
練習五是這一章的綜合題，我們要用剛才學到的所有標籤，做出一張個人名片網頁。

畫面上會用到標題、圖片、列表、連結、表格，還有一個留言表單。可以把這題當作自己的第一個網頁作品。

下一頁會列出每個區塊需要用到的標籤。
-->

---
layout: default
---

# 練習 5（下）— 完整頁面所需標籤

| 區塊 | 使用標籤 |
| --- | --- |
| 姓名 + 自我介紹 | `<h2>` `<p>` `<img>` |
| 關於我、我的興趣 | `<h3>` `<p>` `<ul>` `<li>` |
| 聯絡我 + 連結 | `<h3>` `<p>` `<a>` |
| 我的作品 | `<table>` `<tr>` `<th>` `<td>` |
| 留言給我 | `<form>` `<input>` `<textarea>` `<button>` |

<!--
這張表把名片頁的每個區塊，和需要的標籤都列出來了。

姓名和自我介紹用標題、段落和圖片；關於我和興趣用列表；聯絡方式用 `a` 連結；作品清單用表格；最後的留言區用 `form`、`input`、`textarea` 和 `button`。

可以照著表格，由上往下一個區塊一個區塊完成。

我們先暫停一下，自己動手試試看。

【講師】給大家 15 分鐘，過程中巡堂協助卡住的同學。
-->

---
layout: end
---

# HTML 學習完成
### 掌握骨架，前端世界從這裡開始！

<!--
這一章我們學會了 HTML 的基礎。我們知道 HTML 是網頁的骨架，認識了 `head` 和 `body` 的分工，以及區塊和行內元素的差別。我們也練習了標題、列表、連結、圖片、表單和表格這些常用標籤。

寫練習時，大家可能發現少一個角括號或斜線，畫面就會亂掉，這也是寫網頁時要培養的細心。

現在網頁還很陽春，下一章我們要學 CSS，幫這些骨架穿上衣服。我們下一章見。
-->
