---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: IoC、DI、Bean 的介紹
routeAlias: ch05
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
    IoC、DI、Bean 的介紹
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「三個名詞，其實在說同一件事」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第五章！

上一章我們學了 IoC 的概念——把物件的控制權交給 Spring 容器管理。今天我們要把 IoC 周邊的兩個常見名詞也一起搞清楚：DI 和 Bean。

這三個名詞在 Spring 的文件、面試題、技術文章裡到處都會看到，今天把它們全部釐清，後面學習就不會被名詞搞混了。
-->

---
layout: default
---

# Outline

- **回顧：什麼是 IoC？** — 複習控制反轉的核心概念與印表機類比
- **什麼是 DI？** — 依賴注入的定義、生活類比、與 IoC 的關係
- **什麼是 Bean？** — Bean 的定義、與普通物件的差異
- **三者關係總覽** — IoC、DI、Bean 如何相互配合
- **章節總結** — 一張表說清楚三個名詞

<!--
今天的章節比較輕鬆，主要是概念釐清，沒有太多新的程式碼。

我們先快速回顧 IoC，然後把 DI 和 Bean 一起補齊。這三個概念合在一起才算是真正理解 Spring 的核心設計，後面不管學什麼功能，都是在這個基礎上延伸出去的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 回顧：什麼是 IoC？

<!--
我們先快速複習上一章的重點。

IoC 是今天所有內容的基礎，搞清楚 IoC 之後，DI 和 Bean 就很容易理解了。
-->

---

# 回顧：IoC 解決什麼問題？

沒有 IoC 的世界，`Teacher` 自己 `new` 印表機——換印表機就要改程式碼：

```java
public class Teacher {
    private Printer printer = new HpPrinter(); // 緊耦合

    public void teach() {
        printer.print("I'm a teacher");
    }
}
```

| 問題 | 傳統寫法的困境 |
| --- | --- |
| 換印表機品牌 | 必須修改 `Teacher` 程式碼 |
| 100 個類別都用了 `HpPrinter` | 要改 100 個地方 |
| 測試時不想用真印表機 | 沒辦法替換 |

<!--
快速複習一下上一章的核心問題。

傳統寫法是 Teacher 自己 new HpPrinter()，這讓 Teacher 和 HpPrinter 「綁死」了。換印表機要改程式碼，有多少個類別用到就要改多少個地方，這就是緊耦合的問題。

IoC 的解法是：把印表機的建立與管理，交給外部的 Spring 容器，Teacher 只需要說「我需要一台印表機」，由 Spring 決定給哪一台。
-->

---

# 回顧：IoC 的核心定義

| 名詞 | 說明 |
| --- | --- |
| **IoC** | Inversion of Control，控制反轉 |
| **控制** | 物件的控制權——誰來決定建立哪個物件 |
| **反轉** | 控制權從「類別本身」反轉給「外部的 Spring 容器」 |

「IoC 的核心概念，就是將物件的控制權，**交給外部的 Spring 容器來管理**。」

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Spring 容器就像公司的行政部門，預先採購好印表機放在儲藏室，誰需要就去借，不用自己買。
</div>

<!--
記住這個核心定義：「將物件的控制權，交給外部的 Spring 容器來管理。」

IoC 是一個設計概念，不是一個具體的 API 或 Annotation。Spring 框架的整個設計，都是圍繞著 IoC 這個概念建立起來的。

好，IoC 複習完了，接下來我們來看 DI。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 什麼是 DI？

<!--
IoC 說的是「控制權轉移」，但控制權轉移之後，Spring 容器要怎麼把物件給你用呢？

這個「把物件給你用」的動作，就是 DI——依賴注入。
-->

---

# 什麼是 DI？

**DI** 全名是 **Dependency Injection**，中文叫做**依賴注入**。

| 名詞 | 說明 |
| --- | --- |
| **Dependency（依賴）** | `Teacher` 需要 `Printer`，所以 `Teacher` 依賴 `Printer` |
| **Injection（注入）** | Spring 容器把 `HpPrinter` 放入 `Teacher` 裡面 |
| **DI** | Spring 容器主動把所需的物件注入給使用者 |

「DI 的定義，就是 Spring 容器把 `HpPrinter` 給**注入**到 `Teacher` 這個 class 裡面。」

<!--
我們來拆解 Dependency Injection 這個詞。

Dependency 是依賴——Teacher 想要印東西，它需要一個 Printer，所以說 Teacher 依賴 Printer。

Injection 是注入——Spring 容器把 Printer 的實例「注射」進 Teacher 裡面，讓 Teacher 能夠使用它。

合在一起：DI 就是「Spring 容器主動把所需的物件注入給使用者」。
-->

---

# DI 的生活類比：打針

想像你生病了，去診所打針：

| 角色 | 打針的比喻 | DI 的對應 |
| --- | --- | --- |
| 病人 | 你（需要藥物） | `Teacher`（需要 `Printer`） |
| 藥物 | 針筒裡的藥 | `HpPrinter` 物件 |
| 護理師 | 幫你打針的人 | **Spring 容器** |
| 打針的動作 | 把藥注射進你體內 | 把 `HpPrinter` 注入到 `Teacher` |

你不需要自己把藥「打進」自己身體——Spring 幫你做這件事。

<!--
用打針來理解 DI 非常直觀。

你生病了（你依賴藥物），但你不會自己幫自己打針（不會自己 new 物件）。護理師（Spring 容器）幫你把藥（HpPrinter）注射進你的身體（Teacher）。

整個過程，你只需要伸出手臂（宣告你需要 Printer），不需要管藥從哪裡來、怎麼調配——Spring 都幫你處理好了。

這個「注射」的動作，就是 Dependency Injection，依賴注入。
-->

---

# DI 的程式碼概念

使用 DI 之後，`Teacher` 不自己 `new`，Spring 負責把 `HpPrinter` 注入進來：

```java
public class Teacher {
    private Printer printer; // 我需要一個 Printer，Spring 幫我注入

    public void teach() {
        printer.print("I'm a teacher");
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 這裡的 <code>printer</code> 欄位還沒有指定哪個 Annotation，下一章我們會用 <code>@Autowired</code> 告訴 Spring 要在這個欄位執行注入。
</div>

<!--
這段程式碼跟上一章看到的一樣，Teacher 裡面只宣告 private Printer printer，沒有 new HpPrinter()。

Spring 容器在背後把 HpPrinter 的實例放進這個 printer 欄位裡——這個放入的動作就叫做「注入」。

你現在先有這個概念就好：Teacher 宣告需求，Spring 負責提供。下一章我們加上 @Autowired，程式就能真正跑起來了。
-->

---

# IoC 與 DI 的關係

| 概念 | 說明 | 角色 |
| --- | --- | --- |
| **IoC（控制反轉）** | 把物件的控制權交給 Spring 容器 | 設計哲學 |
| **DI（依賴注入）** | Spring 容器把所需物件注入給使用者 | 實踐手段 |

「只要有用到 **IoC 控制反轉**的地方，一定就要搭配 **DI 依賴注入**。」

兩者相輔相成：IoC 把控制權交出去，DI 再把物件注入回來。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶方式：</b> IoC 是「交出去」，DI 是「送回來」。Spring 先接管物件（IoC），再把物件給需要的人用（DI）。
</div>

<!--
IoC 和 DI 是捆綁在一起的概念，兩者缺一不可。

IoC 說的是「控制權轉移」——把 new 物件的責任交給 Spring 容器。但 Spring 接管了物件之後，怎麼讓 Teacher 使用到 Printer 呢？這就靠 DI。

DI 說的是「注入」——Spring 把管理好的物件注射進需要它的類別裡。

所以 IoC 是「交出去」，DI 是「送回來」，兩者合作才能讓整個機制運作。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 什麼是 Bean？

<!--
最後一個名詞：Bean。

這個名詞第一次看到的時候很讓人困惑——它跟咖啡豆有關係嗎？答案是沒有。Bean 其實是一個很簡單的概念，我們一起來看看。
-->

---

# 什麼是 Bean？

| 概念 | 說明 |
| --- | --- |
| **Bean** | 由 Spring 容器所管理的物件，我們賦予它一個新名字，叫做 Bean |
| **普通物件** | 開發者自己 `new` 出來的物件，Spring 不知道它的存在 |
| **Bean** | Spring 容器建立並管理的物件，Spring 知道它、管理它 |

「Bean 說穿了，其實就只是一個 **object（物件）** 而已。」

唯一的差別是：**誰來管理它**——是開發者自己，還是 Spring 容器。

<!--
Bean 這個名字聽起來很神秘，但其實它只是一個普通的 Java 物件。

唯一讓它「特別」的地方，是它的管理者是 Spring 容器，而不是開發者自己。

就好像同一台印表機，放在你自己辦公桌上（普通物件），跟放在行政部門的儲藏室（Bean），本質上是同一台印表機，只是管理的人不同。
-->

---

# Bean vs 普通物件

| 比較項目 | 普通物件 | Bean |
| --- | --- | --- |
| 誰建立 | 開發者手動 `new` | Spring 容器自動建立 |
| 誰管理生命週期 | 開發者自己 | Spring 容器 |
| Spring 知道它嗎？ | 不知道 | 知道，並統一管理 |
| 可以被注入嗎？ | 不行 | 可以，DI 就是在注入 Bean |

```java
// 普通物件：Spring 不認識它
Printer printer = new HpPrinter();

// Bean：Spring 建立並管理，可以被注入到其他類別
// （下一章會用 @Component 告訴 Spring 要把它變成 Bean）
```

<!--
這張表格清楚說明了 Bean 和普通物件的差異。

左邊是你自己 new 出來的物件，Spring 不知道它的存在，也無法把它注入到其他類別。

右邊是 Bean，由 Spring 容器建立並管理，Spring 認識它、管理它的生命週期，也可以在需要的時候把它注入到其他類別。

所以，DI 注入的東西，本質上就是 Bean——Spring 管理的物件。

⚠️ 大家先有概念就好，下一章我們會學 @Component，它就是把普通類別宣告成 Bean 的 Annotation。
-->

---

# IoC、DI、Bean 三者關係總覽

| 名詞 | 中文 | 說明 | 比喻 |
| --- | --- | --- | --- |
| **IoC** | 控制反轉 | 把物件控制權交給 Spring 容器 | 行政部門統一採購印表機 |
| **DI** | 依賴注入 | Spring 把所需物件注入給使用者 | 行政部門把印表機送到你辦公桌 |
| **Bean** | — | Spring 容器管理的物件 | 儲藏室裡那台由行政管理的印表機 |

三者的合作流程：

1. `HpPrinter` 被交給 Spring 管理，成為一個 **Bean**（IoC）
2. `Teacher` 宣告「我需要一個 Printer」
3. Spring 把 `HpPrinter` 這個 Bean **注入**到 `Teacher`（DI）

<!--
我們用一張表把三個名詞整合起來。

IoC 說的是「控制權轉移」，DI 說的是「注入的動作」，Bean 說的是「被管理的物件」。

三者的合作流程：HpPrinter 被 Spring 接管成為 Bean（IoC），Teacher 需要 Printer，Spring 把 HpPrinter 這個 Bean 注入進去（DI）。

記住這個流程，後面不管學什麼 Annotation，都是在這個框架裡面運作的。
-->

---

# 章節總結

- **IoC（控制反轉）**：將物件的控制權交給 Spring 容器，不再自己 `new`
- **DI（依賴注入）**：Spring 容器把所需的物件注入到對應的類別中
- **IoC + DI**：相輔相成——IoC 把控制權「交出去」，DI 再把物件「送回來」
- **Bean**：由 Spring 容器所管理的物件，本質上就是一個普通 Java 物件
- **三者關係**：Spring 接管物件成為 Bean（IoC）→ 有人需要時注入（DI）

下一章我們會介紹 `@Component` 和 `@Autowired`，學會怎麼讓 Spring 真正接管物件，並把它注入到需要的地方。

<!--
好，我們來整理今天學到的三個名詞。

IoC、DI、Bean 其實都是在描述同一套機制的不同面向：IoC 是設計哲學，DI 是實踐手段，Bean 是被管理的對象。

今天我們都是在談概念，還沒有真正寫出讓 Spring 注入的程式碼。下一章加上 @Component 和 @Autowired，這個機制就真正活起來了！

有任何問題嗎？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天把 IoC、DI、Bean 這三個常見名詞都釐清了。

如果現在還有點模糊也沒關係，下一章實際加上 @Component 和 @Autowired 跑起程式碼之後，你就會有那個「啊，原來這就是 IoC 和 DI 的實際運作方式」的感覺。

有問題的同學現在可以提問！
-->
