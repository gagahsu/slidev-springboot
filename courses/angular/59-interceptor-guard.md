---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: HTTP 攔截器與路由守衛
routeAlias: ch59
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
  <h1 style="color: #1a5c5c; font-size: 2.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    HTTP 攔截器<br>與路由守衛
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「每封信自動蓋章，每扇門都有人驗票」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
歡迎來到第五十九章。這一章學兩個在有登入功能的網站一定會用到的工具：HTTP 攔截器和路由守衛。

後端用 JWT 驗證身分，前端每次呼叫 API 都要帶上 token；有些頁面只有登入的人能進，有些只有管理員能進。如果每個地方都自己寫，很快就會漏掉。攔截器和守衛就是把這些事情集中在一個地方。
-->

---

# 今天要完成的事

<v-clicks>

- **HTTP 攔截器**：每個請求自動帶上 `Authorization: Bearer <token>`
- 收到 **401**：自動登出，導向登入頁
- **路由守衛**：沒登入不能進結帳頁；不是管理員不能進後台
- 登入後**回到原本要去的頁面**（`returnUrl`）

</v-clicks>

<!--
今天要完成四件事。

（下一步）HTTP 攔截器，讓每個送到後端的請求，自動帶上 JWT。

（下一步）收到 401，代表 token 過期或無效，自動登出、導向登入頁。

（下一步）路由守衛：沒登入的人不能進結帳頁，不是管理員不能進後台。

（下一步）被擋下來去登入之後，要回到原本想去的頁面，不是丟回首頁。
-->

---

# 故事：公司的收發室與驗票員

<v-clicks>

- 每個部門寄出的信，都先經過**收發室**，收發室自動**蓋上公司章**再寄出
- 退回來的信寫著「查無此人」，收發室**統一處理**，不用每個部門自己想辦法
- 公司的會議室門口有**驗票員**：沒有識別證的，請你先去櫃台辦
- 辦好識別證，驗票員**帶你回到原本要去的會議室**

</v-clicks>

<!--
用公司的收發室和驗票員來想。

（下一步）公司每個部門寄出的信，都先經過收發室。收發室自動在每封信蓋上公司章，部門的人不用每次自己蓋。

（下一步）有信被退回來，寫著查無此人，收發室統一處理，不用每個部門各自想辦法。

（下一步）會議室門口有驗票員，沒有識別證的人，請你先去櫃台辦。

（下一步）辦好識別證之後，驗票員帶你回到原本要去的那間會議室。
-->

---

# 對應到程式

<Pairs left="公司" right="Angular" rows="paper,每封信=browser,HttpClient 送出的每個請求|staff,收發室自動蓋章=code,HttpInterceptorFn：req.clone 加上 Authorization|no,退件統一處理=code,catchError：401 → 登出、導向登入頁|guard,會議室門口的驗票員=code,CanActivateFn（authGuard、adminGuard）|card,辦好證件回原本的會議室=code,returnUrl 查詢參數" />

<!--
對應到程式。

（下一步）每封信，是 HttpClient 送出的每個請求。

（下一步）收發室自動蓋章，是 HTTP 攔截器：複製一份請求，加上 Authorization 標頭。

（下一步）退件統一處理，是攔截器裡的 catchError：收到 401 就登出、導向登入頁。

（下一步）會議室門口的驗票員，是路由守衛 CanActivateFn。

（下一步）辦好證件回原本的會議室，是 returnUrl 這個查詢參數。
-->

---

# 想一想

<Poll question="網站有 20 個呼叫 API 的地方都要帶 JWT。下列哪一種做法最不容易出錯？" options="每個地方都自己加 headers|寫一個 HTTP 攔截器，統一加上|把 token 放在網址上|請後端不要檢查" answer="2" />

<!--
想一想。二十個呼叫 API 的地方都要帶 JWT，哪一種做法最不容易出錯？

寫一個攔截器統一加上。每個地方自己加，第二十一個地方很可能就忘了；token 放網址上會被記錄在瀏覽紀錄和伺服器的 Log 裡，不安全。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 先把登入狀態存好

<!--
攔截器和守衛都要知道「現在有沒有登入」，所以先寫一個管理登入狀態的 Service。
-->

---

# AuthService：用 Signals 管登入狀態

```ts {all|3|5-7|9-14|16-20}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private state = signal<LoginResult | null>(this.load());   // { token, name, role }

  readonly user = this.state.asReadonly();
  readonly isLoggedIn = computed(() => this.state() !== null);
  readonly isAdmin = computed(() => this.state()?.role === 'ADMIN');

  login(email: string, password: string): Observable<LoginResult> {
    return this.http.post<AppResponse<LoginResult>>(`${API}/auth/login`, { email, password }).pipe(
      map((r) => r.data),
      tap((data) => { this.state.set(data); localStorage.setItem(KEY, JSON.stringify(data)); }),
    );
  }

  logout(returnUrl?: string): void {
    this.state.set(null);
    localStorage.removeItem(KEY);
    this.router.navigate(['/login'], { queryParams: returnUrl ? { returnUrl } : {} });
  }
}
```

<!--
AuthService 用第四十七章的 Signals 管理登入狀態。

（下一步）state 是一個 signal，存後端登入回傳的 token、姓名和角色。初始值從 localStorage 讀，重新整理頁面也不會登出。

（下一步）用 computed 算出「有沒有登入」和「是不是管理員」。導覽列用它決定顯示「登入」還是會員名字，要不要顯示「管理後台」。

（下一步）登入：呼叫後端，把 AppResponse 的 data 拆出來，用 tap 順便存進 signal 和 localStorage。

（下一步）登出：清掉狀態和 localStorage，導向登入頁，可以帶上 returnUrl。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# HTTP 攔截器

<!--
接下來寫攔截器。
-->

---

# 攔截器：自動帶上 JWT

```ts {all|1|5-8|10}
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const token = auth.token;
  if (token && req.url.startsWith(API)) {
    // 請求物件不能直接改，要 clone 一份再加標頭
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req);
};
```

<!--
攔截器是一個函式，型別是 HttpInterceptorFn。

（下一步）參數 req 是要送出的請求，next 是「交給下一關」。HttpClient 送出的每個請求，都會先經過這個函式。

（下一步）有 token、而且是送給我們自己後端的請求，才加上 Authorization 標頭。請求物件是不可變的，不能直接改，要用 clone 複製一份，順便加上標頭。只送給自己的後端，是為了不要把 token 送給別的網站。

（下一步）最後呼叫 next，把請求送出去。
-->

---

# 收到 401：統一處理

```ts {all|3|4-7|8}
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 登入 API 自己的 401（帳號密碼錯）交給頁面顯示
      if (err.status === 401 && !req.url.includes('/auth/')) {
        auth.logout(router.url);          // 登出，帶著目前的網址去登入頁
      }
      return throwError(() => err);       // 錯誤繼續往下傳，頁面也收得到
    }),
  );
```

<!--
next 回傳的是 Observable，可以用第四十四章的 RxJS 運算子處理回應。

（下一步）catchError 接住錯誤。

（下一步）狀態碼是 401，代表 token 過期或無效，就登出，並且把目前的網址當成 returnUrl。但登入 API 本身的 401，是帳號密碼打錯，要讓登入頁顯示「帳號或密碼錯誤」，不能跳轉，所以排除掉。

（下一步）最後用 throwError 把錯誤繼續往下傳，呼叫的頁面一樣收得到。
-->

---

# 註冊攔截器

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

<v-clicks>

- `withInterceptors([...])` 可以放好幾個，依順序執行（例如再加一個顯示 Loading 的）
- 元件和 Service 的程式**完全不用改**，照樣 `this.http.get(...)`

</v-clicks>

<!--
寫好的攔截器，在 app.config 的 provideHttpClient 裡註冊。

（下一步）withInterceptors 是一個陣列，可以放好幾個攔截器，依順序執行。例如第四十六章的 Loading，也可以寫成攔截器，請求送出時顯示、回來時隱藏。

（下一步）最棒的是，元件和 Service 的程式完全不用改，照樣呼叫 http.get，token 就自動帶上了。
-->

---

# 想一想

<Poll question="使用者的 JWT 過期了，他在購物車頁按了「刪除」。會發生什麼事？" options="畫面當掉|後端回 401，攔截器登出並導向登入頁，登入後回到購物車|商品被刪除了|什麼都不會發生" answer="2" />

<!--
想一想。JWT 過期之後按刪除，會發生什麼事？

後端回 401，攔截器接到之後登出，帶著 returnUrl 導向登入頁。重新登入後回到購物車頁，再按一次就好。這些都不用在購物車頁寫任何程式。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 路由守衛

<!--
接下來寫路由守衛。
-->

---

# authGuard：沒登入就去登入頁

```ts {all|1|5-7|8}
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;                                   // 放行
  }
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
```

<v-click>

```ts
{ path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
{ path: 'me/orders', component: MyOrdersComponent, canActivate: [authGuard] },
```

</v-click>

<!--
路由守衛也是一個函式，型別是 CanActivateFn。進入某個路由之前，Angular 會先問它。

（下一步）參數 state.url 是使用者想去的網址。

（下一步）有登入，回傳 true，放行。

（下一步）沒登入，回傳一個 UrlTree，也就是「改去另一個網址」：登入頁，帶上 returnUrl。

（下一步）在路由設定裡，用 canActivate 掛上守衛。結帳、我的訂單這些頁面，都要先登入。
-->

---

# adminGuard 與 lazy loading

```ts {all|1-7|9-13}
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }
  return auth.isAdmin() ? true : router.createUrlTree(['/']);
};

{
  path: 'admin',
  canActivate: [adminGuard],
  loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
},
```

<!--
後台的守衛多一層判斷。

（下一步）沒登入，一樣去登入頁；登入了但不是管理員，送回首頁。

（下一步）後台的路由用 loadChildren，這叫 lazy loading：後台的程式打包成另一個檔案，管理員真的進後台時才下載。一般客人不會下載到後台的程式，首頁也載入得比較快。
-->

---

# 登入後回到原本的頁面

```ts {all|2|7-11}
export class LoginComponent {
  returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

  submit(): void {
    const { email, password } = this.form.getRawValue();
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl(this.returnUrl),
      error: (e) => this.error.set(errorMessage(e)),
    });
  }
}
```

<!--
最後是登入頁。

（下一步）從網址的查詢參數讀出 returnUrl，沒有的話就是首頁。

（下一步）登入成功，用 navigateByUrl 回到原本要去的頁面。客人在購物車按結帳、被要求登入、登入完直接回到結帳頁，流程很順。
-->

---

# 守衛只是體驗，安全在後端

<v-clicks>

- 守衛和攔截器都在**瀏覽器**裡執行，懂技術的人可以繞過
- 繞過守衛進了後台頁面 → 呼叫 `/api/admin/**` → 後端回 **403**，什麼資料都拿不到
- 前端：**讓畫面合理**；後端：**真正把關**

</v-clicks>

<!--
最後提醒一個觀念。

（下一步）守衛和攔截器都在瀏覽器裡執行，懂技術的人可以改 localStorage，假裝自己是管理員。

（下一步）但就算繞過守衛進了後台頁面，呼叫後台 API 的時候，後端會檢查 JWT 裡真正的角色，回 403，什麼資料都拿不到。

（下一步）所以前端的守衛是讓畫面合理，不讓一般客人看到用不到的頁面；真正把關的永遠是後端。
-->

---

# 重點回顧

<Pairs left="公司" right="Angular" rows="staff,收發室自動蓋章=code,HttpInterceptorFn + req.clone + setHeaders|no,退件統一處理=code,catchError：401 → logout(returnUrl)|guard,驗票員=code,CanActivateFn 回傳 true 或 UrlTree|card,回原本的會議室=code,returnUrl + navigateByUrl|cabinet,用到才搬進來=code,loadChildren（lazy loading）" />

<!--
回顧。

（下一步）收發室自動蓋章，是攔截器加上 clone 和 setHeaders。

（下一步）退件統一處理，是 catchError 處理 401。

（下一步）驗票員，是 CanActivateFn，回傳 true 放行，或回傳 UrlTree 改去別的頁面。

（下一步）回原本的會議室，是 returnUrl。

（下一步）後台用 loadChildren，用到才下載。
-->

---

# 小結

<v-clicks>

- 攔截器：在 `provideHttpClient(withInterceptors([...]))` 註冊，所有請求都會經過
- 守衛：在路由的 `canActivate` 掛上，回傳 `true` 或 `UrlTree`
- 前端的保護是體驗，**後端才是真正的安全**
- **練習**：寫一個 `loadingInterceptor`，有請求進行中時，畫面上方顯示進度條

</v-clicks>

<!--
小結。

（下一步）攔截器在 app.config 註冊，所有請求都會經過。

（下一步）守衛掛在路由上，回傳 true 或 UrlTree。

（下一步）前端的保護是體驗，後端才是真正的安全。

（下一步）練習：寫一個 loading 攔截器，用一個 signal 記錄進行中的請求數，大於 0 的時候在畫面上方顯示 Material 的進度條。下一章，我們用這些工具做電商的前台。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
