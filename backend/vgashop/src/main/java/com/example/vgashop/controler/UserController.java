package com.example.vgashop.controler;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.UserService;

import jakarta.validation.Valid;

import com.example.vgashop.entity.User;


@RestController
@RequestMapping("api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // lấy tất cả user có phân trang
    @GetMapping
    public ApiResponse<Page<User>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue= "id") String sortBy,
        @RequestParam(defaultValue= "asc") String direction
    ) {
        Page<User> data = userService.getAllUsers(page, size, sortBy, direction);
        return ApiResponse.success("Lấy danh sách người dùng thành công", data);
    }

    // tìm kiếm user
    @GetMapping("/search")
    public ApiResponse<Page<User>> search(
        @RequestParam String keyWord,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Page<User> data = userService.searchUsers(keyWord, page, size);
        return ApiResponse.success("Tìm kiếm người dùng thành công", data);
    }

    // lấy 1 user theo id
    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ApiResponse.success("Lấy thông tin người dùng thành công", user);
    }

    // Tạo mới
    @PostMapping
    public ApiResponse<User> create(@Valid @RequestBody UserDTO dto) {
        User saved = userService.createUser(dto);
        return ApiResponse.success("Tạo mới người dùng thành công", saved);
    }

    // cập nhật user
    @PutMapping("/{id}")
    public ApiResponse<User> update(@PathVariable Long id, @Valid @RequestBody UserDTO dto) {
        User updated = userService.updateUser(id, dto);
        return ApiResponse.success("Cập nhật user thành công", updated);
    }

    // xóa user
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ApiResponse.success("Xóa người dùng thành công", null);
    }
}
