package com.zam.dev.pos.backend.controllers;

import com.zam.dev.pos.backend.dto.responses.DashboardResponse;
import com.zam.dev.pos.backend.dto.responses.WebResponse;
import com.zam.dev.pos.backend.entities.User;
import com.zam.dev.pos.backend.services.ProductService;
import com.zam.dev.pos.backend.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ProductService productService;

    private final TransactionService transactionService;


    @GetMapping("/")
    public ResponseEntity<WebResponse<DashboardResponse>> index(
            @AuthenticationPrincipal User currentUser
    ) {

        long totalProducts = this.productService.countByTenant(currentUser.getTenant());
        long countByStockLessAndTenant = this.productService.countByStockLessAndTenant(currentUser.getTenant());
        long totalRevenue = this.transactionService.getTotalRevenue(currentUser.getTenant());
        long totalOrders = this.transactionService.getTotalOrders(currentUser.getTenant());
        return ResponseEntity.ok().body(
                WebResponse.<DashboardResponse>builder()
                        .success(true)
                        .data(
                                DashboardResponse.builder().
                                        orders(totalOrders).
                                        totalProduct(totalProducts).
                                        totalRevenue(totalRevenue).
                                        productLowStock(countByStockLessAndTenant).
                                        build()
                        )
                        .build());
    }


}
