package com.example.vgashop.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vgashop.dto.AdminDashboardResponse;
import com.example.vgashop.repository.BrandRepository;
import com.example.vgashop.repository.CategoryRepository;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.PaymentRepository;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.example.vgashop.dto.OrderItemResponse;
import com.example.vgashop.dto.OrderResponse;
import com.example.vgashop.dto.OrderStatusUpdateRequest;
import com.example.vgashop.dto.OrderSummaryResponse;
import com.example.vgashop.dto.ProductAdminResponse;
import com.example.vgashop.dto.UserAdminResponse;
import com.example.vgashop.entity.Category;
import com.example.vgashop.entity.Role;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderItem;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.Brand;

import lombok.extern.java.Log;


// @Slf4j // để dùng logging
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final PaymentRepository paymentRepository;

    // Constructor injection

    public AdminService(BrandRepository brandRepository, CategoryRepository categoryRepository, OrderRepository orderRepository, PaymentRepository paymentRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }
    
    // DASHBOARD 
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {

        log.info("Admin đang lấy dữ liệu dashboard");

        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();

        Long totalUsers = userRepository.countByDeletedFalse();
        Long totalOrders = orderRepository.countByDeletedFalse();
        Long todayOrders = orderRepository.countTodayOrders(startOfToday);

        BigDecimal totalRevenue = paymentRepository.findTotalRevenue();
        BigDecimal todayRevenue = paymentRepository.findTodayRevenue(today.atStartOfDay());

        Long totalProducts = productRepository.countByDeletedFalse(); // đếm sản phẩm chưa bị xóa
        Long lowStockProducts = productRepository.countLowStock(10); // đếm sản phẩm có stock <= 10

        log.info("Dashboard data - Users: {}, Orders: {}, Today Orders: {}, Revenue: {}", 
                totalUsers, totalOrders, todayOrders, totalRevenue);

        return new AdminDashboardResponse(
            totalUsers != null ? totalUsers : 0L, // đảm bảo không trả về null
            totalOrders != null ? totalOrders : 0L,
            todayOrders != null ? todayOrders : 0L,
            totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
            todayRevenue != null ? todayRevenue : BigDecimal.ZERO,
            totalProducts != null ? totalProducts : 0L,
            lowStockProducts != null ? lowStockProducts : 0L,
            LocalDateTime.now() // thời gian cập nhật dữ liệu cuối cùng
        );
    }

    // quản lý người dùng
    @Transactional(readOnly = true)
    public Page<UserAdminResponse> getAllUsers(int page, int size, String sortBy, String direction) {
        log.info("Admin lấy danh sách user - page: {}, size: {}", page, size);

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<User> users = userRepository.findByDeletedFalse(pageable);

        // return users.map(user -> new UserAdminResponse(
        //     user.getId(),
        //     user.getUsername(),
        //     user.getEmail(),
        //     user.getFullName(),
        //     user.getPhone(),
        //     user.getRole(),
        //     user.getStatus(),
        //     user.isDeleted(),
        //     user.getCreatedAt(),
        //     user.getUpdatedAt()
        // ));

        Page<UserAdminResponse> result = users.map(user -> new UserAdminResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.isDeleted(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        ));

        log.info("Trả về {} users cho Admin", result.getTotalElements());
        return result;
    }

    // thay đổi role của user
    @Transactional
    public void changeUserRole(Long userId, String newRole) {
        log.info("Admin thay đổi role userId={} thành {}", userId, newRole);

        User user = userRepository.findByIdAndDeleted(userId, false)
            .orElseThrow(() -> new ResourceNotFoundException("KHông tìm thấy người dùng với ID: " + userId));

        try {
            user.setRole(Role.valueOf(newRole.toUpperCase()));
            userRepository.save(user);
            log.info("Đã thay đổi role userId={} thành {}", userId, newRole);
        } catch (IllegalArgumentException e) {
            log.error("Role không hợp lệ: {}", newRole);
            throw new IllegalArgumentException("Role không hợp lệ. Các Role hợp lệ là: ADMIN, USER, STAFF");
        }
    }

    // toggle trạng thái active/inactive của user
    @Transactional
    public void toggleUserStatus(Long userId) {
        log.info("Admin toggle status userId={}", userId);

        User user = userRepository.findByIdAndDeleted(userId, false)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user vói ID:" + userId));

        // nếu đang active thì chuyển thành inactive, ngược lại thì chuyển thành active
        // user.setStatus(!user.getStatus());
        // userRepository.save(user);

        boolean newStatus = !user.getStatus();
        user.setStatus(newStatus);
        userRepository.save(user);

        log.info("Đã thay đổi status userId={} thành {}", userId, newStatus);
    }

    // Quản lý Order
    @Transactional(readOnly = true)
    public Page<OrderSummaryResponse> getAllOrders(int page, int size, String sortBy, String direction) {
        log.info("Admin lấy danh sách tất cả đơn hàng - page: {}", page);

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Order> orders = orderRepository.findByDeletedFalse(pageable);

        // return orders.map(this::convertToOrderSummary);

        Page<OrderSummaryResponse> result = orders.map(this::convertToOrderSummary);

        log.info("Trả về {} đơn hàng cho Admin", result.getTotalElements());
        return result;
    }

    // cập nhật trạng thái đơn hàng
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        log.info("Admin cập nhật trạng thái đơn hàng {} thành {}", orderId, request.getStatus());

        Order order = orderRepository.findByIdAndDeletedFalse(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        order.setStatus(request.getStatus());

        // câp nhật thời gian tương ứng với trạng thái mới
        switch(request.getStatus()) {
            case CONFIRMED -> order.setConfirmedAt(LocalDateTime.now());
            case SHIPPING -> order.setShippedAt(LocalDateTime.now());
            case DELIVERED -> order.setDeliveredAt(LocalDateTime.now());
        }

        // return convertToOrderResponse(orderRepository.save(order));

        Order savedOrder = orderRepository.save(order);
        log.info("Đã cập nhật trạng thái đơn hàng {} thành {}", orderId, request.getStatus());

        return convertToOrderResponse(savedOrder);
    }

    // Quản lý product
    @Transactional(readOnly= true)
    public Page<ProductAdminResponse> getAllProductForAdmin(int page, int size) {

        log.info("Admin lấy danh sách sản phẩm - page: {}", page);

        Pageable pageable = PageRequest.of(page, size);
        
        Page<Product> products = productRepository.findByDeletedFalse(pageable);

        // return products.map(p -> new ProductAdminResponse(
        //     p.getId(),
        //     p.getName(),
        //     p.getPrice(),
        //     p.getStock(),
        //     p.getBrand() != null ? p.getBrand().getName() : "N/A",
        //     p.getCategory() != null ? p.getCategory().getName() : "N/A",
        //     p.getStatus(),
        //     p.getImgUrl()
        // ));

        Page<ProductAdminResponse> result = products.map(p -> new ProductAdminResponse(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getStock(),
                p.getBrand() != null ? p.getBrand().getName() : "N/A",
                p.getCategory() != null ? p.getCategory().getName() : "N/A",
                p.getStatus(),
                p.getImgUrl() != null ? p.getImgUrl() : ""
        ));

        log.info("Trả về {} sản phẩm cho Admin", result.getTotalElements());
        return result;
    }

    // cập nhật product Stock
    @Transactional
    public void updateProductStock(Long productId, Integer stock) {

        log.info("Admin cập nhật stock sản phẩm {} thành {}", productId, stock);

        Product products = productRepository.findByIdAndDeletedFalse(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        if (stock < 0) {
            log.warn("Stock âm không hợp lệ: {}", stock);
            throw new IllegalArgumentException("Stock không được âm");
        }

        products.setStock(stock);
        productRepository.save(products);

        log.info("Đã cập nhật stock sản phẩm {} thành {}", productId, stock);
    }

    // quản lý category và brand
    @Transactional(readOnly= true)
    public Page<Category> getAllCategoriesForAdmin(int page, int size) {
        log.info("Admin lấy danh sách category - page: {}", page);
        Pageable pageable = PageRequest.of(page, size);
        return categoryRepository.findByDeletedFalse(pageable);
    }

    @Transactional(readOnly= true)
    public Page<Brand> getAllBrandsForAdmin(int page, int size) {
        log.info("Admin lấy danh sách brand - page: {}", page);
        Pageable pageable = PageRequest.of(page, size);
        return brandRepository.findByDeletedFalse(pageable);
    }

    // CONVERT METHODS
    private OrderSummaryResponse convertToOrderSummary(Order order) {
        int totalItems = order.getItems().stream()
            .filter(item -> !item.isDeleted())
            .mapToInt(OrderItem::getQuantity)
            .sum();

        return new OrderSummaryResponse(
            order.getId(),
            order.getOrderCode(),
            order.getTotalAmount(),
            order.getStatus(),
            order.getPaymentStatus(),
            order.getCreatedAt(),
            totalItems
        );
    }

    private OrderResponse convertToOrderResponse(Order order) {
        // lấy danh sách OrderItemResponse từ OrderItem
        List<OrderItemResponse> itemResponses = order.getItems().stream()
            .filter(item -> !item.isDeleted())
            .map(item -> new OrderItemResponse(
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImgUrl(),
                item.getPrice(),
                item.getQuantity(),
                item.getSubtotal()
            ))
            .collect(Collectors.toList());

        return new OrderResponse(
            order.getId(),
            order.getOrderCode(),
            order.getTotalAmount(),
            order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO,
            order.getStatus(),
            order.getPaymentStatus(),
            order.getShippingAddress(),
            order.getPhone(),
            order.getNote() != null ? order.getNote() : "",
            order.getCreatedAt(),
            order.getConfirmedAt(),
            order.getShippedAt(),
            order.getDeliveredAt(),
            itemResponses
        );
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminService.class);

    // XÓA SẢN PHẨM (SOFT DELETE)
    @Transactional
    public void softDeleteProduct(Long productId) {
        log.info("Admin soft delete sản phẩm ID: {}", productId);

        Product product = productRepository.findByIdAndDeletedFalse(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        product.setDeleted(true);
        productRepository.save(product);

        log.info("Đã soft delete sản phẩm ID: {}", productId);
    }

    // THÊM CATEGORY TỪ ADMIN
    @Transactional
    public Category addCategories(Category category) {
        log.info("Admin thêm category mới: {}", category.getName());

        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new IllegalArgumentException("Tên danh mục đã tồn tại");
        }

        return categoryRepository.save(category);
    }

    // THÊM BRAND TỪ ADMIN
    @Transactional
    public Brand addBrand(Brand brand) {
        log.info("Admin thêm brand mới: {}", brand.getName());

        if (brandRepository.existsByNameIgnoreCase(brand.getName())) {
            throw new IllegalArgumentException("Tên thương hiệu đã tồn tại");
        }

        return brandRepository.save(brand);
    }
}