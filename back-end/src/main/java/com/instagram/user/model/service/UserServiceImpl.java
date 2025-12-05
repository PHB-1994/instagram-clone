package com.instagram.user.model.service;

import com.instagram.user.model.dto.User;
import com.instagram.user.model.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void signUp(User user) {
        // 이미 존재하는 이메일인지 확인하기
        // 이미 존재하는 이메일이라면 throw new RunTimeException 이미 존재하는 이메일입니다. 처리
        // 비밀번호 암호화하여 저장
        // DB 에 저장할 유저를 encode 처리하여 저장
        userMapper.insertUser(user);
    }

    @Override
    public User login(String userEmail, String userPassword) {
        return null;
    }

    @Override
    public User getUserByEmail(String userEmail) {
        return null;
    }

    @Override
    public User getUserByUserName(String userName) {
        return null;
    }
}
