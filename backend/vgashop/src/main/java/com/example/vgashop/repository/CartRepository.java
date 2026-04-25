package com.example.vgashop.repository;


import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Cart;

public interface  CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser_IdAndDeletedFalse(Long userId); // tìm giỏ hàng của user, chỉ lấy giỏ hàng chưa bị xóa

     // Kiểm tra tồn tại giỏ hàng của user chưa bị xóa
    boolean existsByUser_IdAndDeletedFalse(Long userId);

}
