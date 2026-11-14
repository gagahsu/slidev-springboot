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

這個名字聽起來很嚇人，但它講的事情其實很生活化。今天我們幾乎不寫程式，我會先用「露營」跟「住飯店」這兩件事來講，聽懂故事之後，再回頭看程式，你會發現它們是同一回事。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **IoC 到底是什麼？** 用「露營」和「住飯店」的故事來理解
- **程式裡的 IoC 長什麼樣子？** 老師和印表機的例子
- **這樣寫有什麼好處？** 為什麼大家都愛用 Spring

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>放輕鬆：</b> 今天幾乎不寫程式，先把觀念聽懂就好。
</div>

</v-click>

<!--
今天只要搞懂三件事。

（下一步）第一，IoC 到底是什麼。我會用露營和住飯店的故事來講。

（下一步）第二，這個觀念放到程式裡長什麼樣子。我們會用老師和印表機當例子。

（下一步）第三，這樣寫到底有什麼好處，為什麼大家都愛用 Spring。

（下一步）先跟大家說，今天幾乎不寫程式。如果你是第一次接觸，完全不用緊張，把故事聽懂就成功一大半了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 先講一個故事：出門過夜

<!--
我們先完全不管程式。

假設這個週末你想出門玩，而且要在外面過夜。過夜就需要睡覺的地方、吃飯的東西、盥洗的用品。

要解決這件事，有兩種完全不同的做法。
-->

---

# 做法一：自己去露營

<LifeIoc mode="camping" />

<!--
第一種做法是去露營。

你想出去玩，要過夜，就得有地方睡、有東西吃。

（下一步）露營的話，帳篷、背包、鍋子、瓦斯爐，每一樣都要自己買、自己帶。

（下一步）到了營地，瓦斯爐打不著了。怎麼辦？沒有人會幫你，只能自己想辦法。

（下一步）下次想換一頂大一點的帳篷？一樣，自己重新買、自己重新搭。

大家有沒有發現，露營的時候，每一樣東西都跟「你」綁在一起：你準備、你保管、壞了你處理。請先記住這個感覺。
-->

---

# 做法二：住飯店

<LifeIoc mode="hotel" />

<!--
第二種做法是住飯店。

你還沒到，飯店就已經把床、毛巾、牙刷都準備好了，放在它那邊。

（下一步）你到了之後，只要跟櫃台說一句話：「我要一間房」。你不用說毛巾要哪個牌子、床是哪家工廠做的。

（下一步）飯店就把這些東西送進你的房間。你兩手空空來就可以了。

（下一步）住到一半，毛巾髒了。你需要自己去買新的嗎？不用，飯店會換一條新的給你。

同樣是過夜，這次東西不是你準備的，壞了也不是你處理的。你只負責一件事：說出你需要什麼。
-->

---

# 兩種做法，差在「誰負責」

| | 露營 | 住飯店 |
| --- | --- | --- |
| **東西誰準備？** | 你自己 | 飯店 |
| **壞了誰處理？** | 你自己 | 飯店 |
| **想換別的款式？** | 自己重買 | 跟飯店說一聲 |

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵：</b> 「準備東西」這件事的<b>主導權</b>，從你手上交到了飯店手上。主導權換人，這就叫做<b>控制反轉</b>。
</div>

</v-click>

<!--
我們把兩種做法放在一起比較。

東西誰準備？露營是你自己，住飯店是飯店。壞了誰處理？露營是你自己，住飯店是飯店。想換別的款式？露營要自己重買，住飯店只要跟飯店說一聲。

三個問題的答案都一樣：露營是「你」，住飯店是「飯店」。

（下一步）所以這兩種做法真正的差別，是「準備東西」這件事的主導權在誰手上。本來在你手上，現在交給了飯店。主導權換了人，這件事有一個聽起來很厲害的名字，叫做「控制反轉」。

沒錯，這就是今天的主角 IoC。你其實已經懂了。
-->

---

# 小測驗：毛巾髒了怎麼辦？

<Poll question="你住在飯店，房間的毛巾髒了。誰要負責換一條新的？" options="你自己出門買一條|飯店幫你換|隔壁的房客" answer="2" />

<!--
來一題暖身題，確認大家有跟上。

你住在飯店，房間的毛巾髒了，誰要負責換一條新的？有開課堂連線的同學可以直接用手機選。

（等大家作答）

（下一步）答案是飯店幫你換。

這題很簡單，但請記住這個答案。等一下我們會把「飯店」換成一個程式裡的東西，題目的邏輯完全一樣。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 把故事搬進程式裡

<!--
故事聽懂了，現在我們把它搬進程式的世界。

故事的結構完全不變，只是把裡面的角色換掉。
-->

---

# 程式裡的角色：老師和印表機

老師要印講義，所以他需要一台印表機。把剛剛的故事對照過來：

<Pairs left="住飯店" right="寫程式" rows="you,你（房客）=teacher,老師 Teacher|towel,毛巾、牙刷這些用品=printer,印表機 Printer|hotel,飯店=spring,Spring 容器|staff,飯店把用品送進你房間=spring,Spring 把印表機交給老師" />

<!--
在程式的世界裡，我們的主角是一位老師。老師要印講義，所以他需要一台印表機。

我們把剛剛的故事一個一個對照過來。

（下一步）房客，也就是你，對應到「老師」。在程式裡它叫做 Teacher。

（下一步）毛巾、牙刷這些你會用到的東西，對應到「印表機」，程式裡叫 Printer。

（下一步）飯店，對應到一個叫做「Spring 容器」的東西。現在先把它想成「程式世界裡的飯店」就好。

（下一步）最後，飯店把用品送進你房間，對應到 Spring 把印表機交給老師。

角色換了，但故事是同一個。
-->

---

# 圖解：老師自己準備印表機

<IocDemo mode="traditional" />

<!--
我們先看「露營模式」，也就是老師什麼都自己來。

一開始，老師想印講義，需要一台印表機。

（下一步）老師自己準備了一台 HP 印表機。請注意中間那條線，老師和這台 HP 印表機被綁在一起了。

（下一步）有一天，HP 印表機壞了，老師想換成 Canon 的。

（下一步）因為當初是老師自己準備的，所以現在只能回頭去改老師自己。這就像露營時瓦斯爐壞了，只能自己想辦法。

如果全校有一百位老師都是自己準備 HP 印表機，那就要改一百次。
-->

---

# 圖解：Spring 幫老師準備印表機

<IocDemo mode="ioc" />

<!--
接著看「飯店模式」。

左邊綠色的框就是 Spring 容器，也就是我們的飯店。它已經把 HP 和 Canon 兩台印表機都準備好了。右邊是老師，他手上的位置現在是空的。

（下一步）老師只說一句話：「我需要一台印表機」。他不指定牌子，就像你跟櫃台說「我要一間房」。

（下一步）Spring 容器就把 HP 印表機交到老師手上。這個「交到手上」的動作，下一章會給它一個正式的名字。

（下一步）想換成 Canon？跟 Spring 說一聲，它就改送 Canon 過去。請看老師這邊，完全沒有動。
-->

---

# 所以，什麼是 IoC？

**IoC** 是 **Inversion of Control** 的縮寫，中文叫做**控制反轉**。

<v-clicks>

- **控制**：決定「要用哪一個東西、由誰來準備」的權力
- **反轉**：這個權力從「自己」手上，換到「別人」手上
- 在 Spring 裡，這個「別人」就是 **Spring 容器**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> 需要的東西不要自己準備，交給 Spring 容器準備好，再拿給你用。
</div>

</v-click>

<!--
現在可以正式介紹這個名字了。IoC 是三個英文字的縮寫，中文叫做控制反轉。我們把這四個字拆開來看。

（下一步）「控制」，指的是決定要用哪一個東西、由誰來準備的權力。

（下一步）「反轉」，是說這個權力換人了，從自己手上換到別人手上。

（下一步）在 Spring 的世界裡，這個「別人」就是 Spring 容器。

（下一步）如果只能記一句話，就記這一句：需要的東西不要自己準備，交給 Spring 容器準備好，再拿給你用。

就這樣，沒有更複雜的了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 看一點點程式碼

<!--
觀念懂了，我們來看一點點程式碼，只有一點點。

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
- 看到 `new`，就代表「**自己準備**」，也就是露營模式

</v-clicks>

<!--
在看程式之前，先認識一個英文字：new。

在 Java 裡，new 的意思就是「現在做一個新的出來」。

（下一步）所以 new HpPrinter，就是做一台新的 HP 印表機。

（下一步）前面這一段，是幫這台印表機取一個名字叫 printer。之後只要喊這個名字，就能叫它印東西。

（下一步）最重要的是這一點：以後你在程式裡看到 new，就代表「自己準備」。也就是我們說的露營模式。
-->

---

# 露營模式的程式碼

<CodeSteps>

```java {all|2|4-6}
public class Teacher {
    private Printer printer = new HpPrinter();

    public void teach() {
        printer.print("I'm a teacher");
    }
}
```

- 這是「老師」的程式。現在不用每個字都看懂
- 只看這一行：老師**自己** `new` 了一台 HP 印表機
- 上課的時候，老師就叫這台印表機印東西

</CodeSteps>

<!--
這就是露營模式的老師，用程式寫出來的樣子。

第一眼看到一堆英文不要怕，現在不用每個字都看懂。

（下一步）你只要看第二行。有沒有看到 new？老師自己 new 了一台 HP 印表機。這就是「自己準備」。

（下一步）下面這幾行是說，老師上課的時候，會叫這台印表機印東西。

所以整段程式的重點只有一個：印表機是老師自己準備的。
-->

---

# 露營模式的麻煩：想換就要改程式

<CodeSteps>

```java {1-2|4-5}
// 原本：HP 印表機
private Printer printer = new HpPrinter();

// 換成：Canon 印表機
private Printer printer = new CanonPrinter();
```

- 原本老師的程式裡，寫死了 `new HpPrinter()`
- 想換成 Canon，就得打開老師的程式，把這一行改掉

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>想一想：</b> 如果有 100 個地方都自己 <code>new</code> 了 HP 印表機，換成 Canon 要改幾次？這種「綁死」的狀況叫做<b>緊耦合</b>。
</div>

</v-click>

<!--
露營模式的麻煩，在程式裡長這樣。

原本老師的程式裡，寫死了 new HpPrinter。

（下一步）想換成 Canon，就必須打開老師的程式，把這一行改成 new CanonPrinter。

（下一步）想一想，如果有一百個地方都自己 new 了 HP 印表機，要改幾次？一百次。

這種兩個東西綁死在一起的狀況，有個名字叫做「緊耦合」。耦合就是「黏在一起」的意思，緊耦合就是黏得很緊，拆不開。
-->

---

# 飯店模式的程式碼

<CodeSteps>

```java {all|2|4-6}
public class Teacher {
    private Printer printer;

    public void teach() {
        printer.print("I'm a teacher");
    }
}
```

- 找找看：整段程式裡，還有 `new` 嗎？
- 沒有了。老師只說「我需要一台 `Printer`」，沒有自己準備
- 上課時照樣叫它印東西，不用管拿到的是 HP 還是 Canon

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>那印表機從哪裡來？</b> 由 Spring 容器準備好交給老師。Spring 是怎麼交的，下一章會說明。
</div>

</v-click>

<!--
現在換成飯店模式。請大家玩一個找碴遊戲：這段程式跟剛剛那段，差在哪裡？

找找看，整段程式裡還有 new 嗎？

（下一步）沒有了。第二行只剩下「我需要一台 Printer」，後面的 new HpPrinter 不見了。老師沒有自己準備。

（下一步）下面上課的部分一個字都沒變，老師照樣叫印表機印東西。他不用管拿到的是 HP 還是 Canon。

（下一步）你可能會問：那印表機到底從哪裡來？答案是 Spring 容器會準備好，交給老師。至於它是怎麼交的，這是下一章的內容。

今天只要記得一件事：飯店模式的程式裡，沒有 new。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 這樣做有什麼好處？

<!--
最後一個部分。把事情交給 Spring 容器，到底有什麼好處？

我們一樣用飯店來想，總共有三個。
-->

---

# 好處 1：想換就換，自己不用動

<Pairs left="住飯店" right="寫程式" rows="towel,想換一條大一點的毛巾=printer2,想把 HP 印表機換成 Canon|staff,跟櫃台說一聲就好=spring,改 Spring 的設定就好|you,你自己完全不用動=teacher,老師的程式一行都不用改" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>這個好處的名字：</b> <b>鬆耦合（Loose Coupling）</b>。兩個東西沒有綁死，想換就換。
</div>

</v-click>

<!--
第一個好處：想換就換，自己不用動。

（下一步）住飯店的時候，想換一條大一點的毛巾。寫程式的時候，想把 HP 印表機換成 Canon。

（下一步）住飯店，跟櫃台說一聲就好。寫程式，改 Spring 的設定就好。

（下一步）結果呢？你自己完全不用動，老師的程式一行都不用改。

（下一步）這個好處有個名字，叫做「鬆耦合」。剛剛我們說綁死叫緊耦合，現在沒有綁死、想換就換，就叫鬆耦合。這是 IoC 最重要的好處。
-->

---

# 好處 2：從頭到尾有人幫你顧

<Pairs left="住飯店" right="寫程式" rows="bed,入住前：房間先整理好=spring,要用之前：Spring 先把東西建立好|towel,住的時候：缺什麼就補什麼=spring,使用期間：Spring 負責保管|staff,退房後：飯店負責收拾=spring,不用了：Spring 負責清掉" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>這個好處的名字：</b> <b>生命週期管理</b>。東西從出現到消失，都由 Spring 照顧。這些被 Spring 照顧的東西叫做 <b>Bean</b>，下一章會正式介紹。
</div>

</v-click>

<!--
第二個好處：從頭到尾有人幫你顧。

（下一步）入住之前，飯店會先把房間整理好。對應到程式，在你要用之前，Spring 會先把東西建立好。

（下一步）住的時候，缺什麼飯店就補什麼。對應到程式，使用期間由 Spring 負責保管。

（下一步）退房之後，飯店負責收拾。對應到程式，東西不用了，Spring 負責清掉。

（下一步）這個好處叫做「生命週期管理」。生命週期聽起來很難，其實就是一個東西從出現到消失的整個過程。這些被 Spring 照顧的東西，有一個可愛的名字叫做 Bean，就是豆子。下一章我們會正式認識它。
-->

---

# 好處 3：測試很方便

想確認「老師會不會上課」，不一定要搬一台真的印表機來。

<v-clicks>

- 飯店拍宣傳照的時候，可以先擺「展示用」的道具
- 程式也一樣，可以請 Spring 給老師一台「**假的印表機**」
- 假印表機不會真的印，只會回報「老師有叫我印」
- 這樣不用真的機器，也能確認老師有好好工作

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> 這種「假的替身」叫做 <b>Mock</b>。現在聽過就好，後面講測試的章節會實際操作。
</div>

</v-click>

<!--
第三個好處：測試很方便。

假設我們想確認「老師會不會上課」。一定要搬一台真的印表機來嗎？不一定。

（下一步）飯店拍宣傳照的時候，房間裡擺的可能是展示用的道具。

（下一步）程式也一樣。因為印表機是 Spring 給的，我們可以請 Spring 給老師一台「假的印表機」。

（下一步）這台假印表機不會真的印出紙，它只會回報一件事：「老師有叫我印」。

（下一步）這樣我們不需要真的機器，也能確認老師有好好工作。

（下一步）這種假的替身，叫做 Mock。這個字現在聽過就好，後面講測試的章節我們會實際操作。
-->

---

# 小測驗：換印表機要改哪裡？

<Poll question="老師想把 HP 印表機換成 Canon。用了 IoC 之後，要改哪裡？" options="老師（Teacher）的程式|Spring 的設定|每一個用到印表機的地方|印表機本身" answer="2" />

<!--
最後一題，這次是程式版的題目。

老師想把 HP 印表機換成 Canon，用了 IoC 之後，要改哪裡？

（等大家作答）

（下一步）答案是「Spring 的設定」。

還記得暖身題嗎？毛巾髒了，是飯店換。這一題的邏輯一模一樣：印表機是 Spring 準備的，所以要換就找 Spring。選「老師的程式」的同學，那是露營模式才需要做的事。
-->

---

# 一張圖複習今天的內容

<Pairs left="生活" right="程式" rows="tent,露營：什麼都自己來=code,傳統寫法：自己 new|hotel,住飯店：別人準備好給你=spring,IoC：Spring 容器準備好給你|staff,想換用品，找櫃台=spring,鬆耦合：想換東西，只改設定|bed,房間從頭到尾飯店顧=spring,生命週期管理：Spring 顧到底" />

<!--
我們用一張圖把今天的內容複習一次。

（下一步）露營是什麼都自己來，對應到傳統寫法，自己 new。

（下一步）住飯店是別人準備好給你，對應到 IoC，Spring 容器準備好給你。

（下一步）想換用品找櫃台，對應到鬆耦合，想換東西只改設定。

（下一步）房間從頭到尾飯店顧，對應到生命週期管理，Spring 顧到底。

以後如果忘記 IoC 是什麼，就想「露營還是住飯店」。
-->

---

# 章節總結

<v-clicks>

- **IoC（控制反轉）**：需要的東西不自己準備，交給 Spring 容器準備好再給你
- **看到 `new`** 就是自己準備（露營）；**沒有 `new`** 就是交給 Spring（住飯店）
- **三個好處**：想換就換（鬆耦合）、有人顧到底（生命週期管理）、測試方便

</v-clicks>

<v-click>

下一章我們會回答今天留下的問題：Spring 到底是怎麼把印表機「交到」老師手上的？

</v-click>

<!--
最後整理今天的三個重點。

（下一步）第一，IoC 控制反轉，就是需要的東西不自己準備，交給 Spring 容器準備好再給你。

（下一步）第二，看程式的時候，看到 new 就是自己準備，是露營；沒有 new 就是交給 Spring，是住飯店。

（下一步）第三，這樣做有三個好處：想換就換、有人顧到底、測試方便。

（下一步）今天我們留了一個問題沒有回答：Spring 到底是怎麼把印表機交到老師手上的？這就是下一章的內容。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

如果覺得還是有點抽象，沒關係，只要記得「露營還是住飯店」這個畫面就夠了。後面幾章實際寫程式的時候，你會越來越有感覺。

有任何問題歡迎現在提出來。
-->
