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
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.Brand;

@Service
public class AdminService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final PaymentRepository paymentRepository;

    // Constructor injection
    public AdminService(BrandRepository brandRepository, CategoryRepository categoryRepository,
            OrderRepository orderRepository, PaymentRepository paymentRepository, ProductRepository productRepository,
            UserRepository userRepository) {
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // DASHBOARD (ĐÃ ĐƯỢC FIX LOGIC TÍNH DỮ LIỆU THẬT 100%)
    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        log.info("Admin đang lấy dữ liệu dashboard");

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        // Lấy tất cả đơn hàng không bị xóa
        List<Order> allOrders = orderRepository.findAll().stream()
                .filter(o -> !o.isDeleted())
                .collect(Collectors.toList());

        long totalOrders = 0;
        long todayOrders = 0;
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal todayRevenue = BigDecimal.ZERO;

        for (Order o : allOrders) {
            // Chỉ tính những đơn hàng KHÔNG bị hủy
            if (o.getStatus() != OrderStatus.CANCELLED && o.getStatus() != OrderStatus.CANCEL_REQUESTED) {
                totalOrders++;
                BigDecimal amt = o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO;
                totalRevenue = totalRevenue.add(amt);

                // Nếu đơn hàng tạo từ 00:00 sáng nay trở đi
                if (o.getCreatedAt() != null && !o.getCreatedAt().isBefore(startOfToday)) {
                    todayOrders++;
                    todayRevenue = todayRevenue.add(amt);
                }
            }
        }

        Long totalUsers = userRepository.countByDeletedFalse();
        Long totalProducts = productRepository.countByDeletedFalse();

        // Đếm an toàn tránh lỗi SQL
        Long lowStockProducts = 0L;
        try {
            lowStockProducts = productRepository.countLowStock(10);
        } catch (Exception e) {
            log.warn("Lỗi đếm hàng tồn kho: {}", e.getMessage());
        }

        return new AdminDashboardResponse(
                totalUsers != null ? totalUsers : 0L,
                totalOrders,
                todayOrders,
                totalRevenue,
                todayRevenue,
                totalProducts != null ? totalProducts : 0L,
                lowStockProducts,
                LocalDateTime.now());
    }

    // quản lý người dùng
    @Transactional(readOnly = true)
    public Page<UserAdminResponse> getAllUsers(int page, int size, String sortBy, String direction) {
        log.info("Admin lấy danh sách user - page: {}, size: {}", page, size);

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<User> users = userRepository.findByDeletedFalse(pageable);

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
                user.getUpdatedAt()));

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

        switch (request.getStatus()) {
            case CONFIRMED -> order.setConfirmedAt(LocalDateTime.now());
            case SHIPPING -> order.setShippedAt(LocalDateTime.now());
            case DELIVERED -> order.setDeliveredAt(LocalDateTime.now());
        }

        Order savedOrder = orderRepository.save(order);
        log.info("Đã cập nhật trạng thái đơn hàng {} thành {}", orderId, request.getStatus());

        return convertToOrderResponse(savedOrder);
    }

    // Quản lý product
    @Transactional(readOnly = true)
    public Page<ProductAdminResponse> getAllProductForAdmin(int page, int size) {
        log.info("Admin lấy danh sách sản phẩm - page: {}", page);

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByDeletedFalse(pageable);

        Page<ProductAdminResponse> result = products.map(p -> new ProductAdminResponse(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getStock(),
                p.getBrand() != null ? p.getBrand().getName() : "N/A",
                p.getCategory() != null ? p.getCategory().getName() : "N/A",
                p.getStatus(),
                p.getImgUrl() != null ? p.getImgUrl() : ""));

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
    @Transactional(readOnly = true)
    public Page<Category> getAllCategoriesForAdmin(int page, int size) {
        log.info("Admin lấy danh sách category - page: {}", page);
        Pageable pageable = PageRequest.of(page, size);
        return categoryRepository.findByDeletedFalse(pageable);
    }

    @Transactional(readOnly = true)
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

        // 🌟 ĐÃ FIX: Bổ sung order.getFullName() và order.getPhone() cho khớp với DTO
        // mới
        return new OrderSummaryResponse(
                order.getId(),
                order.getOrderCode(),
                order.getFullName(),
                order.getPhone(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentStatus(),
                order.getCreatedAt(),
                totalItems);
    }

    private OrderResponse convertToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .filter(item -> !item.isDeleted())
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImgUrl(),
                        item.getPrice(),
                        item.getQuantity(),
                        item.getSubtotal()))
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
                itemResponses);
    }

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

    // 🌟 ADMIN LẤY CHI TIẾT ĐƠN HÀNG
    @Transactional(readOnly = true)
    public OrderResponse getOrderDetailsForAdmin(Long orderId) {
        Order order = orderRepository.findByIdAndDeletedFalse(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));
        return convertToOrderResponse(order);
    }

    // 🌟 API TỰ ĐỘNG TỔNG HỢP DỮ LIỆU BIỂU ĐỒ (CÓ LỌC THỜI GIAN ĐỘNG) 🌟
    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getDashboardCharts(String period) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate;

        java.util.Map<String, java.util.Map<String, Object>> timeStats = new java.util.LinkedHashMap<>();
        java.time.format.DateTimeFormatter dayFormatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM");

        // 1. Dựng khung thời gian (Trục X)
        if ("today".equals(period)) {
            startDate = now.toLocalDate().atStartOfDay(); // Lấy từ 00:00 sáng nay
            for (int i = 0; i <= 23; i++) {
                String label = String.format("%02d:00", i); // 00:00, 01:00... 23:00
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        } else if ("7days".equals(period)) {
            startDate = now.minusDays(6).toLocalDate().atStartOfDay();
            for (int i = 6; i >= 0; i--) {
                String label = now.minusDays(i).format(dayFormatter);
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        } else if ("1month".equals(period)) {
            startDate = now.minusDays(29).toLocalDate().atStartOfDay();
            for (int i = 29; i >= 0; i--) {
                String label = now.minusDays(i).format(dayFormatter);
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        } else if ("1year".equals(period)) {
            startDate = now.minusMonths(11).withDayOfMonth(1).toLocalDate().atStartOfDay();
            for (int i = 11; i >= 0; i--) {
                LocalDateTime m = now.minusMonths(i);
                String label = "T" + m.getMonthValue() + "/" + (m.getYear() % 100);
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        } else { // Mặc định là 6 tháng
            startDate = now.minusMonths(5).withDayOfMonth(1).toLocalDate().atStartOfDay();
            for (int i = 5; i >= 0; i--) {
                LocalDateTime m = now.minusMonths(i);
                String label = "T" + m.getMonthValue() + "/" + (m.getYear() % 100);
                java.util.Map<String, Object> data = new java.util.HashMap<>();
                data.put("name", label);
                data.put("revenue", BigDecimal.ZERO);
                data.put("delivered", 0);
                data.put("cancelled", 0);
                timeStats.put(label, data);
            }
        }

        // 2. Lấy đơn hàng và lấp đầy data
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> !o.isDeleted() && o.getCreatedAt() != null && !o.getCreatedAt().isBefore(startDate))
                .collect(Collectors.toList());

        java.util.Map<String, Integer> brandSales = new java.util.HashMap<>();

        for (Order order : orders) {
            String label;
            if ("today".equals(period)) {
                label = String.format("%02d:00", order.getCreatedAt().getHour());
            } else if ("7days".equals(period) || "1month".equals(period)) {
                label = order.getCreatedAt().format(dayFormatter);
            } else {
                label = "T" + order.getCreatedAt().getMonthValue() + "/" + (order.getCreatedAt().getYear() % 100);
            }

            if (timeStats.containsKey(label)) {
                java.util.Map<String, Object> data = timeStats.get(label);
                // Cộng tiền
                if (order.getStatus() == OrderStatus.DELIVERED || order.getPaymentStatus() == PaymentStatus.SUCCESS) {
                    BigDecimal currentRev = (BigDecimal) data.get("revenue");
                    data.put("revenue",
                            currentRev.add(order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO));
                }
                // Đếm trạng thái
                if (order.getStatus() == OrderStatus.DELIVERED) {
                    data.put("delivered", (Integer) data.get("delivered") + 1);
                } else if (order.getStatus() == OrderStatus.CANCELLED) {
                    data.put("cancelled", (Integer) data.get("cancelled") + 1);
                }
            }

            // Đếm Hãng
            if (order.getStatus() != OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCEL_REQUESTED) {
                if (order.getItems() != null) {
                    for (OrderItem item : order.getItems()) {
                        if (!item.isDeleted() && item.getProduct() != null && item.getProduct().getBrand() != null) {
                            String brandName = item.getProduct().getBrand().getName();
                            brandSales.put(brandName, brandSales.getOrDefault(brandName, 0) + item.getQuantity());
                        }
                    }
                }
            }
        }

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("chartData", new java.util.ArrayList<>(timeStats.values()));

        List<java.util.Map<String, Object>> brandDataList = brandSales.entrySet().stream()
                .map(e -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("name", e.getKey());
                    map.put("sold", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        response.put("brandData", brandDataList);
        return response;
    }
}