package com.zam.dev.pos.backend.services;

import com.zam.dev.pos.backend.dto.requests.AuthRequest;
import com.zam.dev.pos.backend.dto.responses.AuthResponse;
import com.zam.dev.pos.backend.entities.User;

public interface AuthService {

    public User register(AuthRequest request);

    public AuthResponse login(AuthRequest request);

    public User getProfile(String email);
}
