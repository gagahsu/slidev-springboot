package com.example.shop.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expire-minutes:120}")
    private long expireMinutes;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String email) {
        Date now = new Date();
        Date expireAt = new Date(now.getTime() + expireMinutes * 60 * 1000);
        return Jwts.builder().subject(email).issuedAt(now).expiration(expireAt)
                .signWith(getKey()).compact();
    }

    public String getEmail(String token) {
        return Jwts.parser().verifyWith(getKey()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }
}
