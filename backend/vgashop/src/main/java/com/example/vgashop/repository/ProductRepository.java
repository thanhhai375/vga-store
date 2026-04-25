package com.example.vgashop.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.vgashop.entity.Product;

public interface  ProductRepository extends JpaRepository<Product, Long> {

    // Search by name
    Page<Product> findByNameContaining(String keyWord, Pageable pageable);

    // Search by brand
    Page<Product> findByBrand_Name(String keyWord, Pageable pageable);

    // Filter by brand ID
    Page<Product> findByBrand_Id(Long brandId, Pageable pageable);

    // Filter by multiple brand IDs (multi select)
    Page<Product> findByBrand_IdIn(List<Long> brandIds, Pageable pageable);

    // Filter by price range
    Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);

    // Combined search and filter
    Page<Product> findByNameContainingAndBrand_Name(String keyWord, String brandName, Pageable pageable);

    Page<Product> findByNameContainingAndBrand_Id(String keyWord, Long brandId, Pageable pageable);

    // Search with price filter
    Page<Product> findByNameContainingAndPriceBetween(String keyWord, Double minPrice, Double maxPrice, Pageable pageable);

    // tìm theo brand + Filter by price range
    Page<Product> findByBrand_IdAndPriceBetween(Long brandId, Double minPrice, Double maxPrice, Pageable pageable);


    // Full filter with all criteria
    Page<Product> findByNameContainingAndBrand_IdInAndPriceBetween(String keyWord, List<Long> brandIds, Double minPrice, Double maxPrice, Pageable pageable);

    // Check if a product with this name already exists
   
    boolean existsByNameIgnoreCase(String name);

    // Check for duplicate SKU
    boolean existsBySkuIgnoreCase(String sku);

    // Retrieve all non-deleted records
    Page<Product> findByDeletedFalse(Pageable pageable);

    // Retrieve by ID (non-deleted only)
    Optional<Product> findByIdAndDeleted(Long id, boolean deleted);

    // Check existence (non-deleted only)
    boolean existsByIdAndDeleted(Long id, boolean deleted);

    // Reserved for brand/category filtering if needed
    long countByBrand_IdAndDeletedFalse(Long brandId);
    long countByCategory_IdAndDeletedFalse(Long categoryId);

    // Admin dashboard statistics
    Long countByDeletedFalse();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.deleted = false AND p.stock <= :threshold")
    Long countLowStock(@Param("threshold") int threshold);

    Optional<Product> findByIdAndDeletedFalse(Long id);

    // Retrieve products received by user but not yet reviewed
    @Query("SELECT DISTINCT p FROM Product p JOIN p.orderItems oi JOIN oi.order o " +
           "WHERE o.user.id = :userId AND o.status = 'DELIVERED' " +
           "AND p.id NOT IN (SELECT r.product.id FROM Review r WHERE r.user.id = :userId)")
    List<Product> findProductsPendingReview(@Param("userId") Long userId);
}
