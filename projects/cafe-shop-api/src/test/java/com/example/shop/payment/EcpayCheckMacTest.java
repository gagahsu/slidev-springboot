package com.example.shop.payment;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;

// 用綠界官方文件「檢查碼機制」的範例資料驗證：算出來要跟官方的結果一模一樣
class EcpayCheckMacTest {

    private static final String HASH_KEY = "pwFHCqoQZGmho4w6";
    private static final String HASH_IV = "EkRm7iFT261dpevs";

    private Map<String, String> officialExample() {
        Map<String, String> p = new LinkedHashMap<>();
        p.put("TradeDesc", "促銷方案");
        p.put("PaymentType", "aio");
        p.put("MerchantTradeDate", "2023/03/12 15:30:23");
        p.put("MerchantTradeNo", "ecpay20230312153023");
        p.put("MerchantID", "3002607");
        p.put("ReturnURL", "https://www.ecpay.com.tw/receive.php");
        p.put("ItemName", "Apple iphone 15");
        p.put("TotalAmount", "30000");
        p.put("ChoosePayment", "ALL");
        p.put("EncryptType", "1");
        return p;
    }

    @Test
    void computeMatchesOfficialExample() {
        assertEquals("6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840",
                EcpayCheckMac.compute(officialExample(), HASH_KEY, HASH_IV));
    }

    @Test
    void verifyAcceptsCorrectValueAndRejectsTampering() {
        Map<String, String> p = officialExample();
        p.put("CheckMacValue", EcpayCheckMac.compute(p, HASH_KEY, HASH_IV));
        assertTrue(EcpayCheckMac.verify(p, HASH_KEY, HASH_IV));

        p.put("TotalAmount", "1"); // 竄改金額
        assertFalse(EcpayCheckMac.verify(p, HASH_KEY, HASH_IV));
    }
}
