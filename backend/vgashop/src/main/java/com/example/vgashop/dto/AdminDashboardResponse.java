package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;


// DTO tr v d liu dashboard cho Admin
public class AdminDashboardResponse {

    private Long totalUsers; // Tng s ngi dng
    private Long totalOrders; // Tng s n hng
    private Long todayOrders; // S n hng hm nay
    private BigDecimal totalRevenue; // Tng doanh thu
    private BigDecimal todayRevenue; // Doanh thu hm nay
    private Long totalProducts; // Tng s sn phm
    private Long lowStockProducts; // S sn phm sp ht hng
    private LocalDateTime lastUpdated; // thi gian cp nht d liu cui cng

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
