---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring JDBC 的用法（上）—執行 INSERT、UPDATE、DELETE SQL
routeAlias: ch24
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
    Spring JDBC 的用法（上）<br>執行 INSERT、UPDATE、DELETE SQL
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「用 update() 方法，讓資料真正寫進資料庫」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第二十四章。

上一章我們幫承辦人員申請好門禁，Spring Boot 已經連得上資料庫了。

今天承辦人員正式上工。我們要學怎麼用 Spring JDBC 新增、修改、刪除資料。調閱，也就是查詢，留到下一章。
-->

---

# 今天要搞懂的四件事

<v-clicks>

- **承辦人員會三種工作**：`execute()`、`update()`、`query()`
- **申請單上要留空格**：具名參數和 `Map`
- **誰叫承辦人員去做事？** 櫃台 → 組長 → 承辦人員，三層式架構
- **一疊申請單一次送**：`batchUpdate()`

</v-clicks>

<!--
今天的內容比較多，但是只有四個重點。

（下一步）第一，承辦人員會三種工作，對應三個方法：execute、update、query。

（下一步）第二，申請單上要留空格。這是今天最重要的觀念，對應到具名參數和 Map。

（下一步）第三，誰叫承辦人員去做事。櫃台交給組長，組長交給承辦人員，這叫三層式架構。

（下一步）第四，一疊申請單一次送，batchUpdate。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 承辦人員的三種工作

<!--
先看承辦人員到底會做哪些事。
-->

---

# 三種工作，三個方法

<Pairs left="教務處" right="Spring JDBC 的方法" rows="book,準備一本新的簿子=code,execute()：執行 CREATE TABLE 這類 SQL|doc,改動簿子的內容：建檔、更正、註銷=code,update()：執行 INSERT、UPDATE、DELETE|card,調閱：只看不改=code,query()：執行 SELECT（下一章）" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>update()</code> 這個名字容易誤會：只要是<b>會改動資料</b>的 SQL，新增、修改、刪除都用它。
</div>

</v-click>

<!--
承辦人員會三種工作，Spring JDBC 也剛好提供三個方法。

（下一步）第一種，準備一本新的簿子。對應 execute()，用來執行 CREATE TABLE 這類建立資料表的 SQL。

（下一步）第二種，改動簿子的內容，包括建檔、更正、註銷。對應 update()，用來執行 INSERT、UPDATE、DELETE。

（下一步）第三種，調閱，只看不改。對應 query()，用來執行 SELECT。這個下一章學。

（下一步）提醒一下，update() 這個名字容易誤會。它不是只能執行 UPDATE。只要是會改動資料的 SQL，新增、修改、刪除，都用它。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 教務處的分工：三層式架構

<!--
開始寫程式之前，先把教務處的分工講清楚。
-->

---

# 先準備一張學生資料卡

```java
@Data
public class Student {
    private Integer id;
    private String name;
}
```

<v-clicks>

- 這個單元管的是學生，所以先建立 `Student` 類別
- 兩個變數，對應 `student` 資料表的兩個欄位：`id`、`name`
- `@Data` 是第十六章學過的 Lombok，自動產生 Getter 和 Setter

</v-clicks>

<!--
這個單元管的是學生資料，所以先建立一個 Student 類別。可以把它想成一張學生資料卡。

（下一步）上個單元我們用的是 Drink 和 Order，這個單元換成 Student。

（下一步）它有兩個變數，id 和 name，剛好對應 student 資料表的兩個欄位。

（下一步）上面的 @Data 是第十六章學過的 Lombok，會自動產生 Getter 和 Setter。
-->

---

# 教務處的三個角色

<Pairs left="教務處" right="程式" rows="clerk,櫃台：接待來的人、回覆結果=code,Controller：@RestController|teacher,組長：決定事情該怎麼辦=code,Service：@Service|staff,承辦人員：唯一會進檔案室的人=code,Dao：@Repository" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 順序固定是 <b>Controller → Service → Dao → 資料庫</b>。櫃台不會自己跑進檔案室，一定經過組長。
</div>

</v-click>

<!--
教務處有三個角色，各做各的事。

（下一步）櫃台，負責接待來的人、回覆結果。對應 Controller，上面加 @RestController，這是上個單元學的。

（下一步）組長，負責決定事情該怎麼辦，例如要不要先檢查資料。對應 Service，上面加 @Service。

（下一步）承辦人員，是唯一會進檔案室的人。對應 Dao，上面加 @Repository。

@Service 和 @Repository 的效果，都和第六章學的 @Component 一樣：請 Spring 把這個類別變成 Bean。只是名字不同，讓人一眼看出它是哪一層。

（下一步）順序固定是 Controller、Service、Dao，最後才是資料庫。櫃台不會自己跑進檔案室，一定經過組長。

現在組長的工作很少，只是把事情轉交給承辦人員。之後的章節，檢查和計算都會放在這一層。
-->

---

# execute()：請承辦人員準備一本簿子

<CodeSteps>

```java {1-2|3-7|9-13|all}
@Repository
public class StudentDao {
    private final JdbcTemplate jdbcTemplate;

    public StudentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void createTable() {
        String sql = "CREATE TABLE IF NOT EXISTS student " +
                     "(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50))";
        jdbcTemplate.execute(sql);
    }
}
```

- `@Repository`：這個類別是承辦人員（Dao），請 Spring 把它變成 Bean
- 用建構子注入 `JdbcTemplate`：Spring 給我們的工具，用來執行 SQL
- 把 SQL 寫成字串，交給 `execute()` 執行
- `execute()` 沒有回傳值，適合「不用填任何資料」的 SQL

</CodeSteps>

<!--
先看最簡單的 execute()。我們建立 StudentDao 這個類別。

（下一步）類別上面加 @Repository，表示它是承辦人員，也就是 Dao。

（下一步）用建構子注入 JdbcTemplate。這是第五章學的寫法。JdbcTemplate 是 Spring 給我們的工具，專門用來執行 SQL。因為上一章加了 spring-boot-starter-jdbc，Spring 已經把它準備好了。

（下一步）createTable 這個方法裡，把 SQL 寫成一個字串，再交給 execute() 執行。這句 SQL 的意思是：如果 student 表不存在，就建立它。

（下一步）execute() 沒有回傳值，適合這種「不用填任何資料」的 SQL。

實際工作上，建立資料表通常不會寫在程式裡，而是像上一章那樣另外處理。這裡只是用它來認識 execute()。
-->

---

# 組長：把事情交給承辦人員

<CodeSteps>

```java {1-2|3-7|9-11|all}
@Service
public class StudentService {
    private final StudentDao studentDao;

    public StudentService(StudentDao studentDao) {
        this.studentDao = studentDao;
    }

    public void createTable() {
        studentDao.createTable();
    }
}
```

- `@Service`：這個類別是組長（Service）
- 用建構子注入 `StudentDao`：組長認識承辦人員
- 方法裡只做一件事：請承辦人員去做
- 現在組長只是轉交，之後的檢查和計算都會放在這一層

</CodeSteps>

<!--
承辦人員的方法寫好了，但是沒有人叫他，他不會自己動。所以要補上組長和櫃台。先看組長。

（下一步）建立 StudentService，類別上加 @Service。

（下一步）用建構子注入 StudentDao，意思是組長認識承辦人員。

（下一步）createTable 方法裡只做一件事：請承辦人員去做。

（下一步）現在組長只是轉交。之後的章節，檢查和計算都會放在這一層。
-->

---

# 櫃台：收到請求，交給組長

<CodeSteps>

```java {1-2|3-7|9-13|all}
@RestController
public class StudentController {
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/students/table")
    public String createTable() {
        studentService.createTable();
        return "資料表建立成功";
    }
}
```

- `@RestController`：櫃台，上個單元學過
- 用建構子注入 `StudentService`：櫃台只認識組長
- 收到 `POST /students/table`，就交給組長，再回覆一句話
- 測試：用 Postman 發送 `POST http://localhost:8080/students/table`

</CodeSteps>

<!--
再看櫃台。

（下一步）建立 StudentController，類別上加 @RestController。

（下一步）用建構子注入 StudentService。櫃台只認識組長，不認識承辦人員。

（下一步）收到 POST /students/table 這個請求，就交給組長，最後回覆一句話。

（下一步）啟動之後，用 Postman 發送這個請求，就會一路從櫃台、組長、承辦人員走到資料庫。
-->

---

# 補充：注入有三種寫法

```java
// 寫法一：建構子注入（官方建議，這門課用這個）
private final JdbcTemplate jdbcTemplate;

public StudentDao(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
}

// 寫法二：欄位注入（舊教材常見）
@Autowired
private JdbcTemplate jdbcTemplate;

// 寫法三：Lombok 自動產生建構子（類別上加 @RequiredArgsConstructor）
private final JdbcTemplate jdbcTemplate;
```

<!--
補充一下。你在別的地方可能會看到不同的注入寫法，總共有三種。

寫法一是建構子注入，Spring 官方建議的寫法，這門課統一用這個。

寫法二是在變數上面直接加 @Autowired，叫做欄位注入。舊的教材很常見，看得懂就好。

寫法三是在類別上加 Lombok 的 @RequiredArgsConstructor，它會自動幫我們產生寫法一的那個建構子。效果和寫法一相同，只是少打幾行。
-->

---

# 想一想

<Poll question="前端發出一個請求，資料最後要存進資料庫。正確的經過順序是？" options="Controller → Dao → Service → 資料庫|Service → Controller → Dao → 資料庫|Controller → Service → Dao → 資料庫|Dao → Service → Controller → 資料庫" answer="3" />

<!--
確認一下分工。

前端發出一個請求，資料最後要存進資料庫。正確的經過順序是哪一個？

（等大家作答）

（下一步）答案是 Controller、Service、Dao，最後到資料庫。

櫃台、組長、承辦人員，再到檔案室。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 申請單上的空格

<!--
接下來是今天最重要的觀念。
-->

---

# 一張寫死的申請單

<SqlSlip />

<!--
承辦人員要建檔，得先有一張申請單，也就是一句 INSERT 的 SQL。

如果把值直接寫死在申請單上，像畫面這樣，這張單永遠只能建立「1 號 Judy」這位同學。下一位同學來，又要重寫一張。

（下一步）所以我們改成留空格，而且每個空格都取一個名字：冒號 studentId、冒號 studentName。

（下一步）另外準備一張對照表，寫清楚哪個空格要填什麼：studentId 填 1，studentName 填 Judy。

（下一步）承辦人員照著對照表把空格填好，再送進檔案室。

這樣同一張申請單就可以重複使用，每次只要換一張對照表。
-->

---

# 把故事對應到程式

<SqlSlip terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 能處理「有名字的空格」的工具叫 <code>NamedParameterJdbcTemplate</code>。名字很長，但意思很直白：Named Parameter 就是具名參數。
</div>

</v-click>

<!--
同一張圖，換上程式的名字。

申請單是 SQL 字串。

（下一步）有名字的空格，叫做具名參數。寫法是冒號加上名字。

（下一步）填空對照表，是 Java 的 Map。Map 存的是一組一組的 key 和 value，key 是空格的名字，value 是要填的值。

（下一步）承辦人員填好、送件，就是呼叫 update()，把 SQL 和 Map 一起交給它。

（下一步）能處理這種空格的工具，叫做 NamedParameterJdbcTemplate。名字很長，但是意思很直白：Named Parameter 就是具名參數。它和剛才的 JdbcTemplate 是同一家的，Spring 也已經準備好了。
-->

---

# 為什麼空格要取名字？

空格其實有兩種寫法：

<v-clicks>

- **問號**：`VALUES (?, ?)`，值要照順序給，順序錯了就填錯格
- **取名字**：`VALUES (:studentId, :studentName)`，照名字填，不怕順序錯
- 欄位一多，取名字的寫法清楚很多，所以這門課用它

</v-clicks>

<!--
空格其實有兩種寫法。

（下一步）第一種是問號。值要照順序給，第一個問號配第一個值。順序一錯，就會填錯格。

（下一步）第二種是取名字。照名字填，不怕順序錯。

（下一步）欄位一多，取名字的寫法清楚很多，所以這門課用它。問號的寫法你在別的地方也會看到，知道是同一件事就好。
-->

---

# 建檔：INSERT 的四個步驟

<CodeSteps>

```java {3-7|9-10|11-13|14|all}
@Repository
public class StudentDao {
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public StudentDao(NamedParameterJdbcTemplate namedParameterJdbcTemplate) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
    }

    public void createStudent(Student student) {
        String sql = "INSERT INTO student(id, name) VALUES (:studentId, :studentName)";
        Map<String, Object> map = new HashMap<>();
        map.put("studentId", student.getId());
        map.put("studentName", student.getName());
        namedParameterJdbcTemplate.update(sql, map);
    }
}
```

- Step 1：用建構子注入 `NamedParameterJdbcTemplate`
- Step 2：寫 SQL，要填值的地方用 `:名字` 留空格
- Step 3：建立 `Map`，key 是空格的名字，value 是要填的值
- Step 4：呼叫 `update(sql, map)` 送出
- ⚠️ `map.put()` 的 key 要和 `:名字` 完全一樣，大小寫也要一樣

</CodeSteps>

<!--
來看建檔的程式。把剛才的 StudentDao 改成這樣，總共四個步驟。

（下一步）Step 1，用建構子注入 NamedParameterJdbcTemplate。

（下一步）Step 2，寫 SQL。INSERT INTO student，括號裡是欄位 id 和 name；VALUES 後面是要填的值，這裡用冒號加名字留兩個空格。

（下一步）Step 3，建立一個 Map，這就是填空對照表。map.put 的第一個是空格的名字，第二個是要填的值。值從傳進來的 student 物件拿。

（下一步）Step 4，呼叫 update，把 SQL 和 Map 一起交出去。

（下一步）最常見的錯誤：map.put 的 key，一定要和 SQL 裡冒號後面的名字完全一樣，大小寫也要一樣。不一樣的話，執行時會說找不到要填的值。

這裡我們自己指定 id，方便等一下觀察。如果 SQL 裡不寫 id，資料庫就會自動編號。
-->

---

# 想一想

<Poll question="SQL 寫的是 :studentName，下面哪一行可以正確把值填進去？" options='map.put("name", student.getName());|map.put("studentName", student.getName());|map.put(":studentName", student.getName());|map.put("StudentName", student.getName());' answer="2" />

<!--
確認一下。

SQL 裡寫的是冒號 studentName。下面哪一行可以正確把值填進去？

（等大家作答）

（下一步）答案是第二個。

key 要和冒號後面的名字完全一樣，但是不包含冒號。第一個名字不對，第三個多了冒號，第四個的 S 變成大寫了。
-->

---

# 更正：UPDATE

```sql
UPDATE 資料表 SET 欄位 = 新的值 WHERE 條件
```

<CodeSteps>

```java {2|3-5|6|all}
public void updateStudent(Student student) {
    String sql = "UPDATE student SET name = :studentName WHERE id = :studentId";
    Map<String, Object> map = new HashMap<>();
    map.put("studentId", student.getId());
    map.put("studentName", student.getName());
    namedParameterJdbcTemplate.update(sql, map);
}
```

- `SET` 後面是「改成什麼」，`WHERE` 後面是「改哪一筆」
- 兩個空格的值都要放進 `Map`
- 一樣呼叫 `update()`
- ⚠️ 沒有寫 `WHERE`，整張表的每一筆都會被改掉

</CodeSteps>

<!--
接著是更正，對應 UPDATE。語法是：UPDATE 資料表，SET 欄位等於新的值，WHERE 條件。

在 StudentDao 裡加一個 updateStudent 方法。

（下一步）SQL 裡，SET 後面是「改成什麼」，把 name 改成新的名字。WHERE 後面是「改哪一筆」，id 等於幾號的那一筆。

（下一步）兩個空格的值都要放進 Map。

（下一步）一樣呼叫 update()。

（下一步）一定要注意：UPDATE 沒有寫 WHERE 的話，整張表的每一筆都會被改掉。等於全校同學都改成同一個名字。
-->

---

# 註銷：DELETE

```sql
DELETE FROM 資料表 WHERE 條件
```

<CodeSteps>

```java {2|3-4|5|all}
public void deleteStudent(Integer studentId) {
    String sql = "DELETE FROM student WHERE id = :studentId";
    Map<String, Object> map = new HashMap<>();
    map.put("studentId", studentId);
    namedParameterJdbcTemplate.update(sql, map);
}
```

- 只有一個空格：要刪哪一筆
- `Map` 裡也只需要放一個值
- 一樣呼叫 `update()`
- ⚠️ 沒有寫 `WHERE`，整張表會被刪光，而且救不回來

</CodeSteps>

<!--
最後是註銷，對應 DELETE。語法是：DELETE FROM 資料表，WHERE 條件。

（下一步）SQL 裡只有一個空格：要刪哪一筆。

（下一步）所以 Map 裡也只需要放一個值。

（下一步）一樣呼叫 update()。

（下一步）DELETE 沒有寫 WHERE 更可怕：整張表會被刪光，而且救不回來。所以 UPDATE 和 DELETE，寫完一定要再看一眼有沒有 WHERE。
-->

---

# update() 會回報「動到幾筆」

```java
int rows = namedParameterJdbcTemplate.update(sql, map);
```

<v-clicks>

- 成功新增一筆 → 回傳 `1`
- `WHERE` 符合 3 筆，全部更新 → 回傳 `3`
- `WHERE` 找不到任何一筆 → 回傳 `0`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 回傳 <code>0</code> 不是錯誤，只是「沒有任何資料被動到」。可以用它判斷要改的那一筆存不存在。
</div>

</v-click>

<!--
update() 執行完，會回傳一個整數，告訴我們這次動到幾筆資料。

（下一步）成功新增一筆，回傳 1。

（下一步）WHERE 的條件符合三筆，三筆都更新了，回傳 3。

（下一步）WHERE 的條件找不到任何一筆，回傳 0。

（下一步）回傳 0 不是錯誤，程式不會壞，只是沒有任何資料被動到。我們可以用它判斷：要改的那一筆到底存不存在。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 把三層接起來

<!--
承辦人員的三個方法寫好了。接著補上組長和櫃台。
-->

---

# 組長：StudentService

<CodeSteps>

```java {1-3|5-7|9-12|all}
public void createStudent(Student student) {
    studentDao.createStudent(student);
}

public void deleteStudent(Integer studentId) {
    studentDao.deleteStudent(studentId);
}

public void updateStudent(Integer studentId, Student student) {
    student.setId(studentId);
    studentDao.updateStudent(student);
}
```

- 新增：直接交給承辦人員
- 刪除：也是直接轉交
- 修改：先把網址上的 id 寫進資料卡，再交給承辦人員
- 「改哪一筆」來自網址，「改成什麼」來自 Body，由組長合在一起

</CodeSteps>

<!--
在 StudentService 裡加三個方法。

（下一步）新增，直接交給承辦人員。

（下一步）刪除，也是直接轉交。

（下一步）修改多做一件事。等一下會看到，要改哪一筆的 id 是寫在網址上的，要改成什麼名字是寫在 Body 裡的。組長先用 setId 把網址上的 id 寫進學生資料卡，再把完整的資料卡交給承辦人員。

（下一步）所以「改哪一筆」來自網址，「改成什麼」來自 Body，由組長合在一起。這就是組長「決定事情怎麼辦」的一個小例子。
-->

---

# 櫃台：StudentController

<CodeSteps>

```java {1-5|7-12|14-18|all}
@PostMapping("/students")
public String create(@RequestBody Student student) {
    studentService.createStudent(student);
    return "新增成功";
}

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

- 新增：`@RequestBody` 把 JSON 變成 `Student` 物件，交給組長
- 修改：`@PathVariable` 讀網址上的 id，`@RequestBody` 讀新的資料
- 刪除：只需要網址上的 id
- 櫃台只找組長，不直接找承辦人員

</CodeSteps>

<!--
最後是櫃台，在 StudentController 裡加三個方法。這些寫法都是上個單元學過的。

（下一步）新增，POST /students。@RequestBody 把前端的 JSON 變成 Student 物件，交給組長。

（下一步）修改，PUT /students/ 加上編號。@PathVariable 讀網址上的 id，@RequestBody 讀新的資料，兩個都交給組長。

（下一步）刪除，DELETE /students/ 加上編號。只需要網址上的 id。

（下一步）注意，櫃台只找組長，不直接找承辦人員。
-->

---

# 一個請求走完全程

<Flow nodes="Postman|Controller:櫃台|Service:組長|Dao:承辦人員|MySQL:檔案室" steps="1>2:PUT /students/1 + {name:John}|2>3:updateStudent(1, student)|3>4:updateStudent(student)|4>5:UPDATE student SET …|5>4:1（動到一筆）|2>1:修改成功" />

<!--
我們用「修改 1 號同學」走一次全程。

（下一步）Postman 發出 PUT /students/1，Body 裡的 name 是 John。

（下一步）櫃台讀出 id 和資料，呼叫組長的 updateStudent。

（下一步）組長把 id 寫進資料卡，呼叫承辦人員的 updateStudent。

（下一步）承辦人員把值填進申請單的空格，執行 UPDATE。

（下一步）資料庫回報動到一筆。

（下一步）最後櫃台回覆：修改成功。
-->

---

# 用 Postman 測試

<v-clicks>

- **新增**：`POST /students`，Body：`{"id": 1, "name": "Judy"}` → 資料表多一筆 Judy
- **修改**：`PUT /students/1`，Body：`{"name": "John"}` → 1 號的名字變成 John
- **刪除**：`DELETE /students/1` → 1 號那一筆消失

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left">
✅ 每做完一步，就到 Workbench 或 Data Source Explorer 看一下 <code>student</code> 資料表。也看看 Console，上一章設定的 SQL 紀錄會印出來。
</div>

</v-click>

<!--
啟動 Spring Boot，用 Postman 依序測試三個 API。

（下一步）新增：POST /students，Body 是 id 1、name Judy。資料表會多一筆 Judy。

（下一步）修改：PUT /students/1，Body 是 name John。1 號的名字會變成 John。

（下一步）刪除：DELETE /students/1。1 號那一筆會消失。

（下一步）每做完一步，就到 Workbench 或 Data Source Explorer 看一下 student 資料表，確認資料真的變了。也看看 Console，上一章設定的 SQL 紀錄會印出來。

還可以試一件事：把 Spring Boot 停掉再啟動，資料還在。這就是有檔案室的好處。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 一疊申請單，一次送

<!--
最後一個主題：一次要建很多筆資料的時候怎麼辦。
-->

---

# 新生入學：一次要建 1000 筆

<Pairs left="一張一張送" right="整疊一次送" sign="vs" rows="staff,每建一筆，就跑一趟檔案室=ok,1000 張申請單疊好，只跑一趟|what,跑 1000 趟，大部分時間花在走路=ok,省下來回的時間|code,用迴圈呼叫 1000 次 update()=code,呼叫 1 次 batchUpdate()" />

<!--
新生入學，教務處一次要建一千筆學生資料。

（下一步）一張一張送：每建一筆，承辦人員就跑一趟檔案室。整疊一次送：把一千張申請單疊好，只跑一趟。

（下一步）跑一千趟，大部分時間都花在走路。一次送，就省下來回的時間。

（下一步）對應到程式：一張一張送，是用迴圈呼叫一千次 update()。整疊一次送，是呼叫一次 batchUpdate()。batch 是「一批」的意思。
-->

---

# batchUpdate()：準備一疊對照表

<CodeSteps>

```java {2|3-9|10-11|all}
public int[] batchInsert(List<Student> list) {
    String sql = "INSERT INTO student(id, name) VALUES (:id, :name)";
    List<Map<String, Object>> batchParams = new ArrayList<>();
    for (Student s : list) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", s.getId());
        map.put("name", s.getName());
        batchParams.add(map);
    }
    return namedParameterJdbcTemplate.batchUpdate(
        sql, batchParams.toArray(new Map[0]));
}
```

- 申請單（SQL）只有一張，一樣留空格
- 每位學生各準備一張對照表（`Map`），收進一個 `List`
- 把 SQL 和整疊對照表交給 `batchUpdate()`，一次送出
- 回傳 `int[]`：每一筆各自動到幾筆資料

</CodeSteps>

<!--
在 StudentDao 裡加一個 batchInsert 方法，參數是一串學生。

（下一步）申請單，也就是 SQL，只有一張，一樣留空格。

（下一步）用迴圈，替每位學生各準備一張對照表 Map，再收進一個 List。所以最後手上是一疊對照表。

（下一步）把 SQL 和整疊對照表交給 batchUpdate()，一次送出。後面的 toArray 是把 List 轉成陣列，因為 batchUpdate 要的是陣列，照著寫就好。

（下一步）它回傳的是一個整數陣列，裡面是每一筆各自動到幾筆資料。
-->

---

# 組長和櫃台也補上

```java
// StudentService
public void batchInsert(List<Student> list) {
    studentDao.batchInsert(list);
}

// StudentController
@PostMapping("/students/batch")
public String batchCreate(@RequestBody List<Student> list) {
    studentService.batchInsert(list);
    return "批次新增成功";
}
```

<v-click>

測試：`POST /students/batch`，Body 是一個 JSON **陣列**：

```json
[{"id": 2, "name": "Tom"}, {"id": 3, "name": "Amy"}]
```

</v-click>

<!--
組長和櫃台也各補一個方法，結構和前面完全一樣。

組長直接轉交。櫃台用 POST /students/batch 接收。這裡的參數是 List，所以 @RequestBody 會把 JSON 的陣列，自動變成一串 Student。

（下一步）測試的時候，Body 要給一個 JSON 陣列，也就是用中括號包起來的好幾筆資料。送出之後，資料表會同時多出 Tom 和 Amy 兩筆。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="clerk,櫃台 → 組長 → 承辦人員=code,Controller → Service → Dao|form,申請單=code,SQL 字串|what,有名字的空格=code,具名參數：:studentName|doc,填空對照表=code,Map|staff,送件：建檔、更正、註銷=code,update(sql、map)|ok,一疊一次送=code,batchUpdate()" />

<!--
我們用一張圖複習今天的內容。

（下一步）櫃台、組長、承辦人員，是 Controller、Service、Dao。

（下一步）申請單，是 SQL 字串。

（下一步）有名字的空格，是具名參數。

（下一步）填空對照表，是 Map。

（下一步）送件，不管是建檔、更正還是註銷，都是 update()。

（下一步）一疊一次送，是 batchUpdate()。
-->

---

# 章節總結

<v-clicks>

- **三個方法**：建表用 `execute()`、改資料用 `update()`、查資料用 `query()`
- **三層式架構**：Controller → Service → Dao，Controller 不直接呼叫 Dao
- **四個步驟**：注入工具 → 寫 SQL 留空格 → 建立 `Map` → 呼叫 `update()`
- **key 要一致**：`map.put()` 的 key 和 `:名字` 必須完全相同
- **一定要有 `WHERE`**：`UPDATE` 和 `DELETE` 少了它，會動到整張表
- **批次**：大量新增用 `batchUpdate()`，只跑一趟

</v-clicks>

<v-click>

下一章學第三個方法 `query()`：把資料從檔案室調出來。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）三個方法：建表用 execute，改資料用 update，查資料用 query。三層式架構是 Controller、Service、Dao。update 的四個步驟：注入工具、寫 SQL 留空格、建立 Map、呼叫 update。Map 的 key 要和空格的名字完全相同。UPDATE 和 DELETE 一定要有 WHERE。大量新增用 batchUpdate。

（最後一步）下一章學第三個方法 query()：把資料從檔案室調出來。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請把新增、修改、刪除三個 API 都實際做一次，每一步都去資料表看結果。

有任何問題歡迎提出來。
-->
