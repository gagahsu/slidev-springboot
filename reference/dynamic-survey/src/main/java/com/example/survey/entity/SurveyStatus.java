package com.example.survey.entity;

import lombok.Getter;

import java.time.LocalDate;

/** 問卷狀態：由 published + 日期計算，不存進資料庫。 */
@Getter
public enum SurveyStatus {
    DRAFT("未發佈"),
    NOT_STARTED("尚未開始"),
    ONGOING("進行中"),
    ENDED("已結束");

    private final String label;

    SurveyStatus(String label) {
        this.label = label;
    }

    public static SurveyStatus of(boolean published, LocalDate start, LocalDate end, LocalDate today) {
        if (!published) return DRAFT;
        if (today.isBefore(start)) return NOT_STARTED;
        if (!today.isAfter(end)) return ONGOING;
        return ENDED;
    }

    /** 後台只有這兩種狀態可以修改、刪除 */
    public boolean isEditable() {
        return this == DRAFT || this == NOT_STARTED;
    }

    /** 進行中、已結束才有統計與回饋 */
    public boolean hasResult() {
        return this == ONGOING || this == ENDED;
    }
}
