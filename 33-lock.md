---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 樂觀鎖 & 悲觀鎖
routeAlias: ch33
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
    樂觀鎖 & 悲觀鎖
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「高並發場景下，保護資料不被同時修改的兩種策略」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，上一章我們學了 @Transactional，確保一組操作要嘛全成功要嘛全 Rollback。

但光有事務還不夠。想像演唱會售票系統在開賣瞬間，一萬個人同時搶最後一張票——如果沒有鎖的機制，可能同時有五個人都看到「剩一張」，然後全部都成功購買，超賣了！

今天要學的樂觀鎖和悲觀鎖，就是解決「並發修改同一筆資料」這個問題的兩種策略。
-->

---
layout: default
---

# Outline

- **為什麼需要並發控制？** — 搶票超賣的問題
- **樂觀鎖 vs 悲觀鎖 概念比較** — 兩種策略的核心差異
- **悲觀鎖（Pessimistic Lock）** — `@Lock` + `LockModeType`
- **樂觀鎖（Optimistic Lock）** — `@Version` + 衝突例外處理
- **適用場景選擇** — 什麼時候用哪個

<!--
今天分四個部分。先理解為什麼需要鎖，再分別學兩種鎖的實作方式，最後學怎麼選擇。

最重要的部分是樂觀鎖（@Version）——它是現代業界最常用的方式，讀多寫少的場景效能比悲觀鎖好很多。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 為什麼需要並發控制？

<!--
先從一個具體的問題場景出發。
-->

---

# 搶票超賣問題

演唱會售票系統，剩最後 1 張票，兩個使用者同時購買：

| 時間 | 使用者 A | 使用者 B |
| --- | --- | --- |
| T1 | 查詢：剩餘票數 = 1 | 查詢：剩餘票數 = 1 |
| T2 | 扣減：票數 1 → 0，寫入成功 | 扣減：票數 1 → 0，寫入成功 |
| T3 | ✅ 購票成功 | ✅ 購票成功（超賣！） |

**問題：** T1 時兩人都讀到「剩 1 張」，T2 各自扣減，導致同一張票被賣出兩次。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>並發控制：</b> 確保多個事務同時修改同一筆資料時，結果仍然正確。
</div>

<!--
這個問題叫做「競爭條件（Race Condition）」——多個執行緒同時讀取、修改同一筆資料，互相覆蓋對方的結果。

光靠 @Transactional 無法解決這個問題，因為 @Transactional 保證的是「操作的原子性」，不保證「操作之間的隔離性」。

解決方案是加鎖——讓同時只有一個人能修改這筆資料。
-->

---

# 樂觀鎖 vs 悲觀鎖 — 策略類比

| 類型 | 策略 | 類比 |
| --- | --- | --- |
| **悲觀鎖** | 操作前先加鎖，其他人等待 | 廁所鎖門：進去就鎖，別人只能等 |
| **樂觀鎖** | 不加鎖，提交時才檢查是否衝突 | 共享文件：各自編輯，存檔時比對版本 |

<!--
類比很重要：悲觀鎖像廁所——進去就鎖門，別人只能在外面等。樂觀鎖像 Google 文件——大家同時編輯，但存檔時如果發現有人改了同一行，就提示衝突需要解決。
-->

---

# 樂觀鎖 vs 悲觀鎖 — 差異比較

| 比較項目 | 悲觀鎖 | 樂觀鎖 |
| --- | --- | --- |
| 並行性 | 低（等待鎖） | 高（不互相阻擋） |
| 衝突處理 | 排隊等待 | 拋出例外，需重試 |
| 適用場景 | 衝突頻繁 | 衝突少、讀多寫少 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選擇關鍵：</b> 衝突頻繁用悲觀鎖（排隊安全）；衝突少用樂觀鎖（效能更好）。
</div>

<!--
選哪個，主要看「衝突頻率」。搶票這種高並發場景衝突頻繁，用悲觀鎖更安全。一般的文章編輯功能衝突少，用樂觀鎖效能更好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## 悲觀鎖（Pessimistic Lock）

<!--
先學悲觀鎖——用 @Lock 在查詢時就對資料加鎖。
-->

---

# 悲觀鎖原理

悲觀鎖在查詢時執行 `SELECT ... FOR UPDATE`，對資料列加排他鎖：

| 步驟 | 操作 |
| --- | --- |
| T1 A 查詢 | `SELECT ... FOR UPDATE`，加鎖，A 持有鎖 |
| T1 B 查詢 | `SELECT ... FOR UPDATE`，被阻擋，B 等待 |
| T2 A 更新 | 扣減票數，提交事務，**釋放鎖** |
| T2 B 查詢 | 鎖釋放，B 取得鎖，查詢到最新票數（0） |
| T2 B 判斷 | 票數 = 0，拒絕購票 |

`FOR UPDATE` 是排他鎖（其他事務不可讀也不可寫）；若只需防止資料被改、但允許他人讀取，用共享鎖 `SELECT ... FOR SHARE`。

<!--
FOR UPDATE 是 SQL 的加鎖語法，告訴資料庫「我要修改這筆資料，先幫我鎖住」。

FOR SHARE 則是共享鎖，多個事務可以同時持有（都能讀），但只要有人持有就不能被修改——適合「讀取後不打算改，但要求資料在讀的過程中不被別人改掉」的場景。兩者的完整差異下一頁 LockModeType 會細講。

在 Spring Data JPA 裡，我們用 @Lock 來發出這個指令——不需要手寫 SQL。

注意：悲觀鎖必須搭配 @Transactional，因為鎖在事務結束時才釋放。沒有事務，鎖會立刻釋放，完全失去保護效果。
-->

---

# 悲觀鎖 — `@Lock` 只是 JPA 的語法糖

`@Lock` 是 Spring Data JPA 專屬功能，底層仍是 SQL 的 `FOR UPDATE`：

| 技術 | 悲觀鎖寫法 | 說明 |
| --- | --- | --- |
| **JPA** | `@Lock(LockModeType.PESSIMISTIC_WRITE)` | 框架自動組出 `FOR UPDATE`，不用手寫 SQL |
| **MyBatis** | `SELECT ... FOR UPDATE`（寫在 XML 或 `@Select`） | 沒有對應 annotation，SQL 要自己手寫 |
| **JDBC** | `SELECT ... FOR UPDATE`（手寫 SQL 字串） | 同樣要自己手寫，並手動控制 transaction |

```xml
<!-- MyBatis mapper XML -->
<select id="findTicketForUpdate" resultType="Ticket">
    SELECT * FROM ticket WHERE id = #{id} FOR UPDATE
</select>
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>本質：</b>悲觀鎖是 SQL 層級的概念（<code>FOR UPDATE</code> / <code>FOR SHARE</code>），三種技術都適用；差別只在「誰幫你組這句 SQL」。JPA 的 <code>@Lock</code> 只是把接下來要學的語法包裝成 annotation。
</div>

<!--
這張投影片很重要，很多人以為 @Lock 是悲觀鎖唯一的實作方式，其實它只是 JPA/Hibernate 提供的封裝。

真正在做事的是資料庫的 FOR UPDATE / FOR SHARE 語法。JPA 幫你自動產生這句 SQL，MyBatis 和純 JDBC 沒有這層封裝，要自己手寫在 SQL 裡。

無論哪種技術，都要記得包在 transaction 裡（JDBC 要手動 setAutoCommit(false)，MyBatis 搭配 Spring @Transactional），鎖才會撐到 commit 才釋放。

接下來我們深入看 JPA 是怎麼把這個概念包裝成 @Lock 的。
-->

---

# 悲觀鎖 — LockModeType

`@Lock` 的鎖類型由 `LockModeType` 指定：

| LockModeType | SQL 對應 | 說明 |
| --- | --- | --- |
| `PESSIMISTIC_WRITE` | `SELECT ... FOR UPDATE` | 排他鎖，其他事務不可讀也不可寫 |
| `PESSIMISTIC_READ` | `SELECT ... FOR SHARE` | 共享鎖，其他事務可讀但不可寫 |

搶票場景一律用 `PESSIMISTIC_WRITE`（排他鎖），確保同時只有一個事務能修改。

<!--
PESSIMISTIC_WRITE 是最嚴格的鎖，完全排他——我在改這筆資料時，其他事務連讀都不行。

PESSIMISTIC_READ 比較寬鬆，允許其他事務讀取，但不能修改。適合「讀取後不打算修改，但希望資料在讀取過程中不被更改」的場景，比較少見。

搶票用 PESSIMISTIC_WRITE，一般業務用 PESSIMISTIC_READ 即可。
-->

---

# 悲觀鎖 — Repository 實作

在 `JpaRepository` 中覆寫 `findById()`，加上 `@Lock`：

```java
@Repository
public interface TicketDao extends JpaRepository<Ticket, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from Ticket t where t.id = :id")
    Optional<Ticket> findTicketById(@Param("id") String id);
}
```

搭配 `@Transactional` 在 Service 使用：

```java
@Transactional
public void buyTicket(String ticketId) {
    Optional<Ticket> ticket = ticketDao.findTicketById(ticketId);
    // 此時資料列已加鎖，其他事務等待
}
```

<!--
注意兩個重點：

第一，@Lock 要加在自訂查詢方法上，不能直接加在 findById 這種內建方法上——所以要用 @Query 自訂一個同功能的方法。

第二，@Transactional 是必須的，因為悲觀鎖在事務結束時才釋放。如果 Service 方法沒有 @Transactional，鎖會立刻釋放，等於沒鎖。

LockModeType 的 import 是 jakarta.persistence.LockModeType。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## 樂觀鎖（Optimistic Lock）

<!--
樂觀鎖不加資料庫層級的鎖，而是靠版本號來偵測衝突。
-->

---

# 樂觀鎖原理：@Version

在 Entity 加入 `@Version` 欄位，每次更新時版本號自動 +1：

| 步驟 | 操作 |
| --- | --- |
| T1 A 查詢 | 讀到 `version = 1`，剩餘票數 = 1 |
| T1 B 查詢 | 讀到 `version = 1`，剩餘票數 = 1 |
| T2 A 提交 | `UPDATE ... WHERE version = 1`，成功，version 變 2 |
| T2 B 提交 | `UPDATE ... WHERE version = 1`，失敗（version 已是 2） |
| T2 B 結果 | 拋出 `ObjectOptimisticLockingFailureException` |

<!--
樂觀鎖的核心思想是「版本號比對」。

A 和 B 同時讀到 version = 1，A 先提交，把 version 更新成 2。B 接著提交，但 WHERE 條件的 version = 1 已經找不到（version 已是 2），UPDATE 影響 0 筆，JPA 偵測到這個情況，自動拋出 ObjectOptimisticLockingFailureException。

這個流程完全不需要加資料庫鎖，高並發時效能比悲觀鎖好很多。
-->

---

# 樂觀鎖 — `@Version` 也是 JPA 的語法糖

`@Version` 一樣是 Spring Data JPA 專屬，底層仍是「版本號比對」這個通用概念：

| 技術 | 樂觀鎖寫法 | 說明 |
| --- | --- | --- |
| **JPA** | `@Version` 欄位 | 框架自動在 WHERE 加版本比對、UPDATE 後版本 +1，衝突自動拋例外 |
| **MyBatis** | `UPDATE ... WHERE version = #{version}` 手寫 SQL | 自己判斷 affected rows 是否為 0，自己拋例外 |
| **JDBC** | `UPDATE ... WHERE version = ?` 手寫 SQL | 自己檢查 `executeUpdate()` 回傳值，自己處理衝突 |

```xml
<!-- MyBatis mapper XML -->
<update id="updateTicket">
    UPDATE ticket
    SET remain = #{remain}, version = version + 1
    WHERE id = #{id} AND version = #{version}
</update>
```

```java
// Service 層自行檢查
int affected = ticketDao.updateTicket(ticket);
if (affected == 0) {
    throw new RuntimeException("版本衝突，請重試");
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>本質：</b>樂觀鎖是「WHERE 帶版本號 + 判斷影響筆數」的通用作法；JPA 幫你自動化，MyBatis／JDBC 要自己刻，也沒有 <code>ObjectOptimisticLockingFailureException</code> 可以撿，要自訂例外。接下來看 JPA 怎麼把這個概念包裝成 <code>@Version</code>。
</div>

<!--
跟悲觀鎖那張呼應：@Version 不是魔法，只是 JPA 幫你把「WHERE version = ? 然後 version + 1」這件事自動化。

MyBatis 和 JDBC 沒有這層框架支援，必須自己在 SQL 寫版本比對條件，並且自己檢查 UPDATE 影響的筆數——0 筆就代表版本被別人改過，要自己拋例外（不是 Spring 內建的 ObjectOptimisticLockingFailureException，那是 JPA/Hibernate 專屬的例外類別）。

重點：概念（版本號比對）三種技術通用，實作的自動化程度不同。

接下來深入看 JPA 的 @Version 具體怎麼用。
-->

---

# 樂觀鎖 — Entity 加入 @Version

在 Entity 類別加入 `version` 欄位，標注 `@Version`：

```java
@Entity
@Table(name = "ticket")
public class Ticket {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "remain")
    private int remain;

    @Version
    @Column(name = "version")
    private int version;     // JPA 自動管理，不需要手動修改
}
```

<!--
@Version 欄位非常簡單——加上去之後，JPA 自動在每次 save() 時：
1. 在 WHERE 條件加上版本號比對
2. 成功更新後把版本號 +1

我們完全不需要手動讀取或設定 version 的值，JPA 幫我們全部搞定。

資料庫 ticket 表也需要對應的 version 欄位（INT 型態）。
-->

---

# 樂觀鎖 — Service 使用方式

搭配 `@Transactional` 使用，版本衝突時捕捉例外：

```java
@Service
public class TicketService {

    @Autowired
    private TicketDao ticketDao;

    @Transactional
    public boolean buyTicket(String ticketId) {
        Optional<Ticket> opt = ticketDao.findById(ticketId);
        if (opt.isEmpty()) return false;
        Ticket ticket = opt.get();
        if (ticket.getRemain() <= 0) return false;
        ticket.setRemain(ticket.getRemain() - 1);
        ticketDao.save(ticket);   // 版本衝突時拋出例外
        return true;
    }
}
```

<!--
這段程式碼看起來和一般的 JPA 操作完全一樣，唯一的差別是底層 JPA 自動加了版本比對。

如果 save() 發生衝突，拋出的是 ObjectOptimisticLockingFailureException（RuntimeException），@Transactional 會自動 Rollback。

呼叫端（Controller）需要捕捉這個例外，決定要重試還是告知使用者「搶購失敗，請重試」。
-->

---

# 樂觀鎖衝突例外處理

`ObjectOptimisticLockingFailureException` 是 `RuntimeException`，在 Controller 或 Service 層捕捉：

```java
@PostMapping("/tickets/{id}/buy")
public ResponseEntity<String> buyTicket(@PathVariable("id") String id) {
    try {
        ticketService.buyTicket(id);
        return ResponseEntity.ok("購票成功");
    } catch (ObjectOptimisticLockingFailureException e) {
        return ResponseEntity.status(409).body("票已售出，請重試");
    }
}
```

<!--
409 Conflict 是 HTTP Status Code，表示請求與資源目前的狀態衝突——用在樂觀鎖衝突非常語意正確。

在業界系統中，遇到樂觀鎖衝突通常有兩種處理方式：
1. 直接回傳錯誤，讓前端提示使用者重試（適合使用者可接受的場景）
2. 後端自動重試幾次（適合自動化流程、不希望使用者感知的場景）

搶票場景通常用第一種——本來就是競爭，失敗很正常。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4

## 適用場景選擇

<!--
學了兩種鎖，什麼時候用哪個？
-->

---

# 樂觀鎖 vs 悲觀鎖 — 選擇指南

| 比較項目 | 悲觀鎖 | 樂觀鎖 |
| --- | --- | --- |
| 加鎖時機 | 查詢時（SELECT FOR UPDATE） | 提交時（版本號比對） |
| 並行性 | 低（其他事務需等待） | 高（各自執行，提交再比對） |
| 衝突頻率 | 適合衝突頻繁 | 適合衝突少 |
| 效能 | 較低（等待鎖有成本） | 較高（無鎖等待） |
| 實作方式 | `@Lock` + `LockModeType` | `@Version` |
| 衝突處理 | 等待（自動排隊） | 拋出例外，需重試 |
| 典型場景 | 庫存扣減、金融轉帳 | 部落格文章編輯、一般更新 |

<!--
選擇的核心邏輯是「衝突頻率」：

衝突頻繁（例如同一時間大量搶購同一商品）→ 悲觀鎖，確保排隊不超賣。
衝突少（例如多人同時但很少改到同一篇文章）→ 樂觀鎖，效能更好。

業界最常用的是樂觀鎖，因為大多數業務場景衝突頻率不高，而悲觀鎖的等待成本在高流量時會明顯拖慢系統。

只有高並發且必須嚴格串行（例如秒殺系統）才考慮悲觀鎖。
-->

---
layout: default
---

# 練習：為搶票 API 加上並發保護
### 任務說明

建立一個搶票 API `POST /tickets/{id}/buy`，Ticket Entity 有以下欄位：

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `id` | `String` | 票券 ID |
| `remain` | `int` | 剩餘張數 |
| `version` | `int` | 版本號 |

請完成：
1. 在 `Ticket` Entity 加入 `@Version`
2. 在 `TicketService.buyTicket()` 加上 `@Transactional`
3. 在 Controller 捕捉 `ObjectOptimisticLockingFailureException`，回傳 HTTP 409

<!--
這個練習把今天學的樂觀鎖完整實作出來。

大家想想：為什麼 buyTicket() 一定要加 @Transactional？如果不加會怎樣？

試著在 Postman 快速連點兩次「購票」，如果有衝突保護，至少有一次會收到 409。
-->

---

# 練習：解題提示 — Entity

```java
@Entity
@Table(name = "ticket")
public class Ticket {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "remain")
    private int remain;

    @Version
    @Column(name = "version")
    private int version;     // JPA 自動管理，不需要手動修改

    // getter / setter 省略
}
```

<!--
Entity 只要加上 @Version 欄位，JPA 就會自動處理版本比對——不需要手動讀取或設定 version 的值。
-->

---

# 練習：解題提示 — Repository

```java
@Repository
public interface TicketDao extends JpaRepository<Ticket, String> {
    // 樂觀鎖不需要 @Lock，findById() 內建即可
    // save() 時 JPA 自動比對並更新 version
}
```

<!--
不需要額外的 Repository 方法或 @Lock annotation，這點跟悲觀鎖不同（悲觀鎖需要自訂 @Query + @Lock）。JPA 內建的 findById() 和 save() 就足夠。
-->

---

# 練習：解題提示 — Service

```java
@Service
public class TicketService {

    @Autowired
    private TicketDao ticketDao;

    @Transactional
    public boolean buyTicket(String ticketId) {
        Optional<Ticket> opt = ticketDao.findById(ticketId);
        if (opt.isEmpty()) return false;

        Ticket ticket = opt.get();
        if (ticket.getRemain() <= 0) return false;
        try {
            Thread.sleep(3000);   // 模擬處理耗時，方便觀察版本衝突
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        ticket.setRemain(ticket.getRemain() - 1);
        ticketDao.save(ticket);   // 版本衝突時拋出例外
        return true;
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>觀察技巧：</b>樂觀鎖衝突通常瞬間發生，肉眼很難抓到。加一行 <code>Thread.sleep(3000)</code> 拉長「讀到 save 之間」的時間窗，兩個請求幾乎同時發送時，才更容易讓兩者都讀到舊 version，其中一個 save() 時真正觸發 409。正式環境要記得移除。
</div>

<!--
@Transactional 包住讀取→修改→save 這組操作，save() 時如果版本衝突就拋出 ObjectOptimisticLockingFailureException，交易自動 Rollback。

Thread.sleep() 只是教學用的觀察手段，故意拉長「讀取到寫入」之間的時間窗，讓兩個並發請求都讀到同一個舊版本、必然觸發衝突，方便驗證「樂觀鎖 = save 時才發現衝突」這個行為。實務上不會這樣寫。
-->

---

# 練習：解題提示 — Controller

```java
@RestController
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/tickets/{id}/buy")
    public ResponseEntity<String> buyTicket(@PathVariable("id") String id) {
        try {
            boolean success = ticketService.buyTicket(id);
            return success
                ? ResponseEntity.ok("購票成功")
                : ResponseEntity.status(400).body("已售完或票券不存在");
        } catch (ObjectOptimisticLockingFailureException e) {
            return ResponseEntity.status(409).body("搶購失敗，請重試");
        }
    }
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>成功標準：</b> 同時發送兩個購票請求，其中一個回傳 409 Conflict，資料庫剩餘票數正確扣減只有一次。
</div>

<!--
Controller 捕捉 ObjectOptimisticLockingFailureException 轉成 409 Conflict，語意正確的 HTTP Status Code。

import 是 org.springframework.orm.ObjectOptimisticLockingFailureException。

如果想更嚴格測試，可以用 JMeter 或 Postman 的 Collection Runner 模擬並發請求。
-->

---

# 練習：另解 — 改用悲觀鎖（Repository）

同一個練習也可以改用悲觀鎖實作，Entity **不需要** `@Version`：

```java
@Repository
public interface TicketDao extends JpaRepository<Ticket, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from Ticket t where t.id = :id")
    Optional<Ticket> findTicketById(@Param("id") String id);
}
```

<!--
悲觀鎖版本的差異：Entity 不用加 @Version，改成 Repository 自訂一個帶 @Lock 的查詢方法。

findTicketById() 執行時就會對這筆資料加排他鎖（SELECT ... FOR UPDATE），其他事務必須等待鎖釋放才能查詢同一筆資料。
-->

---

# 練習：另解 — 改用悲觀鎖（Service）

```java
@Service
public class TicketService {

    @Autowired
    private TicketDao ticketDao;

    @Transactional
    public boolean buyTicket(String ticketId) {
        Optional<Ticket> opt = ticketDao.findTicketById(ticketId);
        if (opt.isEmpty()) return false;

        Ticket ticket = opt.get();
        if (ticket.getRemain() <= 0) return false;   // 鎖已持有，安全判斷
        try {
            Thread.sleep(3000);   // 模擬處理耗時，方便觀察鎖等待
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        ticket.setRemain(ticket.getRemain() - 1);
        ticketDao.save(ticket);
        return true;
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>觀察技巧：</b>加一行 <code>Thread.sleep(3000)</code> 故意拉長交易時間，兩個請求幾乎同時發送時，第二個請求會明顯卡住等待 3 秒，才拿到最新資料——比純樂觀鎖（幾乎瞬間完成）更容易肉眼觀察到「排隊等待」的行為。正式環境要記得移除。
</div>

<!--
Service 呼叫 findTicketById()（帶 @Lock）而不是 findById()，查詢當下就加鎖。

其他事務此時查詢同一筆資料會被阻擋、排隊等待，直到這個交易 commit 釋放鎖為止。

Thread.sleep() 只是教學用的觀察手段，故意讓鎖持有時間變長，讓 Postman 連點兩次的等待現象看得出來。實務上不會這樣寫，這裡只是方便驗證「悲觀鎖 = 排隊」這個行為。
-->

---

# 練習：另解 — 改用悲觀鎖（Controller）

```java
@RestController
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/tickets/{id}/buy")
    public ResponseEntity<String> buyTicket(@PathVariable("id") String id) {
        boolean success = ticketService.buyTicket(id);
        return success
            ? ResponseEntity.ok("購票成功")
            : ResponseEntity.status(400).body("已售完或票券不存在");
    }
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>差異：</b>悲觀鎖版本 Controller 不需要捕捉衝突例外——因為查詢時就已排隊等待，不會有 409，B 拿到鎖時票數已是最新值，直接判斷即可。
</div>

<!--
不會拋出 ObjectOptimisticLockingFailureException，因為沒有版本衝突這回事——B 是排隊等到鎖釋放後才查詢，看到的一定是最新資料。

Controller 因此不需要 try-catch，邏輯更單純，但代價是 B 要等待 A 的交易結束，並行度較低。

兩版對照，正好呼應 Part 4 的選擇指南：衝突頻繁（搶票這種場景其實很適合悲觀鎖）用悲觀鎖換取安全，衝突少用樂觀鎖換取效能。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 並發問題 | 多個事務同時修改同一筆資料，可能導致資料不一致 |
| 悲觀鎖 | `@Lock(LockModeType.PESSIMISTIC_WRITE)`，查詢時加鎖，適合高衝突 |
| 樂觀鎖 | `@Version`，提交時比對版本號，適合低衝突、讀多寫少 |
| 衝突例外 | `ObjectOptimisticLockingFailureException`，需在 Controller 捕捉 |
| 必須搭配 | 兩種鎖都需要 `@Transactional` 才能正確運作 |

<!--
今天的重點總結。

選鎖的口訣：高衝突用悲觀鎖（排隊），低衝突用樂觀鎖（比版本）。業界大多數場景是低衝突，所以樂觀鎖用得更多。

下一章我們要學 SQL Injection 防範——如何保護 API 不被惡意攻擊者利用 SQL 注入漏洞。
-->

---
layout: end
---

# Q & A

<!--
今天的樂觀鎖與悲觀鎖章節就到這裡。大家有任何問題嗎？
-->
