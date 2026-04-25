package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;


// DTO trả về dữ liệu dashboard cho Admin
public class AdminDashboardResponse {

    private Long totalUsers; // Tổng số người dùng
    private Long totalOrders; // Tổng số đơn hàng
    private Long todayOrders; // Số đơn hàng hôm nay
    private BigDecimal totalRevenue; // Tổng doanh thu
    private BigDecimal todayRevenue; // Doanh thu hôm nay
    private Long totalProducts; // Tổng số sản phẩm
    private Long lowStockProducts; // Số sản phẩm sắp hết hàng
    private LocalDateTime lastUpdated; // thời gian cập nhật dữ liệu cuối cùng

    // Constuctor

    public AdminDashboardResponse() {}

    public AdminDashboardResponse(Long totalUsers, Long totalOrders, Long todayOrders, BigDecimal totalRevenue, BigDecimal todayRevenue, Long totalProducts, Long lowStockProducts, LocalDateTime lastUpdated) {
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.todayOrders = todayOrders;
        this.totalRevenue = totalRevenue;
        this.todayRevenue = todayRevenue;
        this.totalProducts = totalProducts;
        this.lowStockProducts = lowStockProducts;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getTodayOrders() {
        return todayOrders;
    }

    public void setTodayOrders(Long todayOrders) {
        this.todayOrders = todayOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(Long lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
    
}
