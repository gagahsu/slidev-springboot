package com.example.shop.vo;

import java.time.LocalDateTime;

import com.example.shop.entity.User;

// 沒有密碼欄位
public record UserVO(Integer id, String name, String email, String phone, String role, LocalDateTime createdAt) {

    public static UserVO of(User u) {
        return new UserVO(u.getId(), u.getName(), u.getEmail(), u.getPhone(), u.getRole(), u.getCreatedAt());
    }
}
