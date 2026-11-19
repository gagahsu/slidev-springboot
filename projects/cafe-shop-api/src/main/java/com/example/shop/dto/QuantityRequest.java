package com.example.shop.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record QuantityRequest(
        @NotNull(message = "請輸入數量") @Min(value = 1, message = "數量至少 1")
        @Max(value = 10, message = "每個規格最多 10 件") Integer quantity) {
}
