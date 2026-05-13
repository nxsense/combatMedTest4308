package com.example.demo.scenario.controller;

import com.example.demo.scenario.dto.ScenarioGenerateRequest;
import com.example.demo.scenario.dto.TrainingScenarioResponse;
import com.example.demo.scenario.service.ScenarioGenerationService;
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

    @PostMapping("/generate")
    @ResponseStatus(HttpStatus.CREATED)
    public TrainingScenarioResponse generate(
            @Valid @RequestBody ScenarioGenerateRequest request
    ) {
        return scenarioGenerationService.generate(request);
    }

    @GetMapping("/{id}")
    public TrainingScenarioResponse getById(@PathVariable Long id) {
        return scenarioQueryService.getById(id);
    }
}