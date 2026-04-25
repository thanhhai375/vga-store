package com.example.vgashop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.vgashop.entity.Review;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<Review> findByBlogIdOrderByCreatedAtDesc(Long blogId);
    
    // Kiểm tra xem user đã review sản phẩm này chưa
    boolean existsByUser_IdAndProduct_Id(Long userId, Long productId);
}
