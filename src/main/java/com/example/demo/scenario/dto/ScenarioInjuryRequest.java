package com.example.demo.scenario.dto;

import com.example.demo.scenario.enums.InjuryMechanism;
import com.example.demo.scenario.enums.InjuryRegion;
import com.example.demo.scenario.enums.InjurySeverity;

public record ScenarioInjuryRequest(
        InjuryMechanism mechanism,
        InjuryRegion region,
        InjurySeverity severity,
        Boolean activeBleeding,
        Boolean airwayCompromised,
        Boolean breathingCompromised,
        Boolean consciousnessAffected,
        String description
) {
}