package com.example.shop.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.common.PageResponse;
import com.example.shop.common.RspCode;
import com.example.shop.dto.ProductRequest;
import com.example.shop.dto.VariantRequest;
import com.example.shop.entity.Category;
import com.example.shop.entity.Product;
import com.example.shop.entity.ProductStatus;
import com.example.shop.entity.ProductVariant;
import com.example.shop.exception.BizException;
import com.example.shop.repository.CategoryRepository;
import com.example.shop.repository.ProductRepository;
import com.example.shop.vo.ProductDetailVO;
import com.example.shop.vo.ProductListVO;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // ===== 前台 =====

    @Transactional(readOnly = true)
    public PageResponse<ProductListVO> search(Integer categoryId, String keyword, String sort, int page, int size) {
        return PageResponse.of(productRepository.search(ProductStatus.ON_SALE, categoryId, blankToNull(keyword),
                pageable(sort, page, size)), ProductListVO::of);
    }

    // 前台只看得到上架中的商品
    @Transactional(readOnly = true)
    public ProductDetailVO detail(Integer id) {
        Product p = find(id);
        if (p.getStatus() != ProductStatus.ON_SALE) {
            throw new BizException(RspCode.NOT_FOUND, "找不到這個商品");
        }
        return ProductDetailVO.of(p);
    }

    // ===== 後台 =====

    @Transactional(readOnly = true)
    public PageResponse<ProductListVO> adminSearch(String status, Integer categoryId, String keyword, int page, int size) {
        ProductStatus s = (status == null || status.isBlank()) ? null : parseStatus(status);
        return PageResponse.of(productRepository.search(s, categoryId, blankToNull(keyword),
                pageable(null, page, size)), ProductListVO::of);
    }

    @Transactional(readOnly = true)
    public ProductDetailVO adminDetail(Integer id) {
        return ProductDetailVO.of(find(id));
    }

    @Transactional
    public ProductDetailVO create(ProductRequest req) {
        Product p = new Product();
        p.setStatus(ProductStatus.ON_SALE);
        p.setAvailable(true);
        apply(p, req);
        return ProductDetailVO.of(productRepository.save(p));
    }

    @Transactional
    public ProductDetailVO update(Integer id, ProductRequest req) {
        Product p = find(id);
        apply(p, req);
        return ProductDetailVO.of(productRepository.saveAndFlush(p));
    }

    // 上架 / 下架：不真的刪除商品，訂單才追溯得到
    @Transactional
    public ProductDetailVO changeStatus(Integer id, String status) {
        Product p = find(id);
        p.setStatus(parseStatus(status));
        p.setAvailable(p.getStatus() == ProductStatus.ON_SALE);
        return ProductDetailVO.of(p);
    }

    // 把表單內容套到商品上，規格依 id 比對：有 id 改、沒 id 新增、清單裡沒有的刪除
    private void apply(Product p, ProductRequest req) {
        Category category = categoryRepository.findById(req.categoryId())
                .orElseThrow(() -> new BizException(RspCode.PARAM_ERROR, "分類不存在"));
        Set<String> skus = new HashSet<>();
        for (VariantRequest v : req.variants()) {
            if (!skus.add(v.sku().trim())) {
                throw new BizException(RspCode.PARAM_ERROR, "SKU 重複：" + v.sku());
            }
        }
        p.setCategory(category);
        p.setName(req.name().trim());
        p.setDescription(req.description());
        p.setImageUrl(req.imageUrl());
        p.setSortOrder(req.sortOrder() == null ? 0 : req.sortOrder());

        Map<Integer, ProductVariant> existing = p.getVariants().stream()
                .collect(Collectors.toMap(ProductVariant::getId, Function.identity()));
        List<ProductVariant> result = new ArrayList<>();
        int order = 1;
        for (VariantRequest vr : req.variants()) {
            ProductVariant v;
            if (vr.id() == null) {
                v = new ProductVariant();
                v.setProduct(p);
            } else {
                v = existing.get(vr.id());
                if (v == null) {
                    throw new BizException(RspCode.PARAM_ERROR, "規格不屬於這個商品：" + vr.id());
                }
            }
            v.setName(vr.name().trim());
            v.setSku(vr.sku().trim());
            v.setPrice(vr.price());
            v.setStock(vr.stock());
            v.setSortOrder(order++);
            result.add(v);
        }
        p.getVariants().clear();          // orphanRemoval：不在清單裡的規格會被刪除
        p.getVariants().addAll(result);
        // 列表顯示的起始價 = 最便宜的規格
        p.setPrice(result.stream().mapToInt(ProductVariant::getPrice).min().orElse(0));
    }

    private Product find(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new BizException(RspCode.NOT_FOUND, "找不到這個商品"));
    }

    private ProductStatus parseStatus(String status) {
        try {
            return ProductStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new BizException(RspCode.PARAM_ERROR, "狀態只能是 ON_SALE 或 OFF_SHELF");
        }
    }

    // sort：price,asc / price,desc / createdAt,desc；其他值用預設排序
    private Pageable pageable(String sort, int page, int size) {
        Sort s = switch (sort == null ? "" : sort) {
            case "price,asc" -> Sort.by("price").ascending();
            case "price,desc" -> Sort.by("price").descending();
            case "createdAt,desc" -> Sort.by("createdAt").descending();
            default -> Sort.by("sortOrder").ascending();
        };
        return PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 50), s.and(Sort.by("id")));
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
