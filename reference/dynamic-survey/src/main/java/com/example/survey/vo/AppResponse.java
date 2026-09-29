package com.example.survey.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AppResponse<T> {
    private final String code;
    private final String message;
    private final T data;

    public static <T> AppResponse<T> success(T data) {
        return new AppResponse<>(RspCode.SUCCESS.name(), RspCode.SUCCESS.getMessage(), data);
    }

    public static AppResponse<Void> success() {
        return success(null);
    }

    public static AppResponse<Void> error(RspCode code) {
        return new AppResponse<>(code.name(), code.getMessage(), null);
    }

    public static AppResponse<Void> error(RspCode code, String message) {
        return new AppResponse<>(code.name(), message, null);
    }

    public static <T> AppResponse<T> error(RspCode code, String message, T data) {
        return new AppResponse<>(code.name(), message, data);
    }
}
