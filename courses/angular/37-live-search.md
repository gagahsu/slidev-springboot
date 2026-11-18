---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 即時搜尋
routeAlias: ch37
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
    即時搜尋
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「透過 keyup 事件即時過濾資料表格，打造流暢的搜尋體驗」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
前面幾章，我們學了 `mat-table` 和幾個內建管道。這一章，我們要做一個很實用的功能：即時搜尋。

平常使用購物網站或通訊錄時，只要在搜尋框打字，下面的清單就會立刻跟著篩選，不用按送出。這個效果靠的是輸入框的事件，再搭配我們學過的 `mat-table`，就能自己做出來。

學完這一章，我們會知道怎麼監聽輸入框的按鍵事件，並把輸入的內容即時套用到表格的資料上。
-->

---
layout: default
---

# Outline

- **即時搜尋概念** — 搜尋框與 `(input)` / `(keyup)` 事件的用途
- **建立資料表格** — 以 mat-table 與 ELEMENT_DATA 為基礎
- **搜尋框 HTML** — 使用 `(keyup)` 綁定事件，搭配 `[(ngModel)]` 雙向繫結
- **取得輸入值** — 透過 `$event` 與 `event.target.value` 讀取使用者輸入
- **過濾邏輯** — 用 `forEach` + `indexOf` 即時更新 `dataSource.data`

<!--
這一章會先說明即時搜尋的概念，以及該用哪一種事件。接著準備一個 `mat-table` 當作示範的表格，在搜尋框寫好事件繫結，學習怎麼取得使用者輸入的內容。最後撰寫過濾的邏輯，並看一次完整的程式碼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 即時搜尋概念
# Live Search Concept

<!--
資料一多，慢慢往下找很不方便。打幾個字就自動篩選，這就是即時搜尋要解決的問題。
-->

---

# 即時搜尋

搜尋框的即時搜尋功能，利用 `<input>` 標籤的事件屬性，根據使用者輸入的內容動態更新畫面顯示的資料列。

**實作思路**

1. 建立含資料的 mat-table
2. 在表格上方放置搜尋框
3. 每次按鍵時觸發過濾方法
4. 將符合條件的資料寫回 `dataSource.data`

<!--
即時搜尋的概念並不複雜：利用輸入框的事件，使用者一打字，就呼叫我們寫好的方法，篩選資料、更新畫面。

實作的思路有四個步驟。第一，建立一個有資料的 `mat-table`。第二，在表格上方放一個搜尋框。第三，每次按鍵時觸發過濾的方法。第四，把符合條件的資料，寫回 `dataSource.data`，畫面就會自動更新。

接下來我們一步一步實作。
-->

---

# 即時搜尋
### `(input)` vs `(keyup)`

| 事件 | 說明 |
|------|------|
| `(input)` | 值變動即觸發，輸入中文時可能不會即時更新 |
| `(keyup)` | 按鍵放開時觸發，中文輸入更穩定 |

建議使用 `(keyup)` 以避免中文輸入法的相容問題。

<!--
這裡有一個重要的選擇：要用 `input` 事件，還是 `keyup` 事件？

`input` 事件是值一改變就觸發。但用中文輸入法打字時，會先經過選字的過程，這時候 `input` 的觸發時機可能會和輸入法的組字狀態衝突，畫面不一定會即時更新。

`keyup` 則是每次放開按鍵時觸發，時機比較單純，在中文輸入的環境下比較穩定。

如果只用英文測試，可能感覺不出差別，但正式上線遇到中文輸入就可能出問題，所以這裡建議使用 `keyup`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 建立資料表格
# Set Up the Data Table

<!--
在做搜尋之前，要先有資料可以搜尋。接下來我們準備一個示範用的 `mat-table`。
-->

---

# 建立資料表格

以 mat-table 為基礎，事先準備好 `ELEMENT_DATA` 假資料與 `dataSource`：

<div class="flex justify-center">
  <img src="/images/37-live-search/mat-table-element-data-preview.png" class="rounded shadow-md max-h-80" />
</div>

表格包含 No.、Name、Weight、Symbol 四個欄位，共 12 筆元素資料，分頁顯示每頁 5 筆。

<!--
我們沿用之前學過的 `mat-table`，準備一份化學元素的假資料 `ELEMENT_DATA`。

表格有 No.、Name、Weight 和 Symbol 四個欄位，共 12 筆資料，每頁顯示 5 筆。

這個表格跟之前 `mat-table` 那一章做的幾乎一樣，因為即時搜尋是建立在現有的表格上，我們只是在上面加一個搜尋框，不需要重新設計表格。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 搜尋框 HTML
# Search Input HTML

<!--
表格準備好了，接下來是重點：在表格上方加上搜尋框，並把它和過濾的方法接起來。
-->

---

# 搜尋框 HTML

在元件模板中加入 `<input>` 元素，並使用 `(keyup)` 事件繫結搜尋方法，同時以 `[(ngModel)]` 雙向繫結儲存輸入值：

```html
<input
  (keyup)="changeData($event)"
  [(ngModel)]="inputData"
  style="width: 100%;"
  placeholder="搜尋元素名稱..."
/>

<table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
  <!-- ... 欄位定義 ... -->
</table>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 若使用 <code>(input)</code> 事件，在輸入中文時可能不會即時觸發回呼；改用 <code>(keyup)</code> 可確保每次按鍵結束後都正確觸發。
</div>

<!--
在模板裡加上一個 `input`，上面有兩個設定。

第一個是小括號 `keyup` 事件繫結，每次按鍵放開時，就呼叫 `changeData`，並把 `$event` 傳進去。第二個是 `ngModel` 雙向繫結，把輸入的文字同步存進 `inputData`。

兩者分工不同：`keyup` 負責「觸發的時機」，`ngModel` 負責「保存輸入的值」。下方則是原本的 `mat-table`。

再提醒一次，這裡用的是 `keyup`，而不是 `input`，原因就是剛才提到的中文輸入問題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 取得輸入值
# Reading the Input Value

<!--
搜尋框接好事件之後，接下來的問題是：在 `changeData` 方法裡，要怎麼拿到使用者輸入的文字？這裡有兩種做法。
-->

---

# 取得輸入值

`(keyup)` 事件傳入 `$event`，有兩種方式可取得輸入值：

**方法一：`event.target.value`**

```typescript
changeData(event: Event) {
  const val = (event.target as HTMLInputElement).value;
}
```

**方法二：`[(ngModel)]`**

```typescript
inputData: string = '';

changeData(event: Event) {
  // this.inputData 已由 ngModel 同步更新
  console.log(this.inputData);
}
```

<!--
第一種方法，是從 `$event` 取得。這在繫結那一章學過，因為 TypeScript 不知道 `event.target` 是哪一種元素，所以要用 `as HTMLInputElement` 告訴它這是輸入框，才能讀取 `.value`。

第二種方法，是利用 `ngModel`。因為雙向繫結的關係，使用者打字的當下，`inputData` 就已經同步更新了，直接讀取 `this.inputData` 就好，不需要用到 `$event`。

兩種方法擇一使用就可以，接下來的範例會用第一種方法示範完整的過濾邏輯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 過濾邏輯
# Filter Logic

<!--
最後一塊拼圖：拿到輸入的值之後，要怎麼篩選資料，並把結果顯示回表格？這是即時搜尋最核心的邏輯。
-->

---

# 過濾邏輯

取得輸入值後，使用 `forEach` 遍歷原始資料，以 `indexOf` 判斷是否包含關鍵字，最後將符合條件的結果寫回 `dataSource.data`：

```typescript
changeData(event: Event) {
  let tidyData: PeriodicElement[] = [];

  ELEMENT_DATA.forEach((res) => {
    if (res.name.indexOf((event.target as HTMLInputElement).value) != -1) {
      tidyData.push(res);
    }
  });

  this.dataSource.data = tidyData;
}
```

- `ELEMENT_DATA` — 原始完整資料，不會被修改
- `tidyData` — 暫存符合搜尋條件的資料
- `indexOf(...) != -1` — 判斷 `name` 欄位是否包含輸入字串
- `this.dataSource.data = tidyData` — 更新表格顯示

<!--
我們來看過濾的邏輯。

先準備一個空陣列 `tidyData`，用來存放篩選後的結果。接著用 `forEach`，逐一檢查原始資料 `ELEMENT_DATA` 的每一筆，用 `indexOf` 判斷這筆的 `name` 裡，有沒有包含使用者輸入的文字。`indexOf` 的結果不等於負一，就代表有包含，把這筆資料放進 `tidyData`。

全部檢查完之後，最後一行把 `tidyData` 指定給 `this.dataSource.data`，表格就會重新顯示。

要特別注意，我們從頭到尾都沒有修改 `ELEMENT_DATA`。每次搜尋都從完整的原始資料重新篩選，這樣才不會越搜尋資料越少，清空搜尋框之後也能恢復完整的清單。
-->

---

# 完整 TypeScript 範例（一）
### import 與型別定義

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}
```

<!--
接下來五頁，我們把剛才拆開講的片段，組合成完整的元件程式碼，方便對照自己的專案檢查。

這頁是匯入和型別定義。`MatTableDataSource` 和 `MatPaginator` 是等一下會用到的類別；`FormsModule`、`MatTableModule`、`MatPaginatorModule`、`MatFormFieldModule` 和 `MatInputModule`，則是要放進元件 `imports` 陣列的模組。

`PeriodicElement` 這個 interface，描述每一筆資料都有 position、name、weight 和 symbol 四個屬性。
-->

---

# 完整 TypeScript 範例（二）
### ELEMENT_DATA 假資料

```typescript
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1,  name: 'Hydrogen',  weight: 1.0079,  symbol: 'H'  },
  { position: 2,  name: 'Helium',    weight: 4.0026,  symbol: 'He' },
  { position: 3,  name: 'Lithium',   weight: 6.941,   symbol: 'Li' },
  { position: 4,  name: 'Beryllium', weight: 9.0122,  symbol: 'Be' },
  { position: 5,  name: 'Boron',     weight: 10.811,  symbol: 'B'  },
  { position: 6,  name: 'Carbon',    weight: 12.0107, symbol: 'C'  },
  { position: 7,  name: 'Nitrogen',  weight: 14.0067, symbol: 'N'  },
  { position: 8,  name: 'Oxygen',    weight: 15.9994, symbol: 'O'  },
  { position: 9,  name: 'Fluorine',  weight: 18.9984, symbol: 'F'  },
  { position: 10, name: 'Neon',      weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium',    weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305,  symbol: 'Mg' }
];
```

<!--
這頁是原始的假資料 `ELEMENT_DATA`，一共 12 筆元素。

這部分和之前 `mat-table` 那一章完全一樣，沒有任何跟搜尋相關的修改。等一下的搜尋，就是從這份資料裡篩選。
-->

---

# 完整 TypeScript 範例（三）
### @Component 設定

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
```

<!--
這頁是元件的 `@Component` 設定。

因為用到了 `ngModel`，一定要在 `imports` 加入 `FormsModule`，這是最常漏掉的一步。其他四個模組，則是 `mat-table`、分頁器和輸入框需要的。
-->

---

# 完整 TypeScript 範例（四）
### 類別內容（一）— 屬性與 ngAfterViewInit

```typescript
export class AppComponent implements AfterViewInit {
  inputData: string = '';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
```

<!--
這頁是 class 的前半段。

`inputData` 存放搜尋框的內容，`displayedColumns` 決定顯示的欄位，`dataSource` 一開始用完整的 `ELEMENT_DATA` 建立。`ngAfterViewInit` 裡把分頁器接上表格。

這些都是原本 `mat-table` 的設定，還沒有涉及搜尋的邏輯。
-->

---

# 完整 TypeScript 範例（五）
### 類別內容（二）— changeData 方法

```typescript
  changeData(event: Event) {
    let tidyData: PeriodicElement[] = [];
    ELEMENT_DATA.forEach((res) => {
      if (res.name.indexOf((event.target as HTMLInputElement).value) != -1) {
        tidyData.push(res);
      }
    });
    this.dataSource.data = tidyData;
  }
}
```

<!--
這頁是 class 的後半段，也就是新增的 `changeData` 方法，最後的右大括號是整個 class 的結尾。

方法的內容，就是剛才拆解過的過濾邏輯：準備空陣列，用 `forEach` 加 `indexOf` 篩選，最後寫回 `dataSource.data`。

可以拿這份程式碼對照自己的專案，檢查有沒有漏掉 `FormsModule`，或是事件忘了換成 `keyup`。
-->

---

# 完整 HTML 範例（一）
### 搜尋框

搭配上面的元件，`app.component.html` 完整內容如下：

```html
<input
  matInput
  (keyup)="changeData($event)"
  [(ngModel)]="inputData"
  placeholder="搜尋元素名稱..." />
```

<!--
接下來三頁是完整的 HTML，先看搜尋框。

`matInput` 讓輸入框套用 Material 的樣式，小括號 `keyup` 綁定 `changeData`，並傳入 `$event`，`ngModel` 雙向繫結 `inputData`。這兩個繫結，就是即時搜尋能運作的關鍵。
-->

---
zoom: 0.96
---

# 完整 HTML 範例（二）
### 表格欄位定義

```html
<table mat-table [dataSource]="dataSource">

  <ng-container matColumnDef="position">
    <th mat-header-cell *matHeaderCellDef>No.</th>
    <td mat-cell *matCellDef="let element">{{ element.position }}</td>
  </ng-container>

  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Name</th>
    <td mat-cell *matCellDef="let element">{{ element.name }}</td>
  </ng-container>

  <ng-container matColumnDef="weight">
    <th mat-header-cell *matHeaderCellDef>Weight</th>
    <td mat-cell *matCellDef="let element">{{ element.weight }}</td>
  </ng-container>

  <ng-container matColumnDef="symbol">
    <th mat-header-cell *matHeaderCellDef>Symbol</th>
    <td mat-cell *matCellDef="let element">{{ element.symbol }}</td>
  </ng-container>
```

<!--
這頁是表格裡的四組欄位定義，分別對應 position、name、weight 和 symbol。

寫法和之前 `mat-table` 那一章完全一樣，即時搜尋沒有修改這一段。
-->

---

# 完整 HTML 範例（三）
### 表頭列、資料列與分頁器

```html
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

</table>

<mat-paginator [pageSizeOptions]="[5, 10]"></mat-paginator>
```

<!--
最後是表頭列、資料列和分頁器。

兩個 `tr` 都指定了 `displayedColumns`，決定欄位和順序。`mat-paginator` 負責分頁，記得要在 `ngAfterViewInit` 把它接到 `dataSource.paginator`，否則分頁不會生效。

另外再提醒一次，`matColumnDef` 的名稱、`displayedColumns` 的內容，以及資料物件的屬性名稱，三者一定要一致。
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

# 補充練習 1–2：事件監聽與不分大小寫

**練習 1：即時印出輸入值**

1. 在 HTML 建立搜尋 `input`，綁定 `(keyup)="myTest($event)"`
2. 在 TS 撰寫 `myTest(event: Event)`，用 `console.log()` 即時印出輸入值
3. 打開 F12，確認打字或刪除時 Console 立即反應

**練習 2：不分大小寫搜尋**

原範例輸入小寫 `h` 時，會因為 `Hydrogen` 字首大寫而找不到。請在 `indexOf` 比較前，把兩邊都轉成小寫：

```typescript
res.name.toLowerCase().indexOf(keyword.toLowerCase())
```

測試輸入小寫 `h`，確認大寫開頭的項目也能被篩選出來。

<!--
接下來兩題補充練習。

第一題，綁定 `keyup` 事件，把每次輸入的值印到 Console，確認事件有沒有被觸發。

第二題，改良本章的搜尋：目前輸入小寫 h 找不到 Hydrogen，因為大小寫不同。請用 `toLowerCase`，把兩邊都轉成小寫再比較。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
myTest(event: Event) {
  console.log((event.target as HTMLInputElement).value);
}
```

```typescript
changeData(event: Event) {
  const keyword = (event.target as HTMLInputElement).value;
  let tidyData: PeriodicElement[] = [];
  ELEMENT_DATA.forEach((res) => {
    if (res.name.toLowerCase().indexOf(keyword.toLowerCase()) != -1) {
      tidyData.push(res);
    }
  });
  this.dataSource.data = tidyData;
}
```

<!--
我們來看答案。

第一題，`event.target` 就是觸發事件的輸入框，轉型成 `HTMLInputElement` 之後，就能取出 `value`。

第二題，在比較之前，把資料的名稱和關鍵字都轉成小寫。這樣不管使用者輸入大寫還是小寫，`hydrogen` 和 `h` 都能比對成功。
-->

---
layout: default
---

# 補充練習 3：一鍵重置搜尋

點擊重置按鈕，要清空搜尋框，並讓表格恢復完整資料：

1. HTML：在輸入框右側新增「重置」按鈕並綁定點擊事件
2. TS：把綁定輸入框的變數清空
3. TS：把原始、未過濾的完整陣列重新指派給表格
4. 測試：輸入關鍵字讓表格變少，點選重置，確認是否恢復全部資料

<!--
第三題補充練習，加上一個重置按鈕。

重置要做兩件事：清空搜尋框，以及讓表格回到完整的資料。想一想，搜尋框綁定的是哪個變數？完整的資料又存在哪裡？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：一鍵重置搜尋 — 參考答案

```html
<input (keyup)="changeData($event)" [(ngModel)]="inputData">
<button (click)="reset()">重置</button>
```

```typescript
reset() {
  this.inputData = '';                  // 清空搜尋框
  this.dataSource.data = ELEMENT_DATA;  // 還原完整資料
}
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 過濾時一律從原始的 <code>ELEMENT_DATA</code> 篩選、只改 <code>dataSource.data</code>，原始資料才不會被覆蓋，重置時才拿得回來
</div>

<!--
我們來看答案。

搜尋框用 `ngModel` 綁定 `inputData`，所以把 `inputData` 設成空字串，輸入框就清空了。接著把原始的 `ELEMENT_DATA` 指派回 `dataSource.data`，表格就恢復完整。

能這樣做的關鍵是，過濾時我們從來沒有改動 `ELEMENT_DATA`，只是把篩選結果放進 `dataSource`，所以完整的資料一直都在。
-->

---
layout: end
---

# 課程結束
### 善用 `(keyup)` 事件與 `indexOf` 過濾，即可為 mat-table 加入流暢的即時搜尋功能

<!--
這一章我們做出了完整的即時搜尋功能。搜尋框用 `keyup` 事件觸發，比 `input` 事件更適合中文輸入。取得輸入值可以用 `$event` 搭配型別斷言，或直接讀取 `ngModel` 綁定的變數。過濾時用 `forEach` 加 `indexOf`，從原始資料篩選，再寫回 `dataSource.data`，讓表格自動更新。

可以想一想，如果要搜尋時不分大小寫，或同時比對多個欄位，`changeData` 要怎麼修改？

下一章，我們會學習用 `ngClass` 動態切換樣式。我們下一章見。
-->

