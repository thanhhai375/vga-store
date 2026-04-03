package com.example.vgashop.service;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.example.vgashop.dto.UserDTO;
import com.example.vgashop.entity.Role;
import com.example.vgashop.repository.UserRepository;
import com.example.vgashop.entity.User;
import com.example.vgashop.exception.DuplicateResourceException;
import com.example.vgashop.exception.ResourceNotFoundException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // lấy danh sách người dùng có phân trang
    public Page<User> getAllUsers(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return userRepository.findByDeletedFalse(pageable);

    }

    // tìm kiếm user theo tên hoặc email
    public Page<User> searchUsers(String keyWord, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        if (keyWord == null || keyWord.trim().isEmpty()) {
            return userRepository.findByDeletedFalse(pageable);
        }
        return userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyWord.trim(), keyWord.trim(), pageable);
    }

    // lấy 1 user theo id
    public User getUserById(Long id) {
        return userRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID " + id));
    }

    // tạo mới
    public User createUser(UserDTO dto) {
        // kiểm tra user và email đã tồn tại chưa
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new DuplicateResourceException("Username '" + dto.getUsername() + "' đã tồn tại!");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Email '" + dto.getEmail() + "' đã tồn tại!");
        }

        // tạo đối tượng User mới từ DTO
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // mã hóa mật khẩu
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setAvatar(dto.getAvatar());
        user.setRole(dto.getRole() != null ? Role.valueOf(dto.getRole().toUpperCase()) : Role.USER);

        return userRepository.save(user);
    }

    // cập nhật thông tin user
    public User updateUser(Long id, UserDTO dto) {
        return userRepository.findByIdAndDeleted(id, false)
                .map(user -> {
                    // kiểm tra usename và email mới có trùng không nếu thay đổi
                    if (!user.getUsername().equals(dto.getUsername()) && userRepository.existsByUsername(dto.getUsername())) {
                        throw new DuplicateResourceException("UserName '" + dto.getUsername() + "' đã tồn tại!");
                    }

                    if (!user.getEmail().equals(dto.getEmail()) && userRepository.existsByEmail(dto.getEmail())) {
                        throw new DuplicateResourceException("Email '" + dto.getEmail() + "' đã tồn tại!");
                    }

                    user.setUsername(dto.getUsername());
                    user.setEmail(dto.getEmail());
                    user.setFullName(dto.getFullName());
                    user.setPhone(dto.getPhone());
                    user.setAddress(dto.getAddress());
                    user.setAvatar(dto.getAvatar());
                    if (dto.getRole() != null) {
                        user.setRole(Role.valueOf(dto.getRole().toUpperCase()));
                    }

                    return userRepository.save(user);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID " + id));
    }

    // xóa user
    public void deleteUser(Long id) {
        if (!userRepository.existsByIdAndDeleted(id, false)) {
            throw new ResourceNotFoundException("Không tìm thấy người dùng với ID " + id);
        }

        User user = userRepository.findByIdAndDeleted(id, false)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID " + id));
        user.setDeleted(true);
        userRepository.save(user);
    }
}
