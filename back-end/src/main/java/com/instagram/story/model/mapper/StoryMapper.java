package com.instagram.story.model.mapper;

import com.instagram.story.model.dto.Story;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StoryMapper {

    // 스토리 저장
    void insertStory(Story story);

    void updateStoryImage(int storyId, String storyImage);

    // 스토리 전체 조회
    List<Story> selectAllStories();

    // 특정 스토리 조회
    Story selectStoryById(int storyId);

    // 스토리 삭제 (보관처리)
    void deleteStory(int storyId);

    // 스토리 사용자 조회
    List<Story> selectStoriesByUserId(int userId);
    // 만료된 스토리 void updateStory(Story story);

}
