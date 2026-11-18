---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: CSS 樣式編輯
routeAlias: ch10
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
    CSS 樣式編輯
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「互動、排版、套件整合」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學了 CSS 的基礎屬性和 Box Model。這一章，我們要讓網頁更進一步。

現代的網頁不能只是靜態的文字和色塊，它要能回應滑鼠的操作，也要能有彈性地把元素排整齊。實務上，我們還會借助 CSS 框架來加快開發速度。

學完這一章，我們會學會做出滑鼠互動效果、用 Flexbox 排版，並且在 Angular 專案裡裝好 Tailwind CSS。
-->

---
layout: default
---

# Outline

- **CSS 互動 — :hover 與 :active**
- **display: flex — 排列、方向與彈性佔比**
- **Flexbox 對齊 — justify-content、align-items 與 align-self**
- **安裝 Tailwind CSS**
- **練習**

<!--
這一章分成三大部分。第一部分是互動，用 `:hover` 和 `:active` 讓元素回應滑鼠。第二部分是 Flexbox，包括排列方向、彈性佔比和對齊方式，這是現代網頁排版最重要的工具。第三部分是安裝 Tailwind CSS，這是目前業界很熱門的 CSS 框架。最後用一個練習驗收。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# CSS 互動
# :hover 與 :active

<!--
我們先從互動開始。一個好用的網頁，會在使用者操作時，給出即時的視覺回饋。
-->

---

# CSS 互動 — 概念

前端標籤樣式可以設定成**互動式樣式**，根據使用者操作產生不同的視覺回饋：

| 偽類 | 觸發條件 | 說明 |
| --- | --- | --- |
| `.class:hover` | 滑鼠移至標籤 | 滑鼠懸停時的樣式回饋 |
| `.class:active` | 滑鼠點擊時 | 按下滑鼠時的樣式回饋 |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>SCSS 寫法：</b> <code>.class { &amp;:hover { } } }</code>，注意 <code>&amp;:hover</code> 在 SCSS 中算是子層<br/>
💡 搭配 <code>transition</code> 屬性調整互動時間，能大幅提升使用質感
</div>

<!--
CSS 可以根據使用者的操作，切換成不同的樣式，這種寫法叫做「偽類」。

我們可以把它想成觸控感應燈。手靠近時，燈亮起來，這就是 `:hover`，代表滑鼠移到元素上；用力按下去時，燈的顏色又變深，這就是 `:active`，代表滑鼠按下的那一刻。

在 SCSS 裡，我們會寫成 `&:hover`，這個 `&` 代表「元素自己」，所以意思是「當滑鼠移到我身上時，套用裡面的樣式」。

另外，建議搭配 `transition` 屬性。沒有它，顏色會瞬間切換，看起來比較生硬；加上 `transition`，顏色會在設定的時間內慢慢變化，質感會好很多。
-->

---

# :hover — 滑鼠移至標籤

```scss
.topText {
  width: 100px;
  height: 100px;
  transition: 0.8s;
  background-color: aqua;
  &:hover {
    background-color: #888;
  }
}
```

<div style="display: flex; gap: 4rem; margin-top: 0.8rem; align-items: flex-start;">
  <div>
    <div style="margin-bottom: 0.3rem; color: #555;">原本的顏色</div>
    <div style="width: 80px; height: 70px; background: aqua;"></div>
  </div>
  <div>
    <div style="margin-bottom: 0.3rem; color: #555;">滑鼠移至目標標籤時</div>
    <div style="width: 80px; height: 70px; background: #888;"></div>
  </div>
</div>

<!--
我們來看 `:hover` 的範例。

這裡定義了一個 `.topText` 方塊，背景是水藍色，並設定 `transition: 0.8s`。在大括號裡面，寫了 `&:hover`，把背景改成灰色。

結果是，滑鼠移到方塊上時，背景會在 0.8 秒內，從水藍色慢慢變成灰色；滑鼠移開，又會慢慢變回來。

實務上有一個原則：可以點擊的按鈕和連結，都應該加上 `:hover` 效果。如果滑鼠移過去完全沒有反應，使用者很難判斷這裡能不能點。
-->

---

# :active — 滑鼠點擊標籤

```scss
.topText {
  width: 100px;
  height: 100px;
  transition: 0.8s;
  background-color: aqua;
  &:active {
    background-color: #333;
  }
}
```

<div style="display: flex; gap: 4rem; margin-top: 0.8rem; align-items: flex-start;">
  <div>
    <div style="margin-bottom: 0.3rem; color: #555;">原本的顏色</div>
    <div style="width: 80px; height: 70px; background: aqua;"></div>
  </div>
  <div>
    <div style="margin-bottom: 0.3rem; color: #555;">滑鼠點擊目標標籤時</div>
    <div style="width: 80px; height: 70px; background: #333;"></div>
  </div>
</div>

<!--
另一個常用的偽類是 `:active`，代表滑鼠「按下去、還沒放開」的那一刻。

這裡的寫法一樣，在 `&:active` 裡把背景改成深灰色。通常 `:active` 的顏色會比 `:hover` 更深一點，模擬按鈕被按下去的感覺。

要注意的是，`transition` 的時間不要設太長。按下去要等很久才變色，使用者會覺得網頁反應很慢。
-->

---

# 小節練習 — CSS 互動

請為以下按鈕寫 SCSS，達成：
- 預設：背景 `#3498db`、白色文字
- `:hover`：背景變 `#2980b9`（深一點），過渡時間 `0.3s`
- `:active`：背景變 `#1a5276`（更深）

```html
<button class="my-btn">點我</button>
```

<!--
我們用一個練習，把 `:hover` 和 `:active` 都用上。

請幫這顆按鈕寫 SCSS：預設是藍色背景、白色文字；滑鼠移上去變深一點的藍色，過渡時間 0.3 秒；按下去時再變得更深。

想一想，`transition` 應該寫在哪裡？寫在原本的樣式裡，還是寫在 `:hover` 裡面？

我們先暫停一下，自己動手試試看。
-->

---

# 小節練習 — CSS 互動 — 參考答案

```scss
.my-btn {
  background-color: #3498db;
  color: white;
  padding: 8px 20px;
  border: none;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #2980b9;
  }

  &:active {
    background-color: #1a5276;
  }
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>重點：</b> <code>transition</code> 要寫在<b>原始狀態</b>（不是寫在 :hover 裡），這樣進出都有動畫效果<br/>
✅ <code>cursor: pointer</code> 不要忘記！告訴使用者「這是可點擊的按鈕」
</div>

<!--
我們來看答案。

`.my-btn` 先設定藍底、白字、內距、去掉邊框，以及手指游標。接著在 `&:hover` 和 `&:active` 裡分別設定兩種深淺的藍色。

回答剛才的問題：`transition` 要寫在原本的樣式裡。如果寫在 `:hover` 裡面，滑鼠移進去時有動畫，但移開的瞬間 `:hover` 就消失了，`transition` 也跟著不見，顏色就會一下子跳回去。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# display: flex
# 排列、方向與彈性佔比

<!--
互動效果學完了，接下來進入這一章的重點，也是現代網頁排版最重要的工具：Flexbox。
-->

---

# display: flex — 介紹

`display: flex` 讓容器擁有**主軸**與**次軸**，並改變子元素的排列方式：

- 標籤元素都變成**區塊元素（Block）**
- 主軸（Main Axis）：預設由左往右 →
- 次軸（Cross Axis）：與主軸垂直，由上往下 ↓

<div style="display: flex; justify-content: center; gap: 3rem; align-items: center; margin-top: 1.2rem;">
  <div style="position: relative; width: 220px; height: 130px; background: #4472C4; overflow: visible; flex-shrink: 0;">
    <div style="position: absolute; top: 50%; left: 0; right: -22px; height: 3px; background: red; transform: translateY(-1.5px);">
      <div style="position: absolute; right: -10px; top: -5px; border-left: 12px solid red; border-top: 6px solid transparent; border-bottom: 6px solid transparent;"></div>
    </div>
    <div style="position: absolute; left: 50%; top: 0; bottom: -22px; width: 3px; background: #22c55e; transform: translateX(-1.5px);">
      <div style="position: absolute; bottom: -10px; left: -5px; border-top: 12px solid #22c55e; border-left: 6px solid transparent; border-right: 6px solid transparent;"></div>
    </div>
  </div>
  <div>
    <div style="color: red; font-weight: bold; margin-bottom: 0.8rem;">→ 主軸（Main Axis）</div>
    <div style="color: #16a34a; font-weight: bold;">↓ 次軸（Cross Axis）</div>
  </div>
</div>

<!--
Flexbox 是怎麼運作的？我們先用一個比喻。

想像容器是一條超市的收銀輸送帶。在容器身上寫 `display: flex`，它就變成一條輸送帶，裡面的子元素會依序排在帶子上。

輸送帶前進的方向，叫做「主軸」，預設是由左往右；和主軸垂直的方向，叫做「次軸」，預設是由上往下。

在有 Flexbox 之前，要讓兩個區塊並排，得用比較麻煩的寫法，還很容易跑版。現在只要在容器上寫一行 `display: flex`，子元素就會自動並排。

這裡要特別注意：`display: flex` 是寫在「外層的容器」上，不是寫在子元素上。
-->

---

# display: flex — 主次軸比較

<div style="display: flex; gap: 3rem; margin-top: 1rem; justify-content: center;">
  <div>
    <div style="font-weight: bold; margin-bottom: 0.4rem;">無 display: flex</div>
    <div style="color: #16a34a; font-size: 0.9rem; margin-bottom: 0.4rem;">主軸 ↓ 由上往下（無次軸）</div>
    <div style="width: 130px; border: 2px solid #ccc;">
      <div style="background: aqua; height: 70px;"></div>
      <div style="background: #e8a090; height: 55px;"></div>
    </div>
  </div>
  <div>
    <div style="font-weight: bold; margin-bottom: 0.4rem;">有 display: flex</div>
    <div style="color: red; font-size: 0.9rem; margin-bottom: 0.4rem;">主軸 → 由左往右｜次軸 ↓</div>
    <div style="display: flex; border: 2px solid #ccc; width: 230px; height: 70px;">
      <div style="background: aqua; flex: 1;"></div>
      <div style="background: #e8a090; flex: 1;"></div>
    </div>
  </div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 參考文件：developer.mozilla.org/zh-TW/docs/Web/CSS/CSS_flexible_box_layout
</div>

<!--
我們直接看對比。

左邊沒有加 `display: flex`，兩個區塊元素各佔一整行，由上往下排列。

右邊只在外層的灰色容器加上 `display: flex`，兩個子元素就變成左右並排，而且高度會自動延伸到一樣高。

在現代前端開發中，大部分的排版都會用到 Flexbox，它是一定要學會的工具。下方也附上 MDN 的參考文件，之後可以查詢更多細節。
-->

---
zoom: 0.96
---

# flex-direction — 主軸方向

`flex-direction` 決定子元素的**排列方向**（主軸方向）：

| 值 | 主軸方向 | 說明 |
| --- | --- | --- |
| `row` | → 左到右 | **預設值**，子元素橫排 |
| `row-reverse` | ← 右到左 | 橫排但順序反轉 |
| `column` | ↓ 上到下 | 子元素直排 |
| `column-reverse` | ↑ 下到上 | 直排但順序反轉 |

<div style="display: flex; gap: 2rem; margin-top: 1rem;">
  <div style="flex: 1;">
    <div style="font-weight: bold; margin-bottom: 0.4rem;">row（預設）</div>
    <div style="display: flex; flex-direction: row; border: 2px solid #888; padding: 6px; gap: 4px; height: 60px; align-items: center;">
      <div style="background: aqua; width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">1</div>
      <div style="background: #e8a090; width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">2</div>
      <div style="background: #90d090; width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">3</div>
    </div>
  </div>
  <div style="flex: 1;">
    <div style="font-weight: bold; margin-bottom: 0.4rem;">column</div>
    <div style="display: flex; flex-direction: column; border: 2px solid #888; padding: 6px; gap: 4px; width: 60px;">
      <div style="background: aqua; height: 32px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">1</div>
      <div style="background: #e8a090; height: 32px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">2</div>
      <div style="background: #90d090; height: 32px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">3</div>
    </div>
  </div>
</div>

<!--
`flex-direction` 決定主軸的方向，也就是輸送帶要往哪裡走。

看表格，預設值是 `row`，子元素由左往右橫排。改成 `column`，輸送帶就立起來，子元素變成由上往下直排。

另外還有兩個加上 reverse 的值，會把順序反過來，我們下一頁看。
-->

---

# flex-direction — row-reverse & column-reverse

<div style="display: flex; gap: 2rem; margin-top: 1rem;">
  <div style="flex: 1;">
    <div style="font-weight: bold; margin-bottom: 0.4rem;">row-reverse</div>
    <div style="display: flex; flex-direction: row-reverse; border: 2px solid #888; padding: 6px; gap: 4px; height: 60px; align-items: center;">
      <div style="background: aqua; width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">1</div>
      <div style="background: #e8a090; width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">2</div>
      <div style="background: #90d090; width: 44px; height: 44px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">3</div>
    </div>
    <div style="font-size: 0.8rem; color: #555; margin-top: 0.3rem;">← 從右到左，順序反轉</div>
  </div>
  <div style="flex: 1;">
    <div style="font-weight: bold; margin-bottom: 0.4rem;">column-reverse</div>
    <div style="display: flex; flex-direction: column-reverse; border: 2px solid #888; padding: 6px; gap: 4px; width: 60px;">
      <div style="background: aqua; height: 32px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">1</div>
      <div style="background: #e8a090; height: 32px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">2</div>
      <div style="background: #90d090; height: 32px; display:flex; align-items:center; justify-content:center; font-size:0.8rem;">3</div>
    </div>
    <div style="font-size: 0.8rem; color: #555; margin-top: 0.3rem;">↑ 從下到上，順序反轉</div>
  </div>
</div>

```css
.container {
  display: flex;
  flex-direction: column; /* row | row-reverse | column | column-reverse */
}
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>flex-direction: column</code> 常用於「讓多個 flex row 上下堆疊」的版型
</div>

<!--
`row-reverse` 會由右往左排，`column-reverse` 則是由下往上排，順序都會反過來。

這兩個值比較少用，但在某些情境很方便，例如聊天室的訊息列表，最新的訊息要出現在最下面。

要注意，reverse 只改變畫面上的顯示順序，HTML 裡元素的順序並沒有改變。

實務上，`flex-direction: column` 比較常用，例如把好幾個橫排的區塊，由上往下堆疊起來。
-->

---

# flex: 1 — 彈性佔比

`flex` 是三個屬性的縮寫，控制子元素如何**分配剩餘空間**：

```css
flex: 1;
/* 等同於 */
flex-grow: 1;    /* 有多餘空間時，我要分 */
flex-shrink: 1;  /* 空間不夠時，我可以縮 */
flex-basis: 0%;  /* 起始大小從 0 開始計算 */
```

| 值 | 效果 |
| --- | --- |
| `flex: 1` | 等比分配剩餘空間（最常用） |
| `flex: 2` | 佔的空間是 `flex: 1` 的兩倍 |
| `flex: none` | 不伸不縮，維持內容原本大小 |

<!--
接下來看 `flex`，它控制子元素如何分配容器裡剩下的空間。

`flex` 其實是三個屬性的縮寫：`flex-grow` 決定有多餘空間時要不要分，`flex-shrink` 決定空間不夠時能不能縮，`flex-basis` 決定起始的大小。實務上我們通常直接寫縮寫。

可以想成大家一起分蛋糕。三個人都寫 `flex: 1`，就各拿三分之一；如果其中一個人寫 `flex: 2`，他就拿兩份，也就是一半，另外兩人各拿四分之一。

如果寫 `flex: none`，代表不伸也不縮，維持內容原本的大小。
-->

---

# flex: 1 — 視覺說明

容器寬 **300px**，子元素使用不同 `flex` 值：

<div style="display: flex; flex-direction: column; gap: 1.2rem; margin-top: 0.8rem;">
  <div>
    <div style="font-size: 0.85rem; margin-bottom: 0.3rem; color: #555;">全部 flex: 1（等分）</div>
    <div style="display: flex; width: 300px; height: 44px; border: 2px solid #888; gap: 2px;">
      <div style="flex: 1; background: #93c5fd; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">flex:1</div>
      <div style="flex: 1; background: #93c5fd; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">flex:1</div>
      <div style="flex: 1; background: #93c5fd; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">flex:1</div>
    </div>
  </div>
  <div>
    <div style="font-size: 0.85rem; margin-bottom: 0.3rem; color: #555;">中間 flex: 2（佔兩倍）</div>
    <div style="display: flex; width: 300px; height: 44px; border: 2px solid #888; gap: 2px;">
      <div style="flex: 1; background: #86efac; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">flex:1</div>
      <div style="flex: 2; background: #fca5a5; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">flex:2</div>
      <div style="flex: 1; background: #86efac; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">flex:1</div>
    </div>
  </div>
  <div>
    <div style="font-size: 0.85rem; margin-bottom: 0.3rem; color: #555;">左側 flex: none（固定內容寬），其餘等分</div>
    <div style="display: flex; width: 300px; height: 44px; border: 2px solid #888; gap: 2px;">
      <div style="flex: none; width: 80px; background: #fde68a; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">none</div>
      <div style="flex: 1; background: #93c5fd; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">flex:1</div>
      <div style="flex: 1; background: #93c5fd; display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">flex:1</div>
    </div>
  </div>
</div>

<!--
我們看三種情境的實際效果。

第一排三個都是 `flex: 1`，平均分成三等份。第二排中間是 `flex: 2`，它的寬度是旁邊的兩倍。

第三排左邊是 `flex: none`，維持內容的寬度，右邊兩個 `flex: 1` 平分剩下的空間。這個組合在實務上很常用，例如左邊是固定寬度的側邊欄，右邊是會隨視窗伸縮的內容區。
-->

---

# 小節練習 — display: flex

請讓以下三個色塊並排在同一行（不使用 `width`），父容器高度 `80px`：

```html
<div class="container">
  <div class="box red"></div>
  <div class="box blue"></div>
  <div class="box green"></div>
</div>
```

| 元素 | 樣式 |
| --- | --- |
| `.container` | 啟用 flex，高度 `80px`，`gap: 8px` |
| `.box` | 寬 `60px`、高 `60px` |
| `.red` / `.blue` / `.green` | 各自背景色 |

<!--
我們用一個練習熟悉 `display: flex`。

請讓這三個色塊並排在同一行。容器要啟用 flex，高度 80 像素，並且用 `gap` 設定 8 像素的間距；每個色塊寬高都是 60 像素，背景色各自不同。

想一想，`display: flex` 要寫在哪一個元素上？

我們先暫停一下，自己動手試試看。
-->

---

# 小節練習 — display: flex — 參考答案

```css
.container {
  display: flex;
  height: 80px;
  gap: 8px;
}

.box {
  width: 60px;
  height: 60px;
}

.red   { background-color: #e74c3c; }
.blue  { background-color: #3498db; }
.green { background-color: #2ecc71; }
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>重點：</b> <code>display: flex</code> 下在<b>父容器</b>，不是子元素；<code>gap</code> 是 flex 子元素之間的間距，比用 margin 更簡潔
</div>

<!--
我們來看答案。

`display: flex` 寫在父容器 `.container` 上，三個色塊就會自動並排。

這裡用了 `gap: 8px` 來設定子元素之間的間距。以前我們可能會在每個子元素加上 margin，但 `gap` 寫在容器上一次搞定，而且不會在最旁邊多出空白。現代瀏覽器都支援，推薦大家使用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Flexbox 對齊
# justify-content / align-items / align-self

<!--
讓子元素並排只是第一步，接下來我們要學怎麼控制它們的對齊方式。
-->

---

# 對齊 — 概念

`display: flex` 啟用後，可以搭配以下兩個屬性控制對齊方式：

| 屬性 | 軸向 | 說明 |
| --- | --- | --- |
| `justify-content` | **主軸** | 控制子元素在主軸方向上的對齊方式 |
| `align-items` | **次軸** | 控制子元素在次軸方向上的對齊方式 |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>vertical-align</b>：只適用於行內元素，以基準線方式對齊；用於 <code>img</code> 標籤可取消預設底部留白
</div>

<!--
啟用 `display: flex` 之後，有兩個屬性負責對齊。

`justify-content` 控制主軸方向的對齊，預設也就是水平方向；`align-items` 控制次軸方向的對齊，預設也就是垂直方向。

這兩個名稱很長，初學者很容易搞混。分享一個記法：「J 橫 A 直」。J 的尾巴是橫向勾過去的，所以 `justify-content` 管橫向的主軸；A 像一座直立的塔，所以 `align-items` 管直向的次軸。

另外下方提到 `vertical-align`，它只適用於行內元素，跟 Flexbox 是不同的東西，常用來消除圖片底部預設的空白。
-->

---

# justify-content — 主軸對齊

| 常用值 | 效果 |
| --- | --- |
| `flex-start` | 靠主軸起點（**預設**，靠左） |
| `flex-end` | 靠主軸終點（靠右） |
| `center` | 主軸置中 |
| `space-between` | 兩端貼齊，中間平均留空 |
| `space-around` | 每個 item 左右等距留空 |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>最常用：</b> <code>center</code>（置中）與 <code>space-between</code>（導覽列左右分開）
</div>

<!--
我們先看 `justify-content` 的常用值。

`flex-start` 是預設值，子元素靠主軸的起點，也就是靠左；`flex-end` 靠右；`center` 置中。

`space-between` 會讓第一個和最後一個子元素貼齊兩端，中間平均留空。這在做導覽列時很常用，例如左邊放 Logo，右邊放按鈕，中間的空間自動撐開。

`space-around` 則是每個子元素的左右兩邊，都留下相同的空間。
-->

---

# justify-content — 視覺對比

<div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 0.8rem;">
  <div>
    <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">flex-start（預設）</div>
    <div style="display: flex; border: 2px solid #888; height: 48px; align-items: center; justify-content: flex-start; gap: 4px; padding: 0 4px;">
      <div style="background: #93c5fd; width: 60px; height: 34px;"></div>
      <div style="background: #fca5a5; width: 60px; height: 34px;"></div>
      <div style="background: #86efac; width: 60px; height: 34px;"></div>
    </div>
  </div>
  <div>
    <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">center</div>
    <div style="display: flex; border: 2px solid #888; height: 48px; align-items: center; justify-content: center; gap: 4px;">
      <div style="background: #93c5fd; width: 60px; height: 34px;"></div>
      <div style="background: #fca5a5; width: 60px; height: 34px;"></div>
      <div style="background: #86efac; width: 60px; height: 34px;"></div>
    </div>
  </div>
  <div>
    <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">space-between</div>
    <div style="display: flex; border: 2px solid #888; height: 48px; align-items: center; justify-content: space-between; padding: 0 4px;">
      <div style="background: #93c5fd; width: 60px; height: 34px;"></div>
      <div style="background: #fca5a5; width: 60px; height: 34px;"></div>
      <div style="background: #86efac; width: 60px; height: 34px;"></div>
    </div>
  </div>
  <div>
    <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">space-around</div>
    <div style="display: flex; border: 2px solid #888; height: 48px; align-items: center; justify-content: space-around;">
      <div style="background: #93c5fd; width: 60px; height: 34px;"></div>
      <div style="background: #fca5a5; width: 60px; height: 34px;"></div>
      <div style="background: #86efac; width: 60px; height: 34px;"></div>
    </div>
  </div>
</div>

<!--
這張圖把四種值放在一起對比。

`flex-start` 全部靠左；`center` 全部聚在中間；`space-between` 兩端貼齊，中間的空隙平均分配；`space-around` 每個方塊兩側都有相同的空間，所以最旁邊的空隙會是中間空隙的一半。
-->

---

# align-items — 次軸對齊

| 常用值 | 效果 |
| --- | --- |
| `stretch` | 延伸填滿容器高度（**預設**） |
| `flex-start` | 靠上 |
| `flex-end` | 靠下 |
| `center` | 垂直置中 |

<div style="display: flex; flex-direction: column; gap: 0.8rem; margin-top: 0.8rem;">
  <div style="display: flex; gap: 1.5rem;">
    <div style="flex: 1;">
      <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">flex-start（靠上）</div>
      <div style="display: flex; border: 2px solid #888; height: 90px; align-items: flex-start; gap: 4px; padding: 4px;">
        <div style="background: #93c5fd; width: 50px; height: 50px;"></div>
        <div style="background: #fca5a5; width: 50px; height: 30px;"></div>
        <div style="background: #86efac; width: 50px; height: 40px;"></div>
      </div>
    </div>
    <div style="flex: 1;">
      <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">center（垂直置中）</div>
      <div style="display: flex; border: 2px solid #888; height: 90px; align-items: center; gap: 4px; padding: 4px;">
        <div style="background: #93c5fd; width: 50px; height: 50px;"></div>
        <div style="background: #fca5a5; width: 50px; height: 30px;"></div>
        <div style="background: #86efac; width: 50px; height: 40px;"></div>
      </div>
    </div>
    <div style="flex: 1;">
      <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">flex-end（靠下）</div>
      <div style="display: flex; border: 2px solid #888; height: 90px; align-items: flex-end; gap: 4px; padding: 4px;">
        <div style="background: #93c5fd; width: 50px; height: 50px;"></div>
        <div style="background: #fca5a5; width: 50px; height: 30px;"></div>
        <div style="background: #86efac; width: 50px; height: 40px;"></div>
      </div>
    </div>
  </div>
</div>

<!--
接著看 `align-items`，它控制所有子元素在次軸上的對齊。

預設值是 `stretch`，子元素沒有設定高度時，會自動延伸填滿容器的高度。`flex-start` 靠上，`flex-end` 靠下，`center` 垂直置中。

看下面的圖，三個高度不同的方塊，分別靠上、置中和靠下對齊。

最常用的是 `center`。例如導覽列裡，圖示和文字的高度不一樣，用 `align-items: center` 就能讓它們在垂直方向對齊。
-->

---

# align-self — 單一子元素次軸對齊

`align-self` 讓**個別子元素**覆蓋父容器的 `align-items` 設定：

| 屬性 | 套用對象 | 說明 |
| --- | --- | --- |
| `align-items` | 父容器 | 控制**所有**子元素的次軸對齊 |
| `align-self` | 子元素本身 | 覆蓋父容器設定，只影響**自己** |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>align-self</code> 優先權高於 <code>align-items</code>——父容器廣播全體，子元素可個別反悔
</div>

<!--
`align-items` 是對所有子元素生效。那如果只想讓其中一個子元素有不同的對齊方式呢？這時候就用 `align-self`。

看表格，`align-items` 寫在父容器上，影響所有子元素；`align-self` 寫在子元素自己身上，只影響它自己，並且會覆蓋父容器的設定。

可以想成父容器對全體廣播一個規則，而某個子元素可以單獨提出例外。
-->

---

# align-self — 常用值

| 常用值 | 效果 |
| --- | --- |
| `stretch` | 延伸填滿容器高度（**預設**） |
| `flex-start` | 靠上 |
| `flex-end` | 靠下 |
| `center` | 垂直置中 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 常用值與 <code>align-items</code> 完全相同，差別只在套用對象：<br/>
<code>align-items</code> → 父容器下，影響所有子元素<br/>
<code>align-self</code> → 子元素下，只影響自己
</div>

<!--
`align-self` 的常用值，跟 `align-items` 完全一樣：`stretch` 延伸填滿，是預設值；`flex-start` 靠上；`flex-end` 靠下；`center` 垂直置中。

差別只在於套用的對象：`align-items` 寫在父容器，影響全部；`align-self` 寫在子元素，只影響自己。
-->

---

# align-self — 視覺對比

<div style="display: flex; gap: 1.5rem; margin-top: 0.8rem;">
  <div style="flex: 1;">
    <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">flex-start（靠上）</div>
    <div style="display: flex; border: 2px solid #888; height: 110px; gap: 4px; padding: 4px;">
      <div style="background: #93c5fd; width: 50px; align-self: flex-start; height: 50px; font-size: 0.7rem; padding: 2px;">A</div>
      <div style="background: #fca5a5; width: 50px; height: 50px; font-size: 0.7rem; padding: 2px;">B</div>
      <div style="background: #86efac; width: 50px; height: 50px; font-size: 0.7rem; padding: 2px;">C</div>
    </div>
  </div>
  <div style="flex: 1;">
    <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">center（垂直置中）</div>
    <div style="display: flex; border: 2px solid #888; height: 110px; gap: 4px; padding: 4px;">
      <div style="background: #93c5fd; width: 50px; align-self: center; height: 50px; font-size: 0.7rem; padding: 2px;">A</div>
      <div style="background: #fca5a5; width: 50px; height: 50px; font-size: 0.7rem; padding: 2px;">B</div>
      <div style="background: #86efac; width: 50px; height: 50px; font-size: 0.7rem; padding: 2px;">C</div>
    </div>
  </div>
  <div style="flex: 1;">
    <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">flex-end（靠下）</div>
    <div style="display: flex; border: 2px solid #888; height: 110px; gap: 4px; padding: 4px;">
      <div style="background: #93c5fd; width: 50px; align-self: flex-end; height: 50px; font-size: 0.7rem; padding: 2px;">A</div>
      <div style="background: #fca5a5; width: 50px; height: 50px; font-size: 0.7rem; padding: 2px;">B</div>
      <div style="background: #86efac; width: 50px; height: 50px; font-size: 0.7rem; padding: 2px;">C</div>
    </div>
  </div>
  <div style="flex: 1;">
    <div style="font-size: 0.82rem; color: #555; margin-bottom: 0.2rem;">stretch（延伸，預設）</div>
    <div style="display: flex; border: 2px solid #888; height: 110px; gap: 4px; padding: 4px;">
      <div style="background: #93c5fd; width: 50px; align-self: stretch; font-size: 0.7rem; padding: 2px;">A</div>
      <div style="background: #fca5a5; width: 50px; height: 50px; font-size: 0.7rem; padding: 2px;">B</div>
      <div style="background: #86efac; width: 50px; height: 50px; font-size: 0.7rem; padding: 2px;">C</div>
    </div>
  </div>
</div>

<!--
我們看實際的效果。

這四欄裡，只有 A 方塊設定了不同的 `align-self`，B 和 C 維持預設。第一欄 A 靠上，第二欄 A 垂直置中，第三欄 A 靠下，第四欄 A 延伸填滿整個高度。

再提醒一次，`align-self` 要寫在子元素身上，不是父容器。
-->

---

# 小節練習 — Flexbox 對齊

請做出以下工具列排版，容器 `400px × 120px`：

```html
<div class="toolbar">
  <div class="item item-a">A</div>
  <div class="item item-b">B</div>
  <div class="item item-c">C</div>
</div>
```

<div style="display: flex; justify-content: space-between; align-items: flex-start; width: 360px; height: 100px; background: #f1f5f9; border: 2px solid #ccc; padding: 4px; margin-top: 0.8rem;">
  <div style="width: 52px; height: 52px; background: #3498db; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">A</div>
  <div style="width: 52px; height: 52px; background: #e74c3c; align-self: center; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">B</div>
  <div style="width: 52px; height: 52px; background: #2ecc71; align-self: flex-end; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold;">C</div>
</div>

<!--
我們用一個練習，把三個對齊屬性都用上。

請做出畫面上的工具列：三個方塊 A、B、C 左中右分散排列，而且 A 靠上、B 垂直置中、C 靠下。

想一想，左中右分散用哪個屬性？三個方塊的垂直位置都不一樣，又該怎麼處理？下一頁有詳細的規格。
-->

---

# 小節練習 — Flexbox 對齊（規格）

| 元素 | 要求 |
| --- | --- |
| `.toolbar` | `400px × 120px`，flex，三個 item **左中右均分**，整體靠上 |
| `.item` | `60px × 60px`，背景色自訂 |
| `.item-a` | 靠上（預設，不需額外設定） |
| `.item-b` | 垂直**置中** |
| `.item-c` | 靠下 |

<!--
這頁是詳細的規格。

工具列寬 400 像素、高 120 像素，三個方塊左中右均分，整體預設靠上。每個方塊寬高 60 像素。A 維持預設靠上，B 要垂直置中，C 要靠下。

提示一下，可以先在父容器設定全體靠上，再讓 B 和 C 各自覆蓋。

我們先暫停一下，自己動手試試看。
-->

---

# 小節練習 — Flexbox 對齊 — 參考答案

```css
.toolbar {
  display: flex;
  justify-content: space-between; /* 三個 item 左中右均分 */
  align-items: flex-start;        /* 預設靠上 */
  width: 400px;
  height: 120px;
  background-color: #f1f5f9;
}

.item {
  width: 60px;
  height: 60px;
  background-color: #3498db;
  color: white;
}
```

<!--
我們來看答案的第一部分。

`.toolbar` 啟用 flex，用 `justify-content: space-between` 讓三個方塊左中右分散，再用 `align-items: flex-start` 讓全部預設靠上。

`.item` 設定方塊的寬高和顏色。到這裡，三個方塊都會靠上排列，下一頁再處理 B 和 C。
-->

---

# 小節練習 — Flexbox 對齊 — 參考答案（續）

```css
/* align-self 個別覆蓋父容器的 align-items */
.item-b { align-self: center; }   /* 垂直置中 */
.item-c { align-self: flex-end; } /* 靠下 */
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <code>justify-content: space-between</code> 主軸均分<br/>
✅ <code>align-items: flex-start</code> 設全體靠上預設<br/>
✅ <code>align-self</code> 讓個別子元素覆蓋 — 三個屬性各司其職
</div>

<!--
答案的第二部分，用 `align-self` 個別覆蓋。

`.item-b` 設定 `align-self: center`，垂直置中；`.item-c` 設定 `align-self: flex-end`，靠下。A 不用額外設定，維持父容器的靠上。

整理一下，`justify-content` 負責主軸的分配，`align-items` 設定全體的預設，`align-self` 讓個別子元素例外，三個屬性各自負責一件事。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 安裝 Tailwind CSS
# Tailwind CSS Integration

<!--
學完 Flexbox，最後一部分我們要安裝 Tailwind CSS。順帶一提，這份投影片就是用 Tailwind 寫的。
-->

---

# 什麼是 Tailwind CSS？

Tailwind CSS 是目前最流行的 **Utility-First（原子式）CSS 框架**：

- 提供數千個**單一用途**的小 class，例如 `p-4`（padding）、`flex`（display: flex）
- 直接在 HTML 標籤上組合這些 class，就能拼出完整樣式
- **不需要**自己想 class 名稱、不需要在 `.scss` 檔和 HTML 之間來回跳

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>核心觀念：</b> Tailwind 不給你「做好的按鈕」，而是給你「一盒標準規格的樂高」，讓你自己拼出任何按鈕<br/>
💡 <b>官方網站：</b> <code>tailwindcss.com</code> — 所有 class 都可以在官網搜尋查到
</div>

<!--
Tailwind CSS 是目前很流行的「Utility-First」，也就是原子式的 CSS 框架。

有些框架像調理包，倒出來就能用，但口味很難調整。Tailwind 則像是洗好切好、分裝成小盒的食材，我們還是要自己下鍋，但不用從洗菜開始，而且想做什麼口味都可以。

「原子式」的意思是，每個 class 只做一件小事。例如 `p-4` 只負責內距，`flex` 只負責 `display: flex`。我們把這些小 class 組合起來，直接寫在 HTML 標籤上，就能拼出完整的樣式，不用自己想 class 名稱，也不用在 SCSS 檔和 HTML 之間來回切換。
-->

---

# 為什麼要用 Tailwind？

從零手寫 vs. 使用 Tailwind 的差距：

<div style="display: flex; gap: 2rem; margin-top: 0.8rem;">
  <div style="flex: 1; padding: 1rem; background: #fef3f2; border-radius: 8px; border: 1px solid #fca5a5;">
    <div style="font-weight: bold; margin-bottom: 0.6rem; color: #dc2626;">❌ 從零手寫按鈕</div>
    <pre style="font-size: 0.7rem; margin: 0; line-height: 1.5; color: #374151;">&lt;!-- HTML --&gt;
&lt;button class="my-btn"&gt;送出&lt;/button&gt;
/* 還要跳到 .scss 檔寫 */
.my-btn {
  background-color: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  &amp;:hover { background-color: #2563eb; }
}</pre>
  </div>
  <div style="flex: 1; padding: 1rem; background: #f0fdf4; border-radius: 8px; border: 1px solid #86efac;">
    <div style="font-weight: bold; margin-bottom: 0.6rem; color: #16a34a;">✅ 用 Tailwind</div>
    <pre style="font-size: 0.78rem; margin: 0; line-height: 1.5; color: #374151;">&lt;button class="bg-blue-500 text-white
  px-4 py-2 rounded-md
  hover:bg-blue-600"&gt;
  送出
&lt;/button&gt;</pre>
    <div style="margin-top: 0.8rem; font-size: 0.85rem; color: #374151;">結果完全相同，而且不用開第二個檔案</div>
  </div>
</div>

<!--
我們來比較一下兩種寫法。

左邊是從零手寫，HTML 裡先取一個 class 名稱，再跳到 SCSS 檔，寫背景色、文字色、內距、圓角，還有 hover 效果。右邊用 Tailwind，同樣的效果直接寫在按鈕的 class 裡。

重點不是右邊字比較少，而是「只要看一個檔案」。過了幾個月回來看，左邊看到 `.my-btn`，還得去翻 SCSS 才知道它長什麼樣；右邊看 HTML 就知道是藍底、白字、圓角。

另外還有一個好處：不用再煩惱 class 要取什麼名字。
-->

---

# 兩種 CSS 框架流派

市面上的 CSS 框架分成兩大流派，思路完全不同：

| | 元件式（Component-First） | 原子式（Utility-First） |
| --- | --- | --- |
| 代表 | Bootstrap、Angular Material | **Tailwind CSS** |
| 給你什麼 | 做好的元件 | 標準規格的小工具 |
| 寫法 | `class="btn btn-primary"` | `class="bg-blue-500 px-4 py-2 rounded"` |
| 優點 | 上手最快，一行就有完整按鈕 | 完全自由，做得出任何設計 |
| 缺點 | 想客製化就要跟框架打架 | class 較長，要記一些命名規則 |

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>兩者可以並存：</b>本課程後半段會使用 <b>Angular Material</b>（元件式）處理表格、對話框等複雜元件，同時用 Tailwind 處理排版與間距——這也是業界常見的組合
</div>

<!--
市面上的 CSS 框架，大致分成兩種流派。

左邊是元件式，像 Bootstrap 和 Angular Material，直接提供做好的元件，一行就有完整的按鈕，上手最快，但想客製化時，常常要花力氣去覆蓋原本的樣式。

右邊是原子式，也就是 Tailwind，提供標準規格的小工具，設計上完全自由，缺點是 class 比較長，需要熟悉命名規則。

兩者沒有對錯，而且可以一起用。實務上常見的組合是：表格、對話框這類複雜元件用 Angular Material，排版、間距、顏色用 Tailwind。這門課後半段也會這樣搭配。
-->

---

# Tailwind class 命名規則

Tailwind 的 class 命名非常有規律，記住規則就不用一個一個背：

| 類別 | 格式 | 範例 |
| --- | --- | --- |
| 間距 | `{屬性}-{數字}` | `p-4`（padding: 1rem）、`mt-2`（margin-top: 0.5rem） |
| 顏色 | `{屬性}-{色名}-{深淺}` | `bg-blue-500`、`text-red-600`、`border-gray-300` |
| 尺寸 | `w-` / `h-` | `w-full`（100%）、`h-screen`（100vh）、`w-64` |
| 字級 | `text-{尺寸}` | `text-sm`、`text-lg`、`text-3xl` |
| 圓角 / 陰影 | `rounded-` / `shadow-` | `rounded-md`、`shadow-lg` |
| 互動狀態 | `{狀態}:{class}` | `hover:bg-blue-600`、`active:scale-95` |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>間距數字換算：</b>數字 × <code>0.25rem</code>（= 4px）。所以 <code>p-4</code> 是 16px、<code>p-2</code> 是 8px
</div>

<!--
Tailwind 的 class 很多，但命名非常有規律，不用一個一個背。

間距是「屬性加數字」，數字乘以 4 就是像素，所以 `p-4` 是 16 像素，`mt-2` 是上外距 8 像素。

顏色是「屬性、顏色名稱、深淺」，深淺從 50 到 950，500 是標準色，例如 `bg-blue-500` 是標準的藍色背景。

尺寸、字級、圓角和陰影，也都有對應的前綴。

最方便的是互動狀態，只要在 class 前面加上 `hover:`，例如 `hover:bg-blue-600`，就代表滑鼠移上去時背景變深藍，不用另外寫 SCSS。真的記不起來，也可以到官網搜尋想要的 CSS 屬性。
-->

---
zoom: 0.95
---

# Tailwind 的 Flexbox class

今天前半段學的 Flexbox，在 Tailwind 裡全部都有對應的 class：

<div class="grid grid-cols-2 gap-6 items-center">
<div>

| CSS 寫法 | Tailwind class |
| --- | --- |
| `display: flex` | `flex` |
| `flex-direction: column` | `flex-col` |
| `justify-content: center` | `justify-center` |
| `justify-content: space-between` | `justify-between` |
| `align-items: center` | `items-center` |
| `flex: 1` | `flex-1` |
| `gap: 8px` | `gap-2` |

</div>
<div>

```html
<!-- 水平置中 + 垂直置中 + 間距 8px -->
<div class="flex justify-center
            items-center gap-2">
  <div class="flex-1">左</div>
  <div class="flex-1">右</div>
</div>
```

</div>
</div>

<!--
剛才學的 Flexbox，在 Tailwind 裡都有對應的 class。

`display: flex` 就是 `flex`，`flex-direction: column` 是 `flex-col`，`justify-content: center` 是 `justify-center`，`align-items: center` 是 `items-center`，`gap: 8px` 是 `gap-2`。

看得出來，Tailwind 的 class 幾乎就是 CSS 屬性的縮寫。所以要記住一件事：「Tailwind 不是新的語言，只是 CSS 的另一種寫法」。CSS 的基礎打穩了，Tailwind 很快就能上手；反過來，如果 CSS 不熟，Tailwind 的 class 就會很難看懂。
-->

---
zoom: 0.94
---

# Angular 專案安裝 Tailwind — 步驟

| 步驟 | 操作 |
| --- | --- |
| ① | 在終端機（專案根目錄）執行 `npm i tailwindcss @tailwindcss/postcss postcss` |
| ② | 在專案根目錄新增 `.postcssrc.json` 檔 |
| ③ | 在 `src/styles.scss` 最上方加入一行 `@use "tailwindcss";` |
| ④ | 重啟專案 |

```json
// .postcssrc.json（與 package.json 同一層）
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

```scss
// src/styles.scss — 加在檔案最上方
@use "tailwindcss";
```

<!--
在 Angular 專案安裝 Tailwind，只需要四個步驟。

第一步，在專案根目錄的終端機，用 `npm i` 安裝三個套件：Tailwind 本體、它的 PostCSS 外掛，以及 PostCSS。

第二步，在專案根目錄，也就是和 `package.json` 同一層，新增 `.postcssrc.json` 檔案。注意檔名前面有一個點。它的作用是告訴 Angular，打包 CSS 時要先交給 Tailwind 處理。

第三步，在 `src/styles.scss` 最上方，加上 `@use "tailwindcss"`，把 Tailwind 的樣式引進來。

第四步，一定要重新啟動開發伺服器，因為設定檔只在啟動時讀取。完成後，在標籤上寫 `text-3xl font-bold`，文字就會變大變粗。
-->

---

# 安裝時的三個常見錯誤

<div style="display: flex; flex-direction: column; gap: 0.7rem; margin-top: 0.6rem;">
  <div style="padding: 0.8rem; background: #fef3f2; border-radius: 8px; border: 1px solid #fca5a5;">
    <div style="font-weight: bold; color: #dc2626; margin-bottom: 0.3rem;">❌ 在 <code>.scss</code> 檔裡寫 <code>@import "tailwindcss";</code></div>
    <div style="font-size: 0.86rem; color: #374151;">官方文件寫的是 <code>@import</code>，但那是給 <code>.css</code> 檔用的。我們的專案是 SCSS，要用 <code>@use</code>，否則會出現 <code>Sass @import rules are deprecated</code> 警告</div>
  </div>
  <div style="padding: 0.8rem; background: #fef3f2; border-radius: 8px; border: 1px solid #fca5a5;">
    <div style="font-weight: bold; color: #dc2626; margin-bottom: 0.3rem;">❌ 執行 <code>npx tailwindcss init</code> 產生 <code>tailwind.config.js</code></div>
    <div style="font-size: 0.86rem; color: #374151;">那是 <b>Tailwind v3</b> 的做法。網路上大部分教學還停在 v3。<b>v4 不需要設定檔</b>，做了反而多餘</div>
  </div>
  <div style="padding: 0.8rem; background: #fef3f2; border-radius: 8px; border: 1px solid #fca5a5;">
    <div style="font-weight: bold; color: #dc2626; margin-bottom: 0.3rem;">❌ 跑去改 <code>angular.json</code> 的 <code>styles</code> 陣列</div>
    <div style="font-size: 0.86rem; color: #374151;">Tailwind 是透過 PostCSS 掛進建置流程，不是當成一個 CSS 檔載入，<code>angular.json</code> 完全不用動</div>
  </div>
</div>

<!--
安裝時有三個常見的錯誤，我們先講清楚。

第一，Tailwind 官網寫的是 `@import`，但那是給 `.css` 檔用的。我們的專案用 SCSS，`@import` 在 SCSS 裡是即將淘汰的舊語法，要改用 `@use`。

第二，網路上很多教學還停留在 Tailwind v3，會要我們執行 `npx tailwindcss init` 產生設定檔。v4 已經不需要這個檔案了，照做反而會出錯。

第三，有些人習慣把 CSS 套件登記在 `angular.json` 的 styles 陣列裡。但 Tailwind 是透過 PostCSS 在打包過程中處理的，`angular.json` 完全不用修改。
-->

---

# 小節練習 — Tailwind class

安裝好 Tailwind 後，請只用 Tailwind class 做出以下元件（不需寫任何 CSS）：

1. 一個**藍色主要按鈕**：藍底、白字、左右 padding 16px、上下 8px、圓角，滑鼠移上去變深藍
2. 一個**紅色危險按鈕**：同上，但底色是紅的
3. 一個**成功提示框**：淺綠底、深綠字、內距 16px、圓角，內容為「操作成功！」

```html
<!-- 試著只用 class 完成，不需要自己寫任何 CSS -->
<div class="flex gap-2">
  <button class="???">主要按鈕</button>
  <button class="???">危險按鈕</button>
</div>
<div class="???">操作成功！</div>
```

<!--
我們用一個練習熟悉 Tailwind 的 class。

請只用 Tailwind class，做出三個元件：一個藍色的主要按鈕，左右內距 16 像素、上下 8 像素、圓角，滑鼠移上去變深藍；一個同樣規格的紅色按鈕；以及一個淺綠底、深綠字的成功提示框。

提示一下，間距記得除以 4，16 像素就是 4，8 像素就是 2。顏色的標準深度是 500，淺色可以用 100，深色用 700 或 800。

我們先暫停一下，自己動手試試看。
-->

---

# 小節練習 — Tailwind class — 參考答案

```html
<div class="flex gap-2">
  <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    主要按鈕
  </button>
  <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
    危險按鈕
  </button>
</div>

<div class="bg-green-100 text-green-800 p-4 rounded mt-2">操作成功！</div>
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <code>px-4</code> = 左右 padding 16px、<code>py-2</code> = 上下 padding 8px（4 × 4 = 16、2 × 4 = 8）<br/>
✅ <code>hover:</code> 前綴取代了整段 SCSS 的 <code>&amp;:hover { }</code><br/>
✅ 顏色深淺：<code>100</code> 很淺（適合背景）、<code>500</code> 標準、<code>800</code> 很深（適合文字）
</div>

<!--
我們來看答案。

按鈕用 `px-4` 和 `py-2` 設定左右和上下的內距，`rounded` 做圓角，再加上 `hover:bg-blue-600`，滑鼠移上去就會變深。

注意這三個元件，我們一行 CSS 都沒寫，也沒有取任何 class 名稱。這一章一開始，寫 hover 要先取名字、再切到 SCSS 寫 `&:hover`；現在只要在 HTML 上加一個前綴就完成了。

最後，提示框用 `bg-green-100` 搭配 `text-green-800`，同一個色系一淺一深，對比剛好，是做提示框很常見的配色方式。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 練習
# CSS Practice

<!--
接下來，我們用一個練習，驗收 Flexbox 的排版能力。
-->

---

# 練習 — Flex 排版
### 任務說明

試著做出下圖的排版：
- 中間間隔為 **10px**
- Flex item 3 左右各間隔 **10px**
- Flex item 1 跟 5 高度為 **80px**

<img src="/images/10-css/practice-flex-layout.png" alt="練習目標排版" style="max-height: 260px; margin-top: 0.8rem;" />

<!--
這個練習要結合 Box Model 和 Flexbox。

畫面上有五個高度不同的色塊，並排成一列。規格是：色塊之間間隔 10 像素，第三個色塊左右各多留 10 像素，第一個和第五個色塊高度是 80 像素。

想一想三個問題：怎麼讓五個色塊並排？色塊之間的空隙用 Margin 還是 Padding？第三個色塊左右多出的距離又該怎麼設定？

顏色不用完全一樣，重點是位置和尺寸。我們先暫停一下，自己動手試試看。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充練習
# Extra Practice

<!--
接下來是幾題補充練習，把這一章學到的內容再動手練一次。
-->

---
layout: default
---

# 補充練習：Flex 絕對置中

「如何把一個方塊精準地放在正中間？」這是前端面試很常考的題目，用 Flexbox 就能做到：

1. 建立一個父層 `<div>`，給予固定的寬高（例如 `height: 300px`）與外框線
2. 將父層設定為 `display: flex`
3. 使用 `justify-content: center` 讓子層**水平置中**
4. 使用 `align-items: center` 讓子層**垂直置中**
5. 在裡面放一個有顏色的子層方塊，看看結果

```html
<div class="parent">
  <div class="child">絕對置中</div>
</div>
```

<!--
這題補充練習是前端面試的經典題：怎麼把一個方塊放在正中間？

父層給固定的寬高和外框線，設定 `display: flex`，再用 `justify-content` 和 `align-items` 分別處理水平和垂直置中。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習：Flex 絕對置中 — 參考答案

```scss
.parent {
  width: 500px;
  height: 300px;
  border: 2px solid #333;
  display: flex;
  justify-content: center;  // 主軸（水平）置中
  align-items: center;      // 次軸（垂直）置中
}

.child {
  width: 120px;
  height: 120px;
  background-color: #0ea5e9;
  color: white;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>justify-content</code> 控制主軸、<code>align-items</code> 控制次軸；預設主軸是水平方向，兩個都設 <code>center</code> 就是正中間
</div>

<!--
我們來看答案。

父層設定 `display: flex` 之後，`justify-content: center` 讓子層在主軸，也就是水平方向置中；`align-items: center` 讓子層在次軸，也就是垂直方向置中。兩個加在一起，子層方塊就會停在正中間。

要注意，父層一定要有高度，垂直置中才看得出效果。
-->

---
layout: end
---

# CSS 樣式編輯完成
### 互動、排版、套件，全部就位！

<!--
這一章我們學了三件事。第一，用 `:hover` 和 `:active` 做出滑鼠互動效果，並搭配 `transition` 讓變化更自然。第二，用 Flexbox 排版：`display: flex` 寫在父容器，`justify-content` 管主軸，`align-items` 管次軸，`align-self` 讓個別子元素例外，`flex` 分配剩餘空間。第三，在 Angular 專案裝好了 Tailwind CSS。

這些屬性名稱一開始可能有點繞口，多寫幾次就會熟悉了。

下一章，我們會繼續介紹更多 CSS 工具，像是背景設定、定位和堆疊順序。我們下一章見。
-->
