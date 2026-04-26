package com.example.vgashop.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.vgashop.dto.AuthResponse;
import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.dto.GoogleLoginRequest;
import com.example.vgashop.dto.RegisterRequest;
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

    // Register
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.USER);
        user.setStatus(true);

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getUsername(), saved.getRole());

        return new AuthResponse(token, saved.getUsername(), saved.getEmail(), saved.getRole().name(), saved.getId(), "Đăng ký thành công");
    }

    // Register
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

        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getUsername(), saved.getRole());

        return new AuthResponse(token, saved.getUsername(), saved.getEmail(), saved.getRole().name(), saved.getId(), "Đăng ký thành công");
    }


    public AuthResponse login(String username, String password) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Username input: [" + username + "]");


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("ERROR: User not found with username: " + username);
                    return new ResourceNotFoundException("Tài khoản hoặc mật khẩu không đúng");
                });

        System.out.println("User found - ID: " + user.getId() + ", Role: " + user.getRole() + ", Status: " + user.getStatus());

        // Validation
        if (Boolean.FALSE.equals(user.getStatus())) {
            System.out.println("ERROR: Account is disabled");
            throw new RuntimeException("Tài khoản đã bị khóa");
        }

        // Validation
        boolean passwordMatch = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Password match result: " + passwordMatch);

        if (!passwordMatch) {
            System.out.println("ERROR: Password does not match");
            throw new RuntimeException("Tài khoản hoặc mật khẩu không đúng");
        }


        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        System.out.println("Login successful - Token generated");

        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getRole().name(), user.getId(), "Đăng nhập thành công");
    }

    public AuthResponse googleLogin(GoogleLoginRequest req) {
        System.out.println("=== GOOGLE LOGIN ATTEMPT ===");
        System.out.println("Email input: [" + req.getEmail() + "]");

        // Check if user exists by email
        User user = userRepository.findByEmail(req.getEmail()).orElse(null);

        if (user == null) {
            System.out.println("Google User not found -> Registering new User");
            // Register new user automatically
            user = new User();
            // Google names can contain spaces, use email prefix as username
            String usernamePrefix = req.getEmail().split("@")[0];
            String username = usernamePrefix;
            int counter = 1;
            while(userRepository.existsByUsername(username)) {
                username = usernamePrefix + counter++;
            }

            user.setUsername(username);
            user.setEmail(req.getEmail());
            // Random password for google users
            user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            user.setFullName(req.getName());
            user.setRole(Role.USER);
            user.setStatus(true);
            user = userRepository.save(user);
        } else {
            System.out.println("Google User found - ID: " + user.getId() + ", Status: " + user.getStatus());
            if (Boolean.FALSE.equals(user.getStatus())) {
                throw new RuntimeException("Tài khoản đã bị khóa");
            }
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getRole().name(), user.getId(), "Đăng nhập Google thành công");
    }
}
