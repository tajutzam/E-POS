package com.zam.dev.pos.backend.dto;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CategoryResponse {


    private long id;
    private String name;


}
