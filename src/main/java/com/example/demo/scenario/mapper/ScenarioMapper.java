package com.example.demo.scenario.mapper;

import com.example.demo.test.entity.Label;
import com.example.demo.scenario.dto.*;
import com.example.demo.scenario.entity.ScenarioExpectedAction;
import com.example.demo.scenario.entity.ScenarioVitalSigns;
import com.example.demo.scenario.entity.TrainingScenario;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ScenarioMapper {

    public TrainingScenarioResponse toResponse(TrainingScenario scenario) {

        return new TrainingScenarioResponse(
                scenario.getId(),
                scenario.getTitle(),
                scenario.getLegend(),
                scenario.getScenarioFlowNotes(),
                scenario.getDifficultyLevel(),
                scenario.getSource(),
                mapVitalSigns(scenario.getVitalSigns()),
                mapExpectedActions(scenario),
                mapLabels(scenario),
                scenario.getCreatedAt(),
                scenario.getNarrative()
        );
    }

    private ScenarioVitalSignsResponse mapVitalSigns(
            ScenarioVitalSigns vitalSigns
    ) {

        if (vitalSigns == null) {
            return null;
        }

        return new ScenarioVitalSignsResponse(
                vitalSigns.getHeartRate(),
                vitalSigns.getSystolicBp(),
                vitalSigns.getDiastolicBp(),
                vitalSigns.getRespiratoryRate(),
                vitalSigns.getSpo2(),
                vitalSigns.getConsciousnessLevel(),
                vitalSigns.getSkinCondition(),
                vitalSigns.getPainLevel()
        );
    }

    private List<ScenarioExpectedActionResponse> mapExpectedActions(
            TrainingScenario scenario
    ) {

        return scenario.getExpectedActions()
                .stream()
                .sorted(Comparator.comparing(
                        ScenarioExpectedAction::getPriorityOrder,
                        Comparator.nullsLast(Integer::compareTo)
                ))
                .map(action -> {

                    Long manipulationId = null;
                    String manipulationCode = null;
                    String manipulationTitle = null;

                    if (action.getManipulation() != null) {
                        manipulationId = action.getManipulation().getId();
                        manipulationCode = action.getManipulation().getCode();
                        manipulationTitle = action.getManipulation().getTitle();
                    }

                    return new ScenarioExpectedActionResponse(
                            action.getId(),
                            action.getTcccStage(),
                            action.getActionType(),
                            action.getTitle(),
                            action.getDescription(),
                            action.getPriorityOrder(),
                            action.getCritical(),
                            action.getRationale(),
                            manipulationId,
                            manipulationCode,
                            manipulationTitle
                    );
                })
                .toList();
    }

    private Set<String> mapLabels(TrainingScenario scenario) {

        return scenario.getLabels()
                .stream()
                .map(Label::getName)
                .collect(Collectors.toSet());
    }
}