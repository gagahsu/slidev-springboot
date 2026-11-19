package com.example.cafe.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cafe.dto.CategoryDto;
import com.example.cafe.dto.ProductDto;
import com.example.cafe.service.MenuService;

@RestController
@RequestMapping("/api")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/categories")
    public List<CategoryDto> getCategories() {
        return menuService.getCategories();
    }

    @GetMapping("/products")
    public List<ProductDto> getProducts(@RequestParam(name = "categoryId", required = false) Integer categoryId) {
        return menuService.getProducts(categoryId);
    }
}
