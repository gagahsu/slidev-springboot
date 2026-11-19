package com.example.shop.common;

// 統一回應：{ "code": 200, "message": "操作成功", "data": ... }
public record AppResponse<T>(int code, String message, T data) {

    public static <T> AppResponse<T> success(T data) {
        return new AppResponse<>(RspCode.SUCCESS.getCode(), RspCode.SUCCESS.getMessage(), data);
    }

    public static <T> AppResponse<T> error(RspCode rspCode, String message) {
        return new AppResponse<>(rspCode.getCode(), message, null);
    }
}
