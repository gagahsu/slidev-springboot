---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: MyBatis 的用法（下）—XML Mapper 寫法
routeAlias: ch31
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
大家好，上兩章我們學了 MyBatis 的 Annotation 寫法——@Insert、@Update、@Delete、@Select。

但在實務上，SQL 有時候會很長、很複雜，例如「有條件才加 WHERE 篩選」這種動態查詢。
如果 SQL 很長，直接寫在 Annotation 字串裡會難以閱讀和維護。

今天要介紹 MyBatis 的另一種寫法：XML Mapper。
把 SQL 寫在獨立的 XML 檔案裡，配合動態 SQL 語法（`<if>`、`<where>`、`<foreach>`），讓複雜查詢變得清晰易維護。
-->

---
layout: default
---

# Outline

- **為什麼需要 XML Mapper？** — Annotation 的限制、XML 的優勢
- **設定 XML Mapper** — application.properties、mapper.xml 結構說明
- **基本 CRUD in XML** — `<insert>`、`<update>`、`<delete>`、`<select>`
- **resultMap** — 解決資料庫欄位和 Java 屬性名稱不一致的問題
- **動態 SQL** — `<if>`、`<where>`、`<set>`、`<foreach>` IN 查詢、`<foreach>` 批次 INSERT
- **Annotation vs XML 選擇建議** — 各自適用場景
- **串接三層式架構** — CUD／查詢完全不用改；動態 SQL 補一個搜尋 API，Postman 測試驗證
- **章節總結** — XML Mapper 核心觀念整理

<!--
今天的重點是 XML Mapper 的寫法，以及動態 SQL 這個非常實用的功能。

學完之後，你就能寫出業界真實專案中常見的複雜查詢，不再受限於 Annotation 字串的長度和可讀性。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 為什麼需要 XML Mapper？

<!--
先來理解：Annotation 有什麼限制，XML Mapper 解決了什麼問題。
-->

---

# Annotation 寫法的限制

| 情境 | Annotation 寫法的問題 |
| --- | --- |
| SQL 很長（20+ 行） | 字串很長，難以閱讀、排版混亂 |
| 動態條件（有時候才加 WHERE） | Annotation 無法做到，需要在 Java 程式碼拼接 SQL |
| 複雜的欄位映射 | 欄位名稱不一致時，Annotation 處理較麻煩 |
| SQL 需要集中管理 | SQL 散落在各個 @Mapper 方法上，不易統一審查 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>XML Mapper 的優勢：</b> SQL 寫在獨立 XML 檔案中，支援動態 SQL 語法，適合管理複雜查詢。
</div>

<!--
Annotation 寫法非常適合簡單的 CRUD——SQL 短、邏輯直接、一目了然。

但當 SQL 開始變複雜，例如多個 JOIN、多個動態條件（有帶參數才過濾、沒帶就查全部），Annotation 字串就會變得很難維護。

XML Mapper 把 SQL 搬到獨立的 .xml 檔案裡，可以好好排版，還支援 MyBatis 內建的動態 SQL 語法，讓複雜查詢清晰得多。
-->

---

# Annotation vs XML Mapper 比較

| 比較項目 | Annotation 寫法 | XML Mapper |
| --- | --- | --- |
| SQL 位置 | 直接在 @Mapper 介面方法上 | 獨立 XML 檔案 |
| 適合場景 | 簡單的 CRUD | 複雜 SQL、動態條件 |
| 可讀性（長 SQL） | 差（字串排版困難） | 好（XML 可自由排版） |
| 動態 SQL | 不支援 | 支援（`<if>`、`<foreach>` 等） |
| 同一個 @Mapper | 可以混搭使用 | ✓ |

<!--
重要：Annotation 和 XML 可以在同一個 @Mapper 介面裡混搭使用。

簡單的方法用 @Select / @Insert Annotation，複雜的查詢改用 XML。
不需要把所有 SQL 都搬到 XML，選擇最適合的方式即可。

業界的實際專案通常是混搭的：基本 CRUD 用 Annotation，複雜的搜尋查詢用 XML。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 設定 XML Mapper

<!--
來看怎麼設定 XML Mapper 的環境。
-->

---

# Step 1：application.properties 設定

在 `application.properties` 加入 mapper 檔案的位置設定：

```properties
mybatis.mapper-locations=classpath:mappers/*.xml
mybatis.configuration.map-underscore-to-camel-case=true
```

| 設定 | 說明 |
| --- | --- |
| `mapper-locations` | 告訴 MyBatis 去哪裡找 XML mapper 檔案 |
| `classpath:mappers/*.xml` | 在 `src/main/resources/mappers/` 目錄下的所有 .xml |
| `map-underscore-to-camel-case` | 自動把 `student_name` 映射到 `studentName`（可選） |

<!--
第一步是設定 MyBatis 要去哪裡找 XML 檔案。

`classpath:mappers/*.xml` 表示放在 `src/main/resources/mappers/` 目錄下的所有 XML 檔案都會被讀取。

`map-underscore-to-camel-case=true` 是一個很方便的設定：資料庫欄位名稱通常用底線（student_name），Java 屬性名稱通常用駝峰（studentName），開啟這個設定，MyBatis 自動幫你轉換，不需要手動寫映射。

建立 `src/main/resources/mappers/` 目錄，把 XML 檔案放進去就好。
-->

---

# Step 2：在 Eclipse 建立 mapper.xml

| 步驟 | 操作 |
| --- | --- |
| 1 | 右鍵 `src/main/resources` → **New → Folder** → 輸入 `mappers` → Finish |
| 2 | 右鍵 `mappers` 資料夾 → **New → File** |
| 3 | 檔名輸入 `StudentMapper.xml` → Finish |
| 4 | 將下一頁模板貼入，`namespace` 改成 `package名稱.StudentMapper`（開啟 `StudentMapper.java` 看第一行 `package`） |
| 5 | Eclipse 顯示 XML 紅色 error 屬正常，不影響執行（可在 Window → Preferences → XML → XML Files → Validation 關閉驗證） |

<!--
在 Eclipse 建立 XML 檔案的方式：右鍵資料夾 → New → File，直接輸入 .xml 副檔名就好，不需要找 XML 專用精靈。
-->

---

# Step 2：mapper.xml 基本結構

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.StudentMapper">

    <select id="findAll" resultType="com.example.model.Student">
        SELECT id, name FROM student
    </select>

</mapper>
```

| 說明 | 詳情 |
| --- | --- |
| `namespace` | @Mapper 介面的完整類別名稱（含 package） |
| `id` | 必須和 @Mapper 介面的方法名稱完全一致 |

<!--
這是 mapper.xml 的基本結構。

最重要的是 `namespace`：必須填寫 @Mapper 介面的完整類別名稱（包含 package）。
MyBatis 用 namespace 把 XML 裡的 SQL 和 @Mapper 介面的方法對應起來。

`<select>` 裡的 `id` 必須和 @Mapper 介面的方法名稱完全一致——例如介面有 `findAll()` 方法，id 就要是 `findAll`。
-->

---

# @Mapper 介面和 XML 的對應關係

`@Mapper` 介面只寫方法簽名，SQL 在 XML 裡：

```java
@Mapper
public interface StudentMapper {
    List<Student> findAll();
    Student findById(Integer id);
    int insert(Student student);
}
```

| @Mapper 方法 | XML 中對應的元素 |
| --- | --- |
| `findAll()` | `<select id="findAll" ...>` |
| `findById(Integer id)` | `<select id="findById" ...>` |
| `insert(Student student)` | `<insert id="insert" ...>` |

<!--
@Mapper 介面和 XML 的分工很清楚：

介面只定義「有哪些操作、參數型別、回傳型別」，不寫任何 SQL。
XML 裡用對應的 id 寫 SQL。

MyBatis 在啟動時，把 namespace 指向的介面和 XML 裡的 id 自動配對，完成整個 Mapper 的組裝。

如果 id 不對或 namespace 不對，啟動時就會報錯，及早發現問題。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 基本 CRUD in XML

<!--
來看四個 CRUD 操作在 XML 裡怎麼寫。
-->

---

# `<insert>` 和 `<delete>`

```xml
<insert id="insert" parameterType="com.example.model.Student">
    INSERT INTO student(id, name) VALUES (#{id}, #{name})
</insert>

<delete id="deleteById">
    DELETE FROM student WHERE id = #{id}
</delete>
```

| 說明 | 詳情 |
| --- | --- |
| `parameterType` | 指定傳入參數的型別（物件時必填，primitive 可省略） |
| `#{id}`、`#{name}` | 和 Annotation 寫法完全相同，對應物件欄位或方法參數 |
| `<delete>` 回傳 | 影響行數（int），和 Annotation 相同 |

<!--
INSERT 和 DELETE 的 XML 寫法和 Annotation 寫法非常相似，#{} 語法完全一樣。

差別只是 SQL 從字串搬到了 XML 元素裡，好處是排版更自由、多行 SQL 更好讀。

`parameterType` 告訴 MyBatis 傳進來的參數型別，MyBatis 才知道 #{id} 要從哪個類別的哪個 getter 取值。
-->

---

# `<update>` 和 `<select>`

```xml
<update id="update" parameterType="com.example.model.Student">
    UPDATE student SET name = #{name} WHERE id = #{id}
</update>

<select id="findById" resultType="com.example.model.Student">
    SELECT id, name FROM student WHERE id = #{id}
</select>
```

| 說明 | 詳情 |
| --- | --- |
| `<update>` | UPDATE SQL，回傳影響行數（int） |
| `<select>` 的 `resultType` | 查詢結果映射的 Java 類別 |
| 回傳 `List` 時 | `resultType` 仍填元素型別（MyBatis 自動包成 List） |

<!--
UPDATE 和 SELECT 的寫法和 INSERT/DELETE 一樣的模式。

特別注意 `<select>` 的 `resultType`：當回傳的是 `List<Student>` 時，resultType 只需要填 `Student` 的類別名，不需要寫 `List`，MyBatis 根據 @Mapper 介面的回傳型別自動判斷是要單筆還是清單。

⚠️ UPDATE 和 DELETE 一定要加 WHERE，否則會更新或刪除整張表！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## resultMap — 解決欄位名稱不一致

<!--
資料庫欄位和 Java 屬性名稱不一致時，resultType 無法自動映射，這時候需要 resultMap。
-->

---

# 什麼時候需要 resultMap？

| 情境 | 說明 |
| --- | --- |
| 欄位名稱一致 | `student_id` vs `studentId`（開啟 `map-underscore-to-camel-case` 可自動處理） |
| 欄位名稱完全不同 | 資料庫 `s_name`，Java 屬性 `name`，無法自動對應，需要 resultMap |
| 複雜映射 | 一對多、巢狀物件等進階場景 |

```xml
<resultMap id="studentResultMap" type="com.example.model.Student">
    <id     column="s_id"   property="id"/>
    <result column="s_name" property="name"/>
</resultMap>
```

<!--
當資料庫欄位名稱和 Java 物件屬性名稱不同，而且不是單純的底線 vs 駝峰的差別，就需要用 resultMap 手動指定映射關係。

resultMap 的結構：
- `<id>` 對應主鍵欄位
- `<result>` 對應其他欄位
- `column` 是資料庫欄位名稱
- `property` 是 Java 屬性名稱

定義好 resultMap 之後，在 `<select>` 裡用 `resultMap="studentResultMap"` 取代 `resultType` 就好。
-->

---

# 使用 resultMap 取代 resultType

```xml
<resultMap id="studentResultMap" type="com.example.model.Student">
    <id     column="s_id"   property="id"/>
    <result column="s_name" property="name"/>
</resultMap>

<select id="findAll" resultMap="studentResultMap">
    SELECT s_id, s_name FROM student
</select>
```

<!--
這段 XML 展示了 resultMap 的完整使用方式。

先在上方定義 resultMap，給它一個 id（例如 studentResultMap）。
在 `<select>` 裡，用 `resultMap="studentResultMap"` 指定使用這個映射，不用 resultType。

這樣即使資料庫欄位叫 `s_id`，MyBatis 也能正確地把它映射到 Java 物件的 `id` 屬性上。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5

## 動態 SQL

<!--
這是 XML Mapper 最強大的功能——根據條件動態組合 SQL。
-->

---

# 什麼是動態 SQL？

想像一個學生搜尋功能：前端可以選擇「只填姓名」、「只填 id」或「兩者都填」。

| 情境 | 應該執行的 SQL |
| --- | --- |
| 只填姓名 | `SELECT ... WHERE name = ?` |
| 只填 id | `SELECT ... WHERE id = ?` |
| 兩者都填 | `SELECT ... WHERE name = ? AND id = ?` |
| 都不填 | `SELECT ...`（查全部） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>動態 SQL：</b> MyBatis 的 <code>&lt;if&gt;</code>、<code>&lt;where&gt;</code> 等標籤，可以根據參數是否為 null，自動決定是否加入 SQL 片段。
</div>

<!--
動態 SQL 是 MyBatis 最強大也最實用的功能之一。

在真實的業界專案中，搜尋 API 通常有很多可選的篩選條件。
如果用 Java 字串拼接 SQL，程式碼會非常複雜，容易出錯。

MyBatis 的動態 SQL 標籤讓你直接在 XML 裡寫「如果這個條件有值，就加進 WHERE」，非常直觀。
-->

---

# `<if>` + `<where>` — 動態 WHERE 條件

```xml
<select id="findByCondition" resultType="com.example.model.Student">
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

<!--
看這個動態 SQL 的範例。

`<where>` 標籤非常聰明：
- 如果裡面至少有一個 `<if>` 成立，它自動加上 `WHERE` 關鍵字。
- 如果沒有任何 `<if>` 成立，它什麼都不加（查全部）。
- 如果第一個成立的條件前面有 `AND`，它自動把多餘的 `AND` 移除。

所以你不需要擔心「第一個條件前面不應該有 AND」的問題，`<where>` 幫你處理好了。

`<if test="name != null">` 是判斷條件，當 name 參數不為 null 時，這段 SQL 才會加進去。
-->

---

# `<set>` — 動態 UPDATE

只更新有值的欄位，避免覆寫 null：

```xml
<update id="updateSelective" parameterType="com.example.model.Student">
    UPDATE student
    <set>
        <if test="name != null">name = #{name},</if>
    </set>
    WHERE id = #{id}
</update>
```

| 說明 | 詳情 |
| --- | --- |
| `<set>` | 自動加上 `SET` 關鍵字，並移除最後多餘的逗號 |
| 選擇性更新 | `name` 有值才更新，避免把不想改的欄位設成 null |

<!--
`<set>` 是 `<where>` 的 UPDATE 版本。

在 UPDATE 操作中，如果前端只傳了 name（沒傳其他欄位），我們只想更新 name，不想把其他欄位清空。

`<set>` 標籤：
- 自動加上 SET 關鍵字
- 自動移除最後一個多餘的逗號（例如只有一個條件，末尾的逗號會被移除）

這樣就可以實作「部分更新（Partial Update）」的功能，業界非常常用。
-->

---

# `<foreach>`（1/2）— IN 條件批次查詢

批次查詢多個 id 時，使用 `<foreach>` 產生 IN (?,?,?) 語法：

```xml
<!-- @Mapper 方法：List<Student> findByIds(@Param("ids") List<Integer> ids); -->
<select id="findByIds" resultType="com.example.model.Student">
    SELECT id, name FROM student
    WHERE id IN
    <foreach collection="ids" item="id"
             open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```

<!--
`<foreach>` 用於處理集合參數，最常見的場景就是 IN 條件。

例如前端傳來 ids = [1, 2, 3]，我們要查詢這三個 id 的學生，就需要生成 `WHERE id IN (1, 2, 3)` 這樣的 SQL。
-->

---

# `<foreach>`（2/2）— 屬性說明

| `<foreach>` 屬性 | 說明 |
| --- | --- |
| `collection="ids"` | 對應 `@Param("ids")` 的參數名稱 |
| `item="id"` | 集合裡每個元素的別名，在 `#{}` 裡使用 |
| `open` / `close` | 集合的開頭和結尾符號，這裡是 `(` 和 `)` |
| `separator=","` | 元素之間用逗號分隔 |

<!--
四個屬性對照剛才的範例：collection 指定 ids 集合，item 給每個元素一個暫時名稱 id，open/close 包住整個 IN 子句，separator 在元素之間加逗號。

組合起來，傳入 [1, 2, 3] 就會產生 IN (1, 2, 3)。
-->

---

# `<foreach>` — 批次 INSERT

一次插入多筆資料，比迴圈逐筆呼叫效能更好：

```xml
<!-- @Mapper 方法：int batchInsert(@Param("list") List<Student> list); -->
<insert id="batchInsert">
    INSERT INTO student(id, name) VALUES
    <foreach collection="list" item="s" separator=",">
        (#{s.id}, #{s.name})
    </foreach>
</insert>
```

| `<foreach>` 屬性 | 說明 |
| --- | --- |
| `collection="list"` | 對應 `@Param("list")` 的參數名稱 |
| `item="s"` | 集合裡每個元素的別名 |
| `separator=","` | 每組 VALUES 之間用逗號分隔 |

<!--
MyBatis 的批次 INSERT 和 IN 查詢都用 <foreach>，差別在於位置：
IN 查詢把 <foreach> 放在 WHERE 子句；批次 INSERT 把 <foreach> 放在 VALUES 後面。
產生的 SQL 是 INSERT INTO student(id, name) VALUES (?, ?), (?, ?), (?, ?)——一次送出所有資料。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6

## Annotation vs XML 選擇建議

<!--
學了兩種寫法，什麼時候用哪個？
-->

---

# Annotation vs XML 選擇指南

| 情境 | 建議 | 原因 |
| --- | --- | --- |
| 簡單 CRUD（SQL < 3 行） | Annotation | 簡潔直觀，不需要額外 XML 檔案 |
| 複雜查詢（多 JOIN、子查詢） | XML | SQL 排版自由，可讀性更高 |
| 動態條件（有時才加 WHERE） | XML | `<if>`、`<where>` 語法 |
| 批次操作（IN 條件） | XML | `<foreach>` 語法 |
| 欄位名稱不一致的映射 | XML | `<resultMap>` 精確控制 |
| 同一個 @Mapper 混搭 | 可以 | 各方法獨立選擇，不衝突 |

<!--
沒有絕對的答案，根據 SQL 複雜度選擇最適合的方式。

實務上的經驗：
- findById、insert、update、deleteById 這種基本操作，直接用 Annotation 就夠了。
- 搜尋功能、多條件過濾、複雜報表查詢，用 XML 管理更好維護。

同一個 @Mapper 介面裡，有些方法用 Annotation、有些方法在 XML，是完全合法的。
MyBatis 會分別去找對應的 SQL，不會衝突。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7

## 串接三層式架構

<!--
前兩章的 Controller、Service、Dao 都已經寫好了。這一節來看：換成 XML Mapper 之後，這三層要改多少。
-->

---

# 回顧：三層式架構的呼叫鏈

答案是：**一行都不用改**。原因看 `@Mapper` 介面：

| 分層 | 類別 | 和 ch29／ch30 相比 |
| --- | --- | --- |
| Controller | `StudentController` | 完全相同 |
| Service | `StudentService` | 完全相同 |
| Dao | `StudentDao` | 完全相同（一樣注入 `StudentMapper`，呼叫一樣的方法名） |
| `StudentMapper` 介面 | 方法簽名 | 完全相同，只是拿掉 `@Insert`/`@Select` 等 Annotation |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵原因：</b> Dao 呼叫的是 <code>studentMapper.insert(student)</code> 這個「方法」，不管 SQL 寫在 Annotation 還是 XML，方法簽名不變，呼叫端完全感覺不到差異。
</div>

<!--
這是本章最重要的觀念：Annotation 換成 XML，改變的只有「SQL 寫在哪裡」，不影響 @Mapper 介面對外的方法簽名。

Dao 呼叫 studentMapper.insert(student)、findAll()、findById() 這些方法名稱和參數完全沒變，
所以 Dao、Service、Controller 三層——包含前面章節寫好的建構子注入、@RequestBody、@PathVariable——一行都不用動。

這正是「介面（interface）」的價值：呼叫端只依賴方法簽名，不依賴實作方式。
-->

---

# 對照：Annotation 版 vs XML 版的 `StudentMapper`

```java
// ch29／ch30：Annotation 版——SQL 寫在介面上
@Mapper
public interface StudentMapper {
    @Insert("INSERT INTO student(id, name) VALUES (#{id}, #{name})")
    int insert(Student student);

    @Select("SELECT id, name FROM student")
    List<Student> findAll();
}
```

```java
// ch31：XML 版——介面只留方法簽名，SQL 搬到 mapper.xml
@Mapper
public interface StudentMapper {
    int insert(Student student);
    List<Student> findAll();
}
```

<!--
兩份程式碼對照，一眼就能看出差異：方法名稱、參數、回傳型別完全一樣，唯一的差別是 Annotation 版把 SQL 字串寫在方法上，XML 版把 SQL 搬到 mapper.xml 的 `<insert>`、`<select>` 元素裡。

因為介面沒變，Dao 注入這個介面之後，呼叫方式也完全沒變——這就是為什麼 Service、Controller 不用改一行。
-->

---

# 用 Postman 驗證：CUD／查詢 API 沒有任何改變

把 `StudentMapper` 的 SQL 改成 XML 版之後，重新啟動 Spring Boot，用**和 ch29／ch30 完全相同**的 API 測試：

| 操作 | HTTP 方法 + URL | 預期結果 |
| --- | --- | --- |
| 新增 | `POST /students` | 和 ch29 相同 |
| 修改 | `PUT /students/1` | 和 ch29 相同 |
| 刪除 | `DELETE /students/1` | 和 ch29 相同 |
| 查全部 | `GET /students` | 和 ch30 相同 |
| 查單筆 | `GET /students/1` | 和 ch30 相同 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>驗證重點：</b> 前端完全感覺不到後端從 Annotation 換成 XML——這就是三層式架構「上層不受下層實作細節影響」的具體證明。
</div>

<!--
先用 Postman 打和前兩章一模一樣的 API，確認結果完全相同。

這個練習的意義不在於「又測了一次 CRUD」，而在於親眼驗證：資料庫存取的實作方式（Annotation 或 XML）換了，
但 API 的 URL、Method、Request Body、Response 全部沒有任何改變——這正是三層式架構、以及「面向介面寫程式」的核心價值。

CUD 和基本查詢確認完，接下來把 Part 5 學的動態 SQL 也串成一支真正能呼叫的 API——這是本章唯一需要新增程式碼的地方。
-->

---

# StudentMapper — 補上動態查詢方法

Part 5 的 `findByCondition` 只存在 XML 裡，`@Mapper` 介面要補上對應的方法簽名：

```java
@Mapper
public interface StudentMapper {
    // 前面 CUD／查詢方法省略
    List<Student> findByCondition(@Param("id") Integer id, @Param("name") String name);
}
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>對照 Part 5：</b> XML 裡 <code>&lt;select id="findByCondition"&gt;</code> 的 <code>id</code>，要對應介面裡一模一樣的方法名稱 <code>findByCondition</code>。
</div>

<!--
Part 5 示範動態 SQL 時，只寫了 mapper.xml 的 <select> 元素，還沒有在 @Mapper 介面加上對應的方法——現在補上。

id 和 name 都可能是 null（前端不一定會填），所以參數型別用 Integer、String 這種包裝類別，並用 @Param 明確指定名稱，對應 XML 裡 <if test="name != null">、<if test="id != null"> 的判斷。

回傳型別是 List<Student>：不管符合條件的有幾筆，甚至 0 筆或查全部，統一用 List 回傳最單純。
-->

---

# StudentDao／StudentService — 補上動態查詢

兩層都是單純轉呼叫，不做任何邏輯判斷：

```java
    // 接續 StudentDao，新增方法
    public List<Student> getStudentsByCondition(Integer id, String name) {
        return studentMapper.findByCondition(id, name);
    }
```

```java
    // 接續 StudentService，新增方法
    public List<Student> getStudentsByCondition(Integer id, String name) {
        return studentDao.getStudentsByCondition(id, name);
    }
```

<!--
Dao、Service 都是同樣的模式：單純轉呼叫，id、name 是否為 null 完全不影響這兩層的寫法。

id、name 是否為 null，交給 XML 的 <if> 標籤處理，Dao、Service 都不需要知道細節。
-->

---

# StudentController — 動態查詢 API

`id`、`name` 都設成非必填，前端可以只填其中一個、都填、或都不填：

```java
    @GetMapping("/students/search-dynamic")
    public List<Student> getStudentsByCondition(
            @RequestParam(name = "id", required = false) Integer id,
            @RequestParam(name = "name", required = false) String name) {
        return studentService.getStudentsByCondition(id, name);
    }
```

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>關鍵是 <code>required = false</code>：</b> 不加的話，前端沒帶這個參數會直接噴 400 錯誤；加了之後，沒帶的參數會是 <code>null</code>，交給 XML 的 <code>&lt;if&gt;</code> 判斷要不要加進 WHERE。
</div>

<!--
這支 API 是本章動態 SQL 真正派上用場的地方：id、name 都用 @RequestParam(required = false)，
前端可以只填 name、只填 id、兩者都填、或都不填，四種情況都交給同一支 API、同一段 XML 處理。

和前面 findById、findByIdAndName 這種「參數一定要有」的 API 不同，這裡的 null 是預期中的正常情況。
-->

---

# 用 Postman 測試動態查詢 API

同一支 `GET /students/search-dynamic`，帶不同的參數組合觀察 SQL 如何變化：

| 帶的參數 | URL | 產生的 SQL |
| --- | --- | --- |
| 都不帶 | `GET /students/search-dynamic` | `SELECT id, name FROM student`（查全部） |
| 只帶 name | `GET /students/search-dynamic?name=Judy` | `... WHERE name = 'Judy'` |
| 只帶 id | `GET /students/search-dynamic?id=1` | `... WHERE id = 1` |
| 兩者都帶 | `GET /students/search-dynamic?id=1&name=Judy` | `... WHERE id = 1 AND name = 'Judy'` |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>觀察重點：</b> 同一支 API、同一段 XML，<code>&lt;where&gt;</code> 標籤依照實際帶的參數自動組出正確的 WHERE 條件——不需要為每種組合各寫一支 API。
</div>

<!--
這是動態 SQL 最有價值的驗證：四種參數組合打同一支 API，SQL 的 WHERE 子句會跟著變化，
但 Controller、Service、Dao、Mapper 介面都只有一份程式碼——這就是 Part 5 學的 <if> + <where> 在真實三層式架構裡發揮的效果。
-->

---

# 章節總結（一）：XML Mapper 與動態 SQL

| 重點 | 說明 |
| --- | --- |
| XML Mapper | SQL 寫在 XML 檔案，適合複雜查詢 |
| namespace | 必須對應 @Mapper 介面完整類別名稱 |
| id | 必須對應 @Mapper 介面的方法名稱 |
| resultMap | 欄位名稱不一致時，手動指定映射關係 |
| `<if>` + `<where>` | 動態 WHERE 條件，自動處理 AND 和 WHERE 關鍵字 |
| `<set>` | 動態 UPDATE，實作部分更新 |
| `<foreach>` IN | 集合參數放在 WHERE，生成 `IN (?,?,?)` |
| `<foreach>` 批次 INSERT | 集合參數放在 VALUES 後，生成多行 INSERT |

<!--
XML Mapper 與動態 SQL 的重點：

第一，XML Mapper 把 SQL 寫在獨立 XML 檔案，適合複雜查詢和動態條件。
第二，namespace 和 id 是 XML 和 @Mapper 介面對應的橋樑，兩者必須完全一致。
第三，resultMap 解決欄位名稱不一致的問題。
第四，動態 SQL 三個核心標籤：`<if>` + `<where>` 做動態 WHERE；`<set>` 做動態 UPDATE；`<foreach>` 做 IN 批次查詢。
-->

---

# 章節總結（二）：選擇建議與三層式架構

| 重點 | 說明 |
| --- | --- |
| 混搭 | Annotation 和 XML 可在同一個 @Mapper 混搭使用 |
| 三層式架構 | CUD／基本查詢完全不用改；動態查詢要在 `@Mapper` 補方法簽名，並新增一支 `required = false` 的搜尋 API |

<!--
選擇建議與三層式架構的重點：

第五，Annotation 和 XML 可以混搭，根據 SQL 複雜度選擇最適合的方式。
第六，CUD 和基本查詢的三層式架構完全不用改；但動態查詢是全新功能，要在 @Mapper 補方法簽名，並用 @RequestParam(required = false) 開一支能接受任意參數組合的搜尋 API。

MyBatis 三章全部學完了！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
