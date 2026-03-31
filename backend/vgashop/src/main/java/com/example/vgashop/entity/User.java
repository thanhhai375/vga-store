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
import com.example.vgashop.entity.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity // đánh dấu là bảng trong DB
@Table(name="users")
public class User extends BaseEntity {

    @Column(name= "username", nullable=false, unique=true, length=100)
    private String username;

    @Column(name = "password", nullable=false, length=255)
    private String password; // sẽ mã hóa BCrypt

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(length = 15)
    private String phone;

   @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 255)
    private String avatar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(nullable = false)
    private Boolean status = true;

    @OneToMany(mappedBy= "user", cascade= CascadeType.ALL, fetch= FetchType.LAZY)
    private List<Order> orders;

    @OneToOne(mappedBy= "user", cascade= CascadeType.ALL, fetch= FetchType.LAZY)
    private Cart cart;

    // Constructor
    public User() {}

    // getter và setter

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
    
}

