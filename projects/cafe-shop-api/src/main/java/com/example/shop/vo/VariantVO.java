package com.example.shop.vo;

import com.example.shop.entity.ProductVariant;

public record VariantVO(Integer id, String name, String sku, Integer price, Integer stock) {

    public static VariantVO of(ProductVariant v) {
        return new VariantVO(v.getId(), v.getName(), v.getSku(), v.getPrice(), v.getStock());
    }
}
