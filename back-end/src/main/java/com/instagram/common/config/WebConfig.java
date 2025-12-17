package com.instagram.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // profile.upload.path
    @Value("${file.profile.upload.path}")
    private String fileUploadPath;

    @Value("${file.story.upload.path}")
    private String storyUploadPath;

    @Value("${file.post.upload.path}")
    private String postUploadPath;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() { // new WebMvcConfigurer 객체 사용 후 return 을 한 번에 작성하는 방식
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // REST API CORS 설정
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000", "https://insta-front-onzu857eq-phbs-projects-56024376.vercel.app")
                        .allowCredentials(true)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*");

                // WebSocket CORS 설정 추가
                registry.addMapping("/ws/**")
                        .allowedOrigins("http://localhost:3000", "https://insta-front-onzu857eq-phbs-projects-56024376.vercel.app")
                        .allowCredentials(true)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/profile_images/**")
                .addResourceLocations("file:"+fileUploadPath+"/");

        registry.addResourceHandler("/story_images/**")
                .addResourceLocations("file:"+storyUploadPath+"/");

        registry.addResourceHandler("/post_images/**")
                .addResourceLocations("file:"+postUploadPath+"/");

    }
}
