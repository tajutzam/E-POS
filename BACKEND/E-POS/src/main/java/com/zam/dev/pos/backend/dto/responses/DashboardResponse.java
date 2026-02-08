package com.zam.dev.pos.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {

    private long totalRevenue;
    private long orders;
    private long totalProduct;

}
