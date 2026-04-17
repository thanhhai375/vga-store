package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.PaymentStatus;


// dùng cho danh sách đơn hàng 
/**
 * DTO dùng để hiển thị danh sách đơn hàng (ngắn gọn, không cần liệt kê chi tiết từng sản phẩm).
 * Thường dùng trong trang "Đơn hàng của tôi".
 */
public class OrderSummaryResponse {

    private Long orderId;
    private String orderCode; // mã đơn hàng
    private BigDecimal totalAmount; // tổng tiền
    private OrderStatus status; // trạng thái đơn hàng
    private PaymentStatus paymentStatus; // trạng thái thanh toán
    private LocalDateTime creratedAt; // ngày tạo đơn
    private Integer totalItems; // tổng số lượng sản phẩm trong đơn

    // Constructor
    public OrderSummaryResponse() {}

    public OrderSummaryResponse(Long orderId, String orderCode, BigDecimal totalAmount, OrderStatus status,
            PaymentStatus paymentStatus, LocalDateTime creratedAt, Integer totalItems) {
        this.orderId = orderId;
        this.orderCode = orderCode;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.creratedAt = creratedAt;
        this.totalItems = totalItems;
    }

    // getter setter

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getCreratedAt() {
        return creratedAt;
    }

    public void setCreratedAt(LocalDateTime creratedAt) {
        this.creratedAt = creratedAt;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }
    
}
