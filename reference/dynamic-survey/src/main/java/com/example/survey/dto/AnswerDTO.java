package com.example.survey.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class AnswerDTO implements java.io.Serializable {
    private Integer questionId;
    private String questionTitle; // 只在回傳時填入
    private List<String> values = new ArrayList<>(); // 單選 / 文字只有一個值，多選有多個
}
