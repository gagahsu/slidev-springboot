package com.example.shop.dto;

import java.util.List;

// 登入前存在瀏覽器的購物車：[{ variantId, quantity }]
public record CartMergeRequest(List<CartItemRequest> items) {
}
