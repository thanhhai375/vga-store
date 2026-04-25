package com.example.vgashop.entity;

public enum PaymentStatus {
    UNPAID, PAID, 
    REFUNDED, // đã hoàn tiền

    // pAYMENT

    PENDING, // ĐANG CHỜ THANH TOÁN
    SUCCESS, // thành toán thành công
    FAILED, // thanh toán thất bại
    
}
