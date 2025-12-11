package com.instagram.story.model.service;

import com.instagram.story.model.dto.Story;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface StoryService {

    Story createStory(int userId, MultipartFile storyImage) throws IOException;

    List<Story> getAllStories();

    List<Story> getStoriesByUserId(int userId);

    void deleteExpiredStories(int storyId);

    void deleteStory(int storyId);
}
