package com.example.survey.repository;

import com.example.survey.entity.SurveyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyResponseRepository extends JpaRepository<SurveyResponse, Integer> {
    boolean existsBySurveyIdAndEmail(Integer surveyId, String email);

    long countBySurveyId(Integer surveyId);

    Page<SurveyResponse> findBySurveyId(Integer surveyId, Pageable pageable);

    List<SurveyResponse> findByUserIdOrderByIdDesc(Integer userId);
}
