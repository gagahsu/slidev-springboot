---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: Object 類別
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
    「所有 Java 類別的共同祖先」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
大家好！今天我們要認識一個很特別的角色——Object 類別。它是 Java 裡所有類別的「共同祖先」，不管我們寫的是哪一種類別，往上追溯，最後一定會追到它。

【為什麼要學這個？】
想像一下，如果兩個內容完全一樣的物件，用 `==` 比較卻是 `false`，或者把物件丟進集合（Collection）裡，卻怎麼也找不到它——這些情況背後的關鍵，都跟 Object 類別提供的方法有關。搞懂 Object，我們才能真正掌握「物件」這個概念的核心行為。

【學習目標】
這一章學完之後，我們會知道怎麼正確地覆寫（`override`）`equals()`、`hashCode()`、`toString()` 這三個最常用的方法，也會認識 `java.util.Objects` 這個好用的工具類別。
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
- **其他 Object 方法** — `getClass()`

<!--
【帶讀大綱】
今天的大綱，我們會先認識 Object 這位「老祖宗」，再認識它的好幫手 Objects 工具類別。接著會深入介紹三個最常用、也最常被考的方法：`hashCode()`、`equals()`、`toString()`。最後再認識一個身分驗證用的方法 `getClass()`。

【重點預告】
今天的重點是 `equals()` 和 `hashCode()`：這兩個方法是「綁在一起」的，只改一個不改另一個，物件在集合裡就會出現找不到的情況。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 認識 Object 類別

<!--
【段落轉換】
我們先來看看這個「萬物的起源」——Object 類別，到底是什麼來歷。
-->
---
layout: default
---

# Object 類別是什麼？

- 位於 **`java.lang`** 套件，完整名稱 `java.lang.Object`
- **所有 Java 類別的父類別**（根類別）
- 所有物件都隱含繼承了 Object 的 `public`、`protected` 方法
- 可依需要 **Override**（覆寫）這些方法

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> toString()、hashCode()、equals() 等方法都來自 Object 類別，不需要 import 即可使用
</div>

<!--
【重點解說】
`java.lang.Object` 是 Java 類別繼承架構的最頂端，所有的類別，不管自己寫的還是 Java 內建的，最終都會繼承到它。

【生活化比喻】
這就像所有生物都有的「基本生存技能」：自我介紹、辨認彼此身分等。Object 類別就定義了 Java 物件最基本的能力，例如「自我介紹」（`toString`）和「判斷是不是同一個」（`equals`）。

💼 業界實務：
雖然 IDE 可以自動產生這些方法，但如果不理解背後的邏輯，自動產生的程式碼出錯時，我們會不知道該往哪裡debug。
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
這兩段程式碼是完全一樣的。第二段特地寫出 `extends Object`，其實是多餘的——Java 編譯器會自動幫我們補上這層繼承關係。

⚠️ 易錯點提醒：
有同學會問：「如果我已經 `extends Animal` 了，還會繼承 Object 嗎？」答案是會的。Animal 繼承 Object，我們的類別繼承 Animal，所以一層一層往上追溯，最後還是會連到 Object——在 Java 的世界裡，沒有類別是「沒有祖先」的。
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
我們看看這張表：`String`、`Scanner`、自己寫的 `Animal`……全部都是 Object 的子類別。

【生活化比喻】
這也說明了為什麼我們隨便拿一個物件，後面打個點（`.`），IDE 就會跳出一堆方法清單，例如 `toString()`、`equals()`。這些方法不是憑空出現的，而是從 Object 那邊繼承下來的「家底」。
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
這四個方法，可以分別對應到物件的四種「基本能力」：

- `hashCode()`：物件的「門牌號碼」
- `equals()`：判斷「是不是同一個人」
- `toString()`：物件的「自我介紹」
- `getClass()`：物件的「身分證」，標明它是哪個類別產生的

這四個方法是開發 Java 程式時的必修課，務必熟悉它們的行為。
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
【重點解說】
注意名字：`Object` 是我們剛認識的老祖宗，`Objects`（多了一個 s）則是專門「輔助處理物件」的工具類別，兩者完全不同。

⚠️ 易錯點提醒：
名字差一個 `s`，用途差很多，繼承時請不要誤寫成 `extends Objects`。

💼 業界實務：
直接呼叫 `a.equals(b)` 是有風險的——如果 `a` 是 `null`，程式就會拋出例外（NullPointerException）。改用 `Objects.equals(a, b)`，就能安全處理 `null` 的情況。
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
先看被註解掉的那行：如果 `s1` 是 `null`，直接呼叫 `s1.equals(s2)` 就會拋出例外（NullPointerException，簡稱 NPE）。NPE 是開發過程中最常見的錯誤之一。

而改用 `Objects.equals(s1, s2)`，它會先檢查 `s1` 是不是 `null`。如果是，就直接回傳 `false`，而不會拋出例外，這就是「防禦性編程」的概念。

⚠️ 易錯點提醒：
如果在 Code Review 時看到 `if (a != null && a.equals(b))` 這種寫法，可以建議對方改用 `Objects.equals(a, b)`，會更簡潔安全。

【預期結果】
這段程式碼會輸出 `false`，且不會拋出任何例外。
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
【重點解說】
這兩個方法常用於 Stream 處理，幫助我們把 `null` 過濾掉。

【帶讀程式碼】
`list.stream().filter(Objects::nonNull)` 這行會把串流中的 `null` 過濾掉，最後只留下 `"Java"` 和 `"Python"`。

💼 業界實務：
從資料庫或外部 API 取回的資料常常會混雜 `null`，在 Stream 處理前先過濾掉 `null` 是常見的好習慣。

【預期結果】
程式會依序輸出 `Java`、`Python`，最後輸出 `true`。
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
【重點解說】
這兩個方法可以理解成「備用方案」：如果原本要的值是 `null`，就改用一個事先準備好的預設值。

【帶讀程式碼】
第一個範例：如果 `input` 是 `null`，`name` 就會被設成 `"訪客"`，比起寫一長串 `if-else` 簡潔許多。

💼 業界實務：
`requireNonNullElseGet` 會比較適合用在「取得預設值的成本較高」的情境，例如要從資料庫撈資料——因為它只有在真正需要時，才會執行 `supplier` 裡的邏輯，這就是「延遲求值」（lazy evaluation）的概念。
-->
---
layout: default
---

# 練習 1：安全處理使用者輸入的暱稱
### 任務說明

設計一個方法，安全地處理「可能是 `null`」的使用者輸入：
1. 寫一個方法 `String formatNickname(String input)`：
   - 若 `input` 為 `null`，回傳 `"訪客"`
   - 否則回傳 `input`
2. 寫一個方法 `boolean isSameNickname(String a, String b)`：
   - 使用 `Objects.equals()` 比較 `a` 與 `b`，避免 NPE
3. 在 `main()` 中測試：
   - `formatNickname(null)` 與 `formatNickname("古古")`
   - `isSameNickname(null, null)`、`isSameNickname(null, "古古")`、`isSameNickname("古古", "古古")`

**預期輸出：**
```
訪客
古古
true
false
true
```

<!--
【任務鋪陳】
剛才學到 `Objects` 工具類別提供了 `requireNonNullElse()` 和 `equals()`，這兩個方法在處理「可能是 `null`」的資料時非常實用。這個練習就是要把它們用在一個常見場景：處理使用者輸入的暱稱。

【引導思考】
想一想：如果不用 `Objects.requireNonNullElse()`，要怎麼用 `if-else` 寫出一樣的效果？再想想，如果直接寫 `a.equals(b)`，當 `a` 是 `null` 時會發生什麼事？

【等待與觀察】
給大家 5 分鐘。提示：兩個方法都可以一行解決，直接呼叫 `Objects` 的對應方法即可。
-->
---
layout: default
---

# 練習 1：安全處理使用者輸入的暱稱
### 解題提示

1. `formatNickname()` 直接用 `Objects.requireNonNullElse(input, "訪客")`
2. `isSameNickname()` 直接用 `Objects.equals(a, b)`，兩個都是 `null` 時視為相同

```java
import java.util.Objects;

class NicknameUtil {
    static String formatNickname(String input) {
        return Objects.requireNonNullElse(input, "訪客");
    }
    static boolean isSameNickname(String a, String b) {
        return Objects.equals(a, b);
    }
    public static void main(String[] args) {
        System.out.println(formatNickname(null));   // 訪客
        System.out.println(formatNickname("古古")); // 古古
        System.out.println(isSameNickname(null, null));   // true
        System.out.println(isSameNickname(null, "古古")); // false
        System.out.println(isSameNickname("古古", "古古")); // true
    }
}
```

<!--
【帶讀解法】
重點在於：這兩行程式碼其實都是「防禦性編程」的體現。`requireNonNullElse()` 把「`null` 時要怎麼辦」這個 `if-else` 邏輯封裝起來；`Objects.equals()` 則內建處理了「兩個都是 `null`」的情況（回傳 `true`），這跟直接呼叫 `a.equals(b)` 在 `a` 為 `null` 時會拋出例外完全不同。

💼 業界實務：
這種「先確認資料安全再使用」的寫法，在處理表單輸入、API 回應這類「外部資料」時非常常見，能大幅減少 NullPointerException 的發生。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 哈希碼與 hashCode()

<!--
【段落轉換】
接著我們來認識「哈希碼」（hash code）。這是 Java 集合類別在背後用來快速找東西的「門牌號碼系統」。
-->
---
layout: default
---

# 什麼是哈希碼？

- **Hash（雜湊）** 這個字源自料理術語「剁碎、混合」（如 hash browns 薯餅），借用來比喻把資料打散、對應到不同位置的過程
- 主要目的：**在集合中提升搜尋效率**
- `hashCode()` 根據演算法將物件資訊映射成一個**整數（雜湊碼）**
- 不同 JVM 的實作與記憶體位址有關，但不保證就是位址本身

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> 雜湊碼有時也稱「散列值」(hash code / hash value)
</div>

<!--
【重點解說】
`hashCode()` 會把物件依照某種演算法轉換成一個整數，這個整數就是它的「雜湊碼」。

【生活化比喻】
這就像我們去置物櫃寄放東西時，櫃台會給我們一個號碼牌（hashCode），並把東西放進對應編號的櫃子（bucket）。下次拿號碼牌來，工作人員可以直接對應到那個櫃子，而不用把每個櫃子都打開檢查——這就是為什麼 `HashMap` 查找速度很快的原因。

💼 業界實務：
如果一個類別的 `hashCode()` 設計不良，導致所有物件的雜湊碼都一樣，那麼 `HashMap` 的查找效率就會大幅下降，退化成類似 `List` 逐一比對的速度。
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
這張表的三條規則，可以這樣理解：

1. 同一套演算法、同一份資料，算出來的雜湊碼一定相同
2. 換一套演算法，就算資料相同，結果通常也不同
3. 在 Object 預設的行為下，每個物件都是獨立的，雜湊碼通常也不同
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
`str1` 和 `str2` 兩個變數的值都是 `"Foo"`，呼叫 `hashCode()` 後都得到 `70822`。這是因為 `String` 類別覆寫了 Object 的預設行為，改成依照「內容」計算雜湊碼。

⚠️ 易錯點提醒：
如果一個類別沒有覆寫 `hashCode()`，那麼即使兩個物件的內容一模一樣，因為是「不同的物件」，也會得到不同的雜湊碼。

【預期結果】
這段程式碼會輸出兩次 `70822`。
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
`Integer` 的 `10` 算出來的雜湊碼直接就是 `10`，而 `String` 的 `"Foo"` 算出來是 `70822`。這代表 `Integer` 和 `String` 各自用了不同的演算法計算雜湊碼。

【預期結果】
這段程式碼會分別輸出 `70822` 和 `10`，說明不同類別的雜湊演算法並不相同，無法直接互相比較。
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
【重點解說】
過去手寫 `hashCode()` 常會看到類似 `31 * result + (s == null ? 0 : s.hashCode())` 的寫法，現在我們可以直接交給 `Objects.hash()` 處理。

⚠️ 關鍵原則：
如果 `equals()` 用 `id` 和 `email` 來判斷兩個物件是否相等，那麼 `hashCode()` 也必須使用這兩個欄位。兩者必須「對齊」，否則物件放進 `HashMap` 之後可能會找不到。
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
重點就在 `Objects.hash(id, email)` 這一行——把所有要用來判斷相等的欄位傳進去，剩下的計算與 `null` 處理都交給 `Objects.hash()` 完成。

【預期結果】
這個 `User` 類別覆寫 `hashCode()` 後，只要 `id` 和 `email` 相同的兩個 `User` 物件，呼叫 `hashCode()` 就會得到相同的結果。
-->
---
layout: default
---

# 🎬 AI 協作時刻：為什麼不自己寫雜湊演算法？

以前的教材常常示範手寫 `31 * result + ...` 這種雜湊演算法，現在我們都改用 `Objects.hash()`。讓 AI 說清楚背後的原因：

**要用的 Prompt：**

> 請解釋為什麼現代 Java 開發建議用 `Objects.hash(欄位...)`，
> 而不是自己手寫雜湊演算法。
> 並舉一個「自己寫的 hashCode() 設計不良」導致 HashMap 查找變慢的例子，
> 100 字以內，不要用太深的數學細節。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 手寫雜湊演算法容易寫出「品質差」的雜湊碼，導致效能問題；`Objects.hash()` 已經幫我們處理好這件事。
</div>

<!--
【操作提示】
可以請一位同學念出 AI 的回答，順便對照前面「置物櫃號碼牌」的比喻，看 AI 舉的例子是否也用了類似的生活化說明。

【收斂一句話】
現代開發能站在巨人肩膀上，Objects.hash() 就是這樣的巨人。
-->
---
layout: default
---

# 練習 2：用 Objects.hash() 設計 Book
### 任務說明

設計一個 `Book` 類別，包含以下欄位：

```java
class Book {
    String isbn;
    String title;
}
```

1. 使用 `Objects.hash(isbn, title)` 覆寫 `hashCode()`
2. 在 `main()` 中建立兩個 `isbn`、`title` 都相同的 `Book` 物件 `b1`、`b2`
3. 印出 `b1.hashCode()` 與 `b2.hashCode()`，驗證兩者是否相同
4. 再建立一個 `title` 不同的 `Book` 物件 `b3`，印出它的 `hashCode()`，觀察與 `b1` 是否不同

<!--
【任務鋪陳】
剛才學到現代化的 `hashCode()` 寫法就是把要用來判斷相等的欄位丟給 `Objects.hash()`，這個練習就是讓我們動手做一次，並驗證「相同內容 → 相同雜湊碼」這個規則。

【引導思考】
想一想：如果 `Book` 完全不覆寫 `hashCode()`，`b1` 和 `b2` 的雜湊碼會相同嗎？為什麼覆寫之後就會相同？

【等待與觀察】
給大家 5 分鐘。提示：`Objects.hash()` 可以傳入任意數量的欄位，用逗號分隔即可。
-->
---
layout: default
---

# 練習 2：用 Objects.hash() 設計 Book
### 解題提示

```java
import java.util.Objects;

class Book {
    String isbn;
    String title;

    Book(String isbn, String title) {
        this.isbn = isbn;
        this.title = title;
    }

    @Override
    public int hashCode() {
        return Objects.hash(isbn, title);
    }
}
```

```java
Book b1 = new Book("978-1", "Java 入門");
Book b2 = new Book("978-1", "Java 入門");
Book b3 = new Book("978-1", "Java 進階");

System.out.println(b1.hashCode() == b2.hashCode()); // true
System.out.println(b1.hashCode() == b3.hashCode()); // false（通常不同）
```

<!--
【帶讀解法】
`b1` 和 `b2` 的 `isbn`、`title` 完全相同，所以 `Objects.hash(isbn, title)` 算出來的雜湊碼也相同；`b3` 的 `title` 不同，雜湊碼通常會不同。

⚠️ 小提醒：
如果 `Book` 沒有覆寫 `hashCode()`，即使 `b1` 和 `b2` 的欄位內容一模一樣，因為它們是「不同的物件」，預設的 `hashCode()` 還是會給出不同的結果——這就是為什麼我們需要根據欄位內容自己覆寫 `hashCode()`。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# equals() 方法

<!--
【段落轉換】
接下來認識 `equals()` 方法，這是 Java 開發中最常被誤用、也最值得我們搞清楚的方法之一。
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
【重點解說】
`==` 比較的是「位置」：兩個變數是不是指向同一個物件。`equals()` 比較的是「內容」：兩個物件的內容是不是一樣（可以被 `override`）。

【帶讀程式碼】
`s1` 和 `s2` 用 `new String("Java")` 分別建立，雖然內容（`"Java"`）相同，但它們是記憶體中兩個不同的物件，所以 `s1 == s2` 是 `false`，而 `s1.equals(s2)` 因為 `String` 覆寫了 `equals()`，會比較內容，結果是 `true`。

⚠️ 易錯點提醒：
用 `==` 來比較字串內容，是非常常見的錯誤，務必養成用 `equals()` 比較內容的習慣。
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
如果一個類別沒有覆寫 `equals()`，那麼它繼承自 `Object` 的 `equals()`，行為其實就跟 `==` 一樣：只有「同一個物件」才會回傳 `true`。

`a1` 和 `a2` 雖然欄位內容完全一樣，但是兩個不同的物件，所以 `a1.equals(a2)` 是 `false`。而 `a3` 是直接指向 `a1` 的同一個物件，所以 `a1.equals(a3)` 是 `true`。

💡 因此，如果我們希望「欄位內容相同就視為相等」，就需要自己覆寫 `equals()`。
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
`String` 類別之所以好用，是因為它已經幫我們覆寫好了 `equals()`，會逐字比對每個字元是否相同。

【重點解說】
記住：除了 primitive 型態（如 `int`、`char`）可以直接用 `==` 比較，其他物件如果要比較內容，一律使用 `equals()`。
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
這是現代化的寫法，分三步：

第一步，如果是同一個參照，直接回傳 `true`，效能最好。
第二步，用 `instanceof` 搭配 Pattern Matching，一行同時完成「型別檢查」和「轉型宣告」，把 `o` 轉成 `User other`。
第三步，用 `Objects.equals()` 比較各欄位內容，安全處理 `null`。

⚠️ 易錯點提醒：
覆寫 `equals()` 之後，務必同時覆寫 `hashCode()`，這兩個方法的行為必須「對齊」，不然集合類別（如 `HashMap`）可能會出現異常行為。
-->
---
layout: default
---

# 🎬 AI 協作時刻：equals/hashCode 面試題驗收

equals/hashCode 的「配對規則」是 junior 面試最常考的 OOP 觀念之一，考前讓 AI 幫你出題：

**要用的 Prompt：**

> 根據「只覆寫 equals() 卻沒有覆寫 hashCode()」這個常見錯誤，
> 出 3 題選擇題，考我這個錯誤會造成什麼後果（例如物件放進 HashSet/HashMap 後會發生什麼事）。
> 一次只出一題，等我回答後才公布答案，
> 答錯時不要直接講答案，先給一個提示。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>帶回家用：</b> 「equals 和 hashCode 要一起覆寫」幾乎是每一場 Java 面試都會被問到的題目，務必練到能不假思索答出來。
</div>

<!--
【操作提示】
建議實際找一位同學跟 AI 互動作答，其他人在台下一起猜答案，增加參與感。

【收斂一句話】
equals() 決定「算不算同一個」，hashCode() 決定「放進哪個櫃子」，兩者對不上，物件就會在集合裡「查無此人」。
-->
---
layout: default
---

# 練習 3：equals() 與 toString() 的對齊

### 任務說明

設計一個 `Product` 類別，包含以下欄位：

```java
class Product {
    String code;
    String name;
    double price;
}
```

1. 覆寫 `toString()`，輸出格式為 `"Code: P001, Name: 滑鼠, Price: 299.0"`
2. 覆寫 `equals()`，比較 `code` 是否相同即視為相同商品
3. 建立兩個 `code` 相同但 `name`、`price` 不同的物件，驗證 `equals()` 結果

<!--
【任務鋪陳】
我們剛才看過 `equals()` 的現代化寫法，也看過 `toString()` 可以幫物件「自我介紹」。現在來練習把這兩個方法結合在同一個類別裡。

【引導思考】
想一下，如果兩個 `Product` 的 `code` 相同，但 `name` 和 `price` 不同，依照題目要求，`equals()` 應該回傳 `true` 還是 `false`？這跟「比較所有欄位」的寫法有什麼不同？
-->
---
layout: default
---

# 練習 3：解題提示

```java
@Override
public String toString() {
    return "Code: " + code + ", Name: " + name + ", Price: " + price;
}

@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o instanceof Product other) {
        return Objects.equals(this.code, other.code);
    }
    return false;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>說明：</b> 此處只用 code 判斷相等，代表「商品代碼」就是這個 Product 的識別依據
</div>

<!--
【逐步解說】
`toString()` 直接用字串拼接欄位即可。`equals()` 的重點在於只比較 `code`，所以即使 `name` 或 `price` 不同，只要 `code` 一樣，就會被視為「同一個商品」。

⚠️ 易錯點提醒：
這裡只覆寫了 `equals()`，但如果要把 `Product` 放進 `HashSet` 或 `HashMap`，還需要搭配覆寫 `hashCode()`，並且使用相同的欄位（`code`）——這就是我們前面一直強調的「兩者要一致」原則。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# toString() 方法

<!--
【段落轉換】
最後來看比較輕鬆的部分：`toString()`，也就是物件的「自我介紹」。
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
如果一個類別沒有覆寫 `toString()`，Java 預設印出來的會是「類別名稱@雜湊碼」這種不易閱讀的格式，例如 `Animal@1b6d3586`，光看這個結果，完全看不出物件實際的內容。

⚠️ 易錯點提醒：
我們不需要特地呼叫 `.toString()`。當我們執行 `System.out.println(a)` 時，Java 會自動幫我們呼叫 `a.toString()`。
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
覆寫 `toString()` 之後，印出來的內容就變成有意義的文字了，能直接看出物件目前的狀態。

💼 業界實務：
日誌（log）是排查問題時的重要依據。如果類別沒有覆寫 `toString()`，發生問題時，log 裡只會看到一堆 `User@2a3b4c` 這種訊息，難以追蹤問題。
-->
---
layout: default
---

# 🎬 AI 協作時刻：印出一堆亂碼，是哪裡錯了嗎？

`println(物件)` 印出 `User@1b6d3586` 這種結果，很多初學者會以為是程式出錯了：

**要用的 Prompt：**

> 我印出一個物件時看到這樣的結果：`User@1b6d3586`，
> 不是我預期看到的內容，請幫我判斷這是不是錯誤，
> 問題出在哪裡，以及該怎麼修正：
> `{貼上你的類別程式碼}`

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提醒：</b> 這不是例外，也不是編譯錯誤——這是 <code>Object</code> 預設 <code>toString()</code> 的正常輸出格式「類別名稱@雜湊碼」。只要覆寫 <code>toString()</code>，印出來的內容就會變得有意義。
</div>

<!--
【操作提示】
現場示範一個沒有覆寫 toString() 的類別，印出物件得到 User@1b6d3586 這種結果，讓學生先自己判斷這是不是 bug，再把程式碼貼給 AI 驗證判斷是否正確。

【收斂一句話】
看到「類別名稱@一串英數字」不用慌，那只是預設的 toString()，補上覆寫就能印出有意義的內容。
-->
---
layout: default
---

# 練習 4：Override Order 的 toString()
### 任務說明

設計一個 `Order` 類別，包含以下欄位：

```java
class Order {
    String orderId;
    String customer;
    int amount;
}
```

1. 不覆寫任何方法，建立一個 `Order` 物件並用 `System.out.println()` 印出，觀察預設輸出格式
2. 覆寫 `toString()`，輸出格式為 `"訂單 O001，客戶：古古，金額：1500"`
3. 再印出同一個物件，比較兩次輸出的差異

<!--
【任務鋪陳】
剛才看到，沒有覆寫 `toString()` 的物件印出來會是「類別名稱@雜湊碼」這種看不懂的格式。這個練習就是讓我們實際體驗一次「沒覆寫」和「有覆寫」的差別。

【引導思考】
想一想：`System.out.println(order)` 這一行，背後到底呼叫了什麼方法？我們覆寫 `toString()` 之後，這一行程式碼本身需要修改嗎？

【等待與觀察】
給大家 5 分鐘。提示：`println()` 的程式碼完全不用改，只需要在 `Order` 類別裡新增 `toString()` 方法。
-->
---
layout: default
---

# 練習 4：Override Order 的 toString()
### 解題提示

```java
class Order {
    String orderId;
    String customer;
    int amount;

    Order(String orderId, String customer, int amount) {
        this.orderId = orderId;
        this.customer = customer;
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "訂單 " + orderId + "，客戶：" + customer + "，金額：" + amount;
    }
}
```

```java
Order order = new Order("O001", "古古", 1500);
System.out.println(order);
// 覆寫前：Order@1b6d3586
// 覆寫後：訂單 O001，客戶：古古，金額：1500
```

<!--
【帶讀解法】
重點在於：`System.out.println(order)` 這行程式碼完全沒有改變，改變的只是 `Order` 類別內部多了一個 `toString()` 方法。`println()` 會自動呼叫物件的 `toString()`，所以只要我們把這個方法寫好，輸出就會變得有意義。

💼 業界實務：
像 `Order`、`User` 這類常常需要被印出來 debug 或寫進 log 的類別，覆寫 `toString()` 幾乎是必做的工作——IDE 通常都有「自動產生 toString()」的功能，但理解背後原理才能在出錯時知道怎麼修正。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 其他 Object 方法

<!--
【段落轉換】
最後我們認識一個用來「確認身分」的方法：`getClass()`。
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
【重點解說】
`getClass()` 會回傳一個 `Class` 物件，代表這個物件實際所屬的類別，可以理解成「確認這個物件的出身」。

💼 業界實務：
這個方法在框架開發中很常見，例如 Spring 或 Hibernate 等框架，會用 `getClass()` 來檢視物件的結構，進而自動產生對應的 SQL 或處理依賴注入。
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
如果只需要類別的名字字串（例如記錄 log），可以呼叫 `getName()`。

⚠️ 易錯點提醒：
有些人會用 `getClass()` 來取代 `instanceof` 做型別判斷，但要注意 `getClass()` 的比較非常嚴格，連子類別都會被視為「不同類別」，這跟 `instanceof` 的行為不一樣。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
這一章學了 Object 類別、hashCode()、equals()、toString() 這幾個常被覆寫的方法，最後這個綜合練習要把它們全部整合到同一個類別裡，動手做一次完整的覆寫。
-->
---
layout: default
---

# 練習 5 (綜合)：Employee 類別

### 任務說明

建立一個 `Employee` 類別，包含以下欄位：

```java
class Employee {
    String name;
    int age;
    String country;
}
```

1. 覆寫 `toString()`，輸出格式為 `"Name: xxx, Age: xx, Country: xxx"`
2. 建立兩個屬性值相同的 `Employee` 物件，比較它們的 `hashCode()`
3. 觀察 `Object` 預設 `hashCode()` 的行為（屬性相同 ≠ 相同 hash 碼）
4. 覆寫 `equals()` 與 `hashCode()`，使屬性相同的物件視為相等，且回傳相同 hash 值

<!--
【任務鋪陳】
這一章我們學了 `toString()`、`hashCode()`、`equals()` 三個方法，這個綜合練習要把它們全部整合到同一個 `Employee` 類別裡。

【引導思考】
先試著不覆寫任何方法，印出兩個內容相同的 `Employee` 的 `hashCode()`，看看結果是否相同。接著加上 `toString()`，再加上 `equals()` 和 `hashCode()` 的覆寫，看看結果會如何變化。記得：`equals()` 和 `hashCode()` 用到的欄位必須一致。
-->
---
layout: default
---

# 練習 5 (綜合)：解題提示

1. **覆寫 toString()**

```java
@Override
public String toString() {
    return "Name: " + name + ", Age: " + age + ", Country: " + country;
}
```

2. **覆寫 equals() 與 hashCode()，欄位要一致**

```java
import java.util.Objects;

@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o instanceof Employee other) {
        return Objects.equals(name, other.name) &&
               age == other.age &&
               Objects.equals(country, other.country);
    }
    return false;
}

@Override
public int hashCode() {
    return Objects.hash(name, age, country);
}
```

3. **驗證結果**：屬性相同的兩個物件，`equals()` 應為 `true`，`hashCode()` 也應相同

<!--
【逐步解說】
第一步補上 `toString()`，讓物件可以印出有意義的內容。第二步用 `Objects.hash(name, age, country)` 計算雜湊碼，並讓 `equals()` 比較同樣這三個欄位——這就是我們今天反覆強調的「欄位要一致」原則。

⚠️ 易錯點提醒：
如果只覆寫 `equals()` 卻忘記覆寫 `hashCode()`，兩個內容相同的物件在 `equals()` 比較時是 `true`，但放進 `HashSet` 後卻可能找不到彼此，這正是這兩個方法必須「成對」覆寫的原因。
-->
---

# 總結

- **`Object` 是所有 Java 類別的共同祖先**，位於 `java.lang`，`toString()`、`equals()`、`hashCode()`、`getClass()` 都是繼承自它
- **`java.util.Objects`（注意多一個 s）提供 null 安全的工具方法**：`equals(a, b)`、`isNull()`／`nonNull()`、`requireNonNullElse()` 都能避免手動 `if-else` 判斷 null
- **`hashCode()` 是物件的「門牌號碼」**，相同內容應產生相同雜湊碼；現代寫法用 `Objects.hash(欄位...)` 取代手寫演算法
- **`equals()` 內容比較要用 `Objects.equals()`，位址比較才用 `==`**；現代寫法搭配 Pattern Matching：`if (o instanceof X other) { ... }`
- **`equals()` 與 `hashCode()` 必須成對覆寫、使用相同欄位** — 只改一個會讓物件在 `HashMap`／`HashSet` 裡「查無此人」
- **`toString()` 決定物件被印出的樣子**，不覆寫的話預設是難以閱讀的「類別名稱@雜湊碼」
- **`getClass()` 取得物件實際所屬的類別**，比較比 `instanceof` 更嚴格，連子類別都視為不同類別

<!--
我們把這一章整理成七個重點。

第一，Object 是所有 Java 類別的共同祖先，住在 java.lang 套件裡，我們平常用到的 toString()、equals()、hashCode()、getClass() 這些方法，全部都是從它繼承下來的。

第二，java.util.Objects 這個工具類別名字只差一個 s，但用途完全不同，它提供了 null 安全的方法，像 Objects.equals()、isNull()、nonNull()、requireNonNullElse()，可以幫我們省掉很多手動判斷 null 的 if-else。

第三，hashCode() 可以想成物件的門牌號碼，是集合類別能快速查找的關鍵；現代開發不再手寫雜湊演算法，改用 Objects.hash() 把要參與計算的欄位傳進去就好。

第四，比較物件內容要用 equals()，絕對不要用 ==，因為 == 比的是記憶體位址；現代寫法會搭配 Pattern Matching for instanceof，把型別判斷和轉型合併成一行。

第五，這一章反覆強調的鐵律：equals() 和 hashCode() 必須成對覆寫，而且要用同一組欄位，只改其中一個，物件放進 HashMap 或 HashSet 之後就可能發生「明明內容一樣卻找不到」的詭異情況。

第六，toString() 決定了物件被印出來的樣子，如果不覆寫，預設格式是類別名稱加雜湊碼，完全看不出物件的實際內容，這也是為什麼幾乎每個需要被印出或寫進 log 的類別都會覆寫它。

第七，getClass() 可以取得物件實際所屬的類別，用來做型別檢查時要特別注意，它比 instanceof 更嚴格，連父子類別的關係都不算「相同類別」。

這七點加起來，就是 Object 類別的完整地圖。下一章我們要繼續往下走了！
-->

---
layout: end
---

# 課程結束
### 下一章見！

<!--
[依脈絡推斷]
今天我們認識了 Object 類別這位「老祖宗」，學會了怎麼正確覆寫 `equals()`、`hashCode()`、`toString()`，也認識了好幫手 `Objects` 工具類別。記得：`equals()` 和 `hashCode()` 是綁在一起的，覆寫一個就要連動覆寫另一個。我們下一章「抽象類別」見！
-->
