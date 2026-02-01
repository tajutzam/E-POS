package com.zam.dev.pos.backend.exceptions;

import com.zam.dev.pos.backend.dto.WebResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<WebResponse<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return ResponseEntity.badRequest().body(
                WebResponse.<Map<String, String>>builder()
                        .success(false)
                        .message("Validation Failed")
                        .data(errors)
                        .build()
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<WebResponse<String>> handleRuntimeExceptions(RuntimeException ex) {
        return ResponseEntity.badRequest().body(
                WebResponse.<String>builder()
                        .success(false)
                        .message(ex.getMessage())
                        .build()
        );
    }


    @ExceptionHandler(NotFoundExceptionCustom.class)
    public ResponseEntity<WebResponse<String>> handleNotFoundException(NotFoundExceptionCustom ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                WebResponse.<String>builder()
                        .success(false)
                        .message(ex.getMessage())
                        .build()
        );
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<WebResponse<String>> handleConflictException(ConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                WebResponse.<String>builder()
                        .success(false)
                        .message(ex.getMessage())
                        .build()
        );
    }

}