package com.example.demo.scenario.service;

import com.example.demo.scenario.entity.Manipulation;
import com.example.demo.scenario.entity.ScenarioSession;
import com.example.demo.scenario.entity.ScenarioVitalSigns;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ScenarioPhysiologyEngine {

    public void applyManipulationEffects(
            ScenarioSession session,
            Manipulation manipulation,
            boolean correct
    ) {

        if (!correct) {
            worsenPhysiology(session);
            return;
        }

        ScenarioVitalSigns vitals =
                session.getScenario().getVitalSigns();

        if (vitals == null) {
            return;
        }

        String code = manipulation.getCode();

        switch (code) {

            case "TOURNIQUET" -> applyTourniquet(vitals);

            case "CHEST_SEAL" -> applyChestSeal(vitals);

            case "NEEDLE_DECOMPRESSION" -> applyNeedleDecompression(vitals);

            case "NPA" -> applyNpa(vitals);

            case "HYPOTHERMIA_PREVENTION" -> applyHypothermia(vitals);

            default -> log.info("No physiology effect for manipulation {}", code);
        }
    }

    private void applyTourniquet(ScenarioVitalSigns vitals) {

        vitals.setHeartRate(
                Math.max(90, vitals.getHeartRate() - 20)
        );

        vitals.setSystolicBp(
                Math.min(110, vitals.getSystolicBp() + 15)
        );
    }

    private void applyChestSeal(ScenarioVitalSigns vitals) {

        vitals.setSpo2(
                Math.min(98, vitals.getSpo2() + 8)
        );

        vitals.setRespiratoryRate(
                Math.max(18, vitals.getRespiratoryRate() - 6)
        );
    }

    private void applyNeedleDecompression(ScenarioVitalSigns vitals) {

        vitals.setSpo2(
                Math.min(99, vitals.getSpo2() + 15)
        );

        vitals.setRespiratoryRate(
                Math.max(16, vitals.getRespiratoryRate() - 10)
        );

        vitals.setHeartRate(
                Math.max(90, vitals.getHeartRate() - 15)
        );
    }

    private void applyNpa(ScenarioVitalSigns vitals) {

        if (vitals.getSpo2() != null) {
            vitals.setSpo2(
                    Math.min(99, vitals.getSpo2() + 4)
            );
        }
    }

    private void applyHypothermia(ScenarioVitalSigns vitals) {

        vitals.setHeartRate(
                Math.max(80, vitals.getHeartRate() - 5)
        );
    }

    private void worsenPhysiology(
            ScenarioSession session
    ) {

        ScenarioVitalSigns vitals =
                session.getScenario().getVitalSigns();

        if (vitals == null) {
            return;
        }

        vitals.setHeartRate(
                Math.min(180, vitals.getHeartRate() + 10)
        );

        vitals.setSystolicBp(
                Math.max(50, vitals.getSystolicBp() - 10)
        );

        if (vitals.getSpo2() != null) {

            vitals.setSpo2(
                    Math.max(60, vitals.getSpo2() - 5)
            );
        }
    }
}