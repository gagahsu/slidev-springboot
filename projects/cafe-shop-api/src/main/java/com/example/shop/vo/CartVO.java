package com.example.shop.vo;

import java.util.List;

// freeShippingGap：再買多少元免運（已免運是 0）
public record CartVO(List<CartItemVO> items, int itemsAmount, int shippingFee, int totalAmount,
        int freeShippingGap) {
}
