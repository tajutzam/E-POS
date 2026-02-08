package com.zam.dev.pos.backend.controllers;

import com.zam.dev.pos.backend.dto.requests.TransactionRequest;
import com.zam.dev.pos.backend.dto.responses.TransactionResponse;
import com.zam.dev.pos.backend.dto.responses.WebResponse;
import com.zam.dev.pos.backend.entities.User;
import com.zam.dev.pos.backend.services.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping("/")
    public WebResponse<TransactionResponse> checkout(
            @RequestBody @Valid TransactionRequest request,
            @AuthenticationPrincipal User user
    ) {
        TransactionResponse transaction = this.service.createTransaction(request, user);
        return WebResponse.<TransactionResponse>builder()
                .success(true)
                .message("Transaction successfully created")
                .data(transaction)
                .build();
    }


    @GetMapping
    public ResponseEntity<WebResponse<Page<TransactionResponse>>> findAll(
            Pageable pageable,
            @RequestParam(required = false) String search,
            @AuthenticationPrincipal User currentUser
    ) {
        Page<TransactionResponse> page = service.getAll(pageable, search ,currentUser);

        return ResponseEntity.ok(
                WebResponse.<Page<TransactionResponse>>builder()
                        .success(true)
                        .message("Success get transactions")
                        .data(page)
                        .build()
        );
    }


    @GetMapping("/{uuid}")
    public ResponseEntity<WebResponse<TransactionResponse>> getByUuid(
            @PathVariable String uuid,
            @AuthenticationPrincipal User currentUser
    ) {
        TransactionResponse transactionResponse = this.service.getByUuid(uuid);

        return ResponseEntity.ok(
                WebResponse.<TransactionResponse>builder()
                        .message("Fetch transaction success")
                        .data(transactionResponse)
                        .success(true)
                        .build()
        );
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<WebResponse<Void>> delete(
            @PathVariable String uuid,
            @AuthenticationPrincipal User currentUser
    ) {
        service.deleteByUuid(uuid, currentUser);

        return ResponseEntity.ok(
                WebResponse.<Void>builder()
                        .success(true)
                        .message("Transaction successfully deleted")
                        .build()
        );
    }


}
