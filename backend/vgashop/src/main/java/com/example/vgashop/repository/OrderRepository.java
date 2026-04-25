package com.example.vgashop.repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderStatus;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // tm n hng theo user v cha b xa
    Page<Order> findByUser_IdAndDeletedFalse(Long userId, Pageable pageable);

    // tm tt c n hng ca user theo trng thi
    Page<Order> findByUser_IdAndStatusAndDeletedFalse(Long userId, OrderStatus status, Pageable pageable);

    // tm n hng theo m n hng
    Optional<Order> findByOrderCodeAndDeletedFalse(String orderCode);

    // tm n hng theo id v user (m bo user ch xem n hng ca mnh)
    Optional<Order> findByIdAndUser_IdAndDeletedFalse(Long id, Long userId);

    // Admin: tm n hng theo id v chi b xa
    Optional<Order> findByIdAndDeletedFalse(Long id);

    // Admin: Ly tt c n hng (c phn trang)
    Page<Order> findByDeletedFalse(Pageable pageable);

    // Admin: lc theo trng thi
    Page<Order> findByStatusAndDeletedFalse(OrderStatus status, Pageable pageable);

    // kim tra n hng c tn ti v ch b xa
    boolean existsByIdAndDeletedFalse(Long id);

    // Admin dashboard statistics
    long countByDeletedFalse();

    long countByCreatedAtAfterAndDeletedFalse(LocalDateTime dateTime);

    // m s n hng hm nay (t 00:00:00 n hin ti)
    @Query("SELECT COUNT(o) FROM Order o WHERE o.deleted = false AND o.createdAt >= :startOfDay")
    long countTodayOrders(@Param("startOfDay") LocalDateTime startOfDay);

    // For User Profile Order list
    List<Order> findByUserIdOrderByIdDesc(Long userId);
}
