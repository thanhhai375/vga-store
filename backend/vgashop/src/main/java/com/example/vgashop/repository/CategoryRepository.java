package com.example.vgashop.repository;

import java.util.Optional;

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

    // Lọc theo status
    Page<Category> findByActive(Boolean active, Pageable pageable);

    // Lọc theo tên chứa + status
    Page<Category> findByNameContainingIgnoreCaseAndActive(String keyword, Boolean active, Pageable pageable);

    // lấy tất chưa bị xóa
    Page<Category> findByDeletedFalse(Pageable pageable);

    // lấy theo ID và ch bị xóa
    Optional<Category> findByIdAndDeletedFalse(Long id);

    // kiểm tra tồn tại và ch bị xóa
    boolean existsByIdAndDeletedFalse(Long id);
}
