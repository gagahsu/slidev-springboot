---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring AOP 簡介
routeAlias: ch10
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
    Spring AOP 簡介
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「把重複的邏輯抽出來，讓切面統一處理」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十章！

前幾章我們學的 IoC、DI、@Value，都是 Spring 的「物件管理」機制。今天要介紹的是另一個 Spring 核心功能：AOP，切面導向程式設計。

AOP 解決的是一個很實際的痛點：當很多方法都需要做「同一件額外的事」時，要怎麼避免到處複製貼上同樣的程式碼。今天先建立概念，下一章再學怎麼用 @Aspect 實作。
-->

---
layout: default
---

# Outline

- **什麼是 Spring AOP？** — 從重複程式碼的問題切入，理解 AOP 要解決什麼
- **Spring AOP 的定義** — 核心概念、適合場景、與 OOP 的關係
- **章節總結** — 掌握 AOP 的核心思維

<!--
今天這章比較輕鬆，以概念理解為主，不會有複雜的程式碼。

重點只有一個：搞清楚「AOP 是用來解決什麼問題的」。有了這個直覺，下一章學 @Aspect 的時候就會很自然地理解它的設計邏輯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 什麼是 Spring AOP？

<!--
在解釋 AOP 是什麼之前，我們先來看一個很常見的開發痛點，感受一下「沒有 AOP 的世界」是什麼樣子。
-->

---

# 情境：想要知道每個方法跑了多久

假設 `HpPrinter` 有 `print()` 方法，我們想量它的執行時間：

```java
public void print(String message) {
    long before = System.currentTimeMillis();
    System.out.println("HP印表機: " + message);
    long after = System.currentTimeMillis();
    System.out.println("花費時間: " + (after - before) + "ms");
}
```

量時間的邏輯（第 1、3、4 行）和真正的業務邏輯（第 2 行）混在一起了。

<!--
這個情境很常見：你想知道某個方法執行要花多久，所以在方法開始前記錄時間，結束後計算差值輸出。

但是你有沒有發現一個問題？這個方法本來只需要做一件事——印東西，但現在充斥了「計時」的程式碼，讀起來很混亂。

更大的問題是：如果 HpPrinter 還有 printColor()、printDouble() 等方法，而且每個都要計時，那怎麼辦？
-->

---

# 問題：重複邏輯蔓延到每個方法

如果 `HpPrinter` 有多個方法，且每個都要計時：

| 方法 | 需要加的「計時程式碼」 |
| --- | --- |
| `print()` | 開始計時 → 業務邏輯 → 結束計時 → 輸出 |
| `printColor()` | 開始計時 → 業務邏輯 → 結束計時 → 輸出 |
| `printDouble()` | 開始計時 → 業務邏輯 → 結束計時 → 輸出 |

每個方法都要複製貼上同樣的計時程式碼，造成：

- **可讀性差**：業務邏輯和計時邏輯混在一起
- **難以維護**：想改計時格式，要改 N 個地方
- **違反 DRY 原則**：Don't Repeat Yourself

<!--
現在問題擴大了。如果有 10 個方法都要計時，你要在 10 個方法裡各自複製貼上計時程式碼。

這就違反了 DRY 原則——Don't Repeat Yourself，不要重複自己。

更麻煩的是：有一天你想把輸出格式改成「執行時間: X ms」，就要去改 10 個地方，而且很容易漏改。

這個問題不只是計時，log 記錄、權限驗證、例外處理，都有同樣的模式：同一段邏輯，需要加在很多個方法上。

AOP 就是為了解決這個問題而生的。
-->

---

# AOP 的解法：把重複邏輯抽到「切面」

AOP 的思路：不要在每個方法裡寫計時邏輯，**把計時邏輯單獨抽出來**，讓它「橫貫」所有需要的方法：

| 做法 | 計時邏輯放在哪裡 | 業務邏輯方法怎麼改 |
| --- | --- | --- |
| **傳統做法** | 每個方法內部 | 方法裡到處都有計時程式碼 |
| **AOP 做法** | 獨立的「切面」中 | 方法本身**完全不用改** |

切面就像一把「橫切」過去的刀，在所有目標方法的「前後」自動插入共用邏輯。

<!--
AOP 的解法很優雅：把計時邏輯獨立出去，放在一個叫做「切面（Aspect）」的地方。

切面就像是一個「隱形的包裝」，在每個目標方法執行前自動記錄開始時間，執行後自動計算並輸出結果。被包裝的方法本身完全不知道這件事，也不需要任何修改。

「橫切」這個比喻很形象：你有很多個方法（垂直排列），切面就像一把橫刀切過去，在切點的前後各做一件事。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# Spring AOP 的定義

<!--
了解了 AOP 要解決什麼問題，我們來看它的正式定義和核心概念。
-->

---

# 什麼是 Spring AOP？

**AOP** 全名是 **Aspect-Oriented Programming**，中文叫做**切面導向程式設計**。

| 概念 | 說明 |
| --- | --- |
| **Aspect（切面）** | 存放共用邏輯的地方，例如計時、log、權限驗證 |
| **橫切（Cross-Cutting）** | 切面的邏輯「橫跨」多個方法，統一處理 |
| **目標方法不用改** | 業務邏輯方法完全不需要知道切面的存在 |

「透過切面，**統一地去處理方法之間的共同邏輯**。」

<!--
AOP，Aspect-Oriented Programming，切面導向程式設計。

名字很長，但核心只有一句話：「把方法之間的共同邏輯，抽到切面裡統一處理。」

Aspect 就是「切面」，它是一個獨立的類別，裡面放的是那些「到處都要用的邏輯」——計時、寫 log、驗證登入狀態等等。

「橫切」是 AOP 最重要的特性：切面的邏輯不是寫在某一個方法裡，而是橫跨過去，在所有目標方法的執行前後自動發生。
-->

---

# Spring AOP 的適合場景

AOP 最適合處理「多個方法都需要的共用邏輯」：

| 場景 | 說明 |
| --- | --- |
| **Log 記錄** | 記錄每個方法的呼叫時間、參數、回傳值 |
| **執行時間量測** | 量測方法執行耗時，找出效能瓶頸 |
| **權限驗證** | 在執行業務邏輯前，先確認使用者是否有權限 |
| **例外處理** | 統一攔截並記錄例外，而不是在每個方法都寫 try-catch |
| **交易管理** | 在方法開始前開啟交易，結束後提交或回滾 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>判斷原則：</b> 如果一段邏輯需要在很多方法上重複出現，就是 AOP 的好候選。
</div>

<!--
AOP 的適用場景有一個共同的特徵：這些邏輯不是某個方法「自己」的功能，而是「旁邊要做的事」。

Log 記錄、計時、權限驗證，這些跟業務邏輯沒有直接關係，但幾乎每個方法都需要。用 AOP 抽出來，每個方法就只需要專注在自己的核心功能。

在 Spring Boot 裡，@Transactional 就是 AOP 的實際應用——它會在方法執行前開始資料庫交易，方法結束後根據結果提交或回滾，完全不需要你在方法裡寫任何交易管理的程式碼。
-->

---

# AOP 與 OOP 的關係

AOP 不是要取代 OOP，而是用來**補充**它：

| 特性 | OOP（物件導向） | AOP（切面導向） |
| --- | --- | --- |
| **關注點** | 將問題拆分成物件和類別 | 將「橫跨多個類別的共同邏輯」抽出來 |
| **組織方式** | 繼承、封裝、多型 | 切面橫切多個物件 |
| **適合處理** | 業務邏輯 | Log、計時、權限等「非業務邏輯」 |

「OOP 處理業務核心，AOP 處理業務周邊——兩者相輔相成。」

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> Spring AOP 的底層是透過 Java 動態代理（Dynamic Proxy）實作的，但我們平常用 <code>@Aspect</code> 時不需要知道這些細節。
</div>

<!--
很多人第一次聽到 AOP 的時候會擔心：「這是不是要取代 OOP？我之前學的物件導向還有用嗎？」

完全不用擔心！AOP 不是取代 OOP，而是補充它。

OOP 很擅長把業務邏輯組織成清晰的類別和方法；但對於那些「到處都要用、跟業務無關的邏輯」，OOP 沒有很好的解法——你只能繼承或複製貼上。

AOP 就是來解決這個 OOP 的盲點的：用切面把這些「橫跨性的邏輯」統一管理，讓 OOP 的類別保持乾淨。

兩者搭配使用，程式碼才能真正做到高內聚、低耦合。
-->

---

# 章節總結

- **AOP（切面導向程式設計）**：透過切面，統一處理多個方法之間的共同邏輯
- **解決的問題**：避免計時、log、權限驗證等邏輯在每個方法裡重複出現
- **核心特性**：切面「橫切」過多個方法，目標方法本身完全不需要修改
- **適合場景**：Log 記錄、執行時間量測、權限驗證、例外處理、交易管理
- **與 OOP 的關係**：互補，不是取代——OOP 處理業務邏輯，AOP 處理業務周邊

下一章我們會介紹 `@Aspect`、`@Before`、`@After`、`@Around`，學習如何在 Spring Boot 中實際寫出一個切面。

<!--
好，今天的概念章到這裡。

AOP 的核心思維只有一句話：「把重複出現在多個方法裡的共同邏輯，抽到切面裡統一管理。」

今天我們只是建立直覺，還沒有寫任何 AOP 的程式碼。下一章我們會學 @Aspect、@Before、@After、@Around，那時候你就能真正寫出一個可以自動計時的切面了。

有問題嗎？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天理解了 AOP 要解決什麼問題，以及它的核心概念。

如果現在覺得有點抽象，沒關係——AOP 是一個「看到程式碼才會真正理解」的概念，下一章實作完 @Aspect 之後，你對今天說的這些會有更清晰的感受。

有問題嗎？
-->
