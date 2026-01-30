package com.zam.dev.pos.backend.services.impl;

import com.zam.dev.pos.backend.configs.JwtService;
import com.zam.dev.pos.backend.dto.AuthRequest;
import com.zam.dev.pos.backend.dto.AuthResponse;
import com.zam.dev.pos.backend.entities.Role;
import com.zam.dev.pos.backend.entities.User;
import com.zam.dev.pos.backend.repositories.UserRepository;
import com.zam.dev.pos.backend.services.AuthService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public User register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email sudah terdaftar!");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CASHIER)
                .build();

        return userRepository.save(user);
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password salah!");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, user.getUuid(), user.getRole().name());
    }

    @Override
    public User getProfile(String email) {
        log.debug(email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
}
