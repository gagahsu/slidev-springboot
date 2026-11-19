package com.example.shop.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        @NotNull(message = "請選擇規格") Integer variantId,
        @NotNull(message = "請輸入數量") @Min(value = 1, message = "數量至少 1")
        @Max(value = 10, message = "每個規格最多 10 件") Integer quantity) {
}
