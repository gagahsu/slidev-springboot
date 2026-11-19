-- 轉角咖啡範例資料（先執行 schema.sql）
-- 訂位日期一律相對於 CURDATE()，任何時候執行都有「今天」「明天」的資料。
SET NAMES utf8mb4;
USE corner_cafe;

INSERT INTO categories (id, name, sort_order) VALUES
  (1, '咖啡', 1),
  (2, '茶飲', 2),
  (3, '甜點', 3),
  (4, '輕食', 4),
  (5, '季節限定', 5);   -- 下個月才上新品，目前沒有品項（JOIN 練習用）

INSERT INTO products (id, category_id, name, description, price, image_url, available, sort_order) VALUES
  (1,  1, '美式咖啡',   '深焙豆萃取，加熱水',             90, '/menu/americano.svg',  1, 1),
  (2,  1, '拿鐵',       '濃縮咖啡加上綿密奶泡',           120, '/menu/latte.svg',      1, 2),
  (3,  1, '卡布奇諾',   '奶泡比拿鐵更厚',                 120, '/menu/cappuccino.svg', 1, 3),
  (4,  1, '手沖單品',   '每週更換產區，請洽店員',         160, '/menu/pour-over.svg',  1, 4),
  (5,  2, '伯爵紅茶',   '佛手柑香氣',                     100, '/menu/earl-grey.svg',  1, 1),
  (6,  2, '蜂蜜檸檬',   NULL,                             110, '/menu/honey-lemon.svg',1, 2),
  (7,  2, '抹茶拿鐵',   '日本宇治抹茶',                   140, '/menu/matcha.svg',     1, 3),
  (8,  3, '原味司康',   '附奶油與果醬',                   85,  '/menu/scone.svg',      1, 1),
  (9,  3, '巴斯克乳酪', '外焦內軟',                       150, '/menu/basque.svg',     1, 2),
  (10, 3, '季節水果塔', '水果缺貨，暫停供應',             160, '/menu/fruit-tart.svg', 0, 3),
  (11, 4, '火腿起司三明治', NULL,                         130, '/menu/sandwich.svg',   1, 1),
  (12, 4, '蔬菜貝果',   '全素可',                         120, '/menu/bagel.svg',      1, 2);

INSERT INTO reservations (id, name, phone, email, reserve_date, reserve_time, people, note) VALUES
  (1, '王小明', '0912345678', 'ming@example.com', CURDATE(),                            '10:30', 2, NULL),
  (2, '林美玲', '0922333444', NULL,               CURDATE(),                            '14:00', 4, '靠窗'),
  (3, '陳大文', '0933555666', 'dawen@example.com', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:30', 6, '有一位小朋友'),
  (4, '張雅婷', '0955777888', NULL,               DATE_ADD(CURDATE(), INTERVAL 1 DAY), '12:00', 2, NULL),
  (5, '李志明', '0966999000', 'zm@example.com',   DATE_ADD(CURDATE(), INTERVAL 3 DAY), '15:30', 3, NULL),
  (6, '黃小華', '0977111222', NULL,               DATE_SUB(CURDATE(), INTERVAL 2 DAY), '19:00', 8, '包場慶生');
