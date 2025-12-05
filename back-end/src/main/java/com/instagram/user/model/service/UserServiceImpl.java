package com.instagram.user.model.service;

import com.instagram.user.model.dto.User;
import com.instagram.user.model.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void signup(User user) {
        // 이미 존재하는 이메일인지 확인하기
        // 이미 존재하는 이메일이라면 throw new RunTimeException 이미 존재하는 이메일입니다. 처리
        String existingEmail = userMapper.selectUserByUserEmail(user.getUserEmail());
        if(existingEmail != null){
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        // 이미 존재하는 사용자명인지 확인
        String existingName = userMapper.selectUserByUserName(user.getUserName());
        if(existingName != null){
            throw new RuntimeException("이미 존재하는 사용자 이름입니다.");
        }

        // 비밀번호 암호화하여 저장
        // DB 에 저장할 유저를 encode 처리하여 저장
        // user 에서 비밀번호 자리에 저장하기 (암호화 처리한 기존 프론트엔드에서 클라이언트가 작성한 비밀번호)
        String encodePw = passwordEncoder.encode(user.getUserPassword());
        user.setUserPassword(encodePw);

        // 기본 아바타 설정. 유저가 아바타 설정을 안했을 때 기본 아바타 이미지로 설정
        if(user.getUserAvatar() == null || user.getUserAvatar().isEmpty()) {
            user.setUserAvatar("default-avatar.png");
        }

        userMapper.insertUser(user);
        log.info("회원가입 완료 - 이메일 {}, 사용자명 : {}", user.getUserEmail(), user.getUserName());
    }

    @Override
    public User login(String userEmail, String userPassword) {
        // 이메일로 사용자 조회
        User DBUserCheck = userMapper.selectUserByUserEmail(userEmail);

        if(DBUserCheck == null){
            log.warn("로그인 실패 - 존재하지 않는 이메일 : {}",  userEmail);
            return null;
        }

        // 비밀번호 검증
        if(!passwordEncoder.matches(userPassword, DBUserCheck.getUserPassword())){
            log.warn("로그인 실패 - 잘못된 비밀번호 : {}", userEmail);
            return null;
        }

        // 비밀번호는 응답에서 제거
        DBUserCheck.setUserPassword(null);
        log.info("로그인 성공 - 이메일 {}", userEmail);
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
