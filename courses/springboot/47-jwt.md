---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: JWT 認證
routeAlias: ch47
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
    JWT 認證
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「不靠伺服器記憶，讓 Token 自帶通行證」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第四十七章。

上一章我們請了警衛，用的證件是帳號和密碼，而且每一次請求都要帶。

今天要換一種證件：一張蓋了鋼印的通行證。它的名字叫做 JWT。今天繼續使用 school 專案，接著上一章的程式往下改。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **為什麼需要新的證件？** 帳號密碼和號碼牌，各有什麼不方便
- **JWT 是什麼？** 一張自己帶著資料、蓋了鋼印的通行證
- **程式怎麼寫？** 登入時發證，之後每個請求驗證

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，為什麼需要新的證件。上一章的帳號密碼，和第四十二章的號碼牌，各有什麼不方便。

（下一步）第二，JWT 是什麼。先劇透：它是一張自己帶著資料、蓋了鋼印的通行證。

（下一步）第三，程式怎麼寫。分成兩件事：登入的時候發證，之後每個請求進來的時候驗證。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 兩種舊證件的麻煩

<!--
先看目前有的兩種做法，各有什麼問題。
-->

---

# 每次都出示帳號密碼

上一章的 Basic Auth：每個請求都帶著帳號和密碼。

<v-clicks>

- 密碼在網路上**傳了一次又一次**，被偷看到的機會變多
- 前端必須把密碼**一直留著**，才能每次都帶
- 伺服器每次都要查資料庫、跑一次攪碎機核對，比較慢

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 比較好的做法：密碼<b>只在登入的時候出示一次</b>。登入成功後換一張別的證件，之後都用那張證件。
</div>

</v-click>

<!--
上一章的 Basic Auth，每個請求都帶著帳號和密碼。它很簡單，但是有幾個缺點。

（下一步）密碼在網路上傳了一次又一次。傳越多次，被偷看到的機會越多。

（下一步）前端必須把密碼一直留著，才能每次都帶。密碼放在前端越久，越危險。

（下一步）伺服器每次都要查資料庫、跑一次攪碎機來核對。攪碎機是故意設計得比較慢的，每個請求都跑一次，很浪費。

（下一步）比較好的做法是：密碼只在登入的時候出示一次。登入成功後，換一張別的證件，之後都用那張證件。
-->

---

# 號碼牌只有一個櫃台認得

第四十二章的 Session 就是「登入後換一張證件」。但是學校變大之後：

<v-clicks>

- 學校開了第二個校區，有 A、B 兩個櫃台（兩台伺服器）
- Tom 在 A 櫃台登入，置物櫃開在 **A 櫃台後面**
- 下一次他被分到 B 櫃台。B 櫃台找不到這個號碼的置物櫃：「請問你是哪一位？」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ Session 的資料放在<b>某一台伺服器</b>上。伺服器一多，每一台都要查得到同一份資料才行，這件事做起來很麻煩。
</div>

</v-click>

<!--
第四十二章的 Session，其實就是登入後換一張證件：號碼牌。它解決了剛才的問題。但是學校變大之後，出現新的問題。

（下一步）學校開了第二個校區，有 A、B 兩個櫃台。在程式的世界，就是有兩台伺服器一起服務。使用者多的網站都是這樣。

（下一步）Tom 在 A 櫃台登入。置物櫃開在 A 櫃台後面。

（下一步）下一次他被分到 B 櫃台。B 櫃台看了號碼牌，找不到這個號碼的置物櫃。只好問：請問你是哪一位？

（下一步）問題的根源是：Session 的資料放在某一台伺服器上。伺服器一多，每一台都要查得到同一份資料才行。這件事做得到，但是很麻煩。
-->

---

# 新的做法：蓋了鋼印的通行證

<PassCard />

<!--
學校想了一個新的做法。

Tom 到 A 櫃台，報上帳號和密碼。

（下一步）A 櫃台核對之後，發一張通行證給他。和號碼牌不一樣的地方是：資料直接寫在證上。姓名 Tom、身分學生、有效期限到今天下午五點。最後蓋上學校的鋼印。

（下一步）Tom 拿著通行證到 B 櫃台。B 櫃台只要檢查鋼印是不是學校的。鋼印正確，就相信證上寫的資料。不用查任何置物櫃，因為資料就在證上。

（下一步）那如果有人把證上的「學生」塗改成「老師」呢？鋼印是照著原本的內容蓋的。內容一改，鋼印就對不上了，櫃台會拒絕。

所以這張通行證有兩個特點：資料自己帶著，而且改不了。
-->

---

# 對照到程式

<PassCard terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>JWT</b>（JSON Web Token）：一段文字，裡面有使用者的資料，加上伺服器的簽章。Token 這個字的意思是「代表身分的憑證」。
</div>

</v-click>

<!--
同一張圖，換成程式的名字。

（下一步）通行證，叫做 JWT。A 櫃台發證，是登入的 API：POST /auth/login。證上的姓名、身分、期限，各有一個英文縮寫，等一下會介紹。鋼印叫做 Signature，中文是簽章。

（下一步）B 櫃台可以是任何一台伺服器。只要它有同一顆鋼印，就能檢查。

（下一步）鋼印對不上的時候，回覆 401。

（下一步）JWT 的全名是 JSON Web Token。它是一段文字，裡面有使用者的資料，加上伺服器的簽章。Token 這個字的意思是：代表身分的憑證。之後我們也會直接說 Token。
-->

---

# 整理：號碼牌和通行證

<Pairs left="號碼牌（Session）" right="通行證（JWT）" sign="vs" rows="cabinet,資料放在櫃台後面的置物櫃=card,資料寫在證上，自己帶著|what,只有開置物櫃的那個櫃台認得=ok,有鋼印的櫃台都認得|no,櫃台要替每個人保管東西=ok,櫃台什麼都不用保管|ok,想作廢：把置物櫃清空就好=what,發出去就收不回來，只能等它過期" />

<!--
把兩種證件放在一起比較。

（下一步）號碼牌的資料，放在櫃台後面的置物櫃。通行證的資料寫在證上，自己帶著。

（下一步）號碼牌只有開置物櫃的那個櫃台認得。通行證只要是有鋼印的櫃台都認得。

（下一步）用號碼牌，櫃台要替每個人保管東西。用通行證，櫃台什麼都不用保管。這種做法延續了 HTTP 無狀態的特性。

（下一步）最後一點是通行證的缺點。號碼牌想作廢，把置物櫃清空就好。通行證發出去就收不回來，只能等它過期。所以有效期限不能設太長。

兩種做法沒有誰一定比較好。傳統網站常用 Session，手機 App 和前後端分離的系統常用 JWT。
-->

---

# 想一想

<Poll question="B 櫃台沒有查任何置物櫃，為什麼還是敢相信通行證上寫的「身分：學生」？" options="因為 Tom 看起來很老實|因為證上有學校的鋼印，而且內容一改鋼印就對不上|因為 B 櫃台打電話問過 A 櫃台|因為通行證是加密的，沒有人看得懂" answer="2" />

<!--
來想一題。

B 櫃台沒有查任何置物櫃，為什麼還是敢相信通行證上寫的「身分：學生」？

（等大家作答）

（下一步）答案是：因為證上有學校的鋼印，而且內容一改，鋼印就對不上。

請特別注意第四個選項是錯的。通行證沒有加密，上面的字誰都看得懂。它靠的是鋼印，不是保密。這一點等一下會再說明。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 通行證長什麼樣子

<!--
來看 JWT 實際的樣子。
-->

---

# 一段文字，用兩個點分成三段

<UrlParts parts="eyJhbGciOiJI…;;Header;;證件的種類;;第一段是 Header，說明這是哪一種證件、鋼印是用什麼方法蓋的||.eyJzdWIiOiJ0b20i…;;Payload;;證上寫的資料;;第二段是 Payload，證上寫的資料：是誰、什麼時候到期||.Gt5rBb0rmOvF…;;Signature;;鋼印;;第三段是 Signature，伺服器用密鑰算出來的簽章，也就是鋼印" />

<!--
JWT 是一段很長的文字。仔細看，中間有兩個點，把它分成三段。

（下一步）第一段叫做 Header。說明這是哪一種證件、鋼印是用什麼方法蓋的。這一段我們不用管。

（下一步）第二段叫做 Payload。就是證上寫的資料：這個人是誰、什麼時候到期。

（下一步）第三段叫做 Signature，簽章，也就是鋼印。它是伺服器用一把密鑰，照著前兩段的內容算出來的。

這三段看起來都是亂碼，但是前兩段其實只是換了一種寫法，任何人都可以轉回來看。
-->

---

# Payload：證上寫了什麼

把第二段轉回來，是一個 JSON：

```json
{
  "sub": "tom",
  "iat": 1794888214,
  "exp": 1794891814
}
```

<v-clicks>

- `sub`（subject）：這張證是誰的。我們放帳號名稱
- `iat`（issued at）：什麼時候發的
- `exp`（expiration）：什麼時候到期。過了這個時間，證就失效

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ Payload <b>沒有加密</b>，任何人拿到 Token 都看得到內容（把 Token 貼到 jwt.io 網站就能看）。所以<b>絕對不要把密碼放進去</b>。
</div>

</v-click>

<!--
把第二段轉回來，是一個 JSON。

（下一步）sub，是 subject 的縮寫，代表這張證是誰的。我們放帳號名稱。

（下一步）iat，是 issued at 的縮寫，什麼時候發的。

（下一步）exp，是 expiration 的縮寫，什麼時候到期。過了這個時間，證就失效。時間是一個很大的數字，它是從 1970 年開始算的秒數，程式會自己換算。

這些欄位的名字是 JWT 規定好的。我們也可以加自己的欄位，例如身分，練習的時候會做。

（下一步）很重要的一點：Payload 沒有加密。任何人拿到 Token，都看得到內容。有一個網站叫 jwt.io，把 Token 貼上去就能看。所以絕對不要把密碼，或是其他不能公開的資料放進去。
-->

---

# Signature：為什麼改不了

<v-clicks>

- 伺服器有一把**密鑰**（一串只有伺服器知道的文字），這就是那顆鋼印
- 發證時：用密鑰，照著 Header 和 Payload 的內容算出簽章
- 驗證時：用同一把密鑰再算一次，和 Token 上的簽章比對
- 內容被改過 → 算出來的簽章不一樣 → 拒絕

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 沒有密鑰的人，算不出正確的簽章。所以<b>密鑰絕對不能外流</b>。密鑰一外流，任何人都能自己做通行證。
</div>

</v-click>

<!--
再來看第三段，簽章。為什麼有了它，內容就改不了？

（下一步）伺服器有一把密鑰。它是一串只有伺服器知道的文字。這就是故事裡的那顆鋼印。

（下一步）發證的時候，伺服器用密鑰，照著 Header 和 Payload 的內容，算出一個簽章，放在第三段。

（下一步）驗證的時候，伺服器用同一把密鑰，照著收到的內容再算一次，然後和 Token 上的簽章比對。

（下一步）如果內容被改過，算出來的簽章就會不一樣。伺服器就拒絕。

（下一步）沒有密鑰的人，算不出正確的簽章。所以密鑰絕對不能外流。密鑰一外流，任何人都能自己做通行證，想當老師就當老師。
-->

---

# 想一想

<Poll question="下面哪一樣東西，可以放進 JWT 的 Payload？" options="使用者的密碼|使用者的帳號名稱|伺服器的密鑰|信用卡號碼" answer="2" />

<!--
來想一題。

下面哪一樣東西，可以放進 JWT 的 Payload？

（等大家作答）

（下一步）答案是：使用者的帳號名稱。

Payload 是任何人都看得到的。密碼、密鑰、信用卡號碼，都不能放。帳號名稱和身分這一類的資料可以放。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 發證的工具：JwtUtil

<!--
來寫程式。先準備發證和驗證的工具。
-->

---

# 加入依賴，準備密鑰

`build.gradle`：

```groovy
implementation 'io.jsonwebtoken:jjwt-api:0.13.0'
runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.13.0'
runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.13.0'
```

`application.properties`：

```properties
jwt.secret=school-project-jwt-secret-key-please-change-me-2026
```

<v-clicks>

- `jjwt` 是幫我們產生和檢查 JWT 的套件，要加三行
- `jwt.secret` 是密鑰，自己取。**至少要 32 個英文字或數字**，太短會出錯

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 這裡為了練習，把密鑰寫在設定檔。正式的系統不能這樣做，更不能把密鑰上傳到 GitHub。
</div>

</v-click>

<!--
第一步，在 build.gradle 加入依賴。這個套件叫做 jjwt，它幫我們產生和檢查 JWT。要加三行，版本都一樣。加完記得按 Gradle 的重新整理。

第二步，在 application.properties 加一行 jwt.secret。這就是密鑰。

（下一步）jjwt 要加三行，第一行是寫程式的時候用的，後面兩行是執行的時候用的，所以開頭是 runtimeOnly。

（下一步）密鑰的內容自己取。但是至少要三十二個英文字或數字。太短的話，程式啟動後一發證就會出錯，因為太短的密鑰不安全。

（下一步）這裡為了練習，把密鑰寫在設定檔。正式的系統不能這樣做，更不能把密鑰上傳到 GitHub。正式的做法是放在伺服器的環境設定裡，這個部分超出今天的範圍。
-->

---

# JwtUtil：拿到密鑰

新增一個資料夾 `security`，在裡面新增 `JwtUtil`：

```java {1-2|4-5|7-9}
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
```

<v-clicks>

- `@Component`：交給 Spring 管理，別的類別才能用 `@Autowired` 拿到它
- `@Value`：從設定檔讀出密鑰（第九章學過）
- `getKey()`：把文字變成 jjwt 看得懂的「鑰匙」物件。這一行請照抄

</v-clicks>

<!--
新增一個資料夾，叫做 security。在裡面新增一個類別 JwtUtil。Util 是工具的意思。

（下一步）@Component，把它交給 Spring 管理。這樣別的類別才能用 @Autowired 拿到它。

（下一步）@Value，從設定檔讀出密鑰。這是第九章學過的寫法。

（下一步）getKey 這個方法，把密鑰的文字變成 jjwt 看得懂的鑰匙物件。這一行不用理解細節，請照抄。等一下發證和驗證都會用到它。
-->

---

# 發證：generateToken

<CodeSteps>

```java {2-3|4-5|6|7|8|9}
public String generateToken(String username) {
    Date now = new Date();
    Date expireAt = new Date(now.getTime() + 60 * 60 * 1000);
    return Jwts.builder()
            .subject(username)
            .issuedAt(now)
            .expiration(expireAt)
            .signWith(getKey())
            .compact();
}
```

- 現在的時間，和一小時後的時間（單位是毫秒：60 分 × 60 秒 × 1000）
- `subject`：這張證是誰的（`sub`）
- `issuedAt`：什麼時候發的（`iat`）
- `expiration`：什麼時候到期（`exp`）
- `signWith`：用密鑰蓋鋼印
- `compact`：組成最後那一段文字

</CodeSteps>

<!--
在 JwtUtil 加第一個方法，generateToken，發證。給它帳號名稱，回傳一段 Token 文字。

（下一步）先準備兩個時間。now 是現在。expireAt 是一小時後。getTime 拿到的單位是毫秒，所以一小時是六十分乘六十秒乘一千。

（下一步）用 Jwts.builder() 開始，一項一項填。subject，這張證是誰的，對應 Payload 的 sub。

（下一步）issuedAt，什麼時候發的，對應 iat。

（下一步）expiration，什麼時候到期，對應 exp。

（下一步）signWith，用密鑰蓋鋼印。

（下一步）compact，組成最後那一段有兩個點的文字。
-->

---

# 驗證：getUsername

<CodeSteps>

```java {2-4|5|6-7}
public String getUsername(String token) {
    return Jwts.parser()
            .verifyWith(getKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
}
```

- 準備一台檢查機，告訴它要用哪一把密鑰
- 檢查 Token：**鋼印對不對、有沒有過期**。有問題就丟出例外
- 檢查通過，從 Payload 拿出 `sub`，也就是帳號名稱

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 所以這個方法做了兩件事：檢查這張證是不是真的，然後告訴我們它是誰的。只要有拿到帳號名稱，就代表檢查通過了。
</div>

</v-click>

<!--
第二個方法，getUsername。給它一段 Token，回傳這張證是誰的。

（下一步）Jwts.parser() 準備一台檢查機。verifyWith 告訴它要用哪一把密鑰。build() 完成。

（下一步）parseSignedClaims，檢查 Token。它會檢查兩件事：鋼印對不對，以及有沒有過期。任何一項有問題，它就丟出例外。

（下一步）檢查通過的話，getPayload 拿到證上的資料，getSubject 拿出 sub，也就是帳號名稱。

（下一步）所以這個方法做了兩件事：檢查這張證是不是真的，然後告訴我們它是誰的。只要有拿到帳號名稱，就代表檢查通過了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 登入：核對密碼，發出通行證

<!--
工具準備好了。接著寫登入的 API。
-->

---

# 兩個 DTO，和 AccountService 的 login()

```java
@Getter @Setter
public class LoginRequest { private String username; private String password; }

@Getter @Setter
public class LoginResponse { private String token; }
```

<CodeSteps>

```java {2|3-5|6-8|9}
public String login(LoginRequest request) {
    Account account = accountRepository.findByUsername(request.getUsername());
    if (account == null) {
        return null;
    }
    if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
        return null;
    }
    return jwtUtil.generateToken(account.getUsername());
}
```

- 用帳號名稱到資料庫查
- 沒有這個帳號：回傳 `null`
- 密碼核對不過：也回傳 `null`
- 都通過：發一張通行證

</CodeSteps>

<!--
先在 dto 資料夾新增兩個類別。LoginRequest 是前端送進來的帳號和密碼。LoginResponse 是回給前端的，只有一個欄位 token。為了省空間，這裡把欄位寫在同一行，實際上請照平常的寫法分行。

然後在上一章的 AccountService 裡，用 @Autowired 多拿一個 JwtUtil，再加一個 login 方法。

（下一步）用帳號名稱到資料庫查。

（下一步）沒有這個帳號，回傳 null。

（下一步）有這個帳號，就核對密碼。用的是上一章學的 matches：前面放使用者輸入的密碼，後面放資料庫裡的亂碼。前面有一個驚嘆號，意思是「如果核對不過」。核對不過也回傳 null。

（下一步）兩關都通過，就呼叫 JwtUtil 發一張通行證，回傳 Token。

這裡刻意讓「沒有這個帳號」和「密碼錯誤」得到一樣的結果。這樣想亂試的人，分不出是帳號錯還是密碼錯。
-->

---

# AuthController：POST /auth/login

```java {7-8|9-12|13-15}
@RestController
public class AuthController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        String token = accountService.login(request);
        if (token == null) {
            return ResponseEntity.status(401).build();
        }
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        return ResponseEntity.ok(response);
    }
}
```

<!--
在 controller 資料夾新增 AuthController。

（下一步）POST /auth/login，用 @RequestBody 接收帳號和密碼。

（下一步）交給 AccountService。如果拿到的是 null，代表帳號或密碼不對，回覆 401。後面的 build() 意思是不帶內容。

（下一步）拿到 Token 的話，把它放進 LoginResponse，回覆 200。

到這裡，發證的部分完成了。接下來是另一半：每個請求進來的時候，怎麼檢查通行證。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 驗證：在警衛那一排加一關

<!--
上一章最後提到，警衛其實是一排關卡。今天要在這一排裡，加一個我們自己寫的關卡。
-->

---

# 這一關要做什麼

前端之後的每個請求，都要在 Header 帶上通行證：

```text
Authorization: Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ0b20i…
```

<v-clicks>

1. 看請求有沒有 `Authorization` 這個 Header，而且是 `Bearer ` 開頭
2. 把後面的 Token 拿出來，交給 `JwtUtil` 檢查
3. 檢查通過：告訴警衛「這個人是 tom，身分是學生」
4. 不管有沒有通過，都把請求**交給下一關**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>Bearer</code> 的意思是「持有這張證的人」。它和 Token 之間有<b>一個空格</b>，少了就認不出來。
</div>

</v-click>

<!--
先說明前端要怎麼帶通行證。和上一章一樣，放在 Authorization 這個 Header 裡。內容是 Bearer、一個空格，後面接 Token。

我們要寫的這一關，做四件事。

（下一步）第一，看請求有沒有 Authorization 這個 Header，而且是 Bearer 加空格開頭。

（下一步）第二，把後面的 Token 拿出來，交給 JwtUtil 檢查。

（下一步）第三，檢查通過的話，告訴警衛：這個人是 tom，身分是學生。

（下一步）第四，不管有沒有通過，都把請求交給下一關。沒帶證的人不是在這一關被擋的。這一關只負責「認人」。後面的關卡發現沒有人被認出來，才會依照規則決定要不要擋。這樣公開的網址才能正常使用。

（下一步）Bearer 這個字的意思是：持有這張證的人。它和 Token 之間有一個空格，少了就認不出來。這是最常見的錯誤。
-->

---

# JwtAuthFilter（上）：拿出 Token

在 `security` 資料夾新增 `JwtAuthFilter`：

```java {1-2|4-7|9-11|12-14}
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AccountService accountService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            // 下一頁：檢查 Token
        }
        filterChain.doFilter(request, response);
    }
}
```

<!--
在 security 資料夾新增 JwtAuthFilter。Filter 就是關卡。

（下一步）@Component，加上 extends OncePerRequestFilter。extends 是繼承，意思是：我是一個關卡，而且每個請求只會經過我一次。

（下一步）用 @Autowired 拿到兩個幫手：JwtUtil 和上一章的 AccountService。

（下一步）關卡要做的事，寫在 doFilterInternal 這個方法裡。它的參數很長，請讓 Eclipse 幫忙產生：在類別裡按右鍵，選 Source，再選 Override/Implement Methods，勾選這個方法。參數有三個：request 是請求，response 是回應，filterChain 是後面的關卡。

（下一步）先從請求拿出 Authorization 這個 Header。如果有，而且是 Bearer 加空格開頭，就用 substring(7) 把前面七個字去掉。Bearer 是六個字，加上一個空格，一共七個。剩下的就是 Token。

最後一行，filterChain.doFilter，把請求交給下一關。它寫在 if 的外面，所以不管有沒有帶 Token 都會執行。這一行如果忘了寫，所有請求都會卡在這裡，得不到回應。
-->

---

# JwtAuthFilter（下）：檢查，然後告訴警衛

<CodeSteps>

```java {1,8-10|2|3|4-6|7}
try {
    String username = jwtUtil.getUsername(token);
    UserDetails user = accountService.loadUserByUsername(username);
    UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    // 上面兩行是同一句
    SecurityContextHolder.getContext().setAuthentication(authentication);
} catch (Exception e) {
    // 通行證有問題：什麼都不做，當作沒有帶
}
```

- 整段包在 `try` 裡：通行證過期或被改過時會丟出例外，接住它，不要讓程式出錯
- 檢查 Token，拿到帳號名稱
- 用上一章的名冊，查出這個人的資料和身分
- 做一張「這個人已經通過認證」的紀錄
- 把紀錄交給警衛。後面的關卡和 Controller 就知道現在是誰了

</CodeSteps>

<!--
if 裡面的內容。

（下一步）整段包在 try 和 catch 裡。因為通行證過期、或是被改過的時候，getUsername 會丟出例外。我們把它接住，什麼都不做，當作這個人沒有帶證。如果不接住，使用者會看到 500 的錯誤，而不是 401。

（下一步）第一行，請 JwtUtil 檢查 Token，拿到帳號名稱。

（下一步）第二行，用上一章寫的名冊 loadUserByUsername，查出這個人的資料和身分。

（下一步）接下來做一張紀錄，意思是：這個人已經通過認證。類別名稱很長，叫 UsernamePasswordAuthenticationToken。三個參數：這個人的資料、密碼、身分。密碼填 null，因為已經用通行證驗證過，不需要密碼了。

（下一步）最後把紀錄交給警衛。SecurityContextHolder 是警衛放紀錄的地方。放進去之後，後面負責授權的關卡，還有 Controller 的 Authentication 參數，就知道現在是誰了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# 修改警衛的守則

<!--
新的關卡寫好了，但是還沒有排進隊伍裡。要回到 SecurityConfig 修改守則。
-->

---

# SecurityConfig 改四個地方

<CodeSteps>

```java {2|5|9|10|11|all}
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/register", "/auth/login", "/error").permitAll()
            // 其他規則和上一章一樣
            .anyRequest().authenticated()
        )
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
        .csrf(csrf -> csrf.disable());
    return http.build();
}
```

- 方法的參數多一個 `JwtAuthFilter`，Spring 會把我們寫的關卡交進來
- 登入的網址要公開；`/error` 也要公開（理由見講稿）
- 不使用 Session：伺服器不替任何人保管東西
- 把我們的關卡排進隊伍
- 沒有通過認證的請求，回覆 401
- 原本的 `.httpBasic(...)` 刪掉了：不再接受每次帶帳號密碼

</CodeSteps>

<!--
回到 SecurityConfig。攪碎機的 @Bean 不用動，只改 securityFilterChain 這個方法。

（下一步）方法的參數多一個 JwtAuthFilter。和上一章的寫法一樣，寫在參數，Spring 就會把我們寫的關卡交進來。

（下一步）規則的第一條，除了註冊，再加上登入的網址 /auth/login。登入一定要公開，道理和註冊一樣。

同一行還多了 /error。權限不夠的時候，Spring 會把請求轉到 /error 這個網址，由它產生錯誤訊息。這次轉送不會再經過我們的通行證關卡，所以 /error 如果沒有公開，就會被當成「沒帶通行證」，學生刪資料得到的就變成 401，而不是應該的 403。上一章用帳號密碼時沒有這個問題，換成通行證才要加。其他規則都和上一章相同。

（下一步）sessionManagement 這一行，設定成 STATELESS，無狀態。意思是不使用 Session，伺服器不替任何人保管東西。

（下一步）addFilterBefore，把我們的關卡排進隊伍。後面那個很長的類別名稱，是 Spring Security 原本就有的一個關卡。這一行的意思是：排在它的前面。請照抄。

（下一步）exceptionHandling 這一行，設定沒有通過認證的請求要回覆 401。如果沒有寫這一行，沒帶通行證的人會得到 403，容易和「權限不夠」搞混。

（下一步）最後，原本的 httpBasic 那一行刪掉了。從現在開始，不再接受每次帶帳號密碼的方式。
-->

---

# 用 Postman 測試

<v-clicks>

1. `POST /auth/login`，Body 是 `{"username":"tom","password":"tom123"}` → 200，回傳 `token`
2. 複製那一長串 Token（不含引號）
3. 開一個新請求 `GET /students`，Authorization 頁籤選 **Bearer Token**，貼上 Token → **200**
4. 不帶 Token 送 `GET /students` → **401**
5. 帶 Token 送 `DELETE /students/1` → **403**（tom 是學生）
6. 把 Token 隨便改掉中間幾個字再送 → **401**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
🔍 把 Token 貼到 jwt.io 看看，右邊會顯示 Payload 的內容：<code>sub</code> 是 tom，還有發證和到期的時間。
</div>

</v-click>

<!--
重新啟動，用 Postman 測試。帳號用上一章註冊的 tom。

（下一步）第一步，POST /auth/login。Body 選 raw、JSON，填帳號和密碼。得到 200，回傳的 JSON 裡有 token。

（下一步）第二步，複製那一長串 Token。不要複製到前後的引號。

（下一步）第三步，開一個新請求 GET /students。Authorization 頁籤選 Bearer Token，把 Token 貼上去。Postman 會自動幫我們加上 Bearer 和空格。得到 200。

（下一步）第四步，Authorization 選 No Auth，不帶 Token，送 GET /students。得到 401。

（下一步）第五步，帶著 Token 送 DELETE /students/1。得到 403。因為 tom 是學生。上一章寫的規則都還在運作。

（下一步）第六步，把 Token 中間隨便改掉幾個字，再送一次。得到 401。鋼印對不上了。

（下一步）最後可以把 Token 貼到 jwt.io 這個網站看看。右邊會顯示 Payload 的內容。這也再提醒一次：Token 裡的資料，任何人都看得到。
-->

---

# 整個流程走一次

<Flow nodes="前端:Tom|AuthController:發證|JwtAuthFilter:驗證|StudentController:櫃台" steps="1>2:POST /auth/login（帳號＋密碼）|2>1:200，token|1>3:GET /students（Bearer token）|3>4:鋼印正確，這位是 tom|4>1:200，學生資料" />

<!--
把整個流程走一次。

（下一步）Tom 送出 POST /auth/login，帶著帳號和密碼。這是密碼唯一出現的一次。

（下一步）AuthController 核對之後，回覆 200 和一張通行證。

（下一步）之後 Tom 要查學生資料，送出 GET /students，Header 帶著通行證。

（下一步）請求先經過 JwtAuthFilter。它檢查鋼印，確認這位是 tom，然後放行。

（下一步）請求到達 StudentController，回覆學生資料。

從第三步開始，都不需要密碼，伺服器也不用保管任何東西。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
# 補充：使用 JWT 要注意的事

<!--
最後補充幾個觀念。這一段先聽過、有印象就可以。
-->

---

# 補充：四個安全注意事項

<v-clicks>

- **密鑰要夠長，而且不能外流**：不寫死在程式裡，不上傳到 GitHub
- **有效期限要短**：通行證收不回來，被偷走的話，至少很快就會過期
- **Payload 不放機密**：任何人都看得到
- **一定要用 HTTPS**：通行證在路上被看到，就等於被偷走

</v-clicks>

<!--
使用 JWT 有四個注意事項。

（下一步）第一，密鑰要夠長，而且不能外流。不寫死在程式裡，不上傳到 GitHub。

（下一步）第二，有效期限要短。通行證發出去就收不回來。被偷走的話，至少很快就會過期。

（下一步）第三，Payload 不放機密。任何人都看得到。

（下一步）第四，一定要用 HTTPS，也就是加密的連線。通行證在路上被別人看到，就等於被偷走。誰拿著它，伺服器就認為誰是 Tom。
-->

---

# 補充：期限很短，不就要一直重新登入？

<v-clicks>

- 實務上會發**兩張證**：
- **Access Token**：平常用的通行證，期限很短（例如 15 分鐘）
- **Refresh Token**：專門用來「換新的通行證」，期限很長（例如 7 天），而且伺服器會記在資料庫
- 通行證過期時，前端拿 Refresh Token 換一張新的，使用者不用重新輸入密碼
- 想讓某個人強制登出：把資料庫裡他的 Refresh Token 刪掉

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這個機制叫做 <b>Refresh Token</b>。今天先知道有這個做法，之後做專題需要時再深入。
</div>

</v-click>

<!--
有效期限要短，那使用者不就要一直重新登入嗎？

（下一步）實務上會發兩張證。

（下一步）第一張叫 Access Token，就是我們今天做的、平常用的通行證。期限很短，例如十五分鐘。

（下一步）第二張叫 Refresh Token。它不能用來呼叫一般的 API，專門用來換新的通行證。期限很長，例如七天。而且伺服器會把它記在資料庫裡。

（下一步）通行證過期的時候，前端拿 Refresh Token 去換一張新的。使用者不用重新輸入密碼，甚至不會發現。

（下一步）想讓某個人強制登出，就把資料庫裡他的 Refresh Token 刪掉。他手上的通行證最多再用十五分鐘，之後就換不到新的了。這樣就補上了「通行證收不回來」的缺點。

（下一步）這個機制叫做 Refresh Token。今天先知道有這個做法，之後做專題需要的時候再深入。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 動手練習

<!--
換大家動手。
-->

---

# 練習 1：有效時間改用設定檔

現在的有效時間「一小時」寫死在程式裡。請改成從設定檔讀取：

<v-clicks>

1. 在 `application.properties` 加一行 `jwt.expire-minutes=1`
2. `JwtUtil` 用 `@Value` 讀出來，沒有設定的時候預設 60
3. `generateToken()` 改用這個數字計算到期時間
4. 測試：登入後馬上查詢 → 200；等超過一分鐘再查詢 → 401

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：沒有設定時的預設值，寫在名稱後面的冒號之後：<code>@Value("${名稱:預設值}")</code>。
</div>

</v-click>

<!--
練習一。現在的有效時間一小時，是寫死在程式裡的。請改成從設定檔讀取。

（下一步）第一，在 application.properties 加一行 jwt.expire-minutes 等於 1，代表一分鐘。

（下一步）第二，JwtUtil 用 @Value 讀出來。沒有這項設定的時候，預設是 60。

（下一步）第三，generateToken 改用這個數字計算到期時間。

（下一步）第四，測試。登入後馬上查詢，應該是 200。等超過一分鐘再查詢，應該是 401。

（下一步）提示：預設值的寫法是，錢字號大括號裡面，名稱後面加冒號，再寫預設值。設定檔沒有這一項的時候，就用冒號後面的值。

請先暫停，自己試試看。
-->

---

# 練習 1：參考答案

```properties
jwt.expire-minutes=1
```

```java {1-2|6}
@Value("${jwt.expire-minutes:60}")
private long expireMinutes;

public String generateToken(String username) {
    Date now = new Date();
    Date expireAt = new Date(now.getTime() + expireMinutes * 60 * 1000);
    // 以下不變
}
```

<v-clicks>

- 過期的 Token，`getUsername()` 會丟出例外，被 `JwtAuthFilter` 的 `catch` 接住，當作沒帶證 → 401
- 測試完把設定改回 `60`，不然之後一直要重新登入

</v-clicks>

<!--
參考答案。

（下一步）在 JwtUtil 加一個欄位 expireMinutes，用 @Value 讀設定，冒號後面是預設值 60。

（下一步）計算到期時間的那一行，把原本的 60 乘 60 乘 1000，改成 expireMinutes 乘 60 乘 1000。分鐘換成毫秒。

（下一步）一分鐘之後為什麼是 401？因為過期的 Token，getUsername 會丟出例外。例外被 JwtAuthFilter 的 catch 接住，當作這個人沒帶證。最後由後面的關卡回覆 401。

（下一步）測試完記得把設定改回 60，不然之後測試會一直要重新登入。
-->

---

# 練習 2：把身分也寫在通行證上

現在每個請求都要查一次資料庫，才知道這個人的身分。請把身分寫進通行證，省掉這次查詢：

<v-clicks>

1. `generateToken()` 多一個參數 `role`，用 `.claim("role", role)` 寫進 Payload
2. `JwtUtil` 加一個方法 `getRole(token)`，把它讀出來
3. `JwtAuthFilter` 不再呼叫 `loadUserByUsername()`，改用通行證上的身分
4. 測試：規則照常運作；到 jwt.io 可以看到 Payload 多了 `role`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：讀自訂欄位用 <code>.getPayload().get("role", String.class)</code>。身分要包成 <code>new SimpleGrantedAuthority("ROLE_" + role)</code>，再放進 <code>List.of(…)</code>。
</div>

</v-click>

<!--
練習二，比較有挑戰。

現在每個請求進來，JwtAuthFilter 都要查一次資料庫，才知道這個人的身分。但是故事裡的通行證，身分是直接寫在證上的。請把身分寫進通行證，省掉這次查詢。

（下一步）第一，generateToken 多一個參數 role。在 builder 裡用 claim 把它寫進 Payload。claim 的意思是證上的一項資料。

（下一步）第二，JwtUtil 加一個方法 getRole，把它讀出來。

（下一步）第三，JwtAuthFilter 不再呼叫 loadUserByUsername，改用通行證上的身分。

（下一步）第四，測試。規則應該照常運作。到 jwt.io 可以看到 Payload 多了 role。

（下一步）提示有兩個。讀自訂欄位，用 getPayload 之後的 get，兩個參數：欄位名稱和型別。身分要包成 SimpleGrantedAuthority 物件，內容是 ROLE 底線加上身分，再放進 List.of 裡面。

請先暫停，自己試試看。
-->

---

# 練習 2：參考答案

```java
// JwtUtil：generateToken(String username, String role) 的 builder 多一行
.claim("role", role)

// JwtUtil：新方法
public String getRole(String token) {
    return Jwts.parser().verifyWith(getKey()).build()
            .parseSignedClaims(token).getPayload().get("role", String.class);
}
```

```java
// JwtAuthFilter：try 裡面改成
String username = jwtUtil.getUsername(token);
String role = jwtUtil.getRole(token);
List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
UsernamePasswordAuthenticationToken authentication =
        new UsernamePasswordAuthenticationToken(username, null, authorities);
SecurityContextHolder.getContext().setAuthentication(authentication);
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>AccountService.login()</code> 發證的地方也要跟著改：<code>jwtUtil.generateToken(account.getUsername(), account.getRole())</code>。
</div>

</v-click>

<!--
參考答案。

JwtUtil 的 generateToken 多一個參數 role，builder 裡多一行 claim。

新方法 getRole，寫法和 getUsername 幾乎一樣，只有最後一段不同：用 get 讀出 role 這個欄位。

JwtAuthFilter 的 try 裡面，拿到帳號名稱之後，再拿身分。上一章用 roles() 的時候，Spring Security 會自動在前面加上 ROLE 底線。這裡我們自己組，所以要自己加。然後做紀錄的時候，第一個參數直接放帳號名稱。AccountService 在這個類別裡用不到了，可以把那個 @Autowired 刪掉。

（下一步）別忘了 AccountService 的 login，發證的地方也要多傳一個身分。

這樣改完，驗證一個請求完全不用查資料庫。但是也有代價：如果在資料庫把 tom 改成老師，他要重新登入、拿到新的通行證，才會生效。舊的通行證上寫的還是學生。
-->

---

# 複習：通行證對照表

<Pairs left="學校" right="程式" rows="card,蓋了鋼印的通行證=code,JWT（Token）|form,證上寫的資料=code,Payload：sub、exp|what,學校的鋼印=code,Signature，用密鑰算出來|clerk,A 櫃台核對帳密後發證=code,POST /auth/login → generateToken()|guard,每次進門檢查鋼印=code,JwtAuthFilter → getUsername()|no,塗改過、過期的證=no,401" />

<!--
我們用一張圖複習今天的內容。

（下一步）蓋了鋼印的通行證，是 JWT，也叫 Token。

（下一步）證上寫的資料，是 Payload，裡面有 sub 和 exp。

（下一步）學校的鋼印，是 Signature，用密鑰算出來的。

（下一步）A 櫃台核對帳密後發證，是 POST /auth/login，裡面呼叫 generateToken。

（下一步）每次進門檢查鋼印，是 JwtAuthFilter，裡面呼叫 getUsername。

（下一步）塗改過、過期的證，得到 401。
-->

---

# 章節總結

<v-clicks>

- **JWT**：資料寫在證上、由伺服器簽章的通行證；伺服器不用保管任何東西
- **三段**：Header、Payload、Signature。Payload 任何人都看得到，不放機密
- **發證**：登入時核對密碼，用 `Jwts.builder()` 產生 Token
- **驗證**：自己寫一個 Filter，從 `Authorization: Bearer …` 拿出 Token 檢查
- **守則**：`STATELESS`、`addFilterBefore`、公開登入網址、拿掉 `httpBasic`

</v-clicks>

<v-click>

下一章：學校越來越大，一個教務處忙不過來，要拆成好幾個處室了。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）JWT 是資料寫在證上、由伺服器簽章的通行證，伺服器不用保管任何東西。它有三段：Header、Payload、Signature。Payload 任何人都看得到，不放機密。發證是在登入時核對密碼，用 Jwts.builder() 產生 Token。驗證是自己寫一個 Filter，從 Authorization 的 Bearer 後面拿出 Token 檢查。守則要改四個地方：無狀態、把關卡排進去、公開登入網址、拿掉 httpBasic。

（最後一步）下一章，學校越來越大，一個教務處忙不過來，要拆成好幾個處室了。
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
