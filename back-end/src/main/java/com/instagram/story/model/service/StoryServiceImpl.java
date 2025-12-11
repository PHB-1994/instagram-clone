package com.instagram.story.model.service;

import com.instagram.common.util.FileUploadService;
import com.instagram.story.model.dto.Story;
import com.instagram.story.model.mapper.StoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoryServiceImpl implements StoryService{

    private final StoryMapper storyMapper;
    private final FileUploadService fileUploadService;

    @Override
    public Story createStory(int userId, MultipartFile storyImage) throws IOException {
        log.info("스토리 생성 시작 - 사용자 ID : {}", userId);

        Story story = new Story();
        story.setUserId(userId);
        story.setStoryImage("storyImage - 서버 컴퓨터에 저장된 경로 스토리 파일");

        storyMapper.insertStory(story);
        log.info("임시 스토리 생성 완료 - 스토리 ID : {}", story.getUserId());
        String saveImagePath = fileUploadService.uploadStoryImage(storyImage, story.getStoryId(), "story");
        log.info("서버 스토리 이미지 업로드 완료 - 스토리 ID : {}", saveImagePath);
        story.setStoryImage(saveImagePath);

        storyMapper.updateStoryImage(story.getStoryId(), saveImagePath);

        return story; // 결과가 null 인지 들어있는지 확인
    }

    @Override
    public List<Story> getAllStories() {
        log.info("모든 활성 스토리 조회");
        List<Story> stories = storyMapper.selectAllStories();
        log.info("조회된 스토리 개수 : {}", stories.size());
        return stories;
    }

    @Override
    public List<Story> getStoriesByUserId(int userId) {
        log.info("특정 사용자 스토리 조회 - 사용자 ID : {}", userId);
        List<Story> story = storyMapper.selectStoriesByUserId(userId);
        log.info("story : {}", story);
        return story;
    }

    @Override
    public void deleteExpiredStories(int storyId) {

    }

    @Override
    public void deleteStory(int storyId) {
        log.info("스토리 삭제 시작 - 스토리 ID : {}", storyId);

        try{
            // 1. 서버에서 이미지를 삭제할 수 있도록 storyId 에 해당하는 데이터를 조회
            Story story = storyMapper.selectStoryById(storyId);

            if(story == null) {
                log.warn("스토리를 찾을 수 없습니다. - 스토리 ID : {}", storyId);
//                return false; -> boolean 적용되게끔?
            }

            // 서버에서 이미지 파일 삭제
            if(story.getStoryImage() != null && !story.getStoryImage().isEmpty()) {
                boolean fileDeleted = fileUploadService.deleteFile(story.getStoryImage());
                if(!fileDeleted) {
                    log.warn("스토리 이미지 파일 삭제 실패 : {}", story.getStoryImage());
                } else {
                    log.info("스토리 이미지 파일 삭제 완료 : {}", story.getStoryImage());
                }
            }

            storyMapper.deleteStory(storyId);
            log.info("스토리 DB 삭제 완료 - 스토리 ID : {}", storyId);

        } catch (Exception e){
            log.error("스토리 삭제 중 오류 발생 : {}", e.getMessage());
            throw new RuntimeException("스토리 삭제 실패",e);
        }
    }
}
