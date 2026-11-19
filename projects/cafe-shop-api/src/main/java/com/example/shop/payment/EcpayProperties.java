package com.example.shop.payment;

import org.springframework.boot.context.properties.ConfigurationProperties;

// application.properties 裡 ecpay.* 的設定
@ConfigurationProperties(prefix = "ecpay")
public record EcpayProperties(String merchantId, String hashKey, String hashIv, String paymentUrl,
        String queryUrl, String returnUrl, String orderResultUrl) {
}
