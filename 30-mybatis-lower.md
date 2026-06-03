---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: MyBatis 的用法（中）—執行查詢操作
routeAlias: ch30
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem;">
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    MyBatis 的用法（中）<br>執行查詢操作
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用 @Select 查詢，MyBatis 自動映射結果」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，上一章我們學了 MyBatis 的設定，以及 @Insert、@Update、@Delete 的用法。

今天是中篇——學習 @Select，用 MyBatis 從資料庫查詢資料。

MyBatis 的查詢特別之處在於「自動映射」——只要資料庫欄位名稱和 Java 物件的屬性名稱一致，MyBatis 會自動把查詢結果映射成 Java 物件，不需要像 Spring JDBC 那樣手寫 RowMapper。
-->

---
layout: default
---

# Outline

- **`@Select` 用法介紹** — SQL 寫在 Annotation、自動映射機制說明
- **使用 `@Select` 查詢資料** — 查全部、查單筆實作
- **`@Select` 用法總結** — 與 Spring JDBC RowMapper 的差異比較
- **章節總結** — 三種框架 CRUD 全部學齊

<!--
今天的核心是 @Select 和 MyBatis 的自動映射機制。學完之後，三種框架的 CRUD 操作就全部學齊了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## @Select 方法的用法介紹

<!--
先了解 @Select 的架構和它的自動映射機制。
-->

---

# @Select vs 其他框架的查詢方式

| 比較項目 | Spring JDBC | Spring Data JPA | MyBatis |
| --- | --- | --- | --- |
| 查詢方式 | `query(sql, map, rowMapper)` | `findAll()` / 方法命名 | `@Select("SQL")` |
| 結果映射 | 手寫 RowMapper | 自動（@Entity 定義） | 自動（欄位名稱對應） |
| SQL 掌控 | 最高 | 低（框架決定） | 高（自己寫） |
| 程式碼量 | 最多 | 最少 | 中等 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>MyBatis 的優勢：</b> 自己寫 SQL（掌控性高），但不需要 RowMapper（比 Spring JDBC 簡潔）。
</div>

<!--
用表格比較三種框架的查詢方式，可以清楚看到 MyBatis 的定位。

Spring JDBC：SQL 自己寫，但需要 RowMapper 手動映射，最繁瑣。
Spring Data JPA：幾乎不寫 SQL，最簡潔，但複雜查詢受限。
MyBatis：SQL 自己寫，但自動映射，兼顧掌控性和簡潔性。
-->

---

# MyBatis 的自動映射機制

| 條件 | 說明 |
| --- | --- |
| 欄位名稱一致 | 資料庫欄位 `name` ↔ Java 屬性 `name`，自動映射 |
| 類型對應 | `VARCHAR` → `String`，`INT` → `Integer`，自動轉換 |
| 不需要 RowMapper | MyBatis 自動完成 ResultSet → Java 物件的轉換 |
| 命名不一致時 | 可用 `@Results` 和 `@Result` 手動指定映射關係 |

<!--
MyBatis 的自動映射比 Spring JDBC 方便很多。

只要資料庫的欄位名稱和 Java 物件的屬性名稱一致，MyBatis 就會自動把查詢結果映射到物件上，完全不需要 RowMapper。

例如 SELECT id, name FROM student，MyBatis 自動把 id 填進 Student.id，name 填進 Student.name。

如果欄位名稱不一致（例如資料庫是 student_name，Java 是 name），可以用 @Results 手動指定，但入門階段先讓欄位名稱一致就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 使用 @Select 查詢數據

<!--
了解了自動映射，來看程式碼範例。
-->

---

# @Select — 查詢所有學生

在 `StudentMapper` 介面中定義查詢方法：

```java
@Select("SELECT id, name FROM student")
List<Student> findAll();
```

| 說明 | 詳情 |
| --- | --- |
| `@Select("SQL")` | SELECT SQL 直接寫在 Annotation 字串 |
| 回傳 `List<Student>` | MyBatis 自動把每行資料映射成一個 Student 物件 |
| 不需要 RowMapper | 欄位名稱和屬性名稱一致，自動映射 |

<!--
看 @Select 的範例，非常簡潔。

一行 SQL Annotation，一行方法宣告，就能查詢所有學生資料。

和 Spring JDBC 相比：Spring JDBC 需要 sql 字串 + 空 Map + StudentRowMapper + query()，至少四行。
MyBatis 只需要一行 @Select + 一行方法宣告，差異很明顯。
-->

---

# @Select — 根據 id 查詢單筆學生

```java
@Select("SELECT id, name FROM student WHERE id = #{id}")
Student findById(@Param("id") Integer id);
```

| 說明 | 詳情 |
| --- | --- |
| `WHERE id = #{id}` | `#{id}` 對應方法的 `Integer id` 參數 |
| `@Param("id")` | Spring Boot 3.2+ 需明確指定，否則參數名稱無法反射取得 |
| 回傳 `Student` | 查詢單筆時直接回傳物件（非 Optional） |
| id 不存在時 | 回傳 `null`（不同於 JPA 的 Optional） |

<!--
查詢單筆學生，在 SQL 加上 WHERE 條件，用 #{id} 對應方法的參數。

注意 MyBatis 的查詢方法回傳值是 Student，不是 Optional<Student>（JPA 的做法）。
如果 id 不存在，MyBatis 回傳 null。

這是和 Spring Data JPA 的差異點：JPA 用 Optional 保護 null，MyBatis 直接回傳 null，使用時需要自己做 null 檢查。
-->

---

# 呼叫 @Select 方法

在 `StudentDao` 中注入 `StudentMapper`，包裝成方法供外部呼叫：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class StudentDao {
    @Autowired
    private StudentMapper studentMapper;

    public List<Student> getStudentList() {
        return studentMapper.findAll();
    }

    public Student getStudentById(Integer studentId) {
        return studentMapper.findById(studentId);
    }
}
```

<!--
使用方式和 Spring Data JPA 的 Repository 非常相似。

@Autowired 注入 StudentMapper，直接呼叫定義好的方法。

不需要手動建立 SQL 字串、不需要 Map、不需要 RowMapper，MyBatis 在背後全部處理好了。

呼叫 findAll() 回傳 List<Student>，可以直接 return 給 Controller；呼叫 findById(id) 回傳 Student 物件，記得做 null 檢查。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## @Select 方法的用法總結

<!--
補充更多查詢場景，並做整體總結。
-->

---

# 帶多個條件的查詢

當 SQL 有多個動態條件時，使用 `@Param` 明確指定參數名稱：

```java
@Select("SELECT id, name FROM student WHERE id = #{id} AND name = #{name}")
Student findByIdAndName(@Param("id") Integer id, @Param("name") String name);
```

<!--
當方法有多個基本類型參數時，需要加 @Param("名稱") 告訴 MyBatis 每個參數對應哪個 #{} 佔位符。

不加 @Param 的話，MyBatis 無法判斷 #{id} 對應哪個參數，會出錯。

當方法參數是物件時（如 Student），不需要 @Param，直接用 #{欄位名} 就能對應。
-->

---

# MyBatis 四個 SQL Annotation 總覽

| Annotation | 對應 SQL | 回傳值 | 用途 |
| --- | --- | --- | --- |
| `@Insert` | INSERT | `int`（影響行數） | 新增資料 |
| `@Update` | UPDATE | `int`（影響行數） | 更新資料 |
| `@Delete` | DELETE | `int`（影響行數） | 刪除資料 |
| `@Select` | SELECT | `物件` 或 `List<物件>` | 查詢資料 |

<!--
用這張表格把 MyBatis 的四個 SQL Annotation 放在一起比較。

四個 Annotation 分別對應 SQL 的 INSERT、UPDATE、DELETE、SELECT，和 CRUD 完全對應。

CUD 的回傳值都是 int（影響行數），Select 的回傳值根據查詢結果是否為多筆，分別是物件或 List<物件>。
-->

---

# 三種框架 CRUD 實作比較

| 操作 | Spring JDBC | Spring Data JPA | MyBatis |
| --- | --- | --- | --- |
| 新增 | `update(INSERT SQL, map)` | `save(entity)` | `@Insert("SQL")` |
| 更新 | `update(UPDATE SQL, map)` | `save(entity)` | `@Update("SQL")` |
| 刪除 | `update(DELETE SQL, map)` | `deleteById(id)` | `@Delete("SQL")` |
| 查詢全部 | `query(sql, map, rowMapper)` | `findAll()` | `@Select("SQL")` |
| 查詢單筆 | `query(sql+WHERE, map, rowMapper)` | `findById(id)` | `@Select("SQL+WHERE")` |

<!--
用這張表格做最終的三框架比較總覽。

Spring JDBC：最靈活，完全掌控，但程式碼最多。
Spring Data JPA：最簡潔，幾乎不寫 SQL，但複雜查詢較受限。
MyBatis：介於中間，SQL 精確，程式碼比 JDBC 少，比 JPA 靈活。

三種框架各有優缺點，在實務上可以根據場景混搭使用。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| `@Select` | SELECT SQL 寫在 Annotation 裡，自動映射到 Java 物件 |
| 自動映射 | 欄位名稱和屬性名稱一致時，不需要 RowMapper |
| 回傳 null | id 不存在時回傳 null（非 Optional） |
| `@Param` | 多個 primitive 參數時，需用 @Param 指定名稱 |
| 三框架 CRUD | Spring JDBC / JPA / MyBatis 各有優缺點，可混搭使用 |

<!--
今天的重點總結。

第一，@Select 把 SELECT SQL 寫在 Annotation，MyBatis 自動映射結果。
第二，欄位名稱和屬性名稱一致時，自動映射不需要 RowMapper。
第三，查詢不到資料時回傳 null，記得做 null 檢查。
第四，多個 primitive 參數時需要加 @Param。
第五，三種框架 CRUD 全部學完，可以根據需求選擇或混搭使用。

下一章學 MyBatis XML Mapper 的寫法——用 XML 檔管理複雜的 SQL，特別適合多條件動態查詢。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
