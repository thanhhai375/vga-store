package com.example.vgashop.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

import com.example.vgashop.dto.CreateOrderRequest;
import com.example.vgashop.dto.OrderItemResponse;
import com.example.vgashop.dto.OrderResponse;
import com.example.vgashop.dto.OrderSummaryResponse;
import com.example.vgashop.entity.Cart;
import com.example.vgashop.entity.CartItem;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderItem;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.CartRepository;
import com.example.vgashop.repository.OrderItemRepository;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.ProductRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.vgashop.dto.OrderStatusUpdateRequest;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private  final ProductRepository productRepository;
    private final UserService userService;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
            CartRepository cartRepository, ProductRepository productRepository, UserService userService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    // tạo đơn hàng từ giỏ hàng (Checkout)
    @Transactional
    public OrderResponse createOrderFromCart(CreateOrderRequest request) {
        User currentUser = userService.getCurrentUser(); // lấy User từ JWT

        // lấy giỏ hàng của user
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn  tải hoặc trống"));

        if (cart.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng đang trống, không thể tạo đơn hàng");
        }

        // tạo mã đơn hàng 
        String orderCode = "VGA-" + LocalDateTime.now().toLocalDate() + "_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = new Order();
        order.setUser(currentUser);
        order.setOrderCode(orderCode);
        order.setShippingAddress(request.getShippingAddress());
        order.setPhone(request.getPhone());
        order.setNote(request.getNote() != null ? request.getNote() : "");
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.UNPAID);

        // chuyển cartItem sang OrderItem và kiểm tra stock
        for (CartItem cartItem : cart.getCartItems()) {
            Product product = cartItem.getProduct();

            // kiểm tra stock
            if (product.getStock() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Sản phẩm '" + product.getName() + "' không đủ số lượng trong kho");
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice()); // lưu giá tại thời điểm mua
            orderItem.calculateSubtotal();

            order.getItems().add(orderItem);
            // trừ stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.calculateTotal();
        Order savedOrder = orderRepository.save(order);

        // xóa giỏ hàng sau khi tạo đơn (soft delete item và reset cart)
        cart.getCartItems().forEach(item -> item.setDeleted(true));
        cart.getCartItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);

        return convertTOrderResponse(savedOrder);
    } 

    // Lấy danh sách đơn hàng của user
    @Transactional(readOnly= true)
    public Page<OrderSummaryResponse> getMyOrders(int page, int size, String sortBy, String direction) {
        User user = userService.getCurrentUser();

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Order> ordersPage = orderRepository.findByUser_IdAndDeletedFalse(user.getId(), pageable);

        return ordersPage.map(this::convOrderSummaryResponse);
    }


    // xem chi tiết đơn hàng 
    @Transactional(readOnly= true)
    public OrderResponse getOrderById(Long orderId) {
        User currentUser = userService.getCurrentUser();

        Order order = orderRepository.findByIdAndUser_IdAndDeletedFalse(orderId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng hoặc bạn không có quyền xem"));

        return convertTOrderResponse(order);
    }

    // Hủy đơn hàng 
    @Transactional
    public OrderResponse cancelOrder(Long orderId) {
        User currentUser = userService.getCurrentUser();

        Order order = orderRepository.findByIdAndUser_IdAndDeletedFalse(orderId, currentUser.getId())
               .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new IllegalArgumentException("Chỉ có thể hủy đơn hàng ở trạng thái PENDING");
        }

        order.setStatus(OrderStatus.CANCELLED);

        // hoàn lại stock cho sp
        for (OrderItem orderItem : order.getItems()) {
            Product product = orderItem.getProduct();
            product.setStock(product.getStock() + orderItem.getQuantity());
            productRepository.save(product);
        }

        return convertTOrderResponse(orderRepository.save(order));
    }

    // Adimin: Cập nhật trạng thái đơn hàng 
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findByIdAndDeletedFalse(orderId)
               .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        OrderStatus oldStatus = order.getStatus();
        order.setStatus(request.getStatus());

        // cập nhật thời gian theo trạng thái
        switch (request.getStatus()) {
            case CONFIRMED -> order.setConfirmedAt(LocalDateTime.now());
            case SHIPPING -> order.setShippedAt(LocalDateTime.now());
            case DELIVERED -> order.setDeliveredAt(LocalDateTime.now());
            case CANCELLED -> {
                if (oldStatus != OrderStatus.CANCELLED) {
                    // hoàn lại stock nếu hủy đơn
                    for (OrderItem item : order.getItems()) {
                        Product product = item.getProduct();
                        product.setStock( product.getStock() + item.getQuantity());
                        productRepository.save(product);
                    }
                }
            }
        }
        return convertTOrderResponse(orderRepository.save(order));
    }

    //Admin: Lấy tất cả đơn hàng 
    @Transactional(readOnly= true)
    public Page<OrderSummaryResponse> getAllOrders(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Order> ordersPage = orderRepository.findByDeletedFalse(pageable);

        return ordersPage.map(this::convOrderSummaryResponse);
    }

    // convert method
    private OrderResponse convertTOrderResponse(Order order) {
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
            order.getDiscountAmount(),
            order.getStatus(),
            order.getPaymentStatus(),
            order.getShippingAddress(),
            order.getPhone(),
            order.getNote(),
            order.getCreatedAt(),
            order.getConfirmedAt(),
            order.getShippedAt(),
            order.getDeliveredAt(),
            itemResponses
        );
    }

    private OrderSummaryResponse convOrderSummaryResponse(Order order) {
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

}
