package com.example.demo.scenario.service;

import com.example.demo.scenario.dto.ScenarioGenerateRequest;
import com.example.demo.scenario.dto.ScenarioInjuryRequest;
import com.example.demo.scenario.dto.TrainingScenarioResponse;
import com.example.demo.scenario.entity.ScenarioExpectedAction;
import com.example.demo.scenario.entity.ScenarioInjury;
import com.example.demo.scenario.entity.ScenarioVitalSigns;
import com.example.demo.scenario.entity.TrainingScenario;
import com.example.demo.scenario.enums.ScenarioSource;
import com.example.demo.scenario.generator.MarchExpectedActionGenerator;
import com.example.demo.scenario.generator.ScenarioNarrativeGenerator;
import com.example.demo.scenario.generator.VitalSignsGenerator;
import com.example.demo.scenario.mapper.ScenarioMapper;
import com.example.demo.scenario.repository.ScenarioExpectedActionRepository;
import com.example.demo.scenario.repository.ScenarioInjuryRepository;
import com.example.demo.scenario.repository.ScenarioVitalSignsRepository;
import com.example.demo.scenario.repository.TrainingScenarioRepository;
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
public class ScenarioGenerationService {

    private final ScenarioNarrativeGenerator scenarioNarrativeGenerator;
    private final TrainingScenarioRepository trainingScenarioRepository;
    private final ScenarioInjuryRepository scenarioInjuryRepository;
    private final ScenarioVitalSignsRepository scenarioVitalSignsRepository;
    private final ScenarioExpectedActionRepository scenarioExpectedActionRepository;
    private final LabelRepository labelRepository;

    private final VitalSignsGenerator vitalSignsGenerator;
    private final MarchExpectedActionGenerator marchExpectedActionGenerator;
    private final ScenarioMapper scenarioMapper;

    public TrainingScenarioResponse generate(ScenarioGenerateRequest request) {
        TrainingScenario scenario = TrainingScenario.builder()
                .title(request.title())
                .legend(buildLegend(request))
                .scenarioFlowNotes("Автоматично згенерований TCCC scenario engine.")
                .difficultyLevel(request.difficultyLevel())
                .source(ScenarioSource.AI_ASSISTED)
                .labels(loadLabels(request.labelIds()))
                .build();

        scenario = trainingScenarioRepository.save(scenario);

        List<ScenarioInjury> injuries = buildInjuries(request.injuries(), scenario);
        injuries = scenarioInjuryRepository.saveAll(injuries);

        ScenarioVitalSigns vitalSigns =
                vitalSignsGenerator.generate(request.injuries(), request.difficultyLevel());
        vitalSigns.setScenario(scenario);
        vitalSigns = scenarioVitalSignsRepository.save(vitalSigns);

        List<ScenarioExpectedAction> expectedActions =
                marchExpectedActionGenerator.generate(scenario, injuries);

        expectedActions = scenarioExpectedActionRepository.saveAll(expectedActions);

        String narrative = scenarioNarrativeGenerator.generate(
                scenario,
                injuries,
                vitalSigns,
                expectedActions
        );

        scenario.setNarrative(narrative);

        trainingScenarioRepository.save(scenario);

        scenario.setInjuries(new HashSet<>(injuries));
        scenario.setVitalSigns(vitalSigns);
        scenario.setExpectedActions(new HashSet<>(expectedActions));

        return scenarioMapper.toResponse(scenario);
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

    private Set<Label> loadLabels(Set<Long> labelIds) {
        if (labelIds == null || labelIds.isEmpty()) {
            return new HashSet<>();
        }

        return new HashSet<>(labelRepository.findAllById(labelIds));
    }


    private String buildLegend(ScenarioGenerateRequest request) {
        return "TCCC scenario: " + request.title();
    }
}