---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Boot Cache
routeAlias: ch43
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
    Spring Boot Cache
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「不要一直重複做同樣的事，把答案先記起來」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第四十三章，也是「進階功能」這個單元的最後一章。

今天的主題是 Cache，中文叫做快取。它要解決的問題很單純：同樣的東西一直被查，每次都去資料庫拿，太慢了。

今天繼續使用 school 專案。
-->

---

# 今天要搞懂的四件事

<v-clicks>

- **Cache 是什麼？** 把查過的答案先留著，下次直接用
- **怎麼用？** 三個 Annotation：`@Cacheable`、`@CacheEvict`、`@CachePut`
- **留多久、留多少？** 用 Caffeine 設定過期時間和數量上限
- **什麼時候不該用？** Cache 常見的陷阱

</v-clicks>

<!--
今天要搞懂四件事。

（下一步）第一，Cache 是什麼。把查過的答案先留著，下次直接用。

（下一步）第二，怎麼用。會學三個 Annotation。

（下一步）第三，留多久、留多少。我們會用一個叫 Caffeine 的工具，設定過期時間和數量上限。

（下一步）第四，什麼時候不該用。Cache 很方便，但是用錯地方會出問題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 櫃台上的便利貼

<!--
先看教務處。
-->

---

# 同樣的問題，一天被問一百次

<v-clicks>

- 放榜那一天，同一位同學的成績單，他自己查、爸媽查、導師也查
- 每一次，櫃台都要請組長、組長請承辦人員、承辦人員**進檔案室翻**
- 檔案室很遠，翻一次要好幾分鐘。而答案每一次都一樣

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 資料庫的查詢是整個系統裡<b>比較慢</b>的一環。同樣的查詢重複做一百次，是在浪費時間，也讓資料庫更忙。
</div>

</v-click>

<!--
同樣的問題，一天可能被問一百次。

（下一步）放榜那一天，同一位同學的成績單，他自己查、爸媽查、導師也查。

（下一步）每一次，櫃台都要請組長，組長請承辦人員，承辦人員進檔案室翻。

（下一步）檔案室很遠，翻一次要好幾分鐘。而答案每一次都一樣。

（下一步）對應到程式。資料庫的查詢，是整個系統裡比較慢的一環。同樣的查詢重複做一百次，是在浪費時間，也讓資料庫更忙。
-->

---

# 教務處的做法：便利貼

<StickyNote />

<!--
教務處的做法是便利貼。

第一次有人問 3 號同學的成績單。櫃台上沒有現成的答案，只好請人進檔案室查，要等一陣子。

（下一步）查到之後，順手把答案抄在一張便利貼上，貼在櫃台。

（下一步）第二次有人問 3 號。櫃台看一眼便利貼，直接回答。沒有人進檔案室。這一次非常快。

（下一步）後來，3 號同學的資料被修改了。便利貼上的內容變成舊的。所以要把舊的便利貼撕掉。下次有人問，再重新查、重新抄。

便利貼就這三個動作：沒有就去查、查完抄下來；有就直接用；資料變了就撕掉。
-->

---

# 對照到程式

<StickyNote terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>Cache</b>（快取）：把查過的結果暫時存在比較快的地方（通常是記憶體），下次直接拿來用。有現成的答案叫 <b>Hit</b>（命中），沒有叫 <b>Miss</b>。
</div>

</v-click>

<!--
同一張圖，換成程式的名字。

櫃台上那一塊貼便利貼的地方，是一個 Cache，我們幫它取名叫 students。進檔案室查，是執行方法的本體、查資料庫。

（下一步）查完抄下來，是把結果存進 Cache。

（下一步）第二次直接看便利貼回答，叫做 Cache Hit，命中。這時候方法的本體完全不會執行。

（下一步）撕掉便利貼，是 @CacheEvict。

（下一步）整理一下名詞。Cache，中文叫快取，意思是把查過的結果暫時存在比較快的地方，通常是記憶體，下次直接拿來用。有現成的答案叫做 Hit，命中。沒有叫做 Miss。

便利貼上面有兩個部分。左邊的「3 號」是用來找的，叫做 key。右邊是內容，叫做 value。
-->

---

# 想一想

<Poll question="3 號同學的成績被修改了，但是櫃台的便利貼沒有撕掉。接下來查 3 號的人會看到什麼？" options="最新的成績|修改之前的舊成績|錯誤訊息|什麼都沒有" answer="2" />

<!--
來想一題。

3 號同學的成績被修改了，但是櫃台的便利貼沒有撕掉。接下來查 3 號的人會看到什麼？

（等大家作答）

（下一步）答案是：修改之前的舊成績。

因為櫃台看到有便利貼，就直接照著回答，不會進檔案室。這是用 Cache 最需要小心的地方：資料變了，Cache 要跟著處理。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 開始使用 Cache

<!--
實際加進專案。
-->

---

# 兩個準備動作

**一、加入依賴**（`build.gradle`）：

```groovy
implementation 'org.springframework.boot:spring-boot-starter-cache'
```

**二、打開功能**（`SchoolApplication`）：

```java {3}
@SpringBootApplication
@EnableScheduling
@EnableCaching
public class SchoolApplication { … }
```

<v-clicks>

- 加完依賴記得 **Refresh Gradle Project**
- `@EnableCaching`：打開 Cache 的功能。沒有它，後面的 Annotation 都不會有作用

</v-clicks>

<!--
兩個準備動作。

第一，加入依賴。在 build.gradle 加上 spring-boot-starter-cache。它是 Spring Boot 官方的，不用寫版本號。

第二，打開功能。在啟動類別上面加 @EnableCaching。上一章加的 @EnableScheduling 留著。

（下一步）加完依賴，記得在專案上按右鍵，Gradle，Refresh Gradle Project。

（下一步）@EnableCaching 的作用是打開 Cache 的功能。沒有它，後面的 Annotation 都不會有作用，而且不會有任何錯誤訊息。所以如果發現 Cache 沒效果，先檢查這一行。
-->

---

# @Cacheable：先看便利貼

打開 `StudentService`，在 `getStudentById()` 上面加一行：

```java {1|3|all}
@Cacheable(value = "students", key = "#p0", unless = "#result == null")
public StudentResponse getStudentById(Integer id) {
    log.info("進檔案室查詢，id={}", id);
    Student po = studentRepository.findById(id).orElse(null);
    if (po == null) {
        return null;
    }
    return toResponse(po);
}
```

- `value = "students"`：便利貼要貼在哪一區（Cache 的名字）
- `key = "#p0"`：用**第 0 個參數**（也就是 `id`）當作便利貼的編號
- `unless = "#result == null"`：如果結果是 `null`，就**不要**抄下來

<!--
第一個 Annotation，@Cacheable。打開 StudentService，在 getStudentById 上面加一行。

（下一步）括號裡有三個設定。value 是 Cache 的名字，也就是便利貼要貼在哪一區。我們取名叫 students。

key 是便利貼的編號，用來找的。井字號 p0 的意思是第 0 個參數。程式裡數東西習慣從 0 開始，所以第 0 個就是第一個，也就是 id。查 3 號，key 就是 3。

unless 是「除非」。井字號 result 是方法回傳的結果。整句的意思是：如果結果是 null，就不要抄下來。因為查不到的時候我們回傳 null。如果把「查不到」也抄成便利貼，之後這位同學真的被新增了，櫃台還是會回答查不到。

（下一步）另外在方法的第一行加一筆日誌。它是用來觀察的：這一行有印出來，代表真的進了檔案室。

（下一步）加了 @Cacheable 之後，Spring 會在呼叫這個方法之前，先去 students 這一區找有沒有編號是 id 的便利貼。有，直接回傳，方法不執行。沒有，才執行方法，並且把結果抄下來。這個「在方法前後插入動作」的做法，就是第十一章學的 AOP。
-->

---

# 觀察：第二次沒有進檔案室

重新啟動，用 Postman 連續送三次 `GET /students/1`：

<v-clicks>

- **第一次**：console 出現「進檔案室查詢，id=1」，還有一句 `select …` 的 SQL
- **第二次、第三次**：console **什麼都沒有**。但是 Postman 一樣拿到結果
- 換成 `GET /students/2`：又出現一次「進檔案室查詢，id=2」。不同的 key 是不同的便利貼

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 沒有印出日誌 = 方法沒有執行 = 沒有查資料庫。這就是 Cache Hit。
</div>

</v-click>

<!--
重新啟動，用 Postman 連續送三次 GET /students/1。

（下一步）第一次。console 出現我們寫的那筆日誌「進檔案室查詢」，還有一句 select 開頭的 SQL。

（下一步）第二次、第三次。console 什麼都沒有。但是 Postman 一樣拿到結果，而且回應的時間通常更短。

（下一步）換成 GET /students/2。又出現一次日誌。因為 key 不一樣，2 號是另一張便利貼，還沒有抄過。

（下一步）所以判斷的方法是：沒有印出日誌，代表方法沒有執行，也就是沒有查資料庫。這就是 Cache Hit。
-->

---

# 問題來了：資料改了，便利貼沒換

<v-clicks>

1. `GET /students/1` → 成績 85（抄了便利貼）
2. `PUT /students/1`，把成績改成 95 → 資料庫裡已經是 95
3. `GET /students/1` → **還是 85**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 這就是剛才想一想的那一題。修改和刪除的時候，要記得處理便利貼。有兩種做法：<b>撕掉</b>，或是<b>換一張新的</b>。
</div>

</v-click>

<!--
但是現在有一個問題。請照順序試。

（下一步）第一步，GET /students/1。成績是 85。這時候便利貼抄好了。

（下一步）第二步，PUT /students/1，把成績改成 95。到 Workbench 看，資料庫裡已經是 95。

（下一步）第三步，再 GET /students/1。還是 85。

（下一步）這就是剛才想一想的那一題。資料改了，便利貼沒換，櫃台照著舊的便利貼回答。

所以修改和刪除的時候，要記得處理便利貼。有兩種做法：撕掉，或是換一張新的。
-->

---

# @CacheEvict：撕掉便利貼

```java {1}
@CacheEvict(value = "students", key = "#p0")
public void deleteStudent(Integer id) {
    studentRepository.deleteById(id);
    log.info("已刪除學生，id={}", id);
}
```

<v-clicks>

- Evict 是「趕出去」的意思。方法**執行完之後**，把這個 key 的便利貼撕掉
- `value` 和 `key` 要和 `@Cacheable` 那邊**一模一樣**，才撕得到同一張
- 想一次全部撕光：`@CacheEvict(value = "students", allEntries = true)`

</v-clicks>

<!--
第二個 Annotation，@CacheEvict。加在刪除的方法上。

（下一步）Evict 是「趕出去」的意思。方法執行完之後，Spring 會把這個 key 的便利貼撕掉。刪除了 3 號同學，就把 3 號的便利貼撕掉。

（下一步）要注意，value 和 key 要和 @Cacheable 那邊一模一樣，才撕得到同一張。這裡的 p0 一樣是第 0 個參數 id。

（下一步）如果想一次把這一區的便利貼全部撕光，把 key 換成 allEntries = true。

如果沒有加這一行會怎樣？刪除了 3 號，但是便利貼還在，查 3 號還是查得到。一個已經不存在的同學。
-->

---

# @CachePut：換一張新的

```java {1}
@CachePut(value = "students", key = "#p0", unless = "#result == null")
public StudentResponse updateStudent(Integer id, CreateStudentRequest req) {
    // …（內容不變）
    return toResponse(studentRepository.save(po));
}
```

<v-clicks>

- 方法**每一次都會執行**（修改一定要真的做）
- 做完之後，把**回傳的結果**抄成新的便利貼，蓋掉舊的
- 所以方法回傳的東西，要和 `getStudentById()` 回傳的是同一種（都是 `StudentResponse`）

</v-clicks>

<!--
第三個 Annotation，@CachePut。加在修改的方法上。

（下一步）它和 @Cacheable 最大的不同是：方法每一次都會執行。因為修改一定要真的做，不能看到有便利貼就跳過。

（下一步）做完之後，把方法回傳的結果抄成新的便利貼，蓋掉舊的。所以下一次查詢，直接就有最新的答案，不用再進檔案室。

（下一步）因為抄的是回傳的結果，所以這個方法回傳的東西，要和 getStudentById 回傳的是同一種。我們兩邊都是 StudentResponse，沒有問題。unless 一樣是：結果是 null 就不要抄。

加好之後，重做一次剛才的實驗。查詢是 85，修改成 95，再查詢。這次是 95 了，而且第三步沒有印出「進檔案室查詢」。
-->

---

# 三個 Annotation，一次整理

<Pairs left="便利貼" right="程式" rows="doc,先看有沒有；沒有才去查，查完抄下來=code,@Cacheable：用在查詢|no,事情做完，把那一張撕掉=code,@CacheEvict：用在刪除|ok,事情做完，換一張新的=code,@CachePut：用在修改|card,便利貼的編號=code,key（三個地方要一致）" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 不確定修改該用哪一個？用 <code>@CacheEvict</code> 撕掉最保險，頂多下一次查詢慢一點。
</div>

</v-click>

<!--
三個 Annotation，一次整理。

（下一步）先看有沒有；沒有才去查，查完抄下來。這是 @Cacheable，用在查詢。

（下一步）事情做完，把那一張撕掉。這是 @CacheEvict，用在刪除。

（下一步）事情做完，換一張新的。這是 @CachePut，用在修改。

（下一步）便利貼的編號是 key。三個地方的 value 和 key 要一致，才是在處理同一張便利貼。

（下一步）如果不確定修改該用哪一個，用 @CacheEvict 撕掉最保險。頂多下一次查詢要進一次檔案室，慢一點，但是資料一定是對的。
-->

---

# 想一想

<Poll question="@Cacheable 和 @CachePut 最大的差別是什麼？" options="@CachePut 比較快|有便利貼的時候，@Cacheable 不執行方法；@CachePut 每次都執行|@Cacheable 只能用在 Controller|兩個完全一樣" answer="2" />

<!--
確認一下。

@Cacheable 和 @CachePut 最大的差別是什麼？

（等大家作答）

（下一步）答案是：有便利貼的時候，@Cacheable 不執行方法；@CachePut 每次都執行。

查詢可以跳過，修改不能跳過。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 便利貼不能永遠貼著

<!--
到這裡 Cache 已經可以用了。但是還有一個問題。
-->

---

# 預設的 Cache：永遠不過期，也沒有上限

<v-clicks>

- 我們只加了 `spring-boot-starter-cache`。這時候用的是最簡單的 Cache
- 便利貼貼上去就**永遠留著**，除非自己撕
- 也**沒有數量上限**。查過一萬位同學，就有一萬張

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 櫃台的桌面（記憶體）有限。便利貼只增不減，總有一天會貼滿。預設的 Cache 只適合練習，正式使用要換一個能<b>設定期限和上限</b>的。
</div>

</v-click>

<!--
預設的 Cache 有兩個問題。

（下一步）我們只加了 spring-boot-starter-cache。這時候 Spring Boot 用的是最簡單的一種 Cache。

（下一步）便利貼貼上去就永遠留著，除非自己撕。

（下一步）也沒有數量上限。查過一萬位同學，就有一萬張便利貼。

（下一步）櫃台的桌面有限，對應到程式是記憶體有限。便利貼只增不減，總有一天會貼滿，程式會因為記憶體不夠而當掉。所以預設的 Cache 只適合練習。正式使用要換一個能設定期限和上限的。
-->

---

# 換成 Caffeine

**`build.gradle`** 再加一行：

```groovy
implementation 'com.github.ben-manes.caffeine:caffeine'
```

**`application.properties`**：

```properties
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
```

<v-clicks>

- `maximumSize=500`：最多 500 張。滿了之後，丟掉最少被用到的
- `expireAfterWrite=10m`：抄下來 10 分鐘之後自動作廢
- `StudentService` 裡的三個 Annotation **完全不用改**

</v-clicks>

<!--
常用的選擇是 Caffeine。它是一個專門做 Cache 的工具，速度很快，而且可以設定期限和上限。

在 build.gradle 再加一行 Caffeine 的依賴。版本由 Spring Boot 管理，不用寫。記得 Refresh。

然後在 application.properties 加兩行。第一行告訴 Spring Boot：Cache 請用 Caffeine。第二行是 Caffeine 的設定，用逗號隔開。

（下一步）maximumSize=500。最多 500 張便利貼。滿了之後，Caffeine 會自動丟掉最少被用到的。

（下一步）expireAfterWrite=10m。抄下來 10 分鐘之後自動作廢。m 是分鐘，也可以用 s 代表秒、h 代表小時。

（下一步）最重要的一點：StudentService 裡的三個 Annotation 完全不用改。我們只換了底下的工具，上面的寫法一樣。

要觀察過期的效果，可以暫時把 10m 改成 30s。查詢一次，等超過 30 秒再查，會看到又進了一次檔案室。
-->

---

# 兩種期限

<Pairs left="expireAfterWrite" right="expireAfterAccess" sign="vs" rows="doc,從「抄下來」開始算=doc,從「最後一次被看」開始算|ok,時間到一定作廢=what,一直有人看，就一直不作廢|ok,資料最多舊這麼久，可以預期=no,熱門的資料可能很久都不更新" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 不確定選哪一個，先用 <code>expireAfterWrite</code>。就算忘了撕便利貼，舊資料最多也只會存在這麼久。
</div>

</v-click>

<!--
期限有兩種算法。

（下一步）expireAfterWrite，從抄下來的那一刻開始算。expireAfterAccess，從最後一次被看的那一刻開始算。

（下一步）前者時間到一定作廢。後者只要一直有人看，就一直不作廢。

（下一步）前者的好處是可以預期：資料最多舊這麼久。後者的風險是，熱門的資料可能很久都不更新。

（下一步）不確定選哪一個的話，先用 expireAfterWrite。它還有一個保險的作用：就算我們哪裡忘了撕便利貼，舊資料最多也只會存在這麼久。
-->

---

# 補充：很多個櫃台的時候

<v-clicks>

- Caffeine 的便利貼貼在**自己這台伺服器**的記憶體裡
- 系統變大之後，同一個程式可能同時開好幾台。每一台各有各的便利貼，內容可能不一樣
- 這時候會改用 **Redis**：一個獨立的服務，像是**大家共用的公佈欄**

</v-clicks>

<v-click>

```properties
spring.cache.type=redis
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 換成 Redis，三個 Annotation 一樣不用改。但是要另外安裝、啟動 Redis，還有一些額外的設定。這門課先不實作，知道有這個選擇就好。
</div>

</v-click>

<!--
這一頁是補充。

（下一步）Caffeine 的便利貼，是貼在自己這台伺服器的記憶體裡。

（下一步）系統變大之後，同一個程式可能同時開好幾台，一起分擔請求。就像教務處開了好幾個櫃台。每個櫃台各有各的便利貼，內容可能不一樣。A 櫃台撕了，B 櫃台還貼著。

（下一步）這時候會改用 Redis。它是一個獨立的服務，專門用來存這種暫時的資料。像是大家共用的公佈欄，所有的櫃台都看同一塊。

（下一步）設定大概長這樣：Cache 的類型換成 redis，再告訴程式 Redis 在哪裡。三個 Annotation 一樣不用改。但是 Redis 要另外安裝和啟動，還有一些額外的設定。這門課先不實作，知道有這個選擇就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 什麼時候用，什麼時候不要用

<!--
最後談使用的時機和陷阱。
-->

---

# 適合，和不適合

<Pairs left="適合用 Cache" right="不適合用 Cache" sign="vs" rows="ok,查的次數遠多於改的次數=no,資料一直在變（例如剩餘名額）|ok,查一次很花時間=no,本來就查得很快|ok,晚幾分鐘看到新資料也沒關係=no,一定要是最新的（例如帳戶餘額）" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 Cache 是拿「<b>可能看到稍微舊的資料</b>」去換「<b>速度</b>」。這個交換划不划算，要看是什麼資料。
</div>

</v-click>

<!--
什麼時候適合用 Cache？

（下一步）查的次數遠多於改的次數，適合。資料一直在變，不適合。例如第三十三章選課的剩餘名額，每一秒都可能不一樣。

（下一步）查一次很花時間，適合。本來就查得很快，不需要。

（下一步）晚幾分鐘看到新資料也沒關係，適合。一定要是最新的，不適合。例如帳戶餘額。

（下一步）Cache 的本質是一個交換：拿「可能看到稍微舊的資料」去換「速度」。這個交換划不划算，要看是什麼資料。
-->

---

# 三個常見的陷阱

<v-clicks>

- **忘了撕便利貼**：新增了會改資料的方法，卻沒有加 `@CacheEvict` → 查到舊資料
- **key 對不起來**：查詢用 `#p0`，刪除卻用了別的 → 撕的是另一張，原本那張還在
- **自己叫自己沒有效果**：同一個類別裡，A 方法直接呼叫有 `@Cacheable` 的 B 方法，Cache **不會生效**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 第三點的原因：Cache 是靠 AOP 在「別人呼叫進來」的時候插入動作。類別自己內部的呼叫，不會經過那一關。要從<b>別的類別</b>呼叫才有效。
</div>

</v-click>

<!--
三個常見的陷阱。

（下一步）第一，忘了撕便利貼。之後新增了會改資料的方法，卻沒有加 @CacheEvict。結果就是查到舊資料。每次寫會改資料的方法，都要想一下：有沒有相關的 Cache 要處理。

（下一步）第二，key 對不起來。查詢用 p0，刪除卻用了別的寫法。撕的是另一張便利貼，原本那張還在。

（下一步）第三，自己叫自己沒有效果。在同一個類別裡，A 方法直接呼叫有 @Cacheable 的 B 方法，Cache 不會生效，每次都會執行 B。

（下一步）第三點的原因是：Cache 是靠 AOP，在「別人呼叫進來」的時候插入動作。類別自己內部的呼叫，不會經過那一關。所以要從別的類別呼叫才有效。我們是從 Controller 呼叫 Service，所以沒有這個問題。
-->

---

# 補充：還有這些設定

<v-clicks>

- `condition = "#p0 > 0"`：**符合條件**才使用 Cache（執行方法之前判斷）
- `key = "#p0 + ':' + #p1"`：方法有兩個參數、要一起當編號時，把它們接起來
- `sync = true`：很多人同時問同一個還沒抄過的問題時，只讓一個人去查，其他人等他的結果
- `beforeInvocation = true`：`@CacheEvict` 改成在方法執行**之前**就先撕

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 引號裡的 <code>#p0</code>、<code>#result</code> 這種寫法叫做 <b>SpEL</b>，是 Spring 用來在 Annotation 裡取值的小語法。現在知道有這些設定就好，用到的時候再查。
</div>

</v-click>

<!--
最後補充幾個設定，知道有就好。

（下一步）condition。符合條件才使用 Cache。它是在執行方法之前判斷的。和 unless 相反，unless 是執行之後判斷要不要抄。

（下一步）key 可以把兩個參數接起來。方法有兩個參數、要一起當編號的時候用。p1 是第 1 個參數，也就是第二個。

（下一步）sync = true。很多人同時問同一個還沒抄過的問題時，只讓一個人去查，其他人等他的結果。可以避免資料庫一瞬間被同一個查詢打很多次。

（下一步）beforeInvocation = true。@CacheEvict 預設是方法執行成功之後才撕。加了這個，會改成執行之前就先撕。

（下一步）引號裡這種井字號的寫法，叫做 SpEL，是 Spring 用來在 Annotation 裡取值的小語法。現在知道有這些設定就好，用到的時候再查。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 動手練習

<!--
兩個練習。
-->

---

# 練習 1：幫社團加上 Cache

1. `ClubService` 新增 `getClubById(Integer id)`：查不到回傳 `null`，方法開頭寫一筆日誌
2. `ClubController` 新增 `GET /clubs/{id}`，查不到回覆 404
3. `getClubById()` 加上 `@Cacheable`，Cache 的名字叫 `clubs`
4. `deleteClub()` 加上 `@CacheEvict`
5. 測試：連續查兩次同一個社團，日誌只出現一次；刪除之後再查，得到 404

<!--
練習一。幫第三十七章的社團加上 Cache。

第一，ClubService 新增一個 getClubById。查不到回傳 null。方法開頭寫一筆日誌，方便觀察。

第二，ClubController 新增 GET /clubs/ 加上編號。查不到回覆 404。

第三，getClubById 加上 @Cacheable。Cache 的名字叫 clubs。

第四，deleteClub 加上 @CacheEvict。

第五，測試。連續查兩次同一個社團，日誌只出現一次。刪除之後再查，得到 404。如果刪除之後還查得到，就是便利貼沒有撕掉。

請先暫停，自己試試看。
-->

---

# 練習 1：參考答案

```java
@Cacheable(value = "clubs", key = "#p0", unless = "#result == null")
public ClubResponse getClubById(Integer id) {
    log.info("進檔案室查詢社團，id={}", id);
    Club po = clubRepository.findById(id).orElse(null);
    if (po == null) {
        return null;
    }
    return toResponse(po);
}

@CacheEvict(value = "clubs", key = "#p0")
public void deleteClub(Integer id) {
    clubRepository.deleteById(id);
}
```

Controller 的寫法和 `StudentController` 的 `getStudentById()` 一樣。

<!--
參考答案。

getClubById，結構和 getStudentById 一樣。@Cacheable 的 value 是 clubs，key 是第 0 個參數，結果是 null 就不抄。

deleteClub，加上 @CacheEvict，value 和 key 與上面一致。

Controller 的寫法和 StudentController 的 getStudentById 一樣：結果是 null 回覆 404，否則回覆 200。

記得 ClubService 要先準備好 log，用 @Slf4j 最快。
-->

---

# 練習 2：每天半夜，全部重來

結合上一章的排程：

1. `StudentService` 新增一個方法 `clearStudentCache()`，把 `students` 這一區的便利貼**全部**撕掉
2. 在 `scheduler` 資料夾新增 `CacheCleanScheduler`，每天凌晨 **3 點**呼叫它，並寫一筆日誌
3. 測試時先改成每分鐘執行一次：查詢 → 等排程跑過 → 再查詢，應該會重新進檔案室

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：全部撕掉用 <code>allEntries = true</code>。方法的內容可以是空的，重點在上面的 Annotation。
</div>

</v-click>

<!--
練習二。結合上一章的排程。

第一，StudentService 新增一個方法 clearStudentCache，把 students 這一區的便利貼全部撕掉。

第二，在 scheduler 資料夾新增 CacheCleanScheduler。每天凌晨 3 點呼叫剛才那個方法，並且寫一筆日誌。

第三，測試的時候先改成每分鐘執行一次。查詢一次，等排程跑過，再查詢一次。應該會重新進檔案室。

（下一步）提示：全部撕掉用 allEntries = true。方法的內容可以是空的，重點在上面的 Annotation。

請先暫停，自己試試看。
-->

---

# 練習 2：參考答案

```java
// StudentService
@CacheEvict(value = "students", allEntries = true)
public void clearStudentCache() {
}
```

```java
@Slf4j
@Component
public class CacheCleanScheduler {
    @Autowired
    private StudentService studentService;

    @Scheduled(cron = "0 0 3 * * *")
    public void cleanCache() {
        studentService.clearStudentCache();
        log.info("已清空 students 的 Cache");
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 為什麼要多寫一個方法，而不是把 <code>@CacheEvict</code> 直接加在排程上？因為從<b>別的類別</b>呼叫，Cache 的 Annotation 一定會生效。這就是剛才的第三個陷阱。
</div>

</v-click>

<!--
參考答案。

上面是 StudentService 新增的方法。方法裡面是空的。它的作用完全在上面那一行：把 students 這一區全部清空。

下面是排程。注入 StudentService，cron 是每天凌晨 3 點：秒 0、分 0、時 3。方法裡呼叫組長的 clearStudentCache，再寫一筆日誌。

（下一步）為什麼要多寫一個方法，而不是把 @CacheEvict 直接加在排程的方法上？因為從別的類別呼叫，Cache 的 Annotation 一定會生效。這就是剛才講的第三個陷阱。也剛好符合分層的規矩：工友負責「什麼時候做」，組長負責「做什麼」。

每天清空一次，是一種簡單的保險。就算有哪裡漏了撕便利貼，舊資料最多也只會留到隔天凌晨。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="doc,櫃台上的便利貼=code,Cache（快取）|ok,有就直接用；沒有才去查，查完抄下來=code,@Cacheable|no,撕掉=code,@CacheEvict|ok,換一張新的=code,@CachePut|what,便利貼會過期、桌面有限=code,Caffeine：expireAfterWrite、maximumSize|shop,所有櫃台共用的公佈欄=code,Redis" />

<!--
我們用一張圖複習今天的內容。

（下一步）櫃台上的便利貼，是 Cache。

（下一步）有就直接用；沒有才去查，查完抄下來。這是 @Cacheable。

（下一步）撕掉，是 @CacheEvict。

（下一步）換一張新的，是 @CachePut。

（下一步）便利貼會過期、桌面有限，是 Caffeine 的 expireAfterWrite 和 maximumSize。

（下一步）所有櫃台共用的公佈欄，是 Redis。
-->

---

# 章節總結

<v-clicks>

- **Cache**：把查過的結果暫存起來，下次直接用，減少查資料庫的次數
- **啟用**：加 `spring-boot-starter-cache`，啟動類別加 `@EnableCaching`
- **`@Cacheable`** 查詢、**`@CacheEvict`** 刪除、**`@CachePut`** 修改；`value` 和 `key` 要一致
- **Caffeine**：`maximumSize` 設上限，`expireAfterWrite` 設期限；Annotation 不用改
- **注意**：資料改了要處理 Cache；常常變、一定要最新的資料不適合

</v-clicks>

<!--
最後整理今天的重點。

（依序按下一步）Cache 是把查過的結果暫存起來，下次直接用，減少查資料庫的次數。啟用的方法是加依賴，再到啟動類別加 @EnableCaching。@Cacheable 用在查詢，@CacheEvict 用在刪除，@CachePut 用在修改，三個地方的 value 和 key 要一致。Caffeine 可以設上限和期限，而且 Annotation 不用改。最後要注意，資料改了要處理 Cache；常常變、一定要最新的資料不適合用。
-->

---

# 進階功能單元：我們走過的路

<v-clicks>

- **號碼牌和置物櫃**：Session，讓伺服器記得使用者（第 40 章）
- **演練清單和值班日誌**：單元測試、Mock、Log（第 41 章）
- **工友的時間表**：排程 `@Scheduled`（第 42 章）
- **櫃台上的便利貼**：Cache（第 43 章）

</v-clicks>

<v-click>

下一個單元是「安全與微服務」。第一站：誰可以進教務處、誰可以辦哪些事。

</v-click>

<!--
這一章也是進階功能單元的最後一章。我們回頭看一下走過的路。

（依序按下一步）第四十章，號碼牌和置物櫃，是 Session。第四十一章，演練清單和值班日誌，是單元測試和 Log。第四十二章，工友的時間表，是排程。今天，櫃台上的便利貼，是 Cache。

（最後一步）這四樣東西，都不是「新的功能」，而是讓系統更好用、更可靠、更快的工具。下一個單元是安全與微服務。第一站要談的是：誰可以進教務處、誰可以辦哪些事。
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
