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

### 5. Spring Boot ch04–48 用 4.1.2 重跑 — `待辦`

範例程式當初用 Spring Boot 4.0.9 編譯驗證，沒有用 4.1.2 重跑。新專案用 4.1.2 沒問題，風險不大，但沒有逐章確認。

### 6. Angular ch01–57 在 Angular 21 上逐章實測 — `待辦`

只改了環境安裝相關的章節（ch05、ch24、ch55、ch57），其他章的範例程式沒有在 Angular 21 上逐章實測。

## 四、小事

### 7. 舊版 Slidev 不認得自訂元件 — `已知限制`

`<Pairs>`、`<Poll>` 等新元件在舊版 Slidev 會顯示不完整。新網站正常。

### 8. Windows 的 `cloudflared` 安裝 — `已知限制`

教材寫的是下載 MSI 安裝檔，因為 Cloudflare 官方頁面沒有寫 winget 指令。若官方之後提供 winget 指令再改。
