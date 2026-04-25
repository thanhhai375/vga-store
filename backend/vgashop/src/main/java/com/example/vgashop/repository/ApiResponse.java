package com.example.vgashop.repository;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

// wapper thng nht cho tt c response API
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern= "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    // constuctor mc inhk
    public ApiResponse() {
        this.timestamp = LocalDateTime.now();
    }

    // constutor c tham s, dng nhiu
    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // STATIC FACTORY METHODS
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

     public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Thành công", data);
    }

     public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }

    public static <T> ApiResponse<T> message(String message) {
        return new ApiResponse<>(true, message, null);
    }

    
    // getter setter
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
}
