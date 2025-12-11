package com.instagram.user.model.mapper;

import com.instagram.user.model.dto.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {
    // 사용자 생성
    void insertUser(User user);

    // 사용자 수정
    void updateUser(User user);

    // 사용자 삭제
    void deleteUser(User user);

    // id 를 이용한 사용자 조회
    User selectUserById(int userId);

    // 유저 명칭을 이용한 사용자 조회
    String selectUserByUserName(String userName);

    // email 을 이용한 사용자 조회
    User selectUserByUserEmail(String userEmail);

    // 비밀번호 확인
    User selectUserByPassword(String userPassword);

    // 모든 사용자 조회
    List<User> selectAllUsers();

    // TODO 1: 유저 이름으로 검색하는 메서드 선언
    // 힌트: LIKE 검색을 위해 @Param 사용, List<User> 반환
    // 메서드명: searchUsersByUserName
    List<User> searchUsersByUserName(String userName);

    // TODO 2: 유저네임으로 정확히 일치하는 유저 조회 메서드 선언
    // 힌트: WHERE user_name = ? 조건, User 반환 (단일 객체)
    // 메서드명: selectUserByUserNameExact
}
