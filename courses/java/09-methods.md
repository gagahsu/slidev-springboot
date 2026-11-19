---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 方法
routeAlias: ch09
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
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">方法</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">「把重複、混亂的步驟，包裝成一個有名字的動作」</p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
嗨，大家好！我們已經會用變數、判斷、迴圈、陣列寫出能動的程式了，但目前所有程式碼都擠在同一個 main() 裡面。今天要學的「方法」（Method），就是幫我們把 main() 拆開、整理乾淨的工具。

【為什麼要學這個】
想像一下，如果每多一個需求，就要在 main() 裡多塞幾行程式碼，久了 main() 會變得又長又亂，連自己都看不懂在做什麼。方法能把「一段有名字的邏輯」獨立出來，需要的時候呼叫它就好。

【學習目標】
學完這章，我們會知道方法怎麼寫、怎麼呼叫、參數跟回傳值是什麼，還有怎麼幫方法取一個好名字、設計出好維護的方法。
-->

---
layout: default
---

# Outline

- **為什麼需要方法**
- **建立第一個方法**
- **方法參數**
- **方法的位置與 static**
- **回傳值 return**
- **方法設計：命名與拆分**
- **練習題**

<!--
【核心說明】
今天的內容分成六個階段：先看看沒有方法會多麻煩，接著動手寫出第一個方法、學會傳參數、搞懂 static 什麼時候要加、學會用 return 把結果帶回來，最後練習把方法設計得更好維護。

【生活化比喻】
可以把方法想成廚房裡「一道有名字的工序」——像是「燒開水」「切菜」，做菜的人只要喊一聲名字，就不用每次重新交代步驟。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 為什麼需要方法

<!--
【開場白】
先來看一個很真實的場景：如果每次有新需求，都直接往 main() 裡塞程式碼，會發生什麼事？

【為什麼要學這個】
這部分會讓我們親眼看到 main() 怎麼一步步「腫脹」，藉此建立起「該把邏輯包裝起來」的直覺。

【學習目標】
看完這部分，我們會知道方法能解決什麼問題，以及它跟迴圈的差別在哪裡。
-->

---
layout: default
---

# 一支不斷長大的 main()

想像我們要寫一個「煮飯流程」，每個步驟都直接寫在 main() 裡：

```java
public class Cooking {
    public static void main(String[] args) {
        System.out.println("燒開水");
        System.out.println("洗菜");
        System.out.println("切菜");
        System.out.println("熱鍋");
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>目前 main() 已經有 6 行了……</b>如果明天要煮三道菜，程式碼只會繼續往上疊。
</div>

<!--
【重點解說】
這段程式碼還算短，但只要多一道菜、多一個步驟，就得繼續往 main() 裡加 println。今天煮一道菜，明天煮三道菜，程式碼只會愈疊愈高。

【生活化比喻】
這就像把所有食譜步驟寫在同一張紙上、還不分道菜——紙會愈寫愈長，愈來愈難找到「現在到底要煮哪一道」。

⚠️ 易錯點提醒：
問題不是「程式能不能動」，這段程式碼完全沒問題；問題是「未來好不好維護」。需求一直加，main() 就會變成一支難以閱讀、難以修改的巨獸。
-->

---

# 方法能解決什麼？

| 好處 | 說明 |
| --- | --- |
| 重複使用 | 同樣的步驟不用複製貼上，寫一次到處呼叫 |
| 拆解問題 | 把一個大任務拆成好幾個小任務，各自負責 |
| 提高可讀性 | main() 變成一份目錄，一眼看懂程式在做什麼 |
| 方便維護 | 需求改變時，只要改對應的方法，不必翻遍全部程式碼 |

<!--
【重點解說】
方法（Method）就是「把重複、混亂的步驟，包裝成一個有名字的單位」。這個名字本身就是最好的說明文件。

【生活化比喻】
就像把「燒開水」這個動作寫成一張有名字的卡片，之後不管在哪一道菜的流程裡，只要喊出「燒開水」這張卡片，就不用重新描述一次怎麼做。

【業界實務】
實務上，一個檔案動輒上千行程式碼，如果沒有方法把邏輯拆開命名，新加入的工程師光是要搞懂「這段在做什麼」就得花大把時間。
-->

---

# 方法 vs 迴圈

兩者都能「重複用」程式碼，但解決的問題不一樣。

| 比較 | 迴圈（Loop） | 方法（Method） |
| --- | --- | --- |
| 執行方式 | 依序、連續執行同一段程式碼 | 包裝、命名成一個單位 |
| 何時決定次數／時機 | 通常寫程式時就決定好 | 可以在任何時間、任何地方被呼叫 |
| 能否重複呼叫 | 不能在程式其他地方被「呼叫」 | 每次呼叫可以帶入不同的資料 |
| 典型例子 | 把同一句話印 5 次 | `cookDish()`：想煮幾次、何時煮都可以 |

<!--
【重點解說】
迴圈解決的是「同一段邏輯要連續跑好幾次」，方法解決的是「同一段邏輯要在不同時間、不同地方被使用」。兩者常常會一起出現：方法裡面也可以包含迴圈。

⚠️ 易錯點提醒：
不要把「重複執行」跟「重複使用」搞混——迴圈負責前者，方法負責後者。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 建立第一個方法

<!--
【開場白】
搞懂為什麼需要方法之後，這一節就要動手拆解方法的語法零件，學會怎麼定義它、呼叫它，還有程式執行時到底「跳去哪裡、又跳回哪裡」。

【學習目標】
看完這部分，我們會知道一個方法由哪五個零件組成，也會知道呼叫方法時，程式的執行流程實際上長什麼樣子。
-->

---
layout: default
---

# 方法的語法結構

一個方法由五個零件組成：

| 零件 | 範例 | 說明 |
| --- | --- | --- |
| 修飾詞 | `public static` | 決定誰可以呼叫這個方法 |
| 回傳型別 | `int` | 方法執行完要回傳的資料型別；不回傳任何東西要寫 `void` |
| 方法名稱 | `add` | 呼叫時要打的名字，習慣用「動詞開頭 + 小寫駝峰」命名 |
| 參數列表 | `(int a, int b)` | 呼叫方法時，外部需要依序傳進來的資料 |
| 方法主體 | `{ ... }` | 方法被呼叫時實際執行的程式碼 |

<!--
【重點解說】
這五個零件缺一不可，順序也是固定的：修飾詞、回傳型別、方法名稱、參數列表，最後才是用大括號包起來的方法主體。

【生活化比喻】
可以把它想成一張「服務窗口」的招牌：修飾詞是「誰可以來辦這項業務」，回傳型別是「辦完會拿到什麼」，名稱是「窗口叫什麼」，參數是「要準備哪些文件」，主體就是「櫃檯人員實際的處理流程」。
-->

---

# 方法的語法結構 — 範例

```java
public static int add(int a, int b) {
    int sum = a + b;
    return sum;
}

// 呼叫範例
int result = add(3, 5);   // result = 8
```

<!--
【帶讀導覽】
對照上一頁的表格看這段程式碼：`public static` 是修飾詞、`int`（第一個）是回傳型別、`add` 是方法名稱、`(int a, int b)` 是參數列表、`{ ... }` 是方法主體。

預期結果：呼叫 `add(3, 5)` 之後，`result` 會拿到 `8`。

⚠️ 易錯點提醒：
方法名稱後面一定要有小括號 `()`，就算沒有參數也要寫成 `()`，這是很多新手容易漏掉的地方。
-->

---

# 呼叫方法：跳去、跳回

寫好方法只是把工具準備好，真正執行要靠「呼叫」：

```java
public static void main(String[] args) {
    System.out.println("開始執行 main()");
    sayHello();                      // 呼叫 → 跳去 sayHello()
    System.out.println("main() 執行完畢");
}

public static void sayHello() {
    System.out.println("Hello from method!");
}                                     // 結束 → 跳回呼叫點下一行
```

<!--
【帶讀導覽】
程式執行到 `sayHello();` 這一行，就是在「呼叫方法」——程式會暫時跳去執行 `sayHello()` 的內容，`main()` 則在原地等待。`sayHello()` 沒有 `return`，執行完主體就自動結束，流程跳回呼叫點的下一行，`main()` 才繼續往下執行。

預期結果：依序印出「開始執行 main()」「Hello from method!」「main() 執行完畢」。

【生活化比喻】
這就像主廚喊一聲「切菜！」，切菜的人去忙，主廚在旁邊等；切菜的人做完會回報「切好了」，主廚才接著做下一步。
-->

---

# 方法執行流程：呼叫堆疊

每次呼叫方法，Java 會把這次呼叫「疊」到呼叫堆疊（Call Stack）上；方法一結束，就從堆疊移除。

```java
public static void main(String[] args) {
    int result = square(4);          // ① 呼叫 square(4)，main() 暫停等待
    System.out.println("結果：" + result);
}

public static int square(int n) {    // ② square 執行中，計算 n * n
    int r = n * n;
    return r;                        // ③ 結束並回傳，回到 main()
}
```

<!--
【重點解說】
呼叫 `square(4)` 時，Java 會把它推疊到呼叫堆疊上，`main()` 則暫停在原地等待；`square` 執行完 `return`，就會從堆疊移除，帶著回傳值跳回 `main()` 暫停的地方，`result` 拿到 16。

【生活化比喻】
呼叫堆疊就像疊盤子——後放上去的盤子（後呼叫的方法）要先拿下來（先結束），這也是為什麼它叫「堆疊」。

⚠️ 易錯點提醒：
方法執行時，外層的方法（像這裡的 main()）並不是繼續往下跑，而是整個暫停、等內層方法回傳結果才繼續。
-->

---

# 建立方法時，先掌握這三件事

- **語法五零件**：修飾詞、回傳型別、方法名稱、參數列表、方法主體——缺一不可，順序也固定
- **呼叫才會執行**：方法寫好不會自動跑，要用「方法名稱(參數);」呼叫，程式才會跳進去執行
- **執行完會跳回來**：方法執行結束（或遇到 return）後，流程會回到呼叫點的下一行，繼續原本的工作

<!--
這一節的三個重點：方法有固定的五個語法零件；方法寫好不會自己執行，一定要被呼叫；執行完（或 return）之後，程式會自動跳回呼叫的地方繼續往下走。這三件事是後面所有方法相關內容的基礎，一定要先站穩。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 方法參數

<!--
【開場白】
會呼叫方法還不夠——如果方法裡的數字都是寫死的，遇到不同需求還是得複製一整個新方法。

【學習目標】
這一節要用「參數」讓一個方法能處理各種不同的資料，不用再為了不同的邊長、不同的資料複製方法。
-->

---
layout: default
---

# 為什麼需要參數？

如果邊長寫死在方法裡，換一個需求就得複製一個新方法：

```java
public static void printSquareArea() {   // 邊長寫死是 5
    int side = 5;
    int area = side * side;
    System.out.println("面積：" + area);
}
// 業主說：「我還想要邊長 8 的」「還要 12 的」……
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>警訊：</b>每個方法幾乎一樣，只有寫死的數字不同——這就是「該用參數」的信號，與其複製方法，不如讓邊長可以從外面傳進來。
</div>

<!--
【重點解說】
如果每換一個邊長就要新增一個方法（`printSquareArea8`、`printSquareArea12`……），程式碼會不斷長大，而且幾乎都是重複的邏輯。

⚠️ 易錯點提醒：
看到好幾個「長得幾乎一樣、只有數字不同」的方法時，就是該導入參數、減少重複的時機。
-->

---

# 單一參數

參數就像方法的「輸入欄位」，同一個方法換個呼叫，就能得到不同的結果：

```java
public static void printSquareArea(int side) {
    int area = side * side;
    System.out.println("面積：" + area);
}

printSquareArea(5);   // 邊長 5 的正方形面積：25
printSquareArea(8);   // 邊長 8 的正方形面積：64
```

<!--
【帶讀導覽】
`(int side)` 就是參數，呼叫時放進括號裡的值會被複製給 `side` 使用。同一個方法，只要換掉呼叫時放進括號的值，就能算出不同邊長的面積。

預期結果：`printSquareArea(5)` 印出面積 25，`printSquareArea(8)` 印出面積 64。
-->

---

# 多個參數

參數可以有很多個，中間用逗號分隔；呼叫時，值會依照宣告的順序對應進去——**順序放錯，意義就跟著錯**。

```java
public static void describeRectangle(double width, double height) {
    double area = width * height;
    System.out.println("寬 " + width + " 高 " + height + "，面積 " + area);
}

describeRectangle(4.0, 3.0);   // 正確：寬 4.0 高 3.0
describeRectangle(3.0, 4.0);   // 故意交換：寬、高標籤錯位
```

<!--
【重點解說】
`describeRectangle(4.0, 3.0)` 依照宣告順序，4.0 對應 `width`、3.0 對應 `height`；如果不小心把順序交換成 `describeRectangle(3.0, 4.0)`，面積算出來一樣是 12.0，但「寬」「高」的標籤其實是錯位的。

⚠️ 易錯點提醒：
參數是依照「位置」對應的，不是依照我們心裡想的名字——呼叫多參數方法時，一定要對照宣告順序確認每個值放對位置。
-->

---

# 參數傳遞：傳的是值的複製品

呼叫方法時，Java 會把參數的「值」複製一份傳進去——**方法裡怎麼改參數，都不會影響外面原本的變數**。

```java
public static void main(String[] args) {
    int x = 5;
    changeValue(x);
    System.out.println("x = " + x);   // x = 5，完全沒被改過
}

public static void changeValue(int n) {
    n = 100;                          // 只改到 n 自己的複製品
    System.out.println("n = " + n);   // n = 100
}
```

<!--
【重點解說】
呼叫 `changeValue(x)` 時，Java 把 `x` 目前的值 `5` 複製一份，交給全新的變數 `n`；`n` 和 `x` 是各自獨立的變數，只是「值」剛好一樣。方法內把 `n` 改成 100，只影響 `n` 自己，`changeValue()` 結束並從呼叫堆疊移除後，回到 `main()`，`x` 從頭到尾都沒被改過。

【生活化比喻】
這就像把「便條紙上寫的數字」影印一份給對方，對方在影印本上塗改，原始的便條紙完全不受影響。

⚠️ 易錯點提醒：
這個規則稱為 Pass by Value（傳值），先記住結論：基本型態當參數傳進方法，方法內部的修改不會回頭影響呼叫端的變數。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 方法的位置與 static

<!--
【開場白】
方法會依照使用的位置不同，而有不同的寫法。在學回傳值之前，先搞懂為什麼我們自己建立的方法，前面也要加上 static。
-->

---
layout: default
---

# 為什麼要加 static？

```java
public class Test {
    public static void sayHello() {
        System.out.println("Hello");
    }

    public static void main(String[] args) {
        sayHello();
    }
}
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>如果忘記加 static：</b>通常會看到 <code>Non-static method cannot be referenced from a static context</code>。不用背英文，只要知道「目前的方法忘記加 static」，就很有可能出現這個錯誤。
</div>

<!--
【重點解說】
`main()` 是程式開始執行的地方，本身就是用 `static` 修飾；因此，`main()` 能直接呼叫的方法，目前階段也需要加上 `static`。

【現階段記憶】
呼叫方法的地方若沒有 `static`，方法就不需要寫 `static`；呼叫方法的地方有 `static`（像現在的 `main()`），方法就需要加上 `static`。等之後學到物件導向，自然就會知道什麼時候可以不用加。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回傳值 return

<!--
【開場白】
方法算完東西之後，光是印出來還不夠——如果外面要繼續拿這個結果做別的事，就得靠 return 把值帶回去。

【學習目標】
這一節要學會 return 怎麼寫、void 代表什麼、各種回傳型別怎麼選，還有 return 執行時程式流程實際上發生了什麼事。
-->

---
layout: default
---

# 為什麼需要 return？

```java
public static void squareArea(int side) {
    int area = side * side;
    System.out.println("面積：" + area);
}

// main() 裡：
int total = squareArea(5) + squareArea(8);
// 編譯錯誤：squareArea 回傳型別是 void，不能拿來做加法運算
```

<!--
【重點解說】
`squareArea` 是 `void`，方法內只有 `println`，沒有把任何值帶出去，呼叫端只能「看到印出來的文字」，沒有值可以拿來用——所以想繼續運算就會編譯錯誤。

⚠️ 易錯點提醒：
「印出來」跟「回傳一個可以繼續使用的值」是兩件不同的事，如果呼叫端要自己決定怎麼顯示結果，方法就不能是 `void`，要宣告正確的回傳型別，並用 `return` 把算出來的值帶出去。
-->

---

# 用 return 把值帶出去

```java
public static int squareArea(int side) {
    int area = side * side;
    return area;
}

// main() 裡：
int total = squareArea(5) + squareArea(8);
System.out.println("兩個面積合計：" + total);   // 89
```

<!--
【帶讀導覽】
`squareArea` 現在宣告 `int` 回傳型別，並用 `return area;` 把面積帶出去；呼叫端拿到的是「一個 int 值」，可以繼續參與運算、存進變數、印出、比較。

預期結果：`total` 是 89，並印出「兩個面積合計：89」。
-->

---

# void：不回傳值

`void` 代表這個方法不用帶任何值回去，通常用來做「印出來、存檔、更新畫面」這類副作用；`void` 方法裡也能用 `return;`（不帶值）提前結束。

```java
public static void checkAge(int age) {
    if (age < 0) {
        System.out.println("年齡不能是負的");
        return;                          // 不帶值，提前結束
    }
    System.out.println("年齡：" + age);
}
```

<!--
【重點解說】
呼叫 `checkAge(-5)` 時，`age < 0` 成立，印出錯誤訊息後執行 `return;`，方法立刻結束，下面的 `println` 完全不會執行；呼叫 `checkAge(20)` 則會一路跑到最後印出「年齡：20」。

⚠️ 易錯點提醒：
`void` 方法裡的 `return;` 不能帶值，只能單獨寫 `return;` 用來提前結束方法。
-->

---

# 各種回傳型別

| 回傳型別 | 適合情境 |
| --- | --- |
| `int` | 整數，計數、加總、索引這類不需要小數的數值 |
| `double` | 有小數的數值，平均、面積、金額計算這類需要精確度的場合 |
| `boolean` | 「是／不是」的判斷結果，常用在條件檢查，例如驗證、比較 |
| `String` | 文字內容，適合組合訊息、格式化輸出 |

<!--
【重點解說】
回傳型別要依照「這個方法算出來的東西是什麼」來選：整數選 `int`，有小數選 `double`，是非題選 `boolean`，文字內容選 `String`。這四種是最常用的回傳型別組合。
-->

---

# 各種回傳型別 — 範例

```java
public static int add(int a, int b) { return a + b; }
public static double average(double a, double b) { return (a + b) / 2; }
public static boolean isEven(int n) { return n % 2 == 0; }
public static String greet(String name) { return "哈囉，" + name + "！"; }
```

<!--
【帶讀導覽】
四個方法對應四種回傳型別：`add(3, 4)` 回傳 `7`；`average(3.0, 4.0)` 回傳 `3.5`；`isEven(6)` 回傳 `true`；`greet("小美")` 回傳「哈囉，小美！」。

⚠️ 易錯點提醒：
`average` 的除法用 `2`（不是 `2.0`）也不會錯，因為 `(a + b)` 已經是 `double`；但如果整個運算式都是整數（例如 `9 / 5`），Java 會做整數除法，結果會被無條件捨去小數，記得至少讓一邊是 `double`。
-->

---

# return 執行流程

程式一旦執行到 `return`，會立刻結束這個方法、把值帶回呼叫點——**後面就算還有程式碼也不會執行**。

```java
public static void main(String[] args) {
    String result = classify(75);
    System.out.println(result);      // 及格
}

public static String classify(int score) {
    if (score >= 60) {
        return "及格";                // 執行到這裡，方法立刻結束
    }
    return "不及格";                  // 完全不會執行到
}
```

<!--
【重點解說】
`classify(75)` 被推入呼叫堆疊，判斷 `score >= 60` 成立，執行 `return "及格";`——方法立刻結束並從呼叫堆疊移除，帶著回傳值「及格」跳回 `main()`，指定給 `result`，後面的 `return "不及格";` 完全不會被執行到。

⚠️ 易錯點提醒：
一個方法可以有多個 `return`，但只要執行到其中一個，方法就結束了，不會再往下看其他的 `return`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 方法設計：命名與拆分

<!--
【開場白】
語法都會了，但寫得出來不代表寫得好。這一節從「取名字」到「拆方法」，練習寫出別人（跟未來的自己）都看得懂、好維護的方法。
-->

---
layout: default
---

# 方法命名：好例子

| 方法簽名 | 為什麼好 |
| --- | --- |
| `calculateArea(double w, double h)` | 動詞開頭，清楚說明「要算什麼」，參數名稱也對應意義 |
| `isValidEmail(String email)` | 回傳 `boolean` 的方法用 `is` 開頭，一看名字就知道會得到 true / false |
| `getUserName()` | 依照慣例，單純回傳資料的方法用 `get` 開頭，代表「拿資料，不改變狀態」 |

<!--
【重點解說】
好名字本身就是最好的文件：動詞開頭說明「做什麼」，`is`／`get` 這類慣用前綴讓人一看就知道方法的行為模式，不用打開程式碼也能猜到用途。
-->

---

# 方法命名：壞例子

| 方法簽名 | 問題 |
| --- | --- |
| `doStuff()` | 完全看不出功能，是最常見的爛命名——別人得打開程式碼才知道它做什麼 |
| `calc1()` | 用數字編號取代有意義的名字，`calc1`、`calc2` 只會越加越讓人搞不清楚差在哪 |
| `process(String s, int a, int b, double c, boolean f)` | 名字太籠統（`process` 可以是任何事），加上參數又多又沒有脈絡 |
| `getUserNameAndSendEmailAndLog()` | 名字裡出現「And」通常代表方法做了不只一件事——這正是下一頁要解決的問題 |

<!--
【重點解說】
壞命名的共通點：要嘛看不出用途，要嘛暗示這個方法做了太多事。名字裡出現「And」是很明顯的警訊，代表該考慮把它拆成幾個各自負責一件事的方法。
-->

---

# 一個方法做好一件事

```java
// 反面範例：一個方法做了驗證、存檔、寄信、記錄四件事
public static void handleUser(String name, String email) {
    if (email.indexOf("@") == -1) { System.out.println("email 格式錯誤"); return; }
    System.out.println("儲存使用者：" + name);
    System.out.println("寄送歡迎信給：" + email);
    System.out.println("紀錄使用者建立時間");
}
```

<!--
【重點解說】
`handleUser()` 這個名字暗示它「處理使用者」，但實際上做了驗證、存檔、寄信、記錄四件不同的事——名字說不清楚，職責也糾在一起，難以個別測試、個別修改。
-->

---

# 一個方法做好一件事 — 拆分後

```java
public static boolean isValidEmail(String email) { return email.indexOf("@") != -1; }
public static void saveUser(String name) { /* 存檔邏輯 */ }
public static void sendWelcomeEmail(String email) { /* 寄信邏輯 */ }

// main() 裡依序呼叫，流程一目了然
if (isValidEmail(email)) {
    saveUser(name);
    sendWelcomeEmail(email);
}
```

<!--
【重點解說】
拆成四個各自單純的方法之後：好讀（一眼看出責任）、好測試（可以個別驗證）、好重複使用、好除錯（問題容易定位）。呼叫端只要照順序呼叫，流程一目了然。
-->

---

# 方法拆分：太長的方法怎麼辦

```java
public static void processOrder(String name, double price, int qty) {
    if (qty <= 0) { return; }
    if (price < 0) { return; }
    double total = price * qty;
    double discount = total > 1000 ? total * 0.1 : 0;
    double finalPrice = total - discount;
    System.out.println("訂單：" + name);
    System.out.println("應付金額：" + finalPrice);
}
```

<!--
【重點解說】
`processOrder()` 目前身兼「驗證」「計算」「印出」三種職責，混在一起長達好幾行——很難一眼看懂整體流程，之後想改其中一段邏輯，也容易牽一髮動全身。
-->

---

# 方法拆分：抽出各自的職責

```java
public static void processOrder(String name, double price, int qty) {
    if (!validateOrder(price, qty)) { return; }
    double finalPrice = calculateFinalPrice(price, qty);
    printOrderInfo(name, finalPrice);
}
// 驗證、計算、印出各自抽成獨立方法：
// validateOrder() / calculateFinalPrice() / printOrderInfo()
```

<!--
【重點解說】
拆完之後，`processOrder()` 只剩下三行呼叫——一眼就能看懂訂單處理的完整流程，細節則收在各自的方法裡，也各自可以獨立測試。

【業界實務】
把「太長的方法」拆成好幾個「各自負責一件事」的小方法，是資深工程師整理程式碼最常做的動作之一，通常稱為「Extract Method」重構手法。
-->

---

# 設計方法時，先記住這三件事

- **名字要說清楚**：動詞開頭、有意義，`boolean` 方法用 `is`／`has` 開頭——好名字本身就是最好的文件
- **一件事就好**：方法名稱要用「和」才能說完，通常代表責任太多；拆開後更好讀、好測試、好除錯
- **太長就拆**：把驗證、計算、輸出這類獨立邏輯區塊抽成方法，讓主方法讀起來像一份流程清單

<!--
這一節的三個重點：好名字讓人不用看程式碼內容就知道方法在做什麼；一個方法只做一件事，職責才會單純；方法太長時，把各自獨立的邏輯區塊抽出來，讓呼叫端讀起來像一份清楚的流程清單。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 練習題

<!--
【開場白】
學完了語法、參數、回傳值跟方法設計，接下來換大家自己寫寫看。四題循序漸進：從基礎打好手感，到進階練邏輯，到延伸練拆分，最後挑戰把陣列當成參數傳進方法。
-->

---
layout: default
---

# 練習 1：溫度轉換器（基礎）
### 任務說明

撰寫一個方法：

- 接收一個 `double` 參數（攝氏溫度）
- 回傳一個 `double`（華氏溫度），**不能只用 println 印出來**
- 方法名稱、參數命名要能讓人一看就懂在做什麼

**呼叫範例：**
```java
double f = celsiusToFahrenheit(25.0);
System.out.println(f);   // 應該印出 77.0
```

<!--
【任務鋪陳】
這一題練習這一章最基礎的組合：單一參數、回傳值、回傳型別 double。重點是搞懂「印出來」跟「回傳一個可以繼續使用的值」的差別。

【問題引導】
想一想：這個方法最後是要「印出來」，還是要「回傳一個可以繼續使用的數字」？如果呼叫端要自己決定怎麼顯示結果，方法就不能是 void。
-->

---

# 練習 1：解題提示

1. 方法宣告要用 `public static double celsiusToFahrenheit(double celsius)`
2. 公式是 `celsius * 9.0 / 5.0 + 32`
3. 用 `return` 把算出來的華氏溫度帶出去

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見小地雷：</b>如果寫成 <code>9 / 5</code>（兩個都是整數），Java 會做整數除法，結果會變成 1，而不是 1.8——記得至少有一邊要寫成 <code>9.0</code> 或 <code>5.0</code>。
</div>

<!--
【逐步解說】
回傳型別要宣告 double，不是 void；`return` 一定要帶著算出來的值；公式裡的除法只要有一邊是 double，就會用小數除法計算。
-->

---
layout: default
---

# 練習 2：成績等第判斷（進階）
### 任務說明

撰寫一個方法，依照分數判斷等第：

- 90 分以上（含）→ `"A"`；80 分以上 → `"B"`；70 分以上 → `"C"`；60 分以上 → `"D"`；其餘 → `"F"`
- 方法要回傳 `String`，不是直接印出來
- 用 `if / else if` 或 `switch` 都可以，重點是邊界值要判斷正確

**呼叫範例：**
```java
String g = getGrade(85);
System.out.println(g);   // 應該印出 B
```

<!--
【任務鋪陳】
這一題結合了回傳型別 String，跟之前流程控制章節學過的條件判斷。重點是練習「多個條件依序判斷」時，順序該怎麼安排。

【問題引導】
如果先判斷「score >= 60」會怎樣？想一想 95 分會不會不小心先中這一條、直接被判成 D。
-->

---

# 練習 2：解題提示

1. 用 `if / else if` 由大到小依序判斷：先判斷 `>= 90`，再判斷 `>= 80`……
2. 每個分支都要有對應的 `return`
3. 回傳型別是 `String`，不是 `void`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>如果順序反過來（由小到大）：</b>假設先判斷 <code>score >= 60</code>，那 95 分也會先中這一條、直接回傳 "D"，後面的判斷就再也不會被檢查到——這是這題最容易踩的坑。
</div>

<!--
【逐步解說】
判斷順序一定要「由大到小」，因為 return 一執行方法就結束了，後面的條件不會再被檢查；只要有一個分支先攔截到不該攔截的分數，後面全部判斷都會失效。
-->

---
layout: default
---

# 練習 3：訂單小幫手（延伸）
### 任務說明

把一個訂單流程拆成三個各自負責的方法：

- `calculateSubtotal(int price, int qty)` → 回傳「單價 × 數量」的小計
- `applyDiscount(double subtotal, boolean isMember)` → 會員打 9 折，非會員不打折
- `printReceipt(double finalAmount)` → 印出格式化的收據內容
- `main()` 裡只負責依序呼叫這三個方法，把回傳值傳給下一個方法

```java
double subtotal = calculateSubtotal(120, 3);
double total = applyDiscount(subtotal, true);
printReceipt(total);
```

<!--
【任務鋪陳】
這一題呼應「方法拆分」那一節：把一個完整流程拆成好幾個各自負責的方法，練習讓資料像接力棒一樣，一路從一個方法的回傳值傳給下一個方法的參數。

【問題引導】
`calculateSubtotal` 的回傳值，正好就是 `applyDiscount` 需要的參數；`applyDiscount` 的回傳值，又正好是 `printReceipt` 需要的參數——一步一步接力下去，就是這題的核心。
-->

---

# 練習 3：解題提示

1. `calculateSubtotal` 回傳 `price * qty`
2. `applyDiscount` 用 `if (isMember)` 判斷要不要打 9 折，記得回傳型別是 `double`
3. `printReceipt` 是 `void`，只負責印出格式化訊息，不需要回傳值
4. `main()` 只呼叫、不計算，把上一個方法的回傳值直接當成下一個方法的參數

<!--
【逐步解說】
觀察資料流：`calculateSubtotal` → subtotal → `applyDiscount` → total → `printReceipt`。每個方法只做一件事，資料像接力棒一樣一路傳下去，這就是「方法拆分」的核心精神。
-->

---
layout: default
---

# 練習 4：陣列平均分數（挑戰）
### 任務說明

撰寫一個方法：

- 參數型別是 `int[]`（一整個陣列），不是單一個 `int`
- 方法裡面要用迴圈，一個一個讀取陣列裡的元素
- 回傳型別是 `double`（平均值通常不是整數）

**呼叫範例：**
```java
int[] scores = {85, 90, 78, 92};
System.out.println(calculateAverage(scores));   // 86.25
```

<!--
【任務鋪陳】
這一題把「方法參數」的觀念延伸到陣列——參數不是只能傳單一個值，也可以是一整個陣列。這也是銜接下一章「類別與物件」時，方法要處理更複雜資料的暖身題。

【問題引導】
陣列的長度可以用 `scores.length` 取得。想一想：要算平均，是不是要先用迴圈把每個元素加總起來，再把總和除以陣列長度？
-->

---

# 練習 4：解題提示

1. 參數寫成 `int[] scores`
2. 用 `for` 迴圈搭配 `scores.length` 走訪陣列，逐一加總
3. 除法前，把總和或陣列長度其中一個轉型成 `double`，避免整數除法

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>常見小地雷：</b>如果直接寫 <code>sum / scores.length</code>，兩個都是 int，一樣會做整數除法、無條件捨去小數，跟練習 1 的 <code>9 / 5</code> 是同一個道理。
</div>

<!--
【逐步解說】
先宣告 `int sum = 0`，用 for 迴圈走訪 `scores` 陣列逐一累加；迴圈結束後，用 `(double) sum / scores.length` 算出平均值並回傳，記得至少有一邊轉型成 double。
-->

---

# 總結

- **方法把重複、混亂的步驟包裝成一個有名字的單位**，好處是重複使用、拆解問題、提高可讀性、方便維護
- **方法的語法有五個零件**：修飾詞、回傳型別、方法名稱、參數列表、方法主體，寫好後要「呼叫」才會執行
- **每次呼叫方法都會推疊到呼叫堆疊上**，方法結束（或 return）就從堆疊移除，流程跳回呼叫點的下一行
- **參數傳遞是 Pass by Value**——傳進去的是值的複製品，方法內部怎麼改參數，都不會影響呼叫端原本的變數
- **`void` 代表不回傳值，其他型別要用 `return` 把值帶出去**，`return` 一執行，方法立刻結束，後面程式碼不會執行
- **好方法要有好名字、只做一件事**，太長的方法可以把獨立邏輯抽成新方法，讓主方法讀起來像一份流程清單

<!--
我們把這一章整理成六個重點。

第一，方法的本質是把重複、混亂的步驟包裝成一個有名字的單位，好處包括重複使用、拆解問題、提高可讀性、方便維護。

第二，方法的語法固定有五個零件：修飾詞、回傳型別、方法名稱、參數列表、方法主體；方法寫好不會自動執行，一定要被呼叫。

第三，每次呼叫方法，Java 都會把這次呼叫推疊到呼叫堆疊上，方法執行結束或遇到 return，就會從堆疊移除，流程跳回呼叫點繼續往下走。

第四，這一章最重要的觀念之一：參數傳遞是 Pass by Value，傳進方法的是值的複製品，方法內部怎麼修改參數，都不會影響呼叫端原本的變數。

第五，void 代表這個方法不回傳任何值，如果要把結果帶出去讓呼叫端繼續使用，就要宣告正確的回傳型別，並用 return 帶出去；return 一旦執行，方法立刻結束，後面的程式碼完全不會執行。

第六，好方法要有一個說得清楚的名字，而且只做一件事；如果方法太長、身兼多種職責，就可以把各自獨立的邏輯抽成新方法，讓主方法讀起來像一份清楚的流程清單。

這六點加起來，就是把 main() 拆乾淨所需要的核心工具。下一章我們要正式進入類別與物件了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【開場白】
今天我們從一支不斷長大的 main() 出發，學會了怎麼把重複的步驟包裝成方法、怎麼傳參數、怎麼用 return 帶回結果，最後也練習了怎麼幫方法取好名字、把太長的方法拆乾淨。

大家對這些內容還有沒有問題？下一章我們會把方法放進「類別」裡，正式進入物件導向的世界！
-->
