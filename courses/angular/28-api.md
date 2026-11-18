---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 串接 API
routeAlias: ch28
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
    串接 API
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用 HttpClient 讓 Angular 與後端服務溝通」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們學了 `@switch`。到目前為止，我們的資料不是寫死在變數裡，就是存在瀏覽器裡。

但真實的網頁，需要顯示最新的天氣預報、即時的交通資訊，或是跟遠端的伺服器交換資料。這一章，我們要學習串接 API，用 Angular 的 `HttpClient` 和後端伺服器溝通，把真實的資料拿到網頁上。

這是前端開發非常關鍵的一步。
-->

---
layout: default
---

# Outline

- **什麼是 API** — Application Programming Interface 的定義與概念
- **如何使用 API** — 在 Angular 中呼叫 API 的三個步驟
- **將 HttpClient 透過依賴注入** — 在 app.config.ts 加入 provideHttpClient()
- **撰寫 HttpClient 文件** — 建立 http.service.ts 封裝四種 HTTP 方法
- **呼叫方法** — 注入 Service 並以 subscribe 接收回傳值
- **呼叫方法 (post/put)** — 打包 JSON 資料後呼叫 postApi / putApi
- **免費 API 網址** — 練習用的免費公開 API 資源
- **練習** — 串接氣象開放資料 API 並呈現在畫面上

<!--
這一章會先說明什麼是 API，接著介紹在 Angular 裡呼叫 API 的三個步驟：在 `app.config.ts` 註冊 `HttpClient`，建立一個 Service 封裝四種 HTTP 方法，最後在元件裡呼叫方法並用 `subscribe` 接收資料。我們也會看 post 和 put 怎麼帶資料，介紹幾個免費的練習用 API，最後串接中央氣象署的天氣資料。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 什麼是 API？
# What is an API?

<!--
我們先來了解，API 到底是什麼。
-->

---

# 什麼是 API？

API（Application Programming Interface），中文叫**應用程式介面**，是一種提供不同軟體系統間互動的工具，定義了不同軟體間的互動規範，API 允許不同的應用程式、服務或系統之間能夠共享資訊與功能，以約定好的 API 接口實現互聯互通。

簡單來說，API 提供了一組定義好的規則與協定，透過資訊的傳遞，讓開發者可以輕鬆整合與使用不同的服務，從而提高應用程式的功能與效能。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> API 就是不同系統之間溝通的「規範與橋樑」，前端透過 API 向後端取得或傳送資料。
</div>

<!--
API 的全名是 Application Programming Interface，中文是「應用程式介面」。簡單來說，它是「不同軟體系統之間約定好的溝通規則」。

就像家裡的插座。我們想用吹風機，不需要自己接電線、蓋發電廠，只要按照插座的規格把插頭插進去，電就會送過來。插座就是電力系統提供給我們的介面。

在前端開發裡，API 就像後端提供給我們的資料插座。我們照著約定好的規則發出請求，就能取得或傳送資料。
-->

---

# 什麼是 API？

### API 案例說明

<div class="grid grid-cols-2 gap-6 my-2">
<div>

- **我（使用者）** 發出請求
- **服務員（API）** 接收請求，傳給廚師
- **廚師（後台）** 處理並回傳結果

</div>
<div>

- **我（使用者）** 操作提款機
- **提款機（API）** 接收指令，連線銀行
- **銀行（後台）** 處理帳戶資料並回傳

</div>
</div>

<div class="flex justify-center mt-2">
  <img src="/images/27-api/api-concept-diagram.png" class="rounded shadow-md max-h-72" />
</div>

<!--
我們再用兩個生活例子來看 API 的運作。

第一個是餐廳。我們想點餐，但不能直接走進廚房拿菜。我們把需求告訴服務生，服務生把點單交給廚師，廚師做好之後，再由服務生端回來。這裡的服務生，就是 API。

第二個是提款機。我們操作提款機，提款機連線到銀行，銀行處理帳戶資料後，再把結果傳回提款機。提款機就是我們和銀行系統之間的 API。

前端和後端也是一樣，前端透過 API 發出請求，後端處理完再把資料回傳。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 如何使用 API？
# How to Use an API?

<!--
了解 API 的概念之後，我們來看在 Angular 專案裡怎麼呼叫 API。
-->

---

# 如何使用 API？

在 Angular 中呼叫 API 需完成以下三個步驟：

- 將 HttpClient 透過依賴注入
- 撰寫 HttpClient 文件
- 呼叫方法

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>流程：</b> 先在全域注入 HttpClient → 建立封裝 Service → 在元件中注入 Service 並訂閱結果。
</div>

<!--
在 Angular 裡呼叫 API，需要完成三個步驟。

第一步，在全域註冊 `HttpClient`，讓它可以被注入。第二步，建立一個 Service，把呼叫 API 的方法集中寫在裡面。第三步，在元件裡注入這個 Service，呼叫方法，並用 `subscribe` 接收回傳的資料。

接下來我們一步一步看。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 將 HttpClient 透過依賴注入
# Register HttpClient via DI

<!--
第一步，我們先把 Angular 內建的 `HttpClient` 啟用。
-->

---

# 將 HttpClient 透過依賴注入

開啟 `app.config.ts`，在 `providers` 陣列中加入 `provideHttpClient()`，讓 Angular DI 系統得知 HttpClient 可被注入。

```typescript
import { provideHttpClient } from '@angular/common/http';
```

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>provideHttpClient()</code> 必須加入 <code>providers</code> 陣列，否則注入 HttpClient 時會報錯。
</div>

<!--
打開 `app.config.ts`，先從 `@angular/common/http` 引入 `provideHttpClient`，再把它加進 `providers` 陣列。

這樣做是告訴 Angular 的相依注入系統：「`HttpClient` 可以被注入使用」。就像在總電源箱打開網路的開關。

如果忘了這一步，之後在任何地方注入 `HttpClient`，都會出現找不到提供者的錯誤。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 撰寫 HttpClient 文件
# Write HttpClient Service

<!--
`HttpClient` 啟用之後，第二步是建立一個專門處理 API 的 Service。
-->

---

# 撰寫 HttpClient 文件（一）

建立 `http-service/http-client.service.ts`，將所有 API 呼叫方法集中管理，避免重複程式碼分散各元件。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>資料夾結構：</b>
</div>

```
app/
└── @http-services/
    └── http.service.ts
```

<!--
我們建立一個 Service 檔案，把所有呼叫 API 的方法集中在這裡管理。

為什麼不直接在每個元件裡使用 `HttpClient`？因為如果 API 的網址或驗證方式改了，寫在幾十個元件裡就得改幾十次。集中在一個 Service，只要改一個地方。

畫面上是建議的資料夾結構，在 `app` 底下建立一個資料夾，專門放這類 Service。
-->

---

# 撰寫 HttpClient 文件（二）

在 `http-client.service.ts` 中加入以下程式。`@Injectable({ providedIn: 'root' })` 讓 Angular 在應用啟動時自動建立此 Service 的單例，無需手動 `new`。

```typescript
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class HttpClientService {
}
```

<!--
在 Service 檔案裡，先寫上基本的結構。

上方的 `@Injectable`，加上 `providedIn: 'root'`，跟上一章一樣，代表這個 Service 在整個應用程式裡只有一個實例，Angular 會自動建立，不需要我們手動 `new`。

也可以用 `ng g s` 指令產生這個檔案。
-->

---

# 撰寫 HttpClient 文件（三）

透過 `inject()` 將 `HttpClient` 注入，後續即可使用 `this.http` 呼叫各 HTTP 方法。

```typescript
import { inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export class HttpClientService {
  private http = inject(HttpClient);
}
```

<!--
接著用 `inject` 注入 `HttpClient`。

引入 `inject` 和 `HttpClient` 之後，在類別屬性寫 `private http` 等於 `inject(HttpClient)`。這樣在 Service 裡，就可以透過 `this.http` 呼叫各種 HTTP 方法了。
-->

---

# 撰寫 HttpClient 文件（四）— 四種 HTTP 方法

將四種基礎 HTTP 方法封裝至 Service，每個方法將 `this.http` 的回傳值直接 `return` 給呼叫者。`url: string` 為必填參數，`postData` / `putData` 為 body 內容。

```typescript
// 讀取
getApi(url: string) {
  return this.http.get(url);
}

// 新增
postApi(url: string, postData: any) {
  return this.http.post(url, postData);
}

// 更新
putApi(url: string, putData: any) {
  return this.http.put(url, putData);
}

// 刪除
delApi(url: string) {
  return this.http.delete(url);
}
```

<!--
接下來，我們在 Service 裡封裝四種最常用的 HTTP 方法。

`getApi` 用來取得資料，對應 GET；`postApi` 用來新增資料，對應 POST；`putApi` 用來更新資料，對應 PUT；`delApi` 用來刪除資料，對應 DELETE。

每個方法的第一個參數都是 API 的網址。post 和 put 因為要把資料送給後端，所以多了第二個參數，也就是要送出的內容。

注意每個方法都直接 `return` `this.http` 的結果，讓呼叫的人自己決定怎麼處理回傳的資料。
-->

---
layout: default
---

# HttpClient Service — 小節練習

請根據前面投影片的內容，建立 `HttpClientService`：

1. 建立 `http-service/http-client.service.ts`，加上 `@Injectable({ providedIn: 'root' })`
2. 透過 `inject()` 注入 `HttpClient`
3. 撰寫 `getApi(url: string)`，回傳 GET 請求
4. 撰寫 `postApi(url: string, postData: any)`，回傳 POST 請求
5. 撰寫 `putApi(url: string, putData: any)`，回傳 PUT 請求
6. 撰寫 `delApi(url: string)`，回傳 DELETE 請求

<!--
我們用一個小練習，自己把這個 Service 建立起來。

請建立 `HttpClientService`，加上 `@Injectable` 和 `providedIn: 'root'`，用 `inject` 注入 `HttpClient`，再寫出 `getApi`、`postApi`、`putApi` 和 `delApi` 四個方法。

想一想，哪兩個方法需要第二個參數？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# HttpClient Service — 小節練習解答

```typescript
getApi(url: string) {
  return this.http.get(url);
}

postApi(url: string, postData: any) {
  return this.http.post(url, postData);
}

putApi(url: string, putData: any) {
  return this.http.put(url, putData);
}

delApi(url: string) {
  return this.http.delete(url);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>getApi</code>、<code>delApi</code> 只需 <code>url</code> 一個參數；<code>postApi</code>、<code>putApi</code> 必須帶第二個參數作為 HTTP body——即使沒有資料也要傳入空物件 <code>&#123;&#125;</code>
</div>

<!--
我們來看答案。

四個方法都直接 `return` `this.http` 對應的方法。`getApi` 和 `delApi` 只需要網址一個參數；`postApi` 和 `putApi` 則要帶第二個參數，作為送給後端的資料。即使沒有資料要送，也要傳入一個空物件。

把結果 `return` 出去，讓呼叫的地方再決定怎麼處理，是實務上封裝 Service 的標準做法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 呼叫方法
# Calling the Methods

<!--
最後一步，我們在元件裡呼叫 Service，把資料拿回來。
-->

---

# 呼叫方法（一）— 注入 Service

完成前兩步後，在目標元件的 TS 中注入 `HttpClientService`，並透過 `inject()` 取得實例。

```typescript
import { inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientService } from '../http-service/http-client.service';
```

```typescript
private http = inject(HttpClientService);
```

<!--
在要使用 API 的元件裡，先引入 `inject` 和 `HttpClientService`，然後用 `inject` 注入它，寫成 `private http` 等於 `inject(HttpClientService)`。

注入之後，就可以在元件裡透過 `this.http` 呼叫剛才寫好的四個方法了。
-->

---

# 呼叫方法（二）— subscribe 訂閱

呼叫 `getApi(url)` 後，連結 `.subscribe()` 接收回傳資料。`res` 為回傳內容，可自行命名。HttpClient 回傳 Observable，必須 subscribe 才會發送請求。

```typescript
ngOnInit(): void {
  this.http.getApi('https://api.freeapi.app/api/v1/public/randomusers')
    .subscribe((res) => console.log(res));
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> <code>subscribe()</code> 是 RxJS Observable 的訂閱方式，Angular 的 HttpClient 回傳的都是 Observable，必須透過 subscribe 才會實際發送請求。
</div>

<!--
我們在 `ngOnInit` 裡呼叫 `getApi`，傳入一個免費的 API 網址，後面接上 `.subscribe()`。

這個 `.subscribe()` 非常重要。`HttpClient` 回傳的是一個 Observable，可以把它想成一張「預約單」。只呼叫 `getApi` 而不 `subscribe`，就像在外送平台把餐點加進購物車，卻沒有按下送出，請求根本不會發出去。

只有呼叫了 `subscribe`，請求才會真的送出。資料回來之後，會放進 `res` 這個參數，我們就可以印出來，或存進變數裡。忘記寫 `subscribe` 是初學者最常犯的錯誤。

`subscribe` 是 RxJS 的觀念，之後的章節會再深入介紹。
-->

---
layout: default
---

# 呼叫方法 — 小節練習

在 `ngOnInit` 中透過注入的 `HttpClientService`，呼叫以下 GET API 並用 `console.log` 印出回傳結果：

```
https://api.freeapi.app/api/v1/public/randomusers
```

```typescript
private http = inject(HttpClientService);

ngOnInit(): void {
  // 補完呼叫與訂閱
  this.___.___('https://api.freeapi.app/api/v1/public/randomusers')
    .___((___)  => console.log(___));
}
```

<!--
我們用一個小練習熟悉呼叫 API 的流程。

請在 `ngOnInit` 裡，透過注入的 `HttpClientService`，呼叫畫面上這個 GET API，並用 `console.log` 印出回傳的結果。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 呼叫方法 — 小節練習解答

```typescript
private http = inject(HttpClientService);

ngOnInit(): void {
  this.http.getApi('https://api.freeapi.app/api/v1/public/randomusers')
    .subscribe((res) => console.log(res));
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 HttpClient 回傳 Observable，必須 <code>.subscribe()</code> 才會實際發送請求——不加 subscribe 就像點餐沒按送出，瀏覽器不會對伺服器發出任何請求
</div>

<!--
我們來看答案。

`this.http.getApi` 傳入網址，後面接 `.subscribe`，在裡面把 `res` 印出來。打開 Console，就能看到 API 回傳的使用者資料。

`res` 這個名稱可以自己取，習慣上用 `res`，也就是 response 的縮寫，代表伺服器回傳的內容。
-->

---

# 呼叫方法（post/put）（一）

`post` 與 `put` 需傳送資料給後端，呼叫前先將資料打包為 JSON 物件作為第二個參數傳入。

```typescript
ngOnInit(): void {
  // 在呼叫 post api 之前先把要傳遞的資料打包
  let postData = {
    userName: 'Allen',
    userAge: 18
  }

  // 呼叫 post 的方法 第一個值帶 api Url 第二個帶要傳遞的值
  // (post 一定要帶值 如果真的沒有內容也可以給他一個空 {})
  this.httpClientService
    .postApi('https://api.freeapi.app/api/v1/kitchen-sink/http-methods/post', postData)
    .subscribe((res: any) => {
      console.log(res);
    })
}
```

<!--
如果要用 post 或 put 把資料送給後端，呼叫之前要先把資料打包成物件。

這裡先宣告 `postData`，裡面有使用者名稱和年齡。接著呼叫 `postApi`，第一個參數是 API 網址，第二個參數就是 `postData`。這份資料會放在請求的內容裡送給後端。

最後一樣要接上 `.subscribe()`，請求才會真的送出。
-->

---

# 呼叫方法（post/put）（二）

以下呼叫免費 post API，收到 `res` 即代表請求成功：

```typescript
ngOnInit(): void {
  // 在呼叫 post api 之前先把要傳遞的資料打包
  let postData = {
    userName: 'Allen',
    userAge: 18
  }

  // 呼叫 post 的方法 第一個值帶 api Url 第二個帶要傳遞的值
  // (post 一定要帶值 如果真的沒有內容也可以給他一個空 {})
  this.httpClientService
    .postApi('https://api.freeapi.app/api/v1/kitchen-sink/http-methods/post', postData)
    .subscribe((res: any) => {
      console.log(res);
    })
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> post 一定要帶第二個參數（body），如果真的沒有內容也要傳入一個空物件 <code>{}</code>。
</div>

<!--
這是 post 請求的完整範例，使用的是一個免費的測試 API。

後端收到之後，通常會回傳一個結果，例如新增成功的訊息，或是新資料的編號。只要在 Console 看到 `res`，就代表請求成功了。

要注意，post 一定要帶第二個參數。就算真的沒有資料要送，也要傳入一個空物件，因為我們的 `postApi` 定義了兩個必填的參數，少了會報錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 免費 API 網址
# Free API Resources

<!--
如果後端還沒做好，或是我們只是想練習，要去哪裡找 API 呢？這裡整理了幾個免費的資源。
-->

---
layout: two-cols
---

# 免費 API 網址

以下提供免費可呼叫的 API，可搭配畫面顯示練習串接：

**Freeapi 文件：**

`https://freeapi.hashnode.space/api-guide/apireference/getUsers`

可用的 API 類型包含：
- GET 類：取得使用者、隨機資料、圖片等
- POST 類：送出資料
- DEL 類：刪除資料

::right::

<div class="flex items-center justify-center h-full ml-10">
  <img src="/images/27-api/freeapi-reference.png" class="rounded shadow-md max-h-80" />
</div>

<!--
畫面上是 freeapi 的文件網址，它提供很多免費的 API，包括取得隨機使用者、隨機資料、圖片等 GET 類型，以及 POST 和 DELETE 類型。

不用註冊，也不用付費，把文件裡的網址複製到程式裡，就能拿到 JSON 資料，很適合用來練習串接。
-->

---

# 練習

使用以下中央氣象署開放資料 API，將資料呈現在畫面上，並且做出畫面（非單純顯示資料）與樣式設計。

```
https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-065?Authorization=CWA-69B5A9F7-1D8D-495E-A1F2-C160E39B4D44&limit=10&format=JSON
```

**任務要求：**

1. 使用 `HttpClientService` 的 `getApi` 方法呼叫上方 API
2. 在 `ngOnInit` 中發送請求並 `subscribe` 取得資料
3. 將回傳的氣象資料呈現在畫面上
4. 設計適合的 UI 版面與 CSS 樣式（非單純文字列表）

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> 可以用 card 卡片、表格或其他有設計感的排版方式呈現氣象資料，避免單純顯示 JSON。
</div>

<!--
接下來是這一章的練習：串接中央氣象署的開放資料 API。

這是真實的政府公開資料，內容會隨著天氣即時變動。請用 `HttpClientService` 的 `getApi` 呼叫畫面上的網址，在 `ngOnInit` 裡發送請求並 `subscribe` 取得資料，再把氣象資料呈現在畫面上。

這題的重點是畫面設計，不要只用 `console.log` 印出來，也不要在 HTML 裡直接顯示一整串 JSON。可以用卡片、表格這類有設計感的版面，把溫度、降雨機率這些資訊呈現出來。

我們先暫停一下，自己動手試試看。

【講師】給大家 20 分鐘左右。回傳的 JSON 層級較深，可先引導學生在 Console 觀察資料結構。
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

# 補充練習 1：API 錯誤攔截

網路可能隨時斷線，API 網址也可能打錯。如果沒有錯誤處理，使用者完全不知道發生了什麼事：

1. 故意呼叫一個無效網址：`https://api.freeapi.app/api/error-url`
2. 把 `subscribe` 改寫成物件形式，同時宣告 `next` 與 `error` 兩個通道
3. `next`：成功時 `console.log(res)`
4. `error`：失敗時 `alert('伺服器故障，請稍後再試！')`
5. 執行程式，確認網頁是否彈出警告

<!--
第一題補充練習，學習處理 API 失敗的情況。

故意打一個錯誤的網址，把 `subscribe` 改成物件的寫法，裡面分成 `next` 和 `error` 兩條路：成功走 `next`，失敗走 `error`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：API 錯誤攔截 — 參考答案

```typescript
private http = inject(HttpClientService);

ngOnInit(): void {
  this.http.getApi('https://api.freeapi.app/api/error-url').subscribe({
    next: (res) => {
      console.log(res);                     // 成功時走這裡
    },
    error: (err) => {
      console.log(err);
      alert('伺服器故障，請稍後再試！');    // 失敗時走這裡
    }
  });
}
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>subscribe(res => ...)</code> 只處理成功；改成 <code>subscribe(&#123; next, error &#125;)</code> 才能同時處理成功與失敗
</div>

<!--
我們來看答案。

`subscribe` 小括號裡改放一個物件，`next` 是成功時要做的事，`error` 是失敗時要做的事。

網址錯誤時，伺服器會回傳 404，程式就會走 `error`，跳出提示，讓使用者知道發生了什麼事。打開 Console，還可以看到 `err` 裡的狀態碼和錯誤訊息，方便除錯。
-->

---
layout: default
---

# 補充練習 2：政府天氣 API 網頁

把 API 取得的資料，用學過的控制流呈現在畫面上：

1. 到「中央氣象署 開放資料平臺」註冊會員
2. 取得天氣 API 的授權碼（金鑰）
3. 呼叫天氣 API（地區自選，例如今明 36 小時天氣預報）
4. 在 HTML 用 `@for` 把該地區的氣象內容呈現出來

```text
https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=你的金鑰&locationName=高雄市
```

<!--
第二題補充練習，串接真正的政府開放資料。

先到中央氣象署開放資料平臺註冊，取得授權碼。接著呼叫今明 36 小時天氣預報的 API，網址後面帶上你的授權碼和想查詢的縣市名稱，再把資料用 `@for` 顯示在畫面上。

建議先用 `console.log` 把回傳資料印出來，看清楚結構再開始寫畫面。我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：政府天氣 API — 參考答案

```typescript
weatherList: any[] = [];

ngOnInit(): void {
  const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001'
    + '?Authorization=你的金鑰&locationName=高雄市';
  this.http.getApi(url).subscribe((res: any) => {
    console.log(res);
    // 天氣現象（Wx）的三個時段
    this.weatherList = res.records.location[0].weatherElement[0].time;
  });
}
```

```html
@for (item of weatherList; track item.startTime) {
  <p>{{ item.startTime }} ～ {{ item.endTime }}：{{ item.parameter.parameterName }}</p>
}
```

<!--
我們來看答案。

回傳資料的結構比較深：`records` 底下的 `location` 是地區陣列，第一筆就是高雄市；`weatherElement` 是各種天氣要素，第一個是天氣現象 Wx；`time` 是三個時段的預報。

把 `time` 陣列存進 `weatherList`，HTML 再用 `@for` 依序顯示每個時段的開始、結束時間和天氣描述。實際的資料結構，以你 Console 印出來的為準。
-->

---
layout: end
---

# 課程結束
### 學會串接 API，讓 Angular 應用與後端真正連線！

<!--
這一章我們學會了串接 API。API 是系統之間溝通的規則。在 Angular 裡呼叫 API 有三個步驟：在 `app.config.ts` 加入 `provideHttpClient`；建立 Service 封裝 get、post、put、delete 四個方法；在元件注入 Service，呼叫方法並用 `subscribe` 接收資料。post 和 put 要帶第二個參數，沒有資料時也要傳空物件。

從現在開始，我們的網頁已經可以和真實的伺服器溝通了。

下一章，我們會學習用 interface 定義 API 回傳資料的型別。我們下一章見。
-->
