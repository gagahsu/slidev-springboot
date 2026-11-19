package com.example.shop.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.shop.common.RspCode;
import com.example.shop.exception.BizException;
import com.example.shop.vo.UploadVO;

@Service
public class UploadService {

    private static final Map<String, String> TYPES = Map.of(
            "image/jpeg", ".jpg", "image/png", ".png", "image/webp", ".webp");
    private static final long MAX_SIZE = 2 * 1024 * 1024;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public UploadVO save(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BizException(RspCode.PARAM_ERROR, "請選擇圖片");
        }
        String ext = TYPES.get(file.getContentType());
        if (ext == null) {
            throw new BizException(RspCode.PARAM_ERROR, "只接受 jpg、png、webp");
        }
        if (file.getSize() > MAX_SIZE) {
            throw new BizException(RspCode.PARAM_ERROR, "圖片不能超過 2 MB");
        }
        // 檔名用 UUID，不用使用者給的檔名（避免重複、避免路徑攻擊）
        String filename = UUID.randomUUID() + ext;
        try {
            Path dir = Path.of(uploadDir);
            Files.createDirectories(dir);
            file.transferTo(dir.resolve(filename).toAbsolutePath());
        } catch (IOException e) {
            throw new BizException(RspCode.INTERNAL_SERVER_ERROR, "圖片儲存失敗");
        }
        return new UploadVO("/uploads/" + filename);
    }
}
