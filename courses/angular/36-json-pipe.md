---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: JsonPipe
routeAlias: ch36
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
    JsonPipe
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「將 JSON 物件直接呈現於 HTML 畫面上」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們用 DatePipe 格式化日期。這一章要學另一個內建管道：JsonPipe。

如果要在畫面上顯示一整個物件，直接繫結只會看到一串看不懂的文字。學完這一章，我們會知道原因，以及怎麼用 JsonPipe 搭配 `pre` 標籤，把物件清楚地顯示出來。
-->

---
layout: default
---

# Outline

- **JsonPipe 是什麼** — HTML 無法直接顯示 JSON 物件的原因
- **JsonPipe 使用步驟** — import、繫結語法、`| json` 管道
- **`<pre>` 標籤搭配** — 格式化顯示 JSON 輸出

<!--
這一章的路線很簡單：先了解為什麼物件不能直接顯示在畫面上，接著學怎麼用 JsonPipe 把物件轉成可讀的文字，最後搭配 `pre` 標籤，讓輸出保留縮排，更容易閱讀。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# JsonPipe 是什麼
# What is JsonPipe

<!--
把物件直接用雙大括號顯示，會看到一串奇怪的文字。我們來看原因，以及怎麼解決。
-->

---

# JsonPipe 是什麼

在 TypeScript 中，可以用 `console.log()` 檢查 JSON 資料，輸出出現在瀏覽器的開發者工具 log。

若直接以內嵌繫結 `{{ user }}` 將物件顯示在 HTML，畫面只會出現：

<div class="flex justify-center">
  <img src="/images/36-json-pipe/object-object-display.png" class="rounded shadow-md max-h-80" />
</div>

原因是 HTML 無法直接序列化 JavaScript 物件，會呼叫物件的 `.toString()` 方法，結果固定為 `[object Object]`。

<!--
在 TypeScript 裡，我們可以用 `console.log` 檢查物件，在開發者工具裡清楚看到內容。

但如果直接用雙大括號把 `user` 物件顯示在畫面上，只會出現 `[object Object]`，完全看不出裡面有什麼。

原因是畫面在顯示一個物件時，會呼叫物件的 `toString` 方法，而一般物件的 `toString`，回傳的固定就是 `[object Object]` 這個字串。

這不是語法寫錯，也不是 Angular 壞掉了，只是物件需要額外的工具轉換成文字。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# JsonPipe 使用
# Using JsonPipe

<!--
知道問題出在哪裡之後，接下來看解法。重點會放在 Angular 提供的 JsonPipe。
-->

---

# JsonPipe 使用步驟

若要將 JSON 資料顯示於 HTML，有兩種方式：

| 方式 | 說明 |
| --- | --- |
| `JSON.stringify()` | 在 TypeScript 中手動轉換為字串後繫結 |
| `JsonPipe`（`\| json`） | 直接在 HTML 樣板中使用管道語法轉換 |

使用 `JsonPipe` 的步驟如下：

1. 在該頁面的 `*.component.ts` 中 import `CommonModule`
2. 在 HTML 以內嵌繫結呈現目標變數
3. 在變數名稱後加上 `| json`

<!--
要把物件顯示在畫面上，有兩種方式。

第一種是在 TypeScript 裡用 `JSON.stringify` 手動轉成字串，再繫結到畫面上，這是之前在 TypeScript 練習學過的方法。第二種是用 JsonPipe，直接在 HTML 裡用管道轉換，語法更簡潔，也不用在元件裡多寫轉換的程式。

使用 JsonPipe 的步驟有三個：在元件的 TypeScript 裡匯入 `CommonModule`；在 HTML 用雙大括號顯示變數；最後在變數後面加上直線符號 `json`。

實務上，JsonPipe 很常用在開發階段除錯，快速把 API 回傳的資料印在畫面上，檢查欄位對不對。
-->

---

# JsonPipe 使用 — TypeScript 範例

在元件中宣告物件資料：

```typescript
user = {
  name: 'John',
  age: 30,
  roles: ['admin', 'user']
};
```

並在 `imports` 陣列中加入 `CommonModule`：

```typescript
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  user = { name: 'John', age: 30, roles: ['admin', 'user'] };
}
```

<!--
我們先準備要顯示的資料。

這裡宣告了一個 `user` 物件，裡面有姓名、年齡，還有一個角色陣列，這樣可以看出 JsonPipe 連巢狀的陣列也能處理。

接著在 `imports` 陣列加入 `CommonModule`。這一步不能省略，如果沒有匯入，HTML 裡寫 `json` 管道時，會出現找不到這個管道的錯誤。
-->

---

# JsonPipe 使用 — HTML 範例

在 HTML 樣板中以內嵌繫結加上 `| json` 管道：

```html
{{ user | json }}
```

畫面輸出結果（單行）：

<div class="flex justify-center">
  <img src="/images/36-json-pipe/json-pipe-inline-output.png" class="rounded shadow-md max-h-80" />
</div>

<!--
資料和模組都準備好之後，用法很簡單：在雙大括號裡的 `user` 後面，加上直線符號 `json`。

執行之後，畫面不再是 `[object Object]`，而是把完整的 JSON 內容印出來，連陣列裡的 admin 和 user 都看得到。

不過注意看，輸出的內容擠在同一行，可讀性不太好。下一頁我們來改善排版。
-->

---

# 搭配 &lt;pre&gt; 標籤格式化顯示

直接使用 `| json` 輸出為單行，可讀性較低。建議搭配 <code>&lt;pre&gt;</code> 標籤，讓輸出保留縮排與換行：

```html
<pre>{{ user | json }}</pre>
```

<code>&lt;pre&gt;</code> 標籤會依照原始內容的空白與換行進行呈現，使 JSON 結構更易於閱讀。

<pre class="bg-gray-100 rounded p-4 text-sm text-left leading-relaxed font-mono mt-4" style="width: fit-content !important; margin: 1rem auto !important;">
{
  "name": "John",
  "age": 30,
  "roles": [
    "admin",
    "user"
  ]
}
</pre>

<!--
要讓輸出更好讀，只要把雙大括號包在 `pre` 標籤裡就好。

`pre` 是 HTML 原生的標籤，意思是「保留原本的格式」。一般的 HTML 標籤會把多餘的空白和換行合併掉，但 `pre` 不會，它會照著原本的縮排和換行呈現。

所以搭配 JsonPipe 之後，物件就會變成右邊這樣，一層一層縮排的格式，跟在開發者工具裡看到的很像。做除錯畫面時，這是很常用的小技巧。
-->

---
layout: end
---

# 課程結束
### 使用 JsonPipe 搭配 `<pre>` 標籤，可在 HTML 畫面上清晰呈現 JSON 物件結構

<!--
這一章我們學了 JsonPipe。物件直接顯示在畫面上，只會出現 `[object Object]`，因為畫面只會呼叫物件的 `toString`。用 JsonPipe，匯入 `CommonModule`，再在變數後面加上直線符號 `json`，就能把物件轉成可讀的 JSON 字串。搭配 `pre` 標籤，還能保留縮排和換行。

這個技巧在確認 API 回傳的資料時特別好用。

下一章，我們會學習即時搜尋，讓清單隨著使用者的輸入即時過濾。我們下一章見。
-->

