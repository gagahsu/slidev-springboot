---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Java 繼承與多形（進階／自學）
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
    進階自學內容
  </p>
  <Link to="home" style="color:#9dc4c4;font-size:0.85rem;margin-top:2rem;text-decoration:none;letter-spacing:0.05em;">← 返回目錄</Link>
</div>

<!--
哈囉大家，歡迎來到「繼承與多形」的進階自學篇！基礎版我們已經學會 `extends`、`super`、Override、多型、向上／向下轉型、Pattern Matching for instanceof、Record 基本語法這些核心機制，這份自學內容會帶我們往三個方向延伸。

為什麼要學這些？因為 Java 這幾年版本更新很快，Sealed Classes 是現代 Java 專案常見的新寫法，能讓繼承關係更安全；Records 的繼承限制則補齊基礎版沒教到的細節；而巢狀類別和靜態／動態綁定，是讀懂 Spring Boot 等框架原始碼時一定會遇到的概念。

學完這份自學內容，我們會知道怎麼用 Sealed Classes 精確控制繼承範圍、Records 的繼承限制規則、靜態綁定和動態綁定的差異，以及巢狀類別與匿名內部類別的用法。準備好就開始吧！
-->

---
layout: default
---

# Outline

- **Sealed Classes 與 Records** — 密封類別、permits、密封子類別修飾符、Records 繼承限制（Record 基本語法基礎課已學過）
- **靜態／動態綁定** — Static Binding vs Dynamic Binding（練習會複習基礎課學過的 Pattern Matching for instanceof）
- **巢狀類別與匿名內部類別** — Inner Class、Method-local、Anonymous Class

<!--
這份自學內容分成三大塊，循序漸進：先看 Sealed Classes 這個 JDK 較新版本帶來的語法糖，讓我們的類別設計更嚴謹，再補齊 Records 的繼承限制細節；接著看靜態／動態綁定，補齊我們對「方法呼叫時機」的理解；最後進入巢狀類別，這是物件導向設計裡常被忽略、但實務上很常見的技巧。

如果大家還記得基礎版教過的 `extends`、Override、多型、Pattern Matching for instanceof、Record，這份內容會非常順。準備好的話，我們開始吧！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Sealed Classes 與 Records

<!--
想像一下，我們設計了一個 Shape 父類別，原本只想讓 Circle 和 Square 繼承它，但因為 Java 沒有限制，任何人都可以寫一個 Triangle extends Shape，甚至寫出奇怪的子類別破壞我們原本的設計。

這就是 Sealed Classes 要解決的問題——讓父類別「點名」哪些子類別可以繼承它，其他人想繼承都不行。而 Records 則是另一個方向的語法糖，專門解決「純資料類別要寫一大堆 getter、equals、hashCode、toString」的麻煩。

這兩個都是近幾年 Java 版本新增的功能，在現代專案的程式碼裡會越來越常見，值得我們花時間搞懂。
-->

---
layout: default
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
核心說明：Sealed Classes 是 JDK 17 的新功能，讓父類別「點名」只有特定子類別可以繼承它。

帶大家看程式碼：`sealed class Shape permits Circle, Square`，Shape 只允許 Circle 和 Square 繼承，其他類別繼承會編譯錯誤。

業界實務：設計 API 時，有時候我們不希望使用者任意繼承自己的類別（防止破壞設計意圖），Sealed Classes 就是為此而生。
-->

---
layout: default
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
帶讀表格：密封類別的子類別必須明確宣告自己的「開放程度」——`final` 不能再被繼承（通常用這個）；`sealed` 繼續密封，自己也指定 permits；`non-sealed` 完全開放，任何人都可以繼承這個子類別。

生活化比喻：就像加盟店的模式——總公司（sealed class）指定哪些加盟主（permits），加盟主可以選擇繼續限制（`sealed`）、不再開放（`final`），或允許所有人加盟（`non-sealed`）。

⚠️ 易錯點：忘記在子類別加上這三種修飾符之一，會直接編譯錯誤——這是 Java 強制要求的，不能省略。
-->

---
layout: default
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
💡 當我們新增一個 permits 子類別時，編譯器會提醒我們更新所有相關的 <code>switch</code> 邏輯
</div>

<!--
核心說明：Sealed Classes 的最大優點是可以和 `switch` 搭配，讓編譯器幫我們檢查是否考慮到所有子類別。

帶讀程式碼：`switch(shape)` 不需要 `default`，因為編譯器知道 Shape 只有 Circle 和 Square 兩種子類別，兩個都處理了就完整了。

業界實務：這個特性讓「新增子類別時忘記更新 switch」的 bug 變成編譯錯誤而不是執行時才發現，大大提高程式碼的安全性。
-->

---
layout: default
---

# Records 與繼承限制

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>複習：</b>Record 基本語法（自動產生 constructor/getter/equals/hashCode/toString）已在基礎課教過，這裡補充繼承相關的限制規則。
</div>

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
帶讀表格：Records 有幾個限制要注意——不能被繼承（隱含 `final`）；不能繼承其他類別（隱含繼承 `java.lang.Record`）；但可以實作介面（interface）。

⚠️ 易錯點：Records 的欄位是 immutable（不可變），建立後不能修改。這是設計上的選擇，讓資料物件更安全，跟我們之前學的一般 class 可以隨意改欄位值不一樣。
-->

---
layout: default
---

# 練習 1 (自學)：Sealed Classes 與 Records

### 任務說明

1. 設計一個 `sealed interface Vehicle permits Car, Bike`
   - `Car` 宣告為 `final`，`Bike` 宣告為 `final`
2. 將 `Car` 和 `Bike` 改寫成 `record`：
   - `record Car(String plate, int wheels) implements Vehicle { }`
   - `record Bike(String brand, int wheels) implements Vehicle { }`
3. 寫一個 `switch` 表達式，依照 `Vehicle` 的實際型態印出不同訊息（不需要 `default`）

<!--
任務鋪陳：回顧一下，我們剛剛學到 Sealed Classes 可以限制誰能繼承（或實作），Records 可以快速建立資料類別，兩者搭配 `switch` 還能讓編譯器幫我們檢查窮舉性。這題請大家把這三個概念串起來。

引導思考：如果 `Vehicle` 是 `sealed interface`，`Car` 和 `Bike` 都用 `record` 實作，`switch` 裡可以省略哪個區塊？為什麼編譯器敢讓我們省略？
-->

---
layout: default
---

# 練習 1 (自學)：解題提示

### 提示說明

```java
sealed interface Vehicle permits Car, Bike { }

record Car(String plate, int wheels) implements Vehicle { }
record Bike(String brand, int wheels) implements Vehicle { }
```

```java
static String describe(Vehicle v) {
    return switch (v) {
        case Car c -> "汽車 " + c.plate() + "，" + c.wheels() + " 輪";
        case Bike b -> b.brand() + " 腳踏車，" + b.wheels() + " 輪";
        // 不需要 default，編譯器知道只有 Car 和 Bike
    };
}
```

<!--
提示說明：`record` 實作 `interface` 的語法和一般 class 完全一樣，只是欄位、getter、`equals`、`hashCode`、`toString` 全部自動產生，省下大量重複程式碼。

提醒大家，這題的重點是體會「`sealed` + `record` + `switch`」這個組合在現代 Java 專案裡有多簡潔——傳統寫法可能要寫三個 class、各自的 getter，再加上 `instanceof` 判斷，現在只需要這短短幾行。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 靜態／動態綁定

<!--
段落轉換：第二部分我們來看一個比較「底層」的概念——靜態綁定與動態綁定，它解釋了「為什麼父類別變數能呼叫到子類別覆寫後的方法」這個多型背後的機制（Pattern Matching for instanceof 基礎課已經學過，等一下的練習會用到）。

這個概念看起來抽象，但其實是基礎版多型內容的延伸——理解它之後，我們對 Java 方法呼叫的運作方式會有更扎實的掌握。
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
帶讀表格：靜態綁定（static binding）是在「寫程式的時候」就決定呼叫哪個方法，適用於 `static`、`final`、`private` 方法；動態綁定（dynamic binding）是在「程式執行的時候」才決定，適用於覆寫（`override`）後的一般方法。

帶讀程式碼：`a.move()` 是動態綁定——編譯時 `a` 是 Animal 型態，但執行時 JVM 看到 `a` 實際上是 Dog，所以呼叫 `Dog.move()`。

業界實務：動態綁定是多型的基礎，也是 Spring Boot 依賴注入（DI）能運作的根本原理——容器注入的是介面型態，但執行時實際呼叫的是具體實作類別的方法。
-->

---
layout: default
---

# 練習 2 (自學)：Pattern Matching 與綁定判斷

### 任務說明

1. 建立 `Animal`、`Dog extends Animal`、`Cat extends Animal`，各自 `override` `move()`
2. 寫一個方法 `inspect(Object obj)`：
   - 用 **Pattern Matching for instanceof** 判斷 `obj` 是 `Dog` 或 `Cat`，分別印出不同訊息並呼叫該子類別專屬的方法（例如 `Dog` 的 `barking()`）
3. 思考：若 `Animal` 內有一個 `static void info()` 方法，`Dog` 也定義了同名 `static void info()`，用 `Animal a = new Dog(); a.info();` 會呼叫到哪一個？為什麼？

<!--
任務鋪陳：回顧一下，我們在基礎版學過向下轉型要先用 `instanceof` 判斷再 `(Dog) a` 轉型；這題請改用 Pattern Matching 一步完成。第三小題則是回顧基礎版的「方法隱藏」概念，搭配這份自學內容的靜態／動態綁定來思考。

引導思考：第三小題的關鍵在於——`static` 方法到底是看「變數的宣告型態」還是「物件的實際型態」？這跟 `move()` 這種一般方法的行為一樣嗎？
-->

---
layout: default
---

# 練習 2 (自學)：解題提示

### 提示說明

```java
static void inspect(Object obj) {
    if (obj instanceof Dog d) {
        System.out.println("這是一隻狗");
        d.barking();
    } else if (obj instanceof Cat c) {
        System.out.println("這是一隻貓");
        c.meow();
    }
}
```

- 第 3 小題答案：`a.info()` 會呼叫 **Animal 的 `info()`**，因為 `static` 方法屬於方法隱藏（method hiding），由變數的**宣告型態**（Animal）決定，是靜態綁定，不是動態綁定。

<!--
提示說明：Pattern Matching 在 `if-else if` 鏈中可以連續使用，每個分支各自拿到對應子類別型態的變數（`d`、`c`），可以直接呼叫子類別專屬方法。

提醒大家，第 3 小題正是「動態綁定」和「靜態綁定」最容易搞混的地方——`move()` 這種一般方法是動態綁定，看物件實際型態；但 `static` 方法是靜態綁定，看變數宣告型態。這個差異常常出現在面試題裡，務必搞清楚。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 巢狀類別與匿名內部類別

<!--
段落轉換：最後一個主題是巢狀類別——在類別裡定義另一個類別。這個技術在 Java 裡有幾種形式，其中匿名內部類別是最常見的，在 Spring Boot 或 Android 開發裡都會看到它的身影。

想像一下，如果我們只需要某個介面或抽象類別的「一次性」實作，卻要為它另外寫一個完整的 class、取名字、再 `new` 出來，會不會有點大費周章？巢狀類別，尤其是匿名內部類別，就是為了解決這種「只用一次」的情境而存在的。
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
帶讀表格：三種巢狀類別各有使用場景。最常用的是匿名內部類別，其次是一般內部類別，方法內部類別幾乎不用，了解有這個東西就好。

業界實務：Java 8 之前，Lambda 表達式不存在，匿名內部類別是實作「介面的臨時版本」的標準做法。Java 8 之後 Lambda 取代了大部分匿名類別的使用場景，但理解匿名類別有助於讀懂舊程式碼。
-->

---
layout: default
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
帶讀程式碼：`InnerClass` 定義在 `OuterClass` 裡面，可以直接存取外部類別的屬性 `x`，不需要傳參數。

生活化比喻：就像公司內部的某個部門，可以直接用公司的資源，外面的人沒辦法直接存取這個部門。
-->

---
layout: default
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
帶讀程式碼：建立內部類別物件需要先有外部類別物件——`outer.new InnerClass()`。

⚠️ 易錯點：不能直接 `new InnerClass()`，因為內部類別需要依附於外部類別的實例存在。這和靜態類別（static nested class）不同，初學者很容易漏寫 `outer.`。
-->

---
layout: default
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
核心說明：方法內部類別定義在方法裡面，生命週期跟著方法走，方法結束就消失，就像一個臨時搭建的小房間，用完就拆掉。

提醒大家，這個語法很少用，了解有這個東西就好。現代 Java 通常用 Lambda 或方法參考取代。
-->

---
layout: default
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
核心說明：匿名內部類別讓我們在「宣告物件的同時」覆寫（`override`）方法，一次性使用不需要另外建立新類別。

帶讀程式碼：`new Animal() { @Override public void move() {...} }`——同時建立了一個「匿名的 Animal 子類別」的物件，覆寫了 `move()`。

生活化比喻：就像臨時工——我們只需要他工作一次，就地招募、當場上工、用完即走，不需要正式建立一個新員工資料。
-->

---
layout: default
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
帶讀程式碼：匿名類別物件直接當參數傳進去，叫做 Inline 寫法。

⚠️ 易錯點：雖然這樣寫合法，但如果覆寫的方法很長，程式碼可讀性會極其低下。現代 Java 偏好用 Lambda 替代——兩者效果相同但 Lambda 更簡潔，在 Stream／Lambda 章節我們會學到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
這份自學內容學了 Sealed Classes、Records、靜態／動態綁定、巢狀類別，接下來兩個練習要把巢狀類別、Sealed Classes、Records、Pattern Matching 這些重點串起來，動手做一遍。
-->

---
layout: default
---

# 練習 3 (綜合)：巢狀類別綜合應用

### 任務說明

1. 建立 `class Zoo`，內含一個一般內部類別 `class Cage`：
   - `Zoo` 有屬性 `String zooName`
   - `Cage` 有方法 `show()`，印出 `zooName + " 的籠子"`（直接存取外部屬性）
2. 在 `main` 方法中建立 `Zoo` 物件，再建立 `Cage` 物件並呼叫 `show()`
3. 額外練習：使用**匿名內部類別**建立一個 `Animal` 的子類別物件，覆寫 `move()` 印出 `"匿名動物移動中"`，並呼叫 `move()`

<!--
任務鋪陳：回顧一下，這份自學內容學了一般內部類別「依附外部類別存在」的特性，以及匿名內部類別「宣告同時建立物件」的寫法。這題請把兩者都練習一次。

引導思考：第 1 小題建立 `Cage` 物件時，要怎麼透過 `Zoo` 物件才能 `new` 出來？跟我們平常 `new` 一般 class 有什麼不同？
-->

---
layout: default
---

# 練習 3 (自學)：解題提示

### 提示說明

```java
class Zoo {
    String zooName = "動物王國";
    class Cage {
        void show() {
            System.out.println(zooName + " 的籠子");
        }
    }
}
```

```java
Zoo zoo = new Zoo();
Zoo.Cage cage = zoo.new Cage();
cage.show(); // 動物王國 的籠子

Animal a = new Animal() {
    @Override
    public void move() { System.out.println("匿名動物移動中"); }
};
a.move();
```

<!--
提示說明：建立 `Cage` 物件的關鍵是 `zoo.new Cage()`——一定要先有 `Zoo` 物件，才能用它來建立內部類別物件，這是一般內部類別和靜態巢狀類別最大的差異。

匿名內部類別的部分，重點是 `new Animal() { ... }` 這個語法——宣告的同時就完成了 `extends Animal` 並 `override` `move()`，不需要另外取名字。
-->

---
layout: default
---

# 練習 4 (綜合)：密封圖形系統

### 任務說明

把這份自學內容的三個主題串起來，設計一個簡化的圖形系統：

1. 定義 `sealed interface Shape permits Circle, Rectangle`
2. `Circle` 和 `Rectangle` 都用 `record` 實作，並各帶一個 `double area()` 方法
3. 寫一個 `printArea(Object obj)` 方法：
   - 用 **Pattern Matching for instanceof** 判斷 `obj instanceof Shape s`
   - 再用 `switch` 印出 `s` 的型態名稱與 `area()` 結果（不需要 `default`）

<!--
任務鋪陳：這是這份自學內容的綜合練習，把 Sealed Classes、Records、Pattern Matching 三個主題結合在一起，再加上前面學到的 `switch` 窮舉檢查。

引導思考：`Object obj` 進來之後，要先用 Pattern Matching 確認它「是不是 Shape」，再用 `switch` 判斷「是哪一種 Shape」——為什麼要分兩步？如果 `obj` 根本不是 `Shape`，會發生什麼事？
-->

---
layout: default
---

# 練習 4 (綜合)：解題提示

### 提示說明

```java
sealed interface Shape permits Circle, Rectangle { }

record Circle(double radius) implements Shape {
    double area() { return radius * radius * Math.PI; }
}
record Rectangle(double w, double h) implements Shape {
    double area() { return w * h; }
}
```

```java
static void printArea(Object obj) {
    if (obj instanceof Shape s) {
        String result = switch (s) {
            case Circle c -> "Circle 面積：" + c.area();
            case Rectangle r -> "Rectangle 面積：" + r.area();
        };
        System.out.println(result);
    }
}
```

<!--
提示說明：第一層 `if (obj instanceof Shape s)` 過濾掉「根本不是 Shape」的物件，確保進到 `switch` 的一定是 `Circle` 或 `Rectangle`，所以 `switch` 才能省略 `default`。

提醒大家，這正是 Sealed Classes 搭配 Pattern Matching 的威力——編譯器在 `switch` 階段就知道「窮舉所有可能」，我們不用擔心漏掉某個子類別，也不需要寫一堆 `instanceof` 判斷。把這份自學內容的三個主題串起來，相信我們對現代 Java 的型別設計會有更完整的認識！
-->

---
layout: end
---
