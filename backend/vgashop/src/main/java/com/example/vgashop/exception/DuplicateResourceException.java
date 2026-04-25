package com.example.vgashop.exception;



/*
dng khi:
Category name  tn ti
Brand name  tn ti
Product SKU  tn ti
*/
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }

}
