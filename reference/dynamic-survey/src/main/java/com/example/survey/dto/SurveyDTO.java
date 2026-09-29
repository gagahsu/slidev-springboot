package com.example.survey.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SurveyDTO implements java.io.Serializable {
    private Integer id;

    @Schema(description = "問卷名稱，最多 50 字", example = "午餐偏好調查")
    @NotBlank(message = "問卷名稱尚未填寫")
    @Size(max = 50, message = "問卷名稱最多 50 字")
    private String title;

    @NotBlank(message = "問卷說明尚未填寫")
    @Size(max = 300, message = "問卷說明最多 300 字")
    private String description;

    @Schema(description = "開始日期，必須晚於今天", example = "2026-10-01")
    @NotNull(message = "請選擇開始日期")
    @Future(message = "開始日期必須晚於今天")
    private LocalDate startDate;

    @NotNull(message = "請選擇結束日期")
    private LocalDate endDate;

    private boolean published;

    // 跨欄位規則：驗證方法必須以 is 開頭、回傳 boolean；@JsonIgnore 避免它被當成 JSON 屬性輸出
    @JsonIgnore
    @Schema(hidden = true)
    @AssertTrue(message = "結束日期必須在開始日期之後")
    public boolean isEndAfterStart() {
        return startDate == null || endDate == null || endDate.isAfter(startDate);
    }

    // 以下由後端計算，前端不用傳
    @Schema(description = "由後端計算，前端不用傳", accessMode = Schema.AccessMode.READ_ONLY)
    private String status;       // DRAFT / NOT_STARTED / ONGOING / ENDED
    private String statusLabel;  // 未發佈 / 尚未開始 / 進行中 / 已結束

    @Valid
    private List<QuestionDTO> questions = new ArrayList<>();
}
