package com.example.shop.exception;

import com.example.shop.common.RspCode;

import lombok.Getter;

// 商業規則沒過時丟出，由 GlobalExceptionHandler 轉成 AppResponse
@Getter
public class BizException extends RuntimeException {

    private final RspCode rspCode;

    public BizException(RspCode rspCode) {
        super(rspCode.getMessage());
        this.rspCode = rspCode;
    }

    public BizException(RspCode rspCode, String message) {
        super(message);
        this.rspCode = rspCode;
    }
}
