package com.instagram.story.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.post.model.dto.Post;
import com.instagram.post.model.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RequestMapping("/api/posts")
@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<String> createPost(@RequestPart MultipartFile postImage,
                                             @RequestPart String postCaption,
                                             @RequestPart String postLocation,
                                             @RequestHeader("Authorization") String authHeader) {

        // 현재 로그인한 사용자 id 가져오기
        // import org.springframework.security.core.Authentication;
        /*
        백엔드 인증 기반
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        int currentUserID = (int) authentication.getPrincipal();
        post.setUserId(currentUserID);
         */

        String token = authHeader.substring(7); // 맨 앞에 "bearer " 만 제거하고 추출 (스페이스바 포함)
        int currentUserId = jwtUtil.getUserIdFromToken(token); // token 에서 userId 추출
        boolean success = postService.createPost(postImage, postCaption, postLocation, currentUserId);

        // log 사용하여 토큰이랑 currentUserId post 데이터 확인

        if(success) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public List<Post> selectAllPosts(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        int currentUserId = jwtUtil.getUserIdFromToken(token);
        return postService.getAllPosts(currentUserId);
    }
}
