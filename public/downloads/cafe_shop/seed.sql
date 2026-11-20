-- 轉角咖啡線上商店範例資料（先執行 schema.sql）
-- 時間一律相對於今天：今天的訂單是幾分鐘前，其他天是那天上午 10 點左右；任何時候執行，報表題的「近 7 天」「今天」都有資料。
-- 帳號：admin@cornercafe.test / Admin1234（ADMIN）；user1～3@cornercafe.test / User1234（USER，user3 還沒下過單）
SET NAMES utf8mb4;
USE cafe_shop;

INSERT INTO users (id, name, email, password, phone, role) VALUES
  (1, '管理員', 'admin@cornercafe.test', '$2a$10$A3UcNyYftezler63bLKHoOn3JkMBa/VhIbIBvbM6N9ZrI2RmdQmlK', '0900000000', 'ADMIN'),
  (2, '王小明', 'user1@cornercafe.test', '$2a$10$vwi2grRTrzmSxyy6IAFyy.GuJtmjWF.agIe70pQgm5mxiRxFQ33Tu', '0912345678', 'USER'),
  (3, '林美玲', 'user2@cornercafe.test', '$2a$10$vwi2grRTrzmSxyy6IAFyy.GuJtmjWF.agIe70pQgm5mxiRxFQ33Tu', '0922333444', 'USER'),
  (4, '陳大文', 'user3@cornercafe.test', '$2a$10$vwi2grRTrzmSxyy6IAFyy.GuJtmjWF.agIe70pQgm5mxiRxFQ33Tu', '0933555666', 'USER');

INSERT INTO categories (id, name, sort_order) VALUES
  (1, '咖啡豆', 1),
  (2, '濾掛包', 2),
  (3, '器材', 3),
  (4, '禮盒', 4);  -- 禮盒還沒有商品

INSERT INTO products (id, category_id, name, description, price, image_url, available, sort_order, status) VALUES
  (1, 1, '衣索比亞 耶加雪菲', '柑橘、花香，淺焙', 380, '/uploads/product-1.jpg', 1, 1, 'ON_SALE'),
  (2, 1, '哥倫比亞 慧蘭', '堅果、焦糖，中焙', 350, '/uploads/product-2.jpg', 1, 2, 'ON_SALE'),
  (3, 1, '轉角特調', '店內招牌配方，深焙', 320, '/uploads/product-3.jpg', 1, 3, 'ON_SALE'),
  (4, 2, '綜合濾掛包', '每包 10g', 250, '/uploads/product-4.jpg', 1, 4, 'ON_SALE'),
  (5, 2, '單品濾掛包', '耶加雪菲／慧蘭各半', 300, '/uploads/product-5.jpg', 1, 5, 'ON_SALE'),
  (6, 3, '手沖壺 600ml', '細嘴不鏽鋼', 1280, '/uploads/product-6.jpg', 1, 6, 'ON_SALE'),
  (7, 3, '磨豆機', '手搖式，可調粗細', 1890, '/uploads/product-7.jpg', 1, 7, 'ON_SALE'),
  (8, 1, '肯亞 AA', '季節限定，已售完下架', 420, '/uploads/product-8.jpg', 0, 8, 'OFF_SHELF');

INSERT INTO product_variants (id, product_id, name, sku, price, stock, sort_order) VALUES
  (1, 1, '半磅', 'BEAN-YIR-H', 380, 25, 1),
  (2, 1, '一磅', 'BEAN-YIR-P', 700, 12, 2),
  (3, 2, '半磅', 'BEAN-COL-H', 350, 30, 3),
  (4, 2, '一磅', 'BEAN-COL-P', 650, 8, 4),
  (5, 3, '半磅 / 中研磨', 'BEAN-HSE-HG', 320, 40, 5),
  (6, 3, '半磅 / 不研磨', 'BEAN-HSE-HB', 320, 35, 6),
  (7, 3, '一磅 / 不研磨', 'BEAN-HSE-PB', 600, 1, 7),
  (8, 4, '10 入', 'DRIP-MIX-10', 250, 50, 8),
  (9, 4, '30 入', 'DRIP-MIX-30', 690, 20, 9),
  (10, 5, '10 入', 'DRIP-SGL-10', 300, 0, 10),
  (11, 6, '銀色', 'KETTLE-600-S', 1280, 6, 11),
  (12, 6, '黑色', 'KETTLE-600-B', 1280, 3, 12),
  (13, 7, '標準款', 'GRINDER-STD', 1890, 4, 13),
  (14, 8, '半磅', 'BEAN-KEN-H', 420, 0, 14);

-- 王小明的購物車還有兩樣東西沒結帳；林美玲的購物車有一樣
INSERT INTO cart_items (user_id, variant_id, quantity) VALUES
  (2, 3, 1),
  (2, 11, 1),
  (3, 8, 3);

INSERT INTO orders (id, order_no, user_id, status, items_amount, shipping_fee, total_amount, receiver_name, receiver_phone, receiver_address, tracking_no, created_at, paid_at, shipped_at, completed_at, cancelled_at, cancel_reason) VALUES
  (1, 'CS0001', 2, 'COMPLETED', 630, 80, 710, '王小明', '0912345678', '台北市大安區復興南路一段 100 號', 'TW100200301', CURDATE() - INTERVAL 9 DAY + INTERVAL 10 HOUR + INTERVAL 1 MINUTE, CURDATE() - INTERVAL 9 DAY + INTERVAL 10 HOUR + INTERVAL 1 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 9 DAY + INTERVAL 10 HOUR + INTERVAL 1 MINUTE + INTERVAL 1 DAY, CURDATE() - INTERVAL 9 DAY + INTERVAL 10 HOUR + INTERVAL 1 MINUTE + INTERVAL 3 DAY, NULL, NULL),
  (2, 'CS0002', 3, 'COMPLETED', 1280, 0, 1280, '林美玲', '0922333444', '新北市板橋區文化路二段 50 號 3 樓', 'TW100200302', CURDATE() - INTERVAL 8 DAY + INTERVAL 10 HOUR + INTERVAL 2 MINUTE, CURDATE() - INTERVAL 8 DAY + INTERVAL 10 HOUR + INTERVAL 2 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 8 DAY + INTERVAL 10 HOUR + INTERVAL 2 MINUTE + INTERVAL 1 DAY, CURDATE() - INTERVAL 8 DAY + INTERVAL 10 HOUR + INTERVAL 2 MINUTE + INTERVAL 3 DAY, NULL, NULL),
  (3, 'CS0003', 2, 'COMPLETED', 640, 80, 720, '王小明', '0912345678', '台北市大安區復興南路一段 100 號', 'TW100200303', CURDATE() - INTERVAL 6 DAY + INTERVAL 10 HOUR + INTERVAL 3 MINUTE, CURDATE() - INTERVAL 6 DAY + INTERVAL 10 HOUR + INTERVAL 3 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 6 DAY + INTERVAL 10 HOUR + INTERVAL 3 MINUTE + INTERVAL 1 DAY, CURDATE() - INTERVAL 6 DAY + INTERVAL 10 HOUR + INTERVAL 3 MINUTE + INTERVAL 3 DAY, NULL, NULL),
  (4, 'CS0004', 3, 'SHIPPED', 1390, 0, 1390, '林美玲', '0922333444', '新北市板橋區文化路二段 50 號 3 樓', 'TW100200304', CURDATE() - INTERVAL 4 DAY + INTERVAL 10 HOUR + INTERVAL 4 MINUTE, CURDATE() - INTERVAL 4 DAY + INTERVAL 10 HOUR + INTERVAL 4 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 4 DAY + INTERVAL 10 HOUR + INTERVAL 4 MINUTE + INTERVAL 1 DAY, NULL, NULL, NULL),
  (5, 'CS0005', 2, 'SHIPPED', 1890, 0, 1890, '王小明', '0912345678', '台北市大安區復興南路一段 100 號', 'TW100200305', CURDATE() - INTERVAL 3 DAY + INTERVAL 10 HOUR + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 3 DAY + INTERVAL 10 HOUR + INTERVAL 5 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 3 DAY + INTERVAL 10 HOUR + INTERVAL 5 MINUTE + INTERVAL 1 DAY, NULL, NULL, NULL),
  (6, 'CS0006', 3, 'PAID', 1000, 0, 1000, '林美玲', '0922333444', '新北市板橋區文化路二段 50 號 3 樓', NULL, CURDATE() - INTERVAL 2 DAY + INTERVAL 10 HOUR + INTERVAL 6 MINUTE, CURDATE() - INTERVAL 2 DAY + INTERVAL 10 HOUR + INTERVAL 6 MINUTE + INTERVAL 5 MINUTE, NULL, NULL, NULL, NULL),
  (7, 'CS0007', 2, 'PAID', 500, 80, 580, '王小明', '0912345678', '台北市大安區復興南路一段 100 號', NULL, CURDATE() - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 7 MINUTE, CURDATE() - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 7 MINUTE + INTERVAL 5 MINUTE, NULL, NULL, NULL, NULL),
  (8, 'CS0008', 3, 'CANCELLED', 1280, 0, 1280, '林美玲', '0922333444', '新北市板橋區文化路二段 50 號 3 樓', NULL, CURDATE() - INTERVAL 5 DAY + INTERVAL 10 HOUR + INTERVAL 8 MINUTE, NULL, NULL, NULL, CURDATE() - INTERVAL 5 DAY + INTERVAL 10 HOUR + INTERVAL 8 MINUTE + INTERVAL 30 MINUTE, '付款逾時，系統自動取消'),
  (9, 'CS0009', 2, 'PENDING_PAYMENT', 700, 80, 780, '王小明', '0912345678', '台北市大安區復興南路一段 100 號', NULL, NOW() - INTERVAL 9 MINUTE, NULL, NULL, NULL, NULL, NULL),
  (10, 'CS0010', 3, 'PAID', 1260, 0, 1260, '林美玲', '0922333444', '新北市板橋區文化路二段 50 號 3 樓', NULL, NOW() - INTERVAL 10 MINUTE, NOW() - INTERVAL 10 MINUTE + INTERVAL 5 MINUTE, NULL, NULL, NULL, NULL);

INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, variant_name, unit_price, quantity, subtotal) VALUES
  (1, 1, 1, 1, '衣索比亞 耶加雪菲', '半磅', 380, 1, 380),
  (2, 1, 4, 8, '綜合濾掛包', '10 入', 250, 1, 250),
  (3, 2, 6, 11, '手沖壺 600ml', '銀色', 1280, 1, 1280),
  (4, 3, 3, 5, '轉角特調', '半磅 / 中研磨', 320, 2, 640),
  (5, 4, 1, 2, '衣索比亞 耶加雪菲', '一磅', 700, 1, 700),
  (6, 4, 4, 9, '綜合濾掛包', '30 入', 690, 1, 690),
  (7, 5, 7, 13, '磨豆機', '標準款', 1890, 1, 1890),
  (8, 6, 2, 3, '哥倫比亞 慧蘭', '半磅', 350, 1, 350),
  (9, 6, 2, 4, '哥倫比亞 慧蘭', '一磅', 650, 1, 650),
  (10, 7, 4, 8, '綜合濾掛包', '10 入', 250, 2, 500),
  (11, 8, 6, 12, '手沖壺 600ml', '黑色', 1280, 1, 1280),
  (12, 9, 3, 6, '轉角特調', '半磅 / 不研磨', 320, 1, 320),
  (13, 9, 1, 1, '衣索比亞 耶加雪菲', '半磅', 380, 1, 380),
  (14, 10, 3, 5, '轉角特調', '半磅 / 中研磨', 320, 1, 320),
  (15, 10, 4, 8, '綜合濾掛包', '10 入', 250, 1, 250),
  (16, 10, 4, 9, '綜合濾掛包', '30 入', 690, 1, 690);

-- CS0006 第一次刷卡失敗、第二次成功；CS0008 沒付款被取消；CS0009 還在等付款
INSERT INTO payments (id, order_id, provider, merchant_trade_no, amount, status, trade_no, rtn_code, rtn_msg, payment_type, simulate_paid, paid_at, created_at) VALUES
  (1, 1, 'ECPAY', 'CS0001T1', 710, 'PAID', '261100000101', '1', '交易成功', 'Credit_CreditCard', 0, CURDATE() - INTERVAL 9 DAY + INTERVAL 10 HOUR + INTERVAL 1 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 9 DAY + INTERVAL 10 HOUR + INTERVAL 1 MINUTE + INTERVAL 1 MINUTE),
  (2, 2, 'ECPAY', 'CS0002T1', 1280, 'PAID', '261100000201', '1', '交易成功', 'Credit_CreditCard', 0, CURDATE() - INTERVAL 8 DAY + INTERVAL 10 HOUR + INTERVAL 2 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 8 DAY + INTERVAL 10 HOUR + INTERVAL 2 MINUTE + INTERVAL 1 MINUTE),
  (3, 3, 'ECPAY', 'CS0003T1', 720, 'PAID', '261100000301', '1', '交易成功', 'Credit_CreditCard', 0, CURDATE() - INTERVAL 6 DAY + INTERVAL 10 HOUR + INTERVAL 3 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 6 DAY + INTERVAL 10 HOUR + INTERVAL 3 MINUTE + INTERVAL 1 MINUTE),
  (4, 4, 'ECPAY', 'CS0004T1', 1390, 'PAID', '261100000401', '1', '交易成功', 'Credit_CreditCard', 0, CURDATE() - INTERVAL 4 DAY + INTERVAL 10 HOUR + INTERVAL 4 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 4 DAY + INTERVAL 10 HOUR + INTERVAL 4 MINUTE + INTERVAL 1 MINUTE),
  (5, 5, 'ECPAY', 'CS0005T1', 1890, 'PAID', '261100000501', '1', '交易成功', 'Credit_CreditCard', 0, CURDATE() - INTERVAL 3 DAY + INTERVAL 10 HOUR + INTERVAL 5 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 3 DAY + INTERVAL 10 HOUR + INTERVAL 5 MINUTE + INTERVAL 1 MINUTE),
  (6, 6, 'ECPAY', 'CS0006T1', 1000, 'FAILED', NULL, '10100058', '付款失敗', 'Credit_CreditCard', 0, NULL, CURDATE() - INTERVAL 2 DAY + INTERVAL 10 HOUR + INTERVAL 6 MINUTE + INTERVAL 1 MINUTE),
  (7, 6, 'ECPAY', 'CS0006T2', 1000, 'PAID', '261100000602', '1', '交易成功', 'Credit_CreditCard', 0, CURDATE() - INTERVAL 2 DAY + INTERVAL 10 HOUR + INTERVAL 6 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 2 DAY + INTERVAL 10 HOUR + INTERVAL 6 MINUTE + INTERVAL 2 MINUTE),
  (8, 7, 'ECPAY', 'CS0007T1', 580, 'PAID', '261100000701', '1', '交易成功', 'Credit_CreditCard', 0, CURDATE() - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 7 MINUTE + INTERVAL 5 MINUTE, CURDATE() - INTERVAL 1 DAY + INTERVAL 10 HOUR + INTERVAL 7 MINUTE + INTERVAL 1 MINUTE),
  (9, 8, 'ECPAY', 'CS0008T1', 1280, 'PENDING', NULL, NULL, NULL, NULL, 0, NULL, CURDATE() - INTERVAL 5 DAY + INTERVAL 10 HOUR + INTERVAL 8 MINUTE + INTERVAL 1 MINUTE),
  (10, 9, 'ECPAY', 'CS0009T1', 780, 'PENDING', NULL, NULL, NULL, NULL, 0, NULL, NOW() - INTERVAL 9 MINUTE + INTERVAL 1 MINUTE),
  (11, 10, 'ECPAY', 'CS0010T1', 1260, 'PAID', '261100001001', '1', '交易成功', 'Credit_CreditCard', 0, NOW() - INTERVAL 10 MINUTE + INTERVAL 5 MINUTE, NOW() - INTERVAL 10 MINUTE + INTERVAL 1 MINUTE);
