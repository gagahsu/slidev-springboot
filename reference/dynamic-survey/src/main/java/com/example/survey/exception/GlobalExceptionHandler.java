package com.example.survey.exception;

import com.example.survey.vo.AppResponse;
import com.example.survey.vo.FieldErrorVO;
import com.example.survey.vo.RspCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BizException.class)
    public ResponseEntity<AppResponse<Void>> handleBiz(BizException e) {
        return ResponseEntity.status(e.getCode().getStatus())
                .body(AppResponse.error(e.getCode(), e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AppResponse<List<FieldErrorVO>>> handleValid(MethodArgumentNotValidException e) {
        List<FieldErrorVO> errors = e.getBindingResult().getFieldErrors().stream()
                .map(f -> new FieldErrorVO(f.getField(), f.getDefaultMessage()))
                .toList();
        // message 只放訊息本身（前端直接跳提醒視窗）；data 保留欄位名稱，方便標紅欄位
        String message = errors.stream().map(FieldErrorVO::message).collect(Collectors.joining("；"));
        return ResponseEntity.badRequest().body(AppResponse.error(RspCode.VALIDATION_ERROR, message, errors));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<AppResponse<Void>> handleUnreadable(HttpMessageNotReadableException e) {
        return ResponseEntity.badRequest().body(AppResponse.error(RspCode.VALIDATION_ERROR, "請求內容格式錯誤"));
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<AppResponse<Void>> handleNoResource(NoResourceFoundException e) {
        return ResponseEntity.status(RspCode.NOT_FOUND.getStatus()).body(AppResponse.error(RspCode.NOT_FOUND));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<AppResponse<Void>> handleDenied(AccessDeniedException e) {
        return ResponseEntity.status(RspCode.FORBIDDEN.getStatus()).body(AppResponse.error(RspCode.FORBIDDEN));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse<Void>> handleOther(Exception e) {
        log.error("未預期的錯誤：{}", e.getMessage(), e);   // ERROR：最後一個參數傳 e，才會印出完整 stack trace
        return ResponseEntity.status(RspCode.SERVER_ERROR.getStatus()).body(AppResponse.error(RspCode.SERVER_ERROR));
    }
}
