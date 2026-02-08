package com.zam.dev.pos.backend.controllers;

import com.zam.dev.pos.backend.dto.requests.CategoryRequest;
import com.zam.dev.pos.backend.dto.responses.CategoryResponse;
import com.zam.dev.pos.backend.dto.responses.WebResponse;
import com.zam.dev.pos.backend.entities.Category;
import com.zam.dev.pos.backend.entities.User;
import com.zam.dev.pos.backend.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WebResponse<CategoryResponse>> create(
            @Valid @ModelAttribute CategoryRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        Category category = categoryService.create(request, currentUser.getTenant());


        CategoryResponse response = CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .build();

        return ResponseEntity.ok(
                WebResponse.<CategoryResponse>builder()
                        .success(true)
                        .message("Category created successfully")
                        .data(response)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<WebResponse<Page<Category>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser
    ) {
        Page<Category> categories = categoryService.getAll(page, size, currentUser.getTenant());
        return ResponseEntity.ok(
                WebResponse.<Page<Category>>builder()
                        .success(true)
                        .message("Fetch categories success")
                        .data(categories)
                        .build()
        );
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<WebResponse<Category>> getByUuid(
            @PathVariable String uuid,
            @AuthenticationPrincipal User currentUser
    ) {
        Category category = categoryService.getByUuid(uuid, currentUser.getTenant());
        return ResponseEntity.ok(
                WebResponse.<Category>builder()
                        .success(true)
                        .message("Get category success")
                        .data(category)
                        .build()
        );
    }

    @PutMapping(value = "/{uuid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WebResponse<Category>> update(
            @PathVariable String uuid,
            @Valid @ModelAttribute CategoryRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        Category category = categoryService.update(uuid, request, currentUser.getTenant());
        return ResponseEntity.ok(
                WebResponse.<Category>builder()
                        .success(true)
                        .message("Category updated successfully")
                        .data(category)
                        .build()
        );
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<WebResponse<String>> delete(
            @PathVariable String uuid,
            @AuthenticationPrincipal User currentUser
    ) {
        categoryService.delete(uuid, currentUser.getTenant());
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .success(true)
                        .message("Category deleted successfully")
                        .data(uuid)
                        .build()
        );
    }
}