package com.example.demo.scenario.generator;

import com.example.demo.scenario.entity.MarchActionTemplate;
import com.example.demo.scenario.entity.ScenarioExpectedAction;
import com.example.demo.scenario.entity.ScenarioInjury;
import com.example.demo.scenario.entity.TrainingScenario;
import com.example.demo.scenario.enums.MarchActionTrigger;
import com.example.demo.scenario.repository.MarchActionTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MarchExpectedActionGenerator {

    private final MarchActionTemplateRepository templateRepository;

    public List<ScenarioExpectedAction> generate(
            TrainingScenario scenario,
            List<ScenarioInjury> injuries
    ) {
        Set<MarchActionTrigger> triggers = resolveTriggers(injuries);

        return templateRepository.findByActiveTrueOrderByDefaultOrderAsc()
                .stream()
                .filter(template -> triggers.contains(template.getTriggerCondition()))
                .map(template -> toExpectedAction(scenario, template))
                .toList();
    }

    private Set<MarchActionTrigger> resolveTriggers(List<ScenarioInjury> injuries) {
        Set<MarchActionTrigger> triggers = EnumSet.of(MarchActionTrigger.ALWAYS);

        for (ScenarioInjury injury : injuries) {
            if (Boolean.TRUE.equals(injury.getActiveBleeding())) {
                triggers.add(MarchActionTrigger.ACTIVE_BLEEDING);
            }

            if (Boolean.TRUE.equals(injury.getAirwayCompromised())) {
                triggers.add(MarchActionTrigger.AIRWAY_COMPROMISED);
            }

            if (Boolean.TRUE.equals(injury.getBreathingCompromised())) {
                triggers.add(MarchActionTrigger.BREATHING_COMPROMISED);
            }

            if (Boolean.TRUE.equals(injury.getConsciousnessAffected())) {
                triggers.add(MarchActionTrigger.CONSCIOUSNESS_AFFECTED);
            }
        }

        return triggers;
    }

    private ScenarioExpectedAction toExpectedAction(
            TrainingScenario scenario,
            MarchActionTemplate template
    ) {
        return ScenarioExpectedAction.builder()
                .scenario(scenario)
                .tcccStage(template.getTcccStage())
                .actionType(template.getActionType())
                .title(template.getTitle())
                .description(template.getDescription())
                .priorityOrder(template.getDefaultOrder())
                .critical(template.getDefaultCritical())
                .rationale("Generated from MARCH action template: " + template.getTriggerCondition())
                .manipulation(template.getManipulation())
                .build();
    }
}