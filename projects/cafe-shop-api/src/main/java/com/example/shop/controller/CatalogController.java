package com.example.shop.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.common.AppResponse;
import com.example.shop.common.PageResponse;
import com.example.shop.service.CategoryService;
import com.example.shop.service.ProductService;
import com.example.shop.vo.CategoryVO;
import com.example.shop.vo.ProductDetailVO;
import com.example.shop.vo.ProductListVO;

// 前台：分類與商品（公開）
@RestController
@RequestMapping("/api")
public class CatalogController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductService productService;

    @GetMapping("/categories")
    public AppResponse<List<CategoryVO>> categories() {
        return AppResponse.success(categoryService.list());
    }

    @GetMapping("/products")
    public AppResponse<PageResponse<ProductListVO>> products(
            @RequestParam(name = "categoryId", required = false) Integer categoryId,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "sort", required = false) String sort,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "12") int size) {
        return AppResponse.success(productService.search(categoryId, keyword, sort, page, size));
    }

    @GetMapping("/products/{id}")
    public AppResponse<ProductDetailVO> product(@PathVariable("id") Integer id) {
        return AppResponse.success(productService.detail(id));
    }
}
