package com.example.demo.scenario.dto;

public record ScenarioVitalSignsResponse(
        Integer heartRate,
        Integer systolicBp,
        Integer diastolicBp,
        Integer respiratoryRate,
        Integer spo2,
        String consciousnessLevel,
        String skinCondition,
        Integer painLevel
) {
}