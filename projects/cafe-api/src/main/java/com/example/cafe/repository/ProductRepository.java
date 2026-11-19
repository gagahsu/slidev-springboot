package com.example.cafe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cafe.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    // 供應中的品項，依排序欄位
    List<Product> findByAvailableTrueOrderByCategoryIdAscSortOrderAsc();

    // 某個分類裡供應中的品項
    List<Product> findByCategoryIdAndAvailableTrueOrderBySortOrder(Integer categoryId);
}
