---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Java 介面 (Interface)
routeAlias: ch19
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
    介面 (Interface)
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「定義行為契約，讓不同類別共享相同的能力」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
各位好！前面我們學過「抽象類別」——那個只會出一張嘴、規定子類別要做什麼事的「主管」。今天要學的「介面（Interface）」，可以說是這位主管的升級版：它一樣只訂規則，但訂規則的對象不再侷限於「自己家的人」（子類別），而是「任何願意遵守規則的類別」。

【為什麼要學這個】
想像一下：鳥會飛，飛機也會飛，但鳥是動物，飛機是機器，兩者完全沒有繼承關係。如果我們想寫一段程式碼，可以同時操作「會飛的東西」，不管它是鳥還是飛機，要怎麼設計？這就是介面要解決的問題——它讓不相關的類別，可以共享同一種「能力」。

【今天學完你會能做什麼】
學完這章，你會知道介面跟抽象類別有什麼不同、什麼時候該用介面；也會學到一個類別怎麼同時實作多個介面、介面之間怎麼互相繼承。這些都是設計「靈活、好擴充」程式架構的基礎功夫。
-->
---
layout: default
---

# Outline

- **認識介面** — 概念、語法、與抽象類別的比較
- **介面的成員變數** — `public static final`
- **介面的繼承** — 基本繼承、多重繼承、實作多個介面
- **Default 方法（Java 8+）** — 介面提供預設實作
- **實作綜合練習**

<!--
【帶讀大綱】
今天的大綱分成四大塊。第一塊是認識介面的基本概念，搞懂它跟抽象類別有什麼不一樣；第二塊是介面裡可以放什麼變數；第三塊是介面之間、以及類別與介面之間，怎麼透過繼承和實作組合出更複雜的結構；第四塊是現代介面很重要的 Default 方法。

【重點預告】
這章最重要的概念，其實只有一句話：「介面描述的是『有某種能力』，不是『屬於哪一類』」。把這句話記住，後面所有規則都會變得很合理。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 認識介面

<!--
【段落轉換】
現在，先把你對「類別」的印象放到一邊，我們要進入一個「只談行為、不談身分」的世界。
-->
---
layout: default
---

# 什麼是介面？

- 介面（Interface）**不是物件**，而是**行為的規範**
- 繼承描述「IS-A」關係，介面描述「**有某種能力**」
  - 鳥（Bird）**是**動物 → 繼承自 Animal（IS-A）
  - 鳥會飛、飛機也會飛 → 「飛」是**行為**，不是類別關係
  - 設計介面定義「飛」的行為，讓不同類別去實作（implements）
- 介面**無法用 `new` 直接建立物件**

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>比較飛機與鳥：</b>兩者不是同一類時，但都有「飛」的能力 → 用介面定義共同行為
</div>

<!--
【情境切入】
想像你要寫一個程式，裡面有「鳥」和「飛機」，你希望寫一段共用的邏輯，讓兩者都能「飛」。但鳥是動物（`Animal` 的子類別），飛機是機器，這兩個類別的繼承關係完全不相干——你不可能讓 `Airplane extends Animal`，那會很奇怪。

【概念定義】
這時候就需要「介面（Interface）」。介面不是在描述「你是什麼」，而是在描述「你有什麼能力」。「鳥是動物」是繼承關係（IS-A）；「鳥會飛、飛機也會飛」則是兩者都具備的「行為」，這種「行為」就適合用介面來定義。

【生活化比喻】
繼承就像「家族遺傳」——你爸爸長得高，你大概也長得高，這是天生決定的。介面就像「能力證照」——不論你是台灣人、美國人，只要你考到「多益 900 分」這張證照，你就被認證「英文很好」，跟你的出身完全無關。

💼 業界實務：
業界常說「針對介面寫程式，而非針對實作」。意思是，呼叫端只需要知道「這個東西會飛」，不需要管它到底是鳥還是飛機、是用翅膀飛還是引擎飛。
-->
---

# 介面的語法

```java
interface Flyable {
    void fly();   // 預設為 public abstract，可省略宣告
}
```

- 所有方法預設是 `public abstract`（可省略）
- 所有成員變數預設是 `public static final`
- Java 8 之前介面**只能有**抽象方法

```java
class Bird implements Flyable {
    @Override
    public void fly() {
        System.out.println("鳥兒飛翔");
    }
}
```

<!--
【概念定義】
宣告介面用 `interface` 關鍵字，裡面的方法不需要寫方法本體，只要宣告「這個方法存在」就好——這種方法叫「抽象方法」，預設就是 `public abstract`，這兩個字可以省略不寫。

【帶讀範例】
看 `void fly();` 這一行，它其實隱含了 `public abstract void fly();`，Java 把這些字省略掉，讓介面的語法看起來更乾淨。

⚠️ 易錯點提醒：
類別要遵守介面的規則，用的關鍵字是 `implements`（實作），不是 `extends`（繼承）。如果你在 `implements` 後面接了一個類別名稱，或者在 `extends` 後面接了一個介面名稱，編譯器會直接報錯——這兩個關鍵字不能混用。
-->
---

# 介面的實作規則

- 實作類別必須覆寫**所有的抽象方法**
- 覆寫時存取控制**必須宣告為 `public`**
- 建議加上 `@Override` 確認覆寫正確

```java
class Airplane implements Flyable {
    @Override
    public void fly() {
        System.out.println("飛機用引擎飛");
    }
}
public class Demo {
    public static void main(String[] args) {
        Flyable bird = new Bird();
        Flyable airplane = new Airplane();
        bird.fly();     // 鳥兒飛翔
        airplane.fly(); // 飛機用引擎飛
    }
}
```

<!--
【帶讀範例】
這段範例的目的，是示範「不同類別實作同一個介面」的效果。`Bird` 和 `Airplane` 都 `implements Flyable`，所以它們都必須 `override` `fly()` 方法，各自寫出自己的飛行方式。

【預期結果】
執行後會印出「鳥兒飛翔」和「飛機用引擎飛」——雖然兩個物件的類別完全不同，但因為都實作了 `Flyable`，呼叫端可以用同樣的方式（宣告成 `Flyable` 型態）去操作它們。

⚠️ 易錯點提醒：
注意 `Flyable bird = new Bird();` 這一行，變數的「型態」宣告成介面 `Flyable`，但實際 `new` 出來的是 `Bird`。這就是「解耦合」的第一步——以後想把 `bird` 換成 `Airplane`，只需要改 `new` 後面的部分就好。
-->
---

# 介面 vs 抽象類別

| 比較項目 | 抽象類別 | 介面 |
| --- | --- | --- |
| 父類別 | 只能繼承一個 | 可繼承多個介面 |
| 子類別 | 只能 `extends` 一個 | 可 `implements` 多個 |
| 方法 | 可包含具體方法 | Java 8 前只能抽象方法 |
| 用途 | 類別間的緊密關係 | 不同類別間的共同行為 |
| 適用 | Car → Benz、Audi（IS-A） | Bird 與 Airplane 都能飛（行為） |

<!--
【補充說明】
這張表整理了介面跟抽象類別的核心差異。最關鍵的一句話：抽象類別處理的是「身分」（你是不是這個家族的一員），介面處理的是「能力」（你會不會做這件事）。

💡 選擇準則：
如果你想讓子類別共用一些「屬性（變數）」或「已經寫好的方法」，適合用抽象類別；如果你只是想規定「這些類別都要有某個功能」，而它們之間本來沒有什麼血緣關係，那就用介面。
-->
---
layout: default
---

# 🎬 AI 協作時刻：換成你的興趣重新理解

還在覺得「介面描述能力、不是身分」很抽象？把它丟給 AI，用你自己的興趣換一個例子：

**要用的 Prompt：**

> 我還不太理解 Java 的「介面」是什麼、跟繼承有什麼不同。
> 請用「{你的興趣，例如：追劇、打籃球、養貓}」舉一個例子，
> 說明什麼是「IS-A（是什麼）」、什麼是「CAN-DO（有什麼能力）」，
> 100 字以內，不要用程式碼，只能用生活化比喻。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>這個 prompt 你可以帶回家用：</b> 每次遇到聽不懂的概念，換成自己熟悉的興趣領域讓 AI 重講一次，理解速度會快很多。
</div>

<!--
【操作提示】
可以請幾位同學分享自己選的興趣與 AI 給出的比喻，比較看看哪個例子把「身分」跟「能力」的差異講得最清楚。

【收斂一句話】
記住一句話就好：繼承講的是「你是誰」，介面講的是「你會做什麼」。
-->
---
layout: default
---

# 練習 1 (實作)：實作多種付款方式
### 任務說明

設計一套介面，模擬「結帳時可以選擇不同付款方式」的情境：
1. 建立介面 `Payable`，定義抽象方法 `void pay(int amount)`
2. 類別 `CreditCard` 與 `CashPayment` 都實作 `Payable`，各自印出不同的付款訊息
3. 在 `main()` 中，宣告型態為 `Payable` 的變數，分別指向 `CreditCard` 與 `CashPayment` 的實例，並呼叫 `pay(500)`

**預期輸出：**
```
信用卡付款 500 元
現金付款 500 元
```

<!--
【任務鋪陳】
剛才學到，介面定義的是「能力」，而不是「身分」。這個練習就是要你體會：`CreditCard` 跟 `CashPayment` 本來毫無關係，但只要都實作 `Payable`，就能用同一種方式被呼叫。

【引導思考】
想一想：`Payable` 介面要怎麼宣告？兩個類別各自的 `pay()` 方法要寫成什麼存取修飾詞？變數宣告成 `Payable` 型態，跟宣告成 `CreditCard` 型態，差別在哪裡？

【等待與觀察】
給大家 6 分鐘。如果卡在「介面方法要不要寫 `public`」，回頭看看「介面的語法」那一頁。
-->
---
layout: default
---

# 練習 1 (實作)：實作多種付款方式
### 解題提示

1. 定義介面 `Payable`，內含 `void pay(int amount)`
2. `CreditCard implements Payable`，`override` `pay()`，印出「信用卡付款 X 元」
3. `CashPayment implements Payable`，`override` `pay()`，印出「現金付款 X 元」
4. `main()` 中分別用 `Payable` 型態的變數指向兩個實例，呼叫 `pay(500)`

```java
interface Payable {
    void pay(int amount);
}
class CreditCard implements Payable {
    @Override
    public void pay(int amount) {
        System.out.println("信用卡付款 " + amount + " 元");
    }
}
```

<!--
【帶讀解法】
重點在 `main()` 裡：`Payable p1 = new CreditCard();` 和 `Payable p2 = new CashPayment();`，兩個變數的「型態」一樣，但 `pay()` 執行起來的結果不一樣——這就是介面帶來的彈性。

💼 業界實務：
這種設計在真實系統裡很常見，例如電商網站的「付款模組」，背後可能有信用卡、超商代碼、行動支付等各種實作，但結帳流程的程式碼只需要認識 `Payable` 這個介面就夠了。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 介面的成員變數

<!--
【段落轉換】
介面裡除了方法，也可以放變數。不過這些變數的個性非常固執——一旦定了，就不准任何人改它。
-->
---
layout: default
---

# 介面的成員變數

介面的成員變數預設是 `public`、`static`、`final`：

| 修飾詞 | 意義 |
| --- | --- |
| `public` | 所有人都可以取得 |
| `static` | 所有實作類別共享同一份 |
| `final` | 值不可更動（常數），**一定要給預設值** |

```java
interface Shape {
    double PI = 3.14159;  // 等同 public static final
    double area();        // 等同 public abstract
}
```

<!--
【概念定義】
介面裡宣告的變數，會被自動加上三個標籤：`public`（誰都能看）、`static`（全部實作類別共用同一份）、`final`（值不能被改變，也就是常數）。

【生活化比喻】
可以把它想成「公告在公佈欄上的規定」——它公開給所有人看（`public`），全公司只有一份、大家看到的都一樣（`static`），而且一旦公告出去就不能隨意更改（`final`）。

⚠️ 易錯點提醒：
因為是常數，習慣上會用「全大寫」命名，例如 `PI`。如果你寫成 `double pi = 3.14;`，雖然編譯不會出錯，但在程式碼風格上會顯得不太專業。另外要注意：`final` 變數**必須在宣告時就給預設值**，不能留到之後再賦值。
-->
---

# 介面成員變數 — 範例

```java
interface Shape {
    double PI = 3.14159;
    double area();
}
class Rectangle implements Shape {
    double width, height;
    Rectangle(double w, double h) { width = w; height = h; }
    public double area() { return width * height; }
}
class Circle implements Shape {
    double radius;
    Circle(double r) { radius = r; }
    public double area() { return PI * radius * radius; }
}
```

<!--
【帶讀範例】
這段範例的目的，是示範介面常數如何被多個實作類別共用。`Rectangle` 和 `Circle` 都 `implements Shape`，所以它們都繼承到 `Shape` 裡的 `PI` 這個常數。

【預期結果】
`Circle` 的 `area()` 直接使用 `PI * radius * radius`，不需要自己再定義一次圓周率。

【補充說明】
這就是常數統一管理的好處：如果每個形狀類別都各自定義 `PI`，可能有人寫 `3.14`、有人寫 `3.14159`，算出來的面積會不一致。把常數放在介面裡，所有實作類別都用同一個值。
-->
---
layout: default
---

# 練習 2：商品分類常數
### 任務說明

設計一套介面，利用介面常數統一管理「庫存警示門檻」：
1. 建立介面 `InventoryRule`，定義常數 `int LOW_STOCK_THRESHOLD = 10`，以及抽象方法 `void checkStock(int quantity)`
2. 類別 `Product implements InventoryRule`，`override` `checkStock(int quantity)`：若 `quantity` 小於 `LOW_STOCK_THRESHOLD`，印出「庫存不足，請補貨」；否則印出「庫存充足」
3. 在 `main()` 中，建立一個 `Product` 物件，分別呼叫 `checkStock(5)` 與 `checkStock(20)`

**預期輸出：**
```
庫存不足，請補貨
庫存充足
```

<!--
【任務鋪陳】
剛才學到介面的成員變數是 `public static final`，最適合用來存放「全系統共用的常數」。這個練習就是讓你實際用一次：把「庫存警示門檻」這個數字定義在介面裡，讓所有商品類別共用同一個標準。

【引導思考】
想一想：`LOW_STOCK_THRESHOLD` 寫在介面裡，跟寫在 `Product` 類別裡，有什麼不同？如果以後想讓「服飾」「電子產品」用不同的門檻，介面常數還適合嗎？

【等待與觀察】
給大家 6 分鐘。如果不確定常數要怎麼宣告，回頭看「介面的成員變數」那一頁的範例。
-->
---
layout: default
---

# 練習 2：商品分類常數
### 解題提示

1. `InventoryRule` 介面：常數 `LOW_STOCK_THRESHOLD = 10`，抽象方法 `checkStock(int quantity)`
2. `Product implements InventoryRule`，`override` `checkStock()`，用 `if-else` 比較 `quantity` 與 `LOW_STOCK_THRESHOLD`
3. `main()` 中建立 `Product` 物件，分別呼叫 `checkStock(5)` 與 `checkStock(20)`

```java
interface InventoryRule {
    int LOW_STOCK_THRESHOLD = 10;
    void checkStock(int quantity);
}
class Product implements InventoryRule {
    @Override
    public void checkStock(int quantity) {
        if (quantity < LOW_STOCK_THRESHOLD) {
            System.out.println("庫存不足，請補貨");
        } else {
            System.out.println("庫存充足");
        }
    }
}
```

<!--
【帶讀解法】
重點在 `Product` 裡可以直接使用 `LOW_STOCK_THRESHOLD`，不需要寫 `InventoryRule.LOW_STOCK_THRESHOLD`——因為 `Product` 已經 `implements InventoryRule`，介面的常數就像是「繼承來的家產」，可以直接用。

⚠️ 小提醒：
如果以後真的需要「服飾」「電子產品」用不同門檻，介面常數就不適合了（因為它是全域共用、不能改的），這時候應該改用建構子參數或設定檔，這在後面章節會慢慢學到。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 介面的繼承

<!--
【段落轉換】
介面不只能被類別實作，介面之間也能互相繼承——而且，介面的繼承比類別之間的繼承還要「狂」。
-->
---
layout: default
---

# 繼承的三種關係

| 對象 | 關係 | 語法 | 限制 |
| --- | --- | --- | --- |
| Class → Class | 繼承 | `extends` | 只能一個父類別 |
| Class → Interface | 實作 | `implements` | 可多個，逗號分隔 |
| Interface → Interface | 繼承 | `extends` | 可多個父介面 |

- 當子介面繼承父介面，實作子介面的類別必須**同時實作所有**子介面與父介面的抽象方法

<!--
【概念定義】
這張表整理了三種「往上連結」的關係。類別繼承類別只能有一個父類別（單身狗）；類別實作介面可以有很多個（海王）；介面繼承介面也可以有很多個（一樣是海王）。

⚠️ 易錯點提醒：
如果一個子介面 `extends` 了一個「很多抽象方法」的父介面，那麼最後 `implements` 這個子介面的類別，就得把父介面跟子介面所有的抽象方法「一個都不能少」地實作出來——這筆債不會因為是「繼承來的」就可以不用還。
-->
---

# 基本介面的繼承

```java
interface Animal { void showMe(); }
interface Bird extends Animal { void flying(); }
```

- `Bird` 繼承 `Animal`，實作 `Bird` 時需同時實作兩個方法

```java
class Eagle implements Bird {
    public void showMe() { System.out.println("我是老鷹"); }
    public void flying() { System.out.println("老鷹展翅飛翔"); }
}
```

<!--
【帶讀範例】
這段範例的目的，是示範「介面繼承介面」最簡單的形式：`Bird extends Animal`，代表 `Bird` 介面繼承了 `Animal` 介面的所有規範，再加上自己新增的 `flying()`。

【預期結果】
`Eagle implements Bird`，因為 `Bird` 身上背負著 `Animal` 的「遺產」，所以 `Eagle` 必須同時實作 `showMe()`（繼承自 `Animal`）和 `flying()`（`Bird` 自己定義的）。執行後會印出「我是老鷹」和「老鷹展翅飛翔」。

【生活化比喻】
這就像考證照有「基礎級」和「進階級」之分——拿到進階級證照的人，等於同時證明自己「基礎級的能力也具備了」。
-->
---

# 介面多重繼承 — 概念

Java 類別不支援多重繼承，但**介面支援**：

```java
interface B { void b(); }
interface C { void c(); }
class A implements B, C {
    public void b() { System.out.println("b方法"); }
    public void c() { System.out.println("c方法"); }
}
```

- 一個類別可實作**多個介面**（逗號分隔）
- 一個介面可繼承**多個介面**

<!--
【情境切入】
Java 規定一個類別只能 `extends` 一個父類別（避免「多重繼承」帶來的複雜問題），但現實中，一個東西常常需要同時具備「好幾種能力」，怎麼辦？

【概念定義】
答案就是：用 `implements` 一次實作多個介面，中間用逗號分隔。`class A implements B, C` 代表 `A` 同時擁有 `B` 和 `C` 兩種能力，必須把兩者的抽象方法都實作出來。

💼 業界實務：
在真實系統裡，一個資料存取的元件可能同時是「可讀取的（Readable）」也是「可稽核的（Auditable）」——這種跨越不同維度的能力組合，就是透過「實作多個介面」來完成的。
-->
---

# 介面繼承多個介面 — 範例

```java
interface Bird { void birdFly(); }
interface Airplane { void airplaneFly(); }
interface Fly extends Bird, Airplane {
    void pediaFly();
}
class InfoFly implements Fly {
    public void birdFly() { System.out.println("鳥翅飛翔"); }
    public void airplaneFly() { System.out.println("引擎飛翔"); }
    public void pediaFly() { System.out.println("百科飛翔"); }
}
```

<!--
【帶讀範例】
這段範例的目的，是示範「介面自己也能繼承多個介面」：`Fly extends Bird, Airplane`，代表 `Fly` 同時繼承了 `Bird` 和 `Airplane` 的規範，再加上自己定義的 `pediaFly()`。

【預期結果】
`InfoFly implements Fly`，因此必須實作三個方法：`birdFly()`、`airplaneFly()`（繼承來的）、`pediaFly()`（`Fly` 自己定義的）。執行後三個方法各自印出對應的訊息。

【補充說明】
這也呼應了上一頁的規則：權力越大（繼承的介面越多），責任也越大（要實作的方法越多）。
-->
---

# 類別實作多個介面

若多個介面有相同方法名稱，**實作一次即可**：

```java
interface Bird { void flying(); }
interface Airplane { void flying(); }
class Fly implements Bird, Airplane {
    @Override
    public void flying() {
        System.out.println("飛翔中");
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 實作多個介面時，須重新定義<b>所有父介面的抽象方法</b>
</div>

<!--
【概念定義】
如果一個類別實作的多個介面裡，剛好有「名稱相同的抽象方法」，這個方法只需要實作「一次」就好——因為這些方法都還只是「規範」，沒有任何實作內容，所以不會互相衝突。

【生活化比喻】
這就像兩位師父都教你一招叫「飛翔」的招式，但因為兩位都只是「口頭規定要會這招」，並沒有各自示範一套不同的打法，所以你只需要練好「一招飛翔」，就同時滿足了兩位師父的要求。
-->
---

# 實作時成員變數名稱衝突

不同介面有相同名稱的成員變數，使用**介面名稱.成員變數**存取：

```java
interface B { int x = 5; }
interface C { int x = 8; }
class A implements B, C {
    public void run() {
        System.out.println(B.x); // 5
        System.out.println(C.x); // 8
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 因為介面成員變數是 <b>public static final</b>，可直接用介面名稱存取，不會產生衝突
</div>

<!--
【情境切入】
剛才提到，方法名稱衝突時實作一次就好——但如果衝突的是「成員變數」呢？`B` 介面有一個常數 `x`，`C` 介面也有一個常數 `x`，`A` 同時實作了兩者，那 `A` 裡面寫 `x`，到底是指哪一個？

【概念定義】
Java 不會讓你只寫 `x`——這樣寫會編譯錯誤，因為連 Java 自己都分不清楚。解法是「報上名號」：寫成 `B.x` 或 `C.x`，明確指定你要的是哪個介面的常數。因為介面的成員變數本質上是 `static`，所以可以直接用「介面名稱.變數名稱」存取。

【生活化比喻】
這就像兩間公司剛好都有一位叫「小明」的員工。當你提到「小明」時，大家會問「你說的是哪間公司的小明？」這時只要說「A 公司的小明」「B 公司的小明」，問題就解決了。
-->
---

# 類別同時繼承類別與實作介面

語法：**`extends` 在前，`implements` 在後**

```java
// class 子類別 extends 父類別 implements 介面名稱
class Pet extends Horse implements Dog {
    @Override
    public void running() {
        System.out.println("寵物在跑");
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 繼承類別（extends）必須排在實作介面（implements）之前，順序不能對調
</div>

<!--
【概念定義】
一個類別可以「同時」繼承一個父類別，又實作一個或多個介面——但語法上有固定的順序：`extends` 一定要寫在 `implements` 前面，不能對調。

【生活化比喻】
可以理解成「先講血緣，再講證照」：你的親生父母（`extends` 的父類別）只能有一個，必須先講；你考到的證照（`implements` 的介面）可以有很多張，排在後面說明。如果順序寫反了，編譯器會直接拒絕，因為這違反了 Java 語法規定的固定順序。
-->
---

# 繼承與實作規則摘要

| 對象 | extends | implements |
| --- | --- | --- |
| 類別 (Class) | 只能繼承**一個**父類別 | 可實作**多個**介面（逗號分隔） |
| 介面 (Interface) | 可繼承**多個**父介面（逗號分隔） | 介面無法實作另一個介面 |

- 語法順序：`class A extends B implements C, D`
- 介面**無法 `new`** 直接建立物件

<!--
【補充說明】
這張表是這一節的總結，建議熟記：類別只能有一個 `extends`，但 `implements` 可以有很多個；介面則相反，`extends` 可以有很多個，但介面之間不能用 `implements`。

⚠️ 易錯點提醒：
語法順序務必記熟：`class A extends B implements C, D`——先 `extends` 一個父類別，再 `implements` 多個介面，順序錯了編譯器不會放過你。
-->
---
layout: default
---

# 🎬 AI 協作時刻：常數改不動、介面繼承衝突怎麼辦？

同學常犯兩個錯：以為介面成員變數可以改值、以為多個父介面衝突時 Java 會自動幫你選一個：

**要用的 Prompt：**

> 我寫了這段 code：
> ```java
> {貼上你的程式碼，例如：
> interface Config { int MAX = 10; }
> class App implements Config {
>     void update() { MAX = 20; } // 這裡編譯錯誤
> }}
> ```
> 編譯器說 MAX 不能被賦值。請幫我解釋為什麼介面裡的成員變數不能修改，
> 以及如果 `B` 介面和 `C` 介面都有同名的 `x`，`class A implements B, C`
> 要怎麼分別取用兩個 `x`，不要直接改我的程式碼，先跟我解釋原因。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>易混淆點：</b> 介面成員變數本質是 <b>public static final</b>，只能讀不能改；多重介面繼承同名成員變數並「不會自動合併」，一定要用「介面名稱.變數名稱」明確指定，否則編譯器直接報錯，不會幫你猜。
</div>

<!--
【操作提示】
可以請同學先自己猜猜看 `MAX = 20` 為什麼會編譯錯誤，再丟給 AI 驗證猜測是否正確，並追問「B.x 跟 C.x 這種寫法，是不是就是進階自學提到的鑽石問題」。

【收斂一句話】
介面成員變數是常數不是變數，同名衝突時要用「介面名稱.變數名稱」講清楚是誰的。
-->
---
layout: default
---

# 練習 3：寬螢幕裝置的多重身分
### 任務說明

設計一套介面繼承與多重實作的結構，模擬「平板電腦」同時具備多種裝置能力：
1. 建立介面 `Phone`，定義抽象方法 `void call()`
2. 建立介面 `Camera`，定義抽象方法 `void takePhoto()`
3. 建立介面 `SmartDevice extends Phone, Camera`，新增抽象方法 `void connectWifi()`
4. 類別 `Tablet implements SmartDevice`，實作全部三個方法
5. 在 `main()` 中建立 `Tablet` 物件，依序呼叫 `call()`、`takePhoto()`、`connectWifi()`

**預期輸出：**
```
平板：撥打電話
平板：拍照
平板：連接 Wi-Fi
```

<!--
【任務鋪陳】
這一節學到，介面之間可以互相繼承，而且一個介面可以繼承多個父介面。這個練習要把「介面繼承多個介面」和「類別實作介面」串在一起：`SmartDevice` 繼承了 `Phone` 和 `Camera`，`Tablet` 再去實作 `SmartDevice`。

【引導思考】
想一想：`Tablet implements SmartDevice`，到底需要實作幾個方法？這些方法分別是從哪裡來的？跟剛才「介面繼承多個介面 — 範例」的 `InfoFly` 案例有什麼相似之處？

【等待與觀察】
給大家 8 分鐘。如果方法數量算錯，回頭數一數 `Phone`、`Camera`、`SmartDevice` 各自定義了幾個抽象方法。
-->
---
layout: default
---

# 練習 3：寬螢幕裝置的多重身分
### 解題提示

1. `Phone` 定義 `call()`，`Camera` 定義 `takePhoto()`
2. `SmartDevice extends Phone, Camera`，新增 `connectWifi()`——子介面繼承了兩個父介面的方法，再加上自己的
3. `Tablet implements SmartDevice` 必須實作三個方法：`call()`、`takePhoto()`、`connectWifi()`
4. `main()` 建立 `Tablet` 物件，依序呼叫三個方法

```java
interface Phone { void call(); }
interface Camera { void takePhoto(); }
interface SmartDevice extends Phone, Camera {
    void connectWifi();
}
class Tablet implements SmartDevice {
    public void call() { System.out.println("平板：撥打電話"); }
    public void takePhoto() { System.out.println("平板：拍照"); }
    public void connectWifi() { System.out.println("平板：連接 Wi-Fi"); }
}
```

<!--
【帶讀解法】
這題的結構跟「介面繼承多個介面 — 範例」的 `Fly extends Bird, Airplane` 一模一樣，只是換成了更貼近生活的裝置情境。`SmartDevice` 就是那個「繼承兩個父介面、再加自己一個方法」的子介面。

💼 業界實務：
這種「組合多個小介面成一個大介面」的設計，在業界叫做「介面組合（Interface Composition）」。比起設計一個包山包海的大介面，先拆成小介面再組合，會讓系統更容易維護與重複利用。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
這一章的概念都學完了，最後用一個綜合練習，把「介面實作」「繼承」「override」全部串起來。
-->
---
layout: default
---

# 練習 4 (綜合)：設計介面階層
### 任務說明

設計一套介面與類別，模擬「跑」的行為：
1. 建立介面 `Runnable`，定義行為方法 `run()`
2. 類別 `Human`、`Car` 都實作 `Runnable`，各自定義不同的跑法
3. `Person` 繼承 `Human`，並重新定義 `run()` 方法
4. 執行後，將三者（Human、Person、Car）的跑法各自列印出來

**預期輸出：**
```
人在路上跑
人在操場上跑
車在公路上跑
```

> ⚠️ **注意：** `Runnable` 與 `java.lang.Runnable`（多執行緒用）名稱相同，在預設套件中宣告自訂 `Runnable` 介面時兩者不會衝突，但實際開發中建議使用不同名稱避免混淆。

<!--
【任務鋪陳】
這是這一章的綜合練習，會用到我們學過的所有概念：類別實作介面（`Human`、`Car` 實作 `Runnable`）、類別繼承（`Person extends Human`），再加上方法 `override`。

【引導思考】
想一想：`Person` 繼承 `Human` 之後，是不是也間接「擁有」了 `Runnable` 這個身分？`Person` 想要不同的跑法，要怎麼處理 `run()` 方法？

【等待與觀察】
給大家 8 分鐘。記得：`Person` 不需要再寫一次 `implements Runnable`，因為它繼承自 `Human`，這個身分已經「附帶」過來了。
-->
---
layout: default
---

# 練習 4 (綜合)：設計介面階層
### 解題提示

1. 定義介面 `Runnable`，加入抽象方法 `run()`
2. `Human` 與 `Car` 分別 `implements Runnable`，各自 Override `run()`
3. `Person extends Human`，Override `run()` 加上自己的行為
4. `main()` 中建立三個物件，分別呼叫各自的 `run()`

```java
interface Runnable {
    void run();
}
class Human implements Runnable {
    public void run() { System.out.println("人在路上跑"); }
}
```

<!--
【帶讀解法】
重點在 `Person extends Human`：`Person` 並沒有再寫一次 `implements Runnable`，因為 `Human` 已經實作過了，這個「會 run()」的能力會隨著繼承一起傳給 `Person`。`Person` 只需要 `override` `run()`，提供自己的版本就好。

⚠️ 小彩蛋：
如果你在實作時發現 Java 內建有一個叫 `java.lang.Runnable` 的介面（用在多執行緒），別緊張——那是另一個東西。這也提醒我們：取名字的時候，撞名也是有可能發生的，實務上建議避開這類常見的內建名稱。
-->
---

# Default 方法（Java 8+）

以前介面只能定義「沒有方法本體」的抽象方法。Java 8 開始，介面可以用 `default` 關鍵字直接提供預設實作：

```java
interface Vehicle {
    String getBrand();
    default void alarmOn() {
        System.out.println("防盜啟動");
    }
    default void alarmOff() {
        System.out.println("防盜關閉");
    }
}
```

- 使用 `default` 關鍵字，介面內**直接提供預設實作**
- 實作類別可直接繼承 Default 方法，也可以 `override`
- Default 方法**可以繼承**，不強制是 abstract

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼需要 Default 方法？</b>為維持向後相容性，舊介面可以新增方法，不破壞已有的實作類別。這是 <code>List.sort()</code>、<code>Comparator.thenComparing()</code> 等現代 API 大量採用的設計。
</div>

<!--
【情境切入】
想像你維護一個有 100 萬個專案在用的介面，今天你想幫它加一個新方法。如果直接加成抽象方法，那 100 萬份程式碼會在編譯時全部報錯，因為沒人實作這個新方法。

【概念定義】
「Default 方法」就是介面裡可以直接寫好方法本體、提供預設實作的方法，用 `default` 關鍵字標示。實作類別不寫也沒關係，會自動繼承這個預設版本；想客製化的話，照樣可以 `override`。

【生活化比喻】
這就像房東幫每個房間都裝了「預設家具」。你搬進去（實作介面）不需要自己添購，直接用就好；如果不喜歡，再自己換掉（覆寫）即可。

⚠️ 易錯點提醒：
不要以為加了 `default` 之後，這個方法就「強制」是預設值不能改。實作類別如果想要不同的防盜邏輯，照樣可以 `override` 掉，default 只是「不寫就有得用」的保險機制。
-->

---

# Default 方法 — 範例

```java
class Car implements Vehicle {
    private String brand;
    Car(String b) { this.brand = b; }
    public String getBrand() { return brand; }
    // alarmOn / alarmOff 直接繼承自 Vehicle，不需重寫
}
public class Demo {
    public static void main(String[] args) {
        Car car = new Car("Toyota");
        car.alarmOn();   // 防盜啟動
        car.alarmOff();  // 防盜關閉
    }
}
```

<!--
【帶讀範例】
這段範例的目的，是看看 `Car` 類別在「什麼都沒寫」的情況下，怎麼用到 `alarmOn()` 和 `alarmOff()`。`Car` 只老老實實地實作了自己必須負責的 `getBrand()`，剩下兩個方法是天上掉下來的禮物。

【預期結果】
執行後會印出「防盜啟動」和「防盜關閉」——即使 `Car` 類別裡完全沒有這兩個方法的程式碼。

💼 業界實務：
這個設計徹底改變了 Java 介面的角色。以前如果想共用一段邏輯，常常得另外設計一個抽象類別、再 `extends`；現在直接寫在介面裡，省掉一層繼承關係。想深入了解 Static/Private 方法、多重繼承衝突與鑽石問題，可以參考進階自學內容。
-->

---
layout: default
---

# 🎬 AI 協作時刻：Default 方法為什麼會被加進 Java？

Default 方法是 Java 8 對介面最大的一次改造，也是面試官愛問的「Java 8 有什麼新特性」標準答案之一：

**要用的 Prompt：**

> 請用「圖書館規則」或其他生活化比喻，解釋 Java 8 為什麼要
> 幫介面加上 default 方法（提示：想像介面已經有一百萬個實作類別，
> 突然要新增一個方法會發生什麼事）。
> 100 字以內，說明「向後相容」這個詞的意思。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>面試延伸：</b> 如果被追問「一個類別同時實作兩個介面，兩個介面有同名的 default 方法怎麼辦」，那就是進階自學會提到的「鑽石問題」，值得先跟 AI 討論看看可能的解法。
</div>

<!--
【操作提示】
可以順勢帶到：如果同學已經很有把握，可以現場追問 AI「鑽石問題怎麼解」，看看 AI 的解釋跟自學教材是否一致。

【收斂一句話】
default 方法讓介面「先斬後奏」也不會破壞舊程式碼，這就是向後相容的精神。
-->

---

# 總結

- **介面描述「有某種能力」（CAN-DO），不是「屬於哪一類」（IS-A）** — 讓不相關的類別共享同一種行為
- **介面方法預設是 `public abstract`，成員變數預設是 `public static final`** — 這兩組修飾詞都可以省略不寫
- **類別用 `implements` 實作介面，可以實作多個**；介面用 `extends` 繼承介面，也可以繼承多個
- **同時繼承類別又實作介面時，`extends` 要寫在 `implements` 前面** — `class A extends B implements C, D`
- **成員變數同名時要用「介面名稱.變數名稱」存取**，避免衝突
- **Java 8 起介面可以有 `default` 方法**，直接提供預設實作，實作類別不寫也能用，也能自行 override，是為了向後相容

<!--
我們把這一章整理成六個重點。

第一，介面描述的是「有某種能力」，不是「屬於哪一類」——這是介面跟繼承最根本的差異，也是這一章開頭反覆強調的觀念。

第二，介面裡的方法預設是 public abstract，成員變數預設是 public static final，這兩組關鍵字都可以省略不寫，但底層規則是固定的。

第三，一個類別可以用 implements 同時實作多個介面；介面之間也可以用 extends 互相繼承，而且可以繼承多個父介面。

第四，如果一個類別同時要繼承類別又要實作介面，語法順序是固定的：extends 一定要寫在 implements 前面。

第五，當不同介面有相同名稱的成員變數時，因為都是 static，可以用「介面名稱.變數名稱」明確指定要用哪一個，避免衝突。

第六，Java 8 開始介面可以有 default 方法，直接在介面裡寫好預設實作，實作類別不寫也能直接用，需要客製化時照樣可以 override，這個設計是為了讓舊介面新增方法時不會破壞已有的實作類別。

這六點加起來，就是介面的完整概念。下一章我們要繼續往下走了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【收尾】
今天我們從「介面是什麼」開始，學到介面的語法、跟抽象類別的比較、介面裡的成員變數、介面之間與類別與介面之間的各種繼承與實作組合，最後是 Default 方法。想深入 Static/Private 方法、鑽石問題、Sealed Interfaces，可以參考進階自學內容。

【核心帶走重點】
1. 介面描述的是「能力」，不是「身分」——這是介面跟繼承最根本的差異。
2. 介面裡的方法預設是 `public abstract`，成員變數預設是 `public static final`。
3. 一個類別可以實作多個介面；一個介面也可以繼承多個介面。
4. `class A extends B implements C, D`——順序固定，先血緣再證照。

如果你想知道介面還能玩出什麼花樣（像是 Java 8 之後介面也能有「預設實作」），自學內容裡有更進階的主題等著你！
-->
---
layout: end
---

# 課程結束
### 介面定義行為契約，多重繼承讓設計更靈活

<!--
[依脈絡推斷]
下課！記住：介面就是你跟其他類別之間的「合約」。只要你 `implements` 了它，就要負責把合約上規定的事情做到。我們下章見！
-->
