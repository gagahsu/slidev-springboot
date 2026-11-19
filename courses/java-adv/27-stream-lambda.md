---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 現代化 API — Stream 與 Lambda（進階／自學）
routeAlias: ch27
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
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">Stream 與 Lambda（進階／自學）</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用更少的程式碼，做更多的事」<br/>進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到 Stream 與 Lambda 的進階自學單元！如果基礎版的內容你已經消化得差不多了，那這裡就是讓你的生產線「全自動化升級」的地方。

【為什麼要學這個？】
基礎版教的是「怎麼蓋一條能動的生產線」，這份自學內容教的是「怎麼把生產線蓋得更聰明、更省力」——處理巢狀資料、用數字模式做統計、提早停機省成本，還有同時產出多份報表。

【今天學完你會能做什麼】
學完這份自學內容，遇到「資料裡面還有資料」「要算總和平均」「資料已排序想提早結束」「要同時算好幾個統計值」這些情境，你都能用一行 Stream 寫法解決，而不用回頭寫笨重的迴圈。
-->

---
layout: default
---

# Outline

- **方法參考進階形式**：bound/unbound instance method reference、建構子參考的進階用法
- **flatMap**：攤平巢狀集合
- **Primitive Stream**：`mapToInt`、`mapToDouble` 與統計操作
- **takeWhile / dropWhile (JDK 9)**：有序串流的斷句處理
- **teeing 收集器 (JDK 12)**：一次串流，兩份報表
- **Optional 詳細用法**：`map`、`flatMap`、`filter`、`ifPresentOrElse`
- **自學練習**

<!--
【課程預覽】
這份自學內容分成五大主題：方法參考的進階形式、flatMap 攤平巢狀資料、Primitive Stream 做統計、takeWhile/dropWhile 處理已排序資料，還有 teeing 跟 Optional 的進階用法。

【學習建議】
這些都是基礎版「夠用就好」之後的延伸。建議你先確認基礎版的 Lambda、Stream pipeline、Collectors 都已經熟悉，再來啃這份自學內容，會比較有感覺。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 方法參考進階形式

<!--
【章節開場】
第一部分，方法參考的進階形式。基礎版學過 `::` 的四種基本形狀，這裡我們把第三種「`ClassName::instanceMethod`」拆開來看仔細，
搞懂為什麼它跟前兩種「邏輯上不太一樣」。
-->

---
layout: default
---

# 方法參考 — 四種形式範例

```java
// 1. ClassName::staticMethod
List.of("1","2").stream().map(Integer::parseInt);
// 2. obj::instanceMethod
List.of("炭治郎","善逸").forEach(System.out::println);
// 3. ClassName::instanceMethod
List.of("炭","治郎").stream().map(String::length);
// 4. ClassName::new
Stream.of(1,2,3).collect(Collectors.toCollection(ArrayList::new));
```

<!--
【帶讀程式碼前的鋪陳】
我們先快速複習這四種「指名道姓」的方式，再來深入拆解第三種跟第四種。

【逐步解說】
`Integer::parseInt`：叫 Integer 這個類別本身去做事，是「靜態方法參考」。
`System.out::println`：叫 `System.out` 這個已經存在的物件去噴字，是「特定物件的方法參考」。
`String::length`：注意，這裡沒有指定「哪一個」字串，是 Stream 裡每個元素「自己量自己」。
`ArrayList::new`：把建構子當成一個「製造機」傳給 `Collectors.toCollection`。

⚠️ 學生常見誤解：
很多人分不清楚第一種跟第三種、第二種跟第四種。下一頁我們用更明確的分類來拆解。
-->

---

# Bound vs Unbound：方法參考的兩種角色

`obj::instanceMethod` 與 `ClassName::instanceMethod` 看起來很像，但 lambda 的「第一個參數」用途完全不同：

| 形式 | 名稱 | 等同 Lambda |
| --- | --- | --- |
| `obj::instanceMethod` | **Bound**（已綁定接收者） | `(args) -> obj.method(args)` |
| `ClassName::instanceMethod` | **Unbound**（未綁定接收者） | `(recv, args) -> recv.method(args)` |

```java
String prefix = "鬼殺隊－";
Function<String, String> bound = prefix::concat;        // bound：prefix 已固定
Function<String, Integer> unbound = String::length;     // unbound：recv 由 Stream 元素提供
System.out.println(bound.apply("炭治郎"));   // 鬼殺隊－炭治郎
System.out.println(unbound.apply("炭治郎")); // 3
```

<!--
【核心說明】
「Bound」跟「Unbound」是方法參考背後真正的分類邏輯，比死記「四種形式」更能說明它「為什麼可以這樣用」。

【生活化比喻】
Bound 就像是「指定某個員工」做事——`prefix::concat` 已經綁定了 `prefix` 這位員工，之後丟什麼參數進來，都是這位員工在處理。
Unbound 則像是「貼出一張作業說明書」——`String::length` 沒有指定是「哪一個」字串，而是 Stream 跑到每個元素時，那個元素自己變成「接收者」去執行 `length()`。

⚠️ 學生常見誤解：
看到 `String::length` 不要以為「String 類別」會去執行 `length()`——`String` 本身沒有 `length()` 這個方法可以直接呼叫，真正執行的是 Stream 裡的「每一個字串」。
-->

---

# 建構子參考的進階用法

`ClassName::new` 不只能用在 `Collectors.toCollection`，也能搭配 `Function`、`Supplier` 等任意函數式介面：

| 用法 | 範例 | 對應介面 |
| --- | --- | --- |
| 無參數建構子 | `ArrayList::new` | `Supplier<ArrayList<T>>` |
| 單參數建構子 | `StringBuilder::new` | `Function<String, StringBuilder>` |
| 集合工廠搭配 | `Collectors.toCollection(TreeSet::new)` | 指定收集容器型態 |

```java
// 把每個名字變成獨立的 StringBuilder
List<StringBuilder> sbList = List.of("炭治郎", "善逸").stream()
    .map(StringBuilder::new)
    .toList();
System.out.println(sbList.get(0).append("！")); // 炭治郎！
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵：</b> 建構子參考的「形狀」由函數式介面決定——無參數建構子對應 <code>Supplier</code>，單參數建構子對應 <code>Function&lt;參數型態, 類別&gt;</code>。
</div>

<!--
【核心說明】
建構子參考跟一般方法參考一樣，重點是「形狀要對得上」函數式介面。

【生活化比喻】
`ArrayList::new` 像是一台「不用投幣就能吐出空箱子」的機器（`Supplier`）。
`StringBuilder::new` 像是一台「投入一張紙條、吐出一個記事本」的機器（`Function`）——紙條的內容會變成記事本的初始文字。

💼 業界實務：
`Collectors.toCollection(TreeSet::new)` 這種寫法在需要「收集結果同時要排序、去重」時非常實用，比先 `toList()` 再轉型乾淨多了。
-->

---
layout: default
---

# 練習 1：方法參考形式判斷
### 任務說明

下列三段程式碼各使用了哪一種方法參考？請判斷是 **bound**、**unbound** 還是**建構子參考**：

```java
List<String> names = List.of("炭治郎", "善逸", "伊之助");

// (A)
names.forEach(System.out::println);

// (B)
names.stream().map(String::toUpperCase);

// (C)
names.stream().collect(Collectors.toCollection(LinkedList::new));
```

<!--
【出題前的鋪陳】
剛才學了 bound / unbound / 建構子參考三種分類，現在來考考大家的眼力。

【問題引導】
重點不是背答案，而是想：「`::` 左邊的東西，是『已經存在的某個物件』，還是『一個類別名稱、等著接收 Stream 元素』，還是『一個建構子』？」

【等待與觀察】
給大家 2 分鐘討論，三題都不難，重點是說出「為什麼」。
-->

---

# 練習 1：解題提示
### 提示說明

1. `(A)` `System.out` 是已經存在的物件 → **bound**
2. `(B)` `String` 是類別名稱，`toUpperCase()` 套用在 Stream 裡每個字串自己身上 → **unbound**
3. `(C)` `LinkedList::new` 是建構子，提供給 `Collectors.toCollection` 當「容器工廠」 → **建構子參考**

```java
// (A) bound：System.out 已綁定接收者
// (B) unbound：每個 String 元素自己呼叫 toUpperCase()
// (C) 建構子參考：LinkedList::new 作為容器工廠
```

<!--
【逐步解說】
(A) 的關鍵是 `System.out` 本身就是一個物件，已經「綁定」好了。
(B) 的關鍵是 `String` 是型態名稱，不是某個特定字串；真正的「主角」是 Stream 跑過去的每一個元素。
(C) 的關鍵是 `::new`，看到 `::new` 就知道是建構子參考，常見於 `Collectors.toCollection`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Stream 進階中間操作

<!--
【章節開場】
第二部分，Stream 的進階中間操作。基礎版學過 `filter`、`map`、`sorted` 這些「單層」操作，
這裡我們處理「巢狀結構」「數值統計」跟「已排序資料的提早收工」三種進階情境。
-->

---
layout: default
---

# flatMap — 攤平巢狀結構

將「集合中的集合」攤平為單一串流：

```java
List<List<String>> nested = List.of(
    List.of("水柱", "炭治郎"),
    List.of("雷柱", "善逸")
);
List<String> flat = nested.stream()
    .flatMap(List::stream)
    .toList();
System.out.println(flat); // [水柱, 炭治郎, 雷柱, 善逸]
```

<!--
【核心說明】
`flatMap` 是用來對付「箱子裡面還有箱子」的情況。

【生活化比喻】
你有五個包裹（外層 List），每個包裹裡面有三件衣服（內層 List）。如果你用 `map`，生產線上會出現五個「還沒打開的包裹」。
如果你用 `flatMap`，生產線會把每個包裹打開，直接把十五件衣服一件一件平鋪在輸送帶上。這就是「攤平」的意思——`flatMap(List::stream)` 等於是「打開每個包裹，把裡面的東西倒到同一條輸送帶」。

💼 業界實務：
當你從資料庫撈出「訂單」，每個訂單裡有很多「商品」，你想一次看所有訂單的所有商品時，`flatMap` 就是你的救星。
-->

---

# Primitive Stream (基本型態串流)

`map()` 回傳 `Stream<T>`；若需統計數值，改用 `mapToInt`、`mapToDouble`：

| 方法 | 回傳型態 | 常用終端操作 |
| --- | --- | --- |
| `mapToInt(ToIntFunction)` | `IntStream` | `sum()`、`average()`、`min()`、`max()` |
| `mapToDouble(ToDoubleFunction)` | `DoubleStream` | 同上（回傳 double）|

```java
List<String> names = List.of("炭治郎", "禰豆子", "善逸");
double avg = names.stream()
    .mapToInt(String::length).average().getAsDouble();
System.out.println(avg); // 2.667（(3+3+2)/3）
```

<!--
【核心說明】
如果你在算錢或算分數，請用 `mapToInt` 或 `mapToDouble`。

【生活化比喻】
一般的 Stream 像是在搬「箱子」，你要算重量很麻煩，因為每個箱子都還包著外包裝（物件）。
`mapToInt` 就像是把箱子全部拆開，只留下裡面的「數字內容物」放上輸送帶，這時候你就能直接按計算機（`sum()`、`average()`）了。

⚠️ 學生常見誤解：
算平均值 `average()` 回傳的是 `OptionalDouble`，因為如果輸送帶上沒東西，平均值就是「不存在」，Java 很嚴謹，不會隨便給你一個 0。要用 `.getAsDouble()` 取出實際數值。
-->

---

# 有序串流的斷句處理 (JDK 9)

JDK 9 新增了兩個處理有序（Sorted）串流的強大工具：

| 方法 | 說明 |
| --- | --- |
| `takeWhile(Predicate)` | 從頭開始取，直到條件**不成立**就停止 |
| `dropWhile(Predicate)` | 從頭開始丟，直到條件**不成立**才開始取 |

```java
List<Integer> nums = List.of(1, 2, 3, 4, 5, 4, 3, 2, 1);

// takeWhile: 取出 < 4 的元素（遇到 4 即停止）
nums.stream().takeWhile(n -> n < 4); // [1, 2, 3]

// dropWhile: 丟掉 < 4 的元素（遇到 4 才開始取）
nums.stream().dropWhile(n -> n < 4); // [4, 5, 4, 3, 2, 1]
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>與 filter 的不同：</b> filter 會檢查「所有」元素；takeWhile 只要條件一失敗就立刻收工。
</div>

<!--
【核心說明】
JDK 9 新出的 `takeWhile` 是個「沒耐心的工頭」。

【生活化比喻】
`filter` 像是一個盡責的警衛，他會檢查輸送帶上每一個經過的人，不管前面遇過什麼狀況。
`takeWhile` 像是一個偷懶的門房，只要看到第一個不符合的人，他就直接關門收工，後面的人連看都不看。
所以如果你的資料已經排好序（例如分數已經由高到低），`takeWhile` 找「前面連續符合條件」的那一段會非常快。

⚠️ 學生常見誤解：
`takeWhile`／`dropWhile` 的「條件不成立就停」是針對「順序」設計的，對沒排序的資料使用時，結果可能不是你直覺以為的「全部篩選」。
-->

---
layout: default
---

# 練習 2：成績串流統計
### 任務說明

宣告 `List<Integer>` 成績：`{45, 78, 90, 62, 55, 85, 91, 73}`

用 Stream 完成以下操作：
1. 計算及格（≥ 60）的人數
2. 找出所有成績中的最高分
3. 計算及格學生的平均分（提示：使用 `mapToInt().average()`）

<!--
【出題前的鋪陳】
這一關要把剛學的 Primitive Stream 用上場。我們要來處理數字統計。

【問題引導】
及格人數、最高分、及格者的平均。
記得喔，平均值要先把 Stream 轉成「數字模式」（`IntStream`），不然你會卡在 `Optional<Integer>` 裡面算不出 double。

【等待與觀察】
給大家 3 分鐘。如果 `average()` 回傳的型態讓你卡住，回頭看一下上一頁的補充說明。
-->

---

# 練習 2：解題提示
### 提示說明

1. `filter(...).count()` 計算數量
2. `max(Comparator.naturalOrder()).get()` 取最大值
3. 先 filter 再 `mapToInt(Integer::intValue).average()`

```java
List<Integer> s = List.of(45, 78, 90, 62, 55, 85, 91, 73);
long cnt = s.stream().filter(x -> x >= 60).count();
int max = s.stream().max(Comparator.naturalOrder()).get();
double avg = s.stream().filter(x -> x >= 60)
    .mapToInt(Integer::intValue).average().getAsDouble();
System.out.printf("及格：%d 人，最高：%d，平均：%.1f%n", cnt, max, avg);
```

<!--
【逐步解說】
及格人數：`filter + count`，這個基礎版就學過。
最高分：`max`，回傳 `Optional<Integer>`，用 `.get()` 取出。
平均分：先 `filter`（不及格的別來拉低平均！），然後 `mapToInt` 轉成數字模式，最後 `average().getAsDouble()` 拿到真正的 double 數字。
這三行寫完，你就是辦公室的統計之神了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# teeing 收集器

<!--
【章節開場】
第三部分，`Collectors.teeing`。這是 JDK 12 加入的收集器，
讓你只跑「一次」Stream，就能同時拿到「兩份」統計報表。
-->

---
layout: default
---

# 雙向收集器：teeing (JDK 12)

`Collectors.teeing` 允許你將同一個串流分流給兩個收集器，最後再將結果合併：

```java
// 範例：同時計算「及格人數」與「平均分數」
var result = Stream.of(85, 45, 90, 62)
    .collect(Collectors.teeing(
        Collectors.filtering(s -> s >= 60, Collectors.counting()), // 收集器 1
        Collectors.averagingInt(s -> s),                         // 收集器 2
        (count, avg) -> "及格人數：" + count + "，平均：" + avg   // 合併邏輯
    ));
System.out.println(result); // 及格人數：3，平均：70.5
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>設計目的：</b> 避免為了得到多個統計結果而對同一個集合進行多次 Stream 操作。
</div>

<!--
【核心說明】
`teeing` 就像是生產線上的「分叉路」。

【生活化比喻】
資料從同一個入口進來，馬上被分成兩條支線：一條拿去算「及格人數」，另一條拿去算「平均分數」。
兩條支線各自跑完後，最後一步把兩份報告合併成一個大包裹（範例裡是一個字串）。
如果不用 `teeing`，你就要把同一份資料跑兩次 Stream——一次算人數、一次算平均，等於生產線重複跑兩遍。

💼 業界實務：
`teeing` 特別適合「同一份資料要產出多項統計指標」的報表場景，例如「同時算總數、平均、最大值」放進一個結果物件回傳給前端。
-->

---
layout: default
---

# 練習 3：teeing 雙重統計
### 任務說明

宣告 `List<Integer>` 訂單金額：`{1200, 350, 4800, 220, 990, 60}`

用 `Collectors.teeing` 完成以下操作，**只跑一次 Stream**：
1. 收集器 1：計算金額 **≥ 500** 的訂單數量
2. 收集器 2：計算所有金額的總和
3. 合併邏輯：輸出 `"大額訂單數：X，總金額：Y"`

<!--
【出題前的鋪陳】
我們把上一頁的範例改成「訂單統計」的場景。

【問題引導】
想想看：第一個收集器要怎麼「先篩選再計數」？第二個收集器要用哪個 `Collectors` 方法算總和？

【等待與觀察】
給大家 3 分鐘。提示：`Collectors.filtering` 跟 `Collectors.summingInt` 是這題的關鍵字。
-->

---

# 練習 3：解題提示
### 提示說明

1. `Collectors.filtering(amount -> amount >= 500, Collectors.counting())` 算大額訂單數
2. `Collectors.summingInt(amount -> amount)` 算總金額
3. 合併邏輯用 lambda 拼出輸出字串

```java
List<Integer> orders = List.of(1200, 350, 4800, 220, 990, 60);
var result = orders.stream()
    .collect(Collectors.teeing(
        Collectors.filtering(a -> a >= 500, Collectors.counting()),
        Collectors.summingInt(a -> a),
        (bigCount, total) -> "大額訂單數：" + bigCount + "，總金額：" + total
    ));
System.out.println(result); // 大額訂單數：3，總金額：7620
```

<!--
【逐步解說】
收集器 1：`filtering` 先篩出 ≥ 500 的，再用 `counting()` 數有幾筆。
收集器 2：`summingInt` 直接把所有金額加總，不需要先篩選。
合併邏輯：兩個收集器的結果分別變成 `bigCount` 和 `total`，最後拼成一句話。
整段程式碼只走了一次 Stream，效率比寫兩次 `stream()` 好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Optional 詳細用法

<!--
【章節開場】
第四部分，`Optional` 的詳細用法。基礎版學過 `isPresent`、`get`、`orElse` 這些「拆箱子」的基本操作，
這裡我們學「不拆箱直接加工」的進階用法——`map`、`flatMap`、`filter`、`ifPresentOrElse`。
-->

---
layout: default
---

# Optional.map / filter — 不拆箱直接加工

`Optional` 本身也提供 `map`、`filter`，讓你**不必先拆箱**就能對裡面的值做轉換或篩選：

| 方法 | 說明 |
| --- | --- |
| `map(Function)` | 若有值，套用轉換並包成新的 `Optional`；若無值，回傳空 `Optional` |
| `filter(Predicate)` | 若有值且符合條件，保留；否則回傳空 `Optional` |

```java
Optional<String> name = Optional.of("炭治郎");

Optional<Integer> len = name.map(String::length);
System.out.println(len.get()); // 3

Optional<String> longName = name.filter(s -> s.length() >= 5);
System.out.println(longName.isPresent()); // false
```

<!--
【核心說明】
基礎版學的 `orElse`、`get` 是「打開盲盒、拿東西出來」；`map` 跟 `filter` 則是「盲盒不用打開，直接在外面對裡面的東西動手術」。

【生活化比喻】
想像 `Optional<String>` 是一個「禮物盒」，裡面可能裝著名字，也可能是空的。
`map(String::length)` 就像是隔著盒子，用 X 光掃描出裡面物品的「長度」，再把這個長度資訊裝進一個新的盒子——原本的盒子是空的，新盒子也會是空的，你完全不用先打開檢查。
`filter` 則是「檢查盒子裡的東西夠不夠資格」，不夠資格就直接把盒子清空。

⚠️ 學生常見誤解：
`map` 套用在「空的 Optional」上不會報錯，也不會執行轉換函數，只會原封不動回傳一個空的 `Optional`。這正是 `Optional` 的設計重點——讓你不用每一步都手動判斷 `null`。
-->

---

# Optional.flatMap / ifPresentOrElse

| 方法 | 說明 |
| --- | --- |
| `flatMap(Function)` | 轉換函數本身回傳 `Optional`，避免出現 `Optional<Optional<T>>` |
| `ifPresentOrElse(Consumer, Runnable)` | 有值時執行第一個動作，無值時執行第二個動作 |
| `or(Supplier<Optional>)` | 無值時，改用另一個 `Optional` |

```java
Optional<String> raw = Optional.of("90");

// flatMap：避免巢狀 Optional<Optional<Integer>>
Optional<Integer> score = raw.flatMap(s -> safeParse(s));

// ifPresentOrElse：有值印分數，無值印警告
score.ifPresentOrElse(
    s -> System.out.println("分數：" + s),
    () -> System.out.println("無法解析分數")
);
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼需要 flatMap：</b> 如果 <code>safeParse</code> 已經回傳 <code>Optional&lt;Integer&gt;</code>，用 <code>map</code> 會得到 <code>Optional&lt;Optional&lt;Integer&gt;&gt;</code>，巢狀盒子很難用；<code>flatMap</code> 會自動拆掉外層那層盒子。
</div>

<!--
【核心說明】
`flatMap` 跟 Stream 的 `flatMap` 是同一個精神：「避免箱子裡面還有箱子」。

【生活化比喻】
如果你的轉換函數 `safeParse` 本身就會回傳一個「可能是空的禮物盒」（`Optional<Integer>`），那麼用 `map` 包出來的結果就會是「禮物盒裡面裝著另一個禮物盒」——這種雙層盒子很難處理。`flatMap` 會把外層的盒子直接拆掉，只留下裡面那層。

`ifPresentOrElse` 則是「開盒子的兩種劇本」——劇本一是「有禮物時要做的事」，劇本二是「盒子是空的時要做的事」，一次寫清楚，不用再寫 `if (isPresent()) {...} else {...}`。

💼 業界實務：
`ifPresentOrElse` 常用在「查詢資料庫後，有資料就顯示，沒資料就顯示預設訊息」的場景，比 `if-else` 包 `isPresent()` 簡潔很多。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
flatMap、Primitive Stream、Optional 的進階操作都個別練過了，最後這一題把三個技巧全部串起來，做一次典型的「資料清洗」流程。
-->

---
layout: default
---

# 練習 4 (綜合)：Optional 串流綜合練習
### 任務說明

宣告 `List<String>` 字串：`{"85", "abc", "60", "", "92"}`（其中部分不是合法數字）

請完成：
1. 寫一個 `safeParse(String s)` 方法，回傳 `Optional<Integer>`（解析失敗回傳 `Optional.empty()`）
2. 用 Stream 搭配 `flatMap` 與上面的方法，把字串清單轉成 `List<Integer>`（只保留解析成功的）
3. 用 `mapToInt` 計算這些成功解析的數字的總和

<!--
【出題前的鋪陳】
這是這份自學內容的綜合練習，把 flatMap、Primitive Stream 跟 Optional 都用上。

【問題引導】
想想看：`safeParse` 怎麼利用 `try-catch` 包出一個 `Optional`？再想想：`Stream<Optional<Integer>>` 要怎麼變成 `Stream<Integer>`？`flatMap` 在這裡能不能幫上忙？

【等待與觀察】
給大家 5 分鐘，這題稍微複雜，鼓勵大家先把三個步驟拆開來各自驗證再合併。
-->

---

# 練習 4：解題提示
### 提示說明

1. `safeParse` 用 `try-catch` 包住 `Integer.parseInt`，失敗回傳 `Optional.empty()`
2. `stream().flatMap(s -> safeParse(s).stream())` — `Optional.stream()` 把「有值」變成單元素 Stream、「無值」變成空 Stream
3. 接 `mapToInt(Integer::intValue).sum()` 計算總和

```java
static Optional<Integer> safeParse(String s) {
    try {
        return Optional.of(Integer.parseInt(s));
    } catch (NumberFormatException e) {
        return Optional.empty();
    }
}

List<String> raw = List.of("85", "abc", "60", "", "92");
List<Integer> nums = raw.stream()
    .flatMap(s -> safeParse(s).stream())
    .toList();
int total = nums.stream().mapToInt(Integer::intValue).sum();
System.out.println(nums);  // [85, 60, 92]
System.out.println(total); // 237
```

<!--
【逐步解說】
`safeParse`：把可能拋出例外的解析動作，包成一個「可能有值、可能沒有」的 `Optional`，外面的人不用處理 `try-catch`。
`Optional.stream()`：這是一個很方便的橋接方法——有值的 `Optional` 變成「裝一個元素的 Stream」，空的 `Optional` 變成「空 Stream」。所以 `flatMap` 接上去之後，自動把解析失敗的字串「消失」，不會出現 `null` 或例外。
最後 `mapToInt().sum()`：把過濾乾淨的數字列表轉成數字模式，加總。

這一題把這份自學內容的三個核心技巧——`flatMap`、`Primitive Stream`、`Optional`——全部串在一起，是很典型的「資料清洗」流程。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【結語】
這份 Stream 與 Lambda 的進階自學內容，我們從方法參考的 bound/unbound 分類，
一路講到 flatMap、Primitive Stream、takeWhile/dropWhile、teeing，最後到 Optional 的進階操作。

如果有任何問題，現在就是最好的發問時機。沒問題的話，建議找一個自己平常會處理的「清單資料」，試著用今天學的這些工具重新寫一次，會更有感覺。
-->

---
layout: end
---

# 課程結束
### 掌握 Stream 與 Lambda 的進階用法，讓資料處理更精準、更有效率！
如有課後疑問，歡迎來信討論。

<!--
【收尾說明】
進階自學內容到這裡結束。我們學了方法參考的進階分類、flatMap 攤平巢狀資料、Primitive Stream 做數值統計、
takeWhile/dropWhile 處理已排序資料、teeing 一次取得多份報表，以及 Optional 的 map/flatMap/filter/ifPresentOrElse。

這些工具的共同精神都是：**減少重複的迴圈與判斷，讓程式碼更精準描述「你要的結果」**。
課後如有任何問題，歡迎來信討論。
-->
