---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 指定注入的 Bean — @Qualifier
routeAlias: ch07
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
    指定注入的 Bean
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「當倉庫有兩台印表機，要告訴 Spring 拿哪一台」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第七章！

上一章我們學了 @Component 和 @Autowired，已經能讓 Spring 幫我們管理和注入 Bean。

但有個問題：如果倉庫裡同時有兩台印表機——一台 HP、一台 Canon，@Autowired 要注入哪一台？Spring 這時候會直接報錯，因為它不知道你要哪台。今天我們要學 @Qualifier，用來解決這個問題。
-->

---
layout: default
---

# Outline

- **@Autowired + @Qualifier** — 同型別多個 Bean 的問題、@Qualifier 定義與用法、欄位注入完整實作
- **@Qualifier + 建構子注入** — 建構子注入時 @Qualifier 要寫在哪裡
- **Lombok + @Qualifier** — @RequiredArgsConstructor 簡化建構子、安裝流程、lombok.config 設定
- **章節總結** — 掌握 @Qualifier 在三種寫法下的用法

<!--
今天的章節分三個部分：先用上一章熟悉的欄位注入學 @Qualifier 的基本用法；再看建構子注入時 @Qualifier 要寫在哪裡；最後介紹 Lombok，把建構子注入簡化到極致，並處理 Lombok 和 @Qualifier 搭配的設定。

重點只有一個：「同型別有多個 Bean 時，用 @Qualifier 指定你要哪一個。」三種寫法只是位置不同。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# @Autowired + @Qualifier

<!--
先快速複習 @Autowired 的運作方式，再帶出它無法處理的情境，然後學 @Qualifier 的解法。
-->

---

# 回顧：@Autowired 的匹配機制

| 步驟 | 說明 |
| --- | --- |
| **① 型別篩選** | 根據欄位宣告的型別（如 `Printer`），找到所有符合的 Bean |
| **② 注入** | 找到唯一一個符合型別的 Bean，注入到欄位中 |
| **❌ 衝突** | 若符合型別的 Bean 有兩個以上，Spring 不知道選哪個，**直接報錯** |

`@Autowired` 只根據**型別**找 Bean。型別唯一時沒問題，但同型別有多個 Bean 時就失效了。

<!--
複習一下：@Autowired 的運作方式是根據欄位的型別去容器裡找 Bean。

如果欄位宣告是 `private Printer printer`，Spring 就找「Printer 型別或實作了 Printer 介面的 Bean」。

當容器裡只有一個 Printer Bean（HpPrinter），一切正常。但如果同時存在 HpPrinter 和 CanonPrinter 兩個 Bean，Spring 就不知道要注入哪一個，啟動就會失敗。

下一頁我們就來看這個報錯的實際場景。
-->

---


# 問題：兩個同型別 Bean，@Autowired 報錯

當 `HpPrinter` 和 `CanonPrinter` 都加了 `@Component`，容器裡同時存在兩個 `Printer` Bean：

```java
@RestController
public class MyController {
    @Autowired
    private Printer printer; // Spring 不知道該注入哪一個！
}
```

Spring 啟動時拋出錯誤：

```
required a single bean, but 2 were found
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>解法：</b> 用 <code>@Qualifier</code> 明確告訴 Spring「我要名字叫做 XXX 的那個 Bean」。
</div>

<!--
這是一個非常實際的錯誤場景。

想像你在 Spring Boot 應用程式裡新增了 CanonPrinter，並且加了 @Component，讓它也成為 Bean。這時候容器裡同時有 hpPrinter 和 canonPrinter 兩個 Bean，型別都是 Printer。

MyController 的 @Autowired 說「我要一個 Printer」，Spring 左看右看，看到兩個都符合，不知道選哪個，啟動失敗，丟出 "required a single bean, but 2 were found" 的錯誤。

看到這個錯誤訊息，第一個想到的解法就是 @Qualifier。
-->

---

# 什麼是 @Qualifier？

| 項目 | 說明 |
| --- | --- |
| **用途** | 在多個同型別 Bean 中，指定要注入哪一個 |
| **加在哪裡** | 加在 `@Autowired` **下方**，與它搭配使用 |
| **指定方式** | 填入 Bean 的名稱（預設為類別名稱首字母小寫） |
| **效果** | Spring 注入時，只取名稱符合的那個 Bean |

「`@Qualifier` 的作用，就是**指定要注入的 Bean 的名字**。」

<!--
@Qualifier 非常直覺：括號裡填你想要的 Bean 名稱，Spring 就會去容器裡找那個特定的 Bean 注入進來。

Bean 名稱的規則我們上一章學過：類別名稱的第一個字母轉小寫。HpPrinter 的 Bean 名稱是 hpPrinter，CanonPrinter 的是 canonPrinter。

所以要指定 Canon，就寫 @Qualifier("canonPrinter")。
-->

---

# 使用 @Qualifier 的注意事項

| 注意事項 | 說明 |
| --- | --- |
| **必須搭配 @Autowired** | `@Qualifier` 無法單獨使用，一定要和 `@Autowired` 一起出現 |
| **指定的是 Bean 名稱，不是類別名稱** | `@Qualifier("canonPrinter")` 填的是 Bean 名稱（首字母小寫），不是 `"CanonPrinter"` |
| **名稱要完全吻合** | Bean 名稱拼錯，Spring 找不到，啟動失敗 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> 把 Bean 名稱的首字母寫成大寫——<code>@Qualifier("CanonPrinter")</code> 是錯的，正確是 <code>@Qualifier("canonPrinter")</code>。
</div>

<!--
@Qualifier 有三個需要注意的地方，我一個一個說。

第一：它不能單獨使用，一定要和 @Autowired 一起出現，寫在 @Autowired 的下一行。

第二：括號裡填的是 Bean 名稱，不是類別名稱。Bean 名稱是首字母小寫的版本，所以 CanonPrinter 的 Bean 名稱是 canonPrinter。

第三：名稱要完全一樣。如果你填了 "canonprinter"（全小寫），或者 "CanonPrinter"（首字母大寫），Spring 都找不到，啟動就會失敗。

⚠️ 首字母大寫是最常見的錯誤，一定要記住。
-->

---

# @Qualifier 雙層篩選機制

Spring 注入時，`@Autowired` 和 `@Qualifier` 形成雙層篩選：

| 層次 | Annotation | 篩選條件 |
| --- | --- | --- |
| **第一層** | `@Autowired` | 根據**變數型別**找出所有符合的 Bean 候選 |
| **第二層** | `@Qualifier` | 從候選中，根據**Bean 名稱**找出唯一一個 |
| **結果** | — | 注入名稱符合的那個 Bean |

先用型別縮小範圍，再用名稱精確定位。

<!--
@Autowired 和 @Qualifier 的運作是兩個步驟串聯的。

第一步：@Autowired 根據型別（Printer），找到容器裡所有 Printer 型別的 Bean——這時候 hpPrinter 和 canonPrinter 都是候選。

第二步：@Qualifier("canonPrinter") 再從這些候選裡，找名稱是 "canonPrinter" 的那個——這樣就精確找到了 CanonPrinter。

兩層過濾，先廣後窄，精確命中。
-->

---

# 完整範例 — Step 1：兩個 Printer Bean

讓 `HpPrinter` 和 `CanonPrinter` 都加上 `@Component`，Spring 容器裡就同時有兩個 `Printer` Bean：

| 類別 | Bean 名稱 | console 輸出 |
| --- | --- | --- |
| `HpPrinter` | `hpPrinter` | `HP印表機: Hello World` |
| `CanonPrinter` | `canonPrinter` | `Canon印表機: Hello World` |

加上 `@Qualifier` 之前，若直接用 `@Autowired`，Spring 啟動就會報錯。

<!--
Step 1 要做的事很簡單：讓兩個類別都成為 Bean。

HpPrinter 我們上一章已經加了 @Component，所以現在只需要再建立 CanonPrinter 並加上 @Component，這樣容器裡就同時有兩個 Printer Bean。

這時候還沒有 @Qualifier，所以先不要啟動程式，等等加上 @Qualifier 再啟動。
-->

---

# 完整範例 — Step 1：CanonPrinter 程式碼

新增 `CanonPrinter`，加上 `@Component` 讓它成為 Bean：

```java
import org.springframework.stereotype.Component;

@Component
public class CanonPrinter implements Printer {
    @Override
    public void print(String message) {
        System.out.println("Canon印表機: " + message);
    }
}
```

`HpPrinter` 同樣保留 `@Component`，兩者同時存在於容器中。

<!--
CanonPrinter 的結構和 HpPrinter 幾乎一樣，差別只在 println 的輸出文字。

加上 @Component 之後，Spring 啟動時就會同時建立 hpPrinter 和 canonPrinter 兩個 Bean，放進容器裡。

現在容器裡同時有兩個 Printer 型別的 Bean，等一下我們要用 @Qualifier 告訴 Spring「我要 canonPrinter 這個」。
-->

---

# 完整範例 — Step 2：@Qualifier 指定 Bean

在 `@Autowired` 下方加上 `@Qualifier("canonPrinter")`，指定注入哪一個 Bean：

| Annotation | 位置 | 說明 |
| --- | --- | --- |
| `@Autowired` | 欄位上方 | 找所有 `Printer` 型別的 Bean |
| `@Qualifier("canonPrinter")` | `@Autowired` 下方 | 從候選中指定名稱為 `canonPrinter` 的那個 |

```java
@Autowired
@Qualifier("canonPrinter")
private Printer printer;
```

<!--
只要在 @Autowired 下方加一行 @Qualifier，問題就解決了。

括號裡填 "canonPrinter"——注意首字母小寫，這是 CanonPrinter 的 Bean 名稱。

Spring 看到這兩個 Annotation 一起出現，就知道：先用型別找候選，再用名稱選定一個，不會再因為候選太多而報錯了。
-->

---

# 完整範例 — MyController 完整程式碼

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {
    @Autowired
    @Qualifier("canonPrinter")
    private Printer printer;

    @RequestMapping("/test")
    public String test() {
        printer.print("Hello World");
        return "Hello World";
    }
}
```

<!--
這是完整的 MyController，包含兩個 import：@Autowired 和 @Qualifier 都在 org.springframework.beans.factory.annotation 這個 package 裡。

讓 IDE 自動幫你補 import 即可，不需要背 package 路徑。

加上 @Qualifier 之後，Spring 就能精確找到 canonPrinter 這個 Bean 注入進來，不再報錯。
-->

---

# 執行結果

啟動成功後，瀏覽器存取 `http://localhost:8080/test`，console 輸出：

```
Canon印表機: Hello World
```

若把 `@Qualifier("canonPrinter")` 改成 `@Qualifier("hpPrinter")`，console 改輸出：

```
HP印表機: Hello World
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>體驗鬆耦合：</b> 只改 <code>@Qualifier</code> 裡的名稱，<code>MyController</code> 的其他程式碼完全不用動——這就是 IoC 設計的好處。
</div>

<!--
執行結果很直觀：@Qualifier("canonPrinter") 就會輸出 Canon，改成 @Qualifier("hpPrinter") 就會輸出 HP。

特別注意 Callout 裡說的這件事：切換印表機只改 @Qualifier 裡的一個字串，MyController 的業務邏輯程式碼完全不用動。

這就是我們學了這麼多章 IoC 和 DI 的原因——讓程式碼的各個部分彼此獨立，修改一個地方不會牽動其他地方。

欄位注入搭配 @Qualifier 學會了。但上一章補充過：官方建議用建構子注入——那 @Qualifier 要寫在哪裡？進入 Part 2。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# @Qualifier + 建構子注入

<!--
上一章補充過，Spring 官方建議用建構子注入。那用建構子注入時，@Qualifier 要寫在哪裡？這個 Part 就講這件事。
-->

---

# 建構子注入時，@Qualifier 寫在參數前

建構子注入時，Spring 看的是**建構子參數**——`@Qualifier` 要加在**參數前面**：

```java
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MyController {

    private final Printer printer;

    public MyController(@Qualifier("canonPrinter") Printer printer) {
        this.printer = printer;
    }
}
```

<!--
建構子注入的 @Qualifier 寫法：直接放在建構子參數的前面，跟參數同一行。

注意這裡不需要 @Autowired——上一章補充過，只有一個建構子時 @Autowired 可以省略，所以只要在參數前加 @Qualifier 就好。

那為什麼欄位注入和建構子注入的 @Qualifier 位置不一樣？下一頁對照說明。
-->

---

# 為什麼位置不一樣？

`@Qualifier` 要放在「Spring **做注入決策**的位置」：

| 注入方式 | Spring 看哪裡決定注入 | `@Qualifier` 的位置 |
| --- | --- | --- |
| **欄位注入** | 欄位 | 欄位上方，`@Autowired` 下面一行 |
| **建構子注入** | 建構子的**每一個參數** | **建構子參數前面**，與參數同一行 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> 用建構子注入，卻把 <code>@Qualifier</code> 寫在欄位上——Spring 根本不會看那裡，同型別兩個 Bean 照樣報錯。
</div>

<!--
為什麼位置不一樣？因為 Spring 決定「要注入什麼」的時候，看的地方不一樣。欄位注入時 Spring 看的是欄位，所以 @Qualifier 加在欄位上；建構子注入時 Spring 看的是建構子的每一個參數，所以 @Qualifier 要加在參數前面。

常見錯誤：用建構子注入，卻把 @Qualifier 寫在欄位上——Spring 根本不會看那裡，同型別兩個 Bean 照樣報錯。記住原則：@Qualifier 要放在「Spring 做注入決策的位置」。

多個依賴也一樣，每個參數可以各自加自己的 @Qualifier，下一頁看範例。
-->

---

# 多個依賴各自指定 @Qualifier

每個建構子參數都可以獨立指定要注入的 Bean：

```java
@RestController
public class MyController {

    private final Printer mainPrinter;
    private final Printer backupPrinter;

    public MyController(@Qualifier("canonPrinter") Printer mainPrinter,
                        @Qualifier("hpPrinter") Printer backupPrinter) {
        this.mainPrinter = mainPrinter;
        this.backupPrinter = backupPrinter;
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 這個例子同時注入了<b>兩個同型別的 Bean</b>——欄位注入做不到這麼直觀，建構子注入的參數各自獨立，一目了然。
</div>

<!--
建構子注入還有一個欄位注入比不上的地方：同型別的多個 Bean 可以同時注入，而且每個參數各自指定。

這個例子裡，MyController 同時要一台主要印表機和一台備用印表機，兩個都是 Printer 型別。主要的用 @Qualifier("canonPrinter")，備用的用 @Qualifier("hpPrinter")，各自標清楚，Spring 就能分別注入正確的 Bean。

不過大家應該也發現了：建構子注入的樣板程式碼不少——欄位宣告、建構子參數、指派，每個依賴要寫三個地方。Part 3 我們就來看怎麼用 Lombok 把這些樣板全部省掉。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# Lombok + @Qualifier

<!--
最後一個 Part：用 Lombok 把建構子注入簡化到極致，並解決 Lombok 和 @Qualifier 搭配時的一個經典問題。
-->

---

# 用 Lombok 簡化建構子注入

**Lombok** 會在編譯時自動生成樣板程式碼。`@RequiredArgsConstructor` 自動為所有 `final` 欄位生成建構子：

```java
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MyController {

    private final Printer printer;

    // 不用寫建構子！Lombok 編譯時自動生成
}
```

實務上 Spring Boot 專案最常見的組合：`private final` 欄位 + `@RequiredArgsConstructor`。

<!--
Lombok 是 Java 圈非常流行的工具，它的原理是在「編譯的時候」自動幫你生成程式碼——你看不到建構子，但編譯出來的 class 檔裡面有。

@RequiredArgsConstructor 的意思是「為所有 final 欄位生成一個建構子」。搭配建構子注入剛剛好：你只要宣告 private final 欄位，加一個 @RequiredArgsConstructor，建構子完全不用寫，新增依賴時也只要加一行欄位宣告。上一章補充的多依賴範例，用了 Lombok 之後建構子那一大段就全部消失了。

這就是為什麼實務上的 Spring Boot 專案，最常見的組合就是「private final 欄位 + @RequiredArgsConstructor」。

Lombok 生成建構子的 Annotation 其實有三個，下一頁對照。
-->

---

# Lombok 的三個建構子 Annotation

| Annotation | 效果 |
| --- | --- |
| `@RequiredArgsConstructor` | 為所有 `final` 欄位生成建構子（**建構子注入最常用**） |
| `@AllArgsConstructor` | 為**所有**欄位生成建構子 |
| `@NoArgsConstructor` | 生成無參數建構子 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>先記一個就好：</b> 建構子注入用 <code>@RequiredArgsConstructor</code>。另外兩個之後學 JPA Entity 時會用到。
</div>

<!--
Lombok 生成建構子的 Annotation 有三兄弟，差別在「幫哪些欄位生成」。

@RequiredArgsConstructor：只針對 final 欄位——這正是建構子注入要的，因為依賴都宣告成 private final。

@AllArgsConstructor：所有欄位都放進建構子參數，不管有沒有 final。

@NoArgsConstructor：生成一個空的無參數建構子。

現階段先記 @RequiredArgsConstructor 就好，另外兩個之後學 JPA Entity 的時候會再遇到——JPA 規定 Entity 要有無參數建構子，到時候 @NoArgsConstructor 就派上用場了。

不過 Lombok 不是 Spring 內建的，要另外安裝，接下來看安裝流程。
-->

---

# Lombok 安裝 — Step 1 加入依賴

在 `build.gradle` 的 `dependencies` 區塊加入兩行（Spring Boot 已管理版本，不用填版本號）：

```groovy
dependencies {
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

（測試程式也要用 Lombok 的話，另加 `testCompileOnly` 與 `testAnnotationProcessor` 兩行）

| 設定 | 作用 |
| --- | --- |
| `compileOnly` | 編譯時看得到 Lombok 的 Annotation，但**不打包**進最終的 jar |
| `annotationProcessor` | 讓 Gradle 編譯時**執行** Lombok，實際生成建構子等程式碼 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>兩行缺一不可：</b> 只加 <code>compileOnly</code> 不會報錯，但建構子<b>不會被生成</b>，執行時才發現找不到方法。
</div>

<!--
Lombok 安裝分三個步驟：加依賴、Gradle Refresh、IDE 支援，這頁先講第一步。

在 build.gradle 加兩行：compileOnly 和 annotationProcessor，都指向 org.projectlombok:lombok。Spring Boot 的 dependency management 已經幫你決定好版本，所以不用寫版本號。

為什麼要兩行？作用不一樣。compileOnly 是讓編譯器「看得懂」@RequiredArgsConstructor 這些 Annotation，而且因為 Lombok 只在編譯期有用，執行期不需要，所以不打包進 jar，讓最終產物更乾淨。annotationProcessor 才是真正「幹活」的那行——它讓 Gradle 在編譯時執行 Lombok，把建構子、getter 這些程式碼真正生成出來。

最容易踩的坑：只加了 compileOnly。這樣編譯不會報錯，Annotation 也認得，但程式碼根本沒被生成，等到執行的時候才爆出找不到建構子。所以記住：兩行一組，缺一不可。

如果你的測試程式（src/test）也要用 Lombok，再加 testCompileOnly 和 testAnnotationProcessor 兩行。

依賴加好之後，第二步——Refresh，下一頁。
-->

---

# Lombok 安裝 — Step 2 Gradle Refresh

改完 `build.gradle`，**檔案本身不會觸發下載**——必須 Refresh，讓 Gradle 重新讀取設定、下載 Lombok：

| 位置 | 操作 |
| --- | --- |
| **IntelliJ IDEA** | 點擊編輯器右上角出現的 Gradle 大象圖示（**Load Gradle Changes**），或 Gradle 面板 → Reload All Gradle Projects |
| **Eclipse / STS** | 專案按右鍵 → Gradle → **Refresh Gradle Project** |
| **VS Code** | 存檔時右下角跳出提示 → 點擊同步，或 Gradle 面板 → Reload |
| **命令列** | `./gradlew build --refresh-dependencies` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>沒做這步的症狀：</b> <code>import lombok.RequiredArgsConstructor;</code> 直接紅字「找不到 package」——依賴根本還沒下載，跟 Lombok 本身無關。
</div>

<!--
第二步：Refresh。這是新手最常忘記的動作。

很多人以為 build.gradle 存檔就生效了——不是。改檔案只是改了一份文字，要讓 Gradle 重新讀取設定、真正把 Lombok 從網路上抓下來，必須手動觸發 Refresh。

IntelliJ 最方便：你一改 build.gradle，編輯器右上角就會跳出一隻大象圖示，點它就是 Load Gradle Changes。Eclipse 是專案右鍵 → Gradle → Refresh Gradle Project。命令列派的可以跑 gradlew build --refresh-dependencies。

怎麼知道自己忘了 Refresh？症狀很明確：import lombok 那行直接紅字說「找不到 package」。這跟下一頁要講的 IDE 支援問題不一樣——連 package 都找不到，代表依賴根本沒下載；如果 import 沒問題但建構子紅字，才是 IDE 支援的問題。

Refresh 完成之後，第三步——IDE 支援，下一頁。
-->

---

# Lombok 安裝 — Step 3 IDE 支援

Lombok 在**編譯期**才生成程式碼，IDE 打字當下看不到 → 需另外讓 IDE 認得，否則滿屏紅字：

| IDE | 安裝方式 |
| --- | --- |
| **IntelliJ IDEA** | 2020.3 之後**內建** Lombok plugin，通常不用裝；確認 Settings → Build, Execution, Deployment → Compiler → Annotation Processors → 勾選 **Enable annotation processing** |
| **Eclipse / STS** | 到 [projectlombok.org/download](https://projectlombok.org/download) 下載 `lombok.jar` → 執行 `java -jar lombok.jar` → 安裝程式自動偵測 Eclipse 位置 → Install → **重啟 Eclipse** |
| **VS Code** | 新版 Extension Pack for Java **已內建**支援，通常不用另外裝 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見狀況：</b> 依賴加了但 IDE 一片紅字（找不到建構子／getter）→ 通常是 <b>IDE 支援沒裝</b>或<b>沒重啟</b>。<code>gradlew build</code> 會過，只是 IDE 看不懂。
</div>

<!--
第三步：IDE 支援。

為什麼需要這一步？因為 Lombok 是「編譯的時候」才生成程式碼，你在 IDE 裡打字的當下，那些建構子和方法根本還不存在，IDE 看不到就會顯示紅字錯誤——但其實編譯是會過的。所以要讓 IDE 也學會「看懂」Lombok。

IntelliJ 新版已經內建 plugin，通常裝好就能用，只要確認 Annotation Processors 的設定有打開。

Eclipse 比較麻煩：去官網下載 lombok.jar，用 java -jar 執行它，這是一個安裝程式，會自動偵測你電腦上的 Eclipse 位置，按 Install，然後一定要重啟 Eclipse 才會生效。

最常見的狀況：build.gradle 加了、gradlew build 也會過，但 IDE 滿屏紅字——九成是 IDE 支援沒裝好或忘了重啟。判斷方式很簡單：命令列編譯過但 IDE 報錯，就是 IDE 的問題，不是程式碼的問題。

安裝完成之後，還有一個實務上建議加的設定檔：lombok.config，下一頁。
-->

---

# lombok.config 設定

在**專案根目錄**（與 `build.gradle` 同層）建立 `lombok.config`：

```properties
config.stopBubbling = true
lombok.copyableAnnotations += org.springframework.beans.factory.annotation.Qualifier
```

| 設定 | 作用 |
| --- | --- |
| `config.stopBubbling = true` | 宣告「設定到此為止」——Lombok 不再往上層目錄找其他 `lombok.config`，確保專案設定獨立、可預期 |
| `lombok.copyableAnnotations += ...Qualifier` | 生成建構子時，把欄位上的 `@Qualifier` **一併複製到建構子參數上** |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼需要第二行？</b> Part 2 學過：<code>@Qualifier</code> 要放在<b>建構子參數</b>上才對 Spring 生效。沒有這行，Lombok 生成的建構子參數不會帶 <code>@Qualifier</code>，同型別多個 Bean 時照樣報錯。
</div>

<!--
Lombok 裝好之後，建議在專案根目錄加一個 lombok.config 設定檔，跟 build.gradle 放同一層。

第一行 config.stopBubbling = true：Lombok 找設定檔的方式是從目前目錄一路往上層目錄找，把找到的全部合併。加這行等於告訴它「到這裡為止，不要再往上找了」，避免被電腦上其他目錄的設定檔影響，讓專案設定獨立、行為可預期。每個專案的 lombok.config 第一行都建議加這個。

第二行是重點，而且直接扣回 Part 2 學的東西：lombok.copyableAnnotations += @Qualifier 的完整類別名稱。意思是「Lombok 生成建構子的時候，如果欄位上有 @Qualifier，請把它複製到建構子參數上」。

為什麼需要這個？Part 2 才講過：建構子注入時，Spring 是看「建構子參數」來決定要注入什麼。用了 Lombok 之後建構子是自動生成的，你只能把 @Qualifier 寫在欄位上——但 Lombok 預設生成的建構子參數是「乾淨的」，不帶任何 Annotation。Spring 看到參數上沒有 @Qualifier，同型別有兩個 Bean 時照樣不知道選哪個，照樣報錯。加了這行，@Qualifier 會被複製過去，問題解決。

下一頁看實際搭配的範例。
-->

---

# @RequiredArgsConstructor 搭配 @Qualifier

設定好 `lombok.config` 後，`@Qualifier` 直接寫在 `final` 欄位上即可：

```java
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class MyController {

    @Qualifier("canonPrinter")
    private final Printer printer;
}
```

<!--
這頁把 Lombok 和 @Qualifier 串起來。

寫法：@RequiredArgsConstructor 負責生成建構子，@Qualifier 寫在 final 欄位上。建構子不用寫，@Autowired 也不用寫，整個類別非常乾淨。

那 Lombok 實際生成出來的建構子長什麼樣？下一頁看。
-->

---

# Lombok 生成的建構子

因為 `lombok.config` 設了 `copyableAnnotations`，`@Qualifier` 被複製到參數上，生成的建構子等同於：

```java
public MyController(@Qualifier("canonPrinter") Printer printer) {
    this.printer = printer;
}
```

跟 Part 2 手寫的建構子**一模一樣**——Spring 能正確找到 `canonPrinter`。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>沒設 <code>copyableAnnotations</code> 的話：</b> 生成的建構子參數不帶 <code>@Qualifier</code>，啟動時照樣拋 <code>required a single bean, but 2 were found</code>。
</div>

<!--
因為 lombok.config 有設 copyableAnnotations，Lombok 生成建構子時會把 @Qualifier 複製到參數上——生成的程式碼就等同於這段，跟 Part 2 我們手寫的建構子一模一樣：參數帶著 @Qualifier("canonPrinter")，Spring 就知道要注入哪一個 Bean。

如果忘了設 lombok.config，症狀是：程式碼看起來都對，@Qualifier 也寫了，但啟動照樣報 "required a single bean, but 2 were found"——因為 Spring 看的是建構子參數，而參數上根本沒有 @Qualifier。這是用 Lombok + 建構子注入時非常經典的坑。

到這裡，三種寫法都學完了：欄位注入、手寫建構子、Lombok。接下來做總結。
-->

---

# 章節總結

- **問題場景**：同型別有多個 Bean 時，Spring 不知道選哪個，啟動報錯 `required a single bean, but 2 were found`
- **@Qualifier**：填入 Bean 名稱（類別名稱首字母轉小寫），指定要注入哪一個；先型別篩選、再名稱定位
- **三種寫法的 @Qualifier 位置**：欄位注入 → `@Autowired` 下方｜建構子注入 → **建構子參數前**｜Lombok → `final` 欄位上＋`lombok.config` 設 `copyableAnnotations`
- **Lombok 安裝三步**：`build.gradle` 加 `compileOnly` + `annotationProcessor` → Gradle Refresh → IDE 支援
- **經典坑**：Lombok 忘設 `copyableAnnotations` → 生成的建構子參數不帶 `@Qualifier`，照樣報錯

下一章我們會介紹 `@PostConstruct`，學習如何在 Bean 建立完成後，自動執行初始化邏輯。

<!--
好，我們來整理今天學到的東西。

@Qualifier 解決的是「同型別有多個 Bean」的問題，核心用法一句話：填入 Bean 名稱，指定你要哪一個。

今天學了它在三種注入寫法下的位置：欄位注入放 @Autowired 下面；建構子注入放參數前面；用 Lombok 的話寫在 final 欄位上，但要記得 lombok.config 設 copyableAnnotations，不然不會生效。

記住幾個容易犯的錯：Bean 名稱首字母要小寫；@Qualifier 要放在 Spring 做注入決策的位置；Lombok 的 copyableAnnotations 忘了設是最隱蔽的坑。

下一章的 @PostConstruct 是另一個實用的 Annotation，讓你可以在 Bean 初始化的時候自動執行一些準備動作，比如讀取設定、建立連線等等。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天學會了 @Qualifier，知道在多個同型別 Bean 的情況下怎麼精確指定要注入哪一個。

課後練習建議：回去試試看自己建立兩個 Printer Bean，用 @Qualifier 切換看看，親眼確認輸出結果的改變——這樣印象最深刻。

有問題的同學現在可以提問！
-->
