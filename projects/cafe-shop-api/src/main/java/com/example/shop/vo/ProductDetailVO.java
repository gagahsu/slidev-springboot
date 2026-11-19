package com.example.shop.vo;

import java.util.List;

import com.example.shop.entity.Product;

public record ProductDetailVO(Integer id, Integer categoryId, String categoryName, String name,
        String description, Integer price, String imageUrl, String status, Integer sortOrder,
        List<VariantVO> variants) {

    public static ProductDetailVO of(Product p) {
        return new ProductDetailVO(p.getId(), p.getCategory().getId(), p.getCategory().getName(), p.getName(),
                p.getDescription(), p.getPrice(), p.getImageUrl(), p.getStatus().name(), p.getSortOrder(),
                p.getVariants().stream().map(VariantVO::of).toList());
    }
}
