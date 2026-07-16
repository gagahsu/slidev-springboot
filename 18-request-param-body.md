---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 取得請求參數（上）—@RequestParam、@RequestBody
routeAlias: ch18
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
    取得請求參數（上）<br>@RequestParam、@RequestBody
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「前端傳來的資料，Spring Boot 要怎麼接住？」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，上一章我們學了 GET 和 POST 的差別——GET 把參數放在 URL 後面，POST 把參數放在 Request Body 裡。

但學完之後，大家可能會有一個問題：前端把參數傳過來了，那後端的 Spring Boot 要怎麼「接住」這些參數呢？

這一章就是要解決這個問題。我們會介紹四個取得請求參數的 Annotation，並重點學習其中最常用的兩個：@RequestParam 和 @RequestBody。
-->

---
layout: default
---

# Outline

- **四個取得請求參數的 Annotation** — 全貌總覽，對應不同的參數來源
- **@RequestParam** — 接住 URL Query String 的參數、必填與選填設定
- **@RequestBody** — 接住 Request Body 的 JSON，自動反序列化成 Java 物件
- **章節總結** — 兩者對應關係整理，下一章預告

<!--
今天的大綱很清楚。先介紹四個 Annotation 的全貌，然後分別深入 @RequestParam 和 @RequestBody。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 前言

## 在 Spring Boot 中取得請求參數的四個 Annotation

<!--
首先，讓我們先看看 Spring Boot 提供了哪些工具來接收前端傳來的參數。
-->

---

# 取得請求參數的四個 Annotation

| Annotation | 用途 | 對應來源 |
| --- | --- | --- |
| `@RequestParam` | 接住 URL 後面的 Query String 參數 | GET 的 `?id=123` |
| `@RequestBody` | 接住 Request Body 的 JSON 資料 | POST 的 Body |
| `@RequestHeader` | 接住 Request Header 的值 | `Content-Type`, `Authorization` |
| `@PathVariable` | 接住 URL 路徑中的變數 | `/users/{id}` 的 `{id}` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>本章重點：</b> @RequestParam 和 @RequestBody。下一章介紹 @RequestHeader 和 @PathVariable。
</div>

<!--
Spring Boot 提供四個 Annotation 來接收前端傳來的參數，分別對應不同的來源。

@RequestParam 對應 GET 的 Query String，就是 URL 問號後面的參數。
@RequestBody 對應 POST 的 Request Body，通常是 JSON 格式。
@RequestHeader 讀取 Http Request 的 Header。
@PathVariable 讀取 URL 路徑本身的變數，例如 /users/123 裡的 123。

這章我們先學前兩個，它們也是最常用的。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 接住添加在 URL 後面的參數<br>@RequestParam

<!--
先來看 @RequestParam。
-->

---

# @RequestParam 的定義

| 項目 | 說明 |
| --- | --- |
| 用途 | 接收 URL Query String 中的參數 |
| 使用情境 | 搭配 GET 請求（參數放在 URL 後面） |
| 參數格式 | `?key=value`，多個用 `&` |
| 命名規則 | 用 `@RequestParam("id")` **明確指定**對應 URL 的 key |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> Spring Boot 3.2 起，只寫 <code>@RequestParam</code> 不指定名稱，需依賴編譯時的 <code>-parameters</code> 參數才能運作，否則會拋出 <code>Name for argument ... not specified</code> 錯誤。<b>建議一律明確寫出名稱</b>。
</div>

<!--
@RequestParam 的用途是接收 URL 後面的 Query String 參數。

最重要的規則是：在 @RequestParam 的括號裡明確指定要對應 URL 的哪個 key。
例如 URL 是 ?id=123，就寫 @RequestParam("id")。

有些教材會只寫 @RequestParam 不加名稱，讓 Spring 用方法參數名稱去對應。但 Spring Boot 3.2（Spring Framework 6.1）之後，這種寫法需要編譯時加上 -parameters 參數保留參數名稱，不然啟動或呼叫時會報錯。用 IDE 直接編譯常常沒有帶這個參數，所以建議大家一律明確寫出名稱，最不容易踩雷。
-->

---

# @RequestParam 基本用法

當前端發送 `GET http://localhost:8080/test1?id=123` 時，用 `@RequestParam("id")` 接住 `id`：

```java
@RestController
public class MyController {

    @RequestMapping("/test1")
    public String test1(@RequestParam("id") Integer id) {
        System.out.println("id: " + id);
        return "請求成功";
    }
}
```

<!--
看這個例子。我們在方法參數前面加上 @RequestParam("id")，括號裡的 "id" 告訴 Spring Boot 要去 URL 找名叫 id 的參數，把值塞進這個方法參數。

注意參數類型是 Integer，因為 URL 傳來的 id 是一個整數。
如果你把類型設成 String 也可以，Spring Boot 會幫你轉換，但如果設成 Integer 就更精確。

執行後，console 會印出 "id: 123"，說明 Spring Boot 成功讀取到 URL 的參數了。
-->

---

# @RequestParam 執行結果

| 前端發送的 URL | 後端讀取到的值 | Console 輸出 |
| --- | --- | --- |
| `/test1?id=123` | `id = 123` | `id: 123` |
| `/test1?id=456` | `id = 456` | `id: 456` |
| `/test1`（沒帶參數） | — | `400 Bad Request` |

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意：</b> @RequestParam 預設是必填的，前端若沒帶這個參數，Spring Boot 會回傳 400 Bad Request。
</div>

<!--
看執行結果。

URL 帶了 ?id=123，後端就讀到 123；帶了 ?id=456，就讀到 456。

但如果前端完全沒帶 id 參數，Spring Boot 預設會回傳 400 Bad Request，因為 @RequestParam 預設是必填的。

這個行為可以透過 required = false 修改，讓參數變成選填，但初學階段先記住預設是必填就好。
-->

---

# @RequestParam：括號裡的名稱對應 URL 的 key

括號裡的名稱決定去 URL 找哪個 key，方法參數名稱可以不同：

| URL key | 寫法 | 方法參數名稱 |
| --- | --- | --- |
| `id` | `@RequestParam("id")` | `id`（建議一致，好讀） |
| `myId` | `@RequestParam("myId")` | `id`（也能運作） |

```java
// URL: /test1?myId=123
@RequestParam("myId") Integer id
```

<!--
括號裡的名稱才是 Spring Boot 對應 URL key 的依據，方法參數叫什麼名字其實不影響。

例如 URL 的 key 是 myId，寫 @RequestParam("myId")，值就會放進後面的方法參數，即使參數叫 id 也沒問題。

實務上，建議讓括號裡的名稱和方法參數名稱一致，程式碼更容易讀懂。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 接住放在 Request Body 中的參數<br>@RequestBody

<!--
了解了 @RequestParam，現在來看 @RequestBody。
-->

---

# @RequestBody 的定義

| 項目 | 說明 |
| --- | --- |
| 用途 | 接收 Request Body 中的 JSON 資料 |
| 使用情境 | 搭配 POST 請求（資料放在 Body） |
| 資料格式 | JSON 格式，需要設定 `Content-Type: application/json` |
| 接收方式 | 建立一個對應的 Java 類別來接住 JSON |

<!--
@RequestBody 用來接收 POST 請求的 Request Body 裡的 JSON 資料。

和 @RequestParam 不同的是，@RequestBody 不是接收一個個的值，而是接收整個 JSON 物件。
因此我們需要建立一個對應的 Java 類別，讓 Spring Boot 自動把 JSON 轉換成這個類別的物件。

這個概念和第十六章我們讓 Java 物件自動轉成 JSON 相反——現在是 JSON 轉成 Java 物件。
-->

---

# 建立對應的 Java 類別

建立一個 `Student.java`，欄位和 JSON 的 key **名稱與類型**必須一一對應：

```java
public class Student {
    private Integer id;
    private String name;
    // 需要加上 Getter 和 Setter（參考第十六章）
}
```

| JSON key | Java 欄位 | 類型 |
| --- | --- | --- |
| `"id"` | `id` | `Integer` |
| `"name"` | `name` | `String` |

<!--
使用 @RequestBody 之前，需要先建立一個對應的 Java 類別。

這個類別的欄位名稱和類型，必須和前端傳來的 JSON 的 key 完全對應。
例如 JSON 是 {"id": 123, "name": "Judy"}，那 Java 類別就要有 Integer id 和 String name 兩個欄位。

另外記得加上 Getter 和 Setter，Spring Boot 的 Jackson 需要透過 Setter 把 JSON 的值寫進物件的欄位裡。
-->

---

# @RequestBody 基本用法

當前端發送 POST 請求並帶 JSON Body 時，用 `@RequestBody` 接住整個 JSON 物件：

```java
@RestController
public class MyController {

    @RequestMapping("/test2")
    public String test2(@RequestBody Student student) {
        System.out.println("id: " + student.getId());
        System.out.println("name: " + student.getName());
        return "請求成功";
    }
}
```

<!--
看這個例子。在方法參數前加上 @RequestBody，Spring Boot 就會自動把 Request Body 的 JSON 轉成 Student 物件。

我們可以直接用 student.getId() 和 student.getName() 讀取值。

完全不需要手動解析 JSON 字串，Spring Boot 的 Jackson 全部幫我們處理好了。

⚠️ 注意方法參數是 Student student，不是 Integer 或 String。@RequestBody 是對應整個 JSON 物件，所以需要一個類別來承接。
-->

---

# @RequestBody 執行結果

前端發送 `POST http://localhost:8080/test2`，Body 為：

```json
{
    "id": 123,
    "name": "Judy"
}
```

| 後端讀取到的值 | Console 輸出 |
| --- | --- |
| `student.getId()` → `123` | `id: 123` |
| `student.getName()` → `"Judy"` | `name: Judy` |

<!--
執行結果：後端成功讀到了前端傳來的 id 和 name。

流程是這樣的：前端發送 POST 請求，把 JSON 放在 Body 裡；
Spring Boot 的 Jackson 把 JSON 解析成 Student 物件；
我們用 getter 方法取值，印在 console 上。

到這裡，我們已經能做到雙向的 JSON 處理了——第十六章是 Java 物件轉 JSON 送出，這章是 JSON 接進來轉成 Java 物件。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 四個取得參數的 Annotation | `@RequestParam`、`@RequestBody`、`@RequestHeader`、`@PathVariable` |
| `@RequestParam` | 接 URL Query String，用 `@RequestParam("xxx")` 明確指定 key，預設必填 |
| `@RequestBody` | 接 Request Body 的 JSON，需建立對應 Java 類別 |
| 為何要明確指定名稱 | Spring Boot 3.2 起省略名稱需依賴 `-parameters` 編譯參數，容易踩雷 |
| 下一步 | 學習 `@RequestHeader` 和 `@PathVariable` |

<!--
今天的重點總結。

第一，Spring Boot 提供四個取得請求參數的 Annotation，分別對應不同的來源。
第二，@RequestParam 接 URL 後面的 Query String，記得在括號裡明確指定 key 的名稱。
第三，@RequestBody 接 Request Body 的 JSON，需要建立對應的 Java 類別。
第四，明確指定名稱是為了避開 Spring Boot 3.2 之後對 -parameters 編譯參數的依賴。
第五，下一章我們繼續學 @RequestHeader 和 @PathVariable。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習

## 會員系統：搜尋與註冊

<!--
學完了 @RequestParam 和 @RequestBody，我們用一個會員系統的情境來練習。
-->

---

# 實作題目（1/2）：搜尋會員 API

請實作一個簡單的會員系統，包含兩個 API。第一個是搜尋會員：

| 項目 | 內容 |
| --- | --- |
| 請求 | `GET /members/search?keyword=judy&limit=5` |
| 要求 | 用 `@RequestParam` 接住 `keyword`（字串）和 `limit`（整數） |
| 回傳 | 字串 `"搜尋關鍵字: judy, 最多回傳 5 筆"` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> 這次要一次接住<b>兩個</b>參數，想想 @RequestParam 該怎麼寫？
</div>

<!--
這個題目模擬真實的會員系統場景，共有兩個 API。

第一個 API 是搜尋，參數放在 URL——注意這次要一次接兩個參數：keyword 和 limit，練習 @RequestParam 同時使用多次。

下一頁是第二個 API 的需求。
-->

---

# 實作題目（2/2）：註冊會員 API

第二個 API 是註冊會員：

| 項目 | 內容 |
| --- | --- |
| 請求 | `POST /members/register`，Body 為 `{"email": "judy@gmail.com", "password": "abc123"}` |
| 要求 | 建立 `Member` 類別（用 Lombok `@Data`），用 `@RequestBody` 接住 |
| 回傳 | 字串 `"註冊成功, email: judy@gmail.com"` |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>想一想：</b> 為什麼註冊（帳號密碼）要用 POST 放在 Body，而不是用 GET 放在 URL？
</div>

<!--
第二個 API 是註冊，帳號密碼是敏感資訊，所以用 POST 放在 Body 裡，正好呼應上一章「密碼不要放 URL」的觀念。

記得 Member 類別要用 Lombok 的 @Data，別再手寫 Getter/Setter 了。
大家先動手做，再看下一頁的參考解答。
-->

---

# 參考解答（1/2）：搜尋會員

一個方法可以同時使用多個 `@RequestParam`：

```java
@RestController
public class MemberController {

    @RequestMapping("/members/search")
    public String search(@RequestParam("keyword") String keyword,
                         @RequestParam("limit") Integer limit) {
        return "搜尋關鍵字: " + keyword + ", 最多回傳 " + limit + " 筆";
    }
}
```

| 測試 | 結果 |
| --- | --- |
| `GET /members/search?keyword=judy&limit=5` | `搜尋關鍵字: judy, 最多回傳 5 筆` |
| `GET /members/search?keyword=judy`（少了 limit） | `400 Bad Request` |

<!--
第一個 API 的解答。

重點是：一個方法可以同時放多個 @RequestParam，每個參數各自對應 URL 裡的一個 key。
keyword 對應 ?keyword=judy，limit 對應 &limit=5。

注意第二列的測試：因為 @RequestParam 預設必填，少帶了 limit 就會收到 400 Bad Request。
-->

---

# 參考解答（2/2）：註冊會員

**Step 1：建立 `Member` 類別**

```java
import lombok.Data;

@Data
public class Member {
    private String email;
    private String password;
}
```

**Step 2：用 `@RequestBody` 接住 JSON**

```java
@RequestMapping("/members/register")
public String register(@RequestBody Member member) {
    return "註冊成功, email: " + member.getEmail();
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 測試時記得 Method 選 <code>POST</code>、Body 填入 JSON：<code>{"email": "judy@gmail.com", "password": "abc123"}</code>。
</div>

<!--
第二個 API 的解答。

先建立 Member 類別，欄位名稱 email、password 必須和 JSON 的 key 完全一致。用 @Data 讓 Lombok 生成 Getter/Setter，Jackson 才能透過 Setter 把 JSON 的值寫進欄位。

Controller 方法用 @RequestBody Member member 接住整個 JSON 物件，再用 getEmail() 取值組出回應字串。

測試時記得：Method 選 POST，Body 填 JSON。如果收到 400 或 415，先檢查 Content-Type 是不是 application/json。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
