---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "Spring Data JPA — 資料表關聯"
routeAlias: ch29
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
    Spring Data JPA<br>資料表關聯
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「把簿子和簿子的關係告訴助理」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第二十九章。

前面三章，我們讓助理（JPA）管理的都是「一本簿子」：學生資料。上一章最後雖然用 join 把兩本簿子一起查，但是兩本簿子的關係，是我們自己寫在便條上的。

今天要學的是：把簿子和簿子之間的關係告訴助理，之後存資料、拿資料，他都會自己處理。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **兩本簿子怎麼連起來？** 靠多出來的一格編號
- **怎麼告訴助理？** `@ManyToOne`、`@OneToMany`、`@ManyToMany`
- **連起來之後，助理會多幫什麼忙？** 一起存、一起刪，以及要注意的陷阱

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，兩本簿子怎麼連起來。答案很簡單：靠多出來的一格編號。

（下一步）第二，怎麼告訴助理。有三個註解：@ManyToOne、@OneToMany、@ManyToMany。

（下一步）第三，連起來之後，助理會多幫什麼忙。例如一起存、一起刪。也有幾個要注意的陷阱。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 一張成績單，很多科成績

<!--
先看教務處的新工作。
-->

---

# 成績單要怎麼記？

學期結束，教務處要幫每位同學做一張成績單，上面有每一科的成績。

<v-clicks>

- 如果全部記在同一本簿子：欄位要有「國文」「數學」「英文」……
- 但是每個人修的科目**數量不一樣**，以後還會開新的科目
- 一本簿子的欄位是固定的，沒辦法「這一列多三格、那一列少兩格」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 做法：拆成<b>兩本簿子</b>。一本記「成績單」（是誰的），另一本記「科目成績」（一科一列）。再想辦法把兩本連起來。
</div>

</v-click>

<!--
學期結束，教務處要幫每位同學做一張成績單。上面有每一科的成績。

（下一步）如果全部記在同一本簿子，欄位要有國文、數學、英文等等。

（下一步）但是每個人修的科目數量不一樣。有人五科，有人八科。以後還會開新的科目。

（下一步）一本簿子的欄位是固定的。沒辦法這一列多三格、那一列少兩格。

（下一步）所以做法是拆成兩本簿子。一本記成績單，只寫這張成績單是誰的。另一本記科目成績，一科一列，要幾列就有幾列。再想辦法把兩本連起來。
-->

---

# 多一格編號，就連起來了

<LinkTables />

<!--
教務處有兩本簿子。左邊是成績單，每一列是一張成績單：1 號是 Tom 的，2 號是 Amy 的。右邊是科目成績，每一列是一科的分數。

現在的問題是：右邊這三筆分數，各是誰的？看不出來。

（下一步）做法是：每一筆科目成績，都多一格，叫做「成績單編號」。寫著它屬於哪一張成績單。國文 85 分和數學 92 分寫的是 1，所以是 Tom 的。國文 70 分寫的是 2，是 Amy 的。

（下一步）從成績單這邊看：1 號成績單，有很多筆科目成績。

（下一步）從科目成績這邊看：每一筆，只屬於一張成績單。

同一個關係，從兩邊看，說法不一樣。
-->

---

# 對照到程式

<LinkTables terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>外鍵</b>（Foreign Key）：一個欄位，裡面存的是「另一張資料表某一筆資料的主鍵」。兩張資料表就是靠它連起來的。
</div>

</v-click>

<!--
同一張圖，換成程式的名字。成績單的類別叫 ReportCard，科目成績叫 SubjectScore。

（下一步）多出來的那一格「成績單編號」，在資料庫裡有一個正式的名字，叫做外鍵。

（下一步）從成績單這邊看，一張對多筆，叫做一對多，註解是 @OneToMany。

（下一步）從科目成績這邊看，多筆對一張，叫做多對一，註解是 @ManyToOne。

（下一步）外鍵，英文是 Foreign Key。它是一個欄位，裡面存的是另一張資料表某一筆資料的主鍵。主鍵是第二十六章學過的，用來辨認每一筆資料的編號。兩張資料表就是靠外鍵連起來的。
-->

---

# 整理：一個關係，兩種說法

<Pairs left="教務處" right="程式" rows="doc,成績單=code,ReportCard（一）|form,科目成績=code,SubjectScore（多）|card,多出來的「成績單編號」=code,外鍵 report_card_id|what,每一筆科目成績屬於一張成績單=code,多對一 @ManyToOne|book,一張成績單有很多筆科目成績=code,一對多 @OneToMany" />

<!--
我們把對應整理一次。

（下一步）成績單，是 ReportCard。它是「一」的那一邊。

（下一步）科目成績，是 SubjectScore。它是「多」的那一邊。

（下一步）多出來的成績單編號，是外鍵。欄位名稱會叫 report_card_id。

（下一步）每一筆科目成績屬於一張成績單，是多對一。

（下一步）一張成績單有很多筆科目成績，是一對多。
-->

---

# 想一想

<Poll question="「成績單編號」這一格，是加在哪一本簿子上？" options="成績單（一的那邊）|科目成績（多的那邊）|兩本都要加|另外開第三本" answer="2" />

<!--
來想一題。

「成績單編號」這一格，是加在哪一本簿子上？

（等大家作答）

（下一步）答案是：科目成績，也就是「多」的那一邊。

道理是這樣的：一格只能寫一個編號。每一筆科目成績只屬於一張成績單，所以寫得下。反過來，一張成績單有很多筆科目成績，一格寫不下那麼多編號。所以請記得：外鍵永遠在「多」的那一邊。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 多對一：@ManyToOne

<!--
來寫程式。先從科目成績這一邊開始，因為外鍵在這一邊。
-->

---

# 先寫成績單

在 `entity`（放 `Student` 的地方）新增 `ReportCard`：

```java
@Getter
@Setter
@Entity
public class ReportCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String studentName;
}
```

```java
public interface ReportCardRepository extends JpaRepository<ReportCard, Integer> {
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 到這裡都是第二十六章學過的寫法，沒有新東西。
</div>

</v-click>

<!--
先寫成績單。和 Student 放在同一個地方，新增 ReportCard 類別。

@Entity、主鍵、一個欄位 studentName，記這張成績單是誰的。

下面是它的 Repository，繼承 JpaRepository。

（下一步）到這裡都是第二十六章學過的寫法，沒有新東西。為了專心看關聯，這裡直接存學生的名字，沒有去連 Student。
-->

---

# 科目成績：我屬於哪一張成績單

<CodeSteps>

```java {4-8|10|11|12}
@Getter
@Setter
@Entity
public class SubjectScore {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String subject;
    private Integer score;

    @ManyToOne
    @JoinColumn(name = "report_card_id")
    private ReportCard reportCard;
}
```

- 前面都一樣：主鍵、科目、分數
- `@ManyToOne`：很多筆科目成績，對到一張成績單
- `@JoinColumn`：外鍵的欄位名稱叫 `report_card_id`
- 變數的型別是 **`ReportCard`**，不是 `Integer`

</CodeSteps>

<!--
接著寫科目成績，SubjectScore。

（下一步）前面都一樣：主鍵、科目 subject、分數 score。

（下一步）新的部分。@ManyToOne，意思是：很多筆科目成績，對到一張成績單。讀法是站在自己這個類別的角度：Many 是我，One 是對方。

（下一步）@JoinColumn，指定外鍵的欄位名稱。這裡叫 report_card_id。

（下一步）最特別的是這一行。變數的型別是 ReportCard，不是 Integer。在資料表裡，這一格存的是一個編號。但是在 Java 裡，我們直接放一整張成績單的物件。編號和物件之間的轉換，助理會處理。

這就是 ORM 的精神：在 Java 這邊，我們只管物件和物件的關係。
-->

---

# 存一筆科目成績

```java
public interface SubjectScoreRepository extends JpaRepository<SubjectScore, Integer> {
}
```

<CodeSteps>

```java {3|4|5}
// ReportCardDao
public SubjectScore addScore(Integer reportCardId, SubjectScore score) {
    ReportCard card = reportCardRepository.findById(reportCardId).orElse(null);
    score.setReportCard(card);
    return subjectScoreRepository.save(score);
}
```

- 先把那一張成績單找出來
- 告訴這筆科目成績：你屬於這一張
- 存檔。助理會自動把成績單的編號填進 `report_card_id`

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
🔍 啟動後到 MySQL Workbench 看 <code>subject_score</code> 資料表：多了一個 <code>report_card_id</code> 欄位，是助理依照 <code>@JoinColumn</code> 建立的。
</div>

</v-click>

<!--
科目成績也要有自己的 Repository。

然後新增一個承辦人員 ReportCardDao，寫一個方法：在某一張成績單底下，加一筆科目成績。

（下一步）第一步，用編號把那一張成績單找出來。findById 和 orElse(null) 是第二十七章學過的。

（下一步）第二步，setReportCard。告訴這筆科目成績：你屬於這一張。放進去的是整個物件。

（下一步）第三步，存檔。助理會自動從成績單物件拿出編號，填進 report_card_id 這個欄位。

（下一步）啟動之後，到 MySQL Workbench 看 subject_score 資料表。多了一個 report_card_id 欄位。它是助理依照 @JoinColumn 建立的。

往上的組長和櫃台，接法和前面一樣，這裡就不重複了。
-->

---

# 要用到的時候才去拿：LAZY

```java {1}
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "report_card_id")
private ReportCard reportCard;
```

<v-clicks>

- 沒有寫的時候：每次查一筆科目成績，助理都**順便**把成績單也查出來
- 很多時候我們只要分數，並不需要成績單，這一趟就白跑了
- `FetchType.LAZY`：先不拿。等程式真的用到 `getReportCard()` 的時候，才去檔案室拿

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 習慣：<code>@ManyToOne</code> 都加上 <code>fetch = FetchType.LAZY</code>。LAZY 是「懶惰」的意思：不到必要的時候不動。
</div>

</v-click>

<!--
@ManyToOne 有一個常用的設定。

（下一步）沒有寫的時候，每次查一筆科目成績，助理都會順便把它的成績單也查出來。

（下一步）但是很多時候，我們只要分數，並不需要成績單。這一趟就白跑了。資料一多，會拖慢速度。

（下一步）加上 fetch 等於 FetchType.LAZY 之後，助理會先不拿。等程式真的用到 getReportCard() 的時候，才去檔案室拿。

（下一步）所以習慣是：@ManyToOne 都加上這個設定。LAZY 是懶惰的意思，不到必要的時候不動。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 一對多：@OneToMany

<!--
現在可以從科目成績找到成績單。接下來讓成績單也能找到它的科目成績。
-->

---

# 成績單：我有哪些科目成績

回到 `ReportCard`，加一個清單：

<CodeSteps>

```java {7|8|all}
public class ReportCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String studentName;

    @OneToMany(mappedBy = "reportCard")
    private List<SubjectScore> scores = new ArrayList<>();
}
```

- `@OneToMany`：一張成績單，對到很多筆科目成績。`mappedBy` 下一頁說明
- 型別是 `List`，而且先給一個空的清單，之後才能直接往裡面加
- 資料表**沒有**多任何欄位：關係早就記在科目成績那一邊了

</CodeSteps>

<!--
回到 ReportCard，加一個清單。

（下一步）@OneToMany，站在成績單的角度：One 是我，Many 是對方。括號裡的 mappedBy 下一頁說明。

（下一步）因為對方有很多筆，所以型別是 List。後面先 new 一個空的 ArrayList。這樣新的成績單一開始就有一個空清單，之後才能直接往裡面加東西，不會遇到 null。

（下一步）很重要的一點：加了這個清單，report_card 資料表沒有多任何欄位。因為兩本簿子的關係，早就記在科目成績那一邊的外鍵了。這個清單只是讓我們在 Java 裡，可以從成績單走到科目成績。
-->

---

# mappedBy：關係記在對方那裡

```java
// ReportCard
@OneToMany(mappedBy = "reportCard")
private List<SubjectScore> scores = new ArrayList<>();

// SubjectScore
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "report_card_id")
private ReportCard reportCard;
```

<v-clicks>

- `mappedBy = "reportCard"` 的意思：這個關係，請看對方類別裡**叫做 `reportCard` 的那個變數**
- 引號裡寫的是對方的**變數名稱**，不是類別名稱，也不是欄位名稱
- 有 `@JoinColumn` 的那一邊負責記錄關係；有 `mappedBy` 的這一邊只是「看得到」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 如果忘了寫 <code>mappedBy</code>，助理會以為這是另一個新的關係，自己多建一張對照用的資料表。
</div>

</v-click>

<!--
把兩邊放在一起看。

（下一步）mappedBy 等於 reportCard 的意思是：這個關係，請看對方類別裡，叫做 reportCard 的那個變數。那邊已經寫清楚了。

（下一步）引號裡寫的是對方的變數名稱。不是類別名稱，也不是資料表的欄位名稱。打錯的話，啟動會失敗。

（下一步）所以兩邊的角色不一樣。有 @JoinColumn 的那一邊，負責記錄關係。有 mappedBy 的這一邊，只是看得到。

（下一步）如果忘了寫 mappedBy，助理會以為這是另一個新的關係，自己多建一張對照用的資料表。看到資料庫裡出現奇怪的資料表，通常就是這個原因。
-->

---

# 一起存：cascade

希望「存成績單的時候，裡面的科目成績也一起存」：

```java {1}
@OneToMany(mappedBy = "reportCard", cascade = CascadeType.ALL)
private List<SubjectScore> scores = new ArrayList<>();
```

<CodeSteps>

```java {3-5|6}
// ReportCardDao
public ReportCard create(ReportCard card) {
    for (SubjectScore score : card.getScores()) {
        score.setReportCard(card);
    }
    return reportCardRepository.save(card);
}
```

- 每一筆科目成績，都要告訴它「你屬於這一張」
- 只存成績單。因為有 `cascade`，助理會把清單裡的科目成績也一起存

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>cascade</b> 是「連帶」的意思：對成績單做的動作（新增、修改、刪除），連帶套用到它底下的科目成績。
</div>

</v-click>

<!--
現在有一個很實用的需求。前端一次送來一張成績單，裡面帶著好幾科的成績。希望存成績單的時候，裡面的科目成績也一起存。

在 @OneToMany 加上 cascade 等於 CascadeType.ALL。

然後看 ReportCardDao 的 create 方法。

（下一步）先用 for 迴圈，把清單裡每一筆科目成績拿出來，告訴它：你屬於這一張成績單。這一步不能省，原因下一頁說明。

（下一步）接著只存成績單。因為有 cascade，助理會把清單裡的科目成績也一起存。而且順序他會安排好：先存成績單拿到編號，再存科目成績、填上外鍵。

（下一步）cascade 是連帶的意思。對成績單做的動作，新增、修改、刪除，都連帶套用到它底下的科目成績。所以刪除一張成績單的時候，底下的科目成績也會一起刪掉。
-->

---

# 用 Postman 試試看

`POST /report-cards`，Body：

```json
{
  "studentName": "Tom",
  "scores": [
    { "subject": "國文", "score": 85 },
    { "subject": "數學", "score": 92 }
  ]
}
```

<v-clicks>

- `report_card` 資料表多一列：1、Tom
- `subject_score` 資料表多兩列，`report_card_id` 都是 1
- 我們只呼叫了一次 `save()`

</v-clicks>

<!--
把櫃台和組長接好之後，用 Postman 試試看。POST /report-cards，Body 是一個 JSON。裡面除了 studentName，還有一個 scores，用中括號包著兩筆科目成績。中括號是第十五章學過的寫法，代表「好幾個」，對應到 Java 的 List。

（下一步）送出之後，report_card 資料表多一列：1 號，Tom。

（下一步）subject_score 資料表多兩列，report_card_id 都是 1。

（下一步）我們只呼叫了一次 save。三筆資料、兩張資料表，都是助理幫我們存的。
-->

---

# 陷阱一：兩邊都要顧到

```java
for (SubjectScore score : card.getScores()) {
    score.setReportCard(card);
}
```

<v-clicks>

- 前端送來的 JSON 裡，科目成績是放在成績單的清單裡，但是每一筆**自己並不知道**它屬於誰
- 助理填外鍵的時候，看的是**科目成績那一邊**的 `reportCard`（有 `@JoinColumn` 的那一邊）
- 沒有 `setReportCard()` → `report_card_id` 會是空的，這筆成績變成「沒有主人」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 口訣：把東西放進清單之後，也要回頭告訴它「你的主人是誰」。<b>兩邊都要設定</b>。
</div>

</v-click>

<!--
剛才那個 for 迴圈，為什麼不能省？

（下一步）前端送來的 JSON 裡，科目成績是放在成績單的清單裡。但是每一筆科目成績，自己並不知道它屬於誰。它的 reportCard 是 null。

（下一步）而助理填外鍵的時候，看的是科目成績那一邊的 reportCard。也就是有 @JoinColumn 的那一邊。上一頁說過，那一邊才負責記錄關係。

（下一步）所以沒有 setReportCard 的話，report_card_id 會是空的。這筆成績存進去了，但是沒有主人，之後也查不到它是誰的。

（下一步）口訣是：把東西放進清單之後，也要回頭告訴它，你的主人是誰。兩邊都要設定。這是使用關聯最常見的錯誤。
-->

---

# 從清單拿掉，就刪除：orphanRemoval

```java {1}
@OneToMany(mappedBy = "reportCard", cascade = CascadeType.ALL, orphanRemoval = true)
private List<SubjectScore> scores = new ArrayList<>();
```

```java {4|5}
// ReportCardDao
public void removeScore(Integer reportCardId, int index) {
    ReportCard card = reportCardRepository.findById(reportCardId).orElse(null);
    card.getScores().remove(index);
    reportCardRepository.save(card);
}
```

<v-clicks>

- 從清單拿掉一筆，再存成績單 → 助理會把那一筆從資料庫**刪除**
- 沒有 `orphanRemoval` 的話：那一筆還留在資料庫裡

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 orphan 是「孤兒」的意思：失去主人的資料。<code>orphanRemoval = true</code> 就是「孤兒自動清掉」。
</div>

</v-click>

<!--
再加一個設定：orphanRemoval 等於 true。

看 removeScore 這個方法。

（下一步）找出成績單之後，從清單裡把第 index 筆拿掉。index 從 0 開始。

（下一步）然後存成績單。

（下一步）有了 orphanRemoval，助理發現清單裡少了一筆，就會把那一筆從資料庫刪除。我們沒有呼叫任何 delete。

（下一步）如果沒有這個設定，那一筆還會留在資料庫裡。

（下一步）orphan 是孤兒的意思，指的是失去主人的資料。orphanRemoval 等於 true，就是孤兒自動清掉。

這兩個設定常常一起出現。意思是：科目成績完全跟著成績單走。成績單在，它就在；從成績單拿掉，它就消失。
-->

---

# 想一想

<Poll question="成績單設定了 cascade = CascadeType.ALL。刪除 1 號成績單的時候，它底下的科目成績會怎麼樣？" options="留在資料庫，但是 report_card_id 變成空的|一起被刪除|刪除失敗，程式出錯|自動搬到 2 號成績單" answer="2" />

<!--
來想一題。

成績單設定了 cascade 等於 CascadeType.ALL。刪除 1 號成績單的時候，它底下的科目成績會怎麼樣？

（等大家作答）

（下一步）答案是：一起被刪除。

ALL 包含了刪除。對成績單做的動作，連帶套用到科目成績。這在成績單和科目成績的關係裡是合理的。但是請小心使用：不是所有的關係都適合這樣。例如「班級」和「學生」，刪掉一個班級，並不應該把學生也刪掉。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 陷阱二：回傳 JSON 的時候

<!--
關聯還有一個一定會遇到的陷阱，發生在把資料回傳給前端的時候。
-->

---

# 你看我、我看你，停不下來

`GET /report-cards/1`，回傳成績單。Spring 要把它轉成 JSON：

<v-clicks>

1. 成績單裡有 `scores`，所以要轉每一筆科目成績
2. 科目成績裡有 `reportCard`，所以要轉它的成績單
3. 成績單裡有 `scores`，所以要轉每一筆科目成績
4. ……

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 兩邊互相指著對方，轉 JSON 的時候會<b>繞圈圈停不下來</b>。結果是一個錯誤，或是一份長到看不完的 JSON。
</div>

</v-click>

<!--
寫一個查詢的 API，GET /report-cards/1，直接回傳成績單。第十六章學過，Spring 會把物件轉成 JSON。

（下一步）成績單裡有 scores，所以要轉每一筆科目成績。

（下一步）科目成績裡有 reportCard，所以要轉它的成績單。

（下一步）成績單裡又有 scores，所以又要轉每一筆科目成績。

（下一步）就這樣一直下去。

（下一步）兩邊互相指著對方，轉 JSON 的時候會繞圈圈停不下來。結果是一個錯誤，或是一份長到看不完的 JSON。
-->

---

# 解法：其中一邊不要轉

```java {1}
@JsonIgnore
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "report_card_id")
private ReportCard reportCard;
```

<v-clicks>

- `@JsonIgnore`：轉成 JSON 的時候，**跳過**這個變數
- 加在科目成績的 `reportCard` 上：圈圈就斷開了
- 回傳的成績單裡有科目成績；科目成績裡不會再出現成績單

</v-clicks>

<v-click>

```json
{ "id": 1,
  "scores": [ { "id": 1, "score": 85, "subject": "國文" }, { "id": 2, "score": 92, "subject": "數學" } ],
  "studentName": "Tom" }
```

</v-click>

<!--
解法是：讓其中一邊不要轉。

在科目成績的 reportCard 上面，加一個 @JsonIgnore。

（下一步）@JsonIgnore 的意思是：轉成 JSON 的時候，跳過這個變數。Ignore 是忽略的意思。

（下一步）加在科目成績的 reportCard 上，圈圈就斷開了。

（下一步）回傳的成績單裡有科目成績。科目成績裡不會再出現成績單。

（下一步）結果像這樣。很乾淨。

這個註解不影響資料庫，只影響轉 JSON 這件事。它也常用在不想回傳給前端的欄位，例如密碼。之後在架構的單元，我們會學到另一個更正式的做法：不要直接回傳 Entity，另外準備一個專門回傳用的類別。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 多對多：@ManyToMany

<!--
最後一種關係。
-->

---

# 成績單和獎項

<LinkTables mode="many" />

<!--
學校會在成績單上蓋獎章：全勤獎、進步獎。一張成績單可以有很多個獎項。一個獎項，也可以蓋在很多張成績單上。兩邊都是「多」。

（下一步）這時候，編號要寫在哪一邊？如果在獎項這邊加一格「成績單編號」，全勤獎要寫幾號？Tom 和 Amy 都有全勤獎。一格只能寫一個編號。寫在成績單那一邊，也是一樣的問題。

（下一步）所以要多準備一張對照表。它只有兩個欄位：成績單編號、獎項編號。每一列記一組配對。

（下一步）Tom 的成績單是 1 號。看對照表裡 1 號的那兩列：獎項 1 和獎項 2。所以 Tom 有全勤獎和進步獎。

這種關係叫做多對多。
-->

---

# 對照到程式

<LinkTables mode="many" terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 中間的對照表<b>不用寫成一個類別</b>。只要用 <code>@JoinTable</code> 告訴助理它的名字和兩個欄位，資料表的建立和裡面的資料，助理都會處理。
</div>

</v-click>

<!--
換成程式的名字。獎項的類別叫 Award。

（下一步）編號寫在哪一邊都不對，這一步和剛才一樣。

（下一步）中間的對照表，用 @JoinTable 來設定。兩邊的關係，註解是 @ManyToMany。

（下一步）Tom 的兩個獎項，一樣是看對照表裡 1 號的那兩列。

（下一步）中間的對照表，不用寫成一個類別。只要用 @JoinTable 告訴助理它的名字和兩個欄位。資料表的建立和裡面的資料，助理都會處理。
-->

---

# 多對多的寫法

```java
@Getter @Setter @Entity
public class Award {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
}
```

<CodeSteps>

```java {2|3|4|5|6}
// ReportCard 再加一個清單
@ManyToMany
@JoinTable(name = "report_card_award",
        joinColumns = @JoinColumn(name = "report_card_id"),
        inverseJoinColumns = @JoinColumn(name = "award_id"))
private List<Award> awards = new ArrayList<>();
```

- `@ManyToMany`：多對多
- `name`：對照表的名稱
- `joinColumns`：對照表裡，指向「我自己」（成績單）的欄位
- `inverseJoinColumns`：對照表裡，指向「對方」（獎項）的欄位
- 一樣是 `List`，一樣先給空的清單

</CodeSteps>

<!--
獎項 Award 是一個很單純的 Entity，只有編號和名稱。為了省空間，註解寫在同一行。它也要有自己的 AwardRepository。

然後在 ReportCard 再加一個清單。

（下一步）@ManyToMany，多對多。

（下一步）@JoinTable 的 name，是對照表的名稱。

（下一步）joinColumns，是對照表裡指向我自己的欄位。我自己是成績單，所以叫 report_card_id。

（下一步）inverseJoinColumns，是對照表裡指向對方的欄位。對方是獎項，所以叫 award_id。inverse 是「另一邊」的意思。

（下一步）變數一樣是 List，一樣先給一個空的清單。

這裡沒有加 cascade。因為獎項是獨立存在的東西。刪掉一張成績單，不應該把「全勤獎」這個獎項也刪掉。
-->

---

# 幫成績單加一個獎項

<CodeSteps>

```java {3-4|5|6}
// ReportCardDao
public ReportCard addAward(Integer reportCardId, Integer awardId) {
    ReportCard card = reportCardRepository.findById(reportCardId).orElse(null);
    Award award = awardRepository.findById(awardId).orElse(null);
    card.getAwards().add(award);
    return reportCardRepository.save(card);
}
```

- 把成績單和獎項各自找出來
- 把獎項加進成績單的清單
- 存成績單。助理會在對照表新增一列

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
🔍 到 Workbench 看 <code>report_card_award</code>：多了一列 <code>1, 1</code>。<code>award</code> 資料表沒有變。想移除獎項，就從清單 <code>remove()</code> 再存檔，對照表的那一列會被刪掉。
</div>

</v-click>

<!--
幫成績單加一個獎項。

（下一步）先把成績單和獎項各自找出來。

（下一步）把獎項加進成績單的 awards 清單。

（下一步）存成績單。助理會在對照表新增一列。

（下一步）到 Workbench 看 report_card_award 這張對照表，多了一列 1 和 1。award 資料表本身沒有變。想移除獎項的話，就從清單 remove 再存檔，對照表的那一列會被刪掉。

我們從頭到尾沒有直接碰對照表。只是在 Java 裡操作清單。
-->

---

# 補充：兩個小工具

<v-clicks>

- **`@OrderBy("score DESC")`**：加在清單上，拿出來的時候照指定的變數排序

```java
@OneToMany(mappedBy = "reportCard", cascade = CascadeType.ALL, orphanRemoval = true)
@OrderBy("score DESC")
private List<SubjectScore> scores = new ArrayList<>();
```

- **用外鍵查詢**：方法名稱可以「走進」關聯的物件

```java
List<SubjectScore> findByReportCardId(Integer reportCardId);
```

</v-clicks>

<!--
補充兩個小工具。

（下一步）第一個，@OrderBy。加在清單上，拿出來的時候會照指定的變數排序。這裡是照分數從高到低。DESC 是第二十八章學過的，從大到小。

（下一步）第二個，用外鍵查詢。第二十七章學過用方法名稱查詢。方法名稱可以走進關聯的物件：findByReportCardId，意思是用 reportCard 裡面的 id 來查。這樣就能查出某一張成績單的所有科目成績。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 動手練習

<!--
換大家動手。
-->

---

# 練習 1：聯絡簿和留言

每位同學有一本聯絡簿，老師會在上面寫很多則留言。請完成：

<v-clicks>

1. `Notebook`（聯絡簿）：`id`、`studentName`
2. `Message`（留言）：`id`、`content`，並且知道自己屬於哪一本聯絡簿
3. 存聯絡簿的時候，裡面的留言一起存；從清單拿掉的留言自動刪除
4. `POST /notebooks` 一次新增一本聯絡簿和兩則留言；`GET /notebooks/{id}` 查詢

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：外鍵在哪一邊？<code>mappedBy</code> 寫在哪一邊？查詢的時候會不會繞圈圈？
</div>

</v-click>

<!--
練習一。每位同學有一本聯絡簿，老師會在上面寫很多則留言。

（下一步）第一，Notebook，聯絡簿。有 id 和 studentName。

（下一步）第二，Message，留言。有 id 和 content，並且知道自己屬於哪一本聯絡簿。

（下一步）第三，存聯絡簿的時候，裡面的留言一起存。從清單拿掉的留言自動刪除。

（下一步）第四，寫兩個 API。POST /notebooks，一次新增一本聯絡簿和兩則留言。GET /notebooks/{id}，查詢。

（下一步）提示是三個問題。外鍵在哪一邊？mappedBy 寫在哪一邊？查詢的時候會不會繞圈圈？

請先暫停，自己試試看。
-->

---

# 練習 1：參考答案

```java
@Getter @Setter @Entity
public class Notebook {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String studentName;

    @OneToMany(mappedBy = "notebook", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();
}

@Getter @Setter @Entity
public class Message {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String content;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notebook_id")
    private Notebook notebook;
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 新增的時候別忘了那個 for 迴圈：<code>message.setNotebook(notebook)</code>。
</div>

</v-click>

<!--
參考答案。

Notebook 是「一」的那一邊。用 @OneToMany，mappedBy 寫對方的變數名稱 notebook。加上 cascade 和 orphanRemoval。

Message 是「多」的那一邊，外鍵在這裡。用 @ManyToOne 和 @JoinColumn，欄位名稱 notebook_id。加上 @JsonIgnore，避免查詢的時候繞圈圈。

（下一步）新增的時候別忘了那個 for 迴圈。每一則留言都要 setNotebook，不然外鍵會是空的。其他的寫法和成績單完全一樣。
-->

---

# 練習 2：移除獎項

請幫成績單加一個「移除獎項」的功能：

<v-clicks>

1. `DELETE /report-cards/{id}/awards/{awardId}`
2. 把這個獎項從成績單的清單拿掉，再存檔
3. 測試：對照表 `report_card_award` 少了一列；`award` 資料表**沒有**變

</v-clicks>

<v-click>

```java
// ReportCardDao
public ReportCard removeAward(Integer reportCardId, Integer awardId) {
    ReportCard card = reportCardRepository.findById(reportCardId).orElse(null);
    Award award = awardRepository.findById(awardId).orElse(null);
    card.getAwards().remove(award);
    return reportCardRepository.save(card);
}
```

</v-click>

<!--
練習二。請幫成績單加一個移除獎項的功能。

（下一步）第一，DELETE /report-cards/{id}/awards/{awardId}。

（下一步）第二，把這個獎項從成績單的清單拿掉，再存檔。

（下一步）第三，測試。對照表應該少了一列。award 資料表沒有變，全勤獎這個獎項還在。

請先暫停，自己試試看。

（下一步）參考答案。寫法和加獎項幾乎一樣，只是把 add 換成 remove。被刪掉的是「Tom 有全勤獎」這個配對，不是全勤獎本身。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="card,多出來的一格編號=code,外鍵 @JoinColumn|form,每一筆屬於一張=code,@ManyToOne（外鍵在這一邊）|book,一張有很多筆=code,@OneToMany(mappedBy = …)|ok,存一張，裡面的一起存=code,cascade = CascadeType.ALL|no,從清單拿掉就刪除=code,orphanRemoval = true|doc,兩邊都是多：加一張對照表=code,@ManyToMany + @JoinTable" />

<!--
我們用一張圖複習今天的內容。

（下一步）多出來的一格編號，是外鍵，用 @JoinColumn 設定。

（下一步）每一筆屬於一張，是 @ManyToOne。外鍵在這一邊。

（下一步）一張有很多筆，是 @OneToMany，要寫 mappedBy。

（下一步）存一張，裡面的一起存，是 cascade。

（下一步）從清單拿掉就刪除，是 orphanRemoval。

（下一步）兩邊都是多，加一張對照表，是 @ManyToMany 加 @JoinTable。
-->

---

# 章節總結

<v-clicks>

- **外鍵**在「多」的那一邊；Java 裡放的是**物件**，不是編號
- **`@ManyToOne`** + `@JoinColumn`：負責記錄關係；習慣加 `fetch = FetchType.LAZY`
- **`@OneToMany(mappedBy = …)`**：用 `List`，資料表不會多欄位
- **`cascade`**、**`orphanRemoval`**：子資料跟著主人一起存、一起刪
- **兩個陷阱**：兩邊都要設定；回傳 JSON 會繞圈圈，用 `@JsonIgnore` 斷開
- **`@ManyToMany`** + `@JoinTable`：中間多一張對照表，不用寫成類別

</v-clicks>

<v-click>

JPA 到這裡告一段落。下一章認識第三位幫手：MyBatis。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）外鍵在「多」的那一邊，Java 裡放的是物件，不是編號。@ManyToOne 加 @JoinColumn 負責記錄關係，習慣加上 LAZY。@OneToMany 要寫 mappedBy，用 List，資料表不會多欄位。cascade 和 orphanRemoval 讓子資料跟著主人一起存、一起刪。兩個陷阱：兩邊都要設定，以及回傳 JSON 會繞圈圈。多對多用 @ManyToMany 加 @JoinTable，中間多一張對照表。

（最後一步）JPA 到這裡告一段落。下一章認識第三位幫手：MyBatis。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

今天的註解比較多。記得一個原則：先想清楚「誰是一、誰是多」，外鍵在多的那一邊，其他的就順了。

有任何問題歡迎提出來。
-->
