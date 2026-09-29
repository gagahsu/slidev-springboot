package com.example.survey.service;

import com.example.survey.dto.AnswerDTO;
import com.example.survey.dto.ResponseDTO;
import com.example.survey.entity.*;
import com.example.survey.exception.BizException;
import com.example.survey.repository.SurveyResponseRepository;
import com.example.survey.repository.UserRepository;
import com.example.survey.vo.PageResult;
import com.example.survey.vo.RspCode;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResponseService {

    private static final Logger log = LoggerFactory.getLogger(ResponseService.class);

    private final SurveyService surveyService;
    private final DraftService draftService;
    private final SurveyResponseRepository responseRepository;
    private final UserRepository userRepository;

    // ===== 作答流程：暫存 → 確認 → 送出 =====

    /** 第一步：檢查後放進 Session（不寫資料庫） */
    @Transactional(readOnly = true)
    public void saveDraft(Integer surveyId, ResponseDTO dto, HttpSession session) {
        check(surveyId, dto);
        draftService.saveResponse(session, surveyId, dto);
    }

    public ResponseDTO getDraft(Integer surveyId, HttpSession session) {
        ResponseDTO dto = draftService.getResponse(session, surveyId);
        if (dto == null) throw new BizException(RspCode.NO_DRAFT);
        return dto;
    }

    /** 第二步：使用者在確認頁按下「送出」，才真正寫進資料庫 */
    @Transactional
    public Integer submit(Integer surveyId, HttpSession session, String userEmail) {
        log.debug("送出作答，surveyId={}, 登入者={}", surveyId, userEmail == null ? "訪客" : maskEmail(userEmail));   // DEBUG：進入點（不記個資）
        ResponseDTO dto = getDraft(surveyId, session);
        Survey survey = check(surveyId, dto);

        SurveyResponse r = new SurveyResponse();
        r.setSurvey(survey);
        if (userEmail != null) {
            r.setUser(userRepository.findByEmail(userEmail).orElse(null)); // 登入會員才會關聯
        }
        r.setName(dto.getName().trim());
        r.setPhone(dto.getPhone());
        r.setEmail(dto.getEmail().trim().toLowerCase());
        r.setAge(dto.getAge());
        r.setSubmittedAt(LocalDateTime.now());

        Map<Integer, Question> questions = survey.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));
        for (AnswerDTO a : dto.getAnswers()) {
            List<String> values = cleanValues(a);
            if (values.isEmpty()) continue; // 選填題沒回答就不存
            ResponseAnswer ra = new ResponseAnswer();
            ra.setResponse(r);
            ra.setQuestion(questions.get(a.getQuestionId()));
            ra.setAnswerText(String.join(";", values)); // 多選以分號串接
            r.getAnswers().add(ra);
        }
        try {
            responseRepository.saveAndFlush(r);
        } catch (DataIntegrityViolationException e) {
            // 兩個人同時送出時，程式檢查會漏，UNIQUE(survey_id, email) 是最後防線
            log.warn("重複填寫被資料庫擋下，surveyId={}, email={}", surveyId, maskEmail(r.getEmail()));   // WARN
            throw new BizException(RspCode.ALREADY_RESPONDED);
        }
        draftService.clearResponse(session, surveyId);
        log.info("作答送出成功，surveyId={}, responseId={}, answers={}",
                surveyId, r.getId(), r.getAnswers().size());   // INFO
        return r.getId();
    }

    /** 共用檢查：問卷要在填寫期間、Email 沒填過、必填題都有答、答案在選項裡 */
    private Survey check(Integer surveyId, ResponseDTO dto) {
        Survey survey = surveyService.findOrThrow(surveyId);
        if (surveyService.statusOf(survey) != SurveyStatus.ONGOING) {
            throw new BizException(RspCode.SURVEY_NOT_OPEN);
        }
        if (responseRepository.existsBySurveyIdAndEmail(surveyId, dto.getEmail().trim().toLowerCase())) {
            throw new BizException(RspCode.ALREADY_RESPONDED);
        }
        Map<Integer, AnswerDTO> answers = dto.getAnswers().stream()
                .filter(a -> a.getQuestionId() != null)
                .collect(Collectors.toMap(AnswerDTO::getQuestionId, a -> a, (x, y) -> y));

        for (Question q : survey.getQuestions()) {
            AnswerDTO a = answers.get(q.getId());
            List<String> values = a == null ? List.of() : cleanValues(a);
            if (values.isEmpty()) {
                if (q.getRequired()) {
                    throw new BizException(RspCode.VALIDATION_ERROR, "「" + q.getTitle() + "」為必填");
                }
                continue;
            }
            if (q.getType() == QuestionType.TEXT) continue;
            Set<String> labels = q.getOptions().stream().map(Option::getLabel).collect(Collectors.toSet());
            if (!labels.containsAll(values)) {
                throw new BizException(RspCode.VALIDATION_ERROR, "「" + q.getTitle() + "」的答案不在選項內");
            }
            if (q.getType() == QuestionType.SINGLE && values.size() != 1) {
                throw new BizException(RspCode.VALIDATION_ERROR, "「" + q.getTitle() + "」只能選一個");
            }
        }
        return survey;
    }

    /** log 不可以寫入完整個資：a1@example.com → a1***@example.com */
    private static String maskEmail(String email) {
        int at = email.indexOf('@');
        return at <= 2 ? "***" + email.substring(at) : email.substring(0, 2) + "***" + email.substring(at);
    }

    private List<String> cleanValues(AnswerDTO a) {
        return a.getValues().stream().map(String::trim).filter(v -> !v.isEmpty()).toList();
    }

    // ===== 查詢（後台回饋、我的紀錄） =====

    @Transactional(readOnly = true)
    public PageResult<ResponseDTO> listBySurvey(Integer surveyId, int page, int size) {
        surveyService.findOrThrow(surveyId);
        // 依填寫編號倒序：越新越上面
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        return PageResult.of(responseRepository.findBySurveyId(surveyId, pageable), r -> toDTO(r, false));
    }

    @Transactional(readOnly = true)
    public ResponseDTO detail(Integer responseId) {
        SurveyResponse r = responseRepository.findById(responseId)
                .orElseThrow(() -> new BizException(RspCode.NOT_FOUND));
        return toDTO(r, true);
    }

    @Transactional(readOnly = true)
    public List<ResponseDTO> mine(String email) {
        Integer userId = userRepository.findByEmail(email).orElseThrow(() -> new BizException(RspCode.NOT_FOUND)).getId();
        return responseRepository.findByUserIdOrderByIdDesc(userId).stream()
                .map(r -> toDTO(r, false)).toList();
    }

    private ResponseDTO toDTO(SurveyResponse r, boolean withAnswers) {
        ResponseDTO dto = new ResponseDTO();
        dto.setId(r.getId());
        dto.setSurveyId(r.getSurvey().getId());
        dto.setSubmittedAt(r.getSubmittedAt());
        dto.setName(r.getName());
        dto.setPhone(r.getPhone());
        dto.setEmail(r.getEmail());
        dto.setAge(r.getAge());
        if (withAnswers) {
            for (ResponseAnswer ra : r.getAnswers()) {
                AnswerDTO a = new AnswerDTO();
                a.setQuestionId(ra.getQuestion().getId());
                a.setQuestionTitle(ra.getQuestion().getTitle());
                a.setValues(Arrays.asList(ra.getAnswerText().split(";")));
                dto.getAnswers().add(a);
            }
        }
        return dto;
    }
}
