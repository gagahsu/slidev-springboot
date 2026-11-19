---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 前後端串接
routeAlias: ch49
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
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    前後端串接
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓 Angular 的畫面，真的拿到 Spring Boot 的資料」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第四十九章。

到目前為止，後端我們用 Postman 測試，前端我們呼叫的是別人準備好的 API。兩邊各自都會了，但是還沒有真的接在一起。

這一章就是要把兩邊接起來：讓我們自己寫的 Angular 畫面，去呼叫我們自己寫的 Spring Boot API。接起來的那一刻，通常會先遇到一個錯誤，叫做 CORS。今天就從這個錯誤開始講。
-->

---

# 今天要完成的三件事

<v-clicks>

- **同時啟動兩邊**：後端在 8080，前端在 4200
- **看懂 CORS**：為什麼 Postman 可以，瀏覽器卻不行
- **學會查錯**：用瀏覽器的開發者工具，看懂每一個請求

</v-clicks>

<!--
今天要完成三件事。

（下一步）第一，同時啟動兩邊。後端跑在 8080 埠，前端跑在 4200 埠，兩個程式要一起開著。

（下一步）第二，看懂 CORS。同一個 API，Postman 呼叫得到，瀏覽器卻被擋下來，原因是什麼。

（下一步）第三，學會查錯。前後端接起來之後，出問題時不知道是哪一邊的錯，最常見。我們要學會用瀏覽器的開發者工具，看懂每一個請求。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 兩棟大樓

<!--
先講一個生活中的故事。
-->

---

# 故事：到隔壁大樓拿東西

你住在 **4200 號大樓**，常去 **8080 號大樓**拿東西。

<v-clicks>

- 你走到 8080 號大樓，跟櫃台說要拿菜單 → 櫃台把菜單給你
- 走出大門時，**大樓管理員**攔住你：「你不是這棟的住戶」
- 管理員翻開公告欄：8080 號大樓**有沒有寫「4200 號的住戶可以來拿」**？
- 有寫 → 放行；沒寫 → 東西沒收，你什麼都拿不到

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 注意：櫃台<b>其實有把東西給你</b>，是管理員在門口擋下來的。
</div>

</v-click>

<!--
想像你住在 4200 號大樓，常常要去隔壁的 8080 號大樓拿東西。

（下一步）你走到 8080 號大樓，跟櫃台說要拿一份菜單，櫃台很爽快地把菜單給你。

（下一步）但是走出大門的時候，大樓管理員攔住你：你不是這棟的住戶，東西要帶出去，我得先確認一下。

（下一步）管理員去翻 8080 號大樓的公告欄，看上面有沒有寫：4200 號大樓的住戶，可以來拿東西。

（下一步）有寫，就放行。沒寫，東西沒收，你兩手空空回家。

（下一步）注意這個細節：櫃台其實有把東西給你，是管理員在門口擋下來的。等一下看程式的時候，這一點很重要。
-->

---

# 對應到程式

<Pairs left="兩棟大樓" right="前後端" rows="you,4200 號大樓的住戶=browser,Angular 網頁（http://localhost:4200）|shop,8080 號大樓的櫃台=server,Spring Boot API（http://localhost:8080）|guard,門口的管理員=browser,瀏覽器|doc,公告欄上的「誰可以來拿」=code,CORS 設定（Access-Control-Allow-Origin）" />

<!--
把故事對應到程式。

（下一步）4200 號大樓的住戶，就是我們的 Angular 網頁，網址是 localhost 冒號 4200。

（下一步）8080 號大樓的櫃台，就是 Spring Boot 的 API，網址是 localhost 冒號 8080。

（下一步）門口的管理員，是瀏覽器。這個角色很多人想不到：擋人的不是後端，是瀏覽器。

（下一步）公告欄上寫的「誰可以來拿」，就是後端的 CORS 設定。後端在回應裡加上一行 Access-Control-Allow-Origin，告訴瀏覽器哪些網站可以拿這份資料。
-->

---

# 想一想

<Poll question="Postman 呼叫 http://localhost:8080/api/products 一切正常，但是 Angular 網頁呼叫同一個網址卻被擋。是誰擋的？" options="Spring Boot 後端|MySQL 資料庫|瀏覽器|Angular 程式碼" answer="3" />

<!--
來想一想。Postman 呼叫同一個網址一切正常，Angular 網頁卻被擋下來，是誰擋的？

答案是瀏覽器。Postman 不是瀏覽器，它沒有門口的管理員，所以拿得到。後端其實兩次都有回應，是瀏覽器在最後一刻把資料沒收了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 什麼是 CORS

<!--
接下來正式介紹 CORS。
-->

---

# 一句話說 CORS

<div class="text-2xl text-center my-8 font-bold" style="color:#1a5c5c">
CORS：後端用回應標頭告訴瀏覽器，<br>「哪些網站的網頁可以讀我的資料」
</div>

<v-clicks>

- 全名 Cross-Origin Resource Sharing，**跨來源資源共用**
- **來源（origin）** = 通訊協定 + 主機 + 埠號，例如 `http://localhost:4200`
- 三個裡面**只要一個不同**，就算「跨來源」

</v-clicks>

<!--
一句話說 CORS：後端用回應標頭告訴瀏覽器，哪些網站的網頁可以讀我的資料。

（下一步）全名是 Cross-Origin Resource Sharing，中文叫跨來源資源共用。

（下一步）什麼叫來源？就是網址最前面的三個部分：通訊協定、主機、埠號。例如 http、localhost、4200。

（下一步）這三個裡面，只要有一個不一樣，就算跨來源。
-->

---

# 哪些算跨來源？

網頁在 `http://localhost:4200`，呼叫下面這些網址：

| 呼叫的網址 | 跨來源嗎？ | 原因 |
| --- | --- | --- |
| `http://localhost:4200/menu` | 不算 | 三個都一樣 |
| `http://localhost:8080/api/products` | **算** | 埠號不同 |
| `https://localhost:4200/` | **算** | 通訊協定不同 |
| `http://127.0.0.1:4200/` | **算** | 主機名稱不同 |

<!--
看幾個例子。網頁在 localhost 冒號 4200。

呼叫同一個 4200 底下的路徑，三個部分都一樣，不算跨來源。

呼叫 8080，埠號不同，算跨來源。這就是我們今天的情況。

http 換成 https，通訊協定不同，也算。

localhost 換成 127.0.0.1，雖然指的是同一台電腦，但寫法不同，瀏覽器一樣當作不同的主機。
-->

---

# 為什麼瀏覽器要擋？

<v-clicks>

- 你登入了網路銀行，瀏覽器記得你的登入狀態
- 你又打開了一個**壞人的網站**，它偷偷呼叫網路銀行的 API
- 如果瀏覽器不擋，壞人的網頁就能**讀到你的帳戶資料**
- 所以瀏覽器預設：**跨來源的回應，不讓網頁讀**，除非後端明確同意

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 CORS 是在保護<b>使用瀏覽器的人</b>。Postman、手機 App、另一台後端呼叫 API，都不會檢查 CORS。
</div>

</v-click>

<!--
瀏覽器為什麼要多管閒事？

（下一步）想像你登入了網路銀行，瀏覽器記得你的登入狀態。

（下一步）接著你又打開了一個壞人的網站，它的網頁偷偷呼叫網路銀行的 API。

（下一步）如果瀏覽器不擋，壞人的網頁就能讀到你的帳戶資料。

（下一步）所以瀏覽器預設的規則是：跨來源的回應，不讓網頁讀，除非後端明確說可以。

（下一步）所以 CORS 保護的是使用瀏覽器的人。Postman、手機 App、或另一台後端去呼叫 API，都不會檢查 CORS。這也是為什麼 Postman 一直都好好的。
-->

---

# 錯誤長什麼樣子

前後端都開著，但後端還沒設定 CORS，打開瀏覽器的 Console 會看到：

```text
Access to XMLHttpRequest at 'http://localhost:8080/api/products'
from origin 'http://localhost:4200' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

<v-clicks>

- `from origin 'http://localhost:4200'`：發出請求的網頁是誰
- `blocked by CORS policy`：被瀏覽器的 CORS 規則擋下
- `No 'Access-Control-Allow-Origin' header`：**後端的回應裡，沒有公告欄**

</v-clicks>

<!--
這是大家一定會看到的錯誤訊息，我們拆開來讀。

（下一步）from origin localhost 4200，告訴你發出請求的網頁是誰。

（下一步）blocked by CORS policy，被瀏覽器的 CORS 規則擋下來了。

（下一步）最後一句最重要：回應裡面沒有 Access-Control-Allow-Origin 這個標頭。用故事的話說，8080 號大樓的公告欄上，什麼都沒寫。所以要改的地方在後端。
-->

---

# 修正：在後端加上 CORS 設定

在 `config` 資料夾新增 `CorsConfig.java`：

```java {all|1-2|5-6|7|8|all}
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

<!--
修正的方法，是在後端加一個設定類別。新增 config 資料夾，裡面放 CorsConfig。

（下一步）@Configuration 讓 Spring 啟動時讀取這個類別；實作 WebMvcConfigurer，就可以調整 Spring MVC 的設定。

（下一步）addMapping，指定哪些路徑要開放。這裡寫 /api/**，所有 /api 開頭的路徑都適用。

（下一步）allowedOrigins，就是公告欄上寫的「誰可以來拿」。只寫我們的 Angular，localhost 4200。

（下一步）allowedMethods，允許哪些 HTTP 方法。

（下一步）重新啟動後端，再整理一次網頁，資料就出來了。
-->

---

# 設定好之後，回應多了什麼

```text {all|3}
HTTP/1.1 200
Vary: Origin
Access-Control-Allow-Origin: http://localhost:4200
Content-Type: application/json
```

<v-clicks>

- 瀏覽器看到這一行，而且跟網頁的來源**一模一樣** → 放行
- 換成 `http://localhost:5173` 的網頁來呼叫 → 後端直接回 **403**，一樣拿不到

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 網路上常看到 <code>allowedOrigins("*")</code>（誰都可以），練習時很方便，正式上線請寫清楚自己的網址。
</div>

</v-click>

<!--
設定好之後，回應的標頭多了什麼？

（下一步）多了 Access-Control-Allow-Origin，值是 localhost 4200。這就是公告欄。

（下一步）瀏覽器看到這一行，而且跟網頁的來源一模一樣，就放行。

（下一步）如果是別的網址，例如 5173 埠的網頁來呼叫，Spring 發現它不在名單上，會直接回 403，一樣拿不到資料。

（下一步）網路上很多範例寫星號，代表誰都可以。練習的時候很方便，但正式上線，請把自己前端的網址寫清楚。
-->

---

# 想一想

<Poll question="後端已經設定 allowedOrigins(&quot;http://localhost:4200&quot;)，但同學用 http://127.0.0.1:4200 打開網頁，結果會怎樣？" options="正常，因為是同一台電腦|被 CORS 擋下，因為主機名稱不同|後端回 404|Angular 編譯失敗" answer="2" />

<!--
再想一想。後端寫的是 localhost 4200，同學卻用 127.0.0.1 冒號 4200 打開網頁，會怎樣？

會被擋。瀏覽器只比對文字，localhost 和 127.0.0.1 寫法不同，就是不同的來源。遇到這種情況，請用 localhost 打開網頁就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 兩邊同時啟動

<!--
接下來實際把兩邊一起跑起來。
-->

---

# 啟動的順序

<v-clicks>

1. **MySQL**：資料庫要先開著（Docker 或安裝版都可以）
2. **後端**：Eclipse 對專案按右鍵 → Run As → Spring Boot App，看到 `Tomcat started on port 8080`
3. **先用瀏覽器直接開 API**：`http://localhost:8080/api/products`，看得到 JSON 才往下
4. **前端**：VS Code 開終端機，執行 `ng serve`，打開 `http://localhost:4200`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 第 3 步很重要：直接開 API 網址<b>不算跨來源</b>，看得到 JSON，就代表後端沒問題。
</div>

</v-click>

<!--
啟動有順序，從最底層開始。

（下一步）第一，資料庫要先開著。

（下一步）第二，在 Eclipse 啟動後端，Console 出現 Tomcat started on port 8080，才算啟動成功。

（下一步）第三步很多人會跳過，但它最能幫你省時間：先用瀏覽器直接打開 API 的網址，看得到 JSON，才往下一步。

（下一步）第四，在 VS Code 的終端機執行 ng serve，再打開 4200。

（下一步）為什麼第三步這麼重要？直接在網址列打開 API，不是網頁去呼叫，所以不算跨來源。看得到 JSON，就代表後端和資料庫都沒問題，之後出錯只要查前端和 CORS。
-->

---

# 前端怎麼呼叫自己的 API

和第 28 章一樣，把呼叫寫在 Service 裡，只是網址換成自己的後端：

```ts {all|3|5-7|9-11}
@Injectable({ providedIn: 'root' })
export class CafeApiService {
  private baseUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`);
  }

  createReservation(req: ReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.baseUrl}/reservations`, req);
  }
}
```

<!--
前端的寫法跟 Angular 第二十八章串接 API 一樣，把呼叫寫在一個 Service 裡。

（下一步）唯一的差別是網址：baseUrl 換成我們自己的後端，localhost 8080 斜線 api。

（下一步）查菜單用 get，傳回的資料型別是 Product 陣列。

（下一步）送出訂位用 post，第二個參數就是表單的資料，HttpClient 會自動轉成 JSON，後端用 @RequestBody 接收。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 用開發者工具查錯

<!--
接起來之後，最重要的技能是查錯。
-->

---

# 打開開發者工具

按 **F12**（Mac：⌥ + ⌘ + I），常用的兩個分頁：

<v-clicks>

- **Console**：紅色的錯誤訊息，CORS 錯誤會出現在這裡
- **Network**：每一個送出去的請求，都會列一行
  - 點 **Fetch/XHR** 篩選，只看呼叫 API 的請求
  - 點一行 → **Headers**：網址、方法、狀態碼、回應標頭
  - **Payload**：送出去的資料；**Response**：後端回來的內容

</v-clicks>

<!--
在 Chrome 按 F12 打開開發者工具，Mac 是 Option、Command、I。

（下一步）Console 分頁，會顯示紅色的錯誤訊息，CORS 錯誤就在這裡。

（下一步）Network 分頁更重要，網頁送出的每一個請求，都會列成一行。

（下一步）點上方的 Fetch/XHR，只看呼叫 API 的請求，圖片和 CSS 就不會混在裡面。

（下一步）點其中一行，Headers 看得到網址、方法、狀態碼，還有回應的標頭，例如剛剛的 Access-Control-Allow-Origin。

（下一步）Payload 是我們送出去的資料，Response 是後端回來的內容。前後端吵架的時候，看這兩個就知道是誰的錯。
-->

---

# 從狀態碼判斷是哪一邊的問題

| Network 看到的 | 意思 | 先查哪裡 |
| --- | --- | --- |
| `(failed)` 或狀態碼 **0** | 連不到，或被 CORS 擋 | 後端有開嗎？Console 有 CORS 錯誤嗎？ |
| **403** | 後端拒絕 | CORS 名單裡有沒有這個網址 |
| **404** | 網址找不到 | 前端的網址、後端的 `@GetMapping` 路徑 |
| **400** | 資料不合格 | Payload 送了什麼、Response 說哪個欄位錯 |
| **415** | 格式不對 | 前端沒送 JSON（`HttpClient` 會自動送） |
| **500** | 後端程式出錯 | Eclipse 的 Console，找紅字的 Exception |

<!--
狀態碼是查錯最快的線索。

狀態碼 0 或 failed，代表根本沒拿到回應：可能後端沒開，也可能被 CORS 擋了。去 Console 看有沒有 CORS 的字樣就知道。

403 是後端拒絕。這一章最常見的原因是網頁的網址不在 CORS 名單上。

404 是網址找不到，比對前端寫的網址和後端的 Mapping 路徑，常常是少了 /api，或拼錯字。

400 是資料不合格，看 Payload 送了什麼，再看 Response 是哪一個欄位被退件。

415 是格式不對，後端只收 JSON。用 HttpClient 會自動送 JSON，通常是手動組資料時才會遇到。

500 是後端程式自己出錯，這時候前端看不出原因，要去 Eclipse 的 Console 找紅字的 Exception。
-->

---

# 範例：一筆被退件的訂位

送出訂位後，Network 出現一行紅色的 `reservations`，狀態碼 **400**：

<div class="grid grid-cols-2 gap-4">
<div>

**Payload（我們送的）**

```json
{
  "name": "王小明",
  "phone": "0912",
  "reserveDate": "2026-11-20",
  "reserveTime": "15:30",
  "people": 9
}
```

</div>
<div>

**Response（後端回的）**

```json
{
  "message": "資料格式不正確",
  "fields": {
    "phone": "手機格式不正確",
    "people": "一次最多預約 8 位"
  }
}
```

</div>
</div>

<!--
看一個實際的例子。送出訂位之後，Network 出現一行紅色的 reservations，狀態碼 400。

左邊是 Payload，我們送出去的資料：手機只有四碼，人數填了九位。

右邊是 Response，後端回來的內容：fields 裡面清楚寫著，手機格式不正確、一次最多預約八位。

這就是第四十一章的欄位檢查。後端的錯誤訊息寫得清楚，前端只要把 fields 裡的訊息顯示在對應的欄位下面就好。
-->

---

# 前端怎麼接到錯誤

```ts {all|5|6-8|9-11}
this.api.createReservation(this.form).subscribe({
  next: () => {
    this.message = '已收到您的訂位';
  },
  error: (err: HttpErrorResponse) => {
    if (err.status === 400) {
      this.errors = err.error.fields;      // 顯示在各欄位下面
    } else {
      this.message = '目前無法連線，請稍後再試';
    }
  },
});
```

<!--
前端怎麼接到這些錯誤？

（下一步）subscribe 除了 next，還可以寫 error。狀態碼不是 2 開頭的時候，就會進到 error。

（下一步）如果是 400，err.error 就是後端回來的 JSON，把裡面的 fields 存起來，畫面上就能顯示在各欄位下面。

（下一步）其他情況，包括狀態碼 0 的連不到，就顯示一句「目前無法連線，請稍後再試」。千萬不要什麼都不做，使用者看到一片空白，會以為網站壞了。
-->

---

# 想一想

<Poll question="按下送出後，Network 裡的請求顯示 404。最可能的原因是？" options="手機號碼格式錯誤|前端呼叫的網址和後端的路徑對不上|MySQL 沒有開|沒有設定 CORS" answer="2" />

<!--
最後一題。送出之後，Network 顯示 404，最可能的原因是什麼？

是網址對不上。手機格式錯會是 400，MySQL 沒開通常是 500，CORS 沒設定會是狀態碼 0 加上 Console 的 CORS 錯誤。404 就是找不到這個路徑，去比對前端的網址和後端的 Mapping。
-->

---

# 重點回顧

<Pairs left="兩棟大樓" right="前後端" rows="you,4200 號大樓的住戶=browser,Angular 網頁|shop,8080 號大樓的櫃台=server,Spring Boot API|guard,門口的管理員=browser,瀏覽器檢查 CORS|doc,公告欄=code,CorsConfig 的 allowedOrigins|what,監視器畫面=browser,開發者工具的 Network 分頁" />

<!--
最後回顧一下。

（下一步）Angular 網頁，就是 4200 號大樓的住戶。

（下一步）Spring Boot API，是 8080 號大樓的櫃台。

（下一步）瀏覽器是門口的管理員，負責檢查 CORS。

（下一步）CorsConfig 的 allowedOrigins，是公告欄上寫的「誰可以來拿」。

（下一步）開發者工具的 Network 分頁，就像大樓的監視器畫面，誰送了什麼、拿到什麼，一清二楚。
-->

---

# 小結

<v-clicks>

- 前端和後端埠號不同，就是**跨來源**；CORS 由**瀏覽器**檢查
- 後端用 `CorsConfig` 的 `allowedOrigins` 寫清楚允許的網址
- 啟動順序：**MySQL → 後端 → 先直接開 API → 前端**
- 查錯看 **Network**：狀態碼、Payload、Response，再看 Console

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 下一章：把整門課學到的東西組起來，做出<b>轉角咖啡</b>的後端。
</div>

</v-click>

<!--
最後做個小結。

（下一步）前端和後端的埠號不同，就是跨來源；CORS 是瀏覽器在檢查，不是後端擋人。

（下一步）後端用 CorsConfig，把允許的前端網址寫清楚。

（下一步）啟動順序是 MySQL、後端、先直接打開 API 確認、最後才是前端。

（下一步）出問題的時候，先看 Network 的狀態碼、Payload 和 Response，再看 Console。

（下一步）下一章，我們要把整門課學到的東西組起來，做出轉角咖啡一頁式網站的後端。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
