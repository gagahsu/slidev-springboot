package com.example.shop.vo;

import java.util.List;

public record DashboardVO(int todayRevenue, int todayOrders, int pendingShipCount,
        List<DailySalesVO> last7Days, List<ProductRankVO> top5) {
}
