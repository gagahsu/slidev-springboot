# Ch02 開發環境安裝 — 截圖清單

`ch02-env-setup.md` 引用的 24 張截圖。目前放的是**佔位圖**，拍好真實截圖後
**用相同檔名覆蓋**即可，投影片不需要修改任何一行。

- 建議寬度 **1200px 以上**，PNG 格式
- 環境：Windows 11 繁體中文、Eclipse Temurin **JDK 21**、Eclipse IDE **2026-06**
- 截圖裡若出現版本號，請確認是 21.x（避免與講義文字不一致）

| # | 檔名 | 要拍什麼 |
| --- | --- | --- |
| 1 | `jdk-01-download-page.png` | adoptium.net → **JDK 21 - LTS** 分頁，Windows x64 `.MSI` 下載鈕 |
| 2 | `jdk-02-installer-welcome.png` | Temurin 安裝精靈歡迎頁（看得到版本號 21.0.x） |
| 3 | `jdk-03-installer-custom-setup.png` | 「自訂安裝」樹狀清單，**Add to PATH**／**Set JAVA_HOME variable** 已開啟 |
| 4 | `jdk-04-installer-path.png` | 安裝精靈下方「位置：」那一列 |
| 5 | `jdk-05-installer-finish.png` | 安裝完成頁 |
| 6 | `env-01-system-advanced.png` | 設定 → 系統 → 進階系統設定 |
| 7 | `env-02-env-vars-dialog.png` | 環境變數視窗（上下兩區都要入鏡） |
| 8 | `env-03-java-home.png` | 系統變數中的 `JAVA_HOME` 那一列 |
| 9 | `env-04-path-edit.png` | 「編輯環境變數」清單，JDK 的 `\bin` 那一列 |
| 10 | `verify-01-run-cmd.png` | Win+R「執行」視窗，輸入 `cmd` |
| 11 | `verify-02-where-java.png` | cmd 執行 `where java` 的輸出 |
| 12 | `eclipse-01-download-page.png` | eclipse.org/downloads/packages → **Eclipse IDE for Java Developers** 區塊 |
| 13 | `eclipse-02-unzip.png` | 解壓縮後的 `eclipse` 資料夾，`eclipse.exe` 選起來 |
| 14 | `eclipse-03-workspace.png` | Workspace 選擇對話框（含路徑欄位與 Launch 鈕） |
| 15 | `eclipse-04-defender.png` | Defender 掃描排除的詢問對話框（非每台都會出現） |
| 16 | `eclipse-05-preferences-jre.png` | Window → Preferences → Java → Installed JREs |
| 17 | `eclipse-06-add-jre-home.png` | Add JRE 的 JRE Definition 頁，`JRE home` 已填、函式庫已載入 |
| 18 | `eclipse-07-jre-checked.png` | Installed JREs 清單，jdk-21 那列已打勾 |
| 19 | `project-01-new-java-project.png` | File → New → Java Project |
| 20 | `project-02-project-name.png` | New Java Project 對話框，名稱 `HelloWorld`、JRE 顯示 **JavaSE-21** |
| 21 | `project-03-new-package.png` | `src` 右鍵 → New → Package |
| 22 | `project-04-new-class.png` | New Java Class，名稱 `HelloWorld`、已勾 `main` 方法 |
| 23 | `project-05-run-as.png` | 右鍵 → Run As → Java Application |
| 24 | `project-06-console-output.png` | Console 面板顯示 `Hello, World!` |

## 重新產生佔位圖

若需要重建（例如調整尺寸），佔位圖是用 Pillow 產生的純色圖，直接刪掉重畫即可；
投影片只認檔名，不依賴圖片內容。
