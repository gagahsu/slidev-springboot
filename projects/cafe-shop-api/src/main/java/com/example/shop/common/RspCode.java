package com.example.shop.common;

import lombok.Getter;

// 統一的狀態碼：code 同時也是 HTTP 狀態碼
@Getter
public enum RspCode {
    SUCCESS(200, "操作成功"),
    PARAM_ERROR(400, "參數錯誤"),
    UNAUTHORIZED(401, "尚未登入或憑證無效"),
    FORBIDDEN(403, "權限不足"),
    NOT_FOUND(404, "資源不存在"),
    DUPLICATE_ERROR(409, "資料重複"),
    STOCK_NOT_ENOUGH(409, "庫存不足"),
    ORDER_STATUS_ERROR(409, "訂單狀態不允許這個操作"),
    INTERNAL_SERVER_ERROR(500, "系統內部錯誤");

    private final int code;
    private final String message;

    RspCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
