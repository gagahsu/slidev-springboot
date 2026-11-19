package com.example.shop.controller.admin;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.common.AppResponse;
import com.example.shop.common.PageResponse;
import com.example.shop.service.ReportService;
import com.example.shop.service.UserService;
import com.example.shop.vo.DashboardVO;
import com.example.shop.vo.SalesReportVO;
import com.example.shop.vo.UserVO;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserService userService;

    @GetMapping("/dashboard")
    public AppResponse<DashboardVO> dashboard() {
        return AppResponse.success(reportService.dashboard());
    }

    @GetMapping("/reports/sales")
    public AppResponse<SalesReportVO> sales(
            @RequestParam(name = "from", required = false) LocalDate from,
            @RequestParam(name = "to", required = false) LocalDate to) {
        return AppResponse.success(reportService.sales(from, to));
    }

    @GetMapping("/users")
    public AppResponse<PageResponse<UserVO>> users(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return AppResponse.success(userService.list(page, size));
    }
}
