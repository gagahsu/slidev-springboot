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

前幾章，我們已經可以把印表機擺進便利商店（@Component），也可以讓小明拿到印表機（@Autowired），還能指名要哪一台（@Qualifier）。

今天要看的是一個小細節：印表機擺進店裡之後、小明來印之前，店員通常還會先做一些準備。這就是今天的主題：初始化。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **什麼是初始化？** 開店前，店員先把機器準備好
- **`@PostConstruct`**：寫下「開店前要做的事」
- **什麼時候才需要它？** 有時候直接寫就好

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，什麼是初始化。用故事來說，就是開店前，店員先把機器準備好。

（下一步）第二，@PostConstruct，用來寫下「開店前要做的事」。

（下一步）第三，什麼時候才需要它。我們會看到，有時候根本不用它，直接寫就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 開店前的準備

<!--
我們先回到便利商店。

一台新的印表機擺進店裡之後，可以馬上給客人用嗎？
-->

---

# 從擺進店裡，到小明來印

<StoreOpening />

<!--
我們看一台印表機從擺進店裡，到小明來印的過程。

一開始，店家把印表機擺進店裡。但是紙匣還是空的，這時候小明來了也印不出東西。

（下一步）所以開店前，店員會先做準備：開機、放進 5 張紙。

（下一步）開門營業之後，小明來印作業，印了一張，剩下 4 張。

（下一步）之後每印一張，剩下的張數就少一張。

請大家注意中間那一步：擺進店裡之後、開始營業之前，先把機器準備好。這就是今天的主角。
-->

---

# 把故事搬進程式裡

<Pairs left="便利商店" right="Spring" rows="store,店家把印表機擺進店裡=spring,Spring 建立 Bean|paper,開店前，店員先開機、放 5 張紙=code,初始化：幫 Bean 設定好初始值|you,開門營業，小明來印=code,Bean 開始被使用" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> 初始化就是在 Bean 建立之後、被使用之前，先把它準備好。
</div>

</v-click>

<!--
把故事搬進程式裡。

（下一步）店家把印表機擺進店裡，就是 Spring 建立 Bean。這是前兩章學過的。

（下一步）開店前，店員先開機、放 5 張紙，就是初始化，幫 Bean 設定好一開始的值。

（下一步）開門營業，小明來印，就是 Bean 開始被使用。

（下一步）一句話記起來：初始化，就是在 Bean 建立之後、被使用之前，先把它準備好。
-->

---

# 程式裡的情境：剩下幾張紙？

我們幫 `HpPrinter` 加一個變數 `count`，記錄剩下幾張紙：

```java
@Component
public class HpPrinter implements Printer {
    private int count; // 剩下幾張紙
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>問題：</b> Spring 剛建立 <code>HpPrinter</code> 時，<code>count</code> 是 <b>0</b>，就像紙匣是空的。我們要在開店前，先把它設成 5。
</div>

</v-click>

<!--
我們把這個情境寫成程式。幫 HpPrinter 加一個變數，叫做 count，用來記錄剩下幾張紙。

（下一步）問題來了：Spring 剛建立 HpPrinter 的時候，count 的值是 0。在 Java 裡，數字變數沒有給值的話，預設就是 0。這就像紙匣是空的。

所以我們要在開店前，先把它設成 5。要怎麼做？
-->

---

# 小測驗：這叫做什麼？

<Poll question="印表機擺進店裡之後、開門營業之前，店員先放進 5 張紙。這個動作在 Spring 裡叫做什麼？" options="注入|初始化|@Qualifier 指名" answer="2" />

<!--
來一題確認一下。

印表機擺進店裡之後、開門營業之前，店員先放進 5 張紙。這個動作在 Spring 裡叫做什麼？

（等大家作答）

（下一步）答案是初始化。

注入是把印表機交到小明手上；@Qualifier 是指名要哪一台。在開店前先準備好機器，叫做初始化。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# @PostConstruct：開店前要做的事

<!--
知道什麼是初始化之後，我們來看要怎麼寫。

Spring 提供了一個記號，叫做 @PostConstruct。
-->

---

# @PostConstruct：寫下「開店前要做的事」

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

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> 在方法上加 <code>@PostConstruct</code>，Spring 建立好這個 Bean 之後，就會自動執行這個方法一次。
</div>

</v-click>

<!--
這就是 @PostConstruct 的寫法。

我們寫了一個方法叫 initialize，裡面只做一件事：把 count 設成 5。然後在這個方法上面，加上 @PostConstruct。

你可以把這個方法想成一張「開店前要做的事」清單。上面寫著：放進 5 張紙。

（下一步）一句話記起來：在方法上加 @PostConstruct，Spring 建立好這個 Bean 之後，就會自動執行這個方法一次。

另外提醒，上面 import 的路徑是 jakarta 開頭。如果你在網路上看到 javax 開頭的寫法，那是舊版 Spring Boot 的，新版要用 jakarta。
-->

---

# 使用 @PostConstruct 的四個規則

<v-clicks>

- **寫法固定**：`public void 方法名稱()`，不能有參數，名字隨便取
- **一個 class 只放一個**：開店準備清單只能有一張，放兩張的話，Spring 只會挑一張做
- **在注入之後才執行**：店員都到齊了才開始準備，所以可以放心使用注入進來的東西
- **不要自己呼叫它**：店員會自己做，程式裡不用、也不應該自己去呼叫

</v-clicks>

<!--
使用 @PostConstruct 有四個規則。

（下一步）第一，寫法是固定的：public void，加上方法名稱和一對空括號。不能有參數，但名字可以隨便取。

（下一步）第二，一個 class 只放一個。開店準備清單只能有一張。如果你放了兩個 @PostConstruct，Spring 只會挑其中一個執行，而且挑哪一個不一定，結果會很難預測。

（下一步）第三，它在注入之後才執行。就像店員都到齊了才開始準備。所以在這個方法裡，可以放心使用 @Autowired 注入進來的東西。

（下一步）第四，不要自己呼叫它。開店準備是店員自己會做的事，Spring 會自動執行，程式裡不用、也不應該自己去呼叫。
-->

---

# 開門營業：每印一張，少一張

```java
@Override
public void print(String message) {
    count--;
    System.out.println("HP印表機: " + message);
    System.out.println("剩下幾張紙: " + count);
}
```

<v-click>

小明連續印三次作業，Console 會印出：

```
HP印表機: 小明的作業
剩下幾張紙: 4
HP印表機: 小明的作業
剩下幾張紙: 3
HP印表機: 小明的作業
剩下幾張紙: 2
```

</v-click>

<!--
開門營業之後，每印一張，紙就少一張。

在 print 方法的第一行，我們寫了 count 減減，意思是把 count 減 1。然後印出內容，再印出剩下幾張紙。

（下一步）小明連續印三次作業，Console 就會印出剩下 4 張、3 張、2 張。

為什麼是從 4 開始？因為開店前，@PostConstruct 已經把 count 設成 5 了，第一次印完就剩 4 張。
-->

---

# 小測驗：什麼時候執行？

<Poll question="加了 @PostConstruct 的方法，會在什麼時候執行？" options="每次呼叫 print 印東西的時候|Bean 建立好、注入完成之後，執行一次|小明自己呼叫它的時候" answer="2" />

<!--
再來一題。

加了 @PostConstruct 的方法，會在什麼時候執行？

（等大家作答）

（下一步）答案是 Bean 建立好、注入完成之後，執行一次。

就像開店前的準備，只做一次。之後每次印東西，就不會再重新放 5 張紙了。也不需要小明自己去呼叫它。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充
# 一定要用 @PostConstruct 嗎？

<!--
最後補充一個實務上的問題：初始化一定要用 @PostConstruct 嗎？

答案是：不一定。
-->

---

# 直接寫就好 vs 需要 @PostConstruct

<v-clicks>

- **每次都固定放 5 張**：直接寫在機器上就好

```java
private int count = 5;
```

- **要看「今天倉庫送來幾張」才知道**：開店前得先去問另一個人，這時候用 `@PostConstruct`

```java
@PostConstruct
public void initialize() {
    count = warehouse.getPaperCount(); // warehouse 是注入進來的另一個 Bean
}
```

</v-clicks>

<!--
判斷的方法很簡單。

（下一步）如果每次都固定放 5 張紙，那直接寫在機器上就好。

（下一步）在程式裡，就是直接寫 private int count = 5。完全不需要 @PostConstruct。

（下一步）但如果要看「今天倉庫送來幾張紙」才知道要放幾張，那開店前就得先去問另一個人。

（下一步）在程式裡，就是要先問另一個注入進來的 Bean，這裡叫 warehouse，倉庫。這時候就要用 @PostConstruct，因為它會等注入完成才執行，這時候 warehouse 已經在了。
-->

---

# @PostConstruct 適合用在哪裡？

<v-clicks>

- **初始值要問另一個 Bean**：像剛剛的倉庫
- **要準備一整份資料**：例如用迴圈先準備好一份價目表
- **開店前檢查一下**：確認注入進來的東西都正常
- **事先建立連線**：例如連上資料庫，之後的章節會遇到

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>判斷原則：</b> 只是固定的值 → 直接寫。需要執行一段邏輯，或要用到注入的 Bean → 用 <code>@PostConstruct</code>。
</div>

</v-click>

<!--
@PostConstruct 適合用在哪些地方？

（下一步）第一，初始值要問另一個 Bean，像剛剛的倉庫。

（下一步）第二，要準備一整份資料，例如用迴圈先準備好一份價目表。

（下一步）第三，開店前檢查一下，確認注入進來的東西都正常。

（下一步）第四，事先建立連線，例如連上資料庫。這個之後的章節會遇到。

（下一步）判斷原則：只是固定的值，直接寫。需要執行一段邏輯，或要用到注入的 Bean，就用 @PostConstruct。
-->

---

# 你可能會看到的另一種寫法

舊專案裡，有時會看到用 `afterPropertiesSet()` 做初始化：

```java
@Component
public class HpPrinter implements Printer, InitializingBean {
    private int count;

    @Override
    public void afterPropertiesSet() throws Exception {
        count = 5;
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>看得懂就好：</b> 效果跟 <code>@PostConstruct</code> 一樣，但寫法比較麻煩。新專案請用 <code>@PostConstruct</code>。
</div>

</v-click>

<!--
最後補充一下，舊專案裡你可能會看到另一種寫法：實作一個叫 InitializingBean 的介面，然後把初始化寫在 afterPropertiesSet 這個方法裡。

（下一步）它的效果跟 @PostConstruct 一樣，但寫法比較麻煩，現在已經比較少人用了。大家看得懂就好，新專案請用 @PostConstruct。
-->

---

# 一張圖複習今天的內容

<Pairs left="便利商店" right="Spring" rows="store,印表機擺進店裡=spring,Spring 建立 Bean|paper,開店前：開機、放 5 張紙=code,初始化|doc,寫下「開店前要做的事」=code,@PostConstruct 方法|printer,每次都固定 5 張，直接寫在機器上=code,直接寫：count = 5" />

<!--
我們用一張圖複習今天的內容。

（下一步）印表機擺進店裡，就是 Spring 建立 Bean。

（下一步）開店前開機、放 5 張紙，就是初始化。

（下一步）寫下「開店前要做的事」，就是 @PostConstruct 方法。

（下一步）如果每次都固定 5 張，直接寫在機器上就好，也就是 count 等於 5。
-->

---

# 章節總結

<v-clicks>

- **初始化**：Bean 建立之後、被使用之前，先把它準備好
- **`@PostConstruct`**：加在方法上，Spring 建立好 Bean、注入完成後，自動執行一次
- **規則**：`public void 名稱()`、不能有參數、一個 class 只放一個、不要自己呼叫
- **不一定要用**：固定值直接寫；要執行邏輯或用到注入的 Bean，才用 `@PostConstruct`

</v-clicks>

<v-click>

下一章：便利商店門口貼著價目表，要改價錢只要改公告。在 Spring 裡，這就是設定檔。

</v-click>

<!--
最後整理今天的重點。

（下一步）初始化，就是 Bean 建立之後、被使用之前，先把它準備好。

（下一步）@PostConstruct 加在方法上，Spring 建立好 Bean、注入完成之後，會自動執行一次。

（下一步）規則有四個：public void 加名稱、不能有參數、一個 class 只放一個、不要自己呼叫。

（下一步）它不一定要用。固定值直接寫就好；要執行邏輯或用到注入的 Bean，才用 @PostConstruct。

（下一步）下一章，我們看便利商店門口的價目表。要改價錢，只要改公告，不用拆機器。在 Spring 裡，這就是設定檔。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

記住一個畫面：擺進店裡之後、開門營業之前，店員會先把機器準備好。這就是初始化。

有任何問題歡迎現在提出來。
-->
