---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 返回值改成 JSON 格式—@RestController
routeAlias: ch16
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
  <h1 style="color: #1a5c5c; font-size: 3.2rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    返回值改成 JSON 格式<br>@RestController
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「Spring Boot 自動幫你把 Java 物件轉成 JSON」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，上一章我們學了 JSON 的格式。

但現在有個問題：我知道 JSON 長什麼樣子了，可是我要怎麼讓 Spring Boot 的 API 回傳 JSON 格式的資料呢？

這一章就是要解決這個問題。我們會看到，其實 @RestController 早就幫我們做好這件事了，而且用法非常簡單。
-->

---
layout: default
---

# Outline

- **回顧：到目前為止的返回數據** — 從回傳字串到回傳 Java 物件的演進
- **如何將返回值轉換成 JSON？** — Jackson 自動轉換機制、三步驟實作
- **用 Lombok 省略 Getter/Setter** — `@Data` 一個 Annotation 搞定
- **@Controller vs @RestController** — 差別、適用情境、現代開發建議
- **章節總結** — 核心概念整理

<!--
這章的重點是實作。我們會一步一步建立一個能回傳 JSON 的 API，最後再補充說明 @Controller 和 @RestController 的差別。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回顧

## 到目前為止的返回數據

<!--
先快速回顧一下我們目前的情況。
-->

---

# 回顧：到目前為止的返回數據

| 章節 | 回傳類型 | 回傳內容 |
| --- | --- | --- |
| Ch 3–14 | `String` | `"Hello World"` |
| Ch 15 | — | 學習了 JSON 格式 |
| **Ch 16（本章）** | **Java 物件** | **自動轉換成 JSON** |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>目標：</b> 讓 Controller 回傳一個 Java 物件，Spring Boot 自動把它轉成 JSON 格式回應給前端。
</div>

<!--
我們從第三章開始，Controller 一直都只能回傳字串。
上一章我們學了 JSON 格式是什麼。
這一章要把這兩件事合起來：讓 API 真正回傳 JSON。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 如何將 Spring Boot 的返回值轉換成 JSON 格式？

<!--
好，進入本章核心。我們要怎麼讓 Spring Boot 的 API 回傳 JSON？
-->

---

# Spring Boot 自動轉換的秘密

`@RestController` 會自動將回傳的 Java 物件轉換成 JSON 格式：

| 步驟 | 說明 |
| --- | --- |
| 1 | Controller 方法回傳一個 Java 物件（例如 `Student`） |
| 2 | `@RestController` 交給底層的 **Jackson** 函式庫處理 |
| 3 | Jackson 把 Java 物件的欄位轉成 JSON key-value |
| 4 | 前端收到的就是 JSON 格式的回應 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>Jackson：</b> Spring Boot 預設整合的 JSON 序列化函式庫，無需額外設定，開箱即用。
</div>

<!--
秘密就藏在 @RestController 裡。

當我們的方法回傳一個 Java 物件，@RestController 不會直接把物件丟出去，而是交給一個叫做 Jackson 的函式庫。
Jackson 的工作就是把 Java 物件「翻譯」成 JSON 格式的字串。

好消息是，Spring Boot 已經幫我們把 Jackson 設定好了，我們完全不需要額外安裝或設定任何東西。

接下來我們用三個步驟，實際做一個能回傳 JSON 的 API。
-->

---

# Step 1：建立 Student 類別

建立一個 `Student.java`，用來代表學生資料：

```java
public class Student {
    private Integer id;
    private String name;
}
```

| 欄位 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `Integer` | 學生 ID，對應 JSON 的整數類型 |
| `name` | `String` | 學生姓名，對應 JSON 的字串類型 |

<!--
第一步，建立一個簡單的 Java 類別 Student，有兩個欄位：id 和 name。

這種只有欄位和 getter/setter 的類別，在 Java 裡通常叫做 POJO（Plain Old Java Object）。

注意欄位都是 private，這樣才符合物件導向的封裝原則。
下一步我們要加上 getter 和 setter，讓 Jackson 能讀到這些欄位的值。
-->

---

# Step 2：加上 Getter 和 Setter

Jackson 需要透過 Getter 讀取欄位值，才能轉換成 JSON：

```java
public Integer getId() {
    return id;
}
public void setId(Integer id) {
    this.id = id;
}
public String getName() {
    return name;
}
public void setName(String name) {
    this.name = name;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 覺得 Getter/Setter 很囉唆？本章最後的補充會示範用 <b>Lombok</b> 一行 Annotation 全部省掉。
</div>

<!--
第二步，為每個欄位加上 getter 和 setter。

⚠️ 這裡很重要：Jackson 是透過呼叫 getter 方法來讀取欄位的值，並轉換成 JSON 的 key-value。
如果沒有 getter，Jackson 就讀不到欄位，那個欄位就不會出現在 JSON 裡。

命名規則是固定的：getId 對應 "id"，getName 對應 "name"，Jackson 會自動把 get 去掉、首字母小寫，作為 JSON 的 key。

在 Eclipse 裡，你可以用右鍵 → Source → Generate Getters and Setters 自動產生，不用手動打。
-->

---

# Step 3：Controller 回傳 Student 物件

把原本回傳 `String` 改成回傳 `Student` 物件：

```java
@RestController
public class MyController {

    @RequestMapping("/test")
    public Student test() {
        Student student = new Student();
        student.setId(123);
        student.setName("Judy");
        return student;
    }
}
```

<!--
第三步，修改 Controller。

注意看方法的回傳類型，從原來的 String 改成了 Student。
我們建立一個 Student 物件，設定好 id 和 name，然後直接 return 出去。

@RestController 會攔截這個回傳值，交給 Jackson 轉成 JSON，再回應給前端。
整個過程對我們來說完全透明，我們只需要 return 物件就好。
-->

---

# 執行結果

啟動後用 Postman 呼叫 `GET http://localhost:8080/test`：

| 項目 | 內容 |
| --- | --- |
| 請求 URL | `http://localhost:8080/test` |
| Http Method | `GET` |
| 回應 Status | `200 OK` |
| 回應 Body | JSON 格式的學生資料 |

```json
{
    "id": 123,
    "name": "Judy"
}
```

<!--
啟動 Spring Boot，打開 Postman，發送 GET 請求到 /test。

你會看到回應的 body 變成了 JSON 格式！id 和 name 都正確對應到我們在 Student 物件裡設定的值。

這就是 @RestController 的魔法——我們只需要 return 一個 Java 物件，它自動幫我們轉成 JSON。

大家有沒有發現，我們完全沒有手動寫任何 JSON 字串，一切都是 Spring Boot 自動完成的？
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 用 Lombok 省略 Getter 和 Setter

<!--
在進入 @Controller 和 @RestController 的差別之前，先補充一個實務上大家都會用的技巧。

剛才 Step 2 我們手寫了四個方法的 getter 和 setter。欄位一多，這種樣板程式碼會非常冗長。
還記得第七章介紹過的 Lombok 嗎？它也能幫我們解決這個問題。
-->

---

# 用 Lombok 省略 Getter 和 Setter

第七章安裝過的 **Lombok**，在編譯時自動生成樣板程式碼。加上 `@Data`，Getter/Setter 全部不用寫：

```java
import lombok.Data;

@Data
public class Student {
    private Integer id;
    private String name;
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>效果完全相同：</b> Lombok 在編譯時生成 <code>getId()</code>、<code>setName()</code> 等方法，Jackson 一樣能透過這些 Getter 讀取欄位值轉成 JSON。
</div>

<!--
只要在類別上加一個 @Data，原本手寫的四個方法就全部可以刪掉。

要強調的是：Lombok 不是「跳過」getter，而是在「編譯的時候」自動幫你把 getter 和 setter 生成到 .class 檔裡。
所以對 Jackson 來說完全沒有差別，它照樣呼叫 getId()、getName() 來讀取欄位值。

原始碼變乾淨了，但編譯出來的結果跟手寫一模一樣。

如果你還沒安裝 Lombok，回去看第七章的安裝流程：加 dependency、再執行 lombok.jar 安裝到 IDE。
-->

---

# Lombok 常用 Annotation

| Annotation | 生成的內容 |
| --- | --- |
| `@Getter` | 所有欄位的 Getter |
| `@Setter` | 所有欄位的 Setter |
| `@Data` | Getter + Setter + `toString()` + `equals()` + `hashCode()` |
| `@NoArgsConstructor` | 無參數建構子 |
| `@AllArgsConstructor` | 包含所有欄位的建構子 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>建議：</b> 這種承載資料的類別（POJO / DTO）直接加 <code>@Data</code> 最方便；只需要單一功能時再用 <code>@Getter</code> 或 <code>@Setter</code>。
</div>

<!--
Lombok 還有很多常用的 Annotation，這裡列出最常見的幾個。

@Getter 和 @Setter 可以單獨使用，只生成你需要的那一半。
@Data 是懶人包，一次生成 Getter、Setter、toString、equals、hashCode，資料類別加這個就夠了。
@NoArgsConstructor 和 @AllArgsConstructor 用來生成建構子，之後串接資料庫時會很常用到。

第七章我們用過 @RequiredArgsConstructor 來簡化建構子注入，這章的 @Data 則是用來簡化資料類別。
從這章開始，後面章節的範例只要是這種資料類別，我們都會用 Lombok 來寫。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# @Controller 和 @RestController 的差別在哪裡？

<!--
學完了怎麼回傳 JSON，我們來補充一個很多人會問的問題：@Controller 和 @RestController 有什麼差別？
-->

---

# @Controller 和 @RestController 的差別

| 項目 | `@Controller` | `@RestController` |
| --- | --- | --- |
| 回傳值用途 | 被當作「前端樣板名稱」 | 被當作「JSON 資料」自動轉換 |
| 適用情境 | JSP、Thymeleaf 等樣板引擎 | REST API（回傳 JSON） |
| 時代背景 | 早期前後端未分離的架構 | 現代前後端分離架構 |
| 是否需要 `@ResponseBody` | 需要（每個方法都要加） | 不需要（已內建） |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>建議：</b> 現代 Spring Boot 開發以 REST API 為主，優先使用 <code>@RestController</code>。
</div>

<!--
@Controller 是比較早期的 Annotation。在前後端還沒分離的年代，後端要直接渲染 HTML 頁面，這時候 Controller 的方法回傳的是「樣板名稱」，例如 "index.html"，框架再去找對應的 HTML 樣板渲染。

@RestController 則是為了 REST API 設計的。它等於 @Controller + @ResponseBody，方法的回傳值會直接被轉成 JSON 寫進 Http Response 的 body 裡。

在現代的前後端分離架構中，後端只負責提供 JSON 資料，前端（React、Vue）自己渲染畫面。
所以我們幾乎都用 @RestController，@Controller 只在需要整合 JSP 或 Thymeleaf 時才用到。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 自動轉換機制 | `@RestController` 透過 Jackson 自動將 Java 物件轉成 JSON |
| 建立步驟 | 定義 Java 類別 → 加 Getter/Setter → Controller 回傳物件 |
| Getter 的重要性 | Jackson 透過 Getter 讀取欄位值，缺少則欄位不出現在 JSON |
| Lombok 簡化 | `@Data` 在編譯時自動生成 Getter/Setter，不必手寫 |
| @Controller vs @RestController | 前者回傳樣板名稱，後者回傳 JSON |
| 現代建議 | REST API 一律使用 `@RestController` |

<!--
好，讓我們總結今天學到的東西。

第一，@RestController 透過 Jackson 自動把 Java 物件轉成 JSON，我們不需要手動處理。
第二，步驟是：建立 Java 類別、加 Getter/Setter、Controller 回傳物件。
第三，Getter 是關鍵，Jackson 靠它讀取欄位值。
第四，實務上用 Lombok 的 @Data，Getter/Setter 都不用手寫，編譯時自動生成。
第五，@Controller 和 @RestController 有本質差異，現代開發用後者。

今天的內容是 Spring Boot 開發 REST API 的核心。從這章開始，我們的 API 就能真正回傳結構化的 JSON 資料了！
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作練習

## 打造一個回傳 JSON 的圖書 API

<!--
學完了本章的內容，我們來動手做一個練習，把今天學到的東西實際應用一次。
-->

---

# 實作題目：圖書資訊 API

請建立一個 API，讓前端呼叫 `GET http://localhost:8080/book` 時，回傳一本書的 JSON 資料：

```json
{
    "id": 1,
    "name": "Spring Boot 零基礎入門",
    "price": 550.0,
    "available": true
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>觀察：</b> 這次的 JSON 包含了四種類型——整數、字串、小數、布林，比課堂範例更完整。
</div>

<!--
題目很直接：做一個回傳書籍資料的 API。

注意這次的欄位比課堂範例多了兩種類型：price 是小數、available 是布林值，正好對應第十五章學過的 JSON 數字和布林類型。

下一頁是具體的實作要求。
-->

---

# 實作題目：具體要求

| # | 要求 |
| --- | --- |
| 1 | 建立 `Book` 類別，包含 `id`（整數）、`name`（字串）、`price`（小數）、`available`（布林）四個欄位 |
| 2 | 使用 **Lombok 的 `@Data`**，不要手寫 Getter/Setter |
| 3 | 在 Controller 建立 `/book` 路徑，回傳 `Book` 物件 |
| 4 | 用 Postman 驗證回應的 JSON 與上一頁範例一致 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>提示：</b> 想一想，JSON 的小數和布林，分別要對應到 Java 的什麼類型？
</div>

<!--
四個要求：建 Book 類別、用 @Data、寫 Controller、用 Postman 驗證。

要求使用 Lombok 的 @Data，練習我們剛學的省略 Getter/Setter 技巧。

給大家一個提示：id 對應 Integer、name 對應 String，那 price 和 available 呢？回想一下第十五章 JSON 類型的對應表。

大家先自己動手做做看，做完再看下一頁的參考解答。
-->

---

# 參考解答（1/3）：建立 Book 類別

用 `@Data` 省略 Getter/Setter：

```java
import lombok.Data;

@Data
public class Book {
    private Integer id;
    private String name;
    private Double price;
    private Boolean available;
}
```

<!--
參考解答的第一步：建立 Book 類別。

四個欄位分別是 Integer、String、Double、Boolean。

加上 @Data 之後，Getter/Setter 都不用寫，Lombok 會在編譯時自動生成。

下一頁我們看類型是怎麼對應的。
-->

---

# 參考解答（2/3）：JSON 與 Java 的類型對應

| JSON 類型 | 範例值 | Java 類型 |
| --- | --- | --- |
| 整數 | `1` | `Integer` |
| 字串 | `"Spring Boot 零基礎入門"` | `String` |
| 小數 | `550.0` | `Double` |
| 布林 | `true` | `Boolean` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 Jackson 依照欄位的 Java 類型，自動輸出對應的 JSON 類型——不需要任何額外設定。
</div>

<!--
類型對應的答案：price 用 Double、available 用 Boolean，對應 JSON 的小數和布林類型。

Jackson 會根據 Java 欄位的類型，自動決定 JSON 輸出的類型：Integer 輸出成整數、String 輸出成帶引號的字串、Double 輸出成小數、Boolean 輸出成 true/false。

我們完全不需要額外設定，這就是第十五章 JSON 類型知識的實際應用。
-->

---

# 參考解答（3/3）：Controller 回傳 Book 物件

```java
@RestController
public class BookController {

    @RequestMapping("/book")
    public Book getBook() {
        Book book = new Book();
        book.setId(1);
        book.setName("Spring Boot 零基礎入門");
        book.setPrice(550.0);
        book.setAvailable(true);
        return book;
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 雖然沒有手寫 <code>setId()</code>、<code>setPrice()</code>，但 <code>@Data</code> 已在編譯時生成，可以直接呼叫。
</div>

<!--
第二步，Controller 的方法回傳類型改成 Book，建立物件、設定欄位值、直接 return。

雖然我們沒有手寫 setId、setPrice 這些方法，但因為有 @Data，這些 setter 在編譯後都存在，可以直接呼叫。

用 Postman 發送 GET /book，就會看到完整的 JSON 回應。四個欄位的類型都由 Jackson 自動對應：整數、字串、小數、布林。
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
