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

前面幾章，我們都在講 IoC 和 Bean，也就是怎麼把印表機交給便利商店管理。今天要認識 Spring 另一個核心觀念：AOP。

故事一樣在便利商店。這次我們要看的不是印表機本身，而是每次印東西前後都要做的那些「雜事」。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **每台機器都自己收錢、記帳，有什麼問題？**
- **什麼是 AOP？** 統一交給櫃台處理
- **AOP 適合用在哪裡？**

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，如果每台機器都自己收錢、自己記帳，會有什麼問題。

（下一步）第二，什麼是 AOP。用故事來說，就是把這些雜事統一交給櫃台處理。

（下一步）第三，AOP 適合用在哪些地方。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 每台機器都要收錢、記帳

<!--
便利商店生意越來越好，店裡現在有三台機器：黑白印表機、彩色印表機、雙面印表機。

不管哪一台，印東西之前都要收錢，印完之後都要記帳。我們來看看兩種做法。
-->

---

# 做法一：每台機器自己收錢、記帳

<Counter mode="each" />

<!--
第一種做法，每台機器自己來。

店裡有三台機器。

（下一步）每台機器都自己裝了一個投幣孔，自己收錢。

（下一步）每台機器還要自己記帳，記下今天賣了幾張。

（下一步）有一天，老闆想把每張改收 3 元。這下麻煩了，三台機器都要一台一台改。如果店裡有一百台機器，就要改一百次。
-->

---

# 寫成程式：雜事和正事混在一起

<CodeSteps>

```java {3|2,4}
public void print(String message) {
    System.out.println("收錢：2 元");
    System.out.println("HP印表機: " + message);
    System.out.println("記帳：賣出 1 張");
}
```

- 這一行才是真正要做的事：印東西
- 收錢、記帳跟「印」無關，卻擠在同一個方法裡

</CodeSteps>

<!--
做法一寫成程式，就是這樣。

先看第三行：印出「HP印表機」加上內容。這一行才是印表機真正要做的事，也就是「正事」。

（下一步）再看第二行和第四行：收錢、記帳。這兩件事跟「印」本身沒有關係，是「雜事」，卻擠在同一個方法裡面。
-->

---

# 每個方法都要複製一次

`print()`、`printColor()`、`printDouble()`……每個方法都要複製貼上收錢和記帳：

<v-clicks>

- **難讀**：正事和雜事混在一起，一眼看不出這個方法真正在做什麼
- **難改**：想改收 3 元，要一個方法一個方法找出來改
- **重複**：同樣的程式寫了好多次。寫程式有一句話叫 **DRY**：Don't Repeat Yourself，不要重複自己

</v-clicks>

<!--
而且不只 print，彩色的 printColor、雙面的 printDouble，每個方法都要複製貼上一次收錢和記帳。這會造成三個問題。

（下一步）第一，難讀。正事和雜事混在一起，一眼看不出這個方法真正在做什麼。

（下一步）第二，難改。想改收 3 元，要一個方法一個方法找出來改，漏掉一個就出錯。

（下一步）第三，重複。同樣的程式寫了好多次。寫程式的人有一句話叫 DRY，Don't Repeat Yourself，意思是不要重複自己。
-->

---

# 做法二：統一交給櫃台

<Counter mode="counter" />

<!--
第二種做法：設一個櫃台。

店裡設了一個櫃台，所有機器都要經過它。

（下一步）印之前，櫃台統一收錢。

（下一步）印完之後，櫃台統一記帳。機器本身什麼雜事都不用管，只管印。

（下一步）老闆想改收 3 元？只要改櫃台就好。三台機器一台都不用動。
-->

---

# 把故事搬進程式裡

<Pairs left="便利商店" right="Spring" rows="clerk,櫃台=spring,切面（Aspect）|doc,收錢、記帳這些每台都要做的雜事=code,共同邏輯：記錄 log、計時、檢查權限…|printer,印表機只管印=code,原本的方法完全不用改|store,不管哪台機器，都要經過櫃台=spring,橫切：一次套用到很多方法" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> AOP 就是把很多方法都要做的雜事，統一交給「切面」處理。
</div>

</v-click>

<!--
把故事搬進程式裡。

（下一步）櫃台，在 Spring 裡叫做「切面」，英文是 Aspect。

（下一步）收錢、記帳這些每台機器都要做的雜事，在程式裡就是共同邏輯，例如記錄 log、量執行時間、檢查有沒有權限。

（下一步）印表機只管印，在程式裡就是原本的方法完全不用改，裡面只剩正事。

（下一步）不管哪台機器都要經過櫃台，在程式裡叫做「橫切」：切面可以一次套用到很多方法上。

（下一步）一句話記起來：AOP 就是把很多方法都要做的雜事，統一交給切面處理。
-->

---

# 小測驗：要改幾個地方？

<Poll question="用了做法二（統一交給櫃台），老闆想把每張改收 3 元。要改幾個地方？" options="每台機器都要改|只改櫃台|完全不用改" answer="2" />

<!--
來一題確認一下。

用了做法二，統一交給櫃台。老闆想把每張改收 3 元，要改幾個地方？

（等大家作答）

（下一步）答案是只改櫃台。

收錢這件事集中在櫃台，所以只要改一個地方。這就是切面最大的好處。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 什麼是 Spring AOP？

<!--
故事講完了，我們來正式認識 AOP 這個名字。
-->

---

# AOP：切面導向程式設計

**AOP** 是 **Aspect-Oriented Programming** 的縮寫，中文叫做**切面導向程式設計**。

<v-clicks>

- **切面（Aspect）**：放共同邏輯的地方，就像櫃台
- **橫切**：切面的邏輯會套用到很多方法上，就像不管哪台機器都要經過櫃台
- **原本的方法不用改**：印表機完全不知道櫃台的存在，照樣只管印

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼叫「切面」？</b> 想像把每個方法排成一排，切面就像一刀橫切過去，在每個方法的前後都加上同樣的動作。
</div>

</v-click>

<!--
AOP 是三個英文字的縮寫，中文叫做切面導向程式設計。名字很長，但概念就是我們剛剛的櫃台。

（下一步）切面，是放共同邏輯的地方，就像櫃台。

（下一步）橫切，是說切面的邏輯會套用到很多方法上，就像不管哪台機器都要經過櫃台。

（下一步）原本的方法不用改。印表機完全不知道櫃台的存在，照樣只管印。

（下一步）為什麼叫「切面」？想像把每個方法排成一排，切面就像一刀橫切過去，在每個方法的前後都加上同樣的動作。
-->

---

# AOP 適合用在哪裡？

很多方法都要做、但跟正事無關的雜事，就適合交給切面：

<v-clicks>

- **記錄 log**：每個方法被呼叫時記一筆，就像櫃台記帳
- **量執行時間**：看每個方法跑多久，就像看每台機器印多久
- **檢查權限**：執行之前先確認有沒有權限，就像先確認是不是會員
- **統一處理錯誤**：方法出錯時統一處理，就像機器卡紙都由櫃台處理
- **交易管理**：之後講資料庫的章節會用到

</v-clicks>

<!--
那 AOP 適合用在哪裡？判斷的方法是：很多方法都要做、但跟正事無關的雜事，就適合交給切面。

（下一步）第一，記錄 log。每個方法被呼叫的時候記一筆，就像櫃台記帳。

（下一步）第二，量執行時間。看每個方法跑了多久，就像看每台機器印了多久。下一章我們會實際寫這個。

（下一步）第三，檢查權限。執行之前先確認有沒有權限，就像先確認客人是不是會員。

（下一步）第四，統一處理錯誤。方法出錯的時候統一處理，就像機器卡紙都由櫃台處理。

（下一步）第五，交易管理。這個之後講資料庫的章節會用到，到時候大家會發現，它背後用的就是 AOP。
-->

---

# AOP 和物件導向：一個管正事，一個管雜事

<Pairs left="便利商店" right="程式" rows="printer,每台機器怎麼印=code,物件導向（OOP）：負責正事|clerk,每台機器都要經過的櫃台=spring,切面導向（AOP）：負責大家共同的雜事" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>不是取代：</b> AOP 是用來補充物件導向的。兩個一起用，程式才會乾淨又好改。
</div>

</v-click>

<!--
最後說一下 AOP 和物件導向的關係。物件導向就是我們平常寫 class、寫方法的方式。

（下一步）每台機器怎麼印，是物件導向負責的，也就是正事。

（下一步）每台機器都要經過的櫃台，是 AOP 負責的，也就是大家共同的雜事。

（下一步）所以 AOP 不是用來取代物件導向的，而是補充它。兩個一起用，程式才會乾淨又好改。

補充一下，Spring 的 AOP 背後是用一種叫「代理」的技術做出來的，但我們平常使用的時候，不需要知道這些細節。
-->

---

# 小測驗：哪個適合交給切面？

<Poll question="下面哪一個，最適合用 AOP（交給切面）來處理？" options="計算作業分數的公式|每個方法執行前，都要記錄一筆 log|印表機要印出的文字內容" answer="2" />

<!--
最後一題。

下面哪一個，最適合用 AOP，也就是交給切面來處理？

（等大家作答）

（下一步）答案是「每個方法執行前，都要記錄一筆 log」。

計算分數的公式、要印的內容，都是正事，每個方法都不一樣。記錄 log 是很多方法都要做的雜事，而且做法都一樣，就像收錢和記帳，最適合交給櫃台。
-->

---

# 一張圖複習今天的內容

<Pairs left="便利商店" right="Spring" rows="printer,每台機器自己收錢、記帳=code,共同邏輯複製在每個方法裡|clerk,統一交給櫃台=spring,AOP 切面導向程式設計|clerk,櫃台=spring,切面（Aspect）|store,所有機器都經過櫃台=spring,橫切" />

<!--
我們用一張圖複習今天的內容。

（下一步）每台機器自己收錢、記帳，就是共同邏輯複製在每個方法裡，難讀又難改。

（下一步）統一交給櫃台，就是 AOP。

（下一步）櫃台，就是切面。

（下一步）所有機器都經過櫃台，就是橫切。
-->

---

# 章節總結

<v-clicks>

- **問題**：收錢、記帳這種雜事複製在每個方法裡，難讀、難改、重複
- **AOP**：把很多方法都要做的雜事，統一交給「切面」處理
- **原本的方法不用改**：方法裡只剩正事，就像印表機只管印
- **適合用在**：記錄 log、量執行時間、檢查權限、統一處理錯誤、交易管理

</v-clicks>

<v-click>

下一章：實際寫出一個櫃台。用 `@Aspect` 設櫃台，用 `@Before`、`@After`、`@Around` 決定什麼時候做事。

</v-click>

<!--
最後整理今天的重點。

（下一步）問題是：收錢、記帳這種雜事複製在每個方法裡，難讀、難改、又重複。

（下一步）AOP 就是把很多方法都要做的雜事，統一交給切面處理。

（下一步）原本的方法不用改，裡面只剩正事，就像印表機只管印。

（下一步）適合用在記錄 log、量執行時間、檢查權限、統一處理錯誤，還有之後會學到的交易管理。

（下一步）下一章，我們要實際寫出一個櫃台。用 @Aspect 設櫃台，用 @Before、@After、@Around 決定櫃台什麼時候做事。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

記住一個畫面：與其每台機器自己收錢，不如統一交給櫃台。這就是 AOP。

有任何問題歡迎現在提出來。
-->
