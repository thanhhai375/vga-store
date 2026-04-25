package com.example.vgashop.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
* Class i din cho thng tin li tr v cho Client
* Format response li thng nht cho ton b API
 */

// y l lp dng chung  format response li thng nht cho ton b API.
// Mi exception s c GlobalExceptionHandler chuyn thnh i tng ny.

@JsonInclude(JsonInclude.Include.NON_NULL)   // Khng tr v cc field null trong JSON

public class ApiError {

    private int status; // m http
    private String error; // tn li l g
    private String message; // bo li chi tit

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;   // Thi gian xy ra li

    // consu=tuctor mc nh dng khi cn to 1 i tng ri set field sau
    public ApiError() {
        this.timestamp = LocalDateTime.now();
    }

    // constuctor ny ch dng khi cn status v message
    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
        // t ng ly tn li
        this.error = HttpStatus.valueOf(status).getReasonPhrase();
        this.timestamp = LocalDateTime.now();
    }

    // constuctor y  linh hot
    public ApiError(int status, String error, String message) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    // getter setter

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
    
}
