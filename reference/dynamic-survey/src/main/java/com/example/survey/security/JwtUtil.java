package com.example.survey.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // 密鑰從 application.properties 讀取（Base64 編碼、至少 256-bit）
    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Access Token：15 分鐘
    public String generateToken(String username) {
        return build(username, 15 * 60 * 1000L);
    }

    // Refresh Token：7 天
    public String generateRefreshToken(String username) {
        return build(username, 7 * 24 * 60 * 60 * 1000L);
    }

    private String build(String username, long ttlMs) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + ttlMs))
                .signWith(getSigningKey())
                .compact();
    }

    // 簽名不對或已過期時，parseSignedClaims() 會拋出 JwtException
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean validateToken(String token, String username) {
        String tokenUsername = extractUsername(token);
        boolean expired = extractAllClaims(token).getExpiration().before(new Date());
        return tokenUsername.equals(username) && !expired;
    }
}
