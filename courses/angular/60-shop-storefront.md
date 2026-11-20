---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題：電商前台
routeAlias: ch60
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
    專題：電商前台
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「逛商品、放購物車、結帳、刷卡，一路接到後端」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
歡迎來到第六十章，進階學程的前端專題：轉角咖啡線上商店的前台。

後端在 Spring Boot 課的第五十一到五十七章已經完成。這一章用 Angular Material、Signals、Reactive Forms，加上上一章的攔截器和守衛，把客人看到的畫面做出來。參考解答在 projects/cafe-shop-web。
-->

---

# 今天要完成的畫面

<v-clicks>

- `/products`：分類、即時搜尋、排序、分頁
- `/products/:id`：選規格，價格和庫存跟著變，加入購物車
- `/cart`：改數量、刪除、「再買 X 元免運」；**登入前後都能用**
- `/checkout`：Reactive Forms 填收件資料 → 建立訂單 → **跳到綠界付款**
- `/orders/:orderNo/result`：付款結果；`/me/orders`：我的訂單、繼續付款、取消

</v-clicks>

<!--
今天要完成五組畫面。

（下一步）商品列表，有分類、即時搜尋、排序和分頁。

（下一步）商品頁，選不同規格，價格和庫存跟著變。

（下一步）購物車，登入前後都能用。

（下一步）結帳，填收件資料、建立訂單，然後跳到綠界的付款頁。

（下一步）付款結果頁，和我的訂單。
-->

---

# 故事：逛一間網路商店

<v-clicks>

- 客人逛貨架、挑包裝，放進**購物籃**；還沒登入時籃子**跟著瀏覽器**
- 登入後，籃子裡的東西**倒進店裡保管的籃子**
- 到櫃台**填寄送單**，格子沒填好不能送出
- 拿著**繳費單**到綠界刷卡，刷完回來，店員**查帳本**告訴你付款成功沒

</v-clicks>

<!--
用逛網路商店來想。

（下一步）客人逛貨架、挑包裝，放進購物籃。還沒登入的時候，籃子跟著瀏覽器。

（下一步）登入之後，把籃子裡的東西倒進店裡保管的籃子，換電腦也還在。

（下一步）到櫃台填寄送單，格子沒填好不能送出。

（下一步）拿著繳費單到綠界刷卡，刷完回來，店員查帳本，告訴你付款成功了沒。
-->

---

# 對應到程式

<Pairs left="網路商店" right="Angular" rows="cup,購物籃=code,CartService：signal + computed|paper,跟著瀏覽器的籃子=browser,localStorage（訪客）|staff,倒進店裡的籃子=code,登入後 POST /api/cart/merge|form,寄送單=code,Reactive Forms + Validators（第 51、52 章）|card,繳費單=code,後端回傳 fields，前端用隱藏表單送到綠界|book,查帳本=code,結果頁每 3 秒查一次訂單狀態" />

<!--
對應到程式。

（下一步）購物籃，是用 signal 和 computed 寫的 CartService。

（下一步）跟著瀏覽器的籃子，是 localStorage。

（下一步）倒進店裡的籃子，是登入後呼叫 merge。

（下一步）寄送單，是第五十一、五十二章的 Reactive Forms 和驗證器。

（下一步）繳費單，是後端回傳的表單欄位，前端用隱藏表單送到綠界。

（下一步）查帳本，是結果頁每三秒查一次訂單狀態。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 專案結構與商品

<!--
先看專案結構，再做商品的畫面。
-->

---

# 專案結構

```text
src/app/
├── core/                    ← 跟畫面無關的東西
│   ├── config.ts            ← 後端位址 http://localhost:8080
│   ├── models.ts            ← 照規格書寫的 interface
│   ├── auth.service.ts  auth.interceptor.ts  guards.ts   ← 第 59 章
│   ├── shop-api.service.ts  ← 前台的 API（把 AppResponse 的 data 拆出來）
│   └── cart.service.ts      ← 購物車狀態（Signals）
├── shared/                  ← 共用元件：商品卡片、訂單明細、狀態標籤
├── pages/                   ← 前台頁面：home、product-list、product-detail、cart、checkout…
└── admin/                   ← 後台（下一章，lazy loading）
```

```bash
ng new cafe-shop-web --style=scss --ssr=false --file-name-style-guide=2016 --zoneless=false
ng add @angular/material
npm install chart.js
```

<!--
先看專案結構。

core 放跟畫面無關的東西：後端的位址、資料的 interface、上一章的登入和攔截器、呼叫 API 的 Service、購物車狀態。shared 放好幾個頁面共用的元件。pages 放前台的頁面，admin 放後台。

建立專案用第五章的指令，再用 ng add 加入 Angular Material，安裝畫圖表用的 chart.js。
-->

---

# 拆開 AppResponse

```ts
// 後端：{ code: 200, message: "操作成功", data: {...} }
export interface AppResponse<T> { code: number; message: string; data: T; }

product(id: number): Observable<ProductDetail> {
  return this.http.get<AppResponse<ProductDetail>>(`${API}/products/${id}`).pipe(map((r) => r.data));
}
```

```ts
// 錯誤：後端有 message 就顯示後端的
export function errorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return '目前無法連線，請稍後再試';
    return err.error?.message ?? `發生錯誤（${err.status}）`;
  }
  return '發生錯誤';
}
```

<!--
後端每個回應都包在 AppResponse 裡。Service 用 RxJS 的 map 把 data 拆出來，元件拿到的就是乾淨的資料。

錯誤也統一處理：連不上顯示「目前無法連線」，其他情況顯示後端的 message，例如「庫存不足，剩 1 件」。後端的錯誤訊息寫得好，前端幾乎不用自己寫錯誤文字。
-->

---

# 商品列表：即時搜尋 + 分頁

```ts {all|1-3|6-7|10-13}
categoryId = new FormControl<number | null>(null);
keyword = new FormControl('', { nonNullable: true });
sort = new FormControl('', { nonNullable: true });

ngOnInit(): void {
  // 停止輸入 300ms 後才查，內容有變才查（第 37 章）
  this.keyword.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => this.search(0));
  this.categoryId.valueChanges.subscribe(() => this.search(0));
  this.sort.valueChanges.subscribe(() => this.search(0));
}
onPage(e: PageEvent): void {
  this.search(e.pageIndex);
}
```

```html
<mat-paginator [length]="r.totalElements" [pageSize]="r.size" [pageIndex]="r.page"
               [hidePageSize]="true" (page)="onPage($event)" />
```

<!--
商品列表。

（下一步）三個篩選條件都是 FormControl。

（下一步）關鍵字用第三十七章的即時搜尋：debounceTime 停止輸入三百毫秒才查，distinctUntilChanged 內容沒變就不查，打字的時候不會每按一個鍵就打一次後端。分類和排序一改變，就回到第一頁重新查。

（下一步）分頁用 Material 的 Paginator，總筆數、每頁筆數、目前頁碼都來自後端的 PageResponse。換頁時把頁碼傳給後端。後端的頁碼從 0 開始，Paginator 也是，剛好對得上。
-->

---

# 商品頁：選規格，價格跟著變

```ts {all|1|2|4-5}
id = input.required<string>();                 // 路由參數 :id（withComponentInputBinding）
variantId = signal<number | null>(null);

// 選不同規格時，價格與庫存跟著變
variant = computed(() => this.product()?.variants.find((v) => v.id === this.variantId()) ?? null);
```

```html
<mat-select [value]="variantId()" (valueChange)="variantId.set($event); quantity = 1">
  @for (v of p.variants; track v.id) {
    <mat-option [value]="v.id" [disabled]="v.stock === 0">{{ v.name }}{{ v.stock === 0 ? '（售完）' : '' }}</mat-option>
  }
</mat-select>
@if (variant(); as v) {
  <div class="price">{{ v.price | currency: 'TWD' : 'symbol-narrow' : '1.0-0' }}</div>
}
```

<!--
商品頁。

（下一步）路由參數 id，用 input 接收。app.config 的 provideRouter 加了 withComponentInputBinding，路由參數就會自動放進同名的 input，不用再注入 ActivatedRoute。

（下一步）選中的規格用一個 signal 記住。

（下一步）目前的規格用 computed 算出來。選單一改，variantId 改變，variant 自動重算，價格和庫存就跟著變。賣完的規格在選單裡停用，後面加上售完。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 購物車（Signals）

<!--
接下來是購物車，這一章的重點之一。
-->

---

# CartService：登入前後兩種來源

```ts {all|2-3|5-11|13-14}
export class CartService {
  private serverCart = signal<Cart | null>(null);                  // 登入後：後端的購物車
  private guestItems = signal<GuestCartItem[]>(this.loadGuest());  // 訪客：localStorage

  readonly cart = computed<Cart>(() => {
    if (this.auth.isLoggedIn()) {
      return this.serverCart() ?? EMPTY_CART;
    }
    return this.guestCart(this.guestItems());   // 前端自己算小計、運費
  });

  // 導覽列的購物車數字
  readonly count = computed(() => this.cart().items.reduce((sum, i) => sum + i.quantity, 0));
}
```

<!--
購物車的狀態放在 CartService。

（下一步）兩個 signal：登入後用後端的購物車；訪客用 localStorage 的內容。

（下一步）cart 是 computed：有登入就看後端的，沒登入就看訪客的，訪客的小計和運費由前端自己算，規則跟後端一樣。畫面只要讀 cart，不用管資料從哪裡來。

（下一步）count 也是 computed，導覽列的購物車圖示用它顯示數字。購物車一改，數字自動更新，不用到處通知。
-->

---

# 登入後合併

```ts {all|5|6-9}
refresh(): Observable<Cart> {
  if (!this.auth.isLoggedIn()) {
    return of(this.cart());
  }
  const guest = this.guestItems();
  const request = guest.length > 0 ? this.api.mergeCart(guest) : this.api.cart();
  return request.pipe(tap((cart) => {
    this.serverCart.set(cart);
    this.clearGuest();                 // 合併完清掉 localStorage
  }));
}
```

<v-click>

```ts
// LoginComponent：登入成功 → 合併購物車 → 回到原本要去的頁面
this.auth.login(email, password).subscribe({
  next: () => this.cart.refresh().subscribe({ next: () => this.router.navigateByUrl(this.returnUrl) }),
});
```

</v-click>

<!--
登入之後要合併購物車。

（下一步）refresh 方法：訪客的籃子有東西，就呼叫 merge；沒有，就直接讀後端的購物車。

（下一步）拿到結果，存進 serverCart，再清掉 localStorage。之後都以後端為準。

（下一步）登入頁在登入成功之後呼叫 refresh，再回到原本要去的頁面。客人在購物車按結帳、登入、回到結帳頁，籃子裡的東西都在。
-->

---

# 想一想

<Poll question="訪客在購物車放了一包豆子，接著登入。如果沒有呼叫 merge，會發生什麼事？" options="一樣，豆子還在|豆子不見了：畫面改看後端的購物車，localStorage 的內容沒送上去|重複兩包|後端報錯" answer="2" />

<!--
想一想。如果登入後沒有呼叫 merge，會怎樣？

豆子會不見。登入後 cart 改看後端的購物車，localStorage 裡的東西沒有送上去，客人會以為網站把東西弄丟了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 結帳與付款

<!--
最後是結帳和付款。
-->

---

# 結帳：Reactive Forms

```ts
form = inject(FormBuilder).nonNullable.group({
  receiverName: ['', [Validators.required, Validators.maxLength(20)]],
  receiverPhone: ['', [Validators.required, Validators.pattern(/^09\d{8}$/)]],
  receiverAddress: ['', [Validators.required, Validators.maxLength(200)]],
  note: ['', Validators.maxLength(200)],
  payment: ['ECPAY' as 'ECPAY' | 'MOCK'],
});
```

```html
<mat-form-field>
  <mat-label>手機</mat-label>
  <input matInput formControlName="receiverPhone" />
  @if (form.controls.receiverPhone.hasError('pattern')) { <mat-error>手機格式不正確</mat-error> }
</mat-form-field>
```

<!--
結帳頁用第五十一、五十二章的 Reactive Forms。

FormBuilder 建立表單，nonNullable 讓 reset 之後回到初始值而不是 null。每個欄位的驗證規則跟後端的 CheckoutRequest 一樣。payment 是付款方式，綠界或模擬付款。

畫面上用 formControlName 綁欄位，hasError 判斷是哪一種錯誤，顯示對應的訊息。進入頁面時，用會員資料預先帶入姓名和手機。
-->

---

# 送出：建立訂單 → 付款

```ts {all|3-6|9-13|14-16}
submit(): void {
  const { payment, ...receiver } = this.form.getRawValue();
  this.api.createOrder(receiver).subscribe({            // 1. 建立訂單（金額由後端算）
    next: (order) => { this.cartService.clearAfterOrder(); this.pay(order.orderNo, payment); },
    error: (e) => this.error.set(errorMessage(e)),      // 例如「轉角特調 一磅 庫存不足」
  });
}
private pay(orderNo: string, payment: 'ECPAY' | 'MOCK'): void {
  if (payment === 'MOCK') {
    this.api.mockPay(orderNo).subscribe(() => this.router.navigate(['/orders', orderNo, 'result']));
    return;
  }
  this.api.ecpayForm(orderNo).subscribe({
    next: (form) => submitEcpayForm(form),              // 2. 整頁跳到綠界
  });
}
```

<!--
按下送出。

（下一步）先建立訂單。送出的只有收件資料，金額由後端算。失敗的話，例如有商品庫存不足，顯示後端的訊息。成功了，清掉畫面上的購物車，接著付款。

（下一步）模擬付款，呼叫 mock 之後直接到結果頁。

（下一步）綠界：向後端要付款表單的資料，交給 submitEcpayForm，整頁跳到綠界。
-->

---

# 隱藏表單送到綠界

```ts
export function submitEcpayForm(form: EcpayForm): void {
  const el = document.createElement('form');
  el.method = 'post';
  el.action = form.action;                       // https://payment-stage.ecpay.com.tw/…
  for (const [name, value] of Object.entries(form.fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;                         // 含 CheckMacValue
    el.appendChild(input);
  }
  document.body.appendChild(el);
  el.submit();
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 不能用 HttpClient 呼叫綠界：綠界規定要由瀏覽器整頁送出表單，而且跨網域的 API 呼叫會被 CORS 擋下。
</div>

</v-click>

<!--
綠界規定用表單 POST 到付款頁。我們用 JavaScript 動態建立一個 form，每個欄位變成一個隱藏的 input，加到頁面上，再呼叫 submit。瀏覽器就會整頁跳到綠界。

欄位的值，包括檢查碼，都是後端算好的，前端只是照抄。前端沒有 HashKey，也不應該有。

（下一步）為什麼不用 HttpClient？綠界規定要由瀏覽器整頁送出，而且從我們的網頁用 API 呼叫綠界，會被 CORS 擋下來，這是 Spring Boot 課第四十九章講過的。
-->

---

# 付款結果：每 3 秒查一次

```ts {all|2|3|4|5}
this.sub = interval(3000).pipe(
  startWith(0),                                         // 先馬上查一次
  take(21),                                             // 最多查 1 分鐘
  switchMap(() => this.api.myOrder(this.orderNo())),
  takeWhile((o) => o.status === 'PENDING_PAYMENT', true),   // 不是待付款就停
).subscribe({ next: (o) => this.order.set(o) });
```

<v-clicks>

- 刷完卡，綠界讓瀏覽器回到後端 `/result` → 302 到這一頁
- **只看自己後端的訂單狀態**，不看網址上的參數
- 離開頁面時在 `ngOnDestroy` 取消訂閱（第 45 章）

</v-clicks>

<!--
刷完卡回到結果頁。綠界的付款通知通常比客人早到，但不一定，所以要等一下。

（下一步）startWith 0，一進頁面先查一次。

（下一步）interval 每三秒一次，take 最多二十一次，大約一分鐘。

（下一步）switchMap 每次都去查訂單。

（下一步）takeWhile：狀態不是待付款了，就停止。第二個參數 true 表示最後那一筆也要送出來，畫面才會顯示「付款成功」。

（下一步）這一頁是從後端的 result 轉過來的。

（下一步）只看自己後端的訂單狀態，網址上的參數客人可以自己改，不能相信。

（下一步）離開頁面時記得取消訂閱，第四十五章說過，不然計時器會一直跑。
-->

---

# 驗收

<v-clicks>

- 訪客加入購物車 → 結帳要求登入 → 登入後購物車還在、數量正確
- 模擬付款：結果頁顯示「付款成功」，「我的訂單」看到已付款
- 綠界：跳到測試付款頁，用測試卡 `4311-9522-2222-2222` 付款，回到結果頁
- 未付款的訂單可以「繼續付款」或「取消訂單」
- 手機寬度：商品一欄、結帳表單一欄，不會左右捲動

</v-clicks>

<!--
最後照規格書驗收。

（下一步）訪客加入購物車、結帳時要求登入、登入後購物車還在。

（下一步）模擬付款的流程跑一次。

（下一步）綠界的流程跑一次，用測試卡付款。記得後端要開 Cloudflare Tunnel，綠界的通知才進得來；沒開的話，結果頁會一直處理中，可以到後台按「向綠界查詢」。

（下一步）未付款的訂單，可以繼續付款或取消。

（下一步）用開發者工具切到手機寬度，版面不會跑掉。
-->

---

# 重點回顧

<Pairs left="網路商店" right="Angular" rows="cup,購物籃=code,CartService：signal + computed|staff,倒進店裡的籃子=code,登入後 refresh() → merge|form,寄送單=code,Reactive Forms + Validators|card,繳費單=code,submitEcpayForm 動態建立隱藏表單|book,查帳本=code,interval + switchMap + takeWhile" />

<!--
回顧。

（下一步）購物籃，是 signal 和 computed 的 CartService。

（下一步）倒進店裡的籃子，是登入後的 merge。

（下一步）寄送單，是 Reactive Forms。

（下一步）繳費單，是動態建立的隱藏表單。

（下一步）查帳本，是用 RxJS 每三秒查一次訂單。
-->

---

# 小結

<v-clicks>

- Service 把 `AppResponse` 拆開；錯誤訊息用後端的 `message`
- 購物車用 Signals：登入前 localStorage、登入後後端，畫面只讀 `cart()`
- 結帳：Reactive Forms → 建立訂單 → 隱藏表單跳到綠界 → 結果頁輪詢
- **練習**：商品列表的篩選條件寫進網址（`?categoryId=1&page=2`），重新整理後保留

</v-clicks>

<!--
小結。

（下一步）Service 把 AppResponse 拆開，錯誤訊息用後端的。

（下一步）購物車用 Signals，畫面只讀 cart。

（下一步）結帳的四個步驟。

（下一步）練習：把商品列表的篩選條件寫進網址的查詢參數，重新整理或分享網址時，條件都還在。下一章，做管理後台。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
