package com.example.survey.controller;

import com.example.survey.dto.AuthDTO.*;
import com.example.survey.dto.ResponseDTO;
import com.example.survey.service.ResponseService;
import com.example.survey.service.UserService;
import com.example.survey.vo.AppResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ResponseService responseService;

    @GetMapping("/me")
    public AppResponse<UserInfo> me(@AuthenticationPrincipal UserDetails user) {
        return AppResponse.success(userService.me(user.getUsername()));
    }

    @PutMapping("/me")
    public AppResponse<UserInfo> update(@AuthenticationPrincipal UserDetails user,
                                        @Valid @RequestBody UpdateProfileRequest req) {
        return AppResponse.success(userService.updateProfile(user.getUsername(), req));
    }

    @GetMapping("/me/responses")
    public AppResponse<List<ResponseDTO>> myResponses(@AuthenticationPrincipal UserDetails user) {
        return AppResponse.success(responseService.mine(user.getUsername()));
    }
}
