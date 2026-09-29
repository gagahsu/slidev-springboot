package com.example.survey.vo;

/** 驗證失敗時，告訴前端「哪個欄位、什麼問題」 */
public record FieldErrorVO(String field, String message) {
}
