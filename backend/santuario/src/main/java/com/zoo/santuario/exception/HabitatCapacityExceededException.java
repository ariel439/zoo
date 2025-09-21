package com.zoo.santuario.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class HabitatCapacityExceededException extends IllegalArgumentException {

    public HabitatCapacityExceededException(String message) {
        super(message);
    }

    public HabitatCapacityExceededException(String message, Throwable cause) {
        super(message, cause);
    }
}
