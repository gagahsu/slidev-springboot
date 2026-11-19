package com.example.shop.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.shop.common.AppResponse;
import com.example.shop.common.PageResponse;
import com.example.shop.dto.CategoryRequest;
import com.example.shop.dto.ProductRequest;
import com.example.shop.dto.StatusRequest;
import com.example.shop.service.CategoryService;
import com.example.shop.service.ProductService;
import com.example.shop.service.UploadService;
import com.example.shop.vo.CategoryVO;
import com.example.shop.vo.ProductDetailVO;
import com.example.shop.vo.ProductListVO;
import com.example.shop.vo.UploadVO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UploadService uploadService;

    @GetMapping("/products")
    public AppResponse<PageResponse<ProductListVO>> list(
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "categoryId", required = false) Integer categoryId,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size) {
        return AppResponse.success(productService.adminSearch(status, categoryId, keyword, page, size));
    }

    @GetMapping("/products/{id}")
    public AppResponse<ProductDetailVO> detail(@PathVariable("id") Integer id) {
        return AppResponse.success(productService.adminDetail(id));
    }

    @PostMapping("/products")
    public AppResponse<ProductDetailVO> create(@Valid @RequestBody ProductRequest req) {
        return AppResponse.success(productService.create(req));
    }

    @PutMapping("/products/{id}")
    public AppResponse<ProductDetailVO> update(@PathVariable("id") Integer id, @Valid @RequestBody ProductRequest req) {
        return AppResponse.success(productService.update(id, req));
    }

    @PatchMapping("/products/{id}/status")
    public AppResponse<ProductDetailVO> status(@PathVariable("id") Integer id, @Valid @RequestBody StatusRequest req) {
        return AppResponse.success(productService.changeStatus(id, req.status()));
    }

    @PostMapping("/uploads")
    public AppResponse<UploadVO> upload(@RequestPart("file") MultipartFile file) {
        return AppResponse.success(uploadService.save(file));
    }

    @GetMapping("/categories")
    public AppResponse<List<CategoryVO>> categories() {
        return AppResponse.success(categoryService.list());
    }

    @PostMapping("/categories")
    public AppResponse<CategoryVO> createCategory(@Valid @RequestBody CategoryRequest req) {
        return AppResponse.success(categoryService.create(req));
    }

    @PutMapping("/categories/{id}")
    public AppResponse<CategoryVO> updateCategory(@PathVariable("id") Integer id, @Valid @RequestBody CategoryRequest req) {
        return AppResponse.success(categoryService.update(id, req));
    }
}
