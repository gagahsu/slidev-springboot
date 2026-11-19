package com.example.shop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.common.RspCode;
import com.example.shop.dto.CartItemRequest;
import com.example.shop.entity.CartItem;
import com.example.shop.entity.ProductStatus;
import com.example.shop.entity.ProductVariant;
import com.example.shop.exception.BizException;
import com.example.shop.repository.CartItemRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.vo.CartItemVO;
import com.example.shop.vo.CartVO;

@Service
public class CartService {

    public static final int MAX_QUANTITY = 10;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private UserService userService;

    @Transactional(readOnly = true)
    public CartVO get(String email) {
        return toVO(cartItemRepository.findByUserIdOrderById(userService.current(email).getId()));
    }

    // 加入購物車：同一個規格數量相加
    @Transactional
    public CartVO add(String email, CartItemRequest req) {
        Integer userId = userService.current(email).getId();
        ProductVariant v = findSellable(req.variantId());
        CartItem item = cartItemRepository.findByUserIdAndVariantId(userId, v.getId()).orElse(null);
        int quantity = req.quantity() + (item == null ? 0 : item.getQuantity());
        checkQuantity(v, quantity);
        if (item == null) {
            item = new CartItem();
            item.setUserId(userId);
            item.setVariant(v);
        }
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return get(email);
    }

    @Transactional
    public CartVO update(String email, Integer variantId, int quantity) {
        Integer userId = userService.current(email).getId();
        CartItem item = cartItemRepository.findByUserIdAndVariantId(userId, variantId)
                .orElseThrow(() -> new BizException(RspCode.NOT_FOUND, "購物車裡沒有這個商品"));
        checkQuantity(item.getVariant(), quantity);
        item.setQuantity(quantity);
        return get(email);
    }

    @Transactional
    public CartVO remove(String email, Integer variantId) {
        Integer userId = userService.current(email).getId();
        cartItemRepository.findByUserIdAndVariantId(userId, variantId).ifPresent(cartItemRepository::delete);
        return get(email);
    }

    // 登入後把瀏覽器的購物車合併進來：數量相加，超過上限或庫存就調到最多能買的數量，賣不了的略過
    @Transactional
    public CartVO merge(String email, List<CartItemRequest> items) {
        Integer userId = userService.current(email).getId();
        for (CartItemRequest req : items == null ? List.<CartItemRequest>of() : items) {
            if (req == null || req.variantId() == null || req.quantity() == null || req.quantity() < 1) {
                continue;
            }
            ProductVariant v = variantRepository.findById(req.variantId()).orElse(null);
            if (v == null || v.getProduct().getStatus() != ProductStatus.ON_SALE || v.getStock() == 0) {
                continue;
            }
            CartItem item = cartItemRepository.findByUserIdAndVariantId(userId, v.getId()).orElse(null);
            int quantity = req.quantity() + (item == null ? 0 : item.getQuantity());
            quantity = Math.min(quantity, Math.min(MAX_QUANTITY, v.getStock()));
            if (item == null) {
                item = new CartItem();
                item.setUserId(userId);
                item.setVariant(v);
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return get(email);
    }

    private ProductVariant findSellable(Integer variantId) {
        ProductVariant v = variantRepository.findById(variantId)
                .orElseThrow(() -> new BizException(RspCode.NOT_FOUND, "找不到這個規格"));
        if (v.getProduct().getStatus() != ProductStatus.ON_SALE) {
            throw new BizException(RspCode.PARAM_ERROR, "這個商品已下架");
        }
        return v;
    }

    private void checkQuantity(ProductVariant v, int quantity) {
        if (quantity > MAX_QUANTITY) {
            throw new BizException(RspCode.PARAM_ERROR, "每個規格最多 " + MAX_QUANTITY + " 件");
        }
        if (quantity > v.getStock()) {
            throw new BizException(RspCode.STOCK_NOT_ENOUGH, "庫存不足，剩 " + v.getStock() + " 件");
        }
    }

    private CartVO toVO(List<CartItem> items) {
        List<CartItemVO> list = items.stream().map(i -> {
            ProductVariant v = i.getVariant();
            return new CartItemVO(v.getId(), v.getProduct().getId(), v.getProduct().getName(), v.getName(),
                    v.getProduct().getImageUrl(), v.getPrice(), v.getStock(), i.getQuantity(),
                    v.getPrice() * i.getQuantity());
        }).toList();
        int itemsAmount = list.stream().mapToInt(CartItemVO::subtotal).sum();
        int fee = ShippingPolicy.fee(itemsAmount);
        return new CartVO(list, itemsAmount, fee, itemsAmount + fee, ShippingPolicy.freeShippingGap(itemsAmount));
    }
}
