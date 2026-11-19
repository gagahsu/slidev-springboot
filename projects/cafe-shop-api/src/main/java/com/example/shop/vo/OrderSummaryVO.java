package com.example.shop.vo;

import java.time.LocalDateTime;

import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;

public record OrderSummaryVO(String orderNo, String status, String statusLabel, Integer totalAmount,
        int itemCount, String receiverName, LocalDateTime createdAt) {

    public static OrderSummaryVO of(Order o) {
        int count = o.getItems().stream().mapToInt(OrderItem::getQuantity).sum();
        return new OrderSummaryVO(o.getOrderNo(), o.getStatus().name(), o.getStatus().getLabel(),
                o.getTotalAmount(), count, o.getReceiverName(), o.getCreatedAt());
    }
}
