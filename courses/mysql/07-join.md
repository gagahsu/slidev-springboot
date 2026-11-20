---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: JOIN 合併查詢
routeAlias: ch07
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
    MySQL 資料庫課程
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    JOIN 合併查詢
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「把分散在不同表的資料，合在一起看」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第七章：JOIN 合併查詢。

前幾章我們把顧客、訂單、商品拆進不同的表。可是想看「誰買了什麼」，資料卻分散在好幾張表裡。

這就是 JOIN 要解決的事。「JOIN 的作用，就是把兩張或多張有關聯的資料表，根據共同欄位合併成一張結果。」學完這章，大家就能用一個查詢，把分散的資料合在一起看。
-->

---
layout: default
---

# Outline

- **什麼是 JOIN？** — JOIN 的概念與使用場景
- **INNER JOIN** — 只回傳兩表都有的資料
- **LEFT JOIN** — 保留左表所有資料
- **RIGHT JOIN** — 保留右表所有資料

<!--
這一章會介紹三種 JOIN。先學最常用的 INNER JOIN 和 LEFT JOIN，這兩個學會了，最後的 RIGHT JOIN 就很好理解。

整章都會用同一組顧客和訂單資料，讓大家清楚看到每種 JOIN 的差別。
-->

---

# 範例資料表

本章使用顧客與訂單系統作為範例：

```sql
CREATE TABLE customers (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE orders (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  amount      DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

| customers | | orders | |
| --- | --- | --- | --- |
| id=1, Alice | | id=1, customer_id=1, $500 | |
| id=2, Bob | | id=2, customer_id=1, $300 | |
| id=3, Carol（無訂單）| | id=3, customer_id=NULL, $100（未知顧客）| |

<!--
這是整章範例的資料基礎，有兩張表：顧客表 `customers` 和訂單表 `orders`，訂單用 `customer_id` 指向顧客。

顧客有三位：Alice、Bob、Carol。訂單有三筆，前兩筆都是 Alice 的，第三筆的 `customer_id` 是 NULL，代表不知道是誰下的。

這組資料是刻意設計的，有兩個特別的地方要記住。第一，有顧客沒有任何訂單。第二，有一筆訂單找不到對應的顧客。

接下來每一種 JOIN，差別就在於怎麼處理這兩種「對不上」的資料。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第一部分
# INNER JOIN

<!--
我們從最常用的 INNER JOIN 開始。先說結論：它只保留兩張表都對得上的資料。
-->

---

# 什麼是 INNER JOIN？

「INNER JOIN 只回傳在兩張表中都能找到對應資料的列。如果某一邊沒有對應，就不出現在結果裡。」

用集合圖來理解：

- 左圓 = customers 表
- 右圓 = orders 表
- **INNER JOIN = 只取交集的部分**

| 結果 | 說明 |
| --- | --- |
| Alice 的訂單 ✅ | customers.id = orders.customer_id = 1 |
| Bob 的訂單 ❌ | Bob 沒有訂單，不出現在結果 |
| Carol ❌ | Carol 沒有訂單，不出現在結果 |
| customer_id=NULL 訂單 ❌ | 找不到對應顧客，不出現在結果 |

<!--
「INNER JOIN 只回傳在兩張表中都能找到對應資料的列。如果某一邊沒有對應，就不出現在結果裡。」

我們可以想像兩個圓，左邊是顧客，右邊是訂單。INNER JOIN 只取兩個圓重疊的那一塊，也就是交集。

套進我們的資料，只有 Alice 兩邊都有，顧客表有她，訂單表也有她的訂單，所以只有 Alice 會出現。

表格裡也標出了其他人。Bob 和 Carol 在顧客表裡，但沒有訂單，所以不會出現。那筆 `customer_id` 是 NULL 的訂單，找不到對應的顧客，也不會出現。

記住一句話就好：「兩邊都有才保留。」
-->

---

# INNER JOIN 的語法結構

```sql
SELECT column_list
FROM table1
INNER JOIN table2 ON table1.column = table2.column
[WHERE ...]
[ORDER BY ...];
```

查詢每筆訂單對應的顧客姓名：

```sql
SELECT
  c.name       AS customer_name,
  o.id         AS order_id,
  o.amount     AS order_amount
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
ORDER BY c.name, o.id;
```

執行後，你會看到 Alice 的兩筆訂單（$500 和 $300）。Bob 和 Carol 不在結果中，customer_id=NULL 的訂單也不在。

<!--
上面是 INNER JOIN 的語法結構，`FROM` 接第一張表，`INNER JOIN` 接第二張表，`ON` 後面寫兩張表怎麼對應。

下面的範例要查出每筆訂單和下單顧客的姓名。

第一個重點是別名。`FROM customers c` 讓 c 代表顧客表，o 代表訂單表，SQL 會簡潔很多。

第二個重點是 `ON c.id = o.customer_id`，意思是顧客的 id 要等於訂單裡的 customer_id，兩筆資料才算對上。

另外，SELECT 的欄位前面都加了表的別名。兩張表都有 `id` 欄位，不加的話，MySQL 不知道我們要哪一張的。

執行後，會看到 Alice 的兩筆訂單，五百元和三百元。Bob、Carol 和那筆不明訂單都不會出現。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第二部分
# LEFT JOIN

<!--
接下來是 LEFT JOIN，實務上用得非常多，特別是需要保留某張表所有資料的時候。
-->

---

# 什麼是 LEFT JOIN？

「LEFT JOIN 保留左表（FROM 後面那張）的所有列，右表沒有對應的地方填入 NULL。」

用集合圖來理解：

- **LEFT JOIN = 左圓全部 + 交集**（右邊沒有的補 NULL）

| 結果 | 說明 |
| --- | --- |
| Alice 的訂單 ✅ | 正常對應 |
| Bob — NULL, NULL ✅ | Bob 在左表，右表沒有訂單，amount 填 NULL |
| Carol — NULL, NULL ✅ | Carol 在左表，右表沒有訂單，amount 填 NULL |
| customer_id=NULL 訂單 ❌ | 這筆在右表，LEFT JOIN 不從右表多取 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>最常見的用途：</b>找出「沒有 XXX 的 YYY」，例如「找出從未下過訂單的顧客」。
</div>

<!--
「LEFT JOIN 保留左表的所有列，右表沒有對應的地方填入 NULL。」左表指的是寫在 FROM 後面的那一張。

用兩個圓來看，LEFT JOIN 是整個左圓，包含交集的部分。

套進資料，以顧客為左表。Alice 有訂單，正常顯示。Bob 和 Carol 沒有訂單，但他們還是會出現在結果裡，只是訂單編號和金額都是 NULL。至於那筆不明訂單，它在右表，LEFT JOIN 不會多取，所以不會出現。

它最常見的用途，就是找出「沒有某樣東西」的資料，例如從來沒下過訂單的顧客。下一頁我們來看怎麼寫。
-->

---

# LEFT JOIN 的語法與範例

```sql
-- 查詢所有顧客（含沒有訂單的），顯示訂單金額
SELECT
  c.name       AS customer_name,
  o.id         AS order_id,
  o.amount     AS order_amount
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
ORDER BY c.name;
```

找出從未下訂單的顧客：

```sql
SELECT c.name AS customer_name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
```

執行後，你會看到 Bob 和 Carol——他們在 customers 表裡，但 orders 表裡沒有他們的訂單。

<!--
這頁有兩個 LEFT JOIN 最常用的寫法。

第一段是完整的 LEFT JOIN。執行後，三位顧客都會出現，Alice 有兩筆訂單金額，Bob 和 Carol 的訂單欄位則是 NULL。

第二段是一個非常實用的技巧，LEFT JOIN 再加上 `WHERE o.id IS NULL`。原理是這樣的，LEFT JOIN 之後，沒有訂單的顧客，訂單欄位都是 NULL。我們只要把這些列留下來，剩下的就是沒有下過訂單的顧客。執行後會得到 Bob 和 Carol。

這個寫法的應用很廣，像是找出沒有上傳大頭貼的使用者、從來沒被借過的書。

要注意，IS NULL 要判斷的是右表的欄位，判斷左表的欄位就找不到了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第三部分
# RIGHT JOIN

<!--
接下來是 RIGHT JOIN。它其實就是 LEFT JOIN 的鏡像，改成保留右表的全部資料。
-->

---

# RIGHT JOIN — 保留右表所有資料

「RIGHT JOIN 保留右表（JOIN 後面那張）的所有列，左表沒有對應的地方填入 NULL。」

```sql
-- 查詢所有訂單（含顧客不明的），顯示顧客姓名
SELECT
  c.name       AS customer_name,
  o.id         AS order_id,
  o.amount     AS order_amount
FROM customers c
RIGHT JOIN orders o ON c.id = o.customer_id
ORDER BY o.id;
```

| 結果 | 說明 |
| --- | --- |
| Alice — 訂單 #1, $500 ✅ | 正常對應 |
| Alice — 訂單 #2, $300 ✅ | 正常對應 |
| NULL — 訂單 #3, $100 ✅ | 右表有訂單，但左表沒有對應顧客，name 填 NULL |
| Bob, Carol ❌ | 他們在左表，RIGHT JOIN 不從左表多取 |

<!--
「RIGHT JOIN 保留右表的所有列，左表沒有對應的地方填入 NULL。」右表指的是寫在 JOIN 後面的那一張。

這段查詢以訂單為右表，所以所有訂單都會保留。執行後，Alice 的兩筆訂單正常顯示。第三筆訂單也會出現，但因為找不到顧客，顧客姓名是 NULL。Bob 和 Carol 在左表，沒有訂單，就不會出現。

實務上，RIGHT JOIN 比較少人用。只要把兩張表的位置交換，寫成 `FROM orders` 再 LEFT JOIN 顧客表，結果就完全一樣。

大多數工程師習慣用 LEFT JOIN，因為從左往右讀比較直覺，整個專案統一用一種寫法，也比較好維護。
-->

---

# JOIN 類型總結

| JOIN 類型 | 結果 | 使用時機 |
| --- | --- | --- |
| `INNER JOIN` | 兩表都有對應才保留 | 只需要有關聯的資料 |
| `LEFT JOIN` | 左表全保留，右表補 NULL | 保留左表所有資料，右表可能沒有 |
| `RIGHT JOIN` | 右表全保留，左表補 NULL | 保留右表所有資料（較少用）|

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>最常用的組合：</b>90% 的場景用 INNER JOIN 或 LEFT JOIN 就夠了。RIGHT JOIN 都可以改寫成 LEFT JOIN。
</div>

<!--
這張表把三種 JOIN 整理在一起。

實務上，九成的情況用 INNER JOIN 或 LEFT JOIN 就夠了。只需要有關聯的資料，例如訂單和下單顧客，就用 INNER JOIN。需要保留某一邊的全部資料，另一邊可能沒有對應，例如列出所有顧客，包含沒下過單的，就用 LEFT JOIN。

可以記住一個原則：「從哪張表出發，就把那張表放在 LEFT JOIN 的左邊。」
-->

---

# 總結

本章學了 JOIN 合併查詢的三種類型：

- **INNER JOIN** — 取兩表的交集，兩邊都有才出現
- **LEFT JOIN** — 保留左表所有資料，右表沒有的補 NULL；可搭配 `IS NULL` 找「不存在關聯」的記錄
- **RIGHT JOIN** — 保留右表所有資料（可改寫為 LEFT JOIN）
- **別名** — 多表查詢時，用 `c.name`、`o.id` 標明欄位來自哪張表

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
🚀 <b>下一章：</b>我們將學習 Index 索引，了解如何讓查詢跑得更快！
</div>

<!--
我們整理一下這一章。INNER JOIN 取交集，兩邊都有才出現。LEFT JOIN 保留左表全部，右表沒有的補 NULL，搭配 IS NULL 就能找出沒有關聯的資料。RIGHT JOIN 可以改寫成 LEFT JOIN。多表查詢時，記得用別名標明每個欄位來自哪張表。

接下來，我們用兩題練習把這些寫法練熟。
-->

---
layout: default
---

# 練習 1：任務說明
### 轉角咖啡：菜單頁的 JOIN

使用 `corner_cafe` 資料庫（<a href="/downloads/corner_cafe/schema.sql" download><code>schema.sql</code></a> + <a href="/downloads/corner_cafe/seed.sql" download><code>seed.sql</code></a>）。網站的菜單要顯示分類名稱，後台還要檢查分類有沒有內容：

**任務：**
1. 列出供應中的菜單：分類名稱、品項名稱、價格，依分類的排序、再依品項的排序（INNER JOIN）
2. 找出**還沒有任何品項**的分類（LEFT JOIN + IS NULL）
3. 「甜點」分類的所有品項（含暫停供應），顯示名稱、價格、是否供應，依品項排序

<!--
第一題就是網站菜單背後的查詢。`products` 只存了分類的編號，畫面上要顯示的是分類名稱，所以要和 `categories` JOIN。

第二題，老闆新增了一個分類，但還沒放品項。這種「左邊有、右邊沒有」的資料，要用 LEFT JOIN 找。

第三題要用分類名稱篩選，同樣需要 JOIN。

思考一下，第二題如果用 INNER JOIN，查得出來嗎？

我們先暫停一下，自己動手寫寫看。

【講師】給大家十分鐘，可以先請同學說說每一題的左表應該是誰。
-->

---
layout: default
---

# 練習 1：解題提示

```sql
-- 1. 供應中的菜單
SELECT c.name AS category, p.name, p.price
FROM products p
  INNER JOIN categories c ON p.category_id = c.id
WHERE p.available = 1
ORDER BY c.sort_order, p.sort_order;

-- 2. 沒有任何品項的分類
SELECT c.id, c.name
FROM categories c
  LEFT JOIN products p ON p.category_id = c.id
WHERE p.id IS NULL;

-- 3. 甜點分類的所有品項
SELECT p.name, p.price, p.available
FROM categories c
  JOIN products p ON p.category_id = c.id
WHERE c.name = '甜點'
ORDER BY p.sort_order;
```

<!--
第一題，INNER JOIN 只留下兩邊都對得上的資料。排序用的是分類的 `sort_order`，這樣咖啡會排在茶飲前面，跟網站上的順序一樣。結果有十一個品項，季節水果塔暫停供應，所以沒有出現。

第二題回答剛才的思考題。INNER JOIN 會把沒有品項的分類直接丟掉，所以查不出來。LEFT JOIN 會保留左邊所有的分類，右邊對不上的就填 NULL，再用 `p.id IS NULL` 找出來。結果是「季節限定」，老闆下個月才要上新品。

第三題，甜點有三個品項：原味司康、巴斯克乳酪，以及暫停供應的季節水果塔，它的 `available` 是 0。
-->

---
layout: default
---

# 練習 2：任務說明
### 轉角咖啡：分類統計

**任務：**
1. 列出每個分類的品項數，**沒有品項的分類也要出現**，數量顯示 0，依分類排序
2. 改成只算「供應中」的品項，**沒有供應中品項的分類一樣要出現**
3. 列出每個分類供應中品項的最低價與最高價，沒有品項的分類顯示 NULL

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b>要計算次數時，<code>COUNT(*)</code> 和 <code>COUNT(欄位)</code> 的結果一樣嗎？「只算供應中」的條件，放在 <code>WHERE</code> 和放在 <code>ON</code>，結果一樣嗎？
</div>

<!--
第二題是後台的分類統計，三小題都要讓沒有品項的分類也出現，所以都是 LEFT JOIN 加上 GROUP BY。

這一題藏了兩個常見的陷阱，提示裡已經寫出來了：COUNT 星號和 COUNT 欄位一不一樣？條件放在 WHERE 和放在 ON，又一不一樣？

請大家實際執行看看，比較結果。

【講師】給大家十分鐘，這兩個陷阱很適合讓同學先自己踩一次。
-->

---
layout: default
---

# 練習 2：解題提示

```sql
-- 1. COUNT(p.id) 不算 NULL，空分類才會是 0
SELECT c.name, COUNT(p.id) AS cnt
FROM categories c
  LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id, c.name
ORDER BY c.sort_order;
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>陷阱一：</b>寫成 <code>COUNT(*)</code>，「季節限定」會顯示 <b>1</b>。LEFT JOIN 幫它補了一列全是 NULL 的資料，<code>COUNT(*)</code> 也把這一列算進去；<code>COUNT(p.id)</code> 不算 NULL，才是正確的 0。
</div>

<!--
第一題，用 LEFT JOIN 保留所有分類，再依分類分組計數。結果是咖啡四項、茶飲三項、甜點三項、輕食兩項、季節限定零項。

這裡是第一個陷阱。如果寫成 COUNT 星號，季節限定會變成一。因為 LEFT JOIN 幫它補了一列全是 NULL 的資料，COUNT 星號只看「有幾列」，就把這一列也算進去了。COUNT 欄位會跳過 NULL，所以要數右表的欄位，例如 `p.id`。
-->

---
layout: default
---

# 練習 2：解題提示（續）

```sql
-- 2. 條件放在 ON：先篩選右表，再保留左表
SELECT c.name, COUNT(p.id) AS cnt
FROM categories c
  LEFT JOIN products p ON p.category_id = c.id AND p.available = 1
GROUP BY c.id, c.name
ORDER BY c.sort_order;

-- 3. 最低價與最高價
SELECT c.name, MIN(p.price) AS min_price, MAX(p.price) AS max_price
FROM categories c
  LEFT JOIN products p ON p.category_id = c.id AND p.available = 1
GROUP BY c.id, c.name
ORDER BY c.sort_order;
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>陷阱二：</b>寫成 <code>WHERE p.available = 1</code>，「季節限定」會整列消失。補出來的 NULL 不等於 1，被 WHERE 篩掉，LEFT JOIN 就變得跟 INNER JOIN 一樣。
</div>

<!--
第二題是第二個陷阱。如果把 `p.available = 1` 寫在 WHERE，季節限定整列會消失。因為 WHERE 在 JOIN 之後才執行，補出來的那一列 `available` 是 NULL，不等於一，就被篩掉了。

條件放在 ON，意思是「JOIN 的時候只找供應中的品項」，找不到的分類還是會被保留下來。結果是咖啡四項、茶飲三項、甜點兩項、輕食兩項、季節限定零項。甜點少了暫停供應的季節水果塔。

第三題用同樣的寫法，季節限定沒有品項，最低價和最高價都是 NULL。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天我們學了三種 JOIN，最重要的是 INNER JOIN 和 LEFT JOIN。記住一句話：「INNER JOIN 只取交集，LEFT JOIN 保留左表全部。」再加上 LEFT JOIN 配 IS NULL 的技巧，就能處理大部分的合併查詢。

不過 JOIN 的表一多、資料一大，查詢就可能變慢。下一章，我們要學索引，看看怎麼讓查詢跑得更快。我們下一章見。

【講師】開放提問，可以請同學用自己的話說明 INNER JOIN 和 LEFT JOIN 的差別。
-->
