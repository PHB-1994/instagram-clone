package com.instagram.common.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {

    @Value("${file.profile.upload.path}")
    private String profileUploadPath;

    @Value("${file.story.upload.path}")
    private String storyUploadPath;

    @Value("${file.post.upload.path}")
    private String postUploadPath;

    public String uploadProfileImage(MultipartFile file) throws IOException {
        if(file.isEmpty()) {
            throw new IOException("업로드할 파일이 없습니다.");
        }

        File uploadDir = new File(profileUploadPath);
        if(!uploadDir.exists()){
            boolean created = uploadDir.mkdirs();
            if(!created){
                throw new IOException("업로드 디렉토리 생성에 실패했습니다." + profileUploadPath);
            }
            log.info("업로드 디렉토리 생성 : {}", profileUploadPath);
        }

        String clientUploadFileName = file.getOriginalFilename();
        if(clientUploadFileName == null || clientUploadFileName.isEmpty()){
            throw new IOException("파일 이름이 유효하지 않습니다.");
        }

        String extension = "";
        int lastDotIndex = clientUploadFileName.lastIndexOf('.');
        if(lastDotIndex > 0) {
            extension = clientUploadFileName.substring(lastDotIndex);
        }

        String reFileName = UUID.randomUUID().toString() + extension;

        Path saveToPath = Paths.get(   profileUploadPath,                   reFileName);

        try {
            Files.copy(file.getInputStream(), saveToPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("프로필 이미지 업로드 성공 : {} -> {}", clientUploadFileName, reFileName);

        } catch(IOException e){
            log.error("파일 저장 중 오류 발생 : {}", e.getMessage());
            throw new IOException("파일 저장에 실패했습니다. : " + e.getMessage());
        }

        return "/profile_images/" + reFileName;
    }

    public String uploadStoryImage(MultipartFile file, int storyId, String imageType) throws IOException {

        if(file.isEmpty()) {
            throw new IOException("업로드할 파일이 없습니다");
        }

        String storyFolder = storyUploadPath + "/" + storyId;

        File uploadDir = new File(storyFolder);
        if(!uploadDir.exists()){
            boolean created = uploadDir.mkdirs();
            if(!created){
                throw new IOException("스토리 이미지 디렉토리 생성에 실패했습니다." + storyFolder);
            }
            log.info("스토리 이미지 디렉토리 생성 : {}", storyFolder);
        }

        String clientUploadFileName = file.getOriginalFilename();
        if(clientUploadFileName == null || clientUploadFileName.isEmpty()){
            throw new IOException("파일 이름이 유효하지 않습니다.");
        }

        String fileName = imageType + "-" +clientUploadFileName;

        Path saveToPath = Paths.get(storyFolder,fileName);

        try {
            Files.copy(file.getInputStream(), saveToPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("스토리 이미지 업로드 성공 : {} -> {}", file.getOriginalFilename(), fileName);

        } catch(Exception e) {
            log.error("스토리 이미지 저장 중 오류 발생 : ", e.getMessage());
        }

        return "/story_images/" + storyId + "/" + fileName;
    }

    public String uploadPostImage(MultipartFile file, int postId, String imageType) throws IOException {

        if(file == null || file.isEmpty()) throw new IOException("업로드할 파일이 없습니다");

        String postFolder = postUploadPath + "/" + postId;

        File uploadDir = new File(postFolder);

        if(!uploadDir.exists()){
            boolean created = uploadDir.mkdirs();
            if(!created){
                throw new IOException("포스트 이미지 디렉토리 생성을 실패했습니다." + postFolder);
            }
            log.info("포스트 이미지 디렉토리 생성 : {}", postFolder);
        }

        String clientUploadFileName = file.getOriginalFilename();
        if(clientUploadFileName == null || clientUploadFileName.isEmpty()){
            throw new IOException("파일 이름이 유효하지 않습니다.");
        }

        String fileName = imageType + clientUploadFileName;

        Path saveToPath = Paths.get(postFolder,fileName);

        try {
            Files.copy(file.getInputStream(), saveToPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("포스트 이미지 업로드 성공 : {} -> {}", file.getOriginalFilename(), fileName);

        } catch(Exception e) {
            log.error("포스트 이미지 저장 중 오류 발생 : ", e.getMessage());
            throw new IOException("포스트 이미지 저장에 실패했습니다." + e.getMessage());
        }

        return "/post_images/" + postId + "/" + fileName;
    }

    public boolean deleteFile(String dbPathImg) {
        if(dbPathImg != null && dbPathImg.isEmpty()){
            log.warn("삭제할 파일 경로가 존재하지 않습니다.");
            return false;
        }

        try {
            String absolutePath;

            if(dbPathImg.startsWith("/profile_images/")){
                String profileImagePath = dbPathImg.replace("/profile_images/", "");
                absolutePath = profileUploadPath + "/" + profileImagePath;

            } else if(dbPathImg.startsWith("/story_images/")) {
                String storyImagePath = dbPathImg.replace("/story_images/", "");
                absolutePath = storyUploadPath + "/" + storyImagePath;

            } else if(dbPathImg.startsWith("/post_images/")) {
                String postImagePath = dbPathImg.replace("/post_images/", "");
                absolutePath = postUploadPath + "/" + postImagePath;

            }  else {
                log.warn("지원하지 않는 파일 경로 형식입니다. {}", dbPathImg);
                return false;
            }

            File file = new File(absolutePath);

            if(!file.exists()){
                log.warn("삭제하려는 파일이 존재하지 않습니다 : {}", absolutePath);
                return false;
            }

            boolean fileRemove = file.delete();

            if(fileRemove) {
                log.info("파일 삭제 성공 : {}", absolutePath);

                if(dbPathImg.startsWith("/product_images/")){
                    if(file.getParentFile().exists()) {
                        deleteFile("/product_images/" + file.getParentFile().getName());
                    }

                }

            } else {
                log.error("파일 삭제 실패 : {}", absolutePath);
            }
            return fileRemove;

        } catch (Exception e) {
            log.error("파일 삭제 중 오류 발생 : {}", e.getMessage());
            return false;
        }
    }

}
