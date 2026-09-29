package com.example.survey.exception;

import com.example.survey.vo.RspCode;
import lombok.Getter;

@Getter
public class BizException extends RuntimeException {
    private final RspCode code;

    public BizException(RspCode code) {
        super(code.getMessage());
        this.code = code;
    }

    public BizException(RspCode code, String message) {
        super(message);
        this.code = code;
    }
}
