package com.example.shop.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_no")
    private String orderNo;

    @Column(name = "user_id")
    private Integer userId;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(name = "items_amount")
    private Integer itemsAmount;

    @Column(name = "shipping_fee")
    private Integer shippingFee;

    @Column(name = "total_amount")
    private Integer totalAmount;

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "receiver_phone")
    private String receiverPhone;

    @Column(name = "receiver_address")
    private String receiverAddress;

    private String note;

    @Column(name = "tracking_no")
    private String trackingNo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "cancel_reason")
    private String cancelReason;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // 狀態只能照規則往前走，違反就丟例外（由 Service 轉成錯誤回應）
    public void changeStatus(OrderStatus next) {
        if (!status.canChangeTo(next)) {
            throw new IllegalStateException(status + " 不能改成 " + next);
        }
        this.status = next;
    }
}
