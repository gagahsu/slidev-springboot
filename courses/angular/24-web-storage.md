---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 網頁儲存
routeAlias: ch24
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
    網頁儲存
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「掌握 Cookie、localStorage 與 sessionStorage 的使用時機」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們用 Service 在頁面之間傳遞資料，但也提到一個限制：只要使用者按 F5 重新整理，Service 裡的資料就會歸零。

想像玩一款網頁遊戲，好不容易把角色練到 99 級，重新整理之後卻回到 1 級，這一定很令人沮喪。

這一章，我們要學習網頁儲存，把資料存在瀏覽器裡，重新整理之後資料依然存在。
-->

---
layout: default
---

# Outline

- **網頁儲存的三種方法** — Cookie、localStorage、sessionStorage 介紹
- **Cookie 使用** — 安裝 ngx-cookie-service，set 與 get 操作
- **localStorage 與 sessionStorage 差異** — 資料持久性與作用範圍
- **儲存跟讀取** — setItem 與 getItem 用法

<!--
這一章會先介紹網頁儲存的三種方法：Cookie、localStorage 和 sessionStorage。接著看 Cookie 怎麼在 Angular 裡使用，包括安裝套件、存入和讀取。然後比較 localStorage 和 sessionStorage 的差別，最後學習它們的存取方法 `setItem` 和 `getItem`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 網頁儲存的三種方法
# Web Storage Overview

<!--
我們先來認識三種網頁儲存的方式。
-->

---

# 網頁儲存的三種方法

除了 service 負責元件間資料傳遞外，有時也需要將資料持久化至瀏覽器本地端。網頁的資料儲存方式分為三種：**Cookie**、**localStorage**、**sessionStorage**。

Cookie 主要用於 API 身分驗證，使用頻率較低。localStorage 與 sessionStorage 則儲存在對應網域的瀏覽器空間中。

| 方式 | 容量 | 主要用途 |
| --- | --- | --- |
| Cookie | 約 4KB | 登入、跨域 Tracking、Session ID |
| localStorage | 約 5–10MB | 自訂資料，手動清除才消失 |
| sessionStorage | 約 5–10MB | 自訂資料，分頁關閉即消失 |

<!--
除了用 Service 在元件之間傳遞資料，有時候我們需要把資料保存在瀏覽器本地。網頁的儲存方式有三種：Cookie、localStorage 和 sessionStorage。

Cookie 的容量很小，大約 4KB，主要用在登入和身分驗證。我們可以把它想成通行證，伺服器用它來確認使用者是誰。

localStorage 的容量大約 5 到 10MB，像是一個保險箱。只要不主動清除，關掉瀏覽器再打開，資料都還在。

sessionStorage 的容量一樣，但它像是一個臨時保管箱，分頁關閉之後，資料就會消失。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Cookie 使用
# Cookie Usage

<!--
我們先來看 Cookie 怎麼在 Angular 裡使用。
-->

---

# Cookie 使用 — 安裝套件

Angular 未內建 CookieService（舊版 `cookieStore` 已淘汰），目前主流使用 **ngx-cookie-service**。

指定 19.0.0 版本安裝（最新版與 Angular 19 有衝突）：

```bash
npm install ngx-cookie-service@19.0.0
```

<!--
Angular 本身沒有內建方便操作 Cookie 的工具，目前主流的做法是安裝第三方套件 `ngx-cookie-service`。

安裝時請指定 19.0.0 版本。因為最新版跟我們使用的 Angular 19 有相容性的問題，指定版本可以避免安裝時出現錯誤。

這也呼應了我們之前學的版本觀念：套件版本要和 Angular 版本對得上。
-->

---

# Cookie 使用 — 注入 CookieService

使用 `inject()` 將 `CookieService` 注入為類別屬性，後續即可透過該屬性操作 cookie。

```typescript
// app.component.ts
import { Component, inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // 使用 inject 相依注入 CookieService 套件
  cookieService = inject(CookieService);
}
```

<!--
安裝完成之後，在元件裡注入 `CookieService`。

這裡用的是上一章學過的 `inject()` 寫法，從套件引入 `CookieService`，再宣告 `cookieService` 等於 `inject(CookieService)`。

注入之後，就可以透過 `this.cookieService` 來存取 Cookie 了。
-->

---

# Cookie 使用 — 儲存資料 (set)

使用 `cookieService.set()` 儲存資料，前三個參數最為關鍵：key 名稱、儲存值、過期天數。Cookie 到期後瀏覽器將自動刪除。

```typescript
// app.component.ts
export class AppComponent {
  cookieService = inject(CookieService);

  constructor() {
    this.cookieService.set(
      'user_display_name', // 1. Name（名稱）
      'Allen',             // 2. Value（值）
      7,                   // 3. Expires（過期天數）
      '/',                 // 4. Path（路徑）
      '',                  // 5. Domain（網域）
      true,                // 6. Secure（加密傳輸）
      'Strict'             // 7. SameSite（跨站限制）
    );
  }
}
```

<!--
儲存 Cookie 用的是 `cookieService.set()`。

它最多可以傳入七個參數，其中前三個最重要。第一個是名稱，這裡是 `user_display_name`；第二個是值，這裡是 Allen；第三個是過期天數，這裡寫 7，代表 7 天後這個 Cookie 會被瀏覽器自動刪除。

後面四個參數，分別是路徑、網域、是否只用加密連線傳送，以及跨站的限制，主要跟安全性有關，一般情況維持預設就可以了。
-->

---

# Cookie 使用 — 瀏覽器確認

開啟開發者工具 → **Application** → **Storage** → **Cookies** → 選擇對應網址，即可看到剛才設定的 cookie 紀錄。

<div class="mt-6 flex justify-center">
  <img src="/images/23-web-storage/cookie-devtools.png" class="rounded shadow-md max-h-64" />
</div>

<!--
存進去之後，可以在瀏覽器裡確認。

按 F12 打開開發者工具，切換到 Application 頁籤，在左側找到 Storage 底下的 Cookies，點開正在測試的網址。就會看到剛才設定的名稱、值和到期時間。
-->

---

# Cookie 使用 — 讀取資料 (get)

使用 `cookieService.get(key)` 讀取對應 key 的 cookie值，不存在或已過期則回傳空字串。

```typescript
// app.component.ts
export class AppComponent {
  cookieService = inject(CookieService);

  showName() {
    console.log(this.cookieService.get('user_display_name'));
  }
}
```

<!--
讀取 Cookie 用的是 `cookieService.get()`，傳入名稱就好。

這裡傳入 `user_display_name`，就會取得 Allen。如果這個名稱不存在，或是已經過期被刪除了，會回傳空字串。
-->

---
layout: default
---

# Cookie — 小節練習

請實作以下需求：

1. 在 `LoginComponent`（`login.component.ts`）注入 `CookieService`
2. 新增 `onLoginSuccess()` method，登入成功時將 `theme` 設為 `'dark'`，有效期 **30 天**
3. 在 `DashboardComponent`（`dashboard.component.ts`）注入 `CookieService`
4. 進入 dashboard 時（`constructor`），讀取 `theme` 的值並用 `console.log` 印出

<!--
我們用一個小練習熟悉 Cookie。

請在登入元件注入 `CookieService`，新增 `onLoginSuccess` 方法，登入成功時把 `theme` 設成 dark，有效期限 30 天。接著在後台元件也注入 `CookieService`，在 `constructor` 裡讀取 `theme` 的值並印出來。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# Cookie — 小節練習解答

```typescript
// login.component.ts
export class LoginComponent {
  cookieService = inject(CookieService);

  onLoginSuccess() {
    this.cookieService.set('theme', 'dark', 30);
  }
}
```

```typescript
// dashboard.component.ts
export class DashboardComponent {
  cookieService = inject(CookieService);

  constructor() {
    console.log(this.cookieService.get('theme'));  // dark
  }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>set</code> 第三個參數為天數，到期後瀏覽器自動刪除；Cookie 綁定網域而非單一元件，故不同頁面（login → dashboard）都能讀到同一份資料
</div>

<!--
我們來看答案。

登入元件在 `onLoginSuccess` 裡呼叫 `set`，傳入 theme、dark 和 30。後台元件在 `constructor` 裡呼叫 `get('theme')`，印出 dark。

Cookie 是綁定在網域上的，不是綁定在某個元件，所以不同頁面只要在同一個網域，都能讀到同一份資料。

另外，如果沒有設定過期天數，Cookie 通常會在關閉瀏覽器時就消失。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# localStorage 與 sessionStorage
# Differences & Usage

<!--
接下來，我們看更常用、而且不需要安裝任何套件的 localStorage 和 sessionStorage。
-->

---

# localStorage 跟 sessionStorage 差異

兩者的 API 寫法與儲存空間相同，唯一差異在於資料的生命週期：

| 比較項目 | localStorage | sessionStorage |
| --- | --- | --- |
| 資料消失時機 | 手動刪除或清除瀏覽器才消失 | 開啟新分頁就會消失 |
| 作用範圍 | 綁定網域（如 localhost:4200） | 綁定當前分頁 |
| 跨埠口 | 不同埠口（4200 vs 4201）無法共用 | 分頁關閉或開新分頁即消失 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> localStorage 綁定網域，<code>localhost:4200</code> 與 <code>localhost:4201</code> 為不同來源，無法共用資料。sessionStorage 綁定當前分頁，分頁關閉或開新分頁即消失。
</div>

<!--
localStorage 和 sessionStorage 的寫法和容量都一樣，最大的差別在於資料保存的時間。

localStorage 的資料會一直保存，除非我們用程式刪除，或使用者清除瀏覽器資料。sessionStorage 的資料則只存在目前這個分頁，分頁關閉，或開新分頁，就讀不到了。

另外，兩者都有網域的限制。例如在 localhost 冒號 4200 存的資料，換到 localhost 冒號 4201 就讀不到，因為埠號不同，瀏覽器會把它們視為不同的來源。這是瀏覽器的安全保護機制。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 儲存跟讀取
# setItem & getItem

<!--
那要怎麼對這兩個儲存空間存取資料呢？
-->

---

# 儲存跟讀取

localStorage 與 sessionStorage 皆以 key-value 方式儲存資料，提供兩種操作函式：

| 操作 | 函式 | 說明 |
| --- | --- | --- |
| 儲存 | `setItem("key", "value")` | 以 key 為名稱儲存 value |
| 讀取 | `getItem("key")` | 以 key 取得對應的值 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 同一個 key 再次 setItem 會覆蓋原有資料，請確保 key 值唯一。
</div>

<!--
localStorage 和 sessionStorage 都用「鍵值對」的方式儲存資料，有兩個操作方法。

儲存用 `setItem`，傳入名稱和值；讀取用 `getItem`，傳入名稱，就會取得對應的值。

要注意，如果用同一個名稱再呼叫一次 `setItem`，原本的資料會被覆蓋。所以取名稱時要確保不重複。
-->

---

# 儲存跟讀取 — 程式碼範例

兩者 API 語法相同，只需替換前綴。屬於原生 Web API，不需 import、不需 inject，元件內直接呼叫即可。

```typescript
// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  saveName() {
    localStorage.setItem('name', 'Allen');
    sessionStorage.setItem('name', 'Allen');
  }

  showName() {
    console.log(localStorage.getItem('name'));
    console.log(sessionStorage.getItem('name'));
  }
}
```

<!--
我們看程式碼範例。

localStorage 和 sessionStorage 是瀏覽器內建的功能，不需要 import，也不需要注入，在元件裡直接呼叫就可以了。兩者的寫法一樣，只要換掉前面的名稱。

`saveName` 用 `setItem` 把 Allen 存進兩個儲存空間，`showName` 用 `getItem` 把它讀出來印出。

這裡有一個要注意的地方：它們只能存字串。如果直接把物件存進去，會變成一段沒有意義的文字。所以要存物件時，要先用 `JSON.stringify` 轉成字串；讀出來之後，再用 `JSON.parse` 轉回物件。
-->

---
layout: default
---

# localStorage — 小節練習

請實作以下需求：

1. 定義使用者物件 `const user = { name: 'Allen', level: 5 }`
2. 將 `user` 物件儲存到 localStorage（`key: 'user'`）— 注意 localStorage 只能存字串
3. 讀取 localStorage 中的 `user`，還原成物件
4. 用 `console.log` 印出還原後物件的 `name` 與 `level`

<!--
我們用一個小練習熟悉 localStorage。

請定義一個使用者物件，包含名字 Allen 和等級 5。把這個物件存進 localStorage，名稱是 user。接著把它讀出來，還原成物件，並印出名字和等級。

想一想，存入之前和讀出之後，分別要做什麼處理？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# localStorage — 小節練習解答

```typescript
const user = { name: 'Allen', level: 5 };

localStorage.setItem('user', JSON.stringify(user));

const raw = localStorage.getItem('user');
const parsed = JSON.parse(raw!);
console.log(parsed.name, parsed.level);  // Allen 5
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>JSON.stringify()</code> 把物件序列化成字串才能存入；<code>JSON.parse()</code> 把讀出的字串還原成物件——這個組合技是前端儲存物件的標準做法
</div>

<!--
我們來看答案。

存入之前，用 `JSON.stringify` 把物件轉成字串，再用 `setItem` 存進去。讀取時用 `getItem` 取出字串，再用 `JSON.parse` 還原成物件，就能讀到 name 和 level，印出 Allen 和 5。

這裡的 `raw` 後面加了驚嘆號，因為 `getItem` 可能回傳 null，加上驚嘆號是告訴 TypeScript「這裡一定有值」。

`JSON.stringify` 搭配 `JSON.parse`，是在網頁儲存裡存放物件的標準做法。
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

# 補充練習 1：記住使用者名稱

1. 在 HTML 建立輸入框 `[(ngModel)]="userName"` 與「儲存」按鈕
2. 點選按鈕時執行：`localStorage.setItem('cached_user', this.userName);`
3. 在 `ngOnInit()` 中讀取：`this.displayTitle = localStorage.getItem('cached_user') || '訪客';`
4. 畫面顯示「歡迎，`{{ displayTitle }}`」
5. 輸入名字儲存後重新整理網頁，確認歡迎詞是否記住你的名字

<!--
第一題補充練習，用 localStorage 記住使用者的名字。

輸入名字、按下儲存，就存進 localStorage。網頁一載入，也就是 `ngOnInit` 的時候，再把它讀出來顯示。如果還沒存過，就顯示訪客。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：記住使用者名稱 — 參考答案

```typescript
userName: string = '';
displayTitle: string = '';

ngOnInit(): void {
  this.displayTitle = localStorage.getItem('cached_user') || '訪客';
}

save() {
  localStorage.setItem('cached_user', this.userName);
  this.displayTitle = this.userName;
}
```

```html
<h2>歡迎，{{ displayTitle }}</h2>
<input [(ngModel)]="userName">
<button (click)="save()">儲存</button>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>getItem</code> 找不到資料時回傳 <code>null</code>，用 <code>|| '訪客'</code> 提供預設值；使用 <code>ngModel</code> 記得匯入 <code>FormsModule</code>
</div>

<!--
我們來看答案。

`save` 方法把輸入的名字存進 localStorage，同時更新畫面上的歡迎詞。`ngOnInit` 在網頁一打開時讀取，如果還沒存過，`getItem` 會回傳 null，這時 `||` 後面的訪客就會成為預設值。

重新整理網頁，歡迎詞仍然是你的名字，因為 localStorage 的資料會一直保存在瀏覽器裡。
-->

---
layout: default
---

# 補充練習 2：localStorage vs sessionStorage

親手體會兩種 Storage 的差異：

1. 在同一個點擊事件中同時執行以下兩行：

```typescript
localStorage.setItem('local_key', '我還在');
sessionStorage.setItem('session_key', '要消失了');
```

2. 打開 F12 → Application，確認兩筆資料都已存入
3. **直接關閉這個分頁**，再開一個新分頁貼上網址
4. 回到 Application 檢查：哪一筆還在？哪一筆消失了？

<!--
第二題補充練習，親手比較 localStorage 和 sessionStorage。

按一個按鈕，同時存入兩筆資料，先到開發者工具的 Application 確認都存進去了。接著把分頁整個關掉，再開一個新分頁回來，看看哪一筆還在。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：localStorage vs sessionStorage — 參考答案

```typescript
saveBoth() {
  localStorage.setItem('local_key', '我還在');
  sessionStorage.setItem('session_key', '要消失了');
}
```

| 儲存方式 | 關閉分頁後重新開啟 |
| --- | --- |
| `localStorage` | ✅ `local_key` 仍然存在 |
| `sessionStorage` | ❌ `session_key` 已被清除 |

<!--
我們來看答案。

重新開啟分頁後，只剩下 `local_key`。localStorage 的資料會一直存在，除非手動清除；sessionStorage 的資料只活在這個分頁裡，分頁一關就清掉。

所以「記住我」這類要長期保存的資料，用 localStorage；只在這次瀏覽暫時需要的資料，例如填到一半的表單，用 sessionStorage。
-->

---
layout: end
---

# 課程結束
### Cookie、localStorage、sessionStorage — 依需求選擇合適的儲存方式

<!--
這一章我們學了三種網頁儲存方式。Cookie 容量小，主要用在身分驗證，在 Angular 裡透過 `ngx-cookie-service` 的 `set` 和 `get` 操作。localStorage 會一直保存資料，sessionStorage 則在分頁關閉時消失，兩者都用 `setItem` 和 `getItem` 存取，而且只能存字串，存物件時要搭配 `JSON.stringify` 和 `JSON.parse`。

下一章，我們會學習怎麼把陣列資料顯示在畫面上。我們下一章見。
-->
