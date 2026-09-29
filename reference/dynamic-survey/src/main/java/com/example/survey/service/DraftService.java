package com.example.survey.service;

import com.example.survey.dto.ResponseDTO;
import com.example.survey.dto.SurveyDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

/** 「送出前先放 Session、確認後才寫資料庫」的暫存區。 */
@Service
public class DraftService {

    private static final String ADMIN_SURVEY_KEY = "adminSurveyDraft";

    private String responseKey(Integer surveyId) {
        return "responseDraft:" + surveyId;
    }

    // ---- 後台：編輯中的問卷 ----
    public void saveSurvey(HttpSession session, SurveyDTO dto) {
        session.setAttribute(ADMIN_SURVEY_KEY, dto);
    }

    public SurveyDTO getSurvey(HttpSession session) {
        return (SurveyDTO) session.getAttribute(ADMIN_SURVEY_KEY);
    }

    public void clearSurvey(HttpSession session) {
        session.removeAttribute(ADMIN_SURVEY_KEY);
    }

    // ---- 前台：填寫中的作答 ----
    public void saveResponse(HttpSession session, Integer surveyId, ResponseDTO dto) {
        session.setAttribute(responseKey(surveyId), dto);
    }

    public ResponseDTO getResponse(HttpSession session, Integer surveyId) {
        return (ResponseDTO) session.getAttribute(responseKey(surveyId));
    }

    public void clearResponse(HttpSession session, Integer surveyId) {
        session.removeAttribute(responseKey(surveyId));
    }
}
