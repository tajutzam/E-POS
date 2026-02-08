package com.zam.dev.pos.backend.controllers;


import com.zam.dev.pos.backend.dto.requests.ProductRequest;
import com.zam.dev.pos.backend.dto.responses.ProductResponse;
import com.zam.dev.pos.backend.dto.responses.WebResponse;
import com.zam.dev.pos.backend.entities.Product;
import com.zam.dev.pos.backend.entities.User;
import com.zam.dev.pos.backend.services.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {


    private final ProductService productService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WebResponse<ProductResponse>> create(
            @Valid @ModelAttribute ProductRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        ProductResponse productResponse = productService.create(request, currentUser.getTenant());
        return ResponseEntity.ok(
                WebResponse.<ProductResponse>builder()
                        .success(true)
                        .message("Product created successfully")
                        .data(productResponse)
                        .build()
        );
    }

    @GetMapping()
    public ResponseEntity<WebResponse<Page<ProductResponse>>> getAll(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @AuthenticationPrincipal User currentUser
    ) {

        Page<Product> productPage = productService.getAll(page, size, currentUser.getTenant());

        Page<ProductResponse> responsePage = productPage.map(product ->
                ProductResponse.builder()
                        .id(product.getId())
                        .uuid(product.getUuid())
                        .name(product.getName())
                        .price(product.getPrice())
                        .stock(product.getStock())
                        .image(product.getImage())
                        .tenant(ProductResponse.TenantInfo.builder()
                                .id(product.getTenant().getId())
                                .name(product.getTenant().getName())
                                .build())
                        .category(ProductResponse.CategoryInfo.builder()
                                .id(product.getCategory().getId())
                                .image(product.getCategory().getImage())
                                .name(product.getCategory().getName())
                                .build())
                        .build()
        );

        return ResponseEntity.ok(
                WebResponse.<Page<ProductResponse>>builder()
                        .success(true)
                        .message("Fetch products success")
                        .data(responsePage)
                        .build()
        );
    }


    @GetMapping("/data/cashier")
    public ResponseEntity<WebResponse<Page<ProductResponse>>> getAllCashier(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            Pageable pageable,
            @AuthenticationPrincipal User currentUser
    ) {

        Page<ProductResponse> page = productService
                .findAllInCashier(currentUser.getTenant(), search, category, pageable)
                .map(product -> ProductResponse.builder()
                        .id(product.getId())
                        .uuid(product.getUuid())
                        .name(product.getName())
                        .price(product.getPrice())
                        .stock(product.getStock())
                        .image(product.getImage())
                        .tenant(ProductResponse.TenantInfo.builder()
                                .id(product.getTenant().getId())
                                .name(product.getTenant().getName())
                                .build())
                        .category(
                                product.getCategory() != null
                                        ? ProductResponse.CategoryInfo.builder()
                                        .id(product.getCategory().getId())
                                        .image(product.getCategory().getImage())
                                        .name(product.getCategory().getName())
                                        .build()
                                        : null
                        )
                        .build()
                );

        return ResponseEntity.ok(
                WebResponse.<Page<ProductResponse>>builder()
                        .success(true)
                        .data(page)
                        .build()
        );
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<WebResponse<Product>> getByUuid(
            @PathVariable String uuid,
            @AuthenticationPrincipal User currentUser
    ) {
        Product product = productService.getByUuid(uuid, currentUser.getTenant());
        return ResponseEntity.ok(
                WebResponse.<Product>builder()
                        .success(true)
                        .message("Product retrieved successfully")
                        .data(product)
                        .build()
        );
    }

    @PutMapping(value = "/{uuid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<WebResponse<ProductResponse>> update(
            @PathVariable String uuid,
            @Valid @ModelAttribute ProductRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        ProductResponse productResponse = productService.update(uuid, request, currentUser.getTenant());
        return ResponseEntity.ok(
                WebResponse.<ProductResponse>builder()
                        .success(true)
                        .message("Product updated successfully")
                        .data(productResponse)
                        .build()
        );
    }

    @DeleteMapping("/{uuid}")
    public ResponseEntity<WebResponse<String>> delete(
            @PathVariable String uuid,
            @AuthenticationPrincipal User currentUser
    ) {
        productService.delete(uuid, currentUser.getTenant());
        return ResponseEntity.ok(
                WebResponse.<String>builder()
                        .success(true)
                        .message("Product deleted successfully")
                        .data("OK")
                        .build()
        );
    }
}
