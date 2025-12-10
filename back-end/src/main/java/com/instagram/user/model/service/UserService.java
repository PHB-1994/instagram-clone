package com.instagram.user.model.service;

import com.instagram.user.model.dto.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserService {

    // 회원가입
    void signup(User user);

    // 로그인
    User login(String userEmail, String userPassword);

    User getUserByEmail(String userEmail);
    User getUserByUserName(String userName);
    User getUserById(int userId);

    User updateUser(User user, MultipartFile file) throws IOException;

}
