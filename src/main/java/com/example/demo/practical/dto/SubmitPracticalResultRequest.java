package com.example.demo.practical.dto;

import java.util.List;

public record SubmitPracticalResultRequest(
        Long skillId,
        Long cadetId,
        Long instructorId,
        List<StepEvaluationRequest> steps,
        String comment
) {}