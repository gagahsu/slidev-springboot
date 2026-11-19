package com.example.shop.payment;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;

// 綠界檢查碼 CheckMacValue（SHA256），規則見 specs/SHOP-SPEC.md §8.7
public final class EcpayCheckMac {

    private EcpayCheckMac() {
    }

    public static String compute(Map<String, String> params, String hashKey, String hashIv) {
        // 1. 參數依名稱 A→Z 排序（不分大小寫），不含 CheckMacValue
        Map<String, String> sorted = new TreeMap<>(String.CASE_INSENSITIVE_ORDER);
        params.forEach((k, v) -> {
            if (!"CheckMacValue".equalsIgnoreCase(k)) {
                sorted.put(k, v);
            }
        });
        // 2. 前面加 HashKey、後面加 HashIV
        StringBuilder sb = new StringBuilder("HashKey=").append(hashKey);
        sorted.forEach((k, v) -> sb.append('&').append(k).append('=').append(v));
        sb.append("&HashIV=").append(hashIv);
        // 3. URL encode，再換回 .NET 不編碼的符號；4. 轉小寫
        String encoded = URLEncoder.encode(sb.toString(), StandardCharsets.UTF_8).toLowerCase()
                .replace("%2d", "-").replace("%5f", "_").replace("%2e", ".").replace("%21", "!")
                .replace("%2a", "*").replace("%28", "(").replace("%29", ")");
        // 5. SHA256；6. 轉大寫
        return HexFormat.of().withUpperCase().formatHex(sha256(encoded));
    }

    // 驗證收到的參數：用收到的參數重算一次，跟對方帶來的 CheckMacValue 比較
    public static boolean verify(Map<String, String> params, String hashKey, String hashIv) {
        String received = params.get("CheckMacValue");
        if (received == null) {
            return false;
        }
        String expected = compute(params, hashKey, hashIv);
        return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8),
                received.toUpperCase().getBytes(StandardCharsets.UTF_8));
    }

    private static byte[] sha256(String s) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(s.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
