package com.example.vgashop.dto;

import com.example.vgashop.entity.Role;
import java.time.LocalDateTime;

// Dùng để admin quản lý người dùng, có thể bao gồm thông tin như số lượng người dùng, danh sách người dùng, v.v.
public class UserAdminResponse {


    private Long userId; // ID người dùng
    private String username; // Tên đăng nhập
    private String email; // Email người dùng
    private String fullName; // Họ tên đầy đủ
    private String phone; // Số điện thoại
    private Role role; // Vai trò (USER, ADMIN)
    private Boolean status; // Trạng thái tài khoản (active/inactive)
    private Boolean deleted; // Trạng thái xóa tài khoản (true nếu đã bị xóa, false nếu còn hoạt động)
    private LocalDateTime createdAt; // Thời gian tạo tài khoản
    private LocalDateTime updatedAt; // Thời gian cập nhật tài khoản cuối cùng

    // Constructor
    public UserAdminResponse() {}

    public UserAdminResponse(Long userId, String username, String email, String fullName, String phone, Role role, Boolean status, Boolean deleted, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.status = status;
        this.deleted = deleted;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

     // getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public Boolean getDeleted() {
        return deleted;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
}
