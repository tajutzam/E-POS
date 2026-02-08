package com.zam.dev.pos.backend.dto.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransactionDetailRequest {

    @NotNull()
    private Long productId;

    @NotNull
    @Min(value = 1)
    private long qty;

}
