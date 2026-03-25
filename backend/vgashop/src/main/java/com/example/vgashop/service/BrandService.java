package com.example.vgashop.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.vgashop.entity.Brand;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.BrandRepository;

// import jdk.jshell.spi.ExecutionControl;



@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    // get all
    public Page<Brand> getAllBrands(
        int page,
        int size,
        String sortBy,
        String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
        ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(page, size, sort);

        return brandRepository.findAll(pageable);
    }

    // lấy tất cả nhưng kh phân trang (dùng cho dropdown frontend)
    public List<Brand> getAllNoPage() {
        return brandRepository.findAll(Sort.by("name").ascending());
    }

    // lấy 1 brand theo id
    public Brand getBrandId(Long Id) {
        return brandRepository.findById(Id).orElseThrow(() ->
               new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + Id)
            );
    }

    // tìm kiếm 
    public Page<Brand> searchBrand(
        String keyWord,
        int page, int size
    ) {

        PageRequest pageable = PageRequest.of(page, size);

        return brandRepository.findByNameContaining(keyWord.trim(), pageable);
    }

    // tạo mới 
    public Brand createBrand(Brand brand) {
        if (brandRepository.existsByNameIgnoreCase(brand.getName())) {
            throw new DuplicateResourceException("Thương hiệu '" + brand.getName() + "' đã tồn tại!");
        }
        return  brandRepository.save(brand);
    }

    // cập nhật
    public Brand updateBrand(Long id, Brand newBrand) {
        // Brand brand = brandRepository.findById(id).orElse(null);

        // if (brand != null) {
        //     brand.setName(newBrand.getName());
        //     return brandRepository.save(brand);
        // }
        // return null;

        return brandRepository.findById(id)
        .map(brand -> {
            // kiểm tra trùng tên nếu đổi tên
            if (!brand.getName().equalsIgnoreCase(newBrand.getName()) && brandRepository.existsByNameIgnoreCase(newBrand.getName())) {
                throw new DuplicateResourceException("Tên thương hiệu '" + newBrand.getName() + "' đã tồn tại!");
            }
            brand.setName(newBrand.getName());
            return brandRepository.save(brand);
        })

        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + id));
    }

    // xóa 
    public void  deleteBrand(Long id) {

        if (!brandRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + id);
        }
        brandRepository.deleteById(id);
    }
}
