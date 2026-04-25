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

    // Tm thanh ton theo order
    Optional<Payment> findByOrder_IdAndDeletedFalse(Long orderId);

    // tm tt c thanh ton ca User
    Page<Payment> findByOrder_User_IdAndDeletedFalse(Long userId, Pageable pageable);

    // ADMIn: Ly tt c thanh ton
    Page<Payment> findByDeletedFalse(Pageable pageable);

    // Lc theo trng thi thanh ton
    Page<Payment> findByPaymentStatusAndDeletedFalse(PaymentStatus status, Pageable pageable);

    // kim tra tn ti
    boolean existsByOrder_IdAndDeletedFalse(Long orderId);

    Optional<Payment> findByTransactionCodeAndDeletedFalse(String transactionCode);

    // Admin dashboard statistics
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.deleted = false")
    BigDecimal findTotalRevenue();

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.deleted = false AND p.paidAt >= :startOfDay")
    BigDecimal findTodayRevenue(@Param("startOfDay") LocalDateTime startOfDay);
}
