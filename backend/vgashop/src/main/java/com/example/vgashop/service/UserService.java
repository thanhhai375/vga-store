package com.example.vgashop.service;

import com.example.vgashop.dto.ChangePasswordRequest;
import com.example.vgashop.dto.UserAddressDto;
import com.example.vgashop.dto.UserProfileRequest;
import com.example.vgashop.dto.UserProfileResponse;
import com.example.vgashop.entity.User;
import com.example.vgashop.entity.UserAddress;
import com.example.vgashop.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDto(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String username, UserProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setUserName(request.getUsername());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setDob(request.getDob());
        
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String username, ChangePasswordRequest req) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Mật khẩu cũ không đúng!");
        }
        
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserProfileResponse addAddress(String username, UserAddressDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserAddress address = new UserAddress();
        address.setUser(user);
        address.setRecipientName(dto.getRecipientName());
        address.setPhone(dto.getPhone());
        address.setDetailedAddress(dto.getDetailedAddress());
        
        // Nếu là địa chỉ đầu tiên hoặc được đánh dấu default
        if (dto.getIsDefault() != null && dto.getIsDefault() || user.getAddresses().isEmpty()) {
            user.getAddresses().forEach(a -> a.setIsDefault(false));
            address.setIsDefault(true);
        } else {
            address.setIsDefault(false);
        }
        
        user.getAddresses().add(address);
        return mapToDto(userRepository.save(user));
    }

    @Transactional
    public UserProfileResponse deleteAddress(String username, Long addressId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.getAddresses().removeIf(a -> a.getId().equals(addressId));
        return mapToDto(userRepository.save(user));
    }

    private UserProfileResponse mapToDto(User user) {
        UserProfileResponse dto = new UserProfileResponse();
        dto.setId(user.getId());
        dto.setUsername(user.getUserName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setPhone(user.getPhone());
        dto.setGender(user.getGender());
        dto.setDob(user.getDob());
        
        if (user.getAddresses() != null) {
            dto.setAddresses(user.getAddresses().stream().map(a -> 
                new UserAddressDto(a.getId(), a.getRecipientName(), a.getPhone(), a.getDetailedAddress(), a.getIsDefault())
            ).collect(Collectors.toList()));
        }
        return dto;
    }
}
