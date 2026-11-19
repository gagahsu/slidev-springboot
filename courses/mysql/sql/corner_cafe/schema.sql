-- 轉角咖啡一頁式網站 schema（基礎學程；對應 specs/CAFE-SPEC.md §4；MySQL 9.7）
-- 執行：mysql --default-character-set=utf8mb4 -u root -p < schema.sql
SET NAMES utf8mb4;
DROP DATABASE IF EXISTS corner_cafe;
CREATE DATABASE corner_cafe
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE corner_cafe;

-- 菜單分類：咖啡、茶飲、甜點、輕食
CREATE TABLE categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(20) NOT NULL UNIQUE,
  sort_order INT         NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- 菜單品項：一個分類有很多品項（1 對多）
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT          NOT NULL,
  name        VARCHAR(50)  NOT NULL,
  description VARCHAR(200),
  price       INT          NOT NULL,                 -- 新台幣元，不用小數
  image_url   VARCHAR(200),
  available   TINYINT      NOT NULL DEFAULT 1,       -- 1 = 供應中、0 = 暫停供應
  sort_order  INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_products_price CHECK (price >= 0),
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

-- 訂位：獨立的一張表，不跟其他表關聯
CREATE TABLE reservations (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(20)  NOT NULL,
  phone        VARCHAR(10)  NOT NULL,
  email        VARCHAR(100),
  reserve_date DATE         NOT NULL,
  reserve_time TIME         NOT NULL,
  people       TINYINT      NOT NULL,
  note         VARCHAR(200),
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_reservations_people CHECK (people BETWEEN 1 AND 8)
) ENGINE=InnoDB;
