package com.zam.dev.pos.backend.dto.responses;

import com.zam.dev.pos.backend.entities.Transaction;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class TransactionResponse {

    private Long id;
    private String uuid;

    private long totalAmount;
    private long totalReturn;
    private long totalQty;

    private Long userId;
    private String userName;
    private String status;

    private List<TransactionDetailResponse> details;

    private LocalDateTime createdAt;

    public static TransactionResponse fromEntity(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .uuid(transaction.getUuid())
                .totalAmount(transaction.getTotalAmount())
                .totalQty(transaction.getTotalQty())
                .createdAt(transaction.getCreatedAt())
                .totalReturn(transaction.getPaymentReturn())
                .details(
                        transaction.getDetails() != null
                                ? transaction.getDetails()
                                .stream()
                                .map(TransactionDetailResponse::fromEntity)
                                .collect(Collectors.toList())
                                : List.of()
                )
                .status(transaction.getStatus().toString())
                .build();
    }
}
