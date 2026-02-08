package com.zam.dev.pos.backend.services.impl;


import com.zam.dev.pos.backend.dto.requests.ProductRequest;
import com.zam.dev.pos.backend.dto.responses.ProductResponse;
import com.zam.dev.pos.backend.entities.Category;
import com.zam.dev.pos.backend.entities.Product;
import com.zam.dev.pos.backend.entities.Tenant;
import com.zam.dev.pos.backend.exceptions.NotFoundExceptionCustom;
import com.zam.dev.pos.backend.repositories.CategoryRepository;
import com.zam.dev.pos.backend.repositories.ProductRepository;
import com.zam.dev.pos.backend.services.ProductService;
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
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public ProductResponse create(ProductRequest request, Tenant tenant) {
        try {
            Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new NotFoundExceptionCustom("category not found"));

            String imagePath = FileUpload.saveFile("uploads/products", request.getImage());

            Product product = new Product();
            product.setName(request.getName());
            product.setCategory(category);
            product.setPrice(request.getPrice());
            product.setStock(request.getStock());
            product.setImage(imagePath);
            product.setTenant(tenant);

            return this.toProductResponse(productRepository.save(product));
        } catch (IOException exception) {
            throw new RuntimeException(exception.getMessage());
        }
    }

    @Override
    public long countByTenant(Tenant tenant) {
        return this.productRepository.countByTenant(tenant);
    }

    @Override
    public Page<Product> getAll(int page, int size, Tenant tenant) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findAllByTenant(tenant, pageable);
    }

    @Override
    public Product getByUuid(String uuid, Tenant tenant) {
        return productRepository.findByUuidAndTenant(uuid, tenant).orElseThrow(() -> new NotFoundExceptionCustom("product not found"));
    }


    private ProductResponse toProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .uuid(product.getUuid())
                .name(product.getName())
                .price(product.getPrice())
                .stock(product.getStock())
                .image(product.getImage())
                .tenant(ProductResponse.TenantInfo.builder()
                        .id(product.getTenant().getId())
                        .name(product.getTenant().getName())
                        .build())
                .category(ProductResponse.CategoryInfo.builder()
                        .id(product.getCategory().getId())
                        .name(product.getCategory().getName())
                        .image(product.getCategory().getImage())
                        .build())
                .build();
    }


    @Override
    @Transactional
    public ProductResponse update(String uuid, ProductRequest request, Tenant tenant) {
        try {
            Product product = getByUuid(uuid, tenant);

            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new NotFoundExceptionCustom("Category not found"));

            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setStock(request.getStock());
            product.setCategory(category);

            if (request.getImage() != null && !request.getImage().isEmpty()) {
                FileUpload.deleteFile("uploads/products", product.getImage());
                String newImagePath = FileUpload.saveFile("uploads/products", request.getImage());
                product.setImage(newImagePath);
            }

            return this.toProductResponse(productRepository.save(product));
        } catch (IOException exception) {
            throw new RuntimeException("Failed to update product image: " + exception.getMessage());
        }
    }

    @Override
    public void delete(String uuid, Tenant tenant) {
        Product product = getByUuid(uuid, tenant);
        if (product.getImage() != null) {
            FileUpload.deleteFile("uploads/products", product.getImage());
        }
        productRepository.delete(product);
    }


    @Override
    public long countByStockLessAndTenant(Tenant tenant) {
        return productRepository.countByStockLessThanAndTenant(5, tenant);
    }

    @Override
    public Page<Product> findAllInCashier(Tenant tenant, String search, String categoryUuid, Pageable pageable) {

        if (search != null && search.isBlank()) {
            search = null;
        }

        if (categoryUuid != null && categoryUuid.isBlank()) {
            categoryUuid = null;
        }

        return productRepository
                .findAllInCashier(tenant, search, categoryUuid, pageable);

    }
}
