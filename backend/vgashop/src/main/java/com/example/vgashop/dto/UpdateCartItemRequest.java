package com.example.vgashop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// dùng khi cần sửa số lượng của item trong giỏ hàng, có thể thêm các trường khác nếu cần
public class UpdateCartItemRequest {

    @NotNull(message= "Số lượng không được để trống")
    @Min(value = 1, message= "Số lượng phải lớn hơn hoặc bằng 1")
    private Integer quantity;

    // constructor mặc định
    public UpdateCartItemRequest() {}

    public UpdateCartItemRequest(Integer quantity) {
        this.quantity = quantity;
    }

    // getter setter
    public Integer getQuantity() {
        return quantity;
    }   

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
