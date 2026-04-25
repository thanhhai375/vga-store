package com.example.vgashop.exception;

// Exception dng khi khng tm thy resource (Category, Brand, Product, User...)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

}
