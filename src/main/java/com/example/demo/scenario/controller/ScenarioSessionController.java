package com.example.demo.scenario.controller;

import com.example.demo.scenario.dto.*;
import com.example.demo.scenario.service.ScenarioSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scenario-sessions")
@RequiredArgsConstructor
public class ScenarioSessionController {

    private final ScenarioSessionService sessionService;

    @PostMapping("/start")
    public ScenarioSessionResponse start(
            @RequestBody ScenarioSessionStartRequest request
    ) {
        return sessionService.start(request);
    }

    @PostMapping("/{sessionId}/actions")
    public ScenarioActionExecutionResponse executeAction(
            @PathVariable Long sessionId,
            @RequestBody ScenarioActionExecuteRequest request
    ) {
        return sessionService.executeAction(sessionId, request);
    }

    @GetMapping("/{sessionId}/actions")
    public List<ScenarioActionExecutionResponse> getSessionActions(
            @PathVariable Long sessionId
    ) {
        return sessionService.getSessionActions(sessionId);
    }

    @GetMapping("/{sessionId}/summary")
    public ScenarioSessionSummaryResponse getSummary(
            @PathVariable Long sessionId
    ) {
        return sessionService.getSummary(sessionId);
    }

    @PostMapping("/{sessionId}/penalty")
    public ScenarioSessionResponse applyPenalty(
            @PathVariable Long sessionId,
            @RequestBody ScenarioPenaltyRequest request
    ) {
        return sessionService.applyPenalty(
                sessionId,
                request
        );
    }

    @PostMapping("/{sessionId}/complete")
    public ScenarioSessionResponse completeSession(
            @PathVariable Long sessionId
    ) {
        return sessionService.completeSession(
                sessionId
        );
    }
}