package com.example.survey.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ResponseDTO implements java.io.Serializable {
    private Integer id;              // 只在回傳時填入
    private Integer surveyId;
    private LocalDateTime submittedAt;

    @NotBlank(message = "請輸入姓名")
    private String name;

    @NotBlank(message = "請輸入手機")
    @Pattern(regexp = "^09\\d{8}$", message = "手機格式錯誤（09 開頭，共 10 碼）")
    private String phone;

    @NotBlank(message = "請輸入 Email")
    @Email(message = "Email 格式錯誤")
    private String email;

    @Min(value = 1, message = "年齡不合理")
    @Max(value = 120, message = "年齡不合理")
    private Integer age;

    @Valid
    private List<AnswerDTO> answers = new ArrayList<>();
}
