---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring IoC 簡介
routeAlias: ch04
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
    Spring IoC 簡介
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「把物件的控制權交給 Spring，讓它幫我們管理」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第四章！

上一章我們成功寫出了第一個 Spring Boot 程式，讓瀏覽器顯示出 Hello World。今天我們要開始進入 Spring 框架最核心的概念之一——IoC，也就是控制反轉。

聽起來很抽象？不用擔心，我們今天會用一個你一定見過的東西——印表機，來幫你完全理解這個概念。學完這章，你就會知道為什麼 Spring 這麼受歡迎了！
-->

---
layout: default
---

# Outline

- **什麼是 IoC？** — 從傳統寫法的問題切入，理解「控制反轉」的意義
- **Spring IoC 的定義** — Spring 容器扮演的角色，以及 IoC 寫法的程式碼對比
- **Spring IoC 的優點** — 鬆耦合、生命週期管理、方便測試
- **章節總結** — 掌握本章三個核心觀念

<!--
今天的章節結構很清楚，分成三個部分。

我們先從「為什麼需要 IoC」開始，從傳統寫法的問題切入；接著說明 Spring IoC 的定義與 Spring 容器的角色；最後整理它帶來的三個主要優點。

學完這章之後，你就能回答「IoC 是什麼、它解決了什麼問題、為什麼要用它」這三個問題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 什麼是 IoC？

<!--
在解釋 IoC 是什麼之前，我們先來看看「沒有 IoC 的世界」是什麼樣子。

先感受問題，再理解解法，這樣對 IoC 的印象會更深刻。
-->

---

# 情境：老師需要一台印表機

假設有一位老師，他想要印講義，所以他「自己買了一台 HP 印表機」放在辦公桌上。

| 角色 | 說明 |
| --- | --- |
| `Teacher`（老師） | 需要印講義的人 |
| `HpPrinter`（HP 印表機） | 提供列印功能的工具 |
| `Printer`（印表機介面） | 定義印表機必須有的能力 |

用傳統 Java 寫法，老師自己決定要買哪台印表機：

```java
public class Teacher {
    private Printer printer = new HpPrinter(); // 自己決定、自己購買

    public void teach() {
        printer.print("I'm a teacher");
    }
}
```

<!--
我們先來看一個貼近生活的場景。

假設你是一位老師，你需要一台印表機來印講義。傳統的做法是：你自己去買一台 HP 印表機，放在辦公桌上，只要你想印東西，就用這台印表機。

看這段程式碼，Teacher 類別裡面直接寫了 `new HpPrinter()`，也就是老師自己決定、自己購買、自己管理這台印表機。

這樣的設計聽起來很自然，但仔細想想，會有什麼問題呢？
-->

---

# 傳統寫法的問題：換印表機要改程式碼

如果有一天 HP 印表機壞了，老師想換成 Canon，就**必須修改 Teacher 的程式碼**：

```java
// 原本：HP 印表機
private Printer printer = new HpPrinter();

// 換成：Canon 印表機（要改程式碼！）
private Printer printer = new CanonPrinter();
```

這就是**緊耦合（Tight Coupling）**的問題：`Teacher` 和 `HpPrinter` 綁死了。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>思考一下：</b> 如果有 100 個類別都用了 HpPrinter，換成 Canon 要改幾個地方？
</div>

<!--
問題來了！

假設 HP 印表機壞了，老師想換成 Canon 的，他必須打開 Teacher.java，把 new HpPrinter() 改成 new CanonPrinter()。

在小專案可能還好，但想像一下：公司裡有 100 個類別都用了 HpPrinter，換成 Canon 的時候，你要去改 100 個地方！而且萬一哪個地方忘了改，就會出現一半用 HP、一半用 Canon 的混亂狀況。

這種設計就叫做「緊耦合」——類別之間的關聯性太強，一個改動就牽動其他所有地方。

所以我們需要一種更好的設計方式，這就是 IoC 出場的時機。
-->

---

# 什麼是 IoC？

**IoC** 全名是 **Inversion of Control**，中文叫做**控制反轉**。

| 概念 | 說明 |
| --- | --- |
| **控制** | 物件的控制權——誰來決定要建立哪個物件 |
| **反轉** | 把這個控制權「從類別本身」反轉交給「外部容器」 |
| **傳統方式** | `Teacher` 自己控制：`new HpPrinter()` |
| **IoC 方式** | 由外部的 **Spring 容器**統一管理，`Teacher` 不用自己 new |

「IoC 的核心概念，就是將物件的控制權，**交給外部的 Spring 容器來管理**。」

<!--
IoC，Inversion of Control，控制反轉。

「控制」指的是物件的控制權——誰來決定要建立哪個物件、什麼時候建立、用完怎麼銷毀。

「反轉」指的是這個控制權原本在 Teacher 手上（Teacher 自己 new HpPrinter），現在把它「反轉」出去，交給 Spring 容器來處理。

記住這句話：「IoC 的核心概念，就是將物件的控制權，交給外部的 Spring 容器來管理。」這是整個 Spring 框架最重要的設計哲學。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# Spring IoC 的定義

<!--
了解了「為什麼需要 IoC」之後，我們來看看 Spring 是怎麼實作這個概念的。

Spring 有一個東西叫做「Spring 容器」，它就是那個負責統一管理物件的角色。
-->

---

# Spring 容器的角色

Spring 就像公司的「行政部門」，它預先準備好印表機，放在儲藏室（Spring 容器）：

| 問題 | 傳統寫法 | IoC 寫法 |
| --- | --- | --- |
| 誰負責建立印表機？ | `Teacher` 自己 `new` | **Spring 容器**自動建立 |
| 誰管理印表機？ | 每個類別各自管 | **Spring 容器**統一管 |
| 換印表機要改哪裡？ | 每個用到的類別 | **只改 Spring 設定** |

比喻：「Spring 預先買好印表機，放在『Spring 容器』裡，誰想要印東西，就去跟 Spring 借。」

<!--
用公司的場景來理解就很清楚了。

想像公司有個行政部門，他們統一採購所有印表機，放在儲藏室。如果今天換成 Canon，只有行政部門要處理，每個人的工作方式不需要改。

這就是 Spring 容器做的事：它統一管理所有物件（在 Spring 裡稱為 Bean），誰需要就來借，不需要自己 new，也不需要自己管。

這樣一來，換印表機（換實作類別）只需要改 Spring 的設定，所有使用者的程式碼都不用動。
-->

---

# Spring IoC — 基礎程式碼

以下是 `Printer` 介面與 `HpPrinter` 的完整宣告：

```java
public interface Printer {
    void print(String message);
}
public class HpPrinter implements Printer {
    public void print(String message) {
        System.out.println("HP印表機: " + message);
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>多型概念：</b> 底層是 <code>HpPrinter</code>，但我們用 <code>Printer</code> 介面型別來接它。未來換成 <code>CanonPrinter</code>，使用方的程式碼不需要改動。
</div>

<!--
我們先建立一個 Printer 介面，讓 HpPrinter 和 CanonPrinter 都實作它。

這裡用到的是 Java 多型的概念：底層是 HpPrinter，但我們用 Printer 型別來接它。這樣未來要換成 CanonPrinter，Teacher 那邊根本感覺不到差異。

如果多型的概念有點模糊也沒關係，後面使用 @Autowired 的時候你會更清楚地看到它的威力。

記住這個設計原則：「依賴介面，不依賴實作」，這正是鬆耦合的核心。
-->

---

# Spring IoC — Teacher 不再自己 new

| 寫法 | Teacher 程式碼 | 說明 |
| --- | --- | --- |
| 傳統 | `private Printer printer = new HpPrinter();` | 自己決定、自己建立 |
| IoC | `private Printer printer;` | 只宣告需求，由 Spring 注入 |

使用 IoC 寫法，`Teacher` 只需宣告「我需要一個 Printer」，由 Spring 容器決定要提供哪一個：

```java
public class Teacher {
    private Printer printer; // 不自己 new，等 Spring 來注入

    public void teach() {
        printer.print("I'm a teacher");
    }
}
```

<!--
這就是 IoC 寫法的核心差異。

Teacher 不再自己 new HpPrinter()，而是宣告「我需要一個 Printer」，至於 Spring 要給我哪一台，由 Spring 決定。

執行後，console 會顯示 "HP印表機: I'm a teacher"，但 Teacher 完全不知道也不在乎這是 HP 還是 Canon——它只知道有一台可以用的印表機。

⚠️ 大家要注意：這裡的 printer 欄位只是宣告，你現在先不用管 Spring 怎麼把值注入進去。下一章我們會用 @Component 和 @Autowired 來完成這件事，那時候程式碼就能真正跑起來了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# Spring IoC 的優點

<!--
知道 IoC 是什麼之後，我們來系統地整理它帶來的好處。

Spring IoC 有三個主要優點，每一個都直接解決了傳統寫法的痛點。
-->

---

# Spring IoC 的三大優點

| 優點 | 說明 |
| --- | --- |
| **1. 鬆耦合（Loose Coupling）** | 各類別不再緊密依賴具體實作，換實作只需改 Spring 設定 |
| **2. 生命週期管理** | Spring 統一負責 Bean 的建立、初始化與銷毀 |
| **3. 方便測試** | 測試時可用 Mock 物件替換 Spring 容器中的真實物件 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>最重要的優點：</b> 鬆耦合是 IoC 最核心的價值，它讓程式碼更容易維護與擴展。
</div>

<!--
IoC 帶來三個主要優點，我們一個一個來看。

第一個是鬆耦合，這是最重要的優點，也是我們剛才用印表機例子說明的那個概念。

第二個是生命週期管理，Spring 幫你管理 Bean 從建立到銷毀的整個過程，你不需要手動處理。

第三個是方便測試，當你要測試 Teacher 類別時，不需要真的去準備一台 HP 印表機，可以用一個假的 MockPrinter 替換，讓測試更簡單。
-->

---

# 優點 1：鬆耦合（Loose Coupling）

傳統寫法中，`Teacher` 直接依賴 `HpPrinter`，換印表機就要改 Teacher 的程式碼：

```java
// 傳統寫法：緊耦合——Teacher 和 HpPrinter 綁死了
private Printer printer = new HpPrinter();

// IoC 寫法：鬆耦合——只依賴介面，不依賴具體實作
private Printer printer;
```

只要調整 Spring 的設定，就能從 HP 換成 Canon，`Teacher` 的程式碼完全不用動。

<!--
鬆耦合的意思是：Teacher 只知道「我需要一個能列印的東西（Printer）」，但不在意那個東西究竟是 HpPrinter 還是 CanonPrinter。

傳統寫法是 Teacher 直接 new HpPrinter()，這就把 Teacher 和 HpPrinter「綁死」了，這叫做緊耦合。

IoC 寫法則讓 Teacher 只依賴 Printer 這個介面，由 Spring 決定要注入哪個實作，這就是鬆耦合。

在實際工作中，鬆耦合讓你的程式碼更容易維護：需求改變時，只改 Spring 設定，不需要動到業務邏輯程式碼。
-->

---

# 優點 2：生命週期管理

| 階段 | 傳統寫法 | IoC 寫法（Spring 負責） |
| --- | --- | --- |
| **建立** | 開發者手動 `new` | Spring 容器自動建立 |
| **初始化** | 開發者自己呼叫初始化方法 | 可用 `@PostConstruct` 自動觸發 |
| **銷毀** | 容易忘記釋放資源 | Spring 容器統一管理銷毀 |

Spring 替我們管理 Bean 的整個生命週期，讓我們只需要專注在業務邏輯。

<!--
第二個優點是生命週期管理。

傳統寫法裡，你要自己 new 物件、自己呼叫初始化方法、用完後還要記得釋放資源。隨著專案變大，這些雜事越來越多。

Spring 幫你把這些都接管了。你只需要告訴 Spring「這個類別我要用」，Spring 就會在適當的時機幫你建立、初始化，最後在應用程式關閉時也會負責銷毀。

後面我們會學到 @PostConstruct，那就是 Spring 生命週期管理的一個具體應用。
-->

---

# 優點 3：方便測試

使用 IoC 後，測試時可以用 **Mock 物件**替換真實的 Bean：

| 情境 | 傳統寫法 | IoC 寫法 |
| --- | --- | --- |
| 單元測試 | 必須準備真實的 `HpPrinter` 物件 | 只需注入一個 `MockPrinter` |
| 測試隔離 | `Teacher` 和 `HpPrinter` 的測試互相干擾 | 各自獨立，互不影響 |
| 測試成本 | 高（可能需要硬體或外部資源） | 低（全部在 JVM 內完成） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> Mock 的概念在這裡先了解就好，測試的深入用法會在後面的章節介紹。
</div>

<!--
第三個優點是方便測試，這在企業開發中非常重要。

假設你要測試 Teacher 的 teach() 方法，但你又不想真的讓印表機動作（測試環境根本沒有印表機）。

用傳統寫法，Teacher 直接 new HpPrinter()，你沒辦法換掉它，測試只能真的用 HpPrinter。

但用 IoC 寫法，Teacher 只依賴 Printer 介面，測試時你可以讓 Spring 注入一個假的 MockPrinter，它不會真的印東西，只會假裝印了，讓你的測試可以通過。

這樣每個類別就可以獨立測試，不互相干擾，測試的品質和速度都會大幅提升。
-->

---

# 章節總結

- **IoC（控制反轉）**：將物件的控制權，從類別本身交給外部的 Spring 容器管理
- **Spring 容器**：預先建立並保管所有 Bean，誰需要就去借，不用自己 `new`
- **鬆耦合**：類別只依賴介面，不依賴具體實作，換實作只需改 Spring 設定
- **生命週期管理**：Spring 負責 Bean 的建立、初始化與銷毀
- **方便測試**：IoC 讓各類別可以獨立測試，用 Mock 物件替換真實依賴

下一章我們會介紹 IoC、DI 和 Bean 三者的關係，以及 Spring 是怎麼實際把物件注入進去的。

<!--
好，我們來整理今天學到的東西。

IoC 是 Spring 框架最重要的設計概念，它解決了傳統寫法中「緊耦合」的問題。記住這句話：「把物件的控制權交給 Spring 容器」。

今天我們只是概念介紹，還沒有真的寫出用 IoC 的完整 Spring Boot 程式。下一章我們會學 @Component 和 @Autowired，那時候你就能把印表機真的「交給 Spring 管」了。

大家今天的觀念建立得很好！有任何問題嗎？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天理解了 IoC 這個核心概念。

如果還覺得有點模糊也沒關係，IoC 是一個需要實際寫過程式之後才能完全領悟的概念。下一章我們用 @Component 和 @Autowired 來真正實作 IoC，你就會有那個「啊，原來是這樣」的感覺。

有問題的同學現在可以提問！
-->
