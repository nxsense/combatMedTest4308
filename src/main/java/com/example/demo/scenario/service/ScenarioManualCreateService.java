package com.example.demo.scenario.service;

import com.example.demo.scenario.dto.*;
import com.example.demo.scenario.entity.*;
import com.example.demo.scenario.enums.*;
import com.example.demo.scenario.mapper.ScenarioMapper;
import com.example.demo.scenario.repository.*;
import com.example.demo.test.entity.Label;
import com.example.demo.test.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class ScenarioManualCreateService {

    private final TrainingScenarioRepository trainingScenarioRepository;
    private final ScenarioInjuryRepository scenarioInjuryRepository;
    private final ScenarioVitalSignsRepository scenarioVitalSignsRepository;
    private final ScenarioExpectedActionRepository scenarioExpectedActionRepository;
    private final ManipulationRepository manipulationRepository;
    private final LabelRepository labelRepository;
    private final ScenarioMapper scenarioMapper;

    public TrainingScenarioResponse createManual(ScenarioManualCreateRequest request) {
        validateRequest(request);

        TrainingScenario scenario = TrainingScenario.builder()
                .title(request.title().trim())
                .legend(request.legend().trim())
                .scenarioFlowNotes(request.scenarioFlowNotes())
                .difficultyLevel(request.difficultyLevel())
                .source(ScenarioSource.MANUAL)
                .labels(loadLabels(request.labelIds()))
                .narrative(request.narrative())
                .build();

        scenario = trainingScenarioRepository.save(scenario);

        List<ScenarioInjury> injuries = buildInjuries(request.injuries(), scenario);
        injuries = scenarioInjuryRepository.saveAll(injuries);

        ScenarioVitalSigns vitalSigns = buildVitalSigns(request.vitalSigns(), scenario);
        vitalSigns = scenarioVitalSignsRepository.save(vitalSigns);

        List<ScenarioExpectedAction> expectedActions =
                buildExpectedActions(request.expectedActions(), scenario);
        expectedActions = scenarioExpectedActionRepository.saveAll(expectedActions);

        scenario.setInjuries(new HashSet<>(injuries));
        scenario.setVitalSigns(vitalSigns);
        scenario.setExpectedActions(new HashSet<>(expectedActions));

        TrainingScenario saved = trainingScenarioRepository.save(scenario);
        return scenarioMapper.toResponse(saved);
    }

    private void validateRequest(ScenarioManualCreateRequest request) {
        if (request.title() == null || request.title().isBlank()) {
            throw new IllegalArgumentException("Scenario title is required");
        }

        if (request.legend() == null || request.legend().isBlank()) {
            throw new IllegalArgumentException("Scenario legend is required");
        }

        if (request.difficultyLevel() == null) {
            throw new IllegalArgumentException("Scenario difficulty level is required");
        }

        if (request.vitalSigns() == null) {
            throw new IllegalArgumentException("Vital signs are required");
        }

        if (request.injuries() == null || request.injuries().isEmpty()) {
            throw new IllegalArgumentException("At least one injury is required");
        }

        if (request.expectedActions() == null || request.expectedActions().isEmpty()) {
            throw new IllegalArgumentException("At least one expected action is required");
        }
    }

    private List<ScenarioInjury> buildInjuries(
            List<ScenarioInjuryRequest> requests,
            TrainingScenario scenario
    ) {
        return requests.stream()
                .map(request -> ScenarioInjury.builder()
                        .scenario(scenario)
                        .mechanism(request.mechanism())
                        .region(request.region())
                        .severity(request.severity())
                        .activeBleeding(Boolean.TRUE.equals(request.activeBleeding()))
                        .airwayCompromised(Boolean.TRUE.equals(request.airwayCompromised()))
                        .breathingCompromised(Boolean.TRUE.equals(request.breathingCompromised()))
                        .consciousnessAffected(Boolean.TRUE.equals(request.consciousnessAffected()))
                        .description(request.description())
                        .build())
                .toList();
    }

    private ScenarioVitalSigns buildVitalSigns(
            ScenarioVitalSignsRequest request,
            TrainingScenario scenario
    ) {
        return ScenarioVitalSigns.builder()
                .scenario(scenario)
                .heartRate(request.heartRate())
                .systolicBp(request.systolicBp())
                .diastolicBp(request.diastolicBp())
                .respiratoryRate(request.respiratoryRate())
                .spo2(request.spo2())
                .consciousnessLevel(request.consciousnessLevel())
                .skinCondition(request.skinCondition())
                .painLevel(request.painLevel())
                .build();
    }

    private List<ScenarioExpectedAction> buildExpectedActions(
            List<ScenarioExpectedActionRequest> requests,
            TrainingScenario scenario
    ) {
        return requests.stream()
                .map(request -> {
                    Manipulation manipulation = null;

                    if (request.manipulationId() != null) {
                        manipulation = manipulationRepository.findById(request.manipulationId())
                                .orElseThrow(() -> new RuntimeException(
                                        "Manipulation not found: " + request.manipulationId()
                                ));
                    }

                    return ScenarioExpectedAction.builder()
                            .scenario(scenario)
                            .tcccStage(request.tcccStage())
                            .actionType(request.actionType())
                            .title(request.title())
                            .description(request.description())
                            .manipulation(manipulation)
                            .priorityOrder(request.priorityOrder())
                            .critical(Boolean.TRUE.equals(request.critical()))
                            .rationale(request.rationale())
                            .build();
                })
                .toList();
    }

    private Set<Label> loadLabels(Set<Long> labelIds) {
        if (labelIds == null || labelIds.isEmpty()) {
            return new HashSet<>();
        }

        return new HashSet<>(labelRepository.findAllById(labelIds));
    }
}