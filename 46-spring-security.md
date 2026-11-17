---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Security
routeAlias: ch46
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
    Spring Security
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓 API 知道：你是誰？你有資格嗎？」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第四十六章，也是新單元「安全與微服務」的第一章。

到目前為止，我們的 school 專案功能越來越多，但是有一個很大的問題：任何人都可以呼叫任何一個 API。

今天要請一位警衛來站在校門口。這位警衛的名字叫做 Spring Security。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **認證和授權差在哪裡？** 「你是誰」和「你能做什麼」
- **怎麼設定規則？** 哪些網址公開、哪些要登入、哪些只有老師能用
- **帳號和密碼放在哪裡？** 為什麼密碼不能照原樣存起來

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，認證和授權差在哪裡。這兩個詞很像，但是問的問題不一樣。一個問「你是誰」，一個問「你能做什麼」。

（下一步）第二，怎麼設定規則。哪些網址是公開的，哪些要登入，哪些只有老師能用。

（下一步）第三，帳號和密碼放在哪裡。還有一件很重要的事：為什麼密碼不能照原樣存起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 校門口的警衛

<!--
先看學校。
-->

---

# 現在的教務處，誰都能進來

<v-clicks>

- 校門沒有人看守，任何人都可以走進教務處
- 路過的人說「幫我把 3 號同學的成績改成 100 分」，櫃台就照辦了
- 也可以說「把 5 號同學的資料刪掉」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 我們的 <code>school</code> 專案現在就是這樣。只要知道網址，任何人都能送出 <code>PUT /students/3</code> 或 <code>DELETE /students/5</code>。
</div>

</v-click>

<!--
想像一下，校門沒有人看守。

（下一步）任何人都可以走進教務處。

（下一步）一個路過的人走到櫃台說：幫我把三號同學的成績改成一百分。櫃台就照辦了。

（下一步）他也可以說：把五號同學的資料刪掉。櫃台一樣照辦。

（下一步）聽起來很誇張，但是我們的 school 專案現在就是這樣。只要知道網址，任何人都能送出 PUT /students/3，或是 DELETE /students/5。程式不會問他是誰。
-->

---

# 學校的做法：請一位警衛

<GateGuard />

<!--
學校請了一位警衛，站在校門口。

Tom 來到校門口，想進學校辦事。

（下一步）第一關。警衛說：請出示學生證。Tom 拿出學生證，警衛確認他是 Tom。這一關問的是：你是誰。

（下一步）第二關。警衛翻開名冊，查到 Tom 的身分是學生。這一關問的是：你這個身分可以做什麼。

（下一步）結果是：學生可以到櫃台查成績，但是不能進成績室改成績。成績室只有老師可以進去。

請注意順序。一定是先知道你是誰，才能決定你能做什麼。
-->

---

# 對照到程式

<GateGuard terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 兩關擋下來的時候，狀態碼不一樣。第一關沒過（不知道你是誰）是 <b>401</b>；第二關沒過（知道你是誰，但是你不能做這件事）是 <b>403</b>。
</div>

</v-click>

<!--
同一張圖，換成程式的名字。Tom 是使用者，學生證是他的帳號和密碼。警衛是 Spring Security。

（下一步）第一關，確認你是誰，叫做認證，英文是 Authentication。

（下一步）第二關，確認你能做什麼，叫做授權，英文是 Authorization。這兩個英文字長得很像，開頭都是 Auth。記法是：認證在前、授權在後，先認人、再給權限。

（下一步）查成績是 GET /students，學生可以做，回覆 200。改成績是 PUT /students/1，學生不能做，回覆 403。

（下一步）兩關擋下來的時候，狀態碼不一樣。第一關沒過，也就是不知道你是誰，是 401。這個狀態碼我們在第四十二章用過。第二關沒過，知道你是誰，但是你不能做這件事，是 403。
-->

---

# 整理：兩關各問一個問題

<Pairs left="校門口" right="程式" rows="guard,警衛=code,Spring Security|card,第一關：你是誰？=code,認證 Authentication|book,第二關：你能做什麼？=code,授權 Authorization|what,沒帶學生證=no,401 Unauthorized|lock,有學生證，但是不能進成績室=no,403 Forbidden" />

<!--
我們把對應整理一次。

（下一步）警衛，是 Spring Security。

（下一步）第一關，你是誰，是認證。

（下一步）第二關，你能做什麼，是授權。

（下一步）沒帶學生證，是 401。

（下一步）有學生證，但是不能進成績室，是 403。
-->

---

# 想一想

<Poll question="Tom 出示了學生證，警衛也確認是他本人。但是他想進成績室，被擋了下來。他是在哪一關被擋的？" options="認證（第一關）|授權（第二關）|兩關都沒過|他根本沒遇到警衛" answer="2" />

<!--
來想一題。

Tom 出示了學生證，警衛也確認是他本人。但是他想進成績室，被擋了下來。他是在哪一關被擋的？

（等大家作答）

（下一步）答案是：授權，第二關。

警衛已經知道他是 Tom，所以認證通過了。擋下他的原因是「學生不能進成績室」，這是授權的問題。狀態碼會是 403。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 請警衛上班：加入 Spring Security

<!--
來把警衛請進我們的專案。
-->

---

# 加入依賴

打開 `build.gradle`，在 `dependencies` 裡加一行：

```groovy
implementation 'org.springframework.boot:spring-boot-starter-security'
```

<v-clicks>

- 不用寫版本，Spring Boot 會幫我們選好搭配的版本
- 加完之後，按 Gradle 的重新整理，讓它下載
- 只要加了這一行，警衛就**已經開始上班**了

</v-clicks>

<!--
打開 build.gradle，在 dependencies 裡加一行。spring-boot-starter-security。

（下一步）不用寫版本。Spring Boot 會幫我們選好搭配的版本。

（下一步）加完之後，按 Gradle 的重新整理，讓它下載。

（下一步）請注意：只要加了這一行，什麼程式都還沒寫，警衛就已經開始上班了。我們來看他預設會做什麼。
-->

---

# 什麼都還沒設定，全部都鎖起來了

重新啟動，用 Postman 送 `GET /students`：

<v-clicks>

- 得到 **401**。原本可以用的 API，現在全部都要登入
- 警衛的預設守則：**沒有證件，一律不准進**
- Spring Security 準備了一個臨時帳號：帳號是 `user`，密碼印在啟動的訊息裡

</v-clicks>

<v-click>

```text
Using generated security password: 3d9b2c47-e1a0-4f28-9c01-0a1b2c3d4e5f
```

</v-click>

<!--
重新啟動專案，用 Postman 送 GET /students。

（下一步）得到 401。原本可以用的 API，現在全部都要登入才能用。

（下一步）這是警衛的預設守則：沒有證件，一律不准進。先全部鎖起來，再由我們決定哪些要打開。這個順序比較安全。

（下一步）那要用什麼帳號登入？Spring Security 準備了一個臨時帳號。帳號固定是 user，密碼印在啟動的訊息裡。

（下一步）在 IntelliJ 下方的啟動訊息裡找這一行：Using generated security password。後面那一長串就是密碼。每次啟動都會換一組。
-->

---

# 用 Postman 出示證件：Basic Auth

<v-clicks>

1. 在 Postman 點 **Authorization** 頁籤
2. Auth Type 選 **Basic Auth**
3. Username 填 `user`，Password 貼上剛才那一串密碼
4. 再送一次 `GET /students` → **200**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>Basic Auth</b>：每一次請求，都把帳號和密碼放在名叫 <code>Authorization</code> 的 Header 裡一起送出。就像每次進校門，都要拿出學生證給警衛看。
</div>

</v-click>

<!--
在 Postman 出示證件的方法。

（下一步）第一步，在網址列下方，點 Authorization 這個頁籤。

（下一步）第二步，Auth Type 選 Basic Auth。

（下一步）第三步，Username 填 user，Password 貼上剛才那一串密碼。

（下一步）第四步，再送一次 GET /students。這次得到 200，資料回來了。

（下一步）這個方式叫做 Basic Auth。每一次請求，Postman 都會把帳號和密碼放在一個名叫 Authorization 的 Header 裡一起送出。就像每次進校門，都要拿出學生證給警衛看。它是最簡單的方式，今天先用它。下一章會學另一種方式。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 警衛的守則：SecurityConfig

<!--
預設的守則是全部都鎖。接下來我們自己寫守則。
-->

---

# 守則寫在哪裡

在 `config` 資料夾新增 `SecurityConfig`：

<CodeSteps>

```java {1-3|5-6|7-10|11}
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
            .httpBasic(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable());
        return http.build();
    }
}
```

- `@Configuration` 是設定類別；`@EnableWebSecurity` 代表「這裡是警衛的守則」
- 用 `@Bean` 交出一個 `SecurityFilterChain`，警衛會照它做事
- 三行設定：路徑規則、接受 Basic Auth、關掉 CSRF（後面補充）
- 最後一定要 `http.build()`，守則才會成立

</CodeSteps>

<!--
在 config 資料夾新增一個類別，叫做 SecurityConfig。config 資料夾是第四十章建立的。

（下一步）@Configuration 我們在第四十章用過，代表這是一個設定類別。下面多了一個 @EnableWebSecurity，意思是：這裡是警衛的守則。

（下一步）用 @Bean 交出一個物件，型別是 SecurityFilterChain。警衛會照這個物件做事。方法的參數 HttpSecurity 是 Spring 交給我們的工具，守則都透過它來寫。後面的 throws Exception 請照抄。

（下一步）中間有三行設定。第一行 authorizeHttpRequests 是路徑規則，現在寫的是：任何請求都要登入。第二行 httpBasic，接受剛才用的 Basic Auth。第三行把 CSRF 關掉，它是什麼，本章最後會補充。現在先知道：不關掉的話，Postman 送 POST、PUT、DELETE 都會被擋。

這裡有箭頭的寫法，例如 auth 箭頭 auth 點什麼。第四十三章看過類似的。意思是：Spring 把一個叫 auth 的設定工具交給我們，箭頭後面寫我們要對它做的設定。

（下一步）最後一定要 http.build()，把守則組起來回傳。少了這一行，守則不會成立。
-->

---

# 寫上真正的規則

把 `authorizeHttpRequests` 那一行換成：

<CodeSteps>

```java {2|3|4|5}
.authorizeHttpRequests(auth -> auth
    .requestMatchers(HttpMethod.GET, "/clubs/**").permitAll()
    .requestMatchers(HttpMethod.GET, "/students/**").authenticated()
    .requestMatchers("/students/**").hasRole("TEACHER")
    .anyRequest().authenticated()
)
```

- 查社團：公開，任何人都可以（校門口的社團海報）
- 查學生：要登入，學生和老師都可以
- 學生資料的其他動作（新增、修改、刪除）：只有老師
- 其餘沒提到的：一律要登入

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>/students/**</code> 的兩個星號代表「這個路徑，以及它底下的所有路徑」，所以 <code>/students</code> 和 <code>/students/3</code> 都算。
</div>

</v-click>

<!--
把 authorizeHttpRequests 那一行，換成真正的規則。每一行都是 requestMatchers 加上一個結果。requestMatchers 的意思是：符合這個條件的請求。

（下一步）第一條。方法是 GET、路徑是 /clubs 開頭的請求，permitAll，任何人都可以。就像校門口貼的社團海報，校外的人也能看。

（下一步）第二條。GET /students 開頭的請求，authenticated，要登入。學生和老師都可以查。

（下一步）第三條。這一條沒有寫方法，代表 /students 的所有方法。hasRole TEACHER，只有身分是老師的人可以。GET 已經在上一條處理掉了，所以這一條實際上管的是新增、修改和刪除。

（下一步）最後一條。anyRequest，其餘沒提到的請求，一律要登入。這一條是保底，新加的 API 忘了寫規則，也不會變成公開。

（下一步）路徑裡的兩個星號，代表這個路徑，以及它底下的所有路徑。所以 /students 和 /students/3 都算。
-->

---

# 常用的四種結果

<v-clicks>

- `permitAll()`：任何人都可以，不用登入
- `authenticated()`：要登入，什麼身分都可以
- `hasRole("TEACHER")`：要登入，而且身分必須是 `TEACHER`
- `denyAll()`：任何人都不可以（暫時關閉某個功能）

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>身分</b>在 Spring Security 裡叫做 <b>Role</b>（角色）。名稱由我們自己取，習慣用全大寫的英文，例如 <code>STUDENT</code>、<code>TEACHER</code>。
</div>

</v-click>

<!--
requestMatchers 後面可以接的結果，常用的有四種。

（下一步）permitAll，任何人都可以，不用登入。

（下一步）authenticated，要登入，但是什麼身分都可以。

（下一步）hasRole，要登入，而且身分必須是括號裡寫的那一個。

（下一步）denyAll，任何人都不可以。想暫時關閉某個功能的時候可以用。

（下一步）故事裡的「身分」，在 Spring Security 裡叫做 Role，中文是角色。名稱由我們自己取，習慣用全大寫的英文。今天用兩個：STUDENT 是學生，TEACHER 是老師。
-->

---

# 規則的順序很重要

警衛拿到一個請求，會**從第一條開始往下對**，對到的第一條就算數，後面的不看了。

<v-clicks>

- `GET /students/3`：第二條就對到了 → 要登入
- `PUT /students/3`：第二條不符合（不是 GET），第三條對到 → 只有老師

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 如果把第三條搬到第二條前面，<code>GET /students/3</code> 會先對到「只有老師」，學生就查不到成績了。<b>範圍小的規則要寫在前面，範圍大的寫在後面。</b>
</div>

</v-click>

<!--
這些規則有一個很重要的特性：順序。

警衛拿到一個請求，會從第一條開始往下對。對到的第一條就算數，後面的不看了。

（下一步）例如 GET /students/3。第一條是社團，不符合。第二條，GET 加上 /students 開頭，對到了。結果是要登入。

（下一步）PUT /students/3。第二條要求 GET，不符合。第三條，/students 開頭、任何方法，對到了。結果是只有老師。

（下一步）如果把第三條搬到第二條前面會怎樣？GET /students/3 會先對到「只有老師」，學生就查不到成績了。所以請記得：範圍小的規則要寫在前面，範圍大的寫在後面。anyRequest 範圍最大，永遠放最後。
-->

---

# 想一想

<Poll question="照剛才的四條規則，一位已經登入的「學生」送出 DELETE /students/5，會得到什麼？" options="200，刪除成功|401，因為沒有登入|403，因為身分不是老師|404，找不到這個網址" answer="3" />

<!--
來想一題。

照剛才的四條規則，一位已經登入的學生送出 DELETE /students/5，會得到什麼？

（等大家作答）

（下一步）答案是 403。

DELETE /students/5 會對到第三條，只有老師可以。他已經登入，所以不是 401。他的身分是學生，不是老師，所以是 403。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 密碼不能照抄

<!--
規則寫好了。接下來要有帳號。在建立帳號之前，要先談一件很重要的事：密碼要怎麼存。
-->

---

# 如果名冊被偷了

警衛的名冊上，要記每個人的帳號和密碼。

<v-clicks>

- 如果名冊上寫著「tom：tom123」，名冊一旦被偷，**所有人的密碼都外流了**
- 很多人在不同網站用同一組密碼，損失不只是這一個系統
- 所以有一條鐵則：**密碼絕對不能照原樣存起來**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 做法：存之前，先把密碼丟進一台「攪碎機」。出來的是一串看不懂的亂碼，而且<b>沒有辦法從亂碼變回原本的密碼</b>。名冊上只記這串亂碼。
</div>

</v-click>

<!--
警衛的名冊上，要記每個人的帳號和密碼，這樣才能核對。

（下一步）如果名冊上直接寫著「tom，密碼 tom123」，名冊一旦被偷，所有人的密碼都外流了。

（下一步）而且很多人在不同的網站用同一組密碼。所以損失不只是這一個系統。

（下一步）所以有一條鐵則：密碼絕對不能照原樣存起來。照原樣存，有一個名字，叫做存明碼。

（下一步）那要怎麼辦？做法是：存之前，先把密碼丟進一台攪碎機。出來的是一串看不懂的亂碼，而且沒有辦法從亂碼變回原本的密碼。名冊上只記這串亂碼。就算名冊被偷，小偷拿到的也只是亂碼。
-->

---

# 攪碎機：BCryptPasswordEncoder

在 `SecurityConfig` 裡加一個 `@Bean`：

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

它有兩個方法：

```java {1|2}
String encoded = passwordEncoder.encode("tom123");            // 攪碎
boolean same = passwordEncoder.matches("tom123", encoded);    // 核對
```

<v-clicks>

- `encode()`：把密碼攪碎。結果像 `$2a$10$N9qo8uLOickgx2ZMRZoMye…`
- `matches()`：拿使用者輸入的密碼，和名冊上的亂碼核對，回傳 `true` 或 `false`

</v-clicks>

<!--
Spring Security 準備好了攪碎機，叫做 BCryptPasswordEncoder。BCrypt 是這種攪碎方法的名字。

在 SecurityConfig 裡加一個 @Bean，交出一個 BCryptPasswordEncoder。這樣整個專案都可以用 @Autowired 拿到它。

它有兩個方法。

（下一步）encode，把密碼攪碎。

（下一步）matches，核對。

（下一步）encode 的結果像這樣，一串很長的亂碼，開頭是錢字號 2a。

（下一步）matches 有兩個參數：前面是使用者輸入的密碼，後面是名冊上的亂碼。它會回傳 true 或 false。登入的時候，Spring Security 會自動幫我們呼叫它，不用自己寫。
-->

---

# 攪碎機的三個特性

<v-clicks>

- **回不去**：只能從密碼變成亂碼，不能從亂碼變回密碼
- **每次都不一樣**：同一個密碼攪兩次，得到兩串不同的亂碼
- **還是能核對**：所以核對要用 `matches()`，不能自己用 `equals()` 比

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 「每次都不一樣」是故意的。這樣就算兩個人用同一個密碼，名冊上的亂碼也不同，小偷看不出誰和誰的密碼一樣。
</div>

</v-click>

<!--
這台攪碎機有三個特性。

（下一步）第一，回不去。只能從密碼變成亂碼，不能從亂碼變回密碼。連我們自己、連系統管理員，都不知道使用者的密碼是什麼。

（下一步）第二，每次都不一樣。同一個密碼攪兩次，會得到兩串不同的亂碼。

（下一步）第三，雖然每次不一樣，還是能核對。所以核對一定要用 matches，不能自己把密碼再攪一次、用 equals 去比，那樣永遠不會相等。

（下一步）「每次都不一樣」是故意設計的。這樣就算兩個人用同一個密碼，名冊上的亂碼也不同。小偷看不出誰和誰的密碼一樣。
-->

---

# 想一想

<Poll question="使用者忘記密碼，打電話問客服：「可以告訴我原本的密碼嗎？」正確的系統應該怎麼做？" options="從資料庫查出密碼告訴他|把亂碼還原成密碼告訴他|沒辦法告訴他，只能讓他重新設定一組|把亂碼直接唸給他" answer="3" />

<!--
來想一題。

使用者忘記密碼，打電話問客服：可以告訴我原本的密碼嗎？正確的系統應該怎麼做？

（等大家作答）

（下一步）答案是：沒辦法告訴他，只能讓他重新設定一組。

資料庫裡只有亂碼，而且亂碼變不回密碼。所以正常的網站都是寄一封「重設密碼」的信，不會把舊密碼寄給你。如果有網站能把你的舊密碼寄給你，代表它存的是明碼，那個網站並不安全。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 第一份名冊：寫在程式裡的帳號

<!--
有了攪碎機，可以來建立帳號了。先用最簡單的方式。
-->

---

# 先建兩個測試帳號

在 `SecurityConfig` 再加一個 `@Bean`：

```java {2|3-7|8-12|13}
@Bean
public UserDetailsService userDetailsService(PasswordEncoder encoder) {
    UserDetails tom = User.builder()
            .username("tom")
            .password(encoder.encode("tom123"))
            .roles("STUDENT")
            .build();
    UserDetails amy = User.builder()
            .username("amy")
            .password(encoder.encode("amy123"))
            .roles("TEACHER")
            .build();
    return new InMemoryUserDetailsManager(tom, amy);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>UserDetailsService</code> 就是警衛的<b>名冊</b>。<code>InMemoryUserDetailsManager</code> 是「放在記憶體裡的名冊」：帳號寫死在程式裡，適合練習，不適合正式使用。
</div>

</v-click>

<!--
在 SecurityConfig 再加一個 @Bean。

（下一步）這個方法交出的型別是 UserDetailsService。它就是警衛的名冊。方法的參數寫了 PasswordEncoder，Spring 會把剛才那台攪碎機交進來。

（下一步）第一個帳號 tom。用 User.builder() 開始，一項一項填：帳號 tom、密碼 tom123，注意密碼有先經過 encode 攪碎。roles 是身分，STUDENT。最後 build() 完成。這裡的 User 是 Spring Security 提供的類別，import 的時候請選 org.springframework.security 開頭的。

（下一步）第二個帳號 amy，是一位老師。身分是 TEACHER。

（下一步）最後把兩個帳號放進 InMemoryUserDetailsManager 回傳。

（下一步）InMemory 的意思是放在記憶體裡。帳號寫死在程式裡，適合練習，不適合正式使用。因為要新增一個帳號，就得改程式、重新啟動。

有了自己的名冊之後，Spring Security 就不會再產生那個臨時的 user 帳號了。
-->

---

# 用 Postman 測試

重新啟動，在 Authorization 頁籤換不同的帳號試試看：

<v-clicks>

- 不帶帳號，`GET /clubs` → **200**（公開）
- 不帶帳號，`GET /students` → **401**（第一關沒過）
- `tom` / `tom123`，`GET /students` → **200**
- `tom` / `tom123`，`DELETE /students/1` → **403**（第二關沒過）
- `amy` / `amy123`，`DELETE /students/1` → **200**

</v-clicks>

<!--
重新啟動，在 Postman 的 Authorization 頁籤換不同的帳號試試看。

（下一步）不帶帳號，Auth Type 選 No Auth。GET /clubs，得到 200。因為社團是公開的。

（下一步）一樣不帶帳號，GET /students，得到 401。第一關沒過，警衛不知道你是誰。

（下一步）換成 tom 的帳號密碼，GET /students，得到 200。

（下一步）一樣用 tom，DELETE /students/1，得到 403。第二關沒過，學生不能刪除資料。

（下一步）換成 amy 的帳號密碼，DELETE /students/1，得到 200。老師可以。

四條規則都照我們寫的運作了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# 把名冊放進檔案室：資料庫的帳號

<!--
帳號寫死在程式裡不實用。真正的系統，帳號是放在資料庫裡的。
-->

---

# 要新增的四個檔案

<v-clicks>

- `entity/Account`：帳號的 PO，對應 `account` 資料表
- `repository/AccountRepository`：用帳號名稱查詢
- `service/AccountService`：**資料庫版的名冊**，也負責註冊
- `controller/AccountController`：註冊的 API

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這四層的分工，和第三十九章的 <code>Student</code> 完全一樣。新的東西只有一個：<code>AccountService</code> 要告訴警衛「怎麼從資料庫查出一個帳號」。
</div>

</v-click>

<!--
要新增四個檔案，各放在自己的資料夾。

（下一步）entity 裡的 Account，帳號的 PO，對應 account 資料表。

（下一步）repository 裡的 AccountRepository，用帳號名稱查詢。

（下一步）service 裡的 AccountService。它是資料庫版的名冊，也負責註冊。

（下一步）controller 裡的 AccountController，提供註冊的 API。

（下一步）這四層的分工，和第三十九章的 Student 完全一樣。新的東西只有一個：AccountService 要告訴警衛，怎麼從資料庫查出一個帳號。

類別取名叫 Account，不叫 User，是因為 Spring Security 已經有一個類別叫 User 了，剛才才用過。取不同的名字，才不會搞混。
-->

---

# Account 和 AccountRepository

```java {all|10|11}
@Getter
@Setter
@Entity
@Table(name = "account")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String username;
    private String password;   // 存的是攪碎後的亂碼
    private String role;       // "STUDENT" 或 "TEACHER"
}
```

```java
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Account findByUsername(String username);
}
```

<!--
先看 Account。寫法和 Student 一樣：@Entity、@Table、主鍵，加上三個欄位。

（下一步）password 欄位，存的是攪碎後的亂碼，不是原本的密碼。

（下一步）role 欄位，存身分。內容是 STUDENT 或 TEACHER。

下面是 AccountRepository。除了繼承來的方法，多寫了一個 findByUsername。這是第二十八章學過的方法名稱查詢：照規則取名字，助理就會自動產生「用 username 查詢」的 SQL。查不到的時候，回傳 null。

因為設定檔有 ddl-auto=update，啟動的時候 account 資料表會自動建好。
-->

---

# AccountService：資料庫版的名冊

<CodeSteps>

```java {1-2|7-8|9|10-12|13-17}
@Service
public class AccountService implements UserDetailsService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByUsername(username);
        if (account == null) {
            throw new UsernameNotFoundException("找不到帳號：" + username);
        }
        return User.builder()
                .username(account.getUsername())
                .password(account.getPassword())
                .roles(account.getRole())
                .build();
    }
}
```

- `implements UserDetailsService`：宣告「我是一份名冊」
- 名冊只需要一個方法：給一個帳號名稱，回傳這個人的資料
- 請承辦人員到資料庫查
- 查不到，丟出「找不到帳號」的例外
- 查到了，把資料抄成警衛看得懂的格式（密碼已經是亂碼，不用再攪）

</CodeSteps>

<!--
重點是 AccountService。

（下一步）@Service，加上 implements UserDetailsService。implements 我們在第七章學過，意思是照著一份介面的規定來寫。這裡是宣告：我是一份名冊。

（下一步）名冊的規定只有一個方法，loadUserByUsername。給一個帳號名稱，回傳這個人的資料。名稱和參數要完全照寫，上面加 @Override。

（下一步）方法裡面，先請 AccountRepository 到資料庫查。

（下一步）查不到的話，丟出 UsernameNotFoundException。警衛收到之後，會回覆 401。

（下一步）查到了，把資料抄成警衛看得懂的格式。和剛才建測試帳號的寫法一樣，用 User.builder()。請注意密碼這一行：資料庫裡存的已經是亂碼，所以直接放進去，不用再 encode 一次。

這個方法我們不會自己呼叫。有人登入的時候，警衛會自動來呼叫它，再用攪碎機的 matches 核對密碼。
-->

---

# 只能留一份名冊

回到 `SecurityConfig`，**把 Part 5 的 `userDetailsService()` 整個刪掉**：

```java {all|9}
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    // userDetailsService() 整個 @Bean 刪掉

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // 內容不變
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 如果兩份名冊同時存在，警衛不知道該用哪一份，結果是<b>所有人登入都得到 401</b>。啟動訊息裡會有一行警告：<code>Found 2 UserDetailsService beans</code>。
</div>

</v-click>

<!--
回到 SecurityConfig。

（下一步）把 Part 5 寫的 userDetailsService 整個 @Bean 刪掉。攪碎機和規則都保留。

為什麼要刪？AccountService 上面有 @Service，它自己就是一顆 Bean，而且是一份名冊。Spring Security 會自動找到它來用。

（下一步）如果沒有刪，兩份名冊同時存在，警衛不知道該用哪一份。結果是所有人登入都得到 401。這個錯誤不容易發現，因為程式可以正常啟動。線索在啟動訊息裡，會有一行警告：Found 2 UserDetailsService beans。所以請記得：名冊只能留一份。
-->

---

# 註冊：把新帳號寫進名冊

```java
@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String password;
}
```

在 `AccountService` 加上攪碎機和 `register()`：

```java {1-2|7|8}
@Autowired
private PasswordEncoder passwordEncoder;

public String register(RegisterRequest request) {
    Account account = new Account();
    account.setUsername(request.getUsername());
    account.setPassword(passwordEncoder.encode(request.getPassword()));
    account.setRole("STUDENT");
    accountRepository.save(account);
    return "註冊成功：" + account.getUsername();
}
```

<!--
名冊現在是空的，要有一個註冊的功能。

先在 dto 資料夾新增 RegisterRequest。兩個欄位：帳號和密碼。它是第三十七章說的 Request DTO，前端送進來的資料。

接著在 AccountService 加東西。

（下一步）用 @Autowired 拿到攪碎機。

（下一步）register 方法裡最重要的一行：存進去之前，密碼一定要先 encode。這一行如果忘了，資料庫裡就是明碼，而且之後登入也會失敗，因為警衛是用 matches 核對的。

（下一步）身分固定給 STUDENT。不能讓使用者自己決定身分，不然每個人都會說自己是老師。

最後存進資料庫，回傳訊息。
-->

---

# AccountController 和一條新規則

```java
@RestController
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return accountService.register(request);
    }
}
```

在 `SecurityConfig` 的規則**最前面**加一條：

```java
.requestMatchers("/register").permitAll()
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 註冊一定要公開。如果註冊也要先登入，還沒有帳號的人就永遠進不來了。
</div>

</v-click>

<!--
AccountController 很單純。POST /register，用 @RequestBody 接收 RegisterRequest，交給 AccountService。

然後要回到 SecurityConfig，在規則的最前面加一條：/register，permitAll。

（下一步）註冊一定要公開。如果註冊也要先登入，還沒有帳號的人就永遠進不來了。忘了加這一條，註冊會得到 401。
-->

---

# 試試看：註冊、登入、升成老師

<v-clicks>

1. `POST /register`，Body 是 `{"username":"tom","password":"tom123"}` → 註冊成功
2. 到 MySQL Workbench 看 `account` 資料表：`password` 欄位是一串亂碼
3. 用 `tom` / `tom123` 送 `GET /students` → **200**；送 `DELETE /students/1` → **403**
4. 再註冊一個 `amy`，然後在 Workbench 執行下面的 SQL，把她改成老師
5. 用 `amy` / `amy123` 送 `DELETE /students/1` → **200**

</v-clicks>

<v-click>

```sql
UPDATE account SET role = 'TEACHER' WHERE username = 'amy';
```

</v-click>

<!--
重新啟動，照順序試試看。

（下一步）第一步，POST /register。Authorization 選 No Auth。Body 選 raw、JSON，填帳號 tom、密碼 tom123。得到註冊成功。

（下一步）第二步，到 MySQL Workbench 看 account 資料表。password 欄位不是 tom123，是一串錢字號開頭的亂碼。

（下一步）第三步，用 tom 的帳號密碼送 GET /students，得到 200。送 DELETE /students/1，得到 403。和剛才記憶體帳號的結果一樣，只是帳號現在是從資料庫來的。

（下一步）第四步，再註冊一個 amy。註冊出來的身分都是學生，所以要到 Workbench 執行一句 UPDATE，把她的 role 改成 TEACHER。

（下一步）就是這一句 SQL。

（下一步）第五步，用 amy 的帳號密碼送 DELETE /students/1，得到 200。

真正的系統會有一個「管理員幫別人改身分」的功能。今天先直接改資料庫。
-->

---

# 在程式裡知道「現在是誰」

在 `AccountController` 加一個方法：

```java {2|3}
@GetMapping("/me")
public String me(Authentication authentication) {
    return "你是：" + authentication.getName();
}
```

<v-clicks>

- 參數寫 `Authentication authentication`，Spring 會把「通過第一關的這個人」交給我們
- `getName()`：他的帳號名稱
- 用途：查「我自己的」成績、記錄「是誰」刪了資料

</v-clicks>

<!--
最後一個常用的功能。Controller 裡面，怎麼知道現在發請求的是誰？

在 AccountController 加一個方法，GET /me。

（下一步）在參數寫 Authentication authentication。和第四十二章的 HttpSession 一樣，只要寫在參數，Spring 就會把東西交給我們。這裡交進來的是：通過第一關的這個人。import 請選 org.springframework.security.core 開頭的。

（下一步）getName()，拿到他的帳號名稱。

（下一步）這個功能很常用。例如查「我自己的」成績，或是在 Log 裡記錄是誰刪了資料。

用 tom 的帳號送 GET /me，會得到「你是：tom」。這個網址沒有寫在規則裡，所以走最後一條 anyRequest，要登入才能用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
# 補充：CSRF 和警衛的內部構造

<!--
最後補充兩個觀念。這一段先聽過、有印象就可以。
-->

---

# 補充：為什麼要關掉 CSRF

<v-clicks>

- **CSRF** 是一種攻擊：壞網站偷偷讓你的瀏覽器，對「你已經登入的網站」送出請求
- 它利用的是第四十二章學的特性：瀏覽器會**自動帶上 Cookie**
- Spring Security 預設會防它：`POST`、`PUT`、`DELETE` 要多帶一組驗證碼，沒帶就是 403
- 我們的 API 不靠 Cookie 認人（每次都自己帶帳號密碼），所以可以關掉

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 簡單的判斷：靠 <b>Cookie 和 Session</b> 登入的傳統網站，CSRF 保護要<b>開著</b>；每次請求自己帶證件的 <b>REST API</b>，可以<b>關掉</b>。
</div>

</v-click>

<!--
第一個補充。SecurityConfig 裡有一行把 CSRF 關掉，它是什麼？

（下一步）CSRF 是一種攻擊。壞網站偷偷讓你的瀏覽器，對你已經登入的網站送出請求。例如你登入了銀行網站，又去逛一個壞網站。壞網站偷偷送出一個轉帳的請求到銀行。

（下一步）它利用的是第四十二章學的特性：瀏覽器會自動帶上 Cookie。所以銀行以為是你本人送的。

（下一步）Spring Security 預設會防這種攻擊。做法是 POST、PUT、DELETE 這些會改資料的請求，要多帶一組驗證碼，沒帶就是 403。Postman 不會帶，所以會被擋。

（下一步）我們的 API 不是靠 Cookie 認人的，每一次都要自己帶帳號密碼。壞網站沒辦法替你帶，所以可以把這個保護關掉。

（下一步）簡單的判斷方式：靠 Cookie 和 Session 登入的傳統網站，CSRF 保護要開著。每次請求自己帶證件的 REST API，可以關掉。
-->

---

# 補充：警衛其實是一排關卡

<v-clicks>

- 請求到達 Controller 之前，會先通過一排關卡，叫做 **Filter Chain**（過濾器鏈）
- 有的關卡負責認證，有的負責授權，有的負責把錯誤變成 401、403
- 所以被擋下的請求，**根本不會進到我們的 Controller**
- 這也是 `SecurityFilterChain` 這個名字的由來

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 加了 Spring Security 之後，Swagger UI 也會被鎖住。想公開的話，在規則最前面加一條：<code>.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()</code>
</div>

</v-click>

<!--
第二個補充。我們一直說「一位警衛」，其實他是一排關卡。

（下一步）請求到達 Controller 之前，會先通過一排關卡。這一排關卡叫做 Filter Chain，中文是過濾器鏈。

（下一步）每一關有自己的工作。有的負責認證，有的負責授權，有的負責把錯誤變成 401 或 403 的回應。

（下一步）所以被擋下的請求，根本不會進到我們的 Controller。Controller 裡不用自己檢查有沒有登入。

（下一步）這也是 SecurityFilterChain 這個名字的由來。我們寫的守則，其實是在設定這一排關卡。下一章會在這一排裡，加一個我們自己寫的關卡。

（下一步）順便提醒：加了 Spring Security 之後，第四十章的 Swagger UI 也會被鎖住。想公開的話，在規則最前面加這一條。
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

# 練習 1：多一個身分

學校多了一位主任，身分是 `ADMIN`。請修改規則：

<v-clicks>

1. **刪除**學生資料（`DELETE /students/**`）：只有 `ADMIN` 可以
2. 學生資料的新增、修改：維持只有 `TEACHER`
3. 社團的新增、刪除（`POST`、`DELETE /clubs/**`）：只有 `TEACHER`
4. 註冊一個帳號 `boss`，在資料庫把身分改成 `ADMIN`，測試看看

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：<code>requestMatchers</code> 的第一個參數可以寫 <code>HttpMethod.DELETE</code>。想清楚新的規則要放在哪一條的<b>前面</b>。
</div>

</v-click>

<!--
練習一。學校多了一位主任，身分是 ADMIN。請修改規則。

（下一步）第一，刪除學生資料，只有 ADMIN 可以。

（下一步）第二，學生資料的新增和修改，維持只有 TEACHER。

（下一步）第三，社團的新增和刪除，只有 TEACHER。

（下一步）第四，註冊一個帳號 boss，在資料庫把身分改成 ADMIN，然後測試。老師刪除學生應該得到 403，主任刪除應該成功。

（下一步）提示：requestMatchers 的第一個參數可以寫 HttpMethod.DELETE。另外請想清楚，新的規則要放在哪一條的前面。

請先暫停，自己試試看。
-->

---

# 練習 1：參考答案

```java {4|6-7}
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/register").permitAll()
    .requestMatchers(HttpMethod.GET, "/clubs/**").permitAll()
    .requestMatchers(HttpMethod.DELETE, "/students/**").hasRole("ADMIN")
    .requestMatchers(HttpMethod.GET, "/students/**").authenticated()
    .requestMatchers("/students/**").hasRole("TEACHER")
    .requestMatchers("/clubs/**").hasRole("TEACHER")
    .anyRequest().authenticated()
)
```

<v-clicks>

- `DELETE` 那一條要放在 `/students/**` 的前面，否則會先對到「只有老師」
- 最後一條 `/clubs/**` 不用寫方法：`GET` 已經在前面被處理掉了

</v-clicks>

<!--
參考答案。

（下一步）DELETE /students 這一條，只有 ADMIN。它一定要放在「/students 所有方法，只有老師」那一條的前面。否則 DELETE 會先對到老師那一條，主任反而被擋，老師反而可以刪。

（下一步）社團的規則，用和學生一樣的手法。前面已經有一條 GET /clubs 公開，所以後面這一條 /clubs 不用寫方法，剩下的 POST 和 DELETE 都會對到它。

測試的時候，主任 boss 可以刪除學生，但是不能新增學生，因為新增只有 TEACHER 可以。一個帳號只有一個身分。
-->

---

# 練習 2：改自己的密碼

請新增一個 API，讓登入的人可以改**自己的**密碼：

<v-clicks>

1. `PUT /me/password`，Body 是 `{"newPassword":"abc12345"}`
2. 用 `Authentication` 知道現在是誰，從資料庫找出他的 `Account`
3. 新密碼**攪碎之後**再存回去
4. 測試：改完之後，舊密碼應該得到 401，新密碼可以登入

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：新增一個 DTO <code>ChangePasswordRequest</code>；在 <code>AccountService</code> 加一個方法 <code>changePassword(String username, String newPassword)</code>。
</div>

</v-click>

<!--
練習二。請新增一個 API，讓登入的人可以改自己的密碼。

（下一步）第一，PUT /me/password。Body 是一個 JSON，裡面有 newPassword。

（下一步）第二，用 Authentication 知道現在是誰，再從資料庫找出他的 Account。

（下一步）第三，新密碼要攪碎之後再存回去。

（下一步）第四，測試。改完之後，用舊密碼應該得到 401，用新密碼可以登入。

（下一步）提示：新增一個 DTO，叫做 ChangePasswordRequest。在 AccountService 加一個方法 changePassword，兩個參數：帳號名稱和新密碼。

請先暫停，自己試試看。
-->

---

# 練習 2：參考答案

```java
// AccountService
public String changePassword(String username, String newPassword) {
    Account account = accountRepository.findByUsername(username);
    account.setPassword(passwordEncoder.encode(newPassword));
    accountRepository.save(account);
    return "密碼已更新";
}
```

```java
// AccountController
@PutMapping("/me/password")
public String changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
    return accountService.changePassword(authentication.getName(), request.getNewPassword());
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 帳號名稱是從 <code>Authentication</code> 拿的，不是從 Body 拿的。這樣每個人<b>只能改自己的</b>密碼，沒辦法改別人的。
</div>

</v-click>

<!--
參考答案。ChangePasswordRequest 只有一個欄位 newPassword，寫法和 RegisterRequest 一樣，這裡省略。

AccountService 的 changePassword：用帳號名稱查出 Account，把新密碼 encode 之後放進去，再 save。save 遇到已經有 id 的資料，會做更新，這是第三十九章學過的。

AccountController：PUT /me/password。參數有兩個，一個是 Body，一個是 Authentication。把現在這個人的帳號名稱，和新密碼，交給 Service。

（下一步）這裡有一個重點。帳號名稱是從 Authentication 拿的，不是從 Body 拿的。這樣每個人只能改自己的密碼。如果讓前端在 Body 裡指定要改誰，那任何登入的人都能改別人的密碼了。
-->

---

# 複習：校門口對照表

<Pairs left="校門口" right="程式" rows="guard,警衛=code,Spring Security|card,第一關：你是誰=code,認證（沒過是 401）|lock,第二關：你能做什麼=code,授權（沒過是 403）|form,警衛的守則=code,SecurityFilterChain 的路徑規則|book,名冊=code,UserDetailsService|what,密碼攪碎機=code,BCryptPasswordEncoder" />

<!--
我們用一張圖複習今天的內容。

（下一步）警衛，是 Spring Security。

（下一步）第一關，你是誰，是認證。沒過是 401。

（下一步）第二關，你能做什麼，是授權。沒過是 403。

（下一步）警衛的守則，是 SecurityFilterChain 裡的路徑規則。

（下一步）名冊，是 UserDetailsService。

（下一步）密碼攪碎機，是 BCryptPasswordEncoder。
-->

---

# 章節總結

<v-clicks>

- **認證**問「你是誰」，**授權**問「你能做什麼」；一定是先認證、再授權
- 加入依賴之後，預設**全部都要登入**；我們再用規則一條一條打開
- 規則**從上往下**對，對到第一條就算數；範圍小的寫前面
- **密碼不存明碼**：存之前 `encode()`，核對用 `matches()`
- 資料庫的帳號：寫一個 `UserDetailsService`，告訴警衛怎麼查出帳號；名冊只能留一份

</v-clicks>

<v-click>

下一章：每一次請求都要帶帳號密碼，不太方便，也不太安全。有沒有別的證件可以用？

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）認證問你是誰，授權問你能做什麼，一定是先認證、再授權。加入依賴之後，預設全部都要登入，我們再用規則一條一條打開。規則從上往下對，對到第一條就算數，範圍小的寫前面。密碼不存明碼，存之前 encode，核對用 matches。資料庫的帳號，要寫一個 UserDetailsService，告訴警衛怎麼查出帳號，而且名冊只能留一份。

（最後一步）今天用的 Basic Auth，每一次請求都要帶帳號密碼。不太方便，也不太安全。下一章要看另一種證件。
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
