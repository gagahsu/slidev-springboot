# cafe-shop-deploy

用 Docker Compose 部署轉角咖啡線上商店（SHOP-SPEC §10，Docker 課 ch05–08）。

```
projects/
  cafe-shop-api/      Dockerfile（多階段：JDK 編譯 → Alpine JRE 執行，非 root）、.dockerignore
  cafe-shop-web/      Dockerfile（多階段：Node 打包 → Nginx）、.dockerignore、nginx.conf
  cafe-shop-deploy/   compose.yaml、.env.example   ← 這裡
```

## 啟動

```bash
cp .env.example .env          # 第一次：改掉密碼和 JWT_SECRET
docker compose up -d --build  # 第一次要建映像檔，約 3～5 分鐘
docker compose ps             # 三個服務都是 Up，db 是 (healthy)
```

- 前台：http://localhost
- 後台：http://localhost/admin（`admin@cornercafe.test` / `Admin1234`）

| 服務 | 映像檔 | 說明 |
| ---- | ------ | ---- |
| `db` | `mysql:9.7` | 資料庫 `cafe_shop`，資料在 Volume `db-data`；資料表由後端的 Flyway 建立 |
| `api` | 由 `../cafe-shop-api` 建置 | 不對外開 port，只能經由 `web` 的 `/api` 連進來；上傳的圖片在 Volume `uploads` |
| `web` | 由 `../cafe-shop-web` 建置 | Nginx：提供 Angular 檔案，`/api`、`/uploads` 轉給 `api` |

## 常用指令

```bash
docker compose logs -f api    # 看後端 log
docker compose down           # 停止並移除容器（Volume 保留，資料還在）
docker compose down -v        # 連 Volume 一起刪：資料庫和圖片全部清空
docker compose up -d --build api   # 改了後端程式，只重建 api
```

## 綠界付款

綠界要從網路上連得到 `ReturnURL`。本機測試時：

```bash
cloudflared tunnel --url http://localhost:80
```

把拿到的 `https://xxx.trycloudflare.com` 填進 `.env` 的 `ECPAY_PUBLIC_URL`，再 `docker compose up -d` 讓 `api` 套用新設定。部署到雲端主機時填正式網域即可。

沒有 tunnel 時可以把 `SPRING_PROFILES_ACTIVE` 改成 `dev`，前台會出現「模擬付款」。

## 驗證紀錄

2026-11-20，Docker 29.10 / Compose 5.7：`mysql:9.7`（9.7.4）、`eclipse-temurin:21-jdk` / `21-jre-alpine`、`node:24-alpine`、`nginx:1.31-alpine`。映像檔大小：api 409MB（壓縮 132MB）、web 95MB。

- 三個服務啟動，db healthy 後 api 才啟動；前台、商品圖片、Angular 路由重新整理（`/admin/orders`）
- 管理員登入、上傳圖片（檔案擁有者是 `app`）、加入購物車、下單、產生綠界表單（`ReturnURL` / `OrderResultURL` 用 `.env` 的網址）、`OrderResultURL` 302 回前台、`prod` 時沒有模擬付款
- `docker compose down` 再 `up`：訂單與上傳的圖片都還在
- 只重建 api（`up -d --force-recreate api`）後 Nginx 仍連得到新的 api；api 停著時 web 也能啟動（`/api` 回 502，api 回來後恢復）
- Docker 課 ch06、ch07 的手動 `docker run` 指令（`--network-alias api`、Volume 換容器後資料還在）
- 容器裡的 `mysql` 命令列預設是 latin1：課程指令打中文時加 `--default-character-set=utf8mb4`；compose 的 db 設了 `LANG=C.UTF-8`，`docker compose exec db mysql` 不用加
