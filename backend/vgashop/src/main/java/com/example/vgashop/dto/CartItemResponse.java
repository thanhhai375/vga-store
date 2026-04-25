package com.example.vgashop.dto;

import java.math.BigDecimal;

// thể hiện mỗi item trong giỏ hàng khi trả về cho client, có thể thêm các trường khác nếu cần
public class CartItemResponse {

    private Long cartItemId; 
    private Long productId;
    private String productName;
    // image url có thể lấy từ product entity hoặc từ một service riêng nếu cần xử lý thêm
    private String productImage;
    private BigDecimal price; // giá tại thời điểm thêm vào giỏ hàng, có thể khác với giá hiện tại của product nếu sau này có thay đổi giá
    private Integer quantity;
    private BigDecimal subtotal; // tổng tiền của item này (quantity * price), có thể tính lại mỗi khi thay đổi quantity hoặc price

    // constructor mặc định
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
