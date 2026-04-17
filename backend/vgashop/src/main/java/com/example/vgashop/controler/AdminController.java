package com.example.vgashop.controler;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vgashop.dto.AdminDashboardResponse;
import com.example.vgashop.dto.OrderResponse;
import com.example.vgashop.dto.OrderStatusUpdateRequest;
import com.example.vgashop.dto.OrderSummaryResponse;
import com.example.vgashop.dto.ProductAdminResponse;
import com.example.vgashop.dto.ProductImageDTO;
import com.example.vgashop.dto.UserAdminResponse;
import com.example.vgashop.entity.Brand;
import com.example.vgashop.entity.Category;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.Review;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.repository.ReviewRepository;
import com.example.vgashop.service.AdminService;
import com.example.vgashop.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')") // Chỉ cho phép truy cập nếu có vai trò ADMIN
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final ReviewRepository reviewRepository;

    public AdminController(AdminService adminService, ProductService productService,
            ReviewRepository reviewRepository) {
        this.adminService = adminService;
        this.productService = productService;
        this.reviewRepository = reviewRepository;
    }

    // Dashboard, lấy dữ liệu tổng quan cho admin
    @GetMapping("/dashboard")
    public ApiResponse<AdminDashboardResponse> getDashboard() {
        AdminDashboardResponse dashboard = adminService.getDashboard();
        return ApiResponse.success("Lấy dashboard thành công", dashboard);
    }

    // Quản lấy User, lấy tất cả ng dùng
    @GetMapping("/users")
    public ApiResponse<Page<UserAdminResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<UserAdminResponse> users = adminService.getAllUsers(page, size, sortBy, direction);
        return ApiResponse.success("Lấy danh sách người dùng thành công", users);
    }

    // thay đổi Role của ng dùng
    @GetMapping("/users/{userId}/role")
    public ApiResponse<String> changeUserRole(@PathVariable Long userId, @RequestParam String role) {
        adminService.changeUserRole(userId, role);
        return ApiResponse.success("Cập nhật quyền người dùng thành công", "OK");
    }

    @PutMapping("/users/{userId}/status")
    public ApiResponse<String> toggleUserStatus(@PathVariable Long userId) {
        adminService.toggleUserStatus(userId);
        return ApiResponse.success("Cập nhật trạng thái người dùng thành công", "OK");
    }

    // ===== QUản lý Order
    // Admin xem tất cả đơn hàng
    @GetMapping("/orders")
    public ApiResponse<Page<OrderSummaryResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<OrderSummaryResponse> orders = adminService.getAllOrders(page, size, sortBy, direction);
        return ApiResponse.success("Lấy tất cả đơn hàng thành công", orders);
    }

    // Admin cập nhật trạng thái đơn hàng
    @PutMapping("/orders/{orderId}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse order = adminService.updateOrderStatus(orderId, request);
        return ApiResponse.success("Cập nhật trạng thái đơn hàng thành công", order);
    }

    // ======== Quản lý Product
    // Admin xem danh sách tất cả sản phẩm

    @GetMapping("/products")
    public ApiResponse<Page<ProductAdminResponse>> getAllProductsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<ProductAdminResponse> products = adminService.getAllProductForAdmin(page, size);
        return ApiResponse.success("Lấy danh sách sản phẩm thành công", products);
    }

    // Admin cập nhật số lượng tồn kho của sản phẩm
    @PutMapping("/products/{productID}/stock")
    public ApiResponse<String> updateProductStock(@PathVariable Long productId, @RequestParam Integer stock) {
        adminService.updateProductStock(productId, stock);
        return ApiResponse.success("Cập nhật số lượng tồn kho thành công", "OK");
    }

    // Admin soft delete sản phẩm
    @DeleteMapping("/products/{productId}")
    public ApiResponse<String> softDeleteProduct(@PathVariable Long productId) {
        adminService.softDeleteProduct(productId);
        return ApiResponse.success("Đã xóa mềm sản phẩm thành công", "OK");
    }

    // Admin lấy thông tin chi tiết 1 sản phẩm
    @GetMapping("/products/{productId}")
    public ApiResponse<Product> getProductById(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        return ApiResponse.success("Lấy sản phẩm thành công", product);
    }

    // Admin tạo sản phẩm mới (kèm upload ảnh)
    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Product> createProduct(@Valid @ModelAttribute ProductImageDTO dto) {
        Product saved = productService.createProductWithImage(dto);
        return ApiResponse.success("Tạo sản phẩm thành công", saved);
    }

    // Admin sửa sản phẩm (ảnh tuỳ chọn)
    @PutMapping(value = "/products/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Product> updateProduct(@PathVariable Long productId, @ModelAttribute ProductImageDTO dto) {
        Product updated = productService.updateProductWithImage(productId, dto);
        return ApiResponse.success("Cập nhật sản phẩm thành công", updated);
    }

    // QUẢN LÝ CATEGORY
    @GetMapping("/categories")
    public ApiResponse<Page<Category>> getAllCategoriesForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<Category> categorys = adminService.getAllCategoriesForAdmin(page, size);
        return ApiResponse.success("Lấy danh sách danh mục thành công", categorys);
    }

    // Admin thêm danh mục mới
    @PostMapping("/categories")
    public ApiResponse<Category> addCategory(@Valid @RequestBody Category category) {
        Category savedCategory = adminService.addCategories(category);
        return ApiResponse.success("Thêm danh mục thành công", savedCategory);
    }

    // QUẢN LÝ BRAND
    @GetMapping("/brands")
    public ApiResponse<Page<Brand>> getAllBrandsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<Brand> brands = adminService.getAllBrandsForAdmin(page, size);
        return ApiResponse.success("Lấy danh sách thương hiệu thành công", brands);
    }

    // Admin thêm thương hiệu mới
    @PostMapping("/brands")
    public ApiResponse<Brand> addBrand(@Valid @RequestBody Brand brand) {
        Brand savedBrand = adminService.addBrand(brand);
        return ApiResponse.success("Thêm thương hiệu thành công", savedBrand);
    }

    // QUẢN LÝ ĐÁNH GIÁ
    @GetMapping("/reviews")
    public ApiResponse<List<Review>> getAllReviews() {
        return ApiResponse.success("Lấy danh sách đánh giá thành công", reviewRepository.findAll());
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ApiResponse<String> deleteReview(@PathVariable Long reviewId) {
        reviewRepository.deleteById(reviewId);
        return ApiResponse.success("Đã xóa đánh giá", "OK");
    }

    @GetMapping("/orders/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getOrderDetailsForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getOrderDetailsForAdmin(id));
    }

    // Lấy dữ liệu động cho Biểu đồ
    @GetMapping("/dashboard/charts")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getDashboardCharts(
            @RequestParam(required = false, defaultValue = "6months") String period) {
        return ResponseEntity.ok(adminService.getDashboardCharts(period));
    }
}
