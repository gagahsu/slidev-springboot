---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Java 繼承與多形
routeAlias: ch14
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
    繼承與多形
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用繼承消除重複，用多形擴展彈性」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
今天我們要學繼承（Inheritance）和多形（Polymorphism），這是物件導向程式設計最核心的兩個概念。

【為什麼要學這個？】
你有沒有寫過類似的程式碼，複製貼上改了一點點？繼承就是讓你把「共同的部分」抽出來，寫一次就好。多形則讓你的程式更靈活，新增功能時不需要修改舊程式碼。

【今天學完你會能做什麼】
學完之後你就能設計有繼承關係的類別體系，用多形讓程式碼以一對多的方式運作，也能讀懂業界常見的 Spring Boot 框架程式碼。
-->
---
layout: default
---

# Outline

- **繼承 (Inheritance)** — extends 語法、存取修飾符、繼承類型、final、Sealed Classes、Records
- **IS-A 與 HAS-A 關係** — instanceof、聚合、組合
- **Override 與 Overload** — Override 規則、super、@Override、Overload 對比
- **多形 (Polymorphism)** — 編譯時期 vs 執行時期、型別轉型、Pattern Matching
- **靜態 / 動態綁定** — Static Binding vs Dynamic Binding
- **巢狀類別 (Nested Classes)** — 內部類別、方法類別、匿名類別

<!--
【帶讀大綱】
今天內容分六大塊。先從繼承的語法和機制開始，然後討論兩種物件關係（IS-A 和 HAS-A），接著深入 Override 和 Overload 的差異，再來是多形，最後講靜態/動態綁定和巢狀類別。

【學習策略】
這章的概念環環相扣，繼承是多形的基礎，多形是動態綁定的表現。跟著順序學，不要急著跳後面。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 繼承 Inheritance

<!--
【段落轉換】
先從繼承開始。繼承的核心概念只有一句話：讓子類別直接擁有父類別的屬性和方法，不用重寫。
-->
---
layout: default
---

# 為什麼需要繼承？

Animal、Dog、Bird 三個類別大量重複程式碼：

| 類別 | 共有屬性 | 共有方法 | 獨有方法 |
| --- | --- | --- | --- |
| `Animal` | `name` | `eat()`, `sleep()` | — |
| `Dog` | `name` | `eat()`, `sleep()` | `barking()` |
| `Bird` | `name` | `eat()`, `sleep()` | `flying()` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>繼承的目的：</b>讓子類別直接引用父類別的屬性與方法，消除重複程式碼
</div>

<!--
【核心說明】
為什麼需要繼承？看表格就知道了。Animal、Dog、Bird 三個類別裡，name、eat()、sleep() 都重複出現了三次。這代表如果 eat() 要改邏輯，你要改三個地方——這就是「程式碼重複」的問題。

【生活化比喻】
就像公司的員工手冊，基本規定所有人都一樣，不需要每個人的合約都寫一遍。繼承就是把「共同的規定」放在父類別，所有子類別自動適用。

💼 業界實務：
重複程式碼是維護的惡夢，繼承是解決方案之一。原則是 DRY（Don't Repeat Yourself）——寫一次就好。
-->
---

# 繼承的語法 — extends

使用 `extends` 關鍵字，子類別自動擁有父類別的所有屬性與方法：

```java
class Dog extends Animal {
    public void barking() {
        System.out.println(name + " 汪汪叫");
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Dog 無需再定義 <code>name</code>、<code>eat()</code>、<code>sleep()</code>，繼承後自動擁有
</div>

<!--
【帶讀程式碼】
extends 這個關鍵字就是建立繼承關係。Dog extends Animal 表示 Dog 繼承 Animal。

【逐步解說】
Dog 類別裡只定義了 barking()，但因為繼承了 Animal，它自動擁有 name 屬性、eat() 和 sleep() 方法。

⚠️ 學生常見誤解：
繼承的是 Animal 的「定義」，不是某個 Animal 物件的資料。每個 Dog 物件都有自己的 name，不是共享同一個。
-->
---

# 繼承範例 — Animal 與 Dog

```java
// Animal.java
class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void eat()   { System.out.println(name + " 吃東西"); }
    public void sleep() { System.out.println(name + " 睡覺"); }
}
```

```java
// Dog.java
class Dog extends Animal {
    public Dog(String name) { super(name); }
    public void barking() { System.out.println(name + " 汪汪叫"); }
}
```

<!--
【帶讀程式碼】
這是完整的 Animal 和 Dog 範例。注意兩個重點：
1. Animal 的建構方法接受 name 參數，用 this.name 存起來。
2. Dog 的建構方法呼叫 super(name)，把 name 傳給父類別的建構方法。

【重點提示】
super(name) 是關鍵！子類別不能直接設定父類別的屬性（如果是 private），要透過 super() 呼叫父類別的建構方法。
-->
---

# 父類別建構方法的啟動順序

建立子類別物件時，**父類別的建構方法會先自動被呼叫**：

```java
// Animal.java
class Animal {
    protected String name;
    public Animal(String name) {
        this.name = name;
        System.out.println("Animal 建構");
    }
    public void eat()   { System.out.println(name + " 吃東西"); }
    public void sleep() { System.out.println(name + " 睡覺"); }
}
```

<!--
【核心說明】
建立子類別物件時，Java 會先執行父類別的建構方法，再執行子類別的建構方法。這個順序不能反過來。
-->
---

# 父類別建構方法的啟動順序 — 執行結果

```java
// Dog.java
class Dog extends Animal {
    public Dog(String name) {
        super(name);
        System.out.println("Dog 建構");
    }
    public void barking() { System.out.println(name + " 汪汪叫"); }

    public static void main(String[] args) {
        new Dog("旺財");
        // 輸出：
        // Animal 建構
        // Dog 建構
    }
}
```

<!--
【帶讀程式碼】
new Dog("旺財") 執行時：先印 "Animal 建構"，再印 "Dog 建構"。父先子後，像是先有父母才有小孩。

⚠️ 學生常見誤解：
如果父類別沒有無參建構方法（只有有參的），而子類別沒有呼叫 super(...)，編譯會報錯。Java 只會自動呼叫父類別的「無參建構方法」，有參的要自己呼叫。
-->
---

# 存取修飾符與繼承

| 修飾符 | 同一類別 | 同套件 | 子類別 | 其他 |
| --- | --- | --- | --- | --- |
| `public` | ✅ | ✅ | ✅ | ✅ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| （無修飾符） | ✅ | ✅ | ❌ | ❌ |
| `private` | ✅ | ❌ | ❌ | ❌ |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 建議父類別屬性用 <code>protected</code>：子類別可直接存取，外部類別無法直接修改
</div>

<!--
【帶讀表格】
存取修飾符決定「誰能看到這個屬性或方法」。這張表很重要，請大家記住。

【逐步解說】
public：所有人都能存取。
protected：同套件和子類別能存取，外部不行。
（無修飾符）：只有同套件能存取，子類別如果在不同套件就不行。
private：只有自己類別內部能存取。

💼 業界實務：
父類別屬性通常設 protected，讓子類別能直接存取但外部不能亂改。方法通常設 public 或 protected，視需要決定。
-->
---

# protected 屬性與 super() 範例

```java
// Animal.java
class Animal {
    protected String name;
    public Animal(String name) { this.name = name; }
    public void eat()   { System.out.println(name + " 吃東西"); }
    public void sleep() { System.out.println(name + " 睡覺"); }
}
```

```java
// Dog.java
class Dog extends Animal {
    public Dog(String name) {
        super(name); // 呼叫父類別的建構方法
    }
    public void barking() { System.out.println(name + " 汪汪叫"); }
}
```

<!--
【帶讀程式碼】
protected String name 讓子類別可以直接用 name。Dog 的 barking() 方法直接印 name，沒有問題。

【重點】
super(name) 必須放在建構方法的「第一行」，Java 強制規定。如果放第二行會編譯錯誤。
-->
---

# super 關鍵字用法

| 用途 | 語法 | 說明 |
| --- | --- | --- |
| 呼叫父類別建構方法 | `super(參數)` | 必須放在建構方法第一行 |
| 呼叫父類別方法 | `super.方法名()` | 用於 Override 後仍需呼叫父類別版本 |
| 存取父類別屬性 | `super.屬性名` | 父子類別有同名屬性時使用 |

<!--
【帶讀表格】
super 有三種用途，都很常用。

呼叫父類別建構方法：super(參數)，必須在第一行。
呼叫父類別方法：super.方法名()，通常在 Override 時用。
存取父類別屬性：super.屬性名，父子類別有同名屬性時才需要。

⚠️ 學生常見誤解：
super 和 this 的關係：this 指自己這個物件，super 指父類別的部分。兩者不能同時在建構方法第一行使用。
-->
---

# super 關鍵字用法 — 範例

```java
class Dog extends Animal {
    String name = "狗";           // 與父類別同名屬性
    Dog(String n) {
        super(n);                 // ① 第一行呼叫父類別建構方法
    }
    @Override
    void sound() {
        super.sound();            // ② 呼叫父類別的 sound()
        System.out.println(super.name); // ③ 存取父類別的 name
    }
}
```

<!--
【帶讀程式碼】
三種 super 用法都在這個範例裡：
① super(n)：呼叫父類別建構方法，傳入名字。
② super.sound()：呼叫父類別的 sound() 方法。
③ super.name：存取父類別的 name 屬性（Dog 自己也有一個 name，所以要加 super 區分）。

⚠️ 同名屬性的陷阱：
子類別和父類別有同名屬性時，直接寫 name 是子類別的，super.name 才是父類別的。這個細節容易出 bug。
-->
---

# 繼承類型

| 類型 | 說明 |
| --- | --- |
| 單一繼承 (Single) | 一個子類別繼承一個父類別 |
| 分層繼承 (Hierarchical) | 多個子類別繼承同一個父類別 |
| 多層次繼承 (Multi-Level) | 子類別再被其他類別繼承（A→B→C） |
| 多重繼承 (Multiple) | Java **不支援**，可改用介面 (Interface) |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Java 不允許同時繼承 2 個以上的父類別，但介面可以繼承多個介面
</div>

<!--
【帶讀表格】
Java 繼承有幾種類型：
單一繼承：一個子類別繼承一個父類別，最常見。
分層繼承：多個子類別繼承同一個父類別，就像 Dog 和 Cat 都繼承 Animal。
多層次繼承：A 繼承 B，B 繼承 C，形成鏈式結構。
多重繼承：Java 不支援！不能同時繼承兩個類別。

⚠️ 學生常見誤解：
Java 不支援多重繼承的原因是「菱形問題」（Diamond Problem）——如果兩個父類別有同名方法，子類別不知道要繼承哪個。介面（Interface）可以達到類似效果但避免這個問題。
-->
---

# final 修飾符與繼承

| 用途 | 說明 |
| --- | --- |
| `final class` | 類別不能被繼承 |
| `final` 方法 | 子類別無法 Override 此方法 |
| 靜態綁定 | `final` 方法在編譯期決定，效能較佳 |

```java
final class MathUtil { }          // 無法被繼承
class Animal {
    public final void breathe() { }  // 子類別無法 Override
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Java 內建範例：</b><code>String</code>、<code>Integer</code> 等 Wrapper 類別都宣告為 <code>final class</code>
</div>

<!--
【核心說明】
final 有三種用途：final 類別不能被繼承，final 方法不能被 Override，final 變數不能被改值。

【帶讀程式碼】
String 類別就是 final class，所以你沒辦法 extends String。這是 Java 設計者刻意的安全設計。

💼 業界實務：
工具類別（Utility class）通常設計成 final，防止別人亂繼承改壞行為。
-->
---

# 密封類別 (Sealed Classes)

JDK 17 正式功能，允許父類別**精確控制**哪些子類別可以繼承它。

| 關鍵字 | 說明 |
| --- | --- |
| `sealed` | 宣告此類別為密封類別 |
| `permits` | 指定允許繼承的子類別清單 |

```java
// 只允許 Circle 和 Square 繼承 Shape
public sealed class Shape permits Circle, Square { }

final class Circle extends Shape { }
final class Square extends Shape { }
```

<!--
【核心說明】
Sealed Classes 是 JDK 17 的新功能，讓父類別「點名」只有特定子類別可以繼承它。

【帶讀程式碼】
sealed class Shape permits Circle, Square：Shape 只允許 Circle 和 Square 繼承，其他類別繼承會編譯錯誤。

💼 業界實務：
設計 API 時，有時候你不希望使用者任意繼承你的類別（防止破壞設計意圖），Sealed Classes 就是為此而生。
-->
---

# 密封子類別的修飾符限制

密封類別的子類別**必須**明確宣告為以下三種狀態之一：

| 修飾符 | 說明 |
| --- | --- |
| `final` | 禁止再被繼承（斷絕後代） |
| `sealed` | 繼續保持密封，並指定自己的 permits |
| `non-sealed` | 解除密封，允許任何類別繼承（回歸傳統） |

```java
public non-sealed class Circle extends Shape { } // 任何人都能繼承 Circle
```

<!--
【帶讀表格】
密封類別的子類別必須明確宣告自己的「開放程度」：
final：不能再被繼承（通常用這個）。
sealed：繼續密封，自己也指定 permits。
non-sealed：完全開放，任何人都可以繼承這個子類別。

【類比說明】
就像加盟店的模式：總公司（sealed class）指定哪些加盟主（permits），加盟主可以選擇繼續限制（sealed）、不再開放（final）或允許所有人加盟（non-sealed）。
-->
---

# Sealed Classes 與 Pattern Matching

密封類別搭配 `switch`（JDK 17+），編譯器會檢查**窮舉性**：

```java
// 如果 Shape 是 sealed，編譯器知道只有 Circle 和 Square
return switch (shape) {
    case Circle c -> c.radius() * c.radius() * Math.PI;
    case Square s -> s.side() * s.side();
    // 不需要 default 區塊！編譯器保證所有可能都已涵蓋
};
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 當你新增一個 permits 子類別時，編譯器會提醒你更新所有相關的 <code>switch</code> 邏輯
</div>

<!--
【核心說明】
Sealed Classes 的最大優點是可以和 switch 搭配，讓編譯器幫你檢查是否考慮到所有子類別。

【帶讀程式碼】
switch(shape) 不需要 default，因為編譯器知道 Shape 只有 Circle 和 Square 兩種子類別，兩個都處理了就完整了。

💼 業界實務：
這個特性讓「新增子類別時忘記更新 switch」的 bug 變成編譯錯誤而不是執行時才發現，大大提高程式碼安全性。
-->
---

# 紀錄類別 (Records) 簡介

JDK 16 引入，只需宣告欄位，編譯器自動產生 constructor、getter、`equals`、`hashCode`、`toString`：

```java
// 傳統寫法需要數十行；record 一行搞定
record Person(String name, int age) { }

Person p = new Person("炭治郎", 15);
System.out.println(p.name()); // "炭治郎"
System.out.println(p.age());  // 15
System.out.println(p);        // Person[name=炭治郎, age=15]
```

<!--
【核心說明】
Records 是 JDK 16 的新功能，專為「純資料類別」設計。只要宣告欄位，編譯器自動產生所有你需要的方法。

【帶讀程式碼】
record Person(String name, int age) 一行，自動有建構方法、getter（name()、age()）、toString()、equals()、hashCode()。傳統寫法要幾十行。

💼 業界實務：
DTO（Data Transfer Object）——在系統之間傳遞資料的物件——用 Record 非常合適，既簡潔又不可變（immutable）。
-->
---

# Records 與繼承限制

| 規則 | 說明 |
| --- | --- |
| 隱含 final | Record **無法被繼承** |
| 固定父類別 | Record 隱含繼承 `java.lang.Record`，不能再 `extends` 其他類別 |
| 實作介面 | Record **可以**實作多個介面 |

```java
record Point(int x, int y) { }   // ✅ 合法
// class Sub extends Point { }    // ❌ Record 不能被繼承
// record R extends Animal { }    // ❌ Record 不能繼承其他類別
interface Drawable { }
record Circle(double r) implements Drawable { } // ✅ 可實作介面
```

<!--
【帶讀表格】
Records 有幾個限制要注意：
不能被繼承（隱含 final）。
不能繼承其他類別（隱含繼承 java.lang.Record）。
但可以實作介面。

⚠️ 學生常見誤解：
Records 的欄位是 immutable（不可變），建立後不能修改。這是設計上的選擇，讓資料物件更安全。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# IS-A 與 HAS-A 關係

<!--
【段落轉換】
講完繼承的語法，我們來看物件之間的兩種「關係」：IS-A 和 HAS-A。這個概念決定了你應該用繼承還是組合。
-->
---
layout: default
---

# IS-A 關係 — 繼承

IS-A 代表「是一種」，子類別物件**也是**父類別的一種。

用 `instanceof` 驗證：

```java
class Fish extends Animal {}
class Bird extends Animal {}
class Eagle extends Bird {}
```

```java
Eagle eagle = new Eagle();
System.out.println(eagle instanceof Bird);   // true
System.out.println(eagle instanceof Animal); // true
```

<!--
【核心說明】
IS-A 是繼承關係：Dog IS-A Animal（狗是一種動物）。

【帶讀程式碼】
instanceof 可以驗證：eagle instanceof Bird 是 true，eagle instanceof Animal 也是 true，因為 Eagle 繼承 Bird，Bird 繼承 Animal，所以 Eagle 也是一種 Animal。

【類比說明】
父子關係是可以傳遞的。台積電員工 IS-A 工程師，工程師 IS-A 員工，所以台積電員工也是員工。
-->
---

# HAS-A 關係 — 聚合 vs 組合

| 類型 | 關鍵字 | 說明 |
| --- | --- | --- |
| 聚合 (Aggregation) | 無 `extends` | 類別 A 的屬性是類別 B 的物件（A HAS A B） |
| 組合 (Composition) | 用 `extends` | 將多個類別的共用屬性抽取到父類別再繼承 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 兩者目的相同：減少重複程式碼，提高可維護性
</div>

<!--
【帶讀表格】
HAS-A 是組合關係：Car HAS-A Engine（車子有一個引擎）。這不是繼承，而是一個類別的屬性是另一個類別的物件。

【關鍵區別】
IS-A：Dog IS-A Animal → 用繼承（extends）
HAS-A：Car HAS-A Engine → 用屬性（把 Engine 當成 Car 的欄位）

💼 業界實務：
「組合優於繼承」是物件導向設計原則之一。能用 HAS-A 解決的，不一定要用 IS-A。
-->
---

# HAS-A 聚合範例 (Aggregation)

```java
class Speed {
    protected int speed;
    public int getSpeed() { return speed; }
}
```

```java
class Car {
    private Speed s = new Speed(); // Car HAS A Speed
    public int getCarSpeed() { return s.getSpeed(); }
}
```

<!--
【帶讀程式碼】
Car 有一個 Speed 物件作為屬性，getCarSpeed() 委託給 Speed 來處理速度邏輯。Car 和 Speed 是 HAS-A 關係。

【類比說明】
就像你的車子「有一個」速度計，車子自己不計算速度，交給速度計去做。這叫「委派」（Delegation）。
-->
---

# HAS-A 組合範例 (Composition)

多個類別的共用屬性抽取到 `BasinInfo`，再繼承：

```java
class BasinInfo {
    protected String id;
    protected String name;
}
```

```java
class Employee extends BasinInfo { int salary; }
class Customer extends BasinInfo { int balance; }
```

<!--
【帶讀程式碼】
組合繼承：Employee 和 Customer 都有 id 和 name，把共同屬性抽到 BasinInfo，然後分別繼承。

【比較說明】
聚合（前一頁）：物件包含另一個物件作為屬性（Car HAS A Speed 物件）。
組合（這頁）：把共同屬性抽出來用繼承共享（Employee 和 Customer 都繼承 BasinInfo）。

兩種 HAS-A 的使用場景不同，根據語意選擇。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Override 與 Overload

<!--
【段落轉換】
現在進入 Override 和 Overload。這兩個詞長得很像，但是完全不同的概念，也是考試和面試超愛考的題目。
-->
---
layout: default
---

# Override 最簡範例

子類別「重新定義」父類別的方法：

```java
class Animal {
    public void move() { System.out.println("Animal 移動"); }
}
```

```java
class Dog extends Animal {
    @Override
    public void move() { System.out.println("Dog 跑步"); }
}
```

<!--
【核心說明】
Override（覆寫）：子類別重新定義父類別已有的方法。方法名稱、參數都一樣，但實作不同。

【帶讀程式碼】
Animal 有 move()，Dog 也有 move()，但 Dog 的版本被 @Override 標記，表示這是覆寫父類別的版本。

【生活化比喻】
父親有一個「做菜」的方法：炒飯。兒子繼承了這個能力，但他的版本是做義大利麵——同樣是「做菜」，內容不同了。
-->
---

# Override 基本規則

| 規則 | 說明 |
| --- | --- |
| 方法名稱 | 必須**相同** |
| 參數列表 | 必須**相同** |
| 回傳型態 | 必須**相同**（或子型態） |
| 存取權限 | 只能**放寬**，不能縮減 |
| 不可覆寫 | `static`、`final`、`private` 方法 |

<!--
【帶讀表格】
Override 有五個規則，一個都不能違反：
方法名稱相同、參數列表相同、回傳型態相同（或子型態）、存取權限只能放寬不能縮減、static/final/private 方法不能覆寫。

⚠️ 學生常見誤解：
存取權限「只能放寬」是什麼意思？父類別的方法是 protected，子類別可以改成 public（更開放），但不能改成 private（更嚴格）。
-->
---

# 方法隱藏 (Method Hiding) vs Override

| 比較項目 | Override | 方法隱藏 |
| --- | --- | --- |
| 適用對象 | 實例方法 | `static` 方法 |
| 決定時機 | 執行時期（動態綁定） | 編譯時期（靜態綁定） |
| 呼叫依據 | 物件的**實際型態** | 變數的**宣告型態** |

```java
class Animal { static void sound() { System.out.println("Animal"); } }
```

```java
class Dog extends Animal { static void sound() { System.out.println("Dog"); } }
```

```java
Animal a = new Dog();
a.sound(); // 輸出：Animal（由宣告型態 Animal 決定）
```

<!--
【帶讀表格】
方法隱藏（Method Hiding）和 Override 很像，但適用於 static 方法。

關鍵差異：Override 是執行時期決定的（看物件的實際型態），方法隱藏是編譯時期決定的（看變數的宣告型態）。

【帶讀程式碼】
Animal a = new Dog()，a.sound() 呼叫的是 Animal 的 sound()，因為 sound() 是 static，由宣告型態 Animal 決定。

⚠️ 學生常見誤解：
很多人以為 new Dog() 所以會呼叫 Dog 的方法，但 static 方法不參與多形，這是陷阱！
-->
---

# 協變回傳型態 (Covariant Return Type)

Override 時，子類別可以回傳比父類別**更具體的子型態**：

| 父類別方法 | 子類別 Override | 合法？ |
| --- | --- | --- |
| `Animal produce()` | `Dog produce()` | ✅ Dog IS-A Animal |
| `Object clone()` | `Dog clone()` | ✅ |
| `int get()` | `double get()` | ❌ 基本型態不適用 |

```java
class Animal { Animal produce() { return new Animal(); } }
```

```java
class Dog extends Animal {
    @Override
    Dog produce() { return new Dog(); }
}
```

<!--
【核心說明】
協變回傳型態：Override 時，子類別可以回傳比父類別更「具體」的型態。

【帶讀表格】
父類別回傳 Animal，子類別可以改成回傳 Dog（因為 Dog IS-A Animal）。

【類比說明】
父類別說「我給你一種動物」，子類別可以更精確地說「我給你一條狗」，更具體不算違反規則。

⚠️ 注意：
這只對物件型態有效，int 不能改成 double——基本型態不適用。
-->
---

# super 在 Override 中的應用

子類別呼叫父類別被覆寫的方法，用 `super.方法名()`：

```java
class Dog extends Animal {
    @Override
    public void move() {
        super.move();                    // 執行父類別的 move()
        System.out.println("Dog 跑步");
    }
}
```

<!--
【帶讀程式碼】
super.move() 讓子類別在執行自己邏輯前，先執行父類別的版本。

【使用場景】
這在業界很常見：父類別做基本處理，子類別加上額外邏輯。例如父類別 log 記錄，子類別做業務邏輯。

💼 業界實務：
Spring Boot 的攔截器（Interceptor）常常看到這個模式，子類別呼叫 super 先執行基本認證，再加上自己的檢查。
-->
---

# @Override 注解

加上 `@Override` 讓編譯器驗證方法簽名是否正確：

```java
class Dog extends Animal {
    @Override
    public void move() { System.out.println("Dog 跑步"); }

    // @Override              ← 若方法名拼錯，編譯時立即報錯
    // public void mov() { }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 強烈建議每次 Override 父類別方法時都加上 <code>@Override</code>
</div>

<!--
【核心說明】
@Override 讓編譯器幫你確認這真的是在覆寫父類別的方法。

【帶讀程式碼】
如果方法名拼錯（mov 而不是 move），編譯器會立刻報錯。沒有 @Override 的話，你以為在覆寫，其實只是新增了一個叫 mov 的方法，bug 悄悄出現。

⚠️ 強烈建議：
每次 Override 都加上 @Override，這是業界標準，也是防呆設計。

💼 業界實務：
程式碼審查（Code Review）時，沒有 @Override 的覆寫方法通常會被退回修改。
-->
---

# Overload — 多重定義

方法名稱相同但**參數不同**，屬於編譯時期多形：

```java
class Animal {
    public void eat(String food) {
        System.out.println("吃 " + food);
    }
    public void eat(String food, int amount) {
        System.out.println("吃 " + amount + " 份 " + food);
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Overload 靠<b>參數的個數、型態、順序</b>區別；與 Override 不同，不需繼承關係
</div>

<!--
【核心說明】
Overload（多重定義）：同一個方法名稱，但參數不同。這是「同名不同工」，跟繼承沒有關係。

【帶讀程式碼】
eat(String food) 和 eat(String food, int amount) 都叫 eat，但參數不同。Java 根據你呼叫時傳的參數決定用哪個版本。

⚠️ Override vs Overload 的關鍵差異：
Override 要繼承關係，Overload 不需要。Override 參數必須一樣，Overload 參數必須不一樣。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 多形 Polymorphism

<!--
【段落轉換】
多形是繼承最強大的應用。理解多形之後，你寫的程式碼擴展性會大幅提升。
-->
---
layout: default
---

# 兩種多形

| 類型 | 決定時機 | 機制 |
| --- | --- | --- |
| 編譯時期多形 (Compile Time) | 編譯期間 | 方法多重定義 (Overload) |
| 執行時期多形 (Runtime) | 執行期間 | 方法重新定義 (Override) + 向上轉型 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 執行時期多形的 3 要件：① 有繼承關係 ② 子類別 Override 父類別方法 ③ 父類別變數參考子類別物件
</div>

<!--
【帶讀表格】
多形有兩種：
編譯時期多形：靠 Overload，在寫程式時就決定呼叫哪個版本。
執行時期多形：靠 Override + 繼承，在程式執行時才決定呼叫哪個版本。

執行時期多形的三要件：① 有繼承 ② 子類別有 Override ③ 父類別變數指向子類別物件。
-->
---

# 執行時期多形 — 概念

先看沒有多形時，對不同動物分別呼叫 `move()`：

```java
Dog dog = new Dog();
Bird bird = new Bird();
dog.move();   // 需要知道每個子類別的型態
bird.move();
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 每新增一種動物，就要多寫一段呼叫 — 難以擴展
</div>

<!--
【核心說明】
沒有多形時的問題：每種動物都要用它自己的型態宣告，每次新增動物就要多一段程式碼。

【帶讀程式碼】
dog.move()、bird.move() 分開呼叫，看起來還好。但如果有 100 種動物呢？

💡 引導思考：
如果我有 Dog、Cat、Bird、Fish... 全部要呼叫 move()，怎麼讓程式更簡潔？
-->
---

# 執行時期多形 — 準備工作

各子類別各自 Override `move()` 方法：

```java
class Animal { public void move() { System.out.println("Animal 移動"); } }
```

```java
class Dog extends Animal {
    @Override
    public void move() { System.out.println("Dog 跑步"); }
}
```

```java
class Bird extends Animal {
    @Override
    public void move() { System.out.println("Bird 飛翔"); }
}
```

<!--
【帶讀程式碼】
準備工作：Animal 有 move()，Dog 和 Bird 各自 Override 成自己的版本。這三個類別準備好了，多形才能發揮作用。

⚠️ 提醒：
Override 一定要有！沒有 Override 的話，就算用父類別變數指向子類別物件，呼叫的也是父類別的方法，看不到多形效果。
-->
---

# 執行時期多形 — 用法

以父類別型態統一接收不同子類別物件：

```java
Animal a1 = new Dog();   // Upcasting
Animal a2 = new Bird();  // Upcasting
a1.move(); // Dog 跑步
a2.move(); // Bird 飛翔
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 同一個 <code>move()</code> 呼叫，依物件實際型態執行不同行為 — 這就是多形
</div>

<!--
【帶讀程式碼】
重點來了！Animal a1 = new Dog()——用父類別 Animal 的型態，存放 Dog 物件。a1.move() 呼叫的是 Dog 的 move() 版本，因為 Java 看的是「物件的實際型態」（Dog），不是「變數宣告型態」（Animal）。

【生活化比喻】
就像一份「動物表演合約」，合約上寫「動物會表演」（Animal.move()），不管簽約的是狗還是鳥，上台後各自表演自己的特技。

💼 業界實務：
Spring Boot 框架大量使用這個模式。Service 介面宣告方法，實作類別 Override，Controller 只認識 Service 介面，不管底層換成什麼實作都能運作。
-->
---

# 向上轉型 Upcasting

將子類別物件指定給**父類別**型態變數，自動轉型：

| 特性 | 說明 |
| --- | --- |
| 自動轉型 | 不需強制轉型語法 |
| 可呼叫方法 | 只有父類別定義的方法 |
| 實際執行 | 子類別 Override 後的版本 |

```java
Animal a = new Dog(); // 自動 Upcasting，a 只認識 Animal 的方法
```

<!--
【核心說明】
向上轉型（Upcasting）：把子類別物件當成父類別型態使用。自動轉型，不需要額外語法。

【帶讀表格】
向上轉型後：只能呼叫父類別定義的方法（存取範圍變窄），但執行的是子類別 Override 的版本（多形效果）。

【類比說明】
把「一條狗」放進「動物箱」，現在你只知道箱子裡有「某種動物」，你只能做動物能做的事（不能特別叫它汪汪叫），但它叫的時候還是狗叫聲。
-->
---

# 向下轉型 Downcasting

將父類別型態變數轉回**子類別**，需強制轉型：

```java
Animal a = new Dog();
Dog dog = (Dog) a;    // Downcasting — 恢復存取 Dog 專屬方法
dog.barking();        // 可呼叫 Dog 的 barking()
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ 若物件實際型態不符，執行時拋出 <code>ClassCastException</code>。建議先用 <code>instanceof</code> 判斷再轉型
</div>

<!--
【核心說明】
向下轉型（Downcasting）：把父類別型態變數轉回子類別，需要強制轉型。

【帶讀程式碼】
先 Upcasting 存成 Animal a，之後用 (Dog) a 強制轉回 Dog，就能呼叫 barking() 了。

⚠️ 學生常見誤解：
強制轉型不是「讓物件變成另一種東西」，而是「告訴 Java 我知道這個物件其實是 Dog」。如果物件實際上不是 Dog，會拋出 ClassCastException，所以要先用 instanceof 確認。
-->
---

# Pattern Matching for instanceof

JDK 16 引入了更簡潔的 **Pattern Matching**，將 `instanceof` 判斷與轉型合併。

| 方式 | 語法 |
| --- | --- |
| 傳統方式 | `if (a instanceof Dog) { Dog d = (Dog) a; ... }` |
| Pattern Matching | `if (a instanceof Dog d) { d.barking(); }` |

```java
Object obj = "Hello Java";

// 判斷的同時宣告變數 s，若符合則自動轉型
if (obj instanceof String s) {
    System.out.println(s.toLowerCase()); // 直接使用 s
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 變數 <code>s</code> 的作用域僅限於 <code>if</code> 區塊內（或邏輯符合的範圍內）
</div>

<!--
【核心說明】
JDK 16 新語法：instanceof 判斷和轉型可以一次完成，更安全更簡潔。

【帶讀表格】
傳統：先 instanceof 判斷，再 (Dog) 轉型，兩步。
Pattern Matching：if (a instanceof Dog d)，判斷成功同時把 d 宣告為 Dog 型態，一步搞定。

【帶讀程式碼】
if (obj instanceof String s) 中，s 在 if 區塊內直接可用，不需要再轉型。

💼 業界實務：
現代 Java 專案已大量採用 Pattern Matching 取代傳統的 instanceof + 強制轉型組合。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 靜態 / 動態綁定

<!--
【段落轉換】
多形的底層機制是動態綁定。這個概念解釋了為什麼 Animal 變數能呼叫到 Dog 的方法。
-->
---
layout: default
---

# Static Binding vs Dynamic Binding

| 類型 | 時機 | 適用 |
| --- | --- | --- |
| 靜態綁定 (Static Binding) | 編譯時期 (compile time) | `static`、`final`、`private` 方法 |
| 動態綁定 (Dynamic Binding) | 執行時期 (runtime) | Override 後的一般方法 |

```java
Animal a = new Dog();
a.move(); // 動態綁定：執行時才確定呼叫 Dog.move()
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 執行時期多形的底層就是動態綁定：JVM 根據物件的實際型態決定執行哪個方法
</div>

<!--
【帶讀表格】
靜態綁定：在「寫程式的時候」就決定呼叫哪個方法，適用於 static、final、private 方法。
動態綁定：在「程式執行的時候」才決定，適用於 Override 的一般方法。

【帶讀程式碼】
a.move() 是動態綁定——編譯時 a 是 Animal 型態，但執行時 JVM 看到 a 實際上是 Dog，所以呼叫 Dog.move()。

💼 業界實務：
動態綁定是多形的基礎，也是 Spring Boot 依賴注入（DI）能運作的根本原理。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 巢狀類別 Nested Classes

<!--
【段落轉換】
最後一個主題是巢狀類別——在類別裡定義另一個類別。這個技術在 Java 裡有幾種形式，其中匿名內部類別是最常見的，等等在 Spring Boot 或 Android 開發裡你一定會看到。
-->
---
layout: default
---

# 巢狀類別的種類

| 類型 | 說明 | 使用場景 |
| --- | --- | --- |
| 一般內部類別 (Inner Class) | 定義在外部類別內，可存取外部所有成員 | 資料封裝、輔助類別 |
| 方法內部類別 (Method-local) | 定義在方法內，只有該方法可使用 | 極少使用 |
| 匿名內部類別 (Anonymous) | 宣告同時建立物件，一次性使用 | Override 介面或抽象方法 |

<!--
【帶讀表格】
三種巢狀類別各有使用場景。最常用的是匿名內部類別，其次是一般內部類別，方法內部類別幾乎不用。

💼 業界實務：
Java 8 之前，Lambda 表達式不存在，匿名內部類別是實作「介面的臨時版本」的標準做法。Java 8 之後 Lambda 取代了大部分匿名類別的使用場景，但理解匿名類別有助於讀懂舊程式碼。
-->
---

# 一般內部類別 — 宣告

```java
class OuterClass {
    int x = 10;
    class InnerClass {
        void display() {
            System.out.println("x = " + x); // 直接存取外部屬性
        }
    }
}
```

<!--
【帶讀程式碼】
InnerClass 定義在 OuterClass 裡面，可以直接存取外部類別的屬性 x，不需要傳參數。

【類比說明】
就像公司內部的某個部門，可以直接用公司的資源，外面的人沒辦法直接存取這個部門。
-->
---

# 一般內部類別 — 建立物件

必須先建立外部類別物件，再建立內部類別物件：

```java
OuterClass outer = new OuterClass();
OuterClass.InnerClass inner = outer.new InnerClass();
inner.display(); // x = 10
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 內部類別可宣告為 <code>private</code>，限制只有外部類別能使用
</div>

<!--
【帶讀程式碼】
建立內部類別物件需要先有外部類別物件：outer.new InnerClass()。

⚠️ 學生常見誤解：
不能直接 new InnerClass()，因為內部類別需要依附於外部類別的實例存在。這和靜態類別（static nested class）不同。
-->
---

# 方法內部類別 (Method-local Inner Class)

類別宣告在方法內，只有該方法可使用此類別：

```java
class School {
    void showRoom() {
        class MathRoom {       // 只有 showRoom() 能使用
            int students = 40;
        }
        MathRoom m = new MathRoom();
        System.out.println("學生數：" + m.students);
    }
}
```

<!--
【核心說明】
方法內部類別定義在方法裡面，生命週期跟著方法走，方法結束就消失。

【使用場景】
這個語法很少用，了解有這個東西就好。現代 Java 通常用 Lambda 或方法參考取代。
-->
---

# 匿名內部類別 — 最簡範例

宣告的同時直接建立物件並 Override 方法：

```java
Animal myAnimal = new Animal() {
    @Override
    public void move() {
        System.out.println("特殊移動方式");
    }
};
myAnimal.move();
```

<!--
【核心說明】
匿名內部類別讓你在「宣告物件的同時」Override 方法，一次性使用不需要另外建立新類別。

【帶讀程式碼】
new Animal() { @Override public void move() {...} }：同時建立了一個「匿名的 Animal 子類別」的物件，覆寫了 move()。

【類比說明】
就像臨時工——你只需要他工作一次，就地招募、當場上工、用完即走，不需要正式建立一個新員工資料。
-->
---

# 匿名內部類別 — 當作參數傳送

Java 允許把匿名類別物件直接作為參數傳入方法：

```java
obj.showAnimal(new Animal() {
    @Override
    public void move() {
        System.out.println("移動中...");
    }
});
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ 雖然合法，但降低程式碼可讀性與維護性，不建議大量使用
</div>

<!--
【帶讀程式碼】
匿名類別物件直接當參數傳進去，叫做 Inline 寫法。

⚠️ 注意：
雖然這樣寫合法，但如果 Override 的方法很長，程式碼可讀性會極其低下。現代 Java 偏好用 Lambda 替代——兩者效果相同但 Lambda 更簡潔，在第 25 章我們會學到。
-->
---

# 練習
### 任務說明

1. **繼承練習**：建立父類別 `Father`，子類別 `Son` 和 `Daughter`
   - `Father`：`name(String)`、`walk()` 印出 `name is walking!!!`
   - `Son`：Override `walk()` 印 `name is walking~~~`，加上 `playBall()`
   - `Daughter`：Override `walk()` 印 `name is walking@@@`，加上 `shopping()`

2. **多形練習**：建立 `Animal`、`Dog`、`Bird`
   - 各自 Override `move()` 方法
   - 用 `Animal[] animals = { new Dog(), new Bird() }` 搭配迴圈呼叫 `move()`

<!--
【出題前的鋪陳】
現在來實際練習繼承和多形。兩個題目，第一個練繼承語法，第二個練多形陣列。

【問題引導】
繼承練習：Father 是父類別，Son 和 Daughter 各自 Override walk()，並加上自己的方法。多形練習：怎麼用一個 Animal 陣列存放 Dog 和 Bird，然後一起呼叫 move()？

【等待與觀察】
給大家 5 分鐘動手寫，從繼承練習開始。
-->
---

# 練習
### 解題提示

1. **繼承結構**
   - 使用 `protected String name` 讓子類別能直接存取父類別屬性
   - 子類別建構方法用 `super(name)` 初始化父類別屬性

2. **多形陣列**
   - 先確認 `Dog` 和 `Bird` 各自有 `@Override` 的 `move()`
   - 宣告 `Animal[] animals = { new Dog("旺財"), new Bird("小翠") }`
   - 用 `for` 迴圈呼叫 `animals[i].move()` 觀察多形效果

<!--
【帶讀解題】
繼承練習重點：
- 父類別 Father 有 protected String name 和 walk() 方法
- 子類別 Son 和 Daughter 用 super(name) 初始化，各自 Override walk()

多形練習重點：
- Animal[] animals = { new Dog(...), new Bird(...) }：陣列用父類別型態宣告，存放子類別物件
- 用 for 迴圈 animals[i].move()，觀察不同物件呼叫相同方法得到不同結果

💡 練習完記得把輸出印出來驗證！
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【收尾】
今天學了繼承、IS-A/HAS-A 關係、Override vs Overload、多形、靜態/動態綁定，還有巢狀類別。

【核心總結】
繼承讓你消除重複程式碼，多形讓你的設計更彈性。這兩個是後面 Spring Boot 框架理解的基礎，一定要熟悉。

【Q&A 時間】
有任何不清楚的地方，現在可以問！
-->
---
layout: end
---

# 本章結束
### 繼承讓程式碼更精簡，多形讓設計更彈性

<!--
[依脈絡推斷]
本章結束。繼承讓程式碼更精簡，多形讓設計更彈性——把這句話記下來，這就是這章最重要的概念。
-->
