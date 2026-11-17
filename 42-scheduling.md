---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Boot 排程
routeAlias: ch42
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
大家好，歡迎來到第四十二章。

到目前為止，我們寫的程式都是被動的：有人發請求，它才做事。

但是有些工作沒有人會來請求，而是時間到了就要做。今天要學的排程，就是讓程式「看時間做事」。今天繼續使用 school 專案。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **排程是什麼？** 不是有人來才做，而是時間到了自己做
- **怎麼設定時間？** 固定頻率、固定延遲、cron 表達式
- **有什麼要注意的？** 把時間寫進設定檔；預設只有一位工友

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，排程是什麼。不是有人來才做，而是時間到了自己做。

（下一步）第二，怎麼設定時間。有三種方式：固定頻率、固定延遲、cron 表達式。

（下一步）第三，有什麼要注意的。包含把時間寫進設定檔，還有一個容易忽略的地方：預設只有一位工友。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 時間到了就要做的事

<!--
先看學校。
-->

---

# 沒有人來請，也要做

學校裡有很多事，不是「有人到櫃台」才發生的：

<v-clicks>

- 每天早上 8 點，敲上課鐘
- 每天放學後，巡一次教室、關燈
- 每個月 1 號，結算上個月的出缺席
- 每學期結束，把不及格的名單整理給導師

</v-clicks>

<v-click>

學校請了一位**工友**，給他一張**時間表**。他不用等人吩咐，時間到了就去做。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 讓程式照著時間表自動執行工作，叫做<b>排程</b>（Scheduling）。
</div>

</v-click>

<!--
學校裡有很多事，不是有人到櫃台才發生的。

（下一步）每天早上 8 點，敲上課鐘。

（下一步）每天放學後，巡一次教室、關燈。

（下一步）每個月 1 號，結算上個月的出缺席。

（下一步）每學期結束，把不及格的名單整理給導師。

（下一步）這些事如果靠人記得去做，一定會忘。所以學校請了一位工友，給他一張時間表。他不用等人吩咐，時間到了就去做。

讓程式照著時間表自動執行工作，叫做排程，英文是 Scheduling。

系統裡常見的排程工作，例如每天早上寄出報表、每天半夜清理過期的資料、每隔幾分鐘和別的系統同步一次。
-->

---

# 對照到程式

<Pairs left="學校" right="程式" rows="staff,工友=code,加了 @Scheduled 的方法|doc,時間表上的一行=code,@Scheduled(…) 括號裡的設定|key,校長宣布「開始照時間表做事」=code,@EnableScheduling|what,沒有人來請，時間到就做=code,不需要請求，由 Spring 自動呼叫" />

<!--
對應到程式。

（下一步）工友，是加了 @Scheduled 的方法。

（下一步）時間表上的一行，是 @Scheduled 括號裡的設定。

（下一步）校長宣布「開始照時間表做事」，是 @EnableScheduling。少了這一步，時間表寫得再好，也沒有人照著做。

（下一步）沒有人來請、時間到就做，是不需要請求，由 Spring 自動呼叫。
-->

---

# 想一想

<Poll question="下面哪一件事，最適合用排程來做？" options="使用者按下「查詢成績」|使用者送出新增學生的表單|每天凌晨 2 點清除過期的資料|使用者登入" answer="3" />

<!--
來想一題。

下面哪一件事，最適合用排程來做？

（等大家作答）

（下一步）答案是：每天凌晨 2 點清除過期的資料。

其他三個都是使用者做了某個動作才發生的，是由請求觸發的。只有這一個是由時間觸發的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 第一個排程

<!--
來寫第一個排程。
-->

---

# 步驟一：宣布開始

打開 `SchoolApplication`，加一行：

```java {2}
@SpringBootApplication
@EnableScheduling
public class SchoolApplication {
    public static void main(String[] args) {
        SpringApplication.run(SchoolApplication.class, args);
    }
}
```

<v-clicks>

- `@EnableScheduling`：打開排程的功能
- 加了之後，Spring 啟動時會去找所有加了 `@Scheduled` 的方法，照時間呼叫它們
- 排程是 Spring 內建的，**不用加任何依賴**

</v-clicks>

<!--
步驟一。打開專案的啟動類別 SchoolApplication，在類別上面加一行 @EnableScheduling。

（下一步）它的作用是打開排程的功能。

（下一步）加了之後，Spring 啟動的時候會去找所有加了 @Scheduled 的方法，然後照時間呼叫它們。

（下一步）排程是 Spring 內建的功能，不用加任何依賴。

這一行整個專案只要加一次。
-->

---

# 步驟二：寫一位工友

新增 `scheduler` 資料夾，建立 `BellScheduler`：

```java {1-2|5|6-8|all}
@Slf4j
@Component
public class BellScheduler {

    @Scheduled(fixedRate = 5000)
    public void ringBell() {
        log.info("噹！噹！噹！");
    }
}
```

- `@Component`：這個類別要交給 Spring 管理，排程才會生效
- `@Scheduled(fixedRate = 5000)`：每 5000 毫秒（5 秒）執行一次
- 方法**沒有回傳值、沒有參數**。因為是 Spring 自動呼叫的，沒有人可以給參數、收結果

<!--
步驟二。在 com.example.school 底下新增一個 scheduler 資料夾，建立 BellScheduler。

（下一步）類別上面加 @Component，把它交給 Spring 管理。不是 Bean 的類別，裡面的 @Scheduled 不會生效。上面的 @Slf4j 是上一章學的，讓我們可以用 log。

（下一步）方法上面加 @Scheduled。括號裡的 fixedRate = 5000，意思是每 5000 毫秒執行一次。1000 毫秒是 1 秒，所以是每 5 秒。

（下一步）方法的內容，先簡單寫一筆日誌就好。

要注意：排程的方法沒有回傳值，也沒有參數。因為它是 Spring 自動呼叫的，沒有人可以給它參數，也沒有人會收它的結果。

（下一步）啟動專案。不用開 Postman，什麼都不用做。看 console，每隔 5 秒會出現一行「噹！噹！噹！」，前面有時間。這就是我們的第一個排程。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 三種設定時間的方式

<!--
時間表有三種寫法。
-->

---

# 固定頻率 和 固定延遲

<RateDelay terms />

<!--
前兩種很像，我們用一張圖比較。假設工友每次做事要花 3 秒，設定的數字都是 5 秒。

上面是固定頻率，fixedRate。工友看的是時鐘。每 5 秒開始一次，不管上一次做了多久。所以開始的時間是第 0 秒、第 5 秒、第 10 秒。

（下一步）下面是固定延遲，fixedDelay。工友看的是做完的時間。做完之後，休息 5 秒，才開始下一次。第 0 秒開始，第 3 秒做完，休息到第 8 秒才開始第二次。

（下一步）所以同樣設定 5 秒、每次做 3 秒，結果不一樣。固定頻率是每 5 秒一次。固定延遲是每 8 秒一次，因為要加上做事的時間。
-->

---

# 兩種寫法，怎麼選

```java
@Scheduled(fixedRate = 5000)     // 從「開始」算起，每 5 秒一次
public void checkEveryFiveSeconds() { … }

@Scheduled(fixedDelay = 5000)    // 從「做完」算起，休息 5 秒
public void restFiveSeconds() { … }
```

<v-clicks>

- **固定頻率**：要照固定的節奏做。例如每 30 秒確認一次別的系統還活著
- **固定延遲**：每次做多久不一定，而且**不希望前一次還沒做完，下一次就來了**。例如同步資料
- 還可以加 `initialDelay = 10000`：啟動之後，先等 10 秒才做第一次

</v-clicks>

<!--
兩種寫法放在一起看。只差在屬性的名字。

（下一步）固定頻率，適合要照固定的節奏做的事。例如每 30 秒確認一次別的系統還活著。

（下一步）固定延遲，適合每次做多久不一定的事，而且不希望前一次還沒做完，下一次就來了。例如把資料同步到別的系統，一次可能幾秒，也可能幾分鐘。

（下一步）兩種都可以再加一個 initialDelay。意思是啟動之後，先等一段時間才做第一次。例如等 10 秒，讓程式先準備好。不加的話，啟動完就會馬上做第一次。
-->

---

# 第三種：cron，指定「幾點幾分」

「每 5 秒一次」不夠用。敲上課鐘要的是「**上課日的早上 8 點整**」。

<UrlParts parts="0;;秒;;0 秒;;第一格是秒。0 代表整分的時候||0;;分;;0 分;;第二格是分。0 代表整點的時候||8;;時;;早上 8 點;;第三格是時，24 小時制。晚上 8 點要寫 20||*;;日;;每一天;;第四格是幾號。星號代表「每一個」||*;;月;;每個月;;第五格是幾月||MON-FRI;;星期;;星期一到星期五;;第六格是星期幾。減號代表「從…到…」" />

<v-click>

```java
@Scheduled(cron = "0 0 8 * * MON-FRI")
public void ringMorningBell() { … }
```

</v-click>

<!--
第三種方式。每 5 秒一次這種寫法，沒辦法表達「幾點幾分」。敲上課鐘要的是：上課日的早上 8 點整。

這種時候用 cron 表達式。它是一串用空白隔開的六個格子。我們一格一格看。

（下一步）第一格是秒。0 代表整分的時候。

（下一步）第二格是分。0 代表整點的時候。

（下一步）第三格是時，用 24 小時制。8 是早上 8 點。晚上 8 點要寫 20。

（下一步）第四格是日，也就是幾號。星號代表「每一個」，所以是每一天。

（下一步）第五格是月。星號，每個月。

（下一步）第六格是星期幾。MON-FRI，減號代表「從什麼到什麼」，所以是星期一到星期五。

（下一步）整串合起來：星期一到星期五，每天早上 8 點 0 分 0 秒。寫法是把它放在 @Scheduled 的 cron 屬性裡，前後加雙引號。

口訣是：秒、分、時、日、月、週。由小到大，最後是星期。
-->

---

# cron 的四個符號

<v-clicks>

- `*`：每一個。`0 0 * * * *` → 每個小時的整點
- `,`：列出好幾個。`0 0 8,12,17 * * *` → 每天 8 點、12 點、17 點
- `-`：一段範圍。`0 0 9-17 * * *` → 9 點到 17 點，每個整點
- `/`：每隔多少。`0 */5 * * * *` → 每 5 分鐘

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 「每分鐘一次」是 <code>0 * * * * *</code>。如果第一格也寫星號（<code>* * * * * *</code>），會變成<b>每一秒</b>都執行。
</div>

</v-click>

<!--
cron 常用的符號有四個。

（下一步）星號，每一個。例如秒和分是 0，時是星號，就是每個小時的整點。

（下一步）逗號，列出好幾個。時的那一格寫 8,12,17，就是每天 8 點、12 點、17 點。

（下一步）減號，一段範圍。時寫 9-17，就是 9 點到 17 點，每個整點。

（下一步）斜線，每隔多少。分寫星號斜線 5，就是每 5 分鐘。

（下一步）有一個很常見的錯誤。「每分鐘一次」要寫 0 接五個星號，第一格秒是 0。如果第一格也寫星號，意思是每一秒，程式會每一秒都執行一次。
-->

---

# 常用的 cron

<Pairs left="想要的時間" right="cron" rows="doc,每分鐘=code,0 * * * * *|doc,每 5 分鐘=code,0 */5 * * * *|doc,每天早上 8 點=code,0 0 8 * * *|doc,上課日早上 8 點=code,0 0 8 * * MON-FRI|doc,每天凌晨 1 點半=code,0 30 1 * * *|doc,每個月 1 號凌晨 2 點=code,0 0 2 1 * *" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 網路上查到的 cron 常常只有<b>五格</b>（Linux 的寫法，沒有「秒」）。Spring 的是<b>六格</b>，最前面多一格秒，直接複製會對不上。
</div>

</v-click>

<!--
常用的 cron 整理在這裡，需要的時候可以回來查。

（下一步）每分鐘。

（下一步）每 5 分鐘。

（下一步）每天早上 8 點。

（下一步）上課日早上 8 點。

（下一步）每天凌晨 1 點半。秒是 0，分是 30，時是 1。

（下一步）每個月 1 號凌晨 2 點。日的那一格寫 1。

（下一步）提醒一點。網路上查到的 cron 常常只有五格，那是 Linux 系統的寫法，沒有秒。Spring 的是六格，最前面多一格秒。直接複製過來會對不上，記得在最前面補一個 0。
-->

---

# 想一想

<Poll question="@Scheduled(cron = &quot;0 30 7 * * *&quot;) 會在什麼時候執行？" options="每 30 秒|每天早上 7 點 30 分|每個月 7 號的 30 分|每 7 小時 30 分鐘" answer="2" />

<!--
確認一下。

cron 是 0 30 7 接三個星號，會在什麼時候執行？

（等大家作答）

（下一步）答案是：每天早上 7 點 30 分。

照口訣對：秒是 0，分是 30，時是 7。日、月、週都是星號，所以是每一天。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 讓排程做點正事

<!--
敲鐘只是示範。來做一個真的會用到的排程。
-->

---

# 每天統計不及格的人數

```java {1-3|5-6|8|9-14|15}
@Slf4j
@Component
public class FailingReportScheduler {

    @Autowired
    private StudentService studentService;

    @Scheduled(cron = "0 30 1 * * *")
    public void countFailingStudents() {
        int count = 0;
        for (StudentResponse student : studentService.getAllStudents()) {
            if (student.getScore() < 60) {
                count = count + 1;
            }
        }
        log.info("目前不及格的學生人數：{}", count);
    }
}
```

<!--
在 scheduler 資料夾再建立一個 FailingReportScheduler。它每天統計一次不及格的學生人數。

（下一步）類別上面一樣是 @Slf4j 和 @Component。

（下一步）注入 StudentService。因為排程的類別是 Bean，所以可以注入其他的 Bean。注意這裡找的是組長，不是直接找 Repository。工友和櫃台一樣，是事情的起點，要遵守第三十五章的規則：不跨層。

（下一步）@Scheduled 用 cron，每天凌晨 1 點半。統計這類工作通常安排在半夜，那時候使用的人最少。

（下一步）方法的內容。請組長給所有學生的資料，用 for 迴圈一個一個看，成績小於 60 的就加 1。

（下一步）最後把結果寫進日誌。真正的系統可能會把結果存進資料庫，或是寄信給導師。

要測試的話，總不能等到凌晨 1 點半。可以先把 cron 改成 0 接五個星號，每分鐘執行一次，確認沒問題再改回來。
-->

---

# 把時間搬到設定檔

```java
@Scheduled(cron = "${scheduler.failing-report.cron:0 30 1 * * *}")
public void countFailingStudents() { … }
```

```properties
scheduler.failing-report.cron=0 * * * * *
```

<v-clicks>

- `${名字}`：到 `application.properties` 找這個名字的設定。第九章的 `@Value` 用過同樣的寫法
- `${名字:預設值}`：冒號後面是預設值。設定檔裡沒寫的時候就用它
- 好處：改時間**不用改程式**。開發時每分鐘跑一次，上線時改回凌晨 1 點半
- `fixedRate`、`fixedDelay` 要改用 `fixedRateString`、`fixedDelayString` 才能這樣寫

</v-clicks>

<!--
剛才為了測試，要去改程式裡的 cron。這樣不方便。比較好的做法，是把時間搬到設定檔。

cron 的內容換成錢字號加大括號。下面是 application.properties 裡對應的設定。

（下一步）錢字號大括號裡寫名字，意思是到 application.properties 找這個名字的設定。第九章的 @Value 用過同樣的寫法。

（下一步）名字後面可以加冒號和預設值。設定檔裡沒寫這一項的時候，就用預設值。這樣就算忘了寫設定，程式也能正常啟動。

（下一步）好處是改時間不用改程式。開發的時候在設定檔寫每分鐘跑一次，上線的時候改回凌晨 1 點半，或是直接不寫、用預設值。

（下一步）一個小細節。fixedRate 和 fixedDelay 的值是數字，沒辦法放這種文字。要改用 fixedRateString 和 fixedDelayString 這兩個屬性，才能這樣寫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 補充：只有一位工友

<!--
最後是一個容易忽略的地方。這一段是補充。
-->

---

# 一件事拖太久，其他事都得等

Spring 的排程，預設**只有一位工友**。所有的排程工作都是他一個人做，一次只能做一件。

```java
@Scheduled(fixedRate = 1000)
public void quickJob() { log.info("快的工作"); }

@Scheduled(fixedRate = 3000)
public void slowJob() throws InterruptedException {
    Thread.sleep(10000);          // 假裝這件事要做 10 秒
    log.info("慢的工作做完了");
}
```

<v-clicks>

- `slowJob` 在做的那 10 秒，`quickJob` 完全不會執行
- 本來應該每秒一次的工作，被卡住了

</v-clicks>

<!--
Spring 的排程，預設只有一位工友。所有的排程工作都是他一個人做，一次只能做一件。

請看這兩個排程。quickJob 每秒執行一次，很快就做完。slowJob 每 3 秒執行一次，但是裡面用 Thread.sleep 假裝要做 10 秒。

（下一步）執行之後會發現：slowJob 在做的那 10 秒，quickJob 完全不會執行。

（下一步）本來應該每秒一次的工作，被卡住了。因為工友只有一位，他正在忙。

這裡的「工友」，在程式裡的正式名稱叫做執行緒，英文是 Thread。可以把它想成「一個正在做事的人」。預設排程只有一個執行緒。
-->

---

# 解法：多請幾位工友

最簡單的做法，在 `application.properties` 加一行：

```properties
spring.task.scheduling.pool.size=3
```

<v-clicks>

- 意思是排程用的工友有 3 位。一位在忙，其他的工作由另外兩位做
- 另一種做法是 `@Async`：把某一件工作**交給別人去做，自己不等它做完**。啟動類別要加 `@EnableAsync`，方法上加 `@Async`
- 正式使用 `@Async` 時，還要設定「最多請幾個人」（執行緒池），這是進階的主題

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 現在只要記得：<b>排程的工作不要做太久</b>；如果有很花時間的工作，要想到它可能會擋住別人。
</div>

</v-click>

<!--
解法是多請幾位工友。

最簡單的做法，是在 application.properties 加一行，spring.task.scheduling.pool.size 等於 3。

（下一步）意思是排程用的工友有 3 位。一位在忙的時候，其他的工作由另外兩位做，就不會被卡住。

（下一步）另一種做法是 @Async。它的意思是：把某一件工作交給別人去做，自己不等它做完。要在啟動類別加 @EnableAsync，再到方法上加 @Async。

（下一步）正式使用 @Async 的時候，還要設定最多請幾個人，這個設定叫做執行緒池。這是進階的主題，以後有需要再深入。

（下一步）現在只要記得兩件事。排程的工作不要做太久。如果有很花時間的工作，要想到它可能會擋住別人。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# 動手練習

<!--
兩個練習。
-->

---

# 練習 1：每 10 秒報告學生人數

在 `scheduler` 資料夾新增 `StudentCountScheduler`：

<v-clicks>

- 啟動之後先等 5 秒，之後每 10 秒執行一次
- 每次用 `studentService.getAllStudents()` 取得所有學生，寫一筆 INFO：「目前學生人數：N」
- 提示：`List` 的 `size()` 可以知道裡面有幾筆

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 啟動後觀察 console。用 Postman 新增一位學生，下一次報告的數字應該會加 1。
</div>

</v-click>

<!--
練習一。在 scheduler 資料夾新增一個 StudentCountScheduler。

（下一步）啟動之後先等 5 秒，之後每 10 秒執行一次。

（下一步）每次用 studentService 的 getAllStudents 取得所有學生，寫一筆 INFO 的日誌：目前學生人數是多少。

（下一步）提示：List 的 size 方法可以知道裡面有幾筆。

（下一步）啟動後觀察 console。然後用 Postman 新增一位學生，下一次報告的數字應該會加 1。

請先暫停，自己試試看。
-->

---

# 練習 1：參考答案

```java
@Slf4j
@Component
public class StudentCountScheduler {

    @Autowired
    private StudentService studentService;

    @Scheduled(fixedRate = 10000, initialDelay = 5000)
    public void reportStudentCount() {
        int count = studentService.getAllStudents().size();
        log.info("目前學生人數：{}", count);
    }
}
```

<!--
參考答案。

類別加 @Slf4j 和 @Component，注入 StudentService。

@Scheduled 裡寫兩個屬性，用逗號隔開。fixedRate 是 10000，每 10 秒。initialDelay 是 5000，啟動之後先等 5 秒。

方法裡取得所有學生，用 size 算出數量，寫進日誌。

觀察完之後，可以把這個類別的 @Component 先註解掉，不然 console 會一直被它洗版。
-->

---

# 練習 2：及格人數，時間寫在設定檔

1. 新增 `PassingReportScheduler`，統計成績 **60 分以上**的學生人數，寫一筆 INFO
2. 執行時間：每天早上 **7 點整**
3. 時間要能從 `application.properties` 設定，名字是 `scheduler.passing-report.cron`；沒有設定時用上面的時間當預設值
4. 測試時，在設定檔把它改成每分鐘執行一次

<!--
練習二。

第一，新增一個 PassingReportScheduler，統計成績 60 分以上的學生人數，寫一筆 INFO 的日誌。

第二，執行時間是每天早上 7 點整。

第三，時間要能從 application.properties 設定，名字是 scheduler.passing-report.cron。沒有設定的時候，用每天早上 7 點當預設值。

第四，測試的時候，在設定檔把它改成每分鐘執行一次。

請先暫停，自己試試看。
-->

---

# 練習 2：參考答案

```java
@Slf4j
@Component
public class PassingReportScheduler {
    @Autowired
    private StudentService studentService;

    @Scheduled(cron = "${scheduler.passing-report.cron:0 0 7 * * *}")
    public void countPassingStudents() {
        int count = 0;
        for (StudentResponse student : studentService.getAllStudents()) {
            if (student.getScore() >= 60) {
                count = count + 1;
            }
        }
        log.info("目前及格的學生人數：{}", count);
    }
}
```

```properties
scheduler.passing-report.cron=0 * * * * *
```

<!--
參考答案。

結構和不及格統計一樣。差別有兩個地方。

第一，cron 用錢字號大括號的寫法。名字是 scheduler.passing-report.cron，冒號後面是預設值，每天早上 7 點整：秒 0、分 0、時 7。

第二，判斷的條件改成大於等於 60。

下面是測試用的設定，每分鐘執行一次。測試完把這一行刪掉，程式就會用預設的早上 7 點。
-->

---

# 複習：學校對照表

<Pairs left="學校" right="程式" rows="key,宣布開始照時間表做事=code,@EnableScheduling|staff,工友和他的一項工作=code,@Component 類別裡的 @Scheduled 方法|doc,看時鐘，每隔多久開始一次=code,fixedRate|doc,做完之後，休息多久再做=code,fixedDelay|doc,指定幾點幾分、星期幾=code,cron：秒 分 時 日 月 週|what,只有一位工友，一件事拖太久大家都等=code,預設單一執行緒" />

<!--
我們用一張圖複習今天的內容。

（下一步）宣布開始照時間表做事，是 @EnableScheduling。

（下一步）工友和他的一項工作，是 @Component 類別裡的 @Scheduled 方法。

（下一步）看時鐘、每隔多久開始一次，是 fixedRate。

（下一步）做完之後、休息多久再做，是 fixedDelay。

（下一步）指定幾點幾分、星期幾，是 cron。六格：秒、分、時、日、月、週。

（下一步）只有一位工友、一件事拖太久大家都等，是預設只有一個執行緒。
-->

---

# 章節總結

<v-clicks>

- **排程**：由時間觸發的工作，不需要請求
- **啟用**：啟動類別加 `@EnableScheduling`；方法加 `@Scheduled`，類別要是 Bean
- **`fixedRate`**：從開始算起；**`fixedDelay`**：從做完算起；單位是毫秒
- **`cron`**：六格「秒 分 時 日 月 週」；`*` 每一個、`,` 列舉、`-` 範圍、`/` 每隔
- **設定檔**：`${名字:預設值}`，改時間不用改程式
- **注意**：預設只有一個執行緒，排程的工作不要做太久

</v-clicks>

<v-click>

下一章：同樣的問題一直被問，每次都進檔案室查，太慢了。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）排程是由時間觸發的工作，不需要請求。啟用的方法是啟動類別加 @EnableScheduling，方法加 @Scheduled，類別要是 Bean。fixedRate 從開始算起，fixedDelay 從做完算起，單位是毫秒。cron 有六格：秒、分、時、日、月、週。時間可以用錢字號大括號搬到設定檔。最後要注意，預設只有一個執行緒，排程的工作不要做太久。

（最後一步）下一章是這個單元的最後一個主題。同樣的問題一直被問，每次都進檔案室查，太慢了。有沒有更快的辦法？
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
