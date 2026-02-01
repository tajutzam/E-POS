package com.zam.dev.pos.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder
@Data
public class ProductResponse {

    private long id;
    private String uuid;
    private String name;
    private BigDecimal price;
    private long stock;
    private String image;

    private CategoryInfo category;
    private TenantInfo tenant;

    @Data
    @Builder
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String image;
    }

    @Data
    @Builder
    public static class TenantInfo {
        private Long id;
        private String name;
    }

}