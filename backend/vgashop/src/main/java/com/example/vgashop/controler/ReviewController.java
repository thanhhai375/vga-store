package com.example.vgashop.controler;

import com.example.vgashop.entity.Review;
import com.example.vgashop.repository.ReviewRepository;
import com.example.vgashop.repository.ProductRepository;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Collections;
import java.util.stream.Collectors;
import java.security.Principal;
import com.example.vgashop.entity.User;
import com.example.vgashop.entity.Product;
import com.example.vgashop.entity.OrderStatus;
import com.example.vgashop.repository.OrderItemRepository;

/**
 * REST controller for managing product and blog reviews.
 * Provides endpoints for creating, fetching, and validating reviews.
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired private ReviewRepository reviewRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BlogRepository blogRepository;
    @Autowired private OrderItemRepository orderItemRepository;

    /**
     * Maps a Review entity to a flat DTO map to avoid circular JSON references.
     * Resolves the display name by prioritizing the authenticated user's full name,
     * falling back to username, then guest name.
     */
    private Map<String, Object> toDto(Review r) {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", r.getId());
        dto.put("rating", r.getRating());
        dto.put("comment", r.getComment());
        dto.put("createdAt", r.getCreatedAt());

        // Resolve display name: prefer full name, fallback to username, then guest name
        String displayName = r.getGuestName();
        if (r.getUser() != null) {
            String fn = r.getUser().getFullName();
            String un = r.getUser().getUsername();
            displayName = (fn != null && !fn.isBlank()) ? fn : un;
        }
        dto.put("guestName", displayName != null ? displayName : "Customer");

        // Include avatar URL for frontend rendering (Google OAuth avatar or null)
        dto.put("avatar", (r.getUser() != null && r.getUser().getAvatar() != null)
                          ? r.getUser().getAvatar() : null);

        // Include minimal user info to avoid serializing the full User entity
        if (r.getUser() != null) {
            Map<String, Object> u = new LinkedHashMap<>();
            u.put("id", r.getUser().getId());
            u.put("username", r.getUser().getUsername());
            u.put("fullName", r.getUser().getFullName());
            dto.put("user", u);
        } else {
            dto.put("user", null);
        }

        // Include minimal product info
        if (r.getProduct() != null) {
            Map<String, Object> p = new LinkedHashMap<>();
            p.put("id", r.getProduct().getId());
            p.put("name", r.getProduct().getName());
            dto.put("product", p);
        }
        return dto;
    }

    /**
     * Returns all reviews for a given product, sorted by creation date descending.
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Map<String, Object>>> getReviewsByProduct(@PathVariable Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return ResponseEntity.ok(reviews.stream().map(this::toDto).collect(Collectors.toList()));
    }

    /**
     * Returns all reviews for a given blog post, sorted by creation date descending.
     */
    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<Map<String, Object>>> getReviewsByBlog(@PathVariable Long blogId) {
        List<Review> reviews = reviewRepository.findByBlogIdOrderByCreatedAtDesc(blogId);
        return ResponseEntity.ok(reviews.stream().map(this::toDto).collect(Collectors.toList()));
    }

    /**
     * Creates a new review. Resolves associated Product, Blog, and User entities
     * from IDs provided in the request body. Uses @Transactional to keep the
     * session open during entity lazy loading.
     */
    @PostMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> createReview(@RequestBody Review review) {
        if (review.getProduct() != null && review.getProduct().getId() != null) {
            review.setProduct(productRepository.findById(review.getProduct().getId()).orElse(null));
        }
        if (review.getBlog() != null && review.getBlog().getId() != null) {
            review.setBlog(blogRepository.findById(review.getBlog().getId()).orElse(null));
        }
        if (review.getUser() != null && review.getUser().getId() != null) {
            review.setUser(userRepository.findById(review.getUser().getId()).orElse(null));
        }
        Review saved = reviewRepository.save(review);
        Review full = reviewRepository.findById(saved.getId()).orElse(saved);
        return ResponseEntity.ok(toDto(full));
    }

    /**
     * Checks whether the authenticated user is eligible to review a product.
     * Eligibility requires: (1) the user has a DELIVERED order containing the product,
     * and (2) the user has not already submitted a review for this product.
     */
    @GetMapping("/can-review/{productId}")
    public ResponseEntity<Boolean> canReview(@PathVariable Long productId, Principal principal) {
        if (principal == null) return ResponseEntity.ok(false);
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.ok(false);

        boolean hasPurchased = orderItemRepository.existsByOrder_User_IdAndOrder_StatusAndProduct_Id(
            user.getId(), OrderStatus.DELIVERED, productId
        );
        boolean hasReviewed = reviewRepository.existsByUser_IdAndProduct_Id(user.getId(), productId);

        return ResponseEntity.ok(hasPurchased && !hasReviewed);
    }

    /**
     * Returns a list of products that the authenticated user has received
     * (via a DELIVERED order) but has not yet reviewed.
     */
    @GetMapping("/pending")
    public ResponseEntity<List<Map<String, Object>>> getPendingReviews(Principal principal) {
        if (principal == null) return ResponseEntity.ok(Collections.emptyList());
        User user = userRepository.findByUsername(principal.getName()).orElse(null);
        if (user == null) return ResponseEntity.ok(Collections.emptyList());

        List<Product> pending = productRepository.findProductsPendingReview(user.getId());

        List<Map<String, Object>> result = pending.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("imgUrl", p.getImgUrl());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
