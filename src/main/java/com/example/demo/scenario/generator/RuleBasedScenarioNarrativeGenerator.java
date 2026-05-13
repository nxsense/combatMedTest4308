package com.example.demo.scenario.generator;

import com.example.demo.scenario.entity.ScenarioExpectedAction;
import com.example.demo.scenario.entity.ScenarioInjury;
import com.example.demo.scenario.entity.ScenarioVitalSigns;
import com.example.demo.scenario.entity.TrainingScenario;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RuleBasedScenarioNarrativeGenerator
        implements ScenarioNarrativeGenerator {

    @Override
    public String generate(
            TrainingScenario scenario,
            List<ScenarioInjury> injuries,
            ScenarioVitalSigns vitalSigns,
            List<ScenarioExpectedAction> actions
    ) {

        String injuriesText = injuries.stream()
                .map(this::describeInjury)
                .collect(Collectors.joining(", "));

        String actionText = actions.stream()
                .map(ScenarioExpectedAction::getTitle)
                .limit(3)
                .collect(Collectors.joining(", "));

        return """
                During a combat training mission, a casualty was identified with %s.
                
                Initial assessment revealed:
                - Heart rate: %s bpm
                - Respiratory rate: %s/min
                - Oxygen saturation: %s%%
                - Consciousness level: %s
                
                The casualty requires immediate TCCC intervention.
                
                Expected priorities include: %s.
                """
                .formatted(
                        injuriesText,
                        vitalSigns.getHeartRate(),
                        vitalSigns.getRespiratoryRate(),
                        vitalSigns.getSpo2(),
                        vitalSigns.getConsciousnessLevel(),
                        actionText
                );
    }

    private String describeInjury(ScenarioInjury injury) {

        StringBuilder sb = new StringBuilder();

        sb.append(injury.getSeverity())
                .append(" ")
                .append(injury.getMechanism())
                .append(" affecting ")
                .append(injury.getRegion());

        if (Boolean.TRUE.equals(injury.getActiveBleeding())) {
            sb.append(" with active bleeding");
        }

        if (Boolean.TRUE.equals(injury.getAirwayCompromised())) {
            sb.append(", airway compromise");
        }

        if (Boolean.TRUE.equals(injury.getBreathingCompromised())) {
            sb.append(", respiratory compromise");
        }

        return sb.toString();
    }
}