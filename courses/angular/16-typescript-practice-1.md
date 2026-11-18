---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: TypeScript 練習（一）
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
    Angular Full-Stack Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    TypeScript 練習（一）
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「判斷、轉換、運算、迴圈，一次搞定」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
前面幾章，我們學了變數、型別和方法。這一章，我們要把它們整合起來，再加上程式邏輯的幾個核心工具：條件判斷、型別轉換、運算子和迴圈。

這一章以練習為主。學完之後，我們就能寫出有判斷、有計算、能重複執行的程式，而不只是顯示資料。
-->

---
layout: default
---

# Outline

- **if 判斷式**
- **類型轉換**
- **JSON**
- **運算符**
- **字串常用函數**
- **陣列常用函數**
- **For 迴圈**
- **實作練習**

<!--
這一章會先學 if 判斷式，讓程式能做選擇。接著學文字和數字之間的轉換，以及前後端溝通用的 JSON 格式。然後介紹各種運算子，以及字串和陣列的常用函數。最後學 for 迴圈，並用七道練習題收尾。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# if 判斷式
# Conditional Statements

<!--
我們先學怎麼讓程式做選擇，也就是 if 判斷式。
-->

---

# if 判斷式 — 基本語法

當需要比較兩個或多個值時，使用 **if 判斷式**。條件成立執行 `if` 區塊，否則執行 `else` 區塊。

```typescript
let a = 12;
let b = 10;

if (a > b) {
  console.log(a);  // 條件成立，印出 12
} else {
  console.log(b);
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 條件為 <code>true</code> 時進入 <code>if</code> 區塊，<code>false</code> 時進入 <code>else</code> 區塊
</div>

<!--
if 判斷式就像出門前看天氣：「如果下雨，就帶傘；否則，就不帶」。

在程式裡，`if` 後面的小括號放條件，這裡是 `a` 大於 `b`。條件成立，也就是結果為 true，就執行第一個大括號裡的程式；不成立，就執行 `else` 後面的大括號。

這個範例中 `a` 是 12，`b` 是 10，條件成立，所以會印出 12。
-->

---

# if 判斷式 — 多個條件

使用 `&&`（AND）可以在一個 if 中加入多個條件，**所有條件都成立**時才會執行。

```typescript
let a = 12;
let b = 10;

if (a > b && a > 0) {
  console.log(a);  // a > b 且 a > 0，兩個都成立才印出
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>&&</code> 表示「且」；<code>||</code> 表示「或」，任一條件成立即可
</div>

<!--
如果要同時滿足好幾個條件才執行，就用兩個 `&` 符號，代表「而且」。

這裡的條件是 `a` 大於 `b`，而且 `a` 大於 0，兩個都成立才會印出 `a`。

如果要表達「或者」，也就是只要其中一個成立就好，就用兩條直線。這兩個符號之後在檢查表單欄位時會很常用到。
-->

---

# if 判斷式 — else if

當有**超過兩種情況**時，在 `if` 與 `else` 之間加入 `else if` 分支：

```typescript
let score = 75;

if (score >= 90) {
  console.log('優秀');
} else if (score >= 70) {
  console.log('良好');  // 75 >= 70，印出此行
} else if (score >= 60) {
  console.log('及格');
} else {
  console.log('不及格');
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 條件由上往下依序比對，<b>第一個成立的分支</b>執行後即跳出，不再往下判斷
</div>

<!--
當情況超過兩種，就在 `if` 和 `else` 之間加上 `else if`。

以成績為例：90 分以上印出優秀，70 分以上印出良好，60 分以上印出及格，其他就是不及格。

條件會由上往下依序比對，只要遇到第一個成立的，就執行那個區塊，後面的全部跳過。這裡分數是 75，不滿足 90，但滿足 70，所以印出良好。
-->

---
layout: default
---

# if 判斷式 — 小節練習

宣告變數 `score = 85`，用 if / else if / else 判斷成績等級後印出對應字母：
- 90 以上：`'A'`
- 80 以上：`'B'`
- 70 以上：`'C'`
- 其他：`'不及格'`

<!--
我們用一個小練習熟悉 `else if`。

宣告 `score` 等於 85，依照分數印出等級：90 以上是 A，80 以上是 B，70 以上是 C，其他是不及格。

想一想，條件要從高分往低分排，還是從低分往高分排？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# if 判斷式 — 小節練習解答

```typescript
let score = 85;
if (score >= 90) {
  console.log('A');
} else if (score >= 80) {
  console.log('B');  // 印出 B
} else if (score >= 70) {
  console.log('C');
} else {
  console.log('不及格');
}
```

<!--
我們來看答案。

條件從高分往低分依序寫。85 分不滿足 90，但滿足 80，所以印出 B，後面的分支就不再判斷了。

回答剛才的問題，要從高分往低分排。如果反過來先判斷 70 以上，85 分就會直接印出 C，結果就錯了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 類型轉換
# Type Conversion

<!--
接下來，我們看怎麼在文字和數字之間互相轉換。
-->

---

# 文字轉數字 — Number()

當變數是 `string` 格式但需要進行數學計算時，使用 **`Number()`** 將文字轉為數字。

```typescript
let str: string = '123';
let num: number = Number(str);

console.log(num + 1);   // 124（可以計算了）
console.log(str + 1);   // '1231'（字串拼接，不是加法）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 若字串內容無法轉換為數字（如 <code>'abc'</code>），結果會是 <code>NaN</code>（Not a Number）
</div>

<!--
這是初學者很容易踩到的問題。

從網頁輸入框拿到的值，通常是字串，例如 `'123'`。如果直接寫 `str + 1`，因為 `str` 是字串，加號會變成「文字拼接」，結果是 `'1231'`，而不是 124。

所以要先用 `Number()` 把字串轉成數字，再做計算，`num + 1` 才會得到 124。

另外，如果字串內容不是數字，例如 `'abc'`，轉換的結果會是 NaN，意思是「不是一個數字」。所以只要牽涉到加減乘除，記得先確認型別是不是數字。
-->

---

# 數字轉文字 — String() 與字串拼接

將數字轉為文字有兩種方式，都可以使用。

```typescript
let n: number = 123;

// 方式一：使用 String()
let s1: string = String(n);

// 方式二：數字前後拼接空字串
let s2: string = '' + n;

console.log(typeof s1);  // string
console.log(typeof s2);  // string
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 兩種方式結果相同，<code>String()</code> 語意更清楚，字串拼接較簡便
</div>

<!--
反過來，要把數字轉成文字，有兩種方式。

第一種是用 `String()`，語意很清楚。第二種是在數字前面加上一個空字串，因為加號的一邊是字串時，另一邊也會被轉成字串來拼接。

兩種方式的結果一樣，用 `typeof` 檢查都是 string。`String()` 讀起來比較清楚，空字串的寫法比較簡短，可以依習慣選擇。
-->

---
layout: default
---

# 類型轉換 — 小節練習

有兩個字串 `a = '150'` 和 `b = '80'`，先將它們轉換為數字後，計算並印出兩數之**和**與**積**。

<!--
我們用一個小練習熟悉型別轉換。

有兩個字串，`a` 是 150，`b` 是 80。請先把它們轉成數字，再計算並印出兩數的和與積。

想一想，如果沒有先轉型就直接相加，結果會是什麼？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 類型轉換 — 小節練習解答

```typescript
let a = '150';
let b = '80';
let numA = Number(a);
let numB = Number(b);
console.log(numA + numB);  // 230
console.log(numA * numB);  // 12000
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 未轉型直接 <code>'150' + '80'</code> 會得到 <code>'15080'</code>，而非 <code>230</code>！
</div>

<!--
我們來看答案。

先用 `Number()` 把兩個字串轉成數字，再相加得到 230，相乘得到 12000。

回答剛才的問題，如果直接把兩個字串相加，會得到 `'15080'`，這是字串拼接的結果，而不是 230。這是最常見的錯誤。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# JSON
# JavaScript Object Notation

<!--
接下來，我們介紹網頁開發中最常見的資料交換格式：JSON。
-->

---

# 什麼是 JSON？

**JSON（JavaScript Object Notation）** 是一種文字格式，用來儲存和交換資料，人類可讀且機器可解析。

| JSON 支援的資料型別 | 範例 |
| --- | --- |
| 物件 | `{"name": "Allen"}` |
| 陣列 | `[1, 2, 3]` |
| 字串 | `"Hello"` |
| 數字 | `123` |
| 空值 | `null` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 前端向後端傳送或接收資料時，通常都使用 JSON 格式
</div>

<!--
JSON 的全名是 JavaScript Object Notation，是一種「用來儲存和交換資料的文字格式」，人看得懂，程式也能解析。

我們可以把它想成程式世界的共通語言。前端不管用 Angular 還是 React，後端不管用 Java 還是 Python，彼此交換資料時，大多都用 JSON。

看表格，JSON 支援物件、陣列、字串、數字和空值。它長得很像 TypeScript 的物件，但鍵要用雙引號包起來。
-->

---

# 物件轉 JSON — JSON.stringify()

要將 TypeScript 物件傳送給後端時，需先用 **`JSON.stringify()`** 轉換為 JSON 字串。

```typescript
let obj = { name: 'Allen', age: 25 };

let json = JSON.stringify(obj);
console.log(json);         // {"name":"Allen","age":25}
console.log(typeof json);  // string
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>JSON.stringify()</code> 輸出的是字串，Console 中不可展開的那個就是 JSON 格式
</div>

<!--
前端要把資料送給後端時，不能直接傳 TypeScript 物件，要先轉成 JSON 字串。

這時候用 `JSON.stringify()`。這裡把一個有名字和年齡的物件轉換之後，印出來會是一串文字，鍵都加上了雙引號。用 `typeof` 檢查，型別是 string。

這個把物件轉成字串的過程，叫做「序列化」。
-->

---

# JSON 轉物件 — JSON.parse()

收到後端的 JSON 資料後，用 **`JSON.parse()`** 轉回物件才能在程式中使用。

```typescript
let jsonStr = '{"name":"Allen","age":25}';

let parsed = JSON.parse(jsonStr);
console.log(parsed.name);  // Allen
console.log(parsed.age);   // 25
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 使用 Angular 的 HttpClient 呼叫 API 時，通常會自動將 JSON 轉為物件，不需手動 parse
</div>

<!--
反過來，收到後端傳來的 JSON 字串時，要用 `JSON.parse()` 把它轉回物件，才能讀取裡面的屬性。

這裡把一串 JSON 文字轉回物件之後，就可以用 `parsed.name` 讀到 Allen，用 `parsed.age` 讀到 25。這個過程叫做「反序列化」。

實務上，用 Angular 的 HttpClient 呼叫 API 時，框架通常會自動幫我們轉換，不用手動 parse。但這個原理還是要懂。
-->

---
layout: default
---

# JSON — 小節練習

建立物件 `user = { name: '小明', age: 22, city: '台北' }`，用 `JSON.stringify` 轉為 JSON 字串並印出，再驗證其型別為 `string`。

<!--
我們用一個小練習熟悉 JSON。

請建立一個 `user` 物件，包含名字、年齡和城市，用 `JSON.stringify` 把它轉成 JSON 字串並印出，再確認它的型別是 string。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# JSON — 小節練習解答

```typescript
let user = { name: '小明', age: 22, city: '台北' };
let json = JSON.stringify(user);
console.log(json);         // {"name":"小明","age":22,"city":"台北"}
console.log(typeof json);  // string
```

<!--
我們來看答案。

用 `JSON.stringify` 轉換之後，印出來的是一串文字，所有的鍵都加上了雙引號。用 `typeof` 檢查，結果是 string。

這裡要注意，轉換之後就不再是物件了，所以沒辦法直接用點的方式讀取屬性，要讀取的話得先用 `JSON.parse` 轉回來。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 運算符
# Operators

<!--
接下來是程式裡的數學符號：運算子。
-->

---

# 算術運算符（一）— 四則運算

| 運算符 | 說明 | 範例 | 結果 |
| --- | --- | --- | --- |
| `+` | 加法 | `10 + 3` | `13` |
| `-` | 減法 | `10 - 3` | `7` |
| `*` | 乘法 | `10 * 3` | `30` |
| `/` | 除法 | `10 / 3` | `3.33...` |
| `%` | 餘數 | `10 % 3` | `1` |

<!--
算術運算子就是加減乘除，跟數學一樣。

比較特別的是百分比符號，它在程式裡不是百分比，而是「取餘數」。例如 10 除以 3 餘 1，所以 10 取餘數 3 的結果是 1。
-->

---

# 算術運算符（一）— 範例

```typescript
console.log(10 + 3);  // 13
console.log(10 - 3);  // 7
console.log(10 * 3);  // 30
console.log(10 / 3);  // 3.3333...
console.log(10 % 3);  // 1（10 除以 3 餘 1）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>%</code> 餘數運算常用於判斷奇偶數：<code class="no-liga-code">n % 2 === 0</code> 代表 n 是偶數
</div>

<!--
我們看實際的範例。

加減乘的結果都跟數學一樣。要注意除法，10 除以 3 會得到 3.333，帶有小數，不像某些程式語言會自動捨去小數。

取餘數很常用來判斷奇偶數。一個數除以 2 的餘數是 0，就是偶數；不是 0，就是奇數。
-->

---

# 算術運算符（二）— 遞增 / 遞減 / 負號

| 運算符 | 說明 | 範例 | 結果 |
| --- | --- | --- | --- |
| <code>++</code> | 遞增（加 1） | `i++` | `i = i + 1` |
| <code>--</code> | 遞減（減 1） | `i--` | `i = i - 1` |
| <code>-</code>（負號） | 將數值取負 | `-n` | 負值 |

```typescript
let i = 5;
i++;              // i → 6
i--;              // i → 5
let n = 3;
console.log(-n);  // -3（負號）
```

<!--
接著是遞增和遞減運算子。

`i++` 代表把 `i` 加 1，`i--` 代表把 `i` 減 1。就像計算人數，來一個人就加一。另外，在數字前面加上負號，可以把它變成負數。

遞增和遞減在寫迴圈時，會天天用到。
-->

---

# 指派運算符

指派運算符是一種**簡寫**，將計算與賦值合併：

| 運算符 | 等同於 | 說明 |
| --- | --- | --- |
| <code>i += 9</code> | <code>i = i + 9</code> | 加後賦值 |
| <code>i -= 9</code> | <code>i = i - 9</code> | 減後賦值 |
| <code>i *= 9</code> | <code>i = i * 9</code> | 乘後賦值 |
| <code>i /= 9</code> | <code>i = i / 9</code> | 除後賦值 |
| <code>i %= 9</code> | <code>i = i % 9</code> | 取餘後賦值 |

<!--
指派運算子是一種簡寫，把計算和指定值合併成一步。

如果要把 `i` 加上 9，再存回 `i`，一般寫成 `i = i + 9`。用指派運算子，可以簡寫成 `i += 9`，兩者完全一樣。

減、乘、除和取餘數，也都可以用同樣的方式簡寫，讓程式碼更簡潔。
-->

---

# 指派運算符 — 範例

```typescript
let i = 10;

i += 5;   // i = 10 + 5 → 15
i -= 3;   // i = 15 - 3 → 12
i *= 2;   // i = 12 * 2 → 24
i /= 4;   // i = 24 / 4 → 6
i %= 4;   // i = 6 % 4  → 2

console.log(i);  // 2
```

<!--
我們一步一步看這個範例。

`i` 一開始是 10。加 5 變成 15，減 3 變成 12，乘 2 變成 24，除以 4 變成 6，最後 6 除以 4 取餘數，得到 2。

每一步都把結果存回 `i`，所以最後印出 2。做累加計算時，這種寫法非常實用。
-->

---

# 比較運算符

用來比較兩個值，通常用在 if 判斷中，結果為 `true` 或 `false`：

| 運算符 | 說明 | 範例 | 結果 |
| --- | --- | --- | --- |
| <span class="op-code">==</span> | **寬鬆**相等（2個等號）— 只比較值，不管型別 | <code class="no-liga-code">5 == '5'</code> | `true` |
| <span class="op-code">===</span> | **嚴格**相等（3個等號）— 值和型別都要相同 | <code class="no-liga-code">5 === '5'</code> | `false` |
| <span class="op-code">!=</span> | 值不相等 | <code class="no-liga-code">5 != 3</code> | `true` |
| <span class="op-code">&gt;</span> / <span class="op-code">&lt;</span> | 大於 / 小於 | <code class="no-liga-code">5 &gt; 3</code> | `true` |
| <span class="op-code">&gt;=</span> / <span class="op-code">&lt;=</span> | 大於等於 / 小於等於 | <code class="no-liga-code">5 &gt;= 5</code> | `true` |

<!--
比較運算子用來比較兩個值，結果是 true 或 false，通常用在 if 判斷裡。

這裡最重要的是兩種「等於」。兩個等號叫「寬鬆相等」，只比較值，會自動轉換型別，所以數字 5 和字串 5 會被當成相等。三個等號叫「嚴格相等」，值和型別都要相同，所以數字 5 和字串 5 不相等。

寬鬆相等的自動轉型，很容易造成意想不到的錯誤。所以在 Angular 開發中，請一律使用三個等號，以及驚嘆號加兩個等號的「嚴格不相等」。
-->

---

# 比較運算符 — 範例

```typescript
console.log((5 as any) == '5');  // true（JS 底層行為，TS 需轉 any 才能執行）
console.log(5 === '5');          // false（型別不同）
console.log(5 != 3);             // true
console.log(5 > 3);              // true
console.log(5 <= 3);             // false
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 TypeScript 直接寫 <code class="no-liga-code">5 == '5'</code> 會報 TS2367 型別錯誤，這正是 TS 的保護機制。實務上一律用 <code class="no-liga-code">===</code>，讓型別系統替你擋住這類問題
</div>

<!--
我們看範例。

第一行，數字 5 和字串 5 用寬鬆相等比較，結果是 true。注意這裡必須先轉成 `any` 才能執行，因為 TypeScript 會直接擋下這種比較。第二行用嚴格相等，型別不同，結果是 false。

其他幾行是不等於、大於和小於等於的比較。

TypeScript 會擋下寬鬆比較，這正是型別系統在保護我們。實務上一律用三個等號，讓型別檢查幫我們避開這類問題。
-->

---

# 邏輯運算符

用來組合多個比較條件，常搭配 if 使用：

| 運算符 | 說明 | 範例 | 結果 |
| --- | --- | --- | --- |
| <code>&&</code> | AND（且）：所有條件都為 true | `true && false` | `false` |
| <code>&#124;&#124;</code> | OR（或）：至少一個條件為 true | `true \|\| false` | `true` |
| <code>!</code> | NOT（非）：取反 | `!true` | `false` |

<!--
邏輯運算子用來組合多個條件。

兩個 `&` 是「而且」，所有條件都要成立。兩條直線是「或者」，只要有一個成立就好。驚嘆號是「反轉」，把 true 變成 false，false 變成 true。
-->

---

# 邏輯運算符 — 範例

```typescript
let x = true;
let y = false;

console.log(x && y);  // false（兩個都要 true）
console.log(x || y);  // true（有一個 true 即可）
console.log(!x);      // false（true 取反）

if (x && !y) {
  console.log('x 為真且 y 為假');
}
```

<!--
我們看範例。

`x` 是 true，`y` 是 false。`x` 而且 `y`，因為有一個是 false，結果是 false。`x` 或者 `y`，有一個是 true，結果就是 true。驚嘆號 `x`，把 true 反轉成 false。

驚嘆號在實務上很好用。例如要做一個展開和收合的選單，只要寫 `this.isOpen` 等於驚嘆號 `this.isOpen`，每次點擊就會在開和關之間切換。
-->

---
layout: default
---

# 運算符 — 小節練習

宣告 `price = 2000`，套用指派運算符計算最終售價後印出：
- 打九折（`*= 0.9`）
- 再扣除折扣券 100 元（`-= 100`）

<!--
我們用一個小練習熟悉指派運算子。

宣告 `price` 等於 2000，先用乘等於打九折，再用減等於扣掉 100 元的折扣券，最後印出售價。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 運算符 — 小節練習解答

```typescript
let price = 2000;
price *= 0.9;  // price = 1800
price -= 100;  // price = 1700
console.log(price);  // 1700
```

<!--
我們來看答案。

2000 乘以 0.9，變成 1800；再減 100，得到 1700。每一步都把結果存回 `price`，所以最後印出 1700。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 字串常用函數
# String Methods

<!--
接下來，我們看處理文字時常用的內建函數。
-->

---

# 字串常用函數

| 函數 | 說明 |
| --- | --- |
| `.length` | 回傳字串的字元數量 |
| `.slice(起始, 終止)` | 擷取從起始到終止（不含終止）位置的子字串 |
| `.indexOf(搜尋值)` | 搜尋指定內容，回傳第一個符合的位置（找不到回傳 -1） |
| `.split(分隔符號)` | 依分隔符號切割字串，回傳陣列；傳入 `''` 可逐字拆分 |

<!--
這四個是處理字串最常用的工具。

`.length` 回傳字串有幾個字元。`.slice` 從起始位置擷取到終止位置，注意不包含終止位置那個字元。`.indexOf` 搜尋某個內容，回傳它第一次出現的位置，找不到的話會回傳負一。`.split` 依照指定的符號切割字串，回傳一個陣列，傳入空字串的話，會把每個字元都拆開。
-->

---

# 字串常用函數 — 範例

```typescript
let str = 'Hello World';

console.log(str.length);           // 11
console.log(str.slice(0, 5));      // Hello
console.log(str.slice(6));         // World
console.log(str.indexOf('W'));     // 6
console.log(str.indexOf('xyz'));   // -1（找不到）
console.log('Hello'.split(''));    // ['H', 'e', 'l', 'l', 'o']
console.log('a,b,c'.split(','));   // ['a', 'b', 'c']
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>split('') → reverse() → join('')</code> 三步可反轉字串：<code>'Hello'.split('').reverse().join('')</code> → <code>'olleH'</code>
</div>

<!--
我們看範例。

`'Hello World'` 的長度是 11。字串的位置從 0 開始算，所以 `slice(0, 5)` 擷取到 Hello；`slice(6)` 只給起始位置，就會擷取到最後，得到 World。`indexOf('W')` 回傳 6，搜尋不存在的內容則回傳負一。

`split` 傳入空字串，會把 Hello 拆成五個字母；傳入逗號，就依照逗號切開。

另外，`split`、`reverse`、`join` 三個串在一起，可以把字串反轉，後面的練習題會用到。
-->


---
layout: default
---

# 字串常用函數 — 小節練習

有字串 `email = 'student@school.edu.tw'`：
- 印出此字串的長度
- 用 `indexOf` 找出 `'@'` 符號的位置
- 用 `slice` 擷取 `'@'` 前面的使用者名稱部分

<!--
我們用一個小練習熟悉字串函數。

有一個 email 字串，請印出它的長度，用 `indexOf` 找出小老鼠符號的位置，再用 `slice` 擷取小老鼠前面的使用者名稱。

想一想，`indexOf` 找到的位置，要怎麼搭配 `slice` 使用？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 字串常用函數 — 小節練習解答

```typescript
let email = 'student@school.edu.tw';
console.log(email.length);           // 21
let atIdx = email.indexOf('@');
console.log(atIdx);                  // 7
console.log(email.slice(0, atIdx));  // student
```

<!--
我們來看答案。

字串長度是 21。`indexOf` 找到小老鼠在位置 7，因為前面的 student 剛好是 7 個字元，佔了位置 0 到 6。

接著 `slice(0, 7)`，從位置 0 擷取到位置 7，而且不包含位置 7，就剛好得到 student。`indexOf` 加上 `slice`，是字串處理最常見的組合。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 陣列常用函數
# Array Methods

<!--
處理完字串，接下來看陣列的常用函數。
-->

---

# 陣列常用函數（一）

| 函數 | 說明 |
| --- | --- |
| `.length` | 回傳陣列中的資料筆數 |
| `.splice(起始, 長度)` | 從起始位置刪除指定數量的元素（會修改原陣列） |
| `.filter(條件函數)` | 依條件篩選，回傳符合條件的元素組成新陣列 |

<!--
陣列的第一組常用函數。

`.length` 回傳陣列有幾筆資料。`.splice` 從起始位置開始，刪除指定數量的元素，要注意它會直接修改原本的陣列。`.filter` 是篩選器，會把每一筆資料拿去檢查，符合條件的才放進一個新的陣列回傳。
-->

---

# 陣列常用函數（一）— 範例

```typescript
let arr = [1, 2, 3, 4, 5];

console.log(arr.length);   // 5

arr.splice(1, 2);          // 從 index 1 刪除 2 筆
console.log(arr);          // [1, 4, 5]

let arr2 = [1, 2, 3, 4, 5];
let evens = arr2.filter(n => n % 2 === 0);
console.log(evens);        // [2, 4]
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>filter</code> 的條件函數需回傳 <code>true</code> 或 <code>false</code>；<code>splice</code> 會直接修改原陣列
</div>

<!--
我們看範例。

`arr.splice(1, 2)`，從位置 1 開始刪除 2 筆，也就是刪掉 2 和 3，陣列剩下 1、4、5。

下面的 `filter`，用一個箭頭函式當作條件：n 除以 2 的餘數等於 0，也就是偶數。結果篩出一個新的陣列，裡面是 2 和 4，原本的陣列不受影響。

`filter` 的條件函式要回傳 true 或 false。之後做搜尋和過濾功能時，`filter` 是最核心的工具。
-->

---

# 陣列常用函數（二）

| 函數 | 說明 |
| --- | --- |
| `.push(值)` | 在陣列末尾增加一筆資料 |
| `.pop()` | 刪除並回傳陣列最後一筆資料 |
| `.forEach(函數)` | 逐一執行每個元素，無法中斷，不產生新陣列 |
| `.map(函數)` | 逐一處理每個元素，回傳一個新陣列 |
| `.reverse()` | 將陣列元素反轉順序（**直接修改**原陣列） |
| `.join(連接符號)` | 將所有元素合併成一個字串 |

<!--
第二組常用的陣列函數。

`.push` 在陣列最後面加一筆資料，`.pop` 刪除並回傳最後一筆。`.forEach` 會對每個元素逐一執行一段程式，但不會產生新陣列。`.map` 也是逐一處理每個元素，但會把處理後的結果組成一個新陣列回傳。

`.reverse` 把陣列的順序反轉，要注意它會直接修改原陣列。`.join` 把所有元素用指定的符號連成一個字串。
-->

---

# 陣列常用函數（二）— 範例

```typescript
let arr = [1, 2, 3];

arr.push(4);
console.log(arr);  // [1, 2, 3, 4]

arr.pop();
console.log(arr);  // [1, 2, 3]

arr.forEach(n => console.log(n));  // 依序印出 1, 2, 3

let doubled = arr.map(n => n * 2);
console.log(doubled);  // [2, 4, 6]

let chars = ['H', 'e', 'l', 'l', 'o'];
chars.reverse();
console.log(chars.join(''));   // olleh
console.log(chars.join('-'));  // o-l-l-e-H
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>forEach</code> 不回傳值；<code>map</code> 產生新陣列，原陣列不變；<code>reverse</code> 直接修改原陣列
</div>

<!--
我們看範例。

`push(4)` 之後陣列是 1、2、3、4，`pop()` 之後又變回 1、2、3。`forEach` 依序印出每個數字。`map` 把每個數字乘以 2，得到新陣列 2、4、6，原陣列不變。

最後，把 Hello 的字元陣列 `reverse` 之後，用空字串 `join`，就得到反轉的字串；用連字號 `join`，字母之間就會用連字號連接。
-->


---
layout: default
---

# 陣列常用函數 — 小節練習

有成績陣列 `scores = [72, 45, 88, 91, 63, 78, 55]`：
- 用 `filter` 篩選出 **70 分以上**的成績
- 用 `map` 將原陣列每個分數乘以 `1.05`（加分），結果用 `Math.floor` 取整數

<!--
我們用一個小練習熟悉 `filter` 和 `map`。

有一個成績陣列，請用 `filter` 篩選出 70 分以上的成績，再用 `map` 把原本每個分數乘以 1.05，並用 `Math.floor` 取整數。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 陣列常用函數 — 小節練習解答

```typescript
let scores = [72, 45, 88, 91, 63, 78, 55];
let passing = scores.filter(s => s >= 70);
console.log(passing);  // [72, 88, 91, 78]
let boosted = scores.map(s => Math.floor(s * 1.05));
console.log(boosted);  // [75, 47, 92, 95, 66, 81, 57]
```

<!--
我們來看答案。

`filter` 的條件是分數大於等於 70，篩出 72、88、91、78。`map` 把每個分數乘以 1.05，再用 `Math.floor` 無條件捨去小數，得到加分後的新陣列。

要注意，`filter` 和 `map` 都會產生新陣列，原本的 `scores` 完全沒有改變。這兩個是前端最常用的陣列工具。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# For 迴圈
# For Loops

<!--
接下來，我們學習專門負責重複執行的工具：迴圈。
-->

---

# For 迴圈 — 傳統寫法

當你要重複執行某段程式碼，或逐一取出陣列資料時，使用 **for 迴圈**。

傳統寫法需要三個部分：

| 部分 | 說明 | 範例 |
| --- | --- | --- |
| 初始值 | 設定計數器起始值 | `let i = 0` |
| 判斷式 | 決定迴圈是否繼續 | `i < 20` |
| 遞增 | 每次執行後更新計數器 | `i++` |

<!--
for 迴圈用來重複執行某段程式，或是逐一取出陣列的資料。

就像教練說：「去操場跑 20 圈」。傳統的 for 迴圈需要三個部分。第一是初始值，`let i = 0`，代表一開始跑了 0 圈。第二是判斷式，`i < 20`，還沒到 20 圈就繼續跑。第三是遞增，`i++`，每跑完一圈就加 1。

這三個部分組合在一起，就能精準控制程式重複的次數。
-->

---

# For 迴圈 — 傳統寫法範例

```typescript
for (let i = 0; i < 20; i++) {
  console.log(i);  // 印出 0 到 19
}
```

```typescript
// 搭配陣列
let arr = [10, 20, 30];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);  // 可取得 index
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 當 <code>i</code> 遞增到不滿足判斷式時，迴圈結束；需要知道陣列位置時用此寫法
</div>

<!--
我們看範例。

第一個迴圈會從 0 印到 19。當 `i` 加到 20，不再滿足小於 20 的條件，迴圈就結束了。

第二個範例用迴圈走過陣列。判斷式寫 `i < arr.length`，這樣 `i` 會依序是 0、1、2，用 `arr[i]` 就能拿到每一筆資料。

當我們需要知道資料在陣列裡的位置時，就用這種寫法。
-->

---

# For 迴圈 — TypeScript 寫法（for...of）

TypeScript 提供更簡潔的 **`for...of`** 寫法，不需要初始值與條件，直接取出陣列中的值。

```typescript
let arr = [10, 20, 30];

for (let data of arr) {
  console.log(data);  // 依序印出 10, 20, 30
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>for...of</code> 無法取得 index；需要 index 時改用傳統 for 迴圈。此語法為 TypeScript/ES6+ 專屬，後端（純 JS）也支援
</div>

<!--
如果不需要知道位置，只想依序拿到每一筆資料，可以用更簡潔的 `for...of`。

`for` 小括號裡寫 `let data of arr`，意思是「把陣列裡的每一筆資料，依序放進 `data`」。不用寫計數器，也不用判斷長度，程式碼簡潔很多。

要注意，`for...of` 拿不到位置，需要位置時，還是要用傳統的 for 迴圈。
-->

---

# 展開運算子 — Spread Operator

`...` 可以將陣列「展開」成個別元素，常與 `Math.min()` / `Math.max()` 搭配使用：

```typescript
let arr = [4, 6, 1, 2, 7];

// ❌ 直接傳陣列：Math.min 不接受陣列格式
console.log(Math.min(arr));    // NaN

// ✅ 用 ... 展開陣列
console.log(Math.min(...arr)); // 1（最小值）
console.log(Math.max(...arr)); // 7（最大值）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>Math.min()</code> 與 <code>Math.max()</code> 只接受「一個個分開的數字」；<code>...</code> 負責把陣列拆開再傳入，等同於 <code>Math.min(4, 6, 1, 2, 7)</code>
</div>

<!--
這裡補充一個實用的語法：展開運算子，寫法是三個點。

`Math.min` 和 `Math.max` 可以找出最小值和最大值，但它們只接受一個一個分開的數字。如果直接把陣列傳進去，會得到 NaN。

在陣列前面加上三個點，就會把陣列展開成一個一個的元素再傳進去，效果等於直接寫出每個數字。所以 `Math.min` 加上展開的陣列，就能得到最小值 1，`Math.max` 得到最大值 7。

這個技巧在等一下的練習五會用到。
-->

---
layout: default
---

# For 迴圈 — 小節練習

用傳統 for 迴圈計算 **1 到 100 的總和**，印出結果。

<!--
我們用一個小練習熟悉 for 迴圈。

請用傳統的 for 迴圈，計算 1 加到 100 的總和，並印出結果。

想一想，迴圈外面需要先準備什麼變數，來存放累加的結果？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# For 迴圈 — 小節練習解答

```typescript
let sum = 0;
for (let i = 1; i <= 100; i++) {
  sum += i;
}
console.log(sum);  // 5050
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 數學小知識：1 + 2 + ... + 100 = 5050，可用公式 <code>n × (n+1) / 2</code> 驗證
</div>

<!--
我們來看答案。

先在迴圈外宣告 `sum` 等於 0，用來累加。迴圈從 1 跑到 100，每一圈都用 `sum += i` 把目前的數字加進去。跑完之後，印出 5050。

也可以用數學公式驗算：n 乘以 n 加 1，再除以 2，100 代進去剛好是 5050。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習
# Practice

<!--
這一章的工具都介紹完了，接下來我們用七道練習題，把這些觀念實際用一遍。
-->

---
layout: default
---

# 練習 1–3：任務說明
### for 迴圈練習

1. 用 for 迴圈將 **1 到 50** 全部打印出來

2. 承接第 1 題，**去除偶數**，只打印奇數

3. 用 for 迴圈將 **1 到 50 中，除以 3 餘數為 2** 的值打印出來

<!--
前三題是 for 迴圈和 if 判斷的組合練習。

第一題，用 for 迴圈印出 1 到 50。第二題，承接第一題，去掉偶數，只印出奇數。第三題，印出 1 到 50 之中，除以 3 餘數為 2 的數字。

提示一下，第二題和第三題都可以用取餘數來判斷。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 1–3：解題提示

**練習 1：**
```typescript
for (let i = 1; i <= 50; i++) { console.log(i); }
```

**練習 2：** 在迴圈內加 if 判斷，<code class="no-liga-code">i % 2 !== 0</code> 才 console.log

**練習 3：** 在迴圈內加 if 判斷，<code class="no-liga-code">i % 3 === 2</code> 才 console.log

<!--
我們來看前三題的提示。

第一題是標準的 for 迴圈，`i` 從 1 開始，一直跑到小於等於 50。

第二題在迴圈裡加上 if 判斷，`i` 除以 2 的餘數不等於 0，就代表是奇數，才印出來。

第三題一樣在迴圈裡判斷，`i` 除以 3 的餘數等於 2，才印出來。

迴圈加上判斷式，就能幫我們自動篩選出符合條件的資料。
-->

---
layout: default
---

# 練習 4–7：任務說明
### 陣列與字串練習

4. 建立下列物件陣列，並使用 `forEach` **將小王的 age 改為 18**：
   ```typescript
   let people = [
     { name: '小明', age: 20 },
     { name: '小王', age: 25 },
     { name: '小李', age: 30 }
   ];
   ```

5. 找出陣列 `[4, 6, 1, 2, 7, 9, 12, 15, 13]` 中的**最小值**

6. 將字串 `'你好我是Allen'` **倒著印出**

7. 從字串 `'我是Allen，你好'` 中**將名稱 Allen 打印出來**

<!--
後四題是陣列和字串的練習，難度稍微高一點。

第四題，用 `forEach` 把物件陣列裡小王的年齡改成 18。第五題，找出一個數字陣列的最小值。第六題，把「你好我是Allen」倒著印出來。第七題，從「我是Allen，你好」這個字串裡，把 Allen 擷取出來。

這四題都會用到剛才學的內建函數。

我們先暫停一下，自己動手試試看。
-->

---
zoom: 0.96
layout: default
---

# 練習 4–7：解題提示

**練習 4：** forEach 可修改物件屬性（注意：不能重新賦值整個元素）
```typescript
people.forEach(p => { if (p.name === '小王') p.age = 18; });
```

**練習 5：** 用 `Math.min(...arr)` 或在迴圈中比較取最小值
```typescript
console.log(Math.min(...[4, 6, 1, 2, 7, 9, 12, 15, 13]));  // 1
```

**練習 6：** 用 `.split('')` 切成字元陣列，再 `.reverse().join('')`
```typescript
console.log('你好我是Allen'.split('').reverse().join(''));
```

**練習 7：** 用 `indexOf` 找到 'A' 的位置，再用 `slice` 截取
```typescript
let s = '我是Allen，你好';
let start = s.indexOf('A');
console.log(s.slice(start, start + 5));  // Allen
```

<!--
我們逐一看後四題的提示。

第四題，在 `forEach` 裡判斷名字是不是小王，是的話就把 `age` 改成 18，這會直接修改原本的物件。

第五題，最快的做法是 `Math.min` 加上展開運算子，把陣列展開再比較。也可以用迴圈一個一個比。

第六題，先用 `split` 把字串拆成字元陣列，再用 `reverse` 反轉，最後用 `join` 接回字串。

第七題，先用 `indexOf` 找到 A 的位置，再用 `slice` 從這個位置往後擷取 5 個字元，因為 Allen 剛好是 5 個字母。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充練習
# Extra Practice

<!--
接下來是幾題補充練習，把這一章學到的內容再動手練一次。
-->

---
layout: default
---

# 補充練習 1：JSON 物件序列化與還原

模擬實務上傳送與接收後台資料時的格式互轉：

1. 建立物件 `{ course: 'Angular', isLTS: true }`
2. 用 `JSON.stringify()` 將它轉成 JSON 字串，模擬存到後台
3. 再用 `JSON.parse()` 將字串還原為物件
4. 用 `alert()` 顯示還原後物件的 `course` 屬性

<!--
第一題補充練習，我們把物件轉成 JSON 字串，再轉回來。

先用 `JSON.stringify` 把物件變成字串，接著用 `JSON.parse` 把字串還原成物件，最後印出它的 `course` 屬性，確認真的還原成功。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：JSON 序列化與還原 — 參考答案

```typescript
let obj = { course: 'Angular', isLTS: true };

// 物件 → JSON 字串
let jsonStr = JSON.stringify(obj);
console.log(jsonStr);          // '{"course":"Angular","isLTS":true}'
console.log(typeof jsonStr);   // 'string'

// JSON 字串 → 物件
let backObj = JSON.parse(jsonStr);
alert(backObj.course);         // Angular
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>stringify</code> 用在「送出 / 儲存」前，<code>parse</code> 用在「收到 / 讀取」後；字串沒辦法用 <code>.course</code> 取值，一定要先 parse
</div>

<!--
我們來看答案。

`JSON.stringify` 把物件轉成一串文字，用 `typeof` 檢查會是 string。這種格式方便傳送和儲存。

要使用裡面的資料時，再用 `JSON.parse` 把字串轉回物件，這樣才能用 `.course` 取出值。之後學到網頁儲存和 API 時，這兩個方法會一直用到。
-->

---
layout: default
---

# 補充練習 2：push 與 for...of 累加

1. 宣告數字陣列 `let scores = [10, 20, 30];`
2. 用 `push(40)` 在尾端加入新數字
3. 用 `for...of` 依序取出每個分數，**只累加大於 15 的分數**
4. 最後印出加總結果

<!--
第二題補充練習，結合陣列方法和迴圈。

先用 `push` 把 40 加到陣列最後面，接著用 `for of` 一個一個取出分數，只把大於 15 的加起來，最後印出總和。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：push 與 for...of 累加 — 參考答案

```typescript
let scores = [10, 20, 30];
scores.push(40);              // [10, 20, 30, 40]

let total = 0;
for (let score of scores) {
  if (score > 15) {
    total += score;           // 20 + 30 + 40
  }
}
console.log(total);           // 90
```

<!--
我們來看答案。

`push` 之後，陣列變成 10、20、30、40。

先宣告 `total` 等於 0，用來存加總。`for of` 每一輪會把一個分數放進 `score`，用 `if` 判斷大於 15 才加進 `total`。10 不符合條件，被跳過，所以結果是 20 加 30 加 40，等於 90。
-->

---
layout: end
---

# TypeScript 練習（一）完成
### 判斷、轉換、運算、迴圈全部掌握！

<!--
這一章我們做了一次綜合練習。我們學了 if 和 else if 判斷，字串和數字的轉換，以及 JSON 的序列化和反序列化。我們也認識了各種運算子，記得比較時一律用三個等號。最後學了字串和陣列的常用函數，以及 for 迴圈和 `for...of`。

有些題目寫起來比較吃力是很正常的，多練習幾次，手感就會慢慢累積起來。

下一章，我們會繼續第二部分的 TypeScript 練習。我們下一章見。
-->
