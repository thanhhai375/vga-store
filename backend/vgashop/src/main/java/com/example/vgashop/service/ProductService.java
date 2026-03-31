package com.example.vgashop.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.vgashop.dto.ProductDTO;
import com.example.vgashop.entity.Product;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.dto.ProductImageDTO;

@Service
public class ProductService {

    private final CategoryService categoryService;
    private final BrandService brandService;
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository, BrandService brandService, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.brandService = brandService;
        this.categoryService = categoryService;
    }

    // lấy tất cả có phân trang
    // public Page<Product> getAllProducts(Pageable pageable) {
    //     return productRepository.findAll(pageable);
    // }

    public Page<Product> getAllProducts(
        int page,
        int size,
        String sortBy,
        String direction
    ) {
        // Sort sort;

        // if (direction.equalsIgnoreCase("desc")) {
        //     sort = Sort.by(sortBy).descending();
        // } else {
        //     sort = Sort.by(sortBy).ascending();
        // }

        Sort sort = direction.equalsIgnoreCase("desc")
        ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(page, size, sort);

        return productRepository.findAll(pageable);
    }

    // lấy 1 sp theo id
    // nếu kh thì thấy Id trả về ResourceNotFoundException
    public Product getProductById(Long id) {
        return productRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> 
                    new ResourceNotFoundException("Không tìm thấy sản phẩm với ID " + id)
                );
    }

    // tìm kiếm 
    public Page<Product> searchProducts(String keyWord, Pageable pageable) {
        if (keyWord == null || keyWord.trim().isEmpty()) {
            return productRepository.findAll(pageable);
        }
        return productRepository.findByNameContaining(keyWord, pageable);
    }

    // lọc brand
    public Page<Product> filterByBrand(String brand) {
        return productRepository.findByBrand_Name(brand, Pageable.unpaged());
    }

    // lọc + tìm kiếm
    public Page<Product> searchAndFilter(String keyWord, String brand, Pageable pageable) {
        return productRepository.findByNameContainingAndBrand_Name(keyWord, brand, pageable);
    }

    // lọc sản phẩm
    public Page<Product> filterProducts(
        String keyWord,
        List<Long> brandId,
        Double minPrice,
        Double maxPrice,
        int page,
        int size,
        String sortBy,
        String direction
    ) {

        // xử lý giá trị null/dèault

        // if (keyWord == null) {
        //     keyWord = "";
        // }

        // if (minPrice == null) {
        //     minPrice = 0.0;
        // }

        // if (maxPrice == null) {
        //     maxPrice = Double.MAX_VALUE;
        // }

        keyWord = (keyWord == null) ? "" : keyWord;
        minPrice = (minPrice == null) ? 0.0 : minPrice;
        maxPrice = (maxPrice == null) ? Double.MAX_VALUE : maxPrice;

        // Sort sort;

        // if (direction.equalsIgnoreCase("desc")) {
        //     sort = Sort.by(sortBy).descending();
        // } else {
        //     sort = Sort.by(sortBy).ascending();
        // }

        Sort sort = direction.equalsIgnoreCase("desc")
        ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        PageRequest pageable = PageRequest.of(page, size, sort);

        if (brandId == null || brandId.isEmpty()) {
            return productRepository.findByNameContainingAndPriceBetween(keyWord, minPrice, maxPrice, pageable);
        }

        return productRepository.findByNameContainingAndBrand_IdInAndPriceBetween(keyWord, brandId, minPrice, maxPrice, pageable);
    }

    // tạo mới
    public Product creatProduct(Product product) {
        if (productRepository.existsByNameIgnoreCase(product.getName())) {
            throw new DuplicateResourceException("Sản phẩm với tên '" + product.getName() + "' đã tồn tại!");
        }

        // 2. Kiểm tra SKU bị trùng (nếu có nhập SKU)
        if (product.getSku() != null && !product.getSku().trim().isEmpty()) {
            if (productRepository.existsBySkuIgnoreCase(product.getSku().trim())) {
                throw new DuplicateResourceException("Sku '" + product.getSku() + "' đã tồn tại!");
            }
        }

        // kiểm tra giá hợp lệ
        if (product.getPrice() == null || product.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Giá sản phẩm phải lớn hơn 0");
        }

        // kiểm tra stock hợp lệ
        if (product.getStock() == null || product.getStock() < 0) {
            throw new IllegalArgumentException("Số lượng tồn kho không thể âm!");
        }

        // kiểm tra tên sản phẩm kh được để trống
        if (product.getName() == null || product.getName().isEmpty()) {
            throw new IllegalArgumentException("Tên sản phẩm không để trống!");
        }
        return productRepository.save(product);
    }

    // cập nhật
    public Product updateProduct(Long id, Product newProduct) {
        // Product product = productRepository.findById(id).orElse(null);

        // if (product != null) {
        //     product.setName(newProduct.getName());
        //     product.setPrice(newProduct.getPrice());
        //     product.setStock(newProduct.getStock());
        //     product.setDescription(newProduct.getDescription());
        //     product.setImgUrl(newProduct.getImgUrl());
        //     product.setBrand(newProduct.getBrand());

        //     return productRepository.save(product);
        // }

        // return null;
        return productRepository.findByIdAndDeletedFalse(id)
                .map(product -> {
                    product.setName(newProduct.getName());
                    product.setPrice(newProduct.getPrice());
                    product.setStock(newProduct.getStock());
                    product.setDescription(newProduct.getDescription());
                    product.setImgUrl(newProduct.getImgUrl());
                    product.setBrand(newProduct.getBrand());
                    product.setCategory(newProduct.getCategory());

                    return productRepository.save(product);
                })
                .orElseThrow(() -> new ResourceNotFoundException("không tìm thấy sản phẩm với ID " + id));
    }

    // xóa sản phẩm
    public void deleteProduct(Long id) {
        if (!productRepository.existsByIdAndDeletedFalse(id)) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm với ID " + id);
        }
        // productRepository.deleteById(id);
        Product product = productRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID " + id));

        product.setDeleted(true);
        productRepository.save(product);
    }

    // tạo sản phẩm kèm upload ảnh
    public Product createProductWithImage(ProductImageDTO dto) {
        // upload ảnh và lấy URL
        String imgUrl = uploadImageFile(dto.getImageFile());

        Product product = new Product();
        product.setName(dto.getName());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setDescription(dto.getDescription());
        product.setImgUrl(imgUrl);
        product.setSku(dto.getSku());

        if (dto.getBrandId() != null) {
            product.setBrand(brandService.getBrandId(dto.getBrandId()));
        }

        if (dto.getCategoryId() != null) {
            product.setCategory(categoryService.getCategoryById(dto.getCategoryId()));
        }

        return productRepository.save(product);
    }

    // method hỗ trọ upload ảnh
    private String uploadImageFile(MultipartFile file) {
        // logic lưu file vào thư mục uploads và trả về URL truy cập
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File ảnh không được để trống!");
        }

        try {
            String uplaodDir = "uploads/products/";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uplaodDir);

            // tạo thư mục nếu chưa tồn tại
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }

            //tạo tên file unique để tránh trùng lặp
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String fileName = System.currentTimeMillis() + "_" + originalFileName;

            java.nio.file.Path filePath = uploadPath.resolve(fileName);

            // luu file vào thư mục
            file.transferTo(filePath.toFile());

            return "/uploads/products/" + fileName; // URL truy cập ảnh
        } catch (Exception e) {
            throw new RuntimeException("Không thể upload file ảnh: " + e.getMessage(), e);
        }
    }
}
