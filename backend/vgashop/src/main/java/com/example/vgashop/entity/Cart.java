package com.example.vgashop.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name= "carts")
public class Cart extends BaseEntity {

    @OneToOne
    @JoinColumn(name= "user_id", nullable= false, unique= true)
    private  User user;

    @OneToMany(mappedBy= "cart", cascade= CascadeType.ALL, orphanRemoval= true, fetch= FetchType.LAZY)
    private List<CartItem> cartItems = new ArrayList<>();

    @Column(precision= 12, scale= 2) // tng tin ca gi hng, c th tnh li mi khi thm/xa/sa cart item. ct ny gip trnh phi tnh ton li mi ln truy vn gi hng, ci thin hiu sut
    private BigDecimal totalAmount = BigDecimal.ZERO; // to mc nh l 0  trnh null

    // method tnh tng tin ca gi hng, c th gi sau mi ln thm/xa/sa cart item
    public void recalculateTotal() {
        this.totalAmount = cartItems.stream()
            .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // getter setter

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<CartItem> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItem> cartItems) {
        this.cartItems = cartItems;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

}
