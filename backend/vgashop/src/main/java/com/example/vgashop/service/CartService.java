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
    private final UserService userService; // để lấy thông tin user từ SecurityContext

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, UserService userService) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userService = userService;
    }

    // lấy giỏ hàng của user hiện tại, nếu chưa có thì tạo mới
    @Transactional(readOnly= true)
    public CartResponse getMyCart() {
        // lấy user từ JWT token
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseGet(() -> createNewCartForUser(currentUser));

        return convertToCartResponse(cart);
    }

    // tạo giỏ hang mới cho user nếu chưa có
    private Cart createNewCartForUser(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setTotalAmount(BigDecimal.ZERO);
       return cartRepository.save(cart);
    }

    // thêm sản phẩm vào giỏ hàng
    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseGet(() -> createNewCartForUser(currentUser));

        Product product = productRepository.findByIdAndDeleted(request.getProductId(), false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        
        // kiểm tra stock nếu cần, hoặc các điều kiện khác trước khi thêm vào giỏ hàng
        if (product.getStock() < request.getQuantity()) {
            throw new IllegalArgumentException("Sản phẩm không đủ số lượng trong kho");
        }

        // logic thêm sản phẩm vào giỏ hàng, nếu đã có thì tăng số lượng, nếu chưa có thì tạo mới cart item
        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()) && !item.isDeleted())
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            // đã có sản phẩm trong giỏ hàng, tăng số lượng
            int newQuantity = existingItem.getQuantity() + request.getQuantity();
            if (newQuantity > product.getStock()) {
                throw new IllegalArgumentException("Sản phẩm không đủ số lượng trong kho");
            }
            existingItem.setQuantity(newQuantity);
            existingItem.calculateSubtotal(); // cập nhật subtotal của item
        } else {
            // thêm mới sản phẩm vào giỏ hàng
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            newItem.calculateSubtotal(); // tính subtotal của item
            cart.getCartItems().add(newItem);
        }

        cart.recalculateTotal(); // cập nhật tổng tiền của giỏ hàng
        cartRepository.save(cart);
        return convertToCartResponse(cart);
    }

    // cập nhật số lượng của item trong giỏ hàng, xóa item khỏi giỏ hàng, hoặc các chức năng khác liên quan đến giỏ hàng có thể thêm ở đây
    @Transactional
    public CartResponse updateCartItem(Long cartItemId, UpdateCartItemRequest request) {
        // logic cập nhật số lượng của item trong giỏ hàng, hoặc xóa item nếu số lượng mới là 0, sau đó cập nhật lại tổng tiền của giỏ hàng
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        // tìm cart item theo id và kiểm tra xem nó có thuộc về giỏ hàng của user hiện tại không
        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getId().equals(cartItemId) && !item.isDeleted())
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy item trong giỏ"));
        // nếu số lượng mới là 0 thì xóa item khỏi giỏ hàng
        if (request.getQuantity() <= 0) {
            cart.getCartItems().remove(cartItem);
        } else {
            // cập nhật số lượng và subtotal của item
            if (request.getQuantity() > cartItem.getProduct().getStock()) {
                throw new IllegalArgumentException("Vượt quá số lượng tồn kho của sản phẩm");
            }
            cartItem.setQuantity(request.getQuantity());
            cartItem.calculateSubtotal();
        }

        cart.recalculateTotal(); // cập nhật tổng tiền của giỏ hàng
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    // xóa item khỏi giỏ 
    @Transactional
    public CartResponse removeCartItem(Long cartItemId) {
        User currerentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currerentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        
        // tìm cart item theo id và kiểm tra xem nó có thuộc về giỏ hàng của user hiện tại không
        boolean removed = cart.getCartItems().removeIf(item -> item.getId().equals(cartItemId));

        if (!removed) {
            throw new ResourceNotFoundException("Không tìm thấy item trong giỏ");
        }

        cart.recalculateTotal(); // cập nhật tổng tiền của giỏ hàng
        cartRepository.save(cart);

        return convertToCartResponse(cart);
    }

    // xóa toàn bộ giỏ hàng của user, có thể dùng khi user muốn xóa giỏ hàng hoặc sau khi đặt hàng thành công
    @Transactional
    public void clearCart() {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndDeletedFalse(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));
        
        // đanh dấu tất cả cart item là đã xóa, hoặc xóa hẳn khỏi database nếu muốn
        cart.getCartItems().forEach(item -> item.setDeleted(true)); // đánh dấu tất cả item là đã xóa, khi lấy giỏ hàng sẽ không lấy những item đã bị xóa
        cart.getCartItems().clear(); // xóa tất cả item khỏi giỏ hàng
        cart.setTotalAmount(BigDecimal.ZERO); // reset tổng tiền về 0
        cartRepository.save(cart);

        // có thể làm cách này 
        // cart.isDeleted(true); // đánh dấu giỏ hàng là đã xóa, khi lấy giỏ hàng sẽ không lấy những giỏ hàng đã bị xóa
        // cartRepository.save(cart);

    }

    // chuyển đổi Cart entity sang CartResponse DTO để trả về cho client
    public CartResponse convertToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getCartItems().stream()
            .filter(item -> !item.isDeleted()) // chỉ lấy những item ch bị xóa
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
