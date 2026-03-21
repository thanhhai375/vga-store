package com.example.vgashop.service;

import java.util.List;

import org.springframework.boot.data.autoconfigure.web.DataWebProperties;

import com.example.vgashop.entity.Product;
import com.example.vgashop.repository.ProductRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
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

    // tìm kiếm 
    public Page<Product> searchProducts(String keyWord, Pageable pageable) {
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
        return productRepository.save(product);
    }

    // cập nhật
    public Product updateProduct(Long id, Product newProduct) {
        Product product = productRepository.findById(id).orElse(null);

        if (product != null) {
            product.setName(newProduct.getName());
            product.setPrice(newProduct.getPrice());
            product.setStock(newProduct.getStock());
            product.setDescription(newProduct.getDescription());
            product.setImgUrl(newProduct.getImgUrl());
            product.setBrand(newProduct.getBrand());

            return productRepository.save(product);
        }

        return null;
    }

    // xóa sản phẩm
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
