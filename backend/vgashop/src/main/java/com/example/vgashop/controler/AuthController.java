package com.example.vgashop.controler;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.vgashop.dto.AuthResponse;
import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.repository.ApiResponse;
import com.example.vgashop.service.AuthService;
import com.example.vgashop.dto.LoginRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {


    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Đăng ký
    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody UserDTO dto) {
        AuthResponse response = authService.register(dto);
        return ApiResponse.success("Đăng ký thành công", response);
    }

    // Đăng nhập
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
        return ApiResponse.success("Đăng nhập thành công", response);
    }
}
