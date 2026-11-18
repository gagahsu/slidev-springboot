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
大家好，歡迎來到第二十六章。

前面三章，我們用 Spring JDBC 做完了 CRUD。每一件事都要自己寫 SQL、自己準備 Map、自己寫 RowMapper。

今天來認識第二位幫手，Spring Data JPA。他像一位資深助理：我們只要說「存這位同學」，申請單他自己會寫。
-->

---

# 今天要搞懂的四件事

<v-clicks>

- **資深助理是誰？** Spring Data JPA，幾乎不用自己寫 SQL
- **助理怎麼知道資料要放哪？** 在資料卡上標註：`@Entity`
- **怎麼請助理做事？** 一個介面：`JpaRepository`
- **換了幫手，哪裡要改？** 只有承辦人員（Dao）那一層

</v-clicks>

<!--
今天要搞懂四件事。

（下一步）第一，資深助理是誰。他叫 Spring Data JPA，用了他，幾乎不用自己寫 SQL。

（下一步）第二，助理怎麼知道資料要放到哪一本簿子。我們要在學生資料卡上做標註，這個標註叫 @Entity。

（下一步）第三，怎麼請助理做事。只要寫一個介面，叫 JpaRepository。

（下一步）第四，換了幫手之後，程式哪裡要改。答案是只有承辦人員那一層。

今天先學新增、修改、刪除。查詢留到下一章。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 教務處來了一位資深助理

<!--
先看這位助理和之前有什麼不一樣。
-->

---

# 同一件事，兩種做法

<Pairs left="自己來（Spring JDBC）" right="交給資深助理（Spring Data JPA）" sign="vs" rows="form,自己寫申請單：INSERT INTO …=ok,只說一句「存這位同學」|doc,自己準備填空對照表=ok,把資料卡交給他就好|staff,拿回來的表格，自己抄成資料卡=ok,他直接給你抄好的資料卡|what,寫的程式多，但每一步都看得到=what,寫的程式少，但 SQL 是他決定的" />

<!--
同樣是建一筆學生資料，來比較兩種做法。左邊是我們前三章自己來的做法，右邊是交給資深助理。

（下一步）自己來，要自己寫申請單，也就是 INSERT 的 SQL。交給助理，只要說一句「存這位同學」。

（下一步）自己來，要自己準備填空對照表 Map。交給助理，把學生資料卡交給他就好。

（下一步）調閱的時候，自己來要把表格一列一列抄成資料卡，也就是寫 RowMapper。助理會直接給你抄好的資料卡。

（下一步）當然有代價。自己來，寫的程式多，但是每一步都看得到。交給助理，寫的程式少，但是 SQL 是他決定的，我們比較難控制細節。
-->

---

# 把故事對應到程式

<Pairs left="教務處" right="程式" rows="teacher,資深助理=code,Spring Data JPA（背後做事的是 Hibernate）|card,標註好的學生資料卡=code,加了 @Entity 的類別|book,資料卡 ↔ 學籍簿的一行，自動對應=code,ORM：物件 ↔ 資料表的一筆資料|what,跟助理說話的窗口=code,JpaRepository 介面" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>ORM</b>（Object Relational Mapping）：把「Java 物件」和「資料表的資料」自動對應起來。我們操作物件，就等於操作資料庫。
</div>

</v-click>

<!--
把故事對應到程式。

（下一步）資深助理，是 Spring Data JPA。JPA 是 Java 訂的一套規格，真正在背後做事的工具叫 Hibernate。這兩個名字之後會常常看到，知道它們是一起的就好。

（下一步）助理要看得懂資料卡，所以資料卡要先做標註。對應到程式，是加了 @Entity 的類別。

（下一步）一張資料卡，自動對應學籍簿的一行。這個觀念叫 ORM。

（下一步）我們跟助理說話的窗口，是一個叫 JpaRepository 的介面。

（下一步）ORM 是三個英文字的縮寫。白話說，就是把 Java 物件和資料表的資料自動對應起來。我們操作物件，就等於操作資料庫。
-->

---

# 想一想

<Poll question="用了 Spring Data JPA，新增一筆學生資料時，INSERT 的 SQL 是誰寫的？" options="我們自己寫在 Dao 裡|JPA（Hibernate）自動產生|MySQL 自己猜的|根本沒有執行 SQL" answer="2" />

<!--
來想一題。

用了 Spring Data JPA，新增一筆學生資料的時候，INSERT 的 SQL 是誰寫的？

（等大家作答）

（下一步）答案是 JPA 自動產生的。

要注意，SQL 並沒有消失。資料庫只聽得懂 SQL，所以一定還是有一句 INSERT 被送出去，只是換成助理幫我們寫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 請助理來上班：設定

<!--
先把助理請進來。
-->

---

# Step 1：在 build.gradle 加入 JPA

```groovy
implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
implementation 'com.mysql:mysql-connector-j'
```

<v-clicks>

- `spring-boot-starter-data-jpa`：資深助理本人，裡面包含 Hibernate
- `mysql-connector-j`：翻譯，第二十三章已經加過了
- 改完記得 `Gradle` → `Refresh Gradle Project`

</v-clicks>

<!--
第一步，在 build.gradle 加入 JPA。

（下一步）spring-boot-starter-data-jpa 就是資深助理本人，裡面已經包含 Hibernate。

（下一步）mysql-connector-j 是 MySQL 的翻譯，第二十三章已經加過了，不用再加一次。

（下一步）改完一樣要在專案上按右鍵，Gradle，Refresh Gradle Project。
-->

---

# Step 2：application.properties 多加兩行

<CodeSteps>

```properties {1-4|5|6|all}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/myjdbc?serverTimezone=Asia/Taipei&characterEncoding=utf-8
spring.datasource.username=root
spring.datasource.password=（你的 MySQL 密碼）
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

- 前四行是原本的門禁設定，不用動
- `ddl-auto=update`：啟動時，助理會照資料卡的樣子，自動補齊資料表的欄位
- `show-sql=true`：助理寫的每一句 SQL 都印在 Console
- 檔案室還是同一間，只是多了一位助理

</CodeSteps>

<!--
第二步，在 application.properties 多加兩行。

（下一步）前四行是第二十三章寫的門禁設定，不用動。

（下一步）第五行，ddl-auto=update。意思是每次啟動的時候，助理會看一下我們的資料卡長什麼樣子。如果資料表不存在，他會幫忙建；如果少了欄位，他會幫忙補。

（下一步）第六行，show-sql=true。助理寫的每一句 SQL 都會印在 Console。這樣我們才看得到他到底做了什麼。第二十三章提過這個設定，現在派上用場了。

（下一步）檔案室還是同一間，資料表也是同一張，只是多了一位助理。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 在資料卡上做標註：@Entity

<!--
助理進來了。接著要讓他看得懂我們的學生資料卡。
-->

---

# 把 Student 變成 Entity

<CodeSteps>

```java {3|5|6|1-2|all}
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

- `@Entity`：這張資料卡對應一張資料表（預設用類別名稱找，也就是 `student`）
- `@Id`：這個變數是主鍵，用來辨認每一筆資料
- `@GeneratedValue(…IDENTITY)`：id 交給資料庫自動編號
- `@Data` 換成 `@Getter` + `@Setter`（原因在下一頁）
- import 請選 `jakarta.persistence` 開頭的

</CodeSteps>

<!--
把第二十四章的 Student 類別改成這樣。加了三個新的標註。

（下一步）@Entity，告訴助理：這張資料卡對應一張資料表。預設會用類別名稱去找，所以 Student 對應 student 表。

（下一步）@Id，告訴助理：這個變數是主鍵，用來辨認每一筆資料。

（下一步）@GeneratedValue，後面寫 IDENTITY，告訴助理：id 交給資料庫自動編號。就是我們在 Workbench 勾的那個 AI。

（下一步）另外，原本的 @Data 換成了 @Getter 和 @Setter。原因下一頁說明。

（下一步）一個小提醒：Eclipse 幫你 import 的時候，如果有兩個選項，請選 jakarta.persistence 開頭的那一個。javax 開頭的是舊版。
-->

---

# 為什麼 Entity 不用 @Data？

`@Data` 除了 Getter、Setter，還會多產生幾個方法。其中兩個放在 Entity 上容易出問題：

<v-clicks>

- **`equals()` / `hashCode()`**：用所有變數來比較。但 Entity 存檔前 `id` 是空的、存檔後才有值，「前後不一樣」會讓一些集合找不到它
- **`toString()`**：會把所有變數印出來。之後 Entity 之間有關聯時，印一下就可能多查一堆資料

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 簡單記：<b>Entity</b> 用 <code>@Getter</code> + <code>@Setter</code>；單純用來傳資料的類別，用 <code>@Data</code> 沒問題。
</div>

</v-click>

<!--
為什麼 Entity 不用 @Data？

@Data 很方便，但是它除了 Getter、Setter，還會多產生幾個方法。其中兩個放在 Entity 上容易出問題。

（下一步）第一個是 equals 和 hashCode。它們用所有變數來判斷兩個物件是不是同一個。但是 Entity 存檔前，id 是空的；存檔後，id 才有值。前後不一樣，會讓一些集合找不到原本放進去的物件。

（下一步）第二個是 toString。它會把所有變數印出來。之後 Entity 之間有關聯的時候，印一下就可能多查一堆資料。

這兩個原因現在聽不太懂沒關係。

（下一步）先記結論：Entity 用 @Getter 加 @Setter。單純用來傳資料的類別，用 @Data 沒問題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 請助理做事：JpaRepository

<!--
資料卡標註好了。現在來開一個跟助理說話的窗口。
-->

---

# 只要兩行的 StudentRepository

```java
public interface StudentRepository extends JpaRepository<Student, Integer> {
}
```

<v-clicks>

- 它是一個**介面**（interface），裡面一個方法都不用寫
- `JpaRepository<Student, Integer>`：管的是 `Student`，主鍵的型別是 `Integer`
- Spring 啟動時，會自動產生一個做好的物件，並且變成 Bean
- 新增、修改、刪除、查詢的方法，全部已經準備好了

</v-clicks>

<!--
建立一個新的檔案 StudentRepository，內容只有兩行。

（下一步）它是一個介面，裡面一個方法都不用寫。

（下一步）它繼承 JpaRepository，角括號裡有兩個東西。第一個是這位助理管的資料卡，Student。第二個是主鍵的型別，我們的 id 是 Integer。

（下一步）Spring 啟動的時候，會自動產生一個做好的物件，並且變成 Bean。所以我們可以直接注入來用。

（下一步）新增、修改、刪除、查詢的方法，全部已經準備好了。這就是資深助理厲害的地方。
-->

---

# 助理已經會的事

<v-clicks>

- **存檔**：`save(student)`、`saveAll(list)`
- **刪除**：`deleteById(id)`、`delete(student)`、`deleteAll()`
- **查詢**：`findAll()`、`findById(id)`、`existsById(id)`、`count()`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 今天用前兩類。查詢的方法下一章學。
</div>

</v-click>

<!--
繼承 JpaRepository 之後，這些方法全部可以直接用。

（下一步）存檔類：save 存一筆，saveAll 存很多筆。

（下一步）刪除類：deleteById 用編號刪，delete 把整張資料卡交給他刪，deleteAll 全部刪掉。

（下一步）查詢類：findAll 查全部，findById 用編號查，existsById 問某個編號存不存在，count 問總共有幾筆。

（下一步）今天用前兩類。查詢的方法下一章學。
-->

---

# 開始之前：整理一下舊程式

Dao 要從 Spring JDBC 換成 JPA，先做三件事：

<v-clicks>

- `StudentDao`：把裡面用 `NamedParameterJdbcTemplate` 的內容全部清掉，等一下重寫
- `StudentRowMapper`：用不到了，可以刪除
- `StudentService`、`StudentController` 裡**查詢**和**批次新增**的方法：先刪掉，下一章用 JPA 重新寫

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 新增、修改、刪除的 Service 和 Controller <b>都不用動</b>。
</div>

</v-click>

<!--
開始寫之前，先整理一下前兩章的舊程式。因為承辦人員要從 Spring JDBC 換成 JPA。

（下一步）StudentDao：把裡面用 NamedParameterJdbcTemplate 的內容全部清掉，等一下重寫。

（下一步）StudentRowMapper：助理會自己抄資料卡，所以用不到了，可以刪除。

（下一步）StudentService 和 StudentController 裡，查詢和批次新增的方法，先刪掉。因為它們呼叫的 Dao 方法已經不在了，不刪會有紅字。下一章我們用 JPA 重新寫查詢。

（下一步）新增、修改、刪除那三組的 Service 和 Controller，都不用動。

如果你想保留舊程式做對照，也可以另外複製一份專案。
-->

---

# 新的 StudentDao：一行 SQL 都沒有

<CodeSteps>

```java {3-7|9-11|13-15|17-19|all}
@Repository
public class StudentDao {
    private final StudentRepository studentRepository;

    public StudentDao(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public void createStudent(Student student) {
        studentRepository.save(student);
    }

    public void updateStudent(Student student) {
        studentRepository.save(student);
    }

    public void deleteStudent(Integer studentId) {
        studentRepository.deleteById(studentId);
    }
}
```

- 注入的工具換成 `StudentRepository`
- 新增：把資料卡交給 `save()`
- 修改：也是 `save()`
- 刪除：`deleteById()`，給它編號就好
- 沒有 SQL、沒有 `Map`、沒有 `RowMapper`

</CodeSteps>

<!--
來看新的 StudentDao。

（下一步）注入的工具，從 NamedParameterJdbcTemplate 換成 StudentRepository。

（下一步）新增：把學生資料卡交給 save()。就這一行。

（下一步）修改：也是 save()。你可能覺得奇怪，新增和修改怎麼是同一個方法？下一頁說明。

（下一步）刪除：deleteById()，給它編號就好。

（下一步）整個類別裡，沒有 SQL、沒有 Map、沒有 RowMapper。
-->

---

# save() 怎麼知道要新增還是修改？

助理拿到資料卡，先看 **id 那一格**：

<v-clicks>

- **id 是空的（`null`）** → 這是新同學 → 執行 `INSERT`，資料庫自動給編號
- **id 有值，而且資料庫裡有這一筆** → 這是舊資料 → 執行 `UPDATE`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 所以新增時 Body 只要給 <code>{"name": "Judy"}</code>，不用自己帶 id 了。
</div>

</v-click>

<!--
save() 怎麼知道要新增還是修改？

助理拿到資料卡，會先看 id 那一格。

（下一步）如果 id 是空的，也就是 null，代表這是新同學。助理就執行 INSERT，id 交給資料庫自動編號。

（下一步）如果 id 有值，而且資料庫裡有這一筆，代表這是舊資料。助理就執行 UPDATE。

（下一步）所以新增的時候，Body 只要給 name 就好，不用像第二十四章那樣自己帶 id 了。

修改的時候，第二十四章的 Service 會把網址上的 id 寫進資料卡，id 就有值了，所以 save() 會執行 UPDATE。
-->

---

# 想一想

<Poll question="呼叫 studentRepository.save(student)，而 student 的 id 是 null。JPA 會執行哪一種 SQL？" options="INSERT|UPDATE|DELETE|會報錯，因為 id 不能是 null" answer="1" />

<!--
確認一下。

呼叫 save()，而 student 的 id 是 null。JPA 會執行哪一種 SQL？

（等大家作答）

（下一步）答案是 INSERT。

id 是空的，代表這是一筆新資料。
-->

---

# 分層的好處：只改了一層

<Pairs left="哪一層" right="換成 JPA 之後" sign="→" rows="clerk,櫃台：StudentController=ok,不用改|teacher,組長：StudentService=ok,不用改|staff,承辦人員：StudentDao=doc,改成呼叫 StudentRepository|cabinet,檔案室：MySQL=ok,不用改" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這就是分三層的好處：換一種方式存資料，只要改 Dao。櫃台和組長完全不知道後面換了人。
</div>

</v-click>

<!--
回頭看一下，換成 JPA 之後，我們改了哪些地方。

（下一步）櫃台 StudentController，不用改。

（下一步）組長 StudentService，不用改。

（下一步）承辦人員 StudentDao，改成呼叫 StudentRepository。

（下一步）檔案室 MySQL，不用改。

（下一步）這就是分三層的好處。換一種方式存資料，只要改 Dao 這一層。櫃台和組長完全不知道後面換了人。
-->

---

# 用 Postman 測試

<v-clicks>

- **新增**：`POST /students`，Body：`{"name": "Judy"}` → 多一筆 Judy，id 自動產生
- **修改**：`PUT /students/1`，Body：`{"name": "John"}` → 1 號的名字變成 John
- **刪除**：`DELETE /students/1` → 1 號那一筆消失

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left">
✅ 每做一步都看一下 Console：助理自動寫的 <code>insert</code>、<code>update</code>、<code>delete</code> 都會印出來。
</div>

</v-click>

<!--
啟動 Spring Boot，用 Postman 測試。網址和第二十四章完全一樣。

（下一步）新增：POST /students，Body 只給 name。資料表會多一筆 Judy，id 是自動產生的。

（下一步）修改：PUT /students/1，Body 給新的 name。請把網址上的 1 換成你實際的編號。

（下一步）刪除：DELETE /students/1。

（下一步）每做一步都看一下 Console。因為我們設定了 show-sql，助理自動寫的 insert、update、delete 都會印出來。你會發現修改的時候，他會先查一次再更新，這是他確認資料存不存在的方式。
-->

---

# saveAll()：一次存很多筆

```java
Student s1 = new Student();
s1.setName("Alice");

Student s2 = new Student();
s2.setName("Bob");

studentRepository.saveAll(List.of(s1, s2));
```

<v-clicks>

- 把很多張資料卡放進一個 `List`，交給 `saveAll()`
- 每一張的 id 都是空的，所以全部都是新增
- 它會回傳存好的資料卡，裡面已經有資料庫給的 id

</v-clicks>

<!--
第二十四章學過 batchUpdate，一次送一疊申請單。JPA 也有類似的方法，叫 saveAll()。

（下一步）把很多張資料卡放進一個 List，交給 saveAll()。

（下一步）每一張的 id 都是空的，所以全部都是新增。

（下一步）它會回傳存好的資料卡，裡面已經有資料庫給的 id。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充
# 兩個欄位一起當主鍵：@IdClass

<!--
最後是一段補充，第一次學可以先跳過，之後遇到再回來看。
-->

---

# 補充：什麼時候需要兩個欄位當主鍵？

<v-clicks>

- 教務處還有一本**選課簿**，記錄「哪位學生選了哪門課」
- 只看學生編號不夠：一位學生會選很多門課
- 只看課程編號也不夠：一門課有很多學生
- **學生編號 + 課程編號**合起來，才能指出唯一的一筆

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這種由好幾個欄位合起來的主鍵，叫做<b>複合主鍵</b>。JPA 用 <code>@IdClass</code> 來處理。
</div>

</v-click>

<!--
到目前為止，主鍵都只有一個欄位 id。但是有些資料表，要兩個欄位合起來才能辨認一筆資料。

（下一步）例如教務處還有一本選課簿，記錄哪位學生選了哪門課。

（下一步）只看學生編號不夠，因為一位學生會選很多門課。

（下一步）只看課程編號也不夠，因為一門課有很多學生。

（下一步）學生編號加上課程編號，合起來才能指出唯一的一筆。

（下一步）這種由好幾個欄位合起來的主鍵，叫做複合主鍵。JPA 用 @IdClass 來處理。
-->

---

# 補充：@IdClass 的寫法

<CodeSteps>

```java {1-7|9-11|12-18|all}
@Getter
@Setter
@EqualsAndHashCode
public class StudentCourseId implements Serializable {
    private Integer studentId;
    private Integer courseId;
}

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

- 步驟一：另外寫一個類別，把當主鍵的變數都放進去
- 步驟二：Entity 加上 `@IdClass`，指向剛才那個類別
- 每一個當主鍵的變數都加 `@Id`；`@Table`、`@Column` 用來指定資料表和欄位的名稱
- Repository 改成 `JpaRepository<StudentCourse, StudentCourseId>`

</CodeSteps>

<!--
寫法分兩個步驟。

（下一步）步驟一，另外寫一個類別 StudentCourseId，把要當主鍵的變數都放進去。它要 implements Serializable，上面加 @EqualsAndHashCode，這兩個都是 JPA 的要求，照著寫就好。

（下一步）步驟二，Entity 上面加 @IdClass，指向剛才那個類別。這裡還多了一個 @Table，用來指定資料表的名稱。因為類別叫 StudentCourse，但是資料表叫 student_course，名字不一樣的時候就要寫清楚。

（下一步）每一個當主鍵的變數都加 @Id。@Column 是指定欄位的名稱，道理和 @Table 一樣。

（下一步）最後，Repository 的第二個型別，要從 Integer 改成這個主鍵類別。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="teacher,資深助理=code,Spring Data JPA|card,標註好的資料卡=code,@Entity、@Id、@GeneratedValue|what,跟助理說話的窗口=code,JpaRepository|form,「存這位同學」=code,save()：id 是空的就新增，有值就修改|no,「註銷這個編號」=code,deleteById()" />

<!--
我們用一張圖複習今天的內容。

（下一步）資深助理，是 Spring Data JPA。

（下一步）標註好的資料卡，是加了 @Entity、@Id、@GeneratedValue 的類別。

（下一步）跟助理說話的窗口，是 JpaRepository。

（下一步）「存這位同學」，是 save()。id 是空的就新增，有值就修改。

（下一步）「註銷這個編號」，是 deleteById()。
-->

---

# 章節總結

<v-clicks>

- **Spring Data JPA**：用 ORM 的方式操作資料庫，幾乎不用寫 SQL
- **設定**：加入 `spring-boot-starter-data-jpa`，再加 `ddl-auto` 和 `show-sql` 兩行
- **`@Entity`**：類別對應資料表；`@Id` 是主鍵；`@GeneratedValue` 自動編號
- **Entity 的 Lombok**：用 `@Getter` + `@Setter`，不用 `@Data`
- **`JpaRepository`**：寫一個介面去繼承它，CRUD 的方法就都有了
- **`save()`**：id 是空的 → `INSERT`；id 有值 → `UPDATE`
- **分層的好處**：換成 JPA 只改了 Dao

</v-clicks>

<v-click>

下一章繼續請助理幫忙：用 JPA 查詢資料。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）Spring Data JPA 用 ORM 的方式操作資料庫。設定要加一個工具和兩行設定。@Entity 讓類別對應資料表。Entity 用 @Getter 加 @Setter。寫一個介面繼承 JpaRepository，CRUD 的方法就都有了。save() 看 id 決定新增還是修改。換成 JPA 只改了 Dao。

（最後一步）下一章繼續請助理幫忙：用 JPA 查詢資料。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請把新增、修改、刪除都測試一次，並且觀察 Console 裡助理自動寫的 SQL。

有任何問題歡迎提出來。
-->
