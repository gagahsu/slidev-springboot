package com.example.cafe.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// 訂位表單送來的資料（規則見 specs/CAFE-SPEC.md §5）
public record ReservationRequest(
        @NotBlank(message = "請輸入姓名")
        @Size(max = 20, message = "姓名最多 20 字")
        String name,

        @NotBlank(message = "請輸入手機")
        @Pattern(regexp = "09\\d{8}", message = "手機格式不正確")
        String phone,

        @Email(message = "Email 格式不正確")
        @Size(max = 100, message = "Email 最多 100 字")
        String email,

        @NotNull(message = "請選擇日期")
        LocalDate reserveDate,

        @NotNull(message = "請選擇營業時段")
        LocalTime reserveTime,

        @NotNull(message = "請輸入人數")
        @Min(value = 1, message = "至少 1 位")
        @Max(value = 8, message = "一次最多預約 8 位")
        Integer people,

        @Size(max = 200, message = "備註最多 200 字")
        String note) {
}
