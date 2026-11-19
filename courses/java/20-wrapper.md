---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 包裝類別 (Wrapper Classes)
routeAlias: ch20
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Java Programming Masterclass</p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">包裝類別</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓基本型態穿上物件的外衣，解鎖完整功能」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
大家好，歡迎來到「包裝類別」這一章！

【為什麼要學這個？】
想像我們之前學過的 `ArrayList`，它要求裡面裝的都是「物件」。但我們最常用的 `int`、`double`、`boolean` 這些基本型態，偏偏都不是物件。這就有個矛盾：明明資料是數字，卻不能直接放進集合裡用，那該怎麼辦？

【學習目標】
學完這一章，我們就能搞懂「包裝類別」是什麼、Java 怎麼幫我們自動把基本型態變成物件（自動裝箱／拆箱），以及 `Integer`、`Double`、`Boolean` 這些常用類別提供的好用方法，讓我們能在「基本型態」和「物件」之間自由切換。
-->

---
layout: default
---

# Outline

- **包裝類別概念與對應關係**
- **自動裝箱與自動拆箱 (Autoboxing / Unboxing)**
- **Integer 類別的常用方法**
- **各類型的包裝類別方法**
- **實作練習**

<!--
【帶讀大綱】
今天的內容分成四個部分：先搞懂「包裝類別」到底是什麼、跟基本型態有什麼對應關係；接著看 Java 怎麼自動幫我們在基本型態和包裝類別之間轉換；然後深入認識最常用的 `Integer` 類別有哪些工具方法；最後快速看一下 `Double`、`Boolean`、`Character` 這些其他包裝類別的常用方法。

【重點預告】
每個部分後面都會搭配練習題，讓我們邊學邊動手寫，最後再用一個綜合練習把整章內容串起來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 包裝類別概念

<!--
【段落轉換】
我們先來搞懂「為什麼需要包裝類別」，再看它跟基本型態之間的對應關係。
-->

---
layout: default
---

# 什麼是包裝類別？

Java 的資料型態分為兩種：

- **基本型態 (Primitive type)**：`int`, `double`, `boolean`... 儲存純值，放在 Stack
- **參考型態 (Reference type)**：物件，放在 Heap，可以呼叫方法

```java
int score = 95;           // 基本型態，無法呼叫方法
Integer scoreObj = 95;    // 包裝類別，可以呼叫方法
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 包裝類別讓每種基本型態都有對應的「物件版本」，擁有各種工具方法可供使用。
</div>

<!--
【情境切入】
想像我們宣告了一個 `int score = 95`。這個 `score` 本身就只是一個數字，沒辦法對它「做什麼事」——不能呼叫方法，也不能放進只接受物件的 `ArrayList`。但如果我們需要的剛好就是「物件」呢？

【概念定義】
這時候就需要「包裝類別 (Wrapper Class)」：「Java 為每一種基本型態都準備了一個對應的類別，把基本型態的值包裝成物件，讓它擁有方法可以呼叫」。

【生活化比喻】
基本型態 `int` 就像是裝在口袋裡的零錢，輕巧好用，但沒辦法包裝成禮物送人。包裝類別 `Integer` 就是幫這些零錢套上一個紅包袋，包裝好之後就能大方地交給只收「禮物（物件）」的 `ArrayList`。

【程式世界怎麼用】
如果只是單純做數學運算，用 `int`、`double` 這些基本型態效能比較好；但只要牽涉到集合（`ArrayList`、`HashMap`）或需要呼叫工具方法（像 `parseInt`），就要請出對應的包裝類別。

⚠️ 易錯點提醒：
`Integer` 跟 `int` 不是完全一樣的東西——`Integer` 是物件，物件可以是 `null`；如果對一個 `null` 的 `Integer` 做數學運算，程式會直接拋出 `NullPointerException`，這點我們稍後會詳細談到。
-->

---

# 基本型態與包裝類別對照表

| 基本型態 | 包裝類別 |
| --- | --- |
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

<!--
【核心說明】
這張表就是「基本型態」與「包裝類別」的對應總表。大部分規則很簡單：把基本型態的第一個字母改成大寫，就是它的包裝類別名稱。

【生活化比喻】
這就像是每個人都有一個「正式登記用的全名」和「日常稱呼用的小名」——`int` 是小名，`Integer` 是它的全名，兩者指的是同一種資料，只是「能不能呼叫方法」不同。

⚠️ 易錯點提醒：
注意 `int` 對應的是 `Integer`，不是 `Int`；`char` 對應的是 `Character`，不是 `Char`。這兩個是整張表裡少數「不只是改大小寫」的特例，拼錯名字編譯器會直接報錯，務必記熟。
-->

---
layout: default
---

# 🎬 AI 協作時刻：ArrayList\<int\> 為什麼編譯不過？

初學者很常寫出 `ArrayList<int>`，結果編譯器直接報錯，卻不知道原因：

**要用的 Prompt：**

> 我寫了這段 code：
> ```java
> {貼上你的程式碼，例如：
> ArrayList<int> levels = new ArrayList<>();}
> ```
> 編譯器說「不能使用基本型態當作泛型參數」。請解釋為什麼 Java 的泛型
> （像 ArrayList\<T\>）只能放物件、不能放 int、double 這些基本型態，
> 以及這跟「包裝類別」有什麼關係，不要直接改我的程式碼，先說明原因。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>連結今天的主題：</b> 這正是「包裝類別」存在的主要理由之一——泛型只認得物件，`Integer` 就是讓 `int` 也能被泛型接受的橋樑。
</div>

<!--
【操作提示】
可以請同學先試著把 `ArrayList<int>` 改成 `ArrayList<Integer>`，自己動手驗證編譯是否通過，再用 AI 的解釋確認理解是否正確。

【收斂一句話】
泛型只收物件，基本型態要先變成包裝類別才能進入集合框架。
-->
---
layout: default
---

# 練習 1：基本型態與包裝類別轉換
### 任務說明

宣告一個 `int` 變數 `level = 5`，再宣告一個 `boolean` 變數 `isOnline = true`。

請分別宣告對應的包裝類別變數 `levelObj`、`isOnlineObj`，將上述兩個值指派給它們，並印出這四個變數的值與型態名稱（可用 `.getClass().getSimpleName()`）。

<!--
【任務鋪陳】
剛才看了基本型態與包裝類別的對照表，現在動手試試看，確認自己能正確寫出對應的包裝類別宣告。

【引導思考】
對照表裡 `int` 對應到哪個包裝類別？`boolean` 又對應到哪個？把表格內容實際寫成程式碼，會長什麼樣子？
-->

---
layout: default
---

# 練習 1：解題提示
### 提示說明

1. `int level = 5;` 對應的包裝類別宣告是 `Integer levelObj = level;`
2. `boolean isOnline = true;` 對應的包裝類別宣告是 `Boolean isOnlineObj = isOnline;`
3. 印出型態名稱可用 `System.out.println(levelObj.getClass().getSimpleName());`，結果會是 `Integer`

<!--
【帶讀解法】
這題的重點就是「對照表怎麼查，程式就怎麼寫」：`int` 對應 `Integer`，`boolean` 對應 `Boolean`，把基本型態的值直接指派給包裝類別變數即可。

💼 業界實務：
雖然這個練習看起來簡單，但「能不能正確說出每個基本型態對應的包裝類別名稱」是後面所有包裝類別內容的基礎，務必確認自己記熟了再往下走。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 自動裝箱與自動拆箱

<!--
【段落轉換】
接下來要看 Java 怎麼在基本型態和包裝類別之間，幫我們做「自動轉換」這件事。
-->

---
layout: default
---

# 手動裝箱 (Boxing)

將基本型態轉換成包裝類別物件，稱為「裝箱」：

```java
// 手動裝箱 (JDK 5 以前的舊寫法)
int hp = 100;
Integer hpObj = Integer.valueOf(hp);

System.out.println(hpObj); // 100
```

<!--
【情境切入】
想像我們手上有一個 `int hp = 100`，但某個方法只收 `Integer`。在 JDK 5 以前，Java 並不會自動幫我們轉換，我們得自己動手把 `int` 包成 `Integer`。

【概念定義】
「裝箱 (Boxing) 就是把基本型態的值，轉換成對應包裝類別的物件」，常見的寫法是呼叫 `Integer.valueOf(基本型態值)`。

【生活化比喻】
這就像早期沒有自動包裝機的時代，店員（程式設計師）要自己動手把商品（`int`）放進禮盒（`Integer`）、貼上標籤，每一步都得親自來，雖然簡單但麻煩。

【程式世界怎麼用】
現在的程式幾乎不會這樣手動寫了，但理解這個過程，有助於我們理解接下來要看的「自動裝箱」背後到底發生了什麼事。
-->

---

# 自動裝箱 (Autoboxing)

Java 5 之後，編譯器自動完成裝箱：

```java
int hp = 100;
Integer hpObj = hp; // 編譯器自動呼叫 Integer.valueOf(hp)
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 自動裝箱讓基本型態可以直接指派給包裝類別變數，背後由編譯器自動呼叫 <code>valueOf()</code>。
</div>

<!--
【情境切入】
剛才看到手動裝箱要寫 `Integer.valueOf(hp)`，每次轉換都要多打這一段，如果整個程式到處都需要轉換，會非常囉嗦。

【概念定義】
「自動裝箱 (Autoboxing) 是 Java 5 之後新增的語法糖：當我們把基本型態的值指派給包裝類別變數時，編譯器會自動在背後呼叫 `valueOf()`，不需要我們手動寫出來」。

【生活化比喻】
這就像現在的自動包裝機：我們只要把商品放上輸送帶（把 `int` 指派給 `Integer` 變數），機器（編譯器）就會自動完成包裝、貼標籤的動作，我們完全不需要插手。

【程式世界怎麼用】
有了自動裝箱，我們可以直接寫 `Integer hpObj = hp;`，編譯器看到型態不match會自動幫我們補上 `valueOf()`，程式碼變得更簡潔。
-->

---

# 自動拆箱 (Unboxing)

從包裝類別物件取出基本型態，稱為「拆箱」：

```java
Integer hpObj = 100;

// 自動拆箱：編譯器呼叫 hpObj.intValue()
int hp = hpObj;

// 也可直接參與數學運算
int newHp = hpObj + 50; // 自動拆箱後計算
System.out.println(newHp); // 150
```

<!--
【情境切入】
有裝箱，自然也會有反過來的需求：手上有一個 `Integer hpObj`，但我們現在想拿它來做數學運算，或是把它存進一個 `int` 變數裡。

【概念定義】
「拆箱 (Unboxing) 就是把包裝類別物件，還原成對應的基本型態值」；從 Java 5 開始，這個過程也是自動的，編譯器會在背後呼叫 `intValue()` 這類方法。

【生活化比喻】
這就像收到禮盒之後，自動拆箱機幫我們把包裝紙撕開、把裡面的商品拿出來，整個過程快到我們幾乎感覺不到，跟拆快遞一樣順手。

⚠️ 易錯點提醒：
`hpObj + 50` 這一行，`hpObj` 會先被自動拆箱成 `int` 再相加。看起來像是「物件」在做數學運算，但實際上背後是先拆箱成基本型態才計算的。
-->

---

# 自動裝拆箱與集合框架

包裝類別最常用的場景：放入只接受物件的集合框架

```java
import java.util.ArrayList;

ArrayList<Integer> ranks = new ArrayList<>();

// 自動裝箱：int 放入 ArrayList
ranks.add(1);   // 等同 ranks.add(Integer.valueOf(1))
ranks.add(3);

// 自動拆箱：Integer 取出後可直接計算
int total = ranks.get(0) + ranks.get(1); // 4
```

<!--
【情境切入】
回到我們開頭提到的問題：`ArrayList` 只接受物件，那我們平常寫 `ranks.add(1)` 的時候，這個 `1` 明明是 `int`，為什麼可以直接放進去？

【概念定義】
答案就是「自動裝箱」：當我們呼叫 `ranks.add(1)` 時，編譯器會自動把 `1` 轉成 `Integer.valueOf(1)` 再放進去；取出來做運算時，又會自動拆箱成 `int`。

【生活化比喻】
這就像進出一個只收「禮盒」的倉庫：東西進倉庫前自動幫你包裝成禮盒（裝箱），要用的時候自動幫你拆開拿出商品（拆箱），整個過程完全不需要我們操心。

💼 業界實務：
這是 Java 開發中最常見的場景之一——幾乎每個用到 `ArrayList<Integer>`、`HashMap<String, Integer>` 之類集合的專案，背後都在不斷地自動裝箱與拆箱。
-->

---

# 裝箱陷阱：== 比較的問題

包裝類別是物件，`==` 比較的是位址，而非數值：

```java
Integer a = 200;
Integer b = 200;
System.out.println(a == b);      // false (不同物件)
System.out.println(a.equals(b)); // true  (數值相同)
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>快取範圍：</b> Java 快取 -128 到 127 的 Integer 物件，在此範圍內 <code>==</code> 可能為 true，超出則為 false。建議永遠用 <code>equals()</code>。
</div>

<!--
【情境切入】
我們已經習慣用 `==` 比較 `int` 數值是否相等，那兩個 `Integer` 變數可以一樣用 `==` 比較嗎？

【概念定義】
要記得：「`Integer` 是物件，`==` 比較的是『兩個變數是不是指向同一個物件』，而不是『數值是否相同』；要比較數值，要用 `equals()`」。

【生活化比喻】
`Integer` 是裝著數字的紅包袋。`==` 問的是「你們是不是同一個紅包袋」，`equals()` 問的才是「兩個紅包袋裡裝的金額是不是一樣」。兩個裝著 200 元的不同紅包袋，`==` 結果是 false，但 `equals()` 結果是 true。

⚠️ 易錯點提醒：
範例裡 `Integer a = 200` 和 `Integer b = 200` 用 `==` 比較結果是 `false`，這很反直覺。原因是 Java 為了效能，會快取 -128 到 127 之間的 `Integer` 物件——如果把 200 換成 100，`==` 反而會是 `true`。這種「小數字過、大數字不過」的行為非常容易誤導人，所以記住一個原則：比較 `Integer` 數值，永遠用 `equals()`。
-->

---
layout: default
---

# 🎬 AI 協作時刻：Integer 快取到底在快取什麼？

`-128 ~ 127` 這個快取範圍是 Java 最經典的「反直覺」行為之一，讓 AI 幫你把背後的機制講清楚：

**要用的 Prompt：**

> 請解釋 Java 的 Integer 快取機制（-128 到 127）：
> 為什麼 `Integer a = 100; Integer b = 100;` 用 == 比較是 true，
> 但 `Integer a = 200; Integer b = 200;` 用 == 比較卻是 false？
> 請用「倉庫預先準備好的貨架」之類的比喻說明，100 字以內。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>面試延伸：</b> 這題常會被追問「那 int a = 200; int b = 200; a == b 呢？」——別忘了基本型態的 == 永遠比較數值，不受快取影響，這是分辨你是否真懂原理的關鍵。
</div>

<!--
【操作提示】
可以現場追問學生剛才提到的延伸問題，測試大家是否真的分清楚「基本型態的 ==」跟「包裝類別的 ==」是兩回事。

【收斂一句話】
比較數值永遠用 equals()，== 只在你清楚知道自己在比較什麼的時候才安全。
-->

---

# null 陷阱：自動拆箱的危險

當包裝類別為 `null`時，自動拆箱會觸發 NullPointerException：

```java
Integer hp = null;

// 以下會拋出 NullPointerException！
int damage = hp - 10;
```

```java
// 安全寫法：先判斷 null
int damage = (hp != null) ? hp - 10 : 0;
```

<!--
【情境切入】
我們知道 `Integer` 是物件，物件可以是 `null`。如果一個 `Integer` 變數是 `null`，但我們又拿它去做數學運算，會發生什麼事？

【概念定義】
答案是：「當 `null` 的包裝類別物件被自動拆箱時，編譯器會嘗試呼叫 `intValue()`，但 `null` 物件根本沒有方法可以呼叫，於是拋出 `NullPointerException`」。

【生活化比喻】
這就像收到一個空的紅包袋。我們把手伸進去想拿錢出來（拆箱），結果發現裡面什麼都沒有——程式直接當場「崩潰」給我們看，這就是 `NullPointerException`。

⚠️ 易錯點提醒：
範例中 `hp - 10` 這一行，看起來只是普通的減法，但因為 `hp` 是 `null`，自動拆箱會直接讓程式拋出例外。安全的寫法是先用 `(hp != null) ? hp - 10 : 0` 判斷，確認不是 `null` 才進行運算。

💼 業界實務：
在處理從資料庫或外部 API 取得的資料時，數值欄位常常用包裝類別表示（因為可能沒有值，也就是 `null`）。拿到資料後做運算前，一定要先檢查是否為 `null`，否則很容易在執行階段才爆出例外。
-->

---
layout: default
---

# 🎬 AI 協作時刻：兩大陷阱面試題驗收

「Integer 快取」和「自動拆箱 NPE」是 junior Java 面試最常見的兩個「陷阱題」，考前讓 AI 幫你出題：

**要用的 Prompt：**

> 根據「Integer == 比較的快取陷阱」和「自動拆箱遇到 null 會拋 NullPointerException」
> 這兩個常見錯誤，出 3 題選擇題，混合考這兩個觀念，難度由淺到深。
> 一次只出一題，等我回答後才公布答案，
> 答錯時不要直接講答案，先給一個提示。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>帶回家用：</b> 每學完一個章節，都可以用這個 prompt 叫 AI 考你，比自己看筆記更容易發現盲點。
</div>

<!--
【操作提示】
可以實際找一位同學跟 AI 互動作答，其他人在台下一起猜答案，增加參與感。

【收斂一句話】
包裝類別是物件不是數字，只要記得這一點，這兩個陷阱都有跡可循。
-->

---
layout: default
---

# 練習 2：安全計算生命值
### 任務說明

宣告 `Integer maxHp = 100;` 與 `Integer currentDamage = null;`。

請寫一段程式碼，計算「剩餘生命值 = maxHp - currentDamage」，但要避免 `currentDamage` 為 `null` 時發生 `NullPointerException`，若為 `null` 則視為傷害 0。

並額外驗證：`Integer x = 100; Integer y = 100;` 用 `==` 比較的結果，與 `Integer x = 200; Integer y = 200;` 用 `==` 比較的結果是否相同。

<!--
【任務鋪陳】
剛才看到自動裝拆箱帶來的兩個陷阱：`==` 比較的意外結果，以及 `null` 拆箱的例外。這次把兩個陷阱放進同一個練習裡，實際感受一下。

【引導思考】
`currentDamage` 是 `null` 的時候，`maxHp - currentDamage` 會發生什麼事？要怎麼判斷才能避免程式崩潰？另外，100 跟 200 用 `==` 比較，結果真的會不一樣嗎？動手跑一次就知道。
-->

---
layout: default
---

# 練習 2：解題提示
### 提示說明

1. 用三元運算子判斷 `null`：`int remainingHp = (currentDamage != null) ? maxHp - currentDamage : maxHp;`
2. 印出結果，確認 `currentDamage` 為 `null` 時 `remainingHp` 等於 `maxHp`
3. 分別宣告 `Integer x = 100, y = 100;` 與 `Integer x2 = 200, y2 = 200;`，用 `==` 比較並印出結果
4. 觀察 100 的比較結果是 `true`，200 的比較結果是 `false`，這就是 `Integer` 快取範圍造成的現象

<!--
【帶讀解法】
第一題用三元運算子先擋掉 `null`，避免自動拆箱時出錯；第二題則是直接重現「快取範圍」這個陷阱——100 在快取範圍內所以 `==` 為 true，200 超出範圍所以為 false。

⚠️ 易錯點提醒：
這兩個陷阱平時寫程式很容易忽略，但都是面試常考的題目，建議實際跑過一次，加深印象。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Integer 類別的常用方法

<!--
【段落轉換】
接下來要深入認識 `Integer` 這個最常用的包裝類別，看看它提供了哪些好用的工具方法。
-->

---
layout: default
---

# Integer 常數

Integer 類別提供了重要的邊界常數：

```java
System.out.println(Integer.MAX_VALUE); // 2147483647
System.out.println(Integer.MIN_VALUE); // -2147483648
System.out.println(Integer.SIZE);      // 32 (位元數)
System.out.println(Integer.BYTES);     // 4  (位元組數)
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 int 的範圍是 -2<sup>31</sup> 到 2<sup>31</sup>-1，超出此範圍會發生「整數溢位 (overflow)」，需改用 <code>long</code> 或 <code>Long</code>。
</div>

<!--
【情境切入】
我們知道 `int` 不能存放無限大的數字，但具體範圍到底是多少？如果不小心存了一個超出範圍的數字，會發生什麼事？

【概念定義】
「`Integer` 類別提供了一組常數，描述 `int` 型態的邊界與大小」：`MAX_VALUE`、`MIN_VALUE` 是最大值與最小值，`SIZE` 是位元數，`BYTES` 是位元組數。

【生活化比喻】
這就像一個存錢筒上標示的「最大容量」——`MAX_VALUE` 大約是 21 億，是這個存錢筒（`int`）能裝的最大金額；如果硬塞進超過這個數量的錢，存錢筒會「爆開」，這就是整數溢位。

⚠️ 易錯點提醒：
如果計算結果可能超過 21 億（例如累加大量資料、計算階乘），就要改用 `long` 或 `Long`，否則會發生「整數溢位」，數字會變成奇怪的負數，而且不會有任何錯誤訊息提醒我們。
-->

---

# Integer 型態轉換方法

| 方法名稱 | 說明 |
| --- | --- |
| `Integer.parseInt(String s)` | 字串轉 `int` |
| `Integer.valueOf(int i)` | `int` 轉 `Integer` |
| `Integer.valueOf(String s)` | 字串轉 `Integer` |
| `intValue()` | `Integer` 轉 `int`（拆箱）|
| `toString()` | `Integer` 轉字串 |

<!--
【情境切入】
在實際開發中，我們經常需要在「字串」「`int`」「`Integer`」這三種型態之間互相轉換——例如使用者透過 `Scanner` 輸入的內容永遠是字串，但我們想拿來做數學運算。

【概念定義】
「`Integer` 類別提供了一整組型態轉換方法」：`parseInt` 把字串轉成 `int`，`valueOf` 可以把 `int` 或字串轉成 `Integer`，`intValue` 把 `Integer` 拆箱成 `int`，`toString` 則反過來轉成字串。

【生活化比喻】
這些方法就像是貨幣兌換處的不同窗口：有的窗口收文字鈔票換成硬幣（`parseInt`），有的窗口把硬幣換成紅包袋（`valueOf`），方向不同但都是在做「轉換」這件事。

⚠️ 易錯點提醒：
`parseInt` 回傳的是基本型態 `int`，`valueOf` 回傳的是包裝類別 `Integer`，雖然數值看起來一樣，但型態不同；如果之後要放進集合，記得用 `valueOf` 或讓自動裝箱幫我們處理。
-->

---

# 字串轉整數 — 範例

```java
String inputHp = "150";

// 字串 → int (最常用)
int hp = Integer.parseInt(inputHp);

// 字串 → Integer
Integer hpObj = Integer.valueOf(inputHp);

System.out.println(hp + 50);     // 200
System.out.println(hpObj + 50);  // 200
```

<!--
【範例目的】
這個範例示範最常見的場景：把使用者輸入的文字「150」轉換成可以參與數學運算的數字。

【帶讀關鍵行】
`Integer.parseInt(inputHp)` 把字串 `"150"` 轉成 `int` 型態的 `150`；`Integer.valueOf(inputHp)` 則轉成 `Integer` 物件，但因為自動拆箱，後面一樣可以直接做加法。

⚠️ 易錯點提醒：
如果字串內容不是純數字（例如 `"150元"` 或 `"abc"`），`parseInt` 會直接拋出 `NumberFormatException`。它不會幫我們「過濾雜質」，字串格式必須完全符合數字格式才能轉換成功。

【預期結果】
```
200
200
```
-->

---

# 數值比較與工具方法

| 方法名稱 | 說明 |
| --- | --- |
| `Integer.max(int a, int b)` | 回傳較大值 |
| `Integer.min(int a, int b)` | 回傳較小值 |
| `Integer.sum(int a, int b)` | 回傳總和 |
| `Integer.compare(int x, int y)` | 比較大小，回傳負/零/正 |

<!--
【情境切入】
比較兩個數字的大小、計算總和，我們當然可以自己寫 `if-else` 或用 `+`，但 `Integer` 類別其實已經幫我們把這些常見操作包成現成的方法了。

【概念定義】
「`Integer` 提供了一組 `static` 工具方法」：`max`、`min` 回傳較大值和較小值，`sum` 回傳總和，`compare` 則比較兩個數字，回傳負數、零或正數表示大小關係。

【生活化比喻】
這些方法就像裁判手上的計分板：`max`、`min` 幫我們直接喊出「誰比較大」，`compare` 則更細緻地告訴我們「贏多少、輸多少，還是平手」。

【程式世界怎麼用】
雖然 `Math.max`、`+` 也能做到同樣的事，但 `Integer.max`、`Integer.sum` 可以直接當作「方法參考 (Method Reference)」傳入 Stream 等 API 中使用，這在現代 Java 程式設計中越來越常見。
-->

---

# 數值比較 — 範例

```java
int atkA = 180;  // 炭治郎攻擊力
int atkB = 160;  // 禰豆子攻擊力

System.out.println(Integer.max(atkA, atkB));     // 180
System.out.println(Integer.min(atkA, atkB));     // 160
System.out.println(Integer.sum(atkA, atkB));     // 340
System.out.println(Integer.compare(atkA, atkB)); // 正值 (atkA > atkB)
```

<!--
【範例目的】
這個範例用兩個角色的攻擊力數值，示範 `Integer` 工具方法的實際用法。

【帶讀關鍵行】
`Integer.max(atkA, atkB)` 直接回傳較大的攻擊力；`Integer.compare(atkA, atkB)` 因為 `atkA` 比較大，所以回傳一個正數，代表「第一個參數比第二個大」。

⚠️ 易錯點提醒：
`compare` 回傳的不是 `true`/`false`，而是一個整數：正數代表第一個比較大、負數代表第一個比較小、`0` 代表相等。不要把它跟 `equals()` 搞混。

【預期結果】
```
180
160
340
正值
```
-->

---
layout: default
---

# 🎬 AI 協作時刻：parseInt 為什麼噴 NumberFormatException？

`Integer.parseInt()` 是這一節最常用的方法，也是最容易在使用者輸入時炸掉的地方：

**要用的 Prompt：**

> 我寫了這段 code：
> ```java
> {貼上你的程式碼，例如：
> String input = "150元";
> int hp = Integer.parseInt(input);}
> ```
> 執行時噴出 NumberFormatException。請幫我解釋這個例外是什麼意思、
> 為什麼 parseInt 沒辦法處理「150元」這種字串，
> 以及實務上該怎麼在轉換前先檢查字串格式，不要直接幫我改程式碼，先說明原因。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>易混淆點：</b> <code>parseInt</code> 不會幫你「過濾雜質」，字串裡只要有一個字元不是數字（包含全形空格、單位文字），就會直接拋出例外，跟前面學到「null 拆箱會拋 NullPointerException」是兩種不同的例外，別搞混了。
</div>

<!--
【操作提示】
可以現場示範把 "150元" 換成 "150"、" 150"（前面多一個空格）分別執行，比較哪些會成功、哪些會失敗，體會 parseInt 對格式的嚴格程度。

【收斂一句話】
parseInt 要求字串「完全」符合數字格式，使用者輸入一定要先驗證再轉換。
-->
---
layout: default
---

# 練習 3：讀取使用者輸入並計算
### 任務說明

請利用 `Scanner` 讀取兩個整數字串，轉換後計算並印出：
1. 兩數的和、差、積
2. 哪個數比較大

```java
Scanner sc = new Scanner(System.in);
String s1 = sc.nextLine();
String s2 = sc.nextLine();
// 請利用 Integer 的方法完成轉換與計算
```

<!--
【任務鋪陳】
這一節學了 `parseInt` 把字串轉成數字，也學了 `Integer.max` 等比較方法，現在把這兩招實際用在「讀取使用者輸入」這個最常見的場景上。

【引導思考】
使用者輸入的內容一定是文字，但「和、差、積」需要的是數字運算。要先做哪一步轉換，才能開始計算？比較大小時，又有哪個現成的方法可以用？
-->

---

# 練習 3：解題提示

1. 使用 `Integer.parseInt()` 將字串轉為 `int`。
2. 用算術運算子計算和、差、積。
3. 使用 `Integer.max()` 找出較大值。

<!--
【帶讀解法】
先把兩個字串都用 `parseInt` 轉成 `int`，接下來就是普通的數學運算：加、減、乘直接用運算子；比較大小則用 `Integer.max`，把結果印出來即可。

💼 業界實務：
「讀取輸入字串 → `parseInt` 轉換 → 進行運算」是處理使用者輸入最基本也最常見的流程，務必熟練。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 其他包裝類別方法

<!--
【段落轉換】
最後我們快速看一下除了 `Integer` 之外，其他包裝類別常用的工具方法。
-->

---
layout: default
---

# Double 類別

| 方法名稱 | 說明 |
| --- | --- |
| `Double.parseDouble(String s)` | 字串轉 `double` |
| `Double.isNaN(double v)` | 是否為 NaN（非數值）|
| `Double.isInfinite(double v)` | 是否為無限大 |
| `Double.max(double a, double b)` | 回傳較大值 |

```java
System.out.println(Double.parseDouble("3.14")); // 3.14
System.out.println(Double.isNaN(0.0 / 0.0));    // true
System.out.println(Double.isInfinite(1.0 / 0.0)); // true
```

<!--
【情境切入】
`Integer` 處理整數，那帶有小數的數值呢？`Double` 包裝類別提供的方法跟 `Integer` 很像，但多了幾種針對「特殊數值」的判斷。

【概念定義】
「`Double` 類別除了 `parseDouble`、`max` 等常見方法，還提供 `isNaN` 與 `isInfinite`，用來判斷一個 `double` 值是不是『非數值 (NaN)』或『無限大』」。

【生活化比喻】
`NaN`（Not a Number）就像是計算機按出 `0 ÷ 0` 之後螢幕顯示的「錯誤」——它不是任何具體的數字，但程式仍然需要一個方式來表示「這個結果沒有意義」。

⚠️ 易錯點提醒：
`Double.NaN == Double.NaN` 的結果是 `false`！`NaN` 不會承認自己等於任何東西，包括它自己。如果想判斷一個值是不是 `NaN`，必須使用 `Double.isNaN()`，不能用 `==`。
-->

---

# Boolean 類別

| 方法名稱 | 說明 |
| --- | --- |
| `Boolean.parseBoolean(String s)` | 字串轉 `boolean` |
| `Boolean.valueOf(boolean b)` | `boolean` 轉 `Boolean` |
| `Boolean.toString(boolean b)` | `boolean` 轉字串 |
| `Boolean.compare(boolean x, boolean y)` | 比較大小（true > false）|

```java
System.out.println(Boolean.parseBoolean("true"));  // true
System.out.println(Boolean.parseBoolean("True"));  // true
System.out.println(Boolean.parseBoolean("yes"));   // false
```

<!--
【情境切入】
有些設定檔或系統屬性會用字串 `"true"`、`"false"` 來表示開關狀態，這時候我們需要把字串轉換成 `boolean` 才能拿來做條件判斷。

【概念定義】
「`Boolean.parseBoolean(String)` 會把字串轉換成 `boolean`：只要字串內容（不分大小寫）等於 `"true"`，就回傳 `true`，其他所有情況一律回傳 `false`」。

【生活化比喻】
這個方法就像一個只認識「通關密語」的門衛——只要說的是「true」（不管大小寫），門就開；說任何其他的話，包括「yes」「對」「沒問題」，門衛都當作沒聽到，一律不開門。

⚠️ 易錯點提醒：
`Boolean.parseBoolean("yes")` 的結果是 `false`，不是 `true`！很多人會直覺以為「yes」也算是「對」，但這個方法只認得 `"true"` 這個字串，其他字串（即使語意上是肯定的）通通視為 `false`。
-->

---

# Character 類別（複習整合）

Character 是字元型態 `char` 的包裝類別，常用方法複習：

| 方法名稱 | 說明 |
| --- | --- |
| `Character.isDigit(char ch)` | 是否為數字字元 |
| `Character.isLetter(char ch)` | 是否為字母字元 |
| `Character.toUpperCase(char ch)` | 轉大寫 |
| `Character.toLowerCase(char ch)` | 轉小寫 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Character 類別在 Ch 14 已詳細介紹，這裡複習其作為包裝類別的定位。
</div>

<!--
【回顧】
我們在 Ch 14 已經詳細介紹過 `Character` 類別的這些方法，這裡只是站在「包裝類別」的角度，重新複習一次它的定位。

【核心說明】
「`Character` 是 `char` 的包裝類別」，跟 `Integer`、`Double` 一樣，都是讓基本型態的值能「物件化」，並提供一系列工具方法。

【生活化比喻】
如果把 `Integer`、`Double` 比喻成處理「數字」的專員，`Character` 就是專門處理「單一字元」的專員——判斷是不是數字字元、是不是字母、大小寫轉換，都是它的工作範圍。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
包裝類別的概念、自動裝拆箱、各種工具方法都學完了，最後用兩個練習把這一章的內容串起來。
-->

---
layout: default
---

# 練習 4：判斷字串是否為合法整數
### 任務說明

撰寫一個方法 `isInteger(String s)`，判斷輸入的字串是否可以成功轉為整數。

- `"123"` → true
- `"-45"` → true
- `"12.3"` → false
- `"abc"` → false

<!--
【任務鋪陳】
在真實世界，使用者總會輸入一些奇奇怪怪的內容，比如在年齡欄位寫「永遠的 18 歲」。我們已經知道 `parseInt` 遇到非法字串會出問題，這次來練習怎麼「優雅地」處理這個狀況。

【引導思考】
`parseInt` 在遇到非法字串時會拋出 `NumberFormatException`。我們可以利用 `try-catch` 捕捉這個例外，藉此判斷一個字串是不是合法整數——想一想，這個邏輯該怎麼安排？
-->

---

# 練習 4：解題提示

```java
static boolean isInteger(String s) {
    try {
        Integer.parseInt(s);
        return true;
    } catch (NumberFormatException e) {
        return false;
    }
}
```

<!--
【帶讀解法】
這是一個非常經典的「試著解析，失敗就回傳 false」寫法：`try` 裡面嘗試 `parseInt`，如果成功就繼續執行 `return true`；如果字串非法，`parseInt` 會拋出 `NumberFormatException`，被 `catch` 接住後回傳 `false`。

💼 業界實務：
這種「用 try-catch 包住可能失敗的轉換，藉此做判斷」的寫法，在處理表單驗證、外部資料解析時非常常見，是包裝類別與例外處理結合的典型範例。
-->

---
layout: default
---

# 練習 5 (綜合)：簡易屬性面板
### 任務說明

設計一個簡易的角色屬性輸入工具，請完成：

1. 用 `Scanner` 讀取兩個字串：角色名稱、生命值（可能是合法數字，也可能輸入錯誤格式）
2. 使用 `isInteger()` 判斷生命值字串是否合法；若不合法，將生命值視為 `0`
3. 將最終生命值與 `Integer` 上限做比較（用 `Integer.max` 取兩者較小值，避免超過上限 `9999`）
4. 印出角色名稱與最終生命值

**範例輸入：**
```
炭治郎
abc
```

**範例輸出：**
```
角色：炭治郎，生命值：0
```

<!--
【任務鋪陳】
這一章我們學了包裝類別的基本概念、自動裝拆箱的陷阱，還有 `Integer`、`Boolean` 等類別的常用方法。這個綜合練習，就是要把這些片段串成一個小工具。

【引導思考】
第一步要先判斷輸入的生命值字串是不是合法整數，這時候哪個練習寫過的方法可以直接拿來用？確認合法性之後，又要怎麼確保數值不會超過我們設定的上限？想一想 `isInteger`、`parseInt`、`Integer.max` 這三個工具要怎麼組合起來。
-->

---
layout: default
---

# 練習 5 (綜合)：解題提示
### 提示說明

1. 用 `Scanner` 依序讀入角色名稱與生命值字串
2. 呼叫前面練習寫好的 `isInteger(hpStr)`：若為 `true`，用 `Integer.parseInt(hpStr)` 轉成 `int`；若為 `false`，生命值設為 `0`
3. 用 `Integer.min(hp, 9999)` 確保生命值不超過上限 `9999`（注意：題目要「不超過上限」，因此要取較小值）
4. 用 `String.format` 或字串連接，印出最終結果

<!--
【帶讀解法】
這題其實是把前面學過的小工具一個一個接起來：`isInteger` 負責「擋掉錯誤格式」，`parseInt` 負責「轉換成數字」，`Integer.min` 負責「限制範圍」。每一步都是這一章學過的內容，差別只在於把它們組合在同一個流程裡。

⚠️ 易錯點提醒：
題目要「避免超過上限」，所以要用 `Integer.min(hp, 9999)`，取「比較小的那一個」；如果寫成 `Integer.max`，反而會讓數值不小於 9999，跟原本的需求恰好相反。寫程式時記得多想一步：到底是要「設下限」還是「設上限」。

💼 業界實務：
這種「先驗證格式、轉換型態、再限制合理範圍」的三段式處理，是處理使用者輸入時非常常見的模式，幾乎所有表單驗證的邏輯都可以套用這個思路。
-->

---

# 總結

- **每種基本型態都有對應的包裝類別**（`int`→`Integer`、`char`→`Character`），把值物件化才能放進集合、呼叫方法
- **自動裝箱／拆箱（Autoboxing/Unboxing）** 讓基本型態與包裝類別可以直接互相指派，背後由編譯器自動呼叫 `valueOf()` / `intValue()`
- **包裝類別比較內容要用 `equals()`，不能用 `==`** — `==` 比的是位址；`Integer` 有 -128~127 的快取，會讓 `==` 結果反直覺
- **拆箱 `null` 的包裝類別會拋出 `NullPointerException`** — 運算前務必先判斷是否為 `null`
- **`Integer` 提供常數（`MAX_VALUE`）與工具方法**（`parseInt`、`max`、`compare`），`Double`、`Boolean`、`Character` 也各有對應方法
- **`parseXxx` 遇到非法字串會丟 `NumberFormatException`**，常搭配 `try-catch` 做輸入驗證

<!--
我們把這一章整理成六個重點。

第一，Java 為每一種基本型態都準備了對應的包裝類別，因為集合框架和物件導向的方法呼叫都需要「物件」，而基本型態本身做不到這件事。

第二，自動裝箱和自動拆箱讓我們不用手動呼叫 valueOf()、intValue()，編譯器會在背後自動幫我們轉換，讓程式碼簡潔很多，像 ArrayList<Integer> 放入 int 值就是最常見的應用場景。

第三，包裝類別是物件，比較數值內容一定要用 equals()，不能用 ==；尤其 Integer 有 -128 到 127 的快取機制，會讓小數字的 == 意外變成 true，但超出範圍就是 false，這是最容易踩到的陷阱。

第四，如果包裝類別變數是 null，卻直接拿去做數學運算觸發自動拆箱，會直接拋出 NullPointerException，處理從資料庫或外部來源拿到的數值時，運算前一定要先檢查是否為 null。

第五，Integer 提供了 MAX_VALUE、MIN_VALUE 等邊界常數，還有 parseInt、max、min、compare 這些工具方法；Double、Boolean、Character 也都各自有對應的方法可以用。

第六，parseInt、parseDouble 這類轉換方法，遇到格式不合法的字串會拋出 NumberFormatException，實務上常搭配 try-catch 來驗證使用者輸入是否為合法數字。

這六點加起來，就是包裝類別的完整概念。下一章我們要繼續往下走了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【開場白】
到這裡，我們已經完整認識了「包裝類別」——它是什麼、為什麼需要它、Java 怎麼幫我們自動轉換，以及 `Integer`、`Double`、`Boolean` 這些常用類別提供的工具方法。

【等待與觀察】
有沒有人對「`==` 和 `equals()` 的差別」還有疑問的？或是對「自動裝拆箱」背後到底發生了什麼還想再確認一次？這些都是很容易在後面章節（尤其是集合框架）反覆遇到的概念，現在多問一點，之後會省下很多踩坑的時間。
-->
