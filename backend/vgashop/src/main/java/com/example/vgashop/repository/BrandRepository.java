package com.example.vgashop.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Brand;
import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;

public interface  BrandRepository extends JpaRepository<Brand, Long> {

    // tìm kiếm theo tên
    Page<Brand> findByNameContaining(String keyWord, Pageable pageable);

    // Kiểm tra brand tồn tại theo tên (không phân biệt hoa thường) - dùng cho validation
    boolean existsByNameIgnoreCase(String name);
}
