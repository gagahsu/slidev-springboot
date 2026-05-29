---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 結構化的呈現數據—JSON
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
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    結構化的呈現數據—JSON
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓數據說話，用 JSON 清楚傳遞結構化資料」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，今天我們要介紹一個超級重要的概念——JSON。

在之前的章節，我們的 API 都只能回傳純文字字串，像是 "Hello World" 這樣。
但在真實的專案中，我們需要回傳的資料往往複雜得多，比如一個學生的 id、name、成績等等。
這時候，JSON 就是我們最好的朋友。

學完這個章節，大家就能理解 JSON 的格式，以及它如何讓數據呈現變得清晰有條理。
-->

---
layout: default
---

# Outline

- **回顧：到目前為止的返回數據** — 純字串的限制，引出 JSON 的必要性
- **什麼是 JSON？** — 定義、全名由來、用途與特性
- **JSON 格式介紹** — 基本格式、key-value 結構、常見規範
- **JSON 所支援的類型** — Integer、Float、String、Boolean、Array
- **章節總結** — 回到一開始的問題，下一章預告

<!--
這章的結構很清楚。我們先回顧一下目前的情況，看看哪裡有限制，再引出 JSON 的概念和格式，最後回頭解決我們一開始的問題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回顧

## 到目前為止的返回數據

<!--
在正式進入 JSON 之前，讓我們先回顧一下，目前我們的 Spring Boot API 能回傳什麼。
-->

---

# 回顧：到目前為止的返回數據

目前我們的 Controller 只能回傳「字串」：

```java
@RestController
public class MyController {

    @RequestMapping("/test")
    public String test() {
        return "Hello World";
    }
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
❓ <b>思考問題：</b> 如果要回傳一個學生的資料（id、姓名、成績），只用 String 能做到嗎？
</div>

<!--
看這段我們已經熟悉的程式碼。return "Hello World" 是個字串，很簡單。

但現在問大家一個問題：如果後端要回傳一個學生的完整資料，有 id、name、score 三個欄位，我們要怎麼辦？

用字串的話，我們可能會拼出 "id=123,name=Judy,score=95"，但這樣前端要怎麼解析？很麻煩對吧？

這就是為什麼我們需要一個大家都認可的、有結構的資料格式——也就是今天要介紹的 JSON。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 什麼是 JSON？

<!--
好，現在讓我們正式認識 JSON 是什麼。
-->

---

# 什麼是 JSON？

| 項目 | 說明 |
| --- | --- |
| 全名 | JavaScript Object Notation |
| 定義 | 一種「用更簡單、更直覺的方式去呈現數據」的格式 |
| 用途 | 前後端之間傳遞數據的標準格式 |
| 特性 | 輕量、易讀、人與機器都能快速理解 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>補充：</b> JSON 雖然源自 JavaScript，但已成為與語言無關的通用格式。Java、Python、Go 等都能使用。
</div>

<!--
JSON 的全名是 JavaScript Object Notation。

用一句話定義：「JSON 是一種數據呈現的格式，目的是用更簡單、更直覺的方式去呈現數據」。

想像一下，你要寄一份文件給朋友，如果只是把資料全部塞成一行字，對方很難看懂。
但如果你用一個有結構的表格來呈現，比如一列一列地填寫，就清楚多了。
JSON 就是這樣一個讓資料有結構的「表格格式」。

另外補充一下，雖然 JSON 名字裡有 JavaScript，但它早就超出 JavaScript 的範疇，幾乎所有現代程式語言都能讀懂 JSON，包括我們用的 Java。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## JSON 格式介紹

<!--
了解 JSON 是什麼之後，我們來看 JSON 的格式長什麼樣子。
-->

---

# JSON 的基本格式

JSON 用「大括號 `{}` 包住 key-value 組合」來呈現一個物件：

```json
{
    "id": 123,
    "name": "Judy"
}
```

| 組成 | 說明 |
| --- | --- |
| `{}` | 大括號，代表一個物件（Object） |
| `"key"` | 鍵（Key），**必須用雙引號** |
| `value` | 值（Value），類型不同格式不同 |
| `,` | 多個 key-value 之間用逗號分隔 |

<!--
JSON 的基本格式非常直覺。我們用大括號 {} 包住整個物件，裡面用 key-value 的方式填入資料。

注意這裡有一個重要規則：key 必須要加雙引號。這是 JSON 的硬性規定，少了雙引號就不是合法的 JSON 了。

看這個例子，"id" 是 key，123 是 value；"name" 是 key，"Judy" 是 value。
兩個 key-value 之間用逗號隔開。

⚠️ 大家最容易犯的錯誤就是忘記給 key 加雙引號，或是在最後一個 key-value 後面多加一個逗號，這些都會讓 JSON 解析失敗。
-->

---

# JSON 格式規範

| 規則 | 正確 ✅ | 錯誤 ❌ |
| --- | --- | --- |
| Key 必須加雙引號 | `"name": "Judy"` | `name: "Judy"` |
| 字串 Value 加雙引號 | `"name": "Judy"` | `"name": Judy` |
| 數字 Value 不加引號 | `"id": 123` | `"id": "123"` |
| 最後一個不加逗號 | `"name": "Judy"` | `"name": "Judy",` |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 在 JSON 中，所有的 key 都必須加上雙引號，這是硬性規定。
</div>

<!--
這頁整理了 JSON 格式最常見的規範，也是初學者最容易踩到的雷。

第一條：key 一定要雙引號，沒有例外。
第二條：字串類型的 value 也要雙引號。
第三條：數字類型的 value 不加引號，加了就變成字串了。
第四條：最後一個 key-value 後面不能有逗號。

這些規則乍看很多，但實際寫幾次就記住了。而且現在大部分的工具都會幫你驗證 JSON 格式，格式不對直接報錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## JSON 所支援的類型

<!--
了解了基本格式之後，來看看 JSON 支援哪些資料類型。
-->

---

# JSON 所支援的類型

| 類型 | 說明 | 範例 |
| --- | --- | --- |
| 整數（Integer） | 整數數字 | `"id": 123` |
| 浮點數（Float） | 含小數點的數字 | `"score": 1.111` |
| 字串（String） | 文字，需加雙引號 | `"name": "Judy"` |
| 布林值（Boolean） | 真或假 | `"active": true` |
| 陣列（Array） | 用 `[]` 包住多個值 | `"list": [1, 2, 3]` |

<!--
JSON 支援五種基本類型：整數、浮點數、字串、布林值、陣列。

這五種類型幾乎涵蓋了我們在後端開發中最常用到的資料形式。

特別注意陣列（Array）的寫法，用中括號 [] 包住多個值，值之間用逗號分隔。這和 Java 的 ArrayList 概念很像。

接下來我們用一個完整的例子把這五種類型都展示出來。
-->

---

# JSON 類型範例

一個包含所有類型的 JSON 物件：

```json
{
    "id": 123,
    "score": 98.5,
    "name": "Judy",
    "active": true,
    "appleList": ["apple1", "apple2", "apple3"]
}
```

<!--
看這個完整的範例，一次展示了五種類型。

id 是整數，score 是浮點數，name 是字串，active 是布林值，appleList 是陣列。

這樣的結構，前端收到之後就能很清楚地知道每個欄位的類型和值，不需要做額外的字串解析。

⚠️ 再提醒一次：陣列裡如果是字串，每個元素也要加雙引號，像 "apple1" 這樣。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 最後

## 讓我們回到一開始的問題

<!--
學完了 JSON 的格式和類型，讓我們回到一開始的問題：如何回傳一個學生的完整資料？
-->

---

# 回到一開始的問題

**問題：** 如何回傳一個學生的 `id`、`name`、`score`？

**答案：** 用 JSON 格式！

```json
{
    "id": 123,
    "name": "Judy",
    "score": 98.5
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>下一章預告：</b> 我們將學習如何讓 Spring Boot 的 API 自動回傳 JSON 格式的資料！
</div>

<!--
還記得一開始的問題嗎？如果要回傳一個學生的 id、name、score，純字串做不到。

現在我們有了答案：用 JSON！把三個欄位組成一個 JSON 物件，前端就能清楚地拿到結構化的資料。

不過，Spring Boot 要怎麼幫我們產生這個 JSON 呢？這就是下一章「返回值改成 JSON 格式——@RestController」要介紹的內容。

先賣個關子，下一章大家就會看到，其實 Spring Boot 會自動幫我們把 Java 物件轉成 JSON，非常方便！
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| JSON 定義 | 一種簡單、直覺的數據呈現格式，用於前後端傳遞數據 |
| 基本格式 | 用 `{}` 包住 key-value，key 必須加雙引號 |
| 支援類型 | Integer、Float、String、Boolean、Array（`[]`） |
| 核心規則 | Key 必須雙引號、字串 Value 雙引號、數字不加引號 |
| 下一步 | 學習 @RestController 自動將 Java 物件轉成 JSON |

<!--
好，讓我們總結今天學到的東西。

第一，JSON 是一種讓數據結構化的格式，前後端都用它來傳遞資料。
第二，基本格式是大括號包住 key-value，key 一定要雙引號。
第三，JSON 支援五種類型：整數、浮點數、字串、布林值、陣列。
第四，格式規則要記清楚，尤其是雙引號的規定。
第五，下一章我們會看到 Spring Boot 如何自動把 Java 物件轉成 JSON。

今天的概念相對簡單，但非常基礎。JSON 是前後端溝通的語言，務必要熟悉它的格式。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
