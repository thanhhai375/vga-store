package com.example.vgashop.controler;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

import com.example.vgashop.entity.Product;
import com.example.vgashop.service.ProductService;

import jakarta.websocket.server.PathParam;
import java.util.List;


@RestController
@RequestMapping("api/products")
@CrossOrigin
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // get all + pagination
    @GetMapping
    public Page<Product> getAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "5") int size,
        @RequestParam(defaultValue= "id") String sortBy,
        @RequestParam(defaultValue= "asc") String direction
    ) {
        // return productService.getAllProducts(PageRequest.of(page, size));

        return productService.getAllProducts(page, size, sortBy, direction);
    }

    // tìm kiếm 
    @GetMapping("/search")
    public Page<Product> search(
        @RequestParam String keyWord,
        @RequestParam(defaultValue= "0") int page,
        @RequestParam(defaultValue= "5") int size
    ) {
        return productService.searchProducts(keyWord, PageRequest.of(page, size));
    }

    // lọc brand
    public Page<Product> filterBrand(@RequestParam String brand) {
        return productService.filterByBrand(brand);
    }

    // tìm kiếm và lọc
    @GetMapping("/filter")
    public Page<Product> searchAndFilter(
        @RequestParam String keyWord,
        @RequestParam String brand,
        @RequestParam(defaultValue= "0") int page,
        @RequestParam(defaultValue= "5") int size
    ) {
        return productService.searchAndFilter(keyWord, brand, PageRequest.of(page, size));
    }

    // filter đầy đủ
    @GetMapping("/filter")
    public Page<Product> filter(

        @RequestParam(required= false)
        String keyWord,

        @RequestParam(required= false)
        List<Long> brandIds,

        @RequestParam(required= false)
        Double minPrice,

        @RequestParam(required= false)
        Double maxPrice,

        @RequestParam(defaultValue = "0")
        int page,
        @RequestParam(defaultValue = "5")
        int size,
        @RequestParam(defaultValue= "id")
        String sortBy,
        @RequestParam(defaultValue= "asc")
        String direction

    ) {
        return productService.filterProducts(keyWord, brandIds, minPrice, maxPrice, page, size, sortBy, direction);
    }

    // tạo mới
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.creatProduct(product);
    }

    // cập nhật
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    // xóa
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Deleted Successfully";
    }
}
