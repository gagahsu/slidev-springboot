package com.example.survey.dto;

import com.example.survey.entity.QuestionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class QuestionDTO implements java.io.Serializable {
    private Integer id;

    @NotBlank(message = "題目不可空白")
    @Size(max = 200, message = "題目最多 200 字")
    private String title;

    @NotNull(message = "請選擇題型")
    private QuestionType type;

    private boolean required;

    // 選項是「陣列」：單選、多選至少 2 個，文字題為空陣列
    @Valid
    private List<OptionDTO> options = new ArrayList<>();
}
