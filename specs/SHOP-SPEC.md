# 進階專題：轉角咖啡線上商店（電商前台＋後台）— 共用規格（初稿）

> 進階學程（Git / Java / MySQL / Spring Boot / Angular / Docker）的專題，以及這些課程裡跟專題有關的範例與練習，一律以本文件為準。
> 取代舊的「動態問卷系統」（`SURVEY-SPEC.md`，將整個淘汰）。要改規格就先改本文件，再改投影片。
>
> 目標：上完基礎學程的學生，做出一個**可以實際下單、用綠界測試環境付款**的電商網站，含會員前台與管理後台，最後用 Docker 部署。
> 情境延續基礎專題（`CAFE-SPEC.md`）：同一家「轉角咖啡」開線上商店，賣咖啡豆、濾掛包和器材。

狀態：**初稿**（後端已依本規格實作並驗證，見 §13）。技術版本、運費、逾時、管理員帳號、章數、公開網址工具、前端放 Angular 課都已確認（2026-11-18）。綠界相關內容依 2026-11 查閱的官方技術文件撰寫（來源見 §8.8），寫教材時要再核對一次。

---

## 1. 範圍

| | 必做 | 不做（可當延伸題） |
| --- | --- | --- |
| 前台 | 商品列表（分類、搜尋、排序、分頁）、商品頁（選規格）、購物車、結帳、綠界信用卡付款、會員註冊登入、我的訂單、取消未付款訂單 | 優惠券、商品評價、願望清單、第三方登入、物流串接 |
| 後台 | 營運摘要、商品與規格管理（含圖片上傳、上下架、庫存）、分類管理、訂單管理（出貨、完成、取消）、會員列表、銷售報表 | 多管理員權限分級、退款 API 串接（只做「標記已退款」） |
| 金流 | 綠界全方位金流**測試環境**、信用卡一次付清；開發用的模擬付款 | ATM、超商代碼、分期、定期定額、正式環境上線 |

## 2. 技術版本與命名

技術版本同 `CAFE-SPEC.md` §2：Java 21、Spring Boot 4.1.2、Angular 21、MySQL 9.7 LTS，後端 Eclipse、前端 VS Code。另外用到：Spring Security 7 + JWT（jjwt 0.13）、MyBatis、Flyway、Angular Material、Docker Compose。

| 項目 | 值 |
| ---- | -- |
| 後端專案 / Artifact | `cafe-shop-api` |
| Group / Package | `com.example` / `com.example.shop` |
| 前端專案 | `cafe-shop-web`（前台與後台同一個 Angular 專案，後台在 `/admin/**` 路由下） |
| 資料庫 | `cafe_shop`（`utf8mb4`），結構用 **Flyway** 管理（`V1__schema.sql`、`V2__seed.sql`…） |
| 後端 Port / 前端 Port | 8080 / 4200 |
| 後端分層 | `controller` `service` `repository`（JPA）`mapper`（MyBatis，報表用）`entity` `dto` `vo` `security` `config` `exception` `payment` `scheduler` |
| 統一回應 | `AppResponse<T>`（`code`、`message`、`data`），狀態碼列舉 `RspCode`；`code` 同時是 HTTP 狀態碼 |
| 參考解答 | `projects/cafe-shop-api`（2026-11-19 以 Spring Boot 4.1.2、MySQL 9.7 實際執行驗證） |

## 3. 角色

| 角色 | 可以做什麼 |
| ---- | ---------- |
| 訪客 | 瀏覽商品、把商品放進購物車（存在瀏覽器）；結帳前必須登入或註冊 |
| 會員 `USER` | 訪客能做的全部，加上結帳、付款、查看與取消自己的訂單、修改會員資料 |
| 管理員 `ADMIN` | 後台全部功能。**管理員帳號預先建好**，由 Flyway 的 `V2__seed.sql` 新增（見下方）；前台註冊的帳號一律是 USER，沒有任何 API 可以把自己升級成 ADMIN |

預設管理員帳號（只用於開發與上課）：

| 欄位 | 值 |
| ---- | -- |
| `email` | `admin@cornercafe.test` |
| 密碼 | `Admin1234`（seed 裡存的是 BCrypt 雜湊，不存明碼） |
| `role` | `ADMIN` |

- 教材要提醒：正式上線前一定要改密碼，或改用環境變數在啟動時建立管理員。
- 範例資料另外建 3 個一般會員（`user1～3@cornercafe.test`，密碼都是 `User1234`；user3 還沒下過單），方便示範訂單、權限與「沒有訂單的會員」。
- 實際的建表與範例資料：`courses/mysql/sql/cafe_shop/schema.sql`、`seed.sql`（MySQL 9.7 驗證過；8 張表，訂單時間相對於今天）。

## 4. 資料表（8 張）

```
users 1 ──< cart_items >── 1 product_variants >── 1 products >── 1 categories
  │                                │
  └──< orders 1 ──< order_items >──┘(variant_id，僅供追溯)
          │
          └──< payments
```

| 表 | 欄位 |
| -- | ---- |
| `users` | `id` PK AI、`name`（≤20）、`email` UNIQUE、`password`（BCrypt）、`phone`、`role`（`USER` / `ADMIN`）、`created_at` |
| `categories` | 同基礎版：`id`、`name` UNIQUE、`sort_order` |
| `products` | 基礎版欄位（`id`、`category_id`、`name`、`description`、`price`、`image_url`、`available`、`sort_order`、`created_at`），**新增** `status`（`ON_SALE` / `OFF_SHELF`）、`updated_at`。`price` 改為「列表顯示用的起始價」，實際售價看規格 |
| `product_variants` | `id` PK AI、`product_id` FK、`name`（≤30，例如「半磅 / 中焙」「一磅 / 深焙」）、`sku` UNIQUE（≤30）、`price` INT、`stock` INT（≥0）、`sort_order`、`version` INT（樂觀鎖用） |
| `cart_items` | `id` PK AI、`user_id` FK、`variant_id` FK、`quantity` INT、`updated_at`；**UNIQUE(`user_id`, `variant_id`)** |
| `orders` | `id` PK AI、`order_no` UNIQUE（顯示給客人看的訂單編號）、`user_id` FK、`status`（見 §5）、`items_amount` INT、`shipping_fee` INT、`total_amount` INT、`receiver_name`、`receiver_phone`、`receiver_address`（≤200）、`note`（≤200，可 NULL）、`tracking_no`（可 NULL）、`created_at`、`paid_at`、`shipped_at`、`completed_at`、`cancelled_at`（皆可 NULL）、`cancel_reason`（可 NULL） |
| `order_items` | `id` PK AI、`order_id` FK、`product_id`、`variant_id`、**`product_name`、`variant_name`、`unit_price`**（下單當時的快照）、`quantity`、`subtotal` |
| `payments` | `id` PK AI、`order_id` FK、`provider`（`ECPAY` / `MOCK`）、`merchant_trade_no` UNIQUE（≤20）、`amount` INT、`status`（`PENDING` / `PAID` / `FAILED`）、`trade_no`（綠界交易編號，可 NULL）、`rtn_code`、`rtn_msg`、`payment_type`、`simulate_paid` TINYINT、`paid_at`、`raw_notify` TEXT（原始通知內容，除錯用）、`created_at` |

設計重點（都是教學重點，不要為了省事拿掉）：

- **`order_items` 存快照**：商品改名、改價、刪除，都不能影響已成立的訂單。
- **一張訂單可以有多筆 `payments`**：付款失敗或客人關掉付款頁後再付一次，綠界規定 `MerchantTradeNo` 不能重複使用，所以每次付款都要產生新的 `merchant_trade_no`；`order_no` 則從頭到尾不變。
- 金額一律 `INT`（新台幣元）；綠界的 `TotalAmount` 也只收整數。
- 刪除商品改用「下架」（`status = OFF_SHELF`），不真的刪除，避免訂單追溯不到。

## 5. 訂單狀態

```
            付款成功（綠界通知）           管理員出貨             管理員按完成
PENDING_PAYMENT ──────────────▶ PAID ──────────────▶ SHIPPED ──────────────▶ COMPLETED
      │                          │
      │ 客人取消 / 逾時 30 分鐘     │ 管理員取消（需人工退款，標記即可）
      ▼                          ▼
  CANCELLED                  CANCELLED
```

| 狀態 | 意思 | 允許的動作 |
| ---- | ---- | ---------- |
| `PENDING_PAYMENT` | 已下單、未付款 | 客人：付款、取消；系統：逾時自動取消 |
| `PAID` | 已付款 | 管理員：出貨（填物流單號）、取消 |
| `SHIPPED` | 已出貨 | 管理員：完成 |
| `COMPLETED` | 已完成 | — |
| `CANCELLED` | 已取消 | — |

- 狀態只能照上圖往前走，**不能跳、不能倒退**；在 Service 層檢查，違反就回錯誤（例如已出貨的訂單不能取消）。
- **庫存在「建立訂單」時扣**，取消或逾時時加回去。扣庫存要防超賣（Spring Boot ch34 的鎖）：用 `UPDATE product_variants SET stock = stock - ? WHERE id = ? AND stock >= ?` 檢查影響筆數，或用 `version` 樂觀鎖；建立訂單整段包在 `@Transactional` 裡（ch33）。
- **逾時取消**：排程每分鐘檢查一次，`PENDING_PAYMENT` 超過 30 分鐘就取消並回補庫存（Spring Boot ch44 的 `@Scheduled`）。注意：若此時綠界的付款成功通知才到，要記錄下來並提醒管理員人工處理（見 §8.5）。

## 6. 購物車與結帳規則

- **訪客購物車**存在瀏覽器 `localStorage`（`variantId`、`quantity`）；**登入後**把它合併到資料庫 `cart_items`（同一規格數量相加），然後清空 `localStorage`。之後都以資料庫為準。
- 每個規格的數量 1～10；超過庫存時加入購物車失敗並提示剩餘數量。
- 結帳時後端**重新計算所有金額**，不相信前端送來的價格：
  - `items_amount` = Σ（目前規格售價 × 數量）
  - `shipping_fee` = `items_amount` 滿 **1,000** 元免運，否則 **80** 元
  - `total_amount` = `items_amount` + `shipping_fee`
- 收件資料：姓名（必填，≤20）、手機（必填，`09` 開頭 10 碼）、地址（必填，≤200）、備註（選填，≤200）。
- 結帳畫面用 Reactive Forms（Angular ch51–52）。
- 下單成功後清空該會員的 `cart_items`。

## 7. 前端畫面

### 前台

| 路由 | 畫面 | 重點 |
| ---- | ---- | ---- |
| `/` | 首頁：主視覺、精選商品、分類入口 | 沿用基礎版的版面風格 |
| `/products` | 商品列表：分類篩選、關鍵字搜尋、依價格 / 上架時間排序、分頁（每頁 12） | Material 卡片、Paginator、即時搜尋（Angular ch37） |
| `/products/:id` | 商品頁：圖片、說明、規格選擇（Select）、數量、加入購物車 | 選不同規格時價格與庫存跟著變 |
| `/cart` | 購物車：改數量、刪除、小計、運費提示（「再買 X 元免運」） | 購物車狀態用 **Signals** 的 Service 管理（Angular ch47），頂部購物車圖示顯示數量 |
| `/checkout` | 結帳：收件資料、訂單摘要、「前往付款」 | Reactive Forms、需登入（路由守衛） |
| `/orders/:orderNo/result` | 付款結果：顯示成功 / 處理中 / 失敗，處理中時每 3 秒查一次訂單狀態，最多 1 分鐘 | 見 §8.4 |
| `/me/orders`、`/me/orders/:orderNo` | 我的訂單列表與明細；未付款可「繼續付款」或「取消訂單」 | 需登入 |
| `/login`、`/register`、`/me` | 登入、註冊、會員資料 | JWT |

### 後台（`/admin/**`，限 `ADMIN`）

| 路由 | 畫面 |
| ---- | ---- |
| `/admin` | 營運摘要：今日營業額、今日訂單數、待出貨數、近 7 天營業額折線圖、熱銷 Top 5 |
| `/admin/products` | 商品列表（搜尋、分類、上下架篩選、分頁）、上下架切換 |
| `/admin/products/new`、`/admin/products/:id` | 商品編輯：基本資料、**圖片上傳**、規格清單（用 **FormArray** 動態新增 / 刪除規格，取代原本 Angular ch51 的「動態新增問卷題目」） |
| `/admin/categories` | 分類新增、改名、排序 |
| `/admin/orders`、`/admin/orders/:orderNo` | 訂單列表（依狀態、日期、訂單編號篩選）；明細頁可出貨（填物流單號）、完成、取消；顯示付款紀錄，並有「向綠界查詢」按鈕 |
| `/admin/users` | 會員列表（唯讀） |
| `/admin/reports` | 銷售報表：日期區間營業額、各分類銷售額圓餅圖、商品銷售排行 |

共用：**HTTP 攔截器**自動帶 JWT、收到 401 導向登入；**路由守衛**擋未登入與非管理員（這兩個是 Angular 課目前缺少、要新增的內容）。

## 8. 金流：綠界全方位金流（測試環境）

### 8.1 環境與設定

| 項目 | 值 |
| ---- | -- |
| 付款頁（測試） | `https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5` |
| 查詢訂單（測試） | `https://payment-stage.ecpay.com.tw/Cashier/QueryTradeInfo/V5` |
| 測試特店資料 | 綠界官方文件公開的測試帳號，例如檢查碼範例使用的 `MerchantID 3002607`；`HashKey`、`HashIV` 以官方文件當下公布的為準 |
| 測試信用卡 | `4311-9522-2222-2222`（或 `4311-9511-1111-1111`），安全碼任意 3 碼，有效期限填晚於今天的月年，3D 驗證簡訊碼固定 `1234`（官方「測試介接資訊」<https://developers.ecpay.com.tw/2856/>，2026-11-19 查閱） |

- `merchant-id`、`hash-key`、`hash-iv`、付款頁網址、`return-url`、`order-result-url` 放在 `application-dev.yml` / 環境變數，**不寫死在程式**；正式環境的金鑰絕不 commit 進 Git。
- 測試環境不會向銀行授權，不會產生費用。

### 8.2 付款流程

```
Angular                    Spring Boot                          綠界（測試環境）
  │ 1. POST /api/orders           │                                    │
  │──────────────────────────────▶│ 建立訂單、扣庫存（PENDING_PAYMENT）   │
  │ 2. POST /api/orders/{no}/payments/ecpay                            │
  │──────────────────────────────▶│ 新增一筆 payments（新的 MerchantTradeNo）│
  │◀──────────────────────────────│ 回傳 { action, fields }（含 CheckMacValue）│
  │ 3. 用隱藏表單 POST 到 action（瀏覽器整頁跳轉）                         │
  │───────────────────────────────────────────────────────────────────▶│ 付款頁
  │                               │ 4. ReturnURL（綠界伺服器 → 後端）     │
  │                               │◀───────────────────────────────────│
  │                               │ 驗證、更新訂單 PAID、回應 1|OK        │
  │                               │───────────────────────────────────▶│
  │ 5. OrderResultURL（瀏覽器 POST 到後端）                              │
  │◀──────────────────────────────│ 302 導向 /orders/{no}/result        │
  │ 6. GET /api/orders/{no} 確認狀態                                     │
```

- 第 3 步：綠界規定必須由**前端網頁表單送出**到付款頁，不能由後端直接呼叫。Angular 收到 `fields` 後動態建立 `<form method="post">` 並 `submit()`。
- 第 5 步：`OrderResultURL` 是綠界讓**瀏覽器**用 POST 帶著結果回來的網址，而 Angular 的頁面收不到 POST，所以指向後端的 `/api/payments/ecpay/result`，後端只負責 302 轉到前端結果頁，**不在這裡更新訂單**。

### 8.3 送給綠界的參數（信用卡一次付清）

| 參數 | 值 / 規則 |
| ---- | --------- |
| `MerchantID` | 設定檔 |
| `MerchantTradeNo` | 每次付款新產生，≤20 字元、只能英數字，例如 `CS` + `yyMMddHHmmss` + 4 碼亂數（18 碼）；存進 `payments.merchant_trade_no` |
| `MerchantTradeDate` | `yyyy/MM/dd HH:mm:ss` |
| `PaymentType` | 固定 `aio` |
| `TotalAmount` | `orders.total_amount`（整數） |
| `TradeDesc` | 固定文字，例如 `轉角咖啡線上商店`（不含特殊符號） |
| `ItemName` | 品項用 `#` 串接，例如 `衣索比亞 半磅 x2#濾掛包 10入 x1`；超過 400 字會被截斷造成亂碼與檢查碼錯誤，所以超過時改成「`第一項名稱` 等 N 項」 |
| `ReturnURL` | 後端的 `/api/payments/ecpay/notify`（**必須是公開網址**，見 §8.6） |
| `OrderResultURL` | 後端的 `/api/payments/ecpay/result`（要跟 `ReturnURL` 不同） |
| `ChoosePayment` | `Credit` |
| `EncryptType` | 固定 `1`（SHA256） |
| `CheckMacValue` | 見 §8.7 |

### 8.4 接收付款結果通知（`ReturnURL`）

綠界的伺服器用 `application/x-www-form-urlencoded` POST 到 `/api/payments/ecpay/notify`，主要欄位：`MerchantID`、`MerchantTradeNo`、`RtnCode`、`RtnMsg`、`TradeNo`、`TradeAmt`、`PaymentDate`、`PaymentType`、`TradeDate`、`SimulatePaid`、`CheckMacValue`。

後端處理順序（每一步都是教學重點）：

1. 把收到的原始內容存進 `payments.raw_notify`（除錯用）。
2. **驗證 `CheckMacValue`**：用收到的參數（不含 `CheckMacValue` 本身）重新計算，不相符就記錄並回應錯誤，不更新任何資料。
3. 用 `MerchantTradeNo` 找到 `payments`；找不到就記錄。
4. **防重複**：這筆 `payments` 已經是 `PAID` 就直接回 `1|OK`（綠界沒收到 `1|OK` 會在 5～15 分鐘後重送，當天最多 4 次）。
5. **核對金額**：`TradeAmt` 必須等於 `payments.amount`。
6. `RtnCode = 1` 才算付款成功；其他代碼把 `RtnMsg` 記為失敗原因，`payments.status = FAILED`。
7. `SimulatePaid = 1` 表示是從綠界廠商後台發動的**模擬通知**，沒有真的付款：記錄下來，但**不改訂單狀態、不出貨**。
8. 成功：同一個 `@Transactional` 裡把 `payments` 設為 `PAID`、訂單從 `PENDING_PAYMENT` 改為 `PAID`、寫入 `paid_at`、`trade_no`。
9. 回應純文字 **`1|OK`**（大小寫、符號都要完全一樣；這個回應只代表「收到了」，不影響綠界那邊的付款狀態）。

前端結果頁**只看自己後端的訂單狀態**，不看網址參數，也不相信 `OrderResultURL` 帶回來的內容。

### 8.5 例外狀況

| 狀況 | 處理 |
| ---- | ---- |
| 客人關掉付款頁、沒付款 | 訂單維持 `PENDING_PAYMENT`，「我的訂單」可以「繼續付款」（產生新的 `MerchantTradeNo`），30 分鐘後逾時取消 |
| 付款失敗（`RtnCode ≠ 1`） | `payments` 記 `FAILED`，訂單仍可重新付款 |
| 收不到通知（例如通知網址連不到） | 後台「向綠界查詢」呼叫 `QueryTradeInfo/V5`（必填 `MerchantID`、`MerchantTradeNo`、`TimeStamp`、`CheckMacValue`；`TimeStamp` 3 分鐘內有效；信用卡付款後建議約 10 分鐘再查；呼叫太頻繁會被 403 擋約 30 分鐘），依結果補更新 |
| 訂單已逾時取消，付款通知才到 | 不自動復原訂單：`payments` 記 `PAID`，後台訂單明細顯示「已取消但收到付款，請人工處理（退款或恢復訂單）」 |

### 8.6 讓綠界連得到後端（上課的關鍵問題）

`ReturnURL` 是**綠界的伺服器**呼叫的，學生電腦上的 `localhost:8080` 綠界連不到。兩種解法，教材都要教：

1. **開發時：Cloudflare Tunnel（已確定採用）**
   - 安裝 `cloudflared`，執行 `cloudflared tunnel --url http://localhost:8080`，會拿到一個臨時的 `https://<隨機名稱>.trycloudflare.com` 網址，**不需要註冊帳號**。
   - 把這個網址加上路徑，填進 `return-url`（例如用環境變數 `ECPAY_RETURN_URL`），重啟後端。
   - 臨時網址**每次啟動都會變**，所以要教學生每次上課重新設定；這也是 `return-url` 放設定檔、不寫死的實際理由。
   - 寫教材前要再確認 `cloudflared` 當下的安裝方式與指令（Windows / macOS）。
2. **部署後**：Docker 部署到雲端主機（Docker ch08），用正式網域。

沒有公開網址時，仍可用 §8.9 的模擬付款把整條流程做完。

### 8.7 檢查碼 `CheckMacValue`

依綠界「檢查碼機制」：

1. 參數（不含 `CheckMacValue`）依參數名稱 A→Z 排序，用 `&` 串成 `key=value`。
2. 前面加 `HashKey=xxx&`，後面加 `&HashIV=xxx`。
3. 整串做 URL encode（空白變 `+`），再把 `%2d %5f %2e %21 %2a %28 %29` 換回 `- _ . ! * ( )`（符合綠界要求的 .NET 編碼規則）。
4. 轉小寫。
5. SHA256。
6. 轉大寫，就是 `CheckMacValue`。

- 寫成獨立的 `EcpayCheckMac` 類別，並用**官方文件的範例資料寫單元測試**（Spring Boot ch43），算出來要跟官方範例的結果一樣，才開始接付款頁。
- 常見錯誤：`HashKey` / `HashIV` 貼反、字元看錯（`l` / `I` / `1`）、把 `HashKey` 當參數送出、Java 的 `URLEncoder` 與 .NET 規則不同（就是第 3 步那張替換表）。

### 8.8 參考來源（2026-11 查閱）

- 全方位金流 信用卡一次付清：<https://developers.ecpay.com.tw/?p=2866>
- 付款結果通知（ReturnURL）：<https://developers.ecpay.com.tw/?p=2878>
- 檢查碼機制：<https://developers.ecpay.com.tw/?p=16623>
- 查詢訂單：<https://developers.ecpay.com.tw/?p=2890>

### 8.9 模擬付款（開發用）

`POST /api/orders/{orderNo}/payments/mock`：只在 `dev` profile 啟用，直接走 §8.4 第 8 步把訂單改成 `PAID`（`provider = MOCK`）。教材先用它把下單、庫存、狀態流程做通，下一章再換成綠界。

## 9. REST API

統一前綴 `/api`，回應包在 `AppResponse<T>`（綠界的兩個回呼網址除外）。分頁回應：`{ content: [...], page, size, totalElements, totalPages }`，`page` 從 0 開始。

| 方法 | 路徑 | 權限 | 說明 |
| ---- | ---- | ---- | ---- |
| POST | `/api/auth/register`、`/api/auth/login` | 公開 | 註冊、登入（回傳 JWT） |
| GET / PUT | `/api/users/me` | 會員 | 會員資料 |
| GET | `/api/categories` | 公開 | 分類 |
| GET | `/api/products` | 公開 | 上架商品：`categoryId`、`keyword`、`sort`（`price,asc` / `price,desc` / `createdAt,desc`）、`page`、`size`（預設 12） |
| GET | `/api/products/{id}` | 公開 | 商品含規格 |
| GET | `/api/cart` | 會員 | 購物車（含目前價格、庫存、小計、運費試算） |
| POST | `/api/cart/items` | 會員 | 加入（同規格數量相加） |
| PUT / DELETE | `/api/cart/items/{variantId}` | 會員 | 改數量 / 刪除 |
| POST | `/api/cart/merge` | 會員 | 登入後合併 `localStorage` 購物車 |
| POST | `/api/orders` | 會員 | 用購物車建立訂單（Body：收件資料） |
| GET | `/api/orders`、`/api/orders/{orderNo}` | 會員 | 我的訂單、明細（只能看自己的） |
| POST | `/api/orders/{orderNo}/cancel` | 會員 | 取消（僅 `PENDING_PAYMENT`） |
| POST | `/api/orders/{orderNo}/payments/ecpay` | 會員 | 產生付款表單資料 `{ action, fields }` |
| POST | `/api/orders/{orderNo}/payments/mock` | 會員（僅 dev） | 模擬付款 |
| POST | `/api/payments/ecpay/notify` | 公開（綠界呼叫） | ReturnURL，回應純文字 `1|OK` |
| POST | `/api/payments/ecpay/result` | 公開（瀏覽器） | OrderResultURL，302 導向前端結果頁 |
| GET | `/api/admin/dashboard` | ADMIN | 營運摘要 |
| GET / POST | `/api/admin/products` | ADMIN | 商品列表（含下架）/ 新增（含規格） |
| GET / PUT | `/api/admin/products/{id}` | ADMIN | 明細 / 修改（含規格增刪改） |
| PATCH | `/api/admin/products/{id}/status` | ADMIN | 上架 / 下架 |
| POST | `/api/admin/uploads` | ADMIN | 上傳圖片（`multipart/form-data`；jpg / png / webp，≤2 MB），回傳圖片網址 |
| GET / POST / PUT | `/api/admin/categories`、`/api/admin/categories/{id}` | ADMIN | 分類 |
| GET | `/api/admin/orders`、`/api/admin/orders/{orderNo}` | ADMIN | 訂單列表（`status`、`from`、`to`、`orderNo`、分頁）/ 明細含付款紀錄 |
| POST | `/api/admin/orders/{orderNo}/ship` | ADMIN | 出貨（Body：`trackingNo`） |
| POST | `/api/admin/orders/{orderNo}/complete`、`/cancel` | ADMIN | 完成 / 取消 |
| POST | `/api/admin/orders/{orderNo}/payments/query` | ADMIN | 向綠界查詢交易狀態並補更新 |
| GET | `/api/admin/users` | ADMIN | 會員列表 |
| GET | `/api/admin/reports/sales` | ADMIN | 報表：`from`、`to`；回傳每日營業額、分類銷售額、商品排行（**用 MyBatis XML 寫**） |

- 上傳的圖片存在後端的 `uploads/` 資料夾，以 `/uploads/**` 提供（範例資料的 `product-1.jpg`～`product-8.jpg` 內附在專案的 `src/main/resources/sample-uploads/`，同一個網址找得到）；Docker 部署時這個資料夾掛 Volume（Docker ch07）。
- 安全：JWT、`/api/admin/**` 需 `ADMIN`；兩個綠界網址 `permitAll`；CORS 允許 `http://localhost:4200`。

## 10. 部署（Docker）

`docker-compose.yml` 三個服務 + 兩個 Volume：

| 服務 | 說明 |
| ---- | ---- |
| `db` | MySQL 9.7（官方映像檔，標籤寫教材時確認，預期為 `mysql:9.7`），資料存在 Volume `db-data` |
| `api` | `cafe-shop-api`（多階段建置的 Dockerfile），綠界金鑰與 JWT 密鑰用環境變數；上傳圖片存在 Volume `uploads` |
| `web` | `cafe-shop-web` 打包後用 Nginx 提供，`/api` 反向代理到 `api` |

部署到雲端主機後，`ReturnURL` 改成正式網域，就不需要 Cloudflare Tunnel。

## 11. 各課切入點（初稿）

| 課程 / 章節 | 專題相關內容 |
| ----------- | ------------ |
| Git 一般版 ch05、ch09 | 分組開發：功能分支、Git Flow、Pull Request 審查 |
| Java 進階 | 泛型、enum（訂單狀態）、Optional、例外設計（`BizException`）、多執行緒概念（為什麼會超賣） |
| MySQL ch02–03 | 正規化、8 張表的關聯設計（為什麼訂單明細要存快照） |
| MySQL ch08–10 | 商品搜尋的索引、報表查詢（GROUP BY、子查詢）、VIEW |
| MySQL ch11 | 用 Flyway 管理 `cafe_shop` 的結構 |
| Spring Boot ch29 | 商品 1—N 規格、訂單 1—N 明細的 JPA 關聯 |
| Spring Boot ch30–32 | 銷售報表用 MyBatis |
| Spring Boot ch33–35 | 建立訂單的交易、扣庫存防超賣、SQL Injection |
| Spring Boot ch40、42–47 | API 文件、測試（檢查碼單元測試）、Log、逾時取消排程、商品快取、Security + JWT |
| Spring Boot ch49 起（**改寫，擴充成 7 章**） | 見下方「Spring Boot 專題章節」 |
| Angular ch31–55 | Material 版面、表格、Select、Dialog、圓餅圖、RxJS、Signals 購物車、Sidenav 後台版型、Reactive Forms（結帳、商品規格 FormArray）、RWD、打包 |
| Angular 新章 | HTTP 攔截器、路由守衛 |
| **Angular 專題章（新增）** | 電商前台與後台的全部畫面（§7），接在 Material、Signals、Reactive Forms 之後；章數與切分待寫 Angular 部分時再定 |
| Docker ch01–08 | 以 `db` / `api` / `web` 三個容器貫穿，ch07 Volume、ch08 部署 |

Spring Boot ch48 Spring Cloud 不在進階學程內。

### Spring Boot 專題章節（初稿，取代原本 ch49–53 的問卷專題）

| 章 | 主題 | 內容 |
| -- | ---- | ---- |
| 1 | 專題總覽與資料模型 | 需求與畫面導覽、8 張表、Flyway（`V1__schema.sql`、`V2__seed.sql` 含預設管理員）、Entity 與 Repository |
| 2 | 會員、權限與統一回應 | `AppResponse<T>`、`RspCode`、`BizException`、註冊登入、JWT、`/api/admin/**` 限 ADMIN |
| 3 | 商品與後台商品管理 | 商品與規格查詢（分頁、搜尋、排序）、後台商品 CRUD、上下架、圖片上傳、分類快取 |
| 4 | 購物車 | 購物車 API、登入後合併、庫存與數量檢查、運費試算 |
| 5 | 訂單與模擬付款 | 建立訂單（交易、防超賣、金額重算、明細快照）、訂單狀態、取消、逾時排程、模擬付款 |
| 6 | 綠界金流 | 檢查碼與單元測試、產生付款表單、接收付款通知、結果頁轉址、Cloudflare Tunnel、向綠界查詢 |
| 7 | 後台訂單與報表 | 出貨、完成、取消、營運摘要、MyBatis 銷售報表 |

**前端不在 Spring Boot 課**：電商畫面全部放在 Angular 課；Spring Boot 課只講後端，前端用 API 測試工具或瀏覽器開發者工具驗證。原本 Spring Boot ch53（問卷的 Angular 前端舊內容）隨問卷專題一起淘汰。

## 12. 驗收清單

- [ ] 訪客把商品加入購物車，登入後購物車被合併，數量正確。
- [ ] 下單後庫存立即減少；兩個瀏覽器同時搶最後一件，只有一個成功。
- [ ] 前端竄改價格送出，後端仍以資料庫價格計算。
- [ ] 用綠界測試卡付款成功後，訂單變成 `PAID`；同一筆通知重送不會重複處理。
- [ ] 竄改通知內容（例如改 `TradeAmt`）會因檢查碼不符被拒絕。
- [ ] 未付款訂單 30 分鐘後自動取消並回補庫存。
- [ ] 已出貨的訂單不能取消；非管理員打 `/api/admin/**` 回 403。
- [ ] 後台能上傳商品圖片、新增多個規格、上下架；報表數字與訂單資料一致。
- [ ] `docker compose up` 一次啟動三個服務，重開後資料與圖片都還在。

## 13. 決定紀錄與待確認

已確認（2026-11-18）：
- 技術版本：Java 21、Spring Boot 4.1.2、Angular 21、MySQL 9.7 LTS（9.7.4）；後端 Eclipse、前端 VS Code。
- 運費滿 1,000 免運、否則 80 元；未付款 30 分鐘自動取消。
- 管理員帳號預先建好（§3），不採用「第一個註冊的帳號成為管理員」。
- Spring Boot 專題擴充成 7 章（§11）。
- 開發時的公開網址工具用 Cloudflare Tunnel（§8.6）。
- 電商前端畫面全部放在 Angular 課；Spring Boot 課只講後端，原本 ch53 的 Angular 前端舊內容淘汰（§11）。

寫教材前要查證（不需要另外決定）：
1. ~~綠界測試信用卡卡號~~：已查證（§8.1）。
2. `cloudflared` 當下的安裝方式與指令、MySQL 9.7 的 Docker 映像檔標籤。

實作驗證（2026-11-19，`projects/cafe-shop-api`）：
- 檢查碼單元測試用官方範例，算出 `6C51C9E6…B5685B840`，與官方一致。
- 產生的付款表單送到綠界測試環境付款頁，頁面正常顯示訂單編號與金額（沒有檢查碼錯誤）；`QueryTradeInfo/V5` 實際查詢成功，回應的檢查碼驗證通過。
- 用 curl 驗證：註冊登入、403/401、購物車上限與庫存、合併、下單扣庫存與快照、兩人搶最後一件只有一人成功、竄改通知被拒、模擬通知不改狀態、重送通知不重複處理、OrderResultURL 302、狀態機、逾時取消回補庫存、模擬付款、後台商品與規格增刪改、SKU 重複 409、上下架、圖片上傳、報表與營運摘要。
- 未自動化：在綠界付款頁實際刷測試卡（付款頁有防機器人機制，需在瀏覽器手動操作）。
