package com.example.shop.vo;

import java.time.LocalDate;
import java.util.List;

public record SalesReportVO(LocalDate from, LocalDate to, int totalRevenue, int totalOrders,
        List<DailySalesVO> daily, List<CategorySalesVO> categories, List<ProductRankVO> products) {
}
