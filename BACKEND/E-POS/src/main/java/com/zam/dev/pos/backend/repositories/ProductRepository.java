package com.zam.dev.pos.backend.repositories;

import com.zam.dev.pos.backend.entities.Product;
import com.zam.dev.pos.backend.entities.Tenant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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


    @Query("SELECT p FROM Product p WHERE p.tenant = :tenant " +
            "AND (:categoryUuid IS NULL OR p.category.uuid = :categoryUuid) " +
            "AND (:search IS NULL OR " +
            "     LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "     p.uuid = :search)")
    Page<Product> findAllInCashier(
            @Param("tenant") Tenant tenant,
            @Param("search") String search,
            @Param("categoryUuid") String categoryUuid,
            Pageable pageable
    );

    long countByTenant(Tenant tenant);

    long countByStockLessThanAndTenant(int stock, Tenant tenant);

}