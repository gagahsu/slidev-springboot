package com.example.shop.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategorySalesVO {
    private Integer categoryId;
    private String categoryName;
    private Integer quantity;
    private Integer revenue;
}
