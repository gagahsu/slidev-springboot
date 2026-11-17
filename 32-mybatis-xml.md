---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: MyBatis 的用法（下）—XML Mapper 寫法
routeAlias: ch32
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
    MyBatis 的用法（下）<br>XML Mapper 寫法
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「複雜的 SQL 用 XML 管理，動態條件更清晰」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第三十二章。

前兩章，我們把 MyBatis 的申請單直接貼在方法上面。簡單的 SQL 這樣寫很方便。

但是申請單越寫越多、越寫越長之後，就會遇到問題。今天學另一種放法：把申請單收進一本範本夾，也就是 XML Mapper。
-->

---

# 今天要搞懂的四件事

<v-clicks>

- **為什麼要範本夾？** 貼在方法上的寫法有它做不到的事
- **範本夾怎麼做？** 一個 XML 檔，和介面用名字對起來
- **會自己變化的申請單**：動態 SQL，`<if>`、`<where>`、`<set>`、`<foreach>`
- **換了放法，哪裡要改？** 這次連 Dao 都不用改

</v-clicks>

<!--
今天要搞懂四件事。

（下一步）第一，為什麼要範本夾。貼在方法上的寫法，有它做不到的事。

（下一步）第二，範本夾怎麼做。它是一個 XML 檔，和介面用名字對起來。

（下一步）第三，會自己變化的申請單，叫做動態 SQL。這是今天的重點。

（下一步）第四，換了放法之後，程式哪裡要改。這次連 Dao 都不用改。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 為什麼需要範本夾？

<!--
先看貼在方法上的寫法，會遇到什麼問題。
-->

---

# 貼在方法上的申請單，有三個麻煩

<v-clicks>

- **太長**：SQL 一長，要用加號把好幾段字串接起來，很難讀
- **不會變化**：老師查同學，有時只給名字、有時只給編號。一張寫死的申請單應付不了
- **太分散**：SQL 散在每個方法上面，想一次檢查全部很不方便

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>XML Mapper</b>：把 SQL 從 Java 檔搬出來，集中寫在一個 XML 檔裡。可以自由換行，還能寫出「會依情況變化」的 SQL。
</div>

</v-click>

<!--
貼在方法上的申請單，有三個麻煩。

（下一步）第一，太長。SQL 一長，在 Java 裡要用加號把好幾段字串接起來，很難讀。

（下一步）第二，不會變化。舉個例子：老師來查同學，有時候只給名字，有時候只給編號，有時候兩個都給。一張寫死的申請單應付不了這麼多種情況。

（下一步）第三，太分散。SQL 散在每個方法上面，想一次檢查全部很不方便。

（下一步）所以 MyBatis 提供另一種放法，叫 XML Mapper。把 SQL 從 Java 檔搬出來，集中寫在一個 XML 檔裡。在那裡可以自由換行，還能寫出會依情況變化的 SQL。
-->

---

# 把故事對應到程式

<Pairs left="教務處" right="程式" rows="form,申請單貼在方法上=code,Annotation 寫法：@Select、@Insert…|book,申請單收進一本範本夾=doc,XML Mapper：StudentMapper.xml|what,範本夾封面寫「這是誰的」=code,namespace：介面完整的名稱|doc,每張範本的編號=code,id：和介面的方法名稱一樣" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 兩種放法可以混用：同一個介面裡，簡單的貼在方法上，複雜的收進範本夾。
</div>

</v-click>

<!--
把故事對應到程式。

（下一步）申請單貼在方法上，是前兩章的 Annotation 寫法。

（下一步）申請單收進一本範本夾，是 XML Mapper。我們會建立一個 StudentMapper.xml。

（下一步）範本夾的封面要寫清楚「這是誰的」。對應到 XML 裡的 namespace，寫的是介面完整的名稱。

（下一步）夾子裡每張範本都有編號。對應到 id，要和介面的方法名稱一樣。MyBatis 就是靠這兩個名字，把方法和 SQL 對起來。

（下一步）兩種放法可以混用。同一個介面裡，簡單的貼在方法上，複雜的收進範本夾。只是同一個方法不能兩邊都寫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 做一本範本夾

<!--
來動手做。
-->

---

# Step 1：告訴 MyBatis 範本夾放在哪

在 `application.properties` 加入：

```properties
mybatis.mapper-locations=classpath:mappers/*.xml
mybatis.configuration.map-underscore-to-camel-case=true
```

<v-clicks>

- 第一行：範本夾都放在 `src/main/resources/mappers/` 資料夾，副檔名是 `.xml`
- 第二行：上一章介紹過，底線的欄位名稱自動對應駝峰的變數名稱

</v-clicks>

<!--
第一步，告訴 MyBatis 範本夾放在哪。在 application.properties 加入兩行。

（下一步）第一行，mapper-locations。意思是範本夾都放在 src/main/resources 底下的 mappers 資料夾，副檔名是 xml。classpath 可以先理解成 resources 這個資料夾。

（下一步）第二行上一章介紹過，讓底線的欄位名稱自動對應駝峰的變數名稱。
-->

---

# Step 2：在 Eclipse 建立 XML 檔

1. 在 `src/main/resources` 上按右鍵 → **New → Folder**，名稱填 `mappers`
2. 在 `mappers` 資料夾上按右鍵 → **New → File**，檔名填 `StudentMapper.xml`
3. 把下一頁的內容貼進去
4. 把 `namespace` 改成你自己的 `package名稱.StudentMapper`

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ Eclipse 可能會在 XML 上顯示紅色的錯誤標記，那是它檢查不到格式定義檔，不影響執行。
</div>

<!--
第二步，建立 XML 檔。

在 src/main/resources 上按右鍵，New，Folder，名稱填 mappers。

在 mappers 資料夾上按右鍵，New，File，檔名填 StudentMapper.xml。

把下一頁的內容貼進去。

再把 namespace 改成你自己的 package 名稱加上 StudentMapper。package 名稱可以打開 StudentMapper.java，看第一行就知道。

提醒一下，Eclipse 可能會在 XML 上顯示紅色的錯誤標記。那是它檢查不到格式的定義檔，不影響執行，可以不用理它。
-->

---

# 範本夾的基本樣子

<CodeSteps>

```xml {1-3|4,8|5-7|all}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.StudentMapper">
    <select id="findAll" resultType="com.example.demo.Student">
        SELECT id, name FROM student
    </select>
</mapper>
```

- 前三行是固定的開頭，照抄就好
- `<mapper namespace="…">`：封面，寫 `StudentMapper` 介面完整的名稱（包含 package）
- `<select id="findAll" …>`：一張查詢的範本，`id` 要和方法名稱一樣；中間就是 SQL
- `resultType`：查回來的每一列，要抄成哪一種資料卡

</CodeSteps>

<!--
範本夾的基本樣子是這樣。

（下一步）前三行是固定的開頭，告訴大家這是一個 MyBatis 的 XML 檔。照抄就好。

（下一步）mapper 這個標籤是封面。namespace 寫 StudentMapper 介面完整的名稱，包含 package。所有的範本都放在 mapper 的開頭和結尾之間。

（下一步）裡面的 select 是一張查詢的範本。id 是 findAll，要和介面裡的方法名稱一模一樣。標籤中間就是 SQL，可以自由換行。

（下一步）resultType 是告訴 MyBatis：查回來的每一列，要抄成哪一種資料卡。這裡也要寫完整的名稱。就算方法回傳的是 List，這裡還是寫 Student。
-->

---

# 介面只留下方法

<CodeSteps>

```java {1-8|10-15|all}
// 之前：SQL 貼在方法上
@Mapper
public interface StudentMapper {
    @Insert("INSERT INTO student(id, name) VALUES (#{id}, #{name})")
    int insert(Student student);
    @Select("SELECT id, name FROM student")
    List<Student> findAll();
}

// 現在：SQL 搬到 XML，介面只留方法
@Mapper
public interface StudentMapper {
    int insert(Student student);
    List<Student> findAll();
}
```

- 之前：每個方法上面都貼著 SQL
- 現在：把 `@Insert`、`@Select` 這些標註拿掉，SQL 改寫在 XML 裡
- 方法的名稱、參數、回傳型別**完全沒變**

</CodeSteps>

<!--
SQL 搬到 XML 之後，介面要跟著改。

（下一步）之前，每個方法上面都貼著 SQL。

（下一步）現在，把 @Insert、@Select 這些標註拿掉，SQL 改寫在 XML 裡。介面只留下方法。

（下一步）注意，方法的名稱、參數、回傳型別完全沒變。這一點很重要，等一下會用到。
-->

---

# 四種範本

<CodeSteps>

```xml {1-3|5-7|9-11|13-15|all}
<insert id="insert" parameterType="com.example.demo.Student">
    INSERT INTO student(id, name) VALUES (#{id}, #{name})
</insert>

<update id="update" parameterType="com.example.demo.Student">
    UPDATE student SET name = #{name} WHERE id = #{id}
</update>

<delete id="deleteById">
    DELETE FROM student WHERE id = #{id}
</delete>

<select id="findById" resultType="com.example.demo.Student">
    SELECT id, name FROM student WHERE id = #{id}
</select>
```

- `<insert>`：`parameterType` 是傳進來的參數型別；空格一樣用 `#{}`
- `<update>`：寫法相同
- `<delete>`：參數只是一個編號，`parameterType` 可以不寫
- `<select>`：要寫 `resultType`
- SQL 和前兩章一模一樣，只是換了地方放

</CodeSteps>

<!--
新增、修改、刪除、查詢，各有一種標籤。

（下一步）insert。parameterType 是傳進來的參數型別，這裡是 Student。空格一樣用 #{}。

（下一步）update。寫法相同。

（下一步）delete。參數只是一個編號，parameterType 可以不寫。

（下一步）select。要寫 resultType。

（下一步）你會發現，SQL 和前兩章一模一樣，只是換了地方放。
-->

---

# 想一想

<Poll question='介面裡的方法是 List&lt;Student&gt; findAll();，XML 裡對應的範本，id 應該寫什麼？' options="StudentMapper|findAll|Student|可以隨便取" answer="2" />

<!--
確認一下。

介面裡的方法叫 findAll。XML 裡對應的範本，id 應該寫什麼？

（等大家作答）

（下一步）答案是 findAll。

id 要和方法名稱一模一樣。namespace 對介面，id 對方法，MyBatis 靠這兩個名字找到 SQL。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 欄位名稱完全不一樣：resultMap

<!--
先插一個小主題。
-->

---

# 自己寫一份對照表

如果資料表的欄位叫 `s_id`、`s_name`，和變數 `id`、`name` 完全對不上：

<CodeSteps>

```xml {1-4|6-8|all}
<resultMap id="studentResultMap" type="com.example.demo.Student">
    <id     column="s_id"   property="id"/>
    <result column="s_name" property="name"/>
</resultMap>

<select id="findAll" resultMap="studentResultMap">
    SELECT s_id, s_name FROM student
</select>
```

- `<resultMap>`：一份對照表。`column` 是欄位名稱，`property` 是變數名稱；主鍵用 `<id>`，其他用 `<result>`
- 查詢時把 `resultType` 換成 `resultMap`，指向這份對照表
- 只是底線和駝峰的差別，用上一章那行設定就好，不用寫這個

</CodeSteps>

<!--
上一章說過，欄位名稱和變數名稱一樣，MyBatis 才會自動抄。底線和駝峰的差別，可以用一行設定解決。

但是如果名字完全不一樣呢？例如資料表的欄位叫 s_id、s_name，變數叫 id、name。這時候要自己寫一份對照表。

（下一步）這份對照表叫 resultMap。type 是要抄成哪一種資料卡。裡面每一行，column 是欄位名稱，property 是變數名稱。主鍵那一行用 id 標籤，其他用 result 標籤。

這其實就是第二十五章的 RowMapper，只是換成用 XML 寫。

（下一步）查詢的時候，把 resultType 換成 resultMap，指向這份對照表的 id。

（下一步）如果只是底線和駝峰的差別，用上一章那行設定就好，不用寫這個。我們的 student 表欄位名稱沒有問題，所以這一頁知道有這個寫法就可以。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 會自己變化的申請單：動態 SQL

<!--
接下來是今天的重點。
-->

---

# 一張申請單，四種情況

老師到教務處查同學。名字和編號，他可能**有給，也可能沒給**：

<v-clicks>

- 只給名字 → `SELECT … WHERE name = ?`
- 只給編號 → `SELECT … WHERE id = ?`
- 兩個都給 → `SELECT … WHERE name = ? AND id = ?`
- 都沒給 → `SELECT …`（查全部）

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>動態 SQL</b>：在範本上註明「有填這一格，才加這一句」。MyBatis 會依照實際傳進來的值，組出該執行的 SQL。
</div>

</v-click>

<!--
老師到教務處查同學。名字和編號這兩個條件，他可能有給，也可能沒給。

（下一步）只給名字，SQL 的條件只有 name。

（下一步）只給編號，條件只有 id。

（下一步）兩個都給，兩個條件用 AND 接起來。

（下一步）都沒給，就沒有 WHERE，查全部。

四種情況，要執行的 SQL 都不一樣。難道要寫四張申請單、四個方法嗎？

（下一步）不用。我們可以在範本上註明：「有填這一格，才加這一句」。MyBatis 會依照實際傳進來的值，組出該執行的 SQL。這就是動態 SQL。
-->

---

# `<if>` 和 `<where>`：有填才加條件

<CodeSteps>

```xml {2|4-6|7-9|3,10|all}
<select id="findByCondition" resultType="com.example.demo.Student">
    SELECT id, name FROM student
    <where>
        <if test="name != null">
            AND name = #{name}
        </if>
        <if test="id != null">
            AND id = #{id}
        </if>
    </where>
</select>
```

- 固定的部分：不管怎樣都要查 `student`
- `<if test="name != null">`：有給名字，才加上這一句
- 有給編號，才加上這一句
- `<where>`：裡面有條件時才補上 `WHERE`，並且自動去掉最前面多出來的 `AND`

</CodeSteps>

<!--
寫成 XML 是這樣。

（下一步）第一行 SQL 是固定的部分，不管怎樣都要查 student。

（下一步）第一個 if。test 裡寫的是判斷的條件：name 不等於 null，也就是有給名字。條件成立，才會加上裡面那一句 AND name = #{name}。

（下一步）第二個 if 一樣：有給編號，才加上這一句。

（下一步）外面包著的 where 標籤很貼心，它做兩件事。第一，裡面有任何一句條件的時候，才幫我們補上 WHERE 這個字；都沒有的話就不補。第二，自動去掉最前面多出來的 AND。所以每一句前面都可以放心寫 AND。
-->

---

# 想一想

<Poll question="用上一頁的 findByCondition，只傳入 name=Judy，id 是 null。MyBatis 會執行哪一句？" options="SELECT id, name FROM student|SELECT id, name FROM student WHERE name = 'Judy'|SELECT id, name FROM student WHERE AND name = 'Judy'|SELECT id, name FROM student WHERE name = 'Judy' AND id = null" answer="2" />

<!--
確認一下。

用上一頁的 findByCondition，只傳入 name 是 Judy，id 是 null。MyBatis 會執行哪一句？

（等大家作答）

（下一步）答案是第二個。

name 有值，所以加上 name 的條件。id 是 null，那一句不會加。where 標籤補上 WHERE，並且把最前面的 AND 去掉。
-->

---

# `<set>`：有填才更新

```xml
<update id="updateSelective" parameterType="com.example.demo.Student">
    UPDATE student
    <set>
        <if test="name != null">name = #{name},</if>
        <if test="score != null">score = #{score},</if>
    </set>
    WHERE id = #{id}
</update>
```

<v-clicks>

- 只想改成績、不想動名字時，Body 只給 `score` 就好
- 沒給的欄位不會出現在 SQL 裡，原本的值不會被蓋成空的
- `<set>`：自動補上 `SET`，並且去掉最後多出來的逗號

</v-clicks>

<!--
同樣的想法也可以用在修改。

假設學生資料卡有名字和成績。有時候只想改成績，不想動名字。

（下一步）用這個寫法，Body 只給 score 就好。

（下一步）沒給的欄位，if 不成立，就不會出現在 SQL 裡。所以原本的值不會被蓋成空的。如果用寫死的 UPDATE，沒給的欄位會被改成 null，資料就不見了。

（下一步）外面的 set 標籤和 where 類似：自動補上 SET 這個字，並且去掉最後多出來的逗號。
-->

---

# `<foreach>`：一次查好幾個編號

<CodeSteps>

```xml {2-3|4-5,7|6|all}
<select id="findByIds" resultType="com.example.demo.Student">
    SELECT id, name FROM student
    WHERE id IN
    <foreach collection="ids" item="id"
             open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

- 目標是組出 `WHERE id IN (1, 2, 3)`
- `<foreach>`：把一串值一個一個拿出來。`collection` 是那一串的名字，`item` 是每一個的暫時名字；`open`、`separator`、`close` 是開頭、中間、結尾要放的符號
- 每拿到一個，就放一個空格 `#{id}`
- 介面的方法：`List<Student> findByIds(@Param("ids") List<Integer> ids);`

</CodeSteps>

<!--
第三個標籤是 foreach，用來處理「一串值」。例如一次查好幾個編號。

（下一步）目標是組出 WHERE id IN 括號 1、2、3 這樣的 SQL。

（下一步）foreach 的意思是「對每一個」：把一串值一個一個拿出來。collection 是那一串的名字，這裡是 ids。item 是幫每一個取的暫時名字。open、separator、close，分別是開頭、中間、結尾要放的符號：左括號、逗號、右括號。

（下一步）每拿到一個，就放一個空格 #{id}。

（下一步）介面的方法要用 @Param 把那一串標上 ids 這個名字，和 collection 對起來。

第二十五章 Spring JDBC 是自動展開的。在 MyBatis 要自己用 foreach 寫出來。
-->

---

# `<foreach>`：一次新增很多筆

```xml
<insert id="batchInsert">
    INSERT INTO student(id, name) VALUES
    <foreach collection="list" item="s" separator=",">
        (#{s.id}, #{s.name})
    </foreach>
</insert>
```

<v-clicks>

- 傳進來的是一串學生，每拿到一位就產生一組 `(編號, 名字)`，中間用逗號隔開
- `#{s.id}`：`s` 是這一位學生，`s.id` 是他的編號
- 組出來的是 `VALUES (2, 'Tom'), (3, 'Amy')`，一趟就全部新增
- 介面的方法：`int batchInsert(@Param("list") List<Student> list);`

</v-clicks>

<!--
foreach 也可以用在新增，一次新增很多筆。

（下一步）傳進來的是一串學生。每拿到一位，就產生一組括號，裡面是編號和名字，中間用逗號隔開。

（下一步）#{s.id} 的 s 是這一位學生，s.id 就是他的編號。

（下一步）最後組出來的 SQL 是 VALUES 後面接好幾組資料，一趟就全部新增。這和第二十四章「一疊申請單一次送」是同樣的目的。

（下一步）介面的方法一樣用 @Param 標上名字。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 把三層接起來

<!--
最後看三層要怎麼接。
-->

---

# 這次連承辦人員都不用改

<Pairs left="哪一層" right="SQL 搬到 XML 之後" sign="→" rows="clerk,櫃台：StudentController=ok,不用改|teacher,組長：StudentService=ok,不用改|staff,承辦人員：StudentDao=ok,不用改|doc,StudentMapper 介面=doc,只把方法上面的 @Insert、@Select 等拿掉" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 因為方法的名稱、參數、回傳型別都沒變。Dao 呼叫的還是 <code>studentMapper.insert(student)</code>，它不需要知道 SQL 放在哪。
</div>

</v-click>

<!--
把前兩章的 SQL 搬到 XML 之後，程式哪裡要改？

（下一步）櫃台，不用改。

（下一步）組長，不用改。

（下一步）承辦人員 StudentDao，這次也不用改。

（下一步）只有 StudentMapper 介面，把方法上面的 @Insert、@Select 這些標註拿掉。

（下一步）原因就是剛才強調的：方法的名稱、參數、回傳型別都沒變。Dao 呼叫的還是 studentMapper.insert(student)，它不需要知道 SQL 是貼在方法上，還是收在範本夾裡。

改完之後，用和前兩章完全一樣的方式測試新增、修改、刪除、查詢，結果應該一模一樣。
-->

---

# 加一個「有填才查」的搜尋 API

<CodeSteps>

```java {1-2|4-7|9-12|14-20|all}
// StudentMapper
List<Student> findByCondition(@Param("id") Integer id, @Param("name") String name);

// StudentDao
public List<Student> getStudentsByCondition(Integer id, String name) {
    return studentMapper.findByCondition(id, name);
}

// StudentService
public List<Student> getStudentsByCondition(Integer id, String name) {
    return studentDao.getStudentsByCondition(id, name);
}

// StudentController
@GetMapping("/students/search-dynamic")
public List<Student> getStudentsByCondition(
        @RequestParam(name = "id", required = false) Integer id,
        @RequestParam(name = "name", required = false) String name) {
    return studentService.getStudentsByCondition(id, name);
}
```

- 介面：補上方法，名稱要和 XML 的 `id` 一樣
- 承辦人員：轉交給 `StudentMapper`
- 組長：轉交給承辦人員
- 櫃台：兩個參數都加 `required = false`，沒帶的就是 `null`

</CodeSteps>

<!--
剛才寫的 findByCondition，我們幫它接上三層，做成一個搜尋 API。

（下一步）先在 StudentMapper 介面補上方法。名稱要和 XML 裡的 id 一樣，兩個參數用 @Param 標上名字。

（下一步）承辦人員，轉交給 StudentMapper。

（下一步）組長，轉交給承辦人員。

（下一步）櫃台。重點在兩個 @RequestParam 後面都加了 required = false，意思是「這個參數可以不帶」。第十八章學過，不加的話，前端沒帶這個參數會收到 400 的錯誤。加了之後，沒帶的參數就是 null，剛好交給 XML 裡的 if 去判斷。
-->

---

# 用 Postman 測試

同一個 API，帶不同的參數，看 Console 裡的 SQL 怎麼變：

<v-clicks>

- `GET /students/search-dynamic` → 沒有 `WHERE`，查全部
- `GET /students/search-dynamic?name=Judy` → `WHERE name = ?`
- `GET /students/search-dynamic?id=1` → `WHERE id = ?`
- `GET /students/search-dynamic?id=1&name=Judy` → `WHERE name = ? AND id = ?`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left">
✅ 一個 API、一段 XML，就應付了四種情況。想在 Console 看到 MyBatis 的 SQL，可以加一行：<code>logging.level.你的package名稱=DEBUG</code>
</div>

</v-click>

<!--
啟動 Spring Boot，用同一個 API，帶不同的參數測試。

（下一步）什麼都不帶：沒有 WHERE，查全部。

（下一步）只帶 name：條件只有 name。

（下一步）只帶 id：條件只有 id。

（下一步）兩個都帶：兩個條件用 AND 接起來。

（下一步）一個 API、一段 XML，就應付了四種情況。

如果想在 Console 看到 MyBatis 實際執行的 SQL，可以在 application.properties 加一行 logging.level，後面接你的 package 名稱，等於 DEBUG。
-->

---

# 貼在方法上，還是收進範本夾？

<v-clicks>

- **SQL 很短的新增、修改、刪除、查詢** → 貼在方法上（Annotation），最直接
- **SQL 很長，例如要對好幾張表** → 範本夾（XML），可以自由換行
- **條件有時有、有時沒有** → 範本夾，用 `<if>`、`<where>`、`<set>`
- **一串值** → 範本夾，用 `<foreach>`
- **欄位名稱對不上** → 範本夾，用 `<resultMap>`

</v-clicks>

<!--
最後整理一下，什麼時候用哪一種放法。

（下一步）SQL 很短的新增、修改、刪除、查詢，貼在方法上最直接。

（下一步）SQL 很長，例如要對好幾張表，用範本夾，可以自由換行。

（下一步）條件有時有、有時沒有，用範本夾，才能寫 if、where、set。

（下一步）要處理一串值，用範本夾的 foreach。

（下一步）欄位名稱對不上，用範本夾的 resultMap。

實際工作上，很多團隊為了統一，會規定全部都寫在 XML 裡。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="book,申請單的範本夾=doc,XML Mapper（放在 resources/mappers）|what,封面：這是誰的=code,namespace = 介面完整的名稱|doc,範本的編號=code,id = 方法名稱|form,有填這一格，才加這一句=code,&lt;if&gt; 搭配 &lt;where&gt; 或 &lt;set&gt;|cabinet,一串值，一個一個列出來=code,&lt;foreach&gt;" />

<!--
我們用一張圖複習今天的內容。

（下一步）申請單的範本夾，是 XML Mapper。

（下一步）封面寫這是誰的，是 namespace，等於介面完整的名稱。

（下一步）範本的編號，是 id，等於方法名稱。

（下一步）有填這一格，才加這一句，是 if，搭配 where 或 set。

（下一步）一串值，一個一個列出來，是 foreach。
-->

---

# 章節總結

<v-clicks>

- **XML Mapper**：SQL 集中寫在 XML 檔，適合又長又複雜的 SQL
- **對應規則**：`namespace` 對介面、`id` 對方法
- **`resultType` / `resultMap`**：查到的資料要變成什麼；名字對不上時自己寫對照
- **`<if>` + `<where>`**：有值才加條件
- **`<set>`**：有值才更新
- **`<foreach>`**：處理一串值，用在 `IN` 和批次新增
- **三層**：SQL 換地方放，Controller、Service、Dao 都不用改

</v-clicks>

<v-click>

三位幫手到這裡都學完了。下一章：兩件事要一起成功、一起失敗，交易 `@Transactional`。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）XML Mapper 把 SQL 集中寫在 XML 檔。namespace 對介面，id 對方法。resultType 和 resultMap 決定查到的資料要變成什麼。if 加 where 是有值才加條件。set 是有值才更新。foreach 處理一串值。SQL 換地方放，三層都不用改。

（最後一步）三位幫手到這裡都學完了。下一章要處理一個新的問題：有兩件事必須一起成功、一起失敗，該怎麼辦？這叫做交易，@Transactional。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後請把前兩章的 SQL 搬到 XML，確認原本的 API 都還能用。再試試動態查詢的四種組合。

有任何問題歡迎提出來。
-->
