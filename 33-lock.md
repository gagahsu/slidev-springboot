---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 樂觀鎖 & 悲觀鎖
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
    樂觀鎖 & 悲觀鎖
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「高並發場景下，保護資料不被同時修改的兩種策略」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第三十三章。

上一章的交易，解決的是「一個人做兩件事，做到一半出錯」的問題。

今天要看另一種狀況：兩個人在同一個時間，搶同一筆資料。這在選課、搶票、搶購的時候一定會遇到。解決的方法叫做「鎖」。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **同時搶會出什麼事？** 名額只有 1 個，卻收了 2 個人
- **兩種解決的想法**：悲觀鎖（先鎖起來）和樂觀鎖（交件時核對版本）
- **在程式裡怎麼寫？** `@Lock` 和 `@Version`

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，兩個人同時搶，會出什麼事。名額只有 1 個，卻收了 2 個人。

（下一步）第二，兩種解決的想法：悲觀鎖是先鎖起來，樂觀鎖是交件的時候核對版本。

（下一步）第三，在程式裡怎麼寫。JPA 提供了 @Lock 和 @Version。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 最後一個名額

<!--
先看教務處選課的時候發生的事。
-->

---

# 兩個人同時搶

<SeatRace mode="race" />

<!--
學校開了一門很熱門的選修課：攝影課。現在只剩最後 1 個名額。

（下一步）小明和小美在同一個時間翻開選課簿。兩個人都看到「剩 1」，都覺得：太好了，還有名額。

（下一步）於是兩個人各自把 1 改成 0，都以為自己搶到了。

（下一步）結果：名額只有 1 個，卻收了 2 個人。

問題出在哪裡？兩個人「看」和「改」之間有一小段時間。在這段時間裡，對方也看到了同樣的舊數字。

注意，這和上一章不一樣。這裡沒有任何一步出錯，每個人的動作都是成功的。所以光靠交易解決不了。
-->

---

# 想一想

<Poll question="為什麼兩個人都會報名成功？" options="資料庫壞掉了|兩個人在對方修改之前，都先看到了「剩 1」|程式少寫了 @Transactional|名額本來就有 2 個" answer="2" />

<!--
來想一題。

為什麼兩個人都會報名成功？

（等大家作答）

（下一步）答案是：兩個人在對方修改之前，都先看到了「剩 1」。

每個人都根據自己看到的舊資料做判斷。這種「很多人同時改同一筆資料」的狀況，叫做並發。處理它的方法，叫做並發控制。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 兩種解決的想法

<!--
教務處有兩種做法可以避免這個問題。
-->

---

# 做法一：先鎖起來

<SeatRace mode="pessimistic" />

<!--
第一種做法比較悲觀：先假設「一定會有人跟我搶」。

（下一步）小明先到。他一拿到選課簿，就把簿子鎖上。小美只能在旁邊等，連看都不能看。

（下一步）小明把名額改成 0，報名成功，然後把鎖打開。

（下一步）輪到小美。她這時候看到的，是最新的「剩 0」。所以她知道額滿了，報名失敗。

結果是對的：只有一個人報名成功。代價是小美要等。
-->

---

# 做法二：交件時核對版本

<SeatRace mode="optimistic" />

<!--
第二種做法比較樂觀：先假設「應該不會剛好有人跟我搶」。所以不鎖簿子，但是在簿子上多一格「版本」。每改一次，版本就加 1。

（下一步）兩個人同時翻開，都看到「剩 1、版本 1」。到這裡和一開始一樣。

（下一步）小明先交件。交件的時候要核對：簿子現在還是我看到的版本 1 嗎？是，對得上。所以成功，名額變 0，版本變成 2。

（下一步）小美交件。她手上記的是版本 1，但是簿子已經是版本 2 了。對不上，代表「在你看完之後，有別人改過了」。所以被退件，請她重新來一次。

結果也是對的。這次沒有人需要等，但是小美要自己重試。
-->

---

# 把故事對應到程式

<Pairs left="教務處" right="程式" rows="lock,先把簿子鎖起來，別人等我用完=code,悲觀鎖（Pessimistic Lock）|book,不鎖，交件時核對版本=code,樂觀鎖（Optimistic Lock）|what,簿子上的「版本」那一格=code,version 欄位|no,版本對不上，被退件=code,丟出例外，由程式決定要不要重試" />

<!--
把故事對應到程式。

（下一步）先把簿子鎖起來，別人等我用完。這叫悲觀鎖，Pessimistic Lock。

（下一步）不鎖，交件時核對版本。這叫樂觀鎖，Optimistic Lock。雖然名字有「鎖」，但是它其實沒有鎖任何東西。

（下一步）簿子上的版本那一格，對應到資料表裡的一個 version 欄位。

（下一步）版本對不上、被退件，對應到程式丟出一個例外。要不要重試，由我們的程式決定。
-->

---

# 兩種做法的比較

<Pairs left="悲觀鎖" right="樂觀鎖" sign="vs" rows="lock,查資料的時候就上鎖=book,存檔的時候才核對版本|what,別人要排隊等=ok,大家不用等|ok,不會被退件=no,撞到了會被退件，要重試|shop,適合：很多人搶同一筆（選課、搶票）=doc,適合：很少撞在一起（改個人資料）" />

<!--
兩種做法放在一起比較。

（下一步）悲觀鎖在查資料的時候就上鎖。樂觀鎖在存檔的時候才核對版本。

（下一步）悲觀鎖，別人要排隊等。樂觀鎖，大家不用等。

（下一步）悲觀鎖不會被退件。樂觀鎖撞到了會被退件，要重試。

（下一步）所以悲觀鎖適合很多人搶同一筆資料的情況，像選課、搶票。雖然要排隊，但是每個人都能得到確定的結果。樂觀鎖適合很少撞在一起的情況，像修改自己的個人資料。平常大家都很快，偶爾撞到再重試就好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 先寫一個「沒有保護」的選課

<!--
來寫程式。先寫一個沒有保護的版本。
-->

---

# 選課簿：Course

```java
@Getter
@Setter
@Entity
public class Course {
    @Id
    private Integer id;
    private String name;
    private Integer remain;
}
```

```java
public interface CourseRepository extends JpaRepository<Course, Integer> {
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這一章用 JPA 來寫。啟動後請在 <code>course</code> 表新增一筆：<code>id = 1</code>、<code>name = 攝影課</code>、<code>remain = 1</code>。
</div>

</v-click>

<!--
選課簿對應一個新的 Entity，叫 Course。有三個變數：編號、課程名稱、剩餘名額 remain。

再建立 CourseRepository，繼承 JpaRepository。這些都是第二十六章學過的寫法。

（下一步）這一章用 JPA 來寫，因為 JPA 對這兩種鎖都有現成的支援。啟動之後，JPA 會自動建立 course 資料表。請用 Workbench 在裡面新增一筆資料：id 是 1，name 是攝影課，remain 是 1。
-->

---

# 選課的流程

<CodeSteps>

```java {12|13|14-15|16-18|all}
@Service
public class CourseService {
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Transactional
    public boolean enroll(Integer courseId) {
        Course course = courseRepository.findById(courseId).orElse(null);
        if (course == null) return false;
        if (course.getRemain() <= 0) return false;
        course.setRemain(course.getRemain() - 1);
        courseRepository.save(course);
        return true;
    }
}
```

- 先查出這門課；找不到就回傳 `false`
- **看**：名額剩 0 就回傳 `false`
- **改**：名額減 1，存回去
- 成功就回傳 `true`
- 「看」和「改」之間，別人可能也看到了同樣的數字

</CodeSteps>

<!--
這是選課的流程，寫在 CourseService 裡。為了讓例子短一點，這次組長直接找 CourseRepository，沒有另外寫 Dao。

（下一步）先用編號查出這門課。找不到就回傳 false。

（下一步）看一下名額。剩 0 或更少，就回傳 false，代表額滿。

（下一步）還有名額，就把名額減 1，存回去。

（下一步）成功就回傳 true。

（下一步）問題就出在「看」和「改」之間。在這兩行中間，別人可能也看到了同樣的數字。這個版本就是故事一開始的狀況。
-->

---

# 櫃台：選課的 API

<CodeSteps>

```java {1-2|3-6|all}
@PostMapping("/courses/{id}/enroll")
public ResponseEntity<String> enroll(@PathVariable(name = "id") Integer id) {
    boolean success = courseService.enroll(id);
    return success
        ? ResponseEntity.ok("選課成功")
        : ResponseEntity.status(400).body("已額滿，或沒有這門課");
}
```

- 回傳型別換成 `ResponseEntity<String>`：可以**自己決定 Http 狀態碼**
- `ResponseEntity.ok(…)` 是 200；`ResponseEntity.status(400).body(…)` 是 400 加上一段訊息
- `條件 ? A : B` 的意思是：條件成立用 A，不成立用 B

</CodeSteps>

<!--
櫃台這邊，建立一個 CourseController，注入 CourseService，再加這個方法。

（下一步）注意回傳型別。之前我們都直接回傳文字或物件，狀態碼一律是 200。這次換成 ResponseEntity，它讓我們可以自己決定 Http 狀態碼。第十三章學過，狀態碼是用來告訴前端這次請求的結果。

（下一步）選課成功，回傳 ResponseEntity.ok，就是 200。選課失敗，回傳 status(400)，再用 body 放一段訊息。

（下一步）中間那個問號和冒號的寫法，意思是：條件成立用前面的，不成立用後面的。它是 if else 的簡短寫法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 悲觀鎖：@Lock

<!--
先用悲觀鎖來保護它。
-->

---

# 查的時候就上鎖

<CodeSteps>

```java {3-4|2|all}
public interface CourseRepository extends JpaRepository<Course, Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select c from Course c where c.id = :id")
    Optional<Course> findCourseForUpdate(@Param("id") Integer id);
}
```

- 用 `@Query` 寫一個「用編號查課程」的方法
- 上面加 `@Lock(LockModeType.PESSIMISTIC_WRITE)`：查的同時把這一筆鎖起來
- JPA 實際送出的 SQL 是 `SELECT … FOR UPDATE`：「我查這一筆是為了要改它，其他人先等一下」

</CodeSteps>

<!--
悲觀鎖的重點是：查的時候就上鎖。所以要改的是「查詢」。

（下一步）在 CourseRepository 用第二十八章的 @Query，寫一個用編號查課程的方法。

（下一步）上面加 @Lock，括號裡是 LockModeType.PESSIMISTIC_WRITE。意思是查的同時，把這一筆資料鎖起來。

（下一步）JPA 實際送出的 SQL，最後會多兩個字：FOR UPDATE。意思是「我查這一筆是為了要改它，其他人先等一下」。這是資料庫本身就有的功能。
-->

---

# Service 只改一行

<CodeSteps>

```java {3|1|all}
@Transactional
public boolean enroll(Integer courseId) {
    Course course = courseRepository.findCourseForUpdate(courseId).orElse(null);
    if (course == null) return false;
    if (course.getRemain() <= 0) return false;
    course.setRemain(course.getRemain() - 1);
    courseRepository.save(course);
    return true;
}
```

- 把 `findById()` 換成有上鎖的 `findCourseForUpdate()`
- `@Transactional` 一定要有：鎖會一直留到**交易結束**才打開
- 第二個人會停在第 3 行等。等到的時候，看到的已經是最新的名額

</CodeSteps>

<!--
Service 只要改一行。

（下一步）把原本的 findById()，換成有上鎖的 findCourseForUpdate()。

（下一步）方法上面的 @Transactional 一定要有。因為鎖會一直留到交易結束才打開。也就是整個方法做完、Commit 的時候。沒有交易的話，鎖一拿到就馬上放掉，等於沒鎖。

（下一步）這樣一來，第二個人會停在第三行等。等到第一個人做完，他才拿到資料。這時候看到的已經是最新的名額，下一行的判斷就不會錯了。
-->

---

# 兩種上鎖的方式

<v-clicks>

- `PESSIMISTIC_WRITE` → `SELECT … FOR UPDATE`：我要改，別人不能改，也不能用同樣的方式來鎖
- `PESSIMISTIC_READ` → `SELECT … FOR SHARE`：我只是不想資料被改，別人可以看，但不能改

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 選課、搶票這種「看完就要改」的情況，用 <code>PESSIMISTIC_WRITE</code>。
</div>

</v-click>

<!--
LockModeType 有兩種常用的。

（下一步）PESSIMISTIC_WRITE，對應 FOR UPDATE。意思是我要改，別人不能改，也不能用同樣的方式來鎖。

（下一步）PESSIMISTIC_READ，對應 FOR SHARE。意思是我只是不想這筆資料在我處理的期間被改掉，別人可以看，但是不能改。

（下一步）選課、搶票這種「看完就要改」的情況，用 PESSIMISTIC_WRITE。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 樂觀鎖：@Version

<!--
同一個功能，換成樂觀鎖來做。
-->

---

# 在簿子上加一格「版本」

<CodeSteps>

```java {9-10|all}
@Getter
@Setter
@Entity
public class Course {
    @Id
    private Integer id;
    private String name;
    private Integer remain;
    @Version
    private Integer version;
}
```

- 多一個變數 `version`，上面加 `@Version`
- 版本號由 JPA 自動管理：每次存檔自動加 1，我們不用自己改

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 資料表裡原本那一筆攝影課，請把 <code>version</code> 欄位填 <code>0</code>，不要留空。
</div>

</v-click>

<!--
樂觀鎖要先在簿子上加一格版本。

（下一步）在 Course 多一個變數 version，上面加 @Version。

（下一步）版本號由 JPA 自動管理。每次存檔，它會自動加 1。我們不用、也不應該自己去改它。

（下一步）一個小提醒。重新啟動之後，資料表會多一個 version 欄位。原本那一筆攝影課，請把 version 填 0，不要留空，不然 JPA 會搞不清楚狀況。順便把 remain 改回 1，等一下好測試。
-->

---

# JPA 存檔時幫我們核對

`save()` 的時候，JPA 送出的 SQL 會自動多兩個地方：

```sql
UPDATE course
SET remain = 0, version = 2
WHERE id = 1 AND version = 1
```

<v-clicks>

- `WHERE … AND version = 1`：只有版本還是我當初看到的 1，才會更新
- `SET … version = 2`：更新成功，版本加 1
- 如果別人先改過，版本已經不是 1，這句 `UPDATE` 會**動到 0 筆**
- JPA 發現動到 0 筆，就丟出 `ObjectOptimisticLockingFailureException`

</v-clicks>

<!--
加了 @Version 之後，Service 的程式不用改，用回原本的 findById() 就可以。差別發生在 save() 的時候。JPA 送出的 UPDATE 會自動多兩個地方。

（下一步）WHERE 後面多了一個條件：version 等於 1。意思是只有版本還是我當初看到的 1，才會更新。

（下一步）SET 後面多了 version = 2。更新成功，版本就加 1。

（下一步）如果別人先改過，版本已經不是 1 了，這句 UPDATE 就找不到符合的資料，會動到 0 筆。還記得第二十四章說的嗎？update 會回報動到幾筆。

（下一步）JPA 發現動到 0 筆，就知道撞到了，於是丟出一個例外。名字很長：ObjectOptimisticLockingFailureException。看到 OptimisticLocking，就知道是樂觀鎖撞到了。
-->

---

# 櫃台：接住被退件的情況

<CodeSteps>

```java {3-8|9-11|all}
@PostMapping("/courses/{id}/enroll")
public ResponseEntity<String> enroll(@PathVariable(name = "id") Integer id) {
    try {
        boolean success = courseService.enroll(id);
        return success
            ? ResponseEntity.ok("選課成功")
            : ResponseEntity.status(400).body("已額滿，或沒有這門課");
    } catch (ObjectOptimisticLockingFailureException e) {
        return ResponseEntity.status(409).body("剛好有人先選了，請再試一次");
    }
}
```

- `try { … }`：試著執行裡面的程式
- `catch (…) { … }`：如果丟出這種例外，就改做這裡的事
- 狀態碼 `409`（Conflict）：這次請求和目前的資料狀態衝突了

</CodeSteps>

<!--
樂觀鎖撞到的時候會丟出例外。如果我們不處理，前端會收到一個看不懂的 500 錯誤。所以要在櫃台把它接住。

（下一步）用 try 把原本的程式包起來。try 的意思是「試著執行裡面的程式」。

（下一步）後面接 catch。意思是：如果 try 裡面丟出了括號裡的這種例外，就改做這裡的事。這裡我們回傳狀態碼 409，再加一句訊息，請使用者再試一次。

（下一步）409 的意思是 Conflict，衝突。代表這次請求本身沒有錯，只是和目前的資料狀態撞在一起了。

悲觀鎖的版本不需要這段 try catch，因為它是排隊，不會被退件。
-->

---

# 想一想

<Poll question="用樂觀鎖時，小美存檔的 SQL 是「UPDATE … WHERE id = 1 AND version = 1」，但資料庫裡的 version 已經是 2。會發生什麼事？" options="照樣更新成功|動到 0 筆，JPA 丟出例外|資料庫把 version 改回 1|小美會一直等到有人解鎖" answer="2" />

<!--
確認一下。

用樂觀鎖的時候，小美存檔的 SQL 條件是 version 等於 1。但是資料庫裡的 version 已經是 2 了。會發生什麼事？

（等大家作答）

（下一步）答案是：動到 0 筆，JPA 丟出例外。

條件對不上，所以沒有任何資料被更新。第四個選項「一直等」是悲觀鎖的行為。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# 動手觀察

<!--
這兩種鎖要怎麼親眼看到效果？
-->

---

# 故意放慢，才看得到

正常情況下，一次選課只要幾毫秒，很難剛好撞在一起。先在「看」和「改」之間**故意等 3 秒**：

```java
if (course.getRemain() <= 0) return false;
try {
    Thread.sleep(3000);
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
course.setRemain(course.getRemain() - 1);
```

<v-click>

再開兩個 Postman 分頁，幾乎同時送出 `POST /courses/1/enroll`。

<div class="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ <code>Thread.sleep</code> 只是為了觀察，看完一定要刪掉。
</div>

</v-click>

<!--
正常情況下，一次選課只要幾毫秒，我們用手按很難剛好撞在一起。

所以先動一個手腳：在「看」和「改」之間，故意等 3 秒。Thread.sleep(3000) 的意思是讓程式停 3000 毫秒，也就是 3 秒。外面的 try catch 是它要求的固定寫法，照抄就好。

（下一步）然後開兩個 Postman 的分頁，幾乎同時送出 POST /courses/1/enroll。

這個 sleep 只是為了觀察，看完一定要刪掉。
-->

---

# 三種版本，三種結果

每次測試前，先把 `remain` 改回 `1`：

<v-clicks>

- **沒有保護**：兩個請求都回傳「選課成功」。名額 1 個，收了 2 個人
- **悲觀鎖**：第一個約 3 秒後成功；第二個**卡住等待**，約 6 秒後回傳 400「已額滿」
- **樂觀鎖**：兩個都約 3 秒後回來，一個成功，另一個回傳 **409**「請再試一次」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 兩種鎖的結果都正確：<code>remain</code> 只被扣了一次。差別是後到的人「等了很久才知道額滿」，還是「馬上被退件」。
</div>

</v-click>

<!--
把三種版本各測一次。每次測試之前，記得先把資料表的 remain 改回 1。

（下一步）沒有保護的版本：兩個請求都回傳選課成功。名額只有 1 個，卻收了 2 個人。

（下一步）悲觀鎖的版本：第一個請求大約 3 秒後成功。第二個請求會卡住等待，因為它在排隊等鎖。大約 6 秒後才回來，結果是 400，已額滿。

（下一步）樂觀鎖的版本：兩個請求都大約 3 秒後回來，沒有人排隊。一個成功，另一個回傳 409，請再試一次。

（下一步）兩種鎖的結果都正確：remain 只被扣了一次。差別是後到的人，是等了很久才知道額滿，還是馬上被退件。
-->

---

# 不用 JPA，也可以用這兩種鎖

`@Lock` 和 `@Version` 是 JPA 幫忙包裝好的。背後的做法，用 MyBatis 或 Spring JDBC 自己寫 SQL 也做得到：

```xml
<!-- 悲觀鎖：查詢的最後加上 FOR UPDATE -->
<select id="findCourseForUpdate" resultType="com.example.demo.Course">
    SELECT * FROM course WHERE id = #{id} FOR UPDATE
</select>

<!-- 樂觀鎖：WHERE 多核對版本，SET 把版本加 1 -->
<update id="updateCourse">
    UPDATE course SET remain = #{remain}, version = version + 1
    WHERE id = #{id} AND version = #{version}
</update>
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 自己寫樂觀鎖時，要自己檢查回傳值：<code>update</code> 回傳 <code>0</code>，就代表被別人搶先了，要自己丟出例外。
</div>

</v-click>

<!--
最後補充一點。@Lock 和 @Version 是 JPA 幫忙包裝好的。但是這兩種鎖背後的做法，並不是 JPA 才有。用 MyBatis 或 Spring JDBC 自己寫 SQL 也做得到。

上面是悲觀鎖：在查詢的最後自己加上 FOR UPDATE。

下面是樂觀鎖：WHERE 多核對一個版本，SET 把版本加 1。就是剛才 JPA 自動產生的那句 SQL。

（下一步）自己寫樂觀鎖的時候，JPA 不會幫我們丟例外。要自己檢查回傳值：update 回傳 0，就代表被別人搶先了，這時候要自己丟出例外。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="lock,先鎖簿子，別人排隊=code,悲觀鎖：@Lock(PESSIMISTIC_WRITE) → FOR UPDATE|book,簿子加一格版本，交件時核對=code,樂觀鎖：@Version|no,版本對不上，退件=code,ObjectOptimisticLockingFailureException → 回傳 409|teacher,鎖要留到整件事做完=code,兩種都要搭配 @Transactional" />

<!--
我們用一張圖複習今天的內容。

（下一步）先鎖簿子、別人排隊，是悲觀鎖。用 @Lock，背後是 FOR UPDATE。

（下一步）簿子加一格版本、交件時核對，是樂觀鎖。用 @Version。

（下一步）版本對不上被退件，是那個名字很長的例外。我們接住它，回傳 409。

（下一步）兩種鎖都要搭配 @Transactional。
-->

---

# 章節總結

<v-clicks>

- **並發問題**：很多人同時改同一筆資料，各自根據舊資料做判斷
- **悲觀鎖**：查詢時上鎖，別人排隊。`@Lock(LockModeType.PESSIMISTIC_WRITE)`
- **樂觀鎖**：存檔時核對版本，撞到就丟例外。`@Version`
- **怎麼選**：常常撞在一起用悲觀鎖；很少撞在一起用樂觀鎖
- **`ResponseEntity`**：自己決定回傳的狀態碼；樂觀鎖撞到時回傳 409
- **必須搭配**：`@Transactional`

</v-clicks>

<v-click>

下一章是這個單元的最後一章：有人在申請單上動手腳，SQL Injection。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）並發問題是很多人同時改同一筆資料。悲觀鎖在查詢時上鎖，別人排隊。樂觀鎖在存檔時核對版本，撞到就丟例外。常常撞在一起用悲觀鎖，很少撞在一起用樂觀鎖。ResponseEntity 讓我們自己決定回傳的狀態碼。兩種鎖都要搭配 @Transactional。

（最後一步）下一章是這個單元的最後一章。我們來看一種很有名的攻擊：有人在申請單上動手腳，SQL Injection。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請照「動手觀察」那一段，把三種版本都測一次。親眼看到第二個請求卡住、或是收到 409，會比聽講清楚很多。

有任何問題歡迎提出來。
-->
