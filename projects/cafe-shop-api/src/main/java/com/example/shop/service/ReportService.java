package com.example.shop.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shop.common.RspCode;
import com.example.shop.exception.BizException;
import com.example.shop.mapper.ReportMapper;
import com.example.shop.vo.CategorySalesVO;
import com.example.shop.vo.DailySalesVO;
import com.example.shop.vo.DashboardVO;
import com.example.shop.vo.ProductRankVO;
import com.example.shop.vo.SalesReportVO;

@Service
public class ReportService {

    @Autowired
    private ReportMapper reportMapper;

    // 營運摘要：今天、待出貨、近 7 天、近 30 天熱銷 Top 5
    public DashboardVO dashboard() {
        LocalDate today = LocalDate.now();
        List<DailySalesVO> last7 = reportMapper.dailySales(today.minusDays(6).atStartOfDay(),
                today.plusDays(1).atStartOfDay());
        DailySalesVO todaySales = last7.stream().filter(d -> today.equals(d.getSalesDate())).findFirst()
                .orElse(null);
        List<ProductRankVO> top5 = reportMapper.productRanking(today.minusDays(29).atStartOfDay(),
                today.plusDays(1).atStartOfDay(), 5);
        return new DashboardVO(todaySales == null ? 0 : todaySales.getRevenue(),
                todaySales == null ? 0 : todaySales.getOrderCount(),
                reportMapper.countByStatus("PAID"), last7, top5);
    }

    // 銷售報表：from、to 都包含；沒給就是近 30 天
    public SalesReportVO sales(LocalDate from, LocalDate to) {
        LocalDate t = to == null ? LocalDate.now() : to;
        LocalDate f = from == null ? t.minusDays(29) : from;
        if (f.isAfter(t)) {
            throw new BizException(RspCode.PARAM_ERROR, "開始日期不能晚於結束日期");
        }
        var fromTime = f.atStartOfDay();
        var toTime = t.plusDays(1).atStartOfDay();
        List<DailySalesVO> daily = reportMapper.dailySales(fromTime, toTime);
        List<CategorySalesVO> categories = reportMapper.categorySales(fromTime, toTime);
        List<ProductRankVO> products = reportMapper.productRanking(fromTime, toTime, null);
        int revenue = daily.stream().mapToInt(DailySalesVO::getRevenue).sum();
        int orders = daily.stream().mapToInt(DailySalesVO::getOrderCount).sum();
        return new SalesReportVO(f, t, revenue, orders, daily, categories, products);
    }
}
