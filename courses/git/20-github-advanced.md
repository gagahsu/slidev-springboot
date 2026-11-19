---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
title: 進階 GitHub 操作
routeAlias: ch20
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
layout: default
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #d97706; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Git 版本控制課程</p>
  <h1 style="color: #92400e; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">進階 GitHub 操作</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #d97706, #fbbf24); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #b45309; font-size: 1.15rem; font-style: italic;">「GitHub 是工具，Git 才是核心」</p>
  <Link to="home" style="margin-top: 2rem; color: #d97706; font-size: 0.9rem;">← 返回目錄</Link>
</div>

<!--
歡迎來到第二十章，進階 GitHub 操作，這也是整門課的最後一章。
這章會介紹幾個 GitHub 上的進階操作。
包括同步 fork 的專案、刪除遠端分支、正確使用強制推送，以及用 GitHub Pages 免費架設網站。
最後，我們會回頭思考 Git 的本質：協作，其實不一定要有 GitHub。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 狀況題
## 怎麼跟上當初 fork 專案的進度？

<!--
第一個狀況題：fork 了別人的專案，過了幾個月，要怎麼跟上原始專案的進度？
-->

---

# 同步 Fork 與原始 Repo

**核心概念：** 除了 `origin`（你的 fork），還要加一個 `upstream`（原始 repo）遠端。

```bash
# 第一步：加入 upstream 遠端（只需要設定一次）
git remote add upstream git@github.com:original-owner/repo.git

# 確認兩個遠端都設定好了
git remote -v
# origin    git@github.com:YOUR_USERNAME/repo.git
# upstream  git@github.com:original-owner/repo.git

# 第二步：從 upstream 取得最新資料
git fetch upstream
```

<!--
想像一下，三個月前我們 fork 了一個開源專案。
現在原始專案已經多了幾十個 commit，我們的 fork 落後了很多。
這時候要提 PR，就會出現一堆衝突。
解法的核心觀念是，除了指向自己 fork 的 origin，再加一個指向原始 repo 的遠端。
慣例上叫它 upstream，也就是「上游」的意思。
用 `git remote add upstream` 加上原始 repo 的網址，這個設定只需要做一次。
接著用 `git remote -v` 確認，會看到 origin 和 upstream 兩個遠端。
最後用 `git fetch upstream`，把原始專案的最新內容下載下來。
-->

---

# 同步 Fork 與原始 Repo：合併與推回

```bash
# 第三步：把 upstream/main 的更新合併到本機 main
git checkout main
git merge upstream/main
# 或是用 rebase 保持線性歷史
git rebase upstream/main

# 第四步：推回你自己的 fork（讓 GitHub 上的 fork 也更新）
git push origin main
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**快捷方式：** GitHub 網頁上提供「Sync fork」按鈕，一鍵同步，不需要手動執行以上指令。保持 fork 與 upstream 同步，PR 被合併的機率也會更高。

</div>

<!--
下載之後，切換到本機的 main，把 upstream 的 main 合併進來。
想保持一直線的歷史，也可以改用 rebase。
最後再 `git push origin main`，把更新推回自己在 GitHub 上的 fork。
其實 GitHub 網頁上也有一個 Sync fork 按鈕，按一下就能同步，不用自己下指令。
保持 fork 跟上原始專案很重要。
落後太多，PR 就會有很多衝突，維護者要花更多時間處理，被合併的機會也會降低。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 狀況題
## 怎麼刪除遠端的分支？

<!--
第二個狀況題：分支合併之後，遠端的分支不會自動消失。要怎麼清掉它們？
-->

---

# 刪除遠端分支

```bash
# 方法一：現代語法（推薦）
git push origin --delete feature/login

# 方法二：舊語法（效果相同）
git push origin :feature/login
# 分支名前面有個冒號，意思是「推送空的內容到遠端分支」

# 清理已不存在的遠端分支引用
git remote prune origin
# 或是在 fetch 時順便清理
git fetch --prune
```

<!--
刪除遠端分支，推薦用 `git push origin --delete`，後面接分支名稱。
另一種是舊的寫法，在分支名稱前面加一個冒號。
意思是把「空的內容」推送到那個遠端分支，效果一樣，但比較難懂。
刪掉之後，我們本機可能還留著那些遠端分支的紀錄。
用 `git remote prune origin`，或是在 fetch 時加上 `--prune`，就能把它們清乾淨。
這樣 `git branch -r` 列出來的結果就會很清爽。
-->

---

# 刪除遠端分支：注意事項

<div style="background: #fff8f0; border-left: 4px solid #d97706; padding: 1rem 1.5rem; border-radius: 4px; margin-bottom: 1.2rem;">

**注意：** 刪除遠端分支**不會**影響你的本機分支，只是把 GitHub 上的分支移除。如果你想同時刪除本機分支：`git branch -d feature/login`

</div>

**GitHub 自動刪除設定：**

Repo **Settings → General** → 勾選 **Automatically delete head branches**

PR merge 後自動刪除遠端分支，省去手動清理的麻煩，強烈推薦開啟。

<!--
要注意，刪除遠端分支，並不會影響本機的分支。
如果本機的也要刪，要另外用 `git branch -d`。
另外推薦一個 GitHub 的設定。
在 repo 的 Settings 裡，勾選 Automatically delete head branches。
這樣 PR 合併之後，GitHub 就會自動刪掉那個分支，省去手動清理的麻煩。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 狀況題
## git push -f 很可怕嗎？

<!--
第三個狀況題：`git push -f` 很可怕嗎？它到底做了什麼，什麼時候能用？
-->

---

# `git push --force` 的危險

**force push 做了什麼：** 強制讓遠端歷史和你的本機歷史一致，**覆蓋掉**遠端的歷史。

```
遠端（origin/main）: A → B → C → D
你的本機（main）:     A → B → X → Y（你做了 rebase，改寫了歷史）

git push --force
→ 遠端變成： A → B → X → Y
→ C 和 D 在遠端「消失」了
```

**同事 Alice 的本機：**
```
Alice 的 main: A → B → C → D → E（她基於 D 繼續開發了 E）
現在遠端沒有 D 了，Alice 的歷史和遠端不一致
git pull 會出現大量衝突，甚至讓 Alice 很困惑
```

<!--
強制推送做的事情，是讓遠端的歷史，完全變成我們本機的樣子。
看上面的例子，遠端是 A、B、C、D。
我們在本機做了 rebase，歷史變成 A、B、X、Y。
強制推送之後，遠端就變成 A、B、X、Y，C 和 D 在遠端消失了。
問題是，同事 Alice 已經在 D 的後面繼續開發了 E。
現在遠端沒有 D 了，她的歷史和遠端對不起來，pull 的時候會出現一大堆衝突。
處理不好，甚至可能把自己的工作也弄丟。
這就是為什麼很多公司明文禁止強制推送到 main。
-->

---

# Force Push 的正確使用時機

**`--force-with-lease` — 更安全的 force push**

```bash
# 不安全：直接覆蓋遠端，不管有沒有別人的新 commit
git push --force

# 較安全：先確認遠端沒有你不知道的新 commit，再 force push
git push --force-with-lease
# 如果遠端有新 commit（別人 push 了），這個指令會失敗
```

<div style="margin-top: 1rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

`--force-with-lease` 記住你上次 fetch 時遠端的位置，若有人在你之後 push 了新 commit，就拒絕 force push，保護你不誤刪別人的工作。

</div>

<!--
比較安全的做法，是用 `--force-with-lease`。
它會記住我們上次 fetch 時，遠端在什麼位置。
推送之前先確認，遠端是不是還停在那裡。
如果這段時間有人推了新的 commit，它就會拒絕推送。
這等於幫強制推送加了一道安全網，避免我們不小心蓋掉別人的工作。
-->

---

# Force Push：何時可以用？

| 情境 | 可以？ | 說明 |
| --- | --- | --- |
| 個人的 feature 分支 | ✅ | 只有你一個人在用 |
| 修正 PR 後重新推 | ✅ | 還沒有人 merge，沒問題 |
| 共享的 develop 分支 | ⚠️ | 事先溝通，大家停工再做 |
| main / master 分支 | ❌ | 嚴格禁止 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fef3c7; border-left: 4px solid #d97706; border-radius: 4px;">

很多公司的規範：可以用 `--force-with-lease`，但禁止用 `--force`。

</div>

<!--
那什麼時候可以強制推送呢？
只有自己在用的功能分支，可以。
PR 修改之後重新推送，還沒有人合併，也沒問題。
大家共用的 develop 分支，就要事先溝通，請大家先暫停再做。
main 分支，則是嚴格禁止。
很多公司的規範是：可以用 `--force-with-lease`，但禁止用 `--force`。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 4
## 使用 GitHub 免費製作個人網站

<!--
接下來換個輕鬆的主題：用 GitHub 免費架設個人網站。
-->

---

# GitHub Pages — 免費靜態網站托管

**兩種使用方式：**

<div class="grid grid-cols-2 gap-6">
<div>

**個人 / 組織網站**

建立名稱為 `<username>.github.io` 的 repo

```bash
# 例如 GitHub 帳號是 johndoe
# 建立 repo：johndoe.github.io

git clone git@github.com:johndoe/johndoe.github.io.git
cd johndoe.github.io

# 建立首頁
echo "<h1>Hello World</h1>" > index.html

git add index.html
git commit -m "init: first page"
git push origin main
```

網址：`https://johndoe.github.io`

</div>
<div>

**專案網站**

任何 repo 都可以在 Settings 開啟 Pages

- Settings → Pages
- Source: Deploy from a branch
- Branch: `gh-pages` 或 `main`（可選 `/docs` 資料夾）

```bash
# 推送到 gh-pages 分支
git checkout -b gh-pages
git push origin gh-pages
```

網址：`https://johndoe.github.io/repo-name`

</div>
</div>

<!--
GitHub Pages 可以免費托管靜態網站，有兩種使用方式。
左邊是個人網站。
建立一個名稱叫「帳號名稱點 github 點 io」的 repo。
放一個 index.html，推上去之後，用同樣的網址就能看到網站。
右邊是專案網站。
任何 repo 都可以在 Settings 的 Pages 裡開啟，選擇要從哪個分支發布。
網址會是個人網址，後面再加上 repo 的名稱。
它的限制是只能放 HTML、CSS、JavaScript 這類靜態內容，不能跑後端程式。
但拿來做作品集或技術文件，已經非常夠用，也可以設定自己的網域。
-->

---

# GitHub Pages 進階：搭配靜態網站生成器

| 框架 | 說明 |
| --- | --- |
| **Jekyll** | GitHub 原生支援，只要有 `_config.yml` 就自動 build，無需 Actions |
| **Hugo** | Go 寫的，build 速度極快，需搭配 Actions 部署 |
| **Astro / VitePress** | 現代前端生態，需搭配 Actions 部署 |

<div style="margin-top: 1.2rem; padding: 0.8rem 1.2rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

搭配 GitHub Actions：每次 push 到 main 自動 build + deploy，完全自動化，免費又穩定。

</div>

<!--
如果不想手寫 HTML，可以搭配靜態網站產生器。
Jekyll 是 GitHub 原生支援的，只要有設定檔，GitHub 就會自動幫我們建置。
Hugo 用 Go 寫成，建置速度非常快。
Astro 和 VitePress 則屬於現代的前端生態系。
後面這幾種，都需要搭配 GitHub Actions 來部署。
-->

---

# GitHub Pages 進階：Actions 自動部署範例

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: npm run build  # 或 hugo、mkdocs build 等
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

<!--
這是一個 GitHub Actions 的設定範例，放在 `.github/workflows` 資料夾裡。
它設定成每次推送到 main 的時候觸發。
先把程式碼 checkout 下來，執行建置指令，再把建置出來的 dist 資料夾部署到 GitHub Pages。
這樣每次 push，網站就會自動更新，完全不用手動操作。
免費又穩定，是個人作品集很好的選擇。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 冷知識
## 一定要有 GitHub 才能得到別人更新的檔案嗎？

<!--
最後一個冷知識。學了這麼多 GitHub，我們回頭問：一定要有 GitHub，才能拿到別人的更新嗎？
-->

---

# Git 的分散式本質

GitHub 只是協調多人協作最方便的工具，但 Git 本身是**分散式**的，不需要中央伺服器。

```bash
# 把本機的某個目錄設定為「遠端」
git remote add local-backup /Users/alice/Backups/my-project.git
git push local-backup main

# 用本機路徑 clone
git clone /path/to/another/repo my-copy
```

<!--
答案是不用。
GitHub 只是讓多人協作最方便的工具，但 Git 本身是分散式的，不需要中央伺服器。
還記得第九章講的嗎？每個人的電腦上，都是一個完整的 repo。
所以遠端不一定是網址，也可以是本機的一個路徑。
範例裡，我們把電腦上的一個備份資料夾設成遠端，直接 push 過去。
也可以直接用路徑 clone 另一個 repo。
GitHub，只是大家約定好的一個集合點。
-->

---

# Git 的分散式本質：區網架設

```bash
# 用 git daemon 在區網提供 Git 服務（唯讀）
git daemon --reuseaddr --base-path=/srv/git/ /srv/git/

# 其他人可以 clone
git clone git://192.168.1.100/my-project.git
```

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

在公司內網不通外網、或保密專案不能放雲端的情境下，可以用 `git daemon` 或在自己的伺服器上架設 Git 服務。兩台電腦在同一個 WiFi 下，甚至可以直接互相 push/pull，完全不需要任何伺服器。

</div>

<!--
在區域網路裡，也可以自己提供 Git 服務。
`git daemon` 是 Git 內建的指令，可以在區網裡提供唯讀的 Git 服務。
其他人就能用 git 開頭的網址，直接從這台電腦 clone。
如果公司內網不能連外，或是保密的專案不能放在雲端，這就是一個選擇。
也可以在自己的伺服器上架設 Git 服務。
-->

---

# 沒有 GitHub 的協作方式總覽

| 方式 | 工具 | 適合場景 |
| --- | --- | --- |
| 本機路徑 | `git remote add` + 路徑 | 同一台電腦的備份 |
| USB 隨身碟 | `git clone /media/usb/repo.git` | 離線環境 |
| 區網 Git daemon | `git daemon` | 辦公室內網 |
| SSH 伺服器 | `git clone user@host:/path/repo.git` | 自架 SSH 服務器 |

<!--
這張表整理了沒有 GitHub 時的協作方式。
同一台電腦，可以用本機路徑做備份。
完全離線的環境，可以把 repo 放在 USB 隨身碟裡傳遞。
辦公室內網，可以用 `git daemon`。
如果有一台可以用 SSH 連線的伺服器，在上面放一個 bare repository 就能共用。
這是最簡單的方式，不需要安裝額外的軟體。
-->

---

# 沒有 GitHub 的協作方式：自架 Git 服務

| 方案 | 說明 | 適合場景 |
| --- | --- | --- |
| **Gitea** | 輕量 Go 寫的自架方案，一個 binary 就能跑 | 低資源需求的私有 Git 服務，可部署在樹莓派 |
| **GitLab CE** | 功能完整，有內建 CI/CD | 需要完整 GitHub 功能但要自架 |

<div style="margin-top: 1.5rem; padding: 1rem 1.5rem; background: #fff8f0; border-left: 4px solid #d97706; border-radius: 4px;">

**結論：** GitHub 提供的是**便利性**和**社群**，不是 Git 的必要元件。理解這一點，才能真正理解 Git 的架構設計。

</div>

<!--
如果想要像 GitHub 一樣的網頁介面，也有自己架設的方案。
Gitea 很輕量，用 Go 寫成，一個執行檔就能跑，連樹莓派都能部署。
GitLab 社群版功能完整，內建 CI/CD，但需要的資源也比較多。
個人或小團隊，用 Gitea 通常就夠了。
所以結論是：GitHub 提供的是便利性和社群，而不是 Git 必要的元件。
理解這一點，才算真正理解 Git 的架構設計。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
這一章我們學會了同步 fork、清理遠端分支，也知道強制推送該怎麼安全地使用。
還用 GitHub Pages 架設了網站，最後理解了 Git 分散式的本質。
到這裡，整門 Git 課程就結束了。
從版本控制的觀念、基本操作、分支、遠端協作，到修改歷史和底層原理，我們一路走了過來。
接下來最重要的，是在每天的工作裡實際使用它。謝謝大家。
【講師】開放提問，可以請大家分享整門課最有幫助的一個指令。
-->
