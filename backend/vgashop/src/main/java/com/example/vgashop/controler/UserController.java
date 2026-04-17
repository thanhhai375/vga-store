package com.example.vgashop.controler;

import com.example.vgashop.dto.ChangePasswordRequest;
import com.example.vgashop.dto.UserProfileRequest;
import com.example.vgashop.dto.UserProfileResponse;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(Principal principal) {
        UserProfileResponse profile = userService.getUserProfile(principal.getName());
        return ResponseEntity.ok(new ApiResponse<>(true, "Success", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(Principal principal, @RequestBody UserProfileRequest request) {
        UserProfileResponse profile = userService.updateProfile(principal.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật hồ sơ thành công", profile));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(Principal principal, @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getName(), request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đổi mật khẩu thành công", null));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<UserProfileResponse>> addAddress(Principal principal, @RequestBody com.example.vgashop.dto.UserAddressDto dto) {
        UserProfileResponse profile = userService.addAddress(principal.getName(), dto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã thêm địa chỉ", profile));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> deleteAddress(Principal principal, @PathVariable Long id) {
        UserProfileResponse profile = userService.deleteAddress(principal.getName(), id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Đã xóa địa chỉ", profile));
    }
}
