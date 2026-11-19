package com.example.shop.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.example.shop.common.AppResponse;
import com.example.shop.common.RspCode;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<AppResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return build(RspCode.PARAM_ERROR, message);
    }

    @ExceptionHandler({ HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class })
    public ResponseEntity<AppResponse<Void>> handleBadInput(Exception ex) {
        return build(RspCode.PARAM_ERROR, "資料格式不正確");
    }

    @ExceptionHandler(BizException.class)
    public ResponseEntity<AppResponse<Void>> handleBiz(BizException ex) {
        return build(ex.getRspCode(), ex.getMessage());
    }

    // 例如 SKU、分類名稱重複（UNIQUE）
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<AppResponse<Void>> handleDuplicate(DataIntegrityViolationException ex) {
        return build(RspCode.DUPLICATE_ERROR, "資料重複或不符合資料表的限制");
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<AppResponse<Void>> handleTooLarge(MaxUploadSizeExceededException ex) {
        return build(RspCode.PARAM_ERROR, "圖片不能超過 2 MB");
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<AppResponse<Void>> handleNoResource(NoResourceFoundException ex) {
        return build(RspCode.NOT_FOUND, RspCode.NOT_FOUND.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppResponse<Void>> handleOthers(Exception ex) {
        log.error("未預期的錯誤", ex);
        return build(RspCode.INTERNAL_SERVER_ERROR, RspCode.INTERNAL_SERVER_ERROR.getMessage());
    }

    private ResponseEntity<AppResponse<Void>> build(RspCode code, String message) {
        return ResponseEntity.status(code.getCode()).body(AppResponse.error(code, message));
    }
}
