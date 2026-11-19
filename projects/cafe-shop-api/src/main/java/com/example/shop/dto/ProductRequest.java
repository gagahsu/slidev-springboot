package com.example.shop.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProductRequest(
        @NotNull(message = "請選擇分類") Integer categoryId,
        @NotBlank(message = "請輸入商品名稱") @Size(max = 50, message = "商品名稱最多 50 字") String name,
        @Size(max = 200, message = "說明最多 200 字") String description,
        String imageUrl,
        Integer sortOrder,
        @NotEmpty(message = "至少要有一個規格") List<@Valid VariantRequest> variants) {
}
