package com.instagram.post.controller;


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
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(@RequestHeader("Authorization") String authHeader){

        String token = authHeader.substring(7);
        int currentUSerId = jwtUtil.getUserIdFromToken(token);
        List<Post> posts = postService.getAllPosts(currentUSerId);
        return ResponseEntity.ok(posts);
    }

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
        int currentUserId = Integer.parseInt(authentication.getName());
        */
        String token = authHeader.substring(7); // 맨 앞 "Bearer "만 제거 하고 추출
        int currentUserId = jwtUtil.getUserIdFromToken(token); // token 에서 userId 추출
        boolean success = postService.createPost(postImage,postCaption,postLocation, currentUserId);
        // log 사용하여 token 과 currentUserId post 데이터 확인

        if(success) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }


    @GetMapping("/{userId}")
    public ResponseEntity<List<Post>> getAllPostsByUserId( @RequestHeader("Authorization") String authHeader,
                                                           @PathVariable int userId) {

        try {
            String token = authHeader.substring(7);
            int currentUserId = jwtUtil.getUserIdFromToken(token);

            List<Post> posts = postService.getPostsByUserId(userId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

    }

    @PostMapping("/{postId}/like")
    public boolean addLike(@PathVariable int postId,
                           @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            int currentUserId = jwtUtil.getUserIdFromToken(token);
            boolean result = postService.addLike(postId, currentUserId);
            return result;
        } catch (Exception e) {
            log.info("좋아요 증가 실패");
            return false;
        }
    }

    // 경로가 같으면 오류 발생할 수 있는지 ...? ================================================
    @DeleteMapping("/{postId}/like")
    public boolean removeLike(@PathVariable int postId,
                              @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            int currentUserId = jwtUtil.getUserIdFromToken(token);
            boolean result = postService.removeLike(postId, currentUserId);
            return result;
        } catch (Exception e) {
            log.info("좋아요 취소 실패");
            return false;
        }
    }
}