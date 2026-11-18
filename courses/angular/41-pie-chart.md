---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 圓餅圖
routeAlias: ch41
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
    圓餅圖
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「以 Chart.js 繪製互動式圓餅圖與各類圖表」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學了下拉選單。這一章要學怎麼在 Angular 裡畫圓餅圖。

記帳時，把支出用文字列出來不太直覺，換成圓餅圖，一眼就能看出哪個項目佔比最大。這一章會使用 Chart.js，學會安裝、準備資料，並畫出一個圓餅圖。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Chart.js 簡介與圖表類型

<!--
我們先來認識 Chart.js，看看它是什麼，能畫出哪些圖表。
-->

---

# Chart.js 簡介

Chart.js 是一套基於 HTML5 `<canvas>` 的開源圖表函式庫，可在 Angular 專案中直接引用。

| 圖表類型 | 說明 |
| --- | --- |
| 長條圖（Bar chart） | 比較各類別數值大小 |
| 直線圖（Line chart） | 呈現數值的趨勢變化 |
| 圓餅圖（Pie chart） | 顯示各部分佔整體的比例 |
| 環狀圖（Doughnut chart） | 圓餅圖的中空變形版本 |
| 泡泡圖（Bubble chart） | 以座標與泡泡大小呈現三維資料 |
| 混合圖（Mixed chart） | 結合兩種以上圖表類型 |

<!--
Chart.js 是一套開源的圖表函式庫，它使用 HTML5 的 `canvas` 畫布來繪圖，可以直接在 Angular 專案裡使用。

可以把它想成一個畫圖工具箱，我們只要準備好資料，告訴它要畫哪一種圖，它就會自動算比例、上色、畫出來。

表格列出了六種圖表類型：長條圖用來比較數值大小，直線圖呈現趨勢變化，圓餅圖顯示各部分佔整體的比例，環狀圖是中間空心的圓餅圖，泡泡圖用座標和泡泡大小呈現資料，混合圖則結合多種類型。這一章以圓餅圖為主。

實務上，在儀表板和報表系統裡，這類圖表函式庫非常常見。
-->

---

# 各圖表類型示意

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**長條圖（Bar Chart）**

<img src="/images/41-pie-chart/bar-chart-monthly-sales.png" class="rounded shadow-md max-h-80 max-w-full" />

</div>
<div>

**直線圖（Line Chart）**

<img src="/images/41-pie-chart/line-chart-monthly-sales.png" class="rounded shadow-md max-h-80 max-w-full" />

</div>
</div>

<!--
我們看兩種常見圖表的實際樣子。

長條圖適合比較不同類別的數值，例如每個月的業績高低。直線圖適合看趨勢，例如業績是逐月上升還是下降。

選擇圖表類型時，可以先想資料的性質，再決定用哪一種呈現最清楚。
-->

---

# 各圖表類型示意（續）

<div class="grid grid-cols-2 gap-4 my-3">
<div>

**圓餅圖（Pie / Doughnut Chart）**

<img src="/images/41-pie-chart/doughnut-chart-expense-breakdown.png" class="rounded shadow-md max-h-80 max-w-full" />

</div>
<div>

**泡泡圖（Bubble Chart）**

<img src="/images/41-pie-chart/bubble-chart-team-coordinates.png" class="rounded shadow-md max-h-80 max-w-full" />

</div>
</div>

<!--
接著是圓餅圖、環狀圖和泡泡圖的示意。

注意圓餅圖和環狀圖的差別：環狀圖就是把圓餅圖中間挖空。兩者的用途一樣，都是呈現各部分佔整體的比例，只是視覺風格不同。

接下來，我們就從零開始畫出一個圓餅圖。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 安裝 Chart.js

<!--
認識 Chart.js 能做什麼之後，我們先把它安裝到 Angular 專案裡。
-->

---

# 安裝 Chart.js

在終端機切換至 Angular 專案的根目錄，執行以下指令安裝 Chart.js：

```bash
npm install chart.js
```

安裝完成後，即可在元件的 TypeScript 檔案中引入：

```typescript
import Chart from 'chart.js/auto';
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 使用 <code>chart.js/auto</code> 路徑會自動載入所有圖表模組，適合快速開發；正式專案建議只引入需要的模組以縮減打包體積。
</div>

<!--
在終端機切換到專案根目錄，執行 `npm install chart.js` 安裝。

安裝完成後，在元件的 TypeScript 檔裡，用 `import Chart from 'chart.js/auto'` 把它引入。

這裡的 auto，代表自動載入 Chart.js 所有的圖表模組，寫起來最方便，適合學習和快速開發。如果是正式上線的專案，為了減少打包後的檔案大小，通常會改成只引入需要的模組。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 建立圓餅圖

<!--
套件裝好了，接下來實際建立一個圓餅圖，我們分成 HTML 和 TypeScript 兩部分來看。
-->

---

# 建立圓餅圖 — HTML 範本

在目標元件的 HTML 範本中，加入一個 `<canvas>` 標籤作為圖表的繪製區域，並用一個限制寬高的容器包住：

```html
<div style="width: 300px; height: 300px;">
  <canvas id="chart"></canvas>
</div>
```

- `id="chart"` 用於在 TypeScript 中透過 DOM 取得該元素
- Chart.js 以 `<canvas>` 作為繪圖表面，不使用其他 HTML 元素
- Chart.js 預設 `responsive: true`，畫布會撐滿外層容器 → 外層沒限制寬高時圖表會過大

<!--
HTML 的部分很單純，只需要一個 `canvas` 標籤。可以把它想成一塊空白的畫布，Chart.js 會直接在上面畫出圖表。

`canvas` 的 `id` 是 chart，等一下在 TypeScript 裡，要用這個 `id` 找到這塊畫布，所以兩邊的名稱要一致。Chart.js 只能使用 `canvas`，不能用 `div` 或其他標籤取代。

另外，Chart.js 預設是響應式的，畫布會撐滿外層容器。如果外面沒有一層限制寬高的容器，圖表可能會變得非常大。所以這裡用一個限制寬高的 `div` 把 `canvas` 包起來。
-->

---

# 建立圓餅圖 — TypeScript（一）

在元件的 TypeScript 檔案中，引入 Chart.js，並於 `ngAfterViewInit()` 中取得 canvas 元素：

```typescript
import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-expense-pie-chart',
  standalone: true,
  templateUrl: './expense-pie-chart.component.html',
})
export class ExpensePieChartComponent implements AfterViewInit {
  ngAfterViewInit() {
    // 取得 canvas 元素
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
```

<!--
接著看 TypeScript。

先從 `chart.js/auto` 引入 `Chart`。元件實作 `AfterViewInit`，把畫圖的程式寫在 `ngAfterViewInit` 裡。因為 `canvas` 要等畫面建立完成之後才拿得到，這跟之前生命週期那一章學到的觀念一樣。

第一步，用 `document.getElementById` 取得剛才的 `canvas`，並用 `as HTMLCanvasElement` 標註它的型別。接下來設定圖表的資料。
-->

---

# 建立圓餅圖 — TypeScript（二）

接續上一頁，設定圖表資料：

```typescript
    // 設定圖表資料
    const data = {
      // 各區塊的標籤
      labels: ['餐費', '交通費', '租金'],
      datasets: [
        {
          label: '支出比',
          // 各標籤對應的數值（系統自動換算為百分比）
          data: [200, 3000, 9000],
```

<!--
接著準備一個 `data` 物件，這就是圖表要畫的內容。

`labels` 陣列決定圖表分成幾個區塊，以及每個區塊的名稱，這裡是餐費、交通費和租金。`datasets` 裡的 `label` 是這組資料的名稱，`data` 則是每個區塊對應的數值，分別是 200、3000 和 9000。

要注意，`data` 的順序要和 `labels` 對應，第一個數值對應第一個標籤。數值不用自己換算成百分比，Chart.js 會自動計算。
-->

---

# 建立圓餅圖 — TypeScript（三）

```typescript
          // 各區塊的填充顏色（對應 labels 順序）
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          // 滑鼠懸停時區塊的偏移距離（px）
          hoverOffset: 4,
        },
      ],
    };

    // 建立圖表實例
    new Chart(ctx, {
      type: 'pie',   // 'pie' 為圓餅圖；'doughnut' 為環狀圖
      data: data,
    });
  }
}
```

<!--
接著補上 `backgroundColor`，也就是每個區塊的顏色，順序一樣要對應 `labels`。`hoverOffset` 設定滑鼠移到某個區塊時，那一塊會往外彈開幾個像素。

最後呼叫 `new Chart`，傳入剛才取得的 `canvas` 和 `data` 物件，並指定 `type` 是 pie，也就是圓餅圖。如果改成 doughnut，就會變成環狀圖。

要注意，`labels`、`data` 和 `backgroundColor` 三個陣列的長度要一致，否則圖表可能會顯示錯誤或缺少顏色。執行之後，畫面上就會出現一個分成三塊的圓餅圖。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 資料結構說明

<!--
圓餅圖畫出來了，接下來我們把剛才用到的資料結構，拆開來仔細看一遍。
-->

---

# 資料結構：labels 與 datasets

| 屬性 | 型別 | 說明 |
| --- | --- | --- |
| `labels` | `string[]` | 各區塊的名稱，決定區塊數量 |
| `datasets[].label` | `string` | 圖例中顯示的資料集名稱 |
| `datasets[].data` | `number[]` | 各標籤對應的數值，長度須與 `labels` 一致 |
| `datasets[].backgroundColor` | `string[]` | 各區塊的填充顏色，長度須與 `labels` 一致 |
| `datasets[].hoverOffset` | `number` | 滑鼠懸停時區塊向外偏移的像素距離 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>data</code> 陣列中的數值無需手動換算為百分比，Chart.js 會依各值的比例自動計算並顯示於圖表中。
</div>

<!--
這張表說明了 `data` 物件裡每個屬性的角色。

`labels` 決定圖表要分成幾塊。`datasets` 裡的 `label` 是圖例上顯示的名稱，`data` 是實際的數值，`backgroundColor` 是顏色，`hoverOffset` 是滑鼠懸停時的偏移效果。

可以把它想成投票：`labels` 是候選選項，`data` 是每個選項得到的票數，Chart.js 會自動把票數換算成圓餅圖上的比例，我們不用自己算百分比。
-->

---

# 資料結構範例

```typescript
const data = {
  labels: ['餐費', '交通費', '租金'],
  datasets: [
    {
      label: '支出比',
      data: [200, 3000, 9000],
      backgroundColor: [
        'rgb(255, 99, 132)',   // 餐費 → 紅色
        'rgb(54, 162, 235)',   // 交通費 → 藍色
        'rgb(255, 205, 86)',   // 租金 → 黃色
      ],
      hoverOffset: 4,
    },
  ],
};
```

- `labels` 有 3 個項目 → `data` 與 `backgroundColor` 也須各有 3 個元素
- 數值 `200 + 3000 + 9000 = 12200`，各區塊佔比由 Chart.js 自動計算

<!--
我們用同一份資料再確認一次對應關係。

三個 `labels`，對應三個 `data` 數值，也對應三個顏色：餐費是紅色、交通費是藍色、租金是黃色。三個陣列的元素數量都是 3，缺一不可。

數值的總和是 12200，每個區塊佔多少比例，Chart.js 會自動計算。可以試著心算看看，租金大約佔了多少。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 圖表選項說明

<!--
資料結構看完了，接下來看幾個常用的圖表選項。
-->

---

# 圖表類型與選項

| 屬性 | 可選值 | 說明 |
| --- | --- | --- |
| `type` | `'pie'` | 標準圓餅圖，各區塊填滿整個圓形 |
| `type` | `'doughnut'` | 環狀圖，中央為空心圓 |
| `hoverOffset` | `number`（如 `4`） | 滑鼠懸停時，對應區塊向外偏移的距離（px），方便使用者辨識所在區塊 |

**建立圖表實例語法**

```typescript
const chart = new Chart(ctx, {
  type: 'pie',      // 或 'doughnut'
  data: data,
});
```

<!--
這張表整理了兩個常用的選項。

`type` 決定圖表的形狀，pie 是實心的圓餅圖，doughnut 是中間空心的環狀圖，切換只要改一個字串。

`hoverOffset` 是滑鼠互動的細節。設定一個像素數值之後，滑鼠移到某個區塊，那一塊就會稍微彈出來，方便使用者確認自己指到哪一個項目，尤其在區塊多、顏色相近時特別有用。

下方是建立圖表的語法，傳入 `canvas` 和設定物件就完成了。
-->

---

# hoverOffset 效果示意

`hoverOffset` 設為正整數時，滑鼠移至某個區塊，該區塊會向圓心外側偏移對應像素，提升可讀性。

<!--
`hoverOffset` 設為正整數時，滑鼠移到某個區塊，那一塊就會往圓心外側偏移對應的像素，讓使用者更容易辨識目前指到的區塊。

【講師】此頁文字較少，可現場把滑鼠移到圓餅圖的不同區塊，示範彈出效果。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 完整實作總覽

<!--
最後，我們把整個流程整理成一張總表，並安排一個練習。
-->

---

# 圓餅圖完整實作步驟

| 步驟 | 操作位置 | 內容 |
| --- | --- | --- |
| 1 | 終端機 | 執行 `npm install chart.js` |
| 2 | `component.html` | 加入 `<canvas id="chart"></canvas>` |
| 3 | `component.ts` | 匯入 `import Chart from 'chart.js/auto'` |
| 4 | `component.ts` | 以 `document.getElementById('chart')` 取得 canvas |
| 5 | `component.ts` | 定義 `data` 物件（labels、datasets、backgroundColor） |
| 6 | `component.ts` | 呼叫 `new Chart(ctx, { type: 'pie', data: data })` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 建議將 <code>new Chart(...)</code> 的呼叫放在 <code>ngAfterViewInit()</code> 生命週期鉤子中，確保 DOM 元素已完成初始化後再進行繪製。
</div>

<!--
我們把流程整理成六個步驟。

第一，在終端機安裝 `chart.js`。第二，在 HTML 加上 `canvas`。第三，在 TypeScript 引入 `Chart`。第四，用 `getElementById` 取得 `canvas`。第五，定義 `data` 物件，包含 `labels`、`datasets` 和顏色。第六，呼叫 `new Chart` 畫出圖表。

要特別注意，`new Chart` 建議放在 `ngAfterViewInit` 裡，而不是 `ngOnInit`。因為 `canvas` 要等畫面建立之後才拿得到，太早呼叫的話，`getElementById` 會回傳 null，圖表就畫不出來。
-->

---

# 練習：繪製支出圓餅圖
### 任務說明

建立一個 Angular 元件，使用 Chart.js 繪製個人月支出圓餅圖，包含以下三個分類：

- 餐費：2,000 元
- 交通費：3,000 元
- 租金：9,000 元

**要求：**
1. 安裝 Chart.js 套件
2. 在 HTML 中加入 `<canvas id="chart"></canvas>`
3. 在 TypeScript 中定義資料並建立圓餅圖（type: `'pie'`）
4. 自訂三個區塊的 `backgroundColor`

<!--
接下來輪到我們自己動手。

請建立一個元件，用 Chart.js 畫出個人月支出的圓餅圖，包含餐費 2000 元、交通費 3000 元和租金 9000 元。要安裝套件、在 HTML 加上 `canvas`、在 TypeScript 定義資料並建立圓餅圖，最後自訂三個區塊的顏色。

想一想，需要幾個 `labels`？每個對應的數值是多少？

我們先暫停一下，自己動手試試看。
-->

---

# 練習：繪製支出圓餅圖
### 解題提示（一）

1. 終端機執行 `npm install chart.js`
2. HTML 中加入 `<canvas id="chart"></canvas>`
3. TypeScript 中匯入 Chart.js 並取得 canvas 元素：

```typescript
import Chart from 'chart.js/auto';

ngAfterViewInit() {
  const ctx = document.getElementById('chart') as HTMLCanvasElement;
```

<!--
我們來看第一部分的提示。

先確認已經用 `npm install chart.js` 安裝套件，並在 HTML 加上 `canvas`。接著在 TypeScript 引入 `Chart`，並在 `ngAfterViewInit` 裡用 `getElementById` 取得 `canvas`。

確認 `ctx` 有正確取得畫布之後，再往下定義資料。
-->

---

# 練習：繪製支出圓餅圖
### 解題提示（二）

4. 建立圖表並傳入資料：

```typescript
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['餐費', '交通費', '租金'],
      datasets: [{
        data: [2000, 3000, 9000],
        backgroundColor: ['rgb(255,99,132)', 'rgb(54,162,235)', 'rgb(255,205,86)'],
        hoverOffset: 4,
      }],
    },
  });
}
```

<!--
第二部分的提示，是建立圖表並傳入資料。

呼叫 `new Chart`，`type` 設為 pie。`data` 裡的 `labels` 是三個支出分類，`datasets` 的 `data` 是對應的三個金額，再加上自訂的三種顏色和 `hoverOffset`。

數字或顏色跟範例不同也沒關係，重點是資料結構和呼叫方式要正確。只要準備好 `labels` 和 `data`，比例計算和繪圖都交給 Chart.js 處理。
-->

---

# 完整解答 — HTML

`expense-pie-chart.component.html` 完整內容：

```html
<div style="width: 300px; height: 300px;">
  <canvas id="chart"></canvas>
</div>
```

<!--
接下來三頁是完整的元件程式碼，方便逐行對照。

HTML 很單純：`canvas` 外面包一層限制寬高的 `div`，避免 Chart.js 的響應式特性把圖表撐得太大。
-->

---

# 完整解答 — TypeScript（一）

`expense-pie-chart.component.ts` 完整內容：

```typescript
import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-expense-pie-chart',
  standalone: true,
  templateUrl: './expense-pie-chart.component.html',
})
export class ExpensePieChartComponent implements AfterViewInit {
  ngAfterViewInit() {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;
```

<!--
這頁是 TypeScript 的前半段。

從 `chart.js/auto` 引入 `Chart`，元件實作 `AfterViewInit`，畫圖的程式寫在 `ngAfterViewInit` 裡，先取得 `canvas`。

注意 `ngAfterViewInit` 的左大括號還沒結束，下一頁接著看建立圖表的部分。
-->

---

# 完整解答 — TypeScript（二）

```typescript
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['餐費', '交通費', '租金'],
        datasets: [
          {
            label: '月支出',
            data: [2000, 3000, 9000],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 4,
          },
        ],
      },
    });
  }
}
```

<!--
這頁是 TypeScript 的後半段。

呼叫 `new Chart`，傳入 `ctx`，`type` 指定為 pie。`labels` 是三個支出分類，`data` 是對應的金額，`backgroundColor` 是三種顏色，`hoverOffset` 讓滑鼠移過去時區塊彈開。

最後兩個右大括號，分別結束 `ngAfterViewInit` 方法和整個元件。可以拿這份程式碼對照，檢查有沒有漏掉 `import`、忘了實作 `AfterViewInit`，或把 `new Chart` 放到了 `ngOnInit`。
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

# 補充練習 1：切換成環狀圖

1. 沿用本章的圓餅圖範例程式碼
2. 找到 `new Chart` 內的 `type: 'pie'`
3. 將它改為 `'doughnut'`
4. 重新整理網頁，確認圓餅圖變成中間空心的「環狀圖」

<!--
第一題補充練習很簡單，只要改一個字。

把 `new Chart` 裡的 `type` 從 pie 改成 doughnut，看看圖表會變成什麼樣子。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：切換成環狀圖 — 參考答案

```typescript
new Chart(ctx, {
  type: 'doughnut',   // 原本是 'pie'
  data: data,
});
```

| `type` | 圖表 |
| --- | --- |
| `'pie'` | 圓餅圖 |
| `'doughnut'` | 環狀圖 |
| `'bar'` | 長條圖 |
| `'line'` | 折線圖 |

<!--
我們來看答案。

只要把 `type` 改成 doughnut，同樣的資料就會畫成中間空心的環狀圖。Chart.js 的圖表種類都是靠 `type` 切換，表格列出幾個常用的，可以換換看。

要注意，長條圖和折線圖適合呈現數量比較和趨勢，資料格式一樣，但呈現的意義不同。
-->

---
layout: default
---

# 補充練習 2：用 @for 呈現多張圖表

1. 在 TS 準備一個陣列，存放多筆圖表資料（例如三個月份的支出）
2. 在 HTML 用 `@for` 產生多個 `<canvas>`，每個給不同的 `id`
3. 在 `ngAfterViewInit()` 中，依序取得每個 canvas 並建立圖表

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ canvas 要等畫面產生後才抓得到，所以建立圖表要寫在 <code>ngAfterViewInit</code>，不能寫在 <code>ngOnInit</code>
</div>

<!--
第二題補充練習，一次畫出好幾張圖表。

資料放在陣列裡，HTML 用 `@for` 產生多個 canvas，每個 canvas 的 id 要不一樣。最後在 `ngAfterViewInit` 裡，一個一個抓出來建立圖表。

為什麼要在 `ngAfterViewInit`？因為 `ngOnInit` 執行時，`@for` 還沒把 canvas 放到畫面上，抓不到元素。我們先暫停一下，自己動手試試看。
-->

---
zoom: 0.96
layout: default
---

# 補充練習 2：用 @for 呈現多張圖表 — 參考答案

```typescript
chartList = [
  { title: '一月', data: [2000, 3000, 9000] },
  { title: '二月', data: [2500, 2800, 9000] },
  { title: '三月', data: [1800, 3200, 9000] },
];

ngAfterViewInit() {
  this.chartList.forEach((item, index) => {
    const ctx = document.getElementById('chart-' + index) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: { labels: ['餐費', '交通費', '租金'], datasets: [{ data: item.data }] },
    });
  });
}
```

```html
@for (item of chartList; track item.title) {
  <h3>{{ item.title }}</h3>
  <canvas [id]="'chart-' + $index"></canvas>
}
```

<!--
我們來看答案。

HTML 用 `@for` 跑 `chartList`，`$index` 是目前第幾筆，把它接在 `chart-` 後面當作 id，三個 canvas 就分別是 chart-0、chart-1、chart-2。

TS 在 `ngAfterViewInit` 裡用 `forEach` 跑同一個陣列，用相同規則組出 id，抓到 canvas 後各自建立圖表。
-->

---
layout: end
---

# 結束

<!--
這一章我們學會用 Chart.js 畫圓餅圖。用 `npm install chart.js` 安裝，在 HTML 放一個 `canvas` 並限制外層的寬高。在 `ngAfterViewInit` 裡取得 `canvas`，準備 `labels`、`data` 和 `backgroundColor`，三者長度要一致，再呼叫 `new Chart` 並指定 `type`。

之後做報表或儀表板時，就可以用這個方式，把數字變成一眼就能看懂的圖表。

下一章，我們會學習 Material 的對話框元件 Dialog。我們下一章見。
-->

