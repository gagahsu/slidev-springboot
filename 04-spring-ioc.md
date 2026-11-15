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

上一章我們寫出了第一個 Spring Boot 程式。今天要進入 Spring 最核心的觀念之一，叫做 IoC，中文是「控制反轉」。

這個名字聽起來很嚇人，但它講的事情其實很生活化。今天從頭到尾只用一個例子：小明要印作業。聽懂這個故事，你就懂 IoC 了。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **IoC 到底是什麼？** 用「小明印作業」的故事來理解
- **程式裡的 IoC 長什麼樣子？** 一樣是小明和印表機
- **這樣寫有什麼好處？** 為什麼大家都愛用 Spring

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>放輕鬆：</b> 今天只有一個例子，程式碼也只有一點點，先把故事聽懂就好。
</div>

</v-click>

<!--
今天只要搞懂三件事。

（下一步）第一，IoC 到底是什麼。我們用小明印作業的故事來講。

（下一步）第二，這個觀念放到程式裡長什麼樣子。主角還是小明和印表機，不會換人。

（下一步）第三，這樣寫有什麼好處，為什麼大家都愛用 Spring。

（下一步）先跟大家說，今天只有一個例子，程式碼也只有一點點。如果你是第一次接觸，完全不用緊張。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 先講一個故事：小明要印作業

<!--
我們先完全不管程式。

明天要交作業，小明今天晚上要把作業印出來。要做到這件事，有兩種做法。
-->

---

# 做法一：在家自己印

<LifeIoc mode="home" />

<!--
第一種做法，在家自己印。

小明要印作業，可是家裡什麼都沒有。

（下一步）所以印表機、紙、墨水，全部都要自己買回家。

（下一步）印到一半，墨水用完了。怎麼辦？沒有人會幫他，只能自己再出門去買。

（下一步）過了一陣子，印表機壞了。一樣，只能自己修，修不好就自己重買一台。

大家發現了嗎？在家印的時候，每一樣東西都跟小明綁在一起：他準備、他保管、壞了他處理。請先記住這個感覺。
-->

---

# 做法二：去便利商店印

<LifeIoc mode="store" />

<!--
第二種做法，去便利商店印。

小明還沒到，便利商店早就把印表機、紙、墨水都準備好了。

（下一步）小明走進去，只要跟店員說一句：「我要印這份作業」。他不用管印表機是哪個牌子，也不用自己帶紙。

（下一步）幾秒鐘就印好了，小明拿了就走。

（下一步）那如果店裡的墨水用完了、機器壞了呢？那是店家的事，店家會處理。小明完全不用管。

同樣是印作業，這次東西不是小明準備的，壞了也不是他處理的。他只負責一件事：說出他需要什麼。
-->

---

# 兩種做法，差在「誰負責」

| | 在家自己印 | 去便利商店印 |
| --- | --- | --- |
| **印表機、紙、墨水誰準備？** | 小明自己 | 便利商店 |
| **沒墨水、壞掉了誰處理？** | 小明自己 | 便利商店 |
| **想改印彩色的？** | 自己買新機器 | 跟店員說一聲 |

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵：</b> 「準備印表機」這件事的<b>主導權</b>，從小明手上交到了便利商店手上。主導權換人，這就叫做<b>控制反轉</b>。
</div>

</v-click>

<!--
我們把兩種做法放在一起比較。

印表機、紙、墨水誰準備？在家是小明自己，去便利商店是店家。沒墨水、壞掉了誰處理？在家是小明自己，去便利商店是店家。想改印彩色的？在家要自己買新機器，去便利商店只要跟店員說一聲。

三個問題的答案都一樣：在家是「小明」，便利商店是「店家」。

（下一步）所以兩種做法真正的差別，是「準備印表機」這件事的主導權在誰手上。本來在小明手上，現在交給了便利商店。主導權換了人，這件事有一個聽起來很厲害的名字，叫做「控制反轉」。

沒錯，這就是今天的主角 IoC。你其實已經懂了。
-->

---

# 小測驗：沒墨水了怎麼辦？

<Poll question="小明在便利商店印作業，結果店裡的印表機沒墨水了。誰要負責換墨水？" options="小明自己出去買|便利商店|排在後面的客人" answer="2" />

<!--
來一題暖身題，確認大家有跟上。

小明在便利商店印作業，結果店裡的印表機沒墨水了。誰要負責換墨水？有開課堂連線的同學可以直接用手機選。

（等大家作答）

（下一步）答案是便利商店。

這題很簡單，但請記住這個答案。等一下我們會把「便利商店」換成程式裡的一個東西，題目的邏輯完全一樣。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 把故事搬進程式裡

<!--
故事聽懂了，現在我們把它搬進程式的世界。

主角一樣是小明，故事也一樣，只是每個角色在程式裡有一個正式的名字。
-->

---

# 故事裡的角色，在程式裡叫什麼？

<Pairs left="印作業" right="寫程式" rows="you,小明=code,XiaoMing（一段程式，代表小明）|printer,印表機（連同紙和墨水）=printer,Printer（印表機）|store,便利商店=spring,Spring 容器|clerk,店員幫小明準備好印表機=spring,Spring 把印表機交給小明" />

<!--
我們一個一個對照。

（下一步）小明，在程式裡就是一段叫做 XiaoMing 的程式，代表小明這個角色。

（下一步）印表機，連同紙和墨水，在程式裡就叫 Printer。

（下一步）便利商店，對應到一個叫做「Spring 容器」的東西。現在先把它想成「程式世界裡的便利商店」就好。

（下一步）店員幫小明準備好印表機，對應到 Spring 把印表機交給小明。

名字換了，但故事是同一個。
-->

---

# 圖解：Spring 容器就是程式裡的便利商店

<IocDemo mode="ioc" />

<!--
我們用程式世界的角色，把便利商店的故事再看一次。

左邊綠色的框就是 Spring 容器，也就是便利商店。它已經把 HP 和 Canon 兩台印表機都準備好了。右邊是小明，他手上的位置現在是空的。

（下一步）小明只說一句話：「我需要一台印表機」。他不指定牌子，就像他跟店員說「我要印這份作業」。

（下一步）Spring 容器就把 HP 印表機交到小明手上。這個「交到手上」的動作，下一章會給它一個正式的名字。

（下一步）想換成 Canon？跟 Spring 說一聲，它就改給 Canon。請看小明這邊，完全沒有動。
-->

---

# 所以，什麼是 IoC？

**IoC** 是 **Inversion of Control** 的縮寫，中文叫做**控制反轉**。

<v-clicks>

- **控制**：決定「要用哪一台印表機、由誰來準備」的權力
- **反轉**：這個權力從「小明自己」手上，換到「別人」手上
- 在 Spring 裡，這個「別人」就是 **Spring 容器**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> 需要的東西不要自己準備，交給 Spring 容器準備好，再拿給你用。
</div>

</v-click>

<!--
現在可以正式介紹這個名字了。IoC 是三個英文字的縮寫，中文叫做控制反轉。我們把這四個字拆開來看。

（下一步）「控制」，指的是決定要用哪一台印表機、由誰來準備的權力。

（下一步）「反轉」，是說這個權力換人了，從小明自己手上換到別人手上。

（下一步）在 Spring 的世界裡，這個「別人」就是 Spring 容器。

（下一步）如果只能記一句話，就記這一句：需要的東西不要自己準備，交給 Spring 容器準備好，再拿給你用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 看一點點程式碼

<!--
觀念懂了，我們來看一點點程式碼，真的只有一點點。

看的時候不用每個字都懂，我會告訴你該看哪一行。
-->

---

# 先認識一個字：new

在 Java 裡，`new` 的意思是「**現在做一個新的出來**」。

```java
Printer printer = new HpPrinter();
```

<v-clicks>

- `new HpPrinter()`：做一台新的 HP 印表機
- `Printer printer =`：幫它取名叫 `printer`，之後喊這個名字就能叫它印東西
- 看到 `new`，就代表「**自己準備**」，也就是在家自己印

</v-clicks>

<!--
在看程式之前，先認識一個英文字：new。

在 Java 裡，new 的意思就是「現在做一個新的出來」。

（下一步）所以 new HpPrinter，就是做一台新的 HP 印表機。

（下一步）前面這一段，是幫這台印表機取一個名字叫 printer。之後只要喊這個名字，就能叫它印東西。

（下一步）最重要的是這一點：以後你在程式裡看到 new，就代表「自己準備」，也就是小明在家自己買印表機。
-->

---

# 在家自己印：程式長這樣

<CodeSteps>

```java {all|2|4-6}
public class XiaoMing {
    private Printer printer = new HpPrinter();

    public void doHomework() {
        printer.print("小明的作業");
    }
}
```

- 這是「小明」的程式。現在不用每個字都看懂
- 只看這一行：小明**自己** `new` 了一台 HP 印表機
- 寫作業的時候，小明就叫這台印表機把作業印出來

</CodeSteps>

<!--
這就是在家自己印的小明，用程式寫出來的樣子。

第一眼看到一堆英文不要怕，現在不用每個字都看懂。

（下一步）你只要看第二行。有沒有看到 new？小明自己 new 了一台 HP 印表機。這就是在家自己買印表機。

（下一步）下面這幾行是說，小明寫作業的時候，會叫這台印表機把作業印出來。

所以整段程式的重點只有一個：印表機是小明自己準備的。
-->

---

# 在家印的麻煩：想換印表機就要改程式

<CodeSteps>

```java {1-2|4-5}
// 原本：HP 印表機
private Printer printer = new HpPrinter();

// 換成：Canon 印表機
private Printer printer = new CanonPrinter();
```

- 原本小明的程式裡，寫死了 `new HpPrinter()`
- 想換成 Canon，就得打開小明的程式，把這一行改掉

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>想一想：</b> 如果有 100 個地方都自己 <code>new</code> 了 HP 印表機，換成 Canon 要改幾次？這種「綁死」的狀況叫做<b>緊耦合</b>。
</div>

</v-click>

<!--
在家印的麻煩，在程式裡長這樣。

原本小明的程式裡，寫死了 new HpPrinter。

（下一步）HP 壞了，想換成 Canon，就必須打開小明的程式，把這一行改成 new CanonPrinter。就像故事裡，印表機壞了只能自己重買。

（下一步）想一想，如果有一百個地方都自己 new 了 HP 印表機，要改幾次？一百次。

這種兩個東西綁死在一起的狀況，有個名字叫做「緊耦合」。耦合就是「黏在一起」的意思，緊耦合就是黏得很緊，拆不開。
-->

---

# 去便利商店印：程式長這樣

<CodeSteps>

```java {all|2|4-6}
public class XiaoMing {
    private Printer printer;

    public void doHomework() {
        printer.print("小明的作業");
    }
}
```

- 找找看：整段程式裡，還有 `new` 嗎？
- 沒有了。小明只說「我需要一台 `Printer`」，沒有自己準備
- 寫作業時照樣叫它印，不用管拿到的是 HP 還是 Canon

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>那印表機從哪裡來？</b> 由 Spring 容器準備好交給小明，就像便利商店準備好印表機。Spring 是怎麼交的，下一章會說明。
</div>

</v-click>

<!--
現在換成去便利商店印。請大家玩一個找碴遊戲：這段程式跟剛剛那段，差在哪裡？

找找看，整段程式裡還有 new 嗎？

（下一步）沒有了。第二行只剩下「我需要一台 Printer」，後面的 new HpPrinter 不見了。小明沒有自己準備。

（下一步）下面寫作業的部分一個字都沒變，小明照樣叫印表機印作業。他不用管拿到的是 HP 還是 Canon。

（下一步）你可能會問：那印表機到底從哪裡來？答案是 Spring 容器會準備好交給小明，就像便利商店把印表機準備好。至於它是怎麼交的，這是下一章的內容。

今天只要記得一件事：去便利商店印的程式裡，沒有 new。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 這樣做有什麼好處？

<!--
最後一個部分。把事情交給 Spring 容器，到底有什麼好處？

我們一樣用便利商店來想，總共有三個。
-->

---

# 好處 1：想換就換，自己不用動

<Pairs left="印作業" right="寫程式" rows="printer,便利商店把機器換成彩色的=printer,把 HP 印表機換成 Canon|clerk,店家自己換就好=spring,改 Spring 的設定就好|you,小明照樣去印，完全不用動=code,小明的程式一行都不用改" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>這個好處的名字：</b> <b>鬆耦合（Loose Coupling）</b>。兩個東西沒有綁死，想換就換。
</div>

</v-click>

<!--
第一個好處：想換就換，自己不用動。

（下一步）便利商店決定把機器換成彩色的。對應到程式，把 HP 印表機換成 Canon。

（下一步）便利商店自己換就好。對應到程式，改 Spring 的設定就好。

（下一步）結果呢？小明照樣去印，完全不用動。小明的程式一行都不用改。

（下一步）這個好處有個名字，叫做「鬆耦合」。剛剛我們說綁死叫緊耦合，現在沒有綁死、想換就換，就叫鬆耦合。這是 IoC 最重要的好處。
-->

---

# 好處 2：從頭到尾有人幫你顧

<Pairs left="印作業" right="寫程式" rows="store,開店前：機器先開機、紙先放好=spring,要用之前：Spring 先把東西建立好|ink,營業中：缺紙補紙、沒墨水換墨水=spring,使用期間：Spring 負責保管|clerk,機器老舊：店家負責回收=spring,不用了：Spring 負責清掉" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>這個好處的名字：</b> <b>生命週期管理</b>。東西從出現到消失，都由 Spring 照顧。這些被 Spring 照顧的東西叫做 <b>Bean</b>，下一章會正式介紹。
</div>

</v-click>

<!--
第二個好處：從頭到尾有人幫你顧。

（下一步）便利商店開店之前，機器先開好、紙先放好。對應到程式，在你要用之前，Spring 會先把東西建立好。

（下一步）營業的時候，缺紙就補紙，沒墨水就換墨水。對應到程式，使用期間由 Spring 負責保管。

（下一步）機器老舊了，店家負責回收。對應到程式，東西不用了，Spring 負責清掉。

（下一步）這個好處叫做「生命週期管理」。生命週期聽起來很難，其實就是一個東西從出現到消失的整個過程。這些被 Spring 照顧的東西，有一個可愛的名字叫做 Bean，就是豆子。下一章我們會正式認識它。
-->

---

# 好處 3：測試很方便

想確認「小明會不會乖乖印作業」，不一定要準備一台真的印表機。

<v-clicks>

- 因為印表機是 Spring 給的，可以請 Spring 給小明一台「**假的印表機**」
- 假印表機不會真的印出紙，只會回報「小明有叫我印」
- 不用浪費紙和墨水，也能確認小明有好好寫作業

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> 這種「假的替身」叫做 <b>Mock</b>。現在聽過就好，後面講測試的章節會實際操作。
</div>

</v-click>

<!--
第三個好處：測試很方便。

假設我們想確認「小明會不會乖乖印作業」。一定要準備一台真的印表機嗎？不一定。

（下一步）因為印表機是 Spring 給的，我們可以請 Spring 給小明一台「假的印表機」。

（下一步）這台假印表機不會真的印出紙，它只會回報一件事：「小明有叫我印」。

（下一步）這樣不用浪費紙和墨水，也能確認小明有好好寫作業。如果是小明自己 new 的印表機，我們就沒辦法偷偷換成假的了。

（下一步）這種假的替身，叫做 Mock。這個字現在聽過就好，後面講測試的章節我們會實際操作。
-->

---

# 小測驗：換印表機要改哪裡？

<Poll question="想把 HP 印表機換成 Canon。用了 IoC 之後，要改哪裡？" options="小明（XiaoMing）的程式|Spring 的設定|每一個用到印表機的地方|印表機本身" answer="2" />

<!--
最後一題，這次是程式版的題目。

想把 HP 印表機換成 Canon，用了 IoC 之後，要改哪裡？

（等大家作答）

（下一步）答案是「Spring 的設定」。

還記得暖身題嗎？便利商店沒墨水了，是店家處理。這一題的邏輯一模一樣：印表機是 Spring 準備的，所以要換就找 Spring。選「小明的程式」的同學，那是在家自己印才需要做的事。
-->

---

# 一張圖複習今天的內容

<Pairs left="印作業" right="寫程式" rows="you,在家自己印：什麼都自己買=code,傳統寫法：自己 new|store,去便利商店：店家準備好=spring,IoC：Spring 容器準備好給你|clerk,換機器是店家的事=spring,鬆耦合：想換東西，只改設定|ink,補紙、換墨水店家顧=spring,生命週期管理：Spring 顧到底" />

<!--
我們用一張圖把今天的內容複習一次。

（下一步）在家自己印，什麼都自己買，對應到傳統寫法，自己 new。

（下一步）去便利商店，店家準備好，對應到 IoC，Spring 容器準備好給你。

（下一步）換機器是店家的事，對應到鬆耦合，想換東西只改設定。

（下一步）補紙、換墨水都是店家在顧，對應到生命週期管理，Spring 顧到底。

以後如果忘記 IoC 是什麼，就想「在家印，還是去便利商店印」。
-->

---

# 章節總結

<v-clicks>

- **IoC（控制反轉）**：需要的東西不自己準備，交給 Spring 容器準備好再給你
- **看到 `new`** 就是自己準備（在家印）；**沒有 `new`** 就是交給 Spring（去便利商店印）
- **三個好處**：想換就換（鬆耦合）、有人顧到底（生命週期管理）、測試方便

</v-clicks>

<v-click>

下一章我們會回答今天留下的問題：Spring 到底是怎麼把印表機「交到」小明手上的？

</v-click>

<!--
最後整理今天的三個重點。

（下一步）第一，IoC 控制反轉，就是需要的東西不自己準備，交給 Spring 容器準備好再給你。

（下一步）第二，看程式的時候，看到 new 就是自己準備，是在家印；沒有 new 就是交給 Spring，是去便利商店印。

（下一步）第三，這樣做有三個好處：想換就換、有人顧到底、測試方便。

（下一步）今天我們留了一個問題沒有回答：Spring 到底是怎麼把印表機交到小明手上的？這就是下一章的內容。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

如果覺得還是有點抽象，沒關係，只要記得「在家印，還是去便利商店印」這個畫面就夠了。後面幾章實際寫程式的時候，你會越來越有感覺。

有任何問題歡迎現在提出來。
-->
