package com.example.vgashop.service;

import com.example.vgashop.dto.AuthResponse;
import com.example.vgashop.dto.LoginRequest;
import com.example.vgashop.dto.RegisterRequest;
import com.example.vgashop.entity.User;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User user = new User();
        user.setUserName(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("USER");

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getUserName(), saved.getRole());

        return new AuthResponse(token, saved.getUserName(), saved.getEmail(), saved.getRole(), saved.getId());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng!"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng!");
        }

        String token = jwtUtil.generateToken(user.getUserName(), user.getRole());
        return new AuthResponse(token, user.getUserName(), user.getEmail(), user.getRole(), user.getId());
    }
}
