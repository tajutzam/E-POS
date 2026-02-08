package com.zam.dev.pos.backend.dto.responses;

import com.zam.dev.pos.backend.entities.TransactionDetail;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionDetailResponse {

    private Long productId;
    private String productName;

    private long price;
    private long qty;
    private long subtotal;

    public static TransactionDetailResponse fromEntity(TransactionDetail detail) {
        return TransactionDetailResponse.builder()
                .productId(detail.getProduct().getId())
                .productName(detail.getProduct().getName())
                .price(detail.getPrice())
                .qty(detail.getQty())
                .subtotal(detail.getSubtotal())
                .build();
    }

}
