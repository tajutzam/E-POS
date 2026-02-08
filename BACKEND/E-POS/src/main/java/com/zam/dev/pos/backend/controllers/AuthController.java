package com.zam.dev.pos.backend.controllers;

import com.zam.dev.pos.backend.dto.requests.AuthRequest;
import com.zam.dev.pos.backend.dto.responses.AuthResponse;
import com.zam.dev.pos.backend.dto.responses.WebResponse;
import com.zam.dev.pos.backend.entities.User;
import com.zam.dev.pos.backend.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<WebResponse<String>> register(@Valid @RequestBody AuthRequest request) {
        try {
            User user = authService.register(request);
            return ResponseEntity.ok(WebResponse.<String>builder()
                    .success(true)
                    .message("User berhasil didaftarkan")
                    .data(user.getUuid())
                    .build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(WebResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<WebResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(WebResponse.<AuthResponse>builder()
                    .success(true)
                    .message("Login Berhasil")
                    .data(response)
                    .build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(WebResponse.<AuthResponse>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<WebResponse<User>> getMyProfile(@AuthenticationPrincipal User currentUser) {
        try {
            return ResponseEntity.ok(WebResponse.<User>builder()
                    .success(true)
                    .message("Data Profile Berhasil Diambil")
                    .data(currentUser)
                    .build());
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(WebResponse.<User>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }
}