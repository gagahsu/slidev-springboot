package com.example.survey.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    public record RegisterRequest(
            @NotBlank(message = "請輸入姓名") String name,
            @NotBlank(message = "請輸入 Email") @Email(message = "Email 格式錯誤") String email,
            @NotBlank(message = "請輸入密碼") @Size(min = 8, max = 12, message = "密碼需 8 到 12 個字元") String password,
            @Pattern(regexp = "^09\\d{8}$", message = "手機格式錯誤（09 開頭，共 10 碼）") String phone) {
    }

    public record LoginRequest(
            @NotBlank(message = "請輸入 Email") String email,
            @NotBlank(message = "請輸入密碼") String password) {
    }

    public record RefreshRequest(@NotBlank String refreshToken) {
    }

    public record UserInfo(Integer id, String name, String email, String phone, String role) {
    }

    public record UpdateProfileRequest(
            @NotBlank(message = "請輸入姓名") String name,
            @Pattern(regexp = "^09\\d{8}$", message = "手機格式錯誤（09 開頭，共 10 碼）") String phone) {
    }

    public record LoginResponse(String accessToken, String refreshToken, UserInfo user) {
    }
}
