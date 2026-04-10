package com.example.vgashop.service;

import com.example.vgashop.dto.OrderRequest;
import com.example.vgashop.entity.Order;
import com.example.vgashop.entity.OrderItem;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.User;
import com.example.vgashop.repository.OrderRepository;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Map<String, Object> placeOrder(OrderRequest req, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("Chờ xác nhận");
        order.setFullName(req.getFullName());
        order.setPhone(req.getPhone());
        order.setAddress(req.getAddress());
        order.setNote(req.getNote());

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (OrderRequest.OrderItemRequest itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại: " + itemReq.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            double unitPrice = itemReq.getPrice() != null
                    ? itemReq.getPrice()
                    : product.getPrice().doubleValue();
            item.setPrice(unitPrice);
            items.add(item);
            total += item.getPrice() * item.getQuantity();
        }

        order.setTotalPrice(total);
        order.setOrderItems(items);
        Order saved = orderRepository.save(order);

        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("orderId", saved.getId());
        resp.put("status", saved.getStatus());
        resp.put("totalPrice", saved.getTotalPrice());
        resp.put("fullName", req.getFullName());
        resp.put("phone", req.getPhone());
        resp.put("address", req.getAddress());
        return resp;
    }

    public List<Map<String, Object>> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Order order : orderRepository.findByUserIdOrderByIdDesc(user.getId())) {
            Map<String, Object> o = new LinkedHashMap<>();
            o.put("id", order.getId());
            o.put("status", order.getStatus());
            o.put("totalPrice", order.getTotalPrice());
            o.put("itemCount", order.getOrderItems() != null ? order.getOrderItems().size() : 0);
            result.add(o);
        }
        return result;
    }
}
