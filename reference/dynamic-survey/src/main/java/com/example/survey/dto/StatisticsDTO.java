package com.example.survey.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class StatisticsDTO {
    private Integer surveyId;
    private String title;
    private long totalResponses;
    private List<QuestionStat> questions = new ArrayList<>();

    @Getter
    @Setter
    public static class QuestionStat {
        private Integer questionId;
        private String title;
        private String type;
        private long answeredCount;                       // 這題有幾個人回答
        private List<OptionStat> options = new ArrayList<>(); // 單選、多選
        private List<String> texts = new ArrayList<>();       // 文字題的所有回答
    }

    @Getter
    @Setter
    public static class OptionStat {
        private String label;
        private long count;
        private double percent; // 佔「這題回答人數」的百分比，0~100
    }
}
