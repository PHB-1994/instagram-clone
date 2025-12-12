package com.instagram.user.controller;

import com.instagram.user.model.dto.User;
import com.instagram.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserSearchController {

    private final UserService userService;

    // TODO 9: 유저 검색 API
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("q") String query) {
        try {
            List<User> u = userService.searchUser(query);
            return ResponseEntity.ok(u); // 200 header ~ body
        } catch (Exception e) {
            log.error("유저 검색 실패 : {}", e.getMessage());
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }

    // TODO 10: 유저네임으로 조회 API
    @GetMapping("/username/{userName}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String userName) {
        try{
            User u = userService.getUserByUserName(userName);
            if (u == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(u);
        } catch(Exception e){
            log.error("유저 조회 실패 : {}", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}