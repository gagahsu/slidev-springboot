package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.common.AppResponse;
import com.example.shop.dto.CartItemRequest;
import com.example.shop.dto.CartMergeRequest;
import com.example.shop.dto.QuantityRequest;
import com.example.shop.service.CartService;
import com.example.shop.vo.CartVO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public AppResponse<CartVO> get(Authentication auth) {
        return AppResponse.success(cartService.get(auth.getName()));
    }

    @PostMapping("/items")
    public AppResponse<CartVO> add(@Valid @RequestBody CartItemRequest req, Authentication auth) {
        return AppResponse.success(cartService.add(auth.getName(), req));
    }

    @PutMapping("/items/{variantId}")
    public AppResponse<CartVO> update(@PathVariable("variantId") Integer variantId,
            @Valid @RequestBody QuantityRequest req, Authentication auth) {
        return AppResponse.success(cartService.update(auth.getName(), variantId, req.quantity()));
    }

    @DeleteMapping("/items/{variantId}")
    public AppResponse<CartVO> remove(@PathVariable("variantId") Integer variantId, Authentication auth) {
        return AppResponse.success(cartService.remove(auth.getName(), variantId));
    }

    @PostMapping("/merge")
    public AppResponse<CartVO> merge(@RequestBody CartMergeRequest req, Authentication auth) {
        return AppResponse.success(cartService.merge(auth.getName(), req.items()));
    }
}
