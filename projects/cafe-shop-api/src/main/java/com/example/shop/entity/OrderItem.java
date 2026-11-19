package com.example.shop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

// 訂單明細：商品名稱、規格名稱、單價都是「下單當時」的快照
@Entity
@Table(name = "order_items")
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "variant_id")
    private Integer variantId;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "variant_name")
    private String variantName;

    @Column(name = "unit_price")
    private Integer unitPrice;

    private Integer quantity;
    private Integer subtotal;
}
