---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Java 繼承與多形
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
    繼承與多形
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用繼承消除重複，用多形擴展彈性」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
哈囉大家，今天我們要學的是繼承（Inheritance）和多形（Polymorphism），這是物件導向程式設計最核心的兩個概念。

為什麼要學這個？我們有沒有寫過類似的程式碼，複製貼上之後只改一點點？繼承就是讓我們把「共同的部分」抽出來，寫一次就好。多形則讓我們的程式更靈活，之後新增功能時不需要修改舊的程式碼。

學完這章之後，我們就能設計出有繼承關係的類別體系，用多形讓程式碼以一對多的方式運作，也能讀懂業界常見的 Spring Boot 框架程式碼。準備好就開始吧！
-->
---
layout: default
---

# Outline

- **繼承 (Inheritance)** — extends 語法、存取修飾符、繼承類型、final
- **IS-A 與 HAS-A 關係** — instanceof、聚合、組合
- **Override 與 Overload** — Override 規則、super、@Override、Overload 對比
- **多形 (Polymorphism)** — 編譯時期 vs 執行時期、型別轉型、Pattern Matching for instanceof
- **Record 簡介** — 現代化資料類別語法

<!--
今天的內容分成五大塊：先從繼承的語法和機制開始，然後討論兩種物件關係（IS-A 和 HAS-A），接著深入 `override` 和 `overload` 的差異，然後是多形，最後認識 Record 這個現代化的資料類別語法。

這章的概念環環相扣，繼承是多形的基礎。跟著順序學，不要急著跳後面，每個概念都會在後面用到喔！
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 繼承 Inheritance

<!--
先從繼承開始。繼承的核心概念其實只有一句話：讓子類別直接擁有父類別的屬性和方法，不用重寫一遍。

想像一下樂高積木——如果有一塊「基礎積木」已經做好了，後面要做的積木只要在它上面加裝飾就好，不需要從頭再做一塊一模一樣的基礎。繼承就是程式裡的這個概念，接下來我們就來看看怎麼用。
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
為什麼需要繼承？看這個表格就知道了。Animal、Dog、Bird 三個類別裡，`name`、`eat()`、`sleep()` 都重複出現了三次。這代表如果 `eat()` 要改邏輯，我們要改三個地方——這就是「程式碼重複」的問題。

生活化比喻：就像公司的員工手冊，基本規定所有人都一樣，不需要每個人的合約都重寫一次。繼承就是把「共同的規定」放在父類別，所有子類別自動適用。

業界實務上，重複程式碼是維護的惡夢，繼承是解決方案之一。原則就是 DRY（Don't Repeat Yourself）——寫一次就好。
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
帶大家看一下這段程式碼。`extends` 這個關鍵字就是建立繼承關係，`class Dog extends Animal` 表示 Dog 繼承 Animal。

Dog 類別裡只定義了 `barking()`，但因為繼承了 Animal，它自動擁有 `name` 屬性、`eat()` 和 `sleep()` 方法，不用再重複寫一次。

⚠️ 易錯點：繼承的是 Animal 的「定義」，不是某個 Animal 物件的資料。每個 Dog 實例都有自己的 `name`，不是共享同一個。
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
這個範例的目標是：看一個完整的 Animal 和 Dog 範例。帶大家看兩個關鍵點：第一，Animal 的建構方法（constructor）接受 `name` 參數，用 `this.name` 存起來；第二，Dog 的建構方法呼叫 `super(name)`，把 `name` 傳給父類別的建構方法。

⚠️ 易錯點：`super(name)` 是關鍵！子類別不能直接設定父類別的屬性（如果是 `private`），要透過 `super()` 呼叫父類別的建構方法來初始化。
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
這是一個很重要的規則：建立子類別物件時，Java 會先執行父類別的建構方法，再執行子類別的建構方法。這個順序是固定的，不能反過來。

生活化比喻：這就像先有父母才有小孩——蓋房子的時候，地基（父類別）一定要先打好，才能往上蓋樓層（子類別）。下一頁我們用實際輸出來驗證這個順序。
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
這個範例的目標是：驗證上一頁說的「父先子後」順序。帶大家看執行結果——`new Dog("旺財")` 執行時，會先印出 `"Animal 建構"`，再印出 `"Dog 建構"`。

⚠️ 易錯點：如果父類別沒有無參建構方法（只有有參數的），而子類別沒有呼叫 `super(...)`，編譯就會報錯。Java 只會自動呼叫父類別的「無參建構方法」，有參數的建構方法要我們自己呼叫。
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
存取修飾詞（access modifier）決定「誰能看到這個屬性或方法」，這張表很重要，建議大家記下來。

生活化比喻：可以把它想成一間房子的不同空間——`public` 是大門口，誰都能進來；`protected` 是家庭客廳，家人（同套件、子類別）能進，外人不行；（無修飾詞）是自家後院，只有同社區（同套件）的人能用；`private` 則是自己的私人保險箱，只有自己能開。

業界實務上，父類別屬性通常設為 `protected`，讓子類別能直接存取，但外部不能亂改。方法則視需要設成 `public` 或 `protected`。
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
layout: default
---

# 🎬 AI 協作時刻：建構子順序 + protected 傻傻分不清

「父類別建構子先執行」跟「super() 要放第一行」常被學生記混，protected 的存取範圍也常搞錯，考前讓 AI 幫你出題驗收：

**要用的 Prompt：**

> 請針對「子類別建構方法呼叫 super() 的規則」和「protected 存取層級」這兩個主題，
> 出 3 題容易猜錯的是非題或選擇題，先不要公布答案，
> 等我回答後才公布並解釋為什麼。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見誤解：</b> 是「父類別的建構方法一定先執行」，不是「先寫的程式碼先執行」；<code>protected</code> 是「同套件 + 子類別可以存取，其他外部類別不行」，不是「只有子類別可以」。
</div>

<!--
【操作提示】
現場貼上 prompt，讓 AI 出題考驗大家對「建構子執行順序」與「protected 存取範圍」的理解，答錯的地方回頭對照「父類別建構方法的啟動順序」和「存取修飾符與繼承」這兩張投影片複習。

【收斂一句話】
建構子順序是「父先子後」，protected 是「子類別 + 同套件」——這兩條規則常被混在一起考，务必分開記熟。
-->
---
layout: default
---

# 練習 1：設計 Employee 繼承體系
### 任務說明

設計一套類別，練習 `extends`、`protected` 屬性與 `super()`：
1. 建立父類別 `Employee`，有 `protected String name` 與 `protected int baseSalary`，建構方法接收這兩個參數並印出 `"Employee 建構"`
2. `Employee` 有方法 `void showSalary()`，印出 `name + " 的底薪是 " + baseSalary`
3. 建立子類別 `Manager extends Employee`，多一個 `int bonus` 屬性；建構方法呼叫 `super(name, baseSalary)` 後印出 `"Manager 建構"`，並 `override` `showSalary()`，印出底薪與獎金的加總
4. 在 `main()` 中建立一個 `Manager` 物件，呼叫 `showSalary()`，並觀察建構方法的執行順序

**預期輸出（最後兩行為呼叫 `showSalary()` 的結果）：**
```
Employee 建構
Manager 建構
古古 的總薪資是 80000
```

<!--
【任務鋪陳】
這一節學了 `extends`、`protected`、`super()` 和「父類別建構方法先執行」這幾個重點，這個練習就是要把它們全部串起來，做一個更貼近實務的範例：員工與經理。

【引導思考】
想一想：`Manager` 的建構方法第一行一定要寫什麼？`name` 和 `baseSalary` 為什麼可以宣告成 `protected` 而不是 `private`？

【等待與觀察】
給大家 6 分鐘。如果不確定 `super(name, baseSalary)` 要放在哪一行，回頭看「父類別建構方法的啟動順序」那一頁。
-->
---
layout: default
---

# 練習 1：設計 Employee 繼承體系
### 解題提示

1. `Employee` 的 `protected` 屬性讓 `Manager` 能直接存取，建構方法印出 `"Employee 建構"`
2. `Manager extends Employee`，建構方法第一行 `super(name, baseSalary)`，再印出 `"Manager 建構"`
3. `Manager` 多了 `int bonus`，`override` `showSalary()` 印出 `baseSalary + bonus`

```java
class Employee {
    protected String name;
    protected int baseSalary;
    public Employee(String name, int baseSalary) {
        this.name = name;
        this.baseSalary = baseSalary;
        System.out.println("Employee 建構");
    }
    public void showSalary() {
        System.out.println(name + " 的底薪是 " + baseSalary);
    }
}
class Manager extends Employee {
    private int bonus;
    public Manager(String name, int baseSalary, int bonus) {
        super(name, baseSalary);
        this.bonus = bonus;
        System.out.println("Manager 建構");
    }
    @Override
    public void showSalary() {
        System.out.println(name + " 的總薪資是 " + (baseSalary + bonus));
    }
}
```

<!--
【帶讀解法】
重點有兩個：第一，`Manager` 的建構方法第一行必須是 `super(name, baseSalary)`，把共用的初始化邏輯交給父類別處理；第二，`new Manager(...)` 執行時，會先印出 `"Employee 建構"`，再印出 `"Manager 建構"`，驗證了「父先子後」的順序。

💼 業界實務：
這種「共同屬性放父類別、特殊邏輯子類別 override」的設計，是企業系統裡 `Employee`／`Manager`／`Director` 這類人事結構最常見的寫法。
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

兩者都是「類別 A 的屬性是類別 B 的物件」，**都不用 `extends`**，差在物件的生命週期關係：

| 類型 | 生命週期關係 | 例子 |
| --- | --- | --- |
| 聚合 (Aggregation) | B 可以獨立於 A 存在（弱擁有） | Car HAS-A Speed，Speed 可以外部建立再傳進來 |
| 組合 (Composition) | B 完全依附 A，A 消失 B 也跟著消失（強擁有） | Human HAS-A Heart，Heart 離開 Human 沒有意義 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見誤解：</b>組合（Composition）不是「用 <code>extends</code> 抽共用屬性」——那仍然是繼承（IS-A）。組合跟聚合一樣是「把物件當欄位」，只是擁有關係更緊密。
</div>

<!--
【帶讀表格】
HAS-A 是「把另一個物件當欄位」的關係，聚合和組合都屬於 HAS-A，兩者語法上都一樣（欄位是物件參考），差別純粹在於：這個物件離開了擁有者還有沒有意義。

【關鍵區別】
IS-A：Dog IS-A Animal → 用繼承（extends）
HAS-A：Car HAS-A Speed → 用屬性（把 Speed 當成 Car 的欄位），不管聚合或組合都一樣用屬性，不會用 extends

⚠️ 學生常見誤解：
很多教材會誤把「用 extends 抽取共用屬性到父類別」稱作組合，這是錯的——那仍然是百分之百的繼承（IS-A），只是用來共享程式碼，跟 HAS-A 完全無關。

💼 業界實務：
「組合優於繼承」（Composition over Inheritance）是物件導向設計原則之一：能用 HAS-A（把功能委派給另一個物件）解決的，不一定要用 IS-A（繼承）。
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
    private Speed s; // Car HAS A Speed，弱擁有
    public Car(Speed s) { this.s = s; } // 從外部傳入，Speed 可以獨立存在
    public int getCarSpeed() { return s.getSpeed(); }
}
```

<!--
【帶讀程式碼】
Car 有一個 Speed 物件作為屬性，getCarSpeed() 委託給 Speed 來處理速度邏輯。Car 和 Speed 是 HAS-A 關係。

【類比說明】
就像你的車子「有一個」速度計，車子自己不計算速度，交給速度計去做。這叫「委派」（Delegation）。這裡 Speed 是從外部傳進來的（建構子參數），代表 Speed 這個物件可以脫離 Car 單獨存在、被其他物件共用——這就是「弱擁有」。
-->
---

# HAS-A 組合範例 (Composition)

```java
class Engine {
    void start() { System.out.println("引擎發動"); }
}
```

```java
class Car {
    private final Engine engine; // Car HAS A Engine，強擁有
    public Car() { engine = new Engine(); } // 在建構子內自己建立，隨 Car 生滅
    void drive() { engine.start(); }
}
```

<!--
【帶讀程式碼】
Engine 是在 Car 的建構子裡自己 `new` 出來的，不是外部傳進來的。這代表 Engine 這個物件完全屬於這個 Car，Car 物件被回收時，這個 Engine 也一起被回收，沒有其他地方能拿到同一個 Engine 參考。

【比較說明】
聚合（前一頁）：Speed 從外部傳入，可以脫離 Car 獨立存在、被共用（弱擁有）。
組合（這頁）：Engine 在 Car 內部建立，生命週期完全綁定 Car（強擁有）。

兩者語法上都是「物件當欄位」，差別在於物件是外部傳入還是內部自建、能不能脫離擁有者獨立存在。
-->
---
layout: default
---

# 🎬 AI 協作時刻：AI 說能用繼承，先別急著信

問 AI「這兩個類別該用繼承還是組合」時，AI 有時會為了圖方便直接建議用 `extends` 共用程式碼——但這正是本節提醒過的常見誤用：

**要用的 Prompt：**

> 我有兩個類別：{貼上你的兩個類別設計，例如 Car 和 Engine，或 Car 和 Speed}，
> 請告訴我它們之間該設計成 IS-A（繼承）還是 HAS-A（聚合／組合），
> 並說明理由。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>批判性使用 AI：</b> 拿到 AI 的建議後，先回頭用這一節教的原則驗證一次：IS-A 用 <code>extends</code>（子類別「是一種」父類別），HAS-A 把物件當成欄位。AI 有時會為了「共用程式碼」就建議繼承，但如果語意上說不通（例如「汽車是一種引擎」），就是誤用，不能照單全收。
</div>

<!--
【操作提示】
現場示範拿 Car 和 Engine 去問 AI，觀察 AI 是否會誤答「Car extends Engine」；如果 AI 答錯，讓學生指出問題在哪裡，回頭對照「HAS-A 關係」那幾頁的說明。

【收斂一句話】
AI 給的設計建議不是標準答案，套用之前先用課堂教的 IS-A／HAS-A 判斷原則自己驗證一次。
-->
---
layout: default
---

# 練習 2 (綜合)：IS-A 與 HAS-A 綜合判斷
### 任務說明

設計一套類別，分辨 IS-A 與 HAS-A 關係：
1. 建立類別 `Engine`，有方法 `void start()`，印出 `"引擎發動"`
2. 建立類別 `Vehicle`，有方法 `void run()`，印出 `"車輛行駛中"`
3. 建立類別 `Car`：
   - `Car` **HAS-A** `Engine`（把 `Engine` 當成 `Car` 的屬性，在建構子內建立），新增方法 `void drive()`，先呼叫 `engine.start()`，再印出 `"汽車出發"`
   - `Car` **IS-A** `Vehicle`（用繼承：`Car extends Vehicle`）
4. 在 `main()` 中建立一個 `Car` 物件，依序呼叫 `run()` 與 `drive()`，並用 `instanceof` 驗證 `car instanceof Vehicle` 為 `true`

**預期輸出：**
```
車輛行駛中
引擎發動
汽車出發
true
```

<!--
【任務鋪陳】
這一節學了 IS-A（繼承）和 HAS-A（聚合／組合）兩種物件關係，這個練習就是要在同一個 `Car` 類別裡，同時體會這兩種關係：`Car` IS-A `Vehicle`（繼承來的），`Car` HAS-A `Engine`（屬性裡的物件）。

【引導思考】
想一想：為什麼 `Car` 跟 `Vehicle` 用 `extends`，但 `Car` 跟 `Engine` 不用 `extends`？如果反過來把 `Engine` 也設計成用繼承，會發生什麼問題？

【等待與觀察】
給大家 6 分鐘。提示：`Car` 裡面要有一個 `Engine` 型態的屬性，並在建構方法或宣告時 `new` 出來。
-->
---
layout: default
---

# 練習 2 (綜合)：IS-A 與 HAS-A 綜合判斷
### 解題提示

1. `Car extends Vehicle`：IS-A 關係，繼承 `run()`
2. `Car` 內含 `private Engine engine = new Engine();`：HAS-A 關係（聚合）
3. `drive()` 委派給 `engine.start()`，再印出自己的訊息

```java
class Engine {
    public void start() { System.out.println("引擎發動"); }
}
class Vehicle {
    public void run() { System.out.println("車輛行駛中"); }
}
class Car extends Vehicle {
    private Engine engine = new Engine(); // HAS-A
    public void drive() {
        engine.start();
        System.out.println("汽車出發");
    }
}
```

```java
Car car = new Car();
car.run();    // 繼承自 Vehicle（IS-A）
car.drive();  // 委派給 Engine（HAS-A）
System.out.println(car instanceof Vehicle); // true
```

<!--
【帶讀解法】
這題的關鍵在於「同時看到兩種關係」：`car.run()` 能直接呼叫，是因為 `Car extends Vehicle`（IS-A）；`car.drive()` 內部呼叫 `engine.start()`，是因為 `Car` 有一個 `Engine` 物件（HAS-A）。`instanceof` 驗證的是 IS-A 關係，跟 `Engine` 完全無關。

⚠️ 小提醒：
如果把 `Engine` 也設計成 `Car extends Engine`，語意上會變成「汽車是一種引擎」，這明顯不合理——這正是為什麼判斷該用 `extends` 還是「屬性」之前，要先想清楚兩個類別之間到底是 IS-A 還是 HAS-A。
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
layout: default
---

# 🎬 AI 協作時刻：Override vs Overload 一次記牢

「Override 跟 Overload 差在哪？」幾乎是每場 Java 面試的開場題，光看名字很像，內容卻完全不同。讓 AI 幫你整理成好記的對照表：

**要用的 Prompt：**

> 請幫我用表格整理 Java 的 Override（覆寫）和 Overload（多載）差異，
> 包含：中文名稱、是否需要繼承關係、方法名稱是否相同、參數是否相同、
> 決定時機（編譯期或執行期）。最後再幫我出一個生活化的比喻，讓我更容易記住兩者的差別。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>面試複習法：</b> 請 AI 用表格整理相似概念的差異，再加一句「幫我出個比喻」，比死記硬背更容易在面試現場臨場回想起來。
</div>

<!--
【操作提示】
現場貼上 prompt，讓 AI 產出對照表跟比喻，可以順便請學生比較 AI 的比喻跟課堂上教的比喻（父子做菜 vs 同名不同工）有沒有異曲同工之妙。

【收斂一句話】
遇到兩個容易搞混的概念，請 AI 做成表格加比喻，會比自己硬背更容易在面試現場臨場反應。
-->
---
layout: default
---

# 練習 3：Override 與方法隱藏辨析
### 認證模擬題（單選）

請看以下程式碼，執行 `main()` 之後的輸出是什麼？

```java
class Animal {
    static void sound() { System.out.println("Animal sound"); }
    void move() { System.out.println("Animal move"); }
}
class Dog extends Animal {
    static void sound() { System.out.println("Dog sound"); }
    @Override
    void move() { System.out.println("Dog move"); }
}
public class Main {
    public static void main(String[] args) {
        Animal a = new Dog();
        a.sound();
        a.move();
    }
}
```

A. `Animal sound` 與 `Animal move`
B. `Dog sound` 與 `Dog move`
C. `Animal sound` 與 `Dog move`
D. `Dog sound` 與 `Animal move`

<!--
【出題動機】
這題想測驗「方法隱藏（static 方法）」和「Override（一般方法）」在多形情境下的不同行為——這是 OCA/OCP 考試的經典陷阱題，也是面試常問的概念。

【解題引導】
提示：先分別看 `sound()` 和 `move()` 是不是 `static`，再想想「靜態綁定」和「動態綁定」分別是看變數的「宣告型態」還是物件的「實際型態」。
-->
---
layout: default
---

# 練習 3：Override 與方法隱藏辨析
### 解析

**正確答案：C**

- A. ❌ `a.move()` 是動態綁定，會呼叫 `Dog` 的 `move()`，不是 `Animal` 的
- B. ❌ `a.sound()` 是 `static` 方法，屬於方法隱藏，由變數的宣告型態 `Animal` 決定，不是 `Dog`
- C. ✅ `a.sound()` 是靜態綁定，看宣告型態 `Animal` → 印出 `Animal sound`；`a.move()` 是動態綁定，看實際型態 `Dog` → 印出 `Dog move`
- D. ❌ 兩個答案剛好對調，`sound()` 和 `move()` 的綁定方式判斷反了

<!--
【帶讀解法】
這題的關鍵在於 `static` 方法不參與多形：`a.sound()` 雖然 `a` 實際指向 `Dog` 物件，但因為 `sound()` 是 `static`，Java 在編譯期就依據變數的宣告型態 `Animal` 決定呼叫哪一個，這就是「方法隱藏」。

反過來，`move()` 是一般的實例方法，且 `Dog` 有 `@Override`，所以 `a.move()` 是動態綁定，執行期依物件的實際型態 `Dog` 來決定——這就是我們前面學的「執行時期多形」。記住：**`static` 方法看宣告型態，一般方法看實際型態**。
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
layout: default
---

# 🎬 AI 協作時刻：多形到底解決了什麼問題？

多形的語法看懂了，但很多初學者會卡在「這樣做到底有什麼好處？」讓 AI 用你熟悉的情境重新說一次：

**要用的 Prompt：**

> 我已經懂多形（Polymorphism）的語法：用父類別變數指向子類別物件，呼叫方法會執行子類別覆寫後的版本。
> 但我還是不太懂「這樣設計到底解決了什麼實際問題」。
> 請舉一個「如果沒有多形，程式會變得多難維護」的具體對比例子，100 字以內。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>學觀念的訣竅：</b> 語法會寫不代表真的懂，追問「這解決了什麼問題」，才能把技術細節連回實際的設計動機。
</div>

<!--
【操作提示】
現場貼上 prompt，讓 AI 舉例說明如果新增一種動物就要多寫一段 if-else 判斷型態，程式碼會越改越肥；有了多形，新增子類別完全不用動到既有程式碼。

【收斂一句話】
會寫語法只是第一步，能講出「這樣設計解決了什麼問題」才是真的懂——這也是面試官最愛追問的部分。
-->
---
layout: default
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

# Pattern Matching for instanceof（JDK 16+）

現代寫法可以把 `instanceof` 判斷跟轉型合併成一步：

| 方式 | 語法 |
| --- | --- |
| 傳統方式 | `if (a instanceof Dog) { Dog d = (Dog) a; ... }` |
| Pattern Matching | `if (a instanceof Dog d) { d.barking(); }` |

```java
Animal a = new Dog();

// 判斷的同時宣告變數 d，若符合則自動轉型
if (a instanceof Dog d) {
    d.barking(); // 直接使用 d，不需要再手動轉型
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 變數 <code>d</code> 的作用域僅限於 <code>if</code> 區塊內（或邏輯符合的範圍內）
</div>

<!--
【核心說明】
這是上一頁「先 instanceof 判斷、再強制轉型」的現代化寫法，JDK 16 開始可以一步完成。

【帶讀程式碼】
`if (a instanceof Dog d)` 判斷成功的同時，直接把 `d` 宣告為 `Dog` 型態，不需要再寫一行 `Dog d = (Dog) a;`。

💼 業界實務：
現代 Java 專案已大量採用 Pattern Matching 取代傳統的 `instanceof` + 強制轉型組合，junior 面試也常考這個語法。
-->

---
layout: default
---

# 🎬 AI 協作時刻：轉型出包了，讓 AI 幫忙除錯

`ClassCastException` 是新手最常踩到的地雷之一。與其自己乾瞪眼，不如把錯誤訊息連同程式碼一起丟給 AI：

**要用的 Prompt：**

> 我的程式在執行時噴出這個錯誤：
> `Exception in thread "main" java.lang.ClassCastException: class Bird cannot be cast to class Dog`
> 這是我的程式碼片段（貼上你的 instanceof / 轉型程式碼）。
> 請告訴我為什麼會出現這個錯誤，以及該怎麼修正比較安全。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>除錯訣竅：</b> 把「完整錯誤訊息」加「相關程式碼片段」一起貼給 AI，比只問「這是什麼意思」更容易得到能直接解決問題的答案。
</div>

<!--
【操作提示】
現場示範故意寫一段向下轉型錯誤的程式碼，讓它噴出 ClassCastException，再把錯誤訊息貼給 AI，讓 AI 建議改用 Pattern Matching for instanceof 來避免。

【收斂一句話】
遇到看不懂的錯誤訊息，把「錯誤訊息 + 程式碼」一起丟給 AI，是比自己土法煉鋼除錯快得多的方法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
這一章學了繼承的語法、IS-A／HAS-A 關係、Override 與多形，最後這個練習要把繼承和多形兩個重點串在一起，讓大家用同一組程式碼把整章的核心觀念走一遍。
-->

---

# 練習 4 (綜合)：繼承與多形總複習
### 任務說明

1. **繼承練習**：建立父類別 `Father`，子類別 `Son` 和 `Daughter`
   - `Father`：有 `protected String name` 欄位（透過建構方法傳入）、`walk()` 印出 `name is walking!!!`
   - `Son`：建構方法呼叫 `super(name)`，Override `walk()` 印 `name is walking~~~`，加上 `playBall()`
   - `Daughter`：建構方法呼叫 `super(name)`，Override `walk()` 印 `name is walking@@@`，加上 `shopping()`

2. **多形練習**：建立 `Animal`、`Dog`、`Bird`
   - 各自 Override `move()` 方法
   - 用 `Animal[] animals = { new Dog("旺財"), new Bird("小翠") }` 搭配迴圈呼叫 `move()`

<!--
【出題前的鋪陳】
現在來實際練習繼承和多形。兩個題目，第一個練繼承語法，第二個練多形陣列。

【問題引導】
繼承練習：Father 是父類別，Son 和 Daughter 各自 Override walk()，並加上自己的方法。多形練習：怎麼用一個 Animal 陣列存放 Dog 和 Bird，然後一起呼叫 move()？

【等待與觀察】
給大家 5 分鐘動手寫，從繼承練習開始。
-->
---

# 練習 4 (綜合)：繼承與多形總複習
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

# 紀錄類別 (Record) 簡介（JDK 16+）

只需宣告欄位，編譯器自動產生 constructor、getter、`equals`、`hashCode`、`toString`：

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
Records 是 JDK 16 的新功能，專為「純資料類別」設計。只要宣告欄位，編譯器自動產生所有我們需要的方法。

【帶讀程式碼】
`record Person(String name, int age)` 一行，自動有建構方法、getter（`name()`、`age()`）、`toString()`、`equals()`、`hashCode()`。傳統寫法要幾十行。

💼 業界實務：
DTO（Data Transfer Object）——在系統之間傳遞資料的物件——用 Record 非常合適，既簡潔又不可變（immutable），現在是junior面試常被問到的現代Java寫法。想深入了解 Record 的繼承限制，可以參考進階自學內容。
-->

---

# 總結

- **`extends` 建立繼承關係**，子類別自動擁有父類別的屬性與方法；建立子類別物件時，**父類別的建構方法一定先執行**
- **存取修飾符決定可見範圍**：父類別屬性慣用 `protected`；`super()` 呼叫父類別建構方法、`super.方法名()` 呼叫父類別方法，`final` 類別／方法禁止被繼承／覆寫
- **IS-A 用繼承（`extends`），HAS-A 用屬性（聚合或組合）** — 聚合是物件從外部傳入、可獨立存在，組合是物件在內部自建、生命週期綁定擁有者
- **Override 要繼承關係、方法簽名相同；Overload 不需繼承、參數必須不同** — `static` 方法不參與多形（方法隱藏是靜態綁定，看宣告型態）
- **執行時期多形三要件**：有繼承、子類別 Override、父類別變數參考子類別物件（Upcasting）；要拿回子類別專屬方法需 Downcasting，建議搭配 `instanceof` 或 Pattern Matching 避免 `ClassCastException`
- **`record` 讓純資料類別一行搞定**，自動產生建構方法、getter、`equals`、`hashCode`、`toString`

<!--
我們把這一章整理成六個重點。

第一，extends 建立繼承關係，子類別自動擁有父類別的屬性和方法，不用重複寫；而且建立子類別物件時，Java 一定會先執行父類別的建構方法，再執行子類別自己的，這個順序是固定的。

第二，存取修飾符決定誰能看到屬性和方法，父類別屬性通常設成 protected，讓子類別能直接存取但外部不能亂改；super() 用來呼叫父類別建構方法（必須放第一行）、super.方法名() 用來呼叫父類別被覆寫的方法；final 則可以禁止類別被繼承、方法被覆寫。

第三，IS-A 和 HAS-A 是判斷該用繼承還是屬性的關鍵：IS-A 用 extends（狗是一種動物）；HAS-A 是把物件當成欄位，聚合是物件從外部傳入、可以脫離擁有者獨立存在，組合是物件在擁有者內部自建、生命週期完全綁定。

第四，Override 跟 Overload 是最常考的一組概念：Override 需要繼承關係，方法名稱、參數、回傳型態都要相同（或協變）；Overload 不需要繼承，靠參數個數、型態、順序不同來區分。特別注意 static 方法不參與多形，這叫方法隱藏，是靜態綁定，看的是變數宣告型態，不是物件實際型態。

第五，執行時期多形需要三個條件：要有繼承關係、子類別要 Override 父類別方法、父類別變數要參考子類別物件，這就是向上轉型（Upcasting）。如果想拿回子類別專屬的方法，要向下轉型（Downcasting），建議先用 instanceof 或現代的 Pattern Matching for instanceof 語法確認型態，避免執行時拋出 ClassCastException。

第六，record 是 JDK 16 之後的新語法，專門用來簡化純資料類別，只要宣告欄位，編譯器就會自動產生建構方法、getter、equals、hashCode、toString，DTO 這類資料傳遞物件用 record 特別合適。

這六點加起來，就是這一章繼承與多形的完整地圖。如果對靜態／動態綁定的底層細節、巢狀類別、Sealed Classes 有興趣，歡迎參考本章的進階自學內容，下一章我們要繼續往下走了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【收尾】
今天學了繼承、IS-A/HAS-A 關係、Override vs Overload、多形、向上/向下轉型與 Pattern Matching for instanceof。想深入靜態/動態綁定、巢狀類別、Sealed Classes 跟 Records，可以參考進階自學內容。

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
