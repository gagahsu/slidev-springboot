package com.example.shop.config;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 上傳的圖片用 /uploads/檔名 提供
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(uploadDir).toAbsolutePath().toUri().toString();
        if (!location.endsWith("/")) {
            location += "/";
        }
        // 先找上傳的資料夾，找不到再找專案內附的範例圖片（V2__seed.sql 用到的 product-N.jpg）
        registry.addResourceHandler("/uploads/**").addResourceLocations(location, "classpath:/sample-uploads/");
    }
}
