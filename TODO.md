# 待辦清單

2026-11-20 整理。完成一項就把狀態改成 `完成` 並寫上日期與做了什麼。

**狀態：** `待辦`｜`進行中`｜`完成`｜`已知限制`（不打算處理）

---

## 一、需要老師自己動手確認

### 1. 綠界實際刷卡 — `待辦`

付款頁有防機器人機制，刷測試卡那一步沒辦法自動化。已驗證的是「付款頁接受我們的表單」和「向綠界查詢」能打通。

要在瀏覽器手動跑一次：

1. 開 Cloudflare Tunnel（`cloudflared tunnel --url http://localhost:8080`；用 Docker 部署時改接 `http://localhost:80`，網址填進 `.env` 的 `ECPAY_PUBLIC_URL`）。
2. 設定 `ECPAY_RETURN_URL=https://<tunnel 網址>/api/payments/ecpay/notify` 後重啟 `cafe-shop-api`。
3. 前台下單，用測試卡 `4311-9522-2222-2222`（有效期限任一未來月年、CVV 任意三碼）付款。
4. 確認訂單自動變成「已付款」（`PAID`），後台看得到付款紀錄。

## 二、專題相關，規格書有寫但還沒做

### 2. Docker 部署 — `完成`（2026-11-20）

SHOP-SPEC §10：`docker compose` 跑三個服務（`db` MySQL、`api` 後端、`web` Nginx 前端加 `/api` 反向代理），資料庫與上傳圖片放在 Volume。

- [x] `projects/cafe-shop-api/Dockerfile`、`projects/cafe-shop-web/Dockerfile` + `nginx.conf` + `config.docker.ts`（angular.json 的 `docker` 設定）、`projects/cafe-shop-deploy/`（`compose.yaml`、`.env.example`、README），實際 `docker compose up` 驗證（見該 README）。
- [x] Docker 課 ch01–08 的貫穿專案從 TaskBoard 換成線上商店，指令與專案檔案一致；ch08 新增「綠界要連得到：兩個網址」「完成品：一行指令開店」。
- [x] 進階學程最後一個階段（Docker）接上專題。
- 沒做：Docker 課仍是原本 slidev-docker 的講法（沒有改成 CLAUDE.md 的「生活故事 → Pairs → Poll」初學者格式）；GitHub Actions 自動建置推送只講概念。

### 3. 其他課的專題切入點 — `完成`（2026-11-20）

規格書（CAFE-SPEC §8、SHOP-SPEC §11）列的各課咖啡店練習，目前只做了 MySQL。

- [x] Git 入門 ch02–04：各加一頁「專題練習」（建 `cafe-web` / `cafe-api`、Publish / Push / Pull、`menu-draft` 分支），附 HistoryCheck 與 CLI 對照
- [x] Git ch17：「三人一組開發線上商店」兩頁（分工與分支保護、指令流程與 PR 描述範本）
- [x] Angular ch08–11：每章一組「專題練習」（題目 + 參考答案），參考解答 `projects/cafe-static/`，截圖在 `public/images/08-html/`、`public/images/11-css/`
- [x] Java 基礎 ch26 練習 8、ch27 練習 5：轉角咖啡菜單（集合、Stream）
- [x] Java 進階 ch22 練習 5（`OrderStatus`、`RspCode`、`BizException`）、ch23 練習 8（超賣與 `synchronized`）
- Java 範例都用 JDK 21 實際執行過，投影片上的輸出是實際結果

### 4. 規格書標頭改成定稿 — `完成`（2026-11-20）

`specs/CAFE-SPEC.md`、`specs/SHOP-SPEC.md` 標頭與「各課切入點」標題的「初稿」已拿掉，狀態改成定稿，切入點表格改成實際做好的章節。

## 三、舊教材的版本相容性（沒有逐章驗證）

### 5. Spring Boot ch04–48 用 4.1.2 重跑 — `完成`（2026-11-20）

- 編譯：ch04–47 每章的完整類別都放進 Spring Boot 4.1.2 專案編譯，沒有框架 API 錯誤（剩下的錯誤都是投影片節錄造成的）。4.1 release notes 列的移除項目（舊 logging 屬性、Derby、layertools）投影片都沒用到。
- 執行：ch12–21（MVC，curl 全部端點）、ch22–25（JDBC）、ch26–29（JPA 查詢、關聯、`@JsonIgnore`）、ch30–32（MyBatis 註解與 XML）、ch33–35（交易回滾、不加鎖超賣／悲觀鎖／樂觀鎖 409、SQL Injection 對照）、ch39–45（school 專案：CRUD、驗證、Swagger、Session、單元測試、排程、Caffeine 快取、log 檔）、ch46–47（httpBasic、註冊、JWT 登入、401／403、竄改 Token）在 MySQL 9.7 上通過。
- 修正：ch30 `mybatis-spring-boot-starter` 4.0.1 → 4.1.0（4.1.0 對應 Spring Boot 4.1；4.0.1 實測也能跑）。
- 修正：ch47 `SecurityConfig` 要把 `/error` 加進 permitAll，否則學生權限不足會得到 401 而不是投影片寫的 403（JWT 過濾器不處理轉到 /error 的請求；Spring Security 6 起就是這樣，不是 4.1 才有）。
- 修正：ch29、ch38、ch39 的回應 JSON 改成實際的欄位順序（Jackson 3 對一般類別照字母排序，record 照宣告順序），ch39 講稿補一句說明。
- 執行（續）：ch04–11（`@Value`、`@PostConstruct`、Lombok 複製 `@Qualifier`、AOP `@Before`/`@After`/`@Around`）；ch48 用 Spring Initializr 實際產生四個專案（Initializr 現在預設 Spring Boot 4.1.2，搭配 Spring Cloud 2025.1.4），Eureka 登記、OpenFeign、Gateway 三條路線、熔斷器備用結果都正常。
- 方法：把投影片的程式抽出來組成可執行專案，在 MySQL 9.7 上用 curl 與整合測試逐項驗證；驗證用的專案沒有放進 repo（都是從投影片原文組出來的）。


### 6. Angular ch01–57 在 Angular 21 上逐章實測 — `完成`（2026-11-20）

- 環境：照 ch05 的步驟用 `@angular/cli@21` 實際 `ng new`（`--file-name-style-guide=2016 --zoneless=false`、SCSS、不開 SSR、不產生 AI 設定），再 `ng add @angular/material`、`npm install chart.js ngx-cookie-service@21`。Angular 21.2、Material 21.2、TypeScript 5.9、RxJS 7.8。
- 確認 ch05 的說明都對：npm 10.9（Node 22）建立專案會出現 `edgesOut` 錯誤、npm 11（Node 24）正常；`addTypeToClassName: true` 後 `ng g c` 產生 `XxxComponent`；根元件類別是 `App`；專案檔案清單一致。
- import 檢查：ch01–57 所有片段用到的 78 個 Angular / Material / RxJS / chart.js / ngx-cookie-service 符號都存在，沒有被標成 `@deprecated` 的。
- 範本檢查：244 段 HTML 用 Angular 21 範本解析器檢查，錯誤只有語法說明的佔位文字、填空題和跨頁範本的後半段。
- 編譯與執行：21 個完整範例（ch21、23、37、38、41–48、50、52、56）拼回完整元件，`ng build`（嚴格範本檢查）通過，瀏覽器逐一打開沒有 console 錯誤；Dialog、倒數計時、購物車（Service／Signals）、表單驗證、圓餅圖都實際操作過。另外 58 組含 `@Component` 的片段也編譯過，錯誤都是節錄造成的。
- 修正：ch31 改成 Material 21 的 `ng add`：只問主題一題（4 個選項，沒有 Custom）、不再問排版與動畫、只改 package.json／styles.scss／index.html 三個檔案；補充練習改成在 `styles.scss` 換 `mat.theme()` 的 palette（原本教改 `angular.json` 的預建主題 CSS，新專案裡沒有那一行）。
- 修正：ch12 說明 `standalone: true` 從 Angular 19 起是預設值、CLI 產生的檔案不會寫；ch18 指向 `@for`（原本寫第 26 章的 `*ngFor`）；ch43 練習只用 `@if`；ch54、ch55 的專案名稱從舊問卷專題改成 `cafe-shop-web`。
- 沒有驗證：ch55 Firebase 的互動畫面（需要 Google 帳號登入）。

## 四、小事

### 7. 舊版 Slidev 不認得自訂元件 — `已知限制`

`<Pairs>`、`<Poll>` 等新元件在舊版 Slidev 會顯示不完整。新網站正常。

### 8. Windows 的 `cloudflared` 安裝 — `已知限制`

教材寫的是下載 MSI 安裝檔，因為 Cloudflare 官方頁面沒有寫 winget 指令。若官方之後提供 winget 指令再改。
