package com.zam.dev.pos.backend.repositories;


import com.zam.dev.pos.backend.entities.Transaction;
import com.zam.dev.pos.backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT SUM(t.totalAmount) FROM Transaction t WHERE t.user.tenant.uuid = :tenantUuid")
    Long sumTotalAmountByTenantUuid(@Param("tenantUuid") String tenantUuid);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.tenant.uuid = :tenantUuid")
    Long countTransactionsByTenantUuid(@Param("tenantUuid") String tenantUuid);


    @Query("""
                SELECT t
                FROM Transaction t
                WHERE t.user = :user
                  AND (:search IS NULL OR t.uuid LIKE CONCAT('%', :search, '%'))
            """)
    Page<Transaction> findByUser(
            @Param("user") User user,
            @Param("search") String search,
            Pageable pageable
    );


    Page<Transaction> findByUserAndCreatedAtBetween(
            User user,
            LocalDateTime start,
            LocalDateTime end,
            Pageable pageable
    );

    Optional<Transaction> findByUuid(String uuid);

}
