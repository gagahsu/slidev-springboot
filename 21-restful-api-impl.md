---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 實作 RESTful API
routeAlias: ch21
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
    實作 RESTful API
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「從設計到實作，一步一步完成完整的 CRUD API」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，上一章我們學了 RESTful API 的設計概念：Http Method 代表操作、URL 代表資源、Response 回傳 JSON。

今天要把這些概念真正落地——用 Spring Boot 實作一個完整的 CRUD RESTful API。

我們還會學到四個更精簡的 Annotation：@GetMapping、@PostMapping、@PutMapping、@DeleteMapping，讓程式碼更簡潔易讀。
-->

---
layout: default
---

# Outline

- **回顧：什麼是 RESTful API？** — Method 代表動作、URL 代表資源
- **設計 RESTful API** — 規劃 CRUD 的路徑與 Method 對應
- **在 Spring Boot 中實作** — @GetMapping、@PostMapping、@PutMapping、@DeleteMapping
- **完整 CRUD 實作** — 逐一完成查詢、新增、更新、刪除四個端點
- **章節總結** — 核心模式整理

<!--
今天會從設計開始，一路做到完整的 CRUD 實作。整個流程走完，大家就有了開發真實 API 的基礎能力。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 回顧

## 什麼是 RESTful API？

<!--
先快速回顧一下上一章的三大規則。
-->

---

# 回顧：RESTful API 三大規則

| 規則 | 說明 | 本章如何實作 |
| --- | --- | --- |
| 規則 1 | Http Method 代表 CRUD 操作 | 使用 @GetMapping / @PostMapping 等 |
| 規則 2 | URL 路徑描述資源層級 | 設計 `/students` 和 `/students/{id}` |
| 規則 3 | Response 回傳 JSON | `@RestController` 自動處理（已學） |

<!--
三大規則的回顧。

這章的重點是規則 1 和規則 2 的實作：怎麼用 Spring Boot 的 Annotation 讓不同 Http Method 對應到不同的 Controller 方法，以及怎麼設計清晰的 URL 結構。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 設計 RESTful API

<!--
動手之前，先把 API 設計好。
-->

---

# 設計學生資源的 RESTful API

以「學生（Student）」為資源，設計完整的 CRUD API：

| 操作 | Http Method | URL | 說明 |
| --- | --- | --- | --- |
| 新增學生 | `POST` | `/students` | Request Body 帶學生資料 |
| 查詢學生 | `GET` | `/students/{studentId}` | 路徑帶學生 ID |
| 更新學生 | `PUT` | `/students/{studentId}` | 路徑帶 ID，Body 帶更新資料 |
| 刪除學生 | `DELETE` | `/students/{studentId}` | 路徑帶學生 ID |

<!--
這張表格就是我們今天要實作的 API 設計。

注意看：同樣是 /students/{studentId} 這個 URL，根據 Http Method 的不同，對應的操作也完全不同。
GET 是查，PUT 是更新，DELETE 是刪除——這就是 RESTful 風格的精髓。

設計好了，接下來看怎麼在 Spring Boot 裡實作。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 在 Spring Boot 中實作 RESTful API

<!--
來看 Spring Boot 怎麼支援 RESTful API 的實作。
-->

---

# 從舊寫法到新寫法

`@RequestMapping` 指定 method 的寫法太冗長，Spring Boot 提供更精簡的 Annotation：

| 操作 | 舊寫法（@RequestMapping） | 新寫法 |
| --- | --- | --- |
| GET | `@RequestMapping(value="/students", method=RequestMethod.GET)` | `@GetMapping("/students")` |
| POST | `@RequestMapping(value="/students", method=RequestMethod.POST)` | `@PostMapping("/students")` |
| PUT | `@RequestMapping(value="/students/{id}", method=RequestMethod.PUT)` | `@PutMapping("/students/{id}")` |
| DELETE | `@RequestMapping(value="/students/{id}", method=RequestMethod.DELETE)` | `@DeleteMapping("/students/{id}")` |

<!--
在第十四章，我們用 @RequestMapping + method 屬性來限制 Http Method。

Spring Boot 提供了四個更簡潔的 Annotation，把 Method 限制和路徑直接合在一起：
@GetMapping、@PostMapping、@PutMapping、@DeleteMapping。

兩者功能完全一樣，新寫法更短、更直覺，現代 Spring Boot 開發一律用新寫法。
-->

---

# 四個新 Annotation 說明

| Annotation | 對應 Http Method | 適合操作 |
| --- | --- | --- |
| `@GetMapping` | GET | 查詢資料（Read） |
| `@PostMapping` | POST | 新增資料（Create） |
| `@PutMapping` | PUT | 完整更新資料（Update） |
| `@DeleteMapping` | DELETE | 刪除資料（Delete） |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提示：</b> 這四個 Annotation 和 @RequestMapping 完全相容，只是更精簡的語法糖。
</div>

<!--
這四個 Annotation 就是現代 Spring Boot RESTful 開發的標準工具。

記憶口訣：Get查、Post新增、Put更新、Delete刪除。

從這章開始，我們就不再用 @RequestMapping + method 的冗長寫法了，全面改用這四個精簡 Annotation。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 具體實作

<!--
好，準備好了，開始動手實作。
-->

---

# 準備：建立 Student 類別

建立 `Student.java`，需包含欄位及對應的 Getter / Setter：

```java
public class Student {
    private Integer id;
    private String name;
    // 需加上 getId、setId、getName、setName
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>提醒：</b> Eclipse 右鍵 → Source → Generate Getters and Setters，自動產生所有 Getter / Setter。
</div>

<!--
實作之前，先準備 Student 類別。

這個類別我們在第十六章和第十八章都用過了，一樣的結構：私有欄位加上 Getter / Setter。

記得用 Eclipse 的自動產生功能，省去手打 Getter / Setter 的時間。
-->

---

# 實作 Create & Read

在 `StudentController` 中實作 POST 新增 和 GET 查詢：

```java
// 新增學生
@PostMapping("/students")
public String create(@RequestBody Student student) {
    return "執行資料庫的 Create 操作";
}
// 查詢學生
@GetMapping("/students/{studentId}")
public String read(@PathVariable("studentId") Integer studentId) {
    return "執行資料庫的 Read 操作";
}
```

<!--
看 Create 和 Read 的實作。

POST /students：用 @PostMapping，接收 @RequestBody 的 JSON，對應新增操作。
GET /students/{studentId}：用 @GetMapping，接收 @PathVariable 的 studentId，對應查詢操作。

注意這裡我們還沒有連接資料庫，所以 return 的是說明文字。
真正的資料庫操作要等到後面的 Spring JDBC 章節再加上去。

兩個方法放在同一個 StudentController 類別裡，類別上加 @RestController。
-->

---

# 實作 Update & Delete

繼續在 `StudentController` 中實作 PUT 更新 和 DELETE 刪除：

```java
// 更新學生
@PutMapping("/students/{studentId}")
public String update(@PathVariable("studentId") Integer studentId,
                     @RequestBody Student student) {
    return "執行資料庫的 Update 操作";
}
// 刪除學生
@DeleteMapping("/students/{studentId}")
public String delete(@PathVariable("studentId") Integer studentId) {
    return "執行資料庫的 Delete 操作";
}
```

<!--
PUT /students/{studentId}：用 @PutMapping，同時接收路徑的 studentId 和 Body 的更新資料，對應完整更新操作。

注意 update 方法有兩個參數：@PathVariable("studentId") 告訴我們要更新哪一筆，@RequestBody Student student 是更新後的內容。

DELETE /students/{studentId}：用 @DeleteMapping，只需要路徑的 studentId，不需要 Body。

⚠️ 大家可能會問：為什麼 DELETE 不需要 Body？因為刪除操作只需要知道「刪除誰」，不需要傳入任何更新內容。
-->

---
style: |
  pre, code { font-size: 0.82em !important; line-height: 1.35 !important; }
---

# 完整 StudentController

```java
@RestController
public class StudentController {
    @PostMapping("/students")
    public String create(@RequestBody Student student) {
        return "執行資料庫的 Create 操作";
    }
    @GetMapping("/students/{studentId}")
    public String read(@PathVariable("studentId") Integer studentId) {
        return "執行資料庫的 Read 操作";
    }
    @PutMapping("/students/{studentId}")
    public String update(@PathVariable("studentId") Integer studentId,
                         @RequestBody Student student) {
        return "執行資料庫的 Update 操作";
    }
    @DeleteMapping("/students/{studentId}")
    public String delete(@PathVariable("studentId") Integer studentId) {
        return "執行資料庫的 Delete 操作";
    }
}
```

<!--
把四個方法合在一起，看完整的 StudentController 類別結構。

類別上加 @RestController，宣告這是 RESTful API 的控制器。
四個方法各自對應 POST / GET / PUT / DELETE，覆蓋 CRUD 完整操作。

目前 return 的是說明文字，後面 Spring JDBC 章節會替換成真正的資料庫操作。
-->

---

# 完整 API 路由總覽

| Http Method | URL | Annotation | 說明 |
| --- | --- | --- | --- |
| `POST` | `/students` | `@PostMapping` | 新增學生，Body 帶資料 |
| `GET` | `/students/{studentId}` | `@GetMapping` | 查詢指定學生 |
| `PUT` | `/students/{studentId}` | `@PutMapping` | 更新指定學生 |
| `DELETE` | `/students/{studentId}` | `@DeleteMapping` | 刪除指定學生 |

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>恭喜：</b> 這就是一個完整的 RESTful API 骨架！後續章節加上資料庫操作，就是真實的後端 API。
</div>

<!--
這張表格就是我們今天實作完成的完整 RESTful API。

四個 Http Method 對應四個 CRUD 操作，URL 設計清楚、語意明確，這正是業界標準的 RESTful API 風格。

雖然目前方法裡只有 return 說明文字，但架構已經完整了。
接下來學完 Spring JDBC，我們就能把這些 return 替換成真正的資料庫操作，完成一個可以上線的後端 API！
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 精簡 Annotation | `@GetMapping`、`@PostMapping`、`@PutMapping`、`@DeleteMapping` |
| 取代舊寫法 | 比 `@RequestMapping + method` 更短、更直覺 |
| 搭配使用 | 查詢用 `@PathVariable`；新增/更新用 `@RequestBody` |
| CRUD 對應 | POST=Create、GET=Read、PUT=Update、DELETE=Delete |
| 下一步 | 學習 Spring JDBC，讓 API 真正連接資料庫 |

<!--
好，今天的重點總結。

第一，四個精簡 Annotation 取代冗長的 @RequestMapping + method 寫法。
第二，配合 @PathVariable 和 @RequestBody，就能實作完整的 CRUD API。
第三，目前的實作是骨架，後面連接 Spring JDBC 就能變成真實可用的後端 API。

學完今天，大家已經具備設計和實作 RESTful API 的基礎能力了！
-->

---
layout: end
---

# Q & A

<!--
今天的內容就到這裡。大家有任何問題嗎？
-->
