package com.example.vgashop.controler;

import com.example.vgashop.entity.Review;
import com.example.vgashop.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewRepository.findByProductIdOrderByCreatedAtDesc(productId));
    }

    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<Review>> getReviewsByBlog(@PathVariable Long blogId) {
        return ResponseEntity.ok(reviewRepository.findByBlogIdOrderByCreatedAtDesc(blogId));
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        // Normally you get user from token, but here we just take the review body
        // Ensure user is not null, default to something if needed or let client send valid user_id
        Review savedReview = reviewRepository.save(review);
        return ResponseEntity.ok(savedReview);
    }
}
