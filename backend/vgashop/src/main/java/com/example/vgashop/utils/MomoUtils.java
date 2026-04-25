package com.example.vgashop.utils;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.tomcat.util.buf.UEncoder;

import com.example.vgashop.entity.Order;


// Utility class hỗ trợ tạo chữ ký và URL thanh toán Momo
public class MomoUtils {

    public static String hmacSHA256(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
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
            throw new RuntimeException("Lỗi tạo chữ ký Momo", e);
        }
    }

    // tạo URl thanh toán Momo (sandbox)
    public static String createPaymentUrl(Order order, String transactionCode, String returnUrl) {
        String partnerCode = "Your Momo Partner Code"; // Mã đối tác của bạn tại Momo
        String accessKey = "Your Momo Access Key"; // Access key của bạn tại Momo
        String secretKey = "Your Momo Secret Key"; // Secret key của bạn tại Momo

        String requestId = transactionCode; // Mã giao dịch duy nhất
        String amount = order.getTotalAmount().toString(); // Số tiền thanh toán
        String orderInfo = "Thanh toán đơn hàng" + order.getOrderCode(); // Thông tin đơn hàng
        String redirectUrl = returnUrl; // URL khách hàng sẽ được chuyển đến sau khi thanh toán
        String ipnUrl = "http://localhost:8080/api/payment/momo/ipn"; // URL nhận thông báo thanh toán từ Momo (có thể để tạm là localhost, cần thay bằng URL thật khi triển khai)
        String requestType = "captureWallet"; // Loại yêu cầu (captureWallet cho thanh toán qua ví Momo)
        String extraData = ""; // Dữ liệu bổ sung (nếu có)

        String rawSignature = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + transactionCode +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType;

        String signature = hmacSHA256(secretKey, rawSignature);

        // trả về URl để frontend có thể redirect khach hàng đến Momo (thực tế thường gọi Post đến API Momo để lấy URL thanh toán, nhưng ở đây để đơn giản chúng ta sẽ tạo URL trực tiếp)
        return "https://test-payment.momo.vn/v2/gateway/api/create?" +
                "partnerCode=" + partnerCode +
                "&orderId=" + transactionCode +
                "&amount=" + amount +
                "&signature=" + signature;
    }

    // VERIFY SIGNATURE cho Momo Callback
    public static boolean verifySignature(Map<String, Object> params, String secretKey) {
        try {
            String receivedSignature = String.valueOf(params.get("signature")); // Chữ ký nhận được từ Momo
            if (receivedSignature == null || receivedSignature.isEmpty()) {
                return false; // Nếu không có chữ ký, trả về false
            }

            // tạo chuỗi raw data để tạo chữ ký từ các tham số nhận được (trừ chữ ký)
            String rawSignature = "accessKey=" + params.get("accessKey") +
                    "&amount=" + params.get("amount") +
                    "&extraData=" + params.get("extraData") +
                    "&ipnUrl=" + params.get("ipnUrl") +
                    "&orderId=" + params.get("orderId") +
                    "&orderInfo=" + params.get("orderInfo") +
                    "&partnerCode=" + params.get("partnerCode") +
                    "&redirectUrl=" + params.get("redirectUrl") +
                    "&requestId=" + params.get("requestId") +
                    "&requestType=" + params.get("requestType");

            String calculatedSignature = hmacSHA256(secretKey, rawSignature);
            return calculatedSignature.equals(receivedSignature);
            
        } catch (Exception e) {
            return false; // Nếu có lỗi trong quá trình xác thực, trả về false
        }
    }
}
