package com.example.shop.vo;

import com.example.shop.entity.Product;
import com.example.shop.entity.ProductVariant;

// 列表用：price 是起始價；soldOut = 所有規格都沒庫存
public record ProductListVO(Integer id, Integer categoryId, String categoryName, String name,
        String description, Integer price, String imageUrl, String status, boolean soldOut) {

    public static ProductListVO of(Product p) {
        boolean soldOut = p.getVariants().stream().mapToInt(ProductVariant::getStock).sum() == 0;
        return new ProductListVO(p.getId(), p.getCategory().getId(), p.getCategory().getName(), p.getName(),
                p.getDescription(), p.getPrice(), p.getImageUrl(), p.getStatus().name(), soldOut);
    }
}
