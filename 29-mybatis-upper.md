---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: MyBatis 的用法（上）—設定與 CUD 操作
routeAlias: ch29
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
    MyBatis 的用法（上）<br>設定與 CUD 操作
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「SQL 寫在 Annotation 裡，兼顧掌控性與簡潔性」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，我們已經學了 Spring JDBC 和 Spring Data JPA 兩種資料庫操作方式。

今天要介紹第三種：MyBatis。

MyBatis 的定位介於兩者之間——像 Spring JDBC 一樣需要寫 SQL，但 SQL 直接寫在 Annotation 裡，用 @Mapper 介面來定義操作，比 Spring JDBC 更簡潔，同時保有對 SQL 的完整控制。
-->

---
layout: default
---

# Outline

- **什麼是 MyBatis？** — 定位、與 Spring JDBC 及 JPA 的差異
- **設定 MyBatis** — 依賴加入、application.properties 設定
- **`@Mapper` 介面定義操作** — 介面即 Dao，不需要實作類別
- **`@Insert`、`@Update`、`@Delete` 執行 CUD** — SQL 寫在 Annotation 中
- **章節總結** — MyBatis CUD 整理，下一章預告

<!--
今天先介紹 MyBatis 的特色，然後設定環境，最後學 CUD 三個操作的寫法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 前言

## 什麼是 MyBatis？

<!--
先來認識 MyBatis 在三種資料庫框架中的定位。
-->

---

# 什麼是 MyBatis？

| 項目 | 說明 |
| --- | --- |
| 定義 | 一個半自動化的 ORM 框架，SQL 由開發者自行撰寫 |
| 特色 | SQL 寫在 Annotation（或 XML）中，映射到 Java 方法 |
| 核心概念 | `@Mapper` 介面 + SQL Annotation（`@Select`、`@Insert` 等） |
| 參數語法 | 用 `#{paramName}` 當作 SQL 的動態佔位符 |

<!--
MyBatis 的中文直譯是「My 持久層框架」。它的設計哲學是：SQL 由開發者掌控，但透過 Annotation 的方式把 SQL 和 Java 方法綁在一起，讓程式碼更整潔。

和 Spring JDBC 相比：MyBatis 不需要手動建 Map，參數直接從方法參數讀取。
和 Spring Data JPA 相比：MyBatis 需要自己寫 SQL，但 SQL 控制更精確。

在國內很多公司的後端專案（尤其是電商、金融系統）中，MyBatis 是最常見的資料庫框架之一。
-->

---

# 三種框架比較

| 比較項目 | Spring JDBC | MyBatis | Spring Data JPA |
| --- | --- | --- | --- |
| SQL 掌控 | 完全自己寫 | 自己寫（Annotation）| 框架自動產生 |
| 參數傳遞 | Map | 方法參數（`#{}`） | 方法命名規則 |
| 程式碼量 | 多 | 中 | 少 |
| 複雜查詢 | 最靈活 | 很靈活 | 較受限 |
| 業界使用 | 中 | 高（尤其 Java 後端） | 高 |

<!--
把三種框架放在一起比較，更容易理解 MyBatis 的定位。

Spring JDBC：程式碼最多，但完全掌控 SQL。
Spring Data JPA：程式碼最少，但 SQL 由框架決定。
MyBatis：介於中間，SQL 自己寫，但程式碼比 Spring JDBC 簡潔。

在業界，MyBatis 在 Java 後端是非常主流的選擇，尤其適合查詢邏輯較複雜的系統。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 設定 MyBatis

<!--
來設定 MyBatis 的環境。
-->

---

# Step 1：在 build.gradle 加入依賴

```groovy
dependencies {
    implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.4'
    implementation 'com.mysql:mysql-connector-j:8.0.33'
}

compileJava {
    options.compilerArgs += ['-parameters']
}
```

| 設定 | 說明 |
| --- | --- |
| `mybatis-spring-boot-starter:3.0.4` | MyBatis Starter（3.0.0 與 Spring Boot 3.5+ 不相容） |
| `mysql-connector-j` | MySQL 驅動程式（與之前相同） |
| `compileJava -parameters` | Spring Boot 3.2+ 必要，讓 `#{}` 能解析方法參數名稱 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>加完記得：</b> 右鍵 → <b>Gradle → Refresh Gradle Project</b>，並執行 <code>./gradlew clean bootRun</code> 讓編譯旗標生效。
</div>

<!--
MyBatis 的 Gradle 依賴是 mybatis-spring-boot-starter，注意這個不是 Spring 官方提供的，而是 MyBatis 社群維護的 Starter。

版本要選擇 3.x，對應 Spring Boot 3.x。如果用 2.x 版的 Starter，搭配 Spring Boot 3.x 可能會有相容性問題。

MySQL 驅動程式和 Spring JDBC 時用的完全一樣。
-->

---

# Step 2：application.properties 設定

MyBatis 使用和 Spring JDBC 相同的 datasource 設定，不需要額外修改：

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/myjdbc?serverTimezone=Asia/Taipei&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=（你的 MySQL 密碼）
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>好消息：</b> 如果已經有 Spring JDBC 或 JPA 的 datasource 設定，完全不需要修改，MyBatis 會直接使用。
</div>

<!--
MyBatis 的 datasource 設定和 Spring JDBC 完全一樣。

如果你的專案已經設定好 datasource，直接加入 MyBatis 依賴就能使用，不需要改任何設定。

mybatis-spring-boot-starter 會自動讀取 spring.datasource.* 的設定，完成 MyBatis 的初始化。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 用 @Mapper 介面定義操作

<!--
設定好環境，來學 MyBatis 的核心——@Mapper 介面。
-->

---

# 什麼是 @Mapper？

| 項目 | 說明 |
| --- | --- |
| `@Mapper` | 標記這個介面是 MyBatis 的 Mapper，Spring Boot 自動掃描並注入 |
| 介面方法 | 每個方法對應一個 SQL 操作，SQL 寫在方法上的 Annotation |
| 使用方式 | `@Autowired StudentMapper studentMapper`，和注入 Bean 一樣 |
| `#{paramName}` | SQL 的動態佔位符，對應方法參數的名稱 |

<!--
@Mapper 是 MyBatis 最核心的 Annotation。

它標記一個 Java 介面，告訴 MyBatis：「這個介面裡的每個方法，都對應一個 SQL 操作。」

方法的參數就是 SQL 的動態值，用 #{參數名稱} 的格式嵌入 SQL 字串裡。

Spring Boot 會自動掃描所有加了 @Mapper 的介面，建立實作並注入 IoC 容器，我們就能用 @Autowired 注入使用。
-->

---

# 建立 StudentMapper 介面

```java
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface StudentMapper {
    // 方法在這裡定義，SQL 寫在 Annotation 上
}
```

| 說明 | 詳情 |
| --- | --- |
| `@Mapper` | MyBatis 的標記 Annotation，不是 Spring 的 |
| 只需要介面 | 不需要寫實作類別，MyBatis 自動產生 |
| import | `org.apache.ibatis.annotations.Mapper` |

<!--
建立 StudentMapper 介面很簡單，只需要加上 @Mapper 就好。

注意這個 @Mapper 是 MyBatis 的 Annotation，import 的是 org.apache.ibatis.annotations.Mapper，不是 Spring 的任何東西。

介面裡不需要寫任何實作，MyBatis 在啟動時會自動根據介面和 Annotation 建立對應的實作，我們只需要定義「要執行什麼 SQL」就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 用 @Insert、@Update、@Delete 執行 CUD

<!--
來學 CUD 三個操作的寫法。
-->

---

# @Insert — 新增資料

在 `StudentMapper` 中定義新增方法：

```java
@Insert("INSERT INTO student(id, name) VALUES (#{id}, #{name})")
int insert(Student student);
```

| 說明 | 詳情 |
| --- | --- |
| `@Insert("SQL")` | SQL 直接寫在 Annotation 的字串裡 |
| `#{id}`、`#{name}` | 對應 `student` 物件的 `getId()` 和 `getName()` |
| 回傳 `int` | 受影響的行數（成功新增 1 行回傳 1） |

<!--
@Insert 非常直觀：SQL 字串直接寫在 Annotation 裡，#{} 裡填寫參數名稱。

當方法參數是一個物件（如 Student），#{id} 會自動對應到 student.getId()，#{name} 對應到 student.getName()。

這比 Spring JDBC 的 Map 簡潔多了——不需要建 HashMap 再 put 每個值，MyBatis 自動從物件讀取。
-->

---

# @Update — 更新資料

在 `StudentMapper` 中定義更新方法：

```java
@Update("UPDATE student SET name = #{name} WHERE id = #{id}")
int update(Student student);
```

| 說明 | 詳情 |
| --- | --- |
| `@Update("SQL")` | UPDATE SQL 直接寫在 Annotation |
| `WHERE id = #{id}` | 必須加 WHERE 條件，避免更新所有資料 |
| `#{name}`、`#{id}` | 從 `student` 物件自動讀取對應欄位值 |

<!--
@Update 的寫法和 @Insert 完全一樣的模式。

⚠️ 同樣要記住：WHERE 條件一定要加，否則 UPDATE 會修改整張表的所有資料。

#{} 的值從方法的 Student 參數自動讀取，不需要手動 Map.put()。
-->

---

# @Delete — 刪除資料

在 `StudentMapper` 中定義刪除方法：

```java
@Delete("DELETE FROM student WHERE id = #{id}")
int deleteById(Integer id);
```

| 說明 | 詳情 |
| --- | --- |
| `@Delete("SQL")` | DELETE SQL 直接寫在 Annotation |
| `#{id}` | 對應方法的 `Integer id` 參數（單一參數可直接使用） |
| 方法參數 | 當參數是 primitive / 包裝類型，`#{}` 可用任意名稱 |

<!--
@Delete 最簡單——通常只需要 id 這一個參數。

⚠️ WHERE 條件同樣不能忘，否則整張表的資料都會被刪除。

和 @Insert/@Update 不同的是，這裡的方法參數是 Integer id，不是物件。
當方法只有一個 primitive 類型的參數，#{} 裡可以寫任何名字，MyBatis 都能對應到。
-->

---

# #{} 參數語法總結

| 情況 | 方法簽名 | SQL 寫法 |
| --- | --- | --- |
| 參數是物件 | `insert(Student student)` | `#{id}`、`#{name}` → 對應 getter |
| 參數是單一值 | `deleteById(Integer id)` | `#{id}` 或 `#{value}` |
| 多個基本類型參數 | `findBy(Integer id, String name)` | 需加 `@Param` 標記 |

<!--
#{} 是 MyBatis 的參數佔位符，對應方法的參數值。

當傳入物件時，#{欄位名} 對應物件的 getter 方法。
當傳入單一 primitive 或包裝類型，#{} 裡的名字可以自訂。
當有多個 primitive 參數，需要在方法參數前加 @Param("名稱") 指定對應關係。

和 Spring JDBC 的 :paramName 概念相同，只是語法從 : 改成了 #{}。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| MyBatis 定位 | 介於 Spring JDBC 和 JPA 之間，SQL 自己寫但語法更簡潔 |
| build.gradle | `mybatis-spring-boot-starter:3.0.4` + `compileJava -parameters` |
| `@Mapper` | 標記 Mapper 介面，Spring Boot 自動掃描注入 |
| `@Insert` / `@Update` / `@Delete` | SQL 寫在 Annotation 字串裡 |
| `#{}` 語法 | 動態參數佔位符，對應方法參數的名稱 |
| WHERE 提醒 | UPDATE 和 DELETE 一定要加 WHERE 條件 |

<!--
今天的重點總結。

第一，MyBatis 介於 Spring JDBC 和 JPA 之間，需要自己寫 SQL，但語法比 Spring JDBC 簡潔。
第二，加入 mybatis-spring-boot-starter:3.0.0 依賴。
第三，@Mapper 標記介面，不需要寫實作類別。
第四，@Insert/@Update/@Delete 把 SQL 寫在 Annotation 裡。
第五，#{} 是參數佔位符，對應方法參數。

下一章學查詢操作：@Select 和 MyBatis 的自動映射機制。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
