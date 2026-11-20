---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題：電商後台
routeAlias: ch61
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
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Angular Essentials
  </p>
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    專題：電商後台
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「店長的辦公桌：商品、訂單、報表一手掌握」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
歡迎來到第六十一章，Angular 課的最後一章：線上商店的管理後台。

後台是給店家用的：看今天賣了多少、管理商品和規格、處理訂單、看報表。這一章會用到 Sidenav、mat-table、FormArray、上傳檔案和圓餅圖，幾乎把 Angular Material 的單元全部用上。
-->

---

# 今天要完成的畫面

<v-clicks>

- **版型**：左邊 Sidenav、右邊內容；整個後台 lazy loading，限管理員
- **營運摘要**：今日營業額、待出貨、近 7 天折線圖、熱銷 Top 5
- **商品**：mat-table 列表、上下架開關；編輯頁用 **FormArray** 管規格、上傳圖片
- **訂單**：篩選、出貨、完成、取消、向綠界查詢
- **報表**：日期區間、分類圓餅圖、商品排行

</v-clicks>

<!--
今天要完成五組畫面。

（下一步）後台的版型：左邊選單、右邊內容，用第四十八章的 Sidenav。整個後台用上一章的 lazy loading，只有管理員能進。

（下一步）營運摘要，有數字卡片、折線圖和熱銷排行。

（下一步）商品管理：列表用 mat-table，可以直接切換上下架；編輯頁用 FormArray 動態新增、刪除規格，還能上傳圖片。

（下一步）訂單管理：篩選、出貨、完成、取消，還有向綠界查詢。

（下一步）銷售報表：選日期區間，看分類圓餅圖和商品排行。
-->

---

# 故事：店長的辦公桌

<v-clicks>

- 桌子左邊是一排**抽屜**：訂單、商品、報表…拉開哪個就看哪個
- 桌上有一塊**白板**：今天賣多少、還有幾單沒寄
- 商品的**價目卡**可以加一行、劃掉一行，行數不固定
- 寄出包裹時在單子寫上**物流單號**，才能蓋「已出貨」

</v-clicks>

<!--
用店長的辦公桌來想。

（下一步）桌子左邊一排抽屜：訂單、商品、報表，拉開哪個就看哪個。

（下一步）桌上有一塊白板，寫著今天賣了多少、還有幾單沒寄。

（下一步）商品的價目卡可以加一行、劃掉一行，行數不固定。

（下一步）寄出包裹時，在單子上寫物流單號，才能蓋「已出貨」。
-->

---

# 對應到程式

<Pairs left="辦公桌" right="Angular" rows="cabinet,一排抽屜=code,mat-sidenav + 子路由 + router-outlet|doc,白板=code,營運摘要：mat-card + Chart.js 折線圖|form,行數不固定的價目卡=code,FormArray：push / removeAt|ok,寫上物流單號才能出貨=code,依訂單狀態顯示按鈕，後端再檢查一次" />

<!--
對應到程式。

（下一步）一排抽屜，是 Sidenav 加上子路由，右邊的 router-outlet 顯示目前的頁面。

（下一步）白板，是營運摘要，用卡片和 Chart.js 折線圖。

（下一步）行數不固定的價目卡，是 FormArray，用 push 新增、removeAt 刪除。

（下一步）寫上物流單號才能出貨，是依訂單狀態顯示不同的按鈕；後端也會再檢查一次狀態。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 版型與營運摘要

<!--
先做版型和營運摘要。
-->

---

# 後台的子路由與版型

```ts
export const ADMIN_ROUTES: Routes = [{
  path: '', component: AdminLayoutComponent,
  children: [
    { path: '', component: DashboardComponent },
    { path: 'products', component: AdminProductsComponent },
    { path: 'products/new', component: ProductEditComponent },
    { path: 'products/:id', component: ProductEditComponent },
    { path: 'orders', component: AdminOrdersComponent },
    { path: 'orders/:orderNo', component: AdminOrderDetailComponent },
    { path: 'categories', component: CategoriesComponent },
    { path: 'users', component: UsersComponent },
    { path: 'reports', component: ReportsComponent },
  ],
}];
```

```html
<mat-sidenav-container>
  <mat-sidenav mode="side" opened>
    <mat-nav-list>
      <a mat-list-item routerLink="/admin/orders" routerLinkActive="active">訂單</a> …
    </mat-nav-list>
  </mat-sidenav>
  <mat-sidenav-content><router-outlet /></mat-sidenav-content>
</mat-sidenav-container>
```

<!--
後台的路由放在 admin.routes.ts，上一章用 loadChildren 載入。

外層是 AdminLayoutComponent，所有後台頁面都是它的子路由。新增和編輯商品共用同一個元件，有 id 是編輯，沒有是新增。

版型用第四十八章的 Sidenav：左邊是選單，routerLinkActive 讓目前的頁面亮起來；右邊的 router-outlet 顯示子路由的頁面。
-->

---

# 營運摘要：Chart.js 折線圖（第 41 章）

```ts {all|1|4-7|9-12}
line = viewChild<ElementRef<HTMLCanvasElement>>('line');

private draw(d: Dashboard): void {
  const days = [];                                        // 近 7 天，沒有訂單的日子補 0
  for (let i = 6; i >= 0; i--) days.push(new Date(Date.now() - i * 86400000).toLocaleDateString('sv-SE'));
  const revenue = days.map((day) => d.last7Days.find((x) => x.salesDate === day)?.revenue ?? 0);

  this.chart = new Chart(this.line()!.nativeElement, {
    type: 'line',
    data: { labels: days.map((x) => x.slice(5)), datasets: [{ label: '營業額', data: revenue }] },
  });
}
```

<!--
營運摘要的折線圖，用第四十一章的 Chart.js。

（下一步）viewChild 取得畫面上的 canvas。

（下一步）後端只回傳有訂單的日子。沒有訂單的日子也要出現在圖上，營業額是 0，所以先產生近七天的日期，再一天一天去找，找不到就補 0。這是畫報表很常見的處理。

（下一步）new Chart，類型是 line。x 軸只顯示月和日。記得在 ngOnDestroy 呼叫 chart.destroy，離開頁面時把圖表清掉。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 商品管理

<!--
接下來是商品管理。
-->

---

# 列表：mat-table + 上下架開關

```html
<table mat-table [dataSource]="r.content">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>名稱</th>
    <td mat-cell *matCellDef="let p">{{ p.name }} @if (p.soldOut) { <span class="sold-out">售完</span> }</td>
  </ng-container>
  <ng-container matColumnDef="status">
    <th mat-header-cell *matHeaderCellDef>上架</th>
    <td mat-cell *matCellDef="let p">
      <mat-slide-toggle [checked]="p.status === 'ON_SALE'" (change)="toggle(p, $event.checked)" />
    </td>
  </ng-container>
  <tr mat-header-row *matHeaderRowDef="columns"></tr>
  <tr mat-row *matRowDef="let row; columns: columns"></tr>
</table>
```

```ts
toggle(p: ProductSummary, onSale: boolean): void {
  this.api.changeStatus(p.id, onSale ? 'ON_SALE' : 'OFF_SHELF').subscribe(() => this.load(this.page));
}
```

<!--
商品列表用第三十二章的 mat-table，每一欄用 matColumnDef 定義。

上架這一欄放一個 Material 的開關 slide-toggle。切換時呼叫後端的 PATCH，改成上架或下架，再重新載入列表。下架不是刪除，商品還在，只是前台看不到。

上方的篩選，跟前台一樣有狀態、分類和名稱。
-->

---

# 編輯頁：規格用 FormArray（第 51 章）

```ts {all|5-6|9-17|19-20}
form = this.fb.group({
  categoryId: [0, Validators.min(1)],
  name: ['', [Validators.required, Validators.maxLength(50)]],
  imageUrl: [''],
  // 規格的數量不固定
  variants: this.fb.array([this.variantGroup()]),
});

variantGroup(v?: Variant) {
  return this.fb.group({
    id: [v?.id ?? (null as number | null)],      // null = 新增的規格
    name: [v?.name ?? '', Validators.required],
    sku: [v?.sku ?? '', Validators.required],
    price: [v?.price ?? 0, [Validators.required, Validators.min(0)]],
    stock: [v?.stock ?? 0, [Validators.required, Validators.min(0)]],
  });
}

addVariant(): void { this.variants.push(this.variantGroup()); }
removeVariant(i: number): void { this.variants.removeAt(i); }
```

<!--
編輯頁是這一章的重點，用第五十一章的 FormArray。

（下一步）variants 是一個 FormArray，裡面每一個元素是一個規格。

（下一步）variantGroup 建立一個規格的 FormGroup。id 是 null 代表新增的規格，有值代表既有的規格。這正好對應後端的規則：有 id 改、沒 id 新增、清單裡沒有的刪除。

（下一步）新增規格用 push，刪除用 removeAt。編輯的時候，先 clear 清空，再把後端回傳的每個規格 push 進去。
-->

---

# FormArray 的畫面

```html {all|1|2-3|4-7|9}
<div formArrayName="variants">
  @for (group of variants.controls; track group; let i = $index) {
    <div class="variant-row" [formGroupName]="i">
      <mat-form-field><mat-label>規格名稱</mat-label><input matInput formControlName="name" /></mat-form-field>
      <mat-form-field><mat-label>SKU</mat-label><input matInput formControlName="sku" /></mat-form-field>
      <mat-form-field><mat-label>價格</mat-label><input matInput type="number" formControlName="price" /></mat-form-field>
      <mat-form-field><mat-label>庫存</mat-label><input matInput type="number" formControlName="stock" /></mat-form-field>
      <button mat-icon-button type="button" (click)="removeVariant(i)" [disabled]="variants.length === 1"><mat-icon>delete</mat-icon></button>
    </div>
  }
</div>
<button mat-stroked-button type="button" (click)="addVariant()">＋ 新增規格</button>
```

<!--
FormArray 的畫面。

（下一步）外層用 formArrayName 綁到 variants。

（下一步）用 @for 跑過每一個 control，每一列用 formGroupName 加上索引 i，綁到第 i 個規格。

（下一步）裡面的欄位用 formControlName。

（下一步）刪除按鈕在只剩一個規格時停用，因為商品至少要有一個規格。按鈕的 type 一定要寫 button，不然按了會送出整個表單。
-->

---

# 上傳圖片

```html
<input type="file" accept="image/jpeg,image/png,image/webp" (change)="upload($event)" />
```

```ts {all|2|4-6|7-8}
upload(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const form = new FormData();
  form.append('file', file);                                     // 後端 @RequestPart("file")
  this.http.post<AppResponse<{ url: string }>>(`${API}/admin/uploads`, form)
    .pipe(map((r) => r.data.url))
    .subscribe((url) => this.form.patchValue({ imageUrl: url })); // 存檔時一起送出
}
```

<!--
上傳圖片。

（下一步）從 input 的 files 取出選到的檔案。

（下一步）建立 FormData，加入名為 file 的欄位，名稱要跟後端的 @RequestPart 一樣。HttpClient 看到 FormData，會自動用 multipart 格式送出，攔截器一樣會帶上 JWT。

（下一步）後端回傳圖片網址，放進表單的 imageUrl，按儲存的時候跟商品資料一起送出。畫面上的圖片用 imgUrl pipe 加上後端的位址顯示。
-->

---

# 想一想

<Poll question="編輯商品時，管理員刪掉了「豪華」這個規格，又新增了「迷你」。送出的 variants 會長什麼樣子？" options="只有迷你|標準（有 id）和迷你（id 是 null），沒有豪華|三個都有，豪華標記為刪除|後端會自己猜" answer="2" />

<!--
想一想。刪掉豪華、新增迷你，送出的 variants 長什麼樣子？

標準有 id，迷你的 id 是 null，豪華不在清單裡。後端看到清單裡沒有豪華，就把它刪除，這就是 Spring Boot 第五十三章「價目卡整張重寫」的規則。前後端對同一份規格書，才能這樣配合。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 訂單與報表

<!--
最後是訂單和報表。
-->

---

# 訂單明細：依狀態顯示按鈕

```html
@if (o.warning) { <div class="warning">⚠️ {{ o.warning }}</div> }
<app-order-view [order]="o" />                     <!-- 前台、後台共用的明細元件 -->

@if (o.status === 'PAID') {
  <input matInput [(ngModel)]="trackingNo" placeholder="物流單號" />
  <button mat-flat-button (click)="run(api.ship(o.orderNo, trackingNo))" [disabled]="!trackingNo.trim()">出貨</button>
}
@if (o.status === 'SHIPPED') {
  <button mat-flat-button (click)="run(api.complete(o.orderNo))">完成</button>
}
@if (o.status === 'PENDING_PAYMENT' || o.status === 'PAID') {
  <button mat-stroked-button (click)="cancel(o)">取消訂單</button>
}
<button mat-button (click)="query(o.orderNo)">向綠界查詢</button>
```

<!--
訂單明細頁。

最上面，如果後端回傳 warning，例如已取消卻收到付款，用醒目的紅色顯示。

明細的內容用一個共用元件 app-order-view，前台的我的訂單也用它。

下面依訂單狀態顯示按鈕：已付款，顯示物流單號和出貨；已出貨，顯示完成；待付款和已付款可以取消。最後是向綠界查詢，收不到通知時補救用。

run 方法統一處理：成功就更新畫面，失敗就顯示後端的訊息。就算前端按鈕顯示錯了，後端的狀態檢查也會擋下來。
-->

---

# 銷售報表：圓餅圖

```ts
this.api.sales(this.from, this.to).subscribe((r) => {
  this.report.set(r);
  setTimeout(() => this.draw(r));           // 等 @if 裡的 canvas 出現在畫面上
});

private draw(r: SalesReport): void {
  this.chart?.destroy();                    // 換日期重新查詢時，先清掉舊的圖
  this.chart = new Chart(this.pie()!.nativeElement, {
    type: 'pie',
    data: {
      labels: r.categories.map((c) => c.categoryName),
      datasets: [{ data: r.categories.map((c) => c.revenue) }],
    },
  });
}
```

<!--
銷售報表的圓餅圖，跟第四十一章一樣。

有兩個小地方要注意。第一，canvas 放在 @if 裡面，資料回來之後畫面才會產生 canvas，所以用 setTimeout 等畫面更新完再畫。第二，換日期重新查詢的時候，同一個 canvas 上已經有一張圖，要先 destroy 舊的，否則 Chart.js 會報錯。

右邊的商品排行，用一般的表格顯示。報表的數字來自後端的 MyBatis 查詢。
-->

---

# 驗收

<v-clicks>

- 一般會員進 `/admin` → 被送回首頁；管理員登入後看到營運摘要
- 新增商品：上傳圖片、新增兩個規格、儲存；前台搜尋得到
- 下架商品：前台消失；後台還看得到
- 訂單：已付款 → 填物流單號出貨 → 完成；已出貨的訂單沒有取消按鈕
- 報表：營業額與分類圓餅圖的數字，與訂單資料一致

</v-clicks>

<!--
最後照規格書驗收。

（下一步）權限：一般會員進不了後台。

（下一步）新增商品，上傳圖片、新增規格，前台搜尋得到。

（下一步）下架商品，前台消失、後台還在。

（下一步）訂單從已付款、出貨到完成。

（下一步）報表的數字跟訂單一致。
-->

---

# 重點回顧

<Pairs left="辦公桌" right="Angular" rows="cabinet,一排抽屜=code,Sidenav + 子路由 + lazy loading|doc,白板=code,mat-card + Chart.js（沒有訂單的日子補 0）|form,行數不固定的價目卡=code,FormArray + formArrayName + formGroupName|paper,貼上照片=code,FormData 上傳 → imageUrl|ok,蓋章的規矩=code,依狀態顯示按鈕，後端再檢查" />

<!--
回顧。

（下一步）一排抽屜，是 Sidenav、子路由和 lazy loading。

（下一步）白板，是卡片和折線圖，沒有訂單的日子要補 0。

（下一步）行數不固定的價目卡，是 FormArray。

（下一步）貼上照片，是用 FormData 上傳。

（下一步）蓋章的規矩，是依狀態顯示按鈕，後端再檢查一次。
-->

---

# 專題完成！

<v-clicks>

- 前台 + 後台 + Spring Boot 後端 + 綠界測試環境，一個完整的電商網站
- 下一步：Docker 課，把資料庫、後端、前端三個服務用 `docker compose` 部署上線
- 完整的規格與驗收清單：`specs/SHOP-SPEC.md`；參考解答：`projects/cafe-shop-web`

</v-clicks>

<!--
專題的前端完成了，恭喜大家。

（下一步）前台、後台、Spring Boot 後端、綠界測試環境，這是一個完整的電商網站，可以放進作品集。

（下一步）下一步是 Docker 課，把資料庫、後端、前端三個服務一起部署上線。

（下一步）完整的規格和驗收清單在 SHOP-SPEC.md，參考解答在 projects 資料夾。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
Angular 課到這裡全部結束，謝謝大家。
-->
