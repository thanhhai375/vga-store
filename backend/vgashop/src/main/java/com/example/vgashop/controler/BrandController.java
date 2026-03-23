package com.example.vgashop.controler;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vgashop.entity.Brand;
import com.example.vgashop.service.BrandService;


@RestController
@RequestMapping("/api/brands")
@CrossOrigin
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    // get all
    @GetMapping
    public Page<Brand> getAll(
        @RequestParam(defaultValue= "0")
        int page,

        @RequestParam(defaultValue= "10")
        int size,

        @RequestParam(defaultValue= "id")
        String sortBy,

        @RequestParam(defaultValue= "asc") 
        String direction

    ) {
        return brandService.getAllBrands(page, size, sortBy, direction);
    }

    // lấy tất cả kh phân trang
    public List<Brand> getAllBrandNoPage() {
        return brandService.getAllNoPage();
    }

    // lấy 1 brand 
    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable Long id) {
        return brandService.getBrandId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // tìm kiếm
    @GetMapping("/search")
    public Page<Brand> search(
        @RequestParam String keyWord,

        @RequestParam(defaultValue= "0")
        int page,

        @RequestParam(defaultValue= "10")
        int size
    ) {
        return brandService.searchBrand(keyWord, page, size);
    }

    // tạo mới 
    @PostMapping
    public Brand create(
        @RequestBody Brand brand
    ) {
        return brandService.createBrand(brand);
    }

    // cập nhật
    @PutMapping("/{id}")
    public Brand update(@PathVariable Long id, @RequestBody Brand brand) {
        return brandService.updateBrand(id, brand);
    }

    // xóa
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return "Deleted successfully";
    }
}

