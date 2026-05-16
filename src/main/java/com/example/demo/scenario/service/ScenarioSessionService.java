package com.example.demo.scenario.service;

import com.example.demo.cadet.entity.Cadet;
import com.example.demo.cadet.repository.CadetRepository;
import com.example.demo.scenario.dto.*;
import com.example.demo.scenario.entity.*;
import com.example.demo.scenario.enums.SessionStatus;
import com.example.demo.scenario.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScenarioSessionService {

    private final ScenarioActionExecutionRepository executionRepository;
    private final ScenarioExpectedActionRepository expectedActionRepository;
    private final ManipulationRepository manipulationRepository;
    private final ScenarioSessionRepository sessionRepository;
    private final TrainingScenarioRepository scenarioRepository;
    private final CadetRepository cadetRepository;
    private final ScenarioPhysiologyEngine physiologyEngine;

    public ScenarioSessionResponse start(ScenarioSessionStartRequest request) {
        TrainingScenario scenario = scenarioRepository.findById(request.getScenarioId())
                .orElseThrow(() -> new RuntimeException("Scenario not found"));

        Cadet cadet = cadetRepository.findById(request.getCadetId())
                .orElseThrow(() -> new RuntimeException("Cadet not found"));

        ScenarioSession session = ScenarioSession.builder()
                .scenario(scenario)
                .cadet(cadet)
                .status(SessionStatus.ACTIVE)
                .currentMinute(0)
                .totalScore(0)
                .mistakes(0)
                .maxScore(scenario.getExpectedActions().size() * 10)
                .startedAt(LocalDateTime.now())
                .build();

        return toResponse(sessionRepository.save(session));
    }

    private ScenarioSessionResponse toResponse(ScenarioSession session) {
        return ScenarioSessionResponse.builder()
                .id(session.getId())
                .scenarioId(session.getScenario().getId())
                .cadetId(session.getCadet().getId())
                .status(session.getStatus())
                .currentMinute(session.getCurrentMinute())
                .totalScore(session.getTotalScore())
                .mistakes(session.getMistakes())
                .startedAt(session.getStartedAt())
                .finishedAt(session.getFinishedAt())
                .build();
    }

    public ScenarioActionExecutionResponse executeAction(
            Long sessionId,
            ScenarioActionExecuteRequest request
    ) {
        ScenarioSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Scenario session not found"));

        ScenarioExpectedAction expectedAction = expectedActionRepository
                .findById(request.getExpectedActionId())
                .orElseThrow(() -> new RuntimeException("Expected action not found"));

        Manipulation manipulation = manipulationRepository
                .findById(request.getManipulationId())
                .orElseThrow(() -> new RuntimeException("Manipulation not found"));

        boolean correct = expectedAction.getManipulation() != null
                && expectedAction.getManipulation().getId().equals(manipulation.getId());

        physiologyEngine.applyManipulationEffects(
                session,
                manipulation,
                correct
        );

        int scoreDelta = correct ? 10 : -5;

        ScenarioActionExecution execution = ScenarioActionExecution.builder()
                .session(session)
                .expectedAction(expectedAction)
                .manipulation(manipulation)
                .correct(correct)
                .executionMinute(request.getExecutionMinute())
                .scoreDelta(scoreDelta)
                .notes(request.getNotes())
                .executedAt(LocalDateTime.now())
                .build();

        session.setTotalScore(
                Math.min(
                        session.getMaxScore(),
                        session.getTotalScore() + scoreDelta
                )
        );

        if (!correct) {
            session.setMistakes(session.getMistakes() + 1);
        }

        executionRepository.save(execution);
        sessionRepository.save(session);

        return ScenarioActionExecutionResponse.builder()
                .id(execution.getId())
                .sessionId(session.getId())
                .expectedActionId(expectedAction.getId())
                .manipulationId(manipulation.getId())
                .correct(correct)
                .executionMinute(execution.getExecutionMinute())
                .scoreDelta(scoreDelta)
                .notes(execution.getNotes())
                .build();
    }

    public List<ScenarioActionExecutionResponse> getSessionActions(Long sessionId) {
        return executionRepository
                .findBySessionIdOrderByExecutionMinuteAscIdAsc(sessionId)
                .stream()
                .map(this::toExecutionResponse)
                .toList();
    }

    private ScenarioActionExecutionResponse toExecutionResponse(
            ScenarioActionExecution execution
    ) {
        return ScenarioActionExecutionResponse.builder()
                .id(execution.getId())
                .sessionId(execution.getSession().getId())
                .expectedActionId(execution.getExpectedAction().getId())
                .manipulationId(
                        execution.getManipulation() != null
                                ? execution.getManipulation().getId()
                                : null
                )
                .correct(execution.getCorrect())
                .executionMinute(execution.getExecutionMinute())
                .scoreDelta(execution.getScoreDelta())
                .notes(execution.getNotes())
                .build();
    }

    public ScenarioSessionSummaryResponse getSummary(
            Long sessionId
    ) {

        ScenarioSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        List<ScenarioActionExecution> executions =
                executionRepository.findBySessionIdOrderByExecutionMinuteAscIdAsc(
                        sessionId
                );

        int totalActions = executions.size();

        int correctActions = (int) executions.stream()
                .filter(e -> Boolean.TRUE.equals(e.getCorrect()))
                .count();

        int incorrectActions = totalActions - correctActions;

        double accuracy = totalActions == 0
                ? 0
                : ((double) correctActions / totalActions) * 100.0;

        return ScenarioSessionSummaryResponse.builder()
                .sessionId(session.getId())
                .scenarioId(session.getScenario().getId())
                .scenarioTitle(session.getScenario().getTitle())
                .cadetId(session.getCadet().getId())
                .status(session.getStatus())
                .totalScore(session.getTotalScore())
                .mistakes(session.getMistakes())
                .totalActions(totalActions)
                .correctActions(correctActions)
                .incorrectActions(incorrectActions)
                .accuracyPercent(
                        Math.round(accuracy * 100.0) / 100.0
                )
                .build();
    }

    public ScenarioSessionResponse applyPenalty(
            Long sessionId,
            ScenarioPenaltyRequest request
    ) {
        ScenarioSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        int points = request.getPoints() == null
                ? 0
                : request.getPoints();

        session.setTotalScore(
                session.getTotalScore() - points
        );

        session.setMistakes(
                session.getMistakes() + 1
        );

        ScenarioSession saved =
                sessionRepository.save(session);

        return toResponse(saved);
    }

    public ScenarioSessionResponse completeSession(
            Long sessionId
    ) {
        ScenarioSession session =
                sessionRepository.findById(sessionId)
                        .orElseThrow();

        session.setStatus(
                SessionStatus.COMPLETED
        );

        ScenarioSession saved =
                sessionRepository.save(session);

        return toResponse(saved);
    }
}