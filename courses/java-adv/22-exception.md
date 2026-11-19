---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 程式異常的處理（進階／自學）
routeAlias: ch22
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
    Java Programming Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    程式異常的處理
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    進階自學內容
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
歡迎來到「程式異常的處理」進階自學篇！基礎版我們已經學會了 try-catch-finally、throw/throws，還有怎麼自訂異常類別。這份自學內容要再補上兩塊業界常見的技巧。

【為什麼要學這個？】
想像我們的程式長大了，不再只是「一個方法、一個異常」這麼單純：可能同時要管理好幾個資源（檔案、網路連線），也可能要對外提供一致格式的錯誤代碼，讓前端或其他系統能直接判斷該怎麼應對。這份自學內容就是要補上這兩塊拼圖。

【學習目標】
學完這份內容後，我們就能用 `enum` 設計一套「錯誤代碼系統」，讓專案裡的錯誤訊息有統一規格；也能熟練使用 try-with-resources 同時管理多個資源，並看懂「被壓制的異常（Suppressed Exception）」是怎麼一回事。
-->
---
layout: default
---

# Outline

- **自定義錯誤代碼和訊息** — 使用 `enum` 統一管理錯誤代碼與訊息
- **try-with-resources 進階用法**
  - 同時管理多個資源
  - Suppressed Exception（被壓制的異常）
  - 自訂 `AutoCloseable` 類別
- **綜合練習**

<!--
【帶讀大綱】
這份自學內容分成兩大塊：第一塊是「用 enum 定義錯誤代碼」，這是很多公司 API 規格的標準做法；第二塊是 try-with-resources 的進階玩法，包括同時管理多個資源、還有當「關閉資源」本身也出錯時會發生什麼事。

【重點預告】
這兩個主題雖然不是寫出基本程式的必要條件，但只要進到稍微正式一點的專案，幾乎都會遇到。學完之後，我們對「錯誤處理」這件事的掌握度會更接近業界水準。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 自定義錯誤代碼和訊息

<!--
【段落轉換】
我們先來看業界的最佳實踐：用 `enum` 定義錯誤代碼和訊息，讓 API 的錯誤回應更一致。
-->
---
layout: default
---

# 自定義錯誤代碼 — 使用 enum

用 `enum` 定義固定的錯誤代碼與訊息：

```java
public enum RtnCode {
    SUCCESS(200, "Success!!"), SAVE_ERROR(400, "Save error!!");
    private int code; private String message;
    RtnCode(int code, String message) {
        this.code = code; this.message = message;
    }
    public int getCode() { return code; }
    public String getMessage() { return message; }
}
```

<!--
【情境切入】
想像我們的系統裡，到處都寫著 `return 200;`、`return 400;` 這種「魔法數字」，半年後新人接手，完全看不懂 200 跟 400 分別代表什麼意思，只能一個個去問。

【概念定義】
這時候就該用 `enum` 把所有可能的結果「列成清冊」：「每一種結果都有一個固定的代碼（code）和說明文字（message），定義一次，全專案共用」。

【生活化比喻】
這就像餐廳的「保險箱密碼規則」：不是每個員工各自記一組數字，而是公司統一發一張對照表，幾號保險箱對應哪個密碼、用途是什麼，一查表就懂，不用每次重新發明。

💼 業界實務：
別再寫死什麼 200、404 了。用 `enum` 把所有的狀態碼和訊息定義好，這樣不管是前端、後端，大家都看同一份規格，這才叫專業。
-->
---
layout: default
---

# 自定義錯誤代碼 — 使用方式

| 情境 | 回傳方式 |
| --- | --- |
| 固定代碼 + 固定訊息 | `RtnCode.SUCCESS.getCode()` + `.getMessage()` |
| 固定代碼 + 動態訊息 | 常數 `ERROR_CODE` + `e.getMessage()` |

<!--
【概念定義】
有了 `enum` 之後，實際使用時分成兩種情境：「結果是固定的，代碼跟訊息都直接從 `enum` 拿」；或是「代碼固定，但訊息要依當下發生的異常動態產生」。

【生活化比喻】
固定代碼 + 固定訊息，就像保險箱裡放的是「標準應急說明書」，內容永遠一樣；固定代碼 + 動態訊息，則像保險箱外面貼了「事故代碼：A07」，但裡面的事故報告每次都不同，要看當時發生什麼事才知道細節。
-->
---
layout: default
---

# 固定代碼 + 動態訊息 — 範例

```java
public static final int ERROR_CODE = 400;
public BaseRes objMapper(String str) {
    try {
        Quiz quiz = mapper.readValue(str, Quiz.class);
    } catch (Exception e) {
        return new BaseRes(ERROR_CODE, e.getMessage());
    }
    return new BaseRes(RtnCode.SUCCESS.getCode(), RtnCode.SUCCESS.getMessage());
}
```

<!--
【範例目的】
這段範例示範「固定代碼 + 動態訊息」的實際寫法：把一段 JSON 字串轉成物件，可能成功也可能失敗。

【帶讀關鍵行】
`try` 裡正常轉換成功，就回傳 `RtnCode.SUCCESS` 對應的固定代碼與訊息；`catch` 抓到任何異常時，代碼固定用 `ERROR_CODE`（400），但訊息直接帶入 `e.getMessage()`，讓使用者知道「這次到底是什麼原因失敗」。

⚠️ 易錯點提醒：
這裡 `catch (Exception e)` 抓得很廣，是因為這是「對外的最後一道防線」——不管裡面發生什麼奇怪的異常，都要包成統一格式的 `BaseRes` 回傳，不能讓異常直接往外飛出去。

【預期結果】
傳入合法 JSON → 回傳 `code=200, message="Success!!"`；傳入格式錯誤的字串 → 回傳 `code=400, message=<實際的異常訊息>`。
-->
---
layout: default
---

# 練習 1：訂單狀態 enum
### 任務說明

設計 `enum OrderStatus`，包含三組代碼與訊息：

- `SUCCESS(200, "訂單成立")`
- `OUT_OF_STOCK(400, "庫存不足")`
- `INVALID_AMOUNT(401, "訂購數量不正確")`

撰寫 `placeOrder(int stock, int amount)` 方法：

- `amount <= 0` → 回傳 `INVALID_AMOUNT`
- `amount > stock` → 回傳 `OUT_OF_STOCK`
- 其餘情況 → 回傳 `SUCCESS`

在 `main` 中測試至少 3 組 `(stock, amount)`，印出對應的 `code` 與 `message`

<!--
【任務鋪陳】
我們剛剛看了 `RtnCode` 這個範例 `enum`，現在換我們自己設計一組「訂單狀態碼」，邏輯完全一樣，只是換了一個場景。

【引導思考】
網購下單時，庫存不夠、數量亂打，後台都要回應對應的代碼給前端。想一想：`placeOrder` 裡面的判斷順序該怎麼安排，才不會漏掉任何一種情況？
-->
---
layout: default
---

# 練習 1：解題提示
### 提示說明

```java
enum OrderStatus {
    SUCCESS(200, "訂單成立"),
    OUT_OF_STOCK(400, "庫存不足"),
    INVALID_AMOUNT(401, "訂購數量不正確");

    private final int code;
    private final String message;
    OrderStatus(int code, String message) {
        this.code = code; this.message = message;
    }
    public int getCode() { return code; }
    public String getMessage() { return message; }
}
```

- `placeOrder` 回傳型別宣告為 `OrderStatus`
- 測資建議：`(10, 0)`、`(10, 20)`、`(10, 5)` 分別對應三種結果

<!--
【帶讀解法】
`enum` 的寫法跟範例中的 `RtnCode` 一模一樣：建構子接 `code` 跟 `message`，再各自寫一個 `getter`。

⚠️ 易錯點提醒：
`placeOrder` 裡面用 `if-else` 依序判斷時，記得先檢查 `amount <= 0`，再檢查 `amount > stock`——如果順序顛倒，當 `amount` 是負數又同時大於 `stock` 時，會回傳錯誤的狀態。
-->
---
layout: default
---

# 練習 2：固定代碼 + 動態訊息
### 任務說明

設計 `BaseRes` 類別，包含 `int code` 與 `String message` 兩個欄位（與對應建構子、getter）。

撰寫 `parseAge(String input)` 方法：

- 嘗試用 `Integer.parseInt(input)` 將字串轉為年齡
- 成功 → 回傳 `new BaseRes(200, "解析成功，年齡為：" + age)`
- 失敗（`NumberFormatException`）→ 回傳 `new BaseRes(400, e.getMessage())`

在 `main` 中分別測試輸入 `"25"` 與 `"twenty"`，印出回傳的 `code` 與 `message`

<!--
【任務鋪陳】
這題就是前面「固定代碼 + 動態訊息」的真實應用，幾乎所有 Web API 都長這樣。

【引導思考】
使用者的輸入永遠不可信。想一想：要怎麼包一層 `try-catch`，讓不管輸入什麼，程式都能優雅地回個 `BaseRes`，而不是當場中止？
-->
---
layout: default
---

# 練習 2：解題提示
### 提示說明

```java
public static final int ERROR_CODE = 400;

static BaseRes parseAge(String input) {
    try {
        int age = Integer.parseInt(input);
        return new BaseRes(200, "解析成功，年齡為：" + age);
    } catch (NumberFormatException e) {
        return new BaseRes(ERROR_CODE, e.getMessage());
    }
}
```

- `BaseRes` 只需要簡單的欄位 + 建構子 + getter，不必繼承任何例外類別
- 兩種輸入都不會讓程式中止，都能拿到一個 `BaseRes` 物件

<!--
【帶讀解法】
跟前面 `objMapper` 範例幾乎一樣的結構：`try` 裡做有風險的事，成功回傳 200，`catch` 裡用 `e.getMessage()` 當作動態訊息塞進固定的 400 代碼。

💼 業界實務：
這就是業界最常見的「統一錯誤格式」寫法——不管後台發生什麼事，回給前端的永遠是同一種結構的物件，前端只要看 `code` 就知道該怎麼處理。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# try-with-resources 進階用法

<!--
【段落轉換】
基礎版我們學過 try-with-resources 可以自動關閉一個資源。接下來看看：如果同時要管理「好幾個」資源呢？關閉的時候又出錯了呢？
-->
---
layout: default
---

# 同時管理多個資源

`try(...)` 括號內可宣告**多個資源**，用分號 `;` 分隔：

```java
try (FileInputStream in = new FileInputStream("data.txt");
     FileOutputStream out = new FileOutputStream("copy.txt")) {
    int b;
    while ((b = in.read()) != -1) {
        out.write(b);
    }
} catch (IOException e) {
    System.out.println("複製失敗：" + e);
}
```

<!--
【情境切入】
想像我們要把一個檔案的內容複製到另一個檔案：需要「一個輸入串流」負責讀，「一個輸出串流」負責寫。兩個資源都要在用完之後關閉，缺一不可。

【概念定義】
try-with-resources 不限於只放一個資源：「在括號內用分號分隔，可以同時宣告多個資源，它們都會在 try 結束時被自動關閉」。

【生活化比喻】
這就像我們同時打開瓦斯爐和抽油煙機做飯：做完飯後，這兩個設備都要關，不能只關一個。try-with-resources 就是幫我們把「兩個都要關」這件事自動處理掉。

⚠️ 易錯點提醒：
資源的**關閉順序**和宣告順序「相反」——後宣告的先關閉。上面範例會先關 `out`，再關 `in`，這通常是我們希望的順序（先確保資料寫完，再關輸入端）。
-->
---
layout: default
---

# Suppressed Exception（被壓制的異常）

當 try 區塊**和**資源的 `close()` **都**發生異常時：

| 行為 | 說明 |
| --- | --- |
| 主異常 | try 區塊中發生的異常，會被正常拋出 |
| 被壓制的異常 | `close()` 發生的異常，會附加在主異常上，不會蓋掉主異常 |
| 取得方式 | `e.getSuppressed()` 回傳 `Throwable[]` |

```java
try {
    ...
} catch (Exception e) {
    for (Throwable sup : e.getSuppressed()) {
        System.out.println("被壓制的異常：" + sup);
    }
}
```

<!--
【情境切入】
想像我們在 try 區塊裡讀檔案時發生了異常（例如檔案格式錯誤），這時程式要自動關閉這個檔案資源——但如果**關閉本身也失敗**了呢？難道要讓「關閉失敗」的異常蓋掉「真正的問題」嗎？

【概念定義】
Java 的設計是：「try 區塊裡發生的異常是主角，會被正常拋出；資源關閉時發生的異常則被當成『配角』，附加在主異常身上，稱為 Suppressed Exception（被壓制的異常）」。

【生活化比喻】
這就像消防演習：火災本身（主異常）是最重要的事，要優先處理跟回報；如果逃生途中某個滅火器也故障了（關閉異常），這件事會被記錄下來附在報告裡，但不會取代「發生火災」這個主要事件。

💼 業界實務：
平常我們很少需要手動呼叫 `getSuppressed()`，但當程式出現「莫名其妙關不掉資源」的問題時，這是排查問題的重要線索。
-->
---
layout: default
---

# 自訂 AutoCloseable 類別

只要實作 `AutoCloseable` 介面（實作 `close()` 方法），自訂類別就能放進 `try(...)`：

```java
class MyConnection implements AutoCloseable {
    String name;
    MyConnection(String name) {
        this.name = name;
        System.out.println(name + " 已連線");
    }
    @Override
    public void close() {
        System.out.println(name + " 已關閉連線");
    }
}
```

<!--
【情境切入】
Scanner、FileInputStream 這些「資源類別」之所以能放進 `try(...)`，是因為它們都實作了 `AutoCloseable` 介面。那如果我們自己寫的類別（例如一個模擬的資料庫連線）也想要這種「自動關閉」的待遇呢？

【概念定義】
答案很簡單：「只要我們自己的類別實作 `AutoCloseable` 介面，並寫好 `close()` 方法裡要做的收尾工作，這個類別的物件就能放進 try-with-resources，享有自動關閉的待遇」。

【生活化比喻】
這就像我們去租借會議室：只要這個會議室「符合公司的歸還流程規範」（實作 `AutoCloseable`），不管是哪個部門租的，系統都知道「用完之後該怎麼歸還、關燈、上鎖」（呼叫 `close()`）。
-->
---
layout: default
---

# 自訂 AutoCloseable — 使用範例

```java
try (MyConnection conn = new MyConnection("資料庫A")) {
    System.out.println(conn.name + " 執行查詢中...");
} catch (Exception e) {
    System.out.println("發生錯誤：" + e);
}
// 輸出：
// 資料庫A 已連線
// 資料庫A 執行查詢中...
// 資料庫A 已關閉連線
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 不論 try 區塊內是否發生異常，<code>close()</code> 都會在離開 try 區塊前被自動呼叫
</div>

<!--
【範例目的】
這個範例示範自訂的 `MyConnection` 放進 try-with-resources 後，整個生命週期是怎麼運作的。

【帶讀關鍵行】
建構子在物件建立時印出「已連線」；離開 try 區塊（無論正常結束或發生異常）時，`close()` 會被自動呼叫，印出「已關閉連線」——我們完全不需要寫 `finally { conn.close(); }`。

⚠️ 易錯點提醒：
`close()` 方法本身如果可能拋出異常，介面定義允許宣告 `throws Exception`；但實務上建議盡量讓 `close()` 不要拋出異常，避免產生前面提到的 Suppressed Exception，讓除錯更單純。

【預期結果】
依序印出：「資料庫A 已連線」→「資料庫A 執行查詢中...」→「資料庫A 已關閉連線」。
-->
---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
這份自學內容補了兩件事：用 enum 統一管理錯誤代碼，以及 try-with-resources 的進階用法（多資源、自訂 AutoCloseable）。接下來這兩題，先練資源管理的細節，再串回基礎版學過的自訂例外、throw/throws，做一次完整的期末驗收。
-->

---
layout: default
---

# 練習 3：雙資源複製與自訂關閉器
### 任務說明

1. 設計類別 `Logger implements AutoCloseable`：
   - 建構子印出「Logger 啟動」
   - 提供 `log(String msg)` 方法印出 `[LOG] msg`
   - `close()` 印出「Logger 關閉」
2. 在 `try(...)` 中**同時**宣告一個 `Scanner`（讀取 `System.in`）與一個 `Logger`
3. 讀取使用者輸入一個整數，呼叫 `log(...)` 記錄輸入的內容
4. 觀察兩個資源的關閉順序

<!--
【任務鋪陳】
這題把「多資源管理」和「自訂 AutoCloseable」兩個主題合在一起：我們要做一個簡單的記錄器（Logger），讓它跟 `Scanner` 一起放進 try-with-resources。

【引導思考】
想一想：`Scanner` 和 `Logger` 兩個資源，宣告順序要怎麼安排比較合理？如果 `Logger` 後宣告，它會比 `Scanner` 先關閉還是後關閉？這跟我們「希望先記錄完才結束」的需求有沒有關係？
-->
---
layout: default
---

# 練習 3：解題提示
### 提示說明

```java
class Logger implements AutoCloseable {
    Logger() { System.out.println("Logger 啟動"); }
    void log(String msg) { System.out.println("[LOG] " + msg); }
    @Override
    public void close() { System.out.println("Logger 關閉"); }
}
```

- `try (Scanner sc = new Scanner(System.in); Logger logger = new Logger()) { ... }`
- 關閉順序與宣告順序相反：先關 `Logger`，再關 `Scanner`
- `logger.log("使用者輸入：" + input)` 記錄輸入內容

<!--
【帶讀解法】
`Logger` 的寫法跟前面 `MyConnection` 範例一樣，只是多了一個 `log()` 方法。重點是 `try(...)` 括號裡把 `Scanner` 和 `Logger` 用分號分隔宣告在一起。

⚠️ 易錯點提醒：
因為關閉順序跟宣告順序相反，`Logger` 會比 `Scanner` 先被關閉。如果 `Logger.close()` 裡還想再用 `Scanner` 讀取資料，那就會出問題——資源之間的關閉順序是設計時要考慮的細節。
-->
---
layout: default
---

# 練習 4 (綜合)：圖書借閱系統
### 任務說明

整合本份自學內容與基礎版所學，設計一個簡易圖書借閱系統：

- 書籍資料：`String[] bookIds = {"B001","B002","B003"}`，`boolean[] available = {true, false, true}`
- 自訂例外 `BookNotAvailableException extends Exception`
- `enum BorrowResult`：`SUCCESS(200,"借閱成功")`、`NOT_FOUND(404,"查無此書")`、`NOT_AVAILABLE(409,"書籍已被借出")`
- `borrowBook(String[] ids, boolean[] available, String bookId)` 方法，宣告 `throws BookNotAvailableException`：
  - 找不到 `bookId` → 拋出例外，訊息為 `NOT_FOUND.getMessage()`
  - 該書 `available == false` → 拋出例外，訊息為 `NOT_AVAILABLE.getMessage()`
  - 否則將該書 `available` 設為 `false`，回傳 `BorrowResult.SUCCESS`
- `main` 中使用 `try-with-resources` 搭配 `Scanner` 與一個自訂 `Logger`（同練習 3）讓使用者輸入書籍編號（輸入 `exit` 結束），每次借閱結果都呼叫 `logger.log(...)` 記錄
- 用 `try-catch-finally` 呼叫 `borrowBook`：catch 印出例外訊息（使用 `BorrowResult` 對應的 `code`/`message`），finally 印出「本次查詢結束」

<!--
【任務鋪陳】
這是這份自學內容的期末驗收：把「enum 錯誤代碼」和「try-with-resources 多資源 + 自訂 AutoCloseable」兩大主題，加上基礎版的自訂例外、throw/throws、try-catch-finally，全部組裝起來。

【引導思考】
想像我們在寫一個圖書館借閱系統的後台。使用者輸入書號，系統要判斷：書存在嗎？借得到嗎？借完要更新狀態，還要記錄每一次操作的結果。每一種情況都要給出明確訊息，而且程式絕對不能因為使用者亂打就崩潰。
-->
---
layout: default
---

# 練習 4 (綜合)：解題提示
### 提示說明

```java
class BookNotAvailableException extends Exception {
    BookNotAvailableException(String message) { super(message); }
}

enum BorrowResult {
    SUCCESS(200, "借閱成功"),
    NOT_FOUND(404, "查無此書"),
    NOT_AVAILABLE(409, "書籍已被借出");
    // ...省略建構子與 getter（同練習 1）
}
```

- `borrowBook` 先用迴圈找出 `bookId` 在陣列中的索引；找不到就 `throw new BookNotAvailableException(BorrowResult.NOT_FOUND.getMessage())`
- `try (Scanner sc = new Scanner(System.in); Logger logger = new Logger()) { while (...) {...} }`，讀到 `"exit"` 就 `break`
- 每次借閱都包一層 `try { borrowBook(...); logger.log(BorrowResult.SUCCESS.getMessage()); } catch (BookNotAvailableException e) { logger.log(e.getMessage()); } finally { System.out.println("本次查詢結束"); }`

<!--
【帶讀解法】
這題把整份自學內容跟基礎版的積木全部組裝起來：
1. 自訂例外（基礎版）－ `BookNotAvailableException`
2. throw/throws（基礎版）－ `borrowBook` 拋出例外
3. enum 錯誤代碼（本檔第一部分）－ `BorrowResult`
4. try-with-resources 多資源 + 自訂 AutoCloseable（本檔第二部分）－ `Scanner` + `Logger`

【最後叮嚀】
如果這題能獨立寫完，代表我們已經把「異常處理」這個主題從基礎到進階都串起來了。這份能力在實務專案裡，是區分「程式能跑」和「程式扛得住」的關鍵之一。
-->
---
layout: end
---

# 課程結束
### 感謝聆聽，有問題請發問！

<!--
[收尾]
這份自學內容到這裡就結束了！我們學會了用 `enum` 設計一套統一的錯誤代碼系統，也學會了 try-with-resources 怎麼同時管理多個資源、被壓制的異常是怎麼回事，以及如何讓自己寫的類別也享有「自動關閉」的待遇。這些技巧在中大型專案裡會經常派上用場，之後遇到類似情境時，記得回來看看這份投影片。
-->
