---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false

fonts:
  provider: none
title: 多執行緒 (Multithreading)
routeAlias: ch23
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
  <h1 style="color: #1a5c5c; font-size: 3.8rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">多執行緒</h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">「讓程式同時做很多事：執行緒的建立、同步與通信」</p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>

<!--
【開場白】
嘿各位，歡迎來到 Java 的「影分身之術」——多執行緒（Multithreading）！

【為什麼要學這個？】
你有沒有想過，為什麼你的電腦可以一邊放音樂、一邊下載片子（我是說學習影片），還能一邊跑你的程式？這就是多執行緒。如果你的程式一次只能做一件事，那就像是去餐廳點餐，廚師要先洗菜、再切菜、再炒菜，這期間所有人都要在外面排隊等，這家店大概三天就倒閉了。今天我們要學的就是：怎麼雇三個廚師同時開工。

【今天學完你會能做什麼】
學完這堂課，你的程式就不再是那個反應遲鈍的「單線程腦袋」了。你會知道怎麼叫執行緒起床工作、怎麼讓它們排隊、怎麼防止它們為了搶同一個雞腿（資源）而打架。
-->

---
layout: default
---

# Outline

- **多執行緒是什麼**：同一個程式內同時執行多個任務，彼此互不阻塞
- **用在哪裡**：伺服器並行請求、GUI 背景下載、資料庫並行查詢、背景監控
- **為何列為自學**：生命週期、同步機制、競爭條件的認知負擔較重
- **AI 協作時刻**：兩個執行緒搶同一份資料會發生什麼事
- **延伸學習**：自學版的完整內容

<!--
【課程預覽】
這一章在基礎班只走三頁：先認識多執行緒是什麼、用在哪裡，再說明為什麼把它放到自學範圍，最後用一個 AI 提問帶大家感受它的難點在哪。

【學習建議】
今天的目標不是「會寫」，而是「聽過、知道要去查什麼關鍵字」。等基礎打穩之後，自學版裡有完整的建立方式、同步機制與死結預防可以動手練。
-->

---

# 什麼是多執行緒？這是什麼／用在哪裡／為何列自學

**這是什麼？**

「多執行緒（Multithreading）」讓同一個程式內，可以同時執行多個任務——例如一邊接收使用者輸入、一邊在背景下載檔案、一邊更新畫面進度條，彼此互不阻塞。

**用在哪裡？**

<div class="mt-2 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>常見場景：</b> 網頁伺服器同時處理多個請求、GUI 應用程式背景下載不卡畫面、資料庫並行查詢、心跳監控等背景任務
</div>

**為何列為自學？**

<div class="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-gray-700 text-sm text-left">
⚠️ <b>列為自學的原因：</b> 多執行緒對零基礎學生來說認知負擔較重（需同時理解執行緒生命週期、同步機制、競爭條件等抽象概念），且<b>不是寫出基本可運作程式的必要條件</b>。基礎班只需口頭認識「這是什麼、用在哪裡」即可，完整內容留給有餘力的同學自學。
</div>

<!--
【重點解說】
今天我們不會深入教多執行緒的語法，而是用一頁帶大家認識「這是什麼」。

【生活化比喻】
想像一間銀行只有一個服務窗口，所有客戶都要排成一條長長的隊伍，一個一個慢慢辦。多執行緒就是「多開幾個窗口」，讓不同的客戶可以同時被服務，不用大家擠在一條隊伍裡。

【為什麼要學這個（但列為自學）？】
這個概念在實務上很重要——网頁伺服器、桌面應用程式幾乎都會用到。但它牽涉到「執行緒生命週期」「同步機制」「競爭條件」這些比較抽象的東西，對剛開始學程式的同學來說，一下子塞進去會消化不良。而且，我們目前學的「寫出一個能跑的 Java 程式」，並不需要用到多執行緒——所以這堂課我們先讓大家知道「有這個東西、它解決什麼問題」，之後想深入研究的同學，可以到自學版去動手玩玩看。

【口頭帶過即可】
這頁口頭帶過就好，不用逐字念，重點是讓同學知道「以後遇到『程式同時做很多事』的需求，要去找『多執行緒』這個關鍵字」。詳細的建立方式、同步機制、死結預防等，都留給自學版。
-->

---
layout: default
---

# 🎬 AI 協作時刻：多執行緒到底難在哪？

還不確定要不要花時間自學多執行緒？先問 AI 一個問題，了解它的「甜頭」跟「地雷」在哪：

**要用的 Prompt：**

> 我是 Java 初學者，還沒學過多執行緒。
> 請用一個生活化比喻，說明「兩個執行緒同時搶同一份資料」會發生什麼問題，
> 100 字以內，不要用程式碼。

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-sm text-left">
💡 <b>先建立危機感：</b> 多執行緒最難的不是「怎麼開」，而是「怎麼避免大家搶同一份資源」——這也是自學版 synchronized 章節要解決的問題。
</div>

<!--
【操作提示】
現場貼給 AI，看它會不會舉「兩個人同時領同一個提款機的錢」或類似的例子，幫同學建立「競爭條件（race condition）」的直覺。

【收斂一句話】
知道多執行緒「好用在哪、危險在哪」，比死記語法更重要——這決定了同學要不要投入時間自學下去。
-->

---
layout: default
---

<div class="flex flex-col justify-center items-center h-full">

# 想深入了解多執行緒？

<div class="mt-6 mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-gray-700 text-left" style="max-width: 600px;">
💡 自學版涵蓋：執行緒的建立方式、生命週期、sleep / join / Daemon、synchronized 同步機制、Deadlock 死結預防，以及 wait/notify 生產者消費者模式。
</div>

<Link to="java-adv/ch23" style="display: inline-block; margin-top: 1rem; padding: 0.75rem 2rem; background: linear-gradient(90deg, #5eada0, #a7d9d0); color: #ffffff; font-weight: 700; border-radius: 2rem; text-decoration: none; letter-spacing: 0.05em;">→ 前往自學內容</Link>

</div>

<!--
【口頭帶過即可，詳細內容留給自學版】
這頁口頭帶過就好：跟同學說「如果你對多執行緒有興趣，或是未來想往後端、伺服器開發發展，這是一定要會的東西，自學版有完整的建立方式、同步機制跟練習題，下課後可以自己玩玩看」。詳細內容不在課堂上展開，留給有餘力的同學自學版慢慢消化。
-->

---

# 總結

- **多執行緒讓同一個程式內可以同時執行多個任務**，彼此互不阻塞，例如一邊接收輸入、一邊背景下載
- **常見應用場景**：網頁伺服器同時處理多個請求、GUI 背景下載不卡畫面、資料庫並行查詢、心跳監控
- **多執行緒認知負擔較重**（執行緒生命週期、同步機制、競爭條件），且不是寫出基本可運作程式的必要條件，所以列為自學
- **多執行緒最大的風險是「競爭條件」** — 兩個執行緒同時搶同一份資料時，結果可能不如預期
- **想深入學的話，自學版有完整內容**：執行緒建立方式、生命週期、`sleep`/`join`/Daemon、`synchronized` 同步機制、死結預防、`wait`/`notify` 生產者消費者模式

<!--
我們把這一章整理成五個重點。

第一，多執行緒讓同一個程式可以同時執行多個任務，彼此互不阻塞，這是它跟「一次只能做一件事」的單執行緒程式最大的差別。

第二，多執行緒在實務上非常常見，網頁伺服器同時處理多個請求、GUI 應用程式背景下載不卡住畫面、資料庫並行查詢、系統的心跳監控，背後都用到多執行緒。

第三，我們把多執行緒列為自學內容，是因為它牽涉到執行緒生命週期、同步機制、競爭條件這些比較抽象的概念，對剛開始學程式的同學負擔比較重，而且寫出一個基本能跑的 Java 程式並不需要用到它。

第四，多執行緒最大的風險是「競爭條件」——兩個執行緒同時搶同一份資料時，結果可能會不符合我們的預期，這也是為什麼需要同步機制來保護共用資源。

第五，如果對多執行緒有興趣，或未來想往後端、系統開發發展，自學版有完整的建立方式、同步機制與練習題，可以下課後自己動手玩玩看。

這五點加起來，就是多執行緒的基礎認識。下一章我們要繼續往下走了！
-->

---
layout: end
---

# 課程結束
### 多執行緒：認識同步處理的世界

<!--
【結束語】
今天我們認識了多執行緒「是什麼、用在哪裡」，這是進入後端與系統開發很重要的一塊拼圖。有興趣的同學別忘了去自學版動手玩玩看，下課！
-->
