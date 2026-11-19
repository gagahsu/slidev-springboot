package com.example.shop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shop.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    List<CartItem> findByUserIdOrderById(Integer userId);

    Optional<CartItem> findByUserIdAndVariantId(Integer userId, Integer variantId);

    void deleteByUserId(Integer userId);
}
