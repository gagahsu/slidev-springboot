package com.example.shop.vo;

import java.time.LocalDateTime;

import com.example.shop.entity.Payment;

public record PaymentVO(String merchantTradeNo, String provider, Integer amount, String status,
        String tradeNo, String rtnCode, String rtnMsg, Boolean simulatePaid, LocalDateTime paidAt,
        LocalDateTime createdAt) {

    public static PaymentVO of(Payment p) {
        return new PaymentVO(p.getMerchantTradeNo(), p.getProvider(), p.getAmount(), p.getStatus(),
                p.getTradeNo(), p.getRtnCode(), p.getRtnMsg(), p.getSimulatePaid(), p.getPaidAt(), p.getCreatedAt());
    }
}
