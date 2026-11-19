package com.example.shop.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.shop.service.OrderService;

// 每分鐘檢查一次：待付款超過 30 分鐘的訂單自動取消（ch44）
@Component
public class OrderTimeoutScheduler {

    private static final Logger log = LoggerFactory.getLogger(OrderTimeoutScheduler.class);

    @Autowired
    private OrderService orderService;

    @Scheduled(fixedDelay = 60_000)
    public void cancelExpiredOrders() {
        int count = orderService.cancelExpired();
        if (count > 0) {
            log.info("逾時取消 {} 張訂單", count);
        }
    }
}
