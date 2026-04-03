package com.example.vgashop.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.vgashop.dto.AuthResponse;
import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.entity.Role;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.exception.ResourceNotFoundException;
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
    // public AuthResponse login(String username, String password) {
    //     User user = userRepository.findByUsername(username)
    //             .orElseThrow(() -> new RuntimeException("Tài khoản hoặc mật khau không đúng!"));
        
    //     if (!passwordEncoder.matches(password, user.getPassword())) {
    //         throw new RuntimeException("Tài khoản hoặc mật khau không đúng!");
    //     }

    //     if (!user.getStatus()) {
    //         throw new RuntimeException("Tài khoản đã bị khóa!");
    //     }

    //     String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

    //     return new AuthResponse(token, "Đăng nhập thành công", user.getRole().name());
    // }

    public AuthResponse login(String username, String password) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Username input: [" + username + "]");

        // Tìm user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("ERROR: User not found with username: " + username);
                    return new ResourceNotFoundException("Tài khoản hoặc mật khẩu không đúng");
                });

        System.out.println("User found - ID: " + user.getId() + ", Role: " + user.getRole() + ", Status: " + user.getStatus());

        // Kiểm tra trạng thái tài khoản
        if (Boolean.FALSE.equals(user.getStatus())) {
            System.out.println("ERROR: Account is disabled");
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        // Kiểm tra mật khẩu
        boolean passwordMatch = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password match result: " + passwordMatch);

        if (!passwordMatch) {
            System.out.println("ERROR: Password does not match");
            throw new RuntimeException("Tài khoản hoặc mật khẩu không đúng");
        }

        // Tạo token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        System.out.println("Login successful - Token generated");

        return new AuthResponse(token, "Đăng nhập thành công", user.getRole().name());
    }
}
