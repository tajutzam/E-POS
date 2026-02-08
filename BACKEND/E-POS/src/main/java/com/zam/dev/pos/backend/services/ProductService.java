package com.zam.dev.pos.backend.services;


import com.zam.dev.pos.backend.dto.requests.ProductRequest;
import com.zam.dev.pos.backend.dto.responses.ProductResponse;
import com.zam.dev.pos.backend.entities.Product;
import com.zam.dev.pos.backend.entities.Tenant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {

    ProductResponse create(ProductRequest request, Tenant tenant);

    Page<Product> getAll(int page, int size, Tenant tenant);

    Product getByUuid(String uuid, Tenant tenant);

    ProductResponse update(String uuid, ProductRequest request, Tenant tenant);

    void delete(String uuid, Tenant tenant);

    long countByTenant(Tenant tenant);

    long countByStockLessAndTenant(Tenant tenant);


    Page<Product> findAllInCashier(Tenant tenant, String search, String categoryUuid, Pageable pageable);


}
