package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.util.List;


// trả về cho frontend thông tin của giỏ hàng, có thể thêm các trường khác nếu cần
public class CartResponse {

    private Long cartId;
    private BigDecimal totalAmount; // tổng tiền của giỏ hàng, có thể tính lại mỗi khi thay đổi cart item
    // tổng sán phẩm trong giỏ hàng kh phải số item
    private Integer totalItems;
    private List<CartItemResponse> items; // danh sách các item trong giỏ hàng, có thể map từ CartItem entity sang CartItemResponse DTO


    // constructor mặc định
    public CartResponse() {}

    public CartResponse(Long cartId, BigDecimal totalAmount, Integer totalItems, List<CartItemResponse> items) {
        this.cartId = cartId;
        this.totalAmount = totalAmount;
        this.totalItems = totalItems;
        this.items = items;
    }

    // getter setter
    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }
}
