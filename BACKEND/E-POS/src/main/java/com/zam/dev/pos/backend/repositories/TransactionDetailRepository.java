package com.zam.dev.pos.backend.repositories;

import com.zam.dev.pos.backend.entities.Transaction;
import com.zam.dev.pos.backend.entities.TransactionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionDetailRepository extends JpaRepository<TransactionDetail, Long> {
    
}
