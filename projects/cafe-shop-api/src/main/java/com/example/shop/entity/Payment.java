package com.example.shop.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

// 付款紀錄：一張訂單可以有好幾次付款嘗試，每次的 merchantTradeNo 都不同
@Entity
@Table(name = "payments")
@Getter
@Setter
public class Payment {

    public static final String PENDING = "PENDING";
    public static final String PAID = "PAID";
    public static final String FAILED = "FAILED";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_id")
    private Integer orderId;

    private String provider; // ECPAY / MOCK

    @Column(name = "merchant_trade_no")
    private String merchantTradeNo;

    private Integer amount;
    private String status;

    @Column(name = "trade_no")
    private String tradeNo;

    @Column(name = "rtn_code")
    private String rtnCode;

    @Column(name = "rtn_msg")
    private String rtnMsg;

    @Column(name = "payment_type")
    private String paymentType;

    @Column(name = "simulate_paid")
    private Boolean simulatePaid = false;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "raw_notify")
    private String rawNotify;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
