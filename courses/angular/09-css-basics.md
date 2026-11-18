---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: CSS 基礎語法
routeAlias: ch09
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
    CSS 基礎語法
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「前端之肉 — 讓網頁穿上衣服」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們用 HTML 搭好了網頁的骨架，但畫面還很陽春。這一章要學 CSS，幫網頁穿上衣服。

同一份 HTML，換一套 CSS，風格就能完全不同。學完這一章，我們會調整文字和外觀，用選擇器指定要套用樣式的元素，也會搞懂排版最核心的 Box Model。
-->

---
layout: default
---

# Outline

- **CSS 常用屬性**
- **Inline Style — 在標籤上直接寫 CSS**
- **CSS 選擇器 — 元素選擇器與 Class 選擇器**
- **Class 命名慣例**
- **CSS 單位與 Box Model**
- **練習**

<!--
這一章的路線是這樣的。先認識最常用的 CSS 屬性，接著看第一種寫法，也就是直接寫在標籤上的 Inline Style。然後學更有效率的選擇器寫法，以及 class 的命名慣例。最後介紹 CSS 的單位和 Box Model，並用兩個練習把觀念串起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# CSS
# 前端之肉

<!--
我們先來認識幾個最常用的 CSS 屬性。可以把它們想成調整畫面的旋鈕。
-->

---

# CSS 常用屬性（一）— 文字（1/2）

| 屬性 | 說明 | 範例 |
| --- | --- | --- |
| `color` | 字體顏色（不含背景） | `color: red;` `color: #ff0000;` |
| `font-size` | 字體大小 | `font-size: 16px;` `font-size: 1.5rem;` |
| `font-weight` | 字體粗細：`bold`、`normal`、`100`～`900` | `font-weight: bold;` `font-weight: 700;` |
| `font-family` | 字型 | `font-family: Arial, sans-serif;` |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
🎨 <b>顏色查詢工具：</b>
<a href="https://htmlcolorcodes.com/" target="_blank" style="color:#3b82f6;">htmlcolorcodes.com</a>（HEX / RGB 色票選色）・
<a href="https://www.w3schools.com/colors/colors_picker.asp" target="_blank" style="color:#3b82f6;">W3Schools Color Picker</a>（顏色名稱 ↔ 色碼）・
<a href="https://www.color-hex.com/" target="_blank" style="color:#3b82f6;">color-hex.com</a>（輸入色碼查詢）
</div>

<!--
第一組屬性專門控制文字的樣子。

其實這跟在 Word 裡調整字體顏色、大小、粗細是同一件事，只是 Word 用滑鼠點按鈕，CSS 用文字寫出設定。

`color` 是文字顏色，`font-size` 是字體大小，`font-weight` 是粗細，`font-family` 是字型。粗細最常用 `bold` 和 `normal`，也可以用數字，400 等於 normal，700 等於 bold。

這裡有一個很常見的誤會：`color` 只改「文字」的顏色。如果想把整個區塊的背景變成黃色，寫 `color: yellow` 只會讓字變黃，要改背景得用 `background-color`。

下方也附了幾個查詢色碼的工具網站，選顏色時可以參考。
-->

---

# CSS 常用屬性（一）— 文字（2/2）

| 屬性 | 說明 | 範例 |
| --- | --- | --- |
| `line-height` | 行距（建議 `1.5`～`1.8`） | `line-height: 1.6;` |
| `text-align` | 對齊：`left`、`right`、`center`、`end` | `text-align: center;` |
| `text-decoration` | 裝飾：`underline`（底線）、`line-through`（刪除線）、`none` | `text-decoration: underline;` |
| `letter-spacing` | 文字間距 | `letter-spacing: 2px;` |

<!--
文字的第二組屬性，跟閱讀的舒適度有關。

`line-height` 是行距，沒有寫單位的時候代表倍數，例如 1.6 就是字體大小的 1.6 倍，一般建議設在 1.5 到 1.8 之間，讀起來比較舒服。

`text-align` 控制文字的水平對齊，最常用的是 `center` 置中。

`text-decoration` 是文字裝飾，像底線、刪除線。實務上最常見的用法是設成 `none`，把超連結預設的底線拿掉。

`letter-spacing` 是字和字之間的距離，常用在標題上，讓文字看起來更寬鬆。
-->

---

# CSS 常用屬性（二）— 外觀與排版（1/2）

| 屬性 | 說明 | 範例 |
| --- | --- | --- |
| `background-color` | 背景顏色（`color` 只改文字色） | `background-color: yellow;` `background-color: #f5f5f5;` |
| `width` | 寬度：`px`、`%`、`vw`、`auto` | `width: 200px;` `width: 50%;` |
| `height` | 高度：`px`、`%`、`vh`、`auto` | `height: 100px;` `height: 100vh;` |
| `border` | 邊框樣式：`solid`（實線）、`dashed`（虛線）、`dotted`（點線） | `border: 1px solid black;` `border: 2px dashed red;` |

<!--
第二組屬性，控制元素的外觀和大小。

`background-color` 是背景色，再提醒一次，`color` 改的是文字，`background-color` 才是背景。

`width` 和 `height` 設定寬度和高度，可以用像素，也可以用百分比，或是之後會介紹的 vw、vh。

`border` 是邊框，要依序寫上三個值：粗細、樣式、顏色。樣式有實線 `solid`、虛線 `dashed` 和點線 `dotted`。這三個值缺一不可，尤其少寫樣式的話，邊框就不會出現。
-->

---

# CSS 常用屬性（二）— 外觀與排版（2/2）

| 屬性 | 說明 | 範例 |
| --- | --- | --- |
| `border-radius` | 圓弧效果（`999px` = 膠囊形） | `border-radius: 8px;` `border-radius: 999px;` |
| `box-shadow` | 陰影：`x偏移 y偏移 模糊 顏色` | `box-shadow: 2px 2px 4px gray;` |
| `display` | 排版：`block`、`inline`、`flex`、`none`（隱藏） | `display: flex;` `display: none;` |
| `cursor` | 游標：`pointer`（手指）、`default`、`not-allowed`（禁止） | `cursor: pointer;` |

<!--
外觀的第二部分。

`border-radius` 設定圓角，數字越大越圓。如果想做成膠囊形狀的按鈕，可以直接設一個很大的值，例如 999px。

`box-shadow` 是陰影，依序設定水平偏移、垂直偏移、模糊程度和顏色，現代設計常用陰影來取代邊框，讓畫面更有層次。

`display` 控制元素的排版方式，其中 `none` 會讓元素完全消失，連空間都不佔。

`cursor` 控制滑鼠游標的樣子，設成 `pointer` 會變成手指形狀，告訴使用者「這裡可以點」，按鈕通常都會加上它。
-->

---

# 小節練習 — CSS 常用屬性

請用 CSS 屬性將 `<p class="highlight">歡迎來到 CSS 的世界！</p>` 設定成指定樣式：

| 需求 | 值 |
| --- | --- |
| 字體顏色 | `#e74c3c`（紅色） |
| 字體大小 | `24px` |
| 字體粗細 | 粗體 |
| 文字對齊 | 置中 |
| 行距 | `1.8` |

<!--
我們用一個小練習，複習剛才的文字屬性。

請把這行「歡迎來到 CSS 的世界」設定成表格裡的樣式：紅色、24 像素、粗體、置中，行距 1.8。想一想，每個需求分別對應哪一個屬性？

我們先暫停一下，自己動手試試看，下一頁有參考答案。
-->

---

# 小節練習 — CSS 常用屬性 — 參考答案

```css
.highlight {
  color: #e74c3c;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  line-height: 1.8;
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>重點：</b> <code>color</code> 只改字色；<code>font-weight: bold</code> 等同 <code>700</code>；<code>line-height: 1.8</code> 無單位 = 1.8 倍行距
</div>

<!--
我們來對照答案。

`color` 設定紅色，`font-size` 設 24px，`font-weight` 設 `bold`，`text-align` 設 `center`，`line-height` 設 1.8。

特別注意行距的寫法。寫 1.8 代表字體大小的 1.8 倍；如果寫成 1.8px，就變成固定 1.8 像素，行和行會疊在一起，兩者意思完全不同。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Inline Style
# 在標籤上直接寫 CSS

<!--
知道了這些屬性，要怎麼套用到 HTML 上？我們先看最直接的寫法：Inline Style。
-->

---

# 建立 CSS 練習檔

先建立一個 HTML 檔案，在 `<body>` 中加入一個 `<p>` 標籤：

```html
<!DOCTYPE html>
<html>
<head>
  <title>我的第三個網頁</title>
</head>
<body>
  <p>CSS練習</p>
</body>
</html>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 開啟瀏覽器後，畫面上會出現 <b>CSS練習</b> 文字，目前尚未套用任何樣式
</div>

<!--
我們先建立一個練習用的 HTML 檔案。

這個檔案很單純，`body` 裡只有一個 `p` 標籤，內容是「CSS練習」。用瀏覽器打開，會看到一行預設的黑色文字，還沒有套用任何樣式。

接下來，我們就用這個檔案來練習加上樣式。
-->

---

# 加入 Inline Style — 單個屬性

在 `<p>` 標籤上加入 `style` 屬性，直接寫入 CSS：

```html
<p style='color:red;'>CSS練習</p>
```

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>語法格式：</b> <code>style='屬性名稱: 值;'</code>，每個屬性結尾加 <code>;</code>
</div>

<!--
Inline Style 的做法，是直接在標籤上加一個 `style` 屬性，把 CSS 寫在裡面。

這裡我們在 `p` 標籤加上 `style`，內容是 `color` 冒號 `red`，最後加上分號。存檔之後，這行字就會變成紅色。

語法格式是「屬性名稱、冒號、值、分號」。最後的分號很容易漏掉，它就像句子結尾的句號。只有一個屬性時還不明顯，但屬性一多，少了分號，後面的設定就可能全部失效。
-->

---

# 加入 Inline Style — 多個屬性

多個屬性寫在同一個 `style` 中，屬性之間用 `;` 分隔：

| 屬性 | 值 | 效果 |
| --- | --- | --- |
| `color` | `red` | 文字變紅色 |
| `font-size` | `30px` | 文字放大至 30px |

```html
<p style='color:red; font-size: 30px;'>CSS練習</p>
```

<!--
如果要同時設定好幾個屬性，只要用分號隔開，接著寫下去就可以了。

這裡我們先寫 `color: red`，加上分號，再寫 `font-size: 30px`。結果文字會變成紅色，而且放大到 30 像素。

Inline Style 很直覺，但在實際專案裡並不推薦大量使用。想像網頁上有一百個按鈕都要變紅色，就得在一百個地方各寫一次。之後如果要改成藍色，又得一個一個改。

所以接下來，我們要學一種可以集中管理樣式的方法。
-->

---

# 小節練習 — Inline Style

請用 Inline Style 在 `<button>` 標籤上達成以下效果：

| 需求 | 值 |
| --- | --- |
| 背景顏色 | `#3498db` |
| 字體顏色 | 白色 |
| Padding | 上下 `8px`、左右 `16px` |
| 圓角 | `4px` |
| 游標 | 手指形狀 |

```html
<button style="???">送出表單</button>
```

<!--
在學新方法之前，我們先用一個練習熟悉 Inline Style。

請在這個按鈕的 `style` 屬性裡，設定表格中的效果：藍色背景、白色文字、上下 8 像素左右 16 像素的內距、4 像素的圓角，以及手指形狀的游標。

提示一下，內距的屬性叫 `padding`，上下和左右不同的時候，可以寫兩個值。

我們先暫停一下，自己動手試試看。
-->

---

# 小節練習 — Inline Style — 參考答案

```html
<button style="background-color: #3498db; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
  送出表單
</button>
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>重點：</b> padding 兩個值 = 上下、左右；<code>cursor: pointer</code> 讓使用者知道按鈕可以點擊<br/>
⚠️ Inline Style 適合快速測試；正式專案應使用 class 選擇器統一管理
</div>

<!--
我們來看參考答案。

這裡要注意兩個地方。第一，`padding` 寫兩個值的時候，第一個是上下，第二個是左右，所以寫 8px 16px。第二，`cursor: pointer` 很容易被忘記，但它能讓使用者知道這顆按鈕可以點，對使用體驗很重要。

最後再提醒一次，Inline Style 適合快速測試，正式專案還是要用接下來介紹的選擇器來管理樣式。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# CSS 選擇器
# Selector

<!--
接下來進入更有效率的寫法：CSS 選擇器。用選擇器，我們就能把樣式集中寫在一個地方管理。
-->

---

# 元素選擇器 (Element Selector)

若相同樣式要套用到**所有相同標籤**，使用 `<style>` 標籤宣告元素選擇器：

```html
<style>
  p { color: red; }
</style>
<body>
  <p>CSS練習一</p>
  <p>CSS練習二</p>
  <p>CSS練習三</p>
</body>
```

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 元素選擇器 <code>p { }</code> 會修改<b>所有</b> &lt;p&gt; 標籤的樣式！
</div>

<!--
第一種選擇器叫「元素選擇器」。

這裡我們在 `style` 標籤裡寫 `p`，後面接大括號，裡面設定 `color: red`。意思是「所有的 `p` 標籤，文字都變成紅色」。

就像廣播說「所有叫 p 的同學都穿紅衣服」，結果下面的練習一、練習二、練習三，全部都變成紅色。

它很方便，但缺點是沒辦法區分。如果只想讓練習一變紅，練習二維持黑色，元素選擇器就做不到了，這時候要用下一種選擇器。
-->

---

# Class 選擇器 — 概念

只修改**部分**標籤時，使用 Class 選擇器：

| 步驟 | 操作 | 說明 |
| --- | --- | --- |
| ① | 在 HTML 標籤加上 `class="pCss"` | `pCss` 為自訂選擇器名稱 |
| ② | 在 `<style>` 中寫 `.pCss { }` | Class 選擇器前面必須加 `.`（點） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 要修改<b>全部</b>標籤用元素選擇器（無 <code>.</code>）；只修改<b>部分</b>標籤用 Class 選擇器（加 <code>.</code>）
</div>

<!--
第二種選擇器是 Class 選擇器，也是前端工程師每天最常用的寫法。

我們可以把 class 想成貼紙。先在要套用樣式的標籤上貼一張貼紙，再廣播「有貼這張貼紙的人，穿紅衣服」。

看表格，步驟有兩個。第一步，在 HTML 標籤加上 `class`，名稱可以自己取，例如 `pCss`。第二步，在 `style` 裡寫 `.pCss`，後面接大括號設定樣式。

注意 `.pCss` 前面有一個點，這個點代表「這是 class」。很多人會漏掉這個點，結果瀏覽器以為要找一個叫 pCss 的標籤，樣式就完全沒有作用。
-->

---

# Class 選擇器 — 範例

```html
<style>
  .pCss { color: red; }
</style>
<body>
  <p class="pCss">CSS練習一</p>
  <p>CSS練習二</p>
  <p class="pCss">CSS練習三</p>
</body>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 練習一和練習三套用 <code>.pCss</code>（紅色）；練習二沒有 class，不受影響
</div>

<!--
我們看實際的效果。

練習一和練習三的標籤上，都加了 `class` 等於 `pCss`，所以它們變成紅色。中間的練習二沒有這個 class，就維持預設的黑色。

這就是 Class 選擇器的好處，可以精準地指定哪些元素要套用樣式。
-->

---

# 多個 Class

一個標籤可以套用**多個 class**，中間用**空格**隔開：

```html
<style>
  .pCss  { color: red; }
  .pCss2 { font-size: 50px; }
</style>
<body>
  <p class="pCss pCss2">CSS練習一</p>
  <p class="pCss">CSS練習三</p>
</body>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 練習一同時套用 <code>.pCss</code>（紅色）與 <code>.pCss2</code>（50px 字體大小）
</div>

<!--
一個標籤還可以同時套用好幾個 class。

就像一個同學可以同時是籃球隊員，也是吉他社社長，兩邊的特質都會有。

寫法是在 `class` 屬性裡放多個名稱，中間用空格隔開，例如 `pCss` 空格 `pCss2`。注意是用空格分開，不是逗號。

這樣練習一就會同時套用 `pCss` 的紅色，以及 `pCss2` 的 50 像素字體大小。
-->

---

# CSS 層疊規則 — 後蓋前

同一標籤套用多個 class，若修改**相同屬性**，**後面的 class 會覆蓋前面的**：

```html
<style>
  .pCss  { color: red; }
  .pCss2 { color: yellow; }
</style>
<body>
  <p class="pCss pCss2">CSS練習一</p>
</body>
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>結果：</b> 文字顏色為<b>黃色</b>（.pCss2 寫在後面，程式由上往下執行，後蓋前）
</div>

<!--
那如果兩個 class 設定了同一個屬性，瀏覽器會聽誰的？

這裡 `.pCss` 設定紅色，`.pCss2` 設定黃色，而練習一兩個都有套用，結果文字會是黃色。

CSS 的全名是 Cascading Style Sheets，中文是「層疊樣式表」。在優先程度相同時，規則很簡單：「寫在後面的會覆蓋前面的」。瀏覽器由上往下讀，先讀到紅色，後來又讀到黃色，所以最後是黃色。

就像先穿紅色 T 恤，外面再套一件黃色外套，別人看到的就是黃色。之後如果發現樣式怎麼改都沒變，可以先檢查是不是後面有其他設定把它蓋掉了。
-->

---

# 小節練習 — CSS 選擇器

HTML 結構如下，請用元素選擇器和 class 選擇器完成樣式：

```html
<p>這是普通段落</p>
<p class="important">這是重要段落（紅色 + 粗體）</p>
<p class="important large">這是更重要段落（紅色 + 粗體 + 30px）</p>
```

| 目標 | 效果 |
| --- | --- |
| 所有 `<p>` | `color: gray` |
| `.important` | `color: red; font-weight: bold` |
| `.large` | `font-size: 30px` |

<!--
我們用一個練習，把兩種選擇器混在一起用。

這裡有三個段落，需求是：所有段落都是灰色；有 `important` 的段落是紅色加粗體；有 `large` 的段落字體 30 像素。

想一想，第三個段落同時有 `important` 和 `large`，它最後會是什麼顏色？

我們先暫停一下，自己動手試試看。
-->

---

# 小節練習 — CSS 選擇器 — 參考答案

```css
p { color: gray; }

.important {
  color: red;
  font-weight: bold;
}

.large {
  font-size: 30px;
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>重點：</b> 第三個 &lt;p&gt; 同時有 <code>important</code> 和 <code>large</code>，兩個 class 都會套用；<code>color: red</code> 優先權高於 <code>p { color: gray }</code>（class 分數 10 分 &gt; 標籤 1 分）
</div>

<!--
我們來看答案。

先用元素選擇器 `p`，讓所有段落變成灰色；再用 `.important` 設定紅色和粗體；最後 `.large` 設定字體大小。

回答剛才的問題：第三個段落會是紅色，而不是灰色。這裡不是看誰寫在後面，而是因為 class 選擇器的優先權比元素選擇器高。我們可以簡單記成，class 的分數比標籤高，所以紅色勝出。
-->

---

# Class 命名慣例

為讓程式易讀易維護，class 名稱應具有意義並採用固定格式：

| 命名方式 | 格式 | 好的範例 | 不好的範例 |
| --- | --- | --- | --- |
| **小駝峰** (camelCase) | 第二字起大寫 | `topText`、`loginBtn` | `area1text` |
| **Kebab-case** | 用 `-` 連接 | `top-text`、`login-btn` | `area1` |

```html
<div class="top"><div class="topText"></div></div>
```

<!--
既然 class 名稱要自己取，我們就要取得有意義，而且有固定的格式。

不要用 `a1`、`area1` 這種名稱，過幾天連自己都看不懂。前端最常見的兩種格式是：小駝峰，例如 `topText`；以及用連字號連接的 kebab-case，例如 `top-text`，kebab 是烤肉串的意思，就像用竹籤把單字串起來。

另外有兩個規則一定要記住。第一，class 名稱不能有空格，因為空格會被當成兩個不同的 class。第二，不能用數字開頭，例如 `1st-text`，這樣的寫法在 CSS 選擇器裡沒辦法直接使用。
-->

---

# 小節練習 — Class 命名慣例

以下 class 名稱，哪些**不符合**命名慣例？請找出問題並改正：

| 名稱 | 合法？ | 問題 |
| --- | --- | --- |
| `1st-title` | ❌ | ??? |
| `login-btn` | ✅ | — |
| `main Area` | ❌ | ??? |
| `navBar` | ✅ | — |
| `card_title` | ⚠️ | ??? |

<!--
我們來檢查一下，表格裡這五個 class 名稱，哪些不符合命名慣例？

`login-btn` 和 `navBar` 是沒問題的。剩下三個，`1st-title`、`main Area` 和 `card_title`，分別有什麼問題？

想一想剛才提到的兩個規則，我們先暫停一下，自己找找看。
-->

---

# 小節練習 — Class 命名慣例 — 參考答案

| 名稱 | 問題 | 改正 |
| --- | --- | --- |
| `1st-title` | 數字開頭，瀏覽器拒讀 | `first-title` |
| `main Area` | 含空格，會被視為兩個 class | `main-area` |
| `card_title` | 底線非前端慣例（可用但不推薦） | `card-title` |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ 兩大鐵律：① 不能以數字開頭　② 不能含空格<br/>
推薦格式：<b>kebab-case</b>（<code>login-btn</code>）或 <b>camelCase</b>（<code>loginBtn</code>）
</div>

<!--
我們來揭曉答案。

`1st-title` 是數字開頭，可以改成 `first-title`。`main Area` 中間有空格，會被當成兩個 class，可以改成 `main-area`。

`card_title` 用的是底線，技術上可以用，但不是前端常見的寫法，建議改成 `card-title`。底線命名在後端比較常見，在前端的 Angular 專案裡，我們統一用 kebab-case 或小駝峰就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 單位與 Box Model
# CSS Units & Box Model

<!--
學會了選擇器，接下來要搞懂 CSS 的單位，以及排版最核心的觀念：Box Model。
-->

---

# CSS 單位

| 單位 | 說明 |
| --- | --- |
| `px` | 像素，網頁的基本固定單位 |
| `rem` | 相對單位，1rem = 16px（根元素字體大小） |
| `vw` | 視窗寬度的 1%，`100vw` = 全寬 |
| `vh` | 視窗高度的 1%，`100vh` = 全高 |

```css
width: 10vw;
height: 10vh;
margin: 1rem;
```

<!--
CSS 有幾種常用的單位。

`px` 是像素，是固定的單位，寫 10px 就是 10 個像素。

`vw` 和 `vh` 是相對單位，分別代表「視窗寬度的百分之一」和「視窗高度的百分之一」，所以 100vw 就是整個視窗的寬度。它們像橡皮筋一樣，視窗變大就跟著變大，做響應式網頁時很好用。

`rem` 則是以網頁根元素的字體大小為基準，預設是 16 像素。實務上很常用 `rem`，因為如果使用者把系統字體調大，用 `rem` 的網頁也會跟著等比例放大，對閱讀比較友善。
-->

---

# CSS Box Model — 四個元素

CSS Box Model 定義了每個 HTML 元素所佔的空間，由內而外共四層：

<div style="display: flex; align-items: center; gap: 3rem; margin-top: 1.2rem;">
  <div style="background: #4472C4; padding: 22px; border-radius: 4px; flex-shrink: 0;">
    <div style="background: #E07020; padding: 18px;">
      <div style="background: #70AD47; padding: 18px;">
        <div style="background: #000; color: #fff; padding: 10px 18px; font-size: 0.85rem; white-space: nowrap;">
          寬像素 x 高像素
        </div>
      </div>
    </div>
  </div>
  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <div style="display: flex; align-items: center; gap: 0.8rem;">
      <div style="width: 36px; height: 36px; background: #000; flex-shrink: 0;"></div>
      <div>Content：CSS 設定的寬高</div>
    </div>
    <div style="display: flex; align-items: flex-start; gap: 0.8rem;">
      <div style="width: 36px; height: 36px; background: #70AD47; flex-shrink: 0;"></div>
      <div>Padding：元素與<span style="color: red;">元素內容</span>的距離，內留白</div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.8rem;">
      <div style="width: 36px; height: 36px; background: #E07020; flex-shrink: 0;"></div>
      <div>Border：元素邊界</div>
    </div>
    <div style="display: flex; align-items: flex-start; gap: 0.8rem;">
      <div style="width: 36px; height: 36px; background: #4472C4; flex-shrink: 0;"></div>
      <div>Margin：元素與元素間的距離，外留白</div>
    </div>
  </div>
</div>

<!--
接下來是排版最核心的觀念：Box Model，也就是盒子模型。

在瀏覽器眼中，每個元素都是一個方形的盒子，由內到外分成四層。

我們用寄送筆電來比喻。最內層是 Content，也就是內容本身，就像筆電。為了保護它，我們包一層氣泡紙，這層內部的空間就是 Padding，內距。氣泡紙外面是箱子的外殼，也就是 Border，邊框。最後，箱子放在桌上時，要跟旁邊的東西保持距離，這段外部的空間就是 Margin，外距。

Padding 和 Margin 最容易搞混，記住一句話：「Padding 往內留白，Margin 往外推開」。接下來我們一層一層來看。
-->

---

# CSS Box Model — Content（內容）

Content 為區塊的**主要內容**，像是文字、圖片、影片等，位於 Box Model 的**最內層**。大小由文字內容的多寡或圖片的長寬決定。

<div style="margin: 1.2rem 0; background: #b0c4de; font-weight: bold; padding: 6px 12px;">HTML練習</div>

<div class="p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 藍色區域即為 Content；設定 <code>width</code> 和 <code>height</code>，就是在控制此區域的大小
</div>

<!--
最內層是 Content，也就是元素的主要內容，像文字、圖片或影片。

我們在 CSS 裡設定 `width` 和 `height`，預設就是在控制這個區域的大小。

如果沒有設定寬高，Content 的大小就會由內容決定，文字越多、圖片越大，這個區域就會被撐得越大。
-->

---

# CSS Box Model — Padding（內距）

Padding 是元素**內部**的空間距離，位於 Content 和 Border 之間。若有設定背景顏色，背景色會**隨著 Padding 延伸**。

<div style="margin: 1.2rem 0; background: #90c878; padding: 24px;">
  <div style="background: white; font-weight: bold; padding: 6px 12px;">HTML練習</div>
</div>

<div class="p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 綠色外框 = Padding 區域（元素背景色延伸）；白色內框 = Content；可分別設定上下左右四個方向
</div>

<!--
往外一層是 Padding，內距，也就是內容和邊框之間的空間。

當文字緊緊貼著邊框，看起來很擁擠的時候，就可以加一點 Padding，把空間撐開。

這裡有一個重點：「元素的背景顏色會延伸到 Padding」。所以畫面上綠色的區域，雖然不是內容本身，但也會有背景色。

實務上做按鈕時，常常是一小段文字，再加上四周的 Padding，讓按鈕看起來更大、更好點擊。
-->

---

# CSS Box Model — Border（邊框）

Border 是元素的**邊框**，位於 Padding 外側。通常 1–5px 細線條，用來畫出元素邊界。可設定樣式（`solid` 實心 / `dashed` 虛線）、顏色與粗細。

<div style="margin: 1.2rem 0; border: 2px solid black; font-weight: bold; padding: 6px 12px;">HTML練習</div>

```css
border: 2px solid black;
```

<!--
再往外是 Border，也就是元素的邊框。

邊框的寫法是三個值一起寫，例如 `border: 2px solid black`，意思是 2 像素粗、實線、黑色。

這三個值都要寫齊，最常見的錯誤是漏掉 `solid`，只寫粗細和顏色，瀏覽器不知道要畫哪一種線，邊框就不會出現。

另外，現代設計常常不用明顯的邊框，而是用淡淡的背景色或陰影來區隔區塊，看起來會比較柔和。
-->

---

# CSS Box Model — Margin（外距）

Margin 是元素**外部**的空間距離，位於 Box Model 的**最外層**，用來控制元素與元素之間的距離。

<div style="margin: 1.2rem 0; background: #f0f0f0; padding: 4px;">
  <div style="background: white; font-weight: bold; padding: 6px 12px; border: 1px solid #bbb;">HTML練習一</div>
  <div style="background: white; font-weight: bold; padding: 6px 12px; border: 1px solid #bbb; margin-top: 28px;">HTML練習二</div>
</div>

<div class="p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 兩個元素之間的空白 = Margin；背景色<b>不會</b>延伸至 Margin（與 Padding 的最大差異）
</div>

<!--
最外層是 Margin，外距，用來控制元素和元素之間的距離。

看畫面上的兩個區塊，中間那段空白就是 Margin。

Margin 和 Padding 最大的差別在於，背景顏色「不會」延伸到 Margin，它永遠是透明的，唯一的任務就是和其他元素保持距離。

所以我們可以這樣判斷：想讓元素內部有呼吸空間、或想讓底色面積變大，用 Padding；想把旁邊的元素推開，用 Margin。
-->

---

# CSS Box Model — 範例

```css
.boxModel {
  width: 10vw;
  height: 10vh;
  margin: 1rem;
  padding: 100px;
  border: 1px solid black;
  background-color: rgb(248, 203, 203);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>border 語法：</b> <code>border: 粗細 樣式 顏色</code>，例如 <code>1px solid black</code>（1像素實心黑線）
</div>

<!--
我們把剛才的四層，全部寫進一個 `.boxModel` 的 class 裡。

寬度是視窗寬度的十分之一，高度是視窗高度的十分之一；外面留 1rem 的外距，裡面留 100 像素的內距；邊框是 1 像素的黑色實線，背景是粉紅色。

就像向家具行訂做一個箱子，交出一張規格單，瀏覽器就會依照這些數值把盒子畫出來。注意這裡的內距設得比較大，所以盒子實際看起來，會比設定的寬高大很多。
-->

---

# Padding 與 Margin 設置

Padding 和 Margin 支援多種縮寫語法（兩者寫法完全相同）：

| 語法 | 說明 |
| --- | --- |
| `padding: 2px;` | 四邊都為 2px |
| `padding: 2px 3px;` | 上下 2px、左右 3px |
| `padding: 2px 3px 4px;` | 上 2px、右 3px、下 4px（左同右） |
| `padding: 2px 3px 4px 5px;` | 上 右 下 左（順時針） |
| `padding-top / right / bottom / left` | 單獨設定各方向 |

<!--
Padding 和 Margin 要設定四個方向時，不用寫四行，可以用縮寫，兩者的寫法完全一樣。

寫一個值，代表四邊都一樣。寫兩個值，第一個是上下，第二個是左右。寫三個值，是上、左右、下。寫四個值，順序是上、右、下、左。

四個值的順序可以記成「從上面開始，順時針繞一圈」。

如果只想設定某一邊，也可以用 `padding-top` 這類單獨的屬性。實務上最常用的是兩個值的寫法，例如 `margin: 10px 0`，代表上下 10 像素，左右不留。
-->

---

# 小節練習 — Box Model

請用 CSS 完成一個卡片元件，符合以下規格：

| 屬性 | 值 |
| --- | --- |
| 寬 × 高 | `200px × 100px` |
| Padding | 四邊 `16px` |
| Margin | 上下 `24px`、左右 `auto`（水平置中） |
| Border | `2px solid #cccccc` |
| 背景色 | `#f8f9fa` |
| 圓角 | `8px` |

```html
<div class="card">卡片內容</div>
```

<!--
我們用一個練習，把 Box Model 的四層全部用上。

請做出一張卡片：寬 200 像素、高 100 像素，四邊內距 16 像素，上下外距 24 像素，左右設成 `auto`，還要加上灰色邊框、淺灰背景和 8 像素圓角。

想一想，`margin` 要怎麼用一行，同時寫出上下 24 像素和左右 `auto`？

我們先暫停一下，自己動手試試看。
-->

---

# 小節練習 — Box Model — 參考答案

```css
.card {
  width: 200px;
  height: 100px;
  padding: 16px;
  margin: 24px auto;
  border: 2px solid #cccccc;
  background-color: #f8f9fa;
  border-radius: 8px;
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>重點：</b> <code>margin: 24px auto</code> = 上下 24px + 左右自動（水平置中的經典技法）<br/>
⚠️ <code>padding: 16px</code> 會讓元素的實際佔用空間超過 200px（除非加 <code>box-sizing: border-box</code>）
</div>

<!--
我們來看答案。

這裡的關鍵是 `margin: 24px auto`，代表上下 24 像素，左右自動。左右設成 `auto`，瀏覽器會把兩邊剩下的空間平均分配，元素就會水平置中。這是很常用的置中技巧，但只對有設定寬度的區塊元素有效。

另外要注意，加了 16 像素的內距之後，卡片實際佔的寬度會超過 200 像素。如果希望總寬度剛好是 200，可以加上 `box-sizing: border-box`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 練習
# CSS Practice

<!--
看懂了 Box Model 之後，接下來我們用兩個實作題來驗收。
-->

---

# 練習 1 — Box Model 尺寸設計
### 任務說明

根據線框圖建立 HTML 結構，並套用 CSS 設定各元素的寬高與間距：

<img src="/images/09-css/practice1-wireframe.png" alt="練習1線框圖" style="max-height: 320px;" />

<!--
練習一是根據線框圖，做出畫面上的排版。

畫面上有兩張並排的圖片、一個區塊、一個輸入框和一顆按鈕，每個元素都有指定的寬高和間距。

在動手之前，先想一想：兩張圖片之間的空隙，以及按鈕和輸入框之間的空隙，應該用 Margin 還是 Padding？

【講師】給大家 1 分鐘構思結構，再進到下一頁看提示。
-->

---

# 練習 1 — 解題提示

| 元素 | 屬性 | 值 |
| --- | --- | --- |
| `img`（左） | `width` / `height` / `margin-right` | `200px` / `200px` / `24px` |
| `img`（右） | `width` / `height` | `300px` / `200px` |
| `div` | `height` / `margin` | `100px` / `36px 0` |
| `input` | `height` | `20px` |
| `button` | `width` / `height` / `margin-left` | `120px` / `20px` / `18px` |

<!--
這頁列出了每個元素需要的屬性和數值。

剛才的問題，答案是 Margin，因為我們要推開的是旁邊的元素。所以左邊的圖片用 `margin-right: 24px`，把右邊的圖片推開；按鈕用 `margin-left: 18px`，和輸入框保持距離。

中間的 `div` 用 `margin: 36px 0`，利用縮寫一次設定上下各 36 像素的距離。

我們先暫停一下，自己動手試試看。
-->

---

# 練習 2 — 登入頁面
### 任務說明

使用 HTML + CSS 製作下方登入頁面：

<img src="/images/09-css/practice2-login.png" alt="練習2目標畫面" style="max-height: 320px;" />

<!--
練習二是這一章的綜合題，我們要做出一個藍色的登入卡片。

畫面上有登入標題、帳號和密碼的輸入框，還有一顆登入按鈕。會用到背景色、文字顏色、對齊、圓角，以及 Padding 和 Margin。

先觀察一下畫面，想想可以分成哪幾個區塊，下一頁會有提示。
-->

---

# 練習 2 — 解題提示

| 區塊 | 使用標籤 | CSS 重點 |
| --- | --- | --- |
| 外框 | `div` | `background-color: blue` |
| 標題 | `h1` "登入" | `color: white; text-align: center` |
| 帳號 / 密碼標籤 | `p` | `color: white` |
| 帳號 / 密碼輸入框 | `input` | `border-radius: 999px` |
| 登入按鈕 | `button` | `background-color: red; color: white; border-radius: 999px` |

<!--
這張表列出了每個區塊需要的標籤和 CSS 重點。

外框用 `div` 加上藍色背景；標題用 `h1`，白色文字置中；帳號和密碼的說明文字用 `p`；輸入框和按鈕都設定 `border-radius: 999px`，做成膠囊形狀；按鈕再加上紅色背景和白色文字。

建議先把 HTML 結構寫好，再用選擇器一個一個套上樣式。

我們先暫停一下，自己動手試試看。

【講師】給大家 15 分鐘左右，巡堂協助卡住的同學。
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

# 補充練習 1：盒模型推擠（Margin）

請建立兩個 `<div>` 區塊，並利用 `margin` 將它們推開，感受外距的實際效果：

1. 建立兩個正方形區塊，寬高各 `100px`
2. 分別給予不同的背景顏色
3. 使用 `margin-bottom`（或縮寫），讓兩個方塊上下之間產生 `30px` 的距離

```html
<div class="box box-1">方塊 1</div>
<div class="box box-2">方塊 2</div>
```

<!--
第一題補充練習，我們來感受 margin 的效果。

請建立兩個寬高各 100px 的方塊，給它們不同的背景顏色，然後用 margin，讓兩個方塊上下之間空出 30px。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：盒模型推擠 — 參考答案

```css
.box {
  width: 100px;
  height: 100px;
}

.box-1 {
  background-color: #f7b977;
  margin-bottom: 30px;   /* 把下方的方塊往下推 30px */
}

.box-2 {
  background-color: #028760;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 也可以寫在方塊 2 的 <code>margin-top: 30px</code>，效果相同；縮寫 <code>margin: 0 0 30px 0</code> 的順序是「上、右、下、左」
</div>

<!--
我們來看答案。

兩個方塊共用 `box` 這個 class，設定寬高各 100px。接著在方塊 1 加上 `margin-bottom: 30px`，它的下方就會多出 30px 的外距，把方塊 2 往下推開。

也可以反過來，在方塊 2 寫 `margin-top: 30px`，效果一樣。如果用縮寫，順序是上、右、下、左，也就是 `margin: 0 0 30px 0`。
-->

---
layout: default
---

# 補充練習 2：個人名片上色

將 HTML 章節完成的「個人名片」套用 CSS，讓它看起來像一張真正的卡片：

| 需求 | 寫法 |
| --- | --- |
| 卡片總寬度 | `width: 400px` |
| 卡片背景色 | 淺色系或自訂 |
| 內距，讓文字不貼齊邊緣 | `padding: 25px` |
| 圓角與陰影 | `border-radius`、`box-shadow` |
| 標題文字置中 | `text-align: center` |

<!--
第二題補充練習，我們要把 HTML 章節做好的個人名片，用 CSS 打扮成一張卡片。

卡片寬度 400px，背景用淺色系，加上 25px 的內距，讓文字不要貼著邊緣。再加上圓角和陰影，最後讓標題置中。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：個人名片上色 — 參考答案

```html
<div class="card">
  <h2 class="card-title">王小明</h2>
  <p>嗨，我是一個前端新手！</p>
  <p>技能清單：HTML, CSS</p>
</div>
```

```css
.card {
  width: 400px;
  background-color: #f8f9fa;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-title {
  text-align: center;
}
```

<!--
我們來看答案。

最外層用一個 `div` 包住整張名片，加上 `card` 這個 class。寬度 400px、淺灰色背景、25px 的內距。`border-radius` 讓四個角變圓，`box-shadow` 加上陰影，讓卡片看起來浮在畫面上。

標題另外給一個 class，設定 `text-align: center`，讓名字置中。
-->

---
layout: end
---

# CSS 基礎完成
### 讓你的網頁穿上第一件衣服！

<!--
這一章我們學了 CSS 的基礎。我們認識了常用的文字和外觀屬性，學會用 Inline Style 和選擇器套用樣式，知道 class 的優先權比元素選擇器高，也了解了「後面蓋前面」的層疊規則。最後，我們搞懂了 Box Model 的四層：Content、Padding、Border 和 Margin。

寫練習時，如果遇到樣式沒有作用，或盒子比預期大，回頭檢查選擇器和 Box Model，大多都能找到原因。

下一章，我們會學更進階的 CSS 排版技巧。我們下一章見。
-->
