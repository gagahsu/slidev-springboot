package com.example.shop.service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import com.example.shop.common.RspCode;
import com.example.shop.entity.Order;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.OrderStatus;
import com.example.shop.entity.Payment;
import com.example.shop.exception.BizException;
import com.example.shop.payment.EcpayCheckMac;
import com.example.shop.payment.EcpayProperties;
import com.example.shop.repository.PaymentRepository;
import com.example.shop.vo.EcpayFormVO;
import com.example.shop.vo.EcpayQueryVO;
import com.example.shop.vo.OrderDetailVO;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    private static final DateTimeFormatter ECPAY_TIME = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
    public static final String OK = "1|OK";

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private EcpayProperties ecpay;

    // ===== 模擬付款（只在 dev profile 開放，見 MockPaymentController）=====

    @Transactional
    public OrderDetailVO mockPay(String email, String orderNo) {
        Order order = orderService.findOwn(email, orderNo);
        checkPayable(order);
        Payment p = newPayment(order, "MOCK");
        markPaid(p, null, LocalDateTime.now()); // 模擬付款沒有綠界的交易編號
        return OrderDetailVO.of(order, null, null);
    }

    // ===== 綠界：產生付款表單 =====

    @Transactional
    public EcpayFormVO createEcpayForm(String email, String orderNo) {
        Order order = orderService.findOwn(email, orderNo);
        checkPayable(order);
        Payment p = newPayment(order, "ECPAY"); // 每次付款都用新的 MerchantTradeNo（綠界規定不能重複）

        Map<String, String> fields = new LinkedHashMap<>();
        fields.put("MerchantID", ecpay.merchantId());
        fields.put("MerchantTradeNo", p.getMerchantTradeNo());
        fields.put("MerchantTradeDate", p.getCreatedAt().format(ECPAY_TIME));
        fields.put("PaymentType", "aio");
        fields.put("TotalAmount", String.valueOf(order.getTotalAmount()));
        fields.put("TradeDesc", "轉角咖啡線上商店");
        fields.put("ItemName", itemName(order.getItems()));
        fields.put("ReturnURL", ecpay.returnUrl());
        fields.put("OrderResultURL", ecpay.orderResultUrl());
        fields.put("ChoosePayment", "Credit");
        fields.put("EncryptType", "1");
        fields.put("CheckMacValue", EcpayCheckMac.compute(fields, ecpay.hashKey(), ecpay.hashIv()));
        return new EcpayFormVO(ecpay.paymentUrl(), fields);
    }

    // ===== 綠界：付款結果通知（ReturnURL，綠界的伺服器呼叫）=====

    @Transactional
    public String handleNotify(Map<String, String> params) {
        String raw = params.entrySet().stream().map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining("&"));
        // 1. 驗證檢查碼：不相符就不處理（可能是假的通知，或被竄改過）
        if (!EcpayCheckMac.verify(params, ecpay.hashKey(), ecpay.hashIv())) {
            log.warn("綠界通知檢查碼不符：{}", raw);
            return "0|CheckMacValue Error";
        }
        // 2. 找到這次付款
        Payment p = paymentRepository.findByMerchantTradeNo(params.get("MerchantTradeNo")).orElse(null);
        if (p == null) {
            log.warn("綠界通知找不到付款紀錄：{}", raw);
            return "0|Payment Not Found";
        }
        p.setRawNotify(raw);
        // 3. 防重複：已經處理過就直接回 1|OK（綠界沒收到 1|OK 會重送）
        if (Payment.PAID.equals(p.getStatus())) {
            return OK;
        }
        // 4. 核對金額
        if (!String.valueOf(p.getAmount()).equals(params.get("TradeAmt"))) {
            log.warn("綠界通知金額不符：{} 應為 {}", params.get("TradeAmt"), p.getAmount());
            p.setRtnMsg("金額不符：" + params.get("TradeAmt"));
            return "0|Amount Error";
        }
        p.setRtnCode(params.get("RtnCode"));
        p.setRtnMsg(params.get("RtnMsg"));
        p.setTradeNo(params.get("TradeNo"));
        p.setPaymentType(params.get("PaymentType"));
        // 5. 模擬通知（從綠界廠商後台按的）：沒有真的付款，只記錄
        if ("1".equals(params.get("SimulatePaid"))) {
            p.setSimulatePaid(true);
            log.info("收到綠界模擬付款通知 {}（不改訂單狀態）", p.getMerchantTradeNo());
            return OK;
        }
        // 6. RtnCode = 1 才是付款成功
        if (!"1".equals(params.get("RtnCode"))) {
            p.setStatus(Payment.FAILED);
            log.info("綠界付款失敗 {}：{}", p.getMerchantTradeNo(), params.get("RtnMsg"));
            return OK;
        }
        p.setSimulatePaid(false);
        markPaid(p, params.get("TradeNo"), parseTime(params.get("PaymentDate")));
        return OK;
    }

    // ===== 綠界：付款完成後瀏覽器回來（OrderResultURL）→ 找出訂單編號，讓 Controller 轉址 =====

    @Transactional(readOnly = true)
    public String orderNoOf(String merchantTradeNo) {
        if (merchantTradeNo == null) {
            return null;
        }
        return paymentRepository.findByMerchantTradeNo(merchantTradeNo)
                .map(p -> orderService.findById(p.getOrderId()).getOrderNo())
                .orElse(null);
    }

    // ===== 後台：向綠界查詢（收不到通知時補救）=====

    @Transactional
    public EcpayQueryVO query(String orderNo) {
        Order order = orderService.find(orderNo);
        List<Payment> payments = paymentRepository.findByOrderIdOrderById(order.getId()).stream()
                .filter(p -> "ECPAY".equals(p.getProvider())).toList();
        if (payments.isEmpty()) {
            throw new BizException(RspCode.NOT_FOUND, "這張訂單沒有綠界付款紀錄");
        }
        Payment p = payments.get(payments.size() - 1);

        Map<String, String> params = new LinkedHashMap<>();
        params.put("MerchantID", ecpay.merchantId());
        params.put("MerchantTradeNo", p.getMerchantTradeNo());
        params.put("TimeStamp", String.valueOf(Instant.now().getEpochSecond())); // 3 分鐘內有效
        params.put("CheckMacValue", EcpayCheckMac.compute(params, ecpay.hashKey(), ecpay.hashIv()));
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        params.forEach(form::add);

        String body;
        try {
            body = RestClient.create().post().uri(ecpay.queryUrl())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form).retrieve().body(String.class);
        } catch (Exception e) {
            throw new BizException(RspCode.INTERNAL_SERVER_ERROR, "連不上綠界：" + e.getMessage());
        }
        Map<String, String> result = parseQueryString(body);
        if (!EcpayCheckMac.verify(result, ecpay.hashKey(), ecpay.hashIv())) {
            throw new BizException(RspCode.INTERNAL_SERVER_ERROR, "綠界回應的檢查碼不符");
        }
        String tradeStatus = result.get("TradeStatus");
        String message = switch (tradeStatus == null ? "" : tradeStatus) {
            case "1" -> "已付款";
            case "0" -> "未付款";
            default -> "付款失敗或其他狀態（" + tradeStatus + "）";
        };
        if ("1".equals(tradeStatus) && !Payment.PAID.equals(p.getStatus())
                && String.valueOf(p.getAmount()).equals(result.get("TradeAmt"))) {
            p.setTradeNo(result.get("TradeNo"));
            p.setPaymentType(result.get("PaymentType"));
            p.setRtnCode("1");
            p.setRtnMsg("向綠界查詢補登");
            markPaid(p, result.get("TradeNo"), parseTime(result.get("PaymentDate")));
            message += "，已補更新訂單";
        }
        return new EcpayQueryVO(p.getMerchantTradeNo(), tradeStatus, message, order.getStatus().name());
    }

    // 付款成功：付款紀錄與訂單一起更新
    private void markPaid(Payment p, String tradeNo, LocalDateTime paidAt) {
        p.setStatus(Payment.PAID);
        p.setTradeNo(tradeNo);
        p.setPaidAt(paidAt);
        Order order = orderService.findById(p.getOrderId());
        if (order.getStatus() == OrderStatus.PENDING_PAYMENT) {
            order.changeStatus(OrderStatus.PAID);
            order.setPaidAt(paidAt);
            log.info("訂單 {} 付款成功", order.getOrderNo());
        } else {
            // 例如訂單已逾時取消，付款才到：不自動復原，交給後台人工處理
            log.warn("訂單 {} 狀態是 {}，但收到付款 {}，請人工處理", order.getOrderNo(), order.getStatus(),
                    p.getMerchantTradeNo());
        }
    }

    private void checkPayable(Order order) {
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BizException(RspCode.ORDER_STATUS_ERROR, "這張訂單是" + order.getStatus().getLabel() + "，不能付款");
        }
    }

    private Payment newPayment(Order order, String provider) {
        Payment p = new Payment();
        p.setOrderId(order.getId());
        p.setProvider(provider);
        p.setMerchantTradeNo(newMerchantTradeNo());
        p.setAmount(order.getTotalAmount());
        p.setStatus(Payment.PENDING);
        p.setCreatedAt(LocalDateTime.now().withNano(0));
        return paymentRepository.save(p);
    }

    // CS + yyMMddHHmmss + 4 碼亂數 = 18 碼（綠界限制 20 碼內、只能英數字）
    private String newMerchantTradeNo() {
        return "CS" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"))
                + String.format("%04d", ThreadLocalRandom.current().nextInt(10_000));
    }

    // 品項用 # 串接；超過 400 字會被綠界截斷，改成「第一項 等 N 項」
    static String itemName(List<OrderItem> items) {
        String joined = items.stream()
                .map(i -> i.getProductName() + " " + i.getVariantName() + " x" + i.getQuantity())
                .collect(Collectors.joining("#"));
        if (joined.length() <= 400) {
            return joined;
        }
        return items.get(0).getProductName() + " 等 " + items.size() + " 項";
    }

    private static LocalDateTime parseTime(String s) {
        try {
            return s == null ? LocalDateTime.now() : LocalDateTime.parse(s, ECPAY_TIME);
        } catch (DateTimeParseException e) {
            return LocalDateTime.now();
        }
    }

    private static Map<String, String> parseQueryString(String body) {
        Map<String, String> map = new LinkedHashMap<>();
        if (body == null) {
            return map;
        }
        for (String pair : body.trim().split("&")) {
            int i = pair.indexOf('=');
            if (i > 0) {
                map.put(pair.substring(0, i), URLDecoder.decode(pair.substring(i + 1), StandardCharsets.UTF_8));
            }
        }
        return map;
    }
}
