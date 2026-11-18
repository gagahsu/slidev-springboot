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

上一章我們知道了：交給 Spring 管的東西叫 Bean，Spring 把 Bean 交到你手上叫 DI。但我們一直只是「說」交給 Spring，還沒有真的寫出來。

今天就要動手了。我們會學兩個記號，一個用來把印表機交給 Spring 管，一個用來請 Spring 把印表機交給小明。故事一樣是小明和便利商店。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **`@Component`**：在印表機貼上「本店設備」的標籤
- **`@Autowired`**：小明說「請給我一台印表機」
- **實際寫一次**：讓小明在 Spring Boot 裡真的拿到印表機

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一個記號 @Component，就像在印表機貼上「本店設備」的標籤。

（下一步）第二個記號 @Autowired，就像小明跟店員說「請給我一台印表機」。

（下一步）最後我們實際寫一次，讓小明在 Spring Boot 裡真的拿到印表機、印出作業。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# @Component：貼上「本店設備」標籤

<!--
上一章說，店裡由店家在管的機器就叫 Bean。

但是問題來了：店家怎麼知道哪些機器歸它管？
-->

---

# 店家怎麼知道哪些機器歸它管？

<Pairs left="便利商店" right="Spring" rows="printer,在印表機貼上「本店設備」標籤=code,在 class 上面加 @Component|store,開店時照標籤清點，把機器擺進店裡=spring,Spring 啟動時建立物件，放進容器|clerk,之後店員就能拿給客人用=spring,可以被注入到需要的地方" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> 在 class 上面加 <code>@Component</code>，這個 class 就會交給 Spring 管理，變成一個 Bean。
</div>

</v-click>

<!--
店家的做法很簡單：貼標籤。

（下一步）在印表機貼上一張「本店設備」的標籤。在程式裡，就是在 class 上面加一個記號，叫做 @Component。

（下一步）開店的時候，店家照標籤清點，把有貼標籤的機器都擺進店裡。在程式裡，就是 Spring 啟動的時候，會把加了 @Component 的 class 建立出來，放進 Spring 容器。

（下一步）之後店員就能拿這台機器給客人用。在程式裡，就是它可以被注入到需要的地方。

（下一步）一句話記起來：在 class 上面加 @Component，這個 class 就會交給 Spring 管理，變成一個 Bean。
-->

---

# @Component 寫起來長這樣

<CodeSteps>

```java {1|2|4-7}
@Component
public class HpPrinter implements Printer {

    @Override
    public void print(String message) {
        System.out.println("HP印表機: " + message);
    }
}
```

- 這一行就是「本店設備」的標籤
- `HpPrinter` 是一台印表機（`implements Printer` 的意思是「它是一種印表機」）
- 叫它印東西時，它會印出「HP印表機：」加上內容

</CodeSteps>

<!--
@Component 寫起來長這樣。

第一行就是那張「本店設備」的標籤。只要加上這一行，Spring 啟動時就會把 HpPrinter 擺進店裡。

（下一步）第二行說的是，HpPrinter 是一台印表機。implements Printer 的意思，就是「它是一種印表機」。

（下一步）下面這段是它的功能：叫它印東西的時候，它會印出「HP印表機：」再加上你要印的內容。
-->

---

# Bean 的名字：機器上的編號貼紙

Spring 把機器擺進店裡時，會順便貼上一張編號貼紙：

| class 的名字 | Bean 的名字（預設） |
| --- | --- |
| `HpPrinter` | `hpPrinter` |
| `CanonPrinter` | `canonPrinter` |
| `XiaoMingController` | `xiaoMingController` |

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>規則：</b> 把 class 名字的<b>第一個字母改成小寫</b>，就是 Bean 的名字。下一章店裡有兩台印表機時，就要靠這個編號來指定。
</div>

</v-click>

<!--
Spring 把機器擺進店裡的時候，還會順便貼上一張編號貼紙，也就是 Bean 的名字。

規則很簡單，請看這張表。HpPrinter 會變成小寫 h 開頭的 hpPrinter；CanonPrinter 變成 canonPrinter。

（下一步）規則就是：把 class 名字的第一個字母改成小寫。

這個編號現在用不到，但下一章很重要。下一章店裡會同時有兩台印表機，那時候就要靠這個編號來指定要哪一台。
-->

---

# 小測驗：@Component 像什麼？

<Poll question="在 class 上面加 @Component，最像便利商店的哪個動作？" options="在機器貼上「本店設備」標籤|請客人自己帶印表機來|把機器送去修理" answer="1" />

<!--
來一題確認一下。

在 class 上面加 @Component，最像便利商店的哪個動作？

（等大家作答）

（下一步）答案是在機器貼上「本店設備」標籤。

貼了標籤，店家開店時就會把它擺進店裡管理。在程式裡，加了 @Component，Spring 啟動時就會把它變成 Bean。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# @Autowired：請給我一台印表機

<!--
印表機已經擺進店裡了。接下來的問題是：要怎麼讓它到小明手上？
-->

---

# 小明怎麼拿到印表機？

<Pairs left="便利商店" right="Spring" rows="you,小明說：「請給我一台印表機」=code,在變數上面加 @Autowired|clerk,店員從店裡找一台，交給小明=spring,Spring 從容器找到 Bean，注入進來|doc,小明拿到就能印作業=code,變數裡有東西了，可以直接用" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> 在變數上面加 <code>@Autowired</code>，Spring 就會把容器裡的 Bean 注入進來。
</div>

</v-click>

<!--
答案是：小明要開口。

（下一步）小明跟店員說：「請給我一台印表機」。在程式裡，就是在小明的印表機變數上面，加一個記號叫 @Autowired。

（下一步）店員聽到之後，從店裡找一台印表機交給小明。在程式裡，就是 Spring 從容器裡找到對應的 Bean，注入進來。

（下一步）小明拿到之後就能印作業了。在程式裡，這個變數裡面就有東西了，可以直接拿來用。

（下一步）一句話記起來：在變數上面加 @Autowired，Spring 就會把容器裡的 Bean 注入進來。
-->

---

# @Autowired 的兩個前提

<v-clicks>

- **小明也要在店裡**：店員只服務店裡的客人。所以加了 `@Autowired` 的 class，自己也要是 Bean
- **店裡要有這台機器**：店員不可能把小明家裡的印表機拿來。所以被注入的東西，也要是 Bean

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶方式：</b> 雙方都要在店裡，也就是<b>雙方都要是 Bean</b>，Spring 才能完成注入。
</div>

</v-click>

<!--
用 @Autowired 之前，有兩個前提一定要成立。

（下一步）第一，小明也要在店裡。店員只服務走進店裡的客人，小明在家裡喊「給我印表機」，店員是聽不到的。在程式裡，加了 @Autowired 的那個 class，自己也必須是 Bean。

（下一步）第二，店裡要有這台機器。店員只能拿店裡的機器，不可能跑去小明家把他的印表機拿來。在程式裡，被注入的東西也必須是 Bean，也就是要有加 @Component。

（下一步）所以記住：雙方都要在店裡，也就是雙方都要是 Bean，Spring 才能完成注入。
-->

---

# 店員怎麼找？照「種類」找

<v-clicks>

- 小明說要的是「**印表機**」（`private Printer printer`）
- 店員就去店裡找：哪一台是印表機？
- `HpPrinter` 是一種印表機，找到了，就交給小明
- 如果店裡**同時有 HP 和 Canon** 兩台，店員不知道要給哪一台，就會卡住（報錯）

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>預告：</b> 兩台印表機要怎麼指定？這就是下一章 <code>@Qualifier</code> 要解決的問題。
</div>

</v-click>

<!--
店員是怎麼決定要拿哪台機器給小明的？答案是：照「種類」找。

（下一步）小明的變數寫的是 Printer，意思是他要的是「印表機」這個種類。

（下一步）店員就去店裡找：哪一台是印表機？

（下一步）HpPrinter 是一種印表機，找到了，就交給小明。

（下一步）那如果店裡同時有 HP 和 Canon 兩台印表機呢？兩台都是印表機，店員不知道要給哪一台，就會卡住。在程式裡，這時候 Spring 會報錯。

（下一步）這個問題要怎麼解決？就是下一章 @Qualifier 的內容。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 實際寫一次

<!--
觀念都講完了，我們在 Spring Boot 裡實際寫一次。

總共三個步驟：先規定什麼是印表機、再準備一台 HP 印表機放進店裡、最後讓小明拿到它。
-->

---

# Step 1：先規定「什麼叫印表機」

```java
package com.example.demo;

public interface Printer {
    void print(String message);
}
```

<v-clicks>

- `interface` 是一份「規定」：只要是印表機，就一定要會 `print`（印東西）
- HP、Canon 都照這份規定做，所以它們都算是 `Printer`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼要這樣做？</b> 小明只說「我要一台印表機」，不指定牌子。之後換成 Canon，小明的程式不用改，這就是第四章說的鬆耦合。
</div>

</v-click>

<!--
第一步，先規定什麼叫做印表機。

我們建立一個叫 Printer 的檔案。

（下一步）這裡用的是 interface，你可以把它想成一份規定：只要是印表機，就一定要會 print，也就是印東西。

（下一步）HP 印表機、Canon 印表機都照這份規定做，所以它們都算是 Printer。

（下一步）為什麼要多這一步？因為小明只說「我要一台印表機」，不指定牌子。之後要換成 Canon，小明的程式完全不用改。這就是第四章講的鬆耦合。
-->

---

# Step 2：準備一台 HP 印表機，貼上標籤

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

<v-click>

Spring 啟動後，就會把 `HpPrinter` 擺進店裡，編號是 `hpPrinter`。

</v-click>

<!--
第二步，準備一台 HP 印表機，並且貼上「本店設備」的標籤。

這段程式剛剛看過了。上面多了一行 import，那是告訴 Java「@Component 這個記號從哪裡來」，Eclipse 通常會自動幫你加。

（下一步）Spring 啟動之後，就會把 HpPrinter 擺進店裡，編號是 hpPrinter。
-->

---

# Step 3：程式裡的小明：XiaoMingController

為了能用瀏覽器測試，我們讓小明當一個 Controller（第三章寫過 `MyController`）：

<CodeSteps>

```java {1|2|3-4}
@RestController
public class XiaoMingController {
    @Autowired
    private Printer printer;
}
```

- `@RestController`：小明也在店裡了（他自己也是 Bean）
- 這就是程式裡的小明
- 小明說：「請給我一台印表機」

</CodeSteps>

<!--
第三步，寫出程式裡的小明。

為了可以用瀏覽器測試，我們讓小明當一個 Controller。還記得第三章寫過的 MyController 嗎？就是同一種東西，只是這次我們叫它 XiaoMingController。

第一行 @RestController。它除了讓小明可以接網址之外，也代表小明自己也是一個 Bean。還記得兩個前提嗎？小明也要在店裡，這一行就做到了。

（下一步）這就是程式裡的小明。

（下一步）最重要的是這兩行：@Autowired 加上 private Printer printer。這就是小明在說：「請給我一台印表機」。
-->

---

# Step 3：讓小明印作業

```java
@RestController
public class XiaoMingController {
    @Autowired
    private Printer printer;

    @RequestMapping("/homework")
    public String doHomework() {
        printer.print("小明的作業");
        return "作業印好了";
    }
}
```

<v-click>

瀏覽器打開 `http://localhost:8080/homework`，Console 會印出：

```
HP印表機: 小明的作業
```

</v-click>

<!--
最後，我們讓小明真的印一次作業。

下面加了一段：有人打開 /homework 這個網址的時候，小明就叫印表機印出「小明的作業」，然後回傳「作業印好了」。

請注意，整段程式裡，小明完全沒有 new 印表機。印表機是 Spring 注入給他的。

（下一步）把程式跑起來，用瀏覽器打開 localhost 8080 斜線 homework。Console 就會印出「HP印表機：小明的作業」。

看到這行字，就代表 Spring 真的把 HP 印表機交到小明手上了。
-->

---

# 按下執行之後，Spring 做了什麼？

<v-clicks>

- **① 開店清點**：找出所有貼了標籤的 class（`@Component`、`@RestController`），這叫做**元件掃描**
- **② 擺好機器**：建立 `HpPrinter`，編號 `hpPrinter`，放進容器
- **③ 小明進門**：建立 `XiaoMingController`，發現他說「請給我一台印表機」
- **④ 交到手上**：找到一台印表機（`hpPrinter`），注入給小明

</v-clicks>

<!--
按下執行之後，Spring 在背後做了四件事。我們用開店的流程來看。

（下一步）第一，開店清點。Spring 會找出所有貼了標籤的 class，包括 @Component 和 @RestController。這個動作有個正式名稱，叫做元件掃描。

（下一步）第二，擺好機器。建立 HpPrinter，編號 hpPrinter，放進容器。

（下一步）第三，小明進門。建立 XiaoMingController，並且發現他有一個 @Autowired，也就是他說了「請給我一台印表機」。

（下一步）第四，交到手上。Spring 去容器裡找一台印表機，找到 hpPrinter，就注入給小明。

這四件事都是 Spring 自動做的，我們只需要貼標籤、開口要東西就好。
-->

---

# 小測驗：小明拿得到印表機嗎？

<Poll question="如果 XiaoMingController 上面沒有 @RestController，也沒有 @Component，只有 @Autowired 那一行，會怎樣？" options="一樣拿得到印表機|拿不到，因為小明自己不是 Bean|會拿到兩台印表機" answer="2" />

<!--
最後一題，來確認大家有沒有記住兩個前提。

如果 XiaoMingController 上面沒有 @RestController，也沒有 @Component，只有 @Autowired 那一行，會怎樣？

（等大家作答）

（下一步）答案是拿不到，因為小明自己不是 Bean。

用故事來說，小明沒有走進店裡，他在家裡喊「給我印表機」，店員根本聽不到。雙方都要在店裡，注入才會成功。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充
# 官方建議的寫法：建構子注入

<!--
最後補充一個實務上很重要的寫法：建構子注入。

剛剛的寫法完全可以用，但 Spring 官方比較建議另一種寫法，大家之後在公司的專案裡會常常看到。
-->

---

# 建構子注入：一進門就交出需求清單

<Pairs left="便利商店" right="程式" rows="you,小明一進門，就把需要的東西寫成清單交給店員=code,把需要的東西寫在建構子的參數裡|clerk,店員在小明進門時一次給齊=spring,Spring 建立小明時，一次注入|printer,拿到的機器就固定，不會被換掉=code,變數可以加上 final" />

<v-click>

```java
@RestController
public class XiaoMingController {
    private final Printer printer;

    public XiaoMingController(Printer printer) { // 只有一個建構子時，@Autowired 可省略
        this.printer = printer;
    }
}
```

</v-click>

<!--
建構子注入，用故事來說是這樣的。

（下一步）小明一進門，就把需要的東西寫成一張清單交給店員。在程式裡，就是把需要的東西寫在建構子的參數裡。建構子就是「建立小明的時候會執行的那段程式」。

（下一步）店員在小明進門的時候，就一次把東西給齊。在程式裡，Spring 建立小明的時候，就會把印表機一起傳進來。

（下一步）拿到的機器就固定了，不會被別人偷偷換掉。在程式裡，這個變數可以加上 final，代表之後不能再被改。

（下一步）寫起來就是這樣。印表機寫在建構子的括號裡，Spring 會自動傳進來。只有一個建構子的時候，連 @Autowired 都可以省略。
-->

---

# 為什麼官方比較建議建構子注入？

<v-clicks>

- **不會被換掉**：變數可以加 `final`，拿到之後就固定
- **測試很方便**：測試時直接把一台假的印表機傳進去就好
- **需要什麼一目了然**：看建構子就知道小明需要哪些東西

</v-clicks>

<v-click>

```java
public XiaoMingController(Printer printer, Stapler stapler) { // 要印表機，也要釘書機
    this.printer = printer;
    this.stapler = stapler;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>@Autowired</code> 寫在變數上的方式<b>沒有被淘汰</b>，很多專案還在用，一定要看得懂；但<b>新專案建議用建構子注入</b>。
</div>

</v-click>

<!--
為什麼官方比較建議建構子注入？有三個原因。

（下一步）第一，不會被換掉。變數可以加 final，拿到之後就固定了。

（下一步）第二，測試很方便。還記得第四章說的「假的印表機」嗎？用建構子注入的話，測試時直接把假印表機傳進去就好。

（下一步）第三，需要什麼一目了然。看建構子的括號，就知道小明需要哪些東西。

（下一步）如果小明除了印表機，還需要一台釘書機，就一起寫在括號裡。清單如果變得很長，也是一個警訊，代表小明一個人做太多事了。

最後提醒，@Autowired 寫在變數上的方式沒有被淘汰，很多專案還在用，一定要看得懂。但如果是新專案，建議用建構子注入。
-->

---

# 一張圖複習今天的內容

<Pairs left="便利商店" right="程式" rows="printer,在機器貼上「本店設備」標籤=code,@Component：變成 Bean|store,機器上的編號貼紙=code,Bean 名字：第一個字母小寫|you,小明說「請給我一台印表機」=code,@Autowired：請 Spring 注入|clerk,雙方都要在店裡=spring,兩個前提：雙方都要是 Bean|you,一進門就交出需求清單=code,建構子注入" />

<!--
我們用一張圖複習今天的內容。

（下一步）在機器貼上「本店設備」標籤，就是 @Component，讓它變成 Bean。

（下一步）機器上的編號貼紙，就是 Bean 的名字，class 名字第一個字母改小寫。

（下一步）小明說「請給我一台印表機」，就是 @Autowired，請 Spring 注入。

（下一步）雙方都要在店裡，就是兩個前提：雙方都要是 Bean。

（下一步）一進門就交出需求清單，就是建構子注入。
-->

---

# 章節總結

<v-clicks>

- **`@Component`**：加在 class 上，交給 Spring 管理，變成 Bean（`HpPrinter` 的名字是 `hpPrinter`）
- **`@Autowired`**：加在變數上，Spring 照種類找到 Bean，注入進來
- **兩個前提**：用 `@Autowired` 的 class 和被注入的東西，都要是 Bean
- **建構子注入**：官方建議的寫法，把需要的東西寫在建構子參數裡

</v-clicks>

<v-click>

下一章：店裡同時有 HP 和 Canon 兩台印表機時，小明要怎麼指定要哪一台？

</v-click>

<!--
最後整理今天的重點。

（下一步）@Component 加在 class 上，交給 Spring 管理，變成 Bean。名字是 class 名字第一個字母改小寫。

（下一步）@Autowired 加在變數上，Spring 會照種類找到 Bean，注入進來。

（下一步）兩個前提：用 @Autowired 的 class，和被注入的東西，都要是 Bean。

（下一步）建構子注入是官方建議的寫法，把需要的東西寫在建構子參數裡。

（下一步）下一章，店裡會同時有 HP 和 Canon 兩台印表機。小明要怎麼指定要哪一台？我們下一章見。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

今天第一次真的讓 Spring 把東西注入給小明，建議大家回去自己再寫一次，看到 Console 印出「HP印表機：小明的作業」，就代表你成功了。

有任何問題歡迎現在提出來。
-->
