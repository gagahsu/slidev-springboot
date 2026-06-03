---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: SQL Injection 防範
routeAlias: ch34
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
    SQL Injection 防範
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓使用者輸入永遠只是資料，而不是程式碼」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，今天要學的是 SQL Injection——OWASP（網路安全組織）多年來排名第一的 Web 應用安全漏洞。

想像你的登入 API 是這樣寫的：把使用者輸入的帳號直接拼進 SQL 字串。攻擊者在輸入框填入特製的字串，就能讓你的 SQL 查詢完全走樣，繞過密碼驗證，甚至刪掉整個資料庫。

今天要學的不只是「攻擊長什麼樣子」，更重要的是「Spring 的各種框架如何自動幫我們防範」。
-->

---
layout: default
---

# Outline

- **什麼是 SQL Injection？** — 攻擊原理與危害
- **危險寫法示範** — 字串拼接如何被攻擊
- **防範核心：參數化查詢** — PreparedStatement 原理
- **Spring 框架的防護** — JDBCTemplate、JPA、MyBatis 各自的安全做法
- **三種框架防護比較** — 哪些寫法安全、哪些危險

<!--
今天先看攻擊，再學防守。理解攻擊原理後，才能真正理解為什麼參數化查詢能防範。

後半段會看 Spring 三種資料庫框架各自怎麼做，讓大家有全面的認識。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 認識 SQL Injection

<!--
先看看攻擊者是怎麼利用 SQL Injection 的。
-->

---

# 什麼是 SQL Injection？

SQL Injection（SQL 隱碼攻擊）：**攻擊者在輸入欄位中插入惡意 SQL 語法，讓資料庫執行非預期的操作。**

**危險寫法 — 直接字串拼接：**

```java
String sql = "SELECT * FROM users WHERE name = '"
           + userInput + "'";
```

若使用者輸入正常值 `Alice`，SQL 如預期：

```sql
SELECT * FROM users WHERE name = 'Alice'
```

若使用者輸入 `' OR '1'='1`，SQL 變成：

```sql
SELECT * FROM users WHERE name = '' OR '1'='1'
-- '1'='1' 永遠成立 → 回傳所有使用者資料！
```

<!--
關鍵在於：直接拼接字串時，使用者的輸入會被資料庫解析成 SQL 語法的一部分，而不是純粹的資料。

`' OR '1'='1` 這段輸入，利用單引號提前結束了 name 的值，然後加上 OR 條件讓整個 WHERE 恆成立。

這個漏洞不只能讀取資料——進階攻擊還可以用 UNION 竊取其他表的資料，或用 DROP TABLE 刪除整個資料庫。
-->

---

# 攻擊變種：繞過登入驗證

登入 API 常見的危險寫法：

```java
String sql = "SELECT * FROM users WHERE account = '"
           + account + "' AND password = '" + password + "'";
```

攻擊者在帳號欄位輸入 `admin' --`（`--` 是 SQL 的單行註解）：

```sql
SELECT * FROM users
WHERE account = 'admin' --' AND password = 'anything'
-- -- 之後全部被註解掉，密碼驗證失效！
```

**結果：** 攻擊者不知道密碼，卻能以 admin 身份登入。

<!--
這是真實攻擊中最常見的手法。-- 是 SQL 的單行註解符號，後面的內容全被忽略。

攻擊者只需要知道帳號（通常是 admin 或 root），密碼隨便填，就能成功登入。

這種攻擊完全不需要技術門檻——網路上有大量的攻擊字串可以直接複製貼上。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 防範核心：參數化查詢

<!--
知道攻擊原理了，來看如何根本性地防範 SQL Injection。
-->

---

# PreparedStatement — 防範原理

**參數化查詢（Parameterized Query）** 讓使用者輸入永遠被視為「資料」，而不是「SQL 語法」。

```java
String sql = "SELECT * FROM users WHERE name = ?";
PreparedStatement ps = connection.prepareStatement(sql);
ps.setString(1, userInput);   // 輸入被視為純字串資料
ResultSet rs = ps.executeQuery();
```

若使用者輸入 `' OR '1'='1`，資料庫實際執行的是：

```sql
SELECT * FROM users WHERE name = ''' OR ''1''=''1'
-- 單引號被自動跳脫，輸入變成純資料，攻擊無效！
```

<!--
PreparedStatement 的核心是「先編譯 SQL 結構，再填入資料」。

? 佔位符告訴資料庫：這裡會放一個資料值。之後填入的任何內容，資料庫都當成純字串處理，其中的單引號、OR、DROP 等都不會被解析成 SQL 語法。

這是最根本的防範方式，其他所有框架的安全做法，底層都是基於這個原理。
-->

---

# PreparedStatement — 效能優勢

PreparedStatement 除了安全，還有效能優勢：

| 比較 | Statement（危險） | PreparedStatement（安全） |
| --- | --- | --- |
| SQL 編譯 | 每次執行都重新編譯 | SQL 只編譯**一次**，後續重複使用 |
| 安全性 | 有 SQL Injection 風險 | ✅ 參數化，自動防範 |
| 適用場景 | — | 批次操作效能更佳 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>雙重優勢：</b> PreparedStatement 同時解決安全問題和效能問題，是操作資料庫的最佳實踐。
</div>

<!--
PreparedStatement 的效能優勢在批次插入時特別明顯——1000 筆資料，SQL 只需要編譯一次，然後 1000 次填入不同的參數值執行。

相比之下，如果每筆都重新拼字串，資料庫要重新解析和編譯 1000 次 SQL，效能差了一個數量級。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## Spring 框架的防護

<!--
在 Spring Boot 裡，我們通常不直接用 PreparedStatement——來看三種框架各自怎麼做。
-->

---

# JDBCTemplate — 安全寫法

JDBCTemplate 使用 `?` 佔位符，底層自動用 PreparedStatement：

**危險（直接拼接字串）：**

```java
// 危險！不要這樣寫
String sql = "SELECT * FROM users WHERE name = '" + name + "'";
jdbcTemplate.query(sql, rowMapper);
```

**安全（使用佔位符）：**

```java
String sql = "SELECT * FROM users WHERE name = ?";
jdbcTemplate.query(sql, rowMapper, name);
```

<!--
JDBCTemplate 的 query()、update() 方法支援可變參數——直接把參數值加在 SQL 後面，底層自動用 PreparedStatement。

只要記住：凡是有使用者輸入的地方，一律用 ?，永遠不要用字串拼接。

有些開發者為了方便用了 String.format 或 + 拼接，這是嚴重的安全漏洞。
-->

---

# JPA / JPQL — 自動防範

Spring Data JPA 的 `@Query` 使用 `:param` 或 `?1` 語法，**自動使用參數化查詢**：

```java
@Repository
public interface UserDao extends JpaRepository<User, String> {

    // :name 是命名參數，自動防範 SQL Injection
    @Query("select u from User u where u.name = :name")
    List<User> findByName(@Param("name") String name);

    // JPA 內建方法命名查詢，同樣自動防範
    List<User> findByName(String name);
}
```

<!--
這是 JPA 最大的優點之一——只要使用 @Query 的 :param 語法，或直接使用 JPA 的命名查詢方法，底層全部都是參數化查詢，完全不需要我們額外處理 SQL Injection。

但有一個例外：如果你使用 nativeQuery = true 並在 SQL 中拼接字串，一樣有風險。nativeQuery 也要用 :param 或 ?1 語法。
-->

---

# MyBatis — #{} vs ${}

MyBatis 有兩種參數語法，安全性完全不同：

| 語法 | 原理 | SQL Injection 風險 |
| --- | --- | --- |
| `#{param}` | PreparedStatement 佔位符 | ✅ 安全，自動防範 |
| `${param}` | 直接字串替換 | ❌ 危險，有注入風險 |

```java
// ✅ 安全寫法
@Select("SELECT * FROM users WHERE name = #{name}")
List<User> findByName(String name);

// ❌ 危險寫法（${} 直接替換字串）
@Select("SELECT * FROM users WHERE name = '${name}'")
List<User> findByNameUnsafe(String name);
```

<!--
MyBatis 的 #{} 和 ${} 是最容易混淆的地方，也是 MyBatis 最常見的安全問題。

#{} 是 PreparedStatement 佔位符，參數值被當成資料處理，安全。
${} 是字串直接替換，效果等同於字串拼接，不安全。

什麼時候會用到 ${} 呢？主要是動態表名或欄位名（例如 ORDER BY ${column}）——這種情況一定要自己驗證輸入合法性，絕對不能直接傳入使用者的輸入。
-->

---

# 三種框架防護總覽

| 框架 | 安全寫法 | 注意事項 |
| --- | --- | --- |
| Spring JDBC | `?` 佔位符 + 參數值 | 禁止字串拼接 |
| Spring Data JPA | `:param` / `?1` 命名參數 | nativeQuery 也要用參數 |
| MyBatis | `#{}` 語法 | 禁止用 `${}` 接收使用者輸入 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>結論：</b> Spring 三種框架只要正確使用參數化語法，都能自動防範 SQL Injection。危險來自於開發者繞過框架，自己做字串拼接。
</div>

<!--
總結一句話：永遠用框架提供的參數化機制，永遠不要手動拼接 SQL 字串。

這不只是安全問題，也是程式碼品質的問題——參數化寫法更清楚、更好維護。

真實的 SQL Injection 事件，幾乎都是開發者「圖方便」拼字串造成的。
-->

---
layout: default
---

# 練習：找出並修復 SQL Injection 漏洞
### 任務說明

以下 `StudentDao` 有一個 SQL Injection 漏洞，請找出並修復：

```java
@Repository
public interface StudentDao extends JpaRepository<Student, Integer> {

    @Query(value = "SELECT * FROM student WHERE name = '" +
                   "#{name}" + "'", nativeQuery = true)
    List<Student> searchByName(@Param("name") String name);
}
```

提示：觀察 SQL 字串的組合方式，判斷參數是否正確處理。

<!--
這個練習刻意設計了一個常見的錯誤寫法，讓大家練習辨認漏洞。

大家先仔細看 @Query 的 SQL 字串，想想：這段 SQL 真的會用 PreparedStatement 嗎？還是會有什麼問題？

先自己分析，再看提示！
-->

---

# 練習：解題提示

**問題所在：** SQL 字串用了 `+` 拼接，且引號包住了參數，讓 `#{name}` 無法正確作為 PreparedStatement 佔位符運作。

**正確修復：**

```java
@Query(value = "SELECT * FROM student WHERE name = :name",
       nativeQuery = true)
List<Student> searchByName(@Param("name") String name);
```

關鍵：`:name` 直接放在 SQL 中，**不加引號**，框架自動處理型別和跳脫。

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>測試方式：</b> 傳入 <code>' OR '1'='1</code>，修復前會回傳所有資料，修復後回傳空陣列。
</div>

<!--
注意：nativeQuery = true 的 @Query，參數使用 :name 或 ?1 都是安全的，底層都是 PreparedStatement。

很多人誤以為 nativeQuery = true 就需要手動處理，其實不是——只要用 :param 語法，JPA 一樣幫你做參數化。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| SQL Injection | 攻擊者在輸入中插入 SQL 語法，讓資料庫執行非預期操作 |
| 根本原因 | 直接把使用者輸入拼接進 SQL 字串 |
| 防範原理 | 參數化查詢（PreparedStatement）：輸入永遠只是資料 |
| Spring JDBC | 使用 `?` 佔位符，不要字串拼接 |
| JPA | `:param` / `?1` 語法，自動防範 |
| MyBatis | `#{}` 安全；`${}` 危險，禁止接收使用者輸入 |

<!--
今天最重要的一句話：永遠用框架的參數化機制，永遠不要手動拼接 SQL。

Spring 的三種框架——JDBCTemplate、JPA、MyBatis——只要正確使用，都已經幫你防範 SQL Injection。

下一章我們要學批次新增和動態參數查詢，這兩個功能底層也是基於 PreparedStatement，學完今天再去看會很容易理解。
-->

---
layout: end
---

# Q & A

<!--
今天的 SQL Injection 防範章節就到這裡。大家有任何問題嗎？
-->
