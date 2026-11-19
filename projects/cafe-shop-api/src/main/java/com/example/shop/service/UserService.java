package com.example.shop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.shop.common.PageResponse;
import com.example.shop.common.RspCode;
import com.example.shop.dto.UpdateMeRequest;
import com.example.shop.entity.User;
import com.example.shop.exception.BizException;
import com.example.shop.repository.UserRepository;
import com.example.shop.vo.UserVO;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    // 由 JWT 裡的 email 找到目前登入的會員
    public User current(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BizException(RspCode.UNAUTHORIZED));
    }

    public UserVO me(String email) {
        return UserVO.of(current(email));
    }

    public UserVO updateMe(String email, UpdateMeRequest req) {
        User user = current(email);
        user.setName(req.name().trim());
        user.setPhone(req.phone());
        if (req.password() != null && !req.password().isBlank()) {
            if (req.password().length() < 8) {
                throw new BizException(RspCode.PARAM_ERROR, "密碼至少 8 碼");
            }
            user.setPassword(encoder.encode(req.password()));
        }
        return UserVO.of(userRepository.save(user));
    }

    // 後台：會員列表（唯讀）
    public PageResponse<UserVO> list(int page, int size) {
        return PageResponse.of(userRepository.findAll(PageRequest.of(page, size, Sort.by("id"))), UserVO::of);
    }
}
