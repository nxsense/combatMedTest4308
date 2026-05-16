package com.example.demo.scenario.generator;

import com.example.demo.scenario.entity.MarchActionTemplate;
import com.example.demo.scenario.entity.ScenarioExpectedAction;
import com.example.demo.scenario.entity.ScenarioInjury;
import com.example.demo.scenario.entity.TrainingScenario;
import com.example.demo.scenario.enums.DifficultyLevel;
import com.example.demo.scenario.enums.MarchActionTrigger;
import com.example.demo.scenario.repository.MarchActionTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MarchExpectedActionGenerator {

    private final MarchActionTemplateRepository templateRepository;
    private final ScenarioTriggerResolver triggerResolver;

    public List<ScenarioExpectedAction> generate(
            TrainingScenario scenario,
            List<ScenarioInjury> injuries
    ) {
        Set<MarchActionTrigger> triggers =
                triggerResolver.resolve(
                        Set.copyOf(injuries),
                        scenario.getVitalSigns()
                );

        return templateRepository.findByActiveTrueOrderByDefaultOrderAsc()
                .stream()
                .filter(template -> matchesTemplate(
                        template,
                        injuries,
                        scenario.getDifficultyLevel(),
                        triggers
                ))
                .map(template -> toExpectedAction(scenario, template))
                .toList();
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
    private boolean matchesTemplate(
            MarchActionTemplate template,
            List<ScenarioInjury> injuries,
            DifficultyLevel difficultyLevel,
            Set<MarchActionTrigger> triggers
    ) {
        if (!triggers.contains(template.getTriggerCondition())) {
            return false;
        }

        if (!matchesDifficulty(template, difficultyLevel)) {
            return false;
        }

        if (isGlobalTemplate(template)) {
            return true;
        }

        if (injuries == null || injuries.isEmpty()) {
            return false;
        }

        return injuries.stream()
                .anyMatch(injury -> matchesInjury(template, injury));
    }

    private boolean matchesDifficulty(
            MarchActionTemplate template,
            DifficultyLevel difficultyLevel
    ) {
        if (template.getMinDifficultyLevel() == null) {
            return true;
        }

        if (difficultyLevel == null) {
            return false;
        }

        return difficultyLevel.ordinal()
                >= template.getMinDifficultyLevel().ordinal();
    }

    private boolean isGlobalTemplate(MarchActionTemplate template) {
        return template.getInjuryRegion() == null
                && template.getInjurySeverity() == null
                && template.getInjuryMechanism() == null;
    }

    private boolean matchesInjury(
            MarchActionTemplate template,
            ScenarioInjury injury
    ) {

        return matchesNullable(
                template.getInjuryRegion(),
                injury.getRegion()
        )
                &&
                matchesNullable(
                        template.getInjurySeverity(),
                        injury.getSeverity()
                )
                &&
                matchesNullable(
                        template.getInjuryMechanism(),
                        injury.getMechanism()
                );
    }

    private boolean matchesNullable(Enum<?> expected, Enum<?> actual) {

        if (expected == null) {
            return true;
        }

        if (actual == null) {
            return false;
        }

        return expected.name().equals(actual.name());
    }
}