---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 單元測試與日誌
routeAlias: ch41
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
    單元測試與日誌
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓程式自己驗證自己，讓日誌告訴你發生了什麼」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第四十一章。

今天的主題和「新功能」無關，而是兩個讓我們寫程式更安心的工具。

第一個是單元測試：讓程式自動檢查程式。第二個是日誌：讓程式把發生過的事記下來。今天繼續使用 school 專案。
-->

---

# 今天要搞懂的四件事

<v-clicks>

- **為什麼要寫測試？** 改了 A，怎麼知道 B 沒有壞
- **怎麼寫測試？** JUnit 的 `@Test` 和斷言
- **測試組長時，不想真的進檔案室怎麼辦？** Mockito 的替身
- **程式上線後出事了，怎麼知道發生什麼？** 日誌和它的等級

</v-clicks>

<!--
今天要搞懂四件事。前三件是測試，最後一件是日誌。

（下一步）第一，為什麼要寫測試。改了 A，怎麼知道 B 沒有壞。

（下一步）第二，怎麼寫測試。會用到 JUnit 的 @Test 和斷言。

（下一步）第三，測試組長的時候，不想真的進檔案室怎麼辦。會用到 Mockito 的替身。

（下一步）第四，程式上線後出事了，怎麼知道發生什麼。答案是日誌，還有它的等級。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 新規定上路前，先演練

<!--
先看教務處。
-->

---

# 改了一個小地方

教務處調整了等第的規定：「70 分以上是 C」改成「60 分以上是 C」。

<v-clicks>

- 組長改完，自己拿一張 65 分的成績單試了一下，沒問題，就上路了
- 隔天發現：90 分的同學等第變成 C 了
- 原來改的時候，不小心動到了判斷的順序

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 只試了「這次改的地方」，沒有試「原本就會動的地方」。程式越大，改一處壞另一處的機會越高，而且用手一個一個重試，根本試不完。
</div>

</v-click>

<!--
教務處調整了等第的規定。原本 70 分以上是 C，現在改成 60 分以上是 C。

（下一步）組長改完，自己拿一張 65 分的成績單試了一下。等第是 C，沒問題。就上路了。

（下一步）隔天發現，90 分的同學，等第變成 C 了。

（下一步）原來改的時候，不小心動到了判斷的順序。

（下一步）問題出在哪裡？組長只試了這次改的地方，沒有試原本就會動的地方。程式越大，改一處壞另一處的機會越高。而且每改一次，就要用 Postman 把所有功能重新試一遍，根本試不完。
-->

---

# 教務處的做法：一份演練清單

<Pairs left="用手試" right="演練清單" sign="vs" rows="you,想到什麼試什麼=doc,每一種情況都寫下來：95 分應該是 A…|no,每次都要人來做，很慢=ok,交給機器照著跑，幾秒鐘跑完|what,改完之後，容易漏掉舊的情況=ok,每次改完全部重跑，舊的情況也會檢查到" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這份演練清單就是<b>測試</b>。針對程式裡很小的一塊（一個類別、一個方法）寫的測試，叫做<b>單元測試</b>（Unit Test）。
</div>

</v-click>

<!--
教務處後來的做法，是準備一份演練清單。

（下一步）用手試，是想到什麼試什麼。演練清單是把每一種情況都寫下來：95 分應該是 A，85 分應該是 B，以此類推。

（下一步）用手試，每次都要人來做，很慢。演練清單交給機器照著跑，幾秒鐘就跑完。

（下一步）用手試，改完之後容易漏掉舊的情況。演練清單每次改完全部重跑，舊的情況也會被檢查到。

（下一步）這份演練清單，在程式裡就叫做測試。其中，針對程式裡很小的一塊，例如一個類別、一個方法寫的測試，叫做單元測試，英文是 Unit Test。

測試本身也是程式。我們寫一段程式，去呼叫要檢查的程式，再比對結果是不是和預期的一樣。
-->

---

# 想一想

<Poll question="寫測試最大的好處是什麼？" options="程式會跑得比較快|改了程式之後，能很快知道有沒有弄壞原本的功能|可以不用寫 Controller|資料庫會自動備份" answer="2" />

<!--
來想一題。

寫測試最大的好處是什麼？

（等大家作答）

（下一步）答案是：改了程式之後，能很快知道有沒有弄壞原本的功能。

測試不會讓程式變快，也不能取代任何一層。它是一張安全網。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 第一個測試：JUnit

<!--
來寫第一個測試。
-->

---

# 測試放在哪裡

```text
src
├── main/java/com/example/school
│   └── vo/ScoreVO.java                ← 正式的程式
└── test/java/com/example/school
    └── vo/ScoreVOTest.java            ← 測試
```

<v-clicks>

- 測試放在 `src/test/java`，資料夾的結構和 `src/main/java` 一樣
- 命名習慣：`要測的類別 + Test`
- 需要的工具（**JUnit**、Mockito）都在 `spring-boot-starter-test` 裡，建立專案時已經自動加好了

</v-clicks>

<!--
先看測試放在哪裡。

專案裡有兩個放程式的地方。src/main/java 放正式的程式，我們一直在寫的都在這裡。src/test/java 放測試。

（下一步）測試的資料夾結構和正式的程式一樣。例如 ScoreVO 在 vo 資料夾，它的測試也放在 test 底下的 vo 資料夾。

（下一步）命名的習慣是：要測的類別，加上 Test。

（下一步）寫測試需要的工具，JUnit 和等一下會用到的 Mockito，都在 spring-boot-starter-test 這個依賴裡。建立專案的時候已經自動加好了，不用再加東西。JUnit 是 Java 最常用的測試工具。
-->

---

# 測試 ScoreVO

在 `src/test/java` 的 `com.example.school.vo` 建立 `ScoreVOTest`：

```java {1|3|5-6|7-8|9|all}
import static org.junit.jupiter.api.Assertions.*;

class ScoreVOTest {

    @Test
    void score85_gradeIsB() {
        ScoreVO score = new ScoreVO(85);
        String grade = score.getLetterGrade();
        assertEquals("B", grade);
    }
}
```

- `@Test`：這個方法是一個測試。方法沒有回傳值、沒有參數
- 三個步驟：**準備**（建立 85 分）→ **執行**（問等第）→ **檢查**（應該是 B）
- `assertEquals(預期的值, 實際的值)`：兩個不一樣，測試就失敗

<!--
我們先測 ScoreVO。它不需要資料庫、不需要其他類別，最適合當第一個測試。

在 src/test/java 的 com.example.school 底下建立 vo 資料夾，再建立 ScoreVOTest。

（下一步）第一行比較特別，開頭是 import static。它讓我們可以直接寫 assertEquals 這些檢查用的方法。這一行 Eclipse 不會自動補，請自己打上去。

（下一步）類別的名字是 ScoreVOTest。測試的類別不用加 public。

（下一步）方法上面加 @Test，告訴 JUnit 這個方法是一個測試。測試的方法沒有回傳值，也沒有參數。方法的名字建議寫出「什麼情況、預期什麼結果」，這裡是「85 分，等第是 B」。

（下一步）方法的內容分三個步驟。前兩行：準備，建立一個 85 分的 ScoreVO；執行，問它等第是什麼。

（下一步）第三行：檢查。assertEquals 有兩個參數，前面是預期的值，後面是實際的值。兩個一樣，測試通過。不一樣，測試失敗。assert 是「斷言」的意思：我斷定結果一定是這樣。

（下一步）準備、執行、檢查。幾乎所有的測試都是這三個步驟。
-->

---

# 執行測試

在 `ScoreVOTest` 上按右鍵 → **Run As** → **JUnit Test**：

<v-clicks>

- Eclipse 會打開 JUnit 視窗。**綠色**的橫條：全部通過
- 把 `"B"` 故意改成 `"A"` 再跑一次 → **紅色**的橫條，並且告訴你：`expected: <A> but was: <B>`
- 不用啟動 Spring Boot、不用開 Postman，一秒鐘就跑完

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 紅色不是壞事。它代表「程式的行為和你預期的不一樣」，而且是在上線之前就知道。
</div>

</v-click>

<!--
怎麼執行？在 ScoreVOTest 上按右鍵，選 Run As，再選 JUnit Test。

（下一步）Eclipse 會打開一個 JUnit 視窗。看到綠色的橫條，代表全部通過。

（下一步）我們故意把預期的值從 B 改成 A，再跑一次。這次是紅色的橫條。下面會告訴你：預期是 A，但實際是 B。

（下一步）請注意，我們沒有啟動 Spring Boot，也沒有開 Postman。一秒鐘就跑完了。

（下一步）紅色不是壞事。它代表程式的行為和你預期的不一樣，而且是在上線之前就知道。記得把預期的值改回 B。
-->

---

# 多寫幾種情況

```java {1-4|6-9|11-14}
@Test
void score90_gradeIsA() {
    assertEquals("A", new ScoreVO(90).getLetterGrade());
}

@Test
void score69_gradeIsF() {
    assertEquals("F", new ScoreVO(69).getLetterGrade());
}

@Test
void score200_throwsException() {
    assertThrows(IllegalArgumentException.class, () -> new ScoreVO(200));
}
```

- 一個情況寫一個測試方法。特別要測**邊界**：剛好 90、剛好 69
- `assertThrows(例外的類別, () -> 要執行的程式)`：這段程式**應該要丟出**這種例外
- `() -> …` 是把一段程式包起來，交給 `assertThrows` 去執行

<!--
一個測試不夠。我們多寫幾種情況。

（下一步）90 分，等第應該是 A。

（下一步）69 分，等第應該是 F。

測試的時候，特別要測邊界。規定是 90 分以上是 A，那剛好 90 分算不算？這種地方最容易寫錯。

（下一步）第三個測試不太一樣。200 分是不合法的，我們預期它會丟出例外。這種情況用 assertThrows。第一個參數是預期的例外類別。第二個參數是要執行的程式。

這裡有一個新的寫法：括號、箭頭。它的意思是把後面那一段程式包起來，交給 assertThrows 去執行。assertThrows 會幫我們執行它，然後看它有沒有丟出指定的例外。有丟，測試通過。沒丟，測試失敗。

現在回到一開始的故事。如果組長有這幾個測試，改完規定之後跑一遍，90 分那一個馬上就會變紅色。
-->

---

# 常用的檢查方法

<Pairs left="想檢查的事" right="寫法" rows="ok,兩個值一樣=code,assertEquals(預期, 實際)|ok,條件成立 ／ 不成立=code,assertTrue(條件) ／ assertFalse(條件)|what,是 null ／ 不是 null=code,assertNull(物件) ／ assertNotNull(物件)|no,應該要丟出例外=code,assertThrows(例外.class, () -> …)" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <code>assertEquals</code> 的順序是<b>先預期、後實際</b>。寫反了測試一樣會跑，但是失敗時的訊息會讓人看不懂。
</div>

</v-click>

<!--
常用的檢查方法整理在這裡。它們有一個統稱，叫做斷言，英文是 Assertion。

（下一步）兩個值一樣，用 assertEquals。

（下一步）條件成立或不成立，用 assertTrue 和 assertFalse。

（下一步）是 null 或不是 null，用 assertNull 和 assertNotNull。

（下一步）應該要丟出例外，用 assertThrows。

（下一步）提醒一下，assertEquals 的順序是先預期、後實際。寫反了測試一樣會跑，但是失敗的時候，訊息會說「預期是 B 但實際是 A」，剛好相反，會讓人看不懂。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 測試組長：請一位替身

<!--
ScoreVO 很好測，因為它不依賴任何人。但是 StudentService 就不一樣了。
-->

---

# 演練的時候，不想真的進檔案室

要測 `StudentService.getStudentById()`，它裡面會呼叫 `studentRepository.findById()`：

<v-clicks>

- 真的去查，就要啟動資料庫、裡面還要剛好有那一筆資料
- 如果測的是刪除，資料就**真的被刪掉了**
- 我們想檢查的是「組長的判斷對不對」，不是「檔案室有沒有正常運作」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 做法：演練的時候，請一位<b>替身</b>假扮承辦人員。他不進檔案室，只照我們給的劇本回答。這種替身叫做 <b>Mock</b>，工具是 <b>Mockito</b>。
</div>

</v-click>

<!--
我們想測 StudentService 的 getStudentById。但是它裡面會呼叫 studentRepository 的 findById，也就是請承辦人員去檔案室查。

（下一步）如果真的去查，就要啟動資料庫，而且裡面還要剛好有那一筆資料。

（下一步）如果測的是刪除，資料就真的被刪掉了。

（下一步）而且我們想檢查的是「組長的判斷對不對」，不是「檔案室有沒有正常運作」。

（下一步）所以演練的時候，我們請一位替身來假扮承辦人員。他不進檔案室，只照我們給的劇本回答。例如：「有人問你 1 號，你就回答 Judy、85 分」。這種替身叫做 Mock，幫我們產生替身的工具叫做 Mockito。
-->

---

# 準備替身

在 `src/test/java` 的 `com.example.school.service` 建立 `StudentServiceTest`：

```java {1|3-4|6-7}
@ExtendWith(MockitoExtension.class)
class StudentServiceTest {
    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;
}
```

- `@ExtendWith(MockitoExtension.class)`：這個測試要用 Mockito
- `@Mock`：請 Mockito 做一位**替身**。他有 `StudentRepository` 所有的方法，但都是空的
- `@InjectMocks`：建立一位**真的**組長，並且把上面的替身交給他用

<!--
在 test 底下的 service 資料夾，建立 StudentServiceTest。

（下一步）類別上面加 @ExtendWith，括號裡是 MockitoExtension.class。意思是這個測試要用 Mockito。

（下一步）@Mock。請 Mockito 做一位替身。這位替身有 StudentRepository 所有的方法，但是裡面都是空的，不會真的去碰資料庫。

（下一步）@InjectMocks。建立一位真的組長，也就是真正的 StudentService。並且把上面的替身交給他用，取代原本的 StudentRepository。

所以這個測試裡，組長是真的，承辦人員是假的。我們要測的是組長。
-->

---

# 給劇本，然後測試

```java {3-5|6|8|10-11|all}
@Test
void getStudentById_found() {
    Student po = new Student();
    po.setId(1); po.setName("Judy"); po.setScore(85);

    when(studentRepository.findById(1)).thenReturn(Optional.of(po));

    StudentResponse res = studentService.getStudentById(1);

    assertEquals("Judy", res.getName());
    assertEquals("B", res.getLetterGrade());
}
```

- `when(…).thenReturn(…)`：**當**有人呼叫 `findById(1)`，**就回傳**這個信封
- 這是劇本。上面要加 `import static org.mockito.Mockito.*;`
- 檢查的是組長做的事：有沒有把 PO 正確抄成成績單、等第有沒有算對

<!--
接著寫測試方法。

（下一步）準備。先做一個 PO：1 號、Judy、85 分。

（下一步）給替身劇本。when 括號裡寫「什麼情況」，thenReturn 括號裡寫「回傳什麼」。合起來是：當有人呼叫 findById(1) 的時候，就回傳這個裝著 PO 的信封。Optional.of 是把東西裝進信封。when 這個方法要在檔案最上面加一行 import static，內容寫在投影片上。

（下一步）執行。呼叫真正的組長的 getStudentById(1)。組長會去問承辦人員，而承辦人員是替身，會照劇本回答。

（下一步）檢查。成績單上的名字應該是 Judy，等第應該是 B。

（下一步）整個過程沒有用到資料庫。我們檢查的是組長做的事：有沒有把 PO 正確抄成成績單、等第有沒有算對。
-->

---

# 再測兩種情況

```java {1-5|7-11}
@Test
void getStudentById_notFound() {
    when(studentRepository.findById(99)).thenReturn(Optional.empty());
    assertNull(studentService.getStudentById(99));
}

@Test
void deleteStudent_callsRepository() {
    studentService.deleteStudent(5);
    verify(studentRepository).deleteById(5);
}
```

<v-clicks>

- 找不到的情況：劇本改成回傳**空的信封**，預期組長回傳 `null`
- `verify(替身).方法(…)`：檢查替身的這個方法**有沒有被呼叫過**。刪除沒有回傳值，就用這個方式檢查

</v-clicks>

<!--
再測兩種情況。

上面是找不到的情況。劇本改成：有人問 99 號，就回傳空的信封。Optional.empty 是空的信封。我們預期組長會回傳 null。

（下一步）這種「不正常的情況」很值得測。因為平常用手試的時候，最容易忘記試的就是它。

（下一步）下面是刪除。deleteStudent 沒有回傳值，沒有東西可以比對。這時候用 verify。它檢查的是：替身的 deleteById(5) 有沒有被呼叫過。有，就代表組長確實把刪除的工作交代下去了。而資料庫裡沒有任何東西真的被刪掉。
-->

---

# Mockito 常用的寫法

<Pairs left="演練" right="Mockito" rows="staff,做一位替身=code,@Mock|teacher,真的組長，配上替身=code,@InjectMocks|doc,劇本：問這個就答那個=code,when(…).thenReturn(…)|no,劇本：問這個就丟出例外=code,when(…).thenThrow(…)|ok,檢查替身有沒有被叫到=code,verify(替身).方法(…)" />

<!--
Mockito 常用的寫法整理在這裡。

（下一步）做一位替身，用 @Mock。

（下一步）真的組長、配上替身，用 @InjectMocks。

（下一步）劇本：問這個就答那個，用 when 加 thenReturn。

（下一步）劇本：問這個就丟出例外，用 when 加 thenThrow。可以用來演練「資料庫壞掉的時候，組長會怎麼反應」。

（下一步）檢查替身有沒有被叫到，用 verify。
-->

---

# 補充：連 Spring 一起啟動的測試

<v-clicks>

- 專案裡原本就有一個 `SchoolApplicationTests`，上面有 `@SpringBootTest`
- `@SpringBootTest`：測試時把**整個** Spring Boot 啟動起來（包含連資料庫）。最接近真實，但是慢
- `@WebMvcTest(StudentController.class)`：只啟動 Controller 這一層，搭配 `MockMvc` 模擬發請求、`@MockitoBean` 做 Service 的替身
- 這類同時檢查好幾個部分的測試，叫做**整合測試**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 建議的比例：<b>大部分是單元測試</b>（快、好寫），少數重要的流程才用整合測試。現在先把單元測試練熟。
</div>

</v-click>

<!--
這一頁是補充。

（下一步）專案裡原本就有一個測試，叫做 SchoolApplicationTests，上面有 @SpringBootTest。它是建立專案的時候自動產生的。

（下一步）@SpringBootTest 的意思是：測試的時候，把整個 Spring Boot 啟動起來，包含連資料庫。它最接近真實的情況，但是慢，而且資料庫沒開就會失敗。

（下一步）還有一種 @WebMvcTest，只啟動 Controller 這一層。它搭配一個叫 MockMvc 的工具，可以在測試裡模擬發請求；Service 的替身則用 @MockitoBean 來做。

（下一步）這類同時檢查好幾個部分的測試，叫做整合測試。

（下一步）建議的比例是：大部分是單元測試，因為它快、好寫。少數重要的流程才用整合測試。現在先把單元測試練熟就好。
-->

---

# 想一想

<Poll question="測試 StudentService 的時候，為什麼要把 StudentRepository 換成替身（Mock）？" options="因為 Repository 寫錯了|為了只檢查 Service 自己的邏輯，不必依賴真的資料庫|因為 JPA 不能測試|替身跑起來比較好看" answer="2" />

<!--
確認一下。

測試 StudentService 的時候，為什麼要把 StudentRepository 換成替身？

（等大家作答）

（下一步）答案是：為了只檢查 Service 自己的邏輯，不必依賴真的資料庫。

這樣測試跑得快，結果也不會因為資料庫裡的資料不同而改變。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 值班日誌：Log

<!--
接下來是今天的第二個主題。
-->

---

# 出事的時候，沒有人在現場

<v-clicks>

- 開發的時候出錯，我們就坐在電腦前，可以馬上看、馬上試
- 程式上線之後，它在遠方的機器上自己跑。半夜出錯，沒有人看到
- 隔天有人來問：「昨天晚上我新增的同學怎麼不見了？」

</v-clicks>

<v-click>

教務處的做法是寫**值班日誌**：幾點、誰、辦了什麼、結果如何。出事的時候翻日誌，就能還原經過。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 程式的值班日誌叫做 <b>Log</b>（日誌）。它是上線之後，了解程式發生什麼事最主要的依據。
</div>

</v-click>

<!--
出事的時候，通常沒有人在現場。

（下一步）開發的時候出錯，我們就坐在電腦前，可以馬上看、馬上試。

（下一步）程式上線之後，它在遠方的機器上自己跑。半夜出錯，沒有人看到。

（下一步）隔天有人來問：昨天晚上我新增的同學怎麼不見了？我們要怎麼知道昨天晚上發生了什麼？

（下一步）教務處的做法是寫值班日誌。幾點、誰、辦了什麼、結果如何，都記下來。出事的時候翻日誌，就能還原經過。

程式的值班日誌叫做 Log，中文是日誌。它是上線之後，了解程式發生什麼事最主要的依據。

其實我們每天都在看 Log。Spring Boot 啟動的時候，console 印出來的那一大串，就是 Spring 自己寫的日誌。
-->

---

# 在組長身上放一本日誌

```java {3-4|8|14}
@Service
public class StudentService {
    private static final Logger log =
            LoggerFactory.getLogger(StudentService.class);

    public StudentResponse createStudent(CreateStudentRequest req) {
        log.debug("準備新增學生，name={}, score={}", req.getName(), req.getScore());
        // …（中間不變）
        Student saved = studentRepository.save(po);
        log.info("學生新增成功，id={}", saved.getId());
        return toResponse(saved);
    }
}
```

- 第 3–4 行：準備一本屬於這個類別的日誌。import 請選 `org.slf4j` 的 `Logger` 和 `LoggerFactory`
- `log.info("…{}…", 值)`：寫一筆日誌。`{}` 是空格，後面的值會照順序填進去

<!--
怎麼寫日誌？打開 StudentService。

（下一步）先在類別的最上面加這兩行，準備一本屬於這個類別的日誌。這是固定的寫法，只有最後括號裡的類別名稱要換成自己的。import 的時候要注意，Logger 和 LoggerFactory 都請選 org.slf4j 開頭的。

（下一步）然後在想記錄的地方寫 log 點什麼。這一行是 log.debug，記下準備新增的學生姓名和成績。

（下一步）這一行是 log.info，記下新增成功，還有新的編號。

訊息裡的大括號是空格，後面的值會照順序填進去。第一個大括號填第一個值，第二個填第二個。這和 SQL 留空格的想法很像。請用這種寫法，不要用加號把字串接起來。

另外提醒：日誌裡不要記敏感的資料。所以這裡沒有把身分證字號寫進去。
-->

---

# 補充：兩個名字和一個捷徑

<v-clicks>

- **SLF4J**：寫日誌的「統一介面」。我們的程式只認識它
- **Logback**：實際把日誌印出來、寫進檔案的工具。Spring Boot 預設用它
- 分開的好處：以後換別的工具，程式一行都不用改

</v-clicks>

<v-click>

```java
@Slf4j
@Service
public class StudentService {
    // 不用自己寫 Logger 那兩行，直接用 log.info(…)
}
```

Lombok 的 `@Slf4j` 會自動幫我們準備好 `log`。

</v-click>

<!--
這一頁補充兩個名字。

（下一步）SLF4J，是寫日誌的統一介面。我們的程式只認識它。剛才 import 的就是它。

（下一步）Logback，是實際把日誌印出來、寫進檔案的工具。Spring Boot 預設用它。

（下一步）兩個分開的好處是：以後想換別的日誌工具，程式一行都不用改。這和三層架構裡，換承辦人員不用改組長，是同樣的道理。

（下一步）還有一個捷徑。我們的專案有 Lombok。在類別上面加 @Slf4j，Lombok 就會自動幫我們準備好那個叫 log 的變數，不用自己寫那兩行。兩種寫法效果一樣，選一種用就可以。
-->

---

# 日誌的五個等級

<v-clicks>

- `TRACE`：最瑣碎的細節，很少用
- `DEBUG`：開發時幫助除錯的資訊
- `INFO`：正常、但是值得記下來的事（新增成功、排程開始）
- `WARN`：不太對勁，但是程式還能繼續（查不到資料、重試了一次）
- `ERROR`：出錯了，需要有人處理

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 設定一個等級之後，<b>那個等級和比它嚴重的</b>才會被記下來。預設是 <code>INFO</code>，所以 <code>log.debug(…)</code> 平常不會出現。
</div>

</v-click>

<!--
值班日誌不可能什麼都記，不然重要的事會被淹沒。所以日誌分成五個等級，由輕到重。

（下一步）TRACE。最瑣碎的細節，很少用。

（下一步）DEBUG。開發的時候幫助除錯的資訊。

（下一步）INFO。正常、但是值得記下來的事。例如新增成功、排程開始執行。

（下一步）WARN。不太對勁，但是程式還能繼續。例如查不到資料、重試了一次。

（下一步）ERROR。出錯了，需要有人處理。

（下一步）等級的用途是過濾。設定一個等級之後，那個等級和比它嚴重的，才會被記下來。預設是 INFO。所以剛才寫的 log.info 會出現在 console，而 log.debug 平常不會出現。

寫法很簡單：log 點 debug、log 點 info、log 點 warn、log 點 error，用哪個方法就是哪個等級。
-->

---

# 為什麼不用 System.out.println

<Pairs left="System.out.println" right="Log" sign="vs" rows="no,沒有時間、不知道是哪個類別印的=ok,自動加上時間、等級、類別名稱|no,全部都印，關不掉=ok,用等級過濾，上線時把細節關掉|no,只能印在 console，關掉就沒了=ok,可以寫進檔案，留下來查" />

<!--
你可能會問：為什麼不用以前學的 System.out.println 就好？

（下一步）println 印出來的只有那一行字，沒有時間，也不知道是哪個類別印的。Log 會自動加上時間、等級、類別名稱。

（下一步）println 全部都印，關不掉。Log 可以用等級過濾，開發的時候看細節，上線的時候把細節關掉。

（下一步）println 只能印在 console，視窗關掉就沒了。Log 可以寫進檔案，留下來查。

所以正式的專案裡，請用 Log，不要用 println。
-->

---

# 設定：記多細、寫到哪裡

```properties {1|2|3|4}
logging.level.root=INFO
logging.level.com.example.school.service=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.file.name=logs/school.log
```

- 第 1 行：整個專案的等級，預設就是 `INFO`
- 第 2 行：只有 `service` 資料夾底下的類別，調成 `DEBUG`
- 第 3 行：別人的套件也能調。這一行會印出 JPA 執行的 SQL
- 第 4 行：除了 console，也寫進專案資料夾下的 `logs/school.log`

<!--
日誌的設定寫在 application.properties。

第一行，logging.level.root，是整個專案的等級。預設就是 INFO，這一行不寫也可以。

（下一步）第二行，在 logging.level 後面接 package 的名字，可以只調整某一個資料夾。這裡把 service 底下的類別調成 DEBUG。這樣我們寫的 log.debug 就會出現，而其他套件的細節不會跑出來洗版。

（下一步）第三行，別人的套件也能調。這一行會印出 JPA 執行的 SQL，效果和以前設定的 show-sql 類似。

（下一步）第四行，logging.file.name，指定一個檔案。加了之後，日誌除了印在 console，也會寫進專案資料夾底下的 logs/school.log。

重新啟動，新增一位同學。console 會多出兩行我們寫的日誌，前面有時間、等級、類別名稱。再打開 logs 資料夾，可以看到同樣的內容。在 Eclipse 的專案上按 F5 重新整理，才看得到新的資料夾。
-->

---

# 補充：日誌檔不能無限長大

```properties
logging.logback.rollingpolicy.max-file-size=10MB
logging.logback.rollingpolicy.max-history=7
```

<v-clicks>

- 值班日誌寫滿一本，就換一本新的；太舊的就銷毀
- `max-file-size`：一個檔案最大多少，超過就換新檔
- `max-history`：舊的檔案保留幾天
- 上線的環境建議用 `INFO`。開 `DEBUG` 日誌量會非常大，佔空間也拖慢速度

</v-clicks>

<!--
最後一個補充。日誌檔不能無限長大。

（下一步）值班日誌寫滿一本，就換一本新的。太舊的就銷毀。

（下一步）max-file-size，一個檔案最大多少。超過就換一個新檔，舊的會被改名收起來。

（下一步）max-history，舊的檔案保留幾天。

（下一步）另外，上線的環境建議用 INFO。開 DEBUG 的話，日誌量會非常大，佔空間，也會拖慢速度。

這兩行現在知道有就好，等到專案真的要上線時再設定。
-->

---

# 想一想

<Poll question="設定是 logging.level.root=INFO。下面哪一行不會出現在 console？" options="log.info(&quot;新增成功&quot;)|log.warn(&quot;查不到資料&quot;)|log.debug(&quot;準備新增&quot;)|log.error(&quot;存檔失敗&quot;)" answer="3" />

<!--
確認一下。

設定是 logging.level.root 等於 INFO。下面哪一行不會出現在 console？

（等大家作答）

（下一步）答案是 log.debug 那一行。

等級設成 INFO，只有 INFO 和比它嚴重的 WARN、ERROR 會出現。DEBUG 比 INFO 輕，會被過濾掉。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 動手練習

<!--
兩個練習，一個測試，一個日誌。
-->

---

# 練習 1：幫修改功能寫測試

在 `StudentServiceTest` 裡，替 `updateStudent()` 寫兩個測試：

<v-clicks>

- **找不到**：劇本讓 `findById(99)` 回傳空的信封 → 預期 `updateStudent(99, req)` 回傳 `null`
- **成績不合法**：劇本讓 `findById(1)` 回傳一位同學，`req` 的成績是 `200` → 預期丟出 `IllegalArgumentException`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 兩個都是綠色才算完成。提示：<code>req</code> 是 <code>new CreateStudentRequest()</code> 之後用 setter 設定。
</div>

</v-click>

<!--
練習一。在 StudentServiceTest 裡，替修改的方法 updateStudent 寫兩個測試。

（下一步）第一個，找不到的情況。劇本讓 findById(99) 回傳空的信封。預期 updateStudent(99, req) 回傳 null。

（下一步）第二個，成績不合法的情況。劇本讓 findById(1) 回傳一位同學。req 的成績設成 200。預期會丟出 IllegalArgumentException。

（下一步）兩個都是綠色才算完成。提示：req 是 new 一個 CreateStudentRequest 之後，用 setter 設定內容。

請先暫停，自己試試看。
-->

---

# 練習 1：參考答案

```java
@Test
void updateStudent_notFound() {
    when(studentRepository.findById(99)).thenReturn(Optional.empty());
    CreateStudentRequest req = new CreateStudentRequest();
    req.setName("Judy"); req.setScore(90);

    assertNull(studentService.updateStudent(99, req));
}

@Test
void updateStudent_invalidScore() {
    when(studentRepository.findById(1)).thenReturn(Optional.of(new Student()));
    CreateStudentRequest req = new CreateStudentRequest();
    req.setName("Judy"); req.setScore(200);

    assertThrows(IllegalArgumentException.class,
            () -> studentService.updateStudent(1, req));
}
```

<!--
參考答案。

第一個測試。劇本是回傳空的信封。準備一個 req。呼叫 updateStudent，用 assertNull 檢查結果是 null。

第二個測試。劇本是回傳一個裝著 Student 的信封，內容不重要，所以直接 new 一個空的。req 的成績設成 200。用 assertThrows 檢查會丟出 IllegalArgumentException。

第二個測試其實還可以多檢查一件事：成績不合法的時候，組長不應該存檔。可以再加一行 verify(studentRepository, never()).save(any())，意思是「save 從來沒有被呼叫過」。有興趣的同學可以試試看。
-->

---

# 練習 2：幫刪除和查詢加上日誌

1. 在 `StudentService` 準備好 `log`（自己寫兩行，或用 `@Slf4j`）
2. `getStudentById()`：查不到的時候，寫一筆 **WARN**：「查不到學生，id=…」
3. `deleteStudent()`：刪除之後，寫一筆 **INFO**：「已刪除學生，id=…」
4. `application.properties`：`service` 資料夾調成 `DEBUG`，並且輸出到 `logs/school.log`
5. 用 Postman 查一個不存在的編號、刪除一位同學，確認 console 和檔案裡都有紀錄

<!--
練習二，日誌。

第一，在 StudentService 準備好 log。可以自己寫那兩行，或是用 @Slf4j。

第二，getStudentById 查不到的時候，寫一筆 WARN，內容是「查不到學生」加上編號。

第三，deleteStudent 刪除之後，寫一筆 INFO，內容是「已刪除學生」加上編號。

第四，在 application.properties 把 service 資料夾調成 DEBUG，並且輸出到 logs/school.log。

第五，用 Postman 查一個不存在的編號，再刪除一位同學。確認 console 和檔案裡都有紀錄。

請先暫停，自己試試看。
-->

---

# 練習 2：參考答案

```java
public StudentResponse getStudentById(Integer id) {
    Student po = studentRepository.findById(id).orElse(null);
    if (po == null) {
        log.warn("查不到學生，id={}", id);
        return null;
    }
    return toResponse(po);
}

public void deleteStudent(Integer id) {
    studentRepository.deleteById(id);
    log.info("已刪除學生，id={}", id);
}
```

```properties
logging.level.com.example.school.service=DEBUG
logging.file.name=logs/school.log
```

<!--
參考答案。

getStudentById，在回傳 null 之前加一行 log.warn。查不到資料不算程式出錯，但是值得注意，所以用 WARN。

deleteStudent，刪除之後加一行 log.info。刪除是重要的動作，值得留下紀錄，所以用 INFO。

設定檔加兩行：service 資料夾調成 DEBUG，輸出到檔案。

加了日誌之後，可以把剛才寫的測試再跑一遍，確認還是綠色。這就是測試的用處：改了程式，馬上知道有沒有弄壞東西。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="doc,演練清單：這個情況應該是這個結果=code,單元測試：@Test + assertEquals…|staff,演練時假扮承辦人員的替身=code,Mock：@Mock、@InjectMocks|form,給替身的劇本=code,when(…).thenReturn(…)|book,值班日誌=code,Log：log.info(…)、log.warn(…)|what,日誌要記多細=code,等級：DEBUG < INFO < WARN < ERROR" />

<!--
我們用一張圖複習今天的內容。

（下一步）演練清單，是單元測試：@Test 加上各種斷言。

（下一步）演練時假扮承辦人員的替身，是 Mock。

（下一步）給替身的劇本，是 when 加 thenReturn。

（下一步）值班日誌，是 Log。

（下一步）日誌要記多細，是等級：DEBUG、INFO、WARN、ERROR，由輕到重。
-->

---

# 章節總結

<v-clicks>

- **單元測試**：寫程式去檢查程式。改完重跑，馬上知道有沒有弄壞
- **JUnit**：`@Test` 標記測試；步驟是準備 → 執行 → 檢查；`assertEquals`、`assertThrows`
- **Mockito**：用替身取代依賴的對象；`when().thenReturn()` 給劇本，`verify()` 檢查有沒有被呼叫
- **Log**：`log.info("…{}", 值)`；不要用 `println`
- **等級**：預設 `INFO`；用 `logging.level.…` 調整，用 `logging.file.name` 寫進檔案

</v-clicks>

<v-click>

下一章：有些工作不是「有人來才做」，而是「時間到了就要做」。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）單元測試是寫程式去檢查程式，改完重跑，馬上知道有沒有弄壞。JUnit 用 @Test 標記測試，步驟是準備、執行、檢查。Mockito 用替身取代依賴的對象，when 加 thenReturn 給劇本，verify 檢查有沒有被呼叫。Log 用 log.info 這樣的寫法，不要用 println。等級預設是 INFO，可以用設定調整，也可以寫進檔案。

（最後一步）到目前為止，我們的程式都是「有人發請求才做事」。下一章要看另一種：時間到了就要做的工作。
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
