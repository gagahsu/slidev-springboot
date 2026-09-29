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
    public String login(@RequestParam("username") String username,
                        HttpSession session) {
        session.setAttribute("username", username);
        return "登入成功，Session ID：" + session.getId();
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 3.x / 4.x 注意：</b> import 路徑是 <code>jakarta.servlet.http.HttpSession</code>，不是舊版的 <code>javax.servlet.http.HttpSession</code>。
</div>

<!--
在 Spring Boot 中使用 HttpSession 非常簡單——只要在 Controller 方法的參數加上 HttpSession，框架就會自動注入，不需要額外設定。

注意 import 路徑：Spring Boot 3.x / 4.x 改用 Jakarta EE，所以是 jakarta.servlet.http.HttpSession，不是以前的 javax.servlet.http.HttpSession。這是 Spring Boot 2.x 升 3.x / 4.x 最常見的 import 錯誤之一。

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
layout: default
---

# 練習 1：作答暫存與確認頁讀取

問卷需求規定：使用者按「送出」時，**不立刻寫資料庫**，先放進 Session 並跳到確認頁；在確認頁可以檢查、修改，按下確認才真正寫入。請實作前半段：

1. `dto/ResponseDTO`、`dto/AnswerDTO`：作答者資料（姓名、手機、Email 必填，年齡選填）與每題答案（`values` 是陣列，多選有多個值）
2. `service/DraftService`：用 `HttpSession` 存取作答暫存，key 為 `"responseDraft:" + surveyId`
3. `POST /api/surveys/{id}/draft`：檢查資料格式（`@Valid`），且問卷必須「進行中」，通過就存進 Session
4. `GET /api/surveys/{id}/draft`：讀出 Session 的暫存；沒有暫存回傳 **409 `NO_DRAFT`**
5. 用 Postman 驗證：① 暫存後可讀回 ② 換一份問卷讀不到（key 不同）③ 清掉 Cookie 就讀不到 ④ 對「尚未開始」的問卷暫存被拒絕

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 放進 Session 的物件要實作 <code>Serializable</code>：Tomcat 重新啟動時會把 Session 存到磁碟再讀回來，物件不能序列化就會遺失或報錯。
</div>

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這一題是動態問卷「前台作答」流程的前半段。需求文件寫得很清楚：使用者按送出之後，先放到 Session，跳到確認頁，確認之後才寫進資料庫。為什麼要這樣設計？因為確認頁的資料要能「帶回去修改」，如果一送出就寫進資料庫，使用者按修改，就得再更新資料庫；放在 Session 裡，只是暫時的，隨時可以覆蓋，也不會在資料庫留下半成品。

Session 存取的技巧，剛剛在本章已經學過：HttpSession 宣告在方法參數，Spring 自動注入。這裡有兩個新的地方：

第一，key 要跟問卷 id 綁在一起。使用者可能同時開兩份問卷，如果 key 都叫 draft，兩份問卷的暫存會互相覆蓋。

第二，Session 裡放的是一個物件，不是字串。物件要實作 Serializable。這個很容易被忽略：開發的時候用 IDE 每改一次程式碼就會重新啟動，Tomcat 預設會把 Session 保存起來，重新啟動後再載入；如果物件不能序列化，你會發現每次重啟後，暫存都消失了，或是啟動時出現一堆警告。

驗證的部分，@Valid 已經在上一章學過，會擋掉格式錯誤；「問卷必須進行中」是業務規則，放在 Service。
-->

---
layout: default
---

# 練習 1：解題提示

1. DTO 要 `implements Serializable`；`answers` 是 `List<AnswerDTO>`，`AnswerDTO.values` 是 `List<String>`（單選、文字題只有一個值，多選有多個）
2. `HttpSession` 直接宣告在 Controller 方法參數，不需要 `@Autowired`
3. `session.getAttribute(key)` 回傳 `Object`，取出時要強制轉型；沒有值會是 `null`
4. 讀不到暫存要丟 `BizException(RspCode.NO_DRAFT)`，由 `GlobalExceptionHandler` 轉成 409
5. 「問卷必須進行中」：用 ch37 的 `statusOf(survey) == SurveyStatus.ONGOING` 判斷
6. Postman 預設會自動保存 Cookie（`JSESSIONID`），所以不同請求會共用同一個 Session

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
提示第三點：取出來的值可能是 null，一定要處理。這裡我們用 BizException 讓呼叫端得到一個清楚的錯誤，而不是 NullPointerException。

Postman 的 Cookie 管理很好用：登入一次就自動帶上。要模擬「另一個使用者」，可以在 Postman 的 Cookies 頁籤把 localhost 的 JSESSIONID 刪掉，再發請求，就等於是全新的瀏覽器。

驗證 ③ 很有意思，大家一定要親自試：清掉 Cookie 之後再 GET draft，會得到 409。這證明 Session 是跟著「瀏覽器」的，不是跟著「使用者帳號」的，這也是為什麼我們的問卷可以讓沒有登入的訪客填寫。
-->

---
layout: default
---

# 練習 1：解答（DTO）

```java
@Getter
@Setter
public class ResponseDTO implements java.io.Serializable {
    private Integer id;              // 只在回傳時填入
    private Integer surveyId;
    private LocalDateTime submittedAt;

    @NotBlank(message = "請輸入姓名")
    private String name;

    @NotBlank(message = "請輸入手機")
    @Pattern(regexp = "^09\\d{8}$", message = "手機格式錯誤（09 開頭，共 10 碼）")
    private String phone;

    @NotBlank(message = "請輸入 Email")
    @Email(message = "Email 格式錯誤")
    private String email;

    @Min(value = 1, message = "年齡不合理")
    @Max(value = 120, message = "年齡不合理")
    private Integer age;

    @Valid
    private List<AnswerDTO> answers = new ArrayList<>();
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
ResponseDTO 有兩類欄位。第一類是作答者的基本資料：姓名、手機、Email 必填，年齡選填。@Pattern 用正規表示式規定手機格式，09 開頭共十碼；@Email 檢查 Email 格式；@Min、@Max 限制年齡合理範圍。這些都是上一章學過的驗證註解，訊息也跟需求文件的畫面一致。

第二類是 answers：每一題一個 AnswerDTO。AnswerDTO 的 values 是 List<String>，統一表示三種題型：單選題和文字題只有一個值，多選題有多個值。把三種題型統一成同一個結構，前端和後端都不需要判斷題型分別處理。
-->

---
layout: default
---

# 練習 1：解答（DTO）（續）

```java
@Getter
@Setter
public class AnswerDTO implements java.io.Serializable {
    private Integer questionId;
    private String questionTitle; // 只在回傳時填入
    private List<String> values = new ArrayList<>(); // 單選 / 文字只有一個值，多選有多個
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
id、surveyId、submittedAt 這三個欄位是回傳時才填的，前端送來的會被忽略。questionTitle 在 AnswerDTO 也是一樣，只在後台看回饋細節時才填。
-->

---
layout: default
---

# 練習 1：解答（DraftService 與 Controller）
### `service/DraftService.java`、`SurveyController`

```java
/** 「送出前先放 Session、確認後才寫資料庫」的暫存區。 */
@Service
public class DraftService {

    // key 跟問卷 id 綁在一起，同時填兩份問卷才不會互相覆蓋
    private String responseKey(Integer surveyId) {
        return "responseDraft:" + surveyId;
    }

    public void saveResponse(HttpSession session, Integer surveyId, ResponseDTO dto) {
        session.setAttribute(responseKey(surveyId), dto);
    }

    public ResponseDTO getResponse(HttpSession session, Integer surveyId) {
        return (ResponseDTO) session.getAttribute(responseKey(surveyId));
    }

    public void clearResponse(HttpSession session, Integer surveyId) {
        session.removeAttribute(responseKey(surveyId));
    }
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
DraftService 把「怎麼存取 Session」集中在一個地方。Controller 和其他 Service 不用知道 key 長什麼樣子，也不會不小心拼錯字。responseKey 方法把 key 拼成 responseDraft: 加問卷 id。

這種寫法還有一個好處：如果將來要把暫存從 Session 換成別的地方，例如 Redis，只需要改這個類別。
-->

---
layout: default
---

# 練習 1：解答（DraftService 與 Controller）（續）
### `service/DraftService.java`、`SurveyController`

```java
@PostMapping("/api/surveys/{id}/draft")
public AppResponse<Void> saveDraft(@PathVariable("id") Integer id,
                                   @Valid @RequestBody ResponseDTO body, HttpSession session) {
    responseService.saveDraft(id, body, session);
    return AppResponse.success();
}

@GetMapping("/api/surveys/{id}/draft")
public AppResponse<ResponseDTO> getDraft(@PathVariable("id") Integer id, HttpSession session) {
    return AppResponse.success(responseService.getDraft(id, session));
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
Controller 很薄：POST 收到資料，@Valid 先驗證格式，再交給 Service；GET 把 Session 的暫存回傳給確認頁使用。

⚠️ 易錯點：HttpSession 是每個請求都可以注入的，但只有在你真的呼叫 getSession 或是注入它的時候，Tomcat 才會建立 Session。如果一個只讀資料的 API 也注入了 HttpSession，每個請求都會創建一個新的 Session，浪費記憶體，所以只有需要的 API 才注入。
-->

---
layout: default
---

# 練習 1：解答（ResponseService 的暫存與檢查）
### `service/ResponseService.java`（1/2）

```java
@Service
@RequiredArgsConstructor
public class ResponseService {

    private final SurveyService surveyService;
    private final DraftService draftService;
    private final SurveyResponseRepository responseRepository;

    /** 第一步：檢查後放進 Session（不寫資料庫） */
    public void saveDraft(Integer surveyId, ResponseDTO dto, HttpSession session) {
        check(surveyId, dto);
        draftService.saveResponse(session, surveyId, dto);
    }

    public ResponseDTO getDraft(Integer surveyId, HttpSession session) {
        ResponseDTO dto = draftService.getResponse(session, surveyId);
        if (dto == null) throw new BizException(RspCode.NO_DRAFT);
        return dto;
    }
    // check() 見下一頁
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
saveDraft 先呼叫 check 做檢查，通過才存進 Session。check 這個方法很重要，練習 2 的送出也會再呼叫一次，所以我們先把它獨立出來。

getDraft 讀取暫存，沒有就丟 BizException(NO_DRAFT)。

為什麼要在送出時「再檢查一次」？因為使用者按下暫存到按下確認之間，可能隔了好幾分鐘。這段時間裡，問卷可能剛好過期，或是同一個 Email 已經有人用另一個瀏覽器送出了。只在暫存時檢查是不夠的，送出時一定要重新檢查。這是很常被忽略的防禦。
-->

---
layout: default
---

# 練習 1：解答（check — 共用檢查）
### `service/ResponseService.java`（2/2）

```java
    // ... 接上一頁

    /** 共用檢查：問卷要在填寫期間、Email 沒填過、必填題都有答、答案在選項裡 */
    private Survey check(Integer surveyId, ResponseDTO dto) {
        Survey survey = surveyService.findOrThrow(surveyId);
        if (surveyService.statusOf(survey) != SurveyStatus.ONGOING) {
            throw new BizException(RspCode.SURVEY_NOT_OPEN);
        }
        if (responseRepository.existsBySurveyIdAndEmail(surveyId, dto.getEmail().trim().toLowerCase())) {
            throw new BizException(RspCode.ALREADY_RESPONDED);
        }
        Map<Integer, AnswerDTO> answers = dto.getAnswers().stream()
                .filter(a -> a.getQuestionId() != null)
                .collect(Collectors.toMap(AnswerDTO::getQuestionId, a -> a, (x, y) -> y));

    // ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
check 依序檢查五件事，任何一件不符合就丟 BizException：

一，問卷必須是進行中，前面已經介紹過，用 SurveyStatus 判斷。

二，同一個 Email 沒有填過這份問卷。這是用 existsBySurveyIdAndEmail 查資料庫，需求文件規定「同一個 Email 無法重複填寫同一張問卷」。
-->

---
layout: default
---

# 練習 1：解答（check — 共用檢查）（續）
### `service/ResponseService.java`（2/2）

```java
        // ... 接上一頁

        for (Question q : survey.getQuestions()) {
            AnswerDTO a = answers.get(q.getId());
            List<String> values = a == null ? List.of() : cleanValues(a);
            if (values.isEmpty()) {
                if (q.getRequired()) {
                    throw new BizException(RspCode.VALIDATION_ERROR, "「" + q.getTitle() + "」為必填");
                }
                continue;
            }
            if (q.getType() == QuestionType.TEXT) continue;
            Set<String> labels = q.getOptions().stream().map(Option::getLabel).collect(Collectors.toSet());

        // ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
三，每一題必填的，都要有答案。

四，單選跟多選的答案，必須真的是選項裡的值。這個檢查很重要：前端的畫面雖然只有選項可以選，但是任何人都可以用 Postman 直接送任意的值，後端不能相信前端。
-->

---
layout: default
---

# 練習 1：解答（check — 共用檢查）（續）
### `service/ResponseService.java`（2/2）

```java
    // ... 接上一頁

            if (!labels.containsAll(values)) {
                throw new BizException(RspCode.VALIDATION_ERROR, "「" + q.getTitle() + "」的答案不在選項內");
            }
            if (q.getType() == QuestionType.SINGLE && values.size() != 1) {
                throw new BizException(RspCode.VALIDATION_ERROR, "「" + q.getTitle() + "」只能選一個");
            }
        }
        return survey;
    }

    private List<String> cleanValues(AnswerDTO a) {
        return a.getValues().stream().map(String::trim).filter(v -> !v.isEmpty()).toList();
    }
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
五，單選題只能有一個答案。

還有一個小技巧：answers 先轉成 Map，key 是題目 id，這樣逐題檢查時，直接用題目 id 找答案，不用每題都掃一遍整個 List，寫起來也比較清楚。

Email 統一轉小寫存進資料庫，避免 A@x.com 和 a@x.com 被當成兩個不同的人。
-->

---
layout: default
---

# 練習 1：Postman 測試

`POST /api/surveys/2/draft`，Body（JSON）：

```json
{
  "name": "測試員", "phone": "0955123456", "email": "t1@example.com", "age": 30,
  "answers": [
    { "questionId": 1, "values": ["輕食"] },
    { "questionId": 2, "values": ["青菜", "豆腐"] },
    { "questionId": 3, "values": ["很好"] }
  ]
}
```

| 步驟 | 動作 | 預期結果 |
| --- | --- | --- |
| 1 | `POST /api/surveys/2/draft` | 200，`SUCCESS`；Postman Cookies 出現 `JSESSIONID` |
| 2 | `GET /api/surveys/2/draft` | 200，內容跟剛才送的一樣 |
| 3 | `GET /api/surveys/3/draft` | **409** `NO_DRAFT`（key 不同，互不影響） |
| 4 | 刪除 Cookie 後 `GET /api/surveys/2/draft` | **409** `NO_DRAFT`（新的瀏覽器） |

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
測試的重點在步驟 3 和 4，這兩步證明了 Session 的特性：它是跟著瀏覽器走的，不是跟著使用者帳號，也不是全站共用。

步驟 5、6、7 是驗證我們的檢查有生效。特別是步驟 7：「必填題沒有答案」的情況，這個檢查不是 @Valid 做的，@Valid 不知道每份問卷有哪些必填題，是 Service 的 check 對照資料庫裡的題目設定，逐題檢查的。
-->

---
layout: default
---

# 練習 1：Postman 測試（續）

| 步驟 | 動作 | 預期結果 |
| --- | --- | --- |
| 5 | `POST /api/surveys/4/draft`（尚未開始） | **409** `SURVEY_NOT_OPEN` |
| 6 | `phone` 傳 `"123"`、`email` 傳 `"abc"` | **400**，訊息含「手機格式錯誤」「Email 格式錯誤」 |
| 7 | 必填的題目 1 不傳答案 | **400**，「你平常午餐吃什麼？」為必填 |

<div class="mt-2 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>驗證重點：</b> 步驟 3、4 證明「暫存是跟著瀏覽器（Cookie）走」；打開 MySQL 確認 <code>survey_responses</code> 沒有新增任何資料。
</div>

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
最後一定要打開 MySQL，執行 SELECT COUNT(*) FROM survey_responses，確認筆數沒有變。這樣才真正證明「暫存階段不寫資料庫」。
-->

---
layout: default
---

# 練習 2：確認送出，寫入資料庫

使用者在確認頁按下「送出」，才真正寫入資料庫。請實作後半段：

1. 建立 `SurveyResponse`、`ResponseAnswer` 兩個 Entity 與 `SurveyResponseRepository`（見下一頁）
2. `ResponseService.submit(surveyId, session)`：
   - 讀取 Session 的暫存（沒有 → 409 `NO_DRAFT`），並**重新執行 `check`**
   - 建立 `SurveyResponse`，每一題答案建立一筆 `ResponseAnswer`，**多選的答案以分號 `;` 串接**（`青菜;豆腐`），沒回答的選填題不存
   - 存進資料庫；**同一 Email 重複填寫 → 409 `ALREADY_RESPONDED`**
   - 成功後清除該問卷的 Session 暫存
3. `POST /api/surveys/{id}/submit`：回傳新作答紀錄的 id
4. 用 Postman 走完 暫存 → 讀取 → 送出，再用 MySQL 確認資料

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
練習 2 是整個作答流程的第二半，把資料真正寫進資料庫。

這一題有兩個重要的技術點。

第一是重複填寫的處理。需求規定同一個 Email 不能重複填寫同一份問卷。我們在 MySQL 課設計資料表時，已經加了 UNIQUE (survey_id, email) 這個約束，資料庫保證不會有兩筆一樣的資料。所以我們的程式有兩道防線：第一道，check 裡面先查一次，可以給使用者一個友善的訊息；第二道，如果兩個請求同時進來，兩個都通過了第一道，第二個寫入資料庫的時候，會違反唯一約束，丟出 DataIntegrityViolationException，我們把它接住，轉成同樣的 409 訊息。

第二是多選答案串接。資料庫的 answer_text 只有一個欄位，所以多選題的答案，用分號串接。這也是為什麼在儲存問卷的選項時，不允許選項本身包含分號：不然之後拆不回來。

大家先想想，這個方法要不要加 @Transactional？為什麼？
-->

---
layout: default
---

# 練習 2：解題提示與 Entity
### `entity/SurveyResponse.java`、`ResponseAnswer.java`

```java
@Entity
@Table(name = "survey_responses")
@Getter
@Setter
public class SurveyResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "survey_id")
    private Survey survey;

// ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
SurveyResponse 是作答紀錄，有作答者的基本資料，跟一個 List<ResponseAnswer> 作答明細，同樣用 cascade = ALL，存一筆作答紀錄，所有明細一起存。

user 這個欄位是 nullable，因為訪客不需要登入就可以填寫，這時 user_id 是 null。現在我們還沒有會員功能，所以先不設定它，第 44 章加了登入後，才會把登入者填進去。
-->

---
layout: default
---

# 練習 2：解題提示與 Entity（續）
### `entity/SurveyResponse.java`、`ResponseAnswer.java`

```java
// ... 接上一頁

    // 訪客免登入，所以可為 null
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;
    private String phone;
    private String email;
    private Integer age;
    private LocalDateTime submittedAt;

    @OneToMany(mappedBy = "response", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponseAnswer> answers = new ArrayList<>();
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
ResponseAnswer 是每題一筆的答案，同時關聯到 SurveyResponse 和 Question，answerText 存答案本身。
-->

---
layout: default
---

# 練習 2：解題提示與 Entity（續）
### `entity/SurveyResponse.java`、`ResponseAnswer.java`

```java
@Entity
@Table(name = "response_answers")
@Getter
@Setter
public class ResponseAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "response_id")
    private SurveyResponse response;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id")
    private Question question;

    private String answerText; // 多選以分號 ; 串接
}
```

```java
public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Integer> {
    boolean existsBySurveyIdAndEmail(Integer surveyId, String email);
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
Repository 只需要一個方法：existsBySurveyIdAndEmail。這是 Spring Data 的方法名稱查詢，SurveyId 對應到 survey.id 這個路徑，AndEmail 對應 email 欄位。方法名稱本身就是查詢，不需要寫任何 SQL。

提示：如果啟動時 Hibernate 的 validate 報錯，通常是欄位名稱跟資料庫對不上，回頭檢查 Entity 的屬性和資料表欄位。
-->

---
layout: default
---

# 練習 2：解答（submit）
### `service/ResponseService.java`、`SurveyController`

```java
    // ResponseService
    @Transactional
    public Integer submit(Integer surveyId, HttpSession session) {
        ResponseDTO dto = getDraft(surveyId, session);
        Survey survey = check(surveyId, dto);

        SurveyResponse r = new SurveyResponse();
        r.setSurvey(survey);
        r.setName(dto.getName().trim());
        r.setPhone(dto.getPhone());
        r.setEmail(dto.getEmail().trim().toLowerCase());
        r.setAge(dto.getAge());
        r.setSubmittedAt(LocalDateTime.now());

    // ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
submit 一步一步來：先從 Session 讀暫存，讀不到就是 409；再呼叫 check 重新檢查一次；然後建立 SurveyResponse，把基本資料複製進去；接著逐題建立 ResponseAnswer。

這裡用 String.join(";", values) 把多個值串起來。單選題、文字題只有一個值，串接的結果就是它自己，不需要特別判斷題型。
-->

---
layout: default
---

# 練習 2：解答（submit）（續）
### `service/ResponseService.java`、`SurveyController`

```java
        // ... 接上一頁

        Map<Integer, Question> questions = survey.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));
        for (AnswerDTO a : dto.getAnswers()) {
            List<String> values = cleanValues(a);
            if (values.isEmpty()) continue; // 選填題沒回答就不存
            ResponseAnswer ra = new ResponseAnswer();
            ra.setResponse(r);
            ra.setQuestion(questions.get(a.getQuestionId()));
            ra.setAnswerText(String.join(";", values)); // 多選以分號串接
            r.getAnswers().add(ra);
        }
        try {
            responseRepository.saveAndFlush(r);
        } catch (DataIntegrityViolationException e) {
            // 兩個人同時送出時，程式檢查會漏，UNIQUE(survey_id, email) 是最後防線

        // ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
沒回答的選填題，values 是空的，就直接 continue 跳過，不寫入資料庫。這樣後台看回饋的時候，沒答的題目就不會出現，也能區分「沒回答」和「回答空字串」。

saveAndFlush 而不是 save：save 只是把資料放到 JPA 的暫存區，等到交易結束才會真的送 SQL，那時候才發現違反唯一約束，例外會在方法之外丟出，try/catch 就接不到了。saveAndFlush 會立刻送出 SQL，違反約束的例外就會在 try 裡面被接到。
-->

---
layout: default
---

# 練習 2：解答（submit）（續）
### `service/ResponseService.java`、`SurveyController`

```java
    // ... 接上一頁

            throw new BizException(RspCode.ALREADY_RESPONDED);
        }
        draftService.clearResponse(session, surveyId);
        return r.getId();
    }
```

```java
@PostMapping("/api/surveys/{id}/submit")
public AppResponse<Map<String, Integer>> submit(@PathVariable("id") Integer id, HttpSession session) {
    return AppResponse.success(Map.of("responseId", responseService.submit(id, session)));
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
成功寫入之後，清除這份問卷的 Session 暫存，使用者按上一頁再重複送出，就會得到 NO_DRAFT，不會重複寫入。

方法上有 @Transactional：整筆作答紀錄跟所有答案，要嘛全部成功，要嘛全部失敗，不會留下只有作答者、沒有答案的殘缺資料。
-->

---
layout: default
---

# 練習 2：Postman 測試

| 步驟 | 動作 | 預期結果 |
| --- | --- | --- |
| 1 | 練習 1 的 `POST /api/surveys/2/draft`（`t1@example.com`） | 200 |
| 2 | `POST /api/surveys/2/submit` | 200，回傳 `{"responseId": 11}` |
| 3 | 再次 `POST /api/surveys/2/submit` | **409** `NO_DRAFT`（暫存已清除） |
| 4 | 重新暫存**同一個 Email**，再送出 | 暫存階段就 **409** `ALREADY_RESPONDED` |
| 5 | 直接送出（不經過暫存）：換一個沒有 Session 的 Cookie | **409** `NO_DRAFT` |

驗證資料庫：

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
步驟 1、2 是正常的流程。步驟 3 是為了驗證暫存被清除，這很重要，避免使用者在瀏覽器上按重新整理，造成重複送出。

步驟 4 有一個值得討論的細節：同一個 Email 已經填過，在暫存的時候就被擋下來了，因為 saveDraft 也呼叫 check，check 裡面有 existsBy 的查詢。這是給使用者更好的體驗：不用填完整份問卷，按下送出才發現填過了。
-->

---
layout: default
---

# 練習 2：Postman 測試（續）

```sql
SELECT r.id, r.name, r.email, a.question_id, a.answer_text
FROM survey_responses r JOIN response_answers a ON a.response_id = r.id
WHERE r.email = 't1@example.com';
-- 題目 2（多選）的 answer_text 應該是 青菜;豆腐
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>進階：</b>想驗證資料庫的最後防線？用兩個 Postman 分頁（兩個不同 Cookie）暫存<b>同一個 Email</b>，再依序送出，第二個送出也會得到 409，而且這時擋下它的是 <code>UNIQUE (survey_id, email)</code> 約束。
</div>

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
進階的驗證，是為了看到資料庫這道最後防線的效果。用兩個不同的 Cookie，代表兩個瀏覽器，各自暫存同一個 Email，此時兩個暫存階段都會通過，因為還沒有人送出。接著依序送出，第一個成功，第二個在 check 裡就會被擋下來。要真正觸發資料庫的唯一約束，需要兩個請求「同時」進入 submit，用 Postman 不容易做到，但是原理是一樣的：如果程式的檢查有漏洞，資料庫還會擋住。
-->

---
layout: default
---

# 練習 3：後台編輯問卷的暫存（延伸）

後台新增 / 編輯問卷分三步：**基本資料 → 題目 → 確認頁**。前兩步的資料都先暫存在 Session，到確認頁才寫入資料庫（「僅儲存」或「儲存並發佈」）。請實作：

1. `DraftService` 加入後台版本的存取方法（key 固定為 `"adminSurveyDraft"`）
2. `POST /api/admin/survey-draft`：`@Valid` 驗證後存入 Session（`SurveyDTO` 可以帶 `id`，代表編輯既有問卷）
3. `GET /api/admin/survey-draft`：讀出暫存，給確認頁使用
4. `POST /api/admin/survey-draft/commit?publish=true|false`：從 Session 取出，呼叫 `surveyService.save(dto, publish)` 寫入，成功後清除暫存；沒有暫存 → 409 `NO_DRAFT`
5. Postman：暫存 → 讀取 → `commit?publish=false`（資料庫 `published = 0`）→ 再暫存一次 → `commit?publish=true`（`published = 1`）

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這是選做的延伸練習，但很值得做，因為它是後台新增問卷的核心流程，而且它跟前台作答暫存幾乎是一模一樣的套路。

有兩個地方要注意：

第一，後台編輯的暫存，key 是固定的字串，因為同一個管理員同時只會編輯一份問卷，不需要跟問卷 id 綁定。

第二，commit 的 publish 參數，決定要不要發佈：確認頁有兩個按鈕，「僅儲存」寫進資料庫但是不發佈，前台看不到；「儲存並發佈」寫進資料庫並且發佈，出現在前台列表頁。這兩個按鈕，對應的就是 publish=false 和 publish=true。

還記得第 37 章的 save 方法嗎？它接收 publish 參數，也會檢查問卷是不是可以編輯。我們現在只是換了資料的來源：從 Session 來，而不是直接從請求 Body 來。
-->

---
layout: default
---

# 練習 3：解答

```java
@Service
public class DraftService {

    private static final String ADMIN_SURVEY_KEY = "adminSurveyDraft";

    // ... 前台作答暫存的部分（練習 1）

    public void saveSurvey(HttpSession session, SurveyDTO dto) {
        session.setAttribute(ADMIN_SURVEY_KEY, dto);
    }

    public SurveyDTO getSurvey(HttpSession session) {
        return (SurveyDTO) session.getAttribute(ADMIN_SURVEY_KEY);
    }

    public void clearSurvey(HttpSession session) {
        session.removeAttribute(ADMIN_SURVEY_KEY);
    }
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
DraftService 的後台版本，跟前台幾乎一樣，只是 key 是固定的字串，不需要問卷 id。
-->

---
layout: default
---

# 練習 3：解答（續）

```java
// AdminSurveyController
    @PostMapping("/survey-draft")
    public AppResponse<Void> saveDraft(@Valid @RequestBody SurveyDTO dto, HttpSession session) {
        draftService.saveSurvey(session, dto);
        return AppResponse.success();
    }

    @GetMapping("/survey-draft")
    public AppResponse<SurveyDTO> getDraft(HttpSession session) {
        return AppResponse.success(draftService.getSurvey(session));
    }

// ... 見下一頁
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
Controller 的三個方法：POST 存入暫存，前面加 @Valid，所以基本資料跟題目的格式在存進 Session 之前，就已經被檢查過了；GET 讀出暫存，給確認頁顯示；commit 是最後一步，從 Session 取出，呼叫 surveyService.save，寫進資料庫，然後清除暫存。

commit 這個路徑，用 POST 而不是 GET，因為它會改變伺服器狀態，符合 REST 的語意。publish 是必填的參數，沒有預設值，強迫呼叫的人明確表態：要發佈還是不發佈。
-->

---
layout: default
---

# 練習 3：解答（續）

```java
    // ... 接上一頁

    /** 確認頁按「僅儲存」(publish=false) 或「儲存並發佈」(publish=true) */
    @PostMapping("/survey-draft/commit")
    public AppResponse<SurveyDTO> commit(@RequestParam(name = "publish") boolean publish, HttpSession session) {
        SurveyDTO dto = draftService.getSurvey(session);
        if (dto == null) throw new BizException(RspCode.NO_DRAFT);
        SurveyDTO saved = surveyService.save(dto, publish);
        draftService.clearSurvey(session);
        return AppResponse.success(saved);
    }
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
⚠️ 這裡有個設計上的取捨：後台的暫存，只存在伺服器的 Session 記憶體裡。如果管理員編輯到一半，伺服器重新啟動，暫存就會遺失。對於課程專案這樣就夠了，實務上如果資料很重要，可以改存資料庫，或是用 Redis 共享 Session。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| Session 存在的原因 | HTTP 無狀態，需要額外機制記錄使用者狀態 |
| JSESSIONID | 瀏覽器持有的 Cookie，用來識別伺服器端的 Session |
| 取得 HttpSession | 在 Controller 方法參數宣告 `HttpSession`，Spring Boot 自動注入 |
| import 路徑 | Spring Boot 3.x / 4.x：`jakarta.servlet.http.HttpSession` |
| 核心 API | `setAttribute` / `getAttribute` / `invalidate` / `getId` |
| 逾時設定 | `server.servlet.session.timeout=30m` |
| 登出實作 | 呼叫 `session.invalidate()`，不能只刪除 attribute |
| 問卷系統的應用 | 作答、後台編輯都先放 Session，確認頁才寫資料庫；key 要含問卷 id，放進去的物件要 `Serializable` |
| 兩道防線 | 送出時重新檢查；重複填寫由 `UNIQUE(survey_id, email)` 當最後防線 |

<!--
今天的重點：

第一，HTTP 是無狀態的，Session 是在這個基礎上建立的「使用者暫存空間」，靠 JSESSIONID Cookie 識別身份。

第二，Spring Boot 中使用 HttpSession 非常簡單，直接在方法參數宣告就能取得，不需要額外設定。

第三，Spring Boot 3.x / 4.x 的 import 是 jakarta.servlet.http.HttpSession，這個一定要記住。

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
