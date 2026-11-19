package com.example.shop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.shop.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByMerchantTradeNo(String merchantTradeNo);

    List<Payment> findByOrderIdOrderById(Integer orderId);
}
