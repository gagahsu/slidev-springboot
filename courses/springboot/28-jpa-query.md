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
大家好，歡迎來到第二十八章。

上一章我們學會照格式取方法名稱，助理就會自己查。但是條件一多，方法名稱會變得又長又難讀，有些查詢甚至講不出來。

今天學另一種做法：自己寫一張便條，直接告訴助理要執行什麼。這張便條叫做 @Query。
-->

---

# 今天要搞懂的四件事

<v-clicks>

- **便條有兩種寫法**：JPQL 和原生 SQL
- **便條上的空格怎麼填？** `?1` 和 `:名字`
- **要改資料的便條**：多加 `@Modifying` 和 `@Transactional`
- **進階的查詢**：排序、不重複、模糊查詢、兩本簿子一起查、分頁

</v-clicks>

<!--
今天要搞懂四件事。

（下一步）第一，便條有兩種寫法：JPQL 和原生 SQL。

（下一步）第二，便條上的空格怎麼填。有 ?1 和冒號加名字兩種。

（下一步）第三，要改資料的便條，要多加 @Modifying 和 @Transactional。

（下一步）第四，幾種進階的查詢：排序、不重複、模糊查詢、兩本簿子一起查、分頁。

今天的內容比較像一本小手冊。不用全部背起來，知道有這些寫法，要用的時候回來查就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 為什麼要自己寫便條？

<!--
先看什麼時候會需要 @Query。
-->

---

# 方法名稱講不清楚的時候

想查「三年二班、成績在 60 到 80 之間、照成績從高排到低」：

```java
List<Student> findByClassNameAndScoreBetweenOrderByScoreDesc(String className, int min, int max);
```

<v-clicks>

- 能用，但是名字太長，很難讀、很容易打錯
- 有些事情方法名稱根本講不出來，例如兩張資料表一起查
- 這時候改成**自己寫一張便條**，貼在方法上面：`@Query`

</v-clicks>

<!--
假設我們想查：三年二班、成績在 60 到 80 之間、照成績從高排到低。

用上一章的方法，名字會變成畫面上這樣。

（下一步）它能用，但是名字太長，很難讀，也很容易打錯。

（下一步）而且有些事情，方法名稱根本講不出來，例如兩張資料表一起查。

（下一步）這時候我們改成自己寫一張便條，貼在方法上面。這張便條就是 @Query。助理看到便條，就照便條上寫的去做，不再去猜方法名稱。
-->

---

# 先幫學生資料卡加兩格

<CodeSteps>

```java {8-9|all}
@Getter
@Setter
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String className;
    private Integer score;
}
```

- 多兩個變數：`className`（班級）、`score`（成績）
- 重新啟動後，助理會自動幫資料表加上 `class_name` 和 `score` 兩個欄位

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 注意名字不一樣：Java 的變數叫 <code>className</code>，資料表的欄位叫 <code>class_name</code>。等一下會用到。
</div>

</v-click>

<!--
為了讓今天的例子有東西可以查，先幫學生資料卡加兩格。

（下一步）多兩個變數：className 是班級，score 是成績。

（下一步）重新啟動 Spring Boot 之後，因為我們設定了 ddl-auto=update，助理會自動幫 student 資料表加上兩個欄位。

（下一步）注意一件事：Java 的變數叫 className，中間的 N 大寫。但是助理建立的欄位叫 class_name，用底線分開。這是兩邊各自的命名習慣，助理會自動轉換。這個差別等一下會用到。

加好之後，請用 POST 多新增幾位同學，Body 裡記得帶上 className 和 score。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 便條的兩種寫法

<!--
便條可以用兩種語言寫。
-->

---

# JPQL 和原生 SQL

<Pairs left="JPQL（預設）" right="原生 SQL" sign="vs" rows="card,照「資料卡」上的名字寫=book,照「學籍簿」上的名字寫|code,類別名稱：Student=code,資料表名稱：student|code,變數名稱：className=code,欄位名稱：class_name|ok,換一種資料庫也不用改=what,可以用 MySQL 專屬的語法" />

<!--
便條有兩種寫法。

（下一步）第一種叫 JPQL，是預設的寫法。它照資料卡上的名字寫。第二種是原生 SQL，就是我們熟悉的 SQL，照學籍簿上的名字寫。

（下一步）JPQL 裡，要查哪裡，寫的是類別名稱 Student，S 大寫。原生 SQL 寫的是資料表名稱 student。

（下一步）JPQL 裡，條件寫的是變數名稱 className。原生 SQL 寫的是欄位名稱 class_name。

（下一步）JPQL 的好處：助理會幫我們翻譯成資料庫聽得懂的 SQL，所以換一種資料庫也不用改。原生 SQL 的好處：可以用 MySQL 專屬的語法。

JPQL 是 Java Persistence Query Language 的縮寫，長得和 SQL 很像，只是名字用 Java 這邊的。
-->

---

# 兩種寫法放在一起看

<CodeSteps>

```java {1-2|4-5|all}
@Query("select s from Student s where s.className = ?1")
List<Student> findByClass(String className);

@Query(value = "select * from student where class_name = ?1", nativeQuery = true)
List<Student> findByClassNative(String className);
```

- JPQL：`Student` 是類別名稱，`s` 是幫它取的簡稱，`s.className` 是變數
- 原生 SQL：加上 `nativeQuery = true`，裡面就是一般的 SQL
- 兩個方法查到的結果一樣。都寫在 `StudentRepository` 裡

</CodeSteps>

<!--
同一個查詢，兩種寫法放在一起看。它們都寫在 StudentRepository 裡。

（下一步）第一個是 JPQL。select s from Student s，這裡的 Student 是類別名稱，後面的 s 是幫它取的簡稱。where s.className，用的是變數名稱。最後的 ?1 是空格，等一下說明。

（下一步）第二個是原生 SQL。@Query 裡多寫 nativeQuery = true，意思是「這張便條是原生的 SQL」。裡面就是一般的 SQL：資料表 student，欄位 class_name。

（下一步）兩個方法查到的結果一樣。方法名稱現在可以自己取了，因為助理看的是便條，不是名字。
-->

---

# 想一想

<Poll question='這張便條是 JPQL：@Query("select s from ___ s where s.score > 60")。空格裡應該填什麼？' options="student（資料表名稱）|Student（類別名稱）|students|StudentRepository" answer="2" />

<!--
來想一題。

這張便條是 JPQL，沒有寫 nativeQuery = true。from 後面的空格應該填什麼？

（等大家作答）

（下一步）答案是 Student，S 大寫，類別名稱。

JPQL 照資料卡上的名字寫，所以用類別名稱。如果寫成小寫的 student，啟動時就會報錯。
-->

---

# 便條上的空格：兩種填法

<CodeSteps>

```java {1-2|4-5|all}
@Query("select s from Student s where s.className = ?1 and s.name = ?2")
List<Student> findByClassAndName(String className, String name);

@Query("select s from Student s where s.className = :inputClass")
List<Student> findByClass2(@Param("inputClass") String className);
```

- `?1`、`?2`：照順序，第 1 個參數填 `?1`，第 2 個填 `?2`
- `:名字`：照名字，參數前面用 `@Param("名字")` 標明要填哪一格
- 建議用 `:名字`，和第二十四章「空格要取名字」是同一個道理

</CodeSteps>

<!--
便條上的空格有兩種填法。

（下一步）第一種是問號加數字。?1 填方法的第 1 個參數，?2 填第 2 個參數。照順序來。

（下一步）第二種是冒號加名字。參數前面用 @Param 標明它要填哪一格。這裡 @Param("inputClass")，對應便條上的 :inputClass。

（下一步）建議用第二種。這和第二十四章說的「空格要取名字」是同一個道理：參數一多，照順序很容易填錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 要改資料的便條

<!--
便條不只能查詢，也能改資料。但是要多貼兩張標籤。
-->

---

# 修改和刪除：多加兩個標註

<CodeSteps>

```java {3|2|1|4-5|all}
@Transactional
@Modifying
@Query("update Student set name = :newName where id = :inputId")
int updateNameById(@Param("inputId") Integer id,
                   @Param("newName") String name);
```

- 便條的內容是 `update`（`delete` 也一樣）
- `@Modifying`：告訴助理「這張便條會改資料，不是查詢」
- `@Transactional`：改資料必須加。它保證「要嘛全部成功，要嘛全部不算」，第三十三章會細講
- 回傳 `int`：動到幾筆

</CodeSteps>

<!--
來看修改資料的便條。

（下一步）便條的內容是 update：把某個 id 的同學，名字改成新的。delete 也是一樣的寫法。

（下一步）上面要多加 @Modifying。因為助理預設把便條當成查詢，要明確告訴他「這張便條會改資料」。

（下一步）再加 @Transactional。改資料的便條必須加這個，不加的話執行時會報錯。它的作用是保證「要嘛全部成功，要嘛全部不算」。這個觀念第三十三章會細講，現在先照著加。

（下一步）方法回傳 int，代表動到幾筆。和 Spring JDBC 的 update() 一樣。
-->

---

# 改完再查，卻拿到舊資料？

```java
@Transactional
@Modifying(clearAutomatically = true)
@Query("update Student set name = :newName where id = :inputId")
int updateNameById(@Param("inputId") Integer id, @Param("newName") String name);
```

<v-clicks>

- 助理手邊會留著**剛查過的資料卡**，下次要用就不必再跑檔案室
- 但是用便條直接改資料庫，助理手邊的那一張**不會跟著變**
- 加上 `clearAutomatically = true`：改完就把手邊的資料卡丟掉，下次重新去拿

</v-clicks>

<!--
用便條改資料，有一個小陷阱：改完馬上再查同一筆，有時候會拿到舊的資料。

（下一步）原因是助理很勤快。他手邊會留著剛查過的資料卡，下次要用就不必再跑一趟檔案室。

（下一步）但是用便條改資料，是直接改檔案室裡的那一本簿子。助理手邊的那一張不會跟著變。

（下一步）解法是在 @Modifying 後面加 clearAutomatically = true。意思是改完之後，就把手邊的資料卡丟掉，下次重新去檔案室拿。
-->

---

# 新增：只能用原生 SQL

```java
@Transactional
@Modifying
@Query(value = "insert into student (name, class_name, score) "
             + "values (:inputName, :inputClass, :inputScore)",
       nativeQuery = true)
int insert(@Param("inputName") String name,
           @Param("inputClass") String className,
           @Param("inputScore") Integer score);
```

<v-clicks>

- JPQL 沒有這種 `insert … values` 的寫法，所以要寫 `nativeQuery = true`
- 既然是原生 SQL，名字就要用資料表的：`student`、`class_name`
- 平常新增用 `save()` 就好，這個寫法知道有就可以

</v-clicks>

<!--
新增也可以用便條，但是只能用原生 SQL。

（下一步）JPQL 沒有 insert values 這種寫法，所以要寫 nativeQuery = true。

（下一步）既然是原生 SQL，名字就要用資料表的：student、class_name。

（下一步）不過平常新增資料，用上一章的 save() 就好，簡單很多。這個寫法知道有就可以。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 進階的查詢

<!--
接著看幾種常用的進階查詢。這一段像手冊，要用的時候回來查。
-->

---

# 排序、不重複、模糊查詢

<CodeSteps>

```java {1-2|4-5|7-8|all}
@Query("select s from Student s where s.className = ?1 order by s.score desc")
List<Student> findByClassOrderByScoreDesc(String className);

@Query("select distinct s.className from Student s")
List<String> findAllClassNames();

@Query("select s from Student s where s.name like %?1%")
List<Student> findByNameLike(String keyword);
```

- `order by`：排序。後面加 `desc` 是從大到小，不加是從小到大
- `distinct`：不重複。這裡只查班級名稱，所以回傳 `List<String>`
- `like %?1%`：模糊查詢，名字裡**包含**這些字就算

</CodeSteps>

<!--
三種常用的寫法。

（下一步）order by 是排序。這個例子查某一班的同學，照成績排。後面加 desc 是從大排到小，不加的話是從小排到大。

（下一步）distinct 是不重複。這個例子想知道學校有哪些班級。很多同學是同一班，加了 distinct，同一個班級只會出現一次。因為只查班級名稱這一個變數，所以回傳的是一串文字 List<String>。

（下一步）like 是模糊查詢。兩邊的百分比符號代表「前後可以有任何字」，所以只要名字裡包含這些字就算。
-->

---

# 兩本簿子一起查：join

教務處還有一本**班級簿**，記錄每一班的導師：

```java
@Getter
@Setter
@Entity
public class Classroom {
    @Id
    private String className;
    private String teacherName;
}
```

<v-clicks>

- 想查「每位同學的導師是誰」：同學在學籍簿，導師在班級簿
- 要用**班級名稱**把兩本簿子對起來，這個動作叫 **join**
- 查回來的東西兩邊各拿一些，所以要準備一張新的卡片來裝

</v-clicks>

<!--
最後一種：兩本簿子一起查。

教務處還有一本班級簿，記錄每一班的導師是誰。對應到程式是 Classroom 這個 Entity，有班級名稱和導師姓名。這裡的主鍵是班級名稱。

（下一步）現在想查「每位同學的導師是誰」。同學的資料在學籍簿，導師的資料在班級簿。

（下一步）所以要用班級名稱把兩本簿子對起來：這位同學是三年二班，就去班級簿找三年二班的導師。這個動作在 SQL 裡叫 join。

（下一步）查回來的東西，兩邊各拿一些：同學的編號和名字、班級簿的導師姓名。它不是 Student，也不是 Classroom，所以要準備一張新的卡片來裝。
-->

---

# join 的寫法

<CodeSteps>

```java {1-7|9-11|all}
@Getter
@AllArgsConstructor
public class StudentTeacherVo {
    private Integer id;
    private String name;
    private String teacherName;
}

@Query("select new com.example.demo.StudentTeacherVo(s.id, s.name, c.teacherName) "
     + "from Student s join Classroom c on s.className = c.className")
List<StudentTeacherVo> findStudentWithTeacher();
```

- 新卡片 `StudentTeacherVo`：不加 `@Entity`；`@AllArgsConstructor` 會產生「三個變數都要給」的建構子
- 便條裡用 `new 完整的 package 路徑.類別名稱(…)`，把查到的值照順序放進新卡片
- `join … on …`：用班級名稱把兩邊對起來
- 括號裡的順序，要和類別裡變數的順序一樣

</CodeSteps>

<!--
join 的寫法分兩個部分。

（下一步）上半部是新卡片 StudentTeacherVo，有編號、名字、導師姓名三個變數。它只是用來裝查詢結果，不對應資料表，所以不加 @Entity。上面的 @AllArgsConstructor 是 Lombok，會自動產生一個「三個變數都要給」的建構子。

（下一步）下半部是便條。select 後面寫 new，再寫新卡片完整的 package 路徑和類別名稱，括號裡是要放進去的三個值。from Student s join Classroom c on，後面是對起來的條件：兩邊的班級名稱相同。

（下一步）join on 就是「用什麼把兩邊對起來」。

（下一步）要注意，new 後面括號裡的順序，要和類別裡變數的順序一樣。package 路徑也要寫完整，請換成你自己專案的路徑。

VO 是 Value Object 的縮寫，第三十七章會正式介紹。現在把它當成「專門用來裝結果的卡片」就好。
-->

---

# 便條也可以分頁

```java
@Query("select s from Student s where s.className = :inputClass")
Page<Student> findByClassPaging(@Param("inputClass") String className, Pageable pageable);
```

呼叫的時候：

```java
Page<Student> result = studentRepository.findByClassPaging("三年二班", PageRequest.of(0, 3));
```

<v-clicks>

- 參數最後加一個 `Pageable`，回傳型別改成 `Page<Student>`
- 10 筆資料、每頁 3 筆：`of(0, 3)` 是第 1～3 筆，`of(1, 3)` 是第 4～6 筆，`of(3, 3)` 只剩最後 1 筆

</v-clicks>

<!--
上一章學的分頁，便條也可以用。

（下一步）做法是：方法的參數最後加一個 Pageable，回傳型別改成 Page<Student>。呼叫的時候，一樣用 PageRequest.of 告訴它第幾頁、一頁幾筆。

（下一步）舉個例子。假設符合條件的有 10 筆，每頁 3 筆。of(0, 3) 拿到第 1 到第 3 筆，of(1, 3) 拿到第 4 到第 6 筆，of(3, 3) 是第 4 頁，只剩最後 1 筆。頁碼從 0 開始，這一點要記得。
-->

---

# 便條寫好了，誰來呼叫？

```java
// StudentDao
public List<Student> getStudentsByClass(String className) {
    return studentRepository.findByClass(className);
}

public int updateName(Integer studentId, String name) {
    return studentRepository.updateNameById(studentId, name);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 便條是貼在 <code>StudentRepository</code> 的方法上。用的時候和其他方法一樣：承辦人員（Dao）呼叫它，再往上接組長和櫃台。
</div>

</v-click>

<!--
便條寫好了，誰來呼叫？

和前兩章一樣。在 StudentDao 裡呼叫 StudentRepository 的方法就可以了。

（下一步）便條是貼在 StudentRepository 的方法上。用的時候和其他方法沒有差別：承辦人員呼叫它，再往上接組長和櫃台。三層的接法前面練過很多次，這裡就不重複了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 動手練習

<!--
最後來做兩個練習。
-->

---

# 練習 1：用 @Query 寫查詢和修改

在 `StudentRepository` 加兩個方法：

<v-clicks>

- `findByScoreRange(int min, int max)`：查成績在 min 到 max 之間的學生（包含兩端）
- `updateScoreById(int id, int score)`：把某個 id 的學生成績改掉

</v-clicks>

<v-click>

**要求：**

1. 空格用 `:名字` 的寫法
2. 修改的方法要加 `@Modifying`、`@Transactional`，回傳 `int`
3. 提示：SQL 裡「介於兩個值之間」寫作 `between … and …`

</v-click>

<!--
練習 1。請在 StudentRepository 加兩個方法。

（下一步）第一個，findByScoreRange，查成績在 min 到 max 之間的學生，包含兩端。

（下一步）第二個，updateScoreById，把某個 id 的學生成績改掉。

（下一步）三個要求。空格用冒號加名字的寫法。修改的方法要加 @Modifying 和 @Transactional，回傳 int。提示：SQL 裡「介於兩個值之間」寫作 between and。

請先暫停，自己試試看，再看下一頁。
-->

---

# 練習 1：參考答案

```java
@Query("select s from Student s where s.score between :min and :max")
List<Student> findByScoreRange(@Param("min") int min,
                               @Param("max") int max);

@Transactional
@Modifying
@Query("update Student set score = :score where id = :id")
int updateScoreById(@Param("id") int id, @Param("score") int score);
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left">
✅ 接上三層之後，用 Postman 查成績 60～80 的學生；再改一位同學的成績，重新查一次確認。
</div>

<!--
這是參考答案。

第一個方法是 JPQL，from Student，條件是 s.score between :min and :max。兩個參數各用 @Param 標明。

第二個方法，便條是 update Student set score，上面加了 @Transactional 和 @Modifying，回傳 int。

接上三層之後，用 Postman 查成績 60 到 80 的學生。再改一位同學的成績，重新查一次，確認結果有變。
-->

---

# 練習 2：加上分頁

把練習 1 的查詢改成可以分頁的版本：

1. 參數加上 `Pageable`，回傳型別改成 `Page<Student>`
2. 呼叫時傳入 `PageRequest.of(0, 5)`：第 1 頁、每頁 5 筆
3. Controller 直接回傳 `Page<Student>`

<v-click>

```java
@Query("select s from Student s where s.score between :min and :max")
Page<Student> findByScoreRangePaging(@Param("min") int min,
                                     @Param("max") int max,
                                     Pageable pageable);
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 回傳的 JSON 裡會有 <code>content</code>（最多 5 筆）、<code>totalElements</code>（總筆數）、<code>totalPages</code>（總頁數）。
</div>

</v-click>

<!--
練習 2，把練習 1 的查詢改成可以分頁的版本。

三個步驟：參數加上 Pageable，回傳型別改成 Page<Student>。呼叫時傳入 PageRequest.of(0, 5)。Controller 直接回傳 Page<Student>。

請先自己試試看。

（下一步）參考答案在這裡。便條的內容完全不用改，只是參數多了 Pageable，回傳型別換成 Page。

Controller 直接回傳 Page 的話，JSON 裡會有 content，是這一頁的資料，最多 5 筆；還有 totalElements 總筆數、totalPages 總頁數。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="doc,自己寫給助理的便條=code,@Query|card,照資料卡的名字寫=code,JPQL：Student、className|book,照學籍簿的名字寫=code,原生 SQL：nativeQuery = true|what,便條上的空格=code,?1 或 :名字 + @Param|form,會改資料的便條=code,@Modifying + @Transactional|cabinet,兩本簿子對起來查=code,join … on …" />

<!--
我們用一張圖複習今天的內容。

（下一步）自己寫給助理的便條，是 @Query。

（下一步）照資料卡的名字寫，是 JPQL。

（下一步）照學籍簿的名字寫，是原生 SQL，要加 nativeQuery = true。

（下一步）便條上的空格，用 ?1，或是冒號加名字再配上 @Param。

（下一步）會改資料的便條，要加 @Modifying 和 @Transactional。

（下一步）兩本簿子對起來查，是 join。
-->

---

# 章節總結

<v-clicks>

- **`@Query`**：方法名稱講不清楚時，自己寫要執行的內容
- **JPQL**（預設）：用類別名稱和變數名稱，換資料庫不用改
- **原生 SQL**：`nativeQuery = true`，用資料表名稱和欄位名稱
- **參數**：建議用 `:名字` 搭配 `@Param`
- **修改、刪除、新增**：加 `@Modifying` 和 `@Transactional`；新增只能用原生 SQL
- **`clearAutomatically = true`**：改完清掉手邊的舊資料
- **分頁**：參數加 `Pageable`，回傳 `Page`

</v-clicks>

<v-click>

下一章：兩本簿子之間的關係，也可以交給助理來顧。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）@Query 讓我們自己寫要執行的內容。JPQL 用類別名稱和變數名稱。原生 SQL 要加 nativeQuery = true，用資料表和欄位的名稱。參數建議用冒號加名字。會改資料的便條要加 @Modifying 和 @Transactional，新增只能用原生 SQL。clearAutomatically 讓助理改完就清掉手邊的舊資料。分頁只要加 Pageable。

（最後一步）下一章：兩本簿子之間的關係，也可以交給助理來顧。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

今天的寫法很多，不需要背。記得一個原則就好：簡單的查詢用方法名稱，複雜的查詢用 @Query。

有任何問題歡迎提出來。
-->
