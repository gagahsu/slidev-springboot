---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 字元與字串類別 - 完整講義版
routeAlias: ch14
style: |
  /* 全域最小字體 16px */
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Java Programming Masterclass</p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">字元與字串類別</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「掌握 Java 呼吸法：全面解析 Character 與 String」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 1rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
大家好，這一章我們要來聊 Java 裡最基礎、但也最常被忽略的主題：字元（Character）和字串（String）。

【為什麼要學這個？】
寫程式只要會跟使用者互動，幾乎一定會碰到文字——帳號密碼、表單輸入、畫面顯示的訊息，全部都是字串。這章學好，後面處理資料會輕鬆很多；學不好，常常會卡在一些看起來很小、但很煩人的 bug 上。

【學習目標】
學完這章，我們會知道怎麼判斷一個字元是數字還是字母、怎麼建立和操作字串，還有搜尋、擷取、取代、比較、格式化這些最常用的字串方法。
-->

---
layout: default
---

# Outline

- **字元 Character 類別**
- **字串的建立**
- **String 類別的方法 (搜尋、擷取、取代、比較、格式化)**
- **Text Blocks 與 StringBuilder**
- **實作練習與邏輯挑戰**

<!--
【核心說明】
這一章的安排是「由小到大」：先看單個字（Character），再看一串字（String）。

我們會從字元的判斷方法開始，接著看字串怎麼建立，最後把重點放在 String 提供的各種方法——搜尋、擷取、取代、比較、格式化，這些是日常開發中最常用到的工具。

💼 業界實務：
實務上很多 bug 都跟字串處理有關，像是 `null` 檢查沒做好、或是用錯方法比較字串內容，這章我們會把這些常見地雷一一點出來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 字元 Character 類別

<!--
【🎯 章節標題頁】
第一部分，我們先來認識字元的處理。

【生活化比喻】
如果把字串比喻成一串珍珠項鍊，那「字元」就是其中一顆顆獨立的珍珠。在 Java 裡，處理單顆珍珠有專門的工具，我們叫它 `Character` 類別。

【為什麼要學這個？】
有時候我們需要對字串裡的每個字逐一檢查（例如：這是不是數字？是不是空白？），這時候就需要先學會怎麼處理「單個字元」。
-->

---
layout: default
---

# 字元類別方法 (一)
### 常用判斷方法

| 方法名稱 | 說明 |
| --- | --- |
| `isDigit(char ch)` | 是否為數字字元 (0-9) |
| `isLetter(char ch)` | 是否為字母字元 (包含中文) |
| `isLetterOrDigit(char ch)` | 是否為數字或字母字元 |
| `isLowerCase(char ch)` | 是否為小寫字母字元 |
| `isUpperCase(char ch)` | 是否為大寫字母字元 |

<!--
【核心說明】
當我們拿到一個字元，常常需要先知道它的「身分」：是數字？還是字母？`Character` 類別提供了一整組判斷方法。

【生活化比喻】
這就像是門口的查驗閘口，丟一個字元進去，它會回答你這是哪一種「票」。

【逐步解說】
`isDigit` 判斷的是「字元版」的數字，也就是 `'0'` 到 `'9'`，跟 `int` 數字是不同概念。比較特別的是 `isLetter`，因為 Java 的 Unicode 支援很完整，丟一個中文字進去，它也會回答 `true`。

⚠️ 易錯點提醒：
這些方法都是 `static` 的，要寫成 `Character.isDigit(myChar)`，不能寫 `myChar.isDigit()`。
-->

---
layout: full
class: px-8
---

# 字元類別方法 (一) — 範例

```java
char c1 = '9';
char c2 = 'A';
char c3 = '炭'; // 中文字元

System.out.println(Character.isDigit(c1)); // true
System.out.println(Character.isLetter(c3)); // true (中文也算字母)
System.out.println(Character.isUpperCase(c2)); // true
System.out.println(Character.isLetterOrDigit(c1)); // true
```

<!--
【範例目的】
這段範例示範如何用前一頁的判斷方法檢查不同類型的字元。

【帶讀關鍵行】
第一行 `c1 = '9'`，因為有單引號，這是一個字元而不是數字，所以 `isDigit` 回傳 `true`。第三行的中文字「炭」，在 `isLetter` 的判斷下也是 `true`，這跟某些只認英文字母的語言不太一樣。

⚠️ 易錯點提醒：
注意 `c1` 是字元 `'9'`，跟整數 `9` 是不同的型態，不能互相直接比較。

【預期結果】
四個判斷結果都是 `true`，分別對應數字、中文字母、大寫字母、數字。
-->

---

# 字元類別方法補充：isAlphabetic / isWhitespace

| 方法名稱 | 說明 |
| --- | --- |
| `isAlphabetic(char ch)` | 是否為 Unicode 字母字元（比 `isLetter` 涵蓋更廣）|
| `isWhitespace(char ch)` | 是否為 Java 定義的空白（含 `\t`、`\n`、`\r` 等控制字元）|
| `isSpaceChar(char ch)` | 是否為 Unicode 空格字元（**不含** Tab、換行等控制字元）|

```java
System.out.println(Character.isAlphabetic('A'));   // true
System.out.println(Character.isAlphabetic('炭'));  // true
System.out.println(Character.isWhitespace('\t'));  // true
System.out.println(Character.isSpaceChar('\t'));   // false
```

<!--
【核心說明】
除了基本的數字、字母判斷，Java 還提供了幾個更精細的方法。

【生活化比喻】
`isWhitespace` 像是個很在意「乾淨」的房東，只要會產生空白效果的東西（空格、Tab、換行），它通通算數；但 `isSpaceChar` 比較挑，只認真正的「空格字元」，不含 Tab、換行這類控制字元。

【逐步解說】
這在處理使用者輸入時很重要：如果使用者不小心在資料後面打了 Tab，`isWhitespace` 可以幫我們抓到這個看不見但會造成問題的字元。

💼 業界實務：
清理使用者輸入資料時，通常會用 `isWhitespace` 來過濾這些看不見但會佔空間的控制字元。
-->

---

# 字元類別方法 (二)
### 轉換與特殊判斷

| 方法名稱 | 說明 |
| --- | --- |
| `toLowerCase(char ch)` | 將字元轉成小寫 |
| `toUpperCase(char ch)` | 將字元轉成大寫 |
| `isSpaceChar(char ch)` | 是否為 Unicode 的空白字元 |
| `isISOControl(char ch)` | 是否為 ISO 控制字元 |

```java
System.out.println(Character.toLowerCase('A'));    // 'a'
System.out.println(Character.toUpperCase('z'));    // 'Z'

char fullWidthSpace = '　'; // 全型空白
System.out.println(Character.isSpaceChar(fullWidthSpace)); // true
```

<!--
【核心說明】
大小寫轉換很直觀，就是 `toLowerCase` 跟 `toUpperCase`。

【逐步解說】
這裡想特別提一下 `　`（全型空白），這在處理中文輸入時很常見的小麻煩——使用者在表單裡按了一個全型空白，肉眼看不出來，但資料庫搜尋卻找不到，這時 `isSpaceChar` 就能幫我們抓出來。

⚠️ 易錯點提醒：
這些轉換方法回傳的是「新的字元」，原本傳進去的變數內容不會被改變，因為 `char` 是 primitive type（基本型態）。

【預期結果】
`toLowerCase('A')` 得到 `'a'`，`toUpperCase('z')` 得到 `'Z'`，全型空白會被判定為 `true`。
-->

---

# 跳脫字元 (Escape Character)

控制字元（如換行、標籤）可以使用 `isISOControl()` 測試：

```java
char ch1 = '\n'; // 換行符號（Enter 鍵效果）
char ch2 = '\t'; // 水平 Tab 符號（Tab 鍵效果）

System.out.println("\\n 是控制字元：" + Character.isISOControl(ch1)); 
System.out.println("\\t 是控制字元：" + Character.isISOControl(ch2));
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>技術細節：</b> 中文字元「炭」在 Java 中屬於字母字元 (isLetter)。
</div>

<!--
【核心說明】
在字串裡，有些動作是打不出來的，像是「按一下 Enter」或「退後一格」，這些就是跳脫字元（Escape Character）。

【生活化比喻】
這就像劇本裡的「動作標記」。看到 `\n`，不是要唸出來，而是要「換行」；如果在台上真的喊出「反斜線 n」，導演肯定會很傻眼。

【逐步解說】
這些指令在 Java 裡都以反斜線 `\` 開頭，可以用 `isISOControl` 來檢查一個字元是不是這類「看不見的指令」。

【預期結果】
`\n` 跟 `\t` 兩個都會被判定為 `isISOControl() == true`。
-->

---
layout: default
---

# 練習 1：字元分類統計
### 任務說明

宣告字串 `"炭治郎123 是 主角！"`，請逐個字元檢查並統計：

1. 數字字元（`isDigit`）出現幾次？
2. 字母字元（`isLetter`，中文也算）出現幾次？
3. 空白字元（`isWhitespace`）出現幾次？

**預期輸出：**
```
數字: 3, 字母: 6, 空白: 2
```

<!--
【任務鋪陳】
這一部分學了好幾個 `Character` 的判斷方法：`isDigit`、`isLetter`、`isWhitespace`。這個練習要把它們實際用在一段字串上，逐個字元檢查並分類計數。

【引導思考】
要怎麼把字串「拆成一個一個字元」？大家還記得 `charAt(index)` 搭配 `for` 迴圈的寫法嗎？拿到每個字元之後，用 `Character` 的判斷方法去歸類即可。

【等待與觀察】
給大家 5 分鐘。如果不確定中文字算不算字母，回頭看看「字元類別方法 (一) — 範例」那一頁。
-->

---
layout: default
---

# 練習 1：字元分類統計
### 解題提示

1. 用 `for` 迴圈搭配 `charAt(i)` 取出每個字元
2. 對每個字元依序用 `Character.isDigit`、`isLetter`、`isWhitespace` 判斷
3. 符合的條件分別累加對應的計數器

```java
String text = "炭治郎123 是 主角！";
int digit = 0, letter = 0, space = 0;
for (int i = 0; i < text.length(); i++) {
    char c = text.charAt(i);
    if (Character.isDigit(c)) digit++;
    else if (Character.isLetter(c)) letter++;
    else if (Character.isWhitespace(c)) space++;
}
System.out.println("數字: " + digit + ", 字母: " + letter + ", 空白: " + space);
```

<!--
【帶讀解法】
重點在 `if-else if` 的判斷順序：每個字元只會被歸到一類，所以用 `else if` 串起來。中文字「炭」「治」「郎」「是」「主」「角」都會被 `isLetter` 判定為 `true`，這跟只認英文字母的語言不太一樣。

⚠️ 易錯點提醒：
「！」這個全形驚嘆號既不是數字、字母也不是空白，三個條件都不會成立，所以總數加起來會比字串長度少 1，這是正常的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 字串的建立

<!--
【🎯 章節標題頁】
接下來進入這章的核心：字串（String）。

【為什麼要學這個？】
建立字串看起來很簡單，但 Java 在背後其實做了一些設計上的考量。先把「怎麼建立」搞懂，後面學各種方法才會更順。

【學習目標】
這部分我們會看到字串最基本的宣告方式，以及幾種不同的建構方法（Constructor），了解它們之間的差異。
-->

---
layout: default
---

# 基本字串型態宣告

只要在內容前後加上雙引號即為字串物件。

```java
String hero = "炭治郎"; // hero 是字串變數
```

<div class="mt-6">

### 常用建構方法 (Constructor)

| 建構方法 | 說明 |
| --- | --- |
| `String()` | 建立一個空字串 |
| `String(char[] data)` | 由字元陣列組成字串 |
| `String(String original)` | **建立副本 (新位址)** |
| `String(StringBuffer buf)` | 由 StringBuffer 建立 |

</div>

<!--
【核心說明】
最簡單建立字串的方式就是直接加上雙引號，這也是日常開發中最常見的寫法。

【逐步解說】
除了雙引號這種直接宣告，`String` 還提供了好幾種建構方法，比如可以把一個字元陣列直接組成字串。

💼 業界實務：
盡量不要用 `new String("xxx")` 這種寫法，因為這會額外建立一個新物件，多花記憶體又沒有額外好處。除非有特殊需求，不然直接用雙引號宣告就好。
-->

---

# 建構方法 — 範例

```java
String s1 = new String();                      // 空字串 ""
char[] chars = {'炭', '治', '郎'};
String s2 = new String(chars);                 // "炭治郎"
String s3 = new String("炭治郎");              // 建立副本（新位址）
StringBuffer sb = new StringBuffer("炭治郎");
String s4 = new String(sb);                    // "炭治郎"
```

<!--
【範例目的】
這段範例對照前一頁的四種建構方法，看看實際寫法長什麼樣子。

【帶讀關鍵行】
`s1` 是一個空字串；`s2` 是把三個字元組成一個字串；`s4` 則示範了從 `StringBuffer` 轉回一般 `String` 的常見用法——當我們用 `StringBuffer` 處理完一段文字後，常常需要把結果轉回 `String`。

⚠️ 易錯點提醒：
`s2`、`s3`、`s4` 的內容雖然看起來一樣，但在記憶體裡的位址可能不同。

【預期結果】
四個變數的內容分別是 `""`、`"炭治郎"`、`"炭治郎"`、`"炭治郎"`。
-->

---
layout: default
---

# 🎬 AI 協作時刻：replace() 用了，字串卻沒變

我寫了 `str.replace("炭", "火");`，但下一行印出 `str` 還是原本的內容，完全沒被取代，把程式碼貼給 AI：

**要用的 Prompt：**

> 我呼叫了字串的 `replace()`（或 `toUpperCase()`、`trim()` 等方法），
> 但變數本身看起來完全沒有改變。
> {貼上你的程式碼}
> 請幫我找出問題，並解釋 String 為什麼會有這種行為。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>易錯點：</b> <code>String</code> 是不可變（Immutable）物件，所有「看起來像修改」的方法（<code>replace()</code>、<code>trim()</code>、<code>toUpperCase()</code>…）都是回傳一個新字串，原變數不會變——沒有用 <code>=</code> 重新賦值，結果就會憑空消失。
</div>

<!--
【操作提示】
現場示範一段只寫 `str.replace("炭", "火");` 卻沒有 `str = str.replace(...)` 的錯誤程式碼，讓學生先觀察「為什麼印出來還是原本的內容」，再貼給 AI 確認原因。

【收斂一句話】
String 的方法幾乎都不會改變原字串本身，一定要用變數接住回傳值，這跟後面會學到的 StringBuilder（會直接修改自己）恰好相反。
-->

---
layout: default
---

# 練習 2：字元陣列轉字串
### 任務說明

宣告字元陣列 `char[] name = {'禰', '豆', '子'}`：

1. 使用 `String(char[] data)` 建構方法，把這個字元陣列轉成字串 `s1`
2. 再用 `String(String original)` 建構方法，把 `s1` 複製成 `s2`
3. 印出 `s1`、`s2` 的內容，並比較 `s1 == s2` 的結果

**預期輸出：**
```
s1 = 禰豆子
s2 = 禰豆子
s1 == s2 ? false
```

<!--
【任務鋪陳】
這一部分學了好幾種 `String` 的建構方法，這個練習要動手把它們串起來用一次：從字元陣列建立字串，再用「複製」的方式建立另一個字串。

【引導思考】
`new String(chars)` 跟 `new String(original)` 分別對應表格裡哪一個建構方法？最後 `s1 == s2` 的結果，跟我們平常用雙引號宣告字串時的 `==` 結果，會不會不一樣？
-->

---
layout: default
---

# 練習 2：字元陣列轉字串
### 解題提示

1. 用 `new String(char[])` 把字元陣列轉成 `s1`
2. 用 `new String(String)` 把 `s1` 的內容複製成 `s2`
3. `==` 比較的是位址，`new` 出來的物件位址不同

```java
char[] name = {'禰', '豆', '子'};
String s1 = new String(name);
String s2 = new String(s1);

System.out.println("s1 = " + s1);
System.out.println("s2 = " + s2);
System.out.println("s1 == s2 ? " + (s1 == s2));
```

<!--
【帶讀解法】
`s1` 是用字元陣列建構出來的字串，`s2` 是用 `new String(s1)` 額外複製出來的新物件。雖然 `s1` 跟 `s2` 的內容一樣，但因為都是用 `new` 建立的，位址不同，`s1 == s2` 是 `false`。

💼 業界實務：
這也是為什麼業界常說「比較字串內容要用 `equals`，不要用 `==`」——只要其中一個是用 `new` 建立的，`==` 結果就很容易出乎意料。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# String 類別的方法

<!--
【🎯 章節標題頁】
字串建立好了，接下來就是要學怎麼「使用」字串。

【學習目標】
`String` 類別提供了非常多方法，我們會從最簡單的長度檢查開始，依序學到搜尋、擷取、取代、比較、格式化、分割這些核心操作。

【為什麼要學這個？】
這些方法是日常開發中最常用到的工具，幾乎每個跟文字有關的功能，背後都會用到這些方法的某種組合。
-->

---
layout: default
---

# 字串長度與空白判斷

| 方法 | 說明 |
| --- | --- |
| `int length()` | 回傳字串長度 |
| `boolean isEmpty()` | `length()` 為 0 時傳回 true |
| `boolean isBlank()` | `length()` 為 0 或**內容純空白**時傳回 true |

```java
String s1 = "炭治郎";
String s2 = "";
System.out.println(s1.length()); // 3
System.out.println(s2.length()); // 0
```

<!--
【核心說明】
`length()` 就是取得字串長度，這個很直觀；但 `isEmpty` 跟 `isBlank` 的差別一定要弄清楚。

【生活化比喻】
`isEmpty` 像是錢包裡連一塊錢都沒有；`isBlank` 則像是錢包裡塞滿了發票，但實際上還是沒有任何「現金」（只有空白）。

💼 業界實務：
檢查使用者是否有填寫名字時，通常會用 `isBlank`，因為就算使用者只打了一個空格，`isBlank` 仍然能正確判斷為「沒填」。
-->

---

# isEmpty vs isBlank 實戰

```java
String s1 = " "; // 包含一個空格

// false (長度是 1)
System.out.println(s1.isEmpty()); 

// true (被判定為無效空白內容)
System.out.println(s1.isBlank()); 
```

<!--
【範例目的】
這段範例直接對比 `isEmpty` 跟 `isBlank` 在同一個字串上的不同結果。

【帶讀關鍵行】
`s1` 裡面有一個空白字元。對 `isEmpty` 來說，它的長度是 1，所以回傳 `false`；但 `isBlank` 認為這只是一堆沒有意義的空白，所以回傳 `true`。

⚠️ 易錯點提醒：
這兩個方法的差異在面試中也很常被問到，務必記清楚。

【預期結果】
`isEmpty()` 回傳 `false`，`isBlank()` 回傳 `true`。
-->

---

# 大小寫轉換

| 方法 | 說明 |
| --- | --- |
| `String toLowerCase()` | 將字串轉換為小寫 |
| `String toUpperCase()` | 將字串轉換為大寫 |

```java
String s = "Kamado Tanjiro";
System.out.println(s.toLowerCase()); // "kamado tanjiro"
System.out.println(s.toUpperCase()); // "KAMADO TANJIRO"
```

<!--
【核心說明】
這兩個方法很直觀，就是把英文字母整串轉成大寫或小寫。

【生活化比喻】
如果要做「不區分大小寫」的搜尋，常見做法是先把兩邊都轉成小寫再比較，就像讓大家都換上同一套制服，這樣就不會因為穿著不同而被誤判成不一樣的人。

【預期結果】
`toLowerCase()` 得到 `"kamado tanjiro"`，`toUpperCase()` 得到 `"KAMADO TANJIRO"`。
-->

---

# 安全處理：當字串為 null 時

當變數為 `null` 時，直接調用方法會觸發 `NullPointerException`。

```java
String hero = null;
// hero.isEmpty(); // ❌ 程式會崩潰！
```

<!--
【核心說明】
這頁是地雷警示頁：如果不想在程式上線後遇到 `NullPointerException`，這個概念一定要弄懂。

【生活化比喻】
`null` 就像一個「看起來有變數，但裡面什麼都沒有」的狀態。如果直接對它呼叫方法，程式就會直接崩潰。

⚠️ 易錯點提醒：
「空字串 `""`」跟「`null`」是完全不同的兩件事：空字串是一個空的容器，`null` 則是連容器都不存在。呼叫任何 `String` 方法前，務必先確認它不是 `null`。
-->

---

# 原生 null 安全寫法

```java
String s = null;

// 手動 null 檢查（最常用）
boolean hasText = s != null && !s.isBlank();
System.out.println(hasText); // false

// Objects 工具轉換 null → 空字串
String safe = Objects.requireNonNullElse(s, "");
System.out.println(safe.isBlank()); // true
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 使用 <code>Objects.requireNonNullElse()</code> 需要 <code>import java.util.Objects;</code>
</div>

<!--
【範例目的】
這段範例示範兩種常見的 `null` 安全寫法。

【帶讀關鍵行】
第一種是「防禦式寫法」：先檢查 `s != null`，確定不是 `null` 才繼續檢查內容。第二種是 `Objects.requireNonNullElse(s, "")`，意思是「如果 `s` 是 `null`，就用空字串代替」。

⚠️ 易錯點提醒：
養成「先轉成安全值再處理」的習慣，可以避免大部分跟 `null` 有關的錯誤。

【預期結果】
第一段印出 `false`（因為 `s` 是 `null`）；第二段先把 `s` 轉成空字串，再判斷 `isBlank()` 得到 `true`。
-->

---

# 字元的搜尋 (indexOf)

| 方法名稱 | 說明 |
| --- | --- |
| `indexOf(int ch)` | 傳回字元第一次出現的索引 |
| `indexOf(int ch, int from)` | 從指定索引開始往右找 |

- 索引 (Index) 從 **0** 開始計算。
- 若找不到目標，一律回傳 **-1**。

<!--
【核心說明】
接下來進入字串的搜尋功能。`indexOf` 的作用是找出某個字元在字串中的位置。

【生活化比喻】
這就像在全班點名，告訴你那個字「坐」在第幾個位置。

【逐步解說】
要特別注意，Java 的索引從 0 開始算；如果找不到目標，回傳值是 `-1`，代表「找遍整個字串都沒看到」。
-->

---

# 字元搜尋實例

```java
String str = "Demon Slayer";

// 找 'e'
System.out.println(str.indexOf('e')); // 1

// 從 index 2 開始找 'e'
System.out.println(str.indexOf('e', 2)); // 10
```

<!--
【範例目的】
這段範例示範 `indexOf` 的兩種用法：從頭找，跟從指定位置往右找。

【帶讀關鍵行】
`"Demon Slayer"` 裡面有兩個 `'e'`。直接呼叫 `indexOf('e')` 會回傳第一個找到的位置 1（`D` 是 0，`e` 是 1）；如果想找下一個，就指定從索引 2 開始找，這時會跳過第一個 `'e'`，找到第 10 個位置的那個 `'e'`。

【預期結果】
第一段輸出 `1`，第二段輸出 `10`。
-->

---

# 字元的逆向搜尋 (lastIndexOf)

| 方法名稱 | 說明 |
| --- | --- |
| `lastIndexOf(int ch)` | 傳回字元**最後一次**出現的索引 |
| `lastIndexOf(int ch, int from)` | 從指定索引開始**向左**找 |

```java
String str = "Demon Slayer";

// 從 right 往左找 'e'，找到最後一個
System.out.println(str.lastIndexOf('e')); // 10

// 從 index 5 開始往左找 'e'
System.out.println(str.lastIndexOf('e', 5)); // 1
```

<!--
【核心說明】
`lastIndexOf` 跟 `indexOf` 方向相反，是從字串的最後面往前找。

【生活化比喻】
這就像「從後門開始點名」，在處理副檔名（例如 `photo.v1.jpg`）這類情境很有用，因為我們通常只關心「最後一個點」在哪裡。

【逐步解說】
範例中直接呼叫 `lastIndexOf('e')` 會從尾端找到的第一個 `'e'`（位置 10）；如果指定從索引 5 開始往左找，就會找到位置 1 的那個 `'e'`。

【預期結果】
第一段輸出 `10`，第二段輸出 `1`。
-->

---

# 子字串的搜尋

與字元搜尋邏輯一致，參數改為字串：

| 方法名稱 | 說明 |
| --- | --- |
| `indexOf(String str)` | 子字串第一次出現的位置 |
| `lastIndexOf(String str)` | 子字串最後一次出現的位置 |
| `contains(CharSequence s)`| 是否包含該子字串 |

```java
String str = "炭治郎與禰豆子";
System.out.println(str.indexOf("禰豆子"));    // 4
System.out.println(str.lastIndexOf("炭"));    // 0
System.out.println(str.contains("禰豆子"));   // true
```

<!--
【核心說明】
前面是找一個字元，現在是找「一串字」，用法跟剛才完全一樣，只是參數從 `char` 換成 `String`。

【逐步解說】
另外多了一個非常直觀的方法 `contains`，問的是「有沒有包含這個詞」，回傳 `true` 或 `false`，不需要自己處理索引值，非常方便。

【預期結果】
`indexOf("禰豆子")` 回傳 `4`，`lastIndexOf("炭")` 回傳 `0`，`contains("禰豆子")` 回傳 `true`。
-->

---

# startsWith( ) 與 endsWith( )

| 方法名稱 | 說明 |
| --- | --- |
| `startsWith(String prefix)` | 是否以指定字串**開頭** |
| `endsWith(String suffix)` | 是否以指定字串**結尾** |

```java
String hero = "炭治郎の日記";
System.out.println(hero.startsWith("炭治郎")); // true
System.out.println(hero.endsWith("日記"));     // true
System.out.println(hero.startsWith("禰豆子")); // false
```

<!--
【核心說明】
這兩個方法分別檢查字串的「頭」跟「尾」。

【生活化比喻】
就像檢查一份文件的開頭跟結尾格式是否正確。

【逐步解說】
實務上很常用來檢查 URL 是不是 `https://` 開頭，或檔名是不是 `.pdf` 結尾。

【預期結果】
前兩個判斷都是 `true`，第三個因為內容開頭不是「禰豆子」，所以是 `false`。
-->

---

# matches( )

| 方法名稱 | 說明 |
| --- | --- |
| `matches(String regex)` | 字串整體是否符合正規表達式，回傳 boolean |

```java
String email = "tanjiro@kimetsu.jp";
System.out.println(email.matches(".*@.*\\..*")); // true
String code = "ABC123";
System.out.println(code.matches("[A-Z]+\\d+"));  // true
System.out.println(code.matches("\\d+"));        // false
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>matches()</code> 要求整個字串完整符合，等同 regex 前後加上 <code>^...$</code>
</div>

<!--
【核心說明】
這是搜尋功能裡比較進階的工具：正規表達式（Regular Expression）。

【生活化比喻】
這就像設定了一個「格式範本」，例如要檢查 Email 或是固定格式的代碼，`matches` 就是負責對照範本的檢查員。

⚠️ 易錯點提醒：
`matches` 要求「整個字串」都符合範本才算成立，不能只符合其中一小段，這跟一般「包含」的概念不一樣。

【預期結果】
Email 範例符合格式回傳 `true`；`"ABC123"` 符合「字母+數字」的格式回傳 `true`；但同一個字串如果只拿「全部是數字」的範本來比對，就會是 `false`。
-->

---

# 擷取子字串 (substring)

| 方法名稱 | 說明 |
| --- | --- |
| `charAt(int index)` | 返回指定索引的 char 字元 |
| `substring(int begin)` | 從指定位置擷取到最後 |
| `substring(int begin, int end)`| 擷取範圍 [begin, end-1] |

<!--
【核心說明】
接下來是擷取子字串。`substring(begin, end)` 的範圍規則是這頁的重點，也是最容易寫錯的地方。

【生活化比喻】
這就像切蛋糕，`begin` 跟 `end` 指的是「切口」的位置，而不是「第幾片」。

【逐步解說】
`substring` 的規則是「包含開頭，不包含結尾」，下一頁會用圖解再說明一次。
-->

---

# 視覺化擷取圖解 (substring)
### 索引與內容對應關係

```java
String str = "鬼滅之刃是炭治郎的故事";
System.out.println(str.substring(5, 8));
```

<div class="index-table">

| 索引 (Index) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **內容 (Char)** | 鬼 | 滅 | 之 | 刃 | 是 | **炭** | **治** | **郎** | 的 | 故 | 事 |

</div>

<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
  <span class="text-blue-600 font-bold">結果：</span> 
  <span class="text-2xl font-mono text-gray-800">"炭治郎"</span>
  <p class="text-sm text-gray-500 mt-1">注意：包含起始索引 5，但<b>不包含</b>結束索引 8</p>
</div>

<!--
【範例目的】
這張圖解搭配前一頁的規則，讓「包含頭、不包含尾」這件事更直觀。

【帶讀關鍵行】
索引 5 是「炭」，索引 8 是「的」。`substring(5, 8)` 會從索引 5 開始切，切到索引 8 之前就停止，所以結果是 5、6、7 三個位置，也就是「炭治郎」。

⚠️ 易錯點提醒：
如果想要的結尾字是「郎」（索引 7），結束索引要寫 8，而不是 7，這是新手最常搞錯的地方。

【預期結果】
`str.substring(5, 8)` 結果是 `"炭治郎"`。
-->

---
layout: default
---

# 練習 3：出現次數計算
### 任務說明

宣告一段長字串：
「鬼滅之刃是炭治郎與禰豆子的故事，我不喜歡禰豆子的那田蜘蛛山，雖然禰豆子在炭治郎眼中是清新脫俗」

**請計算「禰豆子」在上述字串中出現了幾次？**

<!--
【任務鋪陳】
我們剛才學了 `indexOf` 可以找到子字串第一次出現的位置，這個練習要更進一步：不只找一次，而是要找出「全部」出現的次數。

【引導思考】
如果只找一次，會卡在第一個位置；要怎麼讓搜尋繼續往後進行，並且每找到一次就記一筆？大家可以先想想，迴圈加上 `indexOf` 要怎麼搭配使用。
-->

---

# 練習 3：解題邏輯
### 提示說明

1. 使用 `indexOf("禰豆子")` 找到第一次出現位置。
2. 計算次數 `count++`。
3. **關鍵：** 下一次搜尋的起點為 `目前索引 + "禰豆子".length()`。
4. 重複搜尋直到回傳 `-1` 為止。

<!--
【逐步解說】
找到第一個「禰豆子」之後，下一次搜尋不能再從頭開始，否則會一直找到同一個位置。關鍵在於：把下一次搜尋的起點，設成「這次找到的位置」加上「禰豆子的長度」。

重複這個動作，直到 `indexOf` 回傳 `-1`（代表後面已經沒有了）為止，過程中每找到一次就把計數器加 1。

【預期結果】
最終計數器的值就是「禰豆子」在整段字串中出現的總次數。
-->

---
layout: default
---

# 練習 4：指定取代
### 任務說明

針對同一段長字串：
「鬼滅之刃是炭治郎與禰豆子的故事... (略)」

**請將「最後一個」禰豆子，取代為「竹筒」。**

<!--
【任務鋪陳】
剛才是計算出現次數，這次要做的是「修改」：只把「最後一個」出現的「禰豆子」換成「竹筒」，其他位置不動。

【引導思考】
如果要鎖定「最後一個」，我們需要哪個方向的搜尋方法？找到位置之後，又該怎麼把字串「切開再拼回去」？
-->

---

# 練習 4：解題邏輯
### 提示說明

1. 使用 `lastIndexOf("禰豆子")` 找出最後一個目標的位置。
2. 利用 `substring` 將字串切開。
3. 重新拼接：`前半段 + "竹筒" + 後半段`。

<!--
【逐步解說】
因為要找「最後一個」，第一步就是用 `lastIndexOf` 取得它的位置。接著用 `substring` 把字串切成兩段：前半段是開頭到「禰豆子」之前，後半段是「禰豆子」之後到結尾。

最後把「前半段」、「竹筒」、「後半段」依序拼接起來，就完成取代了。

【預期結果】
整段字串中只有最後一個「禰豆子」會變成「竹筒」，其他出現的「禰豆子」維持不變。
-->

---
layout: default
---

# 練習 5：字母頻率統計
### 任務說明

宣告字串：「AABCBDCDACBDA」

**1. 請計算 A、B、C、D 分別出現幾次？**

**2. 挑戰：若輸入為任意字串，該如何統計次數？**

<!--
【任務鋪陳】
前兩題練習都是針對「特定子字串」做搜尋與處理，這題要做的是「統計每個字元出現的頻率」。

【引導思考】
如果只有 A 到 D 四種字元，或許可以開四個變數分別計數；但如果輸入的字串裡可能出現任意字元呢？這時候要怎麼設計資料結構，才能應付「不知道有哪些字元」的情況？這題會用到迴圈搭配 `charAt`，也可以想想跟 `split("")` 的關係。
-->

---

# 字串的取代與刪除空白 (一)

| 方法 | 說明 |
| --- | --- |
| `replace(char old, char new)` | 取代全部符合的**字元** |
| `replace(String old, String new)` | 取代全部符合的**子字串** |

```java
String str = "炭治郎炭治郎";

System.out.println(str.replace('炭', '火'));        // "火治郎火治郎"
System.out.println(str.replace("炭治郎", "禰豆子")); // "禰豆子禰豆子"
```

<!--
【核心說明】
如果想把字串裡所有符合條件的內容一次換掉，`replace` 是最直接的方法，它會把所有符合的目標全部取代。

⚠️ 易錯點提醒：
`replace` 執行完會回傳一個「新的字串」，原本的 `str` 變數內容不會改變，除非把結果重新存回 `str`。

【預期結果】
第一行把所有「炭」換成「火」，第二行把所有「炭治郎」換成「禰豆子」。
-->

---

# replaceAll( ) / replaceFirst( )

| 方法名稱 | 說明 |
| --- | --- |
| `replaceAll(String regex, String rep)` | 取代全部符合正規表達式的部分 |
| `replaceFirst(String regex, String rep)` | 只取代第一個符合的部分 |

```java
String s = "炭123治郎456";
System.out.println(s.replaceAll("\\d+", "#"));   // "炭#治郎#"
System.out.println(s.replaceFirst("\\d+", "#")); // "炭#治郎456"
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>vs replace()：</b> <code>replace()</code> 接受純字串；<code>replaceAll()</code> 接受正規表達式，適合複雜條件取代
</div>

<!--
【核心說明】
這兩個方法跟 `replace` 很像，但多了正規表達式的支援，可以處理更複雜的取代條件。

【逐步解說】
`replaceAll` 會取代所有符合正規表達式的部分，例如可以一次把字串裡所有連續數字換成 `#`；`replaceFirst` 則只取代第一個符合的部分，後面的維持不動。

【預期結果】
`replaceAll` 把兩段數字都換成 `#`，得到 `"炭#治郎#"`；`replaceFirst` 只換掉第一段數字，得到 `"炭#治郎456"`。
-->

---

# 字串的取代與刪除空白 (二)

| 方法 | 說明 |
| --- | --- |
| `trim()` | 刪除字串**前後**的空白，中間空白不受影響 |

```java
String str = "  水之呼吸  ";
System.out.println(str.trim()); // "水之呼吸"

// 中間空白 trim 無法移除
String str2 = "  水 之 呼 吸  ";
System.out.println(str2.trim()); // "水 之 呼 吸"
```

<!--
【核心說明】
`trim` 的作用是「修邊」：只會處理字串前後多出來的空白。

【生活化比喻】
這就像理髮師幫忙修邊，只會剪掉額頭跟後腦杓多出來的頭髮（前後空白），但頭髮中間的縫隙（字與字之間的空格）完全不會動。

【預期結果】
第一段前後的空白被移除，得到 `"水之呼吸"`；第二段因為空白在「中間」，`trim` 完全沒有效果。
-->

---

# strip( ) / stripLeading( ) / stripTrailing( )

| 方法名稱 | 說明 |
| --- | --- |
| `strip()` | 移除前後所有空白（含 Unicode 空白） |
| `stripLeading()` | 只移除**開頭**空白 |
| `stripTrailing()` | 只移除**結尾**空白 |

```java
String s = "  水之呼吸  ";
System.out.println(s.strip());          // "水之呼吸"
System.out.println(s.stripLeading());   // "水之呼吸  "
System.out.println(s.stripTrailing());  // "  水之呼吸"
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>trim() vs strip()：</b> <code>trim()</code> 只處理 ASCII 空白；<code>strip()</code> 能正確處理所有 Unicode 空白字元，建議優先使用 <code>strip()</code>
</div>

<!--
【核心說明】
`strip` 系列方法可以視為 `trim` 的升級版，能處理更多語言中各式各樣的空白字元。

【逐步解說】
`strip()` 處理前後兩端；`stripLeading()` 只處理開頭；`stripTrailing()` 只處理結尾，可以依需求選擇。

💼 業界實務：
現在大部分專案會優先使用 `strip()` 而不是 `trim()`，因為 `strip()` 對國際化（Unicode）的支援更完整。

【預期結果】
三個方法分別移除前後、開頭、結尾的空白，得到 `"水之呼吸"`、`"水之呼吸  "`、`"  水之呼吸"`。
-->

---

# 刪除中間空白的技巧

如果要移除字串中間的所有空格，應使用 `replace` 方法：

```java
String skill = "水 之 呼 吸";
// 將 " " 換成 ""
String result = skill.replace(" ", "");
System.out.println(result); // "水之呼吸"
```

<!--
【核心說明】
前面提到 `trim` 跟 `strip` 都動不了「中間」的空白，如果真的需要移除中間的空格，就要靠 `replace`。

【逐步解說】
做法很簡單：把「空格」換成「空字串（什麼都沒有）」，等於把字之間的空白直接抽掉，所有字就會黏在一起。

【預期結果】
`"水 之 呼 吸".replace(" ", "")` 得到 `"水之呼吸"`。
-->

---

# 字串的串接 (Concatenation)

除了常用的 `+` 運算子，Java 也提供 `concat()` 方法：

```java
String s1 = "無限";
String s2 = "列車";

String r1 = s1 + s2;
String r2 = s1.concat(s2);
```

<!--
【核心說明】
把兩個字串接起來，除了最常用的 `+` 運算子，`String` 也提供了 `concat` 方法。

【逐步解說】
兩者效果相同，但 `+` 比較萬能，可以把數字、布林值等各種型態直接接到字串上；`concat` 則只能接受字串。

⚠️ 易錯點提醒：
不管用 `+` 還是 `concat`，結果都是一個「新的」字串物件。

【預期結果】
`r1` 跟 `r2` 的內容都是 `"無限列車"`。
-->

---

# repeat( )

| 方法名稱 | 說明 |
| --- | --- |
| `repeat(int count)` | 將字串重複 count 次，回傳新字串（count 為 0 回傳空字串）|

```java
String s = "鬼滅";
System.out.println(s.repeat(3));    // "鬼滅鬼滅鬼滅"
System.out.println("-".repeat(20)); // "--------------------"
System.out.println("Ha".repeat(0)); // ""
```

<!--
【核心說明】
`repeat` 可以把字串重複指定次數，省去自己寫迴圈拼接的麻煩。

【逐步解說】
例如要印出一條分隔線，直接 `"-".repeat(20)` 就能得到 20 個減號組成的字串，比寫迴圈簡潔很多。

【預期結果】
`"鬼滅".repeat(3)` 得到 `"鬼滅鬼滅鬼滅"`；`"Ha".repeat(0)` 得到空字串 `""`。
-->

---

# 字串的比較：== vs equals

| 比較方式 | 比較目標 | 說明 |
| --- | --- | --- |
| `==` | 記憶體**位址** | 同一個物件才為 true |
| `equals()` | 字串**內容** | 內容相同即為 true |

```java
String s1 = "Muzan";
String s2 = new String("Muzan");

System.out.println(s1 == s2);      // false (位址不同)
System.out.println(s1.equals(s2)); // true  (內容相同)
```

<!--
【核心說明】
這是字串比較最重要的觀念：比較字串內容，永遠要用 `equals`，不要用 `==`。

【生活化比喻】
`==` 比的是「門牌號碼」，`equals` 比的是「裡面裝的東西」。即使兩個門牌不同的房子裝潢一模一樣（內容相同），`==` 還是會說「不一樣」，但 `equals` 會說「一樣」。

⚠️ 易錯點提醒：
這是面試常考題，務必記住：`s1 == s2` 是 `false`（位址不同），`s1.equals(s2)` 是 `true`（內容相同）。
-->

---
layout: default
---

# 🎬 AI 協作時刻：追問「為什麼」

`==` 跟 `equals()` 的差別背熟了，但面試官通常會再追問一句「那為什麼要這樣設計？」，讓 AI 幫你補上背後的原因：

**要用的 Prompt：**

> 我知道 Java 的字串比較內容要用 `equals()`，不要用 `==`。
> 但我想知道更深一層：為什麼 Java 要把 String 設計成「不可變（Immutable）」？
> 這個設計跟 String Pool（字串池）有什麼關係？請用 junior 工程師聽得懂的方式解釋，200 字以內。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>面試延伸：</b> 「這樣設計的原因是什麼？」是 AI 陪你準備面試時最好用的追問句，能把死背的觀念變成真正理解的知識。
</div>

<!--
【操作提示】
現場貼上 prompt，讓 AI 說明字串不可變讓多個變數能安全共用同一個字串池物件，不用擔心被意外修改，同時也帶出執行緒安全的好處。

【收斂一句話】
背答案只能應付選擇題，追問「為什麼」才能應付面試官的下一句話——這是用 AI 準備面試的關鍵技巧。
-->

---

# 字典順序比較 (compareTo)

- 回傳 `0`: 兩字串內容相等。
- 回傳 `正值`: 目前字串大於參數字串。
- 回傳 `負值`: 目前字串小於參數字串。

```java
String s1 = "apple";
String s2 = "banana";
String s3 = "apple";

System.out.println(s1.compareTo(s2)); // 負值 ('a' < 'b')
System.out.println(s2.compareTo(s1)); // 正值 ('b' > 'a')
System.out.println(s1.compareTo(s3)); // 0 (內容相同)
```

<!--
【核心說明】
除了判斷「一樣不一樣」，有時候我們還想知道「誰排在前面」，這時就用 `compareTo`，概念上跟查字典的順序一樣。

【逐步解說】
如果結果是負值，代表目前字串在字典順序上排在參數字串前面；如果是 0，代表兩個字串內容完全相同。

💼 業界實務：
這個方法是排序功能的基礎，例如要依照字母順序排列名單，底層就是用 `compareTo` 來比較。

【預期結果】
`s1.compareTo(s2)` 是負值，`s2.compareTo(s1)` 是正值，`s1.compareTo(s3)` 是 `0`。
-->

---

# equalsIgnoreCase( ) 與 compareToIgnoreCase( )

| 方法名稱 | 說明 |
| --- | --- |
| `equalsIgnoreCase(String other)` | 忽略大小寫比較內容，回傳 boolean |
| `compareToIgnoreCase(String other)` | 忽略大小寫的字典順序比較，回傳數值 |

```java
String s1 = "JAVA";
String s2 = "java";
System.out.println(s1.equals(s2));              // false
System.out.println(s1.equalsIgnoreCase(s2));    // true
System.out.println(s1.compareToIgnoreCase(s2)); // 0
```

<!--
【核心說明】
有時候我們不在乎大小寫的差異，這時就可以用加了 `IgnoreCase` 的版本。

【逐步解說】
`equalsIgnoreCase` 跟 `compareToIgnoreCase` 會先把兩邊都視為相同大小寫之後再比較，省去自己呼叫 `toLowerCase` 的步驟。

【預期結果】
`equals` 因為大小寫不同回傳 `false`；`equalsIgnoreCase` 跟 `compareToIgnoreCase` 因為忽略大小寫，分別回傳 `true` 跟 `0`。
-->

---

# 字串的轉換 valueOf( )

`valueOf()` 可以將各種型態轉為字串：

```java
int score = 100;
String s = String.valueOf(score); // "100"
```

<!--
【核心說明】
要把數字或其他型態轉成字串，正規的做法是 `String.valueOf`，而不是用 `+ ""` 這種寫法。

【逐步解說】
`String.valueOf` 可以接受 `int`、`double`、物件等各種型態，甚至能優雅處理 `null` 的情況，是比較推薦的寫法。

【預期結果】
`String.valueOf(100)` 得到字串 `"100"`。
-->

---

# String.format( )

| 格式符號 | 說明 | 對應型別 |
| --- | --- | --- |
| `%s` | 字串 | `String` |
| `%d` | 整數 | `int`、`long` |
| `%.nf` | 浮點數（n 位小數）| `double`、`float` |
| `%n` | 換行（跨平台）| — |

```java
String name = "炭治郎";
int score = 95;
double rate = 0.9876;
String s = String.format("姓名：%s 分數：%d 勝率：%.1f%%", name, score, rate * 100);
System.out.println(s); // 姓名：炭治郎 分數：95 勝率：98.8%
```

<!--
【核心說明】
`String.format` 讓我們可以像填空一樣製作字串。

【生活化比喻】
這就像先印好一份「公文範本」，上面留了幾個空格（像 `%s`、`%d`），最後再把實際資料一個一個填進去。

【逐步解說】
範例中 `%.1f` 會自動四捨五入到小數點第一位，這在顯示金額、百分比這類資料時特別好用。

【預期結果】
最終輸出為「姓名：炭治郎 分數：95 勝率：98.8%」。
-->

---

# formatted( )

| 方法名稱 | 說明 |
| --- | --- |
| `formatted(Object... args)` | 以當前字串為格式樣板帶入參數，等同 `String.format()` 的實例方法版本 |

```java
String name = "炭治郎";
int score = 95;
String s = "姓名：%s 分數：%d".formatted(name, score);
System.out.println(s); // 姓名：炭治郎 分數：95
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>vs String.format()：</b> <code>"樣板".formatted(參數)</code> 比 <code>String.format("樣板", 參數)</code> 更直觀，格式樣板即呼叫者
</div>

<!--
【核心說明】
`formatted` 是 `String.format` 的另一種寫法，從 Java 15 開始可用。

【逐步解說】
不需要寫成 `String.format(模板, 參數)`，而是直接在模板字串後面接 `.formatted(參數)`，讀起來更直覺，因為「模板自己」就是呼叫者。

【預期結果】
跟前一頁的 `String.format` 範例效果相同，輸出「姓名：炭治郎 分數：95」。
-->

---

# 分割成字串陣列 split( )

`split()` 依據正規表達式分割字串：

```java
String list = "炭治郎,禰豆子,善逸";
String[] heros = list.split(","); 
// heros[0]="炭治郎", heros[1]="禰豆子"...
```

<!--
【核心說明】
`split` 可以把一條長字串依照指定的規則切成一個字串陣列。

【生活化比喻】
這就像一把美工刀，告訴它要切在哪裡（例如逗號），它就會把長條字串切成一塊一塊放進陣列裡。

💼 業界實務】
這在處理 CSV 檔案、或是任何用固定符號分隔的清單時非常常用。

【預期結果】
`heros` 陣列會包含 `"炭治郎"`、`"禰豆子"`、`"善逸"` 三個元素。
-->

---

# 分割空白字元：`\s` 正規表達式

使用 `"\\s"` 可以依照空白字符（空格、Tab、換行）分割：

```java
String sentence = "炭治郎 禰豆子 善逸";
String[] parts = sentence.split("\\s");
// parts[0]="炭治郎", parts[1]="禰豆子", parts[2]="善逸"
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>\s</code> 屬於正規表達式 (Regex)，在 Java 字串中需寫成 <code>"\\s"</code> (雙反斜線)。
</div>

<!--
【核心說明】
如果一串文字是用空格分開的，可以用 `\\s` 作為分割依據。

【逐步解說】
`\\s` 可以同時處理空格、Tab 等多種空白字元，比單純用 `" "` 更全面。

⚠️ 易錯點提醒：
要記得寫成兩個反斜線 `\\s`，因為在 Java 字串中第一個反斜線是用來「轉義」的。

【預期結果】
`parts` 陣列會包含 `"炭治郎"`、`"禰豆子"`、`"善逸"` 三個元素。
-->

---

# 分割成單一字元技巧

使用空字串 `""` 可以將字串拆成單一字元陣列：

```java
String name = "ABCD";
String[] letters = name.split(""); 
// ["A", "B", "C", "D"]
```

<!--
【核心說明】
這裡有個小技巧：如果 `split` 裡面放空字串，會發生什麼事？

【逐步解說】
它會在「每個字之間」都切一刀，最終得到一個裝滿每個字的字串陣列。

【預期結果】
`"ABCD".split("")` 得到 `["A", "B", "C", "D"]`。
-->

---

# 字串與字元陣列的互轉

```java
String str = "Tanjiro";

// 1. 轉為陣列
char[] data = str.toCharArray();

// 2. 印出陣列內容
System.out.println(Arrays.toString(data)); 
// [T, a, n, j, i, r, o]
```

<!--
【核心說明】
如果想把字串拆成一個一個的字元，比 `split` 更直接的做法是 `toCharArray`。

【逐步解說】
它會直接回傳一個 `char[]`，當我們需要對每個字元做逐一處理（例如簡單的加密、編碼轉換）時，操作字元陣列會比操作字串方便。

【預期結果】
`str.toCharArray()` 得到 `['T', 'a', 'n', 'j', 'i', 'r', 'o']`，印出來會顯示 `[T, a, n, j, i, r, o]`。
-->

---

# 進階串接：String.join( )

在 Java 8 之後，可以使用 `join` 快速串接陣列：

```java
String[] team = {"炭", "治", "郎"};
String result = String.join("-", team);
System.out.println(result); // "炭-治-郎"
```

<!--
【核心說明】
`String.join` 可以視為 `split` 的反向操作：把陣列裡的元素重新黏成一條字串。

【生活化比喻】
`split` 是把東西切開，`join` 則是用「膠水」把切片黏回去，而且可以自己決定膠水的種類（分隔符號），例如減號或逗號。

【逐步解說】
這在把一份清單轉成顯示用的文字（例如標籤列表）時非常方便。

【預期結果】
`String.join("-", team)` 得到 `"炭-治-郎"`。
-->

---
layout: default
---

# 🎬 AI 協作時刻：split() 切出一堆空字串

我用 `sentence.split(" ")` 切句子，結果陣列裡出現一堆空字串，長度也不對，把程式碼跟輸入內容一起丟給 AI：

**要用的 Prompt：**

> 我用 `split()` 搭配正規表達式（例如 `"\\s"` 或 `" "`）分割字串，
> 但結果陣列裡出現了預期外的空字串，或元素數量不對。
> {貼上你的程式碼與輸入字串}
> 請幫我檢查是不是 regex 語法用錯，並說明 `split(" ")` 跟 `split("\\s+")` 的差異。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>易錯點：</b> <code>split()</code> 的參數是「正規表達式」，不是單純的分隔字元——輸入字串中如果有連續兩個空格，<code>split(" ")</code> 會在中間切出一個空字串；<code>\s</code> 在 Java 字串裡也一定要寫成雙反斜線 <code>"\\s"</code>，少寫一個反斜線就會編譯錯誤或行為不對。
</div>

<!--
【操作提示】
現場示範一個輸入字串中間有連續兩個空格的例子，讓學生先猜 split(" ") 的結果陣列會有幾個元素，再貼給 AI 驗證，並順便問 AI "\\s+" 這種「一個以上空白」的寫法怎麼解決連續空格的問題。

【收斂一句話】
split() 吃的是正規表達式，不是普通字元——連續分隔符號、反斜線轉義沒寫對，都會讓切出來的陣列跟預期不一樣。
-->

---
layout: default
---

# 練習 6 (綜合)：陣列進位運算
### 任務說明

給予代表數字的陣列 `[1, 9]` (代表 19)。請計算 `+1` 後的結果。

- **範例 1:** `[1, 9]` $\rightarrow$ `[2, 0]`
- **範例 2:** `[9, 9, 9]` $\rightarrow$ `[1, 0, 0, 0]`

<!--
【任務鋪陳】
這一章學了不少字串方法：搜尋、擷取、取代、轉換、分割、串接。這個綜合練習要把其中幾個工具串在一起，解決一個常見的邏輯題。

【引導思考】
如果有一個陣列代表一串數字，要怎麼幫它「加 1」？最棘手的地方是「進位」——例如 999 加 1 會變成 1000，陣列長度也會跟著變多一格。試著想想，能不能用這章學過的字串方法，把陣列轉換成數字、算完之後再轉回陣列？
-->

---

# 練習 6 (綜合)：陣列進位運算 — 解題提示
### 邏輯挑戰

1. 將陣列內容轉為字串拼接。
2. 轉成數字進行運算。
3. 將結果重新拆回陣列。

<!--
【逐步解說】
第一步，把陣列裡的每個數字（例如 1、9）拼成字串 `"19"`，這裡可以用 `String.valueOf` 搭配 `+` 或 `String.join`。第二步，用 `Integer.parseInt` 把 `"19"` 轉成真正的數字 19，加 1 變成 20。第三步，把 20 轉回字串 `"20"`，再用 `split("")` 或 `charAt` 把它拆回陣列。

【預期結果】
即使遇到像 `999 + 1 = 1000` 這種會「多一位數」的情況，因為是先轉成數字運算，再轉回字串拆解，陣列長度也會自然跟著變成 4，整個流程不需要額外處理進位邏輯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Text Blocks 與 StringBuilder

<!--
【開場白】
最後補兩個現代 Java 開發幾乎天天會用到的工具：多行字串的 Text Block，還有處理大量字串拼接的 StringBuilder。
-->

---

# Text Blocks（多行字串）

以三個雙引號 `"""` 開頭並**換行**，結尾加 `"""`，省去字串拼接與跳脫：

```java
// 傳統字串（需加 \n）
String msg = "Hello\n鬼殺隊\nGoodbye";

// Text Block（直覺可讀）
String tb = """
            Hello
            鬼殺隊
            Goodbye
            """;
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Text Blocks 的型別仍是 <code>String</code>，所有 String 方法都可使用。結尾的 <code>"""</code> 與內容對齊時，公共縮排會被自動移除。
</div>

<!--
【核心說明】
這是 JDK 15 之後新增的語法糖，專門用來解決「多行文字寫起來很醜」的問題。

【生活化比喻】
以前要寫一段多行文字（像 SQL 語法），我們要在每一行後面加 "\n" 再用 + 接下一行，寫到後面整段程式碼擠成一團，像是把好幾張紙硬塞進一個信封。Text Block 就像直接給你一張大信紙，要怎麼排版、換行，照寫就好。

【逐步解說】
你看 tb 這個寫法，三個雙引號開頭後直接換行，裡面想怎麼斷行就怎麼斷行，Java 會照你寫的樣子保留下來。

💼 業界實務：
寫 SQL 查詢字串、HTML 模板、JSON 範例的時候特別好用，程式碼讀起來乾淨很多。想更深入了解 `indent()` 等格式調整方法，可以參考進階自學內容。
-->

---

# 為什麼需要 StringBuilder？

`String` 是不可變的，頻繁修改會造成效能低落：

```java
// ❌ 效能差 (產生大量暫存物件)
String s = "";
for (int i = 0; i < 100; i++) s += i;

// ✅ 效能佳 (在同一個緩衝區操作)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 100; i++) sb.append(i);
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>面試常考：</b>「String 跟 StringBuilder 差在哪？」是 junior 面試經典題，一定要弄懂這個效能差異的原因。
</div>

<!--
【核心說明】
我們直接看程式碼對比。`StringBuilder` 就像一個專屬的工具籃，不管裝多少東西，都還是同一個籃子，不會一直去買新籃子再把舊的丟掉。

【逐步解說】
左邊的寫法，每次 `s += i`，Java 都會偷偷建立一個新的 `String` 物件、複製內容、再讓 `s` 指向它，跑 100 次就產生 100 個用過即丟的物件。右邊的 `StringBuilder` 則是一直往同一個籃子裡塞東西（`append`），籃子會自動變大，但位址始終沒變。

💼 業界實務：
在迴圈裡拼接字串，幾乎是「一定要用 `StringBuilder`」的等級，這是新手跟有經驗工程師的常見分水嶺。
-->

---
layout: default
---

# 🎬 AI 協作時刻：面試題自我檢測

「String 跟 StringBuilder 差在哪？」幾乎每場 junior 面試都會被問到，讓 AI 幫你出題驗收：

**要用的 Prompt：**

> 請你扮演 Java 面試官，針對「String 跟 StringBuilder 的差異」出 3 題選擇題考我，
> 涵蓋不可變性、效能、以及什麼時候該用哪一個。
> 先只給題目，等我回答完再告訴我答案跟詳解。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>自我檢測技巧：</b> 請 AI「先出題、後公布答案」，比直接請它整理重點更有效——因為你得先想過一次，記憶才會深刻。
</div>

<!--
【操作提示】
現場示範這個 prompt，讓學生看到 AI 真的會先出題、等回答再公布詳解，鼓勵大家回家用同樣方式自我測驗其他章節的觀念。

【收斂一句話】
與其被動看 AI 整理重點，不如反過來讓 AI 考你——這個角色互換，是把 AI 變成免費家教的關鍵一步。
-->

---

# StringBuilder 常用方法

| 方法名稱 | 說明 |
| --- | --- |
| `append(data)` | 將內容加在尾端 |
| `insert(pos, data)` | 在指定位置插入內容 |
| `delete(start, end)` | 刪除 [start, end-1] 範圍的內容 |
| `reverse()` | 反轉字串內容 |
| `toString()` | 轉換回不可變的 `String` |

```java
StringBuilder sb = new StringBuilder("Muzan");
sb.append("Kibutsuji");        // "MuzanKibutsuji"
sb.insert(5, " ");              // "Muzan Kibutsuji"
sb.reverse();                   // 反轉整串內容
System.out.println(sb.toString());
```

<!--
【核心說明】
對 `StringBuilder` 來說最重要的動作就是加字：`append` 是加在最後面，`insert` 則是「插隊」，`delete`/`reverse` 用來修改既有內容。

【逐步解說】
跟一般 `String` 拼接比起來，這幾個方法語意更清楚，也不會產生多餘的暫存物件，在大量字串組裝（例如報表輸出）時很常見。

⚠️ 易錯點提醒：
別忘了 `reverse()`、`append()` 等方法會直接修改原本的 `StringBuilder` 物件內容，跟 `String` 的不可變特性不同。判斷「迴文」這類題目時很好用。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
StringBuilder 的 append、insert、reverse 都摸過一輪了，最後用一題經典題把這一章收尾——判斷迴文，把字串反轉跟內容比較串在一起。
-->

---
layout: default
---

# 練習 7：迴文判斷
### 任務說明

撰寫一個程式，判斷使用者輸入是否為「迴文」（正讀反讀結果一致）。

- 例如：`禰豆子豆禰` $\rightarrow$ 是
- 例如：`鬼滅之刃` $\rightarrow$ 否

<!--
【任務鋪陳】
我們剛才學了 `reverse` 這個方法，剛好可以拿來解決一個經典題型：判斷一個字串是不是「迴文」。

【引導思考】
迴文就是倒過來唸結果也一樣。如果手上已經有 `reverse` 這個工具，要判斷迴文的邏輯會不會突然變得很直覺？大家可以先想想看，要怎麼把輸入的字串變成可以反轉的形式。
-->

---

# 練習 7：解題提示

### 提示說明

1. 將使用者輸入建立為 `StringBuilder` 物件。
2. 呼叫 `.reverse()` 方法取得反轉後的內容。
3. 將反轉結果轉回 `String`，與原字串用 `equals` 比對是否相等。

<!--
【逐步解說】
第一步，把輸入的字串放進 `StringBuilder`。第二步，直接呼叫 `.reverse()`。第三步，把反轉後的內容轉成 `String`（注意：比較內容要用 `equals`，不是 `==`），跟原始字串比對。

【預期結果】
如果兩者內容相同，就是迴文；不同的話就不是。這題同時複習了 `StringBuilder.reverse()` 跟字串比較這兩個概念。想深入了解 `StringBuffer` 跟 `StringBuilder` 的差異、容量管理、`setCharAt`/`replace` 等方法，可以參考進階自學內容。
-->

---

# 總結

- **`Character` 判斷方法都是 `static`**：`isDigit()`、`isLetter()`（中文也算字母）、`isWhitespace()` 等，用 `Character.方法名()` 呼叫
- **建立字串優先用雙引號字面值，不要 `new String(...)`** — `new` 出來的物件位址不同，會讓 `==` 得到意外結果
- **搜尋、擷取家族**：`indexOf()`／`lastIndexOf()` 找位置、`substring(begin, end)` 是「含頭不含尾」、`contains()`／`startsWith()`／`endsWith()`／`matches()` 各司其職
- **`null` 與空字串是兩回事**：呼叫方法前務必先檢查非 `null`，`isBlank()` 比 `isEmpty()` 更能抓出純空白的無效輸入
- **比較字串內容一律用 `equals()`，絕不用 `==`**；不分大小寫比較用 `equalsIgnoreCase()`；排序用 `compareTo()`
- **取代、刪空白、格式化各有專屬方法**：`replace()`／`replaceAll()`、`trim()`／`strip()`、`String.format()`／`formatted()`
- **大量拼接字串要用 `StringBuilder`，不要用 `+` 在迴圈裡疊字串** — `String` 不可變，`+` 會產生大量用過即丟的暫存物件

<!--
我們把這一章整理成七個重點。

第一，Character 類別的判斷方法都是 static，一定要寫成 Character.isDigit(ch) 這種形式；特別記得中文字在 isLetter() 底下也算字母。

第二，建立字串優先用雙引號字面值，盡量避免 new String(...)，因為 new 出來的物件位址跟字面值不同，會讓 == 判斷得到意外的 false。

第三，搜尋跟擷取是這章份量最重的部分：indexOf 和 lastIndexOf 分別從前、從後找位置；substring(begin, end) 的規則是「含頭不含尾」，這是最容易寫錯一位的地方；contains、startsWith、endsWith、matches 則各自處理不同的搜尋情境。

第四，null 安全是很多 bug 的源頭：呼叫任何 String 方法之前，一定要先確認變數不是 null；isBlank() 比 isEmpty() 更嚴格，能抓出使用者只打了空白這種無效輸入。

第五，字串比較的鐵律是內容比較用 equals()，絕對不要用 ==，因為 == 比的是記憶體位址；不分大小寫用 equalsIgnoreCase()；要排序的話用 compareTo()。

第六，取代、刪空白、格式化都有各自對應的方法：replace 系列處理字元或子字串取代，trim 跟 strip 處理頭尾空白（strip 對 Unicode 支援更完整），String.format 跟 formatted 則是格式化輸出的兩種寫法。

第七，如果要在迴圈裡大量拼接字串，一定要用 StringBuilder，不要用 + 號，因為 String 是不可變的，每次 += 都會偷偷建立一個新物件，效能會嚴重下降。

這七點加起來，就是這一章字元與字串類別的完整地圖。如果對字串池、Text Block、或是更深入的 StringBuilder 方法有興趣，歡迎參考本章的進階自學內容，下一章我們要繼續往下走了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
【開場白】
這一章我們把字元和字串的核心用法都走過一輪了，從字元的判斷、字串的建立，到搜尋、擷取、取代、比較、格式化跟分割。

【等待與觀察】
大家對這些方法的使用方式，或是 `null` 安全處理、字串比較這些地方，還有什麼問題嗎？歡迎提出來一起討論！如果對字串池、Text Block、或是 `StringBuilder` 這些更深入的主題有興趣，可以參考本章的進階自學內容。
-->

---
layout: end
---
