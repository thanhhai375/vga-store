package com.example.vgashop.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.vgashop.entity.Category;
import com.example.vgashop.repository.CategoryRepository;


@Service
public class CategoryService {

    
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // lấy tất cả
    public Page<Category> getAllCategories(Pageable pageable) {
        return  categoryRepository.findAll(pageable);
    }

    public Page<Category> getActiveCategories(Pageable pageable) {
        return categoryRepository.findByActiveTrue(pageable);
    }

    // get by id
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("không tìm thấy danh mục!"));
    }

    // tìm kiếm 
    public Page<Category> searchCategory(String keyWord, Pageable pageable) {
        // if (keyWord == null || keyWord.trim().isEmpty()) {
        //     return categoryRepository.getAllCategories(pageable);
        // }
        return categoryRepository.findByNameContaining(keyWord.trim(), pageable);
    }

    // tạo mới
    public Category createCategory(Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new RuntimeException("Tên danh mục '" + category.getName() + "' đã tồn tại!");
        }
        return categoryRepository.save(category);
    }

    // cập nhật
    public Category updateCategory(Long id, Category newCategory) {
        return categoryRepository.findById(id)
                .map(category -> {
                    // Check trùng tên nếu đổi tên
                    if (!category.getName().equalsIgnoreCase(newCategory.getName()) &&
                        categoryRepository.existsByNameIgnoreCase(newCategory.getName())) {
                        throw new RuntimeException("Tên danh mục '" + newCategory.getName() + "' đã tồn tại!");
                    }

                    category.setName(newCategory.getName());
                    category.setDescription(newCategory.getDescription());
                    category.setActive(newCategory.getActive());

                    return categoryRepository.save(category);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID " + id));
    }

    // xóa 
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy danh mục có ID " + id);
        }
        categoryRepository.findById(id);
    }
}
