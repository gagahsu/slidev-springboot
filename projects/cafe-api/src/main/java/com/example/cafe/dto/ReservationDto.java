package com.example.cafe.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record ReservationDto(Integer id, String name, String phone, String email,
        LocalDate reserveDate,
        @JsonFormat(pattern = "HH:mm") LocalTime reserveTime,
        Integer people, String note) {
}
