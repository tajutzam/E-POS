package com.zam.dev.pos.backend.repositories;

import com.zam.dev.pos.backend.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByUuid(String uuid);

    List<Category> findByNameContainingIgnoreCase(String name);
}