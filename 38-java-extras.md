---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "Java 語法補充"
routeAlias: ch38
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
  <h1 style="color: #1a5c5c; font-size: 3rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Java 語法補充
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「之後會一直用到的六個寫法」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第三十八章。

這一章比較特別。它不是 Spring Boot 的新功能，而是幾個 Java 本身的寫法。這些寫法在接下來的章節，尤其是最後的實戰專題，會一直出現。

我們先在這裡把它們一次認識清楚。之後看到，就不會覺得陌生。
-->

---

# 今天要認識的六個寫法

<v-clicks>

- **`enum`**：只能從固定的選項裡選
- **`record`**：一行寫完一張「護貝的小卡」
- **泛型 `<T>`**：同一種袋子，可以裝不同的東西
- **Stream**：把清單放上輸送帶，一站一站處理
- **`orElseThrow`**：信封是空的，就直接喊停
- **`LocalDate`**：日期和時間

</v-clicks>

<!--
今天要認識六個寫法。

（下一步）enum，只能從固定的選項裡選。

（下一步）record，一行寫完一張護貝的小卡。

（下一步）泛型，就是角括號 T。同一種袋子，可以裝不同的東西。

（下一步）Stream，把清單放上輸送帶，一站一站處理。

（下一步）orElseThrow，信封是空的，就直接喊停。

（下一步）LocalDate，日期和時間。

六個主題彼此獨立，每一個都不長。今天的程式不需要資料庫，可以在現在的專案裡開一個新的類別來試。
-->

---

# 在哪裡試今天的程式

在專案裡新增一個類別 `Playground`，寫一個 `main` 方法：

```java
public class Playground {
    public static void main(String[] args) {
        System.out.println("Hi!");
    }
}
```

<v-clicks>

- 在檔案上按右鍵 → **Run As** → **Java Application**
- 結果會印在 Eclipse 下方的 Console
- 今天的每一段程式，都可以貼進 `main` 裡面執行看看

</v-clicks>

<!--
先說明今天的程式要在哪裡試。

在專案裡新增一個類別，叫做 Playground，遊樂場的意思。裡面寫一個 main 方法。main 方法我們在第一章看過，它是 Java 程式開始執行的地方。

（下一步）在檔案上按右鍵，選 Run As，再選 Java Application。

（下一步）結果會印在 Eclipse 下方的 Console。

（下一步）今天的每一段程式，都可以貼進 main 裡面執行看看。它和 Spring Boot 無關，不用啟動整個專案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# enum：只能從選項裡選

<!--
第一個，enum。
-->

---

# 請假單上的「假別」

<v-clicks>

- 如果「假別」是一格空白，讓同學自己填：有人寫「病假」、有人寫「生病」、有人寫「sick」
- 教務處統計的時候，根本對不起來
- 所以請假單上的假別是**勾選**的：☐ 事假　☐ 病假　☐ 公假

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 程式也有一樣的問題。用 <code>String</code> 存假別，打錯一個字（<code>"SIKC"</code>）程式照樣可以跑，要到很後面才會發現錯了。
</div>

</v-click>

<!--
先看教務處的請假單。上面有一格「假別」。

（下一步）如果假別是一格空白，讓同學自己填。有人寫病假，有人寫生病，有人寫英文的 sick。

（下一步）教務處統計的時候，根本對不起來。

（下一步）所以請假單上的假別是用勾選的。只有三個選項：事假、病假、公假。不能自己發明。

（下一步）程式也有一樣的問題。如果用 String 存假別，打錯一個字，程式照樣可以跑。要到很後面，資料對不起來的時候，才會發現錯了。
-->

---

# 把選項列出來：enum

```java
public enum LeaveType {
    PERSONAL, SICK, OFFICIAL
}
```

<CodeSteps>

```java {1|2-4|5}
LeaveType type = LeaveType.SICK;
if (type == LeaveType.SICK) {
    System.out.println("這是病假");
}
LeaveType wrong = LeaveType.SIKC;   // 編譯就不會過
```

- 型別是 `LeaveType`，值只能是那三個其中之一
- 比較用 `==` 就可以
- 打錯字：Eclipse 立刻畫紅線，程式根本跑不起來

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>enum</b>（列舉）：一種特別的類別，把「所有可能的值」一個一個列出來。習慣用全大寫命名。
</div>

</v-click>

<!--
Java 的做法是 enum。

新增的時候，和新增類別一樣，只是把 class 換成 enum。大括號裡，把所有的選項列出來，用逗號分開。這裡是三種假別：PERSONAL 事假、SICK 病假、OFFICIAL 公假。

用的時候看下面。

（下一步）變數的型別是 LeaveType。值的寫法是 LeaveType 點 SICK。它只能是那三個其中之一。

（下一步）比較的時候用兩個等號就可以，不需要 equals。

（下一步）如果打錯字，寫成 SIKC，Eclipse 會立刻畫紅線，程式根本跑不起來。錯誤在寫的當下就被發現了。這就是 enum 最大的好處。

（下一步）enum 的中文叫列舉。它是一種特別的類別，把所有可能的值，一個一個列出來。習慣用全大寫命名。
-->

---

# 選項也可以帶資料

```java {2-3|5-6|8-11|13-14}
public enum Grade {
    PASS(60, "及格"),
    FAIL(0, "不及格");

    private final int minScore;
    private final String label;

    Grade(int minScore, String label) {
        this.minScore = minScore;
        this.label = label;
    }

    public int getMinScore() { return minScore; }
    public String getLabel() { return label; }
}
```

<v-click>

```java
System.out.println(Grade.PASS.getLabel());      // 及格
System.out.println(Grade.PASS.getMinScore());   // 60
```

</v-click>

<!--
enum 的每一個選項，還可以帶著自己的資料。

（下一步）選項後面加括號，裡面放資料。PASS 帶著 60 和「及格」。FAIL 帶著 0 和「不及格」。注意最後一個選項後面是分號。

（下一步）下面宣告兩個變數來放這些資料。前面有 final，上一章學過，設定一次之後不能再改。

（下一步）再寫一個建構子，把括號裡的資料存進變數。enum 的建構子前面不寫 public。

（下一步）最後寫 getter，讓外面可以拿到資料。

（下一步）用的時候，Grade.PASS.getLabel() 拿到「及格」，getMinScore() 拿到 60。

這個寫法的用途是：把一組固定的代碼，和它的說明放在一起管理。實戰專題會用它來管理所有的回應代碼，例如 200 配「操作成功」、404 配「資源不存在」。
-->

---

# 想一想

<Poll question="「問卷的狀態」只會有兩種：草稿、已發佈。用哪一種型別來存最合適？" options="String，想填什麼都可以|int，用 0 和 1 代表|enum，把兩種狀態列出來|boolean，true 或 false" answer="3" />

<!--
來想一題。

問卷的狀態只會有兩種：草稿、已發佈。用哪一種型別來存最合適？

（等大家作答）

（下一步）答案是 enum，把兩種狀態列出來。

String 容易打錯字。int 的 0 和 1，過一陣子就忘了誰是誰。boolean 現在可以，但是以後多一種「已結束」就不夠用了。enum 既不會打錯，名字又看得懂，也容易再加選項。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# record：一行寫完一張小卡

<!--
第二個，record。
-->

---

# 還記得護貝的證明嗎

上一章的 VO：建立之後就不能改。寫一個這樣的類別，需要：

```java
public class ScoreCard {
    private final String name;
    private final int score;

    public ScoreCard(String name, int score) {
        this.name = name;
        this.score = score;
    }

    public String getName() { return name; }
    public int getScore() { return score; }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 兩個欄位就要寫十幾行，而且每一張小卡的寫法都一模一樣。Java 提供了一個簡寫：<b>record</b>。
</div>

</v-click>

<!--
還記得上一章護貝的證明嗎？VO 的特色是：建立之後就不能改。

寫一個這樣的類別，需要這些東西。兩個 final 的變數。一個建構子，把值存進去。兩個 getter。沒有 setter，因為不能改。

（下一步）兩個欄位就要寫十幾行。而且每一張小卡的寫法都一模一樣，只是欄位不同。Java 提供了一個簡寫，叫做 record。
-->

---

# 同一張小卡，用 record 寫

```java
public record ScoreCard(String name, int score) {
}
```

<CodeSteps>

```java {1|2-3|4}
ScoreCard card = new ScoreCard("Tom", 85);
System.out.println(card.name());    // Tom
System.out.println(card.score());   // 85
System.out.println(card);           // ScoreCard[name=Tom, score=85]
```

- 建立的方式一樣：`new`，照順序把值放進去
- 拿資料：**`name()`**，不是 `getName()`
- 直接印出來，內容也看得懂

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ record <b>沒有 setter</b>。建立之後內容不能改，要改只能重新 <code>new</code> 一張。
</div>

</v-click>

<!--
同一張小卡，用 record 寫，只要一行。

把 class 換成 record。類別名稱後面加括號，裡面列出所有的欄位。大括號裡什麼都不用寫。

Java 會自動幫我們產生：final 的變數、建構子、拿資料的方法。

（下一步）建立的方式一樣，用 new，照順序把值放進去。

（下一步）拿資料的方法要注意：名字是 name()，不是 getName()。record 的習慣是直接用欄位名稱，前面沒有 get。這是最容易寫錯的地方。

（下一步）直接把它印出來，內容也看得懂。

（下一步）record 沒有 setter。建立之後內容不能改，要改只能重新 new 一張。和護貝的證明一樣。
-->

---

# record 和 Lombok 怎麼選

<Pairs left="record" right="Lombok 的 @Getter @Setter" sign="vs" rows="lock,建立之後不能改=form,可以用 setter 修改|code,拿資料：name()=code,拿資料：getName()|ok,Java 內建，不用裝任何東西=what,要加 Lombok 依賴|doc,適合：只用來傳資料的小卡=book,適合：Entity，以及要一格一格填的物件" />

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ <b>Entity 不能用 record</b>。助理（JPA）從資料庫拿資料的時候，需要先建立空的物件，再用 setter 一格一格填。
</div>

</v-click>

<!--
我們之前用 Lombok 的 @Getter 和 @Setter，也能少寫很多程式。兩個怎麼選？

（下一步）record 建立之後不能改。Lombok 的版本可以用 setter 修改。

（下一步）拿資料的方法，record 是 name()，Lombok 是 getName()。

（下一步）record 是 Java 內建的，不用裝任何東西。Lombok 要加依賴。

（下一步）record 適合只用來傳資料的小卡，例如回應給前端的資料。Lombok 適合 Entity，以及需要一格一格慢慢填的物件。

（下一步）特別注意：Entity 不能用 record。助理從資料庫拿資料的時候，需要先建立一個空的物件，再用 setter 一格一格填。record 兩件事都做不到。

在這門課裡，DTO 大部分還是用 Lombok 的寫法。record 會在實戰專題的「統一回應」出現。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 泛型：同一種袋子，裝不同的東西

<!--
第三個，泛型。這個名字聽起來很難，其實我們已經用很久了。
-->

---

# 其實早就用過了

```java
List<Student> students;
List<String> names;
JpaRepository<Student, Integer>
```

<v-clicks>

- `List` 是一種袋子。**角括號裡寫的，是袋子裡裝什麼**
- `List<Student>` 只能放 `Student`；想放 `String` 進去，Eclipse 會畫紅線
- 拿出來的時候，Java 也知道拿到的一定是 `Student`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這種「用角括號指定裡面裝什麼」的寫法，叫做<b>泛型</b>（Generics）。就像公文袋上的標籤：袋子都一樣，標籤寫明裡面是什麼文件。
</div>

</v-click>

<!--
這三行，我們都寫過。

（下一步）List 是一種袋子。角括號裡寫的，是袋子裡裝什麼。

（下一步）List of Student 只能放 Student。想放 String 進去，Eclipse 會畫紅線。

（下一步）拿出來的時候，Java 也知道拿到的一定是 Student，可以直接呼叫 getName()。

（下一步）這種用角括號指定裡面裝什麼的寫法，叫做泛型，英文是 Generics。就像教務處的公文袋。袋子都長一樣，但是上面有一張標籤，寫明裡面是什麼文件。

第三行的 JpaRepository 也是。角括號裡有兩個：管理的類別是 Student，主鍵的型別是 Integer。
-->

---

# 自己做一個有標籤的袋子

<CodeSteps>

```java {1|2|3-4|all}
public class Envelope<T> {
    private T content;
    public void put(T content) { this.content = content; }
    public T take() { return content; }
}
```

- 類別名稱後面加 `<T>`：這個類別有一張標籤，暫時叫做 `T`
- 裡面裝的東西，型別就是 `T`
- 放進去的是 `T`，拿出來的也是 `T`
- `T` 是一個**還沒決定的型別**。等到有人使用這個類別的時候，才決定它是什麼

</CodeSteps>

<v-click>

```java
Envelope<String> a = new Envelope<>();     // 這個袋子裝文字
a.put("成績單");
String text = a.take();

Envelope<Student> b = new Envelope<>();    // 同一種袋子，這個裝學生
```

</v-click>

<!--
以前我們只是使用別人做好的袋子。現在自己做一個。類別叫做 Envelope，公文袋。

（下一步）類別名稱後面加角括號 T。意思是：這個類別有一張標籤，暫時叫做 T。T 是 Type 的第一個字母，是大家習慣用的名字。

（下一步）袋子裡裝的東西，型別就寫 T。

（下一步）put 方法，放進去的是 T。take 方法，拿出來的也是 T。

（下一步）所以 T 是一個還沒決定的型別。寫這個類別的時候，我們不知道以後會裝什麼。等到有人使用這個類別的時候，才決定它是什麼。

（下一步）使用的時候像這樣。第一個袋子，標籤寫 String，所以它裝文字。放進去「成績單」三個字，拿出來的型別就是 String。第二個袋子，標籤寫 Student。同一個類別，不用重寫，就可以裝學生。

等號右邊的角括號是空的，Java 會自己從左邊推斷。
-->

---

# 泛型加上 record：固定格式的回覆單

教務處回覆任何申請，都用同一種回覆單：代碼、說明、附件。

```java
public record Reply<T>(int code, String message, T data) {
}
```

<CodeSteps>

```java {1|2|3}
Reply<Student> a = new Reply<>(200, "成功", student);
Reply<List<Student>> b = new Reply<>(200, "成功", students);
Reply<String> c = new Reply<>(404, "找不到這位同學", null);
```

- 附件是一位學生
- 附件是一整份學生清單
- 沒有附件，放 `null`

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 代碼和說明的格式永遠一樣，只有「附件」每次不同。附件的型別用 <code>T</code> 留著，這一個類別就能用在所有的 API。實戰專題的 <code>AppResponse&lt;T&gt;</code> 就是這個做法。
</div>

</v-click>

<!--
把剛才學的 record 和泛型合在一起，看一個實際的用途。

教務處回覆任何申請，都用同一種回覆單。上面有三格：代碼、說明、附件。

用 record 來寫。名稱後面加角括號 T，然後三個欄位：code、message，以及型別是 T 的 data。

（下一步）第一張回覆單，附件是一位學生。所以標籤寫 Student。

（下一步）第二張，附件是一整份學生清單。標籤寫 List of Student。角括號裡面可以再有角括號。

（下一步）第三張，找不到資料，沒有附件，放 null。

（下一步）代碼和說明的格式永遠一樣，只有附件每次不同。附件的型別用 T 留著，這一個類別就能用在所有的 API。實戰專題裡的 AppResponse，就是這個做法。到時候所有 API 的回應，都會長成同一個樣子。
-->

---

# 想一想

<Poll question="Envelope<Integer> box = new Envelope<>(); 之後，box.take() 拿出來的型別是什麼？" options="T|Object|Integer|String" answer="3" />

<!--
來想一題。

宣告一個 Envelope，標籤寫 Integer。之後呼叫 box.take()，拿出來的型別是什麼？

（等大家作答）

（下一步）答案是 Integer。

類別裡寫的是 T。使用的時候標籤寫了 Integer，所以這個袋子裡所有的 T，都當成 Integer。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# Stream：把清單放上輸送帶

<!--
第四個，Stream。這是今天最重要的一個，實戰專題裡會用很多次。
-->

---

# 先看以前的寫法

有一份學生清單，想要「及格的同學的名字」：

```java
List<String> names = new ArrayList<>();
for (Student s : students) {
    if (s.getScore() >= 60) {
        names.add(s.getName());
    }
}
```

<v-clicks>

- 準備一個空的清單
- 一位一位看：及格的，才把名字放進去
- 這個寫法完全沒有問題。只是「挑出來、改一改、收起來」這種事太常做了，Java 提供一個更短的寫法

</v-clicks>

<!--
先看以前的寫法。

有一份學生清單 students。想要的是：及格的同學的名字。

（下一步）先準備一個空的清單 names。

（下一步）用 for 迴圈一位一位看。及格的，才把名字放進去。

（下一步）這個寫法完全沒有問題，之後也可以繼續這樣寫。只是挑出來、改一改、收起來，這種事在程式裡太常做了。所以 Java 提供一個更短的寫法，叫做 Stream。
-->

---

# 輸送帶上的三站

<Conveyor />

<!--
想像教務處有一條輸送帶。

把一疊資料卡放上輸送帶：Tom 85 分、Amy 52 分、Bob 70 分。

（下一步）第一站負責「挑」。只留下及格的。Amy 的卡片被拿走了。

（下一步）第二站負責「改」。每一張卡片，只抄下名字。卡片上的東西變了，從一整位學生的資料，變成只有名字。

（下一步）第三站負責「收」。把輸送帶上剩下的東西，收成一份新的清單。結果是 Tom 和 Bob。

原本的那一疊資料卡沒有被改動。我們得到的是一份新的清單。
-->

---

# 對照到程式

<Conveyor terms />

<v-click>

```java
List<String> names = students.stream()
        .filter(s -> s.getScore() >= 60)
        .map(s -> s.getName())
        .toList();
```

</v-click>

<!--
換成程式的名字。

把清單放上輸送帶，是 students.stream()。

（下一步）第一站，挑，是 filter。

（下一步）第二站，改，是 map。

（下一步）第三站，收，是 toList。

（下一步）連起來寫就是這樣。一站接一站，每一站前面一個點。四行做完剛才 for 迴圈的事。讀的時候從上往下：拿學生清單，挑及格的，換成名字，收成清單。

括號裡有箭頭的寫法，下一頁說明。
-->

---

# 箭頭是什麼：Lambda

```java
.filter(s -> s.getScore() >= 60)
```

<v-clicks>

- 每一站都需要我們告訴它「**要怎麼做**」。箭頭就是用來描述做法的
- 箭頭左邊的 `s`：輸送帶上的**每一樣東西**，名字自己取
- 箭頭右邊：對它做什麼
- `filter` 的右邊要回答「留不留」（`true` 留下）；`map` 的右邊要回答「換成什麼」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這種「把做法當成參數傳進去」的寫法叫做 <b>Lambda</b>。在第四十六章設定警衛的守則時，也會看到一樣的箭頭。
</div>

</v-click>

<!--
箭頭是什麼？

（下一步）每一站都需要我們告訴它：要怎麼做。filter 要知道挑的標準，map 要知道怎麼改。箭頭就是用來描述做法的。

（下一步）箭頭左邊的 s，代表輸送帶上的每一樣東西。名字自己取。這裡每一樣東西是一位學生，所以取 s。

（下一步）箭頭右邊，是對它做什麼。

（下一步）不同的站，右邊要回答的問題不一樣。filter 的右邊要回答留不留，結果是 true 就留下。map 的右邊要回答換成什麼。

（下一步）這種把做法當成參數傳進去的寫法，叫做 Lambda。之後在第四十六章設定警衛的守則的時候，也會看到一樣的箭頭。
-->

---

# 還會看到的幾種寫法

<v-clicks>

- **兩個冒號**：`.map(Student::getName)` 和 `.map(s -> s.getName())` 完全一樣，只是更短
- **舊的收法**：`.collect(Collectors.toList())` 和 `.toList()` 做的事一樣
- **接成一句話**：`.collect(Collectors.joining("、"))` → `"Tom、Bob"`
- **只要數量**：`.count()`

</v-clicks>

<v-click>

```java
String all = students.stream().map(Student::getName).collect(Collectors.joining("、"));
long passed = students.stream().filter(s -> s.getScore() >= 60).count();
```

</v-click>

<!--
在別人的程式裡，還會看到幾種寫法。

（下一步）兩個冒號。Student 兩個冒號 getName，和箭頭的寫法 s 箭頭 s.getName() 完全一樣，只是更短。意思是：對每一樣東西，呼叫它的 getName。這個寫法叫做方法參考。

（下一步）舊的收法。collect 括號 Collectors.toList()，和 toList() 做的事一樣。toList() 是比較新的 Java 才有的，所以舊的程式都是用前面那一種。

（下一步）接成一句話。Collectors.joining，把輸送帶上的文字用指定的符號接起來。結果是一個 String。

（下一步）只要數量的話，最後一站用 count()。

（下一步）兩個例子。第一行，把所有學生的名字用頓號接成一句話。第二行，算出及格的人數。count 的結果型別是 long，是比較大的整數。
-->

---

# 想一想

<Poll question="students.stream().filter(s -> s.getScore() < 60).map(s -> s.getName()).toList() 的結果是什麼？" options="所有學生的清單|不及格學生的清單（Student）|不及格學生的名字清單（String）|不及格的人數" answer="3" />

<!--
來想一題。

這一行的結果是什麼？從左邊讀過來：學生清單放上輸送帶，filter 的條件是分數小於 60，map 換成名字，最後 toList。

（等大家作答）

（下一步）答案是：不及格學生的名字清單。

filter 留下分數小於 60 的，所以是不及格的同學。map 把每一位換成名字，所以清單裡的東西是 String，不是 Student。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# orElseThrow：信封是空的就喊停

<!--
第五個。這個很短。
-->

---

# 信封的另一種拆法

第二十七章學過：`findById()` 回傳的是一個信封（`Optional`），裡面可能有資料，也可能是空的。

```java {1-4|6-7}
Student student = studentRepository.findById(id).orElse(null);
if (student == null) {
    throw new RuntimeException("找不到這位同學");
}

Student student = studentRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("找不到這位同學"));
```

<v-clicks>

- 上面：空的就給 `null`，我們再自己檢查、自己丟出例外
- 下面：**空的就直接丟出例外**。兩種寫法結果一樣

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>() -></code> 也是 Lambda。括號是空的，代表「不需要任何東西」；箭頭右邊是「信封是空的時候，要丟出哪一個例外」。
</div>

</v-click>

<!--
第二十七章學過：findById 回傳的是一個信封，正式的名字是 Optional。裡面可能有資料，也可能是空的。

那時候學的拆法是 orElse(null)。

（下一步）上面是以前的寫法。信封是空的就給 null。然後我們自己用 if 檢查，是 null 的話，自己丟出例外。throw new 是上一章學過的。

（下一步）下面是新的拆法，orElseThrow。信封裡有資料，就拿出來。信封是空的，就直接丟出例外。兩種寫法結果一樣，下面的少了一個 if。

（下一步）兩種寫法都可以。

（下一步）括號裡的寫法也是 Lambda。箭頭左邊的括號是空的，代表不需要任何東西。箭頭右邊是：信封是空的時候，要丟出哪一個例外。

丟出例外之後，這個方法後面的程式就不會執行了。所以用了 orElseThrow，下一行開始就可以放心使用 student，它一定不是 null。
-->

---

# 補充：自己做一種例外

```java
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
```

<v-clicks>

- `extends RuntimeException`：我是一種例外
- `super(message)`：把訊息交給上一層保管，之後用 `getMessage()` 拿得到
- 用法：`throw new NotFoundException("找不到這位同學");`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 為什麼要自己做？因為之後可以「<b>看例外的種類來決定怎麼回應</b>」：是 <code>NotFoundException</code> 就回 404，是別的就回 500。第四十一章會學怎麼統一處理。
</div>

</v-click>

<!--
補充一個相關的寫法：自己做一種例外。

剛才丟的是 RuntimeException，它是 Java 內建的、最一般的例外。我們也可以做自己的。

（下一步）新增一個類別，extends RuntimeException。extends 是繼承，意思是：我是一種例外。

（下一步）建構子收一個訊息。裡面寫 super(message)。super 指的是上一層，也就是 RuntimeException。這一行的意思是：把訊息交給上一層保管。之後就可以用 getMessage() 把訊息拿出來。

（下一步）用法和內建的例外一樣，throw new 加上訊息。

（下一步）為什麼要自己做？因為之後可以看例外的種類，來決定怎麼回應。是 NotFoundException 就回 404，是別的就回 500。第四十一章會學怎麼把例外統一處理。實戰專題裡也有一個自己做的例外，叫做 BizException。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# LocalDate：日期和時間

<!--
最後一個，日期和時間。
-->

---

# 兩種型別

<Pairs left="行事曆" right="Java" rows="doc,只有日期：2026 年 6 月 30 日=code,LocalDate|form,日期加上時間：6 月 30 日 14:05=code,LocalDateTime" />

<v-click>

```java
LocalDate today = LocalDate.now();                  // 今天
LocalDate end = LocalDate.of(2026, 6, 30);          // 指定的日期
LocalDateTime now = LocalDateTime.now();            // 現在（含時、分、秒）
```

</v-click>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 選哪一個？「問卷的截止日」只需要日期，用 <code>LocalDate</code>。「什麼時候送出的」需要精確的時間，用 <code>LocalDateTime</code>。
</div>

</v-click>

<!--
Java 處理日期和時間，常用的型別有兩種。

（下一步）只有日期，例如 2026 年 6 月 30 日，用 LocalDate。

（下一步）日期加上時間，例如 6 月 30 日下午兩點五分，用 LocalDateTime。

（下一步）建立的方法。LocalDate.now() 是今天。LocalDate.of 可以指定年、月、日。LocalDateTime.now() 是現在，包含時、分、秒。

（下一步）選哪一個？看需要多精確。問卷的截止日只需要日期，用 LocalDate。什麼時候送出的，需要精確的時間，用 LocalDateTime。
-->

---

# 比較和計算

```java {1-2|4-5|7}
LocalDate today = LocalDate.now();
LocalDate end = LocalDate.of(2026, 6, 30);

boolean expired = today.isAfter(end);     // 今天在截止日之後？
boolean notYet = today.isBefore(end);     // 今天在截止日之前？

LocalDate extended = end.plusDays(7);     // 截止日往後 7 天：2026-07-07
```

<v-clicks>

- 比較前後：`isAfter()`、`isBefore()`，回傳 `true` 或 `false`
- 往後或往前算：`plusDays()`、`minusDays()`，還有 `plusMonths()` 等等
- 計算的結果是一個**新的**日期，原本的 `end` 不會變

</v-clicks>

<!--
日期可以比較，也可以計算。

（下一步）先準備兩個日期：今天，和截止日。

（下一步）比較前後。today.isAfter(end)，問的是：今天在截止日之後嗎？是的話就是過期了。isBefore 則是問在之前嗎。

（下一步）計算。end.plusDays(7)，截止日往後七天。

（下一步）比較用 isAfter 和 isBefore，回傳 true 或 false。

（下一步）計算用 plusDays、minusDays，還有 plusMonths 等等。

（下一步）注意：計算的結果是一個新的日期。原本的 end 不會變。這一點和 record 很像，日期物件也是建立之後就不能改的。
-->

---

# 放在 Entity 和 JSON 裡

```java
@Entity
public class Homework {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private LocalDate dueDate;           // 資料庫的型別是 DATE
    private LocalDateTime createdAt;     // 資料庫的型別是 DATETIME
}
```

<v-click>

JSON 裡的日期是**文字**，格式固定：

```json
{ "title": "讀書心得", "dueDate": "2026-06-30", "createdAt": "2026-06-30T14:05:09" }
```

</v-click>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 日期是「年-月-日」，月和日不滿兩位要補 0。時間的中間有一個 <code>T</code>。前端照這個格式送，Spring 就會自動轉成 <code>LocalDate</code>。
</div>

</v-click>

<!--
這兩種型別可以直接放在 Entity 裡。

例如一份作業 Homework。dueDate 是繳交期限，用 LocalDate。助理會在資料庫建立型別是 DATE 的欄位。createdAt 是建立的時間，用 LocalDateTime，資料庫的型別是 DATETIME。

（下一步）那在 JSON 裡呢？第十五章說過，JSON 沒有日期這種型別。所以日期在 JSON 裡是文字，而且格式是固定的。

（下一步）日期是年、月、日，用減號分開。月和日不滿兩位要補 0。時間的話，日期和時間中間有一個大寫的 T。前端照這個格式送，Spring 就會自動轉成 LocalDate。回傳的時候，也會自動轉成這個格式的文字。
-->

---

# 補充：一行寫完的 if

```java
String result;
if (score >= 60) {
    result = "及格";
} else {
    result = "不及格";
}
```

```java
String result = score >= 60 ? "及格" : "不及格";
```

<v-clicks>

- 讀法：**條件 ? 成立時的值 : 不成立時的值**
- 只適合「二選一、決定一個值」的情況；複雜的判斷還是用 `if`

</v-clicks>

<!--
最後補充一個小寫法，之後也會看到。

上面是我們熟悉的 if 和 else。依照分數，決定 result 是及格還是不及格。

下面一行做的是同一件事。

（下一步）讀法是：條件，問號，成立時的值，冒號，不成立時的值。分數大於等於 60 嗎？是的話是「及格」，不是的話是「不及格」。這個寫法叫做三元運算子。

（下一步）它只適合二選一、決定一個值的情況。複雜的判斷還是用 if，比較好讀。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 動手練習

<!--
換大家動手。請在 Playground 的 main 方法裡練習。
-->

---

# 練習 1：社團清單

```java
public record ClubInfo(String name, int fee, LocalDate startDate) {
}
```

準備三個社團：吉他社（500 元）、籃球社（0 元）、攝影社（800 元），日期自己訂。請用 Stream 完成：

<v-clicks>

1. 找出**要收費**的社團，得到它們的**名稱清單**
2. 算出**免費**的社團有幾個
3. 把所有社團的名稱，用「、」接成一句話

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：準備清單可以用 <code>List.of(…)</code>。record 拿資料是 <code>name()</code>、<code>fee()</code>。
</div>

</v-click>

<!--
練習一。先新增一個 record，叫做 ClubInfo。三個欄位：名稱、社費、開始招生的日期。

準備三個社團：吉他社 500 元、籃球社 0 元、攝影社 800 元。日期自己訂。請用 Stream 完成三件事。

（下一步）第一，找出要收費的社團，得到它們的名稱清單。

（下一步）第二，算出免費的社團有幾個。

（下一步）第三，把所有社團的名稱，用頓號接成一句話。

（下一步）提示：準備清單可以用 List.of，把東西直接列在括號裡。另外別忘了 record 拿資料的方法是 name() 和 fee()，沒有 get。

請先暫停，自己試試看。
-->

---

# 練習 1：參考答案

```java
List<ClubInfo> clubs = List.of(
        new ClubInfo("吉他社", 500, LocalDate.of(2026, 9, 1)),
        new ClubInfo("籃球社", 0, LocalDate.of(2026, 9, 8)),
        new ClubInfo("攝影社", 800, LocalDate.of(2026, 9, 15)));

List<String> paid = clubs.stream()
        .filter(c -> c.fee() > 0)
        .map(c -> c.name())
        .toList();                                    // [吉他社, 攝影社]

long free = clubs.stream().filter(c -> c.fee() == 0).count();    // 1

String all = clubs.stream().map(ClubInfo::name).collect(Collectors.joining("、"));
```

<!--
參考答案。

先用 List.of 準備三個社團。每一個都是 new ClubInfo，照順序放名稱、社費、日期。

第一題。filter 留下社費大於 0 的，map 換成名稱，toList 收起來。結果是吉他社和攝影社。

第二題。filter 留下社費等於 0 的，最後用 count。結果是 1。

第三題。map 換成名稱，這裡用了兩個冒號的寫法。最後用 Collectors.joining 接起來。結果是「吉他社、籃球社、攝影社」。
-->

---

# 練習 2：回覆單和狀態

<v-clicks>

1. 寫一個 enum `ClubStatus`，有兩個選項：`OPEN("招生中")`、`CLOSED("已截止")`
2. 寫一個方法 `statusOf(ClubInfo club)`：今天已經過了 `startDate` 之後的 7 天，就是 `CLOSED`，否則是 `OPEN`
3. 用今天學的 `Reply<T>`，做一張回覆單：代碼 200、說明「成功」、附件是吉他社的 `ClubStatus`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：截止日是 <code>club.startDate().plusDays(7)</code>；判斷用 <code>isAfter()</code>；二選一可以用問號和冒號。
</div>

</v-click>

<!--
練習二，把今天其他的寫法串起來。

（下一步）第一，寫一個 enum，叫做 ClubStatus。有兩個選項：OPEN 帶著「招生中」，CLOSED 帶著「已截止」。

（下一步）第二，寫一個方法 statusOf，給它一個社團，回傳它的狀態。規則是：招生從 startDate 開始，為期七天。今天已經過了這七天，就是 CLOSED，否則是 OPEN。

（下一步）第三，用今天學的 Reply，做一張回覆單。代碼 200、說明「成功」、附件是吉他社的狀態。

（下一步）提示：截止日是 startDate 加七天。判斷用 isAfter。二選一可以用問號和冒號的寫法。

請先暫停，自己試試看。
-->

---

# 練習 2：參考答案

```java
public enum ClubStatus {
    OPEN("招生中"), CLOSED("已截止");

    private final String label;
    ClubStatus(String label) { this.label = label; }
    public String getLabel() { return label; }
}
```

```java
static ClubStatus statusOf(ClubInfo club) {
    LocalDate deadline = club.startDate().plusDays(7);
    return LocalDate.now().isAfter(deadline) ? ClubStatus.CLOSED : ClubStatus.OPEN;
}
```

```java
Reply<ClubStatus> reply = new Reply<>(200, "成功", statusOf(clubs.get(0)));
System.out.println(reply.data().getLabel());
```

<!--
參考答案。

enum ClubStatus。兩個選項各帶一個說明。下面是變數、建構子、getter。

statusOf 方法。先算出截止日：startDate 加七天。然後用三元運算子：今天在截止日之後嗎？是的話回傳 CLOSED，不是的話回傳 OPEN。方法前面的 static，是因為我們要從 main 方法直接呼叫它，照寫就可以。

最後做一張回覆單。標籤寫 ClubStatus，附件是吉他社的狀態。clubs.get(0) 是清單裡的第一個。

印出來的時候注意：reply.data() 是 record 的寫法，沒有 get。拿到的是 enum，再呼叫 getLabel()，這是我們自己寫的 getter。
-->

---

# 複習：六個寫法

<Pairs left="教務處" right="Java" rows="form,勾選的欄位，不能自己亂填=code,enum|lock,護貝的小卡，一行寫完=code,record（拿資料：name()）|doc,有標籤的公文袋=code,泛型 &lt;T&gt;|machine,輸送帶：挑、改、收=code,stream().filter().map().toList()|what,信封是空的就喊停=code,orElseThrow(() -> …)|book,行事曆=code,LocalDate、LocalDateTime" />

<!--
我們用一張圖複習今天的六個寫法。

（下一步）勾選的欄位，不能自己亂填，是 enum。

（下一步）護貝的小卡，一行寫完，是 record。拿資料的方法沒有 get。

（下一步）有標籤的公文袋，是泛型。

（下一步）輸送帶，挑、改、收，是 Stream 的 filter、map、toList。

（下一步）信封是空的就喊停，是 orElseThrow。

（下一步）行事曆，是 LocalDate 和 LocalDateTime。
-->

---

# 章節總結

<v-clicks>

- **enum**：把所有可能的值列出來；打錯字當場就會發現；選項可以帶資料
- **record**：不能修改的小卡；沒有 setter，拿資料不加 `get`；Entity 不能用
- **泛型 `<T>`**：先不決定型別，使用的時候才指定
- **Stream**：`filter` 挑、`map` 改、`toList` 收；箭頭（Lambda）用來描述做法
- **`orElseThrow`**：信封是空的就丟出例外
- **`LocalDate`**：`now()`、`of()`、`isAfter()`、`plusDays()`；JSON 裡是 `"2026-06-30"`

</v-clicks>

<v-click>

下一章：開一個新專案，把三層分工和三張紙，從頭到尾實際寫一次。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）enum 把所有可能的值列出來，打錯字當場就會發現，選項可以帶資料。record 是不能修改的小卡，沒有 setter，拿資料不加 get，Entity 不能用。泛型是先不決定型別，使用的時候才指定。Stream 用 filter 挑、map 改、toList 收，箭頭用來描述做法。orElseThrow 是信封空的就丟出例外。LocalDate 有 now、of、isAfter、plusDays，在 JSON 裡是年月日的文字。

（最後一步）這些寫法不用一次全部記住。之後遇到的時候，回來查這一章就好。下一章，我們開一個新專案，把三層分工和三張紙，從頭到尾實際寫一次。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

有任何問題歡迎提出來。
-->
