package com.example.cafe.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.cafe.dto.ReservationDto;
import com.example.cafe.dto.ReservationRequest;
import com.example.cafe.service.ReservationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationDto create(@Valid @RequestBody ReservationRequest req) {
        return reservationService.create(req);
    }

    // 加分題：店家查某一天的訂位
    @GetMapping
    public List<ReservationDto> findByDate(@RequestParam(name = "date") LocalDate date) {
        return reservationService.findByDate(date);
    }
}
