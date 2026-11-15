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

上一章我們知道了 AOP 的觀念：與其每台機器自己收錢、記帳，不如統一交給櫃台。這個櫃台，在 Spring 裡叫做切面。

今天要實際把這個櫃台寫出來。這也是我們小明和便利商店故事的最後一章。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **`@Aspect`**：在店裡開一個櫃台
- **`@Before`、`@After`、`@Around`**：櫃台在什麼時候做事
- **切入點**：規定哪些機器要經過櫃台

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，@Aspect，在店裡開一個櫃台。

（下一步）第二，@Before、@After、@Around，決定櫃台在什麼時候做事：印之前、印完、還是從頭到尾。

（下一步）第三，切入點，也就是規定哪些機器要經過櫃台。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回顧
# 統一交給櫃台

<!--
先快速回顧上一章的故事。
-->

---

# 回顧：櫃台就是切面

<Pairs left="便利商店" right="Spring" rows="clerk,櫃台=spring,切面（Aspect）|doc,收錢、記帳這些每台都要做的雜事=code,共同邏輯|printer,印表機只管印=code,原本的方法不用改|store,規定哪些機器要經過櫃台=code,切入點（Pointcut）" />

<!--
上一章的故事是這樣的。

（下一步）櫃台，在 Spring 裡叫做切面。

（下一步）收錢、記帳這些每台機器都要做的雜事，就是共同邏輯。

（下一步）印表機只管印，原本的方法不用改。

（下一步）今天會多學一個名詞：規定哪些機器要經過櫃台，這叫做切入點。等一下會詳細講。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 開一個櫃台

<!--
我們來實際開一個櫃台。在開之前，要先把開櫃台需要的工具帶進專案裡。
-->

---

# 準備工作：把 AOP 的工具加進專案

在 `build.gradle` 的 `dependencies` 裡加入這一行：

```groovy
implementation 'org.springframework.boot:spring-boot-starter-aspectj'
```

<v-clicks>

- AOP 的功能沒有內建在一開始的專案裡，要另外加
- 加了之後，才能使用 `@Aspect`、`@Before`、`@After`、`@Around`
- 不用寫版本號，Spring Boot 會幫你配好

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>別忘了：</b> 改完 build.gradle 之後，在 Eclipse 專案上按右鍵 → Gradle → <b>Refresh Gradle Project</b>，才會真的下載。
</div>

</v-click>

<!--
在 build.gradle 的 dependencies 裡加入這一行。

（下一步）為什麼要加？因為 AOP 的功能沒有內建在一開始的專案裡，要另外加進來。

（下一步）加了之後，才能使用今天要學的 @Aspect、@Before、@After、@Around。

（下一步）版本號不用寫，還記得第一章的 Starter 套餐嗎？Spring Boot 會幫你把版本配好。

（下一步）最後別忘了，改完 build.gradle 之後，要在 Eclipse 專案上按右鍵，選 Gradle，再選 Refresh Gradle Project，才會真的下載。
-->

---

# @Aspect：掛上「櫃台」的牌子

<Pairs left="便利商店" right="Spring" rows="clerk,在這個位置掛上「櫃台」的牌子=code,@Aspect：這個 class 是一個切面|staff,櫃台人員也要是店裡的員工=code,@Component：它也要是 Bean" />

<v-click>

```java
@Aspect
@Component
public class CounterAspect {
    // 櫃台要做的事寫在這裡
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>兩個都要加：</b> 只加 <code>@Aspect</code> 忘了 <code>@Component</code>，櫃台不是店裡的員工，就不會上班。
</div>

</v-click>

<!--
要開一個櫃台，需要做兩件事。

（下一步）第一，在這個位置掛上「櫃台」的牌子。在程式裡，就是在 class 上面加 @Aspect，代表這個 class 是一個切面。

（下一步）第二，櫃台人員也要是店裡的員工，店家才會安排他上班。在程式裡，就是還要加 @Component，讓它也是一個 Bean。還記得嗎？只有 Bean 才會被 Spring 管理。

（下一步）寫起來就是這樣。我們把這個 class 取名叫 CounterAspect，Counter 就是櫃台的意思。

最常見的錯誤，就是只加了 @Aspect，忘了加 @Component。這樣櫃台不是店裡的員工，就不會上班，也就是切面不會生效。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 櫃台什麼時候做事？

<!--
櫃台開好了。接下來要決定：櫃台要在什麼時候做事？
-->

---

# 三個時機：印之前、印完、從頭到尾

<AspectTimeline />

<!--
一次列印可以分成三段：印之前、印表機在印、印完之後。櫃台可以選擇在不同的時機做事。

（下一步）@Before，是在印之前做事。例如先收錢。

（下一步）@After，是在印完之後做事。例如記帳。

（下一步）@Around，是從頭到尾都站在旁邊。它可以計時，還能決定要不要讓印表機印。

接下來我們一個一個寫寫看。
-->

---

# @Before：印之前，先收錢

```java
@Aspect
@Component
public class CounterAspect {

    @Before("execution(* com.example.demo.HpPrinter.print(..))")
    public void collectMoney() {
        System.out.println("櫃台：收 2 元");
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>意思是：</b> 每次 <code>HpPrinter</code> 的 <code>print</code> 被呼叫之前，Spring 都會先執行 <code>collectMoney()</code>。
</div>

</v-click>

<!--
先寫 @Before，印之前先收錢。

在櫃台裡寫一個方法叫 collectMoney，收錢。裡面印出「櫃台：收 2 元」。然後在方法上面加 @Before。

@Before 括號裡那一長串，是在說「哪台機器、哪個動作」要經過櫃台。等一下會拆開來講。

（下一步）整段的意思是：每次 HpPrinter 的 print 被呼叫之前，Spring 都會先執行 collectMoney，也就是先收錢。
-->

---

# 切入點：櫃台的工作規則

`execution(* com.example.demo.HpPrinter.print(..))` 拆開來看：

<v-clicks>

- `execution(...)`：在方法**執行**的時候
- 第一個 `*`：不管這個方法回傳什麼
- `com.example.demo.HpPrinter`：**哪一台機器**
- `.print`：**哪一個動作**
- `(..)`：不管要印什麼內容

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>整句念出來：</b> 「HpPrinter 這台機器執行 print 的時候，要經過櫃台。」這就叫做<b>切入點</b>。
</div>

</v-click>

<!--
括號裡那一長串，叫做切入點。你可以把它想成櫃台的工作規則：哪些機器、哪些動作要經過櫃台。我們拆開來看。

（下一步）execution，意思是在方法執行的時候。

（下一步）第一個星號，代表不管這個方法回傳什麼都可以。

（下一步）接著是 com.example.demo.HpPrinter，指的是哪一台機器。

（下一步）點 print，指的是哪一個動作。

（下一步）最後的括號點點，代表不管傳什麼參數進來，也就是不管要印什麼內容。

（下一步）整句念出來就是：「HpPrinter 這台機器執行 print 的時候，要經過櫃台。」
-->

---

# 實際跑一次

印表機的程式**完全不用改**：

```java
@Component
public class HpPrinter implements Printer {
    @Override
    public void print(String message) {
        System.out.println("HP印表機: " + message);
    }
}
```

<v-click>

小明打開 `http://localhost:8080/homework`，Console 會印出：

```
櫃台：收 2 元
HP印表機: 小明的作業
```

</v-click>

<!--
我們實際跑一次。請注意，印表機的程式完全不用改，裡面只有印東西這件正事，完全看不到收錢。

（下一步）小明打開 /homework，Console 會先印出「櫃台：收 2 元」，然後才印出「HP印表機：小明的作業」。

收錢這件事，完全是櫃台在外面做的。印表機根本不知道櫃台的存在。
-->

---

# 小測驗：櫃台會上班嗎？

<Poll question="CounterAspect 上面只加了 @Aspect，忘了加 @Component。執行之後會怎樣？" options="一樣會先收錢|櫃台不會運作，不會印出「收 2 元」|會收兩次錢" answer="2" />

<!--
來一題確認一下。

CounterAspect 上面只加了 @Aspect，忘了加 @Component。執行之後會怎樣？

（等大家作答）

（下一步）答案是櫃台不會運作，不會印出「收 2 元」。

掛了櫃台的牌子，但櫃台人員不是店裡的員工，店家就不會安排他上班。在程式裡，切面一定要同時是 Bean 才會生效。大家可以自己試試看，把 @Component 拿掉，收錢那行就不見了。
-->

---

# @After：印完之後，記帳

```java
@After("execution(* com.example.demo.HpPrinter.print(..))")
public void keepBooks() {
    System.out.println("櫃台：記帳，賣出 1 張");
}
```

<v-click>

和 `@Before` 一起用，Console 會印出：

```
櫃台：收 2 元
HP印表機: 小明的作業
櫃台：記帳，賣出 1 張
```

</v-click>

<!--
接著寫 @After，印完之後記帳。

寫法跟 @Before 一模一樣，只是記號換成 @After，方法叫 keepBooks，記帳。

（下一步）把 @Before 和 @After 一起放在櫃台裡，Console 就會先收錢、再印作業、最後記帳。

順序完全是 Spring 幫我們安排的。印表機一樣什麼都不用改。
-->

---

# @Around：從頭到尾站在旁邊，順便計時

<CodeSteps>

```java {3|4|5-6}
@Around("execution(* com.example.demo.HpPrinter.print(..))")
public Object watch(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.currentTimeMillis();
    Object result = pjp.proceed();
    long end = System.currentTimeMillis();
    System.out.println("櫃台：這次印了 " + (end - start) + " 毫秒");
    return result;
}
```

- 印之前，先按下碼錶
- `pjp.proceed()`：放行，讓印表機真的去印
- 印完再按一次碼錶，算出這次花了多久

</CodeSteps>

<!--
最後是 @Around，從頭到尾站在旁邊。我們用它來做一件很實用的事：計時，看每次列印花了多久。

第三行，印之前，先按下碼錶，記下現在的時間。

（下一步）第四行最重要：pjp.proceed。意思是「放行」，讓印表機真的去印。

（下一步）印完之後，再按一次碼錶，兩個時間相減，就知道這次花了多久。
-->

---

# @Around 的重點

<v-clicks>

- **`pjp`** 代表「被櫃台擋下來的那一次列印」，Spring 會自動傳進來
- **`pjp.proceed()`** 就是「放行」，印表機這時候才真的開始印
- **不呼叫 `proceed()`，印表機就不會印**：例如沒付錢就不讓印
- 寫法固定：要寫 `throws Throwable`，最後要 `return` 結果

</v-clicks>

<!--
@Around 有幾個重點。

（下一步）pjp 代表「被櫃台擋下來的那一次列印」。Spring 會自動把它傳進來。

（下一步）pjp.proceed 就是放行。印表機在這個時候才真的開始印。

（下一步）所以如果不呼叫 proceed，印表機就不會印。這也是 @Around 最強大的地方，它可以決定放不放行。例如客人沒付錢，就不讓他印。

（下一步）最後，寫法是固定的：方法要寫 throws Throwable，最後要把結果 return 回去。照著寫就好。
-->

---

# 三個時機，怎麼選？

| 記號 | 什麼時候做事 | 在便利商店 | 能決定印不印？ |
| --- | --- | --- | --- |
| `@Before` | 方法執行**之前** | 印之前收錢 | 不行 |
| `@After` | 方法執行**之後** | 印完之後記帳 | 不行 |
| `@Around` | 方法執行**前後都可以** | 從頭到尾計時、檢查 | **可以**（要呼叫 `proceed()`） |

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選擇原則：</b> 只要在之前做事用 <code>@Before</code>；只要在之後做事用 <code>@After</code>；前後都要做、或要決定放不放行，用 <code>@Around</code>。
</div>

</v-click>

<!--
我們把三個時機放在一起比較。

@Before 是在方法執行之前做事，就像印之前收錢。它不能決定印不印。

@After 是在方法執行之後做事，就像印完之後記帳。它也不能決定印不印。

@Around 是前後都可以做事，就像從頭到尾站在旁邊計時、檢查。只有它可以決定印不印，要呼叫 proceed 才會放行。

（下一步）選擇原則：只要在之前做事用 @Before；只要在之後做事用 @After；前後都要做、或要決定放不放行，就用 @Around。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充
# 切入點的常用寫法

<!--
最後補充兩件事。第一件是切入點的其他寫法。
-->

---

# 切入點：規定哪些機器要經過櫃台

| 切入點 | 哪些要經過櫃台 |
| --- | --- |
| `execution(* com.example.demo.HpPrinter.print(..))` | HP 印表機的 `print` 這個動作 |
| `execution(* com.example.demo.HpPrinter.*(..))` | HP 印表機的**所有動作** |
| `execution(* com.example.demo.*.*(..))` | `demo` 底下**所有機器**的所有動作 |
| `execution(* com.example.demo..*(..))` | `demo` 和它底下**所有資料夾**裡的機器 |

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>星號（<code>*</code>）代表「全部」：</b> 一個點 <code>demo.*</code> 只看 demo 這一層；兩個點 <code>demo..*</code> 連底下的資料夾也一起算。
</div>

</v-click>

<!--
切入點除了指定一台機器的一個動作，還可以指定更大的範圍。

第一種是剛剛寫的：HP 印表機的 print 這個動作。

第二種把 print 換成星號，就是 HP 印表機的所有動作，不管是黑白、彩色、雙面都要經過櫃台。

第三種把 HpPrinter 也換成星號，就是 demo 這個資料夾底下所有機器的所有動作。

第四種多了一個點，變成兩個點，就是 demo 和它底下所有資料夾裡的機器。

（下一步）簡單記：星號代表「全部」。一個點只看這一層，兩個點連底下的資料夾也一起算。
-->

---

# 補充：現在的專案還常寫 @Aspect 嗎？

<v-clicks>

- **檢查權限**：現在大多交給 Spring Security（第 44 章）
- **統一處理錯誤**：現在大多用 `@ControllerAdvice`
- **交易管理**：用 `@Transactional`（第 32 章），它背後就是 AOP
- **自訂 log、計時**：還是很適合自己寫 `@Aspect`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>結論：</b> 實務上自己寫 <code>@Aspect</code> 的機會變少了，但很多 Spring 功能背後都是 AOP。懂了今天的櫃台，之後學那些功能會輕鬆很多。
</div>

</v-click>

<!--
第二件補充：現在的專案還常寫 @Aspect 嗎？

（下一步）檢查權限，現在大多交給 Spring Security，第 44 章會學。

（下一步）統一處理錯誤，現在大多用 @ControllerAdvice。

（下一步）交易管理，用 @Transactional，第 32 章會學。它背後其實就是 AOP。

（下一步）自訂 log 和計時，還是很適合自己寫 @Aspect。

（下一步）所以結論是：實務上自己寫 @Aspect 的機會變少了，但很多 Spring 的功能背後都是 AOP。懂了今天的櫃台，之後學那些功能會輕鬆很多。
-->

---

# 一張圖複習今天的內容

<Pairs left="便利商店" right="Spring" rows="clerk,掛上「櫃台」牌子，櫃台人員也是員工=code,@Aspect + @Component|ink,印之前收錢=code,@Before|doc,印完之後記帳=code,@After|clerk,從頭到尾在旁邊計時、決定放不放行=code,@Around + pjp.proceed()|store,哪些機器要經過櫃台=code,切入點 execution(...)" />

<!--
我們用一張圖複習今天的內容。

（下一步）掛上櫃台的牌子，櫃台人員也要是員工，就是 @Aspect 加上 @Component。

（下一步）印之前收錢，就是 @Before。

（下一步）印完之後記帳，就是 @After。

（下一步）從頭到尾在旁邊計時、決定放不放行，就是 @Around 加上 pjp.proceed。

（下一步）哪些機器要經過櫃台，就是切入點。
-->

---

# 章節總結

<v-clicks>

- **準備**：`build.gradle` 加入 `spring-boot-starter-aspectj`，記得 Refresh
- **`@Aspect` + `@Component`**：兩個都要加，櫃台才會上班
- **`@Before`** 之前做事、**`@After`** 之後做事、**`@Around`** 前後都能做，還能決定放不放行
- **切入點** `execution(...)`：規定哪些方法要經過切面

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
🎉 <b>Spring 核心單元完成！</b> 從下一章開始進入新單元：Spring MVC，學習前端和後端怎麼溝通。
</div>

</v-click>

<!--
最後整理今天的重點。

（下一步）準備工作：build.gradle 加入 spring-boot-starter-aspectj，記得 Refresh。

（下一步）@Aspect 和 @Component 兩個都要加，櫃台才會上班。

（下一步）@Before 在之前做事，@After 在之後做事，@Around 前後都能做，還能決定放不放行。

（下一步）切入點規定哪些方法要經過切面。

（下一步）恭喜大家，Spring 核心這個單元完成了！小明和便利商店陪我們走完了 IoC、DI、Bean、設定檔和 AOP。從下一章開始，我們進入新的單元：Spring MVC，學習前端和後端是怎麼溝通的。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊，也是 Spring 核心單元的最後一章。

如果之後忘記某個觀念，就回想一下便利商店：誰準備印表機、誰把印表機交給小明、門口的公告、還有那個櫃台。

有任何問題歡迎現在提出來。
-->
