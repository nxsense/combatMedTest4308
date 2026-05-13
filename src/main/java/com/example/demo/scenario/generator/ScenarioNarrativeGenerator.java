package com.example.demo.scenario.generator;

import com.example.demo.scenario.entity.ScenarioExpectedAction;
import com.example.demo.scenario.entity.ScenarioInjury;
import com.example.demo.scenario.entity.ScenarioVitalSigns;
import com.example.demo.scenario.entity.TrainingScenario;

import java.util.List;

public interface ScenarioNarrativeGenerator {

    String generate(
            TrainingScenario scenario,
            List<ScenarioInjury> injuries,
            ScenarioVitalSigns vitalSigns,
            List<ScenarioExpectedAction> actions
    );
}