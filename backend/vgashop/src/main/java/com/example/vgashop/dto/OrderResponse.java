package com.example.vgashop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.PaymentStatus;


/**
 * DTO trả về thông tin chi tiết của một đơn hàng cho người dùng xem.
 * Dùng cho endpoint xem chi tiết đơn hàng và danh sách đơn hàng.
 */
public class OrderResponse {

    private  Long orderId;
    private String orderCode;
    private BigDecimal totalAmount; // tổng tiền đơn hàng
    private BigDecimal discountAmount; // số tiền giảm giá 
    private OrderStatus status; // trạng thái đơn hàng 
    private PaymentStatus paymentStatus; // trạng thái thanh toán
    private String shippingAddress; // địa chỉ giao hàng
    private String phone;
    private String note;
    private LocalDateTime createdAt; // thời gian tạo đơn
    private LocalDateTime confirmedAt; // thời gian xác nhận đơn
    private LocalDateTime shippedAt; // thời gian giao
    private LocalDateTime deliveredAt; // thời gian nhận 
    private List<OrderItemResponse> items; // danh sách sản phẩm trong đơn

    // constructor
    public OrderResponse() {}

    public OrderResponse(Long orderId, String orderCode, BigDecimal totalAmount, BigDecimal discountAmount,
            OrderStatus status, PaymentStatus paymentStatus, String shippingAddress, String phone, String note,
            LocalDateTime createdAt, LocalDateTime confirmedAt, LocalDateTime shippedAt, LocalDateTime deliveredAt,
            List<OrderItemResponse> items) {
        this.orderId = orderId;
        this.orderCode = orderCode;
        this.totalAmount = totalAmount;
        this.discountAmount = discountAmount;
        this.status = status;
        this.paymentStatus = paymentStatus;
        this.shippingAddress = shippingAddress;
        this.phone = phone;
        this.note = note;
        this.createdAt = createdAt;
        this.confirmedAt = confirmedAt;
        this.shippedAt = shippedAt;
        this.deliveredAt = deliveredAt;
        this.items = items;
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

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
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

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(LocalDateTime confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public LocalDateTime getShippedAt() {
        return shippedAt;
    }

    public void setShippedAt(LocalDateTime shippedAt) {
        this.shippedAt = shippedAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
    
}
