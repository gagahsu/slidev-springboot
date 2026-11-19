---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: VIEW 視圖
routeAlias: ch09
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
    VIEW 視圖
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「把複雜的查詢包裝起來，下次直接用」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第九章：VIEW 視圖。

學到這裡，大家已經能寫出很複雜的查詢了。不過同一段複雜的查詢，報表要用、後台也要用，每次都得重寫一遍，改規則時還得到處找。

VIEW 就是為了解決這個問題。它能把一段複雜的查詢包裝起來，取一個名字，下次直接拿來用。學完這章，大家寫出來的 SQL 會更乾淨，也更好維護。
-->

---
layout: default
---

# Outline

- **什麼是 VIEW？** — VIEW 的概念、優點與限制
- **CREATE VIEW 建立視圖** — 基本語法與範例
- **管理 VIEW** — 修改、查看、刪除視圖
- **VIEW 的使用注意事項** — 效能考量

<!--
這一章先認識 VIEW 是什麼，有哪些優點和限制。接著學怎麼建立 VIEW，以及查看、修改、刪除的管理方式。最後看使用 VIEW 時要注意的效能問題。

整章會延續我們熟悉的顧客和訂單範例。
-->

---

# 什麼是 VIEW？

「VIEW（視圖）是一張虛擬的資料表，它的內容由一個 SELECT 查詢定義。VIEW 本身不儲存任何資料，每次查詢 VIEW 時，MySQL 會執行背後的 SELECT。」

| 面向 | 真實資料表（TABLE）| 視圖（VIEW）|
| --- | --- | --- |
| 儲存資料 | ✅ 實際儲存資料 | ❌ 不儲存，每次動態查詢 |
| 可以查詢 | ✅ | ✅ |
| 可以 INSERT/UPDATE | ✅ | ⚠️ 有條件限制（本課程只用來查詢）|
| 用途 | 儲存資料 | 簡化查詢、封裝邏輯、存取控制 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>最佳類比：</b>VIEW 就像 Excel 裡的「參照公式」。你看到的是一個格子的值，但它其實是從別的地方計算來的，不是直接儲存在那個格子裡。
</div>

<!--
「VIEW 是一張虛擬的資料表，它的內容由一個 SELECT 查詢定義。VIEW 本身不儲存任何資料，每次查詢 VIEW 時，MySQL 會執行背後的 SELECT。」

我們用 Excel 來想像。一份試算表裡，有一張工作表放原始資料，另一張工作表全是公式，引用原始資料並整理成報表。那張全是公式的工作表，本身沒存資料，打開時才即時算出結果。VIEW 就是這樣的東西。

表格比較了它和資料表的差別。資料表真的存資料，VIEW 只是一扇窗。兩者都能查詢，但 VIEW 要修改資料會有很多條件限制，所以這門課我們只用它來查詢。
-->

---

# VIEW 的三大優點

| 優點 | 說明 |
| --- | --- |
| **簡化複雜查詢** | 把 JOIN、計算、篩選邏輯封裝起來，使用時只需 `SELECT * FROM view_name` |
| **提升安全性** | 只讓使用者存取 VIEW，不直接暴露底層表結構或敏感欄位 |
| **提高可維護性** | 業務邏輯改變時，只需修改 VIEW 定義，不需要修改所有用到這個查詢的地方 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>VIEW 不是效能工具：</b>每次查詢 VIEW，MySQL 都會執行背後的 SELECT。VIEW 不會讓查詢變快，它只是讓「程式碼」更簡潔。
</div>

<!--
表格列出了 VIEW 的三大優點。

第一是簡化查詢。假設月報表要 JOIN 四張表，還要計算欄位，把它包成 VIEW 之後，報表的 SQL 只剩一行 SELECT，任何人都看得懂。

第二是安全性。顧客表裡可能有電話、信用卡這些敏感資料，我們可以建一個只有編號和姓名的 VIEW，讓客服只能查這個 VIEW。

第三是可維護性。如果「有效訂單」的定義改了，只要修改 VIEW 這一個地方，所有用到它的查詢都會跟著更新。

不過要特別提醒，VIEW 不是效能工具。每次查詢 VIEW，背後的 SELECT 都會重新執行。原本的查詢很慢，包成 VIEW 也一樣慢。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第一部分
# CREATE VIEW — 建立視圖

<!--
接下來我們動手建立 VIEW。語法很簡單，重點是看它在實際場景裡怎麼用。
-->

---

# CREATE VIEW 的語法結構

```sql
CREATE [OR REPLACE] VIEW view_name
  [(column_list)]
AS
  SELECT ...;
```

建立一個「顯示活躍顧客與其訂單總額」的視圖：

```sql
CREATE VIEW customer_order_summary AS
SELECT
  c.id          AS customer_id,
  c.name        AS customer_name,
  COUNT(o.id)   AS order_count,
  SUM(o.amount) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE c.is_active = 1
GROUP BY c.id, c.name;
```

<!--
上面是 VIEW 的語法結構，其實就是在 SELECT 前面加上 `CREATE VIEW` 名稱 `AS`。方括號裡的 `OR REPLACE` 是選用的，如果 VIEW 已經存在，就直接覆蓋，不用先刪除再建立。

下面的範例建立了一個叫 `customer_order_summary` 的 VIEW，要做的是統計每位有效顧客的訂單數和消費總額。

它的內容大家應該很熟悉，用 LEFT JOIN 把顧客和訂單接起來，篩選有效顧客，再依顧客分組，算出訂單數和總金額。用 LEFT JOIN 是為了讓沒下過單的顧客也會出現。

執行後，資料庫裡就多了一張虛擬表。之後想查顧客的消費摘要，不用再寫這整段 JOIN 加分組，直接查這個 VIEW 就可以了。
-->

---

# 查詢 VIEW

建立 VIEW 後，就像查詢一般資料表一樣使用它：

```sql
-- 查詢 VIEW 的所有資料
SELECT * FROM customer_order_summary;

-- 對 VIEW 加入額外篩選條件
SELECT customer_name, total_spent
FROM customer_order_summary
WHERE total_spent > 10000
ORDER BY total_spent DESC;

-- VIEW 也可以和其他表 JOIN
SELECT v.customer_name, v.total_spent, a.city
FROM customer_order_summary v
JOIN addresses a ON v.customer_id = a.customer_id;
```

<!--
VIEW 建好之後，用起來就跟一般的資料表一樣。

第一個查詢直接 `SELECT *`，執行後會列出所有有效顧客的訂單數和消費總額。

第二個查詢在 VIEW 上再加條件，篩選消費超過一萬元的顧客，並依金額由高到低排列。這個 WHERE 是對 VIEW 的結果做篩選，不會改變 VIEW 本身的定義。

第三個查詢把 VIEW 跟地址表 `addresses` JOIN 起來，取得顧客所在的城市。

使用 VIEW 的人，完全不需要知道它背後是怎麼寫的。這就是封裝的好處，複雜的邏輯藏起來，留下簡單好用的介面。
-->

---

# 另一個 VIEW 範例：安全性控制

只暴露必要的欄位，隱藏敏感資訊：

```sql
-- 原始 customers 表有敏感欄位
-- customers (id, name, email, phone, credit_card_hash, address)

-- 建立一個對外安全的 VIEW
CREATE VIEW public_customers AS
SELECT
  id,
  name,
  CONCAT(LEFT(email, 3), '***@***.com') AS masked_email
FROM customers
WHERE is_active = 1;
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>實際用途：</b>給客服系統只開放 VIEW 的查詢權限，他們能查詢到客戶資訊，但看不到完整的 email 和信用卡資料。
</div>

<!--
這個範例示範 VIEW 的另一個用途，就是保護敏感資料。

原本的顧客表裡有 email、電話、信用卡資料這些敏感欄位。我們建立一個叫 `public_customers` 的 VIEW，只放顧客編號和姓名，email 則做遮罩。`LEFT(email, 3)` 取出前三個字元，`CONCAT` 再接上一串星號，把後面蓋住。

接著用 MySQL 的權限設定，讓客服系統的帳號只能查詢這個 VIEW，不能直接碰原本的顧客表。這樣客服查得到需要的資訊，卻看不到完整的 email 和信用卡資料。

這裡有個常見的坑。有些資料庫用兩條直線串接字串，但在 MySQL 裡，兩條直線預設是邏輯的 OR，所以串接字串一定要用 `CONCAT`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第二部分
# 管理 VIEW

<!--
VIEW 建立之後，還需要查看、修改和刪除。我們來看管理的方式。
-->

---

# 查看與修改 VIEW

```sql
-- 查看資料庫中所有的 VIEW
SHOW FULL TABLES WHERE Table_type = 'VIEW';

-- 查看 VIEW 的定義
SHOW CREATE VIEW customer_order_summary;

-- 修改 VIEW（使用 OR REPLACE 直接覆蓋）
CREATE OR REPLACE VIEW customer_order_summary AS
SELECT
  c.id          AS customer_id,
  c.name        AS customer_name,
  c.email,
  COUNT(o.id)   AS order_count,
  SUM(o.amount) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE c.is_active = 1
GROUP BY c.id, c.name, c.email;

-- 刪除 VIEW
DROP VIEW IF EXISTS customer_order_summary;
```

<!--
管理 VIEW 的語法，跟管理資料表很像。

第一行 `SHOW FULL TABLES`，加上類型等於 VIEW 的條件，就能只列出資料庫裡所有的 VIEW。資料表一多的時候，這個很好用。第二行 `SHOW CREATE VIEW` 會顯示這個 VIEW 完整的定義內容。

要修改 VIEW，最簡單的方法是 `CREATE OR REPLACE VIEW`。範例在原本的定義裡多加了 email 欄位，執行後就直接覆蓋掉舊的版本。要注意 GROUP BY 也要跟著加上 email。

最後是 `DROP VIEW IF EXISTS`，用來刪除 VIEW。

刪除 VIEW 不會影響底層的資料表。我們只是拆掉了這扇窗，窗外的資料都還在。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 第三部分
# 使用 VIEW 的注意事項

<!--
VIEW 用起來很方便，但它不是萬能的。最後我們來看使用時要注意的效能問題。
-->

---

# VIEW 的效能考量

VIEW 讓程式碼更乾淨，但要注意效能問題：

| 情境 | 說明 |
| --- | --- |
| VIEW 是簡單查詢 | 效能和直接查詢相同 |
| VIEW 包含複雜 JOIN | 每次查詢都重新執行 JOIN，無快取 |
| VIEW 套 VIEW | 巢狀 VIEW 效能差，盡量避免 |

```sql
-- 避免：對複雜 VIEW 再次做複雜查詢
SELECT * FROM complex_view WHERE col IN (
  SELECT id FROM another_view WHERE ...
);

-- 建議：直接查詢底層表，使用正確的索引
SELECT ... FROM base_table1 JOIN base_table2 ...
WHERE ... AND ...;
```

<!--
最後來看效能。VIEW 讓程式碼變乾淨，但有一個陷阱：它不儲存資料，也不會快取結果。

所以表格第二列提到，如果 VIEW 背後是四張表的 JOIN，每次查詢都會重新執行一次這個 JOIN，資料量大時就可能很慢。

特別要避免的是 VIEW 套 VIEW，也就是一個 VIEW 建立在另一個 VIEW 上，一層套一層。MySQL 要全部展開才能執行，效能很難掌握。程式碼裡的對照，就是建議這種情況直接查詢底層表，搭配上一章學的索引。
-->

---

# 總結

本章學了 VIEW 視圖的核心概念：

- **VIEW 是什麼** — 虛擬資料表，背後是 SELECT 查詢，不儲存資料
- **三大優點** — 簡化複雜查詢、提升安全性（欄位遮罩）、提高可維護性
- **CREATE VIEW** — `CREATE [OR REPLACE] VIEW name AS SELECT ...`
- **查看與管理** — `SHOW FULL TABLES`、`SHOW CREATE VIEW`、`DROP VIEW`
- **效能注意** — VIEW 不快取結果，複雜 VIEW + 大資料量可能很慢

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
🚀 <b>下一章：</b>我們將學習子查詢，把一個查詢的結果，當成另一個查詢的條件！
</div>

<!--
我們整理這一章。VIEW 是一張虛擬資料表，背後是一個 SELECT，本身不存資料。它有三大優點：簡化查詢、保護敏感資料、集中管理業務邏輯。我們學了用 `CREATE OR REPLACE VIEW` 建立和修改，用 `SHOW` 查看，用 `DROP VIEW` 刪除。

最後要記得，VIEW 不會讓查詢變快，也要避免一層套一層。

接下來，我們用兩題練習把 VIEW 練熟。
-->

---
layout: default
---

# 練習 1：任務說明
### 把「訂單摘要」與「每日營業額」封裝成 VIEW

後台的訂單列表和營運摘要，每次都要 JOIN、算狀態、加總金額，寫起來很長。請在 `cafe_shop` 用 VIEW 封裝：

**任務：**
1. 建立 `order_summary_view`：訂單 `id`、`order_no`、會員姓名、中文狀態（待付款 / 已付款 / 已出貨 / 已完成 / 已取消）、商品件數、`total_amount`、`created_at`
2. 建立 `daily_sales_view`：每天的訂單數與營業額，**只算已付款、已出貨、已完成**的訂單
3. 用 `daily_sales_view` 找出近 7 天（含今天）營業額最高的 3 天

<!--
第一題，我們把後台常用的兩個查詢封裝成 VIEW。先執行 `sql/cafe_shop/schema.sql` 和 `seed.sql`，取得線上商店的範例資料。

訂單摘要要 JOIN 會員和訂單明細，狀態要從英文代碼轉成中文，商品件數要把明細的數量加總。每日營業額要注意，待付款和已取消的訂單不能算進去。

思考一下，第一題的 CASE 和 GROUP BY 放在 VIEW 裡，之後查詢 VIEW 的人還需要知道這些細節嗎？

我們先暫停一下，自己動手寫寫看。

【講師】給大家十到十五分鐘，第一題比較長，可以先寫出 SELECT，確認結果對了再包成 VIEW。
-->

---
layout: default
---

# 練習 1：解題提示

```sql
CREATE VIEW order_summary_view AS
SELECT o.id, o.order_no, u.name AS member_name,
  CASE o.status
    WHEN 'PENDING_PAYMENT' THEN '待付款'
    WHEN 'PAID'            THEN '已付款'
    WHEN 'SHIPPED'         THEN '已出貨'
    WHEN 'COMPLETED'       THEN '已完成'
    ELSE '已取消'
  END AS status_label,
  SUM(i.quantity) AS item_count,
  o.total_amount, o.created_at
FROM orders o
  JOIN users u       ON o.user_id = u.id
  JOIN order_items i ON i.order_id = o.id
GROUP BY o.id, o.order_no, u.name, o.status, o.total_amount, o.created_at;
```

<!--
第一題。CASE 把英文的狀態代碼轉成中文，這裡用的是 CASE 的另一種寫法：CASE 後面直接放欄位，WHEN 後面放要比對的值，比較簡潔。

訂單和明細是一對多，JOIN 之後一張訂單會變成好幾列，所以要依訂單分組，再用 SUM 加總數量。

這也回答了剛才的思考題。建好之後，查詢的人只要寫 `SELECT * FROM order_summary_view`，完全不用知道背後有 JOIN、CASE 和 GROUP BY。執行看看，會看到十張訂單，最新的是王小明一張待付款的訂單。
-->

---
layout: default
---

# 練習 1：解題提示（續）

```sql
-- 2. 每日營業額：只算有效的訂單
CREATE VIEW daily_sales_view AS
SELECT DATE(created_at) AS sales_date,
       COUNT(*) AS order_count,
       SUM(total_amount) AS revenue
FROM orders
WHERE status IN ('PAID', 'SHIPPED', 'COMPLETED')
GROUP BY DATE(created_at);

-- 3. 近 7 天營業額最高的 3 天
SELECT sales_date, revenue
FROM daily_sales_view
WHERE sales_date >= CURDATE() - INTERVAL 6 DAY
ORDER BY revenue DESC
LIMIT 3;
```

<!--
第二題，`DATE` 函式把日期時間只留下日期，再依日期分組。WHERE 用 IN 列出三種有效的狀態，待付款和已取消就不會被算進營業額。

第三題，查詢 VIEW 就跟查詢一般的表一樣，可以加 WHERE、ORDER BY 和 LIMIT。今天往前推六天，加上今天，就是近七天。

範例資料的日期都相對於今天，所以隨時執行，結果都是三天前一千八百九十元最高，四天前一千三百九十元第二，今天一千兩百六十元第三。
-->

---
layout: default
---

# 練習 2：任務說明
### 用 VIEW 保護會員的個資

會員資料有手機、Email 和密碼雜湊，客服和數據分析師不該看到完整資料：

**任務：**
1. 建立 `member_masked_view`（給客服）：`id`、`name`、遮罩後的手機（`0912***678`）、遮罩後的 Email（`us***@cornercafe.test`）、`role`、`created_at`，**不含密碼**
2. 建立 `sales_item_view`（給分析師）：下單日期、商品名稱、規格名稱、數量、小計，只算有效訂單，**不含收件人資料**
3. 說明為什麼這些 VIEW 比直接開放資料表權限更安全

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b><code>LEFT(欄位, n)</code>、<code>RIGHT(欄位, n)</code> 取前後 n 個字元，<code>CONCAT</code> 串接字串，<code>SUBSTRING_INDEX(email, '@', -1)</code> 取出 @ 後面的網域。
</div>

<!--
第二題換個角度，用 VIEW 保護個資。客服需要確認是哪位會員，但不需要看到完整的手機和 Email，更不能看到密碼。分析師只需要銷售數字，不需要知道東西寄到哪裡。

提示裡列了幾個字串函式，可以把手機和 Email 的中間遮起來。

思考一下，如果直接給客服 `users` 表的查詢權限，會有什麼風險？

我們先暫停一下，自己動手寫寫看。

【講師】給大家十分鐘，遮罩的格式可以讓同學自由發揮，重點是敏感欄位不能出現在 VIEW 裡。
-->

---
layout: default
---

# 練習 2：解題提示

```sql
-- 1. 給客服：遮罩手機與 Email，不含密碼
CREATE VIEW member_masked_view AS
SELECT id, name,
  CONCAT(LEFT(phone, 4), '***', RIGHT(phone, 3)) AS phone,
  CONCAT(LEFT(email, 2), '***@', SUBSTRING_INDEX(email, '@', -1)) AS email,
  role, created_at
FROM users;

-- 2. 給分析師：只有銷售數字，沒有收件人資料
CREATE VIEW sales_item_view AS
SELECT DATE(o.created_at) AS order_date,
       i.product_name, i.variant_name, i.quantity, i.subtotal
FROM order_items i
  JOIN orders o ON i.order_id = o.id
WHERE o.status IN ('PAID', 'SHIPPED', 'COMPLETED');
```

<!--
第一題，手機取前四碼和後三碼，中間補三個星號；Email 取前兩個字元，加上星號和 @ 後面的網域。密碼雜湊根本不放進 VIEW，客服就不可能看到。

第二題，分析師的 VIEW 只有日期、商品、規格、數量和小計。收件人的姓名、電話和地址都在 `orders` 表裡，我們沒有選，所以完全不會出現。

試著用 `sales_item_view` 算每個商品的銷售額，會看到綜合濾掛包賣得最好，共兩千三百八十元。
-->

---
layout: default
---

# 練習 2：解題提示（續）

**為什麼 VIEW 比直接開放資料表安全？**

| 直接開放 `users` 表 | 開放 `member_masked_view` |
| --- | --- |
| 看得到完整手機、Email | 只看得到遮罩後的資料 |
| 看得到密碼雜湊 | 根本沒有密碼欄位 |
| 以後新增敏感欄位，也會自動看得到 | 只有 VIEW 定義裡選的欄位 |

```sql
-- 建立客服帳號，只給它 VIEW 的查詢權限，不給原始資料表
CREATE USER 'support'@'%' IDENTIFIED BY 'Support1234';
GRANT SELECT ON cafe_shop.member_masked_view TO 'support'@'%';
```

<!--
第三題。直接開放資料表，客服看得到完整的手機、Email，甚至密碼雜湊。密碼雖然加密過，外洩之後還是可能被暴力破解。

VIEW 就像一扇只開了幾個格子的窗戶，客服只看得到我們選出來、而且已經遮罩過的欄位。更重要的是，以後 `users` 表新增了身分證字號之類的敏感欄位，VIEW 不會自動多出這一欄。

搭配權限設定，先建立客服專用的帳號，只給它 VIEW 的查詢權限，不給原始資料表的權限，個資就有兩層保護。注意 MySQL 8 之後，GRANT 不會自動幫我們建立帳號，所以要先 CREATE USER。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天我們學了 VIEW。它能簡化查詢、保護敏感資料、集中管理邏輯，但要記住，VIEW 是讓程式碼更乾淨、更安全的工具，不是讓查詢變快的工具。

下一章，我們要學子查詢，把一個查詢的結果，當成另一個查詢的條件或資料來源。我們下一章見。

【講師】開放提問，也可以請同學想想自己的專案裡，哪段查詢適合包成 VIEW。
-->
