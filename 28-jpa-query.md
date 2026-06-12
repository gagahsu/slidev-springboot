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

# 練習 1：用 @Query 實作複雜查詢
### 任務說明

在 `StudentRepository` 中加入以下兩個自訂查詢方法：

| 方法 | 說明 |
| --- | --- |
| `findByScoreRange(int min, int max)` | 查詢分數在 min~max 之間的學生（含端點） |
| `updateScoreById(int id, int score)` | 更新指定 id 的學生分數 |

請確認：
1. 查詢方法使用命名參數 `:min`、`:max`
2. 更新方法加上 `@Modifying`、`@Transactional`，回傳 `int`

<!--
這個練習把今天學的 @Query、命名參數、@Modifying 全部用上。

大家先自己寫，思考：查詢用 JPQL 還是 nativeQuery = true？更新呢？

想好了再看提示！
-->

---

# 練習 1：解題提示

```java
@Query("select s from Student s where s.score between :min and :max")
List<Student> findByScoreRange(@Param("min") int min,
                               @Param("max") int max);

@Transactional
@Modifying
@Query("update Student set score = :score where id = :id")
int updateScoreById(@Param("id") int id, @Param("score") int score);
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>成功標準：</b> 用 Postman 呼叫 API，查詢分數 60~80 的學生，以及更新某個學生分數後再查詢確認。
</div>

<!--
between :min and :max 是 JPQL 的範圍語法，等同 SQL 的 BETWEEN。

更新方法加了 @Modifying 和 @Transactional，回傳 int 代表影響行數。如果 id 不存在，回傳 0。
-->

---
layout: default
---

# 練習 2：為查詢加上分頁
### 任務說明

承接練習 1，將 `findByScoreRange` 改成支援分頁的版本：

1. 修改方法簽名，加入 `Pageable` 參數，回傳型別改為 `Page<Student>`
2. 在 Service 層呼叫時，傳入 `PageRequest.of(0, 5)`（第 1 頁，每頁 5 筆）
3. 在 Controller 回傳 `Page<Student>`，前端可取得 `content`（資料）和 `totalElements`（總筆數）

<!--
分頁幾乎是所有清單 API 的標準配備，這個練習讓大家實際體驗一次完整流程。

用 Postman 呼叫後，觀察回傳的 JSON 結構，看看 Page 物件包含哪些分頁資訊。
-->

---

# 練習 2：解題提示

```java
@Query("select s from Student s where s.score between :min and :max")
Page<Student> findByScoreRangePaging(
    @Param("min") int min,
    @Param("max") int max,
    Pageable pageable);
```

Service 呼叫：

```java
Page<Student> result = studentRepo.findByScoreRangePaging(
    60, 80, PageRequest.of(0, 5));
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>成功標準：</b> 回傳 JSON 含 <code>content</code>（最多 5 筆）、<code>totalElements</code>（符合條件的總筆數）、<code>totalPages</code>。
</div>

<!--
Pageable 的 import 是 org.springframework.data.domain.Pageable。
PageRequest 的 import 是 org.springframework.data.domain.PageRequest。

Page<T> 回傳的 JSON 會包含很多分頁相關的欄位，前端可以直接用 content 取資料、totalPages 知道共幾頁。
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
