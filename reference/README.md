# 參考答案：dynamic-survey（後端）

課程「動態問卷系統」的**可執行參考答案**：Spring Boot 4.1.1、Java 21、Gradle、MySQL 8.x。
需求、資料表與 API 清單見上一層的 `SURVEY-SPEC.md`；投影片中的程式碼都是從這個專案取材，並且都實際編譯、測試過。

## 執行

```bash
# 1. 建立資料庫（用 utf8mb4 執行，否則中文會亂碼）
mysql -uroot -p --default-character-set=utf8mb4 < ../sql/schema.sql
mysql -uroot -p --default-character-set=utf8mb4 < ../sql/seed.sql
mysql -uroot -p --default-character-set=utf8mb4 < ../sql/ch45-refresh-tokens.sql

# 2. 修改 src/main/resources/application.properties 的資料庫帳密

# 3. 啟動
cd dynamic-survey
./gradlew bootRun          # http://localhost:8080  ，Swagger UI：/swagger-ui/index.html
./gradlew test             # 12 個單元測試（不需要資料庫）
./e2e.sh                   # 後端啟動後執行：用 curl 把 16 個情境走一遍（會改資料庫，重跑前請重新執行 SQL）
```

測試帳號（密碼都是 `Passw0rd12`）：`admin@example.com`（ADMIN）、`ming@example.com`、`mei@example.com`（USER）。

## 對照章節

| 章 | 程式碼 |
| --- | --- |
| ch28 | `SurveyRepository`（`search`、`findOngoing`） |
| ch37 | `entity/*`、`SurveyStatus`、`dto/SurveyDTO`…、`SurveyService` |
| ch38 | `config/OpenApiConfig`、`@Tag` / `@Operation` / `@Schema` |
| ch39 | `vo/*`、`exception/*`、DTO 驗證註解 |
| ch40 | `DraftService`、`ResponseService`（暫存 → 送出）、`AdminSurveyController` 的 `survey-draft` |
| ch41 | `src/test/**`、`logging.*` 設定 |
| ch44 | `User`、`CustomUserDetailsService`、`UserService`、`UserController` |
| ch45 | `security/*`、`RefreshToken`、`AuthController` |
| ch47 | `StatisticsService`、`AdminSurveyController` 的回饋與統計 |

## 與投影片的差異

- 這裡是**最終完成版**：投影片各章的解答是逐步累積的（例如 ch40 的 `submit` 還沒有登入者參數，ch44 才加入）。
- `sql/` 與 `SURVEY-SPEC.md` 的內容與 `slidev-mysql` repo 保持一致。
