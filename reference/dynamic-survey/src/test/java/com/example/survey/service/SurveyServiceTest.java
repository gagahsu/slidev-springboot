package com.example.survey.service;

import com.example.survey.dto.OptionDTO;
import com.example.survey.dto.QuestionDTO;
import com.example.survey.dto.SurveyDTO;
import com.example.survey.entity.QuestionType;
import com.example.survey.entity.Survey;
import com.example.survey.exception.BizException;
import com.example.survey.repository.SurveyRepository;
import com.example.survey.vo.RspCode;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SurveyServiceTest {

    @Mock
    private SurveyRepository surveyRepository;

    @InjectMocks
    private SurveyService surveyService;

    private SurveyDTO validDto() {
        OptionDTO a = new OptionDTO();
        a.setLabel("喜歡");
        OptionDTO b = new OptionDTO();
        b.setLabel("不喜歡");
        QuestionDTO q = new QuestionDTO();
        q.setTitle("喜歡嗎");
        q.setType(QuestionType.SINGLE);
        q.setOptions(List.of(a, b));

        SurveyDTO dto = new SurveyDTO();
        dto.setTitle("新問卷");
        dto.setDescription("說明");
        dto.setStartDate(LocalDate.now().plusDays(2));
        dto.setEndDate(LocalDate.now().plusDays(7));
        dto.setQuestions(List.of(q));
        return dto;
    }

    private Survey ongoingSurvey() {
        Survey s = new Survey();
        s.setId(1);
        s.setTitle("進行中");
        s.setPublished(true);
        s.setStartDate(LocalDate.now().minusDays(1));
        s.setEndDate(LocalDate.now().plusDays(1));
        return s;
    }

    @Test
    void 單選題少於兩個選項要被擋下() {
        SurveyDTO dto = validDto();
        dto.getQuestions().get(0).setOptions(List.of(dto.getQuestions().get(0).getOptions().get(0)));
        assertThrows(BizException.class, () -> surveyService.save(dto, false));
    }

    @Test
    void 進行中的問卷不能修改() {
        SurveyDTO dto = validDto();
        dto.setId(1);
        when(surveyRepository.findById(1)).thenReturn(Optional.of(ongoingSurvey()));
        BizException e = assertThrows(BizException.class, () -> surveyService.save(dto, false));
        assertEquals(RspCode.SURVEY_NOT_EDITABLE, e.getCode());
    }

    @Test
    void 批次刪除只要有一份進行中就整批不刪() {
        when(surveyRepository.findAllById(List.of(1))).thenReturn(List.of(ongoingSurvey()));
        assertThrows(BizException.class, () -> surveyService.deleteAll(List.of(1)));
        verify(surveyRepository, never()).deleteAll(any());
    }
}
