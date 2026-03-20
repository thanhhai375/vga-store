package com.example.vgashop.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Product;

public interface  ProductRepository extends JpaRepository<Product, Long> {

    // tìm kiếm theo tên 
    Page<Product> findByNameContaining(String keyWord, Pageable pageable);

    // tìm kiếm theo brand
    Page<Product> findByBrand_Name(String keyWord, Pageable pageable);

    // lọc + tìm kiếm
    Page<Product> findByNameContainingAndBrand_Name(String keyWord, String brandName, Pageable pageable);

}
