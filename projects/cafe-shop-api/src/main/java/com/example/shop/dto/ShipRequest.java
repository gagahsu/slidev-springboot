package com.example.shop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ShipRequest(
        @NotBlank(message = "請輸入物流單號") @Size(max = 30, message = "物流單號最多 30 字") String trackingNo) {
}
