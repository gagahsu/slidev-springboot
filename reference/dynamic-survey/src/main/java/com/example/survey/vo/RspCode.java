package com.example.survey.vo;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum RspCode {
    SUCCESS(HttpStatus.OK, "成功"),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "資料格式錯誤"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "請先登入"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "沒有權限"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "找不到資料"),
    SURVEY_NOT_EDITABLE(HttpStatus.CONFLICT, "問卷已開始，無法修改或刪除"),
    SURVEY_NOT_OPEN(HttpStatus.CONFLICT, "問卷不在填寫期間"),
    SURVEY_NO_STATISTICS(HttpStatus.CONFLICT, "問卷尚未開始，沒有統計資料"),
    ALREADY_RESPONDED(HttpStatus.CONFLICT, "此 Email 已經填寫過這份問卷"),
    NO_DRAFT(HttpStatus.CONFLICT, "沒有暫存的資料，請重新填寫"),
    EMAIL_EXISTS(HttpStatus.CONFLICT, "此 Email 已經註冊"),
    LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "帳號或密碼錯誤"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "Token 無效或已過期"),
    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "系統發生錯誤");

    private final HttpStatus status;
    private final String message;

    RspCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
