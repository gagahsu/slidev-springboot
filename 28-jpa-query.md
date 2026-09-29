---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "Spring Data JPA — @Query 與 JPQL"
routeAlias: ch28
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
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Spring Data JPA<br>@Query 與 JPQL
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「當命名查詢不夠用時，用 @Query 直接寫 SQL」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，上一章我們學了 Spring Data JPA 的命名查詢——findByName、findByAgeGreaterThan 等。

但現實開發中，有些查詢很複雜，命名查詢的方法名稱會變得又臭又長，甚至無法表達。這時候就需要 @Query 讓我們直接寫 SQL 或 JPQL 語法。

今天要學的就是 @Query、JPQL、以及 @Modifying 讓我們能直接執行 UPDATE / INSERT / DELETE。
-->

---
layout: default
---

# Outline

- **什麼是 JPQL？** — 與 SQL 的差異、操作對象是 Entity
- **@Query 基本用法** — nativeQuery = false（JPQL）vs true（原生 SQL）
- **參數傳遞方式** — `:name` 命名參數 vs `?1` 位置參數
- **@Modifying — UPDATE / DELETE** — 修改操作必加的 Annotation
- **INSERT** — 只能用 nativeQuery = true
- **SELECT 進階** — distinct、order by、like、join、`JoinVo` 自訂回傳類別
- **分頁查詢** — `Page`、`Pageable`、`PageRequest`

<!--
今天內容偏實用，以程式碼範例為主。重點是理解 nativeQuery = true 和 false 的差異，以及什麼操作必須加 @Modifying。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 什麼是 JPQL？

<!--
先了解 JPQL 和 SQL 的差別。
-->

---

# JPQL vs 原生 SQL

JPQL（Java Persistence Query Language）是 JPA 定義的查詢語言，語法和 SQL 相似，但操作對象不同：

| 比較項目 | SQL | JPQL |
| --- | --- | --- |
| 操作對象 | 資料表（Table）和欄位（Column） | Java Entity 類別和屬性 |
| 表格名稱 | `person_info`（資料庫名稱） | `PersonInfo`（Java 類別名稱） |
| 欄位名稱 | `name`（資料庫欄位） | `name`（Java 屬性名稱） |
| 跨資料庫 | 依賴資料庫語法 | 由 JPA 轉換為各資料庫 SQL |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選擇時機：</b> 簡單查詢用 JPQL（跨資料庫）；需要資料庫特有語法（如 REGEXP）用 nativeQuery = true。
</div>

<!--
JPQL 的優勢是「跨資料庫」——寫 JPQL 換成 PostgreSQL 或 Oracle 不用改，JPA 自動翻譯成對應的 SQL。

缺點是不支援某些資料庫特有語法，例如 MySQL 的 REGEXP、LIMIT（需要改用 Pageable）。

用哪個取決於查詢複雜度和跨資料庫需求。一般業務查詢用 JPQL 就夠，複雜的報表查詢可以用 nativeQuery = true。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## @Query 基本用法

<!--
來看 @Query 怎麼寫，以及 nativeQuery 兩種模式的差別。
-->

---

# @Query — nativeQuery = false（JPQL，預設）

`@Query` 的 `nativeQuery` 預設是 `false`，使用 JPQL 語法：

| 說明 | 規則 |
| --- | --- |
| 表格名稱 | Entity 的**類別名稱**（`PersonInfo`） |
| 欄位名稱 | Entity 的**屬性名稱**（`name`、`age`） |
| 別名 | `select p from PersonInfo as p` |

```java
// JPQL：操作 Entity 類別名和屬性名
@Query("select p from PersonInfo as p where p.city = ?1")
List<PersonInfo> findByCity(String city);
```

<!--
JPQL 的 select 語法：from 後面是 Entity 類別名（大寫開頭），不是資料表名。

使用別名（as p）可以讓後面的 where、order by 更簡潔。

注意：?1 表示第一個方法參數，?2 表示第二個，以此類推。
-->

---

# @Query — nativeQuery = true（原生 SQL）

加上 `nativeQuery = true` 後，使用真實的資料庫 SQL：

| 說明 | 規則 |
| --- | --- |
| 表格名稱 | 資料庫的**表格名稱**（`person_info`） |
| 欄位名稱 | 資料庫的**欄位名稱**（`name`、`age`） |
| 特有語法 | 可使用 MySQL 的 REGEXP、LIMIT 等 |

```java
// 原生 SQL：操作資料表名和欄位名
@Query(value = "select * from person_info where city = ?1",
       nativeQuery = true)
List<PersonInfo> findByCityNative(String city);
```

<!--
nativeQuery = true 寫的是真實 SQL，所以 from 後面是資料表名（person_info），不是 Entity 類別名。

優點是可以用資料庫特有語法；缺點是換資料庫時 SQL 可能需要調整。

⚠️ 注意：JPQL 和原生 SQL 的表格名、欄位名不能搞混，是最常犯的錯誤。
-->

---

# 參數傳遞：兩種方式

`@Query` 支援兩種傳遞參數的方式：

| 方式 | 語法 | 特點 |
| --- | --- | --- |
| **位置參數** | `?1`、`?2` | 依方法參數順序，容易出錯 |
| **命名參數** | `:name`、`:city` + `@Param` | 明確對應，推薦使用 |

```java
// 位置參數
@Query("select p from PersonInfo p where p.id = ?1 and p.name = ?2")
Optional<PersonInfo> findByIdAndName(String id, String name);

// 命名參數（推薦）
@Query("select p from PersonInfo p where p.id = :inputId")
Optional<PersonInfo> findById2(@Param("inputId") String id);
```

<!--
命名參數更好：
1. 不依賴參數順序，維護時不容易搞錯
2. 參數名稱是文件，一看就知道對應哪個值
3. 如果方法參數順序調整，SQL 不需要改

業界一律推薦用 :name 搭配 @Param，養成好習慣。

@Param 的 import 是 org.springframework.data.repository.query.Param。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## @Modifying — UPDATE / DELETE

<!--
UPDATE 和 DELETE 不只是查詢，需要額外的 Annotation。
-->

---

# @Modifying 是什麼？

執行 **UPDATE、DELETE** 的 `@Query` 必須加上 `@Modifying`，告訴 JPA「這是修改操作」：

| Annotation | 說明 |
| --- | --- |
| `@Query` | 定義要執行的 SQL / JPQL |
| `@Modifying` | 標記為修改操作（非查詢），UPDATE / DELETE 必加 |
| `@Transactional` | 修改操作必須在事務中執行 |

```java
@Transactional
@Modifying
@Query("update PersonInfo set name = :newName where id = :inputId")
int updateNameById(@Param("inputId") String id,
                   @Param("newName") String name);
```

<!--
為什麼需要 @Modifying？JPA 預設假設 @Query 是查詢，如果是修改操作要明確告知。

三個 Annotation 的順序沒有強制規定，但業界慣例是從上到下：@Transactional → @Modifying → @Query。

方法回傳型別可以是 int（影響行數）或 void。
-->

---

# @Modifying — clearAutomatically

UPDATE 後再查詢同一筆資料，可能拿到**舊值**（JPA 快取）：

```java
// 加上 clearAutomatically = true，清除持久化上下文快取
@Modifying(clearAutomatically = true)
@Transactional
@Query("update PersonInfo set name = :newName where id = :inputId")
int updateNameById(@Param("inputId") String id,
                   @Param("newName") String name);
```

| 情境 | 說明 |
| --- | --- |
| 預設（無 clearAutomatically） | 更新後再查詢，可能讀到快取舊值 |
| `clearAutomatically = true` | 清除快取，下次查詢強制從資料庫讀取 |

<!--
這是一個很容易踩坑的地方。JPA 有持久化上下文（Persistence Context），會暫存讀到的 Entity。

執行 @Modifying UPDATE 之後，持久化上下文的快取還是舊值。如果接著查詢同一筆資料，JPA 可能直接回傳快取，而不是資料庫的最新值。

clearAutomatically = true 讓 JPA 在執行修改後清除快取，確保下次查詢是最新資料。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## INSERT

<!--
INSERT 有額外的限制，來看怎麼做。
-->

---

# INSERT — 只能用 nativeQuery = true

JPQL 不支援 INSERT，必須使用 `nativeQuery = true`：

```java
// 寫法一：位置參數 ?1
@Modifying
@Transactional
@Query(value = "insert into person_info (id, name, age, city)"
             + " values (?1, ?2, ?3, ?4)",
       nativeQuery = true)
int insert(String id, String name, int age, String city);
```

```java
// 寫法二：命名參數 :param（推薦）
@Modifying
@Transactional
@Query(value = "insert into person_info (id, name, age, city)"
             + " values (:inputId, :inputName, :inputAge, :inputCity)",
       nativeQuery = true)
int insert2(@Param("inputId") String id,
            @Param("inputName") String name,
            @Param("inputAge") int age,
            @Param("inputCity") String city);
```

<!--
JPQL 語法只支援 SELECT、UPDATE、DELETE，不支援 INSERT。

如果要用 @Query 做 INSERT，必須加 nativeQuery = true 使用原生 SQL。

同樣地，必須搭配 @Modifying 和 @Transactional。回傳 int 代表插入的筆數（成功是 1）。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5

## SELECT 進階

<!--
查詢是最複雜的部分，來看幾個常用的進階寫法。
-->

---

# SELECT — order by / distinct

```java
// order by：預設 ASC，可省略
@Query("select p from PersonInfo p where p.city = ?1 order by p.age")
List<PersonInfo> findByCityOrderByAge(String city);

// order by DESC
@Query("select p from PersonInfo p where p.city = ?1 order by p.age desc")
List<PersonInfo> findByCityOrderByAgeDesc(String city);

// distinct：取不重複的城市
@Query("select distinct new PersonInfo(p.city) from PersonInfo p")
List<PersonInfo> findDistinctCity();
```

<!--
JPQL 的 order by 用 Entity 屬性名（age），不是資料庫欄位名（age 碰巧一樣，但如果欄位叫 person_age，JPQL 要寫 personAge）。

distinct 用於取不重複值，搭配建構方法 new PersonInfo(city) 只取部分欄位。PersonInfo 必須有對應的建構方法才能用這個寫法。

⚠️ JPQL 不支援 LIMIT，要限制回傳筆數需改用 Pageable（下一頁介紹）。
-->

---

# SELECT — like / join

```java
// like：模糊查詢（% 符號放在值裡）
@Query("select p from PersonInfo p where p.city like %?1%")
List<PersonInfo> findByCityLike(String keyword);

// join：跨 Entity 查詢，回傳自訂 VO
@Query("select new com.example.demo.ch28.JoinVo(p.id, p.name, a.amount) "
     + "from PersonInfo p join Atm a on p.id = a.account")
List<JoinVo> joinPersonAndAtm();
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>join 的 VO：</b> 跨 Entity 查詢建議建立 VO 類別，用 <code>new 完整包路徑.VO(欄位...)</code> 語法取回特定欄位。VO 需要有對應的建構方法。
</div>

<!--
like 的 % 放在參數值裡，不是放在 SQL 字串裡——% 是模式的一部分，JPQL 的 %?1% 表示在值的前後各加 %。

join 查詢涉及多張表，回傳的欄位來自不同 Entity，所以要建立 VO 類別專門裝這些欄位。

VO 類別不需要加 @Entity，但要有包含所有查詢欄位的建構方法，而且 @Query 裡要寫 VO 的完整路徑（包含 package）。
-->

---

# JoinVo — 自訂回傳類別

`JoinVo` 是專門接收 join 查詢結果的類別，**不加 `@Entity`**，只需要一個建構方法：

```java
package com.example.demo.ch28;

public class JoinVo {

    private String id;
    private String name;
    private int amount;

    // 建構方法欄位順序必須和 @Query 的 new JoinVo(...) 完全一致
    public JoinVo(String id, String name, int amount) {
        this.id = id;
        this.name = name;
        this.amount = amount;
    }

    // Getter 和 Setter
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>兩個必要條件：</b> ① VO 有對應的建構方法 ② <code>@Query</code> 裡使用 VO 的<b>完整 package 路徑</b>（<code>com.example.demo.ch28.JoinVo</code>）
</div>

<!--
JoinVo 的建構方法參數順序要和 @Query 的 new JoinVo(p.id, p.name, a.amount) 完全一致。
JPA 是用建構方法來組裝回傳物件，順序錯了就會拿到錯誤的值或出現類型不符的例外。

VO 放在 vo 套件下是業界慣例，和 Entity 分開管理。
如果有 Lombok，可以加 @AllArgsConstructor + @Getter 省略手寫建構方法和 Getter。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6

## 分頁查詢

<!--
最後學分頁——取代 JPQL 不支援的 LIMIT。
-->

---

# 分頁查詢：Page / Pageable / PageRequest

JPA 的分頁 API 取代 SQL 的 `LIMIT`：

| 類型 | 說明 |
| --- | --- |
| `Pageable` | 介面，傳入 Repository 方法 |
| `PageRequest` | Pageable 的實作，呼叫時建立 |
| `Page<T>` | 回傳值，包含資料和分頁資訊 |
| `PageRequest.of(page, size)` | page 從 0 開始；size 每頁筆數 |

```java
// Repository 定義（回傳 Page）
Page<PersonInfo> findAll(Pageable pageable);

// 呼叫（第 1 頁，每頁 4 筆）
Page<PersonInfo> result =
    personInfoDao.findAll(PageRequest.of(0, 4));
```

<!--
分頁是業界非常常用的功能——清單 API 幾乎都需要分頁，不可能一次回傳全部資料。

PageRequest.of(0, 4) 的第一個參數是頁碼（從 0 開始），第二個是每頁筆數。

Page<T> 回傳的物件包含 getContent()（資料列表）、getTotalElements()（總筆數）、getTotalPages()（總頁數）等實用方法。
-->

---

# 分頁查詢 — 範例

10 筆資料，每頁 3 筆的分頁結果：

| 呼叫 | 回傳頁 | 資料索引 |
| --- | --- | --- |
| `PageRequest.of(0, 3)` | 第 1 頁 | index 0–2 |
| `PageRequest.of(1, 3)` | 第 2 頁 | index 3–5 |
| `PageRequest.of(2, 3)` | 第 3 頁 | index 6–8 |
| `PageRequest.of(3, 3)` | 第 4 頁 | index 9（最後 1 筆） |

**自訂查詢方法也支援分頁：**

```java
@Query("select p from PersonInfo p where p.city = :city")
Page<PersonInfo> findByCityPaging(
    @Param("city") String city, Pageable pageable);
```

<!--
分頁的 page 參數從 0 開始，這是初學者最常搞錯的地方。「第 1 頁」是 PageRequest.of(0, size)，不是 of(1, size)。

自訂查詢加 Pageable 參數的方式很統一：在方法最後加上 Pageable pageable 參數，回傳 Page<T>，JPA 自動處理分頁邏輯。

join 查詢因為不支援 LIMIT，也可以用這個方式限制回傳筆數：把 List 回傳型別改成 Page，或直接傳 Pageable。
-->

---
layout: default
---

# 練習準備：連上動態問卷資料庫
### 從這章開始，練習題都圍繞「動態問卷系統」

承接 MySQL 課，資料庫 `dynamic_survey` 已經有六張表（`sql/schema.sql`、`sql/seed.sql`）。在目前的練習專案：

1. 把 `application.properties` 的資料庫改成 `dynamic_survey`，並讓 Hibernate 只驗證、不建表：

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dynamic_survey?serverTimezone=Asia/Taipei&characterEncoding=utf-8
spring.jpa.hibernate.ddl-auto=validate
```

2. 新增 `Survey` Entity（先只對應 `surveys` 這一張表，題目、選項之後再加）：

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
從這一章開始，我們的練習不再用學生、課程，而是換成整個課程的貫穿專案：動態問卷系統。資料庫在 MySQL 課已經建好了，所以這裡的 ddl-auto 我們改成 validate：它不會建表、也不會改表，只會在啟動時檢查你的 Entity 跟資料庫的表對不對得上，對不上就直接報錯。這比 update 安全很多，因為資料庫的結構是我們在 MySQL 課精心設計的，不想被 Hibernate 偷偷改掉。

Entity 的欄位命名是駝峰式，startDate 會自動對應到資料庫的 start_date，這是 Spring Boot 預設的命名策略。
-->

---
layout: default
---

# 練習準備：連上動態問卷資料庫（續）
### 從這章開始，練習題都圍繞「動態問卷系統」

```java
@Entity
@Table(name = "surveys")
@Getter @Setter
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    @JdbcTypeCode(SqlTypes.TINYINT)   // 資料庫是 TINYINT，Java 用 Boolean
    private Boolean published;
}
```

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
⚠️ 易錯點：published 這個欄位，資料庫是 TINYINT，Java 用 Boolean。如果不加 @JdbcTypeCode(SqlTypes.TINYINT)，Hibernate 預設期待的是 BIT，validate 的時候會報型別對不上。Lombok 的 @Getter @Setter 是第 7 章安裝過的。
-->

---
layout: default
---

# 練習 1：用 @Query 實作複雜查詢
### 任務說明

在 `SurveyRepository`（`extends JpaRepository<Survey, Integer>`）中加入以下兩個自訂查詢方法：

| 方法 | 說明 |
| --- | --- |
| `findOngoing(LocalDate today)` | 查詢「進行中」的問卷：已發佈，且 `today` 介於開始與結束日期之間（含端點），依結束日期排序 |
| `updatePublished(Integer id, boolean published)` | 更新指定問卷的發佈狀態（後台的「發佈 / 取消發佈」） |

請確認：
1. 查詢方法使用命名參數 `:today`
2. 更新方法加上 `@Modifying`、`@Transactional`，回傳 `int`

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
這個練習把今天學的 @Query、命名參數、@Modifying 全部用上，而且是問卷系統前台列表真的會用到的查詢。

「進行中」的定義在課程規格書寫得很清楚：已發佈，並且今天在開始日期和結束日期之間，兩端都包含。

大家先自己寫，思考：查詢用 JPQL 還是 nativeQuery = true？更新呢？

提示：JPQL 裡的 Boolean 條件寫 s.published = true。

想好了再看提示！
-->

---

# 練習 1：解題提示

```java
@Query("select s from Survey s where s.published = true "
     + "and :today between s.startDate and s.endDate "
     + "order by s.endDate")
List<Survey> findOngoing(@Param("today") LocalDate today);

@Transactional
@Modifying
@Query("update Survey s set s.published = :published where s.id = :id")
int updatePublished(@Param("id") Integer id, @Param("published") boolean published);
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>成功標準：</b> 用範例資料，今天呼叫 <code>findOngoing(LocalDate.now())</code> 會得到 3 份問卷（午餐偏好、新品口味、課程回饋）；<code>updatePublished(5, true)</code> 回傳 1，不存在的 id 回傳 0。
</div>

<!--
:today between s.startDate and s.endDate 是 JPQL 的範圍語法，把參數放在前面、欄位放在 between 後面，等同 SQL 的 BETWEEN，兩端都包含。

JPQL 的表名和欄位名用的是 Entity 類別名和屬性名：Survey、startDate，不是資料庫的 surveys、start_date。這是 nativeQuery = false 的特色。

更新方法加了 @Modifying 和 @Transactional，回傳 int 代表影響行數。如果 id 不存在，回傳 0，呼叫端可以用這個數字判斷「有沒有更新到」。

⚠️ 用 @Query 寫日期時，不要自己在 JPQL 裡寫 CURRENT_DATE，而是從參數傳進來。這樣之後寫單元測試時，可以傳入固定的日期，測試結果才穩定。
-->

---
layout: default
---

# 練習 2：為查詢加上分頁與搜尋
### 任務說明

前台列表頁要「標題模糊搜尋 + 開始 / 結束日期區間 + 分頁」。請在 `SurveyRepository` 新增 `search` 方法：

1. 三個搜尋條件（`title`、`start`、`end`）**都可以省略**（傳 `null` 就不篩選）；`start`、`end` 的意思是「問卷的起訖日期要包含在這個區間內」
2. 加入 `Pageable` 參數，回傳型別為 `Page<Survey>`
3. 在 Service 呼叫時，用 `PageRequest.of(page, size, Sort.by(DESC, "id"))`，`size` 預設 10
4. Controller：`GET /surveys?title=&startDate=&endDate=&page=0&size=10`，回傳 `Page<Survey>`

<style>
.slidev-layout p, .slidev-layout li, .slidev-layout td, .slidev-layout th { font-size: 15px !important; line-height: 1.45 !important; }
.slidev-layout td, .slidev-layout th { padding: 4px 8px !important; }
.slidev-layout .text-sm { font-size: 14px !important; line-height: 1.4 !important; }
.slidev-layout .slidev-code-wrapper { max-width: none !important; }
.slidev-layout pre, .slidev-layout .shiki, .slidev-layout .slidev-code { padding: 0.7rem 1.2rem !important; width: calc(100% + 3rem) !important; margin-right: -3rem !important; }
.slidev-layout pre code, .slidev-layout .shiki code, .slidev-layout .line { font-size: 12.5px !important; line-height: 1.3 !important; }
</style>

<!--
分頁幾乎是所有清單 API 的標準配備，這個練習讓大家實際體驗一次完整流程：Repository、Service、Controller 全部串起來。

這題有一個比較進階的技巧：「條件可以省略」。做法是在 JPQL 裡寫 (:title is null or s.title like ...)，當參數是 null 時，整個條件就恆為真，等於沒有這個條件。

日期區間「包含」的意思：問卷的開始日期 >= 搜尋開始日期，並且問卷的結束日期 <= 搜尋結束日期。

用 Postman 呼叫後，觀察回傳的 JSON 結構，看看 Page 物件包含哪些分頁資訊。
-->

---

# 練習 2：解題提示（Repository）

```java
@Query("""
        select s from Survey s
        where (:title is null or s.title like concat('%', :title, '%'))
          and (:start is null or s.startDate >= :start)
          and (:end is null or s.endDate <= :end)
          and s.published = true
        """)
Page<Survey> search(@Param("title") String title,
                    @Param("start") LocalDate start,
                    @Param("end") LocalDate end,
                    Pageable pageable);
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>(:title is null or ...)</code> 是「可省略條件」的慣用寫法：傳 <code>null</code> 時整個括號恆為真。<code>"""</code> 是 Java 的文字區塊，可以直接換行寫長字串。
</div>

<!--
Repository 的重點是那三組「參數是 null 就不篩選」的括號。

Spring Data 遇到 Pageable 參數，會自動幫你加上 limit 和 offset，還會另外執行一次 count 查詢，取得符合條件的總筆數，所以回傳的 Page 才有 totalElements 和 totalPages。

concat('%', :title, '%') 是 JPQL 寫模糊搜尋的方式，不要直接把 % 寫在參數值裡。

⚠️ 易錯點：這裡把 s.published = true 直接寫在查詢裡，是因為前台只能看到已發佈的問卷。後台的列表要看到全部，之後在正式專案，我們會把它變成參數。
-->

---

# 練習 2：解題提示（Service 與 Controller）

```java
// Service
public Page<Survey> search(String title, LocalDate start, LocalDate end, int page, int size) {
    String keyword = (title == null || title.isBlank()) ? null : title.trim();
    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
    return surveyRepository.search(keyword, start, end, pageable);
}
```

```java
// Controller
@GetMapping("/surveys")
public Page<Survey> list(
        @RequestParam(name = "title", required = false) String title,
        @RequestParam(name = "startDate", required = false) LocalDate startDate,
        @RequestParam(name = "endDate", required = false) LocalDate endDate,
        @RequestParam(name = "page", defaultValue = "0") int page,
        @RequestParam(name = "size", defaultValue = "10") int size) {
    return surveyService.search(title, startDate, endDate, page, size);
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>成功標準：</b> <code>GET /surveys?title=調查&size=2</code> 回傳 JSON 含 <code>content</code>（最多 2 筆）、<code>totalElements</code>（4）、<code>totalPages</code>（2）；<code>page=1</code> 回傳第二頁。
</div>

<!--
Service 有一個小處理：把空白字串轉成 null。前端搜尋框如果什麼都沒輸入，可能送來空字串，如果不處理，like '%%' 雖然結果一樣，但是語意不清楚，轉成 null 更乾淨。

分頁的 page 參數從 0 開始，這是初學者最常搞錯的地方。「第 1 頁」是 PageRequest.of(0, size)，不是 of(1, size)。所以之後 Angular 的畫面顯示「第 1 頁」時，呼叫 API 要傳 page = 0。

Sort.by(DESC, "id") 讓最新的問卷排最前面。注意分頁一定要搭配排序，否則每次查詢的順序不保證一致，換頁時可能看到重複或漏掉的資料。

這裡直接回傳 Page<Survey> 是為了先體驗分頁；下一個練習章節，我們會學到 Entity 不應該直接回傳給前端，要包成 DTO。

日期參數 LocalDate 直接用 yyyy-MM-dd 格式傳，Spring Boot 就能自動轉換。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| JPQL | 操作 Entity 類別名和屬性名；跨資料庫 |
| nativeQuery = false | JPQL（預設）；表名用 Entity 類別名 |
| nativeQuery = true | 原生 SQL；表名用資料庫表格名 |
| 命名參數 | `:name` + `@Param("name")`，推薦使用 |
| @Modifying | UPDATE / DELETE / INSERT 必加 |
| clearAutomatically | 修改後清除 JPA 快取，避免讀到舊值 |
| INSERT | 只能 nativeQuery = true |
| 分頁 | `PageRequest.of(page, size)` + `Page<T>` 回傳 |

<!--
今天的重點總結。

最容易搞混的是：nativeQuery = false 用 Entity 名，nativeQuery = true 用資料庫名。記住：false 操作的是 Java 世界，true 操作的是資料庫世界。

學完今天，大家應該可以說：「我知道什麼時候用命名查詢、什麼時候用 @Query 了！」
-->

---
layout: end
---

# Q & A

<!--
今天的 @Query 與 JPQL 章節就到這裡。大家有任何問題嗎？
-->
