package com.example.cafe.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cafe.dto.ReservationDto;
import com.example.cafe.dto.ReservationRequest;
import com.example.cafe.entity.Reservation;
import com.example.cafe.exception.FieldException;
import com.example.cafe.repository.ReservationRepository;

@Service
public class ReservationService {

    private static final LocalTime FIRST_SLOT = LocalTime.of(10, 0);
    private static final LocalTime LAST_SLOT = LocalTime.of(19, 30);

    @Autowired
    private ReservationRepository reservationRepository;

    public ReservationDto create(ReservationRequest req) {
        // 日期：今天到 30 天後（含頭尾）
        LocalDate today = LocalDate.now();
        if (req.reserveDate().isBefore(today) || req.reserveDate().isAfter(today.plusDays(30))) {
            throw new FieldException("reserveDate", "只能預約 30 天內的日期");
        }
        // 時段：10:00～19:30，每 30 分鐘一個
        LocalTime t = req.reserveTime();
        boolean onSlot = t.getSecond() == 0 && (t.getMinute() == 0 || t.getMinute() == 30);
        if (!onSlot || t.isBefore(FIRST_SLOT) || t.isAfter(LAST_SLOT)) {
            throw new FieldException("reserveTime", "請選擇營業時段");
        }

        Reservation r = new Reservation();
        r.setName(req.name().trim());
        r.setPhone(req.phone());
        r.setEmail(isBlank(req.email()) ? null : req.email().trim());
        r.setReserveDate(req.reserveDate());
        r.setReserveTime(req.reserveTime());
        r.setPeople(req.people());
        r.setNote(isBlank(req.note()) ? null : req.note().trim());
        return toDto(reservationRepository.save(r));
    }

    public List<ReservationDto> findByDate(LocalDate date) {
        return reservationRepository.findByReserveDateOrderByReserveTime(date).stream()
                .map(this::toDto)
                .toList();
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private ReservationDto toDto(Reservation r) {
        return new ReservationDto(r.getId(), r.getName(), r.getPhone(), r.getEmail(),
                r.getReserveDate(), r.getReserveTime(), r.getPeople(), r.getNote());
    }
}
