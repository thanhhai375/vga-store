package com.example.vgashop.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name= "cart_items")
public class CartItem extends BaseEntity {

    @Column(name= "quantity", nullable= false)
    private Integer quantity;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name= "cart_id", nullable= false)
    private Cart cart;

    @ManyToOne(fetch= FetchType.EAGER)
    @JoinColumn(name= "product_id", nullable= false)
    private Product product;

    // to bin subtotal  lu tng tin ca item ny (quantity * product price), c th tnh li mi khi thay i quantity hoc product
    @Column(name= "subtotal", precision= 12, scale= 2)
    private BigDecimal subtotal;

    public void calculateSubtotal() {
        if (product != null && quantity != null) {
            this.subtotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        } else {
            this.subtotal = BigDecimal.ZERO;
        }
    }
    // getter setter
    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    public BigDecimal getSubtotal() {
        return subtotal;
    }
    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
