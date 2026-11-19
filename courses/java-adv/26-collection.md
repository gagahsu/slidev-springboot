---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 集合框架 Collection Framework（進階／自學）
routeAlias: ch26
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
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">集合框架（進階／自學）</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用正確的容器，裝下所需的每一筆資料」
  </p>
  <p style="color: #c97b2c; font-size: 0.95rem; font-weight: 700; letter-spacing: 0.15em; margin-top: 0.5rem;">
    進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
大家好，歡迎來到集合框架的進階自學時間。基礎版我們學過 ArrayList、HashSet、HashMap 這三大主力，今天要來開「進階武器庫」，看看其他收納盒在什麼情境下會比主力更好用。

【為什麼要學這個？】
你家裡的收納盒，預設用最普通的塑膠箱就夠日常使用了。但如果你要收的是「需要常常從兩端拿放的東西」、「需要自動排序的東西」，或者「絕對不准被亂動的展示品」，光靠普通塑膠箱就不夠了，這時候就要請出更專業的收納盒。

【今天學完你會能做什麼】
學完之後，你會知道 LinkedList、TreeSet、TreeMap、LinkedHashMap 跟主力選手的差異在哪裡、什麼時候該換它們上場；也會學會 Set 的聯集、交集、差集這三種集合運算；最後還會搞懂「不可變集合」在實務上怎麼用、為什麼資深工程師特別愛用它來保護資料。
-->

---
layout: default
---

# Outline

- **集合類別細節比較**
  - ArrayList vs LinkedList、LinkedList 的雙端操作
  - HashSet / LinkedHashSet / TreeSet 比較
  - HashMap vs LinkedHashMap vs TreeMap 比較
- **Set 集合運算進階**
  - 聯集、交集、差集（addAll / retainAll / removeAll）
- **不可變集合進階用法**
  - List.of / Set.of / Map.of、copyOf、UnsupportedOperationException
- **進階綜合練習**

<!--
【課程預覽】
今天分成三大部分：第一部分是「集合類別細節比較」，把基礎版用過的 ArrayList、HashSet、HashMap 拿出來，跟它們的兄弟姊妹做更深入的對照；第二部分是 Set 的集合運算，把國中數學的聯集、交集、差集搬進 Java；第三部分是不可變集合的進階用法。

【學習建議】
這份進階內容不是要你把每個類別都背下來，而是讓你在「需要的時候知道有這個工具可以用」。先有印象、知道關鍵字，真正要用的時候再回來查這份投影片就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 集合類別細節比較

<!--
【章節開場】
第一部分，我們把基礎版學過的 List 跟 Set 拿出來，比較它們跟「兄弟」類別之間的差異：LinkedList、TreeSet、LinkedHashSet，還有 Map 棚的 LinkedHashMap、TreeMap。這就像是逛家具行，普通椅子之外，還有按摩椅、折疊椅，知道差異才能選對。
-->

---
layout: default
---

# ArrayList vs LinkedList

| 特性 | ArrayList | LinkedList |
| --- | --- | --- |
| 底層結構 | 動態陣列 | 雙向鏈結串列 |
| 隨機存取 `get(i)` | 快 O(1) | 慢 O(n) |
| 修改元素 `set(i, e)` | 快 O(1) | 慢 O(n) |
| 中間插入 / 刪除 | 慢 O(n) | 快 O(1) |
| 記憶體用量 | 較少 | 較多（需儲存前後節點指標） |
| 適用場景 | 多讀取、少插入 | 多插入 / 刪除 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>預設選 ArrayList</b>，除非需要頻繁在中間插入或刪除元素，才考慮 LinkedList
</div>

<!--
【回顧】
基礎版我們一路用的都是 ArrayList，這是 List 介面最常用的實作。今天要認識它的另一個兄弟：LinkedList。

【核心說明】
這是面試中被問到爛掉的經典題：ArrayList 跟 LinkedList 到底差在哪？

【生活化比喻】
ArrayList 就像一排有編號的置物櫃。要開第 100 號，眼睛一掃就知道在哪（快）；但要在中間多塞一個櫃子，後面所有櫃子都要搬動（慢）。
LinkedList 像是一排手牽手的人。找第 100 個要從頭數過去（慢）；但要在中間插一個人，只要兩個人放手、牽住新人就好（快）。

⚠️ 易錯點：
「修改元素」聽起來像 O(1) 的小動作，但 `LinkedList.set(i, e)` 還是要先沿著鏈結串列走到第 i 個節點才能換值，所以整體仍是 O(n)；`ArrayList.set(i, e)` 因為底層是陣列，可以直接用索引定位，是真正的 O(1)。

💼 業界實務：
雖然 LinkedList 插入快，但現代 CPU 對連續記憶體（陣列）特別友善，實務上 ArrayList 幾乎全面勝出。除非是高頻率中間插入的場景（例如文字編輯器的字元緩衝區），否則無腦選 ArrayList。
-->

---

# LinkedList 的雙端操作

`LinkedList` 同時實作 `Deque` 介面，可當作**雙端佇列**使用：

| 方法名稱 | 說明 |
| --- | --- |
| `addFirst(E e)` | 加到串列開頭 |
| `addLast(E e)` | 加到串列末端 |
| `removeFirst()` | 移除並回傳開頭元素 |
| `removeLast()` | 移除並回傳末端元素 |

```java
LinkedList<String> queue = new LinkedList<>();
queue.addLast("任務A");
queue.addLast("任務B");
System.out.println(queue.removeFirst()); // "任務A"
```

<!--
【核心說明】
LinkedList 不只是 List，它還身兼 Deque（雙端佇列），可以從兩頭操作。

【生活化比喻】
它就像一根透明水管，可以從左邊塞東西、右邊拿東西，或反過來。這正是「兩端都好用」這個特性的具體展現。

💼 業界實務：
當你需要一個「任務排隊系統」（FIFO，先進先出），用 LinkedList 實作 Deque 是常見的選擇；只要操作集中在頭尾，就能享受 O(1) 的優勢，不必擔心 ArrayList 在開頭插入要搬移整個陣列的問題。
-->

---

# 補充：List 也有頭尾操作了

`addFirst`／`addLast` 不是 `LinkedList`／`Deque` 的專利。JDK 21 起，`List` 介面本身透過 `SequencedCollection` 就有這些方法，`ArrayList` 也能直接呼叫。

```java
List<String> list = new ArrayList<>(List.of("B", "C"));
list.addFirst("A"); // ArrayList 也能用
list.addLast("D");
System.out.println(list); // [A, B, C, D]
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>ArrayList</b> 的 addFirst/addLast 要搬移陣列，是 O(n)；<b>LinkedList</b> 才是真正 O(1)，頭尾操作頻繁時還是優先選 LinkedList
</div>

<!--
【回顧】
上一頁講 LinkedList 身兼 Deque，可以雙端操作，容易讓人誤會這是 LinkedList 專屬的能力。

【核心說明】
其實 JDK 21 把 addFirst/addLast/getFirst/getLast/removeFirst/removeLast 這組方法定義在更上層的 SequencedCollection 介面，而 List 本身就繼承了它，所以 ArrayList 現在也可以直接呼叫。

【生活化比喻】
就像原本只有「快車道」（LinkedList）能走的捷徑，現在「普通車道」（ArrayList）也開放通行了，只是普通車道走這條路還是比較塞（O(n)），快車道依然暢通無阻（O(1)）。

⚠️ 易錯點：
不要看到 ArrayList 能呼叫 addFirst 就以為效能跟 LinkedList 一樣好。底層資料結構沒變，ArrayList 頭尾操作本質還是「搬移陣列」，只是語法變方便了。

💼 業界實務：
面試如果被問「ArrayList 有沒有 addFirst？」，JDK 21 後的正確答案是「有，但效能是 O(n)，真正需要頻繁頭尾操作還是選 LinkedList」。
-->

---

# 補充：reversed() — 反轉視圖

`SequencedCollection` 提供 `reversed()`，回傳一個「反過來看」的視圖，`List`、`Deque`、`LinkedHashSet` 都能用。

```java
List<Integer> nums = new ArrayList<>(List.of(1, 2, 3));
List<Integer> rev = nums.reversed();
System.out.println(rev);   // [3, 2, 1]

nums.add(4);
System.out.println(rev);   // [4, 3, 2, 1] — 視圖同步變動
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>reversed()</code> 回傳的是「視圖」（view），不是新集合的複製品——原集合改動，視圖也會跟著變
</div>

<!--
【核心說明】
以前想倒著看一個 List，常見寫法是 `Collections.reverse(list)`（原地反轉，會改動原本順序）或自己寫迴圈從後面印。JDK 21 的 reversed() 給了第三種選擇：不改動原集合，直接給你一個「反過來排」的視圖。

【生活化比喻】
這就像看一面鏡子：鏡子裡的影像是反的，但你本人（原集合）動一下，鏡子裡的影像（reversed 視圖）也會跟著動，鏡子本身沒有另外複製一個你出來。

⚠️ 易錯點：
`reversed()` 不是複製，是「視圖」。原集合修改後，反轉視圖看到的內容也會跟著改變，這跟 subList() 的「分身」概念類似，要小心。

💼 業界實務：
想從最新到最舊顯示一份時間排序的 List（例如聊天訊息），以前要手動反轉，現在直接 `messages.reversed()` 就能拿到倒序視圖，程式碼更簡潔。
-->

---
layout: default
---

# 練習 1：A-1：待辦事項佇列
### 任務說明

使用 `LinkedList<String>` 模擬一個「待辦事項佇列」：

1. 用 `addLast()` 依序加入「買菜」、「寫作業」、「運動」
2. 用 `addFirst()` 將「澆花」加到最前面
3. 用 `removeFirst()` 取出並印出第一項待辦事項
4. 印出剩餘的待辦事項

完成後，請說明：若改用 `ArrayList` 實作 `addFirst`/`removeFirst`（即 `add(0, ...)`/`remove(0)`），時間複雜度會有什麼差異？

<!--
【出題前的鋪陳】
這題練習 LinkedList 身為 Deque 的雙端操作，把上一頁的方法表實際用一次。

【問題引導】
想像一張待辦清單，有時候會有「插隊」的緊急任務（澆花），有時候完成的任務要從最前面劃掉，兩個動作都發生在「頭」這一端。
-->

---
layout: default
---

# 練習 1：A-1 — 解題提示
### 提示說明

```java
LinkedList<String> todos = new LinkedList<>();
todos.addLast("買菜");
todos.addLast("寫作業");
todos.addLast("運動");

todos.addFirst("澆花");

System.out.println("處理：" + todos.removeFirst()); // 澆花
System.out.println("剩餘待辦：" + todos);
```

- `ArrayList` 沒有 `addFirst`/`removeFirst`，只能用 `add(0, ...)`/`remove(0)`
- 這兩個操作在 `ArrayList` 是 **O(n)**（要搬移其餘元素），在 `LinkedList` 則是 **O(1)**

<!--
【帶讀解法】
LinkedList 兩端操作都很輕鬆：addFirst/addLast 加入、removeFirst/removeLast 取出。

【重點提醒】
時間複雜度的差異就是上一頁「ArrayList vs LinkedList」那張表的具體應用：插隊與劃掉任務都發生在頭尾，LinkedList 完全不用搬東西，這就是它存在的價值。
-->

---
layout: default
---

# HashSet / LinkedHashSet / TreeSet 比較

| 類別 | 順序 | 允許 Null | 效能 |
| --- | --- | --- | --- |
| `HashSet` | 不保證順序 | 允許一個 | 最快 |
| `LinkedHashSet` | 維持**插入順序** | 允許一個 | 中 |
| `TreeSet` | 依**自然排序**（升序） | 不允許 | 較慢 |

```java
Set<Integer> hs = new HashSet<>(List.of(3, 1, 2));
Set<Integer> ts = new TreeSet<>(List.of(3, 1, 2));
System.out.println(hs); // [1, 2, 3] 或其他順序
System.out.println(ts); // [1, 2, 3]（一定升序）
```

<!--
【回顧】
基礎版我們學了 HashSet：去重的好夥伴，但不保證順序。今天認識它的另外兩個兄弟。

【核心說明】
這是 Set 家族的三兄弟，差異在「順序」跟「允不允許 null」。

【生活化比喻】
HashSet 是抽籤袋，隨便摸，沒順序。LinkedHashSet 像排隊的人，記得誰先來誰後到，但仍不准重複。TreeSet 是自動排序器，丟進去是 3, 1, 2，印出來自動變 1, 2, 3。

⚠️ 易錯點：
TreeSet 不准放 `null`。因為它要幫元素排隊，但它不知道 `null` 該排在第幾個（最前面？最後面？），所以索性禁止。

💼 業界實務：
除非你需要「自動排序」或「記住插入順序」這類額外能力，否則一律用 HashSet，它的效能是王者。
-->

---

# 補充：LinkedHashSet 也是 SequencedSet

JDK 21 起，`LinkedHashSet` 額外實作了 `SequencedSet`，多了 addFirst/addLast/reversed()；`TreeSet` 雖然也繼承（透過 SortedSet），但排序方式由比較器決定，addFirst/addLast 反而會直接報錯。

```java
LinkedHashSet<String> lhs = new LinkedHashSet<>(List.of("B", "C"));
lhs.addFirst("A");         // 合法，插到最前面
System.out.println(lhs);   // [A, B, C]

TreeSet<String> ts = new TreeSet<>(List.of("B", "C"));
// ts.addFirst("A");       // 丟出 UnsupportedOperationException
```

<!--
【回顧】
上一頁比較了 HashSet / LinkedHashSet / TreeSet 三兄弟的順序差異，這頁要補上 JDK 21 帶來的新變化。

【核心說明】
LinkedHashSet 本來就是「照插入順序排列」，現在正式升級成 SequencedSet，可以直接用 addFirst/addLast 插隊，或用 reversed() 拿到倒序視圖。

【生活化比喻】
LinkedHashSet 就像排隊排好好的隊伍，現在多了「插隊到最前面」的合法通道；TreeSet 則像自動依身高排序的隊伍，你沒辦法指定誰站第一個，順序永遠由排序規則決定，所以呼叫 addFirst 直接被拒絕。

⚠️ 易錯點：
`TreeSet` 呼叫 `addFirst()`／`addLast()` 會拋出 `UnsupportedOperationException`，因為它的順序是「比較器決定」，不是「你想放哪就放哪」，這跟 List、LinkedHashSet 的行為完全不同。

💼 業界實務：
如果需求是「插入順序 + 偶爾要插隊到最前面」，選 LinkedHashSet；如果需求是「永遠自動排序」，選 TreeSet，但不要期待它支援 addFirst/addLast。
-->

---
layout: default
---

# 練習 2：A-2：去除重複的訪客名單
### 任務說明

給定 `String[] visitors = {"Alice","Bob","Alice","Charlie","Bob","Alice"}`：

1. 將其放入 `HashSet<String>`，印出不重複的訪客數量與內容
2. 再放入 `LinkedHashSet<String>`，印出內容並比較與 `HashSet` 的順序差異
3. 再放入 `TreeSet<String>`，印出內容（應為字母順序）

<!--
【出題前的鋪陳】
這題讓我們親眼看看 Set 三兄弟（HashSet / LinkedHashSet / TreeSet）的順序差異，把上一頁的表格實際印出來驗證。

【問題引導】
同一份原始資料，丟進三種不同的 Set，印出來的結果會不會一樣？先猜猜看，再動手驗證。
-->

---
layout: default
---

# 練習 2：A-2 — 解題提示
### 提示說明

```java
String[] visitors = {"Alice","Bob","Alice","Charlie","Bob","Alice"};

Set<String> hs = new HashSet<>(Arrays.asList(visitors));
System.out.println("HashSet（" + hs.size() + " 人）：" + hs);

Set<String> lhs = new LinkedHashSet<>(Arrays.asList(visitors));
System.out.println("LinkedHashSet：" + lhs);

Set<String> ts = new TreeSet<>(Arrays.asList(visitors));
System.out.println("TreeSet：" + ts);
```

- `HashSet` 不保證順序
- `LinkedHashSet` 會維持「第一次出現」的順序：Alice, Bob, Charlie
- `TreeSet` 會依字母排序：Alice, Bob, Charlie（剛好跟插入順序一樣，但原理不同）

<!--
【帶讀解法】
三個 Set 的內容都一樣（重複的元素被自動忽略），但「印出來的順序」才是這題的重點。

【重點提醒】
LinkedHashSet 是「誰先來誰排前面」，TreeSet 是「不管誰先來，一律按字母排」——兩者順序剛好一樣只是巧合，原理完全不同，這也是同學最容易混淆的地方。
-->

---
layout: default
---

# HashMap vs LinkedHashMap vs TreeMap

| 特性 | HashMap | LinkedHashMap | TreeMap |
| --- | --- | --- | --- |
| 鍵的順序 | 不保證 | 維持**插入順序** | 依**鍵升序排列** |
| 允許 Null 鍵 | 允許一個 | 允許一個 | 不允許 |
| 存取效能 | O(1) | O(1) | O(log n) |
| 適用場景 | 快速查詢 | 需維持插入順序 | 需依鍵排序輸出 |

<!--
【回顧】
基礎版我們學了 HashMap：put/get 查表的主力。今天認識它的兩個兄弟，剛好跟剛剛 Set 三兄弟的故事如出一轍。

【核心說明】
這是「順序三兄弟」在 Map 棚的版本。

【生活化比喻】
HashMap 把東西亂塞進櫃子，查起來最快；LinkedHashMap 按照你放東西的順序排好；TreeMap 按照標籤（Key）自動幫你排序。

⚠️ 易錯點：
HashMap 的順序真的不可預測。如果你想把 Map 轉成 JSON 給前端看，且希望順序固定，請用 LinkedHashMap。

💼 業界實務：
TreeMap 查詢速度稍慢（O(log n)），但如果你需要「列出所有以 A 開頭的 Key」這類依鍵排序的需求，它是最強的工具。
-->

---

# HashMap vs LinkedHashMap vs TreeMap — 範例

```java
Map<String, Integer> hm = new HashMap<>();
hm.put("banana", 2); hm.put("apple", 5);
System.out.println(hm);  // 不保證順序
Map<String, Integer> lhm = new LinkedHashMap<>();
lhm.put("banana", 2); lhm.put("apple", 5);
System.out.println(lhm); // {banana=2, apple=5}（插入順序）
Map<String, Integer> tm = new TreeMap<>();
tm.put("banana", 2); tm.put("apple", 5);
System.out.println(tm);  // {apple=5, banana=2}（鍵升序）
```

<!--
【帶讀程式碼前的鋪陳】
我們把同一組資料分別丟進三種 Map，看看印出來的結果差多少。

【逐步解說】
HashMap 的輸出順序由內部的雜湊演算法決定，跟放入順序無關；LinkedHashMap 最老實，放入順序就是輸出順序；TreeMap 則是最優雅的排版者，永遠按鍵的字母順序排列（apple 在 banana 前面）。

⚠️ 易錯點：
如果同事的程式碼把所有 Map 都換成 HashMap，每次重新執行看到的 key 順序可能都不一樣，這不是 bug，是 HashMap 本來的行為。
-->

---
layout: default
---

# 練習 3：A-3：選擇合適的集合類別
### 任務說明

針對以下情境，選擇最合適的集合類別（`ArrayList`、`LinkedList`、`HashSet`、`LinkedHashSet`、`TreeSet`、`HashMap`、`LinkedHashMap`、`TreeMap`），寫出宣告該集合的程式碼，並簡述理由：

1. 儲存瀏覽器「上一頁」紀錄，需要頻繁從前後新增 / 移除
2. 儲存學生學號，且不可重複，需依學號排序輸出
3. 儲存「身分證字號 → 姓名」的對照表，需要快速查詢
4. 儲存最近瀏覽的商品名稱，不可重複，且要保留瀏覽順序

<!--
【出題前的鋪陳】
這是這個進階單元最重要的能力：不是背 API，而是根據今天比較過的特性，「選對工具」。

【問題引導】
回頭看今天第一部分學過的三張比較表（ArrayList vs LinkedList、Set 三兄弟、Map 三兄弟），四個情境剛好對應四種不同的需求組合。
-->

---
layout: default
---

# 練習 3：A-3 — 解題提示
### 提示說明

```java
// 1. 頻繁前後新增/移除 -> LinkedList（實作 Deque，O(1)）
Deque<String> history = new LinkedList<>();

// 2. 不可重複 + 需排序 -> TreeSet
Set<String> studentIds = new TreeSet<>();

// 3. 鍵值對應 + 快速查詢 -> HashMap
Map<String, String> idToName = new HashMap<>();

// 4. 不可重複 + 保留插入順序 -> LinkedHashSet
Set<String> recentProducts = new LinkedHashSet<>();
```

<!--
【帶讀解法】
1. LinkedList：兩端新增刪除都是 O(1)，ArrayList 在開頭操作要搬移整個陣列。
2. TreeSet：天生不重複又自動排序，省去額外呼叫 sort 的步驟。
3. HashMap：鍵值對應的標準解，查詢效率 O(1)。
4. LinkedHashSet：HashSet 的去重 + List 的順序，兩個願望一次滿足。

【重點提醒】
這四題剛好對應今天學的四種「進階武器」，下次遇到類似情境，記得回來檢查這張對照表。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Set 集合運算進階

<!--
【章節開場】
第二部分，我們來複習並深化國中數學學過的集合運算：聯集、交集、差集。在 Java 裡，這三個運算分別對應 Set 的三個方法，今天要把它們一次玩熟。
-->

---

# Set 實用操作：聯集（Union）

```java
Set<String> setA = new HashSet<>(List.of("A", "B", "C"));
Set<String> setB = new HashSet<>(List.of("B", "C", "D"));

// 聯集：A ∪ B
Set<String> union = new HashSet<>(setA);
union.addAll(setB);
System.out.println(union); // [A, B, C, D]
```

<!--
【回顧】
基礎版我們學過 Set 的 `addAll` 方法可以把另一個集合的所有元素加進來。今天要正式幫它取一個數學名字：聯集。

【核心說明】
聯集（Union）就是「把兩個集合的元素全部合併，重複的只留一份」。

【生活化比喻】
`addAll` 就像「我們兩班合併成一班」——原本兩班各自的學生名單，合併之後同名同姓的人不會重複出現兩次。

⚠️ 易錯點：
先用 `new HashSet<>(setA)` 複製一份再 `addAll`，這樣才不會把 `setB` 的內容直接塞進 `setA` 本體，影響到原始資料。
-->

---

# Set 實用操作：交集與差集

```java
Set<String> setA = new HashSet<>(List.of("A", "B", "C"));
Set<String> setB = new HashSet<>(List.of("B", "C", "D"));

// 交集：A ∩ B（兩者都有）
Set<String> inter = new HashSet<>(setA);
inter.retainAll(setB);
System.out.println(inter); // [B, C]

// 差集：A − B（只在 A、不在 B）
Set<String> diff = new HashSet<>(setA);
diff.removeAll(setB);
System.out.println(diff); // [A]
```

<!--
【核心說明】
延續上一頁的聯集，這頁要認識另外兩個集合運算：交集（Intersection）跟差集（Difference）。

【生活化比喻】
`retainAll`（交集）是「只有我們兩班都認識的人才能留下」；`removeAll`（差集）則是「把對方班上也認識的人從我的名單上劃掉，剩下的就是只有我認識的人」。

⚠️ 易錯點：
`removeAll` 是有方向性的：`setA.removeAll(setB)`（A 減 B）跟 `setB.removeAll(setA)`（B 減 A）結果通常不一樣，務必確認「誰減誰」。

💼 業界實務：
這三個運算在「過濾權限」或「找共同好友」時超好用：想找「同時喜歡寫程式又喜歡打電動」的人，用交集（retainAll）；想找「只喜歡寫程式、不打電動」的人，用差集（removeAll）。
-->

---
layout: default
---

# 練習 4：B-1：社團成員聯集、交集與差集
### 任務說明

- 籃球社成員：`{"小明","小華","小美","阿強"}`
- 桌遊社成員：`{"小華","阿強","阿傑","小芳"}`

計算並印出：

1. 兩社團成員聯集（總共有哪些人至少參加一個社團）
2. 兩社團都參加的成員（交集）
3. 只參加籃球社、沒參加桌遊社的成員（差集）

<!--
【出題前的鋪陳】
這題把剛剛學的聯集、交集、差集三個運算一次串起來練習。

【問題引導】
差集要用哪個方法？提示：跟交集（retainAll）是反過來的概念，方向要對：是「籃球社減桌遊社」。
-->

---
layout: default
---

# 練習 4：B-1 — 解題提示
### 提示說明

```java
Set<String> basketball = new HashSet<>(List.of("小明","小華","小美","阿強"));
Set<String> boardgame  = new HashSet<>(List.of("小華","阿強","阿傑","小芳"));

// 聯集
Set<String> union = new HashSet<>(basketball);
union.addAll(boardgame);
System.out.println("聯集：" + union);

// 交集
Set<String> inter = new HashSet<>(basketball);
inter.retainAll(boardgame);
System.out.println("交集：" + inter);

// 差集：只在籃球社、不在桌遊社
Set<String> diff = new HashSet<>(basketball);
diff.removeAll(boardgame);
System.out.println("差集：" + diff);
```

<!--
【帶讀解法】
三種集合運算都遵循同一個套路：先複製一份（`new HashSet<>(原集合)`），再對複製品呼叫 addAll / retainAll / removeAll，避免改到原始資料。

【重點提醒】
差集 `removeAll`：把「兩邊都有的人」從複製品中踢掉，剩下的就是「只有我這邊有」的人——這就是「籃球社減桌遊社」的意思。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 不可變集合進階用法

<!--
【章節開場】
第三部分，我們來認識「不可變集合」（Immutable Collections）。這是 Java 9 之後新增的設計，目的是讓資料能夠被「鎖起來」，不被任何人不小心改動。
-->

---
layout: default
---

# 不可變集合工廠方法 (Immutable Collections)

Java 9 引入了更簡潔的方式來建立**不可變** (Immutable) 的集合。
- 這些集合一旦建立，**不能新增、修改或刪除**元素 (會拋出 `UnsupportedOperationException`)。
- **不允許 null 元素** (會拋出 `NullPointerException`)。

| 方法名稱 | 說明 |
| --- | --- |
| `List.of(E... elements)` | 建立不可變的 List |
| `Set.of(E... elements)` | 建立不可變的 Set |
| `Map.of(K k1, V v1, ...)` | 建立不可變的 Map (最多 10 組鍵值) |

```java
List<String> fruits = List.of("蘋果", "橘子", "香蕉");
Set<Integer> numbers = Set.of(1, 2, 3);
Map<String, Integer> scores = Map.of("炭治郎", 95, "善逸", 70);

// fruits.add("葡萄"); // 執行期會拋出例外！
```

<!--
【情境切入】
想像你寫了一個常數清單，例如一週七天的名稱，這份清單建立之後永遠不會變動。如果用一般的 ArrayList，任何拿到這份清單的人都可以偷偷 `add` 或 `remove`，資料就可能被改壞。

【核心說明】
這就是 Java 提供的「防呆模式」——`List.of`、`Set.of`、`Map.of` 建立出來的集合是「不可變」的，一旦建立就鎖死。

【生活化比喻】
`List.of` 就像「密封包裝」的商品，你可以看到裡面有什麼，但沒辦法再塞東西進去，也不能把裡面的東西拿出來。

⚠️ 易錯點：
對 `List.of` 出來的東西呼叫 `add`，編譯時不會報錯（它躲在介面後面），但執行時會直接拋出 `UnsupportedOperationException`，這就是所謂的「執行期驚喜」。另外，`List.of` 不允許放 `null`，放了會拋出 `NullPointerException`。

💼 業界實務：
當資料確定永遠不會變（例如方向常數、星期名稱），就用 `List.of`，能避免其他工程師「手賤」改掉你的資料。
-->

---
layout: default
---

# 複製為不可變集合

Java 10 新增了 `copyOf()` 方法，可以將現有的集合**複製**成不可變集合。
- 如果來源已經是不可變集合 (例如用 `List.of` 建立)，則直接回傳原物件，不會浪費記憶體。

| 方法名稱 | 說明 |
| --- | --- |
| `List.copyOf(Collection)` | 將集合複製為不可變 List |
| `Set.copyOf(Collection)` | 將集合複製為不可變 Set |
| `Map.copyOf(Map)` | 將 Map 複製為不可變 Map |

```java
List<String> mutableList = new ArrayList<>();
mutableList.add("A");
mutableList.add("B");

// 複製一份不可變的 List
List<String> immutableList = List.copyOf(mutableList);
// immutableList.add("C"); // 拋出 UnsupportedOperationException
```

<!--
【回顧】
上一頁學了 `List.of` 可以直接建立不可變集合。但如果手上已經有一個可變的 ArrayList，想把它變成不可變版本呢？這就是 `copyOf` 要解決的問題。

【核心說明】
`copyOf` 是一個「拍快照」的概念：把現有集合的內容複製一份，產生一個獨立、不可變的新集合。

【生活化比喻】
你有一本可以隨便塗鴉的筆記本（mutableList），現在把它「影印」了一份（copyOf），這份影印件就是不可更改的 PDF——原稿怎麼改，影印件都不會變。

💼 業界實務：
資深工程師在寫 method 時，如果不想讓外部呼叫者改動內部資料，會回傳 `List.copyOf(internalData)` 而不是直接回傳 `internalData`。這叫「防禦性編程」（defensive programming）：不信任任何拿到回傳值的人。
-->

---
layout: default
---

# 練習 5：C-1：不可變集合的應用
### 任務說明

1. 使用 `List.of()` 建立不可變清單 `weekdays`，內容為一週七天
2. 對 `weekdays` 呼叫 `add()`，用 try-catch 捕捉並印出拋出的例外名稱
3. 建立一個可變的 `ArrayList<String> mutable`，加入幾筆資料後，使用 `List.copyOf(mutable)` 建立 `copy`
4. 對 `copy` 呼叫 `add()`，驗證同樣會拋出例外；但驗證 `mutable` 仍可正常新增元素

<!--
【出題前的鋪陳】
這題在驗證「不可變」到底有多不可變，以及它跟原本的可變集合之間的關係。

【問題引導】
`List.of` 出來的東西是「密封包裝」，但 `copyOf` 出來的「影印件」跟「正本」是兩回事——改正本不會影響影印件，反之亦然。
-->

---
layout: default
---

# 練習 5：C-1 — 解題提示
### 提示說明

```java
List<String> weekdays = List.of("一", "二", "三", "四", "五", "六", "日");
try {
    weekdays.add("補假");
} catch (UnsupportedOperationException e) {
    System.out.println("weekdays 不可變：" + e);
}

List<String> mutable = new ArrayList<>();
mutable.add("A");
mutable.add("B");
List<String> copy = List.copyOf(mutable);

try {
    copy.add("C");
} catch (UnsupportedOperationException e) {
    System.out.println("copy 不可變：" + e);
}

mutable.add("C"); // 正本仍可修改
System.out.println("mutable: " + mutable);
System.out.println("copy: " + copy);
```

<!--
【帶讀解法】
兩次 `add()` 都會拋出 `UnsupportedOperationException`，這是 immutable collection 的正字標記。

【重點提醒】
最後一步是關鍵：`mutable.add("C")` 完全沒問題，而 `copy` 仍然停留在複製當下的內容 `[A, B]`，兩者互不影響——這就是「拍快照」的意思。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
TreeMap、LinkedList 雙端佇列、Set 集合運算、不可變集合，這幾個進階武器都個別練過了，最後用一個圖書館系統把它們全部放進同一個情境裡用一次。
-->

---
layout: default
---

# 練習 6 (綜合)：進階綜合練習：圖書館借閱系統
### 任務說明

設計一個簡易圖書館借閱系統，整合本章三大進階主題：

1. 用 `TreeMap<String, String>` 儲存「書籍編號 → 書名」，新增至少 5 本書（編號如 `B001`），確認輸出時編號自動依升序排列
2. 用 `LinkedList<String>` 模擬「預約佇列」，用 `addLast()` 加入 3 位讀者的姓名，再用 `removeFirst()` 取出下一位可借閱的讀者
3. 用兩個 `HashSet<String>`（分別代表「文學類愛好者」與「科幻類愛好者」）計算：
   - 兩者的聯集（至少喜歡一類的所有讀者）
   - 兩者的交集（兩類都喜歡的讀者）
4. 使用 `List.of()` 建立一份不可變的「圖書分類」清單（例如「文學、科幻、歷史」），並用 try-catch 驗證它不可被修改

<!--
【出題前的鋪陳】
這是本進階單元的期末總驗收：TreeMap 的自動排序、LinkedList 的雙端佇列、Set 的集合運算、不可變集合的保護機制，一次到位。

【問題引導】
想像你在做圖書館的後台系統：書籍目錄需要排序方便查詢（TreeMap）、預約讀者要排隊（LinkedList）、推薦書單要分析讀者重疊興趣（Set 運算），而圖書分類這種「不會變動」的資料就適合用不可變集合保護起來。
-->

---
layout: default
---

# 練習 6 (綜合)：進階綜合練習 — 解題提示（1/2）

```java
// 1. TreeMap 自動依鍵排序
Map<String, String> books = new TreeMap<>();
books.put("B003", "三體");
books.put("B001", "紅樓夢");
books.put("B002", "哈利波特");
System.out.println(books); // {B001=紅樓夢, B002=哈利波特, B003=三體}

// 2. LinkedList 當預約佇列
LinkedList<String> queue = new LinkedList<>();
queue.addLast("小明"); queue.addLast("小華"); queue.addLast("小美");
System.out.println("下一位：" + queue.removeFirst()); // 小明
```

<!--
【帶讀解法】
這題把今天四個主題依序串起來：TreeMap 不需要額外排序，put 進去自動就是排好的；LinkedList 的 `removeFirst` 就是「叫號」；Set 的 `addAll`／`retainAll` 分別找出聯集跟交集；`List.of` 建立的分類清單一旦 `add` 就會拋出例外。

【最後叮嚀】
這四個主題分別解決了「自動排序」「兩端佇列」「集合比對」「資料保護」四種不同的實務需求。下次遇到類似情境，記得回來翻翻這份投影片。
-->

---
layout: default
---

# 練習 6 (綜合)：進階綜合練習 — 解題提示（2/2）

```java
// 3. Set 聯集與交集
Set<String> literatureFans = new HashSet<>(List.of("小明","小華"));
Set<String> sciFiFans = new HashSet<>(List.of("小華","小美"));
Set<String> union = new HashSet<>(literatureFans);
union.addAll(sciFiFans);
Set<String> inter = new HashSet<>(literatureFans);
inter.retainAll(sciFiFans);
System.out.println("至少一類：" + union + "，兩類都愛：" + inter);

// 4. 不可變分類清單
List<String> categories = List.of("文學", "科幻", "歷史");
try {
    categories.add("漫畫");
} catch (UnsupportedOperationException e) {
    System.out.println("分類清單不可變：" + e);
}
```

<!--
後兩個主題：Set 的 addAll 找出聯集、retainAll 找出交集；List.of 建立的分類清單一旦 add 就會拋出 UnsupportedOperationException。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【總結回顧】
今天的進階自學內容涵蓋三大主題：集合類別的細節比較（LinkedList、TreeSet、LinkedHashSet、TreeMap、LinkedHashMap）、Set 的集合運算（聯集、交集、差集），以及不可變集合的進階用法（List.of、copyOf、UnsupportedOperationException）。

【最後叮嚀】
這些都是「進階武器」，不是每天都會用到，但當你遇到「需要排序」「需要兩端操作」「需要保護資料不被亂改」這些情境時，記得你的武器庫裡有這些選擇。

有沒有哪個地方還想再深入聊聊的？現在問，我還在線上！
-->

---
layout: end
---

# 課程結束
### 掌握集合框架的進階用法，寫出更精準、更安全的程式！
如有課後疑問，歡迎來信討論。
