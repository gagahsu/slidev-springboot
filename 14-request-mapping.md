---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Url 路徑對應—@RequestMapping
routeAlias: ch14
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
    Url 路徑對應
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「@RequestMapping 讓 Spring Boot 知道哪個方法負責哪個路徑」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十四章。

上一章我們看了點單上的四格。今天只專心看其中一格：URL，也就是網址。

學完之後，你會知道怎麼告訴 Spring Boot：「哪一個網址，要交給哪一段程式處理」。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **網址怎麼讀？** 一個網址可以拆成五段，每一段都有意思
- **`@RequestMapping` 是什麼？** 店員身上那張「我負責的品項」
- **動手做**：讓一位店員同時負責好幾種飲料

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，網址怎麼讀。一個網址可以拆成五段，每一段都有它的意思。

（下一步）第二，@RequestMapping 是什麼。先劇透：它就是店員身上那張「我負責的品項」的牌子。

（下一步）第三，我們會動手做，讓一個 Controller 同時負責好幾種飲料。
-->

---

# 回顧：點單上的四格

上一章，客人交給櫃台的點單有四格：

- **Http Method**：想做什麼動作
- **URL**：要找哪一樣東西　← 今天的主角
- **Request Header**：附帶的說明
- **Request Body**：詳細的內容

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 店員拿到點單，第一件事就是看 <b>URL</b>：客人到底要點什麼？
</div>

<!--
先複習一下。上一章我們說，客人交給櫃台的點單上有四格：Method、URL、Header、Body。

今天的主角是第二格，URL。

店員拿到點單，第一件事一定是看：客人到底要點什麼？後端也是一樣，收到請求先看 URL。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 網址怎麼讀？

<!--
URL 就是我們平常說的網址。它看起來是一長串，其實可以拆成幾段來讀。
-->

---

# 把網址拆開來看

<UrlParts parts="http://;;Protocol（協定）;;用什麼方式溝通;;Protocol：用什麼方式溝通。http 就是上一章學的 Http 協議||localhost;;Host（主機）;;哪一間店;;Host：哪一間店。localhost 代表「我自己這台電腦」||:8080;;Port（埠號）;;幾號窗口;;Port：這間店的幾號窗口。Spring Boot 預設開在 8080||/milktea;;Path（路徑）;;點的品項;;Path：客人要點的品項。後端就是看這一段來決定誰處理||?ice=less;;Query String;;備註;;Query String：附帶的備註，例如少冰。第 18 章會學" />

<!--
我們拿這個網址當例子，一段一段看。

（下一步）最前面是 Protocol，協定，代表用什麼方式溝通。http 就是上一章學的 Http 協議。

（下一步）接著是 Host，主機，代表要去哪一間店。localhost 是一個特別的名字，意思是「我自己這台電腦」。

（下一步）冒號後面的數字是 Port，埠號。你可以想成這間店的幾號窗口。Spring Boot 預設開在 8080 號窗口。

（下一步）再來是 Path，路徑。這是今天最重要的一段，它代表客人要點的品項。後端就是看這一段，來決定要交給誰處理。

（下一步）問號後面的是 Query String，可以想成點單上的備註，例如少冰。這個我們第十八章才會學，今天先知道有它就好。
-->

---

# 真實世界的網址也一樣

<UrlParts parts="https://;;Protocol;;用什麼方式溝通;;https 是加密版的 http，正式上線的網站幾乎都用它||www.youtube.com;;Host;;哪一間店;;Host 換成真正的網域名稱：YouTube 這間店||/watch;;Path;;點的品項;;Path 是 /watch：我要看影片||?v=abc123;;Query String;;備註;;Query String：要看的是編號 abc123 的那一支影片" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 沒寫 Port？因為 https 預設就是 443 號窗口，可以省略不寫。
</div>

</v-click>

<!--
換一個真實世界的例子，YouTube 的網址。結構是一模一樣的。

（下一步）Protocol 是 https，它是加密版的 http。正式上線的網站幾乎都用它。

（下一步）Host 換成了真正的網域名稱，也就是 YouTube 這間店。

（下一步）Path 是 /watch，意思是我要看影片。

（下一步）Query String 說明要看的是哪一支影片。

（下一步）你可能發現這個網址沒有寫 Port。因為 https 預設就是 443 號窗口，所以可以省略不寫。

不管網址多長，都是這幾段。對我們寫後端的人來說，最重要的永遠是 Path。
-->

---

# 小測驗：哪一段是 Path？

<Poll question="http://localhost:8080/greentea　這個網址裡，哪一段是 Path（客人點的品項）？" options="http://|localhost|:8080|/greentea" answer="4" />

<!--
來一題確認一下。

這個網址裡，哪一段是 Path，也就是客人點的品項？

（等大家作答）

（下一步）答案是 /greentea。

Port 後面、從斜線開始的那一段，就是 Path。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 誰來處理這張點單？

<!--
會讀網址之後，下一個問題是：點單進來了，後端要怎麼知道該交給誰處理？
-->

---

# 每位店員都掛著一張牌子

<Dispatch />

<!--
回到手搖飲店。這間店有三位店員，每個人只會做一種飲料。

所以每位店員身上都掛著一張牌子，寫著「我負責的品項」。門口的接待，就是上一章提過的那位，會看點單上的品項來找人。

（下一步）點單上寫 /milktea。接待一看，交給掛著 /milktea 牌子的店員。

（下一步）下一張點單寫 /greentea，就交給掛著 /greentea 的店員。

（下一步）第三張點單寫 /coffee。接待找了一圈，沒有任何人掛這張牌子。只好回覆客人：本店沒有賣。

這個回覆，就是上一章學過的 404。
-->

---

# 把牌子搬進程式裡

<Pairs left="飲料店" right="Spring Boot" rows="form,點單上的品項=code,URL 裡的 Path|clerk,店員=code,Controller 裡的一個方法|what,店員身上「我負責的品項」牌子=code,@RequestMapping|no,沒有人掛這張牌子=code,404 Not Found" />

<!--
把這個畫面搬進程式裡。

（下一步）點單上的品項，就是 URL 裡的 Path。

（下一步）店員，就是 Controller 裡的一個方法。方法這個詞，你可以先想成「一段會做事的程式」。

（下一步）店員身上那張「我負責的品項」牌子，就是今天的主角：@RequestMapping。

（下一步）沒有人掛這張牌子，Spring Boot 就會回 404 Not Found。
-->

---

# @RequestMapping 是什麼？

**`@RequestMapping`：告訴 Spring Boot「這個 Path 的請求，交給這個方法處理」。**

使用時有三個規則：

<v-clicks>

- 寫在**方法的上面**，括號裡放 Path，例如 `@RequestMapping("/milktea")`
- 這個類別**一定要有** `@RestController`，牌子才會生效
- 沒有特別指定的話，不管是 GET 還是 POST 的請求**都會收**

</v-clicks>

<!--
用一句話說：@RequestMapping 是在告訴 Spring Boot，這個 Path 的請求，交給這個方法處理。

使用的時候有三個規則。

（下一步）第一，它寫在方法的上面，括號裡放 Path。

（下一步）第二，這個類別一定要有 @RestController。不是店裡的員工，掛什麼牌子都沒有用。

（下一步）第三，沒有特別指定的話，不管請求的 Method 是 GET 還是 POST，它都會收。Method 的差別我們第十七章會仔細學。
-->

---

# 程式長這樣

<CodeSteps>

```java {1-2|4|5-7|all}
@RestController
public class DrinkController {

    @RequestMapping("/milktea")
    public String milkTea() {
        return "珍珠奶茶一杯";
    }
}
```

- `@RestController`：`DrinkController` 是這間店的櫃台
- `@RequestMapping("/milktea")`：掛上牌子，「/milktea 由我負責」
- 這個方法就是店員：收到點單後，回傳「珍珠奶茶一杯」
- 請求 `http://localhost:8080/milktea`，就會拿到「珍珠奶茶一杯」

</CodeSteps>

<!--
我們來看程式。這次不用第三章的 MyController 了，我們新增一個 DrinkController，專門負責飲料。

（第一步）@RestController，表示 DrinkController 是這間店的櫃台。

（下一步）@RequestMapping("/milktea")，就是掛上牌子：/milktea 由我負責。

（下一步）下面這個方法就是店員本人。收到點單之後，他回傳「珍珠奶茶一杯」。

（下一步）所以只要有人請求 localhost:8080/milktea，就會拿到「珍珠奶茶一杯」這幾個字。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 動手做：多請幾位店員

<!--
一間店不會只賣一種飲料。我們多請幾位店員。
-->

---

# 一個 Controller，多個路徑

<CodeSteps>

```java {4-7|9-12|14-17|all}
@RestController
public class DrinkController {

    @RequestMapping("/milktea")
    public String milkTea() {
        return "珍珠奶茶一杯";
    }

    @RequestMapping("/greentea")
    public String greenTea() {
        return "綠茶一杯";
    }

    @RequestMapping("/blacktea")
    public String blackTea() {
        return "紅茶一杯";
    }
}
```

- 第一位店員：負責 `/milktea`
- 第二位店員：負責 `/greentea`
- 第三位店員：負責 `/blacktea`
- 同一個 Controller 裡可以有很多個方法，每個方法掛自己的牌子

</CodeSteps>

<!--
在同一個 DrinkController 裡，我們寫三個方法。

（第一步）第一位店員，負責 /milktea。

（下一步）第二位店員，負責 /greentea。

（下一步）第三位店員，負責 /blacktea。

（下一步）同一個 Controller 裡可以有很多個方法，每個方法掛自己的牌子，互不干擾。

請大家在自己的專案裡照著寫一次，然後重新啟動 Spring Boot。
-->

---

# 用 Postman 測試看看

啟動 Spring Boot，分別請求這幾個網址：

<v-clicks>

- `http://localhost:8080/milktea` → **珍珠奶茶一杯**
- `http://localhost:8080/greentea` → **綠茶一杯**
- `http://localhost:8080/blacktea` → **紅茶一杯**
- `http://localhost:8080/coffee` → **404 Not Found**（沒有人掛這張牌子）

</v-clicks>

<!--
程式啟動之後，打開上一章學過的 Postman，分別請求這幾個網址。

（下一步）請求 /milktea，拿到珍珠奶茶一杯。

（下一步）請求 /greentea，拿到綠茶一杯。

（下一步）請求 /blacktea，拿到紅茶一杯。

（下一步）最後請大家故意請求一個沒有設定的 /coffee。你會看到 404 Not Found。這就是剛剛故事裡「沒有人掛這張牌子」的情況。

親手看到一次 404，以後遇到它就不會慌了：先檢查網址有沒有打錯，再檢查 @RequestMapping 有沒有寫。
-->

---

# 進階：牌子上還能寫「只收哪一種動作」

<CodeSteps>

```java {1-4|6-9|all}
@RequestMapping(value = "/drinks", method = RequestMethod.GET)
public String menu() {
    return "飲料清單";
}

@RequestMapping(value = "/drinks", method = RequestMethod.POST)
public String order() {
    return "點了一杯新的飲料";
}
```

- Path 是 `/drinks`，而且**只收 GET**：客人想「看」飲料清單
- Path 一樣是 `/drinks`，但**只收 POST**：客人想「點」一杯新的
- `value` 放 Path，`method` 放要收的 Http Method

</CodeSteps>

<!--
最後看一個進階用法。牌子上除了品項，還可以寫「只收哪一種動作」。

（第一步）第一個方法，Path 是 /drinks，而且只收 GET。客人只是想看飲料清單。

（下一步）第二個方法，Path 一樣是 /drinks，但只收 POST。客人是想點一杯新的。

（下一步）寫法是這樣：value 放 Path，method 放要收的 Http Method。

同一個 Path，因為動作不同，交給不同的方法。GET 和 POST 的差別，以及更短的寫法，我們第十七章會學，今天先看過有印象就好。
-->

---

# 小測驗：找不到店員

<Poll question="DrinkController 裡只寫了 /milktea、/greentea、/blacktea。有人請求 /coffee，會發生什麼事？" options="隨便挑一位店員處理|回應 404 Not Found|Spring Boot 直接當掉|回應 200，但內容是空的" answer="2" />

<!--
最後一題。

DrinkController 裡只寫了三個路徑。這時候有人請求 /coffee，會發生什麼事？

（等大家作答）

（下一步）答案是回應 404 Not Found。

Spring Boot 不會亂猜，也不會當掉。它只是老實地告訴前端：這個品項，本店沒有人負責。
-->

---

# 複習：飲料店對照表

<Pairs left="飲料店" right="程式" rows="shop,哪一間店的幾號窗口=code,Host 和 Port|form,點單上的品項=code,Path|clerk,掛著品項牌的店員=code,加了 @RequestMapping 的方法|no,沒有人負責的品項=code,404 Not Found" />

<!--
我們用一張圖複習今天的內容。

（下一步）哪一間店的幾號窗口，是 Host 和 Port。

（下一步）點單上的品項，是 Path。

（下一步）掛著品項牌的店員，是加了 @RequestMapping 的方法。

（下一步）沒有人負責的品項，就是 404 Not Found。
-->

---

# 章節總結

<v-clicks>

- **URL 的五段**：Protocol、Host、Port、**Path**、Query String
- **`@RequestMapping`**：把一個 Path 交給一個方法處理
- **前提**：類別要有 `@RestController`
- **一個 Controller 可以有多個方法**，各自對應不同的 Path
- **找不到對應的 Path**：Spring Boot 回應 404
- **指定動作**：用 `method = RequestMethod.GET` 限定只收某一種 Http Method

</v-clicks>

<v-click>

下一章我們會學 JSON：飲料做好之後，要用什麼「包裝」交給客人。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）URL 可以拆成五段，其中最重要的是 Path。@RequestMapping 把一個 Path 交給一個方法處理。前提是類別要有 @RestController。一個 Controller 可以有多個方法。找不到對應的 Path，會回應 404。還可以用 method 限定只收某一種 Http Method。

（最後一步）目前我們的店員只會回傳一句話。下一章要學 JSON，也就是飲料做好之後，要用什麼包裝交給客人。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請大家自己在 DrinkController 裡多加一兩種飲料，用 Postman 測試看看，再故意打錯一次網址，觀察 404。

有任何問題歡迎提出來。
-->
