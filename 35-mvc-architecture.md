---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: MVC 架構模式—Controller-Service-Dao 三層式架構
routeAlias: ch35
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
  <h1 style="color: #1a5c5c; font-size: 2.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    MVC 架構模式<br>Controller-Service-Dao 三層式架構
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓每一層只做自己的事，程式碼才好維護」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第三十五章，也是新單元「架構與實務」的第一章。

前面三個單元，我們學了很多工具。這個單元不學新工具，而是回頭把寫過的程式整理好：東西要放哪裡、誰可以找誰。

今天這一章沒有新的程式要寫。我們把第二十四章就開始用的三層分工，正式講清楚，並且訂下幾條規則。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **為什麼要講究「架構」？** 程式變大、人變多之後，沒有分工會亂成一團
- **MVC 和三層式架構是什麼關係？** 複習櫃台、組長、承辦人員各自的工作
- **分層有哪些規則？** 四條一定要遵守的規定

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，為什麼要講究架構。程式變大、一起寫的人變多之後，沒有分工會亂成一團。

（下一步）第二，MVC 和三層式架構是什麼關係。我們會複習櫃台、組長、承辦人員各自的工作。

（下一步）第三，分層有哪些規則。今天會整理出四條一定要遵守的規定。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 教務處變大了

<!--
先回到教務處。
-->

---

# 只有一個人的教務處

學校剛成立的時候，教務處只有一位職員：

<v-clicks>

- 同學來了，他**自己接待**
- 能不能辦、要怎麼辦，他**自己判斷**
- 需要資料，他**自己進檔案室**翻

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 學生只有三十個人的時候，這樣沒問題。等學生變成三千人、職員變成二十位，每個人都照自己的方式做，就沒有人說得清楚「這件事到底是誰在管」。
</div>

</v-click>

<!--
學校剛成立的時候，教務處只有一位職員。

（下一步）同學來了，他自己接待。

（下一步）能不能辦、要怎麼辦，他自己判斷。

（下一步）需要資料，他自己進檔案室翻。

（下一步）學生只有三十個人的時候，這樣完全沒問題，甚至比較快。但是等學生變成三千人、職員變成二十位，如果每個人都照自己的方式做，就沒有人說得清楚：這件事到底是誰在管？規定改了要通知誰？出錯了要找誰？

寫程式也一樣。我們在第二單元的時候，所有事情都寫在 Controller 裡，程式很短，沒有問題。但是真正的系統有幾萬行程式、十幾個人一起寫，就需要一套大家都同意的分工方式。
-->

---

# 一人包辦 vs 分工

<Pairs left="一人包辦" right="分工" sign="vs" rows="you,接待、判斷、翻檔案都同一個人=clerk,櫃台、組長、承辦人員各做一件事|what,出錯了，不知道是哪個環節=ok,出錯了，知道要找哪一個人|no,規定一改，每個人都要重新學=ok,規定一改，只有組長要調整|no,新人來了，不知道從哪裡看起=ok,新人來了，看分工表就知道" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 研究「很多人一起寫大型程式時，怎麼做才不會亂」的學問，叫做<b>軟體工程</b>。把程式分成幾個部分、規定誰負責什麼，這種安排叫做<b>架構</b>。
</div>

</v-click>

<!--
我們把一人包辦和分工放在一起比較。

（下一步）一人包辦：接待、判斷、翻檔案都是同一個人。分工：櫃台、組長、承辦人員各做一件事。

（下一步）一人包辦，出錯了不知道是哪個環節。分工之後，出錯了知道要找哪一個人。

（下一步）一人包辦，規定一改，每個人都要重新學。分工之後，規定一改，只有負責判斷的組長要調整。

（下一步）一人包辦，新人來了不知道從哪裡看起。分工之後，新人看分工表就知道。

（下一步）這裡有兩個名詞。研究「很多人一起寫大型程式時，怎麼做才不會亂」的學問，叫做軟體工程。把程式分成幾個部分、規定誰負責什麼，這種安排叫做架構。

今天要談的，就是後端程式最常見的一種架構。
-->

---

# 想一想

<Poll question="下面哪一種情況，最需要講究程式的「架構」？" options="自己寫一個 20 行的小練習|程式有幾萬行，十幾個人一起維護|只會執行一次就丟掉的程式|還在學怎麼印出 Hello World" answer="2" />

<!--
來想一題。

下面哪一種情況，最需要講究程式的架構？

（等大家作答）

（下一步）答案是：程式有幾萬行、十幾個人一起維護的時候。

程式很小的時候，怎麼寫都看得懂。架構是為了「大」和「多人」準備的。不過我們現在就養成習慣，之後進到團隊裡才不會不適應。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# MVC 和三層式架構

<!--
接下來複習兩個我們已經看過的名詞，把它們的關係講清楚。
-->

---

# 複習：MVC

第十二章在飲料店看過 MVC。換到教務處，是同一件事：

<Pairs left="教務處" right="MVC" rows="clerk,櫃台：接待同學、轉交、回覆=code,Controller（控制器）|cabinet,櫃台後面：判斷規定、存取檔案=code,Model（模型）：資料和處理規則|doc,交到同學手上的結果=code,View（視圖）：回傳給前端的 JSON" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 MVC 是一種<b>架構模式</b>：前人整理出來、大家都認識的分工方式。它只說「分成三個角色」，沒有規定 Model 裡面要怎麼安排。
</div>

</v-click>

<!--
第一個名詞是 MVC。我們在第十二章的飲料店看過。換到教務處，是同一件事。

（下一步）櫃台負責接待同學、把事情轉交進去、再把結果回覆給同學。這是 Controller，控制器。

（下一步）櫃台後面的所有事情：判斷規定、存取檔案。這是 Model，模型，也就是資料和處理規則。

（下一步）最後交到同學手上的結果，是 View，視圖。我們寫的是後端 API，所以 View 就是回傳給前端的 JSON。

（下一步）MVC 是一種架構模式。意思是前人整理出來、大家都認識的分工方式。不過它只說「分成三個角色」，沒有規定 Model 裡面要怎麼安排。

Model 裡面的事情其實很多。所以在 Spring Boot 裡，我們會把它再切開。
-->

---

# 把 Model 再切成兩層

<Pairs left="MVC" right="Spring Boot 的三層" sign="→" rows="clerk,Controller=code,Controller 層：@RestController|teacher,Model（處理規則的部分）=code,Service 層：@Service|staff,Model（存取資料的部分）=code,Dao 層：@Repository|doc,View=code,回傳的 JSON（Spring 自動轉換）" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這就是 <b>Controller-Service-Dao 三層式架構</b>。我們從第二十四章就一直在用，它是 MVC 在 Spring Boot 裡的實際做法。
</div>

</v-click>

<!--
我們看 MVC 怎麼對應到 Spring Boot。

（下一步）Controller 還是 Controller，用 @RestController 標記。

（下一步）Model 裡面「處理規則」的部分，交給 Service 層，用 @Service 標記。在教務處就是組長。

（下一步）Model 裡面「存取資料」的部分，交給 Dao 層，用 @Repository 標記。在教務處就是承辦人員。

（下一步）View 是回傳的 JSON。這個部分 Spring 會自動幫我們把物件轉成 JSON，所以不用另外寫一層。

（下一步）這就是 Controller-Service-Dao 三層式架構。我們從第二十四章就一直在用它，它是 MVC 在 Spring Boot 裡的實際做法。
-->

---

# 複習：一個請求走過三層

<Flow nodes="前端:同學|Controller:櫃台|Service:組長|Dao:承辦人員|資料庫:檔案室" steps="1>2:GET /students/3|2>3:getStudentById(3)|3>4:getStudentById(3)|4>5:SELECT …|5>4:一筆資料|4>3:Student 物件|3>2:Student 物件|2>1:JSON" />

<!--
我們用一張圖複習，一個請求怎麼走過三層。

（下一步）同學向櫃台提出請求：我要查 3 號同學。

（下一步）櫃台不自己處理，轉交給組長。

（下一步）組長判斷可以辦，請承辦人員去拿資料。

（下一步）承辦人員進檔案室，執行 SQL。

（下一步）檔案室交出一筆資料。

（下一步）承辦人員把資料整理成 Student 物件，交回給組長。

（下一步）組長再交回給櫃台。

（下一步）櫃台把結果變成 JSON，回覆給同學。

請注意這條路線：進去的時候一層一層往裡面，出來的時候一層一層往外面，沒有人跳過中間的人。等一下的規則會用到這一點。
-->

---

# 三層各自的工作

<v-clicks>

- **Controller（櫃台）**：接收請求、取出參數、呼叫 Service、回傳結果
- **Service（組長）**：判斷規定、決定流程。這些判斷有個名字，叫做**商業邏輯**
- **Dao（承辦人員）**：和資料庫溝通，只做存和取

</v-clicks>

<v-click>

```java
@RestController                    @Service                      @Repository
public class StudentController {   public class StudentService { public class StudentDao {
    // 只認識 StudentService          // 只認識 StudentDao           // 只認識資料庫的工具
}                                  }                             }
```

</v-click>

<!--
三層各自的工作，再用文字整理一次。

（下一步）Controller，櫃台。接收請求、取出參數、呼叫 Service、回傳結果。

（下一步）Service，組長。判斷規定、決定流程。例如「成績要在 0 到 100 之間」、「記過要同時扣分和寫記過簿」。這些和業務有關的判斷，有一個名字叫做商業邏輯。

（下一步）Dao，承辦人員。和資料庫溝通，只做存和取。不管用的是 Spring JDBC、JPA 還是 MyBatis，都是 Dao 層的事。

（下一步）三個類別各自掛一個標記。這三個標記我們在第一單元學過，都是在告訴 Spring：這個類別請你建立成 Bean。差別只在名字，名字讓看程式的人一眼知道它是哪一層。

還有一個重點：Controller 只認識 Service，Service 只認識 Dao，Dao 只認識資料庫的工具。
-->

---

# 想一想

<Poll question="「成績低於 60 分的同學不能申請獎學金」，這個判斷應該寫在哪一層？" options="Controller|Service|Dao|寫在 SQL 裡就好" answer="2" />

<!--
確認一下。

「成績低於 60 分的同學不能申請獎學金」，這個判斷應該寫在哪一層？

（等大家作答）

（下一步）答案是 Service。

這是一條學校的規定，也就是商業邏輯。判斷規定是組長的工作。櫃台只負責接待，承辦人員只負責存取。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 四條分層的規則

<!--
分工表有了，接下來是規則。分層如果沒有規則，很快又會亂掉。
-->

---

# 規則一：櫃台不能自己進檔案室

```java {all|3-4|8-9}
@RestController
public class StudentController {
    @Autowired
    private StudentDao studentDao;          // ❌ 櫃台直接找承辦人員

    @GetMapping("/students/{id}")
    public Student getStudent(@PathVariable("id") Integer id) {
        return studentDao.getStudentById(id);   // ❌ 跳過了組長
    }
}
```

<v-clicks>

- 程式**可以執行**，結果也正確。所以這個錯誤很容易犯
- 但是組長訂的規定，這條路完全沒有經過

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
📌 <b>不能跨層</b>：Controller 只能呼叫 Service，不能直接呼叫 Dao。
</div>

</v-click>

<!--
規則一：櫃台不能自己進檔案室。

請看這段程式。

（下一步）Controller 直接注入了 StudentDao。也就是櫃台直接找承辦人員。

（下一步）然後直接呼叫 Dao 的方法。組長完全被跳過了。

（下一步）麻煩的地方在於：這段程式可以執行，結果也正確。所以這是初學者最常犯的錯誤。

（下一步）但是組長訂的規定，這條路完全沒有經過。假設學校規定「畢業超過十年的資料不提供查詢」，組長那邊有檢查，可是從這條路進來的請求都不會被檢查到。

（下一步）所以第一條規則：不能跨層。Controller 只能呼叫 Service，不能直接呼叫 Dao。

就算 Service 的方法裡只有一行、只是轉交，也要經過它。這樣以後規定變多的時候，才有地方放。
-->

---

# 規則二：承辦人員只管存取，不做決定

```java {all|4-6}
@Repository
public class StudentDao {
    public void updateScore(Integer id, Integer score) {
        if (score < 0 || score > 100) {     // ❌ 這是規定，不是存取
            throw new IllegalArgumentException("成績要在 0 到 100 之間");
        }
        // 執行 UPDATE …
    }
}
```

<v-clicks>

- 「成績要在 0 到 100 之間」是學校的規定，應該放在 Service
- Dao 的方法只做一件事：照收到的內容，去資料庫存或取

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
📌 <b>Dao 不放商業邏輯</b>。以後換工具（JDBC → JPA → MyBatis）的時候，規定一條都不用搬。
</div>

</v-click>

<!--
規則二：承辦人員只管存取，不做決定。

請看這個 Dao。

（下一步）它在更新成績之前，先檢查成績是不是在 0 到 100 之間。

（下一步）但是「成績要在 0 到 100 之間」是學校的規定，是商業邏輯，應該放在 Service。

（下一步）Dao 的方法只做一件事：照收到的內容，去資料庫存或取。

（下一步）這條規則的好處，我們在上個單元已經體會過了。承辦人員從 Spring JDBC 換成 JPA，再換成 MyBatis，每一次 Service 和 Controller 幾乎都不用動。如果規定寫在 Dao 裡，每換一次工具就要搬一次。
-->

---

# 規則三：只能往裡面找，不能往回找

<v-clicks>

- Controller → Service → Dao，呼叫的方向**只有這一個**
- Service 不能反過來呼叫 Controller；Dao 不能反過來呼叫 Service
- 一個 Service 可以找**好幾個** Dao（第三十二章的記過：`StudentDao` + `PenaltyDao`）

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
📌 <b>單一方向</b>：外層認識內層，內層不知道外層是誰。
</div>

</v-click>

<!--
規則三：只能往裡面找，不能往回找。

（下一步）呼叫的方向只有一個：Controller 找 Service，Service 找 Dao。

（下一步）反過來不行。Service 不能呼叫 Controller，Dao 不能呼叫 Service。承辦人員不會跑去指揮組長，組長也不會跑去指揮櫃台。

（下一步）不過同一個方向上，可以找不只一個人。一個 Service 可以找好幾個 Dao。第三十二章的記過就是這樣：組長同時用到了 StudentDao 和 PenaltyDao。

（下一步）整理成一句話：單一方向。外層認識內層，內層不知道外層是誰。

這樣的好處是，內層可以被不同的外層重複使用。同一個 StudentDao，可以被很多個 Service 用。
-->

---

# 規則四：名字要看得出是哪一層

<Pairs left="層" right="類別名稱 和 標記" rows="clerk,Controller 層=code,StudentController ／ @RestController|teacher,Service 層=code,StudentService ／ @Service|staff,Dao 層=code,StudentDao 或 StudentRepository ／ @Repository" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
📌 <b>命名一致</b>：「管理的東西 + 層的名字」。看到 <code>CourseService</code>，就知道是負責課程規定的那一位組長。
</div>

</v-click>

<!--
規則四：名字要看得出是哪一層。

（下一步）Controller 層的類別，名字用 Controller 結尾，標記是 @RestController。

（下一步）Service 層的類別，名字用 Service 結尾，標記是 @Service。

（下一步）Dao 層的類別，名字用 Dao 或是 Repository 結尾，標記是 @Repository。用 JPA 的時候習慣叫 Repository，其他時候習慣叫 Dao，指的是同一層。

（下一步）命名的方式是「管理的東西，加上層的名字」。看到 CourseService，就知道是負責課程規定的那一位組長。

三個類別都要有標記，Spring 才會把它們建立成 Bean，@Autowired 才拿得到。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 動手練習

<!--
最後做一個找錯誤的練習。
-->

---

# 練習：找出違反規則的地方

```java
@RestController
public class CourseController {
    @Autowired
    private CourseDao courseDao;

    @PostMapping("/courses/{id}/enroll")
    public String enroll(@PathVariable("id") Integer id) {
        Course course = courseDao.getCourseById(id);
        if (course.getRemain() <= 0) {
            return "名額已滿";
        }
        courseDao.decreaseRemain(id);
        return "選課成功";
    }
}
```

這段程式違反了哪些規則？應該怎麼改？

<!--
練習題。這是一個選課的 Controller，功能是：先查課程還有沒有名額，沒有就回覆名額已滿，有就把名額減一。

請想一想：這段程式違反了今天的哪些規則？應該怎麼改？

請先暫停，自己想一想，再看下一頁。
-->

---

# 練習：參考答案

<v-clicks>

- **違反規則一**：Controller 直接注入 `CourseDao`，跳過了 Service
- **放錯位置**：「名額滿了不能選」是規定，應該由 Service 判斷，不是 Controller

</v-clicks>

<v-click>

```java
@Service
public class CourseService {
    @Autowired
    private CourseDao courseDao;

    public String enroll(Integer id) {
        Course course = courseDao.getCourseById(id);
        if (course.getRemain() <= 0) {
            return "名額已滿";
        }
        courseDao.decreaseRemain(id);
        return "選課成功";
    }
}
```

Controller 只剩一行：`return courseService.enroll(id);`

</v-click>

<!--
參考答案。

（下一步）第一，違反規則一。Controller 直接注入 CourseDao，跳過了 Service。

（下一步）第二，判斷放錯了位置。「名額滿了不能選」是一條規定，應該由 Service 判斷，不是 Controller。

（下一步）改法是新增一個 CourseService，把判斷和呼叫 Dao 的程式整個搬進去。Controller 改成注入 CourseService，方法裡只剩一行：呼叫 Service 的 enroll，把結果回傳。

你會發現程式的總行數沒有變少，甚至多了一個類別。分層的目的不是讓程式變短，而是讓每一段程式都待在它該在的地方。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="what,人多事雜，要有分工表=code,架構（軟體工程在研究的事）|clerk,櫃台、櫃台後面、交出去的結果=code,MVC：Controller、Model、View|teacher,櫃台 → 組長 → 承辦人員=code,Controller → Service → Dao|no,櫃台不能自己進檔案室=code,不能跨層呼叫|staff,承辦人員只管存取，不做決定=code,Dao 不放商業邏輯" />

<!--
我們用一張圖複習今天的內容。

（下一步）人多事雜，要有分工表。對應到程式，是架構，也是軟體工程在研究的事。

（下一步）櫃台、櫃台後面、交出去的結果，是 MVC 的 Controller、Model、View。

（下一步）櫃台、組長、承辦人員，是 Controller、Service、Dao 三層。

（下一步）櫃台不能自己進檔案室，是不能跨層呼叫。

（下一步）承辦人員只管存取、不做決定，是 Dao 不放商業邏輯。
-->

---

# 章節總結

<v-clicks>

- **軟體工程**：研究很多人一起寫大型程式時，怎麼做才不會亂
- **MVC**：Controller 接請求、Model 處理資料和規則、View 是回傳的結果
- **三層式架構**：把 Model 再切成 Service 和 Dao
- **規則一**：不能跨層，Controller 只找 Service
- **規則二**：Dao 只存取資料，商業邏輯放 Service
- **規則三、四**：呼叫只有一個方向；名字要看得出是哪一層

</v-clicks>

<v-click>

下一章：三層之間傳來傳去的「資料」，是不是也應該分工？

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）軟體工程研究的是很多人一起寫大型程式時，怎麼做才不會亂。MVC 把程式分成 Controller、Model、View 三個角色。三層式架構是把 Model 再切成 Service 和 Dao。規則一，不能跨層。規則二，Dao 只存取資料，商業邏輯放 Service。規則三和四，呼叫只有一個方向，名字要看得出是哪一層。

（最後一步）今天談的是「人」的分工。下一章我們要看另一件事：三層之間傳來傳去的資料，是不是也應該分工？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

課後可以回頭翻一下自己上個單元寫的程式，檢查有沒有哪個 Controller 直接用了 Dao。

有任何問題歡迎提出來。
-->
