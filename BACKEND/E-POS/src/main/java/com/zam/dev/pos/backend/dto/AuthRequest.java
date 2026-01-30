package com.zam.dev.pos.backend.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String name; // Hanya untuk register
    private String email;
    private String password;
}