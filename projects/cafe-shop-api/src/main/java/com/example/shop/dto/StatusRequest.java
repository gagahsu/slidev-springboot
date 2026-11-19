package com.example.shop.dto;

import jakarta.validation.constraints.NotBlank;

public record StatusRequest(@NotBlank(message = "請指定狀態") String status) {
}
