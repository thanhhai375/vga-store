package com.example.vgashop.utils;
import java.math.BigDecimal;
import java.net.URLEncoder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.example.vgashop.entity.Order;
import java.nio.charset.StandardCharsets;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.tomcat.util.buf.UDecoder;
import org.springframework.data.repository.query.Param;

// Uttils class hỗ trợ tạo chữ ký số và Url cho VNPay
public class VNPayUtils {

    // tạo SecureHash (HMAC SHA256) để đảm bảo tính toàn vẹn của dữ liệu khi gửi đến VNPay
    public static String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo chữ ký VNPay", e);
        }
    }

    
    // tạo Url thanh toán VNPay (sanbox, production) dựa trên thông tin đơn hàng và mã giao dịch
    /* 
    @Param order // Thông tin đơn hàng cần thanh toán
    @Param transactionCode // Mã giao dịch duy nhất để xác định đơn hàng trong VNPay
    @Param returnUrl // URL mà VNPay sẽ chuyển hướng sau khi thanh toán xong (thường là trang kết quả thanh toán của bạn)
    */
    public static String createPaymentUrl(Order order, String transactionCode, String returnUrl) {
        String vnp_TmnCode = "Your_TmnCode"; // Mã website của bạn tại VNPay
        String vnp_HashSecret = "secret_key"; // Chuỗi bí mật để tạo chữ ký (thay bằng key của bạn)
        String vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // URL thanh toán VNPay (sandbox)
        // String vnp_Url = "https://pay.vnpayment.vn/vpcpay.html"; // Production

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", order.getTotalAmount().multiply(BigDecimal.valueOf(100)).toString()); // Vnpay yêu cầu số tiền phải nhân với 100
        vnp_Params.put("vnp_CurrCode", "VND");;
        vnp_Params.put("vnp_TxnRef", transactionCode);
        vnp_Params.put("vnp_orderInfo", "Thanh toán đơn hàng" + order.getOrderCode());
        vnp_Params.put("vnp_orderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", "127.0.0.1"); // IP của khách hàng (có thể lấy từ request). Có thể để tạm là localhost, có thể lấy ip thật của client từ request.getRemoteAddr()

        // sắp xếp các tham số theo thứ tự tăng dần của key alphabet
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hasData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldvalue = vnp_Params.get(fieldName);
            if (fieldvalue != null && !fieldvalue.isEmpty()) {
                // tạo chuỗi dữ liệu để tạo chứ ký số
                hasData.append(fieldName).append('=').append(fieldvalue);
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                     .append('=')
                     .append(URLEncoder.encode(fieldvalue, StandardCharsets.UTF_8));
                if (fieldNames.indexOf(fieldName) < fieldNames.size() - 1) {
                    hasData.append('&');
                    query.append('&');
                } 
            }
        }

        // xóa dấu & cuối cùng nếu có
        if (query.length() > 0) {
            query.deleteCharAt(query.length() - 1);
        }

        String vnp_SecureHash = hmacSHA512(vnp_HashSecret, hasData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        return vnp_Url + "?" + query.toString();
    }

    // VERIFY SIGNATURE cho VNPay Callback. trả về true nếu chữ ký hợp lệ, false nếu không hợp lệ (để đảm bảo callback là từ VNPay gửi đến chứ không phải giả mạo)
    public static boolean verifySignature(Map<String, String> params, String hashSecret) {
        try {
            String vnp_SecureHash = params.get("vnp_SecureHash");
            if (vnp_SecureHash == null || vnp_SecureHash.isEmpty()) {
                return false;
            }

            // loại bỏ tham số vnp_SecureHash khỏi dữ liệu để tạo lại chữ ký
            Map<String, String> paramsForHash = new HashMap<>(params);
            paramsForHash.remove(vnp_SecureHash);

            List<String> fieldNames = new ArrayList<>(paramsForHash.keySet()); // lấy tất cả key của tham số (trừ vnp_SecureHash)
            Collections.sort(fieldNames); // sắp xếp key theo thứ tự alphabet

            StringBuilder hashData = new StringBuilder(); // tạo chuỗi dữ liệu để tạo chữ ký
            for (String fieldName : fieldNames) {
                String fieldValue = paramsForHash.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=').append(fieldValue).append('&');
                }
            }

            // xóa dấu & cuối cùng nếu có
            if (hashData.length() > 0) {
                hashData.deleteCharAt(hashData.length() - 1);
            }

            String calculatedHash = hmacSHA512(hashSecret, hashData.toString());
            return calculatedHash.equalsIgnoreCase(vnp_SecureHash);
        } catch (Exception e) {
            return false;
        }
    }
}
