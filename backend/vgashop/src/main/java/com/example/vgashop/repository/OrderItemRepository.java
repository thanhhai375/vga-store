package com.example.vgashop.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {


    // Retrieve all items belonging to an order (dùng khi xem chi tiết đơn hàng)
    List<OrderItem> findByOrder_IdAndDeletedFalse(Long orderId);

    // Check if user has purchased this product in a delivered order và đơn hàng đã giao thành công chưa
    boolean existsByOrder_User_IdAndOrder_StatusAndProduct_Id(Long userId, com.example.vgashop.entity.OrderStatus status, Long productId);

}
