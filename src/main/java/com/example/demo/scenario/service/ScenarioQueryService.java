package com.example.demo.scenario.service;

import com.example.demo.scenario.dto.TrainingScenarioResponse;
import com.example.demo.scenario.entity.TrainingScenario;
import com.example.demo.scenario.mapper.ScenarioMapper;
import com.example.demo.scenario.repository.TrainingScenarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScenarioQueryService {

    private final TrainingScenarioRepository trainingScenarioRepository;
    private final ScenarioMapper scenarioMapper;

    public TrainingScenarioResponse getById(Long id) {

        TrainingScenario scenario = trainingScenarioRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Scenario not found: " + id
                ));

        return scenarioMapper.toResponse(scenario);
    }
}