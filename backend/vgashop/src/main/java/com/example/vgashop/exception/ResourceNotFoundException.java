package com.example.vgashop.exception;

// Exception dùng khi không tìm thấy resource (Category, Brand, Product, User...)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

}
