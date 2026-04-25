package com.example.vgashop.dto;

import com.example.vgashop.entity.Role;
import java.time.LocalDateTime;

// Dng  admin qun l ngi dng, c th bao gm thng tin nh s lng ngi dng, danh sch ngi dng, v.v.
public class UserAdminResponse {


    private Long userId; // ID ngi dng
    private String username; // Tn ng nhp
    private String email; // Email ngi dng
    private String fullName; // H tn y
    private String phone; // S in thoi
    private Role role; // Vai tr (USER, ADMIN)
    private Boolean status; // Trng thi ti khon (active/inactive)
    private Boolean deleted; // Trng thi xa ti khon (true nu  b xa, false nu cn hot ng)
    private LocalDateTime createdAt; // Thi gian to ti khon
    private LocalDateTime updatedAt; // Thi gian cp nht ti khon cui cng

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
