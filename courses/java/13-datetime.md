---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 日期與時間的類別
routeAlias: ch13
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Java Programming Masterclass</p>
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">日期與時間的類別</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">「掌握 Java 8 java.time 套件的核心用法」</p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好！今天我們要聊一個每個程式都會用到的主題：時間。不管是紀錄使用者什麼時候登入、算算特價還剩幾天，還是算出朋友的生日還有幾天，我們都需要精確地處理日期跟時間。

為什麼要學這個？因為寫程式不可能不碰時間，而 Java 從第 8 版開始提供了一套全新設計的 `java.time` 套件，把日期和時間切成幾個清楚的角色：只管日期的 `LocalDate`、只管時間的 `LocalTime`，以及兩者合一的 `LocalDateTime`。

學完這章，我們會學會怎麼建立、調整這些日期時間物件，怎麼用 `DateTimeFormatter` 把它們格式化成想要的樣子，以及怎麼從字串解析回日期時間物件。
-->

---
layout: default
---

# Outline

- **LocalDate：只有日期**
  - 建立、加減、取得星期幾

- **LocalTime：只有時間**
  - 建立、加減、取得時分

- **LocalDateTime：日期 + 時間**
  - 建立、拆解日期與時間

- **DateTimeFormatter：格式化與解析**
  - 常用格式符號、format / parse

- **類別選用時機對照表**
- **練習題**

<!--
我們會依序學習三個最常用的時間類別：先看只管「日期」的 `LocalDate`，接著是只管「時間」的 `LocalTime`，再學會把兩者合在一起的 `LocalDateTime`。最後，我們會學會用 `DateTimeFormatter` 把這些物件變成好看的字串，或是反過來從字串解析出日期時間。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# LocalDate
## 只有日期，沒有時間

<!--
想像一下，我們要記錄一個人的生日，或是公司的發薪日。這些資料只關心「哪一天」，完全不需要知道「幾點幾分」。

`LocalDate` 就是為這種情境設計的——它代表「日曆上的一頁」，只有年、月、日，沒有時間資訊。接下來我們來看看怎麼建立和操作它。
-->

---
layout: default
---

# LocalDate 常用 API（一）

| 方法 | 說明 |
| --- | --- |
| `LocalDate.now()` | 取得今天日期 |
| `LocalDate.of(年, 月, 日)` | 指定日期建立 |
| `LocalDate.parse("yyyy-MM-dd")` | 從字串解析 |
| `isBefore(other)` | 是否在指定日期之前 |
| `isAfter(other)` | 是否在指定日期之後 |

```java
import java.time.LocalDate;

LocalDate today = LocalDate.now();
LocalDate birthday = LocalDate.of(2000, 5, 20);
LocalDate parsed = LocalDate.parse("2024-01-15");

System.out.println(today);
System.out.println(birthday.isBefore(today)); // true
```

<!--
`LocalDate` 只有日期，非常適合用來存生日、發薪日這類資料。我們可以把它想成「日曆上撕下來的那一頁」——它不知道現在幾點，只知道今天是哪一天。

帶大家看關鍵行：`LocalDate.now()` 抓的是今天的日期，`LocalDate.of(2000, 5, 20)` 則是建立一個指定的日期。這裡的 `5` 就代表 5 月，不需要再像舊版 API 那樣減 1，是不是清爽多了？

`isBefore()` / `isAfter()` 可以用來比較兩個日期的先後順序，例如判斷生日是不是已經過了。
-->

---

# LocalDate 常用 API（二）

| 方法 | 說明 |
| --- | --- |
| `plusDays(n)` | 加 n 天 |
| `minusMonths(n)` | 減 n 個月 |
| `plusYears(n)` | 加 n 年 |
| `getDayOfWeek()` | 取得星期幾（DayOfWeek 列舉）|
| `getDayOfMonth()` | 取得當月幾號 |

```java
LocalDate today = LocalDate.now();
LocalDate nextWeek = today.plusDays(7);
LocalDate lastMonth = today.minusMonths(1);

DayOfWeek dow = LocalDate.of(2024, 5, 20).getDayOfWeek();
System.out.println(dow);        // MONDAY
System.out.println(dow.getValue()); // 1（週一=1，週日=7）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>不可變物件：</b><code>today.plusDays(7)</code> 不會改變 <code>today</code> 本身，而是回傳一個新的物件。
</div>

<!--
`LocalDate` 提供了很方便的加減法，例如 `plusDays(7)` 就是一週後、`minusMonths(1)` 就是上個月。`getDayOfWeek()` 則可以告訴我們某一天是星期幾，回傳的是 `DayOfWeek` 這個列舉。

⚠️ 易錯點：`java.time` 裡所有的物件都是「不可變（Immutable）」的。也就是說，`today.plusDays(7)` 執行完之後，`today` 本身完全不會改變，而是回傳一個全新的物件。如果忘了用變數接住回傳值，計算結果就會憑空消失。
-->

---
layout: default
---

# 🎬 AI 協作時刻：加了 7 天，日期卻沒變

我寫了 `today.plusDays(7);` 想把日期往後推一週，但印出來的 `today` 還是原本的日期，把程式碼貼給 AI 檢查：

**要用的 Prompt：**

> 我呼叫了 `LocalDate` 的 `plusDays()` / `plusHours()`（LocalTime 也一樣），
> 但變數本身看起來完全沒有被改變。
> {貼上你的程式碼}
> 請幫我找出問題，並解釋 java.time 套件的物件在「加減運算」時的設計原則。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>易錯點：</b> <code>LocalDate</code>／<code>LocalTime</code> 都是不可變（Immutable）物件，<code>plusDays()</code>／<code>plusHours()</code> 這類方法不會修改原物件，而是回傳一個新物件——沒有用變數接住回傳值，計算結果就會憑空消失。
</div>

<!--
【操作提示】
現場故意示範一段只寫 `today.plusDays(7);` 卻沒有重新賦值的錯誤程式碼，讓學生先觀察「為什麼印出來還是原本的日期」，再貼給 AI 抓問題。

【收斂一句話】
java.time 底下的物件全部不可變，加減法一定要用變數接住回傳值，這是最常被忽略、卻最基本的地雷。
-->

---
layout: default
---

# 練習 1：活動是否已經結束
### 任務說明

某個活動的截止日期是 `2024-06-30`。請完成以下任務：

1. 用 `LocalDate.of()` 建立「活動截止日」與「今天日期」（今天假設是 `2024-07-15`）
2. 用 `isBefore()` 或 `isAfter()` 判斷活動是否已經結束
3. 計算「活動截止日」往後加 **30 天**之後是哪一天，並印出星期幾（`getDayOfWeek()`）

<!--
【任務鋪陳】
我們剛剛學了 `LocalDate.of()` 建立日期、`isBefore()`/`isAfter()` 比較日期先後，以及 `plusDays()` 和 `getDayOfWeek()`。這題請大家把這幾個 API 組合起來，判斷一個活動的狀態。

【引導思考】
如果「今天」在「活動截止日」之後，代表活動已經結束——這時候該用 `isAfter()` 還是 `isBefore()`？順序不要搞混了。
-->

---
layout: default
---

# 練習 1：活動是否已經結束
### 解題提示

```java
import java.time.LocalDate;

LocalDate deadline = LocalDate.of(2024, 6, 30);
LocalDate today = LocalDate.of(2024, 7, 15);

boolean isOver = today.isAfter(deadline);
System.out.println("活動已結束：" + isOver); // true

LocalDate extended = deadline.plusDays(30);
System.out.println(extended);              // 2024-07-30
System.out.println(extended.getDayOfWeek()); // 對應的星期幾
```

<!--
【帶讀解法】
判斷「活動是否已經結束」，關鍵是「今天」跟「截止日」誰在誰之後：如果 `today.isAfter(deadline)` 為 `true`，代表今天已經超過截止日，活動就結束了。`2024-07-15` 在 `2024-06-30` 之後，所以 `isOver` 是 `true`。

第三步單純是 `plusDays(30)` 的應用：`2024-06-30` 加 30 天會變成 `2024-07-30`，再用 `getDayOfWeek()` 就能知道這一天是星期幾。這跟我們剛剛看到的 `today.plusDays(7)` 是同一個概念，只是天數不同。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# LocalTime
## 只有時間，沒有日期

<!--
回顧一下，`LocalDate` 處理的是「哪一天」。那如果我們想記錄的是「鬧鐘設定的時間」或「店家的營業時間」呢？這些資料只關心「幾點幾分」，跟日期完全無關。

這就是 `LocalTime` 要解決的問題——它代表「時鐘上的時間」，不管是哪一天，每天的早上 7 點都是同一個 `LocalTime`。
-->

---
layout: default
---

# LocalTime 常用 API

| 方法 | 說明 |
| --- | --- |
| `LocalTime.now()` | 取得目前時間 |
| `LocalTime.of(時, 分)` | 指定時間建立 |
| `LocalTime.parse("HH:mm")` | 從字串解析 |
| `plusHours(n)` | 加 n 小時 |
| `minusMinutes(n)` | 減 n 分鐘 |
| `getHour()` / `getMinute()` | 取得時 / 分 |

```java
import java.time.LocalTime;

LocalTime now = LocalTime.now();
LocalTime meeting = LocalTime.of(14, 30);
LocalTime end = meeting.plusHours(2);

System.out.println(meeting); // 14:30
System.out.println(end);     // 16:30
System.out.println(end.getHour()); // 16
```

<!--
`LocalTime` 就是只有時間、沒有日期，我們可以把它想成「鬧鐘」——設定早上 7 點起床，不管那天是星期幾，鬧鐘都會在 7 點響。

帶大家看關鍵行：`LocalTime.of(14, 30)` 建立一個下午 2:30 的時間物件，`plusHours(2)` 則會回傳一個加了 2 小時的新物件（16:30）。`getHour()` 可以單獨取出「小時」這個數字，方便我們做進一步的判斷或計算。
-->

---
layout: default
---

# 練習 2：洗衣店打烊時間
### 任務說明

某間自助洗衣店的開門時間是 `10:00`，營業時間共 **12 小時**。請完成以下任務：

1. 用 `LocalTime.of()` 建立「開門時間」
2. 用 `plusHours()` 計算「打烊時間」
3. 分別用 `getHour()` 和 `getMinute()` 取出打烊時間的「時」和「分」，並印出 `打烊時間：XX 點 XX 分`

<!--
【任務鋪陳】
我們剛剛學了 `LocalTime.of()` 建立時間、`plusHours()` 加時數，以及 `getHour()` / `getMinute()` 拆解時間。這題請大家把這些方法用在計算店家打烊時間上。

【引導思考】
開門時間是 `10:00`，營業 12 小時，打烊時間會是幾點？用 `plusHours(12)` 算出來之後，再想想 `getHour()` 跟 `getMinute()` 分別會回傳什麼。
-->

---
layout: default
---

# 練習 2：洗衣店打烊時間
### 解題提示

```java
import java.time.LocalTime;

LocalTime open = LocalTime.of(10, 0);
LocalTime close = open.plusHours(12);

System.out.println("打烊時間：" + close.getHour() + " 點 " + close.getMinute() + " 分");
// 打烊時間：22 點 0 分
```

<!--
【帶讀解法】
這題的步驟很直接：`LocalTime.of(10, 0)` 建立 `10:00`，`plusHours(12)` 回傳一個新的 `LocalTime` 物件 `22:00`（晚上 10 點）。

接著用 `getHour()` 取出 `22`、`getMinute()` 取出 `0`，組合成「打烊時間：22 點 0 分」。

跟我們剛剛看過的會議範例（`meeting.plusHours(2)` 從 14:30 變成 16:30）是一樣的邏輯，只是這裡額外多了 `getHour()` / `getMinute()` 把結果拆開來顯示。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# LocalDateTime
## 日期 + 時間，但無時區

<!--
回顧一下，我們已經學了「只有日期」的 `LocalDate` 和「只有時間」的 `LocalTime`。但現實生活中，大部分的紀錄都需要「日期 + 時間」一起出現，例如「2024 年 5 月 13 日 10 點 30 分」。

`LocalDateTime` 就是把這兩者合而為一的類別——它知道完整的日期時間，但還缺少一個資訊：時區。我們會在這章先學會它的基本用法，時區的部分留給更進階的內容。
-->

---
layout: default
---

# LocalDateTime 常用 API

| 方法 | 說明 |
| --- | --- |
| `LocalDateTime.now()` | 取得現在日期時間 |
| `LocalDateTime.of(年,月,日,時,分)` | 指定建立 |
| `LocalDateTime.of(date, time)` | 合併 LocalDate 與 LocalTime |
| `toLocalDate()` | 拆出日期部分 |
| `toLocalTime()` | 拆出時間部分 |

```java
import java.time.LocalDateTime;

LocalDateTime now = LocalDateTime.now();
LocalDateTime dt = LocalDateTime.of(2024, 5, 13, 10, 30, 0);

LocalDate d = LocalDate.of(2024, 5, 13);
LocalTime t = LocalTime.of(10, 30);
LocalDateTime combined = LocalDateTime.of(d, t);
System.out.println(combined); // 2024-05-13T10:30
```

<!--
`LocalDateTime` 就是日期加時間，我們可以把它想成一張「約會通知」：「我們週五下午兩點在咖啡廳見」。只要雙方都在同一個地方（同一個時區），這張通知就完全沒問題。

帶大家看關鍵行：`LocalDateTime.of(2024, 5, 13, 10, 30, 0)` 一次指定年月日時分秒；也可以分開建立 `LocalDate` 和 `LocalTime`，再用 `LocalDateTime.of(d, t)` 把兩者合併起來。`toLocalDate()` 和 `toLocalTime()` 則可以反過來，把合併後的物件再拆開。

💼 業界實務：`LocalDateTime` 很適合用來記錄「本地活動」或存放資料庫裡的時間欄位，只要系統不需要跨時區，這個類別就足夠應付大部分情境了。
-->

---
layout: default
---

# 🎬 AI 協作時刻：時間類別選哪個？

`LocalDate`、`LocalTime`、`LocalDateTime` 三個名字很像，遇到新需求時常常猶豫該用哪個。讓 AI 幫你判斷：

**要用的 Prompt：**

> 我要設計一個「訂房系統」的資料表，裡面有「入住日期」「退房日期」跟「櫃檯每日開放服務時間（例如 08:00~22:00）」三個欄位。
> 請問這三個欄位分別該用 `LocalDate`、`LocalTime` 還是 `LocalDateTime`？請說明理由。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>判斷原則：</b> 問自己「這個欄位需要知道時區嗎？需要日期還是只需要時間？」AI 的回答通常會照這個邏輯拆解，練習幾次你自己也能判斷。
</div>

<!--
【操作提示】
現場示範貼上 prompt，讓 AI 逐一拆解三個欄位：入住/退房日期用 `LocalDate`（不需要時分），開放服務時間用 `LocalTime`（每天重複、跟日期無關）。

【收斂一句話】
選對日期時間類別的關鍵，是先問「這筆資料到底需不需要日期、需不需要時間」，AI 可以幫你把這個判斷邏輯講清楚。
-->

---
layout: default
---

# 練習 3：活動報名截止時間
### 任務說明

某個活動報名截止的「日期」和「時間」是分開儲存的：日期是 `2024-08-10`，時間是 `23:59`。

1. 分別用 `LocalDate.of()` 和 `LocalTime.of()` 建立這兩個物件
2. 用 `LocalDateTime.of(date, time)` 將兩者合併成一個 `LocalDateTime`
3. 印出合併後的結果
4. 用 `toLocalDate()` 和 `toLocalTime()` 把合併後的物件再拆回日期和時間，分別印出

<!--
【任務鋪陳】
我們剛剛學了 `LocalDateTime.of(date, time)` 可以把已經存在的 `LocalDate` 和 `LocalTime` 物件合併起來，也學了 `toLocalDate()` / `toLocalTime()` 可以反過來拆開。這題請大家走一遍「合併 → 拆解」的完整流程。

【引導思考】
合併之後的 `LocalDateTime` 印出來會是什麼樣子？拆開之後的 `toLocalDate()` 跟原本的 `date` 變數，內容會一樣嗎？
-->

---
layout: default
---

# 練習 3：活動報名截止時間
### 解題提示

```java
import java.time.*;

LocalDate date = LocalDate.of(2024, 8, 10);
LocalTime time = LocalTime.of(23, 59);

LocalDateTime deadline = LocalDateTime.of(date, time);
System.out.println(deadline); // 2024-08-10T23:59

LocalDate d = deadline.toLocalDate();
LocalTime t = deadline.toLocalTime();
System.out.println(d); // 2024-08-10
System.out.println(t); // 23:59
```

<!--
【帶讀解法】
這題就是把我們剛剛學的「合併」跟「拆解」各做一次：

1. `LocalDateTime.of(date, time)` 把獨立的 `LocalDate` 跟 `LocalTime` 合成一個 `LocalDateTime`，印出來會是 `2024-08-10T23:59`，中間用 `T` 分隔日期跟時間。
2. `toLocalDate()` 跟 `toLocalTime()` 則是反過來，把合併後的物件「拆」回原本的兩個部分，拆出來的結果跟一開始的 `date`、`time` 內容完全一樣。

這個「合併再拆解」的流程在實務上很常見——例如表單分別收集日期跟時間兩個欄位，後端再把它們組合成一個完整的時間戳記。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# DateTimeFormatter
## 格式化與解析

<!--
回顧一下，我們現在已經會建立 `LocalDate`、`LocalTime`、`LocalDateTime` 這三種物件了。但直接 `System.out.println()` 印出來的格式（例如 `2024-05-13T10:30`）並不一定符合我們想要的呈現方式。

這時候就需要 `DateTimeFormatter`——它可以把日期時間物件轉成我們指定的字串格式，也可以反過來把字串解析成日期時間物件。它是 `SimpleDateFormat` 的接班人，設計上更安全也更直覺。
-->

---
layout: default
---

# DateTimeFormatter 常用格式符號

| 符號 | 說明 | 範例 |
| --- | --- | --- |
| `yyyy` | 四位數年份 | 2024 |
| `MM` | 兩位數月份 | 01–12 |
| `dd` | 兩位數日期 | 01–31 |
| `HH` | 24 小時制 | 00–23 |
| `mm` | 分鐘 | 00–59 |
| `ss` | 秒數 | 00–59 |
| `E` | 星期縮寫 | Mon |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>執行緒安全：</b>DateTimeFormatter 是不可變物件，可宣告為靜態常數，安全地在多執行緒環境共用。
</div>

<!--
這些格式符號跟我們在其他語言或工具看到的長相類似：`yyyy` 是四位數年份、`MM` 是月份、`dd` 是日期、`HH` 是 24 小時制的小時、`mm` 是分鐘、`ss` 是秒數，`E` 則是星期縮寫。

⚠️ 易錯點：大小寫有差別！`MM`（月份）和 `mm`（分鐘）長得很像，寫錯的話印出來的時間會整個錯亂。

💼 業界實務：因為 `DateTimeFormatter` 是不可變且執行緒安全的，業界習慣把它定義成 `static final` 常數，整個程式共用同一個實例，既省記憶體又安全。
-->

---

# DateTimeFormatter：格式化與解析

| 方法 | 說明 |
| --- | --- |
| `DateTimeFormatter.ofPattern(pattern)` | 依自訂樣式建立 formatter |
| `ldt.format(formatter)` | 日期時間 → 字串 |
| `LocalDate.parse(str, formatter)` | 字串 → LocalDate |
| `LocalDateTime.parse(str, formatter)` | 字串 → LocalDateTime |

```java
import java.time.*;
import java.time.format.DateTimeFormatter;

DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");

LocalDateTime now = LocalDateTime.now();
String str = now.format(fmt);
System.out.println(str); // e.g. 2024/05/13 10:30:00

LocalDateTime parsed = LocalDateTime.parse("2024/05/13 10:30:00", fmt);
```

<!--
帶大家看關鍵行：`now.format(fmt)` 是「日期時間物件 → 字串」，把 `LocalDateTime` 依照我們指定的格式變成可讀的字串；`LocalDateTime.parse(str, fmt)` 則是反過來，「字串 → 日期時間物件」。

⚠️ 易錯點：`parse` 的時候，字串的格式必須跟 `formatter` 的 pattern「一模一樣」，包括斜線、空格、冒號等符號，少一個都會直接拋出例外。
-->

---

# 四種日期時間類別選用時機

| 類別 | 有日期 | 有時間 | 有時區 | 適用情境 |
| --- | :---: | :---: | :---: | --- |
| `LocalDate` | ✅ | ❌ | ❌ | 生日、假日、課表 |
| `LocalTime` | ❌ | ✅ | ❌ | 每日開店時間、鬧鐘 |
| `LocalDateTime` | ✅ | ✅ | ❌ | 本地活動、資料庫時間欄 |
| `ZonedDateTime` | ✅ | ✅ | ✅ | 跨時區會議、航班時刻 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>原則：</b>只要不需要考慮時區，優先用 <code>LocalDate</code> / <code>LocalDateTime</code>；跨國系統或需處理時差，才需要 <code>ZonedDateTime</code>（進階自學內容）。
</div>

<!--
這張表幫我們整理今天學到的三個類別該怎麼選：只關心日期就用 `LocalDate`（生日、課表）；只關心時間就用 `LocalTime`（鬧鐘、營業時間）；日期加時間一起記錄，就用 `LocalDateTime`（本地活動、資料庫時間欄位）。

表格最後一列的 `ZonedDateTime` 是處理跨時區情境的類別，例如跨國會議或航班時刻表，這部分留在進階自學內容裡介紹。今天的重點是先把前三種類別用熟，挑選正確的類別，能讓我們的程式碼更精準也更好維護。
-->

---
layout: default
---

# 🎬 AI 協作時刻：格式印出來全部亂掉

我用 `DateTimeFormatter.ofPattern()` 印出日期時間，結果「分鐘」的位置印出了月份的數字，把 pattern 字串和程式碼一起丟給 AI：

**要用的 Prompt：**

> 我用 `DateTimeFormatter.ofPattern("...")` 格式化 `LocalDateTime`，
> 但印出來的某個欄位數值不對。
> {貼上你的 pattern 字串與程式碼}
> 請逐一檢查 pattern 裡每個符號的大小寫，並指出哪裡寫錯、正確的符號應該是什麼。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>易錯點：</b> <code>MM</code>（月份）和 <code>mm</code>（分鐘）只差大小寫，意義完全不同；如果剛好月份跟分鐘的數值相同，印出來會「看起來沒問題」，其實邏輯已經錯了，很難察覺。
</div>

<!--
【操作提示】
現場示範一個 pattern 大小寫用反的例子，讓 AI 逐一比對每個符號。可以刻意選月份跟分鐘數值不同的日期，讓錯誤更明顯（例如 5 月 30 分，寫反會印出「30 月」）。

【收斂一句話】
格式符號的大小寫決定了完全不同的欄位，AI 能幫忙抓出來，但養成習慣自己對照符號表才是根本解法。
-->

---
layout: default
---

# 練習 4：DateTimeFormatter 格式符號
### 認證模擬題（單選）

某工程師想要把 `LocalDateTime` 印成「2024年05月13日 09時05分」這樣的格式，他寫了以下程式碼：

```java
LocalDateTime ldt = LocalDateTime.of(2024, 5, 13, 9, 5);
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy年mm月dd日 HH時MM分");
System.out.println(ldt.format(fmt));
```

執行後，這段程式碼最可能發生什麼結果？

A. 正確印出 `2024年05月13日 09時05分`
B. 印出的「月」會變成「分鐘的數值」，「分」會變成「月份的數值」，因為 `MM` 和 `mm` 用反了
C. 編譯錯誤，因為 `DateTimeFormatter` 不支援中文字
D. 拋出 `NullPointerException`，因為 `LocalDateTime.of()` 缺少秒數參數

<!--
【出題動機】
這題想確認大家是否真的記得 `MM`（月份）跟 `mm`（分鐘）的差別——我們在介紹格式符號時就特別提過這是最容易搞混的一組。

【解題引導】
看看 pattern 字串：`"yyyy年mm月dd日 HH時MM分"`。對照我們學過的符號表，`mm` 代表什麼？`MM` 又代表什麼？這個 pattern 把兩者的位置放對了嗎？
-->

---
layout: default
---

# 練習 4：DateTimeFormatter 格式符號
### 解析

**正確答案：B**

- ❌ A：表面上看起來格式很像，但 `mm` 和 `MM` 的位置剛好放反了——`mm` 是分鐘、`MM` 是月份，這段 pattern 會把月份和分鐘的數值印反。
- ✅ B：pattern 中「月」的位置用了 `mm`（分鐘），「分」的位置用了 `MM`（月份）。`ldt` 的月份是 `5`、分鐘是 `5`，這個例子剛好數值相同所以不易察覺，但邏輯上「月」欄位印出的其實是分鐘的數值、「分」欄位印出的其實是月份的數值——兩者用反了。
- ❌ C：`DateTimeFormatter` 完全支援在 pattern 中加入任意文字（包括中文字），這些文字會原封不動出現在結果裡，不會造成編譯錯誤。
- ❌ D：`LocalDateTime.of(2024, 5, 13, 9, 5)` 是合法的呼叫（秒數有預設值 `0`），不會拋出例外，跟格式符號用錯是兩件不相關的事。

<!--
【帶讀解法】
這題的陷阱在於：範例裡 `ldt` 的「月」是 `5`、「分」也是 `5`，剛好數值相同，所以即使 `mm` 和 `MM` 用反了，印出來的結果表面上看起來「沒有錯」（都印出 `05`）。但這只是巧合——如果換成月份 `5`、分鐘 `30` 的時間，印出來就會變成「2024年30月13日 09時05分」這種明顯錯誤的結果。

這正是我們前面提過的易錯點：`MM`（月份）和 `mm`（分鐘）大小寫不同，意義完全不同，寫錯的話可能因為數值剛好相同而「看起來沒問題」，但其實邏輯已經錯了，是個很隱蔽的 bug。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
學了這麼多，來動手試試吧！這幾題會把今天學到的 `LocalDate`、`LocalDateTime` 和 `DateTimeFormatter` 串起來應用。
-->

---
layout: default
---

# 練習 5：計算倒數天數

### 任務說明

請撰寫程式，計算「今天到下次生日還有幾天」。

**需求：**
1. 用 `LocalDate.now()` 取得今天日期
2. 設定今年的生日（例如 5 月 20 日）
3. 若今年生日已過，改算明年生日
4. 用 `ChronoUnit.DAYS.between()` 計算相差天數
5. 輸出格式：`距離下次生日還有 X 天`

<!--
回顧一下，我們剛學了 `LocalDate.of()` 建立日期、`isBefore()` 比較日期先後，以及 `plusYears()` 加一年。這題請把這幾個工具組合起來，幫自己寫一個生日倒數器。

引導思考：如果今年的生日已經過了，程式要怎麼自動改成算「明年」的生日？要是忘了處理這個情況，算出來的天數會變成什麼？
-->

---

# 練習 5：解題提示

### 提示說明

1. 建立今年生日：`LocalDate.of(today.getYear(), 5, 20)`
2. 判斷是否已過：`birthday.isBefore(today)` → 若是則 `birthday = birthday.plusYears(1)`
3. 計算天數差：`ChronoUnit.DAYS.between(today, birthday)`
4. 輸出結果

```java
LocalDate today = LocalDate.now();
LocalDate birthday = LocalDate.of(today.getYear(), 5, 20);
if (birthday.isBefore(today)) {
    birthday = birthday.plusYears(1);
}
long days = ChronoUnit.DAYS.between(today, birthday);
System.out.println("距離下次生日還有 " + days + " 天");
```

<!--
這題的關鍵在第 2 步的 `isBefore()` 判斷：先假設生日是「今年」，如果發現這個日期已經在今天之前，就用 `plusYears(1)` 改成明年的生日。

`ChronoUnit.DAYS.between(today, birthday)` 會直接算出兩個日期之間相差的「總天數」，比起 `Period` 更適合用在「算總天數」這種需求上。
-->

---
layout: default
---

# 練習 6：時間格式轉換

### 任務說明

請撰寫程式，完成以下轉換任務：

**任務 A — 格式化輸出：**
將現在時間以 `yyyy 年 MM 月 dd 日 HH:mm:ss（E）` 格式印出，例如：`2024 年 05 月 13 日 10:30:00（星期一）`

**任務 B — 解析字串：**
將字串 `"2024/05/13 10:30"` 解析為 `LocalDateTime` 物件，並分別印出年份、月份和星期幾

<!--
回顧一下，我們剛學了 `DateTimeFormatter.ofPattern()` 怎麼自訂格式，以及 `format()` / `parse()` 怎麼在物件和字串之間互相轉換。這兩個任務分別練習這兩個方向。

引導思考：任務 A 和任務 B 用的 pattern 字串看起來不一樣（一個有中文字，一個是斜線），這代表 pattern 字串可以包含哪些內容？
-->

---

# 練習 6：解題提示

### 提示說明

**任務 A 提示：**
1. 建立 `DateTimeFormatter.ofPattern("yyyy 年 MM 月 dd 日 HH:mm:ss（E）")`
2. `LocalDateTime.now().format(formatter)`

**任務 B 提示：**
1. 建立 `DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm")`
2. 使用 `LocalDateTime.parse("2024/05/13 10:30", formatter)`
3. 呼叫 `.getYear()`, `.getMonth()`, `.getDayOfWeek()`

```java
DateTimeFormatter fmt =
    DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm");
LocalDateTime ldt = LocalDateTime.parse("2024/05/13 10:30", fmt);
System.out.println(ldt.getYear());       // 2024
System.out.println(ldt.getDayOfWeek()); // MONDAY
```

<!--
這題的重點在於：`pattern` 字串裡，除了 `yyyy`、`MM` 這類格式符號之外，其他文字（包括中文字、斜線、空格）都會「原封不動」地出現在結果裡。

⚠️ 易錯點：解析字串時，格式一定要跟字串本身「一模一樣」，少一個斜線、多一個空格，都會讓 `parse()` 拋出例外。
-->

---
layout: default
---

# 練習 7 (綜合)：會議提醒小工具

### 任務說明

請撰寫程式，模擬一個簡單的「會議提醒」工具：

1. 建立一個會議時間 `LocalDateTime meeting`，例如本月某天的下午 2 點
2. 取得現在時間 `LocalDateTime.now()`
3. 用 `now.isBefore(meeting)` 判斷會議是否還沒開始
4. 將會議時間以 `yyyy/MM/dd（E）HH:mm` 格式印出
5. 輸出格式：`會議時間：2024/05/20（一）14:00，會議尚未開始：true`

<!--
這是今天的綜合練習，把 `LocalDateTime` 的建立與比較，以及 `DateTimeFormatter` 的格式化串在一起，模擬一個小型的提醒工具。

回顧一下，我們在 `LocalDate` 學過 `isBefore()`，在 `DateTimeFormatter` 學過 `ofPattern()` 和 `format()`。這題請把這兩個概念套用到 `LocalDateTime` 上。

引導思考：如果想讓這個提醒工具也顯示「還剩多久」（例如還有 3 小時 20 分），會需要用到我們今天還沒教過的哪個工具？這個問題的答案會在進階自學內容裡揭曉。
-->

---

# 練習 7 (綜合)：解題提示

### 提示說明

```java
import java.time.*;
import java.time.format.DateTimeFormatter;

LocalDateTime meeting = LocalDateTime.of(2024, 5, 20, 14, 0);
LocalDateTime now = LocalDateTime.now();

DateTimeFormatter fmt =
    DateTimeFormatter.ofPattern("yyyy/MM/dd（E）HH:mm");

System.out.println("會議時間：" + meeting.format(fmt)
    + "，會議尚未開始：" + now.isBefore(meeting));
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>延伸思考：</b>想知道「還剩多久」，需要用到 <code>Duration</code>——這是進階自學內容會介紹的工具。
</div>

<!--
這題的結構不複雜，重點是把今天學到的三個工具兜在一起：用 `LocalDateTime.of()` 建立會議時間、用 `isBefore()` 比較先後、用 `format(fmt)` 印出好讀的格式。

最後的延伸思考已經幫大家鋪好路了：如果想知道「還剩多久」，需要計算兩個時間點的「差距」，這正是進階自學內容裡 `Duration` 要解決的問題。有興趣的同學，歡迎繼續探索進階版的內容！
-->

---

# 總結

- **`LocalDate` 只管日期、`LocalTime` 只管時間、`LocalDateTime` 兩者合一** — 三者都沒有時區資訊
- **所有 `java.time` 物件都是不可變（Immutable）**，`plusDays()`、`minusMonths()` 這類方法都回傳新物件，原物件不會被改變
- **`isBefore()` / `isAfter()` 比較日期時間先後**，`LocalDateTime.of(date, time)` 可以合併已建立的日期與時間物件，`toLocalDate()` / `toLocalTime()` 則能反過來拆解
- **`DateTimeFormatter.ofPattern()` 負責格式化與解析**，`format()` 把物件轉字串、`parse()` 把字串轉物件，且大小寫敏感（`MM` 月份 vs `mm` 分鐘最容易搞混）
- **選類別的原則很單純**：不需要時區就用 `LocalDate` / `LocalTime` / `LocalDateTime`；需要跨時區才用進階內容的 `ZonedDateTime`

<!--
我們把這一章整理成五個重點。

第一，三個核心類別分工清楚：LocalDate 只管日期、LocalTime 只管時間、LocalDateTime 是兩者合一，但都不包含時區資訊，這是它們跟 ZonedDateTime 最大的差別。

第二，java.time 底下所有物件都是不可變的，這是這一章反覆強調的重點——plusDays()、minusMonths() 這些方法執行完，原本的物件完全不會變，一定要用變數接住回傳的新物件，不然計算結果會憑空消失。

第三，isBefore() 和 isAfter() 用來比較日期時間的先後順序；LocalDateTime.of(date, time) 可以把已經存在的 LocalDate 跟 LocalTime 合併成一個完整的日期時間，toLocalDate() 和 toLocalTime() 則可以反過來拆解回去。

第四，DateTimeFormatter.ofPattern() 是格式化與解析的核心工具，format() 把日期時間物件轉成字串，parse() 把字串轉回物件；要特別小心大小寫，MM 是月份、mm 是分鐘，這是最容易寫錯又不容易發現的地方。

第五，選擇要用哪個類別的原則很簡單：只要不需要考慮時區，就在 LocalDate、LocalTime、LocalDateTime 這三個裡面挑；真的需要跨時區處理，才需要進階自學內容裡的 ZonedDateTime。

這五點加起來，就是 java.time 套件的核心用法。下一章我們要繼續往下走了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

### 今天重點回顧

- `LocalDate` 只管日期、`LocalTime` 只管時間、`LocalDateTime` 兩者合一
- 所有 `java.time` 物件都是不可變（Immutable），加減法會回傳新物件
- `DateTimeFormatter.ofPattern()` 負責格式化與解析，可宣告為共用常數
- 選類別的原則：不需要時區就用 `LocalDate` / `LocalTime` / `LocalDateTime`
- 想深入了解 `ZonedDateTime`、`Duration`/`Period`、舊版 `Date` 轉換，歡迎前往進階自學內容

<!--
關於今天學到的日期時間類別，大家還有什麼疑問嗎？

如果之後在工作中遇到需要處理時差、計算時間長度，或是要跟舊系統的 `Date` 物件打交道，記得我們有準備進階自學內容，把這些更進階的工具都整理在裡面，有興趣的同學可以自行延伸學習！
-->
