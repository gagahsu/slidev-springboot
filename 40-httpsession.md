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
大家好，今天我們要聊的是 Session 管理，這是 Web 後端非常核心的功能之一。

想像一下，你登入了一個購物網站，加了幾樣東西進購物車，然後點擊下一頁。如果沒有 Session，網站就會「忘記」你是誰，購物車也會清空。這就是 HTTP 無狀態的問題。

今天學的 HttpSession，就是 Spring Boot 內建的解決方案——讓伺服器「記住」特定使用者的狀態，跨越多個請求。
-->

---
layout: default
---

# Outline

- **HTTP 無狀態問題** — 為什麼需要 Session？
- **什麼是 Session？** — Session 概念與 JSESSIONID
- **HttpSession 基本用法** — 在 Controller 取得並操作 Session
- **HttpSession 核心 API** — `setAttribute` / `getAttribute` / `invalidate` 等
- **Session 設定** — timeout、Cookie 安全設定
- **Session 生命週期** — 創建、存取、過期、失效
- **練習題**

<!--
今天的學習路徑：

先從「為什麼需要 Session」開始，理解 HTTP 無狀態的問題。
再認識 Session 的運作機制和 JSESSIONID。
然後學習在 Spring Boot Controller 中實際操作 HttpSession。
最後看 application.properties 的設定選項，以及 Session 的完整生命週期。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## HTTP 的無狀態問題與 Session 概念

<!--
先從問題出發：HTTP 是無狀態協議，這對 Web 應用來說意味著什麼？
-->

---

# HTTP 的無狀態問題

| 情境 | 問題 |
| --- | --- |
| 使用者登入後切換頁面 | 伺服器不知道這個請求和剛才的登入請求來自同一人 |
| 購物車加入商品後結帳 | 伺服器不記得購物車裡有什麼 |
| 多步驟表單填寫 | 伺服器不保留前幾步驟的輸入資料 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>無狀態的本質：</b> HTTP 每次請求都是獨立的，伺服器預設不記得任何先前的互動。Session 機制就是在這個基礎上，額外建立「記憶」。
</div>

<!--
HTTP 是無狀態協議——這是 HTTP 設計上的特性，讓它簡單、可擴展。

但對 Web 應用來說，這帶來了很實際的問題：你登入了，伺服器處理完那個請求就忘了你。你下一個請求來了，伺服器不知道你是誰。

Session 就是為了解決這個問題而存在的。
-->

---

# 什麼是 Session？

| 概念 | 說明 |
| --- | --- |
| Session（會話） | 伺服器為每個使用者建立的「暫存空間」，可跨請求儲存資料 |
| JSESSIONID | 瀏覽器持有的 Cookie，用來識別對應的伺服器端 Session |
| 運作機制 | 第一次請求 → 伺服器建立 Session 並回傳 JSESSIONID；後續請求帶上 JSESSIONID → 伺服器找回對應的 Session 資料 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>生活類比：</b> Session 就像餐廳的號碼牌。你進門時拿到號碼（JSESSIONID），廚房用號碼找到你點的餐（Session 資料）。離開時號碼還給餐廳，資料就清空了。
</div>

<!--
Session 的運作方式很直觀：

第一次你的請求進來，伺服器幫你建立一個「號碼牌」——JSESSIONID，並把它放進 Cookie 回傳給瀏覽器。
之後你每次發請求，瀏覽器自動帶上這個 Cookie，伺服器就能用這個號碼找到你的資料。

JSESSIONID 是一個長長的隨機字串，猜不出來，所以有一定的安全性。

這整套機制，在 Spring Boot 中就是透過 HttpSession 來操作的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## HttpSession 基本用法

<!--
理解了概念，來看怎麼在 Spring Boot Controller 中實際操作 HttpSession。
-->

---

# 在 Controller 取得 HttpSession

Spring Boot 中，只需在方法參數宣告 `HttpSession`，框架會自動注入：

```java
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/session")
public class SessionController {

    @PostMapping("/login")
    public String login(@RequestParam String username,
                        HttpSession session) {
        session.setAttribute("username", username);
        return "登入成功，Session ID：" + session.getId();
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 3.x 注意：</b> import 路徑是 <code>jakarta.servlet.http.HttpSession</code>，不是舊版的 <code>javax.servlet.http.HttpSession</code>。
</div>

<!--
在 Spring Boot 中使用 HttpSession 非常簡單——只要在 Controller 方法的參數加上 HttpSession，框架就會自動注入，不需要額外設定。

注意 import 路徑：Spring Boot 3.x 改用 Jakarta EE，所以是 jakarta.servlet.http.HttpSession，不是以前的 javax.servlet.http.HttpSession。這是 Spring Boot 2.x 升 3.x 最常見的 import 錯誤之一。

session.setAttribute("username", username) 就是把使用者名稱存進 Session 的暫存空間。session.getId() 回傳的就是 JSESSIONID 的值。
-->

---

# 讀取與刪除 Session 資料

讀取 Session 中已儲存的資料，並加上 null 檢查：

```java
@GetMapping("/info")
public String getSessionInfo(HttpSession session) {
    String username = (String) session.getAttribute("username");
    if (username == null) {
        return "尚未登入";
    }
    return "目前登入：" + username;
}
```

登出時主動使 Session 完全失效：

```java
@PostMapping("/logout")
public String logout(HttpSession session) {
    session.invalidate();
    return "已登出，Session 已清除";
}
```

<!--
getAttribute 回傳的是 Object，需要強制轉型。如果 Session 中沒有對應的 key，會回傳 null，所以我們要先做 null 檢查，避免 NullPointerException。

invalidate() 是登出功能的核心：呼叫之後，伺服器會把這個 Session 完全清除，之後再用同一個 JSESSIONID 請求就會失效，強迫使用者重新登入。這是安全的做法——不能只是把 attribute 移除，那樣 Session 還在，有安全風險。
-->

---

# HttpSession 核心 API

| 方法 | 說明 |
| --- | --- |
| `setAttribute(String name, Object value)` | 將物件以 key-value 形式存入 Session |
| `getAttribute(String name)` | 以 key 取得 Session 中的物件，不存在則回傳 `null` |
| `removeAttribute(String name)` | 移除 Session 中指定的 key |
| `getId()` | 回傳此 Session 的唯一識別碼（即 JSESSIONID 的值） |
| `invalidate()` | 立即使此 Session 失效，清除所有儲存的資料 |
| `setMaxInactiveInterval(int seconds)` | 以秒為單位動態設定 Session 閒置逾時時間 |
| `getMaxInactiveInterval()` | 取得目前設定的閒置逾時秒數 |
| `isNew()` | 判斷此 Session 是否剛剛建立（此次請求第一次取得） |

<!--
這八個方法是 HttpSession 最常用的 API，幾乎覆蓋了所有日常使用情境。

特別要記住：setAttribute 和 getAttribute 是核心，invalidate 是登出必用，getId 可以用來除錯。

isNew() 很適合用來判斷使用者是第一次造訪（Session 剛建立）還是已經有既有 Session，在某些初始化邏輯中很有用。

setMaxInactiveInterval 可以在程式碼中動態調整，但通常我們會用 application.properties 統一設定，更容易維護。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## Session 設定

<!--
了解用法之後，來看怎麼在 application.properties 調整 Session 的行為。
-->

---

# application.properties — Session 設定

| 設定 | 說明 | 預設值 |
| --- | --- | --- |
| `server.servlet.session.timeout` | Session 閒置逾時（支援 `30m`、`600s` 格式） | `30m` |
| `server.servlet.session.cookie.http-only` | 禁止 JavaScript 存取 Session Cookie | `true` |
| `server.servlet.session.cookie.secure` | 僅透過 HTTPS 傳送 Cookie | `false` |
| `server.servlet.session.cookie.name` | 自訂 Cookie 名稱 | `JSESSIONID` |

```properties
server.servlet.session.timeout=30m
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=true
```

<!--
幾個實務上很重要的設定：

timeout 預設是 30 分鐘。如果你的應用需要使用者長時間操作（例如後台管理系統），可以調長；如果是金融或敏感操作，可以縮短到 10 分鐘。

http-only=true 是安全設定，防止 XSS 攻擊透過 JavaScript 偷走你的 Session Cookie。Spring Boot 預設已開啟，不要關掉它。

secure=true 確保 Cookie 只在 HTTPS 連線中傳送，防止在 HTTP 中被竊聽。本機開發設 false 沒關係，但生產環境一定要設 true。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## Session 生命週期

<!--
最後來看 Session 從建立到消滅的完整生命週期。
-->

---

# Session 生命週期

| 階段 | 觸發時機 | 說明 |
| --- | --- | --- |
| 建立 | 第一次呼叫 `request.getSession()` 或方法注入 `HttpSession` | 產生 JSESSIONID 並透過 Cookie 回傳給瀏覽器 |
| 存活 | 每次有請求帶著有效的 JSESSIONID | 每次存取都會重置閒置計時器 |
| 過期 | 超過 `session.timeout` 設定的閒置時間 | 伺服器自動清除，下次請求視為新 Session |
| 主動失效 | 呼叫 `session.invalidate()` | 立即清除 Session 資料（登出用途） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>過期 vs 失效：</b> 過期是被動的（閒置超時由容器自動處理）；失效是主動的（<code>invalidate()</code> 由程式呼叫）。登出功能應使用 <code>invalidate()</code>，而不是等待自動過期。
</div>

<!--
Session 的生命週期可以這樣理解：

就像餐廳的號碼牌，拿到牌之後，只要你一直在點菜（發請求），計時器就不斷重置。如果你超過 30 分鐘都沒點任何東西，餐廳（伺服器）就自動收回你的牌（過期）。

如果你主動跟服務員說「我不吃了」（invalidate()），則立刻收回，不用等 30 分鐘。

實作登出功能一定要用 invalidate()，不能只是把 attribute 刪掉——那樣 Session 還在，只是裡面資料不見了，還有被重複利用的安全風險。
-->

---

# 補充：HttpSession vs @SessionAttributes

| 比較項目 | `HttpSession` | `@SessionAttributes` |
| --- | --- | --- |
| 使用方式 | 直接注入，手動操作 | 加在 Controller 類別上，自動同步 Model |
| 控制粒度 | 細（可自訂任意 key） | 粗（指定 Model attribute 名稱） |
| 適用場景 | 登入狀態、購物車、跨 Controller 共用狀態 | 多步驟表單、單一 Controller 的暫存資料 |
| 失效方式 | `session.invalidate()` | `SessionStatus.setComplete()` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>實務建議：</b> 大多數情境（尤其是 RESTful API）優先使用 <code>HttpSession</code>；<code>@SessionAttributes</code> 較適合 MVC 多步驟表單場景。
</div>

<!--
@SessionAttributes 是 Spring MVC 提供的另一個操作 Session 的方式，不過它的使用情境比較特定——主要是配合 Model 物件使用，在多步驟表單中自動把 Model 屬性同步到 Session。

對於我們一般的 RESTful API 開發，直接注入 HttpSession 並手動操作是更常用也更靈活的做法。

了解兩者的差異，遇到相關問題時知道選哪一個就夠了。
-->

---
layout: default
---

# 練習 1：實作登入與讀取 Session
### 任務說明

建立一個 `SessionController`，實作以下三支 API：

1. `POST /session/login`：接收 `@RequestParam String username`，呼叫 `session.setAttribute("username", username)`，回傳登入成功訊息與 Session ID
2. `GET /session/info`：呼叫 `session.getAttribute("username")`，若為 `null` 回傳「尚未登入」，否則回傳「目前登入：xxx」
3. 使用 Postman 測試：先呼叫 `/session/login`，再呼叫 `/session/info`，確認第二支 API 能讀到 Session 資料

<!--
這個練習讓大家從零建立一個最基本的 Session 登入流程。

重點是要用 Postman 測試，觀察 Cookie 的行為——登入之後，Postman 應該會自動持有 JSESSIONID，後續請求自動帶上，所以 /session/info 才能讀到資料。

如果 Postman 設定成每次都清 Cookie，就會發現 /session/info 永遠回傳「尚未登入」——這就是 Session 機制的本質，很值得親眼觀察一次。
-->

---
layout: default
---

# 練習 1：解題提示
### 提示說明

1. `HttpSession` 宣告在方法參數中，Spring Boot 會自動注入，不需要 `@Autowired`
2. import 路徑：`jakarta.servlet.http.HttpSession`（Spring Boot 3.x，注意是 `jakarta` 不是 `javax`）
3. `getAttribute` 回傳的是 `Object`，需要強制轉型：`(String) session.getAttribute("username")`
4. Postman 預設開啟 Cookie Jar，可確保跨請求自動持有 JSESSIONID；可在 Postman Cookies 頁籤觀察到它

<!--
最容易出錯的地方有兩個：

第一是 import 路徑，Jakarta EE 遷移是 Spring Boot 3.x 的大改變，如果 IDE 自動補全了 javax.servlet.http.HttpSession，一定要手動改掉。

第二是 getAttribute 的型別轉型——因為 Session 存的是 Object，取出來一定要轉型，如果型別不對會在 Runtime 拋出 ClassCastException。

Postman 預設會自動管理 Cookie，所以跨請求的 Session 追蹤是自動的。如果覺得奇怪為什麼能讀到，去 Postman 的 Cookie 頁籤看看有沒有 JSESSIONID 就明白了。
-->

---
layout: default
---

# 練習 2：實作登出與 Session 保護
### 任務說明

在練習 1 的基礎上，繼續新增：

1. `POST /session/logout`：呼叫 `session.invalidate()`，回傳「已登出」
2. 在 `/session/info` 加上保護：若 `getAttribute("username")` 為 `null`，改用 `ResponseEntity` 回傳 HTTP 401
3. 在 `application.properties` 加上 `server.servlet.session.timeout=2m`，重新啟動後等待 2 分鐘，確認 Session 自動過期、再呼叫 `/session/info` 得到 401

<!--
這個練習讓大家理解 Session 的「主動失效」和「被動過期」兩種情境。

登出是主動的，呼叫 invalidate() 立刻清除。只移除 attribute 是不夠的，舊的 Session ID 還可能被重複使用，這是安全漏洞。

timeout 設成 2 分鐘只是為了測試方便，讓大家親眼看到 Session 過期的效果。實際專案通常是 30 分鐘。

ResponseEntity 回傳 401 讓大家練習把 Session 狀態轉換成正確的 HTTP 回應碼，這在 RESTful API 設計中很重要。
-->

---
layout: default
---

# 練習 2：解題提示
### 提示說明

1. 回傳 HTTP 401：`return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("尚未登入");`
2. `session.invalidate()` 之後，不要再呼叫同一個 `session` 物件的任何方法——Session 已失效，呼叫會拋出 `IllegalStateException`
3. `server.servlet.session.timeout=2m` 加在 `application.properties` 後，需重新啟動才生效
4. 測試流程：登入 → 等超過 2 分鐘 → 呼叫 `/session/info` → 應回傳 401

<!--
invalidate() 之後不能再操作這個 Session 物件，這是初學者很常犯的錯誤——在 invalidate() 之後還想讀取某個 attribute 確認它被刪掉了，結果拋出 IllegalStateException。

timeout=2m 是縮短時間方便測試，記得測試完改回合理的值（如 30m）。

ResponseEntity 的用法大家在 ch21 已經學過，這裡只是複習一下回傳非 200 狀態碼的寫法。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| Session 存在的原因 | HTTP 無狀態，需要額外機制記錄使用者狀態 |
| JSESSIONID | 瀏覽器持有的 Cookie，用來識別伺服器端的 Session |
| 取得 HttpSession | 在 Controller 方法參數宣告 `HttpSession`，Spring Boot 自動注入 |
| import 路徑 | Spring Boot 3.x：`jakarta.servlet.http.HttpSession` |
| 核心 API | `setAttribute` / `getAttribute` / `invalidate` / `getId` |
| 逾時設定 | `server.servlet.session.timeout=30m` |
| 登出實作 | 呼叫 `session.invalidate()`，不能只刪除 attribute |

<!--
今天的重點：

第一，HTTP 是無狀態的，Session 是在這個基礎上建立的「使用者暫存空間」，靠 JSESSIONID Cookie 識別身份。

第二，Spring Boot 中使用 HttpSession 非常簡單，直接在方法參數宣告就能取得，不需要額外設定。

第三，Spring Boot 3.x 的 import 是 jakarta.servlet.http.HttpSession，這個一定要記住。

第四，登出要用 invalidate()，而不是只刪屬性。

第五，透過 application.properties 可以控制 Session 的逾時時間和 Cookie 的安全設定。

這是很基礎但很重要的知識——幾乎所有需要「登入狀態」的 Web 應用都會用到。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
