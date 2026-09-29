package com.example.survey.controller;

import com.example.survey.dto.ResponseDTO;
import com.example.survey.dto.StatisticsDTO;
import com.example.survey.dto.SurveyDTO;
import com.example.survey.service.ResponseService;
import com.example.survey.service.StatisticsService;
import com.example.survey.service.SurveyService;
import com.example.survey.vo.AppResponse;
import com.example.survey.vo.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/** 前台：問卷列表、填寫、確認、統計 */
@Tag(name = "前台問卷", description = "問卷列表、填寫、確認、統計")
@RestController
@RequestMapping("/api/surveys")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;
    private final ResponseService responseService;
    private final StatisticsService statisticsService;

    @Operation(summary = "問卷列表", description = "只列出已發佈的問卷；標題模糊搜尋、起訖日期區間、分頁")
    @GetMapping
    public AppResponse<PageResult<SurveyDTO>> list(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate,
            @Parameter(description = "頁碼，從 0 開始") @RequestParam(name = "page", defaultValue = "0") int page,
            @Parameter(description = "每頁筆數") @RequestParam(name = "size", defaultValue = "10") int size) {
        return AppResponse.success(surveyService.search(title, startDate, endDate, true, page, size));
    }

    @GetMapping("/{id}")
    public AppResponse<SurveyDTO> get(@PathVariable("id") Integer id) {
        return AppResponse.success(surveyService.get(id, false));
    }

    @GetMapping("/{id}/statistics")
    public AppResponse<StatisticsDTO> statistics(@PathVariable("id") Integer id) {
        surveyService.get(id, false); // 未發佈的問卷前台看不到
        return AppResponse.success(statisticsService.statistics(id));
    }

    // ---- 作答三步驟：暫存(Session) → 確認頁讀取 → 送出(寫資料庫) ----

    @Operation(summary = "暫存作答", description = "檢查後放進 Session，不寫資料庫")
    @PostMapping("/{id}/draft")
    public AppResponse<Void> saveDraft(@PathVariable("id") Integer id,
                                       @Valid @RequestBody ResponseDTO body, HttpSession session) {
        responseService.saveDraft(id, body, session);
        return AppResponse.success();
    }

    @GetMapping("/{id}/draft")
    public AppResponse<ResponseDTO> getDraft(@PathVariable("id") Integer id, HttpSession session) {
        return AppResponse.success(responseService.getDraft(id, session));
    }

    @Operation(summary = "確認送出", description = "讀取 Session 的暫存，寫進資料庫；同一 Email 不可重複填寫")
    @PostMapping("/{id}/submit")
    public AppResponse<Map<String, Integer>> submit(@PathVariable("id") Integer id, HttpSession session,
                                                    @AuthenticationPrincipal UserDetails user) {
        String email = user == null ? null : user.getUsername(); // 訪客為 null
        return AppResponse.success(Map.of("responseId", responseService.submit(id, session, email)));
    }
}
