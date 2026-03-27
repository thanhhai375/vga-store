package com.example.vgashop.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity // đánh dấu là bảng trong DB
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name= "id")
    private Long id;

    @Column(name= "username", nullable=false, unique=true, length=100)
    private String username;

    @Column(name = "password", nullable=false, length=255)
    private String password;

   @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name= "role", nullable=false)
    private String role;

    @OneToMany(mappedBy= "user", cascade= CascadeType.ALL, fetch= FetchType.LAZY)
    private List<Order> orders;

    @OneToOne(mappedBy= "user", cascade= CascadeType.ALL, fetch= FetchType.LAZY)
    private Cart cart;

    // getter và setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return username;
    }

    public void setUserName(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    
}

