-- 轉角咖啡線上商店 schema（進階學程；對應 specs/SHOP-SPEC.md §4；MySQL 9.7）
-- 執行：mysql --default-character-set=utf8mb4 -u root -p < schema.sql
-- 正式專案用 Flyway 管理（V1__schema.sql）；這份給 MySQL 課練習直接執行。
SET NAMES utf8mb4;
DROP DATABASE IF EXISTS cafe_shop;
CREATE DATABASE cafe_shop
  DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE cafe_shop;

CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(20)  NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(100) NOT NULL,                  -- BCrypt 雜湊
  phone      VARCHAR(10),
  role       VARCHAR(10)  NOT NULL DEFAULT 'USER',
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_users_role CHECK (role IN ('USER', 'ADMIN'))
) ENGINE=InnoDB;

CREATE TABLE categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(20) NOT NULL UNIQUE,
  sort_order INT         NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- 基礎版的 products 欄位原樣保留，再加 status、updated_at；price 是列表顯示用的起始價
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT          NOT NULL,
  name        VARCHAR(50)  NOT NULL,
  description VARCHAR(200),
  price       INT          NOT NULL,
  image_url   VARCHAR(200),
  available   TINYINT      NOT NULL DEFAULT 1,
  sort_order  INT          NOT NULL DEFAULT 0,
  status      VARCHAR(10)  NOT NULL DEFAULT 'ON_SALE',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_products_price  CHECK (price >= 0),
  CONSTRAINT chk_products_status CHECK (status IN ('ON_SALE', 'OFF_SHELF')),
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

-- 規格：同一個商品的不同重量 / 烘焙度，各有自己的售價與庫存
CREATE TABLE product_variants (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT         NOT NULL,
  name       VARCHAR(30) NOT NULL,
  sku        VARCHAR(30) NOT NULL UNIQUE,
  price      INT         NOT NULL,
  stock      INT         NOT NULL DEFAULT 0,
  sort_order INT         NOT NULL DEFAULT 0,
  version    INT         NOT NULL DEFAULT 0,          -- 樂觀鎖
  CONSTRAINT chk_variants_price CHECK (price >= 0),
  CONSTRAINT chk_variants_stock CHECK (stock >= 0),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 購物車：會員 × 規格（多對多的中間表），同一規格只有一筆
CREATE TABLE cart_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT      NOT NULL,
  variant_id INT      NOT NULL,
  quantity   INT      NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_cart_user_variant (user_id, variant_id),
  CONSTRAINT chk_cart_quantity CHECK (quantity BETWEEN 1 AND 10),
  FOREIGN KEY (user_id)    REFERENCES users(id)            ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  order_no         VARCHAR(20)  NOT NULL UNIQUE,
  user_id          INT          NOT NULL,
  status           VARCHAR(20)  NOT NULL DEFAULT 'PENDING_PAYMENT',
  items_amount     INT          NOT NULL,
  shipping_fee     INT          NOT NULL,
  total_amount     INT          NOT NULL,
  receiver_name    VARCHAR(20)  NOT NULL,
  receiver_phone   VARCHAR(10)  NOT NULL,
  receiver_address VARCHAR(200) NOT NULL,
  note             VARCHAR(200),
  tracking_no      VARCHAR(30),
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at          DATETIME,
  shipped_at       DATETIME,
  completed_at     DATETIME,
  cancelled_at     DATETIME,
  cancel_reason    VARCHAR(100),
  CONSTRAINT chk_orders_status CHECK (status IN ('PENDING_PAYMENT', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED')),
  CONSTRAINT chk_orders_total  CHECK (total_amount = items_amount + shipping_fee),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- 訂單明細：商品名稱、規格名稱、單價都是「下單當時」的快照
CREATE TABLE order_items (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  order_id     INT         NOT NULL,
  product_id   INT         NOT NULL,
  variant_id   INT         NOT NULL,
  product_name VARCHAR(50) NOT NULL,
  variant_name VARCHAR(30) NOT NULL,
  unit_price   INT         NOT NULL,
  quantity     INT         NOT NULL,
  subtotal     INT         NOT NULL,
  CONSTRAINT chk_items_subtotal CHECK (subtotal = unit_price * quantity),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 付款紀錄：一張訂單可以有多次付款嘗試，每次的 merchant_trade_no 都不同（綠界規定不可重複）
CREATE TABLE payments (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  order_id          INT          NOT NULL,
  provider          VARCHAR(10)  NOT NULL,
  merchant_trade_no VARCHAR(20)  NOT NULL UNIQUE,
  amount            INT          NOT NULL,
  status            VARCHAR(10)  NOT NULL DEFAULT 'PENDING',
  trade_no          VARCHAR(20),
  rtn_code          VARCHAR(10),
  rtn_msg           VARCHAR(200),
  payment_type      VARCHAR(30),
  simulate_paid     TINYINT      NOT NULL DEFAULT 0,
  paid_at           DATETIME,
  raw_notify        TEXT,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_payments_provider CHECK (provider IN ('ECPAY', 'MOCK')),
  CONSTRAINT chk_payments_status   CHECK (status IN ('PENDING', 'PAID', 'FAILED')),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;
