---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 批次新增與動態參數查詢
routeAlias: ch35
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
    批次新增與<br>動態參數查詢
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「一次新增大量資料、動態組合查詢條件的進階技巧」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，這一章要學兩個實務上非常實用的技巧。

第一個是「批次新增」——如果你要一次新增 1000 筆資料，一筆一筆 INSERT 效能很差，批次新增可以大幅提升效能。

第二個是「動態參數查詢」——當查詢條件是動態的（例如使用者可以選擇要搜尋哪幾個城市），IN 條件的個數不固定，怎麼正確處理。

這兩個技巧都建立在上一章學的 PreparedStatement 基礎上。
-->

---
layout: default
---

# Outline

- **批次新增（Batch Insert）** — `addBatch()` / `executeBatch()` 原理與實作
- **try-with-resources** — 自動關閉資源的寫法
- **動態參數查詢** — LIKE vs REGEXP 比較
- **REGEXP 動態查詢** — 動態串接多個條件的完整實作

<!--
今天分兩個主題。批次新增偏效能優化，動態查詢偏查詢功能設計。

兩個都是業界實際開發中很常遇到的需求，學完今天就能解決這兩類問題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 批次新增（Batch Insert）

<!--
先從效能問題出發，理解批次新增的必要性。
-->

---

# 為什麼需要批次新增？

假設要匯入 1000 筆學生資料，兩種做法的效能差異：

| 做法 | 資料庫往返次數 | SQL 編譯次數 | 效能 |
| --- | --- | --- | --- |
| 迴圈逐筆 `save()` | 1000 次 | 1000 次 | 慢 |
| 批次新增 `executeBatch()` | **1 次** | **1 次** | 快 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>批次新增原理：</b> 把 1000 筆 INSERT 一次送給資料庫執行，而不是來回 1000 趟——就像一次批量送貨，而不是跑 1000 趟的快遞。
</div>

<!--
效能差異的根源是「資料庫往返成本（Round Trip Cost）」。每一次資料庫操作都有網路延遲和連線建立的成本，1000 次就是 1000 倍的成本。

批次新增把 1000 筆操作打包成一個請求，大幅減少往返次數，同時 PreparedStatement 只需要編譯 SQL 一次。

業界做法：當需要插入的資料量超過 10 筆，就考慮改用批次新增。
-->

---

# addBatch / executeBatch 概念

PreparedStatement 的批次操作有三個關鍵步驟：

| 步驟 | 方法 | 說明 |
| --- | --- | --- |
| 1 | `ps.addBatch()` | 把目前的參數值加入批次佇列 |
| 2 | `ps.executeBatch()` | 一次把佇列中所有操作送給資料庫執行 |
| 3 | `conn.commit()` | 提交事務，確認寫入 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> 執行批次前需要 <code>conn.setAutoCommit(false)</code> 關閉自動提交，批次執行完後再手動 <code>conn.commit()</code>。
</div>

<!--
為什麼要關閉 AutoCommit？

預設情況下，每一個 SQL 操作都會立刻 commit。批次新增需要把所有操作打包成一個事務——全部成功才 commit，任何一筆失敗就全部回滾。

setAutoCommit(false) 告訴資料庫「先別急著提交，等我說 commit 再說」。

executeBatch() 回傳一個 int 陣列，每個元素代表對應的操作影響幾筆資料（成功是 1，失敗可能是 -2 或 0，依資料庫而定）。
-->

---

# try-with-resources — 自動關閉資源

`try-with-resources` 確保 `PreparedStatement` 用完後自動關閉，不需要手動 `close()`：

```java
String sql = "INSERT INTO person_info (id, name, age, city)"
           + " VALUES (?, ?, ?, ?)";

try (PreparedStatement ps = conn.prepareStatement(sql)) {
    // ps 在 try 區塊結束後自動關閉
    // 即使拋出例外，也一定會關閉
    ...
}
```

<!--
try-with-resources 是 Java 7 引入的語法，只要物件實作了 AutoCloseable 介面，就可以放在 try() 的括號中，確保離開 try 區塊時自動呼叫 close()。

PreparedStatement 和 Connection 都實作了 AutoCloseable，所以都可以用這個語法。

不用 try-with-resources 的舊寫法需要在 finally 裡手動 close，容易忘記，也容易因為例外而跳過 close，造成資源洩漏。
-->

---

# 批次新增 — 完整程式碼

```java
public int batchInsert(Connection conn, List<PersonInfo> list)
        throws SQLException {
    String sql = "INSERT INTO person_info (id, name, age, city)"
               + " VALUES (?, ?, ?, ?)";
    int totalCount = 0;
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
        conn.setAutoCommit(false);
        for (PersonInfo p : list) {
            ps.setString(1, p.getId());
            ps.setString(2, p.getName());
            ps.setInt(3, p.getAge());
            ps.setString(4, p.getCity());
            ps.addBatch();
        }
        int[] results = ps.executeBatch();
        conn.commit();
        for (int r : results) { totalCount += r; }
    }
    return totalCount;
}
```

<!--
看這段程式碼的流程：

1. prepareStatement 編譯 SQL，只做一次。
2. 迴圈裡 setString/setInt 填入參數，addBatch 加入佇列。
3. 迴圈結束後，executeBatch 一次送出所有操作。
4. commit 確認寫入，totalCount 統計成功筆數。

注意 try-with-resources 包住了 PreparedStatement，確保不管是否拋出例外，ps 一定會被關閉。

實務上，如果資料量很大（如百萬筆），可以分批處理，每 500 筆 executeBatch 一次，避免記憶體溢出。
-->

---

# 批次新增 — 測試呼叫

透過 `DataSource` 取得 `Connection` 後呼叫批次新增：

```java
@SpringBootTest
class BatchInsertTest {

    @Autowired
    private PersonInfoDao personInfoDao;

    @Autowired
    private DataSource dataSource;

    @Test
    void testBatchInsert() throws SQLException {
        List<PersonInfo> list = new ArrayList<>();
        for (int i = 1; i <= 100; i++) {
            list.add(new PersonInfo("ID" + i, "Name" + i, 20 + i, "台北"));
        }
        try (Connection conn = dataSource.getConnection()) {
            int count = personInfoDao.batchInsert(conn, list);
            System.out.println("新增筆數：" + count);
        }
    }
}
```

<!--
DataSource 是 Spring Boot 自動設定的資料庫連線池，透過 @Autowired 注入後，呼叫 getConnection() 取得連線物件。

Connection 也用了 try-with-resources，確保測試結束後連線歸還給連線池。

執行後，console 會顯示「新增筆數：100」，資料庫裡也會出現 100 筆新資料。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 動態參數查詢

<!--
第二個主題：當查詢條件的個數是動態的，怎麼正確處理？
-->

---

# 動態 IN 查詢的挑戰

假設要根據使用者選擇的城市清單查詢，城市個數不固定：

**問題：** PreparedStatement 的 `?` 個數在編譯時就要決定，無法動態變化。

```java
// 只能查 3 個城市，個數固定——不夠彈性
String sql = "SELECT * FROM person_info WHERE city IN (?, ?, ?)";
```

**解法：使用 REGEXP 代替 IN，支援動態參數數量**

```sql
-- REGEXP 只需要一個 ?，把多個值用 | 串接
WHERE city REGEXP '台北|台南|高雄'
```

<!--
IN (?, ?, ?) 的問題是 ? 的個數在 SQL 編譯時就要確定。如果使用者有時選 2 個城市、有時選 5 個，你不可能預先寫好所有情況。

REGEXP 只需要一個 ?，把多個條件用 | （正則的 OR）串接成一個字串傳入，完美解決動態個數問題。

效果上，`city REGEXP '台北|台南'` 等同於 `city LIKE '%台北%' OR city LIKE '%台南%'`。
-->

---

# LIKE vs REGEXP 比較

| 比較項目 | LIKE | REGEXP |
| --- | --- | --- |
| 單一條件 | `city LIKE '%台%'` | `city REGEXP '台'` |
| 多條件 OR | 需寫多個 `OR LIKE` | 用 `\|` 一次完成 |
| 動態個數 | 難處理 | ✅ 易串接 |
| 適用 | JPQL / nativeQuery | nativeQuery only |

**LIKE 多條件（靜態，不實用）：**

```sql
WHERE city LIKE '%台北%' OR city LIKE '%台南%'
```

**REGEXP 多條件（動態，推薦）：**

```sql
WHERE city REGEXP '台北|台南'
```

<!--
REGEXP 只能用在 nativeQuery = true 的情境，不支援 JPQL（因為 REGEXP 是 MySQL 特有語法，不是標準 SQL）。

LIKE 可以用在 JPQL，但多條件時需要寫多個 OR，無法動態組合個數不固定的條件。

所以動態條件查詢的標準做法是：nativeQuery = true + REGEXP + 動態串接 | 分隔字串。
-->

---

# 動態 REGEXP 查詢 — 核心邏輯

把 `cityList` 用 `|` 串接成 REGEXP 的模式字串：

```java
StringBuilder regexpValue = new StringBuilder();
for (int i = 0; i < cityList.size(); i++) {
    if (i > 0) regexpValue.append("|");
    regexpValue.append(cityList.get(i));
}
// cityList = ["台北", "台南", "高雄"]
// regexpValue = "台北|台南|高雄"

String sql = "SELECT * FROM person_info WHERE city REGEXP ?";
```

<!--
這個串接邏輯很簡單：第一個元素直接加，後面每個元素前面加 |。

產生的字串 "台北|台南|高雄" 就是 REGEXP 的條件——city 符合任一個都會被選中。

最終只有一個 ? 佔位符，不論 cityList 有幾個元素都能處理。
-->

---

# 動態 REGEXP 查詢 — 完整程式碼

```java
default List<PersonInfo> findByCityRegexp(
        Connection conn, List<String> cityList) throws SQLException {
    StringBuilder regexp = new StringBuilder();
    for (int i = 0; i < cityList.size(); i++) {
        if (i > 0) regexp.append("|");
        regexp.append(cityList.get(i));
    }
    String sql = "SELECT * FROM person_info WHERE city REGEXP ?";
    List<PersonInfo> result = new ArrayList<>();
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setString(1, regexp.toString());
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            PersonInfo p = new PersonInfo();
            p.setId(rs.getString("id"));
            p.setName(rs.getString("name"));
            p.setAge(rs.getInt("age"));
            p.setCity(rs.getString("city"));
            result.add(p);
        }
    }
    return result;
}
```

<!--
這段程式碼完整展示了動態查詢的流程：

1. 用迴圈把 cityList 串接成 REGEXP 模式字串。
2. 用 PreparedStatement 安全地帶入參數。
3. 執行查詢，用 ResultSet 手動映射回 PersonInfo 物件。

注意：這個方法定義在 Repository 介面中，使用 `default` 關鍵字提供預設實作。這是 Java 8 的介面預設方法特性，讓 Repository 介面可以包含實作邏輯，不需要另外建立實作類別。
-->

---

# 動態查詢 — 測試呼叫

```java
@Test
void testFindByCityRegexp() throws SQLException {
    List<String> cities = Arrays.asList("台北", "台南", "高雄");

    try (Connection conn = dataSource.getConnection()) {
        List<PersonInfo> result =
            personInfoDao.findByCityRegexp(conn, cities);
        System.out.println("查詢筆數：" + result.size());
        result.forEach(p ->
            System.out.println(p.getName() + " - " + p.getCity()));
    }
}
```

<!--
測試呼叫的方式和批次新增一樣——透過 DataSource 取得 Connection，然後呼叫 Repository 的方法。

執行後，console 會列出所有城市符合台北、台南或高雄的資料。

如果想測試動態個數，可以試試 Arrays.asList("台北") 只查一個城市，或 Arrays.asList("台北", "台南", "高雄", "新竹") 查四個城市，確認動態 REGEXP 都能正確處理。
-->

---
layout: default
---

# 練習：實作批次匯入 API
### 任務說明

建立一個 `POST /students/batch` API，接收一個學生清單並批次新增至資料庫：

1. Controller 接收 `List<CreateStudentRequest>`（使用 `@RequestBody`）
2. Service 呼叫批次新增方法，透過 `DataSource.getConnection()` 取得連線
3. Repository 使用 `PreparedStatement.addBatch()` + `executeBatch()` 執行批次新增
4. 回傳成功新增的筆數

<!--
這個練習把批次新增整合到完整的 API 流程中。

大家想想：為什麼我們需要在 Repository 用 default 方法？可以改在 Service 直接寫 PreparedStatement 嗎？

試著自己設計程式碼結構，再看提示！
-->

---

# 練習：解題提示

1. **Repository** — 定義 `default int batchInsert(Connection conn, List<Student> list)` 方法
2. **Service** — 注入 `DataSource`，呼叫 `dataSource.getConnection()`，傳給 Repository
3. **Controller** — `@PostMapping("/students/batch")`，接收 `@RequestBody List<CreateStudentRequest>`

```java
@Autowired
private DataSource dataSource;

public int batchImport(List<Student> list) throws SQLException {
    try (Connection conn = dataSource.getConnection()) {
        return studentDao.batchInsert(conn, list);
    }
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>成功標準：</b> 用 Postman 發送含 10 筆學生的 JSON 陣列，回傳 <code>{"count": 10}</code>，資料庫出現 10 筆新資料。
</div>

<!--
DataSource 的 import 是 javax.sql.DataSource（不是 jakarta，DataSource 是 Java SE 標準，不受 jakarta 更名影響）。

別忘了在 Service 方法加上例外宣告（throws SQLException）或用 try-catch 處理。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 批次新增優勢 | 1000 筆資料只需 1 次資料庫往返，大幅提升效能 |
| addBatch() | 把目前參數值加入批次佇列 |
| executeBatch() | 一次送出所有操作，回傳每筆影響行數陣列 |
| setAutoCommit(false) | 批次操作前關閉自動提交，操作完手動 commit |
| try-with-resources | 自動關閉 PreparedStatement，避免資源洩漏 |
| REGEXP 動態查詢 | 用 `\|` 串接多個條件，只需一個 `?` 佔位符 |
| LIKE vs REGEXP | LIKE 適合靜態條件；REGEXP 適合動態個數條件 |

<!--
今天的重點總結。

批次新增和動態查詢都是效能和彈性的提升，建立在 PreparedStatement 的基礎上。

這個系列的資料庫進階章節到這裡就告一段落——從基本 CRUD、JPA、MyBatis，到 JPQL、@Transactional、樂觀鎖悲觀鎖、SQL Injection 防範，再到批次新增和動態查詢，大家已經具備了業界後端開發所需的完整資料庫操作技能！
-->

---
layout: end
---

# Q & A

<!--
今天的批次新增與動態參數查詢就到這裡。大家有任何問題嗎？
-->
