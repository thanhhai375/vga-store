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
        // return brandRepository.findById(Id).orElseThrow(() ->
        //        new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + Id)
        //     );

        return brandRepository.findByIdAndDeletedFalse(Id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + Id));
    }

    // tìm kiếm 
    public Page<Brand> searchBrand(
        String keyWord,
        int page, int size
    ) {

        if (keyWord == null || keyWord.trim().isEmpty()) {
            return getAllBrands(page, size, "name", "asc");
        }
        PageRequest pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        return brandRepository.findByNameContaining(keyWord.trim(), pageable);
    }

    // lọc thương hiệu (tên + status)
    public Page<Brand> filterBrands(String keyWord, Boolean status, int page, int size, String sortBy, String direction) {
        keyWord = (keyWord == null) ? "" : keyWord.trim();

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(page, size, sort);
        if (keyWord.isEmpty() && status == null) {
            return brandRepository.findAll(pageable);
        }

        if (keyWord.isEmpty()) {
            return brandRepository.findByStatus(status, pageable);
        }

        if (status == null) {
            return brandRepository.findByNameContaining(keyWord, pageable);
        }

        // lọc cả tên + status
        return brandRepository.findByNameContainingIgnoreCaseAndStatus(keyWord, status, pageable);
    }

    // tạo mới 
    public Brand createBrand(Brand brand) {
        if (brandRepository.existsByNameIgnoreCase(brand.getName())) {
            throw new DuplicateResourceException("Thương hiệu '" + brand.getName() + "' đã tồn tại!");
        }

        // tự động sinh slug nếu ch có
        if (brand.getSlug() == null || brand.getSlug().trim().isEmpty()) {
            brand.setSlug(generateSlug(brand.getName()));
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

        return brandRepository.findByIdAndDeletedFalse(id)
        .map(brand -> {
            // kiểm tra trùng tên nếu đổi tên
            if (!brand.getName().equalsIgnoreCase(newBrand.getName()) && brandRepository.existsByNameIgnoreCase(newBrand.getName())) {
                throw new DuplicateResourceException("Tên thương hiệu '" + newBrand.getName() + "' đã tồn tại!");
            }
            brand.setName(newBrand.getName());
            brand.setLogo(newBrand.getLogo());
            brand.setDescription(newBrand.getDescription());
            brand.setStatus(newBrand.getStatus());

            // cập nhật slug nếu tên thay đổi và slug chưa set
            if (!brand.getName().equalsIgnoreCase(newBrand.getName()) && (newBrand.getSlug() == null || newBrand.getSlug().trim().isEmpty())) {
                brand.setSlug(generateSlug(newBrand.getName()));
            } else if(newBrand.getSlug() != null) {
                brand.setSlug(newBrand.getSlug());
            }
            return brandRepository.save(brand);
        })

        .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + id));
    }

    // xóa 
    public void  deleteBrand(Long id) {

        // if (!brandRepository.existsById(id)) {
        //     throw new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + id);
        // }
        // brandRepository.deleteById(id);
       if (!brandRepository.existsByIdAndDeletedFalse(id)) {
        throw new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + id);
    }

    // Lấy Brand ra để set deleted = true
    Brand brand = brandRepository.findByIdAndDeletedFalse(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu với ID " + id));

    brand.setDeleted(true);           // Soft delete
    brandRepository.save(brand);
    }

    // hàm tự sinh slug
    private String generateSlug(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "";
        }
        return name.toLowerCase()
                   .trim()
                   .replaceAll("\\s+", "-")
                   .replaceAll("[^a-z0-9-]", "");
    }
}
