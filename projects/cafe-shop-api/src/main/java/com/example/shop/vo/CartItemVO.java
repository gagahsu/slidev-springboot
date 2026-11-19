package com.example.shop.vo;

public record CartItemVO(Integer variantId, Integer productId, String productName, String variantName,
        String imageUrl, Integer price, Integer stock, Integer quantity, Integer subtotal) {
}
