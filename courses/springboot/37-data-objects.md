---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Boot 資料物件—PO、DTO、VO、DAO
routeAlias: ch37
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
  <h1 style="color: #1a5c5c; font-size: 3rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    Spring Boot 資料物件<br>PO、DTO、VO、DAO
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「每一層用自己的物件，資料才能安全流動」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第三十七章。

上一章我們整理了「人」的分工：櫃台、組長、承辦人員。今天整理的是「紙」的分工。

到目前為止，我們只用一個 Student 類別，從前端一路傳到資料庫，再一路傳回去。今天會看到，這樣做在真實的系統裡會出問題。今天的程式碼先用看的，下一章再一起動手寫。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **一個 `Student` 類別用到底，會出什麼問題？**
- **PO、DTO、VO 是什麼？** 三種用途不同的資料物件
- **DAO 又是什麼？** 它和前面三個不是同一類東西

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，一個 Student 類別用到底，會出什麼問題。

（下一步）第二，PO、DTO、VO 是什麼。它們是三種用途不同的資料物件。

（下一步）第三，DAO 又是什麼。它常常和前面三個一起被提到，但它和它們不是同一類東西。

這四個縮寫看起來很嚇人，其實每一個都對應到教務處裡的一樣東西。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 學籍簿正本不外流

<!--
先看教務處發生的事。
-->

---

# 學籍簿多了一欄

教務處的學籍簿，現在要多記一欄「身分證字號」：

<v-clicks>

- 同學來查成績。櫃台很省事，直接把**學籍簿那一頁影印**給他
- 影印出來的紙上，身分證字號也在上面
- 幫同學代領成績單的人，就這樣看到了別人的身分證字號

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 我們的程式就是這樣做的：<code>Student</code> 物件從資料庫拿出來，原封不動變成 JSON 回傳。資料表有什麼欄位，前端就看到什麼欄位。
</div>

</v-click>

<!--
教務處的學籍簿，現在要多記一欄：身分證字號。

（下一步）有一天，同學來查成績。櫃台很省事，直接把學籍簿的那一頁影印給他。

（下一步）影印出來的紙上，除了姓名和成績，身分證字號也在上面。

（下一步）如果來的是幫同學代領成績單的人，他就這樣看到了別人的身分證字號。

（下一步）我們的程式就是這樣做的。Student 物件從資料庫拿出來，原封不動變成 JSON 回傳。資料表有什麼欄位，前端就看到什麼欄位。

現在欄位只有姓名和成績，所以沒有感覺。但是真正的系統裡，資料表通常會有不適合給外面看的欄位，例如身分證字號、密碼、電話。
-->

---

# 反過來也有問題

同學來辦入學。櫃台也很省事，直接請他**填學籍簿的那一頁**：

<v-clicks>

- 「編號」那一格：編號是檔案室自動編的，同學不該自己填
- 如果他填了別人的編號 → 別人的資料就被蓋掉了
- 以後學籍簿每多一欄，同學看到的、要填的也跟著變

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 問題的根源：<b>給同學看的、同學填的、檔案室存的，其實是三種不同的紙</b>，我們卻硬用同一張。
</div>

</v-click>

<!--
反過來也有問題。同學來辦入學。櫃台也很省事，直接請他填學籍簿的那一頁。

（下一步）那一頁上面有「編號」這一格。可是編號是檔案室自動編的，同學不該自己填。

（下一步）如果他在編號那一格填了別人的號碼呢？我們在第二十六章學過，save() 看到物件有 id，會當成修改。別人的資料就被蓋掉了。

（下一步）還有一個長期的問題。以後學籍簿每多一欄，同學看到的、要填的東西也會跟著變。資料表的樣子和 API 的樣子綁在一起了。

（下一步）問題的根源是：給同學看的、同學填的、檔案室存的，其實是三種不同的紙。我們卻硬用同一張。
-->

---

# 同一位同學，三張不同的紙

<PaperTrail />

<!--
真正的教務處會準備三張不同的紙。我們一張一張看。

第一張是同學填的申請表。上面只有他自己知道的事：姓名、身分證字號、成績。沒有編號，因為編號不是他決定的。

（下一步）第二張是學籍簿的正本。每一欄都有，包含編號和身分證字號。它只在承辦人員和檔案室之間來回，不會交到櫃台外面。

（下一步）第三張是發給同學的成績單。上面有編號、姓名、成績，還多了一個等第。身分證字號沒有印在上面。

（下一步）三張紙各有各的用途。那是誰負責把申請表抄成學籍簿、再把學籍簿抄成成績單？是組長。
-->

---

# 對照到程式

<PaperTrail terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 一張表只做一件事。這三種類別都只是「裝資料的盒子」，合起來稱為<b>資料物件</b>。
</div>

</v-click>

<!--
同一張圖，加上程式的名字。

申請表，是 Request DTO。

（下一步）學籍簿正本，是 PO。

（下一步）成績單，是 Response DTO。

（下一步）負責在中間抄寫的組長，是 Service。

（下一步）這三種類別裡面都沒有什麼邏輯，就只是裝資料的盒子，合起來稱為資料物件。原則是：一張表只做一件事。

接下來一個一個介紹這些名字。
-->

---

# 想一想

<Poll question="為什麼不直接把學籍簿那一頁影印給同學？" options="影印機太慢|上面有不該給外人看的欄位，例如身分證字號|學籍簿的字太小|同學看不懂編號" answer="2" />

<!--
來想一題。

為什麼不直接把學籍簿那一頁影印給同學？

（等大家作答）

（下一步）答案是：上面有不該給外人看的欄位，例如身分證字號。

對應到程式：不要把對應資料表的物件，直接回傳給前端。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# PO：學籍簿正本

<!--
第一個，PO。
-->

---

# PO（Persistent Object）

<v-clicks>

- Persistent 是「保存下來」的意思。PO 就是**對應資料表的物件**
- 資料表有幾個欄位，它就有幾個變數，一欄都不少
- 只在 **Service ↔ Dao ↔ 資料庫** 之間流動，不交給 Controller 以外的地方

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 其實我們早就寫過 PO 了：JPA 加了 <code>@Entity</code> 的 <code>Student</code>，就是一個 PO。所以 PO 也常被叫做 <b>Entity</b>。
</div>

</v-click>

<!--
PO 的全名是 Persistent Object。

（下一步）Persistent 是「保存下來」的意思。PO 就是對應資料表的物件。

（下一步）資料表有幾個欄位，它就有幾個變數，一欄都不少。

（下一步）它只在 Service、Dao、資料庫之間流動。不交給 Controller 以外的地方，也就是不直接變成 JSON 回傳。

（下一步）其實我們早就寫過 PO 了。在 JPA 的章節，加了 @Entity 的 Student 類別，就是一個 PO。所以 PO 也常被叫做 Entity。Spring JDBC 和 MyBatis 用來接查詢結果的 Student，也是同樣的角色。
-->

---

# PO 長什麼樣子

```java {all|8|all}
@Getter
@Setter
@Entity
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String idNumber;   // 身分證字號：資料庫要存，但不能給前端
    private String name;
    private Integer score;
}
```

<v-click>

- 和以前的 `Student` 幾乎一樣，只是多了 `idNumber`
- 差別不在寫法，在於**使用的規矩**：它不再直接當成 API 的輸入和輸出

</v-click>

<!--
PO 長什麼樣子？就是我們熟悉的 Student。

（下一步）多了一個變數 idNumber，身分證字號。資料庫要存它，但不能給前端看。

（下一步）除了這一行，它和以前的 Student 幾乎一樣。所以差別不在寫法，而在使用的規矩：從現在開始，它不再直接當成 API 的輸入和輸出。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# DTO：申請表和成績單

<!--
第二個，DTO。
-->

---

# DTO（Data Transfer Object）

<v-clicks>

- Transfer 是「傳遞」的意思。DTO 是**專門用來和前端傳遞資料的物件**
- **Request DTO**：前端傳進來的（申請表）
- **Response DTO**：回傳給前端的（成績單）
- 要有哪些變數，看的是「這支 API 需要什麼」，不是「資料表有什麼」

</v-clicks>

<!--
DTO 的全名是 Data Transfer Object。

（下一步）Transfer 是「傳遞」的意思。DTO 是專門用來和前端傳遞資料的物件。

（下一步）它有兩種。前端傳進來的，叫 Request DTO，就是申請表。

（下一步）回傳給前端的，叫 Response DTO，就是成績單。

（下一步）DTO 要有哪些變數，看的是「這支 API 需要什麼」，不是「資料表有什麼」。這就是它和 PO 最大的不同。
-->

---

# Request DTO：申請表

```java
@Getter
@Setter
public class CreateStudentRequest {
    private String name;
    private String idNumber;
    private Integer score;
}
```

<v-clicks>

- **沒有 `id`**：前端想傳也沒有地方放，不會蓋到別人的資料
- 有 `idNumber`：入學的時候要登記
- 名字的習慣：`動作 + 對象 + Request`

</v-clicks>

<!--
先看 Request DTO。新增同學用的申請表，叫做 CreateStudentRequest。

（下一步）它沒有 id 這個變數。所以前端就算在 JSON 裡多寫了 id，也沒有地方放，會被忽略。不會蓋到別人的資料。

（下一步）它有 idNumber，因為入學的時候要登記身分證字號。

（下一步）名字的習慣是：動作，加上對象，加上 Request。新增同學就是 CreateStudentRequest。

它沒有 @Entity，因為它和資料表沒有關係，只是一張表單。
-->

---

# Response DTO：成績單

```java
@Getter
@Setter
public class StudentResponse {
    private Integer id;
    private String name;
    private Integer score;
    private String letterGrade;   // 等第：A、B、C、F
}
```

<v-clicks>

- **沒有 `idNumber`**：不在這個類別裡的東西，就不可能出現在 JSON 裡
- 有 `id`：前端之後要修改、刪除，需要知道編號
- 多了 `letterGrade`：資料表沒有這一欄，是算出來的

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 一個 PO，可以搭配很多個 DTO。不同的 API 用不同的表單，彼此不影響。
</div>

</v-click>

<!--
再看 Response DTO。回傳給前端的成績單，叫做 StudentResponse。

（下一步）它沒有 idNumber。不在這個類別裡的東西，就不可能出現在 JSON 裡。這比「記得不要回傳」可靠得多。

（下一步）它有 id。因為前端之後要修改、刪除這位同學，需要知道他的編號。

（下一步）它還多了一個 letterGrade，等第。資料表裡沒有這一欄，是根據成績算出來的。Response DTO 可以放資料表沒有的東西。

（下一步）一個 PO 可以搭配很多個 DTO。新增用一張表單、修改用另一張、列表用精簡的一張。不同的 API 用不同的表單，彼此不影響。
-->

---

# 想一想

<Poll question="前端在新增同學的 JSON 裡偷偷加了 &quot;id&quot;: 1，會發生什麼事？（後端用 CreateStudentRequest 接收）" options="1 號同學的資料被蓋掉|程式當掉|id 被忽略，照常新增一位新同學|資料庫被清空" answer="3" />

<!--
確認一下。

前端在新增同學的 JSON 裡偷偷加了 id 等於 1。後端是用 CreateStudentRequest 接收的。會發生什麼事？

（等大家作答）

（下一步）答案是：id 被忽略，照常新增一位新同學。

因為 CreateStudentRequest 裡沒有 id 這個變數，JSON 裡多出來的東西沒有地方放。如果我們還是用 Student 直接接收，1 號同學的資料就真的會被蓋掉。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# VO：寫好就不能改的值

<!--
第三個，VO。
-->

---

# VO（Value Object）

教務處開出去的在學證明會**護貝**：做好之後就不能塗改。要改，只能重新做一張。

<v-clicks>

- VO 是「值物件」：用來表示**一個值**，例如一個成績、一筆金額
- 最大的特色是**不可變**：建立之後，內容就不能再改
- 值的規矩可以寫在裡面，例如「成績一定在 0 到 100 之間」

</v-clicks>

<!--
VO 的全名是 Value Object，值物件。

先說一個教務處的習慣。開出去的在學證明會護貝。做好之後就不能塗改。如果內容要改，只能重新做一張。

（下一步）VO 用來表示一個值。例如一個成績、一筆金額、一個座標。

（下一步）它最大的特色是不可變。建立之後，內容就不能再改。就像護貝過的證明。

（下一步）因為不能改，所以我們可以把值的規矩寫在裡面。例如「成績一定在 0 到 100 之間」。只要這個物件建立得出來，它就一定是合法的，之後也不會被改壞。
-->

---

# VO 長什麼樣子

```java {all|2|4-9|11|all}
public class ScoreVO {
    private final Integer value;

    public ScoreVO(Integer value) {
        if (value == null || value < 0 || value > 100) {
            throw new IllegalArgumentException("成績要在 0 到 100 之間");
        }
        this.value = value;
    }

    public Integer getValue() { return value; }
}
```

- `final`：這個變數只能設定一次，之後不能再改
- 建構子：建立物件時檢查，不合規定就丟出例外，物件建立不起來
- 只有 getter，**沒有 setter**：外面只能看，不能改

<!--
VO 長什麼樣子？我們用成績當例子，叫做 ScoreVO。

（下一步）變數前面有 final。final 的意思是：這個變數只能設定一次，之後不能再改。

（下一步）建構子。建立物件的時候，先檢查成績是不是在 0 到 100 之間。不合規定就丟出例外，物件根本建立不起來。

（下一步）只有 getter，沒有 setter。外面的程式只能看這個值，不能改它。

（下一步）所以拿到一個 ScoreVO，就可以放心：它裡面的成績一定是合法的，而且沒有人能偷偷改掉。
-->

---

# DTO 和 VO，差在哪裡

<Pairs left="DTO" right="VO" sign="vs" rows="form,用途：把資料傳來傳去=card,用途：代表一個有規矩的值|ok,可以改（有 setter）=lock,不能改（final，沒有 setter）|doc,例子：CreateStudentRequest=doc,例子：ScoreVO" />

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ <b>VO 這個縮寫有兩種用法</b>。有些團隊把它當成 View Object（給畫面看的資料），第二十八章的 <code>StudentTeacherVo</code> 就是這個意思。進到團隊之後，以團隊的定義為準。
</div>

</v-click>

<!--
DTO 和 VO 很容易搞混，我們放在一起看。

（下一步）用途不同。DTO 是把資料傳來傳去的容器。VO 代表一個有規矩的值。

（下一步）能不能改。DTO 可以改，有 setter。VO 不能改，變數是 final，沒有 setter。

（下一步）例子。DTO 是 CreateStudentRequest。VO 是 ScoreVO。

（下一步）這裡要提醒一件事。VO 這個縮寫，在業界有兩種用法。有些團隊把它當成 View Object，意思是「給畫面看的資料」。我們在第二十八章寫的 StudentTeacherVo，就是這個意思。今天講的是另一種：Value Object。兩種都有人用，進到團隊之後，以團隊的定義為準。

初學階段不用太擔心分不清楚。記得「VO 是不能改的值」這個觀念就夠了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# DAO，以及全部放在一起

<!--
最後一個，DAO。
-->

---

# DAO（Data Access Object）

<v-clicks>

- Access 是「存取」的意思。DAO 是**負責存取資料庫的物件**
- 它就是承辦人員：`StudentDao`、`StudentRepository`、`StudentMapper`
- 它**不是**裝資料的盒子。它是「做事的人」，前面三個是「被傳遞的紙」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 名字很像，所以常常被放在一起講。分辨的方法：PO、DTO、VO 裡面是<b>資料</b>；DAO 裡面是<b>方法</b>。
</div>

</v-click>

<!--
DAO 的全名是 Data Access Object。

（下一步）Access 是「存取」的意思。DAO 是負責存取資料庫的物件。

（下一步）它就是我們的承辦人員。我們寫過的 StudentDao、JPA 的 StudentRepository、MyBatis 的 StudentMapper，都是 DAO。上一章說的 Dao 層，名字就是從這裡來的。

（下一步）所以它不是裝資料的盒子。它是做事的人。前面三個是被傳遞的紙。

（下一步）四個名字很像，所以常常被放在一起講。分辨的方法很簡單：PO、DTO、VO 裡面是資料；DAO 裡面是方法。
-->

---

# 一個請求裡，誰拿著哪張紙

<Flow nodes="前端:同學|Controller:櫃台|Service:組長|Dao:承辦人員|資料庫:檔案室" steps="1>2:JSON|2>3:Request DTO|3>4:PO|4>5:INSERT …|5>4:存好了|4>3:PO（有 id 了）|3>2:Response DTO|2>1:JSON" />

<!--
把它們放進上一章的三層裡，看一個新增的請求，誰拿著哪張紙。

（下一步）同學送出 JSON。

（下一步）櫃台把它接成 Request DTO，也就是申請表，交給組長。

（下一步）組長把申請表抄成 PO，也就是學籍簿的一頁，交給承辦人員。

（下一步）承辦人員把它存進檔案室。

（下一步）檔案室存好了。

（下一步）承辦人員把存好的 PO 交回來。這時候 PO 上面已經有檔案室編的 id 了。

（下一步）組長把 PO 抄成 Response DTO，也就是成績單，交給櫃台。

（下一步）櫃台把它變成 JSON，回覆給同學。

請注意：櫃台從頭到尾只碰過 DTO，沒有碰過 PO。承辦人員從頭到尾只碰過 PO，沒有碰過 DTO。在中間轉換的是組長。
-->

---

# 四個名字，一次整理

<Pairs left="教務處" right="程式" rows="book,學籍簿正本：每一欄都有，不外流=code,PO（Entity）：對應資料表|form,申請表、成績單：給外面的人用=code,DTO：Request DTO、Response DTO|lock,護貝的證明：做好就不能改=code,VO：不可變的值物件|staff,承辦人員：進檔案室存取=code,DAO：Dao、Repository、Mapper" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
📌 規矩：<b>Controller 只碰 DTO，Dao 只碰 PO，轉換交給 Service。</b>
</div>

</v-click>

<!--
四個名字，一次整理。

（下一步）學籍簿正本，每一欄都有，不外流。這是 PO，也叫 Entity，對應資料表。

（下一步）申請表和成績單，給外面的人用。這是 DTO，分成 Request DTO 和 Response DTO。

（下一步）護貝的證明，做好就不能改。這是 VO，不可變的值物件。

（下一步）承辦人員，進檔案室存取。這是 DAO，也就是我們寫過的 Dao、Repository、Mapper。

（下一步）最後記一條規矩：Controller 只碰 DTO，Dao 只碰 PO，轉換交給 Service。
-->

---

# 想一想

<Poll question="把 PO 轉成 Response DTO 的程式，應該寫在哪裡？" options="Controller|Service|Dao|前端" answer="2" />

<!--
確認一下。

把 PO 轉成 Response DTO 的程式，應該寫在哪裡？

（等大家作答）

（下一步）答案是 Service。

組長是唯一同時看得到兩種紙的人。櫃台只認識 DTO，承辦人員只認識 PO。
-->

---

# 這樣不是要多寫很多類別嗎？

<v-clicks>

- 是的。一個 `Student` 變成 `Student`、`CreateStudentRequest`、`StudentResponse`
- 換來的是：**資料表可以放心改**，API 不受影響；**API 可以放心改**，資料表不受影響
- 以及：敏感的欄位不會不小心流出去
- 很小的練習可以不分；會上線、會長大的系統，建議一開始就分

</v-clicks>

<!--
你可能會想：這樣不是要多寫很多類別嗎？

（下一步）是的。原本一個 Student，現在變成 Student、CreateStudentRequest、StudentResponse 三個。

（下一步）換來的是什麼？資料表可以放心改，API 不受影響。API 可以放心改，資料表不受影響。兩邊鬆開了。

（下一步）還有：敏感的欄位不會不小心流出去。

（下一步）所以很小的練習可以不分。但是會上線、會長大的系統，建議一開始就分。等資料已經流出去才補救，就來不及了。
-->

---

# 章節總結

<v-clicks>

- **問題**：一個類別同時當輸入、輸出、資料表，會洩漏欄位，也會被亂填
- **PO**：對應資料表，欄位最完整，只在 Service 和 Dao 之間
- **DTO**：和前端傳遞用。Request DTO 收進來，Response DTO 送出去
- **VO**：不可變的值，規矩寫在建構子裡
- **DAO**：存取資料庫的類別，是做事的人，不是資料
- **規矩**：Controller 只碰 DTO，Dao 只碰 PO，Service 負責轉換

</v-clicks>

<v-click>

下一章先補幾個之後會用到的 Java 寫法，再下一章就開新專案，把分工和資料物件實際寫一次。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）問題是一個類別同時當輸入、輸出、資料表，會洩漏欄位，也會被亂填。PO 對應資料表，欄位最完整。DTO 是和前端傳遞用的，分成 Request 和 Response。VO 是不可變的值，規矩寫在建構子裡。DAO 是存取資料庫的類別，是做事的人，不是資料。規矩是 Controller 只碰 DTO，Dao 只碰 PO，Service 負責轉換。

（最後一步）今天的程式都只是用看的。下一章先補幾個之後會用到的 Java 寫法。再下一章，我們會開一個新專案，把這兩章的分工和資料物件，從頭到尾實際寫一次。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

有任何問題歡迎提出來。
-->
