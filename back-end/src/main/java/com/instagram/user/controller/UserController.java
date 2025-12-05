package com.instagram.user.controller;

import com.instagram.user.model.dto.User;
import com.instagram.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public void signup(@RequestBody User user) {
        userService.signup(user);
    }

//    @PostMapping("/login")
//    public User login(String userEmail, String userPassword) {
//        // 사용자 인증 이메일, 비밀번호
//
//        return userService.login(userEmail, userPassword);
//    }

    @PostMapping("/login")
    public void login(User user) {
        // 사용자 인증 이메일, 비밀번호
        if(user == null) {
            // 401 전달
        }

        // 로그인 성공 JWT 토큰을 생성

        // 토큰 발급에 대한 응답 데이터 생성
    }
}
