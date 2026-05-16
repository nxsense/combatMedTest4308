package com.example.demo.scenario.controller;

import com.example.demo.scenario.dto.ScenarioGenerateRequest;
import com.example.demo.scenario.dto.ScenarioManualCreateRequest;
import com.example.demo.scenario.dto.TrainingScenarioResponse;
import com.example.demo.scenario.service.ScenarioGenerationService;
import com.example.demo.scenario.service.ScenarioManualCreateService;
import com.example.demo.scenario.service.ScenarioQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scenarios")
@RequiredArgsConstructor
public class ScenarioController {

    private final ScenarioQueryService scenarioQueryService;
    private final ScenarioGenerationService scenarioGenerationService;
    private final ScenarioManualCreateService scenarioManualCreateService;

    @PostMapping("/generate")
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingScenarioResponse generate(
            @Valid @RequestBody ScenarioGenerateRequest request
    ) {
        return scenarioGenerationService.generate(request);
    }

    @PostMapping("/manual")
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingScenarioResponse createManual(
            @Valid @RequestBody ScenarioManualCreateRequest request
    ) {
        return scenarioManualCreateService.createManual(request);
    }

    @GetMapping("/{id}")
    public TrainingScenarioResponse getById(@PathVariable Long id) {
        return scenarioQueryService.getById(id);
    }
}