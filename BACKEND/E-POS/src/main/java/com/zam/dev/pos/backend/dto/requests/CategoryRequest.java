package com.zam.dev.pos.backend.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CategoryRequest {
    @NotBlank()
    private String name;

    @NotNull()
    private MultipartFile imageFile;
}