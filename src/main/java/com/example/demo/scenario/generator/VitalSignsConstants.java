package com.example.demo.scenario.generator;

public final class VitalSignsConstants {

    private VitalSignsConstants() {
    }

    // BASELINE

    public static final int BASE_HEART_RATE = 80;
    public static final int BASE_SYSTOLIC_BP = 120;
    public static final int BASE_DIASTOLIC_BP = 80;
    public static final int BASE_RESPIRATORY_RATE = 16;
    public static final int BASE_SPO2 = 98;
    public static final int BASE_PAIN_LEVEL = 0;

    // CLAMP RANGES

    public static final int MIN_HEART_RATE = 50;
    public static final int MAX_HEART_RATE = 170;

    public static final int MIN_SYSTOLIC_BP = 60;
    public static final int MAX_SYSTOLIC_BP = 180;

    public static final int MIN_DIASTOLIC_BP = 35;
    public static final int MAX_DIASTOLIC_BP = 110;

    public static final int MIN_RESPIRATORY_RATE = 8;
    public static final int MAX_RESPIRATORY_RATE = 40;

    public static final int MIN_SPO2 = 70;
    public static final int MAX_SPO2 = 100;

    public static final int MIN_PAIN_LEVEL = 0;
    public static final int MAX_PAIN_LEVEL = 10;

    // ACTIVE BLEEDING IMPACT

    public static final int BLEEDING_HR_DELTA = 20;
    public static final int BLEEDING_SYS_DELTA = -20;
    public static final int BLEEDING_DIA_DELTA = -10;
    public static final int BLEEDING_PAIN_DELTA = 2;

    // AIRWAY IMPACT

    public static final int AIRWAY_RR_DELTA = 8;
    public static final int AIRWAY_SPO2_DELTA = -10;

    // BREATHING IMPACT

    public static final int BREATHING_RR_DELTA = 6;
    public static final int BREATHING_SPO2_DELTA = -8;

    // CONSCIOUSNESS THRESHOLDS

    public static final int CRITICAL_SYS_BP = 80;
    public static final int CRITICAL_SPO2 = 85;

    public static final int WARNING_SYS_BP = 95;
    public static final int WARNING_SPO2 = 92;
    public static final int WARNING_HR = 125;
}