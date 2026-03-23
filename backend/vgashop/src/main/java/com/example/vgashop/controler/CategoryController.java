package com.example.vgashop.controler;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vgashop.entity.Category;
import com.example.vgashop.service.CategoryService;


@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // lấy tất cả có phân trang + sort
    public Page<Category> getAll(
        @RequestParam(defaultValue= "0")
        int page,
        @RequestParam(defaultValue= "10") int size,
        @RequestParam(defaultValue= "name") String sortBy,
        @RequestParam(defaultValue= "asc") String direction
    )  {
        Sort sort = direction.equalsIgnoreCase("desc")
             ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

         PageRequest pageable = PageRequest.of(page, size, sort);
         return categoryService.getAllCategories(pageable);
    }

    // lấy danh mục đang active
    @GetMapping("/active")
    public Page<Category> getActive(
        @RequestParam(defaultValue= "0")
        int page,
        @RequestParam(defaultValue= "10")
        int size
    ) {
        return categoryService.getActiveCategories(PageRequest.of(page, size));
    }

    // tìm kiếm 
    @GetMapping("/search")
    public Page<Category> searchCategorys(
        @RequestParam String keyWord,
        @RequestParam(defaultValue= "0")
        int page,
        @RequestParam(defaultValue= "10")
        int size
    ) {
        return categoryService.searchCategory(keyWord, PageRequest.of(page, size));
    }

    // lấy 1 danh mục theo id
    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // tạo mới
    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    // cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category newCategory) {
        return ResponseEntity.ok(categoryService.updateCategory(id, newCategory));
    }

    // xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
