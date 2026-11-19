package com.example.shop.vo;

import java.util.Map;

// 前端用隱藏表單把 fields POST 到 action（綠界付款頁）
public record EcpayFormVO(String action, Map<String, String> fields) {
}
