package com.example.survey.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class SurveyStatusTest {

    private final LocalDate today = LocalDate.of(2025, 1, 10);

    @Test
    void 未發佈不論日期都是DRAFT() {
        assertEquals(SurveyStatus.DRAFT, SurveyStatus.of(false, today.minusDays(5), today.plusDays(5), today));
    }

    @Test
    void 開始日期在未來是NOT_STARTED() {
        assertEquals(SurveyStatus.NOT_STARTED, SurveyStatus.of(true, today.plusDays(1), today.plusDays(9), today));
    }

    @Test
    void 開始當天與結束當天都算ONGOING() {
        assertEquals(SurveyStatus.ONGOING, SurveyStatus.of(true, today, today.plusDays(5), today));
        assertEquals(SurveyStatus.ONGOING, SurveyStatus.of(true, today.minusDays(5), today, today));
    }

    @Test
    void 結束日期已過是ENDED() {
        assertEquals(SurveyStatus.ENDED, SurveyStatus.of(true, today.minusDays(9), today.minusDays(1), today));
    }

    @Test
    void 只有DRAFT與NOT_STARTED可以編輯() {
        assertTrue(SurveyStatus.DRAFT.isEditable());
        assertTrue(SurveyStatus.NOT_STARTED.isEditable());
        assertFalse(SurveyStatus.ONGOING.isEditable());
        assertFalse(SurveyStatus.ENDED.isEditable());
    }
}
