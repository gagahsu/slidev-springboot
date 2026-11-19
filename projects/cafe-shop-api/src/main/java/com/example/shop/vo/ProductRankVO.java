package com.example.shop.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductRankVO {
    private Integer productId;
    private String productName;
    private Integer quantity;
    private Integer revenue;
}
