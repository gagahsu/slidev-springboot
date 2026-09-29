package com.example.survey.repository;

import com.example.survey.entity.Survey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

public interface SurveyRepository extends JpaRepository<Survey, Integer> {

    // 標題模糊搜尋 + 起訖日期「包含在區間內」，三個條件都可省略
    @Query("""
            select s from Survey s
            where (:title is null or s.title like concat('%', :title, '%'))
              and (:start is null or s.startDate >= :start)
              and (:end is null or s.endDate <= :end)
              and (:publishedOnly = false or s.published = true)
            """)
    Page<Survey> search(@Param("title") String title,
                        @Param("start") LocalDate start,
                        @Param("end") LocalDate end,
                        @Param("publishedOnly") boolean publishedOnly,
                        Pageable pageable);

    // 進行中：已發佈，且今天介於開始與結束日期之間
    @Query("select s from Survey s where s.published = true and :today between s.startDate and s.endDate order by s.endDate")
    List<Survey> findOngoing(@Param("today") LocalDate today);

    @Transactional
    @Modifying
    @Query("update Survey s set s.published = :published where s.id = :id")
    int updatePublished(@Param("id") Integer id, @Param("published") boolean published);
}
