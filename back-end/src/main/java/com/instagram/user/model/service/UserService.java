package com.instagram.user.model.service;

import com.instagram.user.model.dto.User;

public interface UserService {

    void signup(User user);
    User login(String userEmail, String userPassword);
    User getUserByEmail(String userEmail);
    User getUserByUserName(String userName);
}
