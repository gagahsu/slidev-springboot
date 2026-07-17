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
- **`@Entity` 定義資料模型** — 把 Java 類別對應到資料庫表格、Entity 為何不用 `@Data`
- **補充：`@IdClass` 複合主鍵** — 兩個欄位共同作為 Primary Key
- **`JpaRepository` 執行 CUD** — save()、deleteById() 用法
- **JpaRepository 完整方法表** — 內建 CRUD 方法一覽
- **串接三層式架構** — Controller + Service + Dao 完整程式碼與 Postman 測試
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
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
}
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Getter / Setter 用 Lombok 生成：</b> <code>@Getter</code> + <code>@Setter</code> 自動產生所有欄位的 Getter 和 Setter，不用手寫。為什麼不用更方便的 <code>@Data</code>？下一頁說明。
</div>

<!--
看完整的 @Entity 類別範例。

import 使用 jakarta.persistence.*，這是 Spring Boot 3.x / 4.x 的正確寫法。

@Entity 加在類別上，@Id 和 @GeneratedValue 加在 id 欄位上。

name 欄位不需要加任何 Annotation，JPA 會自動把它映射到資料表的 name 欄位。

Getter 和 Setter 交給 Lombok：@Getter + @Setter 兩個 Annotation 自動生成，程式碼保持乾淨。
有同學可能想用之前學過的 @Data 一次搞定——技術上可以，但 Entity 上用 @Data 有坑，下一頁詳細說明。

⚠️ 資料表名稱預設和類別名稱相同（大小寫不敏感），所以 Student 類別對應 student 資料表。如果名稱不同，需要加 @Table(name="自訂表名") Annotation。
-->

---

# 為什麼 Entity 不建議用 @Data？

`@Data` = `@Getter` + `@Setter` + `@ToString` + `@EqualsAndHashCode` + `@RequiredArgsConstructor`，後面兩個在 Entity 上會出問題：

| 問題 | 原因 |
| --- | --- |
| `equals()` / `hashCode()` 用**全部欄位**計算 | 新增前 `id` 是 `null`，`save()` 後 `id` 有值 → `hashCode` 改變，物件放進 `HashSet` / `HashMap` 後會「找不到自己」 |
| `toString()` 印出**全部欄位** | 之後學到 `@OneToMany` 等關聯欄位（Lazy Loading）時，印 log 會觸發額外查詢，甚至拋出 `LazyInitializationException` |

| 類別 | 建議寫法 |
| --- | --- |
| **Entity**（對應資料表） | `@Getter` + `@Setter` ✅ |
| **DTO / Request / Response**（單純傳資料） | `@Data` 沒問題 ✅ |

<!--
之前的章節教過 @Data，一個 Annotation 搞定 Getter、Setter、toString、equals、hashCode。
但在 Entity 上，業界的慣例是「不用 @Data，只用 @Getter + @Setter」，原因有兩個：

第一，equals() 和 hashCode()。@Data 生成的版本用「全部欄位」計算，
但 Entity 的 id 在新增前是 null、save() 之後才有值——同一個物件的 hashCode 前後不一致，
一旦放進 HashSet 或 HashMap，就會發生「明明加進去了卻找不到」的詭異 bug。

第二，toString()。@Data 生成的版本印出全部欄位，
之後學到 @OneToMany 這類延遲載入（Lazy Loading）的關聯欄位時，
印一行 log 就可能觸發額外的資料庫查詢，甚至在交易結束後拋出 LazyInitializationException。

所以記住這個慣例：Entity 用 @Getter + @Setter；DTO 這種單純傳資料的類別，@Data 隨便用沒問題。
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
💡 <b>常見場景：</b> 關聯表，例如「選課表」<code>student_course</code>，studentId + courseId 共同唯一識別「某個學生選了某門課」。
</div>

<!--
一般情況下主鍵只有一個欄位，但某些關聯表需要兩個欄位共同才能唯一識別一筆資料。

例如「選課表」：同一個學生可以選多門課，同一門課也有多個學生選。
不能只用 studentId 或 courseId 當主鍵，「哪個學生選了哪門課」要用兩者的組合才能唯一識別。

這就是 @IdClass 的使用時機。
-->

---

# 補充：@IdClass — 程式碼範例

**步驟一：建立 ID 類別（實作 Serializable）**

```java
public class StudentCourseId implements Serializable {
    private Integer studentId;
    private Integer courseId;
    // 需覆寫 equals() 和 hashCode()
}
```

**步驟二：Entity 加 @IdClass，每個 PK 欄位加 @Id**

```java
@Entity
@Table(name = "student_course")
@IdClass(value = StudentCourseId.class)
public class StudentCourse {
    @Id
    @Column(name = "student_id")
    private Integer studentId;
    @Id
    @Column(name = "course_id")
    private Integer courseId;
}
```

<!--
步驟一：建立 StudentCourseId 類別，實作 Serializable，包含所有 PK 欄位。
一定要覆寫 equals() 和 hashCode()，JPA 用這兩個方法判斷兩個主鍵是否相同。

步驟二：Entity 類別加 @IdClass(StudentCourseId.class)，然後對每個 PK 欄位各加一個 @Id。
Entity 裡的欄位名稱要和 ID 類別的欄位名稱相同。

⚠️ Repository 宣告要改：JpaRepository<StudentCourse, StudentCourseId>，第二個泛型改成 ID 類別。
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
import org.springframework.stereotype.Repository;

@Repository
public class StudentDao {

    private final StudentRepository studentRepository;

    public StudentDao(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public void createStudent(String name) {
        Student student = new Student();
        student.setName(name);
        studentRepository.save(student);
    }
}
```

<!--
save() 是 JpaRepository 最常用的方法。

Dao 的寫法和 Spring JDBC 章節一樣：@Repository + 建構子注入，只是注入的對象從 NamedParameterJdbcTemplate 換成 StudentRepository。

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
Student s1 = new Student();
s1.setName("Alice");
Student s2 = new Student();
s2.setName("Bob");

studentRepository.saveAll(Arrays.asList(s1, s2));
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
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## 串接三層式架構

<!--
CUD 方法都會用了，和 Spring JDBC 章節一樣的問題：誰來呼叫 Dao？
這一節補上 Service 和 Controller，讓前端能透過 API 操作資料庫。
-->

---

# 回顧：三層式架構的呼叫鏈

架構和 Spring JDBC 章節**完全相同**，只有 Dao 的內部實作換了：

| 分層 | 類別 | 這一章的寫法 |
| --- | --- | --- |
| Controller | `StudentController` | 和 ch24 一樣：POST / PUT / DELETE 三個 API |
| Service | `StudentService` | 和 ch24 一樣：轉呼叫 Dao |
| Dao | `StudentDao` | **不寫 SQL**，改呼叫 `JpaRepository` 的方法 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>分層的好處：</b> 從 Spring JDBC 換成 JPA，只需要改 Dao 這一層——Controller 和 Service 一行都不用動。
</div>

<!--
把 Service 和 Controller 補上，前端才能透過 API 操作資料庫。

重點：三層式架構和 Spring JDBC 章節完全相同，唯一的差別在 Dao 的內部——
之前是手寫 SQL + NamedParameterJdbcTemplate，現在是呼叫 JpaRepository 的方法。

這正是分層架構的價值：底層技術從 JDBC 換成 JPA，上面的 Controller 和 Service 完全不受影響。
-->

---

# StudentDao — 補上修改與刪除

`createStudent()` 已經寫好，補上 `updateStudent()` 和 `deleteStudent()`：

```java
    public void updateStudent(Student student) {
        // student 的 id 有值 → save() 執行 UPDATE
        studentRepository.save(student);
    }

    public void deleteStudent(Integer studentId) {
        studentRepository.deleteById(studentId);
    }
```

| 方法 | 呼叫 | JPA 執行的 SQL |
| --- | --- | --- |
| `updateStudent()` | `save(student)`（id 有值） | `UPDATE student SET name = ? WHERE id = ?` |
| `deleteStudent()` | `deleteById(studentId)` | `DELETE FROM student WHERE id = ?` |

<!--
Dao 補上另外兩個方法，都是前面學過的內容：

updateStudent()：一樣呼叫 save()，但這次傳進來的 student 物件 id 有值，JPA 判斷後執行 UPDATE。
deleteStudent()：轉呼叫 deleteById()。

比較 Spring JDBC 的 Dao：每個方法都要寫 SQL 字串 + Map。JPA 的 Dao 每個方法都只有一行。
-->

---

# StudentService（1/2）— 注入 Dao、新增與刪除

和 ch24 完全相同：`@Service` + 建構子注入，`createStudent()` 和 `deleteStudent()` 單純轉呼叫：

```java
@Service
public class StudentService {

    private final StudentDao studentDao;

    public StudentService(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public void createStudent(Student student) {
        studentDao.createStudent(student);
    }

    public void deleteStudent(Integer studentId) {
        studentDao.deleteStudent(studentId);
    }
}
```

<!--
Service 層和 ch24 一模一樣，一行都不用改的意思就是這樣——直接看程式碼複習：

createStudent 和 deleteStudent 單純轉呼叫：收到什麼參數，原封不動傳給 Dao。

注意：因為 createStudent 現在收整個 Student 物件，Dao 的 createStudent 簽名也改成收 Student，直接 save。

下一頁的 updateStudent 一樣是 Service「做事」的例子。
-->

---

# StudentService（2/2）— 修改：組裝資料

`updateStudent()` 一樣負責把 URL 的 id 組回 `student` 物件：

```java
    public void updateStudent(Integer studentId, Student student) {
        // URL 的 id 設回 student 物件
        student.setId(studentId);

        // id 有值 → Dao 的 save() 執行 UPDATE
        studentDao.updateStudent(student);
    }
```

| 資料 | 來源 | 用途 |
| --- | --- | --- |
| `studentId` | URL 路徑（`@PathVariable`） | 決定 UPDATE「哪一筆」 |
| `student.name` | Request body（`@RequestBody`） | 要改「成什麼」 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>和 ch24 的差別：</b> ch24 設 id 是為了給 SQL 的 <code>WHERE</code> 條件取值；這一章設 id 是讓 <code>save()</code> 判斷「id 有值」而執行 UPDATE——組裝動作相同，背後機制不同。
</div>

<!--
updateStudent 和 ch24 一樣負責組裝資料：把 URL 收到的 studentId 設回 student 物件。

但背後的機制不同，值得點出來：
ch24 設 id，是因為 Dao 的 SQL 要從 student.getId() 取 WHERE 條件的值；
這一章設 id，是讓 JPA 的 save() 判斷「id 有值」，進而執行 UPDATE 而不是 INSERT。

組裝的動作一模一樣，但一個是給 SQL 用，一個是給 ORM 判斷用——這就是換底層技術時，Service 不用改的原因。
-->

---

# StudentController（1/2）— 注入 Service、新增 API

和 ch24 完全相同：注入 Service、不直接碰 Dao：

```java
@RestController
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/students")
    public String create(@RequestBody Student student) {
        studentService.createStudent(student);
        return "新增成功";
    }
}
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>差別在 body：</b> ch24 的 POST 要自己帶 id；這一章 id 由 <code>@GeneratedValue</code> 自動產生，body 只需要 <code>{"name": "Judy"}</code>。
</div>

<!--
Controller 和 ch24 完全一樣：注入 StudentService，不直接碰 Dao。

POST /students 新增，body 的 JSON 由 @RequestBody 轉成 Student 物件。
和 ch24 唯一的差別：body 不用帶 id，@GeneratedValue 讓資料庫自動產生。
-->

---

# StudentController（2/2）— 修改與刪除 API

`PUT` 和 `DELETE` 一樣用 `@PathVariable` 從 URL 取得 id：

```java
    @PutMapping("/students/{studentId}")
    public String update(@PathVariable(name = "studentId") Integer studentId,
                         @RequestBody Student student) {
        studentService.updateStudent(studentId, student);
        return "修改成功";
    }

    @DeleteMapping("/students/{studentId}")
    public String delete(@PathVariable(name = "studentId") Integer studentId) {
        studentService.deleteStudent(studentId);
        return "刪除成功";
    }
```

| API | URL 的 id | Request Body |
| --- | --- | --- |
| `PUT`（修改） | 要改哪一筆（WHERE） | 要改成什麼（新的 `name`） |
| `DELETE`（刪除） | 要刪哪一筆（WHERE） | 不需要 |

<!--
修改和刪除的 API，和 ch24 一模一樣：

PUT /students/{studentId}：「改哪一筆」在 URL、「改成什麼」在 body。
DELETE /students/{studentId}：只需要 URL 的 id。

Controller 只注入 Service，不直接碰 Dao——三層式架構的規矩不變。
-->

---

# 用 Postman 測試三層式架構

啟動 Spring Boot，依序測試三個 API，並觀察 console 印出的 SQL：

| 操作 | HTTP 方法 + URL | Request Body（JSON） | 預期結果 |
| --- | --- | --- | --- |
| 新增 | `POST /students` | `{"name": "Judy"}` | 資料表多一筆 Judy，id 自動產生 |
| 修改 | `PUT /students/1` | `{"name": "John"}` | id=1 的 name 變成 John |
| 刪除 | `DELETE /students/1` | 不需要 | id=1 那筆資料消失 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>觀察兩件事：</b> ① MySQL Workbench 用 <code>SELECT * FROM student</code> 確認資料變化；② console 因為 <code>spring.jpa.show-sql=true</code>，會印出 JPA 自動產生的 INSERT / UPDATE / DELETE SQL。
</div>

<!--
最後實際測試整條鏈路。

和 ch24 的測試幾乎一樣，但有兩個差異值得注意：

第一，POST 的 body 不用帶 id——@GeneratedValue 讓資料庫自動產生，這是和 ch24 手動指定 id 不同的地方。

第二，console 會印出 JPA 產生的 SQL（因為設定了 spring.jpa.show-sql=true）。
打 POST 會看到 insert into student...，打 PUT 會看到先 select 再 update——
親眼確認「我們沒寫 SQL，但 JPA 幫我們寫了」。
-->

---

# 章節總結（一）：設定與資料模型

| 重點 | 說明 |
| --- | --- |
| Spring Data JPA | ORM 框架，幾乎不寫 SQL，操作物件等於操作資料庫 |
| build.gradle | `spring-boot-starter-data-jpa` |
| `@Entity` | 標記 Java 類別對應資料庫表格 |
| `@Id` + `@GeneratedValue` | 標記主鍵 + 設定自動遞增 |
| Lombok | Entity 用 `@Getter` + `@Setter`，不用 `@Data`（equals/hashCode 與 toString 有坑） |
| `@IdClass` | 複合主鍵：建 ID 類別（實作 Serializable）+ Entity 加 `@IdClass` + 每個 PK 欄位加 `@Id` |
| Spring Boot 3.x / 4.x | 使用 `jakarta.persistence.*`，非 `javax.persistence.*` |

---

# 章節總結（二）：Repository 與操作

| 重點 | 說明 |
| --- | --- |
| `JpaRepository` | 繼承後自動擁有所有 CRUD 方法，不需要實作 |
| `save()` | id 為 null → INSERT；id 有值 → UPDATE |
| `deleteById()` | 根據 id 執行 DELETE；id 不存在會拋出例外 |
| 三層式架構 | Controller / Service 和 ch24 完全相同，只有 Dao 從手寫 SQL 換成呼叫 `JpaRepository` |

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
