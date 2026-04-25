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

// Uttils class h tr to ch k s v Url cho VNPay
public class VNPayUtils {

    // to SecureHash (HMAC SHA256)  m bo tnh ton vn ca d liu khi gi n VNPay
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

    
    // to Url thanh ton VNPay (sanbox, production) da trn thng tin n hng v m giao dch
    /* 
@Param order // Thng tin n hng cn thanh ton
@Param transactionCode // M giao dch duy nht  xc nh n hng trong VNPay
@Param returnUrl // URL m VNPay s chuyn hng sau khi thanh ton xong (thng l trang kt qu thanh ton ca bn)
    */
    public static String createPaymentUrl(Order order, String transactionCode, String returnUrl) {
        String vnp_TmnCode = "Your_TmnCode"; // M website ca bn ti VNPay
        String vnp_HashSecret = "secret_key"; // Chui b mt  to ch k (thay bng key ca bn)
        String vnp_Url = "https:// sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // URL thanh ton VNPay (sandbox)
        // String vnp_Url = "https://pay.vnpayment.vn/vpcpay.html"; // Production

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", order.getTotalAmount().multiply(BigDecimal.valueOf(100)).toString()); // Vnpay yu cu s tin phi nhn vi 100
        vnp_Params.put("vnp_CurrCode", "VND");;
        vnp_Params.put("vnp_TxnRef", transactionCode);
        vnp_Params.put("vnp_orderInfo", "Thanh toán đơn hàng" + order.getOrderCode());
        vnp_Params.put("vnp_orderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", returnUrl);
        vnp_Params.put("vnp_IpAddr", "127.0.0.1"); // IP ca khch hng (c th ly t request). C th  tm l localhost, c th ly ip tht ca client t request.getRemoteAddr()

        // sp xp cc tham s theo th t tng dn ca key alphabet
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hasData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String fieldName : fieldNames) {
            String fieldvalue = vnp_Params.get(fieldName);
            if (fieldvalue != null && !fieldvalue.isEmpty()) {
                // to chui d liu  to ch k s
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

        // xa du & cui cng nu c
        if (query.length() > 0) {
            query.deleteCharAt(query.length() - 1);
        }

        String vnp_SecureHash = hmacSHA512(vnp_HashSecret, hasData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);

        return vnp_Url + "?" + query.toString();
    }

    // VERIFY SIGNATURE cho VNPay Callback. tr v true nu ch k hp l, false nu khng hp l ( m bo callback l t VNPay gi n ch khng phi gi mo)
    public static boolean verifySignature(Map<String, String> params, String hashSecret) {
        try {
            String vnp_SecureHash = params.get("vnp_SecureHash");
            if (vnp_SecureHash == null || vnp_SecureHash.isEmpty()) {
                return false;
            }

            // loi b tham s vnp_SecureHash khi d liu  to li ch k
            Map<String, String> paramsForHash = new HashMap<>(params);
            paramsForHash.remove(vnp_SecureHash);

            List<String> fieldNames = new ArrayList<>(paramsForHash.keySet()); // ly tt c key ca tham s (tr vnp_SecureHash)
            Collections.sort(fieldNames); // sp xp key theo th t alphabet

            StringBuilder hashData = new StringBuilder(); // to chui d liu  to ch k
            for (String fieldName : fieldNames) {
                String fieldValue = paramsForHash.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=').append(fieldValue).append('&');
                }
            }

            // xa du & cui cng nu c
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
