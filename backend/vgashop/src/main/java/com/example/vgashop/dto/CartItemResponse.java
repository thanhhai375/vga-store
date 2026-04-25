package com.example.vgashop.dto;

import java.math.BigDecimal;

// th hin mi item trong gi hng khi tr v cho client, c th thm cc trng khc nu cn
public class CartItemResponse {

    private Long cartItemId; 
    private Long productId;
    private String productName;
    // image url c th ly t product entity hoc t mt service ring nu cn x l thm
    private String productImage;
    private BigDecimal price; // gi ti thi im thm vo gi hng, c th khc vi gi hin ti ca product nu sau ny c thay i gi
    private Integer quantity;
    private BigDecimal subtotal; // tng tin ca item ny (quantity * price), c th tnh li mi khi thay i quantity hoc price

    // constructor mc nh
    public CartItemResponse() {}

    public CartItemResponse(Long cartItemId, Long productId, String productName, String productImage, BigDecimal price, Integer quantity, BigDecimal subtotal) {
        this.cartItemId = cartItemId;
        this.productId = productId;
        this.productName = productName;
        this.productImage = productImage;
        this.price = price;
        this.quantity = quantity;
        this.subtotal = subtotal;
    }

    // getter setter
    public Long getCartItemId() {
        return cartItemId;
    }

    public void setCartItemId(Long cartItemId) {
        this.cartItemId = cartItemId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
