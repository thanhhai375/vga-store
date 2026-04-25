package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.util.List;


// tr v cho frontend thng tin ca gi hng, c th thm cc trng khc nu cn
public class CartResponse {

    private Long cartId;
    private BigDecimal totalAmount; // tng tin ca gi hng, c th tnh li mi khi thay i cart item
    // tng sn phm trong gi hng kh phi s item
    private Integer totalItems;
    private List<CartItemResponse> items; // danh sch cc item trong gi hng, c th map t CartItem entity sang CartItemResponse DTO


    // constructor mc nh
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
