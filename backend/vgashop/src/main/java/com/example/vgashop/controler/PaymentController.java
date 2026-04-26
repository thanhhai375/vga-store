package com.example.vgashop.controler;

import com.example.vgashop.repository.OrderRepository;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vgashop.dto.PaymentRequest;
import com.example.vgashop.dto.PaymentResponse;
import com.example.vgashop.dto.PaymentSummaryResponse;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.Payment;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.repository.PaymentRepository;
import com.example.vgashop.service.PaymentService;
import com.example.vgashop.utils.MomoUtils;
import com.example.vgashop.utils.VNPayUtils;

import java.util.Map;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    public PaymentController(PaymentService paymentService, PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentService = paymentService;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    // Order
    @PostMapping("/orders/{orderId}")
    public ApiResponse<PaymentResponse> createPayment(@PathVariable Long orderId, @Valid @RequestBody PaymentRequest request) {
        PaymentResponse paymentResponse = paymentService.createPayment(orderId, request);
        return ApiResponse.success("Tạo yêu cầu thanh toán thành công", paymentResponse);
    }

    // Order
    @GetMapping
    public ApiResponse<Page<PaymentSummaryResponse>> getMyPayments(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue= "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String direction 
    ) {
        Page<PaymentSummaryResponse> payments = paymentService.getMyPayments(size, page, sortBy, direction);
        return ApiResponse.success("Lấy danh sách thanh toán thành công", payments);
    }

    // Retrieve all
    @GetMapping("/admin/all")
    public ApiResponse<Page<PaymentSummaryResponse>> getAllPayments(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue= "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String direction
    ) {
        Page<PaymentSummaryResponse> payments = paymentService.getAllPayments(size, page, sortBy, direction);
        return ApiResponse.success("Lấy danh sách thanh toán thành công", payments);
    }

    // Payment
    @GetMapping("/admin/{paymentId}")
    public ApiResponse<PaymentResponse> getPaymentById(@PathVariable Long paymentId) {
        PaymentResponse paymentResponse = paymentService.getPaymentById(paymentId);
        return ApiResponse.success("Lấy chi tiết thanh toán thành công", paymentResponse);
    }

    // Payment
    @GetMapping("/admin/status")
    public ApiResponse<Page<PaymentSummaryResponse>> getPaymentsByStatus(
        @RequestParam PaymentStatus status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue= "createdAt") String sortBy,
        @RequestParam(defaultValue = "desc") String direction
    ) {
        Page<PaymentSummaryResponse> payments = paymentService.getPaymentsByStatus(status, size, page, sortBy, direction);
        return ApiResponse.success("Lấy danh sách thanh toán theo trạng thái thành công", payments);
    }

    // Update existing
    @PostMapping("/admin/{paymentId}/status")
    public ApiResponse<PaymentResponse> updatePaymentStatus(
        @PathVariable Long paymentId,
        @RequestParam PaymentStatus status,
        @RequestParam(required = false) String transactionCode
    ) {
        PaymentResponse payments = paymentService.updatePaymentStatus(paymentId, status, transactionCode);
        return ApiResponse.success("Cập nhật trạng thái thanh toán thành công", payments);
    }

    // Payment
    @GetMapping("/vnpay/callback")
    public ApiResponse<String> vnpayCallback(@RequestParam Map<String, String> params) {
        try {
            // Process
            String vnp_ResponseCode = params.get("vnp_ResponseCode"); // Success
            String vnp_TxnRef = params.get("vnp_TxnRef"); // Order
            String secureHash = params.get("vnp_secureHash");

            // Security
            boolean isValidSignature = VNPayUtils.verifySignature(params, "YOUR_HASH_SECRET");

            if (!isValidSignature) {
                return ApiResponse.error("Chữ ký VNPay không hợp lệ - Có thể bị tấn công giả mạo");
            }

            if ("00".equals(vnp_ResponseCode)) {
                // Update existing
                Payment payment = paymentRepository.findByTransactionCodeAndDeletedFalse(vnp_TxnRef)
                        // Payment
                        .orElse(null);

                if (payment != null) {
                    payment.setPaymentStatus(PaymentStatus.SUCCESS);
                    payment.setPaidAt(LocalDateTime.now());
                    paymentRepository.save(payment);

                    // Update existing
                    Order order = payment.getOrder();
                    order.setStatus(OrderStatus.CONFIRMED);
                    orderRepository.save(order); // Update existing

                    return ApiResponse.success("Thanh toán VNPay thành công", "Ok");
                }
            }

            return ApiResponse.success("Thanh toán VNPay thất bại hoặc đã hủy", "FALSE");
        } catch (Exception e) {
            return ApiResponse.error("Lỗi xử lý callback VNPay: " + e.getMessage());
        } 
    }

    // Payment
    @PostMapping("/momo/callback")
    public ApiResponse<String> momoCallback(@RequestBody Map<String, Object> params) {
        // Process
        try {
            String resultCode = String.valueOf(params.get("resultCode")); // Payment
            String orderId = String.valueOf(params.get("orderId")); // Order


            // Security
            String secretKey = "YOUR_MOMO_SECRET_KEY";

        // VERIFY SIGNATURE
        boolean isValidSignature = MomoUtils.verifySignature(params, secretKey);

        if (!isValidSignature) {
            return ApiResponse.error("Chữ ký Momo không hợp lệ - Có thể bị tấn công giả mạo");
        }

            if ("0".equals(resultCode)) {
                // Update existing
                Payment payment = paymentRepository.findByTransactionCodeAndDeletedFalse(orderId)
                        // Payment
                        .orElse(null);

                if (payment != null) {
                    payment.setPaymentStatus(PaymentStatus.SUCCESS);
                    payment.setPaidAt(LocalDateTime.now());
                    paymentRepository.save(payment);

                    Order order = payment.getOrder();
                    if (order != null) {
                        order.setStatus(OrderStatus.CONFIRMED);
                        orderRepository.save(order); // Update existing

                    }
                    return ApiResponse.success("Thanh toán momo thành cônng", "OK");
                }
            }
            return ApiResponse.success("Thanh toán Momo thất bại hoặc đã hủy", "FALSE");
        } catch (Exception e) {
            return ApiResponse.error("Lỗi xử lý callback Momo: " + e.getMessage());
        }
    }
}
