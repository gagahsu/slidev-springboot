---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Bean 的初始化 — @PostConstruct
routeAlias: ch08
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
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Bean 的初始化
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「Bean 建立完成後，自動執行準備工作」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第八章！

前幾章我們學了怎麼建立 Bean（@Component）、注入 Bean（@Autowired）、指定 Bean（@Qualifier）。今天要學的是 Bean 生命週期裡的下一個環節：初始化。

Bean 被 Spring 建立出來之後，有時候我們需要在它開始被使用前，先做一些準備工作，例如設定初始值、讀取設定、建立連線。@PostConstruct 就是做這件事的 Annotation。
-->

---
layout: default
---

# Outline

- **什麼是 Bean 的初始化？** — Bean 建立後需要做哪些準備，以及為什麼需要初始化
- **@PostConstruct** — 定義、程式碼範例、方法格式要求、注意事項
- **補充一：真的需要 @PostConstruct 嗎？** — 直接賦值 vs @PostConstruct 的比較與適用場景
- **補充二：afterPropertiesSet()** — InitializingBean 介面的初始化方式與現況
- **章節總結** — 掌握 @PostConstruct 的時機與格式

<!--
今天的章節除了主要的 @PostConstruct 之外，還有兩個補充。

補充一討論「什麼時候真的需要用 @PostConstruct，什麼時候直接賦值就夠了」，這是實際開發常見的判斷題。

補充二介紹另一種初始化方式 afterPropertiesSet()，在舊專案裡可能會看到，了解一下就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 什麼是 Bean 的初始化？

<!--
在學 @PostConstruct 之前，我們先搞清楚「初始化」這件事是什麼，以及在什麼情境下我們會需要它。
-->

---

# 什麼是 Bean 的初始化？

| 概念 | 說明 |
| --- | --- |
| **Bean 的初始化** | 在 Bean 被建立出來之後，對它設定初始值或執行準備邏輯 |
| **發生時機** | Spring 建立 Bean 實例之後，Bean 開始被使用之前 |
| **目的** | 確保 Bean 在第一次被呼叫時，內部狀態已經準備好 |

「Bean 的初始化，就是在 Bean 被創建出來之後，對這個 Bean 做一些初始值的設定。」

<!--
初始化這個概念不難理解。

就好像你剛買了一台新印表機，你要先幫它裝墨水、設定語言、設定紙張大小，才能開始印東西。這個「開始使用前的準備動作」，就是初始化。

Bean 也一樣，Spring 建立 HpPrinter 實例之後，可能需要設定初始使用次數、讀取設定檔裡的參數，或是建立資料庫連線，這些都是初始化要做的事。
-->

---

# 情境：印表機的使用次數

想像 `HpPrinter` 有個 `count` 欄位，記錄剩餘使用次數。每次列印後 `count` 減 1：

```java
@Component
public class HpPrinter implements Printer {
    private int count; // 需要初始值，但 Spring new 出來時預設是 0
}
```

**問題**：`count` 初始值該怎麼設定？

| 選項 | 說明 |
| --- | --- |
| 直接賦值 `= 5` | 簡單固定值，可行 |
| 用 **@PostConstruct** | Bean 建立後自動執行，適合複雜邏輯 |

<!--
我們用一個具體的情境來說明初始化的需求。

假設 HpPrinter 有個 count 欄位，代表剩餘使用次數，初始值是 5，每次 print() 被呼叫就減 1。

問題是：count 的初始值怎麼設定？最簡單的方法是直接寫 private int count = 5，但如果初始值需要從設定檔讀取、或是需要複雜的計算邏輯，就需要 @PostConstruct。

我們先來看 @PostConstruct 怎麼用，補充一再來討論什麼情況才真的需要它。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 初始化 Bean 的方法：@PostConstruct

<!--
@PostConstruct 是一個非常直覺的 Annotation：加在方法上，Spring 建立 Bean 之後就會自動執行這個方法。
-->

---

# 什麼是 @PostConstruct？

| 項目 | 說明 |
| --- | --- |
| **用途** | 讓 Spring 在 Bean 建立完成後，自動執行指定的初始化方法 |
| **加在哪裡** | 加在**方法**上方（不是 class，不是欄位） |
| **執行時機** | Bean 實例建立完成、所有 `@Autowired` 注入完成後，才執行 |
| **import（Spring Boot 3.x）** | `jakarta.annotation.PostConstruct` |

「在方法上加上 `@PostConstruct`，Spring 建立這個 Bean 之後，就會自動呼叫這個方法。」

<!--
@PostConstruct 的概念很簡單：你在某個方法上面貼一個標籤，告訴 Spring「這個 Bean 建立好之後，記得先執行這個方法」。

有一個很重要的細節：@PostConstruct 是在所有 @Autowired 注入完成之後才執行的。這表示如果你的初始化邏輯需要用到其他注入的 Bean，@PostConstruct 是安全的選擇；但如果你在 constructor 裡做初始化，那時候 @Autowired 還沒完成，可能拿到 null。

這就是 @PostConstruct 比 constructor 更適合做初始化的原因。
-->

---

# @PostConstruct 程式碼範例

在 `HpPrinter` 的初始化方法上加 `@PostConstruct`：

```java
import jakarta.annotation.PostConstruct;
@Component
public class HpPrinter implements Printer {
    private int count;
    @PostConstruct
    public void initialize() {
        count = 5;
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 3.x 版本注意：</b> import 路徑已從 <code>javax.annotation.PostConstruct</code> 改為 <code>jakarta.annotation.PostConstruct</code>。Spring Boot 2.x 舊程式碼若直接升版，這裡會編譯失敗。
</div>

<!--
看這段程式碼，initialize() 方法上面加了 @PostConstruct。

Spring 建立 HpPrinter 實例的時候，會在建立完成後自動去找有 @PostConstruct 的方法並執行，所以 initialize() 會被自動呼叫，count 就被設定為 5 了。

你不需要自己呼叫 initialize()，Spring 幫你做。這就是「自動」的意思。

方法名稱可以自己取，initialize、setup、init 都可以，重要的是 @PostConstruct 這個 Annotation 要加對地方。
-->

---

# @PostConstruct 方法格式要求

被 `@PostConstruct` 標註的方法，必須符合以下格式，否則 Spring 無法識別：

| 要求 | 正確 | 錯誤範例 |
| --- | --- | --- |
| **存取修飾子** | `public` | `private`、`protected` |
| **回傳型別** | `void` | `int`、`String` 等 |
| **參數** | 無（不能有任何參數） | `public void init(int n)` |
| **方法名稱** | 任意 | 無限制 |

標準格式：`public void methodName() { ... }`

<!--
@PostConstruct 對方法的格式有三個限制，缺一不可。

第一：必須是 public 方法，Spring 需要能夠存取並呼叫它。

第二：回傳型別必須是 void，Spring 呼叫完之後不需要回傳值。

第三：不能有任何參數，Spring 呼叫時不知道要傳什麼參數進去，所以不接受有參數的方法。

方法名稱則沒有限制，任意取名都可以。

⚠️ 格式不對的話，Spring Boot 在啟動時可能不會呼叫這個方法，初始化就失效了，而且不一定會報錯，很難排查。
-->

---

# 使用 @PostConstruct 的注意事項

| 注意事項 | 說明 |
| --- | --- |
| **同一類別只加一個** | 若同一個類別有多個方法都加了 `@PostConstruct`，Spring 會隨機執行其中一個，結果不可預測 |
| **執行順序在注入之後** | `@PostConstruct` 在所有 `@Autowired` 注入完成後才執行，可以安全使用注入的 Bean |
| **不能手動呼叫** | `@PostConstruct` 方法是由 Spring 呼叫的，不應在程式碼中手動呼叫 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> 在同一個類別裡加了兩個 <code>@PostConstruct</code> 方法，Spring 只會執行其中一個，哪個被執行是不確定的。
</div>

<!--
有三個注意事項要記住。

第一：同一個類別只能有一個 @PostConstruct 方法。如果你加了兩個，Spring 不會報錯，但只會執行其中一個，執行哪個是不確定的，這種 bug 非常難追查。

第二：@PostConstruct 執行時，所有 @Autowired 注入都已完成。所以如果你的初始化邏輯需要用到其他 Bean（例如讀取設定值的 Bean），在 @PostConstruct 裡用是安全的。

第三：@PostConstruct 方法是給 Spring 自動呼叫的，你不應該在自己的程式碼裡手動呼叫它，那樣就失去了「自動」的意義。
-->

---

# HpPrinter — 完整的 print() 方法

`@PostConstruct` 設定初始值後，`print()` 每次呼叫將 `count` 遞減再輸出：

```java
@Override
public void print(String message) {
    count--;
    System.out.println("HP印表機: " + message);
    System.out.println("剩餘使用次數: " + count);
}
```

`count` 在 `@PostConstruct` 初始化為 `5`，每次呼叫 `print()` 先減 1 再輸出。

<!--
現在把兩個部分合在一起看：@PostConstruct 把 count 設為 5，print() 每次被呼叫就把 count 減 1 再輸出。

第一次呼叫 print()：count 從 5 變成 4，輸出「剩餘使用次數: 4」。
第二次呼叫：count 從 4 變成 3，輸出「剩餘使用次數: 3」。

這就是 @PostConstruct 初始化加上業務邏輯方法搭配起來的完整效果。
-->

---

# 執行結果

完整的 `HpPrinter`（含 `@PostConstruct` 和 `print()` 方法），呼叫三次 `print()` 後：

```
HP印表機: Hello World
剩餘使用次數: 4
HP印表機: Hello World
剩餘使用次數: 3
HP印表機: Hello World
剩餘使用次數: 2
```

`count` 從 `@PostConstruct` 設定的初始值 5 開始，每次 `print()` 遞減 1。

<!--
這個執行結果說明了 @PostConstruct 的效果：count 的初始值是 5，每次 print() 被呼叫，count 先遞減再輸出。

如果沒有 @PostConstruct，count 的初始值會是 Java 的預設值 0，遞減之後就會變成 -1、-2，這顯然不是我們要的結果。

透過 @PostConstruct，我們確保了 Bean 在第一次被使用前，內部狀態已經正確初始化。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充一
# 我們真的需要 @PostConstruct 嗎？

<!--
學完 @PostConstruct，一個很自然的問題是：既然直接寫 private int count = 5 也能初始化，那 @PostConstruct 到底什麼時候才是必要的？
-->

---

# 直接賦值 vs @PostConstruct

| 方式 | 程式碼 | 適合情境 |
| --- | --- | --- |
| **直接賦值** | `private int count = 5;` | 簡單的固定值，編譯時就確定 |
| **@PostConstruct** | 方法內執行邏輯 | 複雜邏輯，或需要用到注入的 Bean |

簡單固定值，直接賦值就夠了：

```java
private int count = 5; // 直接賦值，完全可行
```

需要複雜邏輯時，改用 `@PostConstruct`：

```java
@PostConstruct
public void initialize() {
    count = someBean.getInitialCount(); // 從另一個 Bean 讀取初始值
}
```

<!--
這是個很好的問題，也是實際開發中常需要做的判斷。

如果初始值就是一個固定的數字，直接寫 private int count = 5 完全沒問題，簡單直覺，不需要大費周章用 @PostConstruct。

但如果初始值需要從設定檔讀取、從資料庫查詢、或是需要用到其他注入的 Bean 的話，這時候直接賦值就做不到了——因為在欄位宣告的時候，@Autowired 的 Bean 還沒有注入進來。

@PostConstruct 的執行時機是「所有注入完成之後」，所以在這裡可以安全地使用注入的 Bean，這是它最大的優勢。
-->

---

# @PostConstruct 的適用場景

| 場景 | 說明 |
| --- | --- |
| **使用注入的 Bean 設定初始值** | 初始值來自另一個 Bean，需要等注入完成才能讀取 |
| **初始化 Map 或 List** | 需要用迴圈或複雜邏輯填入初始資料 |
| **驗證注入的 Bean 是否正常** | 檢查注入物件是否為 `null` 或符合預期狀態 |
| **建立連線或資源** | 建立資料庫連線池、讀取外部設定檔等啟動準備 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>判斷原則：</b> 初始化邏輯只是設定固定值 → 直接賦值。需要執行邏輯、或需要用到注入的 Bean → 用 <code>@PostConstruct</code>。
</div>

<!--
整理一下 @PostConstruct 最適合的四種場景。

最常見的是第一種：初始值需要從其他 Bean 讀取。例如從 @Value 注入的 application.properties 設定值來決定初始 count 是多少。

第二種是初始化集合型別，例如要在 Map 裡預先填入幾筆測試資料，這種用直接賦值的語法會很醜，用 @PostConstruct 可以寫成清晰的迴圈。

第三種是驗證注入結果，確保注入進來的 Bean 是正常的，不是 null。

第四種是啟動時的準備工作，例如建立連線池、讀取外部設定檔，這些都必須等 Spring 容器準備好才能做。

記住那個判斷原則：固定值 → 直接賦值；需要邏輯或需要用其他 Bean → @PostConstruct。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充二
# 初始化 Bean 的另一種方法：afterPropertiesSet()

<!--
除了 @PostConstruct，Spring 還有另一種初始化方式：讓類別實作 InitializingBean 介面並覆寫 afterPropertiesSet() 方法。

這個方法在舊版 Spring 專案裡比較常見，現代開發已經幾乎都改用 @PostConstruct，但舊專案可能會看到，了解一下就好。
-->

---

# afterPropertiesSet() — InitializingBean 介面

讓類別實作 `InitializingBean` 介面，覆寫 `afterPropertiesSet()` 方法：

```java
import org.springframework.beans.factory.InitializingBean;
@Component
public class HpPrinter implements Printer, InitializingBean {
    private int count;
    @Override
    public void afterPropertiesSet() throws Exception {
        count = 5;
    }
}
```

| 比較項目 | `@PostConstruct` | `afterPropertiesSet()` |
| --- | --- | --- |
| **方式** | Annotation（Jakarta EE 標準） | 實作 Spring 專屬介面 |
| **與 Spring 耦合** | 低 | 高 |
| **業界現況** | 主流，推薦使用 | 較少使用，見於舊專案 |

<!--
afterPropertiesSet() 是 InitializingBean 介面定義的方法，讓類別實作這個介面，Spring 建立 Bean 後就會自動呼叫 afterPropertiesSet()，效果和 @PostConstruct 一樣。

但比較兩者，@PostConstruct 有一個明顯的優勢：它是 Jakarta EE 的標準 Annotation，不綁定 Spring。如果你的程式碼有一天要搬到其他框架，@PostConstruct 可以繼續用；但 InitializingBean 是 Spring 專屬的，搬到其他框架就沒有了。

現代 Spring Boot 專案幾乎都用 @PostConstruct，afterPropertiesSet() 只在維護舊專案時才會碰到。了解它的存在就好，自己寫新程式碼時選 @PostConstruct 就行。
-->

---

# 章節總結

- **Bean 初始化**：Bean 建立後、被使用前，設定初始值或執行準備邏輯的過程
- **@PostConstruct**：加在方法上，Spring 建立 Bean 且完成所有注入後，自動呼叫該方法
- **方法格式**：必須是 `public void methodName()`，不能有參數；同一類別只能有一個
- **直接賦值 vs @PostConstruct**：固定值直接賦值即可；需要複雜邏輯或使用注入 Bean 時用 @PostConstruct
- **afterPropertiesSet()**：另一種初始化方式（實作 InitializingBean），見於舊專案，現代開發優先選 @PostConstruct

下一章我們會介紹 `@Value`，學習如何從 `application.properties` 讀取設定值，注入到 Bean 的欄位中。

<!--
好，我們來整理今天學到的東西。

@PostConstruct 是 Bean 生命週期裡一個很實用的工具，讓你能在 Bean 被使用前做好準備工作。

記住兩個最重要的點：第一，方法格式是 public void，不能有參數；第二，同一個類別只能有一個 @PostConstruct。

下一章的 @Value 跟 @PostConstruct 是很好的搭配：先用 @Value 從 application.properties 讀取設定值，再用 @PostConstruct 把讀進來的值做進一步的初始化處理。

有問題的同學現在可以提問！
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天學會了 @PostConstruct，知道怎麼讓 Spring 在 Bean 建立後自動執行初始化邏輯了。

課後可以試試看：在 HpPrinter 的 @PostConstruct 裡用 @Autowired 注入的 Bean 來設定初始值，確認執行順序是正確的（注入先完成，然後才執行 @PostConstruct）。

有問題嗎？
-->
