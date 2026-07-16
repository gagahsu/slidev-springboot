---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Data JPA 的用法（上）—設定與 CUD 操作
routeAlias: ch26
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
  <h1 style="color: #1a5c5c; font-size: 2.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Spring Data JPA 的用法（上）<br>設定與 CUD 操作
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「不用寫 SQL，用 Java 物件操作資料庫」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，前幾章我們學了 Spring JDBC——直接寫 SQL 來操作資料庫。

今天要介紹另一種主流的資料庫操作方式：Spring Data JPA。

Spring Data JPA 最大的特色是「幾乎不用寫 SQL」——我們只需要定義 Java 類別和 Repository 介面，Spring 就會自動幫我們產生 SQL 並執行。
-->

---
layout: default
---

# Outline

- **什麼是 Spring Data JPA？** — ORM 概念、與 Spring JDBC 的差異
- **設定 Spring Data JPA** — 依賴加入、application.properties 設定
- **`@Entity` 定義資料模型** — 把 Java 類別對應到資料庫表格
- **補充：`@IdClass` 複合主鍵** — 兩個欄位共同作為 Primary Key
- **`JpaRepository` 執行 CUD** — save()、deleteById() 用法
- **JpaRepository 完整方法表** — 內建 CRUD 方法一覽
- **章節總結** — 核心概念整理，下一章預告

<!--
今天先設定環境，再學 @Entity 定義資料模型，最後用 JpaRepository 執行新增、更新、刪除。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 前言

## 什麼是 Spring Data JPA？

<!--
先介紹 Spring Data JPA 是什麼，以及它和 Spring JDBC 的差別。
-->

---

# 什麼是 Spring Data JPA？

| 項目 | 說明 |
| --- | --- |
| 定義 | 「透過 ORM（物件關聯映射）的概念操作資料庫，幾乎不需要手寫 SQL」 |
| 核心概念 | ORM：把資料庫的表格映射成 Java 類別，操作物件等於操作資料庫 |
| 底層技術 | Hibernate（JPA 的實作框架） |
| 使用方式 | 定義 `@Entity` 類別 + 繼承 `JpaRepository` 介面 |

<!--
ORM 是 Object Relational Mapping 的縮寫，翻譯過來是「物件關聯映射」。

想像一下，如果資料庫有一張 student 資料表，ORM 就會把這張表格「映射」成一個 Java 的 Student 類別。
你對 Student 物件做的操作（新增、修改、刪除），ORM 底層會自動翻譯成 SQL 去執行。

所以寫 Spring Data JPA，我們更像是在操作 Java 物件，而不是在寫 SQL。
-->

---

# Spring Data JPA vs Spring JDBC

| 比較項目 | Spring JDBC（已學） | Spring Data JPA（本章） |
| --- | --- | --- |
| 操作方式 | 直接撰寫 SQL | 操作 Java 物件，ORM 自動產生 SQL |
| SQL 掌控權 | 高（自己寫） | 低（框架自動產生） |
| 學習曲線 | 低（懂 SQL 即可） | 中（需理解 ORM 概念） |
| 程式碼量 | 多（要寫 SQL + RowMapper） | 少（大部分由框架處理） |
| 適合情境 | 複雜查詢、需要精確控制 SQL | 標準 CRUD、快速開發 |

<!--
Spring JDBC 和 Spring Data JPA 各有優缺點。

Spring JDBC：直接寫 SQL，完全掌控，但程式碼較多。
Spring Data JPA：幾乎不寫 SQL，程式碼簡潔，但複雜查詢較難控制。

在實務上，兩者常常混搭使用：簡單 CRUD 用 JPA，複雜查詢用 Spring JDBC 或原生 SQL。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 設定 Spring Data JPA

<!--
先把環境設定好。
-->

---

# Step 1：在 build.gradle 加入依賴

需要 Spring Data JPA 和 MySQL 驅動程式：

```groovy
implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
implementation 'com.mysql:mysql-connector-j'
```

| 依賴 | 說明 |
| --- | --- |
| `spring-boot-starter-data-jpa` | 啟用 Spring Data JPA，包含 Hibernate、JpaRepository |
| `mysql-connector-j` | MySQL 驅動程式（和 Spring JDBC 時相同） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>加完依賴記得 Refresh：</b> 在 Eclipse 專案上按右鍵 → <b>Gradle → Refresh Gradle Project</b>，才會下載新的 jar 並套用到專案。
</div>

<!--
第一步，在 build.gradle 加入兩個依賴。

spring-boot-starter-data-jpa 包含了 Spring Data JPA 的所有功能，以及底層的 Hibernate ORM 框架。

MySQL 的驅動程式和 Spring JDBC 時用的完全一樣，如果你的專案已經有 mysql-connector-j，不需要重複加。

加完之後記得在 Eclipse 對專案按右鍵 → Gradle → Refresh Gradle Project，否則新依賴不會被下載進來。
-->

---

# Step 2：設定 application.properties

在原有的資料庫連線設定下，加入 JPA 相關設定：

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/myjdbc?serverTimezone=Asia/Taipei&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=（你的 MySQL 密碼）
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

<!--
前四行的 datasource 設定和 Spring JDBC 完全一樣，不需要修改。

新增的兩行 JPA 設定：
spring.jpa.hibernate.ddl-auto=update：讓 Hibernate 根據 @Entity 類別自動建立或更新資料表。
spring.jpa.show-sql=true：在 console 顯示 JPA 實際執行的 SQL，方便除錯。

⚠️ ddl-auto=update 在開發時很方便，但在正式環境應改為 validate 或 none，避免誤修改資料表結構。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 用 @Entity 定義資料模型

<!--
設定好環境之後，來學 @Entity——讓 JPA 認識我們的資料類別。
-->

---

# 什麼是 @Entity？

| 項目 | 說明 |
| --- | --- |
| `@Entity` | 標記這個 Java 類別對應一張資料庫表格 |
| `@Id` | 標記主鍵（Primary Key）欄位 |
| `@GeneratedValue` | 設定主鍵自動產生的策略 |
| `GenerationType.IDENTITY` | 資料庫自動遞增（Auto Increment），最常用 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>Spring Boot 3.x / 4.x 注意：</b> 需使用 <code>jakarta.persistence.*</code>，不是舊版的 <code>javax.persistence.*</code>。
</div>

<!--
@Entity 告訴 Spring Data JPA：「這個 Student 類別對應到資料庫的 student 資料表」。

@Id 標記哪個欄位是主鍵，通常是 id。
@GeneratedValue(strategy = GenerationType.IDENTITY) 告訴資料庫幫我們自動遞增 id，就像 MySQL 的 AUTO_INCREMENT。

⚠️ 特別注意：Spring Boot 3.x 之後（含 4.x），所有 JPA 相關的 import 都要用 jakarta.persistence，不能用舊版的 javax.persistence。
-->

---

# 建立 Student @Entity 類別

```java
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    // 需加上 Getter 和 Setter
}
```

<!--
看完整的 @Entity 類別範例。

import 使用 jakarta.persistence.*，這是 Spring Boot 3.x / 4.x 的正確寫法。

@Entity 加在類別上，@Id 和 @GeneratedValue 加在 id 欄位上。

name 欄位不需要加任何 Annotation，JPA 會自動把它映射到資料表的 name 欄位。

⚠️ 資料表名稱預設和類別名稱相同（大小寫不敏感），所以 Student 類別對應 student 資料表。如果名稱不同，需要加 @Table(name="自訂表名") Annotation。
-->

---

# 補充：@IdClass — 複合主鍵

當一張表需要用「兩個欄位一起」作為主鍵時，使用 `@IdClass`：

| 項目 | 說明 |
| --- | --- |
| 適用場景 | 複合主鍵（Composite Primary Key）— 多個欄位共同組成 PK |
| 步驟一 | 建立 ID 類別（實作 `Serializable`，覆寫 `equals` / `hashCode`） |
| 步驟二 | Entity 加 `@IdClass(MyId.class)`，每個 PK 欄位各加 `@Id` |
| Repository | 宣告改為 `JpaRepository<Entity, MyId>` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見場景：</b> 關聯表，例如「小工具-組織」對應表，widgetId + orgId 共同唯一識別一筆資料。
</div>

<!--
一般情況下主鍵只有一個欄位，但某些關聯表需要兩個欄位共同才能唯一識別一筆資料。

例如「小工具組織對應表」：同一個 widgetId 可以對應多個組織，同一個 orgId 也可以對應多個小工具。
不能只用 widgetId 或 orgId 當主鍵，需要用兩者的組合。

這就是 @IdClass 的使用時機。
-->

---

# 補充：@IdClass — 程式碼範例

**步驟一：建立 ID 類別（實作 Serializable）**

```java
public class WidgetOrgId implements Serializable {
    private String widgetId;
    private String orgId;
    // 需覆寫 equals() 和 hashCode()
}
```

**步驟二：Entity 加 @IdClass，每個 PK 欄位加 @Id**

```java
@Entity
@Table(name = "widget_org")
@IdClass(value = WidgetOrgId.class)
public class WidgetOrg {
    @Id
    @Column(name = "widget_id")
    private String widgetId;
    @Id
    @Column(name = "org_id")
    private String orgId;
}
```

<!--
步驟一：建立 WidgetOrgId 類別，實作 Serializable，包含所有 PK 欄位。
一定要覆寫 equals() 和 hashCode()，JPA 用這兩個方法判斷兩個主鍵是否相同。

步驟二：Entity 類別加 @IdClass(WidgetOrgId.class)，然後對每個 PK 欄位各加一個 @Id。
Entity 裡的欄位名稱要和 ID 類別的欄位名稱相同。

⚠️ Repository 宣告要改：JpaRepository<WidgetOrg, WidgetOrgId>，第二個泛型改成 ID 類別。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 用 JpaRepository 執行 CUD 操作

<!--
@Entity 定義好了，接下來學怎麼用 JpaRepository 操作資料庫。
-->

---

# 建立 StudentRepository

只需要繼承 `JpaRepository`，不用實作任何方法：

```java
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Integer> {
}
```

| 說明 | 詳情 |
| --- | --- |
| `JpaRepository<Student, Integer>` | 第一個泛型是 Entity 類別，第二個是主鍵類型 |
| 不需要實作方法 | Spring 在啟動時自動產生所有 CRUD 方法的實作 |
| 注入使用 | `@Autowired StudentRepository studentRepository` |

<!--
這是 Spring Data JPA 最令人驚艷的地方：我們只需要一個空的介面繼承 JpaRepository，所有 CRUD 方法就自動可用了。

JpaRepository<Student, Integer>：第一個泛型填 @Entity 類別，第二個填主鍵的類型。

Spring 在啟動時會自動幫我們建立這個介面的實作類別，我們只需要用 @Autowired 注入就能使用。
-->

---

# save() — 新增和更新

`save()` 一個方法同時負責新增（INSERT）和更新（UPDATE）：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class StudentDao {
    @Autowired
    private StudentRepository studentRepository;

    public void createStudent(String name) {
        Student student = new Student();
        student.setName(name);
        studentRepository.save(student);
    }
}
```

<!--
save() 是 JpaRepository 最常用的方法。

新增時：建立一個新的 Student 物件，不設定 id（讓資料庫自動產生），呼叫 save()。
JPA 判斷 id 為 null → 執行 INSERT。
-->

---

# save() — INSERT vs UPDATE 判斷邏輯

| 情況 | JPA 執行 |
| --- | --- |
| Student 的 id 為 `null` | 執行 `INSERT`，資料庫自動產生 id |
| Student 的 id 有值（已存在） | 執行 `UPDATE`，更新那筆資料 |

<!--
更新時：先查詢到某個 Student 物件（id 已知），修改欄位後，再呼叫 save()。
JPA 判斷 id 有值 → 執行 UPDATE WHERE id = ?。

一個 save()，兩種用途，非常簡潔。
-->

---

# deleteById() — 刪除

`deleteById()` 根據主鍵刪除對應的資料：

```java
studentRepository.deleteById(studentId);
```

| 說明 | 詳情 |
| --- | --- |
| 傳入主鍵值 | Spring 自動執行 `DELETE FROM student WHERE id = ?` |
| 類型對應 | 傳入 `Integer`（與 `JpaRepository<Student, Integer>` 的第二個泛型一致） |
| id 不存在時 | 拋出 `EmptyResultDataAccessException` 例外 |

<!--
deleteById() 非常簡單：傳入要刪除的 id，JPA 自動產生 DELETE SQL 執行。

⚠️ 注意：如果傳入的 id 在資料庫中不存在，deleteById() 會拋出例外，程式會出錯。
在實際開發中，通常要先確認資料存在才刪除，或用 existsById() 先檢查。

比較 Spring JDBC：需要手寫 DELETE SQL + map。JPA 只需要一行，框架自動處理。
-->

---

# JpaRepository 完整方法表

繼承 `JpaRepository` 後，以下方法全部自動可用：

| 分類 | 方法 | 說明 |
| --- | --- | --- |
| 查詢 | `findAll()` | 取得所有資料，回傳 `List<T>` |
| 查詢 | `findById(id)` | 根據 id 查詢，回傳 `Optional<T>` |
| 查詢 | `existsById(id)` | 判斷 id 是否存在，回傳 `boolean` |
| 查詢 | `count()` | 回傳資料筆數，回傳 `long` |
| 儲存 | `save(entity)` | INSERT（id 為 null）或 UPDATE（id 有值） |
| 儲存 | `saveAll(list)` | 批次儲存 |
| 刪除 | `deleteById(id)` | 根據 id 刪除 |
| 刪除 | `delete(entity)` | 刪除指定物件 |
| 刪除 | `deleteAll()` | 刪除所有資料 |
| 分頁 | `findAll(Pageable)` | 分頁查詢，回傳 `Page<T>`（下章介紹） |

<!--
這頁把 JpaRepository 內建的所有常用方法整理在一起，方便查閱。

查詢：findAll()、findById()、existsById()、count()。
儲存：save() 最常用，saveAll() 用於批次操作。
刪除：deleteById() 最常用。
分頁：findAll(Pageable) 會在後面的章節介紹。

這些方法都不需要自己實作，繼承 JpaRepository 就全部自動可用。
-->

---

# saveAll() — 批次新增

`saveAll()` 一次儲存多筆資料，效能優於迴圈逐筆 `save()`：

```java
List<Student> students = Arrays.asList(
    new Student("Alice"),
    new Student("Bob"),
    new Student("Carol")
);
studentRepository.saveAll(students);
```

| 說明 | 詳情 |
| --- | --- |
| 傳入 `List<T>` | 每筆 id 為 null → 全部執行 `INSERT` |
| 回傳 `List<T>` | 回傳儲存後的物件（含資料庫自動產生的 id） |
| 效能 | 批次操作，比迴圈 `save()` 減少往返次數 |

<!--
saveAll() 是 JpaRepository 內建的批次操作方法。
當 List 裡每筆的 id 都是 null，JPA 執行批次 INSERT，資料庫自動產生 id。
如果部分物件的 id 已有值，JPA 會改執行 UPDATE。
-->

---

# 章節總結（一）：設定與資料模型

| 重點 | 說明 |
| --- | --- |
| Spring Data JPA | ORM 框架，幾乎不寫 SQL，操作物件等於操作資料庫 |
| build.gradle | `spring-boot-starter-data-jpa` |
| `@Entity` | 標記 Java 類別對應資料庫表格 |
| `@Id` + `@GeneratedValue` | 標記主鍵 + 設定自動遞增 |
| `@IdClass` | 複合主鍵：建 ID 類別（實作 Serializable）+ Entity 加 `@IdClass` + 每個 PK 欄位加 `@Id` |
| Spring Boot 3.x / 4.x | 使用 `jakarta.persistence.*`，非 `javax.persistence.*` |

---

# 章節總結（二）：Repository 與操作

| 重點 | 說明 |
| --- | --- |
| `JpaRepository` | 繼承後自動擁有所有 CRUD 方法，不需要實作 |
| `save()` | id 為 null → INSERT；id 有值 → UPDATE |
| `deleteById()` | 根據 id 執行 DELETE；id 不存在會拋出例外 |

<!--
設定與資料模型的重點：

Spring Data JPA 用 ORM 概念，不寫 SQL。
build.gradle 加 spring-boot-starter-data-jpa。
@Entity 對應資料表，@Id + @GeneratedValue 處理主鍵。
Spring Boot 3.x / 4.x 記得用 jakarta.persistence.*。
-->

<!--
Repository 與操作的重點：

繼承 JpaRepository 就自動得到所有 CRUD 方法。
save()：id 為 null 執行 INSERT，id 有值執行 UPDATE。
deleteById()：id 不存在會拋出例外，注意處理。

下一章繼續學查詢操作：findAll() 和 findById()。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
