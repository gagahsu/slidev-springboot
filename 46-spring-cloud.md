---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Cloud 微服務
routeAlias: ch46
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
大家好，歡迎來到 Spring Cloud 微服務這一章。

先問大家一個問題：我們現在寫的專案，是一個 Spring Boot 專案，還是好幾個？
如果答案是「一個」，很正常，前面 45 章我們都是在同一個 JVM 裡把 Controller、
Service、Repository、Security、Cache 通通疊在一起，這叫單體架構。
這章要做的事情，是把這個單體拆成好幾個各自獨立、各自部署的 Spring Boot 專案，
然後回答一個新問題：拆開之後，這些服務要怎麼互相找到彼此、互相講話？

生活化比喻：微服務不是什麼新技術魔法，比較像是公司從一人工作室，
變成有分工部門的公司。分工之後溝通成本一定會上升（要開會、要對窗口），
但換來的是每個部門可以各自成長、各自擴編，不會互相卡住。

這章是全景導覽，不是深潛，我們的重心放在「為什麼需要」，
真正動手寫的部分留到練習題，大家可以放鬆聽，不用怕記不住每一行設定。
-->

---
layout: default
---

# Outline

- **單體 vs 微服務** — 兩種架構的優缺點比較
- **微服務的挑戰** — 服務發現、負載平衡、設定管理、熔斷
- **Spring Cloud 是什麼** — 解決微服務問題的工具箱
- **Eureka** — 服務註冊與發現
- **Spring Cloud Gateway** — API 閘道器入口
- **OpenFeign** — 宣告式 HTTP 客戶端
- **Spring Cloud Config** — 集中式設定管理
- **Resilience4j Circuit Breaker** — 熔斷器保護機制

<!--
這張是今天的地圖，我們先掃過一遍，大家留意一個規律：
前兩項（單體 vs 微服務、四大挑戰）是「問題」，後面六項是「工具」。
先搞懂問題在哪，再看工具怎麼解，工具才不會感覺是憑空冒出來的東西。

先跟大家說一聲：最後會有一張總表，把六個工具收斂成一張表格加生活類比，
所以現在不用急著背細節，先建立印象就好，最後我們會一起整理。

之後每講完一個部分，我可能會回來指一下這張投影片，提醒大家現在走到哪裡了，
避免中間細節聽多了忘記大局。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 單體架構 vs 微服務架構

<!--
我們先從架構的演進說起，理解單體的痛點，才能真正感受到微服務解決了什麼問題。

先問大家：如果現在專案忽然多找十個工程師，大家一起改同一支 Controller，
會發生什麼事？（等大家講出「衝突」「部署互相卡」這種答案）
這就是單體架構在人多之後會遇到的天花板。

要先講清楚：單體不是反派角色。前面 45 章我們都在單體架構裡打基礎，
這是絕大多數專案合理的起點。微服務是「當單體撐不住的時候」才走的下一步，
不是一開始就要用的起手式，這個順序觀念很重要，我們接下來會反覆強調。
-->

---

# 單體架構（Monolith）

想像一間傳統餐廳：廚師、外場、收銀全都是同一批員工，在同一棟建築裡工作。

```
┌─────────────────────────────────────────────┐
│              單體應用程式                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  用戶模組  │  │  訂單模組  │  │  商品模組  │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│              共用同一個資料庫                   │
└─────────────────────────────────────────────┘
            一起部署、一起擴展
```

| 面向 | 說明 |
|------|------|
| 優點 | 開發簡單、部署容易、本地呼叫速度快 |
| 缺點 | 改一行程式碼需要重新部署整個應用 |

<!--
我們用一個生活比喻來理解單體：想像一間傳統餐廳，廚師、外場、收銀
全都是同一批員工，擠在同一棟建築裡工作。好處是溝通方便，
壞處是只要有人生病（某個模組出問題），整家店可能就得暫停營業。

延伸一下這個比喻：如果餐廳生意越做越大，變成連鎖集團，
卻還讓所有分店共用同一套廚房、同一批員工，會發生什麼事？
某一家分店的爐子壞了，結果全部分店都要停業——這就是單體在大型系統上
會撞到的天花板，「一起部署、一起擴展」聽起來省事，但代價是「一起遭殃」。

⚠️ 重點提醒：單體不是壞設計，是「還沒有規模到需要拆分」的正常狀態。
真的要判斷該不該拆，通常看這幾個訊號：部署一次要等很久、
某個模組流量暴增拖垮其他模組、團隊人數多到互相卡 code review。
-->

---

# 單體 vs 微服務：完整比較

| 面向 | 單體架構 | 微服務架構 |
|------|---------|-----------|
| 部署單位 | 整個應用一起部署 | 每個服務獨立部署 |
| 擴展方式 | 整體水平擴展 | 針對瓶頸服務單獨擴展 |
| 技術選型 | 統一技術棧 | 每服務可用不同技術 |
| 故障影響 | 一個模組出問題影響全局 | 故障隔離，影響範圍小 |
| 開發複雜度 | 較低（初期） | 較高（需要服務協調） |
| 維運複雜度 | 較低 | 需要 DevOps 成熟度 |
| 適合場景 | 新創早期、小型團隊 | 大型系統、多團隊協作 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>微服務不是銀彈。</b> 團隊規模小、業務不複雜時，單體反而更好維護。Amazon、Netflix 是先有了單體的痛點，才拆成微服務的。
</div>

<!--
這張表是今天最重要的觀念之一：「微服務比單體複雜，要先評估是否真的需要」，
不要因為流行就跟著用。

大家看「故障隔離」和「維運複雜度」這兩行，特別容易被誤解：
故障隔離不是自動發生的，是要靠後面 Part 8 教的熔斷器主動設計出來，
沒設計好，微服務照樣會雪崩，甚至比單體更慘。
維運複雜度上升，代表要有服務發現、集中式 log 這些基礎建設，
沒有這些配套，拆出來的微服務反而變成除錯地獄。

⚠️ 重點提醒（黃底那句）：Amazon、Netflix 是先有了幾百人團隊、
單體撐不住的痛點，才拆成微服務的，是先有「果」再拆的「因」。
如果我們只有 3 個人做新專案就直接上微服務，等於還沒長大先穿盔甲，
反而會被開發和除錯成本拖垮。留個問題給大家想：你會怎麼判斷
「現在」該不該把專案拆成微服務？
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 微服務帶來的四大挑戰

<!--
既然選擇了微服務，就要面對一系列新問題，而這些問題不是 Spring Boot 能解決的，
需要 Spring Cloud 這層工具箱出場。

先建立一個觀念：Spring Boot 負責「把一個服務寫好」，
Spring Cloud 負責「讓很多個服務活在一起」，兩者不是競爭關係，
Spring Cloud 是架在 Spring Boot 之上的一層。

想像一下：如果沒有 Spring Cloud，只靠 Spring Boot 硬幹微服務，
最直覺的做法是把 IP 和 port 寫死在設定檔裡。那如果服務的 IP 會變
（重啟、擴容、換機器），寫死的設定會發生什麼事？答案是馬上打不通。
這就是下一頁要講的第一個挑戰：服務發現。
-->

---

# 四大挑戰與解決方向

| 挑戰 | 問題描述 | 解決方向 |
|------|---------|---------|
| **服務發現** | 服務 A 要呼叫服務 B，該打哪個 IP？ | Eureka — 服務登記處 |
| **負載平衡** | 服務 B 有三個實例，請求要怎麼分配？ | Spring Cloud LoadBalancer |
| **設定管理** | 100 個服務各自有 properties，如何統一管理？ | Spring Cloud Config |
| **熔斷保護** | 服務 C 回應很慢，服務 A 一直等，執行緒耗盡怎麼辦？ | Resilience4j Circuit Breaker |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>雪崩效應（Cascade Failure）：</b> 一個慢服務導致所有上游服務執行緒耗盡，最終整個系統癱瘓。熔斷器就是為了防止這個問題。
</div>

<!--
四大挑戰記住這個結構就好：「問題 → 解決方向」，後面每個元件的介紹
都會對應回這裡的某個挑戰。

用一個小故事把四個挑戰串起來，感受它們是環環相扣的：
服務 A 要呼叫服務 B，第一個問題是「B 在哪」——這是服務發現；
B 有三個實例在跑，第二個問題是「打哪一個」——這是負載平衡；
這三個實例的資料庫密碼要改，第三個問題是「怎麼一次改完、不用重啟三台」——
這是設定管理；某天 B 的其中一個實例資料庫連線爆了、回應變慢，
第四個問題是「A 會不會被拖累到自己也掛掉」——這是熔斷保護。

💡 雪崩效應這個詞很重要，我們畫個時間軸：B 變慢 → A 呼叫 B 的執行緒
卡住等待 → A 的執行緒池被佔滿 → A 也開始無法處理其他請求 → 
呼叫 A 的服務跟著卡住……像骨牌一樣往上游傳染。這個畫面大家先記著，
Part 8 講熔斷器的時候會再回來解決它。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## Spring Cloud 是什麼？

<!--
現在我們知道問題在哪了，Spring Cloud 就是這些問題的解答工具箱。

「工具箱」這個詞很重要：Spring Cloud 不是一整包要全裝的框架，
是一堆子專案，各自負責一個挑戰，可以挑著用。不是每個微服務專案
都要六個元件全上，最小可行的組合通常是 Eureka 加 OpenFeign，
其他的是隨著系統長大再逐步加進去。

接下來 Part 4 到 Part 8，會按照「服務發現 → 統一入口 → 服務間呼叫 →
集中設定 → 熔斷保護」的順序，一個一個把工具箱打開來看，
這個順序不是隨便排的，是照著一個請求進來會依序碰到哪些元件的路徑走。
-->

---

# Spring Cloud：微服務的工具箱

| Spring Cloud 子專案 | 解決的問題 | 部署方式 |
|--------------------|----------|---------|
| **Eureka** | 服務註冊與發現 | ✅ 獨立專案（eureka-server） |
| **Spring Cloud LoadBalancer** | 客戶端負載平衡 | 📦 函式庫，加進各服務 |
| **Spring Cloud Gateway** | API 閘道器 | ✅ 獨立專案（api-gateway） |
| **OpenFeign** | 宣告式 HTTP 呼叫 | 📦 函式庫，加進需要呼叫其他服務的服務 |
| **Spring Cloud Config** | 集中式設定管理 | ✅ 獨立專案（config-server） |
| **Resilience4j** | 熔斷、重試、限流 | 📦 函式庫，加進各服務 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>版本對應：</b> Spring Cloud 2025.1.x（Oakwood）+ Spring Boot 4.x + JDK 17+。版本不匹配是最常見的踩坑來源。
</div>

<!--
這張表是全章的總綱，後面每個 Part 都會展開其中一行，我們先看整體。

「部署方式」這一欄是初學者最容易搞混的地方，一定要講清楚：
✅ 獨立專案的三個（Eureka、Gateway、Config）是另外開一個 Spring Boot 專案，
有自己的 build.gradle、自己的 main()、自己的 port，跟業務服務完全分開。
📦 函式庫的三個（LoadBalancer、OpenFeign、Resilience4j）不會單獨啟動，
是加進既有業務服務裡的依賴，跟著業務服務一起跑。

大家數數看：如果要做「三個業務服務 + 完整微服務基礎設施」，
總共要開幾個 Spring Boot 專案？答案是至少 6 個
（eureka-server、config-server、api-gateway + 3 個業務服務）。
這個數字通常會讓大家第一次真實感受到微服務的維運成本。

⚠️ 重點提醒：Spring Cloud 2025.1.x 對應 Spring Boot 4.x + JDK 17+，
版本不匹配是最常見的踩坑來源。我們這門課到目前為止用的都是 Spring Boot 4.x，
所以版本是銜接得上的，不用擔心，但之後自己開專案要對照官方相容表。
-->

---

# 微服務專案架構 Overview

```
外部請求
    │
    ▼
┌─────────────────────────────────────────────────┐
│  api-gateway（獨立專案，port 8080）               │
│  Spring Cloud Gateway + Eureka Client            │
└──────────────┬──────────────────────────────────┘
               │ 路由轉發（lb://）
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│ user-service│  │order-service│  ← 各業務服務（獨立專案）
│  port 8081  │  │  port 8082  │     Eureka Client
└─────────────┘  └──────┬──────┘     OpenFeign
                        │ Resilience4j
                        ▼
                 user-service

┌──────────────────────────────┐  ┌──────────────────────┐
│  eureka-server（port 8761）  │  │ config-server（8888） │
│  所有服務向此登記             │  │ 所有服務從此拉設定     │
└──────────────────────────────┘  └──────────────────────┘
```

<!--
這張圖是全章的骨架，我們一起走一遍完整的請求路徑，之後每個 Part
其實都是在放大這張圖裡的某一塊。

這章從頭到尾會建立五個全新的 Spring Boot 專案：eureka-server、
api-gateway、config-server 三個基礎設施，加上 user-service、
order-service 兩個業務服務。全部都是乾淨的新專案，用 Spring
Initializr 一個一個建立，不會動到大家前面章節寫的任何東西。

情境很單純：user-service 管使用者資料，order-service 管訂單資料，
但 order-service 查訂單明細時需要附上使用者名字，所以要跨服務
呼叫 user-service——這是微服務教學裡最經典的組合範例。

外部請求先打到 api-gateway（8080），這是唯一對外開放的入口，
前端、Postman、手機 App 都只需要記住這一個位址。
Gateway 查 Eureka，知道 user-service、order-service 各自的實際
IP:port，用 lb:// 做負載平衡轉發——這是 Part 5 的內容。
如果請求進了 order-service，而它需要用戶資料，就會透過 OpenFeign
用「服務名稱」呼叫 user-service，底層一樣經過 Eureka 解析位址——
這是 Part 6 的內容。這條呼叫外面還包了一層 Resilience4j，
如果 user-service 忽然變慢或掛掉，不會拖垮 order-service——這是 Part 8。
圖下方兩個獨立方塊，eureka-server 是所有服務的電話簿，
config-server 是所有服務的設定倉庫，都是基礎設施角色——這是 Part 4 和 Part 7。

講完這張圖，大家應該要能自己回答：如果我在瀏覽器打 api-gateway，
最後資料是怎麼繞一圈回來的？
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## Eureka：服務登記處

<div class="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left" style="max-width: 640px; margin-left: auto; margin-right: auto;">
💡 <b>先說明專案結構：</b> Eureka Server 和 Eureka Client 是<b>兩個完全獨立的 Spring Boot 專案</b>，不能塞在同一個專案裡。這章接下來會建立好幾個全新專案（eureka-server、user-service、order-service……），每一個都是各自獨立的 Spring Boot 專案，用 Spring Initializr 一個一個建。
</div>

<!--
在進細節之前，先講清楚一個很多人會誤會的地方：Eureka Server 和
Eureka Client 是兩個完全獨立的 Spring Boot 專案，不是同一包程式碼
裡加兩個依賴就好。接下來每個要建的服務都是全新、乾淨的專案，
互相之間不會共用程式碼，只透過網路呼叫溝通。這個結構觀念要先
建立好，不然後面看到「加依賴」的投影片會誤以為是加在同一個
專案裡就好。

Eureka 是 Netflix 開源、Spring Cloud 整合的服務發現元件，
分成 Server（登記處本身）和 Client（來登記的服務）兩個角色。

生活化比喻：Eureka Server 就像「公司總機的電話簿」，
Eureka Client 就是「每個部門打電話跟總機說：我在幾號分機、我是誰」。
之後任何人要找某個部門，不用知道分機號碼，只要跟總機報名字就好——
這個比喻等一下講 spring.application.name 的時候還會再用到。

補充一個業界背景：Eureka 最早是 Netflix 自己拿來管理海量微服務用的，
後來捐給開源社群。Netflix 現在已經不主動開發 Eureka 2.0 了，
但 Eureka 1.x 仍然穩定、被廣泛使用，Spring Cloud 社群持續維護整合層，
拿來教學和中小型專案完全沒問題，大家不用擔心它是不是過時了。
-->

---

# Eureka Server（1/3）：用 Spring Initializr 建立專案

**在 [start.spring.io](https://start.spring.io) 建立一個全新專案：**

| 設定項 | 選擇 |
|------|------|
| Project | Gradle - Groovy |
| Spring Boot | 4.1.x |
| **Artifact** | **`eureka-server`** |
| Java | 17 |
| Dependencies | **Eureka Server**（Spring Cloud Discovery 分類底下） |

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Initializr 會自動幫這個專案的 <code>build.gradle</code> 加好 <code>spring-cloud-starter-netflix-eureka-server</code> 依賴，也會依照你選的 Spring Boot 版本，自動配上相容的 Spring Cloud BOM，不用自己手動寫版本號。
</div>

<!--
我們來看範例：這段的目的是建立一個獨立的 Spring Boot 專案，
專門當「電話簿」用。這裡改用 Spring Initializr，而不是手動編輯
build.gradle——好處是 Initializr 知道你選的 Spring Boot 版本，
會自動幫你配上相容的 Spring Cloud BOM 版本，不用自己猜版號、
也不用手動寫 dependencyManagement 那段，少一個踩坑點。

操作示範：打開 start.spring.io，選 Gradle - Groovy、Java、
Spring Boot 4.1.x、Java 17，Artifact 欄位填 eureka-server，
在 Dependencies 搜尋欄打 Eureka，勾選 Eureka Server，
按 Generate 下載解壓，或直接用 IDE（IntelliJ 有內建 Spring
Initializr 精靈）建立。

專案建好之後，下一頁我們先把設定檔寫好，最後才加 annotation 啟用。
-->

---

# Eureka Server（2/3）：加上設定檔

```properties
server.port=8761
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
eureka.instance.hostname=localhost
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>常見錯誤：</b> 忘記設定 <code>register-with-eureka: false</code> 和 <code>fetch-registry: false</code>，Server 會試著向自己註冊，產生大量錯誤訊息。
</div>

<!--
這頁是 Eureka Server 的設定檔，帶大家看關鍵的兩行：
register-with-eureka: false 和 fetch-registry: false。

順便提醒一下：spring.application.name 不用手動加，Spring Initializr
新版預設就會在 application.properties 裡自動寫好
spring.application.name=eureka-server，跟 Artifact 名稱一致，
少一行要打的設定。

為什麼要先設定、再啟用 annotation？因為 Eureka Server 本身也內建了
一份 Eureka Client 的邏輯，如果不關掉，它啟動時會覺得「我是不是也該
去登記我自己」，對著自己的 8761 port 發送註冊請求，這時候 Server
還沒完全啟動好，就會在 log 裡看到一堆 connection refused 的重試訊息。
先把這兩行設定好，下一頁加 annotation 啟動時才不會噴一堆錯誤訊息。

⚠️ 易錯點提醒：這兩行是新手最容易忘記加的設定，忘記加不會讓服務壞掉
（服務其實還是能正常運作），但 log 會很吵。順便機會教育一下：
看到 log 出現紅字不用馬上慌，先判斷「有沒有真的影響功能」，
但正式環境還是建議設定好，保持 log 乾淨。
-->

---

# Eureka Server（3/3）：啟用 Server

**啟動類加上 `@EnableEurekaServer`：**

```java
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
```

> 啟動後開啟 `http://localhost:8761` 即可看到 Eureka Dashboard。

<!--
依賴、設定檔都到位之後，最後一步才加 annotation，帶大家看關鍵行：
跟前面 45 章寫的 @SpringBootApplication 是同一種東西，只是這個專案
唯一的工作是當電話簿，不寫任何業務邏輯——沒有 Controller 處理訂單、
沒有 Repository 存商品，乾乾淨淨加一個 @EnableEurekaServer 就好。

⚠️ 如果加了這個 annotation 還是編譯不過、或找不到符號，
先回頭確認第一頁的依賴是不是真的被 Gradle 解析到了（sync 有沒有報錯、
External Libraries 裡看得到 eureka-server 的 jar 嗎），
這通常才是 @EnableEurekaServer 用不了的真正原因，不是 annotation 本身的問題。

預期結果：啟動後開 http://localhost:8761，會看到 Eureka Dashboard，
上面有個 "Instances currently registered with Eureka" 區塊，
之後練習一做完，成功與否就是看這個區塊有沒有出現 USER-SERVICE、
ORDER-SERVICE，這是一個很有成就感的畫面回饋。
-->

---

# Eureka Client（1/2）：用 Spring Initializr 建立業務服務

**這章要建立兩個業務服務，各自跑一次 Initializr（以 order-service 為例）：**

| 設定項 | 選擇 |
|------|------|
| Project | Gradle - Groovy |
| Spring Boot | 4.1.x |
| **Artifact** | **`order-service`**（另一個服務就填 `user-service`） |
| Java | 17 |
| Dependencies | **Eureka Discovery Client**、**Spring Web** |

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 兩個業務服務要各自跑一次 Initializr、各自下載成獨立的資料夾，Artifact 分別填 <code>user-service</code>、<code>order-service</code>，跟前面 eureka-server 完全一樣的流程，只是勾的依賴不同。
</div>

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 這裡一定要記得多勾 <b>Spring Web</b>。eureka-server 自己會帶 <code>spring-boot-starter-web</code>，但業務服務不會自動有——之後這兩個服務都要寫 <code>@RestController</code>，OpenFeign 內部也需要 HTTP 訊息轉換器，沒加 Spring Web 會在啟動時噴 <code>ClassNotFoundException</code>。
</div>

<!--
這頁範例的目的是讓一個業務服務自己去 Eureka 報到。跟上一頁
eureka-server 完全同一套流程，一樣用 Spring Initializr，
Dependencies 搜尋 Eureka，勾選 Eureka Discovery Client，
Initializr 一樣會自動幫忙配好 BOM。

這章要建兩個業務服務——user-service 和 order-service，各自跑一次
Initializr，Artifact 分別填對應的名字。這裡先用 order-service
示範一次完整流程，user-service 照同樣的步驟做一次即可，練習一
會讓大家兩個都動手建一次。

⚠️ 這裡務必強調 Spring Web 這個依賴不能漏。eureka-server 因為要跑
Dashboard 網頁，starter 本身就帶了 spring-boot-starter-web，但
Eureka Discovery Client 這個依賴不會自動帶進來——業務服務通常都要
寫 @RestController 對外提供 API，OpenFeign 底層也依賴 HTTP 訊息
轉換器（HttpMessageConverters）才能運作，這些都來自 spring-web。
漏勾這個依賴，最常見的症狀是啟動時噴一串 ClassNotFoundException，
錯誤訊息通常會指向某個 spring-boot-autoconfigure 底下的 http
converter 相關 class，第一次遇到很難聯想到「原來是少了 Spring Web」，
先在這裡把依賴補齊，後面才不會卡在這個問題上。

依賴確定抓得到之後，下一頁我們加設定檔，讓這個服務知道要向哪個
Eureka Server 報到、要用什麼名字報到。
-->

---

# Eureka Client（2/2）：設定檔指定服務名稱

**`order-service` 的 `application.properties`：**

```properties
server.port=8082
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

**`user-service` 的 `application.properties`：**

```properties
server.port=8081
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>spring.application.name</code> 非常關鍵——這就是服務的「身份證名字」，其他服務呼叫你時用的就是這個名字，不是 IP。跟前面 Eureka Server 一樣，Initializr 已經依 Artifact 自動幫兩個專案寫好這行，不用手動加。Spring Boot 3.x / 4.x 也不需要 @EnableEurekaClient。
</div>

<!--
這頁分別列出兩個業務服務的設定檔，port 不一樣（8081 / 8082），
其餘設定一樣。spring.application.name 這行沒寫在程式碼裡，
是因為 Initializr 已經依 Artifact（order-service / user-service）
自動產生好了，這是回收前面 Eureka Server 那頁講過的邏輯。

這就是回收剛剛「總機報名字」的比喻——這個欄位就是分機打給總機時報的名字，
非常關鍵，因為其他服務呼叫你時，用的就是這個名字，不是 IP。雖然這頁
沒有秀出這行程式碼，但概念還是要講清楚，因為之後 Gateway、OpenFeign
都要靠這個名字去找對應的服務。

⚠️ 易錯點提醒：如果兩個服務不小心設成同一個名字，Eureka 會把它們當成
「同一個服務的兩個實例」，流量會在它們之間分流。這在正式環境是刻意用來
做水平擴展的機制，但如果是不小心撞名，就會變成兩個不同服務互搶流量，
是新手常見的踩坑點。由於現在是 Initializr 自動生成，撞名的機率變低了
（因為對應到 Artifact，不太會手滑打錯），但如果之後手動改設定檔，
還是要注意這一點。

也順便解釋一下：Spring Boot 3.x / 4.x 不需要 @EnableEurekaClient，
只要 classpath 上看得到 eureka-client 的依賴，Spring Boot 就會自動裝配好，
這跟這幾年「約定優於設定」的走向是一致的，不用像 Eureka Server
那樣還要另外加 annotation。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## Spring Cloud Gateway：統一入口

<!--
有了服務發現之後，換個問題：外部用戶端要怎麼知道該打哪個服務？
不可能讓前端直接知道所有微服務的 port，這就是 API Gateway 要解決的問題。

先做個對比：Eureka 解決的是「服務跟服務之間」怎麼互相找到彼此，
但外部使用者（前端、手機 App）不應該、也不會去讀 Eureka，
他們只知道一個固定網址。Gateway 就站在 Eureka 前面，
把內部拓樸的複雜度擋住，對外只留一個乾淨的入口。

想像一個現實情境：如果沒有 Gateway，前端要嘛得知道 user-service 在 8081、
order-service 在 8082，要嘛每個服務都要各自處理 CORS、認證這些重複的事情，
Gateway 讓這些橫切關注點集中處理一次就好（這裡我們只講路由，
CORS、認證留給大家有興趣自己延伸閱讀）。
-->

---

# Spring Cloud Gateway（1/2）：又是一個獨立專案

**在 [start.spring.io](https://start.spring.io) 建立一個全新專案：**

| 設定項 | 選擇 |
|------|------|
| Project | Gradle - Groovy |
| Spring Boot | 4.1.x |
| **Artifact** | **`api-gateway`** |
| Java | 17 |
| Dependencies | **Reactive Gateway**、**Eureka Discovery Client** |

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 搜尋 gateway 有兩個選項，別選錯——一定要選 <b>Reactive Gateway</b>，不是 Gateway。
</div>

<!--
生活化比喻：Gateway 就像連鎖集團的「總客服窗口」，不管你要找哪個部門，
都先來這裡，由它幫你轉接到正確的地方，前端只需要記住一個位址。

先講清楚結構：這是又一個獨立的 Spring Boot 專案，跟前面的
eureka-server 一樣要另外開，不要塞進業務服務，一樣用 Spring Initializr
建立，Artifact 填 api-gateway。Dependencies 要勾兩個：Reactive
Gateway，還有 Eureka Discovery Client——Gateway 要靠 Eureka
Discovery Client 才能去問 Eureka「這個服務名稱對應的實例在哪」，
沒勾這個，下一頁的 lb:// 就無法運作，兩個都不能漏。

⚠️ 特別提醒：Initializr 搜尋 gateway 會跳出兩個長得很像的選項——
「Gateway」跟「Reactive Gateway」。前者是 Servlet-based 版本，
對應的依賴是 spring-cloud-starter-gateway-server-webmvc；後者才是
reactive 版本，對應 spring-cloud-starter-gateway-server-webflux。
這門課下一頁教的路由設定，property key 開頭是
spring.cloud.gateway.server.webflux.*，一定要選 Reactive Gateway，
選錯成普通的 Gateway，key 前綴會變成 server.webmvc，整組設定
會完全對不上、路由失效，是很多人第一次用 Initializr 建 Gateway
時會踩的坑。

專案建好之後，下一頁我們設定實際的路由規則。
-->

---

# Spring Cloud Gateway（2/2）：路由設定

**application.properties 路由設定：**

```properties
spring.cloud.gateway.server.webflux.routes[0].id=order-service
spring.cloud.gateway.server.webflux.routes[0].uri=lb://order-service
spring.cloud.gateway.server.webflux.routes[0].predicates[0]=Path=/orders/**
spring.cloud.gateway.server.webflux.routes[1].id=user-service
spring.cloud.gateway.server.webflux.routes[1].uri=lb://user-service
spring.cloud.gateway.server.webflux.routes[1].predicates[0]=Path=/users/**
```

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ Spring Cloud 2025.x 起，舊的 <code>spring.cloud.gateway.routes</code> 前綴已棄用，改為 <code>spring.cloud.gateway.server.webflux.*</code>。
</div>

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>lb:// 前綴：</b> 告訴 Gateway 去 Eureka 找這個服務名稱對應的實例，並做負載平衡。不需要寫死 IP。
</div>

<!--
範例目的：設定一條路由，把外部請求依 URL 路徑轉發到對應的服務。
帶大家看關鍵的三個部分：
id 是這條路由的名字，純粹給人看、給 log 追蹤用；
uri（lb://order-service）是目的地，lb 前綴告訴 Gateway 別直接打這個位址，
去 Eureka 查 order-service 有哪些實例，再做負載平衡；
predicates（Path=/orders/**）是判斷條件，符合什麼 URL 才走這條路由，
可以類比成前面章節寫過的 @RequestMapping 路徑比對。第二條路由同樣的
邏輯轉發給 user-service。

⚠️ 易錯點提醒：這裡的路徑要對到 order-service、user-service
Controller 真正的路徑（/orders/**、/users/**），不是隨便自己取一個
前綴——如果 predicate 寫的路徑跟 Controller 的 @GetMapping 對不起來，
Gateway 會直接回 404，因為它根本不知道要轉發給誰。

⚠️ 易錯點提醒：uri 如果寫死成 http://localhost:8082，就完全喪失了
服務發現的意義，lb:// 這個前綴不能省略，也不能換成 http://。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
## OpenFeign：讓服務間呼叫像本地方法一樣

<!--
微服務之間互相呼叫是很常見的場景，下一頁會用一個具體情境
（order-service 查訂單要附上使用者名字）帶大家理解為什麼需要
OpenFeign，這裡先簡單破題就好，細節留到下一頁講。
-->

---

# OpenFeign（1/5）：為什麼需要它？

**情境：`order-service` 查訂單明細時，要附上下單者的名字，但使用者資料放在另一個服務 `user-service` 裡。**

```
order-service                       user-service
    │                                   │
    │   查訂單 #1，需要下單者名字          │
    │   ── GET /users/{id} ──────────▶  │
    │                                   │
    │  ◀───── { id, name, email } ───── │
    │   組成 OrderDetail 回傳            │
```

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 order-service 自己的資料庫沒有使用者資料，唯一辦法是發 HTTP 請求去 user-service 要。手動用 RestTemplate / WebClient 也做得到，但要自己組 URL、處理序列化；OpenFeign 讓這件事變成宣告式，看起來就像呼叫本地方法。
</div>

<!--
在看程式碼之前，先把「為什麼需要 OpenFeign」講清楚，不然學生只會看到
一堆 annotation，不知道這是要幹嘛。

情境很單純：order-service 要查「訂單明細」，這個明細需要附上下單者
的名字，但使用者資料住在另一個服務 user-service 裡，不在
order-service 自己的資料庫裡。order-service 沒有別的辦法，只能
發一個 HTTP 請求去問 user-service：「這個 userId 對應的名字是什麼」。

先問問大家：如果沒有 OpenFeign，要怎麼做這件事？
（通常會有人提到 RestTemplate 或 WebClient——手動組 URL 字串、
手動處理序列化跟例外，這些程式碼寫多了會很雷同、很囉唆。）

OpenFeign 的核心賣點就是「宣告式」：只要寫一個介面，描述「我要呼叫的
API 長什麼樣子」，Feign 會在背後自動生成實作，把方法呼叫轉成真正的
HTTP 請求，我們完全不用自己組 URL。這跟前面學過的 Spring Data JPA
Repository 介面思路是一樣的——都是「我們寫介面宣告意圖，框架幫我們
生成實作」，可以直接拿來類比，會比較好理解。

接下來三頁的順序：先加依賴 → 定義資料模型 → 定義 FeignClient 介面 →
在 Service 裡注入使用，一步一步把這個情境實作出來。
-->

---

# OpenFeign（2/5）：加入依賴

**回到 order-service 專案（前面 Part 4 用 Initializr 建立的那個），加這兩個依賴：**

```groovy
dependencies {
    implementation 'org.springframework.cloud:spring-cloud-starter-openfeign'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ OpenFeign 不是 Spring Boot 內建功能，一定要加 <code>spring-cloud-starter-openfeign</code>，<code>@FeignClient</code>、<code>@EnableFeignClients</code> 才 import 得到。另外因為 order-service 是這章 Part 4 才新建的乾淨專案，還沒加過 Lombok，後面要用到 <code>@RequiredArgsConstructor</code>，這裡要一併補上，不然編譯會直接失敗。
</div>

<!--
先講清楚：OpenFeign 也是要裝依賴才能用的，不是 Spring Boot 內建功能。
這是回到 order-service 這個專案，不是建立新專案——Part 4 已經用
Spring Initializr 建立過它、Artifact 填的是 order-service，
BOM 也已經匯入好了，這裡只是回來多加依賴。

⚠️ 特別提醒 Lombok：大家前面章節的大專案通常一開始就加過 Lombok，
但 order-service 是這章才新建的乾淨專案，Part 4 建立時只勾了
Eureka Discovery Client，沒有 Lombok。等一下最後一頁的 OrderService
會用到 @RequiredArgsConstructor，這個 annotation 是 Lombok 提供的，
沒加這個依賴會直接編譯錯誤，是很多人重建新專案時會忘記的地方。

依賴到位之後，下一頁我們先定義資料模型，再定義 FeignClient 介面。
-->

---

# OpenFeign（3/5）：資料模型

**`User.java`（Feign 拿到的回應要反序列化成這個型別）**

```java
public record User(Long id, String name, String email) {
}
```

**`OrderDetail.java`（組合訂單與使用者名字後，回傳給呼叫端的型別）**

```java
public record OrderDetail(Long orderId, String userName) {
}
```

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 這兩個型別都是不可變的資料載體，用 <code>record</code> 比 Lombok <code>@Data</code> 更精簡——一行就有建構子、欄位存取方法（<code>user.name()</code>，不是 <code>getName()</code>）、<code>equals</code>/<code>toString</code>，不用額外依賴。
</div>

<!--
在定義 FeignClient 之前，先把兩個資料模型準備好，這頁純粹是
資料載體，跟前面章節寫過的 Entity / DTO 是同樣的概念，只是這裡
不需要 JPA 的 @Entity，單純拿來裝資料。

User 對應的是 user-service 回傳的 JSON 結構（id、name、email），
Feign 收到 JSON 後就是用這個型別反序列化；OrderDetail 是
order-service 自己要回傳給呼叫端的型別，把 orderId 跟拿到的
user.name() 組合起來。

⚠️ 提醒一下：record 的存取方法沒有 get 前綴，是 user.name()、
user.email()，不是 user.getName()，這跟大家習慣的 Lombok/JavaBean
寫法不一樣，等一下第五頁的 OrderService 會看到這個寫法。

Jackson 反序列化 record 需要編譯時保留參數名稱（-parameters 編譯
選項），大家 build.gradle 裡的 compileJava 區塊如果已經有加這個
選項（前面章節設定過），這裡直接能用，不用再另外處理。

兩個型別準備好之後，下一頁定義真正的 FeignClient 介面。
-->

---

# OpenFeign（4/5）：定義與啟用

**① `UserClient.java`（在 order-service 中定義）**

```java
@FeignClient(name = "user-service")   // 對應 Eureka 上的服務名稱
public interface UserClient {
    @GetMapping("/users/{id}")
    User getUserById(@PathVariable("id") Long id);
}
```

**② `OrderServiceApplication.java`（啟用 Feign 掃描）**

```java
@SpringBootApplication
@EnableFeignClients   // 掃描所有 @FeignClient，註冊為 Spring Bean
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
```

<!--
這頁範例目的是定義一個 FeignClient，帶大家看關鍵行：
@FeignClient(name = "user-service")，這個 name 對應的是 Eureka 上的
spring.application.name，不是 IP。

回到 Part 6 開場講的情境：order-service 定義一個 UserClient 介面，
宣告「我要呼叫 user-service 的 GET /users/{id}」，之後就能像呼叫
本地方法一樣拿到上一頁定義的 User 物件。

大家注意一個很反直覺的地方：UserClient 只是一個 interface，
裡面的方法沒有寫任何實作內容。沒寫實作，怎麼會動？先賣個關子，
答案下一頁揭曉。

順便提一下：這裡的 @GetMapping 跟 Controller 上用的 @GetMapping
是同一個 annotation，只是方向反過來——Controller 上是「宣告我要接收
這個路徑的請求」，這裡是「宣告我要發送到這個路徑的請求」。

⚠️ 別忘了 OrderServiceApplication 這個啟動類要加 @EnableFeignClients，
這跟前面看過的 @EnableJpaRepositories 是同一個模式，告訴 Spring
去掃描所有標了 @FeignClient 的介面，逐一生成 Bean。
-->

---

# OpenFeign（5/5）：注入與使用

**③ `OrderService.java`（order-service 內部，注入 UserClient，直接呼叫）**

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserClient userClient;  // Spring 自動注入 Feign 產生的實作

    public OrderDetail getOrderDetail(Long orderId, Long userId) {
        User user = userClient.getUserById(userId);  // 實際發出 HTTP GET 到 user-service
        return new OrderDetail(orderId, user.name());
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>UserClient</code> 只是介面，Feign 在背後自動產生實作，把方法呼叫轉成 HTTP 請求，再透過 Eureka 找到 <code>user-service</code> 的實際位址。
</div>

<!--
這頁揭曉上一頁賣的關子：Feign 用的技術叫「動態代理」，在執行期依照
介面的方法簽章，動態產生一個實作類別塞進 Spring 容器，所以我們注入拿到的
UserClient，其實是 Feign 生成的代理物件，不是我們自己寫的類別
（如果大家學過 Java 動態代理，或看過 MyBatis 的 Mapper 介面，可以直接類比）。

@RequiredArgsConstructor 這裡也回收一下前面補的 Lombok 依賴——
它會自動幫 final 欄位（userClient）產生建構子，Spring 用建構子注入
把 Feign 生成的代理物件塞進來，我們完全不用自己寫 constructor。

帶大家走一次完整呼叫鏈：OrderService 呼叫
userClient.getUserById(userId)（看起來像本地方法呼叫）
→ Feign 代理物件攔截，組出 GET /users/{id} 請求
→ 向 Eureka 查 user-service 有哪些實例 → LoadBalancer 選一個 →
真正發出 HTTP 請求 → 收到 JSON，反序列化成上一頁定義的 User 物件回傳。

💡 這整條路徑對呼叫者完全透明，它看到的就是一個普通方法呼叫，
這就是宣告式的威力，也是 Feign 這麼受歡迎的原因。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
## Spring Cloud Config：集中管理設定

<!--
想像一個情境：有 20 個微服務都要連同一個 Redis，某天 Redis 密碼因為
資安規定要輪替。如果設定分散在 20 個服務各自的 application.properties 裡，
就要改 20 個檔案、重新打包、重新部署 20 次——這在生產環境是噩夢。

Spring Cloud Config 的做法是把這些設定集中放進一個 Git 倉庫，
改一次 push 一次，所有服務下次拉取設定就自動同步，不用重新部署。

可以連結前面學過的設定檔切換概念（application-dev.properties、
application-prod.properties 用 profile 切換），Config Server 可以看成
把這個概念「跨服務、跨機器」放大版：不只是同一個服務切換環境，
是很多個服務共用一份集中管理的設定來源。
-->

---

# Spring Cloud Config：架構說明

**架構：** Config Server 從 Git 倉庫讀取設定，各服務從 Config Server 拉取自己的設定。

| 元件 | 角色 |
|------|------|
| Git 倉庫 | 存放所有服務的設定檔（order-service.properties、user-service.properties 等） |
| Config Server | 橋接 Git 倉庫與各微服務 |
| 各微服務（Config Client） | 從 Config Server 拉取自己的設定 |

<!--
這頁講架構：Config Server 從 Git 倉庫讀取設定，各服務再從 Config Server
拉取自己的設定。為什麼選 Git 而不是資料庫？因為 Git 天生就有版本紀錄、
有 diff，設定變更也能像程式碼一樣被追蹤「誰在什麼時候改了什麼」，
出問題甚至可以直接 revert 回上一版，這是把版本控制的紀律套用到設定上。

先講觀念、不看程式碼——大家看這張表，記住三個角色各自的職責：
Git 倉庫負責存放，Config Server 負責橋接，各微服務負責拉取。
下一頁我們才動手用 Spring Initializr 建立 Config Server 這個
獨立專案。
-->

---

# Spring Cloud Config：建立專案

**在 [start.spring.io](https://start.spring.io) 建立一個全新專案：**

| 設定項 | 選擇 |
|------|------|
| Project | Gradle - Groovy |
| Spring Boot | 4.1.x |
| **Artifact** | **`config-server`** |
| Java | 17 |
| Dependencies | **Config Server** |

<!--
範例目的：建一個獨立的 Config Server 專案，跟前面 eureka-server、
api-gateway 完全一樣的流程——用 Spring Initializr 建立，Artifact
填 config-server，Dependencies 搜尋 Config Server 勾選即可，
Initializr 一樣會幫我們配好對應的 spring-cloud-config-server
依賴和相容的 BOM 版本，不用自己手動加。

專案建好之後，下一頁我們加上 annotation 啟用它，再把 Git 倉庫和
Config Server 串起來。
-->

---

# Spring Cloud Config：完整使用流程（1/2）

**① 啟動類加上 `@EnableConfigServer`：**

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

**② Git 倉庫放設定檔**（`.properties` 格式，檔名 = 服務名稱）

```
config-repo/
├── order-service.properties   # order-service 專用設定
└── user-service.properties    # user-service 專用設定
```

<!--
帶大家看關鍵行：@EnableConfigServer——這跟前面看過的
@EnableEurekaServer 是同一個模式，一個獨立的 Spring Boot 專案，
加一個 annotation，就變成特化的基礎設施服務。大家會發現
Spring Cloud 的元件大多長這樣，抓到這個規律之後，
接下來看到新元件也比較好上手。

Git 倉庫的檔名約定也在這頁先看一次：「檔名 = 服務名稱」，
下一頁講 Config Server 自己的設定時會再細講這個約定怎麼運作。
-->

---

# Spring Cloud Config：完整使用流程（2/2）

**③ Config Server 的 `application.properties`**

```properties
server.port=8888
spring.cloud.config.server.git.uri=https://github.com/gagahsu/config-repo.git
```

**④ 各微服務（Config Client）的 `application.properties`**

```properties
spring.application.name=order-service
spring.config.import=optional:configserver:http://localhost:8888
```

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>運作原理：</b> 服務啟動時，先向 Config Server 拉取 <code>order-service.properties</code> 的內容，再繼續啟動。Git 設定更新後，呼叫 <code>/actuator/refresh</code> 即可動態重新載入，不需重啟。
</div>

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <code>optional:</code> 前綴表示 Config Server 不在線時服務仍可啟動（用本地設定），適合開發環境。
</div>

<!--
這頁的目的是把 Git 倉庫、Config Server、業務服務三者串起來，
帶大家看關鍵約定：「檔名 = 服務名稱」。Config Server 收到
order-service 的請求時，會去 Git 倉庫找 order-service.properties
這個檔案，就是純粹的字串比對，沒有魔法。

這也再一次呼應 spring.application.name 這個欄位有多關鍵——
它同時是 Eureka 上的身分證名字，也是 Config Server 對應設定檔的檔名，
一個欄位串起兩個元件，這是這章反覆出現的設計思路。

⚠️ 提醒一下：spring.cloud.config.server.git.uri 實務上通常會指向
公司內部的 Git，不會是公開的 GitHub repo，因為設定檔裡常有敏感資訊。

這頁是業務服務那邊的設定，帶大家看關鍵行 spring.config.import。

我們完整走一次啟動流程：order-service 啟動 → 讀到 spring.config.import
這行 → 先暫停，向 Config Server 發請求，帶上自己的名字 → Config Server
去 Git 倉庫找 order-service.properties → 把內容回傳 → order-service
把這份設定疊加到本地設定之上 → 才繼續完成剩下的啟動流程。

💡 /actuator/refresh 這個機制值得多說一句：它不是重啟服務，
是讓服務重新去 Config Server 拉一次最新設定，這就是為什麼可以做到
「改密碼不用重啟」——重啟和重新載入設定是兩件不同的事。

⚠️ optional: 前綴要解釋清楚：沒有這個前綴，Config Server 連不上時
order-service 會直接啟動失敗；加了之後，連不上就退回用本地設定繼續啟動，
本機開發很好用，但正式環境通常會拿掉，強制一定要拿到正確設定才能啟動。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 8
## Resilience4j Circuit Breaker：熔斷保護

<!--
還記得 Part 2 埋的伏筆嗎？B 變慢 → A 的執行緒被卡住 → A 也開始變慢 →
上游服務一路遭殃，這叫雪崩效應。Resilience4j 的 Circuit Breaker
就是專門為了解決這個問題設計的元件。

生活化比喻：熔斷器這個名字來自家裡的斷路器，電器短路的時候，
斷路器會跳開切斷電流，避免電線過熱燒起來——犧牲「這個迴路暫時沒電」，
換來「整棟房子不會失火」。軟體的熔斷器邏輯完全一樣：犧牲「這次呼叫
可能拿不到即時資料」，換來「呼叫方的執行緒不會被無限期卡住」。

先預告一下：這個保護機制分成三個狀態，不是開關二選一那麼簡單，
中間還有一個「半開」狀態負責試探恢復情況，下一頁會詳細看。
-->

---

# Resilience4j：加入依賴

**一樣回到 order-service 專案，多加一行依賴（BOM 在 Part 4 建立時已經匯入過了）：**

```groovy
dependencies {
    implementation 'org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j'
}
```

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 熔斷器不是 Spring Boot 內建功能，一定要加這個依賴，<code>@CircuitBreaker</code> 才 import 得到。
</div>

<!--
先回答一個大家常有的疑問：熔斷器是不是 Spring 自己判斷、不用裝東西？
不是。這是 Resilience4j 這個第三方函式庫提供的功能，Spring Cloud
只是幫忙包一層 starter 讓它跟 Spring Boot 整合，一定要加這個依賴，
不加的話 @CircuitBreaker 這個 annotation 根本不存在，import 就會紅字。

這裡跟前面 OpenFeign 一樣，是回到 order-service 這個 Part 4 已經
用 Initializr 建立好的專案，單純多加一行依賴，BOM 已經有了，
不用重複匯入。如果大家是在自己既有的、不是這章 Initializr 建立的
專案上做練習，才需要回頭確認 BOM 有沒有補上。

依賴加好之後，下一頁我們看它實際運作的原理。
-->

---

# 熔斷器運作原理

`@CircuitBreaker` 透過 **AOP 攔截**每一次方法呼叫，自動追蹤成功/失敗：

```
你呼叫 getOrderDetail()
         ↓
  Resilience4j 攔截
         ↓
     查當前狀態
    ┌─────┴──────┐
  Closed        Open
    ↓              ↓
執行真實程式碼   直接呼叫 fallback()
userClient         不碰下游服務
  .getUserById()
    ↓
記錄結果（成功 or 失敗）
失敗率 > 50% → 切換成 Open
```

| 你負責 | Resilience4j 負責 |
|--------|-----------------|
| 寫業務方法 + fallback 方法 | 攔截呼叫、追蹤失敗率、切換狀態 |

<!--
關鍵概念：我們不需要手動判斷狀態，Resilience4j 全自動處理，
透過 AOP 在完全不知情的情況下攔截每一次方法呼叫。

這可以連結回前面學過的 @Transactional 或 Spring Security 攔截機制，
是同一套原理——Spring 在背後用動態代理包住方法，在執行前後插入額外邏輯，
業務程式碼完全不需要知道這件事發生了。@CircuitBreaker 也是這樣：
不是在程式碼裡插入 if-else 判斷狀態，是在方法外面包一層攔截，
getOrderDetail() 本身乾乾淨淨，這是關注點分離的好例子。

這張流程圖搭配下一頁的三狀態表一起看會更清楚。
「你負責 / Resilience4j 負責」這張對照表值得停下來看：
我們只要專心寫業務邏輯和一個說得過去的備案，統計失敗率、
判斷要不要跳開，全部交給框架。
-->

---

# 熔斷器三種狀態

| 狀態 | 行為 | 轉換條件 |
|------|------|---------|
| **Closed（關閉）** | 正常呼叫，記錄失敗率 | 失敗率超過閾值 → Open |
| **Open（開啟）** | 直接回傳錯誤，不呼叫下游 | 等待冷卻時間 → Half-Open |
| **Half-Open（半開）** | 允許少量請求試探 | 試探成功 → Closed；失敗 → Open |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>雪崩效應：</b> 沒有熔斷器時，下游服務變慢 → 上游執行緒全部卡住等待 → 整個系統癱瘓。Open 狀態直接回傳 fallback，不等待，保護上游。
</div>

<!--
生活化比喻：三個狀態可以搭配交通號誌來記，比純文字好記多了。
Closed（綠燈）：正常通行，背後默默記錄成功失敗次數。
Open（紅燈）：全部攔下來，不放任何請求過去下游，直接走 fallback。
Half-Open（黃燈）：小心翼翼放幾台車過去探路，看路況是不是真的通了。

⚠️ 易錯點提醒：Open 狀態不是永遠關閉，是先冷靜一段時間再重新評估。
如果永遠不重新評估，下游服務就算修好了，上游也會一直用 fallback，
就失去了熔斷器「保護但不放棄恢復」的精神。

這就是我們在 Part 2 埋的伏筆——雪崩效應，現在終於有工具解決它了。
-->

---

# 熔斷器：誰在判斷要不要跳開？

**Resilience4j 內部有一個「狀態機」，根據門檻值自動追蹤、自動切換，不是 Spring、也不是我們的程式碼在判斷：**

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>不設也能用：</b> 這組門檻值全部是可選的，Resilience4j 有內建預設值（sliding-window-size 預設 100、failure-rate-threshold 預設 50、wait-duration-in-open-state 預設 60s）。不寫的話就吃預設值，不會啟動失敗。
</div>

**如果想自己測試熔斷效果，可以調小數值，比較容易在課堂上短時間觸發：**

```properties
resilience4j.circuitbreaker.instances.userService.sliding-window-size=10
resilience4j.circuitbreaker.instances.userService.failure-rate-threshold=50
resilience4j.circuitbreaker.instances.userService.wait-duration-in-open-state=10s
resilience4j.circuitbreaker.instances.userService.permitted-number-of-calls-in-half-open-state=3
```

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <code>userService</code> 這個名字要跟 <code>@CircuitBreaker(name = "userService", ...)</code> 對上，Resilience4j 才知道這組門檻值是設給哪一個熔斷器用的。這組設定寫在 <b>order-service</b> 的 application.properties——order-service 是發起呼叫的那一方，user-service 完全不用知道這件事。
</div>

<!--
這頁補上前面漏掉的一塊拼圖：到底是誰在算「失敗率有沒有超過 50%」、
誰決定要不要跳到 Open？答案不是 Spring，也不是我們自己寫的程式碼，
是 Resilience4j 函式庫內部維護的一個狀態機（CircuitBreakerStateMachine），
它會根據門檻值，自動記錄每次呼叫的成功失敗，自動判斷、自動切換狀態，
全程我們看不到、也不用手動介入。

⚠️ 先講清楚一個常見誤解：這組設定不是必填的。Resilience4j 本身有
一整套內建預設值——sliding-window-size 預設看最近 100 次呼叫、
minimum-number-of-calls 預設要湊滿 100 次才開始評估、
failure-rate-threshold 預設 50%、wait-duration-in-open-state
預設冷卻 60 秒、permitted-number-of-calls-in-half-open-state
預設放行 10 次試探。不寫這頁的任何一行，@CircuitBreaker 一樣能動，
只是用預設門檻。

投影片這組數字（sliding-window-size 從 100 降到 10、
wait-duration-in-open-state 從 60s 降到 10s）是刻意調小，純粹是
教學上想在課堂短時間內就看到熔斷器跳開，不用打 100 次請求、
等 60 秒才能驗證效果。實務上這個窗口大小要看真實流量規模來調，
流量小的服務通常會調低，不然永遠測不出熔斷有沒有生效；
流量大的服務反而希望窗口大一點，避免暫時性的抖動就誤判熔斷。

逐行解釋這四個設定：sliding-window-size=10 表示看「最近 10 次呼叫」
的結果來算失敗率；failure-rate-threshold=50 表示失敗率超過 50%
就跳到 Open；wait-duration-in-open-state=10s 表示 Open 狀態要
冷靜 10 秒才進入 Half-Open 試探；
permitted-number-of-calls-in-half-open-state=3 表示 Half-Open
只放行 3 次請求試探，這 3 次的結果決定要跳回 Closed 還是打回 Open。

⚠️ 重點提醒：這組設定的 key 是 userService，一定要跟下一頁
@CircuitBreaker(name = "userService", ...) 的 name 完全對上，
Resilience4j 才知道要用這組門檻值來管這個熔斷器，名字對不上，
Resilience4j 會用預設值，門檻可能不是你想要的。這組設定要寫在
「發起呼叫的那一方」——order-service 呼叫 user-service，
就寫在 order-service，user-service 完全不用知道這件事。
-->

---

# 熔斷器：狀態與程式碼的對應（1/3）

**直接在前面 OpenFeign 章節的 `OrderService` 上加 `@CircuitBreaker`：**

```java
@CircuitBreaker(name = "userService",
                fallbackMethod = "getOrderDetailFallback")
public OrderDetail getOrderDetail(Long orderId, Long userId) {
    // 這段本身不知道自己在 Closed 還是 Half-Open，只管正常呼叫下游
    User user = userClient.getUserById(userId);
    return new OrderDetail(orderId, user.name());
}

public OrderDetail getOrderDetailFallback(Long orderId, Long userId,
                                           Exception e) {
    // Open 狀態時，Resilience4j 直接跳過上面，改執行這裡
    return new OrderDetail(orderId, "未知用戶");
}
```

<!--
這頁直接在 OpenFeign 章節寫過的 OrderService.getOrderDetail() 上加
@CircuitBreaker，不用另外想新情境——大家已經知道這個方法在做什麼：
呼叫 userClient.getUserById() 取得使用者資料。現在幫它加上熔斷保護，
如果 user-service 忽然變慢或掛掉，不會拖累 order-service。

先強調一次：getOrderDetail() 和 getOrderDetailFallback() 這兩個方法
「本身」都不知道現在是什麼狀態、也不做任何判斷，判斷跟切換
全部是上一頁的 Resilience4j 狀態機在背後做的，這兩個方法只是
「狀態機決定執行誰之後」被呼叫到的兩個候選人。

帶大家看關鍵行：name = "userService" 是這個熔斷器的識別名稱，
要跟上一頁設定檔的 key 對上；fallbackMethod = "getOrderDetailFallback"
指定備案方法。同一個服務可以有多個熔斷器，各自對應不同的
name、各自獨立追蹤狀態（例如這裡查 user-service 一個，
之後如果還有查 payment-service 又是另一個）。

⚠️ 易錯點提醒：fallback 方法的簽章要跟原方法對齊——參數要一樣，
多一個 Exception 參數放在最後，這是新手很容易漏掉、導致啟動時噴錯的地方。

下一頁我們把這段程式碼對照回三種狀態各自執行哪段。
-->

---

# 熔斷器：狀態與程式碼的對應（2/3）

| 狀態 | 誰觸發 | 實際執行哪段 |
|------|--------|------------|
| Closed | 上一頁狀態機判定失敗率未超標 | `getOrderDetail()`，正常呼叫 user-service |
| Open | 狀態機判定失敗率超過門檻 | 直接跳到 `getOrderDetailFallback()`，`getOrderDetail()` 完全不會被呼叫 |
| Half-Open | 狀態機判定冷卻時間已到 | 一樣呼叫 `getOrderDetail()`，用結果決定跳回 Closed 或 Open |

<!--
這頁範例的目的是把上一頁的程式碼，對照回三種狀態各自執行哪段，
搭配前面「熔斷器三種狀態」那頁一起複習：Closed 正常跑、Open 直接
跳過真正邏輯改走 fallback、Half-Open 一樣呼叫真正邏輯只是拿結果
來試探要不要恢復。

下一頁我們討論 fallback 方法設計本身該注意什麼。
-->

---

# 熔斷器：fallback 該回傳什麼（3/3）

**這裡的範例回傳 `"未知用戶"`，是保守但合理的預設值：**

```java
public OrderDetail getOrderDetailFallback(Long orderId, Long userId,
                                           Exception e) {
    return new OrderDetail(orderId, "未知用戶");
}
```

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 「fallback 應該回傳什麼」沒有標準答案，取決於業務場景：查詢類 API 或許能回傳快取的舊資料；下單類 API 可能要直接告訴使用者稍後再試，而不是假裝成功。
</div>

<!--
fallback 方法設計的關鍵：這裡回傳「未知用戶」是保守但合理的
預設值，讓訂單明細還能顯示，只是使用者名字暫時看不到，而不是
整支 API 直接報錯。「fallback 應該回傳什麼」沒有標準答案，
取決於業務場景——查詢類 API 或許能回傳快取舊資料，下單類 API
可能要直接告訴使用者稍後再試，而不是假裝成功，這個留給大家
自己判斷，是這章少數沒有標準答案的地方。

可以現場問問大家：如果 user-service 掛掉，你會希望 order-service
回傳「未知用戶」，還是乾脆整支 API 報錯？讓大家練習用業務角度想，
而不是只把它當成一段填空程式碼。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 9
## Spring Cloud 元件全覽

<!--
前面六個元件都個別看過了，這裡我們用一張大表把它們收斂成一個
可以帶走的總結。

在翻到總表之前，先請大家自己口頭講講看：Eureka 是做什麼的？
OpenFeign 呢？用回想的方式加深記憶，再翻頁對答案，
效果會比我直接唸投影片好。
-->

---

# Spring Cloud 元件對照總表

| 元件 | 角色 | 解決問題 | 類比 |
|------|------|---------|------|
| **Eureka** | 服務登記處 | 服務發現 | 公司的 HR 人員名冊 |
| **Spring Cloud LoadBalancer** | 負載平衡器 | 流量分配 | 輪班排班系統 |
| **Spring Cloud Gateway** | API 閘道器 | 統一入口、路由 | 連鎖集團總客服 |
| **OpenFeign** | HTTP 客戶端 | 服務間通訊 | 部門間的內線電話 |
| **Spring Cloud Config** | 設定伺服器 | 集中管理設定 | 集團總部的公告系統 |
| **Resilience4j** | 熔斷/限流 | 故障保護 | 電路保護裝置 |

> 這六個元件共同構成一個生產就緒的微服務基礎設施。實際專案通常都需要全部使用。

<!--
考試前如果只能背一張表，就背這張。我們放慢速度，一行一行對照講一次，
順便回收前面用過的比喻，幫助大家記憶：
Eureka 是 HR 人員名冊，呼應「總機報名字」；LoadBalancer 是輪班排班系統，
呼應四大挑戰裡「B 有三個實例，打哪一個」；Gateway 是連鎖集團總客服，
呼應「不用知道分機號碼」；OpenFeign 是內線電話，呼應「看起來像本地方法呼叫」；
Config 是集團總部公告系統，呼應「改一次密碼、20 個服務都同步」；
Resilience4j 是電路保護裝置，呼應雪崩效應和交通號誌。

⚠️ 提醒一下最後這句「實際專案通常都需要全部使用」的範圍：
指的是成熟、正式上線的微服務系統通常六個都會用到，不代表大家
練習或小型專案一開始就要六個一起上——這呼應 Part 1 的核心觀念，
先評估規模，再決定要引入多少複雜度。下一步的建議是先熟 Eureka + OpenFeign，
再逐步加 Gateway 和 Resilience4j，給大家一個務實、循序漸進的路徑。
-->

---
layout: default
---

# 練習一：搭建 Eureka 服務發現環境（1/2）
### 任務說明

用 Spring Initializr 建立三個全新的 Spring Boot 專案，讓它們透過 Eureka 相互感知：

| 任務 | Artifact | 要求 |
|------|----------|------|
| 建立 `eureka-server` | `eureka-server` | Port 8761，加上 `@EnableEurekaServer` |
| 建立 `user-service` | `user-service` | Port 8081，`spring.application.name=user-service` |
| 建立 `order-service` | `order-service` | Port 8082，`spring.application.name=order-service` |
| 驗證 | — | 啟動三個服務後，開啟 `http://localhost:8761`，確認兩個服務出現在 Dashboard |

<!--
回顧一下：我們剛剛學了 Eureka Server 怎麼建、Eureka Client 怎麼註冊，
這個練習就是讓大家親手做一次，親眼看到服務在 Dashboard 上出現。

任務鋪陳：先講一次啟動順序，eureka-server 要先啟動，因為
user-service、order-service 啟動時要向它註冊，如果順序反了，
Client 端 log 會出現連線失敗的重試訊息，別慌，這跟前面 Eureka Server
自己註冊自己是類似性質的問題，不影響最終結果。

⚠️ 提醒一下：這是三個完全獨立的 Spring Boot 專案，各自用 Spring
Initializr 建立、各自的 Artifact 填對應名字，各自能單獨執行，
不要為了省事全部塞進同一個專案，親手體會「開三個專案」的成本，
正是這個練習隱藏的重點。

下一頁看成功標準跟完成後的畫面長怎樣。
-->

---
layout: default
---

# 練習一：搭建 Eureka 服務發現環境（2/2）
### 成功標準

**成功標準：** Eureka Dashboard 顯示 `USER-SERVICE` 和 `ORDER-SERVICE` 均為 `UP` 狀態。

<img src="/screenshots/ch46-01-eureka-dashboard-up.png" alt="Eureka Dashboard 顯示 ORDER-SERVICE 與 USER-SERVICE 皆為 UP" style="width:100%; max-height:320px; object-fit:contain; margin-top:8px;" />

<!--
這頁附的截圖就是完成的畫面：ORDER-SERVICE、USER-SERVICE
都顯示 UP，這就是這個練習的終點。截圖裡那段紅字警告
（EMERGENCY! EUREKA MAY BE...）是 Eureka 的自我保護模式，
本機開發只有一兩個服務時很常見，不代表練習失敗，可以順便跟
大家說明一下，不然容易被紅字嚇到。

引導思考：如果時間夠，大家可以試試把某個服務關掉，重整 Dashboard 頁面，
觀察狀態什麼時候才會變化——猜猜看，服務發現是不是即時的？
-->

---
layout: default
---

# 練習一：解題提示（1/2）
### 提示說明

**三個專案都用 Spring Initializr 建立：**

| 專案 | Artifact | Dependencies |
|------|----------|--------------|
| eureka-server | `eureka-server` | Eureka Server |
| user-service | `user-service` | Eureka Discovery Client、Spring Web |
| order-service | `order-service` | Eureka Discovery Client、Spring Web |

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 三個都用 Initializr 建立，BOM 都會自動配好，不用手動寫 dependencyManagement。
</div>

<!--
先讓大家卡關個幾分鐘再看這頁提示，效果比一開始就給答案好。

這個練習三個專案都用 Spring Initializr 建立，Initializr 會自動
幫忙配好 Spring Cloud BOM，比手動寫 build.gradle 更不容易踩版本坑，
Artifact 分別填 eureka-server、user-service、order-service，
跟 Eureka 上看到的服務名稱可以直接對上，方便記憶跟排查。

下一頁是常見問題排查，大家先卡關卡到動不了再看。
-->

---
layout: default
---

# 練習一：解題提示（2/2）
### 常見問題排查

| 問題 | 可能原因 |
|------|---------|
| Dashboard 看不到服務 | `eureka.client.service-url.defaultZone` 設定錯誤 |
| 服務狀態一直是 DOWN | 心跳設定問題，服務啟動後要等 30 秒才會更新 |
| 找不到 @EnableEurekaServer | Initializr 沒勾對 Eureka Server 依賴 |

<!--
三個常見問題大家可以自己重現一次：故意把 defaultZone 打錯字，
看 log 出現什麼；心跳預設是 30 秒更新一次，所以服務啟動後要等一下
才會在 Dashboard 出現，先別急著以為失敗了。
-->

---
layout: default
---

# 練習二：用 OpenFeign 跨服務查詢資料
### 任務說明

在練習一的基礎上，讓 `order-service` 呼叫 `user-service`，組出一份完整的訂單明細：

| 任務 | 要求 |
|------|------|
| `user-service` API | `GET /users/{id}` 回傳 `User` |
| FeignClient | `@FeignClient(name = "user-service")`（同 Part 6 `UserClient`） |
| `OrderService` | `getOrderDetail()` 呼叫 Feign，組成 `OrderDetail` |
| `OrderController` | `GET /orders/{orderId}/user/{userId}` |
| 開啟 Feign | 啟動類加 `@EnableFeignClients` |

**成功標準：** 呼叫 `/orders/1/user/1`，能拿到 `OrderDetail` JSON。

<!--
回顧一下：練習一已經讓三個服務在 Eureka 上互相看得到了，Part 6
也已經帶大家把 UserClient、User、OrderDetail、OrderService 都寫過
一次，這個練習就是把那些片段自己重新組裝一次，加上最後一塊拼圖——
一個真正對外的 OrderController。

任務鋪陳：不是憑空發明新東西，是照著 Part 6 教過的結構，自己動手
再做一次：user-service 提供資料，order-service 用 UserClient 拿資料，
用 OrderService 組合成 OrderDetail，最後 OrderController 把它
暴露成一支真正的 API 讓外部呼叫。

⚠️ 驗證小技巧：測試前先確認 Eureka Dashboard 上 USER-SERVICE 是
UP 狀態，再去打 order-service 的 API，不然會拿到連線失敗的例外。

引導思考：如果時間夠，試試把 user-service 關掉，再打一次
order-service 的 API，看看會發生什麼——這就是我們前面 Part 8
講的熔斷器要解決的痛點，親手體驗過一次，才會知道為什麼需要它。
-->

---
layout: default
---

# 練習二：解題提示（1/3）

**`user-service` 側：**

```java
@RestController
public class UserController {
    @GetMapping("/users/{id}")
    public User getUser(@PathVariable("id") Long id) {
        return new User(id, "Alice", "alice@example.com");
    }
}
```

**`order-service` 側的 FeignClient：**

```java
@FeignClient(name = "user-service")
public interface UserClient {
    @GetMapping("/users/{id}")
    User getUserById(@PathVariable("id") Long id);
}
```

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>常見踩坑：</b> @PathVariable 的 name 屬性在 Feign 介面中必須明確指定，不能省略，否則會出現 IllegalStateException。
</div>

<!--
這頁先解決「拿資料」這一半：user-service 提供 API，order-service
用 UserClient 宣告要怎麼呼叫它，這兩塊都是 Part 6 教過的內容，
原封不動搬過來就是答案。

⚠️ 易錯點提醒：@PathVariable 的 name 屬性在 Feign 介面中必須明確指定，
不能省略。一般 Controller 裡有時候可以省略是因為 Spring MVC 能透過
編譯時保留的參數名稱資訊自動對應，但 Feign 介面產生 HTTP 請求的機制
不太一樣，缺少明確指定容易對應失敗，養成一律明確寫出 name 的習慣，
可以少踩很多坑。

另一個提醒：兩邊的 User 型別欄位要一致，否則反序列化會出問題——
這其實是微服務的一種隱性耦合，user-service 改了欄位名稱，
order-service 沒同步改，不會在編譯期報錯，只會在執行期悄悄變成 null，
是比較難排查的一種 bug。如果呼叫失敗，先確認 user-service 有成功在
Eureka 上註冊，這是最快的排查起點。

下一頁我們把這兩塊組裝成真正對外的 API。
-->

---
layout: default
---

# 練習二：解題提示（2/3）

**`order-service` 側的 `OrderService`：**

```java
@Service
@RequiredArgsConstructor
public class OrderService {
    private final UserClient userClient;

    public OrderDetail getOrderDetail(Long orderId, Long userId) {
        User user = userClient.getUserById(userId);
        return new OrderDetail(orderId, user.name());
    }
}
```

<!--
這頁把上一頁的 UserClient 組裝進 OrderService——跟 Part 6 教過的
一模一樣，把呼叫 user-service 拿到的 User 組成 OrderDetail 回傳。
下一頁我們把它暴露成真正的 HTTP API。
-->

---
layout: default
---

# 練習二：解題提示（3/3）

**`order-service` 側的 `OrderController`：**

```java
@RestController
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping("/orders/{orderId}/user/{userId}")
    public OrderDetail getOrderDetail(@PathVariable Long orderId,
                                       @PathVariable Long userId) {
        return orderService.getOrderDetail(orderId, userId);
    }
}
```

<!--
這頁補上最後一塊：用 OrderController 把 OrderService 暴露成真正的
HTTP API——這一步是 Part 6 沒寫到的，Part 6 只寫到 OrderService
為止，這個練習補上最後一步。

引導思考：如果 order-service 呼叫 user-service 失敗，大家會怎麼處理？
這個問題我們前面 Part 8 用熔斷器回答過了，可以回頭複習一下。
-->

---
layout: default
---

# 練習三：加上 Gateway 統一入口
### 任務說明

在練習二的基礎上，建立 `api-gateway`，讓外部不用直接打 order-service / user-service 的 port：

| 任務 | 要求 |
|------|------|
| 建立 `api-gateway` | Initializr 建立，Artifact `api-gateway`，勾 Reactive Gateway + Eureka Discovery Client |
| 設定路由 | `/orders/**` → `lb://order-service`；`/users/**` → `lb://user-service` |
| 驗證 | 改打 Gateway 的 8080，而不是 order-service 的 8082 |

**成功標準：** 呼叫 `http://localhost:8080/orders/1/user/1`（注意是 8080，不是 8082），一樣能拿到 `OrderDetail`。

<!--
回顧一下：練習二已經讓 order-service、user-service 兩個業務服務
能互相溝通，但外部呼叫者還是得知道 order-service 確切的 port
（8082）。這個練習加上 Gateway，讓外部呼叫者只需要記住 8080
這一個入口，實際請求要轉給哪個服務由 Gateway 決定。

任務鋪陳：跟 Part 5 教的路由設定完全一樣，直接照抄就好——
/orders/**、/users/** 剛好對應到 order-service、user-service
實際的 Controller 路徑，這不是巧合，是刻意設計成一致的，
路由 predicate 一定要對應到「真正存在的路徑」，不是憑空定義的。

⚠️ 驗證重點：練習二打的是 order-service 自己的 8082，這次要改打
Gateway 的 8080，如果還是打 8082 也會通（因為 order-service 本身
還是活著），但那樣就沒有真的走到 Gateway，驗證不出這個練習的重點。

引導思考：如果同時開兩個 order-service 實例（例如一個 8082、一個
8083，spring.application.name 一樣是 order-service），Gateway
還是只打一個固定 port 嗎？這個問題可以帶回 Part 3 講過的
Spring Cloud LoadBalancer 概念。
-->

---
layout: default
---

# 練習三：解題提示（Gateway）

**`api-gateway` 的 `application.properties`：**

```properties
server.port=8080
spring.cloud.gateway.server.webflux.routes[0].id=order-service
spring.cloud.gateway.server.webflux.routes[0].uri=lb://order-service
spring.cloud.gateway.server.webflux.routes[0].predicates[0]=Path=/orders/**
spring.cloud.gateway.server.webflux.routes[1].id=user-service
spring.cloud.gateway.server.webflux.routes[1].uri=lb://user-service
spring.cloud.gateway.server.webflux.routes[1].predicates[0]=Path=/users/**
```

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <code>eureka.client.service-url.defaultZone</code> 這行也別忘了加（跟 order-service、user-service 一樣要指向 8761），沒加的話 Gateway 找不到 Eureka，<code>lb://</code> 完全無法解析。
</div>

<!--
這頁提示跟 Part 5 教的路由設定幾乎一模一樣，只是 predicates 換成
真正的路徑 /orders/**、/users/**。

⚠️ 常見漏掉的地方：Gateway 專案本身也要加 eureka-client 依賴、
也要設定 eureka.client.service-url.defaultZone，才能查到
order-service、user-service 註冊在哪。這頁的 properties 只列了
路由相關的部分，Eureka 的連線設定記得一起補上。
-->

---

# 本章重點回顧

| 觀念 | 核心要點 |
|------|---------|
| 微服務不是萬靈丹 | 小團隊、早期產品用單體反而更好 |
| Spring Cloud 是工具箱 | 每個子專案解決一個具體問題 |
| Eureka | Server 提供登記處，Client 啟動自動註冊；需加 BOM |
| Spring Cloud Gateway | `lb://` 整合 Eureka 做負載平衡路由 |
| OpenFeign | `@FeignClient` + `@EnableFeignClients`，介面即 HTTP 客戶端 |
| Spring Cloud Config | Git 倉庫存設定，所有服務動態讀取 |
| Resilience4j | `@CircuitBreaker` + fallback，防止雪崩效應 |

<!--
我們一起回顧整章的故事線：從 Part 1 單體的痛點開始，
到 Part 2 的四大挑戰，再到 Part 3 到 Part 8 一個一個工具對應解法，
最後收斂成這張表。這是一條完整的故事線，不是七八個獨立主題硬拼起來。

💡 下一步的建議可以口頭跟大家說：先熟 Eureka + OpenFeign，
這是打通服務間溝通的最小組合，跑通這個核心、有了成就感，
再逐步加入 Gateway 和 Resilience4j，比一開始就想六個全部到位，
學習曲線會平緩很多。

也老實跟大家說這章的邊界：Config Server 怎麼串 Vault 存密碼、
Gateway 怎麼寫自訂 Filter 做認證、分散式追蹤怎麼串 Zipkin，
今天完全沒碰，是刻意的取捨。這章的任務是建立地圖和信心，
不是把微服務講完，有興趣的話歡迎大家之後自己往下深挖。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
今天的內容告一段落，留點時間給大家提問。

常見問題準備：

Spring Cloud 和 Kubernetes 的服務發現有什麼不同？
概念類似，但層級不同。Eureka 是應用層的服務發現，跑在 JVM 裡；
Kubernetes 的服務發現是基礎設施層的，管的是容器和 Pod。
如果專案本來就跑在 K8s 上，很多團隊會直接用 K8s 原生的服務發現，
省掉再疊一層 Eureka；不是跑在 K8s 上，Eureka 仍然是很直接的選擇。

OpenFeign 和 WebClient 怎麼選？
OpenFeign 走宣告式，適合呼叫其他微服務這種結構清楚的場景，程式碼最精簡；
WebClient 是命令式、reactive，彈性更高，適合非阻塞、串流的場景。
兩者不互斥，同一個專案可以視情境混用。

Eureka 是不是停止維護了？
Netflix 官方停止主動開發 Eureka 2.0，但 1.x 穩定可用，
Spring Cloud 社群持續維護整合層，教學和中小型專案沒有問題。

如果還有時間，想問問大家：如果現在的期末專案要不要拆成微服務，
你會怎麼判斷？呼應我們一開始 Part 1 講的核心觀念，讓整堂課首尾呼應。
-->
