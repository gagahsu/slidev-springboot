package com.example.survey.controller;

import com.example.survey.dto.AuthDTO.*;
import com.example.survey.entity.RefreshToken;
import com.example.survey.exception.BizException;
import com.example.survey.repository.RefreshTokenRepository;
import com.example.survey.repository.UserRepository;
import com.example.survey.security.JwtUtil;
import com.example.survey.service.UserService;
import com.example.survey.vo.AppResponse;
import com.example.survey.vo.RspCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @PostMapping("/register")
    public AppResponse<UserInfo> register(@Valid @RequestBody RegisterRequest req) {
        return AppResponse.success(userService.register(req));
    }

    @PostMapping("/login")
    public AppResponse<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        try {
            // 帳號不存在、密碼錯誤都是 AuthenticationException，一律回同一個訊息
            authManager.authenticate(new UsernamePasswordAuthenticationToken(email, req.password()));
        } catch (org.springframework.security.core.AuthenticationException e) {
            throw new BizException(RspCode.LOGIN_FAILED);
        }
        String accessToken = jwtUtil.generateToken(email);
        String refreshToken = jwtUtil.generateRefreshToken(email);

        RefreshToken entity = new RefreshToken();
        entity.setEmail(email);
        entity.setToken(refreshToken);
        entity.setExpiryDate(Instant.now().plusSeconds(7 * 24 * 60 * 60)); // 7 天
        refreshTokenRepository.save(entity);

        return AppResponse.success(new LoginResponse(accessToken, refreshToken, userService.me(email)));
    }

    @PostMapping("/refresh")
    public AppResponse<LoginResponse> refresh(@Valid @RequestBody RefreshRequest req) {
        RefreshToken saved = refreshTokenRepository.findByToken(req.refreshToken())
                .orElseThrow(() -> new BizException(RspCode.INVALID_TOKEN));
        if (saved.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(saved); // 過期就順手清掉
            throw new BizException(RspCode.INVALID_TOKEN);
        }
        String newAccessToken = jwtUtil.generateToken(saved.getEmail());
        return AppResponse.success(new LoginResponse(newAccessToken, saved.getToken(), userService.me(saved.getEmail())));
    }

    @PostMapping("/logout")
    public AppResponse<Void> logout(@Valid @RequestBody RefreshRequest req) {
        refreshTokenRepository.findByToken(req.refreshToken())
                .ifPresent(refreshTokenRepository::delete); // 刪除 = 廢止
        return AppResponse.success();
    }
}
