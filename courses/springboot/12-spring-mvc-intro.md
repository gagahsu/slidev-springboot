---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring MVC 簡介
routeAlias: ch12
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
    Spring MVC 簡介
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「前後端溝通的橋樑，其實你早就在用了」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十二章。

前面十一章，我們都跟著小明去便利商店印作業，學的是 Spring 內部怎麼管理物件。

從這一章開始換一個場景：我們要去一間手搖飲店。接下來整個單元，都會用這間店來學「前端和後端怎麼溝通」。

今天這章沒有新的程式要寫，只要聽懂故事就可以了。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **前端和後端各自在做什麼？** 逛一間手搖飲店就知道
- **MVC 是什麼？** 一杯飲料是三個角色分工做出來的
- **Spring MVC 在哪裡？** 其實第三章就用過了

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，前端和後端各自在做什麼。我們去逛一間手搖飲店就知道了。

（下一步）第二，MVC 這三個字母是什麼意思。先劇透：一杯飲料，是三個角色分工做出來的。

（下一步）第三，Spring MVC 到底在哪裡。答案是，你在第三章就已經用過它了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 先逛一間手搖飲店

<!--
我們先不談程式。請大家回想一下，你上一次去買手搖飲的時候，那間店長什麼樣子。
-->

---

# 一間店，分成兩個區域

<ShopLayout />

<!--
小明今天不印作業了，他想喝飲料，所以走進一間手搖飲店。

（下一步）他一進門看到的是店面：牆上有菜單看板，前面有櫃台。這些東西，客人看得到，也摸得到。

（下一步）櫃台後面是吧台。機器、茶葉、珍珠、做法，全部都在那裡。客人平常不會注意，也看不清楚裡面在做什麼。

（下一步）重點來了。小明想喝飲料，可以自己走進吧台動手做嗎？不行。他只能走到櫃台，跟店員點單。

這個「只能在櫃台點單」的規矩，請先記住。
-->

---

# 把店面搬到網站上

<Pairs left="飲料店" right="網站" rows="shop,店面：菜單看板、櫃台=browser,前端（Frontend）：畫面、按鈕、排版|machine,吧台：機器、材料、做法=server,後端（Backend）：資料、規則、計算|no,客人不能自己進吧台=no,前端不能直接碰資料庫|form,只能在櫃台點單=code,只能透過 API 向後端要資料" />

<!--
現在把這間店搬到網站上。

（下一步）店面，就是前端。你打開一個網站，看到的畫面、按鈕、顏色、排版，都是前端的工作。

（下一步）吧台，就是後端。商品的名稱、價格、庫存，還有「滿一百打九折」這種規則，都是後端在處理。我們這門課寫的 Spring Boot，就是後端。

（下一步）客人不能自己進吧台。對應到網站：前端不能自己去翻資料庫。

（下一步）客人只能在櫃台點單。對應到網站：前端只能透過 API 向後端要資料。API 這個詞第一次出現，你可以先把它想成「後端開放的點單窗口」。
-->

---

# 前端和後端怎麼合作？

<Flow nodes="小明:前端|櫃台:API|吧台:後端" steps="1>2:我要一杯珍珠奶茶|2>3:把單子交給後面|3>2:做好了|2>1:你的珍珠奶茶" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>一句話：</b>前端負責「問」，後端負責「答」，API 是兩邊約好的窗口。
</div>

</v-click>

<!--
我們看一次完整的過程。

（下一步）小明走到櫃台說：我要一杯珍珠奶茶。

（下一步）櫃台把單子交給後面的吧台。

（下一步）吧台做好了，交回櫃台。

（下一步）櫃台把珍珠奶茶交給小明。

網站也是一樣。你在購物網站按下「看商品」，前端就向後端發一個請求；後端去資料庫把商品找出來，再回傳給前端；前端把資料排成漂亮的畫面給你看。

（下一步）所以一句話：前端負責問，後端負責答，API 是兩邊約好的窗口。
-->

---

# 小測驗：這是誰的工作？

<Poll question="飲料店決定「珍珠奶茶從 50 元漲到 55 元」。在網站上，這個價格是誰在管？" options="前端：因為價格顯示在畫面上|後端：因為價格是資料|兩邊各存一份" answer="2" />

<!--
來一題暖身。

飲料店決定珍珠奶茶從 50 元漲到 55 元。在網站上，這個價格是誰在管？先在心裡選一個答案。

（等大家作答）

（下一步）答案是後端。

價格雖然「顯示」在畫面上，但它是一筆資料，存在後端的資料庫裡。前端只是把後端給的數字印出來。就像菜單看板上的價格是老闆決定的，看板只負責把它寫出來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 什麼是 MVC？

<!--
知道前端和後端要透過櫃台溝通之後，我們走近一點，看看後端這一邊裡面是怎麼分工的。

這個分工方式有一個名字，叫做 MVC。
-->

---

# 一杯飲料，三個角色

<ShopLayout mode="mvc" />

<!--
一杯飲料送到你手上，其實是三個角色分工的結果。

（下一步）第一個角色是櫃台店員。他不做飲料，他只做兩件事：接你的單，然後把單子轉交給後面。

（下一步）第二個角色是吧台。這裡有材料、有機器、有做法，真的把飲料做出來的是這裡。

（下一步）第三個角色是做好的那杯飲料，也就是客人最後拿到手上的東西。

三個角色各做各的。店員不用會煮珍珠，吧台不用面對客人。
-->

---

# 三個角色的英文名字

<Pairs left="飲料店" right="MVC" rows="clerk,櫃台店員：接單、轉交=code,Controller（控制器）|machine,吧台：材料和做法=code,Model（模型）：資料和處理規則|cup,拿到手上的飲料=code,View（視圖）：回傳給前端的結果" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>MVC</b> = <b>M</b>odel + <b>V</b>iew + <b>C</b>ontroller。每個角色只做自己的事。
</div>

</v-click>

<!--
這三個角色各有一個英文名字。

（下一步）櫃台店員，叫做 Controller，中文是控制器。它負責接住前端的請求，再決定交給誰處理。

（下一步）吧台，叫做 Model，中文是模型。它是資料本身，加上處理資料的規則。

（下一步）拿到手上的飲料，叫做 View，中文是視圖。它是最後回傳給前端的結果。在我們這門課裡，回傳的通常是一種叫 JSON 的文字格式，第十五章會學。

（下一步）把三個字的第一個字母合起來，就是 MVC。它的精神只有一句：每個角色只做自己的事。
-->

---

# Spring MVC 是什麼？

**Spring MVC：Spring Boot 裡負責「前後端溝通」的那一部分。**

它幫我們做三件事：

<v-clicks>

- **接住請求**：前端發來的請求，送到對的 Controller 手上
- **讀懂內容**：把請求裡帶的資料拿出來，交給我們的程式
- **包好回應**：把程式的結果包成前端看得懂的格式送回去

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這三件事都由 Spring MVC 代勞，我們只要專心寫「飲料怎麼做」。
</div>

</v-click>

<!--
那 Spring MVC 是什麼？它就是 Spring Boot 裡，負責前後端溝通的那一部分。

它幫我們做三件事。

（下一步）第一，接住請求。前端發來的請求，它會送到對的 Controller 手上。

（下一步）第二，讀懂內容。請求裡帶了什麼資料，它幫我們拿出來。

（下一步）第三，包好回應。我們的程式算出結果之後，它會包成前端看得懂的格式送回去。

（下一步）這三件事都很瑣碎。有了 Spring MVC，我們只要專心寫「飲料怎麼做」就好。這和第一單元學到的想法是一樣的：麻煩的事交給框架。
-->

---

# 一個請求進來之後

<Flow nodes="前端|接待:DispatcherServlet|櫃台店員:Controller" steps="1>2:發送請求|2>3:這張單是你負責的|3>2:做好了，結果在這裡|2>1:包成回應送回去" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>DispatcherServlet</b> 是 Spring MVC 內建的「接待」。我們不用寫它，只要寫 Controller。
</div>

</v-click>

<!--
一間店如果有很多個櫃台，門口通常會有一位接待，告訴你該去哪一個櫃台。Spring MVC 裡也有這個角色。

（下一步）前端發送請求。所有請求都會先到接待手上。它的名字很長，叫 DispatcherServlet，第三章出現過一次。

（下一步）接待看一下請求的網址，找到負責的 Controller，把單子交過去。

（下一步）Controller 處理完，把結果交回來。

（下一步）接待把結果包成回應，送回前端。

（下一步）DispatcherServlet 是 Spring MVC 內建的，我們一行都不用寫。我們要寫的只有 Controller。
-->

---

# 小測驗：誰是櫃台店員？

<Poll question="在 MVC 裡，負責「接住前端的請求，再轉交給後面處理」的是哪一個角色？" options="Model|View|Controller" answer="3" />

<!--
再來一題。

在 MVC 裡，負責接住前端的請求，再轉交給後面處理的，是哪一個角色？

（等大家作答）

（下一步）答案是 Controller。

它就是櫃台店員。接下來幾章，我們寫的程式幾乎都是 Controller，所以這個字請一定要記住。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 其實我們早就用過了

<!--
講了這麼多，你可能覺得 Spring MVC 是一個全新的東西。

其實不是。我們回頭看第三章寫的第一支程式。
-->

---

# 回顧第三章的程式

<CodeSteps>

```java {1-2|4|5-7|all}
@RestController
public class MyController {

    @RequestMapping("/test")
    public String test() {
        return "Hello World";
    }
}
```

- `@RestController`：這個類別是一位「櫃台店員」（Controller）
- `@RequestMapping("/test")`：網址是 `/test` 的請求，交給下面這個方法
- 方法回傳的 `"Hello World"`，就是交給客人的「飲料」
- 這三樣東西，全部都是 Spring MVC 提供的

</CodeSteps>

<!--
這是第三章的程式。當時我們在瀏覽器輸入 localhost:8080/test，畫面上就出現 Hello World。

現在用飲料店的眼光重新看一次。

（第一步）@RestController，是在告訴 Spring：這個類別是一位櫃台店員，也就是 Controller。

（下一步）@RequestMapping("/test")，是在說：網址是 /test 的請求，交給下面這個方法處理。

（下一步）方法回傳的 Hello World，就是交給客人的那杯飲料。

（下一步）這三樣東西，全部都是 Spring MVC 提供的。所以我們從第三章開始，就一直在用 Spring MVC，只是當時還不知道它的名字。
-->

---

# 接下來要學什麼？

這個單元會一直待在這間手搖飲店：

<v-clicks>

- **點單長什麼樣子？** Http 協議（第 13 章）
- **哪一種飲料找哪一位店員？** `@RequestMapping`（第 14 章）
- **飲料用什麼包裝交給客人？** JSON 和 `@RestController`（第 15、16 章）
- **客人怎麼告訴店員甜度冰塊？** 接收前端的參數（第 17～19 章）
- **全店統一的點單規則** RESTful API（第 20、21 章）

</v-clicks>

<!--
最後看一下接下來的路線。這個單元我們會一直待在這間手搖飲店。

（下一步）第十三章，看點單長什麼樣子，也就是 Http 協議。

（下一步）第十四章，學哪一種飲料要找哪一位店員，也就是 @RequestMapping。

（下一步）第十五、十六章，學飲料用什麼包裝交給客人，也就是 JSON 和 @RestController。

（下一步）第十七到十九章，學客人怎麼告訴店員甜度和冰塊，也就是接收前端傳來的參數。

（下一步）第二十、二十一章，學全店統一的點單規則，叫做 RESTful API，並且動手做一個飲料訂單系統。

現在聽不懂這些名詞沒有關係，知道我們會一站一站走過去就好。
-->

---

# 複習：飲料店對照表

<Pairs left="飲料店" right="程式" rows="shop,店面=browser,前端|machine,吧台=server,後端|form,在櫃台點單=code,透過 API 溝通|clerk,櫃台店員=code,Controller|cup,拿到手上的飲料=code,View（回傳的結果）" />

<!--
我們用一張圖複習今天的內容。

（下一步）店面，是前端。

（下一步）吧台，是後端。

（下一步）在櫃台點單，是透過 API 溝通。

（下一步）櫃台店員，是 Controller。

（下一步）拿到手上的飲料，是 View，也就是回傳的結果。
-->

---

# 章節總結

<v-clicks>

- **前端**管畫面，**後端**管資料；前端只能透過 **API** 向後端要資料
- **MVC**：Controller 接單、Model 處理資料、View 是回傳的結果
- **Spring MVC**：Spring Boot 裡負責前後端溝通的部分，幫我們接請求、包回應
- **早就在用了**：`@RestController` 和 `@RequestMapping` 都是 Spring MVC 的功能

</v-clicks>

<v-click>

下一章我們會仔細看「點單」和「取餐單」上面到底寫了什麼。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）前端管畫面，後端管資料，前端只能透過 API 向後端要資料。MVC 是三個角色的分工：Controller 接單、Model 處理資料、View 是回傳的結果。Spring MVC 是 Spring Boot 裡負責前後端溝通的部分。而且我們從第三章就在用它了。

（最後一步）下一章，我們會仔細看點單和取餐單上面到底寫了什麼。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

這一章只有故事，沒有要練習的程式。只要記得「店面是前端、吧台是後端、櫃台店員是 Controller」，後面每一章都會從這裡接下去。
-->
