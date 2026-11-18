---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring JDBC 簡介
routeAlias: ch22
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
    Spring JDBC 簡介
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「讓 Spring Boot 能夠存取資料庫的橋樑」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第二十二章。

上一個單元，我們在手搖飲店學會了怎麼接請求、怎麼回傳 JSON。但是有一件事一直沒處理：那些訂單，程式一關就全部不見了。

從這一章開始，我們換一個新的場景：學校的教務處。這個單元要學的，是怎麼把資料好好存起來。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **資料要存在哪裡？** 教務處後面的那間檔案室
- **誰負責跑檔案室？** 一位叫 Spring JDBC 的承辦人員
- **對資料能做哪些事？** 建檔、調閱、更正、註銷，合稱 CRUD

</v-clicks>

<!--
今天沒有程式碼，只有觀念。要搞懂三件事。

（下一步）第一，資料要存在哪裡。答案是教務處後面的那間檔案室。

（下一步）第二，誰負責跑檔案室。是一位叫 Spring JDBC 的承辦人員。

（下一步）第三，對資料能做哪些事。建檔、調閱、更正、註銷，這四件事合起來叫 CRUD。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 資料記在哪裡？

<!--
先來看教務處發生的一件小事。
-->

---

# 記在腦子裡的資料

<FileRoom mode="lost" />

<!--
這個單元的場景是學校的教務處，教務處負責管全校學生的資料。

今天有一位新同學小美轉進來。老師到教務處說：新同學小美，三年二班，請記一下。承辦人員聽到了，先記在腦子裡。

（下一步）下班了，辦公室關燈。

（下一步）隔天老師來問：小美是哪一班？承辦人員想了很久：我忘了。

（下一步）所以教務處需要一間檔案室。資料寫下來、放進檔案櫃，就算關燈下班，隔天也還在。
-->

---

# 想一想

<Poll question="上一個單元的訂單 API，重新啟動 Spring Boot 之後，之前新增的訂單會怎麼樣？" options="還在，因為已經回傳 200 了|不見了，因為資料只放在程式的記憶體裡|還在，因為 Postman 會幫忙記住" answer="2" />

<!--
來想一題。

上一個單元我們做了訂單 API。如果把 Spring Boot 停掉再重新啟動，之前新增的訂單會怎麼樣？

（等大家作答）

（下一步）答案是不見了。

我們之前的資料只放在程式的記憶體裡，就像記在承辦人員的腦子裡。程式一關，等於下班關燈，資料就消失了。
-->

---

# 把故事對應到程式

<Pairs left="教務處" right="程式" rows="staff,記在腦子裡=code,放在程式的記憶體：程式一關就消失|cabinet,檔案室=server,資料庫（Database）|book,檔案櫃裡的一本學籍簿=doc,一張資料表（Table）|card,學籍簿裡的一行=doc,一筆資料" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這門課用的資料庫是 <b>MySQL</b>。它是另一個獨立執行的軟體，Spring Boot 關掉了，它裡面的資料還在。
</div>

</v-click>

<!--
把剛才的故事對應到程式。

（下一步）記在腦子裡，就是把資料放在程式的記憶體。程式一關就消失。

（下一步）檔案室，對應到資料庫，英文是 Database。

（下一步）檔案櫃裡的一本學籍簿，對應到一張資料表，英文是 Table。一本簿子只記一種東西，例如學生。

（下一步）學籍簿裡的一行，就是一筆資料，例如小美這位同學。

（下一步）這門課用的資料庫叫 MySQL。它是另一個獨立執行的軟體，不在 Spring Boot 裡面。所以 Spring Boot 關掉了，MySQL 裡的資料還在。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 誰去檔案室拿資料？

<!--
有了檔案室，接下來的問題是：誰去拿？
-->

---

# 教務處的一次調閱

<FileRoom />

<!--
來看教務處平常怎麼運作。教務處有櫃台、有承辦人員，後面還有一間檔案室。

（下一步）老師到櫃台說：我要查 3 號同學的資料。

（下一步）櫃台的人不會自己進檔案室。他把事情交給承辦人員，承辦人員走進檔案室。

（下一步）承辦人員從檔案櫃找出 3 號同學的資料卡。

（下一步）資料卡一路交回來，最後到老師手上。
-->

---

# 同一張圖，換成程式的名字

<FileRoom terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 上一個單元學的全部都是<b>櫃台</b>（Spring MVC）。這個單元要學的是<b>承辦人員</b>和<b>檔案室</b>。
</div>

</v-click>

<!--
同一張圖，我們換上程式的名字。

老師是前端。櫃台是 Spring MVC，也就是上一個單元學的 Controller，負責接請求、回傳結果。承辦人員是 Spring JDBC。檔案室是資料庫。

（依序按下一步，把流程再走一次）前端發請求，Spring MVC 接到，交給 Spring JDBC，Spring JDBC 去資料庫拿資料，再一路回傳。

（最後一步）上一個單元學的全部都是櫃台的工作。這個單元要學的，是承辦人員和檔案室。
-->

---

# Spring JDBC 是什麼？

**Spring JDBC：讓 Spring Boot 可以對資料庫下指令，把資料存進去、拿出來的工具。**

<v-clicks>

- 對資料庫下的指令，叫做 **SQL**（先前的資料庫課程學過）
- **JDBC** 是 Java Database Connectivity 的縮寫，意思是「Java 連接資料庫」
- Java 本來就有 JDBC，但是步驟很囉嗦；Spring JDBC 把囉嗦的部分包起來了
- 我們要做的只有一件事：**把 SQL 寫好，交給它去執行**

</v-clicks>

<!--
用一句話說 Spring JDBC：它是讓 Spring Boot 可以對資料庫下指令，把資料存進去、拿出來的工具。

（下一步）對資料庫下的指令叫做 SQL。這個我們在資料庫的課程學過，像 SELECT、INSERT 這些。

（下一步）JDBC 是三個英文字的縮寫，意思是 Java 連接資料庫。

（下一步）Java 本來就有 JDBC，但是直接用很囉嗦：要自己開連線、自己關連線、自己處理錯誤。Spring JDBC 把這些囉嗦的部分包起來了。

（下一步）所以我們要做的只有一件事：把 SQL 寫好，交給它去執行。就像把申請單寫好，交給承辦人員去跑檔案室。
-->

---

# 想一想

<Poll question="在教務處的故事裡，Spring JDBC 對應到誰？" options="來查資料的老師|櫃台|跑檔案室的承辦人員|檔案室" answer="3" />

<!--
確認一下。

在教務處的故事裡，Spring JDBC 對應到誰？

（等大家作答）

（下一步）答案是跑檔案室的承辦人員。

老師是前端，櫃台是 Spring MVC，檔案室是資料庫。Spring JDBC 是中間那位幫忙跑腿的人。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 對資料能做的四件事

<!--
承辦人員進檔案室，能做哪些事？其實只有四種。
-->

---

# 四件事，合稱 CRUD

<Pairs left="教務處" right="資料庫的指令" rows="form,建檔：新同學入學，多一筆資料=code,Create → INSERT|card,調閱：把資料找出來看=code,Read → SELECT|doc,更正：把寫錯的資料改掉=code,Update → UPDATE|no,註銷：把一筆資料移除=code,Delete → DELETE" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 <b>CRUD</b> 就是這四個英文字的開頭。後端工程師每天做的事，大部分都是這四種。
</div>

</v-click>

<!--
承辦人員進檔案室能做的事，只有四種。

（下一步）建檔。新同學入學，學籍簿多一筆資料。英文是 Create，對應的 SQL 是 INSERT。

（下一步）調閱。把資料找出來看。英文是 Read，對應的 SQL 是 SELECT。

（下一步）更正。把寫錯的資料改掉。英文是 Update，SQL 也叫 UPDATE。

（下一步）註銷。把一筆資料移除。英文是 Delete，SQL 也叫 DELETE。

（下一步）CRUD 就是這四個英文字的開頭，第二十章提過一次。後端工程師每天做的事，大部分都是這四種。
-->

---

# 前後兩個單元接起來了

<Pairs left="櫃台收到的請求" right="承辦人員執行的 SQL" sign="→" rows="form,POST /students=code,INSERT：建檔|card,GET /students/3=code,SELECT：調閱|doc,PUT /students/3=code,UPDATE：更正|no,DELETE /students/3=code,DELETE：註銷" />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
✅ 上一個單元的 RESTful API，加上這個單元的資料庫操作，就是一個完整的後端。
</div>

</v-click>

<!--
這四件事，剛好和上一個單元的 RESTful API 一一對應。

（下一步）櫃台收到 POST /students，承辦人員就執行 INSERT，建一筆檔。

（下一步）收到 GET /students/3，就執行 SELECT，把 3 號同學調出來。

（下一步）收到 PUT /students/3，就執行 UPDATE。

（下一步）收到 DELETE /students/3，就執行 DELETE。

（下一步）所以上一個單元的 RESTful API，加上這個單元的資料庫操作，就是一個完整的後端。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 這個單元的地圖

<!--
最後看一下這個單元會怎麼走。
-->

---

# 三位可以幫忙跑檔案室的人

Spring Boot 裡，能幫我們操作資料庫的工具不只一種。這個單元會認識三位：

<v-clicks>

- **Spring JDBC**：申請單（SQL）自己寫，拿回來的資料也自己整理。最貼近原理，**先學這個**
- **Spring Data JPA**：資深助理。只要說「存這位同學」，申請單他自己寫
- **MyBatis**：申請單自己寫，但是送件和整理資料都交給他

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 三種的目的都一樣：把資料存進資料庫、拿出來。差別只在「我們自己要做多少」。
</div>

</v-click>

<!--
在 Spring Boot 裡，能幫我們操作資料庫的工具不只一種。這個單元會認識三位。

（下一步）第一位是 Spring JDBC。申請單，也就是 SQL，要自己寫；拿回來的資料也要自己整理。它最貼近原理，所以我們先學這個。

（下一步）第二位是 Spring Data JPA。它像一位資深助理，我們只要說「存這位同學」，申請單他自己會寫。

（下一步）第三位是 MyBatis。申請單還是自己寫，但是送件和整理資料都交給他。

（下一步）三種的目的都一樣：把資料存進資料庫、拿出來。差別只在我們自己要做多少。三種在業界都很常見，所以都會學。
-->

---

# 預告：之後的程式會分成三層

<Flow nodes="前端:老師|Controller:櫃台|Service:組長|Dao:承辦人員|資料庫:檔案室" steps="1>2:GET /students/3|2>3:查 3 號同學|3>4:去拿資料|4>5:SELECT …|5>4:一筆資料|4>2:Student 物件|2>1:JSON" />

<!--
最後預告一件事。之後寫程式的時候，我們會把後端分成三層。

（下一步）前端發出 GET /students/3。

（下一步）Controller 是櫃台，收到請求之後，交給 Service。

（下一步）Service 像教務處的組長，負責決定這件事該怎麼辦，然後請 Dao 去拿資料。

（下一步）Dao 就是承辦人員，是唯一會進檔案室的人。Dao 是 Data Access Object 的縮寫，意思是「負責存取資料的物件」。它用 Spring JDBC 執行 SQL。

（下一步）資料庫回傳一筆資料。

（下一步）Dao 把它整理成 Student 物件，一路交回給 Controller。

（下一步）Controller 再轉成 JSON 回給前端。

這三層現在先有印象就好，第二十四章會實際寫一次。
-->

---

# 複習：教務處對照表

<Pairs left="教務處" right="程式" rows="cabinet,檔案室=server,資料庫（MySQL）|book,一本學籍簿=doc,一張資料表|staff,跑檔案室的承辦人員=code,Spring JDBC|form,申請單=code,SQL|card,建檔、調閱、更正、註銷=code,CRUD：INSERT / SELECT / UPDATE / DELETE" />

<!--
我們用一張圖複習今天的內容。

（下一步）檔案室，是資料庫。

（下一步）一本學籍簿，是一張資料表。

（下一步）跑檔案室的承辦人員，是 Spring JDBC。

（下一步）承辦人員手上的申請單，是 SQL。

（下一步）建檔、調閱、更正、註銷，合稱 CRUD。
-->

---

# 章節總結

<v-clicks>

- **為什麼要資料庫**：放在程式記憶體裡的資料，程式一關就消失
- **Spring JDBC**：讓 Spring Boot 執行 SQL、存取資料庫的工具
- **CRUD**：新增、查詢、修改、刪除，對應 INSERT、SELECT、UPDATE、DELETE
- **和 RESTful 的關係**：POST、GET、PUT、DELETE 剛好對應這四種操作
- **三種工具**：Spring JDBC、Spring Data JPA、MyBatis，這個單元都會學

</v-clicks>

<v-click>

下一章，我們先幫承辦人員申請檔案室的門禁：設定資料庫連線。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）放在程式記憶體裡的資料，程式一關就消失，所以需要資料庫。Spring JDBC 是讓 Spring Boot 執行 SQL、存取資料庫的工具。CRUD 是新增、查詢、修改、刪除。它和 RESTful 的四個 Http Method 剛好對應。操作資料庫的工具有三種，這個單元都會學。

（最後一步）下一章，我們先幫承辦人員申請檔案室的門禁，也就是設定資料庫連線。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容到這邊。

今天全部是觀念，沒有程式碼。只要記得教務處那張圖：櫃台、承辦人員、檔案室，後面幾章都會用到。

有任何問題歡迎提出來。
-->
