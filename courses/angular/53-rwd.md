---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: RWD
routeAlias: ch53
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
    RWD
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓網頁自動適應各種螢幕尺寸，提供一致的使用體驗」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
在第一章我們就提過 RWD，響應式網頁設計，這一章終於要實際動手做。

如果一個為桌機設計的網站直接拿到手機上看，字很小、按鈕很難點，還要左右滑動。RWD 要做的，是讓同一份網頁，在手機、平板和桌機上都能自動調整版面。學完這一章，我們會使用響應式單位、設計斷點，並用 Media Query 讓元件的樣式隨螢幕寬度切換。
-->

---
layout: default
---

# Outline

- **什麼是 RWD？** — 響應式網頁設計的定義與目標
- **響應式單位** — `%`、`vw`、`vh` 與固定 `px` 的差異
- **斷點設計** — 桌機、平板、手機的常見寬度分界
- **Media Query 語法** — `@media` 的結構與條件關鍵字
- **Angular 實作範例** — 在元件 SCSS 中撰寫 Media Query
- **實際效果示範** — 縮放視窗觀察背景顏色切換

<!--
這一章會先說明什麼是 RWD，接著比較幾種響應式單位，再介紹斷點的設計和 Media Query 的語法。然後在 Angular 元件裡實作一個範例，縮放視窗觀察背景顏色的變化。最後回頭看看 Tailwind 的斷點前綴，和 Media Query 有什麼關係。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 RWD？

Responsive Web Design

<!--
沒有 RWD 的話，每種裝置都要各做一份網頁。我們來看 RWD 怎麼用一份程式照顧所有裝置。
-->

---

# 什麼是 RWD？

**RWD（Responsive Web Design，響應式網頁設計）** 指網頁能自動適應不同裝置的螢幕尺寸，無論手機、平板或桌機瀏覽，畫面皆能正確呈現。

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**固定單位（`px`）**
- 每個螢幕上顯示大小固定不變
- 在小螢幕可能出現水平捲軸
- 不具備自適應能力

</div>
<div>

**相對單位（`%`、`vw`、`vh`）**
- 依視窗或父元素大小動態計算
- 畫面縮放時元素隨之調整
- 是實現 RWD 的基礎手段

</div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> CSS 中使用 <code>%</code>、<code>vw</code>（Viewport Width）、<code>vh</code>（Viewport Height）等相對單位，即是 RWD 最基本的實作方式。
</div>

<!--
RWD 的全名是 Responsive Web Design，中文是響應式網頁設計，指的是「網頁能自動適應不同裝置的螢幕尺寸」。

這裡先比較兩種單位。固定單位 px，不管在哪個螢幕上大小都不變，在小螢幕上可能出現水平捲軸。相對單位，例如百分比、vw 和 vh，會依照視窗或父元素的大小計算，畫面縮放時元素也會跟著調整。

可以想成穿衣服：固定單位像量身訂做的西裝，只適合一種尺寸；相對單位像彈性布料，誰穿都能貼合。使用相對單位，就是 RWD 最基本的做法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 響應式單位

Responsive CSS Units

<!--
剛才提到相對單位是 RWD 的基礎，接下來把常見的幾個單位攤開來比較，看看它們各自以什麼為基準。
-->

---

# 響應式單位比較

| 單位 | 基準 | 特性 |
| --- | --- | --- |
| `px` | 固定像素 | 不隨視窗變化，非響應式 |
| `%` | 父容器寬度 | 寬度隨父容器等比縮放 |
| `vw` | 視窗寬度（Viewport Width） | `1vw` = 視窗寬度的 1% |
| `vh` | 視窗高度（Viewport Height） | `1vh` = 視窗高度的 1% |

<!--
這張表整理了四種單位。

`px` 是固定像素，不隨視窗變化。百分比是以「父容器」的寬度為基準。`vw` 是視窗寬度的百分之一，`vh` 是視窗高度的百分之一，兩者都是以「整個瀏覽器視窗」為基準。

實務上，如果元素要跟著父容器的排版走，用百分比比較直覺；如果想讓元素佔滿螢幕的某個比例，例如滿版的橫幅，用 vw 和 vh 比較方便。
-->

---

# 響應式單位 — 範例

```css
/* 固定寬度：所有螢幕永遠顯示 300px */
.box-fixed {
  width: 300px;
}

/* 相對寬度：佔父容器的 80% */
.box-percent {
  width: 80%;
}

/* 視窗相對：佔視窗寬度 50%、高度 30% */
.box-viewport {
  width: 50vw;
  height: 30vh;
}
```

<!--
這段範例比較三種單位的行為。

`.box-fixed` 寬度固定 300 像素，視窗怎麼變都不會改變。`.box-percent` 寬度是父容器的 80%，會跟著父容器縮放。`.box-viewport` 寬度是視窗寬度的一半，高度是視窗高度的 30%。

要注意，百分比的基準是父容器，不是視窗。如果父容器本身沒有明確的寬度，百分比可能算不出預期的結果，這是很多人一開始會卡住的地方。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 斷點設計

Breakpoints

<!--
光有相對單位還不夠，很多時候我們需要在不同的寬度範圍，套用完全不同的版面，這就要靠斷點設計。
-->

---

# 常見裝置斷點

**斷點（Breakpoint）** 是 Media Query 中定義版面切換的寬度臨界值。

| 裝置類型 | 寬度範圍 | 版面說明 |
| --- | --- | --- |
| 桌機（Desktop） | `> 1024px` | 多欄寬版面 |
| 平板（Tablet） | `601px ~ 768px` | 二欄或單欄 |
| 手機（Mobile） | `≤ 600px` | 單欄垂直排列 |

<!--
斷點，英文是 Breakpoint，是 Media Query 裡用來切換版面的寬度臨界值。

可以把它想成衣服的尺碼，S、M、L 各對應一個範圍，超過某個數值就換一個尺碼。網頁也是一樣，視窗寬度一跨過這條線，版面就切換成對應的樣子。

表格列的是常見的參考值：桌機大於 1024 像素，使用多欄的版面；平板大約在 601 到 768 像素之間，使用兩欄或單欄；手機在 600 像素以下，使用單欄。實務上可以依照產品需求調整。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Media Query

@media 語法結構

<!--
知道斷點之後，接下來學怎麼在 CSS 裡真正套用它，這就要用到 Media Query。
-->

---

# @media 語法結構

`@media` 規則讓開發者針對特定視窗條件套用獨立的 CSS 樣式，是實作 RWD 最核心的工具。

```css
@media (條件) {
  選擇器 {
    屬性: 值;
  }
}
```

<!--
`@media` 讓我們可以針對特定的視窗條件，套用另一組 CSS 樣式，是實作 RWD 最核心的工具。

可以把它想成程式裡的 if：小括號裡的條件成立，就套用大括號裡的樣式；不成立就跳過。

語法本身很單純，重點在條件怎麼寫，接下來看常用的幾個關鍵字。
-->

---

# @media 常用條件關鍵字

| 關鍵字 | 說明 | 範例 |
| --- | --- | --- |
| `max-width` | 視窗寬度不超過指定值時套用 | `(max-width: 600px)` |
| `min-width` | 視窗寬度不小於指定值時套用 | `(min-width: 1024px)` |
| `and` | 同時滿足多個條件 | `(min-width: 601px) and (max-width: 768px)` |

<!--
這三個關鍵字涵蓋了大部分的需求。

`max-width` 代表視窗寬度小於等於某個值時套用，常用在手機版。`min-width` 則相反，代表大於等於某個值時套用，常用在桌機版。

如果要框出一個中間的範圍，例如平板，就用 `and` 把兩個條件串起來，同時符合最小寬度，又不超過最大寬度。等一下的範例就會用到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Angular 實作範例

Media Query in Angular Component

<!--
語法都學會了，接下來把它放進 Angular 專案，實際做一個會依照螢幕寬度變色的元件。
-->

---

# 在 Angular 中套用 Media Query

Media Query 寫在 Angular 元件對應的 `.scss` 檔案內，與一般 CSS 寫法完全相同。

**HTML 範本**

```html
<!-- practise1.component.html -->
<div class="box"></div>
```

**SCSS — 預設（桌機）樣式**

```css
/* practise1.component.scss */
.box {
  width: 100%;
  height: 200px;
  background: lightblue;
}
```

<!--
在 Angular 裡，Media Query 寫在元件的 `.scss` 檔案中，跟一般的 CSS 寫法完全一樣，不需要學新的語法。

HTML 裡只有一個 class 為 `box` 的 `div`。SCSS 先寫預設的樣式，也就是桌機看到的樣子：寬度 100%，高度 200 像素，背景是淺藍色。

注意這個 `div` 裡面沒有任何內容。如果只設定寬度、沒有設定高度，它的高度會是 0，畫面上就完全看不到，很容易誤以為樣式沒有套用成功。
-->

---

# Media Query 實作範例（一）

```css
/* 手機版：視窗寬度 ≤ 600px */
@media (max-width: 600px) {
  .box {
    width: 100%;
    background: lightcoral;
  }
}
```

<!--
接著加上手機版的樣式。

`@media` 的條件是 `max-width: 600px`，意思是「視窗寬度小於等於 600 像素時」，`.box` 的背景就變成淺珊瑚色。

把瀏覽器視窗縮小到手機的寬度，就會看到顏色從淺藍色變成珊瑚色。
-->

---

# Media Query 實作範例（二）

```css
/* 平板版：601px ≤ 視窗寬度 ≤ 768px */
@media (max-width: 768px) and (min-width: 601px) {
  .box {
    width: 100%;
    background: lightgreen;
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> CSS 樣式具有覆蓋特性，應確保各 <code>@media</code> 條件的寬度範圍不重疊，以避免非預期的樣式覆蓋。
</div>

<!--
接著加上平板版的樣式。

用 `and` 把 `max-width: 768px` 和 `min-width: 601px` 組合起來，框出平板的範圍，背景設為淺綠色。

要注意，CSS 是由上往下套用的，後面的規則會蓋掉前面的。所以各個 `@media` 的寬度範圍不要重疊，否則畫面可能出現跟預期不同的顏色。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實際效果示範

Visual Result

<!--
程式都寫好了，接下來打開瀏覽器，縮放視窗看看三段樣式是不是照預期切換。
-->

---

# 瀏覽器縮放效果

儲存後在瀏覽器中縮放視窗，`.box` 的背景色依斷點自動切換：

| 視窗寬度 | 套用規則 | 背景顏色 |
| --- | --- | --- |
| `> 768px`（桌機） | 預設樣式 | 淺藍色（`lightblue`） |
| `601px ~ 768px`（平板） | 平板 Media Query | 淺綠色（`lightgreen`） |
| `≤ 600px`（手機） | 手機 Media Query | 淺粉紅（`lightcoral`） |

<!--
這張表整理了三段樣式對應的結果。

視窗寬度大於 768 像素時，套用預設樣式，背景是淺藍色。在 601 到 768 像素之間，套用平板的樣式，變成淺綠色。600 像素以下，套用手機的樣式，變成淺珊瑚色。

實際操作時，慢慢把視窗邊緣往內拉，就能看到顏色在跨過斷點的那一刻切換。
-->

---

# 實際畫面示意

三種裝置寬度下的背景顏色切換（由上至下：桌機 → 平板 → 手機）：

<div class="flex justify-center"><img src="/images/53-rwd/browser-responsive-demo.png" class="rounded shadow-md max-h-80" /></div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 按 <code>F12</code> 開啟 DevTools，拖曳視窗邊緣或使用裝置模擬器（Toggle Device Toolbar），即可即時觀察樣式切換效果。
</div>

<!--
這是實際在瀏覽器上的結果，由上到下分別是桌機、平板和手機的寬度。

如果手邊沒有手機可以測試，可以按 F12 打開開發者工具，切換到裝置模擬模式，也就是 Toggle Device Toolbar，就能在電腦上模擬各種裝置的尺寸。這是前端開發很常用的除錯技巧。
-->

---

# 回頭看 Tailwind 的斷點前綴

還記得 ch10 裝的 Tailwind 嗎？它的 `md:` `lg:` 前綴，底層就是 `@media`：

| Tailwind 前綴 | 等同的 Media Query | 對應裝置 |
| --- | --- | --- |
| （無前綴） | 預設，永遠套用 | 手機（Mobile First） |
| `sm:` | `@media (min-width: 640px)` | 大手機 |
| `md:` | `@media (min-width: 768px)` | 平板 |
| `lg:` | `@media (min-width: 1024px)` | 桌機 |

```html
<!-- 手機單欄 → 平板二欄 → 桌機四欄 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ Tailwind 的斷點一律是 <code>min-width</code>，也就是<b>先寫手機、再往上加大螢幕的例外</b>（Mobile First），跟本章前面示範的 <code>max-width</code> 寫法方向相反
</div>

<!--
最後，我們回頭看看之前在 CSS 章節安裝的 Tailwind。

Tailwind 的 `sm:`、`md:`、`lg:` 這些前綴，底層就是 `@media`。例如寫 `md:grid-cols-2`，Tailwind 就會產生一段 `min-width: 768px` 的 Media Query。就像 `hover:` 前綴一樣，Tailwind 只是把我們這一章學的 `@media` 包成簡短的前綴。

要特別注意方向：Tailwind 的斷點全部都是 `min-width`。沒有前綴的是手機版，螢幕越大再往上加例外，這叫做「行動優先」，英文是 Mobile First。而這一章前面示範的是 `max-width`，方向剛好相反。

兩種寫法都可以，但同一個專案裡不要混用。業界目前的主流是 Mobile First，因為大多數使用者是用手機瀏覽。
-->

---
layout: end
---

# 課程結束

### 透過相對單位（`%`、`vw`、`vh`）與 `@media` 斷點語法，在同一份程式碼中實現跨裝置的響應式自適應版面

<!--
這一章我們學了 RWD。相對單位，例如百分比、vw 和 vh，會跟著容器或視窗縮放。斷點是切換版面的寬度臨界值，用 `@media` 搭配 `max-width`、`min-width` 和 `and` 來套用不同的樣式，各個範圍不要重疊。Tailwind 的斷點前綴底層也是 `@media`，採用 Mobile First 的方向。

下一章，我們會學習如何把 Angular 專案打包。我們下一章見。
-->
