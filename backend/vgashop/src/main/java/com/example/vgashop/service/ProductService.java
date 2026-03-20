package com.example.vgashop.service;

import org.springframework.boot.data.autoconfigure.web.DataWebProperties;

import com.example.vgashop.entity.Product;
import com.example.vgashop.repository.ProductRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // lấy tất cả có phân trang
    public Page<Product> getAllProducts(Pageable pageable) {
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
