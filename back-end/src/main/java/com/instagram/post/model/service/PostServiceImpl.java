package com.instagram.post.model.service;

import com.instagram.post.model.dto.Post;
import com.instagram.post.model.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService{

    private final PostMapper postMapper;

    @Override
    public List<Post> getAllPosts(int currentUserId) {
        return postMapper.selectAllPosts(currentUserId);
    }

    @Override
    public Post getPostById(int postId, int currentUserId) {
        return postMapper.selectPostById(postId, currentUserId);
    }

    @Override
    public boolean createPost(Post post) {
        // 게시물이 1개라도 등록되면 true 0 이하는 false
        // 파일 업로드 서비스 이용해서 게시물 이미지 데이터 저장처리
        return postMapper.insertPost(post) > 0;
    }

    @Override
    public boolean deletePost(int postId) {
        return postMapper.deletePost(postId) > 0;
    }

    @Override
    public List<Post> getPostsByUserId(int userId, int currentUserId) {
        return postMapper.selectPostsByUserId(userId, currentUserId);
    }

    @Override
    public boolean addLike(int postId, int userId) {
        return postMapper.insertLike(postId, userId) > 0;
    }

    @Override
    public boolean removeLike(int postId, int userId) {
        return postMapper.deleteLike(postId, userId) > 0;
    }
}
