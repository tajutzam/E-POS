package com.zam.dev.pos.backend.services;

import com.zam.dev.pos.backend.dto.requests.CategoryRequest;
import com.zam.dev.pos.backend.entities.Category;
import com.zam.dev.pos.backend.entities.Tenant;
import org.springframework.data.domain.Page;

public interface CategoryService {

    Category create(CategoryRequest request, Tenant tenant);

    Page<Category> getAll(int page, int size, Tenant tenant);

    Category getByUuid(String uuid, Tenant tenant);

    Category update(String uuid, CategoryRequest request, Tenant tenant);

    void delete(String uuid, Tenant tenant);
}