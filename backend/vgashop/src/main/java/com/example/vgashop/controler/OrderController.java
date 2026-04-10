package com.example.vgashop.controler;

import com.example.vgashop.dto.OrderRequest;
import com.example.vgashop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /** Đặt hàng — yêu cầu đăng nhập (JWT) */
    @PostMapping
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest req,
                                         Authentication authentication) {
        try {
            String username = authentication.getName();
            Map<String, Object> result = orderService.placeOrder(req, username);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /** Lịch sử đơn hàng của user đang đăng nhập */
    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(Authentication authentication) {
        try {
            String username = authentication.getName();
            return ResponseEntity.ok(orderService.getUserOrders(username));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
