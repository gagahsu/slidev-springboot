package com.example.shop.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.shop.vo.CategorySalesVO;
import com.example.shop.vo.DailySalesVO;
import com.example.shop.vo.ProductRankVO;

// 報表查詢：GROUP BY、JOIN 比較多，用 MyBatis 直接寫 SQL（resources/mapper/ReportMapper.xml）
@Mapper
public interface ReportMapper {

    List<DailySalesVO> dailySales(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    List<CategorySalesVO> categorySales(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    List<ProductRankVO> productRanking(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to,
            @Param("limit") Integer limit);

    int countByStatus(@Param("status") String status);
}
