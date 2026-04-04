package com.example.vgashop.controler;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import com.example.vgashop.dto.CreateOrderRequest;
import com.example.vgashop.dto.OrderResponse;
import com.example.vgashop.dto.OrderStatusUpdateRequest;
import com.example.vgashop.dto.OrderSummaryResponse;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // USER: tạo đơn hàng tự giỏ hàng (checkout)
    @PostMapping("/checkout")
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse order = orderService.createOrderFromCart(request);
        return ApiResponse.success("Tạo đơn hàng thành công", order);
    }

    // USER: Lấy ds đơn hàng 
    @GetMapping
    public ApiResponse<Page<OrderSummaryResponse>> getMyOrders(
        @RequestParam(defaultValue= "0") int page,
        @RequestParam(defaultValue= "10") int size,
        @RequestParam(defaultValue= "createdAt") String sortBy,
        @RequestParam(defaultValue= "desc") String direction
    ) {
        Page<OrderSummaryResponse> orders = orderService.getMyOrders(page, size, sortBy, direction);
        return ApiResponse.success("Lấy danh sách đơn hàng thành công", orders);
    }

    // USER: xem chi tiết đơn hàng 
    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Long orderId) {
        OrderResponse order = orderService.getOrderById(orderId);
        return ApiResponse.success("Lấy chi tiết đơn hàng thành công", order);
    }

    // USER: Hủy đơn hàng 
    @PutMapping("/{orderId}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(@PathVariable Long orderId) {
        OrderResponse order = orderService.cancelOrder(orderId);
        return ApiResponse.success("Hủy đơn hàng thành công", order);
    }

    // Adim: lấy tất cả đơn hàng
    @GetMapping("/admin/all")
    public ApiResponse<Page<OrderSummaryResponse>> getAllOrders(
        @RequestParam(defaultValue= "0") int page,
        @RequestParam(defaultValue= "10") int size,
        @RequestParam(defaultValue= "createdAt") String sortBy,
        @RequestParam(defaultValue= "desc") String direction
    ) {
        Page<OrderSummaryResponse> orders = orderService.getAllOrders(page, size, sortBy, direction);
        return ApiResponse.success("Lấy tất cả đơn hàng thành công", orders);
    }

    // ADmin: cập nhật trạng thái đơn hàng
    @PutMapping("/admin/{orderId}/status") 
    public ApiResponse<OrderResponse> updateOrderStatus(@PathVariable Long orderId, @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderResponse order = orderService.updateOrderStatus(orderId, request);
        return ApiResponse.success("Cập nhật trạng thái đơn hàng thành công", order);
    }
}
