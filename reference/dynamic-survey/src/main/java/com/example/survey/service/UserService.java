package com.example.survey.service;

import com.example.survey.dto.AuthDTO.*;
import com.example.survey.entity.User;
import com.example.survey.exception.BizException;
import com.example.survey.repository.UserRepository;
import com.example.survey.vo.RspCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserInfo register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BizException(RspCode.EMAIL_EXISTS);
        }
        User u = new User();
        u.setName(req.name().trim());
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(req.password())); // 只存 BCrypt 雜湊
        u.setPhone(req.phone());
        u.setRole("USER");                                      // 註冊一律是一般會員，不開放自己指定角色
        return toInfo(userRepository.save(u));
    }

    @Transactional(readOnly = true)
    public UserInfo me(String email) {
        return toInfo(find(email));
    }

    @Transactional
    public UserInfo updateProfile(String email, UpdateProfileRequest req) {
        User u = find(email);
        u.setName(req.name().trim());
        u.setPhone(req.phone());
        return toInfo(u); // 交易結束時 JPA 自動 UPDATE
    }

    private User find(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
    }

    public UserInfo toInfo(User u) {
        return new UserInfo(u.getId(), u.getName(), u.getEmail(), u.getPhone(), u.getRole());
    }
}
