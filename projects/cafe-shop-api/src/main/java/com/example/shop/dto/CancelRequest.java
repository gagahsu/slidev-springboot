package com.example.shop.dto;

import jakarta.validation.constraints.Size;

public record CancelRequest(@Size(max = 100, message = "原因最多 100 字") String reason) {
}
