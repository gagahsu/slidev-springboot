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

# 本章大綱

<table class="index-table">
  <thead>
    <tr><th>順序</th><th>主題</th></tr>
  </thead>
  <tbody>
    <tr><td>01</td><td>為什麼需要 Cache？</td></tr>
    <tr><td>02</td><td>Spring Cache 抽象層與 CacheManager</td></tr>
    <tr><td>03</td><td>pom.xml 依賴與 @EnableCaching</td></tr>
    <tr><td>04–06</td><td>@Cacheable 深度解析（key / condition / unless）</td></tr>
    <tr><td>07–08</td><td>@CacheEvict 與 beforeInvocation</td></tr>
    <tr><td>09–10</td><td>@CachePut 與 @Cacheable 比較</td></tr>
    <tr><td>11–12</td><td>Caffeine Cache 設定</td></tr>
    <tr><td>13–14</td><td>Redis Cache 補充</td></tr>
    <tr><td>15</td><td>注意事項：什麼時候不該用 Cache？</td></tr>
    <tr><td>16–19</td><td>實作練習 ×2</td></tr>
    <tr><td>20</td><td>本章總結</td></tr>
  </tbody>
</table>

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

# pom.xml 依賴

**最小依賴（記憶體 Cache）：**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

**加入 Caffeine（高效能記憶體 Cache）：**

```xml
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
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

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>常見錯誤：</b> 依賴加了、注解也貼了，但忘了 <code>@EnableCaching</code>，Cache 完全不會生效！</div>

<!--
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

# @Cacheable 基本用法

```java
@Service
public class ProductService {

    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        // 這段程式碼只有 Cache Miss 時才會執行
        return productRepository.findById(id).orElseThrow();
    }
}
```

**執行流程：**

| 步驟 | Cache Hit | Cache Miss |
|---|---|---|
| 查 Cache | 找到資料 → 直接回傳 | 找不到 → 執行方法本體 |
| 方法本體 | 不執行 | 執行，查資料庫 |
| 存入 Cache | 不需要 | 把結果存入 Cache |

<!--
注意一個很重要的概念：Cache Hit 的時候，方法本體完全不會執行。

這意味著如果你在方法裡面有副作用（例如記錄 log、更新統計），Cache Hit 時這些都不會發生。

value 是 Cache 的名稱，就像便利貼的標籤；key 是用 SpEL 表達式指定的查詢鍵。
-->

---

# @Cacheable 屬性詳解

| 屬性 | 型別 | 說明 |
|---|---|---|
| `value` / `cacheNames` | `String[]` | Cache 名稱（可多個） |
| `key` | SpEL | Cache Key 的表達式 |
| `condition` | SpEL | 為 `true` 才使用 Cache（執行前判斷） |
| `unless` | SpEL | 為 `true` 就**不**存入 Cache（執行後判斷） |
| `sync` | `boolean` | 是否同步（防止 Cache Stampede） |

```java
@Cacheable(
    value = "products",
    key = "#id",
    condition = "#id > 0",
    unless = "#result == null"
)
public Product findById(Long id) { ... }
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>condition vs unless：</b> condition 在方法執行前評估（決定是否查 Cache），unless 在方法執行後評估（決定是否存入 Cache）。
</div>

<!--
condition 和 unless 的差異非常容易搞混：

condition = "方法要不要參與 Cache 機制"，在執行前決定
unless = "結果要不要存進 Cache"，在執行後決定

常見用法：unless = "#result == null" 表示「如果查出來是 null 就不要存進 Cache」
——避免把「查不到」這個結果快取起來。
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
// 多參數組合 key
@Cacheable(value = "search", key = "#keyword + ':' + #page")
public Page<Product> search(String keyword, int page) { ... }
```

<!--
SpEL 是 Spring 的表達式語言，在 Cache 的 key 定義上非常好用。

記住一個口訣：「參數直接用 # 開頭，物件屬性用 . 取值，字串要加單引號」。

多參數組合 key 是實務上很常見的需求，例如分頁查詢——同一個關鍵字但不同頁，
Cache 的 key 當然要不一樣。
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
@CacheEvict(value = "products", key = "#product.id")
public Product update(Product product) {
    return productRepository.save(product);
}

@CacheEvict(value = "products", allEntries = true)
public void clearAll() { }
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

# beforeInvocation 的差異

| | `beforeInvocation = false`（預設）| `beforeInvocation = true` |
|---|---|---|
| 清除時機 | 方法**成功執行後** | 方法**執行前** |
| 方法拋出例外 | Cache **不會被清除** | Cache **已被清除** |
| 適用場景 | 希望只有成功才清除 | 確保無論成功失敗都清除 |
| 資料一致性 | 較高 | 較低 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議：</b> 絕大多數場景用預設值（<code>false</code>）就好，只有在「方法本體需要先看到最新資料」的特殊情況才考慮 <code>true</code>。
</div>

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
@CachePut(value = "products", key = "#product.id")
public Product update(Product product) {
    return productRepository.save(product);
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

# 三個注解的組合使用

```java
@Service
public class ProductService {

    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        return productRepository.findById(id).orElseThrow();
    }

    @CachePut(value = "products", key = "#result.id")
    public Product update(Product product) {
        return productRepository.save(product);
    }

    @CacheEvict(value = "products", key = "#id")
    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }
}
```

<!--
這是最典型的 CRUD Cache 搭配模式。

注意三個方法的 value 都是 "products"，這樣它們操作的才是同一個 Cache 空間。

@CachePut 用了 "#result.id"——因為 key 要用回傳值的 id，
而不是傳入的 product 物件（雖然通常一樣，但用 result 更精確）。
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

# Caffeine application.properties 設定

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

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>expireAfterWrite vs expireAfterAccess：</b> 前者從「寫入時間」算起，有明確時效性；後者從「最後存取時間」算起，只要有人用就不過期，適合熱點資料。
</div>

<!--
`expireAfterWrite` vs `expireAfterAccess` 是一個常見的選擇：

expireAfterWrite：從「寫入時間」算起，不管有沒有人讀，時間到就過期。適合資料有明確時效性的場景。
expireAfterAccess：從「最後一次存取時間」算起，一直有人用就不會過期。適合熱點資料。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 8

## Redis Cache 補充

<!--
Caffeine 很好，但它有一個致命的限制：它住在單一 JVM 記憶體裡。

如果你的應用程式部署了多個 Pod，每個 Pod 各自有自己的 Caffeine Cache，Cache 之間沒辦法同步——這就需要 Redis 這種分散式 Cache。
-->

---

# Redis Cache pom.xml 與設定

**加入 Redis Starter：**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

**application.properties：**

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

# 練習一：商品查詢 Cache
### 任務說明

**情境：** 電商平台的商品查詢每秒呼叫上千次，但商品資料幾乎不變。

**任務：**

1. 建立 `ProductService`，為 `findById(Long id)` 加上 `@Cacheable`，Cache 名稱為 `"products"`，key 為商品 id
2. 為 `update(Product product)` 加上 `@CachePut`，確保更新後 Cache 也是最新的
3. 為 `deleteById(Long id)` 加上 `@CacheEvict`，刪除時清除對應 Cache
4. 在 `application.properties` 加入 Caffeine 設定，TTL 10 分鐘，最多 500 筆
5. 撰寫測試方法，驗證第二次呼叫 `findById` 時沒有打資料庫（透過 mock 驗證呼叫次數）

<!--
這個練習涵蓋了今天的核心內容：三個注解 + Caffeine 設定。

特別強調第 5 點：要驗證 Cache 有真的生效。

很多人加了注解但不驗證，結果 Cache 根本沒起作用（可能是 @EnableCaching 忘了加）。
-->

---
layout: default
---

# 練習一：解題提示
### 提示說明

1. pom.xml 加 `spring-boot-starter-cache` + `caffeine`；主程式加 `@EnableCaching`
2. `@Cacheable(value = "products", key = "#id")`
3. `@CachePut(value = "products", key = "#result.id")`
4. `@CacheEvict(value = "products", key = "#id")`

```properties
spring.cache.type=caffeine
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
spring.cache.cache-names=products
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>常見錯誤排查：</b> ① 有 @EnableCaching 嗎？ ② Cache value 名稱一致嗎？ ③ key 的 SpEL 表達式正確嗎？ ④ 是否在同一個 Bean 內自我呼叫？</div>

<!--
常見錯誤排查清單要記起來，幾乎所有 Cache 不生效的問題都出在這四個地方。
-->

---
layout: default
---

# 練習二：熱門排行榜 Cache + 定時清除
### 任務說明

**情境：** 電商首頁有「熱門商品 Top 10」，每小時更新一次；後台管理員可以手動觸發立即更新。

**任務：**

1. 建立 `RankingService.getTopProducts(String category)` — 加 `@Cacheable`，key 為 category，condition 為「category 不為空字串」
2. 加 `unless = "#result.isEmpty()"` — 若查詢結果為空，不存入 Cache
3. 建立 `refreshAll()` 方法 — 加 `@CacheEvict(allEntries = true)` 清除整個排行榜 Cache
4. 思考題：為什麼這個場景要用 `@CacheEvict` 而不是 `@CachePut`？

<!--
這個練習的重點在兩個地方：

condition 和 unless 的實際應用。

思考題：為什麼用 @CacheEvict 不用 @CachePut？
因為 refreshAll 只是清除，沒有回傳新資料，@CachePut 要求方法本體回傳要快取的值。
-->

---
layout: default
---

# 練習二：解題提示
### 提示說明

```java
@Cacheable(
    value = "rankings",
    key = "#category",
    condition = "#category != null && !#category.isEmpty()",
    unless = "#result.isEmpty()"
)
public List<Product> getTopProducts(String category) { ... }

@CacheEvict(value = "rankings", allEntries = true)
public void refreshAll() { }
```

| | `@CacheEvict` | `@CachePut` |
|---|---|---|
| refreshAll 情境 | 清空，等下次請求重填 ✅ | 需要回傳新值，但排行榜有多個 category ❌ |

<!--
refreshAll 用 @CacheEvict(allEntries = true) 是最自然的解法。

清空之後，下一個來查詢的請求會觸發 Cache Miss，重新去資料庫計算最新排行榜，
然後存進 Cache。這樣的「懶惰載入」策略在排行榜這種情境很常見。
-->

---

# 本章總結

| 注解 | 動作 | 典型搭配 |
|---|---|---|
| `@Cacheable` | 有 Cache 就直接回傳；沒有就執行方法並存入 | `findById`, `getXxx` |
| `@CacheEvict` | 清除指定 key 或整個 Cache | `update`, `delete` |
| `@CachePut` | 永遠執行方法，結果寫入 Cache | `update`（想立即更新 Cache） |

**選擇 Cache 實作：**

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

記住那個便利貼的比喻：
@Cacheable = 查完貼便利貼
@CacheEvict = 資料改了撕舊便利貼
@CachePut = 資料改了換新便利貼

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
