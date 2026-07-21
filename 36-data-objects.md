---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Spring Boot 資料物件—PO、DTO、VO、DAO
routeAlias: ch36
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
大家好，在學了三層架構（Controller-Service-Dao）之後，今天要介紹另一個業界非常重要的概念——資料物件的分類。

在真實的後端專案中，我們不會用同一個 Java 類別來做所有事情。
資料庫的資料、API 接收的資料、API 回傳的資料、業務邏輯裡的資料，都應該用不同的物件來表示。

今天要介紹四個縮寫：PO、DTO、VO、DAO，學完之後你就能讀懂業界程式碼裡常見的命名規則。
-->

---
layout: default
---

# 本章大綱

| 章節 | 內容 |
| --- | --- |
| 前言 | 為什麼需要不同的資料物件？ |
| Part 1 | PO（Persistent Object）— 資料庫映射物件 |
| Part 2 | DTO（Data Transfer Object）— 資料傳輸物件 |
| Part 3 | VO（Value Object）— 值物件 |
| Part 4 | DAO（Data Access Object）— 資料存取物件 |
| 總結 | 四個物件完整比較 + 章節總結 |

<!--
今天的重點是概念理解，程式碼範例會搭配說明。學完之後，你會理解為什麼業界的專案裡有那麼多不同後綴的類別（xxxRequest、xxxResponse、xxxPO 等等）。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 前言

## 為什麼需要不同的資料物件？

<!--
先從問題情境開始：不分類的話會遇到什麼麻煩？
-->

---

# 問題情境：一個 Student 類別打天下

假設我們只有一個 Student 類別：

| 欄位 | 用途 | 問題 |
| --- | --- | --- |
| `id` | 資料庫主鍵 | 新增時不需要（DB 自動產生） |
| `name` | 學生姓名 | 所有場景都需要 |
| `password` | 密碼（資料庫存儲） | **不應該出現在 API 回應裡！** |
| `createdAt` | 建立時間（DB 自動填） | 前端不需要傳入 |

<div class="mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
⚠️ <b>問題：</b> 如果前端發送新增請求，不應該帶 id；如果後端回傳資料，不應該包含 password。一個類別無法同時滿足所有情境。
</div>

<!--
想像一下：你的 Student 類別有 id、name、password、createdAt 四個欄位。

前端新增學生時，傳過來的資料應該只有 name 和 password，不應該有 id（因為 id 是資料庫自動產生的）。

後端回傳學生資料給前端時，應該包含 id 和 name，但絕對不應該包含 password——把密碼暴露給前端是嚴重的安全漏洞！

這就是為什麼我們需要不同的資料物件：讓每個場景使用最合適的資料結構，既安全又清晰。
-->

---

# 解決方案：不同層次，不同物件

| 物件類型 | 使用層次 | 核心用途 |
| --- | --- | --- |
| **PO** | Dao 層 ↔ 資料庫 | 對應資料庫的欄位，映射整張表格 |
| **DTO** | Controller 層 ↔ 前端 | API 的請求（Request）和回應（Response） |
| **VO** | Service 層 ↔ Controller 層 | 業務邏輯的值，通常是唯讀的 |
| **DAO** | 負責資料庫操作的類別 | 封裝 SQL 查詢邏輯，不是資料物件 |

<!--
解決方案就是「讓每一層使用最適合它的物件」。

PO 對應資料庫表格，完整包含所有欄位，只在 Dao 層和資料庫之間流動。
DTO 用於 API 的輸入和輸出，可以根據需要選擇性地包含欄位（例如回應時去掉 password）。
VO 是業務邏輯的值物件，通常是不可修改的。
DAO 嚴格來說不是資料物件，而是封裝資料庫操作邏輯的類別（我們在第三十章學過的 StudentDao）。

接下來一個一個詳細介紹。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## PO（Persistent Object）<br>資料庫映射物件

<!--
先介紹 PO，它是最靠近資料庫的那層物件。
-->

---

# 什麼是 PO（Persistent Object）？

| 項目 | 說明 |
| --- | --- |
| 全名 | Persistent Object（持久化物件） |
| 定義 | 「一個 Java 類別，對應到資料庫的一張表格」 |
| 特性 | 欄位和資料庫欄位一一對應，包含所有欄位 |
| 使用層次 | Dao 層（資料庫 ↔ Java 的橋樑） |
| 常見命名 | `StudentPO`、`Student`（JPA 的 @Entity） |

<!--
PO 的全名是 Persistent Object，「持久化」的意思是「存進資料庫、從資料庫讀出來」。

一個 PO 類別就對應資料庫的一張表格，類別的每個欄位對應表格的每個欄位。

在 Spring Data JPA 裡，加了 @Entity 的類別就是 PO；在 Spring JDBC 裡，用 RowMapper 映射的 Student 類別也扮演 PO 的角色。

PO 只在 Dao 層流動，不應該直接傳給前端。
-->

---

# PO 在三種框架中的對應

三種框架都有 PO 概念，只是名稱和標註方式不同：

| 技術 | PO 的對應物 | 特徵 |
| --- | --- | --- |
| Spring JDBC | RowMapper 映射出的 `Student` | 純 POJO，欄位對應 SQL 查詢結果，無框架標註 |
| MyBatis | `@Mapper` 方法回傳的 `Student`（常稱 MyBatis PO） | 純 POJO，欄位對應 resultType／resultMap，無框架標註 |
| Spring Data JPA | `@Entity` 的 `Student` | 帶 `@Entity`、`@Id`、`@Column` 等標註，多了 persistence context 生命週期 |

<!--
三種框架都有 PO 的概念，只是實作方式不同：
Spring JDBC 裡，RowMapper 映射出來的 Student 類別就是 PO，是純粹的 POJO，沒有任何框架標註。
MyBatis 也一樣，@Select／resultMap 映射出來的 Student 類別也是 PO（業界常稱 MyBatis PO），同樣是純 POJO。
Spring Data JPA 裡，加了 @Entity 的類別才是 PO，而且多了 ORM 的標註（@Id、@Column）和 persistence context 生命週期管理，這是三者中最「重」的一種。
-->

---

# PO 程式碼範例

PO 包含所有資料庫欄位，包括敏感資料：

```java
@Entity
public class StudentPO {
    private Integer id;
    private String name;
    private String password; // 資料庫有，但不應傳給前端
    private String createdAt;
}
```

| 欄位 | 說明 |
| --- | --- |
| `id` | 主鍵，資料庫自動產生 |
| `password` | 敏感資料，只在 Dao 層使用，不對外暴露 |

<!--
看這個 PO 的範例。

它包含了資料庫表格的所有欄位，包括 password 這個敏感資料和 createdAt 這個時間戳。

重要：PO 只在 Dao 層使用，不應該直接 return 給 Controller 再傳給前端。
如果你把含有 password 的 PO 直接 return，前端就能看到所有使用者的密碼，這是非常嚴重的安全漏洞。

這就是為什麼我們需要 DTO 來做 API 的輸入和輸出。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## DTO（Data Transfer Object）<br>資料傳輸物件

<!--
DTO 是後端開發中最常用到的概念之一。
-->

---

# 什麼是 DTO（Data Transfer Object）？

| 項目 | 說明 |
| --- | --- |
| 全名 | Data Transfer Object（資料傳輸物件） |
| 定義 | 「在不同層之間或跨網路傳輸資料的輕量物件」 |
| 特性 | 只包含需要的欄位，沒有業務邏輯 |
| 使用層次 | Controller 層（接收前端請求、回傳前端資料） |
| 兩種角色 | **Request DTO**（接收）和 **Response DTO**（回傳） |

<!--
DTO 的核心概念是「只傳必要的資料」。

Request DTO：前端發送請求時帶的資料格式，定義「我接受哪些欄位的輸入」。
Response DTO：後端回應前端時的資料格式，定義「我對外暴露哪些欄位」。

用 DTO 的好處是：
第一，安全——可以選擇不暴露 password 這類敏感欄位。
第二，彈性——不同 API 可以有不同的 Response DTO，回傳不同的欄位組合。
第三，清晰——光看類別名稱就知道它的用途（CreateStudentRequest vs StudentResponse）。
-->

---

# DTO 的兩種角色

| 角色 | 命名慣例 | 說明 | 不含欄位 |
| --- | --- | --- | --- |
| Request DTO | `CreateStudentRequest` | 前端新增時傳入的資料 | `id`（DB 自動產生）、`createdAt` |
| Response DTO | `StudentResponse` | 後端回傳給前端的資料 | `password`（敏感資料） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>命名慣例：</b> Request DTO 通常加 <code>Request</code> 後綴，Response DTO 加 <code>Response</code> 後綴，讓目的一目了然。
</div>

<!--
DTO 分成兩種：接收用和回傳用。

Request DTO：前端新增學生時，傳過來的應該只有 name 和 password，不需要 id（資料庫自動產生）和 createdAt。

Response DTO：後端回傳給前端時，應該包含 id 和 name，但絕對不包含 password。

透過這樣的設計，每個 DTO 的職責非常清楚，程式碼也更安全。
-->

---

# CreateStudentRequest — Request DTO

前端新增學生時傳入的資料格式：

```java
public class CreateStudentRequest {
    private String name;
    private String password;
}
```

| 特點 | 說明 |
| --- | --- |
| 不含 `id` | 主鍵由資料庫自動產生，前端不需要傳 |
| 不含 `createdAt` | 建立時間由後端自動填入 |
| 含 `password` | 新增時需要密碼，但後端不會回傳 |

<!--
看 CreateStudentRequest 的範例。

這個 DTO 只有 name 和 password 兩個欄位，因為前端新增學生時只需要這兩個資訊。

在 Controller 裡用 @RequestBody CreateStudentRequest request 接住前端傳來的 JSON，這樣就只接受 name 和 password，避免前端傳入非預期的欄位（例如自訂 id 或 createdAt）。
-->

---

# StudentResponse — Response DTO

後端回傳給前端的資料格式：

```java
public class StudentResponse {
    private Integer id;
    private String name;
    // 刻意不含 password！
}
```

| 特點 | 說明 |
| --- | --- |
| 不含 `password` | **安全考量**：密碼不應暴露給前端 |
| 含 `id` | 前端查詢時需要知道學生的 id |
| 僅包含必要欄位 | 減少不必要的資料傳輸 |

<!--
StudentResponse 是後端回傳給前端的物件。

最重要的設計決策：不包含 password。

Service 層在查詢到 StudentPO 之後，會把需要的欄位複製到 StudentResponse，故意略過 password，再把 StudentResponse 傳給 Controller 回應前端。

這個「把 PO 轉換成 Response DTO」的步驟，通常發生在 Service 層，有時候也用一些轉換工具（如 ModelMapper）來簡化這個過程。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## VO（Value Object）<br>值物件

<!--
VO 是四個中最容易和 DTO 搞混的，讓我們來仔細看看。
-->

---

# 什麼是 VO（Value Object）？

| 項目 | 說明 |
| --- | --- |
| 全名 | Value Object（值物件） |
| 定義 | 「以值的內容來識別，而非物件的記憶體位址」 |
| 核心特性 | **不可變（Immutable）**：建立後就不能修改 |
| 相等判斷 | 只要欄位值相同就視為相等（不看是否同一個物件） |
| 使用場景 | 貨幣、座標、顏色、地址等「值的概念」 |

<!--
VO 和 DTO 最大的差別在於：VO 是不可變的（Immutable）。

想像一下「金額」這個概念：100 元就是 100 元，你不會去「修改」100 元讓它變成 200 元，而是建立一個新的「200 元物件」。

VO 就是這樣：它的欄位一旦設定就不能改，如果需要「不同的值」，就建立一個新的 VO 物件。

在 Spring Boot 開發中，VO 的概念有時候和 DTO 的概念有所重疊，不同團隊的定義可能略有不同。
-->

---

# VO vs DTO 的差別

| 比較項目 | DTO | VO |
| --- | --- | --- |
| 可修改性 | 可變（有 setter） | **不可變（只有 constructor，無 setter）** |
| 用途 | 在層之間傳輸資料 | 表達「值」的概念，強調不變性 |
| 相等判斷 | 比較物件記憶體位址 | 比較欄位值是否相同 |
| 常見例子 | CreateStudentRequest | Money(100, "TWD")、Coordinate(x, y) |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>實務上：</b> 許多團隊把 DTO 和 VO 統稱為 DTO，在入門階段不需要嚴格區分，理解概念即可。
</div>

<!--
DTO 和 VO 最大的區別就是「可不可以改」。

DTO 通常有 getter 和 setter，建立後可以修改欄位值。
VO 只有 constructor（建構子），建立之後欄位值永遠不能改。

在 Java 中，VO 通常用 final 欄位 + 只有 constructor 沒有 setter 來實作。

不過在實務上，很多團隊不嚴格區分 DTO 和 VO，兩者常常混用。作為入門學習，理解「值物件是不可變的」這個核心概念就夠了。
-->

---

# VO 程式碼範例

VO 使用 `final` 欄位，只有 constructor，沒有 setter：

```java
public class MoneyVO {
    private final Integer amount;
    private final String currency;

    public MoneyVO(Integer amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }
}
```

<!--
看這個 MoneyVO 的範例。

所有欄位都是 final，一旦透過 constructor 設定值就不能再改。
沒有 setter 方法，外部無法修改金額或貨幣單位。

如果要表示「不同金額」，就建立新的 MoneyVO 物件，不能修改現有的。

這種不可變性讓程式碼更安全——你可以確信一個 MoneyVO 物件的值不會在某個地方被悄悄修改。

⚠️ Java 16+ 可以用 record 語法更簡潔地定義 VO，但基本概念是一樣的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## DAO（Data Access Object）<br>資料存取物件

<!--
最後來回顧一下 DAO，它和前三個有點不同——DAO 是一個設計模式，不是資料物件本身。
-->

---

# 什麼是 DAO（Data Access Object）？

| 項目 | 說明 |
| --- | --- |
| 全名 | Data Access Object（資料存取物件） |
| 定義 | 「封裝資料庫存取邏輯的類別，讓其他層不需要知道 SQL 細節」 |
| 本質 | 設計模式（Design Pattern），不是資料物件 |
| 在 Spring Boot | 就是我們學的 Dao 層（`StudentDao`，加 `@Repository`） |
| 和 PO/DTO/VO 的差別 | DAO 是「做事的類別」，PO/DTO/VO 是「裝資料的類別」 |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> DAO 是「類別/模式」，PO/DTO/VO 是「資料物件」，這是最容易混淆的地方。
</div>

<!--
DAO 和 PO、DTO、VO 有一個根本上的不同。

PO、DTO、VO 都是「裝資料的盒子」——純粹的資料容器，主要包含欄位、getter 和 setter。

DAO 則是「做事的工具」——它是一個設計模式，封裝了所有資料庫存取的邏輯。StudentDao 的 getStudentById() 方法裡有 SELECT SQL，create() 方法裡有 INSERT SQL。

所以 DAO 是第三十章學的 Dao 層類別，不是資料物件。這是四個縮寫裡最特別的一個。
-->

---

# 四個物件在三層架構中的位置

| 層次 | 接收的物件 | 回傳的物件 |
| --- | --- | --- |
| **Controller 層** | Request DTO（接前端）| Response DTO（回前端） |
| **Service 層** | Request DTO（來自 Controller）| Response DTO（往 Controller）|
| **Dao 層** | PO（轉換成 SQL 參數）| PO（資料庫查詢結果） |
| **DAO（類別本身）** | — | — （負責執行 SQL 的類別） |

<!--
把四個概念放到三層架構裡來看，就清楚多了。

Controller 接收前端傳來的 Request DTO（例如 CreateStudentRequest），處理完後回傳 Response DTO（例如 StudentResponse）給前端。

Service 把 Request DTO 的資料轉成 PO，呼叫 Dao 存入資料庫；或是從 Dao 取得 PO，再把需要的欄位轉成 Response DTO。

Dao 操作 PO——把 PO 轉成 SQL 參數，或是把查詢結果映射成 PO。

DAO 這個類別就是 StudentDao，它負責執行 SQL，不是資料物件本身。
-->

---

# PO / DTO / VO / DAO 完整比較

| 縮寫 | 全名 | 類型 | 所在層次 | 核心特性 |
| --- | --- | --- | --- | --- |
| **PO** | Persistent Object | 資料物件 | Dao 層 | 對應資料庫表格 |
| **DTO** | Data Transfer Object | 資料物件 | Controller 層 | 選擇性欄位，Request/Response |
| **VO** | Value Object | 資料物件 | Service/Controller | 不可變，以值識別 |
| **DAO** | Data Access Object | **設計模式（類別）** | Dao 層 | 封裝 SQL 邏輯 |

<!--
用這張表格做最終的四個概念完整比較。

最重要的區別記清楚：PO、DTO、VO 是「裝資料的物件」，DAO 是「做事的類別（設計模式）」。

PO 靠近資料庫，DTO 靠近 API，VO 強調不可變性。

在業界，你會看到各種以這些縮寫命名的類別：StudentPO、CreateStudentRequest、StudentResponse、MoneyVO 等等。看到這些命名，你就能馬上知道這個類別的用途和所在層次。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| PO | 對應資料庫表格，包含所有欄位，只在 Dao 層使用 |
| DTO | API 的輸入（Request）和輸出（Response），選擇性包含欄位 |
| VO | 不可變的值物件，以欄位值識別相等性 |
| DAO | 不是資料物件，而是封裝 SQL 邏輯的設計模式（類別） |
| 核心目的 | 不同層次使用不同物件，讓資料安全流動、職責清楚分離 |

<!--
今天的重點總結。

第一，PO 是資料庫的 Java 映射，包含所有欄位，包括敏感資料，只在 Dao 層流動。
第二，DTO 用於 API 的輸入和輸出，Request DTO 定義接收格式，Response DTO 定義回傳格式，可以刻意略過敏感欄位。
第三，VO 是不可變的值物件，建立後就不能修改。
第四，DAO 是設計模式，是封裝 SQL 的類別，不是資料物件本身。
第五，分類的核心目的是讓資料在層與層之間安全、清晰地流動。

這些概念在業界非常普遍，看懂它們之後，你就能更快速地理解真實專案的程式碼結構！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
