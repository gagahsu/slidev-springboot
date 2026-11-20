# 待辦清單

2026-11-20 整理。完成一項就把狀態改成 `完成` 並寫上日期與做了什麼。

**狀態：** `待辦`｜`進行中`｜`完成`｜`已知限制`（不打算處理）

---

## 一、需要老師自己動手確認

### 1. 綠界實際刷卡 — `待辦`

付款頁有防機器人機制，刷測試卡那一步沒辦法自動化。已驗證的是「付款頁接受我們的表單」和「向綠界查詢」能打通。

要在瀏覽器手動跑一次：

1. 開 Cloudflare Tunnel（`cloudflared tunnel --url http://localhost:8080`）。
2. 設定 `ECPAY_RETURN_URL=https://<tunnel 網址>/api/payments/ecpay/notify` 後重啟 `cafe-shop-api`。
3. 前台下單，用測試卡 `4311-9522-2222-2222`（有效期限任一未來月年、CVV 任意三碼）付款。
4. 確認訂單自動變成「已付款」（`PAID`），後台看得到付款紀錄。

## 二、專題相關，規格書有寫但還沒做

### 2. Docker 部署 — `待辦`

SHOP-SPEC §10：`docker compose` 跑三個服務（`db` MySQL、`api` 後端、`web` Nginx 前端加 `/api` 反向代理），資料庫與上傳圖片放在 Volume。

- [ ] `projects/` 加 Dockerfile（api 多階段建置、web 用 Nginx）、`nginx.conf`、`docker-compose.yml`、`.env.example`，實際 `docker compose up` 驗證。
- [ ] Docker 課 ch01–08 改成部署線上商店（目前還是 slidev-docker 原本的內容）。
- [ ] 進階學程最後一個階段（Docker）要和專題接得起來。

### 3. 其他課的專題切入點 — `待辦`

規格書（CAFE-SPEC §8、SHOP-SPEC §11）列的各課咖啡店練習，目前只做了 MySQL。

- [ ] Git 入門：建立 `cafe-api`、`cafe-web` 兩個 repo，練習 commit 和 push
- [ ] Git 一般版：分支、Pull Request 的分組流程
- [ ] Angular ch08–11：先刻出咖啡店的靜態版面
- [ ] Java 基礎：用 `Product` 練習集合和 Stream
- [ ] Java 進階：訂單狀態 enum、`BizException`

### 4. 規格書標頭改成定稿 — `待辦`

`specs/CAFE-SPEC.md`、`specs/SHOP-SPEC.md` 標頭還寫「初稿」。

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
