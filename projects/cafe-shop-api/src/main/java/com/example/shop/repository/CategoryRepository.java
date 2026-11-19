package com.example.shop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shop.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findAllByOrderBySortOrder();
}
