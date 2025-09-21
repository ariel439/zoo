package com.zoo.santuario.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CaretakerRequiredException extends IllegalArgumentException {

    public CaretakerRequiredException(String message) {
        super(message);
    }

    public CaretakerRequiredException(String message, Throwable cause) {
        super(message, cause);
    }
}
