package com.instagram.user.model.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 클라이언트가 로그인할 때 보내는 데이터
 */
// 로그인 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    private String userEmail;
    private String userPassword;
}
