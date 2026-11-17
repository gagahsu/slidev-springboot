---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: HttpSession 管理
routeAlias: ch40
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
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    HttpSession 管理
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓 HTTP 記住你是誰」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第四十章，也是新單元「進階功能」的第一章。

到目前為止，我們的 API 有一個特性：每一次請求都是獨立的。伺服器處理完就忘了，不記得剛才是誰來過。

今天要學的 Session，就是讓伺服器「記得這個人」的方法。今天繼續使用 school 專案。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **伺服器為什麼不認得人？** HTTP 的「無狀態」
- **Session 是什麼？** 一張號碼牌，加上一格置物櫃
- **程式怎麼寫？** `HttpSession` 的存、取、清除，以及過期的設定

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，伺服器為什麼不認得人。這個特性有一個名字，叫做無狀態。

（下一步）第二，Session 是什麼。先劇透：它是一張號碼牌，加上一格置物櫃。

（下一步）第三，程式怎麼寫。我們會用 HttpSession 這個物件來存資料、取資料、清除資料，最後看過期的設定。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 櫃台不認得人

<!--
先看教務處。
-->

---

# 每一次來，都像第一次來

教務處的櫃台，一天要接待幾百位同學：

<v-clicks>

- Tom 來了，說「我是 Tom，我要查成績」。櫃台幫他查了
- 五分鐘後 Tom 又來：「再幫我查一下操行」
- 櫃台：「請問你是哪一位？」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 櫃台不是故意的。他辦完一件事就接下一位，<b>不會記得剛才辦過什麼</b>。所以 Tom 每一次來，都得重新說一次自己是誰。
</div>

</v-click>

<!--
教務處的櫃台，一天要接待幾百位同學。

（下一步）Tom 來了，說：我是 Tom，我要查成績。櫃台幫他查了。

（下一步）五分鐘後 Tom 又來：再幫我查一下操行。

（下一步）櫃台卻問他：請問你是哪一位？

（下一步）櫃台不是故意的。他辦完一件事就接下一位，不會記得剛才辦過什麼。所以 Tom 每一次來，都得重新說一次自己是誰。
-->

---

# HTTP 就是這樣的櫃台

<v-clicks>

- 每一個請求都是**獨立**的。伺服器回應完，就不記得這件事了
- 這個特性叫做**無狀態**（Stateless）
- 好處：伺服器很單純，不用替每個人記東西
- 壞處：「登入之後」的功能做不出來

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 登入、購物車、分好幾步填的表單，都需要伺服器記得「這幾個請求是<b>同一個人</b>發的」。
</div>

</v-click>

<!--
我們用的 HTTP，就是這樣的櫃台。

（下一步）每一個請求都是獨立的。伺服器回應完，就不記得這件事了。下一個請求進來，它不知道和上一個有沒有關係。

（下一步）這個特性叫做無狀態，英文是 Stateless。

（下一步）它有好處。伺服器很單純，不用替每個人記東西，可以服務很多人。

（下一步）但是也有壞處。「登入之後」才能用的功能做不出來。因為登入是一個請求，查成績是另一個請求，伺服器不知道它們是同一個人。

（下一步）登入、購物車、分好幾步填的表單，都需要伺服器記得：這幾個請求是同一個人發的。
-->

---

# 教務處的做法：號碼牌和置物櫃

<SessionTag />

<!--
教務處想了一個辦法。

Tom 第一次來，告訴櫃台：我是 Tom。

（下一步）櫃台在後面開一格置物櫃，編號 A7，把一張紙條放進去，上面寫「這位是 Tom」。

（下一步）然後櫃台發一張號碼牌給 Tom。號碼牌上只有置物櫃的號碼 A7，沒有別的內容。

（下一步）之後 Tom 每次來，都出示號碼牌。櫃台看到 A7，打開那一格置物櫃，看到紙條，就知道他是 Tom。Tom 不用再自我介紹了。

請注意兩件事。第一，資料是放在櫃台這一邊的置物櫃裡，不是在 Tom 身上。第二，Tom 手上只有一個號碼。
-->

---

# 對照到程式

<SessionTag terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>Cookie</b>：伺服器請瀏覽器幫忙保管的一小段資料。之後瀏覽器每次發請求給同一個網站，都會自動把它放在 Header 裡帶回來。
</div>

</v-click>

<!--
同一張圖，換成程式的名字。Tom 是瀏覽器，櫃台是伺服器。

（下一步）置物櫃，叫做 Session。它是伺服器替每一位使用者準備的一塊暫存空間。

（下一步）號碼牌是一個 Cookie，名字叫做 JSESSIONID。它的內容就是 Session 的編號。

（下一步）之後每一次請求，瀏覽器都會自動帶上這個 Cookie。

（下一步）這裡出現一個新名詞：Cookie。它是伺服器請瀏覽器幫忙保管的一小段資料。之後瀏覽器每次發請求給同一個網站，都會自動把它放在 Header 裡帶回來。Header 我們在第十三章學過，是請求裡放備註的地方。

所以號碼牌不用我們自己出示，瀏覽器會自動幫忙。Postman 也會。
-->

---

# 整理：Session 的三個重點

<Pairs left="教務處" right="程式" rows="what,櫃台辦完就忘=code,HTTP 無狀態|cabinet,櫃台後面的置物櫃=code,Session：存在伺服器的暫存空間|card,號碼牌，只寫置物櫃的號碼=code,Cookie：JSESSIONID|you,每次來都出示號碼牌=browser,瀏覽器每次請求自動帶上 Cookie" />

<!--
我們把對應整理一次。

（下一步）櫃台辦完就忘，是 HTTP 無狀態。

（下一步）櫃台後面的置物櫃，是 Session，存在伺服器的暫存空間。

（下一步）號碼牌只寫置物櫃的號碼，是名字叫 JSESSIONID 的 Cookie。

（下一步）每次來都出示號碼牌，是瀏覽器每次請求自動帶上 Cookie。
-->

---

# 想一想

<Poll question="「這位是 Tom」這項資料，實際上存放在哪裡？" options="Tom 的瀏覽器裡|伺服器的 Session 裡|網址裡|資料庫的 student 資料表" answer="2" />

<!--
來想一題。

「這位是 Tom」這項資料，實際上存放在哪裡？

（等大家作答）

（下一步）答案是：伺服器的 Session 裡。

瀏覽器手上只有號碼牌，也就是 Session 的編號。真正的資料在伺服器這一邊。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# HttpSession：存、取、清除

<!--
來看程式怎麼寫。
-->

---

# 存進去：setAttribute

在 `controller` 資料夾新增 `SessionController`：

```java {all|4-5|6|7}
@RestController
public class SessionController {

    @PostMapping("/session/login")
    public String login(@RequestParam("username") String username, HttpSession session) {
        session.setAttribute("username", username);
        return "登入成功，號碼牌：" + session.getId();
    }
}
```

- 參數多寫一個 `HttpSession session`，Spring 就會把這位使用者的置物櫃交給我們
- `setAttribute("名字", 值)`：放一樣東西進置物櫃，並且幫它取名字
- `getId()`：置物櫃的號碼，也就是 JSESSIONID 的內容

<!--
在 controller 資料夾新增一個 SessionController。

（下一步）先寫一個登入的 API。POST /session/login，用 @RequestParam 接收 username。重點是後面多了一個參數：HttpSession session。只要在參數這樣寫，Spring 就會把這位使用者的置物櫃交給我們。如果他還沒有置物櫃，Spring 會自動開一格，並且發號碼牌。這些我們都不用自己做。import 請選 jakarta.servlet.http 開頭的。

（下一步）setAttribute，放一樣東西進置物櫃。兩個參數：前面是名字，後面是值。這裡把使用者的名字放進去，取名叫 username。

（下一步）getId，拿到置物櫃的號碼。我們把它回傳，方便等一下觀察。

要說明一下：這個登入沒有檢查密碼，任何人說自己是誰都會被相信。真正的登入要驗證身分，那是第四十四章的主題。今天先專心看 Session 怎麼運作。
-->

---

# 拿出來：getAttribute

```java {3|4-6|7}
@GetMapping("/session/info")
public String info(HttpSession session) {
    String username = (String) session.getAttribute("username");
    if (username == null) {
        return "尚未登入";
    }
    return "目前登入的是：" + username;
}
```

- `getAttribute("名字")`：用名字把東西拿出來
- 置物櫃什麼都能放，所以拿出來的型別是 `Object`。前面的 `(String)` 是告訴 Java「這其實是文字」
- 沒有這樣東西的時候，拿到的是 `null`。**一定要檢查**

<!--
在同一個類別裡，加第二個方法。GET /session/info，看看目前登入的是誰。一樣在參數寫 HttpSession。

（下一步）getAttribute，用名字把東西拿出來。這裡有一個新的寫法：前面多了一個括號 String。因為置物櫃什麼都能放，所以 getAttribute 拿出來的型別是 Object，也就是「某個東西」。括號 String 是告訴 Java：這其實是文字，請當成 String 用。這個動作叫做轉型。

（下一步）如果置物櫃裡沒有 username 這樣東西，拿到的會是 null。代表這個人還沒登入。所以一定要檢查。

（下一步）有的話，回傳他的名字。
-->

---

# 用 Postman 試試看

<v-clicks>

1. `GET /session/info` → 「尚未登入」
2. `POST /session/login?username=Tom` → 「登入成功，號碼牌：5A3F…」
3. `GET /session/info` → 「目前登入的是：Tom」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
🔍 在 Postman 送出按鈕下方點 <b>Cookies</b>，可以看到 <code>localhost</code> 底下有一個 <code>JSESSIONID</code>，內容和第 2 步回傳的號碼一樣。第 3 步沒有帶任何參數，伺服器是靠它認出 Tom 的。
</div>

</v-click>

<!--
重新啟動，用 Postman 照順序試三個請求。

（下一步）第一個，直接 GET /session/info。回傳「尚未登入」。

（下一步）第二個，POST /session/login，網址後面接問號 username 等於 Tom。回傳登入成功，後面是一長串號碼。

（下一步）第三個，再 GET /session/info 一次。這次回傳「目前登入的是：Tom」。

（下一步）第三個請求沒有帶任何參數，伺服器怎麼知道是 Tom？請在 Postman 的送出按鈕下方，點 Cookies。可以看到 localhost 底下有一個 JSESSIONID，內容和第二步回傳的號碼一樣。Postman 在第二步收到號碼牌，第三步自動帶上了。伺服器就是靠它認出 Tom 的。

可以再做一個實驗：在 Cookies 視窗把 JSESSIONID 刪掉，再查一次，就會變回「尚未登入」。號碼牌不見了，櫃台就不認得你了。
-->

---

# 清除：登出

```java {3}
@PostMapping("/session/logout")
public String logout(HttpSession session) {
    session.invalidate();
    return "已登出";
}
```

<v-clicks>

- `invalidate()`：把整格置物櫃清空，號碼牌也作廢
- 另一個方法 `removeAttribute("名字")`：只拿走一樣東西，置物櫃還在
- 登出請用 `invalidate()`，比較乾淨

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 呼叫 <code>invalidate()</code> 之後，同一個方法裡不要再用這個 <code>session</code>，會丟出例外。
</div>

</v-click>

<!--
第三個方法，登出。POST /session/logout。

（下一步）invalidate，把整格置物櫃清空，號碼牌也作廢。

（下一步）還有另一個方法 removeAttribute，只拿走指定的那一樣東西，置物櫃還在。

（下一步）登出的時候請用 invalidate，比較乾淨。裡面不管放了多少東西，一次清掉。

（下一步）提醒一點。呼叫 invalidate 之後，同一個方法裡不要再用這個 session 物件去存或取東西，會丟出例外。因為置物櫃已經不存在了。

測試一下：登入、查詢、登出、再查詢。最後一次應該回傳「尚未登入」。
-->

---

# 常用的方法，一次整理

<Pairs left="置物櫃" right="HttpSession" rows="form,放一樣東西進去=code,setAttribute(名字, 值)|doc,拿一樣東西出來=code,getAttribute(名字)，沒有就是 null|no,拿走一樣東西=code,removeAttribute(名字)|card,看置物櫃的號碼=code,getId()|lock,整格清空，號碼牌作廢=code,invalidate()" />

<!--
HttpSession 常用的方法，一次整理。

（下一步）放一樣東西進去，是 setAttribute。

（下一步）拿一樣東西出來，是 getAttribute。沒有的話是 null。

（下一步）拿走一樣東西，是 removeAttribute。

（下一步）看置物櫃的號碼，是 getId。

（下一步）整格清空、號碼牌作廢，是 invalidate。
-->

---

# 想一想

<Poll question="session.getAttribute(&quot;username&quot;) 回傳 null，代表什麼？" options="伺服器壞了|置物櫃裡沒有叫 username 的東西，通常是還沒登入|使用者的名字剛好叫 null|資料庫連線失敗" answer="2" />

<!--
確認一下。

session.getAttribute("username") 回傳 null，代表什麼？

（等大家作答）

（下一步）答案是：置物櫃裡沒有叫 username 的東西，通常是還沒登入，或是已經登出、過期了。

所以拿出來之後，一定要先檢查是不是 null。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 置物櫃不能永遠佔著

<!--
最後談過期和設定。
-->

---

# 太久沒來，置物櫃會被清掉

<v-clicks>

- 很多人用完不會登出，直接關掉瀏覽器。置物櫃如果永遠留著，遲早會不夠用
- 所以伺服器會計時：**一段時間沒有任何請求**，就自動清掉那一格
- 預設是 30 分鐘。每來一次，重新計時

</v-clicks>

<v-click>

```properties
server.servlet.session.timeout=30m
```

- 寫在 `application.properties`。`30m` 是 30 分鐘，`600s` 是 600 秒

</v-click>

<!--
置物櫃不能永遠佔著。

（下一步）很多人用完不會登出，直接關掉瀏覽器。置物櫃如果永遠留著，遲早會不夠用。

（下一步）所以伺服器會計時。一段時間沒有任何請求，就自動清掉那一格。

（下一步）預設是 30 分鐘。而且每來一次，就重新計時。所以它算的是「閒置」的時間，不是從登入開始算。

（下一步）這個時間可以改。在 application.properties 寫這一行。30m 是 30 分鐘，也可以寫 600s，600 秒。

你一定遇過：網站放著一陣子沒動，回來按一下，就要重新登入。那就是 Session 過期了。
-->

---

# 一格置物櫃的一生

<v-clicks>

- **建立**：第一次用到 `HttpSession` 的時候，自動開一格、發號碼牌
- **使用中**：每次帶著號碼牌來，就重新計時
- **過期**：閒置超過設定的時間，伺服器自動清掉（被動）
- **失效**：程式呼叫 `invalidate()`，立刻清掉（主動）

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 過期或失效之後，舊的號碼牌就沒用了。下次再來，會拿到一格<b>全新的、空的</b>置物櫃。
</div>

</v-click>

<!--
把一格置物櫃的一生整理一下。

（下一步）建立。第一次用到 HttpSession 的時候，自動開一格、發號碼牌。

（下一步）使用中。每次帶著號碼牌來，就重新計時。

（下一步）過期。閒置超過設定的時間，伺服器自動清掉。這是被動的。

（下一步）失效。程式呼叫 invalidate，立刻清掉。這是主動的。

（下一步）不管是過期還是失效，舊的號碼牌就沒用了。下次再來，會拿到一格全新的、空的置物櫃。
-->

---

# 補充：保護號碼牌

號碼牌如果被別人拿走，他就能冒充你。所以有兩個相關的設定：

```properties
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=true
```

<v-clicks>

- `http-only`：網頁上的 JavaScript 讀不到這個 Cookie。預設就是 `true`
- `secure`：只在加密的連線（HTTPS）才傳送。正式上線時建議開啟
- 開發時用的是 `http://localhost`，**先不要加** `secure`，否則號碼牌送不出去

</v-clicks>

<!--
最後補充一點安全的觀念。

號碼牌上雖然只有一個號碼，但是如果被別人拿走，他就能冒充你。所以有兩個相關的設定。

（下一步）http-only。意思是網頁上的 JavaScript 讀不到這個 Cookie，只有瀏覽器發請求的時候會帶上。這樣可以降低號碼牌被惡意程式偷走的機會。它預設就是 true，不用特別寫。

（下一步）secure。意思是只在加密的連線，也就是 HTTPS，才傳送這個 Cookie。正式上線的時候建議開啟。

（下一步）不過我們開發的時候用的是 http 開頭的 localhost，沒有加密。所以現在先不要加 secure，否則號碼牌送不出去，Session 會完全沒有作用。

這一頁現在知道就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 動手練習

<!--
兩個練習。
-->

---

# 練習 1：你是第幾次來？

在 `SessionController` 新增 `GET /session/visit`：

<v-clicks>

- 從 Session 拿出名字叫 `count` 的數字
- 沒有的話（`null`）代表第一次來，從 `0` 開始
- 加 1 之後存回 Session
- 回傳「這是你第 N 次來」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 連續送幾次，數字應該會一直增加。登出之後再送，又從 1 開始。
</div>

</v-click>

<!--
練習一。在 SessionController 新增一個 API，GET /session/visit，功能是數這位使用者來了幾次。

（下一步）從 Session 拿出名字叫 count 的數字。

（下一步）沒有的話，也就是 null，代表第一次來，從 0 開始。

（下一步）加 1 之後，存回 Session。

（下一步）回傳「這是你第 N 次來」。

（下一步）完成之後，連續送幾次，數字應該會一直增加。登出之後再送，又從 1 開始。

提示：拿出來的時候要轉型成 Integer。請先暫停，自己試試看。
-->

---

# 練習 1：參考答案

```java
@GetMapping("/session/visit")
public String visit(HttpSession session) {
    Integer count = (Integer) session.getAttribute("count");
    if (count == null) {
        count = 0;
    }
    count = count + 1;
    session.setAttribute("count", count);
    return "這是你第 " + count + " 次來";
}
```

<v-clicks>

- 這個數字是**每個人各自一份**。換一個瀏覽器來，會從 1 開始
- 伺服器重新啟動之後，所有的 Session 都會消失。它只是暫存，不是資料庫

</v-clicks>

<!--
參考答案。

先拿出 count，轉型成 Integer。如果是 null，設成 0。加 1，存回去，回傳。

（下一步）這個數字是每個人各自一份的。因為每個人有自己的置物櫃。你可以用 Postman 送幾次，再用瀏覽器打開同一個網址。瀏覽器會從 1 開始，因為它拿的是另一張號碼牌。

（下一步）還有一點。伺服器重新啟動之後，所有的 Session 都會消失。因為它預設是放在伺服器的記憶體裡。Session 只是暫存，不是資料庫。需要長久保存的資料，還是要存進資料庫。
-->

---

# 練習 2：沒登入就擋下來

修改 `GET /session/info`：

1. 沒登入的時候，改用 `ResponseEntity` 回覆 **401**，內容是「尚未登入」
2. 有登入的時候，回覆 200 和「目前登入的是：xxx」
3. 在 `application.properties` 加上 `server.servlet.session.timeout=2m`
4. 測試：登入 → 查詢（200）→ 登出 → 查詢（401）→ 重新登入 → 等兩分鐘以上 → 查詢（401）

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 401 Unauthorized 的意思是「我不知道你是誰，請先登入」。提示：<code>ResponseEntity.status(401).body("…")</code>
</div>

</v-click>

<!--
練習二。修改剛才的 /session/info。

第一，沒登入的時候，改用 ResponseEntity 回覆 401，內容是「尚未登入」。

第二，有登入的時候，回覆 200 和原本的訊息。

第三，在 application.properties 把 Session 的過期時間設成兩分鐘，方便觀察。

第四，測試。登入之後查詢，應該是 200。登出之後查詢，應該是 401。重新登入，等兩分鐘以上都不要送請求，再查詢，應該也是 401。

（下一步）401 這個狀態碼的意思是：我不知道你是誰，請先登入。提示寫在這裡，和第三十三章用過的寫法一樣。

請先暫停，自己試試看。
-->

---

# 練習 2：參考答案

```java
@GetMapping("/session/info")
public ResponseEntity<String> info(HttpSession session) {
    String username = (String) session.getAttribute("username");
    if (username == null) {
        return ResponseEntity.status(401).body("尚未登入");
    }
    return ResponseEntity.ok("目前登入的是：" + username);
}
```

```properties
server.servlet.session.timeout=2m
```

<v-clicks>

- 登出後的 401：`invalidate()` **主動**清掉的
- 等兩分鐘後的 401：閒置太久，伺服器**自動**清掉的
- 測試完記得把 `timeout` 改回來，或是刪掉那一行

</v-clicks>

<!--
參考答案。

回傳型別改成 ResponseEntity。username 是 null 的時候，回覆 401 加上訊息。否則回覆 200。

設定檔加上 timeout 等於 2m。改完設定要重新啟動。

（下一步）登出後查詢得到的 401，是 invalidate 主動清掉的。

（下一步）等兩分鐘後得到的 401，是閒置太久，伺服器自動清掉的。兩種情況，對使用者來說結果一樣：要重新登入。

（下一步）測試完記得把 timeout 改回來，或是刪掉那一行，不然之後測試會一直被登出。

這個「先檢查有沒有登入，沒有就擋下來」的動作，就是保護 API 最基本的做法。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="what,櫃台辦完就忘=code,HTTP 無狀態|cabinet,置物櫃=code,Session（HttpSession）|card,號碼牌=code,Cookie：JSESSIONID|form,放東西、拿東西=code,setAttribute()、getAttribute()|no,太久沒來，自動清掉=code,server.servlet.session.timeout|lock,離開時清空、號碼牌作廢=code,invalidate()" />

<!--
我們用一張圖複習今天的內容。

（下一步）櫃台辦完就忘，是 HTTP 無狀態。

（下一步）置物櫃，是 Session，程式裡是 HttpSession。

（下一步）號碼牌，是名字叫 JSESSIONID 的 Cookie。

（下一步）放東西、拿東西，是 setAttribute 和 getAttribute。

（下一步）太久沒來自動清掉，是 timeout 的設定。

（下一步）離開時清空、號碼牌作廢，是 invalidate。
-->

---

# 章節總結

<v-clicks>

- **無狀態**：HTTP 的每個請求都是獨立的，伺服器不記得上一次
- **Session**：伺服器替每位使用者準備的暫存空間；瀏覽器只拿著編號（JSESSIONID）
- **取得**：在 Controller 方法的參數寫 `HttpSession session`
- **存取**：`setAttribute()`、`getAttribute()`（要轉型、要檢查 `null`）
- **結束**：登出用 `invalidate()`；閒置太久會自動過期，預設 30 分鐘

</v-clicks>

<v-click>

下一章：程式越寫越多，怎麼確定改了東西之後，原本的功能沒有壞掉？

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）無狀態：HTTP 的每個請求都是獨立的。Session 是伺服器替每位使用者準備的暫存空間，瀏覽器只拿著編號。取得的方法是在 Controller 方法的參數寫 HttpSession。存取用 setAttribute 和 getAttribute，拿出來要轉型、要檢查 null。登出用 invalidate；閒置太久會自動過期，預設 30 分鐘。

（最後一步）下一章換一個主題。程式越寫越多，怎麼確定改了東西之後，原本的功能沒有壞掉？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

有任何問題歡迎提出來。
-->
