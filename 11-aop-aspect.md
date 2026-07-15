---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring AOP 的用法 — @Aspect
routeAlias: ch11
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
    Spring AOP 的用法
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「@Aspect 讓切面概念真正跑起來」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十一章！

上一章我們建立了 AOP 的概念：把重複的邏輯抽到切面，讓目標方法不需要任何修改。今天我們要把這個概念真正跑起來，學習用 @Aspect、@Before、@After、@Around 實作一個切面。
-->

---
layout: default
---

# Outline

- **回顧：什麼是 Spring AOP？** — 快速複習切面的核心概念
- **build.gradle 依賴 + @Aspect** — 載入 AOP 功能、創建切面類別的方式
- **@Before** — 在目標方法執行前觸發，解讀切入點表達式
- **完整實作練習** — MyAspect + HpPrinter，跑出完整結果
- **@After、@Around** — 其他時機點用法與三者比較
- **補充一：切入點語法** — `execution(...)` 表達式的寫法規則
- **補充二：Spring AOP 的發展** — 現代 Spring Boot 的使用現況

<!--
今天的章節比較長，從設定到三種時機點都會學到。

最重要的是 @Before 和 @Around，這兩個在實際工作中最常用。@After 也要知道，但用得相對少一點。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回顧
# 什麼是 Spring AOP？

<!--
先快速複習上一章的核心，確認概念清楚之後再進入實作。
-->

---

# 回顧：AOP 解決什麼問題？

| 概念 | 說明 |
| --- | --- |
| **問題** | 計時、log、權限驗證等邏輯在每個方法裡重複出現 |
| **AOP 的解法** | 把這些共用邏輯抽到「切面（Aspect）」，讓切面橫切目標方法 |
| **目標方法** | 完全不需要修改，不知道切面的存在 |
| **切入點（Pointcut）** | 指定切面要作用在哪些方法上 |

「透過切面，統一處理方法之間的共同邏輯。」

<!--
複習一下：AOP 的核心思路是「把重複的邏輯抽出去，讓切面在適當的時機點自動插入執行」。

今天我們要學的 @Before、@After、@Around，就是用來指定「切面在什麼時機點插入」的 Annotation。

複習完了，直接進入實作。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 在 build.gradle 中載入 Spring AOP 的功能

<!--
在用 @Aspect 之前，要先在 build.gradle 裡加一個依賴，讓 Spring Boot 載入 AOP 的功能。
-->

---

# build.gradle — 加入 AOP 依賴

在 `build.gradle` 的 `dependencies` 區塊中加入：

```groovy
implementation 'org.springframework.boot:spring-boot-starter-aspectj'
```

| 項目 | 說明 |
| --- | --- |
| **為什麼要加** | Spring AOP 功能不在預設的 Spring Web 依賴裡，需要額外載入 |
| **加完後** | 可以使用 `@Aspect`、`@Before`、`@After`、`@Around` 等 Annotation |
| **不用指定版本** | Spring Boot Gradle Plugin 已管理版本號 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 修改 build.gradle 後，必須在 Eclipse 右鍵專案 → <code>Gradle</code> → <code>Refresh Gradle Project</code>，才會下載依賴並生效。
</div>

<!--
使用 AOP 的第一步就是加這個依賴。

和其他 Spring Boot Starter 一樣，不需要指定版本號，Spring Boot 的 Gradle Plugin 已經幫我們管好了。

加完之後記得讓 IDE 重新載入 Gradle（Refresh Gradle Project），才能在程式碼裡使用 AOP 的 Annotation。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 創建切面的方法：@Aspect

<!--
依賴加好了，現在來建立切面類別。
-->

---

# @Aspect — 創建切面類別

| 項目 | 說明 |
| --- | --- |
| **@Aspect** | 標記這個類別是一個切面，包含橫切邏輯 |
| **@Component** | 讓這個切面類別成為 Spring 管理的 Bean |
| **為什麼兩個都要加** | 「只有 Bean 才能成為切面」——@Aspect 本身不會讓類別成為 Bean，需要搭配 @Component |

```java
@Aspect
@Component
public class MyAspect {
    // 切面邏輯寫在這裡
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> 只加 <code>@Aspect</code> 忘了加 <code>@Component</code>，切面不會生效，Spring 不會管理它。
</div>

<!--
創建切面類別有兩個 Annotation 都要加：@Aspect 和 @Component。

@Aspect 告訴 Spring「這個類別是一個切面」，但它不會讓這個類別成為 Bean。

要讓切面生效，這個切面類別本身也必須是 Bean，所以要加 @Component。

記住這個規則：「只有 Bean 才能成為切面」。沒有 @Component，切面就只是一個普通的 Java 類別，Spring 完全不知道它的存在，切面邏輯不會執行。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 在切入點方法「執行前」執行切面：@Before

<!--
切面類別建好了，現在要在裡面定義「什麼時候執行什麼邏輯」。

@Before 是最常用的時機點：在目標方法執行前，先執行切面裡的方法。
-->

---

# @Before — 定義

| 項目 | 說明 |
| --- | --- |
| **用途** | 在目標方法**執行前**，自動觸發切面的指定方法 |
| **加在哪裡** | 加在切面類別的方法上方 |
| **參數** | 切入點表達式（`execution(...)`），指定要攔截哪些方法 |
| **執行順序** | 切面方法先執行 → 目標方法才執行 |

「在 `@Before` 的方法裡寫的邏輯，會在每次目標方法被呼叫前，自動被 Spring 執行。」

<!--
@Before 就像是在目標方法前面放了一個「關卡」，每次有人要呼叫目標方法，就要先過這個關卡。

你在 @Before 方法裡寫的邏輯，Spring 會在每次目標方法被呼叫前，自動幫你執行。目標方法本身完全不知道這件事。

這就是 AOP「透明插入」的特性——被攔截的方法沒有任何改動。
-->

---

# @Before — 程式碼範例

```java
@Aspect
@Component
public class MyAspect {

    @Before("execution(* com.example.demo.HpPrinter.*(..))")
    public void before() {
        System.out.println("I'm before");
    }
}
```

每次 `HpPrinter` 的任何方法被呼叫前，`before()` 就會自動執行。

<!--
看這個完整的切面程式碼。

MyAspect 上面加了 @Aspect 和 @Component。

before() 方法上面加了 @Before，括號裡是切入點表達式，告訴 Spring「攔截 HpPrinter 下的所有方法」。

每次有人呼叫 HpPrinter 的 print() 方法，Spring 就會先自動呼叫 MyAspect 的 before() 方法，在 console 印出 "I'm before"，然後才讓 HpPrinter.print() 執行。

下一張我們來解讀 @Before 裡那串切入點表達式的意思。
-->

---

# 解讀切入點表達式

`@Before("execution(* com.example.demo.HpPrinter.*(..))")` 的拆解：

| 部分 | 意義 |
| --- | --- |
| `execution(...)` | 觸發時機：在方法**執行**時 |
| 第一個 `*` | 任何**回傳型別**（`void`、`String` 等都符合） |
| `com.example.demo.HpPrinter` | 目標**類別**的完整路徑 |
| `.*` | 該類別的**任何方法**（`*` 是萬用字元） |
| `(..)` | 任何**參數**（不論參數個數與型別） |

完整念法：「攔截 `com.example.demo.HpPrinter` 類別下，任何回傳型別、任何參數的所有方法。」

<!--
切入點表達式是 AOP 裡最難讀的部分，我們把它拆開來看就清楚了。

execution 是固定的，代表「在方法執行的時候觸發」。

第一個星號代表任何回傳型別，這樣不管方法回傳 void 還是 String，都會被攔截。

接著是目標類別的完整路徑。注意這裡要寫完整的 package 路徑，不能只寫 HpPrinter。

.*(..) 代表這個類別的所有方法、所有參數。

把這五個部分組合起來，就是「攔截這個類別下所有方法的所有呼叫」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 在 Spring Boot 中練習 @Aspect 和 @Before

<!--
概念說完了，我們來實際跑一次完整的流程，確認 @Before 切面真的生效。
-->

---

# 完整範例 — HpPrinter

確認 `HpPrinter` 有 `@Component`，print() 就是我們要攔截的目標方法：

```java
@Component
public class HpPrinter implements Printer {
    @Override
    public void print(String message) {
        System.out.println("HP印表機: " + message);
    }
}
```

`HpPrinter` 本身**完全不需要任何修改**，切面在外部攔截它的方法。

<!--
這就是 AOP 最重要的特性：HpPrinter 完全沒有變化，一行程式碼都沒改，但切面卻能在它的方法執行前後插入邏輯。

如果今天要取消計時功能，只需要把 MyAspect 的程式碼移除或停用，HpPrinter 完全不受影響。

這就是「解耦合」——業務邏輯和橫切邏輯彼此獨立。

接著看攔截它的 MyAspect 完整程式碼。
-->

---

# 完整範例 — MyAspect 攔截 print() 方法

`MyAspect` 用 `@Before` 攔截 `HpPrinter` 的 `print()` 方法：

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class MyAspect {

    @Before("execution(* com.example.demo.HpPrinter.print(..))")
    public void before() {
        System.out.println("I'm before");
    }
}
```

切入點表達式指定到 `print` 方法——只攔截 `print()`，不攔截 `HpPrinter` 的其他方法。

<!--
這是切面這一側的完整程式碼，包含三個 import：@Aspect 和 @Before 來自 org.aspectj.lang.annotation，@Component 來自 Spring。讓 IDE 自動補 import 即可。

注意這裡的切入點表達式和前面教學時的不一樣：前面用 .*(..) 攔截 HpPrinter 的「所有」方法，這裡改成 .print(..)，精確指定只攔截 print() 方法。這就是補充一會講到的「先精確、再放寬」的寫法。

程式碼結構複習一遍：類別上 @Aspect + @Component 兩個都要；before() 方法上加 @Before，括號裡是切入點表達式。

寫好之後啟動程式，下一頁看執行結果。
-->

---

# 完整範例 — MyAspect 執行結果

`MyAspect` 加上 `@Before`，存取 `http://localhost:8080/test` 後，console 輸出：

```
I'm before
HP印表機: Hello World
```

執行順序：Spring 攔截到 `HpPrinter.print()` 的呼叫 → 先執行 `MyAspect.before()` → 再執行 `HpPrinter.print()`。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>驗證方式：</b> 把 <code>@Component</code> 從 <code>MyAspect</code> 上移除，重啟後 "I'm before" 就不會出現——確認切面需要是 Bean 才生效。
</div>

<!--
執行結果很清楚地說明了執行順序：I'm before 先出現，然後才是 HP印表機: Hello World。

這就是 @Before 的效果——在目標方法執行前插入邏輯。

建議大家做一個小實驗：把 @Component 從 MyAspect 上移掉，重啟程式，看看 "I'm before" 有沒有出現。如果沒有，就確認了「切面必須是 Bean 才能生效」這個規則。

這種「動手驗證」的方式是學習 Spring 最有效的方法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 其他時機點的用法：@After、@Around

<!--
@Before 是在目標方法執行前插入，Spring AOP 還提供了另外兩種時機點：@After 和 @Around。
-->

---

# @After — 在方法執行後觸發

`@After` 在目標方法**執行後**自動觸發，用法和 `@Before` 完全對稱：

| 項目 | 說明 |
| --- | --- |
| **執行時機** | 目標方法執行**完畢後**（不論成功或例外） |
| **使用場景** | 執行後記錄 log、釋放資源、記錄結束時間 |

```java
@After("execution(* com.example.demo.HpPrinter.*(..))")
public void after() {
    System.out.println("I'm after");
}
```

<!--
@After 就是 @Before 的鏡像版本：目標方法執行完畢之後，自動觸發切面方法。

注意：不論目標方法是正常結束還是拋出例外，@After 都會執行——類似 Java 的 finally 區塊。

@Before 加上 @After，你就能在目標方法前後各加一個「鉤子」，例如計時就需要這樣：@Before 記錄開始時間，@After 記錄結束時間並計算差值。
-->

---

# @Around — 同時在方法執行前後觸發

`@Around` 是最強大的時機點，可以在方法執行前**和**後都插入邏輯：

```java
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;

@Around("execution(* com.example.demo.HpPrinter.*(..))")
public Object around(ProceedingJoinPoint pjp) throws Throwable {
    System.out.println("I'm around before");
    Object obj = pjp.proceed(); // 執行目標方法
    System.out.println("I'm around after");
    return obj;
}
```

<!--
@Around 比 @Before 和 @After 都強大，因為它完全「包住」目標方法的執行。

關鍵是 ProceedingJoinPoint 的 proceed() 方法——呼叫它才會真正執行目標方法。proceed() 前面的程式碼相當於 @Before，proceed() 後面的相當於 @After。

如果你在 @Around 方法裡不呼叫 proceed()，目標方法就不會執行！這是 @Around 和其他時機點最大的差別，也是它最強大的地方——你可以決定目標方法要不要執行。

回傳值要記得回傳 pjp.proceed() 的結果，否則 Controller 會拿不到方法的回傳值。
-->

---

# @Around — ProceedingJoinPoint 說明

| 項目 | 說明 |
| --- | --- |
| **ProceedingJoinPoint** | 代表被攔截的目標方法，由 Spring 自動傳入 |
| **pjp.proceed()** | 執行目標方法，回傳目標方法的回傳值 |
| **不呼叫 proceed()** | 目標方法不會執行（可用來實作攔截/阻止） |
| **方法簽名** | 必須宣告 `throws Throwable`，因為目標方法可能拋出任何例外 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>計時範例：</b> 在 <code>pjp.proceed()</code> 前記錄開始時間，呼叫後記錄結束時間，一個 <code>@Around</code> 就能同時取代 <code>@Before</code> 計時 + <code>@After</code> 計時。
</div>

<!--
ProceedingJoinPoint 是 @Around 獨有的參數，@Before 和 @After 的方法不需要這個參數。

最重要的是 proceed() 這個方法：呼叫它才會讓目標方法真正執行。你可以在 proceed() 前後各加任何邏輯，這樣就同時達到了 @Before 和 @After 的效果。

計時就是最典型的 @Around 使用場景：
```
long before = System.currentTimeMillis();
pjp.proceed();
long after = System.currentTimeMillis();
```
一個切面方法就解決了前後計時的需求。
-->

---

# 三種時機點比較

| Annotation | 執行時機 | 能決定目標方法是否執行？ | 典型用途 |
| --- | --- | --- | --- |
| **@Before** | 目標方法**執行前** | 否 | 前置驗證、記錄開始 |
| **@After** | 目標方法**執行後** | 否 | 後置清理、記錄結束 |
| **@Around** | 目標方法**前後** | **是**（需呼叫 `pjp.proceed()`） | 計時、快取、攔截 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選擇原則：</b> 只需要在執行前做事 → <code>@Before</code>；只需要執行後 → <code>@After</code>；需要前後都做，或需要控制目標方法是否執行 → <code>@Around</code>。
</div>

<!--
三種時機點各有適用場景，記住選擇原則就好。

@Around 是三個裡面最強大的，功能上可以完全取代 @Before 和 @After，但也最複雜，多了 ProceedingJoinPoint 和 proceed() 的用法要記。

如果邏輯很簡單，只在執行前或執行後做一件事，用 @Before 或 @After 就夠了，程式碼更直觀。

如果需要同時在前後做事（例如計時），或需要控制目標方法是否執行（例如權限驗證），就用 @Around。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充一
# 切入點（Pointcut）如何撰寫？

<!--
前面我們一直用 execution(* com.example.demo.HpPrinter.*(..)) 這個表達式。補充一來說明這個語法的更多變化，讓你能攔截不同範圍的方法。
-->

---

# execution 表達式的常用寫法

| 表達式 | 攔截的範圍 |
| --- | --- |
| `execution(* com.example.demo.HpPrinter.*(..))` | `HpPrinter` 類別的所有方法 |
| `execution(* com.example.demo.HpPrinter.print(..))` | `HpPrinter` 類別的 `print()` 方法 |
| `execution(* com.example.demo.*.*(..))` | `demo` package 下所有類別的所有方法 |
| `execution(* com.example.demo..*(..))` | `demo` package 及其**子 package** 的所有方法 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>單點 vs 雙點：</b> <code>demo.*</code>（單點）只匹配 demo package 直屬類別；<code>demo..*</code>（雙點）匹配 demo 及其所有子 package。
</div>

<!--
切入點表達式有很多變化，但核心結構都是 execution(回傳型別 類別路徑.方法名稱(參數))。

最常調整的部分是類別路徑：想攔截特定類別就寫完整路徑，想攔截整個 package 就用 *，想包含子 package 就用 ..（兩個點）。

實際工作中最常見的是攔截整個 Service package 的所有方法來記 log，或攔截整個 DAO package 的所有方法來計時。

建議先從最精確的寫法開始（指定到類別），測試通過後再擴大到 package 範圍，避免不小心攔截到不該攔截的方法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充二
# Spring AOP 的發展

<!--
最後一個補充：在現代 Spring Boot 開發中，我們什麼時候真的需要直接寫 @Aspect？
-->

---

# 現代 Spring Boot AOP 的使用現況

| 使用場景 | 傳統 @Aspect 做法 | 現代 Spring Boot 替代方案 |
| --- | --- | --- |
| **權限驗證** | 自己寫切面攔截 Controller | `Spring Security` 內建處理 |
| **例外處理** | 切面攔截並記錄例外 | `@ExceptionHandler`、`@ControllerAdvice` |
| **交易管理** | 切面包住 DAO 方法 | `@Transactional` 內建 AOP 實作 |
| **自訂 log / 計時** | 仍然適合用 `@Aspect` | 無直接替代，這是 AOP 最後的陣地 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>結論：</b> 現代 Spring Boot 專案較少直接寫 <code>@Aspect</code>，但 AOP 的概念仍是理解 <code>@Transactional</code>、Spring Security 運作原理的基礎。
</div>

<!--
這個補充很實用：在實際工作中，我們什麼時候會真的自己寫 @Aspect？

老實說，現代 Spring Boot 已經把很多常見的 AOP 需求內建化了。權限驗證有 Spring Security、例外處理有 @ControllerAdvice、交易管理有 @Transactional，這些底層都是 AOP，但框架已經幫你封裝好了。

直接寫 @Aspect 最主要剩下的場景是：自訂的 log 記錄、自訂的效能計時、公司自己定義的橫切需求等等。

所以不要焦慮「AOP 我什麼時候才會用到」——學它最大的價值是理解 Spring 框架的運作原理，知道 @Transactional 為什麼要加在 Service 的 public 方法上，而不是 private 方法上（因為 AOP 代理的限制）。
-->

---

# 章節總結

- **@Aspect + @Component**：兩個都要加——@Aspect 宣告切面，@Component 讓它成為 Bean
- **build.gradle**：需加入 `spring-boot-starter-aspectj` 依賴
- **@Before**：目標方法執行前觸發；**@After**：執行後觸發；**@Around**：前後都能控制
- **@Around**：需搭配 `ProceedingJoinPoint`，呼叫 `pjp.proceed()` 才會執行目標方法
- **切入點表達式**：`execution(* package.Class.*(..))` — 指定要攔截哪些方法
- **現代趨勢**：權限、交易、例外處理有內建機制；自訂 log/計時仍是 @Aspect 的主場

下一章我們會介紹 Spring MVC 的概念，從 HTTP 請求到 Controller 的完整流程。

<!--
好，今天的內容比較多，我們來整理一下。

三個時機點是核心：@Before 是「先做再說」，@After 是「做完再來」，@Around 是「全程陪同」。其中 @Around 最強大但也最複雜，因為要記得呼叫 proceed()。

切入點表達式 execution(...) 看起來很長，但拆開來就五個部分，按需要調整 package 路徑和方法名稱就好。

有問題嗎？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天把 @Aspect 的三種時機點都學了，也理解了切入點表達式的結構。

課後建議：回去試試看寫一個計時切面——用 @Around 在 proceed() 前後各記錄一個時間，計算並輸出執行時間。這是 @Around 最典型的練習，做過一次就記住了。

有問題嗎？
-->
