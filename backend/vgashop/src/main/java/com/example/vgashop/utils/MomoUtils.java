package com.example.vgashop.utils;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.tomcat.util.buf.UEncoder;

import com.example.vgashop.entity.Order;


// Utility class h tr to ch k v URL thanh ton Momo
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

    // to URl thanh ton Momo (sandbox)
    public static String createPaymentUrl(Order order, String transactionCode, String returnUrl) {
        String partnerCode = "Your Momo Partner Code"; // M i tc ca bn ti Momo
        String accessKey = "Your Momo Access Key"; // Access key ca bn ti Momo
        String secretKey = "Your Momo Secret Key"; // Secret key ca bn ti Momo

        String requestId = transactionCode; // M giao dch duy nht
        String amount = order.getTotalAmount().toString(); // S tin thanh ton
        String orderInfo = "Thanh toán đơn hàng" + order.getOrderCode(); // Thng tin n hng
        String redirectUrl = returnUrl; // URL khch hng s c chuyn n sau khi thanh ton
        String ipnUrl = "http:// localhost:8080/api/payment/momo/ipn"; // URL nhn thng bo thanh ton t Momo (c th  tm l localhost, cn thay bng URL tht khi trin khai)
        String requestType = "captureWallet"; // Loi yu cu (captureWallet cho thanh ton qua v Momo)
        String extraData = ""; // D liu b sung (nu c)

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

        // tr v URl  frontend c th redirect khach hng n Momo (thc t thng gi Post n API Momo  ly URL thanh ton, nhng  y  n gin chng ta s to URL trc tip)
        return "https://test-payment.momo.vn/v2/gateway/api/create?" +
                "partnerCode=" + partnerCode +
                "&orderId=" + transactionCode +
                "&amount=" + amount +
                "&signature=" + signature;
    }

    // VERIFY SIGNATURE cho Momo Callback
    public static boolean verifySignature(Map<String, Object> params, String secretKey) {
        try {
            String receivedSignature = String.valueOf(params.get("signature")); // Ch k nhn c t Momo
            if (receivedSignature == null || receivedSignature.isEmpty()) {
                return false; // Nu khng c ch k, tr v false
            }

            // to chui raw data  to ch k t cc tham s nhn c (tr ch k)
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
            return false; // Nu c li trong qu trnh xc thc, tr v false
        }
    }
}
