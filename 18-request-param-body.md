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
| 命名規則 | 方法參數名稱必須和 URL 的 key **完全一致** |

<!--
@RequestParam 的用途是接收 URL 後面的 Query String 參數。

最重要的規則是：方法參數的名稱必須和 URL 的 key 完全一致。
例如 URL 是 ?id=123，那方法參數就要叫做 id，不能叫做 studentId 或其他名稱。

不過如果真的名稱不一致，有個方法可以解決，後面會介紹。
-->

---

# @RequestParam 基本用法

當前端發送 `GET http://localhost:8080/test1?id=123` 時，用 `@RequestParam` 接住 `id`：

```java
@RestController
public class MyController {

    @RequestMapping("/test1")
    public String test1(@RequestParam Integer id) {
        System.out.println("id: " + id);
        return "請求成功";
    }
}
```

<!--
看這個例子。我們在方法參數前面加上 @RequestParam，Spring Boot 就會自動把 URL 裡的 id 值塞進這個參數。

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

# @RequestParam：參數名稱不一致時

若 URL 的 key 和方法參數名稱不同，用 `name` 屬性指定對應的 key：

| URL key | 方法參數名稱 | 解法 |
| --- | --- | --- |
| `id` | `id` | 直接使用，名稱一致 |
| `myId` | `id` | 加上 `name = "myId"` |

```java
// URL: /test1?myId=123
@RequestParam(name = "myId") Integer id
```

<!--
如果 URL 的 key 是 myId，但我們方法裡的參數想叫做 id，怎麼辦？

加上 name 屬性就能解決：@RequestParam(name = "myId")，這樣 Spring Boot 就知道要從 URL 的 myId 這個 key 讀值，然後放進 id 這個方法參數裡。

實務上，建議盡量讓 URL key 和參數名稱一致，這樣程式碼更容易讀懂。
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
| `@RequestParam` | 接 URL Query String，參數名稱需一致，預設必填 |
| `@RequestBody` | 接 Request Body 的 JSON，需建立對應 Java 類別 |
| 名稱不一致時 | `@RequestParam(name = "xxx")` 指定對應的 key |
| 下一步 | 學習 `@RequestHeader` 和 `@PathVariable` |

<!--
今天的重點總結。

第一，Spring Boot 提供四個取得請求參數的 Annotation，分別對應不同的來源。
第二，@RequestParam 接 URL 後面的 Query String，名稱必須一致。
第三，@RequestBody 接 Request Body 的 JSON，需要建立對應的 Java 類別。
第四，名稱不一致時，@RequestParam(name = "xxx") 可以手動指定對應關係。
第五，下一章我們繼續學 @RequestHeader 和 @PathVariable。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
