package com.example.vgashop.controler;

import com.example.vgashop.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SystemSettingController {

    private final SystemSettingService settingService;

    // API Public cho Client lấy thông tin thanh toán (Không cần auth)
    @GetMapping("/settings/public")
    public ResponseEntity<Map<String, String>> getPublicSettings() {
        return ResponseEntity.ok(settingService.getAllSettings());
    }

    // API Admin lấy cấu hình hiện tại
    @GetMapping("/admin/settings")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, String>> getAdminSettings() {
        return ResponseEntity.ok(settingService.getAllSettings());
    }

    // API Admin lưu cấu hình
    @PutMapping("/admin/settings")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> updateSettings(@RequestBody Map<String, String> settings) {
        settingService.updateSettings(settings);
        return ResponseEntity.ok(Map.of("message", "Cập nhật cấu hình thành công"));
    }
}
