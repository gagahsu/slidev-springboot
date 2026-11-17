---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Cloud 微服務
routeAlias: ch48
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
    Spring Cloud 微服務
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「把大系統拆成小服務，讓每個服務各司其職」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第四十八章。

到目前為止，我們所有的功能都寫在同一個專案裡：學生、社團、帳號、排程，全部在 school 這一個專案。

今天要談的是：系統越來越大的時候，怎麼把它拆成好幾個小專案，以及拆開之後會遇到什麼問題。今天會建立幾個全新的小專案，不會動到 school。
-->

---

# 今天要搞懂的三件事

<v-clicks>

- **為什麼要拆？** 所有功能放在同一個專案，會遇到什麼問題
- **拆開之後多了哪些麻煩？** 找不到人、入口太多、彼此怎麼聯絡
- **Spring Cloud 怎麼幫忙？** 通訊錄、大門服務台、內線電話

</v-clicks>

<!--
今天要搞懂三件事。

（下一步）第一，為什麼要拆。所有功能放在同一個專案，會遇到什麼問題。

（下一步）第二，拆開之後多了哪些麻煩。例如找不到人、入口太多、彼此怎麼聯絡。

（下一步）第三，Spring Cloud 怎麼幫忙。先劇透三樣東西：通訊錄、大門服務台、內線電話。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 學校變大了

<!--
先看學校。
-->

---

# 一個教務處，包辦所有的事

學校剛成立的時候，只有一個教務處。學籍、社團、選課、獎懲，全部在同一間辦公室。

<v-clicks>

- 人少的時候很方便：有事喊一聲就好
- 學生變多之後：選課那幾天擠爆了，**連查社團的人也進不來**
- 改一張社團的表單，**整間辦公室都要停下來**重新布置
- 有一個人出包（把電跳掉了），**全部的業務一起停擺**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 所有功能放在同一個專案、一起啟動、一起停止，這種做法叫做<b>單體架構</b>（Monolith）。我們的 <code>school</code> 專案就是。
</div>

</v-click>

<!--
學校剛成立的時候，只有一個教務處。學籍、社團、選課、獎懲，全部在同一間辦公室。

（下一步）人少的時候，這樣很方便。有事喊一聲就好，大家都在旁邊。

（下一步）學生變多之後，問題出現了。選課那幾天，辦公室擠爆了。連只是想查社團的人也進不來。

（下一步）改一張社團的表單，整間辦公室都要停下來重新布置。

（下一步）有一個人出包，例如把電跳掉了，全部的業務一起停擺。

（下一步）所有功能放在同一個專案、一起啟動、一起停止，這種做法叫做單體架構，英文是 Monolith。我們的 school 專案就是。它不是壞的做法。小的系統用單體架構，反而簡單又好維護。
-->

---

# 拆成好幾個處室

學校決定把教務處拆開：學籍組、社團組、課務組，各自一間辦公室。

<v-clicks>

- 每個處室**只管一件事**，有自己的人、自己的檔案室
- 選課很忙：只要幫課務組加人，其他處室不受影響
- 社團組要改表單：只有社團組暫停，其他照常
- 社團組跳電：學籍和選課還能辦

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 把一個大系統拆成很多個小專案，每個專案只負責一件事、可以各自啟動和更新，這種做法叫做<b>微服務</b>（Microservices）。每個小專案叫做一個<b>服務</b>。
</div>

</v-click>

<!--
學校決定把教務處拆開。學籍組、社團組、課務組，各自一間辦公室。

（下一步）每個處室只管一件事。有自己的人，也有自己的檔案室。

（下一步）選課很忙的時候，只要幫課務組加人，其他處室不受影響。

（下一步）社團組要改表單，只有社團組暫停，其他處室照常上班。

（下一步）社團組跳電了，學籍和選課還能辦。

（下一步）把一個大系統拆成很多個小專案，每個專案只負責一件事，可以各自啟動、各自更新。這種做法叫做微服務，英文是 Microservices。每個小專案叫做一個服務。
-->

---

# 拆開不是沒有代價

<v-clicks>

- **找不到人**：社團組搬到哪一間了？分機幾號？
- **入口太多**：同學辦一件事，要自己知道該去哪一間
- **彼此要聯絡**：社團組想知道社長的名字，但是學生資料在學籍組
- **會被拖累**：學籍組電話沒人接，社團組也跟著卡住
- **規定要同步**：每個處室各有一份辦事規定，改一條要改很多份

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 微服務是用「管理變複雜」換「可以各自長大」。小團隊、小系統，用單體架構通常比較好。
</div>

</v-click>

<!--
拆開聽起來很好，但是不是沒有代價。本來在同一間辦公室喊一聲就好的事，現在都變麻煩了。

（下一步）第一，找不到人。社團組搬到哪一間了？分機幾號？

（下一步）第二，入口太多。同學辦一件事，要自己知道該去哪一間。

（下一步）第三，彼此要聯絡。社團組想知道社長的名字，但是學生資料在學籍組的檔案室，社團組不能自己去翻。

（下一步）第四，會被拖累。學籍組的電話沒人接，打電話的社團組也跟著卡住。

（下一步）第五，規定要同步。每個處室各有一份辦事規定，改一條要改很多份。

（下一步）所以微服務是一種交換：用「管理變複雜」，換「可以各自長大」。小團隊、小系統，用單體架構通常比較好。
-->

---

# 想一想

<Poll question="下面哪一種情況，最適合把系統拆成微服務？" options="剛開始的小專案，只有兩個人開發|使用者很多、功能很多，好幾個團隊各自負責一部分|想讓程式碼看起來比較厲害|資料庫只有三張表" answer="2" />

<!--
來想一題。

下面哪一種情況，最適合把系統拆成微服務？

（等大家作答）

（下一步）答案是第二個：使用者很多、功能很多，好幾個團隊各自負責一部分。

微服務解決的是「太大」造成的問題。系統不大的時候，拆開只會多出剛才那五個麻煩，得不到好處。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 學校怎麼解決這些麻煩

<!--
來看學校怎麼解決剛才的麻煩。
-->

---

# 通訊錄、服務台、內線電話

<Campus />

<!--
學校變大了，教務處拆成兩個獨立的處室：學籍組和社團組。各自有各自的檔案室。

（下一步）第一個辦法：一本處室通訊錄。每個處室開門的時候，先到通訊錄登記：我是誰，我在哪一間。之後搬家了，再登記一次就好。想找人的，一律查通訊錄。這解決了「找不到人」。

（下一步）第二個辦法：大門設一個服務台。同學不用知道哪個處室在哪裡，只找服務台。服務台查通訊錄，把人帶到對的處室。這解決了「入口太多」。

（下一步）第三個辦法：內線電話。社團組需要學生資料的時候，查通訊錄，打內線電話去問學籍組。這解決了「彼此要聯絡」。
-->

---

# 對照到程式

<Campus terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這些工具合起來叫做 <b>Spring Cloud</b>。它不是一個新的框架，而是一組搭配 Spring Boot 使用的工具，專門解決微服務的麻煩。
</div>

</v-click>

<!--
同一張圖，換成程式的名字。兩個處室是兩個服務：student-service 和 club-service。每個服務都是一個獨立的 Spring Boot 專案。

（下一步）通訊錄叫做 Eureka Server。上面記的不是幾號室，而是每個服務的名字，和它的網址。student-service 在 localhost 的 8081，club-service 在 8082。

（下一步）大門服務台叫做 Gateway，在 8080。它有一張對照表：/clubs 開頭的請求，轉給 club-service。

（下一步）內線電話叫做 OpenFeign。一個服務用它來呼叫另一個服務的 API。

（下一步）這些工具合起來叫做 Spring Cloud。它不是一個新的框架，而是一組搭配 Spring Boot 使用的工具，專門解決微服務的麻煩。
-->

---

# 整理：五個麻煩，五樣工具

<Pairs left="學校" right="Spring Cloud" rows="book,處室通訊錄=code,Eureka：服務註冊與發現|clerk,大門服務台=code,Gateway：統一入口|you,內線電話=code,OpenFeign：服務之間互相呼叫|no,「暫停服務」的牌子=code,Resilience4j：熔斷器|form,統一公告欄=code,Config：集中管理設定" />

<!--
五個麻煩，各有一樣工具。

（下一步）處室通訊錄，是 Eureka。正式的說法是服務註冊與發現。

（下一步）大門服務台，是 Gateway，統一入口。

（下一步）內線電話，是 OpenFeign，服務之間互相呼叫。

（下一步）後面兩樣，剛才的圖裡沒有。「暫停服務」的牌子，是 Resilience4j 的熔斷器，解決「會被拖累」。

（下一步）統一公告欄，是 Config，集中管理設定，解決「規定要同步」。

今天前三樣會動手做。後兩樣用故事說明觀念。
-->

---

# 想一想

<Poll question="社團組搬到另一間辦公室了。同學和其他處室要怎麼找到它？" options="每個人都要背新的房間號碼|社團組到通訊錄重新登記，大家照樣查通訊錄|把所有處室的門牌都換掉|沒辦法，只能等它搬回來" answer="2" />

<!--
來想一題。

社團組搬到另一間辦公室了。同學和其他處室要怎麼找到它？

（等大家作答）

（下一步）答案是：社團組到通訊錄重新登記，大家照樣查通訊錄。

沒有人需要記房間號碼。大家只記「社團組」這個名字，位置交給通訊錄。在程式裡也一樣：服務之間只用名字互相稱呼，不寫死網址。
-->

---

# 今天要建立的四個專案

<v-clicks>

- `eureka-server`（8761）：通訊錄
- `student-service`（8081）：學籍組，提供學生資料
- `club-service`（8082）：社團組，需要向學籍組問資料
- `gateway`（8080）：大門服務台

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 四個都是<b>獨立的 Spring Boot 專案</b>，各自用 Spring Initializr 建立、各自用一個 IntelliJ 視窗打開、各自啟動。括號裡是每個專案使用的 Port，不能重複。
</div>

</v-click>

<!--
今天要建立四個專案。

（下一步）eureka-server，通訊錄。

（下一步）student-service，學籍組，提供學生資料。

（下一步）club-service，社團組。它需要向學籍組問資料。

（下一步）gateway，大門服務台。

（下一步）四個都是獨立的 Spring Boot 專案。各自用 Spring Initializr 建立，各自用一個 IntelliJ 視窗打開，各自啟動。括號裡的數字是每個專案使用的 Port。四個專案同時在同一台電腦上跑，所以 Port 不能重複。

為了專心看 Spring Cloud，今天的服務都不接資料庫，資料直接寫在程式裡。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
# 通訊錄：Eureka

<!--
先建立通訊錄。
-->

---

# 建立 eureka-server

到 start.spring.io 建立新專案：

<v-clicks>

- Artifact 填 `eureka-server`，其他和以前一樣（Gradle - Groovy、Java）
- Dependencies 只加一個：**Eureka Server**

</v-clicks>

<v-click>

`application.properties`：

```properties
spring.application.name=eureka-server
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

</v-click>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 後面兩行的意思是「我自己就是通訊錄，不用去別的通訊錄登記，也不用抄別人的通訊錄」。
</div>

</v-click>

<!--
到 start.spring.io 建立新專案，步驟和第三十九章一樣。

（下一步）Artifact 填 eureka-server。其他和以前一樣，Gradle - Groovy、Java。

（下一步）Dependencies 只加一個，搜尋 Eureka Server。Initializr 會自動幫我們選好搭配的 Spring Cloud 版本。

（下一步）下載、解壓縮、用 IntelliJ 打開之後，在 application.properties 寫四行。第一行是專案的名字。第二行 Port 用 8761，這是 Eureka 習慣用的號碼。

（下一步）後面兩行的意思是：我自己就是通訊錄，不用去別的通訊錄登記，也不用抄別人的通訊錄。沒有寫這兩行的話，啟動後會一直出現連線失敗的訊息。
-->

---

# 一個註解，通訊錄就開張了

打開啟動類別，加上 `@EnableEurekaServer`：

```java {2}
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

<v-clicks>

- 啟動之後，用瀏覽器打開 `http://localhost:8761`
- 會看到 Eureka 的管理畫面。中間的清單目前是空的：還沒有人來登記

</v-clicks>

<!--
打開專案裡原本就有的啟動類別，在 @SpringBootApplication 下面加一行 @EnableEurekaServer。這個專案不用再寫任何程式。

（下一步）啟動之後，用瀏覽器打開 localhost 8761。

（下一步）會看到 Eureka 的管理畫面。中間有一個清單，標題是 Instances currently registered with Eureka。目前是空的，因為還沒有人來登記。

這個專案請讓它一直開著。
-->

---

# 建立 student-service，到通訊錄登記

用 Initializr 建立第二個專案：

- Artifact 填 `student-service`
- Dependencies：**Spring Web**、**Eureka Discovery Client**、**Lombok**

```properties {1|2|3}
spring.application.name=student-service
server.port=8081
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

<v-clicks>

- `spring.application.name`：**登記在通訊錄上的名字**。別人就是用這個名字找我們
- `server.port`：這個服務自己的 Port
- 最後一行：通訊錄在哪裡

</v-clicks>

<!--
用 Initializr 建立第二個專案。Artifact 填 student-service。Dependencies 加三個：Spring Web、Eureka Discovery Client、Lombok。Eureka Discovery Client 的意思是：我要去通訊錄登記。

application.properties 寫三行。

（下一步）第一行，spring.application.name。以前這一行不太重要，今天它非常重要：它是登記在通訊錄上的名字。別人就是用這個名字找我們。

（下一步）第二行，這個服務自己的 Port，8081。

（下一步）第三行，通訊錄在哪裡。網址最後面的 /eureka/ 要記得寫。

只要有這個依賴和這三行設定，啟動的時候就會自動去登記。不用加任何註解。
-->

---

# student-service 的程式

```java
@Getter
@Setter
public class Student {
    private Integer id;
    private String name;
}
```

```java
@RestController
public class StudentController {

    @GetMapping("/students/{id}")
    public Student getStudent(@PathVariable("id") Integer id) {
        Student student = new Student();
        student.setId(id);
        student.setName("學生" + id + "號");
        return student;
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
🔍 啟動後先測 <code>GET http://localhost:8081/students/3</code>。再重新整理 <code>localhost:8761</code>，清單裡出現 <b>STUDENT-SERVICE</b>（可能要等半分鐘）。
</div>

</v-click>

<!--
student-service 的程式很簡單，都是學過的寫法。

一個 Student 類別，兩個欄位。

一個 StudentController，GET /students/{id}。今天不接資料庫，直接做一個假的學生回傳：名字是「學生幾號」。

（下一步）啟動之後，先用 Postman 測 localhost 8081 的 /students/3，確定服務本身是好的。然後回到瀏覽器，重新整理 localhost 8761。清單裡會出現 STUDENT-SERVICE，旁邊有它的位置。登記需要一點時間，沒看到的話等半分鐘再重新整理。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
# 內線電話：OpenFeign

<!--
接下來建立社團組，並且讓它打電話給學籍組。
-->

---

# 建立 club-service

用 Initializr 建立第三個專案：

- Artifact 填 `club-service`
- Dependencies：**Spring Web**、**Eureka Discovery Client**、**OpenFeign**、**Lombok**

```properties
spring.application.name=club-service
server.port=8082
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

<v-click>

要做的功能：`GET /clubs/{id}/leader`，回傳「這個社團的社長是誰」。

</v-click>

<v-click>

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-left">
⚠️ 社團組只知道社長的<b>學號</b>。社長的<b>名字</b>在學籍組那邊，要打內線去問。
</div>

</v-click>

<!--
用 Initializr 建立第三個專案。Artifact 填 club-service。Dependencies 比剛才多一個 OpenFeign。

設定檔和 student-service 幾乎一樣，只有名字和 Port 不同。

（下一步）這個服務要做的功能是：GET /clubs/{id}/leader，回傳這個社團的社長是誰。

（下一步）問題來了。社團組只知道社長的學號。社長的名字在學籍組那邊。微服務的規矩是：每個服務只能動自己的資料，不能去翻別人的檔案室。所以社團組要打內線電話去問學籍組。
-->

---

# 內線電話的寫法：一個介面

<CodeSteps>

```java {1|2|4-5}
@FeignClient(name = "student-service")
public interface StudentClient {

    @GetMapping("/students/{id}")
    Student getStudent(@PathVariable("id") Integer id);
}
```

- `@FeignClient`：這是一支內線電話。`name` 寫的是**通訊錄上的名字**，不是網址
- 它是一個 `interface`，只有方法的宣告，沒有內容
- 方法上面的寫法和 Controller 一樣：要打給對方的哪一個 API、回傳什麼

</CodeSteps>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 我們只描述「要打給誰、問什麼」。查通訊錄、發出 HTTP 請求、把回來的 JSON 變成物件，OpenFeign 都會自動完成。
</div>

</v-click>

<!--
內線電話的寫法，是一個介面。在 club-service 新增 StudentClient。

（下一步）@FeignClient，代表這是一支內線電話。name 寫的是 student-service，也就是通訊錄上的名字。不是網址，也沒有 Port。

（下一步）它是一個 interface，只有方法的宣告，沒有內容。和第二十六章的 JpaRepository 是同一種手法：我們只寫介面，實際的程式由框架產生。

（下一步）方法上面的寫法，和 Controller 一模一樣。@GetMapping 寫對方的 API 路徑，@PathVariable 寫參數，回傳型別是 Student。只是方向反過來：在 Controller，這些寫法的意思是「我提供這個 API」。在這裡，意思是「我要呼叫對方的這個 API」。

（下一步）我們只描述要打給誰、問什麼。查通訊錄、發出 HTTP 請求、把回來的 JSON 變成物件，OpenFeign 都會自動完成。
-->

---

# 開通電話，然後使用它

啟動類別加上 `@EnableFeignClients`：

```java {2}
@SpringBootApplication
@EnableFeignClients
public class ClubServiceApplication { … }
```

```java {4-5|9-10|11}
@RestController
public class ClubController {

    @Autowired
    private StudentClient studentClient;

    @GetMapping("/clubs/{id}/leader")
    public String getLeader(@PathVariable("id") Integer id) {
        Integer leaderId = 3;
        Student leader = studentClient.getStudent(leaderId);
        return "社團 " + id + " 的社長是：" + leader.getName();
    }
}
```

<!--
還有兩件事。

第一，啟動類別加上 @EnableFeignClients。意思是開通內線電話的功能。忘了加的話，啟動會失敗，訊息是找不到 StudentClient 這顆 Bean。

第二，寫 ClubController。

（下一步）用 @Autowired 拿到 StudentClient。

（下一步）在方法裡，社長的學號先寫死是 3。然後呼叫 studentClient.getStudent。這一行看起來像是呼叫自己專案裡的方法，實際上它發了一個 HTTP 請求到 student-service，等對方回覆。

（下一步）拿到學生之後，取出名字，組成一句話回傳。

另外，club-service 裡也要有一個 Student 類別，用來接對方回來的 JSON。內容和 student-service 的那個一樣，請複製一份過來。兩個專案是獨立的，不能共用類別。
-->

---

# 試試看

<v-clicks>

1. 確認 `eureka-server` 和 `student-service` 都開著，再啟動 `club-service`
2. `localhost:8761` 的清單出現 **CLUB-SERVICE**
3. `GET http://localhost:8082/clubs/1/leader` → 「社團 1 的社長是：學生3號」

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 「學生3號」這幾個字，是 <code>student-service</code> 產生的。<code>club-service</code> 的程式裡沒有寫 8081，它是到通訊錄查到位置的。
</div>

</v-click>

<!--
來試試看。

（下一步）第一步，確認 eureka-server 和 student-service 都開著，再啟動 club-service。

（下一步）第二步，重新整理 localhost 8761，清單出現 CLUB-SERVICE。

（下一步）第三步，用 Postman 送 GET localhost 8082 的 /clubs/1/leader。得到「社團 1 的社長是：學生3號」。如果剛啟動就測，可能會失敗一次，因為通訊錄還沒同步好。等半分鐘再試。

（下一步）「學生3號」這幾個字，是 student-service 產生的。請注意 club-service 的程式裡，完全沒有寫 8081。它是到通訊錄查到位置的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
# 大門服務台：Gateway

<!--
現在前端要記兩個位置：8081 和 8082。服務越多，要記的越多。來建立大門服務台。
-->

---

# 建立 gateway

用 Initializr 建立第四個專案：

- Artifact 填 `gateway`
- Dependencies：**Reactive Gateway**、**Eureka Discovery Client**

<CodeSteps>

```properties {1-3|4-6|7-9}
spring.application.name=gateway
server.port=8080
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
spring.cloud.gateway.server.webflux.routes[0].id=student-service
spring.cloud.gateway.server.webflux.routes[0].uri=lb://student-service
spring.cloud.gateway.server.webflux.routes[0].predicates[0]=Path=/students/**
spring.cloud.gateway.server.webflux.routes[1].id=club-service
spring.cloud.gateway.server.webflux.routes[1].uri=lb://club-service
spring.cloud.gateway.server.webflux.routes[1].predicates[0]=Path=/clubs/**
```

- 前三行和其他服務一樣。服務台自己也要查通訊錄，所以也要登記
- 第一條路線：路徑是 `/students/**` 的請求，轉給 `student-service`
- 第二條路線：路徑是 `/clubs/**` 的請求，轉給 `club-service`

</CodeSteps>

<!--
用 Initializr 建立第四個專案。Artifact 填 gateway。Dependencies 加兩個：Reactive Gateway 和 Eureka Discovery Client。搜尋 gateway 會出現兩個選項，請選 Reactive Gateway。這個專案不用加 Spring Web。

這個專案一行 Java 都不用寫，全部靠設定。設定比較長，請照著打。

（下一步）前三行和其他服務一樣。Port 用 8080。服務台自己也要查通訊錄，所以也要登記。

（下一步）接下來三行是第一條路線。routes 後面的中括號 0，代表第一條。id 是這條路線的名字，自己取。uri 是要轉去哪裡。predicates 是條件：路徑是 /students 開頭的請求，就走這一條。

（下一步）再三行是第二條路線，中括號 1。/clubs 開頭的請求，轉給 club-service。
-->

---

# lb:// 是什麼

```properties
spring.cloud.gateway.server.webflux.routes[0].uri=lb://student-service
```

<v-clicks>

- `lb://` 後面接的是**通訊錄上的名字**，不是網址
- 服務台收到請求，會先查通訊錄，找到 `student-service` 現在的位置，再轉過去
- `lb` 是 Load Balance（負載平衡）的縮寫：如果同一個服務開了好幾台，會**輪流**分配

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這就是「選課很忙，只幫課務組加人」的做法：同一個服務多開幾台，都登記同一個名字，服務台會自動把人分散過去。
</div>

</v-click>

<!--
設定裡有一個新的寫法：lb 冒號兩條斜線。

（下一步）它後面接的是通訊錄上的名字，不是網址。

（下一步）服務台收到請求，會先查通訊錄，找到 student-service 現在的位置，再把請求轉過去。

（下一步）lb 是 Load Balance 的縮寫，中文是負載平衡。如果同一個服務開了好幾台，服務台會輪流分配，不會全部擠到同一台。

（下一步）這就是故事裡「選課很忙，只幫課務組加人」的做法。同一個服務多開幾台，都登記同一個名字。服務台會自動把人分散過去，前端完全不用改。
-->

---

# 從大門進來試試看

啟動 `gateway`，等它出現在通訊錄之後：

<v-clicks>

- `GET http://localhost:8080/students/3` → 學生資料（實際上是 8081 回的）
- `GET http://localhost:8080/clubs/1/leader` → 「社團 1 的社長是：學生3號」（實際上是 8082 回的）
- 前端從現在開始，**只需要知道 8080**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 啟動順序：先開 <code>eureka-server</code>，再開其他服務。全部開好之後等半分鐘，讓大家都拿到最新的通訊錄。
</div>

</v-click>

<!--
啟動 gateway，等它也出現在通訊錄之後，從大門進來試試看。

（下一步）GET localhost 8080 的 /students/3。得到學生資料。我們打的是 8080，實際上是 8081 的 student-service 回的。

（下一步）GET localhost 8080 的 /clubs/1/leader。得到社長的名字。這一個請求經過了三個服務：服務台轉給社團組，社團組再打內線問學籍組。

（下一步）前端從現在開始，只需要知道 8080 這一個位置。後面有幾個服務、各自在哪裡，前端都不用管。

（下一步）提醒一下啟動順序。先開 eureka-server，再開其他服務。全部開好之後等半分鐘，讓大家都拿到最新的通訊錄。剛開好就測，很容易遇到找不到服務的錯誤。
-->

---

# 整個過程走一次

<Flow nodes="前端:Tom|Gateway:服務台 8080|club-service:社團組 8082|student-service:學籍組 8081" steps="1>2:GET /clubs/1/leader|2>3:查通訊錄，轉給 club-service|3>4:OpenFeign：GET /students/3|4>3:{ id: 3, name: 學生3號 }|3>2:社團 1 的社長是：學生3號|2>1:200" />

<!--
把整個過程走一次。

（下一步）Tom 向服務台送出 GET /clubs/1/leader。

（下一步）服務台看路徑是 /clubs 開頭，查通訊錄，轉給 club-service。

（下一步）club-service 需要社長的名字，用 OpenFeign 打內線給 student-service：GET /students/3。這裡也查了一次通訊錄。

（下一步）student-service 回覆學生的 JSON。

（下一步）club-service 組好一句話，回給服務台。

（下一步）服務台再回給 Tom。

Tom 只看到一個入口、一個回應。背後的分工，他完全不知道。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
# 觀念：暫停服務的牌子、統一公告欄

<!--
最後兩樣工具，今天只講觀念，不動手做。
-->

---

# 電話一直沒人接，怎麼辦

<Breaker />

<!--
先看「會被拖累」這個麻煩。

平常，社團組打內線給學籍組，都接得通。

（下一步）有一天學籍組出狀況，電話一直沒人接。每一通都要響很久才放棄。社團組的人全部卡在電話旁邊等，自己的工作也做不了。一個處室出問題，把別的處室也拖下水。

（下一步）學校的做法是：失敗太多次，就在電話上掛一張「暫停服務」的牌子。掛牌期間不再打電話，直接回覆一個備用答案，例如「社長的名字暫時查不到」。這樣社團組不用等，可以繼續做自己的事。

（下一步）過一段時間，試打幾通看看。接通了，就拿下牌子，恢復正常。還是不通，就繼續掛著，等一下再試。
-->

---

# 對照到程式：熔斷器

<Breaker terms />

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 這個機制叫做<b>熔斷器</b>（Circuit Breaker），名字來自家裡的電箱：電流太大時自動跳開，保護整間房子。Spring Cloud 用的工具叫 <b>Resilience4j</b>。
</div>

</v-click>

<!--
同一張圖，換成程式的名字。這三種狀態各有一個英文名字。

正常的時候叫 CLOSED，關閉。這個名字容易搞混：它說的是電路是接通的，電話照常打。

（下一步）電話開始沒人接的時候，狀態還是 CLOSED，但是會記錄失敗的次數。

（下一步）掛上牌子叫 OPEN，開啟。電路斷開，不打了，直接給備用答案。備用答案叫做 fallback。

（下一步）試試看的狀態叫 HALF_OPEN，半開。放幾通過去，看對方好了沒。

（下一步）這個機制叫做熔斷器，英文是 Circuit Breaker。名字來自家裡的電箱：電流太大的時候自動跳開，保護整間房子。Spring Cloud 用的工具叫 Resilience4j。
-->

---

# 補充：備用答案怎麼寫

`club-service` 加依賴 **Resilience4j**，設定檔加一行：

```properties
spring.cloud.openfeign.circuitbreaker.enabled=true
```

```java {1|3-11}
@FeignClient(name = "student-service", fallback = StudentClientFallback.class)
public interface StudentClient { … }

@Component
public class StudentClientFallback implements StudentClient {
    @Override
    public Student getStudent(Integer id) {
        Student student = new Student();
        student.setId(id);
        student.setName("（暫時查不到）");
        return student;
    }
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
🔍 把 <code>student-service</code> 關掉，再查社長：得到「社團 1 的社長是：（暫時查不到）」，而不是一個 500 的錯誤。
</div>

</v-click>

<!--
補充一下備用答案的寫法，有興趣的同學可以試試看。

在 club-service 的 build.gradle 加上 Resilience4j 的依賴，名稱是 spring-cloud-starter-circuitbreaker-resilience4j。設定檔加一行，把 OpenFeign 的熔斷功能打開。

（下一步）在 @FeignClient 多寫一個 fallback，指定備用答案由哪一個類別負責。

（下一步）新增 StudentClientFallback。它 implements StudentClient，也就是照著同一份介面，再寫一個版本。這個版本不打電話，直接回傳一個名字是「暫時查不到」的學生。

（下一步）測試的方法：把 student-service 關掉，再查社長。得到的是「社團 1 的社長是：暫時查不到」，而不是一個 500 的錯誤。學籍組掛了，社團組還是能回應。
-->

---

# 統一公告欄：Config

<v-clicks>

- 每個處室牆上都貼著一份辦事規定。上課時間改了，**每一間都要去換**
- 學校的做法：設一個**統一公告欄**。各處室開門時去抄一份，不再各自保管
- 改規定只改公告欄一個地方

</v-clicks>

<v-click>

<Pairs left="學校" right="程式" rows="form,各處室牆上的規定=code,每個服務自己的 application.properties|book,統一公告欄=code,Config Server（設定放在一個 Git 倉庫）|clerk,開門時去抄一份=code,服務啟動時向 Config Server 拿設定" />

</v-click>

<!--
最後一個麻煩：規定要同步。

（下一步）每個處室牆上都貼著一份辦事規定。上課時間改了，每一間都要去換。漏了一間，那一間就照舊的規定辦事。

（下一步）學校的做法是設一個統一公告欄。各處室開門的時候去抄一份，不再各自保管。

（下一步）改規定的時候，只改公告欄一個地方。

（下一步）對照到程式。各處室牆上的規定，是每個服務自己的 application.properties。統一公告欄，是 Config Server，它也是一個獨立的專案，設定通常放在一個 Git 倉庫裡。開門時去抄一份，是服務啟動的時候向 Config Server 拿設定。

服務只有兩三個的時候，還用不到它。服務有幾十個的時候，它就很重要了。今天先知道有這個工具。
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

# 練習 1：多一個處室

學校新增了課務組。請建立第五個專案 `course-service`：

<v-clicks>

1. Port 用 `8083`，到通訊錄登記
2. 提供 `GET /courses/{id}`，回傳一句話，例如「課程 5：Java 入門」
3. 在 `gateway` 加第三條路線，把 `/courses/**` 轉給它
4. 測試：`GET http://localhost:8080/courses/5`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：依賴和 <code>student-service</code> 一樣。Gateway 的第三條路線是 <code>routes[2]</code>。改完設定要重新啟動 <code>gateway</code>。
</div>

</v-click>

<!--
練習一。學校新增了課務組。請建立第五個專案 course-service。

（下一步）第一，Port 用 8083，到通訊錄登記。

（下一步）第二，提供 GET /courses/{id}，回傳一句話就好。

（下一步）第三，在 gateway 加第三條路線，把 /courses 開頭的請求轉給它。

（下一步）第四，從大門測試：GET localhost 8080 的 /courses/5。

（下一步）提示：依賴和 student-service 一樣。Gateway 的第三條路線，中括號裡是 2，因為是從 0 開始數的。改完設定要重新啟動 gateway。

請先暫停，自己試試看。
-->

---

# 練習 1：參考答案

`course-service` 的設定和程式：

```properties
spring.application.name=course-service
server.port=8083
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

```java
@RestController
public class CourseController {
    @GetMapping("/courses/{id}")
    public String getCourse(@PathVariable("id") Integer id) {
        return "課程 " + id + "：Java 入門";
    }
}
```

`gateway` 多三行：

```properties
spring.cloud.gateway.server.webflux.routes[2].id=course-service
spring.cloud.gateway.server.webflux.routes[2].uri=lb://course-service
spring.cloud.gateway.server.webflux.routes[2].predicates[0]=Path=/courses/**
```

<!--
參考答案。

course-service 的設定三行，名字和 Port 換掉就好。Controller 也很單純。

gateway 多三行，第三條路線。

這個練習想讓大家體會的是：新增一個服務，原本的 student-service 和 club-service 完全不用動、不用重新啟動。只有服務台多了一條路線。這就是微服務「各自長大」的好處。
-->

---

# 練習 2：再打一通內線

社團組想知道「全校有幾位學生」：

<v-clicks>

1. 在 `student-service` 新增 `GET /students`，回傳三位學生的 `List`
2. 在 `club-service` 的 `StudentClient` 加一個方法，對應這個 API
3. 在 `ClubController` 新增 `GET /clubs/student-count`，回傳「全校共有 3 位學生」
4. 從大門測試：`GET http://localhost:8080/clubs/student-count`

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 提示：<code>StudentClient</code> 的新方法回傳型別是 <code>List&lt;Student&gt;</code>；人數用 <code>size()</code>。
</div>

</v-click>

<!--
練習二。社團組想知道全校有幾位學生。

（下一步）第一，在 student-service 新增 GET /students，回傳三位學生的 List。

（下一步）第二，在 club-service 的 StudentClient 加一個方法，對應這個 API。

（下一步）第三，在 ClubController 新增 GET /clubs/student-count，回傳「全校共有幾位學生」。

（下一步）第四，從大門測試。

（下一步）提示：StudentClient 新方法的回傳型別是 List of Student。人數用 size()。

請先暫停，自己試試看。
-->

---

# 練習 2：參考答案

```java
// student-service：StudentController
@GetMapping("/students")
public List<Student> getStudents() {
    List<Student> students = new ArrayList<>();
    for (int i = 1; i <= 3; i++) {
        students.add(getStudent(i));
    }
    return students;
}
```

```java
// club-service：StudentClient
@GetMapping("/students")
List<Student> getStudents();

// club-service：ClubController
@GetMapping("/clubs/student-count")
public String getStudentCount() {
    return "全校共有 " + studentClient.getStudents().size() + " 位學生";
}
```

<!--
參考答案。

student-service 的 StudentController 加一個方法 GET /students。用 for 迴圈做三位學生，這裡直接呼叫同一個類別裡原本的 getStudent 方法來產生。

club-service 的 StudentClient 加一個方法。上面寫 @GetMapping /students，回傳 List of Student。

ClubController 加一個方法，呼叫 studentClient.getStudents()，用 size() 算人數。

兩個專案都要重新啟動。gateway 不用改，因為 /clubs 開頭的路線本來就有了。
-->

---

# 複習：學校對照表

<Pairs left="學校" right="程式" rows="shop,一個教務處包辦所有事=code,單體架構|cabinet,拆成各自獨立的處室=code,微服務|book,處室通訊錄=code,Eureka|clerk,大門服務台=code,Gateway（lb://服務名稱）|you,內線電話=code,OpenFeign（@FeignClient）|no,「暫停服務」的牌子=code,熔斷器（Resilience4j）" />

<!--
我們用一張圖複習今天的內容。

（下一步）一個教務處包辦所有事，是單體架構。

（下一步）拆成各自獨立的處室，是微服務。

（下一步）處室通訊錄，是 Eureka。

（下一步）大門服務台，是 Gateway，設定裡用 lb 加上服務名稱。

（下一步）內線電話，是 OpenFeign，寫一個 @FeignClient 的介面。

（下一步）「暫停服務」的牌子，是熔斷器，工具是 Resilience4j。
-->

---

# 章節總結

<v-clicks>

- **微服務**：把大系統拆成各自獨立的小服務；換來彈性，也換來管理的複雜度
- **Eureka**：服務啟動時登記自己的名字和位置；大家用**名字**互相找
- **OpenFeign**：寫一個介面，就能呼叫另一個服務的 API
- **Gateway**：前端只認一個入口，由它照路徑轉給對的服務
- **熔斷器**、**Config**：不被別人拖累、設定集中管理（今天先懂觀念）

</v-clicks>

<v-click>

「安全與微服務」單元到這裡結束。下一章是最後一章：把學過的東西組起來，做一個完整的專題。

</v-click>

<!--
最後整理今天的重點。

（依序按下一步）微服務是把大系統拆成各自獨立的小服務，換來彈性，也換來管理的複雜度。Eureka 讓服務在啟動時登記自己的名字和位置，大家用名字互相找。OpenFeign 讓我們寫一個介面，就能呼叫另一個服務的 API。Gateway 讓前端只認一個入口，由它照路徑轉給對的服務。熔斷器和 Config，一個讓服務不被別人拖累，一個讓設定集中管理，今天先懂觀念。

（最後一步）安全與微服務這個單元到這裡結束。第四十六章請了警衛，第四十七章換了通行證，今天把學校拆成了好幾個處室。下一章是最後一章：把學過的東西組起來，做一個完整的專題。
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
