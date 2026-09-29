package com.example.survey.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OptionDTO implements java.io.Serializable {
    private Integer id;

    @NotBlank(message = "選項不可空白")
    @Size(max = 100, message = "選項最多 100 字")
    private String label;
}
