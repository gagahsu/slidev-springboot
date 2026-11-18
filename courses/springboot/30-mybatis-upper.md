---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: MyBatis 的用法（上）—設定與 CUD 操作
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
大家好，歡迎來到第三十章。

我們已經認識兩位幫手。Spring JDBC 什麼都自己來，Spring Data JPA 幾乎什麼都交給助理。

今天認識第三位：MyBatis。他站在中間：申請單我們自己寫，但是送件和整理資料都交給他。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **MyBatis 是誰？** 申請單自己寫，雜事交給他
- **申請單寫在哪？** 貼在介面的方法上：`@Mapper`、`@Insert`、`@Update`、`@Delete`
- **空格怎麼填？** `#{名字}`，直接從資料卡上抄

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，MyBatis 是誰。一句話：申請單自己寫，雜事交給他。

（下一步）第二，申請單寫在哪。貼在一個介面的方法上，會用到 @Mapper、@Insert、@Update、@Delete。

（下一步）第三，空格怎麼填。寫法是井字號加大括號，裡面放名字。它會直接從資料卡上抄。

今天先學新增、修改、刪除，查詢留到下一章。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 第三位幫手：MyBatis

<!--
先看這位幫手站在什麼位置。
-->

---

# 三位幫手，分工不一樣

<Pairs left="誰來做" right="三位幫手" rows="form,申請單（SQL）誰寫？=code,JDBC：自己 ／ MyBatis：自己 ／ JPA：助理|doc,空格的值誰填？=code,JDBC：自己準備 Map ／ MyBatis：他填 ／ JPA：助理|card,查回來的表格誰抄成資料卡？=code,JDBC：自己寫 RowMapper ／ MyBatis：他抄 ／ JPA：助理" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>MyBatis</b>：SQL 自己掌握，填空格和抄資料卡這些雜事交給他。業界用得非常多。
</div>

</v-click>

<!--
三位幫手的分工不一樣，我們用三件事來比較。

（下一步）第一件，申請單，也就是 SQL，誰寫？Spring JDBC 自己寫。MyBatis 也是自己寫。JPA 是助理寫。

（下一步）第二件，空格的值誰填？Spring JDBC 要自己準備 Map。MyBatis 他會幫忙填。JPA 是助理處理。

（下一步）第三件，查回來的表格，誰抄成資料卡？Spring JDBC 要自己寫 RowMapper。MyBatis 他會抄。JPA 也是助理處理。

（下一步）所以 MyBatis 的定位是：SQL 自己掌握，填空格和抄資料卡這些雜事交給他。因為 SQL 看得到、改得動，業界用得非常多。
-->

---

# 想一想

<Poll question="哪一個描述最符合 MyBatis？" options="完全不用寫 SQL|SQL 自己寫，但不用自己準備 Map 和 RowMapper|SQL、Map、RowMapper 全部都要自己寫|只能查詢，不能新增資料" answer="2" />

<!--
確認一下。

哪一個描述最符合 MyBatis？

（等大家作答）

（下一步）答案是第二個：SQL 自己寫，但是不用自己準備 Map 和 RowMapper。

第一個是 JPA，第三個是 Spring JDBC。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 請 MyBatis 來上班：設定

<!--
先把他請進來。
-->

---

# Step 1：在 build.gradle 加入 MyBatis

```groovy
dependencies {
    implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:4.0.1'
    implementation 'com.mysql:mysql-connector-j'
}

compileJava {
    options.compilerArgs += ['-parameters']
}
```

<v-clicks>

- `mybatis-spring-boot-starter`：MyBatis 本人。`4.0.x` 搭配 Spring Boot 4；如果你是 Spring Boot 3，請用 `3.0.x`
- `mysql-connector-j`：翻譯，之前加過了
- `compileJava` 那一段：讓 MyBatis 看得到方法參數的名字，等一下填空格會用到

</v-clicks>

<!--
第一步，在 build.gradle 加入 MyBatis。

（下一步）mybatis-spring-boot-starter 就是 MyBatis 本人。注意它要寫版本號。4.0 開頭的版本搭配 Spring Boot 4；如果你的專案是 Spring Boot 3，請用 3.0 開頭的版本。

（下一步）mysql-connector-j 是翻譯，之前加過了。

（下一步）下面多了一段 compileJava。它的作用是讓 MyBatis 看得到方法參數的名字，等一下填空格會用到。照著加就好。

改完一樣要 Refresh Gradle Project。
-->

---

# Step 2：application.properties 不用改

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/myjdbc?serverTimezone=Asia/Taipei&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=（你的 MySQL 密碼）
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 檔案室還是同一間，門禁也是同一張。MyBatis 直接用原本的連線設定。
</div>

</v-click>

<!--
第二步，application.properties。好消息是完全不用改。

（下一步）檔案室還是同一間，門禁也是同一張。MyBatis 會直接用第二十三章寫好的那四行連線設定。

上一章 JPA 的那兩行設定可以留著，不會互相影響。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 把申請單貼在方法上

<!--
接下來看 MyBatis 的寫法。
-->

---

# 建立 StudentMapper

```java
@Mapper
public interface StudentMapper {
}
```

<v-clicks>

- 它是一個**介面**，和 JPA 的 `StudentRepository` 一樣不用寫實作
- `@Mapper`：告訴 MyBatis「這個介面交給你處理」，它會自動變成 Bean
- 接下來每加一個方法，就在方法上面貼一張申請單（SQL）

</v-clicks>

<!--
建立一個新的介面，叫 StudentMapper。

（下一步）它是一個介面，和 JPA 的 StudentRepository 一樣，不用寫實作的類別。

（下一步）上面加 @Mapper，告訴 MyBatis：這個介面交給你處理。MyBatis 會自動產生做好的物件，並且變成 Bean，所以可以直接注入。import 的時候請選 org.apache.ibatis 開頭的。

（下一步）接下來每加一個方法，就在方法上面貼一張申請單，也就是 SQL。
-->

---

# 新增、修改、刪除

<CodeSteps>

```java {1-2|4-5|7-8|all}
@Insert("INSERT INTO student(id, name) VALUES (#{id}, #{name})")
int insert(Student student);

@Update("UPDATE student SET name = #{name} WHERE id = #{id}")
int update(Student student);

@Delete("DELETE FROM student WHERE id = #{id}")
int deleteById(Integer id);
```

- `@Insert`：括號裡就是 SQL；`#{id}`、`#{name}` 是空格
- `@Update`：一樣的寫法，記得要有 `WHERE`
- `@Delete`：參數只有一個編號，直接填進 `#{id}`
- 三個方法都回傳 `int`：動到幾筆

</CodeSteps>

<!--
在 StudentMapper 裡加三個方法。

（下一步）新增。方法上面貼 @Insert，括號裡就是 SQL。要填值的地方寫井字號加大括號，裡面是名字。這就是 MyBatis 的空格。

（下一步）修改。貼 @Update，寫法一樣。記得要有 WHERE。

（下一步）刪除。貼 @Delete。這個方法的參數只有一個編號，就直接填進空格。

（下一步）三個方法都回傳 int，代表動到幾筆。

和第二十四章比一下：SQL 幾乎一樣，但是沒有 Map，也沒有呼叫 update() 的那幾行。
-->

---

# 空格的值從哪裡來？

<Pairs left="方法的參數" right="#{ } 怎麼填" rows="card,一張資料卡：insert(Student student)=code,#{name} → 抄資料卡上的 name（呼叫 getName()）|what,單獨一個值：deleteById(Integer id)=code,#{id} → 就是那個值|doc,好幾個值：find(Integer id、String name)=code,每個參數前面加 @Param(&quot;名字&quot;) 標清楚" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 和 Spring JDBC 比：以前要自己 <code>map.put("studentName", student.getName())</code>，現在 MyBatis 直接從資料卡上抄。
</div>

</v-click>

<!--
空格的值從哪裡來？看方法的參數是什麼。

（下一步）如果參數是一張資料卡，像 insert(Student student)，那麼 #{name} 就是抄資料卡上的 name。MyBatis 會自己呼叫 getName()。

（下一步）如果參數是單獨一個值，像 deleteById(Integer id)，那麼 #{id} 就是那個值。

（下一步）如果參數有好幾個值，就在每個參數前面加 @Param，把名字標清楚。這個下一章會用到。

（下一步）和 Spring JDBC 比一下。以前要自己寫 map.put，把值一個一個放進對照表。現在 MyBatis 直接從資料卡上抄，對照表不用準備了。
-->

---

# 想一想

<Poll question='方法是 int update(Student student)，SQL 裡寫 #{name}。MyBatis 會填入什麼？' options="字串 name|student.getName() 的值|方法的名稱 update|資料表裡原本的 name" answer="2" />

<!--
確認一下。

方法是 update(Student student)，SQL 裡寫 #{name}。MyBatis 會填入什麼？

（等大家作答）

（下一步）答案是 student.getName() 的值。

參數是一張資料卡，所以空格的名字會對應到資料卡上同名的變數。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 把三層接起來

<!--
申請單寫好了，接到三層裡。
-->

---

# 開始之前：整理一下舊程式

承辦人員要從 JPA 換成 MyBatis：

<v-clicks>

- `StudentDao`：把呼叫 `StudentRepository` 的內容清掉，等一下重寫
- `StudentService`、`StudentController` 裡**查詢**的方法：先刪掉，下一章用 MyBatis 重新寫
- `Student` 類別和 `StudentRepository`：留著沒關係，JPA 和 MyBatis 可以同時存在

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 新增、修改、刪除的 Service 和 Controller，一樣<b>不用動</b>。
</div>

</v-click>

<!--
開始之前，和第二十六章一樣，先整理一下舊程式。這次承辦人員要從 JPA 換成 MyBatis。

（下一步）StudentDao：把呼叫 StudentRepository 的內容清掉，等一下重寫。

（下一步）StudentService 和 StudentController 裡查詢的方法，先刪掉。下一章用 MyBatis 重新寫。

（下一步）Student 類別和 StudentRepository 留著沒關係。JPA 和 MyBatis 可以同時存在同一個專案裡。

（下一步）新增、修改、刪除的 Service 和 Controller，一樣不用動。
-->

---

# 新的 StudentDao

<CodeSteps>

```java {3-7|9-11|13-15|17-19|all}
@Repository
public class StudentDao {
    private final StudentMapper studentMapper;

    public StudentDao(StudentMapper studentMapper) {
        this.studentMapper = studentMapper;
    }

    public void createStudent(Student student) {
        studentMapper.insert(student);
    }

    public void updateStudent(Student student) {
        studentMapper.update(student);
    }

    public void deleteStudent(Integer studentId) {
        studentMapper.deleteById(studentId);
    }
}
```

- 注入的工具換成 `StudentMapper`
- 新增：呼叫 `insert()`
- 修改：呼叫 `update()`
- 刪除：呼叫 `deleteById()`
- SQL 都在 `StudentMapper` 裡，Dao 這邊很乾淨

</CodeSteps>

<!--
新的 StudentDao 長這樣。

（下一步）注入的工具換成 StudentMapper。

（下一步）新增，呼叫 insert()。

（下一步）修改，呼叫 update()。

（下一步）刪除，呼叫 deleteById()。

（下一步）SQL 都在 StudentMapper 裡，Dao 這邊很乾淨。

你可能會想：Dao 只是轉交，為什麼不讓組長直接找 StudentMapper？可以，很多專案確實這樣做。我們保留 Dao，是為了讓三種工具的架構一致，方便比較。
-->

---

# 又一次：只改了一層

<Pairs left="哪一層" right="換成 MyBatis 之後" sign="→" rows="clerk,櫃台：StudentController=ok,不用改|teacher,組長：StudentService=ok,不用改|staff,承辦人員：StudentDao=doc,改成呼叫 StudentMapper|cabinet,檔案室：MySQL=ok,不用改" />

<!--
和第二十六章一樣，這次也只改了一層。

（下一步）櫃台，不用改。

（下一步）組長，不用改。組長的 updateStudent 還是一樣，先把網址上的 id 寫進資料卡，再交給承辦人員。這次 id 會被填進 SQL 的 #{id}。

（下一步）承辦人員，改成呼叫 StudentMapper。

（下一步）檔案室，不用改。

從 Spring JDBC 換到 JPA，再換到 MyBatis，櫃台和組長的程式從頭到尾都沒變。
-->

---

# 用 Postman 測試

<v-clicks>

- **新增**：`POST /students`，Body：`{"id": 10, "name": "Judy"}` → 多一筆 Judy
- **修改**：`PUT /students/10`，Body：`{"name": "John"}` → 10 號的名字變成 John
- **刪除**：`DELETE /students/10` → 10 號那一筆消失

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這次的 SQL 寫了 <code>id</code> 這個欄位，所以 Body 要自己帶 id。請選一個資料表裡還沒用過的號碼。
</div>

</v-click>

<!--
啟動 Spring Boot，用 Postman 測試。網址和之前完全一樣。

（下一步）新增：POST /students，Body 給 id 和 name。

（下一步）修改：PUT /students/10，Body 給新的 name。

（下一步）刪除：DELETE /students/10。

（下一步）注意，這次我們的 INSERT 寫了 id 這個欄位，所以 Body 要自己帶 id。請選一個資料表裡還沒用過的號碼，不然會因為編號重複而失敗。

每做完一步，一樣到資料表確認結果。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="staff,第三位幫手：申請單自己寫，雜事交給他=code,MyBatis|doc,放申請單的地方=code,@Mapper 介面|form,貼在方法上的申請單=code,@Insert、@Update、@Delete|what,申請單上的空格=code,#{名字}|card,空格的值從資料卡上抄=code,自動呼叫 Getter" />

<!--
我們用一張圖複習今天的內容。

（下一步）第三位幫手，是 MyBatis。

（下一步）放申請單的地方，是 @Mapper 介面。

（下一步）貼在方法上的申請單，是 @Insert、@Update、@Delete。

（下一步）申請單上的空格，是井字號加大括號。

（下一步）空格的值從資料卡上抄，也就是自動呼叫 Getter。
-->

---

# 章節總結

<v-clicks>

- **MyBatis**：SQL 自己寫，填值和整理結果交給它
- **設定**：加入 `mybatis-spring-boot-starter` 和 `-parameters`；連線設定不用改
- **`@Mapper`**：只寫介面，不用寫實作
- **`@Insert` / `@Update` / `@Delete`**：SQL 直接寫在方法上面
- **`#{}`**：參數是物件就對應它的變數；單獨一個值就直接填
- **`UPDATE`、`DELETE`**：一樣不能忘記 `WHERE`
- **分層**：這次也只改了 Dao

</v-clicks>

<v-click>

下一章：用 `@Select` 查詢資料。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）MyBatis 是 SQL 自己寫，填值和整理結果交給它。設定要加一個工具和一個編譯參數。@Mapper 只寫介面。SQL 用 @Insert、@Update、@Delete 寫在方法上面。#{} 是空格。UPDATE 和 DELETE 不能忘記 WHERE。這次也只改了 Dao。

（最後一步）下一章，用 @Select 查詢資料。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請把三個 API 測試一次，並且比較一下第二十四章的 StudentDao 和今天的 StudentMapper，感受兩者的差別。

有任何問題歡迎提出來。
-->
