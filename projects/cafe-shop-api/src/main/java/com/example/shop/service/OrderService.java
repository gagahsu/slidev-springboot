package com.example.shop.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.common.RspCode;
import com.example.shop.dto.CheckoutRequest;
import com.example.shop.entity.CartItem;
import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.OrderStatus;
import com.example.shop.entity.ProductStatus;
import com.example.shop.entity.ProductVariant;
import com.example.shop.entity.User;
import com.example.shop.exception.BizException;
import com.example.shop.repository.CartItemRepository;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.vo.OrderDetailVO;
import com.example.shop.vo.OrderSummaryVO;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    public static final int PAYMENT_TIMEOUT_MINUTES = 30;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private UserService userService;

    // 下單時從購物車抄下來的一行（先抄好，再開始扣庫存）
    private record Line(Integer productId, Integer variantId, String productName, String variantName,
            int unitPrice, int quantity, boolean onSale) {
    }

    // 建立訂單：扣庫存、算金額、存快照、清空購物車，全部在同一個交易裡（ch33）
    @Transactional
    public OrderDetailVO create(String email, CheckoutRequest req) {
        User user = userService.current(email);
        List<CartItem> cart = cartItemRepository.findByUserIdOrderById(user.getId());
        if (cart.isEmpty()) {
            throw new BizException(RspCode.PARAM_ERROR, "購物車是空的");
        }
        List<Line> lines = cart.stream().map(c -> {
            ProductVariant v = c.getVariant();
            return new Line(v.getProduct().getId(), v.getId(), v.getProduct().getName(), v.getName(),
                    v.getPrice(), c.getQuantity(), v.getProduct().getStatus() == ProductStatus.ON_SALE);
        }).toList();

        Order order = new Order();
        order.setOrderNo(newOrderNo());
        order.setUserId(user.getId());
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setReceiverName(req.receiverName().trim());
        order.setReceiverPhone(req.receiverPhone());
        order.setReceiverAddress(req.receiverAddress().trim());
        order.setNote(req.note() == null || req.note().isBlank() ? null : req.note().trim());
        order.setCreatedAt(LocalDateTime.now());

        int itemsAmount = 0;
        for (Line line : lines) {
            if (!line.onSale()) {
                throw new BizException(RspCode.PARAM_ERROR, line.productName() + " 已下架，請從購物車移除");
            }
            // 防超賣：庫存夠才扣得下去；扣不下去就丟例外，前面扣過的也會一起復原（rollback）
            if (variantRepository.decreaseStock(line.variantId(), line.quantity()) == 0) {
                throw new BizException(RspCode.STOCK_NOT_ENOUGH,
                        line.productName() + " " + line.variantName() + " 庫存不足");
            }
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(line.productId());
            item.setVariantId(line.variantId());
            item.setProductName(line.productName());     // 快照：之後商品改名、改價都不影響這張訂單
            item.setVariantName(line.variantName());
            item.setUnitPrice(line.unitPrice());
            item.setQuantity(line.quantity());
            item.setSubtotal(line.unitPrice() * line.quantity());
            order.getItems().add(item);
            itemsAmount += item.getSubtotal();
        }
        // 金額一律由後端用資料庫的價格計算
        int fee = ShippingPolicy.fee(itemsAmount);
        order.setItemsAmount(itemsAmount);
        order.setShippingFee(fee);
        order.setTotalAmount(itemsAmount + fee);
        orderRepository.save(order);
        cartItemRepository.deleteByUserId(user.getId());
        log.info("建立訂單 {}，金額 {}", order.getOrderNo(), order.getTotalAmount());
        return OrderDetailVO.of(order, null, null);
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryVO> myOrders(String email) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userService.current(email).getId())
                .stream().map(OrderSummaryVO::of).toList();
    }

    @Transactional(readOnly = true)
    public OrderDetailVO myOrder(String email, String orderNo) {
        return OrderDetailVO.of(findOwn(email, orderNo), null, null);
    }

    // 客人取消：只有待付款可以
    @Transactional
    public OrderDetailVO cancelByCustomer(String email, String orderNo) {
        Order order = findOwn(email, orderNo);
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BizException(RspCode.ORDER_STATUS_ERROR, "只有待付款的訂單可以取消");
        }
        cancel(order, "客人取消");
        return OrderDetailVO.of(order, null, null);
    }

    // 排程呼叫：待付款超過 30 分鐘就取消並回補庫存
    @Transactional
    public int cancelExpired() {
        LocalDateTime deadline = LocalDateTime.now().minusMinutes(PAYMENT_TIMEOUT_MINUTES);
        List<Order> expired = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING_PAYMENT, deadline);
        expired.forEach(o -> cancel(o, "付款逾時，系統自動取消"));
        return expired.size();
    }

    // 只能查自己的訂單；別人的訂單一律當作不存在
    public Order findOwn(String email, String orderNo) {
        Order order = find(orderNo);
        if (!order.getUserId().equals(userService.current(email).getId())) {
            throw new BizException(RspCode.NOT_FOUND, "找不到這張訂單");
        }
        return order;
    }

    public Order findById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new BizException(RspCode.NOT_FOUND, "找不到這張訂單"));
    }

    public Order find(String orderNo) {
        return orderRepository.findByOrderNo(orderNo)
                .orElseThrow(() -> new BizException(RspCode.NOT_FOUND, "找不到這張訂單"));
    }

    // 取消訂單並把庫存加回去（呼叫的人要在交易裡）
    public void cancel(Order order, String reason) {
        changeStatus(order, OrderStatus.CANCELLED);
        order.setCancelledAt(LocalDateTime.now());
        order.setCancelReason(reason);
        for (OrderItem item : order.getItems()) {
            variantRepository.increaseStock(item.getVariantId(), item.getQuantity());
        }
        log.info("取消訂單 {}：{}", order.getOrderNo(), reason);
    }

    public void changeStatus(Order order, OrderStatus next) {
        try {
            order.changeStatus(next);
        } catch (IllegalStateException e) {
            throw new BizException(RspCode.ORDER_STATUS_ERROR,
                    order.getStatus().getLabel() + "的訂單不能改成" + next.getLabel());
        }
    }

    private String newOrderNo() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        return "CS" + date + String.format("%06d", ThreadLocalRandom.current().nextInt(1_000_000));
    }
}
