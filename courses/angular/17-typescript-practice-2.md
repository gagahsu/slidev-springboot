---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: TypeScript 練習（二）
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
    Angular Full-Stack Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    TypeScript 練習（二）
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「日期、資料重組、方法綜合應用」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們練習了判斷、運算和迴圈。這一章是 TypeScript 練習的第二部分，我們要挑戰三個實務上很常遇到的主題。

第一是日期物件，幾乎每個系統都會用到日期。第二是資料重組，把後端給的資料格式，轉成前端需要的格式。第三是複習方法的宣告，並做綜合應用。

這些內容跟之後串接 API 的實戰能力息息相關。
-->

---
layout: default
---

# Outline

- **Date 日期物件**
- **日期比較**
- **重組資料**
- **宣告方法複習**
- **實作練習**

<!--
這一章會先學 Date 日期物件的建立，以及常用的取值方法。接著看怎麼比較兩個日期的先後。然後學習怎麼重組資料欄位。最後複習方法的宣告，並用四道練習題收尾。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Date 日期物件
# Working with Dates

<!--
我們先來認識日期物件，Date。
-->

---

# Date 物件 — 建立日期

使用 `new Date()` 建立日期物件，共有三種常用寫法：

```typescript
// 抓取當下時間
let date = new Date();
console.log(date); // Sun Oct 27 2024 14:56:19 GMT+0800

// 建立指定日期（時間預設 00:00:00）
date = new Date('2019-10-27');
console.log(date); // Sun Oct 27 2019 08:00:00 GMT+0800

// 建立指定日期與時間（精確到秒）
date = new Date('2019-10-27 02:20:02');
console.log(date); // Sun Oct 27 2019 02:20:02 GMT+0800
```

<!--
在 TypeScript 裡，用 `new Date()` 就能建立一個日期物件，常用的寫法有三種。

第一種不傳任何參數，會抓取當下的系統時間。第二種傳入一個日期字串，例如 2019 年 10 月 27 日，就會建立那一天的日期，這裡因為時區的關係，時間會顯示早上八點。第三種傳入日期加上時間，可以精確到秒。

不管是行事曆、簽到系統，還是文章的發布時間，都會用到日期物件。
-->

---

# Date 常用方法

| 方法 | 說明 | 回傳值（以 `2019-10-27 02:20:02` 為例） |
| --- | --- | --- |
| `.getFullYear()` | 取得年份（4位數） | `2019` |
| `.getMonth()` | 取得月份（**0–11**，需 +1） | `9`（10月） |
| `.getDate()` | 取得日期（1–31） | `27` |
| `.getDay()` | 取得星期幾（0=週日，6=週六） | `0`（週日） |
| `.getHours()` | 取得小時（0–23） | `2` |
| `.getMinutes()` | 取得分鐘（0–59） | `20` |
| `.getSeconds()` | 取得秒數（0–59） | `2` |
| `.getTime()` | 取得毫秒時間戳（從 1970/1/1 起算） | 大數字 |

<!--
建立日期物件之後，可以用一系列 `get` 開頭的方法，取出年、月、日這些資訊。

`getFullYear` 取得四位數的年份，`getDate` 取得日期，`getHours`、`getMinutes`、`getSeconds` 分別取得時、分、秒。

這裡有兩個要特別注意的地方。第一，`getMonth` 回傳的月份是從 0 到 11，也就是 1 月是 0，12 月是 11，顯示的時候一定要加 1。這是新手和老手都很常踩到的錯誤。第二，`getDay` 回傳星期幾，0 代表星期日，6 代表星期六。

最後的 `getTime`，會回傳從 1970 年 1 月 1 日到這個時間點的總毫秒數，等一下比較日期時會用到。
-->

---

# Date 常用方法 — 範例

```typescript
let date = new Date('2019-10-27 02:20:02');

console.log(date.getFullYear()); // 2019
console.log(date.getMonth());    // 9（月份從 0 開始，10月 = 9）
console.log(date.getDate());     // 27
console.log(date.getHours());    // 2
console.log(date.getMinutes());  // 20
console.log(date.getSeconds());  // 2
console.log(date.getDay());      // 0（0 = 週日）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>getMonth()</code> 從 0 開始（0 = 1月），使用時記得加 1 才是正確月份
</div>

<!--
我們看實際的範例。

這個日期是 2019 年 10 月 27 日凌晨 2 點 20 分 2 秒。年份印出 2019，日期 27，時分秒分別是 2、20、2。

注意 `getMonth` 印出的是 9，代表 10 月；`getDay` 印出 0，代表星期日。
-->

---

# 日期比較 — getTime()

兩個 `Date` 物件**不能直接用 `>` / `<` 比較**，需先用 `.getTime()` 轉為毫秒數再比較。

```typescript
let sDate = new Date('2024/11/27');
let eDate = new Date('2024/11/28');

console.log(sDate.getTime() > eDate.getTime()); // false
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 毫秒數越大代表日期越晚；<code>getTime()</code> 讓兩個日期可以像數字一樣直接比較大小
</div>

<!--
如果想判斷「截止日期是不是已經過了」，可以直接用大於、小於比較兩個日期物件嗎？

不建議這樣做。正確的方式是先用 `getTime()`，把日期轉成毫秒數，再比較大小。毫秒數越大，代表日期越晚。

這個範例中，`sDate` 是 11 月 27 日，`eDate` 是 11 月 28 日。比較兩者的毫秒數，`sDate` 比較小，所以「`sDate` 大於 `eDate`」的結果是 false。

把日期轉成數字之後，就能像比較一般數字一樣判斷先後。
-->

---
layout: default
---

# Date 日期物件 — 小節練習

建立日期物件 `new Date('1997-07-01 12:30:00')`，依序印出：年份、**正確月份**（注意 +1）、日期、星期幾、小時。

<!--
我們用一個小練習熟悉日期物件。

請建立 1997 年 7 月 1 日 12 點 30 分的日期物件，依序印出年份、正確的月份、日期、星期幾和小時。

想一想，月份要怎麼處理，才會印出正確的 7？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# Date 日期物件 — 小節練習解答

```typescript
let date = new Date('1997-07-01 12:30:00');
console.log(date.getFullYear());    // 1997
console.log(date.getMonth() + 1);  // 7（getMonth() 回傳 6，需 +1）
console.log(date.getDate());       // 1
console.log(date.getDay());        // 2（週二）
console.log(date.getHours());      // 12
```

<!--
我們來看答案。

年份是 1997。`getMonth` 回傳的是 6，所以要加 1，才會印出 7 月。日期是 1，小時是 12。

`getDay` 回傳 2，代表星期二。記得 0 是星期日，1 是星期一，依此類推。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 重組資料
# Data Restructuring

<!--
接下來，我們看一個前後端合作時很常遇到的問題：資料重組。
-->

---

# 重組資料 — 為什麼需要？

收到後端資料時，欄位名稱不一定符合前端需求。例如後端給的是 `name / age / sex`，但前端需要每個欄位加上 `user` 前綴：

```typescript
// 後端傳來的原始資料
let jsonData = {
  name: 'Allen',
  age: 12,
  sex: 'M'
};
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 除非前後端一開始就統一格式，否則資料重組是無法避免的過程
</div>

<!--
在實際專案裡，後端 API 回傳的欄位名稱，不一定符合前端的需求。

例如後端給的是 `name`、`age`、`sex`，但前端的元件已經寫好，需要的是 `userName`、`userAge`、`userSex`。

這時候通常不會去要求後端修改 API，因為同一支 API 可能還有其他系統在使用，改了會影響別人。比較好的做法是前端自己把資料轉成需要的格式。

除非前後端一開始就統一格式，否則資料重組是很常見的步驟。
-->

---

# 重組資料 — 範例（物件）

將原始資料每個欄位加上 `user` 前綴，放進新物件：

```typescript
let newJsonData = {
  userName: jsonData.name,
  userAge:  jsonData.age,
  userSex:  jsonData.sex
};

console.log(newJsonData);
// { userName: 'Allen', userAge: 12, userSex: 'M' }
```

<!--
重組的方法很單純：建立一個新物件，把舊欄位的值，一一對應到新的欄位名稱。

這裡新物件的 `userName`，取自原本資料的 `name`；`userAge` 取自 `age`；`userSex` 取自 `sex`。

印出來之後，就得到一個完全符合前端格式的新物件。
-->

---

# 重組資料 — 範例（陣列）

若後端回傳的是陣列，用 `map` 對每筆資料做同樣的重組：

```typescript
let jsonArray = [
  { name: 'Allen', age: 12, sex: 'M' },
  { name: 'Bob',   age: 25, sex: 'M' }
];

let newArray = jsonArray.map(item => ({
  userName: item.name,
  userAge:  item.age,
  userSex:  item.sex
}));

console.log(newArray);
// [
//   { userName: 'Allen', userAge: 12, userSex: 'M' },
//   { userName: 'Bob',   userAge: 25, userSex: 'M' }
// ]
```

<!--
如果後端回傳的是陣列，就用上一章學過的 `map`，對每一筆資料做同樣的重組。

`map` 會依序拿出陣列裡的每一筆資料，也就是 `item`，然後回傳一個新的物件，欄位對應方式跟剛才一樣。

注意箭頭後面的大括號外面，多包了一層小括號。這是因為要直接回傳一個物件，加上小括號，TypeScript 才不會把大括號誤認為程式區塊。

最後得到一個新陣列，每一筆資料都換成了前端需要的欄位名稱。
-->

---
layout: default
---

# 重組資料 — 小節練習

後端傳來以下資料，請重組為前端需要的格式，並印出新物件：

```typescript
let apiData = { account: 'allen123', score: 95, passed: true };
// 目標格式：{ loginId: ..., examScore: ..., isPass: ... }
```

<!--
我們用一個小練習熟悉資料重組。

後端傳來的資料有 `account`、`score` 和 `passed` 三個欄位，請把它重組成 `loginId`、`examScore` 和 `isPass`，並印出新物件。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 重組資料 — 小節練習解答

```typescript
let apiData = { account: 'allen123', score: 95, passed: true };
let formData = {
  loginId:   apiData.account,
  examScore: apiData.score,
  isPass:    apiData.passed
};
console.log(formData);
// { loginId: 'allen123', examScore: 95, isPass: true }
```

<!--
我們來看答案。

建立一個新物件 `formData`，`loginId` 取自 `apiData.account`，`examScore` 取自 `score`，`isPass` 取自 `passed`。印出來就是重組後的格式。

如果資料是陣列，就改用 `map`，對每一筆資料做同樣的對應。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 宣告方法複習
# Declaring Methods

<!--
接下來，我們快速複習方法的宣告和呼叫，等一下的練習題會用到。
-->

---

# 宣告方法 — 複習

無論是從 HTML 觸發，還是在 TS 中呼叫，都需要自己宣告方法。方法可以帶入參數：

```typescript
// TS 端：宣告帶入一個值 msg 的方法
showAlert(msg: string) {
  alert(msg);
}

// TS 中呼叫
this.showAlert('HI');
```

```html
<!-- HTML 觸發 -->
<button (click)="showAlert('HI')">按鈕</button>
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 方法名稱可自由命名，但不能與系統保留字相同
</div>

<!--
複習一下，不管是從 HTML 觸發，還是在 TypeScript 裡呼叫，都要先宣告方法。

這裡宣告了 `showAlert`，它有一個字串型別的參數 `msg`，裡面用 `alert` 顯示這段訊息。

在 TypeScript 裡呼叫它，前面要加上 `this.`。在 HTML 裡，則用小括號 `click` 事件綁定來呼叫，並帶入要顯示的文字。

方法名稱可以自由命名，但不能跟系統的保留字相同。
-->

---

# 補充語法：次方與數字格式化

本章練習題會用到以下兩個語法，先來認識一下：

| 語法 | 說明 | 範例 | 結果 |
| --- | --- | --- | --- |
| `** n` | 次方運算符，計算 n 次方 | `2 ** 3` | `8` |
| `.toFixed(n)` | 四捨五入至小數點後 n 位，**回傳字串** | `(3.1415).toFixed(2)` | `'3.14'` |

```typescript
console.log(2 ** 3);              // 8（2 的 3 次方）
console.log(3 ** 2);              // 9（3 的平方）
console.log((3.1415).toFixed(2)); // '3.14'
console.log((1.8).toFixed(0));    // '2'（四捨五入到整數）
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 BMI 公式中的 <code>(height / 100) ** 2</code> 就是身高（m）的平方；<code>.toFixed(1)</code> 讓結果只顯示一位小數。注意 <code>toFixed</code> 回傳的是<b>字串</b>，若需繼續計算要再用 <code>Number()</code> 轉型。
</div>

<!--
這一章的練習會用到兩個新的語法，我們先認識一下。

第一個是兩個星號，它是次方運算子。2 的 3 次方寫成 `2 ** 3`，結果是 8；平方就是星號星號 2。

第二個是 `toFixed`，它會把數字四捨五入到小數點後指定的位數。例如 3.1415 用 `toFixed(2)`，會得到 3.14。

要注意，`toFixed` 回傳的是字串，不是數字。如果要拿結果繼續計算，記得先用 `Number()` 轉回數字，否則加法會變成字串拼接。
-->

---
layout: default
---

# 宣告方法複習 — 小節練習

寫一個方法 `circleArea(radius: number)`，計算圓面積（`π × r²`，π 取 `3.14159`），並用 `toFixed(2)` 印出結果。呼叫 `this.circleArea(5)`。

<!--
我們用一個小練習，把方法、參數和剛才的新語法串起來。

請寫一個 `circleArea` 方法，接收半徑作為參數，計算圓面積，也就是圓周率乘以半徑的平方，圓周率取 3.14159。最後用 `toFixed(2)` 印出結果，並呼叫 `this.circleArea(5)`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 宣告方法複習 — 小節練習解答

```typescript
circleArea(radius: number) {
  let area = 3.14159 * radius ** 2;
  console.log('面積：' + area.toFixed(2));
}

this.circleArea(5);  // 面積：78.54
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>radius ** 2</code> 是 r 的平方；<code>toFixed(2)</code> 回傳字串，若需繼續計算要用 <code>Number()</code> 轉型
</div>

<!--
我們來看答案。

在方法裡，用 `radius ** 2` 計算半徑的平方，再乘以 3.14159。半徑是 5 時，結果是 78.53975，用 `toFixed(2)` 四捨五入後，印出 78.54。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習
# Practice

<!--
接下來是這一章的實作練習，共有四題，都是從生活情境出發。
-->

---
layout: default
---

# 練習 1–2：任務說明
### 運算練習

**練習 1：**  
Allen 錢包裡有 200 元，買了一個漢堡（50 元）、三個薯條（40 元/個），  
請問他還剩下多少錢？

**練習 2：**  
Allen 身上有 5000 元，想買 10 份漢堡（50 元）、10 份薯條（40 元），  
因為有會員卡可以打 **九折**，請問他還剩下多少錢？

<!--
前兩題是運算練習。

第一題，Allen 錢包裡有 200 元，買了一個 50 元的漢堡，和三份每份 40 元的薯條，請問還剩多少錢？

第二題，Allen 身上有 5000 元，想買 10 份漢堡和 10 份薯條，而且會員卡可以打九折，請問還剩多少錢？

請宣告變數、寫出算式，並印出結果。我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 1–2：解題提示

**練習 1：**

```typescript
let money = 200;
let spent = 50 + 40 * 3;   // 170
console.log(money - spent); // 30
```

**練習 2：**

```typescript
let money = 5000;
let cost = (10 * 50 + 10 * 40) * 0.9;  // 810
console.log(money - cost);               // 4190
```

<!--
我們來看答案。

第一題，花費是 50 加上 40 乘以 3，等於 170，200 減掉 170，剩下 30 元。

第二題，先算出 10 份漢堡和 10 份薯條的總價，再乘以 0.9 打九折，花費是 810 元。5000 減掉 810，剩下 4190 元。

注意第二題的總價要先用小括號包起來，再乘以 0.9，否則只會有後面那一項打折。
-->

---
layout: default
---

# 練習 3：任務說明
### VIP 資格判斷

建立下列資料，並用程式判斷哪些人有達成 **VIP 資格（累積花費 200 元以上）**：

```typescript
let arrayData = [
  { userName: 'Allen', payMoney: 500 },
  { userName: 'Ben',   payMoney: 20  },
  { userName: 'Eric',  payMoney: 120 }
];
```

<!--
第三題是 VIP 資格判斷，這在電商系統裡很常見。

這裡有一個陣列，記錄了 Allen、Ben 和 Eric 三個人的累積消費。請寫程式找出累積消費達到 200 元以上的人，並印出他達成 VIP。

想一想，要用哪個方法逐一檢查每個人？又要怎麼判斷金額？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 3：解題提示

```typescript
let arrayData = [
  { userName: 'Allen', payMoney: 500 },
  { userName: 'Ben',   payMoney: 20  },
  { userName: 'Eric',  payMoney: 120 }
];

arrayData.forEach(item => {
  if (item.payMoney >= 200) {
    console.log(item.userName + ' 達成 VIP！');
  }
});
// Allen 達成 VIP！
```

<!--
我們來看答案。

用 `forEach` 逐一檢查陣列裡的每個人。在迴圈裡，用 if 判斷 `payMoney` 是不是大於等於 200，符合的話，就把名字和「達成 VIP」組合起來印出。

三個人裡只有 Allen 消費了 500 元，所以結果會印出「Allen 達成 VIP」。
-->

---
layout: default
---

# 練習 4：任務說明
### BMI 計算方法

寫一個可以帶入 **身高（cm）** 與 **體重（kg）** 的方法，計算 BMI 並判斷所在區間。

| BMI 值 | 區間 |
| --- | --- |
| < 18.5 | 過輕 |
| 18.5 – 24.9 | 正常 |
| 25 – 29.9 | 過重 |
| ≥ 30 | 肥胖 |

BMI 公式：`體重(kg) ÷ 身高(m)²`

<!--
第四題是這一章的綜合題：寫一個 BMI 計算方法。

這個方法要接收身高和體重兩個參數，身高的單位是公分，體重是公斤。BMI 的公式是體重除以身高的平方，而且身高要用公尺。

算出 BMI 之後，再依照表格判斷區間：小於 18.5 是過輕，18.5 到 24.9 是正常，25 到 29.9 是過重，30 以上是肥胖。

想一想，身高是公分，代進公式之前要先做什麼？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 練習 4：解題提示

```typescript
calculateBMI(height: number, weight: number) {
  let bmi = weight / (height / 100) ** 2;

  if (bmi < 18.5) {
    console.log(`BMI ${bmi.toFixed(1)}：過輕`);
  } else if (bmi < 25) {
    console.log(`BMI ${bmi.toFixed(1)}：正常`);
  } else if (bmi < 30) {
    console.log(`BMI ${bmi.toFixed(1)}：過重`);
  } else {
    console.log(`BMI ${bmi.toFixed(1)}：肥胖`);
  }
}
```

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 身高單位是 cm，計算時需除以 100 轉為 m；<code>** 2</code> 是 TypeScript 的次方運算符
</div>

<!--
我們來看答案。

方法 `calculateBMI` 接收身高和體重。回答剛才的問題，身高要先除以 100，從公分換算成公尺，再用兩個星號 2 取平方，最後拿體重去除。

接著用 if 和 else if 判斷區間。因為條件是由上往下比對，所以只要寫「小於 25」，就代表 18.5 到 25 之間，不用再寫下限。

印出時，用 `toFixed(1)` 讓 BMI 只顯示一位小數。寫好之後，只要傳入不同的身高體重，就能隨時計算。
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

# 補充練習 1：入場資格判斷

1. 宣告 `let age = 20;` 與 `let hasTicket = true;`
2. 撰寫判斷式：當「年齡大於等於 18 歲」**而且**「擁有門票」時，印出 `'允許入場'`
3. 否則印出 `'拒絕入場'`
4. 試著修改兩個變數的值，觀察結果變化

<!--
第一題補充練習，用 if 判斷一個人能不能入場。

條件有兩個：年齡要大於等於 18，而且要有門票，兩個都成立才能入場。想一想，兩個條件同時成立要用哪個邏輯運算符？

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 1：入場資格判斷 — 參考答案

```typescript
let age = 20;
let hasTicket = true;

if (age >= 18 && hasTicket) {
  console.log('允許入場');
} else {
  console.log('拒絕入場');
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>&&</code>（而且）兩邊都要成立；<code>||</code>（或者）只要一邊成立即可。<code>hasTicket</code> 本身就是布林值，不需要寫成 <code>hasTicket === true</code>
</div>

<!--
我們來看答案。

兩個條件都要成立，所以用 `&&` 串起來。`hasTicket` 本身就是布林值，直接放進條件即可。

試著把 `age` 改成 16，或把 `hasTicket` 改成 false，只要有一個條件不成立，就會印出拒絕入場。
-->

---
layout: default
---

# 補充練習 2：活動過期檢查

1. 宣告活動截止日：`let deadline = new Date('2026/12/31');`
2. 宣告目前時間：`let now = new Date();`
3. 利用 `.getTime()` 取得兩者的毫秒數，用 `if` 判斷現在時間是否大於截止日
4. 若已過期，用 `alert()` 顯示 `'警告：活動已過期！'`

<!--
第二題補充練習，比較兩個日期。

宣告活動截止日和現在時間，用 `getTime` 把兩個日期都換成毫秒數，再比較大小。如果現在已經超過截止日，就跳出警告。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 2：活動過期檢查 — 參考答案

```typescript
let deadline = new Date('2026/12/31');
let now = new Date();

if (now.getTime() > deadline.getTime()) {
  alert('警告：活動已過期！');
} else {
  console.log('活動進行中');
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>getTime()</code> 回傳從 1970/1/1 起算的毫秒數，數字越大代表時間越晚；比較日期時先轉成數字最保險
</div>

<!--
我們來看答案。

`getTime` 會把日期轉成一個很大的數字，代表從 1970 年 1 月 1 日到這個時間經過了多少毫秒。時間越晚，數字越大。

所以只要比較兩個數字：現在的毫秒數大於截止日的毫秒數，就代表已經過期。可以把截止日改成過去的日期，測試警告會不會跳出來。
-->

---
layout: default
---

# 補充練習 3：API 商品欄位重組

後端傳來的資料 `backendProducts` 格式如下：

```typescript
let backendProducts = [
  { prod_id: 101, title: '滑鼠' },
  { prod_id: 102, title: '鍵盤' }
];
```

**任務：**

1. 用 `.map()` 建立一個全新的前端專用陣列
2. 重組後的屬性必須改為：`id`（承接 `prod_id`）以及 `name`（承接 `title`）
3. 用 `console.log()` 印出新陣列

<!--
第三題補充練習，模擬串接 API 時最常遇到的情況：後端給的欄位名稱，跟前端想用的不一樣。

請用 `map` 把每一筆商品轉成新的格式，`prod_id` 改叫 `id`，`title` 改叫 `name`。

我們先暫停一下，自己動手試試看。
-->

---
layout: default
---

# 補充練習 3：API 商品欄位重組 — 參考答案

```typescript
let frontendProducts = backendProducts.map((item) => {
  return {
    id: item.prod_id,
    name: item.title
  };
});

console.log(frontendProducts);
// [ { id: 101, name: '滑鼠' }, { id: 102, name: '鍵盤' } ]
```

<!--
我們來看答案。

`map` 會走過陣列的每一筆資料，把每一筆交給小括號裡的方法處理，再把每次 `return` 的結果收集成一個全新的陣列。

這裡每一筆都回傳一個新物件，`id` 拿 `prod_id` 的值，`name` 拿 `title` 的值。原本的 `backendProducts` 不會被改動，新的格式存在 `frontendProducts` 裡。
-->

---
layout: end
---

# TypeScript 練習（二）完成
### 日期、資料重組、方法綜合應用全部掌握！

<!--
這一章我們學了三件事。第一，日期物件：`getMonth` 從 0 開始，顯示時要加 1；比較日期要先用 `getTime` 轉成毫秒數。第二，資料重組：建立新物件，把舊欄位對應到新欄位，陣列就用 `map`。第三，複習了方法的宣告，並學會次方運算子和 `toFixed`。

到這裡，我們已經具備寫前端業務邏輯的基本功了。

下一章，我們回到 Angular，學習用管道 Pipe 來轉換畫面上顯示的資料。我們下一章見。
-->
