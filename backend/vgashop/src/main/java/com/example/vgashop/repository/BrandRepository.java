package com.example.vgashop.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Brand;
// import org.springframework.data.domain.Pageable;

public interface  BrandRepository extends JpaRepository<Brand, Long> {

    // Search by name
    Page<Brand> findByNameContaining(String keyWord, Pageable pageable);

    // Kim tra brand tn ti theo tn (khng phn bit hoa thng) - dng cho validation
    boolean existsByNameIgnoreCase(String name);

    // Lc theo status
    Page<Brand> findByStatus(Boolean status, Pageable pageable);

    // Lc theo tn cha + status
    Page<Brand> findByNameContainingIgnoreCaseAndStatus(String keyword, Boolean status, Pageable pageable);

    // Retrieve all non-deleted records
    Page<Brand> findByDeletedFalse(Pageable pageable);

    // Retrieve by ID (non-deleted only)
    // (dng trong getById v update)
    Optional<Brand> findByIdAndDeleted(Long id, boolean deleted);

    // Check existence (non-deleted only)
    boolean existsByIdAndDeleted(Long id, boolean deleted);
}
