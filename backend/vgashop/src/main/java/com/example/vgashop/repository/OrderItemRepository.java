package com.example.vgashop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {


    // Lấy tất cả item của một đơn hàng (dùng khi xem chi tiết đơn hàng)
    List<OrderItem> findByOrder_IdAndDeletedFalse(Long orderId);

    // Kiểm tra xem user có mua sản phẩm này và đơn hàng đã giao thành công chưa
    boolean existsByOrder_User_IdAndOrder_StatusAndProduct_Id(Long userId, com.example.vgashop.entity.OrderStatus status, Long productId);

}
