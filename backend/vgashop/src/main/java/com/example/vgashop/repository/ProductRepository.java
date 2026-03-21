package com.example.vgashop.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Product;

public interface  ProductRepository extends JpaRepository<Product, Long> {

    // tìm kiếm theo tên 
    Page<Product> findByNameContaining(String keyWord, Pageable pageable);

    // tìm kiếm theo brand
    Page<Product> findByBrand_Name(String keyWord, Pageable pageable);

    // tìm theo brand_id
    Page<Product> findByBrand_Id(Long brandId, Pageable pageable);

    // tìm nhiều brand (multi select)
    Page<Product> findByBrand_IdIn(List<Long> brandIds, Pageable pageable);

    // lọc giá
    Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);

    // lọc + tìm kiếm
    Page<Product> findByNameContainingAndBrand_Name(String keyWord, String brandName, Pageable pageable);

    Page<Product> findByNameContainingAndBrand_Id(String keyWord, Long brandId, Pageable pageable);

    // tìm + price
    Page<Product> findByNameContainingAndPriceBetween(String keyWord, Double minPrice, Double maxPrice, Pageable pageable);

    // tìm theo brand + lọc giá
    Page<Product> findByBrand_IdAndPriceBetween(Long brandId, Double minPrice, Double maxPrice, Pageable pageable);


    // full tính năng lọc
    Page<Product> findByNameContainingAndBrand_IdInAndPriceBetween(String keyWord, List<Long> brandIds, Double minPrice, Double maxPrice, Pageable pageable);


}
