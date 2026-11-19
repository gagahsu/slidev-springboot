package com.example.shop.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.common.PageResponse;
import com.example.shop.common.RspCode;
import com.example.shop.entity.Order;
import com.example.shop.entity.OrderStatus;
import com.example.shop.entity.Payment;
import com.example.shop.exception.BizException;
import com.example.shop.repository.OrderRepository;
import com.example.shop.repository.PaymentRepository;
import com.example.shop.vo.OrderDetailVO;
import com.example.shop.vo.OrderSummaryVO;
import com.example.shop.vo.PaymentVO;

@Service
public class AdminOrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderService orderService;

    @Transactional(readOnly = true)
    public PageResponse<OrderSummaryVO> search(String status, LocalDate from, LocalDate to, String orderNo,
            int page, int size) {
        OrderStatus s = null;
        if (status != null && !status.isBlank()) {
            try {
                s = OrderStatus.valueOf(status);
            } catch (IllegalArgumentException e) {
                throw new BizException(RspCode.PARAM_ERROR, "沒有這個訂單狀態：" + status);
            }
        }
        LocalDateTime fromTime = from == null ? null : from.atStartOfDay();
        LocalDateTime toTime = to == null ? null : to.plusDays(1).atStartOfDay(); // to 當天也算
        String no = (orderNo == null || orderNo.isBlank()) ? null : orderNo.trim();
        return PageResponse.of(orderRepository.search(s, fromTime, toTime, no,
                PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                        Sort.by("createdAt").descending())), OrderSummaryVO::of);
    }

    @Transactional(readOnly = true)
    public OrderDetailVO detail(String orderNo) {
        return toDetail(orderService.find(orderNo));
    }

    // 出貨：已付款 → 已出貨
    @Transactional
    public OrderDetailVO ship(String orderNo, String trackingNo) {
        Order order = orderService.find(orderNo);
        orderService.changeStatus(order, OrderStatus.SHIPPED);
        order.setTrackingNo(trackingNo.trim());
        order.setShippedAt(LocalDateTime.now());
        return toDetail(order);
    }

    // 完成：已出貨 → 已完成
    @Transactional
    public OrderDetailVO complete(String orderNo) {
        Order order = orderService.find(orderNo);
        orderService.changeStatus(order, OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());
        return toDetail(order);
    }

    // 取消：待付款或已付款可以；已付款的要人工退款（這裡只標記）
    @Transactional
    public OrderDetailVO cancel(String orderNo, String reason) {
        Order order = orderService.find(orderNo);
        boolean paid = order.getStatus() == OrderStatus.PAID;
        String r = (reason == null || reason.isBlank()) ? "管理員取消" : reason.trim();
        orderService.cancel(order, paid ? r + "（已付款，需人工退款）" : r);
        return toDetail(order);
    }

    private OrderDetailVO toDetail(Order order) {
        List<Payment> payments = paymentRepository.findByOrderIdOrderById(order.getId());
        String warning = null;
        boolean anyPaid = payments.stream().anyMatch(p -> Payment.PAID.equals(p.getStatus()));
        if (order.getStatus() == OrderStatus.CANCELLED && anyPaid) {
            warning = "訂單已取消但收到付款，請人工處理（退款或恢復訂單）";
        }
        return OrderDetailVO.of(order, payments.stream().map(PaymentVO::of).toList(), warning);
    }
}
