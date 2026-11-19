---
theme: penguin
class: text-center
highlighter: shiki
lineNumbers: true
drawings:
  persist: false
transition: slide-left
title: 專題（七）：後台訂單與報表
routeAlias: ch57
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
---

<div class="flex flex-col justify-center items-center h-full" style="background: #ffffff;">
  <p style="color: #5eada0; font-size: 1rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.2rem;">
    Spring Boot Backend Masterclass
  </p>
  <h1 style="color: #1a5c5c; font-size: 2.6rem; font-weight: 900; line-height: 1.15; margin-bottom: 1.5rem;">
    專題（七）<br>後台訂單與報表
  </h1>
  <div style="height: 4px; width: 320px; background: linear-gradient(90deg, #5eada0, #a7d9d0); border-radius: 2px; margin-bottom: 1.5rem;"></div>
  <p style="color: #4a7c7c; font-size: 1.15rem; font-style: italic;">
    「出貨照順序，報表用 SQL 說話」
  </p>
  <Link to="home" style="color: #9dc4c4; font-size: 0.85rem; margin-top: 2rem; text-decoration: none; letter-spacing: 0.05em;">← 返回目錄</Link>
</div>
<!--
歡迎來到第五十七章，專題後端的最後一章：後台的訂單管理和報表。

訂單管理要守住狀態的規則；報表有很多 GROUP BY 和 JOIN，這種查詢交給 MyBatis，直接寫 SQL 最清楚。
-->

---

# 今天要完成的事

<v-clicks>

- **訂單列表**：依狀態、日期、訂單編號篩選，分頁
- **訂單明細**：含付款紀錄；已取消卻收到付款要**提醒人工處理**
- **出貨、完成、取消**：照狀態規則走
- **營運摘要**與**銷售報表**：用 MyBatis XML 寫 SQL

</v-clicks>

<!--
今天要完成四件事。

（下一步）後台的訂單列表，可以依狀態、日期、訂單編號篩選，要分頁。

（下一步）訂單明細，除了明細還有每一次的付款紀錄。如果訂單已經取消、卻收到付款，要提醒管理員人工處理。

（下一步）出貨、完成、取消三個動作，照狀態規則走。

（下一步）營運摘要和銷售報表，用 MyBatis 的 XML 寫 SQL。
-->

---

# 故事：店長的工作日

<v-clicks>

- 早上翻開**收據夾**，抽出「已付款、還沒寄」的單子
- 寄出去，在收據上**寫物流單號、蓋「已出貨」**；客人收到後蓋「已完成」
- 有一張收據已經作廢，卻又收到一筆款項 → **貼一張紅色便利貼**，提醒處理退款
- 晚上**算帳**：每天賣多少、哪一類賣最好、哪一樣是冠軍

</v-clicks>

<!--
用店長的一天來想。

（下一步）早上翻開收據夾，抽出已付款、還沒寄出的單子。

（下一步）包好寄出去，在收據上寫物流單號，蓋「已出貨」；客人收到之後，再蓋「已完成」。

（下一步）有一張收據已經作廢了，卻又收到一筆款項。這種情況不能自己決定，貼一張紅色便利貼，提醒要處理退款或恢復訂單。

（下一步）晚上算帳：每天賣多少錢、哪一類賣最好、哪一樣商品是銷售冠軍。
-->

---

# 對應到程式

<Pairs left="店長的一天" right="程式" rows="book,翻收據夾=code,GET /api/admin/orders：依狀態、日期、編號篩選|form,寫單號、蓋章=code,ship / complete / cancel，交給 canChangeTo 判斷|no,紅色便利貼=code,OrderDetailVO 的 warning|cabinet,晚上算帳=code,MyBatis：ReportMapper.xml 的 GROUP BY 查詢" />

<!--
對應到程式。

（下一步）翻收據夾，是後台訂單列表，用狀態和日期篩選。

（下一步）寫單號、蓋章，是出貨、完成、取消三支 API，能不能做交給 canChangeTo 判斷。

（下一步）紅色便利貼，是訂單明細裡的 warning 欄位。

（下一步）晚上算帳，是 MyBatis 的報表查詢。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 1
# 訂單管理

<!--
先做訂單管理。
-->

---

# 訂單列表：日期區間

```java {all|1-6|9-10}
@Query("""
        SELECT o FROM Order o
        WHERE (:status IS NULL OR o.status = :status)
          AND (:from IS NULL OR o.createdAt >= :from)
          AND (:to IS NULL OR o.createdAt < :to)
          AND (:orderNo IS NULL OR o.orderNo = :orderNo)
        """)
Page<Order> search(…, Pageable pageable);

LocalDateTime fromTime = from == null ? null : from.atStartOfDay();
LocalDateTime toTime   = to == null ? null : to.plusDays(1).atStartOfDay();   // to 當天也算
```

<!--
訂單列表的查詢，跟商品一樣用選填條件。

（下一步）四個條件：狀態、開始時間、結束時間、訂單編號。

（下一步）前端給的是日期，例如 11 月 1 日到 11 月 19 日。資料庫存的是日期加時間，如果直接比 created_at 小於等於 11 月 19 日，會變成 19 日凌晨零點，當天的訂單全部漏掉。所以結束日期加一天，用「小於 11 月 20 日零點」，19 日一整天都算進去。這是寫報表最常見的錯誤。
-->

---

# 出貨、完成、取消

```java {all|1-8|10-16}
@Transactional
public OrderDetailVO ship(String orderNo, String trackingNo) {
    Order order = orderService.find(orderNo);
    orderService.changeStatus(order, OrderStatus.SHIPPED);   // 只有已付款可以出貨
    order.setTrackingNo(trackingNo.trim());
    order.setShippedAt(LocalDateTime.now());
    return toDetail(order);
}

@Transactional
public OrderDetailVO cancel(String orderNo, String reason) {
    Order order = orderService.find(orderNo);
    boolean paid = order.getStatus() == OrderStatus.PAID;
    String r = (reason == null || reason.isBlank()) ? "管理員取消" : reason.trim();
    orderService.cancel(order, paid ? r + "（已付款，需人工退款）" : r);   // 庫存加回去
    return toDetail(order);
}
```

<!--
出貨和取消。

（下一步）出貨：改狀態成已出貨，只有已付款的訂單可以，其他狀態 changeStatus 會丟出錯誤。記下物流單號和出貨時間。完成的寫法一樣。

（下一步）取消：用第五章寫好的 cancel，庫存會加回去。已付款的訂單取消，原因後面自動加上「需人工退款」。規格書只要求標記，退款要到綠界的廠商後台手動處理，不串退款 API。
-->

---

# 紅色便利貼：已取消卻收到付款

```java
private OrderDetailVO toDetail(Order order) {
    List<Payment> payments = paymentRepository.findByOrderIdOrderById(order.getId());
    String warning = null;
    boolean anyPaid = payments.stream().anyMatch(p -> Payment.PAID.equals(p.getStatus()));
    if (order.getStatus() == OrderStatus.CANCELLED && anyPaid) {
        warning = "訂單已取消但收到付款，請人工處理（退款或恢復訂單）";
    }
    return OrderDetailVO.of(order, payments.stream().map(PaymentVO::of).toList(), warning);
}
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 什麼時候會發生？客人在第 29 分鐘才開始刷卡，第 31 分鐘付款通知到了，但訂單在第 30 分鐘已經逾時取消。
</div>

</v-click>

<!--
訂單明細多了付款紀錄，讓管理員看到每一次付款嘗試：失敗幾次、哪一次成功。

如果訂單已經取消，卻有一筆付款成功，就加上 warning。系統不自動恢復訂單，因為庫存可能已經賣給別人了，交給人判斷。

（下一步）什麼時候會發生？客人在第二十九分鐘才開始刷卡，第三十一分鐘付款通知才到，但訂單在第三十分鐘已經被排程取消。這種邊界情況，金流系統一定要想到。
-->

---

# 想一想

<Poll question="管理員對一張「已出貨」的訂單按了取消，會怎樣？" options="訂單變成已取消，庫存加回去|回 409：已出貨的訂單不能改成已取消|訂單被刪除|什麼都不會發生" answer="2" />

<!--
想一想。已出貨的訂單按取消，會怎樣？

回 409，已出貨的訂單不能改成已取消。canChangeTo 規定已出貨只能變成已完成。東西都寄出去了，取消要走退貨流程，不能在系統裡按一下就把庫存加回去。
-->

---
layout: section
class: flex flex-col justify-center items-center text-center
---

# Part 2
# MyBatis 報表

<!--
接下來做報表。
-->

---

# 為什麼報表用 MyBatis（第 30–32 章）

<v-clicks>

- 報表要 **JOIN 三四張表、GROUP BY、SUM**，結果不是任何一個 Entity
- 用 JPA 要寫很長的 JPQL，還要另外對應結果；**直接寫 SQL 最清楚**
- MySQL 課第 9 章的 `daily_sales_view` 就是同一句 SQL
- 同一個專案可以 **JPA 和 MyBatis 並用**：一般 CRUD 用 JPA，報表用 MyBatis

</v-clicks>

<!--
為什麼報表要用 MyBatis？

（下一步）報表要 JOIN 好幾張表、分組、加總，結果是「每天賣多少」這種東西，不是任何一個 Entity。

（下一步）用 JPA 也做得到，但 JPQL 會很長，還要另外處理結果。直接寫 SQL 最清楚。

（下一步）MySQL 課第九章練習過的每日營業額 VIEW，就是同一句 SQL。

（下一步）同一個專案可以兩個一起用：一般的新增修改用 JPA，報表用 MyBatis，各取所長。
-->

---

# Mapper 介面與設定

```java
@Mapper
public interface ReportMapper {
    List<DailySalesVO> dailySales(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
    List<CategorySalesVO> categorySales(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
    List<ProductRankVO> productRanking(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
                                       @Param("limit") Integer limit);
    int countByStatus(@Param("status") String status);
}
```

```properties
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.configuration.map-underscore-to-camel-case=true   # sales_date → salesDate
```

<!--
Mapper 介面加上 @Mapper，每個方法對應一句 SQL。參數用 @Param 取名字，XML 裡才能用。

設定檔指定 XML 放在 resources 的 mapper 資料夾，再打開底線轉駝峰：SQL 的欄位叫 sales_date，會自動對應到 Java 的 salesDate。
-->

---

# ReportMapper.xml

```xml {all|2|4-12|14-19}
<mapper namespace="com.example.shop.mapper.ReportMapper">
  <sql id="validOrder">o.status IN ('PAID', 'SHIPPED', 'COMPLETED')</sql>

  <select id="dailySales" resultType="com.example.shop.vo.DailySalesVO">
    SELECT DATE(o.created_at) AS sales_date,
           COUNT(*)            AS order_count,
           SUM(o.total_amount) AS revenue
    FROM orders o
    WHERE <include refid="validOrder"/>
      AND o.created_at &gt;= #{from} AND o.created_at &lt; #{to}
    GROUP BY DATE(o.created_at)
    ORDER BY sales_date
  </select>

  <select id="productRanking" resultType="com.example.shop.vo.ProductRankVO">
    SELECT i.product_id, i.product_name, SUM(i.quantity) AS quantity, SUM(i.subtotal) AS revenue
    FROM order_items i JOIN orders o ON o.id = i.order_id
    WHERE <include refid="validOrder"/> AND o.created_at &gt;= #{from} AND o.created_at &lt; #{to}
    GROUP BY i.product_id, i.product_name ORDER BY revenue DESC
    <if test="limit != null">LIMIT #{limit}</if>
  </select>
</mapper>
```

<!--
XML 的寫法。

（下一步）「有效訂單」的條件每一句都要用，寫成一個 sql 片段，用 include 引用，改的時候只改一個地方。待付款和已取消不算營業額。

（下一步）每日營業額：依日期分組，算筆數和金額。XML 裡的大於、小於要寫成 &gt; 和 &lt;，否則會被當成標籤。參數用井字號大括號，MyBatis 會用 PreparedStatement，不會有 SQL Injection。

（下一步）商品排行：依明細的商品分組。用的是明細裡的快照名稱，商品後來改名，報表還是顯示當時的名字。最後的 if 是第三十二章的動態 SQL：有給 limit 才加 LIMIT，營運摘要的前五名和完整排行共用同一句。
-->

---

# 營運摘要

```java
public DashboardVO dashboard() {
    LocalDate today = LocalDate.now();
    List<DailySalesVO> last7 = reportMapper.dailySales(today.minusDays(6).atStartOfDay(),
                                                       today.plusDays(1).atStartOfDay());
    DailySalesVO todaySales = last7.stream().filter(d -> today.equals(d.getSalesDate()))
                                   .findFirst().orElse(null);
    List<ProductRankVO> top5 = reportMapper.productRanking(today.minusDays(29).atStartOfDay(),
                                                           today.plusDays(1).atStartOfDay(), 5);
    return new DashboardVO(todaySales == null ? 0 : todaySales.getRevenue(),
                           todaySales == null ? 0 : todaySales.getOrderCount(),
                           reportMapper.countByStatus("PAID"), last7, top5);
}
```

<!--
營運摘要組合幾個查詢：近七天的每日營業額，裡面挑出今天那一筆；近三十天的熱銷前五名；還有已付款、待出貨的訂單數。

今天如果還沒有訂單，查詢結果就沒有今天這一筆，要記得處理成 0，不然會 NullPointerException。

前端拿 last7 畫折線圖、top5 畫排行，Angular 課會做。
-->

---

# 驗證：報表與資料一致

```json
GET /api/admin/reports/sales?from=2026-10-21&to=2026-11-19
{ "totalRevenue": 9260, "totalOrders": 8,
  "categories": [ { "categoryName": "咖啡豆", "revenue": 3800 },
                  { "categoryName": "器材",   "revenue": 3170 },
                  { "categoryName": "濾掛包", "revenue": 2130 } ],
  "products":   [ { "productName": "綜合濾掛包", "quantity": 5, "revenue": 2130 }, … ] }
```

<v-click>

<div class="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-gray-700 text-left">
💡 用 MySQL 課第 9 章的 VIEW 再算一次，兩邊的數字要一樣。
</div>

</v-click>

<!--
最後驗證。查近三十天的銷售報表，總營業額、訂單數、各分類和商品排行都出來了。數字會因為你測試時下的訂單而不同。

（下一步）驗收的方法：用 MySQL 課第九章寫的 daily_sales_view 再算一次，兩邊的數字要一樣。規格書的驗收清單寫著「報表數字與訂單資料一致」。
-->

---

# 重點回顧

<Pairs left="店長的一天" right="程式" rows="book,翻收據夾=code,選填條件 + 日期區間（結束日加一天）|form,寫單號、蓋章=code,ship / complete / cancel + canChangeTo|no,紅色便利貼=code,已取消卻收到付款 → warning|cabinet,晚上算帳=code,MyBatis XML：sql 片段、動態 if、底線轉駝峰" />

<!--
回顧。

（下一步）翻收據夾，是選填條件的查詢，日期區間的結束日要加一天。

（下一步）寫單號、蓋章，是三個動作加上狀態規則。

（下一步）紅色便利貼，是已取消卻收到付款的提醒。

（下一步）晚上算帳，是 MyBatis 的 XML：sql 片段、動態 if、底線轉駝峰。
-->

---

# 專題後端完成！

<v-clicks>

- 七章做完：資料模型 → 會員 → 商品 → 購物車 → 訂單 → 金流 → 後台
- 照 `specs/SHOP-SPEC.md` §12 的驗收清單，用 Postman 逐項確認
- 接下來：Angular 課的專題章做前台與後台畫面；Docker 課把三個服務部署上線

</v-clicks>

<!--
專題的後端完成了，恭喜大家。

（下一步）七章做完：資料模型、會員、商品、購物車、訂單、金流、後台。

（下一步）請照規格書最後的驗收清單，用 Postman 一項一項確認。

（下一步）接下來，到 Angular 課的專題章做畫面；最後在 Docker 課，把資料庫、後端、前端三個服務一起部署上線。
-->

---
layout: end
---

# 謝謝大家

<Link to="home">← 返回目錄</Link>

<!--
這一章就到這裡，謝謝大家。
-->
