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
└─────────────┘  └──────┬──────┘     OpenFeign（order 呼叫 user）
                        │ OpenFeign  Resilience4j
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

外部請求先打到 api-gateway（8080），這是唯一對外開放的入口，
前端、Postman、手機 App 都只需要記住這一個位址。
Gateway 查 Eureka，知道 user-service、order-service 各自的實際 IP:port，
用 lb:// 做負載平衡轉發——這是 Part 5 的內容。
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
💡 <b>先說明專案結構：</b> Eureka Server 和 Eureka Client 是<b>兩個完全獨立的 Spring Boot 專案</b>，不能塞在同一個專案裡。如果你前面章節已經有一個大專案（Controller、Security、JPA 都在裡面），那個專案只要加 <code>eureka-client</code> 依賴，就能變成一個「業務服務」向 Eureka 註冊；<b>另外再開一個全新的乾淨專案</b>，只加 <code>eureka-server</code> 依賴，專門當電話簿。
</div>

<!--
在進細節之前，先講清楚一個很多人會誤會的地方：Eureka Server 和
Eureka Client 是兩個完全獨立的 Spring Boot 專案，不是同一包程式碼
裡加兩個依賴就好。如果大家前面章節已經有一個大專案，那個專案只要
加 eureka-client 依賴，就能變成一個業務服務去註冊；Server 那邊
一定要另外開一個全新、乾淨的專案，只放 eureka-server 依賴，
專門當電話簿，不要跟業務邏輯混在一起。這個結構觀念要先建立好，
不然後面看到「加依賴」的投影片會誤以為兩個都加在同一個專案裡就好。

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
| Language | Java |
| Spring Boot | 4.1.x |
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
Spring Boot 4.1.x、Java 17，在 Dependencies 搜尋欄打 Eureka，
勾選 Eureka Server，按 Generate 下載解壓，或直接用 IDE
（IntelliJ 有內建 Spring Initializr 精靈）建立。

⚠️ 提醒一下：這是「建立一個全新專案」的流程，只適用於一開始就要
另開的獨立專案（像 eureka-server、api-gateway、config-server）。
如果是要在既有專案裡加依賴（像後面的 OpenFeign、Resilience4j），
既有專案已經有 build.gradle 了，就不能重新跑一次 Initializr，
還是要手動加依賴。

專案建好之後，下一頁我們先把設定檔寫好，最後才加 annotation 啟用。
-->

---

# Eureka Server（2/3）：加上設定檔

```properties
server.port=8761
spring.application.name=eureka-server
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

# Eureka Client（1/2）：建立或改造業務服務專案

**情境 A — 全新的業務服務：用 Spring Initializr 建立，Dependencies 勾選 Eureka Discovery Client**

**情境 B — 你前面章節已經有的大專案：先補 BOM，再加依賴**

```groovy
ext {
    set('springCloudVersion', "2025.1.2")
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}

dependencies {
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
}
```

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 情境 B 因為是「加進既有專案」，不是重新跑 Initializr，Initializr 不會幫你補這段。少了 <code>dependencyManagement</code> 這段 BOM，<code>eureka-client</code> 依賴會因為找不到版本號而報錯。
</div>

<!--
這頁範例的目的是讓一個服務自己去 Eureka 報到，先分清楚兩種情境：
如果是全新開的業務服務，一樣用 Spring Initializr，Dependencies 搜尋
Eureka，勾選 Eureka Discovery Client，Initializr 一樣會自動幫忙配好
BOM，跟上一頁 eureka-server 的做法一致，不用寫這頁情境 B 的程式碼。

但如果是大家前面章節已經在用的那個大專案（Controller、Security、
JPA 都在裡面），那個專案已經存在了，不能重新跑一次 Initializr
蓋掉既有程式碼，只能手動在既有的 build.gradle 裡補這兩段：
先是 ext + dependencyManagement 匯入 BOM，再是 dependencies 裡
加 eureka-client 依賴。這是 Initializr 幫不上忙的地方，
BOM 這段一定要自己手動加，不是加了依賴就好。

依賴確定抓得到之後，下一頁我們加設定檔，讓這個服務知道要向哪個
Eureka Server 報到、要用什麼名字報到。
-->

---

# Eureka Client（2/2）：設定檔指定服務名稱

**設定檔指定服務名稱與 Eureka Server 位址：**

```properties
spring.application.name=order-service
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>spring.application.name</code> 非常關鍵——這就是服務的「身份證名字」。其他服務呼叫你時，用的就是這個名字，不是 IP。Spring Boot 3.x / 4.x 不需要 @EnableEurekaClient。
</div>

<!--
帶大家看關鍵行：spring.application.name。

這就是回收剛剛「總機報名字」的比喻——這個欄位就是分機打給總機時報的名字，
非常關鍵，因為其他服務呼叫你時，用的就是這個名字，不是 IP。

⚠️ 易錯點提醒：如果兩個服務不小心設成同一個名字，Eureka 會把它們當成
「同一個服務的兩個實例」，流量會在它們之間分流。這在正式環境是刻意用來
做水平擴展的機制，但如果是不小心撞名，就會變成兩個不同服務互搶流量，
是新手常見的踩坑點。

也順便解釋一下：Spring Boot 3.x / 4.x 不需要 @EnableEurekaClient，
只要 classpath 上看得到 eureka-client 的依賴，Spring Boot 就會自動裝配好，
這跟這幾年「約定優於設定」的走向是一致的，不用像上一頁 eureka-server
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

# Spring Cloud Gateway（1/3）：又是一個獨立專案

<div class="mt-1 mb-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>又是一個獨立專案：</b> 跟 eureka-server、config-server 一樣，api-gateway 要另外開一個全新的 Spring Boot 專案，不要塞進業務服務裡。
</div>

**在 [start.spring.io](https://start.spring.io) 建立一個全新專案：**

| 設定項 | 選擇 |
|------|------|
| Project | Gradle - Groovy |
| Spring Boot | 4.1.x |
| Java | 17 |
| Dependencies | **Gateway**、**Eureka Discovery Client** |

<!--
生活化比喻：Gateway 就像連鎖集團的「總客服窗口」，不管你要找哪個部門，
都先來這裡，由它幫你轉接到正確的地方，前端只需要記住一個位址。

先講清楚結構：這是又一個獨立的 Spring Boot 專案，跟前面的
eureka-server 一樣要另外開，不要塞進業務服務，一樣用 Spring Initializr
建立。Dependencies 要勾兩個：Gateway，還有 Eureka Discovery Client——
Gateway 要靠 Eureka Discovery Client 才能去問 Eureka「這個服務名稱
對應的實例在哪」，沒勾這個，下一頁的 lb:// 就無法運作，兩個都不能漏。

專案建好之後，下一頁我們看 Initializr 幫我們產生的依賴長什麼樣子，
以及一個查資料常會踩到的舊寫法陷阱。
-->

---

# Spring Cloud Gateway（2/3）：Initializr 產生的依賴

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-gateway-server-webflux'
implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
```

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ Spring Cloud 2025.x 起，舊的 <code>spring-cloud-starter-gateway</code> 依賴已棄用，改為 <code>-server-webflux</code>。網路上舊教學文章常還是寫舊名稱，Initializr 產生的已經是新版，照它產生的用即可，不用自己改。
</div>

<!--
帶大家看 Initializr 幫我們產生的這兩行依賴，跟前一頁勾選的
Gateway、Eureka Discovery Client 是對應的，不用自己手動輸入。

⚠️ 易錯點提醒：Spring Cloud 2025.x 起，舊的 spring-cloud-starter-gateway
依賴已經棄用，改成 -server-webflux 版本。這個提醒主要是給大家之後
自己查資料用的——如果查到的教學文章寫的是舊的 artifact 名稱，
要知道那是舊版寫法，不要照抄，跟著 Initializr 產生的版本走就對了。

依賴到位之後，下一頁我們設定實際的路由規則。
-->

---

# Spring Cloud Gateway（3/3）：路由設定

**application.properties 路由設定：**

```properties
spring.cloud.gateway.server.webflux.routes[0].id=order-service
spring.cloud.gateway.server.webflux.routes[0].uri=lb://order-service
spring.cloud.gateway.server.webflux.routes[0].predicates[0]=Path=/api/orders/**
spring.cloud.gateway.server.webflux.routes[1].id=user-service
spring.cloud.gateway.server.webflux.routes[1].uri=lb://user-service
spring.cloud.gateway.server.webflux.routes[1].predicates[0]=Path=/api/users/**
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
predicates（Path=/api/orders/**）是判斷條件，符合什麼 URL 才走這條路由，
可以類比成前面章節寫過的 @RequestMapping 路徑比對。

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
微服務之間互相呼叫是很常見的場景，先問問大家：如果沒有 OpenFeign，
order-service 想呼叫 user-service，要怎麼寫？
（通常會有人提到 RestTemplate 或 WebClient——手動組 URL 字串、
手動處理序列化跟例外，這些程式碼寫多了會很雷同、很囉唆。）

OpenFeign 的核心賣點就是「宣告式」：只要寫一個介面，描述「我要呼叫的
API 長什麼樣子」，Feign 會在背後自動生成實作，把方法呼叫轉成真正的
HTTP 請求，我們完全不用自己組 URL。

這跟前面學過的 Spring Data JPA Repository 介面思路是一樣的——
都是「我們寫介面宣告意圖，框架幫我們生成實作」，可以直接拿來類比，
會比較好理解。
-->

---

# OpenFeign（1/2）：定義與啟用

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

大家注意一個很反直覺的地方：UserClient 只是一個 interface，
裡面的方法沒有寫任何實作內容。沒寫實作，怎麼會動？先賣個關子，
答案下一頁揭曉。

順便提一下：這裡的 @GetMapping 跟 Controller 上用的 @GetMapping
是同一個 annotation，只是方向反過來——Controller 上是「宣告我要接收
這個路徑的請求」，這裡是「宣告我要發送到這個路徑的請求」。

⚠️ 別忘了啟動類要加 @EnableFeignClients，這跟前面看過的
@EnableJpaRepositories 是同一個模式，告訴 Spring 去掃描所有
標了 @FeignClient 的介面，逐一生成 Bean。
-->

---

# OpenFeign（2/2）：注入與使用

**③ `OrderService.java`（注入 UserClient，直接呼叫）**

```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserClient userClient;  // Spring 自動注入 Feign 產生的實作

    public OrderDetail getOrderDetail(Long orderId, Long userId) {
        User user = userClient.getUserById(userId);  // 實際發出 HTTP GET 到 user-service
        return new OrderDetail(orderId, user.getName());
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

帶大家走一次完整呼叫鏈：OrderService 呼叫 userClient.getUserById(userId)
（看起來像本地方法呼叫）→ Feign 代理物件攔截，組出 GET /users/{id} 請求
→ 向 Eureka 查 user-service 有哪些實例 → LoadBalancer 選一個 →
真正發出 HTTP 請求 → 收到 JSON，反序列化成 User 物件回傳。

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

**用 Spring Initializr 建立一個全新專案（Dependencies 勾選 Config Server），得到：**

```groovy
implementation 'org.springframework.cloud:spring-cloud-config-server'
```

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication { ... }
```

<!--
這頁講架構：Config Server 從 Git 倉庫讀取設定，各服務再從 Config Server
拉取自己的設定。為什麼選 Git 而不是資料庫？因為 Git 天生就有版本紀錄、
有 diff，設定變更也能像程式碼一樣被追蹤「誰在什麼時候改了什麼」，
出問題甚至可以直接 revert 回上一版，這是把版本控制的紀律套用到設定上。

範例目的：建一個獨立的 Config Server 專案，跟前面 eureka-server、
api-gateway 一樣，用 Spring Initializr 建立，Dependencies 搜尋
Config Server 勾選即可，Initializr 一樣會幫我們配好對應的
spring-cloud-config-server 依賴和相容的 BOM 版本。

帶大家看關鍵行：@EnableConfigServer——這跟前面看過的
@EnableEurekaServer 是同一個模式，一個獨立的 Spring Boot 專案，
加一個 annotation，就變成特化的基礎設施服務。大家會發現
Spring Cloud 的元件大多長這樣，抓到這個規律之後，
接下來看到新元件也比較好上手。
-->

---

# Spring Cloud Config：完整使用流程（1/2）

**① Git 倉庫放設定檔**（`.properties` 格式，檔名 = 服務名稱）

```
config-repo/
├── order-service.properties   # order-service 專用設定
└── user-service.properties    # user-service 專用設定
```

**② Config Server 的 `application.properties`**

```properties
server.port=8888
spring.cloud.config.server.git.uri=https://github.com/your-org/config-repo
```

<!--
這頁的目的是把 Git 倉庫和 Config Server 串起來，帶大家看關鍵約定：
「檔名 = 服務名稱」。Config Server 收到 order-service 的請求時，
會去 Git 倉庫找 order-service.properties 這個檔案，
就是純粹的字串比對，沒有魔法。

這也再一次呼應 spring.application.name 這個欄位有多關鍵——
它同時是 Eureka 上的身分證名字，也是 Config Server 對應設定檔的檔名，
一個欄位串起兩個元件，這是這章反覆出現的設計思路。

⚠️ 提醒一下：spring.cloud.config.server.git.uri 實務上通常會指向
公司內部的 Git，不會是公開的 GitHub repo，因為設定檔裡常有敏感資訊。
-->

---

# Spring Cloud Config：完整使用流程（2/2）

**③ 各微服務（Config Client）的 `application.properties`**

```properties
spring.application.name=order-service
spring.config.import=optional:configserver:http://localhost:8888
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>運作原理：</b> 服務啟動時，先向 Config Server 拉取 <code>order-service.properties</code> 的內容，再繼續啟動。Git 設定更新後，呼叫 <code>/actuator/refresh</code> 即可動態重新載入，不需重啟。
</div>

<div class="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <code>optional:</code> 前綴表示 Config Server 不在線時服務仍可啟動（用本地設定），適合開發環境。
</div>

<!--
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

**加進既有的業務服務專案（例如 order-service），先確認 BOM 已匯入：**

```groovy
ext {
    set('springCloudVersion', "2025.1.2")
}

dependencyManagement {
    imports {
        mavenBom "org.springframework.cloud:spring-cloud-dependencies:${springCloudVersion}"
    }
}

dependencies {
    implementation 'org.springframework.cloud:spring-cloud-starter-circuitbreaker-resilience4j'
}
```

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 熔斷器不是 Spring Boot 內建功能，一定要加這個依賴，<code>@CircuitBreaker</code> 才 import 得到。這個依賴一樣沒寫版本號，一樣靠 BOM 管理版本——跟前面 Eureka Client「情境 B」加進既有專案的邏輯一模一樣。
</div>

<!--
先回答一個大家常有的疑問：熔斷器是不是 Spring 自己判斷、不用裝東西？
不是。這是 Resilience4j 這個第三方函式庫提供的功能，Spring Cloud
只是幫忙包一層 starter 讓它跟 Spring Boot 整合，一定要加這個依賴，
不加的話 @CircuitBreaker 這個 annotation 根本不存在，import 就會紅字。

這個依賴通常是加進「既有的業務服務」，不是另開新專案，所以流程
跟前面 Eureka Client 的情境 B 一樣——要確認這個專案的 build.gradle
已經匯入 Spring Cloud BOM，沒匯入的話一樣會找不到版本號而報錯。

依賴加好之後，下一頁我們看它實際運作的原理。
-->

---

# 熔斷器運作原理

`@CircuitBreaker` 透過 **AOP 攔截**每一次方法呼叫，自動追蹤成功/失敗：

```
你呼叫 checkInventory()
         ↓
  Resilience4j 攔截
         ↓
     查當前狀態
    ┌─────┴──────┐
  Closed        Open
    ↓              ↓
執行真實程式碼   直接呼叫 fallback()
inventoryClient    不碰下游服務
  .check()
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
checkInventory() 本身乾乾淨淨，這是關注點分離的好例子。

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

**Resilience4j 內部有一個「狀態機」，根據設定檔的門檻值自動追蹤、自動切換，不是 Spring、也不是我們的程式碼在判斷：**

```properties
resilience4j.circuitbreaker.instances.inventoryService.sliding-window-size=10
resilience4j.circuitbreaker.instances.inventoryService.failure-rate-threshold=50
resilience4j.circuitbreaker.instances.inventoryService.wait-duration-in-open-state=10s
resilience4j.circuitbreaker.instances.inventoryService.permitted-number-of-calls-in-half-open-state=3
```

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <code>inventoryService</code> 這個名字要跟 <code>@CircuitBreaker(name = "inventoryService", ...)</code> 對上，Resilience4j 才知道這組門檻值是設給哪一個熔斷器用的。
</div>

<!--
這頁補上前面漏掉的一塊拼圖：到底是誰在算「失敗率有沒有超過 50%」、
誰決定要不要跳到 Open？答案不是 Spring，也不是我們自己寫的程式碼，
是 Resilience4j 函式庫內部維護的一個狀態機（CircuitBreakerStateMachine），
它會根據這頁的設定檔門檻值，自動記錄每次呼叫的成功失敗，自動判斷、
自動切換狀態，全程我們看不到、也不用手動介入。

逐行解釋這四個設定：sliding-window-size=10 表示看「最近 10 次呼叫」
的結果來算失敗率；failure-rate-threshold=50 表示失敗率超過 50%
就跳到 Open；wait-duration-in-open-state=10s 表示 Open 狀態要
冷靜 10 秒才進入 Half-Open 試探；
permitted-number-of-calls-in-half-open-state=3 表示 Half-Open
只放行 3 次請求試探，這 3 次的結果決定要跳回 Closed 還是打回 Open。

⚠️ 重點提醒：這組設定的 key 是 inventoryService，一定要跟下一頁
@CircuitBreaker(name = "inventoryService", ...) 的 name 完全對上，
Resilience4j 才知道要用這組門檻值來管這個熔斷器，名字對不上，
Resilience4j 會用預設值，門檻可能不是你想要的。
-->

---

# 熔斷器：狀態與程式碼的對應（1/2）

```java
@CircuitBreaker(name = "inventoryService",
                fallbackMethod = "inventoryFallback")
public InventoryResponse checkInventory(String productCode) {
    // 這段本身不知道自己在 Closed 還是 Half-Open，只管正常呼叫下游
    return inventoryClient.check(productCode);
}

public InventoryResponse inventoryFallback(String productCode,
                                            Exception e) {
    // Open 狀態時，Resilience4j 直接跳過上面，改執行這裡
    return new InventoryResponse(productCode, false);
}
```

| 狀態 | 誰觸發 | 實際執行哪段 |
|------|--------|------------|
| Closed | 上一頁狀態機判定失敗率未超標 | `checkInventory()`，正常呼叫下游 |
| Open | 狀態機判定失敗率超過門檻 | 直接跳到 `inventoryFallback()`，`checkInventory()` 完全不會被呼叫 |
| Half-Open | 狀態機判定冷卻時間已到 | 一樣呼叫 `checkInventory()`，用結果決定跳回 Closed 或 Open |

<!--
這頁範例的目的是把上一頁的狀態機設定，對照到真正的程式碼上。
先強調一次：checkInventory() 和 inventoryFallback() 這兩個方法
「本身」都不知道現在是什麼狀態、也不做任何判斷，判斷跟切換
全部是上一頁的 Resilience4j 狀態機在背後做的，這兩個方法只是
「狀態機決定執行誰之後」被呼叫到的兩個候選人。

帶大家看關鍵行：name = "inventoryService" 是這個熔斷器的識別名稱，
要跟上一頁設定檔的 key 對上；fallbackMethod = "inventoryFallback"
指定備案方法。同一個服務可以有多個熔斷器，各自對應不同的
name、各自獨立追蹤狀態（例如 inventory 一個、payment 又是另一個）。

⚠️ 易錯點提醒：fallback 方法的簽章要跟原方法對齊——參數要一樣，
多一個 Exception 參數放在最後，這是新手很容易漏掉、導致啟動時噴錯的地方。

下一頁我們討論 fallback 方法設計本身該注意什麼。
-->

---

# 熔斷器：fallback 該回傳什麼（2/2）

**這裡的範例回傳 `false`（庫存不足），是保守但合理的預設值：**

```java
public InventoryResponse inventoryFallback(String productCode,
                                            Exception e) {
    return new InventoryResponse(productCode, false);
}
```

<div class="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 「fallback 應該回傳什麼」沒有標準答案，取決於業務場景：查詢類 API 或許能回傳快取的舊資料；下單類 API 可能要直接告訴使用者稍後再試，而不是假裝成功。
</div>

<!--
fallback 方法設計的關鍵：這裡回傳 false（庫存不足）是保守但合理的
預設值，「fallback 應該回傳什麼」沒有標準答案，取決於業務場景——
查詢類 API 或許能回傳快取舊資料，下單類 API 可能要直接告訴使用者
稍後再試，而不是假裝成功，這個留給大家自己判斷，是這章少數
沒有標準答案的地方。

可以現場問問大家：如果這是訂單結帳的 fallback，你會回傳什麼？
讓大家練習用業務角度想，而不是只把它當成一段填空程式碼。
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

# 練習一：搭建 Eureka 服務發現環境
### 任務說明

建立三個 Spring Boot 專案，讓它們透過 Eureka 相互感知：

| 任務 | 要求 |
|------|------|
| 建立 `eureka-server` | Port 8761，加上 `@EnableEurekaServer` |
| 建立 `user-service` | Port 8081，`spring.application.name=user-service` |
| 建立 `order-service` | Port 8082，`spring.application.name=order-service` |
| 驗證 | 啟動三個服務後，開啟 `http://localhost:8761`，確認兩個服務出現在 Dashboard |

**成功標準：** Eureka Dashboard 顯示 `USER-SERVICE` 和 `ORDER-SERVICE` 均為 `UP` 狀態。

<!--
回顧一下：我們剛剛學了 Eureka Server 怎麼建、Eureka Client 怎麼註冊，
這個練習就是讓大家親手做一次，親眼看到服務在 Dashboard 上出現。

任務鋪陳：先講一次啟動順序，eureka-server 要先啟動，因為
user-service、order-service 啟動時要向它註冊，如果順序反了，
Client 端 log 會出現連線失敗的重試訊息，別慌，這跟前面 Eureka Server
自己註冊自己是類似性質的問題，不影響最終結果。

⚠️ 提醒一下：這是三個完全獨立的 Spring Boot 專案，各自要有自己的
build.gradle，各自能單獨執行，不要為了省事全部塞進同一個專案，
親手體會「開三個專案」的成本，正是這個練習隱藏的重點。

引導思考：如果時間夠，大家可以試試把某個服務關掉，重整 Dashboard 頁面，
觀察狀態什麼時候才會變化——猜猜看，服務發現是不是即時的？
-->

---
layout: default
---

# 練習一：解題提示
### 提示說明

**用 Spring Initializr 建三個專案：eureka-server 勾 Eureka Server；
user-service、order-service 各自勾 Eureka Discovery Client。**

<div class="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ 如果是手動改既有的 <code>build.gradle</code>（不是重新跑 Initializr），記得依賴沒寫版本號，要自己補上 BOM：<code>implementation platform('org.springframework.cloud:spring-cloud-dependencies:2025.1.2')</code>，否則 Gradle 會找不到版本而報錯。
</div>

**常見問題排查：**

| 問題 | 可能原因 |
|------|---------|
| Dashboard 看不到服務 | `eureka.client.service-url.defaultZone` 設定錯誤 |
| 服務狀態一直是 DOWN | 心跳設定問題，服務啟動後要等 30 秒才會更新 |
| 找不到 @EnableEurekaServer | 沒用 Initializr 勾對 Eureka Server 依賴，或手動加的依賴版本衝突 |

<!--
先讓大家卡關個幾分鐘再看這頁提示，效果比一開始就給答案好。

這個練習建議三個專案都用 Spring Initializr 建立，Initializr 會自動
幫忙配好 Spring Cloud BOM，比手動寫 build.gradle 更不容易踩版本坑。

⚠️ 但還是要提醒：如果大家是拿既有專案手動改 build.gradle（不是重新
建立），BOM 就要自己手動補上，這是 Initializr 幫不上忙的地方——
BOM 本身不是一個依賴，是一份版本清單，告訴 Gradle「Spring Cloud
這個生態系底下所有子專案，統一用這個版本組合」，可以類比成前面
看過的 Spring Boot 本身的 dependency management 機制。

三個常見問題大家可以自己重現一次：故意把 defaultZone 打錯字，
看 log 出現什麼；心跳預設是 30 秒更新一次，所以服務啟動後要等一下
才會在 Dashboard 出現，先別急著以為失敗了。
-->

---
layout: default
---

# 練習二：用 OpenFeign 跨服務查詢資料
### 任務說明

在練習一的基礎上，讓 `order-service` 呼叫 `user-service` 取得用戶資料：

| 任務 | 要求 |
|------|------|
| `user-service` 提供 API | `GET /users/{id}` 回傳 `User` 物件（id, name, email） |
| `order-service` 定義 FeignClient | `@FeignClient(name = "user-service")` |
| 建立 `OrderController` | `GET /orders/{orderId}/user` → 呼叫 Feign 取得用戶資料後一起回傳 |
| 開啟 Feign | 啟動類加 `@EnableFeignClients` |

**成功標準：** 呼叫 `http://localhost:8082/orders/1/user` 能取得 `user-service` 回傳的用戶資料。

<!--
回顧一下：練習一已經讓三個服務在 Eureka 上互相看得到了，
這次要在這個基礎上，讓 order-service 真的透過 OpenFeign 呼叫 user-service，
親手感受一次「不用知道對方 IP 也能呼叫」的威力。

任務鋪陳：不用重開一套新環境，就在剛剛跑起來的三個服務上，
多加一個 FeignClient 介面、多加一個 Controller，系統馬上就有跨服務
查詢能力，這種累加式的開發過程比較貼近真實工作情境。

⚠️ 驗證小技巧：測試前先確認 Eureka Dashboard 上 USER-SERVICE 是
UP 狀態，再去打 order-service 的 API，不然會拿到連線失敗的例外。

引導思考：如果時間夠，試試把 user-service 關掉，再打一次
order-service 的 API，看看會發生什麼——這就是我們前面 Part 8
講的熔斷器要解決的痛點，親手體驗過一次，才會知道為什麼需要它。
-->

---
layout: default
---

# 練習二：解題提示
### 提示說明

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

**`order-service` 側的 FeignClient 介面：**

```java
@FeignClient(name = "user-service")
public interface UserClient {
    @GetMapping("/users/{id}")
    User getUserById(@PathVariable("id") Long id);
}
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>常見踩坑：</b> @PathVariable 的 name 屬性在 Feign 介面中必須明確指定，不能省略，否則會出現 IllegalStateException。
</div>

<!--
⚠️ 易錯點提醒：@PathVariable 的 name 屬性在 Feign 介面中必須明確指定，
不能省略。一般 Controller 裡有時候可以省略是因為 Spring MVC 能透過
編譯時保留的參數名稱資訊自動對應，但 Feign 介面產生 HTTP 請求的機制
不太一樣，缺少明確指定容易對應失敗，養成一律明確寫出 name 的習慣，
可以少踩很多坑。

另一個提醒：兩邊的 User 類別欄位要一致，否則反序列化會出問題——
這其實是微服務的一種隱性耦合，user-service 改了欄位名稱，
order-service 沒同步改，不會在編譯期報錯，只會在執行期悄悄變成 null，
是比較難排查的一種 bug。如果呼叫失敗，先確認 user-service 有成功在
Eureka 上註冊，這是最快的排查起點。

引導思考：如果 order-service 呼叫 user-service 失敗，大家會怎麼處理？
這個問題我們前面 Part 8 用熔斷器回答過了，可以回頭複習一下。
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
