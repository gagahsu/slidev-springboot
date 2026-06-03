---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: "@Transactional — Spring 事務管理"
routeAlias: ch32
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
    @Transactional<br>Spring 事務管理
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「一組操作，要嘛全部成功，要嘛全部復原」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，今天要學的是 @Transactional——Spring 的事務管理機制。

想像銀行轉帳：A 的帳戶扣款成功，但就在準備入款到 B 的帳戶時，系統突然當掉了。結果 A 的錢不見了，B 卻沒收到。這就是沒有事務保護時會發生的悲劇。

@Transactional 就是解決這個問題的工具：讓一組操作要嘛全部成功、要嘛全部撤銷，永遠不會停在中間狀態。

學完今天，大家可以說：「我知道怎麼用 @Transactional 保護重要的資料庫操作了！」
-->

---
layout: default
---

# Outline

- **為什麼需要事務？** — 沒有事務保護會發生什麼問題
- **什麼是事務？** — ACID 原則、Transaction 的定義
- **@Transactional 基本用法** — import、方法層級、類別層級
- **Rollback 規則** — 預設只 Rollback RuntimeException
- **自訂 Rollback 行為** — `rollbackFor`、`noRollbackFor` 設定
- **使用注意事項** — 常見錯誤與邊界情境

<!--
今天的內容分四個部分。前面打概念，後面學用法，最後整理注意事項。

最重要的兩個段落是「基本用法」和「Rollback 規則」——搞懂這兩個，日常開發就夠用了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1

## 為什麼需要事務？

<!--
先從問題出發，看看沒有事務保護的 API 會發生什麼事。
-->

---

# 沒有事務保護時會發生什麼？

以「銀行轉帳」為例：A 轉 1000 元給 B，需要執行兩個操作：

| 步驟 | 操作 | 可能失敗 |
| --- | --- | --- |
| Step 1 | `A 帳戶扣款 1000 元` | ✅ 成功 |
| Step 2 | `B 帳戶入款 1000 元` | ❌ 突然拋出例外 |

**結果：** A 的錢不見了，B 卻沒有收到——資料不一致！

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>事務的目標：</b> 確保「扣款」和「入款」這兩個操作，要嘛都成功，要嘛 Step 2 失敗時 Step 1 也自動撤銷（Rollback）。
</div>

<!--
銀行轉帳是最經典的事務範例，因為它最直觀地說明了「部分成功比完全失敗更危險」這個道理。

Step 2 拋出例外後，如果沒有事務保護，Step 1 的扣款已經寫入資料庫，無法自動還原——錢就憑空消失了。

這在電商訂單、庫存扣減、任何「多步驟資料庫操作」的場景都會發生。
-->

---

# 什麼是事務？ACID 原則

「事務（Transaction）確保一組操作，要嘛全部成功，要嘛全部失敗（Rollback），永遠不會停在中間狀態。」

| ACID 原則 | 說明 |
| --- | --- |
| **A**tomicity（原子性） | 所有操作視為一個整體，全成功或全失敗 |
| **C**onsistency（一致性） | 操作前後資料庫都處於合法狀態 |
| **I**solation（隔離性） | 各事務之間互不干擾 |
| **D**urability（持久性） | 成功提交後，資料永久寫入 |

<!--
ACID 是資料庫事務的四個核心保證，每個字母代表一個原則。

對後端開發者來說，最直接相關的是 Atomicity——原子性，確保操作不會被切開。

Isolation 在樂觀鎖、悲觀鎖那一章會更深入討論。今天先記住：@Transactional 主要幫我們實現 Atomicity。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2

## @Transactional 基本用法

<!--
概念清楚了，來看怎麼在 Spring Boot 裡使用 @Transactional。
-->

---

# Import 選擇

使用 `@Transactional` 時，import 必須選正確的套件：

| import | 說明 |
| --- | --- |
| `org.springframework.transaction.annotation.Transactional` | ✅ **Spring 原生版本，使用這個** |
| `jakarta.transaction.Transactional` | ⚠️ Jakarta EE 版本，功能相似但屬性不同 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>版本注意：</b> Spring Boot 專案一律用 <code>org.springframework.transaction.annotation.Transactional</code>，才能使用 <code>rollbackFor</code>、<code>noRollbackFor</code> 等 Spring 特有屬性。
</div>

<!--
@Transactional 有兩個版本，import 錯了不會報錯，但行為可能不同。

Spring 原生的版本支援 rollbackFor、propagation 等更多屬性，是 Spring 生態系的標準用法。

在 Eclipse 按下快速修正（Ctrl+1）時，IDE 可能同時提示兩個版本，要特別注意選哪一個。
-->

---

# @Transactional 的兩種加法

`@Transactional` 可以加在**方法**或**類別**上：

| 加在哪裡 | 效果 |
| --- | --- |
| **方法**上 | 只有該方法是一個事務 |
| **類別**上 | 類別中所有 public 方法都套用事務 |

```java
@Service
@Transactional          // 所有方法都套用事務
public class OrderService {

    public void createOrder(Order order) { ... }

    @Transactional(readOnly = true)   // 覆寫：唯讀事務
    public Order findById(String id) { ... }
}
```

<!--
加在類別上是「全面保護」，加在方法上是「精準保護」。

業界常見做法是：Service 類別加上類別層級的 @Transactional，然後對查詢方法個別加 readOnly = true——這樣既有保護，又能對查詢操作做效能優化。

readOnly = true 告訴資料庫「這個事務只讀不寫」，資料庫可以做一些優化，例如不用加鎖。
-->

---

# 完整範例：轉帳服務

`@Transactional` 確保兩個 Dao 操作在同一個事務中執行：

```java
@Service
public class BankService {

    @Autowired
    private AccountDao accountDao;

    @Transactional
    public void transfer(String fromId, String toId, int amount) {
        accountDao.deduct(fromId, amount);   // Step 1：扣款
        accountDao.deposit(toId, amount);    // Step 2：入款
    }
}
```

若 `deposit()` 拋出例外，Spring 自動 Rollback `deduct()` 的結果。

<!--
這段程式碼就是前面說的銀行轉帳情境。

只要加上 @Transactional，Spring 會在方法開始前開啟一個事務，方法結束後提交（commit）。如果中間拋出例外，Spring 自動執行 rollback，撤銷所有已執行的資料庫操作。

我們完全不需要手動寫 conn.rollback()——Spring 幫我們搞定了。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 3

## Rollback 規則

<!--
@Transactional 不是碰到所有例外都會 Rollback，來看它的預設規則。
-->

---

# 預設只 Rollback RuntimeException

`@Transactional` 預設只處理 **RuntimeException**（未受檢例外）及其子類別：

```
Exception（所有例外的父類別）
├── RuntimeException   ← @Transactional 預設只 Rollback 這個
│   ├── NullPointerException
│   ├── IllegalArgumentException
│   └── ...（其他未受檢例外）
└── IOException        ← 預設不觸發 Rollback
    └── ...（其他受檢例外）
```

<!--
Java 例外分兩大類：RuntimeException（不需要宣告的例外）和 Checked Exception（需要 try-catch 或 throws 的例外）。

@Transactional 預設只攔截 RuntimeException。為什麼？Spring 設計時認為受檢例外（Checked Exception）是「預期的錯誤情境」，不一定代表操作失敗需要 Rollback。

實務上這個預設常常讓人踩坑——如果你的方法拋出 IOException 卻沒加 rollbackFor，資料就不會 Rollback。
-->

---

# 自訂 Rollback：rollbackFor

讓**受檢例外**也觸發 Rollback：

| 設定 | 說明 |
| --- | --- |
| `rollbackFor = Exception.class` | 所有例外都觸發 Rollback |
| `rollbackFor = IOException.class` | 只有 IOException 觸發 Rollback |
| `rollbackFor = {IOException.class, SQLException.class}` | 多個例外都觸發 Rollback |

```java
@Transactional(rollbackFor = Exception.class)
public void importData() throws IOException {
    // IOException 也會觸發 Rollback
}
```

<!--
rollbackFor 是最常用的屬性之一。

業界有一個常見的做法：對重要的寫入操作，直接加 rollbackFor = Exception.class，確保任何例外都會 Rollback，不留漏洞。

這樣雖然比較嚴格，但對資料一致性要求高的業務（例如金融、訂單）是合理的保守策略。
-->

---

# 自訂 Rollback：noRollbackFor

讓某些 **RuntimeException 不** 觸發 Rollback：

```java
@Transactional(noRollbackFor = IllegalArgumentException.class)
public void processOrder(Order order) {
    // IllegalArgumentException 不會觸發 Rollback
    // 其他 RuntimeException 仍然會 Rollback
}
```

<!--
noRollbackFor 的使用場景比較少，通常是「業務邏輯驗證失敗」這類情況，我們故意拋出 RuntimeException 但不想 Rollback（例如只是回傳錯誤訊息，不需要撤銷操作）。

記住：rollbackFor 和 noRollbackFor 可以同時使用，Spring 會合併規則判斷。
-->

---

# Rollback 規則總結

| 設定 | Rollback 行為 |
| --- | --- |
| `@Transactional`（預設） | 只有 RuntimeException |
| `rollbackFor = Exception.class` | 所有例外 |
| `rollbackFor = IOException.class` | RuntimeException + IOException |
| `noRollbackFor = IllegalArgumentException.class` | RuntimeException（排除 IllegalArgumentException） |

<!--
rollbackFor 讓受檢例外也觸發 Rollback；noRollbackFor 讓特定 RuntimeException 不觸發 Rollback。兩者可以同時使用，Spring 會合併規則判斷。
-->

---

# 使用注意事項

| 注意事項 | 說明 |
| --- | --- |
| **只對 public 方法有效** | private / protected 方法上的 @Transactional 不會生效（AOP 限制） |
| **同類別內呼叫不走代理** | A 方法呼叫同類別的 B 方法，B 的 @Transactional 不生效 |
| **搭配 @Service 使用** | @Transactional 需要 Spring Bean，不能加在非 Spring 管理的類別上 |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>最常見踩坑：</b> 同一個 Service 內的方法 A 呼叫方法 B，就算 B 有 @Transactional 也不會建立新事務。解法：把 B 移到另一個 Service，或使用 <code>@Transactional(propagation = Propagation.REQUIRES_NEW)</code>。
</div>

<!--
這三個注意事項是開發者最常踩的坑。

特別是「同類別內呼叫不走代理」——這是 Spring AOP 的機制限制。Spring 的 @Transactional 是透過動態代理實現的，只有從外部呼叫 Bean 才會走代理，同類別內呼叫是直接呼叫，繞過了代理機制。

如果你加了 @Transactional 但發現事務沒生效，第一件事就是檢查這兩個常見原因。
-->

---
layout: default
---

# 練習：為轉帳 API 加上事務保護
### 任務說明

在 `StudentService` 中加入一個新功能：

**「扣除學生積分並新增懲戒記錄」**，需要同時執行兩個操作：

1. `studentDao.deductScore(studentId, points)` — 扣除積分
2. `penaltyDao.create(studentId, reason)` — 建立懲戒記錄

請確保：若任一步驟拋出 `Exception`，兩個操作都 Rollback。

<!--
這個練習把今天學的 @Transactional 套用到一個實際的業務場景。

大家想想：為什麼我們要讓 Exception 也觸發 Rollback？如果只讓 RuntimeException Rollback 會有什麼風險？

想好了再動手！
-->

---

# 練習：解題提示

1. 在 `StudentService` 的方法加上 `@Transactional(rollbackFor = Exception.class)`
2. 方法內依序呼叫 `studentDao.deductScore()` 和 `penaltyDao.create()`
3. 在 Postman 測試時，可以暫時讓 `penaltyDao.create()` 拋出 `RuntimeException`，確認積分是否被 Rollback

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>成功標準：</b> 當 <code>penaltyDao.create()</code> 拋出例外時，資料庫中的積分沒有被扣除——代表 Rollback 成功。
</div>

<!--
驗證 Rollback 是否成功的最直接方法，就是在第二個操作故意拋出例外，然後去查資料庫確認第一個操作有沒有被還原。

如果積分被扣了但沒被還原，代表事務沒生效，要回去檢查是不是踩了剛才說的注意事項。
-->

---

# 章節總結

| 重點 | 說明 |
| --- | --- |
| 事務 | 一組操作全成功或全 Rollback，確保資料一致性 |
| Import | `org.springframework.transaction.annotation.Transactional` |
| 加在哪裡 | 方法上（單方法事務）或類別上（所有方法套用） |
| 預設 Rollback | 只有 RuntimeException 及其子類別 |
| rollbackFor | 讓受檢例外也觸發 Rollback |
| noRollbackFor | 讓某 RuntimeException 不觸發 Rollback |
| 注意事項 | private 方法無效；同類別呼叫不走代理 |

<!--
今天的重點總結。

最重要的是記住：@Transactional 預設只 Rollback RuntimeException，如果業務邏輯可能拋出受檢例外，一定要加 rollbackFor。

學完今天，大家應該可以說：「我知道怎麼用 @Transactional 保護多步驟的資料庫操作了！」

下一章我們要學的是樂觀鎖和悲觀鎖——它們和 @Transactional 是好夥伴，一起解決並發控制的問題。
-->

---
layout: end
---

# Q & A

<!--
今天的 @Transactional 章節就到這裡。大家有任何問題嗎？
-->
