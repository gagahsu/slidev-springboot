---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 抽象類別 (Abstract Class)
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
    Java Programming Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    抽象類別
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「定義骨架，交由子類別實作」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到「抽象藝術」的世界！今天我們要學「抽象類別」。聽名字好像很玄，其實它就是個「沒做完的半成品」。就像你主管跟你說「我們要做一個偉大的系統」，但細節怎麼做？他不知道，他叫你去想。這就是抽象。

【為什麼要學這個？】
在真實的程式開發中，你常常需要當那個「出一張嘴」的主管。你定義一個類別說：「所有繼承我的類別都要會某件事」，但你自己不用動手做。抽象類別就是讓你優雅地開空頭支票的工具。

【今天學完你會能做什麼】
學完之後，你就能設計出極具架構感的程式，像個真正的架構師一樣定義規範。你還會學到 Template Method Pattern，這可是業界老鳥用來寫出漂亮程式碼的神技。
-->
---
layout: default
---

# Outline

- **抽象類別 (Abstract Class)**
- **抽象方法 (Abstract Method)**
- **觀念整理**
- **進階應用** — 建構方法、Upcasting、Sealed Classes、Template Method Pattern
- **抽象類別 vs 介面**
- **實作練習**

<!--
【帶讀大綱】
大綱在這裡：我們會先從「什麼是抽象」開始，然後看連大括號都沒有的「抽象方法」。接著會聊聊它跟介面的愛恨情仇，最後帶大家實戰兩個練習。

【重點預告】
大家注意，抽象類別 vs 介面是面試官最愛問的陷阱題。如果答錯了，面試官可能就會覺得你只是個會寫 Code 的碼農，而不是有思想的工程師。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 抽象類別
# Abstract Class

<!--
【段落轉換】
現在，讓我們把那些虛無縹緲的概念具象化，來看看到底什麼是 Abstract Class。
-->
---
layout: default
---

# 什麼是抽象類別

- 使用關鍵字 `abstract` 宣告的類別稱為**抽象類別**
- 抽象觀念主要是**隱藏工作細節**，使用者只需知道如何使用
  - 例如 `+` 符號可以執行數值加法，也可以執行字串相加
  - 但不需要知道內部程式如何設計 `+` 號的功能
- 這個類別中可以有**抽象方法**（abstract method）和**實體方法**（method）

<!--
【核心說明】
看到 abstract 這個關鍵字，你就要把它想成是「我只管定義，不負責實作」。

【生活化比喻】
抽象類別就像是百貨公司的「櫃位招租計畫」。百貨公司（抽象類別）規定這裡一定要賣吃的（定義方法），但具體是賣拉麵還是炸雞？那是進駐廠商（子類別）的事。

【類比延伸】
就像你用遙控器轉台，你只需要知道按鈕在那，不需要知道電視內部是怎麼接收訊號的。抽象類別就是在幫你把這些雜事藏起來。
-->
---

# 使用抽象類別的場合

- 有一個 `Shape` 類別包含計算繪製外型的 `draw()` 方法
  - `Circle` 和 `Rectangle` 繼承 `Shape`，各自重新定義外型繪製
- `Shape` 的存在讓整個程式定義更加完整，**本身不處理任何工作**
  - 真正的工作交由子類別完成
  - 這就是一個適合使用**抽象類別**（abstract class）的場合

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>核心概念：</b> 抽象類別是「模板」，子類別依照各自情境對此模板擴展和建構。
</div>

<!--
【帶讀場景】
想像你在寫繪圖軟體，如果你定義一個 Shape 類別，你根本不知道怎麼畫它，因為「形狀」這個詞太抽象了。

【核心概念】
但如果你定義了 Shape 說「只要是形狀都要能 draw()」，那 Circle 就可以畫圓，Rectangle 就可以畫方塊。Shape 就像是一個「家族規範」，它不幹活，它只負責管教小孩。

💼 業界實務：
在 Spring Boot 裡，如果你看到類別名稱開頭是 Abstract，別懷疑，那通常是框架設計師留給你的「填空題」。
-->
---

# 抽象類別語法

- 在定義類別名稱的 `class` 左邊加上 `abstract` 關鍵字

```java
abstract class Shape {
    // 類別內容
}
```

- 抽象類別定義的方法（實際執行的部分）交由子類別重新定義
- 可以把抽象類別想成是一個**模板**，子類別依照各自情境擴展和建構

<!--
【帶讀語法】
語法非常直覺，就是在 class 前面加個 abstract。這就像是在類別標籤上貼了一張「開發中」的貼紙。

【重點提示】
雖然它是「開發中」，但裡面還是可以放一些已經做好的普通方法喔。這點跟介面（Interface）很不一樣，它是可以帶點「乾貨」給子類別的。
-->
---

# 抽象類別不能實例化

- 抽象類別**不能使用 `new` 建立物件**（不能實例化）
- 繼承（實作）的子類別可以實例化

```java
abstract class Shape {
    public void draw() { }
}
// Shape shape = new Shape(); // 編譯錯誤！
Circle circle = new Circle(); // 子類別可以
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>錯誤訊息：</b> 'Shape' is abstract; cannot be instantiated
</div>

<!--
【核心說明】
重要！重要！重要！如果你敢對著抽象類別下 new，Java 會直接把編譯錯誤甩在你臉上。

【帶讀程式碼】
你看這行 new Shape()。這是不可能的，因為 Shape 是個概念。

【生活化比喻】
你去餐廳不能跟服務生說：「給我來一份食物。」服務生會問你：「你要什麼食物？」因為「食物」是抽象的，你只能點具體的「排骨飯」或是「牛肉麵」。抽象類別就是那個你點不到的「食物」。
-->
---

# 抽象類別實作 — 骨架定義

- 繪製框架（`Shape`）：抽象類別，定義 `draw()` 方法骨架
- 各自實作（`Circle`、`Square`）：子類別各自 override `draw()`

```java
abstract class Shape {
    public void draw() { }        // 純定義，無實作內容
}
class Circle extends Shape {
    @Override
    public void draw() {
        System.out.println("繪製圓形！");
    }
}
```

<!--
【帶讀程式碼】
Shape 裡的 draw() 有大括號 {}，但裡面空空如也。這叫「空實作」。Circle 繼承後就很熱心地把內容填上了。

⚠️ 這裡要小心：
雖然這樣寫也能動，但這樣並不能「強制」子類別去實作。如果 Circle 忘了寫 draw()，它就會執行父類別那個「什麼都不做」的版本。這往往不是我們要的。
-->
---

# 抽象類別實作 — 子類別範例

```java
class Square extends Shape {
    @Override
    public void draw() {
        System.out.println("繪製矩形！");
    }
}
// 使用方式：
// Circle cir = new Circle();  cir.draw();  → 繪製圓形！
// Square squ = new Square();  squ.draw();  → 繪製矩形！
```

<!--
【帶讀程式碼】
現在我們有 Circle 也有 Square 了。它們都乖乖地聽 Shape 的話，各自實現了 draw()。

【多形效果】
這就是多形的基礎！你可以用一個 List<Shape> 同時裝圓形跟方形，然後一個迴圈下去，大家都各自畫出自己的樣子。這程式碼寫起來多爽啊！
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 抽象方法
# Abstract Method

<!--
【段落轉換】
剛才那是「沒效率」的監督方式。現在我們要來看更高壓的手段：抽象方法。
-->
---
layout: default
---

# 抽象方法的特性

| 特性 | 說明 |
| --- | --- |
| 沒有實體內容 | 無方法主體（no body） |
| 宣告以 `;` 結尾 | 不使用 `{}` 大括號 |
| 必須被子類別 override | 子類別**必須**重新定義，否則編譯錯誤 |
| 類別需宣告為 abstract | 含抽象方法的類別必須是抽象類別 |

<!--
【帶讀表格】
抽象方法就像是軍令：
1. 它沒有廢話（沒有大括號）。
2. 它以分號結尾，乾脆利落。
3. 接到命令的部下（子類別）一定要執行，不然就軍法處置（編譯錯誤）。
4. 只有抽象類別才有資格發號施令。

【生活化比喻】
這就像是你要跟建築商簽約，合約裡寫：「這裡要蓋一個廁所（分號）」。你不需要教他怎麼拉水管，但他如果不蓋，你就告到他破產。
-->
---

# 抽象方法的特性 — 範例

```java
abstract class Shape {
    public abstract void draw(); // 抽象方法（以 ; 結尾）
}
class Circle extends Shape {
    @Override
    public void draw() {         // 子類別重新定義
        System.out.println("繪製圓形！");
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 子類別重新定義時，回傳值型態與參數個數、型態需與抽象方法一致，並建議加上 <code>@Override</code>。
</div>

<!--
【帶讀程式碼】
你看這行 public abstract void draw(); 連大括號都省了，直接一個分號。這就是在說：「我不管你怎麼畫，反正你一定要給我畫出個東西來！」

⚠️ 學生常見誤解：
很多同學會忘記加分號，或是加了 abstract 又想寫大括號。記住：abstract 和 {} 是「王不見王」，有我就沒它。
-->
---

# 子類別未重新定義抽象方法

- 若子類別**沒有重新定義抽象方法**，編譯時會出現錯誤
- 解法：將子類別也宣告為抽象類別，延遲到孫類別實作

```java
abstract class Car {
    abstract void run();     // 抽象方法
}
class Bmw extends Car {
    // 未 override run() → 編譯錯誤！
    // Class 'Bmw' must implement abstract method 'run()' in 'Car'
}
```

<!--
【帶讀程式碼】
Bmw 想要繼承 Car，但它竟然不想實作 run()？那它還叫車嗎？這時候 Java 的編譯器就會跳出來噴你。

⚠️ 看到這個錯誤訊息別慌：
Class 'Bmw' must implement abstract method...。這就是在提醒你：「債還沒還清喔！」

【解法】
如果你真的不想在 Bmw 裡寫實作，那你就得承認 Bmw 也是「抽象」的（加 abstract），然後把這個爛攤子丟給 Bmw 的子類別。這招叫「債留子孫」。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 觀念整理
# Abstract Class & Method

<!--
【段落轉換】
好了，牛吹完了，我們來冷靜整理一下這些規矩，免得大家被 abstract 搞到頭暈。
-->
---
layout: default
---

# 抽象類別與抽象方法 — 重要規則

| 規則 | 說明 |
| --- | --- |
| 抽象類別無法實例化 | 必須透過子類別建立物件 |
| 含抽象方法 → 必須宣告為 `abstract class` | 普通類別中不存在抽象方法 |
| 子類別必須 Override 所有抽象方法 | 否則子類別也必須宣告為 `abstract` |
| 抽象類別不一定要有抽象方法 | 可以只包含普通方法 |
| 抽象類別可以混用兩種方法 | 抽象方法 + 普通方法皆可存在 |

<!--
【帶讀表格】
這張表就是你的「避坑指南」。
特別注意最後兩條：你可以定義一個抽象類別，裡面一個抽象方法都沒有。這通常是用來「防止別人 new 我」。

【互動引導】
大家想想，一個完全沒有抽象方法的抽象類別有什麼用？（答：單純用來當作父類別，強迫別人一定要繼承才能用）。
-->
---

# 抽象類別可以有兩種方法

- 抽象類別內**可以同時有**抽象方法和普通方法

```java
abstract class Car {
    abstract void run();      // 抽象方法
    void refuel() {           // 普通方法
        System.out.println("汽車加油");
    }
}
```

<!--
【帶讀程式碼】
這就是抽象類別的魅力：
run() 是抽象的，因為每台車跑法不同（有些吃油，有些吃電，有些吃信仰）。
refuel() 是普通的，因為管你什麼車，沒能量就動不了，大家加油的邏輯都差不多。

【設計意圖】
這叫「求同存異」。把大家都一樣的寫在父類別（refuel），不一樣的留給子類別去客製化（run）。
-->
---

# 抽象類別兩種方法 — 子類別使用

```java
class Bmw extends Car {
    @Override
    public void run() {
        System.out.println("安全駕駛中 ...");
    }
}
// Bmw bmw = new Bmw();
// bmw.refuel();  → 汽車加油
// bmw.run();     → 安全駕駛中 ...
```

<!--
【帶讀程式碼】
Bmw 只需要關心怎麼 run()，refuel() 則是直接「白嫖」父類別的。

💼 業界實務：
這種「白嫖」行為在業界被稱為「程式碼重用」。這也是為什麼我們喜歡用抽象類別，因為它能幫我們少寫很多廢話。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 進階應用
# Constructor & Upcasting

<!--
【段落轉換】
接下來要講一些稍微硬一點的東西，準備好你的強心針。
-->
---
layout: default
---

# 抽象類別的建構方法

- 設計 Java 程式時，可以將**建構方法**（constructor）或**屬性**（成員變數）的觀念應用在抽象類別
- 子類別建立物件時，會先執行**父類別（抽象類別）的建構方法**

```java
abstract class Car {
    abstract void run();
    Car() {
        System.out.println("有車子了");
    }
    void refuel() {
        System.out.println("汽車加油");
    }
}
```

<!--
【核心說明】
很多人以為抽象類別不能 new，所以就沒有建構子。大錯特錯！

【重點提醒】
抽象類別當然有建構子，只是它不是給外部 new 用的，而是給它的子類別在出生（new）的時候呼叫的。

【生活化比喻】
這就像你買新家（子類別），雖然你不需要親手去打地基（父類別建構子），但地基一定得先打好，你的房子才蓋得起來。
-->
---

# 抽象類別的建構方法 — 範例

```java
class Bmw extends Car {
    public void run() {
        System.out.println("安全駕駛中 ...");
    }
}
public static void main(String[] args) {
    Bmw bmw = new Bmw(); // 建立物件時先執行 Car()
    bmw.refuel();
    bmw.run();
}
// 輸出順序：有車子了 → 汽車加油 → 安全駕駛中 ...
```

<!--
【帶讀程式碼】
你看輸出結果。雖然你 new 的是 Bmw，但父類別 Car 的建構子會先跳出來大喊：「有車子了！」這就是繼承的順序性。

⚠️ 學生常見誤解：
「如果父類別沒有無參建構子怎麼辦？」孩子，那你就要在子類別用 super() 去手動呼叫，這跟普通繼承一模一樣，別把它想得太難。
-->
---

# 抽象類別的屬性宣告

| 概念 | 說明 |
| --- | --- |
| `protected` 屬性 | 子類別可直接存取，外部無法存取 |
| `super(參數)` | 子類別透過 `super()` 初始化父類別屬性 |

```java
abstract class Car {
    protected String brand;
    Car(String brand) { this.brand = brand; }
    abstract void run();
}
```

<!--
【帶讀表格】
抽象類別也可以有自己的「私房錢」（屬性）。通常我們用 protected，這意思是：「這是我留給孩子們的，外人別碰。」
-->
---

# 抽象類別屬性 — 子類別使用範例

```java
class Bmw extends Car {
    Bmw() { super("BMW"); }
    @Override
    public void run() {
        System.out.println(brand + " 行駛中");
    }
}
Car bmw = new Bmw();    // Upcasting
bmw.run();              // BMW 行駛中
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 子類別直接使用 <code>brand</code>，無需重複宣告，因為 <code>protected</code> 屬性可由子類別繼承
</div>

<!--
【帶讀程式碼】
這裡展示了 super("BMW") 把品牌名字傳給老爸。然後在 run() 裡面直接拿來用。

💡 注意這行：Car bmw = new Bmw();
這就是 Upcasting。雖然 Car 是抽象的，但它還是可以用來當作變數的型態，去承接它的子類別。這在多形裡是至關重要的概念。
-->
---

# 使用 Upcasting 宣告抽象類別的物件

- 抽象類別**無法實例化**，但可以用 **Upcasting（向上轉型）** 宣告物件
- 用父類別型態接住子類別 `new` 出來的物件

```java
Car bmw = new Bmw();    // Upcasting（合法）
// Car car = new Car(); // 編譯錯誤！
bmw.refuel();
bmw.run();
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見用法：</b> 許多 Java 程式設計師會使用 Upcasting 宣告抽象類別物件，由所宣告物件的參考是子類別，所以可以正常執行工作。
</div>

<!--
【核心說明】
這招叫「指鹿為馬」...不對，是「指 BMW 為車」。

【帶讀程式碼】
雖然我們宣告變數型態是 Car，但實際跑的是 Bmw。這樣做的好處是，以後如果你想把 Bmw 換成 Audi，你的程式碼其他部分幾乎不用動。

💼 業界實務：
老鳥都喜歡寫 Car car = getCar(); 而不是 Bmw car = getBmw();。因為我們追求的是「彈性」，而不是死板板的型別。
-->
---

# 密封抽象類別 (Sealed Abstract Class)

Java 17 起，`sealed` 可搭配 `abstract` 一起使用，**精確限制**哪些類別可以繼承該抽象類別：

| 關鍵字 | 說明 |
| --- | --- |
| `sealed` | 宣告該類別為密封類別 |
| `permits` | 指定允許繼承的子類別清單 |

```java
// 限制只有 Circle 和 Square 可以繼承 Shape
public abstract sealed class Shape permits Circle, Square {
    public abstract double area();
}
```

<!--
【核心說明】
這是 Java 17 的新玩意兒，叫「密封類別」。

【帶讀程式碼】
這就像是：「我這份遺產，只准 Circle 和 Square 來繼承，隔壁老王（其他類別）門都沒有！」

💼 業界實務：
如果你在寫一個金融系統，你可能只希望「信用卡」和「轉帳」能繼承「支付方式」，不希望有人莫名其妙寫個「冥幣支付」來搞破壞。這時候 sealed 就非常好用。
-->
---

# 密封子類別的修飾詞

繼承密封類別的子類別，**必須**使用以下修飾詞之一：

| 修飾詞 | 說明 |
| --- | --- |
| `final` | 終止繼承，不能再有子類別 |
| `sealed` | 繼續密封，需指定新的 `permits` |
| `non-sealed` | 解除限制，任何類別皆可繼承 |

```java
public final class Circle extends Shape { /*...*/ }
public non-sealed class Square extends Shape { /*...*/ }
```

<!--
【帶讀表格】
用了 sealed 之後，你的子類別就得做出選擇：
1. final：到我為止，我不生了。
2. sealed：我也要挑孩子，繼續密封。
3. non-sealed：算了，我大方點，誰都可以繼承我。

這就像是家族企業的傳承機制，非常有條理。
-->
---

# Template Method Pattern

抽象類別的經典設計模式：用 `final` 方法固定流程骨架，用 `abstract` 方法讓子類別填入細節：

| 方法角色 | 宣告方式 | 說明 |
| --- | --- | --- |
| 骨架方法 | `final` 普通方法 | 定義固定流程，子類別不可 Override |
| 可變步驟 | `abstract` 方法 | 子類別各自實作細節 |

```java
abstract class Game {
    abstract void start();    // 可變步驟
    abstract void end();      // 可變步驟
    final void play() { start(); end(); }  // 骨架固定
}
```

<!--
【核心說明】
敲黑板！這是今天最有價值的知識點：Template Method Pattern（模板方法模式）。

【核心概念】
父類別先把流程定死（play() 用 final），誰也別想動。但流程裡面的步驟（start, end）則是抽象的。

【生活化比喻】
就像你去吃泡麵。步驟一定是：1.撕開蓋子 2.加熱水 3.等三分鐘 4.開吃。這流程是死的一定要照做。但「泡哪種麵」？那就是子類別決定的事。
-->
---

# Template Method Pattern — 子類別實作

```java
class Chess extends Game {
    @Override void start() { System.out.println("走棋"); }
    @Override void end()   { System.out.println("將軍"); }
}
class Soccer extends Game {
    @Override void start() { System.out.println("踢球"); }
    @Override void end()   { System.out.println("進球"); }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>new Chess().play()</code> → 走棋 → 將軍；新增遊戲只需新增子類別，骨架流程不需修改
</div>

<!--
【帶讀程式碼】
你看，不論是西洋棋還是足球，呼叫 play() 的時候，流程都是一樣的。但輸出的細節卻大不相同。

💼 業界實務：
如果你能把這套模式用在你的專案裡，你的主管一定會覺得你最近是不是偷偷去報名了什麼高級架構師課程。這就是程式碼的高級感。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 抽象類別 vs 介面
# Abstract Class vs Interface

<!--
【段落轉換】
現在我們來解決那個讓無數學生想撞牆的問題：抽象類別跟介面到底差在哪？
-->
---
layout: default
---

# 抽象類別與介面的比較

| 比較項目 | 抽象類別 Abstract Class | 介面 Interface |
| --- | --- | --- |
| 父類別/父介面繼承 | 只能繼承一個類別 | 能繼承多個介面（Java 實現多重繼承） |
| 子類別繼承/實作 | `extends` 一個抽象類別 | `implements` 多個介面 |
| 方法 | 可包含非抽象方法 | 只能是抽象方法（Java 8 以前） |
| 必定為 | 父類別 | 可視為抽象類別的特例 |

<!--
【帶讀表格】
這裡有一份清單。最簡單的記法：
抽象類別是「出生（IS-A）」，你只能有一個老爸。
介面是「證照（CAN-DO）」，你可以考一堆證照。

⚠️ 現代 Java 的模糊地帶：
Java 8 之後介面也能寫 default 方法了，這讓兩者的界線變得很模糊。但記住，抽象類別還是能存「狀態（變數）」，而介面不行。
-->
---

# 介面的演進 (Java 8+)

Java 8 起，介面支援 `default` 與 `static` 方法（Java 9 加入 `private`），與抽象類別的差異縮小。但介面仍**無法儲存狀態**（無實例欄位），需要共用屬性時仍應使用抽象類別。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 介面 <code>default</code>、<code>static</code>、<code>private</code> 方法的詳細用法，將在 Ch17 介紹。
</div>

<!--
【核心說明】
別被 Java 8 給騙了，介面變強了沒錯，但它依然不是類別。

【核心概念】
介面就像是「外掛」，你可以掛一堆。而抽象類別是你的「核心」，你只能有一個。如果你需要存一些變數（例如：年齡、姓名），你還是得乖乖用抽象類別。

💡 下一章我們會專門講介面，現在先別糾結，先把抽象類別搞定。
-->
---

# 抽象類別與介面 — 相同點與應用

**相同點：**
- 兩者都**無法直接實體化**
- 子類別都必須實作已宣告之抽象方法（或繼續抽象）

**應用場景比較：**
- **抽象類別**：關係密切的類別中，如定義抽象類別 `Car`，子類別 `Benz` 及 `Audi` 繼承 `Car`
- **介面**：定義一些功能給不相干類別使用，如定義介面 `Fly`，子類別 `AirPlane` 及 `Bird` 實作 `Fly`

<!--
【帶讀說明】
這是一個很好的準則：
如果是「親兄弟」，大家都有同樣的基因（Car）→ 用抽象類別。
如果是「跨界合作」，一個是鳥一個是飛機，大家都想飛（Fly）→ 用介面。

💼 業界實務：
如果你看到有人用繼承來實作「飛行能力」，導致飛機繼承了鳥類，那這程式碼基本上已經沒救了。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習

<!--
【段落轉換】
好了，嘴砲時間結束，大家動動手吧！沒寫過程式碼的人是不配談架構的。
-->
---
layout: default
---

# 練習 1：Shape 面積與周長
### 任務說明

請設計一個**抽象類別 `Shape`**，包含計算面積（`area()`）和周長（`perimeter()`）的抽象方法，再設計 `Rectangle` 和 `Circle` 兩個子類別分別實作。

**預期輸出：**
```
矩形面積：6.0
矩形周長：10.0
圓面積：12.566370614359172
圓周長：12.566370614359172
```

<!--
【出題前的鋪陳】
練習 1：形狀大師。這題如果你寫不出來，那你剛才那半小時可能是在冥想而不是在聽課。

【問題引導】
Shape 類別要怎麼寫？那兩個計算的方法要加什麼關鍵字？Circle 裡面要存什麼？（小提示：半徑）。

【等待與觀察】
大家寫的時候注意括號跟分號。如果你被編譯器噴了，記得回頭看看投影片。
-->
---

# 練習 1：解題提示
### 提示說明

1. 在 `Shape` 中宣告 `abstract double area();` 與 `abstract double perimeter();`
2. `Rectangle` 需 `height`、`width` 屬性，透過建構方法傳入（高 2，寬 3）
3. `Circle` 需 `r`（半徑）屬性，透過建構方法傳入（半徑 2）
4. 計算公式：
   - 矩形面積 = `height * width`，周長 = `2 * (height + width)`
   - 圓面積 = `Math.PI * r * r`，圓周長 = `2 * Math.PI * r`

<!--
【帶讀解法】
解法在這裡。注意 area() 和 perimeter() 都要宣告成 abstract。

⚠️ 小細節：
記得用 double，不然你的圓面積可能會變成一個整數，然後你的數學老師就會想跟你談談。還有，Math.PI 是你的好朋友。
-->
---

# 練習 2：抽象數學計算器
### 任務說明

請設計一個**抽象類別 `MyMath`**，包含 `add()` 與 `mul()` 兩個帶參數的抽象方法，以及一個普通方法 `output()` 印出「我的計算器」。設計子類別 `MyTest` 重新定義這兩個抽象方法。

**預期輸出：**
```
我的計算器
加法結果：11
乘法結果：24
```

<!--
【出題前的鋪陳】
練習 2：我的計算器。這題是考你有沒有弄懂「混用方法」。

【問題引導】
output() 是普通方法喔，不要手癢去加 abstract。add() 跟 mul() 才是要讓子類別去頭大的。
-->
---

# 練習 2：解題提示
### 提示說明

1. 在 `MyMath` 中宣告 `abstract int add(int n1, int n2);` 與 `abstract int mul(int n1, int n2);`
2. 普通方法 `void output()` 直接印出「我的計算器」，不需 override
3. 在 `MyTest` 中實作：`add()` 回傳 `n1 + n2`，`mul()` 回傳 `n1 * n2`
4. 在 `main` 中使用 Upcasting：`MyMath obj = new MyTest();`
5. 呼叫 `obj.output()`、`obj.add(3, 8)`、`obj.mul(3, 8)`

<!--
【帶讀解法】
重點在那行 MyMath obj = new MyTest()。這就是 Upcasting。雖然 obj 被宣告為 MyMath，但它執行的是 MyTest 裡的加法跟乘法。這就是多形的力量！
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【收尾】
今天我們從「出一張嘴」的抽象類別，講到「制定規矩」的抽象方法，最後還學會了老鳥專用的「模板模式」。

【核心帶走重點】
1. 抽象類別不能 new。
2. 抽象方法沒有大括號。
3. 繼承抽象類別，要嘛還債（實作），要嘛繼續欠（宣告抽象）。
4. 模板模式讓你寫出有架構感的程式碼。

有問題嗎？沒問題的話我們就下課，回去好好抽象一下。
-->
---
layout: end
---

# 課程結束
### 感謝聆聽，有問題請發問！

<!--
[依脈絡推斷]
下課！記住：定義骨架、交由子類別實作——這就是抽象類別的精髓。如果你沒聽懂，那你一定是太「抽象」了。我們下一章「介面」見！
-->
