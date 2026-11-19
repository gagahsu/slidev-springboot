package com.example.cafe.exception;

import java.util.Map;

// 統一的錯誤回應：{ "message": "...", "fields": { "phone": "手機格式不正確" } }
public record ApiError(String message, Map<String, String> fields) {
}
