---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 返回值改成 JSON 格式—@RestController
routeAlias: ch16
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
    返回值改成 JSON 格式<br>@RestController
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「Spring Boot 自動幫你把 Java 物件轉成 JSON」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十六章。

上一章我們學會了 JSON 這張「標籤」怎麼寫。

今天要學的是：怎麼讓 Spring Boot 自動幫我們印出這張標籤，不用自己一個引號一個逗號慢慢拼。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **誰幫我們印標籤？** 店裡有一台自動標籤機
- **程式要怎麼寫？** 三個步驟，讓店員交出一杯「有資料的飲料」
- **`@RestController` 和 `@Controller` 差在哪？** 新式的店和舊式的店

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，誰幫我們印標籤。答案是店裡有一台自動標籤機。

（下一步）第二，程式要怎麼寫。只要三個步驟。

（下一步）第三，我們一直在用的 @RestController，和另一個很像的 @Controller，到底差在哪裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 店裡的自動標籤機

<!--
先回到店裡，看看標籤是怎麼貼上去的。
-->

---

# 店員不用自己寫標籤

<Flow nodes="店員:Controller 的方法|標籤機:Jackson|客人:前端" steps="1>2:做好一杯飲料|2>3:印好標籤，貼上交出" />

<v-clicks>

- 店員只管**把飲料做好**，不用自己手寫標籤
- 出餐口有一台**標籤機**：讀飲料的資料，自動印成標籤
- 客人拿到的，就是一杯貼好標籤的飲料

</v-clicks>

<!--
上一章我們自己手寫了好幾張 JSON 標籤。如果店員每做一杯都要手寫，一定會寫錯。

所以這間店在出餐口放了一台標籤機。

（下一步）店員做好一杯飲料，放到出餐口。

（下一步）標籤機讀一下這杯飲料的資料，自動印好標籤、貼上去，交給客人。

（下一步）店員只管把飲料做好。

（下一步）印標籤是標籤機的事。

（下一步）客人拿到的，就是一杯貼好標籤的飲料。
-->

---

# 把標籤機搬進程式裡

<Pairs left="飲料店" right="Spring Boot" rows="cup,店員做好的一杯飲料=code,方法回傳的 Java 物件|machine,自動標籤機=code,Jackson（Spring Boot 內建）|form,印出來的標籤=code,JSON|shop,「本店飲料一律貼標籤」的規定=code,@RestController" />

<!--
把它搬進程式裡。

（下一步）店員做好的一杯飲料，就是方法回傳的 Java 物件。物件這個詞，你可以先想成「一包整理好的資料」。

（下一步）自動標籤機，是一個叫 Jackson 的工具。Spring Boot 已經內建了，我們不用安裝，也不用設定。

（下一步）印出來的標籤，就是 JSON。

（下一步）而「本店飲料一律貼標籤」這條規定，就是我們從第三章用到現在的 @RestController。
-->

---

# 一句話：回傳物件，自動變成 JSON

**在 `@RestController` 裡，方法回傳一個 Java 物件，Spring Boot 就會自動把它轉成 JSON。**

<v-clicks>

- 以前：方法回傳 `String`，前端收到一句話
- 現在：方法回傳**物件**，前端收到一張 JSON 標籤
- 中間的轉換，全部由 **Jackson** 代勞

</v-clicks>

<!--
用一句話說：在 @RestController 裡，方法回傳一個 Java 物件，Spring Boot 就會自動把它轉成 JSON。

（下一步）以前我們的方法回傳 String，前端收到的是一句話。

（下一步）現在我們要讓方法回傳一個物件，前端收到的就會是一張 JSON 標籤。

（下一步）中間的轉換，全部由 Jackson 代勞。
-->

---

# 小測驗：誰印的標籤？

<Poll question="Controller 的方法回傳了一個 Java 物件。是誰把它變成 JSON 的？" options="我們自己寫程式拼出來|Jackson 自動轉換|前端收到之後自己轉|Postman" answer="2" />

<!--
來一題確認一下。

Controller 的方法回傳了一個 Java 物件。是誰把它變成 JSON 的？

（等大家作答）

（下一步）答案是 Jackson 自動轉換。

它就是那台標籤機。我們完全不用自己拼引號和逗號。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 三個步驟，回傳 JSON

<!--
概念清楚了，我們來寫程式。總共三個步驟。
-->

---

# Step 1：先定義「一杯飲料」有哪些資料

<CodeSteps>

```java {1|2|3|all}
public class Drink {
    private Integer id;
    private String name;
}
```

- 新增一個類別 `Drink`，代表「一杯飲料」
- `id`：飲料的編號，是整數（`Integer`）
- `name`：飲料的名稱，是文字（`String`）
- 這兩個變數，之後會變成 JSON 裡的兩個 key

</CodeSteps>

<!--
第一步，先告訴程式「一杯飲料」有哪些資料。

（第一步）我們新增一個類別，叫做 Drink，代表一杯飲料。

（下一步）裡面有一個 id，是飲料的編號，型別是 Integer，也就是整數。

（下一步）還有一個 name，是飲料的名稱，型別是 String，也就是文字。

（下一步）這兩個變數的名字，之後就會變成 JSON 裡的兩個 key。
-->

---

# Step 2：幫標籤機開「讀取口」

<CodeSteps>

```java {1-3|5-7|all}
public Integer getId() {
    return id;
}

public void setId(Integer id) {
    this.id = id;
}

// name 也一樣：getName()、setName()
```

- **Getter**（`getId`）：讓別人「讀」到 id。標籤機就是從這裡讀資料
- **Setter**（`setId`）：讓別人「填」入 id。店員做飲料時用
- 每個變數都要有一組；少了 Getter，那一項就**不會出現在 JSON 裡**

</CodeSteps>

<!--
第二步。Drink 裡的變數前面都寫了 private，意思是外面的人看不到。標籤機也看不到，就印不出標籤。

所以我們要幫它開讀取口。

（第一步）getId 這種方法叫做 Getter，功能是讓別人讀到 id。標籤機就是從這裡讀資料的。

（下一步）setId 這種方法叫做 Setter，功能是讓別人填入 id。等一下店員做飲料的時候會用到。

（下一步）每個變數都要有一組。請特別記住：如果少了 Getter，那一項資料就不會出現在 JSON 裡。
-->

---

# 用 Lombok 省掉 Getter 和 Setter

<CodeSteps>

```java {1|3|4-7|all}
import lombok.Data;

@Data
public class Drink {
    private Integer id;
    private String name;
}
```

- 第七章安裝過的 **Lombok**，這裡又派上用場
- 在類別上加 `@Data`
- 類別裡只要寫變數就好
- Lombok 會自動產生所有的 Getter 和 Setter，效果完全一樣

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 這種「只用來裝資料」的類別，之後我們都直接加 <code>@Data</code>。
</div>

</v-click>

<!--
每個變數都要寫一組 Getter 和 Setter，很囉唆。

（第一步）還記得第七章安裝過的 Lombok 嗎？它這裡又派上用場了。

（下一步）我們在類別上面加一個 @Data。

（下一步）類別裡只要寫變數就好。

（下一步）Lombok 會自動幫我們產生所有的 Getter 和 Setter，效果跟自己手寫完全一樣。

（下一步）像 Drink 這種只用來裝資料的類別，之後我們都直接加 @Data。
-->

---

# Step 3：讓店員交出一杯 Drink

<CodeSteps>

```java {5|6|7-8|9|all}
@RestController
public class DrinkController {

    @RequestMapping("/drink")
    public Drink getDrink() {
        Drink drink = new Drink();
        drink.setId(1);
        drink.setName("珍珠奶茶");
        return drink;
    }
}
```

- 回傳的型別從 `String` 改成 `Drink`
- `new Drink()`：拿一個空杯子
- 用 Setter 把資料填進去：編號 1、名稱珍珠奶茶
- `return drink`：把飲料放到出餐口
- 接下來，標籤機會自動把它變成 JSON

</CodeSteps>

<!--
第三步，回到 DrinkController。

（第一步）注意方法前面的型別。以前是 String，現在改成 Drink。意思是這個方法會交出一杯飲料。

（下一步）new Drink()，就像拿一個空杯子。

（下一步）用 Setter 把資料填進去：編號是 1，名稱是珍珠奶茶。

（下一步）return drink，就是把飲料放到出餐口。

（下一步）接下來的事，標籤機會自動完成。
-->

---

# 執行結果

用 Postman 請求 `http://localhost:8080/drink`：

<v-click>

```json
{
    "id": 1,
    "name": "珍珠奶茶"
}
```

</v-click>

<v-clicks>

- 變數名稱 `id`、`name` 自動變成 **key**
- 填進去的 `1`、`"珍珠奶茶"` 自動變成 **value**
- 整數沒有引號、文字有引號，Jackson 都幫我們處理好了

</v-clicks>

<!--
重新啟動 Spring Boot，用 Postman 請求 localhost:8080/drink。

（下一步）回應的內容，就是上一章學過的 JSON。

（下一步）變數名稱 id 和 name，自動變成了 key。

（下一步）我們填進去的 1 和珍珠奶茶，自動變成了 value。

（下一步）而且整數沒有引號、文字有引號，上一章那些容易寫錯的規則，Jackson 都幫我們處理好了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# @Controller 和 @RestController

<!--
最後補充一個常被問到的問題。Spring 裡還有一個長得很像的 @Controller，它們差在哪裡？
-->

---

# 新式的店 vs 舊式的店

<Pairs left="@RestController" right="@Controller" sign="vs" rows="cup,店員直接把飲料（資料）交給你=form,店員給你一張號碼牌，請你去看對應的看板|code,回傳值會被轉成 JSON=code,回傳值被當成「網頁樣板的名稱」|browser,前後端分離：現在的主流=doc,後端自己產生網頁：早期的做法" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 這門課寫的都是回傳 JSON 的 API，所以一律使用 <code>@RestController</code>。
</div>

</v-click>

<!--
用兩種店來比較。

（下一步）@RestController 是新式的店：店員直接把飲料交給你。@Controller 是舊式的店：店員不給你飲料，而是給你一張號碼牌，請你自己去看對應的看板。

（下一步）對應到程式：@RestController 的回傳值會被轉成 JSON。@Controller 的回傳值，會被當成一個網頁樣板的名稱，Spring 會拿那個樣板去產生一整頁網頁。

（下一步）@RestController 適合前後端分離的做法，是現在的主流。@Controller 是早期後端自己產生網頁的做法。

（下一步）這門課寫的都是回傳 JSON 的 API，所以我們一律使用 @RestController。你只要知道有 @Controller 這個東西，看到的時候不要搞混就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習
# 回傳一張訂單

<!--
換大家動手做。這次不是飲料，而是一張訂單。
-->

---

# 題目：訂單 API

請讓 `http://localhost:8080/order` 回傳這張訂單：

```json
{
    "id": 1,
    "drinkName": "珍珠奶茶",
    "price": 50.0,
    "paid": true
}
```

<v-clicks>

- 建立 `Order` 類別，有 `id`、`drinkName`、`price`、`paid` 四個變數
- 使用 `@Data`，不要手寫 Getter 和 Setter
- 建立 `OrderController`，路徑是 `/order`，回傳 `Order` 物件

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 想一想：JSON 的小數、是或否，在 Java 裡要用什麼型別？
</div>

</v-click>

<!--
題目是這樣：請讓 localhost:8080/order 回傳這張訂單的 JSON。

（下一步）第一，建立一個 Order 類別，裡面有四個變數。

（下一步）第二，使用 @Data，不要手寫 Getter 和 Setter。

（下一步）第三，建立一個 OrderController，路徑是 /order，回傳 Order 物件。

（下一步）提示：這次的 JSON 多了小數和「是或否」兩種內容。想一想，它們在 Java 裡要用什麼型別？

請大家先暫停，自己寫寫看，再往下看解答。
-->

---

# 參考解答（1/2）：Order 類別

<CodeSteps>

```java {4|5|6|7|all}
@Data
public class Order {

    private Integer id;
    private String drinkName;
    private Double price;
    private Boolean paid;
}
```

- 整數 → `Integer`
- 文字 → `String`
- 小數 → `Double`
- 是或否 → `Boolean`
- Jackson 會依照 Java 的型別，自動印出對應的 JSON 寫法

</CodeSteps>

<!--
先看 Order 類別。重點是 JSON 的內容和 Java 型別的對應。

（第一步）整數，用 Integer。

（下一步）文字，用 String。

（下一步）小數，用 Double。

（下一步）是或否，用 Boolean。

（下一步）Jackson 會依照 Java 的型別，自動印出對應的 JSON 寫法，不需要任何設定。
-->

---

# 參考解答（2/2）：OrderController

```java
@RestController
public class OrderController {

    @RequestMapping("/order")
    public Order getOrder() {
        Order order = new Order();
        order.setId(1);
        order.setDrinkName("珍珠奶茶");
        order.setPrice(50.0);
        order.setPaid(true);
        return order;
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 我們沒有手寫 <code>setPrice()</code>，但 <code>@Data</code> 已經自動產生，可以直接用。
</div>

</v-click>

<!--
再看 OrderController。寫法和剛剛的 DrinkController 一模一樣：拿一張空白訂單，用 Setter 把四項資料填進去，然後回傳。

（下一步）注意，我們並沒有手寫 setPrice 這些方法。它們是 @Data 自動產生的，所以可以直接用。

用 Postman 測試，看到的 JSON 和題目一樣，就成功了。
-->

---

# 複習：飲料店對照表

<Pairs left="飲料店" right="程式" rows="cup,一杯做好的飲料=code,Java 物件（Drink）|machine,自動標籤機=code,Jackson|what,標籤機的讀取口=code,Getter（可以用 @Data 自動產生）|form,貼好的標籤=code,JSON|shop,「一律貼標籤」的規定=code,@RestController" />

<!--
我們用一張圖複習今天的內容。

（下一步）一杯做好的飲料，是 Java 物件。

（下一步）自動標籤機，是 Jackson。

（下一步）標籤機的讀取口，是 Getter，可以用 @Data 自動產生。

（下一步）貼好的標籤，是 JSON。

（下一步）一律貼標籤的規定，是 @RestController。
-->

---

# 章節總結

<v-clicks>

- **自動轉換**：`@RestController` 的方法回傳 Java 物件，Jackson 自動轉成 JSON
- **三個步驟**：定義類別 → 準備 Getter / Setter → Controller 回傳物件
- **Getter 很重要**：少了它，那一項資料不會出現在 JSON 裡
- **`@Data`**：Lombok 自動產生 Getter 和 Setter
- **`@RestController`** 回傳 JSON；**`@Controller`** 回傳網頁樣板的名稱

</v-clicks>

<v-click>

下一章我們會學 GET 和 POST：客人是想「看菜單」，還是想「點一杯新的」。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）@RestController 的方法回傳 Java 物件，Jackson 會自動轉成 JSON。做法是三個步驟：定義類別、準備 Getter 和 Setter、Controller 回傳物件。Getter 很重要，少了它資料就不會出現。@Data 可以自動產生 Getter 和 Setter。@RestController 回傳 JSON，@Controller 回傳網頁樣板的名稱。

（最後一步）下一章，我們會學 GET 和 POST：客人是想看菜單，還是想點一杯新的。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請把訂單 API 做完。也可以做個小實驗：把 Order 上面的 @Data 拿掉，看看回應會變成什麼樣子，體會一下 Getter 的重要性。

有任何問題歡迎提出來。
-->
