package com.example.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shop.entity.ProductVariant;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {

    // 防超賣：庫存夠才扣，回傳影響筆數（0 = 庫存不夠）
    @Modifying
    @Query("UPDATE ProductVariant v SET v.stock = v.stock - :qty WHERE v.id = :id AND v.stock >= :qty")
    int decreaseStock(@Param("id") Integer id, @Param("qty") int qty);

    // 取消訂單：把庫存加回去
    @Modifying
    @Query("UPDATE ProductVariant v SET v.stock = v.stock + :qty WHERE v.id = :id")
    int increaseStock(@Param("id") Integer id, @Param("qty") int qty);
}
