package com.example.shop.vo;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

// MyBatis 查詢結果（欄位名稱自動從 snake_case 對應）
@Getter
@Setter
public class DailySalesVO {
    private LocalDate salesDate;
    private Integer orderCount;
    private Integer revenue;
}
