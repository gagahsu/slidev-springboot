package com.example.cafe.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cafe.dto.CategoryDto;
import com.example.cafe.dto.ProductDto;
import com.example.cafe.entity.Product;
import com.example.cafe.exception.NotFoundException;
import com.example.cafe.repository.CategoryRepository;
import com.example.cafe.repository.ProductRepository;

@Service
public class MenuService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<CategoryDto> getCategories() {
        return categoryRepository.findAllByOrderBySortOrder().stream()
                .map(c -> new CategoryDto(c.getId(), c.getName(), c.getSortOrder()))
                .toList();
    }

    // categoryId 是 null：全部分類；有值：只查那個分類
    public List<ProductDto> getProducts(Integer categoryId) {
        List<Product> products;
        if (categoryId == null) {
            products = productRepository.findByAvailableTrueOrderByCategoryIdAscSortOrderAsc();
        } else {
            if (!categoryRepository.existsById(categoryId)) {
                throw new NotFoundException("找不到這個分類");
            }
            products = productRepository.findByCategoryIdAndAvailableTrueOrderBySortOrder(categoryId);
        }
        return products.stream().map(this::toDto).toList();
    }

    private ProductDto toDto(Product p) {
        return new ProductDto(p.getId(), p.getCategoryId(), p.getName(), p.getDescription(),
                p.getPrice(), p.getImageUrl());
    }
}
