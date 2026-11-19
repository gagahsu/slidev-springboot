package com.example.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(
        @NotBlank(message = "請輸入分類名稱") @Size(max = 20, message = "分類名稱最多 20 字") String name,
        Integer sortOrder) {
}
