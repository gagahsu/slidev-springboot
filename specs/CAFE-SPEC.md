# 基礎專題：轉角咖啡一頁式網站 — 共用規格

> 基礎學程（Git / Java / MySQL / Spring Boot / Angular）的專題，以及這些課程裡跟專題有關的範例與練習，一律以本文件為準。
> 要改規格就先改本文件，再改投影片。
>
> 目標：零程式經驗的學生上完基礎學程後，能**自己做出一個前後端串通的小網站**：Angular 畫面 → 呼叫 Spring Boot API → 讀寫 MySQL。
> 進階學程的電商專題（`SHOP-SPEC.md`）是同一家店的線上商店，資料表會沿用並擴充本文件的 `categories`、`products`。

狀態：**定稿**（2026-11-20）。技術版本、範圍已確認（2026-11-18）；參考解答 `projects/cafe-static`（靜態版面）、`projects/cafe-api`、`projects/cafe-web` 已依本規格完成並驗證。之後要改規格，先改本文件再改投影片。

---

## 1. 專題情境

「轉角咖啡 Corner Café」是一家巷口的小咖啡店，老闆想要一個簡單的官網：

- 客人打開網頁，可以看到店家介紹、**菜單**（依分類切換）和營業資訊。
- 客人可以在網頁上**預約訂位**，送出後資料存進資料庫。
- （加分）老闆打開一個簡單的頁面，查看某一天有哪些訂位。

只有一頁（One-page），沒有登入、沒有購物車、沒有金流。

## 2. 技術版本（已確認）

| 項目 | 版本 | 備註 |
| ---- | ---- | ---- |
| Java | **21**（Eclipse Temurin） | Spring Boot 課 ch02 / ch03 目前教 JDK 17，要改成 21 |
| Spring Boot | **4.1.2**（2026-10 發布，Maven Central） | 目前 Spring Boot 課的程式在 4.0.9 編譯執行過，要改用 4.1.2 驗證 |
| 建置工具 | Gradle - Groovy | 同 Spring Boot 課 ch03 |
| MySQL | **9.7 LTS**（寫規格時最新為 9.7.4，2026-10-20 發布） | MySQL 課目前寫 8.0，要改成 9.7 |
| Angular | **21**（`@angular/cli@21`） | Angular 課 ch05 目前的安裝指令是 `@angular/cli@19`，要改成 21 |
| IDE | 後端（Java、Spring Boot）**Eclipse**、前端（Angular）**VS Code** | Java 課也用 Eclipse |

## 3. 專案固定命名

| 項目 | 值 |
| ---- | -- |
| 後端專案 / Artifact | `cafe-api` |
| Group / Package | `com.example` / `com.example.cafe` |
| 前端專案 | `cafe-web` |
| 資料庫 | `corner_cafe`（`utf8mb4`） |
| 後端 Port / 前端 Port | 8080 / 4200 |
| 後端分層（package） | `controller` `service` `repository` `entity` `dto` `exception` `config` |

基礎版刻意**不用** `AppResponse<T>` 統一包裝、不用 `vo`，減少新名詞；API 直接回傳 DTO（見 §6）。

## 4. 資料表（3 張）

```
categories 1 ──< products

reservations（獨立，不跟其他表關聯）
```

| 表 | 欄位 |
| -- | ---- |
| `categories` | `id` PK AI、`name`（≤20，UNIQUE）、`sort_order` INT |
| `products` | `id` PK AI、`category_id` FK → `categories.id`、`name`（≤50）、`description`（≤200，可 NULL）、`price` INT（新台幣元，不用小數）、`image_url`（≤200，可 NULL）、`available` TINYINT（1 = 供應中、0 = 暫停供應）、`sort_order` INT、`created_at` DATETIME |
| `reservations` | `id` PK AI、`name`（≤20）、`phone`（10 碼）、`email`（≤100，可 NULL）、`reserve_date` DATE、`reserve_time` TIME、`people` TINYINT、`note`（≤200，可 NULL）、`created_at` DATETIME |

- 價格一律用 `INT`（元），不用 `DOUBLE` / `DECIMAL`，避免小數誤差的話題在基礎版出現。
- 菜單只顯示 `available = 1` 的品項，依 `categories.sort_order`、`products.sort_order` 排序。
- `products` 的欄位名稱與型別，進階電商會原樣沿用再加欄位，**不要改名**。

### 範例資料（`seed.sql`）

- 分類 5 個：咖啡、茶飲、甜點、輕食、季節限定。「季節限定」目前沒有品項（MySQL ch07 的 LEFT JOIN 練習用）；前端的分類頁籤只顯示有供應中品項的分類。
- 實際的建表與範例資料：`courses/mysql/sql/corner_cafe/schema.sql`、`seed.sql`（MySQL 9.7 驗證過）。
- 品項每類 3～4 個，例如：美式咖啡 90、拿鐵 120、卡布奇諾 120、手沖單品 160；伯爵紅茶 100……；其中 1 個設 `available = 0` 用來示範「暫停供應不顯示」。
- 訂位 5～6 筆，日期用 `CURDATE()` 加減天數（跟 MySQL 課現在的做法一樣），任何時候執行都有「今天」「明天」的資料。

## 5. 訂位規則

| 欄位 | 規則 | 錯誤訊息（範例） |
| ---- | ---- | ---- |
| 姓名 `name` | 必填，1～20 字 | 請輸入姓名 |
| 手機 `phone` | 必填，`09` 開頭共 10 碼數字 | 手機格式不正確 |
| Email `email` | 選填；有填就要符合 Email 格式 | Email 格式不正確 |
| 日期 `reserveDate` | 必填，**今天～今天 + 30 天**（含頭尾） | 只能預約 30 天內的日期 |
| 時段 `reserveTime` | 必填，營業時間 **10:00～19:30，每 30 分鐘一個時段**（最後時段 19:30，20:00 打烊） | 請選擇營業時段 |
| 人數 `people` | 必填，1～8 人 | 一次最多預約 8 位 |
| 備註 `note` | 選填，≤200 字 | 備註最多 200 字 |

- 後端用 Bean Validation 檢查（Spring Boot 課 ch41）；前端也做同樣的檢查，但**以後端為準**。
- 基礎版不檢查「同時段客滿」，也不寄確認信。（可當加分題）
- 營業資訊（地址、電話、營業時間、公休日）寫死在前端，不進資料庫。

## 6. REST API

統一前綴 `/api`，不需要登入。JSON 欄位名稱用 camelCase。

| 方法 | 路徑 | 說明 | 成功回應 |
| ---- | ---- | ---- | ---- |
| GET | `/api/categories` | 所有分類（依 `sortOrder`） | 200，`CategoryDto[]` |
| GET | `/api/products` | 供應中的品項；可帶 `categoryId` 篩選 | 200，`ProductDto[]` |
| POST | `/api/reservations` | 新增訂位 | 201，`ReservationDto`（含 `id`） |
| GET | `/api/reservations?date=yyyy-MM-dd` | （加分）某一天的訂位，依時段排序 | 200，`ReservationDto[]` |

```jsonc
// ProductDto
{ "id": 2, "categoryId": 1, "name": "拿鐵", "description": "濃縮咖啡加上綿密奶泡", "price": 120, "imageUrl": "/menu/latte.svg" }

// POST /api/reservations 的請求內容
{ "name": "王小明", "phone": "0912345678", "email": "", "reserveDate": "2026-12-05", "reserveTime": "18:30", "people": 4, "note": "靠窗" }
```

**錯誤回應**（統一格式，用 `@RestControllerAdvice` 處理）：

```jsonc
// 400：欄位檢查失敗
{ "message": "資料格式不正確", "fields": { "phone": "手機格式不正確", "people": "一次最多預約 8 位" } }
// 404：找不到（例如 categoryId 不存在）
{ "message": "找不到這個分類", "fields": {} }
```

- 日期 `yyyy-MM-dd`、時間 `HH:mm`。
- **CORS**：後端允許 `http://localhost:4200`（這是基礎版最容易卡住的地方，教材要有一章專門處理，見 §8）。
- 品項圖片放在前端 `public/menu/`（Angular 21 的靜態檔資料夾，網址是 `/menu/latte.svg`），資料庫只存路徑；基礎版**不做圖片上傳**。

## 7. 前端畫面（一頁）

由上到下的區塊，每個區塊一個元件：

| 區塊 | 元件 | 內容 | 用到的 Angular 觀念 |
| ---- | ---- | ---- | ---- |
| 頂部導覽 | `HeaderComponent` | 店名、錨點連結（菜單、訂位、營業資訊） | 元件、HTML/CSS |
| 主視覺 | `HeroComponent` | 大圖、標語、「立即訂位」按鈕（捲到訂位區） | CSS（Flex）、事件繫結 |
| 菜單 | `MenuComponent` | 分類頁籤 + 品項卡片（名稱、說明、價格、圖片） | `@for`、`@if`、屬性繫結、呼叫 API |
| 訂位 | `ReservationFormComponent` | 訂位表單；送出成功顯示「已收到您的訂位」；失敗把後端回的 `fields` 顯示在對應欄位下 | `[(ngModel)]` 雙向繫結、表單檢查、呼叫 API |
| 營業資訊 | `FooterComponent` | 地址、電話、營業時間、地圖連結 | 內嵌繫結 |
| （加分）店家查訂位 | `ReservationListComponent`（路由 `/admin/reservations`） | 選日期 → 列出當天訂位 | 路由、日期輸入、`@for` |

- API 呼叫集中在 `CafeApiService`（`HttpClient`）。
- 表單用基礎學程教過的 **`ngModel`**（Angular 課 ch21），**不用** Reactive Forms（那是進階內容，Angular ch51）。
- 不用 Angular Material（進階內容），樣式用一般 CSS。
- RWD：手機寬度下菜單卡片改成一欄即可（不要求完整 RWD 章節的內容）。

## 8. 各課切入點

基礎學程上課順序：Git 入門 → HTML/CSS → Java → MySQL → Spring Boot → Angular → 專題整合。

| 課程 / 章節 | 專題相關內容 |
| ----------- | ------------ |
| Git 入門 ch02–04（原 b02–b04） | 「專題練習」：建立 `cafe-web`、`cafe-api` 兩個 repo（README）、Publish / Push / Pull、在 `menu-draft` 分支寫菜單草稿再合併 |
| Angular ch08–11（HTML / CSS） | 「專題練習」：ch08 HTML 骨架 → ch09 上色與 Box Model → ch10 Flex 排版 → ch11 背景圖、固定導覽列、徽章；參考解答 `projects/cafe-static`（class 名稱與 cafe-web 一致） |
| Java 基礎 ch26–27 | 集合 ch26 練習 8：`record Product` 的菜單用 `List` / `LinkedHashMap` 分組 / `Set`；Stream ch27 練習 5：平均價格、篩選排序 joining、groupingBy 計數、`max` 回傳 `Optional` |
| MySQL ch01、ch04–07 | 建 `corner_cafe` 三張表（DDL）、查菜單（SELECT、WHERE、ORDER BY）、新增訂位（INSERT）、分類 JOIN 品項 |
| Spring Boot ch03 | 建立 `cafe-api` 專案 |
| Spring Boot ch12–21 | 菜單 API（GET）、訂位 API（POST、`@RequestBody`）、RESTful 路徑設計 |
| Spring Boot ch22–23、26–28 | 連上 MySQL，`Product` / `Category` / `Reservation` 的 JPA Entity 與 Repository |
| Spring Boot ch36–37、39、41 | 三層分工、DTO、訂位欄位檢查與錯誤回應 |
| **Spring Boot ch49 前後端串接** | CORS、兩邊同時啟動、Angular 呼叫自己的 API、用瀏覽器開發者工具看請求、常見錯誤（CORS、404、400） |
| Angular ch12–30 | TypeScript、元件、繫結、`@for` / `@if`、呼叫 API |
| **Spring Boot ch50 專題後端、Angular ch58 專題前端** | 照本規格把前後端兜起來，逐項對照 §9 驗收；參考解答在 `projects/cafe-api`、`projects/cafe-web` |

> 現有教材的例子（Spring Boot 的小明、飲料店、學校教務處）**不用改成咖啡店**；咖啡店只出現在專題、練習題和新章。

## 9. 驗收清單

- [ ] 首頁依序顯示導覽、主視覺、菜單、訂位表單、營業資訊。
- [ ] 菜單資料來自 `GET /api/products`，切換分類只顯示該分類；暫停供應的品項不出現。
- [ ] 訂位表單送出成功後，資料庫 `reservations` 多一筆，畫面顯示成功訊息並清空表單。
- [ ] 手機格式錯、人數 9 人、日期超過 30 天：前端擋下；就算繞過前端直接打 API，後端回 400 與欄位訊息。
- [ ] 後端沒啟動時，前端顯示「目前無法連線，請稍後再試」，不是一片空白。
- [ ] 兩個 repo 都有推上 GitHub，至少 5 個有意義的 commit。
- [ ] （加分）`/admin/reservations` 選日期能列出當天訂位。

## 10. 不在範圍內（留給進階學程）

登入與權限、購物車、訂單、金流、圖片上傳、分頁、Angular Material、Reactive Forms、Docker 部署、單元測試。

## 11. 決定紀錄與待確認

已確認（2026-11-18）：
- 技術版本：Java 21、Spring Boot 4.1.2、Angular 21；後端用 Eclipse、前端用 VS Code（§2）。
- 範圍：只做訂位，不做「聯絡我們」留言表單；「店家查訂位」是加分題。
- MySQL 用 9.7 LTS（9.7.4）。
