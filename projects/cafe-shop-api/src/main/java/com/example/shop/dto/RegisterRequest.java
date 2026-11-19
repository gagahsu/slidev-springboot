package com.example.shop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "請輸入姓名") @Size(max = 20, message = "姓名最多 20 字") String name,
        @NotBlank(message = "請輸入 Email") @Email(message = "Email 格式不正確") String email,
        @NotBlank(message = "請輸入密碼") @Size(min = 8, max = 50, message = "密碼至少 8 碼") String password,
        @Pattern(regexp = "09\\d{8}", message = "手機格式不正確") String phone) {
}
