package com.zam.dev.pos.backend.exceptions;

public class NotFoundExceptionCustom extends RuntimeException {
    public NotFoundExceptionCustom(String message) {
        super(message);
    }
}
