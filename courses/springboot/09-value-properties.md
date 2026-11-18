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

上一章，我們在開店前用 @PostConstruct 幫印表機放進 5 張紙。但那個 5 是寫死在程式裡的，老闆想改成 10 張，就得改程式。

今天要學一個更方便的做法：把這種會變動的數字，寫在便利商店門口的公告上。在 Spring 裡，這張公告叫做設定檔。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **什麼是設定檔？** 便利商店門口的那張公告
- **怎麼寫 `application.properties`？** 公告上的每一行
- **`@Value`**：讓印表機去讀公告上的數字

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，什麼是設定檔。它就是便利商店門口的那張公告。

（下一步）第二，怎麼寫 application.properties，也就是公告上的每一行要怎麼寫。

（下一步）第三，@Value，讓印表機去讀公告上的數字。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 便利商店門口的公告

<!--
大家去便利商店的時候，有沒有看過門口或櫃台貼著的公告？上面會寫影印一張幾元之類的資訊。

今天的故事就從這張公告開始。
-->

---

# 要改數字，只改公告

<NoticeBoard />

<!--
小明家巷口的便利商店，門口貼著一張公告，上面寫著：黑白列印每張 2 元、每次放紙 5 張。

（下一步）開店的時候，印表機會照著公告，放進 5 張紙。

（下一步）有一天老闆想改成每次放 10 張。他要做的事情很簡單：改公告上的數字就好。

（下一步）下次開店，印表機照著新的公告放進 10 張紙。請注意，機器完全沒有拆開，也沒有換零件。

這就是今天的重點：把會變動的數字寫在公告上，要改的時候只改公告。
-->

---

# 把故事搬進程式裡

<Pairs left="便利商店" right="Spring" rows="doc,店門口的公告=code,設定檔 application.properties|paper,公告上的「每次放紙：5 張」=code,一行設定：printer.count=5|printer,開店時，印表機去看公告=code,@Value：從設定檔讀出數字|store,改公告，不用拆機器=spring,改設定檔，不用改程式碼" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> 把「容易變動的值」寫在設定檔，程式碼只負責做事。要改值，只改設定檔。
</div>

</v-click>

<!--
把故事搬進程式裡。

（下一步）店門口的公告，就是 Spring Boot 的設定檔，檔名叫 application.properties。

（下一步）公告上的「每次放紙：5 張」，就是設定檔裡的一行：printer.count=5。

（下一步）開店時，印表機去看公告，就是用 @Value 從設定檔讀出數字。

（下一步）改公告，不用拆機器，就是改設定檔，不用改程式碼。只要重新啟動程式，新的值就生效了。

（下一步）一句話記起來：把容易變動的值寫在設定檔，程式碼只負責做事。要改值，只改設定檔。
-->

---

# 小測驗：老闆該怎麼改？

<Poll question="老闆想把「每次放紙」從 5 張改成 10 張。最好的做法是什麼？" options="把印表機拆開，改裡面的零件|改門口公告上的數字|換一台新的印表機" answer="2" />

<!--
來一題確認一下。

老闆想把「每次放紙」從 5 張改成 10 張，最好的做法是什麼？

（等大家作答）

（下一步）答案是改門口公告上的數字。

拆機器、換機器都太麻煩了。在程式裡也是一樣：改設定檔上的數字，比打開程式碼修改簡單得多，也比較不容易改壞東西。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 公告怎麼寫：application.properties

<!--
接下來看看這張公告，也就是 application.properties，要怎麼寫。
-->

---

# application.properties 的寫法

檔案位置：`src/main/resources/application.properties`（建立專案時就有了）

```properties
# 這一行是註解，Spring Boot 會跳過它
printer.count=5
store.name=巷口便利商店
```

<v-clicks>

- **一行一個設定**：`名稱=值`，等號前後**不要加空白**
- **點（`.`）讀作「的」**：`printer.count` 就是「印表機的張數」
- **`#` 開頭是註解**：寫給人看的備註，Spring Boot 不會讀它

</v-clicks>

<!--
設定檔放在 src/main/resources 底下，叫做 application.properties。用 Spring Initializr 建立專案的時候，這個檔案就已經在了。

裡面的寫法很簡單。

（下一步）第一，一行一個設定，格式是「名稱、等號、值」。要注意等號前後不要加空白。

（下一步）第二，名稱裡的點，可以讀作「的」。printer.count 就是「印表機的張數」，store.name 就是「店的名字」。用點分層，看起來比較整齊。

（下一步）第三，井字號開頭的是註解，是寫給人看的備註，Spring Boot 會跳過它。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# @Value：讓印表機去讀公告

<!--
公告寫好了。接下來要讓印表機在開店的時候，真的去讀公告上的數字。這就要用到 @Value。
-->

---

# @Value 寫起來長這樣

```properties
printer.count=5
```

```java
@Component
public class HpPrinter implements Printer {
    @Value("${printer.count}")
    private int count;
}
```

<v-clicks>

- `${ }` 裡面寫的，就是公告上的那個名稱
- Spring 建立 `HpPrinter` 時，會去設定檔找 `printer.count`，把 `5` 放進 `count`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>和上一章比較：</b> <code>@PostConstruct</code> 把 5 寫死在程式裡；<code>@Value</code> 從設定檔讀，要改只改設定檔。
</div>

</v-click>

<!--
上面是設定檔，寫著 printer.count=5。下面是 HpPrinter，在 count 變數上面加了 @Value，括號裡寫的是錢字號、大括號，裡面放 printer.count。

（下一步）大括號裡面寫的，就是公告上的那個名稱。

（下一步）Spring 建立 HpPrinter 的時候，就會去設定檔裡找 printer.count 這一行，把 5 放進 count 變數。就像印表機開店時去看公告。

（下一步）跟上一章比較一下：@PostConstruct 是把 5 寫死在程式裡，要改就要改程式；@Value 是從設定檔讀的，要改只改設定檔。
-->

---

# 使用 @Value 的四個注意事項

<v-clicks>

- **格式固定**：`@Value("${名稱}")`，雙引號和 `${ }` 都不能少
- **只有店裡的機器會看公告**：這個 class 要是 Bean（有加 `@Component` 之類的記號）
- **型別要對**：數字放進 `int`，文字放進 `String`
- **公告上找不到就會出錯**：名稱拼錯或大小寫不同，程式會啟動失敗

</v-clicks>

<!--
用 @Value 有四件事要注意。

（下一步）第一，格式是固定的。雙引號、錢字號、大括號，一個都不能少。

（下一步）第二，只有店裡的機器會看公告。也就是說，這個 class 必須是 Bean，要有加 @Component 之類的記號。小明家裡自己 new 的印表機，是不會去看便利商店公告的。

（下一步）第三，型別要對。設定檔裡寫的是數字，就放進 int；寫的是文字，就放進 String。

（下一步）第四，公告上找不到就會出錯。名稱拼錯、或大小寫不一樣，Spring 都會找不到，程式就啟動失敗。
-->

---

# 公告上沒寫？用出廠設定

`@Value` 可以在冒號後面加一個**預設值**：公告上沒寫這一項時，就用這個值。

```java
@Value("${printer.count:200}")
private int count; // 設定檔裡沒有 printer.count 時，count 就是 200
```

<v-clicks>

- `@Value("${printer.count}")`：找不到 → 程式啟動失敗
- `@Value("${printer.count:200}")`：找不到 → 用 `200`，就像印表機的出廠設定

</v-clicks>

<!--
如果公告上剛好沒寫這一項呢？@Value 可以設定一個預設值。

寫法是在名稱後面加一個冒號，再寫預設值。這裡的意思是：設定檔裡沒有 printer.count 的話，count 就是 200。

（下一步）沒有冒號的寫法，找不到就會啟動失敗。

（下一步）有冒號的寫法，找不到就用 200。就像印表機的出廠設定，公告上沒特別寫，就照出廠的來。
-->

---

# 開門營業：照公告上的數字印

```java
@Override
public void print(String message) {
    count--;
    System.out.println("HP印表機: " + message);
    System.out.println("剩下幾張紙: " + count);
}
```

<v-click>

設定 `printer.count=5`，小明連續印三次，Console 會印出剩下 4、3、2 張。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>自己試試看：</b> 把設定檔改成 <code>printer.count=10</code>，重新啟動程式，會看到從 9 開始往下減。Java 程式一個字都沒改。
</div>

</v-click>

<!--
print 方法跟上一章一模一樣：每印一張，count 減 1。

（下一步）設定檔寫 printer.count=5，小明連續印三次，Console 就會印出剩下 4、3、2 張。

接著請大家自己試試看：把設定檔改成 printer.count=10，重新啟動程式。你會看到剩下的張數從 9 開始往下減。整個過程，Java 程式一個字都沒改。這就是「只改公告，不用拆機器」。
-->

---

# 小測驗：找不到會怎樣？

<Poll question="設定檔裡沒有 printer.count 這一行，而程式寫的是 @Value(&quot;${printer.count:200}&quot;)。count 會是多少？" options="程式啟動失敗|200|0" answer="2" />

<!--
最後一題。

設定檔裡沒有 printer.count 這一行，而程式寫的是 @Value 括號 printer.count 冒號 200。count 會是多少？

（等大家作答）

（下一步）答案是 200。

因為有冒號，冒號後面的 200 就是預設值，公告上沒寫就用出廠設定。如果沒有冒號，才會啟動失敗。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充
# 公告的另一種寫法：yml

<!--
最後補充一下。同樣的公告內容，還有另一種排版方式，叫做 yml。很多公司的專案會用這種寫法，所以要看得懂。
-->

---

# properties 和 yml：同樣的內容，不同的排版

```properties
# application.properties
printer.count=5
store.name=巷口便利商店
```

```yaml
# application.yml
printer:
  count: 5
store:
  name: 巷口便利商店
```

<v-clicks>

- **層級用縮排表示**：`printer:` 下一行縮排的 `count`，就是 `printer.count`
- **冒號後面一定要空一格**：`count: 5` ✅　`count:5` ❌
- **縮排只能用空白鍵**：不能用 Tab，通常是空兩格

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建議一個專案只用一種：</b> 兩個檔案可以同時存在，但同一個設定兩邊都寫時，會以 <code>application.properties</code> 為準，很容易搞混。
</div>

</v-click>

<!--
上面是我們剛剛寫的 properties，下面是同樣內容的 yml 寫法。內容完全一樣，只是排版不同。

（下一步）yml 的層級是用縮排表示的。printer 冒號，下一行縮排寫 count，就等於 properties 的 printer.count。

（下一步）冒號後面一定要空一格。count 冒號空格 5 是對的，沒有空格就會出錯。這是最常見的錯誤。

（下一步）縮排只能用空白鍵，不能用 Tab，通常是空兩格。

（下一步）最後提醒，這兩個檔案可以同時存在，但同一個設定兩邊都寫的時候，會以 properties 為準，很容易搞混。所以建議一個專案只用一種。
-->

---

# 一張圖複習今天的內容

<Pairs left="便利商店" right="Spring" rows="doc,店門口的公告=code,application.properties|paper,公告上的一行：每次放紙 5 張=code,printer.count=5|printer,開店時印表機去看公告=code,@Value(&quot;${printer.count}&quot;)|printer,公告沒寫就用出廠設定=code,預設值：${printer.count:200}|doc,同樣的公告，換一種排版=code,application.yml" />

<!--
我們用一張圖複習今天的內容。

（下一步）店門口的公告，就是 application.properties。

（下一步）公告上的一行，每次放紙 5 張，就是 printer.count=5。

（下一步）開店時印表機去看公告，就是 @Value。

（下一步）公告沒寫就用出廠設定，就是冒號後面的預設值。

（下一步）同樣的公告換一種排版，就是 application.yml。
-->

---

# 章節總結

<v-clicks>

- **設定檔**：把容易變動的值集中寫在 `application.properties`，改值不用改程式碼
- **寫法**：一行一個 `名稱=值`，點讀作「的」，`#` 開頭是註解
- **`@Value("${名稱}")`**：把設定檔的值放進 Bean 的變數；冒號後面可以加預設值
- **yml**：同樣的內容用縮排排版，冒號後要空一格；建議一個專案只用一種

</v-clicks>

<v-click>

下一章：每台機器印之前都要收錢、印完都要記帳。與其每台各做一次，不如統一交給櫃台。這就是 AOP。

</v-click>

<!--
最後整理今天的重點。

（下一步）設定檔，是把容易變動的值集中寫在 application.properties，改值不用改程式碼。

（下一步）寫法是一行一個「名稱等於值」，點讀作「的」，井字號開頭是註解。

（下一步）@Value 可以把設定檔的值放進 Bean 的變數，冒號後面還可以加預設值。

（下一步）yml 是同樣的內容換一種排版，用縮排表示層級，冒號後要空一格。建議一個專案只用一種。

（下一步）下一章，我們回到便利商店。每台機器印之前都要收錢、印完都要記帳。與其每台機器各做一次，不如統一交給櫃台。這就是下一章的主角：AOP。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

記住一個畫面：要改數字，只改門口的公告，不用拆機器。

有任何問題歡迎現在提出來。
-->
