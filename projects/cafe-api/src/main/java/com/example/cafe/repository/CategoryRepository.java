package com.example.cafe.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cafe.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findAllByOrderBySortOrder();
}
