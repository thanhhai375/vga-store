package com.example.vgashop.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Class đại diện cho thông tin lỗi trả về cho Client
 * Format response lỗi thống nhất cho toàn bộ API
 */

// Đây là lớp dùng chung để format response lỗi thống nhất cho toàn bộ API.
// Mọi exception sẽ được GlobalExceptionHandler chuyển thành đối tượng này.

@JsonInclude(JsonInclude.Include.NON_NULL)   // Không trả về các field null trong JSON

public class ApiError {

    private int status; // mã http
    private String error; // tên lỗi là gì
    private String message; // báo lỗi chi tiết 

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;   // Thời gian xảy ra lỗi

    // consu=tuctor mặc định dùng khi cần tạo 1 đối tượng rồi set field sau
    public ApiError() {
        this.timestamp = LocalDateTime.now();
    }

    // constuctor này chỉ dùng khi cần status và message
    public ApiError(int status, String message) {
        this.status = status;
        this.message = message;
        // tự động lấy tên lỗi 
        this.error = HttpStatus.valueOf(status).getReasonPhrase();
        this.timestamp = LocalDateTime.now();
    }

    // constuctor đầy đủ linh hoạt
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
