package com.zam.dev.pos.backend.services.impl;

import com.zam.dev.pos.backend.dto.requests.TransactionRequest;
import com.zam.dev.pos.backend.dto.responses.TransactionResponse;
import com.zam.dev.pos.backend.entities.*;
import com.zam.dev.pos.backend.exceptions.BadRequestException;
import com.zam.dev.pos.backend.exceptions.NotFoundExceptionCustom;
import com.zam.dev.pos.backend.repositories.ProductRepository;
import com.zam.dev.pos.backend.repositories.TransactionRepository;
import com.zam.dev.pos.backend.services.TransactionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request, User user) {

        long totalAmount = 0L;
        long totalQty = 0L;

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setPaymentAmount(request.getPayment_amount());

        List<TransactionDetail> details = new ArrayList<>();

        for (var item : request.getItems()) {

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new NotFoundExceptionCustom("Product not found"));

            long price = product.getPrice().longValueExact();

            long qty = item.getQty();
            long subtotal = price * qty;

            TransactionDetail detail = new TransactionDetail();
            detail.setTransaction(transaction);
            detail.setProduct(product);
            detail.setPrice(price);
            detail.setQty(qty);
            detail.setSubtotal(subtotal);

            details.add(detail);

            totalAmount += subtotal;
            totalQty += qty;
        }

        if (totalAmount > request.getPayment_amount()) {
            throw new BadRequestException("insufficient payment");
        }

        transaction.setTotalAmount(totalAmount);
        transaction.setTotalQty(totalQty);
        transaction.setDetails(details);
        transaction.setPaymentReturn( request.getPayment_amount() - totalAmount);
        transaction.setStatus(STATUS.SUCCESS);
        Transaction saved = transactionRepository.save(transaction);

        return TransactionResponse.builder()
                .id(saved.getId())
                .uuid(saved.getUuid())
                .totalAmount(saved.getTotalAmount())
                .totalQty(saved.getTotalQty())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Override
    public TransactionResponse getById(Long id) {
        Transaction transaction = transactionRepository.findById(id).orElseThrow(() -> new NotFoundExceptionCustom("PRODUCT NOT FOUND"));
        return TransactionResponse.fromEntity(transaction);
    }

    @Override
    public TransactionResponse getByUuid(String uuid) {
        Transaction transaction = transactionRepository.findByUuid(uuid).orElseThrow(() -> new NotFoundExceptionCustom("PRODUCT NOT FOUND"));
        return TransactionResponse.fromEntity(transaction);
    }

    @Override
    public Page<TransactionResponse> getAll(Pageable pageable,String search , User user) {
        return transactionRepository
                .findByUser(user, search , pageable)
                .map(TransactionResponse::fromEntity);
    }

    @Override
    public Page<TransactionResponse> getByUserId(Long userId, Pageable pageable) {
        return transactionRepository
                .findAll(pageable)
                .map(TransactionResponse::fromEntity);
    }

    @Override
    public Page<TransactionResponse> getByDateRange(
            LocalDate startDate,
            LocalDate endDate,
            User user,
            Pageable pageable
    ) {
        return transactionRepository
                .findByUserAndCreatedAtBetween(
                        user,
                        startDate.atStartOfDay(),
                        endDate.atTime(23, 59, 59),
                        pageable
                )
                .map(TransactionResponse::fromEntity);
    }


    @Override
    public long getTotalRevenue(Tenant tenant) {
        return transactionRepository.sumTotalAmountByTenantUuid(tenant.getUuid());
    }

    @Override
    public long getTotalOrders(Tenant tenant) {
        return transactionRepository.countTransactionsByTenantUuid(tenant.getUuid());
    }

    @Override
    @Transactional
    public void deleteByUuid(String uuid, User user) {
        Transaction transaction = transactionRepository
                .findByUuid(uuid)
                .orElseThrow(() -> new NotFoundExceptionCustom("Transaction not found"));
        transactionRepository.delete(transaction);
    }
}
