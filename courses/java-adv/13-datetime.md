---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 日期與時間的類別（進階／自學）
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
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">進階自學內容</p>
  <Link to="home" style="color:#9dc4c4;font-size:0.85rem;margin-top:2rem;text-decoration:none;letter-spacing:0.05em;">← 返回目錄</Link>
</div>

<!--
哈囉大家，歡迎來到「日期與時間的類別」的進階自學篇！基礎版我們已經學會 `LocalDate`、`LocalTime`、`LocalDateTime` 這三個最常用的時間類別，足以應付大部分「不需要跨時區」的情境。

這份自學內容會帶我們走進三個更進階的主題：第一個是「為什麼舊版的 `Date` 類別被淘汰」——了解歷史包袱，未來接手舊專案才不會慌；第二個是「跨時區的 `ZonedDateTime`」——處理國際化系統的必備工具；第三個是「`Duration` 與 `Period`」——精確計算時間差與日期差。

學完這份自學內容，我們會知道舊版 `Date` 的各種坑、怎麼處理跨時區的會議排程、怎麼算出兩個時間點之間差了多少秒或多少天，以及新舊 API 之間怎麼互相轉換。準備好就開始吧！
-->

---
layout: default
---

# Outline

- **舊版 `java.util.Date` 類別**
  - 基本用法、`SimpleDateFormat`
  - 為何被淘汰、與新版 `java.time` 的比較

- **`ZonedDateTime` 與 `ZoneId`**
  - 跨時區的日期時間表示

- **`Duration` 與 `Period`**
  - 計算時間差（秒）與日期差（年月日）

- **新舊版轉換**
  - `Date` ↔ `Instant` ↔ `LocalDateTime` / `ZonedDateTime`

- **自學練習**

<!--
這份自學內容分成四個主題，循序漸進：先回頭看看「舊時代的眼淚」—— `Date` 類別，了解它的問題所在；接著進入跨時區的 `ZonedDateTime`；然後學會用 `Duration` 和 `Period` 精確計算時間差；最後把新舊 API 串起來，學會怎麼互相轉換。

如果大家還記得基礎版教過的 `LocalDate`、`LocalTime`、`LocalDateTime`，這份內容會非常順。準備好的話，我們開始吧！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 舊版 Date 類別
## java.util.Date

<!--
想像一下，我們接手了一個十年前寫的舊系統，裡面到處都是 `Date` 物件，而我們已經習慣了 `LocalDate`、`LocalDateTime` 的清爽寫法。這時候，了解 `Date` 的歷史和它的問題，就變得很重要——不只是為了「看懂」舊程式碼，更是為了知道「為什麼當初要設計新的 `java.time` 套件」。

接下來我們會看看 `Date` 的基本用法、它搭配的 `SimpleDateFormat`，以及它到底有哪些設計上的災難，導致 Java 8 決定徹底重新設計時間 API。
-->

---
layout: default
---

# java.util.Date 基本用法

| 方法 | 說明 |
| --- | --- |
| `new Date()` | 建立代表「現在」的 Date 物件 |
| `new Date(long millis)` | 以毫秒時間戳記建立 Date |
| `getTime()` | 回傳從 1970-01-01 00:00:00 UTC 起算的毫秒數 |
| `toString()` | 回傳可讀的日期時間字串 |

```java
import java.util.Date;

Date now = new Date();
System.out.println(now);           // 可讀格式字串
System.out.println(now.getTime()); // 毫秒時間戳記，例如 1715644800000
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>毫秒時間戳記：</b>從 1970 年 1 月 1 日 00:00:00 UTC 起算至今的毫秒數，又稱 Unix epoch time。
</div>

<!--
這就是 `java.util.Date`，誕生於 Java 1.0。我們可以把 `new Date()` 想像成「按了一下馬錶，記錄下那一秒」——它內部其實就存了一個很大的長整數（毫秒數）。

`getTime()` 回傳的就是這個長整數，代表從 1970 年 1 月 1 日到現在經過了多少毫秒，這個基準點業界叫做 Unix epoch time。

業界實務上，如果我們接手的是十年前的老專案，幾乎一定會看到 `Date`。雖然它已經被官方建議淘汰，但很多舊的資料庫驅動和函式庫，內部仍然以 `Date` 作為通用格式，所以「看得懂」還是必要的。
-->

---

# SimpleDateFormat：常用格式符號

| 符號 | 說明 | 範例 |
| --- | --- | --- |
| `yyyy` | 四位數年份 | 2024 |
| `MM` | 兩位數月份 | 01–12 |
| `dd` | 兩位數日期 | 01–31 |
| `HH` | 24 小時制小時 | 00–23 |
| `mm` | 分鐘 | 00–59 |
| `ss` | 秒數 | 00–59 |
| `E` | 星期幾縮寫 | Mon, Tue... |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>大小寫有別：</b><code>MM</code> 是月份，<code>mm</code> 是分鐘；<code>HH</code> 是 24 小時制，<code>hh</code> 是 12 小時制。
</div>

<!--
`Date` 物件印出來的格式不太好讀，所以我們需要 `SimpleDateFormat` 幫它「換上比較好看的衣服」。

⚠️ 易錯點：注意大小寫！`MM` 是月份（Month），`mm` 是分鐘（minute）。如果寫錯，會發現現在變成「2024 年 59 月」，那就真的是時間錯亂了。`HH` 是 24 小時制，如果誤用 `hh`，下午一點會變成 01，這在記錄 log 時會讓除錯變得非常困難。
-->

---

# SimpleDateFormat：format() 與 parse()

| 方法 | 說明 |
| --- | --- |
| `format(Date date)` | 將 Date 轉成格式化字串 |
| `parse(String text)` | 將字串解析為 Date 物件，可能拋出 ParseException |

```java
import java.text.SimpleDateFormat;
import java.util.Date;

SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

// Date → String
String str = sdf.format(new Date());
System.out.println(str); // e.g. 2024/05/13 10:30:00

// String → Date
Date parsed = sdf.parse("2024/05/13 10:30:00");
```

<!--
`format` 是把物件變字串（上妝），`parse` 是把字串變物件（卸妝）——這兩個方法互為相反操作。

帶大家看關鍵行：`sdf.format(new Date())` 會回傳像 `2024/05/13 10:30:00` 這樣的字串；`sdf.parse(...)` 則是反過來，把字串還原成 `Date` 物件。

⚠️ 易錯點：`parse` 非常容易拋出 `ParseException`。只要字串裡多一個空格、少一個斜線，程式就會直接拋出例外，這也是 `Date` 系列 API 讓人頭痛的原因之一。
-->

---

# 為何 Date 被淘汰？

| 缺陷 | 說明 |
| --- | --- |
| 執行緒不安全 | `SimpleDateFormat` 在多執行緒共用時容易造成資料錯誤 |
| 月份從 0 開始 | `Date.getMonth()` 回傳 0–11，極易混淆 |
| 年份需加 1900 | `Date.getYear()` 回傳的是「西元年 − 1900」 |
| API 設計不一致 | Date、Calendar、SimpleDateFormat 分散於不同套件 |
| 可變物件 | Date 可被修改，難以做到不可變設計 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>官方建議：</b>Java 8 起改用 <code>java.time</code> 套件，DateTimeFormatter 是執行緒安全的，且 API 直覺一致。
</div>

<!--
為什麼 `Date` 會被淘汰？因為它的設計問題真的不少。

`Date` 的月份是從 0 開始的，所以 12 月在 Java 裡其實是 11；年份更誇張，要再加 1900 才是西元年。這就像去買飲料，店員說「這杯 0 元」，結果結帳卻變成 1900 元一樣莫名其妙。

💼 業界實務：最致命的問題是「執行緒不安全」。如果在多執行緒環境（例如 Spring Boot 伺服器）裡共用同一個 `SimpleDateFormat`，日期會出現亂跳的情況，在金融或訂單系統裡，這種錯誤可能造成嚴重後果。
-->

---

# 舊版 Date vs 新版 java.time

| 比較項目 | java.util.Date / Calendar | java.time（Java 8+） |
| --- | --- | --- |
| 執行緒安全 | 否（SimpleDateFormat 不安全）| 是（全部不可變物件）|
| 月份索引 | 0–11（容易出錯）| 1–12（直覺）|
| API 一致性 | 分散、設計混亂 | 統一於 java.time 套件 |
| 可讀性 | 低 | 高（流暢 API）|
| 時區支援 | 繁瑣 | ZonedDateTime / ZoneId |
| 時間差計算 | 手動相減毫秒 | Duration / Period |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選用原則：</b>新專案請直接使用 <code>java.time</code>；舊系統如需和 <code>Date</code> 互動，透過 <code>Instant</code> 轉換即可。
</div>

<!--
這張表把前面幾頁的問題整理成一份對照表。`java.time` 套件是參考了知名的 Joda-Time 函式庫設計的，幾乎把 `Date` 的缺點全部修正了。

如果用一個比喻來說：`Date` 就像那種要自己手動調齒輪的老式掛鐘，`java.time` 則是現在的智慧型手錶，功能強大又不容易出錯。

選用原則很簡單：新專案直接用 `java.time`；如果是維護舊系統，需要跟 `Date` 互動，透過 `Instant` 這個橋梁轉換就好——這個轉換的細節，我們留到本份自學內容的最後一個主題再詳細說明。
-->

---
layout: default
---

# 練習 1：Date 的歷史包袱
### 認證模擬題（單選）

某段舊程式碼如下：

```java
Date d = new Date(2024 - 1900, 11, 25);
System.out.println(d.getYear());  // ?
System.out.println(d.getMonth()); // ?
```

關於這段程式碼的執行結果，下列描述哪個是**正確**的？

A. `getYear()` 會印出 `2024`，`getMonth()` 會印出 `12`
B. `getYear()` 會印出 `124`，`getMonth()` 會印出 `11`，因為 `Date` 的年份是「西元年 − 1900」，月份是 0–11
C. 這段程式碼會直接拋出例外，因為建構子參數不能用算式
D. `getYear()` 和 `getMonth()` 在新版 Java 已經被移除，無法呼叫

<!--
【出題動機】
這題想確認大家是否真的理解 `Date` 被淘汰的兩個經典原因：「年份要加減 1900」和「月份從 0 開始」。這兩個怪癖在面試或閱讀舊程式碼時非常容易被考到。

【解題引導】
這段程式碼故意寫得很「繞」：建構子傳入 `2024 - 1900`（也就是 `124`）和 `11`，這正是舊程式碼為了「湊出」2024 年 12 月常見的寫法。再對照我們剛剛看過的表格，`getYear()` 和 `getMonth()` 分別會回傳什麼？
-->

---
layout: default
---

# 練習 1：Date 的歷史包袱
### 解析

**正確答案：B**

- ❌ A：如果 `getYear()` 真的回傳 `2024`、`getMonth()` 回傳 `12`，那 `Date` 就不會被列為「設計災難」了。事實恰好相反。
- ✅ B：`Date` 的建構子 `Date(int year, int month, int date)` 中，`year` 參數的意義是「西元年 − 1900」，所以 `getYear()` 回傳的也是同樣規則的數字——程式碼傳入 `2024 - 1900 = 124`，`getYear()` 就會原封不動回傳 `124`。月份方面，`Date` 的月份是 0–11（0 代表 1 月，11 代表 12 月），程式碼傳入 `11`，`getMonth()` 就回傳 `11`（代表 12 月）。
- ❌ C：建構子參數可以是任意合法的 `int` 算式，`2024 - 1900` 在編譯期就會被計算成 `124`，完全合法，不會拋出例外。
- ❌ D：`getYear()` 和 `getMonth()` 雖然早就被標示為 `@Deprecated`（不建議使用），但並沒有被移除，仍然可以呼叫，只是會有編譯警告。

<!--
【帶讀解法】
這題的程式碼其實是一段「以毒攻毒」的範例：寫 `2024 - 1900` 正是因為 `Date` 建構子的 `year` 參數本身就是「西元年 − 1900」——所以舊程式碼裡常常會看到這種「先減 1900 再傳進去」的詭異寫法，為的就是讓建構出來的 `Date` 物件代表真正的 2024 年。

`getYear()` 和 `getMonth()` 都是「忠實地」回傳當初存進去的數字，不會幫我們做任何轉換，所以 `getYear()` 是 `124`、`getMonth()` 是 `11`（12 月）。

這也是為什麼我們會說 `Date` 的 API 設計「不一致、容易出錯」——這兩個怪癖在 `java.time` 裡完全消失了：`LocalDate.getYear()` 就是真正的西元年，`getMonthValue()` 就是 1–12。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# ZonedDateTime
## 含時區的日期時間

<!--
想像一下，我們的公司要跟美國西雅圖的團隊開視訊會議，約定「台北時間下午兩點」。如果只用 `LocalDateTime` 來記錄這個約會，西雅圖的同事打開行事曆，看到的也是「下午兩點」——但這顯然是錯的，因為兩地有時差。

這就是 `LocalDateTime` 的盲點：它只知道「幾點幾分」，卻不知道「是哪個地方的幾點幾分」。`ZonedDateTime` 就是為了解決這個問題而存在——它在日期時間之外，多附加了一個「時區標籤」，讓全世界都能正確換算出對應的時間。

跨國系統、航班時刻表、國際會議排程，都離不開 `ZonedDateTime`。
-->

---
layout: default
---

# ZonedDateTime 與 ZoneId

| 方法 | 說明 |
| --- | --- |
| `ZoneId.of("區域/城市")` | 建立時區物件 |
| `ZoneId.systemDefault()` | 系統預設時區 |
| `ZonedDateTime.now(zoneId)` | 指定時區的現在時間 |
| `ZonedDateTime.of(ldt, zoneId)` | 將 LocalDateTime 加上時區 |
| `getZone()` | 取得時區資訊 |

```java
import java.time.*;

ZoneId taipei = ZoneId.of("Asia/Taipei");
ZoneId paris  = ZoneId.of("Europe/Paris");

ZonedDateTime now = ZonedDateTime.now(taipei);
LocalDateTime ldt = LocalDateTime.of(2024, 5, 13, 10, 0);
ZonedDateTime zdt = ZonedDateTime.of(ldt, taipei);
System.out.println(zdt); // 2024-05-13T10:00+08:00[Asia/Taipei]
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常用時區 ID：</b><code>Asia/Taipei</code>、<code>Asia/Tokyo</code>、<code>America/New_York</code>、<code>Europe/London</code>
</div>

<!--
`ZoneId` 就是那個「時區標籤」，格式通常是「大陸/城市」，例如 `Asia/Taipei`。注意這裡不建議寫 `CST` 或 `GMT+8` 這種縮寫，因為同一個縮寫在不同國家可能代表不同時區，用正式的 ID 才不會出錯。

帶大家看關鍵行：`ZonedDateTime.of(ldt, taipei)` 把一個沒有時區資訊的 `LocalDateTime` 加上 `Asia/Taipei` 標籤，變成 `2024-05-13T10:00+08:00[Asia/Taipei]`——這時候，不管在世界哪個角落，都能準確換算出這是哪個瞬間。

⚠️ 易錯點：`ZonedDateTime.now()` 沒有帶參數時會用 `ZoneId.systemDefault()`，也就是執行程式的這台機器所在的時區。如果伺服器設定的時區跟我們預期的不同，算出來的時間就會跟著跑掉。
-->

---
layout: default
---

# 練習 2：台北與紐約的會議時間
### 任務說明

公司決定在「台北時間 2024-05-13 21:00」跟紐約團隊開會。請完成以下任務：

1. 用 `ZoneId.of("Asia/Taipei")` 和 `ZoneId.of("America/New_York")` 分別建立兩個時區物件
2. 建立一個 `LocalDateTime`：`2024-05-13 21:00`
3. 用 `ZonedDateTime.of(ldt, taipei)` 建立台北時間的會議時刻
4. 用 `.withZoneSameInstant(newYork)` 將這個時刻換算成紐約當地時間，並印出結果

<!--
【任務鋪陳】
我們剛剛學了 `ZoneId.of()` 建立時區、`ZonedDateTime.of(ldt, zoneId)` 把 `LocalDateTime` 加上時區標籤。這題請大家用這兩個工具，模擬一個跨國會議的情境，並認識一個新方法 `withZoneSameInstant()`——它可以把同一個瞬間換算成另一個時區的「當地時間」。

【引導思考】
`ZonedDateTime.of(ldt, taipei)` 建立出來的物件，代表的是「台北時間 21:00」這個瞬間。如果想知道「這個瞬間，紐約當地是幾點」，要怎麼換算？
-->

---
layout: default
---

# 練習 2：台北與紐約的會議時間
### 解題提示

```java
import java.time.*;

ZoneId taipei = ZoneId.of("Asia/Taipei");
ZoneId newYork = ZoneId.of("America/New_York");

LocalDateTime ldt = LocalDateTime.of(2024, 5, 13, 21, 0);
ZonedDateTime taipeiTime = ZonedDateTime.of(ldt, taipei);

ZonedDateTime newYorkTime = taipeiTime.withZoneSameInstant(newYork);

System.out.println("台北時間：" + taipeiTime);
System.out.println("紐約時間：" + newYorkTime);
```

<!--
【帶讀解法】
這題的前兩步跟我們剛剛看過的範例一樣：先用 `ZoneId.of()` 建立兩個時區物件，再用 `ZonedDateTime.of(ldt, taipei)` 把「台北時間 21:00」這個資訊組成 `ZonedDateTime`。

關鍵在第三步：`withZoneSameInstant(newYork)`。它的意思是「同一個瞬間（instant），換一個時區來顯示」——也就是說，`taipeiTime` 和 `newYorkTime` 代表的其實是宇宙中同一個瞬間，只是顯示出來的「時鐘讀數」不同（因為兩地時差）。

這跟我們之前學的 `plusHours()`（改變時間點本身）完全不同——`withZoneSameInstant()` 不會改變「實際發生的時刻」，只是換一個視角去看它。這正是 `ZonedDateTime` 在跨國系統裡最重要的能力。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Duration 與 Period
## 計算時間差

<!--
回顧一下，基礎版我們學過 `LocalDate.plusDays()`、`LocalDateTime.plusHours()` 這類「加減時間」的方法。但如果反過來，我們想知道「兩個時間點之間差了多少」呢？

例如：今天加班到晚上 9 點，總共加了多久？或者：從出生到今天，已經活了幾年幾個月幾天？這兩個問題看起來很像，但其實對應到兩個不同的工具——`Duration` 用來計算「時、分、秒」這種以時間為單位的差距，`Period` 用來計算「年、月、日」這種以日期為單位的差距。
-->

---
layout: default
---

# Duration vs Period 比較

| 比較項目 | Duration | Period |
| --- | --- | --- |
| 適用對象 | 時間（秒、奈秒）| 日期（年、月、日）|
| 典型用途 | 計算兩個時刻的秒差 | 計算兩個日期的年月日差 |
| 主要單位 | 秒（seconds）、奈秒 | 年（years）、月（months）、日（days）|
| 建立方式 | `Duration.between(t1, t2)` | `Period.between(d1, d2)` |
| 常用取值 | `getSeconds()` `toMinutes()` | `getYears()` `getMonths()` `getDays()` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶口訣：</b>Duration 用來計「時」（hours/seconds），Period 用來計「日」（days/months/years）。
</div>

<!--
這是很多人會搞混的地方，我們用一個比喻來區分：`Duration` 就像是「馬錶」，按下去之後記錄經過了幾秒、幾分鐘；`Period` 則像是「日曆」，告訴我們經過了幾年幾月幾天。

從表格可以看到，兩者的建立方式很類似，都是 `XXX.between(起點, 終點)`，差別在於「適用對象」——`Duration` 適合搭配 `LocalTime` / `LocalDateTime` / `Instant`，`Period` 則只適合搭配 `LocalDate`。
-->

---

# Duration：計算時間差

```java
import java.time.*;

LocalTime start = LocalTime.of(9, 0, 0);
LocalTime end   = LocalTime.of(17, 30, 0);

Duration d = Duration.between(start, end);
System.out.println(d.getSeconds());  // 30600
System.out.println(d.toHours());     // 8
System.out.println(d.toMinutes());   // 510
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>也可用於 LocalDateTime：</b><code>Duration.between(ldt1, ldt2)</code> 同樣適用，計算兩個日期時間之間的秒數差。
</div>

<!--
這個範例的目標是：算出上班 9 點到下班 17:30，總共工作了多久。

帶大家看關鍵行：`Duration.between(start, end)` 會回傳一個 `Duration` 物件，內部以秒為單位儲存差值。接著我們可以用 `getSeconds()` 拿到總秒數（30600），或者用 `toHours()` / `toMinutes()` 轉換成方便閱讀的小時（8）和分鐘（510）。

業界實務上，想計算「加班了多久、可以領多少加班費」，用 `Duration` 就對了，它能精確算出總共經過的秒數、分鐘數。
-->

---

# Period：計算日期差

```java
import java.time.*;

LocalDate birth = LocalDate.of(2000, 5, 20);
LocalDate today = LocalDate.of(2024, 5, 13);

Period p = Period.between(birth, today);
System.out.println(p.getYears());   // 23
System.out.println(p.getMonths()); // 11
System.out.println(p.getDays());   // 24
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b><code>getYears()</code>、<code>getMonths()</code>、<code>getDays()</code> 各自取該單位的「餘數」，不是累計加總。例如 23 年 11 個月 24 天，不是 23 年 + 11 個月 = 287 個月。
</div>

<!--
這個範例的目標是：算出從出生到今天，已經經過了多少年、月、日。

帶大家看關鍵行：`Period.between(birth, today)` 回傳的 `Period` 物件，會分別用 `getYears()`、`getMonths()`、`getDays()` 取出年、月、日三個數字——範例中是「23 年 11 個月 24 天」。

⚠️ 易錯點：這三個數字是「各自的餘數」，不是累計加總。也就是說，總共經過的天數絕對不等於 `getDays()` 的結果。如果想要知道「總共經過了多少天」（例如交往紀念日的總天數），要改用 `ChronoUnit.DAYS.between()`，而不是 `Period`。
-->

---
layout: default
---

# 練習 3：專案執行時長
### 任務說明

某個專案的「啟動日」是 `2023-02-10`，「結案日」是 `2024-05-13`。請完成以下任務：

1. 用 `LocalDate.of()` 分別建立啟動日與結案日
2. 用 `Period.between()` 計算兩者之間的差距
3. 用 `getYears()`、`getMonths()`、`getDays()` 取出年、月、日，並輸出格式：`專案執行了 X 年 Y 個月 Z 天`

<!--
【任務鋪陳】
我們剛剛學了 `Period.between()` 可以算出兩個 `LocalDate` 之間「年、月、日」的差距。這題請大家把它套用到一個常見的實務情境：計算專案從啟動到結案，總共經歷了多久。

【引導思考】
回想一下生日範例：`Period.between(birth, today)` 算出「23 年 11 個月 24 天」。這題的結構完全一樣，只是把「出生日」換成「啟動日」、「今天」換成「結案日」。
-->

---
layout: default
---

# 練習 3：專案執行時長
### 解題提示

```java
import java.time.*;

LocalDate start = LocalDate.of(2023, 2, 10);
LocalDate end = LocalDate.of(2024, 5, 13);

Period p = Period.between(start, end);
System.out.println("專案執行了 " + p.getYears() + " 年 "
    + p.getMonths() + " 個月 " + p.getDays() + " 天");
// 專案執行了 1 年 3 個月 3 天
```

<!--
【帶讀解法】
這題跟我們剛剛看過的生日範例幾乎是同一個模板，只是換了情境跟日期：`Period.between(start, end)` 算出從 `2023-02-10` 到 `2024-05-13` 之間，年、月、日各差了多少。

帶大家驗證一下結果：從 2023-02-10 到 2024-02-10 是整整 1 年；從 2024-02-10 到 2024-05-10 是 3 個月；從 2024-05-10 到 2024-05-13 是 3 天。所以結果是「1 年 3 個月 3 天」，跟 `getYears()`、`getMonths()`、`getDays()` 分別取出的數字一致。

⚠️ 易錯點：跟前面提醒過的一樣，這三個數字是「各自獨立的餘數」，不能把它們相加或換算成「總天數」。如果老闆問「這個專案總共執行了幾天？」，要改用 `ChronoUnit.DAYS.between(start, end)`，不是把 `Period` 的結果做加法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 新舊版轉換
## java.util.Date ↔ java.time.Instant

<!--
身為工程師，我們總是要面對現實——舊的程式碼不會憑空消失。即使新專案都用 `java.time`，我們仍然有可能需要跟某個只認得 `Date` 的舊函式庫互動。

這時候該怎麼辦？答案是透過 `Instant`——它代表 UTC 時間軸上的一個精確時刻，可以把它想像成「時空隧道裡的轉運站」：不管我們是從 `Date` 出發，還是從 `LocalDateTime` 出發，都要先到 `Instant` 轉機，才能抵達目的地。
-->

---
layout: default
---

# Date → LocalDate / LocalDateTime

| 轉換目標 | 方式 |
| --- | --- |
| `Date` → `Instant` | `date.toInstant()` |
| `Instant` → `ZonedDateTime` | `instant.atZone(ZoneId.systemDefault())` |
| `ZonedDateTime` → `LocalDate` | `.toLocalDate()` |
| `ZonedDateTime` → `LocalDateTime` | `.toLocalDateTime()` |

```java
import java.util.Date;
import java.time.*;

Date old = new Date();

LocalDate ld = old.toInstant()
    .atZone(ZoneId.systemDefault())
    .toLocalDate();

LocalDateTime ldt = old.toInstant()
    .atZone(ZoneId.systemDefault())
    .toLocalDateTime();
```

<!--
這張表把整個轉換路徑拆成四步：`Date` → `Instant` → `ZonedDateTime` → 最後拆成 `LocalDate` 或 `LocalDateTime`。

帶大家看程式碼：先呼叫 `toInstant()` 抵達「轉運站」，再用 `atZone(ZoneId.systemDefault())` 幫它貼上時區標籤變成 `ZonedDateTime`，最後呼叫 `.toLocalDate()` 或 `.toLocalDateTime()` 拆出我們想要的部分。

⚠️ 易錯點：這條轉換鏈看起來有點長，這正是為什麼大家會說 `Date` 麻煩——每一步都不能省略，少了 `atZone()` 編譯器甚至不會讓我們呼叫 `toLocalDate()`。
-->

---

# LocalDate / LocalDateTime → Date

```java
import java.util.Date;
import java.time.*;

// LocalDate → Date
LocalDate localDate = LocalDate.of(2024, 5, 13);
Date d1 = Date.from(
    localDate.atStartOfDay()
             .atZone(ZoneId.systemDefault())
             .toInstant()
);

// LocalDateTime → Date
LocalDateTime ldt = LocalDateTime.of(2024, 5, 13, 10, 30);
Date d2 = Date.from(
    ldt.atZone(ZoneId.systemDefault()).toInstant()
);
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Instant 是橋梁：</b>新舊 API 互轉都要經過 <code>Instant</code>，它代表 UTC 時間軸上的一個精確時刻。
</div>

<!--
反過來，從 `java.time` 轉回 `Date` 一樣要經過 `Instant`，只是方向相反。

帶大家看關鍵行：`LocalDate` 沒有「時間」的概念，所以要先呼叫 `atStartOfDay()` 補上「當天 00:00」，再 `atZone()` 加上時區、`toInstant()` 抵達轉運站，最後用 `Date.from(instant)` 變回 `Date`。`LocalDateTime` 則少一步，因為它已經有時間資訊了。

記住：`Instant` 是 UTC 時間，所以轉換時一定要透過 `atZone()` 告訴電腦「我們在哪個時區」，否則換算出來的時刻會跟我們預期的不一樣。
-->

---
layout: default
---

# 練習 4：將 LocalDate 轉換為 Date
### 任務說明

某個舊函式庫的 API 只接受 `java.util.Date` 型態的參數，但我們手上的資料是 `LocalDate`。請完成以下任務：

1. 建立一個 `LocalDate`：`2024-12-25`
2. 將它轉換成 `Date` 物件（提示：`LocalDate` 沒有時間資訊，需要先補上「當天 00:00」）
3. 印出轉換後的 `Date` 物件

<!--
【任務鋪陳】
我們剛剛學了 `Date → LocalDate` 的轉換路徑（`toInstant()` → `atZone()` → `toLocalDate()`）。這題請大家試試「反過來」：把 `LocalDate` 轉換成 `Date`。

【引導思考】
`LocalDate` 只有日期，沒有時間，但 `Instant` 需要一個精確的「瞬間」。`LocalDate` 有沒有提供一個方法，可以幫我們補上「當天的開始時間（00:00）」，把它變成 `LocalDateTime`？
-->

---
layout: default
---

# 練習 4：將 LocalDate 轉換為 Date
### 解題提示

```java
import java.util.Date;
import java.time.*;

LocalDate localDate = LocalDate.of(2024, 12, 25);

Date date = Date.from(
    localDate.atStartOfDay()
             .atZone(ZoneId.systemDefault())
             .toInstant()
);

System.out.println(date);
```

<!--
【帶讀解法】
這題的解法跟我們剛剛看過的「LocalDate → Date」範例幾乎一模一樣，這裡再帶大家走一次完整的轉換鏈：

1. `localDate.atStartOfDay()`：`LocalDate` 沒有時間，所以先補上「當天 00:00」，變成 `LocalDateTime`。
2. `.atZone(ZoneId.systemDefault())`：幫這個 `LocalDateTime` 貼上系統預設時區的標籤，變成 `ZonedDateTime`。
3. `.toInstant()`：抵達「轉運站」，變成代表 UTC 時間軸上某個瞬間的 `Instant`。
4. `Date.from(instant)`：最後用 `Date.from()` 把 `Instant` 包裝成 `Date` 物件。

這四步缺一不可——這也是為什麼我們會說，跟舊版 `Date` 互動時，`Instant` 是無法跳過的「必經之路」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
學完舊版 Date、ZonedDateTime、Duration/Period 以及新舊轉換，我們來做兩題練習，把這些進階主題串起來應用。
-->

---
layout: default
---

# 練習 5：計算會議倒數時間

### 任務說明

請撰寫程式，計算「現在時刻」到「台北時間明天上午 9 點的視訊會議」還有多久。

**需求：**
1. 用 `ZonedDateTime.now(ZoneId.of("Asia/Taipei"))` 取得台北現在時間
2. 建立明天上午 9 點的 `ZonedDateTime`（同樣是 `Asia/Taipei` 時區）
3. 用 `Duration.between()` 計算兩者的時間差
4. 輸出格式：`距離會議還有 X 小時 Y 分鐘`

<!--
回顧一下，我們剛剛學了 `ZonedDateTime` 怎麼建立帶時區的日期時間，也學了 `Duration` 怎麼計算兩個時刻的差距。這題請大家把這兩個工具組合起來，算出「現在」到「明天早上 9 點」之間還有多少時間。

引導思考：如果現在已經超過明天的 9 點（例如現在是後天），這個程式還能算出合理的結果嗎？要怎麼處理「明天」這個日期？
-->

---
layout: default
---

# 練習 5：解題提示

### 提示說明

1. 取得台北現在時間，並建立明天上午 9 點：
   ```java
   ZoneId taipei = ZoneId.of("Asia/Taipei");
   ZonedDateTime now = ZonedDateTime.now(taipei);
   ZonedDateTime meeting = now.toLocalDate()
       .plusDays(1)
       .atTime(9, 0)
       .atZone(taipei);
   ```
2. 計算時間差並拆解成小時與分鐘：
   ```java
   Duration d = Duration.between(now, meeting);
   long hours = d.toHours();
   long minutes = d.toMinutes() % 60;
   System.out.println("距離會議還有 " + hours + " 小時 " + minutes + " 分鐘");
   ```

<!--
這題的關鍵在第 1 步：先用 `toLocalDate().plusDays(1)` 算出「明天」這個日期，再用 `atTime(9, 0)` 補上時間，最後 `atZone(taipei)` 貼回時區標籤，就能組出一個完整的 `ZonedDateTime`。

提醒大家，`Duration.between()` 的結果是以秒為基礎儲存的，要拆成「幾小時幾分鐘」時，記得用 `% 60` 取餘數，不然 `toMinutes()` 會回傳「總分鐘數」而不是「扣掉小時之後剩下的分鐘數」。
-->

---
layout: default
---

# 練習 6 (綜合)：舊系統時間轉換報表

### 任務說明

假設我們從舊系統的資料庫拿到一筆 `Date` 型態的訂單建立時間，請完成以下任務：

1. 模擬舊資料：用 `new Date()` 建立一個代表「現在」的 `Date` 物件
2. 將它轉換成 `ZonedDateTime`（時區為 `Asia/Tokyo`）
3. 計算這個時間點與「2024-01-01 00:00（Asia/Tokyo）」之間相差多少天（使用 `Period` 或 `Duration`）
4. 輸出格式：`訂單時間（東京）：XXXX-XX-XXTXX:XX+09:00，距離今年初已過 X 天`

<!--
這是這份自學內容的綜合練習，把「舊版 Date 轉換」「ZonedDateTime」「Duration / Period」三個主題串在一起。

回顧一下，我們在「新舊轉換」學到 `Date` 要先 `toInstant()` 再 `atZone()` 才能變成 `ZonedDateTime`；在「Duration 與 Period」學到怎麼計算兩個時間點的差距。這題請把這兩段串起來，模擬一個「舊系統資料搬到新系統」的真實場景。

引導思考：如果改用 `Asia/Taipei` 而不是 `Asia/Tokyo`，最後算出來的「天數差」會改變嗎？為什麼？
-->

---
layout: default
---

# 練習 6 (綜合)：解題提示

### 提示說明

1. 將 `Date` 轉成 `ZonedDateTime`：
   ```java
   Date old = new Date();
   ZoneId tokyo = ZoneId.of("Asia/Tokyo");
   ZonedDateTime zdt = old.toInstant().atZone(tokyo);
   ```
2. 建立比較基準點，並計算天數差：
   ```java
   ZonedDateTime newYear = ZonedDateTime.of(
       2024, 1, 1, 0, 0, 0, 0, tokyo
   );
   long days = Duration.between(newYear, zdt).toDays();
   System.out.println("訂單時間（東京）：" + zdt);
   System.out.println("距離今年初已過 " + days + " 天");
   ```

<!--
這題的重點在第 1 步：`old.toInstant().atZone(tokyo)` 一行就完成了「轉運站」+「貼時區標籤」兩個動作，直接得到 `ZonedDateTime`。

提醒大家，`ZonedDateTime.of(2024, 1, 1, 0, 0, 0, 0, tokyo)` 的最後一個參數是奈秒，這裡我們不需要精確到奈秒，所以直接填 0。

最後回答引導思考的問題：因為 `Duration.between()` 是用 `Instant`（也就是 UTC 時間軸上的瞬間）去比較，不管我們選 `Asia/Tokyo` 還是 `Asia/Taipei`，只要兩個時間點都套用同一個時區，算出來的天數差會是一樣的——時區只影響「顯示方式」，不影響「實際經過的時間長度」。
-->

---
layout: end
---
