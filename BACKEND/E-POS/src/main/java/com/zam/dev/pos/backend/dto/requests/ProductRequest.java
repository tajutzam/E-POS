package com.zam.dev.pos.backend.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "Nama produk tidak boleh kosong")
    @Size(max = 150, message = "Nama produk maksimal 150 karakter")
    private String name;

    private String description;

    @NotNull(message = "Harga tidak boleh kosong")
    @Positive(message = "Harga harus lebih dari 0")
    private BigDecimal price;

    @NotNull(message = "Stok tidak boleh kosong")
    private Long stock;

    @NotNull(message = "Category ID wajib diisi")
    private Long categoryId;

    private MultipartFile image;
}