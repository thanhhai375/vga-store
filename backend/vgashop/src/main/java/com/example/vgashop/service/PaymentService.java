package com.example.vgashop.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import com.example.vgashop.dto.PaymentRequest;
import com.example.vgashop.dto.PaymentResponse;
import com.example.vgashop.dto.PaymentSummaryResponse;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.entity.Payment;
import com.example.vgashop.entity.PaymentStatus;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.PaymentRepository;
import com.example.vgashop.service.UserService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import com.example.vgashop.utils.MomoUtils;
import com.example.vgashop.utils.VNPayUtils;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserService userService;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository,
            UserService userService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.userService = userService;
    }

    // Order
    @Transactional
    public PaymentResponse createPayment(Long orderId, PaymentRequest request) {
        User user = userService.getCurrentUser();
        Order order = orderRepository.findByIdAndUser_IdAndDeletedFalse(orderId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng"));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new IllegalArgumentException("Không thể tạo thanh toán cho đơn hàng đã hủy");
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(order.getTotalAmount());
        payment.setPaymentStatus(PaymentStatus.PENDING);

        String transactionCode = "PAY-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
        payment.setTransactionCode(transactionCode);


        String returnUrl = "http://localhost:5173/payment/vnpay-callback";

        // Process
        switch (request.getPaymentMethod()) {
            case COD:
                payment.setNote("Thanh toán khi nhận hàng (COD)");
                payment.setPaymentStatus(PaymentStatus.PENDING);
                break;

            case BANK_TRANSFER:
                payment.setNote("Chuyển khoản ngân hàng. Nội dung: " + order.getOrderCode());
                payment.setPaymentStatus(PaymentStatus.PENDING);
                break;

            case VNPAY:
                payment.setPaymentUrl(VNPayUtils.createPaymentUrl(order, transactionCode, returnUrl));
                payment.setNote("Thanh toán qua VNPay");
                break; // Required

            case MOMO:
                payment.setPaymentUrl(MomoUtils.createPaymentUrl(order, transactionCode, returnUrl));
                payment.setNote("Thanh toán qua " + request.getPaymentMethod());
                break;
        }
        Payment savedPayment = paymentRepository.save(payment);
        return convertToPaymentResponse(savedPayment);
    }

    // Update existing
    @Transactional
    public PaymentResponse updatePaymentStatus(Long paymentId, PaymentStatus newStatus, String transactionCode) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thanh toán"));

        payment.setPaymentStatus(newStatus);

        if (newStatus == PaymentStatus.SUCCESS) {
            payment.setPaidAt(LocalDateTime.now());
            // Order
            Order order = payment.getOrder();
            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        // Update existing
        if (transactionCode != null && !transactionCode.isEmpty()) {
            payment.setTransactionCode(transactionCode);
        }

        Payment saved = paymentRepository.save(payment);
        return convertToPaymentResponse(saved);
    }

    // Order
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        User currentUser = userService.getCurrentUser();

        Payment payment = paymentRepository.findByOrder_IdAndDeletedFalse(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin cho đơn hàng này"));

        return convertToPaymentResponse(payment);
    }

    // Payment
    @Transactional(readOnly = true)
    public Page<PaymentSummaryResponse> getPaymentsByStatus(PaymentStatus status, int size, int page, String sortBy,
            String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Payment> payments = paymentRepository.findByPaymentStatusAndDeletedFalse(status, pageable);
        return payments.map(this::convertToPaymentSummaryResponse);
    }

    // By ID
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thanh toán"));

        return convertToPaymentResponse(payment);
    }

    // Payment
    @Transactional(readOnly = true)
    public Page<PaymentSummaryResponse> getMyPayments(int size, int page, String sortBy, String direction) {
        User currentUser = userService.getCurrentUser();

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Payment> payments = paymentRepository.findByOrder_User_IdAndDeletedFalse(currentUser.getId(), pageable);
        return payments.map(this::convertToPaymentSummaryResponse);
    }

    // Retrieve all
    @Transactional(readOnly = true)
    public Page<PaymentSummaryResponse> getAllPayments(int size, int page, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Payment> payments = paymentRepository.findByDeletedFalse(pageable);
        return payments.map(this::convertToPaymentSummaryResponse);
    }

    // convert method
    private PaymentResponse convertToPaymentResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getOrder().getId(),
                payment.getOrder().getOrderCode(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getTransactionCode(),
                payment.getPaymentUrl(),
                payment.getPaidAt(),
                payment.getNote());
    }

    private PaymentSummaryResponse convertToPaymentSummaryResponse(Payment payment) {
        return new PaymentSummaryResponse(
                payment.getId(),
                payment.getOrder().getOrderCode(),
                payment.getAmount(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getCreatedAt());
    }
}
