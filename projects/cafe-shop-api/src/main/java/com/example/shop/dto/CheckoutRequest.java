package com.example.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// 結帳只收收件資料；金額一律由後端用資料庫的價格重算
public record CheckoutRequest(
        @NotBlank(message = "請輸入收件人姓名") @Size(max = 20, message = "姓名最多 20 字") String receiverName,
        @NotBlank(message = "請輸入收件人手機") @Pattern(regexp = "09\\d{8}", message = "手機格式不正確") String receiverPhone,
        @NotBlank(message = "請輸入收件地址") @Size(max = 200, message = "地址最多 200 字") String receiverAddress,
        @Size(max = 200, message = "備註最多 200 字") String note) {
}
