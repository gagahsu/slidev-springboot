package com.example.shop.service;

// 運費規則：滿 1,000 元免運，否則 80 元
public final class ShippingPolicy {

    public static final int FREE_THRESHOLD = 1000;
    public static final int FEE = 80;

    private ShippingPolicy() {
    }

    public static int fee(int itemsAmount) {
        return (itemsAmount == 0 || itemsAmount >= FREE_THRESHOLD) ? 0 : FEE;
    }

    public static int freeShippingGap(int itemsAmount) {
        return Math.max(FREE_THRESHOLD - itemsAmount, 0);
    }
}
