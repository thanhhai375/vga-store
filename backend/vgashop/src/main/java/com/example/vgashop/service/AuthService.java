package com.example.vgashop.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.vgashop.dto.AuthResponse;
import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.entity.Role;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.security.JwtUtil;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // Đăng ký người dùng mới
    public AuthResponse register(UserDTO dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateResourceException("Username đã tồn tại!");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email đã tồn tại!");
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setRole(dto.getRole() != null ? Role.valueOf(dto.getRole().toUpperCase()) : Role.USER);
        user.setStatus(true);

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return new AuthResponse(token, "Đăng ký thành công", user.getRole().name());
    }

    // Đăng nhập
    public AuthResponse login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Tài khoản hoặc mật khau không đúng!"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Tài khoản hoặc mật khau không đúng!");
        }

        if (!user.getStatus()) {
            throw new RuntimeException("Tài khoản đã bị khóa!");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        return new AuthResponse(token, "Đăng nhập thành công", user.getRole().name());
    }
}
