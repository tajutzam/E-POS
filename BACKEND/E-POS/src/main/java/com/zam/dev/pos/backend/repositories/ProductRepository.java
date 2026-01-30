package com.zam.dev.pos.backend.repositories;

import com.zam.dev.pos.backend.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByUuid(String uuid);

    List<Product> findByCategoryUuid(String categoryUuid);

    List<Product> findByNameContainingIgnoreCase(String name);

    List<Product> findByStockLessThan(Integer stock);
}