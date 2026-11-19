package com.example.shop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.shop.common.RspCode;
import com.example.shop.dto.CategoryRequest;
import com.example.shop.entity.Category;
import com.example.shop.exception.BizException;
import com.example.shop.repository.CategoryRepository;
import com.example.shop.vo.CategoryVO;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // 分類很少變動、每一頁都要用：放進快取（ch45）
    @Cacheable("categories")
    public List<CategoryVO> list() {
        return categoryRepository.findAllByOrderBySortOrder().stream().map(CategoryVO::of).toList();
    }

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryVO create(CategoryRequest req) {
        Category c = new Category();
        c.setName(req.name().trim());
        c.setSortOrder(req.sortOrder() == null ? 0 : req.sortOrder());
        return CategoryVO.of(categoryRepository.save(c));
    }

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryVO update(Integer id, CategoryRequest req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new BizException(RspCode.NOT_FOUND, "找不到這個分類"));
        c.setName(req.name().trim());
        if (req.sortOrder() != null) {
            c.setSortOrder(req.sortOrder());
        }
        return CategoryVO.of(categoryRepository.save(c));
    }
}
