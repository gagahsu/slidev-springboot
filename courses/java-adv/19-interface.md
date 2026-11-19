---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Java 介面 (Interface)（進階／自學）
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
    介面 (Interface)（進階／自學）
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「定義行為契約，讓不同類別共享相同的能力」── 進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到介面的「自學深水區」。基礎班我們已經學完了介面的基本語法、成員變數、怎麼讓一個類別實作多個介面，以及 Default 方法。這份內容是進階加碼，獻給有餘力、想把介面摸到底的同學。

【為什麼要學這個】
基礎課學過 Default 方法讓介面能提供預設實作，這裡要再加上 Static、Private 方法，幾乎變成半個類別。學會這些，你才能看懂現代 Java 框架（像 Spring）裡那些介面到底在玩什麼花樣，也才能應付「鑽石問題」這種面試常客。

【學完你會能做什麼】
學完這份內容，你會知道介面可以當工具箱用、可以藏私房邏輯；遇到多重繼承衝突時，你會知道怎麼用 `介面名稱.super.方法()` 排解糾紛；最後還會認識 Java 17 的 Sealed Interfaces，學會怎麼把介面的擴充權限鎖死。
-->
---
layout: default
---

# Outline

- **Java 8 新增介面內容複習與 Static 方法** — Default 方法（基礎課已學過）、Static 方法、Functional Interface
- **Java 9 新增介面內容** — Private 方法
- **Default 方法衝突與解決** — 多重繼承衝突、`介面.super`
- **鑽石 (Diamond) 問題**
- **密封介面 (Sealed Interfaces)** — JDK 17

<!--
【帶讀大綱】
這份自學內容分成四大塊。前兩塊是「Java 8、9 幫介面加了什麼新功能」；第三塊是「這些新功能用多了之後，會撞出什麼衝突、怎麼解」；第四塊則是 Java 17 的密封介面，算是介面家族最新的成員。

【重點預告】
如果你只能挑一個重點，那就是 default 方法。它是後面所有進階主題（衝突、鑽石問題、super 呼叫）的源頭，搞懂它，後面的內容就會像在拆解一連串的骨牌一樣，一個一個倒下去都很合理。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Java 8 新增介面內容

<!--
【段落轉換】
先複習一下基礎班學過的：介面原本只能寫「沒有方法本體」的抽象方法，像是開了一張空頭支票，規定別人要做什麼，但自己什麼都不做。

【承接到本節主題】
接下來要看的是 Java 8 的重大革新——介面終於可以自己「動手做」了。這讓介面從一張空頭支票，變成附帶「使用說明書」與「免費工具」的證照。
-->
---
layout: default
---

# Java 8 新增介面內容 — 概覽

| 功能 | Java 版本 | 說明 |
| --- | --- | --- |
| Constant variable | 自 Java 1.0 即有 | 常數成員變數 |
| Abstract methods | 自 Java 1.0 即有 | 抽象方法 |
| **Default methods** | **Java 8 新增** | 預設方法（有方法本體） |
| **Static methods** | **Java 8 新增** | 靜態方法 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼新增 Default 方法？</b>為維持向後相容性，舊介面可以新增方法，不破壞已有的實作類別
</div>

<!--
【情境切入】
想像你維護一個有 100 萬個專案在用的介面，今天你想幫它加一個新方法。如果直接加成抽象方法，那 100 萬份程式碼會在編譯時全部報錯，因為沒人實作這個新方法——這 100 萬個工程師等於同時被你坑了。

【概念定義】
「Default 方法」就是介面裡可以直接寫好方法本體、提供預設實作的方法，用 `default` 關鍵字標示。實作類別不寫也沒關係，會自動繼承這個預設版本；想客製化的話，照樣可以 `override`。

【生活化比喻】
這就像房東幫每個房間都裝了「預設家具」。你搬進去（實作介面）不需要自己添購，直接用就好；如果不喜歡，再自己換掉（覆寫）即可。

💼 業界實務：
這張表也告訴我們，Static 方法是跟 Default 方法同一批（Java 8）一起來的，等一下會看到它是用來幹什麼的。
-->
---

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>複習：</b>Default 方法的語法與用途已在基礎課教過（介面內用 <code>default</code> 提供預設實作，可被覆寫）。接下來看同批推出的 Static 方法。
</div>

---

# Static 方法

```java
interface MathUtils {
    static int add(int a, int b) {
        return a + b;
    }
    static int multiply(int a, int b) {
        return a * b;
    }
}
```

- 在介面中定義 `static` 方法
- **只能用介面名稱呼叫**，不能透過物件呼叫
- 實作類別**無法 override** static 方法

<!--
【情境切入】
有時候我們想寫一些「跟某個介面相關，但不需要任何實例就能用」的工具方法，例如數學運算。以前的做法是另外開一個 `XxxUtils` 類別，但這樣會讓相關的程式碼散落各處。

【概念定義】
「Static 方法」是介面裡用 `static` 標示、可以直接呼叫的方法，概念跟類別的 static 方法一樣：不需要 `new` 出物件，直接用「介面名稱」呼叫。

⚠️ 易錯點提醒：
千萬不要寫 `obj.add(3, 5)`。Static 方法不屬於任何實例，必須寫成 `MathUtils.add(3, 5)`。而且實作類別也沒辦法 `override` 它——它就是固定在介面上的工具，不會因為實作類別不同而改變。
-->
---

# Static 方法 — 範例

```java
public class Demo {
    public static void main(String[] args) {
        int sum = MathUtils.add(3, 5);
        int product = MathUtils.multiply(4, 6);
        System.out.println("加法：" + sum);
        System.out.println("乘法：" + product);
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記住：</b>Static 方法只能用「<code>介面名稱.方法名稱()</code>」呼叫，無法用物件呼叫
</div>

<!--
【帶讀範例】
這段範例的目的，是示範 static 方法的標準呼叫方式：`MathUtils.add(3, 5)`、`MathUtils.multiply(4, 6)`，感覺就像在用一個全域函數，但其實它是被包在 `MathUtils` 這個介面裡的。

【預期結果】
執行後會印出「加法：8」「乘法：24」。

💼 業界實務：
以後如果你有一組跟某個介面密切相關的工具方法（例如跟 `Comparator` 相關的小工具），可以考慮直接寫在那個介面的 static 區塊，而不是另外開一個 `XxxUtils` 類別——這在設計上叫「高內聚」。
-->
---

# 功能介面 (Functional Interface)

| 特性 | 說明 |
| --- | --- |
| 定義 | 只有**一個**抽象方法的介面（又稱 SAM - Single Abstract Method） |
| 註解 | `@FunctionalInterface`（選用，但建議加上以利檢查） |

```java
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);
    // 可以有 default 或 static 方法，但只能有一個 abstract 方法
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>主要用途：</b> 作為 Lambda 運算式的目標類型，簡化匿名內部類別的撰寫。
</div>

<!--
【情境切入】
以前如果要把「一段行為」當作參數傳給另一個方法，得寫一整段匿名內部類別，看起來又臭又長。Java 8 引入 Lambda 來簡化這件事，但 Lambda 要對應到「哪個介面、哪個方法」，總得有個規則。

【概念定義】
「Functional Interface（功能介面）」是只有一個抽象方法（SAM）的介面。因為只有一個方法，Java 才能確定一段 Lambda 表達式對應的就是這個方法，不會搞混。`@FunctionalInterface` 是一個輔助註解，如果你不小心加了第二個抽象方法，編譯器會立刻提醒你。

💼 業界實務：
如果你寫了一個 functional interface 卻沒加 `@FunctionalInterface`，程式照樣能跑，但少了這個註解，等於少了編譯器幫你把關的一道保險。
-->
---

# 內建功能介面 (一) — 基本型別

`java.util.function` 套件提供常用的功能介面，可直接搭配 Lambda 使用：

| 介面 | 抽象方法 | 說明 |
| --- | --- | --- |
| `Predicate<T>` | `boolean test(T t)` | 傳入一個值，回傳 true/false 判斷 |
| `Function<T,R>` | `R apply(T t)` | 傳入 T，轉換為 R 回傳 |
| `Consumer<T>` | `void accept(T t)` | 傳入一個值，執行動作不回傳 |
| `Supplier<T>` | `T get()` | 不傳入參數，產生一個 T |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 這四個介面皆標有 <code>@FunctionalInterface</code>，可直接用 Lambda 或方法參考（Method Reference）傳入
</div>

<!--
【概念定義】
這四個是 `java.util.function` 套件裡最常見的 functional interface，各自代表一種「行為的形狀」：
- `Predicate<T>`：丟進去一個值，回答「對不對」（true/false）
- `Function<T,R>`：丟進去一種型態，換回另一種型態
- `Consumer<T>`：丟進去一個值，「吃掉」它去做事，不回傳結果
- `Supplier<T>`：什麼都不丟，直接「生出」一個值

【生活化比喻】
可以把它們想成生活中四種角色：`Predicate` 像是檢查站的關卡（過或不過）、`Function` 像是翻譯機（輸入一種語言，輸出另一種）、`Consumer` 像是垃圾桶（東西進去就處理掉，不回應）、`Supplier` 像是提款機（不用放東西進去，直接給你輸出）。

💼 業界實務：
這四個介面是 Stream API 的地基，後面（ch26）會大量用到它們。先在這裡認識它們的「形狀」，之後學 Stream 會輕鬆很多。
-->
---

# 內建功能介面 (一) — 範例

```java
Predicate<String> isLong = s -> s.length() > 5;
System.out.println(isLong.test("炭治郎"));         // false
System.out.println(isLong.test("Kamado Tanjiro")); // true

Function<String, Integer> toLen = String::length;
System.out.println(toLen.apply("鬼滅之刃")); // 4

Consumer<String> print = System.out::println;
print.accept("禰豆子"); // 禰豆子

Supplier<String> hero = () -> "炭治郎";
System.out.println(hero.get()); // 炭治郎
```

<!--
【帶讀範例】
這段範例的目的，是讓四個功能介面各自跑一次：`isLong` 檢查字串長度是否超過 5（`Predicate`）、`toLen` 把字串轉成它的長度（`Function`）、`print` 把字串印出來（`Consumer`）、`hero` 不需要輸入就能生出一個字串（`Supplier`）。

【預期結果】
依序印出 `false`、`true`、`4`、`禰豆子`、`炭治郎`。

⚠️ 易錯點提醒：
注意 `String::length` 和 `System.out::println` 這種寫法叫「方法參考（Method Reference）」。它等同於 `s -> s.length()` 和 `s -> System.out.println(s)`，只是更精簡。第一次看到 `::` 不用緊張，把它當成「直接把現成方法接過來用」就好。
-->
---

# 內建功能介面 (二) — Bi 系列與 Operator

| 介面 | 抽象方法 | 說明 |
| --- | --- | --- |
| `BiFunction<T,U,R>` | `R apply(T t, U u)` | 兩個不同型別輸入，一個輸出 |
| `UnaryOperator<T>` | `T apply(T t)` | 繼承 Function，輸入輸出型別相同 |
| `BinaryOperator<T>` | `T apply(T t1, T t2)` | 繼承 BiFunction，兩輸入同型別 |

```java
BiFunction<String, Integer, String> repeat = (s, n) -> s.repeat(n);
System.out.println(repeat.apply("鬼", 3)); // 鬼鬼鬼

UnaryOperator<String> upper = String::toUpperCase;
System.out.println(upper.apply("tanjiro")); // TANJIRO

BinaryOperator<Integer> max = (a, b) -> a > b ? a : b;
System.out.println(max.apply(10, 20)); // 20
```

<!--
【概念定義】
這三個是上一頁四大天王的「進階版」。`Bi` 開頭代表「兩個輸入」；`UnaryOperator` 是輸入輸出型態相同的 `Function`；`BinaryOperator` 是輸入輸出型態相同的 `BiFunction`。

【帶讀範例】
這段範例的目的，是示範三種用法：`repeat` 把字串重複 n 次（`BiFunction`）、`upper` 把字串轉大寫（`UnaryOperator`，輸入輸出都是 `String`）、`max` 取兩個整數中較大者（`BinaryOperator`，輸入輸出都是 `Integer`）。

【預期結果】
依序印出 `鬼鬼鬼`、`TANJIRO`、`20`。

💼 業界實務：
在 Stream API 裡，這些介面會大量出現在 `reduce`、`map` 等操作中。先記住它們的「型態形狀」，之後寫 Stream 時就不會卡在「這個 Lambda 應該對應哪個介面」。
-->
---
layout: default
---

# 練習 1：自訂功能介面與工具方法
### 任務說明

設計一個介面，結合 default、static 與 Functional Interface 的用法：
1. 建立 `@FunctionalInterface` 介面 `Discountable`，定義抽象方法 `double discount(double price)`
2. 在 `Discountable` 中加入一個 `default` 方法 `printPrice(double price)`，印出「優惠後價格：xxx」
3. 在 `Discountable` 中加入一個 `static` 方法 `Discountable noDiscount()`，回傳一個「原價不變」的 `Discountable`（用 Lambda 實作）
4. 在 `main()` 中：
   - 用 Lambda 建立一個「打 8 折」的 `Discountable`，計算 1000 元打折後價格並用 `printPrice` 印出
   - 呼叫 `Discountable.noDiscount()`，計算 1000 元的價格並印出

**預期輸出：**
```
優惠後價格：800.0
優惠後價格：1000.0
```

<!--
【任務鋪陳】
剛才我們看到介面可以有 default 方法（提供預設行為）、static 方法（當工具箱用），也可以是 Functional Interface（給 Lambda 用）。這個練習要把三者放在同一個介面裡，體會它們各自的角色。

【引導思考】
想一想：`discount` 是「每個折扣方案都不一樣」的部分，所以它是抽象方法；`printPrice` 是「不管折扣方案是什麼，印法都一樣」的部分，所以適合做成 default；`noDiscount` 是「跟特定實例無關，介面本身就能提供」的工具，適合做成 static。

【等待與觀察】
給大家 8 分鐘。如果卡在 `static` 方法怎麼回傳一個 Lambda，提示一下：把 Lambda 直接 `return` 出去就好，型態就是 `Discountable`。
-->
---
layout: default
---

# 練習 1：自訂功能介面與工具方法
### 解題提示

1. `Discountable` 介面：一個抽象方法 `discount`，一個 default 方法 `printPrice`，一個 static 方法 `noDiscount`
2. `noDiscount()` 內部直接 `return price -> price;`，代表「輸入多少、回傳多少」
3. 折扣 8 折的 Lambda：`price -> price * 0.8`
4. 呼叫方式：`Discountable eightyPercent = price -> price * 0.8;`，再用 `eightyPercent.printPrice(1000)`

```java
@FunctionalInterface
interface Discountable {
    double discount(double price);
    default void printPrice(double price) {
        System.out.println("優惠後價格：" + discount(price));
    }
    static Discountable noDiscount() {
        return price -> price;
    }
}
```

<!--
【帶讀解法】
重點在 `noDiscount()` 這個 static 方法：它回傳的 `price -> price` 其實就是一個「什麼都不做」的 `Discountable` 實例，因為 `Discountable` 只有一個抽象方法，所以這個 Lambda 自動就符合它的形狀。

⚠️ 小提醒：
`printPrice` 裡呼叫 `discount(price)`，這個 `discount` 在 default 方法被定義的當下還是「未知」的——它會在執行時，依照你傳進來的是哪個 Lambda 而決定行為。這就是 default 方法「先寫好框架，細節留給之後」的威力。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Java 9 新增介面內容

<!--
【段落轉換】
Java 8 讓介面可以有 default 和 static 方法之後，馬上就冒出一個新問題：如果兩個 default 方法裡有重複的程式碼，要怎麼共用？

【承接到本節主題】
Java 9 補上了最後一塊拼圖——private 方法。介面終於可以擁有「只給自己用的私房邏輯」，不必再被迫把內部細節暴露給外面。
-->
---
layout: default
---

# Java 9 新增介面內容 — 概覽

| 功能 | Java 版本 | 說明 |
| --- | --- | --- |
| Constant variable | 自 Java 1.0 即有 | 常數成員變數 |
| Abstract methods | 自 Java 1.0 即有 | 抽象方法 |
| Default methods | Java 8+ | 預設方法 |
| Static methods | Java 8+ | 靜態方法 |
| **Private methods** | **Java 9 新增** | 私有方法 |
| **Private Static methods** | **Java 9 新增** | 私有靜態方法 |

<!--
【情境切入】
想像一個介面裡有兩個 default 方法，各自要做「驗證輸入格式」這件事，邏輯一模一樣。在 Java 9 之前，你只能把這段程式碼複製貼上兩次，或是另外開一個 helper 類別——但這個 helper 類別其實只有這個介面自己會用到，暴露出去反而奇怪。

【概念定義】
「Private 方法」讓介面內部的程式碼可以重複利用，但完全不對外公開——外部類別、實作類別都呼叫不到它。這張表也是這份自學內容對「介面成員」的完整盤點：從常數、抽象方法，一路到 Java 9 的 private 方法，介面已經幾乎是個「不能被 `new` 的類別」了。
-->
---
layout: default
---

# Private 方法的規則

| 規則 | 說明 |
| --- | --- |
| 只能在介面內使用 | 無法從實作類別或外部呼叫 |
| 不能抽象化 | 必須有方法本體 |
| `private static` 方法 | 可在 static 和 non-static 方法中使用 |
| `private` non-static 方法 | 不能在 `private static` 方法中使用 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>設計目的：</b>讓介面內部程式碼可重複使用，避免在多個 Default 方法中寫重複邏輯
</div>

<!--
【概念定義】
這張表是 private 方法的使用規則，核心精神跟類別裡的 static / non-static 規則一樣：「靜態的東西不能呼叫非靜態的東西」。`private static` 方法因為跟實例無關，可以被介面裡任何方法（static 或 non-static）呼叫；但 `private` non-static 方法因為依附在實例上，不能被 `private static` 方法呼叫。

【生活化比喻】
可以把介面想成一間有「對外櫃台」（default / static 公開方法）和「員工專用辦公室」（private 方法）的店面。客人（實作類別、外部程式碼）只能在櫃台辦事，看不到辦公室裡發生什麼事；但櫃台人員可以隨時進辦公室拿資料出來用。

⚠️ 易錯點提醒：
最容易搞混的就是「static 不能呼叫 non-static」這條天條，介面也不例外。等一下的範例會清楚示範這個限制。
-->
---

# Private 方法 — 範例

```java
interface LearnJava {
    default void method2() { method4(); }
    static void method3() { method5(); }
    private void method4() {
        System.out.println("這是private方法");
    }
    private static void method5() {
        System.out.println("這是private static方法");
    }
}
```

<!--
【帶讀範例】
這段範例的目的，是示範 private 方法怎麼被介面內部其他方法呼叫：`method2()`（default）呼叫了 `method4()`（private），`method3()`（static）呼叫了 `method5()`（private static）。

【預期結果】
如果某個類別實作 `LearnJava` 並呼叫 `method2()`，會印出「這是private方法」；呼叫 `LearnJava.method3()` 會印出「這是private static方法」。但無論如何，外部都無法直接呼叫 `method4()` 或 `method5()`——它們對外是「不存在」的。

⚠️ 易錯點提醒：
注意 `method3()` 是 static，它只能呼叫 `method5()`（也是 static）；如果你讓 `method3()` 去呼叫 `method4()`（non-static），編譯器會直接報錯，因為 static 方法的世界裡沒有「我」（this）這個概念，無法去呼叫一個依附在實例上的方法。
-->
---
layout: default
---

# 練習 2：用 Private 方法重構 Default 方法
### 任務說明

設計一個介面 `ReportPrinter`，模擬報表列印前的「資料驗證」邏輯重複出現的情境：
1. 定義介面 `ReportPrinter`，包含抽象方法 `String getData()`
2. 加入兩個 `default` 方法 `printSummary()` 與 `printDetail()`，兩者都需要先「驗證資料不為空」才能印出內容
3. 把「驗證資料不為空」抽成一個 `private` 方法 `validate()`，讓 `printSummary()` 與 `printDetail()` 共用
4. 撰寫一個類別 `SalesReport implements ReportPrinter`，`getData()` 回傳 `"銷售報表內容"`，並在 `main()` 中分別呼叫 `printSummary()` 與 `printDetail()`

**預期輸出（資料不為空時）：**
```
摘要：銷售報表內容
明細：銷售報表內容
```

<!--
【任務鋪陳】
剛剛我們看到 private 方法的用途是「讓多個 default 方法共用邏輯」。這個練習就是要你親手做一次：兩個 default 方法都需要「先驗證資料」，把這段重複邏輯抽出來。

【引導思考】
想一想：`validate()` 該怎麼設計？它不需要回傳值給外部用，也不需要被 `SalesReport` 看到，所以最適合宣告成 private。`printSummary()` 和 `printDetail()` 在印出內容之前，都先呼叫一次 `validate()`。

【等待與觀察】
給大家 8 分鐘。如果 `validate()` 寫成 static 也沒關係，但想一想：它需不需要呼叫 `getData()`（non-static）？如果需要，那它就不能是 static。
-->
---
layout: default
---

# 練習 2：用 Private 方法重構 Default 方法
### 解題提示

1. `validate()` 宣告為 `private`（non-static），因為它需要呼叫 `getData()`（non-static 抽象方法）
2. `printSummary()` 與 `printDetail()` 都先呼叫 `validate()`，再印出對應內容
3. `SalesReport` 只需要實作 `getData()`，`printSummary()`、`printDetail()` 直接繼承自介面

```java
interface ReportPrinter {
    String getData();
    private void validate() {
        if (getData() == null || getData().isEmpty()) {
            throw new IllegalStateException("資料為空");
        }
    }
    default void printSummary() {
        validate();
        System.out.println("摘要：" + getData());
    }
}
```

<!--
【帶讀解法】
重點在 `validate()` 這個 private 方法：它呼叫了 `getData()`，而 `getData()` 是一個「抽象方法」，意味著 `validate()` 在被寫下來的當下根本不知道資料從哪裡來——這份知識要等到實作類別（`SalesReport`）出現才會補齊。

💼 業界實務：
這正是 private 方法最常見的用途：把「共用的前置檢查」抽出來，讓多個 default 方法都先過一道關卡再執行，避免每個 default 方法都各寫一次同樣的檢查邏輯。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Default 方法衝突與解決

<!--
【段落轉換】
有了 default 方法之後，原本「介面只是規則、不會打架」的世界開始變得熱鬧。當一個類別同時實作多個介面，而這些介面又有同名的 default 方法時，麻煩就來了。

【承接到本節主題】
這一節要處理的就是這些「衝突場景」：default 方法同名、繼承鏈裡同名方法該聽誰的，最後再正式介紹大名鼎鼎的「鑽石問題」。

💡 補充提醒：
基礎班已經學過「成員變數同名衝突」的處理方式（用 `介面名稱.變數名稱` 存取）。接下來要看的是更棘手的「方法」同名衝突——因為方法不像變數，沒辦法簡單地「掛名」存取就解決。
-->
---

# 類別重新定義 Default 方法

| 情況 | 解決方法 |
| --- | --- |
| 實作一個介面，想改變 Default 行為 | 直接 `override` |
| 實作多個有**相同** Default 方法名稱的介面 | **必須 `override`**，否則編譯錯誤 |
| 需要呼叫特定介面的 Default 方法 | `介面名稱.super.方法名稱()` |

<!--
【情境切入】
剛才成員變數的衝突，靠「介面名稱.變數」就解決了。但如果衝突的是 default 方法呢？方法不像變數，不能簡單地說「我要呼叫 B 的這個版本」就結束——因為這個方法可能還會被別人呼叫到。

【概念定義】
規則很直接：如果一個類別實作了兩個介面，而這兩個介面有「同名的 default 方法」，Java 不會自動幫你選一個——它會強制你 `override` 這個方法，自己決定最終行為。如果你想在這個 `override` 裡面，仍然借用某個介面原本的 default 邏輯，可以用 `介面名稱.super.方法名稱()` 呼叫。

【生活化比喻】
這就像你同時跟兩位師父學「跑步」這招，兩位教的方式不一樣。師父們不會替你決定要學誰的，而是要求你自己站出來，示範一個「你自己的版本」——你可以選擇只用其中一招，也可以把兩招都用上。
-->
---

# 類別重新定義 Default 方法 — 範例

```java
interface Dog { default void running() { System.out.println("狗在跑"); } }
interface Cat { default void running() { System.out.println("貓在跑"); } }
class Pet implements Dog, Cat {
    @Override
    public void running() {
        Dog.super.running();
        Cat.super.running();
    }
}
```

<!--
【帶讀範例】
這段範例的目的，是示範當 `Dog` 和 `Cat` 兩個介面都有 `running()` 這個 default 方法時，`Pet implements Dog, Cat` 該怎麼處理。如果 `Pet` 不寫 `override`，編譯器會直接報錯。

【預期結果】
`Pet` 的 `running()` 會依序印出「狗在跑」和「貓在跑」——因為 `override` 之後的版本裡，分別用 `Dog.super.running()` 和 `Cat.super.running()` 把兩邊的邏輯都呼叫了一次。

⚠️ 易錯點提醒：
`Dog.super.running()` 這個語法第一次看會覺得很陌生，但拆開來看：`Dog.super` 表示「`Dog` 這個介面原本（未被覆寫前）的版本」，`.running()` 就是呼叫那個版本的方法。它跟一般類別繼承用的 `super.方法()` 概念類似，只是多了「指定哪個介面」這一步。
-->
---

# 繼承父類別與實作介面方法名稱衝突

當父類別與實作的介面有相同方法名稱，**父類別方法的優先順序較高**：

```java
interface Dog { default void running() { System.out.println("介面跑"); } }
class Horse { public void running() { System.out.println("馬在跑"); } }
class Pet extends Horse implements Dog { }
// Pet.running() → 執行 Horse 的 running()，父類別方法優先
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 優先順序：<b>子類別自訂 &gt; 繼承的父類別方法 &gt; 介面 Default 方法</b>
</div>

<!--
【情境切入】
如果衝突發生在「父類別的方法」和「介面的 default 方法」之間呢？例如 `Pet extends Horse implements Dog`，而 `Horse` 和 `Dog` 都有 `running()`，這次 `Pet` 連 `override` 都沒寫，Java 會聽誰的？

【概念定義】
這次 Java 有明確的優先順序：「子類別自己寫的 > 繼承的父類別方法 > 介面的 default 方法」。也就是說，只要父類別已經提供了具體實作，介面的 default 方法就會被「自動忽略」，不需要你額外處理。

【生活化比喻】
這叫「血濃於水」。如果你的親生父母（父類別）已經教過你一套招式，而你的某張證照（介面）也內建了一套「預設教學」，Java 會優先尊重血緣關係——親人教的，比證照附的說明書更優先。這個設計讓「幫舊類別加上新介面」這件事變得更安全：不會因為介面多了一個 default 方法，就悄悄改變了原本類別的行為。
-->
---

# 多層次繼承中 Default 方法名稱相同

父子介面都有同名 Default 方法時，執行**子介面**的版本：

```java
interface Animal {
    default void running() { System.out.println("動物跑"); }
}
interface Dog extends Animal {
    default void running() { System.out.println("狗在跑"); }
}
class Pet implements Dog { }
// Pet.running() → 執行 Dog.running()（子介面覆蓋父介面）
```

<!--
【情境切入】
還有一種情況：衝突不是發生在「兩個平行的介面」之間，而是「父介面與子介面」之間。`Animal` 有 `running()`，它的子介面 `Dog extends Animal` 也定義了一個同名的 `running()`，那 `implements Dog` 的類別會執行哪一個？

【概念定義】
規則很自然：執行「子介面」的版本。因為子介面 `extends` 父介面時，等於宣告了「我要用我自己這套更具體的版本，取代父介面那套比較籠統的版本」——這跟類別繼承中子類別 `override` 父類別方法的邏輯是一致的。

【生活化比喻】
可以想成：祖師爺定了一套「基本跑法」，弟子在這基礎上發展出「進階跑法」並正式收錄成自己的教材。後輩學的是弟子那套教材（子介面），自然就以弟子的版本為準，而不是回頭去翻祖師爺最早的那版。
-->
---
layout: default
---

# 練習 3：解決多重介面的 Default 衝突
### 任務說明

設計一套介面，模擬「員工同時具備兩種職能」時的行為衝突：
1. 建立介面 `Trainer`，定義 `default void greet()`，印出「教練：開始上課！」
2. 建立介面 `Receptionist`，定義 `default void greet()`，印出「櫃台：歡迎光臨！」
3. 類別 `StaffMember` 同時實作 `Trainer` 與 `Receptionist`
4. `override` `greet()`，依序呼叫 `Trainer` 與 `Receptionist` 各自的版本

**預期輸出：**
```
教練：開始上課！
櫃台：歡迎光臨！
```

<!--
【任務鋪陳】
剛才看過 `Dog` 和 `Cat` 都有 `running()` 的例子，這次換成更貼近職場的情境：一個員工身兼「教練」與「櫃台」兩種職能，這兩種職能都有「打招呼」的 default 行為，但內容不一樣。

【引導思考】
想一想：`StaffMember implements Trainer, Receptionist`，如果不處理 `greet()` 的衝突，編譯器會怎麼反應？你需要用什麼語法分別呼叫兩個介面各自的 `greet()`？

【等待與觀察】
給大家 6 分鐘。提示一下：這跟剛剛 `Dog.super.running()` 的寫法完全一樣，只是換了介面名稱。
-->
---
layout: default
---

# 練習 3：解決多重介面的 Default 衝突
### 解題提示

1. `StaffMember implements Trainer, Receptionist`，兩者皆有 `greet()`，必須 `override`
2. 在 `override` 的 `greet()` 中，依序呼叫 `Trainer.super.greet()` 與 `Receptionist.super.greet()`
3. `main()` 中建立 `StaffMember` 物件並呼叫一次 `greet()`，即可看到兩段輸出

```java
interface Trainer {
    default void greet() { System.out.println("教練：開始上課！"); }
}
interface Receptionist {
    default void greet() { System.out.println("櫃台：歡迎光臨！"); }
}
class StaffMember implements Trainer, Receptionist {
    @Override
    public void greet() {
        Trainer.super.greet();
        Receptionist.super.greet();
    }
}
```

<!--
【帶讀解法】
跟 `Dog.super.running()` 的範例幾乎一模一樣，差別只在介面名稱和方法內容。這也是為什麼要熟悉 `介面名稱.super.方法名稱()` 這個語法——它是處理 default 方法衝突的「萬用鑰匙」。

⚠️ 小提醒：
如果你只想保留其中一個介面的行為（例如只想要 `Trainer` 的 `greet()`），那 `override` 裡就只呼叫 `Trainer.super.greet()` 一行就好，不一定要兩個都呼叫。
-->
---
layout: default
---

# 鑽石 (Diamond) 問題

- 介面 B 與介面 C 同時繼承介面 A，三者都有同名的 Default 方法
- 類別 D 同時實作 B 與 C → 編譯器無法決定執行哪個版本，**必須強制 Override**

<div class="flex flex-col items-center my-3 text-xs font-mono gap-1">
  <div class="border border-blue-400 bg-blue-50 rounded px-4 py-1">
    interface A — <span class="text-blue-600">default</span> void running()
  </div>
  <div class="text-gray-400 text-base" style="display:flex; width:280px; justify-content:space-between;">
    <span>↙</span><span>↘</span>
  </div>
  <div class="flex gap-4">
    <div class="border border-green-500 bg-green-50 rounded px-3 py-1 text-center">
      interface B<br><span class="text-gray-500">extends A, override running()</span>
    </div>
    <div class="border border-green-500 bg-green-50 rounded px-3 py-1 text-center">
      interface C<br><span class="text-gray-500">extends A, override running()</span>
    </div>
  </div>
  <div class="text-gray-400 text-base" style="display:flex; width:280px; justify-content:space-between;">
    <span>↘</span><span>↙</span>
  </div>
  <div class="border border-red-400 bg-red-50 rounded px-4 py-1 text-red-700">
    class D implements B, C — ⚠️ 必須 Override
  </div>
</div>

<div class="p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 因繼承圖形的箭頭流向類似鑽石形狀，稱為<b>鑽石問題（Diamond Problem）</b>
</div>

<!--
【情境切入】
前面處理的衝突，都還只是「兩個獨立介面」的同名方法。但如果這兩個介面其實「師出同門」——都繼承自同一個父介面 `A`，而且各自都 `override` 了 `A` 的 `running()`，最後又被同一個類別 `D` 一起實作，會發生什麼事？

【概念定義】
這就是經典的「鑽石問題」：因為 `A` 在頂端、`B` 和 `C` 在中間各自分支、`D` 在底部把兩條分支匯合，整個繼承圖形看起來像一顆鑽石。`D` 同時繼承到 `B` 版本和 `C` 版本的 `running()`，編譯器無法替你決定該執行哪一個，所以強制要求 `D` 自己 `override`。

【生活化比喻】
這就像兩位師兄都各自改良了師父的招式，而你同時跟兩位師兄學藝。當你要使出「跑步」這招時，兩位師兄教的版本不一樣，旁人也搞不清楚你會用哪一招——所以你必須親自站出來，示範「你自己練出來的版本」。
-->
---

# 鑽石問題 — 程式範例

```java
interface A { default void running() { System.out.println("跑A"); } }
interface B extends A { default void running() { System.out.println("跑B"); } }
interface C extends A { default void running() { System.out.println("跑C"); } }
class D implements B, C {
    @Override
    public void running() {
        B.super.running(); // 跑B
        C.super.running(); // 跑C
    }
}
```

<!--
【帶讀範例】
這段範例的目的，是把上一頁的鑽石圖形變成真正的程式碼：`A` 提供基礎版 `running()`，`B` 和 `C` 各自繼承 `A` 並 `override` 成自己的版本，`D` 同時實作 `B` 和 `C`。

【預期結果】
`D` 的 `running()` 必須 `override`，否則編譯失敗。`override` 之後依序呼叫 `B.super.running()` 和 `C.super.running()`，會印出「跑B」和「跑C」。

⚠️ 易錯點提醒：
這裡完全不會印出「跑A」——因為 `B` 和 `C` 都已經 `override` 了 `A` 的版本，`D` 透過 `B.super` 或 `C.super` 拿到的，是 `B`、`C` 自己的版本，不是 `A` 的原始版本。如果真的想呼叫到 `A` 的版本，需要更繞的寫法，這裡先知道「鑽石問題的標準解法就是強制 override + `介面.super`」即可。
-->
---
layout: default
---

# 練習 4：解決鑽石問題
### 任務說明

設計一套介面，模擬「兩條繼承路線在同一個類別匯合」的鑽石結構：
1. 建立介面 `Worker`，定義 `default void work()`，印出「工作中...」
2. 建立介面 `Manager extends Worker`，`override` `work()`，印出「主管：分配任務」
3. 建立介面 `Engineer extends Worker`，`override` `work()`，印出「工程師：寫程式」
4. 類別 `TeamLead` 同時實作 `Manager` 與 `Engineer`，`override` `work()`，依序呼叫兩者的版本

**預期輸出：**
```
主管：分配任務
工程師：寫程式
```

<!--
【任務鋪陳】
這個練習就是把鑽石問題的結構（`A`、`B extends A`、`C extends A`、`D implements B, C`）換成更貼近現實的角色：`Worker` 是源頭，`Manager` 和 `Engineer` 都是從 `Worker` 延伸出來的職能，而 `TeamLead` 兩種職能都要會。

【引導思考】
畫一下繼承圖：`Worker` 在最上面，`Manager` 和 `Engineer` 在中間各自延伸，`TeamLead` 在底部把兩者匯合——這就是一個鑽石形狀。`TeamLead` 不寫 `override` 會怎樣？

【等待與觀察】
給大家 8 分鐘。如果寫完發現編譯器報錯，先別慌，看看錯誤訊息是不是在提示你「`work()` 衝突」，這正是鑽石問題的標準症狀。
-->
---
layout: default
---

# 練習 4：解決鑽石問題
### 解題提示

1. `Worker` 定義基礎版 `work()`；`Manager extends Worker`、`Engineer extends Worker` 各自 `override`
2. `TeamLead implements Manager, Engineer`，因為兩者都有 `override` 過的 `work()`，編譯器強制要求 `TeamLead` 也 `override`
3. 在 `TeamLead` 的 `work()` 中，用 `Manager.super.work()` 與 `Engineer.super.work()` 依序呼叫兩個版本

```java
interface Worker { default void work() { System.out.println("工作中..."); } }
interface Manager extends Worker {
    default void work() { System.out.println("主管：分配任務"); }
}
interface Engineer extends Worker {
    default void work() { System.out.println("工程師：寫程式"); }
}
class TeamLead implements Manager, Engineer {
    @Override
    public void work() {
        Manager.super.work();
        Engineer.super.work();
    }
}
```

<!--
【帶讀解法】
這跟「鑽石問題 — 程式範例」結構完全對應：`Worker` 對應 `A`，`Manager`/`Engineer` 對應 `B`/`C`，`TeamLead` 對應 `D`。解法也一樣：強制 `override`，再用 `介面名稱.super.方法名稱()` 把兩邊都呼叫一次。

💼 業界實務：
鑽石問題聽起來很學術，但在大型專案裡，當你的類別同時實作多個「都提供了預設行為」的介面時，隨時可能遇到。記住這個解法套路，遇到時就不會慌。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 密封介面（JDK 17）

<!--
【段落轉換】
解決了「介面太開放、衝突太多」的問題後，最後我們來看一個方向完全相反的新功能：如果介面太開放，導致誰都可以來實作它，反而讓系統難以掌控，怎麼辦？

【承接到本節主題】
Java 17 推出的 Sealed Interfaces（密封介面），就是讓開發者可以「鎖住」介面的擴充權限，明確規定「只有這些類別可以實作我」。
-->
---
layout: default
---

# 密封介面 (Sealed Interfaces)

| 特性 | 說明 |
| --- | --- |
| 關鍵字 | `sealed` |
| 控制權 | 使用 `permits` 指定哪些類別或介面可以實作它 |

```java
public sealed interface Shape permits Circle, Rectangle {
    double area();
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>JDK 17 正式特性：</b> 讓開發者能精確限制介面的擴充權限，增強系統安全性。
</div>

<!--
【情境切入】
回想一下基礎班學過的：「任何類別都可以 `implements` 一個介面」。這個彈性大部分時候是好事，但如果你正在設計一套「形狀只能是圓形或矩形」的系統，卻有人寫了一個 `Triangle implements Shape`，你的程式可能在你完全沒注意到的地方多了一種「未預期」的形狀。

【概念定義】
「密封介面（Sealed Interface）」用 `sealed` 關鍵字搭配 `permits`，明確列出「誰可以實作我」。上面的範例宣告 `Shape` 這個介面，只允許 `Circle` 和 `Rectangle` 兩個類別實作，其他類別即使寫了 `implements Shape` 也會編譯失敗。

【生活化比喻】
這就像一張「限定核發對象」的證照——`Shape` 證照只發給 `Circle` 和 `Rectangle` 這兩家公司，其他公司即使想申請也拿不到。這讓系統設計者對「整個繼承體系裡有哪些成員」有完全的掌控權。
-->
---

# 密封介面的實作規則

實作 `sealed` 介面的子類別必須明確宣告以下三種狀態之一：

| 狀態 | 說明 |
| --- | --- |
| `final` | 禁止再被繼承 |
| `sealed` | 繼續密封，並指定自己的子類別 |
| `non-sealed` | 解除密封，回歸傳統的開放繼承 |

```java
public final class Circle implements Shape { 
    public double area() { return 0; } 
}
public non-sealed class Rectangle implements Shape { 
    public double area() { return 0; } 
}
```

<!--
【概念定義】
被 `permits` 列出的子類別，不能「什麼都不寫」，必須明確選擇自己接下來的開放程度：
- `final`：到此為止，不再有子類別
- `sealed`：繼續維持密封，但這次由自己決定 `permits` 誰
- `non-sealed`：放棄密封限制，回到一般類別「誰都能繼承」的狀態

⚠️ 易錯點提醒：
很多人第一次看到 `non-sealed` 會以為這是某種「取消」語法，但它其實是一個完整的關鍵字（中間有個連字號），意思是「我雖然被一個 sealed 介面允許實作，但我自己選擇對外開放繼承」。少打這個連字號會直接編譯錯誤。
-->
---

# Records 實作介面 (Java 16)

Records 是隱式 `final`，天然符合 Sealed Interface `permits` 的要求，且自動生成 constructor 與 accessor：

```java
sealed interface Shape permits Circle, Rectangle {
    double area();
}
record Circle(double radius) implements Shape {
    public double area() { return Math.PI * radius * radius; }
}
record Rectangle(double w, double h) implements Shape {
    public double area() { return w * h; }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Record 比 <code>final class</code> 更簡潔：不需手動寫 constructor、getter、equals()、hashCode()、toString()
</div>

<!--
【情境切入】
上一頁提到，`sealed` 介面的子類別必須是 `final`、`sealed` 或 `non-sealed` 三者之一。如果我們要的子類別本質上就是「不可變的資料容器」（像 `Circle` 只需要一個 `radius`），每次都手動寫 constructor、getter、`equals()`、`hashCode()`、`toString()` 其實很繁瑣。

【概念定義】
Java 16 引入的 `record` 是專門設計來表示「不可變資料」的類別寫法，而且它「天生就是 `final`」——這正好符合 `sealed` 介面對子類別的要求。所以 `record Circle(double radius) implements Shape` 這一行，同時做到了「實作介面」和「滿足 sealed 的 final 要求」兩件事。

【生活化比喻】
如果把一般的 `final class` 比喻成「自己手工打造的保險箱」，`record` 就像是「買現成、規格固定的保險箱」——你只需要說明裡面要放什麼（`radius`、`w`、`h`），鎖、把手、標籤全部都是內建好的，不用自己動手做。
-->
---

# 密封介面與 Switch 窮舉性

當介面是 `sealed` 時，`switch` 可以檢查是否涵蓋所有可能的情況：

```java
public double getArea(Shape shape) {
    return switch (shape) {
        case Circle c    -> c.area();
        case Rectangle r -> r.area();
        // 不需要 default，因為 Shape 是 sealed 且已窮舉所有子類別
    };
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>優勢：</b> 漏掉實作類別時，編譯器會報錯，比傳統 <code>instanceof</code> 更安全。
</div>

<!--
【情境切入】
傳統的 `switch` 或一連串 `instanceof` 判斷，有一個隱藏風險：如果你之後新增了一種類型，卻忘了在 `switch` 裡加上對應的 `case`，程式可能在執行時悄悄走進 `default` 分支，卻沒有任何錯誤提示。

【概念定義】
因為 `Shape` 是 `sealed` 並且用 `permits Circle, Rectangle` 明確列出了「全部」可能的子類型，編譯器知道這個 `switch` 已經「窮舉」了所有情況，所以不需要寫 `default`。如果之後有人在 `Shape` 的 `permits` 清單裡加入第三種形狀，但忘了在這個 `switch` 裡加上對應的 `case`，編譯器會直接報錯，提醒你「漏處理了一種情況」。

💼 業界實務：
這個特性讓「型態窮舉」從「程式設計師自己小心」，變成「編譯器幫你把關」。對於需要長期維護的商業邏輯（例如訂單狀態、付款方式），這種編譯期保證能省下很多日後追蹤 bug 的時間。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
default 方法、衝突處理、Sealed Interfaces 都學完了，最後用一個綜合練習，把這份自學內容的重點全部串起來。
-->
---
layout: default
---

# 練習 5 (綜合)：訂單狀態的密封設計
### 任務說明

整合本份自學內容（default 方法、衝突處理、Sealed Interfaces），設計一套「訂單狀態」系統：
1. 建立 `sealed interface OrderStatus permits Pending, Shipped, Cancelled`，定義抽象方法 `String describe()`，並加入 `default` 方法 `void printStatus()`，印出「訂單狀態：」+ `describe()` 的結果
2. 用 `record Pending() implements OrderStatus`、`record Shipped() implements OrderStatus`、`record Cancelled() implements OrderStatus` 分別實作 `describe()`，回傳「待處理」「已出貨」「已取消」
3. 撰寫一個方法 `String getNextAction(OrderStatus status)`，用 `switch` 窮舉三種狀態，分別回傳對應的「下一步動作」文字（例如待處理→「請出貨」、已出貨→「等待收貨」、已取消→「無需處理」）
4. 在 `main()` 中，對三種狀態分別呼叫 `printStatus()` 與 `getNextAction()` 並印出結果

<!--
【任務鋪陳】
這份自學內容學到這裡，我們已經知道介面可以有 default 方法（提供共用行為）、可以處理多重繼承的衝突，最後也認識了 Sealed Interfaces（限制誰能實作）。這個綜合練習，要把「default 方法」和「Sealed Interfaces + record + switch 窮舉」放在同一個情境裡。

【引導思考】
想一想：為什麼訂單狀態很適合用 `sealed interface` 來設計？如果有一天要新增「退款中」這個狀態，`getNextAction()` 的 `switch` 會發生什麼事？這正是 Sealed Interfaces 搭配 `switch` 窮舉性的價值所在。

【等待與觀察】
給大家 12 分鐘。這題比較長，建議先把三個 `record` 寫出來，確認 `OrderStatus` 介面能正常運作，再寫 `getNextAction()` 的 `switch`。
-->
---
layout: default
---

# 練習 5 (綜合)：訂單狀態的密封設計
### 解題提示

1. `OrderStatus` 是 `sealed interface`，`permits Pending, Shipped, Cancelled`，包含抽象方法 `describe()` 與 default 方法 `printStatus()`
2. 三個狀態各自用 `record`（隱式 `final`，自動符合 `permits` 要求）實作 `describe()`
3. `getNextAction()` 用 `switch` 窮舉三種 `record` 型態，因為 `OrderStatus` 是 `sealed`，不需要 `default` 分支

```java
sealed interface OrderStatus permits Pending, Shipped, Cancelled {
    String describe();
    default void printStatus() {
        System.out.println("訂單狀態：" + describe());
    }
}
record Pending() implements OrderStatus {
    public String describe() { return "待處理"; }
}
```

<!--
【帶讀解法】
這題把整份自學內容串起來了：`printStatus()` 是 default 方法，提供「不管狀態是什麼，都用同一種方式印出來」的共用行為；三個 `record` 利用了「隱式 final」的特性滿足 `sealed` 的要求；`getNextAction()` 的 `switch` 則展示了「窮舉性」帶來的安全感。

💼 業界實務：
這種「`sealed interface` + `record` + `switch` 窮舉」的組合，是近年 Java 處理「有限狀態集合」（像訂單狀態、付款方式、API 回應結果）的標準寫法，比傳統用 `enum` 搭配大量 `if-else` 更安全也更簡潔。
-->
---
layout: end
---

# 自學內容結束
### Default / Static / Private 方法、鑽石問題與 Sealed Interfaces，讓介面從契約進化為半個類別

<!--
【收尾】
這份自學內容，我們從 Java 8 的 default、static 方法，一路走到 Java 9 的 private 方法，再處理了 default 方法引發的各種衝突（包含經典的鑽石問題），最後認識了 Java 17 的 Sealed Interfaces。

【核心帶走重點】
1. default 方法讓介面可以提供「預設行為」，是後面所有衝突討論的源頭。
2. 衝突的標準解法都是「強制 override + `介面名稱.super.方法名稱()`」。
3. 鑽石問題只是「default 方法衝突」的一種特殊形狀，本質解法相同。
4. Sealed Interfaces 讓你能精確控制「誰可以實作我」，搭配 `record` 和 `switch` 窮舉，是現代 Java 處理有限狀態集合的標準做法。

如果這份自學內容你都看懂了，代表你對介面的理解已經超過大部分初學者，可以很有自信地去看 Spring 之類框架裡那些介面設計了。
-->
