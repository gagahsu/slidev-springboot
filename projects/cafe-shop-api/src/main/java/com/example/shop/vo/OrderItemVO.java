package com.example.shop.vo;

import com.example.shop.entity.OrderItem;

public record OrderItemVO(Integer productId, Integer variantId, String productName, String variantName,
        Integer unitPrice, Integer quantity, Integer subtotal) {

    public static OrderItemVO of(OrderItem i) {
        return new OrderItemVO(i.getProductId(), i.getVariantId(), i.getProductName(), i.getVariantName(),
                i.getUnitPrice(), i.getQuantity(), i.getSubtotal());
    }
}
