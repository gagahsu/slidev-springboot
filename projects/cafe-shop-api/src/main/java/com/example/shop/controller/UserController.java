package com.example.shop.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.shop.common.AppResponse;
import com.example.shop.dto.UpdateMeRequest;
import com.example.shop.service.UserService;
import com.example.shop.vo.UserVO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public AppResponse<UserVO> me(Authentication auth) {
        return AppResponse.success(userService.me(auth.getName()));
    }

    @PutMapping("/me")
    public AppResponse<UserVO> updateMe(@Valid @RequestBody UpdateMeRequest req, Authentication auth) {
        return AppResponse.success(userService.updateMe(auth.getName(), req));
    }
}
