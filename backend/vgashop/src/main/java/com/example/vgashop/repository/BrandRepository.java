package com.example.vgashop.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Brand;
// import org.springframework.data.domain.Pageable;

public interface  BrandRepository extends JpaRepository<Brand, Long> {

    // tìm kiếm theo tên
    Page<Brand> findByNameContaining(String keyWord, Pageable pageable);

    // Kiểm tra brand tồn tại theo tên (không phân biệt hoa thường) - dùng cho validation
    boolean existsByNameIgnoreCase(String name);

    // Lọc theo status
    Page<Brand> findByStatus(Boolean status, Pageable pageable);

    // Lọc theo tên chứa + status
    Page<Brand> findByNameContainingIgnoreCaseAndStatus(String keyword, Boolean status, Pageable pageable);

    // Lấy tất cả chưa bị xóa
    Page<Brand> findByDeletedFalse(Pageable pageable);

    // Lấy theo ID và chưa bị xóa
    // (dùng trong getById và update)
    Optional<Brand>findByIdAndDeletedFalse(Long id);

    // Kiểm tra tồn tại và chưa bị xóa
    boolean existsByIdAndDeletedFalse(Long id);
}
