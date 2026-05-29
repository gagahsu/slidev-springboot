---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Object 類別
routeAlias: ch15
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
    「所有 Java 類別的共同祖先」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
各位碼農、肝帝們大家好！今天我們要來認識 Java 界的「始祖巨人」——Object 類別。不管你平時寫的是什麼高級的微服務還是拉跨的練習題，你的類別祖先通通都是它。這章學不好，你的 equals() 就會像渣男的諾言一樣不可靠，HashMap 更是會直接中風給你看。

【為什麼要學這個？】
Object 是所有 Java 類別的共同祖先，就像所有人類都有 DNA 一樣。搞清楚 Object 的方法，你才能真正掌握物件的「靈魂」。不然你寫的物件在集合（Collections）裡就像失蹤人口，明明在那裡卻永遠找不到。

【今天學完你會能做什麼】
學完之後你就能像個資深老鳥一樣，優雅地覆寫 equals()、hashCode()、toString()。以後看到「兩個內容一樣的物件 `==` 卻是 false」這種低級 bug，你就可以用關懷弱勢的眼神看著你的同事。
-->
---
layout: default
---

# Outline

- **認識 Object 類別** — `java.lang.Object` 與繼承關係
- **Objects 工具類別** — `java.util.Objects` 的 Null 安全設計
- **哈希碼與 `hashCode()`** — `Objects.hash()` 的現代實作
- **`equals()` 方法** — 搭配 Pattern Matching 的現代化寫法
- **`toString()` 方法** — 物件的字串表示
- **Records 與 Object 方法** — 自動實作 toString、equals、hashCode
- **其他 Object 方法** — `getClass()`、`clone()`、`finalize()`

<!--
【帶讀大綱】
今天的大綱很簡單：先拜見老祖宗 Object，然後認識它的現代化小助手 Objects 工具類。接著我們會深入探討 Java 面試的三大神題：toString()、hashCode() 和 equals()。最後再聊聊那個被大家嫌棄到不行的 finalize()。

【重點預告】
今天的重頭戲是 equals() 和 hashCode() 的「生死契約」。如果你只改其中一個而不改另一個，你的程式就會出現「靈異現象」，這種 bug 往往要修到天亮。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 認識 Object 類別

<!--
【段落轉換】
現在我們正式進入 Java 的「族譜查詢系統」，看看這個萬物起源的 Object 到底是何方神聖。
-->
---
layout: default
---

# Object 類別是什麼？

- 位於 **`java.lang`** 套件，完整名稱 `java.lang.Object`
- **所有 Java 類別的父類別**（根類別）
- 所有物件都隱含繼承了 Object 的 `public`、`protected` 方法
- 可依需要 **Override**（重新定義）這些方法

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> toString()、hashCode()、equals() 等方法都來自 Object 類別，不需要 import 即可使用
</div>

<!--
【核心說明】
java.lang.Object 是 Java 的最高頂點。在 Java 世界裡，沒有物件能逃過它的五指山。

【生活化比喻】
這就像是生物學上的「碳基生命」。不管你是阿貓、阿狗還是你的前任，只要是生命，基本組成都一樣。Object 就定義了 Java 物件最基本的生存技能：像是「自我介紹（toString）」和「鑑定身份（equals）」。

💼 業界實務：
雖然 IDE 可以自動生成這些方法，但如果你不理解背後的邏輯，自動生成的程式碼對你來說就像是咒語，出錯時你連在哪裡翻車都不知道。
-->
---

# 隱含繼承 Object 類別

所有類別都隱含地繼承 `Object`，以下兩種寫法完全相同：

```java
class Animal {
    String name;
}
```

```java
class Animal extends Object {
    String name;
}
```

<!--
【帶讀程式碼】
你看這兩段程式碼，第二段寫 extends Object 其實是多此一舉，就像你不需要在履歷上寫「我是地球人」一樣，Java 編譯器懂你的心，會自動幫你補上。

⚠️ 學生常見誤解：
有學生問：「如果我已經 extends Animal 了，還會繼承 Object 嗎？」孩子，這叫「隔代遺傳」。Animal 繼承 Object，你繼承 Animal，所以你還是 Object 的孫子。在 Java 世界，誰也別想當「野生的類別」。
-->
---

# Java 類別的繼承關係

常見類別皆以 `Object` 為父類別：

| 類別 | 父類別 | 說明 |
| --- | --- | --- |
| `String` | `Object` | 字串類別 |
| `StringBuffer` | `Object` | 可變字串類別 |
| `Scanner` | `Object` | 輸入掃描器 |
| 自訂類別（如 `Animal`） | `Object` | 所有自訂類別 |

<!--
【帶讀表格】
看看這個名單：String、Scanner、Animal... 全都是 Object 的後代。這說明了什麼？說明了 Object 真的很忙，要管這麼多子子孫孫。

【互動引導】
所以現在你知道為什麼隨便拿一個物件，後面打個點（.），就會出現一堆莫名其妙的方法了吧？那不是魔法，那是繼承下來的「家產」。
-->
---

# Object 常用方法

本章介紹下列四個方法：

| 方法 | 說明 |
| --- | --- |
| `int hashCode()` | 傳回物件的雜湊碼 |
| `boolean equals(Object obj)` | 比較兩個物件是否相同 |
| `String toString()` | 傳回代表物件的字串 |
| `final Class getClass()` | 傳回物件所屬的類別 |

<!--
【帶讀表格】
這四個就是我們今天的四大天王：
- hashCode()：物件的「門牌號碼」。
- equals()：物件的「DNA 鑑定」。
- toString()：物件的「名片」。
- getClass()：物件的「身分證」，看你到底是哪家出產的。

這幾個方法是開發者的必修課，沒學好就像是沒拿駕照就上高速公路。
-->
---

# Objects 工具類別 (JDK 7+)

**`java.util.Objects`**（注意：不是 `java.lang.Object`）是 Java 7 引入的工具類別，提供靜態方法讓開發者更安全地處理 `null`。

| 方法 | 說明 |
| --- | --- |
| `equals(a, b)` | 比較 a, b 是否相等，**自動處理 null** |
| `hash(fields...)` | 根據傳入的欄位產生 hash 值 |
| `requireNonNull(obj)` | 檢查是否為 null，為空則拋出異常 |

<!--
【核心說明】
注意喔！Object 是老祖宗，Objects（加了 s）是那個幫老祖宗打雜的「現代小助手」。

⚠️ 學生常見誤解：
名字差一個 s，地位差很多。不要在繼承的時候寫 extends Objects，那會讓你顯得像是在寫 JavaScript 一樣隨性。

💼 業界實務：
在業界，直接用 a.equals(b) 是很危險的行為，因為如果 a 是 null，你的程式就直接當機（NPE）。用 Objects.equals(a, b) 才是專業老鳥的做法，優雅又不噴錯。
-->
---

# Objects 工具類別 — 範例

```java
import java.util.Objects;

String s1 = null;
String s2 = "Java";

// 傳統寫法會拋出 NPE (NullPointerException)
// System.out.println(s1.equals(s2)); 

// 安全寫法：若 s1 為 null 則回傳 false
System.out.println(Objects.equals(s1, s2)); // false
```

<!--
【帶讀程式碼】
看這行註解掉的程式碼，如果你敢在 s1 是 null 的時候呼叫它，Java 就敢直接死給你看。NullPointerException（NPE）可是佔了開發者 80% 的崩潰來源。

但用了 Objects.equals()，它會先溫柔地檢查一下 s1 是不是 null。如果是，它就回傳 false，而不是直接報警。這就是所謂的「防禦性編程」。

💼 業界實務：
如果你在 Code Review 的時候看到有人還在寫 if (a != null && a.equals(b))，請把這張投影片甩在他臉上。
-->
---

# Objects.isNull() 與 nonNull()

| 方法 | 說明 |
| --- | --- |
| `Objects.isNull(obj)` | 回傳 `true` 若 `obj == null`，適合作為 Stream 的 predicate |
| `Objects.nonNull(obj)` | 回傳 `true` 若 `obj != null`，適合作為 Stream 的 predicate |

```java
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

List<String> list = Arrays.asList("Java", null, "Python");
list.stream().filter(Objects::nonNull)
    .forEach(System.out::println); // Java, Python
System.out.println(Objects.isNull(null)); // true
```

<!--
【帶讀說明】
這兩個方法基本上就是為了讓你的 Stream 寫起來更像人話。

【帶讀程式碼】
list.stream().filter(Objects::nonNull) 把 null 過濾掉，只留下 "Java" 和 "Python"。

💼 業界實務：
從資料庫或 API 取回的資料常有 null，在 Stream 處理前先過濾 null 是好習慣。
-->
---

# Objects.requireNonNullElse()

| 方法 | 說明 |
| --- | --- |
| `requireNonNullElse(obj, default)` | 若 `obj` 為 null 則回傳 `default` |
| `requireNonNullElseGet(obj, supplier)` | 若 `obj` 為 null 則呼叫 `supplier`（延遲求值） |

```java
String name = Objects.requireNonNullElse(input, "訪客");
// input 若為 null 則 name = "訪客"

String v = Objects.requireNonNullElseGet(
    cached, () -> loadFromDB()); // 只在 null 時才呼叫
```

<!--
【核心說明】
這招叫做「備胎計畫」。如果你要的東西沒來（null），那就用我準備好的預設值。

【帶讀程式碼】
input 是 null？沒關係，我們叫他「訪客」。這比寫一堆 if-else 簡潔多了。

💼 業界實務：
requireNonNullElseGet 更好用，因為它只有在真正需要備胎的時候才去執行那個 supplier（例如去資料庫撈資料）。這叫「懶加載」，能省一點資源是一點。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 哈希碼與 hashCode()

<!--
【段落轉換】
接下來要聊聊「哈希碼」。這不是哈利波特的咒語，而是 Java 裡用來管帳的「門牌號碼系統」。
-->
---
layout: default
---

# 什麼是哈希碼？

- **Hash（雜湊）** 源自一位數學家的名字，他發明了雜湊演算法
- 主要目的：**在集合中提升搜尋效率**
- `hashCode()` 根據演算法將物件資訊映射成一個**整數（雜湊碼）**
- 不同 JVM 的實作與記憶體位址有關，但不保證就是位址本身

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> 雜湊碼有時也稱「散列值」(hash code / hash value)
</div>

<!--
【核心說明】
hashCode() 就是把你的物件丟進一台「絞肉機」，出來後變成一個數字。這個數字就是它的「雜湊碼」。

【生活化比喻】
想像你去超市寄放行李，店員會給你一個號碼牌（hashCode），然後把你的包包放在對應的櫃子（Bucket）。下次你拿號碼牌來，店員一眼就能看到在哪，而不需要把所有櫃子打開檢查一遍。這就是為什麼 HashMap 找東西飛快的原因。

💼 業界實務：
如果你的 hashCode() 寫得太爛，所有物件的 hash 值都一樣，那 HashMap 就會退化成一個慢得要死的 List。面試官最喜歡問：「如果我的 hashCode() 永遠回傳 1 會發生什麼事？」記得回答：「那效能會爆炸。」
-->
---

# hashCode() 基本規則

| 情況 | 結果 |
| --- | --- |
| 相同的方法 + 相同的值 | 傳回**相同** hash 值 |
| 不同的方法 + 相同的值 | 傳回**不同** hash 值 |
| 不同物件（預設 Object） | 通常傳回**不同** hash 值 |

<!--
【帶讀表格】
hashCode 的規則就像是「算命」：
1. 算命師不變，你提供的資料不變，算出來的命（hash 值）就必須一樣。
2. 換個算命師（不同的演算法），就算資料一樣，結果通常也不同。
3. 預設情況下，每個人都是獨立的靈魂（不同的物件），算出來的結果通常也不一樣。
-->
---

# hashCode() — 初探

同一個類別，相同的字串值 → 相同的雜湊碼：

```java
String str1 = "Foo";
String str2 = "Foo";
System.out.println(str1.hashCode()); // 70822
System.out.println(str2.hashCode()); // 70822
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> str1 與 str2 都呼叫 String 的 hashCode()，值相同，所以結果一致
</div>

<!--
【帶讀程式碼】
"Foo" 算出來的結果就是 70822，不多也不少。這說明了 String 類別很乖，它覆寫了 Object 的預設行為，改用「內容」來算命。

⚠️ 重點：
如果你不覆寫 hashCode()，那 str1 和 str2 就算是內容一樣，也會因為是「不同人」而拿到不同的號碼牌。
-->
---

# hashCode() — 不同類別的比較

不同類別各自定義 `hashCode()`，相同「值」也可能得出不同結果：

```java
String str = "Foo";
Integer intObj = 10;

System.out.println(str.hashCode());    // 70822
System.out.println(intObj.hashCode()); // 10
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> String 與 Integer 各自 Override 了 hashCode()，使用不同的演算法
</div>

<!--
【帶讀程式碼】
你看，Integer 10 的 hashCode 竟然就是 10。這說明 Integer 的算法很「懶」，直接拿值當結果。而 String 的算法就比較努力一點，算出了 70822。這再次證明了：演算法不同，結果就沒法比。
-->
---

# 現代化的 hashCode() 實作

現代開發不再手寫複雜的雜湊演算法，而是使用 **`Objects.hash()`**。

| 方法 | 說明 |
| --- | --- |
| `Objects.hash(v1, v2...)` | 傳入多個欄位，自動計算出高品質的雜湊碼 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>關鍵原則：</b> 在 <code>equals()</code> 裡用到哪些欄位比較，<code>hashCode()</code> 就必須用相同的欄位，兩者要一致
</div>

<!--
【核心說明】
如果你還在手寫 `31 * result + (s == null ? 0 : s.hashCode())` 這種上古咒語，請趕快更新一下大腦。

⚠️ 關鍵原則：
如果你在 equals() 裡用了 id 和 email 來比較，那 hashCode() 裡也必須用這兩個欄位。這叫「進出平衡」，不然 HashMap 會找你算帳。
-->
---

# 現代化的 hashCode() — 範例

```java
import java.util.Objects;

class User {
    String id;
    String email;

    User(String id, String email) {
        this.id = id;
        this.email = email;
    }

    @Override
    public int hashCode() {
        // 傳入所有用於判斷相等的欄位
        return Objects.hash(id, email);
    }
}
```

<!--
【帶讀程式碼】
用 Objects.hash(id, email) 就行了，它會幫你處理好所有的數學計算和 null 檢查。省下來的時間可以用來多喝杯咖啡，或是提早下班。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# equals() 方法

<!--
【段落轉換】
現在我們進入「物件導向三大謎團」之一：equals() 方法。搞不清楚它，你就會一直問為什麼 1+1 不等於 2。
-->
---

# `==` 與 `equals()` 的差異

| 比較方式 | 說明 |
| --- | --- |
| `==` 運算子 | 比較**參照**是否指向同一物件 |
| `equals()` 方法 | 比較物件**內容**是否相同（可 Override） |

```java
String s1 = new String("Java");
String s2 = new String("Java");
System.out.println(s1 == s2);      // false（不同物件）
System.out.println(s1.equals(s2)); // true（內容相同）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 字串比對請務必用 <code>equals()</code>；<code>==</code> 只判斷是否為同一個物件
</div>

<!--
【帶讀表格】
`==` 比的是「門牌位址」：你們是不是住在同一間房？
`equals()` 比的是「內容」：你們是不是長得一模一樣？

【帶讀程式碼】
s1 和 s2 就像是兩份一模一樣的合約，雖然內容（"Java"）一樣，但它們是印在兩張不同的紙上（不同的物件），所以用 `==` 比會是 false。

⚠️ 超常見 bug：
字串用 `==` 比較！這簡直是 Java 初學者的「成人禮」，沒踩過這個坑別說你寫過 Java。但拜託，踩一次就好。
-->
---
layout: default
---

# Object 的 equals() — 參照比較

`Object` 原生的 `equals()` 比較的是**參照（reference）是否指向同一個物件**：

```java
class Animal {
    String name;
    int age;
    Animal(String name, int age) { this.name = name; this.age = age; }
}

Animal a1 = new Animal("Foo", 1);
Animal a2 = new Animal("Foo", 1);
System.out.println(a1.equals(a2)); // false
```

```java
Animal a3 = a1;
System.out.println(a1.equals(a3)); // true
```

<!--
【帶讀程式碼】
原生的 equals() 其實就是個廢物，它的行為跟 `==` 一模一樣。如果你的類別不覆寫它，那它就會繼續執行這個「除非是同一個物件否則就不相等」的教條主義。

💡 所以，如果你希望你的「員工」物件只要員工編號一樣就算相等，你就得手動教 Object 怎麼做人。
-->
---

# String 的 equals() — 內容比較

`String` 已 Override `equals()`，改為比較**字串內容是否相同**：

```java
String s1 = "Foo";
String s2 = "Foo";
System.out.println(s1.equals(s2)); // true
```

| 類別 | `equals()` 比較對象 | 範例結果 |
| --- | --- | --- |
| `Object`（預設） | 參照位址 | 不同物件 → `false` |
| `String`（Override） | 字串內容 | 內容相同 → `true` |

<!--
【帶讀表格說明】
String 類別之所以好用，就是因為它已經幫你把 equals() 覆寫好了。它會逐字檢查每個字元是否一樣，非常有耐心。

【重點】
記住：除了 primitive 型態（如 int, char），其他物件要比較內容，一律用 equals()。如果你在專案裡寫 `if (str == "admin")`，我會考慮幫你申請轉職去寫 HTML。
-->
---

# 現代化的 equals() 實作 (JDK 16+)

JDK 16 引入 **Pattern Matching** 後，實作 `equals()` 變得更簡潔且易讀。

```java
@Override
public boolean equals(Object o) {
    // 1. 同一參照直接回傳 true
    if (this == o) return true;
    
    // 2. 判斷型別並同時宣告變數 (JDK 16 Pattern Matching)
    if (o instanceof User other) {
        // 3. 比較各欄位內容 (使用 Objects.equals 避免 null)
        return Objects.equals(this.id, other.id) &&
               Objects.equals(this.email, other.email);
    }
    return false;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重要：</b> 若 Override 了 <code>equals()</code>，<b>必須</b>同時 Override <code>hashCode()</code>！
</div>

<!--
【帶讀程式碼】
這是現代化老鳥的寫法。
第一步：如果是同一個位址，直接過，效能最高。
第二步：用新的 instanceof 寫法，不但檢查型別，還順便幫你把 o 轉型成 User other。以前還要寫兩行，現在一行搞定，舒服！
第三步：用 Objects.equals 比欄位。

⚠️ 再次警告：
這章講到現在，我已經說過三次了：覆寫 equals() 一定要覆寫 hashCode()！如果這兩位吵架（行為不一致），HashMap 就會罷工。
-->
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
這就是著名的「Java 生存合約」。
-->
---

# equals() 與 hashCode() 合約 — 反例（類別定義）

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
先看這個破損的 User 類別。equals() 寫得很正確，但偏偏漏掉了 hashCode()。接下來我們來看看這個失誤會造成什麼慘烈的後果。
-->
---

# equals() 與 hashCode() 合約 — 反例（驗證）

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
看這個慘劇：u1 和 u2 內容一樣，equals 是 true。但因為沒改 hashCode，u1 的門牌是 123，u2 的門牌是 456。
當你問 HashSet：「有沒有 u2 啊？」它會跑去 456 號房看，結果空空如也，它就回傳 false。但明明 u1 就在 123 號房住得好好的啊！這就是為什麼你的物件在 Set 裡會「鬧失蹤」。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# toString() 方法

<!--
【段落轉換】
最後來點輕鬆的：toString()。這就是物件的「自我介紹」。
-->
---
layout: default
---

# Object 的 toString() — 預設格式

`Object.toString()` 預設回傳格式：`類別名稱@hash值（十六進位）`

```java
Animal a = new Animal("Foo", 1);
System.out.println(a.toString()); // Animal@1b6d3586
System.out.println(a);            // 也會自動呼叫 toString()
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> 預設格式對使用者不具可讀性，通常需要 Override 成有意義的字串
</div>

<!--
【帶讀程式碼】
如果你不覆寫 toString()，Java 預設印出來的東西就像是亂碼。Animal@1b6d3586 到底是什麼鬼？是貓還是狗？沒人知道。

⚠️ 常見誤解：
不需要寫 .toString()。當你 System.out.println(a) 時，Java 其實在偷懶，它會自動幫你補上 .toString()。
-->
---

# Override toString() — 範例

```java
class Animal {
    String name;
    int age;
    Animal(String name, int age) { this.name = name; this.age = age; }

    @Override
    public String toString() {
        return "Name: " + name + ", Age: " + age;
    }
}
```

```java
Animal a = new Animal("Foo", 1);
System.out.println(a); // Name: Foo, Age: 1
```

<!--
【帶讀程式碼】
這才是人看的東西嘛！覆寫 toString() 就像是給物件穿衣服，讓它出門見人的時候體面一點。

💼 業界實務：
日誌（Log）是開發者的命脈。如果你的 DTO 沒覆寫 toString()，發生問題時你翻開 Log 只會看到一堆「User@2a3b4c」，那你真的會想把電腦砸了。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Records 與 Object 方法

<!--
【段落轉換】
JDK 16 帶來了一個「懶人福音」：Records。
-->
---
layout: default
---

# 紀錄類別 (Records) 與 Object 方法

JDK 16+ 的 **`record`** 會自動為你 Override 所有重要的 `Object` 方法。

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
【帶讀表格】
Records 簡直是物件導向界的「泡麵」，熱水一泡（一行宣告）就能吃。它自動幫你把剛才我們講得口乾舌燥的 toString、equals、hashCode 通通寫好了。

【帶讀程式碼】
record Point(int x, int y) {}。沒了，真的就這一行。你再也不用在 IDE 裡對著滑鼠狂點「Generate...」了。

💼 業界實務：
如果你還在用 Java 8，請為你自己默哀三秒鐘。如果你已經用了新版 Java，請大量使用 Record，它可以幫你的專案瘦身 30%。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 其他 Object 方法

<!--
【段落轉換】
最後，我們快速掃描一下那些「名氣很大但實用度堪憂」的方法。
-->
---
layout: default
---

# getClass() — 取得物件的類別

`getClass()` 傳回物件所屬的 `Class` 物件：

```java
class MyClass { }

MyClass obj = new MyClass();
System.out.println(obj.getClass());
// 輸出：class MyClass
```

<!--
【帶讀程式碼】
getClass() 就是在問物件：「你媽是誰？」它會回傳一個 Class 物件。

💼 業界實務：
這方法在寫「框架」的時候非常有用。像是 Spring 或 Hibernate，它們會用 getClass() 來看你的物件長什麼樣子，然後自動幫你生成 SQL 或處理依賴注入。
-->
---

# getClass() — 常用操作

| 呼叫方式 | 說明 | 輸出 |
| --- | --- | --- |
| `obj.getClass()` | 傳回 Class 物件 | `class MyClass` |
| `obj.getClass().getName()` | 取得類別名稱字串 | `"MyClass"` |

```java
MyClass obj = new MyClass();
System.out.println(obj.getClass());
System.out.println(obj.getClass().getName());
```

<!--
【帶讀表格】
如果你只需要類別的名字（例如要做 Log 紀錄），那就呼叫 getName()。

常見用途：有些人喜歡用這個來代替 instanceof，但請注意，getClass() 的比較是非常嚴格的，連子類別都不認喔。
-->
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
clone() 方法是用來「複製」物件的。但它很矯情，你必須先實作一個空的 Cloneable 介面，不然它會報錯。

關鍵概念：
- 淺層複製：只複製表皮，內部如果還有其他物件，那兩個人還是共用同一個。
- 深層複製：這才是真正的「影分身」，連裡面的東西都各做一份新的。

⚠️ 警告：
clone() 是 Java 設計最失敗的地方之一。它有很多坑，甚至連 Java 之父 Josh Bloch 都建議大家別用。
-->
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
你看這個慘烈的現場。你以為把老闆複製了一份，就能讓複製人去遛狗。結果沒想到兩個老闆共用同一隻狗（pet）！
複製人改了狗的名字叫「小白」，原本老闆的「旺財」就莫名其妙失蹤了。這就是淺層複製的恐怖之處。

【如何避免】
別用 clone()！去寫個 Copy Constructor（複製建構子）吧，那才是現代開發者的救贖。
-->
---

# finalize() 方法的廢棄 (JDK 9+)

`Object` 中還有一個 `finalize()` 方法，用於物件被 GC 回收前的清理工作。

- **現況**：自 **JDK 9** 起已被標記為 **Deprecated** (廢棄)
- **原因**：執行時機不確定、影響效能、可能導致死鎖
- **替代方案**：使用 **Try-with-resources** 與 **`AutoCloseable`** 介面

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>警告：</b> 在現代 Java 開發中，絕對不要 Override 或依賴 <code>finalize()</code> 方法。
</div>

<!--
【核心說明】
finalize() 就像是物件的「臨終遺言」。但問題是，你永遠不知道 GC 什麼時候會過來幫你處理後事，有時候甚至直到程式結束都沒人來。

【為什麼廢棄？】
因為它又慢又不靠譜，還會拖累 JVM。就像是那種說要幫你洗碗，結果洗了三天還沒洗好的室友。

💼 業界實務：
如果你有檔案或連線要關，請用 try-with-resources。如果你還在用 finalize()，你就是在給自己挖坑。
-->
---
layout: default
---

# 練習：Employee 類別
### 任務說明

建立一個 `Employee` 類別，包含以下欄位：

```java
class Employee {
    String name;
    int age;
    String country;
}
```

1. 建立兩個屬性值相同的 `Employee` 物件，比較它們的 `hashCode()`
2. 觀察 `Object` 預設 `hashCode()` 的行為（屬性相同 ≠ 相同 hash 碼）
3. **進階**：Override `hashCode()`，使屬性相同的物件回傳相同 hash 值

<!--
【出題前的鋪陳】
各位工程師們，現在來點動手的。我們來寫個 Employee 類別，看看我們能不能讓兩個一樣的員工不要「鬧雙胞」。

【問題引導】
先試試看什麼都不寫，印出 hashCode。然後加上 Objects.hash() 覆寫，看看奇蹟會不會發生。

【等待與觀察】
給大家 3 分鐘。如果 3 分鐘內寫不出來，那你可能需要再喝一瓶蠻牛。
-->
---
layout: default
---

# 練習：解題提示

1. **建立物件並輸出 hashCode**
   - 以 `new Employee(...)` 建立兩次，分別列印 `hashCode()`
   - Object 預設 `hashCode()` 基於記憶體位址 → 不同物件結果不同

2. **Override hashCode()**

```java
import java.util.Objects;

@Override
public int hashCode() {
    return Objects.hash(name, age, country);
}
```

3. **驗證結果**：Override 後，屬性相同的物件應回傳**相同** hashCode

<!--
【帶讀解法】
解法很簡單：
第一步，看著那兩個不一樣的數字感嘆一下人生的無常。
第二步，用 Objects.hash(name, age, country) 把它們鎖在一起。

⚠️ 進階思考：
如果這兩個員工 hashCode 一樣了，那它們的 equals() 也要是一樣的喔！不然它們就是「住在一起但互不相認的陌生人」，這在 HashMap 裡會出事的。
-->
---
layout: end
---

# 課程結束
### 下一章見！

<!--
[依脈絡推斷]
下課！記得回家把那兩個吵架的方法（equals 和 hashCode）和好。如果你不理它們，Bug 就會理你。我們下一章「抽象類別」見！
-->
