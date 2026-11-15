---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
transition: slide-left
title: Spring Boot 介紹
routeAlias: ch01
layout: default
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
  .slidev-layout:not(.new-section) {
    background: #ffffff !important;
  }
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Spring Boot 介紹
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「踏入 Java 後端開發的第一步」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到 Spring Boot 後端課程的第一章！

這門課的目標，是帶大家用 Spring Boot 寫出真正能運作的後端程式。今天是第一堂，我們先不寫程式，先搞懂 Spring Boot 是什麼、為什麼大家都用它。

這一整個單元，我們都會用同一個故事來理解：小明要印作業。今天先認識小明，之後好幾章他都會一直出現。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **什麼是框架？** 用「小明印作業」的故事來理解
- **什麼是 Spring Boot？** 它和 Spring 是什麼關係
- **為什麼大家都用 Spring Boot？** 兩個最大的好處

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，什麼是框架。我們用小明印作業的故事來講。

（下一步）第二，什麼是 Spring Boot，它跟 Spring 又是什麼關係。

（下一步）第三，為什麼大家都用 Spring Boot，它最大的兩個好處是什麼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第一部分
# 先講一個故事：小明要印作業

<!--
我們先不管程式。

明天要交作業，小明今天晚上要把作業印出來。他有兩種做法。請大家注意一件事：小明的時間，都花到哪裡去了。
-->

---

# 做法一：在家自己印

<LifeIoc mode="home" variant="framework" />

<!--
第一種做法，在家自己印。

小明要印作業，可是家裡什麼都沒有。

（下一步）所以他要先上網研究、比價，把印表機、紙、墨水一樣一樣買回家。

（下一步）好不容易開始印，印到一半沒墨水了，又要自己處理。

（下一步）過一陣子機器壞了，也要自己修。結果一整個晚上都在弄機器，真正要做的作業反而還沒寫。
-->

---

# 做法二：去便利商店印

<LifeIoc mode="store" variant="framework" />

<!--
第二種做法，去便利商店印。

便利商店早就把印表機、紙、墨水都準備好了。

（下一步）小明走進去，只要說「我要印這份作業」。

（下一步）幾秒鐘就印好了。小明的時間，幾乎都花在作業本身。

（下一步）機器的事店家會顧，小明只要專心把作業寫好就可以了。
-->

---

# 小明的時間，花在哪裡？

| | 在家自己印 | 去便利商店印 |
| --- | --- | --- |
| **準備印表機、紙、墨水** | 自己研究、自己買 | 店家都準備好了 |
| **機器出問題** | 自己處理 | 店家處理 |
| **真正花在作業上的時間** | 很少 | 幾乎全部 |

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 便利商店把「每個人都會用到的東西」先準備好，小明就能把時間花在真正想做的事情上。
</div>

</v-click>

<!--
我們把兩種做法放在一起比較，看看小明的時間花在哪裡。

準備印表機、紙、墨水：在家要自己研究、自己買；去便利商店，店家都準備好了。

機器出問題：在家要自己處理；去便利商店，店家處理。

最後一列最重要：真正花在作業上的時間。在家印，很少；去便利商店，幾乎全部。

（下一步）所以便利商店真正幫上忙的地方，是它把「每個人都會用到的東西」先準備好，小明就能把時間花在真正想做的事情上，也就是寫作業。

請記住這句話，等一下我們馬上會用到。
-->

---

# 小測驗：便利商店幫了小明什麼？

<Poll question="去便利商店印作業，對小明最大的幫助是什麼？" options="印出來的顏色比較漂亮|不用自己準備機器，可以專心寫作業|可以一次印比較多張" answer="2" />

<!--
來一題暖身題。

去便利商店印作業，對小明最大的幫助是什麼？

（等大家作答）

（下一步）答案是「不用自己準備機器，可以專心寫作業」。

顏色漂亮、印比較多張，可能也是真的，但都不是重點。重點是小明不用再花時間處理機器了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第二部分
# 寫程式也是一樣

<!--
故事講完了。寫程式其實也是一模一樣的情況。

我們來看看，故事裡的每個角色，在寫程式的世界裡是誰。
-->

---

# 故事裡的角色，在寫程式時是誰？

<Pairs left="印作業" right="寫程式" rows="you,小明=code,寫程式的你（工程師）|doc,作業的內容=code,你的網站真正要做的功能|printer,印表機、紙、墨水=server,每個網站都需要的基本工作|store,便利商店=spring,框架" />

<!--
我們一個一個對照。

（下一步）小明，就是寫程式的你，也就是工程師。

（下一步）作業的內容，就是你的網站真正要做的功能。例如一個購物網站，真正要做的是「讓客人買東西」。

（下一步）印表機、紙、墨水，就是每個網站都需要的基本工作。例如：接收使用者打的網址、連接資料庫、出錯的時候要處理。不管你做什麼網站，這些事情都跑不掉。

（下一步）便利商店，就是我們今天的主角：框架。
-->

---

# 所以，什麼是框架？

<v-clicks>

- 每個網站都需要一些**一樣的基本工作**：接收網址、連資料庫、處理錯誤…
- 如果每次都自己從頭做，就像每次都在家自己買印表機
- **框架**把這些基本工作先做好，你只要專心寫網站真正的功能

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>一句話記起來：</b> 框架就是程式世界的便利商店，把大家都會用到的東西先準備好。
</div>

</v-click>

<!--
現在我們可以回答第一個問題了：什麼是框架？

（下一步）每個網站都需要一些一樣的基本工作，例如接收網址、連資料庫、處理錯誤。

（下一步）如果每做一個網站都自己從頭來，就像小明每次都要在家自己買印表機，時間都花在準備上。

（下一步）框架就是把這些基本工作先做好。你只要專心寫網站真正的功能，就像小明只要專心寫作業。

（下一步）一句話記起來：框架就是程式世界的便利商店，把大家都會用到的東西先準備好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第三部分
# 什麼是 Spring Boot？

<!--
知道什麼是框架之後，我們來認識今天的主角：Spring Boot。
-->

---

# Spring Boot：一間已經開門營業的便利商店

<v-clicks>

- **Spring**：Java 世界裡最多人用的後端框架
- **Boot**：英文是「開機」的意思，按下去就能用
- **Spring Boot**：把 Spring 該設定的都先設定好，打開就能直接開始寫程式

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>業界現況：</b> Java 後端的工作，幾乎都會要求「熟悉 Spring Boot」。這門課學的，就是業界每天在用的工具。
</div>

</v-click>

<!--
Spring Boot 這個名字可以拆成兩半來看。

（下一步）前面的 Spring，是 Java 世界裡最多人用的後端框架，也就是最大的那間便利商店。

（下一步）後面的 Boot，英文是「開機」的意思，代表按下去就能用。

（下一步）合起來，Spring Boot 就是把 Spring 該設定的都先設定好，打開就能直接開始寫程式。用我們的故事來說，它就是一間已經開門營業的便利商店，走進去就能印。

（下一步）順便說一下業界現況：Java 後端的工作，幾乎都會要求熟悉 Spring Boot。所以這門課學的東西，就是業界每天在用的工具。
-->

---

# Spring 和 Spring Boot 差在哪？

<Pairs left="便利商店" right="Spring" rows="store,店家拿到整批機器，還要自己組裝、接電、調設定=spring,Spring：功能齊全，但要自己寫很多設定|store,一間裝潢好、機器都開好的店=spring,Spring Boot：常用設定都幫你做好了|clerk,開店小幫手：幫你一鍵規劃好整間店=code,Spring Initializr：一鍵產生整個專案" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>不是取代：</b> Spring Boot 裡面用的還是 Spring，它只是把麻煩的設定都先幫你做好了。
</div>

</v-click>

<!--
那 Spring 和 Spring Boot 差在哪裡？我們繼續用便利商店來想。

（下一步）只有 Spring 的時候，就像店家拿到一整批機器，但還要自己組裝、接電、調設定，才能開始營業。功能很齊全，但要自己寫很多設定。

（下一步）Spring Boot 就像一間已經裝潢好、機器都開好的店。常用的設定都幫你做好了。

（下一步）另外還有一個工具叫 Spring Initializr，它就像開店小幫手，幫你一鍵把整間店規劃好。在程式裡，它可以一鍵產生整個專案。第三章我們就會用到它。

（下一步）要注意的是，Spring Boot 不是用來取代 Spring 的。它裡面用的還是 Spring，只是把麻煩的設定都先幫你做好了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第四部分
# 為什麼大家都用 Spring Boot？

<!--
最後我們來看，Spring Boot 最大的兩個好處。一樣，每個好處都先用便利商店來想。
-->

---

# 好處一：設定都先幫你調好

<Pairs left="便利商店" right="Spring Boot" rows="printer,紙張大小、黑白或彩色，店家先調成最常用的=spring,常用的設定都先設好（自動配置）|you,有特殊需求，再跟店員說=code,想改的時候才需要寫設定|store,機器插好電，按下按鈕就能印=server,內建網站伺服器，按執行就能啟動" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>這個做法的名字：</b> <b>約定優於配置</b>。照大家都習慣的方式做，就不用寫設定；想不一樣時才去改。
</div>

</v-click>

<!--
第一個好處：設定都先幫你調好。

（下一步）便利商店的印表機，紙張大小、黑白或彩色，店家都先調成最多人用的。對應到 Spring Boot，常用的設定它都先設好了，這叫做「自動配置」。

（下一步）如果你有特殊需求，例如要印 A3，再跟店員說就好。對應到程式，只有你想改的時候，才需要自己寫設定。

（下一步）便利商店的機器插好電，按下按鈕就能印。Spring Boot 也一樣，它內建了網站伺服器，按執行就能啟動，不用另外安裝。

（下一步）這個做法有一個名字，叫做「約定優於配置」。意思是：照大家都習慣的方式做，就不用寫設定；想不一樣的時候才去改。
-->

---

# 好處一：只要幾行程式，網站就跑起來

<CodeSteps>

```java {all|1|4}
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

- 這就是一個完整的 Spring Boot 程式，現在不用每個字都看懂
- `@SpringBootApplication`：告訴 Spring Boot「從這裡開始」
- 這一行就是「按下開機鍵」，網站就跑起來了

</CodeSteps>

<!--
這就是一個完整的 Spring Boot 程式，只有短短幾行。現在不用每個字都看懂。

（下一步）第一行這個 @SpringBootApplication，是在告訴 Spring Boot：「從這裡開始」。

（下一步）中間這一行，就是按下開機鍵。執行之後，網站就跑起來了。

在沒有 Spring Boot 的年代，光是讓網站跑起來，就要寫一大堆設定檔。現在只要這樣就好，這就是「設定都先幫你調好」的威力。
-->

---

# 好處二：Starter，就像整組配好的套餐

<Pairs left="便利商店" right="Spring Boot" rows="paper,要印照片：相片紙和相片印表機一整組=code,要做網站：加一個 starter-web 就有一整組|ink,不用一樣一樣挑，也不怕紙和機器不合=code,版本都幫你配好，不會互相衝突" />

<v-click>

```groovy
implementation 'org.springframework.boot:spring-boot-starter-web'
```

</v-click>

<!--
第二個好處：Starter，就像整組配好的套餐。

（下一步）假設小明這次要印照片。便利商店不會叫他自己去找相片紙、再找一台能印照片的機器，而是直接提供一整組。對應到 Spring Boot，你要做網站，只要加一個叫 starter-web 的東西，做網站需要的工具就一整組都有了。

（下一步）而且不用一樣一樣挑，也不怕紙和機器不合。對應到程式，這一整組工具的版本都幫你配好了，不會互相衝突。

（下一步）實際寫起來，就是這一行。現在不用看懂，之後建立專案的時候會再看到它。
-->

---

# 搶先看：這門課最後會寫出什麼

學完這門課，大家會寫出像這樣的程式：

```java
@RestController
public class MyController {

    @RequestMapping("/test")
    public String test() {
        System.out.println("Hi!");
        return "Hello World";
    }
}
```

<v-click>

用瀏覽器打開 `http://localhost:8080/test`，就會看到「Hello World」。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>不用擔心：</b> 現在看不懂完全正常，後面的章節會一步一步帶大家寫出來。
</div>

</v-click>

<!--
最後給大家看一下，這門課會寫出什麼樣的程式。

這段程式現在看不懂完全沒關係，我只是想讓大家知道，我們的目標其實沒有那麼遙遠。

（下一步）把這段程式跑起來之後，用瀏覽器打開這個網址，畫面上就會出現 Hello World。

這就是你的第一個後端程式。後面的章節會一步一步帶大家寫出來。
-->

---

# 小測驗：用了 Spring Boot 之後

<Poll question="用了 Spring Boot 之後，工程師的時間主要會花在哪裡？" options="安裝和設定各種工具|寫網站真正需要的功能|研究各種工具的版本合不合" answer="2" />

<!--
最後一題，這次是程式版的題目。

用了 Spring Boot 之後，工程師的時間主要會花在哪裡？

（等大家作答）

（下一步）答案是「寫網站真正需要的功能」。

這題跟暖身題是同一個邏輯。便利商店讓小明專心寫作業；Spring Boot 讓工程師專心寫功能。安裝設定、研究版本，這些就像在家弄印表機，Spring Boot 都幫你處理掉了。
-->

---

# 一張圖複習今天的內容

<Pairs left="印作業" right="寫程式" rows="you,在家自己印：什麼都自己準備=code,不用框架：每個網站都從頭做|store,去便利商店印=spring,用框架：基本工作都準備好了|store,一間開好的店，走進去就能印=spring,Spring Boot|printer,機器先調好，特殊需求再說=spring,約定優於配置|paper,一整組配好的套餐=code,Starter" />

<!--
我們用一張圖把今天的內容複習一次。

（下一步）在家自己印，什麼都自己準備，就是不用框架，每個網站都從頭做。

（下一步）去便利商店印，就是用框架，基本工作都準備好了。

（下一步）一間開好的店，走進去就能印，就是 Spring Boot。

（下一步）機器先調好、特殊需求再說，就是約定優於配置。

（下一步）一整組配好的套餐，就是 Starter。
-->

---

# 章節總結

<v-clicks>

- **框架**：程式世界的便利商店，把每個網站都需要的基本工作先準備好
- **Spring Boot**：一間已經開好的便利商店，Spring 的設定都先幫你做好了
- **好處一**：設定都先調好（約定優於配置），幾行程式就能啟動網站
- **好處二**：Starter 像套餐，一次拿到一整組配好版本的工具

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
🚀 <b>下一章：</b> 安裝 MySQL、Git 與 GitHub Desktop，為正式寫程式做好準備！
</div>

</v-click>

<!--
最後整理今天的重點。

（下一步）框架，是程式世界的便利商店，把每個網站都需要的基本工作先準備好。

（下一步）Spring Boot，是一間已經開好的便利商店，Spring 的設定都先幫你做好了。

（下一步）它的第一個好處是設定都先調好，幾行程式就能啟動網站。

（下一步）第二個好處是 Starter，像套餐一樣，一次拿到一整組配好版本的工具。

（下一步）下一章，我們要安裝 MySQL、Git 和 GitHub Desktop，為正式寫程式做好準備。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

請大家記住小明和便利商店，接下來好幾章，他們都會一直出現，幫我們理解 Spring 的各種觀念。

有任何問題歡迎現在提出來。
-->
