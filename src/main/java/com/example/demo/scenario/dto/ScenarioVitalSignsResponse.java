package com.example.demo.scenario.dto;

import com.example.demo.scenario.enums.AVPUScale;

public record ScenarioVitalSignsResponse(
        Integer heartRate,
        Integer systolicBp,
        Integer diastolicBp,
        Integer respiratoryRate,
        Integer spo2,
        AVPUScale consciousnessLevel,
        String skinCondition,
        Integer painLevel
) {
}