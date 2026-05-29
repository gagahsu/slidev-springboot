---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 讀取 Spring Boot 設定檔 — @Value、application.properties
routeAlias: ch09
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
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    讀取 Spring Boot 設定檔
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「把會變動的值抽到設定檔，程式碼就不用一直改」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第九章！

上一章我們學了 @PostConstruct，可以在 Bean 建立後做初始化。但有個問題：初始值如果是寫死在程式碼裡，每次要改就要重新編譯。

今天我們要學的是把這些「會變動的值」抽到設定檔裡，然後用 @Value 讀進來。這樣改設定不用改程式碼，是實際專案非常常用的做法。
-->

---
layout: default
---

# Outline

- **什麼是 Spring Boot 設定檔？** — 設定檔的位置、用途，以及為什麼需要它
- **application.properties 的寫法** — key=value 語法、點號表示層級、注釋寫法
- **@Value — 讀取設定值** — 格式、用法、注意事項、預設值
- **補充一：兩種設定檔語法** — properties 和 yml 的差異與選擇
- **補充二：yml 語法介紹** — 縮排規則、冒號格式、完整對比範例
- **章節總結**

<!--
今天的章節有兩個補充：介紹 yml 這個和 properties 相同功能但不同語法的設定檔格式。

現代 Spring Boot 專案兩種格式都很常見，今天把兩種都介紹完，後面看到任何一種都不會陌生。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 什麼是 Spring Boot 設定檔？

<!--
在介紹設定檔的寫法之前，先說說我們為什麼需要它。
-->

---

# 什麼是 Spring Boot 設定檔？

| 項目 | 說明 |
| --- | --- |
| **檔案位置** | `src/main/resources/application.properties` |
| **用途** | 存放程式的設定值，如初始值、資料庫連線、伺服器 port 等 |
| **Spring Boot 的行為** | 啟動時自動讀取這個檔案，不需要任何額外設定 |
| **核心優勢** | 把「會變動的值」和程式碼分離，改設定不用重新編譯 |

「設定檔讓我們把容易變動的值集中管理，程式碼只負責邏輯，設定只負責值。」

<!--
想像一個情境：HpPrinter 的剩餘使用次數 count，初始值是 5。今天老闆說要改成 10，你是要打開 Java 程式碼修改、重新編譯、重新部署，還是只改一個設定檔就好？

設定檔的核心價值就在這裡：把「容易變動的值」從程式碼裡抽出來，放在 application.properties 裡。改設定就只改設定檔，不動程式碼，不用重新編譯。

Spring Boot 會在啟動時自動讀取 application.properties，完全不需要你寫任何讀取程式碼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# application.properties 的寫法

<!--
了解了設定檔的用途，現在來看怎麼寫。Properties 的語法非常簡單，三分鐘就能學會。
-->

---

# application.properties — 基本語法

Properties 格式：每一行一個設定，用 `key=value` 表示：

```properties
count=5
my.name=John
my.age=20
# 這是一行注釋，Spring Boot 會忽略它
```

| 語法規則 | 說明 |
| --- | --- |
| `key=value` | 等號左邊是鍵，右邊是值，**等號前後不加空白** |
| `my.name` | 點號（`.`）代表「的」，用來表示層級，`my.name` 即「我的名字」 |
| `#` | 注釋符號，該行內容會被 Spring Boot 忽略 |

<!--
Properties 的語法規則非常簡單，只有三個要記住。

第一：等號前後不加空白。count = 5 是錯的，count=5 才是正確格式，多了空格會讓 Spring 讀到含有空格的值。

第二：點號代表層級。my.name 可以理解為「my 這個命名空間下的 name」，這樣可以把相關設定值歸在一起，例如 printer.count、printer.brand 都是印表機相關的設定。

第三：# 是注釋，跟 Java 的 // 一樣，這一行的內容會被忽略，不會被讀取。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 讀取 application.properties 中的值：@Value

<!--
設定值寫好了，現在要怎麼在 Java 程式碼裡讀取它？

這就是 @Value 的工作：把 application.properties 裡的設定值，注入到 Bean 的欄位中。
-->

---

# 什麼是 @Value？

| 項目 | 說明 |
| --- | --- |
| **用途** | 將 `application.properties` 中的設定值，注入到 Bean 的欄位 |
| **加在哪裡** | 加在**欄位**上方，和 `@Autowired` 的位置相同 |
| **格式** | `@Value("${KEY_NAME}")`，外層的雙引號與 `${}` 不可省略 |
| **執行時機** | Bean 建立時，Spring 自動讀取設定檔並注入對應的值 |

「在欄位上加上 `@Value("${KEY}")`，Spring 就會從設定檔找到對應的 key，把值注入進來。」

<!--
@Value 的概念跟 @Autowired 很像，都是讓 Spring 幫你把某個「東西」注入到欄位裡。

@Autowired 注入的是 Bean，@Value 注入的是設定值。

格式是固定的：@Value("${KEY_NAME}")，括號裡用雙引號包住 ${}，大括號裡是 application.properties 裡的 key 名稱。這個格式不能改，外面的雙引號不能省，${} 也不能省。
-->

---

# @Value — 程式碼範例

`application.properties` 設定 `count=5`，用 `@Value` 注入到 `HpPrinter`：

```properties
count=5
```

```java
@Component
public class HpPrinter implements Printer {
    @Value("${count}")
    private int count;
}
```

Spring 啟動時讀取設定檔，將 `count` 欄位的值設為 `5`。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>和 @PostConstruct 的差異：</b> <code>@PostConstruct</code> 是用程式碼寫死初始值；<code>@Value</code> 是從設定檔讀取，更靈活、更容易管理。
</div>

<!--
看這個範例。application.properties 裡有一行 count=5，Java 程式碼裡的欄位上加了 @Value("${count}")，Spring 啟動時就會把 5 注入到 count 欄位。

以後要改 count 的初始值，只需要修改 application.properties 裡的數字，不需要碰 Java 程式碼，也不需要重新編譯。

⚠️ 注意 @Value 只能在 Bean 裡面用。也就是說，這個類別要加了 @Component 或類似的 Annotation，Spring 才會處理 @Value 注入。如果是普通類別（沒有 Spring 管理），@Value 不會有效果，欄位還是 null。
-->

---

# @Value — 四個注意事項

| 注意事項 | 說明 |
| --- | --- |
| **固定格式** | 必須是 `@Value("${KEY}")`，`${}` 和外層雙引號都不可省略 |
| **只在 Bean 中生效** | 類別本身必須是 Spring 管理的 Bean（加了 `@Component` 等） |
| **型別要一致** | 設定值是數字，欄位宣告 `int`；是文字，宣告 `String` |
| **key 不存在會報錯** | 設定檔裡找不到對應 key，Spring 啟動時丟出例外 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> key 名稱拼錯（例如 <code>${Count}</code> 而不是 <code>${count}</code>），大小寫不一樣，Spring 就找不到，啟動失敗。
</div>

<!--
四個注意事項，我重點說幾個。

第一個格式問題是最常見的：寫成 @Value(${count}) 忘了雙引號，或寫成 @Value("count") 忘了 ${}，都不對。

第二個 Bean 限制：@Value 只在 Spring 管理的類別裡有效。如果你的類別忘了加 @Component，@Value 不會被處理，欄位的值會是 null 或預設值，不是設定檔的值。

第四個 key 不存在：如果 application.properties 裡沒有對應的 key，Spring 啟動時會報錯。解法是用預設值，下一張會說。
-->

---

# @Value — 預設值用法

當設定檔找不到對應 key 時，可以用冒號語法指定預設值：

| 語法 | 說明 |
| --- | --- |
| `@Value("${count}")` | 找不到 `count` → 啟動報錯 |
| `@Value("${count:5}")` | 找不到 `count` → 使用預設值 `5` |

```java
@Value("${printer.count:200}")
private int count; // 若 application.properties 無此 key，count = 200
```

<!--
預設值的語法是在 key 後面加冒號，再加上預設值，例如 ${printer.count:200}。

如果 application.properties 裡有 printer.count，就用那個值；如果沒有，就用 200 作為預設。

這在開發時很方便——本地開發可以不寫設定，讓程式用預設值跑；部署到正式環境時再加上真正的設定值。

不過預設值要謹慎使用：如果設定值散落在程式碼裡，未來要修改或稽核設定會很困難。建議重要的設定值都明確寫在 application.properties，不要依賴預設值。
-->

---

# HpPrinter — 完整的 print() 方法

`@Value` 注入 `count` 初始值後，`print()` 每次呼叫將 `count` 遞減再輸出：

```java
@Override
public void print(String message) {
    count--;
    System.out.println("HP印表機: " + message);
    System.out.println("剩餘使用次數: " + count);
}
```

`count` 由 `application.properties` 注入為 `5`，每次呼叫 `print()` 先減 1 再輸出。

<!--
現在把兩個部分合在一起看：@Value 從設定檔把 5 注入到 count，print() 每次被呼叫就把 count 減 1 再輸出。

和上一章 @PostConstruct 的效果完全相同，差別只在初始值的來源：@PostConstruct 是寫死在程式碼裡，@Value 是從設定檔讀取。

改設定檔的 count 值，不需要動這個 print() 方法——邏輯和設定值分離，這就是 @Value 的核心優勢。
-->

---

# 執行結果

設定 `count=5`，存取 `http://localhost:8080/test`，呼叫三次後 console 輸出：

```
HP印表機: Hello World
剩餘使用次數: 4
HP印表機: Hello World
剩餘使用次數: 3
HP印表機: Hello World
剩餘使用次數: 2
```

`count` 從 `application.properties` 注入的 `5` 開始，每次 `print()` 遞減。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 把 application.properties 裡的 <code>count=5</code> 改成 <code>count=10</code>，重啟程式，會看到從 9 開始遞減——不需要改任何 Java 程式碼。
</div>

<!--
這個結果和上一章用 @PostConstruct 設定 count = 5 是一樣的，但現在的方式更靈活。

想驗證設定檔的效果，可以把 count=5 改成 count=10，重新啟動 Spring Boot，console 輸出就會從 9 開始——完全沒有改 Java 程式碼。

這就是設定檔的威力：讓「值」和「邏輯」分離，彼此獨立。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充一
# Spring Boot 設定檔的兩種語法

<!--
Spring Boot 支援兩種設定檔格式：properties 和 yml。

它們的功能完全相同，只是語法不同。現代專案兩種都很常見，我們一起來看看差別在哪。
-->

---

# Properties vs YML — 語法對比

相同的設定，兩種語法的寫法對比：

```properties
# application.properties
my.name=John
my.age=20
printer.count=100
```

```yaml
# application.yml
my:
  name: John
  age: 20
printer:
  count: 100
```

| 比較項目 | properties | yml |
| --- | --- | --- |
| **層級表示** | 點號（`my.name`） | 縮排（`my:` 下一層 `name:`） |
| **值的格式** | `key=value` | `key: value`（冒號後有空格） |
| **現代專案偏好** | 傳統，仍常見 | 越來越主流 |

<!--
兩種格式描述的是完全相同的設定，只是語法不同。

properties 用點號表示層級，my.name 代表 my 下面的 name。

yml 用縮排表示層級，my: 後面縮排兩個空格寫 name:，視覺上的樹狀結構更清楚。

功能上沒有差別，選哪一種是個人或團隊的習慣問題。現代新專案比較常見 yml，但兩種都要能看懂。

⚠️ 重要：Spring Boot 應用程式只能選一種格式，不能同時存在 application.properties 和 application.yml。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充二
# yml 的語法介紹

<!--
既然 yml 越來越主流，我們來多看一些 yml 的語法細節，讓你在實際專案裡看到 yml 時不會陌生。
-->

---

# yml 的語法規則

| 規則 | 說明 | 範例 |
| --- | --- | --- |
| **冒號後必須加空格** | `key: value`，冒號和值之間一定要有空格 | `name: John` ✅ `name:John` ❌ |
| **縮排代表層級** | 子層級用縮排表示，通常是 **2 個空格** | 見下方範例 |
| **縮排只能用空格** | 不能用 Tab 鍵，只能用空白鍵 | IDE 通常會自動轉換 |
| **同層級要對齊** | 同一層的 key 縮排量必須相同 | 縮排不一致會解析錯誤 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>最常見的錯誤：</b> 冒號後忘記加空格（<code>name:John</code>），或縮排用了 Tab 而不是空格，都會導致解析失敗。
</div>

<!--
yml 的語法規則比 properties 多一些，但記住兩個核心就夠了：

第一：冒號後一定要有空格。name: John 是對的，name:John 沒有空格是錯的，Spring 解析會失敗。

第二：縮排只能用空格，不能用 Tab。大部分 IDE 的編輯器預設會把 Tab 轉成空格，但如果你直接複製貼上其他地方的內容，要注意縮排字元是否正確。

縮排量通常是 2 個空格，代表一個層級。如果同一層的 key 縮排不一樣，yml 解析器會認為它們不是同一層，導致設定讀取錯誤。
-->

---

# yml 完整範例

```yaml
my:
  name: John
  age: 20
printer:
  count: 100
  brand: HP
server:
  port: 8080
```

對應的 `application.properties` 寫法：

```properties
my.name=John
my.age=20
printer.count=100
printer.brand=HP
server.port=8080
```

<!--
這個完整範例把幾個不同層級的設定都放在一起，讓你看清楚 yml 和 properties 的對應關係。

yml 的優勢是視覺上的層級結構很清楚：my 下面有 name 和 age，printer 下面有 count 和 brand，一眼就能看出哪些設定是相關的。

properties 的設定量多了之後，點號連接的 key 會很長很難讀，yml 的縮排格式在這種情況下可讀性更好。

實際選用哪種，跟你加入的團隊或公司的習慣走就行。
-->

---

# 章節總結

- **application.properties**：Spring Boot 自動讀取的設定檔，存放在 `src/main/resources/`，格式為 `key=value`
- **`@Value("${KEY}")`**：將設定檔中的值注入到 Bean 欄位，格式固定，只在 Bean 中生效
- **預設值**：`@Value("${key:defaultValue}")` 防止找不到 key 時報錯
- **properties vs yml**：功能相同，只是語法不同；yml 用縮排替代點號，冒號後要加空格
- **只能選一種**：Spring Boot 應用程式不能同時存在 `application.properties` 和 `application.yml`

下一章我們會介紹 Spring AOP 的概念，學習如何在不修改原有程式碼的情況下，替方法加上額外的功能。

<!--
我們來整理今天學到的東西。

@Value 和 application.properties 是 Spring Boot 開發中每個專案都會用到的基礎工具，一定要熟悉。

後面我們學 Spring Security、Spring JDBC，設定檔的用法都會一再出現，例如資料庫連線的 URL、帳號密碼，都是放在 application.properties 裡，用 Spring 自動讀取。

有問題的同學現在可以提問！
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天學會了 application.properties 和 @Value，可以把設定值從程式碼裡抽出來了。

課後可以試試看：把 HpPrinter 的 count 初始值從 @PostConstruct 的寫死值，改用 @Value 從設定檔讀取，看看是否能成功注入，然後改設定檔的數字驗證效果。

有問題嗎？
-->
