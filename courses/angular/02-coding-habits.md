---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Coding 習慣
routeAlias: ch02
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
    Programming Best Practices
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Coding 習慣
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「好的習慣，讓程式開發更快速、維護更輕鬆」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
上一章我們認識了前端的全貌，這一章要聊一個初學者很容易忽略，但非常重要的主題：Coding 習慣。

剛開始寫程式時，很多人覺得只要程式跑得動就好。但在實際工作裡，我們花在「讀」程式碼的時間，遠比「寫」的時間多。習慣不好，兩個月後回頭看自己的程式，可能連自己都看不懂。

學完這一章，我們會知道怎麼寫出乾淨、好讀、好維護的程式碼。
-->

---
layout: default
---

# Outline

- **1. 命名方式** — 清楚命名，讓人一眼看懂
- **2. 檔案放置位置** — 結構統一，方便維護
- **3. 排版** — 整潔排版，提升可讀性
- **4. 註解** — 留下脈絡，方便接手
- **5. 避免重複程式碼** — DRY 原則，減少錯誤

<!--
這一章分成五個習慣，從小到大來看。先從最基本的變數怎麼命名開始，再來是檔案怎麼放、程式碼怎麼排版、註解怎麼寫，最後是避免重複程式碼的 DRY 原則。這五個習慣不會影響程式能不能執行，但會大大影響程式好不好維護。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 1. 命名方式
# Naming Convention

<!--
第一個習慣是命名。好的命名，能讓程式碼自己說明自己在做什麼。
-->

---

# 命名方式

| 原則 | 說明 |
| --- | --- |
| 清楚易懂 | 讓人一眼看出這個變數 / 方法的用途 |
| 避免自創縮寫 | 真的需要縮寫，請加上註解說明 |
| 使用有意義的名稱 | 例如：使用者名稱用 `userName`，不用 `un` |
| 團隊統一風格 | 可根據開發團隊討論決定命名規則 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> 命名不只是自己看，更是讓一起開發與維護的夥伴能一眼看清楚這是什麼東西。
</div>

<!--
命名的核心原則只有一個：「不要讓人猜」。

想像我們走進別人家的廚房，發現每個調味罐上都沒有寫名字，只貼著「白色粉末 A」、「液體 B」。這樣我們根本不敢拿來做菜。

程式也是一樣。如果把使用者名稱取名叫 `un`，密碼叫 `pw`，就跟貼「粉末 A」的標籤沒兩樣。表格裡的原則都是同一件事：名稱要清楚，避免自創縮寫，真的要縮寫就加上註解。

很多人為了少打幾個字而用縮寫，結果之後要花更多時間去猜它代表什麼。另外，命名規則最好跟團隊一起討論，大家統一風格。
-->

---

# 命名方式 — 範例

```typescript
// ❌ 不好的命名：縮寫不明，難以理解
let un = "Allen";
let pw = "123456";
function calc(a: number, b: number) { return a + b; }

// ✅ 好的命名：清楚表達用途
let userName = "Allen";
let password = "123456";
function calculateTotal(price: number, tax: number) { return price + tax; }
```

<!--
我們來對比一下好的命名和不好的命名。

上半部是不好的寫法。`un` 到底是 userName 還是別的意思？`calc` 這個函式又在算什麼？光看名字完全猜不出來。

下半部改成 `userName`、`password` 和 `calculateTotal`，就算不看函式內容，也能猜到它是在計算總金額。

注意這些名稱的寫法：第一個單字小寫，後面每個單字的字首大寫，像 `userName` 這樣，這叫做「小駝峰命名法」，英文是 camelCase。在 TypeScript 裡，變數和函式通常都用這種寫法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 2. 檔案放置位置
# File Structure / Layout

<!--
名稱取好之後，接下來我們看專案裡的檔案該怎麼擺放。
-->

---

# 檔案放置位置

| 原則 | 說明 |
| --- | --- |
| 分類放置 | 同類型檔案放在對應資料夾中 |
| 統一結構（Layout） | 專案裡有許多檔案，需統一擺放規則 |
| 範例 | RESTful API 相關檔案放在 `api/` 資料夾 |
| 以團隊為主 | 以團隊開發的便利性為主，統一討論決定 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>為什麼重要：</b> 若每個人隨意擺放，維護時極高機率找不到檔案或少修改某隻檔案，導致系統出現問題。
</div>

<!--
檔案擺放，其實就跟整理房間一樣。

衣服放衣櫃、碗盤放廚房、鞋子放玄關，生活就會很有條理。但如果把襪子塞進冰箱、把叉子放在鞋櫃，要找東西的時候一定很痛苦。

專案也是這樣。一個專案裡有 HTML、CSS、圖片、API 相關的檔案，每一類都應該放在對應的資料夾，例如跟 API 有關的檔案就統一放在 `api` 資料夾。

如果每個人隨意擺放，維護時很容易找不到檔案，甚至漏改某個檔案，導致系統出問題。所以在團隊開發裡，統一的擺放規則比個人喜好更重要。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 3. 排版
# Code Formatting

<!--
第三個習慣是排版。同樣的程式，排版好不好，讀起來的感受差很多。
-->

---

# 排版 — 未整理的程式碼

```c
int main() {printf("Hello World");
return 0;}
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
❌ <b>難以閱讀：</b> 程式碼擠在一起，沒有縮排，除錯與維護時容易出錯。
</div>

<!--
我們先看這段沒有整理過的程式碼。

所有內容擠在一起，沒有換行，也沒有縮排。就像一篇沒有分段、沒有標點符號的文章，雖然電腦還是能執行，但人讀起來非常吃力。

程式越大，這個問題就越嚴重，除錯和維護時也更容易看錯。不要覺得電腦看得懂就沒關係，程式碼是寫給隊友，也是寫給未來的自己看的。
-->

---

# 排版 — 整理後的程式碼

```c
int main() {
    printf("Hello World");
    return 0;
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>易於閱讀：</b> 縮排清楚、結構分明，維護與除錯都更方便。程式越大，良好排版的重要性越高。
</div>

<!--
再看整理過後的版本，是不是清楚很多？

每一行只做一件事，大括號裡面的內容往右縮排一層，這叫做「縮排」。一層包一層，程式的結構一眼就看得出來。

好消息是，我們不需要手動一格一格調整。實際開發時，我們會安裝像 `Prettier` 這樣的格式化工具，存檔的時候就會自動把程式碼排整齊。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 4. 註解
# Code Comments

<!--
第四個習慣是註解，也就是我們留在程式碼裡的便利貼。
-->

---

# 註解的用途

| 用途 | 說明 |
| --- | --- |
| 程式出處 | 記錄這段程式碼的來源或背景 |
| 待處理問題 | 開發中尚未解決的 TODO 事項 |
| 參考資料 | 記錄參考的文件或網址 |
| 開發者資訊 | 誰開發了哪段程式碼與開發日期 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 註解要讓所有人都能理解，而不是只有自己看得懂，否則就失去了寫註解的意義。
</div>

<!--
寫註解最重要的原則是：「不要寫廢話」。

如果寫 `let age = 18`，後面再註解「宣告年齡為 18」，這就像在香蕉上貼一張「這是香蕉」的標籤，沒有提供任何新資訊。

好的註解要記錄的是程式碼本身看不出來的東西。表格列出了常見的用途：這段程式的出處、還沒處理完的待辦事項、參考的文件，以及開發者和日期。

最後要注意，註解要讓所有人都看得懂，不是只有自己懂，否則就失去了寫註解的意義。
-->

---

# 註解 — 範例

```typescript
// TODO: 待串接後端 API，目前先回傳假資料 (Allen, 2024-01-15)
getUserList(): User[] {
  return mockUsers;
}

// 參考：Angular 官方文件 https://angular.io/guide/http
// 此方法負責處理 HTTP 錯誤回應
handleError(error: HttpErrorResponse): Observable<never> {
  console.error('API Error:', error.message);
  return throwError(() => error);
}
```

<!--
我們來看兩個實際開發中常見的註解。

第一個用了 `TODO` 標記，告訴大家這裡目前是假資料，之後要換成真正的 API。很多編輯器會把 TODO 特別標示出來，避免大家忘記。後面括號裡還記錄了開發者和日期。

第二個附上了 Angular 官方文件的連結，並說明這個方法負責處理 HTTP 錯誤。之後如果這段程式出問題，接手的人可以直接點連結查資料，不用從頭摸索。

這兩種註解，都是在幫未來接手的人省時間。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 5. 避免重複程式碼
# DRY Principle

<!--
最後一個習慣，也是最重要的一個：避免重複的程式碼。
-->

---

# 避免重複程式碼 — 問題

當相同（或 8～9 成相似）的程式碼出現在多個地方，代表程式碼不健康。

```typescript
// ❌ 複製貼上：每個地方都有相同邏輯
calculatePriceA() { const tax = price * 0.05; return price + tax; }
calculatePriceB() { const tax = price * 0.05; return price + tax; }
calculatePriceC() { const tax = price * 0.05; return price + tax; }
```

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
❌ <b>問題：</b> 若邏輯有誤或需要修改，需要同時改多個地方，很容易遺漏，導致系統出現問題。
</div>

<!--
這個原則叫做 DRY，是 Don't Repeat Yourself 的縮寫，意思是「不要重複你自己」。

想像我們為了提醒家人買牛奶，在客廳、廚房、浴室各貼了一張便利貼。後來牛奶已經買了，就得跑三個地方把便利貼撕掉，漏撕一張，就可能有人又跑去買一次。

程式也是一樣。畫面上的三個方法，都寫了一模一樣的算稅邏輯。如果稅率從百分之五改成百分之十，就得改三個地方，漏掉一個，計算結果就會出錯。

當相同或八九成相似的程式碼出現在好幾個地方，就是一個警訊。
-->

---

# 避免重複程式碼 — 解法

發現相同邏輯時，將其提取為**共用方法**，各處呼叫即可。

```typescript
// ✅ 提取為共用方法
calculateTax(price: number): number {
  return price * 0.05;
}

// 各處呼叫共用方法
calculatePriceA(price: number) { return price + this.calculateTax(price); }
calculatePriceB(price: number) { return price + this.calculateTax(price); }
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>DRY 原則：</b> Don't Repeat Yourself — 只需修改一處，所有地方同步更新，大幅降低出錯機率。
</div>

<!--
解決方法是把重複的邏輯抽出來，做成一個共用的方法。

這裡我們建立一個 `calculateTax`，專門負責計算稅金。A 和 B 兩個方法需要算稅時，都去呼叫 `this.calculateTax`，不用各自再寫一次。

這樣一來，如果稅率改了，只要修改 `calculateTax` 這一個地方，所有呼叫它的地方都會同步更新。

就像社區的廣播系統，只要在廣播室講一次，全社區都聽得到，不用一家一家去敲門通知。
-->

---
layout: end
---

# 課程結束
### 養成好習慣，寫出易讀、易維護的程式碼！

<!--
這一章我們整理了五個 Coding 習慣：命名要清楚、檔案要分類擺放、排版要整齊、註解要寫有用的資訊，以及用 DRY 原則避免重複的程式碼。

這些習慣不會影響程式能不能執行，但會決定程式碼好不好讀、好不好維護。從現在開始養成，之後會輕鬆很多。

下一章，我們要正式認識 Angular。我們下一章見。
-->
