package com.zam.dev.pos.backend.services;

import com.zam.dev.pos.backend.dto.requests.TransactionRequest;
import com.zam.dev.pos.backend.dto.responses.TransactionResponse;
import com.zam.dev.pos.backend.entities.Tenant;
import com.zam.dev.pos.backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface TransactionService {

    TransactionResponse createTransaction(TransactionRequest request, User user);


    TransactionResponse getById(Long id);

    TransactionResponse getByUuid(String uuid);

    Page<TransactionResponse> getAll(Pageable pageable,String search , User user);

    Page<TransactionResponse> getByUserId(Long userId, Pageable pageable);

    Page<TransactionResponse> getByDateRange(
            LocalDate startDate,
            LocalDate endDate,
            User user,
            Pageable pageable
    );


    long getTotalRevenue(
            Tenant tenant
    );

    long getTotalOrders(
            Tenant tenant
    );

    void deleteByUuid(String uuid, User user);

}
