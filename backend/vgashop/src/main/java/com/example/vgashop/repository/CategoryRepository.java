package com.example.vgashop.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vgashop.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Search by name
    Page<Category> findByNameContaining(String keyWord, Pageable pageable);

    // ch ly category ang active
    Page<Category> findByActiveTrue(Pageable pageable);

    // kim tra trng tn
    boolean existsByNameIgnoreCase(String name);

    // Lc theo status
    Page<Category> findByActive(Boolean active, Pageable pageable);

    // Lc theo tn cha + status
    Page<Category> findByNameContainingIgnoreCaseAndActive(String keyword, Boolean active, Pageable pageable);

    // ly tt cha b xa
    Page<Category> findByDeletedFalse(Pageable pageable);

    // ly theo ID v ch b xa
    Optional<Category> findByIdAndDeleted(Long id, boolean deleted);

    // kim tra tn ti v ch b xa
    boolean existsByIdAndDeleted(Long id, boolean deleted);
}
