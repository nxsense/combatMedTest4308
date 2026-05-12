package com.example.demo.scenario.generator;

import com.example.demo.scenario.dto.ScenarioInjuryRequest;
import com.example.demo.scenario.entity.ScenarioVitalSigns;
import com.example.demo.scenario.enums.DifficultyLevel;
import com.example.demo.scenario.enums.InjurySeverity;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.example.demo.scenario.generator.VitalSignsConstants.*;

@Component
public class VitalSignsGenerator {

    public ScenarioVitalSigns generate(
            List<ScenarioInjuryRequest> injuries,
            DifficultyLevel difficultyLevel
    ) {

        int hr = BASE_HEART_RATE;
        int sys = BASE_SYSTOLIC_BP;
        int dia = BASE_DIASTOLIC_BP;
        int rr = BASE_RESPIRATORY_RATE;
        int spo2 = BASE_SPO2;
        int pain = BASE_PAIN_LEVEL;

        double multiplier = difficultyMultiplier(difficultyLevel);

        for (ScenarioInjuryRequest injury : injuries) {

            VitalImpact impact = impactOf(injury.severity());

            hr += Math.round(
                    impact.heartRateDelta() * (float) multiplier
            );

            sys += Math.round(
                    impact.systolicBpDelta() * (float) multiplier
            );

            dia += Math.round(
                    impact.diastolicBpDelta() * (float) multiplier
            );

            rr += Math.round(
                    impact.respiratoryRateDelta() * (float) multiplier
            );

            spo2 += Math.round(
                    impact.spo2Delta() * (float) multiplier
            );

            pain += Math.round(
                    impact.painDelta() * (float) multiplier
            );

            if (Boolean.TRUE.equals(injury.activeBleeding())) {

                hr += Math.round(
                        BLEEDING_HR_DELTA * (float) multiplier
                );

                sys += Math.round(
                        BLEEDING_SYS_DELTA * (float) multiplier
                );

                dia += Math.round(
                        BLEEDING_DIA_DELTA * (float) multiplier
                );

                pain += BLEEDING_PAIN_DELTA;
            }

            if (Boolean.TRUE.equals(injury.airwayCompromised())) {

                rr += Math.round(
                        AIRWAY_RR_DELTA * (float) multiplier
                );

                spo2 += Math.round(
                        AIRWAY_SPO2_DELTA * (float) multiplier
                );
            }

            if (Boolean.TRUE.equals(injury.breathingCompromised())) {

                rr += Math.round(
                        BREATHING_RR_DELTA * (float) multiplier
                );

                spo2 += Math.round(
                        BREATHING_SPO2_DELTA * (float) multiplier
                );
            }
        }

        hr = clamp(
                hr,
                MIN_HEART_RATE,
                MAX_HEART_RATE
        );

        sys = clamp(
                sys,
                MIN_SYSTOLIC_BP,
                MAX_SYSTOLIC_BP
        );

        dia = clamp(
                dia,
                MIN_DIASTOLIC_BP,
                MAX_DIASTOLIC_BP
        );

        rr = clamp(
                rr,
                MIN_RESPIRATORY_RATE,
                MAX_RESPIRATORY_RATE
        );

        spo2 = clamp(
                spo2,
                MIN_SPO2,
                MAX_SPO2
        );

        pain = clamp(
                pain,
                MIN_PAIN_LEVEL,
                MAX_PAIN_LEVEL
        );

        return ScenarioVitalSigns.builder()
                .heartRate(hr)
                .systolicBp(sys)
                .diastolicBp(dia)
                .respiratoryRate(rr)
                .spo2(spo2)
                .painLevel(pain)
                .consciousnessLevel(
                        consciousnessLevel(sys, spo2, hr)
                )
                .skinCondition(
                        skinCondition(sys, injuries)
                )
                .build();
    }

    private VitalImpact impactOf(InjurySeverity severity) {

        return switch (severity) {

            case MILD -> new VitalImpact(
                    5,
                    0,
                    0,
                    1,
                    0,
                    2
            );

            case MODERATE -> new VitalImpact(
                    15,
                    -5,
                    -3,
                    3,
                    -1,
                    5
            );

            case SEVERE -> new VitalImpact(
                    25,
                    -15,
                    -8,
                    5,
                    -3,
                    7
            );

            case CRITICAL -> new VitalImpact(
                    35,
                    -30,
                    -15,
                    8,
                    -6,
                    9
            );
        };
    }

    private double difficultyMultiplier(
            DifficultyLevel difficultyLevel
    ) {

        return switch (difficultyLevel) {

            case EASY -> 0.7;
            case MEDIUM -> 1.0;
            case HARD -> 1.25;
        };
    }

    private int clamp(int value, int min, int max) {

        return Math.max(
                min,
                Math.min(value, max)
        );
    }

    private String consciousnessLevel(
            int systolicBp,
            int spo2,
            int heartRate
    ) {

        if (
                systolicBp < CRITICAL_SYS_BP
                        || spo2 < CRITICAL_SPO2
        ) {

            return "Порушена свідомість";
        }

        if (
                systolicBp < WARNING_SYS_BP
                        || spo2 < WARNING_SPO2
                        || heartRate > WARNING_HR
        ) {

            return "Сплутана свідомість";
        }

        return "При свідомості";
    }

    private String skinCondition(
            int systolicBp,
            List<ScenarioInjuryRequest> injuries
    ) {

        boolean hasBleeding = injuries.stream()
                .anyMatch(
                        injury ->
                                Boolean.TRUE.equals(
                                        injury.activeBleeding()
                                )
                );

        if (
                hasBleeding
                        || systolicBp < WARNING_SYS_BP
        ) {

            return "Бліда, холодна шкіра";
        }

        return "Без критичних змін";
    }
}