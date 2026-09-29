package com.example.survey.service;

import com.example.survey.dto.OptionDTO;
import com.example.survey.dto.QuestionDTO;
import com.example.survey.dto.SurveyDTO;
import com.example.survey.entity.*;
import com.example.survey.exception.BizException;
import com.example.survey.repository.SurveyRepository;
import com.example.survey.vo.PageResult;
import com.example.survey.vo.RspCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;

    // ===== 查詢 =====

    @Transactional(readOnly = true)
    public PageResult<SurveyDTO> search(String title, LocalDate start, LocalDate end,
                                        boolean publishedOnly, int page, int size) {
        String keyword = (title == null || title.isBlank()) ? null : title.trim();
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return PageResult.of(surveyRepository.search(keyword, start, end, publishedOnly, pageable),
                s -> toDTO(s, false));
    }

    /** 前台只看得到已發佈的問卷；後台（admin = true）全部都看得到 */
    @Transactional(readOnly = true)
    public SurveyDTO get(Integer id, boolean admin) {
        Survey survey = findOrThrow(id);
        if (!admin && !survey.getPublished()) {
            throw new BizException(RspCode.NOT_FOUND);
        }
        return toDTO(survey, true);
    }

    public Survey findOrThrow(Integer id) {
        return surveyRepository.findById(id).orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
    }

    public SurveyStatus statusOf(Survey s) {
        return SurveyStatus.of(s.getPublished(), s.getStartDate(), s.getEndDate(), LocalDate.now());
    }

    // ===== 新增 / 修改 =====

    /** dto.id 為 null 就新增，否則修改（只有「未發佈」「尚未開始」可以修改）。 */
    @Transactional
    public SurveyDTO save(SurveyDTO dto, boolean publish) {
        validate(dto);

        Survey survey;
        if (dto.getId() == null) {
            survey = new Survey();
        } else {
            survey = findOrThrow(dto.getId());
            if (!statusOf(survey).isEditable()) {
                throw new BizException(RspCode.SURVEY_NOT_EDITABLE);
            }
        }
        survey.setTitle(dto.getTitle().trim());
        survey.setDescription(dto.getDescription().trim());
        survey.setStartDate(dto.getStartDate());
        survey.setEndDate(dto.getEndDate());
        survey.setPublished(publish);

        // 題目整批重建：orphanRemoval 會把舊的題目與選項刪掉
        survey.getQuestions().clear();
        int qIndex = 1;
        for (QuestionDTO qd : dto.getQuestions()) {
            Question q = new Question();
            q.setSurvey(survey);
            q.setTitle(qd.getTitle().trim());
            q.setType(qd.getType());
            q.setRequired(qd.isRequired());
            q.setOrderIndex(qIndex++);
            if (qd.getType() != QuestionType.TEXT) {
                int oIndex = 1;
                for (OptionDTO od : qd.getOptions()) {
                    Option o = new Option();
                    o.setQuestion(q);
                    o.setLabel(od.getLabel().trim());
                    o.setOrderIndex(oIndex++);
                    q.getOptions().add(o);
                }
            }
            survey.getQuestions().add(q);
        }
        return toDTO(surveyRepository.save(survey), true);
    }

    /** 格式驗證（必填、長度、日期先後）交給 DTO 上的 Bean Validation；這裡只放需要「業務判斷」的規則。 */
    private void validate(SurveyDTO dto) {
        if (dto.getQuestions().isEmpty()) {
            throw new BizException(RspCode.VALIDATION_ERROR, "至少要有一個題目");
        }
        for (QuestionDTO q : dto.getQuestions()) {
            if (q.getType() == QuestionType.TEXT) continue;
            if (q.getOptions().size() < 2) {
                throw new BizException(RspCode.VALIDATION_ERROR, "題目「" + q.getTitle() + "」至少要有兩個選項");
            }
            for (OptionDTO o : q.getOptions()) {
                if (o.getLabel().contains(";")) {
                    throw new BizException(RspCode.VALIDATION_ERROR, "選項不可包含分號 ;");
                }
            }
        }
    }

    // ===== 刪除 =====

    /** 批次刪除：只要有一份不是「未發佈 / 尚未開始」，整批都不刪。 */
    @Transactional
    public void deleteAll(List<Integer> ids) {
        List<Survey> surveys = surveyRepository.findAllById(ids);
        if (surveys.size() != ids.stream().distinct().count()) {
            throw new BizException(RspCode.NOT_FOUND);
        }
        for (Survey s : surveys) {
            if (!statusOf(s).isEditable()) {
                throw new BizException(RspCode.SURVEY_NOT_EDITABLE,
                        "「" + s.getTitle() + "」已開始，無法刪除");
            }
        }
        surveyRepository.deleteAll(surveys);
    }

    // ===== Entity → DTO =====

    public SurveyDTO toDTO(Survey s, boolean withQuestions) {
        SurveyDTO dto = new SurveyDTO();
        dto.setId(s.getId());
        dto.setTitle(s.getTitle());
        dto.setDescription(s.getDescription());
        dto.setStartDate(s.getStartDate());
        dto.setEndDate(s.getEndDate());
        dto.setPublished(s.getPublished());
        SurveyStatus status = statusOf(s);
        dto.setStatus(status.name());
        dto.setStatusLabel(status.getLabel());
        if (withQuestions) {
            for (Question q : s.getQuestions()) {
                QuestionDTO qd = new QuestionDTO();
                qd.setId(q.getId());
                qd.setTitle(q.getTitle());
                qd.setType(q.getType());
                qd.setRequired(q.getRequired());
                for (Option o : q.getOptions()) {
                    OptionDTO od = new OptionDTO();
                    od.setId(o.getId());
                    od.setLabel(o.getLabel());
                    qd.getOptions().add(od);
                }
                dto.getQuestions().add(qd);
            }
        }
        return dto;
    }
}
