---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 壓縮與解壓縮檔案
routeAlias: ch25
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
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">Java Programming Masterclass</p>
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">壓縮與解壓縮檔案</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">「用 java.util.zip 打包與解開你的檔案」</p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
大家好，今天我們要聊的是「壓縮」。身為工程師，我們最喜歡把東西塞進小小的空間裡——不管是把程式碼塞進一兩行，還是把幾百個檔案塞成一個 ZIP 檔。

【為什麼要學這個？】
想像一下，如果你要寄 100 張照片給客戶，你是要分 100 次寄，還是打包成一個檔案寄？懂壓縮，不僅省空間，還省你的時間（跟網路費）。

【今天學完你會能做什麼】
學完之後，你就能用 Java 寫出像 WinRAR 一樣的工具（雖然介面可能沒那麼漂亮），幫你的程式自動打包 Log 或備份資料。
-->

---
layout: default
---

# Outline

- **壓縮套件是什麼**：`java.util.zip`、`ZipEntry`、`ZipOutputStream`、`ZipInputStream` / `ZipFile`
- **用在哪裡**：多檔打包傳輸、Log 自動壓縮備份、處理上傳下載的 ZIP、讀寫 `.jar`
- **為何列為自學**：壓縮／解壓縮流程步驟多，非寫出基本程式的必要條件
- **AI 協作時刻**：解壓縮的資安風險 Zip Slip
- **延伸學習**：自學版的完整內容

<!--
【課程預覽】
這一章在基礎班只走三頁：先認識 `java.util.zip` 是什麼、用在哪裡，再說明為什麼列為自學，最後用一個 AI 提問讓大家對 Zip Slip 這個資安議題留下印象。

【學習建議】
今天先知道「Java 內建就能打包 ZIP」這件事就夠了。完整的壓縮、解壓縮、安全防護與 NIO 寫法，都留在自學版裡。
-->

---
layout: default
---

# 這是什麼／用在哪裡／為何列自學

**這是什麼？**

`java.util.zip` 是 Java 內建的壓縮工具套件，可以把一個或多個檔案／整個資料夾，打包成一個 `.zip` 檔案，也可以把 `.zip` 檔案的內容還原回原來的檔案與目錄結構。核心角色是 `ZipEntry`（代表 ZIP 內的每個檔案或資料夾）、`ZipOutputStream`（壓縮）、`ZipInputStream` / `ZipFile`（解壓縮）。

**用在哪裡？**

- 將多個檔案（報告、附件、Log）打包成單一檔案傳輸或備份
- 伺服器端自動產生每日 Log 壓縮檔
- 處理使用者上傳／下載的 ZIP 壓縮包
- Java 程式內部讀寫 `.jar`／`.zip` 格式檔案

**為何列為自學內容？**

依據課程拆分規劃，ZIP 壓縮（與多執行緒、檔案 I/O 同列）對零基礎學生來說負擔較重，且**不是寫出基本程式的必要條件**。基礎班會口頭介紹「這是什麼、用在哪裡」即可，完整的壓縮、解壓縮、安全防護與現代 NIO 寫法，留給有餘力的同學在自學版中深入練習。

<!--
這一頁我們用三個問題，快速幫大家建立「壓縮」這個主題的整體印象：它是什麼、可以用在哪裡，以及為什麼我們把它放進自學的範圍。

先說「這是什麼」。簡單講，`java.util.zip` 就是 Java 內建的一套打包工具，可以把很多檔案、甚至整個資料夾，壓成一個 `.zip` 檔案，也可以把這個 `.zip` 還原成原本的檔案結構。這就像我們平常用 WinRAR 或系統內建的「壓縮成 ZIP 檔」功能，只是現在我們用程式碼來自動完成這件事。

再說「用在哪裡」。最常見的場景，就是要把很多檔案一次傳給別人，例如報告加附件、或是把伺服器上一堆 Log 檔案每天自動打包成一個檔案備份起來。如果我們之後寫的程式要處理使用者上傳的 ZIP 壓縮包，這套工具也會用到。

最後說「為什麼列為自學」。我們可以用行李打包來比喻：知道「行李箱可以把衣服壓縮收納」這件事，跟自己動手設計一個能自動打包行李、還能檢查行李有沒有夾帶違禁品的系統，是兩個完全不同的難度層級。對剛開始學程式的同學來說，壓縮、解壓縮這整套流程的步驟比較多、概念也比較進階，並不是寫出一個基本 Java 程式所必須掌握的內容。所以我們在基礎課程裡，口頭帶過「這是什麼、用在哪裡」就好，完整的操作、安全性議題（像是 Zip Slip）跟最新的 NIO 寫法，都留在自學版裡，讓有興趣、有餘力的同學可以再深入研究。
-->

---
layout: default
---

# 🎬 AI 協作時刻：解壓縮也有資安風險？

自學版提到的「Zip Slip」聽起來很陌生，但先讓 AI 用一句話讓你有印象：

**要用的 Prompt：**

> 我聽說解壓縮 ZIP 檔案有一種叫「Zip Slip」的資安漏洞，
> 請用完全不懂資安的人也能聽懂的方式，解釋這個漏洞大概在做什麼壞事，
> 100 字以內，不要用程式碼。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>先有印象就好：</b> 只要知道「解壓縮別人給的 ZIP 檔案不能照單全收」，之後在自學版看到防護寫法時就不會覺得莫名其妙。
</div>

<!--
【操作提示】
口頭帶過即可，不用深入解釋技術細節，重點是讓同學知道「連解壓縮這種看似單純的操作，也可能藏著資安問題」，引起對自學版內容的興趣。

【收斂一句話】
壓縮解壓縮不只是省空間的工具，處理「別人給的檔案」時多一分警覺，就是資安意識的第一步。
-->

---
layout: default
---

<div class="flex flex-col justify-center items-center h-full text-center">

# 想深入了解壓縮與解壓縮？

<p class="text-gray-500 mt-2 mb-8">完整 API、壓縮／解壓縮實作、Zip Slip 安全防護、NIO ZIP File System 與課後練習</p>

<Link to="java-adv/ch25" style="display: inline-block; padding: 0.75rem 2rem; background: linear-gradient(90deg, #5eada0, #a7d9d0); color: #ffffff; border-radius: 9999px; text-decoration: none; font-weight: 700; letter-spacing: 0.05em;">→ 前往自學內容</Link>

</div>

<!--
這一頁口頭帶過即可，詳細內容留給自學版。

跟同學說：今天我們先知道「ZIP 壓縮是什麼、可以用在哪裡」就夠了，這個主題完整的程式碼跟練習，都整理在自學版的投影片裡，有興趣或想挑戰自己的同學，下課後可以自己點進去看，裡面從基本的壓縮、解壓縮，到安全性議題跟最新寫法都有完整講解跟練習題。
-->

---
layout: end
---

# 課程結束
### java.util.zip：壓縮、解壓縮、安全防護一次搞定
