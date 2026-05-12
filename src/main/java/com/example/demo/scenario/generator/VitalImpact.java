package com.example.demo.scenario.generator;

public record VitalImpact(
        int heartRateDelta,
        int systolicBpDelta,
        int diastolicBpDelta,
        int respiratoryRateDelta,
        int spo2Delta,
        int painDelta
) {
}