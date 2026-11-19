package com.example.shop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shop.entity.Product;
import com.example.shop.entity.ProductStatus;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    // 條件是 null 就不篩選；排序和分頁由 Pageable 決定
    @Query("""
            SELECT p FROM Product p
            WHERE (:status IS NULL OR p.status = :status)
              AND (:categoryId IS NULL OR p.category.id = :categoryId)
              AND (:keyword IS NULL OR p.name LIKE CONCAT('%', :keyword, '%'))
            """)
    Page<Product> search(@Param("status") ProductStatus status,
                         @Param("categoryId") Integer categoryId,
                         @Param("keyword") String keyword,
                         Pageable pageable);
}
