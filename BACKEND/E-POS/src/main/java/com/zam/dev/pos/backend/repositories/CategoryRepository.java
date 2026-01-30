package com.zam.dev.pos.backend.repositories;

import com.zam.dev.pos.backend.entities.Category;
import com.zam.dev.pos.backend.entities.Tenant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Page<Category> findAllByTenant(Tenant tenant, Pageable pageable);

    Optional<Category> findByUuidAndTenant(String uuid, Tenant tenant);

    boolean existsByNameAndTenant(String name, Tenant tenant);
}