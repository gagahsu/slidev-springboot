-- 第 45 章練習「Refresh Token」新增的資料表（先執行 schema.sql）
SET NAMES utf8mb4;
USE dynamic_survey;

CREATE TABLE refresh_tokens (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(100) NOT NULL,
  token       VARCHAR(500) NOT NULL,
  expiry_date DATETIME(6)  NOT NULL,
  UNIQUE KEY uk_refresh_token (token(255)),
  INDEX idx_refresh_email (email)
) ENGINE=InnoDB;
