package com.example.demo.scenario.generator;

import com.example.demo.scenario.entity.ScenarioInjury;
import com.example.demo.scenario.entity.ScenarioVitalSigns;
import com.example.demo.scenario.enums.InjuryMechanism;
import com.example.demo.scenario.enums.InjurySeverity;
import com.example.demo.scenario.enums.MarchActionTrigger;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.Set;

@Slf4j
@Service
public class ScenarioTriggerResolver {

    public Set<MarchActionTrigger> resolve(
            Set<ScenarioInjury> injuries,
            ScenarioVitalSigns vitals
    ) {

        Set<MarchActionTrigger> triggers =
                EnumSet.of(MarchActionTrigger.ALWAYS);

        resolveInjuryTriggers(injuries, triggers);

        resolvePhysiologyTriggers(vitals, triggers);

        return triggers;
    }

    private void resolveInjuryTriggers(
            Set<ScenarioInjury> injuries,
            Set<MarchActionTrigger> triggers
    ) {

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

            if (injury.getMechanism() == InjuryMechanism.AMPUTATION) {
                triggers.add(MarchActionTrigger.AMPUTATION_CARE_REQUIRED);
            }

            if (injury.getSeverity() == InjurySeverity.SEVERE
                    || injury.getSeverity() == InjurySeverity.CRITICAL) {

                triggers.add(MarchActionTrigger.WOUND_CARE_REQUIRED);

                triggers.add(MarchActionTrigger.PAIN_MANAGEMENT_REQUIRED);
            }
            if (injury.getMechanism() == InjuryMechanism.BLAST_INJURY
                    || injury.getMechanism() == InjuryMechanism.PENETRATING_TRAUMA
                    || injury.getMechanism() == InjuryMechanism.GUNSHOT_WOUND
                    || injury.getMechanism() == InjuryMechanism.AMPUTATION) {

                triggers.add(MarchActionTrigger.ANTIBIOTICS_REQUIRED);
            }
        }
    }

    private void resolvePhysiologyTriggers(
            ScenarioVitalSigns vitals,
            Set<MarchActionTrigger> triggers
    ) {

        if (vitals == null) {
            return;
        }

        boolean shock =
                vitals.getHeartRate() >= 120
                        &&
                        vitals.getSystolicBp() <= 90;

        if (shock) {

            triggers.add(MarchActionTrigger.SHOCK_SIGNS);

            triggers.add(MarchActionTrigger.PAIN_IV_IO_ROUTE);

            triggers.add(MarchActionTrigger.ANTIBIOTICS_PARENTERAL_ROUTE);
        }

        boolean severeHypoxia =
                vitals.getSpo2() != null
                        &&
                        vitals.getSpo2() < 92;

        if (severeHypoxia) {
            triggers.add(MarchActionTrigger.BREATHING_COMPROMISED);
        }
    }
}