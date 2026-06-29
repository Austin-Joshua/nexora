package com.nexora.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class NexoraException extends RuntimeException {

    private final int statusCode;

    public NexoraException(String message) {
        super(message);
        this.statusCode = 400;
    }

    public NexoraException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public NexoraException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 400;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
