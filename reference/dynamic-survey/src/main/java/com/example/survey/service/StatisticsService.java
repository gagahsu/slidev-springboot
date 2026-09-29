package com.example.survey.service;

import com.example.survey.dto.StatisticsDTO;
import com.example.survey.entity.*;
import com.example.survey.exception.BizException;
import com.example.survey.repository.ResponseAnswerRepository;
import com.example.survey.repository.SurveyResponseRepository;
import com.example.survey.vo.RspCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final SurveyService surveyService;
    private final SurveyResponseRepository responseRepository;
    private final ResponseAnswerRepository answerRepository;

    @Transactional(readOnly = true)
    public StatisticsDTO statistics(Integer surveyId) {
        Survey survey = surveyService.findOrThrow(surveyId);
        if (!surveyService.statusOf(survey).hasResult()) {
            throw new BizException(RspCode.SURVEY_NO_STATISTICS);
        }
        StatisticsDTO result = new StatisticsDTO();
        result.setSurveyId(survey.getId());
        result.setTitle(survey.getTitle());
        result.setTotalResponses(responseRepository.countBySurveyId(surveyId));

        for (Question q : survey.getQuestions()) {
            List<ResponseAnswer> answers = answerRepository.findByQuestionId(q.getId());

            StatisticsDTO.QuestionStat stat = new StatisticsDTO.QuestionStat();
            stat.setQuestionId(q.getId());
            stat.setTitle(q.getTitle());
            stat.setType(q.getType().name());
            stat.setAnsweredCount(answers.size());

            if (q.getType() == QuestionType.TEXT) {
                answers.forEach(a -> stat.getTexts().add(a.getAnswerText()));
            } else {
                // 沒人選的選項也要出現（次數 0），所以先用所有選項建立計數表
                Map<String, Long> counts = new LinkedHashMap<>();
                q.getOptions().forEach(o -> counts.put(o.getLabel(), 0L));
                for (ResponseAnswer a : answers) {
                    Arrays.stream(a.getAnswerText().split(";"))
                            .forEach(v -> counts.computeIfPresent(v, (k, n) -> n + 1));
                }
                counts.forEach((label, count) -> {
                    StatisticsDTO.OptionStat os = new StatisticsDTO.OptionStat();
                    os.setLabel(label);
                    os.setCount(count);
                    os.setPercent(answers.isEmpty() ? 0 : Math.round(count * 1000.0 / answers.size()) / 10.0);
                    stat.getOptions().add(os);
                });
            }
            result.getQuestions().add(stat);
        }
        return result;
    }
}
