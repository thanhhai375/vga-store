package com.example.vgashop.security;

import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

import io.jsonwebtoken.*;

import com.example.vgashop.entity.Role;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {


    // sau này nên để trong file .env hoặc application.properties
    private static final String SECRET_KEY = "vga-shop-secret-key-2026-very-strong-and-long-enough-for-hmac";
    private static final long EXPIRATION_TIME = 86400000; // tương đương 1 ngày (Long 1000L * 60 * 60 * 24)

    // private static final String TOKEN_PREFIX = "Bearer ";
    // private static final String HEADER_STRING = "Authorization";

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // tạo JWT token
    public String generateToken(String username, Role role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role.name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    // lấy username từ token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // lấy role từ token
    public String extractRole(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    // kiểm tra token có hợp lệ không
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
