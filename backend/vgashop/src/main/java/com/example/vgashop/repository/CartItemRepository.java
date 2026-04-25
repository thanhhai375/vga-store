package com.example.vgashop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.CartItem;
import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart_IdAndDeletedFalse(Long cartId); // tm tt c cart item ca gi hng, ch ly nhng item cha b xa

}
