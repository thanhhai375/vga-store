package com.example.vgashop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.vgashop.security.JwtFilter;
import com.example.vgashop.security.JwtUtil;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt CSRF vì dùng JWT
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // kh dùng session
            )
            .authorizeHttpRequests(auth -> 
                auth.requestMatchers("/api/auth/**").permitAll() // đăng nhập và đăng ký
                    .requestMatchers("/uploads/**").permitAll() // cho phép truy cập ảnh
                    .requestMatchers("/api/products/**").permitAll() // cho phép truy cập sản phẩm
                    .requestMatchers("/api/brands/**").permitAll() // cho phép truy cập thương hiệu 
                    .requestMatchers("/api/categories/**").permitAll() // cho phép truy cập danh mục

                    // các endpoint khác yêu cầu xác thực
                    .requestMatchers("/api/users/**").authenticated() // chỉ admin mới được quản lý user
                    .requestMatchers("/api/orders/**").authenticated() // chỉ admin mới được quản lý order

                    // phân quyền theo role
                    .requestMatchers("/api/admin/**").hasRole("ADMIN") // chỉ admin mới được truy cập các endpoint admin
                    .requestMatchers("api/staff/**").hasAnyRole("ADMIN", "STAFF") // admin và staff mới được truy cập các endpoint staff

                    // Tất cả các request khác đều yêu cầu xác thực
                
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Thêm JwtFilter vào trước UsernamePasswordAuthenticationFilter

            return http.build();
    }
}
