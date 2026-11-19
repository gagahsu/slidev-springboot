package com.example.shop.vo;

import com.example.shop.entity.Category;

public record CategoryVO(Integer id, String name, Integer sortOrder) {

    public static CategoryVO of(Category c) {
        return new CategoryVO(c.getId(), c.getName(), c.getSortOrder());
    }
}
