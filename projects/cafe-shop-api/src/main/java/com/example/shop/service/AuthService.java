package com.example.shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.shop.common.RspCode;
import com.example.shop.dto.LoginRequest;
import com.example.shop.dto.RegisterRequest;
import com.example.shop.entity.User;
import com.example.shop.exception.BizException;
import com.example.shop.repository.UserRepository;
import com.example.shop.security.JwtUtil;
import com.example.shop.vo.LoginVO;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Lazy
    private PasswordEncoder encoder;

    @Autowired
    @Lazy
    private JwtUtil jwtUtil;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("找不到帳號：" + email));
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }

    // 前台註冊的帳號一律是 USER；管理員由 Flyway 的 V2__seed.sql 預先建立
    public LoginVO register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new BizException(RspCode.DUPLICATE_ERROR, "這個 Email 已經註冊過了");
        }
        User user = new User();
        user.setName(req.name().trim());
        user.setEmail(req.email().trim().toLowerCase());
        user.setPassword(encoder.encode(req.password()));
        user.setPhone(req.phone());
        user.setRole("USER");
        userRepository.save(user);
        return toLoginVO(user);
    }

    public LoginVO login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email().trim().toLowerCase()).orElse(null);
        if (user == null || !encoder.matches(req.password(), user.getPassword())) {
            throw new BizException(RspCode.UNAUTHORIZED, "帳號或密碼錯誤");
        }
        return toLoginVO(user);
    }

    private LoginVO toLoginVO(User user) {
        return new LoginVO(jwtUtil.generateToken(user.getEmail()), user.getName(), user.getRole());
    }
}
