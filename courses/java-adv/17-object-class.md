---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Object 類別（進階／自學）
routeAlias: ch17
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
    Object 類別
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到 Object 類別的自學區！基礎課我們已經學過 equals()、hashCode()、toString() 的基本用法，這裡要更深入一點，看看這些方法背後真正的「遊戲規則」。

【為什麼要學這個？】
基礎版讓我們知道「怎麼用」，但業界開發、面試考題常會問到更深一層的東西：equals() 和 hashCode() 之間到底有什麼約定？clone() 為什麼大家都不愛用？還有那個被棄用的 finalize()，到底發生了什麼事？

【學習目標】
學完這份自學內容，我們會搞懂 equals/hashCode 合約的完整規則、知道 clone() 的陷阱在哪裡、了解 finalize() 被淘汰的原因，以及 Records 如何一行程式碼就把這些方法全部處理好。
-->

---
layout: default
---

# Outline

- **equals() 與 hashCode() 合約細節** — 兩者必須一致的規則與反例
- **Records 與 Object 方法** — 自動產生 toString、equals、hashCode
- **clone() 與 Cloneable** — 淺層複製的陷阱與替代方案
- **finalize() 的廢棄** — 為什麼不該再用它

<!--
【帶讀大綱】
這份自學內容分成兩大塊：第一塊是「equals 和 hashCode 的合約」，包含 Records 這個現代化解法；第二塊是「物件複製與資源清理」，也就是 clone() 和 finalize() 這兩個比較少人深入了解、但面試常考的主題。

【重點預告】
如果你只想記一句話，那就是：equals() 和 hashCode() 是綁在一起的雙人舞，clone() 和 finalize() 則是 Java 早期設計的「歷史遺跡」，現代開發已經有更好的替代方案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# equals() 與 hashCode() 合約細節

<!--
【段落轉換】
我們在基礎課學過怎麼覆寫 equals() 和 hashCode()，現在來看看，如果只改一個、不改另一個，會發生什麼「靈異現象」。
-->

---
layout: default
---

# equals() 與 hashCode() 的合約

| 規則 | 說明 |
| --- | --- |
| 相等必須相同 hash | `a.equals(b)` 為 `true` → `a.hashCode() == b.hashCode()` |
| 相同 hash 不必相等 | 允許碰撞（hash 相同但 `equals()` 不一定為 true） |
| Override 連動 | 覆寫 `equals()` **必須**同時覆寫 `hashCode()` |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> 只覆寫 <code>equals()</code>、忘記覆寫 <code>hashCode()</code>，物件在 <code>HashSet</code> / <code>HashMap</code> 中會「找不到」
</div>

<!--
【核心說明】
這份合約可以想成是「雙人舞的默契」：equals() 負責判斷「你我是不是同一個人」，hashCode() 負責決定「你我會被分到哪個置物櫃」。如果兩個人明明被判定是同一個人，卻被分到不同的置物櫃，那麼之後想再找到這個人就會出問題。

【生活化比喻】
就像圖書館的編號系統：如果兩本書內容完全一樣（equals 為 true），但編號（hashCode）卻不同，被分到不同書架，那麼系統就會以為它們是兩本不相關的書。

💼 業界實務：
這條規則是 Java 官方文件對 Object.hashCode() 明文寫下的合約，IDE 自動產生 equals/hashCode 時，背後就是依照這份規則設計的。
-->

---
layout: default
---

# 合約反例 — 只覆寫 equals()

```java
import java.util.Objects;

// 反例：只覆寫 equals()，忘記 hashCode()
class User {
    String id;
    String email;

    User(String id, String email) { this.id = id; this.email = email; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o instanceof User u)
            return Objects.equals(id, u.id) && Objects.equals(email, u.email);
        return false;
    }
    // ❌ 故意不覆寫 hashCode，模擬錯誤情境
}
```

<!--
【帶讀程式碼】
先看這個「半成品」的 User 類別。equals() 寫得很完整，第 1 行檢查是否同一參照，第 2 行用 instanceof 比較 id 和 email，邏輯都沒問題。但整個類別漏掉了 hashCode() 的覆寫——這就是合約裡說的「Override 連動」沒做到。

⚠️ 易錯點提醒：
這種寫法在 equals() 單獨測試時完全正常，問題只會在放進 HashSet / HashMap 之後才浮現，這也是為什麼這類 bug 特別難抓。

【預期結果】
目前看程式碼還看不出問題，下一頁我們實際跑一次，就會看到後果。
-->

---
layout: default
---

# 合約反例 — 驗證結果

```java
import java.util.HashSet;
import java.util.Set;

User u1 = new User("u001", "alice@mail.com");
User u2 = new User("u001", "alice@mail.com");

System.out.println(u1.equals(u2));    // true（equals 正確）

Set<User> set = new HashSet<>();
set.add(u1);
System.out.println(set.contains(u2)); // false！（hashCode 未覆寫）
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <code>u1</code> 和 <code>u2</code> 內容相同，<code>equals()</code> 回傳 <code>true</code>，但 <code>HashSet</code> 找不到 <code>u2</code>，因為兩者的 <code>hashCode()</code> 不同
</div>

<!--
【帶讀程式碼】
重點在最後兩行：u1 和 u2 內容一模一樣，equals() 也正確回傳 true，但放進 HashSet 之後，contains(u2) 卻回傳 false！

【生活化比喻】
這就像兩個內容一致的包裹被分到了不同的置物櫃號碼，當你拿著「內容相同」的包裹去問櫃台「我的包裹在嗎」，櫃台只會去對應的櫃子找，當然找不到。

⚠️ 易錯點提醒：
HashSet / HashMap 在判斷「是否已存在」時，會先用 hashCode() 縮小範圍，再用 equals() 精確比對。只要 hashCode() 不一致，equals() 根本沒有機會被執行到。

【預期結果】
這就是「Override 連動」這條規則存在的原因：equals() 和 hashCode() 必須基於相同的欄位、同步覆寫，缺一不可。
-->

---
layout: default
---

# 練習 1：找出合約破綻

### 任務說明

延續上面的 `User` 類別反例：

1. 補上正確的 `hashCode()`，使用 `Objects.hash(id, email)`
2. 重新執行 `set.contains(u2)`，確認結果變為 `true`
3. 思考：如果 `equals()` 比較的欄位和 `hashCode()` 用到的欄位不一樣，會發生什麼事？

<!--
【任務鋪陳】
剛才我們看到了一個活生生的「靈異現象」：內容相同的物件，在 HashSet 裡卻找不到。現在輪到我們動手把它修好。

【引導思考】
想一下，hashCode() 應該用哪些欄位來計算？和 equals() 比較的欄位有什麼關係？如果兩者用的欄位不一樣，會不會又製造出新的合約破綻？
-->

---
layout: default
---

# 練習 1：解題提示

1. 補上 `hashCode()`，欄位要與 `equals()` 一致：

```java
@Override
public int hashCode() {
    return Objects.hash(id, email); // 與 equals() 用同樣的欄位
}
```

2. 補上後重新執行驗證，`set.contains(u2)` 應變為 `true`
3. 若 `equals()` 比較 `id` 和 `email`，但 `hashCode()` 只用 `id`：
   - 兩個 `email` 不同但 `id` 相同的物件，`equals()` 為 `false`，但 `hashCode()` 卻相同
   - 這仍符合合約（相同 hash 不必相等），但容易造成不必要的雜湊碰撞，影響效能

<!--
【逐步解說】
解法的核心就是「複製貼上 equals() 用到的欄位」，丟進 Objects.hash() 就完成了。

⚠️ 易錯點提醒：
合約只規定「equals 為 true 時 hashCode 必須相同」，並沒有規定「hashCode 相同時 equals 必須為 true」。但欄位若不一致，會讓雜湊分布變差，物件容易擠在同一個置物櫃裡，效能跟著下降。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Records 與 Object 方法

<!--
【段落轉換】
剛才我們辛苦地手動處理 equals/hashCode 的合約問題，接下來介紹一個讓這些煩惱直接消失的現代化武器：Records。
-->

---
layout: default
---

# 紀錄類別 (Records) 與 Object 方法

JDK 16+ 的 **`record`** 會自動為我們 Override 所有重要的 `Object` 方法。

| 方法 | Record 的預設行為 |
| --- | --- |
| `toString()` | 顯示類別名與所有屬性值 |
| `equals()` | 比較所有屬性的內容 (State-based) |
| `hashCode()` | 根據所有屬性產生雜湊值 |

```java
// 一行代碼搞定 toString/equals/hashCode
record Point(int x, int y) { }

Point p1 = new Point(10, 20);
System.out.println(p1); // Point[x=10, y=20]
```

<!--
【核心說明】
回想一下我們剛才花了好幾頁討論的 equals/hashCode 合約問題：欄位要一致、覆寫要連動……Records 直接幫我們把這些全部處理好了。

【生活化比喻】
這就像買一個「全配」的模具：宣告 record Point(int x, int y) 之後，toString、equals、hashCode 三個方法就像模具裡已經刻好的零件，不需要我們自己一個一個雕。而且這三個方法之間絕對不會出現「合約沒對齊」的問題，因為它們都是根據同一組屬性（x, y）自動產生的。

💼 業界實務：
適合用來表示「不可變的資料容器」，例如 API 回傳的 DTO、座標、區間範圍等。資料庫的 Entity 因為需要可變欄位與額外標註，通常還是用一般類別。
-->

---
layout: default
---

# Records — 驗證自動產生的方法

```java
record Point(int x, int y) { }

Point p1 = new Point(10, 20);
Point p2 = new Point(10, 20);

System.out.println(p1);              // Point[x=10, y=20]
System.out.println(p1.equals(p2));   // true（內容相同）
System.out.println(p1.hashCode() == p2.hashCode()); // true
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> p1 和 p2 是不同物件，但屬性值相同，因此 equals() 為 true，hashCode() 也一致——完全符合合約
</div>

<!--
【帶讀程式碼】
這三行就是最好的證明：p1 和 p2 是用 new 各自建立的不同物件，equals() 卻回傳 true，因為 record 比較的是「內容」而不是「參照」。而且 hashCode() 也相同，完全不會出現我們前面看到的「靈異現象」。

⚠️ 易錯點提醒：
Records 的欄位是 final 的，宣告之後不能修改（immutable）。如果你的資料需要在建立後修改內容，record 就不適用，仍要用一般的 class。

【預期結果】
三行的輸出分別是 Point[x=10, y=20]、true、true，這就是 Records 「一行宣告，全部到位」的威力。
-->

---
layout: default
---

# 練習 2：用 Record 重構 User

### 任務說明

延續本節最開始的 `User` 類別（欄位：`id`、`email`）：

1. 將 `User` 改寫為 `record User(String id, String email) { }`
2. 建立兩個內容相同的 `User` 實例，驗證 `equals()` 與 `hashCode()` 是否一致
3. 將其放入 `HashSet`，驗證 `contains()` 是否能正確找到內容相同的物件
4. 比較：改寫前後，程式碼行數差異有多大？

<!--
【任務鋪陳】
還記得我們前面為 User 類別手動補 hashCode() 的練習嗎？現在我們用 Records 重做一次，感受一下差距。

【引導思考】
想想看，原本要寫建構子、equals()、hashCode()，總共大概要十幾行。改用 record 之後呢？這對於團隊維護程式碼的成本，會有什麼影響？
-->

---
layout: default
---

# 練習 2：解題提示

```java
record User(String id, String email) { }

User u1 = new User("u001", "alice@mail.com");
User u2 = new User("u001", "alice@mail.com");

System.out.println(u1.equals(u2));               // true
System.out.println(u1.hashCode() == u2.hashCode()); // true

Set<User> set = new HashSet<>();
set.add(u1);
System.out.println(set.contains(u2)); // true
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> 原本需要手動覆寫的 equals/hashCode/toString，現在用 record 宣告整個類別簽名就自動完成
</div>

<!--
【逐步解說】
重點在第一行：record User(String id, String email) { } 一行宣告，就取代了原本的欄位宣告、建構子、equals()、hashCode()、toString() 全部程式碼。

💼 業界實務：
在新專案中，越來越多開發者優先考慮用 record 表示「資料載體」類別，傳統的手動覆寫方式則保留給需要客製化邏輯（例如欄位驗證、額外的業務方法）的情境。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# clone() 與 finalize()：被淘汰的設計

<!--
【段落轉換】
最後這一段要介紹兩個「黑歷史」：clone() 和 finalize()。它們曾經是 Java 設計的一部分，但現在業界幾乎不建議使用，了解原因可以幫助我們避開老舊程式碼留下的陷阱。
-->

---
layout: default
---

# clone() 方法與 Cloneable 介面

| 概念 | 說明 |
| --- | --- |
| `Cloneable` | 標記介面（無方法），表示允許複製 |
| 淺層複製 | 基本型態欄位複製值；物件欄位複製**參照** |
| 深層複製 | 連物件欄位也複製，兩份完全獨立 |

```java
class Coord implements Cloneable {
    int x, y;
    public Coord clone() throws CloneNotSupportedException {
        return (Coord) super.clone();
    }
}
```

<!--
【核心說明】
clone() 是用來「複製」物件的方法，但它的設計很彆扭：你必須先實作一個「裡面什麼方法都沒有」的 Cloneable 介面，否則執行時會直接拋出例外。

【生活化比喻】
這就像影印文件：如果文件裡只有文字（基本型態），影印出來的是完全獨立的一份。但如果文件裡夾著一張「提款卡」（物件欄位），淺層複製只會影印提款卡的「卡面照片」，兩份文件實際上共用同一張真正的卡——這就是淺層複製的風險。

⚠️ 易錯點提醒：
clone() 是 Java 設計中爭議最大的部分之一，甚至連《Effective Java》的作者 Josh Bloch 都建議避免使用它，改用複製建構子（Copy Constructor）。
-->

---
layout: default
---

# clone() — 淺層複製的陷阱

```java
class Pet { String name; Pet(String n) { name = n; } }
class Owner implements Cloneable {
    Pet pet;
    public Owner clone() throws CloneNotSupportedException {
        return (Owner) super.clone();
    }
}

Owner o1 = new Owner(); o1.pet = new Pet("旺財");
Owner o2 = o1.clone();  // 淺層：pet 欄位仍共用
System.out.println(o1.pet == o2.pet); // true
o2.pet.name = "小白";
System.out.println(o1.pet.name); // 小白（o1 也被改了！）
// 深層：手動重建物件欄位
o2.pet = new Pet("旺財"); // 現在 o1, o2 的 pet 各自獨立
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 物件欄位較多時，建議改用<b>複製建構子</b> (<code>new Owner(other)</code>) 取代 <code>clone()</code>
</div>

<!--
【帶讀程式碼】
重點在 `o1.pet == o2.pet` 這行：結果是 true，代表 o1 和 o2 雖然是兩個不同的 Owner 物件，但它們的 pet 欄位指向同一隻 Pet。

⚠️ 易錯點提醒：
接下來 `o2.pet.name = "小白"` 看似只改了 o2 的寵物名字，但因為兩者共用同一個 Pet，o1.pet.name 也一起變成「小白」了。這就是淺層複製最容易踩到的雷。

【預期結果】
最後一行手動 `new Pet(...)` 重建物件欄位，才能讓 o1 和 o2 的 pet 真正獨立——這也說明了為什麼大家寧願多寫一個複製建構子，也不想碰 clone()。
-->

---
layout: default
---

# finalize() 方法的廢棄 (JDK 9+)

`Object` 中還有一個 `finalize()` 方法，用於物件被 GC 回收前的清理工作。

| 項目 | 說明 |
| --- | --- |
| 現況 | 自 **JDK 9** 起已被標記為 **Deprecated**（廢棄） |
| 原因 | 執行時機不確定、影響效能、可能導致死鎖 |
| 替代方案 | 使用 **Try-with-resources** 與 **`AutoCloseable`** 介面 |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>警告：</b> 在現代 Java 開發中，絕對不要 Override 或依賴 <code>finalize()</code> 方法。
</div>

<!--
【核心說明】
finalize() 原本的設計，是讓物件在被垃圾回收（GC）前，有機會做一些「收尾工作」，像是關閉檔案、釋放連線等。

【生活化比喻】
這就像是請一位「不知道什麼時候會來、甚至可能永遠不會來」的清潔工，在你搬家後幫忙打掃。你完全無法掌控他什麼時候到、會不會到，萬一你急著要把房子騰出來給下一個房客，這種不確定性就是大問題。

⚠️ 易錯點提醒：
finalize() 的執行時機由 GC 決定，可能延遲很久，也可能因為程式提早結束而完全不執行。如果把資源釋放（檔案、連線）寄託在它身上，會造成資源洩漏。

💼 業界實務：
現代 Java 開發中，需要清理資源時一律使用 try-with-resources 搭配 AutoCloseable，這能保證資源在區塊結束時「立即且確定」被釋放。
-->

---
layout: default
---

# 練習 3：clone() 與 finalize() 的取捨
### 認證模擬題（單選）

關於 `clone()` 與 `finalize()`，下列哪一個說法**正確**？

```java
class Pet { String name; Pet(String n) { name = n; } }
class Owner implements Cloneable {
    Pet pet;
    public Owner clone() throws CloneNotSupportedException {
        return (Owner) super.clone();
    }
}

Owner o1 = new Owner();
o1.pet = new Pet("旺財");
Owner o2 = o1.clone();
o2.pet.name = "小白";
System.out.println(o1.pet.name);
```

A. 輸出 `旺財`，因為 `clone()` 會自動進行深層複製<br>
B. 輸出 `小白`，因為 `super.clone()` 預設是淺層複製，`o1.pet` 與 `o2.pet` 指向同一個物件<br>
C. 編譯錯誤，因為 `Owner` 沒有實作 `finalize()`<br>
D. 程式會拋出例外，因為 `Cloneable` 介面必須定義 `clone()` 的實作細節

<!--
【出題動機】
這題想測驗 `clone()` 淺層複製的陷阱，以及 `Cloneable` 介面「標記介面」的本質。這也是業界常問「為什麼不建議用 clone()」的核心原因。

【解題引導】
提示：`super.clone()` 對「物件型態的欄位」做的是複製參照還是複製整個物件？`o2.pet.name = "小白"` 這行改的到底是誰的 `pet`？
-->
---
layout: default
---

# 練習 3：clone() 與 finalize() 的取捨
### 解析

**正確答案：B**

- A. ❌ `super.clone()` 預設是**淺層複製**，物件型態的欄位（如 `pet`）只會複製參照，不會自動深層複製
- B. ✅ `o1.pet` 與 `o2.pet` 指向同一個 `Pet` 物件，所以 `o2.pet.name = "小白"` 也會讓 `o1.pet.name` 變成 `"小白"`
- C. ❌ `Owner` 完全不需要實作 `finalize()`，兩者沒有關係；`Cloneable` 也不要求實作 `finalize()`
- D. ❌ `Cloneable` 是「標記介面」（沒有任何方法），`Owner` 已經正確覆寫了 `clone()` 並呼叫 `super.clone()`，不會拋出例外

<!--
【帶讀解法】
這題的關鍵就是「淺層複製」：`o1.clone()` 複製出 `o2` 之後，`o2.pet` 跟 `o1.pet` 是同一個 `Pet` 物件的兩個參照。所以透過 `o2.pet` 改名字，`o1.pet.name` 也會一起變。

這正是業界（包括《Effective Java》）建議避免使用 `clone()` 的原因——它的「複製」其實只複製了一層，物件欄位還是共用，很容易寫出有 bug 的程式。現代做法是用「複製建構子」，在建構子裡用 `new Pet(other.pet.name)` 明確地重建每一層物件。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
這份自學內容學了 equals/hashCode 合約、Records 與 Object 方法、clone/finalize 的取捨，最後這個綜合練習把 Records 跟 equals/hashCode 合約串在一起，用更貼近實務的帳戶情境收尾。
-->
---
layout: default
---

# 練習 4 (綜合)：BankAccount 類別

### 任務說明

設計一個 `BankAccount` 類別，整合本節所學：

```java
class BankAccount {
    String accountNo;
    String owner;
    double balance;
}
```

1. 改寫為 `record BankAccount(String accountNo, String owner, double balance)`，驗證自動產生的 `equals()`、`hashCode()`、`toString()`
2. 建立兩個 `accountNo` 相同但 `balance` 不同的帳戶，放入 `HashSet`，觀察 `equals()` 的結果
3. 思考：若只想以 `accountNo` 判斷帳戶是否相同（忽略 `balance`），record 還適用嗎？為什麼？

<!--
【任務鋪陳】
這份自學內容的最後一關，把 Records 和 equals/hashCode 合約的概念整合在一起，用一個更貼近真實情境的銀行帳戶範例來驗證。

【引導思考】
想一下，record 預設的 equals() 是比較「所有欄位」。如果我們的需求是「只要帳號一樣就算同一個帳戶」，但 balance 會隨時變動，這時候 record 的預設行為還合適嗎？或許某些情境，手動覆寫 equals/hashCode 仍然有它的價值。
-->

---
layout: default
---

# 練習 4 (綜合)：解題提示

```java
record BankAccount(String accountNo, String owner, double balance) { }

BankAccount a1 = new BankAccount("A001", "Alice", 1000);
BankAccount a2 = new BankAccount("A001", "Alice", 500);

System.out.println(a1);             // BankAccount[accountNo=A001, owner=Alice, balance=1000.0]
System.out.println(a1.equals(a2));  // false（balance 不同）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>思考解答：</b> record 的 equals() 是「全欄位比較」，無法只比較部分欄位。若需求是「accountNo 相同即視為同一帳戶」，應改用一般 class，手動覆寫 equals()/hashCode() 只使用 accountNo
</div>

<!--
【逐步解說】
a1 和 a2 的 accountNo 與 owner 都相同，但 balance 不同，所以 record 自動產生的 equals() 回傳 false——因為它是「全欄位比較」。

⚠️ 易錯點提醒：
這正好呼應了我們在合約細節學到的重點：equals() 比較哪些欄位，hashCode() 就要用相同的欄位。record 幫我們自動做到「全欄位一致」，但如果業務邏輯需要「部分欄位比較」，就必須跳回手動覆寫的世界，並且自己確保兩者欄位一致。

💼 業界實務：
這也是為什麼 record 最適合用在「值物件」（value object，例如座標、金額區間），而像「帳戶」這種有獨立識別碼（identity）的物件，通常還是用一般 class 並以 ID 作為 equals/hashCode 的依據。
-->

---
layout: end
---

# 自學內容結束
### 回到主線課程繼續前進！

<!--
[依脈絡推斷]
這份自學內容就到這裡，我們一起搞懂了 equals/hashCode 合約的細節、Records 如何優雅地解決這些問題，以及 clone() 和 finalize() 為什麼逐漸被淘汰。帶著這些理解回到主線課程，相信大家對 Object 類別會有更扎實的掌握！
-->
