package com.example.shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.common.AppResponse;
import com.example.shop.dto.CheckoutRequest;
import com.example.shop.service.OrderService;
import com.example.shop.service.PaymentService;
import com.example.shop.vo.EcpayFormVO;
import com.example.shop.vo.OrderDetailVO;
import com.example.shop.vo.OrderSummaryVO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public AppResponse<OrderDetailVO> create(@Valid @RequestBody CheckoutRequest req, Authentication auth) {
        return AppResponse.success(orderService.create(auth.getName(), req));
    }

    @GetMapping
    public AppResponse<List<OrderSummaryVO>> myOrders(Authentication auth) {
        return AppResponse.success(orderService.myOrders(auth.getName()));
    }

    @GetMapping("/{orderNo}")
    public AppResponse<OrderDetailVO> myOrder(@PathVariable("orderNo") String orderNo, Authentication auth) {
        return AppResponse.success(orderService.myOrder(auth.getName(), orderNo));
    }

    @PostMapping("/{orderNo}/cancel")
    public AppResponse<OrderDetailVO> cancel(@PathVariable("orderNo") String orderNo, Authentication auth) {
        return AppResponse.success(orderService.cancelByCustomer(auth.getName(), orderNo));
    }

    // 產生綠界付款表單的資料，前端再用隱藏表單送到綠界
    @PostMapping("/{orderNo}/payments/ecpay")
    public AppResponse<EcpayFormVO> ecpay(@PathVariable("orderNo") String orderNo, Authentication auth) {
        return AppResponse.success(paymentService.createEcpayForm(auth.getName(), orderNo));
    }
}
