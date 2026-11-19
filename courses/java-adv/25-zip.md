---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 壓縮與解壓縮檔案（進階／自學）
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
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">壓縮與解壓縮檔案（進階／自學）</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">「用 java.util.zip 打包與解開你的檔案（進階自學內容）」</p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
大家好，歡迎來到這份自學內容。這裡要帶我們深入認識 Java 的「壓縮」世界——也就是 `java.util.zip` 這套工具箱。

為什麼要學這個呢？想像我們要把一份報告連同所有附件寄給客戶，比起一個一個檔案分開傳，打包成一個 ZIP 檔案既省空間、也省時間，對方收到也方便。在實務工作中，自動產生 ZIP 備份、打包 log 檔、壓縮使用者上傳的多個檔案，都是很常見的需求。

這份內容會比基礎課程更完整：我們會從 ZIP 的基本結構開始，學會怎麼壓縮單一檔案、多個檔案、整個資料夾，再學會怎麼解壓縮、怎麼防範安全漏洞，最後再認識最新的 NIO 寫法。

學完之後，我們應該能夠獨立寫出一個「壓縮工具」與「解壓縮報告產生器」，這對處理檔案備份、資料傳輸的程式都非常實用。準備好了嗎，我們開始吧。
-->

---
layout: default
---

# Outline

- **套件基礎**：java.util.zip 套件概觀、ZIP 檔案結構、ZipEntry / ZipOutputStream 核心方法、ZipInputStream vs ZipFile
- **壓縮操作**：壓縮單一檔案、壓縮多個檔案、壓縮整個目錄
- **解壓縮操作**：用 ZipInputStream 解壓縮、用 ZipFile 讀取 ZIP、Zip Slip 安全防護
- **現代寫法**：NIO + ZIP File System
- **練習與 Q&A**

<!--
我們先看一下這份自學內容的地圖。

整體分成四個部分：第一部分是基礎知識，認識 `java.util.zip` 套件裡有哪些角色、ZIP 檔案內部長什麼樣子；第二部分學「怎麼塞東西進去」，也就是壓縮；第三部分學「怎麼把東西拿出來」，也就是解壓縮，這裡還會講到一個很重要的安全議題；第四部分介紹比較新的 NIO 寫法，讓我們的程式碼可以寫得更精簡。

學習建議是：壓縮跟解壓縮的程式碼步驟看起來比較多、有點「儀式感」，但只要掌握「ZipEntry」這個核心概念——它代表 ZIP 裡的每一個檔案或資料夾——剩下的部分就只是反覆套用固定的流程而已，不用緊張。

我們先從第一部分開始，認識這整套工具箱。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# java.util.zip 套件概觀

<!--
我們先來認識一下 Java 提供的這套「打包工具箱」。

這個套件其實從 Java 1.1 就存在了，歷史非常悠久，可以說是經過了二十幾年實戰考驗、非常穩定的工具。雖然年紀大，但現在的伺服器程式、備份工具，甚至我們平常用的 `.jar` 檔案，骨子裡都還是用這套機制在運作。

接下來我們會認識套件裡的幾個主要角色，了解它們各自負責什麼工作。
-->

---

# java.util.zip 套件架構

```
java.util.zip
├── ZipEntry          ← 代表 ZIP 內的一個檔案或目錄項目
├── ZipOutputStream   ← 寫入（壓縮）ZIP 資料
├── ZipInputStream    ← 讀取（解壓縮）ZIP 資料（循序）
├── ZipFile           ← 讀取 ZIP 檔案（支援隨機存取）
├── Deflater          ← 底層壓縮引擎（DEFLATE 演算法）
├── Inflater          ← 底層解壓縮引擎
├── GZIPOutputStream  ← 寫入 .gz 格式
└── GZIPInputStream   ← 讀取 .gz 格式
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>ZIP vs GZIP：</b> ZIP 可打包多個檔案；GZIP 只壓縮單一串流，通常配合 tar 使用（.tar.gz）。
</div>

<!--
這張表是我們今天會用到的「裝備清單」。

想像我們要打包行李去旅行：`ZipOutputStream` 就像是一個「真空壓縮機」，我們把衣服（檔案）放進去，它幫我們壓扁、封裝；`ZipEntry` 就像是每件衣服上貼的標籤，告訴別人這個壓扁的東西原本是什麼、叫什麼名字。`ZipInputStream` 跟 `ZipFile` 則是兩種不同的「拆行李」方式，後面會詳細比較。

在實務上，如果我們只是想壓縮一個很大的 log 檔，用 GZIP 就很夠了；但如果要把一整個專案資料夾打包寄出去，那就一定要用 ZIP，因為它可以容納多個檔案跟資料夾結構。

這裡有個容易誤會的地方：`Deflater` 跟 `Inflater` 是最底層的壓縮、解壓縮引擎，但除非我們想自己研究壓縮演算法，一般寫程式時不會直接碰到它們。這就像開車不需要知道引擎汽缸怎麼點火一樣，知道有這兩個角色存在就好。
-->

---

# ZIP 檔案結構概念

```
archive.zip
├── file1.txt          ← ZipEntry（檔案）
├── images/            ← ZipEntry（目錄，name 結尾有 /）
│   ├── logo.png       ← ZipEntry（檔案）
│   └── banner.jpg     ← ZipEntry（檔案）
└── data/
    └── report.csv     ← ZipEntry（檔案）
```

<div class="mt-3 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
📦 <b>ZipEntry 是關鍵：</b> 每個壓縮項目（檔案或資料夾）都用一個 <code>ZipEntry</code> 物件表示，包含名稱、大小、壓縮大小、修改時間等後設資料（metadata）。
</div>

<!--
這張投影片要講的是 ZIP 檔案內部到底是怎麼組織的。

我們可以把一個 ZIP 檔想像成一個大行李箱，裡面塞了很多貼好標籤的小包裹。每一個檔案、每一個資料夾，都是行李箱裡的一個「項目」，在 Java 裡就對應到一個 `ZipEntry` 物件。

這裡有一個我們一定要記住的重點：在 ZIP 的世界裡，資料夾本身也算是一個 entry，而且它的名字一定會以斜線 `/` 結尾，例如 `images/`。如果我們之後自己手動建立 ZIP，忘記在資料夾名稱後面加上這個斜線，解壓縮出來的時候，這個資料夾很可能會變成一個莫名其妙的空白檔案，而不是一個資料夾——這是初學者很容易踩到的坑。

接下來我們就來看看 `ZipEntry` 到底有哪些方法可以用。
-->

---

# ZipEntry 核心方法

| 方法 | 說明 |
|------|------|
| `getName()` | 取得 entry 名稱（含路徑） |
| `getSize()` | 原始未壓縮大小（bytes），未知則 -1 |
| `getCompressedSize()` | 壓縮後大小（bytes），未知則 -1 |
| `getCrc()` | CRC-32 校驗碼，未知則 -1 |
| `getTime()` | 修改時間（毫秒），未設則 -1 |
| `isDirectory()` | 是否為目錄（名稱是否以 `/` 結尾） |
| `setMethod(int)` | 設定壓縮方式：`DEFLATED` 或 `STORED` |

<div class="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>STORED vs DEFLATED：</b> <code>STORED</code> 不壓縮（只打包），<code>DEFLATED</code> 使用 DEFLATE 演算法壓縮（預設）。
</div>

<!--
`ZipEntry` 就像是行李箱裡每件物品的「身分證」，這張表列出了身分證上記載的各項資訊。

`getName()` 就是名字；`getSize()` 是這個檔案原本、沒壓縮前的「體重」；`getCompressedSize()` 則是壓縮之後、減肥成功的「體重」。如果想知道一個檔案壓縮效果好不好，比較這兩個數字就知道了。

業界實務上，`STORED` 模式通常會用在那些已經被壓縮過的檔案，例如 JPG 圖片或 MP3 音樂檔。因為這些檔案的內容本身已經很「緊」了，再用 DEFLATED 壓一次，效果不大，反而浪費 CPU 運算資源。

另外要提醒的是，CRC 校驗碼是用來確認檔案內容有沒有壞掉、有沒有被竄改。如果解壓縮的時候發現 CRC 對不上，就表示這個包裹在運送過程中可能被拆開、內容物可能損壞了，Java 會直接拋出例外，提醒我們資料有問題。
-->

---

# ZipOutputStream 核心方法

| 方法 | 說明 |
|------|------|
| `putNextEntry(ZipEntry e)` | 開始寫入一個新的 entry |
| `write(byte[], int, int)` | 寫入目前 entry 的資料 |
| `closeEntry()` | 關閉目前 entry，準備下一個 |
| `setLevel(int level)` | 壓縮等級 0（不壓）～9（最高），預設 -1 |
| `setMethod(int method)` | 預設壓縮方式：`DEFLATED` 或 `STORED` |
| `setComment(String comment)` | 設定整個 ZIP 檔案的備註 |
| `finish()` | 完成寫入但不關閉底層串流 |

<!--
這張表整理了 `ZipOutputStream` 的核心方法，也就是「寫入 ZIP」的節奏感。

我們可以把整個流程想成在「裝箱」：第一步 `putNextEntry`，拿一個新的箱子並貼上標籤，告訴系統「接下來的內容屬於這個檔案」；第二步 `write`，把東西一點一點塞進這個箱子；第三步 `closeEntry`，把箱子封起來，準備裝下一個。這三個動作會重複進行，直到所有東西都裝完。

業界實務上，壓縮等級 `setLevel(9)` 雖然能把檔案壓得最扁，但相對也最花時間。如果伺服器同時要處理很多請求、CPU 已經很忙了，建議用預設等級或低一點的等級就好，不需要為了省那幾 KB 的空間，把 CPU 燒到滿載。

`finish()` 這個方法比較容易被忽略，它代表「資料寫完了，但底層的串流先別關」，在某些需要把多個 ZIP 串流接在一起處理的場景會用到，一般情況下我們用 `try-with-resources` 自動關閉資源就不太需要特別呼叫它。
-->

---

# ZipInputStream vs ZipFile

| 比較項目 | `ZipInputStream` | `ZipFile` |
|----------|-----------------|-----------|
| 存取方式 | 循序（Sequential） | 隨機（Random access） |
| 資料來源 | 任何 `InputStream`（網路、記憶體） | 磁碟上的實體檔案 |
| 取得特定 entry | 必須逐一掃描 | `getEntry(name)` 直接取得 |
| 平行讀取多個 entry | 不支援 | 支援 |
| 適用場景 | 串流下載、管線處理 | 本機已存在的 ZIP 檔案 |

<div class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>選用建議：</b> 有本機 ZIP 檔案且需要查詢特定 entry → 用 <code>ZipFile</code>；處理串流或不確定來源 → 用 <code>ZipInputStream</code>。
</div>

<!--
讀取 ZIP 有兩種方式，這張表就是要幫我們做選擇。

可以把這兩者想成「錄影帶」跟「DVD」的差別。`ZipInputStream` 像是一條錄影帶：如果我們想看最後一段內容，必須從頭開始快轉、一段一段掃過去，沒辦法跳著看。`ZipFile` 則像是一片 DVD：我們可以打開目錄選單，直接點擊跳到想看的那一集，不用從頭播放。

業界實務上，如果我們正在「邊下載邊解壓」一個從網路傳來的 ZIP 檔，因為資料是一段一段陸續到達的，這時候只能用 `ZipInputStream`。但如果我們是要在硬碟裡一個 1GB 的 ZIP 檔案中，找出某一張特定的照片，用 `ZipFile` 的 `getEntry()` 直接定位，速度會快非常多，完全不需要把整個檔案掃過一輪。

簡單的判斷原則：手上已經有實體 ZIP 檔案、而且要找特定內容，選 `ZipFile`；不確定資料來源、或是要邊收邊處理，選 `ZipInputStream`。
-->

---
layout: default
---

# 練習 1：ZIP 套件架構與選用
### 認證模擬題（單選）

我們要寫一個小工具，從網路上即時收到一段「不確定長度、邊下載邊到達」的 ZIP 資料串流，並在收到每個檔案的同時就立刻處理它的內容。

關於這個需求該選用哪個類別，以及 `java.util.zip` 套件的基本概念，下列描述何者**正確**？

A. 應該選用 `ZipFile`，因為它支援隨機存取，效能比較好<br>
B. 應該選用 `ZipInputStream`，因為它可以處理任何 `InputStream`（包括網路串流），採循序讀取<br>
C. ZIP 檔案裡的資料夾不需要對應任何 `ZipEntry`，只有檔案才會有 `ZipEntry`<br>
D. `Deflater` 和 `Inflater` 是我們在一般應用程式中最常直接呼叫的類別，用來手動控制壓縮等級

<!--
【出題動機】
這題想確認大家是否理解 `ZipInputStream` 跟 `ZipFile` 的根本差異（資料來源與存取方式），以及 `ZipEntry` 如何表示 ZIP 內部的檔案與目錄結構，這些都是第一部分的核心概念。

【解題引導】
先看看題目給的情境關鍵字：「不確定長度」「邊下載邊到達」「即時處理」，這些線索分別對應到 `ZipInputStream` 還是 `ZipFile` 的「資料來源」跟「存取方式」？再想一想：ZIP 規格裡，資料夾本身算不算一個項目？最後，`Deflater`/`Inflater` 是屬於套件裡的哪一層（最底層引擎，還是我們平常會直接操作的類別）？
-->

---
layout: default
---

# 練習 1：ZIP 套件架構與選用
### 解析

**正確答案：B**

- A. ❌ `ZipFile` 只能處理「磁碟上的實體檔案」，而題目情境是「網路串流、邊下載邊到達」，資料根本還沒落地成檔案，無法用 `ZipFile`
- B. ✅ `ZipInputStream` 可以包裝任何 `InputStream`（包含網路串流），採循序讀取，剛好符合「邊下載邊處理」的場景
- C. ❌ 資料夾在 ZIP 裡也是一個 `ZipEntry`，只是它的 `getName()` 會以斜線 `/` 結尾（例如 `images/`），`isDirectory()` 就是依據這個判斷的
- D. ❌ `Deflater`/`Inflater` 是套件裡最底層的壓縮/解壓縮引擎，一般寫程式時很少直接碰到，平常使用的是 `ZipOutputStream`/`ZipInputStream`/`ZipFile` 這些更高層的類別

<!--
【帶讀解法】
這題的關鍵在於把「資料來源」（磁碟實體檔案 vs. 任意 InputStream）跟「存取方式」（隨機 vs. 循序）對應到題目情境的關鍵字。網路串流、邊收邊處理 → 來源不是磁碟實體檔案、也無法隨機存取 → 只能選 `ZipInputStream`。另外也複習了 `ZipEntry` 同時代表檔案與目錄，以及 `Deflater`/`Inflater` 屬於「引擎層」，平常不會直接使用，這跟開車不需要知道引擎汽缸怎麼點火是一樣的道理。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 壓縮 (Zip) 檔案

<!--
認識完工具箱之後，接下來我們要動手做「壓縮機」了。

我們會按照由簡到繁的順序學習：先學會怎麼壓一個檔案，再學會怎麼一次壓多個檔案，最後挑戰壓縮整個資料夾（甚至是裡面還有子資料夾的情況）。每一步其實都是建立在前一步的基礎上，所以不用擔心一下子要記住太多東西。
-->

---

# 最簡壓縮範例：單一檔案

```java
try (ZipOutputStream zos =
         new ZipOutputStream(new FileOutputStream("hello.zip"))) {

    zos.putNextEntry(new ZipEntry("hello.txt"));
    byte[] data = Files.readAllBytes(Path.of("hello.txt"));
    zos.write(data);
    zos.closeEntry();
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>三步驟口訣：</b>
<code>putNextEntry</code>（宣告 entry）→ <code>write</code>（寫資料）→ <code>closeEntry</code>（結束 entry）
</div>

<!--
這段是「壓縮界」的 Hello World，我們來看看它在做什麼。

整個流程其實只有四個步驟：第一，準備好 `ZipOutputStream`，告訴它要寫到 `hello.zip` 這個檔案；第二，呼叫 `putNextEntry`，建立一個名叫 `hello.txt` 的標籤，宣告「接下來的內容屬於這個檔案」；第三，把 `hello.txt` 的內容整個讀出來，一次性灌進壓縮串流；第四，呼叫 `closeEntry` 把這個 entry 封起來。

⚠️ 這裡有個很多人會犯的錯：忘記呼叫 `closeEntry`。如果只壓一個檔案，有時候程式碼看起來還是能動；但如果要壓縮多個檔案，沒有先封箱就開新箱子，整個 ZIP 檔很可能會直接損壞，打不開。

業界實務上要提醒一點：`Files.readAllBytes` 只適合處理小檔案，因為它會把整個檔案內容一次讀進記憶體。如果我們要壓縮一個 1GB 的影片檔，這一行程式碼會讓記憶體直接爆掉。下一頁我們就會看到用「緩衝區」處理大檔案的正式寫法。
-->

---

# 壓縮單一檔案 — 完整版（含緩衝）

```java
public static void zipSingleFile(String src, String dest)
        throws IOException {
    byte[] buffer = new byte[4096];
    try (FileOutputStream fos = new FileOutputStream(dest);
         ZipOutputStream zos = new ZipOutputStream(fos);
         FileInputStream fis = new FileInputStream(src)) {

        zos.putNextEntry(new ZipEntry(new File(src).getName()));
        int len;
        while ((len = fis.read(buffer)) > 0) {
            zos.write(buffer, 0, len);
        }
        zos.closeEntry();
    }
}
```

<!--
這個版本，是壓縮單一檔案的「正式上場」寫法——安全、穩定，而且不會把記憶體用爆。

跟上一頁最大的差別，是這裡多了一個 `buffer`，每次只讀一小段（4096 bytes）資料，寫進去，再讀下一小段，重複直到讀完。我們可以把這個過程想成是用一個小水杯把一桶水搬到另一個容器：雖然要多走幾趟，但絕對不會因為一次裝太多而打翻、把地板弄濕——也就是不會發生記憶體溢位。

這裡有一個業界實務上非常重要的細節：`new File(src).getName()`。這行程式碼的作用，是只取出檔案的「名稱」部分，而不是完整路徑。如果我們沒有加這一行，直接把完整路徑（例如 `C:\Users\User\Documents\hello.txt`）當作 entry 名稱寫進 ZIP，那解壓縮出來的人，會看到一大堆莫名其妙、跟他自己電腦結構完全對不上的資料夾，非常混亂。所以記得：ZIP 裡的標籤，通常只該留下檔名，不該帶著來源電腦的完整路徑。
-->

---

# 壓縮多個檔案

```java
public static void zipMultipleFiles(
        List<String> srcFiles, String dest) throws IOException {
    byte[] buf = new byte[4096];
    try (ZipOutputStream zos =
             new ZipOutputStream(new FileOutputStream(dest))) {
        for (String src : srcFiles) {
            try (FileInputStream fis = new FileInputStream(src)) {
                zos.putNextEntry(new ZipEntry(new File(src).getName()));
                int len;
                while ((len = fis.read(buf)) > 0)
                    zos.write(buf, 0, len);
                zos.closeEntry();
            }
        }
    }
}
```

<!--
這一頁要解決的問題是：如果有好幾個檔案，要怎麼一次打包成一個 ZIP？

程式碼結構其實不複雜：外層是一個 `ZipOutputStream`，負責整個 ZIP 檔案；裡層用一個 `for` 迴圈，依序處理每一個來源檔案。每個檔案都會經歷我們前面學過的「開箱、灌水、封箱」三步驟，做完一個接著做下一個。

⚠️ 這裡要特別注意 `try-with-resources` 的巢狀寫法：外層的 `try` 管理的是整個 ZIP 輸出串流 `zos`，內層的 `try` 管理的是「目前正在讀取的這個來源檔案」`fis`。當內層 `try` 結束時，只會關閉 `fis`，`zos` 完全不受影響，這樣才能繼續處理下一個檔案。如果我們不小心把 `zos` 放進了內層的 `try`，壓完第一個檔案之後 ZIP 串流就會被意外關閉，第二個檔案在嘗試寫入時就會直接拋出例外。這是一個很經典、卻很容易在第一次寫的時候忽略的錯誤。
-->

---

# 壓縮多個檔案 — 呼叫範例

```java
public static void main(String[] args) throws IOException {
    List<String> files = List.of(
        "report.txt",
        "data.csv",
        "image.png"
    );
    zipMultipleFiles(files, "archive.zip");
    System.out.println("壓縮完成：archive.zip");
}
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>設定壓縮等級：</b> 在第一個 putNextEntry 前加 <code>zos.setLevel(9)</code> 可啟用最高壓縮比（速度較慢）；<code>setLevel(0)</code> 等同不壓縮。
</div>

<!--
這頁就是一個簡單的測試程式，把我們前一頁寫好的方法實際呼叫一次：準備三個不同類型的檔案（文字、CSV、圖片），打包成 `archive.zip`。

關於壓縮等級，我們可以用「行李打包」來比喻：`setLevel(0)` 就像是把衣服平整地放進大行李箱，完全不擠壓；`setLevel(9)` 則是動用真空壓縮袋，把所有空氣都抽光，衣服變得薄薄一片，但抽真空這個動作本身需要花時間。

業界實務上，大部分情況我們不會特別去設定 `setLevel`，就讓它使用預設值（內部對應到等級 6）。這是一個壓縮效果跟運算時間之間取得平衡的數值，就像買車的時候選「標準配備」往往是最划算的選擇——夠用、不浪費。除非我們有非常明確的需求（例如儲存空間真的很吃緊，或是 CPU 完全閒置），通常不需要動這個設定。
-->

---

# 壓縮整個目錄 — 遞迴輔助方法

```java
private static void addDirToZip(File dir, String base,
                                  ZipOutputStream zos)
        throws IOException {
    for (File file : dir.listFiles()) {
        String entryName = base + file.getName();
        if (file.isDirectory()) {
            zos.putNextEntry(new ZipEntry(entryName + "/"));
            zos.closeEntry();
            addDirToZip(file, entryName + "/", zos);
        } else {
            zos.putNextEntry(new ZipEntry(entryName));
            Files.copy(file.toPath(), zos);
            zos.closeEntry();
        }
    }
}
```

<!--
這一頁，是壓縮主題裡的「大魔王」：把一整個資料夾（可能還有好幾層子資料夾）都壓進 ZIP。

我們可以把這個過程想成「清理房間」：我們打開一個抽屜（資料夾），看看裡面有什麼。如果看到的是一份文件（檔案），就直接裝箱；如果看到的是另一個更小的盒子（子資料夾），我們就再把這個小盒子打開來看，重複同樣的動作——這就是「遞迴」的精神，函式呼叫自己處理更深一層的內容，直到所有東西都清理完畢。

⚠️ 這裡有個關鍵細節：當遇到的是資料夾時，我們建立的 entry 名稱一定要以斜線 `/` 結尾，也就是程式碼裡 `entryName + "/"` 這個寫法。這跟我們前面提過的「ZIP 裡資料夾的命名規則」是一致的，如果漏掉這個斜線，解壓縮時資料夾結構就會跑掉。

另外，`Files.copy(file.toPath(), zos)` 這一行是個很值得學起來的小技巧，它會自動幫我們處理緩衝跟讀寫的細節，省掉手寫 `while` 迴圈逐段讀寫的麻煩。身為工程師，能夠用更少的程式碼達到一樣的效果，就是一種值得追求的「優雅」。
-->

---

# 壓縮整個目錄 — 呼叫入口

```java
public static void zipDirectory(String srcDir, String dest)
        throws IOException {
    File dir = new File(srcDir);
    try (ZipOutputStream zos =
             new ZipOutputStream(new FileOutputStream(dest))) {
        addDirToZip(dir, dir.getName() + "/", zos);
    }
}

// 呼叫方式
zipDirectory("myProject", "myProject.zip");
```

<div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>注意 NullPointerException：</b> <code>dir.listFiles()</code> 在目錄不存在或無讀取權限時會回傳 <code>null</code>，實務中應先做 null 檢查。
</div>

<!--
這一頁是整個「遞迴打包戲法」的入口——也就是使用者真正會呼叫的那個方法。

可以把它想成：我們要把整個家打包搬走，第一步是先把家裡的大門（也就是根目錄）打開，然後請搬家公司（也就是上一頁的遞迴方法）開始進去一間一間房間搬。`zipDirectory` 負責準備好 `ZipOutputStream`，然後把工作交給 `addDirToZip` 去處理所有細節。

⚠️ 這裡有一個容易忽略、但在實務上很重要的提醒：如果傳進來的 `srcDir` 路徑寫錯了，或者這個目錄根本不存在，`dir.listFiles()` 會冷冷地回傳一個 `null`，而不是一個空陣列。如果我們直接拿這個 `null` 去做 `for` 迴圈，程式就會立刻拋出 `NullPointerException`。所以在正式的程式裡，我們應該先用 `exists()` 跟 `isDirectory()` 檢查一下這個目錄是否真的存在、是否真的是資料夾，再開始進行壓縮，這樣可以給使用者一個友善的錯誤訊息，而不是讓程式直接當掉。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 解壓縮 (Unzip) 檔案

<!--
壓縮的部分我們已經學完了，接下來換個方向，來學怎麼「拆禮物」——也就是解壓縮。

解壓縮的邏輯跟壓縮其實有點像「鏡像」的關係：壓縮是把散落的檔案收進一個包裹，解壓縮就是把包裹裡的東西一個一個拿出來，放回原本該在的位置。我們會先看最簡單的寫法，再學完整版，最後特別介紹一個資深工程師都該知道的安全議題。
-->

---

# 最簡解壓縮範例

```java
try (ZipInputStream zis =
         new ZipInputStream(new FileInputStream("archive.zip"))) {
    ZipEntry entry;
    while ((entry = zis.getNextEntry()) != null) {
        Path outPath = Path.of("output", entry.getName());
        Files.createDirectories(outPath.getParent());
        Files.copy(zis, outPath);
        zis.closeEntry();
    }
}
```

<div class="mt-4 p-3 bg-green-50 border-l-4 border-green-400 text-gray-700 text-sm text-left">
✅ <b>解壓縮三步驟：</b> <code>getNextEntry()</code>（取得下一個 entry）→ 讀取資料 → <code>closeEntry()</code>（結束此 entry）
</div>

<!--
這是解壓縮的「開箱術」，整體流程跟壓縮其實互為對稱。

我們可以把這個過程想成拆一個驚喜包：先伸手摸出一個東西（`getNextEntry()`），看看上面的標籤寫著什麼名字（`entry.getName()`），然後把它放到該放的位置（`Files.copy(zis, outPath)`）。重複這個動作，直到袋子摸不到東西為止（也就是 `getNextEntry()` 回傳 `null`）。

業界實務上，`Files.createDirectories` 這一行非常重要。假設 ZIP 檔裡有一個埋在三層資料夾深處的檔案，但我們的硬碟上還沒有蓋好這三層資料夾的「地基」，直接寫入檔案就會失敗。這一行程式碼會自動先把所需的資料夾結構蓋好，再把檔案內容（家具）放進去，省掉我們手動逐層建立目錄的麻煩。
-->

---

# 用 ZipInputStream 解壓縮 — 完整版

```java
public static void unzip(String src, String destDir)
        throws IOException {
    byte[] buf = new byte[4096];
    try (ZipInputStream zis =
             new ZipInputStream(new FileInputStream(src))) {
        ZipEntry entry;
        while ((entry = zis.getNextEntry()) != null) {
            File out = new File(destDir, entry.getName());
            if (entry.isDirectory()) {
                out.mkdirs();
            } else {
                new File(out.getParent()).mkdirs();
                try (FileOutputStream fos = new FileOutputStream(out)) {
                    int len;
                    while ((len = zis.read(buf)) > 0)
                        fos.write(buf, 0, len);
                }
            }
            zis.closeEntry();
        }
    }
}
```

<!--
這是能應對各種「妖魔鬼怪」ZIP 檔的完整解壓縮版本——也就是正式專案裡會用的寫法。

這個版本比前一頁更細心。它會先判斷拿出來的這個 entry 是不是一個資料夾：如果是，就直接幫我們把這個資料夾蓋出來（`mkdirs`）；如果是檔案，會先確認它的「地基」——也就是父層資料夾——已經蓋好了，然後才開始用緩衝區一段一段地把內容寫進檔案。

⚠️ 這裡有一個非常容易犯的錯，務必特別記住：在這個迴圈裡，**千萬不要去關閉 `zis`**。`zis` 就像是我們手上的「總開關」，掌控著整個 ZIP 串流，一旦在迴圈中途把它關掉，後面的檔案就再也讀不到了。我們在迴圈裡需要關閉的，是每個檔案各自的輸出串流 `fos`——這也是為什麼 `fos` 用了自己的 `try-with-resources`，而 `zis` 用的是外層的 `try-with-resources`。
-->

---

# Zip Slip 安全漏洞防護

```java
// 危險：entry 名稱可能含 "../" 跳脫到目標目錄之外！
File out = new File(destDir, entry.getName()); // ← 未驗證

// 安全寫法：驗證輸出路徑在目標目錄內
File destFile = new File(destDir, entry.getName());
String destDirPath = new File(destDir).getCanonicalPath();
String destFilePath = destFile.getCanonicalPath();
if (!destFilePath.startsWith(destDirPath + File.separator)) {
    throw new IOException("Zip Slip detected: " + entry.getName());
}
```

<div class="mt-3 p-3 bg-red-50 border-l-4 border-red-400 text-gray-700 text-sm text-left">
🔒 <b>Zip Slip 攻擊：</b> 惡意 ZIP 可在 entry 名稱中使用 <code>../../etc/passwd</code> 等路徑跳脫到系統敏感目錄。生產環境務必加上路徑驗證。
</div>

<!--
這一頁要介紹一個資深工程師一定要知道的安全知識，叫做「Zip Slip」。

我們可以這樣想像：有人寄給我們一個包裹，包裹上的收件地址寫的不是我們家，而是「我們家隔壁的隔壁的、某個重要機關的辦公室」。如果我們完全不檢查地址，直接照著標籤把東西送過去，就在不知不覺中，幫了壞人一個忙，把不該出現的東西放到了不該出現的地方。

回到程式上來說，一個惡意製作的 ZIP 檔，可以把某個 entry 的名字設定成像 `../../etc/passwd` 這樣的路徑。如果我們的解壓縮程式沒有檢查、直接相信這個名字，解壓縮出來的檔案就可能會「跳脫」我們指定的目標資料夾，寫到系統的敏感位置，造成嚴重的安全問題。

防護的方式是用 `getCanonicalPath()`，它會把路徑裡所有的 `../` 都計算清楚，還原成真正的絕對路徑。接著我們檢查這個還原後的路徑，是不是真的落在我們指定的目標資料夾裡面。如果不是，就代表有人在搞鬼，這時候應該直接拋出例外，拒絕處理這個 entry。**任何會解壓縮使用者上傳 ZIP 檔的程式，這段檢查都是必須的**，這不是「進階選項」，而是基本的安全底線。
-->

---

# 用 ZipFile 讀取 ZIP 檔案

| 方法 | 說明 |
|------|------|
| `ZipFile(String name)` | 開啟指定路徑的 ZIP 檔案 |
| `getEntry(String name)` | 依名稱取得指定 entry（找不到回傳 null） |
| `getInputStream(ZipEntry e)` | 取得指定 entry 的 InputStream |
| `entries()` | 取得所有 entry 的 `Enumeration` |
| `stream()` | 取得所有 entry 的 `Stream<ZipEntry>`（Java 8+） |
| `size()` | ZIP 內的 entry 總數 |

<!--
前面我們學的是「整包解開」，這一頁要介紹的 `ZipFile`，是讀取 ZIP 的「開掛模式」。

如果我們的目標是把整個 ZIP 解壓縮到資料夾裡，那用 `ZipInputStream` 從頭循序讀到尾就可以了。但如果我們只是想從一個裝了幾千個檔案的 ZIP 裡，「偷看」其中一個特定檔案的內容呢？這時候 `ZipFile` 就像是一個能隨時開啟、直達目的地的傳送門：`getEntry(name)` 直接告訴它檔名，它就把對應的 entry 找出來給我們，完全不需要從頭掃描。

`stream()` 這個方法是 Java 8 加入的，可以讓我們用 Stream API 的方式來處理所有 entry，例如篩選、轉換、列舉，寫起來會比傳統的 `Enumeration` 更簡潔。

⚠️ 有一點要特別注意：`ZipFile` 必須指向磁碟上一個真實存在的檔案，它沒辦法用來讀取「正在從網路傳輸中」的資料流。如果資料來源是網路或記憶體裡的位元組陣列，那就是 `ZipInputStream` 的主場了。
-->

---

# ZipFile 使用範例

```java
try (ZipFile zf = new ZipFile("archive.zip")) {
    // 1. 列出所有 entry
    zf.stream()
      .map(ZipEntry::getName)
      .forEach(System.out::println);

    // 2. 讀取特定 entry 的內容
    ZipEntry entry = zf.getEntry("data/report.csv");
    if (entry != null) {
        try (InputStream is = zf.getInputStream(entry)) {
            String content = new String(is.readAllBytes());
            System.out.println(content);
        }
    }
}
```

<!--
這段範例展示了 `ZipFile` 兩個最常用的使用情境，我們可以把它當成一份「速查表」。

第一部分，用 Java 8 的 `stream()` 搭配方法參考 `ZipEntry::getName`，一行程式碼就把 ZIP 裡所有檔案的名字都列出來，寫法非常精簡。

第二部分，是直接「點名」我們想要的那個檔案——`getEntry("data/report.csv")`。如果這個 entry 真的存在（不是 `null`），我們就透過 `getInputStream(entry)` 拿到它的內容串流，再讀出來。

業界實務上值得一提的是 `readAllBytes()`，這是 Java 9 才加入的方法。在那之前，如果想把一個 `InputStream` 的內容讀成字串，往往要寫上七、八行迴圈跟緩衝區的程式碼；現在只要呼叫這一個方法就解決了。這也是 Java 標準函式庫持續進化、讓我們的程式碼愈寫愈精簡的一個例子。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# NIO + ZIP File System（Java 11+）

<!--
如果前面學到的這些類別名字讓我們覺得有點冗長、步驟有點繁瑣，這個部分就是我們的「救星」。

接下來要介紹的，是把一個 ZIP 檔案直接當成一個「虛擬硬碟」來操作的寫法。聽起來有點神奇，但其實概念並不難，而且程式碼會比前面的版本精簡很多。
-->

---

# NIO ZIP File System 概念

```
FileSystems.newFileSystem(zipPath, Map.of("create", "true"))
     ↓
  ZipFileSystem（實作 FileSystem 介面）
     ↓
  可用 Files.copy / Files.walk / Files.readAllBytes
  等所有 NIO Files 工具操作 ZIP 內容
```

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>ZIP File System Provider：</b> 內建於 JDK（<code>jdk.zipfs</code> 模組），不需額外相依。Java 13+ 支援直接傳入 <code>Path</code> 物件。
</div>

<!--
這一頁要介紹的，是「把 ZIP 當硬碟」的神奇魔法。

以前的解壓縮，就像是要手動把一個包裹拆開、一件一件把東西拿出來放好（也就是 `ZipInputStream` 那套逐個 entry 處理的流程）。而 NIO ZIP File System 的做法則不同：它幫這整個 ZIP 檔案「掛載」成一個虛擬磁碟代號，之後我們就可以用平常操作檔案系統的方式——例如 `Files.copy`、`Files.walk`——來直接讀寫 ZIP 裡的內容，完全不需要再想 entry、buffer 這些細節。

業界實務上，這是 Java 7 之後主推的寫法。如果是全新的專案，採用這個方式可以省掉很多手寫的 `while` 迴圈跟緩衝區計算，程式碼讀起來會清爽很多。`jdk.zipfs` 這個模組是內建在 JDK 裡的，不需要額外加任何相依套件，而且從 Java 13 開始，連 `Path` 物件都能直接傳進去，使用起來更方便。
-->

---

# NIO：建立 ZIP 並加入檔案

```java
Path zipPath = Path.of("output.zip");
Map<String, String> env = Map.of("create", "true");

try (FileSystem fs = FileSystems.newFileSystem(zipPath, env)) {
    // 加入單一檔案
    Files.copy(Path.of("hello.txt"), fs.getPath("hello.txt"));

    // 加入到子目錄
    Files.createDirectories(fs.getPath("data"));
    Files.copy(Path.of("report.csv"),
               fs.getPath("data/report.csv"));
}
```

<!--
我們來看看用 NIO 建立 ZIP 檔的程式碼，會發現它簡潔到有點不可思議。

第一步，我們定義一個 `FileSystem`，傳入的 `env` 參數裡有一組設定 `"create":"true"`。這個設定很重要，意思是「如果這個 ZIP 檔案還不存在，請幫我新建一個」，如果漏了這個設定，而 `output.zip` 又不存在，程式就會直接報錯說找不到這個檔案。

第二步，我們透過 `fs.getPath()` 取得「ZIP 內部」的路徑，這個路徑跟我們電腦上的真實路徑是分開來的兩套座標系統。第三步，直接用我們熟悉的 `Files.copy`，把外部的檔案複製到這個 ZIP 內部路徑——就跟平常複製檔案到資料夾一樣自然。

⚠️ 這裡有一個值得澄清的概念：這個動作是「複製」，不是「搬移」。執行完之後，原來的 `hello.txt` 仍然會留在它原本的位置，只是 ZIP 檔裡多了一個內容相同的「分身」。如果我們的需求是壓縮完之後要刪除原始檔案，那要自己額外再做一次刪除的動作。
-->

---

# NIO：解壓縮所有檔案

```java
Path zipPath = Path.of("archive.zip");
Path outDir  = Path.of("extracted");

try (FileSystem fs = FileSystems.newFileSystem(zipPath, Map.of())) {
    Path root = fs.getPath("/");
    Files.walk(root)
         .filter(p -> !Files.isDirectory(p))
         .forEach(p -> {
             Path target = outDir.resolve(
                 root.relativize(p).toString());
             try {
                 Files.createDirectories(target.getParent());
                 Files.copy(p, target,
                     StandardCopyOption.REPLACE_EXISTING);
             } catch (IOException e) {
                 throw new RuntimeException(e);
             }
         });
}
```

<!--
這一頁是「一鍵解壓縮」的進階版本，整個流程可以拆成四個步驟來理解。

第一步，`Files.walk(root)` 會從 ZIP 的根目錄開始，自動走遍裡面所有的角落，不管藏得多深都會被找到，就像派了一個機器人把整個行李箱翻過一遍。第二步，用 `filter` 把資料夾排除掉，只留下真正的檔案。第三步，`root.relativize(p)` 會計算出這個檔案在 ZIP 裡面的「相對位置」，例如 `data/report.csv`。第四步，`outDir.resolve(...)` 把這個相對位置對應到我們電腦硬碟上想要解壓縮到的真實位置，然後用 `Files.copy` 一次性搬出去。

業界實務上，這個寫法的彈性很高。假設我們只想解壓縮 ZIP 裡的圖片檔案，不想要其他文件，只需要在 `filter` 那一行加上額外的條件（例如檔名是否以 `.png` 或 `.jpg` 結尾）就可以做到，不需要改動其他任何程式碼，這就是 Stream 風格 API 的好處。
-->

---

# NIO vs 傳統寫法比較

| 比較項目 | 傳統（ZipOutputStream/InputStream） | NIO ZIP File System |
|----------|--------------------------------------|---------------------|
| API 風格 | IO Stream 導向 | Path / Files 導向 |
| 程式碼量 | 較多（手動 buffer） | 較少（Files.copy 一行） |
| 支援版本 | Java 1.1+ | Java 7+（完整 Java 11+） |
| 串流來源 | 任何 InputStream | 僅磁碟檔案 |
| 修改已存在 ZIP | 需重新建立 | 可直接新增/刪除 entry |
| 適合場景 | 串流處理、記憶體 ZIP | 本機檔案操作 |

<!--
這張表是我們今天學習這麼多內容之後的「決策指南」，幫我們快速判斷該選哪一種寫法。

簡單的判斷原則是這樣：如果我們處理的資料是「使用者上傳的檔案」、資料還停留在記憶體或網路串流裡，那幾乎可以無腦選擇傳統的 `ZipOutputStream` / `ZipInputStream`，因為它對任何 `InputStream` 都通用。但如果我們是要寫一個在伺服器上跑的腳本，目標是打包硬碟上現成的 log 檔案、或是要修改一個已經存在的 ZIP（新增、刪除某些 entry），那就無腦選 NIO ZIP File System，程式碼會精簡很多，而且修改已存在 ZIP 這件事，傳統寫法做不到，必須整個重新打包。

⚠️ 最後有一個容易誤會的地方：NIO 的寫法雖然方便，但它的底層其實仍然是建構在我們前面學的那些 `ZipOutputStream`、`Deflater` 之類的機制上，只是 Java 幫我們把細節都包裝起來了。所以兩者在執行效能上其實差距不大，真正的差別在於「程式碼的可讀性跟維護的方便程度」。了解了底層運作方式之後，我們在使用 NIO 的高階寫法時，遇到問題也比較知道該怎麼排查。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# 實作綜合練習

<!--
【段落轉換】
工具箱認識完了，接下來把壓縮、解壓縮、NIO 這三個部分實際串起來動手寫，這三題會依序覆蓋今天教的核心操作，寫完就等於把整堂課的內容都摸過一輪了。
-->

---
layout: default
---

# 練習 2：壓縮指定目錄
### 任務說明

撰寫一個 Java 程式，接受命令列參數：`java ZipTool <來源目錄> <輸出.zip>`

**需求：**
1. 遞迴壓縮來源目錄下的所有檔案與子目錄
2. ZIP 內保留目錄結構（如 `logs/2024/app.log`）
3. 使用 try-with-resources 確保資源正確釋放
4. 若來源目錄不存在，印出錯誤訊息並結束

<!--
來練習一下今天學到的壓縮技巧。這一題的核心挑戰，是要把一整個資料夾的結構，完整地、不走樣地搬進一個 ZIP 檔案裡。

關鍵提示：第一，標籤的命名格式很重要！ZIP 檔規格使用斜線 `/` 作為路徑分隔符，而 Windows 系統預設用的是反斜線 `\`，記得在組合 entry 名稱的時候要做轉換。第二，比起自己手寫遞迴函式去掃描資料夾，這一題其實可以善用 `Files.walk()`，搭配 Stream API 來實作，程式碼會更精簡。第三，做完之後一定要實際測試：壓一個有子目錄結構的專案資料夾，解壓縮出來檢查一下，資料夾的層次結構有沒有維持原樣，這是檢驗這題有沒有寫對的最直接方式。
-->

---

# 練習 2：解題提示

```java
Path srcDir = Path.of(args[0]);
try (ZipOutputStream zos =
         new ZipOutputStream(new FileOutputStream(args[1]))) {
    Files.walk(srcDir)
         .filter(p -> !Files.isDirectory(p))
         .forEach(p -> {
             String entryName = srcDir.relativize(p).toString()
                                      .replace("\\", "/");
             // putNextEntry → Files.copy(p, zos) → closeEntry
         });
}
```

**關鍵步驟：**
1. `Files.walk(srcDir)` 取得所有子路徑
2. `srcDir.relativize(p)` 計算相對路徑作為 entry 名稱
3. Windows 路徑分隔符 `\` 要替換為 `/`（ZIP 規格要求）
4. `Files.copy(p, zos)` 取代手動 buffer 迴圈

<!--
這一題的靈魂角色，就是 `relativize` 這個方法。

它做的事情是：把一個完整路徑（例如 `C:\Work\project\src\Main.java`），對照來源資料夾的根路徑，計算出「相對」的那一段（例如 `src\Main.java`）。如果跳過這一步，直接把完整路徑當成 entry 名稱寫進 ZIP，解壓縮出來的人可能要在自己電腦上點開十層資料夾，才能找到我們真正想分享的程式碼——這樣的使用體驗顯然不太理想。

另外提醒一下，`Files.copy(p, zos)` 在這裡可以完全取代手寫的 `while` 讀寫迴圈，這也呼應了我們前面說過的——標準函式庫常常已經幫我們把繁瑣的細節包裝好了，善用這些方法可以讓程式碼更專注在「邏輯」上，而不是「機械式的搬運」。
-->

---
layout: default
---

# 練習 3：解壓縮並統計
### 任務說明

撰寫一個 Java 程式解壓縮 ZIP 並輸出統計報告：

```
java UnzipReport <archive.zip> <輸出目錄>
```

**輸出格式範例：**
```
解壓縮完成！
  檔案數量：15 / 目錄數量：3
  總原始大小：1,234,567 bytes
  總壓縮大小：456,789 bytes / 壓縮比：62.98%
```

**需求：**使用 `ZipFile` 讀取、統計 `getSize()` 與 `getCompressedSize()`、加入 Zip Slip 安全防護

<!--
這一題是把今天學到的內容綜合應用的「實戰題」：不只要解壓縮，還要順便統計資訊，並且要做安全防護，三件事一次到位。

關鍵提示：`getSize()` 拿到的是檔案原本的「體重」，`getCompressedSize()` 是壓縮後的「體重」。壓縮比的算法是 `1.0 - (壓縮後 / 壓縮前)`，數字愈接近 1，代表壓縮效果愈好。最後也別忘了——這一題明確要求加入我們前面學過的 `getCanonicalPath()` 路徑驗證，這不只是加分項，而是任何會處理「外部來源 ZIP 檔」的程式都該有的基本防線，千萬別讓自己寫的小工具，變成攻擊者用來突破系統的跳板。
-->

---

# 練習 3：解題提示

```java
long totalSize = 0, compressedSize = 0;
int fileCount = 0, dirCount = 0;

try (ZipFile zf = new ZipFile(args[0])) {
    for (ZipEntry e : Collections.list(zf.entries())) {
        if (e.isDirectory()) { dirCount++; continue; }
        fileCount++;
        totalSize      += e.getSize();
        compressedSize += e.getCompressedSize();
        // 解壓縮：zf.getInputStream(e) → 寫出到目標路徑
    }
}
double ratio = 1.0 - (double) compressedSize / totalSize;
System.out.printf("壓縮比：%.2f%%%n", ratio * 100);
```

<!--
這一題選擇用 `ZipFile` 而不是 `ZipInputStream`，是有原因的：`ZipFile` 在遍歷所有 entry 時比較穩定，而且每個 `ZipEntry` 物件本身就直接帶有 `getSize()`、`getCompressedSize()` 這些統計資訊，不需要額外計算。

`Collections.list(zf.entries())` 這行，是把 `ZipFile` 提供的舊式 `Enumeration` 轉換成一般的 `List`，這樣我們就能用熟悉的 `for-each` 寫法來遍歷所有 entry。

最後有個小提醒：如果我們算出來的壓縮比是「負數」，先別慌張，這通常代表某些檔案被我們「越壓越大」了——這在處理已經壓縮過的檔案（例如圖片）時很常見，因為 DEFLATE 演算法對這類資料幾乎無法再壓縮，反而會因為額外的格式資訊讓檔案略微變大。這是正常現象，不是我們的數學算錯了。
-->

---
layout: default
---

# 練習 4：NIO 增量更新 ZIP
### 任務說明

用 NIO ZIP File System 的方式，對一個**已經存在**的 ZIP 檔案 `archive.zip` 做以下操作：

1. 用 `FileSystems.newFileSystem(zipPath, Map.of())` 開啟既有的 ZIP（不要加 `"create", "true"`，因為檔案已存在）
2. 在 ZIP 內建立一個新目錄 `logs/`
3. 把外部檔案 `today.log` 複製進去，成為 `logs/today.log`
4. 印出 ZIP 內所有 entry 的路徑（用 `Files.walk` 走訪）

<!--
【任務鋪陳】
這一題練習第四部分學到的 NIO ZIP File System，重點是「修改一個已經存在的 ZIP」——這正是傳統 `ZipOutputStream` 寫法做不到、必須整個重新打包才能做到的事。

【引導思考】
想一想：開啟一個「已經存在」的 ZIP，跟前面範例「建立新 ZIP」相比，`env` 參數（`Map.of("create", "true")` vs `Map.of()`）有什麼不同？另外，`fs.getPath("logs")` 跟 `Files.createDirectories()` 之間的關係是什麼？
-->

---
layout: default
---

# 練習 4：NIO 增量更新 ZIP
### 解題提示

```java
Path zipPath = Path.of("archive.zip");

try (FileSystem fs = FileSystems.newFileSystem(zipPath, Map.of())) {
    // ① 建立新目錄
    Path logsDir = fs.getPath("logs");
    Files.createDirectories(logsDir);

    // ② 複製外部檔案進去
    Files.copy(Path.of("today.log"), fs.getPath("logs/today.log"));

    // ③ 列出所有 entry
    Path root = fs.getPath("/");
    Files.walk(root).forEach(p -> System.out.println(p));
}
```

**關鍵點：**
- 開啟既有 ZIP 用 `Map.of()`（空設定）；建立新 ZIP 才需要 `Map.of("create", "true")`
- `Files.createDirectories()` 在 ZIP 內建立目錄，跟在真實檔案系統上的用法完全相同
- 整段操作結束（`try` 區塊結束、`fs.close()`）後，`archive.zip` 就已經包含新增的內容，不需要額外的「儲存」步驟

<!--
【帶讀解法】
這題最重要的對比是 `env` 參數的差異：`Map.of("create", "true")` 是「如果檔案不存在就幫我新建」，用在建立新 ZIP；而開啟既有的 `archive.zip` 時，檔案已經存在，直接用 `Map.of()`（空設定）即可，不需要也不應該加 `create`。這正是 NIO ZIP File System 最強大的地方——把 ZIP 當成一個可以隨時掛載、隨時讀寫的虛擬磁碟，新增檔案、建立目錄都跟操作真實檔案系統一樣自然，傳統的 `ZipOutputStream` 寫法則完全無法「就地修改」已存在的 ZIP，只能整個重新打包。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Q & A

<!--
今天這份自學內容，我們從最基本的手動裝箱（`ZipOutputStream`），一路學到自動掛載的 NIO 寫法，完整走過了 Java 壓縮與解壓縮的全貌。

如果要用幾句話總結今天的重點，可以記住這三個黃金規則：第一，壓縮的口訣是「開標籤、灌資料、封箱」，也就是 `putNextEntry` → `write` → `closeEntry`；第二，安全永遠是第一位，任何處理外部來源 ZIP 檔的程式，務必加上 Zip Slip 防護；第三，如果是新專案、處理本機檔案，現代開發優先考慮 NIO ZIP File System，程式碼會更精簡好維護。

如果這份自學內容裡有哪個包裹（也就是哪段程式碼或概念）我們還拆不開、想不通，歡迎隨時找老師或同學討論。今天的內容就到這裡，謝謝大家！
-->

---
layout: end
---

# 課程結束
### java.util.zip：壓縮、解壓縮、安全防護一次搞定
