package com.instagram.user.model.service;

import com.instagram.common.util.FileUploadService;
import com.instagram.user.model.dto.User;
import com.instagram.user.model.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final FileUploadService fileUploadService;

    @Override
    public void signup(User user) {
        // 이미 존재하는 이메일인지 확인하기
        // 이미 존재하는 이메일이라면 throw new RunTimeException 이미 존재하는 이메일입니다. 처리
        User existingEmail = userMapper.selectUserByUserEmail(user.getUserEmail());
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
        User user = userMapper.selectUserByUserEmail(userEmail);

        if(user == null){
            log.warn("로그인 실패 - 존재하지 않는 이메일 : {}",  userEmail);
            return null;
        }

        // 비밀번호 검증
        if(!passwordEncoder.matches(userPassword, user.getUserPassword())){
            log.warn("로그인 실패 - 잘못된 비밀번호 : {}", userEmail);
            return null;
        }

        // 비밀번호는 응답에서 제거
        user.setUserPassword(null);
        log.info("로그인 성공 - 이메일 {}", userEmail);

        return user;
    }

    @Override
    public User getUserByEmail(String userEmail) {
        return null;
    }

    @Override
    public User getUserByUserName(String userName) {
        return null;
    }

    @Override
    public User getUserById(int userId) {
        return userMapper.selectUserById(userId);
    }

    @Override
    @Transactional
    public User updateUser(User user, MultipartFile file) {

        User existingUser = userMapper.selectUserById(user.getUserId());
        if(existingUser == null){
            throw new RuntimeException("사용자 정보를 찾을 수 없습니다.");
        }

        if(file != null &&  !file.isEmpty()) {
            try{
                String newAvatarPath = fileUploadService.uploadProfileImage(file);
                existingUser.setUserAvatar(newAvatarPath);
            }catch (Exception e){
                log.error("프로필 이미지 수정 중 오류 발생 : {}", e);
                throw new RuntimeException("이미지 업로드 실패");
            }
        }

        if(user.getUserName() != null) existingUser.setUserName(user.getUserName());
        if(user.getUserEmail() != null) existingUser.setUserEmail(user.getUserEmail());
        if(user.getUserPassword() != null) existingUser.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        if(user.getUserFullname() != null) existingUser.setUserFullname(user.getUserFullname());

        // 5. DB 업데이트 작업
        userMapper.updateUser(existingUser);

        existingUser.setUserPassword(null);
        return existingUser;
    }
}
