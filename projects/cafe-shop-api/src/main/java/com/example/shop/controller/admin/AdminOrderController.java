package com.example.shop.controller.admin;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.common.AppResponse;
import com.example.shop.common.PageResponse;
import com.example.shop.dto.CancelRequest;
import com.example.shop.dto.ShipRequest;
import com.example.shop.service.AdminOrderService;
import com.example.shop.service.PaymentService;
import com.example.shop.vo.EcpayQueryVO;
import com.example.shop.vo.OrderDetailVO;
import com.example.shop.vo.OrderSummaryVO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    @Autowired
    private AdminOrderService adminOrderService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public AppResponse<PageResponse<OrderSummaryVO>> list(
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "from", required = false) LocalDate from,
            @RequestParam(name = "to", required = false) LocalDate to,
            @RequestParam(name = "orderNo", required = false) String orderNo,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return AppResponse.success(adminOrderService.search(status, from, to, orderNo, page, size));
    }

    @GetMapping("/{orderNo}")
    public AppResponse<OrderDetailVO> detail(@PathVariable("orderNo") String orderNo) {
        return AppResponse.success(adminOrderService.detail(orderNo));
    }

    @PostMapping("/{orderNo}/ship")
    public AppResponse<OrderDetailVO> ship(@PathVariable("orderNo") String orderNo, @Valid @RequestBody ShipRequest req) {
        return AppResponse.success(adminOrderService.ship(orderNo, req.trackingNo()));
    }

    @PostMapping("/{orderNo}/complete")
    public AppResponse<OrderDetailVO> complete(@PathVariable("orderNo") String orderNo) {
        return AppResponse.success(adminOrderService.complete(orderNo));
    }

    @PostMapping("/{orderNo}/cancel")
    public AppResponse<OrderDetailVO> cancel(@PathVariable("orderNo") String orderNo,
            @Valid @RequestBody(required = false) CancelRequest req) {
        return AppResponse.success(adminOrderService.cancel(orderNo, req == null ? null : req.reason()));
    }

    @PostMapping("/{orderNo}/payments/query")
    public AppResponse<EcpayQueryVO> query(@PathVariable("orderNo") String orderNo) {
        return AppResponse.success(paymentService.query(orderNo));
    }
}
