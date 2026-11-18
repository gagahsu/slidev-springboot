---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: CSS 進階工具
routeAlias: ch11
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
    CSS 進階工具
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「背景、定位、堆疊，掌控版面細節」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學了互動效果和 Flexbox 排版。這一章，我們要學幾個能掌控版面細節的 CSS 工具。

我們會學怎麼幫元素加上背景圖片，怎麼把元素固定在畫面的某個位置，以及當元素疊在一起時，怎麼決定誰在上面、誰在下面。

學完這一章，我們就能更精準地控制版面上每個元素的位置和層次。
-->

---
layout: default
---

# Outline

- **背景設定 — background-image / repeat / position / size**
- **display — block / inline / inline-block / flex / none**
- **Position — fixed / relative & absolute**
- **z-index — 堆疊順序**
- **後蓋前觀念 — CSS 優先權**
- **練習**

<!--
這一章的路線是這樣的。先介紹背景圖片的四個常用屬性，接著整理 `display` 的各種值。然後進入這一章的重點：Position 定位，以及控制堆疊順序的 `z-index`。最後再深入談 CSS 的優先權規則，並用一個定位的練習收尾。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 背景設定
# Background Properties

<!--
我們先從背景開始，看看怎麼幫元素加上背景圖片。
-->

---

# 背景設定 — 屬性總覽

`background-*` 系列屬性可精細控制元素的背景圖片顯示方式：

| 屬性 | 說明 |
| --- | --- |
| `background-image` | 設定背景圖片，使用 `url(...)` 指定路徑 |
| `background-repeat` | 控制背景是否重複平鋪，常用 `no-repeat` |
| `background-position` | 設定背景位置，格式為 `X Y`（水平 垂直） |
| `background-size` | 指定背景圖片大小（px、%、`cover`、`contain`） |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>background-position</b> 前方數值代表水平位置（X），後方代表垂直位置（Y）
</div>

<!--
背景相關的屬性都以 `background` 開頭，常用的有四個。

`background-image` 設定背景圖片的路徑。`background-repeat` 控制圖片要不要像磁磚一樣重複鋪滿。`background-position` 決定圖片在元素裡的位置，格式是先寫水平、再寫垂直。`background-size` 則控制圖片的大小。

這四個屬性組合起來，就能做出大部分的背景效果。接下來我們一個一個看。
-->

---

# background-image — 本地端圖片

`url()` 可以放入**本地端（電腦）圖片的路徑**：

```css
background-image: url("./IMG_8536(1).jpg");
```

<div style="display: flex; gap: 2rem; align-items: center; margin-top: 0.8rem;">
  <img src="/images/11-css/bg-local.png" alt="本地端背景圖片效果示意" style="max-height: 220px; border-radius: 6px; border: 1px solid #e2e8f0; flex-shrink: 0;" />
  <div class="p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm">
    💡 路徑以 <code>./</code> 開頭代表相對路徑，與 CSS 檔案位於同一層目錄<br/><br/>
    ⚠️ 圖片名稱含括號、空格等特殊字元時，記得確認路徑格式正確
  </div>
</div>

<!--
`background-image` 用 `url` 指定圖片的路徑，第一種是放電腦裡的圖片。

這裡的路徑以 `./` 開頭，代表「從目前這個 CSS 檔案所在的位置開始找」，這叫相對路徑。路徑寫錯的話，瀏覽器找不到圖片，背景就會是一片空白。

另外，如果圖片檔名裡有括號或空格這類特殊字元，要特別確認路徑的寫法，用引號把路徑包起來會比較保險。
-->

---

# background-image — 網路圖片：取得網址

`url()` 也可以放入**網路圖片的網址**，三步驟取得圖片網址：

<img src="/images/11-css/bg-network-steps.png" alt="Google 搜尋圖片後複製圖片網址的步驟截圖" style="max-height: 300px; margin-top: 0.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 使用網路圖片前請注意版權，此處僅作練習用途
</div>

<!--
`url` 裡也可以放網路圖片的網址。

取得網址的方式是：找到想要的圖片，按右鍵，選擇「複製圖片位址」。注意是圖片本身的位址，不是整個網頁的網址。複製之後，貼進 `url` 的括號裡就可以了。

不過要提醒一下，網路圖片在練習時很方便，但正式專案要注意版權。而且如果對方的網站關閉，圖片也會跟著消失。
-->

---

# background-image — 網路圖片：範例

```css
background-image: url("https://pic.pimg.tw/twfish0999/1361897489-2554509122_n.jpg");
```

<div style="display: flex; gap: 2rem; align-items: center; margin-top: 0.8rem;">
  <img src="/images/11-css/bg-network.png" alt="網路圖片設為背景的效果示意" style="max-height: 230px; border-radius: 6px; border: 1px solid #e2e8f0; flex-shrink: 0;" />
  <div class="p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm">
    💡 直接貼上圖片的完整 URL，效果與本地端相同<br/><br/>
    預設情況下背景圖片會<b>重複平鋪</b>填滿整個元素
  </div>
</div>

<!--
這就是使用網路圖片網址的範例，效果跟本地圖片一樣。

注意看右邊的畫面，當容器比圖片大的時候，瀏覽器預設會把圖片重複排列，像磁磚一樣鋪滿整個區域。

如果不想要重複的效果，就要用下一個屬性來處理。
-->

---

# background-repeat — 背景是否重複

預設背景圖片會重複平鋪，加上 `no-repeat` 可取消重複：

```css
background-repeat: no-repeat;
```

<div style="display: flex; gap: 2.5rem; align-items: flex-start; margin-top: 0.8rem;">
  <div>
    <div style="font-weight: bold; margin-bottom: 0.4rem;">預設（重複平鋪）</div>
    <div style="border: 2px solid #ccc; width: 180px; height: 160px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 0.8rem; text-align: center;">圖片重複排列<br/>填滿容器</div>
  </div>
  <div>
    <div style="font-weight: bold; margin-bottom: 0.4rem;">no-repeat（不重複）</div>
    <img src="/images/11-css/bg-no-repeat.png" alt="background-repeat: no-repeat 效果示意" style="max-height: 160px; border: 2px solid #ccc; border-radius: 4px;" />
  </div>
</div>

<!--
`background-repeat` 控制背景圖片要不要重複。

只要設定 `no-repeat`，圖片就只會顯示一張，不會重複鋪滿。

看右邊的示意圖，加上之後，圖片只出現在左上角，畫面就乾淨多了。
-->

---

# background-position — 設定背景位置

格式 `X Y`：前方數值為水平位置，後方為垂直位置：

```css
background-repeat: no-repeat;
background-position: 50% 50%;
```

<div style="display: flex; gap: 2rem; align-items: center; margin-top: 0.8rem;">
  <img src="/images/11-css/bg-position.png" alt="background-position: 50% 50% 效果示意（圖片置中）" style="max-height: 220px; border-radius: 6px; border: 1px solid #e2e8f0; flex-shrink: 0;" />
  <div class="p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm">
    💡 <b>X / Y 數值對照：</b><br/>
    X：<code>0%</code> = 靠左，<code>50%</code> = 置中，<code>100%</code> = 靠右<br/>
    Y：<code>0%</code> = 頂端，<code>50%</code> = 置中，<code>100%</code> = 底端<br/><br/>
    <code>50% 50%</code> 表示圖片顯示在正中央
  </div>
</div>

<!--
設定 `no-repeat` 之後，圖片預設會在左上角。如果想移動它，就要用 `background-position`。

它的格式是兩個值，第一個是水平位置，第二個是垂直位置。用百分比的話，水平的 0% 是靠左、50% 是置中、100% 是靠右；垂直的 0% 是頂端、50% 是置中、100% 是底端。

所以 50% 50% 就代表圖片在正中央。也可以用英文關鍵字，例如 `center center`，或是 `right bottom` 代表右下角。
-->

---

# background-size — 設定背景圖片大小

| 值 | 說明 |
| --- | --- |
| `px` / `%` | 直接指定圖片寬高 |
| `cover` | 等比放大至填滿容器，可能裁切；解析度低時易失真 |
| `contain` | 等比縮放至可完整放入容器，不裁切 |

```css
background-repeat: no-repeat;
background-size: contain;
```

<img src="/images/11-css/bg-size-contain.png" alt="background-size: contain 效果示意" style="max-height: 145px; margin-top: 0.4rem; border-radius: 4px; border: 1px solid #ccc;" />

<!--
最後是 `background-size`，控制背景圖片的大小。

除了直接寫像素或百分比，最常用的是兩個關鍵字。`cover` 會等比例放大，直到填滿整個容器，超出的部分會被裁掉；如果圖片解析度太低，放大後可能會模糊。`contain` 則是等比例縮放，確保整張圖片完整顯示，不會裁切，但容器比例不同時，旁邊會留下空白。

做網頁上方的大橫幅，或是頭像時，這兩個值都很常用。
-->

---

# 小節練習 — 背景設定

請設定一個 `400px × 250px` 的 `div`，使用網路圖片作為背景：

| 屬性 | 要求 |
| --- | --- |
| `background-image` | 使用任意圖片網址 |
| `background-repeat` | 不重複 |
| `background-position` | 水平垂直置中（`50% 50%`） |
| `background-size` | 填滿容器（可裁切） |

```html
<div class="hero-banner"></div>
```

<!--
我們用一個練習，把四個背景屬性都用上。

請建立一個寬 400 像素、高 250 像素的 `div`，用任意網路圖片當背景，設定不重複、水平垂直置中，並且讓圖片填滿容器，允許裁切。

想一想，「填滿容器、可以裁切」要用 `cover` 還是 `contain`？

我們先暫停一下，自己動手試試看。
-->

---

# 小節練習 — 背景設定 — 參考答案

```css
.hero-banner {
  width: 400px;
  height: 250px;
  background-image: url("https://picsum.photos/400/250");
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <code>background-size: cover</code> 填滿容器（可裁切）；<code>contain</code> 完整顯示（可能留白）<br/>
✅ <code>background-position: center center</code> 與 <code>50% 50%</code> 效果相同，英文關鍵字更易讀
</div>

<!--
我們來看答案。

`background-image` 放入圖片網址，`background-repeat` 設成 `no-repeat`，`background-position` 設成 50% 50%，最後 `background-size` 用 `cover`，讓圖片填滿容器。

`cover` 會填滿並可能裁切，`contain` 則完整顯示但可能留白。另外，50% 50% 也可以寫成 `center center`，效果一樣，讀起來更直覺。

做網頁上方的大型橫幅時，`cover` 加上置中，幾乎是標準組合。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# display 屬性
# 元素的排列方式

<!--
在學 Position 之前，我們先整理 `display` 的各種值，並加入常用的 `inline-block`。
-->

---

# display — 屬性值比較

| 值 | 排列方式 | 可設 width/height | 說明 |
| --- | --- | --- | --- |
| `block` | 獨占一整行，直排 | ✅ | `div`、`p`、`h1` 預設值 |
| `inline` | 橫排，不換行 | ❌ | `span`、`a` 預設值；只能設左右 margin |
| `inline-block` | 橫排，不換行 | ✅ | 兼具 inline 的橫排與 block 的尺寸控制 |
| `flex` | 啟用 Flexbox | ✅ | 子元素自動排列，詳見 ch09 |
| `none` | 完全隱藏 | — | 元素從畫面消失，不佔空間 |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>inline-block 使用時機：</b>需要橫排、但又要設定 <code>width</code> / <code>height</code> 時（如通知徽章的父容器）
</div>

<!--
這張表整理了常見的 `display` 值。

`block` 獨佔一整行，可以設定寬高，`div`、`p`、`h1` 預設都是它。`inline` 會橫向排列、不換行，但不能設定寬高，`span` 和 `a` 預設是它。

`inline-block` 是兩者的混合，它像 `inline` 一樣橫排，又像 `block` 一樣可以設定寬高，很適合做標籤或小徽章這類小元件。

`flex` 就是我們學過的 Flexbox。`none` 會讓元素完全消失，而且不佔空間，這跟 `visibility: hidden` 不同，後者只是看不見，空間還在。
-->

---

# display — 視覺對比

<div style="display: flex; gap: 2rem; margin-top: 0.8rem;">
  <div style="flex: 1;">
    <div style="font-weight: bold; margin-bottom: 0.4rem;">block</div>
    <div style="border: 2px solid #888; padding: 6px;">
      <div style="background: #93c5fd; margin-bottom: 4px; padding: 4px;">block 1</div>
      <div style="background: #93c5fd; margin-bottom: 4px; padding: 4px;">block 2</div>
      <div style="background: #93c5fd; padding: 4px;">block 3</div>
    </div>
    <div style="font-size: 0.78rem; color: #555; margin-top: 0.3rem;">各佔一行，垂直排列</div>
  </div>
  <div style="flex: 1;">
    <div style="font-weight: bold; margin-bottom: 0.4rem;">inline</div>
    <div style="border: 2px solid #888; padding: 6px;">
      <span style="background: #86efac; padding: 4px;">inline 1</span>
      <span style="background: #86efac; padding: 4px;">inline 2</span>
      <span style="background: #86efac; padding: 4px;">inline 3</span>
    </div>
    <div style="font-size: 0.78rem; color: #555; margin-top: 0.3rem;">橫排，無法設 width/height</div>
  </div>
  <div style="flex: 1;">
    <div style="font-weight: bold; margin-bottom: 0.4rem;">inline-block</div>
    <div style="border: 2px solid #888; padding: 6px;">
      <div style="display: inline-block; background: #fca5a5; width: 56px; height: 40px; margin-right: 4px; vertical-align: top; font-size: 0.75rem; padding: 2px;">60×40</div>
      <div style="display: inline-block; background: #fca5a5; width: 56px; height: 40px; margin-right: 4px; vertical-align: top; font-size: 0.75rem; padding: 2px;">60×40</div>
      <div style="display: inline-block; background: #fca5a5; width: 56px; height: 40px; vertical-align: top; font-size: 0.75rem; padding: 2px;">60×40</div>
    </div>
    <div style="font-size: 0.78rem; color: #555; margin-top: 0.3rem;">橫排 ＋ 可設 width/height</div>
  </div>
</div>

```css
.block-item        { display: block; }
.inline-item       { display: inline; }
.inline-block-item { display: inline-block; width: 60px; height: 40px; }
```

<!--
我們直接看三種值的對比。

`block` 的三個方塊各佔一行，垂直往下排。`inline` 的三個項目排在同一行，但就算設定了寬度，也不會有效果。`inline-block` 一樣排在同一行，而且寬 60、高 40 的設定都有生效。

實務上，當我們需要一個元素橫向排列，又要能控制它的大小，例如標籤、通知徽章的外框，就很適合用 `inline-block`。
-->

---

# display: flex + column vs block

`flex-direction: column` 讓子元素垂直排列，**看起來像 block，但能力更強**：

| | `block`（預設） | `flex` + `column` |
| --- | --- | --- |
| 子元素排列 | 垂直往下 | 垂直往下 |
| 子元素間距 | 各自設 `margin` | 父層用 `gap` 統一控制 |
| 子元素對齊 | ❌ 無法控制 | ✅ `align-items` 橫向對齊 |
| 子元素佔比 | ❌ 無法等分 | ✅ `flex: 1` 等分空間 |

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 只要「讓 div 往下排」不需要特地加 flex——block 預設就是直排。加 <code>flex + column</code> 是為了使用 <code>gap</code>、<code>align-items</code>、<code>justify-content</code> 等額外能力
</div>

<!--
這裡比較一個容易混淆的情況：`display: flex` 加上 `flex-direction: column`，和預設的 `block`。

兩者看起來都是子元素垂直往下排，但能力不同。看表格，`block` 的子元素要各自設定 margin 來控制間距，也沒辦法控制對齊和佔比。`flex` 加上 `column` 則可以在父層用 `gap` 統一設定間距，用 `align-items` 控制橫向對齊，還能用 `flex: 1` 等分空間。

所以，如果只是要讓元素往下排，不需要特地加 flex，`block` 預設就是這樣。需要間距、對齊這些額外控制時，才用 flex 加 column。
-->

---

# display: flex + column vs block — 範例

```css
/* 只是垂直排列 → block 預設就是，不需要 flex */
.list-simple { }

/* 垂直排列 + 需要 gap / align-items → 用 flex + column */
.list-flex {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}
```

<div style="display: flex; gap: 3rem; margin-top: 0.8rem;">
  <div style="flex: 1;">
    <div style="font-weight: bold; margin-bottom: 0.4rem; font-size: 0.9rem;">block（各自 margin）</div>
    <div style="border: 2px solid #888; padding: 6px; width: 130px;">
      <div style="background: #93c5fd; padding: 4px; margin-bottom: 8px; font-size: 0.8rem;">item 1</div>
      <div style="background: #93c5fd; padding: 4px; margin-bottom: 8px; font-size: 0.8rem;">item 2</div>
      <div style="background: #93c5fd; padding: 4px; font-size: 0.8rem;">item 3</div>
    </div>
  </div>
  <div style="flex: 1;">
    <div style="font-weight: bold; margin-bottom: 0.4rem; font-size: 0.9rem;">flex + column + gap + align-items: center</div>
    <div style="display: flex; flex-direction: column; gap: 8px; align-items: center; border: 2px solid #888; padding: 6px; width: 130px;">
      <div style="background: #fca5a5; padding: 4px; width: 70px; text-align: center; font-size: 0.8rem;">item 1</div>
      <div style="background: #fca5a5; padding: 4px; width: 70px; text-align: center; font-size: 0.8rem;">item 2</div>
      <div style="background: #fca5a5; padding: 4px; width: 70px; text-align: center; font-size: 0.8rem;">item 3</div>
    </div>
  </div>
</div>

<!--
我們看實際的範例。

左邊是 `block`，每個項目自己設定下方的 margin 來留間距。右邊是 `flex` 加 `column`，父容器用 `gap` 統一設定 8 像素的間距，再用 `align-items: center` 讓所有項目水平置中，這是 `block` 做不到的。

整理一下：單純直排，保持 `block` 就好；需要額外的對齊或間距控制，就用 flex 加 column。
-->

---

# 小節練習 — display

以下三個元素，請分別改用適合的 display 值，讓它們符合需求：

| 元素 | 目前 | 需求 | 應改成 |
| --- | --- | --- | --- |
| `<div class="tag">標籤</div>` | block（獨占一行） | 橫排 ＋ 可設寬高 | ??? |
| `<span class="title">標題</span>` | inline（無法設高） | 獨占一行 ＋ 可設寬高 | ??? |
| `<div class="hidden">隱藏</div>` | block（可見） | 完全隱藏不佔空間 | ??? |

<!--
我們來做一個小練習。

表格裡有三個元素：一個標籤，目前獨佔一行，需求是橫排而且能設定寬高；一個標題，目前不能設定高度，需求是獨佔一行並且能設定尺寸；還有一個區塊，需求是完全隱藏、不佔空間。

想一想，這三個需求分別要用哪一個 `display` 值？

我們先暫停一下，自己想想看。
-->

---

# 小節練習 — display — 參考答案

| 元素 | 答案 | 原因 |
| --- | --- | --- |
| `.tag` | `inline-block` | 橫排 ＋ 可設 width/height |
| `.title` | `block` | 獨占一行 ＋ 可設尺寸 |
| `.hidden` | `none` | 完全隱藏且不佔空間 |

```css
.tag    { display: inline-block; width: 80px; height: 28px; }
.title  { display: block; }
.hidden { display: none; }
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ 選擇 display 口訣：橫排要設尺寸 → <code>inline-block</code>；獨占一行 → <code>block</code>；多子元素排版 → <code>flex</code>；消失 → <code>none</code>
</div>

<!--
我們來看答案。

標籤要橫排又要能設定寬高，用 `inline-block`。標題要獨佔一行並設定尺寸，用 `block`。要完全隱藏而且不佔空間，用 `none`。

可以記一個選擇口訣：橫排又要設尺寸，用 `inline-block`；獨佔一行，用 `block`；多個子元素要排版，用 `flex`；要消失，用 `none`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Position（位置）
# fixed / relative / absolute

<!--
接下來進入這一章最核心，也最需要空間概念的屬性：Position，定位。
-->

---

# position: fixed — 定錨

`position: fixed` 將標籤**固定在視窗的絕對位置**，不隨滾輪移動：

- 定位方式以**視窗**的上下左右為基準
- 不論如何縮放網頁或滾動滾輪，位置始終不變
- 搭配 `top`、`right`、`bottom`、`left` 指定距視窗邊緣的距離

```css
.topContent {
  position: fixed;
  top: 20px;
  right: 50px;
}
```

<div class="mt-3 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 常用於固定導覽列、懸浮按鈕、回頂端按鈕等不隨頁面捲動的元件
</div>

<!--
第一種定位是 `position: fixed`。

設定 `fixed` 之後，元素會脫離原本的排列，改以「瀏覽器視窗」為基準來定位。再搭配 `top`、`right`、`bottom`、`left`，指定它距離視窗邊緣多遠。

這裡的範例是距離視窗上方 20 像素、右邊 50 像素。不管使用者怎麼捲動頁面，或是縮放網頁，它都會固定在視窗的這個位置，就像一顆釘在螢幕上的圖釘。

實務上，網頁右下角的回到頂端按鈕，或是捲動時一直留在上方的導覽列，都是用 `fixed` 做出來的。
-->

---

# position: fixed — 示意圖

滾輪滾動後，`fixed` 元素位置相對視窗**保持不變**：

<div style="display: flex; gap: 3rem; justify-content: center; align-items: flex-start; margin-top: 1.2rem;">
  <div>
    <div style="font-weight: bold; margin-bottom: 0.5rem; text-align: center; color: #444;">滾輪滾動前</div>
    <div style="position: relative; width: 160px; height: 210px; border: 2px solid #888; background: #fff; overflow: hidden;">
      <div style="position: absolute; top: 12px; right: 12px; width: 48px; height: 48px; background: #ee9b9b; border: 2px solid #c04040; z-index: 2;"></div>
      <div style="height: 90px; background: #e8f4e8; border-bottom: 1px dashed #bbb; display: flex; align-items: center; justify-content: center; color: #888; font-size: 0.75rem;">頁面內容</div>
    </div>
  </div>
  <div style="display: flex; align-items: center; font-size: 1.8rem; color: #666; padding-top: 90px;">→</div>
  <div>
    <div style="font-weight: bold; margin-bottom: 0.5rem; text-align: center; color: #444;">滾輪滾動後（其位置仍不變）</div>
    <div style="position: relative; width: 160px; height: 210px; border: 2px solid #888; background: #fff; overflow: hidden;">
      <div style="position: absolute; top: 12px; right: 12px; width: 48px; height: 48px; background: #ee9b9b; border: 2px solid #c04040; z-index: 2;"></div>
      <div style="height: 170px; background: #e8f4e8; border-bottom: 1px dashed #bbb; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; color: #888; font-size: 0.75rem;">（內容已往上捲）</div>
    </div>
  </div>
</div>

<!--
我們看捲動前後的對比。

左邊是捲動前，粉紅色的 `fixed` 方塊在視窗右上角。右邊是捲動後，綠色的頁面內容已經往上移了一大段，但粉紅色的方塊還是停在視窗的同一個位置。

這就是 `fixed` 的特性：它只看視窗，不管頁面捲到哪裡。
-->

---

# position: relative & absolute — 父子關係定錨

`relative` 與 `absolute` **搭配使用**，讓子標籤在父標籤範圍內進行定位：

| 角色 | CSS 設定 | 說明 |
| --- | --- | --- |
| 父標籤 | `position: relative` | 建立定位基準，本身位置不移動 |
| 子標籤 | `position: absolute` | 在父標籤區域內進行定錨 |

```html
<div class="top">
  <div class="topContent"></div>
</div>
```

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 標籤 <code>topContent</code> 被 <code>top</code> 包住，即形成父子關係：父 → <code>top</code>，子 → <code>topContent</code>
</div>

<!--
接下來是一組要搭配使用的定位：`relative` 和 `absolute`。

很多初學者會單獨使用 `absolute`，結果元素跑到意想不到的地方。原因是沒有指定定位的「基準點」。

標準的用法是：在父元素寫 `position: relative`，宣告「我是定位的基準，但我自己的位置不變」；在子元素寫 `position: absolute`，宣告「我要在父元素的範圍內定位」。

這樣子元素就會以父元素為基準，不會跑到外面去。在 HTML 裡，只要子元素被父元素包住，就形成這樣的父子關係。
-->

---

# position: relative & absolute — CSS 範例

```css
.top {
  width: 100vw;
  height: 110vh;
  position: relative;
}
```

```css
.topContent {
  width: 100px;
  height: 100px;
  background-color: #ee9b9b;
  position: absolute;
  top: 5%;
  right: 1%;
}
```

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 滾動頁面時，<code>absolute</code> 元素的位置會跟著父標籤移動（非固定在視窗）
</div>

<!--
我們看 CSS 的寫法。

父元素 `.top` 設定 `position: relative`。子元素 `.topContent` 設定 `position: absolute`，再加上 `top: 5%` 和 `right: 1%`。

意思是：子元素要在父元素裡，距離父元素上緣 5%、右邊 1% 的位置。

跟 `fixed` 不同的是，捲動頁面時，父元素移動，子元素也會跟著一起移動，不會固定在視窗上。
-->

---

# position: relative & absolute — 示意圖

`absolute` 元素釘在父標籤的某一位置，滾動時**跟著父標籤移動**：

<div style="display: flex; gap: 3rem; justify-content: center; align-items: flex-start; margin-top: 1.2rem;">
  <div>
    <div style="font-weight: bold; margin-bottom: 0.5rem; text-align: center; color: #444;">滾輪滾動前</div>
    <div style="position: relative; width: 160px; height: 210px; border: 2px solid #888; background: #fff; overflow: hidden;">
      <div style="position: absolute; top: 12px; right: 12px; width: 48px; height: 48px; background: #ee9b9b;"></div>
      <div style="height: 90px; background: #e8f4e8; display: flex; align-items: center; justify-content: center; color: #888; font-size: 0.75rem;">父標籤範圍</div>
    </div>
  </div>
  <div style="display: flex; align-items: center; font-size: 1.8rem; color: #666; padding-top: 90px;">→</div>
  <div>
    <div style="font-weight: bold; margin-bottom: 0.5rem; text-align: center; color: #444;">滾輪滾動後（跟著父層移動）</div>
    <div style="position: relative; width: 160px; height: 210px; border: 2px solid #888; background: #fff; overflow: hidden;">
      <div style="position: absolute; top: -40px; right: 12px; width: 48px; height: 48px; background: #ee9b9b;"></div>
      <div style="height: 210px; background: #e8f4e8; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; color: #888; font-size: 0.75rem;">（父標籤已往上捲動）</div>
    </div>
  </div>
</div>

<!--
看這張示意圖就很清楚了。

粉紅色的 `absolute` 方塊，固定在綠色父元素範圍的右上角。往下捲動時，父元素整個往上移，粉紅色方塊也跟著往上移。

這就是 `absolute` 和 `fixed` 最大的差別：`fixed` 以瀏覽器視窗為基準；`absolute` 則以最近一個有設定定位的祖先元素為基準，通常就是它的父元素。
-->

---

# 小節練習 — Position

請用 `relative` + `absolute` 做出**右上角通知徽章**效果：

```html
<div class="icon-wrapper">
  <div class="icon">🔔</div>
  <span class="badge">3</span>
</div>
```

| 元素 | 要求 |
| --- | --- |
| `.icon-wrapper` | `60px × 60px`，定位基準（relative） |
| `.icon` | 文字大小 `2rem` |
| `.badge` | `20px × 20px`，圓形（`border-radius: 50%`），背景紅色，白字，釘在右上角 |

<!--
我們用一個練習，做出常見的右上角通知徽章。

外層的 `.icon-wrapper` 寬高 60 像素，作為定位基準；裡面有一個鈴鐺圖示，以及一個紅色的圓形徽章，徽章要固定在右上角。

想一想，父元素和徽章分別要設定哪一種 position？

我們先暫停一下，自己動手試試看。
-->

---

# 小節練習 — Position — 參考答案（HTML + 父層）

```html
<div class="icon-wrapper">
  <div class="icon">🔔</div>
  <span class="badge">3</span>
</div>
```

```css
.icon-wrapper {
  position: relative;    /* 定位基準 */
  width: 60px;
  height: 60px;
  display: inline-block; /* 橫排 + 可設尺寸，不撐滿整行 */
}

.icon { font-size: 2rem; }
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>inline-block</code>：讓父容器可設 60×60 尺寸，同時不佔滿整行
</div>

<!--
我們先看答案的父層部分。

`.icon-wrapper` 設定 `position: relative`，作為徽章的定位基準，寬高各 60 像素。

這裡還加了 `display: inline-block`。因為我們希望它能設定寬高，又不想讓它撐滿整行，這正是剛才學到的 `inline-block` 的使用時機。
-->

---

# 小節練習 — Position — 參考答案（徽章）

```css
.badge {
  position: absolute; /* 子元素釘在父層內 */
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%; /* 正方形 → 圓形（寬高各半） */
  background-color: red;
  color: white;
  font-size: 0.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>父 relative + 子 absolute</b> 是通知徽章的萬用組合<br/>
✅ <code>border-radius: 50%</code> 做圓形；<code>border-radius: 999px</code> 做膠囊形
</div>

<!--
接著看徽章的部分。

`.badge` 設定 `position: absolute`，再用 `top: 0` 和 `right: 0`，把它固定在父元素的右上角。寬高各 20 像素，搭配 `border-radius: 50%`，正方形就會變成圓形。最後用 flex 加上兩個置中，讓數字在圓形正中央。

父元素 `relative` 加子元素 `absolute`，是通知徽章的標準做法。我們平常在通訊軟體或信箱看到的右上角紅色數字，大多都是這樣做出來的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# z-index
# 堆疊順序

<!--
學會定位之後，元素開始互相重疊，就會遇到一個問題：為什麼按鈕被圖片蓋住了？這時候就需要 `z-index`。
-->

---

# z-index — 堆疊順序

`z-index` 設定元素的**前後堆疊順序**，數值越高越前面：

- 可設為負數（元素會疊在其他元素後方）
- **只對有設定 `position` 的元素有效**
- 注意：`position: relative` 的父層本身無法移動

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <div style="position: relative; width: 240px; height: 170px;">
    <div style="position: absolute; top: 0; left: 0; width: 110px; height: 110px; background: #4472C4; z-index: 1; display: flex; align-items: flex-start; padding: 6px; color: white; font-weight: bold; font-size: 0.9rem;">z-index:1</div>
    <div style="position: absolute; top: 25px; left: 50px; width: 110px; height: 110px; background: #ED7D31; z-index: 2; display: flex; align-items: flex-start; padding: 6px; color: white; font-weight: bold; font-size: 0.9rem;">z-index:2</div>
    <div style="position: absolute; top: 50px; left: 100px; width: 110px; height: 110px; background: #7030A0; z-index: 3; display: flex; align-items: flex-start; padding: 6px; color: white; font-weight: bold; font-size: 0.9rem;">z-index:3</div>
  </div>
</div>

<!--
`z-index` 控制元素的前後堆疊順序，也就是深度方向的位置。數值越大，就越靠前面。

看右邊的圖，`z-index` 是 3 的紫色方塊在最上面，壓住了 2 的橘色，和 1 的藍色。數值也可以設成負數，讓元素疊到其他元素後面。

這裡有兩個重要的規則。第一，`z-index` 只對有設定 position 的元素有效。如果元素沒有設定定位，就算設 9999 也不會有作用。第二，子元素的層級會受到父元素限制，如果父元素的層級比較低，子元素設得再高，也沒辦法蓋過父元素外面的其他元素。
-->

---

# 小節練習 — z-index

以下三個 `div` 互相重疊，請設定 `z-index` 讓**綠色**在最上層、**藍色**在中間、**紅色**在最底層：

```css
.red   { position: absolute; top: 0;   left: 0;   width: 100px; height: 100px; background: red; }
.blue  { position: absolute; top: 30px; left: 30px; width: 100px; height: 100px; background: blue; }
.green { position: absolute; top: 60px; left: 60px; width: 100px; height: 100px; background: green; }
```

每個 class 需加上多少 `z-index`？

<!--
我們來做一個小練習。

三個方塊都已經設定了 `position: absolute`，而且互相重疊。請加上 `z-index`，讓綠色在最上層、藍色在中間、紅色在最底層。

每個 class 要設定多少？我們先暫停一下，自己想想看。
-->

---

# 小節練習 — z-index — 參考答案

```css
.red   { /* ... */  z-index: 1; }
.blue  { /* ... */  z-index: 2; }
.green { /* ... */  z-index: 3; }
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ 數值大 = 越前面；三個值只要維持相對大小關係即可（<code>1/2/3</code> 或 <code>10/20/30</code> 效果相同）<br/>
⚠️ <b>z-index 兩大鐵律：</b> ① 必須搭配 <code>position</code>（非 static）才生效　② 父層 z-index 決定上限，小孩再高也有天花板
</div>

<!--
我們來看答案。

紅色設 1，藍色設 2，綠色設 3。數字越大越前面，而且只要維持相對的大小關係就好，用 10、20、30 也是一樣的效果。

實務上不建議隨手寫 9999 這種很大的數字。比較好的做法是用 10、20、30，或 100、200、300 這種有間隔的數字，之後要在中間插入新的層級也比較方便。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 後蓋前觀念
# CSS 優先權

<!--
最後，我們深入了解 CSS 的兩個底層規則：後蓋前，以及優先權。
-->

---

# 後蓋前觀念

在 CSS 中，針對**相同標籤**的樣式設定，**後方的規則會覆蓋前方的規則**：

```css
h1 { color: red; }
h1 { color: blue; }
```

<div style="display: flex; align-items: center; gap: 1.5rem; margin-top: 0.8rem;">
  <div style="padding: 6px 16px; background: #f5f5f5; border-radius: 4px; font-size: 0.85rem; font-family: monospace;">
    color: red → color: blue（後方覆蓋）
  </div>
  <div style="font-size: 1.5rem; color: #666;">→</div>
  <div style="font-size: 2rem; font-weight: bold; color: blue;">XXX</div>
</div>

以這個 `h1` 標籤為例：

```html
<h1 class="x1">XXX</h1>
```

當兩條規則都以**標籤名稱（`h1`）**為選擇器時，後方規則生效。

<!--
先複習「後蓋前」。

這裡對 `h1` 寫了兩條規則，第一條是紅色，第二條是藍色。兩條規則用的都是同一個標籤選擇器，優先權相同，所以瀏覽器採用寫在後面的那一條，最後 `h1` 會是藍色。

這是最基本的情況：優先權一樣時，後面的會蓋掉前面的。
-->

---

# 後蓋前觀念 — class 選擇器

若指定 `.class` 名稱，**不會受後方標籤設定的樣式影響**：

```css
.x1 { color: red; }
h1  { color: blue; }
```

<div style="display: flex; align-items: center; gap: 1.5rem; margin-top: 0.8rem;">
  <div style="padding: 6px 16px; background: #f5f5f5; border-radius: 4px; font-size: 0.85rem; font-family: monospace;">
    .x1 → class 選擇器優先權高於標籤選擇器
  </div>
  <div style="font-size: 1.5rem; color: #666;">→</div>
  <div style="font-size: 2rem; font-weight: bold; color: red;">XXX</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 CSS 選擇器優先權（Specificity）由高至低：<br/>
<code>id (#id)</code> &gt; <code>class (.class)</code> &gt; <code>標籤 (h1, div)</code><br/>
class 選擇器優先權高，不會被後方的標籤選擇器覆蓋
</div>

<!--
但如果用的是不同的選擇器呢？

這裡先寫了 `.x1` 是紅色，後面又寫了 `h1` 是藍色，而這個 `h1` 身上有 `x1` 這個 class。照後蓋前，應該是藍色才對，但結果卻是紅色。

原因是 CSS 有一套優先權的計分規則。我們可以簡單記成：id 選擇器 100 分，class 選擇器 10 分，標籤選擇器 1 分。分數高的會勝出，不管寫在哪裡。

所以 class 的 10 分贏過標籤的 1 分。之後如果遇到樣式不照順序生效，可以先檢查一下選擇器的優先權。
-->

---

# 後蓋前小注意（一）

- **ID**
  - 一般標籤除了設定 `class` 名稱，也會設定 `id` 名稱
  - `id` 普遍用途在於方便 JavaScript 開發時取得指定值
  - `id` 的特性在於**不重複**，偏向功能性開發用途，而非樣式設定

- **樣式鎖定（較不常用）**
  - 在樣式設定中加上 `!important`，即使後方有同標籤的規則，該樣式也**不會被覆蓋**
  - 無必要情況時不添加

```css
h1 { color: red !important; }
h1 { color: blue; }
```

<div style="display: flex; align-items: center; gap: 1.2rem; margin-top: 0.4rem;">
  <div style="font-size: 0.85rem; color: #555;">加了 <code>!important</code> 的 red 不會被 blue 覆蓋 →</div>
  <div style="font-size: 1.8rem; font-weight: bold; color: red;">XXX</div>
</div>

<!--
這裡補充兩件事。

第一是 id。標籤除了 class，也可以設定 id，而且 id 在同一個頁面裡不能重複。實務上 id 通常是給程式抓取元素用的，很少拿來寫樣式。因為 id 的分數很高，用它寫的樣式之後很難被覆蓋。

第二是 `!important`。在樣式值後面加上它，這條規則就會優先於一般的規則。看範例，雖然藍色寫在後面，但紅色加了 `!important`，所以最後是紅色。

不過除非真的必要，不建議使用。一旦用了，之後要覆蓋它，就得用更多 `!important`，最後整個專案會變得很難維護。
-->

---

# 後蓋前小注意（二）

- **語法建議**
  - 接收他人編輯過的網頁時，建議以後蓋前的觀念建立**新的 `.css` 檔案**覆蓋舊檔
  - 避免前人設計的樣式被更動後無法挽回

- **檔案管理**
  - CSS、TS 個別放，共用的放在一起

<!--
最後是兩個實務上的建議。

第一，接手別人寫好的網頁時，如果要修改樣式，不建議直接改原本的 CSS 檔。改壞了很難還原。比較好的做法是新建一個 CSS 檔案，利用後蓋前或更高的優先權去覆蓋舊樣式，原本的檔案保持不動，修改的地方也一目了然。

第二，檔案要分類管理，CSS 和 TypeScript 各自放好，共用的部分統一放在一起。
-->

---

# 小節練習 — CSS 優先權

以下 CSS，`<h2 id="title" class="highlight">標題</h2>` 最終顯示什麼顏色？

```css
h2          { color: gray; }
.highlight  { color: blue; }
#title      { color: green; }
h2          { color: red; }
```

| 選擇器 | 分數 | 順序 |
| --- | --- | --- |
| `h2`（第二條） | 1 | 最後 |
| `.highlight` | 10 | — |
| `#title` | 100 | — |

最終顏色是哪個？

<!--
我們用一個練習，檢查一下對優先權的理解。

這個 `h2` 的 id 是 `title`，class 是 `highlight`。CSS 裡有四條規則：灰色、藍色、綠色，最後還有一條紅色。

最後一條紅色寫在最後面，那最終會是紅色嗎？記住，要先看分數，再看順序。

我們先暫停一下，自己想想看。
-->

---

# 小節練習 — CSS 優先權 — 參考答案

最終顏色：**綠色（`#title { color: green }`）**

| 選擇器 | 分數 | 顏色 | 結果 |
| --- | --- | --- | --- |
| `h2`（第一條） | 1 | gray | ❌ 輸 |
| `h2`（第二條） | 1 | red | ❌ 同分但仍輸 class |
| `.highlight` | 10 | blue | ❌ 輸給 #id |
| `#title` | **100** | green | ✅ 勝出 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ 優先權計分：<b>id（100）&gt; class（10）&gt; 標籤（1）</b>，分數高者勝出，與順序無關<br/>
⚠️ 因此業界避免用 <code>id</code> 寫樣式——分數太高，日後難以被覆蓋
</div>

<!--
答案是綠色。

我們來算分數。兩條 `h2` 是標籤選擇器，只有 1 分；`.highlight` 是 class，10 分；`#title` 是 id，100 分。分數最高的 `#title` 勝出，所以是綠色。

紅色雖然寫在最後面，但分數只有 1 分。後蓋前只在分數相同時才適用。

這題也說明了為什麼實務上避免用 id 寫樣式，因為它的分數太高，之後很難被覆蓋。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 練習
# CSS Practice

<!--
學完了 relative 和 absolute 的父子定位，我們來做一個練習。
-->

---

# 練習 — Position 定位排版
### 任務說明

使用 `position` 屬性，試著做出下方的三層色塊排版：

<div style="display: flex; gap: 3rem; align-items: center; margin-top: 0.8rem;">
  <div style="flex: 1; font-size: 0.9rem;">
    <div style="margin-bottom: 0.5rem; font-weight: bold;">圖形規格：</div>
    <div style="margin-bottom: 0.3rem;">■ <span style="color: #474a4d; font-weight: bold;">深灰色</span>　300px × 300px　<code>#474a4d</code></div>
    <div style="margin-bottom: 0.3rem;">■ <span style="color: #c08020; font-weight: bold;">橘色</span>　　200px × 200px　<code>#f7b977</code></div>
    <div style="margin-bottom: 0.5rem;">■ <span style="color: #028760; font-weight: bold;">綠色</span>　　100px × 100px　<code>#028760</code></div>
    <div class="p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm">
      💡 更改顏色：<code>background-color: 色碼;</code>
    </div>
  </div>
  <div style="flex-shrink: 0;">
    <div style="position: relative; width: 200px; height: 200px; background: #474a4d;">
      <div style="position: absolute; top: 0; right: 0; width: 133px; height: 133px; background: #f7b977;">
        <div style="position: absolute; bottom: 0; left: 0; width: 67px; height: 67px; background: #028760;"></div>
      </div>
    </div>
  </div>
</div>

<!--
這個練習要用 position 做出三層色塊。

最底層是深灰色，300 乘 300 像素；中間是橘色，200 乘 200 像素；最上層是綠色，100 乘 100 像素。

注意它們的位置：橘色要貼在深灰色的右上角，綠色要貼在橘色的左下角。

想一想，HTML 要怎麼安排巢狀結構？每一層又該設定哪一種 position？

我們先暫停一下，自己動手試試看。
-->

---

# 練習 — Position 定位排版
### 解題提示

1. 深灰色為**最外層父標籤**，設定 `position: relative`
2. 橘色為深灰色的子標籤，設定 `position: absolute`，靠右上角（`top: 0; right: 0`）
3. 綠色為橘色的子標籤，設定 `position: absolute`，靠左下角（`bottom: 0; left: 0`）

```css
.black { position: relative; width: 300px; height: 300px; }
.orange { position: absolute; top: 0; right: 0; width: 200px; height: 200px; }
.green  { position: absolute; bottom: 0; left: 0; width: 100px; height: 100px; }
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 記得在 HTML 中建立正確的巢狀結構：<code>black &gt; orange &gt; green</code>
</div>

<!--
我們來看解題提示。

HTML 要一層包一層：深灰色包住橘色，橘色再包住綠色。

深灰色是最外層，設定 `position: relative`，作為定位基準。橘色設定 `position: absolute`，加上 `top: 0` 和 `right: 0`，就會貼在深灰色的右上角。

綠色也設定 `position: absolute`，加上 `bottom: 0` 和 `left: 0`。這裡要注意，綠色的父元素是橘色，而橘色本身也有設定定位，所以綠色會以橘色為基準，貼在橘色的左下角。
-->

---
layout: end
---

# CSS 進階工具完成
### 背景、定位、堆疊，全部就位！

<!--
這一章我們學了幾個掌控版面細節的工具：背景圖片的四個屬性；`display` 的各種值，特別是 `inline-block`；Position 定位，`fixed` 以視窗為基準，`relative` 加 `absolute` 讓子元素在父元素裡定位；`z-index` 控制堆疊順序；以及 CSS 優先權，id 大於 class 大於標籤，分數相同時才是後蓋前。

下一章，我們要進入 JavaScript 的世界。我們下一章見。
-->
