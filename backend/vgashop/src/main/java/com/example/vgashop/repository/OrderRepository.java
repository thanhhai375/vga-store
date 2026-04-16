package com.example.vgashop.repository;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderStatus;

public interface  OrderRepository extends JpaRepository<Order, Long> {

    // tìm đơn hàng theo user và chưa bị xóa
    Page<Order> findByUser_IdAndDeletedFalse(Long userId, Pageable pageable);

    // tìm tất cả đơn hàng của user theo trạng thái
    Page<Order> findByUser_IdAndStatusAndDeletedFalse(Long userId, OrderStatus status, Pageable pageable);

    // tìm đơn hàng theo mã đơn hàng
    Optional<Order> findByOrderCodeAndDeletedFalse(String orderCode);

    // tìm đơn hàng theo id và user (đảm bảo user chỉ xem đơn hàng của mình)
    Optional<Order> findByIdAndUser_IdAndDeletedFalse(Long id, Long userId);

    // Admin: tìm đơn hàng theo id và chi bị xóa 
    Optional<Order> findByIdAndDeletedFalse(Long id);

    // Admin: Lấy tất cả đơn hàng (có phần trang)
    Page<Order> findByDeletedFalse(Pageable pageable);

    // Admin: lọc theo trạng thái
    Page<Order> findByStatusAndDeletedFalse(OrderStatus status, Pageable pageable);

    // kiểm tra đơn hàng có tồn tại và ch bị xóa
    boolean existsByIdAndDeletedFalse(Long id);

    // phần admin dashboard
    long countByDeletedFalse();

    long countByCreatedAtAfterAndDeletedFalse(LocalDateTime dateTime, boolean deleted);

    // Đếm số đơn hàng hôm nay (từ 00:00:00 đến hiện tại)
    @Query("SELECT COUNT(o) FROM Order o WHERE o.deleted = false AND o.createdAt >= :startOfDay")
    long countTodayOrders(@Param("startOfDay") LocalDateTime startOfDay);

}
