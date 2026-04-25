package com.example.vgashop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// dng khi cn sa s lng ca item trong gi hng, c th thm cc trng khc nu cn
public class UpdateCartItemRequest {

    @NotNull(message= "Số lượng không được để trống")
    @Min(value = 1, message= "Số lượng phải lớn hơn hoặc bằng 1")
    private Integer quantity;

    // constructor mc nh
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
