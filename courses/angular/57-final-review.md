---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 全課程總複習 Ch1–55
routeAlias: ch57
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
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    全課程總複習
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「從 HTML 第一行到 Firebase 上線：55 章精華一次回顧」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
恭喜大家走到這裡。這一章是整套課程的總複習，我們會把前面五十五章學過的內容，整理成一趟九站的回顧旅程。

這一章不是重新教一遍，而是把散落在各章的知識串成一張地圖。每一站都有重點速記和關鍵程式碼，站與站之間穿插快問快答，最後再整理全課程最容易踩雷的十個重點。
-->

---
layout: default
---

# Outline

- **課程地圖** — 55 章如何組成九大階段
- **第一站：開發環境與工具**（Ch1–7）
- **第二站：HTML 與 CSS**（Ch8–11）
- **第三站：TypeScript 語法**（Ch12–17）
- **第四站：Angular 核心觀念**（Ch18–24）
- **第五站：模板語法與資料處理**（Ch25–30）
- **第六站：Angular Material**（Ch31–42）
- **第七站：非同步、RxJS 與狀態管理**（Ch43–47）
- **第八站：版面與表單**（Ch48–53）
- **第九站：打包與部署上線**（Ch54–55）
- **全課程易錯重點 Top 10**

<!--
這是今天的路線圖。我們把五十五章分成九個階段，從開發環境、HTML 和 CSS、TypeScript，一路到 Angular 核心、Material、非同步與 RxJS、版面與表單，最後是打包和部署上線。每一站先看速記，再用快問快答自我檢測。最後的易錯重點 Top 10，是各章注意事項的總整理。
-->

---
layout: default
---

# 課程地圖 — 九大階段（一）

| 階段 | 章節 | 主題 | 你獲得的能力 |
| --- | --- | --- | --- |
| 一 | Ch1–7 | 開發環境與工具 | 建得起環境、開得了專案 |
| 二 | Ch8–11 | HTML 與 CSS | 刻得出靜態畫面 |
| 三 | Ch12–17 | TypeScript 語法 | 寫得出程式邏輯 |
| 四 | Ch18–24 | Angular 核心觀念 | 元件、繫結、路由、資料傳遞 |
| 五 | Ch25–30 | 模板語法與資料處理 | 控制流程、串 API、整理資料 |

<!--
先看課程地圖的前五個階段。這九個階段不是隨便切的，它就是一個前端工程師從零到上線的工作流程。

先有環境和工具，才刻得出畫面；有了畫面，需要邏輯，所以學 TypeScript；邏輯要組織起來，就進入 Angular 的元件世界；畫面要有真實的資料，所以接著學模板語法和串接 API。最右邊那一欄，是每一站完成後我們獲得的能力。
-->

---
layout: default
---

# 課程地圖 — 九大階段（二）

| 階段 | 章節 | 主題 | 你獲得的能力 |
| --- | --- | --- | --- |
| 六 | Ch31–42 | Angular Material | 用元件庫組出專業 UI |
| 七 | Ch43–47 | 非同步、RxJS 與狀態管理 | RxJS、訂閱、Loading、Signals |
| 八 | Ch48–53 | 版面與表單 | 後台版型、動態表單、RWD |
| 九 | Ch54–55 | 打包與部署 | 打包上線，作品見天日 |

<!--
接著是後四個階段。要做出好看又省工的介面，就用 Angular Material；要處理等待資料和共享狀態，就學非同步和 RxJS；要做出完整的產品，再補上版面、表單和 RWD；最後打包部署，作品正式上線。

複習的時候，可以問自己一個問題：這九格裡面，哪一格我最沒把握？那一格對應的章節，就是我們最優先要回去重讀的地方。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第一站：開發環境與工具
# Ch1–7

<!--
第一站是開發環境與工具，對應第一到第七章。內容偏觀念和操作，但環境建不起來，是新手最常卡住的地方。
-->

---
layout: default
---

# 第一站速記 — 觀念篇

**前端在做什麼？**（Ch1）
- 前端 = 使用者看得到、摸得到的部分；後端 = 資料與商業邏輯
- 三大技術分工：**HTML 是骨架、CSS 是衣服、TypeScript 是動作**

**Coding 習慣五原則**（Ch2）
- 命名有意義（camelCase 變數／方法、PascalCase 類別）
- 檔案放對位置、排版一致、註解寫「為什麼」、**DRY 避免重複程式碼**

**為什麼選 Angular？**（Ch3）
- 完整框架（路由、表單、HTTP 全內建）、TypeScript 原生支援、Google 維護
- 前置需求：**Node.js + npm**（用 `node -v`、`npm -v` 確認）

<!--
觀念篇有三件事。

第一是前後端分工。前端管畫面和互動，後端管資料和邏輯，兩邊靠 API 溝通，這也是後面串接 API 的基礎。

第二是 coding 習慣，其中最重要的是 DRY，不要重複。只要發現自己在複製貼上同一段程式碼，就該停下來，把它抽成方法或元件。

第三，Angular 是一個完整的框架，路由、表單、HTTP 都內建。學習曲線比較陡，但學完就是完整的工程能力。
-->

---
layout: default
---

# 第一站速記 — 指令篇

| 指令 | 用途 | 章節 |
| --- | --- | --- |
| `cd 路徑`／`cd ..` | 切換目錄／回上一層 | Ch4 |
| `nvm install 22`／`nvm use 22` | 安裝／切換 Node.js 版本 | Ch5 |
| `npm install -g @angular/cli` | 全域安裝 Angular CLI | Ch5 |
| `ng new my-app` | 建立新專案 | Ch5 |
| `ng serve -o` | 啟動開發伺服器並開啟瀏覽器 | Ch5, Ch7 |
| `ng g c components/header` | 建立元件（generate component） | Ch7 |

**專案結構三巨頭**：`src/app` 放程式碼、`app.routes.ts` 管路由、`app.config.ts` 管全域 providers

<!--
指令篇用一張表整理。最常用的是最後三個：`ng new` 建立專案、`ng serve` 啟動開發伺服器、`ng g c` 建立元件，這三個指令會一直陪著我們。

nvm 在安裝環境和部署上線時都出現過。不同的專案和工具，可能需要不同版本的 Node，有了 nvm，就不用重灌，直接切換就好。

專案結構記三個位置：程式碼在 `src/app`，路由在 `app.routes.ts`，全域設定在 `app.config.ts`，串接 API 時的 `provideHttpClient` 就是加在這裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第二站：HTML 與 CSS
# Ch8–11

<!--
第二站是 HTML 與 CSS，對應第八到第十一章。Angular 的模板本質上就是 HTML，這一站是畫面的基礎。
-->

---
layout: default
---

# 第二站速記 — HTML 常用標籤（Ch8）

| 分類 | 標籤 | 重點 |
| --- | --- | --- |
| 標題／段落 | `h1`–`h6`、`p` | 區塊元素，各自獨佔一行 |
| 清單 | `ul`＋`li`、`ol`＋`li` | 無序／有序清單 |
| 連結／圖片 | `a href`、`img src` | `a` 行內、`img` 記得加 `alt` |
| 輸入 | `input type="text/number/date..."` | 搭配 `label`、`button` |
| 表格 | `table` > `tr` > `th`／`td` | 先列（tr）再格（td） |
| 容器 | `div`（區塊）、`span`（行內） | 版面切割的基本單位 |

**行內 vs 區塊**：區塊元素（div、p、h1）獨佔一行；行內元素（span、a、img）並排顯示

<!--
HTML 的常用標籤，一張表就夠了。我們要能不查資料就寫出：標題和段落、兩種清單、超連結和圖片、輸入框和按鈕，以及表格的結構。表格是 table 包 tr，tr 再包 th 或 td，先有列，才有格。

行內和區塊的差別，會直接影響排版。div 預設獨佔一行，span 會並排，這正是 CSS 的 display 屬性在控制的東西。表格結構在學 mat-table 時還會再出現，因為 mat-table 產生的就是原生的 table。
-->

---
layout: default
---

# 第二站速記 — CSS 核心觀念（一）（Ch9, Ch11）

**選擇器與優先權**（Ch9, Ch11）
```css
p { color: gray; }        /* 元素選擇器 */
.title { color: teal; }   /* class 選擇器 */
```
- class 用 `.` 開頭，一個標籤可掛多個 class
- **後蓋前**：同權重時，寫在後面的樣式蓋掉前面

**Box Model（由內而外）**
`content → padding → border → margin`

<!--
CSS 我們濃縮成四塊，這一頁是前兩塊。

第一是選擇器。元素選擇器直接寫標籤名稱，class 選擇器用點開頭。優先權記住後蓋前，很多樣式沒有生效的問題，都是被後面的規則蓋掉了。

第二是 Box Model，由內而外四層：content、padding、border、margin。調整間距之前，先想清楚要調的是內距，還是外距。
-->

---
layout: default
---

# 第二站速記 — CSS 核心觀念（二）（Ch10–11）

**Flex 排版**（Ch10）
```css
.box {
  display: flex;
  flex-direction: row;     /* 主軸方向 */
  justify-content: center; /* 主軸對齊 */
  align-items: center;     /* 次軸對齊 */
}
```
- 子元素 `flex: 1` 平分剩餘空間

**Position**（Ch11）
- `fixed` 釘在視窗、`relative`＋`absolute` 父子定錨
- `z-index` 決定堆疊順序（大的在上）

<!--
接著是後兩塊。

第三是 flex 排版。`flex-direction` 決定主軸方向，`justify-content` 管主軸對齊，`align-items` 管次軸對齊。這組設定在 Toolbar 的 Spacer 技巧和 RWD 都會再用到。

第四是 position。fixed 是釘在視窗上不動，absolute 要搭配一個 relative 的父層當定位點，`z-index` 則決定誰蓋在誰上面，數字大的在上面。
-->

---
layout: default
---

# 快問快答 ①（第一、二站）

1. `ng g c components/card` 這個指令會做什麼事？
2. 一個 `div` 想讓裡面三個子元素**水平置中且垂直置中**，CSS 要寫哪三行？
3. 同一個標籤同時被 `.red { color: red; }` 跟 `.blue { color: blue; }` 選中，`class="red blue"`，字是什麼顏色？為什麼？
4. `padding` 跟 `margin` 差在哪裡？

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 先自己回答，下一頁對答案。答不出來的題目，把對應章節記進你的複習清單。
</div>

<!--
第一次快問快答，範圍是前兩站。大家先暫停一下，四題都自己回答過一遍，再往下看。

提醒一下第三題，考的是後蓋前。這裡的後，指的是 CSS 檔案裡規則寫的順序，不是 class 屬性裡名稱排列的順序，這是很多人誤解的地方。
-->

---
layout: default
---

# 快問快答 ① — 參考解答

1. 在 `src/app/components/` 下建立 `card` 元件的**四個檔案**（ts／html／scss／spec），並自動宣告好 `@Component` 設定（Ch7, Ch20）
2. ```css
   display: flex;
   justify-content: center;
   align-items: center;
   ```
   （Ch10）
3. 看 **CSS 檔案中誰寫在後面**——後蓋前原則；class 屬性裡的順序不影響（Ch9, Ch11）
4. `padding` 是**內距**（content 到 border 之間），`margin` 是**外距**（border 之外、與其他元素的距離）（Ch9）

<!--
我們來對答案。

第一題，`ng g c` 一次產生四個檔案，而且會自動把元件的設定寫好。第二題，flex 置中的三行是面試常見的送分題，一定要記起來。第三題再強調一次，決定顏色的是 CSS 檔案裡的順序，寫在後面的蓋掉前面。第四題用 Box Model 來記：padding 在框裡面，margin 在框外面。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第三站：TypeScript 語法
# Ch12–17

<!--
第三站進入 TypeScript，對應第十二到第十七章。後面每個元件的程式邏輯，寫的都是這一站的東西。
-->

---
layout: default
---

# 第三站速記 — 型別與變數（Ch12–14）

```typescript
let userName: string = '小明';     // 字串
let age: number = 25;              // 數字
let isVip: boolean = true;         // 布林
let scores: number[] = [80, 90];   // 陣列
let anything: any = '不檢查型別';  // any：盡量避免
```

| 觀念 | 重點 | 章節 |
| --- | --- | --- |
| TS vs JS | TS = JS + 型別檢查，編譯期就抓錯 | Ch12 |
| `let` vs `const` vs `var` | 可重新賦值／不可重新賦值／**不要用 var** | Ch14 |
| 特殊型別 | `tuple`（定長定型）、`enum`（枚舉）、`null`／`undefined` | Ch13 |
| 畫面呈現 | 字串插值 `{{ userName }}` 顯示到 HTML | Ch14 |

<!--
這是型別與變數。上面這五行，涵蓋了日常大部分的宣告：字串、數字、布林和陣列。`any` 雖然合法，但等於把 TypeScript 的型別檢查關掉，所以盡量不要用。

宣告關鍵字記一個原則：預設用 `const`，需要重新賦值才用 `let`。`var` 的作用域是整個函式，而不是區塊，容易出錯，課程裡明確說不要再用。

宣告好的變數，用雙大括號就能顯示到畫面上，這就是四種繫結裡的第一種，內嵌繫結。
-->

---
layout: default
---

# 第三站速記 — 方法與流程控制（一）（Ch15–16）

**方法宣告與呼叫**（Ch15）
```typescript
add(a: number, b: number = 10): number {
  return a + b;
}
this.add(5);      // 15（b 用預設值）
this.add(5, 20);  // 25
```

**if / else if / else**（Ch16）
```typescript
if (score >= 90) { grade = 'A'; }
else if (score >= 60) { grade = 'B'; }
else { grade = 'C'; }
```

<!--
方法與流程控制的前半段。

方法由四個部分組成：名稱、參數、回傳型別和 return。參數可以加上型別，也可以給預設值。像這裡的 b 預設是 10，所以只傳一個 5 進去，結果是 15；傳 5 和 20，結果就是 25。在元件裡呼叫自己的方法，記得前面要加上 this。

下面的 if、else if、else，是最基本的條件判斷，由上往下檢查，符合第一個條件就停下來。後面學到的 `@if` 模板語法，結構跟這裡完全一樣。
-->

---
layout: default
---

# 第三站速記 — 方法與流程控制（二）（Ch16）

**for 迴圈兩種寫法**（Ch16）
```typescript
for (let i = 0; i < list.length; i++) { }
for (const item of list) { }  // 推薦
```

**常用陣列／字串方法**（Ch16）
```typescript
list.push(x);              // 加到尾端
list.filter(n => n > 60);  // 過濾
list.map(n => n * 2);      // 轉換
str.indexOf('關鍵字');     // 找位置，-1 = 沒找到
JSON.stringify(obj);       // 物件 → JSON 字串
JSON.parse(jsonStr);       // JSON 字串 → 物件
```

<!--
方法與流程控制的後半段。迴圈有兩種寫法：傳統的 for 用索引一個一個跑，for of 則是直接拿到每一個元素。日常開發推薦用 for of，比較不容易寫錯。

下面這六個方法，是全課程出場率最高的工具。filter 在排序、即時搜尋和綜合練習的封存功能都用到了；indexOf 是即時搜尋判斷的核心，找不到會回傳負一；JSON 的兩個方法則是網頁儲存必備的，因為 localStorage 只能存字串，物件進出都要靠 stringify 和 parse 轉換。
-->

---
layout: default
---

# 第三站速記 — Date 日期物件（Ch17）

```typescript
const now = new Date();                    // 現在時間
const day = new Date('2024/06/15');        // 指定日期

day.getFullYear();  // 2024
day.getMonth();     // 5 ⚠️ 月份從 0 開始！
day.getDate();      // 15
day.getTime();      // 時間戳記（毫秒），用於日期比較
```

**日期比較**：轉成 `getTime()` 的毫秒數再比大小

```typescript
if (dateA.getTime() > dateB.getTime()) { /* A 比較晚 */ }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b>Date 物件在 ch34 日期選擇器、ch35 DatePipe、ch56 綜合練習反覆出現，getMonth() 從 0 開始是全課程最經典的陷阱之一。
</div>

<!--
Date 物件單獨拉一頁，因為它是後面 Material 章節的常客。

重點有三個。第一，`new Date()` 不帶參數是現在的時間，帶字串就是指定的日期。第二，`getMonth()` 回傳的是 0 到 11，六月回傳的是 5，這個陷阱每一屆都有人踩。第三，比較日期時，先用 `getTime()` 轉成毫秒數再比大小，結果才會正確。

日期選擇器的 min 和 max，綁的就是 Date 物件，DatePipe 處理的也是 Date 物件，所以這一頁務必熟練。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第四站：Angular 核心觀念
# Ch18–24

<!--
第四站是整套課程的核心：Angular 核心觀念，對應第十八到第二十四章，後面所有章節都建立在這一站之上。
-->

---
layout: default
---

# 第四站速記 — 元件與生命週期（Ch19–20）

<div class="grid grid-cols-2 gap-4">
<div>

**元件四檔案**（Ch20）

| 檔案 | 角色 |
| --- | --- |
| `.ts` | 邏輯與資料 |
| `.html` | 畫面模板 |
| `.scss` | 樣式 |
| `.spec.ts` | 測試 |

**引用元件**：把子元件加進 `imports` 陣列，HTML 用 `<app-header />`

</div>
<div>

**最常用的生命週期**（Ch19）

| Hook | 時機 | 典型用途 |
| --- | --- | --- |
| `constructor` | 建立實體 | 相依注入 |
| `ngOnInit` | 初始化完成 | **呼叫 API、初始化資料** |
| `ngAfterViewInit` | 畫面就緒 | 操作 DOM、**接 paginator** |
| `ngOnDestroy` | 元件銷毀 | **取消訂閱、清理資源** |

</div>
</div>

<!--
元件與生命週期。元件四個檔案各有分工：TypeScript 管邏輯和資料，HTML 管畫面，SCSS 管樣式，spec 是測試。要使用別的元件，就把它加進 `imports` 陣列。

生命週期記四個就夠用。constructor 只負責注入；ngOnInit 做初始化和呼叫 API；ngAfterViewInit 處理需要畫面就緒的事，像是表格接上分頁器，因為 `@ViewChild` 要等畫面建立完才拿得到；ngOnDestroy 負責善後，例如取消訂閱。
-->

---
layout: default
---

# 第四站速記 — 四種繫結（Ch21）

| 繫結 | 語法 | 方向 | 範例 |
| --- | --- | --- | --- |
| 內嵌繫結 | `{{ }}` | TS → HTML | `{{ userName }}` |
| 屬性繫結 | `[屬性]` | TS → HTML | `[disabled]="isLocked"` |
| 事件繫結 | `(事件)` | HTML → TS | `(click)="save()"` |
| 雙向繫結 | `[(ngModel)]` | TS ↔ HTML | `[(ngModel)]="keyword"` |

```html
<input [(ngModel)]="keyword" (keyup)="search()">
<button [disabled]="!keyword" (click)="save()">送出 {{ keyword }}</button>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b>使用 <code>[(ngModel)]</code> 必須在元件 <code>imports</code> 加入 <code>FormsModule</code>，忘記匯入是最常見的報錯原因。
</div>

<!--
四種繫結是 Angular 語法的核心，看符號就能分辨。雙大括號是純顯示；中括號是把 TypeScript 的值塞給 HTML 屬性；小括號是 HTML 的事件呼叫 TypeScript 的方法；中括號包小括號，就是雙向繫結，可以想成香蕉放在盒子裡。

下面這兩行程式碼，把四種繫結全部用上了，大家可以試著指出每個符號屬於哪一種。

最下面的提醒非常重要。`ngModel` 來自 `FormsModule`，忘記匯入的話，會出現 Can't bind to ngModel 的錯誤。看到這個錯誤，第一個反應就是去檢查 `imports` 陣列。
-->

---
layout: default
---

# 第四站速記 — 路由（一）（Ch22）

**設定路由**（app.routes.ts）
```typescript
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user/:id', component: UserComponent },
];
```

**HTML 導航**
```html
<a routerLink="/home"
   routerLinkActive="active">首頁</a>
<router-outlet />
```

<!--
路由我們分兩頁複習，這是前半段。

第一，路由表定義在 `app.routes.ts`，每一筆設定把 path 對應到一個元件。冒號 id 是路由參數的佔位符，代表這一段可以放不同的值。

第二，在 HTML 裡導航，用 `routerLink` 指定要去的路徑，搭配 `routerLinkActive`，替目前所在的頁面加上樣式。`router-outlet` 則是頁面元件實際顯示的位置。
-->

---
layout: default
---

# 第四站速記 — 路由（二）（Ch22）

**TS 導航**
```typescript
private router = inject(Router);
goUser() {
  this.router.navigate(['/user', 5]);
}
```

**取得參數**
```typescript
private route = inject(ActivatedRoute);
// Route Params（/user/5）
const id = this.route.snapshot.paramMap.get('id');
// Query Params（?tab=info）
const tab = this.route.snapshot.queryParamMap.get('tab');
```

<!--
這是路由的後半段。

第三，在 TypeScript 裡導航，先注入 Router，再呼叫 navigate。這適合按下按鈕、判斷完邏輯之後才跳頁的情況。

第四，取得參數要注入 ActivatedRoute。路徑裡的參數，例如斜線 user 斜線 5，用 paramMap 取得；問號後面的參數，例如 tab 等於 info，用 queryParamMap 取得。這兩個很容易搞混，記住一句話：路徑內用 param，問號後用 query。
-->

---
layout: default
---

# 第四站速記 — 資料傳遞三招（Ch23）

| 方式 | 方向 | 適用場景 |
| --- | --- | --- |
| `@Input` | 父 → 子 | 父元件把資料塞給子元件顯示 |
| `@Output` | 子 → 父 | 子元件發事件通知父元件 |
| Service | 任意元件之間 | 跨頁面、跨層級共享資料 |

```typescript
// 子元件
@Input() title: string = '';
@Output() saved = new EventEmitter<string>();

// Service（ng g s services/example 產生）
@Injectable({ providedIn: 'root' })
export class ExampleService { sharedData = ''; }

// 使用端：inject() 現代寫法
private exampleService = inject(ExampleService);
```

<!--
資料傳遞的三招，對應三種距離。

父子元件之間距離最近，往下傳用 `@Input`，往上通知用 `@Output` 搭配 EventEmitter。距離一遠，例如兩個不同路由的頁面，就改用 Service。用 `ng g s` 產生，`providedIn` 設為 root，整個應用程式共用同一份實體，一邊存值，另一邊就能讀到。

注入的寫法有兩種：在 constructor 參數注入是傳統寫法，`inject` 是比較新的寫法。兩種都要看得懂，自己寫的話推薦用 `inject`。
-->

---
layout: default
---

# 第四站速記 — 網頁儲存（Ch24）

| 方式 | 生命週期 | 特性 |
| --- | --- | --- |
| `localStorage` | **永久**（手動清除才消失） | 同網域共享 |
| `sessionStorage` | 分頁關閉即消失 | 僅限該分頁 |
| Cookie | 可設定過期時間 | 會隨請求送到後端；需安裝 `ngx-cookie-service` |

```typescript
// 只能存字串！物件要先轉 JSON
localStorage.setItem('user', JSON.stringify(userObj));
const user = JSON.parse(localStorage.getItem('user') ?? '{}');
```

<!--
網頁儲存的三種方式，用存活時間來區分。

localStorage 會永久保存，適合記住使用者偏好這類設定；sessionStorage 在分頁關閉後就消失，適合一次性的暫存；Cookie 可以設定過期時間，而且會跟著 HTTP 請求送到後端，在 Angular 裡要安裝 `ngx-cookie-service` 來操作。

下面這兩行是必考的組合。Web Storage 只能存字串，所以物件存進去之前要 `JSON.stringify`，取出來之後要 `JSON.parse`，剛好呼應第三站的 JSON 方法。
-->

---
layout: default
---

# 快問快答 ②（第三、四站）

1. `ngOnInit` 跟 `constructor` 都在元件建立初期執行，呼叫 API 應該放哪個？為什麼？
2. `[(ngModel)]` 報錯「Can't bind to ngModel」，第一步檢查什麼？
3. 網址 `/product/12?from=list`，`12` 跟 `list` 分別用什麼方法取得？
4. 兩個**沒有父子關係**的元件要共享一個購物車數量，用什麼方式？
5. 要把物件存進 `localStorage`，直接 `setItem('cart', cartObj)` 會發生什麼事？

<!--
第二次快問快答，範圍是 TypeScript 和 Angular 核心觀念，五題都先自己想過一遍。

第五題很實務：如果直接把物件交給 setItem，JavaScript 會自動把它轉成 object Object 這串文字，原本的資料就不見了。想一想，正確的寫法是什麼。
-->

---
layout: default
---

# 快問快答 ② — 參考解答

1. 放 **`ngOnInit`**。`constructor` 只負責注入，執行時元件輸入與初始化尚未完成；`ngOnInit` 才是官方建議的初始化時機（Ch19）
2. 檢查元件 `imports` 是否加入 **`FormsModule`**（Ch21）
3. `12` 用 `route.snapshot.paramMap.get('id')`（Route Params）；`list` 用 `route.snapshot.queryParamMap.get('from')`（Query Params）（Ch22）
4. 建立 **Service**（`providedIn: 'root'`），兩個元件都注入同一份實體（Ch23）
5. 會存成 `"[object Object]"`，資料遺失。正確作法：`setItem('cart', JSON.stringify(cartObj))`，取出時 `JSON.parse`（Ch24）

<!--
我們來對答案。

第一題，constructor 只負責注入，真正的初始化交給 ngOnInit。第二題的 FormsModule，是全課程最常見的錯誤。第三題再複習一次口訣：路徑內用 param，問號後用 query。第四題，只要元件之間沒有直接的父子關係，Service 就是標準答案。第五題，記得 stringify 和 parse 要成對使用。

五題都答對，第三、四站就可以放心；有答錯的，回到對應章節再讀一次。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第五站：模板語法與資料處理
# Ch25–30

<!--
第五站是模板語法與資料處理，對應第二十五到第三十章。從這一站開始，畫面要和真實的資料互動了。
-->

---
layout: default
---

# 第五站速記 — 控制流程語法（一）（Ch25–26）

**@for 陣列顯示**（Ch25）
```html
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <p>目前沒有資料</p>
}
```

**@if 條件顯示**（Ch26）
```html
@if (score >= 90) { <p>優秀</p> }
@else if (score >= 60) { <p>及格</p> }
@else { <p>不及格</p> }
```

- `track` 為**必填**，幫 Angular 辨識每筆資料

<!--
控制流程語法的前半段，先看 `@for` 和 `@if`。

`@for` 取代了舊版的 ngFor，其中的 track 是必填的，通常綁定唯一的 id，讓 Angular 知道是哪一筆資料改變了，只重新繪製那一筆。`@empty` 是陣列為空時顯示的內容，綜合練習的已封存清單就用到了它。

`@if`、`@else if`、`@else` 的結構，和 TypeScript 的 if 完全一樣，只是搬到了模板裡。
-->

---
layout: default
---

# 第五站速記 — 控制流程語法（二）（Ch27）

**@switch 條件切換**（Ch27）
```html
@switch (status) {
  @case ('success') { <p>成功</p> }
  @case ('error')   { <p>失敗</p> }
  @default          { <p>處理中</p> }
}
```

- 條件 2–3 個用 `@if`，多分支等值判斷用 `@switch`

<!--
控制流程語法的後半段，是 `@switch`。

`@switch` 適合同一個值有很多種可能的情況，例如訂單狀態，或是 HTTP 狀態碼的分類。括號裡放要判斷的值，每個 `@case` 對應一種結果，全部都不符合時，就顯示 `@default` 的內容。

選擇的原則很簡單：只有兩三個條件，用 `@if` 就好；如果是同一個值的多個分支，換成 `@switch` 會比較清楚。
-->

---
layout: default
---

# 第五站速記 — 串接 API（Ch28）

**三步驟**：註冊 → 包 Service → 元件訂閱

```typescript
// ① app.config.ts
providers: [provideHttpClient()]

// ② Service：包裝 HttpClient
private http = inject(HttpClient);
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('https://api.example.com/users');
}

// ③ 元件：subscribe 訂閱取得結果
this.userService.getUsers().subscribe(data => {
  this.users = data;
});
```

**四種 HTTP 方法**：`get`（查）、`post`（增）、`put`（改）、`delete`（刪）

<!--
串接 API 有標準的三個步驟。

第一步，在 `app.config.ts` 註冊 `provideHttpClient`。這一步只要做一次，忘記的話，注入 HttpClient 時會直接報錯。第二步，把 HTTP 呼叫包在 Service 裡，元件不直接使用 HttpClient，各自負責自己的工作。第三步，元件呼叫 Service 的方法之後要 subscribe，因為 HttpClient 回傳的是 Observable，沒有訂閱，請求根本不會發出去。

最下面的四種 HTTP 方法，對應資料的增查改刪：get 查詢、post 新增、put 修改、delete 刪除。
-->

---
layout: default
---

# 第五站速記 — Interface（一）（Ch29）

**Interface 定義資料形狀**（Ch29）
```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  note?: string;  // ? = 可選屬性
}
```
- `ng g i interfaces/product` 產生獨立檔案
- API 回傳資料都應該定義 interface，取代 `any`

<!--
Interface 用來定義資料的形狀。

先說好資料有哪些欄位、各是什麼型別，之後 API 回傳的資料、表格的每一列，都可以套上這個型別。屬性名稱打錯的時候，編輯器會馬上提醒我們。

屬性後面加問號，代表它是可選的，有沒有這個欄位都合法。課程的慣例是用 `ng g i` 產生獨立的檔案，放在 interfaces 資料夾。API 回傳的資料都應該定義 interface，用來取代 any。
-->

---
layout: default
---

# 第五站速記 — 排序（二）（Ch30）

**sort() 排序**（Ch30）
```typescript
// 數字升冪：a - b；降冪：b - a
list.sort((a, b) => a.price - b.price);

// 切換排序欄位
sortBy(key: 'price' | 'id') {
  this.list.sort((a, b) => a[key] - b[key]);
}
```
- 回傳負數 → a 在前；正數 → b 在前

<!--
排序的核心是比較函式的回傳值。回傳負數，a 排在前面；回傳正數，b 排在前面。所以數字要升冪就寫 a 減 b，降冪就寫 b 減 a，這個公式直接記起來。

下面的 sortBy，把要比較的欄位當作參數傳進來，同一個方法就能切換用價格或用 id 排序。表格資料和綜合練習的員工列表，用的都是同一套邏輯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第六站：Angular Material
# Ch31–42

<!--
第六站是 Angular Material，對應第三十一到第四十二章，是最大的一站，學習模式也最固定。
-->

---
layout: default
---

# 第六站速記 — Material 元件總表（一）

| 元件 | 關鍵模組 | 一句話重點 | 章節 |
| --- | --- | --- | --- |
| 安裝 | `ng add @angular/material` | 選主題、動畫、全域字型 | Ch31 |
| Mat-table | `MatTableModule` | `dataSource` + `matColumnDef` 定義欄位 | Ch32 |
| 分頁器 | `MatPaginatorModule` | `ngAfterViewInit` 把 `@ViewChild` 的 paginator 接上 dataSource | Ch32 |
| Mat-icon | `MatIconModule` | 名稱查 Google Fonts Icons，`<mat-icon>home</mat-icon>` | Ch33 |
| Datepicker | `MatDatepickerModule` | **必加 `provideNativeDateAdapter()`**；`[min]`／`[max]` 限制範圍 | Ch34 |
| Tabs | `MatTabsModule` | `mat-tab-group` 包 `mat-tab label="..."` | Ch39 |
| Select | `MatSelectModule` | `mat-select` + `mat-option`，用 `ngModel` 綁值 | Ch40 |

<!--
Material 元件我們用三張總表複習。使用方法是：遮住右邊兩欄，看到元件名稱，試著說出它的模組和重點。

先點名幾個常見的陷阱。mat-table 要顯示哪些欄位，由 displayedColumns 陣列決定，matColumnDef 的名稱要和陣列裡的字串一致。分頁器一定要在 ngAfterViewInit 裡接上，因為要等畫面建立完才拿得到。日期選擇器忘記加 `provideNativeDateAdapter`，日曆會直接壞掉。
-->

---
layout: default
---

# 第六站速記 — Material 元件總表（二）

| 元件 | 關鍵模組 | 一句話重點 | 章節 |
| --- | --- | --- | --- |
| Dialog | `MatDialogModule` | `dialog.open(元件, { data })`；內部注入 `MAT_DIALOG_DATA` 收資料 | Ch42 |
| Sidenav | `MatSidenavModule` | 三種模式：`over`（覆蓋）／`push`（推擠）／`side`（並排） | Ch48 |
| Toolbar | `MatToolbarModule` | Spacer 技巧：`flex: 1 1 auto` 把按鈕推到右邊 | Ch49 |
| Menu／Badge | `MatMenuModule`、`MatBadgeModule` | 下拉選單與角標提示 | Ch49 |

<!--
第二張總表。

Dialog 的資料流要熟悉：呼叫端用 `dialog.open` 開啟，透過 data 把資料傳進去；Dialog 元件內部注入 `MAT_DIALOG_DATA` 接收資料，注入 MatDialogRef 控制關閉。

Sidenav 有三種模式：over 蓋在內容上面，push 把內容推開，side 和內容並排，後台版型最常用的是 side。Toolbar 用 Spacer 把按鈕推到最右側，Menu 和 Badge 則是下拉選單和角標提示。
-->

---
layout: default
---

# 第六站速記 — Material 元件總表（三）

| 元件 | 關鍵模組 | 一句話重點 | 章節 |
| --- | --- | --- | --- |
| Radio | `MatRadioModule` | `mat-radio-group` 綁 `ngModel`，單選 | Ch50 |
| Checkbox | `MatCheckboxModule` | 每個選項各綁一個 boolean，複選 | Ch50 |
| Spinner | `MatProgressSpinnerModule` | `mat-spinner` 搭配 Loading 狀態顯示 | Ch46 |

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 通用模式：<b>裝套件 → 元件 imports 加模組 → 抄官方 HTML 結構 → 客製化</b>。報錯先檢查模組有沒有匯入。
</div>

<!--
第三張總表。radio 和 checkbox 的差別在於：radio 是一組裡面選一個，整組綁同一個變數；checkbox 每個選項各自獨立，各綁一個 boolean。Spinner 則是搭配 Loading 狀態顯示的轉圈圈。

最下面的通用模式，是這一站最重要的能力。所有 Material 元件都是同一套流程，遇到報錯，第一個反應永遠是：模組匯入了沒有。
-->

---
layout: default
---

# 第六站速記 — Pipe 與 ngClass（Ch35–36, 38）

**兩個常用 Pipe**（需 `CommonModule`）
```html
<!-- DatePipe（Ch35） -->
{{ hireDate | date: 'yyyy/MM/dd' }}

<!-- JsonPipe（Ch36）：搭配 pre 保留排版 -->
<pre>{{ user | json }}</pre>
```

**ngClass 三種用法**（Ch38）
```html
<td [ngClass]="{ 'high': e.salary >= 60000 }">
<div [ngClass]="statusClass">
<div [ngClass]="getClass(item)">
```

<!--
接著是兩個常用的 Pipe 和 ngClass。

DatePipe 把 Date 物件排版成指定的格式，要注意大小寫，大寫 MM 是月份，小寫 mm 是分鐘，寫錯不會報錯，但顯示出來會很奇怪。JsonPipe 是開發時檢查資料的好幫手，搭配 pre 標籤才會保留縮排。這兩個 pipe 都需要匯入 CommonModule。

ngClass 有三種用法：物件寫法適合依條件高亮，像綜合練習的薪水高亮；變數寫法適合切換狀態；方法回傳則適合比較複雜的邏輯。
-->

---
layout: default
---

# 第六站速記 — 即時搜尋與圓餅圖（Ch37, 41）

**即時搜尋套路**（Ch37）
```html
<input [(ngModel)]="keyword" (keyup)="applyFilter()">
```
```typescript
applyFilter() {
  this.dataSource.data = this.items.filter(
    e => e.name.indexOf(this.keyword) !== -1
  );
}
```

**圓餅圖**（Ch41）：`npm install chart.js`，`new Chart(canvas, { type: 'pie', data, options })`

<!--
即時搜尋的寫法要熟：`keyup` 觸發，`ngModel` 保存關鍵字，用 filter 搭配 indexOf 過濾，最後把結果指定給 `dataSource.data`。

注意，過濾的來源永遠是完整的原始陣列 `this.items`，而不是已經過濾過的結果，否則資料會越搜越少。

圓餅圖使用 chart.js 套件。用 npm 安裝之後，拿 canvas 元素建立一個 Chart，type 指定為 pie，再把資料和選項傳進去，就能畫出圖表。
-->

---
layout: default
---

# 快問快答 ③（第五、六站）

1. `@for` 少寫 `track` 會怎樣？`track` 通常綁什麼？
2. 呼叫 `this.http.get(...)` 之後沒有 `subscribe`，請求會發出去嗎？
3. mat-table 的分頁器沒反應，最可能漏了哪一步？
4. mat-datepicker 日曆打不開或報錯，九成是少了什麼設定？
5. 搜尋框先過濾出 3 筆結果，接著在**這 3 筆**上再輸入新關鍵字過濾，會有什麼 bug？正確作法是？

<!--
第三次快問快答，範圍是第五、六站，都是實作時真的會遇到的狀況。

第五題是即時搜尋最經典的邏輯錯誤，大家想清楚，每次過濾的來源應該是誰。
-->

---
layout: default
---

# 快問快答 ③ — 參考解答

1. 直接**編譯錯誤**——新版 `@for` 的 `track` 是必填；通常綁唯一值如 `item.id`（Ch25）
2. **不會**。Observable 是惰性的，`subscribe` 才會真正發出請求（Ch28, Ch44）
3. 漏了在 `ngAfterViewInit` 中執行 `this.dataSource.paginator = this.paginator`（Ch32）
4. `providers` 少了 **`provideNativeDateAdapter()`**（Ch34）
5. 越搜越少、刪字也回不來——因為資料來源被覆寫了。正確作法：**每次都從完整的原始陣列**（如 `this.items`）重新 `filter`，把結果指定給 `dataSource.data`（Ch37）

<!--
我們來對答案。

第一題，新版的 track 是必填，少寫會直接編譯錯誤。第二題，Observable 是惰性的，沒有人訂閱就不會執行，這和 Promise 一建立就執行不同，第七站還會再提到。第三題和第四題，是 Material 最常見的兩個錯誤，建議列進自己的檢查清單。第五題的原則是：原始資料不要動，顯示的資料每次重新計算，綜合練習的 applyFilters 就是完整的示範。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第七站：非同步、RxJS 與狀態管理
# Ch43–47

<!--
第七站是非同步、RxJS 與狀態管理，對應第四十三到第四十七章，處理資料還沒回來時畫面怎麼辦，認識 Angular 背後的 RxJS，以及多個元件怎麼共享狀態。
-->

---
layout: default
---

# 第七站速記 — 同步與非同步（Ch43）

```typescript
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');
// 輸出順序：1 → 3 → 2
```

| 寫法 | 特性 |
| --- | --- |
| `setTimeout` | 最基本的延遲執行 |
| `Promise` + `then` | 一次性的非同步結果 |
| `async` / `await` | 用同步的寫法處理非同步 |
| Observable | 可多次發值、可取消，Angular 主力 |

**同步**：一行做完才做下一行；**非同步**：先登記、先往下走，結果好了再回來

<!--
非同步的觀念，用上面這三行程式碼來建立。即使 setTimeout 的延遲設為 0，輸出順序還是 1、3、2。因為非同步的工作會先排進佇列，等同步的程式全部跑完，才輪到它執行。這也是為什麼 API 回來的資料，要在 subscribe 裡面處理。

四種非同步寫法由淺入深：setTimeout 是最基本的延遲執行；Promise 處理一次性的結果；async 和 await 讓非同步看起來像同步；Observable 可以多次發出值，也可以取消，是 Angular 的主力。
-->

---
layout: default
---

# 第七站速記 — RxJS 核心概念（Ch44）

| 概念 | 角色 |
| --- | --- |
| Observable（可觀察者） | 資料的生產者，**惰性**：有人訂閱才執行 |
| Observer（觀察者） | 消費者：`next`／`error`／`complete` 三個回呼 |
| Subscription | 訂閱憑證，`unsubscribe()` 取消；`add()` 可統一管理多個訂閱 |
| Subject | 既是 Observable 也是 Observer，一對多廣播的橋接器 |
| Operators | `pipe()` 串接 `map`、`filter` 等運算子加工資料流 |

**vs Promise**：Promise 建立就執行、只發一次值、不能取消；Observable 訂閱才執行、可發多次、可取消

<div class="mt-2 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ 元件銷毀時（`ngOnDestroy`）務必 `unsubscribe()`，否則造成記憶體洩漏 — 尤其是 `interval` 這類不會自己結束的 Observable。
</div>

<!--
RxJS 的五個概念，用一張表整理。Observable 是資料的生產者，而且是惰性的，有人訂閱才會執行；Observer 是消費者，有 next、error、complete 三個回呼；Subscription 是訂閱的憑證，用 unsubscribe 取消；Subject 可以一對多廣播；Operators 用 pipe 串接，加工資料流。

和 Promise 的差異有三點：執行時機、發出值的次數，以及能不能取消。

最下面的警告最重要：訂閱了，就要在 ngOnDestroy 退訂，否則元件消失了，訂閱還在，就會造成記憶體洩漏。
-->

---
layout: default
---

# 第七站速記 — 訂閱與狀態共享（Ch45）

**Service 三步驟：宣告 Subject → 公開 Observable → next() 更新**

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private cartCountSubject = new BehaviorSubject<number>(0); // ① 私有 Subject
  cartCount$ = this.cartCountSubject.asObservable();         // ② 公開 Observable（$ 字尾）

  addToCart() {
    this.cartCountSubject.next(this.cartCountSubject.value + 1); // ③ next() 通知所有訂閱者
  }
}
```

```typescript
// 元件端：訂閱
this.cartService.cartCount$.subscribe(count => this.count = count);
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>BehaviorSubject</b> 需要初始值、新訂閱者立刻收到最新值 — 最適合「狀態」；<b>Subject</b> 只收得到訂閱後發生的事件。
</div>

<!--
這一頁是訂閱與狀態共享的核心寫法，也是 Angular 專案最常見的狀態共享模式。

三個步驟要能自己寫出來：第一，宣告一個私有的 Subject 負責保存狀態；第二，用 asObservable 公開一個唯讀的版本給外面訂閱，命名習慣在後面加上錢字號；第三，用 next 發出新的值，通知所有訂閱者。

私有加公開是刻意的設計。外面的元件只能訂閱，不能直接呼叫 next，狀態的變更全部集中在 Service 的方法裡，出問題時才知道去哪裡找。

購物車數量、登入狀態這類的狀態，用 BehaviorSubject，因為新的訂閱者需要立刻拿到目前的值；單純的事件通知，才用 Subject。
-->

---
layout: default
---

# 第七站速記 — Loading 全域架構（Ch46）

**問題**：等 API 時畫面沒回饋 → **解法**：全域 Loading 遮罩

| 角色 | 職責 |
| --- | --- |
| `LoadingService` | `BehaviorSubject<boolean>` 管理 loading 狀態 |
| `HttpInterceptor` | **攔截所有 HTTP 請求**：發出時 `show()`、完成時 `hide()` |
| `AppComponent` | 訂閱 `loading$`，控制 spinner 顯示 |
| CSS Overlay | `position: fixed` 全螢幕遮罩 + 置中 spinner |

```html
<!-- async pipe：自動訂閱、自動退訂 -->
@if (loading$ | async) {
  <div class="overlay"><mat-spinner /></div>
}
```

<!--
Loading 是把訂閱與狀態共享，套用到真實需求的完整例子。

四個角色各有分工。LoadingService 用 BehaviorSubject 管理是否載入中；HttpInterceptor 是關鍵，它攔截所有 HTTP 請求，發出時打開 loading，回來時關閉，各個頁面不用自己處理；AppComponent 負責訂閱和顯示；CSS 用 fixed 的遮罩擋住畫面。

HTML 裡的 async pipe 值得特別記住。它會自動訂閱，元件銷毀時也會自動退訂，是在模板裡使用 Observable 最好的寫法。
-->

---
layout: default
---

# 第七站速記 — Signals（Ch47）

```typescript
count = signal(0);                          // 建立：必須給初始值
double = computed(() => this.count() * 2);  // 衍生值：相依變了自動重算
increment() {
  this.count.set(5);                 // 直接設值
  this.count.update(v => v + 1);     // 由舊值算新值
}
constructor() {
  effect(() => console.log('count 變成', this.count()));  // 監聽變化
}
```

```html
<p>{{ count() }} 的兩倍是 {{ double() }}</p>  <!-- 讀值要加 () -->
```

| 場景 | 用 Signal | 用 Observable |
| --- | --- | --- |
| 同步狀態（計數、開關、購物車） | ✅ | 可以但繞路 |
| 非同步（API、事件流） | ❌ | ✅ |

<!--
Signals 是 Angular 比較新的狀態管理方式。和 Observable 相比，它讓讀值變得很直覺，不用 subscribe，直接呼叫就能拿到目前的值。要記得加小括號，在模板裡也一樣，這是最容易忘記的地方。

這裡用到五個 API：signal 建立狀態，必須給初始值；set 直接設定新值；update 根據舊值算出新值；computed 建立衍生值，相依的 signal 一改變就會自動重新計算；effect 則是監聽變化，做額外的處理。

最下面的表格是 Signals 的結論：同步的狀態用 Signal 比較簡潔，但非同步的情況，例如等待 API，仍然是 Observable 的強項，兩者是互補，不是取代。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第八站：版面與表單
# Ch48–53

<!--
第八站是版面與表單，對應第四十八到第五十三章。這一站做完，一個完整的後台系統就成形了。
-->

---
layout: default
---

# 第八站速記 — Reactive Forms（Ch51）

**三個積木**

| 積木 | 角色 | HTML 繫結 |
| --- | --- | --- |
| `FormControl` | 單一欄位 | `formControlName` |
| `FormGroup` | 多欄位容器 | `[formGroup]`／`formGroupName` |
| `FormArray` | **數量不固定**的欄位列表 | `formArrayName` |

```typescript
form = new FormGroup({
  title: new FormControl(''),
  questions: new FormArray<FormGroup>([]),
});

get questions() { return this.form.get('questions') as FormArray; }
addQuestion()    { this.questions.push(new FormGroup({ text: new FormControl('') })); }
removeQuestion(i: number) { this.questions.removeAt(i); }
```

<!--
Reactive Forms 的核心，是三個積木的層級關係。FormControl 是一個欄位，FormGroup 把多個欄位包成一組，FormArray 管理數量會變動的欄位，像問卷題目可以一直新增和刪除，就是 FormArray 的用途。

程式碼是動態問卷的骨架：getter 把 FormArray 取出來方便操作，push 新增一題，removeAt 刪除指定位置的題目。HTML 的繫結要對應記住：formGroup 綁最外層，formControlName 綁欄位，formArrayName 綁陣列，再用 `@for` 跑過 controls，把每一題畫出來。
-->

---
zoom: 0.83
layout: default
---

# 第八站速記 — Validators 驗證（Ch52）

```typescript
email: new FormControl('', [Validators.required, Validators.email]),
password: new FormControl('', [
  Validators.required,
  Validators.minLength(8),
  Validators.pattern(/^(?=.*[a-z])(?=.*\d).+$/),  // Regex 自訂規則
]),
```

| 常用 Validator | 驗證內容 |
| --- | --- |
| `required` | 必填 |
| `minLength(n)`／`maxLength(n)` | 長度下限／上限 |
| `email` | Email 格式 |
| `pattern(regex)` | 正規表達式自訂規則 |

**狀態屬性**：`valid`／`invalid`、`touched`（碰過）、`dirty`（改過）

```html
@if (form.get('email')?.invalid && form.get('email')?.touched) {
  <span class="error">請輸入正確的 Email</span>
}
```

<!--
Validators 寫在 FormControl 的第二個參數，是一個陣列，可以同時放好幾個，全部通過，欄位才算 valid。四個內建的驗證要熟悉，更複雜的規則用 pattern 搭配正規表達式，例如密碼要同時包含小寫字母和數字。

錯誤訊息什麼時候顯示是重點。不能只判斷 invalid，要搭配 touched，也就是使用者碰過這個欄位，才顯示錯誤，否則表單一打開就滿是紅字。touched 是點進去再離開，dirty 是值被改過，兩者要分清楚。
-->

---
layout: default
---

# 第八站速記 — RWD 響應式設計（Ch53）

```scss
.container { display: flex; gap: 1rem; }

/* 寬度 768px 以下：改直向堆疊 */
@media (max-width: 768px) {
  .container { flex-direction: column; }
}
```

| 斷點 | 裝置 |
| --- | --- |
| `max-width: 576px` | 手機 |
| `max-width: 768px` | 平板直向 |
| `max-width: 992px` | 平板橫向／小筆電 |

**響應式單位**：`%`（相對父層）、`vw`／`vh`（相對視窗）、`rem`（相對根字級）優於寫死的 `px`

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 開發時用瀏覽器 DevTools 的裝置模擬（Responsive 模式）即時檢查各斷點的畫面。
</div>

<!--
RWD 的核心是 media query。先寫桌面版的樣式，再用 `@media` 加上 max-width，在小螢幕時覆蓋掉。這裡又用到後蓋前，media query 要寫在一般規則的後面才蓋得掉。

表格裡的三個斷點最常用，其中 768 最重要，通常平板以下就改成直向排列。搭配 flex-direction 從 row 切換成 column，就是最簡單有效的 RWD 寫法。

單位能用相對的，就不要寫死 px。百分比相對父層，vw 和 vh 相對視窗，rem 相對根元素的字級，畫面才會跟著螢幕縮放。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第九站：打包與部署上線
# Ch54–55

<!--
最後一站是打包與部署上線，對應第五十四到第五十五章，把作品真正放上網路。
-->

---
layout: default
---

# 第九站速記 — ng build 打包（Ch54）

```bash
ng build
```

- 產出 `dist/` 資料夾：壓縮過的 HTML／JS／CSS 靜態檔案
- 部署的就是 `dist/專案名/browser` 的內容
- **Bundle Budget 超標**：在 `angular.json` 調整 `budgets` 上限

<!--
最後一哩路的第一步是打包。`ng build` 把整個專案壓縮成純靜態的檔案，放在 dist 資料夾裡，真正要部署的，是 dist 底下專案名稱裡的 browser 資料夾。

這包檔案放到任何靜態主機都能執行。如果打包時出現 Bundle Budget 的錯誤，代表打包後的檔案超過了 `angular.json` 設定的大小上限，可以到 budgets 調整。
-->

---
layout: default
---

# 第九站速記 — Firebase Hosting 部署（Ch55）

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

- Public directory 指向 build 產出目錄
- **SPA 模式選 Yes**：所有路徑都導回 `index.html`，路由才不會 404

**上線流程**：`ng build` → `firebase init hosting` → `firebase deploy` → 取得正式網址 🎉

<!--
部署到 Firebase 只要四個指令：安裝 CLI、登入、初始化，然後部署。

初始化時，public directory 要指向打包出來的資料夾，而最關鍵的是 SPA 模式要選 Yes。Angular 是單頁應用，路由都由前端處理，如果沒有把所有路徑導回 `index.html`，使用者直接輸入子頁面的網址，或按重新整理，就會出現 404。

部署成功後會拿到正式的網址，作品就真的上線了。
-->

---
layout: default
---

# 快問快答 ④（第七、八、九站）

1. 為什麼 Service 裡的 Subject 要宣告成 `private`，再另外公開 `asObservable()`？
2. 購物車數量這種「同步狀態」，用 `BehaviorSubject` 還是 `Subject`？用 Signal 可以嗎？
3. Signal 在 template 讀值，`{{ count }}` 跟 `{{ count() }}` 哪個對？
4. 表單錯誤訊息為什麼要判斷 `invalid && touched`，只判斷 `invalid` 會怎樣？
5. Angular 部署到 Firebase 後，首頁正常、但**重新整理子頁面就 404**，是哪個設定沒做對？

<!--
最後一輪快問快答，範圍是後面三站，一樣先自己想過一遍。第五題是部署之後最常見的狀況，答案就在剛剛的部署頁裡。
-->

---
layout: default
---

# 快問快答 ④ — 參考解答

1. 讓外部**只能訂閱、不能直接 `next()`**，狀態變更集中在 Service 方法內，可控又好除錯（Ch45）
2. `BehaviorSubject`（新訂閱者需要立刻拿到目前數量）；可以，同步狀態正是 **Signal 的主場**，寫法更簡潔（Ch45, Ch47）
3. `{{ count() }}` — Signal 讀值必須以函式呼叫形式（Ch47）
4. 表單一載入所有必填欄位都是 `invalid`，會**還沒輸入就滿版錯誤訊息**；加上 `touched` 才會等使用者碰過欄位再提示（Ch52）
5. `firebase init hosting` 時 **SPA 模式沒選 Yes**——需要把所有路徑 rewrite 回 `index.html`，讓 Angular 路由接手（Ch55）

<!--
我們來對答案。

第一題是封裝的觀念，狀態只能透過 Service 的方法改變。第二題順便複習 Signal 和 Observable 的分工：同步狀態用 Signal 更簡潔，非同步仍然用 Observable。第三題的小括號，是 Signals 最容易犯的語法錯誤。第四題的 touched，直接影響使用者的體驗。第五題記住 SPA 要導回 `index.html`，以後換成其他靜態主機部署，也是同樣的設定。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 全課程易錯重點
# Top 10

<!--
最後，我們把各章的注意事項，濃縮成十個最常踩雷的重點，可以當成除錯時的檢查清單。
-->

---
layout: default
---

# 易錯重點 Top 10（前五）

| # | 易錯點 | 正確作法 | 章節 |
| --- | --- | --- | --- |
| 1 | `ngModel` 報錯 Can't bind | 元件 `imports` 加 `FormsModule` | Ch21 |
| 2 | Pipe（date／json）沒作用 | 元件 `imports` 加 `CommonModule` | Ch35–36 |
| 3 | `http.get()` 沒反應 | Observable 惰性 — 要 `subscribe()`；且 `app.config.ts` 要有 `provideHttpClient()` | Ch28 |
| 4 | mat-datepicker 壞掉 | `providers` 加 `provideNativeDateAdapter()` | Ch34 |
| 5 | 分頁器不動 | `ngAfterViewInit` 裡 `dataSource.paginator = this.paginator` | Ch32 |

<!--
前五條都和設定漏掉有關，共同的除錯原則是：元件相關的錯誤，先看 imports 陣列；注入相關的錯誤，先看 providers。

第一條的 FormsModule 出現得最頻繁，畫面上只要有 ngModel，就要想到它。第二條的 CommonModule，負責 DatePipe 和 JsonPipe。第三條有兩層：全域要註冊 provideHttpClient，呼叫端要 subscribe。第四、五條是 Material 的兩個常見錯誤，前面的快問快答已經考過了。
-->

---
layout: default
---

# 易錯重點 Top 10（後五）

| # | 易錯點 | 正確作法 | 章節 |
| --- | --- | --- | --- |
| 6 | 訂閱忘記退訂 → 記憶體洩漏 | `ngOnDestroy` 呼叫 `unsubscribe()`，或改用 `async` pipe | Ch44, 45 |
| 7 | 過濾／搜尋越搜越少 | 永遠從**完整原始陣列**重新 `filter`，不要改到資料來源 | Ch37 |
| 8 | `localStorage` 存物件變 `[object Object]` | 進 `JSON.stringify`、出 `JSON.parse` | Ch24 |
| 9 | `getMonth()` 少一個月 | 月份從 **0** 開始，顯示時 `+1` 或交給 `DatePipe` | Ch17, 35 |
| 10 | 樣式寫了沒生效 | CSS **後蓋前** — 檢查是否被後面的規則（或更晚載入的檔案）覆蓋 | Ch9, 11 |

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 把這十條抄進筆記。實務上八成的「程式不會動」都落在這張清單裡。
</div>

<!--
後五條偏向邏輯和觀念。

第六條，訂閱和退訂要成對出現，模板裡能用 async pipe 就用，它會自動退訂。第七條，原始資料不要動，顯示的資料每次重新計算。第八條和第九條，是 JavaScript 本身的特性，記下來就好。第十條回到 CSS 最基本的後蓋前，樣式沒生效時，打開開發者工具，看是誰蓋掉了誰。

這十條都不是不會寫，而是忘記了。實作卡住時掃一遍，就能省下很多除錯時間。
-->

---
layout: default
---

# 總複習收尾 — 你已經走完的路

<div class="grid grid-cols-3 gap-4 mt-4">
  <div class="p-4 rounded-lg text-left" style="border: 2px solid #5eada0; background: #f0faf9;">
    <div style="color: #1a5c5c; font-weight: 900; font-size: 1.1rem;">🏗️ 基礎工程</div>
    <div class="text-sm mt-2" style="color: #4a7c7c;">環境建置・HTML/CSS・TypeScript — 你能從零刻出有邏輯的畫面</div>
  </div>
  <div class="p-4 rounded-lg text-left" style="border: 2px solid #5eada0; background: #f0faf9;">
    <div style="color: #1a5c5c; font-weight: 900; font-size: 1.1rem;">⚙️ Angular 開發</div>
    <div class="text-sm mt-2" style="color: #4a7c7c;">元件・繫結・路由・API・Material — 你能組出完整功能的系統</div>
  </div>
  <div class="p-4 rounded-lg text-left" style="border: 2px solid #5eada0; background: #f0faf9;">
    <div style="color: #1a5c5c; font-weight: 900; font-size: 1.1rem;">🚀 進階與上線</div>
    <div class="text-sm mt-2" style="color: #4a7c7c;">RxJS・Signals・表單驗證・RWD・部署 — 你的作品已經可以見人</div>
  </div>
</div>

**接下來的建議**

1. 回頭把 **綜合練習 Ch1–30**（四張規格書）與 **綜合練習 Ch32–39**（員工管理系統）不看解答再做一次
2. 快問快答有答錯的站，回到對應章節重讀
3. 用學過的技術做一個**自己的題目**，部署到 Firebase，放進履歷

<!--
最後，我們回頭看看這一路走過的三個階段：基礎工程、Angular 開發，以及進階與上線。每一塊我們都實際動手做過，不只是聽過而已。

接下來有三個建議。第一，不看解答，把兩個綜合練習再做一次。第二，回到快問快答答錯的章節重讀。第三，找一個自己有興趣的題目，用學過的技術做出來，部署上線，放進履歷。
-->

---
layout: end
---

# 課程結束
### 55 章、九大階段、一條從零到上線的完整路徑 — 總複習完成！

<!--
總複習到這裡結束。這一章沒有教新的東西，而是把五十五章的內容，整理成一張隨時可以翻閱的地圖：九站速記、四輪快問快答，以及十條易錯重點。

之後不管是考試、面試，還是開發時卡關，都可以回到這一章，找到對應的章節。恭喜大家完成整套課程，辛苦了。
-->
