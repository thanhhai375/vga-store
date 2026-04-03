package com.example.vgashop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.CartItem;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart_IdAndDeletedFalse(Long cartId); // tìm tất cả cart item của giỏ hàng, chỉ lấy những item chưa bị xóa

}
