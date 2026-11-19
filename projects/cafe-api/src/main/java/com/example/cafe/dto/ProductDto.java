package com.example.cafe.dto;

public record ProductDto(Integer id, Integer categoryId, String name, String description,
        Integer price, String imageUrl) {
}
