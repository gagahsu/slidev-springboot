package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.common.AppResponse;
import com.example.shop.dto.LoginRequest;
import com.example.shop.dto.RegisterRequest;
import com.example.shop.service.AuthService;
import com.example.shop.vo.LoginVO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AppResponse<LoginVO> register(@Valid @RequestBody RegisterRequest req) {
        return AppResponse.success(authService.register(req));
    }

    @PostMapping("/login")
    public AppResponse<LoginVO> login(@Valid @RequestBody LoginRequest req) {
        return AppResponse.success(authService.login(req));
    }
}
