package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.common.AppResponse;
import com.example.shop.service.PaymentService;
import com.example.shop.vo.OrderDetailVO;

// 模擬付款：只有 dev profile 才有這支 API，正式環境不存在
@Profile("dev")
@RestController
@RequestMapping("/api/orders")
public class MockPaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/{orderNo}/payments/mock")
    public AppResponse<OrderDetailVO> mockPay(@PathVariable("orderNo") String orderNo, Authentication auth) {
        return AppResponse.success(paymentService.mockPay(auth.getName(), orderNo));
    }
}
