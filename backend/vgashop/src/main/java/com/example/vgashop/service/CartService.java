package com.example.vgashop.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vgashop.dto.CartResponse;
import com.example.vgashop.entity.User;
import com.example.vgashop.repository.CartItemRepository;
import com.example.vgashop.repository.CartRepository;
import com.example.vgashop.service.ProductService;
import com.example.vgashop.service.UserService;

import java.util.stream.Collectors;

import com.example.vgashop.dto.AddToCartRequest;
import com.example.vgashop.dto.CartItemResponse;
import com.example.vgashop.dto.UpdateCartItemRequest;
import com.example.vgashop.entity.Cart;
import com.example.vgashop.entity.CartItem;
import com.example.vgashop.entity.Product;
import com.example.vgashop.exception.ResourceNotFoundException;
import com.example.vgashop.repository.ProductRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService; // ly thng tin user t SecurityContext

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, UserService userService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    // ly gi hng ca user hin ti, nu cha c th to mi
    @Transactional(readOnly= true)
    public CartResponse getMyCart() {
        // ly user t JWT token
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseGet(() -> createNewCartForUser(currentUser));

        return convertToCartResponse(cart);
    }

    // to gi hang mi cho user nu cha c
    private Cart createNewCartForUser(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setTotalAmount(BigDecimal.ZERO);
       return cartRepository.save(cart);
    }

    // thm sn phm vo gi hng
    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseGet(() -> createNewCartForUser(currentUser));

        Product product = productRepository.findByIdAndDeleted(request.getProductId(), false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        
        // kim tra stock nu cn, hoc cc iu kin khc trc khi thm vo gi hng
        if (product.getStock() < request.getQuantity()) {
            throw new IllegalArgumentException("Sản phẩm không đủ số lượng trong kho");
        }

        // logic thm sn phm vo gi hng, nu  c th tng s lng, nu cha c th to mi cart item
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()) && !item.isDeleted())
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // c sn phm trong gi hng, tng s lng
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStock()) {
                throw new IllegalArgumentException("Sản phẩm không đủ số lượng trong kho");
            }
            existingItem.setQuantity(newQuantity);
            existingItem.calculateSubtotal(); // cp nht subtotal ca item
        } else {
            // thm mi sn phm vo gi hng
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            newItem.calculateSubtotal(); // tnh subtotal ca item
            cart.getCartItems().add(newItem);
        }

        cart.recalculateTotal(); // cp nht tng tin ca gi hng
        cartRepository.save(cart);
        return convertToCartResponse(cart);
    }

    // cp nht s lng ca item trong gi hng, xa item khi gi hng, hoc cc chc nng khc lin quan n gi hng c th thm  y
    @Transactional
    public CartResponse updateCartItem(Long cartItemId, UpdateCartItemRequest request) {
        // logic cp nht s lng ca item trong gi hng, hoc xa item nu s lng mi l 0, sau  cp nht li tng tin ca gi hng
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        // tm cart item theo id v kim tra xem n c thuc v gi hng ca user hin ti khng
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId) && !item.isDeleted())
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy item trong giỏ"));
        // nu s lng mi l 0 th xa item khi gi hng
        if (request.getQuantity() <= 0) {
            cart.getCartItems().remove(cartItem);
        } else {
            // cp nht s lng v subtotal ca item
            if (request.getQuantity() > cartItem.getProduct().getStock()) {
                throw new IllegalArgumentException("Vượt quá số lượng tồn kho của sản phẩm");
            }
            cartItem.setQuantity(request.getQuantity());
            cartItem.calculateSubtotal();
        }

        cart.recalculateTotal(); // cp nht tng tin ca gi hng
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    // xa item khi gi
    @Transactional
    public CartResponse removeCartItem(Long cartItemId) {
        User currerentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currerentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        
        // tm cart item theo id v kim tra xem n c thuc v gi hng ca user hin ti khng
        boolean removed = cart.getCartItems().removeIf(item -> item.getId().equals(cartItemId));

        if (!removed) {
            throw new ResourceNotFoundException("Không tìm thấy item trong giỏ");
        }

        cart.recalculateTotal(); // cp nht tng tin ca gi hng
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    // xa ton b gi hng ca user, c th dng khi user mun xa gi hng hoc sau khi t hng thnh cng
    @Transactional
    public void clearCart() {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        
        // anh du tt c cart item l  xa, hoc xa hn khi database nu mun
        cart.getCartItems().forEach(item -> item.setDeleted(true)); // nh du tt c item l  xa, khi ly gi hng s khng ly nhng item  b xa
        cart.getCartItems().clear(); // xa tt c item khi gi hng
        cart.setTotalAmount(BigDecimal.ZERO); // reset tng tin v 0
        cartRepository.save(cart);

        // c th lm cch ny
        // cart.isDeleted(true); // nh du gi hng l  xa, khi ly gi hng s khng ly nhng gi hng  b xa
        // cartRepository.save(cart);

    }

    // chuyn i Cart entity sang CartResponse DTO  tr v cho client
    public CartResponse convertToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getCartItems().stream()
            .filter(item -> !item.isDeleted()) // ch ly nhng item ch b xa
            .map(item -> new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getImgUrl(),
                item.getProduct().getPrice(),
                item.getQuantity(),
                item.getSubtotal()
            ))
            .collect(Collectors.toList());

        int totalItems = cart.getCartItems().stream()
            .filter(item -> !item.isDeleted())
            .mapToInt(CartItem::getQuantity)
            .sum();

        return new CartResponse(
            cart.getId(),
            cart.getTotalAmount(),
            totalItems,
            itemResponses
        );
    }
}
