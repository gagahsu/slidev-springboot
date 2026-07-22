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
大家好，我是古古。

今天要聊的主題是 Spring Boot Cache。

想像一下：每次有人問你「今天午餐吃什麼？」，你都要跑去餐廳問一遍，超累的。
如果你直接把答案貼一張便利貼在桌上，下次有人問你直接看便利貼就好了，對吧？

Cache 就是這個概念——把常用的結果先記起來，不要每次都重新查資料庫。
-->

---
layout: default
---

# Outline

- **為什麼需要 Cache？** — 效能瓶頸與快取的解決思路
- **Spring Cache 抽象層** — `CacheManager` 與實作選擇
- **@EnableCaching** — 啟用快取與依賴設定
- **@Cacheable** — 深度解析 `key`、`condition`、`unless`
- **@CacheEvict** — 清除快取與 `beforeInvocation`
- **@CachePut** — 更新快取與 `@Cacheable` 比較
- **Caffeine Cache** — 本地快取設定
- **Redis Cache** — 分散式快取補充
- **什麼時候不該用 Cache？** — 注意事項
- **實作練習**

<!--
先來看一下這章的學習地圖。

我們會從「痛點」出發，然後介紹 Spring 的 Cache 抽象設計，
接著把三個核心注解一個一個拆開來講清楚，
中段補充 Caffeine 和 Redis 的實際設定，
最後討論「什麼時候不該用 Cache」——這個常常被忽略但非常重要。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 為什麼需要 Cache？

<!--
先說說痛點在哪裡。

有時候我們跟學員說 Cache，他們會問：「資料庫不就夠了嗎？」

這個問題很好，我們用一個生活情境來回答它。
-->

---

# 沒有 Cache 的世界

想像每次查詢「熱門商品 Top 10」都要掃描 100 萬筆資料：

| 情境 | 現象 |
|---|---|
| 100 個使用者同時請求同一份資料 | 資料庫被打 100 次 |
| 資料庫 query 需要 500ms | 使用者每次都等 500ms |
| 資料內容幾乎不會變 | 重複計算，完全浪費 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>核心問題：</b> 對於「讀多寫少、資料相對穩定」的場景，每次都去資料庫查是最昂貴的選擇。
</div>

<!--
這張表格說明了三種典型的浪費場景。

最讓人心疼的是第三種：資料根本沒變，但我們一直重複做同樣的事。

想像你每天早上都去圖書館查同一本書的同一頁，圖書館員工快被你搞瘋了。

Cache 的思路很簡單：「第一次查完，把結果記起來，之後直接用記起來的答案。」
-->

---

# Cache 的本質：便利貼思維

| 場景 | 沒有 Cache | 有 Cache |
|---|---|---|
| 第 1 次請求 | 查資料庫，回傳結果 | 查資料庫，**把結果貼便利貼**，回傳 |
| 第 2～N 次請求 | 查資料庫，回傳結果 | **直接看便利貼**，回傳 |
| 資料更新時 | 查資料庫（剛好最新） | **撕掉舊便利貼**，下次重新貼 |

**Cache 的三個基本操作：**

| 操作 | 動作 | Spring 注解 |
|---|---|---|
| 讀取時存入 | 查完 DB → 寫入 Cache | `@Cacheable` |
| 更新時清除 | 資料改變 → 清除 Cache | `@CacheEvict` |
| 更新時同步 | 資料改變 → 更新 Cache | `@CachePut` |

<!--
「便利貼」這個比喻我覺得最好理解。

便利貼會過期（TTL）、便利貼可以被撕掉（evict）、便利貼也可以重新貼新的（put）。

這三種操作對應到 Spring 的三個核心注解，後面我們會一一詳細說明。

先把這張表格記起來，這是整章的骨幹。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## Spring Cache 抽象層

<!--
接下來介紹 Spring Cache 最優雅的設計：「抽象層」。

這個設計讓我們可以用同一套注解，背後換不同的 Cache 實作，完全不用改業務邏輯。
-->

---

# Spring Cache 抽象層架構

| 介面 | 職責 |
|---|---|
| `CacheManager` | 管理所有 Cache 實例，依名稱取得 Cache |
| `Cache` | 代表單一個 Cache 儲存空間，提供 get / put / evict |

Spring Boot 根據 classpath 自動選擇 CacheManager 實作：

| 實作 | 特性 | 適用環境 |
|---|---|---|
| `ConcurrentMapCacheManager` | 記憶體，無上限，無 TTL | 開發測試 |
| `CaffeineCacheManager` | 高效能記憶體，支援 TTL / 容量 | 正式單機 |
| `RedisCacheManager` | 分散式，多 Pod 共享 | 正式多機 |

<!--
這個架構設計非常優雅。

我們寫程式碼時只跟「注解」互動，Spring AOP 幫我們在執行期呼叫 CacheManager。

CacheManager 再根據設定決定用哪個實作——開發環境用記憶體，正式環境換 Redis，
業務邏輯完全不用動。

這就是「面向介面程式設計」在實際框架設計中的應用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 啟用 Spring Cache

<!--
好，理論說夠了，來看怎麼把 Cache 功能打開。
-->

---

# build.gradle 依賴

**最小依賴（記憶體 Cache）：**

```groovy
implementation 'org.springframework.boot:spring-boot-starter-cache'
```

**加入 Caffeine（高效能記憶體 Cache）：**

```groovy
implementation 'org.springframework.boot:spring-boot-starter-cache'
implementation 'com.github.ben-manes.caffeine:caffeine'
```

**加入 Redis（分散式 Cache）：**

```groovy
implementation 'org.springframework.boot:spring-boot-starter-cache'
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>spring-boot-starter-cache</code> 本身只引入抽象層與 ConcurrentMap 實作。若要使用 Caffeine 或 Redis，需額外加對應依賴，Spring Boot 會自動偵測並配置對應的 CacheManager。
</div>

<!--
加 spring-boot-starter-cache 這個依賴非常輕量，幾乎沒有額外負擔。

Spring Boot 的自動配置機制會偵測 classpath 上有哪些 Cache 實作：
只有 starter → 用 ConcurrentMapCacheManager
加了 Caffeine → 自動換成 CaffeineCacheManager
加了 Redis → 自動換成 RedisCacheManager
-->

---

# @EnableCaching 開啟 Cache 功能

```java
@SpringBootApplication
@EnableCaching
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

**@EnableCaching 做了什麼？**

| 動作 | 說明 |
|---|---|
| 啟用 AOP Proxy | 讓 `@Cacheable` 等注解的攔截邏輯生效 |
| 掃描 Cache 注解 | 在 Bean 的方法上找 `@Cacheable`、`@CacheEvict`、`@CachePut` |
| 注入 CacheManager | 將 CacheManager 與注解綁定 |

<!--
⚠️ 常見錯誤：依賴加了、注解也貼了，但忘了 @EnableCaching，Cache 完全不會生效！

@EnableCaching 的作用原理跟 @EnableTransactionManagement 一樣，
都是透過 AOP 在方法執行前後插入邏輯。

沒有 @EnableCaching，你在方法上加再多 @Cacheable 都沒有用，
Spring 根本不會去看那些注解。

這個地方是初學者最常犯的錯誤。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## @Cacheable

<!--
重頭戲來了。@Cacheable 是三個注解裡面最常用的，我們要花比較多時間在這裡。
-->

---

# @Cacheable 基本用法 — 程式碼

沿用 ch37 的 `StudentService`，為 `getStudentById()` 加上 `@Cacheable`：

```java
@Service
public class StudentService {

    private static final Logger log =
        LoggerFactory.getLogger(StudentService.class);

    @Autowired
    private StudentRepository studentRepository;

    @Cacheable(value = "students", key = "#p0")
    public StudentResponse getStudentById(Integer id) {
        // log 只有 Cache Miss 時才會印出來——這是觀察 Cache 有沒有生效最直接的方法
        log.info("Cache Miss，查詢資料庫，id = {}", id);
        Student po = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        return toResponse(po); // toResponse 沿用 ch37
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>重點：</b> <code>value</code> 是 Cache 的名稱，就像便利貼的標籤；<code>key</code> 是用 SpEL 表達式指定的查詢鍵。加一行 log 在方法開頭，就能從 console 判斷這次呼叫到底有沒有真的打資料庫。</div>

<!--
value 是 Cache 的名稱，就像便利貼的標籤；key 是用 SpEL 表達式指定的查詢鍵。

這裡刻意加了一行 log.info——因為 Cache Hit 時整個方法本體都不會執行，log 自然也不會印出來。
第一次呼叫 getStudentById(1) 會看到 log；第二次呼叫同樣的 id，console 完全沒有反應，就代表 Cache 生效了。
這是驗證 Cache 是否生效最簡單、最直覺的方式，比 debug 斷點方便很多。

下一頁看這個注解實際的執行流程：Cache Hit 和 Cache Miss 分別發生什麼事。
-->

---

# @Cacheable 基本用法 — 執行流程

| 步驟 | Cache Hit | Cache Miss |
|---|---|---|
| 查 Cache | 找到資料 → 直接回傳 | 找不到 → 執行方法本體 |
| 方法本體 | 不執行 | 執行，查資料庫 |
| 存入 Cache | 不需要 | 把結果存入 Cache |

<!--
注意一個很重要的概念：Cache Hit 的時候，方法本體完全不會執行。

這意味著如果你在方法裡面有副作用（例如記錄 log、更新統計），Cache Hit 時這些都不會發生。
-->

---

# SpEL — Spring Expression Language（1/2）

Cache 的 `key`、`condition`、`unless` 都用 **SpEL** 撰寫。

SpEL 是 Spring 內建的表達式語言，讓 annotation 屬性可以動態取值：

| SpEL 寫法 | 意義 |
|---|---|
| `#id` | 方法參數 `id` 的值 |
| `#user.name` | 參數物件 `user` 的 `name` 屬性 |
| `#result` | 方法回傳值 |
| `#result == null` | 回傳值是否為 null |
| `#id > 0` | 參數 `id` 大於 0 |
| `'prefix:' + #id` | 字串串接 |

<!--
SpEL 不只用在 Cache，@PreAuthorize、@Value 等 annotation 也用它。
記住：# 開頭取參數，#result 取回傳值，支援簡單的運算式和條件判斷。
-->

---

# SpEL — Spring Expression Language（2/2）

對照 `@Cacheable` 的實際用法（沿用 ch37 的 `getStudentById`）：

```java
@Cacheable(
    value = "students",
    key = "#p0",                   // 取參數 id 當 Cache key
    condition = "#p0 > 0",         // id > 0 才啟用 Cache
    unless = "#result == null"     // 回傳 null 不存進 Cache
)
public StudentResponse getStudentById(Integer id) { ... }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 SpEL 不只用在 Cache，<code>@PreAuthorize</code>、<code>@Value</code> 等 annotation 也使用相同語法。</div>

<!--
這個範例把三個屬性全部串在一起，讓大家看清楚各自的角色。
-->

---

# @Cacheable 屬性詳解（1/2）

| 屬性 | 型別 | 說明 |
|---|---|---|
| `value` / `cacheNames` | `String[]` | Cache 名稱（可多個） |
| `key` | SpEL | Cache Key 的表達式 |
| `condition` | SpEL | 為 `true` 才使用 Cache（執行前判斷） |
| `unless` | SpEL | 為 `true` 就**不**存入 Cache（執行後判斷） |
| `sync` | `boolean` | 是否同步（防止 Cache Stampede） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>condition vs unless：</b> condition 在方法執行前評估（決定是否查 Cache），unless 在方法執行後評估（決定是否存入 Cache）。
</div>

<!--
condition 和 unless 的差異非常容易搞混：
condition = "方法要不要參與 Cache 機制"，在執行前決定
unless = "結果要不要存進 Cache"，在執行後決定
-->

---

# @Cacheable 屬性詳解（2/2）

```java
@Cacheable(
    value = "students",   // Cache 名稱
    key = "#p0",          // 以參數 id 當 key
    condition = "#p0 > 0",        // id > 0 才使用 Cache
    unless = "#result == null"    // 查出 null 不存入 Cache
)
public StudentResponse getStudentById(Integer id) { ... }
```

常見用法：`unless = "#result == null"` — 避免把「查不到資料」這個結果也快取起來，否則之後補資料也不會生效。

<!--
unless = "#result == null" 是實務上必加的保護。

想像一下：id=999 的商品不存在，查出 null 被快取了。
之後商品上架，id=999 有資料了，但 Cache 裡還是 null，使用者一直看不到新商品。
-->

---

# sync = true — 防止 Cache Stampede

**問題：** 熱門 key 剛過期的瞬間，100 個 thread 同時 Cache Miss → 同時打 DB 執行方法本體 → DB 被同一份查詢瞬間打 100 次（快取擊穿）。

```java
@Cacheable(value = "students", key = "#p0", sync = true)
public StudentResponse getStudentById(Integer id) { ... }
```

| | `sync = false`（預設） | `sync = true` |
|---|---|---|
| 同 key 並發 Miss | 每個 thread 各自執行方法本體 | 只放**一個** thread 執行，其餘阻塞等待 |
| DB 壓力 | 瞬間 N 次 | 1 次，其餘讀同一份結果 |
| 代價 | 無 | 等待的 thread 被 block（同 key 序列化） |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>限制：</b> ① <code>sync = true</code> 時不能同時用 <code>unless</code>（Spring 限制），<code>condition</code> 仍可用。② 只鎖同一個 key，不同 key 互不影響。③ 並非所有 CacheManager 都支援——Caffeine / ConcurrentMap 支援，Redis 的 <code>RedisCacheManager</code> 預設不支援。<b>熱點 key + 方法本體很貴才需要開，一般 CRUD 不用。</b></div>

<!--
sync 是 @Cacheable 五個屬性裡最少用、但關鍵時刻能救命的一個。

Cache Stampede（快取踩踏 / 快取擊穿）的情境：某個超熱門的 key，剛好 TTL 到期那一瞬間，
同時湧進 100 個請求，全部 Cache Miss，於是 100 個 thread 一起打 DB 跑同一個慢查詢。
快取本來是要保護 DB，結果過期瞬間反而變成放大器。

sync = true 的作法：同一個 key，同時只讓一個 thread 進去執行方法本體，
其他 thread 全部 block 在門外等，等第一個算完寫進 cache，大家直接讀那份。100 次 DB 變 1 次。

代價是等待的 thread 被 block，同一個 key 的並發被序列化了——但這很值得，
因為換來的是擋掉 DB 的瞬間風暴。

三個限制要記住：
1. sync = true 不能配 unless，會報錯；condition 還是可以用。
2. 只鎖同一個 key，不同 key 之間互不干擾。
3. 不是每個 CacheManager 都支援，Caffeine 和 ConcurrentMap 可以，
   Redis 的 RedisCacheManager 預設不支援 sync。

什麼時候開？熱點 key 加上方法本體很貴（慢查詢、重運算）才需要，一般 CRUD 不用開。
-->

---

# @Cacheable SpEL Key 表達式

| SpEL 表達式 | 意義 |
|---|---|
| `#id` | 方法參數 `id` |
| `#user.id` | 參數物件的屬性 |
| `#p0` | 第 0 個參數 |
| `#root.method.name` | 方法名稱 |
| `'prefix:' + #id` | 字串串接 |

```java
// 單一 PK：用 #p0 就夠，直接對應那一筆資料
@Cacheable(value = "students", key = "#p0")
public StudentResponse getStudentById(Integer id) { ... }
```

<!--
SpEL 是 Spring 的表達式語言，在 Cache 的 key 定義上非常好用。

記住一個口訣：「參數直接用 # 開頭，物件屬性用 . 取值，字串要加單引號」。

本章的 StudentService 都是用單一 PK（id）查詢，key 寫 #p0 就夠了，直接對應那一筆資料。
至於「多個參數要不要組成一個 key」，是另一個獨立主題，下一頁專門說明。
-->

---

# 什麼時候要組合 key？

**單一 PK 用 `#p0` 就好；沒有單一欄位能唯一識別時，才組合 key：**

```java
// ✅ 單一 PK：id 本身就唯一，直接 #p0
@Cacheable(value = "students", key = "#p0")
public StudentResponse getStudentById(Integer id) { ... }

// ✅ 多條件查詢：grade、year 都不是 PK，兩個合起來才唯一
@Cacheable(value = "gradeQuery", key = "#p0 + ':' + #p1")
public List<StudentResponse> getByGradeAndYear(String grade, Integer year) { ... }
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>不要對 PK 多此一舉：</b> 若 <code>getStudentById</code> 用 <code>#p0</code> 讀、<code>updateStudent</code> 卻用 <code>#p0 + ':' + #p1.name</code> 寫，兩邊 key 對不上 → <code>@CachePut</code> 寫進去的 entry 永遠讀不到，反而製造 bug。<b>讀寫 key 必須一致。</b></div>

<!--
這頁專門講「key 要不要組合」。

單一 PK（例如 getStudentById 的 id）用 #p0 就夠了，key 直接對應那一筆資料。

組合 key 只用在「沒有任何單一參數能唯一識別」的查詢，
例如 getByGradeAndYear：grade 和 year 都不是 PK，兩個合起來才能唯一定位這個查詢的結果，
這時才用 #p0 + ':' + #p1 把它們接成一個 key。

最容易犯的錯：對本來就是 PK 的 id 硬去組合別的欄位。
這樣 @Cacheable 用 #p0 讀、@CachePut 用 #p0 + 名字 寫，兩個 key 對不上，
更新完下次查詢還是讀到舊值——@CachePut 等於白做。記住：讀寫 key 一定要一致。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5

## @CacheEvict

<!--
有了 @Cacheable 之後，我們馬上就會遇到第二個問題：資料更新了，Cache 裡的舊資料怎麼辦？

這就是 @CacheEvict 要解決的問題。
-->

---

# @CacheEvict 基本用法與屬性

```java
@CacheEvict(value = "students", key = "#p0")
public void deleteStudent(Integer id) {
    studentRepository.deleteById(id); // 沿用 ch37
}

@CacheEvict(value = "students", allEntries = true)
public void clearAllStudentsCache() { }
```

| 屬性 | 說明 |
|---|---|
| `value` / `cacheNames` | 要清除哪個 Cache |
| `key` | 清除特定 Key |
| `allEntries` | `true` = 清除整個 Cache 所有 entry |
| `beforeInvocation` | `true` = 方法**執行前**就清除；預設 `false`（執行後） |
| `condition` | SpEL 條件，`true` 才執行清除 |

<!--
@CacheEvict 最常跟 update 和 delete 方法搭配。

allEntries = true 是一個很粗暴但有時候必要的選項，
例如當你做了一個批次更新，不確定影響了哪些 key，就直接把整個 Cache 清空。
-->

---

# beforeInvocation 的差異（1/2）

| | `beforeInvocation = false`（預設）| `beforeInvocation = true` |
|---|---|---|
| 清除時機 | 方法**成功執行後** | 方法**執行前** |
| 方法拋出例外 | Cache **不會被清除** | Cache **已被清除** |
| 適用場景 | 希望只有成功才清除 | 確保無論成功失敗都清除 |
| 資料一致性 | 較高 | 較低 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議：</b> 絕大多數場景用預設值（<code>false</code>）就好。
</div>

---

# beforeInvocation 的差異（2/2）

```java
// 預設（false）：DB 刪除成功才清 Cache
// → 若 deleteById() 拋出例外，Cache 保持原樣（資料仍正確）
@CacheEvict(value = "students", key = "#p0")
public void deleteStudent(Integer id) {
    studentRepository.deleteById(id);  // 若這裡炸了，Cache 不會被清
}

// beforeInvocation = true：先清 Cache，再執行方法
// → 就算 deleteById() 拋出例外，Cache 已被清除
@CacheEvict(value = "students", key = "#p0",
            beforeInvocation = true)
public void forceDeleteStudent(Integer id) {
    studentRepository.deleteById(id);
}
```

<!--
預設 false 的邏輯是：如果 DB 更新失敗（拋出例外），Cache 裡的資料還是對的，
所以不清除 Cache 是安全的行為。

如果設成 true，DB 更新失敗了但 Cache 已經被清掉，
下次查詢就會去 DB 重查——雖然 DB 裡還是舊資料，但至少 Cache 是空的。

選哪個沒有絕對正確，但要清楚自己的選擇代表什麼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6

## @CachePut

<!--
@CachePut 是三個注解裡面最容易被忽略的，但它有自己的適用場景。
-->

---

# @CachePut vs @Cacheable

| 比較項目 | `@Cacheable` | `@CachePut` |
|---|---|---|
| **主要用途** | 讀取資料時快取 | 更新資料時同步快取 |
| **方法本體** | Cache Hit 時**不執行** | **永遠執行** |
| **Cache 操作** | Hit → 直接回傳；Miss → 存入 | 永遠把結果**寫入** Cache |
| **典型搭配方法** | `findById`, `getXxx` | `update`, `save` |

```java
@CachePut(value = "students", key = "#p0")
public StudentResponse updateStudent(Integer id,
                                     CreateStudentRequest req) {
    Student po = new Student();
    po.setId(id);
    po.setName(req.getName());
    po.setPassword(req.getPassword());
    po.setScore(req.getScore());
    return toResponse(studentRepository.save(po)); // 沿用 ch37
}
```

<!--
@CachePut 的核心精神是：「我不管 Cache 裡有沒有，我就是要把最新的結果寫進去。」

跟 @CacheEvict 的差異在於：
@CacheEvict → 清除 Cache，下次查詢才會重新填入
@CachePut → 直接更新 Cache，下次查詢馬上得到新資料

如果更新後馬上就會有人來讀，用 @CachePut 更好；
如果更新後不一定有人讀，用 @CacheEvict 比較省資源。
-->

---

# 三個注解的組合使用 — @Cacheable

沿用 ch37 的 `StudentService`，三個方法都操作同一個 `"students"` Cache。先看讀取：

```java
@Service
public class StudentService {

    private static final Logger log =
        LoggerFactory.getLogger(StudentService.class);

    @Autowired
    private StudentRepository studentRepository;

    @Cacheable(value = "students", key = "#p0")
    public StudentResponse getStudentById(Integer id) {
        log.info("Cache Miss，查詢資料庫，id = {}", id);
        Student po = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        return toResponse(po);
    }

    // @CachePut 的 updateStudent 見下一頁，@CacheEvict 的 deleteStudent 見再下一頁
}
```

<!--
這是最典型的 CRUD Cache 搭配模式的第一段：讀取用 @Cacheable。

注意三個方法的 value 都會是 "students"，這樣它們操作的才是同一個 Cache 空間。

getStudentById 的 log 只有 Cache Miss 才出現——Cache Hit 時方法本體不執行，log 也不會印。
第一次呼叫某個 id 印 log，第二次同一個 id 沒有 log，就代表 Cache 生效了。
-->

---

# 三個注解的組合使用 — @CachePut

接著是更新：`@CachePut` 更新資料的同時把新值寫回同一個 `"students"` Cache：

```java
    @CachePut(value = "students", key = "#p0")
    public StudentResponse updateStudent(Integer id,
                                         CreateStudentRequest req) {
        log.info("更新學生並寫入 Cache，id = {}", id);
        Student po = new Student();
        po.setId(id);
        po.setName(req.getName());
        po.setPassword(req.getPassword());
        po.setScore(req.getScore());
        return toResponse(studentRepository.save(po));
    }

    // @CacheEvict 的 deleteStudent 見下一頁
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>讀寫 key 必須一致：</b> updateStudent 的 <code>key = "#p0"</code> 跟 getStudentById 完全相同，寫回的才是同一筆 entry，下次查詢才讀得到新值。</div>

<!--
第二段：更新用 @CachePut，key 一定要跟 @Cacheable 的 getStudentById 一樣是 #p0，
這樣 update 覆蓋的才是同一筆 cache entry，下次查詢直接讀到新值。

跟 getStudentById 不同：updateStudent 加 @CachePut 後方法一定會執行，所以 log 每次都會印，
這是 @Cacheable（Hit 不執行）和 @CachePut（永遠執行）行為差異最直接的證據。

跟原本 Product 範例不同的是，ch37 的 updateStudent 本來就把 id 當作方法參數傳進來，
所以 key 直接寫 "#p0"（第 0 個參數 id）就好，不需要像 "#result.id" 那樣繞去取回傳值的欄位。
-->

---

# 三個注解的組合使用 — @CacheEvict

```java
    @CacheEvict(value = "students", key = "#p0")
    public void deleteStudent(Integer id) {
        log.info("刪除學生並清除 Cache，id = {}", id);
        studentRepository.deleteById(id);
    }

    private StudentResponse toResponse(Student po) { ... } // 沿用 ch37
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>重點：</b> 三個方法的 <code>value</code> 都是 <code>"students"</code>，操作的是同一個 Cache 空間；key 都直接用 <code>"#p0"</code>（第 0 個參數 id），不依賴編譯器 <code>-parameters</code> 設定。</div>

<!--
deleteStudent 用 @CacheEvict 清掉對應 id 的 Cache，跟前一頁的 getStudentById、updateStudent 合起來，就是完整的 CRUD Cache 搭配模式。

驗證方式：呼叫 getStudentById(1) 兩次，第二次沒有 log；接著呼叫 deleteStudent(1)，再呼叫 getStudentById(1)，這次又會看到 log——因為 Cache 已經被清除，重新變成 Cache Miss。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7

## Caffeine Cache 設定

<!--
前面的範例都用預設的 ConcurrentMap，現在來看正式環境常用的 Caffeine。
-->

---

# Caffeine application.properties 設定（1/2）

```properties
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
spring.cache.cache-names=products,categories,users
```

**Caffeine spec 常用參數：**

| 參數 | 說明 | 範例 |
|---|---|---|
| `maximumSize` | 最多存幾個 entry | `maximumSize=1000` |
| `expireAfterWrite` | 寫入後過期 | `expireAfterWrite=10m` |
| `expireAfterAccess` | 最後存取後過期 | `expireAfterAccess=5m` |
| `initialCapacity` | 初始容量 | `initialCapacity=100` |

---

# Caffeine application.properties 設定（2/2）

**expireAfterWrite vs expireAfterAccess：**

| | `expireAfterWrite` | `expireAfterAccess` |
|---|---|---|
| 計時起點 | 寫入時間 | 最後一次存取時間 |
| 時間到就過期？ | 是，不管有沒有人用 | 只要有人存取就重置計時 |
| 適合場景 | 資料有明確時效性（如匯率、天氣） | 熱點資料，一直有人用就不過期 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 不確定選哪個？優先用 <code>expireAfterWrite</code>，行為可預期，不會因為「一直有人讀」就永遠不更新。
</div>

<!--
`expireAfterWrite` vs `expireAfterAccess` 是一個常見的選擇：

expireAfterWrite：從「寫入時間」算起，不管有沒有人讀，時間到就過期。適合資料有明確時效性的場景。
expireAfterAccess：從「最後一次存取時間」算起，一直有人用就不會過期。適合熱點資料。
-->

---

# Caffeine Cache 完整使用範例

**Step 1 — build.gradle：**
```groovy
implementation 'org.springframework.boot:spring-boot-starter-cache'
implementation 'com.github.ben-manes.caffeine:caffeine'
```

**Step 2 — application.properties：**
```properties
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
spring.cache.cache-names=students
```

**Step 3 — 主程式加 @EnableCaching，Service 加注解（與之前完全相同）：**
```java
@Cacheable(value = "students", key = "#p0")
public StudentResponse getStudentById(Integer id) { ... }

@CacheEvict(value = "students", key = "#p0")
public void deleteStudent(Integer id) { ... }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>重點：</b> 換成 Caffeine 後，Service 的 <code>@Cacheable</code> 注解完全不用改，只有設定檔不同。</div>

<!--
這就是 Spring Cache 抽象層的優雅之處：業務程式碼不用動，換底層只改設定。
-->

---

# Caffeine vs ConcurrentMap — 差在哪？

注解寫法**完全一樣**（抽象層把差異藏起來了），差別在底層 CacheManager 的能力：

| 能力 | `ConcurrentMapCacheManager`（預設） | `CaffeineCacheManager` |
|---|---|---|
| 底層 | `ConcurrentHashMap` | Window-TinyLFU 演算法 |
| **TTL 過期** | ❌ 無，存進去永不過期 | ✅ `expireAfterWrite` / `expireAfterAccess` |
| **容量上限 / 淘汰** | ❌ 無，無限長大 | ✅ `maximumSize`，滿了淘汰最少用的 |
| 記憶體風險 | ⚠️ 只增不減 → 可能 OOM | 有上限，受控 |
| 統計（hit/miss） | ❌ | ✅ `recordStats()` |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>致命差異就兩個：ConcurrentMap 沒有 TTL、沒有容量上限。</b> 資料存進去永不過期（只能靠 @CacheEvict 手動清）、且無限增長直到 OOM。所以 ConcurrentMap 只適合開發測試；正式單機請用 Caffeine。</div>

<!--
這頁收尾 Caffeine 章節，回答一個很常見的疑問：既然注解寫法一模一樣，那 Caffeine 跟預設的 ConcurrentMap 到底差在哪？

答案是：注解一樣，是因為 Spring Cache 抽象層把底層差異藏起來了；真正的差別在 CacheManager 的能力。

最致命的兩個差異：
1. ConcurrentMap 沒有 TTL——資料存進去永遠不會過期，資料變了 cache 也不會自己失效，只能靠 @CacheEvict 手動清。
2. ConcurrentMap 沒有容量上限——key 一多就無限增長，最後 OOM。

Caffeine 兩個都有：expireAfterWrite/Access 管過期，maximumSize 管容量，滿了用 Window-TinyLFU 淘汰最少用的（命中率比傳統 LRU 好）。

所以定位很清楚：ConcurrentMap 開箱即用、零依賴，適合開發測試 demo；但不能上正式。正式單機一定要用 Caffeine，才有 TTL 和記憶體控制。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 8

## Redis Cache 補充（概念先行）

<!--
Caffeine 很好，但它有一個致命的限制：它住在單一 JVM 記憶體裡。

如果你的應用程式部署了多個 Pod，每個 Pod 各自有自己的 Caffeine Cache，Cache 之間沒辦法同步——這就需要 Redis 這種分散式 Cache。
-->

---

# 前置需求：Redis 需要一台 Server

Caffeine 是純 Java library，和 app 同一個 JVM；**Redis 是獨立的外部服務**，app 要透過網路連它。

| | 要跑外部服務？ | 怎麼來 |
|---|---|---|
| ConcurrentMap | ❌ | 內建 |
| Caffeine | ❌（同 JVM） | 加 jar 依賴 |
| Redis | ✅ **要一台 Redis server** | Docker / 本機安裝 / 雲端託管 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>本章 Redis 段落先看「概念與設定」就好，實際動手留到 Docker 章節之後。</b> 啟動 Redis 最方便的方式是 Docker：
<pre class="mt-2"><code>docker run -d -p 6379:6379 redis</code></pre>
</div>

<!--
這頁是給學員的重要提醒。

Redis 跟前面的 Caffeine、ConcurrentMap 有個根本差別：它不是一個 Java library，
而是一台獨立的伺服器，你的 app 要透過網路（預設 localhost:6379）去連它。

所以用 Redis 的前提，是先有一台跑著的 Redis server。最方便的啟動方式是 Docker，
一行指令 docker run -d -p 6379:6379 redis 就起來了。

但我們現在還沒上 Docker 章節，學員手上也還沒有 Docker 環境，
所以這一段 Redis 我們先講「觀念」和「設定長什麼樣」，先不實際動手跑。

等之後上完 Docker，大家有能力用一行指令把 Redis 跑起來，我們再回來實作這一段。
現在只要理解：Redis 的定位是「多台機器（多個 Pod）共享同一份 Cache」，
這是 Caffeine 這種本地快取做不到的。
-->

---

# Redis Cache application.properties 設定

依賴已在前面「build.gradle 依賴」頁加入 `spring-boot-starter-data-redis`，這裡只需設定：

```properties
spring.cache.type=redis
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.cache.redis.time-to-live=600000
spring.cache.redis.key-prefix=myapp:
spring.cache.redis.use-key-prefix=true
```

<!--
Redis 的設定非常直覺，Spring Boot 偵測到 spring-boot-starter-data-redis 在 classpath 上，
加上 spring.cache.type=redis，就會自動配置 RedisCacheManager。

key-prefix 是一個很好的習慣，特別是當你的 Redis 服務是多個應用程式共用的時候，
加前綴可以避免 key 碰撞（collision）。
-->

---

# Redis Cache 自訂 Java Config

```java
@Configuration
public class RedisCacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
        RedisCacheConfiguration defaults = RedisCacheConfiguration
            .defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10))
            .serializeValuesWith(RedisSerializationContext
                .SerializationPair
                .fromSerializer(
                    new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.builder(factory)
            .cacheDefaults(defaults)
            .build();
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>序列化建議：</b> 使用 <code>GenericJackson2JsonRedisSerializer</code>，存成 JSON 格式，好讀、好 debug、跨語言也沒問題。避免預設的 JDK 序列化（版本不相容、可讀性差）。
</div>

<!--
這裡有一個很重要的細節：序列化。

Redis 存的是 byte[]，所以物件要轉成 byte 才能存進去。

預設的 JDK 序列化雖然可用，但可讀性很差（你打開 Redis 看到一堆亂碼），
而且不同版本的 class 可能不相容。

建議用 GenericJackson2JsonRedisSerializer，存成 JSON 格式。
-->

---

# Redis Cache 完整使用範例（1/4）

**Step 1 — build.gradle：**
```groovy
implementation 'org.springframework.boot:spring-boot-starter-cache'
implementation 'org.springframework.boot:spring-boot-starter-data-redis'
```

**Step 2 — application.properties：**
```properties
spring.cache.type=redis
spring.data.redis.host=localhost
spring.data.redis.port=6379
spring.cache.redis.time-to-live=600000
spring.cache.redis.key-prefix=myapp:
spring.cache.redis.use-key-prefix=true
```

**Step 3 — 主程式：**
```java
@SpringBootApplication
@EnableCaching
public class MyApplication { ... }
```

---

# Redis Cache 完整使用範例（2/4）

**Step 4 — Service 注解與 Caffeine 完全相同，先看 @Cacheable：**
```java
@Service
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Cacheable(value = "students", key = "#p0",
               unless = "#result == null")
    public StudentResponse getStudentById(Integer id) {
        Student po = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        return toResponse(po);
    }

    // @CachePut 的 updateStudent 見下一頁，@CacheEvict 的 deleteStudent 見再下一頁
}
```

<!--
Step 4 的第一段：@Cacheable，跟 Caffeine 版本完全一樣，一行都不用改。
unless = "#result == null" 一樣要加，避免把查不到的 null 也存進 Redis。
-->

---

# Redis Cache 完整使用範例（3/4）

**Step 4（續）— @CachePut：**
```java
    @CachePut(value = "students", key = "#p0")
    public StudentResponse updateStudent(Integer id,
                                         CreateStudentRequest req) {
        Student po = new Student();
        po.setId(id);
        po.setName(req.getName());
        po.setPassword(req.getPassword());
        po.setScore(req.getScore());
        return toResponse(studentRepository.save(po));
    }
```

<!--
Step 4 的第二段：@CachePut，key 一樣是 #p0，跟 @Cacheable 讀取端一致，
更新後下次查詢直接從 Redis 讀到新值。這段也跟 Caffeine 版本一字不差。
-->

---

# Redis Cache 完整使用範例（4/4）

**Step 4（續）— @CacheEvict：**
```java
    @CacheEvict(value = "students", key = "#p0")
    public void deleteStudent(Integer id) {
        studentRepository.deleteById(id);
    }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>Caffeine → Redis 移轉：</b> Service 的注解一行都不用改，只需換 build.gradle 依賴和 application.properties 設定。</div>

<!--
這就是 Spring Cache 抽象層設計的核心價值：
本機開發用 Caffeine，部署多機時換 Redis，業務程式碼零改動。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 9

## 注意事項：什麼時候不該用 Cache？

<!--
學完怎麼用 Cache，我們必須談談「什麼時候不該用」。

任何技術都有適用場景和不適用場景，Cache 也不例外。
-->

---

# Cache 的適用與不適用場景

| 適合用 Cache ✅ | 不適合用 Cache ❌ |
|---|---|
| 讀多寫少的資料（商品資訊、分類） | 讀寫頻率相當的資料 |
| 計算成本高的結果（報表統計） | 每次都需要最新資料（庫存、餘額） |
| 資料在短時間內不會改變 | 需要強一致性的金融交易 |
| 相同參數的查詢重複出現 | 幾乎每次參數都不同 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>黃金法則：</b> Cache 本質上是「以記憶體換時間、以一致性換效能」的取捨。務必確認業務邏輯允許這個取捨再使用。
</div>

<!--
「庫存」絕對不能 Cache——使用者買東西的時候，庫存必須即時準確。
「餘額」絕對不能 Cache——轉帳的時候看到的必須是最新餘額。

對於這些強一致性需求，就算 Cache 能讓程式變快，也不能用。
-->

---

# Cache 常見踩坑陷阱

| 問題 | 說明 | 解法 |
|---|---|---|
| Cache 不生效 | 在同一個 Bean 內呼叫自己 → AOP Proxy 繞過 | 注入自己或獨立 Service |
| Null 值被快取 | 查不到資料也存進 Cache | 加 `unless = "#result == null"` |
| Key 衝突 | 多個方法 key 策略相同但語意不同 | 加上方法名稱或 namespace 前綴 |
| 序列化失敗 | Redis 模式下物件未實作 Serializable | 改用 JSON 序列化 |
| 記憶體暴增 | 沒設 maximumSize，Cache 無限增長 | Caffeine spec 加 `maximumSize` |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>最常踩的坑：</b> 在同一個 Bean 內，A 方法呼叫同 Bean 的 B 方法（B 有 @Cacheable），Cache 完全不會生效——因為 Spring AOP 只攔截從外部進來的呼叫。</div>

<!--
同一個 Bean 自我呼叫繞過 AOP，是初學 Spring AOP 最常遇到的坑，不只是 Cache，
@Transactional 也一樣。

解法有兩種：
1. 把有 Cache 的方法抽到另一個 Service Bean
2. 用 @Autowired 注入自己（有點怪，但可以用）

實務上我推薦第一種，架構更清晰。
-->

---
layout: default
---

# 練習一：學生查詢 Cache
### 任務說明

**情境：** 學生查詢 API 每秒呼叫上千次，但學生資料幾乎不變。

**任務：** 沿用 ch37 已經寫好的 `StudentService`（不用新建 Repository 或 Entity）

1. 為 `getStudentById(Integer id)` 加上 `@Cacheable`，Cache 名稱為 `"students"`，key 為學生 id
2. 為 `updateStudent(Integer id, CreateStudentRequest req)` 加上 `@CachePut`，確保更新後 Cache 也是最新的
3. 為 `deleteStudent(Integer id)` 加上 `@CacheEvict`，刪除時清除對應 Cache
4. 在 `application.properties` 加入 Caffeine 設定，TTL 10 分鐘，最多 500 筆
5. 撰寫測試方法，驗證第二次呼叫 `getStudentById` 時沒有打資料庫（透過 mock `studentRepository` 驗證呼叫次數）

<!--
這個練習涵蓋了今天的核心內容：三個注解 + Caffeine 設定，全部套用在 ch37 已經寫好的 StudentService 上，不用新建任何業務類別。

特別強調第 5 點：要驗證 Cache 有真的生效。

很多人加了注解但不驗證，結果 Cache 根本沒起作用（可能是 @EnableCaching 忘了加）。
-->

---
layout: default
---

# 練習一：解題提示
### 提示說明

1. build.gradle 加 `spring-boot-starter-cache` + `caffeine`；主程式加 `@EnableCaching`
2. `@Cacheable(value = "students", key = "#p0")`
3. `@CachePut(value = "students", key = "#p0")`
4. `@CacheEvict(value = "students", key = "#p0")`

```properties
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
spring.cache.cache-names=students
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>常見錯誤排查：</b> ① 有 @EnableCaching 嗎？ ② Cache value 名稱一致嗎？ ③ key 的 SpEL 表達式正確嗎？ ④ 是否在同一個 Bean 內自我呼叫？</div>

<!--
常見錯誤排查清單要記起來，幾乎所有 Cache 不生效的問題都出在這四個地方。

跟原本的 Product 範例不同：ch37 的 updateStudent 本來就把 id 當參數傳進來，
所以 @CachePut 的 key 直接寫 "#p0"（第 0 個參數 id）就好，不用像 "#result.id" 那樣去取回傳值的欄位。
-->

---

# 練習一：解答程式碼 — StudentService（1/3）

```java
@Service
public class StudentService {

    private static final Logger log =
        LoggerFactory.getLogger(StudentService.class);

    @Autowired
    private StudentRepository studentRepository;

    @Cacheable(value = "students", key = "#p0")
    public StudentResponse getStudentById(Integer id) {
        log.info("Cache Miss，查詢資料庫，id = {}", id);
        Student po = studentRepository.findById(id)
            .orElseThrow(() ->
                new RuntimeException("Student not found: " + id));
        return toResponse(po);
    }

    // updateStudent、deleteStudent、toResponse 見後面兩頁
}
```

<!--
先看 getStudentById：加了 log.info 在方法開頭，方便從 console 觀察 Cache 有沒有生效。

這個 log 只有 Cache Miss 才會印——Cache Hit 時整個方法本體都不執行，log 也就不會印出來。
-->

---

# 練習一：解答程式碼 — StudentService（2/3）

```java
    @CachePut(value = "students", key = "#p0")
    public StudentResponse updateStudent(Integer id,
                                         CreateStudentRequest req) {
        log.info("更新學生並寫入 Cache，id = {}", id);
        Student po = new Student();
        po.setId(id);
        po.setName(req.getName());
        po.setPassword(req.getPassword());
        po.setScore(req.getScore());
        return toResponse(studentRepository.save(po));
    }

    // deleteStudent、toResponse 見下一頁
```

<!--
updateStudent 因為是 @CachePut，方法一定會執行，log 每次都會印——這跟 getStudentById 的 @Cacheable 行為不同，是很好的對照組。
-->

---

# 練習一：解答程式碼 — StudentService（3/3）

```java
    @CacheEvict(value = "students", key = "#p0")
    public void deleteStudent(Integer id) {
        log.info("刪除學生並清除 Cache，id = {}", id);
        studentRepository.deleteById(id);
    }

    private StudentResponse toResponse(Student po) {
        ScoreVO scoreVO = new ScoreVO(po.getScore());
        StudentResponse resp = new StudentResponse();
        resp.setId(po.getId());
        resp.setName(po.getName());
        resp.setScore(scoreVO.getValue());
        resp.setLetterGrade(scoreVO.getLetterGrade());
        return resp; // 刻意不複製 password，沿用 ch37
    }
}
```

```properties
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
spring.cache.cache-names=students
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>觀察方式：</b> 呼叫 <code>getStudentById(1)</code> 兩次，只有第一次印出 log；呼叫 <code>deleteStudent(1)</code> 後再呼叫一次，log 又出現了——代表 Cache 被清除、重新變成 Miss。</div>

<!--
deleteStudent 和 toResponse 補完整個 Service。toResponse 沿用 ch37 的寫法，不重複造輪子。

三個注解 + Caffeine 設定到這裡就是完整解答，下一頁補一個 Mockito 測試，直接用程式驗證 Cache 有沒有生效，不用只靠肉眼看 log。
-->

---

# 練習一：解答程式碼 — 測試驗證

```java
@SpringBootTest
class StudentServiceCacheTest {

    @Autowired
    private StudentService studentService;

    @MockBean
    private StudentRepository studentRepository;

    @Test
    void getStudentById_呼叫兩次_只打一次資料庫() {
        Student po = new Student();
        po.setId(1); po.setName("Alice"); po.setScore(85);
        when(studentRepository.findById(1)).thenReturn(Optional.of(po));

        studentService.getStudentById(1);
        studentService.getStudentById(1);

        verify(studentRepository, times(1)).findById(1);
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>重點：</b> <code>verify(..., times(1))</code> 直接證明第二次呼叫沒有再打資料庫，比看 log 更嚴謹，適合放進 CI。</div>

<!--
這個測試用 @SpringBootTest 啟動完整 Spring Context，確保 @Cacheable 的 AOP Proxy 真的生效（單純 @ExtendWith(MockitoExtension.class) 不會啟動 Spring AOP，Cache 不會作用）。

呼叫兩次 getStudentById(1)，但 verify 只驗證 findById(1) 被呼叫一次——第二次被 Cache 攔截掉了，這就是「用測試證明 Cache 生效」最直接的寫法。
-->

---
layout: default
---

# 練習二：學生等第查詢 Cache + 定時清除
### 任務說明

**情境：** 老師常常需要查「A 等第的學生有哪些」，這種依字母等第分組的查詢重複度很高；管理員可以在成績重新計算後手動清除 Cache。

**任務：** 在 ch37 的 `StudentService` 裡新增一個方法，沿用既有的 `getAllStudents()` 與 `StudentResponse.getLetterGrade()`（由 ch37 的 `ScoreVO` 計算）

1. 建立 `getStudentsByGrade(String grade)` — 呼叫 `getAllStudents()` 並用 Stream 篩選出 `letterGrade` 等於 `grade` 的學生
2. 加 `@Cacheable`，Cache 名稱為 `"studentGrades"`，key 為 grade，condition 為「grade 不為空字串」
3. 加 `unless = "#result.isEmpty()"` — 若查詢結果為空，不存入 Cache
4. 建立 `refreshGradeCache()` 方法 — 加 `@CacheEvict(allEntries = true)` 清除整個等第 Cache
5. 思考題：為什麼這個場景要用 `@CacheEvict` 而不是 `@CachePut`？

<!--
這個練習不新建任何 Repository 或 Entity，完全建立在 ch37 已有的 getAllStudents() 和 ScoreVO 之上。

重點在兩個地方：

condition 和 unless 的實際應用。

思考題：為什麼用 @CacheEvict 不用 @CachePut？
因為 refreshGradeCache 只是清除，沒有回傳新資料，@CachePut 要求方法本體回傳要快取的值。
-->

---
layout: default
---

# 練習二：解題提示 — 查詢方法
### 提示說明

```java
public List<StudentResponse> getStudentsByGrade(String grade) {
    return getAllStudents().stream()   // 沿用 ch37 的 getAllStudents()
        .filter(s -> s.getLetterGrade().equals(grade))
        .collect(Collectors.toList());
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>重點：</b> <code>letterGrade</code> 是 ch37 的 <code>toResponse()</code> 裡用 <code>ScoreVO.getLetterGrade()</code> 算出來的，這裡直接沿用，不重複造輪子。</div>

<!--
先看不加 Cache 注解的原始查詢方法：呼叫 ch37 的 getAllStudents()，用 Stream 篩選出 letterGrade 相符的學生。

下一頁再加上 @Cacheable 和 @CacheEvict。
-->

---

# 練習二：解題提示 — Cache 注解
### 提示說明

```java
@Cacheable(
    value = "studentGrades",
    key = "#grade",
    condition = "#grade != null && !#grade.isEmpty()",
    unless = "#result.isEmpty()"
)
public List<StudentResponse> getStudentsByGrade(String grade) { ... }

@CacheEvict(value = "studentGrades", allEntries = true)
public void refreshGradeCache() { }
```

| | `@CacheEvict` | `@CachePut` |
|---|---|---|
| refreshGradeCache 情境 | 清空，等下次請求重填 ✅ | 需要回傳新值，但等第有 A/B/C/F 多組 ❌ |

<!--
refreshGradeCache 用 @CacheEvict(allEntries = true) 是最自然的解法。

清空之後，下一個來查詢的請求會觸發 Cache Miss，重新用 getAllStudents() 算出最新的等第分組，
然後存進 Cache。這樣的「懶惰載入」策略在這種分組查詢情境很常見。
-->

---

# 練習二：解答程式碼 — getStudentsByGrade

```java
@Service
public class StudentService {
    private static final Logger log =
        LoggerFactory.getLogger(StudentService.class);
    @Autowired
    private StudentRepository studentRepository;
    // getAllStudents()、toResponse() 沿用 ch37，這裡不重複列出
    @Cacheable(
        value = "studentGrades",
        key = "#grade",
        condition = "#grade != null && !#grade.isEmpty()",
        unless = "#result.isEmpty()"
    )
    public List<StudentResponse> getStudentsByGrade(String grade) {
        log.info("Cache Miss，重新計算等第分組，grade = {}", grade);
        return getAllStudents().stream()
            .filter(s -> s.getLetterGrade().equals(grade))
            .collect(Collectors.toList());
    }
    // refreshGradeCache 見下一頁
}
```

<!--
getStudentsByGrade 的 log 放在方法開頭，只有 Cache Miss（第一次查某個 grade，或 Cache 被清除後）才會印出來。
-->

---

# 練習二：解答程式碼 — refreshGradeCache

```java
    @CacheEvict(value = "studentGrades", allEntries = true)
    public void refreshGradeCache() {
        log.info("清除所有等第 Cache");
    }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>觀察方式：</b> 連續呼叫 <code>getStudentsByGrade("A")</code> 兩次，只有第一次印出 log；呼叫 <code>refreshGradeCache()</code> 後再呼叫一次，log 又出現了。</div>

<!--
refreshGradeCache 本身也加了 log，方便確認排程或管理員按鈕真的觸發了清除動作——這跟前面 getStudentsByGrade 的 log 是兩種不同用途：一個是「有沒有打資料庫」，一個是「有沒有清 Cache」。
-->

---

# 練習二：解答程式碼 — 測試驗證（1/2）

```java
@SpringBootTest
class StudentGradeCacheTest {

    @Autowired
    private StudentService studentService;

    @Test
    void getStudentsByGrade_連續呼叫_只計算一次() {
        List<StudentResponse> first = studentService.getStudentsByGrade("A");
        List<StudentResponse> second = studentService.getStudentsByGrade("A");

        assertEquals(first, second);
        // 可另外用 Spy 或計數器驗證 Stream 篩選邏輯只跑了一次
    }

    // refreshGradeCache 的測試見下一頁
}
```

<!--
第一個測試：連續呼叫兩次 getStudentsByGrade("A")，驗證回傳結果一致——搭配 console 的 log 觀察，第二次不會再印出 Cache Miss 的訊息。
-->

---

# 練習二：解答程式碼 — 測試驗證（2/2）

```java
    @Test
    void refreshGradeCache_清除後_下次查詢重新計算() {
        studentService.getStudentsByGrade("A");
        studentService.refreshGradeCache();
        studentService.getStudentsByGrade("A"); // 這次會是 Cache Miss，log 會再印一次
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>重點：</b> 這裡沒有 mock 資料庫（因為底層是記憶體資料，不像練習一有 Repository 可以 verify 呼叫次數），驗證方式改成觀察 console 的 log 有沒有重複出現。</div>

<!--
跟練習一不同，這裡的資料來源是 getAllStudents() 直接查全部學生，沒有一個乾淨的「呼叫次數」可以 verify，所以測試改用「log 有沒有重複印出來」當作觀察指標，這也是為什麼 Part 4 到 Part 6 的範例都刻意加了 log——沒有 log，Cache 生效與否幾乎沒辦法從外部觀察到。
-->

---

# 本章總結 — 三個核心注解

| 注解 | 動作 | 典型搭配 |
|---|---|---|
| `@Cacheable` | 有 Cache 就直接回傳；沒有就執行方法並存入 | `findById`, `getXxx` |
| `@CacheEvict` | 清除指定 key 或整個 Cache | `update`, `delete` |
| `@CachePut` | 永遠執行方法，結果寫入 Cache | `update`（想立即更新 Cache） |

<!--
先複習三個核心注解的動作與典型搭配方法。

記住那個便利貼的比喻：
@Cacheable = 查完貼便利貼
@CacheEvict = 資料改了撕舊便利貼
@CachePut = 資料改了換新便利貼

下一頁看怎麼選 Cache 實作。
-->

---

# 本章總結 — 選擇 Cache 實作

| 環境 | 建議 |
|---|---|
| 單機開發 | ConcurrentMap（預設）或 Caffeine |
| 正式單機 | Caffeine（效能佳，支援 TTL / 容量限制） |
| 正式多機（水平擴展） | Redis（分散式，多 Pod 共享） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記住：</b> Cache 是「讀多寫少、可容忍短暫不一致」場景的最佳解。強一致性需求（庫存、餘額）請不要用 Cache。
</div>

<!--
來做個收尾。

希望今天的內容對大家有幫助，我們下一章見！
-->

---
layout: end
---

# Q & A

有任何問題歡迎提問！

<!--
這章內容不少，大家有沒有什麼問題？

最常被問到的問題是：「@CachePut 和先 @CacheEvict 再 @Cacheable 有什麼差？」

差異在於時序：
@CachePut：這次更新完馬上就有新的 Cache，下次查詢零 latency
@CacheEvict + @Cacheable：這次更新清除 Cache，下次查詢第一次還是要打資料庫，才會重新填入

好，今天就到這裡，謝謝大家！
-->
