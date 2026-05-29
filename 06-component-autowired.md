---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Bean 的創建和注入 — @Component、@Autowired
routeAlias: ch06
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
  <h1 style="color: #1a5c5c; font-size: 3rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Bean 的創建和注入
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「一個 Annotation 交出去，一個 Annotation 拿回來」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第六章！

上一章我們搞清楚了 IoC、DI、Bean 三個名詞的意義。今天我們要學的是兩個非常重要的 Annotation：@Component 和 @Autowired。

@Component 負責「把物件交給 Spring 管理」，@Autowired 負責「跟 Spring 借回來用」。這兩個 Annotation 幾乎每個 Spring Boot 專案都會用到，一定要熟悉。
-->

---
layout: default
---

# Outline

- **@Component — 創建 Bean** — 如何把一個類別交給 Spring 容器管理、Bean 的命名規則
- **@Autowired — 注入 Bean** — 如何讓 Spring 自動注入所需的 Bean、使用前提與匹配機制
- **完整實作練習** — 結合 Printer 介面、HpPrinter、MyController，從頭走一遍完整流程
- **章節總結** — 掌握兩個 Annotation 的核心用法

<!--
今天的章節直接進入實作，不會有太多純概念說明。

學完這章之後，你就能真正寫出一個使用 IoC 和 DI 的 Spring Boot 程式——不只是看懂，是自己能從零開始寫出來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 創建 Bean 的方法：@Component

<!--
第一個 Annotation：@Component。

它的功能很單純：告訴 Spring「這個類別請你幫我管理」，Spring 就會在啟動時把這個類別的實例建立起來，放進 Spring 容器裡，成為一個 Bean。
-->

---

# 什麼是 @Component？

| 項目 | 說明 |
| --- | --- |
| **用途** | 將一個類別標記為 Spring 容器管理的 Bean |
| **加在哪裡** | 加在 **class 宣告上方** |
| **Spring 的反應** | 啟動時自動建立該類別的實例，存入容器 |
| **效果** | 這個類別的物件可以被 `@Autowired` 注入到其他地方 |

「在 class 上面加上 `@Component`，就可以將這個 class 變成一個由 Spring 容器所管理的 Bean。」

<!--
@Component 就是 IoC 的實踐起點。

你在類別上加一行 @Component，Spring 就知道「這個物件我來管」。啟動應用程式時，Spring 會掃描所有帶有 @Component 的類別，幫你把物件建立好，存進容器裡。

之後任何人想用這個物件，就可以用 @Autowired 跟 Spring 借，不需要自己 new。
-->

---

# @Component — 程式碼範例

在 `HpPrinter` 上加上 `@Component`，它就成為 Spring 管理的 Bean：

```java
@Component
public class HpPrinter implements Printer {

    @Override
    public void print(String message) {
        System.out.println("HP印表機: " + message);
    }
}
```

Spring 啟動時，會自動建立 `HpPrinter` 的實例，存入 Spring 容器，等待被注入。

<!--
非常簡單——只加一行 @Component，其他程式碼完全不用動。

Spring Boot 啟動的時候，它會自動掃描整個 package，找到所有加了 @Component 的類別，幫你建立物件實例，放進容器裡。

注意這裡繼承了 Printer 介面，這是讓 @Autowired 能用型別匹配找到它的關鍵，後面會說明。
-->

---

# Bean 的命名規則

Spring 建立 Bean 之後，會幫它取一個預設的名字：

| 類別名稱 | Bean 名稱（預設） |
| --- | --- |
| `HpPrinter` | `hpPrinter` |
| `CanonPrinter` | `canonPrinter` |
| `MyController` | `myController` |
| `UserService` | `userService` |

規則：「Bean 的名字，會是**類別名稱的第一個字母轉成小寫**。」

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> 後面學到 <code>@Qualifier</code> 時，這個 Bean 名字會派上用場，讓你指定要注入哪一個特定的 Bean。
</div>

<!--
Spring 幫 Bean 取名字的規則很簡單：把類別名稱的第一個字母轉成小寫。

HpPrinter → hpPrinter，UserService → userService，以此類推。

現在你先記住這個規則就好。下一章學 @Qualifier 的時候，你需要用到 Bean 的名字來指定要注入哪一個，到時候就知道為什麼要了解這個規則了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 注入 Bean 的方法：@Autowired

<!--
Bean 已經存進 Spring 容器了，現在要怎麼把它拿出來用？

這就是 @Autowired 的工作：它告訴 Spring「這個欄位請你幫我注入對應的 Bean」。
-->

---

# 什麼是 @Autowired？

| 項目 | 說明 |
| --- | --- |
| **用途** | 讓 Spring 自動找到對應的 Bean，注入到欄位中 |
| **加在哪裡** | 加在**欄位（field）宣告上方** |
| **Spring 的反應** | 在容器中找到型別匹配的 Bean，注入到該欄位 |
| **結果** | 欄位不再是 `null`，可以直接使用 |

「在變數上面加上 `@Autowired`，就可以將 Spring 容器中的 Bean 給注入進來。」

<!--
@Autowired 就是 DI 依賴注入的實踐手段。

你在欄位上加一行 @Autowired，Spring 就知道「這個欄位需要一個 Bean，我來幫你找並注入」。Spring 啟動後，注入完成，你就可以直接用這個欄位，不需要自己 new。

注意：Spring 是找「型別匹配」的 Bean，不是找名稱匹配，下面會說明。
-->

---

# @Autowired 的兩個前提條件

使用 `@Autowired` 之前，必須確認以下兩件事：

| 前提 | 說明 |
| --- | --- |
| **1. 使用者本身也要是 Bean** | 加了 `@Autowired` 的類別，自己也必須是 Spring 管理的 Bean（例如加了 `@Component` 或 `@RestController`） |
| **2. 要注入的東西也要是 Bean** | `@Autowired` 只能注入 Spring 容器中的 Bean，不能注入普通物件 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶方式：</b> 雙方都要是 Bean，Spring 才能完成注入。借書要兩個人都在圖書館，才借得到。
</div>

<!--
這兩個前提很重要，忘記任何一個都會出錯。

第一個前提：如果 MyController 想用 @Autowired 注入 Printer，那 MyController 自己也要是 Bean。MyController 加了 @RestController，這個 Annotation 本身就會讓 MyController 成為 Bean，所以第一個前提已經滿足了。

第二個前提：要注入的 HpPrinter 也要是 Bean，也就是它要加了 @Component。如果 HpPrinter 忘了加 @Component，Spring 找不到對應的 Bean，就會報錯。

⚠️ 最常見的錯誤：忘了在 HpPrinter 上加 @Component，結果 Spring 說「沒有 Printer 型別的 Bean 可以注入」。
-->

---

# @Autowired 的匹配機制

Spring 注入時，是根據**變數的型別**來尋找對應的 Bean：

| 欄位宣告 | Spring 的搜尋邏輯 |
| --- | --- |
| `private Printer printer` | 找容器中型別是 `Printer` 或其子類別的 Bean |
| `HpPrinter` 實作了 `Printer` | 型別匹配成功，注入 `HpPrinter` 的 Bean |
| `CanonPrinter` 也實作了 `Printer` | 若同時存在兩個，Spring 會報錯（下一章解決） |

底層是透過 **Java 多型**（`HpPrinter` 可向上轉型為 `Printer`）讓型別匹配成立。

<!--
@Autowired 是根據型別來找 Bean，不是根據變數名稱。

欄位宣告是 `private Printer printer`，Spring 就去容器裡找「型別是 Printer，或者實作了 Printer 介面的 Bean」。HpPrinter 實作了 Printer 介面，向上轉型為 Printer 型別，所以匹配成功，注入進來。

但如果容器裡同時有 HpPrinter 和 CanonPrinter，Spring 就不知道該注入哪一個，會報錯。這個問題的解法是 @Qualifier，下一章我們會學到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 在 Spring Boot 中練習
# @Component 和 @Autowired 的用法

<!--
概念說完了，我們來實際走一遍完整的程式碼流程。

這是今天最重要的部分：把 Printer 介面、HpPrinter、MyController 合在一起，跑出「HP印表機: Hello World」這個結果。
-->

---

# 完整範例 — Step 1：Printer 介面

定義 `Printer` 介面，讓 `HpPrinter` 和未來的其他印表機都實作它：

```java
package com.example.demo;

public interface Printer {
    void print(String message);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼用介面？</b> <code>@Autowired</code> 宣告 <code>Printer</code> 型別，而不是 <code>HpPrinter</code> 型別。未來換成 Canon 只需改 Spring 設定，Controller 不用動——這就是鬆耦合的實踐。
</div>

<!--
我們先建立 Printer 這個介面。

介面本身不加 @Component，因為介面不能被實例化，Spring 沒辦法直接管理它。我們管理的是實作了介面的 HpPrinter。

為什麼要用介面？因為之後 @Autowired 宣告的型別是 Printer，不是 HpPrinter，這樣可以讓 MyController 和具體的印表機型號解耦。換印表機只改 Spring 設定，Controller 完全不用動。
-->

---

# 完整範例 — Step 2：HpPrinter 加 @Component

在 `HpPrinter` 上加上 `@Component`，讓它成為 Spring 管理的 Bean：

```java
package com.example.demo;

import org.springframework.stereotype.Component;

@Component
public class HpPrinter implements Printer {
    @Override
    public void print(String message) {
        System.out.println("HP印表機: " + message);
    }
}
```

Spring 啟動後，會自動建立名為 `hpPrinter` 的 Bean，存入容器。

<!--
加上 @Component，這個動作就是在對 Spring 說：「嘿，HpPrinter 請你幫我管理！」

需要 import org.springframework.stereotype.Component，記得讓 IDE 自動幫你補 import。

Spring 啟動後，會掃描到 HpPrinter，建立一個實例，取名 hpPrinter，放進容器。等一下 MyController 說「我需要 Printer 型別的 Bean」，Spring 就會把這個 hpPrinter 注入進去。
-->

---

# 完整範例 — Step 3：MyController 加 @Autowired

在 `MyController` 的 `printer` 欄位上加 `@Autowired`，Spring 會自動注入 `HpPrinter`：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {
    @Autowired
    private Printer printer;
}
```

<!--
MyController 上面的 @RestController 本身就會讓它成為 Bean，所以第一個前提已經滿足了。

在 printer 欄位上加 @Autowired，Spring 看到這個欄位型別是 Printer，就去容器找「Printer 型別或其子類別的 Bean」，找到 hpPrinter，把它注入進來。

注入完成之後，printer 欄位就不再是 null，可以直接呼叫 printer.print() 了。
-->

---

# 完整範例 — Step 3：MyController 完整程式碼

```java
@RestController
public class MyController {
    @Autowired
    private Printer printer;
    @RequestMapping("/test")
    public String test() {
        printer.print("Hello World");
        return "Hello World";
    }
}
```

瀏覽器存取 `http://localhost:8080/test`，console 輸出：

```
HP印表機: Hello World
```

<!--
這就是完整的 MyController。

注意 @Autowired 的 printer 欄位直接被 test() 方法使用，因為 Spring 在 MyController 初始化的時候就已經把 HpPrinter 注入進去了，所以 printer 不是 null。

執行後，你在 Eclipse Console 會看到 "HP印表機: Hello World"，這代表整個 IoC + DI 的流程已經成功跑起來了！

⚠️ 提醒：如果忘了在 HpPrinter 加 @Component，Spring 找不到 Printer 型別的 Bean，啟動就會失敗，console 會看到 NoSuchBeanDefinitionException。
-->

---

# Spring Boot 啟動流程

啟動應用程式後，Spring 在背後做了以下幾件事：

| 步驟 | Spring 做的事 |
| --- | --- |
| **① 元件掃描** | 掃描 `com.example.demo` 及其子 package，找到所有 `@Component`、`@RestController` 等 |
| **② 建立 Bean** | 建立 `HpPrinter` 實例（名稱：`hpPrinter`），存入容器 |
| **③ 初始化 Bean** | 建立 `MyController` 實例，發現其中有 `@Autowired` 欄位 |
| **④ 注入依賴** | 從容器中找到 `Printer` 型別的 Bean（`hpPrinter`），注入到 `printer` 欄位 |

<!--
讓我們看看啟動後 Spring 在背後做了哪些事。

Spring Boot 啟動的時候，會從 DemoApplication 所在的 package 開始，往下掃描所有帶有特定 Annotation 的類別。

找到 @Component → 建立 Bean 存入容器；找到 @RestController → 也建立 Bean，並且檢查裡面有沒有 @Autowired → 有的話就去容器找對應型別的 Bean 注入進去。

整個流程 Spring 幫我們自動完成，我們只需要加對 Annotation，剩下的交給 Spring。
-->

---

# 章節總結

- **@Component**：加在 class 上方，將該類別交給 Spring 容器管理，成為 Bean
- **Bean 命名規則**：預設名稱為類別名稱第一個字母轉小寫（`HpPrinter` → `hpPrinter`）
- **@Autowired**：加在欄位上方，Spring 自動從容器找到型別匹配的 Bean 並注入
- **兩個前提**：使用 `@Autowired` 的類別本身要是 Bean，被注入的物件也要是 Bean
- **匹配機制**：根據**變數的型別**尋找 Bean，底層是 Java 多型向上轉型

下一章我們會介紹 `@Qualifier`，解決「同一型別有多個 Bean 時，要注入哪一個」的問題。

<!--
我們來整理今天學到的東西。

@Component 和 @Autowired 是 Spring Boot 最常用的兩個 Annotation，幾乎每個專案都會用到。

@Component 是「存進去」——把物件交給 Spring 管。@Autowired 是「拿回來」——讓 Spring 把 Bean 注入進欄位。兩者搭配，就是 IoC + DI 的完整實踐。

大家今天可以回去練習：建立一個 CanonPrinter，加上 @Component，然後把 @Component 從 HpPrinter 移掉，看看 MyController 的 printer 會不會自動切換成 Canon 的輸出——這樣就能體會到鬆耦合的威力了！
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天學會了 @Component 和 @Autowired，已經能寫出一個真正使用 IoC 和 DI 的 Spring Boot 程式了。

如果有遇到 NoSuchBeanDefinitionException 的錯誤，通常是忘了在某個類別加 @Component，或者 @Autowired 的欄位型別找不到對應的 Bean，仔細檢查一下就能解決。

有問題的同學現在可以提問！
-->
