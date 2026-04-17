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

    //User: tạo thanh toán cho đơn hàng
    @PostMapping("/orders/{orderId}")
    public ApiResponse<PaymentResponse> createPayment(@PathVariable Long orderId, @Valid @RequestBody PaymentRequest request) {
        PaymentResponse paymentResponse = paymentService.createPayment(orderId, request);
        return ApiResponse.success("Tạo yêu cầu thanh toán thành công", paymentResponse);
    }

    // USER: xem thanh toán của 1 đơn hàng
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

    // ADMIN: lấy tất cả thanh toán
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

    // ADMIN: lấy chi tiết thanh toán
    @GetMapping("/admin/{paymentId}")
    public ApiResponse<PaymentResponse> getPaymentById(@PathVariable Long paymentId) {
        PaymentResponse paymentResponse = paymentService.getPaymentById(paymentId);
        return ApiResponse.success("Lấy chi tiết thanh toán thành công", paymentResponse);
    }

    // Loc theo trạng thái thanh toán
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

    // ADMIN: cập nhật trạng thái thanh toán
    @PostMapping("/admin/{paymentId}/status")
    public ApiResponse<PaymentResponse> updatePaymentStatus(
        @PathVariable Long paymentId,
        @RequestParam PaymentStatus status,
        @RequestParam(required = false) String transactionCode
    ) {
        PaymentResponse payments = paymentService.updatePaymentStatus(paymentId, status, transactionCode);
        return ApiResponse.success("Cập nhật trạng thái thanh toán thành công", payments);
    }

    // Callback URl nhân thông báo thanh toán từ VNPay. dùng getmapping vì vnpay gửi callback bằng phương thức GET với dữ liễu ở dạng query params trên URL
    @GetMapping("/vnpay/callback")
    public ApiResponse<String> vnpayCallback(@RequestParam Map<String, String> params) {
        try {
            // xử lý callback từ VNPay
            String vnp_ResponseCode = params.get("vnp_ResponseCode"); // 00 = thành công, các mã khác là thất bại hoặc hủy
            String vnp_TxnRef = params.get("vnp_TxnRef"); // Mã giao dịch duy nhất mà mình đã gửi cho VNPay khi tạo yêu cầu thanh toán, giờ VNPay sẽ trả lại để mình biết đơn hàng nào đã thanh toán thành công
            String secureHash = params.get("vnp_secureHash"); // Chữ ký số do VNPay trả về, mình sẽ dùng để xác thực dữ liệu callback có hợp lệ hay không (để tránh giả mạo)

            // VERIFY SIGNATURE - BẢO MẬT
            boolean isValidSignature = VNPayUtils.verifySignature(params, "YOUR_HASH_SECRET"); // ← Thay bằng Hash Secret thật

            if (!isValidSignature) {
                return ApiResponse.error("Chữ ký VNPay không hợp lệ - Có thể bị tấn công giả mạo");
            }

            if ("00".equals(vnp_ResponseCode)) {
                // thanh toán Vnpay thành công, cập nhật trạng thái thanh toán
                Payment payment = paymentRepository.findByTransactionCodeAndDeletedFalse(vnp_TxnRef)
                        // .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thanh toán với mã giao dịch: " + vnp_TxnRef));
                        .orElse(null);

                if (payment != null) {
                    payment.setPaymentStatus(PaymentStatus.SUCCESS);
                    payment.setPaidAt(LocalDateTime.now());
                    paymentRepository.save(payment);

                    // cập nhật trạng thái đơn hàng thành confirmed
                    Order order = payment.getOrder();
                    order.setStatus(OrderStatus.CONFIRMED);
                    orderRepository.save(order); // cập nhật trạng thái đơn hàng thành confirmed

                    return ApiResponse.success("Thanh toán VNPay thành công", "Ok");
                }
            }

            return ApiResponse.success("Thanh toán VNPay thất bại hoặc đã hủy", "FALSE");
        } catch (Exception e) {
            return ApiResponse.error("Lỗi xử lý callback VNPay: " + e.getMessage());
        } 
    }

    // Callback URl nhân thông báo thanh toán từ Momo. dùng postmapping vì momo gửi callback bằng phương thức POST với dữ liệu ở dạng JSON trong body request
    @PostMapping("/momo/callback")
    public ApiResponse<String> momoCallback(@RequestBody Map<String, Object> params) {
        // xử lý callback từ Momo
        try {
            String resultCode = String.valueOf(params.get("resultCode")); // Momo trả về resultCode = 0 nếu thanh toán thành công
            String orderId = String.valueOf(params.get("orderId")); // orderId mình gửi cho Momo khi tạo yêu cầu thanh toán, giờ Momo sẽ trả lại để mình biết đơn hàng nào đã thanh toán thành công
            // String signature = String.valueOf(params.get("signature")); // Chữ ký số do Momo trả về, mình sẽ dùng để xác thực dữ liệu callback có hợp lệ hay không (để tránh giả mạo)

            // VERIFY SIGNATURE - BẢO MẬT
            String secretKey = "YOUR_MOMO_SECRET_KEY"; // ← Thay bằng Secret Key thật của Momo

        // VERIFY SIGNATURE
        boolean isValidSignature = MomoUtils.verifySignature(params, secretKey);

        if (!isValidSignature) {
            return ApiResponse.error("Chữ ký Momo không hợp lệ - Có thể bị tấn công giả mạo");
        }

            if ("0".equals(resultCode)) {
                // thanh toán Momo thành công, cập nhật trạng thái thanh toán
                Payment payment = paymentRepository.findByTransactionCodeAndDeletedFalse(orderId)
                        // .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thanh toán với mã giao dịch: " + orderId));
                        .orElse(null);

                if (payment != null) {
                    payment.setPaymentStatus(PaymentStatus.SUCCESS);
                    payment.setPaidAt(LocalDateTime.now());
                    paymentRepository.save(payment);

                    Order order = payment.getOrder();
                    if (order != null) {
                        order.setStatus(OrderStatus.CONFIRMED);
                        orderRepository.save(order); // cập nhật trạng thái đơn hàng thành confirmed

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
