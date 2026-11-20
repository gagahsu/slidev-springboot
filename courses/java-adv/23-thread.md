---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 多執行緒 (Multithreading)（進階／自學）
routeAlias: ch23
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
    Java Programming Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    多執行緒
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到「多執行緒」自學篇！這個主題在基礎班我們只花了一點時間，口頭認識「這是什麼、用在哪裡」，今天要把整個地基蓋起來。

【為什麼要學這個？】
想像一間銀行只開一個窗口，所有客戶不管要存款、提款還是換外幣，全部擠在一條隊伍裡，一個一個慢慢辦。多執行緒（Multithreading）就是「多開幾個服務窗口」的概念——讓程式同時處理多件事，不用大家排成一條長龍乾等。

【學習目標】
學完這份自學內容，我們會知道執行緒怎麼建立、怎麼控制它們的節奏，以及最關鍵的——當多個窗口同時要動用同一份資料時，怎麼用同步機制避免資料被搞亂。
-->

---
layout: default
---

# Outline

- **執行緒基礎** — Program / Process / Thread、多工作業、生命週期
- **建立執行緒** — 三種建立方式、執行緒工作原理
- **執行緒控制** — sleep()、join()、優先順序、Daemon 執行緒
- **同步機制** — synchronized、匿名類別、同步區塊與靜態方法
- **進階議題** — Deadlock、wait()/notify()、生產者消費者模式
- **Virtual Threads（JDK 21）** — 虛擬執行緒基本用法
- **綜合練習**

<!--
【帶讀大綱】
今天的自學內容分成六大塊，前兩塊先打地基：認識「Program、Process、Thread」這三個常被搞混的詞，再學三種把執行緒生出來的方法。

【重點預告】
中間是「執行緒控制」——怎麼讓它們睡覺、排隊等待、設定優先順序。接著是重頭戲：同步機制怎麼避免多個窗口搶同一份資料，以及死結（Deadlock）這個工程師的噩夢要怎麼預防。最後補上 JDK 21 的 Virtual Threads，這是目前 Java 併發模型最新的演進。每個小節後面都有練習，章節結尾還有一題綜合練習，把全部概念串起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 執行緒基礎

<!--
【小節開場】
第一部分先打地基：搞懂 Program、Process、Thread 這三個詞到底差在哪，以及多工作業（Multitasking）的兩種型態。

【為什麼要學這個？】
如果地基沒打好，後面學「執行緒生命週期」會一頭霧水，因為你會搞不清楚「執行緒」跟「程式」是不是同一回事。先把名詞釐清，後面才不會卡關。

【學習目標】
學完這部分，我們能正確說出 Program、Process、Thread 三者的差異，也能講出為什麼現代電腦需要多執行緒。
-->

---

# Program、Process、Thread

| 概念 | 說明 | 比喻 |
|------|------|------|
| **Program** | 儲存在磁碟上的靜態指令集合（.class 檔案） | 服務窗口的作業手冊 |
| **Process** | 正在執行中的程式，擁有獨立的記憶體空間 | 一間開門營業的分行 |
| **Thread** | 行程內的最小執行單位，共享行程記憶體 | 分行裡的一個服務窗口 |

<!--
【重點解說】
這三個詞很多人會混用，但其實是「一層包一層」的關係：Program 是死的，Process 是活的，Thread 是活的裡面更小的單位。

【生活化比喻】
Program 就像放在櫃子裡的「作業手冊」——你不去翻它、不去執行，它就只是一份文件。Process 是「開門營業的分行」，有自己的金庫、自己的客戶資料（獨立記憶體）。Thread 則是「分行裡的一個服務窗口」：同一間分行可以開好幾個窗口，窗口們共用同一個金庫，但各自服務不同的客戶。

【業界實務】
在實務上，一個 Java 應用程式啟動時就是一個 Process，裡面預設至少有一個 main 執行緒；伺服器程式則常常開出幾十甚至上百個執行緒，同時服務不同的使用者請求。
-->

---

# Process vs Thread

| 比較項目 | Process | Thread |
|---------|---------|--------|
| 記憶體 | 各自獨立 | 共享同一行程 |
| 建立成本 | 較高（重量級） | 較低（輕量級） |
| 通訊方式 | IPC（較複雜） | 直接存取共享變數 |
| 隔離性 | 完整隔離 | 需要同步保護 |

<!--
【重點解說】
這張表格的關鍵字是「成本」跟「隔離」。Process 之間互相獨立，安全但開銷大；Thread 之間共享記憶體，開銷小但要小心資料互相干擾。

【生活化比喻】
開一間新分行（Process）要租店面、裝金庫、招募人手，成本很高；但在現有分行裡多開一個服務窗口（Thread），只要再擺一張桌子就好，便宜又快速。差別在於：新分行有自己的金庫互不相通，但同一間分行裡的所有窗口，都共用同一個金庫——這就是後面要學「同步機制」的原因。

【業界實務】
這也是為什麼伺服器程式偏好用多執行緒而不是多行程來處理大量請求：建立成本低、資料共享方便，但相對地要更小心處理共享資料的安全性。
-->

---

# 多工作業 Multitasking

**兩種多工類型：**

| 類型 | 說明 | 範例 |
|------|------|------|
| **Process-based** | 同時執行多個獨立程式 | 瀏覽器 + 文書軟體 + 音樂播放器 |
| **Thread-based** | 同一程式內同時執行多個任務 | 下載檔案同時更新進度條 |

**為何需要多執行緒？**

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>核心優勢：</b> 充分利用 CPU 多核心，提升應用程式回應性與吞吐量
</div>

**典型應用場景：**
- 網頁伺服器同時處理多個請求
- GUI 應用背景下載不阻塞畫面
- 資料庫並行查詢

<!--
【重點解說】
多工作業分兩種層次：一種是「整台電腦同時跑很多軟體」（Process-based），另一種是「同一個軟體裡同時做好幾件事」（Thread-based）。我們今天的主題屬於後者。

【生活化比喻】
想像分行只有一個服務窗口：客戶要存款、要辦貸款、要詢問匯率，全部排成一條隊伍。揍員一次只能處理一件事，後面的人只能乾等。如果分行有 8 個窗口（對應電腦的 8 核心 CPU），結果卻只開 1 個窗口服務，其他 7 個都空著沒人用——這不是省錢，這是讓客戶白白浪費時間。

【業界實務】
現代伺服器、GUI 應用程式幾乎都是 Thread-based 多工：網頁伺服器同時處理上百個連線請求，桌面程式在背景下載檔案的同時，畫面仍然可以正常操作，不會「卡死」。
-->

---

# Java 的多執行緒

```java
public class ThreadInfo {
    public static void main(String[] args) {
        Thread t = Thread.currentThread();
        System.out.println("名稱: " + t.getName());
        System.out.println("優先: " + t.getPriority());
        System.out.println("狀態: " + t.getState());
    }
}
// 輸出：名稱: main / 優先: 5 / 狀態: RUNNABLE
```

| 相關 API | 說明 |
|---------|------|
| `java.lang.Thread` | 執行緒類別 |
| `java.lang.Runnable` | 任務介面（`@FunctionalInterface`） |
| `java.lang.Object` | `wait()` / `notify()` 方法 |
| `java.util.concurrent.*` | 進階並發工具（JDK 5+） |

<!--
【帶讀導覽】
這段範例只有一個目的：證明「你的程式從一開始就是多執行緒環境」。我們呼叫 `Thread.currentThread()`，拿到的就是正在執行 main 方法的那個執行緒。

【易錯點提醒】
很多人以為「執行緒」是一個進階、要特地開啟的功能，但其實連最普通的 `main` 方法本身就跑在一個叫 "main" 的執行緒裡。Java 的垃圾回收（GC）也是另一個默默在背景工作的執行緒，就像分行打掃環境的工作人員——你不用管它，它自己在那裡運作。

【預期結果】
執行後會印出名稱 "main"、優先權預設值 5、狀態 RUNNABLE，證明 main 方法本身就是一個執行緒。
-->

---

# 執行緒的生命週期

```
NEW ──start()──▶ RUNNABLE ◀──────────────────┐
                    │                         │
              排程器選中                    notify()
                    ▼                         │
                RUNNING              WAITING/TIMED_WAITING
                    │                         │
        lock 競爭失敗                    wait()/join()
                    ▼                         │
                BLOCKED ──取得 lock──▶ RUNNABLE
                    │
            run() 結束
                    ▼
               TERMINATED
```

<!--
【重點解說】
這張圖是執行緒從生到死的完整流程，也是面試很喜歡考的一張圖。

【生活化比喻】
把這想成一個服務窗口的「值班狀態」：NEW 是窗口還沒開門（剛建立但沒呼叫 `start()`）；RUNNABLE 是已經開門、準備或正在服務客戶；BLOCKED 是窗口想用某份共用資料，但資料正被別的窗口鎖著，只能在門口等；WAITING / TIMED_WAITING 是窗口主動說「我先休息一下，等通知再回來」；TERMINATED 就是這個窗口今天的服務結束、打卡下班。

【業界實務】
理解這張圖之後，遇到「程式卡住不動」的問題時，我們才能判斷：是執行緒在 BLOCKED（搶鎖搶不到）、還是在 WAITING（等通知但沒人通知），這是除錯多執行緒程式最重要的基本功。
-->

---

# 執行緒狀態說明

| 狀態 | 說明 | 觸發方式 |
|------|------|---------|
| `NEW` | 已建立但未啟動 | `new Thread()` |
| `RUNNABLE` | 可執行或執行中 | `start()` |
| `BLOCKED` | 等待取得 monitor lock | 競爭 `synchronized` |
| `WAITING` | 無限期等待其他執行緒 | `wait()`, `join()` |
| `TIMED_WAITING` | 限時等待 | `sleep(ms)` |
| `TERMINATED` | 執行完畢 | `run()` 結束 |

<!--
【重點解說】
這張表把上一頁的生命週期圖，逐一對應到「觸發這個狀態的程式碼」。

【易錯點提醒 ⚠️】
最容易搞混的是 BLOCKED 跟 WAITING：BLOCKED 是「被動」的——窗口想用某份資料，但資料被鎖住了，只能乾等別人放手；WAITING 是「主動」的——窗口自己選擇暫停（呼叫 `wait()` 或 `join()`），等別人通知才回來。

【業界實務】
面試官常會問「BLOCKED 跟 WAITING 有什麼差別」，正確答案就是這一行：BLOCKED 是搶鎖搶輸了，WAITING 是自己選擇休息。記住這個區分，後面學 `synchronized` 跟 `wait()/notify()` 時會更容易理解。
-->

---
layout: default
---

# 練習 1：執行緒基礎概念
### 認證模擬題（單選）

關於 `Thread` 的狀態與 Program / Process / Thread 三者的關係，下列描述何者**正確**？

A. 一個 `Process` 內最多只能有一個 `Thread`，這也是「行程」跟「執行緒」唯一的差別<br>
B. 呼叫 `new Thread(task)` 之後、尚未呼叫 `start()` 之前，這個執行緒的狀態是 `NEW`<br>
C. 執行緒呼叫 `sleep()` 進入等待後，狀態會變成 `BLOCKED`<br>
D. `Thread` 物件一旦進入 `TERMINATED` 狀態，呼叫 `start()` 可以讓它重新開始執行

<!--
【出題動機】
這題想確認大家對「Program / Process / Thread 的關係」以及「執行緒生命週期狀態」這兩個剛學完的核心概念是不是真的分清楚了，這也是證照考試跟面試很愛問的題型。

【解題引導】
先想一想：一個 Process（分行）裡面可以開幾個服務窗口（Thread）？再回頭看看生命週期圖——`new Thread()` 之後但還沒呼叫 `start()`，窗口處於什麼狀態？`sleep()` 跟 `wait()`/`join()` 觸發的狀態是同一個嗎？最後，一個已經打卡下班（TERMINATED）的窗口，能不能再被叫回來重新上班？
-->

---
layout: default
---

# 練習 1：執行緒基礎概念
### 解析

**正確答案：B**

- A. ❌ 一個 `Process` 內可以有「多個」`Thread`，這正是多執行緒的核心——多個窗口共用同一間分行的資源
- B. ✅ 物件剛建立（`new Thread()`）但還沒呼叫 `start()`，依照生命週期圖，狀態就是 `NEW`
- C. ❌ `sleep()` 觸發的是 `TIMED_WAITING`（限時等待）；`BLOCKED` 是「競爭 `synchronized` 鎖失敗」才會進入的狀態
- D. ❌ `TERMINATED` 代表執行緒已經結束、`run()` 已經跑完，無法再被 `start()`，重新呼叫 `start()` 會丟出 `IllegalThreadStateException`

<!--
【帶讀解法】
這題把第一部分三個重要概念串在一起：Process/Thread 的「一對多」關係、`NEW` 狀態的觸發時機（`new` 之後、`start()` 之前），以及 `sleep()` 對應 `TIMED_WAITING` 而不是 `BLOCKED`。記住「BLOCKED 是搶鎖搶輸，TIMED_WAITING 是自己設了鬧鐘睡覺」，這兩者很常被搞混，務必分清楚。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 建立執行緒

<!--
【小節開場】
第二部分要動手做：學三種把執行緒「生出來」的方法。

【為什麼要學這個？】
知道執行緒的概念還不夠，我們得知道怎麼在程式裡真正建立一個執行緒、讓它開始工作。三種方法各有適用場景，學完之後我們才能依情況選擇最合適的寫法。

【學習目標】
學完這部分，我們能用繼承 Thread、實作 Runnable、以及 Lambda 三種方式建立執行緒，並說出三者的優缺點與選用建議。
-->

---

# 方法一：繼承 Thread 類別

```java
class MyThread extends Thread {
    private String taskName;

    public MyThread(String name) { this.taskName = name; }

    @Override
    public void run() {
        for (int i = 1; i <= 3; i++)
            System.out.println(taskName + " - 步驟 " + i);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        MyThread t1 = new MyThread("執行緒A");
        MyThread t2 = new MyThread("執行緒B");
        t1.start();   // ← 呼叫 start()，不是 run()！
        t2.start();
    }
}
```

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> 直接呼叫 <code>run()</code> 不會建立新執行緒，只是一般方法呼叫。必須呼叫 <code>start()</code>！
</div>

<!--
【帶讀導覽】
這是最直覺的建立方式：寫一個類別繼承 `Thread`，覆寫 `run()` 方法放入要執行的任務，再呼叫 `start()` 啟動。

【易錯點提醒 ⚠️】
這是新手最常踩的坑：呼叫 `start()` 跟呼叫 `run()` 結果完全不同！`start()` 會真的開一個新的服務窗口（新執行緒）去執行任務；`run()` 只是叫現有的窗口人員「順手做一下」，並沒有開新窗口，整個程式還是排成一條隊伍依序執行。

【預期結果】
執行後 `t1` 和 `t2` 會「同時」各自印出三行訊息，順序可能交錯，因為兩個執行緒是並行執行的。
-->

---

# 方法二：實作 Runnable 介面

```java
class PrintTask implements Runnable {
    private String message;

    public PrintTask(String msg) { this.message = msg; }

    @Override
    public void run() {
        for (int i = 1; i <= 3; i++)
            System.out.println(message + " #" + i);
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        Runnable task = new PrintTask("Hello");
        Thread t = new Thread(task);
        t.start();
    }
}
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>推薦原因：</b> 實作介面不影響繼承關係；任務（Runnable）與執行機制（Thread）職責分離，設計更靈活
</div>

<!--
【帶讀導覽】
第二種方式：讓類別實作 `Runnable` 介面，只定義「要做什麼」，再把這個任務交給一個 `Thread` 物件去執行。

【生活化比喻】
繼承 `Thread` 就像是「你本身就得是窗口人員」；實作 `Runnable` 則像是「你只是寫好一份工作清單（任務），再交給隨便一個窗口人員去執行」。因為 Java 不能多重繼承——如果這個類別已經繼承了別的東西，就不能再繼承 `Thread`，但實作 `Runnable` 介面完全不受影響。

【易錯點提醒 ⚠️】
別忘了最後還是要用 `Thread` 把 `Runnable` 包起來再呼叫 `start()`，單獨呼叫 `task.run()` 一樣不會開新執行緒。
-->

---

# 方法三：Lambda 表達式（Java 8+）

最簡範例：

```java
Thread t = new Thread(() -> System.out.println("Lambda 執行緒！"));
t.start();
```

完整範例：

```java
Thread t1 = new Thread(() -> {
    for (int i = 1; i <= 3; i++)
        System.out.println("任務1 - " + i);
}, "Worker-1");

Thread t2 = new Thread(() -> {
    for (int i = 1; i <= 3; i++)
        System.out.println("任務2 - " + i);
}, "Worker-2");

t1.start();
t2.start();
```

<!--
【帶讀導覽】
因為 `Runnable` 是一個 `@FunctionalInterface`（只有一個抽象方法），所以可以直接用 Lambda 表達式取代「寫一整個類別」，這是目前最常見的寫法。

【生活化比喻】
如果只是要讓某個窗口暫時去做一件簡單的事，用 Lambda 就像隨手寫一張便條紙交給空著的窗口人員：「幫我印一下這份報表」，不用特地為這件小事新增一個正式職位（類別）。

【預期結果】
最簡範例會印出一行「Lambda 執行緒！」；完整範例的 `t1`、`t2` 會分別命名為 "Worker-1"、"Worker-2"，同時各自印出三行訊息，順序可能交錯。
-->

---

# 三種方法比較

| 方法 | 繼承 Thread | 實作 Runnable | Lambda |
|------|------------|--------------|--------|
| Java 版本 | 全版本 | 全版本 | Java 8+ |
| 繼承限制 | 無法再繼承 | 無限制 | 無限制 |
| 程式碼量 | 多 | 中 | 少 |
| 任務/執行緒分離 | 否 | 是 | 是 |
| 適用場景 | 需覆寫 Thread 方法時 | 一般推薦 | 簡單任務 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
💡 <b>最佳實踐：</b> 優先使用 Lambda 或 Runnable；只有需要覆寫 <code>Thread</code> 的其他方法時才繼承
</div>

<!--
【重點解說】
這張表幫我們做選擇：三種方式怎麼挑？

【業界實務】
實務上幾乎都優先用 Lambda 或 `Runnable`：任務內容跟「執行緒怎麼跑」分開設計，彈性高、好測試。只有在真的需要客製化 `Thread` 本身的行為（例如改寫某些底層方法）時，才會考慮繼承 `Thread`——這種情況在一般專案中相當少見。

【小結】
記住一句話：能不繼承就不要繼承，先想 Lambda，再想 Runnable，最後才考慮繼承 Thread。
-->

---

# Java 執行緒的工作原理

每個執行緒有獨立的 Stack，但共享 Heap 中的物件：

```
┌─────────────────────────┐
│       JVM Process       │
│  ┌──────┐  ┌──────┐    │
│  │ t1   │  │ t2   │    │
│  │Stack │  │Stack │    │
│  └──┬───┘  └──┬───┘    │
│     │         │         │
│  ┌──▼─────────▼──────┐ │
│  │    Heap（共享）    │ │
│  │  shared variables  │ │
│  └────────────────────┘ │
└─────────────────────────┘
```

| 方法 | 說明 |
|------|------|
| `getName()` / `getId()` | 取得名稱 / ID |
| `getState()` | 取得目前狀態 |
| `isAlive()` | 是否仍在執行 |
| `Thread.currentThread()` | 取得目前執行緒 |

<!--
【重點解說】
這張圖解釋了「為什麼多執行緒程式容易出意外」的根本原因。

【生活化比喻】
每個服務窗口（執行緒）都有自己的小抽屜（Stack），放自己手上正在處理的單據（局部變數），別的窗口看不到也碰不到。但所有窗口共用同一個大金庫（Heap），裡面放的是共享資料。如果兩個窗口同時伸手去拿金庫裡「最後一筆存款記錄」，卻沒有事先講好順序，最後寫回金庫的結果就可能是錯的——這正是後面「同步機制」要解決的問題。

【業界實務】
這也是為什麼「執行緒安全（Thread-safe）」幾乎都是針對「共享的 Heap 資料」討論，而局部變數（在各自 Stack 裡）天生就是執行緒安全的，不需要額外保護。
-->

---
layout: default
---

# 練習 2：種方式建立執行緒
### 任務說明

請用我們剛剛學到的**三種方式**，各自建立一個執行緒，完成同一件事：印出 5 次 `"訊息 #N"`（N 為 1~5）。

1. **繼承 Thread**：寫一個 `MessageThread` 類別繼承 `Thread`，覆寫 `run()`
2. **實作 Runnable**：寫一個 `MessagePrinter` 類別實作 `Runnable`
3. **Lambda**：直接用 Lambda 表達式建立第三個執行緒

最後在 `main` 中分別建立並啟動這三個執行緒。

<!--
【任務鋪陳】
這一題就是把第二部分教的三種建立執行緒的方式，動手各寫一次，感受一下它們的程式碼量跟寫法差異。

【引導思考】
寫完之後想一想：哪一種寫法最簡短？如果這個 `MessagePrinter` 類別之後還需要繼承別的類別（例如 `extends SomeBaseClass`），三種方式裡哪一種會立刻遇到麻煩？這就是「三種方法比較」表格裡「繼承限制」那一欄想表達的事情。
-->

---
layout: default
---

# 練習 2：三種方式建立執行緒
### 解題提示（1/2）：繼承 Thread、實作 Runnable

**① 繼承 Thread：**

```java
class MessageThread extends Thread {
    @Override
    public void run() {
        for (int i = 1; i <= 5; i++)
            System.out.println("訊息 #" + i);
    }
}
```

**② 實作 Runnable：**

```java
class MessagePrinter implements Runnable {
    @Override
    public void run() {
        for (int i = 1; i <= 5; i++)
            System.out.println("訊息 #" + i);
    }
}
```

<!--
【帶讀解法】
先看前兩種寫法。任務內容都寫在 run() 裡，差別只在於要包成 `Thread` 子類別，還是 `Runnable` 物件。
-->

---
layout: default
---

# 練習 2：三種方式建立執行緒
### 解題提示（2/2）：Lambda 與啟動方式

**③ Lambda：**

```java
Runnable task = () -> {
    for (int i = 1; i <= 5; i++)
        System.out.println("訊息 #" + i);
};
```

**啟動方式：**

```java
new MessageThread().start();
new Thread(new MessagePrinter()).start();
new Thread(task).start();
```

<!--
第三種是 Lambda，最精簡。三種寫法最後都要呼叫 `start()` 才會真正開新執行緒。實際執行時，三個執行緒的輸出可能會交錯出現，這是正常的並行現象。

如果 `MessagePrinter` 之後要 `extends` 別的類別，方式②、③完全不受影響，但方式①因為已經繼承了 `Thread`，就無法再繼承其他類別了——這正是「優先用 Runnable/Lambda」的原因。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 執行緒控制

<!--
【小節開場】
第三部分要學怎麼「控制」執行緒的節奏：讓它睡覺、讓別人等它、設定優先順序，以及認識守護執行緒。

【為什麼要學這個？】
光會建立執行緒還不夠，實務上常常需要「暫停一下」、「等某個任務先做完再繼續」，或是「這個背景任務不重要，主程式結束就讓它一起結束」。這些都是執行緒控制要解決的問題。

【學習目標】
學完這部分，我們會用 `sleep()`、`join()`、`setPriority()`、`setDaemon()` 來控制執行緒的執行節奏與生命週期。
-->

---

# Thread.sleep() — 讓執行緒睡眠

最簡範例：

```java
Thread.sleep(1000);  // 暫停 1 秒（1000 毫秒）
```

完整倒數範例：

```java
public class SleepDemo {
    public static void main(String[] args) throws InterruptedException {
        for (int i = 5; i >= 1; i--) {
            System.out.println("倒數：" + i);
            Thread.sleep(1000);
        }
        System.out.println("發射！");
    }
}
```

<!--
【帶讀導覽】
`Thread.sleep(ms)` 讓目前的執行緒暫停指定的毫秒數，是控制執行節奏最基本的方法。

【生活化比喻】
這就像服務窗口跟客戶說：「請等我一下」，然後真的閉上眼睛休息指定的時間，時間到了才繼續動作。

【預期結果】
範例會每秒印出一次倒數（5、4、3、2、1），最後印出「發射！」，整體耗時約 5 秒。
-->

---

# Thread.sleep() — 注意事項

| 方法簽章 | 說明 |
|---------|------|
| `sleep(long millis)` | 暫停指定毫秒 |
| `sleep(long millis, int nanos)` | 精確到奈秒 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> <code>sleep()</code> 會拋出 <code>InterruptedException</code>，必須捕捉或向上宣告。睡眠中的執行緒<b>不會</b>釋放已持有的 lock。
</div>

<!--
【易錯點提醒 ⚠️】
第一個重點：`sleep()` 會拋出 `InterruptedException`（一種 checked exception），這是 Java 在告訴我們「執行緒睡覺時有可能被別人叫醒（中斷）」，所以一定要 `try-catch` 或用 `throws` 往外宣告。

【重點解說】
第二個更重要的重點：睡覺中的執行緒「不會放開手上的鎖」。如果一個執行緒拿著鎖去睡覺，其他想要這個鎖的執行緒就只能乾等到它睡醒——這常常是程式「卡住」的原因之一，後面學 `synchronized` 時要特別留意這一點。
-->

---

# Thread.join() — 等待執行緒完成

最簡範例：

```java
t1.join();  // 等待 t1 結束後再繼續
```

完整範例：

```java
public class JoinDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            System.out.println("Worker 開始處理...");
            try { Thread.sleep(2000); } catch (InterruptedException e) {}
            System.out.println("Worker 完成！");
        });
        worker.start();
        worker.join();          // main thread 等待 worker 結束
        System.out.println("主程式繼續執行");
    }
}
```

| 方法簽章 | 說明 |
|---------|------|
| `join()` | 無限等待直到結束 |
| `join(long millis)` | 最多等待指定毫秒 |

<!--
【帶讀導覽】
`join()` 的意思是「等等我」：呼叫 `worker.join()` 的那個執行緒（這裡是 main），會暫停下來，直到 `worker` 執行完畢才繼續往下走。

【生活化比喻】
這就像主管把一份報表交給某個窗口處理，然後說：「我等你做完這份報表再開會」。窗口做完之前，主管就不會去開會。

【預期結果】
程式會先印出「Worker 開始處理...」，等待約 2 秒後印出「Worker 完成！」，最後才印出「主程式繼續執行」——順序固定，不會交錯。
-->

---

# setPriority() — 執行緒優先順序

```java
Thread t = new Thread(() -> System.out.println("執行中"));
t.setPriority(Thread.MAX_PRIORITY);  // 設為最高優先
t.start();
```

| 常數 | 值 | 說明 |
|------|-----|------|
| `Thread.MIN_PRIORITY` | 1 | 最低優先權 |
| `Thread.NORM_PRIORITY` | 5 | 預設優先權 |
| `Thread.MAX_PRIORITY` | 10 | 最高優先權 |

| 方法 | 說明 |
|------|------|
| `setPriority(int p)` | 設定優先權（1–10） |
| `getPriority()` | 取得目前優先權 |

<div class="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 優先權只是「建議」，JVM 和 OS 不保證嚴格按優先權排程。不同作業系統的行為可能不同，請勿依賴優先權做程式邏輯判斷。
</div>

<!--
【重點解說】
執行緒可以設定 1 到 10 的優先權，數字越大表示「希望」排程器多分配一點 CPU 時間給它。

【易錯點提醒 ⚠️】
但這裡的「希望」只是建議，不是命令！排程器（作業系統）會參考這個數字，但不保證一定照辦，不同作業系統的行為也可能不一樣。

【業界實務】
實務上幾乎不會用優先權來控制程式邏輯的正確性——如果你的程式「正確與否」要靠某個執行緒一定先執行、一定搶到 CPU，那代表設計上已經有問題，應該用 `join()`、鎖或其他同步機制來保證順序，而不是賭優先權。
-->

---

# setDaemon() — 守護執行緒

最簡範例：

```java
Thread t = new Thread(() -> { /* 背景任務 */ });
t.setDaemon(true);  // 必須在 start() 前設定
t.start();
```

完整範例：

```java
Thread daemon = new Thread(() -> {
    while (true) {
        System.out.println("Daemon 監控中...");
        try { Thread.sleep(500); } catch (InterruptedException e) { break; }
    }
});
daemon.setDaemon(true);
daemon.start();
Thread.sleep(1500);
System.out.println("Main 結束，Daemon 自動停止");
```

<!--
【帶讀導覽】
這段範例展示一個「無窮迴圈」的背景監控任務，搭配 `setDaemon(true)`，讓它在主程式結束時自動跟著結束，不會卡住整個程式。

【生活化比喻】
想像分行裡有個保全人員，整天巡邏、不會「做完」就下班——他是為了服務分行而存在的。如果分行所有正式窗口都打卡下班了，保全也應該自動離開，不會獨自繼續巡邏一間空蕩蕩的分行。

【易錯點提醒 ⚠️】
`setDaemon(true)` 一定要在 `start()` 之前呼叫，否則會丟出例外。

【預期結果】
程式會印出幾次「Daemon 監控中...」，約 1.5 秒後印出「Main 結束，Daemon 自動停止」，daemon 執行緒不會繼續無窮迴圈下去。
-->

---

# setDaemon() — 說明

| 類型 | 說明 |
|------|------|
| **User 執行緒** | 一般執行緒，JVM 等待所有 User 執行緒結束才退出 |
| **Daemon 執行緒** | 背景執行緒，所有 User 執行緒結束後 JVM 自動終止它 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Daemon 執行緒：</b> 當所有 User 執行緒結束，JVM 會自動終止所有 Daemon 執行緒並退出。GC 就是最典型的 Daemon 執行緒。
</div>

<!--
【重點解說】
JVM 把執行緒分成兩種：User 執行緒跟 Daemon 執行緒。JVM 的退出條件是「所有 User 執行緒都結束了」，跟 Daemon 執行緒無關——Daemon 會被直接強制終止。

【業界實務】
常見的 Daemon 應用場景包括：心跳 / Ping 監控（定期檢查遠端服務是否存活）、背景日誌刷寫（定期把記憶體裡的 log 寫到磁碟）、連線池健康檢查（像 HikariCP 內部就有這種背景執行緒）。Java 內建的 GC（垃圾回收）就是最典型的 Daemon 執行緒。

【易錯點提醒 ⚠️】
什麼時候絕對不能用 Daemon？只要這個執行緒會寫資料庫、寫檔案、需要 commit transaction，就不能設成 Daemon——因為 Daemon 被強制終止時不會執行 `finally`，資料可能寫到一半就斷掉。記住口訣：「有 I/O 副作用的任務，永遠不要設成 Daemon。」

【小結】
一句話總結：Daemon 是「服務主執行緒的工具人」，主人（User 執行緒）都走了，它就沒有存在的意義，會自動跟著下班。
-->

---
layout: default
---

# 練習 3：執行緒控制方法辨析
### 認證模擬題（單選）

```java
Thread worker = new Thread(() -> {
    try { Thread.sleep(2000); } catch (InterruptedException e) {}
    System.out.println("worker 完成");
});
worker.setDaemon(true);
worker.start();
System.out.println("main 結束");
```

關於這段程式碼，下列描述何者**正確**？

A. `setDaemon(true)` 必須在 `worker.start()` 之後呼叫才會生效<br>
B. 因為 `worker` 被設為 Daemon 執行緒，"main 結束" 一定會在 "worker 完成" 之前印出來<br>
C. 這段程式碼可能會在印出 "main 結束" 後就直接結束，"worker 完成" 不一定會被印出來<br>
D. `Thread.sleep(2000)` 會釋放 `worker` 持有的所有鎖，讓 main 執行緒先執行

<!--
【出題動機】
這題把 `sleep()`、`setDaemon()` 跟「JVM 何時退出」這幾個第三部分學到的概念綜合起來考，特別是 Daemon 執行緒「可能被中途強制終止」這個容易被忽略的特性。

【解題引導】
先檢查 `setDaemon(true)` 呼叫的時機對不對。再想一想：JVM 的退出條件是什麼？只跟 User 執行緒有關，還是也要等 Daemon 執行緒？如果 main（唯一的 User 執行緒）已經印完 "main 結束" 並結束了，這時候 `worker` 還在 `sleep()` 倒數，會發生什麼事？
-->

---
layout: default
---

# 練習 3：執行緒控制方法辨析
### 解析

**正確答案：C**

- A. ❌ `setDaemon(true)` 一定要在 `start()` **之前**呼叫，否則會丟出 `IllegalThreadStateException`；這段程式碼的呼叫順序是對的（先 `setDaemon` 再 `start`），但描述本身是錯的
- B. ❌ 順序確實很可能是 "main 結束" 先印出（因為 main 不用等 `worker`），但「一定」這個說法不準確——理論上排程順序不保證，只是機率上 main 通常會先完成
- C. ✅ JVM 的退出條件只看 User 執行緒：main 是唯一的 User 執行緒，一旦它印完 "main 結束" 就結束了，此時 `worker`（Daemon）若還在 `sleep(2000)` 倒數中，會被 JVM 直接強制終止，"worker 完成" 很可能根本來不及印出
- D. ❌ `sleep()` **不會**釋放任何鎖，這題程式碼裡也沒有用到 `synchronized`，此選項描述的行為與 `sleep()` 的特性不符

<!--
【帶讀解法】
這題的關鍵在於分清楚兩件事：第一，`setDaemon()` 必須在 `start()` 前呼叫（時機問題）；第二，Daemon 執行緒會在所有 User 執行緒結束時被「強制終止」，不會等它做完手上的工作。這也呼應前面學過的口訣：「有 I/O 副作用的任務，永遠不要設成 Daemon」，因為它可能在任何時間點被腰斬。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 同步機制

<!--
【小節開場】
第四部分是整個自學內容最核心的概念：當多個執行緒同時存取同一份共享資料時，怎麼避免資料被搞亂。

【為什麼要學這個？】
回想我們前面用的「多窗口服務台」比喻——所有窗口共用同一個金庫。如果兩個窗口同時更新同一筆帳戶餘額，卻沒有協調，金額很可能就會算錯。這就是「競爭條件」，是多執行緒程式最常見、也最難除錯的 bug 來源。

【學習目標】
學完這部分，我們能用 `synchronized` 方法、同步區塊、同步靜態方法，正確保護共享資料，避免競爭條件發生。
-->

---

# 為什麼需要同步？

不安全的計數器（`count++` 是三個步驟：讀取 → 加 1 → 寫回）：

```java
class Counter {
    private int count = 0;
    public void increment() { count++; }  // 非原子操作！
}
```

```
Thread-1: 讀取 count=0
Thread-2: 讀取 count=0
Thread-1: 寫入 count=1
Thread-2: 寫入 count=1  ← 期望是 2，結果卻是 1！
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
🔴 <b>Race Condition（競爭條件）：</b> 多個執行緒同時存取並修改共享資料，執行結果依賴執行順序，導致不可預測的錯誤。
</div>

<!--
【情境切入】
想像金庫裡有一本存摺，記錄目前餘額是 0。兩個窗口同時要替同一位客戶各加 1 元，理論上最後應該是 2 元。

【重點解說】
但 `count++` 看起來是「一行程式碼」，實際上是三個步驟：①讀取目前的值、②加 1、③寫回去。如果兩個窗口「幾乎同時」執行這三步，可能都先讀到 0，各自加 1 得到 1，再各自把 1 寫回去——最後存摺上還是 1，而不是期望的 2。

【生活化比喻】
這就是「Race Condition（競爭條件）」：兩個窗口同時在搶著改同一本存摺，誰先寫、誰後寫沒有保證，結果完全看「運氣」，而程式的結果不該靠運氣。

【易錯點提醒 ⚠️】
這種 bug 最麻煩的地方是：它不一定每次都發生！可能跑 100 次只出錯 1 次，這也是多執行緒程式特別難除錯的原因。
-->

---

# synchronized 關鍵字

修正後的安全計數器：

```java
class SafeCounter {
    private int count = 0;

    public synchronized void increment() {
        count++;  // 同一時刻只有一個執行緒能進入
    }

    public synchronized int getCount() { return count; }
}
```

```java
SafeCounter counter = new SafeCounter();
Thread t1 = new Thread(() -> { for(int i=0; i<1000; i++) counter.increment(); });
Thread t2 = new Thread(() -> { for(int i=0; i<1000; i++) counter.increment(); });
t1.start(); t2.start();
t1.join();  t2.join();
System.out.println("結果: " + counter.getCount()); // 必定是 2000
```

<!--
【概念定義】
`synchronized` 關鍵字的作用是：「同一時刻，只允許一個執行緒進入這個方法」。這就是解決上一頁問題的鑰匙。

【生活化比喻】
這就像在金庫的入口裝一道只能容納一人的旋轉門：當 Thread-1 正在裡面更新存摺時，Thread-2 只能在門外排隊，等 Thread-1 出來才能進去。這樣一來，「讀取 → 加 1 → 寫回」這三個步驟就不會被打斷。

【預期結果】
兩個執行緒各自把 `counter` 加 1000 次，加上 `synchronized` 之後，最終結果必定是 2000，不會再出現少算的情況。

【易錯點提醒 ⚠️】
`getCount()` 也要加 `synchronized`，否則讀取時可能讀到「正在被修改中」的中間值，一樣會有資料不一致的風險。
-->

---

# 匿名類別 Anonymous Class

不需要另外定義類別，直接在使用處定義並建立物件：

```java
// 用匿名類別實作 Runnable
Thread t = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("匿名類別執行緒：" +
            Thread.currentThread().getName());
    }
});
t.start();
```

```java
// Lambda 等效寫法（Java 8+）
Thread t2 = new Thread(
    () -> System.out.println("Lambda 執行緒")
);
t2.start();
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>比較：</b> 匿名類別 vs Lambda — 兩者效果相同，但 Lambda 語法更簡潔。Java 8 後推薦使用 Lambda。
</div>

<!--
【概念定義】
匿名類別（Anonymous Class）是「不取名字、直接在使用的地方定義並建立物件」的寫法，在 Java 8 之前是實作 `Runnable` 的常見方式。

【生活化比喻】
這就像臨時找一位工讀生來頂班，不需要正式幫他建立員工檔案（不用另外宣告一個 class），當場交代工作內容就上工。

【業界實務】
現在我們幾乎都用 Lambda 取代匿名類別，因為效果完全相同但語法更短。看到 `new Runnable() { ... }` 這種寫法時，多半是比較舊的程式碼，理解它能幫助我們讀懂遺留專案（legacy code）。
-->

---

# 同步區塊 Synchronized Block

比同步方法更精細，只鎖定關鍵區域：

```java
class PartialSync {
    private int shared = 0;
    private final Object lock = new Object();

    public void process() {
        // 非同步的準備工作（可並行執行）
        System.out.println("準備中...");

        synchronized (lock) {   // 只對關鍵部分加鎖
            shared++;
            System.out.println("共享值：" + shared);
        }

        System.out.println("收尾中...");
    }
}
```

<!--
【概念定義】
同步區塊（Synchronized Block）讓我們只鎖定「真正需要保護」的那一小段程式碼，而不是整個方法。

【生活化比喻】
回到旋轉門的比喻：如果整個服務流程有 10 個步驟，只有第 5 步要動用金庫，那就只在第 5 步裝旋轉門，前面 4 步跟後面 5 步大家都可以同時進行，不用排隊。

【易錯點提醒 ⚠️】
`synchronized (lock)` 裡的 `lock` 物件很重要：所有想要互斥的執行緒，必須鎖的是「同一個物件」，否則等於每個人都用自己的門鎖，鎖了也沒用。
-->

---

# 同步區塊 — 比較

| 比較 | synchronized 方法 | synchronized 區塊 |
|------|-----------------|-----------------|
| 鎖定範圍 | 整個方法 | 指定區塊 |
| 效能 | 較低（鎖定時間長） | 較高（縮小臨界區） |
| 鎖定物件 | `this`（實例方法） | 自訂物件 |

<!--
【重點解說】
這張表比較「鎖整個方法」跟「只鎖一小段」的差異，關鍵字是「臨界區（critical section）」的大小。

【生活化比喻】
如果整個服務流程要 10 分鐘，但只有 1 分鐘真正動用金庫，卻把整個 10 分鐘都鎖起來，其他窗口就要白白等 10 分鐘——這就是「鎖定時間長、效能較低」的意思。把鎖縮小到只包住那 1 分鐘，其他窗口的等待時間就大幅縮短。

【小結】
原則上：臨界區越小越好，但也不能小到漏掉真正需要保護的程式碼。這是寫多執行緒程式時，效能與正確性之間最常見的取捨。
-->

---

# 同步靜態方法

靜態方法的 synchronized 使用 **Class 層級的鎖**（不是 this）：

```java
class ClassLevelSync {
    private static int instanceCount = 0;

    // 鎖定的是 ClassLevelSync.class，所有實例共用同一把鎖
    public static synchronized void register() {
        instanceCount++;
    }

    public static synchronized int getCount() {
        return instanceCount;
    }
}
```

| 比較 | 實例方法 synchronized | 靜態方法 synchronized |
|------|---------------------|---------------------|
| 鎖 | `this`（物件本身） | `ClassName.class`（Class 物件） |
| 不同物件 | 不同鎖，可並行 | 全局同一把鎖 |
| 保護目標 | 實例狀態 | 靜態（類別層級）狀態 |

<!--
【概念定義】
當 `synchronized` 套用在 `static` 方法上時，鎖住的對象不是「某個物件」，而是整個「Class 物件」本身。

【生活化比喻】
一般的 `synchronized` 方法鎖的是「這個物件」，就像每個帳戶各自有一把鎖，不同帳戶的鎖互不影響。但靜態方法鎖的是「整個分行的營業執照」——不管哪個窗口（哪個物件實例），只要呼叫這個靜態方法，都要排隊用同一把鎖。

【易錯點提醒 ⚠️】
這代表：如果一個靜態方法鎖被某個執行緒長時間佔用，會影響「所有」物件實例對這個類別靜態方法的呼叫，影響範圍比實例鎖大得多，使用時要更謹慎。
-->

---
layout: default
---

# 練習 4：售票系統的同步區塊
### 任務說明

模擬演唱會售票系統，練習用**同步區塊**保護共享資源：

1. 建立 `TicketBooth` 類別，包含 `remainingTickets`（剩餘票數）欄位，初始值 100
2. 實作 `sellTicket(String buyerName)` 方法：
   - 準備工作（印出 `"[buyerName] 嘗試購票..."`）**不需要**加鎖
   - 只有「檢查剩餘票數、扣減 1 張」這一段，用 `synchronized` 區塊鎖住
   - 若還有票，扣 1 張並印出 `"[buyerName] 購票成功，剩餘 X 張"`；若沒票，印出 `"[buyerName] 購票失敗，已售完"`
3. 建立 10 個執行緒模擬 10 位買家同時搶票，每人都呼叫 `sellTicket`

**重點觀察：** 最終 `remainingTickets` 不會出現負數或重複賣出同一張票的情況

<!--
【任務鋪陳】
這一題練習第四部分學到的「同步區塊」寫法：跟練習二的 `BankAccount` 用整個方法加 `synchronized` 不同，這次我們只把「檢查 + 扣票」這個關鍵動作鎖起來，準備工作不用鎖。

【引導思考】
想一想：為什麼「印出『嘗試購票』」這個動作不需要放進同步區塊？如果把整個 `sellTicket` 方法都標成 `synchronized`，跟只鎖「檢查+扣票」這一小段，效能上會有什麼差別？
-->

---
layout: default
---

# 練習 4：售票系統的同步區塊
### 解題提示（1/2）

```java
class TicketBooth {
    private int remainingTickets = 100;
    private final Object lock = new Object();

    public void sellTicket(String buyerName) {
        System.out.println(buyerName + " 嘗試購票...");  // 不需要鎖

        synchronized (lock) {  // 只鎖「檢查 + 扣票」這一段
            if (remainingTickets > 0) {
                remainingTickets--;
                System.out.println(buyerName + " 購票成功，剩餘 "
                    + remainingTickets + " 張");
            } else {
                System.out.println(buyerName + " 購票失敗，已售完");
            }
        }
    }
}
```

<!--
【帶讀解法】
「嘗試購票...」這句話只是印出訊息，不會動到共享的 `remainingTickets`，所以不需要佔用鎖，可以讓多個執行緒同時印出這句話。但「檢查 `remainingTickets > 0` 再扣減」這個動作如果不鎖起來，就可能發生兩個執行緒同時讀到「還有 1 張」、結果都各自賣出 1 張，變成超賣。把臨界區縮小到只剩這幾行，既能保證正確性，也比把整個方法都鎖住來得有效率，這正是「同步區塊」存在的意義。
-->

---
layout: default
---

# 練習 4：售票系統的同步區塊
### 解題提示（2/2）

**啟動 10 個買家：**

```java
TicketBooth booth = new TicketBooth();
for (int i = 1; i <= 10; i++) {
    int id = i;
    new Thread(() -> booth.sellTicket("買家" + id)).start();
}
```

<!--
啟動 10 個買家，每個買家一條執行緒同時搶票。因為檢查加扣票被同步區塊鎖住，不會發生超賣。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 進階議題

<!--
【小節開場】
最後一部分要挑戰兩個進階主題：死結（Deadlock）的成因與預防，以及執行緒之間怎麼互相「打招呼」（wait/notify）。

【為什麼要學這個？】
`synchronized` 解決了「同時搶資料」的問題，但如果用得不小心，反而可能造成所有窗口全部卡死、誰也動不了——這就是 Deadlock。另外，有些情境需要窗口之間互相通知「我準備好了」、「你可以繼續了」，這就是 wait/notify 機制。

【學習目標】
學完這部分，我們能說出 Deadlock 發生的四個條件與預防方式，也能用 `wait()`/`notify()`/`notifyAll()` 寫出基本的生產者消費者模式。
-->

---

# 死結 Deadlock — 成因

死結發生的四個必要條件（全部同時成立才發生）：

| 條件 | 說明 |
|------|------|
| **互斥** | 資源同時只能被一個執行緒持有 |
| **持有並等待** | 執行緒持有資源同時等待其他資源 |
| **不可搶佔** | 資源只能由持有者主動釋放 |
| **循環等待** | 執行緒形成循環等待鏈 |

```
Thread-1 持有 lockA，等待 lockB
Thread-2 持有 lockB，等待 lockA
              ↕ 互相等待，永遠不會結束
```

<div class="mt-3 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
🔴 <b>Deadlock：</b> 所有涉及的執行緒都無法繼續執行，程式進入永久停止狀態。
</div>

<!--
【情境切入】
想像兩個窗口同時要處理一筆「跨帳戶轉帳」：窗口 A 先鎖住甲帳戶、等著鎖乙帳戶；窗口 B 先鎖住乙帳戶、等著鎖甲帳戶。

【概念定義】
這就是「死結（Deadlock）」：兩邊都拿著對方需要的東西，又都不願意放手，結果兩邊永遠卡住，程式表面上「沒有當機」，但其實已經完全停滯。

【生活化比喻】
就像兩個人各拿著一隻鞋子，但那隻鞋子是另一個人的另一隻——A 堅持先換到自己另一隻鞋才肯放手，B 也一樣，兩個人就這樣僵持，誰都沒鞋穿。

【重點解說】
表格列出的四個條件必須「同時」成立才會發生死結，這也提示了預防方法：只要打破其中任何一個條件（最常見的是打破「循環等待」），就能避免死結。
-->

---

# Deadlock — 程式碼示範

```java
class DeadlockDemo {
    static Object lockA = new Object();
    static Object lockB = new Object();

    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            synchronized (lockA) {
                System.out.println("T1 取得 lockA");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lockB) { System.out.println("T1 取得 lockB"); }
            }
        });
        Thread t2 = new Thread(() -> {
            synchronized (lockB) {              // 順序相反！
                System.out.println("T2 取得 lockB");
                synchronized (lockA) { System.out.println("T2 取得 lockA"); }
            }
        });
        t1.start(); t2.start();
    }
}
```

**預防方式：** 兩個執行緒都改成先取 `lockA` 再取 `lockB`（固定鎖的獲取順序）

<!--
【帶讀導覽】
這段程式碼故意製造死結：`t1` 先拿 `lockA` 再拿 `lockB`，`t2` 卻先拿 `lockB` 再拿 `lockA`——兩者「拿鎖的順序相反」。

【易錯點提醒 ⚠️】
跑這段程式碼很可能會發現程式「卡住不動」，而且不會拋出任何例外——這正是死結最麻煩的地方：它不報錯，只是安靜地永遠卡住。

【重點解說】
預防方式其實很簡單：規定所有執行緒都「依照固定的順序」取得鎖，例如永遠先拿 `lockA` 再拿 `lockB`。只要順序一致，循環等待的條件就不會成立，死結自然就不會發生。
-->

---

# wait() / notify() / notifyAll()

這三個方法定義在 `Object` 類別，**必須在 synchronized 區塊內使用**：

| 方法 | 說明 |
|------|------|
| `wait()` | 釋放 lock，進入 WAITING 狀態等待通知 |
| `wait(long ms)` | 釋放 lock，最多等待指定毫秒 |
| `notify()` | 喚醒一個正在 wait 的執行緒（隨機選擇） |
| `notifyAll()` | 喚醒所有正在 wait 的執行緒 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>與 sleep() 的差異：</b><br>
<code>sleep()</code>：不釋放 lock，時間到自動恢復<br>
<code>wait()</code>：釋放 lock，需要別人 <code>notify()</code> 才能恢復
</div>

<!--
【概念定義】
`wait()`、`notify()`、`notifyAll()` 是執行緒之間互相「打招呼」的機制，定義在 `Object` 類別上（代表任何物件都能當作溝通的「信號板」）。

【生活化比喻】
`wait()` 就像窗口跟客戶說：「目前還沒輪到您，我先去忙別的，輪到您我會叫號」——同時把手上的鎖（叫號機）放下，讓別人也能用。`notify()` 就是叫號廣播：「現在輪到您了，請過來」。

【易錯點提醒 ⚠️】
最容易搞混的是跟 `sleep()` 的差異：`sleep()` 睡覺時「手還抓著鎖不放」，別人拿不到；`wait()` 則是「先把鎖放下再休息」，等別人 `notify()` 才會重新搶鎖回來繼續執行。這兩者的差異在實務上經常造成死結，務必分清楚。
-->

---

# 生產者—消費者模式

```java
class SharedBuffer {
    private int data = -1;
    private boolean hasData = false;

    public synchronized void produce(int val) throws InterruptedException {
        while (hasData) wait();      // 已有資料，等消費
        data = val;
        hasData = true;
        System.out.println("生產: " + val);
        notifyAll();                 // 通知消費者
    }

    public synchronized int consume() throws InterruptedException {
        while (!hasData) wait();     // 沒有資料，等生產
        hasData = false;
        System.out.println("消費: " + data);
        notifyAll();                 // 通知生產者
        return data;
    }
}
```

<!--
【帶讀導覽】
這是 `wait()`/`notify()` 最經典的應用：生產者（負責放資料）跟消費者（負責拿資料）共用一個緩衝區，彼此用 `wait()`/`notifyAll()` 協調節奏。

【生活化比喻】
想像一個只能放一份文件的收發匣：生產者放文件前，如果匣子裡已經有東西，就先等（`wait()`）；放好之後敲鈴通知消費者（`notifyAll()`）。消費者取文件前，如果匣子是空的，也先等；取走之後敲鈴通知生產者「匣子空了，可以再放」。

【預期結果】
產生與消費會交替印出「生產: X」與「消費: X」，且不會出現「連續生產兩次而沒人消費」或「消費到空匣子」的情況。
-->

---

# 生產者—消費者模式 — 最佳實踐

<div class="mt-4 p-4 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left">
💡 <b>最佳實踐：</b> 用 <code>while</code> 而非 <code>if</code> 包住 <code>wait()</code>，防止虛假喚醒（Spurious Wakeup）。
</div>

| 寫法 | 行為 |
|------|------|
| `if (!hasData) wait()` | 喚醒後直接繼續，不再確認條件 |
| `while (!hasData) wait()` | 喚醒後重新檢查條件，安全 ✅ |

<!--
【重點解說】
這是使用 `wait()` 的黃金法則：永遠用 `while` 包住，不要用 `if`。

【生活化比喻】
有時候執行緒會發生「虛假喚醒（Spurious Wakeup）」——明明沒人 `notify()`，它卻自己醒了過來，就像窗口「打瞌睡突然驚醒」，但其實還沒輪到它。如果用 `if`，醒來就直接往下做事，可能在條件還不成立時就動手；用 `while`，醒來會再確認一次條件，發現還沒輪到自己就乖乖再睡回去。

【小結】
記住口訣：「`wait()` 永遠包在 `while` 裡」，這是寫正確的生產者消費者程式碼最重要的一條規則。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
古古：我們一路從執行緒的建立、控制方法，講到同步機制跟死結、wait/notify。接下來這三題不再是單一概念的小練習，而是要把 Thread/Runnable、join、synchronized、wait/notifyAll 這些工具全部串起來，做出計時器、銀行帳戶、生產者消費者佇列這三個比較完整的多執行緒程式。
-->

---
layout: default
---

# 練習 5：計時器執行緒
### 任務說明

設計一個多執行緒計時器應用程式：

1. 建立一個 `CountdownTask` 類別，實作 `Runnable` 介面
2. 建構子接受整數 `seconds`（倒數秒數）和 `String name`（計時器名稱）
3. `run()` 方法每隔 1 秒印出 `"[name] 剩餘 X 秒"`，結束時印出 `"[name] 計時完成！"`
4. 在 `main` 中同時啟動 3 個不同秒數的計時器（3 秒、5 秒、7 秒）
5. 使用 `join()` 等待所有計時器完成後印出 `"所有計時器完成"`

<!--
【任務鋪陳】
我們剛剛學完三種建立執行緒的方式，還有 `sleep()` 跟 `join()`，這題把它們綜合起來：做一個多執行緒倒數計時器。

【引導思考】
啟動三個執行緒同時倒數，記得用 `join()` 等它們全部結束。想一想：如果不用 `join()`，主程式會發生什麼事？三個計時器是不是仍然各自正常倒數，但「所有計時器完成」這句話可能會太早印出來？
-->

---

# 練習 5：解題提示

**① Runnable 骨架：**

```java
class CountdownTask implements Runnable {
    private int seconds;
    private String name;
    public void run() { /* 迴圈 + sleep(1000) */ }
}
```

**② sleep() 的例外處理：** 在 `run()` 內用 try-catch 包住 `Thread.sleep(1000)`

**③ 建立並啟動：**

```java
Thread t1 = new Thread(new CountdownTask(3, "Timer-3"));
t1.start();
```

**④ join() 的位置：** 所有 `start()` 後，再依序 `t1.join(); t2.join(); t3.join();`

**⑤ 進階挑戰：** 改用 Lambda 實作同樣功能

<!--
【引導思考】
提示大家注意 `join()` 必須在所有 `start()` 之後才呼叫，而不是 `start()` 後立刻 `join()`——那樣就變成依序執行，三個計時器就失去同時倒數的並行效果了。
-->

---
layout: default
---

# 練習 6：安全的銀行帳戶
### 任務說明

模擬多執行緒存提款，練習同步機制：

1. 建立 `BankAccount` 類別，包含 `balance`（餘額）欄位
2. 實作 `synchronized` 的 `deposit(int amount)` 和 `withdraw(int amount)` 方法
   - `withdraw` 若餘額不足，印出警告並返回 `false`
3. 初始餘額設為 1000
4. 建立 5 個「存款執行緒」（各存 200）和 5 個「提款執行緒」（各提 300）
5. 所有執行緒完成後，印出最終餘額

**驗證：** 先去掉 `synchronized` 執行幾次，觀察不穩定的結果，再加回去驗證一致性。

<!--
【任務鋪陳】
這題模擬銀行存提款，最能看出我們有沒有真的把同步機制用對。

【引導思考】
試試看如果不加 `synchronized` 會發生什麼事？最終餘額可能會多出來、也可能變少。在現實世界這叫「帳務不平」，在程式裡就是 Race Condition 造成的 bug。
-->

---

# 練習 6：解題提示

**① BankAccount 骨架：**

```java
class BankAccount {
    private int balance;
    public synchronized void deposit(int amount) { balance += amount; }
    public synchronized boolean withdraw(int amount) {
        if (balance < amount) { System.out.println("餘額不足"); return false; }
        balance -= amount;
        return true;
    }
    public synchronized int getBalance() { return balance; }
}
```

<!--
【引導思考】
可以請大家先算一下理論上的「最大可能提款次數」：1000 + 5×200 = 2000，2000 / 300 ≈ 6 次成功提款。等做完之後，可以用這個數字驗證自己的結果是否合理。
-->

---

# 練習 6：解題提示

**② 建立多個執行緒：**

```java
Thread[] threads = new Thread[10];
for (int i = 0; i < 5; i++) {
    threads[i]   = new Thread(() -> account.deposit(200));
    threads[i+5] = new Thread(() -> account.withdraw(300));
}
```

**③ 等待所有執行緒：** 用 for 迴圈對每個 thread 呼叫 `join()`

<!--
【易錯點提醒 ⚠️】
注意 Lambda 裡的 `account` 必須是 effectively final——也就是在迴圈外先宣告好、再傳進 Lambda 裡使用，不能在迴圈中重新賦值。
-->

---
layout: default
---

# 練習 7：生產者消費者佇列
### 任務說明

實作一個有界緩衝區（Bounded Buffer）的生產者消費者模式：

1. 建立 `BoundedQueue` 類別，內部使用 `LinkedList<Integer>`，最大容量為 5
2. 實作 `put(int item)`：若佇列滿，呼叫 `wait()` 等待；否則加入並呼叫 `notifyAll()`
3. 實作 `take()`：若佇列空，呼叫 `wait()` 等待；否則取出並呼叫 `notifyAll()`
4. 建立 2 個生產者（各生產 10 個數字）和 3 個消費者
5. 生產者完成後傳送結束訊號（-1）給消費者

**重點觀察：** 佇列永遠不會超過 5 個元素；程式能正常結束（不會永遠 hang 住）

<!--
【任務鋪陳】
這是本章自學內容最有挑戰性的一題：生產者與消費者模式的完整實作。

【引導思考】
觀察一下：我們的「倉庫」（佇列）是不是永遠控制在 5 個以內？如果學會用 `wait` 和 `notifyAll` 正確協調生產者跟消費者的節奏，這題就算過關了。
-->

---

# 練習 7：解題提示

```java
class BoundedQueue {
    private LinkedList<Integer> queue = new LinkedList<>();
    private int capacity;
    public BoundedQueue(int cap) { this.capacity = cap; }

    public synchronized void put(int item) throws InterruptedException {
        while (queue.size() == capacity) wait();
        queue.addLast(item);
        notifyAll();
    }

    public synchronized int take() throws InterruptedException {
        while (queue.isEmpty()) wait();
        int val = queue.removeFirst();
        notifyAll();
        return val;
    }
}
```

<!--
【易錯點提醒 ⚠️】
`put` 和 `take` 都要加 `synchronized`，而且 `wait()` 必須在 `synchronized` 區塊內才能呼叫，否則會丟出 `IllegalMonitorStateException`。
-->

---

# 練習 7：解題提示

**重點：**
- `wait()` 一定要用 `while` 包住，防止虛假喚醒
- 結束訊號：生產完後 `put(-1)`，消費者取到 -1 時停止
- 使用 `notifyAll()` 比 `notify()` 更安全

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>為什麼用 notifyAll() 而非 notify()？</b><br>
<code>notify()</code> 可能喚醒另一個「消費者」而非「生產者」，造成所有執行緒卡在 <code>wait()</code>，形成隱性死結。
</div>

<!--
【重點解說】
`notifyAll()` 比 `notify()` 更安全，因為 `notify()` 可能喚醒的是另一個消費者（而不是生產者），導致所有執行緒都繼續 `wait()`，形成隱性死結。這跟我們前面學的 Deadlock 是不同的成因，但結果一樣是「程式卡住不動」，務必小心。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Virtual Threads（JDK 21）

<!--
【開場白】
最後補一個 JDK 21 的招牌新功能：Virtual Threads（虛擬執行緒）。前面學的都是「Platform Thread」（傳統執行緒），這是目前最新版 Java 對多執行緒模型的重大升級。
-->

---
layout: default
---

# 為什麼需要 Virtual Threads？

傳統的 Platform Thread 直接對應一條作業系統執行緒，數量受限（通常幾千條就是極限）：

```java
// 傳統寫法：每個 Thread 對應一條 OS 執行緒，開太多會耗盡資源
Thread t = new Thread(() -> System.out.println("處理請求"));
t.start();
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>典型情境：</b>一個網站伺服器如果要同時處理 10 萬個請求，用傳統 Thread「一個請求一條執行緒」的模式會直接把系統資源耗盡。
</div>

<!--
【核心說明】
傳統的 Thread（現在也稱為 Platform Thread）建立成本高，因為它直接綁定一條作業系統層級的執行緒，數量一多，記憶體跟排程負擔都會爆炸。

💼 業界實務：
這正是傳統 Java Web 伺服器「一個請求配一條執行緒」的模式在高併發場景下會遇到的瓶頸，也是 Virtual Threads 想解決的問題。
-->

---

# Virtual Threads 基本用法

```java
// 用 Thread.ofVirtual() 建立虛擬執行緒
Thread vt = Thread.ofVirtual().start(() -> {
    System.out.println("在虛擬執行緒中執行");
});
vt.join();

// 或用 Executors 一次管理大量虛擬執行緒
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (int i = 0; i < 100_000; i++) {
        executor.submit(() -> System.out.println("任務執行中"));
    }
} // try-with-resources 自動等待所有任務完成
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵差異：</b>Virtual Thread 不直接綁定 OS 執行緒，而是由 JVM 排程到少量的「載體執行緒（carrier thread）」上執行，建立成本極低，可以輕鬆開出數十萬條。
</div>

<!--
【核心說明】
建立方式看起來跟傳統 Thread 很像（`start()`、`join()` 都一樣），但底層機制完全不同：Virtual Thread 是由 JVM 自己管理排程，不會一對一佔用作業系統執行緒。

【逐步解說】
`Executors.newVirtualThreadPerTaskExecutor()` 是最常用的寫法——每個任務都拿到一條專屬的虛擬執行緒，即使開了 10 萬個任務，也不會像傳統 Thread 那樣壓垮系統。

💼 業界實務：
Virtual Threads 特別適合「I/O 密集」的場景（例如等待資料庫查詢、呼叫外部 API），因為執行緒大部分時間都在等待，用便宜的虛擬執行緒取代昂貴的作業系統執行緒非常划算。對於「CPU 密集」的運算工作，虛擬執行緒沒有額外優勢。

⚠️ 易錯點提醒：
Virtual Threads 不是用來取代 `synchronized` 或前面學的所有執行緒安全機制——共享資料的競爭條件問題依然存在，該用的同步機制還是要用。
-->

---
layout: default
---

# 練習 8（線上商店）：為什麼會超賣？
### 任務說明

線上商店的耶加雪菲只剩最後 **1 包**，小明和小美同時按下「結帳」。執行下面的程式幾次：

```java
class Stock {
    private int quantity = 1;

    boolean buy(String who) {
        if (quantity > 0) {
            try { Thread.sleep(10); } catch (InterruptedException e) { }   // 假裝在建立訂單
            quantity--;
            System.out.println(who + " 買到了，剩 " + quantity);
            return true;
        }
        System.out.println(who + " 沒買到：庫存不足");
        return false;
    }
}
// main：同一個 Stock，兩條執行緒各呼叫一次 buy("小明")、buy("小美")，再 join
```

1. 會印出什麼？庫存最後是多少？
2. 加一個關鍵字修好它，讓只有一個人買到

<!--
【情境切入】
這是電商最經典的 bug：超賣。網站同時會有很多人下單，每個請求都是一條執行緒，就跟這題的小明和小美一樣。

【引導思考】
請先預測，再執行。關鍵在 if 判斷和 quantity 減一之間隔了一段時間：小明檢查「還有 1 包」之後、還沒扣掉之前，小美也檢查了一次，看到的還是 1 包。這跟售票系統那一題是同一個問題。

【等待與觀察】
給大家 5 分鐘，記得多跑幾次。
-->

---

# 練習 8：解題提示

```text
小明 買到了，剩 0
小美 買到了，剩 -1          ← 一包豆子賣給了兩個人
```

```java
synchronized boolean buy(String who) { ... }   // 同一時間只有一條執行緒能進來
```

```text
小明 買到了，剩 0
小美 沒買到：庫存不足
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>真正的後端怎麼做？</b> 商店的後端通常不只一台、庫存放在資料庫，<code>synchronized</code> 只管得到同一個程式裡的執行緒。所以專題用一句 SQL 讓資料庫幫忙把關：<code>UPDATE … SET stock = stock - ? WHERE id = ? AND stock >= ?</code>，更新到 0 筆就代表庫存不足（Spring Boot ch55）。
</div>

<!--
【帶讀解法】
沒有同步的版本，兩個人都買到，庫存變成負一，這就是超賣。

修法是在 buy 前面加 synchronized。同一個 Stock 物件，一次只讓一條執行緒進到 buy 裡面，小美要等小明整個做完才進得來，那時候她看到的庫存已經是 0。

【延伸到專題】
但真正的線上商店不能只靠 synchronized。網站人多的時候會開好幾台後端，每一台都有自己的 synchronized，彼此管不到；庫存也不是放在 Java 的變數，而是放在資料庫。所以專題後端的做法，是把「檢查」和「扣除」寫在同一句 UPDATE 裡，讓資料庫自己保證只有一個人扣得到。這個寫法在 Spring Boot 第五十五章會實際做一次。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【收尾】
這份自學內容到這裡告一段落，我們從「Program / Process / Thread」的名詞釐清開始，一路走到建立執行緒、控制執行緒節奏、同步機制、死結與生產者消費者模式，最後認識了 JDK 21 的 Virtual Threads。

【核心帶走重點】
三個最重要的提醒：第一，啟動執行緒一定是 `start()`，不是 `run()`；第二，只要有共享資料，先想清楚要不要 `synchronized`，鎖的範圍越小越好；第三，看到程式「卡住不動但沒報錯」，先檢查是不是死結，看看各執行緒拿鎖的順序是否一致。有問題歡迎隨時討論！
-->

---
layout: end
---

# 課程結束
### 多執行緒：建立、控制、同步、通信

<!--
【結束語】
多執行緒這個主題比較硬，但掌握之後，我們就能讓程式真正「同時做很多事」，這是邁向實務開發很重要的一步。辛苦了，下課！
-->
