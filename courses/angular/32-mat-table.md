---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Mat-table
routeAlias: ch32
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
    Mat-table
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「善用 Angular Material 表格，快速建立具備分頁功能的資料列表」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們裝好了 Angular Material，這一章要學它的表格元件：`mat-table`。

自己做一個有分頁、欄位對齊的表格很花時間，`mat-table` 把這些都包好了。學完這一章，我們會用官方範例建立有分頁的表格，並理解 HTML、TypeScript 和資料三者怎麼對應。
-->

---
layout: default
---

# Outline

- **什麼是 Mat-table** — 為什麼使用 Angular Material 的表格元件
- **使用 Mat-table** — 從官方範例取得 HTML 與 TS 程式碼
- **匯入模組** — MatTableModule 與 MatPaginatorModule
- **定義資料** — PeriodicElement interface、ELEMENT_DATA、displayedColumns、dataSource
- **分頁器** — @ViewChild(MatPaginator) 與 ngAfterViewInit
- **三者對應關係** — HTML 欄位、displayedColumns、資料必須同步

<!--
這一章會先介紹什麼是 `mat-table`，接著實際動手做一個範例：從官方取得程式碼、匯入模組、定義資料，再設定分頁器。最後特別強調 HTML 的欄位、`displayedColumns` 和資料三者一定要一致，這是最容易出錯的地方。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 Mat-table？
# What is Mat-table?

<!--
自己做一個能分頁、排序的表格，會有很多重複的邏輯，我們來看看 `mat-table` 怎麼幫忙。
-->

---

# Mat-table

`<mat-table>` 是 Angular Material 提供的表格元件，內建樣式、分頁、排序等功能，無需從頭手動實作。使用前需先安裝 `@angular/material`：

```bash
ng add @angular/material
```

<!--
`mat-table` 是 Angular Material 提供的表格元件，內建了樣式、分頁和排序等功能，不需要從頭自己實作。

使用之前，要先確認專案已經安裝了 `@angular/material`。如果還沒安裝，可以回到上一章，用 `ng add @angular/material` 安裝，否則這裡的元件會找不到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 使用 Mat-table
# Using Mat-table

<!--
接下來實際動手，一步一步做出一個有分頁功能的表格。
-->

---

# 使用 Mat-table
### 含分頁功能的表格預覽

<div class="grid grid-cols-3 gap-4 my-3">
<div>

- 欄位：No.、Name、Weight、Symbol

</div>
<div>

- 底部 Items per page 選擇器

</div>
<div>

- 上一頁 / 下一頁切換

</div>
</div>

<div class="flex justify-center">
  <img src="/images/32-mat-table/table-preview.png" class="rounded shadow-md max-h-80" />
</div>

<!--
動手之前，先看看最後會做出什麼樣子。

這個表格有 No.、Name、Weight 和 Symbol 四個欄位。下方有一個分頁器，可以選擇每頁顯示幾筆，也可以切換上一頁和下一頁。

心裡有這張圖之後，接下來拆解步驟會比較有方向。
-->

---

# 使用 Mat-table
### 第一步：取得官方範例程式碼

<div class="grid grid-cols-2 gap-4 my-3">
<div>

1. 前往 Angular Material 官網
2. 找到 **Table with pagination** 範例
3. 點擊右上角 `<>` 展開程式碼

</div>
<div>

4. 切換到 **HTML** 分頁
5. 複製全部內容
6. 貼到元件 HTML 中

</div>
</div>

<div class="flex justify-center">
  <img src="/images/32-mat-table/copy-html-code.png" class="rounded shadow-md max-h-80" />
</div>

<!--
第一步，我們不從零開始寫，而是直接到 Angular Material 官網找現成的範例。

找到 Table with pagination 這個範例，點右上角的程式碼符號展開，切換到 HTML 分頁，把內容全部複製，貼到我們元件的 HTML 檔案裡。

貼上之後，編輯器可能會出現很多紅字，這是正常的，因為我們還沒匯入對應的模組，等一下就會處理。
-->

---

# 什麼是 ng-container？

HTML table 的結構規範：`<tr>` 底下只能直接放 `<th>`、`<td>`，額外包裹標籤（如 `<div>`）會破壞表格版面與樣式渲染。

`<ng-container>` 為 Angular 提供之邏輯容器，僅存在於範本中，編譯後不會產生對應的 DOM 元素。

| 特性 | 說明 |
| --- | --- |
| 不產生 DOM 元素 | 檢查畫面時看不到 `<ng-container>` 標籤，僅顯示其內部子元素 |
| 常見用途 | 包裹結構型指令（`*ngIf`、`*ngFor`）、群組多個元素、避免多餘標籤影響版面 |
| 於 mat-table 的用途 | 每個 `matColumnDef` 需容器放置 `<th>` 與 `<td>`，`ng-container` 不會產生額外標籤，維持 table 結構完整 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Hint：</b> DOM（Document Object Model）為瀏覽器將 HTML 解析後建立的樹狀結構，網頁上每個標籤都對應樹中一個節點，瀏覽器依此結構渲染畫面。
</div>

<!--
在看 HTML 結構之前，先補充一個常見的角色：`ng-container`。

先說明 DOM。DOM 是瀏覽器讀完 HTML 之後，建立的一個樹狀結構，每個標籤都是樹上的一個節點，瀏覽器就照著這棵樹畫出畫面。

HTML 表格的結構有嚴格的規定：`tr` 底下只能直接放 `th` 和 `td`。如果多包一層 `div`，表格的版面和樣式就可能跑掉。

`ng-container` 是 Angular 提供的邏輯容器，它只存在於模板裡，編譯之後不會產生任何實際的 DOM 元素。所以在 `mat-table` 裡，每個欄位都用 `ng-container` 把 `th` 和 `td` 包起來，既能分組，又不會破壞表格的結構。
-->

---

# 什麼是 ng-container？— 範例

```html
<!-- ❌ 用 div 包欄位，破壞 table 的 DOM 結構 -->
<div>
  <th mat-header-cell *matHeaderCellDef> No. </th>
  <td mat-cell *matCellDef="let element"> {{element.position}} </td>
</div>

<!-- ✅ 用 ng-container 包欄位，不產生額外標籤 -->
<ng-container matColumnDef="position">
  <th mat-header-cell *matHeaderCellDef> No. </th>
  <td mat-cell *matCellDef="let element"> {{element.position}} </td>
</ng-container>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> mat-table 官方範例固定用 <code>ng-container</code> 搭配 <code>matColumnDef</code>，因其不產生實際 DOM 節點，不影響 table 版面結構。
</div>

<!--
我們對照一下兩種寫法。

上面用 `div` 包住欄位，會多出一個不該出現在表格裡的標籤，版面就可能跑掉。下面改用 `ng-container`，效果一樣，但不會多出任何標籤。用開發者工具檢查，只會看到裡面的 `th` 和 `td`。

這個技巧不只用在 `mat-table`。平常如果想把幾個元素包在一起，又不想多一層 `div`，也可以用 `ng-container`。
-->

---

# 使用 Mat-table
### HTML 結構（一）

```html
<div class="mat-elevation-z8">
  <table mat-table [dataSource]="dataSource">

    <!-- Position Column -->
    <ng-container matColumnDef="position">
      <th mat-header-cell *matHeaderCellDef> No. </th>
      <td mat-cell *matCellDef="let element"> {{element.position}} </td>
    </ng-container>

    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef> Name </th>
      <td mat-cell *matCellDef="let element"> {{element.name}} </td>
    </ng-container>

    <!-- Weight Column -->
```

<!--
我們看貼進來的 HTML 結構。

最外層是 `table`，加上 `mat-table`，並用中括號 `dataSource` 綁定資料來源。裡面每一個 `ng-container`，搭配 `matColumnDef`，就代表一個欄位，例如 `position` 和 `name`。

每個欄位裡，`th` 搭配 `matHeaderCellDef`，定義表頭要顯示的文字；`td` 搭配 `matCellDef`，寫成 `let element`，代表每一列的資料。雙大括號裡的 `element.position`，就是顯示這筆資料的 position 屬性。
-->

---
zoom: 0.96
---

# 使用 Mat-table
### HTML 結構（二）

```html
    <!-- Weight Column -->
    <ng-container matColumnDef="weight">
      <th mat-header-cell *matHeaderCellDef> Weight </th>
      <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
    </ng-container>

    <!-- Symbol Column -->
    <ng-container matColumnDef="symbol">
      <th mat-header-cell *matHeaderCellDef> Symbol </th>
      <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [pageSizeOptions]="[5, 10, 20]"
                 showFirstLastButtons
                 aria-label="Select page of periodic elements">
  </mat-paginator>
</div>
```

<!--
HTML 的後半段，還有 `weight` 和 `symbol` 兩個欄位，寫法和前面一樣，只是換了屬性名稱。

關鍵是最後兩個 `tr`。第一個搭配 `matHeaderRowDef`，第二個搭配 `matRowDef`，兩者都指定了 `displayedColumns`。意思是告訴 `mat-table`，要依照 `displayedColumns` 這個陣列，決定顯示哪些欄位，以及欄位的順序。

最下方的 `mat-paginator` 就是分頁器，`pageSizeOptions` 設定了每頁可以選擇顯示 5、10 或 20 筆。
-->

---

# 使用 Mat-table
### 第二步：匯入模組

HTML 加入後會出現報錯，需在 TS 中匯入對應模組：

```typescript
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

// ...

@Component({
  // ...
  imports: [MatTableModule, MatPaginatorModule],
})
```

<!--
第二步，HTML 貼上之後出現的錯誤，是因為 TypeScript 還不認識 `mat-table` 和 `mat-paginator` 這些標籤。

解決方法是匯入對應的模組。`MatTableModule` 和 `MatTableDataSource` 從 `@angular/material/table` 引入，`MatPaginatorModule` 從 `@angular/material/paginator` 引入。

要注意，只寫 `import` 還不夠，還要把模組加進 `@Component` 的 `imports` 陣列，錯誤才會消失。這是獨立元件很常漏掉的地方。
-->

---

# 使用 Mat-table
### 第三步：定義資料（一）— 型別與假資料

```typescript
export interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  // ... 更多資料
];
```

<!--
第三步是準備資料。

先定義資料的型別。這裡用 `PeriodicElement` 這個 interface，規定每筆資料要有 position、name、weight 和 symbol 四個屬性。這就是上一個主題學過的 interface。

有了型別之後，再宣告 `ELEMENT_DATA` 陣列，放入氫、氦、鋰這些元素的假資料。
-->

---

# 使用 Mat-table
### 第三步：定義資料（二）— 變數宣告

`dataSource` 以 `MatTableDataSource` 包裝 `ELEMENT_DATA`，其餘兩個變數對應欄位與分頁器。

```typescript
displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

@ViewChild(MatPaginator) paginator!: MatPaginator;
```

| 變數 | 說明 |
|------|------|
| `displayedColumns` | 對應 HTML 的 matColumnDef，決定欄位與順序 |
| `dataSource` | 表格資料來源，以 MatTableDataSource 包裝 |
| `paginator` | 透過 @ViewChild 取得分頁器實例 |

<!--
接著要宣告三個變數，把 HTML 和資料串起來。

`displayedColumns` 是一個字串陣列，決定要顯示哪些欄位，以及它們的順序，名稱要和 HTML 的 `matColumnDef` 完全一致。

`dataSource` 用 `MatTableDataSource` 把 `ELEMENT_DATA` 包起來，`mat-table` 才能使用這份資料。

`paginator` 用 `@ViewChild` 取得畫面上分頁器的實例，下一步會用到它。
-->

---
zoom: 0.95
---

# 使用 Mat-table
### 第四步：設定 Paginator

Paginator 為底部分頁控制器，需在 `ngAfterViewInit` 生命週期中將其指定給 dataSource：

```typescript
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({ /* ... */ })
export class MyComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 必須在 ngAfterViewInit 中設定 paginator，因為此時 @ViewChild 才能確保取得到 DOM 中的 mat-paginator 實例。
</div>

<!--
第四步，讓分頁器真正發揮作用。

做法是把 `dataSource` 的 `paginator` 屬性，指定為用 `@ViewChild` 取得的分頁器。

這一行一定要寫在 `ngAfterViewInit` 裡。還記得生命週期那一章嗎？`@ViewChild` 要等畫面建立完成，才能確定拿得到畫面上的元素。如果寫在 `ngOnInit`，分頁器可能還沒建立，`paginator` 會是 undefined，分頁功能就不會有作用。
-->

---

# 使用 Mat-table
### 三者必須同步對應

HTML 的 `matColumnDef`、TS 的 `displayedColumns` 與資料物件的屬性名稱三者必須完全同步，任一不符會導致畫面空白或錯誤。

| 位置 | 內容 |
|------|------|
| HTML `matColumnDef` | `"position"`, `"name"`, `"weight"`, `"symbol"` |
| TS `displayedColumns` | `['position', 'name', 'weight', 'symbol']` |
| TS `ELEMENT_DATA` | `{ position, name, weight, symbol }` |

<!--
這是這一章最重要的觀念。

`mat-table` 能不能正常顯示，關鍵在於三個地方的名稱要完全一致：HTML 裡 `matColumnDef` 的欄位名稱、TypeScript 裡 `displayedColumns` 的內容，以及資料物件的屬性名稱。

只要其中一個拼錯，畫面就可能一片空白，或出現錯誤訊息。所以如果表格顯示不出來，第一件事就是檢查這三個地方有沒有對上。
-->

---

# 使用 Mat-table
### 三者必須同步對應 — 程式碼對照

```html
<!-- HTML：matColumnDef -->
<ng-container matColumnDef="position">
  ...
</ng-container>
```

```typescript
// TS：displayedColumns
displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

// TS：ELEMENT_DATA 屬性名稱
const ELEMENT_DATA = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
];
```

<!--
我們用程式碼再對照一次。

HTML 裡寫了 `matColumnDef` 等於 position；TypeScript 的 `displayedColumns` 陣列裡也要有 position；`ELEMENT_DATA` 的資料物件裡，也要有 position 這個屬性。

三個地方，同一個名稱，缺一不可。之後自己做表格時，可以把這頁當作檢查清單。
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

# 補充練習 1–2：欄位一致性與分頁選項

**練習 1：欄位名稱打錯會怎樣？**

1. 打開 `displayedColumns` 陣列，故意把 `'symbol'` 改成 `'sym-error'`
2. 存檔，觀察 Console 拋出的錯誤
3. 理解 `matColumnDef` 與 `displayedColumns` 欄位名稱必須一致，再修正回來

**練習 2：每頁筆數選項**

找到 `<mat-paginator>`，把 `[pageSizeOptions]` 改成 `[3, 6, 9, 12]`，點擊右下角選單確認選項是否改變。

<!--
接下來兩題補充練習。

第一題是除錯實驗：故意把 `displayedColumns` 裡的欄位名稱打錯，看看會發生什麼事。

第二題，把分頁器的每頁筆數選項改成 3、6、9、12。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1–2 — 參考答案

```typescript
displayedColumns: string[] = ['position', 'name', 'weight', 'sym-error'];
// ❌ Console：Error: Could not find column with id "sym-error".
```

```html
<mat-paginator [pageSizeOptions]="[3, 6, 9, 12]"
               showFirstLastButtons>
</mat-paginator>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>displayedColumns</code> 裡的每個名稱，都必須在 HTML 找到同名的 <code>matColumnDef</code>，否則整張表格無法顯示
</div>

<!--
我們來看答案。

欄位名稱打錯後，表格整個消失，Console 會說找不到 id 為 `sym-error` 的欄位。因為 `displayedColumns` 是用名字去 HTML 找對應的 `matColumnDef`，名字對不上就找不到。看到這個錯誤，第一步就是檢查兩邊的拼字。

第二題只要改 `pageSizeOptions` 的陣列內容，右下角的下拉選單就會變成 3、6、9、12。
-->

---
layout: default
---

# 補充練習 3：新增「狀態」欄位

在週期表中加入「狀態」欄位（例如 `Gas`、`Solid`）：

1. 在 `PeriodicElement` interface 加上 `status: string`
2. 在 `ELEMENT_DATA` 的每個物件中加上 `status: 'Gas'` 或 `status: 'Solid'`
3. 在 HTML 新增 `status` 欄位，並加入 `displayedColumns`
4. 打開網頁，確認表格右側出現新的狀態欄位

<!--
第三題補充練習，在現有的表格裡新增一個欄位。

要動到三個地方：資料、HTML 的欄位定義，還有 `displayedColumns`。想一想，少改其中一個會怎樣？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：新增「狀態」欄位 — 參考答案

```typescript
export interface PeriodicElement {
  position: number; name: string; weight: number; symbol: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', status: 'Gas' },
  { position: 3, name: 'Lithium',  weight: 6.941,  symbol: 'Li', status: 'Solid' },
  // ...其餘資料同樣補上 status
];

displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'status'];
```

```html
<ng-container matColumnDef="status">
  <th mat-header-cell *matHeaderCellDef> Status </th>
  <td mat-cell *matCellDef="let element"> {{ element.status }} </td>
</ng-container>
```

<!--
我們來看答案。

第一，interface 加上 `status`，資料的每一筆也補上 `status`。第二，HTML 複製一個 `ng-container`，`matColumnDef` 命名為 `status`，儲存格顯示 `element.status`。第三，把 `status` 加進 `displayedColumns`。

三個地方都改到，表格才會多出新欄位。新增欄位的順序，是由 `displayedColumns` 陣列的順序決定的。
-->

---
layout: end
---

# 課程結束
### 善用 Angular Material 提供的 mat-table，輕鬆打造具備分頁的資料表格

<!--
這一章我們學會了用 `mat-table` 建立有分頁功能的表格。我們從官方範例取得 HTML，用 `ng-container` 包住每個欄位而不破壞表格結構。接著匯入 `MatTableModule` 和 `MatPaginatorModule`，用 interface 定義資料，用 `MatTableDataSource` 包裝資料，並在 `ngAfterViewInit` 設定分頁器。最重要的是，HTML 的欄位、`displayedColumns` 和資料屬性三者要一致。

下一章，我們會學習 Material 的圖示元件 `mat-icon`。我們下一章見。
-->
