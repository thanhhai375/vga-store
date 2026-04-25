package com.example.vgashop.controler;

import com.example.vgashop.dto.CreateOrderRequest;
import com.example.vgashop.dto.OrderRequest;
import com.example.vgashop.dto.OrderResponse;
import com.example.vgashop.dto.OrderStatusUpdateRequest;
import com.example.vgashop.dto.OrderSummaryResponse;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ===================================
    // API T NHNH HEAD (GI T FRONTEND MI CA PROFILE)
    // ===================================

/** t hng trc tip khng qua Cart  yu cu ng nhp (JWT) */
    @PostMapping
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest req, Authentication authentication) {
        try {
            String username = authentication.getName();
            Map<String, Object> result = orderService.placeOrder(req, username);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

/** Lch s n hng ca user dng cho Profile Page */
    @GetMapping("/my")
    public ResponseEntity<?> getMyOrdersList(Authentication authentication) {
        try {
            String username = authentication.getName();
            return ResponseEntity.ok(orderService.getUserOrders(username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ===================================
    // API T NHNH BE (CART CHECKOUT, ADMIN, CHI TIT)
    // ===================================

    // USER: to n hng t gi hng (checkout)
    @PostMapping("/checkout")
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse order = orderService.createOrderFromCart(request);
        return ApiResponse.success("Tạo đơn hàng thành công", order);
    }

    // USER: Ly ds n hng (phn trang cho h thng c/mobile)
    @GetMapping
    public ApiResponse<Page<OrderSummaryResponse>> getMyOrdersPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<OrderSummaryResponse> orders = orderService.getMyOrders(page, size, sortBy, direction);
        return ApiResponse.success("Lấy danh sách đơn hàng thành công", orders);
    }

    // USER: xem chi tit n hng
    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Long orderId) {
        OrderResponse order = orderService.getOrderById(orderId);
        return ApiResponse.success("Lấy chi tiết đơn hàng thành công", order);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id, @RequestParam(required = false) String reason) {
        // Truyn reason xung Service
        return ResponseEntity.ok(orderService.cancelOrder(id, reason));
    }

    // Adim: ly tt c n hng
    @GetMapping("/admin/all")
    public ApiResponse<Page<OrderSummaryResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<OrderSummaryResponse> orders = orderService.getAllOrders(page, size, sortBy, direction);
        return ApiResponse.success("Lấy tất cả đơn hàng thành công", orders);
    }

    // ADmin: cp nht trng thi n hng
    @PutMapping("/admin/{orderId}/status")
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable Long orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse order = orderService.updateOrderStatus(orderId, request);
        return ApiResponse.success("Cập nhật trạng thái đơn hàng thành công", order);
    }
}
