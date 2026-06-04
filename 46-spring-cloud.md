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
歡迎來到 Spring Cloud 微服務的章節。這章的目標不是讓大家馬上學會所有元件的細節，
而是讓大家理解「微服務遇到哪些問題、Spring Cloud 用哪些元件來解決」。
先有全局觀，未來深入每個元件才不會迷失方向。
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
這張投影片告訴學員今天會走過的路。
提醒大家：這章是「導覽地圖」，每個元件後續都可以再深入一整章。
今天的重點是知道「哪個問題對應哪個工具」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
## 單體架構 vs 微服務架構

<!--
先從架構的演進說起。理解單體的痛點，才能真正感受微服務解決了什麼問題。
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
用餐廳比喻很直觀：單體就像所有人在同一棟樓上班。
好處是溝通方便，壞處是有人生病（某模組出問題）整家店都要暫停營業。
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
這張表是今天最重要的觀念之一。
「微服務比單體複雜，需要評估是否真的需要」——不要因為流行就用微服務。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
## 微服務帶來的四大挑戰

<!--
既然選擇了微服務，就要面對一系列新問題。
這些問題不是 Spring Boot 能解決的——需要 Spring Cloud 這層工具箱。
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
四大挑戰介紹完了。記住這個結構：「問題 → 解決方案」。
後面每個元件的介紹都會對應回這裡的某個挑戰。
雪崩效應特別值得強調：一個慢服務導致所有上游服務執行緒耗盡，最終整個系統癱瘓。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3
## Spring Cloud 是什麼？

<!--
現在我們知道問題在哪了。Spring Cloud 就是這些問題的解答工具箱。
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
💡 <b>版本對應：</b> Spring Cloud 2023.x + Spring Boot 3.x + JDK 17+。版本不匹配是最常見的踩坑來源。
</div>

<!--
這張表是全章的總綱。後面每個 Part 都會展開其中一行。
版本對應非常重要——很多踩坑都來自版本不匹配。
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
這張圖是全章的骨架。
獨立專案：eureka-server、config-server、api-gateway、各業務服務。
函式庫（加進業務服務）：OpenFeign、LoadBalancer、Resilience4j。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## Eureka：服務登記處

<!--
Eureka 是 Netflix 開源、Spring Cloud 整合的服務發現元件。
分成 Server（登記處本身）和 Client（來登記的服務）兩個角色。
-->

---

# Eureka Server：建立服務登記處

**加入依賴：**

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-server'
```

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
就這樣，三行設定加一個 annotation，Eureka Server 就起來了。
啟動後預設在 8761 port，有一個 Web UI 可以看到哪些服務已經註冊。
-->

---

# Eureka Server：設定檔

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
register-with-eureka: false 和 fetch-registry: false 這兩個設定很容易忘記。
如果沒設定，Eureka Server 會試著向自己註冊，產生一堆錯誤訊息（雖然不影響功能）。
-->

---

# Eureka Client：服務自我註冊

**加入依賴：**

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
```

**設定檔指定服務名稱與 Eureka Server 位址：**

```properties
spring.application.name=order-service
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> <code>spring.application.name</code> 非常關鍵——這就是服務的「身份證名字」。其他服務呼叫你時，用的就是這個名字，不是 IP。Spring Boot 3.x 不需要 @EnableEurekaClient。
</div>

<!--
spring.application.name 非常關鍵——這就是服務的「身分證名字」。
其他服務呼叫你時，用的就是這個名字，不是 IP。
Spring Boot 3.x 不需要 @EnableEurekaClient，加了依賴就會自動啟動。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 5
## Spring Cloud Gateway：統一入口

<!--
有了服務發現之後，外部用戶端要怎麼知道該打哪個服務？
不可能讓前端直接知道所有微服務的 port。API Gateway 就是解決這個問題的。
-->

---

# Spring Cloud Gateway：架構與路由設定

**依賴：**

```groovy
implementation 'org.springframework.cloud:spring-cloud-starter-gateway'
```

**application.properties 路由設定：**

```properties
spring.cloud.gateway.routes[0].id=order-service
spring.cloud.gateway.routes[0].uri=lb://order-service
spring.cloud.gateway.routes[0].predicates[0]=Path=/api/orders/**
spring.cloud.gateway.routes[1].id=user-service
spring.cloud.gateway.routes[1].uri=lb://user-service
spring.cloud.gateway.routes[1].predicates[0]=Path=/api/users/**
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>lb:// 前綴：</b> 告訴 Gateway 去 Eureka 找這個服務名稱對應的實例，並做負載平衡。不需要寫死 IP。
</div>

<!--
Gateway 就像連鎖集團的「總客服窗口」：不管你要找哪個部門，都先來這裡，
由我幫你轉接到正確的地方。前端只需要記住一個位址。

lb:// 是關鍵。它告訴 Gateway：「去 Eureka 找這個服務名稱對應的實例，然後負載平衡」。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 6
## OpenFeign：讓服務間呼叫像本地方法一樣

<!--
微服務之間互相呼叫是很常見的場景。
OpenFeign 讓你用介面 + annotation 宣告式地定義 HTTP 呼叫。
-->

---

# OpenFeign（1/2）：定義與啟用

**① `UserClient.java`（在 order-service 中定義）**

```java
@FeignClient(name = "user-service")   // 對應 Eureka 上的服務名稱
public interface UserClient {
    @GetMapping("/users/{id}")
    User getUserById(@PathVariable Long id);
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
@FeignClient 宣告介面，@EnableFeignClients 讓 Spring 把這個介面實例化成 Bean。
name = "user-service" 對應 Eureka 上的 spring.application.name，不是 IP。
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
UserClient 是介面，沒有實作類別。Feign 在 @EnableFeignClients 掃描後，自動產生一個代理物件注入進來。
呼叫 userClient.getUserById(1L) 實際上是發出 GET http://user-service/users/1，Eureka 解析位址。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 7
## Spring Cloud Config：集中管理設定

<!--
100 個微服務，每個都有自己的 application.properties。
改一個資料庫密碼要逐一重啟？這在生產環境是噩夢。
Spring Cloud Config 讓你把設定集中放在 Git 倉庫，所有服務動態讀取。
-->

---

# Spring Cloud Config：架構說明

**架構：** Config Server 從 Git 倉庫讀取設定，各服務從 Config Server 拉取自己的設定。

| 元件 | 角色 |
|------|------|
| Git 倉庫 | 存放所有服務的設定檔（order-service.properties、user-service.properties 等） |
| Config Server | 橋接 Git 倉庫與各微服務 |
| 各微服務（Config Client） | 從 Config Server 拉取自己的設定 |

**Config Server 依賴與啟動類：**

```groovy
implementation 'org.springframework.cloud:spring-cloud-config-server'
```

```java
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication { ... }
```

<!--
Git 倉庫作為設定來源是最常見的做法。
修改設定只需要 push 到 Git，服務可以透過 /actuator/refresh 動態重新載入，
不需要重啟——這在生產環境非常有價值。
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
Git 倉庫的檔名對應服務的 spring.application.name。
Config Server 本身也是一個 Spring Boot 專案，加上 @EnableConfigServer。
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
spring.config.import 是 Spring Boot 3.x 的新寫法，取代舊版的 bootstrap.properties。
spring.application.name 決定去 Git 倉庫找哪個檔案。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 8
## Resilience4j Circuit Breaker：熔斷保護

<!--
熔斷器這個名字來自電路保護元件。
當電流異常（服務異常），熔斷器跳開（停止呼叫），保護整個電路（系統）。
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
關鍵概念：你不需要手動判斷狀態。Resilience4j 全自動處理，透過 AOP 在你完全不知情的情況下攔截方法呼叫。
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
Half-Open 狀態是在試探「下游服務是否已經恢復」。
-->

---

# 熔斷器：狀態與程式碼的對應

```java
@CircuitBreaker(name = "inventoryService",
                fallbackMethod = "inventoryFallback")
public InventoryResponse checkInventory(String productCode) {
    // ← Closed / Half-Open 狀態：執行這裡，正常呼叫下游
    return inventoryClient.check(productCode);
}

public InventoryResponse inventoryFallback(String productCode,
                                            Exception e) {
    // ← Open 狀態：跳過上面直接執行這裡，不呼叫下游
    return new InventoryResponse(productCode, false);
}
```

| 狀態 | 執行哪段 |
|------|---------|
| Closed | `checkInventory()` → 呼叫真實服務 |
| Open | 直接跳到 `inventoryFallback()`，不碰下游 |
| Half-Open | `checkInventory()` 試探；成功回 Closed，失敗回 Open |

<!--
fallbackMethod 就是 Open 狀態的出口，回傳一個「說得過去」的預設值，讓系統繼續運作而不是直接報錯。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 9
## Spring Cloud 元件全覽

<!--
前面介紹了六個元件。現在用一張大表整理清楚每個元件的角色定位。
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
用生活比喻幫助記憶。考試前如果只能背一張表，就背這張。

強調「通常都需要全部使用」——這些元件不是可選的加分項，
是微服務架構能穩定運行的必要條件。
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
這個練習的目的是讓大家親眼看到服務在 Eureka Dashboard 上出現。
很多人第一次看到那個畫面都會有「啊，原來服務發現是這樣運作的」的頓悟感。
-->

---
layout: default
---

# 練習一：解題提示
### 提示說明

**build.gradle 必須加入 Spring Cloud BOM：**

```groovy
dependencies {
    implementation platform(
        'org.springframework.cloud:spring-cloud-dependencies:2023.0.3')
    // 其他依賴不需要指定版本，由 BOM 管理
    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
}
```

**常見問題排查：**

| 問題 | 可能原因 |
|------|---------|
| Dashboard 看不到服務 | `eureka.client.service-url.defaultZone` 設定錯誤 |
| 服務狀態一直是 DOWN | 心跳設定問題，服務啟動後要等 30 秒才會更新 |
| 找不到 @EnableEurekaServer | 沒加 eureka-server 依賴，或依賴版本衝突 |

<!--
BOM 是很多人第一次做微服務時忘記加的東西。
沒有 BOM 就要手動指定每個 Spring Cloud 子依賴的版本，很容易衝突。
心跳預設是 30 秒更新一次，所以服務啟動後要等一下才會在 Dashboard 出現。
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
這個練習讓大家感受 OpenFeign 的威力：order-service 根本不知道 user-service 的 IP，
只透過服務名稱就能呼叫。這就是 Eureka + OpenFeign 組合的核心價值。
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
    public User getUser(@PathVariable Long id) {
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
常見踩坑：兩邊的 User 類別欄位要一致，否則反序列化會出問題。
另外 @PathVariable 的 name 屬性在 Feign 介面中必須明確指定，不能省略。
如果呼叫失敗，先確認 user-service 有成功在 Eureka 註冊。
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

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>下一步：</b> 先把 Eureka + OpenFeign 練熟，再逐步加入 Gateway 和 Resilience4j。每個元件都值得單獨深入學習。
</div>

<!--
強調「這章是地圖，不是終點」。學完這章知道各元件的定位，
但每個元件還有很多細節：Feign 的錯誤處理、Gateway 的 Filter、
Config 的動態刷新等等，都需要更深入的學習。
最重要的觀念：微服務的複雜度是真實存在的，不要輕易引入。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
結尾留時間給 Q&A。

常見問題準備：
1. Spring Cloud 和 Kubernetes 的服務發現有什麼不同？
2. OpenFeign 和 WebClient 怎麼選？
3. Eureka 停止維護了嗎？（Netflix 已停止主動開發，但 Spring Cloud 仍在維護整合）
-->
