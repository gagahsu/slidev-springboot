# 教材更新紀錄

本輪教學過程中發現需要更新的教材內容。教完本輪後一併回頭修改。

**狀態說明：** `待更新` = 尚未改回教材本體｜`已補充` = 已在後續章節補講，但原章節仍待更新｜`完成` = 原章節已更新

---

## 待更新項目

### 1. ch06 — @Autowired 欄位注入 vs 建構子注入

- **檔案：** `06-component-autowired.md`
- **發現日期：** 2026-07-14
- **狀態：** `已補充`（已加到 `07-qualifier.md` Part 1 回顧區「補充」兩頁，Outline 回顧項目同步更新）
- **問題：** 全章只教 `@Autowired` 欄位注入，未提 Spring 官方（含 Spring Boot 4.x）建議使用建構子注入
- **更新方向：**
  - 在「完整範例 — Step 3：MyController 完整程式碼」之後、「Spring Boot 啟動流程」之前，加 1~2 頁建構子注入補充（可直接沿用 ch07 開頭那兩頁的內容）
  - 「章節總結」加一條：新專案建議建構子注入，`@Autowired` 欄位注入用於理解既有程式碼
  - Outline 對應增列
  - 措辭注意：寫「官方建議」，不寫「不要使用」——`@Autowired` 欄位注入未棄用

### 2. ch06 — 多依賴注入與 Lombok

- **檔案：** `06-component-autowired.md`（或視教材規劃獨立一章）
- **發現日期：** 2026-07-14
- **狀態：** `已補充`（已加到 `07-qualifier.md` Part 1 回顧區「補充」五頁：多依賴建構子注入、`@RequiredArgsConstructor`、Lombok 安裝 Step 1 Gradle 依賴、Step 2 Gradle Refresh、Step 3 IDE 支援）
- **問題：** 課程未涵蓋多個 Bean 同時注入的寫法，也未介紹實務標準組合 `private final` + Lombok `@RequiredArgsConstructor`，以及 Lombok 安裝（Gradle `compileOnly` + `annotationProcessor` 依賴 + IDE 支援）
- **更新方向：**
  - 併入 ch06 建構子注入補充之後，或獨立成「Lombok 與注入實務」小節
  - Lombok 安裝流程含 Eclipse（lombok.jar 安裝器）與 IntelliJ（內建）差異
  - 提醒常見坑：只加 `compileOnly` 沒加 `annotationProcessor` → 編譯過但程式碼沒生成；依賴加了但 IDE 沒裝支援 → 滿屏紅字但 `gradlew build` 會過

---

## 新項目範本

### N. chXX — 標題

- **檔案：** `XX-xxx.md`
- **發現日期：** YYYY-MM-DD
- **狀態：** `待更新`
- **問題：** （教學時發現什麼問題／過時內容）
- **更新方向：** （要怎麼改、加在哪）
