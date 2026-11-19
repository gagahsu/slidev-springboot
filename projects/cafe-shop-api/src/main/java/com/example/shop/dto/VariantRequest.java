package com.example.shop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// id 是 null：新增的規格；有值：修改既有的規格
public record VariantRequest(
        Integer id,
        @NotBlank(message = "請輸入規格名稱") @Size(max = 30, message = "規格名稱最多 30 字") String name,
        @NotBlank(message = "請輸入 SKU") @Size(max = 30, message = "SKU 最多 30 字") String sku,
        @NotNull(message = "請輸入價格") @Min(value = 0, message = "價格不能是負的") Integer price,
        @NotNull(message = "請輸入庫存") @Min(value = 0, message = "庫存不能是負的") Integer stock) {
}
