---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "@Transactional — Spring 事務管理"
routeAlias: ch33
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
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    @Transactional<br>Spring 事務管理
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「一組操作，要嘛全部成功，要嘛全部復原」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第三十三章。

前面我們學會了三種存取資料庫的方式。到目前為止，每一個功能都只改一筆資料。

今天要處理一個新的問題：有些事情要同時改兩本簿子。如果改到一半出錯了，怎麼辦？答案是「交易」，在 Spring 裡用 @Transactional。
-->

---

# 今天要搞懂的四件事

<v-clicks>

- **改到一半出錯會怎樣？** 兩本簿子對不起來
- **交易是什麼？** 好幾件事算成「同一件」：全部成功，或是全部不算
- **怎麼用？** 在方法上加 `@Transactional`
- **什麼時候會復原？** Rollback 的規則和注意事項

</v-clicks>

<!--
今天要搞懂四件事。

（下一步）第一，改到一半出錯會怎樣。兩本簿子會對不起來。

（下一步）第二，交易是什麼。把好幾件事算成同一件：全部成功，或是全部不算。

（下一步）第三，怎麼用。在方法上加 @Transactional。

（下一步）第四，什麼時候會復原。也就是 Rollback 的規則，還有幾個容易踩到的地方。

名詞說明一下：Transaction 有人翻成「交易」，也有人翻成「事務」，是同一個東西。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 改到一半出錯了

<!--
先看教務處發生的事。
-->

---

# 記過：要改兩本簿子

<TwoBooks mode="broken" />

<!--
小明今天遲到，要記過。教務處要改兩本簿子：學籍簿上，小明的分數要扣 10 分；記過簿上，要多一筆紀錄，寫清楚為什麼扣分。

（下一步）第一件事，承辦人員到學籍簿把小明的分數從 80 改成 70。成功。

（下一步）第二件事，要寫記過簿。就在這個時候出錯了，可能是資料有問題，也可能是系統剛好出狀況。

（下一步）結果：分數被扣了，記過簿卻沒有紀錄。兩本簿子對不起來。小明來問為什麼被扣分，教務處也查不到。

這種狀況叫做資料不一致，是資料庫最怕的事情之一。
-->

---

# 把兩件事算成「同一件」

<TwoBooks mode="tx" />

<!--
要怎麼避免？讓組長先說好：這兩件事算同一件。

（下一步）第一件，學籍簿扣 10 分。但是這次先用鉛筆寫，還不算數。

（下一步）第二件，寫記過簿的時候，一樣出錯了。

（下一步）因為算同一件事，第二件失敗了，第一件也要擦掉。分數回到 80。

兩本簿子都回到原本的樣子，就像什麼事都沒發生過。雖然記過沒有完成，但是資料是對得起來的，之後再做一次就好。

如果兩件事都成功呢？那就把鉛筆寫的全部描成原子筆，正式算數。
-->

---

# 把故事對應到程式

<Pairs left="教務處" right="程式" rows="teacher,兩件事算同一件=code,交易（Transaction）|book,先用鉛筆寫，還不算數=code,交易進行中，資料還沒正式寫入|ok,全部成功，描成原子筆=code,Commit（提交）|no,有一件失敗，全部擦掉=code,Rollback（回復）" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>交易</b>：一組對資料庫的操作，要嘛全部成功，要嘛全部不算。不會停在「做到一半」的狀態。
</div>

</v-click>

<!--
把故事對應到程式。

（下一步）兩件事算同一件，叫做交易，英文是 Transaction。

（下一步）先用鉛筆寫、還不算數，對應到交易進行中，資料還沒正式寫入。

（下一步）全部成功，描成原子筆，叫做 Commit，提交。

（下一步）有一件失敗，全部擦掉，叫做 Rollback，回復。這個字今天會一直出現。

（下一步）用一句話說交易：一組對資料庫的操作，要嘛全部成功，要嘛全部不算。不會停在做到一半的狀態。
-->

---

# 交易的四個特性：ACID

<v-clicks>

- **A**tomicity（原子性）：全部成功，或全部不算
- **C**onsistency（一致性）：做完之後，資料之間還是對得起來
- **I**solation（隔離性）：同時進行的交易，不會互相干擾
- **D**urability（持久性）：一旦提交，資料就確實存下來了

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這四個字的開頭合起來是 <b>ACID</b>，面試很常問。今天的重點是第一個；第三個和下一章的「鎖」有關。
</div>

</v-click>

<!--
交易有四個特性，是資料庫領域很有名的四個字。

（下一步）Atomicity，原子性。全部成功，或全部不算。這就是我們剛才看到的。

（下一步）Consistency，一致性。做完之後，資料之間還是對得起來。

（下一步）Isolation，隔離性。同時進行的交易，不會互相干擾。

（下一步）Durability，持久性。一旦提交，資料就確實存下來了，就算馬上停電也還在。

（下一步）四個字的開頭合起來是 ACID，面試很常問。今天的重點是第一個原子性。第三個隔離性，和下一章要學的「鎖」有關。
-->

---

# 想一想

<Poll question="交易裡有兩個步驟。第一步成功，第二步失敗。最後資料庫會是什麼狀態？" options="第一步的結果保留，第二步沒做|兩步都不算，回到一開始的樣子|兩步都算成功|資料庫會壞掉" answer="2" />

<!--
確認一下。

交易裡有兩個步驟。第一步成功，第二步失敗。最後資料庫會是什麼狀態？

（等大家作答）

（下一步）答案是兩步都不算，回到一開始的樣子。

這就是 Rollback。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 在程式裡使用交易

<!--
觀念清楚了，來看程式怎麼寫。
-->

---

# 準備工作：分數和記過簿

`Student` 在第二十八章已經有 `score`。再用 JPA 幫我們建立記過簿的資料表：

```java
@Getter
@Setter
@Entity
public class Penalty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer studentId;
    private String reason;
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這裡的 <code>@Entity</code> 只是請 JPA 在啟動時<b>幫忙建表</b>（<code>ddl-auto=update</code>）。實際存取資料，我們繼續用 MyBatis，兩者不衝突。
</div>

</v-click>

<!--
先做準備工作。

學籍簿這邊，Student 在第二十八章已經加了 score 這個變數，可以直接用。請確認你要測試的同學，score 有值。

記過簿這邊，需要一張新的資料表 penalty。我們建立一個 Penalty 類別，加上 @Entity。有三個變數：編號、哪一位學生、原因。

（下一步）這裡的 @Entity 只是請 JPA 在啟動的時候幫忙建表，因為第二十六章設定了 ddl-auto=update。我們不用自己到 Workbench 建。實際存取資料，還是繼續用 MyBatis，兩者不衝突。
-->

---

# 兩張申請單

<CodeSteps>

```java {1-6|8-12|all}
@Mapper
public interface StudentMapper {
    // 其他方法省略
    @Update("UPDATE student SET score = score - #{points} WHERE id = #{studentId}")
    int deductScore(@Param("studentId") Integer studentId, @Param("points") Integer points);
}

@Mapper
public interface PenaltyMapper {
    @Insert("INSERT INTO penalty(student_id, reason) VALUES (#{studentId}, #{reason})")
    int create(@Param("studentId") Integer studentId, @Param("reason") String reason);
}
```

- 扣分：`score = score - #{points}`，把原本的分數減掉幾分
- 記過紀錄：新的 `PenaltyMapper`，在 `penalty` 表新增一筆
- 這兩個方法寫在介面裡；如果你的 SQL 已經搬到 XML，這兩個貼在方法上也可以混用

</CodeSteps>

<!--
記過要做兩件事，所以需要兩張申請單。

（下一步）第一張，扣分。加在 StudentMapper 裡。SQL 是 UPDATE student SET score = score 減掉 #{points}，意思是把原本的分數減掉幾分。

（下一步）第二張，記過紀錄。建立一個新的介面 PenaltyMapper，在 penalty 表新增一筆。

（下一步）上一章說過兩種放法可以混用。就算你其他的 SQL 已經搬到 XML，這兩個簡單的貼在方法上也沒問題。
-->

---

# 兩位承辦人員

```java
// StudentDao：加一個方法
public int deductScore(Integer studentId, Integer points) {
    return studentMapper.deductScore(studentId, points);
}
```

```java
@Repository
public class PenaltyDao {
    private final PenaltyMapper penaltyMapper;

    public PenaltyDao(PenaltyMapper penaltyMapper) {
        this.penaltyMapper = penaltyMapper;
    }

    public int create(Integer studentId, String reason) {
        return penaltyMapper.create(studentId, reason);
    }
}
```

<!--
承辦人員這一層。

StudentDao 加一個 deductScore 方法，轉交給 StudentMapper。

記過簿由另一位承辦人員負責，所以建立一個新的類別 PenaltyDao。寫法和 StudentDao 一樣：@Repository，用建構子注入 PenaltyMapper，再加一個 create 方法。
-->

---

# 組長：加上 @Transactional

<CodeSteps>

```java {3-9|12-15|11|all}
@Service
public class StudentService {
    private final StudentDao studentDao;
    private final PenaltyDao penaltyDao;

    public StudentService(StudentDao studentDao, PenaltyDao penaltyDao) {
        this.studentDao = studentDao;
        this.penaltyDao = penaltyDao;
    }

    @Transactional
    public void penalizeStudent(Integer studentId, Integer points, String reason) {
        studentDao.deductScore(studentId, points);
        penaltyDao.create(studentId, reason);
    }
}
```

- 組長現在要指揮兩位承辦人員，所以注入兩個 Dao
- 記過的方法：先扣分，再寫記過紀錄
- `@Transactional`：這個方法裡的事算「同一件」。中途出錯，全部 Rollback
- 交易加在 **Service** 這一層，因為只有組長知道哪幾件事要算在一起

</CodeSteps>

<!--
重點在組長這一層。

（下一步）組長現在要指揮兩位承辦人員，所以建構子要注入兩個 Dao。原本的建構子只有 StudentDao，請多加一個 PenaltyDao。其他的方法都保留，這裡省略沒有列出來。

（下一步）記過的方法 penalizeStudent 做兩件事：先請 StudentDao 扣分，再請 PenaltyDao 寫記過紀錄。

（下一步）在方法上面加 @Transactional。意思就是：這個方法裡的事，算同一件。只要中途出錯，前面做過的全部 Rollback。

（下一步）注意交易是加在 Service 這一層。因為只有組長知道哪幾件事要算在一起。這就是第二十四章說的，組長負責決定事情該怎麼辦。
-->

---

# import 要選對

Eclipse 會給兩個選項，請選 **Spring** 的那一個：

<v-clicks>

- ✅ `org.springframework.transaction.annotation.Transactional`
- ⚠️ `jakarta.transaction.Transactional`：功能類似，但是等一下要用的設定它沒有

</v-clicks>

<!--
加 @Transactional 的時候，Eclipse 會給兩個 import 的選項。

（下一步）請選 org.springframework 開頭的，這是 Spring 自己的版本。

（下一步）另一個 jakarta 開頭的功能類似，但是等一下要用的設定它沒有。選錯的話，後面的程式會出現紅字。
-->

---

# 櫃台：記過的 API

```java
@PostMapping("/students/{id}/penalty")
public String penalizeStudent(@PathVariable(name = "id") Integer id,
                              @RequestParam(name = "points") Integer points,
                              @RequestParam(name = "reason") String reason) {
    studentService.penalizeStudent(id, points, reason);
    return "記過完成";
}
```

<v-click>

測試：`POST /students/1/penalty?points=10&reason=遲到`

</v-click>

<!--
最後是櫃台，在 StudentController 加一個 API。

路徑是 /students/ 編號 /penalty，意思是「幫這位同學記過」。扣幾分和原因，放在問號後面。

（下一步）測試的時候，用 POST 發送 /students/1/penalty，問號後面 points=10、reason=遲到。請把 1 換成你實際的學生編號。
-->

---

# 動手驗證 Rollback

<v-clicks>

1. **正常呼叫**一次 → 分數少 10 分，`penalty` 表多一筆
2. 把 `PenaltyDao.create()` 裡的那一行，**暫時改成** `throw new RuntimeException("測試");`
3. 再呼叫一次 → Postman 收到錯誤
4. 到資料庫看 `student` 表 → 分數**沒有被扣**
5. 把程式改回來

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left">
✅ 也試試看把 <code>@Transactional</code> 拿掉再做一次：這次分數會被扣掉，記過簿卻沒有紀錄。
</div>

</v-click>

<!--
來動手驗證 Rollback 真的有效。

（下一步）第一步，正常呼叫一次。分數少 10 分，penalty 表多一筆。

（下一步）第二步，故意製造錯誤。把 PenaltyDao 的 create 方法裡的那一行，暫時改成 throw new RuntimeException。throw 的意思是「丟出一個錯誤」，等於假裝寫記過簿的時候出錯了。

（下一步）第三步，再呼叫一次。這次 Postman 會收到錯誤。

（下一步）第四步，到資料庫看 student 表。分數沒有被扣。扣分明明先執行了，但是因為後面出錯，被 Rollback 了。

（下一步）第五步，記得把程式改回來。

（下一步）還可以多做一個對照：把 @Transactional 拿掉，再做一次同樣的實驗。這次分數會被扣掉，記過簿卻沒有紀錄。就是一開始故事裡的狀況。
-->

---

# 加在方法上，或加在類別上

```java
@Service
@Transactional
public class StudentService {

    public void penalizeStudent(Integer studentId, Integer points, String reason) { ... }

    @Transactional(readOnly = true)
    public Student getStudentById(Integer studentId) { ... }
}
```

<v-clicks>

- 加在**方法**上：只有這個方法是一筆交易
- 加在**類別**上：類別裡所有 public 方法都各自是一筆交易
- 方法上可以再寫一次，蓋掉類別的設定。`readOnly = true` 表示「這個方法只查詢、不改資料」

</v-clicks>

<!--
@Transactional 可以加在兩個地方。

（下一步）加在方法上，只有這個方法是一筆交易。剛才就是這樣寫。

（下一步）加在類別上，類別裡所有 public 的方法，都各自是一筆交易。

（下一步）兩個都寫的時候，方法上的設定會蓋掉類別的。例如這裡的查詢方法，寫了 readOnly = true，告訴資料庫這個方法只查詢、不改資料，資料庫可以處理得快一點。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 什麼時候會 Rollback？

<!--
接下來看一個容易忽略的細節：不是所有錯誤都會 Rollback。
-->

---

# 預設：只有 RuntimeException 會 Rollback

Java 把「錯誤」叫做**例外**（Exception），分成兩大類：

```
Exception（所有例外）
├── RuntimeException      ← 預設會 Rollback
│   ├── NullPointerException
│   ├── IllegalArgumentException
│   └── …
└── 其他，例如 IOException  ← 預設「不會」Rollback
```

<v-clicks>

- **RuntimeException**：程式執行中突然發生的錯誤，方法不用事先宣告
- **其他例外**（受檢例外）：方法要寫 `throws` 事先宣告，例如讀檔失敗的 `IOException`

</v-clicks>

<!--
在 Java 裡，「錯誤」有一個正式的名字，叫做例外，Exception。例外分成兩大類。

（下一步）第一類是 RuntimeException 這一家，像 NullPointerException。它們是程式執行中突然發生的錯誤，方法不用事先宣告。剛才實驗裡丟的就是這一種。

（下一步）第二類是其他的例外，叫做受檢例外。方法要寫 throws 事先宣告，例如讀檔失敗的 IOException。

重點是：@Transactional 預設只有遇到第一類 RuntimeException，才會 Rollback。遇到第二類，預設不會 Rollback，前面做過的事會被保留下來。這一點很多人不知道。
-->

---

# 自己決定：rollbackFor、noRollbackFor

<CodeSteps>

```java {1-2|4-5|7-8|all}
@Transactional(rollbackFor = Exception.class)
public void importData() throws IOException { ... }

@Transactional(rollbackFor = {IOException.class, SQLException.class})
public void importData2() throws IOException, SQLException { ... }

@Transactional(noRollbackFor = IllegalArgumentException.class)
public void process() { ... }
```

- `rollbackFor = Exception.class`：**任何**例外都 Rollback。最常用、最保險
- 也可以指定某幾種例外，用大括號列出來
- `noRollbackFor`：反過來，指定某種例外**不要** Rollback

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 不確定的時候，寫 <code>@Transactional(rollbackFor = Exception.class)</code> 就對了。
</div>

</v-click>

<!--
如果希望第二類例外也會 Rollback，可以自己設定。

（下一步）rollbackFor = Exception.class。Exception 是所有例外的源頭，所以意思是任何例外都 Rollback。這是最常用、最保險的寫法。

（下一步）也可以只指定某幾種例外，用大括號列出來。

（下一步）noRollbackFor 是反過來：指定某一種例外不要 Rollback，其他的 RuntimeException 照舊。這個比較少用。

（下一步）不確定的時候，寫 rollbackFor = Exception.class 就對了。所以我們的記過方法，建議也改成這樣寫。
-->

---

# 想一想

<Poll question="方法上只寫 @Transactional，執行到一半丟出 IOException（受檢例外）。前面已經做的修改會怎樣？" options="會 Rollback|不會 Rollback，被保留下來|程式無法編譯|資料表會被清空" answer="2" />

<!--
確認一下。

方法上只寫 @Transactional，沒有其他設定。執行到一半丟出 IOException，它是受檢例外。前面已經做的修改會怎樣？

（等大家作答）

（下一步）答案是不會 Rollback，被保留下來。

預設只有 RuntimeException 會 Rollback。想讓 IOException 也 Rollback，要加上 rollbackFor。
-->

---

# 三個容易踩到的地方

<v-clicks>

- **只對 public 方法有效**：加在 private 方法上不會有作用
- **同一個類別裡互相呼叫，不會生效**：A 方法呼叫同類別的 B 方法，B 上面的 `@Transactional` 不算數
- **類別要是 Spring 的 Bean**：例如有加 `@Service`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 原因：<code>@Transactional</code> 是 Spring 在「外面的人呼叫這個方法」時幫忙加上去的。從類別裡面自己呼叫自己，Spring 插不上手。
</div>

</v-click>

<!--
@Transactional 有三個容易踩到的地方。

（下一步）第一，只對 public 方法有效。加在 private 方法上不會有作用，而且不會報錯，很難發現。

（下一步）第二，同一個類別裡互相呼叫，不會生效。A 方法呼叫同一個類別的 B 方法，就算 B 上面有 @Transactional，也不算數。這是最多人踩到的。

（下一步）第三，類別要是 Spring 的 Bean，例如有加 @Service。

（下一步）這三點的原因其實是同一個。學過第十一章的同學會認得，這就是 AOP 的做法。@Transactional 是 Spring 在「外面的人呼叫這個方法」的時候，幫忙在前後加上開始交易和結束交易。從類別裡面自己呼叫自己，Spring 插不上手。

遇到第二種情況，解法是把 B 方法搬到另一個 Service 裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 動手練習

<!--
最後來做一個練習。
-->

---

# 練習：撤銷記過

教務處發現記錯了，要幫同學**撤銷記過**。在 `StudentService` 加一個方法，同時做兩件事：

1. 把扣掉的分數**加回去**
2. 把那一筆記過紀錄**刪掉**

**要求：** 任何一步丟出 `Exception`，兩件事都要 Rollback。

<v-click>

**提示：**

- `StudentMapper`：`UPDATE student SET score = score + #{points} WHERE id = #{studentId}`
- `PenaltyMapper`：`DELETE FROM penalty WHERE id = #{penaltyId}`
- API 可以設計成 `DELETE /students/{id}/penalty/{penaltyId}?points=10`

</v-click>

<!--
練習題。教務處發現記錯了，要幫同學撤銷記過。

請在 StudentService 加一個方法，同時做兩件事：把扣掉的分數加回去；把那一筆記過紀錄刪掉。

要求是：任何一步丟出 Exception，兩件事都要 Rollback。

（下一步）給三個提示。StudentMapper 要加一個加分的 SQL。PenaltyMapper 要加一個刪除的 SQL。API 可以設計成 DELETE /students/ 編號 /penalty/ 記過編號，要加回幾分放在問號後面。

請先暫停，自己試試看，再看下一頁。
-->

---

# 練習：參考答案

```java
// StudentMapper
@Update("UPDATE student SET score = score + #{points} WHERE id = #{studentId}")
int addScore(@Param("studentId") Integer studentId, @Param("points") Integer points);

// PenaltyMapper
@Delete("DELETE FROM penalty WHERE id = #{penaltyId}")
int deleteById(@Param("penaltyId") Integer penaltyId);

// StudentService（兩個 Dao 各加一個轉交的方法）
@Transactional(rollbackFor = Exception.class)
public void revokePenalty(Integer studentId, Integer penaltyId, Integer points) {
    studentDao.addScore(studentId, points);
    penaltyDao.deleteById(penaltyId);
}
```

<div class="mt-2 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left">
✅ 驗證方式和剛才一樣：讓第二步故意丟出例外，確認分數沒有被加回去。
</div>

<!--
這是參考答案。

StudentMapper 加一個 addScore，把分數加回去。PenaltyMapper 加一個 deleteById，刪掉那一筆記過紀錄。兩個 Dao 各加一個轉交的方法，這裡省略。

重點在 StudentService：方法上面加 @Transactional，並且寫 rollbackFor = Exception.class，因為題目要求任何例外都要 Rollback。方法裡依序呼叫兩個 Dao。

驗證方式和剛才一樣：讓第二步故意丟出例外，確認分數沒有被加回去。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="teacher,組長說：這幾件事算同一件=code,@Transactional（加在 Service 的方法上）|ok,全部成功才算數=code,Commit|no,有一件失敗就全部擦掉=code,Rollback|what,哪些錯誤要擦掉=code,預設 RuntimeException；rollbackFor 可以改" />

<!--
我們用一張圖複習今天的內容。

（下一步）組長說這幾件事算同一件，是 @Transactional，加在 Service 的方法上。

（下一步）全部成功才算數，是 Commit。

（下一步）有一件失敗就全部擦掉，是 Rollback。

（下一步）哪些錯誤要擦掉：預設是 RuntimeException，可以用 rollbackFor 改。
-->

---

# 章節總結

<v-clicks>

- **交易**：一組操作全部成功，或全部 Rollback
- **ACID**：原子性、一致性、隔離性、持久性
- **`@Transactional`**：加在 Service 的方法或類別上；import 選 Spring 的
- **預設規則**：只有 `RuntimeException` 會 Rollback
- **`rollbackFor = Exception.class`**：任何例外都 Rollback
- **注意**：只對 public 方法有效；同一個類別裡互相呼叫不會生效

</v-clicks>

<v-click>

下一章：兩個人同時搶最後一個名額，會發生什麼事？

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）交易是一組操作全部成功，或全部 Rollback。四個特性合稱 ACID。@Transactional 加在 Service 的方法或類別上。預設只有 RuntimeException 會 Rollback。寫 rollbackFor = Exception.class，任何例外都會 Rollback。它只對 public 方法有效，同一個類別裡互相呼叫不會生效。

（最後一步）交易解決了「一個人做兩件事」的問題。下一章要看另一種狀況：兩個人同時搶最後一個名額，會發生什麼事？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請一定要做一次 Rollback 的實驗：有加 @Transactional 和沒加的時候，各看一次資料庫的結果。親眼看過，印象會很深。

有任何問題歡迎提出來。
-->
