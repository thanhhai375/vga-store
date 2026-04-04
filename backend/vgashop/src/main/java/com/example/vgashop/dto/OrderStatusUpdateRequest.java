package com.example.vgashop.dto;

import com.example.vgashop.entity.OrderStatus;

import jakarta.validation.constraints.NotBlank;

// dùng cho admin cập nhật trạng thái
public class OrderStatusUpdateRequest {

    @NotBlank(message= "Trạng thái đơn hàng không được để trống")
    private OrderStatus status;

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

}
