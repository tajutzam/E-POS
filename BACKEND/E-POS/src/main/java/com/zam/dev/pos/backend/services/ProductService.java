package com.zam.dev.pos.backend.services;


import com.zam.dev.pos.backend.dto.CategoryRequest;
import com.zam.dev.pos.backend.dto.ProductRequest;
import com.zam.dev.pos.backend.dto.ProductResponse;
import com.zam.dev.pos.backend.entities.Category;
import com.zam.dev.pos.backend.entities.Product;
import com.zam.dev.pos.backend.entities.Tenant;
import org.springframework.data.domain.Page;

public interface ProductService {

    ProductResponse create(ProductRequest request, Tenant tenant);

    Page<Product> getAll(int page, int size, Tenant tenant);

    Product getByUuid(String uuid, Tenant tenant);

    ProductResponse update(String uuid, ProductRequest request, Tenant tenant);

    void delete(String uuid, Tenant tenant);

}
