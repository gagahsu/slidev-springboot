package com.example.shop.entity;

// 訂單狀態（specs/SHOP-SPEC.md §5）：只能照順序往前走
public enum OrderStatus {
    PENDING_PAYMENT("待付款"),
    PAID("已付款"),
    SHIPPED("已出貨"),
    COMPLETED("已完成"),
    CANCELLED("已取消");

    private final String label;

    OrderStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public boolean canChangeTo(OrderStatus next) {
        return switch (this) {
            case PENDING_PAYMENT -> next == PAID || next == CANCELLED;
            case PAID -> next == SHIPPED || next == CANCELLED;
            case SHIPPED -> next == COMPLETED;
            case COMPLETED, CANCELLED -> false;
        };
    }
}
