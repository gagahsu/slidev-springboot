---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題：轉角咖啡前端
routeAlias: ch58
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
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    專題：轉角咖啡前端
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「元件拼出一頁式網站，接上自己的後端」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，這一章是基礎學程的最後一個專題：轉角咖啡的前端。

後端在 Spring Boot 課的專題章已經完成了，有菜單 API 和訂位 API。這一章我們用 Angular 把畫面做出來，接上這些 API，完成一個真的能用的一頁式網站。

用到的都學過：元件、繫結、@if、@for、呼叫 API、interface。這一章是把它們組起來。
-->

---

# 先看成品

<v-clicks>

- **導覽列**：菜單、訂位、營業資訊，點了捲到對應的區塊
- **主視覺**：一句標語和「立即訂位」按鈕
- **菜單**：分類分頁，切換分類只顯示該分類的品項
- **線上訂位**：表單，送出成功顯示訊息、清空表單；有錯誤顯示在欄位下面
- **營業資訊**：地址、電話、營業時間
- （加分）`/admin/reservations`：選日期，列出當天的訂位

</v-clicks>

<!--
先看成品，由上到下。

（下一步）導覽列有三個連結，點了會捲到下面對應的區塊。

（下一步）主視覺有一句標語，和一個「立即訂位」的按鈕。

（下一步）菜單有分類分頁，點咖啡只顯示咖啡，點甜點只顯示甜點。資料來自後端。

（下一步）線上訂位表單，送出成功顯示訊息並清空；有錯誤，就顯示在那個欄位的下面。

（下一步）營業資訊，內容固定。

（下一步）加分題：另一個頁面，店家選一個日期，列出那天的訂位。
-->

---

# 故事：裝潢店面

後端是廚房，已經可以出餐了。現在要**裝潢店面**：

<v-clicks>

- 店面分成幾**區**：招牌、櫥窗、菜單牆、訂位櫃台、門口告示
- 每一區**各自施工**，最後再拼起來
- 菜單牆上的品項，**每天從廚房拿最新的**
- 訂位櫃台收到單子，**先自己看一眼**，再送進廚房
- 廚房休息時，櫃台要**貼出告示**，不能讓客人乾等

</v-clicks>

<!--
用裝潢店面來想。後端是廚房，已經可以出餐了，現在要把店面裝潢好。

（下一步）店面分成好幾區：招牌、櫥窗、菜單牆、訂位櫃台、門口的告示。

（下一步）每一區各自施工，最後再拼成一間店。

（下一步）菜單牆上的品項不是畫死的，每天都從廚房拿最新的。

（下一步）訂位櫃台收到客人的單子，先自己看一眼有沒有填錯，再送進廚房。

（下一步）萬一廚房休息，櫃台要貼出告示，不能讓客人站在那邊乾等。
-->

---

# 對應到程式

<Pairs left="裝潢店面" right="Angular" rows="shop,店面的各區=code,元件：header、hero、menu、reservation-form、footer|form,拼成一間店=code,home 頁面把元件依序放進來|cup,每天從廚房拿菜單=code,CafeApiService 呼叫 GET /api/products|clerk,櫃台先看一眼=code,前端檢查（規則和後端一樣）|no,廚房休息的告示=code,subscribe 的 error：「目前無法連線，請稍後再試」" />

<!--
對應到程式。

（下一步）店面的每一區，就是一個元件：header、hero、menu、reservation-form、footer。

（下一步）拼成一間店，是 home 頁面，把這些元件依序放進來。

（下一步）每天從廚房拿菜單，是 CafeApiService 去呼叫後端的 products API。

（下一步）櫃台先看一眼，是前端的檢查，規則跟後端一樣。

（下一步）廚房休息的告示，是 subscribe 的 error，顯示「目前無法連線，請稍後再試」。
-->

---

# 想一想

<Poll question="前端已經檢查過手機格式了，後端還需要再檢查一次嗎？" options="不用，前端檢查過就好|需要，有人可以不經過網頁、直接呼叫 API|不用，後端只負責存資料|看心情" answer="2" />

<!--
想一想。前端已經檢查過手機格式，後端還需要再檢查嗎？

需要。前端的檢查是為了讓客人馬上知道哪裡填錯，體驗比較好；但任何人都可以用 Postman 直接呼叫 API，跳過我們的網頁。所以真正把關的是後端，前端的檢查是加分的服務。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 開專案、規劃元件

<!--
先開專案，把元件規劃好。
-->

---

# 建立 cafe-web 專案

專案直接建在 Git 課做好的 `cafe-web` repository 資料夾裡：

<v-clicks>

1. 先把資料夾裡的 `README.md` **刪掉**（留著的話，`ng new` 會出現 `A merge conflicted on path "/README.md"`）
2. 用 VS Code 打開這個資料夾，開終端機，執行第 5 章的指令，多加 `--directory .`（建在目前的資料夾）：

   ```bash
   ng new cafe-web --directory . --style=scss --ssr=false --file-name-style-guide=2016 --zoneless=false
   ```

3. 照第 5 章，打開 `angular.json`，把 `addTypeToClassName` 改成 `true`
4. Angular 會產生新的 `README.md`，把原本的專案說明寫回去，用 GitHub Desktop commit

</v-clicks>

<!--
專案要放進 Git 課建好的 cafe-web repository，這樣才能用 GitHub Desktop 保存、推上 GitHub。

（下一步）第一步，先把資料夾裡的 README 刪掉。ng new 會自己產生一個 README，兩個撞在一起，就會出現 merge conflicted 的錯誤，專案建不起來。

（下一步）用 VS Code 打開這個資料夾，開終端機，執行第五章的指令。多加一個 --directory 點，意思是建在目前這個資料夾，不要再多開一層。Angular 看到這裡已經是 Git 的 repository，會跳過 git init，直接用原本的。

（下一步）別忘了第五章那個小設定：angular.json 的 addTypeToClassName 改成 true，元件的類別名稱才會是 HomeComponent，跟投影片一樣。

（下一步）最後打開 README，把原本那兩行專案說明寫回去，在 GitHub Desktop commit 一次，例如「建立 Angular 專案」。
-->

---

# 產生元件與 Service

```bash
ng g c components/header
ng g c components/hero
ng g c components/menu
ng g c components/reservation-form
ng g c components/footer
ng g c pages/home
ng g c pages/reservation-list
ng g s services/cafe-api
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ <code>ng g s</code> 產生的類別叫 <code>CafeApi</code>（<code>addTypeToClassName</code> 只管元件），請手動改成 <code>CafeApiService</code>，跟投影片一樣。
</div>

</v-click>

<!--
接著用 ng g c 產生元件。畫面上的五個區塊，放在 components 資料夾；完整的頁面放在 pages 資料夾，有首頁 home，和加分題的訂位清單。

最後用 ng g s 產生呼叫後端的 Service。

（下一步）注意，Service 的類別名稱是 CafeApi，因為剛才改的設定只管元件。打開 cafe-api.service.ts，把 CafeApi 改成 CafeApiService，旁邊的 spec 測試檔也一起改，或直接刪掉。這樣等一下照投影片寫，名稱才對得起來。
-->

---

# 下載素材包：圖片和樣式

這一章專心寫程式，畫面的樣式和菜單圖片已經準備好：

<v-clicks>

- 下載 <a href="/downloads/cafe-web-starter.zip" download><code>cafe-web-starter.zip</code></a>，解壓縮後，把裡面的 `public` 和 `src` **複製到專案資料夾**，覆蓋同名檔案
- `public/menu/`：12 張菜單圖片，網址是 `/menu/latte.svg`，跟資料庫存的 `image_url` 一樣
- `src/styles.scss` 和每個元件的 `.scss`：樣式靠 class 名稱對上，所以接下來 HTML 裡的 `class="…"` 要照投影片寫

</v-clicks>

<!--
HTML 和 CSS 在第八到十一章已經練過了，這一章專心把畫面接上後端。所以樣式和圖片已經幫大家準備好。

（下一步）下載投影片上的素材包，解壓縮之後，裡面有 public 和 src 兩個資料夾。把它們複製到專案資料夾，跟原本的 public、src 合併，同名的檔案直接覆蓋。剛才 ng g c 產生的空白 scss，就會換成寫好的樣式。

（下一步）public 底下的 menu 資料夾有十二張菜單圖片。public 是 Angular 放靜態檔的地方，裡面的檔案網址就是斜線 menu 斜線檔名，跟資料庫裡存的路徑一模一樣。

（下一步）樣式是靠 class 名稱找到元素的。所以接下來寫 HTML 的時候，class 要照投影片寫，名稱對不上，那一塊就不會有樣式。
-->

---

# 頁面與路由

```ts
// app.routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin/reservations', component: ReservationListComponent },
  { path: '**', redirectTo: '' },
];
```

```html
<!-- app.component.html：每一頁都有導覽列和頁尾 -->
<app-header />
<main><router-outlet /></main>
<app-footer />

<!-- home.component.html：一頁式網站的三個區塊 -->
<app-hero />
<app-menu />
<app-reservation-form />
```

<v-click>

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left text-sm">
💡 用到哪個元件，就要加進那個元件的 <code>imports</code>：<code>app.component.ts</code> 加 <code>HeaderComponent</code>、<code>FooterComponent</code>，<code>home.component.ts</code> 加 <code>HeroComponent</code>、<code>MenuComponent</code>、<code>ReservationFormComponent</code>。
</div>

</v-click>

<!--
路由只有兩頁：首頁，和加分題的訂位清單。打錯網址就回首頁。

app 元件放導覽列和頁尾，中間的 router-outlet 顯示目前的頁面。

首頁 home 把主視覺、菜單、訂位表單依序放進來。這就是「拼成一間店」。

（下一步）提醒一下，在 HTML 裡用到別的元件，要先在 TypeScript 的 imports 陣列加上它，不然會看到 is not a known element 的錯誤。VS Code 通常會提示你自動加上。
-->

---

# 寫死的三個區塊

<div class="grid grid-cols-2 gap-4">
<div>

```html
<!-- header.component.html -->
<header class="header">
  <a class="logo" routerLink="/">轉角咖啡</a>
  <nav>
    <a routerLink="/" fragment="menu">菜單</a>
    <a routerLink="/" fragment="reservation">訂位</a>
    <a routerLink="/" fragment="info">營業資訊</a>
  </nav>
</header>

<!-- hero.component.html -->
<section class="hero">
  <div class="text">
    <h1>巷口的一杯好咖啡</h1>
    <p>每天現烘的豆子、手作甜點。</p>
    <a class="cta" routerLink="/" fragment="reservation">立即訂位</a>
  </div>
</section>
```

</div>
<div>

```html
<!-- footer.component.html -->
<footer id="info" class="footer">
  <h2>營業資訊</h2>
  <ul>
    <li>📍 {{ info.address }}</li>
    <li>☎️ {{ info.phone }}</li>
    <li>🕙 {{ info.hours }}</li>
  </ul>
</footer>
```

```ts
// footer.component.ts
info = {
  address: '台北市大安區轉角路 1 號',
  phone: '02-1234-5678',
  hours: '每天 10:00–20:00（週一公休）',
};
```

</div>
</div>

<!--
導覽列、主視覺、營業資訊這三塊不用後端，內容寫死在前端。

左邊是導覽列和主視覺。連結用 routerLink 加 fragment，下一頁說明。用了 routerLink，這兩個元件的 imports 都要加上 RouterLink。

右邊是營業資訊。地址、電話、營業時間放在元件的 info 物件裡，畫面用內嵌繫結，也就是兩個大括號，把它們顯示出來。footer 的 id 是 info，導覽列的「營業資訊」就是捲到這裡。
-->

---

# 導覽列：捲到同一頁的區塊

```html
<a routerLink="/" fragment="menu">菜單</a>
<a routerLink="/" fragment="reservation">訂位</a>
```

```ts
// app.config.ts
provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
provideHttpClient(),
```

<v-clicks>

- `fragment="menu"` → 網址變成 `/#menu`，捲到 `id="menu"` 的區塊
- `anchorScrolling: 'enabled'`：讓 Angular 的路由幫我們捲動
- 在 `/admin/reservations` 點「菜單」，會先回首頁再捲過去（菜單載入後要再捲一次，第 2 部分會補上）

</v-clicks>

<!--
導覽列的連結要捲到同一頁的某個區塊。

用 routerLink 加上 fragment，fragment 就是網址井字號後面的部分。

app.config 裡，provideRouter 加上 withInMemoryScrolling，把 anchorScrolling 打開。另外別忘了 provideHttpClient，才能呼叫 API。

（下一步）點「菜單」，網址會變成井字號 menu，畫面捲到 id 是 menu 的區塊。

（下一步）anchorScrolling 打開，Angular 的路由才會幫我們捲動。

（下一步）好處是，就算在訂位清單頁點「菜單」，也會先回首頁、再捲過去。不過首頁一打開，菜單還在跟後端拿資料，拿到之後畫面變長，下面的訂位區塊會被往下推，捲好的位置就偏掉了。等一下寫菜單元件的時候，會補一個小步驟解決。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 接上菜單 API

<!--
接下來把菜單接上後端。
-->

---

# 資料的形狀：interface

在 `src/app` 新增 `models.ts`，照規格書的 JSON 寫成 interface（第 29 章）：

```ts
export interface Category {
  id: number;
  name: string;
  sortOrder: number;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;   // 可能沒有說明
  price: number;
  imageUrl: string | null;
}
```

<!--
先照規格書的 JSON，寫出資料的形狀。這是第二十九章的 interface。

欄位名稱要跟後端一模一樣，大小寫也要一樣。description 和 imageUrl 可能是空的，型別寫成 string 或 null，等一下畫面上就要記得處理沒有的情況。

這個檔案不是用 ng g 產生的，在 VS Code 的 src/app 資料夾按右鍵，新增檔案，命名為 models.ts。訂位用的三個 interface，下一頁接著寫在同一個檔案。
-->

---

# 訂位的資料形狀

接著寫在同一個 `models.ts`：

```ts {all|1-9|11-17|19-22}
export interface ReservationRequest {     // 送出去的表單
  name: string;
  phone: string;
  email: string;
  reserveDate: string;                    // yyyy-MM-dd
  reserveTime: string;                    // HH:mm
  people: number | null;                  // 數字欄位清空時是 null
  note: string;
}

export interface Reservation {            // 後端回來的訂位
  id: number;
  name: string;  phone: string;  email: string | null;
  reserveDate: string;  reserveTime: string;
  people: number;  note: string | null;
}

export interface ApiError {               // 後端的錯誤回應
  message: string;
  fields: Record<string, string>;         // 欄位名稱 → 錯誤訊息
}
```

<!--
訂位需要三個 interface。

（下一步）ReservationRequest 是送給後端的表單，欄位跟後端的 ReservationRequest 一樣。日期和時間在前端是字串，格式照規格書。人數寫成 number 或 null，因為客人把人數欄位清空的時候，ngModel 會給 null。

（下一步）Reservation 是後端回來的訂位，比表單多一個 id。客人沒填的 Email 和備註，後端存成 null，所以這兩個欄位可能是 null。

（下一步）ApiError 是後端錯誤的格式，就是後端章的 message 和 fields。Record 加上兩個 string，意思是「key 是字串、value 也是字串」的物件。
-->

---

# Service：呼叫自己的後端

```ts {all|3|6-8|10-14}
@Injectable({ providedIn: 'root' })
export class CafeApiService {
  private baseUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getProducts(categoryId?: number): Observable<Product[]> {
    const url = categoryId ? `${this.baseUrl}/products?categoryId=${categoryId}`
                           : `${this.baseUrl}/products`;
    return this.http.get<Product[]>(url);
  }

  createReservation(req: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/reservations`, req);
  }

  getReservations(date: string): Observable<Reservation[]> {   // 加分題
    return this.http.get<Reservation[]>(`${this.baseUrl}/reservations?date=${date}`);
  }
}
```

<!--
Service 把所有呼叫後端的程式集中在一起。上面記得 import 剛才 models.ts 裡的 interface。

（下一步）baseUrl 是我們自己的後端。

（下一步）查分類。

（下一步）查品項，可以帶分類編號，也可以不帶。

新增訂位用 post，把表單資料送出去。最後一個是加分題用的，用日期查訂位。元件只要呼叫這些方法，不用知道網址長什麼樣子。
-->

---

# 菜單元件：先載入，再顯示

```ts {all|7|8-13|21-23|25}
export class MenuComponent implements OnInit {
  private api = inject(CafeApiService);
  categories: Category[] = [];  products: Product[] = [];
  selectedId = 0;  loading = true;  error = '';

  ngOnInit(): void {
    this.api.getCategories().subscribe({
      next: (cats) => this.api.getProducts().subscribe({
        next: (data) => {
          this.products = data;  // 只留下有品項的分類，預設選第一個
          this.categories = cats.filter((c) => data.some((p) => p.categoryId === c.id));
          this.selectedId = this.categories[0]?.id ?? 0;
          this.loading = false;
        },
        error: () => this.showError(),
      }),
      error: () => this.showError(),
    });
  }

  get shown(): Product[] {
    return this.products.filter((p) => p.categoryId === this.selectedId);
  }

  private showError(): void { this.loading = false;  this.error = '目前無法連線，請稍後再試'; }
}
```

<!--
菜單元件，一載入就去拿資料。

（下一步）先拿分類。

（下一步）分類拿到之後，再拿全部的品項。季節限定這個分類還沒有品項，所以用 filter 把沒有品項的分類拿掉，免得客人點進去一片空白。然後預設選第一個分類。

（下一步）shown 是一個 getter，算出目前分類的品項。點分類的時候只要改 selectedId，畫面就會跟著變，不用再呼叫一次後端。

（下一步）任何一個呼叫失敗，都交給 showError：不再載入中，改顯示錯誤訊息。
-->

---

# 菜單的畫面

```html {all|1-6|8-12|13-23}
<section id="menu" class="section">
  <h2 class="section-title">菜單</h2>
@if (loading) {
  <p class="hint">載入中…</p>
} @else if (error) {
  <p class="hint error">{{ error }}</p>
} @else {
  <div class="tabs">
    @for (c of categories; track c.id) {
      <button [class.active]="c.id === selectedId" (click)="selectedId = c.id">{{ c.name }}</button>
    }
  </div>
  <div class="cards">
    @for (p of shown; track p.id) {
      <article class="card">
        @if (p.imageUrl) { <img [src]="p.imageUrl" [alt]="p.name" /> }
        <div class="body">
          <h3>{{ p.name }}</h3>
          @if (p.description) { <p>{{ p.description }}</p> }
          <span class="price">NT$ {{ p.price }}</span>
        </div>
      </article>
    }
  </div>
}
</section>
```

<!--
畫面用 @if 分成三種情況。

（下一步）整個菜單包在 id 是 menu 的 section 裡，導覽列的「菜單」就是捲到這裡。載入中，顯示載入中；出錯了，顯示錯誤訊息。千萬不要一片空白。

（下一步）分類按鈕用 @for 產生，目前選中的加上 active 樣式，點了就改 selectedId。

（下一步）品項卡片也用 @for。圖片和說明可能沒有，所以各自用 @if 包起來。
-->

---

# 菜單載入完，再捲一次

從 `/admin/reservations` 點「訂位」：先捲到訂位區塊，菜單才載入完、把它往下推。載入完之後**再捲一次**：

```ts {all|1-3|6-11|13}
private route = inject(ActivatedRoute);       // 目前的網址
private scroller = inject(ViewportScroller);  // 負責捲動畫面
private injector = inject(Injector);

private scrollAgain(): void {
  const fragment = this.route.snapshot.fragment;   // 網址 # 後面的字，例如 reservation
  if (fragment) {
    afterNextRender(() => this.scroller.scrollToAnchor(fragment),
                    { injector: this.injector });   // 等畫面更新完才捲
  }
}

// ngOnInit 裡，this.loading = false; 的下一行加上：this.scrollAgain();
```

<!--
還記得導覽列那一頁說的問題嗎？在訂位清單頁點「訂位」，Angular 會先回首頁、捲到訂位區塊。可是這時候菜單還在跟後端拿資料，等資料回來，菜單的卡片一張張出現，畫面變長，訂位區塊就被推到下面去了。

（下一步）解法是：菜單載入完，再捲一次。先注入三個東西。ActivatedRoute 可以讀目前的網址；ViewportScroller 是 Angular 負責捲動畫面的服務；Injector 等一下 afterNextRender 會用到。import 的時候，ViewportScroller 來自 @angular/common，ActivatedRoute 來自 @angular/router，Injector 和 afterNextRender 來自 @angular/core，VS Code 通常會幫你自動加上。

（下一步）scrollAgain 先讀網址井字號後面的字，例如 reservation。有的話，就捲到那個 id。為什麼要包一層 afterNextRender？因為我們改了資料之後，Angular 要等一下才會把卡片畫到畫面上。如果馬上捲，量到的還是卡片出現之前的位置。afterNextRender 的意思是：等畫面更新完，再執行裡面的程式。

（下一步）最後在 ngOnInit 裡，loading 改成 false 的下一行，呼叫 scrollAgain。網址沒有井字號的時候，例如直接打開首頁，什麼都不會發生。
-->

---

# 想一想

<Poll question="後端沒有啟動，打開網頁的菜單區塊會顯示什麼？" options="一片空白|載入中…（永遠轉不完）|目前無法連線，請稍後再試|Angular 編譯錯誤" answer="3" />

<!--
想一想。後端沒有啟動，菜單區塊會顯示什麼？

會顯示「目前無法連線，請稍後再試」。連不到後端，HttpClient 會呼叫 error，我們在 showError 裡把 loading 改成 false、設定錯誤訊息。如果沒寫 error，畫面就會永遠停在載入中。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 訂位表單

<!--
接下來是訂位表單，這一章最重要的部分。
-->

---

# 表單的資料與選項

```ts {all|1-4|6-8|10-11|13-17}
form: ReservationRequest = this.emptyForm();
private emptyForm(): ReservationRequest {
  return { name: '', phone: '', email: '', reserveDate: '', reserveTime: '', people: 2, note: '' };
}

errors: Record<string, string> = {};   // 欄位名稱 → 錯誤訊息
message = '';
sending = false;                        // 送出中，按鈕先停用

minDate = new Date().toLocaleDateString('sv-SE');                              // 今天
maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE');  // 30 天後

timeSlots = this.buildTimeSlots();      // ['10:00', '10:30', … '19:30']
private buildTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 10; h <= 19; h++) slots.push(`${h}:00`, `${h}:30`);
  return slots;
}
```

<!--
表單元件的資料。

元件的 imports 記得加上 FormsModule，等一下的 ngModel 才能用。

（下一步）form 物件的欄位，跟後端的 ReservationRequest 一模一樣，送出時整個物件丟給後端。emptyForm 產生一張空白的表單，一開始用它，送出成功後也用它清空。人數預設兩位。

（下一步）errors 是一個物件，key 是欄位名稱，value 是錯誤訊息。這個形狀跟後端回來的 fields 一樣，後端的錯誤可以直接放進來。message 是成功或連線失敗的訊息。sending 記錄是不是送出中。

（下一步）日期的最小值是今天，最大值是三十天後，等一下放在日期欄位上，客人就選不到範圍外的日子。toLocaleDateString 帶 sv-SE 是一個小技巧：瑞典的日期格式剛好是 yyyy-MM-dd，跟日期欄位和後端要的格式一樣。

（下一步）時段從十點到七點半，每三十分鐘一個，用迴圈產生，放進下拉選單，客人就不會選到十點十五分。
-->

---

# 表單的畫面

```html {all|1-3|4-7|9-17|19-20}
<section id="reservation" class="section">
  <h2 class="section-title">線上訂位</h2>
  <form class="form" (ngSubmit)="submit()">
    <label>手機 *
      <input name="phone" [(ngModel)]="form.phone" placeholder="0912345678" />
      @if (errors['phone']) { <span class="error">{{ errors['phone'] }}</span> }
    </label>

    <label>日期 *
      <input name="reserveDate" type="date" [(ngModel)]="form.reserveDate" [min]="minDate" [max]="maxDate" />
    </label>
    <label>時段 *
      <select name="reserveTime" [(ngModel)]="form.reserveTime">
        <option value="">請選擇</option>
        @for (t of timeSlots; track t) { <option [value]="t">{{ t }}</option> }
      </select>
    </label>

    <button type="submit" class="wide" [disabled]="sending">送出訂位</button>
    @if (message) { <p class="wide message">{{ message }}</p> }
  </form>
</section>
```

<!--
表單的畫面，用第二十一章的雙向繫結 ngModel。記得在元件的 imports 加上 FormsModule。

（下一步）整個表單包在 id 是 reservation 的 section 裡，導覽列的「訂位」就是捲到這裡。form 標籤的 ngSubmit，按下送出按鈕時呼叫 submit。

（下一步）每個欄位用 ngModel 綁到 form 物件，下面用 @if 顯示這個欄位的錯誤訊息。這裡只列出手機，姓名、Email、人數、備註照樣寫，name 和 ngModel 換成各自的欄位名稱。人數用 type 等於 number 的 input，備註用 textarea。Email 和備註比較長，label 加上 class 等於 wide，就會佔滿一整行。

（下一步）日期欄位用 min 和 max 限制範圍。時段是下拉選單，選項用 @for 產生。這兩個欄位下面，也照手機的寫法加上錯誤訊息。

（下一步）送出中把按鈕停用，避免客人連按兩次，送出兩筆訂位。按鈕下面顯示成功或失敗的訊息。
-->

---

# 送出：前端先檢查，再交給後端

```ts {all|3-4|6-11|12-19}
submit(): void {
  this.message = '';
  this.errors = this.check();                         // 前端先檢查
  if (Object.keys(this.errors).length > 0) return;

  this.sending = true;
  this.api.createReservation(this.form).subscribe({
    next: () => {
      this.sending = false;
      this.message = '已收到您的訂位，我們當天見！';
      this.form = this.emptyForm();                   // 清空表單
    },
    error: (err: HttpErrorResponse) => {
      this.sending = false;
      if (err.status === 400) {
        this.errors = (err.error as ApiError).fields; // 後端的欄位錯誤
      } else {
        this.message = '目前無法連線，請稍後再試';
      }
    },
  });
}
```

<!--
按下送出之後。

（下一步）先跑前端的檢查，check 方法回傳一個錯誤物件。有任何錯誤，就停在這裡，不送出。

（下一步）通過了才呼叫後端。成功的話，顯示成功訊息，把表單換成一個空的。

（下一步）失敗分兩種。400 是後端退件，err.error 就是後端回來的 ApiError，把 fields 放進 errors，訊息就會出現在對應的欄位下面。其他情況，像是後端沒開，就顯示「目前無法連線」。
-->

---

# 前端的檢查：跟後端同一套規則

```ts
private check(): Record<string, string> {
  const e: Record<string, string> = {};
  const f = this.form;
  if (!f.name.trim()) e['name'] = '請輸入姓名';
  if (!/^09\d{8}$/.test(f.phone)) e['phone'] = '手機格式不正確';
  if (!f.reserveDate || f.reserveDate < this.minDate || f.reserveDate > this.maxDate) {
    e['reserveDate'] = '只能預約 30 天內的日期';
  }
  if (!f.reserveTime) e['reserveTime'] = '請選擇營業時段';
  if (f.people === null || f.people < 1 || f.people > 8) e['people'] = '一次最多預約 8 位';
  return e;
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 錯誤訊息照規格書，跟後端<b>一字不差</b>：不管是哪一邊擋下來，客人看到的都一樣。
</div>

</v-click>

<!--
前端的檢查，規則跟後端一樣。

姓名不能空白；手機用正規表示式，09 開頭再八個數字，跟後端的 @Pattern 一樣；日期在範圍內；時段要選；人數一到八位。

日期是 yyyy-MM-dd 格式的字串，這種格式可以直接用大於小於比較先後。

（下一步）錯誤訊息照規格書寫，跟後端一字不差。這樣不管是前端擋下來，還是繞過前端被後端擋下來，客人看到的訊息都一樣。
-->

---

# 想一想

<Poll question="後端回了 400，fields 是 { reserveTime: &quot;請選擇營業時段&quot; }。畫面上會發生什麼事？" options="什麼都沒有|跳出 alert 視窗|時段欄位下面出現「請選擇營業時段」|整個表單被清空" answer="3" />

<!--
想一想。後端回了 400，fields 裡有 reserveTime。畫面上會發生什麼事？

時段欄位下面會出現「請選擇營業時段」。我們把 fields 放進 errors，畫面上的 @if 看到 errors 的 reserveTime 有值，就把訊息顯示出來。表單不會被清空，客人只要改那一格就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 加分題與驗收

<!--
最後是加分題和驗收。
-->

---

# 加分題：店家查訂位

```ts
export class ReservationListComponent implements OnInit {
  private api = inject(CafeApiService);
  date = new Date().toLocaleDateString('sv-SE');   // 今天，yyyy-MM-dd
  reservations: Reservation[] = [];
  error = '';

  ngOnInit(): void { this.load(); }               // 一打開就查今天
  load(): void {
    this.api.getReservations(this.date).subscribe({
      next: (data) => (this.reservations = data),
      error: () => (this.error = '目前無法連線，請稍後再試'),
    });
  }
  get totalPeople(): number {
    return this.reservations.reduce((sum, r) => sum + r.people, 0);
  }
}
```

```html
<input type="date" [(ngModel)]="date" (change)="load()" />
<span>共 {{ reservations.length }} 組、{{ totalPeople }} 位</span>
```

<!--
加分題是店家查訂位的頁面，後端要先完成第五十章的 GET /api/reservations?date=。imports 一樣要加 FormsModule。

date 預設是今天，一打開頁面就在 ngOnInit 查今天的訂位。toLocaleDateString 帶 sv-SE，是一個小技巧：瑞典的日期格式剛好是 yyyy-MM-dd，跟後端要的一樣。

load 用日期呼叫後端，拿到的訂位放進陣列，畫面用 @for 畫成表格。totalPeople 用 reduce 把人數加總，店家就知道那天要準備幾個位子。

日期欄位改變的時候，再呼叫一次 load。
-->

---

# 驗收清單

<v-clicks>

- 首頁依序顯示：導覽列、主視覺、菜單、訂位表單、營業資訊
- 切換分類只顯示該分類；**季節水果塔**（暫停供應）不出現
- 訂位成功：顯示訊息、表單清空、資料庫多一筆
- 手機錯、人數 9 位：前端擋下；用 Postman 繞過前端，後端回 400
- **關掉後端**：菜單和表單都顯示「目前無法連線，請稍後再試」
- 手機寬度（DevTools 切到手機模式）：一欄排列，不會左右捲動

</v-clicks>

<!--
最後照規格書的驗收清單，一項一項檢查。

（下一步）首頁五個區塊依序出現。

（下一步）切換分類只顯示該分類，暫停供應的季節水果塔不能出現。

（下一步）訂位成功，顯示訊息、表單清空，去資料庫看多了一筆。

（下一步）故意填錯，前端要擋下來。再用 Postman 繞過前端，後端也要擋下來。

（下一步）把後端關掉，重新整理，菜單和表單都要顯示「目前無法連線」，不能一片空白。

（下一步）用開發者工具切到手機模式，菜單和表單都變成一欄，不會左右捲動。
-->

---

# 重點回顧

<Pairs left="裝潢店面" right="Angular" rows="shop,店面的各區=code,components 資料夾裡的五個元件|form,拼成一間店=code,home 頁面 + app 的 header / footer|cup,從廚房拿菜單=code,CafeApiService + subscribe|clerk,櫃台先看一眼=code,check()：跟後端同一套規則|doc,廚房退回的單子=code,400 的 fields 放進 errors|no,廚房休息的告示=code,error：目前無法連線" />

<!--
回顧一下。

（下一步）店面的每一區，是 components 裡的五個元件。

（下一步）拼成一間店，是 home 頁面，加上 app 元件的導覽列和頁尾。

（下一步）從廚房拿菜單，是 CafeApiService 加上 subscribe。

（下一步）櫃台先看一眼，是 check 方法，規則跟後端一樣。

（下一步）廚房退回的單子，是 400 的 fields，放進 errors 顯示在欄位下面。

（下一步）廚房休息的告示，是 error 裡的「目前無法連線」。
-->

---
layout: end
---

# 轉角咖啡開張了！

基礎學程完成，恭喜大家

<!--
前後端都接起來，轉角咖啡正式開張了。基礎學程到這裡完成，恭喜大家！

進階學程會在同一家店的基礎上，做出有會員、購物車和綠界金流的線上商店。
-->
