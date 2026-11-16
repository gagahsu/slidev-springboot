---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: SQL Injection 防範
routeAlias: ch34
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
    SQL Injection 防範
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓使用者輸入永遠只是資料，而不是程式碼」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第三十四章，也是資料庫這個單元的最後一章。

前面我們學了很多種把資料存進資料庫、拿出來的方法。今天換一個角度：如果有人不懷好意，故意在申請單上動手腳呢？

這種攻擊非常有名，叫做 SQL Injection。好消息是，我們前面學的寫法，其實已經在防它了。今天把原因講清楚。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **SQL Injection 是什麼？** 有人在輸入的內容裡偷藏 SQL
- **為什麼會中招？** 把使用者輸入的字，直接接進 SQL 字串
- **怎麼防？** 留空格、再填值。三種工具各自的安全寫法

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，SQL Injection 是什麼。簡單說，就是有人在輸入的內容裡偷藏 SQL。

（下一步）第二，為什麼會中招。原因只有一個：把使用者輸入的字，直接接進 SQL 字串。

（下一步）第三，怎麼防。答案我們早就學過了：留空格、再填值。最後會整理三種工具各自的安全寫法。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 有人在申請單上動手腳

<!--
先看教務處發生的事。
-->

---

# 一張「照著抄」的申請單

教務處有一個「用姓名查同學」的功能。新來的工讀生這樣寫：

```java
String sql = "SELECT id, name FROM student WHERE name = '" + name + "'";
```

<v-clicks>

- 意思是：把對方說的名字，**直接接在** SQL 字串的中間
- 對方說 `Judy` → `SELECT id, name FROM student WHERE name = 'Judy'`
- 看起來很正常，也查得到 Judy

</v-clicks>

<!--
教務處有一個功能：用姓名查同學。新來的工讀生這樣寫。

（下一步）他用加號，把對方說的名字，直接接在 SQL 字串的中間。前後各有一個單引號，因為 SQL 裡的文字要用單引號包起來。

（下一步）如果對方說的是 Judy，接起來的 SQL 就是 WHERE name = 'Judy'。

（下一步）看起來很正常，也查得到 Judy。

這種寫法就像櫃台的人完全不想，對方說什麼，就一字不漏照著抄到申請單上。
-->

---

# 如果對方說的不是名字

有人在姓名欄輸入：`' OR '1'='1`

<UrlParts parts="…WHERE name = ';;程式寫好的;;申請單原本的字;;前面這一段是程式寫好的，最後是一個單引號||' OR '1'='1;;對方輸入的;;姓名欄的內容;;對方輸入的第一個單引號，把「名字」提早結束了；後面接了一句 OR '1'='1||';;程式寫好的;;結尾的引號;;程式原本準備的結尾引號，剛好補在最後面，整句 SQL 沒有語法錯誤" />

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 條件變成「名字是空的，<b>或者</b> '1' 等於 '1'」。後半句永遠成立，所以<b>全校同學的資料都被查出來了</b>。
</div>

</v-click>

<!--
但是如果對方說的不是名字呢？有人在姓名欄輸入了這一串奇怪的字：單引號、OR、'1'='1。

我們把接起來的 SQL 拆開看。

（下一步）前面這一段是程式寫好的，最後是一個單引號，準備開始放名字。

（下一步）中間是對方輸入的。他的第一個字就是單引號，把「名字」提早結束了。所以名字變成空的。後面接了一句 OR '1'='1。

（下一步）最後是程式原本準備的結尾引號，剛好補在最後面。所以整句 SQL 沒有任何語法錯誤，資料庫會照常執行。

（下一步）條件變成：名字是空的，或者 '1' 等於 '1'。後半句永遠成立。所以每一位同學都符合條件，全校同學的資料都被查出來了。

對方輸入的東西，本來應該只是「資料」，結果變成了「指令」的一部分。這就是 SQL Injection，中文叫 SQL 注入，或 SQL 隱碼攻擊。
-->

---

# 更糟的例子：不用密碼就登入

教務系統的登入功能：

```java
String sql = "SELECT * FROM staff WHERE account = '" + account
           + "' AND password = '" + password + "'";
```

有人在帳號欄輸入 `admin' -- `（`--` 在 SQL 裡代表「後面都是註解」）：

```sql
SELECT * FROM staff WHERE account = 'admin' -- ' AND password = '隨便打'
```

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ <code>--</code> 後面檢查密碼的那一段，全部變成註解。<b>不知道密碼，也能用 admin 登入。</b>
</div>

</v-click>

<!--
再看一個更糟的例子。教務系統的登入功能，用帳號和密碼去查職員的資料表，查得到就算登入成功。寫法一樣是用加號接起來。

有人在帳號欄輸入 admin，後面接一個單引號，再接兩個減號。在 SQL 裡，兩個減號代表「後面都是註解」，資料庫會忽略它。

接起來的 SQL 就變成下面這樣。

（下一步）兩個減號後面，檢查密碼的那一段，全部變成註解了。所以條件只剩下帳號是 admin。這個人不知道密碼，也能用 admin 的身份登入。

SQL Injection 能做的壞事很多：偷看資料、假冒登入，甚至刪掉整張資料表。它多年來一直是最常見的網站攻擊之一。
-->

---

# 想一想

<Poll question="SQL Injection 能成功，最根本的原因是什麼？" options="資料庫的密碼太簡單|程式把使用者輸入的字，直接接進 SQL 字串|使用者用了 Postman|資料表沒有設定主鍵" answer="2" />

<!--
來想一題。

SQL Injection 能成功，最根本的原因是什麼？

（等大家作答）

（下一步）答案是：程式把使用者輸入的字，直接接進 SQL 字串。

和資料庫的密碼、用什麼工具發請求都沒有關係。問題出在我們自己的程式怎麼組 SQL。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 防範的方法：留空格，再填值

<!--
知道原因，就知道怎麼防了。
-->

---

# 申請單和資料，分開交

<Pairs left="照著抄（危險）" right="留空格再填（安全）" sign="vs" rows="form,對方說什麼，就抄進申請單=ok,申請單先印好，只留空格|no,對方的話變成申請單的一部分=ok,對方的話只能填進空格裡|what,資料庫分不出哪些是指令=ok,資料庫先看懂指令，再收資料|code,用 + 把字串接起來=code,參數化查詢：?、:名字、#{ }" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>參數化查詢</b>：SQL 的樣子先固定下來，值之後另外交。填進空格的內容，不管長什麼樣子，永遠只會被當成<b>資料</b>。
</div>

</v-click>

<!--
防範的方法，就是第二十四章學的：申請單留空格，再填值。我們把兩種做法放在一起看。

（下一步）危險的做法是照著抄：對方說什麼，就抄進申請單。安全的做法是：申請單先印好，只留空格。

（下一步）照著抄，對方的話會變成申請單的一部分。留空格，對方的話只能填進空格裡。

（下一步）照著抄，資料庫拿到的是一整句話，分不出哪些是我們寫的指令、哪些是對方給的資料。留空格，資料庫會先收到申請單，把指令看懂、定下來；之後才收到要填的資料。

（下一步）對應到程式：危險的是用加號把字串接起來。安全的是參數化查詢，也就是問號、冒號加名字、井字號加大括號這些空格的寫法。

（下一步）用一句話說參數化查詢：SQL 的樣子先固定下來，值之後另外交。填進空格的內容，不管長什麼樣子，永遠只會被當成資料。
-->

---

# 同樣的輸入，這次沒事了

```java
String sql = "SELECT id, name FROM student WHERE name = :name";
Map<String, Object> map = new HashMap<>();
map.put("name", name);
```

對方一樣輸入 `' OR '1'='1`：

<v-clicks>

- 資料庫先看懂申請單：「查 `name` 等於**某個值**的同學」
- 再收到那個值：一整串 `' OR '1'='1`
- 於是它去找「名字剛好叫做 `' OR '1'='1`」的同學
- 當然找不到 → 回傳空的結果，**攻擊失敗**

</v-clicks>

<!--
把剛才的查詢改成留空格的寫法。SQL 裡用冒號 name 留一個空格，值放進 Map。這就是第二十五章的寫法。

對方一樣輸入那一串奇怪的字。這次會怎樣？

（下一步）資料庫先看懂申請單：這是要查 name 等於某個值的同學。這時候指令的樣子就定下來了，不會再變。

（下一步）接著才收到那個值，就是那一整串字。

（下一步）於是資料庫老老實實地去找：有沒有哪位同學，名字剛好叫做「單引號 OR '1'='1」。

（下一步）當然找不到。所以回傳空的結果，攻擊失敗。

那一串字裡的單引號和 OR，這次只是名字裡的普通文字，完全沒有機會變成指令。
-->

---

# 背後的機制：PreparedStatement

<v-clicks>

- Java 原生的 JDBC 裡，負責「留空格、再填值」的工具叫 **`PreparedStatement`**
- Prepared 是「預先準備好」的意思：SQL 先交給資料庫準備好，值之後才補上
- Spring JDBC、JPA、MyBatis 的空格寫法，背後用的都是它
- 額外的好處：同一句 SQL 只要準備一次，重複執行時比較快

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 所以我們不用自己寫 <code>PreparedStatement</code>。只要<b>用對空格的寫法</b>，三位幫手就會自動幫我們用它。
</div>

</v-click>

<!--
這個機制在 Java 裡有一個正式的名字。

（下一步）Java 原生的 JDBC 裡，負責「留空格、再填值」的工具叫 PreparedStatement。

（下一步）Prepared 是「預先準備好」的意思。SQL 先交給資料庫準備好，值之後才補上。

（下一步）我們學過的 Spring JDBC、JPA、MyBatis，它們的空格寫法，背後用的都是 PreparedStatement。

（下一步）它還有一個額外的好處。同一句 SQL 只要準備一次，之後換不同的值重複執行，會比較快。第二十四章的批次新增就是受惠於這一點。

（下一步）所以我們不用自己寫 PreparedStatement。只要用對空格的寫法，三位幫手就會自動幫我們用它。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 三位幫手的安全寫法

<!--
來整理三位幫手各自的安全寫法，還有各自的陷阱。
-->

---

# Spring JDBC

```java
// ❌ 危險：用 + 把輸入接進 SQL
String sql = "SELECT id, name FROM student WHERE name = '" + name + "'";
namedParameterJdbcTemplate.query(sql, new HashMap<>(), new StudentRowMapper());

// ✅ 安全：留空格，值放進 Map
String sql = "SELECT id, name FROM student WHERE name = :name";
Map<String, Object> map = new HashMap<>();
map.put("name", name);
namedParameterJdbcTemplate.query(sql, map, new StudentRowMapper());
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 用 <code>JdbcTemplate</code> 加問號 <code>?</code> 的寫法也一樣安全。危險的永遠是「加號」。
</div>

</v-click>

<!--
第一位，Spring JDBC。

上面是危險的寫法：用加號把輸入接進 SQL。就算用的是 NamedParameterJdbcTemplate，只要 SQL 是這樣接出來的，一樣會中招。工具本身不會自動保護我們。

下面是安全的寫法：留空格，值放進 Map。就是我們在第二十四、二十五章一直在寫的樣子。

（下一步）第二十四章提過另一種用問號的空格，那種寫法也一樣安全。危險的永遠是加號。
-->

---

# Spring Data JPA

```java
public interface StudentRepository extends JpaRepository<Student, Integer> {

    // ✅ 方法名稱查詢：JPA 自己產生 SQL，安全
    List<Student> findByName(String name);

    // ✅ @Query 搭配 :名字 或 ?1，安全
    @Query("select s from Student s where s.name = :name")
    List<Student> searchByName(@Param("name") String name);

    // ✅ 原生 SQL 一樣要用空格
    @Query(value = "select * from student where name = :name", nativeQuery = true)
    List<Student> searchByNameNative(@Param("name") String name);
}
```

<!--
第二位，Spring Data JPA。

第一種，照格式取方法名稱。SQL 是 JPA 自己產生的，它一定會用空格，所以安全。

第二種，用 @Query 自己寫便條。只要值的部分用冒號加名字，或是問號加數字，就是安全的。

第三種，原生 SQL。寫了 nativeQuery = true 之後，一樣要用空格，不要因為是原生 SQL 就自己接字串。

JPA 大部分的寫法天生就安全。只要記得一件事：不要自己用加號去組 @Query 裡的字串。
-->

---

# MyBatis：`#{}` 和 `${}` 差一個符號，差很多

```java
// ✅ 安全：#{ } 是空格
@Select("SELECT id, name FROM student WHERE name = #{name}")
List<Student> findByName(@Param("name") String name);

// ❌ 危險：${ } 是「直接把字貼上去」
@Select("SELECT id, name FROM student WHERE name = '${name}'")
List<Student> findByNameUnsafe(@Param("name") String name);
```

<v-clicks>

- `#{name}`：井字號。留空格，之後再填值 → 安全
- `${name}`：錢字號。把值**直接貼進 SQL 字串**，等於用加號接起來 → 危險

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 使用者輸入的東西，一律用 <code>#{}</code>。看到 <code>${}</code> 要特別小心。
</div>

</v-click>

<!--
第三位，MyBatis。它有一個要特別注意的陷阱：有兩種長得很像的寫法。

（下一步）第一種是井字號加大括號。這是我們一直在用的空格：留空格，之後再填值。安全。

（下一步）第二種是錢字號加大括號。它不是空格。它的意思是把值直接貼進 SQL 字串，效果等於用加號接起來。危險。

（下一步）兩個只差一個符號，效果完全不同。所以請記得：使用者輸入的東西，一律用井字號。在別人的程式裡看到錢字號，要特別小心。

那錢字號是做什麼用的？它用在「不能留空格」的地方，例如資料表的名稱或是排序的欄位名稱。這種情況，值一定要是程式自己決定的，不能直接來自使用者。
-->

---

# 三位幫手，一次整理

<Pairs left="工具" right="安全的寫法" rows="staff,Spring JDBC=code,:名字 或 ? 留空格；不要用 + 接字串|teacher,Spring Data JPA=code,方法名稱查詢；@Query 用 :名字 或 ?1|doc,MyBatis=code,用 #{ }；不要用 ${ } 放使用者的輸入" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 三種工具只要<b>照正常的方式留空格</b>，就都擋得住 SQL Injection。會出事，都是因為自己動手把輸入接進 SQL。
</div>

</v-click>

<!--
三位幫手，一次整理。

（下一步）Spring JDBC：用冒號加名字，或是問號留空格。不要用加號接字串。

（下一步）Spring Data JPA：方法名稱查詢本來就安全；@Query 用冒號加名字，或問號加數字。

（下一步）MyBatis：用井字號。不要用錢字號放使用者的輸入。

（下一步）結論是：三種工具只要照正常的方式留空格，就都擋得住 SQL Injection。會出事，都是因為我們自己動手把輸入接進 SQL。
-->

---

# 想一想

<Poll question="下面哪一個寫法有 SQL Injection 的風險？" options='@Select("… WHERE name = #{name}")|@Query("select s from Student s where s.name = :name")|"… WHERE name = :name" 搭配 map.put("name", name)|"… WHERE name = &apos;" + name + "&apos;"' answer="4" />

<!--
確認一下。

下面哪一個寫法有 SQL Injection 的風險？

（等大家作答）

（下一步）答案是第四個，用加號把 name 接進字串的寫法。

前三個都是留空格的寫法：MyBatis 的井字號、JPA 的冒號加名字、Spring JDBC 的冒號加名字搭配 Map。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 動手練習

<!--
最後做一個練習。
-->

---

# 練習：找出漏洞並修好它

這個 `StudentDao` 的方法有 SQL Injection 的漏洞：

```java
public List<Student> searchByName(String name) {
    String sql = "SELECT id, name FROM student WHERE name LIKE '%" + name + "%'";
    return namedParameterJdbcTemplate.query(sql, new HashMap<>(), new StudentRowMapper());
}
```

1. 漏洞在哪裡？
2. 請把它改成安全的寫法
3. 提示：`LIKE` 兩邊的 `%`，可以改成放在「要填的值」裡面

<!--
練習題。這個 StudentDao 的方法，功能是用名字做模糊查詢：名字裡包含某些字的同學都查出來。但是它有 SQL Injection 的漏洞。

請回答三件事。漏洞在哪裡？怎麼改成安全的寫法？

第三點是提示。LIKE 兩邊的百分比符號，可以改成放在「要填的值」裡面，SQL 裡只留一個空格。

請先暫停，自己試試看，再看下一頁。
-->

---

# 練習：參考答案

**漏洞：** 用 `+` 把 `name` 直接接進 SQL。輸入 `' OR '1'='1' -- ` 就能查出所有人。

```java
public List<Student> searchByName(String name) {
    String sql = "SELECT id, name FROM student WHERE name LIKE :keyword";
    Map<String, Object> map = new HashMap<>();
    map.put("keyword", "%" + name + "%");
    return namedParameterJdbcTemplate.query(sql, map, new StudentRowMapper());
}
```

<v-clicks>

- SQL 裡只留一個空格 `:keyword`，沒有引號，也沒有 `%`
- `%` 是接在**值**上面，不是接在 SQL 上面。值不管長怎樣，都只是資料

</v-clicks>

<v-click>

<div class="mt-2 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left">
✅ 測試：修好之前，輸入那一串會查出所有人；修好之後，回傳空的陣列。
</div>

</v-click>

<!--
參考答案。

漏洞在於用加號把 name 直接接進 SQL。只要輸入單引號、OR '1'='1'、再加兩個減號把後面註解掉，就能查出所有人。

修好的寫法在下面。

（下一步）SQL 裡只留一個空格，冒號 keyword。沒有引號，也沒有百分比符號。

（下一步）百分比符號改成接在值上面。你可能會問：這裡不是也用了加號嗎？是，但是這個加號接的是「值」，不是 SQL。接好的值整個放進 Map，填進空格。值不管長什麼樣子，都只是資料。

（下一步）測試的方法：修好之前，輸入那一串會查出所有人。修好之後，回傳空的陣列。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="no,對方說什麼就抄進申請單=code,用 + 把輸入接進 SQL 字串|what,姓名欄裡偷寫一句指令=code,SQL Injection|ok,申請單先印好，只留空格=code,參數化查詢（PreparedStatement）|form,空格的三種樣子=code,? ／ :名字 ／ #{ }|what,看起來像空格，其實是照抄=code,MyBatis 的 ${ }" />

<!--
我們用一張圖複習今天的內容。

（下一步）對方說什麼就抄進申請單，是用加號把輸入接進 SQL 字串。

（下一步）姓名欄裡偷寫一句指令，是 SQL Injection。

（下一步）申請單先印好、只留空格，是參數化查詢，背後是 PreparedStatement。

（下一步）空格的三種樣子：問號、冒號加名字、井字號加大括號。

（下一步）看起來像空格，其實是照抄的，是 MyBatis 的錢字號加大括號。
-->

---

# 章節總結

<v-clicks>

- **SQL Injection**：在輸入裡偷藏 SQL，讓資料庫做出我們沒打算做的事
- **根本原因**：把使用者的輸入直接接進 SQL 字串
- **防範**：參數化查詢。SQL 先固定，值另外交，輸入永遠只是資料
- **Spring JDBC**：`:名字` 或 `?`
- **JPA**：方法名稱查詢、`@Query` 的 `:名字` / `?1`
- **MyBatis**：`#{}` 安全，`${}` 危險

</v-clicks>

<!--
最後整理今天的重點。

（依序按下一步）SQL Injection 是在輸入裡偷藏 SQL。根本原因是把使用者的輸入直接接進 SQL 字串。防範的方法是參數化查詢：SQL 先固定，值另外交。Spring JDBC 用冒號加名字或問號。JPA 用方法名稱查詢，或 @Query 的空格。MyBatis 用井字號，不要用錢字號。
-->

---

# 資料庫單元：我們走過的路

<v-clicks>

- **檔案室**：資料庫、連線設定（第 22–23 章）
- **承辦人員自己來**：Spring JDBC 的 `update()`、`query()`（第 24–25 章）
- **資深助理**：Spring Data JPA、`@Query`（第 26–28 章）
- **申請單自己寫、雜事交給他**：MyBatis 和 XML Mapper（第 29–31 章）
- **兩件事算同一件**：交易 `@Transactional`（第 32 章）
- **同時搶同一筆**：悲觀鎖、樂觀鎖（第 33 章）
- **申請單被動手腳**：SQL Injection（第 34 章）

</v-clicks>

<v-click>

下一個單元，我們回頭把程式的「架構」整理清楚：為什麼要分層、每一層該放什麼。

</v-click>

<!--
這一章也是資料庫單元的最後一章。我們回頭看一下走過的路。

（依序按下一步）一開始，我們認識了檔案室，也就是資料庫，並且設定好連線。接著是承辦人員自己來的 Spring JDBC。然後請來資深助理 Spring Data JPA。再認識申請單自己寫、雜事交給他的 MyBatis。後面三章處理三種狀況：兩件事要算同一件的交易；同時搶同一筆資料的鎖；還有今天的 SQL Injection。

（最後一步）到這裡，你已經有能力做出一個「接請求、存資料、回傳結果」的完整後端了。下一個單元，我們回頭把程式的架構整理清楚：為什麼要分層、每一層該放什麼。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請回頭看看自己前幾章寫的程式，確認每一句 SQL 都是用留空格的方式寫的。

有任何問題歡迎提出來。
-->
