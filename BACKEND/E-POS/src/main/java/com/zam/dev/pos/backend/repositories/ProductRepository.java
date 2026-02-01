package com.zam.dev.pos.backend.repositories;

import com.zam.dev.pos.backend.entities.Product;
import com.zam.dev.pos.backend.entities.Tenant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByUuid(String uuid);

    List<Product> findByCategoryUuid(String categoryUuid);

    List<Product> findByNameContainingIgnoreCase(String name);


    List<Product> findByTenant(Tenant tenant);


    Optional<Product> findByUuidAndTenant(String uuid, Tenant tenant);

    Page<Product> findAllByTenant(Tenant tenant, Pageable pageable);
}