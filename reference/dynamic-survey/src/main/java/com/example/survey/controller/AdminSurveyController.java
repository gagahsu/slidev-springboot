package com.example.survey.controller;

import com.example.survey.dto.ResponseDTO;
import com.example.survey.dto.StatisticsDTO;
import com.example.survey.dto.SurveyDTO;
import com.example.survey.exception.BizException;
import com.example.survey.service.DraftService;
import com.example.survey.service.ResponseService;
import com.example.survey.service.StatisticsService;
import com.example.survey.service.SurveyService;
import com.example.survey.vo.AppResponse;
import com.example.survey.vo.PageResult;
import com.example.survey.vo.RspCode;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** 後台（限 ADMIN） */
@Tag(name = "後台問卷", description = "問卷管理、回饋、統計（限管理員）")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminSurveyController {

    private final SurveyService surveyService;
    private final DraftService draftService;
    private final ResponseService responseService;
    private final StatisticsService statisticsService;

    @Operation(summary = "後台問卷列表", description = "包含未發佈的問卷")
    @GetMapping("/surveys")
    public AppResponse<PageResult<SurveyDTO>> list(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "startDate", required = false) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) LocalDate endDate,
            @Parameter(description = "頁碼，從 0 開始") @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return AppResponse.success(surveyService.search(title, startDate, endDate, false, page, size));
    }

    @GetMapping("/surveys/{id}")
    public AppResponse<SurveyDTO> get(@PathVariable("id") Integer id) {
        return AppResponse.success(surveyService.get(id, true));
    }

    @PostMapping("/surveys")
    public AppResponse<SurveyDTO> create(@Valid @RequestBody SurveyDTO dto,
                                         @RequestParam(name = "publish", defaultValue = "false") boolean publish) {
        dto.setId(null);
        return AppResponse.success(surveyService.save(dto, publish));
    }

    @PutMapping("/surveys/{id}")
    public AppResponse<SurveyDTO> update(@PathVariable("id") Integer id, @Valid @RequestBody SurveyDTO dto,
                                         @RequestParam(name = "publish", defaultValue = "false") boolean publish) {
        dto.setId(id);
        return AppResponse.success(surveyService.save(dto, publish));
    }

    @Operation(summary = "批次刪除問卷", description = "Body 是 id 陣列；只有未發佈、尚未開始的問卷能刪，否則整批不刪")
    @DeleteMapping("/surveys")
    public AppResponse<Void> delete(@RequestBody List<Integer> ids) {
        surveyService.deleteAll(ids);
        return AppResponse.success();
    }

    // ---- 後台編輯流程：基本資料與題目先暫存在 Session，確認頁才寫資料庫 ----

    @PostMapping("/survey-draft")
    public AppResponse<Void> saveDraft(@Valid @RequestBody SurveyDTO dto, HttpSession session) {
        draftService.saveSurvey(session, dto);
        return AppResponse.success();
    }

    @GetMapping("/survey-draft")
    public AppResponse<SurveyDTO> getDraft(HttpSession session) {
        return AppResponse.success(draftService.getSurvey(session));
    }

    /** 確認頁按「僅儲存」(publish=false) 或「儲存並發佈」(publish=true) */
    @PostMapping("/survey-draft/commit")
    public AppResponse<SurveyDTO> commit(@RequestParam(name = "publish") boolean publish, HttpSession session) {
        SurveyDTO dto = draftService.getSurvey(session);
        if (dto == null) throw new BizException(RspCode.NO_DRAFT);
        SurveyDTO saved = surveyService.save(dto, publish);
        draftService.clearSurvey(session);
        return AppResponse.success(saved);
    }

    // ---- 回饋與統計 ----

    @GetMapping("/surveys/{id}/responses")
    public AppResponse<PageResult<ResponseDTO>> responses(@PathVariable("id") Integer id,
                                                          @Parameter(description = "頁碼，從 0 開始") @RequestParam(name = "page", defaultValue = "0") int page,
                                                          @RequestParam(name = "size", defaultValue = "10") int size) {
        return AppResponse.success(responseService.listBySurvey(id, page, size));
    }

    @GetMapping("/responses/{id}")
    public AppResponse<ResponseDTO> responseDetail(@PathVariable("id") Integer id) {
        return AppResponse.success(responseService.detail(id));
    }

    @GetMapping("/surveys/{id}/statistics")
    public AppResponse<StatisticsDTO> statistics(@PathVariable("id") Integer id) {
        return AppResponse.success(statisticsService.statistics(id));
    }
}
