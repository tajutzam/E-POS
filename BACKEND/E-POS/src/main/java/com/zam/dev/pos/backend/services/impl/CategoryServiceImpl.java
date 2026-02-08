package com.zam.dev.pos.backend.services.impl;

import com.zam.dev.pos.backend.dto.requests.CategoryRequest;
import com.zam.dev.pos.backend.entities.Category;
import com.zam.dev.pos.backend.entities.Tenant;
import com.zam.dev.pos.backend.repositories.CategoryRepository;
import com.zam.dev.pos.backend.services.CategoryService;
import com.zam.dev.pos.backend.utils.FileUpload;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public Category create(CategoryRequest request, Tenant tenant) {
        if (categoryRepository.existsByNameAndTenant(request.getName(), tenant)) {
            throw new RuntimeException("Category name already exists in your store");
        }

        try {
            String fileName = FileUpload.saveFile("uploads/categories", request.getImageFile());

            Category category = Category.builder()
                    .name(request.getName())
                    .image(fileName)
                    .tenant(tenant)
                    .build();

            return categoryRepository.save(category);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    @Override
    public Page<Category> getAll(int page, int size, Tenant tenant) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return categoryRepository.findAllByTenant(tenant, pageable);
    }

    @Override
    public Category getByUuid(String uuid, Tenant tenant) {
        // Selalu gunakan findByUuidAndTenant agar user tenant A tidak bisa intip data tenant B
        return categoryRepository.findByUuidAndTenant(uuid, tenant)
                .orElseThrow(() -> new RuntimeException("Category not found or access denied"));
    }

    @Override
    @Transactional
    public Category update(String uuid, CategoryRequest request, Tenant tenant) {
        // Ambil kategori milik tenant tersebut
        Category category = getByUuid(uuid, tenant);

        // Cek jika nama baru sudah dipakai di tenant yang sama
        if (!category.getName().equals(request.getName()) &&
                categoryRepository.existsByNameAndTenant(request.getName(), tenant)) {
            throw new RuntimeException("New category name already exists");
        }

        category.setName(request.getName());

        if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
            try {
                String fileName = FileUpload.saveFile("uploads/categories", request.getImageFile());
                category.setImage(fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to update image: " + e.getMessage());
            }
        }

        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public void delete(String uuid, Tenant tenant) {
        // Pastikan yang dihapus adalah milik tenant yang login
        Category category = getByUuid(uuid, tenant);
        categoryRepository.delete(category);
    }
}