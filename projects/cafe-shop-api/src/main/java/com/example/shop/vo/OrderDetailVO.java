package com.example.shop.vo;

import java.time.LocalDateTime;
import java.util.List;

import com.example.shop.entity.Order;

// payments 與 warning 只有後台會填（前台是 null）
public record OrderDetailVO(String orderNo, String status, String statusLabel, Integer itemsAmount,
        Integer shippingFee, Integer totalAmount, String receiverName, String receiverPhone,
        String receiverAddress, String note, String trackingNo, LocalDateTime createdAt,
        LocalDateTime paidAt, LocalDateTime shippedAt, LocalDateTime completedAt,
        LocalDateTime cancelledAt, String cancelReason, List<OrderItemVO> items,
        List<PaymentVO> payments, String warning) {

    public static OrderDetailVO of(Order o, List<PaymentVO> payments, String warning) {
        return new OrderDetailVO(o.getOrderNo(), o.getStatus().name(), o.getStatus().getLabel(),
                o.getItemsAmount(), o.getShippingFee(), o.getTotalAmount(), o.getReceiverName(),
                o.getReceiverPhone(), o.getReceiverAddress(), o.getNote(), o.getTrackingNo(),
                o.getCreatedAt(), o.getPaidAt(), o.getShippedAt(), o.getCompletedAt(), o.getCancelledAt(),
                o.getCancelReason(), o.getItems().stream().map(OrderItemVO::of).toList(), payments, warning);
    }
}
