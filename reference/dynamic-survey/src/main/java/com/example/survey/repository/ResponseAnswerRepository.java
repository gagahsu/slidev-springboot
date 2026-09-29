package com.example.survey.repository;

import com.example.survey.entity.ResponseAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResponseAnswerRepository extends JpaRepository<ResponseAnswer, Integer> {
    List<ResponseAnswer> findByQuestionId(Integer questionId);
}
