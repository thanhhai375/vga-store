package com.example.vgashop.repository;


import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Cart;

public interface  CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUser_IdAndDeletedFalse(Long userId); // tm gi hng ca user, ch ly gi hng cha b xa

     // Kim tra tn ti gi hng ca user cha b xa
    boolean existsByUser_IdAndDeletedFalse(Long userId);

}
