---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 綜合練習 Ch32–39
routeAlias: ch56
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
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    綜合練習 Ch32–39
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「員工管理系統：把八個獨立主題整合成一個真實頁面」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
這一章是綜合練習，要把表格、圖示、日期選擇器、DatePipe、JsonPipe、即時搜尋、ngClass 和 Tabs 這八個主題組裝在一起。

實務上的頁面，很少只用到一種技巧。這個練習要做一個員工管理系統：用頁籤切換員工列表和已封存員工，列表裡有搜尋、日期篩選、薪水高亮，以及檢視、封存和復原的操作。
-->

---
layout: default
---

# Outline

- **任務說明** — 員工管理系統的完整需求
- **畫面預覽** — 完成後的頁面長什麼樣子
- **解題提示** — 八個主題怎麼串起來的關鍵細節
- **完整解答：TypeScript** — 資料、狀態、方法
- **完整解答：HTML** — 頁籤、表格、搜尋列、封存清單
- **完整解答：SCSS** — 薪水高亮與版面樣式

<!--
這一章的順序是：先看完整的需求，再看完成後的畫面，接著是解題提示，最後公布完整的 TypeScript、HTML 和 SCSS 解答。建議先看完需求和提示，自己動手做一次，再回來對照解答。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 任務說明
# Requirements

<!--
我們先把需求說清楚。功能一多，最容易漏掉的就是某個小細節沒有串好。
-->

---
layout: default
---

# 練習：員工管理系統
### 任務說明（一）

用 `mat-tab-group`、`mat-table`、`mat-icon`、`mat-datepicker`、`DatePipe`、`JsonPipe`、即時搜尋、`ngClass` 做一個員工管理頁面，需求如下：

1. 定義 `EmployeeData` interface：`id`、`name`、`department`、`hireDate`（`Date`）、`salary`，準備至少 6 筆假資料
2. 用 `mat-tab-group` 建立兩個頁籤：「員工列表」與「已封存員工」

<!--
這個練習會把八個主題各用一次：`mat-table` 顯示資料和分頁，`mat-icon` 做操作按鈕，`mat-datepicker` 篩選日期，DatePipe 排版日期，JsonPipe 顯示明細，即時搜尋過濾姓名，`ngClass` 高亮薪水，Tabs 切換兩個視圖。

第一步，定義 `EmployeeData` interface，包含 id、姓名、部門、到職日和薪水，到職日是 Date 型別，並準備至少 6 筆假資料。第二步，用 `mat-tab-group` 建立兩個頁籤：員工列表和已封存員工。
-->

---
layout: default
---

# 練習：員工管理系統
### 任務說明（二）

3. **員工列表**頁籤：
   - 上方有搜尋框，依姓名**即時搜尋**（`keyup`），以及 `mat-datepicker` 篩選「到職日期起」
   - 表格欄位：ID、姓名、部門、到職日（`DatePipe` 格式化 `yyyy/MM/dd`）、薪水、操作；薪水 `>= 60000` 用 `ngClass` 套上 `salary-high` 高亮 class
   - 操作欄有 `visibility`（檢視，畫面下方用 `JsonPipe` 顯示完整資料）與 `archive_outline`（封存，將該員工移到「已封存員工」頁籤，不是真的刪除）
   - 搭配分頁器，每頁 3 / 5 / 10 筆
4. **已封存員工**頁籤：顯示被封存的員工姓名與部門，每筆有 `restore` icon，點擊後將該員工移回「員工列表」

<!--
接著是兩個頁籤的內容。

員工列表有姓名搜尋和到職日篩選。表格的到職日用 DatePipe 格式化，薪水大於等於 60000 時用 `ngClass` 高亮。操作欄可以檢視，用 JsonPipe 顯示明細；也可以封存，把員工移到另一個頁籤。表格搭配分頁器。

已封存頁籤顯示姓名和部門，每筆都有復原圖示。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習：員工管理系統
### 畫面預覽

<div class="flex flex-col gap-3 mt-2" style="max-width: 560px; margin-left: auto; margin-right: auto;">
  <div class="flex gap-4 justify-center" style="border-bottom: 2px solid #e2e8f0; padding-bottom: 0.4rem;">
    <span style="color: #1a5c5c; font-weight: 700; border-bottom: 2px solid #5eada0; padding-bottom: 0.4rem;">員工列表</span>
    <span style="color: #9ca3af;">已封存員工</span>
  </div>
  <div class="flex gap-2 justify-center">
    <span class="text-xs px-2 py-1 rounded" style="border: 1px solid #e2e8f0;">🔍 搜尋姓名...</span>
    <span class="text-xs px-2 py-1 rounded" style="border: 1px solid #e2e8f0;">📅 到職日期起</span>
  </div>
  <div class="flex justify-between items-center rounded-lg px-4 py-2" style="border: 1px solid #e2e8f0;">
    <span>#3 林大偉・研發部・2020/11/20</span>
    <span class="text-xs font-bold px-2 py-1 rounded" style="background:#fef3c7; color:#92400e;">65000</span>
  </div>
  <div class="flex justify-between items-center rounded-lg px-4 py-2" style="border: 1px solid #e2e8f0;">
    <span>#5 李志豪・業務部・2019/05/05</span>
    <span class="text-xs font-bold px-2 py-1 rounded" style="background:#fef3c7; color:#92400e;">70000</span>
  </div>
  <div class="flex justify-between items-center rounded-lg px-4 py-2" style="border: 1px solid #e2e8f0;">
    <span>#4 張雅婷・人資部・2023/01/10</span>
    <span class="text-xs px-2 py-1">48000</span>
  </div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 65000、70000 兩筆薪水超過門檻，數字底色被 <code>ngClass</code> 套上 <code>salary-high</code> 高亮；封存某筆之後，切到「已封存員工」頁籤就能看到、也能點 restore 復原。
</div>

<!--
先看看完成後的畫面。

上方是兩個頁籤，員工列表裡有搜尋框和日期篩選欄。表格中，薪水 65000 和 70000 這兩筆超過門檻，底色被 `ngClass` 套上了高亮的樣式。

封存某一筆之後，它會從列表消失，切換到已封存員工頁籤就能看到，點擊復原又會移回來。
-->

---
layout: default
---

# 練習：員工管理系統
### 畫面預覽 — 已封存員工頁籤

<div class="flex flex-col gap-3 mt-2" style="max-width: 560px; margin-left: auto; margin-right: auto;">
  <div class="flex gap-4 justify-center" style="border-bottom: 2px solid #e2e8f0; padding-bottom: 0.4rem;">
    <span style="color: #9ca3af;">員工列表</span>
    <span style="color: #1a5c5c; font-weight: 700; border-bottom: 2px solid #5eada0; padding-bottom: 0.4rem;">已封存員工</span>
  </div>
  <div class="flex justify-between items-center rounded-lg px-4 py-2" style="border: 1px solid #e2e8f0;">
    <span>張雅婷・人資部</span>
    <span class="text-xs px-2 py-1 rounded" style="border: 1px solid #e2e8f0;">↺ restore</span>
  </div>
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 這裡不是 <code>mat-table</code>，只是簡單的 <code>@for</code> 清單；只顯示姓名跟部門，沒有薪水、到職日這些欄位。清單為空時會換成 <code>@empty</code> 的提示文字。
</div>

<!--
這是已封存員工頁籤的畫面。

張雅婷剛被封存，所以出現在這裡，只顯示姓名和部門，旁邊有一個復原圖示。這個頁籤沒有用 `mat-table`，只是一個簡單的 `@for` 清單。不是所有清單都需要用比較重的元件。

如果沒有任何封存的員工，畫面會顯示 `@empty` 區塊的提示文字，而不是一片空白。
-->

---
layout: default
---

# 練習：員工管理系統
### 解題提示（一）

1. `employees`（在架員工）跟 `archivedEmployees`（已封存員工）是**兩個獨立陣列**，都是「真正的資料來源」；`dataSource.data` 是從 `employees` 篩選後算出來的顯示結果，不要直接對 `dataSource.data` 做增刪（ch32、ch37 重點）
2. 搜尋框跟日期篩選欄**共用同一個 `applyFilters()`** 方法：姓名用 `keyup` 觸發、日期用 `(dateChange)` 觸發，兩個條件都要同時套用在同一次過濾結果上，不能各自覆蓋對方（ch37 重點）
3. 薪水欄位的 `ngClass` 綁在 `<td>` 上，物件語法 `{ 'salary-high': e.salary >= 60000 }`，`salary-high` 這個 class 本身的樣式在 SCSS 定義（ch38 重點）
4. 頁籤用最基本的 `mat-tab-group` + `mat-tab label="..."` 靜態寫法即可，兩個頁籤內容各自獨立，不需要跟路由整合（ch39 重點）

<!--
我們來看解題提示的前半部。

第一，`employees` 和 `archivedEmployees` 是兩個獨立的陣列，都是真正的資料來源。表格的 `dataSource.data`，是從 `employees` 篩選後算出來的結果，不要直接對它新增或刪除。用兩個陣列分別代表資料實際在哪裡，封存和復原的邏輯會清楚很多。

第二，搜尋框和日期篩選共用同一個 `applyFilters` 方法，姓名用 `keyup` 觸發，日期用 `dateChange` 觸發。兩個條件要在同一次過濾中一起套用，否則後執行的會蓋掉先執行的結果。

第三，薪水的 `ngClass` 綁在 `td` 上，用物件寫法。第四，頁籤用最基本的 `mat-tab-group` 就好，不需要和路由整合。
-->

---
layout: default
---

# 練習：員工管理系統
### 解題提示（二）

5. `archive(employee)` 要同時做兩件事：把該筆從 `employees` 濾掉、再把它加進 `archivedEmployees`；`restore(employee)` 則相反。兩個方法做完都要重新呼叫 `applyFilters()` 讓 `dataSource.data` 保持同步
6. `selectedEmployee` 初始為 `null`，用 `@if (selectedEmployee)` 包住 `<pre>` 區塊（ch36 重點）
7. `mat-datepicker` 記得加 `provideNativeDateAdapter()`；`mat-icon` 名稱要跟 Google Fonts Icons 網站查到的一致（ch33、ch34 重點）

<!--
解題提示的後半部。

第五，`archive` 要同時做兩件事：把員工從 `employees` 移除，再加進 `archivedEmployees`；`restore` 則相反。兩個方法做完，都要重新呼叫 `applyFilters`，讓表格保持同步。

第六，`selectedEmployee` 初始值是 null，用 `@if` 包住顯示明細的 `pre` 區塊。第七，日期選擇器記得加上 `provideNativeDateAdapter`，圖示名稱要和 Google Fonts Icons 查到的一致。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 完整解答：TypeScript

<!--
接下來是完整解答，先看 TypeScript，依序是資料型別、假資料、匯入、元件設定、屬性和方法。
-->

---
zoom: 0.96
---

# 完整解答 — Interface 與假資料

```typescript
export interface EmployeeData {
  id: number;
  name: string;
  department: string;
  hireDate: Date;
  salary: number;
}
```

```typescript
const EMPLOYEE_DATA: EmployeeData[] = [
  { id: 1, name: '王小明', department: '研發部', hireDate: new Date('2021/03/15'), salary: 58000 },
  { id: 2, name: '陳美玲', department: '行銷部', hireDate: new Date('2022/07/01'), salary: 52000 },
  { id: 3, name: '林大偉', department: '研發部', hireDate: new Date('2020/11/20'), salary: 65000 },
  { id: 4, name: '張雅婷', department: '人資部', hireDate: new Date('2023/01/10'), salary: 48000 },
  { id: 5, name: '李志豪', department: '業務部', hireDate: new Date('2019/05/05'), salary: 70000 },
  { id: 6, name: '黃淑芬', department: '財務部', hireDate: new Date('2022/09/18'), salary: 55000 },
];
```

<!--
這是 interface 和假資料。

`hireDate` 是 Date 物件，方便搭配日期選擇器和 DatePipe。資料裡刻意有兩筆薪水超過 60000，林大偉 65000 和李志豪 70000，等一下高亮的效果才看得出來。
-->

---

# 完整解答 — TS 匯入模組（一）

```typescript
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
```

<!--
這是匯入的前半部。

`CommonModule` 提供 DatePipe 和 JsonPipe，`FormsModule` 提供 `ngModel`，搜尋框和日期欄都會用到。後兩行是表格和分頁器相關的模組。`@if` 和 `@for` 是內建語法，不需要另外匯入。
-->

---

# 完整解答 — TS 匯入模組（二）

```typescript
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
```

<!--
匯入的後半部。

`MatIconModule` 對應圖示，`MatFormFieldModule`、`MatInputModule`、`MatDatepickerModule` 和 `provideNativeDateAdapter` 對應日期選擇器，`provideNativeDateAdapter` 千萬不能漏。最後的 `MatTabsModule` 對應頁籤，忘記匯入的話，`mat-tab-group` 會直接報錯。
-->

---

# 完整解答 — Component 設定

```typescript
@Component({
  selector: 'app-employee-management',
  imports: [CommonModule, FormsModule, MatTableModule, MatPaginatorModule,
    MatIconModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatTabsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss',
})
export class EmployeeManagementComponent implements AfterViewInit {
```

<!--
這是元件的設定。

`imports` 陣列把前面匯入的模組全部放進來，一個都不能少。`providers` 裡加上 `provideNativeDateAdapter()`，這是日期選擇器運作的必要設定。
-->

---

# 完整解答 — Component 屬性

```typescript
  displayedColumns: string[] = ['id', 'name', 'department', 'hireDate', 'salary', 'actions'];

  employees: EmployeeData[] = EMPLOYEE_DATA;
  archivedEmployees: EmployeeData[] = [];
  dataSource = new MatTableDataSource<EmployeeData>(this.employees);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedEmployee: EmployeeData | null = null;
  nameFilter: string = '';
  filterDate: Date | null = null;
  minDate = new Date(Math.min(...EMPLOYEE_DATA.map(e => e.hireDate.getTime())));
  maxDate = new Date();
```

<!--
這是元件的屬性，也是這個練習的核心設計。

`employees` 是目前在職的員工，`archivedEmployees` 是被封存的員工，兩者都是真實的資料來源。`dataSource` 一開始用 `employees` 建立，之後會依照條件重新計算。

`selectedEmployee` 存放要檢視的員工，`nameFilter` 是搜尋關鍵字，`filterDate` 是篩選日期。`minDate` 用 `Math.min` 和展開運算子，找出所有員工中最早的到職日，`maxDate` 是今天。
-->

---

# 完整解答 — ngAfterViewInit 與 view()

```typescript
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  view(employee: EmployeeData) {
    this.selectedEmployee = employee;
  }
```

<!--
`ngAfterViewInit` 把分頁器接到 `dataSource`，這是之前學表格時的必要步驟。

`view` 方法把使用者點擊的員工存進 `selectedEmployee`，畫面下方就會用 JsonPipe 顯示這筆資料。
-->

---

# 完整解答 — applyFilters()

```typescript
  applyFilters() {
    let result = this.employees;

    if (this.nameFilter) {
      result = result.filter(e => e.name.indexOf(this.nameFilter) !== -1);
    }
    if (this.filterDate) {
      result = result.filter(e => e.hireDate >= this.filterDate!);
    }

    this.dataSource.data = result;
  }
```

<!--
這是整合最關鍵的方法：`applyFilters`，把搜尋和日期篩選合併成同一個過濾流程。

先從完整的 `employees` 開始。如果 `nameFilter` 有值，就用 `indexOf` 判斷姓名是否包含關鍵字；如果 `filterDate` 有值，再篩出到職日在這天以後的員工。兩個條件都是有值才篩選，可以同時套用，也可以只套用一個。最後把結果指定給 `dataSource.data`。

因為統一由這個方法處理，不管使用者先搜尋還是先選日期，兩個條件都會同時生效。
-->

---

# 完整解答 — archive() 與 restore()

```typescript
  archive(employee: EmployeeData) {
    this.employees = this.employees.filter(e => e.id !== employee.id);
    this.archivedEmployees = [...this.archivedEmployees, employee];
    this.applyFilters();
  }

  restore(employee: EmployeeData) {
    this.archivedEmployees = this.archivedEmployees.filter(e => e.id !== employee.id);
    this.employees = [...this.employees, employee];
    this.applyFilters();
  }
}
```

<!--
這是封存和復原的方法。

`archive` 用 `filter` 把這位員工從 `employees` 移除，再用展開運算子把他加進 `archivedEmployees`，最後呼叫 `applyFilters` 更新表格。`restore` 的邏輯完全相反。

這裡不是單純刪除，而是把資料移到另一個陣列。兩個方法最後都要呼叫 `applyFilters`，因為封存或復原都會影響搜尋和篩選後應該顯示的結果。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 完整解答：HTML

<!--
TypeScript 看完了，接下來看 HTML，依序是頁籤、搜尋列、表格欄位，以及已封存頁籤。
-->

---

# 完整解答 — 頁籤外層

```html
<mat-tab-group>
  <mat-tab label="員工列表">
    <div class="tab-content">
      <!-- 搜尋列、表格都放在這裡，下一頁繼續 -->
    </div>
  </mat-tab>

  <mat-tab label="已封存員工">
    <div class="tab-content">
      <!-- 已封存清單放在這裡 -->
    </div>
  </mat-tab>
</mat-tab-group>
```

<!--
這是頁籤的外層。

用 `mat-tab-group` 包住兩個 `mat-tab`，`label` 就是頁籤的標題。兩個頁籤的內容都在同一個元件裡切換，不需要路由，所以用最簡單的 `mat-tab-group` 就夠了。

接下來補齊員工列表頁籤裡的內容。
-->

---

# 完整解答 — 搜尋列與日期篩選欄

```html
<div class="filters">
  <mat-form-field>
    <mat-label>搜尋姓名</mat-label>
    <input matInput
           [(ngModel)]="nameFilter"
           (keyup)="applyFilters()"
           placeholder="輸入姓名關鍵字...">
  </mat-form-field>

  <mat-form-field>
    <mat-label>到職日期起</mat-label>
    <input matInput [matDatepicker]="picker"
           [min]="minDate" [max]="maxDate"
           [(ngModel)]="filterDate"
           (dateChange)="applyFilters()">
    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
  </mat-form-field>
</div>
```

<!--
這是搜尋列和日期篩選欄。

搜尋框用小括號 `keyup` 觸發過濾，`ngModel` 保存輸入的關鍵字，用 `keyup` 對中文輸入比較穩定。日期篩選沿用日期選擇器的結構，中括號 `min` 和 `max` 綁定 TypeScript 算出來的日期，選擇日期時用 `dateChange` 觸發過濾。

注意兩個輸入框都呼叫同一個 `applyFilters`，不管使用者先操作哪一個，都會同時考慮兩個條件。
-->

---

# 完整解答 — Table 欄位（一）

```html
<div class="mat-elevation-z8">
  <table mat-table [dataSource]="dataSource">

    <ng-container matColumnDef="id">
      <th mat-header-cell *matHeaderCellDef> ID </th>
      <td mat-cell *matCellDef="let e"> {{e.id}} </td>
    </ng-container>

    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef> 姓名 </th>
      <td mat-cell *matCellDef="let e"> {{e.name}} </td>
    </ng-container>

    <ng-container matColumnDef="department">
      <th mat-header-cell *matHeaderCellDef> 部門 </th>
      <td mat-cell *matCellDef="let e"> {{e.department}} </td>
    </ng-container>
```

<!--
這是表格的外層和前三欄。

ID、姓名和部門都是單純的雙大括號顯示，寫法和之前學表格時完全一樣。
-->

---

# 完整解答 — Table 欄位（二）— 薪水高亮

```html
    <ng-container matColumnDef="hireDate">
      <th mat-header-cell *matHeaderCellDef> 到職日 </th>
      <td mat-cell *matCellDef="let e"> {{e.hireDate | date: 'yyyy/MM/dd'}} </td>
    </ng-container>

    <ng-container matColumnDef="salary">
      <th mat-header-cell *matHeaderCellDef> 薪水 </th>
      <td mat-cell *matCellDef="let e" [ngClass]="{ 'salary-high': e.salary >= 60000 }">
        {{e.salary}}
      </td>
    </ng-container>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>[ngClass]</code> 綁在 <code>&lt;td&gt;</code> 上，用的是 ch38 教過的物件條件語法，<code>e</code> 是 <code>*matCellDef="let e"</code> 帶出來的這一列資料，跟其他欄位共用同一個變數。
</div>

<!--
接著是到職日和薪水。

到職日用 DatePipe 格式化成年、月、日。薪水欄的 `td` 上，用中括號 `ngClass` 綁定物件：薪水大於等於 60000 時，套上 `salary-high`。這裡的 e 是 `matCellDef` 帶出來的這一列資料。

`ngClass` 綁在哪個標籤上，就是哪個標籤被加上 class。這裡綁在 `td`，所以高亮只會出現在薪水這一格，不會影響整列。
-->

---

# 完整解答 — Table 欄位（三）— 操作按鈕與收尾

```html
    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef> 操作 </th>
      <td mat-cell *matCellDef="let e">
        <mat-icon (click)="view(e)">visibility</mat-icon>
        <mat-icon (click)="archive(e)">archive</mat-icon>
      </td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <mat-paginator [pageSizeOptions]="[3, 5, 10]" showFirstLastButtons></mat-paginator>
</div>

@if (selectedEmployee) {
  <pre>{{ selectedEmployee | json }}</pre>
}
```

<!--
接著是操作欄和表格的收尾。

操作欄有兩個圖示：visibility 呼叫 `view`，archive 呼叫 `archive`，把員工移到另一個頁籤。下面的兩個 `tr` 和分頁器，寫法都和之前一樣，分頁可以選擇每頁 3、5 或 10 筆。

最下方用 `@if` 判斷 `selectedEmployee`，有資料時才用 JsonPipe 顯示明細。
-->

---

# 完整解答 — 已封存員工頁籤

```html
<mat-tab label="已封存員工">
  <div class="tab-content">
    <ul class="archived-list">
      @for (e of archivedEmployees; track e.id) {
        <li>
          <span>{{e.name}}・{{e.department}}</span>
          <mat-icon (click)="restore(e)">restore</mat-icon>
        </li>
      } @empty {
        <p>目前沒有已封存的員工</p>
      }
    </ul>
  </div>
</mat-tab>
```

<!--
這是已封存員工頁籤。

這裡沒有使用 `mat-table`，只用 `@for` 走過 `archivedEmployees`，每筆顯示姓名和部門，旁邊的 restore 圖示點擊時呼叫 `restore`，把員工移回列表。

`@for` 搭配 `@empty`，一開始陣列是空的，會顯示「目前沒有已封存的員工」，有員工被封存之後才會換成清單。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 完整解答：SCSS

<!--
最後補上 SCSS，重點是薪水的高亮和頁籤內容的排版。
-->

---

# 完整解答 — SCSS（一）版面與高亮

```scss
.tab-content {
  padding: 1rem 0;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.salary-high {
  background: #fef3c7;
  color: #92400e;
  font-weight: 700;
}
```

<!--
`ngClass` 只負責決定要不要加上 class，class 的樣子還是要靠 SCSS 定義。

`.tab-content` 讓每個頁籤的內容上下留一點空間。`.filters` 用 flex 讓搜尋框和日期欄並排。`.salary-high` 則是黃底、深色、粗體的高亮樣式，跟畫面預覽一致。
-->

---
layout: default
---

# 完整解答 — SCSS（二）已封存清單

```scss
.archived-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.archived-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
}
```

<!--
最後是已封存清單的樣式。

`.archived-list` 拿掉預設的項目符號，改成直向排列，每筆之間留一點間距。每個 `li` 用 flex 左右對齊，左邊是姓名和部門，右邊是復原圖示，外面加上邊框和圓角。

到這裡完整解答就講完了，可以對照自己的版本，檢查頁籤、搜尋、篩選、`ngClass`，以及封存和復原有沒有都串起來。
-->

---
layout: end
---

# 課程結束
### 把 mat-table、mat-icon、mat-datepicker、DatePipe、JsonPipe、即時搜尋、ngClass、Tabs 八個主題整合成一個真實可用的頁面

<!--
這個綜合練習，把八個主題組裝成一個完整的頁面：頁籤切換兩個視圖，列表有即時搜尋、日期篩選和薪水高亮，操作欄可以檢視明細、封存和復原，資料狀態則用兩個獨立的陣列清楚管理。

如果能獨立完成這個練習，代表這些內容已經真正吸收了，而不只是看得懂。恭喜大家完成了這個階段的學習。
-->
