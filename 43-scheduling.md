---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Boot 排程
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
    Spring Boot 排程
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓程式在對的時間自動執行對的事」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到這一章！

今天我們要來談「排程」這個主題。

你有沒有遇過這種情況：每天早上九點要寄一封報表信、每個小時要清一次暫存資料、或是每天凌晨要跑一次資料庫整理？

這些事情如果靠人工去觸發，那就太麻煩了。

所以我們需要排程！讓程式在對的時間，自動幫我們做對的事。
-->

---

# 為什麼需要排程？

在實際系統中，很多任務需要「定時自動執行」

| 常見情境 | 描述 |
|---|---|
| 定時報表 | 每天早上 08:00 自動寄出銷售報表 |
| 快取刷新 | 每 5 分鐘更新一次熱門商品快取 |
| 資料清理 | 每天凌晨 02:00 清除過期的 session 紀錄 |
| 狀態同步 | 每 30 秒與外部系統同步訂單狀態 |
| 帳單結算 | 每月 1 日凌晨進行帳務批次結算 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>重點：</b> 這些任務不需要使用者觸發，而是由時間或週期來驅動 — 這就是「排程」的核心概念。</div>

<!--
你可以把排程想成是一個「程式版的鬧鐘」。

就像你每天早上設定鬧鐘叫你起床，排程就是讓系統在指定的時間點「自動醒來」去做某件事。

如果沒有排程機制，你就需要另外架設 cron job 伺服器，或是寫一個背景 thread 自己管理，那就麻煩很多了。

Spring Boot 把這件事簡化成幾個 annotation，非常優雅。
-->

---

# 傳統做法 vs Spring Boot 排程

沒有框架支援時，我們需要自己管理排程執行緒

```java
ScheduledExecutorService scheduler =
    Executors.newScheduledThreadPool(1);

scheduler.scheduleAtFixedRate(() -> {
    System.out.println("每 5 秒執行一次");
}, 0, 5, TimeUnit.SECONDS);
```

| 問題 | 說明 |
|---|---|
| 執行緒管理 | 需要自己管理執行緒生命週期 |
| 例外處理 | 容易遺漏，任務靜默失敗 |
| Spring DI | 無法注入 Service 或 Repository |
| 外部化設定 | 時間寫死在程式碼中 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>Spring Boot 的解法：</b> 用 <code>@Scheduled</code> + <code>@EnableScheduling</code>，只需要兩個 annotation 就搞定！</div>

<!--
在學新東西之前，我們先看看如果沒有 Spring Boot，我們要怎麼做排程。

傳統做法是用 Java 標準函式庫的 ScheduledExecutorService。

看起來還好，但問題很多：你要自己管理執行緒，要自己處理例外，最重要的是你沒辦法用 Spring 的 DI。

更麻煩的是，時間間隔是寫死在程式碼裡面的，你要改頻率就要重新編譯部署。

Spring Boot 把這些問題都解決了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 啟用排程功能：@EnableScheduling

<!--
第一個大主題：怎麼啟用 Spring Boot 的排程功能。

其實只要一個 annotation 就夠了。
-->

---

# @EnableScheduling — 開啟排程支援

只需要在設定類別加上這個 annotation，整個應用程式就啟用排程了

```java
@SpringBootApplication
@EnableScheduling
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

| 加上後的效果 | 說明 |
|---|---|
| 掃描 @Scheduled | 自動找出所有 Bean 中有 @Scheduled 的方法 |
| 建立排程執行緒池 | 自動建立執行緒來執行排程任務 |
| 啟動後立即生效 | 應用程式啟動後排程就開始運作 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>提示：</b> 可以放在任何 <code>@Configuration</code> 類別上。建議集中在一個 <code>SchedulingConfig</code> 設定類別，管理更清楚。</div>

<!--
啟用排程功能非常簡單，就是在你的設定類別加上 @EnableScheduling。

加上這個 annotation 之後，Spring 就會開始掃描所有 Bean，找出裡面有 @Scheduled 的方法，然後自動幫你排程執行。
-->

---

# 建立第一個排程任務

在任何 Spring Bean 的方法上加 `@Scheduled`

```java
@Component
public class HelloScheduler {

    @Scheduled(fixedRate = 5000)
    public void sayHello() {
        System.out.println("Hello! 現在時間：" + LocalDateTime.now());
    }
}
```

| 規則 | 說明 |
|---|---|
| 回傳值 | 必須是 `void` |
| 參數 | 不能有任何參數 |
| 類別 | 必須是 Spring Bean（有 `@Component` 等） |
| 存取修飾 | 建議 `public`（避免 proxy 問題） |

<!--
非常簡單：你只需要建立一個普通的 Spring Component，然後在你想定期執行的方法上加 @Scheduled，指定執行的時間間隔。

這個範例是每 5000 毫秒，也就是每 5 秒執行一次。

排程方法必須是 void 且無參數，因為 Spring 是自動呼叫的，它不知道要傳什麼參數給你。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## @Scheduled 三種執行模式

<!--
好，現在來到最重要的部分：@Scheduled 的三種執行模式。

這三種模式各有不同的使用情境，搞清楚它們的差異非常重要。
-->

---

# fixedRate — 固定頻率執行

不管上次任務有沒有跑完，「從任務開始時」計時，到時間就再執行一次

```java
@Scheduled(fixedRate = 5000)
public void fixedRateTask() {
    System.out.println("固定頻率：" + LocalDateTime.now());
}
```

**執行時間軸（fixedRate = 5 秒，任務耗時 3 秒）：**

```
0s  ── 任務開始
3s  ── 任務結束
5s  ── 任務再次開始（從 0s 算起 5 秒後）
8s  ── 任務結束
10s ── 任務再次開始
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>注意：</b> 如果任務執行時間超過 fixedRate，下一次執行會「立刻排隊」，不會跳過。</div>

<!--
用鬧鐘來比喻：你設定了「每 5 分鐘鬧一次」，不管你有沒有按掉鬧鐘，時鐘到了就繼續響。

fixedRate 的計時是從「任務開始」的時間點算起的。

fixedRate 適合用在「我需要固定頻率收集資料」這類情境，像是每 10 秒輪詢一次外部 API。
-->

---

# fixedDelay — 固定延遲執行

「從任務結束時」計時，等固定時間後再執行下一次

```java
@Scheduled(fixedDelay = 5000)
public void fixedDelayTask() {
    System.out.println("固定延遲：" + LocalDateTime.now());
}
```

**執行時間軸（fixedDelay = 5 秒，任務耗時 3 秒）：**

```
0s  ── 任務開始
3s  ── 任務結束
8s  ── 任務再次開始（從 3s 算起 5 秒後）
11s ── 任務結束
16s ── 任務再次開始
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>適用場景：</b> 任務的執行時間不固定，且你希望兩次執行之間「保持固定的間隔休息時間」時使用。</div>

<!--
這次是「你按掉鬧鐘之後，再等 5 分鐘才繼續響」。也就是說，計時是從任務結束的那一刻才開始。

fixedDelay 適合呼叫外部 API 的情境：執行時間可能是 1 秒也可能是 10 秒，你希望兩次呼叫之間保持一定的冷卻時間。
-->

---

# fixedRate vs fixedDelay 比較

| 特性 | `fixedRate` | `fixedDelay` |
|---|---|---|
| 計時起點 | 任務**開始**時 | 任務**結束**時 |
| 執行頻率 | 固定，不受執行時間影響 | 與執行時間有關 |
| 任務重疊 | 可能發生（單執行緒下會排隊） | 不會發生 |
| 適合情境 | 固定頻率輪詢、心跳檢查 | 任務執行時間不穩定、避免重疊 |

**視覺化比較（任務需時 3 秒，間隔 5 秒）：**

```
fixedRate:  |──3s──|  |──3s──|  |──3s──|
            0      3  5      8  10     13

fixedDelay: |──3s──|       |──3s──|
            0      3       8      11
```

<!--
重點就是計時起點不同。

fixedRate 從任務開始計時，fixedDelay 從任務結束計時。

如果你的任務很輕量、很快，兩者差異不大；如果任務執行時間不穩定，選 fixedDelay 比較安全。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## Cron 表達式

<!--
前面的 fixedRate 和 fixedDelay 都是以「間隔時間」來控制執行頻率。

但有時候我們需要更精確的控制：「每天早上九點執行」、「每個月第一天凌晨執行」。

這種需求就要用 cron 表達式了。
-->

---

# cron — 精確時間點排程

Spring Boot cron 表達式格式（6 個欄位）：

| 位置 | 欄位 | 允許值 | 特殊字元 |
|---|---|---|---|
| 1 | 秒 (Seconds) | 0–59 | `, - * /` |
| 2 | 分 (Minutes) | 0–59 | `, - * /` |
| 3 | 時 (Hours) | 0–23 | `, - * /` |
| 4 | 日 (Day of Month) | 1–31 | `, - * ? /` |
| 5 | 月 (Month) | 1–12 或 JAN–DEC | `, - * /` |
| 6 | 週 (Day of Week) | 0–7 或 SUN–SAT | `, - * ? /` |

```java
@Scheduled(cron = "0 0 9 * * MON-FRI")
public void sendMorningReport() {
    System.out.println("早安！寄出每日報表");
}
```

<!--
cron 表達式是排程世界的「標準語言」，很多系統都用它。

Spring Boot 的 cron 格式和 Linux 的 crontab 有一點差別：Spring 的 cron 有 6 個欄位，多了「秒」這個欄位。

表格從左到右是：秒、分、時、日、月、週。

"0 0 9 * * MON-FRI" 的意思是：每個工作日早上 9:00:00 執行。
-->

---

# Cron 特殊字元說明

| 字元 | 說明 | 範例 |
|---|---|---|
| `*` | 任意值（每個...） | `* * * * * *` 每秒執行 |
| `?` | 不指定（日/週互斥時使用） | `0 0 12 ? * MON` 每週一中午 |
| `-` | 範圍 | `0 0 9-17 * * *` 9–17 點每小時整點 |
| `,` | 列舉多個值 | `0 0 9,12,18 * * *` 9點、12點、18點 |
| `/` | 步進間隔 | `0 */5 * * * *` 每 5 分鐘 |
| `L` | 最後（Last） | `0 0 0 L * *` 每月最後一天 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>小技巧：</b> 不確定 cron 表達式是否正確？可以用 crontab.guru 網站來驗證（記得 Spring 多一個「秒」欄位）。</div>

<!--
星號代表「任意值」。

問號比較特別，它用在日跟週欄位，因為這兩個欄位是互斥的 — 你不能同時指定「每月 15 號」又「每週一」。

斜線是步進，/5 就是每隔 5 個單位。
-->

---

# 常用 Cron 表達式範例

| Cron 表達式 | 說明 |
|---|---|
| `0 * * * * *` | 每分鐘的第 0 秒（即每分鐘一次） |
| `0 */5 * * * *` | 每 5 分鐘執行一次 |
| `0 0 * * * *` | 每小時整點執行 |
| `0 0 8 * * *` | 每天早上 08:00 執行 |
| `0 0 9 * * MON-FRI` | 每個工作日 09:00 執行 |
| `0 0 0 * * *` | 每天凌晨 00:00 執行 |
| `0 0 2 1 * *` | 每月 1 日凌晨 02:00 執行 |
| `0 30 9 1 1 *` | 每年 1 月 1 日 09:30 執行 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>常見錯誤：</b> 「每分鐘執行一次」要寫 <code>"0 * * * * *"</code>，不是 <code>"* * * * * *"</code>（後者是每秒執行！）</div>

<!--
這個表格收集了最常見的 cron 表達式，你可以直接拿去用。

最常被問到的錯誤：有人想要「每分鐘執行一次」，就寫 "* * * * * *"，但這樣是「每秒執行一次」！

正確的「每分鐘執行一次」應該是 "0 * * * * *"，意思是每分鐘的第 0 秒。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## initialDelay 與外部化設定

<!--
學完三種模式，我們來看兩個實用的進階屬性：initialDelay 和外部化設定。
-->

---

# initialDelay — 延遲首次執行

應用程式啟動後，可以讓排程「等一下」再開始第一次執行

```java
@Component
public class WarmUpScheduler {

    @Scheduled(fixedRate = 5000, initialDelay = 10000)
    public void taskWithDelay() {
        System.out.println("暖機完成，開始執行排程任務");
    }
}
```

| 屬性 | 說明 | 單位 |
|---|---|---|
| `initialDelay` | 應用啟動後，第一次執行前的等待時間 | 毫秒 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>使用時機：</b> 排程任務需要依賴其他 Bean 或外部服務完成初始化，不能在應用啟動的瞬間就執行時非常有用。</div>

<!--
想像一下，你的排程任務在啟動的第一秒就跑，但這時候資料庫可能還沒連線成功，或者快取還沒預熱，任務就會出錯。

這時候就可以用 initialDelay，讓任務等一段時間再開始。

initialDelay 可以跟 fixedRate 或 fixedDelay 搭配使用，但不能跟 cron 一起用。
-->

---

# 外部化排程設定 — ${}

將排程時間寫在設定檔，方便不同環境切換

```java
@Component
public class ConfigurableScheduler {

    @Scheduled(fixedRateString = "${scheduler.report.rate:60000}")
    public void generateReport() {
        System.out.println("產生報表中...");
    }

    @Scheduled(cron = "${scheduler.cleanup.cron:0 0 2 * * *}")
    public void cleanupData() {
        System.out.println("清理過期資料...");
    }
}
```

```properties
scheduler.report.rate=300000
scheduler.cleanup.cron=0 0 3 * * *
```

<!--
原本 fixedRate 是一個數字，現在換成了 fixedRateString，然後值是 "${scheduler.report.rate:60000}"。

這個語法的意思是：從設定檔讀取 scheduler.report.rate；如果找不到，就用預設值 60000。

冒號後面跟著的是預設值，這很重要，確保就算忘了在設定檔裡加這個 key，程式也不會爆炸。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5

## 非同步排程：@Async + @EnableAsync

<!--
好，接下來要講一個進階主題：非同步排程。

預設情況下，Spring 的排程任務是在「單一執行緒」中依序執行的。

如果某一個任務跑得很慢，它會卡住後面所有的任務。
-->

---

# 預設排程的問題 — 單執行緒瓶頸

Spring 排程預設使用**單一執行緒**，所有任務排隊執行

```java
// 這個任務每 3 秒執行，但執行需要 10 秒！
@Scheduled(fixedRate = 3000)
public void slowTask() throws InterruptedException {
    Thread.sleep(10000);
    System.out.println("慢任務結束：" + LocalDateTime.now());
}

// 這個任務會被上面的慢任務卡住，無法準時執行
@Scheduled(fixedRate = 1000)
public void fastTask() {
    System.out.println("快任務：" + LocalDateTime.now());
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>問題：</b> slowTask 每次執行 10 秒，但排程是 3 秒，導致 fastTask 無法準時執行 — 這就是單執行緒的瓶頸。</div>

<!--
我們有兩個排程任務：一個是每 3 秒執行但需要跑 10 秒的慢任務，另一個是每秒執行的快任務。

因為是單執行緒，所有排程任務都在同一個執行緒中排隊。

slowTask 一跑起來就霸佔了執行緒 10 秒，fastTask 就只能等。

這在生產環境是很嚴重的問題，想像一下你的心跳檢查被一個批次任務卡住，那心跳就會超時，系統以為服務掛了。
-->

---

# @Async + @EnableAsync — 非同步排程

讓排程任務在獨立執行緒中執行，互不阻塞

```java
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class MyApplication { ... }
```

```java
@Component
public class AsyncScheduler {

    @Async
    @Scheduled(fixedRate = 3000)
    public void asyncTask() throws InterruptedException {
        System.out.println("開始：" + Thread.currentThread().getName());
        Thread.sleep(10000);
        System.out.println("結束：" + Thread.currentThread().getName());
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>效果：</b> 加上 <code>@Async</code> 後，即使任務執行超過排程間隔，也不會阻塞其他任務 — 每次觸發都在獨立執行緒中執行。</div>

<!--
解決方案很簡單：加兩個 annotation。

在主程式加 @EnableAsync，在排程方法加 @Async。

這樣每次排程觸發，任務就會在一個獨立的執行緒中執行，不會佔用排程執行緒。
-->

---

# 自定義非同步執行緒池

避免使用預設的無限制執行緒池，設定合理的執行緒池大小

```java
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "schedulerTaskExecutor")
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("scheduler-");
        executor.initialize();
        return executor;
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">⚠️ <b>生產環境注意：</b> Spring 預設的 @Async 執行緒池（SimpleAsyncTaskExecutor）每次都建立新執行緒，高頻率排程下會造成問題。務必自訂 ThreadPoolTaskExecutor。</div>

<!--
Spring 預設的 @Async 執行緒池用的是 SimpleAsyncTaskExecutor，它不是真正的執行緒池，每次呼叫都會建立新執行緒，這在高頻率排程下會造成問題。

所以最佳實踐是自己建立一個 ThreadPoolTaskExecutor，設定合理的大小。

這是一個生產環境必做的設定，千萬不要忘記。
-->

---
layout: default
---

# 練習一：定時清理過期 Token
### 任務說明

實作一個 `TokenCleanupScheduler`，功能如下：

- 每天凌晨 **01:30** 自動執行一次
- 呼叫 `tokenRepository.deleteExpiredTokens()` 清除過期資料
- 執行前後要印出 log（含時間戳）
- 排程時間透過 `application.properties` 設定（key: `scheduler.token.cleanup.cron`）
- 預設值：`0 30 1 * * *`

<!--
這個練習是一個很真實的業務情境：定時清理過期的 Token。

JWT token 或是 refresh token 過期了，就要從資料庫裡刪掉，不然資料庫會越來越肥。

試試看自己寫，記得幾個要點：類別要加 @Component，要注入 tokenRepository，方法上要加 @Scheduled，cron 要用 ${} 語法。
-->

---
layout: default
---

# 練習一：解題提示
### 提示說明

1. 類別加 `@Component`，用建構子注入 `TokenRepository`
2. 方法上加 `@Scheduled(cron = "${scheduler.token.cleanup.cron:0 30 1 * * *}")`
3. 用 SLF4J log 記錄執行前後的時間
4. `application.properties` 加 `scheduler.token.cleanup.cron=0 30 1 * * *`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>重點：</b> <code>${key:預設值}</code> 的語法確保就算設定檔裡沒有這個 key，程式也不會在啟動時爆炸。</div>

<!--
這是一個乾淨、實用的解法，在實際專案中可以直接這樣用。
-->

---
layout: default
---

# 練習二：定期同步匯率資料
### 任務說明

實作一個 `ExchangeRateScheduler`，功能如下：

1. 每 **30 分鐘**同步一次匯率資料
2. 呼叫 `exchangeRateService.syncFromExternalApi()` 進行同步
3. 應用程式啟動後 **20 秒**才開始第一次執行（等待服務初始化完成）
4. 同步操作要**非同步執行**，不阻塞排程執行緒
5. 執行間隔透過 `scheduler.exchange.rate.delay` 設定，預設 `1800000`（ms）

<!--
第二個練習稍微進階一點，加入了 initialDelay 和 @Async。

這是一個定期同步匯率的情境，呼叫外部 API 是一個 IO 密集型操作，所以我們希望它非同步執行。

三個關鍵點：fixedDelayString 搭配 ${}、initialDelay 設定啟動延遲、@Async 非同步執行。
-->

---
layout: default
---

# 練習二：解題提示
### 提示說明

1. 主程式或設定類別加 `@EnableAsync`
2. 方法同時加 `@Async` 和 `@Scheduled`

```java
@Async
@Scheduled(
    fixedDelayString = "${scheduler.exchange.rate.delay:1800000}",
    initialDelay = 20000
)
public void syncExchangeRates() {
    log.info("開始同步匯率，執行緒：{}", Thread.currentThread().getName());
    exchangeRateService.syncFromExternalApi();
    log.info("匯率同步完成");
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>驗證：</b> 印出 Thread.currentThread().getName()，確認每次執行的執行緒名稱不同，代表 @Async 有生效。</div>

<!--
注意幾個細節：

第一，因為要外部化設定，所以是 fixedDelayString（有 String 結尾）。

第二，@Async 要搭配 @EnableAsync 才有效，別忘了在主程式或設定類別加上去。

第三，在 log 裡印出執行緒名稱，可以確認任務確實在不同執行緒中執行。
-->

---

# 章節總結

| 主題 | 核心內容 |
|---|---|
| 啟用排程 | `@EnableScheduling` 加在設定類別 |
| 固定頻率 | `@Scheduled(fixedRate = ms)` — 從任務**開始**計時 |
| 固定延遲 | `@Scheduled(fixedDelay = ms)` — 從任務**結束**計時 |
| 精確時間 | `@Scheduled(cron = "秒 分 時 日 月 週")` |
| 延遲啟動 | `initialDelay = ms` — 啟動後等待才開始 |
| 外部化設定 | `fixedRateString = "${key:預設值}"` |
| 非同步執行 | `@EnableAsync` + `@Async` — 避免任務互相阻塞 |
| 自定義執行緒池 | `ThreadPoolTaskExecutor` — 生產環境必備 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">💡 <b>最佳實踐口訣：</b> 時間外部化、執行非同步、例外要捕捉、執行緒要配置。</div>

<!--
這章我們學了 Spring Boot 排程的完整知識。

記住這個口訣：時間外部化、執行非同步、例外要捕捉、執行緒要配置。

把這四點做到，你的排程系統就很健壯了。
-->

---
layout: end
---

# Q & A

<!--
好，進入 Q&A 時間。

大家對今天的內容有什麼疑問嗎？

特別是 fixedRate 和 fixedDelay 的差異、cron 表達式的寫法，或是 @Async 的使用，這幾個是比較容易混淆的地方。
-->
