---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring MVC 簡介
routeAlias: ch12
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
    Spring MVC 簡介
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「前後端溝通的橋樑，其實你早就在用了」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到第十二章！

前幾章我們學完了 IoC、DI、AOP，這些都是 Spring 的「內部機制」。從這章開始，我們要進入 Spring Boot 最重要的實戰領域——Spring MVC，也就是「前後端溝通」的核心模組。

今天這章是概念介紹，沒有新的程式碼要寫，但有一個小小的驚喜——你會發現從第三章開始，我們早就在用 Spring MVC 了。
-->

---
layout: default
---

# Outline

- **回顧：前端和後端的差別** — 搞清楚前後端各自的工作，理解為什麼需要溝通
- **什麼是 Spring MVC？** — MVC 的概念、Spring MVC 的定義與運作流程
- **補充：原來我們已經用過 Spring MVC 了？** — 從第三章的程式碼看 Spring MVC 的痕跡
- **章節總結** — 為後續實作做好準備

<!--
今天這章主要是建立概念，讓大家知道「Spring MVC 是什麼」以及「我們為什麼需要它」。

沒有新的 Annotation 要記，但這個概念對後續章節（HTTP 協定、URL 路徑、JSON、GET/POST）的理解都非常關鍵。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 回顧：前端和後端的差別

<!--
在介紹 Spring MVC 之前，我們先確認一件事：前端和後端到底各自負責什麼？這個問題搞清楚了，Spring MVC 的存在價值就自然浮現了。
-->

---

# 網頁是怎麼組成的？

想像你打開一個購物網站，頁面上你看到的東西，其實是兩個部分合在一起的結果：

| 部分 | 負責什麼 | 例子 |
| --- | --- | --- |
| **前端（Frontend）** | 網頁的排版與設計 | 按鈕的顏色、標題的大小、商品卡片的位置 |
| **後端（Backend）** | 資料的處理與儲存 | 商品的名稱、價格、評價內容、庫存數量 |

「網頁 = 前端的排版 + 後端的資料」——兩者各司其職，缺一不可。

<!--
大家想一下，你平常看到的網頁長什麼樣子。

以購物網站為例：頁面上的按鈕是圓的還是方的？顏色是橘色還是綠色？標題字多大？這些是前端決定的。

但商品叫什麼名字？價格是多少？有幾個人留過評價？這些是從資料庫撈出來的，是後端的工作。

前端負責「好不好看、好不好用」，後端負責「資料正不正確、業務邏輯對不對」。兩個人合作，才能做出一個完整的網頁。
-->

---

# 前後端如何協作？

前端不能直接存取資料庫，必須透過後端提供的 **API** 來取得資料：

| 步驟 | 動作 | 說明 |
| --- | --- | --- |
| 1 | 前端向後端發送請求 | 例如：「給我所有商品的清單」 |
| 2 | 後端接收請求，查詢資料庫 | 從 DB 撈出商品資料 |
| 3 | 後端將資料整理後回傳 | 以 JSON 格式傳給前端 |
| 4 | 前端收到資料，渲染畫面 | 把商品名稱、價格等顯示在頁面上 |

「前端負責問，後端負責答——API 就是前後端之間的溝通語言。」

<!--
前端和後端雖然分工明確，但它們需要溝通——前端需要資料，後端需要知道前端要什麼。

這個溝通的橋樑叫做 API（Application Programming Interface）。

前端發送一個 HTTP 請求，後端接收請求、處理資料，然後把結果以 JSON 格式回傳給前端。前端收到資料之後，再把它渲染成畫面。

這個流程在每一個現代網站和 App 裡都在發生。每次你刷新頁面、按下按鈕，背後可能就有幾十個 API 在被呼叫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# 什麼是 Spring MVC？

<!--
了解了前後端需要溝通之後，問題來了：後端要怎麼「接住」前端的請求，再把資料「回傳」給前端？

這就是 Spring MVC 的工作。
-->

---

# MVC 是什麼？

**MVC** 是一種軟體設計模式，全名是 **Model-View-Controller**，把應用程式的職責分成三個角色：

| 角色 | 英文 | 在 Spring Boot 中的對應 |
| --- | --- | --- |
| **模型** | Model | 資料與業務邏輯（Java Bean、Service 層） |
| **視圖** | View | 使用者看到的畫面（REST API 中通常是 JSON） |
| **控制器** | Controller | 接收請求，協調 Model 和 View，決定回傳什麼 |

「MVC 的精神：每個角色只做自己的事，不互相干涉。」

<!--
MVC 是一個很老的設計概念，但在 Web 開發裡一直非常主流。

M（Model）就是資料本身，以及跟資料相關的業務邏輯。

V（View）就是使用者看到的東西。在傳統的 Web 開發裡，View 是 HTML 頁面；在前後端分離的 REST API 架構中，View 通常是 JSON 格式的資料，前端收到後自己渲染成畫面。

C（Controller）是中間人，負責接收前端的請求，問 Model 要資料，然後把資料整理成 View（JSON）回傳給前端。

Spring MVC 就是把這個設計模式落地到 Java Web 開發的框架。
-->

---

# Spring MVC 的定義

**「Spring MVC 的用途，就是讓我們能夠在 Spring Boot 中，實作前後端之間的溝通。」**

| 功能 | 說明 |
| --- | --- |
| **接收 HTTP 請求** | 根據 URL 路徑，把請求導向對應的 Controller 方法 |
| **接收前端參數** | 解析 URL 參數、Request Body 中的資料 |
| **回傳 HTTP 回應** | 把 Java 物件自動轉換成 JSON 格式回傳給前端 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>重點：</b> Spring MVC 讓我們只需要專注在「業務邏輯」，不需要手動解析 HTTP 請求或手動組裝回應格式。
</div>

<!--
Spring MVC 解決的問題很直接：前端和後端要溝通，後端需要一個機制來「接住」前端的請求，處理完後「回傳」結果。

在沒有 Spring MVC 的年代，Java Web 開發者要手動解析 HTTP 請求、自己讀 URL 參數、自己組裝 JSON——非常繁瑣。

Spring MVC 把這些繁瑣的工作都封裝起來了，讓我們只需要寫業務邏輯，其他的 Spring MVC 幫我們搞定。
-->

---

# Spring MVC 的運作流程

前端發送一個請求到後端，Spring MVC 的處理流程：

| 步驟 | 負責的元件 | 動作 |
| --- | --- | --- |
| 1 | **前端** | 發送 HTTP 請求（例如：`GET /products`） |
| 2 | **DispatcherServlet** | Spring MVC 的核心，接收所有進來的請求 |
| 3 | **Controller** | 根據 URL 找到對應方法，執行業務邏輯 |
| 4 | **Spring MVC** | 把 Controller 回傳的 Java 物件轉換成 JSON |
| 5 | **前端** | 收到 JSON 格式的回應，渲染成畫面 |

「從請求進來到回應出去，Spring MVC 自動幫你串起整個流程。」

<!--
這是 Spring MVC 完整的請求處理流程。

第一步：前端發送一個 HTTP 請求，可能是瀏覽器的 GET 請求，也可能是 App 的 POST 請求。

第二步：DispatcherServlet 是 Spring MVC 的「總接線生」，所有進來的請求都先到它這裡，由它決定要轉給哪個 Controller 處理。

第三步：DispatcherServlet 根據 URL 路徑（我們在 @RequestMapping 裡設定的），找到對應的 Controller 方法並執行。

第四步：Controller 方法執行完，回傳一個 Java 物件或字串，Spring MVC 自動幫我們把它轉成 JSON 格式。

第五步：前端收到 JSON，把資料顯示在畫面上。

整個流程裡，Spring MVC 幫我們處理了第 2、4 步——我們只需要寫第 3 步的業務邏輯就好了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 補充
# 原來我們已經用過 Spring MVC 了？

<!--
好，現在讓我們回想一下第三章寫的第一個 Spring Boot 程式。

那個程式有沒有用到 Spring MVC？答案是：有，而且全程都在用。
-->

---

# 回顧第三章 — 第一個 Spring Boot 程式

還記得第三章寫的第一個程式嗎？

```java
@RestController
public class MyController {

    @RequestMapping("/test")
    public String test() {
        return "Hello World";
    }
}
```

我們輸入 `http://localhost:8080/test`，瀏覽器回傳 `Hello World`——這就是 Spring MVC 在運作！

<!--
這段程式碼大家應該很熟悉，從第三章就一直在用它。

但現在我們有了更完整的知識，可以解釋這段程式碼的背後發生了什麼：

@RestController 告訴 Spring 這是一個 Controller，所有 HTTP 請求可以交由它處理。

@RequestMapping("/test") 告訴 Spring MVC：如果有人發送請求到 `/test` 這個路徑，就執行 test() 這個方法。

test() 方法回傳的 "Hello World" 字串，Spring MVC 自動幫我們組裝成 HTTP 回應，傳回給瀏覽器。

我們從第三章開始就在用 Spring MVC 了，只是那時候還不知道它叫什麼名字。
-->

---

# 這段程式碼就是 Spring MVC！

| 程式碼 | Spring MVC 的角色 | 說明 |
| --- | --- | --- |
| `@RestController` | Controller（C） | 宣告這個類別負責接收 HTTP 請求 |
| `@RequestMapping("/test")` | URL 路由 | 把 `/test` 路徑對應到 test() 方法 |
| `return "Hello World"` | View（回應內容） | Spring MVC 自動組裝成 HTTP 回應回傳給前端 |

「`@RestController` 就是 MVC 中的 C（Controller）。我們從第三章開始就在用 Spring MVC 了。」

<!--
現在把第三章的程式碼和 MVC 的概念對照起來看，是不是很清楚了？

@RestController 就是 MVC 裡的 Controller——它接收請求，決定要執行哪個方法。

return "Hello World" 就是 MVC 裡的 View——在 REST API 的世界裡，View 就是我們回傳給前端的內容，可以是字串，也可以是 JSON 物件。

@RequestMapping 就是「路由」，把 URL 路徑和 Controller 方法連接起來。

所以 Spring MVC 從來就不是一個陌生的東西，我們從第一個 Spring Boot 程式開始就在用它了。
-->

---

# Spring MVC 後續要學的內容

接下來幾章會深入學習 Spring MVC 的各項功能：

| 章節主題 | 核心 Annotation | 說明 |
| --- | --- | --- |
| HTTP 協定 | — | 了解前後端溝通的底層規範 |
| URL 路徑設定 | `@RequestMapping` | 如何設計 API 路徑 |
| 接收前端參數 | `@RequestParam`、`@RequestBody` | 取得 URL 參數與 Request Body |
| 回傳 JSON | `@RestController` | 自動序列化 Java 物件 |
| RESTful API | `@GetMapping`、`@PostMapping` | 遵循 REST 設計風格的 API |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>學習路徑：</b> 後續每一章都是在 Spring MVC 的框架下加深功能，有了今天的基礎，後續章節的脈絡會更清晰。
</div>

<!--
接下來幾章，我們會把 Spring MVC 的每個功能都深入學習。

今天我們知道了 Spring MVC 是什麼、它的運作流程是什麼，這是一個很重要的基礎。

後續章節會一個一個把表格裡的功能學完：如何設計 URL 路徑、如何接收前端傳來的參數、如何回傳 JSON 格式的資料、如何遵循 RESTful API 的設計風格。

有了今天的概念，後面學起來會快很多，因為你知道每個 Annotation 的背後都是 Spring MVC 在幫你工作。
-->

---

# 章節總結

- **前端 vs 後端**：前端負責排版設計，後端負責資料處理；兩者透過 API 溝通
- **MVC**：Model（資料）、View（畫面 / JSON）、Controller（控制器），各司其職
- **Spring MVC 的用途**：在 Spring Boot 中實作前後端之間的溝通
- **Spring MVC 的運作**：接收 HTTP 請求 → 找到對應 Controller → 執行邏輯 → 回傳回應
- **早就在用了**：`@RestController`、`@RequestMapping` 都是 Spring MVC 的 Annotation

下一章我們會學 HTTP 協定，了解前後端溝通的底層規範——這是理解所有 Spring MVC 功能的基礎。

<!--
好，今天的內容是概念性的，讓我們快速整理一下。

Spring MVC 的存在是為了解決一個問題：前端需要向後端要資料，後端需要一個機制來接收請求和回傳結果。

MVC 的概念把這件事拆成三個角色：Controller 接住請求、Model 處理資料、View 決定回傳格式。在 REST API 的世界裡，View 通常就是 JSON。

最重要的一個發現：我們從第三章開始就在用 Spring MVC 了——`@RestController` 和 `@RequestMapping` 都是 Spring MVC 的核心 Annotation。

下一章學 HTTP 協定，學完之後你會對「前端發送請求、後端回傳回應」這個過程有更深的理解。

有問題嗎？
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
大家今天了解了 Spring MVC 是什麼、為什麼需要它，以及它和我們已經寫過的程式碼的關聯。

這章比較輕鬆，沒有新的程式碼要練習，但概念很重要——後面每一章都會在這個基礎上延伸。

有問題嗎？
-->
