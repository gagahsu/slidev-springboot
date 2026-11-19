package com.example.shop.controller;

import java.net.URI;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.service.PaymentService;

// 綠界會呼叫的兩個網址（不包 AppResponse）
@RestController
@RequestMapping("/api/payments/ecpay")
public class EcpayController {

    @Autowired
    private PaymentService paymentService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    // ReturnURL：綠界的伺服器通知付款結果，要回純文字 1|OK
    @PostMapping(value = "/notify", produces = MediaType.TEXT_PLAIN_VALUE)
    public String notify(@RequestParam Map<String, String> params) {
        return paymentService.handleNotify(params);
    }

    // OrderResultURL：客人的瀏覽器付款完回來，只負責轉到前端的結果頁，不在這裡改訂單
    @PostMapping("/result")
    public ResponseEntity<Void> result(@RequestParam Map<String, String> params) {
        String orderNo = paymentService.orderNoOf(params.get("MerchantTradeNo"));
        String target = orderNo == null ? frontendUrl + "/me/orders" : frontendUrl + "/orders/" + orderNo + "/result";
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(target)).build();
    }
}
