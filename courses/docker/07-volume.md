---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: Volume 資料持久化
routeAlias: ch07
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Docker 容器化課程</p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">Volume 資料持久化</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「容器會消失，但資料不必跟著陪葬」
  </p>
  <Link to="home" style="margin-top: 2rem; color: #5eada0; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第七章，Volume 資料持久化。

還記得第三章練習二留下的問題嗎？我們在 cafe-shop-db 裡建了一張表、塞了一筆資料，然後問：容器刪掉重建之後，資料還在嗎？答案是全部消失。

這一章就要解決這個問題。我們會學三種讓資料活得比容器久的方式，Volume、Bind Mount 和 tmpfs，也會實際做一次資料庫的備份與還原。學完之後，線上商店的資料就不會再因為刪掉容器而消失。
-->

---
layout: default
---

# Outline

- 為什麼容器需要「外部儲存」——資料持久化的痛點
- Volume vs Bind Mount vs tmpfs 三種儲存方式比較
- `docker volume` 指令：create / ls / inspect / rm
- `-v` 短語法 vs `--mount` 長語法
- 實戰：用臨時容器備份與還原 Volume 資料
- 練習題 x2（難度遞增）
- 總結

<!--
這一章分成三部分。第一部分搞懂 Volume、Bind Mount、tmpfs 這三個常被搞混的名詞，以及兩種掛載語法。第二部分實際操作 docker volume 的管理指令。第三部分是重點，用臨時容器把資料備份出來，再還原回去。最後有兩題練習，難度逐步增加。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Volume vs Bind Mount vs tmpfs

<!--
我們先進入第一部分，建立觀念。接下來所有的操作，都建立在「知道自己在用哪一種儲存方式」的前提上。
-->

---
layout: default
---

# 容器被刪掉之後，資料去哪了？

「容器預設是無狀態（stateless）的，容器內的檔案系統會隨著容器一起被刪除。」

- `docker rm cafe-shop-db` 刪掉容器，裡面的會員、訂單、商品資料也一起消失
- 後台上傳的商品圖片存在 `cafe-shop-api` 容器的 `/app/uploads`，重建 api 容器（每次改程式都會）圖片就不見
- 開發測試環境影響不大，正式環境的重要資料一旦跟容器綁在一起就是災難
- Docker 提供三種方式讓資料「活得比容器久」：Volume、Bind Mount、tmpfs

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>還記得第三章練習 2 的伏筆嗎？</b> 我們在 <code>cafe-shop-db</code> 裡手動建了一張表、塞了一筆資料。這一章就是要回答那個問題：容器刪掉重建之後，那筆資料還在嗎？
</div>

<!--
「容器預設是無狀態的，容器內的檔案系統會隨著容器一起被刪除。」

`docker rm cafe-shop-db` 一下去，會員、訂單全部跟著消失，而且沒有垃圾桶可以復原。

商店還有第二份容易被忘記的資料：後台上傳的商品圖片。它們存在 api 容器的 `/app/uploads` 資料夾。我們每次改了 Java 程式，都會重建 api 容器，舊容器一刪，圖片也跟著沒了，商品頁就只剩破圖。

開發環境還好，正式環境的重要資料如果跟容器綁在一起，就是災難。

我們可以把容器想成一間臨時搭建的房子，說拆就拆。貴重物品如果都放在房子裡，房子一拆，東西就跟著沒了。

所以我們要把資料放到房子外面。Docker 提供三種方式，Volume、Bind Mount、tmpfs，接下來一個一個看。
-->

---
layout: default
---

# 什麼是 Volume？

「Volume（資料卷）是由 Docker 建立與管理的持久化儲存空間，儲存在 host 上 Docker 管理的目錄裡，生命週期完全獨立於容器。」

容器刪除後，Volume 資料依然保留，可掛載給新容器繼續使用。

```bash
docker volume create cafe-shop-db-data
docker run -d --name cafe-shop-db \
  -v cafe-shop-db-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=cafe_shop mysql:9.7
```

Volume 的資料由 Docker 全權管理，我們不需要知道它實際存在 host 的哪個路徑，只需要透過 `docker volume` 指令來操作。

<!--
第一種，也是官方最推薦的，Volume。

「Volume 是由 Docker 建立與管理的持久化儲存空間」，生命週期完全獨立於容器。

延續房子的比喻，Volume 就像我們額外租的外部倉庫。房子拆了，倉庫還在。重新蓋一間房子，照樣可以把倉庫接回去用。

範例先建立 cafe-shop-db-data，再掛到容器的 `/var/lib/mysql`。這是 MySQL 存放所有資料檔的目錄，也是 MySQL 容器唯一需要保存的地方。之後就算容器被刪除，重新 run 一個新容器掛上同一個 Volume，所有會員和訂單都會原封不動回來。商品圖片也是同樣做法，再建一個 Volume 掛到 api 的 `/app/uploads`，後面的 Compose 範例會看到。

Volume 由 Docker 全權管理，我們不需要知道它實際存在主機的哪個路徑，用 docker volume 指令操作就好。這點跟下一頁的 Bind Mount 完全不同。
-->

---
layout: default
---

# 什麼是 Bind Mount？

「Bind Mount（綁定掛載）是把 host 上『既有』的檔案或目錄，直接掛載進容器內，容器看到的就是 host 上那份原始資料。」

掛載的是 host 上原本就存在的路徑，容器刪除不影響 host 端資料。

```bash
# 把 MySQL 課的建表腳本掛進 init 目錄（唯讀），開一個練 SQL 用的資料庫
docker run -d --name sql-practice -p 3308:3306 \
  --mount type=bind,source="$(pwd)"/sql/corner_cafe,target=/docker-entrypoint-initdb.d,readonly \
  -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=corner_cafe mysql:9.7

# 開發時把上傳的圖片放在本機資料夾，用檔案總管就看得到
docker run -d --name cafe-shop-api \
  --mount type=bind,source="$(pwd)"/uploads,target=/app/uploads \
  cafe-shop-api:1.0.0
```

常見情境：掛設定檔、掛初始化腳本、開發時直接在本機看容器寫出來的檔案。

<!--
第二種是 Bind Mount。

「Bind Mount 是把 host 上既有的檔案或目錄，直接掛載進容器內」，容器看到的就是主機上那份原始資料。

用比喻來說，Bind Mount 就像把自己家裡的書櫃，暫時搬進容器這個房間給它用。容器怎麼重建刪除，書櫃始終是我們家的東西。

第一個範例很實用。MySQL 官方 Image 有個約定，放在 `/docker-entrypoint-initdb.d` 底下的 SQL 檔，會在資料庫第一次初始化時，照檔名順序自動執行。我們把 MySQL 課基礎專題的 `schema.sql` 和 `seed.sql` 所在的資料夾整個掛進去，容器一起來，三張表和範例資料就建好了，想練 SQL 隨時開一個。最後加上 readonly，容器裡的程式就改不到我們的檔案。

那商店的資料庫為什麼不用這招？因為商店的表由後端的 Flyway 管理，版本一升級它會自己補上新的表和欄位。init 腳本只在第一次跑，之後改了也不會再執行，兩種方式不要混著用。

第二個範例把商品圖片的資料夾接到本機，開發時用檔案總管就看得到後台上傳了哪些圖。

要注意 Bind Mount 預設可以寫入，容器裡的程式亂刪檔案，會直接影響主機。敏感的目錄一定要加唯讀。
-->

---
layout: default
---

# 什麼是 tmpfs？

「tmpfs mount 是把資料存在 host 的記憶體中，不會寫入任何檔案系統，容器停止或 host 重開機，資料就會消失。」

寫入速度快，容器一停止內容就消失，無法保留。

```bash
docker run -d --name cafe-shop-api \
  --mount type=tmpfs,destination=/tmp \
  cafe-shop-api:1.0.0
```

- 適合暫存資料：session 快取、暫存運算結果
- 只支援 Linux 容器
- 速度快但不持久，是與 Volume、Bind Mount 最本質的差異

<!--
第三種是 tmpfs，它最特別，根本不寫進硬碟。

「tmpfs mount 是把資料存在 host 的記憶體中」，容器停止或主機重開機，資料就消失。

用比喻來說，tmpfs 就像便利貼，寫起來又快又方便，但撕掉之後內容就沒了。

範例把 tmpfs 掛到 `/tmp`。Spring Boot 處理檔案上傳時，暫存檔就寫在這裡。這種資料寫完馬上處理掉，放記憶體最快，而且容器一停自動清空，不會累積垃圾。

要注意兩件事。tmpfs 只支援 Linux 容器，而且千萬不要把重要資料放進去，容器一重啟就救不回來了。
-->

---
layout: default
---

# Volume vs Bind Mount vs tmpfs 比較

| 比較項目 | Volume | Bind Mount | tmpfs |
| --- | --- | --- | --- |
| 儲存位置 | Docker 管理的 host 目錄 | host 上任意指定路徑 | host 記憶體 |
| 管理方式 | `docker volume` 指令管理 | 依賴 host 檔案系統 | 隨容器生命週期 |
| 資料持久性 | 容器刪除後仍保留 | 容器刪除後仍保留（在 host 上）| 容器停止即消失 |
| 適合情境 | 資料庫、需要備份遷移的資料 | 開發環境掛載原始碼、設定檔 | 暫存快取、機敏暫存資料 |
| 線上商店的用法 | `db-data` → `/var/lib/mysql`、`uploads` → `/app/uploads` | 練 SQL 的初始化腳本、開發時看上傳的圖片 | API 的 `/tmp` |

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選擇原則：</b> 需要 Docker 幫忙管理、備份、遷移，選 Volume；需要直接存取 host 上的既有檔案（設定檔、SQL 腳本），選 Bind Mount；只是暫存、不在乎重開就消失，選 tmpfs。
</div>

<!--
這張表把三種方式並排比較，我們挑最後一列，線上商店的用法來看。

資料庫的資料和商品圖片用 Volume，分別掛到 `/var/lib/mysql` 和 `/app/uploads`。初始化腳本和開發時想直接看的檔案用 Bind Mount。API 的 `/tmp` 用 tmpfs。

下面的選擇原則很簡單。需要 Docker 幫忙管理、備份、搬遷的，選 Volume。需要直接使用主機上既有的檔案，選 Bind Mount。只是暫存、不在乎消失的，選 tmpfs。

有一點容易誤解。Bind Mount 在容器刪除後資料還在，是因為它本來就存在主機上，不是 Docker 幫忙保留的，跟 Volume 的持久化邏輯是不同的概念。
-->

---
layout: default
---

# 補充：`-v` 短語法 vs `--mount` 長語法

Docker 官方文件建議「優先使用 `--mount`」，因為它語意明確、參數完整；`-v` 是比較早期的簡短寫法，範例中仍然很常見。

```bash
# --mount 長語法（推薦）
docker run --mount type=volume,src=cafe-shop-db-data,dst=/var/lib/mysql mysql:9.7

# -v 短語法（常見但語意較不明確）
docker run -v cafe-shop-db-data:/var/lib/mysql mysql:9.7
```

⚠️ Docker 版本注意：在 Compose 檔案中，官方建議 Volume／Bind Mount 都用 `type: bind` / `type: volume` 的長語法明確標示類型，短語法 `./data:/data` 目前仍支援、也很常出現在範例中，並不算錯誤，但團隊協作時長語法可讀性更好。

<!--
接下來的範例會用到兩種掛載寫法，這一頁先把差別講清楚。

官方建議優先使用 `--mount` 長語法。它的 type、來源、目標都寫得清清楚楚，一看就懂。`-v` 短語法比較精簡，範例裡也很常見，但如果沒背熟順序，容易搞混哪邊是主機、哪邊是容器。

兩行範例的效果完全一樣，都是把 cafe-shop-db-data 掛到 `/var/lib/mysql`。

在 Compose 檔案裡也是類似的情況。短語法目前仍然支援，也不算錯，但團隊合作、需要標示唯讀這類選項時，長語法的可讀性比較好。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# docker volume 指令

<!--
觀念建立好了，第二部分我們來看 Volume 的管理指令，把剛才的觀念變成實際的操作。
-->

---
layout: default
---

# docker volume 常用指令

| 指令 | 說明 |
| --- | --- |
| `docker volume create <name>` | 建立一個新的 Volume |
| `docker volume ls` | 列出所有 Volume |
| `docker volume inspect <name>` | 檢查 Volume 的詳細資訊（如 host 上實際路徑）|
| `docker volume rm <name>` | 刪除指定 Volume |
| `docker volume prune` | 清除所有未被任何容器使用的 Volume |

<!--
這張表是最常用的五個 Volume 指令，涵蓋了 Volume 從建立到清理的完整過程。

create 建立，ls 列出，rm 刪除，用法跟之前學的指令一樣。

比較特別的是 inspect，它會告訴我們 Volume 在主機上實際的路徑。以及 prune，它會一次清除所有沒被容器使用的 Volume。

下一頁我們實際跑一次，看看輸出長什麼樣子。
-->

---
layout: default
---

# docker volume 常用指令 — 範例

```bash
$ docker volume create cafe-shop-db-data
cafe-shop-db-data

$ docker volume ls
DRIVER    VOLUME NAME
local     cafe-shop-db-data
local     cafe-shop_db-data          # Compose 建的會自動加專案名稱前綴

$ docker volume inspect cafe-shop-db-data
[
    {
        "Driver": "local",
        "Mountpoint": "/var/lib/docker/volumes/cafe-shop-db-data/_data",
        "Name": "cafe-shop-db-data",
        "Scope": "local"
    }
]
```

<!--
我們一步步操作。先用 create 建立 cafe-shop-db-data，再用 ls 確認它存在。

注意 ls 輸出的第二列，那是第五章用 Compose 建立的 Volume。Compose 會自動在 Volume 名稱前面加上專案名稱，專案名稱預設就是資料夾名稱。這解釋了一個常見的疑惑，compose.yaml 裡明明寫 db-data，列出來卻是 cafe_shop 底線 db-data。也因為有這個前綴，不同專案的同名 Volume 不會互相衝突。

最後看 inspect 輸出的 Mountpoint 欄位，這就是 Volume 在主機上的實際路徑。平常不需要直接碰它，但除錯的時候很有用。它也證明了 Volume 底層其實還是存在主機的檔案系統上，只是由 Docker 統一管理。
-->

---
layout: default
---

# 掛載 Volume 到容器

```bash
docker run -d --name cafe-shop-db \
  --mount source=cafe-shop-db-data,target=/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=cafe_shop mysql:9.7

docker run -d --name cafe-shop-db \
  -v cafe-shop-db-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=cafe_shop mysql:9.7
```

兩個指令效果完全一樣，只是語法不同。掛載之後，MySQL 寫進 `/var/lib/mysql` 的所有資料檔，都實際落在 `cafe-shop-db-data` 這個 Volume 裡。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>注意：</b> 若掛載的是「空」Volume，image 裡該路徑原本的檔案會自動複製進去（MySQL 會在此時跑初始化建立 <code>cafe_shop</code> 資料庫）；若 Volume 裡已經有資料，直接沿用既有資料，<b>初始化腳本與 <code>MYSQL_*</code> 環境變數都不會再執行</b>。
</div>

<!--
這一頁示範把 Volume 掛進 MySQL 容器，用 `--mount` 和 `-v` 各寫一次，兩種效果完全一樣。

下面的提示框，是這一章最多人踩的坑。

第一次啟動時 Volume 是空的。MySQL 的啟動腳本發現資料目錄是空的，就會執行初始化，建立 cafe_shop 資料庫和帳號，並執行 init 目錄裡的腳本（如果有掛的話）。

但第二次之後，Volume 裡已經有資料了。腳本一看資料目錄有東西，就直接啟動，完全跳過初始化。所以後來改了 MYSQL_PASSWORD，或是改了 init 腳本想多加一張表，重啟容器會發現完全沒生效。

解法有兩個。一是用 SQL 手動修改，二是在開發環境把 Volume 刪掉重來。知道這個機制，就不會在這裡卡上一個小時。
-->

---
layout: default
---

# 使用 Volume 的注意事項

「刪除容器不會自動刪除它掛載的 Volume」——這是設計上的保護機制，避免我們不小心把重要資料清掉。

- 匿名 Volume（沒有指定名稱）搭配 `docker run --rm`，容器結束時會一併被刪除
- 掛載到「非空」的 Volume 或目錄，既有內容會被優先保留，容器 image 內同路徑的檔案會被遮蔽
- 想清除所有沒被使用的 Volume，用 `docker volume prune`，這個動作無法復原

<!--
這一頁整理三個容易忽略的注意事項。

「刪除容器不會自動刪除它掛載的 Volume」，這是刻意的保護機制，避免我們不小心清掉重要資料。

第一個例外是匿名 Volume。沒有指定名稱時，Docker 會自動產生一個亂數名稱的 Volume。如果搭配 `--rm`，容器結束時它會一起被刪除，這點跟具名 Volume 不一樣。

第二，掛載到已經有內容的 Volume 時，會保留 Volume 裡的內容，Image 裡同一個路徑的檔案會被蓋住看不到。

第三是最容易誤觸的。`docker volume prune` 會把所有沒被容器使用的 Volume 全部刪光，而且無法復原。執行前，先用 `docker volume ls` 確認一下。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 資料備份與還原情境

<!--
第三部分是這一章的重點，我們要學會把 Volume 裡的資料備份出來，以及把備份還原回去。
-->

---
layout: default
---

# 為什麼需要備份 Volume？

雖然 Volume 的資料不會隨容器刪除而消失，但如果 host 本身出問題（硬碟壞掉、要換機器、要搬到雲端），Volume 裡的資料還是會不見。

「備份 Volume 最經典的做法，是借用一個『臨時容器』，把 Volume 掛進去，再用 `tar` 打包成一個檔案，存到 host 的某個路徑。」

這個臨時容器不需要跑任何服務，它唯一的任務就是幫我們搬資料，做完就可以丟掉，所以我們通常會搭配 `--rm` 參數讓它用完即焚。

<!--
大家可能會想，Volume 不是已經很安全了嗎？為什麼還要備份？

Volume 讓資料不會因為容器刪除而消失，但它終究還是存在同一台主機上。如果主機硬碟壞了、要換新機器、要搬到雲端，Volume 的資料一樣會不見。延續倉庫的比喻，倉庫不會因為房子拆掉而消失，但倉庫本身也可能失火，所以重要的東西還是要另外留一份副本。

「備份 Volume 最經典的做法，是借用一個臨時容器」，把 Volume 掛進去，用 tar 打包成一個檔案，存到主機上。

這個技巧的精髓在於，我們不直接操作 Volume 在主機上的路徑，而是透過容器去讀寫。不管 Volume 實際存在哪裡，操作方式都一樣。臨時容器做完事就可以丟掉，所以通常會加上 `--rm`。
-->

---
layout: default
---

# 備份 Volume 的步驟

| 步驟 | 說明 |
| --- | --- |
| 1 | 建立一個掛載了目標 Volume 的臨時容器（也可用既有的服務容器） |
| 2 | 啟動另一個容器，透過 `--volumes-from` 借用第一個容器的 Volume |
| 3 | 同時把 host 的目前目錄掛到這個容器的 `/backup` |
| 4 | 在容器內執行 `tar cvf`，把 Volume 內容打包進 `/backup` |
| 5 | 打包完成後，備份檔就直接留在 host 上，容器可以刪除 |

<!--
這張表是備份的標準流程，五個步驟看起來很多，其實核心只有一個指令。

關鍵在第二步的 `--volumes-from`。它可以讓一個容器直接借用另一個容器已經掛好的 Volume，不用再指定一次。

第三步同時把主機的目前目錄，掛到這個臨時容器的 `/backup`。

第四步在容器裡執行 tar，把 Volume 的內容打包進 `/backup`。因為 `/backup` 就是主機的目錄，打包完成後，備份檔就直接留在我們的電腦上了。
-->

---
layout: default
---

# 備份 Volume — 範例

```bash
# 做法 A：借用執行中的 cafe-shop-db 容器，把它的 Volume 打包
docker run --rm --volumes-from cafe-shop-db -v $(pwd):/backup \
  alpine tar cvf /backup/db-backup.tar /var/lib/mysql

# 做法 B（資料庫建議）：用 mysqldump 匯出邏輯備份
docker exec cafe-shop-db mysqldump -uroot -prootpw cafe_shop > cafe_shop.sql
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>做法 A 的前提：</b> 直接打包 MySQL 資料檔屬於「實體備份」，容器<b>執行中</b>打包可能抓到寫到一半的檔案。正式作業要先 <code>docker stop cafe-shop-db</code> 再打包，或改用做法 B。
</div>

<!--
這一頁給了兩種備份做法，實務上要分清楚什麼時候用哪一個。

做法 A 就是剛才的流程。啟動一個臨時的 alpine 容器，用 `--volumes-from` 借用 cafe-shop-db 的 Volume，再把目前目錄掛到 `/backup`，用 tar 打包。這招的價值在於通用，不管 Volume 裡裝的是什麼，都能這樣備份。

但對資料庫來說，做法 B 才是標準答案。mysqldump 匯出的是 SQL 語句，檔案小、看得懂、可以跨版本還原，而且不用停機。

做法 A 打包的是實體資料檔，換個 MySQL 版本可能就讀不起來。而且像下面的警示框說的，資料庫還在執行時打包，可能抓到寫到一半的檔案。正式作業要先停止容器再打包。

實務上的分工是，日常定期備份用 mysqldump，整台機器搬遷時，才用 tar 打包。

【講師】Windows 的舊版 PowerShell（5.1）用 `>` 導出檔案會存成 UTF-16，還原時會失敗。用 Git Bash 或 PowerShell 7 執行這幾行就沒問題。
-->

---
layout: default
---

# 還原 Volume — 範例

```bash
# 對應做法 A：把 tar 解壓回一個全新的 Volume
docker run --rm -v cafe-shop-db-restore:/var/lib/mysql -v $(pwd):/backup \
  alpine sh -c "cd /var/lib/mysql && tar xvf /backup/db-backup.tar --strip 3"

# 用還原出來的 Volume 啟動新容器驗證
docker run -d --name cafe-shop-db-check \
  -v cafe-shop-db-restore:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=rootpw mysql:9.7

# 對應做法 B：把 SQL 灌回資料庫
docker exec -i cafe-shop-db mysql -uroot -prootpw cafe_shop < cafe_shop.sql
```

<!--
還原跟備份是對稱的，一樣借用臨時容器，只是這次是解壓縮。

第一段要注意 `--strip 3` 這個參數。打包的時候路徑是 `/var/lib/mysql`，tar 檔裡面就包著 var、lib、mysql 三層目錄。解壓縮時不處理的話，資料會多出一層重複的路徑，MySQL 就找不到檔案。strip 3 的意思是去掉最外面三層。這個數字要跟打包時的路徑深度對應，數字錯了不會報錯，但容器會啟動失敗。

第二段用還原出來的 Volume 啟動一個新容器來驗證。沒驗證過的備份，等於沒有備份，這一步一定要做。

做法 B 的還原比較簡單，把 SQL 檔灌回去就好。注意 `docker exec` 一定要加 `-i`，才能把主機上的檔案內容送進容器。
-->

---
layout: default
---

# 補充：在 Compose 中宣告 Volume

```yaml
services:
  db:
    image: mysql:9.7
    volumes:
      - db-data:/var/lib/mysql            # Volume：資料庫
    environment:
      MYSQL_ROOT_PASSWORD: rootpw
      MYSQL_DATABASE: cafe_shop

  api:
    build: ../cafe-shop-api
    volumes:
      - uploads:/app/uploads              # Volume：後台上傳的商品圖片
      # - ./dev-uploads:/app/uploads      # Bind：開發時想在本機直接看圖，改用這行
    tmpfs:
      - /tmp                              # tmpfs：上傳時的暫存檔

volumes:
  db-data:
  uploads:
```

三種掛載方式在同一份檔案裡各司其職。別忘了在最底下的 `volumes:` 區塊宣告具名 Volume。

<!--
最後把三種掛載方式放進 Compose，這也是實務上最常見的用法，大家可以直接當範本。

db 掛一個 Volume 保存資料庫，表不用 init 腳本建，交給 api 的 Flyway。

api 也掛一個 Volume，名字叫 uploads，接到 `/app/uploads`。從此重建 api 容器，商品圖片都還在。註解掉的那一行是 Bind Mount 的寫法，以點開頭代表本機的資料夾，開發時想直接看圖就換成它。tmpfs 則把 `/tmp` 放在記憶體裡，給上傳的暫存檔用。

這裡有個小細節。api 是用沒有特權的 app 使用者在跑，它能寫進 uploads，是因為第四章的 Dockerfile 先建好資料夾並交給 app。第一次掛上空的 Volume 時，Docker 會把 Image 裡那個資料夾的內容和擁有者一起複製過去，所以權限是對的。

最容易忘記的是最下面的 volumes 區塊。只有具名 Volume 需要在這裡宣告，Compose 才知道要建立它。忘了宣告，Compose 會直接報錯。以點或斜線開頭的 Bind Mount 路徑，則不需要宣告。
-->

---
layout: default
---

# 練習 1：讓線上商店的資料活下來
### 任務說明

正面回答第三章留下的問題。請完成：

先 `docker rm -f cafe-shop-db cafe-shop-api` 清掉上一章的容器（`cafe-shop-net` 留著）：

1. 建立名為 `cafe-shop-db-data` 的 Volume
2. 在 `cafe-shop-net` 上啟動 `cafe-shop-db`，把 Volume 掛到 `/var/lib/mysql`
3. 啟動 `cafe-shop-api`（同第六章），等它啟動完成，Flyway 會建好表和範例資料
4. 新增一個分類（有中文，mysql 要加 `--default-character-set=utf8mb4`）：`INSERT INTO categories (name, sort_order) VALUES ('季節限定', 5);`
5. **強制刪除資料庫容器**，再用 `docker volume ls` 確認 Volume 還在
6. 用**同一個 Volume** 啟動一個全新的容器，`select * from categories;` — 季節限定還在嗎？

<!--
接下來是練習一，我們要正面回答第三章留下的問題。

任務是建立 cafe-shop-db-data，掛給 cafe-shop-db，讓後端的 Flyway 把表建好，再自己新增一個「季節限定」分類。接著強制刪除資料庫容器，確認 Volume 還在，最後用同一個 Volume 啟動一個全新的容器，查詢資料。

這次的操作跟第三章幾乎一模一樣，同樣的 rm、同樣的 run，只多了一個 Volume。請大家想一想：為什麼容器刪掉了，Volume 卻還在？

我們先暫停一下，自己動手試試看。

【講師】給大家五到八分鐘，提醒第六步一定要親眼看到資料重新出現。
-->

---
layout: default
---

# 練習 1：解題提示

```bash
docker volume create cafe-shop-db-data
docker run -d --network cafe-shop-net --name cafe-shop-db -v cafe-shop-db-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=cafe_shop \
  -e MYSQL_USER=shop -e MYSQL_PASSWORD=shoppw mysql:9.7
docker run -d --network cafe-shop-net --network-alias api --name cafe-shop-api \
  -e DB_URL=jdbc:mysql://cafe-shop-db:3306/cafe_shop -e DB_USERNAME=shop -e DB_PASSWORD=shoppw \
  cafe-shop-api:1.0.0       # MySQL 還沒好就先停掉的話，等十秒再 docker start cafe-shop-api

docker exec cafe-shop-db mysql --default-character-set=utf8mb4 -ushop -pshoppw cafe_shop \
  -e "INSERT INTO categories (name, sort_order) VALUES ('季節限定', 5);"
docker rm -f cafe-shop-db          # 容器沒了
docker volume ls                   # Volume 還在

docker run -d --network cafe-shop-net --name cafe-shop-db-2 \
  -v cafe-shop-db-data:/var/lib/mysql mysql:9.7
docker exec cafe-shop-db-2 mysql --default-character-set=utf8mb4 -ushop -pshoppw cafe_shop \
  -e "select * from categories;"
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>五個分類都在，包含季節限定</b> — 這就是第三章那個問題的答案。容器是隨時可拋棄的，資料不是。
</div>

<!--
我們來看解答。

回答剛才的問題，因為容器和 Volume 的生命週期本來就是分開管理的。刪掉容器，只是拆掉房子，倉庫完全沒有被動到。所以最後的 select，會印出咖啡豆、濾掛包、器材、禮盒，還有我們自己加的季節限定。這就是第三章那個問題的答案，容器隨時可以丟掉，資料不行。

有幾個小細節。第一，刪除執行中的容器要加 `-f`，不然會失敗。第二，新容器連一個 MYSQL 環境變數都沒寫，shop 帳號一樣能登入，因為帳號、密碼、資料庫全都存在 Volume 裡，初始化的變數本來就不會再生效，正好呼應前面講的機制。第三，api 第一次啟動時如果 MySQL 還沒準備好，它會停掉，這正是第五章用 healthcheck 解決的問題，手動的話等一下再 start 就好。

請保留這個 Volume，練習二還要用。
-->

---
layout: default
---

# 練習 2：備份並還原線上商店資料庫
### 任務說明

情境：公司要把線上商店從你的開發機搬到測試伺服器。

1. 用 `mysqldump` 把 `cafe_shop` 資料庫匯出成 `cafe_shop.sql`（邏輯備份）
2. 另外用臨時容器 + `tar`，把 `cafe-shop-db-data` 打包成 `db-backup.tar`（實體備份）
3. 建立全新的 Volume `cafe-shop-db-restore`，把 tar 還原進去
4. 用還原後的 Volume 啟動新容器，`select * from categories;` 確認資料完整
5. **想一想並回答**：兩種備份方式，哪一種檔案比較小？哪一種可以跨 MySQL 版本還原？正式環境的每日排程備份該用哪一種？

<!--
練習二的情境是，公司要把線上商店從我們的開發機搬到測試伺服器。

任務是用兩種方式各備份一次，mysqldump 匯出 SQL，以及用臨時容器和 tar 打包 Volume。接著把 tar 還原到一個全新的 Volume，啟動新容器確認資料完整。

第五題是這題最重要的部分：兩種備份方式，哪一種檔案比較小？哪一種可以跨 MySQL 版本還原？正式環境的每日排程備份，應該用哪一種？

我們先暫停一下，自己動手試試看。

【講師】給大家十到十五分鐘，第五題可以開放討論。
-->

---
layout: default
---

# 練習 2：解題提示

```bash
# 1. 邏輯備份
docker exec cafe-shop-db-2 mysqldump -uroot -prootpw cafe_shop > cafe_shop.sql

# 2. 實體備份：借用執行中容器的 Volume
docker run --rm --volumes-from cafe-shop-db-2 -v $(pwd):/backup \
  alpine tar cvf /backup/db-backup.tar /var/lib/mysql

# 3. 還原到新 Volume（注意 --strip 3 對應 /var/lib/mysql 三層）
docker run --rm -v cafe-shop-db-restore:/var/lib/mysql -v $(pwd):/backup \
  alpine sh -c "cd /var/lib/mysql && tar xvf /backup/db-backup.tar --strip 3"

# 4. 用還原的 Volume 啟動並驗證
docker run -d --name cafe-shop-db-restored \
  -v cafe-shop-db-restore:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=rootpw mysql:9.7
docker exec cafe-shop-db-restored mysql --default-character-set=utf8mb4 -uroot -prootpw cafe_shop \
  -e "select * from categories;"
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
⚠️ <b>第 5 題答案：</b> <code>cafe_shop.sql</code> 通常只有幾 KB，<code>db-backup.tar</code> 動輒上百 MB（含 InnoDB 預留空間）。
mysqldump 可跨版本、跨主機還原，正式環境的每日排程一律用它；tar 適合整機搬遷。
</div>

<!--
我們來看解答。第一步用 mysqldump 匯出，第二步用臨時容器打包，第三步還原到新 Volume，注意 strip 3，第四步啟動新容器驗證。最後的 select 會印出跟原本一樣的五個分類。

回答第五題。mysqldump 的檔案通常只有幾 KB，tar 動輒上百 MB，因為它連資料庫預留的空間都打包了。mysqldump 可以跨版本、跨主機還原，所以正式環境的每日排程備份一律用它。tar 適合整台機器搬遷。

另外，tar 備份時 MySQL 還在執行，嚴格來說有一致性的風險，正式作業要先停止容器。

做完記得清理測試用的容器，以及用不到的 Volume。
-->

---
layout: default
---

<style>
.summary-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.summary-table th { text-align: left; padding: 10px 8px; color: #64748b; font-weight: 600; font-size: 0.95rem; border: none !important; border-bottom: 2px solid #e2e8f0 !important; }
.summary-table td { text-align: left; padding: 12px 8px; border: none !important; border-bottom: 1px solid #e2e8f0 !important; }
</style>

# 本章總結 — Volume 資料持久化

<table class="summary-table">
<thead>
<tr><th>重點</th><th>說明</th></tr>
</thead>
<tbody>
<tr><td>Volume</td><td>由 Docker 管理，適合資料庫等需持久化的資料，如租來的「外部倉庫」</td></tr>
<tr><td>Bind Mount</td><td>直接掛載 host 既有路徑，適合開發時同步原始碼，如借用「自己家的書櫃」</td></tr>
<tr><td>tmpfs</td><td>存在記憶體中，容器一停止就消失，適合暫存資料，如「便利貼」</td></tr>
<tr><td>核心指令</td><td><code>docker volume create / ls / inspect / rm / prune</code></td></tr>
<tr><td>備份／還原</td><td>用「臨時容器 + tar」完成，不需直接碰觸 host 底層路徑</td></tr>
</tbody>
</table>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>記住：</b> 容器被刪除，沒有掛載 Volume 的資料就永久消失，重要資料一定要掛 Volume。
</div>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
🚀 <b>下一章：</b> 我們將進入部署實戰，把 image、容器、網路、Volume 全部串起來上線一個服務。
</div>

<!--
我們回顧一下這一章。

第一，容器刪除後，沒有掛載出去的資料就永久消失。第二，Volume 由 Docker 管理，像租來的外部倉庫，適合資料庫。第三，Bind Mount 直接掛載主機上的檔案，像借用自己家的書櫃，適合設定檔和初始化腳本。第四，tmpfs 存在記憶體，像便利貼，只適合暫存。最後，備份用臨時容器加 tar，資料庫則優先用 mysqldump。

記住一句話：重要資料一定要掛 Volume，而且要定期備份、實際驗證。

下一章是部署實戰，我們會把前面學的全部串起來，讓線上商店正式上線。
-->

---
layout: end
---

# Q & A

有任何問題嗎？

<!--
這一章我們讓線上商店的資料活得比容器久，也學會了怎麼把資料安全地搬進搬出。

建議回去把兩題練習再做一次，尤其是還原後驗證的步驟。親手做過一次，比看投影片印象深刻得多。我們下一章見。

【講師】開放 Q&A，可以引導大家回想三種掛載方式的差別、初始化變數為什麼只生效一次。
-->
