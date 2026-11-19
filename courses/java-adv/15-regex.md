---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 正規表達式 (Regular Expression)（進階／自學）
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
    正規表達式
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    進階自學內容
  </p>
  <Link to="home" style="color:#9dc4c4;font-size:0.85rem;margin-top:2rem;text-decoration:none;letter-spacing:0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到正規表達式的進階自學篇。基礎版我們已經學會用字元類別、量詞、分組描述字串的「長相」，也學會 `matches`、`split`、`replaceAll` 這幾個最常用的 String 方法，現在來挑戰更深一層的玩法。

為什麼要學這些？想像一下，基礎版的正規表達式像是一把基本款的瑞士刀，能切能削已經很夠用；但如果遇到「找出重複的單字」「解析日期並分別取出年月日」「驗證密碼必須同時包含數字和大寫字母」這類更刁鑽的需求，就需要更多刀片——也就是反向引用、具名分組、環視斷言，以及 `Pattern`、`Matcher` 這兩個正式的工具類別。

學完這份自學內容，我們會知道怎麼用 `\1` 偵測重複文字、怎麼用 `(?<name>...)` 讓分組自我說明、怎麼用環視斷言做密碼強度檢查，也會熟悉 `Pattern` 和 `Matcher` 的完整用法，甚至能把正規表達式跟 Stream API 串在一起，寫出更精簡的批次處理程式。
-->

---
layout: default
---

# Outline

- **進階分組語法**
  - 反向引用（Backreferences）、具名分組（Named Group）、非擷取分組
- **位置與環視符號**
  - `^`、`$`、`(?i)`、`\b`、環視斷言（Lookaround）
- **`Pattern` 與 `Matcher` 類別**
  - 套件介紹、`Pattern` 常用方法、`Pattern.quote()`、`MULTILINE`/`DOTALL` 旗標、`Matcher` 常用方法、`lookingAt()`
- **與 Stream API 整合**
  - `asPredicate()`、`splitAsStream()`、動態取代（`Matcher.results()`）
- **自學練習**

<!--
這份自學內容延續基礎版的脈絡，往四個方向延伸。第一部分是「分組」的進階玩法：除了基本的 `()`，我們還能用反向引用 `\1` 重複比對前面抓到的內容，用具名分組 `(?<name>...)` 讓程式碼自我說明，也能用 `(?:...)` 做純邏輯分組不佔編號。

第二部分是「位置與環視符號」：`^`、`$`、`\b`、`(?i)` 這些符號比對的是「位置」而不是字元，最後再加上環視斷言這個「偷看但不吃掉字元」的技巧，常用在密碼強度驗證。第三部分回到 `java.util.regex` 套件本身，把 `Pattern` 和 `Matcher` 這兩個類別的常用方法整理清楚。第四部分則是現代 Java 的玩法，把正規表達式跟 Stream API 結合起來。

這些內容不是寫基本程式的必要條件，但如果你以後要處理複雜的文字解析、資料驗證，或想在面試中展現對 Java API 的熟悉度，這份自學內容會很有幫助。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 進階分組語法

<!--
基礎版我們學過 `()` 可以把幾個字元打包成一個群組，方便套用量詞。這部分要繼續往下挖：分組除了「打包」之外，還能「被重複引用」、「被取名字」，甚至「不被記錄」。這三種變化分別對應反向引用、具名分組和非擷取分組，掌握之後，正規表達式的表達力會大幅提升。
-->

---
layout: default
---

# `\\n` — 反向引用 (Backreferences)

反向引用允許你在表達式中**重複引用前面分組比對到的內容**

| 表達式 | 說明 |
| --- | --- |
| `\\1` | 引用第 1 個分組的比對結果 |
| `(\\w)\\1` | 比對連續兩個相同的字元（如 aa, 11） |

```java
// 比對重複的單字
String text = "hello hello world";
System.out.println(text.matches("(\\w+) \\1 .*")); // true (引用了第1個分組 hello)

// 比對 HTML 標籤是否對稱
String html = "<div>content</div>";
System.out.println(html.matches("<(\\w+)>.*</\\1>")); // true
```

<!--
想像一下我們在校稿，文章裡不小心打成「我們 我們 要出發了」，重複了一個詞——這種「前面出現過什麼，後面要再出現一次一樣的東西」的需求，就是反向引用的拿手好戲。

`\1` 不是一個新符號，而是「複製貼上」第 1 組分組實際比對到的內容。所以 `(\w+) \1 .*` 的意思是：第 1 組先抓一個單字，接著空格，然後 `\1` 要求「跟剛才抓到的一模一樣」，所以 `"hello hello world"` 符合，但 `"hello world world"` 不符合，因為 `\1` 要的是 `hello`。

HTML 標籤範例 `<(\w+)>.*</\1>` 確保開標籤和閉標籤的名稱一致，這在檢查標籤是否成對時很實用。

業界實務上，偵測重複單字（像英文裡常見的 "the the"）是文字校稿工具的基本功能，背後就是靠反向引用。
-->

---

# 反向引用拆解：`(\\w+) \\1 .*`

以字串 `"hello hello world"` 為例：

| 片段 | 說明 | 比對到的內容 |
| --- | --- | --- |
| `(\\w+)` | **第 1 組**：一個以上的字母或數字 | `hello` |
| ` ` | 字面空格 | ` `（空格）|
| `\\1` | 反向引用：必須與第 1 組**完全相同的文字** | `hello`（重複）|
| ` ` | 字面空格 | ` `（空格）|
| `.*` | 任意字元，0 個以上 | `world` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵：</b><code>\\1</code> 不是「再比對一個單字」，而是「必須與第 1 組抓到的內容一模一樣」。<br>
所以 <code>"hello world world"</code> 不符合，因為 <code>\\1</code> 要求的是 <code>hello</code>，不是 <code>world</code>。
</div>

<!--
上一頁的範例比較抽象，這頁我們把 `(\w+) \1 .*` 一格一格拆開來走一遍，搭配字串 `"hello hello world"` 看會更清楚。

`(\w+)` 先抓到第一個單字 `hello`，存成第 1 組；接著比對一個字面空格；然後 `\1` 出場——它不是再去比對一個新的單字，而是要求「這個位置必須剛好是 `hello`」，也就是把第 1 組的結果原封不動地搬過來再比一次；再一個空格；最後 `.*` 隨便比對剩下的內容。

⚠️ 易錯點：很多人第一次看到 `\1` 會以為它代表「再一個單字」，但其實它是「第 1 組內容的複製品」。如果第 1 組抓到的是 `hello`，`\1` 就只能符合 `hello`，不能符合 `world` 或其他任何單字，這也是為什麼 `"hello world world"` 不會符合。
-->

---

# 具名分組 (Named Capturing Groups)

除了用編號 `\\1`，也可以為分組**取名字**，提高可讀性

| 語法 | 說明 |
| --- | --- |
| `(?<name>...)` | 定義具名分組 |
| `\\k<name>` | 在表達式中引用具名分組 |

```java
// 使用具名分組比對日期
String dateRegex = "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})";
String input = "2024-05-20";

System.out.println(input.matches(dateRegex)); // true

// Matcher 也可以透過名字取得內容
// matcher.group("year") -> "2024"
```

<!--
基礎版的分組是用數字編號（第 1 組、第 2 組...），如果表達式很長、分組很多，光看 `group(3)` 根本不知道代表什麼。具名分組就是幫每個分組「貼標籤」，像幫收納盒貼標籤一樣，一看就知道裡面裝的是什麼。

`(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})` 把一個日期拆成三個有名字的分組：`year`、`month`、`day`。之後要取值時，用 `matcher.group("year")` 取出 `"2024"`，比 `group(1)` 直覺很多，也不怕之後調整分組順序而讓編號錯位。

業界實務上，解析日期、電話、身分證這類有固定結構的字串時，具名分組讓程式碼自我說明，新同事接手維護也能一看就懂。
-->

---

# 具名分組提取 — Matcher 完整範例

```java
import java.util.regex.*;
String dateRegex = "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})";
Matcher m = Pattern.compile(dateRegex).matcher("2024-05-20");

if (m.matches()) {
    System.out.println(m.group("year"));  // 2024
    System.out.println(m.group("month")); // 05
    System.out.println(m.group("day"));   // 20
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>m.group("year")</code> 比 <code>m.group(1)</code> 更清楚，不受分組順序變動影響
</div>

<!--
這頁把上一頁的具名分組接到完整的 `Pattern` / `Matcher` 流程：`Pattern.compile()` 先把表達式編譯起來，`matcher()` 套用到目標字串，`m.matches()` 確認整個字串符合後，就可以用 `m.group("year")`、`m.group("month")`、`m.group("day")` 把年月日分別取出來。

⚠️ 易錯點：一定要先成功呼叫 `matches()` 或 `find()`，才能呼叫 `group()`。如果跳過這一步直接呼叫 `group()`，會`拋出` `IllegalStateException`，這是很常見的執行期錯誤。

業界實務上，如果同一個正規表達式要重複使用，建議把 `Pattern.compile()` 的結果存成靜態常數，而不是每次方法呼叫都重新 compile 一次，這樣效能會更好。
-->

---

# `(?:...)` — 非擷取分組

有時我們只需要分組的**邏輯功能**（例如套用量詞），但不需要記錄比對內容（節省效能）

| 語法 | 說明 |
| --- | --- |
| `(?:...)` | 純分組，不計入編號，不可被引用 |

```java
// 我們只想比對是否包含 .com 或 .org，但不需要擷取它
String regex = ".*\\.(?:com|org)";
System.out.println("google.com".matches(regex)); // true
// 此時沒有 group(1)，因為它是非擷取分組
```

<!--
回顧一下，基礎版的 `()` 有兩個功能：一是「打包套用量詞」，二是「擷取比對內容供之後取用」。但有時候我們只需要第一個功能——比如說只是想用 `|` 在一個範圍內做選擇，卻完全不打算用 `group(1)` 去取值，這時繼續用 `()` 就有點浪費。

`(?:...)` 就是「只要打包，不要擷取」的分組。範例 `.*\.(?:com|org)` 用來比對以 `.com` 或 `.org` 結尾的網址，`(?:com|org)` 只是讓 `|` 的選擇範圍限定在括號內，但執行完之後並不會多出一個 `group(1)`。

業界實務上，如果一個表達式裡分組很多、但只有少數需要擷取，把不需要的都改成 `(?:...)`，可以避免分組編號混亂，也能稍微提升效能，尤其在大量重複搜尋時更明顯。
-->

---
layout: default
---

# 練習 0：具名分組 — 解題解析
### 任務說明

請完成以下任務：

1. 使用**具名分組**解析網址 `"https://www.example.com"`，分別取出 `protocol`（如 `https`）與 `host`（如 `www.example.com`）兩個欄位。
2. 將表達式中「`http` 或 `https`」這個選擇範圍改用**非擷取分組** `(?:...)`，確保它不會多佔用一個分組編號。

<!--
回顧一下，這部分學了具名分組 `(?<name>...)` 讓我們可以用名字取出比對結果，也學了非擷取分組 `(?:...)` 用來「只打包不擷取」。這個練習要把兩者放在同一個表達式裡實際用一次。

引導思考：網址格式是「`protocol://host`」，`protocol` 部分是 `http` 或 `https` 二選一，這個選擇要不要被當成一個獨立分組？如果用 `(?<protocol>...)` 包住整個選擇，裡面的 `http|https` 還需要再多一層 `()` 嗎？
-->

---
layout: default
---

# 練習 0：具名分組 — 解題解析
### 解題提示

```java
String regex = "(?<protocol>https?)://(?<host>[\\w.]+)";
Matcher m = Pattern.compile(regex).matcher("https://www.example.com");

if (m.matches()) {
    System.out.println(m.group("protocol")); // https
    System.out.println(m.group("host"));     // www.example.com
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 這裡用 <code>https?</code> 的 <code>?</code> 就能表示「`http` 或 `https`」，剛好不需要額外的 <code>(?:...)</code>，是比 <code>(?:http|https)</code> 更精簡的寫法。
</div>

<!--
這裡示範了一個小技巧：`https?` 用 `?` 讓 `s` 可有可無，就能同時比對 `http` 跟 `https`，比寫成 `(?:http|https)` 更簡潔，剛好也呼應了「能不擷取就不擷取」的精神——這裡甚至不需要分組就解決了。

`(?<protocol>https?)` 跟 `(?<host>[\w.]+)` 兩個具名分組分別抓出協定跟主機名稱，最後用 `m.group("protocol")`、`m.group("host")` 取值，比用編號 `group(1)`、`group(2)` 更直觀。

⚠️ 易錯點：如果改成 `(?<protocol>(?:http|https))`，雖然也能動作，但 `(?:...)` 包在具名分組裡面其實是多餘的——具名分組本身就不會因為內容是「選擇」而多佔用分組編號，這也是這題想讓大家體會的地方。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 位置與環視符號

<!--
進階分組搞定了，接下來這部分要轉換一個角度：前面學的符號幾乎都在比對「字元」，但 `^`、`$`、`\b`、`(?i)` 這幾個符號比對的是「位置」或「模式」，不會吃掉任何字元。最後再加上環視斷言——同樣是「偷看但不吃掉字元」的技巧，常用在密碼強度驗證。我們一步一步來看。
-->

---
layout: default
---

# `^` 和 `$` — 比對開頭與結尾

當 `^` 和 `$` **不在**中括號內時，表示字串的**開頭**和**結尾**位置

| 表達式 | 說明 |
| --- | --- |
| `^Java` | 字串以 Java 開頭 |
| `Java$` | 字串以 Java 結尾 |
| `^Java$` | 字串恰好等於 Java |

```java
import java.util.regex.*;
String s1 = "Java is fun";
String s2 = "I love Java";
System.out.println(Pattern.compile("^Java").matcher(s1).find()); // true
System.out.println(Pattern.compile("Java$").matcher(s2).find()); // true
```

<!--
`^` 和 `$` 比對的是「位置」，不是字元：`^` 代表字串開頭這個位置，`$` 代表字串結尾這個位置。`^Java` 表示字串從開頭就是 Java；`Java$` 表示字串到結尾正好是 Java；兩個疊在一起的 `^Java$` 就要求字串「整個」就是 Java。

帶讀程式碼的時候要特別注意：這裡用的是 `Pattern` 和 `find()`，不是基礎版熟悉的 `matches()`。`find()` 可以在字串中間搜尋子字串，搭配 `^`、`$` 才能定位到開頭或結尾。

⚠️ 易錯點：在 `matches()` 裡，因為本來就是比對整個字串，`^` 和 `$` 幾乎沒有作用——你寫不寫都一樣。`^` 和 `$` 真正發揮定位效果的場合是 `find()`，這也是為什麼我們把這個主題留到自學版、跟 `Pattern`/`Matcher` 放在一起講。
-->

---

# `(?i)` 與 `\\b` — 旗標與單字邊界

| 表達式 | 說明 |
| --- | --- |
| `(?i)` | 忽略大小寫，置於表達式開頭 |
| `\\b` | 單字邊界：匹配一個**位置**，用於比對完整單字 |
| `\\bJava\\b` | 只比對完整單字 Java（不含 JavaScript） |

<!--
`(?i)` 放在表達式最前面，效果是讓後面整段比對都忽略大小寫，很常用在不分大小寫的搜尋。

`\b` 是「單字邊界」，它跟 `^`、`$` 一樣比對的是位置而不是字元——具體來說，就是「單字字元」（`\w`）和「非單字字元」交界的那個點。`\bJava\b` 的意思是「前後都要是單字邊界的 Java」，也就是一個完整、獨立的單字。

業界實務上，搜尋完整單字一定要用 `\b`，不然搜尋 "Java" 連 "JavaScript" 裡的 "Java" 也會被找到，這在做全文搜尋、關鍵字比對時是常見的雷。
-->

---

# `(?i)` 與 `\\b` — 範例

```java
// (?i) 忽略大小寫
System.out.println("JAVA".matches("(?i)java")); // true
System.out.println("jAvA".matches("(?i)java")); // true

// \b 單字邊界（在 matches() 中比對整個字串）
System.out.println("Java".matches("\\bJava\\b"));       // true
System.out.println("JavaScript".matches("\\bJava\\b")); // false
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>\\b</code> 在子字串搜尋時更常用，搭配本章第三部分的 <code>Pattern</code> / <code>Matcher.find()</code> 效果更明顯
</div>

<!--
帶讀第一組範例：`(?i)` 讓 `"JAVA"`、`"jAvA"` 都能符合 `"(?i)java"`，不管大小寫怎麼組合都是 `true`。

帶讀第二組範例：`\bJava\b` 只比對「完整的 Java」，所以 `"Java"` 符合，但 `"JavaScript"` 不符合，因為 `Java` 後面緊接著 `Script`，中間沒有單字邊界。

互動一下：如果搜尋 `"cat"`，`"concatenate"` 裡面的 `cat` 會被找到嗎？（用 `\b` 就不會，不用 `\b` 就會）這就是 `\b` 在實務搜尋裡的價值。
-->

---
layout: default
---

# 環視斷言 (Lookaround)

在目前位置「偷看」前後是否符合條件，**確認後位置不動**，後面的 pattern 仍從同一位置繼續比對

| 表達式 | 說明 |
| --- | --- |
| `(?=pattern)` | 正向先行：右邊必須符合 pattern |
| `(?!pattern)` | 負向先行：右邊必須不符合 pattern |
| `(?<=pattern)` | 正向後行：左邊必須符合 pattern |
| `(?<!pattern)` | 負向後行：左邊必須不符合 pattern |

<!--
可以把環視斷言想成保全人員在門口「驗證」一下：檢查你是不是符合資格（例如有沒有戴識別證），確認完之後人並沒有真的被「帶走」，還是站在原地，後面的流程繼續走。這就是「不消耗字元」的意思。

四種組合：「先行」(lookahead) 是往右看，「後行」(lookbehind) 是往左看；「正向」要求右邊/左邊必須符合某個樣式，「負向」要求必須不符合。`(?=pattern)`、`(?!pattern)`、`(?<=pattern)`、`(?<!pattern)` 四個符號剛好對應「正向先行、負向先行、正向後行、負向後行」。

業界實務上，密碼強度驗證是環視斷言最常見的應用：「必須包含數字」「必須包含大寫字母」「必須包含特殊符號」，這些條件可以用多個 `(?=...)` 疊加在表達式開頭，一次性檢查完畢，下一頁就會看到實際範例。
-->

---

# 環視斷言 — 範例

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;
```
```java
// 密碼強度：含數字且長度 >= 8
String passRegex = "^(?=.*\\d).{8,}$";
System.out.println("password123".matches(passRegex)); // true
// 只擷取 $ 後面的數字（50 前面沒有 $，不符合）
Matcher m = Pattern.compile("(?<=\\$)\\d+").matcher("Price: $100, Cost: 50");
while (m.find()) {
    System.out.println(m.group()); // 100
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>「不消耗字元」：</b> 一般 pattern 比對到字元後，那些字元就「被用掉」，位置往後移。環視斷言只是偷看、不移動位置。<br>
以 <code>^(?=.*\\d).{8,}$</code> 為例：<code>(?=.*\\d)</code> 從開頭確認「字串含有數字」，確認完後位置還在開頭，接著 <code>.{8,}</code> 再從開頭量長度——兩個條件都從同一起點出發，互不干擾。
</div>

<!--
密碼範例 `^(?=.*\d).{8,}$` 帶讀重點放在 `(?=.*\d)`：它從字串開頭「偷看」一眼，確認後面某處有數字，確認完之後位置依然停在開頭，完全沒有移動。接著 `.{8,}` 再從同一個開頭位置量長度是不是至少 8。兩個條件各自從頭檢查一次，互不干擾，所以 `"password123"` 兩個條件都符合，結果是 `true`。

取金額範例 `(?<=\$)\d+` 用的是正向後行：要求左邊必須是 `$`，但 `$` 本身不算入比對結果裡，所以最後只取到 `100`，不包含 `$`。

⚠️ 易錯點：環視斷言「不消耗字元」這件事，第一次看真的會卡住，建議多看幾次範例、自己動手改改條件測試，多練習幾次就會抓到那種「偷看一眼但人沒有移動」的感覺。
-->

---
layout: default
---

# 練習 1：偵測重複單字與密碼格式
### 任務說明

請完成以下兩個小題：

1. 撰寫程式，使用反向引用判斷一段文字（以空格分隔的單字）中是否含有**連續重複的單字**（例如 `"the the cat"` 應判定為 true）。
2. 撰寫程式，使用環視斷言驗證密碼是否同時符合：
   - 長度至少 8 個字元
   - 至少包含 1 個數字
   - 至少包含 1 個大寫字母

<!--
回顧一下，我們剛學了反向引用 `\1` 可以「複製」前面分組抓到的內容，環視斷言 `(?=...)` 可以在不移動位置的情況下檢查多個條件。這個練習就是把這兩個工具分別實際用一次。

引導思考：第 1 小題，如果用 `(\w+) \1` 去比對 `"the the cat"`，要怎麼確保比對的是「整段文字裡某處」而不是「整個字串」？第 2 小題，密碼要同時符合三個條件，是不是可以用三個 `(?=...)` 疊在一起，各自負責檢查一個條件？想清楚這兩點，題目就不難了。
-->

---

# 練習 1：偵測重複單字與密碼格式
### 解題提示

```java
// 1. 偵測重複單字（搭配 find() 在字串中搜尋）
String text = "the the cat sat";
Matcher m = Pattern.compile("\\b(\\w+) \\1\\b").matcher(text);
System.out.println(m.find()); // true（the the）

// 2. 密碼驗證：長度 >= 8、含數字、含大寫字母
String passRegex = "^(?=.*\\d)(?=.*[A-Z]).{8,}$";
System.out.println("Pass1234".matches(passRegex)); // true
System.out.println("pass1234".matches(passRegex)); // false（沒有大寫）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 多個 <code>(?=...)</code> 可以一個接一個疊加，每個都是各自從同一個起點檢查一次，順序不影響結果。
</div>

<!--
第 1 小題用 `\b(\w+) \1\b` 搭配 `Matcher.find()`：`(\w+)` 抓到一個單字，`\1` 要求後面緊接著一個完全相同的單字，`\b` 確保是完整單字邊界，避免抓到 `"there there"` 這種誤判。`find()` 在整段文字裡搜尋，只要有任何一處重複就回傳 `true`。

第 2 小題的關鍵是把三個條件拆成三個獨立的 `(?=...)`：`(?=.*\d)` 檢查有數字、`(?=.*[A-Z])` 檢查有大寫字母，最後 `.{8,}` 檢查長度。三個環視斷言都是從字串開頭各自檢查一次，彼此互不影響，所以順序可以任意排列，結果都一樣。

⚠️ 易錯點：別忘了 `^` 和 `$` 要包住整個表達式，否則 `.{8,}` 可能只比對到字串中間一段就滿足，導致驗證失效。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# `Pattern` 與 `Matcher` 類別

<!--
基礎版的 `matches()`、`split()`、`replaceAll()` 都是 `String` 類別內建的方法，用起來很方便，但有個限制：只能比對「整個字串」，或做簡單的全部取代。如果想在一大段文字裡「搜尋」子字串、取得比對到的位置，或者重複使用同一個表達式做多次比對，就需要正式登場的 `java.util.regex` 套件——也就是 `Pattern` 和 `Matcher` 這兩個類別。
-->

---
layout: default
---

# `java.util.regex` 套件介紹

| 類別 | 說明 |
| --- | --- |
| `Pattern` | 編譯並儲存正規表達式，可重複使用 |
| `Matcher` | 對輸入字串執行比對，記錄比對結果與位置 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>與 String 方法的差異：</b> <code>String.matches()</code> 只能比對整個字串；<code>Matcher.find()</code> 可在長文字中搜尋子字串、取得位置。
</div>

```java
import java.util.regex.*;
Pattern pattern = Pattern.compile("\\d{4}");
Matcher matcher = pattern.matcher("年份2024今年");
while (matcher.find()) {
    System.out.println("找到: " + matcher.group()); // 找到: 2024
}
```

<!--
`java.util.regex` 套件提供兩個核心類別：`Pattern` 負責「編譯」表達式，`Matcher` 負責對某段字串「執行」比對。

可以把 `Pattern` 想成是刻好的印章——也就是已經編譯好的正規表達式；`Matcher` 就是「蓋印」這個動作，把印章套用到某一張紙（字串）上。同一個印章可以蓋在很多張紙上，這就是為什麼 `Pattern` 可以被重複使用、不用每次都重新編譯。

範例裡 `Pattern.compile("\\d{4}")` 先建立 `Pattern`，`matcher()` 套用到字串，`find()` 在字串中搜尋，`group()` 取出結果。和 `String.matches()` 最大的差別就在這裡：`Matcher.find()` 可以在長文字中找到子字串，不需要整個字串都符合。
-->

---

# `Pattern` 類別常用方法

| 方法 | 說明 |
| --- | --- |
| `Pattern.compile(regex)` | 編譯正規表達式，回傳 Pattern 物件 |
| `Pattern.compile(regex, flags)` | 帶旗標編譯（如 `Pattern.CASE_INSENSITIVE`） |
| `Pattern.matches(regex, input)` | 靜態方法，比對整個字串 |
| `p.matcher(input)` | 以此 Pattern 建立 Matcher 物件 |
| `p.split(input)` | 用此 Pattern 分割字串 |

<!--
這頁整理 `Pattern` 最常用的五個方法。`compile()` 是最基礎的入口，可以額外帶一個旗標參數，像 `Pattern.CASE_INSENSITIVE` 就等同基礎版學過的 `(?i)`，但寫法更明確、也方便在多處重複使用同一個設定。

`Pattern.matches()` 是靜態方法，功能等同 `String.matches()`，只是反過來呼叫；`p.split()` 的功能跟 `String.split()` 一樣，但是是從已經編譯好的 `Pattern` 物件直接呼叫，適合需要重複切割很多字串的情境。
-->

---

# `Pattern` 類別 — 範例

```java
import java.util.regex.*;

// 忽略大小寫旗標
Pattern p = Pattern.compile("java", Pattern.CASE_INSENSITIVE);
System.out.println(p.matcher("JAVA").find()); // true

// 靜態方法 matches（等同 String.matches）
System.out.println(Pattern.matches("\\d+", "12345")); // true

// split 支援複雜分隔符
String[] parts = Pattern.compile(",\\s*").split("a, b,c,  d");
// parts = ["a", "b", "c", "d"]
```

<!--
三個範例分別示範前一頁三個方法的實際用法。

第一個：`Pattern.CASE_INSENSITIVE` 旗標讓比對忽略大小寫，效果跟基礎版的 `(?i)` 一樣，但寫成旗標的形式，在需要重複使用同一個 `Pattern` 物件的情境會更適合。

第二個：`Pattern.matches()` 靜態方法，功能跟 `String.matches()` 一模一樣，只是呼叫的方向相反。

第三個：`Pattern.compile(",\\s*").split(...)` 在切割的同時也消除逗號後面的空格，比單純 `split(",")` 更強大，一次解決「分隔符不固定」的問題。

業界實務上，如果多個地方都要用相同的正規表達式，建議把 `Pattern` 定義成靜態常數，避免每次呼叫都重新 `compile`，這對效能會有實際幫助。
-->

---

# Pattern.quote( )

| 方法名稱 | 說明 |
| --- | --- |
| `Pattern.quote(String s)` | 將字串的所有 regex 特殊字元轉為字面值，回傳可安全嵌入正規表達式的字串 |

```java
String userInput = "3.14";
System.out.println("3.14".matches(Pattern.quote(userInput)));  // true
System.out.println("3X14".matches(Pattern.quote(userInput)));  // false
// 不用 quote 時，. 是萬用字元
System.out.println("3X14".matches(userInput));                 // true
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 接受使用者輸入作為搜尋關鍵字時，用 <code>Pattern.quote()</code> 防止特殊字元破壞 regex
</div>

<!--
想像一個搜尋功能：使用者在搜尋框輸入關鍵字，程式直接把這個字串當成正規表達式去比對。問題是，使用者輸入的字串裡可能含有 `.`、`*`、`(` 這些正規表達式的特殊符號，如果不處理，搜尋結果就會跑掉。

`Pattern.quote()` 就是解決這個問題的工具：把字串裡所有 regex 特殊字元都轉成「字面值」。範例裡 `"3.14"` 如果不 quote，`.` 會被當成萬用字元，所以 `"3X14"` 也會符合；用 `Pattern.quote()` 包起來之後，`.` 就變成真正的句點，`"3X14"` 就不再符合了。

業界實務上，只要搜尋功能接受使用者輸入作為比對關鍵字，就一定要用 `Pattern.quote()`，否則使用者輸入特殊符號可能會讓搜尋失效，甚至造成意外行為，算是一種輕量的輸入防護。
-->

---

# Pattern.MULTILINE / DOTALL 旗標

| 旗標 | 內嵌語法 | 說明 |
| --- | --- | --- |
| `MULTILINE` | `(?m)` | `^` `$` 改為比對每行開頭/結尾（而非整個輸入的開頭/結尾） |
| `DOTALL` | `(?s)` | `.` 涵蓋換行符號（預設不涵蓋） |

```java
String text = "apple\nbanana\ncherry";
long lines = Pattern.compile("^\\w+$", Pattern.MULTILINE)
    .matcher(text).results().count();
System.out.println(lines); // 3
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>DOTALL 使用時機：</b> HTML/XML 標籤跨行時，<code>(?s)&lt;div&gt;.*&lt;/div&gt;</code> 才能正確比對多行內容
</div>

<!--
基礎版我們學過 `^` 和 `$` 代表「整個字串」的開頭和結尾，`.` 代表「除了換行以外的任意字元」。但如果輸入是一段多行文字，有時候我們希望 `^` `$` 是「每一行」的開頭結尾，或希望 `.` 也能跨行比對——這就是這兩個旗標的用途。

`MULTILINE` 讓 `^` `$` 對每一行都生效。範例裡 `"apple\nbanana\ncherry"` 用 `^\w+$` 搭配 `MULTILINE` 去比對，結果找到 3 行，因為每一行都被當成獨立的「開頭到結尾」。如果沒有加這個旗標，`^` `$` 只代表整個輸入的開頭和結尾，整段文字就只會被當成一個比對單位。

`DOTALL` 則是讓 `.` 也能比對換行符號，常見於解析 HTML、XML 或多行日誌——一個標籤的內容跨了好幾行時，`(?s)<div>.*</div>` 才能把整個標籤內容比對進去，配合懶惰量詞 `.*?` 效果更精準。
-->

---

# `Matcher` 類別常用方法（一）

| 方法 | 說明 |
| --- | --- |
| `find()` | 搜尋下一個符合的子字串，找到回傳 `true` |
| `find(start)` | 從 start 索引位置開始搜尋 |
| `matches()` | 比對**整個**輸入字串 |
| `group()` | 回傳目前找到的子字串 |
| `group(n)` | 回傳第 n 個 `()` 分組所比對到的子字串 |

<!--
這頁整理 `Matcher` 最常用的五個方法。`find()` 是核心：每呼叫一次，就會往後搜尋下一個符合的子字串，配合迴圈可以把整段文字裡所有符合的片段都找出來；`find(start)` 多了一個起始位置參數，可以指定從哪個索引開始搜尋。

`matches()` 跟基礎版的 `String.matches()` 概念一樣，要求整個輸入字串都符合；`group()` 取出目前比對到的整段內容，`group(n)` 則是取出第 n 個分組的內容——`group()` 等同 `group(0)`，代表整個比對結果。
-->

---

# `Matcher` 類別常用方法（一）— 範例

```java
String text = "Java 11 and Java 17";
Matcher m = Pattern.compile("Java (\\d+)").matcher(text);

m.find();
System.out.println(m.group());  // "Java 11"（整個比對結果）
System.out.println(m.group(1)); // "11"（第 1 個分組）

m.find(12);                     // 從 index 12 開始搜尋
System.out.println(m.group());  // "Java 17"
```

<!--
這段範例在 `"Java 11 and Java 17"` 裡搜尋 Java 的版本號。第一次 `find()` 找到 `"Java 11"`，`group()` 回傳整個比對結果，`group(1)` 則只回傳括號內抓到的版本號 `"11"`。

接著 `find(12)` 從索引 12 開始搜尋，跳過前面已經找過的部分，找到第二個 `"Java 17"`。

可以把 `Matcher` 想成一根指標，每呼叫一次 `find()`，指標就往右移動到下一個符合的地方；而 `find(start)` 則是讓我們手動把指標移到指定的位置再開始找。
-->

---

# Matcher.lookingAt( ) — 三種比對方式對比

| 方法 | 說明 |
| --- | --- |
| `matches()` | 整個字串必須完整符合 |
| `lookingAt()` | 從**開頭**開始符合，但不要求整個字串都符合 |
| `find()` | 在字串的**任意位置**搜尋子字串 |

```java
String input = "123abc";
Pattern p = Pattern.compile("\\d{3}");
System.out.println(p.matcher(input).matches());    // false（abc 不符合）
System.out.println(p.matcher(input).lookingAt());  // true（開頭 123 符合）
System.out.println(p.matcher(input).find());       // true（任意位置找到）
```

<!--
這頁把三種比對方式放在一起比較，因為它們很容易混淆。`matches()` 最嚴格，整個字串都要符合；`find()` 最寬鬆，任意位置找到符合的片段就算數；`lookingAt()` 介於兩者之間——只要求從字串「開頭」開始的部分符合，後面多出來的字元不影響結果。

範例 `"123abc"` 對 `\d{3}`：`matches()` 是 `false`，因為後面的 `abc` 沒有被涵蓋進整個字串的比對；`lookingAt()` 是 `true`，因為開頭的 `123` 確實符合 `\d{3}`，後面有沒有多的字元不影響；`find()` 也是 `true`，因為它本來就是在找「任意位置」是否存在符合的片段。

`lookingAt()` 在實務上比較少單獨用到，但理解它能幫我們更精確地分辨 `matches()` 和 `find()` 之間「整個字串」與「子字串」的差異，遇到比對結果跟預期不同時，這個對照表會很有幫助。
-->

---

# `Matcher` 類別常用方法（二）

| 方法 | 說明 |
| --- | --- |
| `start()` | 回傳比對子字串的起始索引 |
| `end()` | 回傳比對子字串的結束索引（不含） |
| `replaceFirst(str)` | 取代第一個符合的子字串 |
| `replaceAll(str)` | 取代所有符合的子字串 |

<!--
這頁是 `Matcher` 的第二組常用方法，重點在「位置」。`start()` 和 `end()` 回傳的是目前比對到的子字串在原字串中的起始與結束索引，如果之後想標記找到的位置、或做高亮顯示（highlight），就會需要這兩個方法。

`replaceFirst()` 和 `replaceAll()` 的概念跟基礎版 `String` 的同名方法一樣，差別是這裡是從 `Matcher` 物件呼叫，可以搭配已經編譯好的 `Pattern` 重複使用。
-->

---

# `Matcher` 類別常用方法（二）— 範例

```java
String text = "Java 11 and Java 17";
Matcher m = Pattern.compile("\\d+").matcher(text);

m.find();
System.out.println(m.start()); // 5（"11" 的起始索引）
System.out.println(m.end());   // 7（"11" 的結束索引，不含）
System.out.println(m.group()); // "11"

System.out.println(m.replaceAll("X")); // "Java X and Java X"
```

<!--
在 `"Java 11 and Java 17"` 裡搜尋數字：`find()` 找到 `"11"`，`start()` 回傳 5，`end()` 回傳 7。要注意 `end()` 是「不含」的索引，邏輯跟 `String.substring(start, end)` 一樣——`"11"` 佔用的是索引 5 和 6 這兩個位置，所以結束索引是 7。

最後 `replaceAll("X")` 把字串裡所有符合 `\d+` 的部分都換成 `X`，得到 `"Java X and Java X"`。

⚠️ 易錯點：第一次接觸 `end()` 的人常常以為它是「最後一個字元的索引」，但其實它指向的是「最後一個字元的下一個位置」，跟 `substring()` 的習慣是一致的，記住這點就不會搞混。
-->

---
layout: default
---

# 練習 2：擷取貼文中的標籤
### 任務說明

給定一段社群貼文：

```
"今天和 #炭治郎 #禰豆子 一起去 #鬼殺隊 訓練！"
```

請使用 `Pattern` 與 `Matcher`，找出所有以 `#` 開頭的標籤（如 `#炭治郎`），並印出每個標籤的內容以及它在原字串中的起始位置（`start()`）。

<!--
這部分學了 `Pattern.compile()` 編譯表達式、`Matcher.find()` 搜尋子字串、`group()` 取出比對結果、`start()` 取出起始位置。這個練習要把這幾個方法串在一起，做一個簡單的「標籤擷取器」。

引導思考：標籤的格式是「`#` 加上一個以上的字母或中文字」，這個「字母或中文字」要怎麼用我們學過的字元類別表示？找到一個標籤之後，要怎麼讓 `find()` 繼續往後找下一個？
-->

---
layout: default
---

# 練習 2：擷取貼文中的標籤
### 解題提示

```java
String post = "今天和 #炭治郎 #禰豆子 一起去 #鬼殺隊 訓練！";
Matcher m = Pattern.compile("#\\w+").matcher(post);

while (m.find()) {
    System.out.println(m.group() + "，位置：" + m.start());
}
// #炭治郎，位置：4
// #禰豆子，位置：9
// #鬼殺隊，位置：17
```

<!--
`#\w+` 比對「`#` 加上一個以上的 `\w`」——這裡 `\w` 也包含中文字，所以可以一次抓到 `#炭治郎` 這種中英混合的標籤。

`while (m.find())` 是標準寫法：每呼叫一次 `find()`，`Matcher` 就往後搜尋下一個符合的片段，直到搜尋不到為止迴圈才結束。每一輪用 `m.group()` 取出標籤內容，`m.start()` 取出它在原字串中的起始索引。

💼 業界實務：
這種「擷取所有標籤」的需求在社群平台、論壇貼文分析中很常見，搭配後面會看到的 `results()` 也可以用 Stream 的方式一次統計出現次數。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 與 Stream API 整合

<!--
前三部分我們把 `Pattern` 和 `Matcher` 的常用方法都摸過一輪。最後一部分要看現代 Java（JDK 9 以後）怎麼把正規表達式跟 Stream API 結合起來，讓「篩選」「切割」「動態取代」這些操作可以用一行 Stream 串接完成，寫法更精簡，也更貼近現在業界常見的程式風格。
-->

---
layout: default
---

# Predicate 整合 (JDK 11+)

`Pattern` 可以直接轉為 `Predicate`，方便與 Stream API 結合使用

| 方法 | 說明 |
| --- | --- |
| `asPredicate()` | 判斷**子字串**是否存在 |
| `asMatchPredicate()` | 判斷**整個字串**是否完全符合 |

```java
List<String> list = List.of("apple", "banana", "123", "456");

// 篩選出純數字的字串
var isNumeric = Pattern.compile("\\d+").asMatchPredicate();

list.stream()
    .filter(isNumeric)
    .forEach(System.out::println); // 123, 456
```

<!--
回顧一下基礎版的 Stream，`filter()` 需要傳入一個 `Predicate`（也就是回傳 `boolean` 的函式）。JDK 11 之後，`Pattern` 多了兩個方法可以直接「變身」成 `Predicate`，不需要自己寫 Lambda 去呼叫 `matches()`。

`asMatchPredicate()` 要求整個字串完全符合，等同 `String::matches`；`asPredicate()` 則只要字串裡有任何一段符合就算數，等同 `Matcher::find`。範例裡用 `asMatchPredicate()` 篩選出純數字的字串，搭配 `stream().filter()` 一行就完成過濾。

業界實務上，在資料清洗、批次驗證這類場景，這個搭配可以取代手寫的迴圈和 `if` 判斷，讓程式碼更精簡也更易讀。
-->

---

# Pattern.splitAsStream( )

| 方法名稱 | 說明 |
| --- | --- |
| `splitAsStream(CharSequence input)` | 依此 Pattern 切割字串，回傳 `Stream<String>`（可直接串接 Stream 操作） |

```java
String csv = "apple,orange,banana";
Pattern.compile(",")
    .splitAsStream(csv)
    .map(String::toUpperCase)
    .forEach(System.out::println); // APPLE ORANGE BANANA
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>vs split()：</b> <code>split()</code> 回傳 <code>String[]</code>；<code>splitAsStream()</code> 回傳 <code>Stream</code>，可直接使用 filter / map / collect
</div>

<!--
基礎版的 `split()` 回傳的是 `String[]`，如果切割完之後還想做篩選、轉換、收集，就要再把陣列轉成 Stream。`splitAsStream()` 就是直接把這兩步合併——切割完直接得到 `Stream<String>`，可以馬上串接 `map`、`filter`、`forEach` 等操作。

範例把 CSV 字串依逗號切開後，直接 `map(String::toUpperCase)` 轉成大寫再印出，整段程式碼一氣呵成，不需要中間的陣列變數。

這個方法跟 `split()` 的選擇原則很簡單：如果切完之後只需要簡單拿到陣列，用 `split()` 就好；如果切完之後要做一連串的 Stream 處理，`splitAsStream()` 會讓程式碼更流暢。
-->

---

# 動態取代與 Stream 整合 (JDK 9+)

`Matcher` 在 JDK 9 之後提供了更強大的處理能力

| 方法 | 說明 |
| --- | --- |
| `replaceAll(Function)` | 使用 Lambda 動態決定取代內容 |
| `results()` | 將所有比對結果轉為 `Stream<MatchResult>` |

```java
// 動態將比對到的數字加倍
String input = "10 plus 20";
Matcher m = Pattern.compile("\\d+").matcher(input);
String result = m.replaceAll(res -> 
    String.valueOf(Integer.parseInt(res.group()) * 2));
// result: "20 plus 40"

// 使用 Stream 統計
long count = Pattern.compile("\\w+").matcher("A B C").results().count(); // 3
```

<!--
基礎版的 `replaceAll(String)` 只能把符合的部分換成「固定」的字串。但有時候我們想要的取代內容是「根據比對到的東西動態計算出來的」——例如把文件裡所有的數字都乘以 2，這就需要 JDK 9 新增的 `replaceAll(Function)`。

範例把 `"10 plus 20"` 裡的每個數字都乘以 2：Lambda 接收到比對結果 `res`，用 `res.group()` 取出比對到的數字字串，轉成 `int` 乘以 2，再轉回 `String` 回傳，一行就完成原本需要寫迴圈才能做到的事。

`results()` 則是把所有比對結果直接轉成 `Stream<MatchResult>`，後面就能用 `count()`、`map()` 等 Stream 操作做統計或進一步處理，這在批次處理文字（例如把文件裡的金額換算成另一種貨幣）時特別優雅。
-->

---

# `Matcher` — 範例

```java
import java.util.regex.*;

String text = "Java 8, Java 11, Java 21";
Matcher m = Pattern.compile("Java (\\d+)").matcher(text);

while (m.find()) {
    System.out.printf("版本: %s，位置: %d%n",
        m.group(1),  // () 內的版本號
        m.start());  // 起始位置
}
// 版本: 8，位置: 0
// 版本: 11，位置: 8
// 版本: 21，位置: 16
```

<!--
這是一個完整的 `while (m.find())` 搜尋範例，把第三部分學過的 `find()`、`group(n)`、`start()` 全部串在一起使用：從 `"Java 8, Java 11, Java 21"` 裡依序找出每一個版本號跟它在原字串中的起始位置。

`while (m.find())` 是處理「文字中可能出現多次符合內容」的標準寫法：每一輪迴圈，`find()` 往後搜尋下一個符合的片段，`group(1)` 取出括號內的版本號，`start()` 取出這次比對的起始索引，直到搜尋不到為止迴圈才結束。

這個 `while (m.find())` 的節奏非常常用，接下來的完整應用範例也會延續這個模式，建議多練習幾次直到熟悉為止。
-->

---

# 完整應用範例

```java
import java.util.regex.*;

// 從文字中擷取所有數字
String report = "銷售：12500 元，退貨：300 件，淨利：9800 元";
Matcher m = Pattern.compile("\\d+").matcher(report);
while (m.find()) System.out.print(m.group() + " ");
// 12500 300 9800

// 遮蔽電話號碼
String log = "使用者 0912-345-678 已登入";
System.out.println(log.replaceAll("\\d{4}-\\d{3}-\\d{3}", "****-***-***"));
// 使用者 ****-***-*** 已登入
```

<!--
這頁是這份自學內容的綜合應用，把 `Pattern`／`Matcher` 跟 `String.replaceAll()` 放在一起，示範兩個真實場景。

第一個範例延續上一頁的 `while (m.find())` 模式，從一段報表文字裡把所有數字都抓出來——這在日誌分析、報表彙整時非常常見，先用正規表達式抓出所有數字，再進一步做加總或統計。

第二個範例回到基礎版學過的 `replaceAll()`，把符合電話號碼格式的子字串整段換成遮蔽符號。業界實務上，記錄系統日誌時，電話、身分證、信用卡號這類個資都應該先遮蔽再寫入日誌，`replaceAll()` 搭配正規表達式是最常見的做法之一。

走到這裡，我們已經把正規表達式從基礎的字元符號，一路延伸到 `Pattern`／`Matcher` 套件、再到 Stream API 整合，算是把這個主題的進階面貌都看過一輪了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
Predicate 整合、splitAsStream、動態取代跟 Stream 統計都看過了，最後用一題日誌解析，把具名分組、MULTILINE/results()、環視斷言這幾個進階工具全部串起來。
-->

---
layout: default
---

# 練習 2 (綜合)：日誌解析 — 解題解析
### 任務說明

給定一行系統日誌：

```
2024-05-20 14:32:01 ERROR user=alice ip=192.168.1.10 amount=$1500
```

請完成以下任務：

1. 使用**具名分組**解析出日期、時間、日誌等級（ERROR/INFO/...）三個欄位。
2. 使用 `Pattern.MULTILINE` 搭配 `Matcher.results()`，統計一段多行日誌中**總共有幾行是 ERROR 等級**。
3. 使用**環視斷言**，只取出 `amount=$` 後面的數字（不含 `$`）。

<!--
回顧一下，這份自學內容學了具名分組（讓分組自我說明）、`MULTILINE`／`results()`（多行文字的批次處理）、環視斷言（取值但不消耗字元）。這個練習把三個工具放進同一個情境——解析系統日誌，這也是正規表達式在後端開發中最常見的應用場景之一。

引導思考：第 1 小題，日期格式是 `2024-05-20`，跟我們之前解析日期的範例是不是很像？第 2 小題，如果有多行日誌，要怎麼讓 `^` 對「每一行」都生效？第 3 小題，`amount=$1500` 裡，`$` 要怎麼用環視斷言「看到但不取」？把這三個問題分開思考，再動手寫程式碼。
-->

---

# 練習 2 (綜合)：日誌解析 — 解題解析
### 解題提示

```java
// 1. 具名分組解析日期、時間、等級
String regex = "(?<date>\\d{4}-\\d{2}-\\d{2}) (?<time>\\d{2}:\\d{2}:\\d{2}) "
             + "(?<level>[A-Z]+).*";
Matcher m1 = Pattern.compile(regex).matcher(
    "2024-05-20 14:32:01 ERROR user=alice ip=192.168.1.10 amount=$1500");
if (m1.matches()) {
    System.out.println(m1.group("date"));  // 2024-05-20
    System.out.println(m1.group("level")); // ERROR
}

// 2. MULTILINE + results() 統計 ERROR 行數
String logs = "2024-05-20 .. ERROR ..\n2024-05-20 .. INFO ..\n2024-05-20 .. ERROR ..";
long errorCount = Pattern.compile("^.*ERROR.*$", Pattern.MULTILINE)
    .matcher(logs).results().count();
System.out.println(errorCount); // 2

// 3. 環視斷言取出 amount 數字
Matcher m3 = Pattern.compile("(?<=amount=\\$)\\d+")
    .matcher("amount=$1500");
if (m3.find()) System.out.println(m3.group()); // 1500
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 三個小題分別對應「具名分組」「MULTILINE + Stream」「環視斷言」，剛好把這份自學內容的四個部分串起來複習一遍。
</div>

<!--
第 1 小題沿用我們學過的日期具名分組寫法，再加上 `(?<time>...)` 和 `(?<level>[A-Z]+)` 兩個新分組，`.matches()` 確認整行符合後，分別用 `group("date")`、`group("level")` 取出欄位。

第 2 小題是 `MULTILINE` 加 `results().count()` 的組合應用：`^.*ERROR.*$` 配合 `MULTILINE`，讓 `^` `$` 對每一行都生效，`results()` 把每一行的比對結果轉成 Stream，`count()` 直接數出符合的行數，這裡是 2 行。

第 3 小題用正向後行 `(?<=amount=\$)\d+`：要求左邊必須是 `amount=$`，但這段文字不算進比對結果，所以 `find()` 之後 `group()` 只會拿到 `1500`，不含 `amount=$`。

完成這個練習，代表我們已經能把具名分組、MULTILINE/Stream、環視斷言這三個進階工具，組合應用在一個接近真實的日誌解析情境裡了。
-->

---
layout: end
---

# Q & A

<!--
這份自學內容把正規表達式從基礎版的字元符號，延伸到反向引用、具名分組、環視斷言，再到 `Pattern`／`Matcher` 套件與 Stream API 整合，算是把 Java 正規表達式的完整面貌都走過一輪了。

如果自學過程中遇到 `\1` 跟具名分組搞混、環視斷言「不消耗字元」想不通、或是 `Pattern`／`Matcher` 的方法記不住該用哪一個，都可以記錄下來，下次上課時提出來一起討論。
-->
