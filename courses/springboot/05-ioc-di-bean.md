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

上一章我們用小明印作業的故事認識了 IoC：在家自己印，什麼都自己來；去便利商店印，東西都準備好了。

今天故事繼續。我們要認識另外兩個常常跟 IoC 一起出現的名詞：DI 和 Bean。主角一樣是小明和便利商店，沒有新的例子。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **回顧 IoC**：在家印和去便利商店印，差在哪裡
- **什麼是 DI？** 店員把印表機交到小明手上
- **什麼是 Bean？** 店裡由店家管理的那台印表機

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）先花一點時間回顧上一章的 IoC。

（下一步）接著認識 DI。先劇透，它就是故事裡「店員把印表機交到小明手上」這個動作。

（下一步）最後認識 Bean。它就是便利商店裡、由店家管理的那台印表機。

你會發現，今天的兩個新名詞，其實都藏在上一章的故事裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 回顧：小明印作業

<!--
我們先快速回顧上一章的故事。
-->

---

# 回顧：在家印 vs 去便利商店印

<Pairs left="印作業" right="寫程式" rows="you,在家自己印：印表機自己買=code,自己 new 一台印表機|store,去便利商店印：店家都準備好了=spring,交給 Spring 容器準備|clerk,準備印表機的主導權，交給店家=spring,IoC 控制反轉" />

<!--
上一章的故事是這樣的。

（下一步）在家自己印，印表機要自己買。在程式裡，就是自己 new 一台印表機。

（下一步）去便利商店印，店家都準備好了。在程式裡，就是交給 Spring 容器準備。

（下一步）「準備印表機」的主導權，從小明交到店家手上，這就叫做 IoC，控制反轉。

很好，大家都還記得。今天我們要把這個故事再看仔細一點。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 什麼是 DI？

<!--
請大家回想便利商店的故事。印表機是店家準備的，但它最後是怎麼跑到小明手上的？

這個「交到手上」的動作，就是我們今天的第一個新名詞。
-->

---

# 圖解：店員把印表機交到小明手上

<IocDemo mode="ioc" label="注入（DI）" />

<!--
我們再看一次上一章的這張圖，這次請大家注意中間那支箭頭。

左邊是 Spring 容器，也就是便利商店，裡面有準備好的印表機。右邊是小明，他手上是空的。

（下一步）小明說：「我需要一台印表機」。

（下一步）Spring 容器把 HP 印表機交到小明手上。請看箭頭上的字，這個動作有一個正式的名字，叫做「注入」，英文縮寫是 DI。

（下一步）想換 Canon，Spring 就改把 Canon 注入給小明，小明完全不用動。
-->

---

# 所以，什麼是 DI？

**DI** 是 **Dependency Injection** 的縮寫，中文叫做**依賴注入**。

<Pairs left="印作業" right="寫程式" rows="you,小明要印作業，一定要有印表機=code,依賴：XiaoMing 需要 Printer|clerk,店員把印表機交到小明手上=spring,注入：Spring 把 HpPrinter 放進 XiaoMing" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> DI 就是 Spring 主動把你需要的東西，送到你手上。
</div>

</v-click>

<!--
DI 是兩個英文字的縮寫，中文叫做依賴注入。我們把它拆成兩半來看。

（下一步）前半段「依賴」。小明要印作業，一定要有印表機，沒有印表機就做不了事。這種「少了它就不行」的關係，就叫做依賴。在程式裡，我們會說 XiaoMing 依賴 Printer。

（下一步）後半段「注入」。店員把印表機交到小明手上，這個動作就叫注入。在程式裡，就是 Spring 把 HpPrinter 放進 XiaoMing 裡面。

（下一步）一句話記起來：DI 就是 Spring 主動把你需要的東西，送到你手上。
-->

---

# DI 在程式裡長什麼樣子？

<CodeSteps>

```java {all|2|4-6}
public class XiaoMing {
    private Printer printer;

    public void doHomework() {
        printer.print("小明的作業");
    }
}
```

- 這就是上一章「去便利商店印」的小明
- 這一行是小明在說：「我需要一台印表機」。Spring 會把印表機注入到這裡
- 印表機送到之後，小明就能拿來印作業了

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>還差一步：</b> 現在 Spring 還不知道要把印表機注入到這一行。下一章會學到 <code>@Autowired</code>，就是用來告訴 Spring「請注入到這裡」。
</div>

</v-click>

<!--
DI 在程式裡長什麼樣子？其實就是上一章「去便利商店印」的小明。

（下一步）重點是第二行。這一行是小明在說：「我需要一台印表機」。DI 就是 Spring 把印表機注入到這裡。

（下一步）印表機送到之後，下面寫作業的時候，小明就能拿來印了。

（下一步）不過要先說清楚，現在這樣寫還差一步。Spring 還不知道要把印表機注入到這一行，我們要做一個記號告訴它。這個記號叫做 @Autowired，是下一章的內容。
-->

---

# IoC 和 DI，是一起出現的

<Pairs left="印作業" right="寫程式" rows="store,把準備印表機的事，交給便利商店=spring,IoC：把控制權交給 Spring（交出去）|clerk,店員再把印表機交到小明手上=spring,DI：Spring 把東西注入給你（送回來）" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶方式：</b> IoC 是「交出去」，DI 是「送回來」。只把事情交給店家、店員卻不把印表機給小明，小明還是印不了作業，所以兩個一定一起出現。
</div>

</v-click>

<!--
IoC 和 DI 常常被放在一起講，因為它們是一起出現的。

（下一步）IoC 是把準備印表機的事，交給便利商店。在程式裡，就是把控制權交給 Spring，我們可以想成「交出去」。

（下一步）DI 是店員再把印表機交到小明手上。在程式裡，就是 Spring 把東西注入給你，可以想成「送回來」。

（下一步）想一想，如果只做了 IoC，把事情交給店家，但店員從來不把印表機給小明，那小明還是印不了作業。所以只要有 IoC，就一定要有 DI，兩個一定一起出現。
-->

---

# 小測驗：這個動作叫什麼？

<Poll question="店員把準備好的印表機，交到小明手上。這個動作在 Spring 裡叫做什麼？" options="IoC 控制反轉|DI 依賴注入|Bean" answer="2" />

<!--
來確認一下大家有沒有分清楚。

店員把準備好的印表機，交到小明手上。這個動作在 Spring 裡叫做什麼？

（等大家作答）

（下一步）答案是 DI，依賴注入。

IoC 是「把準備的工作交給店家」這個決定，DI 是「把東西交到手上」這個動作。至於第三個選項 Bean，就是我們接下來要講的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 什麼是 Bean？

<!--
最後一個新名詞：Bean。

請大家想一想，小明家裡那台印表機，和便利商店裡那台印表機，有什麼不一樣？
-->

---

# Bean：店家在管的那台印表機

<Pairs left="印作業" right="寫程式" rows="store,便利商店裡、店家在管的印表機=spring,Bean：Spring 容器在管的物件|you,小明家裡自己買的印表機=code,普通物件：自己 new 出來的" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Bean 說穿了就是物件：</b> 兩台都是印表機，差別只在「誰在管它」。店家在管的叫 Bean，自己管的就是普通物件。
</div>

</v-click>

<!--
兩台都是印表機，功能一樣，那差別在哪裡？

（下一步）便利商店裡的印表機，是店家在管的。店家知道它在那裡、會幫它補紙換墨水、壞了會修。在程式裡，像這樣由 Spring 容器在管的物件，我們幫它取了一個新名字，叫做 Bean。

（下一步）小明家裡自己買的印表機，店家根本不知道它存在。在程式裡，這就是自己 new 出來的普通物件。

（下一步）所以 Bean 說穿了，其實就是一個物件。兩台都是印表機，差別只在「誰在管它」。店家在管的叫 Bean，自己管的就是普通物件。
-->

---

# Bean 和普通物件，差在哪裡？

| | 普通物件（小明家那台） | Bean（便利商店那台） |
| --- | --- | --- |
| **誰準備？** | 自己 `new` | Spring 容器 |
| **誰來顧？** | 自己 | Spring 容器 |
| **能被交到別人手上嗎？** | 不行，店員不知道它 | 可以，DI 注入的就是 Bean |

<v-click>

```java
// 普通物件：Spring 不知道它
Printer printer = new HpPrinter();

// Bean：交給 Spring 管理（下一章會用 @Component 做到）
```

</v-click>

<!--
我們用一張表整理 Bean 和普通物件的差別。

誰準備？普通物件是自己 new 的，Bean 是 Spring 容器準備的。

誰來顧？普通物件自己顧，Bean 由 Spring 容器顧。

最後一列最重要：能被交到別人手上嗎？小明家那台，店員根本不知道它，當然沒辦法拿去給別人。便利商店那台可以。在程式裡，DI 注入的東西，一定是 Bean。

（下一步）寫成程式的話，自己 new 出來的就是普通物件，Spring 不知道它。要把它變成 Bean，需要一個叫 @Component 的記號，這也是下一章的內容。
-->

---

# 小測驗：這台是 Bean 嗎？

<Poll question="小明在自己的程式裡寫了 new HpPrinter()，做出一台印表機。這台印表機是 Bean 嗎？" options="是，所有印表機都是 Bean|不是，它是小明自己 new 的普通物件" answer="2" />

<!--
再來一題。

小明在自己的程式裡寫了 new HpPrinter，做出一台印表機。這台印表機是 Bean 嗎？

（等大家作答）

（下一步）答案是「不是」。它是小明自己 new 的，就像他在家自己買的印表機，Spring 不知道它，所以只是普通物件。

只有交給 Spring 容器管理的，才叫做 Bean。
-->

---

# 三個名詞，一起看

<Flow nodes="Spring 容器:便利商店|HpPrinter:店裡的機器 = Bean|XiaoMing:小明" steps="2>1:交給 Spring 管理（IoC），成為 Bean|3>1:我需要一台 Printer|1>3:把 HpPrinter 交給小明（DI）" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>順序：</b> 先把 HpPrinter 交給 Spring 管（IoC），它就成了 Bean；小明需要時，Spring 再把這個 Bean 注入給他（DI）。
</div>

</v-click>

<!--
最後我們把三個名詞放在一起，看它們是怎麼合作的。

左邊是 Spring 容器，也就是便利商店。中間是 HpPrinter，右邊是小明。

（下一步）第一步，HpPrinter 交給 Spring 管理。這就是 IoC。交給 Spring 管之後，它就變成了一個 Bean，就像店裡的機器。

（下一步）第二步，小明說：「我需要一台 Printer」。

（下一步）第三步，Spring 把 HpPrinter 這個 Bean 交給小明。這就是 DI。

（下一步）所以順序是：先交給 Spring 管，變成 Bean；有人需要的時候，Spring 再把 Bean 注入給他。
-->

---

# 一張圖複習今天的內容

<Pairs left="印作業" right="寫程式" rows="store,準備印表機的事，交給便利商店=spring,IoC 控制反轉|clerk,店員把印表機交到小明手上=spring,DI 依賴注入|printer,店裡、店家在管的印表機=spring,Bean|you,小明家裡自己買的印表機=code,普通物件" />

<!--
我們用一張圖複習今天的內容。

（下一步）把準備印表機的事交給便利商店，就是 IoC。

（下一步）店員把印表機交到小明手上，就是 DI。

（下一步）店裡、店家在管的印表機，就是 Bean。

（下一步）小明家裡自己買的印表機，就是普通物件。

四個名詞，全部都在同一個故事裡。
-->

---

# 章節總結

<v-clicks>

- **IoC（控制反轉）**：把準備東西的事交給 Spring 容器（交出去）
- **DI（依賴注入）**：Spring 把你需要的東西送到你手上（送回來）
- **Bean**：由 Spring 容器在管的物件；自己 `new` 的只是普通物件
- **IoC 和 DI 一定一起出現**：交出去之後，還要有人送回來

</v-clicks>

<v-click>

下一章我們會學兩個記號：用 `@Component` 把印表機變成 Bean，用 `@Autowired` 請 Spring 把它注入給小明。

</v-click>

<!--
最後整理今天的重點。

（下一步）IoC 控制反轉，是把準備東西的事交給 Spring 容器，交出去。

（下一步）DI 依賴注入，是 Spring 把你需要的東西送到你手上，送回來。

（下一步）Bean，是由 Spring 容器在管的物件。自己 new 的，只是普通物件。

（下一步）IoC 和 DI 一定一起出現：交出去之後，還要有人送回來。

（下一步）今天我們一直說「交給 Spring 管」、「請 Spring 注入」，但還沒說要怎麼寫。下一章會學兩個記號：用 @Component 把印表機變成 Bean，用 @Autowired 請 Spring 把它注入給小明。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

如果名詞有點多，只要回想故事就好：交給便利商店是 IoC，店員交到手上是 DI，店裡的機器是 Bean。

有任何問題歡迎現在提出來。
-->
