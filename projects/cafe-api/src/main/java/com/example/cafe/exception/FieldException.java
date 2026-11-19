package com.example.cafe.exception;

// 欄位格式正確、但違反店家規則時丟出（例如日期超過 30 天）
public class FieldException extends RuntimeException {

    private final String field;

    public FieldException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
