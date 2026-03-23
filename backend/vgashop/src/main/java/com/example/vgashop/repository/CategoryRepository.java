package com.example.vgashop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // tìm kiếm theo tên 
    Page<Category> findByNameContaining(String keyWord, Pageable pageable);

    // chỉ lấy category đang active
    Page<Category> findByActiveTrue(Pageable pageable);

    // kiểm tra trùng tên 
    boolean existsByNameIgnoreCase(String name);
}
