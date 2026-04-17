package com.example.vgashop.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.Payment;
import com.example.vgashop.entity.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Tìm thanh toán theo order
    Optional<Payment> findByOrder_IdAndDeletedFalse(Long orderId);

    // tìm tất cả thanh toán của User
    Page<Payment> findByOrder_User_IdAndDeletedFalse(Long userId, Pageable pageable);

    // ADMIn: Lấy tất cả thanh toán
    Page<Payment> findByDeletedFalse(Pageable pageable);

    // Lọc theo trạng thái thanh toán
    Page<Payment> findByPaymentStatusAndDeletedFalse(PaymentStatus status, Pageable pageable);

    // kiểm tra tồn tại
    boolean existsByOrder_IdAndDeletedFalse(Long orderId);

    Optional<Payment> findByTransactionCodeAndDeletedFalse(String transactionCode);

    // phần admin dashboard
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.deleted = false")
    BigDecimal findTotalRevenue();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.deleted = false AND p.paidAt >= :startOfDay")
    BigDecimal findTodayRevenue(@Param("startOfDay") LocalDateTime startOfDay);
}
