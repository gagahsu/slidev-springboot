---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 結構化的呈現數據—JSON
routeAlias: ch15
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
    結構化的呈現數據—JSON
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓數據說話，用 JSON 清楚傳遞結構化資料」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十五章。

上一章，我們的店員已經會依照品項分工了。但是他們交出來的東西，都只是一句話。

今天要學的 JSON，就是讓後端可以一次交出「很多項資料」的格式。今天不寫 Java，只學這個格式怎麼讀、怎麼寫。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **為什麼一句話不夠？** 客人想知道的不只一件事
- **JSON 怎麼寫？** 就像杯子上的標籤：「項目：內容」
- **內容可以放哪幾種東西？** 文字、數字、是或否、一串清單

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，為什麼只回傳一句話不夠用。

（下一步）第二，JSON 怎麼寫。先劇透：它就像飲料杯上的那張標籤，每一行都是「項目：內容」。

（下一步）第三，標籤的內容可以放哪幾種東西。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 一句話說不清楚

<!--
先看看我們目前遇到什麼問題。
-->

---

# 目前店員只會說一句話

```java
@RequestMapping("/milktea")
public String milkTea() {
    return "珍珠奶茶一杯";
}
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
❓ 如果前端想知道這杯飲料的<b>名稱、價格、有沒有加冰</b>，只回傳一句話，夠嗎？
</div>

</v-click>

<!--
這是上一章寫的程式。店員收到 /milktea 的點單，只會回傳「珍珠奶茶一杯」這一句話。

（下一步）可是前端通常需要更多資料。例如它想在畫面上顯示飲料的名稱、價格、有沒有加冰。只回傳一句話，夠嗎？
-->

---

# 在杯子上貼一張標籤

<CupLabel />

<!--
我們回到店裡看。

現在店員只會喊一句話：珍珠奶茶一杯。

（下一步）可是客人想知道的不只一件事：這杯多少錢？有沒有加冰？這杯到底是什麼？全部塞進一句話裡，會又長又容易聽錯。

（下一步）所以店家想了一個辦法：在杯子上貼一張標籤。標籤上每一行都是「項目，冒號，內容」。品名是珍珠奶茶，價格是 50，加冰：是。一眼就看得清楚。

（下一步）把這張標籤照一個固定的寫法寫下來，就變成右邊這個樣子。它的名字叫做 JSON。

先不用看懂右邊的符號，等一下會一個一個講。現在只要知道：JSON 就是一張標籤。
-->

---

# 把標籤搬進程式裡

<Pairs left="飲料店" right="程式" rows="cup,杯子上的標籤=code,JSON|what,標籤上的「項目」（品名、價格）=code,key（鍵）|ok,標籤上的「內容」（珍珠奶茶、50）=code,value（值）|form,一整張標籤=code,用 { } 包起來的一個物件" />

<!--
把標籤搬進程式裡。

（下一步）杯子上的標籤，就是 JSON。

（下一步）標籤上的「項目」，像是品名、價格，在 JSON 裡叫做 key，中文是鍵。

（下一步）標籤上的「內容」，像是珍珠奶茶、50，叫做 value，中文是值。

（下一步）一整張標籤，在 JSON 裡用一對大括號包起來，叫做一個物件。
-->

---

# JSON 是什麼？

**JSON：用「項目：內容」的方式，把很多項資料寫在一起的格式。**

<v-clicks>

- 全名是 **J**ava**S**cript **O**bject **N**otation
- 前端和後端之間傳資料，**最常用**的就是它
- **人看得懂**，程式也看得懂
- 雖然名字裡有 JavaScript，但 Java、Python 等語言都能用

</v-clicks>

<!--
用一句話說：JSON 是用「項目：內容」的方式，把很多項資料寫在一起的格式。

（下一步）它的全名是 JavaScript Object Notation，取每個字的開頭，念作 JSON。

（下一步）前端和後端之間傳資料，最常用的就是它。

（下一步）它的優點是人看得懂，程式也看得懂。

（下一步）雖然名字裡有 JavaScript，但它跟程式語言無關。我們用 Java 寫後端，一樣可以用。
-->

---

# 小測驗：為什麼要貼標籤？

<Poll question="後端要一次回傳飲料的名稱、價格、有沒有加冰。為什麼用 JSON 比用一句話好？" options="因為 JSON 的字比較少|因為每一項資料都有名稱，前端可以準確拿到想要的那一項|因為一句話沒辦法寫中文" answer="2" />

<!--
來一題確認一下。

後端要一次回傳飲料的名稱、價格、有沒有加冰。為什麼用 JSON 比用一句話好？

（等大家作答）

（下一步）答案是第二個：因為每一項資料都有自己的名稱。

前端想要價格，就直接找 price 那一項，不用去猜一句話裡面哪幾個字是價格。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# JSON 怎麼寫？

<!--
知道 JSON 是什麼之後，我們來看它的寫法。規則很少，但是每一條都很嚴格。
-->

---

# JSON 的基本寫法

<CodeSteps>

```json {1,4|2|2-3|all}
{
    "name": "珍珠奶茶",
    "price": 50
}
```

- 最外面用**大括號** `{ }` 包起來：這是一張標籤
- 一行一項：左邊是 key，中間是**冒號**，右邊是 value
- 項目和項目之間，用**逗號**隔開
- 這張標籤的意思：品名是珍珠奶茶，價格是 50

</CodeSteps>

<!--
這是最基本的 JSON。

（第一步）最外面用一對大括號包起來。這代表一張標籤，也就是一個物件。

（下一步）裡面一行寫一項。左邊是 key，中間是冒號，右邊是 value。這一行就是「品名：珍珠奶茶」。

（下一步）項目和項目之間，用逗號隔開。

（下一步）整張標籤的意思就是：品名是珍珠奶茶，價格是 50。
-->

---

# 四個最容易寫錯的地方

<v-clicks>

- **key 一定要加雙引號**：`"name": "珍珠奶茶"` ✅　`name: "珍珠奶茶"` ❌
- **文字的 value 要加雙引號**：`"name": "珍珠奶茶"` ✅　`"name": 珍珠奶茶` ❌
- **數字的 value 不加引號**：`"price": 50` ✅　`"price": "50"` ❌
- **最後一項後面不加逗號**：`"price": 50` ✅　`"price": 50,` ❌

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
⚠️ JSON 很嚴格：少一個引號、多一個逗號，程式就讀不懂。
</div>

</v-click>

<!--
JSON 的規則不多，但是很嚴格。這四個地方最容易寫錯。

（下一步）第一，key 一定要加雙引號。沒有例外。

（下一步）第二，如果 value 是文字，也要加雙引號。

（下一步）第三，如果 value 是數字，不要加引號。加了引號，50 就變成「五、零」兩個字，不是數字五十了。

（下一步）第四，最後一項的後面不要加逗號。

（下一步）JSON 很嚴格。少一個引號、多一個逗號，程式就會讀不懂。以後遇到 JSON 相關的錯誤，請先檢查這四點。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 標籤上可以放什麼？

<!--
最後來看 value 可以放哪幾種內容。
-->

---

# value 可以放的五種內容

<CodeSteps>

```json {2|3|4|5|6|all}
{
    "name": "珍珠奶茶",
    "price": 50,
    "sugar": 0.5,
    "ice": true,
    "toppings": ["珍珠", "椰果"]
}
```

- **文字（String）**：要加雙引號
- **整數（Integer）**：直接寫數字
- **小數（Float）**：有小數點的數字，例如半糖寫成 0.5
- **是或否（Boolean）**：只有 `true`（是）和 `false`（否）兩種，不加引號
- **清單（Array）**：用**中括號** `[ ]` 包起來，裡面用逗號隔開
- 一張標籤可以同時放這五種內容

</CodeSteps>

<!--
我們把標籤寫得完整一點，剛好用到五種內容。

（第一步）文字，英文叫 String。要加雙引號。

（下一步）整數，英文叫 Integer。直接寫數字。

（下一步）小數，英文叫 Float。例如半糖，我們寫成 0.5。

（下一步）是或否，英文叫 Boolean。只有 true 和 false 兩種寫法，true 是「是」，false 是「否」。它們不加引號。

（下一步）清單，英文叫 Array。當一個項目有好幾個內容，例如加料有珍珠和椰果，就用中括號包起來，裡面用逗號隔開。

（下一步）一張標籤可以同時放這五種內容。
-->

---

# 小測驗：哪一個寫對了？

<Poll question="哪一個是正確的 JSON？" options="{ name: &quot;綠茶&quot;, price: 30 }|{ &quot;name&quot;: &quot;綠茶&quot;, &quot;price&quot;: 30 }|{ &quot;name&quot;: 綠茶, &quot;price&quot;: 30 }|{ &quot;name&quot;: &quot;綠茶&quot;, &quot;price&quot;: 30, }" answer="2" />

<!--
來找找看，哪一個是正確的 JSON？

（等大家作答）

（下一步）答案是第二個。

第一個的 key 沒有加雙引號。第三個的文字「綠茶」沒有加雙引號。第四個在最後一項後面多了一個逗號。
-->

---

# 回到一開始的問題

**問題：** 怎麼一次回傳飲料的名稱、價格、有沒有加冰？

<v-click>

**答案：** 用 JSON！

```json
{
    "name": "珍珠奶茶",
    "price": 50,
    "ice": true
}
```

</v-click>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 下一章會學：怎麼讓 Spring Boot <b>自動</b>幫我們把資料變成 JSON。
</div>

</v-click>

<!--
回到一開始的問題：怎麼一次回傳飲料的名稱、價格、有沒有加冰？

（下一步）答案就是用 JSON。三項資料，各有各的名稱，清清楚楚。

（下一步）你可能會擔心：難道以後每次都要自己一個字一個字拼出這些引號和逗號嗎？不用。下一章會學，怎麼讓 Spring Boot 自動幫我們把資料變成 JSON。
-->

---

# 複習：飲料店對照表

<Pairs left="飲料店" right="JSON" rows="cup,杯子上的標籤=code,JSON|what,項目=code,key，一定要加雙引號|ok,內容=code,value：文字、數字、true / false、清單|form,一整張標籤=code,用 { } 包起來|cup,一串加料=code,用 [ ] 包起來的清單" />

<!--
我們用一張圖複習今天的內容。

（下一步）杯子上的標籤，是 JSON。

（下一步）項目，是 key，一定要加雙引號。

（下一步）內容，是 value，可以是文字、數字、true 或 false、清單。

（下一步）一整張標籤，用大括號包起來。

（下一步）一串加料，是用中括號包起來的清單。
-->

---

# 章節總結

<v-clicks>

- **JSON**：用「key：value」把很多項資料寫在一起，是前後端傳資料最常用的格式
- **基本寫法**：`{ }` 包住全部，項目之間用逗號隔開
- **引號規則**：key 一定加雙引號；文字加、數字和 `true` / `false` 不加
- **五種 value**：文字、整數、小數、是或否、清單（`[ ]`）

</v-clicks>

<v-click>

下一章我們會學怎麼讓 Spring Boot 自動回傳 JSON。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）JSON 是用 key 和 value 把很多項資料寫在一起的格式。最外面用大括號，項目之間用逗號。key 一定加雙引號，文字加，數字和 true、false 不加。value 有五種：文字、整數、小數、是或否、清單。

（最後一步）下一章，我們會學怎麼讓 Spring Boot 自動回傳 JSON。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後可以試著幫自己最常喝的那杯飲料寫一張 JSON 標籤，寫完檢查那四個容易錯的地方。

有任何問題歡迎提出來。
-->
