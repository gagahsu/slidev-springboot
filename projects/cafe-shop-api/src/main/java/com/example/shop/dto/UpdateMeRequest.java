package com.example.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// password 留空表示不改密碼
public record UpdateMeRequest(
        @NotBlank(message = "請輸入姓名") @Size(max = 20, message = "姓名最多 20 字") String name,
        @Pattern(regexp = "09\\d{8}", message = "手機格式不正確") String phone,
        @Size(max = 50, message = "密碼最多 50 碼") String password) {
}
