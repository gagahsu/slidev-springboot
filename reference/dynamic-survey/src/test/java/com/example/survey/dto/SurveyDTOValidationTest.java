package com.example.survey.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

class SurveyDTOValidationTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    private SurveyDTO valid() {
        SurveyDTO dto = new SurveyDTO();
        dto.setTitle("新問卷");
        dto.setDescription("說明");
        dto.setStartDate(LocalDate.now().plusDays(2));
        dto.setEndDate(LocalDate.now().plusDays(7));
        return dto;
    }

    private Set<String> messages(SurveyDTO dto) {
        return validator.validate(dto).stream().map(v -> v.getMessage()).collect(Collectors.toSet());
    }

    @Test
    void 合法資料沒有錯誤() {
        assertTrue(messages(valid()).isEmpty());
    }

    @Test
    void 開始日期是今天要被擋下() {
        SurveyDTO dto = valid();
        dto.setStartDate(LocalDate.now());
        assertTrue(messages(dto).contains("開始日期必須晚於今天"));
    }

    @Test
    void 結束日期不在開始日期之後要被擋下() {
        SurveyDTO dto = valid();
        dto.setEndDate(dto.getStartDate());
        assertTrue(messages(dto).contains("結束日期必須在開始日期之後"));
    }

    @Test
    void 標題空白與過長要被擋下() {
        SurveyDTO dto = valid();
        dto.setTitle(" ");
        assertTrue(messages(dto).contains("問卷名稱尚未填寫"));
        dto.setTitle("x".repeat(51));
        assertTrue(messages(dto).contains("問卷名稱最多 50 字"));
    }
}
