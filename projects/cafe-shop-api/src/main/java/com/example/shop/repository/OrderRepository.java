package com.example.shop.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shop.entity.Order;
import com.example.shop.entity.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    Optional<Order> findByOrderNo(String orderNo);

    List<Order> findByUserIdOrderByCreatedAtDesc(Integer userId);

    // 逾時取消用：某個狀態、而且建立時間早於某個時間點
    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, LocalDateTime time);

    @Query("""
            SELECT o FROM Order o
            WHERE (:status IS NULL OR o.status = :status)
              AND (:from IS NULL OR o.createdAt >= :from)
              AND (:to IS NULL OR o.createdAt < :to)
              AND (:orderNo IS NULL OR o.orderNo = :orderNo)
            """)
    Page<Order> search(@Param("status") OrderStatus status,
                       @Param("from") LocalDateTime from,
                       @Param("to") LocalDateTime to,
                       @Param("orderNo") String orderNo,
                       Pageable pageable);
}
