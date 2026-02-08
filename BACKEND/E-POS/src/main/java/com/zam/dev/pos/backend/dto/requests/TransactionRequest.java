package com.zam.dev.pos.backend.dto.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TransactionRequest {

    @NotEmpty(message = "Transaction items must not be empty")
    private List<TransactionDetailRequest> items;

    @NotNull
    @Min(value = 1000)
    private long payment_amount;

}
