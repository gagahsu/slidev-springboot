---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 物件建構與封裝
routeAlias: ch11
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
  <h1 style="color: #1a5c5c; font-size: 3.4rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">物件建構與封裝</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">「建構子、封裝與 static：打造穩固的類別設計」</p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
哈囉大家，歡迎來到第 11 章「物件建構與封裝」！這一章我們會繼續往物件導向的深處走。

想想上一章我們學會了怎麼定義 class、建立物件。但物件一出生的時候，狀態要怎麼設定？欄位又該不該讓外面隨意亂改？如果沒有妥善處理，程式碼很容易被到處亂改的資料搞得到處是 bug，這在業界是會出大問題的。

這一章我們會學到：怎麼用建構子（Constructor）讓物件一出生就有正確的初始值，怎麼用封裝（Encapsulation）保護欄位不被任意修改，以及 `static` 關鍵字的基本用法。學完之後，我們就能寫出既安全又好維護的類別了！
-->

---
layout: default
---

# Outline

- **建構方法（Constructor）**
  - 預設建構子 / 自定義建構子 / 多載 / this() / vs 一般方法
- **封裝（Encapsulation）**
  - 資料隱藏 / private + getter/setter / 存取修飾詞 / JavaBean 慣例
- **static 關鍵字**
  - 類別變數 / 靜態方法 / static 初始化區塊
- **練習題**

<!--
這一章我們會分成三個小節循序漸進：先學會建構子，讓物件一出生就有正確的初始狀態；接著學封裝，把欄位保護起來，只開放安全的存取管道；最後認識 `static`，了解什麼東西是「全類別共用」的。

可以把這三個主題想像成蓋一棟大樓：建構子是地基和基本裝潢，封裝是保全系統，`static` 則是大家共用的電梯。這三者是物件導向的基石，之後寫 Spring Boot 或任何框架，都會一直用到這些概念。

每個小節結束後我們會搭配練習，把語法練熟，準備好的話我們開始吧！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 建構方法 Constructor

<!--
想像一下，我們買了一支新手機，第一次開機的時候，系統會自動跳出設定畫面，問我們要選什麼語言、連哪個 Wi-Fi。這個「物件一出生就自動跑一次」的過程，就是建構方法（Constructor）要做的事。

這一節我們會學到怎麼定義建構子、怎麼讓建構子帶參數、以及多個建構子之間怎麼互相呼叫，讓物件一建立出來就處於正確的狀態。
-->



---
layout: default
---

# 什麼是建構方法？

建構方法（Constructor）是物件被 `new` 出來時，**自動執行**的特殊方法，用來設定物件的初始狀態。

| 特性 | 說明 |
| --- | --- |
| 名稱 | **必須與類別名稱相同** |
| 回傳型態 | **沒有回傳型態**（連 void 也不寫） |
| 呼叫時機 | 使用 `new` 建立物件時自動呼叫 |
| 可見性 | 可為 public / private / protected |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>建構子 vs 一般方法：</b>建構子不能有回傳型態、名稱必須同類別、且只能透過 new 觸發，不能直接呼叫。
</div>

<!--
建構子就是物件的「出廠設定」。就像我們買一支新手機，第一次開機時系統會自動跳出設定畫面，問我們要選什麼語言、連哪個 Wi-Fi——這個自動執行的過程，就是建構子在做的事。

當我們執行 `new Dog()` 的那一刻，Java 就會去找這個類別對應的建構子，自動執行裡面的程式碼，完成物件的初始化。

⚠️ 易錯點：很多人會習慣在建構子前面加個 `void`。建構子是很特別的，它不回傳任何東西，連 `void` 都不能寫——寫了它就會變成一個普通的方法，而不是建構子。
-->

---

# 預設建構子（無參數）

若沒有定義任何建構子，Java 編譯器會自動產生一個**預設建構子**（無任何參數）。

```java
class Dog {
    String name;
    // Java 自動補上：Dog() {}
}

Dog d = new Dog(); // 可以用，因為有預設建構子
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重要：</b>一旦你自己定義了任何建構子，Java 就<b>不再</b>自動補上預設建構子。此時若還需要無參數版本，必須明確宣告。
</div>

<!--
Java 其實很貼心：如果我們懶得寫建構子，它會自動幫我們補上一個什麼事都沒做的「預設建構子」。這就像去餐廳沒特別點飲料，服務生就先給我們一杯白開水。

⚠️ 易錯點：這個貼心服務是有條件的。只要我們自己寫了任何一個建構子，Java 就不會再自動補上預設建構子。如果這時候還需要無參數版本，就要自己手動宣告，不能再依賴 Java 幫忙。
-->

---

# 自定義建構子（含參數）

自定義建構子讓物件在建立時就能帶入初始值，避免「先建立、再設值」的兩段式寫法。

```java
class Dog {
    String name;
    int age;

    Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

Dog d = new Dog("小黑", 3);
System.out.println(d.name); // 小黑
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>this.name：</b>當參數名稱與欄位名稱相同時，用 <code>this.欄位名</code> 明確指向「目前物件的欄位」，避免遮蔽（shadowing）問題。
</div>

<!--
這個範例的目標是：示範如何讓物件一出生就帶有名字和年齡，而不是事後再一個一個設定。

帶大家看關鍵行：`this.name = name;`。左邊的 `this.name` 指的是「目前這個物件自己的欄位」，右邊的 `name` 是外面傳進來的參數。這行的意思就是把傳進來的值，存到物件自己的欄位裡。

⚠️ 易錯點：當參數名稱和欄位名稱相同時（這裡都叫 `name`），一定要加 `this.` 才能正確指向物件的欄位，否則會發生「遮蔽（shadowing）」問題。

預期結果：執行 `new Dog("小黑", 3)` 之後，`d.name` 會是 `"小黑"`。

💼 業界實務：在業界，我們不太喜歡 `new` 完之後還要呼叫一堆 `setter` 才能完成設定的寫法。能在建構子裡一次設定好的，就寫在建構子裡。
-->

---

# 建構子多載（Constructor Overloading）

同一個類別可以定義**多個建構子**，只要參數型態或數量不同即可。

| 建構子 | 說明 |
| --- | --- |
| `Box()` | 無參數，尺寸初始化為 0 |
| `Box(double len)` | 正方體（三邊相等） |
| `Box(double w, double h, double d)` | 完整指定三邊 |

```java
Box b1 = new Box();           // 尺寸全為 0
Box b2 = new Box(7);          // 7x7x7 正方體
Box b3 = new Box(10, 20, 15); // 指定長寬高
```

<!--
「多載（overloading）」聽起來很專業，其實就是「同一個名字，不同的用法」。就像我們去買飲料，可以說「我要一杯紅茶」，也可以說「我要一杯紅茶，半糖去冰」——雖然都叫紅茶，但給的條件不同，服務生會知道該怎麼處理。

回到程式世界：`Box` 類別可以有無參數版本、單一邊長版本、還有完整長寬高版本，這三個建構子名字都是 `Box`，但參數不同。Java 會根據我們傳入的參數數量與型態，自動選擇對應的那一支建構子。
-->

---

# 建構子多載 — 完整範例

```java
class Box {
    double w, h, d;

    Box() { w = 0; h = 0; d = 0; }

    Box(double len) { w = h = d = len; }

    Box(double w, double h, double d) {
        this.w = w; this.h = h; this.d = d;
    }

    double volume() { return w * h * d; }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>編譯器選擇：</b>呼叫時，編譯器根據傳入的引數數量與型態，自動選擇對應的建構子。
</div>

<!--
這個範例的目標是：把上一頁的三種建構子寫成完整的 `Box` 類別，看看多載實際上長什麼樣子。

帶大家看這三個建構子：第一個 `Box()` 無參數，出來就是邊長全部為 0 的空盒子；第二個 `Box(double len)` 只給一個邊長，三邊都一樣，變成正方體；第三個 `Box(double w, double h, double d)` 則是完全自訂三個邊長。就像買鞋子，可以選預設尺寸，也可以量身訂做。

預期結果：呼叫 `b1.volume()`、`b2.volume()`、`b3.volume()` 會依各自的邊長算出對應的體積。
-->

---

# this() — 呼叫另一個建構子

在建構子內以 `this(...)` 呼叫**同一類別**的另一個建構子，避免重複初始化邏輯。

| 規則 | 說明 |
| --- | --- |
| 位置 | `this()` 必須是建構子的**第一行** |
| 次數 | 每個建構子只能呼叫一次 |
| 遞迴 | 禁止循環呼叫（A 呼叫 B、B 再呼叫 A） |
| 用途 | 減少重複程式碼，確保初始化一致 |

<!--
`this()` 讓一個建構子可以「委託」同類別的另一個建構子幫忙做初始化，避免同樣的程式碼重複寫好幾遍。就像我們在家想喝飲料，自己不想動，就請家人幫忙從冰箱拿——`this()` 呼叫的就是那個被委託的建構子。

⚠️ 易錯點：這點非常重要——`this()` 必須放在建構子的**第一行**。如果在 `this()` 之前先做了其他事（例如印出一行文字），Java 會直接報錯，不允許這樣寫。
-->

---

# this() — 範例

```java
class Temp {
    Temp() {
        this(5);                           // 呼叫 Temp(int)
        System.out.println("預設建構子");
    }
    Temp(int x) {
        this(5, 15);                       // 呼叫 Temp(int,int)
        System.out.println(x);
    }
    Temp(int x, int y) {
        System.out.println(x * y);         // 75
    }
}
// new Temp() 輸出：75 → 5 → 預設建構子
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>執行順序：</b>鏈式呼叫由最末端的建構子先執行，再逐層返回，如同堆疊展開。
</div>

<!--
這個範例的目標是：示範 `this()` 鏈式呼叫時，程式碼的執行順序到底是怎麼跑的。

帶大家看執行流程：當我們執行 `new Temp()`，會先進入 `Temp()`，第一行 `this(5)` 立刻跳到 `Temp(int x)`；`Temp(int x)` 裡第一行 `this(5, 15)` 又跳到 `Temp(int x, int y)`。最末端的 `Temp(int x, int y)` 先印出 `75`，然後一層一層往回執行，依序印出 `5`、`預設建構子`。就像俄羅斯娃娃，最裡面那層先打開、先動作。

⚠️ 易錯點：執行順序是「先跳到最末端，再逐層往回」，不是照著程式碼從上到下的順序印出來的，第一次看容易誤判。

預期結果：`new Temp()` 會依序輸出 `75`、`5`、`預設建構子`。
-->

---

# 建構子 vs 一般方法

| 比較項目 | 建構子 | 一般方法 |
| --- | --- | --- |
| 名稱 | **必須與類別名稱相同** | 任意合法識別字 |
| 回傳型態 | **不能有**（連 void 也不寫） | 必須宣告（可為 void） |
| 呼叫方式 | `new` 關鍵字自動呼叫 | 用物件或類別名稱呼叫 |
| 用途 | 初始化物件狀態 | 定義物件行為 |
| 繼承 | **不被繼承** | 可被繼承與覆寫 |

<!--
【核心說明】
這張表是面試必考題！如果你之後去面試沒答出來，不要說是我教的。

【生活化比喻】
建構子是「出生證明」，一般方法是「才藝表演」。出生證明一生只能領一次，名字要跟父母（類別）一樣；才藝表演你想什麼時候表演、表演幾次都可以。

💼 業界實務：
記住，建構子是不會被繼承的。子類別雖然會呼叫父類別的建構子，但那不是繼承，那是「盡孝道」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
好，理論講完了，換大家動手。這一章我們學了建構子怎麼讓物件一出生就有正確的初始狀態、封裝怎麼把欄位藏起來只留安全的存取管道、還有 static 怎麼共用一份資料。

接下來三題練習，會照這個順序一個一個練：先寫建構子（含多載跟 this()），再寫符合封裝原則的類別，最後把建構子、封裝、static 全部兜在一起，做一個完整的 Student 類別。動手寫過一遍，這些觀念才會真的變成自己的。
-->

---
layout: default
---

# 練習 1：設計 Book 類別的建構子
### 任務說明

設計一個 `Book` 類別，包含欄位 `String title`（書名）、`String author`（作者）、`int price`（價格）：

1. 提供建構子 `Book(String title, String author, int price)`，用 `this` 設定三個欄位
2. 提供建構子 `Book(String title, String author)`，使用 `this(...)` 呼叫上面的建構子，並把 `price` 預設為 `0`
3. 提供無參數建構子 `Book()`，使用 `this(...)` 呼叫第 2 個建構子，並把 `title`、`author` 都預設為 `"未命名"`
4. 加入方法 `displayInfo()`，印出「書名 / 作者 / 價格」

在 `main` 中分別用三種建構子建立三本書，並各自呼叫 `displayInfo()`。

<!--
【任務鋪陳】
這題練習建構子多載＋`this()` 鏈式呼叫：三個建構子彼此委託，最後都會匯流到同一個「真正做事」的建構子。這跟 `this()` 範例裡 `Temp()` → `Temp(int)` → `Temp(int,int)` 的鏈式結構是同一個模式。

【引導思考】
想一想：`this(...)` 必須放在建構子的第一行，這題的三個建構子要怎麼安排彼此呼叫的順序？哪一個建構子是「最終負責設定欄位」的那一個？
-->

---
layout: default
---

# 練習 1：設計 Book 類別的建構子
### 解題提示

```java
class Book {
    String title;
    String author;
    int price;

    Book(String title, String author, int price) {
        this.title = title;
        this.author = author;
        this.price = price;
    }

    Book(String title, String author) {
        this(title, author, 0);
    }

    Book() {
        this("未命名", "未命名");
    }

    void displayInfo() {
        System.out.println(title + " / " + author + " / " + price);
    }
}
```

呼叫範例：

```java
Book b1 = new Book("Java 入門", "小明", 500);
Book b2 = new Book("Java 進階", "小華");
Book b3 = new Book();

b1.displayInfo(); // Java 入門 / 小明 / 500
b2.displayInfo(); // Java 進階 / 小華 / 0
b3.displayInfo(); // 未命名 / 未命名 / 0
```

<!--
【帶讀解法】
這題的鏈式關係是：`Book()` → `this("未命名", "未命名")` → 跳到 `Book(String, String)` → `this(title, author, 0)` → 跳到 `Book(String, String, int)`，最後在這個建構子裡才真正執行 `this.title = title` 等設定動作。

這正是 `this()` 範例提到的「先跳到最末端，再逐層執行」的概念——只是這裡每個建構子的「額外動作」很少，主要是為了示範鏈式委託，避免在三個建構子裡重複寫三次欄位設定的程式碼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 封裝 Encapsulation

<!--
想像一下電視遙控器：我們只需要知道按「音量加」或「選台」就好，不需要知道遙控器裡面的電路怎麼運作，廠商也不會讓我們拿鐵絲進去亂戳電路板。

接下來，我們要進入物件導向最核心的防禦機制：封裝（encapsulation）。這一節會學到怎麼把欄位藏起來、只開放安全的存取管道，以及四種存取修飾詞分別開放給誰使用。
-->

---
layout: default
---

# 封裝的概念

封裝（Encapsulation）是將**資料（欄位）隱藏**在類別內部，只開放受控制的存取管道，防止外部直接修改物件狀態。

| 核心概念 | 說明 |
| --- | --- |
| 資料隱藏 | 欄位宣告為 `private`，外部無法直接存取 |
| 存取管道 | 透過 `public` 的 getter / setter 方法 |
| 驗證邏輯 | setter 內可加入條件判斷，防止非法值 |
| 不可變性 | 只提供 getter 而不提供 setter，實現唯讀欄位 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>封裝的好處：</b>類別的內部實作可以改變，只要公開介面不變，外部程式碼就不需要修改。
</div>

<!--
封裝就是「把細節藏起來，把簡單留給別人」。我們把欄位設成 `private`，就像幫它穿上一層保護，外部想看或想改，都得透過 `public` 的 getter / setter 方法，而不能直接動手。

這樣做的好處是：setter 裡可以加入驗證邏輯，擋掉不合法的值；如果只提供 getter、不提供 setter，欄位就變成唯讀，外部完全不能修改。

💼 業界實務：如果欄位是 `public`，任何人都能在程式碼的任何角落直接修改它的值，一旦資料被改成不合理的狀態，要追查問題會非常困難。把欄位設為 `private`，再透過方法控管存取，是維護大型專案的基本原則。
-->

---

# private 欄位 + public getter/setter

```java
class BankAccount {
    private double balance; // 外部不能直接存取

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount > 0) balance += amount; // 加入驗證
    }
}
```

```java
BankAccount acc = new BankAccount();
acc.deposit(1000);
System.out.println(acc.getBalance()); // 1000.0
// acc.balance = -999; // ❌ 編譯錯誤！private 欄位
```

<!--
這個範例的目標是：用一個銀行帳戶的例子，示範封裝如何防止資料被任意修改。

帶大家看關鍵行：`private double balance;` 把餘額設為 `private`，外部完全無法直接存取。我們只開放 `getBalance()` 讓人查看餘額，並透過 `deposit(amount)` 存錢——而且在 `deposit` 裡面加了 `if (amount > 0)` 這個驗證，擋掉不合理的金額。

⚠️ 易錯點：`acc.balance = -999;` 這行會直接編譯錯誤，因為 `balance` 是 `private`。這就像去銀行不能自己跳進櫃檯拿錢，必須請行員（也就是這裡的 `deposit` 方法）幫忙處理。

預期結果：執行 `acc.deposit(1000)` 之後，`acc.getBalance()` 會回傳 `1000.0`。
-->

---
layout: default
---

# 🎬 AI 協作時刻：見證攻擊失效

還記得上一章 AI 幫你示範過「public 欄位怎麼被繞過亂改」嗎？現在把封裝後的版本貼回去：

**要用的 Prompt：**

> 這是加上封裝之後的 BankAccount（貼上程式碼）。
> 請重新執行你上次示範的攻擊方式（直接改 balance），
> 告訴我結果是「編譯錯誤」還是「被 deposit 的驗證擋下」。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對照重點：</b> 同一個攻擊、同一個帳戶，只差 <code>private</code> 兩個字——這就是封裝的價值。
</div>

<!--
【操作提示】
如果上一章有留存 AI 的攻擊範例，現場延續同一個對話，貼上封裝後的版本，讓學生親眼看到「同一招攻擊現在被擋下」。若沒有延續對話，重新貼一次 public 版本再貼封裝版對照也可以。

【收斂一句話】
上一章看到資料被隨便亂改，這一章看到同一個攻擊被擋下——封裝的價值用「前後對比」記最深。
-->

---
layout: default
---

# 存取修飾詞：四種層級

| 修飾詞 | 關鍵字 | 存取範圍 |
| --- | --- | --- |
| `public` | `public` | 所有地方皆可存取 |
| `protected` | `protected` | 同套件 + 子類別 |
| 無修飾（package-private） | 無 | 同套件內 |
| `private` | `private` | 同一個類別內 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>原則：</b>盡量使用最嚴格的存取層級。通常欄位宣告為 <code>private</code>，方法依需求選擇。
</div>

<!--
Java 提供了四種「保全等級」，可以想像成不同的鎖：

- `public`：像公共設施，誰都能用。
- `protected`：像家裡的傳家寶，只有同一個家族（同套件 + 子類別）的人能用。
- 無修飾（package-private）：像公寓的公共設施，只有住在這棟樓（同套件）的人能用。
- `private`：像個人保險箱，只有自己（同一個類別）能打開。

💼 業界實務：業界有個常見原則叫「最小權限原則」——預設先設成 `private`，如果真的需要對外開放，再視情況逐步放寬。不要一開始就把所有東西都設成 `public`。
-->

---

# 存取修飾詞比較表

| 修飾詞 | 同類別 | 同套件 | 子類別（不同套件） | 外部 |
| --- | :---: | :---: | :---: | :---: |
| `public` | ✔ | ✔ | ✔ | ✔ |
| `protected` | ✔ | ✔ | ✔ | ✗ |
| 無修飾 | ✔ | ✔ | ✗ | ✗ |
| `private` | ✔ | ✗ | ✗ | ✗ |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記憶訣：</b>限制由鬆到嚴為 public → protected → 無修飾 → private。對欄位預設選 <code>private</code>，除非有特定理由才放寬。
</div>

<!--
這張表把上一頁的四種修飾詞，對應到「誰可以存取」這四個欄位：同類別、同套件、子類別（不同套件）、外部。我們可以看到 `private` 那一列除了同類別都是 ✗，存取範圍最小；`public` 那一列全部都是 ✔，存取範圍最大。

💼 業界實務：大部分時候，欄位（field）會集中在 `private` 那一欄，而提供給外部使用的方法（method）會分佈在 `public`。記住這個對照表，之後設計類別時就能快速判斷該用哪個修飾詞。
-->

---

# JavaBean 慣例

JavaBean 是一種以封裝為基礎的類別設計慣例，廣泛被框架（Spring、Hibernate）採用。

| 規則 | 說明 | 範例 |
| --- | --- | --- |
| 欄位 | 全為 `private` | `private String name;` |
| Getter | `getXxx()` | `getName()` |
| Setter | `setXxx(value)` | `setName(String n)` |
| 布林 Getter | `isXxx()` | `isActive()` |
| 無參數建構子 | 必須有 | `public Person() {}` |

<!--
JavaBean 不是什麼新的程式語言，它只是一種大家約定好的命名「潛規則」：欄位全部 `private`、提供 `getXxx()` / `setXxx()`，並要有無參數建構子。

為什麼要學這個？因為很多現代 Java 框架（像 Spring Boot、Hibernate）都依賴這套命名規則來自動讀寫資料。如果命名方式不對，框架會找不到對應的欄位，進而出錯。

⚠️ 易錯點：布林型態的 getter 不叫 `getActive()`，而是 `isActive()`。這就像在問「這個東西是 active 的嗎？」，是 JavaBean 規範裡的強制要求。
-->

---

# JavaBean 慣例 — 範例

```java
public class Person {
    private String name;
    private boolean active;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) {
        this.active = active;
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>isXxx vs getXxx：</b>布林型態的 getter 使用 <code>isXxx()</code> 而非 <code>getXxx()</code>，這是 JavaBean 規範的強制要求，IDE 與框架都依此自動識別。
</div>

<!--
【帶讀程式碼前的鋪陳】
這就是一個標準的、教科書等級的 JavaBean。

【逐步解說】
- 欄位全部鎖死（`private`）。
- 每個人都有專屬的對外窗口（Getter/Setter）。
- 布林值的 `isActive` 跟別人長得不一樣。

💼 業界實務：
在實際工作中，我們通常不會手寫這些 getter/setter。我們會用一個叫「Lombok」的工具，只要寫個 `@Data` 就搞定了。但在那之前，你得先學會怎麼手寫，不然工具壞了你連修都不會修。
-->

---
layout: default
---

# 練習 2：設計符合封裝的 Product 類別
### 任務說明

設計一個 `Product` 類別，符合封裝原則與 JavaBean 慣例：

1. 欄位全部設為 `private`：`String name`（名稱）、`int stock`（庫存）、`boolean discontinued`（是否停售）
2. 提供 `getName()` / `setName(String name)`
3. 提供 `getStock()` / `setStock(int stock)`，setter 需驗證 `stock` 不可為負數，若為負數則不設定
4. 提供 `isDiscontinued()` / `setDiscontinued(boolean discontinued)`（注意布林 getter 的命名）

在 `main` 中建立一個 `Product` 物件，呼叫 `setStock(-5)`（不合法）與 `setStock(10)`（合法），並印出最終的 `getStock()` 結果。

<!--
【任務鋪陳】
這題把封裝的兩個重點放在一起：第一，欄位都要 `private`，透過 getter/setter 存取；第二，遵守 JavaBean 命名慣例，尤其是 `boolean` 欄位的 getter 要寫成 `isXxx()` 而不是 `getXxx()`。

【引導思考】
想一想：`setStock(-5)` 應該怎麼處理？如果完全不做任何事（不設定），那麼呼叫完 `setStock(-5)` 之後，`getStock()` 會回傳什麼？
-->

---
layout: default
---

# 練習 2：設計符合封裝的 Product 類別
### 解題提示

```java
public class Product {
    private String name;
    private int stock;
    private boolean discontinued;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getStock() { return stock; }
    public void setStock(int stock) {
        if (stock >= 0) {
            this.stock = stock;
        }
    }

    public boolean isDiscontinued() { return discontinued; }
    public void setDiscontinued(boolean discontinued) {
        this.discontinued = discontinued;
    }
}
```

呼叫範例：

```java
Product p = new Product();
p.setStock(-5); // 不合法，不會設定
p.setStock(10); // 合法
System.out.println(p.getStock()); // 10
```

<!--
【帶讀解法】
這題的重點在 `setStock`：`if (stock >= 0)` 這個驗證讓 `setStock(-5)` 完全沒有效果，欄位 `stock` 維持原本的預設值 `0`。接著 `setStock(10)` 通過驗證，`stock` 才真正變成 `10`。

另外提醒一下 `isDiscontinued()` 的命名——如果寫成 `getDiscontinued()`，雖然編譯不會出錯，但不符合 JavaBean 慣例，框架（例如 Spring、Jackson）在自動讀寫這個欄位時可能會找不到對應的方法。這就是封裝＋JavaBean 慣例搭配起來的實際效果：資料安全，命名也統一。
-->

---
layout: default
---

# 🎬 AI 協作時刻：封裝觀念驗收

封裝是 junior 面試最常考的 OOP 觀念之一，考前讓 AI 幫你出題：

**要用的 Prompt：**

> 根據封裝的觀念（private 欄位、public getter/setter、
> setter 內的驗證邏輯、JavaBean 命名慣例），
> 出 3 題選擇題，難度由淺到深。
> 一次只出一題，等我回答後才公布答案，
> 答錯時不要直接講答案，先給一個提示。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>帶回家用：</b> 每學完一個章節，都可以用這個 prompt 叫 AI 考你，比自己看筆記更容易發現盲點。
</div>

<!--
【操作提示】
時間充裕做完整 3 題；時間緊湊可以只做 1-2 題，重點是示範「AI 出題、答錯先給提示不給答案」這個學習模式。

【收斂一句話】
封裝是最常見的 junior 面試題之一，這個 prompt 可以在準備面試時反覆使用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# static 關鍵字

<!--
最後，我們要來聊聊讓很多新手感到困惑的關鍵字：`static`。

可以先想像一個班級的時鐘：不管是誰把它調快五分鐘，全班看到的時間都會一起變快。`static` 就是這種「全類別共用一份」的概念——這一節我們會學到類別變數、靜態方法，以及 `static` 初始化區塊。
-->

---
layout: default
---

# 類別變數 vs 實體變數

`static` 欄位（類別變數）屬於**類別本身**，所有物件共用同一份資料。

| 比較項目 | 實體變數（instance field） | 類別變數（static field） |
| --- | --- | --- |
| 宣告方式 | `int age;` | `static int count;` |
| 儲存位置 | 每個物件各自一份 | 全類別共用一份 |
| 存取方式 | 透過物件 `obj.age` | 透過類別 `Dog.count` |
| 生命週期 | 物件存在期間 | 類別載入後持續存在 |

<!--
`static` 的意思就是「全類別共用一份」。我們可以用兩種生活情境來對比：

- **實體變數（instance field）**：像每個人自己的手機桌布，我換了我的桌布，不會影響到別人的手機。
- **類別變數（static field）**：像班上掛的那個時鐘，不管是誰把它調快五分鐘，全班看到的時間都會一起變快。

⚠️ 易錯點：不要在不需要共用的欄位上加 `static`。如果把 `name` 設為 `static`，那只要有一個物件改了名字，所有物件的 `name` 都會一起變成那個值——這通常不是我們想要的結果。
-->

---

# 類別變數 — 範例

```java
class Dog {
    static int count = 0; // 所有 Dog 物件共用
    String name;

    Dog(String name) {
        this.name = name;
        count++;          // 每次建立物件就累加
    }
}
```

```java
Dog d1 = new Dog("小黑");
Dog d2 = new Dog("小白");
System.out.println(Dog.count); // 2
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>存取慣例：</b>靜態欄位建議用 <code>類別名稱.欄位名</code> 存取，而非用物件去點，可讓閱讀者一眼看出這是靜態成員。
</div>

<!--
【帶讀程式碼前的鋪陳】
這是一個經典的應用：計算到底生出了幾隻狗。

【逐步解說】
你看，每次執行 `new Dog()`，建構子就會被跑一次。因為 `count` 是 `static` 的，所以它會在同一個數字上累加。最後不管你問哪隻狗，它們都會告訴你「全村現在有兩隻狗」。

💼 業界實務：
雖然你可以寫 `d1.count`，但這會讓看程式碼的人很困惑。請務必使用 `Dog.count`，讓大家一眼就看出：「喔！這是全村共用的變數」。
-->

---

# static 方法

靜態方法**不依賴物件**，直接透過類別名稱呼叫，且不能存取實體欄位。

| 特性 | 說明 |
| --- | --- |
| 呼叫方式 | `類別名稱.方法名()` |
| 存取限制 | **不能**存取 instance fields / instance methods |
| 可存取 | static 欄位、其他 static 方法、參數 |
| 典型例子 | `Math.abs()`、`Math.max()`、`Integer.parseInt()` |

```java
// Math 類別全部是靜態方法
System.out.println(Math.abs(-5));   // 5
System.out.println(Math.max(3, 7)); // 7
```

<!--
【核心說明】
靜態方法就是「不需要先買手機就能用的公共電話」。

【生活化比喻】
你想算絕對值，不需要先 `new` 一個 `Math` 物件吧？這就像你想知道現在幾點，不需要先買一個時鐘廠，只要抬頭看牆上的鐘就好。

⚠️ 學生常見誤解：
這是一個超級大重點：靜態方法裡**不能**用 `this`！為什麼？因為你是全村共用的公共設施，你叫 `this` 是指哪位？Java 會直接回你：「先生，你哪位？」。
-->

---

# static 方法 — 自訂範例

```java
class MathUtils {
    static int add(int a, int b) {
        return a + b;
    }

    static double circleArea(double r) {
        return Math.PI * r * r;
    }
}
```

```java
System.out.println(MathUtils.add(3, 4));          // 7
System.out.println(MathUtils.circleArea(5));       // 78.53...
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>工具類別慣例：</b>不需要物件狀態的輔助功能（如計算、格式轉換）適合設計為 static 方法，避免浪費物件建立成本。
</div>

<!--
【帶讀程式碼前的鋪陳】
我們通常會把一些輔助性質的小工具放在這種 `Utils` 類別裡。

【逐步解說】
你看 `add` 或 `circleArea`。它們只需要你給它們參數，它們就吐給你答案。它們不需要知道你的物件現在是什麼顏色、叫什麼名字。

💼 業界實務：
這種不帶狀態的方法，設成 `static` 效能會比較好，因為不需要在那邊 `new` 物件浪費記憶體。
-->

---

# static 初始化區塊

`static { }` 區塊在**類別第一次被載入時執行一次**，用於複雜的靜態變數初始化。

| 特性 | 說明 |
| --- | --- |
| 執行時機 | 類別載入時，早於任何建構子 |
| 執行次數 | **只執行一次** |
| 允許數量 | 一個類別可有多個，按順序執行 |
| 典型用途 | 初始化靜態集合、載入設定檔 |

```java
class Config {
    static int MAX_SIZE;
    static {
        MAX_SIZE = 100;
        System.out.println("Config 類別已載入");
    }
}
```

<!--
【核心說明】
這就像是類別的「開機畫面」。

【生活化比喻】
想像一間教室。每天早上第一個進去的人要把燈打開、冷氣開啟。後面進來的人就不需要再做這些事了。這個「第一個進來的人做的事」，就是 `static` 區塊。

【程式世界怎麼用】
有些變數的初始化很複雜，不是一行能寫完的（比如要讀檔案），這時候就適合寫在 `static` 區塊裡。
-->

---
layout: default
---

# 🎬 AI 協作時刻：static 欄位讀到怪數字

我寫了一個 `Dog` 類別，`count` 打算記錄「每隻狗」自己咬過幾次玩具，結果印出來全部狗都變成同一個數字，把程式碼貼給 AI 檢查：

**要用的 Prompt：**

> 我的 `Dog` 類別裡宣告了 `static int count`，原本想讓每隻狗各自累計自己的次數，
> 但印出來發現所有物件的 `count` 都一起變動。
> {貼上你的程式碼}
> 請幫我指出問題出在哪一行，並說明 static 欄位跟一般（實體）欄位的差別。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>易混淆點：</b> 「全類別共用一份」和「每個物件各自一份」只差一個 <code>static</code> 關鍵字，但語意完全相反——AI 抓出問題後，記得回頭對照本節的比較表確認自己真的懂了，不要照抄答案。
</div>

<!--
【操作提示】
現場故意示範一個把 count 誤宣告成 static 的錯誤版本（明明想記錄每隻狗各自的次數），讓 AI 指出「你要的其實是 instance field，不是 static field」。

【收斂一句話】
static 欄位是全類別共用一份，實體欄位才是每個物件各自一份——搞混這兩者是新手最常見的 static 地雷。
-->

---
layout: default
---

# 練習 3：設計 Student 類別
### 任務說明

設計一個符合封裝原則的 `Student` 類別，需求如下：

1. 欄位：`name`（姓名）、`score`（成績，0–100）
2. 提供兩個建構子：無參數版本、以及接受 `name` 與 `score` 的版本
3. 無參數建構子呼叫有參數建構子，傳入預設值（`"未知"`, `0`）
4. `score` 的 setter 需加入驗證，拒絕不合法的分數
5. 提供一個 `static` 方法 `isPass(int score)` 判斷是否及格（≥60）

<!--
【互動引導】
好了，嘴砲了這麼久，該換你們動動手了。

【解說要點】
這個練習結合了我們今天學的所有招式。記得 `this()` 要放哪裡嗎？還有 setter 裡面要怎麼檢查分數不准超過 100？

【等待與觀察】
給大家十分鐘。寫不出來的，可能要考慮一下今天晚餐要不要多吃一點補補腦（開玩笑的）。
-->

---

# 練習 3：解題提示
### 提示說明

1. 使用 `this("未知", 0)` 讓無參數建構子委託給有參數建構子
2. setter 範例邏輯：

```java
public void setScore(int score) {
    if (score >= 0 && score <= 100)
        this.score = score;
}
```

3. static 方法不需要物件就能呼叫：

```java
public static boolean isPass(int score) {
    return score >= 60;
}
// 呼叫：Student.isPass(75)
```

4. 記得遵守 JavaBean 慣例：`getName()` / `setName()` / `getScore()` / `setScore()`

<!--
【逐步解說】
如果你卡住了，看這裡！重點在於 `this()` 呼叫，還有 `static` 方法裡面是不需要用 `this` 的。

⚠️ 學生常見誤解：
有人會寫成 `this.isPass()`，雖然可以動，但這會讓帶你的前輩很想打人。請用 `Student.isPass()`。
-->

---

# 總結

- **建構子在 `new` 物件時自動執行**，名稱必須與類別相同、不能有回傳型態；沒自己寫建構子時 Java 才會補上無參數的預設建構子
- **建構子可以多載**，靠參數數量或型態區分；`this(...)` 能在建構子內呼叫同類別的另一個建構子，且必須是第一行
- **封裝把欄位設為 `private`，只透過 `public` 的 getter/setter 存取**，setter 可加驗證邏輯擋掉不合法的值，只給 getter 就能做出唯讀欄位
- **存取修飾詞由鬆到嚴：`public` → `protected` → 無修飾（package-private）→ `private`**，原則是欄位盡量用最嚴格的層級
- **JavaBean 慣例：欄位 `private`、`getXxx()`／`setXxx()`、布林欄位用 `isXxx()`、要有無參數建構子**，這是框架（Spring、Hibernate）能自動讀寫欄位的基礎
- **`static` 欄位是全類別共用一份**，用 `類別名稱.欄位` 存取；`static` 方法不依賴物件、不能用 `this`、不能存取 instance 成員
- **`static { }` 初始化區塊在類別第一次載入時執行一次**，適合處理比較複雜的靜態初始化

<!--
我們把這一章整理成七個重點。

第一，建構子是物件被 new 出來時自動執行的特殊方法，名稱一定要跟類別相同，而且不能宣告回傳型態，連 void 都不寫；如果我們完全沒有自己定義建構子，Java 才會自動幫忙補上一個什麼都不做的預設建構子。

第二，建構子可以像一般方法一樣多載，只要參數的數量或型態不同就能區分；如果想讓多個建構子共用同一段初始化邏輯，可以用 this(...) 委託給同類別的另一個建構子，但這一定要寫在建構子的第一行。

第三，封裝是把欄位設成 private，只開放 public 的 getter、setter 當作存取管道，setter 裡面可以加入驗證邏輯擋掉不合理的值，如果只提供 getter 不提供 setter，這個欄位就變成唯讀的。

第四，Java 的存取修飾詞由鬆到嚴依序是 public、protected、無修飾（package-private）、private，基本原則是欄位盡量設成最嚴格的 private，除非有特別理由才放寬。

第五，JavaBean 是業界常見的命名慣例：欄位全部 private，搭配 getXxx() 和 setXxx() 方法，布林型態的欄位則用 isXxx() 而不是 getXxx()，還要有一個無參數建構子——這套規則是 Spring、Hibernate 這類框架能自動讀寫物件欄位的基礎。

第六，static 欄位是全類別共用的一份資料，不管建立多少個物件都共用同一份，習慣上用「類別名稱.欄位」存取；static 方法不依賴任何物件就能呼叫，也因為不屬於任何特定物件，所以不能使用 this，也不能直接存取 instance 欄位或方法。

第七，static 初始化區塊會在類別第一次被載入時執行一次，通常用在比較複雜、沒辦法一行寫完的靜態變數初始化，例如讀取設定檔。

這七點加起來，就是打造一個既安全又好維護的類別所需要的核心工具。下一章我們要進入繼承了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

有任何關於建構子、封裝或 static 的問題歡迎提出！

<!--
【開場白】
好了，今天的「物件保護與共用」課程就到這裡。有誰的腦袋已經燒壞了，需要我幫你 `new` 一個新的嗎？

【問題引導】
有沒有人對 `static` 還是覺得怕怕的？或者不懂為什麼一定要寫 Getter/Setter？沒關係，儘管問，我不收診斷費的。
-->
